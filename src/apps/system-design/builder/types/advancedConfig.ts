/**
 * Advanced Configuration Types for Interview-Level System Design
 * Covers cache strategies, consistency models, NoSQL patterns, etc.
 */

/**
 * Cache Strategy - Critical for interviews
 */
export type CacheStrategy =
  | 'cache_aside' // Read: Check cache → miss → read DB → populate cache
  | 'read_through' // Cache handles DB reads transparently
  | 'write_through' // Write to cache + DB synchronously (strong consistency)
  | 'write_behind' // Write to cache → async write to DB (eventual consistency)
  | 'write_around'; // Write directly to DB, bypass cache (for infrequent reads)

export interface CacheStrategyConfig {
  strategy: CacheStrategy;

  // For write-behind/write-back
  writeBatchSize?: number; // Batch writes before flushing
  writeDelayMs?: number; // Delay before flushing to DB

  // For all strategies
  evictionPolicy?: 'lru' | 'lfu' | 'fifo'; // Least Recently Used, etc.
  maxEntries?: number;
}

/**
 * Consistency Model - CAP Theorem in action
 */
export type ConsistencyLevel =
  | 'strong' // All reads see latest write (ACID, CP in CAP)
  | 'eventual' // Reads may be stale, eventual convergence (AP in CAP)
  | 'causal' // Causally related ops are ordered
  | 'read_your_writes' // Session consistency
  | 'monotonic_reads' // Never go backwards in time
  | 'bounded_staleness'; // Guaranteed staleness window

export interface ConsistencyConfig {
  level: ConsistencyLevel;

  // For bounded staleness
  maxStalenessMs?: number;
  maxStalenessVersions?: number;

  // For quorum-based systems (Cassandra, DynamoDB)
  readQuorum?: number; // R
  writeQuorum?: number; // W
  replicationFactor?: number; // N
  // R + W > N = Strong consistency
  // R + W <= N = Eventual consistency
}

/**
 * Database Transaction Model
 */
export type TransactionModel =
  | 'acid' // Traditional RDBMS (PostgreSQL, MySQL)
  | 'base' // NoSQL (Basically Available, Soft state, Eventual)
  | 'saga' // Distributed transactions via compensating transactions
  | 'two_phase_commit' // Distributed ACID (slow but consistent)
  | 'optimistic_locking' // CAS (Compare-and-Swap) for conflicts
  | 'pessimistic_locking'; // Row-level locks

export interface TransactionConfig {
  model: TransactionModel;
  isolationLevel?: 'read_uncommitted' | 'read_committed' | 'repeatable_read' | 'serializable';

  // For saga pattern
  compensationStrategy?: 'backward_recovery' | 'forward_recovery';

  // Timeout configs
  lockTimeoutMs?: number;
  transactionTimeoutMs?: number;
}

/**
 * NoSQL Database Types
 */
export type NoSQLType =
  | 'document' // MongoDB, Firestore (JSON documents)
  | 'key_value' // Redis, DynamoDB, Riak (simple K-V)
  | 'column_family' // Cassandra, HBase (wide-column)
  | 'graph' // Neo4j, Amazon Neptune (nodes/edges)
  | 'time_series'; // InfluxDB, TimescaleDB (optimized for time data)

export interface NoSQLConfig {
  type: NoSQLType;
  consistencyModel: ConsistencyConfig;

  // For document DBs
  indexingStrategy?: 'primary_key' | 'secondary_index' | 'full_text';
  shardingKey?: string;

  // For column-family DBs
  bloomFilterEnabled?: boolean; // Fast membership test
  compactionStrategy?: 'size_tiered' | 'leveled' | 'time_window';

  // For key-value stores
  ttlSeconds?: number;
  compressionEnabled?: boolean;
}

/**
 * Partitioning/Sharding Strategy
 */
export type PartitioningStrategy =
  | 'hash' // Hash-based (consistent hashing)
  | 'range' // Range-based (e.g., A-M, N-Z)
  | 'list' // List/directory-based
  | 'composite' // Combination of above
  | 'geo'; // Geographic partitioning

export interface PartitioningConfig {
  strategy: PartitioningStrategy;
  numPartitions: number;
  replicationFactor: number;

  // For consistent hashing
  virtualNodes?: number; // More vnodes = better distribution

  // For range partitioning
  rangeKey?: string;
  splitThreshold?: number; // When to split a partition
}

/**
 * Replication Strategy
 */
export type ReplicationStrategy =
  | 'master_slave' // Single master, multiple slaves (read replicas)
  | 'master_master' // Multi-master (conflict resolution needed)
  | 'multi_leader' // Regional leaders
  | 'leaderless'; // Cassandra-style (quorum-based)

export interface ReplicationConfig {
  strategy: ReplicationStrategy;
  replicationFactor: number;
  asyncReplication: boolean; // false = synchronous (slower but consistent)

  // For master-slave
  readPreference?: 'primary' | 'secondary' | 'nearest';

  // For multi-master
  conflictResolution?: 'last_write_wins' | 'application_level' | 'crdt';

  // For leaderless
  hintedHandoff?: boolean; // Store writes during node failure
  readRepair?: boolean; // Fix inconsistencies during reads
}

/**
 * Message Queue Configuration
 */
export type QueueSemantics =
  | 'at_most_once' // May lose messages (fast)
  | 'at_least_once' // May duplicate (default)
  | 'exactly_once'; // No duplicates (slow, complex)

export interface MessageQueueConfig {
  semantics: QueueSemantics;
  partitioned: boolean;
  retentionPeriodHours: number;

  // For ordering guarantees
  orderingGuarantee?: 'global' | 'partition' | 'none';

  // For consumer groups
  consumerGroupEnabled?: boolean;
  maxConcurrentConsumers?: number;
}

/**
 * Load Balancing Algorithm
 */
export type LoadBalancingAlgorithm =
  | 'round_robin'
  | 'least_connections'
  | 'least_response_time'
  | 'ip_hash' // Sticky sessions
  | 'weighted_round_robin'
  | 'random';

export interface LoadBalancerAdvancedConfig {
  algorithm: LoadBalancingAlgorithm;
  healthCheckIntervalMs: number;
  healthCheckTimeoutMs: number;

  // For sticky sessions
  sessionAffinityEnabled?: boolean;
  sessionAffinityTtlSeconds?: number;

  // For circuit breaking
  circuitBreakerEnabled?: boolean;
  failureThreshold?: number; // Open circuit after N failures
  recoveryTimeMs?: number; // Try again after this time
}

/**
 * API Gateway Features
 */
export interface APIGatewayConfig {
  rateLimitingEnabled: boolean;
  rateLimitRpm?: number; // Requests per minute
  rateLimitStrategy?: 'fixed_window' | 'sliding_window' | 'token_bucket' | 'leaky_bucket';

  authenticationEnabled: boolean;
  authStrategy?: 'jwt' | 'oauth2' | 'api_key' | 'mutual_tls';

  // Request/response transformation
  requestValidationEnabled?: boolean;
  responseTransformationEnabled?: boolean;

  // Caching at gateway level
  cacheEnabled?: boolean;
  cacheTtlSeconds?: number;
}

/**
 * Complete Advanced Component Configuration
 */
export interface AdvancedComponentConfig {
  // Basic config (existing)
  instances?: number;

  // Cache-specific
  cacheStrategy?: CacheStrategyConfig;

  // Database-specific
  consistencyModel?: ConsistencyConfig;
  transactionModel?: TransactionConfig;
  partitioning?: PartitioningConfig;
  replication?: ReplicationConfig;

  // NoSQL-specific
  nosqlConfig?: NoSQLConfig;

  // Message queue specific
  queueConfig?: MessageQueueConfig;

  // Load balancer specific
  lbConfig?: LoadBalancerAdvancedConfig;

  // API Gateway specific
  apiGatewayConfig?: APIGatewayConfig;
}

/**
 * Interview Scenario Types
 */
export type InterviewScenarioType =
  | 'high_read_low_write' // Tiny URL, Instagram Feed
  | 'high_write_low_read' // Log aggregation, metrics
  | 'balanced_read_write' // Social network timeline
  | 'real_time' // Chat, notifications
  | 'batch_processing' // Data pipeline
  | 'search_heavy' // E-commerce, documentation
  | 'analytics' // Data warehouse, reporting
  | 'file_storage' // Dropbox, Google Drive
  | 'video_streaming' // Netflix, YouTube
  | 'distributed_transaction'; // Payment processing, booking

/**
 * CAP Theorem Tradeoff
 */
export interface CAPTradeoff {
  consistency: boolean; // C in CAP
  availability: boolean; // A in CAP
  partitionTolerance: boolean; // P in CAP (always required in distributed systems)

  // Can only pick 2 (and P is mandatory in practice, so really C or A)
  choice: 'cp' | 'ap'; // Consistency+Partition or Availability+Partition
}

/**
 * Interview Question Metadata
 */
export interface InterviewQuestion {
  company: string; // "Google", "Amazon", "Facebook", etc.
  difficulty: 'easy' | 'medium' | 'hard';
  scenarioType: InterviewScenarioType;
  focusAreas: string[]; // ["caching", "replication", "sharding"]
  expectedPatterns: string[]; // ["cache-aside", "master-slave", "consistent-hashing"]
  capTradeoff: CAPTradeoff;

  // Follow-up questions that interviewers ask
  followUpQuestions: string[];
}

/**
 * Common Interview Patterns
 */
export const InterviewPatterns = {
  // Read-heavy optimization
  READ_HEAVY: {
    cacheStrategy: 'cache_aside',
    cacheHitRatio: 0.95,
    readReplicas: 3,
    consistency: 'eventual',
  },

  // Write-heavy optimization
  WRITE_HEAVY: {
    cacheStrategy: 'write_behind',
    sharding: true,
    asyncReplication: true,
    consistency: 'eventual',
  },

  // Strong consistency (financial transactions)
  STRONG_CONSISTENCY: {
    transactionModel: 'acid',
    isolationLevel: 'serializable',
    replication: 'master_slave',
    asyncReplication: false,
  },

  // High availability (99.99% uptime)
  HIGH_AVAILABILITY: {
    replication: 'master_master',
    multiRegion: true,
    consistency: 'eventual',
    circuitBreaker: true,
  },

  // Real-time systems
  REAL_TIME: {
    messageQueue: 'kafka',
    queueSemantics: 'at_least_once',
    websockets: true,
    pubSub: true,
  },
} as const;
