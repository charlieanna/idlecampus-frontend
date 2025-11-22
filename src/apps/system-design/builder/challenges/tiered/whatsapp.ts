/**
 * Generated Tiered Challenge: WhatsApp - Messaging App
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const whatsappChallenge: Challenge = {
  id: 'whatsapp',
  title: 'WhatsApp - Messaging App',
  difficulty: 'advanced',
  description: `Design a messaging platform like WhatsApp that:
- Users can send text messages in real-time
- Users can send photos, videos, and voice messages
- Messages are end-to-end encrypted
- Users can create group chats

Learning Objectives (DDIA Ch. 8):
1. Handle network partitions and split-brain for online status (DDIA Ch. 8)
   - Quorum-based presence detection across datacenters
   - Prevent split-brain: User appears online in some DCs, offline in others
2. Design multi-datacenter message delivery (DDIA Ch. 8)
   - Vector clocks for causal consistency in group chats
   - Conflict-free replicated data types (CRDTs) for message ordering
3. Implement offline message queue synchronization (DDIA Ch. 8)
   - Batched replay of missed messages on reconnect
   - Idempotency keys for duplicate detection
4. Use fencing tokens to prevent stale writes (DDIA Ch. 8)
   - Prevent writes after network partition heals with old lock
5. Handle clock synchronization for timestamps (DDIA Ch. 8)
   - Logical clocks (Lamport timestamps) for "last seen"
   - Ensure monotonically increasing timestamps across servers
6. Ensure exactly-once message delivery with partial failures (DDIA Ch. 8)
   - At-least-once delivery + idempotent writes`,
  
  requirements: {
  functional: [
    "Users can send text messages in real-time",
    "Users can send photos, videos, and voice messages",
    "Users can create group chats"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Network partition tolerance: Split-brain prevention (DDIA Ch. 8: Quorum 2/3 for presence)",
    "Message delivery: Exactly-once despite failures (DDIA Ch. 8: Idempotent writes + message ID)",
    "Offline sync: Batched replay on reconnect (DDIA Ch. 8: < 5s for 1000 messages)",
    "Causal consistency: Vector clocks for message ordering (DDIA Ch. 8: Preserve happens-before)",
    "Fencing tokens: Prevent stale writes (DDIA Ch. 8: Monotonic token numbers)",
    "Clock synchronization: Logical clocks for \"last seen\" (DDIA Ch. 8: Lamport timestamps)",
    "Byzantine tolerance: Digital signatures for admin (DDIA Ch. 8: 2/3 majority)",
    "Partial failure handling: At-least-once delivery (DDIA Ch. 8: Retry with backoff)",
    "Multi-datacenter latency: p99 < 150ms cross-region (DDIA Ch. 8: Async replication)"
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
      "name": "Users can send text messages in real-time",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can send text messages in real-time\" works correctly.",
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
      "name": "Users can send photos, videos, and voice messages",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can send photos, videos, and voice messages\" works correctly. Must use object storage (S3) for files, not database.",
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
      "name": "Users can create group chats",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can create group chats\" works correctly. Test flow: Client → App → Database.",
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
        "rps": 10000,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
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
        "rps": 20000,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 150,
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
        "rps": 15000,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
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
        "rps": 30000,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 7500 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 8 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 200ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 15000,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 5000 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 200ms. Without sharding/multi-leader: writes queue up, latency exceeds 500ms.",
      "traffic": {
        "type": "write",
        "rps": 20000,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
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
        "rps": 10000,
        "readRatio": 0.75
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
        "rps": 10000,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
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
    "label": "WhatsApp Engineering",
    "url": "https://engineering.fb.com/category/whatsapp/"
  },
  {
    "label": "Official Site",
    "url": "https://www.whatsapp.com/"
  },
  {
    "label": "WhatsApp System Design",
    "url": "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-whatsapp"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
messages = {}
chats = {}
groups = {}
media = {}

def send_text_message(message_id: str, chat_id: str, sender_id: str, content: str) -> Dict:
    """
    FR-1: Users can send text messages in real-time
    Naive implementation - stores message in memory
    No actual real-time delivery or encryption
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': content,
        'media_url': None,
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_photo(message_id: str, chat_id: str, sender_id: str, photo_url: str, caption: str = "") -> Dict:
    """
    FR-2: Users can send photos
    Naive implementation - stores message with photo URL
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': caption,
        'media_url': photo_url,
        'media_type': 'photo',
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_video(message_id: str, chat_id: str, sender_id: str, video_url: str, caption: str = "") -> Dict:
    """
    FR-2: Users can send videos
    Naive implementation - stores message with video URL
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': caption,
        'media_url': video_url,
        'media_type': 'video',
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_voice_message(message_id: str, chat_id: str, sender_id: str, audio_url: str) -> Dict:
    """
    FR-2: Users can send voice messages
    Naive implementation - stores message with audio URL
    """
    messages[message_id] = {
        'id': message_id,
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': "",
        'media_url': audio_url,
        'media_type': 'voice',
        'created_at': datetime.now()
    }
    return messages[message_id]

def create_group_chat(chat_id: str, name: str, admin_id: str, member_ids: List[str]) -> Dict:
    """
    FR-3: Users can create group chats
    Naive implementation - stores group in memory
    """
    chats[chat_id] = {
        'id': chat_id,
        'type': 'group',
        'created_at': datetime.now()
    }

    groups[chat_id] = {
        'chat_id': chat_id,
        'name': name,
        'admin_id': admin_id,
        'member_ids': member_ids,
        'created_at': datetime.now()
    }
    return groups[chat_id]

def add_member_to_group(chat_id: str, user_id: str) -> Dict:
    """
    Helper: Add member to group chat
    Naive implementation - adds user to member list
    """
    if chat_id in groups:
        if user_id not in groups[chat_id]['member_ids']:
            groups[chat_id]['member_ids'].append(user_id)
        return groups[chat_id]
    return None

def get_chat_messages(chat_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a chat
    Naive implementation - returns all messages in chat
    """
    chat_messages = []
    for message in messages.values():
        if message['chat_id'] == chat_id:
            chat_messages.append(message)

    # Sort by created_at (oldest first)
    chat_messages.sort(key=lambda x: x['created_at'])
    return chat_messages[-limit:]  # Return most recent N messages
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
        instances: 68,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "68 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 1680,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "1680 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 4500,
        strategy: "cache_aside",
        hitRatio: 0.9995,
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
          shards: 1400,
          shardKey: "user_id"
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
  explanation: "Reference Solution for WhatsApp - Messaging App (Real-time + Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 27 instances handling 22500 read RPS (GET requests)\n- **Write API**: 17 instances handling 14000 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **4500GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~20250 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 1400 shards (sharded by user_id).\n  • Read Capacity: 22500 RPS across 11 database instance(s)\n  • Write Capacity: 14000 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n⚡ Real-time/Async Processing:\n- **Message Queue**: Decouples producers from consumers, enabling asynchronous processing and horizontal scaling. Provides buffering during traffic spikes and guarantees message delivery (DDIA Ch. 11 - Stream Processing).\n- **Event-Driven Architecture**: Services communicate via events (e.g., order_placed → notify_driver). Enables loose coupling and independent scaling of services.\n- **WebSocket-Ready**: Architecture supports long-lived connections for instant push notifications. Message queue fans out events to WebSocket servers for real-time updates to clients.\n- **Low-Latency Design**: Optimized for p99 < 100ms response times through caching, async processing, and minimal synchronous dependencies.\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 1400 database shards. Each shard contains data for subset of users (e.g., user_id % 1400 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 75.0%, Write: 25.0%, Total: 30000 RPS)\n- **Read API (27 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (17 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 25.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 1400 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
