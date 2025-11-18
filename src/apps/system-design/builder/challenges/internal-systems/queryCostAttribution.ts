import { Challenge } from '../../types/testCase';

export const queryCostAttributionChallenge: Challenge = {
  id: 'query_cost_attribution',
  title: 'Query Cost Attribution System',
  difficulty: 'advanced',
  description: `Design a system to track and attribute data warehouse query costs to teams/projects.

Track resource usage (CPU, memory, I/O) for each query, calculate costs, and provide chargeback
reports. Help teams optimize expensive queries and set budget alerts.

Example workflow:
- Query runs → Track resources (CPU-sec, bytes scanned, duration)
- POST /attribution → Attribute cost to team/project based on query owner
- GET /costs?team=data-science&month=2024-01 → View monthly costs
- POST /budgets → Set budget alerts for teams

Key challenges:
- Accurate resource tracking per query
- Cost calculation with multiple factors (compute, storage, network)
- Real-time cost tracking vs batch billing
- Attribution complexity (shared queries, scheduled jobs)`,

  requirements: {
    functional: [
      'Track query resource usage (CPU, memory, I/O, data scanned)',
      'Calculate cost per query using pricing model',
      'Attribute costs to teams/projects',
      'Budget alerts and cost anomaly detection',
      'Optimization recommendations for expensive queries',
    ],
    traffic: '10,000 queries/hour to track',
    latency: 'Cost attribution < 1s, reports < 5s',
    availability: '99.9% uptime',
    budget: '$3,000/month',
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
      name: 'Basic Query Cost Tracking',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Track resource usage for each query and calculate cost.',
      traffic: {
        type: 'write',
        rps: 50,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 1000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 100 } },
          { type: 'kafka', config: { partitions: 10 } },
          { type: 'clickhouse', config: { nodes: 2 } },
          { type: 'redis', config: { memorySizeGB: 8 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'clickhouse' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Architecture:
- Query engine emits usage metrics (CPU, memory, bytes scanned)
- Kafka streams metrics for async processing
- ClickHouse stores time-series cost data
- PostgreSQL stores attribution rules and budgets
- Redis caches pricing models and team mappings`,
      },
    },

    {
      name: 'Cost Attribution to Teams',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Attribute query costs to correct team/project.',
      traffic: {
        type: 'mixed',
        rps: 100,
        readRatio: 0.7,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 500,
        attributionAccuracy: 0.99, // 99% correct attribution
      },
      hints: [
        'Extract team from query labels/tags',
        'Fall back to user ownership mapping',
        'Handle shared queries (split cost)',
        'Manual override for misattributed queries',
      ],
    },

    {
      name: 'Budget Alerts',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Alert teams when they exceed budget thresholds.',
      traffic: {
        type: 'write',
        rps: 20,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        alertLatency: 60000, // Alert within 1 minute
      },
      hints: [
        'Check budget every hour (not per query)',
        'Alert at 80%, 90%, 100% thresholds',
        'Rate limit alerts (max 1 per hour)',
        'Include top expensive queries in alert',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High Volume Query Tracking',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Track 10,000 queries/hour with minimal overhead.',
      traffic: {
        type: 'write',
        rps: 100, // ~10K/hour
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 1000,
        trackingOverhead: 0.05, // <5% query overhead
      },
      hints: [
        'Async metric emission (don\'t block query)',
        'Batch metrics before sending to Kafka',
        'Sample low-cost queries (track 100% of expensive ones)',
        'Lightweight instrumentation in query engine',
      ],
    },

    {
      name: 'Fast Cost Report Generation',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Generate monthly cost reports in < 5s.',
      traffic: {
        type: 'analytics',
        rps: 10,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxReportLatency: 5000,
      },
      hints: [
        'Pre-aggregate costs hourly/daily',
        'Materialize views for common reports',
        'Cache recent reports (1hr TTL)',
        'Use ClickHouse for fast aggregations',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Multi-Tenant Cost Tracking',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Track costs for 1000 teams and 100K users.',
      traffic: {
        type: 'write',
        rps: 200,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 1000,
      },
      hints: [
        'Partition ClickHouse by month',
        'Index on team_id for fast filtering',
        'Archive old data (>2 years) to S3',
        'Separate tables for raw metrics vs aggregated costs',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Cost Calculation Accuracy',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Ensure 99.99% accuracy in cost calculations.',
      traffic: {
        type: 'mixed',
        rps: 100,
        readRatio: 0.5,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        costAccuracy: 0.9999, // 99.99% accuracy
      },
      hints: [
        'Validate pricing model changes before applying',
        'Reconcile with actual cloud bills monthly',
        'Audit trail for cost adjustments',
        'Detect anomalies (sudden 10x cost spike)',
      ],
    },
  ],

  hints: [
    {
      category: 'Resource Tracking',
      items: [
        'Metrics: cpu_seconds, memory_gb_seconds, bytes_scanned, bytes_written',
        'Extract from query engine telemetry (Presto/BigQuery)',
        'Include network transfer costs',
        'Track slot time for warehouse-based pricing',
      ],
    },
    {
      category: 'Cost Calculation',
      items: [
        'Pricing model: compute ($X per CPU-hour) + storage ($Y per GB-month) + network ($Z per GB)',
        'Update pricing daily from cloud provider',
        'Apply discounts (committed use, sustained use)',
        'Include overhead costs (cluster management)',
      ],
    },
    {
      category: 'Attribution Rules',
      items: [
        'Priority: Query label > User team > Project default',
        'Shared queries: Split cost by usage ratio',
        'System queries: Attribute to infrastructure team',
        'Scheduled jobs: Attribute to job owner',
      ],
    },
    {
      category: 'Optimization Recommendations',
      items: [
        'Identify full table scans (suggest partitioning)',
        'Detect repeated queries (suggest caching)',
        'Find unused materialized views',
        'Recommend query rewrites for cost reduction',
      ],
    },
  ],

  learningObjectives: [
    'Resource usage tracking in data warehouses',
    'Cost modeling with multiple factors',
    'Chargeback and showback systems',
    'Budget management and alerting',
    'Cost optimization recommendations',
  ],

  realWorldExample: `**Google BigQuery:**
- Per-query pricing based on bytes scanned
- Flat-rate reservations for predictable costs
- Query cost estimates before execution
- Cost breakdown by project/dataset

**AWS Athena:**
- $5 per TB scanned
- Cost control with query result reuse
- Workgroup-based cost allocation
- Integration with Cost Explorer

**Snowflake:**
- Credit-based pricing (compute + storage)
- Per-second billing with auto-suspend
- Resource monitors and budgets
- Query acceleration service`,

  pythonTemplate: `from typing import Dict, List
from datetime import datetime, timedelta

class QueryCostAttribution:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.analytics = None  # ClickHouse
        self.queue = None  # Kafka
        self.cache = None  # Redis

    def track_query_cost(self, query_id: str, user_id: str,
                        resources: Dict) -> float:
        """Track resource usage and calculate cost for a query."""
        # TODO: Extract metrics (CPU, memory, bytes scanned)
        # TODO: Load pricing model from cache
        # TODO: Calculate cost = compute_cost + storage_cost + network_cost
        # TODO: Emit to Kafka for async processing
        # TODO: Return total cost
        pass

    def attribute_cost(self, query_id: str, cost: float) -> str:
        """Attribute query cost to team/project."""
        # TODO: Check query labels for team tag
        # TODO: Fall back to user's team
        # TODO: Handle shared queries (split cost)
        # TODO: Store attribution in ClickHouse
        # TODO: Return team_id
        pass

    def get_team_costs(self, team_id: str, start_date: datetime,
                      end_date: datetime) -> Dict:
        """Get cost breakdown for a team."""
        # TODO: Query ClickHouse for team's queries
        # TODO: Aggregate by date, user, query type
        # TODO: Include top expensive queries
        # TODO: Cache recent results
        return {}

    def check_budget(self, team_id: str) -> Dict:
        """Check if team is within budget."""
        # TODO: Get team's monthly budget
        # TODO: Calculate current month's spending
        # TODO: Return percentage used and remaining
        return {'budget': 10000, 'spent': 7500, 'percent': 75.0}

    def send_budget_alert(self, team_id: str, percent: float):
        """Send budget alert to team."""
        # TODO: Check if alert already sent (rate limit)
        # TODO: Get top expensive queries for team
        # TODO: Format alert message
        # TODO: Send via Slack/email
        pass

    def recommend_optimizations(self, query_id: str) -> List[str]:
        """Recommend cost optimizations for expensive query."""
        # TODO: Analyze query plan
        # TODO: Check for full table scans
        # TODO: Identify missing indexes/partitions
        # TODO: Suggest query rewrites
        return [
            'Add partition filter to reduce bytes scanned',
            'Use materialized view instead of join',
            'Cache result for repeated query'
        ]

    def reconcile_costs(self, month: str) -> Dict:
        """Reconcile attributed costs with actual cloud bill."""
        # TODO: Sum all attributed costs for month
        # TODO: Get actual cloud bill amount
        # TODO: Calculate variance
        # TODO: Identify unattributed costs
        return {'attributed': 50000, 'actual': 51000, 'variance': 1000}

# Example usage
if __name__ == '__main__':
    system = QueryCostAttribution()

    # Track query cost
    cost = system.track_query_cost(
        query_id='q123',
        user_id='alice',
        resources={
            'cpu_seconds': 120,
            'memory_gb_seconds': 50,
            'bytes_scanned': 1000000000  # 1 GB
        }
    )

    # Attribution
    team_id = system.attribute_cost('q123', cost)

    # Get team costs
    costs = system.get_team_costs(
        team_id='data-science',
        start_date=datetime(2024, 1, 1),
        end_date=datetime(2024, 1, 31)
    )

    # Check budget
    budget_status = system.check_budget('data-science')

    # Get recommendations
    tips = system.recommend_optimizations('q123')`,
};
