/**
 * System Design Concepts for Spaced Repetition
 *
 * Concepts organized by category with prerequisites and relationships
 */

import { Concept, Resource } from '../../types/spacedRepetition';

export const systemDesignConcepts: Concept[] = [
  // ============================================================================
  // Caching Concepts
  // ============================================================================
  {
    id: 'cache-fundamentals',
    title: 'Cache Fundamentals',
    category: 'caching',
    description: 'Understanding what caching is, why we use it, and basic cache behavior',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['caching', 'performance', 'basics'],
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
    id: 'cache-strategies',
    title: 'Cache Writing Strategies',
    category: 'caching',
    description: 'Write-through, write-back, and write-around caching strategies',
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
        description: 'Real-world implementation of write-back caching at Squarespace',
      },
      {
        type: 'article',
        title: 'Write-Behind Caching Pattern',
        url: 'https://www.enjoyalgorithms.com/blog/write-behind-caching-pattern/',
        description: 'Detailed explanation of write-behind (write-back) pattern',
      },
      {
        type: 'article',
        title: 'Write-Around Caching Pattern',
        url: 'https://www.enjoyalgorithms.com/blog/write-around-caching-pattern/',
        description: 'When and how to use write-around caching',
      },
      {
        type: 'article',
        title: 'Understanding Cache Strategies with Python',
        url: 'https://shahriar.svbtle.com/Understanding-writethrough-writearound-and-writeback-caching-with-python',
        description: 'Practical implementations with code examples',
      },
    ],
  },
  {
    id: 'cache-eviction',
    title: 'Cache Eviction Policies',
    category: 'caching',
    description: 'LRU, LFU, FIFO and other cache eviction algorithms',
    prerequisites: ['cache-fundamentals'],
    relatedConcepts: ['cache-strategies'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 12,
    tags: ['caching', 'algorithms', 'memory-management'],
  },

  // ============================================================================
  // Storage Systems
  // ============================================================================
  {
    id: 'redis-fundamentals',
    title: 'Redis In-Memory Store',
    category: 'storage',
    description: 'Understanding Redis as an in-memory data structure store',
    prerequisites: ['cache-fundamentals'],
    relatedConcepts: ['memcached-fundamentals', 'kafka-fundamentals'],
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['redis', 'in-memory', 'cache', 'database'],
  },
  {
    id: 'memcached-fundamentals',
    title: 'Memcached Basics',
    category: 'storage',
    description: 'Understanding Memcached for distributed caching',
    prerequisites: ['cache-fundamentals'],
    relatedConcepts: ['redis-fundamentals'],
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['memcached', 'distributed-cache', 'in-memory'],
  },
  {
    id: 'redis-vs-memcached',
    title: 'Redis vs Memcached',
    category: 'storage',
    description: 'When to choose Redis over Memcached and vice versa',
    prerequisites: ['redis-fundamentals', 'memcached-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['redis', 'memcached', 'comparison', 'trade-offs'],
  },

  // ============================================================================
  // Messaging Systems
  // ============================================================================
  {
    id: 'message-queue-fundamentals',
    title: 'Message Queue Fundamentals',
    category: 'messaging',
    description: 'Understanding message queues and why we need them',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['queues', 'async', 'messaging'],
  },
  {
    id: 'kafka-fundamentals',
    title: 'Apache Kafka Basics',
    category: 'messaging',
    description: 'Understanding Kafka as a distributed event streaming platform',
    prerequisites: ['message-queue-fundamentals'],
    relatedConcepts: ['rabbitmq-fundamentals', 'redis-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['kafka', 'streaming', 'events', 'disk-based'],
  },
  {
    id: 'rabbitmq-fundamentals',
    title: 'RabbitMQ Basics',
    category: 'messaging',
    description: 'Understanding RabbitMQ message broker',
    prerequisites: ['message-queue-fundamentals'],
    relatedConcepts: ['kafka-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 12,
    tags: ['rabbitmq', 'message-broker', 'amqp'],
  },
  {
    id: 'redis-vs-kafka',
    title: 'Redis vs Kafka for Queuing',
    category: 'messaging',
    description: 'When to use Redis (in-memory) vs Kafka (disk-based) for message queuing',
    prerequisites: ['redis-fundamentals', 'kafka-fundamentals'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['redis', 'kafka', 'queues', 'trade-offs', 'persistence'],
    resources: [
      {
        type: 'article',
        title: 'Redis vs Kafka: A Comprehensive Comparison',
        url: 'https://double.cloud/blog/posts/2024/02/redis-vs-kafka/',
        description: 'In-depth comparison from DoubleCloud (2024)',
      },
      {
        type: 'article',
        title: 'Redis vs Apache Kafka: How to Choose in 2025',
        url: 'https://betterstack.com/community/comparisons/redis-vs-kafka/',
        description: 'Detailed guide on when to use each - Better Stack',
      },
      {
        type: 'article',
        title: 'Apache Kafka vs Redis: Are They Truly Comparable?',
        url: 'https://www.openlogic.com/blog/apache-kafka-vs-redis',
        description: 'Analysis of use cases and architectural differences - OpenLogic',
      },
      {
        type: 'article',
        title: 'Kafka vs Redis: Log Aggregation Performance',
        url: 'https://logz.io/blog/kafka-vs-redis/',
        description: 'Performance comparison for different workloads - Logz.io',
      },
    ],
  },

  // ============================================================================
  // Architecture Patterns
  // ============================================================================
  {
    id: 'cqrs-pattern',
    title: 'CQRS (Command Query Responsibility Segregation)',
    category: 'architecture',
    description: 'Separating read and write operations for independent scaling and optimization',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['cqrs', 'read-write-separation', 'scaling', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'CQRS Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs',
        description: 'Official Microsoft documentation on CQRS pattern',
      },
      {
        type: 'article',
        title: 'When Should You Use CQRS?',
        url: 'https://blog.risingstack.com/when-to-use-cqrs/',
        description: 'Practical guide on CQRS use cases - RisingStack Engineering',
      },
      {
        type: 'article',
        title: 'CQRS Design Pattern: Independent Read & Write Scaling',
        url: 'https://dip-mazumder.medium.com/optimize-microservices-with-high-read-load-cqrs-design-pattern-0c53793179e3',
        description: 'CQRS for microservices with high read loads',
      },
      {
        type: 'article',
        title: 'CQRS in Event-Driven Systems',
        url: 'https://dev.to/cadienvan/cqrs-separating-the-powers-of-read-and-write-operations-in-event-driven-systems-47eo',
        description: 'Combining CQRS with event sourcing',
      },
    ],
  },
  {
    id: 'event-sourcing',
    title: 'Event Sourcing Pattern',
    category: 'architecture',
    description: 'Storing state changes as a sequence of events instead of current state',
    prerequisites: ['cqrs-pattern'],
    relatedConcepts: ['kafka-fundamentals'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['event-sourcing', 'events', 'audit', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Event Sourcing Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing',
        description: 'Microsoft documentation on event sourcing',
      },
    ],
  },
  {
    id: 'saga-pattern',
    title: 'Saga Pattern for Distributed Transactions',
    category: 'architecture',
    description: 'Managing distributed transactions across microservices using choreography or orchestration',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 25,
    tags: ['saga', 'distributed-transactions', 'microservices', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Saga Pattern - Microservices.io',
        url: 'https://microservices.io/patterns/data/saga.html',
        description: 'Comprehensive guide to Saga pattern',
      },
    ],
  },
  {
    id: 'bulkhead-pattern',
    title: 'Bulkhead Pattern',
    category: 'architecture',
    description: 'Isolating resources to prevent cascading failures',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['bulkhead', 'resilience', 'isolation', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Bulkhead Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead',
        description: 'Resource isolation for resilience',
      },
    ],
  },
  {
    id: 'circuit-breaker-pattern',
    title: 'Circuit Breaker Pattern',
    category: 'architecture',
    description: 'Preventing cascading failures by detecting and handling faults',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['circuit-breaker', 'resilience', 'fault-tolerance', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Circuit Breaker Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker',
        description: 'Implementing fault tolerance with circuit breakers',
      },
    ],
  },
  {
    id: 'retry-pattern',
    title: 'Retry Pattern with Exponential Backoff',
    category: 'architecture',
    description: 'Handling transient failures with intelligent retry strategies',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 12,
    tags: ['retry', 'resilience', 'backoff', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Retry Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/retry',
        description: 'Best practices for retry logic',
      },
    ],
  },
  {
    id: 'strangler-fig-pattern',
    title: 'Strangler Fig Pattern',
    category: 'architecture',
    description: 'Incrementally migrating legacy systems to new architecture',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 18,
    tags: ['migration', 'legacy', 'modernization', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Strangler Fig Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig',
        description: 'Safely migrating monoliths to microservices',
      },
    ],
  },
  {
    id: 'gateway-aggregation',
    title: 'Gateway Aggregation Pattern',
    category: 'architecture',
    description: 'Using a gateway to aggregate multiple backend requests',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['gateway', 'aggregation', 'api', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Gateway Aggregation - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-aggregation',
        description: 'Reducing chattiness between clients and services',
      },
    ],
  },
  {
    id: 'sharding-pattern',
    title: 'Sharding Pattern',
    category: 'architecture',
    description: 'Horizontal partitioning of data across multiple databases',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['sharding', 'partitioning', 'scalability', 'database'],
    resources: [
      {
        type: 'documentation',
        title: 'Sharding Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding',
        description: 'Database sharding strategies and trade-offs',
      },
    ],
  },
  {
    id: 'materialized-view-pattern',
    title: 'Materialized View Pattern',
    category: 'architecture',
    description: 'Pre-computing and caching query results for performance',
    relatedConcepts: ['cqrs-pattern', 'cache-strategies'],
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['materialized-view', 'performance', 'caching', 'patterns'],
    resources: [
      {
        type: 'documentation',
        title: 'Materialized View Pattern - Azure Architecture Center',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/materialized-view',
        description: 'Optimizing read performance with pre-computed views',
      },
    ],
  },

  // ============================================================================
  // Consistency & Availability
  // ============================================================================
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    category: 'consistency',
    description: 'Understanding Consistency, Availability, and Partition Tolerance trade-offs',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 20,
    tags: ['cap', 'distributed-systems', 'trade-offs'],
  },
  {
    id: 'consistency-models',
    title: 'Consistency Models',
    category: 'consistency',
    description: 'Strong consistency, eventual consistency, and everything in between',
    prerequisites: ['cap-theorem'],
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 20,
    tags: ['consistency', 'distributed-systems', 'guarantees'],
  },

  // ============================================================================
  // Performance & Scalability
  // ============================================================================
  {
    id: 'latency-vs-throughput',
    title: 'Latency vs Throughput',
    category: 'performance',
    description: 'Understanding the difference and trade-offs between latency and throughput',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 10,
    tags: ['performance', 'metrics', 'optimization'],
  },
  {
    id: 'horizontal-vs-vertical-scaling',
    title: 'Horizontal vs Vertical Scaling',
    category: 'scalability',
    description: 'Scale up vs scale out strategies and when to use each',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 12,
    tags: ['scalability', 'architecture', 'capacity'],
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
