/**
 * Generated Tiered Challenge: Google Drive - Cloud Storage
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const googledriveChallenge: Challenge = {
  id: 'googledrive',
  title: 'Google Drive - Cloud Storage',
  difficulty: 'beginner',
  description: `Design a cloud storage platform like Google Drive that:
- Users can upload, store, and organize files
- Users can collaborate on documents in real-time
- Files can be shared with specific permissions
- Platform supports searching across all files

Learning Objectives (DDIA Ch. 3, 11):
1. Use B-trees for read-heavy file metadata (DDIA Ch. 3)
   - Fast point queries for file lookup
   - Efficient range scans for folder listings
2. Implement hierarchical folder structure (DDIA Ch. 2: Tree model)
3. Full-text search with inverted indexes (DDIA Ch. 3)
4. Real-time collaboration with Operational Transform (DDIA Ch. 11)`,
  
  requirements: {
  functional: [
    "Users can upload, store, and organize files",
    "Users can collaborate on documents in real-time",
    "Files can be shared with specific permissions",
    "Platform supports searching across all files"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "File lookup: p99 < 50ms (DDIA Ch. 3: B-tree O(log n))",
    "Folder listing: < 100ms for 1000 files (DDIA Ch. 3: Range scan)",
    "Search latency: < 300ms (DDIA Ch. 3: Full-text index)",
    "Read throughput: 100K+ file accesses/sec (DDIA Ch. 3: B-tree read optimization)",
    "Collaboration sync: < 100ms (DDIA Ch. 11: Operational Transform)"
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
      "name": "Users can upload, store, and organize files",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can upload, store, and organize files\" works correctly. Must use object storage (S3) for files, not database. Test flow: Client → App → Database.",
      "traffic": {
        "type": "write",
        "rps": 50,
        "readRatio": 0.3,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can collaborate on documents in real-time",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can collaborate on documents in real-time\" works correctly.",
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
      "name": "Files can be shared with specific permissions",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Files can be shared with specific permissions\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Platform supports searching across all files",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Platform supports searching across all files\" works correctly. Must use object storage (S3) for files, not database. Must have search index for efficient queries.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 8
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
        "rps": 1500,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
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
        "rps": 3000,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
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
        "rps": 2250,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 800,
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
        "rps": 4500,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1000,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1125 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 800ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 750 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 800ms. Without sharding/multi-leader: writes queue up, latency exceeds 2000ms.",
      "traffic": {
        "type": "write",
        "rps": 3000,
        "readRatio": 0.3,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 800,
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
        "rps": 1500,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
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
        "rps": 1500,
        "readRatio": 0.75,
        "avgResponseSizeMB": 8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 1200,
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
    "label": "Google Developers Blog",
    "url": "https://developers.googleblog.com/"
  },
  {
    "label": "Official Site",
    "url": "https://drive.google.com/"
  },
  {
    "label": "Google Drive API",
    "url": "https://developers.google.com/drive"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
files = {}
folders = {}
permissions = {}
activities = {}

def upload_file(file_id: str, owner_id: str, name: str, file_type: str,
                size: int, folder_id: str = None) -> Dict:
    """
    FR-1: Users can upload files
    Naive implementation - stores file metadata in memory
    """
    files[file_id] = {
        'id': file_id,
        'owner_id': owner_id,
        'folder_id': folder_id,
        'name': name,
        'type': file_type,
        'size': size,
        'url': f'https://storage.example.com/{file_id}',
        'created_at': datetime.now()
    }
    return files[file_id]

def create_folder(folder_id: str, owner_id: str, name: str,
                  parent_id: str = None) -> Dict:
    """
    FR-1: Users can organize files (create folders)
    Naive implementation - stores folder in memory
    """
    folders[folder_id] = {
        'id': folder_id,
        'owner_id': owner_id,
        'parent_id': parent_id,
        'name': name,
        'created_at': datetime.now()
    }
    return folders[folder_id]

def get_files_in_folder(folder_id: str = None) -> List[Dict]:
    """
    FR-1: Users can view files in folders
    Naive implementation - returns all files in a folder
    """
    folder_files = []
    for file in files.values():
        if file['folder_id'] == folder_id:
            folder_files.append(file)
    return folder_files

def collaborate_on_file(file_id: str, user_id: str, content_changes: str) -> Dict:
    """
    FR-2: Users can collaborate on documents in real-time
    Naive implementation - records activity, doesn't actually edit file
    """
    activity_id = f"{file_id}_{user_id}_{datetime.now().timestamp()}"
    activities[activity_id] = {
        'id': activity_id,
        'file_id': file_id,
        'user_id': user_id,
        'action': 'edit',
        'changes': content_changes,
        'created_at': datetime.now()
    }
    return activities[activity_id]

def get_file_activities(file_id: str) -> List[Dict]:
    """
    FR-2: View collaboration history
    Naive implementation - returns all activities for a file
    """
    file_activities = []
    for activity in activities.values():
        if activity['file_id'] == file_id:
            file_activities.append(activity)
    return file_activities

def share_file(permission_id: str, file_id: str, user_id: str,
               role: str = 'viewer') -> Dict:
    """
    Helper: Share file with specific permissions
    Naive implementation - stores permission in memory
    """
    permissions[permission_id] = {
        'id': permission_id,
        'file_id': file_id,
        'user_id': user_id,
        'role': role,
        'created_at': datetime.now()
    }
    return permissions[permission_id]
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
        instances: 9
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 15,
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
          shards: 79,
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
  explanation: "Reference Solution for Google Drive - Cloud Storage (Media):\n\n📊 Infrastructure Components:\n- **9 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 9000 RPS (peak: 4500 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **15GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3038 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 79 shards (sharded by user_id).\n  • Read Capacity: 3375 RPS across 4 database instance(s)\n  • Write Capacity: 2100 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 79 database shards. Each shard contains data for subset of users (e.g., user_id % 79 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 79 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
