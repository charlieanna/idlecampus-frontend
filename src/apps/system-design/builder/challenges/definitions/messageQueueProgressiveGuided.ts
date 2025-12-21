import { GuidedTutorial } from '../../types/guidedTutorial';

export const messageQueueProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'message-queue-progressive',
  title: 'Design a Distributed Message Queue (Kafka)',
  description: 'Build a message queue from simple pub/sub to distributed streaming platform',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design append-only log for message storage',
    'Implement partitioning for parallel consumption',
    'Build consumer groups for load balancing',
    'Handle replication for fault tolerance',
    'Add exactly-once semantics and transactions'
  ],
  prerequisites: ['Distributed systems', 'Storage systems', 'Consensus protocols'],
  tags: ['messaging', 'kafka', 'distributed-systems', 'streaming', 'pub-sub'],

  progressiveStory: {
    title: 'Message Queue Evolution',
    premise: "You're building a distributed message queue like Kafka. Starting with simple pub/sub, you'll evolve to handle millions of messages per second with strong durability and ordering guarantees.",
    phases: [
      { phase: 1, title: 'Basic Pub/Sub', description: 'Simple topic-based messaging' },
      { phase: 2, title: 'Distributed Log', description: 'Partitioned, durable message storage' },
      { phase: 3, title: 'Consumer Groups', description: 'Scalable consumption with offsets' },
      { phase: 4, title: 'Production Ready', description: 'Replication, transactions, exactly-once' }
    ]
  },

  steps: [
    // PHASE 1: Basic Pub/Sub (Steps 1-3)
    {
      id: 'step-1',
      title: 'Topic and Message Model',
      phase: 1,
      phaseTitle: 'Basic Pub/Sub',
      learningObjective: 'Design message structure and topic abstraction',
      thinkingFramework: {
        framework: 'Append-Only Log',
        approach: 'Topic is a logical channel. Messages appended to log, assigned sequential offset. Consumers read from offset. Log is the source of truth.',
        keyInsight: 'Unlike traditional queues, messages arent deleted on consume. Consumers track their position (offset). Enables replay and multiple consumers.'
      },
      requirements: {
        functional: [
          'Create topics with configuration',
          'Produce messages to topics',
          'Assign offset to each message',
          'Store message with key, value, timestamp'
        ],
        nonFunctional: []
      },
      hints: [
        'Message: {offset, key, value, timestamp, headers}',
        'Topic: {name, partition_count, retention_ms}',
        'Offset: monotonically increasing per partition'
      ],
      expectedComponents: ['Topic Manager', 'Message Store', 'Offset Generator'],
      successCriteria: ['Messages stored with offsets', 'Topics created correctly'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Producer API',
      phase: 1,
      phaseTitle: 'Basic Pub/Sub',
      learningObjective: 'Build producer for publishing messages',
      thinkingFramework: {
        framework: 'Async Batching',
        approach: 'Producer batches messages for efficiency. Configurable batch size and linger time. Acknowledge on write to leader.',
        keyInsight: 'Fire-and-forget vs sync vs async ack. Trade latency for durability. Batch multiple messages per network round trip.'
      },
      requirements: {
        functional: [
          'Send message to topic',
          'Support message keys for partitioning',
          'Batch messages for efficiency',
          'Return offset on success'
        ],
        nonFunctional: [
          'Produce throughput: 100K messages/second'
        ]
      },
      hints: [
        'Batch: accumulate for linger_ms or batch_size, whichever first',
        'Key hash determines partition: hash(key) % num_partitions',
        'Ack modes: 0 (none), 1 (leader), all (ISR)'
      ],
      expectedComponents: ['Producer Client', 'Batch Accumulator', 'Partition Selector'],
      successCriteria: ['Messages produced efficiently', 'Batching works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Consumer API',
      phase: 1,
      phaseTitle: 'Basic Pub/Sub',
      learningObjective: 'Build consumer for reading messages',
      thinkingFramework: {
        framework: 'Pull-Based Consumption',
        approach: 'Consumer pulls messages at its pace. Tracks offset. Can replay by resetting offset. Pull is better than push for backpressure.',
        keyInsight: 'Consumer controls flow. If overwhelmed, just poll slower. No message loss from slow consumer (unlike push).'
      },
      requirements: {
        functional: [
          'Subscribe to topics',
          'Poll for new messages',
          'Track consumer offset',
          'Seek to specific offset (replay)'
        ],
        nonFunctional: [
          'Poll latency < 100ms for new messages'
        ]
      },
      hints: [
        'Poll: fetch messages from current offset',
        'Offset tracking: store after processing',
        'Seek: set offset to beginning, end, or specific value'
      ],
      expectedComponents: ['Consumer Client', 'Offset Tracker', 'Fetch Handler'],
      successCriteria: ['Messages consumed in order', 'Replay works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Distributed Log (Steps 4-6)
    {
      id: 'step-4',
      title: 'Partitioning',
      phase: 2,
      phaseTitle: 'Distributed Log',
      learningObjective: 'Partition topics for parallelism',
      thinkingFramework: {
        framework: 'Horizontal Scaling',
        approach: 'Single log is bottleneck. Partition topic into N independent logs. Each partition is ordered, but no global order across partitions.',
        keyInsight: 'Partition count = max parallelism. 10 partitions = max 10 consumers. Choose based on expected throughput.'
      },
      requirements: {
        functional: [
          'Divide topic into partitions',
          'Route messages by key to consistent partition',
          'Maintain ordering within partition',
          'Support partition count increase'
        ],
        nonFunctional: [
          'Partition throughput: 10K messages/second each'
        ]
      },
      hints: [
        'Partition assignment: hash(key) % num_partitions',
        'Null key: round-robin across partitions',
        'Ordering only guaranteed within partition'
      ],
      expectedComponents: ['Partition Manager', 'Key Partitioner', 'Partition Store'],
      successCriteria: ['Messages distributed across partitions', 'Key affinity maintained'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Segment-Based Storage',
      phase: 2,
      phaseTitle: 'Distributed Log',
      learningObjective: 'Store messages in log segments',
      thinkingFramework: {
        framework: 'Segmented Log',
        approach: 'Partition is too large for one file. Split into segments (1GB each). Active segment for writes, old segments immutable. Enables efficient cleanup.',
        keyInsight: 'Sequential writes to active segment = fast. Index file for offset → position lookup. Memory-map for fast reads.'
      },
      requirements: {
        functional: [
          'Write messages to active segment',
          'Roll segment when size/time limit reached',
          'Index offsets for fast lookup',
          'Delete old segments based on retention'
        ],
        nonFunctional: [
          'Segment size: 1GB',
          'Sequential write throughput: 100MB/s'
        ]
      },
      hints: [
        'Segment: {base_offset, log_file, index_file}',
        'Index: sparse, every 4KB of log',
        'Retention: delete segments older than retention_ms'
      ],
      expectedComponents: ['Segment Manager', 'Log Writer', 'Index Builder', 'Retention Cleaner'],
      successCriteria: ['Segments roll correctly', 'Old data cleaned up'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Broker Cluster',
      phase: 2,
      phaseTitle: 'Distributed Log',
      learningObjective: 'Distribute partitions across brokers',
      thinkingFramework: {
        framework: 'Partition Assignment',
        approach: 'Each partition lives on one broker (leader). Distribute partitions evenly. Controller assigns partitions and handles broker failures.',
        keyInsight: 'Broker failure = partitions unavailable until reassigned. Replication (next phase) solves this. For now, accept unavailability.'
      },
      requirements: {
        functional: [
          'Register brokers in cluster',
          'Assign partitions to brokers',
          'Route requests to correct broker',
          'Rebalance on broker add/remove'
        ],
        nonFunctional: [
          'Rebalance completes in < 1 minute'
        ]
      },
      hints: [
        'Metadata: {topic → partition → leader_broker}',
        'Controller: one broker elected to manage metadata',
        'Zookeeper/Raft for controller election and metadata'
      ],
      expectedComponents: ['Broker Registry', 'Controller', 'Metadata Store', 'Request Router'],
      successCriteria: ['Partitions distributed evenly', 'Routing works correctly'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Consumer Groups (Steps 7-9)
    {
      id: 'step-7',
      title: 'Consumer Group Coordination',
      phase: 3,
      phaseTitle: 'Consumer Groups',
      learningObjective: 'Enable multiple consumers to share workload',
      thinkingFramework: {
        framework: 'Partition-Consumer Mapping',
        approach: 'Consumer group: multiple consumers sharing topic. Each partition assigned to one consumer in group. If consumer fails, rebalance partitions.',
        keyInsight: 'Max consumers = partition count. 10 partitions, 15 consumers = 5 idle. Group enables horizontal scaling of consumption.'
      },
      requirements: {
        functional: [
          'Create consumer groups',
          'Assign partitions to consumers in group',
          'Rebalance on consumer join/leave',
          'Detect consumer failures (heartbeat)'
        ],
        nonFunctional: [
          'Rebalance < 30 seconds'
        ]
      },
      hints: [
        'Group coordinator: one broker manages group',
        'Heartbeat: consumer sends every 3s, timeout at 10s',
        'Rebalance protocol: stop-the-world, reassign, resume'
      ],
      expectedComponents: ['Group Coordinator', 'Partition Assignor', 'Heartbeat Handler'],
      successCriteria: ['Partitions assigned to consumers', 'Failures trigger rebalance'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Offset Management',
      phase: 3,
      phaseTitle: 'Consumer Groups',
      learningObjective: 'Track and commit consumer offsets',
      thinkingFramework: {
        framework: 'Checkpoint Progress',
        approach: 'Store committed offset per partition per group. On restart, resume from committed offset. Auto-commit or manual commit.',
        keyInsight: 'Commit after processing, not after receiving. Early commit = message lost on crash. Late commit = duplicate processing on crash.'
      },
      requirements: {
        functional: [
          'Store committed offsets per group/partition',
          'Support manual and auto commit',
          'Resume from committed offset on restart',
          'Handle offset reset (earliest, latest)'
        ],
        nonFunctional: [
          'Offset commit < 10ms'
        ]
      },
      hints: [
        'Offset storage: internal topic __consumer_offsets',
        'Auto commit: every 5 seconds (risk of duplicates)',
        'Manual commit: call commitSync after processing batch'
      ],
      expectedComponents: ['Offset Store', 'Commit Handler', 'Reset Policy'],
      successCriteria: ['Offsets committed correctly', 'Restart resumes from checkpoint'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Consumer Lag Monitoring',
      phase: 3,
      phaseTitle: 'Consumer Groups',
      learningObjective: 'Track how far behind consumers are',
      thinkingFramework: {
        framework: 'Production Monitoring',
        approach: 'Lag = latest offset - committed offset. High lag means consumer cant keep up. Alert before queue grows unbounded.',
        keyInsight: 'Lag is the key metric for queue health. Zero lag = real-time. Growing lag = add consumers or optimize processing.'
      },
      requirements: {
        functional: [
          'Calculate lag per partition per group',
          'Expose lag metrics',
          'Alert on high/growing lag',
          'Show lag in monitoring dashboard'
        ],
        nonFunctional: [
          'Lag metric delay < 30 seconds'
        ]
      },
      hints: [
        'Lag = log_end_offset - consumer_committed_offset',
        'Expose via JMX or Prometheus metrics',
        'Alert: lag > threshold OR lag_growth_rate > threshold'
      ],
      expectedComponents: ['Lag Calculator', 'Metrics Exporter', 'Alert Manager'],
      successCriteria: ['Lag visible in real-time', 'Alerts fire on high lag'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Production Ready (Steps 10-12)
    {
      id: 'step-10',
      title: 'Replication',
      phase: 4,
      phaseTitle: 'Production Ready',
      learningObjective: 'Replicate partitions for fault tolerance',
      thinkingFramework: {
        framework: 'Leader-Follower Replication',
        approach: 'Each partition has leader (handles reads/writes) and followers (replicate). ISR (in-sync replicas) = followers caught up. Commit when ISR acks.',
        keyInsight: 'Replication factor 3, min.insync.replicas 2: tolerate 1 failure without data loss. Leader election from ISR on failure.'
      },
      requirements: {
        functional: [
          'Replicate partitions to follower brokers',
          'Track ISR (in-sync replicas)',
          'Elect new leader from ISR on failure',
          'Configure replication factor per topic'
        ],
        nonFunctional: [
          'Replication lag < 1 second',
          'Failover < 10 seconds'
        ]
      },
      hints: [
        'Follower fetches from leader continuously',
        'ISR: follower within replica.lag.time.max.ms of leader',
        'acks=all: wait for all ISR to replicate'
      ],
      expectedComponents: ['Replication Manager', 'ISR Tracker', 'Leader Elector'],
      successCriteria: ['Data replicated to followers', 'Failover promotes new leader'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Exactly-Once Semantics',
      phase: 4,
      phaseTitle: 'Production Ready',
      learningObjective: 'Guarantee each message processed exactly once',
      thinkingFramework: {
        framework: 'Idempotent Producer + Transactions',
        approach: 'Idempotent producer: dedup retries using producer ID + sequence number. Transactions: atomic writes across partitions.',
        keyInsight: 'At-least-once + idempotent consumer = effectively exactly-once. True exactly-once requires transactional producer-consumer.'
      },
      requirements: {
        functional: [
          'Assign producer ID for deduplication',
          'Track sequence numbers per partition',
          'Support transactions (begin, commit, abort)',
          'Atomic writes to multiple partitions'
        ],
        nonFunctional: [
          'No duplicates from producer retries'
        ]
      },
      hints: [
        'Producer ID: assigned by broker, survives restarts',
        'Sequence: per partition, broker rejects out-of-order',
        'Transaction: write to __transaction_state topic'
      ],
      expectedComponents: ['Producer ID Manager', 'Sequence Tracker', 'Transaction Coordinator'],
      successCriteria: ['Retries deduplicated', 'Transactions atomic'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Compaction & Tombstones',
      phase: 4,
      phaseTitle: 'Production Ready',
      learningObjective: 'Compact logs to keep only latest value per key',
      thinkingFramework: {
        framework: 'Log Compaction',
        approach: 'For changelog topics, keep latest value per key, discard older. Tombstone (null value) = delete key. Bounded storage for unbounded keys.',
        keyInsight: 'Compaction vs retention: retention deletes by time, compaction deletes by key. Use compaction for state snapshots (e.g., user profiles).'
      },
      requirements: {
        functional: [
          'Compact log segments to deduplicate keys',
          'Handle tombstones (null values = delete)',
          'Configure compaction vs time-based retention',
          'Run compaction in background'
        ],
        nonFunctional: [
          'Compaction doesnt block reads/writes',
          'Tombstone retention: 24 hours before removal'
        ]
      },
      hints: [
        'Compaction: for each key, keep only highest offset',
        'Tombstone: marker that key is deleted, kept temporarily',
        'Dirty ratio: compact when dirty_ratio > 50%'
      ],
      expectedComponents: ['Log Compactor', 'Tombstone Handler', 'Compaction Scheduler'],
      successCriteria: ['Only latest values per key retained', 'Tombstones eventually removed'],
      estimatedTime: '8 minutes'
    }
  ]
};
