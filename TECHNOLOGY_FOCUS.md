# Technology Focus: Redis, Kafka, Cassandra, Zookeeper

## Philosophy: Technology-Agnostic with Specific Examples

This learning system focuses on **patterns and fundamental concepts** rather than specific tool comparisons. We are technology-agnostic in our approach.

When we DO teach specific technologies, we focus exclusively on these four core distributed systems:

1. **Redis** - In-memory data store
2. **Kafka** - Distributed event streaming
3. **Cassandra** - Distributed NoSQL database
4. **Zookeeper** - Distributed coordination

## Why These Four?

These technologies represent the **fundamental building blocks** of modern distributed systems:

| Technology | Purpose | Pattern |
|------------|---------|---------|
| **Redis** | In-memory storage | Caching, sessions, real-time data |
| **Kafka** | Event streaming | Message queues, event logs, stream processing |
| **Cassandra** | Distributed database | Write-heavy workloads, time-series, wide-column storage |
| **Zookeeper** | Coordination | Leader election, distributed locks, configuration |

## Learning Approach

### ✅ We Teach

**Patterns (Technology-Agnostic)**:
- Caching strategies (write-through, write-back, cache-aside)
- Cache eviction policies (LRU, LFU, TTL)
- Message queue patterns (pub/sub, event streaming)
- Data modeling strategies
- Consistency models (strong, eventual, causal)
- Distributed coordination patterns
- CQRS, Event Sourcing, Saga patterns
- Circuit breaker, bulkhead, retry patterns

**Specific Technologies** (Only the four):
- **When to use Redis** - Ephemeral data, low latency, atomic operations
- **When to use Kafka** - Durable events, replay capability, stream processing
- **When to use Cassandra** - Write-heavy workloads, linear scaling, eventual consistency
- **When to use Zookeeper** - Leader election, distributed locks, configuration management

### ❌ We Don't Teach

- Memcached (replaced by Redis examples)
- RabbitMQ (replaced by Kafka examples)
- MongoDB (replaced by Cassandra examples)
- etcd/Consul (replaced by Zookeeper examples)
- Specific cloud services (AWS SQS, Azure Service Bus, etc.)

## Concepts Coverage

### Redis Concepts (5 concepts)
1. Redis Fundamentals
2. Redis Data Structures (Strings, Lists, Sets, Sorted Sets, Hashes)
3. Redis Persistence (RDB, AOF)
4. In-Memory vs Durable Queues (Redis vs Kafka comparison)
5. Pub/Sub Pattern

**Scenario Questions**: 12+ variations
- Gaming sessions, Rate limiting, Leaderboards
- API caching, Job queues, Real-time features

### Kafka Concepts (5 concepts)
1. Kafka Fundamentals
2. Producers and Consumers
3. Partitioning Strategy
4. Event Streaming Pattern
5. Event Sourcing (with Kafka)

**Scenario Questions**: 12+ variations
- IoT sensor data, Financial transactions, Clickstream
- Order processing, Metrics aggregation, Chat history

### Cassandra Concepts (5 concepts)
1. Cassandra Fundamentals
2. Data Modeling (partition keys, clustering)
3. Consistency Levels (ONE, QUORUM, ALL)
4. Cassandra vs Relational (when to use)
5. Replication Patterns

**Scenario Questions**: 6+ variations
- Time-series IoT data, Social media feeds
- Session stores, User timelines, Analytics

### Zookeeper Concepts (4 concepts)
1. Zookeeper Fundamentals
2. Leader Election Pattern
3. Distributed Locks and Barriers
4. Configuration Management

**Scenario Questions**: 6+ variations
- Worker coordination, Resource locking
- Dynamic configuration, Service discovery

## Example Learning Path

**Beginner** → **Intermediate** → **Advanced**

```
Week 1-2: Caching Fundamentals
  ├─ Cache patterns (technology-agnostic)
  ├─ Redis as example in-memory store
  └─ Scenarios: sessions, rate limiting, leaderboards

Week 3-4: Messaging Patterns
  ├─ Queue vs event log patterns
  ├─ Kafka for durable messaging
  └─ Scenarios: orders, events, analytics

Week 5-6: Distributed Databases
  ├─ SQL vs NoSQL trade-offs
  ├─ Cassandra for write-heavy workloads
  └─ Scenarios: time-series, social feeds

Week 7-8: Coordination Patterns
  ├─ Distributed consensus fundamentals
  ├─ Zookeeper for coordination
  └─ Scenarios: leader election, distributed locks

Week 9-10: Advanced Patterns
  ├─ CQRS, Event Sourcing, Saga
  ├─ How they combine with Redis/Kafka/Cassandra
  └─ Real-world architectures
```

## Question Design Philosophy

### Pattern-First Approach

**❌ Wrong (Tool Comparison)**:
```
Q: Should you use Redis or Memcached?
```

**✅ Right (Pattern-Based)**:
```
Q: You need to store session data with automatic expiry.
   Requirements: <100ms latency, 1M sessions, expire after 30min

   What storage approach would you use and why?

   Expected: In-memory store like Redis
   - TTL support for auto-expiry
   - Sub-millisecond latency
   - Atomic operations
```

### Scenario Variations

For each concept, we create 5-10 scenario variations to prevent memorization:

**Example: "In-Memory vs Durable Messaging" concept**

Scenarios testing same core understanding:
1. Gaming sessions (Redis - ephemeral OK)
2. Financial transactions (Kafka - durability required)
3. Real-time notifications (Redis - speed over durability)
4. Order processing (Kafka - audit trail needed)
5. Rate limiting (Redis - atomic counters)
6. IoT sensor data (Kafka - retention + replay)
7. Chat messages (Kafka - offline user support)
8. API cache (Redis - fast lookups)
9. Metrics (Both - Kafka for ingestion, Redis for queries)
10. Job queues (Redis - simple semantics)

Each scenario teaches the SAME concepts but from different business contexts.

## Real Engineering Articles

Every concept links to real engineering articles:

**Redis Articles**:
- Redis official documentation
- Engineering blogs (Squarespace, ByteByteGo)

**Kafka Articles**:
- Apache Kafka documentation
- Comparison guides (DoubleCloud, Better Stack, OpenLogic)

**Cassandra Articles**:
- Apache Cassandra documentation
- Data modeling guides

**Zookeeper Articles**:
- Apache Zookeeper documentation
- Coordination pattern guides

**Architecture Patterns**:
- Azure Architecture Center (Microsoft official)
- Microservices.io (Saga, CQRS patterns)
- RisingStack Engineering

## Statistics

**Total Concepts**: 40+
- Caching: 5 concepts
- Redis: 5 concepts
- Kafka: 5 concepts
- Cassandra: 5 concepts
- Zookeeper: 4 concepts
- Architecture patterns: 10+ concepts
- Storage patterns: 5 concepts

**Total Scenario Questions**: 35+
- Base questions: 7
- Redis vs Kafka: 12
- Architecture patterns: 6
- Cassandra: 6
- Zookeeper: 6

**Engineering Articles**: 20+ real blog posts and official documentation

## Benefits of This Approach

1. **Transferable Knowledge**: Learn patterns that work across technologies
2. **Deep Understanding**: Focus on WHY rather than WHAT
3. **Practical Application**: Real-world scenarios from production systems
4. **Prevent Memorization**: Multiple scenarios per concept
5. **Industry Relevant**: These 4 technologies power most distributed systems
6. **Clear Mental Models**: Understand the fundamental trade-offs

## Future Extensions

While maintaining technology-agnostic patterns, future additions could include:

- Additional Redis patterns (Redis Cluster, Redis Streams)
- Kafka Streams and KSQL
- Cassandra advanced features (materialized views, secondary indexes)
- More coordination patterns with Zookeeper
- Database replication patterns
- Consistency algorithm deep-dives (Paxos, Raft, Gossip)

All additions will maintain the pattern-first, technology-agnostic approach with specific examples from our core four technologies.
