import { Challenge } from '../../types/testCase';

export const resourceQuotaManagementChallenge: Challenge = {
  id: 'resource_quota_management',
  title: 'Resource Quota Management System',
  difficulty: 'advanced',
  description: `Design a resource quota management system for multi-tenant infrastructure.

Allocate and enforce quotas for CPU, memory, storage per team/project. Support reservations,
overcommit strategies, and quota transfers. Prevent resource exhaustion and ensure fair sharing.

Example workflow:
- POST /quotas → Allocate quota: team-A gets 100 CPUs
- Request resource → Check quota, decrement if available
- Monitor usage → Alert when team exceeds 80% quota
- Transfer quota → team-A transfers 20 CPUs to team-B

Key challenges:
- Fast quota checking (< 1ms per request)
- Overcommit strategies (allocate more than physical capacity)
- Quota transfers and temporary increases
- Fair sharing across teams`,

  requirements: {
    functional: [
      'Allocate quotas per team/project (CPU, memory, storage)',
      'Real-time quota enforcement',
      'Usage tracking and alerts',
      'Quota transfers between teams',
      'Reservation system (guaranteed resources)',
    ],
    traffic: '100,000 quota checks/sec',
    latency: 'Quota check < 1ms',
    availability: '99.99% uptime',
    budget: '$2,500/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Quota Allocation and Enforcement',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Allocate quotas and enforce limits.',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRatio: 0.9,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        quotaViolations: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { memorySizeGB: 16 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 200 } },
          { type: 'kafka', config: { partitions: 20 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'kafka' },
        ],
        explanation: `Architecture:
- Redis for fast quota checks (in-memory)
- PostgreSQL stores quota allocations
- Kafka streams usage events for async aggregation
- App servers enforce quota limits`,
      },
    },

    {
      name: 'Overcommit Strategy',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Allocate more quota than physical capacity (overcommit).',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.8,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        overcommitRatio: 1.5, // 150% allocation
        resourceExhaustion: 0,
      },
      hints: [
        'Overcommit: Allocate 150% of capacity (not all teams use 100%)',
        'Track actual usage vs quota',
        'Reclaim unused quota automatically',
        'Prioritize: Guaranteed > burstable > best-effort',
      ],
    },

    {
      name: 'Quota Transfer',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Transfer quota between teams.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        transferLatency: 100, // <100ms
      },
      hints: [
        'Atomic transfer: Deduct from A, add to B',
        'Require approval from both teams',
        'Track transfer history',
        'Support temporary transfers (expire after N days)',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Ultra-Fast Quota Checks',
      type: 'performance',
      requirement: 'NFR-P',
      description: '100K quota checks/sec with < 1ms latency.',
      traffic: {
        type: 'read',
        rps: 100000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 1,
      },
      hints: [
        'In-memory quota tracking (Redis)',
        'Pre-compute available quota',
        'Batch updates to reduce contention',
        'Shard by team_id for parallelism',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Multi-Tenant Scale',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Manage quotas for 10,000 teams.',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.95,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 2,
      },
      hints: [
        'Partition quota data by team prefix',
        'Lazy load quota for inactive teams',
        'Cache hot teams (top 10% of usage)',
        'Archive quota history (>1 year old)',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Quota Consistency',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Ensure quota usage never exceeds limit.',
      traffic: {
        type: 'mixed',
        rps: 5000,
        readRatio: 0.9,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        quotaViolations: 0,
        overagePercent: 0, // No overages
      },
      hints: [
        'Atomic increment/decrement (Redis INCRBY)',
        'Pre-check before allocation',
        'Grace period for soft limits',
        'Hard stop at hard limits',
      ],
    },
  ],

  hints: [
    {
      category: 'Quota Types',
      items: [
        'Guaranteed: Reserved, always available',
        'Burstable: Best-effort above guarantee',
        'Best-effort: No guarantee, use if available',
        'Per-resource: CPU, memory, storage, network',
      ],
    },
    {
      category: 'Overcommit Strategies',
      items: [
        'Ratio: Allocate 1.5-2x physical capacity',
        'Statistical: Based on historical usage patterns',
        'Prioritization: Guarantee > burst > best-effort',
        'Reclamation: Take back unused quota',
      ],
    },
    {
      category: 'Usage Tracking',
      items: [
        'Real-time: Redis counters (current usage)',
        'Historical: ClickHouse (trends, analytics)',
        'Alerting: Notify at 80%, 90%, 100%',
        'Reconciliation: Periodic audit vs actual usage',
      ],
    },
    {
      category: 'Fair Sharing',
      items: [
        'Equal: Each team gets same quota',
        'Proportional: Based on team size or tier',
        'Priority: Higher-tier teams get more',
        'Market: Teams bid for quota',
      ],
    },
  ],

  learningObjectives: [
    'Resource quota enforcement mechanisms',
    'Overcommit strategies and risk management',
    'Fair resource sharing algorithms',
    'High-performance quota checking',
    'Quota transfer and reservation systems',
  ],

  realWorldExample: `**Kubernetes Resource Quotas:**
- Namespace-level quotas (CPU, memory, pods)
- ResourceQuota objects
- LimitRange for default limits
- Priority classes for scheduling

**Google Borg/Kubernetes:**
- Guaranteed vs burstable QoS classes
- Overcommit with best-effort eviction
- Quota enforcement at admission
- Resource reclamation

**AWS Service Quotas:**
- Per-service, per-region limits
- Soft limits (can request increase)
- Hard limits (cannot exceed)
- Quota monitoring via CloudWatch`,

  pythonTemplate: `from typing import Dict
from enum import Enum

class ResourceType(Enum):
    CPU = 'cpu'
    MEMORY = 'memory'
    STORAGE = 'storage'
    GPU = 'gpu'

class QuotaClass(Enum):
    GUARANTEED = 'guaranteed'
    BURSTABLE = 'burstable'
    BEST_EFFORT = 'best_effort'

class ResourceQuotaManagement:
    def __init__(self):
        self.cache = None  # Redis
        self.db = None  # PostgreSQL
        self.events = None  # Kafka

    def allocate_quota(self, team_id: str, resource: ResourceType,
                      amount: float, quota_class: QuotaClass):
        """Allocate resource quota to team."""
        # TODO: Check total capacity
        # TODO: Support overcommit
        # TODO: Store in PostgreSQL
        # TODO: Load into Redis for fast checks
        pass

    def check_quota(self, team_id: str, resource: ResourceType,
                   requested: float) -> bool:
        """Check if team has available quota."""
        # TODO: Get current usage from Redis
        # TODO: Get quota limit
        # TODO: Return true if usage + requested <= limit
        return True

    def consume_quota(self, team_id: str, resource: ResourceType,
                     amount: float) -> bool:
        """Consume quota (atomic operation)."""
        # TODO: Atomic increment in Redis
        # TODO: Check if exceeds limit
        # TODO: Rollback if exceeded
        # TODO: Return success
        return True

    def release_quota(self, team_id: str, resource: ResourceType,
                     amount: float):
        """Release quota back to pool."""
        # TODO: Atomic decrement in Redis
        # TODO: Emit usage event to Kafka
        pass

    def transfer_quota(self, from_team: str, to_team: str,
                      resource: ResourceType, amount: float):
        """Transfer quota between teams."""
        # TODO: Atomic: Deduct from source, add to dest
        # TODO: Validate transfer (sufficient quota)
        # TODO: Record transfer history
        # TODO: Notify both teams
        pass

    def get_usage(self, team_id: str) -> Dict:
        """Get current usage for team."""
        # TODO: Query Redis for current usage
        # TODO: Query quota limits
        # TODO: Calculate percentage used
        return {
            'cpu': {'used': 75, 'limit': 100, 'percent': 75.0},
            'memory': {'used': 512, 'limit': 1024, 'percent': 50.0}
        }

    def set_alert_threshold(self, team_id: str, resource: ResourceType,
                           threshold_percent: float):
        """Set alert when usage exceeds threshold."""
        # TODO: Store threshold in database
        # TODO: Check on each quota consumption
        # TODO: Send alert via Slack/email
        pass

    def reclaim_unused(self):
        """Reclaim quota from inactive teams."""
        # TODO: Find teams with low utilization (<20%)
        # TODO: Reduce their quota to actual usage + buffer
        # TODO: Reallocate to teams requesting more
        pass

    def calculate_overcommit_ratio(self) -> float:
        """Calculate current overcommit ratio."""
        # TODO: Sum all allocated quotas
        # TODO: Divide by physical capacity
        # TODO: Return ratio (e.g., 1.5 = 150% overcommit)
        return 1.5

# Example usage
if __name__ == '__main__':
    quota_mgr = ResourceQuotaManagement()

    # Allocate quota
    quota_mgr.allocate_quota(
        team_id='team-a',
        resource=ResourceType.CPU,
        amount=100,
        quota_class=QuotaClass.GUARANTEED
    )

    # Check quota
    can_allocate = quota_mgr.check_quota('team-a', ResourceType.CPU, 10)

    # Consume quota
    if can_allocate:
        quota_mgr.consume_quota('team-a', ResourceType.CPU, 10)

    # Get usage
    usage = quota_mgr.get_usage('team-a')

    # Transfer
    quota_mgr.transfer_quota('team-a', 'team-b', ResourceType.CPU, 20)

    # Release
    quota_mgr.release_quota('team-a', ResourceType.CPU, 5)`,
};
