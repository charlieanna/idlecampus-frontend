/**
 * Generated Tiered Challenge: Discord - Gaming Chat
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const discordChallenge: Challenge = {
  id: 'discord',
  title: 'Discord - Gaming Chat',
  difficulty: 'beginner',
  description: `Design a group chat platform like Discord that:
- Users can create servers with multiple channels
- Users can send text messages in real-time
- Users can join voice/video calls
- Messages are organized by channels and threads

Learning Objectives (DDIA Ch. 4, 11):
1. Implement real-time messaging with WebSockets (DDIA Ch. 11)
   - Persistent bidirectional connections
   - Fan-out to all channel members
2. Design binary message protocol (DDIA Ch. 4)
   - ETF/MessagePack for compact encoding
   - Compare JSON vs binary trade-offs
3. Build event-driven architecture (DDIA Ch. 11)
   - Message → DB → Fan-out pipeline
4. Handle WebSocket scaling challenges (SDP)
   - Sticky sessions for load balancing
   - Redis Pub/Sub for cross-gateway messaging`,
  
  requirements: {
  functional: [
    "Users can create servers with multiple channels",
    "Users can send text messages in real-time",
    "Users can join voice/video calls",
    "Messages are organized by channels and threads"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Real-time latency: < 100ms message delivery (DDIA Ch. 11: WebSockets)",
    "Message encoding: Binary (ETF/MessagePack) for 30-50% size reduction (DDIA Ch. 4)",
    "Fan-out: Deliver to all channel members in < 200ms (DDIA Ch. 11: Event streaming)",
    "Connection capacity: 1000+ WebSocket connections per gateway (SDP: Load balancing)",
    "Voice/video: WebRTC for peer-to-peer audio (SDP)"
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
      "name": "Users can create servers with multiple channels",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can create servers with multiple channels\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can send text messages in real-time",
      "type": "functional",
      "requirement": "FR-2",
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
      "name": "Users can join voice/video calls",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can join voice/video calls\" works correctly. Must use object storage (S3) for files, not database.",
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
      "name": "Messages are organized by channels and threads",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Messages are organized by channels and threads\" works correctly. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
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
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.8
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
        "rps": 2400,
        "readRatio": 0.8
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
        "rps": 1800,
        "readRatio": 0.8
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
        "rps": 3600,
        "readRatio": 0.8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 100ms even during write bursts. Without CQRS: read latency spikes to 300ms+.",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 960 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 200ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1800,
        "readRatio": 0.8
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
      "description": "Write traffic bursts to 480 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 200ms. Without sharding/multi-leader: writes queue up, latency exceeds 500ms.",
      "traffic": {
        "type": "write",
        "rps": 2400,
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
        "rps": 1200,
        "readRatio": 0.8
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
        "rps": 1200,
        "readRatio": 0.8
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
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Discord Engineering Blog",
    "url": "https://discord.com/category/engineering"
  },
  {
    "label": "Official Site",
    "url": "https://discord.com/"
  },
  {
    "label": "How Discord Stores Billions of Messages",
    "url": "https://discord.com/blog/how-discord-stores-billions-of-messages"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
servers = {}
channels = {}
messages = {}
members = {}
voice_sessions = {}

def create_server(server_id: str, name: str, owner_id: str) -> Dict:
    """
    FR-1: Users can create servers
    Naive implementation - stores server in memory
    """
    servers[server_id] = {
        'id': server_id,
        'name': name,
        'icon_url': None,
        'owner_id': owner_id,
        'created_at': datetime.now()
    }
    return servers[server_id]

def create_channel(channel_id: str, server_id: str, name: str, channel_type: str = "text") -> Dict:
    """
    FR-1: Users can create multiple channels in a server
    Naive implementation - stores channel in memory
    """
    channels[channel_id] = {
        'id': channel_id,
        'server_id': server_id,
        'name': name,
        'type': channel_type,  # text, voice, or video
        'created_at': datetime.now()
    }
    return channels[channel_id]

def send_message(message_id: str, channel_id: str, user_id: str, content: str) -> Dict:
    """
    FR-2: Users can send text messages in real-time
    Naive implementation - stores message in memory
    No actual real-time delivery
    """
    messages[message_id] = {
        'id': message_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'content': content,
        'created_at': datetime.now()
    }
    return messages[message_id]

def join_voice_call(session_id: str, channel_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can join voice calls
    Naive implementation - stores voice session
    No actual audio/video streaming
    """
    voice_sessions[session_id] = {
        'id': session_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'type': 'voice',
        'joined_at': datetime.now()
    }
    return voice_sessions[session_id]

def join_video_call(session_id: str, channel_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can join video calls
    Naive implementation - stores video session
    No actual video streaming
    """
    voice_sessions[session_id] = {
        'id': session_id,
        'channel_id': channel_id,
        'user_id': user_id,
        'type': 'video',
        'joined_at': datetime.now()
    }
    return voice_sessions[session_id]

def get_channel_messages(channel_id: str, limit: int = 50) -> List[Dict]:
    """
    Helper: Get messages from a channel
    Naive implementation - returns all messages in channel
    """
    channel_messages = []
    for message in messages.values():
        if message['channel_id'] == channel_id:
            channel_messages.append(message)

    # Sort by created_at (oldest first)
    channel_messages.sort(key=lambda x: x['created_at'])
    return channel_messages[-limit:]  # Return most recent N messages
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
        instances: 202,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "202 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 576,
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
          shards: 168,
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
  explanation: "Reference Solution for Discord - Gaming Chat (Real-time + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 4 instances handling 2880 read RPS (GET requests)\n- **Write API**: 3 instances handling 1680 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **576GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~2592 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 168 shards (sharded by user_id).\n  • Read Capacity: 2880 RPS across 11 database instance(s)\n  • Write Capacity: 1680 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n⚡ Real-time/Async Processing:\n- **Message Queue**: Decouples producers from consumers, enabling asynchronous processing and horizontal scaling. Provides buffering during traffic spikes and guarantees message delivery (DDIA Ch. 11 - Stream Processing).\n- **Event-Driven Architecture**: Services communicate via events (e.g., order_placed → notify_driver). Enables loose coupling and independent scaling of services.\n- **WebSocket-Ready**: Architecture supports long-lived connections for instant push notifications. Message queue fans out events to WebSocket servers for real-time updates to clients.\n- **Low-Latency Design**: Optimized for p99 < 100ms response times through caching, async processing, and minimal synchronous dependencies.\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 168 database shards. Each shard contains data for subset of users (e.g., user_id % 168 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 80.0%, Write: 20.0%, Total: 3600 RPS)\n- **Read API (4 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (3 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 20.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 168 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
