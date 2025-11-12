# System Design - STORAGE Problems

Total Problems: 35

---

## 1. Basic RDBMS Design

**ID:** basic-database-design
**Category:** storage
**Difficulty:** Easy

### Summary

Design tables for a blog system

### Goal

Learn normalization and indexing basics.

### Description

Design a relational database for a blog platform. Learn about normalization, primary/foreign keys, indexes, and basic query optimization.

### Functional Requirements

- Store users, posts, and comments
- Support tags and categories
- Handle user relationships (followers)
- Enable full-text search on posts
- Track view counts and likes

### Non-Functional Requirements

- **Latency:** P95 < 50ms for queries
- **Request Rate:** 10k reads/sec, 1k writes/sec
- **Dataset Size:** 1M users, 10M posts
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **read_qps:** 10000
- **write_qps:** 1000
- **user_count:** 1000000
- **post_count:** 10000000

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- cache

### Hints

1. Normalize to 3NF
2. Index on frequently queried columns

### Tiers/Checkpoints

**T0: Database**
  - Must include: db_primary

**T1: Replicas**
  - Must include: db_replica

**T2: Cache**
  - Must include: cache

### Reference Solution

Normalized schema prevents data duplication. Indexes on user_id, post_id, created_at for fast queries. Read replicas handle 10k QPS reads. Query cache reduces DB load by 70%. This teaches RDBMS fundamentals.

**Components:**
- Blog Users (redirect_client)
- Load Balancer (lb)
- Blog API (app)
- Query Cache (cache)
- MySQL Primary (db_primary)
- Read Replicas (db_replica)

**Connections:**
- Blog Users → Load Balancer
- Load Balancer → Blog API
- Blog API → Query Cache
- Blog API → MySQL Primary
- Blog API → Read Replicas

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 2. NoSQL Document Store

**ID:** nosql-basics
**Category:** storage
**Difficulty:** Easy

### Summary

Flexible schema for user profiles

### Goal

Learn document database patterns.

### Description

Design a user profile system using MongoDB. Learn about document modeling, embedded vs referenced data, and when to denormalize.

### Functional Requirements

- Store flexible user profiles
- Support nested preferences
- Handle varying field types
- Enable complex queries
- Support schema evolution

### Non-Functional Requirements

- **Latency:** P95 < 30ms for document reads
- **Request Rate:** 20k ops/sec
- **Dataset Size:** 100M documents, 1KB average
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **ops_per_sec:** 20000
- **document_count:** 100000000
- **avg_doc_size:** 1000
- **index_count:** 5

### Available Components

- client
- lb
- app
- db_primary
- db_replica

### Hints

1. Embed frequently accessed data
2. Reference for many-to-many

### Tiers/Checkpoints

**T0: MongoDB**
  - Must include: db_primary

**T1: Sharding**
  - Minimum 3 of type: db_primary

### Reference Solution

Document model allows flexible schemas. Embedded preferences avoid joins. Sharding by user_id distributes load. Compound indexes optimize complex queries. This teaches NoSQL document modeling.

**Components:**
- Profile Service (redirect_client)
- Load Balancer (lb)
- Profile API (app)
- MongoDB Shard 1 (db_primary)
- MongoDB Shard 2 (db_primary)
- Config Servers (db_replica)

**Connections:**
- Profile Service → Load Balancer
- Load Balancer → Profile API
- Profile API → MongoDB Shard 1
- Profile API → MongoDB Shard 2
- Profile API → Config Servers

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 20,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (200,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 200,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000887

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 3. Redis-like Key-Value Store

**ID:** key-value-store
**Category:** storage
**Difficulty:** Easy

### Summary

Build a distributed cache

### Goal

Learn in-memory data structures and eviction.

### Description

Design a distributed key-value store like Redis. Learn about data structures, persistence, replication, and cache eviction policies.

### Functional Requirements

- Support GET/SET operations
- Implement LRU eviction
- Handle string, list, set, hash types
- Provide pub/sub messaging
- Support TTL expiration

### Non-Functional Requirements

- **Latency:** P95 < 1ms for cache hits
- **Request Rate:** 100k ops/sec
- **Dataset Size:** 10GB in-memory
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **ops_per_sec:** 100000
- **memory_gb:** 10
- **eviction_policy:** LRU
- **replication_factor:** 3

### Available Components

- client
- lb
- cache
- db_primary

### Hints

1. Use consistent hashing
2. Implement AOF for durability

### Tiers/Checkpoints

**T0: Cache**
  - Must include: cache

**T1: Replication**
  - Minimum 3 of type: cache

**T2: Persistence**
  - Must include: db_primary

### Reference Solution

Consistent hashing distributes keys across 3 master nodes. Each master has replicas for HA. RDB snapshots provide persistence. LRU eviction maintains memory bounds. This teaches in-memory database fundamentals.

**Components:**
- App Servers (redirect_client)
- Proxy Layer (lb)
- Redis Master 1 (cache)
- Redis Master 2 (cache)
- Redis Master 3 (cache)
- RDB Snapshots (db_primary)

**Connections:**
- App Servers → Proxy Layer
- Proxy Layer → Redis Master 1
- Proxy Layer → Redis Master 2
- Proxy Layer → Redis Master 3
- Redis Master 1 → RDB Snapshots
- Redis Master 2 → RDB Snapshots
- Redis Master 3 → RDB Snapshots

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 4. Product Catalog Store

**ID:** product-catalog
**Category:** storage
**Difficulty:** Easy

### Summary

E-commerce product database

### Goal

Learn catalog modeling with rich metadata.

### Description

Design a product catalog for e-commerce. Handle hierarchical categories, variants, inventory, and search.

### Functional Requirements

- Store products with variants (size, color)
- Support category hierarchies
- Track inventory per variant
- Enable faceted search
- Handle product reviews

### Non-Functional Requirements

- **Latency:** P95 < 100ms for product page
- **Request Rate:** 5k reads/sec, 500 writes/sec
- **Dataset Size:** 1M products, 10M variants
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **product_count:** 1000000
- **variant_count:** 10000000
- **category_depth:** 5
- **search_qps:** 5000

### Available Components

- client
- lb
- app
- db_primary
- cache
- search

### Hints

1. Denormalize for product page
2. Index category path for hierarchy

### Tiers/Checkpoints

**T0: Database**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: Search**
  - Must include: search

### Reference Solution

Denormalized product documents include variants for single query. Category materialized path enables hierarchy queries. Cache hot products. Elasticsearch for faceted search. This teaches catalog modeling.

**Components:**
- Shoppers (redirect_client)
- LB (lb)
- Catalog API (app)
- Product Cache (cache)
- PostgreSQL (db_primary)
- Elasticsearch (search)

**Connections:**
- Shoppers → LB
- LB → Catalog API
- Catalog API → Product Cache
- Catalog API → PostgreSQL
- Catalog API → Elasticsearch

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 5. Metrics Time-Series DB

**ID:** time-series-metrics
**Category:** storage
**Difficulty:** Easy

### Summary

Store application metrics

### Goal

Learn time-series data modeling.

### Description

Design a metrics database for monitoring. Learn about time-series optimization, downsampling, and retention policies.

### Functional Requirements

- Ingest metrics at high rate
- Store with microsecond precision
- Support aggregation queries
- Implement retention policies
- Enable alerting on thresholds

### Non-Functional Requirements

- **Latency:** P95 < 10ms for writes, < 100ms for queries
- **Request Rate:** 1M metrics/sec ingestion
- **Dataset Size:** 100TB time-series data
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **metrics_per_sec:** 1000000
- **retention_days:** 365
- **downsampling_intervals:** 60s, 5m, 1h
- **cardinality:** 1000000

### Available Components

- client
- lb
- app
- db_primary
- worker

### Hints

1. Partition by time range
2. Use columnar storage

### Tiers/Checkpoints

**T0: TSDB**
  - Must include: db_primary

**T1: Downsampling**
  - Must include: worker

### Reference Solution

Time-partitioned tables enable fast writes. Columnar storage compresses metrics. Downsampling reduces old data size. Tag indexing for fast queries. This teaches time-series database design.

**Components:**
- Services (redirect_client)
- LB (lb)
- Collector (app)
- InfluxDB (db_primary)
- Compaction (worker)

**Connections:**
- Services → LB
- LB → Collector
- Collector → InfluxDB
- Compaction → InfluxDB

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 6. Session Storage System

**ID:** session-store
**Category:** storage
**Difficulty:** Easy

### Summary

Manage user sessions

### Goal

Learn session management patterns.

### Description

Design a distributed session store. Handle session creation, validation, and expiration with high availability.

### Functional Requirements

- Create and validate sessions
- Support session TTL
- Handle concurrent logins
- Enable session revocation
- Store session metadata

### Non-Functional Requirements

- **Latency:** P95 < 5ms for session lookup
- **Request Rate:** 50k sessions/sec
- **Dataset Size:** 10M active sessions
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **active_sessions:** 10000000
- **session_ttl:** 86400
- **lookup_qps:** 50000
- **avg_session_size:** 1024

### Available Components

- client
- lb
- cache
- db_primary

### Hints

1. Use Redis with TTL
2. Async write-behind to DB

### Tiers/Checkpoints

**T0: Cache**
  - Must include: cache

**T1: Persistence**
  - Must include: db_primary

### Reference Solution

Redis stores sessions with automatic TTL expiration. Write-behind to PostgreSQL for durability. Sentinel for Redis HA. Session ID as hash key. This teaches session management.

**Components:**
- Web Servers (redirect_client)
- LB (lb)
- Redis Cluster (cache)
- PostgreSQL (db_primary)

**Connections:**
- Web Servers → LB
- LB → Redis Cluster
- Redis Cluster → PostgreSQL

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 7. File Metadata Store

**ID:** file-metadata-store
**Category:** storage
**Difficulty:** Easy

### Summary

Manage file system metadata

### Goal

Learn metadata modeling for file systems.

### Description

Design a metadata store for a distributed file system. Handle directory hierarchies, permissions, and file attributes.

### Functional Requirements

- Store file and directory metadata
- Support hierarchical paths
- Track permissions and ownership
- Enable quick path lookups
- Handle renames efficiently

### Non-Functional Requirements

- **Latency:** P95 < 20ms for metadata ops
- **Request Rate:** 100k ops/sec
- **Dataset Size:** 1B files and directories
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **file_count:** 1000000000
- **avg_path_depth:** 5
- **metadata_ops_qps:** 100000
- **avg_metadata_size:** 512

### Available Components

- client
- lb
- app
- db_primary
- cache

### Hints

1. Index on parent_id and name
2. Materialized path for hierarchy

### Tiers/Checkpoints

**T0: Database**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

### Reference Solution

Shard by hash(path) for even distribution. Adjacency list with materialized path for hierarchy. Cache frequently accessed paths. B-tree index on parent_id. This teaches metadata design.

**Components:**
- FS Clients (redirect_client)
- LB (lb)
- Metadata Service (app)
- Path Cache (cache)
- MySQL Sharded (db_primary)

**Connections:**
- FS Clients → LB
- LB → Metadata Service
- Metadata Service → Path Cache
- Metadata Service → MySQL Sharded

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 8. Configuration Management Store

**ID:** config-management
**Category:** storage
**Difficulty:** Easy

### Summary

Centralized config service

### Goal

Learn configuration versioning and distribution.

### Description

Design a configuration management system. Support versioning, rollback, and real-time updates to services.

### Functional Requirements

- Store key-value configurations
- Support versioning and rollback
- Enable environment-specific configs
- Provide audit trail
- Push config updates to subscribers

### Non-Functional Requirements

- **Latency:** P95 < 10ms for reads
- **Request Rate:** 10k config reads/sec
- **Dataset Size:** 100K config keys
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **config_keys:** 100000
- **read_qps:** 10000
- **update_qps:** 100
- **subscriber_count:** 5000

### Available Components

- client
- lb
- app
- db_primary
- cache
- queue

### Hints

1. Version configs with timestamps
2. Use pub/sub for updates

### Tiers/Checkpoints

**T0: Storage**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: Notifications**
  - Must include: queue

### Reference Solution

Versioned configs stored with timestamps. Cache current version. Queue for push notifications. Audit log tracks changes. Rollback via version selection. This teaches config management.

**Components:**
- Services (redirect_client)
- LB (lb)
- Config API (app)
- Config Cache (cache)
- PostgreSQL (db_primary)
- Update Queue (queue)

**Connections:**
- Services → LB
- LB → Config API
- Config API → Config Cache
- Config API → PostgreSQL
- Config API → Update Queue

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 9. E-commerce Order Database

**ID:** ecommerce-order-db
**Category:** storage
**Difficulty:** Intermediate

### Summary

Sharded order management

### Goal

Learn database sharding patterns.

### Description

Design a sharded order database for e-commerce. Handle high write rates, complex queries, and maintain consistency.

### Functional Requirements

- Store orders with line items
- Support order status tracking
- Handle inventory reservations
- Enable customer order history
- Provide merchant dashboards
- Support refunds and cancellations

### Non-Functional Requirements

- **Latency:** P95 < 50ms for order creation
- **Request Rate:** 10k orders/sec peak
- **Dataset Size:** 1B orders, 5B line items
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **orders_per_sec:** 10000
- **total_orders:** 1000000000
- **avg_items_per_order:** 5
- **shard_count:** 16

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- cache
- queue

### Hints

1. Shard by customer_id
2. Use distributed transactions

### Tiers/Checkpoints

**T0: Sharding**
  - Minimum 4 of type: db_primary

**T1: Replicas**
  - Must include: db_replica

**T2: Queue**
  - Must include: queue

### Reference Solution

Shard by hash(customer_id) for even distribution. Each shard handles 2.5k QPS. Read replicas for analytics. Cache recent orders. Event queue for async inventory updates. This teaches sharding and distributed data.

**Components:**
- Customers (redirect_client)
- LB (lb)
- Order Service (app)
- Shard 1 (db_primary)
- Shard 2 (db_primary)
- Shard 3 (db_primary)
- Shard 4 (db_primary)
- Order Cache (cache)
- Event Queue (queue)

**Connections:**
- Customers → LB
- LB → Order Service
- Order Service → Shard 1
- Order Service → Shard 2
- Order Service → Shard 3
- Order Service → Shard 4
- Order Service → Order Cache
- Order Service → Event Queue

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 10. Social Network Graph Database

**ID:** social-graph-db
**Category:** storage
**Difficulty:** Intermediate

### Summary

Friend connections and feeds

### Goal

Learn graph database modeling.

### Description

Design a graph database for social connections. Support friend relationships, activity feeds, and graph traversal queries.

### Functional Requirements

- Store user profiles and connections
- Support bidirectional friendships
- Generate personalized feeds
- Find mutual friends
- Suggest new connections
- Track engagement metrics

### Non-Functional Requirements

- **Latency:** P95 < 100ms for feed generation
- **Request Rate:** 50k queries/sec
- **Dataset Size:** 1B users, 100B connections
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **user_count:** 1000000000
- **avg_friends:** 100
- **feed_query_qps:** 50000
- **graph_depth:** 3

### Available Components

- client
- lb
- app
- db_primary
- cache
- search

### Hints

1. Denormalize friend lists
2. Pre-compute feed rankings

### Tiers/Checkpoints

**T0: Graph DB**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: Search**
  - Must include: search

### Reference Solution

Graph DB stores relationships as first-class entities. Adjacency lists cached for hot users. Cypher queries for traversal. Denormalized friend counts. This teaches graph data modeling.

**Components:**
- Users (redirect_client)
- LB (lb)
- Social API (app)
- Graph Cache (cache)
- Neo4j Cluster (db_primary)
- User Search (search)

**Connections:**
- Users → LB
- LB → Social API
- Social API → Graph Cache
- Social API → Neo4j Cluster
- Social API → User Search

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 11. Analytics Data Warehouse

**ID:** analytics-warehouse
**Category:** storage
**Difficulty:** Intermediate

### Summary

Columnar storage for analytics

### Goal

Learn columnar database design.

### Description

Design an analytics warehouse with columnar storage. Optimize for complex aggregations and large scans.

### Functional Requirements

- Store clickstream and event data
- Support complex aggregations
- Enable dimensional modeling
- Provide fast group-by queries
- Handle late-arriving data
- Support data cubes

### Non-Functional Requirements

- **Latency:** P95 < 5s for analytical queries
- **Request Rate:** 1M events/sec ingestion
- **Dataset Size:** 1PB historical data
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **events_per_sec:** 1000000
- **storage_pb:** 1
- **query_concurrency:** 100
- **compression_ratio:** 10

### Available Components

- client
- lb
- app
- db_primary
- worker
- stream

### Hints

1. Partition by date
2. Use columnar compression

### Tiers/Checkpoints

**T0: Warehouse**
  - Must include: db_primary

**T1: Streaming**
  - Must include: stream

**T2: ETL**
  - Must include: worker

### Reference Solution

Columnar format compresses well (10x). Partitioned by date for fast scans. ETL workers transform raw events. Sort keys on common filters. This teaches OLAP database design.

**Components:**
- Data Sources (redirect_client)
- Kafka (stream)
- ETL Workers (worker)
- Query Engine (app)
- ClickHouse (db_primary)

**Connections:**
- Data Sources → Kafka
- Kafka → ETL Workers
- ETL Workers → ClickHouse
- Query Engine → ClickHouse

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 12. Multi-Tenant SaaS Database

**ID:** multi-tenant-saas
**Category:** storage
**Difficulty:** Intermediate

### Summary

Tenant isolation and scaling

### Goal

Learn tenant isolation strategies.

### Description

Design a multi-tenant database with proper isolation. Balance shared resources with tenant-specific requirements.

### Functional Requirements

- Isolate tenant data
- Support custom schemas per tenant
- Handle varying tenant sizes
- Provide per-tenant backups
- Enable tenant-specific SLAs
- Support data residency requirements

### Non-Functional Requirements

- **Latency:** P95 < 100ms for queries
- **Request Rate:** 50k queries/sec across all tenants
- **Dataset Size:** 10k tenants, 100TB total
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **tenant_count:** 10000
- **large_tenants:** 100
- **query_qps:** 50000
- **avg_tenant_size_gb:** 10

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- cache

### Hints

1. Schema per tenant for large tenants
2. Shared tables for small tenants

### Tiers/Checkpoints

**T0: Isolation**
  - Minimum 3 of type: db_primary

**T1: Routing**
  - Must include: cache

### Reference Solution

Hybrid model: dedicated DBs for top 100 tenants, shared for rest. Row-level security in shared DB. Tenant routing cached. This teaches multi-tenancy patterns.

**Components:**
- Tenant Apps (redirect_client)
- LB (lb)
- API Gateway (app)
- Tenant Router (cache)
- Large Tenants (db_primary)
- Small Tenants (db_primary)
- Replicas (db_replica)

**Connections:**
- Tenant Apps → LB
- LB → API Gateway
- API Gateway → Tenant Router
- API Gateway → Large Tenants
- API Gateway → Small Tenants
- Large Tenants → Replicas
- Small Tenants → Replicas

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 13. Inventory Management System

**ID:** inventory-management
**Category:** storage
**Difficulty:** Advanced

### Summary

Amazon-scale 10B SKUs real-time inventory

### Goal

Build Amazon-scale inventory system.

### Description

Design an Amazon-scale inventory system managing 10B SKUs across 5000+ fulfillment centers globally. Must handle 1M reservations/sec (10M during Prime Day), prevent overselling with <10ms latency, survive regional failures, and maintain perfect inventory accuracy. Support real-time inventory transfers, predictive restocking using ML, and operate within $50M/month budget while handling $1T+ inventory value.

### Functional Requirements

- Track 10B SKUs across 5000+ fulfillment centers
- Process 1M reservations/sec (10M Prime Day)
- Distributed locks preventing any overselling
- ML-based predictive restocking across regions
- Real-time cross-warehouse inventory transfers
- Support flash sales with 100x traffic spikes
- Multi-channel inventory (stores, online, partners)
- Complete audit trail for SOX compliance

### Non-Functional Requirements

- **Latency:** P99 < 10ms reservation, P99.9 < 25ms
- **Request Rate:** 1M reservations/sec, 10M during Prime Day
- **Dataset Size:** 10B SKUs, 5000 locations, 100TB hot data
- **Availability:** 99.999% uptime, zero overselling tolerance
- **Consistency:** Linearizable consistency for inventory counts

### Constants/Assumptions

- **l4_enhanced:** true
- **sku_count:** 10000000000
- **location_count:** 5000
- **reservation_qps:** 1000000
- **spike_multiplier:** 10
- **concurrent_requests_per_sku:** 10000
- **cache_hit_target:** 0.999
- **budget_monthly:** 50000000

### Available Components

- client
- lb
- app
- db_primary
- cache
- queue

### Hints

1. Use optimistic locking
2. Implement reservation expiry

### Tiers/Checkpoints

**T0: Database**
  - Must include: db_primary

**T1: Locking**
  - Must include: cache

**T2: Events**
  - Must include: queue

### Reference Solution

Optimistic locking with version numbers prevents race conditions. Redis distributed locks for hot SKUs. Event queue for async updates. Row-level locks in DB. This teaches concurrency control.

**Components:**
- Order Systems (redirect_client)
- LB (lb)
- Inventory API (app)
- Redis Locks (cache)
- PostgreSQL (db_primary)
- Event Queue (queue)

**Connections:**
- Order Systems → LB
- LB → Inventory API
- Inventory API → Redis Locks
- Inventory API → PostgreSQL
- Inventory API → Event Queue

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 14. CMS with Media Storage

**ID:** cms-media-storage
**Category:** storage
**Difficulty:** Intermediate

### Summary

Content and media management

### Goal

Learn hybrid storage architecture.

### Description

Design a CMS with separate storage for metadata and media. Handle large files, CDN integration, and content versioning.

### Functional Requirements

- Store articles and media metadata
- Handle large media uploads
- Support content versioning
- Enable CDN distribution
- Provide media transformations
- Track usage analytics

### Non-Functional Requirements

- **Latency:** P95 < 50ms for metadata, < 200ms for media
- **Request Rate:** 10k reads/sec, 1k writes/sec
- **Dataset Size:** 1M articles, 100M media files, 500TB
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **article_count:** 1000000
- **media_files:** 100000000
- **storage_tb:** 500
- **cdn_hit_rate:** 0.95

### Available Components

- client
- cdn
- lb
- app
- db_primary
- storage
- worker

### Hints

1. Separate metadata from blobs
2. Use signed URLs

### Tiers/Checkpoints

**T0: Metadata**
  - Must include: db_primary

**T1: Media**
  - Must include: storage

**T2: CDN**
  - Must include: cdn

### Reference Solution

Metadata in PostgreSQL, media in S3. Signed URLs for uploads. Workers create thumbnails. CDN caches 95% of media requests. This teaches hybrid storage architecture.

**Components:**
- Readers (redirect_client)
- Media CDN (cdn)
- LB (lb)
- CMS API (app)
- PostgreSQL (db_primary)
- S3 (storage)
- Image Processor (worker)

**Connections:**
- Readers → Media CDN
- Media CDN → LB
- LB → CMS API
- CMS API → PostgreSQL
- CMS API → S3
- S3 → Media CDN
- S3 → Image Processor

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 15. Banking Transaction Database

**ID:** banking-transaction-db
**Category:** storage
**Difficulty:** Advanced

### Summary

JPMorgan-scale 100M transactions/sec

### Goal

Build JPMorgan-scale banking system.

### Description

Design a JPMorgan/Bank of America-scale transaction system processing 100M transactions/sec globally with perfect ACID guarantees. Must handle market crashes (1000x spikes), maintain zero data loss even during datacenter failures, meet Basel III regulations, and operate within $500M/month budget. Support real-time fraud detection, instant international transfers, and coordinate with 10k+ partner banks while ensuring complete regulatory compliance.

### Functional Requirements

- Process 100M transactions/sec (1B during crises)
- Zero tolerance for data loss or inconsistency
- Real-time fraud detection on every transaction
- Instant cross-border transfers to 200+ countries
- Support 1B+ accounts across all products
- Complete audit trail for 10-year retention
- Meet Basel III, Dodd-Frank, GDPR requirements
- Coordinate with 10k+ partner banks via APIs

### Non-Functional Requirements

- **Latency:** P99 < 50ms domestic, < 200ms international
- **Request Rate:** 100M transactions/sec, 1B during market events
- **Dataset Size:** 1B accounts, 100B transactions, 1PB audit logs
- **Availability:** 99.9999% uptime (31 seconds/year downtime)
- **Consistency:** Strict serializability with zero violations

### Constants/Assumptions

- **l4_enhanced:** true
- **transaction_qps:** 100000000
- **spike_multiplier:** 10
- **account_count:** 1000000000
- **total_transactions:** 100000000000
- **audit_retention_years:** 10
- **partner_banks:** 10000
- **budget_monthly:** 500000000

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- storage

### Hints

1. Use serializable isolation
2. Implement double-entry bookkeeping

### Tiers/Checkpoints

**T0: ACID DB**
  - Must include: db_primary

**T1: Replicas**
  - Must include: db_replica

**T2: Archival**
  - Must include: storage

### Reference Solution

Serializable isolation level prevents anomalies. Double-entry ensures balance integrity. Synchronous replication for durability. Archive to S3 Glacier after 1 year. This teaches ACID database design.

**Components:**
- Banking Apps (redirect_client)
- LB (lb)
- Transaction Service (app)
- PostgreSQL (db_primary)
- Read Replicas (db_replica)
- Archive (storage)

**Connections:**
- Banking Apps → LB
- LB → Transaction Service
- Transaction Service → PostgreSQL
- Transaction Service → Read Replicas
- PostgreSQL → Archive

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 16. Healthcare Records System

**ID:** healthcare-records
**Category:** storage
**Difficulty:** Intermediate

### Summary

HIPAA-compliant medical records

### Goal

Learn compliance and security requirements.

### Description

Design a healthcare records system with HIPAA compliance. Handle patient data, access controls, and audit logging.

### Functional Requirements

- Store patient medical records
- Enforce role-based access control
- Track all data access
- Support data encryption at rest and in transit
- Enable patient consent management
- Provide audit trail for compliance

### Non-Functional Requirements

- **Latency:** P95 < 200ms for record access
- **Request Rate:** 5k queries/sec
- **Dataset Size:** 100M patient records
- **Data Durability:** HIPAA, GDPR compliant
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **patient_count:** 100000000
- **record_access_qps:** 5000
- **audit_retention_years:** 7
- **encryption_overhead:** 1.2

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- storage
- queue

### Hints

1. Encrypt at field level
2. Immutable audit logs

### Tiers/Checkpoints

**T0: Encryption**
  - Must include: db_primary

**T1: Audit**
  - Must include: queue

**T2: Backup**
  - Must include: storage

### Reference Solution

Field-level encryption for sensitive data. Immutable audit logs track all access. KMS for key management. Encrypted backups in S3. Role-based access at application layer. This teaches compliance-focused design.

**Components:**
- EHR Systems (redirect_client)
- LB (lb)
- Records API (app)
- Encrypted PostgreSQL (db_primary)
- Audit Log Queue (queue)
- Encrypted S3 (storage)

**Connections:**
- EHR Systems → LB
- LB → Records API
- Records API → Encrypted PostgreSQL
- Records API → Audit Log Queue
- Encrypted PostgreSQL → Encrypted S3

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 17. IoT Time-Series Store

**ID:** iot-time-series
**Category:** storage
**Difficulty:** Intermediate

### Summary

Compressed sensor data storage

### Goal

Learn time-series compression techniques.

### Description

Design an IoT time-series database with aggressive compression. Handle millions of devices sending telemetry.

### Functional Requirements

- Ingest sensor data from millions of devices
- Apply delta and run-length compression
- Support time-range queries
- Enable aggregation by device/sensor
- Implement data retention policies
- Provide real-time dashboards

### Non-Functional Requirements

- **Latency:** P95 < 5ms for writes, < 500ms for queries
- **Request Rate:** 5M data points/sec
- **Dataset Size:** 500TB compressed
- **Availability:** 99.9% uptime
- **Scalability:** 20:1 compression ratio for efficient storage

### Constants/Assumptions

- **data_points_per_sec:** 5000000
- **device_count:** 10000000
- **storage_tb_compressed:** 500
- **compression_ratio:** 20

### Available Components

- client
- lb
- stream
- worker
- db_primary
- cache

### Hints

1. Use delta encoding
2. Batch writes for efficiency

### Tiers/Checkpoints

**T0: Buffering**
  - Must include: stream

**T1: Compression**
  - Must include: worker

**T2: TSDB**
  - Must include: db_primary

### Reference Solution

Kafka buffers incoming data. Workers apply delta encoding and compression before storing. TimescaleDB hypertables for time partitioning. 20:1 compression via delta + dictionary encoding. This teaches IoT-scale time-series.

**Components:**
- IoT Devices (redirect_client)
- Kafka (stream)
- Compression (worker)
- TimescaleDB (db_primary)
- Query Cache (cache)

**Connections:**
- IoT Devices → Kafka
- Kafka → Compression
- Compression → TimescaleDB
- TimescaleDB → Query Cache

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $23,000,000
- Yearly Total: $276,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $15,000,000 (5000 × $100/month per instance)
- Storage: $5,000,000 (Database storage + backup + snapshots)
- Network: $2,500,000 (Ingress/egress + CDN distribution)

---

## 18. Gaming Leaderboard Database

**ID:** gaming-leaderboard
**Category:** storage
**Difficulty:** Intermediate

### Summary

Real-time rankings and scores

### Goal

Learn sorted set data structures.

### Description

Design a real-time gaming leaderboard. Handle score updates, rank queries, and global/regional leaderboards.

### Functional Requirements

- Update player scores in real-time
- Query player rank by score
- Retrieve top N players
- Support multiple leaderboards
- Handle ties in ranking
- Provide historical snapshots

### Non-Functional Requirements

- **Latency:** P95 < 10ms for rank queries
- **Request Rate:** 100k score updates/sec
- **Dataset Size:** 100M active players
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **player_count:** 100000000
- **update_qps:** 100000
- **leaderboard_count:** 1000
- **top_n_size:** 100

### Available Components

- client
- lb
- app
- cache
- db_primary
- worker

### Hints

1. Use Redis ZADD/ZRANK
2. Shard by leaderboard ID

### Tiers/Checkpoints

**T0: Sorted Sets**
  - Must include: cache

**T1: Persistence**
  - Must include: db_primary

**T2: Snapshots**
  - Must include: worker

### Reference Solution

Redis sorted sets provide O(log N) rank operations. Sharded by leaderboard_id. Async persistence to PostgreSQL. Workers create hourly snapshots. This teaches real-time ranking systems.

**Components:**
- Game Servers (redirect_client)
- LB (lb)
- Score API (app)
- Redis Sorted Sets (cache)
- PostgreSQL (db_primary)
- Snapshot Worker (worker)

**Connections:**
- Game Servers → LB
- LB → Score API
- Score API → Redis Sorted Sets
- Redis Sorted Sets → PostgreSQL
- Snapshot Worker → Redis Sorted Sets
- Snapshot Worker → PostgreSQL

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 19. Booking/Reservation System

**ID:** booking-reservation
**Category:** storage
**Difficulty:** Intermediate

### Summary

Prevent double-booking conflicts

### Goal

Learn pessimistic locking patterns.

### Description

Design a booking system for hotels/flights. Prevent double-booking with proper concurrency control.

### Functional Requirements

- Check availability in real-time
- Reserve resources atomically
- Handle concurrent booking attempts
- Support hold/release of reservations
- Enable waitlists
- Provide booking confirmations

### Non-Functional Requirements

- **Latency:** P95 < 100ms for availability check
- **Request Rate:** 10k bookings/sec
- **Dataset Size:** 1M resources, 100M bookings/year
- **Availability:** 99.99% uptime
- **Consistency:** No double-booking allowed

### Constants/Assumptions

- **resource_count:** 1000000
- **booking_qps:** 10000
- **concurrent_attempts_per_resource:** 50
- **hold_duration_seconds:** 300

### Available Components

- client
- lb
- app
- db_primary
- cache
- queue

### Hints

1. SELECT FOR UPDATE
2. Implement reservation timeout

### Tiers/Checkpoints

**T0: Locking**
  - Must include: cache

**T1: Database**
  - Must include: db_primary

**T2: Queue**
  - Must include: queue

### Reference Solution

Pessimistic locking with SELECT FOR UPDATE prevents double-booking. Redis locks for hold state. Automatic expiry after 5 min. Waitlist queue for sold-out resources. This teaches booking system design.

**Components:**
- Booking Apps (redirect_client)
- LB (lb)
- Reservation API (app)
- Redis Locks (cache)
- PostgreSQL (db_primary)
- Waitlist (queue)

**Connections:**
- Booking Apps → LB
- LB → Reservation API
- Reservation API → Redis Locks
- Reservation API → PostgreSQL
- Reservation API → Waitlist

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 20. Audit Trail Database

**ID:** audit-trail
**Category:** storage
**Difficulty:** Intermediate

### Summary

Append-only event log

### Goal

Learn immutable log patterns.

### Description

Design an append-only audit trail. Ensure immutability, support compliance queries, and handle high write rates.

### Functional Requirements

- Log all system events
- Guarantee immutability
- Support time-range queries
- Enable filtering by entity/action
- Provide tamper detection
- Archive old logs

### Non-Functional Requirements

- **Latency:** P95 < 10ms for writes
- **Request Rate:** 100k events/sec
- **Dataset Size:** 1PB total logs
- **Data Durability:** Write-once, read-many immutability
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **events_per_sec:** 100000
- **retention_years:** 10
- **storage_pb:** 1
- **avg_event_size:** 1024

### Available Components

- client
- lb
- stream
- worker
- db_primary
- storage

### Hints

1. Use Kafka for durability
2. Merkle trees for tamper detection

### Tiers/Checkpoints

**T0: Streaming**
  - Must include: stream

**T1: Storage**
  - Must include: db_primary

**T2: Archive**
  - Must include: storage

### Reference Solution

Kafka provides append-only, durable log. Elasticsearch indexes for queries. Merkle tree hashes detect tampering. Archive to Glacier after 1 year. This teaches immutable log architecture.

**Components:**
- Services (redirect_client)
- Kafka (stream)
- Indexer (worker)
- Elasticsearch (db_primary)
- S3 Glacier (storage)

**Connections:**
- Services → Kafka
- Kafka → Indexer
- Indexer → Elasticsearch
- Indexer → S3 Glacier

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 21. Search Index Storage

**ID:** search-index-storage
**Category:** storage
**Difficulty:** Intermediate

### Summary

Inverted index for full-text search

### Goal

Learn search indexing structures.

### Description

Design a search index storage system. Handle document indexing, query processing, and relevance ranking.

### Functional Requirements

- Index documents with full-text
- Support boolean queries
- Rank results by relevance
- Handle typos and synonyms
- Enable faceted filtering
- Provide autocomplete

### Non-Functional Requirements

- **Latency:** P95 < 100ms for search queries
- **Request Rate:** 50k queries/sec, 10k indexing/sec
- **Dataset Size:** 100M documents, 1TB index
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **document_count:** 100000000
- **query_qps:** 50000
- **indexing_qps:** 10000
- **index_size_tb:** 1

### Available Components

- client
- lb
- app
- search
- cache
- queue

### Hints

1. Shard by document ID
2. Cache query results

### Tiers/Checkpoints

**T0: Index**
  - Must include: search

**T1: Cache**
  - Must include: cache

**T2: Queue**
  - Must include: queue

### Reference Solution

Inverted index maps terms to documents. Sharded across 20 Elasticsearch nodes. Query cache for popular searches. Async indexing via queue. BM25 for relevance scoring. This teaches search index design.

**Components:**
- Search Users (redirect_client)
- LB (lb)
- Search API (app)
- Query Cache (cache)
- Elasticsearch (search)
- Index Queue (queue)

**Connections:**
- Search Users → LB
- LB → Search API
- Search API → Query Cache
- Search API → Elasticsearch
- Search API → Index Queue
- Index Queue → Elasticsearch

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 22. ML Model Registry

**ID:** ml-model-registry
**Category:** storage
**Difficulty:** Intermediate

### Summary

Versioned model artifacts

### Goal

Learn artifact storage with metadata.

### Description

Design an ML model registry. Store model artifacts, track versions, and manage deployment metadata.

### Functional Requirements

- Store model binaries and weights
- Track model versions and lineage
- Store experiment metadata
- Enable model comparison
- Support model rollback
- Provide deployment tracking

### Non-Functional Requirements

- **Latency:** P95 < 200ms for metadata queries
- **Request Rate:** 1k model uploads/day, 10k queries/sec
- **Dataset Size:** 1M models, 100TB artifacts
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **model_count:** 1000000
- **storage_tb:** 100
- **query_qps:** 10000
- **avg_model_size_mb:** 100

### Available Components

- client
- lb
- app
- db_primary
- storage
- cache

### Hints

1. Content-addressable storage
2. Use signed URLs for downloads

### Tiers/Checkpoints

**T0: Metadata**
  - Must include: db_primary

**T1: Artifacts**
  - Must include: storage

**T2: Cache**
  - Must include: cache

### Reference Solution

Metadata in PostgreSQL: version, metrics, lineage. Artifacts in S3 with content hashing. Signed URLs for secure access. Cache popular model metadata. This teaches artifact management.

**Components:**
- ML Engineers (redirect_client)
- LB (lb)
- Registry API (app)
- Metadata Cache (cache)
- PostgreSQL (db_primary)
- S3 (storage)

**Connections:**
- ML Engineers → LB
- LB → Registry API
- Registry API → Metadata Cache
- Registry API → PostgreSQL
- Registry API → S3

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 1,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (10,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 10,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00017747

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 23. API Rate Limit Counters

**ID:** rate-limit-counters
**Category:** storage
**Difficulty:** Intermediate

### Summary

Distributed rate limiting

### Goal

Learn distributed counter patterns.

### Description

Design a distributed rate limiter. Track API usage per user/IP with sliding windows and token buckets.

### Functional Requirements

- Track requests per time window
- Support multiple rate limit tiers
- Handle burst traffic
- Provide real-time quota checks
- Enable analytics on usage
- Support rate limit headers

### Non-Functional Requirements

- **Latency:** P95 < 5ms for rate check
- **Request Rate:** 1M rate checks/sec
- **Dataset Size:** 10M active API keys
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **rate_check_qps:** 1000000
- **api_key_count:** 10000000
- **window_seconds:** 60
- **max_requests_per_window:** 1000

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Use Redis INCR
2. Implement sliding window

### Tiers/Checkpoints

**T0: Counters**
  - Must include: cache

**T1: Config**
  - Must include: db_primary

### Reference Solution

Redis sorted sets for sliding window counters. INCR for atomic increments. TTL auto-expires old windows. Config DB stores per-key limits. This teaches distributed rate limiting.

**Components:**
- API Gateway (redirect_client)
- LB (lb)
- Rate Limiter (app)
- Redis Counters (cache)
- Limit Config (db_primary)

**Connections:**
- API Gateway → LB
- LB → Rate Limiter
- Rate Limiter → Redis Counters
- Rate Limiter → Limit Config

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 24. Distributed SQL Database

**ID:** distributed-database
**Category:** storage
**Difficulty:** Advanced

### Summary

Google Spanner-scale 10M TPS globally

### Goal

Build Google Spanner-scale database.

### Description

Design a Google Spanner-scale distributed SQL database handling 10M transactions/sec across 100+ regions with perfect ACID guarantees. Must survive entire continent failures, maintain <5ms P99 latency within regions, support 1PB+ datasets, and operate within $100M/month budget. Implement TrueTime for global consistency, automatic resharding, and seamless schema evolution while serving mission-critical workloads for 1B+ users.

### Functional Requirements

- Process 10M transactions/sec globally
- Distribute across 100+ regions with auto-sharding
- TrueTime-based global consistency
- Zero-downtime schema migrations at scale
- Multi-version concurrency control (MVCC)
- Support 1M+ concurrent connections
- Automatic data rebalancing and healing
- Point-in-time recovery to any second in 30 days

### Non-Functional Requirements

- **Latency:** P99 < 5ms same-region, < 50ms cross-region
- **Request Rate:** 10M transactions/sec, 100M during spikes
- **Dataset Size:** 1PB active data, 10PB historical
- **Availability:** 99.999% with 5-second RTO
- **Consistency:** External consistency (strongest possible)

### Constants/Assumptions

- **l4_enhanced:** true
- **transaction_rate:** 10000000
- **spike_multiplier:** 10
- **data_size_tb:** 1000
- **regions:** 100
- **nodes_per_region:** 50
- **cache_hit_target:** 0.99
- **budget_monthly:** 100000000

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- cache
- stream

### Hints

1. Use Raft for consensus
2. 2-phase commit for transactions

### Tiers/Checkpoints

**T0: Distribution**
  - Minimum 3 of type: db_primary

**T1: Consensus**
  - Minimum 5 of type: db_replica

**T2: Scale**
  - Minimum 30 of type: app

### Reference Solution

Each region has 5-node Raft cluster for consensus. 2-phase commit ensures ACID across regions. CDC stream for async replication. Geo-partitioning keeps data near users. This teaches distributed SQL patterns.

**Components:**
- Global Clients (redirect_client)
- Global LB (lb)
- Data API (app)
- US Region (db_primary)
- EU Region (db_primary)
- APAC Region (db_primary)
- CDC Stream (stream)
- Read Cache (cache)

**Connections:**
- Global Clients → Global LB
- Global LB → Data API
- Data API → US Region
- Data API → EU Region
- Data API → APAC Region
- US Region → CDC Stream
- EU Region → CDC Stream
- APAC Region → CDC Stream
- Data API → Read Cache

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $46,000,000
- Yearly Total: $552,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $30,000,000 (10000 × $100/month per instance)
- Storage: $10,000,000 (Database storage + backup + snapshots)
- Network: $5,000,000 (Ingress/egress + CDN distribution)

---

## 25. Video/Image CDN Storage

**ID:** content-delivery-storage
**Category:** storage
**Difficulty:** Intermediate

### Summary

Multi-tier storage for media delivery

### Goal

Optimize storage costs for media at scale.

### Description

Design a multi-tier storage system for a video/image CDN. Implement hot/warm/cold tiers based on access patterns, with automatic tier migration and cost optimization.

### Functional Requirements

- Store videos and images
- Auto-migrate to cold storage after 30 days
- Restore from cold storage on demand
- Generate multiple resolutions
- Purge based on retention policy
- Track access patterns for tier decisions

### Non-Functional Requirements

- **Latency:** P95 < 10ms hot tier, < 50ms warm, < 500ms cold restore
- **Request Rate:** 500k reads/s, 10k writes/s
- **Dataset Size:** 10PB total (1PB hot, 3PB warm, 6PB cold)
- **Data Durability:** 11 nines durability required
- **Availability:** 99.99% for hot tier, 99.9% for warm/cold
- **Scalability:** 100PB growth over 3 years. Cost-optimize with tiering

### Constants/Assumptions

- **read_qps:** 500000
- **write_qps:** 10000
- **hot_tier_pb:** 1
- **warm_tier_pb:** 3
- **cold_tier_pb:** 6

### Available Components

- client
- cdn
- lb
- app
- cache
- object_store
- queue
- worker

### Hints

1. Use S3 Intelligent-Tiering or Glacier
2. Pre-generate thumbnails for hot tier

### Tiers/Checkpoints

**T0: Storage**
  - Must include: object_store

**T1: Tiers**
  - Minimum 3 of type: object_store

### Reference Solution

CDN caches 92% of requests. Hot tier (S3 Standard) for recent uploads. Warm tier (S3 IA) after 30 days. Cold tier (Glacier) after 90 days. Workers migrate based on access patterns. Cost-optimized with tiering. This teaches multi-tier storage for CDN.

**Components:**
- Users (redirect_client)
- CDN (cdn)
- LB (lb)
- Media API (app)
- Metadata Cache (cache)
- Hot Tier (S3 Standard) (object_store)
- Warm Tier (S3 IA) (object_store)
- Cold Tier (Glacier) (object_store)
- Tiering Queue (queue)
- Tier Migration (worker)

**Connections:**
- Users → CDN
- CDN → LB
- LB → Media API
- Media API → Metadata Cache
- Media API → Hot Tier (S3 Standard)
- Media API → Warm Tier (S3 IA)
- Media API → Cold Tier (Glacier)
- Tiering Queue → Tier Migration
- Tier Migration → Hot Tier (S3 Standard)
- Tier Migration → Warm Tier (S3 IA)
- Tier Migration → Cold Tier (Glacier)

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 26. Amazon DynamoDB Clone

**ID:** multi-model-database
**Category:** storage
**Difficulty:** Advanced

### Summary

DynamoDB-scale 100M requests/sec globally

### Goal

Build DynamoDB-scale multi-model database.

### Description

Design an AWS DynamoDB-scale database handling 100M requests/sec globally across all data models (KV, document, graph, time-series). Must support 10PB+ storage with <1ms P99 latency, survive multiple region failures, auto-scale from 0 to millions QPS in seconds, and operate within $200M/month budget. Implement adaptive capacity, global tables with millisecond replication, and support 100k+ concurrent streams while serving Netflix, Lyft, and Airbnb scale workloads.

### Functional Requirements

- Support 100M requests/sec across all models
- Store 10PB+ with automatic sharding
- Global tables with <100ms replication
- Auto-scale from 0 to 10M QPS in 60 seconds
- Stream 100k+ concurrent change streams
- Adaptive capacity for hot partitions
- Point-in-time recovery to any second
- Support ACID transactions across items

### Non-Functional Requirements

- **Latency:** P99 < 1ms single-region, < 10ms global
- **Request Rate:** 100M requests/sec, 1B during spikes
- **Dataset Size:** 10PB active, 100PB with backups
- **Availability:** 99.999% SLA with automatic failover
- **Consistency:** Eventual (<100ms) or strong consistency

### Constants/Assumptions

- **l4_enhanced:** true
- **request_rate:** 100000000
- **spike_multiplier:** 10
- **storage_pb:** 10
- **partition_size_gb:** 10
- **global_regions:** 25
- **concurrent_streams:** 100000
- **cache_hit_target:** 0.999
- **budget_monthly:** 200000000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- db_replica
- stream
- worker
- queue

### Hints

1. Consistent hashing for partitions
2. Adaptive capacity for hot keys

### Tiers/Checkpoints

**T0: Partitioning**
  - Minimum 10 of type: db_primary

**T1: Caching**
  - Must include: cache

**T2: Streaming**
  - Must include: stream

**T3: Global**
  - Minimum 6 of type: db_replica

### Reference Solution

Consistent hashing distributes data across 100 storage nodes. Request router handles partition lookup. Item cache provides <10ms latency for hot items. Global tables replicate across 6 regions. Auto-scaler adjusts capacity based on CloudWatch metrics. This teaches multi-model database architecture.

**Components:**
- Applications (redirect_client)
- Edge Cache (cdn)
- Request LB (lb)
- Request Router (app)
- Item Cache (cache)
- Storage Nodes (db_primary)
- Global Tables (db_replica)
- Change Streams (stream)
- Auto Scaler (worker)
- Backup Queue (queue)

**Connections:**
- Applications → Edge Cache
- Edge Cache → Request LB
- Request LB → Request Router
- Request Router → Item Cache
- Request Router → Storage Nodes
- Storage Nodes → Global Tables
- Storage Nodes → Change Streams
- Change Streams → Auto Scaler
- Auto Scaler → Storage Nodes
- Change Streams → Backup Queue

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 27. Distributed Transactions (2PC/3PC)

**ID:** distributed-transactions
**Category:** storage
**Difficulty:** Advanced

### Summary

Visa-scale 10M cross-shard TPS

### Goal

Master Google/Visa-scale distributed transactions.

### Description

Implement Visa/Google-scale distributed transactions processing 10M cross-shard transactions/sec across 10k+ database shards globally. Must guarantee ACID even during network partitions, handle coordinator failures in <100ms, survive entire datacenter losses, and operate within $300M/month budget. Support Spanner-style TrueTime, Percolator-style 2PC optimization, and coordinate transactions spanning 100+ shards while maintaining perfect consistency.

### Functional Requirements

- Execute 10M cross-shard transactions/sec
- Coordinate across 10k+ database shards globally
- Spanner-style TrueTime for global ordering
- Percolator optimization for 2PC at scale
- Handle transactions spanning 100+ shards
- Automatic deadlock detection and resolution
- Zero-loss coordinator failover in <100ms
- Support snapshot isolation and serializability

### Non-Functional Requirements

- **Latency:** P99 < 100ms for 2PC, < 200ms for 100-shard txns
- **Request Rate:** 10M distributed txns/sec, 100M during peaks
- **Dataset Size:** 100PB across 10k nodes, 1000+ datacenters
- **Availability:** 99.9999% with automatic coordinator failover
- **Consistency:** Strict serializability across all shards

### Constants/Assumptions

- **l4_enhanced:** true
- **transaction_qps:** 10000000
- **spike_multiplier:** 10
- **shard_count:** 10000
- **avg_shards_per_txn:** 10
- **max_shards_per_txn:** 100
- **coordinator_timeout_ms:** 100
- **cache_hit_target:** 0.99
- **budget_monthly:** 300000000

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- queue
- worker

### Hints

1. Use Paxos for coordinator election
2. Log prepare/commit phases

### Tiers/Checkpoints

**T0: Shards**
  - Minimum 5 of type: db_primary

**T1: Coordinator HA**
  - Must include: worker

**T2: Tx Log**
  - Must include: queue

### Reference Solution

2PC: Coordinator sends PREPARE to all shards, waits for YES votes, then sends COMMIT. 3PC adds PRE-COMMIT phase to handle coordinator failure. Paxos for coordinator election. Transaction log in Kafka for recovery. This teaches distributed transaction protocols at scale.

**Components:**
- Applications (redirect_client)
- LB (lb)
- Tx Coordinator (app)
- Backup Coordinators (worker)
- Tx Log (Kafka) (queue)
- Shard 1 (db_primary)
- Shard 2 (db_primary)
- Shard 3 (db_primary)
- Shard N (db_primary)

**Connections:**
- Applications → LB
- LB → Tx Coordinator
- Tx Coordinator → Backup Coordinators
- Tx Coordinator → Tx Log (Kafka)
- Tx Coordinator → Shard 1
- Tx Coordinator → Shard 2
- Tx Coordinator → Shard 3
- Tx Coordinator → Shard N

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $46,000,000
- Yearly Total: $552,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $30,000,000 (10000 × $100/month per instance)
- Storage: $10,000,000 (Database storage + backup + snapshots)
- Network: $5,000,000 (Ingress/egress + CDN distribution)

---

## 28. Multi-Master Replication

**ID:** multi-master-replication
**Category:** storage
**Difficulty:** Advanced

### Summary

Conflict-free replicated data

### Goal

Learn CRDT and conflict resolution.

### Description

Design a multi-master replicated database. Handle write conflicts, implement CRDTs, and provide eventual consistency with causal ordering.

### Functional Requirements

- Accept writes at any replica
- Detect and resolve conflicts automatically
- Propagate changes between replicas
- Maintain causal consistency
- Support version vectors
- Handle network partitions gracefully
- Provide conflict-free data types

### Non-Functional Requirements

- **Latency:** P95 < 50ms for local writes
- **Request Rate:** 200k writes/sec globally
- **Dataset Size:** 10 replicas, 50TB each
- **Availability:** 99.999% per-replica
- **Consistency:** Eventual with causal ordering

### Constants/Assumptions

- **replica_count:** 10
- **write_qps_per_replica:** 20000
- **conflict_rate:** 0.01
- **propagation_delay_ms:** 100

### Available Components

- client
- lb
- app
- db_primary
- stream
- worker

### Hints

1. Use vector clocks
2. Implement LWW-Element-Set CRDT

### Tiers/Checkpoints

**T0: Replicas**
  - Minimum 5 of type: db_primary

**T1: Propagation**
  - Must include: stream

**T2: Conflict Resolution**
  - Must include: worker

### Reference Solution

Vector clocks track causality. CRDTs (G-Counter, LWW-Register) for conflict-free types. Last-write-wins with timestamps for simple conflicts. Merge workers apply operational transforms. This teaches multi-master replication patterns.

**Components:**
- Global Clients (redirect_client)
- Geo LB (lb)
- Conflict Resolver (app)
- Master US (db_primary)
- Master EU (db_primary)
- Master APAC (db_primary)
- Master SA (db_primary)
- Replication Log (stream)
- Merge Workers (worker)

**Connections:**
- Global Clients → Geo LB
- Geo LB → Conflict Resolver
- Conflict Resolver → Master US
- Conflict Resolver → Master EU
- Conflict Resolver → Master APAC
- Conflict Resolver → Master SA
- Master US → Replication Log
- Master EU → Replication Log
- Master APAC → Replication Log
- Master SA → Replication Log
- Replication Log → Merge Workers

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $920,000
- Yearly Total: $11,040,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $600,000 (200 × $100/month per instance)
- Storage: $200,000 (Database storage + backup + snapshots)
- Network: $100,000 (Ingress/egress + CDN distribution)

---

## 29. Global Inventory with Strong Consistency

**ID:** global-inventory-strong
**Category:** storage
**Difficulty:** Advanced

### Summary

Globally consistent stock levels

### Goal

Learn global strong consistency patterns.

### Description

Design a globally distributed inventory system with strong consistency. Prevent overselling across continents while maintaining low latency.

### Functional Requirements

- Maintain globally consistent stock counts
- Support atomic cross-region transfers
- Prevent overselling under any partition
- Provide linearizable reads
- Handle regional failures gracefully
- Enable global transactions
- Support multi-datacenter writes

### Non-Functional Requirements

- **Latency:** P95 < 100ms same-region, < 300ms cross-region
- **Request Rate:** 100k inventory operations/sec
- **Dataset Size:** 50M SKUs across 10 regions
- **Availability:** 99.99% per region
- **Consistency:** Linearizability required

### Constants/Assumptions

- **sku_count:** 50000000
- **region_count:** 10
- **ops_qps:** 100000
- **cross_region_latency_ms:** 200

### Available Components

- client
- lb
- app
- db_primary
- cache
- worker
- queue

### Hints

1. Use Google Spanner approach
2. TrueTime API for ordering

### Tiers/Checkpoints

**T0: Consensus**
  - Minimum 5 of type: db_primary

**T1: Caching**
  - Must include: cache

**T2: Coordination**
  - Must include: worker

### Reference Solution

Spanner-style TrueTime with GPS+atomic clocks for global ordering. Paxos groups in each zone. Synchronous replication across zones for strong consistency. Read cache for stale-ok reads. This teaches global strong consistency.

**Components:**
- Warehouses (redirect_client)
- Global LB (lb)
- Inventory Service (app)
- Read Cache (cache)
- Tx Coordinators (worker)
- US Zone (db_primary)
- EU Zone (db_primary)
- APAC Zone (db_primary)
- Audit Log (queue)

**Connections:**
- Warehouses → Global LB
- Global LB → Inventory Service
- Inventory Service → Read Cache
- Inventory Service → Tx Coordinators
- Tx Coordinators → US Zone
- Tx Coordinators → EU Zone
- Tx Coordinators → APAC Zone
- Tx Coordinators → Audit Log

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 30. Financial Ledger (Strict ACID)

**ID:** financial-ledger
**Category:** storage
**Difficulty:** Advanced

### Summary

Immutable financial transactions

### Goal

Learn audit-grade transaction systems.

### Description

Design a financial ledger with strict ACID, double-entry bookkeeping, and regulatory compliance. Handle high-value transactions with zero data loss.

### Functional Requirements

- Implement double-entry bookkeeping
- Ensure zero balance drift
- Provide immutable audit trail
- Support complex transaction types
- Enable real-time balance queries
- Handle regulatory reporting
- Prevent any data loss
- Support transaction replay

### Non-Functional Requirements

- **Latency:** P95 < 100ms for transactions
- **Request Rate:** 50k transactions/sec
- **Dataset Size:** 1B accounts, 100B transactions
- **Availability:** 99.999% uptime
- **Consistency:** Strict serializability, zero data loss

### Constants/Assumptions

- **transaction_qps:** 50000
- **account_count:** 1000000000
- **total_transactions:** 100000000000
- **audit_retention_years:** 10

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- storage
- queue
- worker

### Hints

1. Event sourcing pattern
2. CQRS for balance queries

### Tiers/Checkpoints

**T0: ACID**
  - Must include: db_primary

**T1: Immutability**
  - Must include: queue

**T2: Archival**
  - Must include: storage

### Reference Solution

Event sourcing: immutable events in Kafka. Double-entry enforced at application layer. CQRS: async projection to balance tables. WORM storage for compliance. Synchronous replication for durability. This teaches financial-grade systems.

**Components:**
- Financial Apps (redirect_client)
- LB (lb)
- Ledger Service (app)
- Event Log (Kafka) (queue)
- PostgreSQL (db_primary)
- Read Replicas (db_replica)
- Balance Projector (worker)
- WORM Storage (storage)

**Connections:**
- Financial Apps → LB
- LB → Ledger Service
- Ledger Service → Event Log (Kafka)
- Event Log (Kafka) → PostgreSQL
- PostgreSQL → Read Replicas
- Event Log (Kafka) → Balance Projector
- Balance Projector → PostgreSQL
- Event Log (Kafka) → WORM Storage

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 31. Blockchain State Database

**ID:** blockchain-state-db
**Category:** storage
**Difficulty:** Advanced

### Summary

Merkle tree state storage

### Goal

Learn cryptographic data structures.

### Description

Design a blockchain state database with Merkle trees. Support efficient state transitions, proofs, and historical queries.

### Functional Requirements

- Store account balances and smart contract state
- Generate Merkle proofs for state
- Support state snapshots
- Enable fast state root calculation
- Provide historical state queries
- Handle state pruning
- Support light client verification

### Non-Functional Requirements

- **Latency:** P95 < 50ms for state reads
- **Request Rate:** 100k state transitions/sec
- **Dataset Size:** 1B accounts, 10TB state
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **account_count:** 1000000000
- **state_size_tb:** 10
- **block_rate:** 12
- **merkle_depth:** 40

### Available Components

- client
- lb
- app
- db_primary
- cache
- worker
- storage

### Hints

1. Use Merkle Patricia Trie
2. Implement copy-on-write

### Tiers/Checkpoints

**T0: Merkle**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: Snapshots**
  - Must include: storage

### Reference Solution

Merkle Patricia Trie for efficient state root. Copy-on-write for snapshots. Cache frequently accessed accounts. Pruning keeps only recent 128 blocks. S3 for historical snapshots. This teaches blockchain storage architecture.

**Components:**
- Blockchain Nodes (redirect_client)
- LB (lb)
- State Service (app)
- State Cache (cache)
- LevelDB (db_primary)
- Pruning Workers (worker)
- Snapshot S3 (storage)

**Connections:**
- Blockchain Nodes → LB
- LB → State Service
- State Service → State Cache
- State Service → LevelDB
- Pruning Workers → LevelDB
- Pruning Workers → Snapshot S3

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 32. Real-time Gaming State Sync

**ID:** realtime-gaming-state
**Category:** storage
**Difficulty:** Advanced

### Summary

Sub-50ms state synchronization

### Goal

Learn ultra-low latency state sync.

### Description

Design a real-time gaming state synchronization system. Handle player positions, actions, and game state with <50ms latency globally.

### Functional Requirements

- Sync player positions in real-time
- Handle 100+ players per game session
- Resolve conflicting actions
- Support lag compensation
- Enable spectator mode
- Provide match replay
- Handle player disconnections

### Non-Functional Requirements

- **Latency:** P95 < 50ms globally
- **Request Rate:** 1M state updates/sec
- **Dataset Size:** 1M concurrent game sessions
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **concurrent_sessions:** 1000000
- **players_per_session:** 100
- **update_rate_hz:** 60
- **total_update_qps:** 1000000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- stream

### Hints

1. Use WebSocket at edge
2. Client-side prediction

### Tiers/Checkpoints

**T0: Edge**
  - Must include: cdn

**T1: State**
  - Must include: cache

**T2: Replay**
  - Must include: stream

### Reference Solution

Edge PoPs reduce latency. Redis for authoritative state. Client-side prediction with server reconciliation. Delta compression for bandwidth. Event stream for replay. This teaches real-time gaming infrastructure.

**Components:**
- Game Clients (redirect_client)
- Edge PoPs (cdn)
- Session LB (lb)
- Game Servers (app)
- Session State (cache)
- Event Log (stream)
- Match DB (db_primary)

**Connections:**
- Game Clients → Edge PoPs
- Edge PoPs → Session LB
- Session LB → Game Servers
- Game Servers → Session State
- Game Servers → Event Log
- Event Log → Match DB

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 33. Autonomous Vehicle Map Database

**ID:** autonomous-vehicle-map
**Category:** storage
**Difficulty:** Advanced

### Summary

High-precision spatial database

### Goal

Learn geospatial data at scale.

### Description

Design a map database for autonomous vehicles. Store HD maps, handle real-time updates, and support sub-meter precision queries.

### Functional Requirements

- Store HD map data with cm precision
- Support spatial queries (nearby objects)
- Handle real-time map updates
- Provide versioned map tiles
- Enable offline map downloads
- Support route planning queries
- Track dynamic obstacles

### Non-Functional Requirements

- **Latency:** P95 < 10ms for map queries
- **Request Rate:** 10M queries/sec from vehicles
- **Dataset Size:** 1PB HD map data
- **Availability:** 99.999% uptime, sub-10cm accuracy

### Constants/Assumptions

- **query_qps:** 10000000
- **map_size_pb:** 1
- **tile_size_mb:** 100
- **vehicle_count:** 1000000

### Available Components

- client
- cdn
- lb
- app
- db_primary
- cache
- storage

### Hints

1. Use R-tree for spatial index
2. Tile-based storage

### Tiers/Checkpoints

**T0: CDN**
  - Must include: cdn

**T1: Spatial**
  - Must include: db_primary

**T2: Storage**
  - Must include: storage

### Reference Solution

Tile-based approach: 100m x 100m tiles. PostGIS R-tree for spatial queries. CDN serves 95% of map requests. Versioned tiles for updates. Delta encoding for bandwidth. This teaches large-scale geospatial databases.

**Components:**
- Vehicles (redirect_client)
- Map CDN (cdn)
- LB (lb)
- Map API (app)
- Tile Cache (cache)
- PostGIS (db_primary)
- S3 Tiles (storage)

**Connections:**
- Vehicles → Map CDN
- Map CDN → LB
- LB → Map API
- Map API → Tile Cache
- Map API → PostGIS
- Map API → S3 Tiles
- S3 Tiles → Map CDN

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for high-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 30 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.99%
- MTTR: 2 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $46,000,000
- Yearly Total: $552,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $30,000,000 (10000 × $100/month per instance)
- Storage: $10,000,000 (Database storage + backup + snapshots)
- Network: $5,000,000 (Ingress/egress + CDN distribution)

---

## 34. Petabyte-Scale Data Lake

**ID:** petabyte-data-lake
**Category:** storage
**Difficulty:** Advanced

### Summary

Exabyte-ready data lake

### Goal

Learn data lake architecture at scale.

### Description

Design a petabyte-scale data lake. Handle diverse data formats, enable efficient analytics, and support both batch and streaming ingestion.

### Functional Requirements

- Ingest data from 1000s of sources
- Store raw, processed, and curated data
- Support multiple file formats (Parquet, ORC, Avro)
- Enable schema evolution
- Provide data catalog and lineage
- Support time travel queries
- Enable data governance and compliance

### Non-Functional Requirements

- **Latency:** P95 < 1s for metadata queries, minutes for analytics
- **Request Rate:** 100k files/sec ingestion
- **Dataset Size:** 1PB+ multi-format data
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **storage_pb:** 1
- **ingestion_files_per_sec:** 100000
- **query_concurrency:** 10000
- **data_sources:** 10000

### Available Components

- client
- lb
- stream
- worker
- storage
- db_primary
- search
- app

### Hints

1. Use Delta Lake format
2. Hive metastore for catalog

### Tiers/Checkpoints

**T0: Storage**
  - Must include: storage

**T1: Catalog**
  - Must include: db_primary

**T2: Processing**
  - Must include: worker

### Reference Solution

Bronze/Silver/Gold layers in S3. Delta Lake for ACID on S3. Hive metastore for schema. Spark workers for ETL. Presto for ad-hoc queries. Data catalog for discovery. This teaches data lake architecture at scale.

**Components:**
- Data Sources (redirect_client)
- Kafka (stream)
- ETL Workers (worker)
- S3 Data Lake (storage)
- Hive Metastore (db_primary)
- Data Catalog (search)
- Query Engine (app)

**Connections:**
- Data Sources → Kafka
- Kafka → ETL Workers
- ETL Workers → S3 Data Lake
- ETL Workers → Hive Metastore
- S3 Data Lake → Data Catalog
- Hive Metastore → Data Catalog
- Query Engine → S3 Data Lake
- Query Engine → Hive Metastore

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 35. AWS EBS-like Block Storage

**ID:** block-storage
**Category:** storage
**Difficulty:** Advanced

### Summary

Network-attached block storage with snapshots

### Goal

Design durable, high-performance block storage.

### Description

Design a distributed block storage system like AWS EBS. Provide durable volumes attached to compute instances, support snapshots, replication, and handle failures gracefully.

### Functional Requirements

- Attach volumes to compute instances
- Replicate blocks across availability zones
- Create point-in-time snapshots
- Restore volumes from snapshots
- Support volume resizing
- Handle node failures transparently

### Non-Functional Requirements

- **Latency:** P50 < 1ms, P95 < 3ms, P99 < 10ms for block I/O
- **Request Rate:** 100k IOPS per volume, millions globally
- **Dataset Size:** 1PB total across all volumes. 16TB max volume size
- **Data Durability:** 11 nines annual durability via replication
- **Availability:** 99.99% availability with auto-failover
- **Scalability:** Millions of volumes, thousands of snapshots per volume

### Constants/Assumptions

- **iops_per_volume:** 100000
- **volume_size_tb:** 16
- **replication_factor:** 3
- **snapshot_retention_days:** 90

### Available Components

- client
- lb
- app
- db_primary
- object_store
- cache
- worker

### Hints

1. Use chain replication for writes
2. Incremental snapshots to object store

### Tiers/Checkpoints

**T0: Storage**
  - Must include: app

**T1: Replication**
  - Minimum 3 of type: app

**T2: Snapshots**
  - Must include: object_store

### Reference Solution

3-way replication across AZs for durability. Chain replication for consistent writes. Block cache for read performance. Metadata DB tracks volume-to-node mapping. Incremental snapshots to object store. Auto-failover on node failure. This teaches distributed block storage.

**Components:**
- VMs (redirect_client)
- Volume Router (lb)
- Primary Nodes (app)
- Replica Nodes (app)
- Replica Nodes 2 (app)
- Block Cache (cache)
- Volume Metadata (db_primary)
- Snapshot Storage (object_store)
- Snapshot Workers (worker)

**Connections:**
- VMs → Volume Router
- Volume Router → Primary Nodes
- Primary Nodes → Replica Nodes
- Primary Nodes → Replica Nodes 2
- Primary Nodes → Block Cache
- Primary Nodes → Volume Metadata
- Snapshot Workers → Snapshot Storage
- Primary Nodes → Snapshot Workers

### Solution Analysis

**Architecture Overview:**

Distributed storage architecture for moderate-scale data persistence. Primary-replica pattern with automated backups and point-in-time recovery.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Read replicas handle queries while primary handles writes.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Read replicas scale out, write buffering engages.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through automatic failover to standby replicas. Automatic failover ensures continuous operation.
- Redundancy: Multi-AZ deployment with synchronous replication
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Current Architecture
   - Pros:
     - Proven pattern
     - Well understood
   - Cons:
     - May not be optimal for all cases
   - Best for: Standard web applications
   - Cost: Predictable costs

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---
