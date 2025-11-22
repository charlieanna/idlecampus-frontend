/**
 * Generated Tiered Challenge: Snapchat - Ephemeral Messaging
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const snapchatChallenge: Challenge = {
  id: 'snapchat',
  title: 'Snapchat - Ephemeral Messaging',
  difficulty: 'beginner',
  description: `Design an ephemeral messaging platform like Snapchat that:
- Users can send photos/videos that disappear after viewing
- Users can post stories that last 24 hours
- Users can send messages that auto-delete
- Content expires automatically`,
  
  requirements: {
  functional: [
    "Users can send photos/videos that disappear after viewing",
    "Users can post stories that last 24 hours",
    "Users can send messages that auto-delete"
  ],
  traffic: "100 RPS (90% reads, 10% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency"
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
      "name": "Users can send photos/videos that disappear after ...",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can send photos/videos that disappear after viewing\" works correctly. Must use object storage (S3) for files, not database. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
      "traffic": {
        "type": "read",
        "rps": 100,
        "readRatio": 0.9,
        "avgResponseSizeMB": 3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can post stories that last 24 hours",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can post stories that last 24 hours\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can send messages that auto-delete",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can send messages that auto-delete\" works correctly.",
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
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
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
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 4000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
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
        "rps": 3000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
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
        "rps": 6000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 625,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1400 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 500ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
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
      "description": "Write traffic bursts to 1200 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 500ms. Without sharding/multi-leader: writes queue up, latency exceeds 1250ms.",
      "traffic": {
        "type": "write",
        "rps": 4000,
        "readRatio": 0.3,
        "avgResponseSizeMB": 3
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
        "rps": 2000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
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
        "readRatio": 0.7,
        "avgResponseSizeMB": 3
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
  "Learn blob storage for large files",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Snap Engineering Blog",
    "url": "https://eng.snap.com/blog"
  },
  {
    "label": "Official Site",
    "url": "https://www.snapchat.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
snaps = {}
stories = {}
friendships = {}

def send_snap(snap_id: str, sender_id: str, receiver_id: str, media_url: str,
              view_duration: int = 10) -> Dict:
    """
    FR-1: Users can send photos/videos that disappear after viewing
    Naive implementation - stores snap with expiration logic
    """
    snaps[snap_id] = {
        'id': snap_id,
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'media_url': media_url,
        'view_duration': view_duration,
        'viewed_at': None,
        'expires_at': None,
        'created_at': datetime.now()
    }
    return snaps[snap_id]

def view_snap(snap_id: str) -> Dict:
    """
    FR-1: View snap (marks as viewed and sets expiration)
    Naive implementation - sets viewed time and expiration
    """
    snap = snaps.get(snap_id)
    if not snap:
        raise ValueError("Snap not found")

    if snap['viewed_at']:
        raise ValueError("Snap already viewed")

    snap['viewed_at'] = datetime.now()
    snap['expires_at'] = datetime.now() + timedelta(seconds=snap['view_duration'])
    return snap

def post_story(story_id: str, user_id: str, media_url: str) -> Dict:
    """
    FR-2: Users can post stories that last 24 hours
    Naive implementation - stores story with 24-hour expiration
    """
    stories[story_id] = {
        'id': story_id,
        'user_id': user_id,
        'media_url': media_url,
        'expires_at': datetime.now() + timedelta(hours=24),
        'created_at': datetime.now()
    }
    return stories[story_id]

def get_active_stories(user_id: str) -> List[Dict]:
    """
    FR-2: Get stories that haven't expired
    Naive implementation - filters stories by expiration
    """
    active_stories = []
    now = datetime.now()
    for story in stories.values():
        if story['user_id'] == user_id and story['expires_at'] > now:
            active_stories.append(story)
    return active_stories

def send_chat_message(message_id: str, sender_id: str, receiver_id: str,
                      text: str) -> Dict:
    """
    FR-3: Users can send messages that auto-delete
    Naive implementation - creates message with auto-delete flag
    """
    return {
        'id': message_id,
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'text': text,
        'auto_delete': True,
        'created_at': datetime.now()
    }

def cleanup_expired_content() -> Dict:
    """
    Helper: Remove expired snaps and stories
    Naive implementation - deletes expired content
    """
    now = datetime.now()
    deleted_snaps = 0
    deleted_stories = 0

    # Delete viewed snaps that have expired
    snap_ids_to_delete = []
    for snap_id, snap in snaps.items():
        if snap['expires_at'] and snap['expires_at'] < now:
            snap_ids_to_delete.append(snap_id)

    for snap_id in snap_ids_to_delete:
        del snaps[snap_id]
        deleted_snaps += 1

    # Delete expired stories
    story_ids_to_delete = []
    for story_id, story in stories.items():
        if story['expires_at'] < now:
            story_ids_to_delete.append(story_id)

    for story_id in story_ids_to_delete:
        del stories[story_id]
        deleted_stories += 1

    return {
        'deleted_snaps': deleted_snaps,
        'deleted_stories': deleted_stories
    }
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
        instances: 12
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
      type: "read_write"
    },
    {
      from: "app_server",
      to: "redis",
      type: "read_write"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "read_write"
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
  explanation: "Reference Solution for Snapchat - Ephemeral Messaging (Media):\n\n📊 Infrastructure Components:\n- **12 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 12000 RPS (peak: 6000 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **17GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3780 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 105 shards (sharded by user_id).\n  • Read Capacity: 4200 RPS across 4 database instance(s)\n  • Write Capacity: 2800 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 105 database shards. Each shard contains data for subset of users (e.g., user_id % 105 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 105 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
