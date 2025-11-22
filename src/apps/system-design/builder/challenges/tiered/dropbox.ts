/**
 * Generated Tiered Challenge: Dropbox - File Storage & Sync
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const dropboxChallenge: Challenge = {
  id: 'dropbox',
  title: 'Dropbox - File Storage & Sync',
  difficulty: 'beginner',
  description: `Design a file storage and sync service like Dropbox that:
- Users can upload and download files
- Files sync across multiple devices
- Users can share files and folders
- Platform supports file versioning

Learning Objectives (DDIA Ch. 3, 4):
1. Use LSM-trees for write-heavy file metadata (DDIA Ch. 3)
   - Fast sequential writes to memtable
   - Background compaction for read optimization
2. Implement delta sync with chunking (DDIA Ch. 4)
   - Only sync changed file chunks, not entire files
3. Use Bloom filters for existence checks (DDIA Ch. 3)
4. Content-defined chunking for deduplication (DDIA Ch. 4)`,
  
  requirements: {
  functional: [
    "Users can upload and download files",
    "Files sync across multiple devices",
    "Users can share files and folders",
    "Platform supports file versioning"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Upload throughput: 10K+ files/sec (DDIA Ch. 3: LSM-tree write optimization)",
    "Sync latency: < 1s for small changes (DDIA Ch. 4: Delta sync)",
    "Metadata write latency: < 10ms (DDIA Ch. 3: LSM memtable)",
    "Deduplication: 50%+ storage savings (DDIA Ch. 4: Content-defined chunking)",
    "Compaction: Background without blocking (DDIA Ch. 3: LSM compaction)"
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
      "name": "Users can upload and download files",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can upload and download files\" works correctly. Must use object storage (S3) for files, not database. Test flow: Client → App → Database.",
      "traffic": {
        "type": "write",
        "rps": 50,
        "readRatio": 0.3,
        "avgResponseSizeMB": 10
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Files sync across multiple devices",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Files sync across multiple devices\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 10
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can share files and folders",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can share files and folders\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 10
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Platform supports file versioning",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Platform supports file versioning\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 10
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
        "rps": 1000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
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
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 2000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
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
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
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
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1250,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 700 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 1000ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 600 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 1000ms. Without sharding/multi-leader: writes queue up, latency exceeds 2500ms.",
      "traffic": {
        "type": "write",
        "rps": 2000,
        "readRatio": 0.3,
        "avgResponseSizeMB": 10
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1000,
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
        "rps": 1000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
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
        "rps": 1000,
        "readRatio": 0.7,
        "avgResponseSizeMB": 10
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
    "label": "Dropbox Tech Blog",
    "url": "https://dropbox.tech/"
  },
  {
    "label": "Official Site",
    "url": "https://www.dropbox.com/"
  },
  {
    "label": "System Design: Dropbox",
    "url": "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-dropbox"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
files = {}
folders = {}
shares = {}
versions = {}

def upload_file(file_id: str, user_id: str, folder_id: str, name: str, size: int, url: str) -> Dict:
    """
    FR-1: Users can upload files
    Naive implementation - stores file metadata in memory
    """
    files[file_id] = {
        'id': file_id,
        'user_id': user_id,
        'folder_id': folder_id,
        'name': name,
        'size': size,
        'url': url,
        'created_at': datetime.now()
    }

    # Update user storage
    if user_id in users:
        users[user_id]['storage_used'] = users[user_id].get('storage_used', 0) + size

    return files[file_id]

def download_file(file_id: str) -> Dict:
    """
    FR-1: Users can download files
    Naive implementation - returns file metadata with URL
    """
    return files.get(file_id)

def share_file(share_id: str, file_id: str, shared_with_user_id: str, permission: str = "read") -> Dict:
    """
    FR-2: Users can share files
    Naive implementation - stores share permission
    """
    shares[share_id] = {
        'id': share_id,
        'file_id': file_id,
        'shared_with_user_id': shared_with_user_id,
        'permission': permission,  # read, write
        'created_at': datetime.now()
    }
    return shares[share_id]

def share_folder(share_id: str, folder_id: str, shared_with_user_id: str, permission: str = "read") -> Dict:
    """
    FR-2: Users can share folders
    Naive implementation - shares folder and all contained files
    """
    shares[share_id] = {
        'id': share_id,
        'folder_id': folder_id,
        'shared_with_user_id': shared_with_user_id,
        'permission': permission,
        'created_at': datetime.now()
    }
    return shares[share_id]

def get_user_files(user_id: str, folder_id: str = None) -> List[Dict]:
    """
    Helper: Get user's files
    Naive implementation - returns all files in folder or root
    """
    user_files = []
    for file in files.values():
        if file['user_id'] == user_id and file['folder_id'] == folder_id:
            user_files.append(file)
    return user_files
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
        instances: 6
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 11,
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
          shards: 53,
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
  explanation: "Reference Solution for Dropbox - File Storage & Sync (Media):\n\n📊 Infrastructure Components:\n- **6 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 6000 RPS (peak: 3000 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **11GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1890 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 53 shards (sharded by user_id).\n  • Read Capacity: 2100 RPS across 4 database instance(s)\n  • Write Capacity: 1400 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 53 database shards. Each shard contains data for subset of users (e.g., user_id % 53 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 53 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
