/**
 * Generated Tiered Challenge: Reddit - Discussion Forum
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const redditChallenge: Challenge = {
  id: 'reddit',
  title: 'Reddit - Discussion Forum',
  difficulty: 'beginner',
  description: `Design a discussion forum like Reddit that:
- Users can create posts in different subreddits
- Users can comment on posts (nested comments)
- Users can upvote and downvote posts and comments
- Posts are ranked by votes and recency

Learning Objectives (DDIA Ch. 3 + SDP Rate Limiting):
1. Design secondary indexes for sorting/ranking (DDIA Ch. 3)
   - Composite index: (subreddit_id, score DESC, created_at DESC)
   - Covering index to avoid extra lookups
2. Implement custom ranking algorithms (DDIA Ch. 3)
   - Reddit's "Hot" algorithm: balance votes and time decay
3. Model nested comments with adjacency list (DDIA Ch. 2)
   - Recursive queries for comment trees
4. Optimize read-heavy workload with denormalization (DDIA Ch. 3)
   - Cache comment_count, score on posts table
5. Master all 5 rate limiting algorithms (SDP):
   - Token bucket: Allow bursts (comment posting)
   - Leaky bucket: Strict constant rate (vote processing)
   - Fixed window counter: Simple, fast (API keys)
   - Sliding window log: Exact accuracy (subreddit creation)
   - Sliding window counter: Hybrid approach (post submissions)
6. Implement distributed rate limiting with Redis (SDP):
   - Centralized state for multi-server setup
   - Atomic operations with Lua scripts
7. Design per-user, per-IP, per-API-key limits (SDP)
8. Understand rate limiting trade-offs (SDP):
   - Accuracy vs performance vs memory
   - Boundary problems in fixed windows
   - Burst allowance vs strict rate enforcement`,
  
  requirements: {
  functional: [
    "Users can create posts in different subreddits",
    "Users can comment on posts (nested comments)",
    "Users can upvote and downvote posts and comments",
    "Posts are ranked by votes and recency"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Feed latency: p99 < 200ms for \"Hot\" feed (DDIA Ch. 3: Composite index)",
    "Sorting performance: Index scan, not table scan (DDIA Ch. 3: Secondary index)",
    "Comment tree query: < 100ms for 500 comments (DDIA Ch. 2: Adjacency list)",
    "Vote update: < 50ms with denormalized score (DDIA Ch. 3)",
    "Partitioning: Partition by subreddit for data locality (DDIA Ch. 6)",
    "Post submission: 5 per hour with token bucket (SDP: Allow bursts)",
    "Comment posting: 10 per minute with leaky bucket (SDP: Smooth rate)",
    "Voting: 1000 per hour with fixed window (SDP: Performance over accuracy)",
    "Subreddit creation: 1 per day with sliding window log (SDP: Exact enforcement)",
    "API access: 100 req/hour free tier (SDP: Tiered limits)",
    "Rate limit check latency: < 5ms with Redis (SDP: Distributed limiting)",
    "Rate limit accuracy: 99.9% with Lua scripts (SDP: Atomic operations)",
    "Burst handling: 10x normal rate for 10 seconds (SDP: Token bucket capacity)"
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
      "name": "Users can create posts in different subreddits",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can create posts in different subreddits\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can comment on posts (nested comments)",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can comment on posts (nested comments)\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can upvote and downvote posts and comments",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can upvote and downvote posts and comments\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Posts are ranked by votes and recency",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Posts are ranked by votes and recency\" works correctly. Test flow: Client → App → Database.",
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
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 1500,
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
      "description": "Traffic increases during peak hours (popular thread goes viral).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 3000,
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
      "description": "AMA with famous person causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 2250,
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
      "description": "Reddit hug of death from front page - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 4500,
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
        "rps": 1500,
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
      "description": "Read traffic of 1350 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.9
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
      "description": "Write traffic bursts to 300 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 400ms. Without sharding/multi-leader: writes queue up, latency exceeds 1000ms.",
      "traffic": {
        "type": "write",
        "rps": 3000,
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
        "rps": 1500,
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
    },
    {
      "name": "NFR-R2: Cache Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Cache (Redis) fails at 20s. System must continue operating by hitting database directly.\nPerformance degrades but system stays up. Tests graceful degradation.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.9
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
    "label": "Reddit Blog",
    "url": "https://www.redditinc.com/blog"
  },
  {
    "label": "Official Site",
    "url": "https://www.reddit.com/"
  },
  {
    "label": "Reddit Architecture",
    "url": "https://github.com/reddit-archive/reddit/wiki/Architecture"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
subreddits = {}
posts = {}
comments = {}
votes = {}

def create_post(post_id: str, subreddit_id: str, user_id: str, title: str, content: str) -> Dict:
    """
    FR-1: Users can create posts in different subreddits
    Naive implementation - stores post in memory
    """
    posts[post_id] = {
        'id': post_id,
        'subreddit_id': subreddit_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'score': 0,
        'created_at': datetime.now()
    }
    return posts[post_id]

def create_comment(comment_id: str, post_id: str, user_id: str, text: str, parent_comment_id: Optional[str] = None) -> Dict:
    """
    FR-2: Users can comment on posts (nested comments)
    Naive implementation - stores comment with optional parent
    """
    comments[comment_id] = {
        'id': comment_id,
        'post_id': post_id,
        'parent_comment_id': parent_comment_id,
        'user_id': user_id,
        'text': text,
        'score': 0,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def upvote_post(vote_id: str, post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can upvote posts
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': post_id,
        'target_type': 'post',
        'user_id': user_id,
        'value': 1,  # +1 for upvote
        'created_at': datetime.now()
    }

    # Update post score
    if post_id in posts:
        posts[post_id]['score'] += 1

    return votes[vote_id]

def downvote_post(vote_id: str, post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can downvote posts
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': post_id,
        'target_type': 'post',
        'user_id': user_id,
        'value': -1,  # -1 for downvote
        'created_at': datetime.now()
    }

    # Update post score
    if post_id in posts:
        posts[post_id]['score'] -= 1

    return votes[vote_id]

def upvote_comment(vote_id: str, comment_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can upvote comments
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': comment_id,
        'target_type': 'comment',
        'user_id': user_id,
        'value': 1,
        'created_at': datetime.now()
    }

    # Update comment score
    if comment_id in comments:
        comments[comment_id]['score'] += 1

    return votes[vote_id]

def downvote_comment(vote_id: str, comment_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can downvote comments
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': comment_id,
        'target_type': 'comment',
        'user_id': user_id,
        'value': -1,
        'created_at': datetime.now()
    }

    # Update comment score
    if comment_id in comments:
        comments[comment_id]['score'] -= 1

    return votes[vote_id]

def get_subreddit_feed(subreddit_id: str, sort_by: str = "hot") -> List[Dict]:
    """
    Helper: Get posts from a subreddit
    Naive implementation - simple sorting by score or time
    Real Reddit uses complex ranking algorithms
    """
    subreddit_posts = []
    for post in posts.values():
        if post['subreddit_id'] == subreddit_id:
            subreddit_posts.append(post)

    # Sort by score (hot) or time (new)
    if sort_by == "hot":
        subreddit_posts.sort(key=lambda x: x['score'], reverse=True)
    else:  # new
        subreddit_posts.sort(key=lambda x: x['created_at'], reverse=True)

    return subreddit_posts
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
        instances: 9,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "9 instance(s)"
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
        sizeGB: 17,
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
  explanation: "Reference Solution for Reddit - Discussion Forum (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 5 instances handling 4050 read RPS (GET requests)\n- **Write API**: 3 instances handling 2100 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **17GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3645 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 79 shards (sharded by user_id).\n  • Read Capacity: 4050 RPS across 4 database instance(s)\n  • Write Capacity: 2100 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 79 database shards. Each shard contains data for subset of users (e.g., user_id % 79 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 90.0%, Write: 10.0%, Total: 4500 RPS)\n- **Read API (5 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (3 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 10.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 79 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
