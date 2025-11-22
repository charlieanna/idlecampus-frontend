/**
 * Core System Design Concepts - Technology Agnostic
 *
 * Focus on patterns and fundamentals, not specific tools.
 * When teaching specific technologies, we focus ONLY on:
 * - Redis (in-memory data store)
 * - Kafka (distributed event streaming)
 * - Cassandra (distributed NoSQL database)
 * - Zookeeper (distributed coordination)
 */

import { Concept, Resource } from '../../types/spacedRepetition';

export const systemDesignConcepts: Concept[] = [
  // ============================================================================
  // Caching Patterns (Technology Agnostic)
  // ============================================================================
  {
    id: 'cache-fundamentals',
    title: 'Caching Fundamentals',
    category: 'caching',
    description: 'Understanding caching patterns, when to cache, and cache behavior',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['caching', 'performance', 'patterns'],
    resources: [
      {
        type: 'article',
        title: 'Top Caching Strategies',
        url: 'https://blog.bytebytego.com/p/top-caching-strategies',
        description: 'Comprehensive overview of caching patterns by ByteByteGo',
      },
    ],
  },
  {
    id: 'cache-writing-strategies',
    title: 'Cache Writing Strategies',
    category: 'caching',
    description: 'Write-through, write-back, write-around, and cache-aside patterns',
    prerequisites: ['cache-fundamentals'],
    relatedConcepts: ['cache-eviction'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['caching', 'write-patterns', 'consistency'],
    resources: [
      {
        type: 'article',
        title: 'Why We Built a Write Back Cache - Squarespace Engineering',
        url: 'https://engineering.squarespace.com/blog/2024/why-we-built-a-write-back-cache-for-our-asset-library-with-google-cloud-spanner',
        description: 'Real-world implementation of write-back caching',
      },
      {
        type: 'article',
        title: 'Write-Behind Caching Pattern',
        url: 'https://www.enjoyalgorithms.com/blog/write-behind-caching-pattern/',
        description: 'Detailed explanation of write-behind pattern',
      },
    ],
  },
  {
    id: 'cache-eviction',
    title: 'Cache Eviction Policies',
    category: 'caching',
    description: 'LRU, LFU, FIFO and other cache eviction algorithms',
    prerequisites: ['cache-fundamentals'],
    relatedConcepts: ['cache-writing-strategies'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 12,
    tags: ['caching', 'algorithms', 'memory-management'],
  },

  // ============================================================================
  // Redis - In-Memory Data Store
  // ============================================================================
  {
    id: 'redis-fundamentals',
    title: 'Redis: In-Memory Data Store',
    category: 'storage',
    description: 'Understanding Redis data structures, use cases, and when to use in-memory storage',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 15,
    tags: ['redis', 'in-memory', 'cache', 'data-structures'],
    resources: [
      {
        type: 'documentation',
        title: 'Redis Documentation',
        url: 'https://redis.io/docs/',
        description: 'Official Redis documentation',
      },
    ],
  },
  {
    id: 'redis-data-structures',
    title: 'Redis Data Structures',
    category: 'storage',
    description: 'Strings, Lists, Sets, Sorted Sets, Hashes, and their use cases',
    prerequisites: ['redis-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['redis', 'data-structures', 'strings', 'sets', 'hashes'],
  },
  {
    id: 'redis-persistence',
    title: 'Redis Persistence Patterns',
    category: 'storage',
    description: 'RDB snapshots, AOF logs, and when to persist in-memory data',
    prerequisites: ['redis-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['redis', 'persistence', 'rdb', 'aof'],
  },

  // ============================================================================
  // Kafka - Distributed Event Streaming
  // ============================================================================
  {
    id: 'kafka-fundamentals',
    title: 'Kafka: Distributed Event Streaming',
    category: 'messaging',
    description: 'Understanding Kafka topics, partitions, and event streaming patterns',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['kafka', 'streaming', 'events', 'distributed'],
    resources: [
      {
        type: 'documentation',
        title: 'Apache Kafka Documentation',
        url: 'https://kafka.apache.org/documentation/',
        description: 'Official Kafka documentation',
      },
    ],
  },
  {
    id: 'kafka-consumers-producers',
    title: 'Kafka Producers and Consumers',
    category: 'messaging',
    description: 'Producer semantics, consumer groups, and offset management',
    prerequisites: ['kafka-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['kafka', 'producers', 'consumers', 'offsets'],
  },
  {
    id: 'kafka-partitioning',
    title: 'Kafka Partitioning Strategy',
    category: 'messaging',
    description: 'Partition keys, ordering guarantees, and scaling with partitions',
    prerequisites: ['kafka-fundamentals'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['kafka', 'partitioning', 'scaling', 'ordering'],
  },

  // ============================================================================
  // Cassandra - Distributed NoSQL Database
  // ============================================================================
  {
    id: 'cassandra-fundamentals',
    title: 'Cassandra: Distributed NoSQL Database',
    category: 'storage',
    description: 'Understanding Cassandra architecture, eventual consistency, and when to use wide-column stores',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['cassandra', 'nosql', 'distributed', 'eventual-consistency'],
    resources: [
      {
        type: 'documentation',
        title: 'Apache Cassandra Documentation',
        url: 'https://cassandra.apache.org/doc/latest/',
        description: 'Official Cassandra documentation',
      },
    ],
  },
  {
    id: 'cassandra-data-modeling',
    title: 'Cassandra Data Modeling',
    category: 'storage',
    description: 'Partition keys, clustering columns, and query-driven design',
    prerequisites: ['cassandra-fundamentals'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 30,
    tags: ['cassandra', 'data-modeling', 'partition-key', 'clustering'],
  },
  {
    id: 'cassandra-consistency',
    title: 'Cassandra Consistency Levels',
    category: 'consistency',
    description: 'Tunable consistency (ONE, QUORUM, ALL) and CAP theorem trade-offs',
    prerequisites: ['cassandra-fundamentals', 'cap-theorem'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['cassandra', 'consistency', 'quorum', 'cap'],
  },
  {
    id: 'cassandra-vs-relational',
    title: 'When to Use Cassandra vs Relational Databases',
    category: 'storage',
    description: 'Write-heavy workloads, time-series data, and distributed scenarios',
    prerequisites: ['cassandra-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['cassandra', 'trade-offs', 'use-cases'],
  },

  // ============================================================================
  // Zookeeper - Distributed Coordination
  // ============================================================================
  {
    id: 'zookeeper-fundamentals',
    title: 'Zookeeper: Distributed Coordination',
    category: 'architecture',
    description: 'Understanding distributed coordination, leader election, and configuration management',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['zookeeper', 'coordination', 'distributed', 'consensus'],
    resources: [
      {
        type: 'documentation',
        title: 'Apache Zookeeper Documentation',
        url: 'https://zookeeper.apache.org/doc/current/',
        description: 'Official Zookeeper documentation',
      },
    ],
  },
  {
    id: 'leader-election-pattern',
    title: 'Leader Election Pattern',
    category: 'architecture',
    description: 'Coordinating distributed systems with leader election using Zookeeper',
    prerequisites: ['zookeeper-fundamentals'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['zookeeper', 'leader-election', 'coordination'],
  },
  {
    id: 'distributed-locks',
    title: 'Distributed Locks and Barriers',
    category: 'architecture',
    description: 'Implementing distributed synchronization primitives',
    prerequisites: ['zookeeper-fundamentals'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['zookeeper', 'locks', 'synchronization', 'distributed'],
  },

  // ============================================================================
  // Messaging Patterns (Technology Agnostic)
  // ============================================================================
  {
    id: 'in-memory-vs-durable-queues',
    title: 'In-Memory vs Durable Message Queues',
    category: 'messaging',
    description: 'When to use ephemeral vs persistent message queues (Redis vs Kafka use cases)',
    prerequisites: ['redis-fundamentals', 'kafka-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['messaging', 'queues', 'trade-offs', 'durability'],
    resources: [
      {
        type: 'article',
        title: 'Redis vs Kafka: A Comprehensive Comparison',
        url: 'https://double.cloud/blog/posts/2024/02/redis-vs-kafka/',
        description: 'In-depth comparison of use cases',
      },
      {
        type: 'article',
        title: 'Redis vs Apache Kafka: How to Choose in 2025',
        url: 'https://betterstack.com/community/comparisons/redis-vs-kafka/',
        description: 'Decision guide for different workloads',
      },
    ],
  },
  {
    id: 'pub-sub-pattern',
    title: 'Publish-Subscribe Pattern',
    category: 'messaging',
    description: 'Understanding pub/sub, fan-out, and message distribution patterns',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['pub-sub', 'messaging', 'patterns'],
  },
  {
    id: 'event-streaming-pattern',
    title: 'Event Streaming Pattern',
    category: 'messaging',
    description: 'Event logs, replay capability, and stream processing',
    prerequisites: ['kafka-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['event-streaming', 'kafka', 'patterns'],
  },

  // ============================================================================
  // Storage Patterns (Technology Agnostic)
  // ============================================================================
  {
    id: 'sql-vs-nosql',
    title: 'SQL vs NoSQL Trade-offs',
    category: 'storage',
    description: 'When to use relational vs non-relational databases',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['sql', 'nosql', 'trade-offs', 'databases'],
  },
  {
    id: 'replication-patterns',
    title: 'Replication Patterns',
    category: 'storage',
    description: 'Leader-follower, multi-leader, and leaderless replication',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['replication', 'distributed', 'patterns'],
  },
  {
    id: 'partitioning-sharding',
    title: 'Partitioning and Sharding Strategies',
    category: 'scalability',
    description: 'Horizontal partitioning, hash-based vs range-based sharding',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['sharding', 'partitioning', 'scalability'],
    resources: [
      {
        type: 'documentation',
        title: 'Sharding Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding',
        description: 'Sharding strategies and trade-offs',
      },
    ],
  },

  // ============================================================================
  // Architecture Patterns (Technology Agnostic)
  // ============================================================================
  {
    id: 'cqrs-pattern',
    title: 'CQRS (Command Query Responsibility Segregation)',
    category: 'architecture',
    description: 'Separating read and write paths for independent scaling',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['cqrs', 'read-write-separation', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'CQRS Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs',
        description: 'Official Microsoft documentation on CQRS',
      },
      {
        type: 'article',
        title: 'When Should You Use CQRS?',
        url: 'https://blog.risingstack.com/when-to-use-cqrs/',
        description: 'Practical guide on CQRS use cases',
      },
    ],
  },
  {
    id: 'event-sourcing',
    title: 'Event Sourcing Pattern',
    category: 'architecture',
    description: 'Storing state as a sequence of events (commonly implemented with Kafka)',
    prerequisites: ['cqrs-pattern', 'kafka-fundamentals'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['event-sourcing', 'events', 'kafka', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Event Sourcing Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing',
        description: 'Event sourcing fundamentals',
      },
    ],
  },
  {
    id: 'saga-pattern',
    title: 'Saga Pattern for Distributed Transactions',
    category: 'architecture',
    description: 'Managing long-running transactions across services',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['saga', 'distributed-transactions', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Saga Pattern - Microservices.io',
        url: 'https://microservices.io/patterns/data/saga.html',
        description: 'Choreography vs orchestration',
      },
    ],
  },
  {
    id: 'circuit-breaker-pattern',
    title: 'Circuit Breaker Pattern',
    category: 'architecture',
    description: 'Preventing cascading failures in distributed systems',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['circuit-breaker', 'resilience', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Circuit Breaker Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker',
        description: 'Fault tolerance patterns',
      },
    ],
  },
  {
    id: 'bulkhead-pattern',
    title: 'Bulkhead Pattern',
    category: 'architecture',
    description: 'Resource isolation to prevent cascading failures',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['bulkhead', 'resilience', 'isolation', 'patterns'],
  },
  {
    id: 'retry-pattern',
    title: 'Retry Pattern with Exponential Backoff',
    category: 'architecture',
    description: 'Handling transient failures gracefully',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 12,
    tags: ['retry', 'resilience', 'backoff', 'patterns'],
  },

  // ============================================================================
  // Consistency & Availability (Technology Agnostic)
  // ============================================================================
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    category: 'consistency',
    description: 'Consistency, Availability, and Partition Tolerance trade-offs',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['cap', 'distributed-systems', 'trade-offs'],
  },
  {
    id: 'consistency-models',
    title: 'Consistency Models',
    category: 'consistency',
    description: 'Strong, eventual, causal, and session consistency',
    prerequisites: ['cap-theorem'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['consistency', 'distributed-systems'],
  },
  {
    id: 'consensus-algorithms',
    title: 'Consensus Algorithms (Paxos, Raft)',
    category: 'consistency',
    description: 'How distributed systems agree on values (used by Zookeeper)',
    prerequisites: ['cap-theorem'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 30,
    tags: ['consensus', 'paxos', 'raft', 'zookeeper'],
  },

  // ============================================================================
  // Performance & Scalability (Technology Agnostic)
  // ============================================================================
  {
    id: 'latency-vs-throughput',
    title: 'Latency vs Throughput',
    category: 'performance',
    description: 'Understanding and optimizing for latency vs throughput',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['performance', 'latency', 'throughput'],
  },
  {
    id: 'horizontal-vs-vertical-scaling',
    title: 'Horizontal vs Vertical Scaling',
    category: 'scalability',
    description: 'Scale-out vs scale-up strategies',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 12,
    tags: ['scalability', 'scaling'],
  },

  // ============================================================================
  // Database Transactions (DDIA Chapter 7)
  // ============================================================================
  {
    id: 'acid-properties',
    title: 'ACID Properties',
    category: 'transactions',
    description: 'Atomicity, Consistency, Isolation, Durability and their guarantees',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['transactions', 'acid', 'databases', 'fundamentals'],
    resources: [
      {
        type: 'book',
        title: 'Designing Data-Intensive Applications - Chapter 7',
        url: 'https://dataintensive.net/',
        description: 'Comprehensive coverage of transactions',
      },
    ],
  },
  {
    id: 'isolation-levels',
    title: 'Isolation Levels',
    category: 'transactions',
    description: 'Read Committed, Repeatable Read, Serializable and their trade-offs',
    prerequisites: ['acid-properties'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['transactions', 'isolation', 'concurrency', 'trade-offs'],
    resources: [
      {
        type: 'article',
        title: 'A Beginner\'s Guide to Database Isolation Levels',
        url: 'https://vladmihalcea.com/a-beginners-guide-to-database-isolation-levels/',
        description: 'Practical guide to isolation levels',
      },
    ],
  },
  {
    id: 'concurrency-anomalies',
    title: 'Concurrency Anomalies',
    category: 'transactions',
    description: 'Dirty reads, non-repeatable reads, phantom reads, write skew, lost updates',
    prerequisites: ['isolation-levels'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['transactions', 'concurrency', 'anomalies'],
  },
  {
    id: 'locking-strategies',
    title: 'Pessimistic vs Optimistic Locking',
    category: 'transactions',
    description: 'SELECT FOR UPDATE vs version-based locking strategies',
    prerequisites: ['acid-properties'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['locking', 'concurrency', 'trade-offs'],
  },
  {
    id: 'two-phase-locking',
    title: 'Two-Phase Locking (2PL)',
    category: 'transactions',
    description: 'Growing and shrinking phases for serializable isolation',
    prerequisites: ['locking-strategies', 'isolation-levels'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['locking', '2pl', 'serializable'],
  },
  {
    id: 'deadlocks',
    title: 'Deadlocks and Prevention',
    category: 'transactions',
    description: 'Deadlock detection, timeouts, and lock ordering strategies',
    prerequisites: ['two-phase-locking'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 15,
    tags: ['deadlocks', 'locking', 'prevention'],
  },
  {
    id: 'mvcc',
    title: 'Multi-Version Concurrency Control (MVCC)',
    category: 'transactions',
    description: 'Snapshot isolation using versioned data',
    prerequisites: ['isolation-levels'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['mvcc', 'snapshots', 'concurrency'],
  },
  {
    id: 'serializable-snapshot-isolation',
    title: 'Serializable Snapshot Isolation (SSI)',
    category: 'transactions',
    description: 'Achieving serializability without locks using conflict detection',
    prerequisites: ['mvcc', 'isolation-levels'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['ssi', 'serializable', 'snapshots'],
  },
  {
    id: 'distributed-transactions',
    title: 'Distributed Transactions',
    category: 'transactions',
    description: 'Two-phase commit, consensus, and distributed transaction challenges',
    prerequisites: ['acid-properties'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 30,
    tags: ['distributed-transactions', '2pc', 'consensus'],
  },
];

/**
 * Get concept by ID
 */
export function getConceptById(conceptId: string): Concept | undefined {
  return systemDesignConcepts.find(c => c.id === conceptId);
}

/**
 * Get concepts by category
 */
export function getConceptsByCategory(category: string): Concept[] {
  return systemDesignConcepts.filter(c => c.category === category);
}

/**
 * Get concepts by difficulty
 */
export function getConceptsByDifficulty(difficulty: Concept['difficultyLevel']): Concept[] {
  return systemDesignConcepts.filter(c => c.difficultyLevel === difficulty);
}

/**
 * Get concepts by technology
 */
export function getConceptsByTechnology(tech: 'redis' | 'kafka' | 'cassandra' | 'zookeeper'): Concept[] {
  return systemDesignConcepts.filter(c => c.tags.includes(tech));
}

/**
 * Get pattern-focused concepts (technology-agnostic)
 */
export function getPatternConcepts(): Concept[] {
  return systemDesignConcepts.filter(c => c.tags.includes('patterns'));
}
