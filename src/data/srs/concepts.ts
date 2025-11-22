/**
 * System Design Concepts for Spaced Repetition
 *
 * Concepts organized by category with prerequisites and relationships
 */

import { Concept } from '../../types/spacedRepetition';

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
