import { GuidedTutorial } from '../../types/guidedTutorial';

export const metricsMonitoringProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'metrics-monitoring-progressive',
  title: 'Design a Metrics & Monitoring System',
  description: 'Build a monitoring platform from metric collection to intelligent alerting',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design time-series data model and storage',
    'Implement metric aggregation and downsampling',
    'Build query language for metric exploration',
    'Create alerting with anomaly detection',
    'Handle high-cardinality metrics at scale'
  ],
  prerequisites: ['Time-series databases', 'Distributed systems', 'Statistics basics'],
  tags: ['monitoring', 'metrics', 'time-series', 'alerting', 'observability'],

  progressiveStory: {
    title: 'Monitoring System Evolution',
    premise: "You're building a monitoring platform like Datadog or Prometheus. Starting with simple metric collection, you'll evolve to handle billions of data points with intelligent alerting and visualization.",
    phases: [
      { phase: 1, title: 'Metric Collection', description: 'Ingest and store time-series data' },
      { phase: 2, title: 'Query & Visualization', description: 'Query language and dashboards' },
      { phase: 3, title: 'Alerting', description: 'Threshold and anomaly-based alerts' },
      { phase: 4, title: 'Scale & Intelligence', description: 'High cardinality and ML insights' }
    ]
  },

  steps: [
    // PHASE 1: Metric Collection (Steps 1-3)
    {
      id: 'step-1',
      title: 'Metric Data Model',
      phase: 1,
      phaseTitle: 'Metric Collection',
      learningObjective: 'Design time-series metric schema',
      thinkingFramework: {
        framework: 'Dimensional Data Model',
        approach: 'Metric = name + tags + timestamp + value. Tags are key-value pairs for filtering (host, region, service). Enables flexible aggregation.',
        keyInsight: 'Tags create cardinality. 1000 hosts × 100 endpoints × 5 status_codes = 500K unique time series. Plan for cardinality explosion.'
      },
      requirements: {
        functional: [
          'Define metric with name and tags',
          'Support gauge, counter, histogram types',
          'Store timestamp and value pairs',
          'Index tags for efficient filtering'
        ],
        nonFunctional: []
      },
      hints: [
        'Metric: {name, tags: {k:v}, type, timestamp, value}',
        'Counter: monotonic, calculate rate. Gauge: point-in-time value',
        'Histogram: distribution buckets (p50, p95, p99)'
      ],
      expectedComponents: ['Metric Schema', 'Tag Index', 'Type Handler'],
      successCriteria: ['Metrics stored with tags', 'Types handled correctly'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Metric Ingestion Pipeline',
      phase: 1,
      phaseTitle: 'Metric Collection',
      learningObjective: 'Build high-throughput metric ingestion',
      thinkingFramework: {
        framework: 'Push vs Pull Collection',
        approach: 'Push: agents send metrics to server. Pull: server scrapes endpoints (Prometheus model). Push for ephemeral, pull for stable hosts.',
        keyInsight: 'Pre-aggregate at agent to reduce ingestion volume. Send aggregated 1-minute buckets instead of raw samples.'
      },
      requirements: {
        functional: [
          'Accept metrics via push (agent) or pull (scrape)',
          'Validate and normalize incoming metrics',
          'Buffer for batch writes',
          'Handle burst traffic gracefully'
        ],
        nonFunctional: [
          'Ingest 1M metrics/second',
          'Ingestion latency < 1 second'
        ]
      },
      hints: [
        'Push: HTTP POST with batch of metrics',
        'Pull: periodic GET to /metrics endpoint',
        'Write buffer: accumulate, flush every second'
      ],
      expectedComponents: ['Ingestion API', 'Scraper', 'Write Buffer', 'Validator'],
      successCriteria: ['Metrics ingested reliably', 'Burst handled without loss'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Time-Series Storage',
      phase: 1,
      phaseTitle: 'Metric Collection',
      learningObjective: 'Store metrics efficiently for time-range queries',
      thinkingFramework: {
        framework: 'Time-Series Optimized Storage',
        approach: 'Data is append-only, queries are time-range based. Columnar storage, compression (gorilla, delta-of-delta), partition by time.',
        keyInsight: 'Metrics are highly compressible. Adjacent timestamps differ by constant (10s). Adjacent values similar. XOR encoding achieves 12:1 compression.'
      },
      requirements: {
        functional: [
          'Store time-series data efficiently',
          'Support time-range queries',
          'Compress data for storage efficiency',
          'Partition data by time for retention'
        ],
        nonFunctional: [
          'Compression ratio > 10:1',
          'Query recent data (last hour) < 100ms'
        ]
      },
      hints: [
        'Gorilla compression: delta-of-delta for time, XOR for values',
        'Partition: 2-hour blocks, compacted daily',
        'In-memory for recent, disk for historical'
      ],
      expectedComponents: ['Time-Series Store', 'Compressor', 'Block Manager'],
      successCriteria: ['Storage efficient', 'Queries fast for recent data'],
      estimatedTime: '10 minutes'
    },

    // PHASE 2: Query & Visualization (Steps 4-6)
    {
      id: 'step-4',
      title: 'Query Language',
      phase: 2,
      phaseTitle: 'Query & Visualization',
      learningObjective: 'Design query language for metric exploration',
      thinkingFramework: {
        framework: 'Composable Query DSL',
        approach: 'Select metric, filter by tags, aggregate (sum, avg, max), group by dimensions, apply functions (rate, deriv). Chainable operations.',
        keyInsight: 'PromQL pattern: metric_name{tag=value}[time_range]. Intuitive for filtering and aggregation. Functions transform results.'
      },
      requirements: {
        functional: [
          'Select metrics by name pattern',
          'Filter by tag values',
          'Aggregate across dimensions (sum, avg, max, min)',
          'Apply functions (rate, increase, histogram_quantile)'
        ],
        nonFunctional: [
          'Query parse < 1ms'
        ]
      },
      hints: [
        'Syntax: http_requests_total{method="GET", status=~"2.."}',
        'Range vector: [5m] for rate calculation',
        'rate(counter[5m]) for per-second rate'
      ],
      expectedComponents: ['Query Parser', 'Query Executor', 'Aggregation Engine'],
      successCriteria: ['Queries execute correctly', 'Aggregations work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Downsampling & Retention',
      phase: 2,
      phaseTitle: 'Query & Visualization',
      learningObjectpoint: 'Reduce resolution for long-term storage',
      thinkingFramework: {
        framework: 'Multi-Resolution Storage',
        approach: 'Full resolution for recent data (1 week), 1-minute for 30 days, 1-hour for 1 year. Downsample preserves min, max, avg, count.',
        keyInsight: 'Downsample retains statistical properties. Storing min/max/avg/count per bucket enables any aggregation on downsampled data.'
      },
      requirements: {
        functional: [
          'Configure retention policies per metric',
          'Downsample to coarser resolutions over time',
          'Preserve statistical aggregates (min, max, avg)',
          'Query transparently across resolutions'
        ],
        nonFunctional: [
          'Storage savings > 90% for year-old data'
        ]
      },
      hints: [
        'Downsample: 10s → 1m → 1h → 1d',
        'Store: {count, sum, min, max} per bucket',
        'Query: auto-select resolution based on time range'
      ],
      expectedComponents: ['Downsampler', 'Retention Manager', 'Resolution Selector'],
      successCriteria: ['Old data downsampled', 'Queries work across resolutions'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Dashboard Builder',
      phase: 2,
      phaseTitle: 'Query & Visualization',
      learningObjective: 'Create interactive metric visualizations',
      thinkingFramework: {
        framework: 'Declarative Dashboards',
        approach: 'Dashboard = panels with queries. Panel types: line graph, gauge, table, heatmap. Variables for dynamic filtering (select host dropdown).',
        keyInsight: 'Template variables enable reusable dashboards. One dashboard for all services, variable selects which service to view.'
      },
      requirements: {
        functional: [
          'Create dashboards with multiple panels',
          'Support chart types (line, bar, gauge, heatmap)',
          'Template variables for dynamic filtering',
          'Auto-refresh with configurable interval'
        ],
        nonFunctional: [
          'Dashboard load < 3 seconds'
        ]
      },
      hints: [
        'Panel: {query, visualization_type, thresholds}',
        'Variable: {name, query, multi_select}',
        'Variable in query: http_requests{host="$host"}'
      ],
      expectedComponents: ['Dashboard Store', 'Panel Renderer', 'Variable Engine'],
      successCriteria: ['Dashboards render correctly', 'Variables filter data'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Alerting (Steps 7-9)
    {
      id: 'step-7',
      title: 'Threshold-Based Alerts',
      phase: 3,
      phaseTitle: 'Alerting',
      learningObjective: 'Fire alerts when metrics cross thresholds',
      thinkingFramework: {
        framework: 'Rule Evaluation Loop',
        approach: 'Alert rule: query + condition + duration. Evaluate periodically. Fire if condition true for duration. Resolve when condition clears.',
        keyInsight: 'Duration prevents flapping. "CPU > 90% for 5 minutes" avoids alerting on brief spikes. Hysteresis for stable alerts.'
      },
      requirements: {
        functional: [
          'Define alert rules with conditions',
          'Evaluate rules periodically',
          'Fire alert when condition met for duration',
          'Resolve alert when condition clears'
        ],
        nonFunctional: [
          'Alert latency < 1 minute from condition'
        ]
      },
      hints: [
        'Rule: {query, condition: "> 90", for: "5m", severity}',
        'States: pending → firing → resolved',
        'Pending: condition true but duration not met'
      ],
      expectedComponents: ['Rule Engine', 'Alert Manager', 'State Tracker'],
      successCriteria: ['Alerts fire correctly', 'Duration prevents flapping'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Alert Routing & Notification',
      phase: 3,
      phaseTitle: 'Alerting',
      learningObjective: 'Route alerts to appropriate channels',
      thinkingFramework: {
        framework: 'Routing Tree',
        approach: 'Route by labels: production/critical → PagerDuty, staging → Slack. Escalation: if not acked in 15m, escalate to manager.',
        keyInsight: 'Group related alerts to avoid notification storms. 100 hosts failing = 1 grouped alert, not 100 pages.'
      },
      requirements: {
        functional: [
          'Route alerts by labels to receivers',
          'Support multiple notification channels',
          'Group related alerts',
          'Escalate unacknowledged alerts'
        ],
        nonFunctional: [
          'Notification delivery < 30 seconds'
        ]
      },
      hints: [
        'Route: match labels → receiver (Slack, PagerDuty, email)',
        'Group by: {alertname, service} → one notification per group',
        'Escalation: after group_wait + group_interval'
      ],
      expectedComponents: ['Router', 'Notifier', 'Grouper', 'Escalation Manager'],
      successCriteria: ['Alerts routed correctly', 'Grouping reduces noise'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Alert Silencing & Maintenance',
      phase: 3,
      phaseTitle: 'Alerting',
      learningObjective: 'Suppress alerts during known conditions',
      thinkingFramework: {
        framework: 'Planned Suppression',
        approach: 'Silence: suppress alerts matching criteria for duration. Maintenance window: scheduled silence for planned work. Inhibition: one alert suppresses related alerts.',
        keyInsight: 'Inhibition: if datacenter-down fires, suppress all host-down alerts for that DC. Reduces noise, focuses on root cause.'
      },
      requirements: {
        functional: [
          'Create silences by label matchers',
          'Schedule maintenance windows',
          'Inhibit child alerts when parent fires',
          'Track silence history for audit'
        ],
        nonFunctional: []
      },
      hints: [
        'Silence: {matchers, starts_at, ends_at, created_by}',
        'Inhibition rule: if {source} fires, suppress {target}',
        'Auto-expire silences after end_at'
      ],
      expectedComponents: ['Silence Manager', 'Inhibitor', 'Maintenance Scheduler'],
      successCriteria: ['Silences suppress correctly', 'Inhibition works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Scale & Intelligence (Steps 10-12)
    {
      id: 'step-10',
      title: 'High-Cardinality Handling',
      phase: 4,
      phaseTitle: 'Scale & Intelligence',
      learningObjective: 'Handle metrics with many unique tag combinations',
      thinkingFramework: {
        framework: 'Cardinality Control',
        approach: 'High cardinality (user_id tag) explodes storage. Strategies: drop high-cardinality tags, sample, aggregate at ingestion.',
        keyInsight: 'Set cardinality limits per metric. If user_id tag creates 1M series, drop it or hash to buckets (user_id_bucket).'
      },
      requirements: {
        functional: [
          'Track cardinality per metric',
          'Enforce cardinality limits',
          'Drop or aggregate high-cardinality tags',
          'Alert on cardinality explosion'
        ],
        nonFunctional: [
          'Max 10M active time series',
          'Cardinality check < 1ms per sample'
        ]
      },
      hints: [
        'Track: series_count per metric name',
        'Limit: reject samples if series_count > limit',
        'Relabel: hash(user_id) % 100 → user_bucket'
      ],
      expectedComponents: ['Cardinality Tracker', 'Limiter', 'Relabeler'],
      successCriteria: ['Cardinality bounded', 'High-cardinality detected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Anomaly Detection',
      phase: 4,
      phaseTitle: 'Scale & Intelligence',
      learningObjective: 'Detect unusual metric behavior automatically',
      thinkingFramework: {
        framework: 'Statistical Anomaly Detection',
        approach: 'Static thresholds dont work for variable baselines. Learn normal pattern, alert on deviation. Seasonal decomposition for daily/weekly patterns.',
        keyInsight: 'Z-score: how many standard deviations from mean? |z| > 3 is unusual. Account for seasonality: compare to same hour last week.'
      },
      requirements: {
        functional: [
          'Learn baseline behavior for metrics',
          'Detect anomalies (unusual values)',
          'Account for daily/weekly seasonality',
          'Tune sensitivity per metric'
        ],
        nonFunctional: [
          'Anomaly detection < 5 minutes of occurrence',
          'False positive rate < 5%'
        ]
      },
      hints: [
        'Baseline: rolling mean and stddev',
        'Seasonality: compare to same time period',
        'Sensitivity: z-score threshold (2, 3, 4)'
      ],
      expectedComponents: ['Baseline Calculator', 'Anomaly Detector', 'Seasonality Model'],
      successCriteria: ['Anomalies detected', 'Seasonality handled'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Distributed Architecture',
      phase: 4,
      phaseTitle: 'Scale & Intelligence',
      learningObjective: 'Scale monitoring to global infrastructure',
      thinkingFramework: {
        framework: 'Federated Monitoring',
        approach: 'Regional collectors aggregate locally, send summaries to global. Query fans out to regions. Reduces cross-region traffic.',
        keyInsight: 'Record rules: pre-compute expensive aggregations locally. Send aggregated metrics to global instead of raw samples.'
      },
      requirements: {
        functional: [
          'Deploy regional collectors',
          'Aggregate locally before global storage',
          'Federate queries across regions',
          'Handle region failures gracefully'
        ],
        nonFunctional: [
          'Global query < 5 seconds',
          'Regional independence on global failure'
        ]
      },
      hints: [
        'Regional: full resolution local, aggregates to global',
        'Recording rules: precompute sum by region every minute',
        'Query federation: scatter to regions, gather results'
      ],
      expectedComponents: ['Regional Collector', 'Global Aggregator', 'Federation Router'],
      successCriteria: ['Queries work globally', 'Regions operate independently'],
      estimatedTime: '10 minutes'
    }
  ]
};
