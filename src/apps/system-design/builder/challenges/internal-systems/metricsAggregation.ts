import { Challenge } from '../../types/testCase';

export const metricsAggregationChallenge: Challenge = {
  id: 'metrics_aggregation',
  title: 'Metrics Aggregation Service (Google Monarch / Uber M3)',
  difficulty: 'advanced',
  description: `Design an internal metrics aggregation system for monitoring time-series data.

Services emit metrics (counters, gauges, histograms):
- api_server.requests.count = 1000
- api_server.latency.p99 = 250ms
- database.connections = 50

The system must:
- Ingest 1M metrics/sec
- Store with multiple retention periods (1 day high-res, 30 days rolled-up)
- Query with <1s latency
- Handle high cardinality (millions of unique time series)

Example query:
- GET /query?metric=api_requests&aggregation=sum&window=5m&group_by=service
- Returns: {api_server: 50000, worker: 30000}

Key challenges:
- High cardinality (service × endpoint × region × ... = millions of series)
- Downsampling (1s resolution → 1m resolution after 24h)
- Fast queries over large time ranges
- Cost optimization (storage grows quickly)`,

  requirements: {
    functional: [
      'Ingest time-series metrics (1M/sec)',
      'Multi-resolution storage (1s, 1m, 1h, 1d)',
      'Aggregation queries (sum, avg, max, min, p99)',
      'Group by dimensions (service, region, etc.)',
      'Downsampling and compaction',
    ],
    traffic: '1M metrics/sec writes, 10,000 queries/sec reads',
    latency: 'p99 < 100ms for writes, < 1s for queries',
    availability: '99.9% uptime',
    budget: '$12,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Metric Ingestion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Ingest counter, gauge, and histogram metrics.',
      traffic: {
        type: 'write',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.01,
        maxP99Latency: 100,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 10 } },
          { type: 'postgresql', config: { readCapacity: 20000, writeCapacity: 50000 } },
          { type: 'message_queue', config: { maxThroughput: 100000 } },
          { type: 's3', config: { storageSizeGB: 50000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Metrics ingestion architecture:

**Components:**
- Message Queue: Buffer metrics (handle spikes)
- PostgreSQL: Recent metrics (last 24h, high resolution)
- S3: Historical metrics (24h+, downsampled)
- App Servers: Ingestion + aggregation workers

**Metric types:**
1. **Counter**: Monotonically increasing (requests, errors)
2. **Gauge**: Point-in-time value (memory usage, connections)
3. **Histogram**: Distribution (latencies)

**Ingestion flow:**
1. Service emits: {metric: "api.requests", value: 1, tags: {service: "api", endpoint: "/users"}}
2. Collector receives metric
3. Publish to message queue (non-blocking!)
4. Worker pulls metrics in batches (1000 metrics)
5. Bulk write to PostgreSQL`,
      },
    },

    {
      name: 'High-Volume Ingestion',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Ingest 1M metrics/sec with <100ms p99 latency.',
      traffic: {
        type: 'write',
        rps: 1000000, // 1M metrics/sec!
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 50 } },
          { type: 'postgresql', config: { readCapacity: 50000, writeCapacity: 100000, sharding: true } },
          { type: 'message_queue', config: { maxThroughput: 2000000 } },
          { type: 's3', config: { storageSizeGB: 50000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Scaling to 1M metrics/sec:

**Challenge - Storage:**
- 1M metrics/sec × 60 sec/min × 60 min/hour × 24 hours = 86B metrics/day
- At 100 bytes/metric = 8.6 TB/day
- 30 days = 258 TB/month
- Cost: $6,000/month (PostgreSQL) ❌

**Solution 1 - Batching:**
Don't write metrics individually!

# BAD: 1M individual writes/sec
for metric in metrics:
    db.execute("INSERT INTO metrics VALUES (...)", metric)  # 1M/sec ❌

# GOOD: Batch 1000 metrics, bulk insert
batch = []
for metric in metrics:
    batch.append(metric)

    if len(batch) >= 1000:
        db.bulk_insert("INSERT INTO metrics VALUES (...)", batch)  # 1K/sec ✅
        batch = []

**Batching reduces:**
- 1M writes/sec → 1K bulk writes/sec
- 1000x fewer database transactions!
- Higher throughput

**Solution 2 - Multi-resolution storage:**

**High resolution (1 second, 24 hours):**
- Store every metric
- 86B metrics/day × 1 day = 86B metrics
- 8.6 TB storage

**Medium resolution (1 minute, 7 days):**
- Downsample: 60 seconds → 1 aggregated point
- 86B/day ÷ 60 = 1.4B metrics/day
- 1.4B × 7 days = 10B metrics
- 1 TB storage

**Low resolution (1 hour, 30 days):**
- Downsample: 3600 seconds → 1 point
- 86B/day ÷ 3600 = 24M metrics/day
- 24M × 30 days = 720M metrics
- 72 GB storage

**Total storage: 9.7 TB** (vs 258 TB!) ✅

**Cost:**
- PostgreSQL (high-res): $2,000/month (8.6 TB)
- S3 (medium-res): $23/month (1 TB)
- S3 (low-res): $1.66/month (72 GB)
- **Total: ~$2,025/month** (97% savings!)

**Downsampling strategy:**
# Every hour, downsample 1-hour-old data
for metric_name in unique_metrics:
    # Aggregate last hour (1s resolution → 1m resolution)
    db.execute(\"\"\"
        INSERT INTO metrics_1m
        SELECT
            metric_name,
            DATE_TRUNC('minute', timestamp) as ts,
            AVG(value) as value_avg,
            MAX(value) as value_max,
            MIN(value) as value_min
        FROM metrics_1s
        WHERE timestamp BETWEEN NOW() - INTERVAL '1 hour' AND NOW()
          AND metric_name = ?
        GROUP BY metric_name, DATE_TRUNC('minute', timestamp)
    \"\"\", metric_name)

    # Delete old 1s data
    db.execute(\"\"\"
        DELETE FROM metrics_1s
        WHERE timestamp < NOW() - INTERVAL '24 hours'
    \"\"\")`,
      },
    },

    {
      name: 'High Cardinality',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 10M unique time series (service × endpoint × region × ...).',
      traffic: {
        type: 'write',
        rps: 100000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.05,
        uniqueSeriesHandled: 10000000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 50 } },
          { type: 'postgresql', config: { readCapacity: 50000, writeCapacity: 100000, sharding: true } },
          { type: 'redis', config: { maxMemoryMB: 16384 } },
          { type: 'message_queue', config: { maxThroughput: 200000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `High cardinality is the BIGGEST challenge in metrics systems:

**Problem - Cardinality explosion:**
Tags: service (100) × endpoint (1000) × region (10) × status (5) = 5M series

Each unique combination = 1 time series
10M series × 86,400 points/day = 864B data points/day ❌

**Solution 1 - Series ID mapping (reduce storage):**

Instead of storing tags with every point:
❌ {service: "api", endpoint: "/users", region: "us-east", timestamp: 123, value: 1}

Store series ID:
✅ {series_id: 42, timestamp: 123, value: 1}

**Series table:**
series_id | tags
42        | {service: "api", endpoint: "/users", region: "us-east"}

**Savings:**
- Before: 100 bytes/point (tags repeated)
- After: 20 bytes/point (just ID + timestamp + value)
- 80% storage reduction!

**Solution 2 - Tag cardinality limits:**
Prevent unbounded tags:

✅ service: Low cardinality (100 services)
✅ endpoint: Medium cardinality (1000 endpoints)
✅ region: Low cardinality (10 regions)
❌ user_id: HIGH cardinality (1M users) - DO NOT USE AS TAG!

**Block high-cardinality tags:**
def validate_metric(metric):
    cardinality = estimate_cardinality(metric.tags)

    if cardinality > 10000:
        raise ValueError(f"Tag combination too high cardinality: {cardinality}")

**Solution 3 - Sampling for rare series:**
if series_write_rate < 1/min:  # Rarely updated series
    # Sample 10%
    if random.random() > 0.10:
        drop(metric)

Only keep frequently updated series at full resolution.`,
      },
    },

    {
      name: 'Aggregation Query',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Query sum(api.requests) grouped by service over last 1 hour in <1 second.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 1000, // 1 second
        maxErrorRate: 0.01,
      },
    },

    {
      name: 'Downsampling Job',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Downsample 1s metrics → 1m resolution after 24 hours.',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.9,
      },
      duration: 300,
      passCriteria: {
        maxErrorRate: 0.01,
        downsamplingComplete: true,
      },
    },
  ],

  learningObjectives: [
    'Design multi-resolution time-series storage',
    'Handle high cardinality with series ID mapping',
    'Implement downsampling and compaction',
    'Batch writes for high throughput',
    'Cost optimization through tiered storage',
  ],

  hints: [
    {
      trigger: 'test_failed:High-Volume Ingestion',
      message: `💡 Database is overwhelmed by 1M writes/sec!

**Problem - Individual writes:**
for metric in metrics:
    db.execute("INSERT INTO metrics VALUES (...)", metric)

1M writes/sec × 10ms/write = 10,000,000ms = 166 minutes ❌

**Solution - Batching:**

# Collect metrics in batches
batch = []
batch_size = 1000

for metric in metrics:
    batch.append(metric)

    if len(batch) >= batch_size:
        # Bulk insert
        db.bulk_insert(\"\"\"
            INSERT INTO metrics (metric_name, timestamp, value, tags)
            VALUES (?, ?, ?, ?)
        \"\"\", batch)

        batch = []

**Performance:**
- 1M metrics/sec ÷ 1000 batch_size = 1,000 bulk inserts/sec
- 1,000 inserts/sec × 10ms/insert = 10,000ms = 10 seconds ✅
- 10x faster!

**Optimal batch size:**
- Too small (10): More transactions, slower
- Too large (100K): High memory, long latency per batch
- Sweet spot: 1000-10,000 metrics/batch

Add batching to your metric ingestion pipeline!`,
    },
    {
      trigger: 'test_failed:High Cardinality',
      message: `💡 Database is exploding with time series!

**Problem - Cardinality explosion:**
Tags: service × endpoint × region × status = 100 × 1000 × 10 × 5 = 5M series
Each series × 86,400 points/day = 432B data points/day ❌

**Solution 1 - Series ID mapping:**

**WRONG - Store tags with every point:**
{
  timestamp: 1234567890,
  value: 42,
  tags: {service: "api", endpoint: "/users", region: "us-east"}
}
→ 100 bytes per point

**RIGHT - Store series ID:**
Series table:
id  | tags
42  | {service: "api", endpoint: "/users", region: "us-east"}

Points table:
series_id | timestamp   | value
42        | 1234567890  | 42
→ 20 bytes per point (80% reduction!)

**Query flow:**
1. User queries: service=api, endpoint=/users
2. Lookup series table → series_id = 42
3. Query points: SELECT * FROM points WHERE series_id = 42

**Solution 2 - Block high-cardinality tags:**

# Estimate cardinality
def estimate_cardinality(tags):
    return len(tags['service']) * len(tags['endpoint']) * len(tags['region'])

if estimate_cardinality(metric.tags) > 10000:
    raise ValueError("Cardinality too high! Do not use user_id as tag.")

**Good tags (low cardinality):**
✅ service (100 values)
✅ endpoint (1,000 values)
✅ region (10 values)

**Bad tags (high cardinality):**
❌ user_id (1M values)
❌ request_id (infinite values)
❌ ip_address (millions)

Use series ID mapping to reduce storage!`,
    },
  ],

  pythonTemplate: `# Metrics Aggregation Service
# Implement high-volume ingestion and downsampling

import time
from collections import defaultdict
from typing import Dict, List

# Batch buffer
metric_batches = defaultdict(list)
BATCH_SIZE = 1000


def ingest_metric(metric: dict, context: dict):
    """
    Ingest metric with batching (non-blocking).

    Args:
        metric: {
            'name': 'api.requests',
            'value': 1,
            'tags': {'service': 'api', 'endpoint': '/users'},
            'timestamp': 1234567890
        }
        context: Shared context

    Requirements:
    - Add to batch buffer
    - If batch full → publish to message queue
    - Return immediately (<1ms)
    """
    metric_name = metric['name']
    metric_batches[metric_name].append(metric)

    if len(metric_batches[metric_name]) >= BATCH_SIZE:
        # Batch full - publish to queue
        context['queue'].publish({
            'action': 'write_metrics',
            'metrics': metric_batches[metric_name]
        })

        metric_batches[metric_name] = []


def get_or_create_series_id(metric_name: str, tags: dict, context: dict) -> int:
    """
    Get series ID for metric name + tags (cardinality reduction).

    Args:
        metric_name: Metric name
        tags: Tag dictionary
        context: Shared context

    Returns:
        series_id

    Requirements:
    - Generate series key from name + sorted tags
    - Check cache (Redis) for existing series_id
    - If not exists, create new series in database
    - Return series_id
    """
    # Create canonical series key
    tags_str = ','.join(f"{k}:{v}" for k, v in sorted(tags.items()))
    series_key = f"{metric_name}:{tags_str}"

    # Check cache
    series_id = context['redis'].get(f"series:{series_key}")

    if series_id:
        return int(series_id)

    # Create new series
    series_id = context['db'].execute(
        "INSERT INTO series (metric_name, tags) VALUES (?, ?) RETURNING id",
        metric_name, tags
    )[0]['id']

    # Cache for future
    context['redis'].set(f"series:{series_key}", series_id)

    return series_id


def write_metrics_batch(metrics: List[dict], context: dict):
    """
    Write batch of metrics to storage (background worker).

    Args:
        metrics: List of metrics
        context: Shared context

    Requirements:
    - For each metric, get series_id
    - Bulk insert into PostgreSQL
    - Handle errors gracefully
    """
    # Prepare bulk insert data
    bulk_data = []

    for metric in metrics:
        series_id = get_or_create_series_id(metric['name'], metric['tags'], context)

        bulk_data.append({
            'series_id': series_id,
            'timestamp': metric['timestamp'],
            'value': metric['value']
        })

    # Bulk insert
    context['db'].bulk_insert(
        "INSERT INTO metrics (series_id, timestamp, value) VALUES (?, ?, ?)",
        bulk_data
    )


def downsample_metrics(resolution: str, context: dict):
    """
    Downsample metrics from high to low resolution (background job).

    Args:
        resolution: '1m' (1 minute) or '1h' (1 hour)
        context: Shared context

    Requirements:
    - For each series, aggregate data
    - 1s → 1m: AVG values per minute
    - 1m → 1h: AVG values per hour
    - Store in downsampled table
    - Delete old high-res data
    """
    if resolution == '1m':
        # Downsample 1s → 1m (for data older than 24h)
        context['db'].execute(\"\"\"
            INSERT INTO metrics_1m (series_id, timestamp, value_avg, value_max, value_min)
            SELECT
                series_id,
                DATE_TRUNC('minute', timestamp) as ts,
                AVG(value),
                MAX(value),
                MIN(value)
            FROM metrics_1s
            WHERE timestamp BETWEEN NOW() - INTERVAL '25 hours' AND NOW() - INTERVAL '24 hours'
            GROUP BY series_id, DATE_TRUNC('minute', timestamp)
        \"\"\")

        # Delete old 1s data
        context['db'].execute(\"\"\"
            DELETE FROM metrics_1s
            WHERE timestamp < NOW() - INTERVAL '24 hours'
        \"\"\")

    elif resolution == '1h':
        # Downsample 1m → 1h (for data older than 7 days)
        context['db'].execute(\"\"\"
            INSERT INTO metrics_1h (series_id, timestamp, value_avg, value_max, value_min)
            SELECT
                series_id,
                DATE_TRUNC('hour', timestamp) as ts,
                AVG(value_avg),
                MAX(value_max),
                MIN(value_min)
            FROM metrics_1m
            WHERE timestamp BETWEEN NOW() - INTERVAL '8 days' AND NOW() - INTERVAL '7 days'
            GROUP BY series_id, DATE_TRUNC('hour', timestamp)
        \"\"\")

        # Delete old 1m data
        context['db'].execute(\"\"\"
            DELETE FROM metrics_1m
            WHERE timestamp < NOW() - INTERVAL '7 days'
        \"\"\")


def query_metrics(
    metric_name: str,
    start_time: int,
    end_time: int,
    aggregation: str,
    group_by: List[str],
    context: dict
) -> Dict:
    """
    Query metrics with aggregation.

    Args:
        metric_name: Metric to query
        start_time: Start timestamp
        end_time: End timestamp
        aggregation: 'sum', 'avg', 'max', 'min'
        group_by: List of tag keys to group by
        context: Shared context

    Returns:
        {
            'api-server': 50000,
            'worker': 30000
        }

    Requirements:
    - Determine resolution based on time range
    - Query appropriate table (1s, 1m, or 1h)
    - Apply aggregation and grouping
    - Return results in <1 second
    """
    # Your code here
    return {}


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle metrics API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})
    query = request.get('query', {})

    # POST /metrics - Ingest metric
    if method == 'POST' and path == '/metrics':
        metric = body
        ingest_metric(metric, context)
        return {'status': 202, 'body': {'accepted': True}}

    # GET /query - Query metrics
    elif method == 'GET' and path == '/query':
        results = query_metrics(
            metric_name=query.get('metric'),
            start_time=int(query.get('start')),
            end_time=int(query.get('end')),
            aggregation=query.get('aggregation', 'avg'),
            group_by=query.get('group_by', '').split(','),
            context=context
        )
        return {'status': 200, 'body': results}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
