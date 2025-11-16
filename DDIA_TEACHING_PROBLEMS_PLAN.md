# DDIA Teaching Problems Plan

## Overview
This plan adds **concept-focused teaching problems** alongside the existing 192 real-world system design problems. The goal is to create a progressive learning path from individual DDIA concepts to complex combinations.

## Structure

### Tier 1: Single-Concept Problems (50-60 problems)
Each problem teaches ONE specific DDIA concept in isolation.

### Tier 2: Two-Concept Combinations (30-40 problems)
Problems that combine 2 related concepts.

### Tier 3: Multi-Concept Problems (20-30 problems)
Problems combining 3-4 concepts with moderate complexity.

### Tier 4: Existing Real-World Problems (192 problems - KEEP AS-IS)
Instagram, Twitter, Netflix, etc. - comprehensive system design challenges.

---

## Tier 1: Single-Concept Teaching Problems

### Chapter 1: Reliable, Scalable, and Maintainable Applications

#### 1.1 Reliability Concepts
1. **Single Point of Failure Detection** - Identify and eliminate SPOFs
2. **Fault Tolerance with Redundancy** - Add redundant components
3. **Graceful Degradation** - Handle partial failures
4. **Error Handling Strategies** - Implement retry logic and circuit breakers
5. **Health Checks and Monitoring** - Set up basic health endpoints

#### 1.2 Scalability Concepts
6. **Vertical Scaling** - Scale up resources on a single machine
7. **Horizontal Scaling** - Scale out across multiple machines
8. **Load Distribution** - Distribute requests evenly
9. **Stateless Service Design** - Design services without shared state
10. **Capacity Planning** - Calculate resource requirements

#### 1.3 Maintainability Concepts
11. **Service Decomposition** - Break monolith into services
12. **Configuration Management** - Externalize configuration
13. **Deployment Strategies** - Blue-green, canary deployments
14. **Logging Standards** - Implement structured logging
15. **Metrics Collection** - Set up basic metrics

---

### Chapter 2: Data Models and Query Languages

#### 2.1 Relational Model
16. **Relational Schema Design** - Design normalized tables
17. **Foreign Key Relationships** - Implement joins and relationships
18. **SQL Query Optimization** - Optimize SELECT queries
19. **Indexing Strategies** - Choose appropriate indexes
20. **Denormalization Trade-offs** - When to denormalize

#### 2.2 Document Model
21. **Document Schema Design** - Design MongoDB collections
22. **Embedded vs Referenced Documents** - Choose data modeling approach
23. **Query Patterns in NoSQL** - Optimize for access patterns
24. **Schema Evolution in NoSQL** - Handle schema changes

#### 2.3 Graph Model
25. **Graph Database Basics** - Model relationships in Neo4j
26. **Graph Traversal Queries** - Implement shortest path, recommendations
27. **Property Graphs** - Design node and edge properties

---

### Chapter 3: Storage and Retrieval

#### 3.1 Storage Engines
28. **Log-Structured Storage** - Implement append-only log
29. **LSM Trees** - Understand SSTables and compaction
30. **B-Trees** - Design B-tree index
31. **Hash Indexes** - Implement in-memory hash index

#### 3.2 Data Warehousing
32. **Star Schema Design** - Design fact and dimension tables
33. **Snowflake Schema** - Normalized dimension tables
34. **Columnar Storage** - Optimize for analytical queries
35. **Data Cube / OLAP** - Multi-dimensional analysis

#### 3.3 Column-Oriented Storage
36. **Column Compression** - Implement run-length encoding
37. **Vectorized Processing** - Batch column operations

---

### Chapter 4: Encoding and Evolution

#### 4.1 Data Encoding
38. **JSON vs Binary Encoding** - Compare formats
39. **Protocol Buffers** - Define schema and serialize
40. **Avro Schema Evolution** - Handle schema changes
41. **Backward Compatibility** - Support old clients
42. **Forward Compatibility** - Support new clients

#### 4.2 Modes of Dataflow
43. **REST API Versioning** - Version APIs gracefully
44. **Database Migration Strategies** - Zero-downtime migrations
45. **Message Queue Formats** - Choose message encoding

---

### Chapter 5: Replication

#### 5.1 Single-Leader Replication
46. **Read Replicas** - Set up read-only replicas
47. **Asynchronous Replication** - Implement async writes
48. **Synchronous Replication** - Implement sync writes
49. **Replication Lag** - Handle eventual consistency
50. **Failover Mechanism** - Automatic leader election

#### 5.2 Multi-Leader Replication
51. **Multi-Datacenter Replication** - Replicate across regions
52. **Write Conflicts** - Detect and resolve conflicts
53. **Conflict Resolution Strategies** - Last-write-wins, custom logic
54. **Topology: Circular** - Circular replication topology
55. **Topology: Star** - Star replication topology

#### 5.3 Leaderless Replication
56. **Quorum Reads and Writes** - Implement W + R > N
57. **Dynamo-Style Replication** - Consistent hashing + replication
58. **Sloppy Quorums** - Handle node failures
59. **Hinted Handoff** - Temporary node substitution
60. **Read Repair** - Fix inconsistencies during reads
61. **Anti-Entropy Process** - Background sync between replicas

---

### Chapter 6: Partitioning

#### 6.1 Partitioning Strategies
62. **Hash Partitioning** - Partition by key hash
63. **Range Partitioning** - Partition by key range
64. **Consistent Hashing** - Minimize data movement
65. **Hot Spot Avoidance** - Distribute load evenly
66. **Composite Partitioning Keys** - Multi-column partitioning

#### 6.2 Secondary Indexes
67. **Local Secondary Index** - Partitioned indexes
68. **Global Secondary Index** - Shared index across partitions
69. **Index Maintenance** - Keep indexes in sync

#### 6.3 Rebalancing
70. **Fixed Number of Partitions** - Pre-allocated partitions
71. **Dynamic Partitioning** - Split/merge partitions
72. **Proportional Partitioning** - Partition by node count
73. **Automatic Rebalancing** - Trigger rebalancing logic

---

### Chapter 7: Transactions

#### 7.1 ACID Properties
74. **Atomicity** - All-or-nothing operations
75. **Consistency** - Maintain invariants
76. **Isolation** - Concurrent transaction handling
77. **Durability** - Persist committed data

#### 7.2 Isolation Levels
78. **Read Committed** - Prevent dirty reads
79. **Snapshot Isolation** - Consistent point-in-time reads
80. **Serializable Isolation** - Strictest isolation
81. **Repeatable Read** - Prevent non-repeatable reads

#### 7.3 Concurrency Issues
82. **Dirty Reads** - Read uncommitted data
83. **Dirty Writes** - Overwrite uncommitted data
84. **Read Skew** - Non-repeatable reads
85. **Write Skew** - Concurrent constraint violations
86. **Phantom Reads** - New rows in range queries

#### 7.4 Locking Mechanisms
87. **Two-Phase Locking (2PL)** - Pessimistic concurrency
88. **Optimistic Concurrency Control** - Version-based validation
89. **Deadlock Detection** - Detect and resolve deadlocks

---

### Chapter 8: The Trouble with Distributed Systems

#### 8.1 Network Failures
90. **Network Partitions** - Handle split-brain scenarios
91. **Timeouts and Retries** - Configure retry logic
92. **Circuit Breakers** - Prevent cascading failures
93. **Idempotency** - Make operations repeatable

#### 8.2 Clocks and Time
94. **Time-of-Day Clocks** - Handle clock skew
95. **Monotonic Clocks** - Measure durations
96. **Logical Clocks (Lamport)** - Order events without physical time
97. **Vector Clocks** - Detect causality

#### 8.3 Byzantine Faults
98. **Byzantine Fault Tolerance** - Handle malicious nodes
99. **Merkle Trees** - Verify data integrity

---

### Chapter 9: Consistency and Consensus

#### 9.1 Consistency Models
100. **Linearizability** - Strongest consistency guarantee
101. **Eventual Consistency** - Weak consistency model
102. **Causal Consistency** - Preserve cause-effect order
103. **Read-Your-Writes** - Session consistency
104. **Monotonic Reads** - No going backward in time

#### 9.2 Consensus Algorithms
105. **Paxos Algorithm** - Consensus with fault tolerance
106. **Raft Algorithm** - Understandable consensus
107. **Leader Election** - Elect coordinator
108. **Distributed Locks** - Coordinate exclusive access
109. **Fencing Tokens** - Prevent zombie processes

#### 9.3 Conflict-Free Replicated Data Types (CRDTs)
110. **G-Counter (Grow-Only Counter)** - Distributed counter
111. **PN-Counter** - Increment and decrement
112. **LWW-Register** - Last-write-wins register
113. **OR-Set** - Observed-remove set

---

### Chapter 10: Batch Processing

#### 10.1 MapReduce
114. **Map Function** - Transform input records
115. **Reduce Function** - Aggregate map outputs
116. **Combiner Optimization** - Local aggregation
117. **Distributed Sort** - Sort large datasets
118. **Join Algorithms: Sort-Merge** - Join via sorting
119. **Join Algorithms: Broadcast Hash** - Small-to-large join

#### 10.2 Batch Workflows
120. **Workflow Orchestration** - Chain batch jobs
121. **Dataflow Engines (Spark)** - RDD transformations
122. **Materialization Strategies** - Eager vs lazy evaluation

---

### Chapter 11: Stream Processing

#### 11.1 Messaging Systems
123. **Direct Messaging** - Point-to-point communication
124. **Message Brokers** - Pub/sub with Kafka
125. **Partitioned Logs** - Ordered message storage
126. **Consumer Groups** - Parallel consumption
127. **Offset Management** - Track message processing

#### 11.2 Stream Processing Concepts
128. **Windowing: Tumbling** - Fixed-size time windows
129. **Windowing: Sliding** - Overlapping windows
130. **Windowing: Session** - Activity-based windows
131. **Stream Joins** - Join streams with tables
132. **Event Time vs Processing Time** - Handle late events

#### 11.3 Fault Tolerance in Streams
133. **Exactly-Once Semantics** - Idempotent processing
134. **Checkpointing** - Save stream state
135. **Event Sourcing** - Log all state changes
136. **Change Data Capture (CDC)** - Stream database changes

---

### Chapter 12: The Future of Data Systems

#### 12.1 Data Integration
137. **Lambda Architecture** - Batch + stream layers
138. **Kappa Architecture** - Stream-only processing
139. **Unified Batch and Stream** - Same API for both

#### 12.2 Derived Data
140. **Materialized Views** - Pre-compute query results
141. **Cache Invalidation** - Keep caches in sync
142. **Search Index Maintenance** - Update search indexes

---

## Tier 2: Two-Concept Combinations (40 problems)

### Replication + Partitioning (8 problems)
1. **Read Replicas with Hash Partitioning** - Scale reads on partitioned data
2. **Multi-Leader + Range Partitioning** - Geo-distributed writes
3. **Quorum Reads + Consistent Hashing** - Dynamo-style system
4. **Replication Lag + Secondary Indexes** - Handle index delays
5. **Async Replication + Rebalancing** - Move partitions safely
6. **Leader Election + Partition Migration** - Coordinate during rebalancing
7. **Multi-Datacenter + Composite Keys** - Regional partitioning
8. **Leaderless + Hot Spot Prevention** - Balanced quorum writes

### Caching + Consistency (6 problems)
9. **Read-Through Cache + Eventual Consistency** - Handle stale data
10. **Write-Through Cache + Linearizability** - Strong consistency
11. **Cache Invalidation + CDC** - Invalidate on database changes
12. **Distributed Cache + Causal Consistency** - Preserve causality
13. **Session Cache + Read-Your-Writes** - User session consistency
14. **Multi-Level Cache + Monotonic Reads** - Hierarchical caching

### Transactions + Replication (6 problems)
15. **Snapshot Isolation + Async Replication** - Read from replicas
16. **Serializable + Multi-Leader** - Conflict resolution
17. **2PL + Failover** - Lock management during failures
18. **Optimistic Concurrency + Quorum Writes** - Version validation
19. **Distributed Transactions + Consensus** - Two-phase commit
20. **ACID + Eventual Consistency** - Hybrid approach

### Messaging + Processing (6 problems)
21. **Kafka + Windowing** - Stream aggregation
22. **Consumer Groups + Partitioning** - Parallel stream processing
23. **Event Sourcing + CQRS** - Separate read/write models
24. **CDC + Materialized Views** - Real-time view updates
25. **Message Queue + Idempotency** - Exactly-once delivery
26. **Pub/Sub + Schema Evolution** - Backward compatibility

### Storage + Indexing (6 problems)
27. **LSM Trees + Secondary Indexes** - Write-optimized with indexes
28. **B-Trees + Partitioning** - Range queries on partitions
29. **Columnar Storage + Compression** - Analytical workloads
30. **Document Store + Text Search** - Full-text indexing
31. **Graph DB + Sharding** - Distributed graph queries
32. **Time-Series + Retention Policies** - Aging data

### Batch + Stream (4 problems)
33. **MapReduce + Stream Join** - Combine batch and real-time
34. **Lambda Architecture Implementation** - Batch/speed/serving layers
35. **Kappa Architecture Implementation** - Stream-only data pipeline
36. **Batch Backfill + Stream Processing** - Historical + real-time

### Failure Handling + Consensus (4 problems)
37. **Circuit Breakers + Leader Election** - Automatic failover
38. **Network Partitions + Split-Brain Prevention** - Use fencing tokens
39. **Byzantine Faults + Merkle Trees** - Data integrity
40. **Timeouts + Quorum** - Partial failure handling

---

## Tier 3: Multi-Concept Problems (30 problems)

### 3-Concept Combinations (20 problems)

#### High Availability Systems
1. **Multi-Leader + Partitioning + Conflict Resolution** - Geo-distributed writes
2. **Quorum Writes + Consistent Hashing + Hinted Handoff** - High availability
3. **Read Replicas + Caching + Replication Lag** - Eventually consistent reads
4. **Failover + Leader Election + Fencing Tokens** - Safe failover

#### Transactional Systems
5. **Snapshot Isolation + Partitioning + Global Secondary Index** - Distributed OLTP
6. **Serializable + 2PL + Deadlock Detection** - Strict consistency
7. **Optimistic Concurrency + CRDT + Eventual Consistency** - Conflict-free
8. **Distributed Transactions + 2PC + Consensus** - Coordinated commits

#### Analytics Platforms
9. **Columnar Storage + Partitioning + Compression** - Data warehouse
10. **Star Schema + Materialized Views + Batch Jobs** - OLAP system
11. **Lambda Architecture + MapReduce + Streaming** - Hybrid analytics
12. **CDC + Stream Processing + Materialized Views** - Real-time analytics

#### Messaging & Streaming
13. **Kafka + Partitioning + Consumer Groups** - Scalable messaging
14. **Event Sourcing + CQRS + Snapshots** - Event-driven architecture
15. **Stream Join + Windowing + Late Event Handling** - Complex stream processing
16. **Exactly-Once + Idempotency + Checkpointing** - Reliable streaming

#### Search & Indexing
17. **Full-Text Search + Sharding + Replication** - Distributed search
18. **Document Store + Secondary Indexes + Caching** - Fast document retrieval
19. **Graph DB + Partitioning + Replication** - Scalable graph queries
20. **Geo-Spatial Index + Range Partitioning + Caching** - Location services

### 4-Concept Combinations (10 problems)

#### Complex Distributed Systems
21. **Multi-Leader + Partitioning + Conflict Resolution + CDC** - Global database
22. **Quorum + Consistent Hashing + Hinted Handoff + Anti-Entropy** - Dynamo clone
23. **Read Replicas + Partitioning + Caching + Replication Lag** - Scalable reads
24. **Kafka + Partitioning + Consumer Groups + Exactly-Once** - Reliable messaging

#### Hybrid Workloads
25. **OLTP + OLAP + Columnar Storage + Materialized Views** - HTAP database
26. **Batch + Stream + Lambda Architecture + Materialized Views** - Complete pipeline
27. **Event Sourcing + CQRS + Snapshots + CDC** - Full event-driven system
28. **Document Store + Graph Queries + Full-Text Search + Sharding** - Multi-model DB

#### Mission-Critical Systems
29. **Serializable + Partitioning + Replication + Consensus** - Strongly consistent distributed DB
30. **Multi-Datacenter + Leader Election + Fencing + Network Partitions** - Global coordination

---

## Tier 4: Existing Real-World Problems (192 - KEEP AS-IS)
- Instagram, Twitter, Netflix, Spotify, etc.
- These combine 5-10+ concepts in realistic scenarios
- Already covers comprehensive system design

---

## Summary

| Tier | Focus | Count | Total |
|------|-------|-------|-------|
| Tier 1 | Single concepts | 142 | 142 |
| Tier 2 | 2-concept combos | 40 | 182 |
| Tier 3 | 3-4 concept combos | 30 | 212 |
| **NEW TOTAL** | | | **212 new teaching problems** |
| Tier 4 (existing) | Real-world systems | 192 | 192 |
| **GRAND TOTAL** | | | **404 problems** |

---

## Progressive Learning Path

1. **Beginner**: Start with Tier 1 single-concept problems (Ch 1-3)
2. **Intermediate**: Move to Tier 2 two-concept combinations
3. **Advanced**: Tackle Tier 3 multi-concept problems
4. **Expert**: Solve Tier 4 real-world system design problems
5. **Mastery**: Combine concepts creatively in custom designs

---

## Implementation Priority

### Phase 1: Core Concepts (50 problems)
- Replication (15)
- Partitioning (12)
- Transactions (15)
- Consensus (8)

### Phase 2: Data Systems (40 problems)
- Storage engines (10)
- Data models (12)
- Encoding (8)
- Batch processing (10)

### Phase 3: Streaming & Advanced (52 problems)
- Stream processing (15)
- Messaging (12)
- Distributed systems issues (15)
- Future concepts (10)

### Phase 4: Combinations (70 problems)
- Tier 2 two-concept (40)
- Tier 3 multi-concept (30)

---

## Next Steps

1. ✅ Review and approve this plan
2. ⬜ Create problem templates for Tier 1
3. ⬜ Implement Phase 1 (50 core concept problems)
4. ⬜ Test and validate teaching effectiveness
5. ⬜ Continue with Phases 2-4
