/**
 * Generated Tiered Challenge: Trello - Project Management
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const trelloChallenge: Challenge = {
  id: 'trello',
  title: 'Trello - Project Management',
  difficulty: 'advanced',
  description: `Design a project management platform like Trello that:
- Users can create boards with lists and cards
- Cards can be moved between lists (drag and drop)
- Users can collaborate on boards
- Cards support comments, attachments, and checklists

Learning Objectives (DDIA Ch. 9):
1. Implement CRDTs for conflict-free collaborative editing (DDIA Ch. 9)
   - LWW-Element-Set CRDT for card positions
   - Multiple users moving cards concurrently without conflicts
   - Deterministic convergence across all replicas
2. Design linearizability for card move operations (DDIA Ch. 9)
   - User sees card in new position immediately (read-your-writes)
   - Strong consistency for position updates
   - Track operation sequence numbers
3. Implement total order broadcast for board updates (DDIA Ch. 9)
   - All collaborators see same sequence of changes
   - Raft consensus for operation log replication
   - Prevents inconsistent board states
4. Design consensus for atomic card moves (DDIA Ch. 9)
   - Move card between lists atomically (remove + add)
   - Prevent card loss or duplication
   - Raft-based two-phase protocol
5. Implement causal consistency for dependent operations (DDIA Ch. 9)
   - Create card → Add comment (preserve order)
   - Version vectors track operation dependencies
   - Buffer operations until dependencies met`,
  
  requirements: {
  functional: [
    "Users can create boards with lists and cards",
    "Users can collaborate on boards"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "CRDT convergence: 100% consistency across replicas (DDIA Ch. 9: LWW-Element-Set)",
    "Linearizability: Read-your-writes < 100ms (DDIA Ch. 9: Track operation_seq)",
    "Total order: All users see same operation sequence (DDIA Ch. 9: Raft consensus log)",
    "Atomic card moves: No loss or duplication (DDIA Ch. 9: Raft two-phase protocol)",
    "Consensus latency: Operations committed < 200ms (DDIA Ch. 9: Majority ACK)",
    "Causal consistency: Preserve operation dependencies (DDIA Ch. 9: Version vectors)",
    "Concurrent edits: Conflict-free convergence (DDIA Ch. 9: CRDT merge)",
    "Operation ordering: Deterministic across all clients (DDIA Ch. 9: Sequence numbers)",
    "Freshness guarantee: Replicas catch up before read (DDIA Ch. 9: min_operation_seq)"
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
      "name": "Users can create boards with lists and cards",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can create boards with lists and cards\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can collaborate on boards",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can collaborate on boards\" works correctly.",
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
        "rps": 600,
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
        "rps": 1200,
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
        "rps": 900,
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
        "rps": 1800,
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
      "description": "Read traffic of 450 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 900,
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
      "description": "Write traffic bursts to 300 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 400ms. Without sharding/multi-leader: writes queue up, latency exceeds 1000ms.",
      "traffic": {
        "type": "write",
        "rps": 1200,
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
        "rps": 600,
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
        "rps": 600,
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
    "label": "Trello Engineering Blog",
    "url": "https://tech.trello.com/"
  },
  {
    "label": "Official Site",
    "url": "https://trello.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
boards = {}
lists = {}
cards = {}
comments = {}
board_members = {}

def create_board(board_id: str, owner_id: str, name: str, visibility: str = "private") -> Dict:
    """
    FR-1: Users can create boards
    Naive implementation - stores board in memory
    """
    boards[board_id] = {
        'id': board_id,
        'name': name,
        'owner_id': owner_id,
        'visibility': visibility,  # private, team, public
        'created_at': datetime.now()
    }
    return boards[board_id]

def create_list(list_id: str, board_id: str, name: str, position: int) -> Dict:
    """
    FR-1: Users can create lists in boards
    Naive implementation - stores list in memory
    """
    lists[list_id] = {
        'id': list_id,
        'board_id': board_id,
        'name': name,
        'position': position,
        'created_at': datetime.now()
    }
    return lists[list_id]

def create_card(card_id: str, list_id: str, title: str, description: str = "", position: int = 0) -> Dict:
    """
    FR-1: Users can create cards in lists
    Naive implementation - stores card in memory
    """
    cards[card_id] = {
        'id': card_id,
        'list_id': list_id,
        'title': title,
        'description': description,
        'position': position,
        'due_date': None,
        'created_at': datetime.now()
    }
    return cards[card_id]

def move_card(card_id: str, new_list_id: str, new_position: int) -> Dict:
    """
    Helper: Move card between lists
    Naive implementation - updates list and position
    """
    if card_id in cards:
        cards[card_id]['list_id'] = new_list_id
        cards[card_id]['position'] = new_position
        return cards[card_id]
    return None

def add_board_member(board_id: str, user_id: str, role: str = "member") -> Dict:
    """
    FR-2: Users can collaborate on boards
    Naive implementation - adds user to board members
    """
    member_key = f"{board_id}_{user_id}"
    board_members[member_key] = {
        'board_id': board_id,
        'user_id': user_id,
        'role': role,  # admin, member, observer
        'added_at': datetime.now()
    }
    return board_members[member_key]

def get_board_content(board_id: str) -> Dict:
    """
    Helper: Get board with all lists and cards
    Naive implementation - returns board structure
    """
    if board_id not in boards:
        return None

    board = boards[board_id].copy()

    # Get all lists for this board
    board_lists = [l for l in lists.values() if l['board_id'] == board_id]
    board_lists.sort(key=lambda x: x['position'])

    # Get cards for each list
    for lst in board_lists:
        list_cards = [c for c in cards.values() if c['list_id'] == lst['id']]
        list_cards.sort(key=lambda x: x['position'])
        lst['cards'] = list_cards

    board['lists'] = board_lists
    return board
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
        instances: 4
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 9,
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
          shards: 32,
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
  explanation: "Reference Solution for Trello - Project Management:\n\n📊 Infrastructure Components:\n- **4 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 4000 RPS (peak: 1800 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **9GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1215 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 32 shards (sharded by user_id).\n  • Read Capacity: 1350 RPS across 4 database instance(s)\n  • Write Capacity: 840 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 32 database shards. Each shard contains data for subset of users (e.g., user_id % 32 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 32 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
