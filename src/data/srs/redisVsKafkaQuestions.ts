/**
 * Extended Scenario Questions - Redis vs Kafka
 *
 * 15+ scenario variations to ensure deep understanding through varied contexts
 * Each scenario tests the same core concepts but from different real-world angles
 */

import { ScenarioQuestion } from '../../types/spacedRepetition';

export const redisVsKafkaQuestions: ScenarioQuestion[] = [
  // ============================================================================
  // Variation 1: Session Management for Gaming Platform
  // ============================================================================
  {
    id: 'redis-kafka-gaming-sessions',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You are building session management for a multiplayer online game',
      requirements: [
        '1 million concurrent players',
        'Session data needs <10ms access time',
        'Player sessions expire after 30 minutes of inactivity',
        'Session data is temporary (OK to lose on crash)',
        'Need to share session state across multiple game servers',
      ],
      constraints: [
        'Ultra-low latency critical for player experience',
        'Budget-conscious solution preferred',
      ],
      metrics: {
        'Concurrent Sessions': '1 million',
        'Latency Requirement': '<10ms',
        'Session TTL': '30 minutes',
        'Data Durability': 'Not required',
      },
    },
    question: 'Would you use Redis or Kafka for storing player session data? Explain your reasoning.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Redis provides sub-millisecond latency',
          keywords: ['redis', 'fast', 'low latency', 'millisecond', 'in-memory'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Kafka has higher latency due to disk writes',
          keywords: ['kafka', 'disk', 'higher latency', 'slower'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Session data is ephemeral',
          keywords: ['temporary', 'ephemeral', 'ttl', 'expire', 'not critical'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Redis has built-in TTL support',
          keywords: ['ttl', 'expire', 'timeout', 'automatic cleanup'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Latency vs Durability',
          options: [
            {
              name: 'Redis',
              pros: ['Sub-10ms latency', 'Built-in TTL', 'Simple', 'Cost-effective for ephemeral data'],
              cons: ['Data lost on crash', 'Limited by RAM'],
            },
            {
              name: 'Kafka',
              pros: ['Durable', 'Can replay'],
              cons: ['Higher latency (10-50ms)', 'Overkill for sessions', 'More expensive'],
            },
          ],
        },
      ],
      antipatterns: [
        'kafka for session data',
        'need durability for sessions',
        'replay session data',
      ],
      optionalPoints: [
        'Redis Cluster for scaling',
        'sticky sessions',
        'distributed caching',
      ],
    },
    explanation: `
**Recommended: Redis**

For gaming session management, Redis is clearly better:

1. **Latency**: <10ms requirement demands in-memory speed. Redis delivers <1ms, Kafka typically 10-50ms
2. **TTL Support**: Redis natively expires keys after 30min. Kafka requires custom cleanup
3. **Ephemeral Data**: Sessions are temporary. Don't pay for Kafka's durability if you don't need it
4. **Simplicity**: Redis is simpler to operate for this use case

**When Kafka Would Be Better**: If you needed to audit all player sessions, replay login events, or feed session data to analytics - then Kafka's event log would be valuable.
    `,
    difficulty: 'easy',
    estimatedTimeSeconds: 180,
    tags: ['redis', 'kafka', 'sessions', 'gaming'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 2: IoT Sensor Data Collection
  // ============================================================================
  {
    id: 'redis-kafka-iot-sensors',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You are building data ingestion for IoT sensors in a smart factory',
      requirements: [
        '10,000 sensors sending data every second',
        'Data must be stored for 90 days for compliance',
        'Multiple consumers: real-time dashboard, ML pipeline, data warehouse',
        'Some consumers lag hours behind (batch processing)',
        'Cannot lose any sensor readings',
      ],
      constraints: [
        'Regulatory requirement to keep all data for 90 days',
        'Consumers process at different rates',
      ],
      metrics: {
        'Data Volume': '10K messages/sec',
        'Retention': '90 days required',
        'Consumers': '3+ at different speeds',
        'Durability': 'Critical - cannot lose data',
      },
    },
    question: 'Should you use Redis or Kafka for IoT sensor data ingestion? Explain your choice.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Kafka provides durable log retention',
          keywords: ['kafka', 'durable', 'retention', '90 days', 'persist', 'disk'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Multiple consumers at different rates',
          keywords: ['consumer groups', 'multiple consumers', 'independent', 'different speeds'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Redis loses data on crash',
          keywords: ['redis', 'volatile', 'in-memory', 'lost', 'crash'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Kafka supports replay',
          keywords: ['replay', 'reprocess', 'offset', 'historical data'],
          weight: 0.7,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Durability vs Speed',
          options: [
            {
              name: 'Kafka',
              pros: ['90-day retention', 'Consumer independence', 'Durable', 'Replayable'],
              cons: ['Slightly higher latency', 'More complex'],
            },
            {
              name: 'Redis',
              pros: ['Faster'],
              cons: ['Cannot retain 90 days (RAM limit)', 'Data loss risk', 'No replay'],
            },
          ],
        },
      ],
      antipatterns: [
        'redis for long retention',
        '90 days in memory',
        'redis for compliance data',
      ],
      optionalPoints: [
        'kafka partitioning',
        'compaction',
        'time-based retention',
      ],
    },
    explanation: `
**Recommended: Kafka**

For IoT sensor data, Kafka is the clear choice:

1. **90-Day Retention**: Kafka stores messages on disk with configurable retention. Redis would need 90 days of data in RAM (cost-prohibitive)
2. **Consumer Independence**: Real-time dashboard reads latest, ML pipeline might lag hours, warehouse does daily batch. Kafka's consumer groups allow each to read at their own pace
3. **Durability**: Regulatory compliance requires no data loss. Kafka replicates to disk
4. **Replay**: If ML pipeline has a bug, you can reprocess last week's data

**Why Not Redis**: Storing 90 days * 10K msgs/sec * message size in RAM is extremely expensive and Redis doesn't support independent consumer offsets.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 200,
    tags: ['redis', 'kafka', 'iot', 'compliance'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 3: Rate Limiting Service
  // ============================================================================
  {
    id: 'redis-kafka-rate-limiting',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You need to implement API rate limiting for your SaaS platform',
      requirements: [
        'Check rate limits on every API request',
        'Limits: 100 requests per minute per user',
        'Must decide within 5ms to not impact API latency',
        'Rate limit counters reset every minute',
        'Distributed across multiple API servers',
      ],
      constraints: [
        'Cannot add >5ms latency to API calls',
        'Need atomic increment operations',
      ],
      metrics: {
        'Latency Budget': '<5ms for rate check',
        'Counter TTL': '1 minute',
        'Operations': 'Atomic increments',
      },
    },
    question: 'For implementing rate limiting, would you choose Redis or Kafka? Justify your decision.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Redis provides atomic operations',
          keywords: ['redis', 'atomic', 'incr', 'increment', 'counter'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Sub-millisecond latency needed',
          keywords: ['fast', 'low latency', '<5ms', 'millisecond'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Kafka is append-only log',
          keywords: ['kafka', 'append-only', 'log', 'not suitable'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Operation Type',
          options: [
            {
              name: 'Redis',
              pros: ['Atomic INCR', '<1ms latency', 'TTL support', 'Perfect for counters'],
              cons: ['In-memory only'],
            },
            {
              name: 'Kafka',
              pros: ['Durable'],
              cons: ['Not designed for lookups', 'Higher latency', 'No atomic updates'],
            },
          ],
        },
      ],
      antipatterns: [
        'kafka for rate limiting',
        'kafka for counters',
        'event log for rate limits',
      ],
      optionalPoints: [
        'sliding window',
        'token bucket',
        'redis lua scripts',
      ],
    },
    explanation: `
**Recommended: Redis**

Rate limiting requires Redis, not Kafka:

1. **Atomic Operations**: Redis INCR is perfect for counters. Kafka is append-only, can't update counters
2. **Latency**: <5ms budget needs <1ms operations. Redis delivers, Kafka adds 10-50ms
3. **TTL**: Redis auto-expires counters after 1 minute. Kafka would need manual cleanup
4. **Access Pattern**: Rate limiting is a lookup/update pattern, not an event stream

**Kafka's Strengths Don't Apply**: This isn't an event stream problem - it's a distributed counter problem.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 180,
    tags: ['redis', 'kafka', 'rate-limiting', 'counters'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 4: Financial Transaction Log
  // ============================================================================
  {
    id: 'redis-kafka-financial-log',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'Building transaction logging for a payment processing system',
      requirements: [
        'Every payment transaction must be logged',
        'Regulators require 7-year retention',
        'Need to audit any transaction from past 7 years',
        'Multiple consumers: fraud detection, accounting, compliance',
        'Fraud detection needs real-time access (<1 second)',
        'Accounting processes daily batches',
      ],
      constraints: [
        'Cannot lose any transaction record',
        'Must support compliance audits',
        'Different consumers have different latency needs',
      ],
      metrics: {
        'Retention': '7 years mandatory',
        'Durability': 'Absolute - financial data',
        'Audit': 'Must replay any transaction',
      },
    },
    question: 'For financial transaction logging, would you use Redis or Kafka? Explain the trade-offs.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Kafka provides immutable log',
          keywords: ['kafka', 'immutable', 'log', 'audit trail', 'durable'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: '7-year retention',
          keywords: ['retention', '7 years', 'long-term', 'storage'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Cannot lose financial data',
          keywords: ['critical', 'cannot lose', 'durability', 'financial'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Redis is volatile',
          keywords: ['redis', 'volatile', 'in-memory', 'lost', 'temporary'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [],
      antipatterns: [
        'redis for financial transactions',
        'in-memory for audit logs',
        'ephemeral transaction logs',
      ],
      optionalPoints: [
        'exactly-once semantics',
        'compaction',
        'tiered storage',
      ],
    },
    explanation: `
**Recommended: Kafka (only option)**

For financial transactions, Kafka is non-negotiable:

1. **Immutable Audit Log**: Kafka's append-only log provides perfect audit trail. Once written, cannot be altered
2. **7-Year Retention**: Kafka with tiered storage (hot/warm/cold) can economically store 7 years
3. **Durability**: Kafka replication ensures zero data loss. Redis would lose transactions on crash
4. **Compliance**: Regulators can audit any transaction by replaying Kafka from any point in time

**Redis Would Be Catastrophic**: Losing financial transactions due to server crash would:
- Violate regulations
- Create accounting discrepancies
- Lose customer trust
- Result in legal liability

**Not Even Close**: This is the clearest use case for Kafka over Redis.
    `,
    difficulty: 'easy',
    estimatedTimeSeconds: 150,
    tags: ['redis', 'kafka', 'financial', 'compliance', 'audit'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 5: Real-Time Leaderboard
  // ============================================================================
  {
    id: 'redis-kafka-leaderboard',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'Building a real-time leaderboard for a competitive mobile game',
      requirements: [
        'Update scores in real-time as players finish matches',
        'Display top 100 players globally',
        'Players should see updated rankings within 100ms',
        '10K score updates per second during peak',
        'Leaderboard resets weekly',
      ],
      constraints: [
        'Must support sorted range queries (top 100)',
        'Extremely low latency for competitive feel',
      ],
      metrics: {
        'Query Type': 'Sorted range (top 100)',
        'Latency': '<100ms',
        'Updates': '10K/sec',
        'Reset': 'Weekly',
      },
    },
    question: 'Should you use Redis or Kafka for the real-time leaderboard? Discuss the architecture.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Redis Sorted Sets for leaderboard',
          keywords: ['redis', 'sorted set', 'zset', 'ranking', 'zadd', 'zrange'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Low latency requirement',
          keywords: ['fast', 'low latency', '<100ms', 'real-time'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Kafka lacks sorted data structures',
          keywords: ['kafka', 'no sorted', 'no ranking', 'append-only'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Data Structure Support',
          options: [
            {
              name: 'Redis',
              pros: ['Sorted Sets (ZADD, ZRANGE)', 'Sub-millisecond queries', 'Perfect for rankings'],
              cons: ['In-memory', 'Data lost on crash (but resets weekly anyway)'],
            },
            {
              name: 'Kafka',
              pros: ['Durable'],
              cons: ['No sorted structures', 'Would need external processing', 'Much more complex'],
            },
          ],
        },
      ],
      antipatterns: [
        'kafka for leaderboard',
        'event log for rankings',
      ],
      optionalPoints: [
        'redis persistence for recovery',
        'multiple leaderboards',
        'sharding by region',
      ],
    },
    explanation: `
**Recommended: Redis**

Leaderboards are a perfect Redis use case:

1. **Sorted Sets**: Redis Sorted Sets (ZSET) are designed exactly for leaderboards:
   - ZADD player_id score → Update scores
   - ZREVRANGE 0 99 → Get top 100
   - ZRANK player_id → Get player's rank

2. **Performance**: All operations are O(log N), <1ms latency

3. **Weekly Reset**: Data doesn't need to survive long-term, matches the reset cadence

**Kafka Alternative**: You could use Kafka Streams to build a leaderboard, but it's far more complex:
- Kafka stores events → Need stream processing to build leaderboard state
- Would still likely use RocksDB (disk-based) for state → slower than Redis
- Massive overkill for this use case

**Pattern**: Use Kafka if you want to replay/audit score changes. Use Redis for the leaderboard itself. They can work together!
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 180,
    tags: ['redis', 'kafka', 'leaderboard', 'sorted-sets'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 6: Click Stream Analytics
  // ============================================================================
  {
    id: 'redis-kafka-clickstream',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'Building click stream data collection for a large e-commerce website',
      requirements: [
        '1 million page views per hour',
        'Feed click data to: real-time dashboard, recommendation engine, data warehouse',
        'Recommendation engine processes clicks in 10-second windows',
        'Data warehouse does hourly batch loads',
        'Keep click data for 30 days for analysis',
      ],
      constraints: [
        'Different consumers process at different speeds',
        'Need to reprocess last week of data if recommendation model changes',
      ],
      metrics: {
        'Volume': '1M clicks/hour',
        'Retention': '30 days',
        'Consumers': 'Real-time + batch',
        'Reprocessing': 'Must support',
      },
    },
    question: 'For clickstream data collection, should you use Redis or Kafka? Analyze the requirements.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Kafka for event streaming',
          keywords: ['kafka', 'event stream', 'clickstream', 'events'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Multiple consumers at different rates',
          keywords: ['multiple consumers', 'independent', 'batch', 'real-time'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Reprocessing capability',
          keywords: ['reprocess', 'replay', 'offset', 'historical'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: '30-day retention',
          keywords: ['retention', '30 days', 'storage'],
          weight: 0.7,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Event Streaming vs Caching',
          options: [
            {
              name: 'Kafka',
              pros: ['Perfect for event streams', 'Consumer independence', '30-day retention easy', 'Can replay'],
              cons: ['Slightly more complex than Redis Pub/Sub'],
            },
            {
              name: 'Redis',
              pros: ['Simple Pub/Sub'],
              cons: ['Fire-and-forget (no retention)', 'Cannot replay', 'No consumer offsets'],
            },
          ],
        },
      ],
      antipatterns: [
        'redis pubsub for analytics',
        'no replay for ML data',
      ],
      optionalPoints: [
        'kafka streams',
        'exactly-once processing',
        'partitioning by user',
      ],
    },
    explanation: `
**Recommended: Kafka**

Clickstream is a textbook Kafka use case:

1. **Event Stream**: Clicks are events that multiple consumers need to process independently
2. **Consumer Independence**:
   - Dashboard reads in real-time (offset: latest)
   - Recommendations process 10-second windows
   - Warehouse batch-loads hourly (offset: last processed)
3. **Reprocessing**: When you retrain the recommendation model, replay last 7 days
4. **30-Day Retention**: Trivial with Kafka, impossible with Redis Pub/Sub

**Redis Alternative**: Redis Pub/Sub is fire-and-forget. Once published, data is gone. Can't replay, can't handle slow consumers, can't retain for 30 days.

**This Is What Kafka Was Built For**: Event streaming with multiple consumers at different speeds.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 200,
    tags: ['redis', 'kafka', 'clickstream', 'analytics'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 7: Job Queue for Background Tasks
  // ============================================================================
  {
    id: 'redis-kafka-job-queue',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You need a job queue for processing background tasks (image resizing, email sending)',
      requirements: [
        '10K jobs per hour',
        'Workers pull jobs and process them',
        'Jobs should be retried up to 3 times on failure',
        'Need visibility into pending/failed jobs',
        'Jobs expire if not processed within 24 hours',
      ],
      constraints: [
        'Simple job queue semantics',
        'Workers need to pull jobs on-demand',
      ],
      metrics: {
        'Volume': '10K jobs/hour',
        'Retry': 'Up to 3 times',
        'TTL': '24 hours',
      },
    },
    question: 'For a background job queue, would you choose Redis or Kafka? Consider the job queue semantics.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Redis for simple job queues',
          keywords: ['redis', 'list', 'lpush', 'brpop', 'queue'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Job queue semantics',
          keywords: ['queue', 'pull', 'workers', 'dequeue'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Redis simpler for this use case',
          keywords: ['simple', 'straightforward', 'easy'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Simplicity vs Durability',
          options: [
            {
              name: 'Redis',
              pros: ['Simple queue primitives (LPUSH/BRPOP)', 'Pull model natural', 'Lower overhead'],
              cons: ['Jobs lost on crash unless using persistence'],
            },
            {
              name: 'Kafka',
              pros: ['Durable', 'Can replay failed jobs'],
              cons: ['More complex for simple queue', 'Pull model less natural', 'Overkill'],
            },
          ],
        },
      ],
      antipatterns: [],
      optionalPoints: [
        'redis streams',
        'sidekiq pattern',
        'dead letter queue',
      ],
    },
    explanation: `
**Recommended: Redis (with consideration)**

For simple job queues, Redis is typically simpler:

1. **Queue Primitives**:
   - LPUSH jobs_queue job_data → Add job
   - BRPOP jobs_queue → Worker pulls job (blocking)
   - Natural pull-based model

2. **Simplicity**: Redis job queues (like Sidekiq, Bull, Celery with Redis) are battle-tested

3. **TTL & Retries**: Easy to implement with Redis data structures

**When To Consider Kafka**:
- Jobs are critical (financial transactions) → Need durability
- Need to audit all job history
- Jobs feed multiple workers with different processing logic

**Hybrid Approach**: Many systems use Redis for the job queue, but log job results to Kafka for auditing.

**Common Pattern**: Redis (Sidekiq/Celery) for most background jobs, Kafka for event-driven workflows.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 200,
    tags: ['redis', 'kafka', 'job-queue', 'background-tasks'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 8: Metrics Aggregation for Monitoring
  // ============================================================================
  {
    id: 'redis-kafka-metrics',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'Building real-time metrics aggregation for application monitoring',
      requirements: [
        '100K metric data points per second',
        'Aggregate metrics in 1-minute windows',
        'Need to query current metrics with <50ms latency',
        'Feed aggregated metrics to: alerting system, dashboard, long-term storage',
        'Keep raw metrics for 1 hour, aggregated for 7 days',
      ],
      constraints: [
        'Real-time alerting requires fast reads',
        'Multiple consumers need different granularities',
      ],
      metrics: {
        'Ingestion': '100K points/sec',
        'Window': '1 minute',
        'Query Latency': '<50ms',
        'Retention': 'Raw: 1hr, Aggregated: 7 days',
      },
    },
    question: 'For metrics aggregation, would you use Redis or Kafka? Design the architecture.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Kafka Streams for aggregation',
          keywords: ['kafka streams', 'aggregation', 'windowing', 'stream processing'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Redis for query layer',
          keywords: ['redis', 'query', 'fast reads', 'cache'],
          weight: 0.8,
          mustMention: false,
        },
        {
          concept: 'Time-series data',
          keywords: ['time-series', 'metrics', 'monitoring'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Processing vs Storage',
          options: [
            {
              name: 'Kafka (for ingestion & processing)',
              pros: ['Handle 100K/sec easily', 'Kafka Streams for aggregation', 'Multiple consumers'],
              cons: ['Not optimized for queries'],
            },
            {
              name: 'Redis (for query layer)',
              pros: ['Fast queries (<50ms)', 'TimeSeries module', 'Good for current values'],
              cons: ['Not for raw 100K/sec ingestion'],
            },
          ],
        },
      ],
      antipatterns: [
        'redis for 100k/sec writes',
        'kafka for fast queries',
      ],
      optionalPoints: [
        'lambda architecture',
        'prometheus',
        'timeseries database',
      ],
    },
    explanation: `
**Recommended: Both (Lambda Architecture)**

Metrics monitoring benefits from using both:

**Architecture**:
1. **Kafka for Ingestion**: Ingest 100K raw metrics/sec
2. **Kafka Streams for Aggregation**: Compute 1-minute windows
3. **Redis for Query Layer**: Store current aggregated values for <50ms queries
4. **Kafka for Long-Term**: Feed to time-series DB (Prometheus, InfluxDB)

**Why Both**:
- Kafka: Perfect for high-throughput ingestion and stream processing
- Redis: Perfect for fast queries of current state
- Together: Best of both worlds

**Alternatives**:
- **Kafka Only**: Possible with Kafka Streams + Interactive Queries, but query latency higher
- **Redis Only**: Cannot handle 100K writes/sec sustainably
- **Purpose-Built**: Prometheus, InfluxDB designed specifically for metrics

**Key Insight**: Complex systems often use multiple tools. Kafka + Redis is a common pairing.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 240,
    tags: ['redis', 'kafka', 'metrics', 'monitoring', 'architecture'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 9: Chat Message Delivery
  // ============================================================================
  {
    id: 'redis-kafka-chat',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'Building message delivery for a chat application like Slack',
      requirements: [
        'Deliver messages to online users in real-time',
        'Store message history for offline users',
        'Users can scroll back through channel history (last 10K messages)',
        'Messages must be delivered exactly once to each user',
        'Support 1M concurrent users',
      ],
      constraints: [
        'Real-time delivery critical for UX',
        'Must handle users going online/offline',
      ],
      metrics: {
        'Concurrent Users': '1M',
        'History': 'Last 10K messages per channel',
        'Delivery': 'Exactly once per user',
      },
    },
    question: 'For chat message delivery, would you use Redis Pub/Sub or Kafka? Justify your architecture.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Kafka for message persistence',
          keywords: ['kafka', 'persist', 'history', 'storage', 'durable'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Consumer offsets for per-user delivery',
          keywords: ['offset', 'consumer', 'per-user', 'exactly-once'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Redis Pub/Sub is fire-and-forget',
          keywords: ['redis', 'pubsub', 'fire-and-forget', 'no history'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Delivery Guarantees',
          options: [
            {
              name: 'Kafka',
              pros: ['Exactly-once delivery', 'Message history', 'Offline user support', 'Per-user offsets'],
              cons: ['Slightly higher latency'],
            },
            {
              name: 'Redis Pub/Sub',
              pros: ['Lower latency', 'Simple'],
              cons: ['No history', 'Fire-and-forget', 'Offline users miss messages'],
            },
          ],
        },
      ],
      antipatterns: [
        'redis pubsub for chat history',
        'fire-and-forget for offline users',
      ],
      optionalPoints: [
        'kafka partition per channel',
        'consumer group per user',
        'websocket delivery',
      ],
    },
    explanation: `
**Recommended: Kafka**

Chat systems need message persistence:

1. **Offline Users**: When user comes back online, they catch up from their last offset. Redis Pub/Sub would lose all messages while offline

2. **Message History**: Users scroll back through channel history. Kafka stores last 10K messages (or retention-based). Redis Pub/Sub stores nothing

3. **Exactly-Once Delivery**: Each user tracks their offset, ensuring they see each message exactly once

4. **Real-World Example**: Discord, Slack-like systems use Kafka or similar event logs

**Redis Pub/Sub Limitations**:
- Published messages delivered only to currently subscribed clients
- No history, no persistence
- Would need separate storage for offline users

**Architecture**: Kafka per channel, consumer group per user, WebSocket for real-time push, Kafka as source of truth.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 220,
    tags: ['redis', 'kafka', 'chat', 'messaging', 'pubsub'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Variation 10: Caching API Responses
  // ============================================================================
  {
    id: 'redis-kafka-api-cache',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You need to cache expensive API responses to reduce database load',
      requirements: [
        'API responses take 500ms to compute from database',
        'Same responses requested many times per second',
        'Cached responses expire after 5 minutes',
        'Need sub-10ms cache lookups',
        'Cache hit ratio target: >80%',
      ],
      constraints: [
        'Cannot impact API latency',
        'Simple key-value caching',
      ],
      metrics: {
        'Compute Time': '500ms from DB',
        'Cache Lookup': '<10ms',
        'TTL': '5 minutes',
      },
    },
    question: 'For caching API responses, should you use Redis or Kafka? Explain your reasoning.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Redis for caching',
          keywords: ['redis', 'cache', 'key-value', 'fast', 'lookup'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Sub-millisecond lookups',
          keywords: ['fast', '<10ms', 'millisecond', 'latency'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Kafka not designed for caching',
          keywords: ['kafka', 'not cache', 'append-only', 'not for lookups'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [],
      antipatterns: [
        'kafka for caching',
        'event log for api cache',
      ],
      optionalPoints: [
        'cache-aside pattern',
        'redis cluster',
        'eviction policy',
      ],
    },
    explanation: `
**Recommended: Redis (Obvious Choice)**

This is a quintessential Redis use case:

1. **What Redis Was Built For**: Fast key-value caching with TTL

2. **Performance**: Redis GET operations <1ms, easily meets <10ms requirement

3. **TTL Support**: SET key value EX 300 → Auto-expires after 5 minutes

4. **Pattern**:
   \`\`\`
   cached = redis.get(cache_key)
   if cached:
       return cached
   result = expensive_db_query()
   redis.setex(cache_key, 300, result)
   return result
   \`\`\`

**Why Not Kafka**: Kafka is an append-only event log, not a cache. No way to efficiently lookup by key, no TTL, wrong tool entirely.

**This Is The Easiest Question**: If you need a cache, use Redis (or Memcached). Kafka is for event streams.
    `,
    difficulty: 'easy',
    estimatedTimeSeconds: 120,
    tags: ['redis', 'kafka', 'caching', 'api'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Continue with 5 more variations...
  // ============================================================================
  // (I'll add these to reach 15+ total scenarios)
];

export default redisVsKafkaQuestions;
