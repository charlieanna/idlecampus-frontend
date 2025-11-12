# What's Left to Configure?

## Old Way (Abstract & Confusing)
```
Database Configuration:
- Read Capacity: 100 RPS  ← What does this mean?
- Write Capacity: 50 RPS  ← How do I price this?
- Memory: ???
```

## New Way (Real Hardware)
```
Database: db.m5.large
- 2 vCPU, 8GB RAM
- $0.182/hour = ~$131/month
- ~500 RPS capacity (based on benchmarks)
```

## What You ACTUALLY Configure

### 1. **Hardware Choice** (Pick EC2 Instance Type)

| Component | Instance Types | When to Use |
|-----------|---------------|-------------|
| **App Server** | `t3.micro` → `m5.2xlarge` | Based on CPU/memory needs |
| **Cache (Redis)** | `cache.t3.micro` → `cache.r5.large` | Based on data size |
| **Database (RDS)** | `db.t3.micro` → `db.m5.2xlarge` | Based on IOPS + connections |

**This is simple**: Just like launching an EC2 instance!

---

### 2. **Cache Technology Choices**

#### Choice 1: Engine
- **Redis**: Rich data structures, persistence, Lua scripts
- **Memcached**: Simple, no persistence, pure cache

#### Choice 2: Eviction Policy
- **LRU** (Least Recently Used): Evict oldest accessed item
- **LFU** (Least Frequently Used): Evict least popular item
- **TTL**: Expire after time
- **Random**: Random eviction

#### Choice 3: Persistence (Redis only)
- **None**: Lose all data on restart (fastest)
- **RDB**: Periodic snapshots (good balance)
- **AOF**: Write log (most durable)

#### Choice 4: Hit Ratio Strategy
- Expected hit ratio: 70%, 90%, 95%?
- TTL: 5min, 1hr, 24hr?
- Impacts cache effectiveness

**Example Config**:
```typescript
{
  instanceType: 'cache.m5.large',  // Hardware
  engine: 'redis',                 // Technology
  evictionPolicy: 'lru',           // Strategy
  ttl: 3600,                       // 1 hour
  hitRatio: 0.9,                   // Expected 90% hit
  persistence: 'rdb',              // Snapshots
}
```

---

### 3. **Database Technology Choices**

#### Choice 1: Database Engine

| Engine | Type | Use Case |
|--------|------|----------|
| **PostgreSQL** | Relational | ACID, complex queries, joins |
| **MySQL** | Relational | Popular, proven, wide support |
| **MongoDB** | NoSQL (Document) | Flexible schema, JSON documents |
| **Cassandra** | NoSQL (Wide-column) | High write throughput, distributed |
| **DynamoDB** | NoSQL (Key-value) | Fully managed, auto-scale |

#### Choice 2: Transaction Isolation Level

| Level | Dirty Read | Non-repeatable Read | Phantom Read | Performance |
|-------|------------|---------------------|--------------|-------------|
| **Read Uncommitted** | ✓ | ✓ | ✓ | Fastest |
| **Read Committed** | ✗ | ✓ | ✓ | Fast (default) |
| **Repeatable Read** | ✗ | ✗ | ✓ | Slower |
| **Serializable** | ✗ | ✗ | ✗ | Slowest |

**Trade-off**: Consistency vs Performance

#### Choice 3: Replication Mode

| Mode | Consistency | Performance | Use Case |
|------|-------------|-------------|----------|
| **No Replication** | N/A | Fastest | Dev, low-risk |
| **Async Replication** | Eventual | Fast | Most production |
| **Sync Replication** | Strong | Slow | Financial, critical |

**Example**: Async replication is 10x faster but can lose latest writes on failover

#### Choice 4: Sharding Strategy (for scale)
- **None**: Single database
- **Horizontal**: Split by user_id, region, etc.
- **Hash**: Consistent hashing
- **Range**: Date ranges, ID ranges

**Example Config**:
```typescript
{
  instanceType: 'db.m5.xlarge',         // Hardware
  engine: 'postgresql',                 // Technology
  isolationLevel: 'read-committed',     // Trade-off
  replication: {
    enabled: true,
    replicas: 2,                        // 2 read replicas
    mode: 'async',                      // Eventual consistency
  },
  sharding: {
    enabled: false,                     // Not yet needed
    shards: 1,
    shardKey: '',
  },
  storageType: 'gp3',                   // SSD type
  storageSizeGB: 100,
}
```

---

### 4. **NoSQL-Specific Choices**

#### MongoDB Configuration
```typescript
{
  engine: 'mongodb',
  consistencyLevel: 'eventual',         // Eventual vs Strong
  dataModel: 'document',
  mongodb: {
    shardingStrategy: 'hashed',         // Hash vs Range
    indexing: ['user_id', 'created_at'], // Which fields to index
  },
}
```

#### Cassandra Configuration
```typescript
{
  engine: 'cassandra',
  consistencyLevel: 'eventual',
  dataModel: 'wide-column',
  cassandra: {
    replicationFactor: 3,               // Copies of data
    readConsistency: 'quorum',          // How many replicas to read
    writeConsistency: 'quorum',         // How many to write
  },
}
```

**Trade-off**: `readConsistency: 'one'` = Fast but stale, `'all'` = Slow but fresh

---

### 5. **Message Queue Choices**

#### Choice 1: Technology

| Engine | Use Case | Throughput | Ordering |
|--------|----------|------------|----------|
| **Kafka** | Event streaming | Very High | Per-partition |
| **RabbitMQ** | Task queue | Medium | Per-queue |
| **SQS** | Managed queue | High | Best-effort |
| **Kinesis** | Real-time analytics | Very High | Per-shard |

#### Choice 2: Delivery Guarantee

| Guarantee | Meaning | Use Case |
|-----------|---------|----------|
| **At-most-once** | May lose messages | Metrics, logs |
| **At-least-once** | May duplicate | Most apps |
| **Exactly-once** | Never duplicate | Payments, orders |

**Example Config**:
```typescript
{
  instanceType: 'kafka.m5.large',
  engine: 'kafka',
  topics: 10,
  partitions: 12,
  retentionHours: 24,
  deliveryGuarantee: 'at-least-once',
}
```

---

## Summary: What You Configure

### ✅ **Hardware** (Simple - Just pick instance type)
- App Server: `m5.large`, `m5.xlarge`, etc.
- Cache: `cache.m5.large`
- Database: `db.m5.xlarge`

### ✅ **Technology Decisions** (This is the real system design!)
1. **Which database?** PostgreSQL vs MongoDB vs Cassandra?
2. **What consistency?** Strong vs Eventual?
3. **What isolation?** Read-committed vs Serializable?
4. **Cache strategy?** LRU vs LFU? What TTL?
5. **Replication mode?** Sync vs Async?
6. **Sharding?** When and how?
7. **Message delivery?** At-least-once vs Exactly-once?

### ❌ **NOT Configuring** (Derived from instance type)
- ~~Read capacity~~  → Calculated from `db.m5.large` specs
- ~~Write capacity~~ → Calculated from instance + storage IOPS
- ~~Memory size~~ → Part of instance type
- ~~Network bandwidth~~ → Part of instance type

---

## Example: Complete System Configuration

```typescript
// App Server (simple!)
appServer: {
  instanceType: 'm5.large',        // 2 vCPU, 8GB, ~1000 RPS
  instances: 3,                     // 3 for HA
}

// Redis Cache (real decisions!)
redis: {
  instanceType: 'cache.m5.large',  // 6GB memory
  instances: 1,
  engine: 'redis',                  // vs Memcached
  evictionPolicy: 'lru',            // vs LFU
  ttl: 3600,                        // 1 hour
  hitRatio: 0.9,                    // Expected
  persistence: 'rdb',               // vs AOF vs none
  replication: false,               // vs true
}

// PostgreSQL (trade-offs!)
database: {
  instanceType: 'db.m5.xlarge',    // 4 vCPU, 16GB, ~1000 RPS
  instances: 1,
  engine: 'postgresql',             // vs MySQL vs MongoDB
  isolationLevel: 'read-committed', // vs serializable
  replication: {
    enabled: true,
    replicas: 2,                    // 2 read replicas
    mode: 'async',                  // vs sync (trade-off!)
  },
  storageType: 'gp3',               // SSD type
  storageSizeGB: 100,
}
```

## Why This Is Better

### Before:
- **Abstract**: "Database capacity: 100 RPS"
- **Can't price it**: What does 100 RPS cost?
- **Can't relate to real world**: Is this a small or large DB?

### After:
- **Concrete**: "db.m5.large: 2 vCPU, 8GB RAM"
- **Can price it**: $131/month (look it up on AWS!)
- **Real-world**: "That's the same as a small RDS instance"

### Configuration Focus:
- **Before**: Fiddling with capacity numbers
- **After**: Making real system design decisions:
  - PostgreSQL or MongoDB?
  - Sync or async replication?
  - LRU or LFU eviction?
  - Eventual or strong consistency?

**This is what system design interviews ask about!**
