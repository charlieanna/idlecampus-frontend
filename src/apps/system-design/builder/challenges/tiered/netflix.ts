/**
 * Generated Tiered Challenge: Netflix - Video Streaming
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const netflixChallenge: Challenge = {
  id: 'netflix',
  title: 'Netflix - Video Streaming',
  difficulty: 'advanced',
  description: `Design a video streaming platform like Netflix that:
- Users can browse movies and TV shows
- Users can stream videos on-demand
- Platform recommends content based on viewing history
- Videos are available in multiple qualities (SD, HD, 4K)

Learning Objectives (DDIA Ch. 8, 11):
1. Handle CDN edge failures with circuit breaker pattern (DDIA Ch. 8)
   - Detect edge server down, failover to backup edge < 100ms
   - Circuit breaker states: CLOSED → OPEN → HALF_OPEN
2. Design network partition tolerance for origin-edge (DDIA Ch. 8)
   - Serve stale catalog during partition (bounded staleness < 5 min)
   - Trade-off: Availability over consistency
3. Implement graceful degradation under high load (DDIA Ch. 8)
   - Level 1: Full quality → Level 2: Adaptive bitrate → Level 3: Read-only
4. Handle partial failures in watch history sync (DDIA Ch. 8)
   - Async replication across devices with eventual consistency
   - Last-write-wins conflict resolution
5. Coordinate distributed video encoding jobs (DDIA Ch. 8)
   - Leader-worker pattern, reassign failed chunks
6. Implement real-time analytics with stream processing (DDIA Ch. 11)
   - Windowed aggregations for quality monitoring (tumbling windows)
   - Sliding windows for concurrent viewer tracking
   - Session windows for binge-watching detection
7. Design stream-table joins for personalization (DDIA Ch. 11)
   - Join playback events with user profiles (CDC from database)
   - Enrich events with contextual data
8. Build real-time A/B test analytics (DDIA Ch. 11)
   - Compare control vs treatment groups in real-time
   - Windowed metrics: CTR, watch time, completion rate
9. Ensure exactly-once semantics for view counts (DDIA Ch. 11)
   - Idempotent processing with deduplication
   - Kafka transactions for atomic operations`,
  
  requirements: {
  functional: [
    "Users can browse movies and TV shows",
    "Users can stream videos on-demand"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Edge failover: < 100ms to backup edge (DDIA Ch. 8: Circuit breaker)",
    "Network partition tolerance: Serve stale catalog (DDIA Ch. 8: Bounded staleness < 5 min)",
    "Circuit breaker: Detect edge failure in 10s (DDIA Ch. 8: >50% error rate)",
    "Graceful degradation: 3 levels under load (DDIA Ch. 8: Quality → Adaptive → Read-only)",
    "Watch history sync: Eventually consistent (DDIA Ch. 8: Last-write-wins)",
    "Partial failure handling: Retry with backoff (DDIA Ch. 8: Exponential backoff)",
    "Clock synchronization: ±50ms across edges (DDIA Ch. 8: NTP)",
    "Encoding job recovery: Reassign failed chunks (DDIA Ch. 8: Idempotent workers)",
    "Availability during partition: > 99.9% (DDIA Ch. 8: Favor availability over consistency)",
    "Analytics latency: < 5s end-to-end (DDIA Ch. 11: Real-time stream processing)",
    "Quality monitoring window: 1-minute tumbling (DDIA Ch. 11: Windowed aggregations)",
    "Popularity tracking: 5-minute sliding window (DDIA Ch. 11: Sliding windows)",
    "Binge detection: 30-minute session gap (DDIA Ch. 11: Session windows)",
    "Stream-table join: < 100ms (DDIA Ch. 11: KTable lookups)",
    "A/B test metrics: Real-time 5-minute windows (DDIA Ch. 11: Windowed aggregations)",
    "Exactly-once view counts: 100% accuracy (DDIA Ch. 11: Kafka transactions + deduplication)",
    "Event throughput: 1M playback events/second (DDIA Ch. 11: Scalable stream processing)",
    "CDC latency: < 1s for catalog updates (DDIA Ch. 11: Change data capture)"
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
      "name": "Users can browse movies and TV shows",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can browse movies and TV shows\" works correctly.",
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
      "name": "Users can stream videos on-demand",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can stream videos on-demand\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 100
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
        "rps": 3000,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-P2: Peak Hour Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Traffic increases during peak hours (8pm prime time).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 6000,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 750,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S1: Traffic Spike",
      "type": "functional",
      "requirement": "FR-1",
      "description": "New season of popular show releases causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 4500,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1000,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-S2: Viral Growth",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Word-of-mouth drives massive signups - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 9000,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1250,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 500ms even during write bursts. Without CQRS: read latency spikes to 1500ms+.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 2940 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 3 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 1000ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 4500,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
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
        "rps": 3000,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
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
        "rps": 3000,
        "readRatio": 0.98,
        "avgResponseSizeMB": 100
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1500,
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
  "Learn blob storage for large files",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Netflix Tech Blog",
    "url": "https://netflixtechblog.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.netflix.com/"
  },
  {
    "label": "System Design: Netflix",
    "url": "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-netflix"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
videos = {}
watch_history = {}
subscriptions = {}

def browse_catalog(category: str = None, limit: int = 20) -> List[Dict]:
    """
    FR-1: Users can browse movies and TV shows
    Naive implementation - returns all videos, optionally filtered by category
    No personalization or ranking
    """
    catalog = []
    for video in videos.values():
        if category is None or video.get('category') == category:
            catalog.append(video)

    # Sort by created_at (newest first)
    catalog.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
    return catalog[:limit]

def search_content(query: str) -> List[Dict]:
    """
    FR-1: Users can search for content
    Naive implementation - simple substring match on title
    """
    results = []
    for video in videos.values():
        if query.lower() in video.get('title', '').lower():
            results.append(video)
    return results

def stream_video(video_id: str, user_id: str, quality: str = "HD") -> Dict:
    """
    FR-2: Users can stream videos on-demand
    Naive implementation - returns video URL and records in watch history
    No actual streaming logic or quality adaptation
    """
    if video_id not in videos:
        return None

    video = videos[video_id]

    # Record watch history
    history_id = f"{user_id}_{video_id}_{datetime.now().timestamp()}"
    watch_history[history_id] = {
        'user_id': user_id,
        'video_id': video_id,
        'progress': 0,
        'quality': quality,
        'watched_at': datetime.now()
    }

    return {
        'video_id': video_id,
        'video_url': video['video_url'],
        'quality': quality,
        'title': video['title']
    }

def update_watch_progress(user_id: str, video_id: str, progress: int) -> Dict:
    """
    Helper: Update watch progress
    Naive implementation - updates most recent watch history entry
    """
    # Find most recent watch history entry for this user/video
    for history_id in reversed(list(watch_history.keys())):
        history = watch_history[history_id]
        if history['user_id'] == user_id and history['video_id'] == video_id:
            history['progress'] = progress
            return history

    return None

def get_watch_history(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get user's watch history
    Naive implementation - returns recent watch history
    """
    user_history = []
    for history in watch_history.values():
        if history['user_id'] == user_id:
            user_history.append(history)

    # Sort by watched_at (most recent first)
    user_history.sort(key=lambda x: x['watched_at'], reverse=True)
    return user_history[:limit]

def get_recommendations(user_id: str, limit: int = 10) -> List[Dict]:
    """
    Helper: Get recommended content (mentioned in description)
    Naive implementation - returns random videos, no actual ML
    In real system, this would use viewing history and ML models
    """
    return list(videos.values())[:limit]
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
        instances: 89,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "89 instance(s)"
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
        sizeGB: 31,
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
          shards: 34,
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
  explanation: "Reference Solution for Netflix - Video Streaming (Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 11 instances handling 8820 read RPS (GET requests)\n- **Write API**: 1 instance handling 180 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **31GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~7938 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 34 shards (sharded by user_id).\n  • Read Capacity: 8820 RPS across 4 database instance(s)\n  • Write Capacity: 180 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 34 database shards. Each shard contains data for subset of users (e.g., user_id % 34 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 98.0%, Write: 2.0%, Total: 9000 RPS)\n- **Read API (11 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (1 instance)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 2.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 34 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
