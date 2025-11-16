# TRAFFIC SIMULATOR ANALYSIS: COMPLETENESS & UNIVERSAL APPLICABILITY

## EXECUTIVE SUMMARY

The traffic simulator is **well-designed for system design education** but **NOT fully universal** for arbitrary system architectures. It succeeds in teaching core concepts (caching, replication, load balancing) but has significant gaps in advanced patterns and non-traditional topologies.

**Verdict**: ~70% complete for typical web systems, ~40% complete for complex distributed patterns.

---

## 1. COMPONENT CONFIGURABILITY

### What's Configurable ✅

**Per-Component Configuration**:
- **AppServer**: instances, instanceType (t3.medium → t3.2xlarge with real AWS specs)
- **RedisCache**: instanceType, TTL, hitRatio, evictionPolicy, persistence mode (RDB/AOF)
- **PostgreSQL**: instanceType, replication (boolean or {enabled, replicas, mode}), isolationLevel, storageType/size
- **MongoDB**: readCapacity, writeCapacity, sharded (boolean), numShards, replicationFactor, consistencyLevel, indexingEnabled
- **Cassandra**: readCapacity, writeCapacity, numNodes, replicationFactor, readQuorum, writeQuorum, bloomFilterEnabled, compactionEnabled
- **MessageQueue**: numBrokers, numPartitions, replicationFactor, retentionHours, semantics (at_most_once/at_least_once/exactly_once), orderingGuarantee, consumerGroups, batchingEnabled, compressionEnabled
- **LoadBalancer**: Currently hardcoded (no config), always 100k RPS capacity
- **Worker**: instances, throughput, behavior (simple_write, validate_and_write, etc.), customLogic support

### What's NOT Configurable ❌

1. **RPS Limits Per Component**: 
   - Fixed capacity values hardcoded in instances (e.g., RedisCache always 10K RPS per GB)
   - No ability to set custom throughput curves
   - No weighted distribution patterns

2. **Latency Configuration**:
   - Base latencies hardcoded (e.g., Redis=1ms, PostgreSQL read=5ms, write=50ms)
   - No percentile latency configuration (only M/M/1 queueing model)
   - Cannot specify custom latency functions

3. **Cost Models**:
   - Hardcoded AWS pricing
   - No custom cost functions
   - No discounts for reserved instances

4. **Component-Level SLAs**:
   - No per-component error rate SLOs
   - No timeout configuration
   - Cannot set component-specific reliability targets

### Gap Analysis

```typescript
// What you CAN'T do:
const customComponent = {
  capacity: Math.floor(rps / (1 + rps/1000)),  // Custom throughput curve
  latency: rps > threshold ? exponential : linear,  // Custom latency model
  costFunction: (rps) => base + (rps * variable),  // Custom cost
  errorRateTarget: 0.0001,  // Per-component SLO
};

// What you CAN do:
const redisConfig = {
  instanceType: 'cache.r6g.xlarge',
  hitRatio: 0.95,
  ttl: 7200,
};
```

**Verdict**: Basic configurability exists but lacks true universality. Would need to add:
- Custom capacity curves per component
- Pluggable latency/error rate models
- Custom cost functions
- Per-component SLAs

---

## 2. GRAPH TOPOLOGY SUPPORT

### Supported Topologies ✅

**Basic Topologies**:
- Linear: Client → LB → AppServer → Cache → DB
- Fan-out: LB → multiple AppServers → single DB
- Read/Write paths: Different paths for read vs write traffic

**Connection Types** (current):
```typescript
type ConnectionType = 'read' | 'write' | 'read_write';
```
- Supports asymmetric paths (reads via cache, writes to DB)
- Respects connection type when traversing

**Multiple Entry/Exit Points**:
- Can have multiple app servers
- Can have multiple databases
- Can have CDN/S3 nodes in parallel

### NOT Supported ❌

1. **Cycles in Graph**:
   ```typescript
   // TrafficFlowEngine explicitly prevents cycles:
   if (visited.has(currentNodeId)) {
     return;  // Stop traversal
   }
   visited.add(currentNodeId);
   ```
   - Circuit breaker: BLOCKED
   - Service mesh with observability loops: BLOCKED
   - Cache invalidation feedback: BLOCKED

2. **Multiple Databases per System**:
   ```typescript
   // engine.ts lines 266-269
   const dbId = this.findNodeIdByType('database') ||
     this.findNodeIdByType('postgresql') ||
     this.findNodeIdByType('mongodb') ||
     this.findNodeIdByType('cassandra');
   // ↑ Uses FIRST found database
   ```
   - Only simulates traffic to ONE database
   - Would need sharded topology to have multiple DBs

3. **Conditional Routing**:
   - All requests follow deterministic paths
   - No weighted routing (e.g., 80% to shard A, 20% to shard B)
   - Cannot simulate A/B testing or canary deployments

4. **Bidirectional Traffic**:
   - Connections are one-directional
   - Cannot model peer-to-peer systems
   - Cannot model service-to-service communication patterns

5. **Message Propagation Patterns**:
   - Pub/Sub systems unsupported
   - No fan-out messaging
   - Kafka as async processing supported, but not as pub/sub backbone

6. **Complex Dependency Graphs**:
   - No support for directed acyclic graphs (DAGs)
   - Cannot model data pipelines
   - No support for map-reduce topologies

### Gap Analysis

```typescript
// What you CAN'T do:
const complexTopology = {
  components: [
    // Circuit breaker that feeds back to itself
    { id: 'cb', type: 'circuit_breaker' },
    // Conditional routing based on request type
    { id: 'router', type: 'router' },
    // Multiple read replicas in different regions
    { id: 'db_replica_us', type: 'postgresql' },
    { id: 'db_replica_eu', type: 'postgresql' },
    // Pub/Sub broadcast
    { id: 'event_bus', type: 'pubsub' },
  ],
  connections: [
    // Conditional edge
    { from: 'router', to: 'api1', type: 'read', condition: 'api1Handlers' },
    { from: 'router', to: 'api2', type: 'read', condition: 'api2Handlers' },
    // Feedback loop
    { from: 'service', to: 'cb', type: 'read_write' },
    { from: 'cb', to: 'service', type: 'read_write' }, // BLOCKED!
  ],
};

// What you CAN do:
const simpleTopology = {
  // Linear topology with optional cache
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'cache', type: 'read' },
    { from: 'cache', to: 'db', type: 'read' },
    { from: 'app', to: 'db', type: 'write' },
  ],
};
```

**Verdict**: Works for ~60% of topologies. Missing cycles, conditional routing, and multi-path scenarios.

---

## 3. CONNECTION TYPES & ASYNC PATTERNS

### Supported Connection Types

```typescript
type ConnectionType = 'read' | 'write' | 'read_write';
```

- **Sufficient for**: Traditional request-response systems
- **Limitations**:
  - No semantic information beyond read/write
  - No async/queue semantics encoded in edge type
  - Cannot distinguish sync vs async connections

### Async Patterns

**What's Supported**:
- MessageQueue component models Kafka/RabbitMQ
  - Supports delivery semantics: at_most_once, at_least_once, exactly_once
  - Supports ordering guarantees: global, partition, none
  - Models consumer groups and parallelism
- Worker component processes async tasks
  - Configurable throughput per instance
  - Custom behavior support (validation, transformation, external APIs)

**What's NOT Supported**:
```
❌ Message acknowledgment patterns
❌ Dead letter queues (DLQ)
❌ Circuit breakers in message processing
❌ Message correlation/causality
❌ Priority queues
❌ Time-based retries or exponential backoff
❌ Saga pattern for distributed transactions
```

### Bidirectional Flows

**Current Model**: One-directional edges only
- Cannot model: Request-response where service responds
- Cannot model: Pull-based consumers subscribing to publishers
- Cannot model: Request queuing where requester polls for response

**Would Need**:
```typescript
interface BidirectionalConnection {
  from: string;
  to: string;
  requestType: 'read' | 'write' | 'read_write';
  responseType: 'read' | 'write' | 'read_write' | 'none';
  async: boolean;
  propagationDelay?: number;
}
```

**Verdict**: Basic async supported, but incomplete. Missing DLQ, saga patterns, bidirectional semantics.

---

## 4. MISSING DISTRIBUTED PATTERNS

### What's Implemented ✅

**Database Patterns**:
- ✅ Replication (master-slave async, master-slave sync)
- ✅ Consistency levels (strong, eventual, causal, read_your_writes, bounded_staleness)
- ⚠️ Sharding (MongoDB only, basic num_shards parameter)

**Cache Patterns**:
- ✅ Cache-aside
- ✅ Read-through
- ✅ Write-through
- ✅ Write-behind (write-back)
- ✅ Write-around

**Reliability Patterns**:
- ⚠️ Load balancing (round-robin only, no weighted/least-connections)
- ✅ Failure injection (db_crash, cache_flush, network_partition)
- ❌ Circuit breaker
- ❌ Bulkhead/isolation
- ❌ Retry with exponential backoff
- ❌ Timeouts

### What's Missing ❌

**Sharding/Partitioning**:
```
❌ Consistent hashing (only PostgreSQL/MySQL get no sharding)
❌ Range-based partitioning
❌ Directory-based partitioning
❌ Geo-partitioning
❌ Hot shard detection
❌ Shard rebalancing
```

**Replication Issues**:
```
❌ Read replicas (PostgreSQL has replication flag, but not used in simulation)
❌ Lag/staleness measurement
❌ Replication lag-induced consistency violations
❌ Replica failover scenarios
❌ Replication topology (ring, star, hierarchy)
```

**Service Mesh / Observability**:
```
❌ Service discovery (hardcoded graph)
❌ Circuit breaker per service
❌ Distributed tracing
❌ Metrics collection patterns
❌ Health checks / liveness probes
❌ Istio/Envoy proxy layers
```

**Multi-Region Deployments**:
```
❌ Region-aware routing
❌ Cross-region replication
❌ Write conflicts (multi-master)
❌ Eventual consistency conflicts
❌ Latency modeling for inter-region calls
❌ Region failover
```

**Advanced Patterns**:
```
❌ CQRS (Command Query Responsibility Segregation)
❌ Event sourcing
❌ Two-phase commit (2PC)
❌ Saga pattern for distributed transactions
❌ Compensation/rollback
❌ Consensus algorithms (Raft, Paxos)
❌ Vector clocks / Lamport clocks
❌ Bloom filters (Cassandra has it, others don't)
```

**Detailed Failure Modes**:
```
❌ Partial failures (some replicas down)
❌ Byzantine failures
❌ Network partitions with split-brain
❌ Cascading failures
❌ Thundering herd
❌ Slow-client amplification
```

### Gap Analysis

**What Systems WOULD Work**:
- Traditional 3-tier web apps (LB → App → Cache → DB)
- Read-heavy systems (Instagram-style)
- Write-heavy with queueing (event processing)
- Simple microservices (single LB → multiple services)

**What Systems WOULD NOT Work**:
- Multi-region distributed systems
- Sharded databases with cross-shard joins
- Service mesh architectures
- Event-driven systems with multiple producers/consumers
- Financial systems requiring 2PC
- Peer-to-peer or gossip-based systems
- Systems with circuit breaker patterns
- High-frequency trading systems
- Distributed consensus (Raft, Paxos)

**Verdict**: ~40% of advanced patterns implemented. Missing critical reliability patterns (circuit breaker, retries) and advanced consistency patterns (2PC, saga, consensus).

---

## 5. REQUEST TYPES & CUSTOMIZATION

### Current Request Types

```typescript
type RequestType = 'read' | 'write';
```

**Only Two Types**: Read vs Write

### What's NOT Supported

```typescript
// Missing request types:
type AdvancedRequestType = 
  | 'read'
  | 'write'
  | 'read_after_write'      // ❌ Session consistency requirement
  | 'transaction'           // ❌ Multi-step transaction
  | 'count'                 // ❌ Analytical query
  | 'scan'                  // ❌ Full-table scan
  | 'search'                // ❌ Full-text search
  | 'aggregate'             // ❌ Analytics operation
  | 'delete'                // ❌ Separate from write
  | 'compare_and_swap'      // ❌ Atomic operations
  | 'list'                  // ❌ Listing/pagination
  | 'stream'                // ❌ Streaming operations
  | 'long_poll';            // ❌ Long-polling

// Missing request attributes:
interface AdvancedRequest {
  id: string;
  type: RequestType;
  
  // Missing:
  priority?: 'high' | 'normal' | 'low';        // ❌
  slo?: { maxLatencyMs: number };               // ❌
  consistencyRequirement?: ConsistencyLevel;    // ❌
  isolationLevel?: IsolationLevel;              // ❌
  timeout?: number;                             // ❌
  retries?: number;                             // ❌
  deadline?: number;                            // ❌
  correlationId?: string;                       // ❌
  tags?: Record<string, string>;                // ❌
}
```

### Request Size Handling

**What Works**:
- Optional `sizeMB` parameter on Request
- CDN/S3 use it to calculate data transfer costs
- App/DB don't use it (assume uniform size)

**What's Missing**:
- No differentiated latency for different sizes
- No bandwidth throttling
- No request rate limiting by size
- No network congestion modeling

### Simulating Different Workloads

**What You Can Control**:
```typescript
const testCase = {
  traffic: {
    type: 'read' | 'write' | 'mixed',
    rps: number,
    readRatio: number,
    readRps?: number,
    writeRps?: number,
    avgResponseSizeMB?: number,
  },
};
```

**What You CAN'T Simulate**:
- Skewed workloads (80% of reads go to 20% of data)
- Bursty traffic (random vs predictable spikes)
- Time-of-day patterns
- User cohorts with different access patterns
- Request ordering/causality requirements
- SLO-based routing
- Request prioritization

**Verdict**: Only read/write distinction. No support for request priorities, SLAs, custom types, or workload characteristics.

---

## 6. CRITICAL LIMITATIONS & HARDCODED ASSUMPTIONS

### Hardcoded Limits

1. **Maximum Simulation Size**:
   ```typescript
   // trafficFlowEngine.ts line 99
   const sampleSize = Math.min(1000, totalRps * 10);  // Max 1000 requests simulated
   ```
   - Real systems may process millions of requests
   - Only samples 1000 requests, extrapolates from sample

2. **Single Entry Point Assumption**:
   ```typescript
   // engine.ts lines 247-250
   const entryId = 
     this.findNodeIdByType('client') ||
     this.findNodeIdByType('load_balancer') ||
     this.findNodeIdByType('app_server');
   // Assumes ONE entry point
   ```

3. **Single Database Assumption**:
   ```typescript
   // engine.ts line 266
   const dbId = this.findNodeIdByType('database');
   // Uses FIRST database found, ignores others
   ```

4. **Load Balancer Always Round-Robin**:
   ```typescript
   // LoadBalancer.ts - hardcoded 100k capacity, 1ms latency, no algorithm config
   // No support for: least_connections, least_response_time, weighted, etc.
   ```

5. **Component Type Switching**:
   ```typescript
   // engine.ts lines 42-79 - switch statement
   // Only 12 known types: client, lb, app, worker, db, postgresql, 
   // mongodb, cassandra, redis, message_queue, cdn, s3
   // Cannot add custom types
   ```

6. **Queueing Model**:
   ```typescript
   // Component.ts - M/M/1 queueing model hardcoded
   // Assumes:
   // - Exponential inter-arrival times
   // - Exponential service times
   // - Single queue
   // - FIFO ordering
   ```

### Assumptions That Might Be Wrong

| Assumption | Reality | Impact |
|-----------|---------|--------|
| Read latency = 5ms (PostgreSQL) | Could be 1-100ms depending on data | ±2x error |
| Write latency = 50ms (PostgreSQL) | With WAL, could be 10-200ms | ±5x error |
| Cache hit ratio = configurable | Depends on workload, time of day, size | High variance |
| Error rate starts at 0.95 utilization | Could start at 0.8 or 0.99 | Component-specific |
| Network partition = instant | Has gradual degradation | Wrong failure model |
| Replication is instant | Has 10-1000ms lag | Wrong latency |
| Cost = instance type only | Missing: data transfer, storage growth | ±30% error |

### Systems That Would Break

```
❌ Multi-region systems (no cross-region latency)
❌ Distributed ledgers (no consensus)
❌ Real-time systems (no precisely-timed events)
❌ Graph databases (no traversal simulation)
❌ Search systems (no index or query complexity)
❌ Time-series databases (no time-based aggregation)
❌ Document stores with joins (no relationship modeling)
❌ Stream processing (no event ordering)
❌ Blockchain/consensus systems (no agreement protocol)
❌ Machine learning pipelines (no model inference cost)
```

---

## 7. WHAT'S NEEDED FOR COMPLETENESS

### Priority 1: Core Reliability (High Impact, Achievable)

```typescript
// 1. Circuit Breaker Pattern
interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  halfOpenRequests: number;
}

// 2. Retry Strategies
interface RetryConfig {
  maxAttempts: number;
  backoffStrategy: 'exponential' | 'linear' | 'fibonacci';
  initialDelayMs: number;
  maxDelayMs: number;
  jitterEnabled: boolean;
}

// 3. Bulkhead/Isolation
interface BulkheadConfig {
  threadPoolSize: number;
  queueSize: number;
  rejectionPolicy: 'fail_fast' | 'queue' | 'discard_oldest';
}

// 4. Timeout Enforcement
interface TimeoutConfig {
  requestTimeoutMs: number;
  connectionTimeoutMs: number;
}
```

### Priority 2: Advanced Sharding (High Impact, Medium Complexity)

```typescript
// Support multiple databases with consistent hashing
interface ShardingConfig {
  strategy: 'hash' | 'range' | 'directory' | 'geo';
  numShards: number;
  virtualNodes: number;  // for consistent hashing
  replicationFactor: number;
}

// Simulate traffic distribution across shards
simulateWithSharding(totalRps: number, shardingConfig: ShardingConfig) {
  // Distribute RPS according to sharding strategy
  // Model hot shard scenarios
  // Simulate shard rebalancing
}
```

### Priority 3: Conditional Routing (Medium Impact, Medium Complexity)

```typescript
// Route requests based on predicates
interface ConditionalEdge {
  from: string;
  to: string;
  condition: (request: Request) => boolean;  // Custom routing logic
  weight: number;  // If multiple edges match
}

// Example: Route based on user tier
{
  condition: (req) => req.userId % 100 < 20,  // 20% of users
  to: 'premium_db_cluster'
}
```

### Priority 4: Multi-Region Support (High Impact, High Complexity)

```typescript
interface RegionalComponent {
  region: string;
  latency: number;  // inter-region latency
  capacity: number;
  failureProbability: number;
}

// Simulate:
// - Cross-region replication lag
// - Write conflicts (multi-master)
// - Region failover
// - Cross-region consistency
```

### Priority 5: Advanced Consistency Models (Medium Impact, High Complexity)

```typescript
// Currently: eventual, strong, causal, read_your_writes, bounded_staleness
// Add:
// - Transactions (ACID)
// - Two-phase commit (2PC) with latency penalty
// - Saga pattern with compensation
// - Lamport clocks for causality tracking
// - Vector clocks for conflict detection
```

---

## SYSTEMS COVERAGE ANALYSIS

### Systems That Work Well (70-100% Support)

✅ **Tiny URL** - Simple read-heavy, single cache + DB  
✅ **Twitter Feed** - Distributed reads with caching  
✅ **Instagram** - Photo feed, eventual consistency OK  
✅ **Pastebin** - Simple CRUD + storage  
✅ **Netflix** - CDN + caching heavy  
✅ **Message Processing** - Queue + worker model  
✅ **Hotel Booking** - Basic ACID DB operations  
✅ **E-commerce Search** - Full-text search + cache  

### Systems That Partially Work (40-70% Support)

⚠️ **Uber** - Multi-region coordination needed  
⚠️ **Slack** - Real-time messaging, presence tracking  
⚠️ **Dropbox** - Multi-region sync, versioning  
⚠️ **Google Maps** - Geo-sharding, complex routing  
⚠️ **YouTube** - Multi-region streaming, sharded  
⚠️ **Discord** - Real-time with sharding  
⚠️ **Stripe** - Financial, needs 2PC/saga  

### Systems That Don't Work (<40% Support)

❌ **Distributed Consensus** - Raft, Paxos, PBFT  
❌ **Blockchain** - Proof-of-work, Byzantine consensus  
❌ **Real-time Bidding** - Sub-millisecond latency  
❌ **High-Frequency Trading** - Precise timing  
❌ **Peer-to-Peer Networks** - DHT, gossip protocols  
❌ **Machine Learning Platform** - Model serving, inference  
❌ **Distributed SQL** - Cross-shard joins, 2PC  
❌ **Stream Processing** - Kafka topology, state management  

---

## FINAL VERDICT

### Strengths ✅

1. **Clean Architecture**: Well-organized component hierarchy
2. **Real AWS Specs**: Uses actual instance types and pricing
3. **Educational Value**: Great for teaching caching/replication
4. **Extensibility**: Easy to add new components
5. **Failure Injection**: Can simulate db_crash, cache_flush
6. **Cache Strategies**: Supports 5 different cache patterns

### Weaknesses ❌

1. **No Cycles**: Blocks feedback loops and circuit breakers
2. **Single Database**: Can't model sharded/multi-DB systems properly
3. **No Reliability Patterns**: Missing retries, circuit breaker, bulkheads
4. **Read/Write Only**: No request priorities, types, or SLAs
5. **Hardcoded Routing**: Only round-robin load balancing
6. **No Multi-Region**: Can't simulate cross-region latency/consistency
7. **Limited Failure Modes**: Only 3 types, no partial/cascading failures
8. **Sample-Based**: Only simulates 1000 requests, scales up

### Who Should Use It

✅ System design interviews (simple to medium difficulty)  
✅ Teaching distributed systems fundamentals  
✅ Prototyping basic architectures  
✅ Testing cache strategies  

### Who Should NOT Use It

❌ Complex distributed systems  
❌ Sharded/partitioned systems  
❌ Multi-region deployments  
❌ Real-time systems  
❌ Systems requiring consensus  
❌ Production capacity planning  
❌ High-fidelity performance modeling  

---

## RECOMMENDATIONS

### For Current Codebase (Easy Wins)

1. **Add Circuit Breaker Support** (~4 hours)
   - New component type: CircuitBreaker
   - Track failure rate, trip on threshold
   - Add half-open state

2. **Enable Multiple Databases** (~3 hours)
   - Change single-DB assumption in engine
   - Route reads/writes by predicate
   - Simulate sharding

3. **Add Request Priorities** (~2 hours)
   - New request attribute: priority
   - Queue prioritization in LoadBalancer
   - Separate SLA per priority

4. **Improve Load Balancing** (~2 hours)
   - Add algorithm config: least_connections, weighted
   - Track per-server metrics
   - Update documentation

### For Full Completeness (~40 hours)

1. **Retry & Timeout Support** (8 hours)
   - Exponential backoff per component
   - Request-level timeout enforcement
   - Success rate calculation

2. **Multi-Region Framework** (12 hours)
   - Region-aware components
   - Cross-region latency modeling
   - Read replica simulation
   - Eventual consistency conflicts

3. **Conditional Routing** (6 hours)
   - Predicate-based edges
   - Weighted routing
   - Request-dependent paths

4. **Advanced Sharding** (8 hours)
   - Consistent hashing
   - Virtual nodes
   - Hot shard detection
   - Rebalancing simulation

5. **Enhanced Failure Modes** (6 hours)
   - Partial failures (some replicas down)
   - Cascading failures
   - Network partition with partition tolerance
   - Byzantine failures

### Testing the Enhanced System

```typescript
// Test multi-region system
const multiRegion = {
  components: [
    { id: 'lb-us', type: 'load_balancer', region: 'us-east-1' },
    { id: 'db-us', type: 'postgresql', region: 'us-east-1' },
    { id: 'db-eu', type: 'postgresql', region: 'eu-west-1' },
  ],
};

// Test sharded system
const sharded = {
  components: [
    { id: 'shard-0', type: 'postgresql', shardKey: '0-333' },
    { id: 'shard-1', type: 'postgresql', shardKey: '334-666' },
    { id: 'shard-2', type: 'postgresql', shardKey: '667-999' },
  ],
};

// Test with circuit breaker
const resilient = {
  components: [
    { id: 'cb', type: 'circuit_breaker', failureThreshold: 0.5 },
    { id: 'api', type: 'app_server' },
  ],
};
```

---

## CONCLUSION

The traffic simulator is **purpose-built for system design education** and excels at that mission. However, it is **not a general-purpose distributed systems simulator**. It makes too many simplifying assumptions and is missing critical patterns.

**Use it for**: Learning cache strategies, understanding replication, practicing system design interviews  
**Don't use it for**: Production planning, complex distributed systems, multi-region strategies  

**Completeness Score**: 
- Basic Systems: **75%**
- Intermediate Systems: **50%**
- Advanced Systems: **25%**

**Estimated effort to 90% completeness**: **40-50 hours of development**

