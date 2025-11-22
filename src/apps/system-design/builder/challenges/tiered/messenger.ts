/**
 * Generated Tiered Challenge: Facebook Messenger - Chat App
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const messengerChallenge: Challenge = {
  id: 'messenger',
  title: 'Facebook Messenger - Chat App',
  difficulty: 'intermediate',
  description: `Design a messaging platform like Facebook Messenger that:
- Users can send text messages and media
- Users can make voice and video calls
- Group chats support multiple participants
- Messages sync across all devices`,
  
  requirements: {
  functional: [
    "Users can send text messages and media",
    "Users can make voice and video calls"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
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
      "name": "Users can send text messages and media",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can send text messages and media\" works correctly. Must use object storage (S3) for files, not database.",
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
      "name": "Users can make voice and video calls",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can make voice and video calls\" works correctly. Must use object storage (S3) for files, not database.",
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
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 5000,
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
        "rps": 10000,
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
        "rps": 7500,
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
        "rps": 15000,
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
      "description": "Read traffic of 3750 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 4 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 200ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 7500,
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
      "description": "Write traffic bursts to 2500 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 200ms. Without sharding/multi-leader: writes queue up, latency exceeds 500ms.",
      "traffic": {
        "type": "write",
        "rps": 10000,
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
        "rps": 5000,
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
        "rps": 5000,
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
    "label": "Messenger Engineering",
    "url": "https://engineering.fb.com/category/messenger/"
  },
  {
    "label": "Official Site",
    "url": "https://www.messenger.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
conversations = {}
messages = {}
participants = {}
media = {}

def send_text_message(message_id: str, conversation_id: str, sender_id: str,
                      content: str) -> Dict:
    """
    FR-1: Users can send text messages
    Naive implementation - stores message in memory
    """
    messages[message_id] = {
        'id': message_id,
        'conversation_id': conversation_id,
        'sender_id': sender_id,
        'content': content,
        'type': 'text',
        'created_at': datetime.now()
    }
    return messages[message_id]

def send_media_message(message_id: str, conversation_id: str, sender_id: str,
                       media_url: str, media_type: str) -> Dict:
    """
    FR-1: Users can send media
    Naive implementation - stores message with media reference
    """
    # Store media
    media_id = f"media_{message_id}"
    media[media_id] = {
        'id': media_id,
        'message_id': message_id,
        'url': media_url,
        'type': media_type,
        'created_at': datetime.now()
    }

    messages[message_id] = {
        'id': message_id,
        'conversation_id': conversation_id,
        'sender_id': sender_id,
        'content': '',
        'type': 'media',
        'media_id': media_id,
        'created_at': datetime.now()
    }
    return messages[message_id]

def initiate_call(conversation_id: str, caller_id: str, call_type: str) -> Dict:
    """
    FR-2: Users can make voice and video calls
    Naive implementation - returns call initiation data
    """
    call_id = f"call_{conversation_id}_{datetime.now().timestamp()}"
    return {
        'call_id': call_id,
        'conversation_id': conversation_id,
        'caller_id': caller_id,
        'type': call_type,  # 'voice' or 'video'
        'status': 'ringing',
        'started_at': datetime.now()
    }

def get_conversation_messages(conversation_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a conversation
    Naive implementation - returns recent messages
    """
    conv_messages = []
    for message in messages.values():
        if message['conversation_id'] == conversation_id:
            conv_messages.append(message)

    # Sort by created_at (most recent last)
    conv_messages.sort(key=lambda x: x['created_at'])
    return conv_messages[-limit:]

def create_conversation(conversation_id: str, participant_ids: List[str],
                        conv_type: str = 'direct') -> Dict:
    """
    Helper: Create a conversation
    Naive implementation - stores conversation and participants
    """
    conversations[conversation_id] = {
        'id': conversation_id,
        'type': conv_type,  # 'direct' or 'group'
        'created_at': datetime.now()
    }

    # Add participants
    for user_id in participant_ids:
        participant_id = f"{conversation_id}_{user_id}"
        participants[participant_id] = {
            'conversation_id': conversation_id,
            'user_id': user_id,
            'joined_at': datetime.now()
        }

    return conversations[conversation_id]
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
        instances: 34,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "34 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 840,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "840 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 2250,
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
          shards: 700,
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
  explanation: "Reference Solution for Facebook Messenger - Chat App (Real-time + Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 14 instances handling 11250 read RPS (GET requests)\n- **Write API**: 9 instances handling 7000 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **2250GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~10125 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 700 shards (sharded by user_id).\n  • Read Capacity: 11250 RPS across 11 database instance(s)\n  • Write Capacity: 7000 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n⚡ Real-time/Async Processing:\n- **Message Queue**: Decouples producers from consumers, enabling asynchronous processing and horizontal scaling. Provides buffering during traffic spikes and guarantees message delivery (DDIA Ch. 11 - Stream Processing).\n- **Event-Driven Architecture**: Services communicate via events (e.g., order_placed → notify_driver). Enables loose coupling and independent scaling of services.\n- **WebSocket-Ready**: Architecture supports long-lived connections for instant push notifications. Message queue fans out events to WebSocket servers for real-time updates to clients.\n- **Low-Latency Design**: Optimized for p99 < 100ms response times through caching, async processing, and minimal synchronous dependencies.\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 700 database shards. Each shard contains data for subset of users (e.g., user_id % 700 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 75.0%, Write: 25.0%, Total: 15000 RPS)\n- **Read API (14 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (9 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 25.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 700 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
