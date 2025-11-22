/**
 * Generated Tiered Challenge: Collaborative Document Editor
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const activeActiveRegionsChallenge: Challenge = {
  id: 'active-active-regions',
  title: 'Collaborative Document Editor',
  difficulty: 'advanced',
  description: `Design a collaborative document editor (like Google Docs) that:
- Users can create, edit, and share documents
- Multiple users can edit the same document simultaneously
- Users can access documents from anywhere in the world
- System must handle concurrent edits from users in different geographic regions
- Documents remain available even during regional failures

Key Learning Objectives:
- Active-active multi-region architecture (both regions handle writes)
- Conflict resolution for simultaneous edits (vector clocks, CRDTs)
- Eventual consistency across regions
- Network partition handling`,
  
  requirements: {
  functional: [
    "Users can create, edit, and share documents",
    "Multiple users can edit the same document simultaneously",
    "Users worldwide can access and edit documents from any location",
    "Users can edit documents even if one region fails (documents available from other regions)",
    "Conflicts from simultaneous edits by different users in different regions are automatically resolved",
    "Edits made in one region eventually sync to all regions"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Latency: P95 < 50ms for local writes",
    "Request Rate: 5k writes/sec per region",
    "Availability: 99.9% per region"
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
      "name": "Accept writes in both regions",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Accept writes in both regions\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Resolve write conflicts",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Resolve write conflicts\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Maintain eventual consistency",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Maintain eventual consistency\" works correctly. Should process asynchronously using message queue.",
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
      "name": "Handle network partitions",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Handle network partitions\" works correctly.",
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
      "name": "Support regional preferences",
      "type": "functional",
      "requirement": "FR-5",
      "description": "Verify \"Support regional preferences\" works correctly.",
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
        "rps": 5000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 50,
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
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 75,
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
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
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
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 125,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 3500 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 4 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 100ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 7500,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 50,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 3000 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 100ms. Without sharding/multi-leader: writes queue up, latency exceeds 250ms.",
      "traffic": {
        "type": "write",
        "rps": 10000,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
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
        "readRatio": 0.7
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
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 150,
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
  "Learn horizontal scaling with load balancers",
  "Understand asynchronous processing patterns",
  "Design appropriate data models"
],
  
  referenceLinks: [],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
events = {}
both = {}
items = {}
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Accept writes in both regions
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Resolve write conflicts
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def maintain_eventual_consistency(**kwargs) -> Dict:
    """
    FR-3: Maintain eventual consistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_network_partitions(**kwargs) -> Dict:
    """
    FR-4: Handle network partitions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_regional_preferences(**kwargs) -> Dict:
    """
    FR-5: Support regional preferences
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
  
  codeChallenges,
  
  solution: {
  components: [
    {
      type: "client",
      config: {
        id: "client_1",
        displayName: "Users (Global)",
        subtitle: "GeoDNS routes to nearest region"
      }
    },
    {
      type: "load_balancer",
      config: {
        id: "load_balancer_1",
        algorithm: "least_connections",
        displayName: "Load Balancers (US-East + EU-West)",
        subtitle: "GeoDNS routes to nearest region"
      }
    },
    {
      type: "app_server",
      config: {
        id: "app_server_1",
        instances: 24,
        displayName: "App Servers",
        subtitle: "12 per region (24 total)",
        autoscaling: {
          enabled: true,
          min: 24,
          max: 48,
          policy: "cpu_70_target"
        },
        regions: [
          "us-east",
          "eu-west"
        ]
      }
    },
    {
      type: "database",
      config: {
        id: "database_1",
        instanceType: "commodity-db",
        dataModel: "relational",
        displayName: "Multi-Leader PostgreSQL",
        subtitle: "26 shards × 11 leaders",
        replicationMode: "multi-leader",
        replication: {
          enabled: true,
          replicas: 10,
          mode: "async"
        },
        sharding: {
          enabled: true,
          shards: 26,
          shardKey: "document_id"
        },
        storageType: "gp3",
        storageSizeGB: 3000,
        isolationLevel: "serializable",
        schema: [
          {
            name: "documents",
            columns: [
              {
                name: "document_id",
                type: "string",
                primaryKey: true,
                nullable: false
              },
              {
                name: "title",
                type: "string",
                nullable: false
              },
              {
                name: "content",
                type: "text",
                nullable: true
              },
              {
                name: "owner_id",
                type: "string",
                nullable: false
              },
              {
                name: "created_at",
                type: "timestamp",
                nullable: false
              },
              {
                name: "updated_at",
                type: "timestamp",
                nullable: false
              },
              {
                name: "version",
                type: "integer",
                nullable: false
              }
            ]
          },
          {
            name: "vector_clocks",
            columns: [
              {
                name: "document_id",
                type: "string",
                primaryKey: true,
                nullable: false
              },
              {
                name: "region_a_version",
                type: "integer",
                nullable: false
              },
              {
                name: "region_b_version",
                type: "integer",
                nullable: false
              },
              {
                name: "last_updated",
                type: "timestamp",
                nullable: false
              }
            ]
          },
          {
            name: "operations",
            columns: [
              {
                name: "operation_id",
                type: "string",
                primaryKey: true,
                nullable: false
              },
              {
                name: "document_id",
                type: "string",
                nullable: false
              },
              {
                name: "operation_type",
                type: "string",
                nullable: false
              },
              {
                name: "position",
                type: "integer",
                nullable: false
              },
              {
                name: "content",
                type: "text",
                nullable: true
              },
              {
                name: "user_id",
                type: "string",
                nullable: false
              },
              {
                name: "region",
                type: "string",
                nullable: false
              },
              {
                name: "timestamp",
                type: "timestamp",
                nullable: false
              },
              {
                name: "vector_clock",
                type: "json",
                nullable: false
              }
            ]
          }
        ]
      }
    },
    {
      type: "cache",
      config: {
        id: "cache_1",
        cacheType: "key-value",
        sizeGB: 48,
        memorySizeGB: 48,
        evictionPolicy: "LRU",
        ttl: 300,
        hitRatio: 0.95,
        strategy: "cache_aside",
        instanceType: "cache.r5.large",
        engine: "redis",
        persistence: "rdb",
        nodes: 3,
        displayName: "Redis Cache Cluster",
        subtitle: "3-node cluster (~48GB)"
      }
    },
    {
      type: "message_queue",
      config: {
        id: "message_queue_1",
        numBrokers: 3,
        numPartitions: 24,
        replicationFactor: 3,
        retentionHours: 24,
        semantics: "at_least_once",
        orderingGuarantee: "partition",
        consumerGroups: 2,
        batchingEnabled: true,
        compressionEnabled: true,
        displayName: "Kafka Replication Stream",
        subtitle: "3 brokers · 24 partitions"
      }
    },
    {
      type: "app_server",
      config: {
        id: "app_server_3",
        instances: 225,
        serviceName: "conflict-resolver",
        displayName: "Conflict Resolver",
        subtitle: "225 workers (CRDT/Vector Clocks)",
        regions: [
          "us-east",
          "eu-west"
        ],
        autoscaling: {
          enabled: true,
          min: 225,
          max: 450,
          policy: "queue_lag"
        }
      }
    }
  ],
  connections: [
    {
      from: "client",
      to: "load_balancer",
      type: "read_write",
      label: "Users → Regional LBs (GeoDNS)"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "read_write",
      label: "LB → App (regional)"
    },
    {
      from: "app_server",
      to: "cache",
      type: "read",
      label: "Read from cache"
    },
    {
      from: "cache",
      to: "database",
      type: "read",
      label: "Cache → DB (on miss)"
    },
    {
      from: "app_server",
      to: "database",
      type: "read_write",
      label: "App → DB"
    },
    {
      from: "database",
      to: "message_queue",
      type: "write",
      label: "DB → Replication Stream"
    },
    {
      from: "message_queue",
      to: "app_server",
      type: "read",
      label: "Conflict Resolver → Stream"
    }
  ],
  explanation: "Reference Solution for Collaborative Document Editor (Active-Active Multi-Region):\n\n📊 Infrastructure Components:\n- **Client**: Users accessing the system (GeoDNS routes to nearest region)\n- **Load Balancers**: Distribute traffic across app servers (US-East + EU-West)\n- **App Servers**: 24 instances total (12 per region) - sized for 15,000 RPS globally\n- **Cache**: 3-node Redis cluster (~48GB) for low-latency reads\n- **Database**: Multi-leader PostgreSQL (26 shards × 11 leaders) with async replication between regions\n- **Message Queue**: Kafka replication stream (3 brokers, 24 partitions) for cross-region sync\n\n🔄 Active-Active Architecture:\n✅ **Dual Write**: Both regions accept writes with local latency (< 50ms)\n✅ **Replication**: Database publishes changes → Message Queue → Conflict Resolver\n✅ **Conflict Resolution**: Worker consumes from stream, resolves conflicts using vector clocks/CRDTs\n✅ **Eventual Consistency**: Changes propagate between regions within 5 seconds\n✅ **Regional Independence**: Each region operates independently if cross-region link fails\n\n🔄 How It Works:\n1. **Local Write Path**: Client → LB (nearest region) → App → Multi-Leader DB (< 50ms p99)\n2. **Local Read Path**: Client → LB → App → Redis cache (hit) → Response (< 10ms p99)\n3. **Replication Path**: Database → Kafka → Conflict Resolver workers → Remote shards\n4. **Cache Miss**: App → Shard (local) → Cache update → Response\n\n💡 Key Design Decisions:\n- **Active-Active**: Both regions handle writes with multi-leader replication\n- **Sharded Storage**: 26 logical shards keep per-leader write throughput low\n- **Replication Stream**: Database publishes all changes to Kafka for bidirectional sync\n- **Conflict Resolution**: Dedicated workers consume replication stream and reconcile updates\n- **Low Latency**: Regional cache tier keeps read latency <10ms, writes stay local\n- **High Availability**: Each region independent, operates during cross-region failures\n\n⚠️ Trade-offs:\n- **Conflict Resolution**: Need vector clocks/CRDTs for simultaneous writes\n- **Eventual Consistency**: Replication lag (up to 5s) between regions\n- **Complexity**: More complex than active-passive setup\n- **Network Costs**: Bidirectional replication increases cross-region bandwidth\n\nThis solution provides an active-active multi-region architecture for handling writes in both regions!"
},
};
