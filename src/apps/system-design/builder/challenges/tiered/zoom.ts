/**
 * Generated Tiered Challenge: Zoom - Video Conferencing
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const zoomChallenge: Challenge = {
  id: 'zoom',
  title: 'Zoom - Video Conferencing',
  difficulty: 'intermediate',
  description: `Design a video conferencing platform like Zoom that:
- Users can create and join video meetings
- Meetings support screen sharing and recording
- Platform handles audio and video streaming
- Users can chat during meetings

Learning Objectives (DDIA Ch. 8):
1. Design distributed SFU consensus for media routing (DDIA Ch. 8)
   - Raft-based leader election across SFU servers
   - Prevent duplicate video stream routing
2. Implement SFU failover and redundancy (DDIA Ch. 8)
   - Primary SFU crashes → Backup takes over < 3s
   - Participants automatically reconnect
3. Handle clock drift for A/V synchronization (DDIA Ch. 8)
   - NTP clock sync across servers (±10ms)
   - Jitter buffer to absorb network delay variations
4. Prevent split-brain for meeting state (DDIA Ch. 8)
   - Quorum-based writes (2/3 SFUs)
   - Only one SFU has authority to modify meeting
5. Handle network partitions during active calls (DDIA Ch. 8)
   - Keep participant groups connected separately
   - Merge when partition heals
6. Design graceful failure handling for screen sharing (DDIA Ch. 8)
   - Detect sender crashes with heartbeat monitoring
   - Notify participants clearly`,
  
  requirements: {
  functional: [
    "Users can create and join video meetings",
    "Users can chat during meetings"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "SFU failover: < 3s to recover from crash (DDIA Ch. 8: Raft leader election)",
    "No duplicate streams: Consensus on routing (DDIA Ch. 8: Leader-based routing)",
    "A/V sync: ±10ms clock synchronization (DDIA Ch. 8: NTP)",
    "Split-brain prevention: Quorum writes (DDIA Ch. 8: 2/3 SFUs)",
    "Network partition tolerance: Keep groups connected (DDIA Ch. 8: Graceful degradation)",
    "Failure detection: 3s heartbeat timeout (DDIA Ch. 8: Screen share monitoring)",
    "Jitter buffer: 100ms to absorb delays (DDIA Ch. 8: Compensate clock skew)",
    "Meeting state consistency: Linearizable writes (DDIA Ch. 8: Raft consensus)",
    "Participant reconnect: < 5s after partition heals (DDIA Ch. 8: Auto-merge)"
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
      "name": "Users can create and join video meetings",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can create and join video meetings\" works correctly. Must use object storage (S3) for files, not database. Test flow: Client → App → Database.",
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
      "name": "Users can chat during meetings",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can chat during meetings\" works correctly.",
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
        "type": "mixed",
        "rps": 1500,
        "readRatio": 0.5
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
      "description": "Traffic increases during peak hours (meeting-heavy mornings).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "mixed",
        "rps": 3000,
        "readRatio": 0.5
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
      "description": "Emergency all-hands meeting causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "mixed",
        "rps": 2250,
        "readRatio": 0.5
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
      "description": "Pandemic-driven surge - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "mixed",
        "rps": 4500,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 1500 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 200ms. Without sharding/multi-leader: writes queue up, latency exceeds 500ms.",
      "traffic": {
        "type": "write",
        "rps": 3000,
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
        "type": "mixed",
        "rps": 1500,
        "readRatio": 0.5
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
    "label": "Zoom Blog",
    "url": "https://blog.zoom.us/"
  },
  {
    "label": "Official Site",
    "url": "https://zoom.us/"
  },
  {
    "label": "Zoom Architecture",
    "url": "https://blog.zoom.us/zoom-scalable-video-conferencing-platform/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
meetings = {}
participants = {}
recordings = {}
chat_messages = {}

def create_meeting(meeting_id: str, host_id: str, title: str, scheduled_start: datetime, duration: int) -> Dict:
    """
    FR-1: Users can create video meetings
    Naive implementation - stores meeting in memory
    """
    meetings[meeting_id] = {
        'id': meeting_id,
        'host_id': host_id,
        'title': title,
        'scheduled_start': scheduled_start,
        'duration': duration,  # in minutes
        'status': 'scheduled',
        'created_at': datetime.now()
    }
    return meetings[meeting_id]

def join_meeting(meeting_id: str, user_id: str) -> Dict:
    """
    FR-1: Users can join video meetings
    Naive implementation - stores participant info
    No actual video/audio streaming
    """
    participant_id = f"{meeting_id}_{user_id}"
    participants[participant_id] = {
        'meeting_id': meeting_id,
        'user_id': user_id,
        'joined_at': datetime.now(),
        'left_at': None
    }

    # Update meeting status to active
    if meeting_id in meetings:
        meetings[meeting_id]['status'] = 'active'

    return participants[participant_id]

def send_chat_message(message_id: str, meeting_id: str, user_id: str, message: str) -> Dict:
    """
    FR-2: Users can chat during meetings
    Naive implementation - stores chat message in memory
    """
    chat_messages[message_id] = {
        'id': message_id,
        'meeting_id': meeting_id,
        'user_id': user_id,
        'message': message,
        'created_at': datetime.now()
    }
    return chat_messages[message_id]

def leave_meeting(meeting_id: str, user_id: str) -> Dict:
    """
    Helper: User leaves meeting
    Naive implementation - updates participant record
    """
    participant_id = f"{meeting_id}_{user_id}"
    if participant_id in participants:
        participants[participant_id]['left_at'] = datetime.now()
        return participants[participant_id]
    return None

def get_meeting_participants(meeting_id: str) -> List[Dict]:
    """
    Helper: Get all participants in a meeting
    Naive implementation - returns all participants who haven't left
    """
    active_participants = []
    for participant in participants.values():
        if participant['meeting_id'] == meeting_id and participant['left_at'] is None:
            active_participants.append(participant)
    return active_participants

def get_meeting_chat(meeting_id: str) -> List[Dict]:
    """
    Helper: Get all chat messages from a meeting
    Naive implementation - returns all chat messages
    """
    meeting_chat = []
    for message in chat_messages.values():
        if message['meeting_id'] == meeting_id:
            meeting_chat.append(message)

    # Sort by created_at
    meeting_chat.sort(key=lambda x: x['created_at'])
    return meeting_chat
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
        instances: 225,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "225 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 450,
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
          shards: 225,
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
  explanation: "Reference Solution for Zoom - Video Conferencing (Real-time + Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 3 instances handling 2250 read RPS (GET requests)\n- **Write API**: 3 instances handling 2250 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **450GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~2025 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 225 shards (sharded by user_id).\n  • Read Capacity: 2250 RPS across 11 database instance(s)\n  • Write Capacity: 2250 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n⚡ Real-time/Async Processing:\n- **Message Queue**: Decouples producers from consumers, enabling asynchronous processing and horizontal scaling. Provides buffering during traffic spikes and guarantees message delivery (DDIA Ch. 11 - Stream Processing).\n- **Event-Driven Architecture**: Services communicate via events (e.g., order_placed → notify_driver). Enables loose coupling and independent scaling of services.\n- **WebSocket-Ready**: Architecture supports long-lived connections for instant push notifications. Message queue fans out events to WebSocket servers for real-time updates to clients.\n- **Low-Latency Design**: Optimized for p99 < 100ms response times through caching, async processing, and minimal synchronous dependencies.\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 225 database shards. Each shard contains data for subset of users (e.g., user_id % 225 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 50.0%, Write: 50.0%, Total: 4500 RPS)\n- **Read API (3 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (3 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 50.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 225 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
