import { GuidedTutorial } from '../../types/guidedTutorial';

export const adClickAggregatorProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'ad-click-aggregator-progressive',
  title: 'Design Ad Click Aggregator',
  description: 'Build an ad analytics system from event collection to real-time billing',
  difficulty: 'hard',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design high-throughput event ingestion pipeline',
    'Implement exactly-once counting for billing accuracy',
    'Build real-time aggregation with windowing',
    'Detect and filter click fraud',
    'Create dashboards with sub-second latency'
  ],
  prerequisites: ['Stream processing', 'Distributed systems', 'Data pipelines'],
  tags: ['analytics', 'streaming', 'aggregation', 'advertising', 'real-time'],

  progressiveStory: {
    title: 'Ad Click Aggregator Evolution',
    premise: "You're building click tracking for an ad platform. Starting with basic counting, you'll evolve to handle billions of events with real-time fraud detection and accurate billing.",
    phases: [
      { phase: 1, title: 'Event Collection', description: 'Capture and store click events' },
      { phase: 2, title: 'Real-Time Aggregation', description: 'Count clicks with streaming' },
      { phase: 3, title: 'Accuracy & Fraud', description: 'Ensure billing accuracy and detect fraud' },
      { phase: 4, title: 'Analytics Platform', description: 'Dashboards and advanced insights' }
    ]
  },

  steps: [
    // PHASE 1: Event Collection (Steps 1-3)
    {
      id: 'step-1',
      title: 'Click Event Ingestion',
      phase: 1,
      phaseTitle: 'Event Collection',
      learningObjective: 'Capture click events at high throughput',
      thinkingFramework: {
        framework: 'Write-Optimized Ingestion',
        approach: 'Clicks happen at massive scale (millions/second). Ingestion must be fast, async, and never lose data. Log to Kafka, process later.',
        keyInsight: 'Fire-and-forget from client. Server acknowledges receipt immediately, processes async. Kafka durability guarantees no data loss.'
      },
      requirements: {
        functional: [
          'Capture click events with ad_id, user_id, timestamp',
          'Include contextual data (device, location, referrer)',
          'Acknowledge receipt to client immediately',
          'Buffer events for downstream processing'
        ],
        nonFunctional: [
          'Ingestion throughput: 1M events/second',
          'Latency: < 50ms acknowledgment'
        ]
      },
      hints: [
        'Click event: {ad_id, user_id, timestamp, ip, user_agent, referrer}',
        'HTTP endpoint returns 202 Accepted immediately',
        'Write to Kafka with async batching'
      ],
      expectedComponents: ['Ingestion API', 'Event Buffer (Kafka)', 'Schema Registry'],
      successCriteria: ['Events captured at scale', 'No data loss under load'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Event Schema & Validation',
      phase: 1,
      phaseTitle: 'Event Collection',
      learningObjective: 'Validate and enrich click events',
      thinkingFramework: {
        framework: 'Schema Evolution',
        approach: 'Events need consistent schema for downstream processing. Validate at ingestion, reject malformed. Support schema evolution (add fields).',
        keyInsight: 'Enrich early: geo from IP, device from user-agent. Cheaper to do once at ingestion than repeatedly downstream.'
      },
      requirements: {
        functional: [
          'Validate required fields (ad_id, timestamp)',
          'Enrich with geo-location from IP',
          'Parse user-agent for device info',
          'Handle schema versioning'
        ],
        nonFunctional: [
          'Validation adds < 10ms'
        ]
      },
      hints: [
        'JSON Schema or Avro for validation',
        'MaxMind for IP → geo lookup',
        'Add schema_version to events'
      ],
      expectedComponents: ['Validator', 'Enrichment Service', 'Schema Registry'],
      successCriteria: ['Invalid events rejected', 'Events enriched with geo/device'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Raw Event Storage',
      phase: 1,
      phaseTitle: 'Event Collection',
      learningObjective: 'Store raw events for reprocessing',
      thinkingFramework: {
        framework: 'Immutable Event Log',
        approach: 'Raw events are the source of truth. Store immutably in data lake. Aggregations can be recomputed from raw data.',
        keyInsight: 'Partition by date for efficient queries and retention. Columnar format (Parquet) for analytical queries.'
      },
      requirements: {
        functional: [
          'Store all raw events in data lake',
          'Partition by date for retention management',
          'Support schema evolution in storage',
          'Enable ad-hoc queries on raw data'
        ],
        nonFunctional: [
          'Storage cost optimized (compression)',
          'Query raw events within 1 minute'
        ]
      },
      hints: [
        'S3/GCS with Parquet format',
        'Partition: year/month/day/hour',
        'Retention: 90 days raw, aggregate forever'
      ],
      expectedComponents: ['Data Lake (S3)', 'Sink Connector', 'Query Engine (Athena/Presto)'],
      successCriteria: ['Raw events queryable', 'Partitioning enables retention'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Real-Time Aggregation (Steps 4-6)
    {
      id: 'step-4',
      title: 'Stream Processing Pipeline',
      phase: 2,
      phaseTitle: 'Real-Time Aggregation',
      learningObjective: 'Process click streams in real-time',
      thinkingFramework: {
        framework: 'Streaming Architecture',
        approach: 'Kafka → Flink/Spark → Aggregates. Consume events, group by dimensions (ad_id, minute), count, write to fast store.',
        keyInsight: 'Exactly-once semantics: Flink checkpoints + Kafka transactions ensure each event counted exactly once, even on failure.'
      },
      requirements: {
        functional: [
          'Consume events from Kafka',
          'Group by ad_id and time window',
          'Count clicks per ad per minute',
          'Write aggregates to fast store'
        ],
        nonFunctional: [
          'Processing latency < 5 seconds',
          'Handle 1M events/second'
        ]
      },
      hints: [
        'Flink with tumbling windows (1 minute)',
        'Kafka consumer groups for parallelism',
        'Write to Redis/Cassandra for fast reads'
      ],
      expectedComponents: ['Flink Job', 'Kafka Consumer', 'Aggregate Store'],
      successCriteria: ['Aggregates computed in real-time', 'No data loss on failures'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Windowing & Late Events',
      phase: 2,
      phaseTitle: 'Real-Time Aggregation',
      learningObjective: 'Handle time windows and late-arriving data',
      thinkingFramework: {
        framework: 'Event Time vs Processing Time',
        approach: 'Use event timestamp, not arrival time. Events can arrive late (network delays). Allow lateness window, update aggregates.',
        keyInsight: 'Watermarks track event time progress. Event with timestamp before watermark is late. Allow configurable lateness (5 minutes).'
      },
      requirements: {
        functional: [
          'Use event timestamp for windowing',
          'Handle late-arriving events',
          'Update aggregates when late events arrive',
          'Track watermark progress'
        ],
        nonFunctional: [
          'Late events within 5 minutes still counted'
        ]
      },
      hints: [
        'Watermark = max(event_time) - allowed_lateness',
        'Late event: event_time < watermark',
        'Side output for very late events (analytics)'
      ],
      expectedComponents: ['Watermark Generator', 'Late Event Handler', 'Window Assigner'],
      successCriteria: ['Late events update counts', 'Very late events tracked separately'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Multi-Dimensional Aggregation',
      phase: 2,
      phaseTitle: 'Real-Time Aggregation',
      learningObjective: 'Aggregate across multiple dimensions',
      thinkingFramework: {
        framework: 'OLAP Cube Approach',
        approach: 'Advertisers want to slice by: ad, campaign, country, device, hour. Pre-aggregate common combinations, compute others on demand.',
        keyInsight: 'Dimension explosion: 1000 ads × 100 countries × 10 devices × 24 hours = 24M combinations. Aggregate only popular combinations.'
      },
      requirements: {
        functional: [
          'Aggregate by ad_id, campaign_id',
          'Aggregate by country, device type',
          'Support hourly and daily rollups',
          'Enable drill-down queries'
        ],
        nonFunctional: [
          'Pre-aggregate top 1000 dimension combinations'
        ]
      },
      hints: [
        'Pre-aggregate: (ad_id, hour), (campaign_id, hour, country)',
        'On-demand: less common combinations from raw',
        'Hierarchical rollup: minute → hour → day'
      ],
      expectedComponents: ['Dimension Aggregator', 'Rollup Service', 'OLAP Store'],
      successCriteria: ['Common dimensions pre-aggregated', 'Drill-down queries work'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Accuracy & Fraud (Steps 7-9)
    {
      id: 'step-7',
      title: 'Exactly-Once Counting',
      phase: 3,
      phaseTitle: 'Accuracy & Fraud',
      learningObjective: 'Ensure each click counted exactly once for billing',
      thinkingFramework: {
        framework: 'Idempotent Processing',
        approach: 'Clicks = money. Over-count = overcharge advertiser. Under-count = lose revenue. Must be exactly once, even with retries and failures.',
        keyInsight: 'Deduplication key: hash(ad_id, user_id, timestamp, ip). If seen before, skip. Bloom filter for fast check, database for confirmation.'
      },
      requirements: {
        functional: [
          'Generate unique click ID for deduplication',
          'Detect and filter duplicate events',
          'Handle retries without double-counting',
          'Audit trail for billing disputes'
        ],
        nonFunctional: [
          'Billing accuracy: 99.99%'
        ]
      },
      hints: [
        'Click ID = hash(ad_id + user_id + timestamp + ip)',
        'Bloom filter for fast negative lookup',
        'Redis SET with TTL for dedup window'
      ],
      expectedComponents: ['Deduplication Service', 'Bloom Filter', 'Audit Logger'],
      successCriteria: ['Duplicates filtered', 'Billing matches clicks exactly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Click Fraud Detection',
      phase: 3,
      phaseTitle: 'Accuracy & Fraud',
      learningObjective: 'Detect and filter fraudulent clicks',
      thinkingFramework: {
        framework: 'Anomaly Detection',
        approach: 'Fraud patterns: same IP clicking repeatedly, bot user-agents, impossible geo travel, click farms. Rule-based first, then ML.',
        keyInsight: 'Dont block in real-time (false positives hurt). Flag suspicious, aggregate separately, reconcile in billing. Manual review for edge cases.'
      },
      requirements: {
        functional: [
          'Detect high-frequency clicks from same IP',
          'Identify bot user-agents',
          'Flag impossible travel (geo anomalies)',
          'Separate suspicious clicks in billing'
        ],
        nonFunctional: [
          'Filter 95% of fraud',
          'False positive rate < 1%'
        ]
      },
      hints: [
        'Rule: > 10 clicks/minute from same IP = suspicious',
        'Bot detection: known bot user-agents, headless browsers',
        'Geo velocity: click in NYC, 5 seconds later in Tokyo = impossible'
      ],
      expectedComponents: ['Fraud Detector', 'Rule Engine', 'Suspicious Click Store', 'Review Queue'],
      successCriteria: ['Fraud flagged accurately', 'Legitimate clicks not blocked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Reconciliation & Billing',
      phase: 3,
      phaseTitle: 'Accuracy & Fraud',
      learningObjective: 'Generate accurate billing from click counts',
      thinkingFramework: {
        framework: 'Financial Accuracy',
        approach: 'Billing = clicks × CPC (cost per click). Must reconcile real-time counts with batch recomputation. Discrepancies need explanation.',
        keyInsight: 'Run batch job daily to recompute from raw events. Compare to real-time aggregates. Investigate discrepancies > 0.1%.'
      },
      requirements: {
        functional: [
          'Generate billing from click aggregates',
          'Batch recomputation for verification',
          'Reconcile real-time vs batch counts',
          'Support billing disputes with evidence'
        ],
        nonFunctional: [
          'Billing generated within 1 hour of day end',
          'Discrepancy < 0.1%'
        ]
      },
      hints: [
        'Daily batch job over raw events in data lake',
        'Compare: batch_count vs sum(realtime_counts)',
        'Store both for audit trail'
      ],
      expectedComponents: ['Billing Generator', 'Batch Recompute Job', 'Reconciliation Report'],
      successCriteria: ['Billing accurate', 'Discrepancies flagged and explained'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Analytics Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Real-Time Dashboards',
      phase: 4,
      phaseTitle: 'Analytics Platform',
      learningObjective: 'Build live dashboards for advertisers',
      thinkingFramework: {
        framework: 'Push vs Pull',
        approach: 'Advertisers want live stats. Options: poll aggregates (simple), WebSocket push (real-time), or hybrid (poll + push for spikes).',
        keyInsight: 'Pre-compute dashboard data. Dont query on page load. Push incremental updates via WebSocket for live feel.'
      },
      requirements: {
        functional: [
          'Display real-time click counts per campaign',
          'Show spend and remaining budget',
          'Update dashboard without page refresh',
          'Support date range filtering'
        ],
        nonFunctional: [
          'Dashboard refresh < 1 second',
          'Support 10K concurrent dashboards'
        ]
      },
      hints: [
        'Pre-aggregate per advertiser per campaign',
        'WebSocket for live updates',
        'Redis pub/sub for update distribution'
      ],
      expectedComponents: ['Dashboard API', 'WebSocket Server', 'Pre-Aggregator'],
      successCriteria: ['Dashboards update live', 'Historical queries fast'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Conversion Attribution',
      phase: 4,
      phaseTitle: 'Analytics Platform',
      learningObjective: 'Track conversions and attribute to ad clicks',
      thinkingFramework: {
        framework: 'Attribution Models',
        approach: 'User clicks ad, later converts (purchase). Attribute conversion to click. Models: last-click, first-click, linear, time-decay.',
        keyInsight: 'Attribution window: click within 7 days of conversion counts. Join click and conversion events by user_id within window.'
      },
      requirements: {
        functional: [
          'Track conversion events (purchase, signup)',
          'Join conversions to prior ad clicks',
          'Support multiple attribution models',
          'Report conversion rate and ROAS'
        ],
        nonFunctional: [
          'Attribution computed within 1 hour of conversion'
        ]
      },
      hints: [
        'Conversion event: {user_id, conversion_type, value, timestamp}',
        'Join: conversions LEFT JOIN clicks WHERE click_time < conversion_time',
        'Last-click: most recent click gets 100% credit'
      ],
      expectedComponents: ['Conversion Tracker', 'Attribution Engine', 'ROAS Calculator'],
      successCriteria: ['Conversions attributed correctly', 'ROAS reported accurately'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Predictive Analytics',
      phase: 4,
      phaseTitle: 'Analytics Platform',
      learningObjective: 'Forecast performance and detect anomalies',
      thinkingFramework: {
        framework: 'Time Series Forecasting',
        approach: 'Predict tomorrows clicks from historical patterns. Detect anomalies (sudden drop = tracking bug?, sudden spike = fraud?).',
        keyInsight: 'Anomaly = deviation from forecast. Train on historical data, predict expected range, alert if actual outside range.'
      },
      requirements: {
        functional: [
          'Forecast expected click volume',
          'Detect anomalies in real-time',
          'Alert on significant deviations',
          'Provide insights on trends'
        ],
        nonFunctional: [
          'Anomaly detection within 5 minutes',
          'Forecast accuracy within 20%'
        ]
      },
      hints: [
        'Prophet or ARIMA for time series forecasting',
        'Anomaly = |actual - predicted| > 3 * std_dev',
        'Separate models per advertiser (different patterns)'
      ],
      expectedComponents: ['Forecaster', 'Anomaly Detector', 'Alert Service', 'Trend Analyzer'],
      successCriteria: ['Anomalies detected promptly', 'Forecasts guide budget planning'],
      estimatedTime: '8 minutes'
    }
  ]
};
