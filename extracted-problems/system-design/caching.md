# System Design - CACHING Problems

Total Problems: 35

---

## 1. Reddit Comment System

**ID:** basic-web-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

L4-level caching for viral content

### Goal

Handle Reddit-scale traffic with Obama AMA-level spikes

### Description

Design a Reddit-scale comment system handling 5M reads/sec during normal operation and 50M reads/sec during viral events (like Obama's AMA). Implement multi-layer caching, hot-key protection, and graceful degradation. System must survive cache failures and maintain sub-100ms P99 latency.

### Functional Requirements

- Serve comment threads at 5M QPS (normal) and 50M QPS (viral)
- Support real-time comment updates and vote counting
- Implement hot-key protection for viral threads
- Handle cache stampede during failures
- Provide consistent view of comment hierarchy
- Support comment collapsing and pagination

### Non-Functional Requirements

- **Latency:** P99 < 100ms normal, P99 < 500ms during viral spike
- **Request Rate:** 5M reads/sec, 50k writes/sec normal. 50M reads/sec viral spike
- **Dataset Size:** 100TB comments, 1PB with media. Hot set: 10GB in cache
- **Data Durability:** No data loss. Eventually consistent within 1 second
- **Availability:** 99.99% uptime. Survive single region failure

### Constants/Assumptions

- **l4_enhanced:** true
- **read_qps:** 5000000
- **write_qps:** 50000
- **spike_multiplier:** 10
- **cache_hit_target:** 0.98
- **app_capacity_per_instance:** 2000
- **db_read_capacity:** 50000
- **budget_monthly:** 100000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- db_replica
- stream

### Hints

1. Use CDN for static comment rendering
2. Implement request coalescing for hot keys
3. Consider read-through cache with TTL jitter
4. Use write-behind for vote counting

### Tiers/Checkpoints

**T0: Scale**
  - Minimum 2500 of type: app

**T1: CDN**
  - Must include: cdn

**T2: Cache Layer**
  - Must include: cache
  - Parameter range check: cache.hit_rate

**T3: Database**
  - Must include: db_primary
  - Minimum 10 of type: db_replica

**T4: Reliability**
  - Must include: lb
  - Must include: stream

### Reference Solution

Multi-tier caching handles Reddit scale: CDN (90% hit) → Redis (98% hit) → Memcached (95% hit) → DB replicas. Request coalescing prevents cache stampede. Kafka handles async vote updates. System survives cache failures via graceful degradation.

**Components:**
- Global Users (redirect_client)
- CloudFront (cdn)
- ALB (lb)
- API Fleet (app)
- Redis Cluster (cache)
- Memcached (cache)
- Kafka (stream)
- Aurora Primary (db_primary)
- Aurora Replicas (db_replica)

**Connections:**
- Global Users → CloudFront
- CloudFront → ALB
- ALB → API Fleet
- API Fleet → Redis Cluster
- API Fleet → Memcached
- API Fleet → Kafka
- Redis Cluster → Aurora Primary
- Memcached → Aurora Replicas
- Kafka → Aurora Primary

### Solution Analysis

**Architecture Overview:**

This Reddit-scale architecture uses multi-tier caching to handle 5M QPS normal and 50M QPS during viral events. CloudFront CDN serves 90% of requests from edge locations globally. Redis cluster with 100 nodes provides sub-millisecond access to hot comment threads using consistent hashing. Memcached handles session data and secondary caching. Request coalescing in the app layer prevents cache stampede on viral threads. Kafka enables async vote processing to avoid write bottlenecks. Aurora with 15 read replicas handles persistent storage with automatic failover.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5M QPS, the system operates efficiently with CDN serving 90% of traffic (4.5M QPS), leaving only 500K QPS for the origin. Redis handles comment data with 98% hit rate, so only 10K QPS reaches the database. The app fleet of 3000 instances easily handles this load at ~167 QPS per instance. Vote updates flow through Kafka at 50K writes/sec, batched for efficient database writes.
- Latency: P50: 20ms, P95: 50ms, P99: 100ms
- Throughput: 5M reads/sec, 50K writes/sec
- Error Rate: < 0.01%
- Cost/Hour: $2500

*Peak Load:*
During viral events (Obama AMA), traffic spikes 10x to 50M QPS. CDN hit rate increases to 95% for viral content due to popularity, serving 47.5M QPS. Redis implements request coalescing - multiple requests for the same viral thread wait for a single backend fetch. App fleet auto-scales to 10,000 instances within 2 minutes. Kafka partitions increase to 2000 for higher write throughput. Read replicas scale to 30 instances.
- Scaling Approach: Horizontal auto-scaling triggered by CPU > 70%. Pre-warming based on trend detection. Request coalescing for hot keys. Adaptive TTLs increase for viral content. Circuit breakers prevent cascade failures.
- Latency: P50: 30ms, P95: 200ms, P99: 500ms
- Throughput: 50M reads/sec, 500K writes/sec
- Cost/Hour: $15000

*Failure Scenarios:*
System designed to handle multiple failure scenarios. If Redis cluster fails, app servers fall back to Memcached then database with exponential backoff. If CDN fails, origin can handle 10% of peak traffic (5M QPS) allowing degraded service. Database read replica failures handled by Aurora automatic failover in <30 seconds. Kafka designed for at-least-once delivery - duplicate votes deduplicated in database.
- Redundancy: Multi-region active-passive with 3 availability zones per region. Each cache tier can fail independently. Database uses Aurora global database for cross-region replication.
- Failover Time: CDN: instant fallback, Cache: <1 second, Database: <30 seconds, Full region: <5 minutes
- Data Loss Risk: Zero data loss for committed writes. Maximum 1 second of vote updates during Kafka failure.
- Availability: 99.99% (52 minutes downtime/year)
- MTTR: 5 minutes for full recovery

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - Excellent hit rates
     - Graceful degradation
     - Cost efficient at scale
   - Cons:
     - Complex cache invalidation
     - Higher operational overhead
     - Potential consistency issues
   - Best for: High-traffic applications with clear hot/cold data patterns
   - Cost: Higher upfront cost but 10x savings vs. serving from database

2. Single Redis Layer
   - Pros:
     - Simpler architecture
     - Easier consistency
     - Lower operational complexity
   - Cons:
     - Single point of failure
     - Limited to Redis throughput
     - More expensive at scale
   - Best for: Applications under 1M QPS with simpler caching needs
   - Cost: 50% lower operational cost but 3x higher infrastructure cost at scale

3. Edge Computing with Cloudflare Workers
   - Pros:
     - Global distribution
     - Serverless scaling
     - Built-in DDoS protection
   - Cons:
     - Vendor lock-in
     - Limited compute at edge
     - Cold starts possible
   - Best for: Globally distributed apps with light compute needs
   - Cost: Pay-per-request model, cost-effective under 10M requests/day

**Cost Analysis:**

- Monthly Total: $400,000
- Yearly Total: $4,800,000
- Cost per Request: $0.000016 per request at 5M QPS

*Breakdown:*
- Compute: $250,000 (3000 instances × $250/month + Lambda execution costs)
- Storage: $50,000 (Aurora: $30K, Redis: $15K, S3: $5K)
- Network: $100,000 (CDN: $80K for 500TB transfer, NAT: $15K, Cross-AZ: $5K)

---

## 2. Static Content CDN

**ID:** static-content-cdn
**Category:** caching
**Difficulty:** Easy

### Summary

Serve images and CSS from edge locations

### Goal

Deliver static assets with <50ms latency globally.

### Description

Design a CDN for a news website serving static content like images, CSS, and JavaScript files. Learn about edge caching, cache headers, and origin shields. This introduces geographic distribution and browser caching concepts.

### Functional Requirements

- Serve static assets (images, CSS, JS) from edge locations
- Configure browser cache headers (Cache-Control, ETag)
- Implement origin shield to reduce origin load
- Support cache purge for updated content
- Monitor CDN hit rate and bandwidth savings

### Non-Functional Requirements

- **Latency:** P95 < 50ms globally for cached content, P99 < 200ms for origin fetch
- **Request Rate:** 20k requests/sec for static assets. 95% should be cache hits
- **Dataset Size:** 10GB of static content. Average file 100KB. 100k unique assets
- **Data Durability:** Origin stores master copies. CDN cache is ephemeral
- **Availability:** 99.9% uptime. Fallback to origin on CDN failure

### Constants/Assumptions

- **global_qps:** 20000
- **cdn_hit_target:** 0.95
- **origin_capacity:** 2000
- **edge_locations:** 10

### Available Components

- client
- cdn
- app
- object_store

### Hints

1. CDN should handle most traffic
2. Use long cache TTLs for versioned assets

### Tiers/Checkpoints

**T0: Origin**
  - Must include: object_store

**T1: CDN**
  - Must include: cdn

**T2: Performance**
  - Parameter range check: cdn.hit_rate

### Reference Solution

CDN serves 95% of requests from edge caches, reducing origin load to just 1k QPS. Static assets use versioned filenames allowing infinite cache TTL. Browser caching further reduces requests. This teaches edge caching fundamentals.

**Components:**
- Global Users (redirect_client)
- CloudFront CDN (cdn)
- Origin Server (app)
- S3 Bucket (object_store)

**Connections:**
- Global Users → CloudFront CDN
- CloudFront CDN → Origin Server
- Origin Server → S3 Bucket

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 20,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (200,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 200,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000887

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 3. User Session Store

**ID:** session-store-basic
**Category:** caching
**Difficulty:** Easy

### Summary

Fast session lookups with Redis

### Goal

Authenticate users with <10ms session validation.

### Description

Build a session management system for a web application. Store session tokens in Redis with appropriate TTLs and implement sliding window expiration. Learn about session consistency and the importance of fast authentication checks.

### Functional Requirements

- Store user sessions with 30-minute TTL
- Implement sliding window expiration on activity
- Support session invalidation on logout
- Handle concurrent session updates safely
- Provide session count per user for security

### Non-Functional Requirements

- **Latency:** P95 < 10ms for session validation, P99 < 20ms
- **Request Rate:** 10k requests/sec (9k reads, 1k writes)
- **Dataset Size:** 1M active sessions. 1KB per session. Total ~1GB
- **Data Durability:** Sessions can be ephemeral but prefer persistence
- **Availability:** 99.99% uptime. Authentication must always work

### Constants/Assumptions

- **read_qps:** 9000
- **write_qps:** 1000
- **session_ttl_minutes:** 30
- **cache_capacity:** 10000

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Sessions are perfect for in-memory storage
2. Use SETEX for automatic expiration

### Tiers/Checkpoints

**T0: Service**
  - Must have connection from: redirect_client

**T1: Storage**
  - Must include: cache

**T2: Speed**
  - Parameter range check: cache.hit_rate

### Reference Solution

Redis provides sub-10ms session lookups with automatic TTL expiration. Write-through ensures no session loss. Sliding window keeps active users logged in. This teaches session management patterns and importance of fast auth.

**Components:**
- Web Users (redirect_client)
- Load Balancer (lb)
- Auth Service (app)
- Redis Sessions (cache)

**Connections:**
- Web Users → Load Balancer
- Load Balancer → Auth Service
- Auth Service → Redis Sessions

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 4. Database Query Cache

**ID:** database-query-cache
**Category:** caching
**Difficulty:** Easy

### Summary

Cache expensive SQL query results

### Goal

Reduce database CPU usage by 50% with query caching.

### Description

Implement query result caching for an analytics dashboard showing aggregate metrics. Learn to identify expensive queries, implement query fingerprinting, and handle cache invalidation when underlying data changes.

### Functional Requirements

- Cache results of expensive analytical queries
- Implement query fingerprinting for cache keys
- Invalidate cache when source data updates
- Support partial cache invalidation by table
- Monitor cache effectiveness and query patterns

### Non-Functional Requirements

- **Latency:** P95 < 100ms for cached queries, P99 < 2s for cache misses
- **Request Rate:** 1k dashboard loads/sec generating 10k queries/sec
- **Dataset Size:** 10GB of cached query results. Average result 10KB
- **Data Durability:** Cache can be rebuilt from database
- **Availability:** 99.9% uptime. Fallback to direct DB queries

### Constants/Assumptions

- **read_qps:** 10000
- **cache_hit_target:** 0.5
- **app_capacity_per_instance:** 2000
- **db_read_capacity:** 5000

### Available Components

- client
- app
- cache
- db_primary
- db_replica
- lb

### Hints

1. Hash query + params for cache key
2. Use short TTL for frequently changing data

### Tiers/Checkpoints

**T0: Database**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: CPU Reduction**
  - Parameter range check: cache.hit_rate

### Reference Solution

Query cache reduces database CPU by 60% by caching expensive aggregations. Query fingerprinting creates consistent cache keys. 5-minute TTL balances freshness with performance. This teaches query optimization through caching.

**Components:**
- Dashboard Users (redirect_client)
- Load Balancer (lb)
- Analytics API (app)
- Query Cache (cache)
- Analytics DB (db_primary)
- Read Replica (db_replica)

**Connections:**
- Dashboard Users → Load Balancer
- Load Balancer → Analytics API
- Analytics API → Query Cache
- Analytics API → Analytics DB
- Analytics API → Read Replica

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 5. API Rate Limit Counter

**ID:** api-rate-limit-cache
**Category:** caching
**Difficulty:** Easy

### Summary

Track API usage with sliding windows

### Goal

Enforce 1000 req/hour limits with minimal latency.

### Description

Build a rate limiting system using Redis to track API usage per user. Implement sliding window counters and learn about atomic operations, expiring keys, and the trade-offs between precision and performance.

### Functional Requirements

- Track API calls per user per hour
- Implement sliding window rate limiting
- Return remaining quota in response headers
- Support different limits for different tiers
- Reset counters at window boundaries

### Non-Functional Requirements

- **Latency:** P95 < 5ms for rate limit checks, P99 < 10ms
- **Request Rate:** 50k API requests/sec to validate
- **Dataset Size:** 100k active users. 100 bytes per counter
- **Data Durability:** Counters can be lost on failure
- **Availability:** 99.9% uptime. Fail open if cache unavailable

### Constants/Assumptions

- **read_qps:** 50000
- **rate_limit_per_hour:** 1000
- **active_users:** 100000
- **cache_write_capacity:** 100000

### Available Components

- client
- lb
- app
- cache

### Hints

1. Use INCR with EXPIRE for atomic operations
2. Sliding window needs multiple buckets

### Tiers/Checkpoints

**T0: Gateway**
  - Must have connection from: redirect_client

**T1: Counter Store**
  - Must include: cache

**T2: Performance**
  - Minimum 5 of type: app

### Reference Solution

Redis provides atomic INCR operations for accurate counting. Sliding window uses multiple time buckets for precision. Sub-5ms checks enable inline rate limiting. This teaches distributed counting and rate limit patterns.

**Components:**
- API Clients (redirect_client)
- Load Balancer (lb)
- API Gateway (app)
- Redis Counters (cache)

**Connections:**
- API Clients → Load Balancer
- Load Balancer → API Gateway
- API Gateway → Redis Counters

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 6. E-commerce Product Cache

**ID:** product-catalog-cache
**Category:** caching
**Difficulty:** Easy

### Summary

Cache product details and inventory

### Goal

Serve product pages with <100ms latency during sales.

### Description

Design a caching layer for an e-commerce site handling Black Friday traffic. Cache product details, prices, and inventory while ensuring consistency during rapid inventory changes. Learn about cache warming and thundering herd prevention.

### Functional Requirements

- Cache product details, prices, and images
- Update inventory counts in near real-time
- Warm cache before sales events
- Prevent thundering herd on popular items
- Support cache invalidation for price changes

### Non-Functional Requirements

- **Latency:** P95 < 100ms for product pages, P99 < 200ms during sales
- **Request Rate:** 100k requests/sec during Black Friday (10x normal)
- **Dataset Size:** 1M products. Average 5KB per product. Total ~5GB
- **Data Durability:** Source of truth in database. Cache is ephemeral
- **Availability:** 99.95% during sales events

### Constants/Assumptions

- **read_qps:** 100000
- **normal_qps:** 10000
- **product_count:** 1000000
- **cache_hit_target:** 0.9
- **db_read_capacity:** 10000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- queue

### Hints

1. Pre-warm popular products
2. Use cache locks to prevent stampedes

### Tiers/Checkpoints

**T0: Basic**
  - Must include: cache

**T1: Scale**
  - Minimum 20 of type: app

**T2: Performance**
  - Parameter range check: cache.hit_rate

### Reference Solution

Multi-layer caching handles 10x traffic spike. CDN serves images, Redis caches products with 92% hit rate. Cache warming queue pre-loads popular items. Distributed locks prevent thundering herd. This teaches cache strategy for traffic spikes.

**Components:**
- Shoppers (redirect_client)
- Image CDN (cdn)
- Load Balancer (lb)
- Web Servers (app)
- Product Cache (cache)
- Product DB (db_primary)
- Warm Queue (queue)

**Connections:**
- Shoppers → Image CDN
- Image CDN → Load Balancer
- Load Balancer → Web Servers
- Web Servers → Product Cache
- Web Servers → Product DB
- Web Servers → Warm Queue

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 7. Gaming Leaderboard Cache

**ID:** gaming-leaderboard-cache
**Category:** caching
**Difficulty:** Easy

### Summary

Real-time rankings with Redis sorted sets

### Goal

Display top 100 players with <50ms updates.

### Description

Build a real-time leaderboard system for a mobile game. Use Redis sorted sets for efficient ranking operations and learn about atomic score updates, range queries, and the trade-offs between accuracy and performance.

### Functional Requirements

- Track player scores in real-time
- Display top 100 global rankings
- Show player rank and nearby players
- Support multiple leaderboards (daily/weekly/all-time)
- Handle concurrent score updates atomically

### Non-Functional Requirements

- **Latency:** P95 < 50ms for rank queries, P99 < 100ms for updates
- **Request Rate:** 20k score updates/sec, 50k rank queries/sec
- **Dataset Size:** 10M players. 100 bytes per player entry
- **Data Durability:** Persist to database, cache can be rebuilt
- **Availability:** 99.9% uptime. Degrade to stale data if needed

### Constants/Assumptions

- **update_qps:** 20000
- **query_qps:** 50000
- **total_players:** 10000000
- **top_n:** 100

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. ZADD for updates, ZREVRANGE for top N
2. Pipeline commands for efficiency

### Tiers/Checkpoints

**T0: API**
  - Must have connection from: redirect_client

**T1: Rankings**
  - Must include: cache

**T2: Scale**
  - Minimum 10 of type: app

### Reference Solution

Redis sorted sets provide O(log N) updates and O(log N + M) range queries. Write-through ensures durability. Pipelining reduces latency. Multiple sorted sets handle different time windows. This teaches specialized data structures for rankings.

**Components:**
- Game Clients (redirect_client)
- Load Balancer (lb)
- Game API (app)
- Redis Leaderboard (cache)
- Score DB (db_primary)

**Connections:**
- Game Clients → Load Balancer
- Load Balancer → Game API
- Game API → Redis Leaderboard
- Game API → Score DB

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 8. Location-Based Search Cache

**ID:** geo-location-cache
**Category:** caching
**Difficulty:** Easy

### Summary

Cache nearby places with geohashing

### Goal

Find nearby restaurants in <100ms.

### Description

Implement location-based caching for a maps application. Learn about geohashing, spatial indexing, and how to cache results for common search areas. Understand the trade-offs between cache granularity and hit rates.

### Functional Requirements

- Cache search results by geographic area
- Implement geohash-based cache keys
- Support different radius searches (1km, 5km, 10km)
- Invalidate cache when businesses update
- Handle overlapping search areas efficiently

### Non-Functional Requirements

- **Latency:** P95 < 100ms for cached areas, P99 < 500ms for new searches
- **Request Rate:** 10k searches/sec across major cities
- **Dataset Size:** 10M businesses. 1KB per business. Cache top areas
- **Data Durability:** Business data in database, cache is derived
- **Availability:** 99.9% uptime. Fallback to database search

### Constants/Assumptions

- **search_qps:** 10000
- **businesses:** 10000000
- **cache_hit_target:** 0.6
- **popular_areas:** 1000

### Available Components

- client
- lb
- app
- cache
- db_primary
- search

### Hints

1. Geohash provides hierarchical spatial keys
2. Cache at multiple precision levels

### Tiers/Checkpoints

**T0: API**
  - Must have connection from: redirect_client

**T1: Cache**
  - Must include: cache

**T2: Search**
  - Must include: search

### Reference Solution

Geohash-based keys enable hierarchical caching of spatial data. Popular areas cached at multiple precision levels. ElasticSearch provides geo queries for cache misses. This teaches spatial caching strategies.

**Components:**
- Mobile Apps (redirect_client)
- Load Balancer (lb)
- Location API (app)
- Geo Cache (cache)
- ElasticSearch (search)
- Business DB (db_primary)

**Connections:**
- Mobile Apps → Load Balancer
- Load Balancer → Location API
- Location API → Geo Cache
- Location API → ElasticSearch
- ElasticSearch → Business DB

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 9. Application Config Cache

**ID:** config-cache-basic
**Category:** caching
**Difficulty:** Easy

### Summary

Distribute configs with local caching

### Goal

Serve configs in <5ms with consistency.

### Description

Build a configuration distribution system with local caching at each service. Learn about pull vs push models, cache consistency across nodes, and how to handle config updates without service restarts.

### Functional Requirements

- Cache application configs locally on each server
- Support hot reload without restarts
- Implement version tracking for rollbacks
- Notify services of config changes
- Provide audit log of config changes

### Non-Functional Requirements

- **Latency:** P95 < 5ms for config reads (local cache)
- **Request Rate:** 100k config reads/sec across all services
- **Dataset Size:** 10k config keys. 100KB total config data
- **Data Durability:** Configs must be persistent and versioned
- **Availability:** 99.99% uptime. Services must start with cached configs

### Constants/Assumptions

- **read_qps:** 100000
- **config_keys:** 10000
- **service_count:** 100
- **update_frequency_per_hour:** 10

### Available Components

- client
- app
- cache
- db_primary
- stream

### Hints

1. Local cache with periodic refresh
2. Use pub/sub for instant updates

### Tiers/Checkpoints

**T0: Service**
  - Must include: db_primary

**T1: Cache**
  - Must include: cache

**T2: Updates**
  - Must include: stream

### Reference Solution

Two-tier caching: shared Redis cache and local in-memory cache on each service. Change stream notifies services to refresh. Local cache provides <5ms reads. This teaches distributed config management patterns.

**Components:**
- Services (redirect_client)
- Config Service (app)
- Shared Cache (cache)
- Config DB (db_primary)
- Change Stream (stream)

**Connections:**
- Services → Config Service
- Config Service → Shared Cache
- Config Service → Config DB
- Config Service → Change Stream
- Services → Change Stream

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 10. Twitter-like Timeline Cache

**ID:** social-feed-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Hybrid push/pull for personalized feeds

### Goal

Serve timelines in <100ms for 100M users.

### Description

Design a caching system for social media timelines combining push model for celebrities and pull model for regular users. Learn about fanout strategies, cache memory optimization, and handling hot users with millions of followers.

### Functional Requirements

- Cache home timelines for active users
- Handle celebrity posts with millions of followers
- Support real-time updates for online users
- Implement hybrid push/pull based on follower count
- Cache user timelines and recent posts
- Invalidate stale content after edits/deletes

### Non-Functional Requirements

- **Latency:** P95 < 100ms for timeline fetch, P99 < 200ms
- **Request Rate:** 500k timeline requests/sec, 10k posts/sec
- **Dataset Size:** 100M users, 1B daily posts, cache 7 days of content
- **Data Durability:** Posts in database, timeline cache can be rebuilt
- **Availability:** 99.95% uptime. Degrade to pull model if needed

### Constants/Assumptions

- **read_qps:** 500000
- **write_qps:** 10000
- **total_users:** 100000000
- **celebrity_threshold:** 10000
- **cache_days:** 7

### Available Components

- client
- lb
- app
- cache
- db_primary
- db_replica
- queue
- stream

### Hints

1. Push to cache for normal users, pull for celebrities
2. Use bloom filters to track seen posts

### Tiers/Checkpoints

**T0: Service**
  - Must include: cache

**T1: Fanout**
  - Must include: queue

**T2: Scale**
  - Minimum 50 of type: app

### Reference Solution

Hybrid approach: push model pre-generates timelines for users with <10k followers, pull model assembles celebrity timelines on-demand. Two-tier caching for timelines and posts. Fanout queue handles async timeline generation. Stream provides real-time updates.

**Components:**
- Users (redirect_client)
- Load Balancer (lb)
- Timeline Service (app)
- Timeline Cache (cache)
- Post Cache (cache)
- Post DB (db_primary)
- Read Replicas (db_replica)
- Fanout Queue (queue)
- Live Updates (stream)

**Connections:**
- Users → Load Balancer
- Load Balancer → Timeline Service
- Timeline Service → Timeline Cache
- Timeline Service → Post Cache
- Timeline Service → Post DB
- Timeline Service → Read Replicas
- Timeline Service → Fanout Queue
- Timeline Service → Live Updates

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 11. Netflix-like Video CDN

**ID:** video-streaming-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

YouTube-scale 500M concurrent 4K/8K streams

### Goal

Build YouTube/Netflix-scale global video CDN.

### Description

Design a YouTube/Netflix-scale video CDN delivering 500M concurrent 4K/8K streams globally across 10k+ edge POPs. Must start playback in <200ms, handle viral videos (10B views in 1 hour), survive entire CDN region failures, and operate within $1B/month budget. Support live streaming for World Cup (2B viewers), ML-based predictive caching, and serve 1 exabit/day while optimizing for ISP peering agreements.

### Functional Requirements

- Stream 500M concurrent 4K/8K videos globally
- Support 100M concurrent live viewers (World Cup scale)
- ML-based predictive prefetch with 90% accuracy
- Cache at 10k+ edge POPs worldwide
- Adaptive bitrate from 144p to 8K HDR
- Handle viral videos (10B views/hour)
- Multi-CDN orchestration with failover
- ISP cache cooperation and peering optimization

### Non-Functional Requirements

- **Latency:** P99 < 200ms video start globally, < 500ms during spikes
- **Request Rate:** 500M concurrent streams, 5B during viral events
- **Dataset Size:** 100M titles, 10 quality levels, 100TB per edge POP
- **Availability:** 99.999% for top 1000 titles, 99.99% overall

### Constants/Assumptions

- **l4_enhanced:** true
- **concurrent_streams:** 500000000
- **spike_multiplier:** 10
- **video_catalog:** 100000000
- **quality_levels:** 10
- **edge_pops:** 10000
- **storage_per_pop_tb:** 100
- **ml_accuracy_target:** 0.9
- **budget_monthly:** 1000000000

### Available Components

- client
- cdn
- lb
- app
- cache
- object_store
- queue

### Hints

1. Cache popular content at edge
2. Use ML for prefetch predictions

### Tiers/Checkpoints

**T0: CDN**
  - Parameter range check: cdn.hit_rate

**T1: Origin**
  - Must include: object_store

**T2: Prefetch**
  - Must include: queue

### Reference Solution

Three-tier caching: edge CDN (80% hit), origin cache (90% hit), object storage. Predictive prefetching moves content to edge before viewing. Adaptive bitrate allows quality degradation under load. This teaches hierarchical caching for media.

**Components:**
- Viewers (redirect_client)
- Edge CDN (cdn)
- Origin LB (lb)
- Streaming API (app)
- Origin Cache (cache)
- Video Store (object_store)
- Prefetch Queue (queue)

**Connections:**
- Viewers → Edge CDN
- Edge CDN → Origin LB
- Origin LB → Streaming API
- Streaming API → Origin Cache
- Streaming API → Video Store
- Streaming API → Prefetch Queue

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 12. Google-like Search Suggestions

**ID:** search-suggestion-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Google-scale 10M keystrokes/sec autocomplete

### Goal

Build Google Search-scale autocomplete.

### Description

Design a Google Search-scale autocomplete system handling 10M keystrokes/sec from 2B+ daily users globally. Must return suggestions in <20ms using distributed tries, handle 100+ languages, survive datacenter failures, and operate within $200M/month budget. Support real-time trending integration (within 1 minute), personalized suggestions for 5B+ users, and maintain 99.999% availability while serving suggestions from 100T+ query corpus.

### Functional Requirements

- Process 10M keystrokes/sec globally
- Return suggestions in <20ms P99 latency
- Support 100+ languages and scripts
- Personalize for 5B+ user profiles
- Update trending topics within 60 seconds
- Distributed trie with 100T+ unique queries
- ML-based ranking and query understanding
- Voice and visual search integration

### Non-Functional Requirements

- **Latency:** P99 < 20ms per keystroke, P99.9 < 50ms
- **Request Rate:** 10M keystrokes/sec, 100M during events
- **Dataset Size:** 100T unique queries, 1B trending topics
- **Availability:** 99.999% uptime globally

### Constants/Assumptions

- **l4_enhanced:** true
- **keystroke_qps:** 10000000
- **spike_multiplier:** 10
- **unique_queries:** 100000000000000
- **cached_prefixes:** 100000000
- **languages:** 100
- **user_profiles:** 5000000000
- **p99_latency_ms:** 20
- **budget_monthly:** 200000000

### Available Components

- client
- lb
- app
- cache
- search
- db_primary
- stream

### Hints

1. Trie structure for prefix matching
2. Bloom filter for existence checks

### Tiers/Checkpoints

**T0: API**
  - Must include: cache

**T1: Search**
  - Must include: search

**T2: Trending**
  - Must include: stream

### Reference Solution

Dual cache: trie-based prefix cache for global suggestions, personal cache for user history. Search index provides fallback. Trending stream updates popular suggestions. Blending algorithm combines sources based on confidence scores.

**Components:**
- Search Box (redirect_client)
- Load Balancer (lb)
- Suggestion API (app)
- Trie Cache (cache)
- Personal Cache (cache)
- Query Index (search)
- Trending Stream (stream)

**Connections:**
- Search Box → Load Balancer
- Load Balancer → Suggestion API
- Suggestion API → Trie Cache
- Suggestion API → Personal Cache
- Suggestion API → Query Index
- Suggestion API → Trending Stream

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 13. News Aggregator with Trending

**ID:** news-aggregator-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Time-based cache with popularity decay

### Goal

Surface trending news with real-time updates.

### Description

Build a news aggregation system that combines multiple sources, detects trending topics, and caches articles with time-based decay. Learn about cache warming, content deduplication, and real-time trend detection.

### Functional Requirements

- Aggregate news from 100+ sources
- Detect and cache trending topics
- Implement time-decay for article relevance
- Deduplicate similar stories across sources
- Personalize cache based on user interests
- Update rankings in real-time

### Non-Functional Requirements

- **Latency:** P95 < 100ms for homepage, P99 < 200ms for personalized
- **Request Rate:** 100k requests/sec, 1k new articles/min
- **Dataset Size:** 10M articles, 1M active topics, cache 24 hours
- **Data Durability:** Articles in database, rankings cached
- **Availability:** 99.9% uptime. Fallback to recent cache

### Constants/Assumptions

- **read_qps:** 100000
- **article_ingestion_rate:** 1000
- **cache_ttl_hours:** 24
- **trending_window_hours:** 4

### Available Components

- client
- lb
- app
- cache
- db_primary
- queue
- stream

### Hints

1. Use time-bucketed counters for trends
2. Cache at multiple granularities

### Tiers/Checkpoints

**T0: API**
  - Must include: cache

**T1: Trending**
  - Must include: stream

**T2: Scale**
  - Minimum 20 of type: app

### Reference Solution

Two-tier cache: articles and trending topics. Click stream feeds real-time trend detection. Time-bucketed counters with exponential decay determine trending score. Personalization layer blends global and user-specific trends.

**Components:**
- Readers (redirect_client)
- Load Balancer (lb)
- News API (app)
- Article Cache (cache)
- Trending Cache (cache)
- Article DB (db_primary)
- Click Stream (stream)
- Ingestion Queue (queue)

**Connections:**
- Readers → Load Balancer
- Load Balancer → News API
- News API → Article Cache
- News API → Trending Cache
- News API → Article DB
- News API → Click Stream
- Ingestion Queue → News API

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 14. GraphQL Query Cache

**ID:** graphql-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Field-level cache with partial invalidation

### Goal

Cache GraphQL responses with smart invalidation.

### Description

Implement intelligent caching for GraphQL APIs that handles partial query results, field-level invalidation, and nested data dependencies. Learn about normalized caches and cache coherency in graph structures.

### Functional Requirements

- Cache GraphQL query results by operation
- Support field-level cache invalidation
- Handle nested object dependencies
- Implement cache normalization by ID
- Support subscription-based invalidation
- Merge partial cache hits

### Non-Functional Requirements

- **Latency:** P95 < 50ms for cached queries, P99 < 200ms for partial hits
- **Request Rate:** 50k GraphQL queries/sec
- **Dataset Size:** 100GB normalized cache data
- **Data Durability:** Cache rebuilt from source systems
- **Availability:** 99.9% uptime. Fallback to resolver

### Constants/Assumptions

- **query_qps:** 50000
- **cache_hit_target:** 0.7
- **entity_types:** 100
- **avg_query_depth:** 3

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream

### Hints

1. Normalize by __typename and id
2. Use DataLoader pattern for batching

### Tiers/Checkpoints

**T0: Gateway**
  - Must include: cache

**T1: Invalidation**
  - Must include: stream

**T2: Hit Rate**
  - Parameter range check: cache.hit_rate

### Reference Solution

Normalized cache stores entities by type and ID. Query results reference cached entities. Mutations invalidate affected entities via stream. Partial cache hits are merged with fresh data. This teaches graph caching patterns.

**Components:**
- GraphQL Clients (redirect_client)
- Load Balancer (lb)
- GraphQL Gateway (app)
- Normalized Cache (cache)
- Source DB (db_primary)
- Mutation Stream (stream)

**Connections:**
- GraphQL Clients → Load Balancer
- Load Balancer → GraphQL Gateway
- GraphQL Gateway → Normalized Cache
- GraphQL Gateway → Source DB
- GraphQL Gateway → Mutation Stream

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 15. E-commerce Shopping Cart Cache

**ID:** shopping-cart-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Session-based cart with persistence

### Goal

Handle 50k concurrent carts with <20ms access time.

### Description

Design a shopping cart system that balances performance with data durability. Cache active carts in Redis while persisting to database for recovery. Learn about session affinity, cart abandonment handling, and inventory reservation timeouts.

### Functional Requirements

- Cache active shopping carts in Redis
- Persist cart changes to database asynchronously
- Handle cart merging when users log in
- Implement 30-minute cart expiration with reminders
- Reserve inventory temporarily during checkout
- Sync cart across devices for logged-in users

### Non-Functional Requirements

- **Latency:** P95 < 20ms for cart operations, P99 < 50ms
- **Request Rate:** 100k cart operations/sec (70k reads, 30k writes)
- **Dataset Size:** 5M active carts. Average 10 items per cart. 50KB per cart
- **Data Durability:** No cart loss on cache failure. Async DB writes acceptable
- **Availability:** 99.95% uptime. Degrade to DB-only mode on cache failure

### Constants/Assumptions

- **read_qps:** 70000
- **write_qps:** 30000
- **active_carts:** 5000000
- **cart_ttl_minutes:** 30
- **cache_hit_target:** 0.95

### Available Components

- client
- lb
- app
- cache
- db_primary
- queue

### Hints

1. Use write-behind pattern for DB updates
2. Implement cart merge logic for anonymous to logged-in transitions

### Tiers/Checkpoints

**T0: Cache**
  - Must include: cache

**T1: Persistence**
  - Must include: db_primary

**T2: Performance**
  - Parameter range check: cache.hit_rate

### Reference Solution

Write-behind caching provides <20ms cart operations. Redis stores active carts with 30-min TTL. Async queue persists changes to DB for recovery. Cart merge logic handles anonymous to authenticated transitions. This teaches balancing speed with durability.

**Components:**
- Shoppers (redirect_client)
- Load Balancer (lb)
- Cart Service (app)
- Redis Carts (cache)
- Cart DB (db_primary)
- Sync Queue (queue)

**Connections:**
- Shoppers → Load Balancer
- Load Balancer → Cart Service
- Cart Service → Redis Carts
- Cart Service → Cart DB
- Cart Service → Sync Queue

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 16. Real-time Analytics Dashboard Cache

**ID:** analytics-dashboard-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Tiered caching for dashboard queries

### Goal

Serve dashboards in <500ms with 1-minute data freshness.

### Description

Build a multi-tier caching system for business analytics dashboards. Combine pre-computed aggregates, query result caching, and real-time updates. Learn about cache layering, partial result caching, and balancing freshness with performance.

### Functional Requirements

- Cache pre-computed hourly/daily aggregations
- Layer cache: browser → Redis → materialized views
- Support drill-down queries with partial cache hits
- Real-time metrics bypass cache with 1-min aggregation
- Cache invalidation on data pipeline completion
- Support user-specific dashboard customizations

### Non-Functional Requirements

- **Latency:** P95 < 500ms for cached dashboards, P99 < 2s with partial cache
- **Request Rate:** 5k dashboard loads/sec generating 50k widget queries/sec
- **Dataset Size:** 100TB raw data. 1TB cached aggregates. 50GB query cache
- **Data Durability:** Cached data can be recomputed. Source in data warehouse
- **Availability:** 99.9% uptime. Show stale data if live query fails

### Constants/Assumptions

- **dashboard_qps:** 5000
- **widget_qps:** 50000
- **cache_layers:** 3
- **freshness_minutes:** 1
- **aggregate_cache_hit_target:** 0.8

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- db_replica
- worker

### Hints

1. Pre-aggregate common time ranges
2. Use hierarchical cache keys for drill-down

### Tiers/Checkpoints

**T0: Query Cache**
  - Must include: cache

**T1: Aggregates**
  - Must include: worker

**T2: Hit Rate**
  - Parameter range check: cache.hit_rate

### Reference Solution

Three-tier caching: browser (50% hit) → Redis (85% hit) → materialized views. Workers pre-aggregate hourly/daily metrics. Partial cache hits combine cached aggregates with fresh queries. This teaches layered caching for analytics.

**Components:**
- Business Users (redirect_client)
- Browser Cache (cdn)
- Load Balancer (lb)
- Dashboard API (app)
- Query Cache (cache)
- OLAP DB (db_primary)
- Read Replicas (db_replica)
- Pre-Aggregation (worker)

**Connections:**
- Business Users → Browser Cache
- Browser Cache → Load Balancer
- Load Balancer → Dashboard API
- Dashboard API → Query Cache
- Dashboard API → OLAP DB
- Dashboard API → Read Replicas
- Pre-Aggregation → OLAP DB

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 17. Multi-tenant SaaS Cache Isolation

**ID:** multi-tenant-saas-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Salesforce-scale 100M tenants/10M QPS isolation

### Goal

Build Salesforce-scale multi-tenant caching.

### Description

Design a Salesforce/AWS-scale multi-tenant caching system serving 100M+ tenants with 10M requests/sec while preventing noisy neighbors. Must maintain <5ms P99 latency, handle enterprise tenants with 1B+ objects, survive region failures, and operate within $500M/month budget. Support GDPR isolation, tenant-specific encryption, hierarchical quotas, and maintain 99.999% availability while serving Fortune 500 enterprises.

### Functional Requirements

- Isolate cache for 100M+ tenants globally
- Process 10M cache operations/sec
- Prevent noisy neighbor impact (<1% degradation)
- Hierarchical quotas (org/workspace/user)
- Tenant-specific encryption keys
- GDPR/SOC2 compliant data isolation
- Auto-scale for viral tenant growth (100x)
- Multi-tier caching based on plan level

### Non-Functional Requirements

- **Latency:** P99 < 5ms for all tenants, P99.9 < 10ms
- **Request Rate:** 10M req/sec normal, 100M during Black Friday
- **Dataset Size:** 100M tenants, 10PB cache, 100PB total data
- **Availability:** 99.999% per tenant with isolated failures

### Constants/Assumptions

- **l4_enhanced:** true
- **total_qps:** 10000000
- **spike_multiplier:** 10
- **tenant_count:** 100000000
- **enterprise_tenants:** 10000
- **top_tenant_percentage:** 0.0001
- **cache_size_pb:** 10
- **fair_share_target:** 0.95
- **budget_monthly:** 500000000

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Use consistent hashing with tenant ID
2. Implement weighted LRU based on tenant tier

### Tiers/Checkpoints

**T0: Cache**
  - Must include: cache

**T1: Partitioning**
  - Minimum 3 of type: cache

**T2: Fairness**
  - Parameter range check: cache.hit_rate

### Reference Solution

Three-tier cache partitioning by plan level prevents noisy neighbors. Enterprise tenants get dedicated cache, Pro tier shares with quota limits, Free tier best-effort. Consistent hashing within tiers ensures even distribution. This teaches multi-tenant cache isolation.

**Components:**
- All Tenants (redirect_client)
- Load Balancer (lb)
- SaaS Platform (app)
- Enterprise Cache (cache)
- Pro Cache (cache)
- Free Cache (cache)
- Tenant DBs (db_primary)

**Connections:**
- All Tenants → Load Balancer
- Load Balancer → SaaS Platform
- SaaS Platform → Enterprise Cache
- SaaS Platform → Pro Cache
- SaaS Platform → Free Cache
- SaaS Platform → Tenant DBs

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 18. Content Management System Cache

**ID:** cms-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Multi-layer cache with smart invalidation

### Goal

Publish content updates globally in <30 seconds.

### Description

Design a caching system for a headless CMS serving content to millions of websites. Implement edge caching, API response caching, and dependency-based invalidation. Learn about cache tags, surrogate keys, and handling complex invalidation graphs.

### Functional Requirements

- Cache published content at CDN edge
- Implement tag-based cache invalidation
- Handle content dependencies (articles reference authors)
- Support versioned content with preview mode
- Purge related content when parent updates
- Invalidate downstream caches (customer CDNs)

### Non-Functional Requirements

- **Latency:** P95 < 50ms for cached content, P99 < 200ms globally
- **Request Rate:** 1M API requests/sec across all customer sites
- **Dataset Size:** 10M content items. Average 50KB per item. 500GB total
- **Data Durability:** Content in database. Cache can be rebuilt
- **Availability:** 99.99% uptime. Stale content acceptable during incidents

### Constants/Assumptions

- **read_qps:** 1000000
- **content_items:** 10000000
- **cache_hit_target:** 0.95
- **invalidation_latency_seconds:** 30
- **customer_sites:** 100000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- queue
- stream

### Hints

1. Use cache tags for related content
2. Purge by surrogate key for dependency graphs

### Tiers/Checkpoints

**T0: Edge Cache**
  - Must include: cdn

**T1: Invalidation**
  - Must include: queue

**T2: Performance**
  - Parameter range check: cdn.hit_rate

### Reference Solution

Two-tier caching: CDN (96% hit) + API cache (90% hit). Tag-based invalidation handles dependencies. Purge queue propagates to CDN in <30s. Stream notifies customer systems. Surrogate keys enable batch purges. This teaches complex cache invalidation patterns.

**Components:**
- Websites (redirect_client)
- Global CDN (cdn)
- Load Balancer (lb)
- CMS API (app)
- API Cache (cache)
- Content DB (db_primary)
- Purge Queue (queue)
- Invalidation Stream (stream)

**Connections:**
- Websites → Global CDN
- Global CDN → Load Balancer
- Load Balancer → CMS API
- CMS API → API Cache
- CMS API → Content DB
- CMS API → Purge Queue
- CMS API → Invalidation Stream

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 19. Authentication Token Cache

**ID:** auth-token-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Distributed token validation with revocation

### Goal

Validate JWT tokens in <5ms with instant revocation.

### Description

Build a high-performance authentication system using stateless JWT tokens with distributed revocation support. Learn about token caching, blacklist patterns, refresh token rotation, and balancing stateless design with security requirements.

### Functional Requirements

- Cache decoded JWT claims for fast validation
- Implement token revocation blacklist
- Support refresh token rotation
- Handle token expiration and renewal
- Distribute revocation across all nodes instantly
- Audit log all token operations

### Non-Functional Requirements

- **Latency:** P95 < 5ms for token validation, P99 < 10ms
- **Request Rate:** 500k authentications/sec across all services
- **Dataset Size:** 50M active tokens. 1KB per cached token. Blacklist 100k tokens
- **Data Durability:** Revocation must be durable. Token cache can be rebuilt
- **Availability:** 99.99% uptime. Auth failure = service outage

### Constants/Assumptions

- **auth_qps:** 500000
- **active_tokens:** 50000000
- **token_ttl_hours:** 24
- **refresh_ttl_days:** 30
- **blacklist_size:** 100000

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream

### Hints

1. Cache decoded claims, not raw tokens
2. Use bloom filter for blacklist checks

### Tiers/Checkpoints

**T0: Cache**
  - Must include: cache

**T1: Revocation**
  - Must include: stream

**T2: Performance**
  - Parameter range check: cache.hit_rate

### Reference Solution

Dual cache: decoded tokens (97% hit) + revocation blacklist (99% hit). Stream propagates revocations to all nodes in <100ms. Bloom filter accelerates blacklist checks. Local token cache with TTL=token expiry. This teaches secure stateless auth with revocation.

**Components:**
- Microservices (redirect_client)
- Load Balancer (lb)
- Auth Service (app)
- Token Cache (cache)
- Blacklist (cache)
- Auth DB (db_primary)
- Revocation Stream (stream)

**Connections:**
- Microservices → Load Balancer
- Load Balancer → Auth Service
- Auth Service → Token Cache
- Auth Service → Blacklist
- Auth Service → Auth DB
- Auth Service → Revocation Stream
- Revocation Stream → Blacklist

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 20. Pricing Engine Cache

**ID:** pricing-engine-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Amazon-scale 100M pricing calcs/sec

### Goal

Build Amazon-scale dynamic pricing engine.

### Description

Design an Amazon-scale pricing engine processing 100M pricing calculations/sec for 1B+ SKUs during Prime Day. Must calculate personalized prices in <5ms using ML models, handle surge pricing, survive cache failures, and operate within $300M/month budget. Support 100k+ concurrent promotions, real-time inventory pricing, currency conversion for 200+ countries, and maintain pricing consistency while A/B testing across millions of cohorts.

### Functional Requirements

- Calculate 100M personalized prices/sec
- Support 1B+ SKUs with dynamic pricing
- ML-based price optimization in real-time
- Handle Prime Day surge (10x normal load)
- 100k+ concurrent promotions and rules
- Real-time inventory and competitor pricing
- Currency conversion for 200+ countries
- A/B test pricing across 10M+ cohorts

### Non-Functional Requirements

- **Latency:** P99 < 5ms calculation, P99.9 < 10ms
- **Request Rate:** 100M pricing req/sec, 1B during Prime Day
- **Dataset Size:** 1B SKUs, 100k promotions, 10B price points
- **Availability:** 99.999% uptime with instant failover
- **Consistency:** Price consistency within 100ms globally

### Constants/Assumptions

- **l4_enhanced:** true
- **pricing_qps:** 100000000
- **spike_multiplier:** 10
- **sku_count:** 1000000000
- **promotion_count:** 100000
- **user_segments:** 1000000000
- **rule_complexity_avg:** 20
- **ml_models:** 1000
- **cache_hit_target:** 0.95
- **budget_monthly:** 300000000

### Available Components

- client
- lb
- app
- cache
- db_primary
- worker

### Hints

1. Cache rule evaluations, not just results
2. Pre-compute popular SKU × segment combinations

### Tiers/Checkpoints

**T0: Rule Cache**
  - Must include: cache

**T1: Pre-compute**
  - Must include: worker

**T2: Performance**
  - Parameter range check: cache.hit_rate

### Reference Solution

Two-tier cache: pre-computed prices (88% hit) + rule definitions (95% hit). Workers pre-compute common SKU × segment combinations. Cache keys include user segment hash. Rule evaluation optimized with early termination. This teaches complex cache key design.

**Components:**
- Customers (redirect_client)
- Load Balancer (lb)
- Pricing API (app)
- Price Cache (cache)
- Rule Cache (cache)
- Pricing DB (db_primary)
- Pre-compute (worker)

**Connections:**
- Customers → Load Balancer
- Load Balancer → Pricing API
- Pricing API → Price Cache
- Pricing API → Rule Cache
- Pricing API → Pricing DB
- Pre-compute → Pricing DB
- Pre-compute → Price Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 21. Recommendation Engine Cache

**ID:** recommendation-engine-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Personalized recommendations with batch updates

### Goal

Serve recommendations in <50ms with hourly model updates.

### Description

Design a caching layer for ML-powered product recommendations. Balance personalization with cache efficiency by caching model outputs, feature vectors, and popular recommendations. Learn about cold start handling, cache warming from batch jobs, and incremental model updates.

### Functional Requirements

- Cache top-N recommendations per user segment
- Store user feature vectors for real-time scoring
- Handle cold start with trending item fallback
- Update recommendations hourly from ML pipeline
- Support A/B testing different models
- Blend cached recommendations with real-time signals

### Non-Functional Requirements

- **Latency:** P95 < 50ms for personalized recommendations
- **Request Rate:** 100k recommendation requests/sec
- **Dataset Size:** 100M users. 1M items. 10GB feature vectors. 50GB cached recommendations
- **Data Durability:** Recommendations can be recomputed. Models in object storage
- **Availability:** 99.9% uptime. Degrade to popular items on failure

### Constants/Assumptions

- **rec_qps:** 100000
- **user_count:** 100000000
- **item_count:** 1000000
- **update_frequency_hours:** 1
- **top_n:** 20
- **cache_hit_target:** 0.75

### Available Components

- client
- lb
- app
- cache
- db_primary
- worker
- queue
- object_store

### Hints

1. Cache by user segment, not individual users
2. Use write-behind for gradual cache warming

### Tiers/Checkpoints

**T0: Cache**
  - Must include: cache

**T1: Batch Update**
  - Must include: worker

**T2: Performance**
  - Parameter range check: cache.hit_rate

### Reference Solution

Batch workers generate recommendations hourly and warm cache asynchronously. Cache stores top-20 per user segment (not individual users) for 78% hit rate. Real-time scoring for cache misses using cached feature vectors. This teaches ML cache patterns.

**Components:**
- Users (redirect_client)
- Load Balancer (lb)
- Rec Service (app)
- Rec Cache (cache)
- User DB (db_primary)
- Batch Recs (worker)
- Model Store (object_store)
- Warm Queue (queue)

**Connections:**
- Users → Load Balancer
- Load Balancer → Rec Service
- Rec Service → Rec Cache
- Rec Service → User DB
- Batch Recs → Model Store
- Batch Recs → Rec Cache
- Warm Queue → Rec Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 22. Real-time Bidding Ad Cache

**ID:** rtb-ad-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Sub-10ms ad selection with budget tracking

### Goal

Select and serve ads in <10ms while tracking spend.

### Description

Build an ad caching system for real-time bidding that must respond in <10ms. Cache ad creatives, targeting rules, and real-time budget utilization. Learn about probabilistic data structures, approximate counting, and balancing accuracy with extreme low latency.

### Functional Requirements

- Cache ad creatives and targeting rules
- Track campaign budgets in real-time (approximate)
- Select top bid ad within latency budget
- Support frequency capping per user
- Implement pacing to spread budget over day
- Handle concurrent bid requests without overspending

### Non-Functional Requirements

- **Latency:** P95 < 10ms for ad selection, P99 < 15ms
- **Request Rate:** 500k bid requests/sec
- **Dataset Size:** 1M active ad campaigns. 10M creatives. 100M user profiles
- **Data Durability:** Budget tracking must be accurate to 5%. Impressions logged async
- **Availability:** 99.9% uptime. Default ads on failure

### Constants/Assumptions

- **bid_qps:** 500000
- **campaign_count:** 1000000
- **creative_count:** 10000000
- **budget_accuracy:** 0.95
- **latency_budget_ms:** 10

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker

### Hints

1. Use local cache with stale budget tolerance
2. Bloom filter for frequency capping

### Tiers/Checkpoints

**T0: Ad Cache**
  - Must include: cache

**T1: Budget Tracking**
  - Must include: stream

**T2: Latency**
  - Minimum 100 of type: app

### Reference Solution

Three-tier optimization: creative cache (99% hit), budget cache (95% hit, 10s TTL), local bid cache. Stream aggregates spend in 1s windows. Workers update budget cache async. Probabilistic counting accepts 5% overspend for <10ms latency. This teaches ultra-low latency caching.

**Components:**
- Ad Requests (redirect_client)
- Load Balancer (lb)
- Bidder (app)
- Creative Cache (cache)
- Budget Cache (cache)
- Campaign DB (db_primary)
- Impression Stream (stream)
- Budget Aggregator (worker)

**Connections:**
- Ad Requests → Load Balancer
- Load Balancer → Bidder
- Bidder → Creative Cache
- Bidder → Budget Cache
- Bidder → Impression Stream
- Impression Stream → Budget Aggregator
- Budget Aggregator → Budget Cache
- Budget Aggregator → Campaign DB

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 23. Gaming Matchmaking Cache

**ID:** gaming-matchmaking-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Real-time player pool with skill-based matching

### Goal

Match players in <3 seconds with balanced teams.

### Description

Design a matchmaking system for competitive gaming that maintains pools of available players and quickly forms balanced matches. Learn about ephemeral cache entries, range queries, and the trade-offs between match quality and wait time.

### Functional Requirements

- Maintain pool of available players by skill tier
- Match players within 200 rating points in <3s
- Support party matchmaking (groups of friends)
- Handle players leaving queue gracefully
- Prevent duplicate matches during reconnection
- Cache recent match history to avoid repeats

### Non-Functional Requirements

- **Latency:** P95 < 3s for match formation, P99 < 5s
- **Request Rate:** 50k players entering queue/sec during peak
- **Dataset Size:** 1M concurrent players in queue. 10k matches/sec
- **Data Durability:** Queue state can be lost. Match results must persist
- **Availability:** 99.9% uptime. Degrade to wider skill range on load

### Constants/Assumptions

- **queue_join_qps:** 50000
- **concurrent_in_queue:** 1000000
- **match_rate_per_sec:** 10000
- **skill_range:** 200
- **target_match_time_sec:** 3

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker

### Hints

1. Use sorted sets for skill-based range queries
2. Partition by region and game mode

### Tiers/Checkpoints

**T0: Queue**
  - Must include: cache

**T1: Matching**
  - Must include: worker

**T2: Speed**
  - Minimum 50 of type: worker

### Reference Solution

Redis sorted sets partition queue by region and mode. Workers poll sorted sets for skill-range matches. TTL removes stale queue entries. Stream publishes match formation events. Partitioning by region reduces match latency. This teaches real-time pool matching patterns.

**Components:**
- Players (redirect_client)
- Load Balancer (lb)
- Matchmaker (app)
- Queue Cache (cache)
- Match History (db_primary)
- Match Workers (worker)
- Match Events (stream)

**Connections:**
- Players → Load Balancer
- Load Balancer → Matchmaker
- Matchmaker → Queue Cache
- Matchmaker → Match History
- Queue Cache → Match Workers
- Match Workers → Match Events
- Match Events → Match History

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 24. IoT Device State Cache

**ID:** iot-device-cache
**Category:** caching
**Difficulty:** Intermediate

### Summary

Shadow state with eventual consistency

### Goal

Query device state in <20ms despite spotty connectivity.

### Description

Design a device shadow cache for IoT systems where devices have unreliable connectivity. Maintain cached state that devices sync when online. Learn about last-write-wins, vector clocks, conflict resolution, and handling millions of devices with varying update frequencies.

### Functional Requirements

- Cache device shadow state (reported and desired)
- Handle offline devices with state deltas on reconnect
- Support bulk queries (all devices in building)
- Implement conflict resolution for concurrent updates
- Expire stale device state after inactivity
- Aggregate device metrics from shadows

### Non-Functional Requirements

- **Latency:** P95 < 20ms for shadow reads, P99 < 50ms
- **Request Rate:** 200k shadow updates/sec, 500k queries/sec
- **Dataset Size:** 100M devices. 2KB shadow per device. 50% active daily
- **Data Durability:** Shadow cache can be rebuilt from device storage
- **Availability:** 99.9% uptime. Stale shadows acceptable

### Constants/Assumptions

- **device_count:** 100000000
- **active_daily_percentage:** 0.5
- **shadow_update_qps:** 200000
- **shadow_query_qps:** 500000
- **offline_tolerance_hours:** 24

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker

### Hints

1. Use write-through for active devices
2. Partition cache by device ID hash

### Tiers/Checkpoints

**T0: Shadow Cache**
  - Must include: cache

**T1: Persistence**
  - Must include: db_primary

**T2: Performance**
  - Parameter range check: cache.hit_rate

### Reference Solution

Write-through caching for 50M active devices (87% hit rate). 24-hour TTL removes inactive devices from cache. Stream publishes state changes for analytics. LWW conflict resolution for simplicity. Partitioned by device ID for horizontal scaling. This teaches IoT shadow patterns.

**Components:**
- Devices + Apps (redirect_client)
- Load Balancer (lb)
- Shadow Service (app)
- Shadow Cache (cache)
- Shadow DB (db_primary)
- State Events (stream)
- Aggregation (worker)

**Connections:**
- Devices + Apps → Load Balancer
- Load Balancer → Shadow Service
- Shadow Service → Shadow Cache
- Shadow Service → Shadow DB
- Shadow Service → State Events
- State Events → Aggregation

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 25. Amazon Global Inventory Cache

**ID:** global-inventory-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Multi-region cache with consistency guarantees

### Goal

Track inventory across regions with strong consistency.

### Description

Design a globally distributed inventory caching system that prevents overselling while maintaining low latency. Handle multi-region consistency, implement reservation patterns, and learn about conflict-free replicated data types (CRDTs).

### Functional Requirements

- Cache inventory across multiple regions
- Prevent overselling with distributed locks
- Support inventory reservations with timeout
- Implement eventual consistency for browsing
- Strong consistency for checkout
- Handle split-brain scenarios
- Support batch inventory updates
- Provide real-time inventory webhooks

### Non-Functional Requirements

- **Latency:** P95 < 20ms same-region, < 100ms cross-region
- **Request Rate:** 1M inventory checks/sec globally
- **Dataset Size:** 100M SKUs, 1000 warehouses
- **Data Durability:** Zero inventory discrepancies allowed
- **Availability:** 99.99% uptime with regional failover
- **Consistency:** Strong consistency for purchases, eventual for browsing

### Constants/Assumptions

- **global_qps:** 1000000
- **sku_count:** 100000000
- **warehouse_count:** 1000
- **regions:** 6
- **consistency_window_ms:** 100

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- db_replica
- queue
- stream
- worker

### Hints

1. Use CRDTs for conflict resolution
2. Two-phase commit for reservations

### Tiers/Checkpoints

**T0: Basic Cache**
  - Must include: cache

**T1: Multi-Region**
  - Minimum 3 of type: cache

**T2: Consistency**
  - Must include: stream

**T3: Scale**
  - Minimum 100 of type: app

### Reference Solution

Three-tier cache hierarchy: local (60% hit), regional (85% hit), global (95% hit). CRDTs handle concurrent updates across regions. Reservation queue with distributed locks prevents overselling. Update stream maintains consistency. This teaches distributed cache consistency at scale.

**Components:**
- Global Shoppers (redirect_client)
- GeoDNS (cdn)
- Regional LB (lb)
- Inventory API (app)
- L1 Local Cache (cache)
- L2 Regional Cache (cache)
- L3 Global Cache (cache)
- Inventory DB (db_primary)
- Read Replicas (db_replica)
- Update Stream (stream)
- Reservation Queue (queue)
- Consistency Worker (worker)

**Connections:**
- Global Shoppers → GeoDNS
- GeoDNS → Regional LB
- Regional LB → Inventory API
- Inventory API → L1 Local Cache
- Inventory API → L2 Regional Cache
- Inventory API → L3 Global Cache
- Inventory API → Inventory DB
- Inventory API → Read Replicas
- Inventory API → Update Stream
- Inventory API → Reservation Queue
- Update Stream → Consistency Worker
- Consistency Worker → L2 Regional Cache
- Consistency Worker → L3 Global Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 26. Netflix Hybrid CDN Architecture

**ID:** hybrid-cdn-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

ISP cache boxes with predictive placement

### Goal

Minimize backbone traffic with edge caching.

### Description

Design Netflix Open Connect CDN with ISP cache boxes, predictive content placement, and peer-assisted delivery. Optimize for bandwidth costs while maintaining streaming quality across heterogeneous networks.

### Functional Requirements

- Deploy cache boxes at ISP locations
- Predictive content placement using ML
- Peer-to-peer assisted delivery
- Adaptive bitrate based on cache availability
- Monitor cache health and failover
- Support live and on-demand content
- Implement cache hierarchy (edge/mid/origin)
- Handle cache misses without buffering

### Non-Functional Requirements

- **Latency:** P95 < 1s start time, rebuffer ratio < 0.5%
- **Request Rate:** 10M concurrent streams globally
- **Dataset Size:** 1PB total content, 100TB per ISP cache
- **Data Durability:** Origin has all content, edge ephemeral
- **Availability:** 99.99% stream availability
- **Consistency:** Eventually consistent content propagation

### Constants/Assumptions

- **concurrent_streams:** 10000000
- **content_library_pb:** 1
- **isp_cache_tb:** 100
- **edge_locations:** 1000
- **backbone_cost_per_gb:** 0.02

### Available Components

- client
- cdn
- lb
- app
- cache
- object_store
- queue
- stream
- worker

### Hints

1. Place popular content during off-peak
2. Use consistent hashing for cache assignment

### Tiers/Checkpoints

**T0: Edge CDN**
  - Must include: cdn

**T1: ISP Cache**
  - Minimum 3 of type: cache

**T2: Predictive**
  - Must include: worker

**T3: P2P**
  - Must include: stream

### Reference Solution

Multi-tier CDN with 95% ISP cache hit rate reduces backbone traffic by 20x. ML predicts viewing patterns for proactive placement during off-peak. P2P assists during peak for popular content. Adaptive bitrate adjusts to cache availability. This teaches cost-optimized CDN architecture.

**Components:**
- Viewers (redirect_client)
- ISP Cache (cdn)
- Peer Cache (cdn)
- Edge LB (lb)
- Stream Control (app)
- Mid-Tier Cache (cache)
- Origin Storage (object_store)
- Placement Queue (queue)
- P2P Coordination (stream)
- ML Placement (worker)

**Connections:**
- Viewers → ISP Cache
- Viewers → Peer Cache
- ISP Cache → Edge LB
- Peer Cache → Edge LB
- Edge LB → Stream Control
- Stream Control → Mid-Tier Cache
- Stream Control → Origin Storage
- Stream Control → P2P Coordination
- Placement Queue → ML Placement
- ML Placement → ISP Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 27. Global E-commerce Inventory Cache

**ID:** global-inventory-mastery
**Category:** caching
**Difficulty:** Advanced

### Summary

Multi-region consistency with optimistic locking

### Goal

Prevent overselling across 5 continents with <100ms sync.

### Description

Design a globally distributed inventory system with strong consistency guarantees to prevent overselling during flash sales. Implement optimistic locking, conflict-free replicated data types (CRDTs), and multi-region cache coordination with minimal latency impact.

### Functional Requirements

- Maintain inventory counts across 5 geographic regions
- Prevent overselling with pessimistic or optimistic locking
- Reserve inventory during checkout with timeout
- Handle network partitions gracefully (AP with repair)
- Sync inventory changes globally within 100ms
- Support backorder when stock depleted

### Non-Functional Requirements

- **Latency:** P95 < 50ms local, P95 < 200ms cross-region for inventory check
- **Request Rate:** 500k inventory checks/sec globally, 50k purchases/sec
- **Dataset Size:** 10M SKUs. Inventory distributed across regions. 100GB total
- **Data Durability:** No double-booking allowed. Inventory must be strongly consistent
- **Availability:** 99.99% uptime per region. Survive single region failure
- **Consistency:** Strong consistency for inventory decrement. Eventual for reads

### Constants/Assumptions

- **global_check_qps:** 500000
- **purchase_qps:** 50000
- **sku_count:** 10000000
- **regions:** 5
- **sync_latency_ms:** 100
- **oversell_tolerance:** 0

### Available Components

- client
- lb
- app
- cache
- db_primary
- db_replica
- stream
- worker
- queue

### Hints

1. Use Paxos/Raft for distributed locking
2. Cache with version numbers for optimistic concurrency

### Tiers/Checkpoints

**T0: Multi-Region**
  - Minimum 3 of type: cache

**T1: Coordination**
  - Must include: stream

**T2: Consistency**
  - Must include: db_primary

**T3: Performance**
  - Minimum 50 of type: app

### Reference Solution

Three-region deployment with local caches (90% hit). Writes go through distributed lock service before decrementing inventory. Stream replicates changes to all regions in <100ms. Optimistic locking with version numbers prevents lost updates. Workers resolve conflicts during network partitions. This teaches global cache consistency patterns.

**Components:**
- Global Users (redirect_client)
- US LB (lb)
- EU LB (lb)
- APAC LB (lb)
- US Servers (app)
- EU Servers (app)
- APAC Servers (app)
- US Cache (cache)
- EU Cache (cache)
- APAC Cache (cache)
- Global Inventory DB (db_primary)
- Inventory Sync Stream (stream)
- Conflict Resolver (worker)

**Connections:**
- Global Users → US LB
- Global Users → EU LB
- Global Users → APAC LB
- US LB → US Servers
- EU LB → EU Servers
- APAC LB → APAC Servers
- US Servers → US Cache
- EU Servers → EU Cache
- APAC Servers → APAC Cache
- US Cache → Global Inventory DB
- EU Cache → Global Inventory DB
- APAC Cache → Global Inventory DB
- Global Inventory DB → Inventory Sync Stream
- Inventory Sync Stream → Conflict Resolver
- Conflict Resolver → US Cache
- Conflict Resolver → EU Cache
- Conflict Resolver → APAC Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 28. Financial Trading Platform Cache

**ID:** financial-trading-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Microsecond latency with FIFO ordering guarantees

### Goal

Process trades in <500μs with strict message ordering.

### Description

Design an ultra-low latency caching system for a high-frequency trading platform. Cache market data, order books, and positions with microsecond access times. Learn about lock-free data structures, CPU cache optimization, and the limits of distributed caching for latency-critical systems.

### Functional Requirements

- Cache order book snapshots with <100μs updates
- Maintain position and risk limits in local memory
- Replicate critical data to hot standby with RDMA
- Support historical tick data queries (last 1 hour)
- Atomic position updates across multiple instruments
- Audit log all trades to durable storage async

### Non-Functional Requirements

- **Latency:** P95 < 500μs for order processing, P99 < 1ms. Market data <100μs
- **Request Rate:** 1M orders/sec, 10M market data updates/sec
- **Dataset Size:** 10k instruments. 1M orders in book. 100GB market data/day
- **Data Durability:** Position data must survive crashes. Use battery-backed RAM
- **Availability:** 99.999% uptime. Hot standby failover <10ms
- **Consistency:** Strict FIFO ordering per instrument. Linearizable position updates

### Constants/Assumptions

- **order_qps:** 1000000
- **market_data_qps:** 10000000
- **instruments:** 10000
- **target_latency_us:** 500
- **failover_time_ms:** 10

### Available Components

- client
- app
- cache
- db_primary
- stream

### Hints

1. Use lock-free queues and atomic operations
2. Avoid network calls in critical path

### Tiers/Checkpoints

**T0: In-Memory**
  - Must include: cache

**T1: Replication**
  - Minimum 2 of type: cache

**T2: Ordering**
  - Must include: stream

**T3: Ultra-Low Latency**
  - Minimum 10 of type: app

### Reference Solution

All-in-memory architecture with NVRAM for durability. Lock-free order book updates use atomic CAS operations. RDMA replicates to standby in <10μs. Event stream provides async audit log. No distributed cache—too slow. CPU pinning and huge pages reduce latency variance. This teaches hardware-aware caching for extreme performance.

**Components:**
- Trading Systems (redirect_client)
- Primary Matching Engine (app)
- Standby Matching Engine (app)
- Order Book (NVRAM) (cache)
- Standby Book (NVRAM) (cache)
- Trade Log (RDMA) (stream)
- Audit DB (db_primary)

**Connections:**
- Trading Systems → Primary Matching Engine
- Primary Matching Engine → Order Book (NVRAM)
- Order Book (NVRAM) → Standby Book (NVRAM)
- Primary Matching Engine → Trade Log (RDMA)
- Standby Matching Engine → Standby Book (NVRAM)
- Trade Log (RDMA) → Audit DB

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 29. Video Game Asset Distribution Cache

**ID:** game-asset-cdn-mastery
**Category:** caching
**Difficulty:** Advanced

### Summary

P2P + CDN hybrid with predictive prefetch

### Goal

Download 50GB game in <10 min with P2P assistance.

### Description

Design a hybrid CDN and peer-to-peer caching system for distributing large game assets. Combine traditional CDN with peer caching to reduce costs and improve download speeds. Learn about chunk-based caching, integrity verification, and incentivizing peer participation.

### Functional Requirements

- Distribute game assets via CDN + P2P hybrid
- Chunk files into verifiable blocks (4MB each)
- Peer discovery and selection based on bandwidth
- Fallback to CDN if P2P peers unavailable
- Verify chunk integrity with content hashing
- Incentivize seeding with in-game rewards

### Non-Functional Requirements

- **Latency:** P95 download time <10 minutes for 50GB game
- **Request Rate:** 100k concurrent downloads during game launch
- **Dataset Size:** 500GB game library. 50GB new releases. 10k active torrents
- **Data Durability:** CDN is source of truth. P2P augments capacity
- **Availability:** 99.9% CDN uptime. P2P best-effort
- **Consistency:** Eventual consistency for new releases. CDN always correct

### Constants/Assumptions

- **concurrent_downloads:** 100000
- **game_size_gb:** 50
- **target_download_minutes:** 10
- **chunk_size_mb:** 4
- **p2p_target_percentage:** 0.7

### Available Components

- client
- cdn
- app
- cache
- object_store
- stream
- worker

### Hints

1. Use BitTorrent protocol for P2P
2. Cache popular chunks near gamers

### Tiers/Checkpoints

**T0: CDN**
  - Must include: cdn

**T1: P2P**
  - Must include: stream

**T2: Hybrid**
  - Must include: worker

**T3: Scale**
  - Minimum 5 of type: cache

### Reference Solution

Hybrid model: CDN serves 30% of chunks, P2P serves 70%. Regional caches pre-position popular games. Tracker coordinates peer discovery via stream. Workers analyze download patterns to optimize chunk placement. Content-addressed chunks enable deduplication. This teaches hybrid CDN/P2P caching strategies.

**Components:**
- Gamers (redirect_client)
- Global CDN (cdn)
- Download Coordinator (app)
- Tracker (app)
- US Cache (cache)
- EU Cache (cache)
- APAC Cache (cache)
- Asset Storage (object_store)
- Peer Discovery (stream)
- Chunk Optimizer (worker)

**Connections:**
- Gamers → Global CDN
- Gamers → Tracker
- Global CDN → Download Coordinator
- Download Coordinator → US Cache
- Download Coordinator → EU Cache
- Download Coordinator → APAC Cache
- US Cache → Asset Storage
- EU Cache → Asset Storage
- APAC Cache → Asset Storage
- Tracker → Peer Discovery
- Peer Discovery → Chunk Optimizer

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 30. Real-time Sports Betting Cache

**ID:** sports-betting-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Sub-millisecond odds updates with staleness tolerance

### Goal

Update odds in <1ms with <100ms staleness tolerance.

### Description

Design a caching system for live sports betting where odds change in real-time based on game events. Cache must balance extreme low latency with preventing arbitrage opportunities from stale data. Learn about time-windowed caching, probabilistic cache invalidation, and graceful degradation.

### Functional Requirements

- Cache current odds with <100ms staleness guarantee
- Update odds on game events (goals, fouls, etc.)
- Prevent arbitrage from regional odds discrepancies
- Handle bet placement spikes during key moments
- Support rollback to previous odds on disputed calls
- Rate limit suspicious betting patterns

### Non-Functional Requirements

- **Latency:** P95 < 1ms for odds fetch, P99 < 5ms. Updates propagate <100ms
- **Request Rate:** 2M odds fetches/sec, 100k bets/sec during major events
- **Dataset Size:** 100k live betting markets. 10M concurrent users. 1GB cache
- **Data Durability:** Odds history in DB for audit. Live cache can be rebuilt
- **Availability:** 99.99% uptime. Freeze betting on cache failure
- **Consistency:** Eventual consistency with 100ms bound. No arbitrage allowed

### Constants/Assumptions

- **odds_fetch_qps:** 2000000
- **bet_placement_qps:** 100000
- **markets:** 100000
- **staleness_tolerance_ms:** 100
- **update_latency_target_ms:** 1

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker

### Hints

1. Use local in-memory cache with pub/sub invalidation
2. Timestamp all odds for staleness detection

### Tiers/Checkpoints

**T0: Odds Cache**
  - Must include: cache

**T1: Real-time Updates**
  - Must include: stream

**T2: Arbitrage Prevention**
  - Must include: worker

**T3: Performance**
  - Minimum 100 of type: app

### Reference Solution

Two-tier cache: local in-process (99% hit, <1ms) + shared Redis (95% hit). Stream pushes odds updates to all servers in <50ms. Servers check timestamp and reject bets on stale odds >100ms old. Workers detect arbitrage patterns. This teaches bounded-staleness caching for betting systems.

**Components:**
- Bettors (redirect_client)
- Load Balancer (lb)
- Betting Servers (app)
- Odds Cache (Local) (cache)
- Shared Redis (cache)
- Odds Update Stream (stream)
- Odds DB (db_primary)
- Arbitrage Detector (worker)

**Connections:**
- Bettors → Load Balancer
- Load Balancer → Betting Servers
- Betting Servers → Odds Cache (Local)
- Betting Servers → Shared Redis
- Betting Servers → Odds DB
- Odds Update Stream → Betting Servers
- Odds Update Stream → Arbitrage Detector
- Arbitrage Detector → Shared Redis

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 31. Autonomous Vehicle Map Cache

**ID:** autonomous-vehicle-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Geo-partitioned cache with 99.999% availability

### Goal

Provide HD maps with <20ms latency and offline fallback.

### Description

Design a multi-tier caching system for autonomous vehicles that must work reliably even with intermittent connectivity. Combine edge caching, in-vehicle caching, and predictive prefetching. Learn about safety-critical caching, offline operation, and handling map updates during operation.

### Functional Requirements

- Cache HD maps on vehicle (upcoming 50km route)
- Prefetch maps based on predicted route
- Update maps incrementally (road closures, construction)
- Fallback to cached maps if connectivity lost
- Verify map integrity with signatures
- Support multi-vehicle map sharing (V2V)

### Non-Functional Requirements

- **Latency:** P95 < 20ms for map tile fetch from cache. Offline operation required
- **Request Rate:** 1M vehicles × 10 tile fetches/sec = 10M QPS
- **Dataset Size:** 100TB global map data. 5GB per vehicle cache. 50km route prefetch
- **Data Durability:** Map updates must be atomic. No partial map states
- **Availability:** 99.999% effective (online + offline). Safety-critical
- **Consistency:** Read-after-write for route planning. Eventual for global map

### Constants/Assumptions

- **vehicle_count:** 1000000
- **tile_fetch_qps_per_vehicle:** 10
- **vehicle_cache_gb:** 5
- **prefetch_distance_km:** 50
- **offline_tolerance_hours:** 24

### Available Components

- client
- cdn
- app
- cache
- object_store
- stream
- worker

### Hints

1. Partition maps by geohash
2. Version map tiles for safe updates

### Tiers/Checkpoints

**T0: Vehicle Cache**
  - Must include: cache

**T1: Edge CDN**
  - Must include: cdn

**T2: Prefetch**
  - Must include: worker

**T3: Availability**
  - Minimum 10 of type: cache

### Reference Solution

Four-tier caching: vehicle (100% for route) → CDN edge (85%) → regional cache (95%) → origin. ML workers predict routes and prefetch tiles. Versioned tiles enable atomic updates. Vehicles operate 24h offline using cached maps. Stream propagates urgent updates (road closures). This teaches safety-critical caching with offline requirements.

**Components:**
- Vehicles (redirect_client)
- Regional Edge CDN (cdn)
- US-West Cache (cache)
- US-East Cache (cache)
- EU Cache (cache)
- APAC Cache (cache)
- Map Service (app)
- Map Tiles (object_store)
- Map Updates (stream)
- Route Predictor (worker)

**Connections:**
- Vehicles → Regional Edge CDN
- Regional Edge CDN → US-West Cache
- Regional Edge CDN → US-East Cache
- Regional Edge CDN → EU Cache
- Regional Edge CDN → APAC Cache
- US-West Cache → Map Service
- US-East Cache → Map Service
- EU Cache → Map Service
- APAC Cache → Map Service
- Map Service → Map Tiles
- Map Updates → Map Service
- Route Predictor → Map Updates

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 32. Stock Market Data Feed Cache

**ID:** stock-market-data-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Time-series cache with backpressure handling

### Goal

Stream 10k stocks at 100 ticks/sec with <10ms lag.

### Description

Design a caching and streaming system for real-time stock market data that handles bursts during high volatility. Implement time-series caching, backpressure handling, and historical data replay. Learn about windowed aggregations, lossy compression for bandwidth, and fairness during overload.

### Functional Requirements

- Cache last 1 hour of tick data per symbol
- Stream real-time updates with <10ms lag
- Handle burst traffic during market events
- Support historical data queries (1min/5min OHLC)
- Implement backpressure: drop old updates, not new
- Prioritize subscriptions (institutional > retail)

### Non-Functional Requirements

- **Latency:** P95 < 10ms for live ticks, P99 < 25ms. Historical queries <100ms
- **Request Rate:** 10k symbols × 100 ticks/sec = 1M ticks/sec. 100k concurrent subscribers
- **Dataset Size:** 10k symbols. 1 hour cache @ 100 ticks/sec = 3.6M ticks. 100GB/hour
- **Data Durability:** Ticks logged to S3 for audit. Cache is ephemeral
- **Availability:** 99.99% uptime. Degrade gracefully under load
- **Consistency:** Eventual consistency acceptable. FIFO per symbol required

### Constants/Assumptions

- **symbol_count:** 10000
- **ticks_per_sec_per_symbol:** 100
- **subscriber_count:** 100000
- **cache_window_hours:** 1
- **lag_target_ms:** 10

### Available Components

- client
- lb
- app
- cache
- stream
- worker
- object_store

### Hints

1. Use circular buffer for windowed cache
2. Partition stream by symbol for parallelism

### Tiers/Checkpoints

**T0: Time-series Cache**
  - Must include: cache

**T1: Stream**
  - Must include: stream

**T2: Backpressure**
  - Must include: worker

**T3: Scale**
  - Minimum 50 of type: app

### Reference Solution

Redis TimeSeries caches 1-hour tick windows per symbol. Stream partitioned by symbol ensures FIFO ordering. Aggregator workers pre-compute OHLC for common intervals. Backpressure manager drops oldest ticks first during overload. Subscribers prioritized by tier. This teaches time-series caching with overflow handling.

**Components:**
- Subscribers (redirect_client)
- Load Balancer (lb)
- Stream Servers (app)
- Tick Cache (Redis TS) (cache)
- Tick Stream (Kafka) (stream)
- OHLC Aggregator (worker)
- Backpressure Manager (worker)
- Tick Archive (S3) (object_store)

**Connections:**
- Subscribers → Load Balancer
- Load Balancer → Stream Servers
- Stream Servers → Tick Cache (Redis TS)
- Stream Servers → Tick Stream (Kafka)
- Tick Stream (Kafka) → OHLC Aggregator
- Tick Stream (Kafka) → Backpressure Manager
- OHLC Aggregator → Tick Cache (Redis TS)
- Backpressure Manager → Tick Archive (S3)

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 33. Multi-region Social Network Cache

**ID:** multi-region-social-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Eventual consistency with conflict resolution

### Goal

Sync posts across 5 regions in <500ms with conflict resolution.

### Description

Design a geo-distributed caching system for a social network where users can post from any region. Handle concurrent updates, detect and resolve conflicts, and provide read-after-write consistency for user's own posts. Learn about CRDTs, vector clocks, and anti-entropy protocols.

### Functional Requirements

- Cache user feeds in nearest region
- Replicate posts to all regions asynchronously
- Detect concurrent edits (same post, different regions)
- Resolve conflicts with last-write-wins or custom logic
- Provide read-after-write consistency for own posts
- Support post deletions with tombstones

### Non-Functional Requirements

- **Latency:** P95 < 100ms local reads, P95 < 500ms cross-region propagation
- **Request Rate:** 1M posts/sec globally, 10M feed reads/sec
- **Dataset Size:** 1B users. 10B posts cached (last 7 days). 10TB total cache
- **Data Durability:** Posts in database. Cache can be rebuilt
- **Availability:** 99.95% per region. Operate during regional outages
- **Consistency:** Eventual consistency with 500ms bound. RYW for author

### Constants/Assumptions

- **global_post_qps:** 1000000
- **global_read_qps:** 10000000
- **user_count:** 1000000000
- **regions:** 5
- **sync_latency_ms:** 500

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker
- queue

### Hints

1. Use vector clocks for causality tracking
2. Write-through local cache, async replicate

### Tiers/Checkpoints

**T0: Regional Cache**
  - Minimum 3 of type: cache

**T1: Replication**
  - Must include: stream

**T2: Conflict Resolution**
  - Must include: worker

**T3: Performance**
  - Minimum 100 of type: app

### Reference Solution

Three-region deployment with local caches (85% hit). Write-through ensures author sees own posts. Stream replicates to other regions in <500ms. Workers detect conflicts using vector clocks and apply LWW resolution. Read-after-write for author, eventual for followers. This teaches multi-master cache replication with conflict handling.

**Components:**
- Global Users (redirect_client)
- US LB (lb)
- EU LB (lb)
- APAC LB (lb)
- US Servers (app)
- EU Servers (app)
- APAC Servers (app)
- US Cache (cache)
- EU Cache (cache)
- APAC Cache (cache)
- Global Post DB (db_primary)
- Replication Stream (stream)
- Conflict Resolver (worker)

**Connections:**
- Global Users → US LB
- Global Users → EU LB
- Global Users → APAC LB
- US LB → US Servers
- EU LB → EU Servers
- APAC LB → APAC Servers
- US Servers → US Cache
- EU Servers → EU Cache
- APAC Servers → APAC Cache
- US Cache → Global Post DB
- EU Cache → Global Post DB
- APAC Cache → Global Post DB
- Global Post DB → Replication Stream
- Replication Stream → Conflict Resolver
- Conflict Resolver → US Cache
- Conflict Resolver → EU Cache
- Conflict Resolver → APAC Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 34. Healthcare Records Cache (HIPAA)

**ID:** healthcare-records-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Encrypted cache with audit logging and access control

### Goal

Access patient records in <100ms with full audit trail.

### Description

Design a caching system for electronic health records that must comply with HIPAA regulations. Implement encrypted caching, fine-grained access control, comprehensive audit logging, and data minimization. Learn about balancing performance with regulatory requirements.

### Functional Requirements

- Cache patient records encrypted at rest and in transit
- Enforce role-based access control (RBAC) at cache layer
- Log all cache access with user ID, timestamp, and purpose
- Support patient consent-based data sharing
- Implement data retention policies (purge after 7 years)
- Enable emergency access override with post-audit

### Non-Functional Requirements

- **Latency:** P95 < 100ms for authorized record access
- **Request Rate:** 50k patient record lookups/sec across hospitals
- **Dataset Size:** 100M patient records. Average 5MB per record. Hot cache 10GB
- **Data Durability:** Zero data loss. All changes must be audited
- **Availability:** 99.99% uptime. Patient care depends on access
- **Consistency:** Strong consistency for writes. Read-after-write required

### Constants/Assumptions

- **lookup_qps:** 50000
- **patient_count:** 100000000
- **avg_record_size_mb:** 5
- **hot_cache_gb:** 10
- **retention_years:** 7

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker

### Hints

1. Encrypt with patient-specific keys
2. Use write-through for audit compliance

### Tiers/Checkpoints

**T0: Encrypted Cache**
  - Must include: cache

**T1: Access Control**
  - Must include: app

**T2: Audit Log**
  - Must include: stream

**T3: Compliance**
  - Must include: worker

### Reference Solution

RBAC gateway enforces access control before cache lookup. Cache stores encrypted records with patient-specific keys. Write-through ensures all changes are durable. Immutable audit stream logs all access. Workers enforce retention policies and purge old data. This teaches compliance-aware caching for regulated industries.

**Components:**
- EHR Systems (redirect_client)
- Load Balancer (lb)
- RBAC Gateway (app)
- Encrypted Cache (cache)
- EHR Database (db_primary)
- Audit Log (stream)
- Retention Manager (worker)

**Connections:**
- EHR Systems → Load Balancer
- Load Balancer → RBAC Gateway
- RBAC Gateway → Encrypted Cache
- RBAC Gateway → EHR Database
- RBAC Gateway → Audit Log
- Retention Manager → EHR Database
- Retention Manager → Encrypted Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 35. Supply Chain Visibility Cache

**ID:** supply-chain-cache
**Category:** caching
**Difficulty:** Advanced

### Summary

Hierarchical multi-tenant cache with aggregation

### Goal

Track 1M shipments across 100 suppliers in real-time.

### Description

Design a caching system for supply chain visibility where multiple companies need filtered views of shared data. Implement hierarchical caching, tenant-aware aggregations, and real-time updates as shipments move. Learn about data sovereignty, access patterns, and optimizing for complex queries.

### Functional Requirements

- Cache shipment status with multi-level hierarchy
- Support supplier, warehouse, and customer views
- Aggregate metrics by region, product category, etc.
- Real-time updates as shipments scan at checkpoints
- Enforce data access rules (supplier A cannot see supplier B)
- Historical trend queries (avg delivery time last 30 days)

### Non-Functional Requirements

- **Latency:** P95 < 200ms for dashboard queries with aggregations
- **Request Rate:** 100k dashboard loads/sec, 50k shipment updates/sec
- **Dataset Size:** 10M active shipments. 100 suppliers. 1k warehouses. 100GB cache
- **Data Durability:** Shipment events in event store. Cache can be rebuilt
- **Availability:** 99.9% uptime per tenant. Isolated failures
- **Consistency:** Eventual consistency for aggregates. Real-time for shipment status

### Constants/Assumptions

- **dashboard_qps:** 100000
- **update_qps:** 50000
- **active_shipments:** 10000000
- **supplier_count:** 100
- **warehouse_count:** 1000

### Available Components

- client
- lb
- app
- cache
- db_primary
- stream
- worker

### Hints

1. Cache at multiple aggregation levels
2. Use materialized views for common rollups

### Tiers/Checkpoints

**T0: Hierarchical Cache**
  - Must include: cache

**T1: Aggregation**
  - Must include: worker

**T2: Real-time**
  - Must include: stream

**T3: Multi-tenant**
  - Minimum 3 of type: cache

### Reference Solution

Two-tier cache: raw shipments (85% hit) + pre-computed aggregates (90% hit). Workers subscribe to event stream and maintain rollup caches by supplier, region, etc. Hierarchical cache keys enable drill-down. Tenant-aware partitioning ensures data isolation. This teaches multi-tenant hierarchical caching patterns.

**Components:**
- Suppliers + Customers (redirect_client)
- Load Balancer (lb)
- Visibility API (app)
- Shipment Cache (cache)
- Aggregate Cache (cache)
- Event Store (db_primary)
- Shipment Events (stream)
- Aggregator (worker)

**Connections:**
- Suppliers + Customers → Load Balancer
- Load Balancer → Visibility API
- Visibility API → Shipment Cache
- Visibility API → Aggregate Cache
- Visibility API → Event Store
- Shipment Events → Visibility API
- Shipment Events → Aggregator
- Aggregator → Aggregate Cache

### Solution Analysis

**Architecture Overview:**

Multi-tier caching architecture optimized for moderate-scale read-heavy workloads. CDN handles edge caching, Redis provides sub-millisecond in-memory caching, with database as the source of truth.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Cache hit rates exceed 95%, minimizing database load.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cache warming and request coalescing prevent stampedes.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through cache fallback chain (L1 → L2 → Database). Automatic failover ensures continuous operation.
- Redundancy: Multi-layer caching with independent failure domains
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

**Trade-offs:**

1. Multi-tier Caching
   - Pros:
     - High hit rates
     - Graceful degradation
     - Cost efficient
   - Cons:
     - Complex invalidation
     - Consistency challenges
   - Best for: High-traffic applications with clear hot/cold data
   - Cost: Higher setup cost, lower operational cost

2. Single Cache Layer
   - Pros:
     - Simple architecture
     - Easy consistency
   - Cons:
     - Single point of failure
     - Limited throughput
   - Best for: Moderate traffic with simple caching needs
   - Cost: Lower complexity, higher scaling cost

**Cost Analysis:**

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---
