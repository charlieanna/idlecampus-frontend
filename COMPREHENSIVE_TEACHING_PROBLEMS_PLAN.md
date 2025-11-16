# Comprehensive Teaching Problems Plan

## Overview
Create teaching problems for **ALL** concepts from:
1. **DDIA Book** (all 12 chapters)
2. **System Design Primer** (github.com/donnemartin/system-design-primer)

Total estimated: **200+ concept-focused teaching problems**

---

## Part 1: DDIA Book - All Chapters (142 problems)

### Chapter 1: Reliability, Scalability, Maintainability (15 problems)

#### Reliability (5)
1. **Single Point of Failure** - Identify and eliminate SPOFs
2. **Hardware Faults** - Handle disk failures, server crashes
3. **Software Errors** - Handle bugs, cascading failures
4. **Human Errors** - Design for operator mistakes
5. **Chaos Engineering** - Test fault tolerance with chaos monkey

#### Scalability (5)
6. **Vertical Scaling** - Scale up a single server
7. **Horizontal Scaling** - Add more servers
8. **Load Parameters** - Identify and measure load (RPS, active users)
9. **Performance Metrics** - Measure latency percentiles (p50, p95, p99)
10. **Fan-out Problem** - Handle Twitter-like fan-out on writes

#### Maintainability (5)
11. **Operability** - Design for easy operations (monitoring, deployment)
12. **Simplicity** - Avoid accidental complexity
13. **Evolvability** - Design for change
14. **Observability** - Implement logging, metrics, tracing
15. **Technical Debt** - Manage and reduce technical debt

---

### Chapter 2: Data Models & Query Languages (12 problems)

#### Relational Model (4)
16. **Relational Schema Design** - Normalize to 3NF ✅ (already created)
17. **Foreign Keys & Joins** - Design relationships ✅
18. **SQL Query Optimization** - Optimize SELECT queries ✅
19. **Indexing Strategies** - B-tree indexes ✅

#### Document Model (4)
20. **Document Schema** - Design MongoDB collections ✅
21. **Embedded vs Referenced** - Choose data modeling ✅
22. **Schema-on-Read** - Handle flexible schemas
23. **JSON/BSON Storage** - Store semi-structured data

#### Graph Model (4)
24. **Graph Database Basics** - Neo4j nodes and edges ✅
25. **Graph Traversal** - Shortest path, recommendations ✅
26. **Property Graphs** - Design properties ✅
27. **Cypher/Gremlin Queries** - Query graph databases

---

### Chapter 3: Storage & Retrieval (10 problems)

#### Log-Structured Storage (3)
28. **Append-Only Log** - Implement write-ahead log ✅
29. **LSM Trees** - SSTables and compaction ✅
30. **Bloom Filters** - Optimize read performance

#### Page-Oriented Storage (3)
31. **B-Trees** - Design B-tree index ✅
32. **Write-Ahead Log (WAL)** - Crash recovery ✅
33. **Copy-on-Write** - MVCC implementation

#### Data Warehousing (4)
34. **Star Schema** - Fact and dimension tables ✅
35. **Snowflake Schema** - Normalized dimensions ✅
36. **Columnar Storage** - Column-oriented databases ✅
37. **Materialized Views** - Pre-compute aggregations ✅

---

### Chapter 4: Encoding & Evolution (8 problems)

#### Data Encoding (4)
38. **JSON Encoding** - Pros/cons ✅
39. **Binary Encoding** - Protocol Buffers ✅
40. **Avro Schema** - Self-describing schemas ✅
41. **Thrift** - Cross-language serialization

#### Schema Evolution (4)
42. **Forward Compatibility** - New code reads old data ✅
43. **Backward Compatibility** - Old code reads new data ✅
44. **Schema Versioning** - Manage multiple schema versions
45. **Migration Strategies** - Zero-downtime migrations ✅

---

### Chapter 5: Replication (16 problems) ✅ COMPLETED
46-61. All replication problems already implemented

---

### Chapter 6: Partitioning (12 problems) ✅ COMPLETED
62-73. All partitioning problems already implemented

---

### Chapter 7: Transactions (16 problems) ✅ COMPLETED
74-89. All transaction problems already implemented

---

### Chapter 8: Distributed Systems Troubles (15 problems)

#### Network Issues (5)
90. **Network Partitions** - Handle split-brain ✅ (already created)
91. **Timeouts** - Configure retry logic ✅
92. **Circuit Breakers** - Prevent cascading failures ✅
93. **Idempotency** - Make operations repeatable ✅
94. **TCP vs UDP** - Choose transport protocol

#### Time and Clocks (5)
95. **Time-of-Day Clocks** - Handle clock skew ✅
96. **Monotonic Clocks** - Measure durations ✅
97. **Lamport Timestamps** - Logical clocks ✅
98. **Vector Clocks** - Track causality ✅
99. **NTP Synchronization** - Sync clocks across nodes

#### Byzantine Faults (5)
100. **Byzantine Fault Tolerance** - Handle malicious nodes ✅
101. **Merkle Trees** - Verify data integrity ✅
102. **Digital Signatures** - Authenticate messages
103. **Consensus with Byzantine Faults** - PBFT algorithm
104. **Blockchain Basics** - Proof-of-work consensus

---

### Chapter 9: Consistency & Consensus (14 problems) ✅ COMPLETED
105-118. All consensus problems already implemented

---

### Chapter 10: Batch Processing (10 problems)

#### MapReduce (5)
119. **Map Function** - Transform records ✅ (in gap problems)
120. **Reduce Function** - Aggregate data ✅
121. **Combiner** - Local aggregation ✅
122. **Distributed Sort** - Sort large datasets ✅
123. **Join Algorithms** - Sort-merge join, broadcast hash join ✅

#### Dataflow Engines (5)
124. **Spark RDDs** - Resilient distributed datasets
125. **DAG Execution** - Directed acyclic graph of operations
126. **Lazy Evaluation** - Optimize before execution
127. **Caching Intermediate Results** - Avoid recomputation
128. **Fault Tolerance** - Lineage-based recovery

---

### Chapter 11: Stream Processing (15 problems)

#### Messaging Systems (5)
129. **Message Brokers** - Kafka/RabbitMQ ✅ (basics covered)
130. **Pub/Sub** - Topic-based routing
131. **Partitioned Logs** - Ordered message storage ✅
132. **Consumer Groups** - Parallel consumption ✅
133. **Offset Management** - Track progress ✅

#### Stream Processing (5)
134. **Tumbling Windows** - Fixed-size windows ✅ (in gap problems)
135. **Sliding Windows** - Overlapping windows ✅
136. **Session Windows** - Activity-based windows ✅
137. **Event Time vs Processing Time** - Handle late events ✅
138. **Watermarks** - Track event time progress

#### Stream Operations (5)
139. **Stream Joins** - Join streams with tables ✅
140. **Stream Aggregations** - Count, sum, average in windows
141. **Stream-Table Duality** - Changelog streams
142. **Exactly-Once Semantics** - Idempotent processing ✅
143. **Checkpointing** - Save stream state ✅

---

### Chapter 12: Future of Data Systems (8 problems)

#### Data Integration (4)
144. **Lambda Architecture** - Batch + speed layers ✅ (in gap problems)
145. **Kappa Architecture** - Stream-only processing ✅
146. **Change Data Capture (CDC)** - Stream DB changes ✅
147. **Event Sourcing** - Log all state changes ✅

#### Derived Data (4)
148. **Materialized Views** - Pre-compute results ✅
149. **Cache Invalidation** - Keep caches in sync ✅
150. **Search Index Maintenance** - Update Elasticsearch ✅
151. **CQRS** - Separate read/write models

---

## Part 2: System Design Primer (70+ problems)

### Performance & Scalability (10 problems)

1. **Performance vs Scalability** - Distinguish and optimize for both
2. **Latency vs Throughput** - Optimize for low latency OR high throughput
3. **Availability vs Consistency** - CAP theorem trade-offs
4. **Amdahl's Law** - Limits of parallelization
5. **Little's Law** - Queueing theory
6. **Load Testing** - Benchmark system performance
7. **Stress Testing** - Find breaking points
8. **Capacity Planning** - Forecast resource needs
9. **Performance Profiling** - Identify bottlenecks
10. **Cost Optimization** - Optimize cloud costs

---

### Domain Name System (DNS) (5 problems)

11. **DNS Basics** - Domain name resolution
12. **DNS Records** - A, AAAA, CNAME, MX, TXT records
13. **DNS Caching** - TTL and cache invalidation
14. **DNS Load Balancing** - Round-robin DNS
15. **Route 53 / Geo-routing** - Geographic DNS routing

---

### Content Delivery Network (CDN) (6 problems)

16. **CDN Basics** - Edge locations and caching
17. **Push CDN** - Pre-upload content to CDN
18. **Pull CDN** - CDN fetches on-demand
19. **Cache Invalidation** - Purge stale content
20. **SSL/TLS Termination** - HTTPS at edge
21. **DDoS Protection** - Rate limiting at CDN

---

### Load Balancers (8 problems)

22. **Layer 4 Load Balancing** - TCP/UDP load balancing
23. **Layer 7 Load Balancing** - HTTP/HTTPS load balancing
24. **Round Robin** - Distribute requests evenly
25. **Least Connections** - Route to least busy server
26. **IP Hash** - Consistent hashing for sticky sessions
27. **Health Checks** - Monitor backend health
28. **Session Affinity** - Sticky sessions
29. **Active-Passive Failover** - Hot standby

---

### Reverse Proxy (4 problems)

30. **Nginx as Reverse Proxy** - Proxy requests to backends
31. **SSL Termination** - Decrypt HTTPS at proxy
32. **Compression** - Gzip responses
33. **Static Asset Serving** - Serve static files from proxy

---

### Application Layer (10 problems)

34. **Microservices** - Decompose monolith
35. **Service Discovery** - Consul, etcd, Zookeeper
36. **API Gateway** - Single entry point ✅ (already have)
37. **Backend for Frontend (BFF)** - Per-client APIs
38. **Sidecar Pattern** - Service mesh (Envoy, Istio)
39. **Circuit Breaker Pattern** - Prevent cascading failures ✅
40. **Bulkhead Pattern** - Isolate resources
41. **Retry with Backoff** - Exponential backoff ✅
42. **Rate Limiting** - Throttle requests ✅
43. **API Versioning** - v1, v2 APIs ✅

---

### Database (15 problems)

#### Replication (already covered in DDIA Ch 5)
44. **Master-Slave Replication** ✅
45. **Master-Master Replication** ✅
46. **Read Replicas** ✅

#### Sharding (already covered in DDIA Ch 6)
47. **Hash-Based Sharding** ✅
48. **Range-Based Sharding** ✅
49. **Directory-Based Sharding** - Lookup table

#### Denormalization (3)
50. **Denormalization** - Trade-off: speed vs consistency
51. **Materialized Views** ✅
52. **Redundant Data** - Store derived data

#### SQL Tuning (3)
53. **Query Optimization** - EXPLAIN plans ✅
54. **Index Selection** - Choose right indexes ✅
55. **Query Caching** - Cache query results

#### NoSQL (3)
56. **Key-Value Store** - Redis, DynamoDB
57. **Document Store** - MongoDB ✅
58. **Wide-Column Store** - Cassandra, HBase

---

### Caching (12 problems)

59. **Client-Side Caching** - Browser cache, localStorage
60. **CDN Caching** - Edge caching ✅
61. **Web Server Caching** - Nginx caching
62. **Database Caching** - Query result cache ✅
63. **Application Caching** - Redis, Memcached ✅
64. **Cache-Aside** - Lazy loading
65. **Write-Through Cache** - Write to cache and DB ✅
66. **Write-Behind Cache** - Async writes
67. **Refresh-Ahead** - Proactive cache refresh
68. **Cache Eviction** - LRU, LFU, FIFO
69. **Cache Invalidation** - Purge stale data ✅
70. **Distributed Cache** - Consistent hashing ✅

---

### Asynchronism (8 problems)

71. **Message Queues** - RabbitMQ, SQS ✅
72. **Task Queues** - Celery, Sidekiq
73. **Producer-Consumer** - Decoupling components
74. **Priority Queues** - Prioritize urgent tasks
75. **Dead Letter Queues** - Handle failed messages
76. **Back Pressure** - Slow down producers
77. **Pub/Sub Pattern** - Broadcast to subscribers ✅
78. **Event-Driven Architecture** - Events trigger actions ✅

---

### Communication (12 problems)

#### HTTP (4)
79. **HTTP Methods** - GET, POST, PUT, DELETE, PATCH
80. **HTTP Status Codes** - 2xx, 3xx, 4xx, 5xx
81. **HTTP/2** - Multiplexing, server push
82. **HTTP/3 (QUIC)** - UDP-based HTTP

#### RPC (4)
83. **gRPC** - Protocol Buffers over HTTP/2
84. **Thrift** - Cross-language RPC
85. **JSON-RPC** - JSON over HTTP
86. **XML-RPC** - XML over HTTP

#### REST (4)
87. **RESTful API Design** - Resources, verbs
88. **HATEOAS** - Hypermedia links
89. **GraphQL** - Query language for APIs
90. **WebSocket** - Bi-directional communication

---

### Security (10 problems)

91. **HTTPS / TLS** - Encrypt traffic
92. **SSL Certificates** - Public key infrastructure
93. **Authentication** - Who are you? (JWT, OAuth)
94. **Authorization** - What can you do? (RBAC, ABAC)
95. **API Keys** - Authenticate API clients
96. **OAuth 2.0** - Delegated authorization
97. **SQL Injection Prevention** - Parameterized queries
98. **XSS Prevention** - Sanitize user input
99. **CSRF Prevention** - Token-based protection
100. **DDoS Mitigation** - Rate limiting, CDN ✅

---

## Implementation Plan

### Phase 1: ✅ COMPLETED (58 problems)
- Chapter 5: Replication (16)
- Chapter 6: Partitioning (12)
- Chapter 7: Transactions (16)
- Chapter 9: Consensus (14)

### Phase 2: Foundational Concepts (30 problems)
- Chapter 1: Reliability, Scalability, Maintainability (15)
- Chapter 2: Data Models (12) - supplement existing
- Chapter 3: Storage & Retrieval (10) - supplement existing

### Phase 3: Advanced DDIA (38 problems)
- Chapter 4: Encoding & Evolution (8)
- Chapter 8: Distributed Systems (15)
- Chapter 10: Batch Processing (10)
- Chapter 11: Stream Processing (15) - supplement existing
- Chapter 12: Future of Data Systems (8) - supplement existing

### Phase 4: System Design Primer - Infrastructure (38 problems)
- Performance & Scalability (10)
- DNS (5)
- CDN (6)
- Load Balancers (8)
- Reverse Proxy (4)
- Application Layer (10) - supplement existing

### Phase 5: System Design Primer - Data & Communication (40 problems)
- Database (15) - supplement existing
- Caching (12) - supplement existing
- Asynchronism (8) - supplement existing
- Communication (12) - supplement existing
- Security (10)

---

## Total Estimate

| Category | Count |
|----------|-------|
| **DDIA Chapters 1-4** | 45 |
| **DDIA Chapter 5 (Replication)** | 16 ✅ |
| **DDIA Chapter 6 (Partitioning)** | 12 ✅ |
| **DDIA Chapter 7 (Transactions)** | 16 ✅ |
| **DDIA Chapter 8 (Dist. Systems)** | 15 |
| **DDIA Chapter 9 (Consensus)** | 14 ✅ |
| **DDIA Chapters 10-12** | 33 |
| **System Design Primer** | 100 |
| **TOTAL** | **251 problems** |

Already completed: 58
Remaining: 193

---

## Next Steps

1. Implement Phase 2 (Foundational: Ch 1-3) - 30 problems
2. Implement Phase 3 (Advanced DDIA: Ch 4, 8, 10-12) - 38 problems
3. Implement Phase 4 (Infrastructure: DNS, CDN, LB) - 38 problems
4. Implement Phase 5 (Data & Communication) - 40 problems
5. Create Tier 2 problems (combining 2 concepts)
6. Create Tier 3 problems (combining 3-4 concepts)
