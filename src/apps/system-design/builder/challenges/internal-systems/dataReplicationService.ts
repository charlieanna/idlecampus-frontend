import { Challenge } from '../../types/testCase';

export const dataReplicationServiceChallenge: Challenge = {
  id: 'data_replication_service',
  title: 'Data Replication Service (Cross-Region)',
  difficulty: 'advanced',
  description: `Design a data replication service for cross-region database replication.

Replicate data from primary region to multiple secondary regions for disaster recovery and
low-latency reads. Handle network partitions, replication lag, and conflict resolution.

Example workflow:
- Write to primary region → Async replication to secondaries
- Monitor replication lag (should be < 1 second)
- Handle conflicts (last-write-wins, custom resolution)
- Failover to secondary on primary failure

Key challenges:
- Low replication lag (<1s for most writes)
- Network partition handling
- Conflict resolution strategies
- Consistency guarantees (eventual, strong, causal)`,

  requirements: {
    functional: [
      'Async replication from primary to secondaries',
      'Replication lag monitoring and alerting',
      'Conflict resolution (LWW, custom rules)',
      'Failover and failback automation',
      'Data consistency verification',
    ],
    traffic: '50,000 writes/sec at primary',
    latency: 'Replication lag p99 < 1s',
    availability: '99.99% uptime',
    budget: '$15,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'database',
    'cache',
    'message_queue',
    'app_server',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Replication',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Replicate writes from primary to secondary regions.',
      traffic: {
        type: 'write',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        replicationLag: 1000, // <1s
        dataLoss: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000, regions: 3 } },
          { type: 'kafka', config: { partitions: 50 } },
          { type: 'redis', config: { memorySizeGB: 16 } },
          { type: 'app_server', config: { instances: 5 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'postgresql' },
          { from: 'postgresql', to: 'kafka' },
          { from: 'kafka', to: 'postgresql' },
        ],
        explanation: `Architecture:
- Primary DB captures changes (CDC)
- Kafka streams changes to secondaries
- Secondary DBs apply changes
- Redis tracks replication lag`,
      },
    },

    {
      name: 'Conflict Resolution',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Resolve conflicts from concurrent writes.',
      traffic: {
        type: 'write',
        rps: 500,
        conflictRate: 0.05, // 5% writes conflict
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        conflictResolutionRate: 1.0,
      },
      hints: [
        'Last-write-wins (LWW) based on timestamp',
        'Version vectors for causality',
        'Custom resolution rules (e.g., max value wins)',
        'Conflict log for manual review',
      ],
    },

    {
      name: 'Replication Lag Monitoring',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Track and alert on replication lag.',
      traffic: {
        type: 'write',
        rps: 2000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        p99ReplicationLag: 1000, // <1s
        alertLatency: 10000, // Alert within 10s
      },
      hints: [
        'Track: latest sequence number at primary and secondaries',
        'Lag = time_now - timestamp_of_last_applied_change',
        'Alert if lag > 5 seconds',
        'Dashboard with per-region lag',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High Write Throughput',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Replicate 50K writes/sec with <1s lag.',
      traffic: {
        type: 'write',
        rps: 50000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        p99ReplicationLag: 1000,
        throughput: 50000,
      },
      hints: [
        'Batch changes before sending to Kafka',
        'Parallel apply on secondaries (per-table)',
        'Compression for cross-region transfer',
        'Dedicated network links for replication',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Multi-Region Replication',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Replicate to 5 secondary regions.',
      traffic: {
        type: 'write',
        rps: 10000,
        regions: 6, // 1 primary + 5 secondaries
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        p99ReplicationLag: 2000, // <2s for distant regions
      },
      hints: [
        'Fan-out replication (primary → all secondaries)',
        'Or hierarchical (primary → nearby → distant)',
        'Per-region Kafka topics',
        'Monitor lag per region separately',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Network Partition Tolerance',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Continue replication after network partition heals.',
      traffic: {
        type: 'write',
        rps: 1000,
        networkPartition: true,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        dataLoss: 0,
        recoveryTime: 30000, // <30s to catch up
      },
      hints: [
        'Buffer changes during partition',
        'Resume from last checkpoint on heal',
        'Detect partition with heartbeats',
        'Backfill missing changes',
      ],
    },
  ],

  hints: [
    {
      category: 'Replication Methods',
      items: [
        'CDC: Capture changes from DB logs (Debezium)',
        'Trigger-based: DB triggers emit events',
        'Application-level: App writes to queue',
        'Logical replication: PostgreSQL native',
      ],
    },
    {
      category: 'Consistency Models',
      items: [
        'Eventual: Reads may be stale, simple',
        'Causal: Preserve causality (version vectors)',
        'Strong: Synchronous replication (slow)',
        'Per-table: Choose model per table',
      ],
    },
    {
      category: 'Conflict Resolution',
      items: [
        'LWW: Use timestamp (simple, data loss possible)',
        'LWW with version: Detect concurrent writes',
        'CRDT: Conflict-free replicated data types',
        'Custom: Business logic (e.g., sum values)',
      ],
    },
    {
      category: 'Optimization',
      items: [
        'Compression: Snappy for speed',
        'Batching: Send 100 changes/batch',
        'Parallel apply: Multiple workers per secondary',
        'Checkpointing: Resume from last position',
      ],
    },
  ],

  learningObjectives: [
    'Cross-region replication architectures',
    'Change data capture (CDC) techniques',
    'Conflict resolution strategies',
    'Replication lag monitoring',
    'Network partition handling',
  ],

  realWorldExample: `**MySQL Replication:**
- Binlog-based replication
- Async, semi-sync, or group replication
- GTID for failover
- Parallel apply threads

**PostgreSQL Logical Replication:**
- Publish-subscribe model
- Row-level filtering
- Multi-master with conflict resolution
- Selective table replication

**AWS DMS:**
- Continuous replication
- Homogeneous and heterogeneous
- CDC from multiple sources
- Validation and monitoring`,

  pythonTemplate: `from typing import Dict, List
from datetime import datetime

class DataReplicationService:
    def __init__(self):
        self.primary_db = None
        self.secondary_dbs = []
        self.replication_log = None  # Kafka
        self.lag_tracker = None  # Redis

    def capture_changes(self) -> List[Dict]:
        """Capture changes from primary database."""
        # TODO: Read from DB binlog/WAL
        # TODO: Parse changes (insert, update, delete)
        # TODO: Add sequence number and timestamp
        # TODO: Send to Kafka
        return []

    def replicate_change(self, change: Dict, region: str):
        """Apply change to secondary region."""
        # TODO: Get secondary DB connection
        # TODO: Check for conflicts
        # TODO: Apply change (insert/update/delete)
        # TODO: Update lag tracker
        pass

    def detect_conflict(self, change: Dict, region: str) -> bool:
        """Detect if change conflicts with existing data."""
        # TODO: Check version/timestamp
        # TODO: Compare with current value
        # TODO: Return true if conflict
        return False

    def resolve_conflict(self, local: Dict, remote: Dict) -> Dict:
        """Resolve conflict between local and remote changes."""
        # TODO: Last-write-wins based on timestamp
        # TODO: Or use version vectors
        # TODO: Or custom business logic
        # TODO: Log conflict for audit
        if local['timestamp'] > remote['timestamp']:
            return local
        return remote

    def monitor_lag(self, region: str) -> int:
        """Monitor replication lag for region."""
        # TODO: Get latest sequence at primary
        # TODO: Get latest applied sequence at secondary
        # TODO: Calculate lag in milliseconds
        # TODO: Alert if lag > threshold
        return 500  # 500ms lag

    def failover(self, from_region: str, to_region: str):
        """Failover from primary to secondary region."""
        # TODO: Stop writes to old primary
        # TODO: Promote secondary to primary
        # TODO: Reconfigure replication topology
        # TODO: Update DNS/load balancer
        pass

    def verify_consistency(self, table: str) -> Dict:
        """Verify data consistency across regions."""
        # TODO: Checksum primary table
        # TODO: Checksum secondary tables
        # TODO: Compare checksums
        # TODO: Report discrepancies
        return {'consistent': True, 'rows_checked': 1000000}

# Example usage
if __name__ == '__main__':
    service = DataReplicationService()

    # Capture and replicate
    changes = service.capture_changes()
    for change in changes:
        for region in ['us-west', 'eu-west', 'ap-south']:
            service.replicate_change(change, region)

    # Monitor lag
    lag = service.monitor_lag('us-west')
    print(f"Replication lag: {lag}ms")

    # Failover
    service.failover(from_region='us-east', to_region='us-west')`,
};
