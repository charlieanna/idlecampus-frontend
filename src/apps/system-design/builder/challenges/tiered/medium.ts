/**
 * Generated Tiered Challenge: Medium - Blogging Platform
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const mediumChallenge: Challenge = {
  id: 'medium',
  title: 'Medium - Blogging Platform',
  difficulty: 'beginner',
  description: `Design a blogging platform like Medium that:
- Users can write and publish articles
- Users can follow authors and topics
- Users can clap (like) and comment on articles
- Articles are ranked by popularity and engagement

Learning Objectives (DDIA Ch. 3):
1. Implement full-text search with Elasticsearch (DDIA Ch. 3)
   - Use BM25 ranking for article relevance
   - Text analysis: tokenization, stemming, synonyms
2. Design secondary indexes for filtering (DDIA Ch. 3)
   - Index on (author_id, published_at) for chronological feed
3. Optimize read-heavy workload (DDIA Ch. 3)
   - Denormalize clap count on articles table
4. Handle long-form content search (DDIA Ch. 3)
   - BM25 handles document length better than TF-IDF`,
  
  requirements: {
  functional: [
    "Users can write and publish articles",
    "Users can follow authors and topics",
    "Users can clap (like) and comment on articles",
    "Articles are ranked by popularity and engagement"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Search latency: p99 < 400ms (DDIA Ch. 3: Elasticsearch with BM25)",
    "Article ranking: BM25 for long-form content (DDIA Ch. 3)",
    "Feed generation: < 200ms (DDIA Ch. 3: Secondary index on author_id)",
    "Trending articles: < 100ms (SDP: Redis cache with TTL)"
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
      "name": "Users can write and publish articles",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can write and publish articles\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can follow authors and topics",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can follow authors and topics\" works correctly.",
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
      "name": "Users can clap (like) and comment on articles",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can clap (like) and comment on articles\" works correctly.",
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
      "name": "Articles are ranked by popularity and engagement",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Articles are ranked by popularity and engagement\" works correctly.",
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
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
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
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 450,
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
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
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
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 750,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 760 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 600ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
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
        "rps": 800,
        "readRatio": 0.95
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
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 900,
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
    "label": "Medium Engineering Blog",
    "url": "https://medium.engineering/"
  },
  {
    "label": "Official Site",
    "url": "https://medium.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
articles = {}
claps = {}
comments = {}
follows = {}

def write_article(article_id: str, author_id: str, title: str, content: str,
                  tags: List[str] = None) -> Dict:
    """
    FR-1: Users can write articles
    Naive implementation - stores article in memory
    """
    articles[article_id] = {
        'id': article_id,
        'author_id': author_id,
        'title': title,
        'content': content,
        'tags': tags or [],
        'published_at': datetime.now(),
        'read_time': len(content) // 200  # Rough estimate: 200 words/min
    }
    return articles[article_id]

def publish_article(article_id: str) -> Dict:
    """
    FR-1: Users can publish articles
    Naive implementation - sets published status
    """
    article = articles.get(article_id)
    if not article:
        raise ValueError("Article not found")

    article['status'] = 'published'
    article['published_at'] = datetime.now()
    return article

def follow_author(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow authors
    Naive implementation - stores follow relationship
    """
    follow_id = f"{follower_id}_{following_id}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'type': 'author',
        'created_at': datetime.now()
    }
    return follows[follow_id]

def follow_topic(follower_id: str, topic: str) -> Dict:
    """
    FR-2: Users can follow topics
    Naive implementation - stores topic follow
    """
    follow_id = f"{follower_id}_topic_{topic}"
    follows[follow_id] = {
        'follower_id': follower_id,
        'topic': topic,
        'type': 'topic',
        'created_at': datetime.now()
    }
    return follows[follow_id]

def clap_article(article_id: str, user_id: str, count: int = 1) -> Dict:
    """
    FR-3: Users can clap (like) articles
    Naive implementation - stores or updates clap count
    """
    clap_id = f"{article_id}_{user_id}"
    if clap_id in claps:
        claps[clap_id]['count'] += count
    else:
        claps[clap_id] = {
            'article_id': article_id,
            'user_id': user_id,
            'count': count,
            'created_at': datetime.now()
        }
    return claps[clap_id]

def comment_on_article(comment_id: str, article_id: str, user_id: str,
                       text: str) -> Dict:
    """
    FR-3: Users can comment on articles
    Naive implementation - stores comment in memory
    """
    comments[comment_id] = {
        'id': comment_id,
        'article_id': article_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def get_article_claps(article_id: str) -> int:
    """
    Helper: Get total claps for an article
    Naive implementation - sums all claps
    """
    total = 0
    for clap in claps.values():
        if clap['article_id'] == article_id:
            total += clap['count']
    return total
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
        instances: 23,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "23 instance(s)"
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
          shards: 23,
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
  explanation: "Reference Solution for Medium - Blogging Platform (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 3 instances handling 2280 read RPS (GET requests)\n- **Write API**: 1 instance handling 120 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **11GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~2052 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 23 shards (sharded by user_id).\n  • Read Capacity: 2280 RPS across 4 database instance(s)\n  • Write Capacity: 120 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 23 database shards. Each shard contains data for subset of users (e.g., user_id % 23 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 95.0%, Write: 5.0%, Total: 2400 RPS)\n- **Read API (3 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (1 instance)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 5.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 23 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
