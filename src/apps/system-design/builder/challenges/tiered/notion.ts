/**
 * Generated Tiered Challenge: Notion - Collaborative Workspace
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const notionChallenge: Challenge = {
  id: 'notion',
  title: 'Notion - Collaborative Workspace',
  difficulty: 'advanced',
  description: `Design a collaborative workspace like Notion that:
- Users can create pages with rich content (text, images, databases)
- Multiple users can edit pages in real-time
- Pages can be organized hierarchically
- Users can share and collaborate on workspaces

Learning Objectives (DDIA Ch. 9):
1. Implement operational transforms (OT) for concurrent text editing (DDIA Ch. 9)
   - Transform INSERT/DELETE operations when concurrent
   - Preserve user intent across conflicting edits
   - Ensure all replicas converge to same document state
2. Design causal consistency for block operations (DDIA Ch. 9)
   - Create → Edit → Delete operations preserve causal order
   - Version vectors track operation dependencies
   - Buffer operations until dependencies satisfied
3. Implement total order broadcast for document updates (DDIA Ch. 9)
   - All collaborators see same sequence of edits
   - Raft consensus for operation log replication
   - Prevent divergent document states
4. Design linearizability for block creation and deletion (DDIA Ch. 9)
   - Read-your-writes guarantee for structural changes
   - Strong consistency for block operations
   - Track sequence numbers for replica freshness
5. Implement consensus for page hierarchy changes (DDIA Ch. 9)
   - Move pages atomically with cycle detection
   - Prevent invalid parent-child relationships
   - Raft-based atomic hierarchy updates`,
  
  requirements: {
  functional: [
    "Users can create pages with rich content (text, images, databases)",
    "Users can share and collaborate on workspaces"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Operational transform: Convergence for concurrent edits (DDIA Ch. 9: Transform INSERT/DELETE)",
    "Causal consistency: Preserve block operation order (DDIA Ch. 9: Version vectors)",
    "Total order broadcast: All users see same edit sequence (DDIA Ch. 9: Raft log)",
    "Linearizability: Read-your-writes < 100ms (DDIA Ch. 9: Track sequence numbers)",
    "Consensus latency: Operations committed < 200ms (DDIA Ch. 9: Raft majority ACK)",
    "OT convergence: 100% consistency across replicas (DDIA Ch. 9: Transform against all ops)",
    "Hierarchy integrity: Prevent cycles (DDIA Ch. 9: Consensus-based validation)",
    "Concurrent edits: Preserve user intent (DDIA Ch. 9: OT position transformation)",
    "Operation ordering: Deterministic across clients (DDIA Ch. 9: Sequence numbers)"
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
      "name": "Users can create pages with rich content (text, im...",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can create pages with rich content (text, images, databases)\" works correctly. Must use object storage (S3) for files, not database. Test flow: Client → App → Database.",
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
      "name": "Users can share and collaborate on workspaces",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can share and collaborate on workspaces\" works correctly.",
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
        "readRatio": 0.75
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
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 1600,
        "readRatio": 0.75
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
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.75
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
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 2400,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 600 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.75
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
        "rps": 1600,
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
        "rps": 800,
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
        "rps": 800,
        "readRatio": 0.75
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
    "label": "Notion Blog",
    "url": "https://www.notion.so/blog/topic/tech"
  },
  {
    "label": "Official Site",
    "url": "https://www.notion.so/"
  },
  {
    "label": "Notion Architecture",
    "url": "https://www.notion.so/blog/sharding-postgres-at-notion"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
workspaces = {}
pages = {}
blocks = {}
permissions = {}

def create_page(page_id: str, workspace_id: str, title: str, parent_page_id: str = None) -> Dict:
    """
    FR-1: Users can create pages with rich content
    Naive implementation - stores page in memory
    """
    pages[page_id] = {
        'id': page_id,
        'workspace_id': workspace_id,
        'parent_page_id': parent_page_id,
        'title': title,
        'created_at': datetime.now()
    }
    return pages[page_id]

def add_text_block(block_id: str, page_id: str, content: str, position: int) -> Dict:
    """
    FR-1: Add text block to page
    Naive implementation - stores block in memory
    """
    blocks[block_id] = {
        'id': block_id,
        'page_id': page_id,
        'type': 'text',
        'content': content,
        'position': position,
        'created_at': datetime.now()
    }
    return blocks[block_id]

def add_image_block(block_id: str, page_id: str, image_url: str, position: int) -> Dict:
    """
    FR-1: Add image to page
    Naive implementation - stores image block reference
    """
    blocks[block_id] = {
        'id': block_id,
        'page_id': page_id,
        'type': 'image',
        'content': image_url,
        'position': position,
        'created_at': datetime.now()
    }
    return blocks[block_id]

def share_workspace(permission_id: str, workspace_id: str, user_id: str, role: str = "viewer") -> Dict:
    """
    FR-2: Users can share and collaborate on workspaces
    Naive implementation - grants user access to workspace
    """
    permissions[permission_id] = {
        'id': permission_id,
        'workspace_id': workspace_id,
        'user_id': user_id,
        'role': role,  # viewer, editor, admin
        'created_at': datetime.now()
    }
    return permissions[permission_id]

def get_page_content(page_id: str) -> Dict:
    """
    Helper: Get page with all its blocks
    Naive implementation - returns page and sorted blocks
    """
    if page_id not in pages:
        return None

    page = pages[page_id].copy()
    page_blocks = [b for b in blocks.values() if b['page_id'] == page_id]
    page_blocks.sort(key=lambda x: x['position'])
    page['blocks'] = page_blocks
    return page
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
        instances: 4,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "4 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 90,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "90 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 512,
        strategy: "cache_aside",
        hitRatio: 0.995,
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
          shards: 112,
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
  explanation: "Reference Solution for Notion - Collaborative Workspace (Real-time + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 3 instances handling 1800 read RPS (GET requests)\n- **Write API**: 2 instances handling 1120 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **512GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1620 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 112 shards (sharded by user_id).\n  • Read Capacity: 1800 RPS across 11 database instance(s)\n  • Write Capacity: 1120 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n⚡ Real-time/Async Processing:\n- **Message Queue**: Decouples producers from consumers, enabling asynchronous processing and horizontal scaling. Provides buffering during traffic spikes and guarantees message delivery (DDIA Ch. 11 - Stream Processing).\n- **Event-Driven Architecture**: Services communicate via events (e.g., order_placed → notify_driver). Enables loose coupling and independent scaling of services.\n- **WebSocket-Ready**: Architecture supports long-lived connections for instant push notifications. Message queue fans out events to WebSocket servers for real-time updates to clients.\n- **Low-Latency Design**: Optimized for p99 < 100ms response times through caching, async processing, and minimal synchronous dependencies.\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 112 database shards. Each shard contains data for subset of users (e.g., user_id % 112 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 75.0%, Write: 25.0%, Total: 2400 RPS)\n- **Read API (3 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (2 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 25.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 112 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
