import { Challenge } from '../../types/testCase';

export const experimentationPlatformChallenge: Challenge = {
  id: 'experimentation_platform',
  title: 'Experimentation Platform (A/B Testing)',
  difficulty: 'advanced',
  description: `Design an experimentation platform for A/B testing product features.

Product teams create experiments, assign users to variants, track metrics, and analyze results
for statistical significance. The system handles experiment interference and ensures consistent
user bucketing.

Example workflow:
- POST /experiments → Create experiment with variants A/B
- GET /assign?user=123&exp=search-algo → Assign user to variant
- POST /events → Track user actions (clicks, conversions)
- GET /experiments/:id/results → View statistical analysis

Key challenges:
- Consistent user bucketing (same user always gets same variant)
- Experiment interference detection (overlapping experiments)
- Statistical significance calculation (p-values, confidence intervals)
- High-throughput event tracking (millions of events/day)`,

  requirements: {
    functional: [
      'Create experiments with multiple variants',
      'Assign users to variants (consistent hashing)',
      'Track user events and metrics',
      'Calculate statistical significance',
      'Detect experiment interference',
    ],
    traffic: '10,000 RPS (50% assignments, 50% events)',
    latency: 'p99 < 10ms for assignment, < 100ms for events',
    availability: '99.99% uptime (experiment downtime = lost data)',
    budget: '$8,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'analytics_db',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Experiment Assignment',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users are consistently assigned to experiment variants.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 10,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 10 } },
          { type: 'redis', config: { memorySizeGB: 32 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 100 } },
          { type: 'kafka', config: { partitions: 20 } },
          { type: 'clickhouse', config: { nodes: 3 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'clickhouse' },
        ],
        explanation: `Architecture:
- Redis caches experiment configs and user assignments
- PostgreSQL stores experiment metadata
- Kafka streams events for async processing
- ClickHouse for analytics (fast aggregations)
- Consistent hashing for user bucketing`,
      },
    },

    {
      name: 'Consistent User Bucketing',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Same user always gets same variant across sessions.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 10,
        consistencyRate: 1.0, // 100% consistent
      },
      hints: [
        'Use deterministic hash: hash(user_id + experiment_id) % 100',
        'Cache assignments in Redis (never expire during experiment)',
        'Handle hash collisions with stable ordering',
        'Account for variant traffic split (e.g., 90/10, not just 50/50)',
      ],
    },

    {
      name: 'Event Tracking at Scale',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Track millions of user events with low latency.',
      traffic: {
        type: 'write',
        rps: 5000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 100,
      },
      hints: [
        'Async event ingestion via Kafka (fire-and-forget)',
        'Batch events in client before sending',
        'Use ClickHouse for fast analytical queries',
        'Partition events by date for efficient queries',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Ultra-Low Latency Assignment',
      type: 'performance',
      requirement: 'NFR-P',
      description: '10,000 RPS assignments with p99 < 10ms.',
      traffic: {
        type: 'read',
        rps: 10000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 10,
      },
      hints: [
        'In-memory evaluation (no DB lookup)',
        'Preload experiment configs into Redis',
        'Compute hash locally (no network call)',
        'Use CDN edge for assignment logic',
      ],
    },

    {
      name: 'Statistical Analysis Speed',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Compute experiment results in < 5 seconds.',
      traffic: {
        type: 'analytics',
        rps: 10,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxAnalysisLatency: 5000,
      },
      hints: [
        'Pre-aggregate metrics hourly (reduce query time)',
        'Use ClickHouse materialized views',
        'Cache recent results (5min TTL)',
        'Incremental computation (not full recalc)',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Concurrent Experiments',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Run 1000 concurrent experiments without interference.',
      traffic: {
        type: 'mixed',
        rps: 5000,
        readRatio: 0.6,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 15,
      },
      hints: [
        'Namespace experiments by product area',
        'Detect overlapping user segments',
        'Warn if >10 experiments affect same user',
        'Use experiment layers for orthogonal tests',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Zero Event Loss',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'No events lost even during outages.',
      traffic: {
        type: 'write',
        rps: 3000,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        eventLossRate: 0.0,
      },
      hints: [
        'Kafka for durable event storage (replication factor 3)',
        'Client-side retry with exponential backoff',
        'Dead letter queue for failed events',
        'Idempotent event processing (dedup by event_id)',
      ],
    },
  ],

  hints: [
    {
      category: 'User Bucketing',
      items: [
        'Hash function: FNV-1a or MurmurHash (fast, good distribution)',
        'Bucketing: hash(user_id + exp_id + salt) % 100 < traffic_percent',
        'Salt prevents correlation between experiments',
        'Cache assignments to ensure consistency',
      ],
    },
    {
      category: 'Statistical Analysis',
      items: [
        'T-test for continuous metrics (revenue, time on site)',
        'Chi-square test for categorical metrics (click rate)',
        'Calculate p-value and confidence intervals',
        'Require minimum sample size (power analysis)',
      ],
    },
    {
      category: 'Experiment Interference',
      items: [
        'Track which experiments each user is in',
        'Warn if >10% user overlap between experiments',
        'Use layers: Exp layer 1 (UI), layer 2 (backend)',
        'Orthogonal experiments can run simultaneously',
      ],
    },
    {
      category: 'Data Model',
      items: [
        'Experiments: id, name, variants[], start_date, end_date, traffic_split',
        'Assignments: user_id, experiment_id, variant, assigned_at',
        'Events: user_id, experiment_id, variant, event_type, timestamp, properties',
        'Results: experiment_id, variant, metric, value, p_value',
      ],
    },
  ],

  learningObjectives: [
    'Consistent hashing for user bucketing',
    'Statistical hypothesis testing (t-test, chi-square)',
    'High-throughput event streaming with Kafka',
    'Experiment interference detection',
    'OLAP databases for analytics (ClickHouse)',
  ],

  realWorldExample: `**Optimizely:**
- Client-side and server-side experimentation
- Feature flags + A/B tests
- Stats engine with Bayesian analysis
- Multi-armed bandit optimization

**Google Experiments:**
- Layered experiments (orthogonal dimensions)
- Automatic significance detection
- Integration with analytics and metrics
- Guardrail metrics (prevent negative impact)

**Facebook Gatekeeper:**
- Feature gating and experiments
- Persistent assignments (sticky bucketing)
- Automatic rollout based on metrics
- Experiment analysis pipeline`,

  pythonTemplate: `from typing import Dict, List
import hashlib

class ExperimentationPlatform:
    def __init__(self):
        self.cache = None  # Redis
        self.db = None  # PostgreSQL
        self.events = None  # Kafka
        self.analytics = None  # ClickHouse

    def create_experiment(self, name: str, variants: List[str],
                         traffic_split: Dict[str, float]) -> str:
        """Create a new experiment."""
        # TODO: Validate traffic_split sums to 100%
        # TODO: Store experiment config in DB
        # TODO: Preload into Redis cache
        # TODO: Return experiment ID
        pass

    def assign_user(self, user_id: str, experiment_id: str) -> str:
        """Assign user to experiment variant (consistent)."""
        # TODO: Check cache for existing assignment
        # TODO: Compute hash: hash(user_id + exp_id) % 100
        # TODO: Map hash to variant based on traffic split
        # TODO: Cache assignment
        # TODO: Return variant name
        pass

    def track_event(self, user_id: str, experiment_id: str,
                   event_type: str, properties: Dict):
        """Track user event for experiment analysis."""
        # TODO: Get user's variant assignment
        # TODO: Create event record
        # TODO: Send to Kafka asynchronously
        # TODO: Return immediately (don't wait for ack)
        pass

    def get_results(self, experiment_id: str) -> Dict:
        """Calculate experiment results and statistical significance."""
        # TODO: Query aggregated metrics from ClickHouse
        # TODO: Calculate conversion rates per variant
        # TODO: Run t-test or chi-square test
        # TODO: Return p-value and confidence intervals
        return {}

    def check_interference(self, experiment_ids: List[str]) -> Dict:
        """Detect experiment interference (user overlap)."""
        # TODO: Query assignments for all experiments
        # TODO: Calculate user overlap percentage
        # TODO: Warn if overlap > 10%
        return {}

    def _consistent_hash(self, user_id: str, experiment_id: str) -> int:
        """Compute consistent hash for user bucketing."""
        key = f"{user_id}:{experiment_id}"
        hash_val = int(hashlib.md5(key.encode()).hexdigest(), 16)
        return hash_val % 100

# Example usage
if __name__ == '__main__':
    platform = ExperimentationPlatform()

    # Create experiment
    exp_id = platform.create_experiment(
        name='Search Algorithm Test',
        variants=['control', 'treatment'],
        traffic_split={'control': 50.0, 'treatment': 50.0}
    )

    # Assign user
    variant = platform.assign_user('user_123', exp_id)

    # Track event
    platform.track_event('user_123', exp_id, 'click', {'button': 'search'})

    # Get results
    results = platform.get_results(exp_id)`,
};
