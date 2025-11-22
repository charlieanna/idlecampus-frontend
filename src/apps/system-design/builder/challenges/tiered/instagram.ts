/**
 * Generated Tiered Challenge: Instagram - Photo Sharing Platform
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const instagramChallenge: Challenge = {
  id: 'instagram',
  title: 'Instagram - Photo Sharing Platform',
  difficulty: 'advanced',
  description: `Design a photo sharing platform like Instagram that:
- Users can upload photos and videos
- Users can view a feed of photos from people they follow
- Users can like and comment on photos
- Users can search for other users and content

Learning Objectives (DDIA/SDP):
1. Scale read-heavy workloads with read replicas (DDIA Ch. 5)
2. Partition data by user_id for horizontal scaling (DDIA Ch. 6)
3. Use CDN for global image delivery (SDP - CDN)
4. Master all 4 caching patterns (SDP - Caching):
   - Cache-Aside: User profiles, post metadata (lazy loading)
   - Write-Through: Like counts, follower counts (strong consistency)
   - Write-Behind: View counts, analytics (eventual consistency)
   - Write-Around: New uploads (avoid cache pollution)
5. Implement cache invalidation strategies (SDP):
   - TTL-based expiration (simple, automatic)
   - Write-time invalidation (strong consistency)
   - Event-driven invalidation with CDC (decoupled)
   - Versioned keys (no explicit invalidation)
6. Prevent cache stampede with distributed locks (SDP)
7. Design multi-layer caching (CDN → Redis → DB replicas)
8. Handle eventual consistency in social feeds (DDIA Ch. 9)
9. Design for high availability with replication (DDIA Ch. 5)`,
  
  requirements: {
  functional: [
    "Users can upload photos and videos",
    "Users can view a feed of photos from people they follow",
    "Users can like and comment on photos",
    "Users can search for other users and content"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Feed latency: p99 < 200ms with cache hit (SDP: Cache-aside pattern)",
    "Cache hit ratio: > 80% for feed requests (SDP: Multi-layer caching)",
    "Cache miss latency: p99 < 500ms with stampede prevention (SDP: Distributed locks)",
    "Like count accuracy: Strong consistency (SDP: Write-through caching)",
    "View count lag: < 10s acceptable (SDP: Write-behind batching)",
    "Upload latency: p99 < 1s (SDP: Write-around + direct S3 upload)",
    "Cache invalidation lag: < 1s for profile updates (SDP: Write-time invalidation)",
    "CDN cache hit ratio: > 95% for images (SDP: Edge caching, 7-day TTL)",
    "Replication lag: < 500ms average (DDIA Ch. 5: Async replication)",
    "Availability: 99.9% uptime (DDIA Ch. 5: Multi-replica setup)",
    "Global image delivery: CDN edge latency < 100ms (SDP: CDN)",
    "Consistency: Eventual consistency acceptable for feeds (DDIA Ch. 9)",
    "Scalability: Partition by user_id to handle 100M+ users (DDIA Ch. 6)"
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
      "name": "Users can upload photos and videos",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can upload photos and videos\" works correctly. Must use object storage (S3) for files, not database. Test flow: Client → App → Database.",
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
      "name": "Users can view a feed of photos from people they f...",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can view a feed of photos from people they follow\" works correctly. Must use object storage (S3) for files, not database. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
      "traffic": {
        "type": "read",
        "rps": 100,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can like and comment on photos",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can like and comment on photos\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can search for other users and content",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Users can search for other users and content\" works correctly. Must have search index for efficient queries.",
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
        "rps": 2000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
      "description": "Traffic increases during peak hours (evening when users post photos).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 4000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
      "description": "Celebrity posts viral content causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
      "description": "App featured in App Store - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 6000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
        "rps": 2000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
      "description": "Read traffic of 1800 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
      "description": "Write traffic bursts to 400 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 400ms. Without sharding/multi-leader: writes queue up, latency exceeds 1000ms.",
      "traffic": {
        "type": "write",
        "rps": 4000,
        "readRatio": 0.3,
        "avgResponseSizeMB": 2
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
        "rps": 2000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
        "rps": 2000,
        "readRatio": 0.9,
        "avgResponseSizeMB": 2
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
  "Understand caching strategies for performance",
  "Learn blob storage for large files",
  "Understand content delivery networks",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Instagram Engineering Blog",
    "url": "https://instagram-engineering.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.instagram.com/"
  },
  {
    "label": "System Design: Instagram",
    "url": "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-instagram"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# ===========================================
# 📦 STORAGE API (PROVIDED)
# ===========================================
# In-memory storage (simulates production database/cache)
storage = {}

def store(key: str, value: Any) -> bool:
    """Store a key-value pair in memory."""
    storage[key] = value
    return True

def retrieve(key: str) -> Optional[Any]:
    """Retrieve a value by key."""
    return storage.get(key)

def exists(key: str) -> bool:
    """Check if a key exists in storage."""
    return key in storage

# ===========================================
# 🚀 YOUR IMPLEMENTATION
# ===========================================

def upload_photo(post_id: str, user_id: str, image_url: str, caption: str = "") -> Dict:
    """
    FR-1: Users can upload photos and videos
    Store post metadata using the storage API
    """
    post = {
        'id': post_id,
        'user_id': user_id,
        'image_url': image_url,
        'caption': caption,
        'created_at': datetime.now()
    }
    store(f"post:{post_id}", post)

    # Add to user's posts list
    user_posts_key = f"user_posts:{user_id}"
    user_posts = retrieve(user_posts_key) or []
    user_posts.append(post_id)
    store(user_posts_key, user_posts)

    return post

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow other users (helper for feed)
    Store follow relationship using the storage API
    """
    follow_key = f"follow:{follower_id}:{following_id}"
    follow = {
        'follower_id': follower_id,
        'following_id': following_id,
        'created_at': datetime.now()
    }
    store(follow_key, follow)

    # Update follower's following list
    following_key = f"following:{follower_id}"
    following_list = retrieve(following_key) or []
    if following_id not in following_list:
        following_list.append(following_id)
        store(following_key, following_list)

    return follow

def get_feed(user_id: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Users can view a feed of photos from people they follow
    Returns posts from followed users, sorted by recency
    """
    # Get list of users this user follows
    following_key = f"following:{user_id}"
    following = retrieve(following_key) or []

    # Collect all posts from followed users
    feed = []
    for followed_user_id in following:
        user_posts_key = f"user_posts:{followed_user_id}"
        post_ids = retrieve(user_posts_key) or []
        for post_id in post_ids:
            post = retrieve(f"post:{post_id}")
            if post:
                feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]

def like_photo(post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can like photos
    Store like using the storage API
    """
    like_key = f"like:{post_id}:{user_id}"
    like = {
        'post_id': post_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    store(like_key, like)

    # Update post's likes count
    likes_count_key = f"likes_count:{post_id}"
    count = retrieve(likes_count_key) or 0
    store(likes_count_key, count + 1)

    return like

def comment_on_photo(comment_id: str, post_id: str, user_id: str, text: str) -> Dict:
    """
    FR-3: Users can comment on photos
    Store comment using the storage API
    """
    comment = {
        'id': comment_id,
        'post_id': post_id,
        'user_id': user_id,
        'text': text,
        'created_at': datetime.now()
    }
    store(f"comment:{comment_id}", comment)

    # Add comment to post's comment list
    post_comments_key = f"post_comments:{post_id}"
    comments_list = retrieve(post_comments_key) or []
    comments_list.append(comment_id)
    store(post_comments_key, comments_list)

    return comment

def search_users(query: str) -> List[Dict]:
    """
    FR-4: Users can search for other users
    Search through stored users by username
    """
    results = []
    # In production, this would use a search index
    # For now, iterate through all user keys
    for key in storage.keys():
        if key.startswith("user:"):
            user = retrieve(key)
            if user and query.lower() in user.get('username', '').lower():
                results.append(user)
    return results

def search_content(query: str) -> List[Dict]:
    """
    FR-4: Users can search for content
    Search through stored posts by caption
    """
    results = []
    # In production, this would use a search index
    # For now, iterate through all post keys
    for key in storage.keys():
        if key.startswith("post:"):
            post = retrieve(key)
            if post and query.lower() in post.get('caption', '').lower():
                results.append(post)
    return results
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
        instances: 11,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "11 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 6,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "6 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 21,
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
          shards: 105,
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
  explanation: "Reference Solution for Instagram - Photo Sharing Platform (Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 7 instances handling 5400 read RPS (GET requests)\n- **Write API**: 4 instances handling 2800 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **21GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~4860 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 105 shards (sharded by user_id).\n  • Read Capacity: 5400 RPS across 4 database instance(s)\n  • Write Capacity: 2800 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 105 database shards. Each shard contains data for subset of users (e.g., user_id % 105 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 90.0%, Write: 10.0%, Total: 6000 RPS)\n- **Read API (7 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (4 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 10.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 105 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
