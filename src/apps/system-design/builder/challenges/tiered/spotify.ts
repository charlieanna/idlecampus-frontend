/**
 * Generated Tiered Challenge: Spotify - Music Streaming
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const spotifyChallenge: Challenge = {
  id: 'spotify',
  title: 'Spotify - Music Streaming',
  difficulty: 'beginner',
  description: `Design a music streaming platform like Spotify that:
- Users can search and play songs
- Users can create and share playlists
- Platform recommends music based on listening history
- Users can follow artists and other users

Learning Objectives (DDIA Ch. 10):
1. Implement MapReduce for collaborative filtering recommendations (DDIA Ch. 10)
   - Batch process billions of listening events for "Discover Weekly"
   - Item-based CF: "Users who liked X also liked Y"
   - Generate co-occurrence matrix and similarity scores
2. Design join algorithms for data enrichment (DDIA Ch. 10)
   - Sort-merge join: listening events + song metadata
   - Broadcast join: Small dimension tables in memory
   - Partition join: Co-partition by user_id for efficiency
3. Build batch analytics pipeline for trending songs (DDIA Ch. 10)
   - MapReduce: Count plays per song/artist/genre (last 24 hours)
   - Incremental batch: Process only new partitions
   - Combiners: Reduce shuffle network I/O
4. Orchestrate batch workflows with Airflow (DDIA Ch. 10)
   - DAG: Events → Features → CF Model → Recommendations
   - Retry logic with exponential backoff
   - Dependency management between tasks
5. Design data warehouse for OLAP analytics (DDIA Ch. 10)
   - Star schema: fact_plays + dimensions (users, songs, time, location)
   - Materialized views for dashboard performance
   - Roll-up queries: Daily → Weekly → Monthly aggregates`,
  
  requirements: {
  functional: [
    "Users can search and play songs",
    "Users can create and share playlists",
    "Users can follow artists and other users"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Batch recommendations: Process 100M users overnight (DDIA Ch. 10: MapReduce collaborative filtering)",
    "Join throughput: 10TB/hour for event enrichment (DDIA Ch. 10: Sort-merge join + broadcast join)",
    "Analytics latency: Daily top charts in < 1 hour (DDIA Ch. 10: Incremental batch with combiners)",
    "Workflow orchestration: < 6 hour end-to-end pipeline (DDIA Ch. 10: Airflow DAG with retries)",
    "OLAP query: Dashboard loads in < 5s (DDIA Ch. 10: Materialized views on star schema)",
    "MapReduce efficiency: 90% CPU utilization (DDIA Ch. 10: Partition-local combiners)",
    "Incremental processing: Only process new events (DDIA Ch. 10: Date-partitioned HDFS)",
    "Fault tolerance: Retry failed tasks 3× (DDIA Ch. 10: Airflow exponential backoff)",
    "Data warehouse: Roll-up aggregates in < 10s (DDIA Ch. 10: Pre-computed dimensions)"
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
      "name": "Users can search and play songs",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can search and play songs\" works correctly. Must have search index for efficient queries.",
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
      "name": "Users can create and share playlists",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can create and share playlists\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can follow artists and other users",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can follow artists and other users\" works correctly.",
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
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
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
      "description": "Traffic increases during peak hours (morning commute time).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 4000,
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
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
      "description": "Album drop from major artist causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
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
        "rps": 6000,
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 750,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 300ms even during write bursts. Without CQRS: read latency spikes to 900ms+.",
      "traffic": {
        "type": "read",
        "rps": 2000,
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1900 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 600ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 200 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 600ms. Without sharding/multi-leader: writes queue up, latency exceeds 1500ms.",
      "traffic": {
        "type": "write",
        "rps": 4000,
        "readRatio": 0.3,
        "avgResponseSizeMB": 5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
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
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
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
        "readRatio": 0.95,
        "avgResponseSizeMB": 5
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
  "Learn blob storage for large files",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Spotify Engineering Blog",
    "url": "https://engineering.atspotify.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.spotify.com/"
  },
  {
    "label": "Spotify Architecture",
    "url": "https://engineering.atspotify.com/2023/03/spotify-backstage-architecture/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
songs = {}
playlists = {}
playlist_songs = {}
artists = {}
play_history = {}
follows = {}

def search_songs(query: str) -> List[Dict]:
    """
    FR-1: Users can search for songs
    Naive implementation - simple substring match on title
    """
    results = []
    for song in songs.values():
        if query.lower() in song.get('title', '').lower():
            results.append(song)
    return results

def play_song(song_id: str, user_id: str) -> Dict:
    """
    FR-1: Users can play songs
    Naive implementation - returns song URL and records play
    """
    if song_id not in songs:
        return None

    # Record play in history
    history_id = f"{user_id}_{song_id}_{datetime.now().timestamp()}"
    play_history[history_id] = {
        'user_id': user_id,
        'song_id': song_id,
        'played_at': datetime.now()
    }

    return songs[song_id]

def create_playlist(playlist_id: str, user_id: str, name: str, is_public: bool = True) -> Dict:
    """
    FR-2: Users can create playlists
    Naive implementation - stores playlist in memory
    """
    playlists[playlist_id] = {
        'id': playlist_id,
        'user_id': user_id,
        'name': name,
        'is_public': is_public,
        'created_at': datetime.now()
    }
    return playlists[playlist_id]

def add_song_to_playlist(playlist_id: str, song_id: str) -> Dict:
    """
    FR-2: Users can add songs to playlists
    Naive implementation - stores song-playlist relationship
    """
    key = f"{playlist_id}_{song_id}"
    playlist_songs[key] = {
        'playlist_id': playlist_id,
        'song_id': song_id,
        'added_at': datetime.now()
    }
    return playlist_songs[key]

def share_playlist(playlist_id: str, shared_by: str, shared_with: str) -> Dict:
    """
    FR-2: Users can share playlists
    Naive implementation - returns share confirmation
    In real system, this would create notifications
    """
    return {
        'playlist_id': playlist_id,
        'shared_by': shared_by,
        'shared_with': shared_with,
        'shared_at': datetime.now()
    }

def follow_artist(user_id: str, artist_id: str) -> Dict:
    """
    FR-3: Users can follow artists
    Naive implementation - stores follow relationship
    """
    follow_key = f"{user_id}_artist_{artist_id}"
    follows[follow_key] = {
        'user_id': user_id,
        'artist_id': artist_id,
        'type': 'artist',
        'created_at': datetime.now()
    }
    return follows[follow_key]

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-3: Users can follow other users
    Naive implementation - stores follow relationship
    """
    follow_key = f"{follower_id}_user_{following_id}"
    follows[follow_key] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'type': 'user',
        'created_at': datetime.now()
    }
    return follows[follow_key]
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
        instances: 12,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "12 instance(s)"
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
        sizeGB: 22,
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
  explanation: "Reference Solution for Spotify - Music Streaming (Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 7 instances handling 5700 read RPS (GET requests)\n- **Write API**: 4 instances handling 2800 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **22GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~5130 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 105 shards (sharded by user_id).\n  • Read Capacity: 5700 RPS across 4 database instance(s)\n  • Write Capacity: 2800 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 105 database shards. Each shard contains data for subset of users (e.g., user_id % 105 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 95.0%, Write: 5.0%, Total: 6000 RPS)\n- **Read API (7 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (4 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 5.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 105 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
