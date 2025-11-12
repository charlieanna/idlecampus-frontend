/**
 * Real-World Instance Types (AWS EC2 style)
 *
 * Instead of abstract "capacity", use actual commodity hardware specs
 */

export interface InstanceSpec {
  type: string;           // e.g., "t3.medium", "m5.large"
  vcpu: number;           // Virtual CPUs
  memoryGB: number;       // RAM in GB
  networkGbps: number;    // Network bandwidth
  costPerHour: number;    // $/hour

  // Performance characteristics
  requestsPerSecond: number;  // Estimated RPS this can handle
}

// Common EC2 instance types
export const EC2_INSTANCES: Record<string, InstanceSpec> = {
  // T3 - Burstable (cheap, good for variable load)
  't3.micro': {
    type: 't3.micro',
    vcpu: 2,
    memoryGB: 1,
    networkGbps: 0.064,
    costPerHour: 0.0104,
    requestsPerSecond: 100,
  },
  't3.small': {
    type: 't3.small',
    vcpu: 2,
    memoryGB: 2,
    networkGbps: 0.512,
    costPerHour: 0.0208,
    requestsPerSecond: 250,
  },
  't3.medium': {
    type: 't3.medium',
    vcpu: 2,
    memoryGB: 4,
    networkGbps: 1.0,
    costPerHour: 0.0416,
    requestsPerSecond: 500,
  },

  // M5 - General purpose (balanced, production-ready)
  'm5.large': {
    type: 'm5.large',
    vcpu: 2,
    memoryGB: 8,
    networkGbps: 10.0,
    costPerHour: 0.096,
    requestsPerSecond: 1000,
  },
  'm5.xlarge': {
    type: 'm5.xlarge',
    vcpu: 4,
    memoryGB: 16,
    networkGbps: 10.0,
    costPerHour: 0.192,
    requestsPerSecond: 2000,
  },
  'm5.2xlarge': {
    type: 'm5.2xlarge',
    vcpu: 8,
    memoryGB: 32,
    networkGbps: 10.0,
    costPerHour: 0.384,
    requestsPerSecond: 4000,
  },

  // C5 - Compute optimized (high CPU for processing)
  'c5.large': {
    type: 'c5.large',
    vcpu: 2,
    memoryGB: 4,
    networkGbps: 10.0,
    costPerHour: 0.085,
    requestsPerSecond: 1500,
  },
  'c5.xlarge': {
    type: 'c5.xlarge',
    vcpu: 4,
    memoryGB: 8,
    networkGbps: 10.0,
    costPerHour: 0.17,
    requestsPerSecond: 3000,
  },
};

// Redis/ElastiCache instance types
export const REDIS_INSTANCES: Record<string, InstanceSpec & { memoryGB: number }> = {
  'cache.t3.micro': {
    type: 'cache.t3.micro',
    vcpu: 2,
    memoryGB: 0.5,
    networkGbps: 0.512,
    costPerHour: 0.017,
    requestsPerSecond: 10000, // Redis is FAST
  },
  'cache.t3.small': {
    type: 'cache.t3.small',
    vcpu: 2,
    memoryGB: 1.37,
    networkGbps: 0.512,
    costPerHour: 0.034,
    requestsPerSecond: 25000,
  },
  'cache.m5.large': {
    type: 'cache.m5.large',
    vcpu: 2,
    memoryGB: 6.38,
    networkGbps: 10.0,
    costPerHour: 0.136,
    requestsPerSecond: 50000,
  },
  'cache.r5.large': {
    type: 'cache.r5.large',
    vcpu: 2,
    memoryGB: 13.07,
    networkGbps: 10.0,
    costPerHour: 0.188,
    requestsPerSecond: 75000,
  },
};

// RDS Database instance types
export const RDS_INSTANCES: Record<string, InstanceSpec & { storageIOPS: number }> = {
  'db.t3.micro': {
    type: 'db.t3.micro',
    vcpu: 2,
    memoryGB: 1,
    networkGbps: 0.512,
    costPerHour: 0.018,
    requestsPerSecond: 50,
    storageIOPS: 3000,
  },
  'db.t3.small': {
    type: 'db.t3.small',
    vcpu: 2,
    memoryGB: 2,
    networkGbps: 0.512,
    costPerHour: 0.036,
    requestsPerSecond: 100,
    storageIOPS: 3000,
  },
  'db.t3.medium': {
    type: 'db.t3.medium',
    vcpu: 2,
    memoryGB: 4,
    networkGbps: 1.0,
    costPerHour: 0.073,
    requestsPerSecond: 200,
    storageIOPS: 3000,
  },
  'db.m5.large': {
    type: 'db.m5.large',
    vcpu: 2,
    memoryGB: 8,
    networkGbps: 10.0,
    costPerHour: 0.182,
    requestsPerSecond: 500,
    storageIOPS: 12000,
  },
  'db.m5.xlarge': {
    type: 'db.m5.xlarge',
    vcpu: 4,
    memoryGB: 16,
    networkGbps: 10.0,
    costPerHour: 0.365,
    requestsPerSecond: 1000,
    storageIOPS: 12000,
  },
  'db.m5.2xlarge': {
    type: 'db.m5.2xlarge',
    vcpu: 8,
    memoryGB: 32,
    networkGbps: 10.0,
    costPerHour: 0.73,
    requestsPerSecond: 2000,
    storageIOPS: 12000,
  },
};

/**
 * What's LEFT to configure (the important stuff!)
 */

// Cache Configuration (technology choices, not capacity)
export interface CacheConfig {
  instanceType: string;           // e.g., "cache.m5.large"
  instances: number;               // Number of instances

  // Technology choice
  engine: 'redis' | 'memcached';

  // Cache strategy
  evictionPolicy: 'lru' | 'lfu' | 'ttl' | 'random';
  ttl: number;                     // Seconds
  hitRatio: number;                // Expected hit ratio (0-1)

  // Persistence (Redis only)
  persistence?: 'none' | 'rdb' | 'aof';
  replication?: boolean;
}

// Database Configuration (technology choices)
export interface DatabaseConfig {
  instanceType: string;            // e.g., "db.m5.xlarge"
  instances: number;

  // Technology choice
  engine: 'postgresql' | 'mysql' | 'mongodb' | 'cassandra' | 'dynamodb';

  // Transaction configuration
  isolationLevel?: 'read-uncommitted' | 'read-committed' | 'repeatable-read' | 'serializable';

  // Replication
  replication?: {
    enabled: boolean;
    replicas: number;
    mode: 'sync' | 'async';
  };

  // Sharding (for scale)
  sharding?: {
    enabled: boolean;
    shards: number;
    shardKey: string;
  };

  // Storage
  storageType: 'gp3' | 'io2' | 'magnetic';
  storageSizeGB: number;
}

// NoSQL-specific configurations
export interface NoSQLConfig extends DatabaseConfig {
  engine: 'mongodb' | 'cassandra' | 'dynamodb';

  // Consistency model
  consistencyLevel: 'eventual' | 'strong' | 'bounded-staleness';

  // Data model
  dataModel: 'document' | 'wide-column' | 'key-value';

  // MongoDB specific
  mongodb?: {
    shardingStrategy: 'hashed' | 'ranged';
    indexing: string[];
  };

  // Cassandra specific
  cassandra?: {
    replicationFactor: number;
    readConsistency: 'one' | 'quorum' | 'all';
    writeConsistency: 'one' | 'quorum' | 'all';
  };

  // DynamoDB specific
  dynamodb?: {
    capacityMode: 'provisioned' | 'on-demand';
    partitionKey: string;
    sortKey?: string;
  };
}

// Message Queue Configuration
export interface MessageQueueConfig {
  instanceType: string;
  instances: number;

  // Technology
  engine: 'kafka' | 'rabbitmq' | 'sqs' | 'kinesis';

  // Configuration
  topics: number;
  partitions: number;
  retentionHours: number;

  // Delivery guarantees
  deliveryGuarantee: 'at-most-once' | 'at-least-once' | 'exactly-once';
}

/**
 * Example: How configuration would look
 */
export const EXAMPLE_CONFIGS = {
  // Simple app server
  appServer: {
    instanceType: 'm5.large',      // 2 vCPU, 8GB RAM, $70/mo
    instances: 2,                   // 2 instances for HA
    // That's it! No abstract "capacity" numbers
  },

  // Redis cache
  redis: {
    instanceType: 'cache.m5.large', // 6GB memory
    instances: 1,
    engine: 'redis' as const,
    evictionPolicy: 'lru' as const,
    ttl: 3600,                      // 1 hour
    hitRatio: 0.9,                  // Expect 90% hit
    persistence: 'rdb' as const,    // Snapshot backups
    replication: false,
  },

  // PostgreSQL database
  postgresql: {
    instanceType: 'db.m5.xlarge',   // 4 vCPU, 16GB RAM
    instances: 1,
    engine: 'postgresql' as const,
    isolationLevel: 'read-committed' as const,
    replication: {
      enabled: true,
      replicas: 1,                  // 1 read replica
      mode: 'async' as const,
    },
    sharding: {
      enabled: false,
      shards: 1,
      shardKey: '',
    },
    storageType: 'gp3' as const,
    storageSizeGB: 100,
  },

  // Cassandra (NoSQL)
  cassandra: {
    instanceType: 'db.m5.xlarge',
    instances: 3,                   // Cassandra cluster
    engine: 'cassandra' as const,
    consistencyLevel: 'eventual' as const,
    dataModel: 'wide-column' as const,
    cassandra: {
      replicationFactor: 3,
      readConsistency: 'quorum' as const,
      writeConsistency: 'quorum' as const,
    },
    storageType: 'gp3' as const,
    storageSizeGB: 500,
  },
};

/**
 * What this means:
 *
 * Before (Abstract):
 *   "database capacity: 100 RPS" - What does this mean in real life?
 *
 * After (Real Hardware):
 *   "db.m5.large: 2 vCPU, 8GB RAM, ~500 RPS" - I can price this on AWS!
 *
 * Configuration focus shifts to REAL decisions:
 *   ✓ Which database? (PostgreSQL vs MongoDB vs Cassandra)
 *   ✓ What consistency? (Strong vs Eventual)
 *   ✓ What isolation level? (Read-committed vs Serializable)
 *   ✓ Cache eviction? (LRU vs LFU)
 *   ✓ Replication mode? (Sync vs Async)
 *
 * Not fake capacity numbers!
 */
