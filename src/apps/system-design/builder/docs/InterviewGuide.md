# System Design Interview Guide

## 📚 Core Concepts Every Candidate Must Know

---

## 1. Cache Strategies

### **Cache-Aside (Lazy Loading)**
```
Application checks cache → MISS → Read DB → Update cache
```
**When to use:** Most common, app controls caching logic
**Pros:** Cache only what's needed
**Cons:** Cache miss penalty, stale data possible
**Interview Answer:** "I'd use cache-aside because it's simple and works for most read-heavy workloads"

### **Read-Through**
```
Application → Cache (handles DB read transparently)
```
**When to use:** When cache library supports it
**Pros:** Simpler app code
**Cons:** Cache miss still hits DB
**Interview Answer:** "Read-through if I want to abstract DB access through the cache layer"

### **Write-Through**
```
Write → Cache + DB (synchronous)
```
**When to use:** Strong consistency needed
**Pros:** Cache always consistent with DB
**Cons:** Slower writes (2x latency)
**Interview Answer:** "Write-through for financial data where consistency is critical"

### **Write-Behind (Write-Back)**
```
Write → Cache (async flush to DB later)
```
**When to use:** High write throughput needed
**Pros:** Fast writes, batch DB updates
**Cons:** Risk of data loss, eventual consistency
**Interview Answer:** "Write-behind for analytics where some data loss is acceptable"

### **Write-Around**
```
Write → DB (bypass cache)
```
**When to use:** Infrequently read data
**Pros:** Doesn't pollute cache
**Cons:** Cache miss on first read
**Interview Answer:** "Write-around for one-time writes like log data"

---

## 2. Consistency Models (CAP Theorem)

### **The CAP Theorem**
```
You can only pick 2 of 3:
- Consistency (C): All nodes see same data
- Availability (A): System always responds
- Partition Tolerance (P): Works despite network failures

In practice: P is mandatory → Choose C or A
```

### **Strong Consistency (CP)**
```
All reads return the latest write
```
**Systems:** PostgreSQL, MySQL, MongoDB (with majority reads)
**Tradeoff:** May block during network partitions
**Interview Answer:** "For banking/payments, I need strong consistency to prevent double-spending"

### **Eventual Consistency (AP)**
```
Reads may be stale, but eventually converge
```
**Systems:** Cassandra, DynamoDB, S3
**Tradeoff:** Better availability, may show old data
**Interview Answer:** "For social media feeds, eventual consistency is fine—users won't notice 1-second staleness"

### **Causal Consistency**
```
Causally related operations are ordered
```
**Example:** If Alice posts "I'm engaged!" and Bob comments "Congrats!", the comment must appear AFTER the post
**Interview Answer:** "For collaborative apps, causal consistency prevents confusing ordering"

### **Read-Your-Writes Consistency**
```
Users always see their own writes
```
**Interview Answer:** "After posting a tweet, I immediately see it—that's read-your-writes consistency"

---

## 3. Database Transactions

### **ACID (Traditional RDBMS)**
- **Atomicity:** All or nothing
- **Consistency:** Valid state transitions
- **Isolation:** Concurrent transactions don't interfere
- **Durability:** Committed data persists

**Interview Answer:** "For e-commerce checkout, I use ACID to ensure inventory/payment/order are atomic"

### **BASE (NoSQL)**
- **Basically Available:** System responds even during failures
- **Soft state:** State may change without input (eventual consistency)
- **Eventual consistency:** System converges to consistent state

**Interview Answer:** "For Twitter timeline, BASE is fine—users don't need real-time perfect consistency"

### **Isolation Levels**
```
Read Uncommitted → Read Committed → Repeatable Read → Serializable
  (fastest)                                          (slowest, safest)
```

**Interview Answer:**
- "For reports, Read Committed is enough"
- "For ticket booking, I need Serializable to prevent double-booking"

---

## 4. Locking Strategies

### **Pessimistic Locking**
```sql
SELECT * FROM seats WHERE id = 123 FOR UPDATE;
-- Row locked until transaction commits
```
**When:** Strong consistency, low contention
**Pros:** Guaranteed consistency
**Cons:** Lower throughput, deadlocks possible
**Interview Answer:** "For TicketMaster seat selection, pessimistic locks prevent double-booking"

### **Optimistic Locking**
```sql
UPDATE seats SET booked = true, version = version + 1
WHERE id = 123 AND version = 5;
-- If version changed, someone else modified it
```
**When:** High contention, can handle retries
**Pros:** Higher throughput, no deadlocks
**Cons:** Conflicts on contention
**Interview Answer:** "For Wikipedia edits, optimistic locking allows many concurrent editors"

---

## 5. NoSQL Database Types

### **Document DB (MongoDB, Firestore)**
```json
{
  "_id": "user123",
  "name": "Alice",
  "orders": [...]
}
```
**When:** Flexible schema, nested data
**Interview Answer:** "For user profiles with varying fields, I'd use MongoDB"

### **Key-Value (Redis, DynamoDB)**
```
key: "session:abc123"
value: {...}
```
**When:** Simple lookups, caching
**Interview Answer:** "For session storage, key-value is perfect—fast lookups by session ID"

### **Wide-Column (Cassandra, HBase)**
```
Row Key | Column Family 1 | Column Family 2
user:1  | name: Alice     | orders: [...]
```
**When:** Time-series, sparse data
**Interview Answer:** "For IoT sensor data, Cassandra handles billions of writes"

### **Graph DB (Neo4j)**
```
(Alice) -[FRIENDS_WITH]-> (Bob)
```
**When:** Relationships are first-class
**Interview Answer:** "For LinkedIn connections, graph DB makes 'friends of friends' queries fast"

---

## 6. Cassandra Quorum Tuning

### **The Formula**
```
N = Replication Factor (total replicas)
R = Read Quorum (replicas that must respond for read)
W = Write Quorum (replicas that must acknowledge write)

Strong Consistency: R + W > N
Eventual Consistency: R + W <= N
```

### **Common Configurations**
```
ONE (R=1, W=1):
- Fastest, least consistent
- Use for: Analytics, logs

QUORUM (R=N/2+1, W=N/2+1):
- Balanced (most common)
- Use for: General purpose

ALL (R=N, W=N):
- Slowest, most consistent
- Use for: Critical financial data
```

**Interview Answer:**
"For N=3, I'd use R=2, W=2 (QUORUM). This gives strong consistency (2+2 > 3) while tolerating 1 node failure."

---

## 7. Message Queue Semantics

### **At-Most-Once**
```
Send message → Don't wait for ack
```
**Risk:** May lose messages
**Use case:** Metrics, logs (loss acceptable)
**Interview Answer:** "For analytics events, at-most-once is fine—losing 0.1% is acceptable"

### **At-Least-Once**
```
Send message → Retry until ack
```
**Risk:** May duplicate
**Use case:** Most systems (default)
**Interview Answer:** "For email notifications, at-least-once is fine—duplicates are annoying but not critical"

### **Exactly-Once**
```
Send message → Idempotent delivery
```
**Risk:** Slower, complex
**Use case:** Payments, inventory
**Interview Answer:** "For payment processing, exactly-once prevents double-charging"

---

## 8. Partitioning/Sharding

### **Hash Partitioning**
```
shard = hash(user_id) % num_shards
```
**Pros:** Even distribution
**Cons:** Range queries don't work
**Interview Answer:** "For user data, hash by user_id for even load distribution"

### **Range Partitioning**
```
Shard 1: A-M
Shard 2: N-Z
```
**Pros:** Range queries efficient
**Cons:** Hotspots (uneven distribution)
**Interview Answer:** "For time-series data, shard by date range"

### **Geographic Partitioning**
```
US-West, US-East, EU, Asia
```
**Pros:** Low latency (data near users)
**Cons:** Complexity
**Interview Answer:** "For a global app, I'd shard by region to minimize latency"

---

## 9. Replication Patterns

### **Master-Slave (Leader-Follower)**
```
Master (writes) → Replicas (reads)
```
**Pros:** Simple, consistent
**Cons:** Single point of failure (master)
**Interview Answer:** "For typical web app, master-slave with 2-3 read replicas"

### **Master-Master (Multi-Leader)**
```
Master 1 ↔ Master 2
```
**Pros:** No single point of failure
**Cons:** Conflict resolution needed
**Interview Answer:** "For global app, multi-leader per region, but need conflict resolution (last-write-wins)"

### **Leaderless (Cassandra)**
```
All nodes equal, quorum-based
```
**Pros:** High availability
**Cons:** Eventual consistency
**Interview Answer:** "For IoT data, leaderless is great—writes never block"

---

## 10. Interview Question Patterns

### **Pattern 1: Read-Heavy System (Instagram, Twitter)**
**Solution:**
- CDN for static content (images, CSS)
- Redis cache (cache-aside, 90%+ hit ratio)
- Read replicas for database
- Eventual consistency OK

**Interview Answer:**
"For Instagram feed, I'd use CDN for images (95% traffic), Redis for timeline (90% cache hit), and PostgreSQL read replicas. Eventual consistency is fine—users don't notice 1-second delays."

---

### **Pattern 2: Write-Heavy System (Log Aggregation)**
**Solution:**
- Message queue (Kafka) to buffer writes
- Cassandra for high write throughput
- Batch processing
- Eventual consistency OK

**Interview Answer:**
"For logging 100K events/sec, I'd use Kafka to buffer, then write to Cassandra in batches. Cassandra's LSM tree is optimized for writes."

---

### **Pattern 3: Strong Consistency (Payment, Booking)**
**Solution:**
- PostgreSQL with ACID transactions
- Pessimistic locking (SELECT FOR UPDATE)
- Synchronous replication
- 2-phase commit or Saga pattern

**Interview Answer:**
"For payment processing, I need ACID. I'd use PostgreSQL with pessimistic locks to prevent double-charging. For distributed transactions across services, I'd use Saga pattern with compensation logic."

---

### **Pattern 4: Real-Time System (Chat, Notifications)**
**Solution:**
- WebSockets for bidirectional communication
- Message queue (Kafka) for pub/sub
- Redis pub/sub for real-time delivery
- At-least-once semantics OK (slight duplication acceptable)

**Interview Answer:**
"For chat, I'd use WebSockets for connections, Kafka for message persistence, and Redis pub/sub for instant delivery. Messages are stored in Cassandra for history."

---

### **Pattern 5: Global System (Netflix, Spotify)**
**Solution:**
- Multi-region deployment
- Geographic partitioning
- CDN for content delivery
- Eventual consistency (conflict resolution)

**Interview Answer:**
"For global video streaming, I'd use multi-region (US, EU, Asia), CDN for video delivery (95% of traffic), and geo-shard user data. Consistency can be eventual—users don't need real-time sync across regions."

---

## 11. Common Interview Traps

### **Trap 1: "Just add a cache"**
**Wrong:** Caching without strategy
**Right:** Specify cache-aside vs write-through, TTL, eviction policy, invalidation strategy

### **Trap 2: "Use NoSQL for everything"**
**Wrong:** NoSQL without justification
**Right:** Use RDBMS for structured, relational data. Use NoSQL for specific use cases (documents, time-series, etc.)

### **Trap 3: "Scale horizontally"**
**Wrong:** Sharding without considering complexity
**Right:** Scale vertically first (cheaper, simpler), shard only when necessary

### **Trap 4: "Eventual consistency is fine"**
**Wrong:** For payments, inventory, booking
**Right:** Know when strong consistency is required (money, critical data)

---

## 12. Interview Cheat Sheet

| Scenario | Database | Cache | Consistency | Pattern |
|----------|----------|-------|-------------|---------|
| Social Media Feed | MongoDB | Redis (cache-aside) | Eventual | Read-heavy |
| E-commerce Checkout | PostgreSQL | None | Strong (ACID) | Transaction |
| Real-time Chat | Cassandra | Redis (pub/sub) | Eventual | Real-time |
| Analytics Dashboard | ClickHouse | Redis | Eventual | Batch |
| Video Streaming | S3 + CDN | CDN | Eventual | Content delivery |
| Ticket Booking | PostgreSQL | Redis | Strong | Pessimistic lock |
| IoT Sensor Data | Cassandra | None | Eventual | Write-heavy |

---

## 13. How to Approach Interview Questions

### **Step 1: Clarify Requirements (5 min)**
- Scale (users, QPS)
- Latency requirements
- Consistency vs availability tradeoff
- Read vs write ratio

### **Step 2: High-Level Design (10 min)**
- Draw boxes: Client, LB, App, Cache, DB, Queue
- Explain traffic flow
- Identify bottlenecks

### **Step 3: Deep Dive (15 min)**
- Database choice & schema
- Caching strategy
- Consistency model
- Failure scenarios

### **Step 4: Scaling & Tradeoffs (10 min)**
- Bottleneck analysis
- Sharding strategy
- Cost estimation
- CAP tradeoffs

---

## 14. Key Takeaways

✅ **Know your cache strategies** (cache-aside, write-through, write-behind)
✅ **Understand CAP theorem** (CP vs AP)
✅ **Choose right database** (RDBMS vs NoSQL)
✅ **Know when strong consistency matters** (money, inventory)
✅ **Explain tradeoffs clearly** (consistency vs availability vs cost)
✅ **Use message queues for async** (decoupling, buffering)
✅ **Consider failures** (what if DB dies? Payment fails?)
✅ **Estimate costs** (show you understand operational reality)

---

**Practice Questions:**
1. Design TinyURL
2. Design Twitter
3. Design Uber
4. Design Netflix
5. Design TicketMaster (this challenge!)

**Good luck with your interviews!** 🚀
