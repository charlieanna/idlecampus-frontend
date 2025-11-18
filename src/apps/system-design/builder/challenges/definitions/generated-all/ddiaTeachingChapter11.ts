/**
 * DDIA Chapter 11: Stream Processing - Teaching Problems
 *
 * Focus: Real-time processing of unbounded data streams
 *
 * Problems:
 * Messaging Systems (5):
 * 1. Message Brokers - Kafka/RabbitMQ for decoupling
 * 2. Pub/Sub - Topic-based message routing
 * 3. Partitioned Logs - Ordered, durable message storage
 * 4. Consumer Groups - Parallel message consumption
 * 5. Offset Management - Track consumption progress
 *
 * Stream Processing Windows (5):
 * 6. Tumbling Windows - Fixed-size, non-overlapping windows
 * 7. Sliding Windows - Overlapping time windows
 * 8. Session Windows - Activity-based windowing
 * 9. Event Time vs Processing Time - Handle late arrivals
 * 10. Watermarks - Track event time progress
 *
 * Stream Operations (5):
 * 11. Stream Joins - Join streams with tables/streams
 * 12. Stream Aggregations - Windowed aggregations
 * 13. Stream-Table Duality - Streams as changelog
 * 14. Exactly-Once Semantics - Idempotent processing
 * 15. Checkpointing - Save and restore stream state
 */

import { ProblemDefinition } from '../../../types/problemDefinition';
import { generateScenarios } from '../../scenarioGenerator';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

// ============================================================================
// MESSAGING SYSTEMS (5 PROBLEMS)
// ============================================================================

/**
 * Problem 1: Message Brokers - Kafka/RabbitMQ
 */
export const messageBrokersProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-message-brokers',
  title: 'Message Brokers - Asynchronous Messaging',
  description: `Implement a message broker for asynchronous communication between producers and consumers.

**Concepts:**
- Decouple producers from consumers
- Buffer messages for asynchronous processing
- Message persistence (durability)
- Multiple consumers per message (fan-out)
- At-least-once, at-most-once, exactly-once delivery

**Learning Objectives:**
- Build message queue with pub/sub
- Handle producer and consumer at different speeds
- Implement message persistence
- Compare Kafka (log-based) vs RabbitMQ (queue-based)`,
  userFacingFRs: [
    'Producers publish messages to topics',
    'Consumers subscribe to topics',
    'Buffer messages when consumers are slow',
    'Persist messages to disk (durability)',
    'Deliver messages to all subscribers (fan-out)',
    'Acknowledge message processing',
  ],
  userFacingNFRs: [
    'Throughput: 100K+ messages/second',
    'Latency: <10ms end-to-end',
    'Durability: Messages survive broker restart',
    'Retention: Configurable (hours to days)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'publish',
        title: 'Publish Messages',
        description: 'Producers send messages to topics',
        category: 'Messaging',
      },
      {
        id: 'subscribe',
        title: 'Subscribe to Topics',
        description: 'Consumers receive messages from topics',
        category: 'Messaging',
      },
      {
        id: 'persistence',
        title: 'Message Persistence',
        description: 'Durable storage of messages',
        category: 'Reliability',
      },
    ],
    constraints: [
      {
        id: 'async-communication',
        title: 'Asynchronous',
        description: 'Producers don\'t wait for consumers',
        type: 'technical',
      },
      {
        id: 'ordering',
        title: 'Ordering Guarantees',
        description: 'Messages may be reordered (depends on partitioning)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'throughput',
      name: 'High Throughput',
      description: 'Handle 100K messages/second',
      validate: (solution: any) => ({
        passed: true,
        message: 'Throughput: 150K messages/second',
      }),
    },
    {
      id: 'durability',
      name: 'Message Durability',
      description: 'Messages survive broker restart',
      validate: (solution: any) => ({
        passed: true,
        message: 'All messages recovered after restart',
      }),
    },
  ],
  hints: [
    'Kafka uses append-only log (high throughput)',
    'RabbitMQ uses queues (message deleted after consumption)',
    'Persist messages to disk before acknowledging',
    'Use partitions for parallelism and ordering',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Message Brokers',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Documentation',
      url: 'https://kafka.apache.org/documentation/',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['stream-processing', 'messaging', 'kafka', 'message-broker'],
};

/**
 * Problem 2: Pub/Sub - Topic-Based Routing
 */
export const pubSubProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-pub-sub',
  title: 'Pub/Sub - Topic-Based Message Routing',
  description: `Implement publish-subscribe pattern with topic-based routing for flexible message distribution.

**Concepts:**
- Publishers send messages to topics (not directly to subscribers)
- Subscribers register interest in topics
- Multiple subscribers receive same message (fan-out)
- Topic hierarchies and wildcards
- Filtering and routing

**Learning Objectives:**
- Route messages based on topics
- Support multiple subscribers per topic
- Implement topic hierarchies (e.g., "orders.us.california")
- Handle dynamic subscriptions`,
  userFacingFRs: [
    'Publishers send messages to topics (e.g., "orders.created")',
    'Subscribers subscribe to topics or patterns (e.g., "orders.*")',
    'Route messages to all matching subscribers',
    'Support topic hierarchies (e.g., "events.user.signup")',
    'Wildcard subscriptions (e.g., "events.user.*")',
    'Dynamic subscribe/unsubscribe',
  ],
  userFacingNFRs: [
    'Routing latency: <5ms',
    'Fan-out: 1000+ subscribers per topic',
    'Topics: Support 10,000+ topics',
    'Pattern matching: Efficient wildcard routing',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'topic-publish',
        title: 'Topic Publishing',
        description: 'Publish messages to named topics',
        category: 'Messaging',
      },
      {
        id: 'topic-subscribe',
        title: 'Topic Subscription',
        description: 'Subscribe to topics and patterns',
        category: 'Messaging',
      },
      {
        id: 'message-routing',
        title: 'Message Routing',
        description: 'Route to all matching subscribers',
        category: 'Messaging',
      },
    ],
    constraints: [
      {
        id: 'no-direct-addressing',
        title: 'No Direct Addressing',
        description: 'Publishers don\'t know subscribers',
        type: 'technical',
      },
      {
        id: 'dynamic-topology',
        title: 'Dynamic Topology',
        description: 'Subscribers can join/leave at any time',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.7, write: 0.3 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'routing-correct',
      name: 'Routing Correctness',
      description: 'Messages reach all matching subscribers',
      validate: (solution: any) => ({
        passed: true,
        message: 'Message routed to 15 matching subscribers',
      }),
    },
    {
      id: 'wildcard-works',
      name: 'Wildcard Matching',
      description: 'Wildcard subscriptions work correctly',
      validate: (solution: any) => ({
        passed: true,
        message: '"events.*" matched 100 different topics',
      }),
    },
  ],
  hints: [
    'Use trie or prefix tree for efficient topic matching',
    'Topic format: "domain.entity.action" (e.g., "orders.items.updated")',
    'Wildcards: "*" (one level), "#" (multiple levels)',
    'Google Cloud Pub/Sub, AWS SNS use this pattern',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Pub/Sub',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Pub/Sub Pattern',
      url: 'https://cloud.google.com/pubsub/docs/overview',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['stream-processing', 'pub-sub', 'messaging', 'routing'],
};

/**
 * Problem 3: Partitioned Logs - Ordered Message Storage
 */
export const partitionedLogsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-partitioned-logs',
  title: 'Partitioned Logs - Ordered, Durable Message Streams',
  description: `Implement partitioned append-only logs for ordered, durable message storage like Kafka.

**Concepts:**
- Append-only log (immutable)
- Partitions for parallelism and ordering
- Offsets for message position
- Retention policy (time or size-based)
- Compaction for changelog streams

**Learning Objectives:**
- Partition messages by key
- Maintain ordering within partition
- Implement offset-based consumption
- Handle log retention and compaction`,
  userFacingFRs: [
    'Append messages to partitioned log',
    'Partition by key (same key → same partition)',
    'Assign monotonic offsets within partition',
    'Read messages from offset (sequential)',
    'Retain messages for configured time (e.g., 7 days)',
    'Compact logs (keep latest value per key)',
  ],
  userFacingNFRs: [
    'Write throughput: 100MB/s per partition',
    'Sequential reads: Fast (disk sequential I/O)',
    'Retention: Days to weeks',
    'Compaction: Space-efficient changelog storage',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'append-only',
        title: 'Append-Only Log',
        description: 'Immutable message append',
        category: 'Storage',
      },
      {
        id: 'partitioning',
        title: 'Partitioning',
        description: 'Partition by key for parallelism',
        category: 'Scalability',
      },
      {
        id: 'offset-tracking',
        title: 'Offset Tracking',
        description: 'Track message position in log',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'ordering-per-partition',
        title: 'Ordering Per Partition',
        description: 'Ordering guaranteed within partition, not across',
        type: 'technical',
      },
      {
        id: 'immutable',
        title: 'Immutable',
        description: 'Messages cannot be modified after write',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 0.6, write: 0.4 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'ordering-preserved',
      name: 'Ordering Preserved',
      description: 'Messages in partition are ordered',
      validate: (solution: any) => ({
        passed: true,
        message: 'Partition 0: Messages ordered by offset (0, 1, 2, ...)',
      }),
    },
    {
      id: 'compaction-works',
      name: 'Log Compaction',
      description: 'Compaction keeps latest value per key',
      validate: (solution: any) => ({
        passed: true,
        message: 'Log compacted: 1M messages → 100K (latest per key)',
      }),
    },
  ],
  hints: [
    'Kafka uses partitioned logs as core abstraction',
    'Partition by hash(key) % num_partitions',
    'Offset is position in partition (0, 1, 2, ...)',
    'Compaction: Merge segments, keep latest value per key',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Partitioned Logs',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Log Compaction',
      url: 'https://kafka.apache.org/documentation/#compaction',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 75,
  tags: ['stream-processing', 'kafka', 'partitioned-log', 'storage'],
};

/**
 * Problem 4: Consumer Groups - Parallel Consumption
 */
export const consumerGroupsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-consumer-groups',
  title: 'Consumer Groups - Parallel Message Consumption',
  description: `Implement consumer groups for load-balanced, parallel message consumption.

**Concepts:**
- Consumer group: Multiple consumers share workload
- Each partition consumed by one consumer in group
- Rebalancing when consumers join/leave
- Multiple groups can consume same messages
- Load balancing within group

**Learning Objectives:**
- Assign partitions to consumers
- Handle consumer failures and rebalancing
- Support multiple consumer groups
- Understand parallelism limits (num partitions)`,
  userFacingFRs: [
    'Create consumer group with multiple consumers',
    'Assign each partition to one consumer in group',
    'Rebalance partitions when consumer joins/leaves',
    'Support multiple independent consumer groups',
    'Each group maintains its own offsets',
    'Detect failed consumers (heartbeat timeout)',
  ],
  userFacingNFRs: [
    'Rebalancing time: <10 seconds',
    'Parallelism: Max consumers = num partitions',
    'Isolation: Groups don\'t affect each other',
    'Fault tolerance: Automatic failover',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'partition-assignment',
        title: 'Partition Assignment',
        description: 'Assign partitions to consumers',
        category: 'Load Balancing',
      },
      {
        id: 'rebalancing',
        title: 'Rebalancing',
        description: 'Redistribute partitions on topology change',
        category: 'Fault Tolerance',
      },
      {
        id: 'multi-group',
        title: 'Multiple Groups',
        description: 'Independent consumer groups',
        category: 'Scalability',
      },
    ],
    constraints: [
      {
        id: 'one-consumer-per-partition',
        title: 'One Consumer Per Partition',
        description: 'Partition assigned to at most one consumer in group',
        type: 'technical',
      },
      {
        id: 'parallelism-limit',
        title: 'Parallelism Limit',
        description: 'Max parallelism = number of partitions',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'load-balanced',
      name: 'Load Balanced',
      description: 'Partitions evenly distributed',
      validate: (solution: any) => ({
        passed: true,
        message: '12 partitions distributed across 3 consumers (4 each)',
      }),
    },
    {
      id: 'rebalance-works',
      name: 'Rebalancing Works',
      description: 'Partitions redistributed on failure',
      validate: (solution: any) => ({
        passed: true,
        message: 'Consumer failed, partitions reassigned in 5s',
      }),
    },
  ],
  hints: [
    'Each consumer group maintains separate offset per partition',
    'Rebalancing strategies: range, round-robin, sticky',
    'Use coordinator to manage partition assignment',
    'Idle consumers if more consumers than partitions',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Consumer Groups',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Consumer Groups',
      url: 'https://kafka.apache.org/documentation/#consumergroups',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['stream-processing', 'consumer-groups', 'load-balancing', 'fault-tolerance'],
};

/**
 * Problem 5: Offset Management - Track Consumption Progress
 */
export const offsetManagementProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-offset-management',
  title: 'Offset Management - Track Message Consumption',
  description: `Implement offset management to track and resume message consumption reliably.

**Concepts:**
- Offset: Position in partition (message ID)
- Commit offsets after processing
- Auto-commit vs manual commit
- Offset storage (Kafka, database, etc.)
- Resume from last committed offset

**Learning Objectives:**
- Track consumer offset per partition
- Commit offsets after processing
- Handle failures and resume correctly
- Understand at-least-once vs at-most-once`,
  userFacingFRs: [
    'Read messages starting from offset',
    'Process messages',
    'Commit offset after successful processing',
    'Store committed offsets (per partition, per consumer group)',
    'Resume from last committed offset after restart',
    'Support auto-commit and manual commit',
  ],
  userFacingNFRs: [
    'Offset commit latency: <100ms',
    'Durability: Offsets survive consumer restart',
    'At-least-once: Messages reprocessed on failure',
    'Offset lag: Track how far behind consumer is',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'offset-tracking',
        title: 'Offset Tracking',
        description: 'Track current offset per partition',
        category: 'State Management',
      },
      {
        id: 'offset-commit',
        title: 'Offset Commit',
        description: 'Persist offsets after processing',
        category: 'Reliability',
      },
      {
        id: 'offset-resume',
        title: 'Resume from Offset',
        description: 'Start reading from last committed offset',
        category: 'Fault Tolerance',
      },
    ],
    constraints: [
      {
        id: 'commit-timing',
        title: 'Commit Timing',
        description: 'Commit before processing = at-most-once, after = at-least-once',
        type: 'technical',
      },
      {
        id: 'offset-storage',
        title: 'Offset Storage',
        description: 'Offsets must be stored durably',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'resume-correct',
      name: 'Resume Correctly',
      description: 'Resume from last committed offset',
      validate: (solution: any) => ({
        passed: true,
        message: 'Resumed at offset 1000 after restart',
      }),
    },
    {
      id: 'at-least-once',
      name: 'At-Least-Once',
      description: 'No message loss (may have duplicates)',
      validate: (solution: any) => ({
        passed: true,
        message: 'All messages processed (3 duplicates after failure)',
      }),
    },
  ],
  hints: [
    'Commit offset AFTER processing for at-least-once',
    'Commit offset BEFORE processing for at-most-once',
    'Store offsets in Kafka (__consumer_offsets topic)',
    'Auto-commit: Commits every N seconds (may lose/duplicate)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Offset Management',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Offset Management',
      url: 'https://kafka.apache.org/documentation/#consumerconfigs',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['stream-processing', 'offset', 'state-management', 'reliability'],
};

// ============================================================================
// STREAM PROCESSING WINDOWS (5 PROBLEMS)
// ============================================================================

/**
 * Problem 6: Tumbling Windows - Fixed-Size Windows
 */
export const tumblingWindowsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-tumbling-windows',
  title: 'Tumbling Windows - Fixed-Size, Non-Overlapping',
  description: `Implement tumbling windows for fixed-size, non-overlapping time-based aggregations.

**Concepts:**
- Fixed window size (e.g., 1 minute)
- Non-overlapping (each event in exactly one window)
- Windows aligned to epoch (e.g., :00, :01, :02)
- Aggregate events within window
- Example: Count events per minute

**Learning Objectives:**
- Assign events to tumbling windows
- Aggregate events within windows
- Emit results when window closes
- Handle late arrivals`,
  userFacingFRs: [
    'Define window size (e.g., 1 minute)',
    'Assign each event to window based on timestamp',
    'Aggregate events within window (count, sum, avg)',
    'Emit result when window closes',
    'Example: Count page views per minute',
    'Handle events arriving out of order',
  ],
  userFacingNFRs: [
    'Window size: Configurable (seconds to hours)',
    'Alignment: Windows aligned to epoch',
    'Latency: Emit when window closes',
    'Completeness: Wait for late arrivals (grace period)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'window-assignment',
        title: 'Window Assignment',
        description: 'Assign events to windows',
        category: 'Windowing',
      },
      {
        id: 'window-aggregation',
        title: 'Window Aggregation',
        description: 'Aggregate events within window',
        category: 'Processing',
      },
      {
        id: 'window-trigger',
        title: 'Window Trigger',
        description: 'Emit results when window closes',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'non-overlapping',
        title: 'Non-Overlapping',
        description: 'Each event belongs to exactly one window',
        type: 'technical',
      },
      {
        id: 'fixed-size',
        title: 'Fixed Size',
        description: 'All windows same size',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'window-correct',
      name: 'Window Assignment',
      description: 'Events assigned to correct windows',
      validate: (solution: any) => ({
        passed: true,
        message: 'Event at 10:00:30 assigned to window [10:00:00, 10:01:00)',
      }),
    },
    {
      id: 'aggregation-correct',
      name: 'Aggregation Correct',
      description: 'Window aggregations are accurate',
      validate: (solution: any) => ({
        passed: true,
        message: 'Window [10:00, 10:01): 1,543 events',
      }),
    },
  ],
  hints: [
    'Window assignment: floor(timestamp / window_size) * window_size',
    'Example: 10:00:30 with 1-min window → window [10:00:00, 10:01:00)',
    'Use grace period for late arrivals (e.g., +5 seconds)',
    'Flink, Spark Streaming, Kafka Streams support tumbling windows',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Tumbling Windows',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Stream Processing Windows',
      url: 'https://www.confluent.io/blog/windowing-in-kafka-streams/',
      type: 'article',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['stream-processing', 'windowing', 'tumbling-window', 'aggregation'],
};

/**
 * Problem 7: Sliding Windows - Overlapping Windows
 */
export const slidingWindowsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-sliding-windows',
  title: 'Sliding Windows - Overlapping Time Windows',
  description: `Implement sliding windows for overlapping time-based aggregations.

**Concepts:**
- Window size and slide interval
- Overlapping windows (event in multiple windows)
- Example: 5-minute window, 1-minute slide
- Higher computation cost than tumbling
- Smooth metrics (less jumpy than tumbling)

**Learning Objectives:**
- Assign events to multiple overlapping windows
- Aggregate with sliding windows
- Optimize with incremental updates
- Compare with tumbling windows`,
  userFacingFRs: [
    'Define window size and slide interval',
    'Assign each event to multiple windows',
    'Aggregate events within each window',
    'Emit results at each slide',
    'Example: 5-minute moving average, updated every minute',
    'Optimize with incremental computation',
  ],
  userFacingNFRs: [
    'Window size: Configurable (e.g., 5 minutes)',
    'Slide interval: Configurable (e.g., 1 minute)',
    'Overlap: window_size / slide_interval',
    'Latency: Emit every slide interval',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'sliding-assignment',
        title: 'Sliding Window Assignment',
        description: 'Assign events to overlapping windows',
        category: 'Windowing',
      },
      {
        id: 'incremental-agg',
        title: 'Incremental Aggregation',
        description: 'Update aggregates efficiently',
        category: 'Optimization',
      },
      {
        id: 'sliding-trigger',
        title: 'Sliding Trigger',
        description: 'Emit results at each slide',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'overlapping',
        title: 'Overlapping',
        description: 'Each event in multiple windows',
        type: 'technical',
      },
      {
        id: 'higher-cost',
        title: 'Higher Cost',
        description: 'More computation than tumbling windows',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'overlap-correct',
      name: 'Overlap Correct',
      description: 'Events assigned to all overlapping windows',
      validate: (solution: any) => ({
        passed: true,
        message: 'Event at 10:02:30 in 5 windows (5-min size, 1-min slide)',
      }),
    },
    {
      id: 'smooth-metric',
      name: 'Smooth Metric',
      description: 'Metric changes smoothly (not jumpy)',
      validate: (solution: any) => ({
        passed: true,
        message: 'Moving average: 100, 102, 105, 103 (smooth)',
      }),
    },
  ],
  hints: [
    '5-minute window, 1-minute slide → event in 5 windows',
    'Sliding window = multiple overlapping tumbling windows',
    'Optimize: Add new events, subtract old events (incremental)',
    'Use for metrics dashboards (smooth charts)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Sliding Windows',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Sliding Window Aggregation',
      url: 'https://flink.apache.org/news/2015/12/04/Introducing-windows.html',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 75,
  tags: ['stream-processing', 'windowing', 'sliding-window', 'aggregation'],
};

/**
 * Problem 8: Session Windows - Activity-Based Windowing
 */
export const sessionWindowsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-session-windows',
  title: 'Session Windows - Activity-Based Windows',
  description: `Implement session windows that group events based on activity gaps.

**Concepts:**
- Session gap: Inactivity timeout (e.g., 30 minutes)
- Window closes after gap with no events
- Variable window size (depends on activity)
- Example: User session on website
- Late arrivals can extend session

**Learning Objectives:**
- Detect session boundaries (inactivity gaps)
- Handle variable-length sessions
- Merge sessions when late events arrive
- Use for user behavior analysis`,
  userFacingFRs: [
    'Define session gap (e.g., 30 minutes inactivity)',
    'Group events into sessions',
    'Close session after gap timeout',
    'Extend session if event arrives within gap',
    'Merge sessions if late event fills gap',
    'Example: Track user website sessions',
  ],
  userFacingNFRs: [
    'Session gap: Configurable (minutes to hours)',
    'Variable length: Sessions can be any duration',
    'Late arrivals: May extend or merge sessions',
    'Use case: Clickstream analysis, user sessions',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'session-detection',
        title: 'Session Detection',
        description: 'Detect session boundaries based on gaps',
        category: 'Windowing',
      },
      {
        id: 'session-extension',
        title: 'Session Extension',
        description: 'Extend session with new events',
        category: 'Windowing',
      },
      {
        id: 'session-merging',
        title: 'Session Merging',
        description: 'Merge sessions when gap filled by late event',
        category: 'Windowing',
      },
    ],
    constraints: [
      {
        id: 'variable-length',
        title: 'Variable Length',
        description: 'Sessions can be any length',
        type: 'technical',
      },
      {
        id: 'late-arrival-complexity',
        title: 'Late Arrival Complexity',
        description: 'Late events may require merging two sessions',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 30000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'session-detected',
      name: 'Session Detection',
      description: 'Sessions identified by inactivity gaps',
      validate: (solution: any) => ({
        passed: true,
        message: 'User session: 10:00-10:25 (5 events, then 30-min gap)',
      }),
    },
    {
      id: 'session-merged',
      name: 'Session Merging',
      description: 'Late event merges two sessions',
      validate: (solution: any) => ({
        passed: true,
        message: 'Sessions [10:00-10:20] and [10:35-10:50] merged by event at 10:25',
      }),
    },
  ],
  hints: [
    'Session gap: If no events for 30 min, close session',
    'Late event within gap: Extend session',
    'Late event fills gap between sessions: Merge sessions',
    'Flink, Beam support session windows natively',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Session Windows',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Session Windows in Flink',
      url: 'https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/operators/windows/#session-windows',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['stream-processing', 'windowing', 'session-window', 'user-behavior'],
};

/**
 * Problem 9: Event Time vs Processing Time - Handle Late Arrivals
 */
export const eventTimeVsProcessingTimeProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-event-time-vs-processing-time',
  title: 'Event Time vs Processing Time - Late Event Handling',
  description: `Understand and handle the difference between event time (when event occurred) and processing time (when event processed).

**Concepts:**
- Event time: Timestamp when event occurred (embedded in event)
- Processing time: Time when event processed by stream processor
- Skew: Event time can be far behind processing time
- Late arrivals: Events arrive out of order
- Watermarks: Track event time progress

**Learning Objectives:**
- Use event time for windowing (not processing time)
- Handle events arriving out of order
- Set grace period for late arrivals
- Understand completeness vs latency trade-off`,
  userFacingFRs: [
    'Extract event timestamp from message',
    'Use event time for window assignment (not processing time)',
    'Handle events arriving out of order',
    'Define grace period for late arrivals (e.g., +5 minutes)',
    'Emit window result after grace period',
    'Optionally update results with very late arrivals',
  ],
  userFacingNFRs: [
    'Event time skew: Events can be hours/days old',
    'Out-of-order: Events arrive in random order',
    'Grace period: Trade-off between latency and completeness',
    'Correctness: Results based on event time, not processing time',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'event-time-extraction',
        title: 'Event Time Extraction',
        description: 'Extract timestamp from event',
        category: 'Processing',
      },
      {
        id: 'out-of-order-handling',
        title: 'Out-of-Order Handling',
        description: 'Handle events arriving in wrong order',
        category: 'Processing',
      },
      {
        id: 'late-arrival-handling',
        title: 'Late Arrival Handling',
        description: 'Manage late-arriving events',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'skew',
        title: 'Time Skew',
        description: 'Event time can lag processing time significantly',
        type: 'technical',
      },
      {
        id: 'completeness-latency',
        title: 'Completeness vs Latency',
        description: 'Wait longer = more complete, but higher latency',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'event-time-correct',
      name: 'Event Time Used',
      description: 'Windows based on event time, not processing time',
      validate: (solution: any) => ({
        passed: true,
        message: 'Event from 10:00 assigned to 10:00 window (arrived at 10:15)',
      }),
    },
    {
      id: 'late-handled',
      name: 'Late Events Handled',
      description: 'Late events processed within grace period',
      validate: (solution: any) => ({
        passed: true,
        message: '95% of events arrived within 5-minute grace period',
      }),
    },
  ],
  hints: [
    'Use event timestamp (not system clock) for windowing',
    'Mobile events can be hours old (offline, then sync)',
    'Grace period: Wait 5 min after window closes for late events',
    'Very late events: Either drop or trigger result update',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Event Time',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Streaming 101: Event Time',
      url: 'https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 75,
  tags: ['stream-processing', 'event-time', 'processing-time', 'late-arrival'],
};

/**
 * Problem 10: Watermarks - Track Event Time Progress
 */
export const watermarksProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-watermarks',
  title: 'Watermarks - Track Event Time Progress',
  description: `Implement watermarks to track the progress of event time and trigger window computations.

**Concepts:**
- Watermark: Assertion that no events before time T will arrive
- Watermark(T): "All events with timestamp < T have been seen"
- Trigger window computation when watermark passes window end
- Heuristic watermarks (not perfect)
- Trade-off: Conservative (wait longer) vs aggressive (faster, may miss events)

**Learning Objectives:**
- Generate watermarks based on event timestamps
- Use watermarks to trigger window emission
- Handle late events after watermark
- Tune watermark lag for completeness vs latency`,
  userFacingFRs: [
    'Generate watermarks based on max event timestamp seen',
    'Add lag to watermark (e.g., max_timestamp - 5 minutes)',
    'Trigger window when watermark passes window end',
    'Emit window result after watermark trigger',
    'Handle events arriving after watermark (late)',
    'Optionally drop very late events',
  ],
  userFacingNFRs: [
    'Watermark lag: Configurable (minutes)',
    'Completeness: 95-99% events arrive before watermark',
    'Latency: Watermark lag adds to output latency',
    'Late events: <1% typically',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'watermark-generation',
        title: 'Watermark Generation',
        description: 'Generate watermarks from event timestamps',
        category: 'Processing',
      },
      {
        id: 'watermark-trigger',
        title: 'Watermark Trigger',
        description: 'Trigger window computation on watermark',
        category: 'Processing',
      },
      {
        id: 'late-event-handling',
        title: 'Late Event Handling',
        description: 'Handle events after watermark',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'heuristic',
        title: 'Heuristic Watermarks',
        description: 'Watermarks are estimates, not guarantees',
        type: 'technical',
      },
      {
        id: 'monotonic',
        title: 'Monotonic',
        description: 'Watermarks must increase monotonically',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'watermark-triggered',
      name: 'Watermark Trigger',
      description: 'Window emitted when watermark passes end',
      validate: (solution: any) => ({
        passed: true,
        message: 'Window [10:00-10:01) emitted when watermark reached 10:06',
      }),
    },
    {
      id: 'completeness',
      name: 'Event Completeness',
      description: 'Most events arrive before watermark',
      validate: (solution: any) => ({
        passed: true,
        message: '98% of events arrived before watermark',
      }),
    },
  ],
  hints: [
    'Watermark = max_event_timestamp - lag (e.g., -5 minutes)',
    'Emit window when watermark > window_end',
    'Conservative watermark (large lag): More complete, higher latency',
    'Aggressive watermark (small lag): Lower latency, may miss events',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Watermarks',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Streaming 102: Watermarks',
      url: 'https://www.oreilly.com/radar/the-world-beyond-batch-streaming-102/',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['stream-processing', 'watermark', 'event-time', 'windowing'],
};

// ============================================================================
// STREAM OPERATIONS (5 PROBLEMS)
// ============================================================================

/**
 * Problem 11: Stream Joins - Join Streams with Tables/Streams
 */
export const streamJoinsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-stream-joins',
  title: 'Stream Joins - Join Streams with Tables/Streams',
  description: `Implement stream joins to enrich streams or join multiple streams.

**Concepts:**
- Stream-table join: Enrich stream with table lookup
- Stream-stream join: Join two streams within window
- Table maintained from changelog stream
- Windowed joins (event time)
- Join state management

**Learning Objectives:**
- Join stream with table (lookup join)
- Join two streams (windowed join)
- Maintain join state
- Handle late arrivals in joins`,
  userFacingFRs: [
    'Stream-table join: Enrich events with dimension data',
    'Maintain table from changelog stream',
    'Stream-stream join: Join events within time window',
    'Buffer stream events for join window',
    'Emit joined result when match found',
    'Handle unmatched events (left/inner join)',
  ],
  userFacingNFRs: [
    'Stream-table: Lookup latency <10ms',
    'Stream-stream: Join window (e.g., ±10 minutes)',
    'State size: Buffer events within window',
    'Throughput: 10K+ joins/second',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'stream-table-join',
        title: 'Stream-Table Join',
        description: 'Enrich stream with table data',
        category: 'Processing',
      },
      {
        id: 'stream-stream-join',
        title: 'Stream-Stream Join',
        description: 'Join two streams within window',
        category: 'Processing',
      },
      {
        id: 'join-state',
        title: 'Join State Management',
        description: 'Maintain buffered events for join',
        category: 'State Management',
      },
    ],
    constraints: [
      {
        id: 'window-required',
        title: 'Window Required',
        description: 'Stream-stream join requires time window',
        type: 'technical',
      },
      {
        id: 'state-size',
        title: 'State Size',
        description: 'Join state can be large (buffered events)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.7, write: 0.3 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'stream-table-join-correct',
      name: 'Stream-Table Join',
      description: 'Events enriched with table data',
      validate: (solution: any) => ({
        passed: true,
        message: 'Enriched clickstream with user profile data',
      }),
    },
    {
      id: 'stream-stream-join-correct',
      name: 'Stream-Stream Join',
      description: 'Streams joined within window',
      validate: (solution: any) => ({
        passed: true,
        message: 'Joined clicks with purchases within 10-minute window',
      }),
    },
  ],
  hints: [
    'Stream-table: clicks JOIN users ON click.user_id = users.id',
    'Stream-stream: impressions JOIN clicks ON ad_id WITHIN 10 minutes',
    'Maintain table from changelog stream (INSERT, UPDATE, DELETE)',
    'Buffer both streams for windowed join',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Stream Joins',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Streams Joins',
      url: 'https://kafka.apache.org/documentation/streams/developer-guide/dsl-api.html#joining',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['stream-processing', 'join', 'enrichment', 'windowing'],
};

/**
 * Problem 12: Stream Aggregations - Windowed Aggregations
 */
export const streamAggregationsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-stream-aggregations',
  title: 'Stream Aggregations - Windowed Count/Sum/Average',
  description: `Implement windowed aggregations over streams (count, sum, average, min, max).

**Concepts:**
- Aggregate events within windows
- Maintain aggregate state
- Update aggregates incrementally
- Emit results when window closes
- Example: Count events per minute, average latency per hour

**Learning Objectives:**
- Aggregate events in tumbling/sliding windows
- Maintain aggregate state efficiently
- Handle late arrivals
- Implement various aggregation functions`,
  userFacingFRs: [
    'Count events per window',
    'Sum values per window',
    'Calculate average per window',
    'Find min/max per window',
    'Update aggregates incrementally with new events',
    'Emit aggregate when window closes',
  ],
  userFacingNFRs: [
    'Aggregation types: count, sum, avg, min, max',
    'Update latency: <1ms per event',
    'State size: O(num_windows * num_keys)',
    'Late arrivals: Update aggregate if within grace period',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'count-aggregation',
        title: 'Count Aggregation',
        description: 'Count events per window',
        category: 'Aggregation',
      },
      {
        id: 'numeric-aggregation',
        title: 'Numeric Aggregation',
        description: 'Sum, average, min, max',
        category: 'Aggregation',
      },
      {
        id: 'incremental-update',
        title: 'Incremental Update',
        description: 'Update aggregates efficiently',
        category: 'Optimization',
      },
    ],
    constraints: [
      {
        id: 'state-per-window',
        title: 'State Per Window',
        description: 'Must maintain state for active windows',
        type: 'technical',
      },
      {
        id: 'late-arrival-updates',
        title: 'Late Arrival Updates',
        description: 'May need to update emitted results',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'count-correct',
      name: 'Count Correct',
      description: 'Event counts accurate',
      validate: (solution: any) => ({
        passed: true,
        message: 'Window [10:00-10:01): 1,543 events',
      }),
    },
    {
      id: 'average-correct',
      name: 'Average Correct',
      description: 'Average calculated correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Window [10:00-10:01): avg latency = 127ms',
      }),
    },
  ],
  hints: [
    'Count: Increment counter for each event',
    'Sum: Add value to running total',
    'Average: Track sum and count, divide when emitting',
    'Min/Max: Update when new event is smaller/larger',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Stream Aggregations',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Flink Aggregations',
      url: 'https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/operators/windows/#aggregations',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['stream-processing', 'aggregation', 'windowing', 'analytics'],
};

/**
 * Problem 13: Stream-Table Duality - Streams as Changelogs
 */
export const streamTableDualityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-stream-table-duality',
  title: 'Stream-Table Duality - Streams as Changelogs',
  description: `Understand and implement stream-table duality: tables as materialized streams, streams as changelog.

**Concepts:**
- Table = materialized stream (current state)
- Stream = changelog of table (history of changes)
- Stream → Table: Replay stream to build table
- Table → Stream: Capture changes (CDC)
- Compacted log represents table

**Learning Objectives:**
- Build table by replaying stream
- Capture table changes as stream (CDC)
- Understand compacted logs
- Implement materialized views over streams`,
  userFacingFRs: [
    'Replay changelog stream to build table',
    'Emit stream of changes from table (INSERT, UPDATE, DELETE)',
    'Compact log: Keep latest value per key',
    'Materialize stream into table (queryable state)',
    'Query current state (table)',
    'Example: User profile table from profile update stream',
  ],
  userFacingNFRs: [
    'Replay: Build table from stream history',
    'Compaction: Reduce storage (keep latest per key)',
    'Query latency: <10ms on materialized table',
    'Consistency: Table reflects stream up to offset',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'stream-to-table',
        title: 'Stream to Table',
        description: 'Materialize stream into queryable table',
        category: 'Materialization',
      },
      {
        id: 'table-to-stream',
        title: 'Table to Stream',
        description: 'Capture table changes as stream (CDC)',
        category: 'Change Capture',
      },
      {
        id: 'log-compaction',
        title: 'Log Compaction',
        description: 'Compact stream to represent table',
        category: 'Optimization',
      },
    ],
    constraints: [
      {
        id: 'eventual-consistency',
        title: 'Eventual Consistency',
        description: 'Table eventually reflects stream (may lag)',
        type: 'technical',
      },
      {
        id: 'key-required',
        title: 'Key Required',
        description: 'Stream must have key for table materialization',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.6, write: 0.4 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'table-materialized',
      name: 'Table Materialized',
      description: 'Stream replayed to build table',
      validate: (solution: any) => ({
        passed: true,
        message: 'User table built from 1M profile updates',
      }),
    },
    {
      id: 'changelog-captured',
      name: 'Changelog Captured',
      description: 'Table changes emitted as stream',
      validate: (solution: any) => ({
        passed: true,
        message: 'CDC stream: 500 inserts, 200 updates, 50 deletes',
      }),
    },
  ],
  hints: [
    'Stream (changelog): (user_id, {name: "Alice", age: 30})',
    'Table (current state): {user_id: 123 → {name: "Alice", age: 30}}',
    'Replay stream: Apply each change to build current state',
    'Compacted log: Latest value for each key (represents table)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Stream-Table Duality',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Streams: Tables and Streams',
      url: 'https://kafka.apache.org/documentation/streams/core-concepts#streams_concepts_duality',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['stream-processing', 'stream-table-duality', 'cdc', 'materialization'],
};

/**
 * Problem 14: Exactly-Once Semantics - Idempotent Processing
 */
export const exactlyOnceSemanticsProblemmDefinition: ProblemDefinition = {
  id: 'ddia-ch11-exactly-once-semantics',
  title: 'Exactly-Once Semantics - Idempotent Stream Processing',
  description: `Implement exactly-once processing semantics to ensure each event affects results exactly once.

**Concepts:**
- At-most-once: May lose events
- At-least-once: May process duplicates
- Exactly-once: Each event affects result exactly once
- Idempotent operations
- Transactional writes (state + output together)
- Deduplication

**Learning Objectives:**
- Implement idempotent processing
- Use transactions for atomicity
- Deduplicate events
- Understand exactly-once guarantees and limitations`,
  userFacingFRs: [
    'Assign unique ID to each event',
    'Detect duplicate events (deduplication)',
    'Process each unique event exactly once',
    'Commit state and output atomically (transaction)',
    'Handle failures without duplicates or loss',
    'Example: Bank transfer processed exactly once',
  ],
  userFacingNFRs: [
    'No duplicates: Each event affects result once',
    'No loss: All events processed',
    'Atomicity: State and output updated together',
    'Performance: <10% overhead vs at-least-once',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'deduplication',
        title: 'Event Deduplication',
        description: 'Detect and skip duplicate events',
        category: 'Reliability',
      },
      {
        id: 'atomic-commit',
        title: 'Atomic Commit',
        description: 'Commit state and output atomically',
        category: 'Reliability',
      },
      {
        id: 'idempotency',
        title: 'Idempotent Operations',
        description: 'Operations safe to retry',
        category: 'Reliability',
      },
    ],
    constraints: [
      {
        id: 'end-to-end',
        title: 'End-to-End',
        description: 'Exactly-once requires support from source to sink',
        type: 'technical',
      },
      {
        id: 'overhead',
        title: 'Performance Overhead',
        description: 'Transactions add latency and reduce throughput',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'small',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'no-duplicates',
      name: 'No Duplicates',
      description: 'Each event processed exactly once',
      validate: (solution: any) => ({
        passed: true,
        message: 'All 10,000 events processed, 0 duplicates',
      }),
    },
    {
      id: 'no-loss',
      name: 'No Loss',
      description: 'All events accounted for',
      validate: (solution: any) => ({
        passed: true,
        message: 'All events processed despite 3 failures',
      }),
    },
  ],
  hints: [
    'Deduplication: Store event IDs in state, skip seen IDs',
    'Atomic commit: Use transactions to commit state + output',
    'Idempotent sink: SET key=value (not INCREMENT key)',
    'Kafka Streams, Flink provide exactly-once guarantees',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Exactly-Once Semantics',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Kafka Exactly-Once Semantics',
      url: 'https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/',
      type: 'article',
    },
  ],
  difficulty: 'expert',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['stream-processing', 'exactly-once', 'reliability', 'transactions'],
};

/**
 * Problem 15: Checkpointing - Save and Restore Stream State
 */
export const checkpointingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch11-checkpointing',
  title: 'Checkpointing - Fault-Tolerant Stream State',
  description: `Implement checkpointing to save stream processing state and recover from failures.

**Concepts:**
- Checkpoint: Snapshot of stream state + offset
- Periodic checkpointing (e.g., every 10 seconds)
- Coordinated checkpoint across operators
- Restore from checkpoint on failure
- Trade-off: Checkpoint frequency vs recovery time

**Learning Objectives:**
- Save stream state periodically
- Coordinate checkpoints in distributed system
- Restore state on failure
- Understand checkpoint-based recovery`,
  userFacingFRs: [
    'Take checkpoint of stream state periodically',
    'Save checkpoint with stream offset',
    'Coordinate checkpoint across all tasks',
    'Persist checkpoint to durable storage',
    'Restore state from latest checkpoint on failure',
    'Resume processing from checkpointed offset',
  ],
  userFacingNFRs: [
    'Checkpoint interval: 10-60 seconds',
    'Checkpoint size: Depends on state size',
    'Recovery time: Seconds to minutes',
    'Overhead: <5% throughput impact',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'checkpoint-creation',
        title: 'Checkpoint Creation',
        description: 'Snapshot state at specific offset',
        category: 'Fault Tolerance',
      },
      {
        id: 'checkpoint-coordination',
        title: 'Checkpoint Coordination',
        description: 'Coordinate across distributed tasks',
        category: 'Fault Tolerance',
      },
      {
        id: 'state-recovery',
        title: 'State Recovery',
        description: 'Restore state from checkpoint',
        category: 'Fault Tolerance',
      },
    ],
    constraints: [
      {
        id: 'consistency',
        title: 'Consistent Checkpoint',
        description: 'Checkpoint must be consistent across all operators',
        type: 'technical',
      },
      {
        id: 'overhead',
        title: 'Checkpoint Overhead',
        description: 'Frequent checkpoints increase overhead',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.7, write: 0.3 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'checkpoint-saved',
      name: 'Checkpoint Saved',
      description: 'State checkpointed periodically',
      validate: (solution: any) => ({
        passed: true,
        message: 'Checkpoint saved: 10MB state at offset 10000',
      }),
    },
    {
      id: 'recovery-successful',
      name: 'Recovery Successful',
      description: 'State restored and processing resumed',
      validate: (solution: any) => ({
        passed: true,
        message: 'Recovered from checkpoint, resumed at offset 10000',
      }),
    },
  ],
  hints: [
    'Checkpoint includes: state + stream offset',
    'Chandy-Lamport algorithm for distributed checkpoints',
    'Save checkpoint to HDFS, S3, or other durable storage',
    'Flink uses asynchronous barrier snapshotting',
  ],
  resources: [
    {
      title: 'DDIA Chapter 11 - Checkpointing',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Flink Checkpointing',
      url: 'https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/fault-tolerance/checkpointing/',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['stream-processing', 'checkpointing', 'fault-tolerance', 'state-management'],
};

// ============================================================================
// EXPORT ALL PROBLEMS
// ============================================================================

export const ddiaChapter11Problems = [
  // Messaging Systems (5)
  messageBrokersProblemDefinition,
  pubSubProblemDefinition,
  partitionedLogsProblemDefinition,
  consumerGroupsProblemDefinition,
  offsetManagementProblemDefinition,

  // Stream Processing Windows (5)
  tumblingWindowsProblemDefinition,
  slidingWindowsProblemDefinition,
  sessionWindowsProblemDefinition,
  eventTimeVsProcessingTimeProblemDefinition,
  watermarksProblemDefinition,

  // Stream Operations (5)
  streamJoinsProblemDefinition,
  streamAggregationsProblemDefinition,
  streamTableDualityProblemDefinition,
  exactlyOnceSemanticsProblemmDefinition,
  checkpointingProblemDefinition,
];

// Auto-generate code challenges from functional requirements
(messageBrokersProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(messageBrokersProblemDefinition);
