/**
 * Scenario-Based Questions for System Design Concepts
 *
 * Real-world scenarios that require critical thinking, not just memorization
 */

import { ScenarioQuestion } from '../../types/spacedRepetition';

export const scenarioQuestions: ScenarioQuestion[] = [
  // ============================================================================
  // Redis vs Kafka Questions
  // ============================================================================
  {
    id: 'redis-kafka-q1',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You are building a real-time notification system for a social media platform',
      requirements: [
        'Users should receive notifications within 100ms of an event occurring',
        'Handle 10,000 notifications per second',
        'Notifications can be lost if server crashes (not critical data)',
        'Need to support multiple consumers reading the same notification stream',
      ],
      constraints: [
        'Budget constraint: prefer simpler, lower-cost solution',
        'Team is more familiar with Redis than Kafka',
      ],
      metrics: {
        'Peak Traffic': '10,000 notifications/sec',
        'Latency Requirement': '<100ms',
        'Data Durability': 'Not critical',
      },
    },
    question: 'Would you use Redis or Kafka for this notification queue? Explain your reasoning, discussing the key trade-offs.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Redis is in-memory',
          keywords: ['redis', 'in-memory', 'ram', 'faster', 'low latency'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Kafka is disk-based',
          keywords: ['kafka', 'disk', 'persistent', 'durable', 'slower'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Redis is better for low latency',
          keywords: ['redis', 'latency', 'fast', 'real-time', 'milliseconds'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Data loss is acceptable',
          keywords: ['ephemeral', 'not critical', 'acceptable', 'can lose', 'temporary'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Latency vs Durability',
          options: [
            {
              name: 'Redis (Low Latency)',
              pros: ['Sub-millisecond latency', 'In-memory speed', 'Simple to use'],
              cons: ['Data lost on crash', 'Limited by RAM', 'No replay capability'],
            },
            {
              name: 'Kafka (High Durability)',
              pros: ['Persistent storage', 'Can replay events', 'Fault tolerant'],
              cons: ['Higher latency', 'More complex', 'Overkill for ephemeral data'],
            },
          ],
        },
      ],
      antipatterns: [
        'use kafka for temporary data',
        'need durability for notifications',
        'use database for queue',
      ],
      optionalPoints: [
        'Redis Pub/Sub',
        'Redis Streams',
        'horizontal scaling',
        'team familiarity',
        'operational complexity',
      ],
    },
    explanation: `
**Recommended Solution: Redis**

For this scenario, Redis is the better choice because:

1. **Latency Requirements**: The 100ms requirement is strict. Redis, being in-memory, provides sub-millisecond latency, easily meeting this requirement. Kafka, while fast, adds latency due to disk writes (typically 5-10ms+).

2. **Data Durability Not Critical**: The scenario explicitly states notifications can be lost if the server crashes. This is perfect for Redis, which trades durability for speed. Kafka's main strength (persistent, replayable logs) is unnecessary here.

3. **Simplicity**: Redis is simpler to operate and the team is already familiar with it. Kafka would add operational complexity without clear benefits.

4. **Cost**: Redis would be more cost-effective for this use case.

**When to Use Kafka Instead:**
- Need to replay events (audit logs, analytics)
- Multiple consumers processing at different rates
- Data must survive crashes (financial transactions)
- Need event sourcing or long retention

**Key Insight**: Choose your tool based on requirements, not popularity. Redis excels at ephemeral, low-latency workloads. Kafka excels at durable, replayable event streams.
    `,
    relatedResources: [
      {
        type: 'article',
        title: 'Redis vs Kafka: When to Use Each',
        description: 'Deep dive into use cases',
      },
      {
        type: 'documentation',
        title: 'Redis Pub/Sub vs Streams',
        description: 'Understanding Redis messaging patterns',
      },
    ],
    difficulty: 'medium',
    estimatedTimeSeconds: 180,
    tags: ['redis', 'kafka', 'messaging', 'trade-offs'],
    variationGroup: 'redis-kafka-choice',
  },

  {
    id: 'redis-kafka-q2',
    conceptId: 'redis-vs-kafka',
    scenario: {
      context: 'You are designing an order processing system for an e-commerce platform',
      requirements: [
        'Every order must be processed exactly once',
        'Orders must survive system crashes',
        'Need to replay failed orders from the past 7 days',
        'Multiple services consume order events (inventory, shipping, analytics)',
        'Handle 1,000 orders per second during peak',
      ],
      constraints: [
        'Cannot lose any order data',
        'Audit team needs to review all orders from past week',
      ],
      metrics: {
        'Peak Traffic': '1,000 orders/sec',
        'Data Retention': '7 days minimum',
        'Durability': 'Critical - cannot lose orders',
      },
    },
    question: 'Would you use Redis or Kafka for this order processing queue? Explain your choice, focusing on durability and replay requirements.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Kafka provides durability',
          keywords: ['kafka', 'durable', 'persistent', 'disk', 'survive crash'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Kafka supports replay',
          keywords: ['kafka', 'replay', 'reprocess', 'offset', 'retention'],
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
          concept: 'Multiple consumers',
          keywords: ['consumer groups', 'multiple consumers', 'independent', 'parallel'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Durability vs Speed',
          options: [
            {
              name: 'Kafka (Durable)',
              pros: ['Survives crashes', 'Replayable', 'Audit trail', 'Multiple consumers'],
              cons: ['Slightly higher latency', 'More operational complexity'],
            },
            {
              name: 'Redis (Fast)',
              pros: ['Lower latency', 'Simpler'],
              cons: ['Data loss risk', 'No replay', 'Not suitable for critical data'],
            },
          ],
        },
      ],
      antipatterns: [
        'use redis for critical data',
        'redis is fine without persistence',
        'latency is more important than durability',
      ],
      optionalPoints: [
        'exactly-once semantics',
        'consumer groups',
        'kafka partitioning',
        'audit compliance',
      ],
    },
    explanation: `
**Recommended Solution: Kafka**

For this e-commerce scenario, Kafka is the clear choice because:

1. **Critical Durability**: Orders are financial transactions that cannot be lost. Kafka persists all messages to disk with replication, ensuring orders survive crashes.

2. **Replay Capability**: The requirement to replay failed orders from the past 7 days is a perfect match for Kafka. You can set retention to 7+ days and reprocess orders by resetting consumer offsets. Redis doesn't support replay.

3. **Multiple Consumers**: Inventory, shipping, and analytics services all need to consume order events independently. Kafka consumer groups allow each service to track its own progress through the event stream.

4. **Audit Trail**: Kafka provides an immutable log of all orders, meeting audit requirements.

**Why Not Redis:**
- Redis is in-memory by default (data lost on crash)
- Even with Redis persistence (RDB/AOF), it's not designed for this use case
- Redis Pub/Sub doesn't provide replay capability
- Redis Streams has limited retention compared to Kafka

**Trade-off Analysis:**
- Accepting slightly higher latency (5-10ms vs <1ms) is worth the durability guarantee
- Kafka's operational complexity is justified for critical business data

**Key Insight**: For financial transactions, user data, or any critical business events, choose durability over raw speed. Kafka is purpose-built for durable event streaming.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 180,
    tags: ['redis', 'kafka', 'durability', 'trade-offs'],
    variationGroup: 'redis-kafka-choice',
  },

  // ============================================================================
  // Cache Strategy Questions
  // ============================================================================
  {
    id: 'cache-strategy-q1',
    conceptId: 'cache-strategies',
    scenario: {
      context: 'You are building a product catalog service for an e-commerce site',
      requirements: [
        'Product data changes frequently (prices, inventory)',
        'Read-heavy workload (1000 reads per 1 write)',
        'Stale data is acceptable for up to 5 seconds',
        'Database can handle write load but not read load',
      ],
      constraints: [
        'Must minimize database load',
        'Eventual consistency is acceptable',
      ],
      metrics: {
        'Read/Write Ratio': '1000:1',
        'Acceptable Staleness': '5 seconds',
        'Database Capacity': 'Cannot handle read load',
      },
    },
    question: 'Should you use write-through, write-back, or write-around caching? Explain your reasoning and discuss the consistency implications.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Write-through updates cache on write',
          keywords: ['write-through', 'write to cache', 'synchronous', 'update cache'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Write-back delays writes to database',
          keywords: ['write-back', 'async', 'eventual', 'delay', 'batch'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Write-around bypasses cache on write',
          keywords: ['write-around', 'bypass cache', 'write directly', 'skip cache'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Read-heavy workload favors certain strategies',
          keywords: ['read-heavy', 'read load', 'cache reads', 'reduce reads'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Consistency vs Performance',
          options: [
            {
              name: 'Write-Through',
              pros: ['Cache always fresh', 'Simple consistency'],
              cons: ['Write latency', 'Wasted cache updates for rarely-read data'],
            },
            {
              name: 'Write-Back',
              pros: ['Fast writes', 'Batch DB updates'],
              cons: ['Risk of data loss', 'Complex consistency'],
            },
            {
              name: 'Write-Around',
              pros: ['No wasted cache writes', 'Simple'],
              cons: ['Cache miss on first read after write', 'Stale data possible'],
            },
          ],
        },
      ],
      antipatterns: [
        'write-back for critical data',
        'strong consistency required',
        'cannot tolerate data loss',
      ],
      optionalPoints: [
        'TTL strategy',
        'cache-aside pattern',
        'lazy loading',
        'read-through cache',
      ],
    },
    explanation: `
**Recommended Solution: Write-Through Cache (with TTL)**

For this product catalog scenario, write-through caching is the best choice:

1. **Cache Freshness**: Write-through ensures the cache is updated immediately when product data changes (prices, inventory). This keeps the cache fresh without requiring manual invalidation.

2. **Read-Heavy Optimization**: Since reads outnumber writes 1000:1, the extra write latency (updating both cache and DB) is negligible compared to the read performance gains.

3. **Acceptable Consistency**: With a 5-second TTL, you get near-real-time updates while allowing some staleness, which is acceptable per requirements.

**Why Not Write-Back:**
- Risk of data loss if cache crashes before DB sync
- Complexity of eventual consistency
- Not worth it when writes are only 0.1% of traffic

**Why Not Write-Around:**
- After every price/inventory update, the next read would be a cache miss
- With frequent updates, this defeats the purpose of caching

**Optimization:**
Add a short TTL (5 seconds) as a safety net in case cache entries aren't explicitly invalidated.

**Implementation Pattern:**
\`\`\`
on product_update:
  1. Write to database
  2. Update cache (or invalidate)
  3. Set TTL to 5 seconds
  4. Return to client
\`\`\`

**Key Insight**: Choose caching strategy based on read/write ratio. Write-through is ideal for read-heavy workloads where data changes frequently but consistency requirements are relaxed.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 240,
    tags: ['caching', 'write-through', 'consistency', 'performance'],
    variationGroup: 'cache-strategy-choice',
  },

  {
    id: 'cache-strategy-q2',
    conceptId: 'cache-strategies',
    scenario: {
      context: 'You are building an analytics dashboard that aggregates metrics from millions of events',
      requirements: [
        'Dashboard shows hourly metrics (not real-time)',
        'Metrics are expensive to compute (30 seconds per calculation)',
        'Data is write-heavy (millions of events per hour)',
        'Dashboard is read occasionally (few times per hour)',
      ],
      constraints: [
        'Cannot afford to compute metrics on every write',
        'Reads are infrequent but must be fast when they happen',
      ],
      metrics: {
        'Computation Cost': '30 seconds per metric',
        'Write Volume': 'Millions of events/hour',
        'Read Frequency': 'Few times per hour',
      },
    },
    question: 'What caching strategy would you use for this analytics dashboard? Consider when to compute and cache the metrics.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Lazy computation (cache-aside)',
          keywords: ['lazy', 'on-demand', 'cache-aside', 'compute when needed', 'read-through'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Write-through would be wasteful',
          keywords: ['write-through', 'wasteful', 'unnecessary', 'expensive', 'overhead'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'TTL or time-based invalidation',
          keywords: ['ttl', 'expiration', 'hourly', 'time-based', 'invalidation'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Compute Timing',
          options: [
            {
              name: 'Eager (on write)',
              pros: ['Always fresh', 'Reads are instant'],
              cons: ['Wasteful if not read', 'Slows writes', 'Expensive'],
            },
            {
              name: 'Lazy (on read)',
              pros: ['Only compute when needed', 'No write overhead'],
              cons: ['First read is slow', 'Cache miss penalty'],
            },
          ],
        },
      ],
      optionalPoints: [
        'pre-aggregation',
        'background jobs',
        'cron-based cache warming',
        'stale-while-revalidate',
      ],
    },
    explanation: `
**Recommended Solution: Cache-Aside (Lazy Loading) with Background Refresh**

For this analytics scenario, use lazy loading:

1. **Cache-Aside Pattern:**
   \`\`\`
   on metric_read:
     if metric in cache and not expired:
       return cached value
     else:
       compute metric (30 seconds)
       store in cache with 1-hour TTL
       return computed value
   \`\`\`

2. **Why Lazy Loading:**
   - Metrics are read only a few times per hour
   - Computing on every write would waste 99% of computations
   - First read pays the 30-second cost, subsequent reads are instant

3. **Optimization - Background Refresh:**
   - Schedule a cron job to pre-compute popular metrics every hour
   - Users get instant results
   - Compute only what's actually used

**Why Not Write-Through:**
- Would compute metrics on every event (millions per hour)
- Each computation takes 30 seconds
- Almost none would ever be read
- Massive waste of resources

**Key Insight**: For expensive computations with infrequent reads, lazy loading (cache-aside) is far more efficient than eager computation (write-through). Only compute what's actually needed.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 240,
    tags: ['caching', 'cache-aside', 'lazy-loading', 'optimization'],
    variationGroup: 'cache-strategy-choice',
  },

  // ============================================================================
  // Redis vs Memcached Questions
  // ============================================================================
  {
    id: 'redis-memcached-q1',
    conceptId: 'redis-vs-memcached',
    scenario: {
      context: 'You need a simple session cache for a web application',
      requirements: [
        'Store user session data (simple key-value pairs)',
        'Sessions expire after 30 minutes of inactivity',
        'Need to scale horizontally across multiple cache servers',
        'Simple use case - no complex data structures needed',
      ],
      constraints: [
        'Team prefers simplicity over features',
        'No need for persistence or pub/sub',
      ],
    },
    question: 'Would you choose Redis or Memcached for this simple session cache? Explain your reasoning.',
    questionType: 'component_choice',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Memcached is simpler for basic caching',
          keywords: ['memcached', 'simple', 'basic', 'key-value', 'straightforward'],
          weight: 0.8,
          mustMention: true,
        },
        {
          concept: 'Redis has more features but overkill',
          keywords: ['redis', 'features', 'complex', 'overkill', 'unnecessary'],
          weight: 0.7,
          mustMention: true,
        },
        {
          concept: 'Memcached multi-threaded performance',
          keywords: ['memcached', 'multi-threaded', 'performance', 'cores'],
          weight: 0.5,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Simplicity vs Features',
          options: [
            {
              name: 'Memcached',
              pros: ['Simpler', 'Multi-threaded', 'Less memory overhead'],
              cons: ['Only strings', 'No persistence', 'No pub/sub'],
            },
            {
              name: 'Redis',
              pros: ['Rich data types', 'Persistence option', 'Pub/sub'],
              cons: ['More complex', 'Single-threaded', 'Overkill for simple cache'],
            },
          ],
        },
      ],
      optionalPoints: [
        'consistent hashing',
        'LRU eviction',
        'memcached simplicity',
      ],
    },
    explanation: `
**Recommended Solution: Memcached**

For this simple session cache, Memcached is the better choice:

1. **Perfect Match for Use Case**: Session storage is exactly what Memcached was designed for - simple key-value caching with TTL.

2. **Simplicity**: Memcached has a simpler architecture and is easier to operate for basic caching needs.

3. **Multi-threaded Performance**: Memcached can utilize multiple CPU cores better than Redis (which is single-threaded for command processing).

**When to Choose Redis Instead:**
- Need complex data types (lists, sets, sorted sets)
- Need persistence (survive crashes)
- Need pub/sub messaging
- Need Lua scripting or transactions

**Key Insight**: Use Memcached for simple caching, Redis when you need its advanced features. Don't over-engineer with Redis if you just need basic key-value caching.
    `,
    difficulty: 'easy',
    estimatedTimeSeconds: 120,
    tags: ['redis', 'memcached', 'caching', 'simplicity'],
    variationGroup: 'redis-memcached-choice',
  },

  // ============================================================================
  // Cache Eviction Questions
  // ============================================================================
  {
    id: 'cache-eviction-q1',
    conceptId: 'cache-eviction',
    scenario: {
      context: 'Your cache is filling up and you need to choose an eviction policy',
      requirements: [
        'User profile data with varying access patterns',
        'Some profiles accessed frequently (celebrities, influencers)',
        'Some profiles accessed once and never again',
        'Limited cache memory',
      ],
    },
    question: 'Should you use LRU (Least Recently Used) or LFU (Least Frequently Used) eviction? Explain the trade-offs.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'LRU evicts least recently used',
          keywords: ['lru', 'recently used', 'recency', 'temporal'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'LFU evicts least frequently used',
          keywords: ['lfu', 'frequently', 'frequency', 'count', 'access count'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Access pattern matters',
          keywords: ['access pattern', 'workload', 'temporal locality', 'frequency'],
          weight: 0.6,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Eviction Strategy',
          options: [
            {
              name: 'LRU',
              pros: ['Handles temporal patterns well', 'Simple to implement'],
              cons: ['Can evict frequently-used items', 'One-time scans pollute cache'],
            },
            {
              name: 'LFU',
              pros: ['Protects popular items', 'Good for skewed distributions'],
              cons: ['Stale popular items stick around', 'More complex'],
            },
          ],
        },
      ],
      optionalPoints: [
        'LRU-K',
        'two queues',
        'admission policy',
        'cache pollution',
      ],
    },
    explanation: `
**Recommended Solution: LRU (with consideration)**

For user profiles with varying access patterns, LRU is generally better:

1. **Temporal Locality**: User profile access often has temporal locality - if a profile was accessed recently, it's likely to be accessed again soon.

2. **Handles One-Time Access**: Profiles accessed once will naturally age out, which is desirable.

3. **Simplicity**: LRU is simpler and has lower overhead than LFU.

**However, Consider LFU if:**
- You have clear "hot" items (celebrities) that should stay cached
- One-time scans (batch jobs) are polluting your cache
- Access distribution is very skewed

**Hybrid Approach:**
Many production systems use variants like:
- **W-TinyLFU**: Combines recency and frequency
- **Two Queues**: Probationary queue (LRU) + main queue (LFU)

**Key Insight**: LRU works well for most workloads. Consider LFU or hybrid approaches when you have highly skewed access patterns with clear "hot" items.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 180,
    tags: ['caching', 'eviction', 'lru', 'lfu'],
    variationGroup: 'cache-eviction-choice',
  },
];

/**
 * Get questions for a concept
 */
export function getQuestionsForConcept(conceptId: string): ScenarioQuestion[] {
  return scenarioQuestions.filter(q => q.conceptId === conceptId);
}

/**
 * Get question by ID
 */
export function getQuestionById(questionId: string): ScenarioQuestion | undefined {
  return scenarioQuestions.find(q => q.id === questionId);
}

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(
  difficulty: ScenarioQuestion['difficulty']
): ScenarioQuestion[] {
  return scenarioQuestions.filter(q => q.difficulty === difficulty);
}
