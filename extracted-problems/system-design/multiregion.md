# System Design - MULTIREGION Problems

Total Problems: 35

---

## 1. Basic Multi-Region Setup

**ID:** basic-multi-region
**Category:** multiregion
**Difficulty:** Easy

### Summary

Deploy app in two regions

### Goal

Learn multi-region deployment basics.

### Description

Deploy a simple web application across two regions with basic failover. Learn about DNS routing, health checks, and data replication fundamentals.

### Functional Requirements

- Deploy in US and EU regions
- Route users to nearest region
- Replicate data between regions
- Handle region failures
- Monitor cross-region latency

### Non-Functional Requirements

- **Latency:** P95 < 100ms same-region, < 300ms cross-region
- **Request Rate:** 10k requests/sec per region
- **Availability:** 99.95% with regional failover
- **Consistency:** Eventually consistent within 1 second

### Constants/Assumptions

- **regions:** 2
- **qps_per_region:** 10000
- **replication_lag_ms:** 1000
- **failover_time_seconds:** 30

### Available Components

- client
- cdn
- lb
- app
- db_primary
- db_replica

### Hints

1. Use GeoDNS for routing
2. Async replication between regions

### Tiers/Checkpoints

**T0: Regions**
  - Minimum 2 of type: app

**T1: Data**
  - Minimum 2 of type: db_primary

**T2: Routing**
  - Must include: cdn

### Reference Solution

GeoDNS routes users to nearest region. Each region has independent app/DB stack. Async replication between regions with 1s lag. Health checks enable automatic failover. This teaches multi-region basics.

**Components:**
- US Users (redirect_client)
- EU Users (redirect_client)
- GeoDNS (cdn)
- US LB (lb)
- EU LB (lb)
- US App (app)
- EU App (app)
- US DB (db_primary)
- EU DB (db_replica)

**Connections:**
- US Users → GeoDNS
- EU Users → GeoDNS
- GeoDNS → US LB
- GeoDNS → EU LB
- US LB → US App
- EU LB → EU App
- US App → US DB
- EU App → EU DB
- US DB → EU DB

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 2. Active-Active Multi-Region

**ID:** active-active-regions
**Category:** multiregion
**Difficulty:** Easy

### Summary

Both regions handle writes

### Goal

Implement bidirectional replication.

### Description

Build an active-active setup where both regions can handle writes. Learn about conflict resolution, vector clocks, and eventual consistency.

### Functional Requirements

- Accept writes in both regions
- Resolve write conflicts
- Maintain eventual consistency
- Handle network partitions
- Support regional preferences

### Non-Functional Requirements

- **Latency:** P95 < 50ms for local writes
- **Request Rate:** 5k writes/sec per region
- **Availability:** 99.9% per region
- **Consistency:** Eventually consistent within 5 seconds

### Constants/Assumptions

- **write_qps_per_region:** 5000
- **conflict_rate:** 0.01
- **convergence_time_ms:** 5000

### Available Components

- client
- lb
- app
- db_primary
- stream
- worker

### Hints

1. Use CRDTs for automatic conflict resolution
2. Vector clocks track causality

### Tiers/Checkpoints

**T0: Active-Active**
  - Minimum 2 of type: db_primary

**T1: Replication**
  - Must include: stream

**T2: Conflicts**
  - Must include: worker

### Reference Solution

Both regions accept writes with local latency. Changes replicated via stream with vector clock metadata. Conflict resolver uses last-write-wins with CRDTs for counters. This teaches active-active patterns.

**Components:**
- Region A Users (redirect_client)
- Region B Users (redirect_client)
- Region A LB (lb)
- Region B LB (lb)
- Region A App (app)
- Region B App (app)
- Region A DB (db_primary)
- Region B DB (db_primary)
- Replication Stream (stream)
- Conflict Resolver (worker)

**Connections:**
- Region A Users → Region A LB
- Region B Users → Region B LB
- Region A LB → Region A App
- Region B LB → Region B App
- Region A App → Region A DB
- Region B App → Region B DB
- Region A DB → Replication Stream
- Region B DB → Replication Stream
- Replication Stream → Conflict Resolver
- Conflict Resolver → Region A DB
- Conflict Resolver → Region B DB

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 3. Global CDN with Regional Origins

**ID:** global-cdn
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Serve static assets globally

### Goal

Minimize latency for static content.

### Description

Design a global CDN architecture with regional origin servers, cache invalidation, and edge optimization.

### Functional Requirements

- Edge caching in 100+ locations
- Regional origin failover
- Cache invalidation
- Dynamic content bypass
- DDoS protection

### Non-Functional Requirements

- **Latency:** P95 < 50ms globally
- **Request Rate:** 10M req/s
- **Dataset Size:** 1PB static assets
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **global_qps:** 10000000
- **edge_location_count:** 100

### Available Components

- client
- cdn
- lb
- app
- object_store

### Hints

1. CloudFront/Cloudflare edge
2. Origin shield for cache consolidation

### Tiers/Checkpoints

**T0: Edge**
  - Must include: cdn

**T1: Multi-Origin**
  - Minimum 3 of type: app

### Reference Solution

CDN caches at 95% globally. Regional origins failover via LB. S3 as source of truth. This teaches CDN architecture.

**Components:**
- Users (redirect_client)
- CDN (cdn)
- Origin LB (lb)
- US Origin (app)
- EU Origin (app)
- S3 (object_store)

**Connections:**
- Users → CDN
- CDN → Origin LB
- Origin LB → US Origin
- Origin LB → EU Origin
- US Origin → S3
- EU Origin → S3

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 4. Anycast Global Load Balancing

**ID:** global-load-balancing
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Route users to nearest healthy region

### Goal

Minimize latency with automatic failover.

### Description

Design an anycast-based global load balancing system that routes users to the geographically nearest healthy region.

### Functional Requirements

- Anycast IP routing
- Health-based routing
- Latency-based routing
- Traffic distribution
- DDoS mitigation

### Non-Functional Requirements

- **Latency:** P95 < 80ms globally
- **Request Rate:** 5M req/s
- **Dataset Size:** 100M users across 20 regions
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **global_qps:** 5000000
- **region_count:** 20

### Available Components

- client
- lb
- app
- cache

### Hints

1. BGP anycast
2. Cloudflare/AWS Global Accelerator

### Tiers/Checkpoints

**T0: Anycast**
  - Must include: lb

**T1: Multi-Region**
  - Minimum 3 of type: app

### Reference Solution

Anycast routes to nearest POP. Health checks exclude failed regions. Shared cache tier. This teaches global traffic management.

**Components:**
- Users (redirect_client)
- Anycast LB (lb)
- US-East (app)
- EU-West (app)
- AP-South (app)
- Global Cache (cache)

**Connections:**
- Users → Anycast LB
- Anycast LB → US-East
- Anycast LB → EU-West
- Anycast LB → AP-South
- US-East → Global Cache
- EU-West → Global Cache
- AP-South → Global Cache

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 5. Global Session Store with Sticky Sessions

**ID:** distributed-session-store
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Share sessions across regions

### Goal

Maintain user sessions globally.

### Description

Design a distributed session store allowing users to roam between regions while maintaining their session state.

### Functional Requirements

- Global session lookup
- Session replication
- TTL-based expiration
- Sticky sessions optional
- Session hijacking protection

### Non-Functional Requirements

- **Latency:** P95 < 50ms local, < 200ms cross-region
- **Request Rate:** 1M req/s
- **Dataset Size:** 100M active sessions
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **qps:** 1000000
- **active_sessions:** 100000000

### Available Components

- client
- lb
- app
- cache
- db_primary

### Hints

1. Redis Global Datastore
2. Session affinity via cookies

### Tiers/Checkpoints

**T0: Session Cache**
  - Must include: cache

**T1: Multi-Region**
  - Minimum 2 of type: app

### Reference Solution

Redis Global Datastore replicates sessions cross-region. LB can use sticky sessions for perf. This teaches global session management.

**Components:**
- Users (redirect_client)
- Global LB (lb)
- US Apps (app)
- EU Apps (app)
- Redis Global (cache)

**Connections:**
- Users → Global LB
- Global LB → US Apps
- Global LB → EU Apps
- US Apps → Redis Global
- EU Apps → Redis Global

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 6. Cross-Region Backup & Recovery

**ID:** multiregion-backup
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Automated backups with geo-redundancy

### Goal

Protect against data loss and region failure.

### Description

Design a backup and recovery system with cross-region replication, point-in-time recovery, and automated testing.

### Functional Requirements

- Automated continuous backup
- Cross-region replication
- Point-in-time recovery (PITR)
- Automated backup testing
- Encryption at rest and in transit

### Non-Functional Requirements

- **Latency:** Backup lag < 5min, Recovery RTO < 1hr
- **Request Rate:** N/A (background)
- **Dataset Size:** 100TB database
- **Availability:** RPO < 5min, RTO < 1hr

### Constants/Assumptions

- **database_size_tb:** 100
- **rpo_seconds:** 300
- **rto_seconds:** 3600

### Available Components

- db_primary
- object_store
- worker
- stream

### Hints

1. S3 Cross-Region Replication
2. WAL archiving for PITR

### Tiers/Checkpoints

**T0: Backup**
  - Minimum 2 of type: object_store

**T1: Automation**
  - Must include: worker

### Reference Solution

Continuous WAL archiving to S3. Cross-region replication to EU. Weekly automated restore testing. This teaches backup best practices.

**Components:**
- DB (db_primary)
- Backup Agent (worker)
- US S3 (object_store)
- EU S3 (object_store)
- Test Restore (worker)

**Connections:**
- DB → Backup Agent
- Backup Agent → US S3
- US S3 → EU S3
- US S3 → Test Restore
- EU S3 → Test Restore

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 7. Global DNS with GeoDNS Routing

**ID:** global-dns
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Route DNS queries to nearest region

### Goal

Minimize DNS resolution latency.

### Description

Design a global DNS infrastructure with GeoDNS routing, health checks, and failover capabilities.

### Functional Requirements

- GeoDNS for latency-based routing
- Health check integration
- Failover to backup regions
- DNSSEC support
- DDoS protection

### Non-Functional Requirements

- **Latency:** P95 < 50ms DNS resolution
- **Request Rate:** 100k queries/s
- **Dataset Size:** 1M DNS records
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **query_qps:** 100000
- **record_count:** 1000000

### Available Components

- client
- lb
- app

### Hints

1. Route53 GeoDNS
2. NS1 intelligent routing

### Tiers/Checkpoints

**T0: GeoDNS**
  - Must include: lb

**T1: Health Checks**
  - Minimum 3 of type: app

### Reference Solution

GeoDNS routes to nearest healthy region. Health checks every 30s. Failover within 60s. This teaches DNS-based routing.

**Components:**
- Queries (redirect_client)
- GeoDNS (lb)
- US (app)
- EU (app)
- AP (app)

**Connections:**
- Queries → GeoDNS
- GeoDNS → US
- GeoDNS → EU
- GeoDNS → AP

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 8. Global IP Anycast Network

**ID:** global-ip-anycast
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Single IP address globally

### Goal

Route to nearest POP via BGP.

### Description

Design a global anycast network where the same IP address is advertised from multiple locations via BGP routing.

### Functional Requirements

- BGP anycast advertisement
- Health-based route withdrawal
- DDoS mitigation
- Traffic engineering
- Automatic failover

### Non-Functional Requirements

- **Latency:** P95 < 50ms globally
- **Request Rate:** 20M req/s
- **Dataset Size:** 50+ POPs worldwide
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **global_qps:** 20000000
- **pop_count:** 50

### Available Components

- client
- lb
- app

### Hints

1. BGP route announcement
2. ExaBGP for automation

### Tiers/Checkpoints

**T0: Anycast**
  - Must include: lb

**T1: POPs**
  - Minimum 3 of type: app

### Reference Solution

Same IP advertised from all POPs. BGP routes to nearest. Health checks withdraw routes. This teaches anycast networking.

**Components:**
- Traffic (redirect_client)
- Anycast IP (lb)
- US POPs (app)
- EU POPs (app)
- AP POPs (app)

**Connections:**
- Traffic → Anycast IP
- Anycast IP → US POPs
- Anycast IP → EU POPs
- Anycast IP → AP POPs

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000,000 QPS, the system uses 20000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 20,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $83333

*Peak Load:*
During 10x traffic spikes (200,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 200,000,000 requests/sec
- Cost/Hour: $833333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

- Monthly Total: $92,000,000
- Yearly Total: $1,104,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $60,000,000 (20000 × $100/month per instance)
- Storage: $20,000,000 (Database storage + backup + snapshots)
- Network: $10,000,000 (Ingress/egress + CDN distribution)

---

## 9. Geofenced Feature Rollout

**ID:** geofenced-features
**Category:** multiregion
**Difficulty:** Foundation

### Summary

Launch features in specific regions first

### Goal

Progressive geographic rollout.

### Description

Design a feature flagging system that enables/disables features based on user geography for staged rollouts.

### Functional Requirements

- IP-based geolocation
- Feature flag per region
- Gradual rollout (0% → 100%)
- Rollback capability
- A/B testing per region

### Non-Functional Requirements

- **Latency:** Flag check < 5ms
- **Request Rate:** 10M req/s
- **Dataset Size:** 10k feature flags
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **qps:** 10000000
- **feature_count:** 10000

### Available Components

- client
- lb
- app
- cache
- worker

### Hints

1. MaxMind GeoIP2
2. LaunchDarkly pattern

### Tiers/Checkpoints

**T0: Geolocation**
  - Must include: worker

**T1: Flags**
  - Must include: cache

### Reference Solution

GeoIP resolves user region. Flag cache returns enabled features for region. Progressive rollout. This teaches geo-based feature flags.

**Components:**
- Users (redirect_client)
- GeoIP (worker)
- LB (lb)
- Apps (app)
- Flag Cache (cache)

**Connections:**
- Users → GeoIP
- Users → LB
- LB → Apps
- Apps → Flag Cache

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 10. Graceful Degradation on Partial Failure

**ID:** partial-region-failure
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Handle availability zone failures

### Goal

Maintain service during AZ outage.

### Description

Design a system that gracefully degrades when an availability zone fails while maintaining critical functionality.

### Functional Requirements

- AZ-aware deployment
- Health checks per AZ
- Automatic AZ failover
- Degraded mode operation
- Capacity planning for N-1 AZs

### Non-Functional Requirements

- **Latency:** P95 < 150ms normal, < 300ms degraded
- **Request Rate:** 1M req/s
- **Dataset Size:** 3 AZs per region
- **Availability:** 99.95% with AZ failure

### Constants/Assumptions

- **qps:** 1000000
- **az_per_region:** 3

### Available Components

- client
- lb
- app
- db_primary
- cache

### Hints

1. Deploy 150% capacity for 2 AZs
2. Circuit breakers

### Tiers/Checkpoints

**T0: Multi-AZ**
  - Minimum 3 of type: app

**T1: Capacity**
  - Minimum 150 of type: app

### Reference Solution

Each AZ handles 50% capacity. 2 AZs sufficient for 100% load. DB replicas span AZs. This teaches AZ resilience.

**Components:**
- Users (redirect_client)
- LB (lb)
- AZ-1 (app)
- AZ-2 (app)
- AZ-3 (app)
- Primary (db_primary)
- Cache (cache)

**Connections:**
- Users → LB
- LB → AZ-1
- LB → AZ-2
- LB → AZ-3
- AZ-1 → Primary
- AZ-2 → Primary
- AZ-3 → Primary
- AZ-1 → Cache
- AZ-2 → Cache
- AZ-3 → Cache

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 11. Facebook-like Global Platform

**ID:** global-social-network
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Facebook-scale 3B users/100M QPS globally

### Goal

Build Facebook/WhatsApp-scale global platform.

### Description

Design a Facebook/WhatsApp-scale global social network serving 3B+ users with 100M requests/sec across 20+ regions. Must deliver messages in <100ms globally, handle viral content (10B impressions/hour), survive entire continent failures, and operate within $1B/month budget. Support E2E encryption, GDPR/CCPA compliance across 190+ countries, real-time translation for 100+ languages, while maintaining data sovereignty and handling 1T+ daily messages.

### Functional Requirements

- Support 3B+ users across 20+ global regions
- Process 100M requests/sec (1B during viral events)
- Deliver 1T+ messages daily with E2E encryption
- Store user data in home region (GDPR/CCPA)
- Handle viral content spreading to 1B users/hour
- Real-time translation for 100+ languages
- Cross-region friend graph with 100B+ edges
- Support Stories/Reels with 10M concurrent uploads

### Non-Functional Requirements

- **Latency:** P99 < 100ms same-region, < 200ms global messaging
- **Request Rate:** 100M req/sec normal, 1B during viral events
- **Dataset Size:** 10B users profiles, 100PB media, 1EB total
- **Availability:** 99.999% for messaging, 99.99% for feed

### Constants/Assumptions

- **l4_enhanced:** true
- **global_qps:** 100000000
- **spike_multiplier:** 10
- **regions:** 20
- **users_total:** 3000000000
- **messages_per_day:** 1000000000000
- **cross_region_traffic:** 0.2
- **cache_hit_target:** 0.95
- **budget_monthly:** 1000000000

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- db_replica
- stream
- queue

### Hints

1. Shard by user region
2. Edge cache for media
3. Kafka for global messaging

### Tiers/Checkpoints

**T0: Multi-Region**
  - Minimum 15 of type: app

**T1: Data Locality**
  - Minimum 5 of type: db_primary

**T2: Messaging**
  - Must include: stream

### Reference Solution

User data sharded by home region for compliance. Global CDN caches media at 80% hit rate. Regional caches for social graph. Kafka enables real-time messaging across regions. This teaches global social platform architecture.

**Components:**
- Global Users (redirect_client)
- Global CDN (cdn)
- US LB (lb)
- EU LB (lb)
- US Apps (app)
- EU Apps (app)
- Regional Cache (cache)
- Regional DBs (db_primary)
- Global Kafka (stream)
- Async Queue (queue)

**Connections:**
- Global Users → Global CDN
- Global CDN → US LB
- Global CDN → EU LB
- US LB → US Apps
- EU LB → EU Apps
- US Apps → Regional Cache
- EU Apps → Regional Cache
- US Apps → Regional DBs
- EU Apps → Regional DBs
- US Apps → Global Kafka
- EU Apps → Global Kafka
- Global Kafka → Async Queue

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 12. Cross-Region Disaster Recovery

**ID:** cross-region-failover
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Automatic failover between regions

### Goal

Survive region outage with RPO < 5min.

### Description

Design a multi-region system with automatic failover, data replication, and health monitoring to survive full region outages.

### Functional Requirements

- Health checks per region
- Automatic DNS failover
- Async data replication
- RPO < 5 minutes
- RTO < 10 minutes

### Non-Functional Requirements

- **Latency:** P95 < 100ms normal, < 500ms during failover
- **Request Rate:** 500k req/s
- **Dataset Size:** 10TB per region
- **Availability:** 99.99% with region failover

### Constants/Assumptions

- **qps:** 500000
- **rpo_seconds:** 300
- **rto_seconds:** 600

### Available Components

- client
- lb
- app
- db_primary
- object_store

### Hints

1. Route53 health checks
2. Aurora Global Database

### Tiers/Checkpoints

**T0: Multi-Region**
  - Minimum 2 of type: app

**T1: Replication**
  - Minimum 2 of type: db_primary

### Reference Solution

DNS health checks route to healthy region. Async replication achieves RPO < 5min. Standby region always warm. This teaches DR patterns.

**Components:**
- Users (redirect_client)
- Global DNS (lb)
- Primary Region (app)
- Standby Region (app)
- Primary DB (db_primary)
- Standby DB (db_primary)

**Connections:**
- Users → Global DNS
- Global DNS → Primary Region
- Global DNS → Standby Region
- Primary Region → Primary DB
- Standby Region → Standby DB
- Primary DB → Standby DB

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 13. Geo-Pinning for Data Residency (GDPR)

**ID:** geo-pinning
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Keep EU data in EU

### Goal

Comply with data sovereignty laws.

### Description

Design a system that enforces data residency requirements, ensuring EU user data never leaves EU borders per GDPR.

### Functional Requirements

- Geo-fencing per region
- User location detection
- Data residency enforcement
- Audit logging
- Cross-region aggregation for analytics

### Non-Functional Requirements

- **Latency:** P95 < 150ms
- **Request Rate:** 200k req/s
- **Dataset Size:** 50M EU users, 100M US users
- **Availability:** 99.95% uptime, GDPR compliant

### Constants/Assumptions

- **qps:** 200000
- **eu_user_count:** 50000000
- **us_user_count:** 100000000

### Available Components

- client
- lb
- app
- db_primary
- worker

### Hints

1. IP geolocation
2. Database per region

### Tiers/Checkpoints

**T0: Geo-Routing**
  - Must include: lb

**T1: Regional DBs**
  - Minimum 2 of type: db_primary

### Reference Solution

IP geolocation routes EU users to EU stack. No cross-region DB access for user data. Analytics workers aggregate anonymized data. This teaches data sovereignty.

**Components:**
- Users (redirect_client)
- Geo LB (lb)
- EU Apps (app)
- US Apps (app)
- EU DB (db_primary)
- US DB (db_primary)
- Analytics (worker)

**Connections:**
- Users → Geo LB
- Geo LB → EU Apps
- Geo LB → US Apps
- EU Apps → EU DB
- US Apps → US DB
- EU DB → Analytics
- US DB → Analytics

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 14. Multi-Region Event Streaming

**ID:** multiregion-streaming
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Google Pub/Sub-scale 100M events/sec globally

### Goal

Build Google Pub/Sub-scale global event streaming.

### Description

Design a Google Pub/Sub-scale multi-region event streaming platform processing 100M events/sec across 50+ regions with exactly-once delivery. Must replicate events in <100ms cross-region, handle network partitions, survive entire region failures, and operate within $300M/month budget. Support 1M+ topics, 10M+ subscriptions, schema evolution, and serve real-time ML pipelines while maintaining ordering guarantees and exactly-once semantics.

### Functional Requirements

- Process 100M events/sec across 50+ regions
- Exactly-once delivery with <100ms replication
- Support 1M+ topics and 10M+ subscriptions
- Maintain ordering per partition globally
- Schema registry with evolution support
- Multi-region disaster recovery
- Real-time stream processing for ML
- Cross-region event replay and time travel

### Non-Functional Requirements

- **Latency:** P99 < 10ms local, < 100ms cross-region replication
- **Request Rate:** 100M events/sec normal, 1B during peaks
- **Dataset Size:** 10PB/month ingestion, 90-day retention
- **Durability:** Zero data loss with 3-way replication
- **Availability:** 99.999% for produce, 99.99% for consume

### Constants/Assumptions

- **l4_enhanced:** true
- **events_per_second_global:** 100000000
- **spike_multiplier:** 10
- **region_count:** 50
- **topics:** 1000000
- **subscriptions:** 10000000
- **retention_days:** 90
- **cache_hit_target:** 0.9
- **budget_monthly:** 300000000

### Available Components

- client
- stream
- worker
- db_primary

### Hints

1. Kafka MirrorMaker 2
2. Confluent Replicator

### Tiers/Checkpoints

**T0: Regional Streams**
  - Minimum 3 of type: stream

**T1: Replication**
  - Minimum 3 of type: worker

### Reference Solution

Regional Kafka clusters. MirrorMaker replicates across regions. Consumers read from local cluster. This teaches multi-region streaming.

**Components:**
- Producers (redirect_client)
- US Kafka (stream)
- EU Kafka (stream)
- AP Kafka (stream)
- MirrorMaker (worker)
- Consumers (worker)

**Connections:**
- Producers → US Kafka
- US Kafka → MirrorMaker
- EU Kafka → MirrorMaker
- AP Kafka → MirrorMaker
- MirrorMaker → US Kafka
- MirrorMaker → EU Kafka
- MirrorMaker → AP Kafka
- US Kafka → Consumers
- EU Kafka → Consumers
- AP Kafka → Consumers

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 15. Latency-Based Intelligent Routing

**ID:** latency-based-routing
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Route to fastest region dynamically

### Goal

Minimize P95 latency globally.

### Description

Design a routing system that measures real-user latency to each region and dynamically routes to the fastest available region.

### Functional Requirements

- Real User Monitoring (RUM)
- Latency measurement per region
- Dynamic routing updates
- Fallback to geo-proximity
- A/B testing support

### Non-Functional Requirements

- **Latency:** P95 < 100ms optimized
- **Request Rate:** 2M req/s
- **Dataset Size:** 500M users
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **qps:** 2000000
- **user_count:** 500000000

### Available Components

- client
- lb
- app
- worker
- db_primary

### Hints

1. Client-side beacons
2. EdgeWorkers for routing logic

### Tiers/Checkpoints

**T0: Monitoring**
  - Must include: worker

**T1: Dynamic Routing**
  - Must include: lb

### Reference Solution

RUM beacons measure latency to each region. Smart LB queries latency DB for routing decisions. This teaches intelligent traffic steering.

**Components:**
- Users (redirect_client)
- RUM Collector (worker)
- Smart LB (lb)
- US (app)
- EU (app)
- AP (app)
- Latency DB (db_primary)

**Connections:**
- Users → RUM Collector
- Users → Smart LB
- RUM Collector → Latency DB
- Smart LB → US
- Smart LB → EU
- Smart LB → AP
- Smart LB → Latency DB

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 2,000,000 QPS, the system uses 2000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 2,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $8333

*Peak Load:*
During 10x traffic spikes (20,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 20,000,000 requests/sec
- Cost/Hour: $83333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

- Monthly Total: $9,200,000
- Yearly Total: $110,400,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $6,000,000 (2000 × $100/month per instance)
- Storage: $2,000,000 (Database storage + backup + snapshots)
- Network: $1,000,000 (Ingress/egress + CDN distribution)

---

## 16. Multi-Region Search Index

**ID:** multiregion-search
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Replicate search index globally

### Goal

Low-latency search from any region.

### Description

Design a globally distributed search system with regional indexes, cross-region replication, and unified search results.

### Functional Requirements

- Regional search clusters
- Index replication
- Unified ranking
- Regional relevance tuning
- Real-time indexing

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 500k req/s globally
- **Dataset Size:** 10B documents
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **global_qps:** 500000
- **document_count:** 10000000000

### Available Components

- client
- lb
- app
- search
- stream
- worker

### Hints

1. Elasticsearch CCR
2. Solr cross-datacenter replication

### Tiers/Checkpoints

**T0: Regional Search**
  - Minimum 3 of type: search

**T1: Replication**
  - Must include: stream

### Reference Solution

Regional ES clusters. Index updates streamed cross-region. Geo LB routes to local search. This teaches distributed search.

**Components:**
- Users (redirect_client)
- Geo LB (lb)
- US Apps (app)
- EU Apps (app)
- AP Apps (app)
- US ES (search)
- EU ES (search)
- AP ES (search)
- Index Stream (stream)

**Connections:**
- Users → Geo LB
- Geo LB → US Apps
- Geo LB → EU Apps
- Geo LB → AP Apps
- US Apps → US ES
- EU Apps → EU ES
- AP Apps → AP ES
- US ES → Index Stream
- Index Stream → EU ES
- Index Stream → AP ES

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 17. Cross-Region Analytics Aggregation

**ID:** cross-region-analytics
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Aggregate metrics from all regions

### Goal

Unified analytics despite data residency.

### Description

Design an analytics system that aggregates data from regional databases while respecting data residency laws.

### Functional Requirements

- Region-specific raw data storage
- Anonymized cross-region aggregation
- Real-time dashboards
- Historical trend analysis
- Export for data science

### Non-Functional Requirements

- **Latency:** Dashboard < 2s, Batch < 1hr
- **Request Rate:** 1M events/s write, 10k queries/s
- **Dataset Size:** 1PB historical
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **events_per_second:** 1000000
- **query_qps:** 10000

### Available Components

- client
- stream
- worker
- db_primary
- object_store
- app

### Hints

1. Differential privacy for aggregates
2. ClickHouse for analytics

### Tiers/Checkpoints

**T0: Regional Ingest**
  - Minimum 3 of type: stream

**T1: Aggregation**
  - Must include: worker

### Reference Solution

Regional streams capture events locally. Anonymizers strip PII before aggregating. This teaches privacy-preserving analytics.

**Components:**
- Events (redirect_client)
- US Stream (stream)
- EU Stream (stream)
- AP Stream (stream)
- Anonymizers (worker)
- Analytics DB (db_primary)
- S3 Warehouse (object_store)

**Connections:**
- Events → US Stream
- Events → EU Stream
- Events → AP Stream
- US Stream → Anonymizers
- EU Stream → Anonymizers
- AP Stream → Anonymizers
- Anonymizers → Analytics DB
- Anonymizers → S3 Warehouse

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 18. Multi-Region Cache with Invalidation

**ID:** multiregion-cache
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Synchronize cache invalidations globally

### Goal

Consistent cache across regions.

### Description

Design a multi-region caching system with cache invalidation propagation and eventual consistency guarantees.

### Functional Requirements

- Regional cache clusters
- Invalidation propagation
- Lazy replication
- TTL-based expiry
- Cache warming

### Non-Functional Requirements

- **Latency:** P95 < 20ms local, < 500ms invalidation propagation
- **Request Rate:** 5M req/s
- **Dataset Size:** 100M cache entries
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **qps:** 5000000
- **cache_entries:** 100000000
- **invalidation_propagation_ms:** 500

### Available Components

- client
- lb
- app
- cache
- stream

### Hints

1. Pub/sub for invalidations
2. Redis Cluster cross-region

### Tiers/Checkpoints

**T0: Regional Caches**
  - Minimum 3 of type: cache

**T1: Invalidation**
  - Must include: stream

### Reference Solution

Regional caches serve local traffic. Invalidations published to stream reach all regions in <500ms. This teaches distributed cache coherence.

**Components:**
- Users (redirect_client)
- LB (lb)
- US (app)
- EU (app)
- AP (app)
- US Cache (cache)
- EU Cache (cache)
- AP Cache (cache)
- Invalidation Bus (stream)

**Connections:**
- Users → LB
- LB → US
- LB → EU
- LB → AP
- US → US Cache
- EU → EU Cache
- AP → AP Cache
- US Cache → Invalidation Bus
- EU Cache → Invalidation Bus
- AP Cache → Invalidation Bus

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 19. Video Content Delivery Network

**ID:** global-content-delivery
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Netflix-scale 500M concurrent streams globally

### Goal

Build Netflix/YouTube-scale global CDN.

### Description

Design a Netflix/YouTube-scale global CDN delivering 500M concurrent 4K/8K streams across 190+ countries. Must start playback in <100ms, maintain <0.5% buffering, handle viral events (5B views/hour), survive entire CDN region failures, and operate within $2B/month budget. Support adaptive bitrate, offline downloads, live streaming for 100M viewers, and serve 1 exabit/day while maintaining ISP partnerships and peering agreements.

### Functional Requirements

- Stream to 500M concurrent viewers globally
- Support 4K/8K/HDR with adaptive bitrate
- Live streaming for 100M concurrent viewers
- Start playback in <100ms globally
- Offline downloads for 100M+ devices
- Multi-CDN strategy with ISP partnerships
- DRM for 10k+ content providers
- Serve 1 exabit/day of video traffic

### Non-Functional Requirements

- **Latency:** P99 < 100ms to start, P99.9 < 200ms
- **Request Rate:** 500M concurrent streams, 5B during viral events
- **Dataset Size:** 10PB catalog, 1EB total cache capacity
- **Availability:** 99.999% for popular content, 99.99% overall

### Constants/Assumptions

- **l4_enhanced:** true
- **concurrent_streams:** 500000000
- **spike_multiplier:** 10
- **avg_bitrate_mbps:** 25
- **video_catalog_size_pb:** 10000
- **edge_locations:** 10000
- **cache_hit_target:** 0.95
- **budget_monthly:** 2000000000

### Available Components

- client
- cdn
- lb
- app
- object_store
- worker

### Hints

1. CloudFront/Akamai
2. ffmpeg for transcoding

### Tiers/Checkpoints

**T0: Edge**
  - Must include: cdn

**T1: Origin Shield**
  - Must include: app

### Reference Solution

CDN caches at 90% hit rate. Origin shield reduces S3 egress. Transcoders generate multiple bitrates. This teaches video CDN architecture.

**Components:**
- Viewers (redirect_client)
- Edge POPs (cdn)
- Origin LB (lb)
- Origin Shield (app)
- S3 Video (object_store)
- Transcoders (worker)

**Connections:**
- Viewers → Edge POPs
- Edge POPs → Origin LB
- Origin LB → Origin Shield
- Origin Shield → S3 Video
- S3 Video → Transcoders

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000,000 QPS, the system uses 500000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083333

*Peak Load:*
During 10x traffic spikes (5,000,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000,000 requests/sec
- Cost/Hour: $20833333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

- Monthly Total: $2,300,000,000
- Yearly Total: $27,600,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000,000 (500000 × $100/month per instance)
- Storage: $500,000,000 (Database storage + backup + snapshots)
- Network: $250,000,000 (Ingress/egress + CDN distribution)

---

## 20. Edge Computing with Serverless Functions

**ID:** edge-computing
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Run code at the edge globally

### Goal

Ultra-low latency compute.

### Description

Design an edge computing platform running serverless functions at 100+ global edge locations for sub-50ms latency.

### Functional Requirements

- Deploy functions globally
- Request routing to nearest edge
- Edge-to-origin communication
- Edge state management
- A/B testing at edge

### Non-Functional Requirements

- **Latency:** P95 < 50ms
- **Request Rate:** 50M req/s globally
- **Dataset Size:** 10k functions, 100+ edge locations
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **global_qps:** 50000000
- **edge_locations:** 100
- **functions:** 10000

### Available Components

- client
- cdn
- worker
- cache
- app

### Hints

1. Cloudflare Workers
2. Lambda@Edge

### Tiers/Checkpoints

**T0: Edge**
  - Must include: cdn

**T1: Functions**
  - Must include: worker

### Reference Solution

Functions deployed to 100+ edge POPs. KV store for edge state. Origin fallback. This teaches edge computing.

**Components:**
- Users (redirect_client)
- Edge Network (cdn)
- Edge Functions (worker)
- Edge KV (cache)
- Origin (app)

**Connections:**
- Users → Edge Network
- Edge Network → Edge Functions
- Edge Functions → Edge KV
- Edge Functions → Origin

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000,000 QPS, the system uses 50000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 50,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $208333

*Peak Load:*
During 10x traffic spikes (500,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 500,000,000 requests/sec
- Cost/Hour: $2083333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

- Monthly Total: $230,000,000
- Yearly Total: $2,760,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $150,000,000 (50000 × $100/month per instance)
- Storage: $50,000,000 (Database storage + backup + snapshots)
- Network: $25,000,000 (Ingress/egress + CDN distribution)

---

## 21. Multi-Region Message Queue

**ID:** multiregion-queue
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Replicate queues across regions

### Goal

Durable messaging with regional failover.

### Description

Design a multi-region message queue with cross-region replication, exactly-once delivery, and automatic failover.

### Functional Requirements

- Cross-region queue replication
- Exactly-once delivery
- Message ordering per partition
- Dead letter queues
- Regional consumers

### Non-Functional Requirements

- **Latency:** P95 < 100ms local, < 500ms cross-region
- **Request Rate:** 500k msg/s
- **Dataset Size:** 1B messages/day
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **messages_per_second:** 500000
- **daily_messages:** 1000000000

### Available Components

- client
- queue
- worker
- stream

### Hints

1. SQS FIFO queues
2. RabbitMQ federation

### Tiers/Checkpoints

**T0: Regional Queues**
  - Minimum 3 of type: queue

**T1: Replication**
  - Must include: stream

### Reference Solution

Regional queues with cross-region replication via stream. Consumers can read from any region. This teaches distributed queuing.

**Components:**
- Producers (redirect_client)
- US Queue (queue)
- EU Queue (queue)
- AP Queue (queue)
- Replication (stream)
- Consumers (worker)

**Connections:**
- Producers → US Queue
- Producers → EU Queue
- Producers → AP Queue
- US Queue → Replication
- EU Queue → Replication
- AP Queue → Replication
- Replication → Consumers

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 22. Regional Sharding Strategy

**ID:** regional-sharding
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Shard by geography for locality

### Goal

Optimize for regional access patterns.

### Description

Design a sharding strategy that partitions data by region to optimize for local access while supporting cross-region queries.

### Functional Requirements

- Shard by user region
- Local writes, cross-region reads
- Shard rebalancing
- Cross-shard transactions
- Consistent hashing

### Non-Functional Requirements

- **Latency:** P95 < 80ms local, < 300ms cross-region
- **Request Rate:** 800k req/s
- **Dataset Size:** 500M users, 5 regions
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **qps:** 800000
- **user_count:** 500000000
- **region_count:** 5

### Available Components

- client
- lb
- app
- db_primary
- cache

### Hints

1. Consistent hashing ring
2. Vitess for MySQL sharding

### Tiers/Checkpoints

**T0: Sharding**
  - Minimum 5 of type: db_primary

**T1: Routing**
  - Must include: app

### Reference Solution

Consistent hashing maps users to regional shards. Local writes low-latency. Cross-region reads possible. This teaches regional sharding.

**Components:**
- Users (redirect_client)
- LB (lb)
- Shard Router (app)
- US Shard (db_primary)
- EU Shard (db_primary)
- AP Shard (db_primary)
- Shard Map (cache)

**Connections:**
- Users → LB
- LB → Shard Router
- Shard Router → US Shard
- Shard Router → EU Shard
- Shard Router → AP Shard
- Shard Router → Shard Map

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 800,000 QPS, the system uses 800 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 800,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $3333

*Peak Load:*
During 10x traffic spikes (8,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 8,000,000 requests/sec
- Cost/Hour: $33333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

- Monthly Total: $3,680,000
- Yearly Total: $44,160,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $2,400,000 (800 × $100/month per instance)
- Storage: $800,000 (Database storage + backup + snapshots)
- Network: $400,000 (Ingress/egress + CDN distribution)

---

## 23. Cross-Region Observability Platform

**ID:** cross-region-observability
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Unified metrics, logs, traces globally

### Goal

Monitor all regions from single pane.

### Description

Design an observability platform aggregating metrics, logs, and traces from all regions into a unified dashboard.

### Functional Requirements

- Metrics aggregation
- Distributed tracing
- Log aggregation
- Cross-region correlation
- Alerting

### Non-Functional Requirements

- **Latency:** Ingestion < 10s, Query < 5s
- **Request Rate:** 10M events/s
- **Dataset Size:** 1PB/month
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **events_per_second:** 10000000
- **monthly_data_pb:** 1

### Available Components

- stream
- worker
- db_primary
- object_store
- app

### Hints

1. Prometheus federation
2. Jaeger for tracing

### Tiers/Checkpoints

**T0: Collection**
  - Minimum 3 of type: stream

**T1: Aggregation**
  - Must include: worker

### Reference Solution

Regional streams aggregate to central workers. Hot data in time-series DB, cold in S3. This teaches global observability.

**Components:**
- US Stream (stream)
- EU Stream (stream)
- AP Stream (stream)
- Aggregators (worker)
- Time-series DB (db_primary)
- S3 Archive (object_store)
- Query API (app)

**Connections:**
- US Stream → Aggregators
- EU Stream → Aggregators
- AP Stream → Aggregators
- Aggregators → Time-series DB
- Aggregators → S3 Archive
- Query API → Time-series DB
- Query API → S3 Archive

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 24. Regional Quota & Billing System

**ID:** regional-quota-enforcement
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Track usage per region for billing

### Goal

Accurate billing despite multi-region usage.

### Description

Design a system to track resource usage across regions for accurate billing and quota enforcement.

### Functional Requirements

- Per-region usage tracking
- Global quota aggregation
- Real-time quota checks
- Monthly billing rollup
- Usage exports

### Non-Functional Requirements

- **Latency:** Quota check < 10ms
- **Request Rate:** 5M ops/s
- **Dataset Size:** 1M customers, 5 regions
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **ops_per_second:** 5000000
- **customer_count:** 1000000
- **region_count:** 5

### Available Components

- client
- lb
- app
- cache
- stream
- worker
- db_primary

### Hints

1. Redis for fast counters
2. Hourly aggregation to reduce skew

### Tiers/Checkpoints

**T0: Local Counters**
  - Minimum 3 of type: cache

**T1: Aggregation**
  - Must include: stream

### Reference Solution

Local counters increment immediately. Hourly flush to stream. Aggregator rolls up for billing. This teaches distributed metering.

**Components:**
- API (redirect_client)
- LB (lb)
- Apps (app)
- Counters (cache)
- Usage Events (stream)
- Aggregator (worker)
- Billing DB (db_primary)

**Connections:**
- API → LB
- LB → Apps
- Apps → Counters
- Apps → Usage Events
- Usage Events → Aggregator
- Aggregator → Billing DB

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000,000 QPS, the system uses 5000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 5,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $20833

*Peak Load:*
During 10x traffic spikes (50,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 50,000,000 requests/sec
- Cost/Hour: $208333

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 25. Cross-Region Secrets Management

**ID:** cross-region-secrets
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Sync secrets globally securely

### Goal

Secure secret distribution.

### Description

Design a secrets management system that replicates encrypted secrets across regions while maintaining strong security.

### Functional Requirements

- Encrypted storage
- Cross-region replication
- Secret rotation
- Access control (IAM)
- Audit logging

### Non-Functional Requirements

- **Latency:** Retrieval < 100ms
- **Request Rate:** 100k req/s
- **Dataset Size:** 1M secrets
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **qps:** 100000
- **secret_count:** 1000000

### Available Components

- app
- worker
- cache
- db_primary
- stream

### Hints

1. Vault for secrets
2. KMS envelope encryption

### Tiers/Checkpoints

**T0: Encryption**
  - Must include: worker

**T1: Replication**
  - Minimum 3 of type: db_primary

### Reference Solution

KMS encrypts secrets. Vault replicates across regions. Cache for performance. Audit log for compliance. This teaches secret management.

**Components:**
- Apps (app)
- Secret Cache (cache)
- KMS (worker)
- Vault (db_primary)
- Audit Log (stream)

**Connections:**
- Apps → Secret Cache
- Secret Cache → Vault
- Vault → KMS
- Apps → Audit Log

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 26. Google Spanner Clone

**ID:** planet-scale-database
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Globally consistent database

### Goal

Build a planet-scale distributed SQL database.

### Description

Design a globally distributed SQL database with strong consistency like Google Spanner. Implement TrueTime, multi-version concurrency control, and global transactions.

### Functional Requirements

- Support global ACID transactions
- Implement external consistency
- Use synchronized clocks (TrueTime)
- Handle automatic sharding
- Support SQL with joins
- Enable point-in-time recovery
- Provide 5 nines availability
- Scale to thousands of nodes

### Non-Functional Requirements

- **Latency:** P95 < 20ms local reads, < 100ms global writes
- **Request Rate:** 10M ops/sec globally
- **Dataset Size:** 100PB across all regions
- **Availability:** 99.999% uptime
- **Consistency:** External consistency (linearizability)

### Constants/Assumptions

- **global_ops_per_sec:** 10000000
- **regions:** 7
- **nodes_per_region:** 100
- **clock_uncertainty_ms:** 7

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

1. Paxos for consensus
2. MVCC for concurrency
3. Atomic clocks for TrueTime

### Tiers/Checkpoints

**T0: Distribution**
  - Minimum 7 of type: db_primary

**T1: Consensus**
  - Minimum 21 of type: db_replica

**T2: Clock Sync**
  - Must include: worker

**T3: Scale**
  - Minimum 200 of type: app

### Reference Solution

Paxos groups with 3 replicas each ensure consistency. TrueTime provides globally synchronized timestamps with 7ms uncertainty. MVCC enables lock-free reads. Automatic sharding and rebalancing. This teaches planet-scale database architecture.

**Components:**
- Global Apps (redirect_client)
- Edge Routers (cdn)
- Regional LBs (lb)
- Span Servers (app)
- Paxos Leaders (db_primary)
- Paxos Replicas (db_replica)
- TrueTime (worker)
- Location Cache (cache)
- Commit Log (stream)
- Schema Queue (queue)

**Connections:**
- Global Apps → Edge Routers
- Edge Routers → Regional LBs
- Regional LBs → Span Servers
- Span Servers → Paxos Leaders
- Span Servers → Paxos Replicas
- Span Servers → TrueTime
- Span Servers → Location Cache
- Paxos Leaders → Commit Log
- Paxos Replicas → Commit Log
- Commit Log → Schema Queue

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 27. Multi-Master Conflict Resolution

**ID:** conflict-resolution
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Google Spanner-scale 10M writes/sec globally

### Goal

Handle Google Spanner-scale conflict resolution.

### Description

Design a Google Spanner-scale conflict resolution system handling 10M writes/sec across 100+ regions with active-active replication. Must resolve conflicts in <100ms using TrueTime/HLC, handle network partitions lasting hours, survive multiple datacenter failures, and operate within $200M/month budget. Support CRDTs, vector clocks, custom merge strategies, and maintain strong consistency for financial transactions while serving global banks and payment processors.

### Functional Requirements

- Process 10M concurrent writes/sec globally
- Active-active replication across 100+ regions
- TrueTime/HLC for global ordering
- Support CRDTs for automatic resolution
- Custom merge strategies for business logic
- Detect conflicts within 10ms
- Track lineage for 1B+ objects
- Support financial ACID requirements

### Non-Functional Requirements

- **Latency:** P99 < 100ms conflict detection, < 200ms resolution
- **Request Rate:** 10M writes/sec, 100M during Black Friday
- **Dataset Size:** 100B objects, 1PB conflict logs
- **Availability:** 99.999% with automatic failover
- **Consistency:** Strong consistency for payments, eventual for social

### Constants/Assumptions

- **l4_enhanced:** true
- **global_write_qps:** 10000000
- **spike_multiplier:** 10
- **conflict_rate:** 0.05
- **regions:** 100
- **resolution_time_ms:** 100
- **cache_hit_target:** 0.9
- **budget_monthly:** 200000000

### Available Components

- client
- lb
- app
- db_primary
- worker
- stream

### Hints

1. CRDTs for commutative operations
2. Dynamo-style vector clocks

### Tiers/Checkpoints

**T0: Multi-Master**
  - Minimum 3 of type: db_primary

**T1: Conflict Detection**
  - Must include: worker

### Reference Solution

Multi-master replication between regions. Vector clocks detect conflicts. Resolver applies LWW or custom merge logic. This teaches conflict resolution strategies.

**Components:**
- Writers (redirect_client)
- LB (lb)
- US Apps (app)
- EU Apps (app)
- AP Apps (app)
- US DB (db_primary)
- EU DB (db_primary)
- AP DB (db_primary)
- Conflict Resolver (worker)

**Connections:**
- Writers → LB
- LB → US Apps
- LB → EU Apps
- LB → AP Apps
- US Apps → US DB
- EU Apps → EU DB
- AP Apps → AP DB
- US DB → EU DB
- EU DB → AP DB
- AP DB → US DB
- US DB → Conflict Resolver
- EU DB → Conflict Resolver
- AP DB → Conflict Resolver

---

## 28. Global Rate Limiting System

**ID:** global-rate-limiting
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Google-scale 100M QPS distributed rate limiting

### Goal

Build Google Cloud-scale rate limiting.

### Description

Design a Google Cloud-scale global rate limiting system processing 100M requests/sec across 50+ regions with <1ms decision latency. Must enforce limits for 100M+ API keys, handle DDoS attacks (10B req/sec), survive region failures, and operate within $150M/month budget. Support hierarchical quotas, sliding windows, distributed counters with eventual consistency, and protect against 100Gbps+ attack traffic while serving global enterprises.

### Functional Requirements

- Process 100M rate limit decisions/sec globally
- Track quotas for 100M+ API keys/users
- Hierarchical limits (user/org/global)
- Sliding window and token bucket algorithms
- Distributed counter sync with <100ms lag
- DDoS protection at 10B req/sec scale
- Graceful degradation during attacks
- Real-time quota adjustment and overrides

### Non-Functional Requirements

- **Latency:** P99 < 1ms decision time, P99.9 < 5ms
- **Request Rate:** 100M req/s normal, 10B during DDoS attacks
- **Dataset Size:** 100M API keys, 1B rate limit rules
- **Availability:** 99.999% for rate limiting decisions

### Constants/Assumptions

- **l4_enhanced:** true
- **global_qps:** 100000000
- **spike_multiplier:** 100
- **api_keys:** 100000000
- **regions:** 50
- **limit_window_seconds:** 60
- **sync_interval_ms:** 100
- **cache_hit_target:** 0.999
- **budget_monthly:** 150000000

### Available Components

- client
- lb
- app
- cache
- worker

### Hints

1. Token bucket algorithm
2. Gossip protocol for counter sync

### Tiers/Checkpoints

**T0: Local Limiters**
  - Minimum 3 of type: cache

**T1: Coordination**
  - Must include: worker

### Reference Solution

Local Redis enforces limits with <5ms latency. Gossip syncs counters every 10s for global accuracy. This teaches distributed rate limiting.

**Components:**
- Clients (redirect_client)
- LB (lb)
- US (app)
- EU (app)
- AP (app)
- US Redis (cache)
- EU Redis (cache)
- AP Redis (cache)
- Gossip Sync (worker)

**Connections:**
- Clients → LB
- LB → US
- LB → EU
- LB → AP
- US → US Redis
- EU → EU Redis
- AP → AP Redis
- US Redis → Gossip Sync
- EU Redis → Gossip Sync
- AP Redis → Gossip Sync

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 29. Read-Your-Writes Consistency Globally

**ID:** read-your-writes
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Users see their own writes immediately

### Goal

Provide read-after-write consistency.

### Description

Design a system that guarantees users always see their own writes even when reading from a different region.

### Functional Requirements

- Session-based write tracking
- Version vectors
- Stale read detection
- Automatic fallback to primary
- Bounded staleness

### Non-Functional Requirements

- **Latency:** P95 < 100ms, P99 < 300ms
- **Request Rate:** 1M req/s
- **Dataset Size:** 100M users
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **qps:** 1000000
- **user_count:** 100000000
- **max_staleness_ms:** 1000

### Available Components

- client
- lb
- app
- db_primary
- db_replica
- cache

### Hints

1. Hybrid logical clocks
2. Session tokens carry version

### Tiers/Checkpoints

**T0: Version Tracking**
  - Must include: cache

**T1: Replication**
  - Minimum 6 of type: db_replica

### Reference Solution

Session tokens carry latest write version. Apps check replica version before reading. If stale, fallback to primary. This teaches causal consistency.

**Components:**
- Users (redirect_client)
- LB (lb)
- Apps (app)
- Version Cache (cache)
- Primary DB (db_primary)
- Read Replicas (db_replica)

**Connections:**
- Users → LB
- LB → Apps
- Apps → Version Cache
- Apps → Primary DB
- Apps → Read Replicas
- Primary DB → Read Replicas

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 30. Regional Compliance & Data Sovereignty

**ID:** regional-compliance
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Multi-tenant with per-tenant regions

### Goal

Enforce customer-specific data residency.

### Description

Design a multi-tenant system where each tenant can specify their data residency requirements and compliance needs.

### Functional Requirements

- Per-tenant region preference
- Data residency enforcement
- Compliance audit logs
- Cross-tenant isolation
- Regional billing

### Non-Functional Requirements

- **Latency:** P95 < 150ms
- **Request Rate:** 300k req/s
- **Dataset Size:** 10k tenants, 1B records
- **Availability:** 99.95% uptime per region

### Constants/Assumptions

- **qps:** 300000
- **tenant_count:** 10000
- **record_count:** 1000000000

### Available Components

- client
- lb
- app
- db_primary
- worker
- stream

### Hints

1. Tenant metadata in global directory
2. Separate DB per region

### Tiers/Checkpoints

**T0: Routing**
  - Must include: lb

**T1: Isolation**
  - Minimum 3 of type: db_primary

### Reference Solution

Router uses tenant ID to select region. Data never leaves tenant's region. Audit log for compliance. This teaches multi-tenant data sovereignty.

**Components:**
- Tenants (redirect_client)
- Tenant Router (lb)
- US Apps (app)
- EU Apps (app)
- AP Apps (app)
- US DB (db_primary)
- EU DB (db_primary)
- AP DB (db_primary)
- Audit Log (stream)

**Connections:**
- Tenants → Tenant Router
- Tenant Router → US Apps
- Tenant Router → EU Apps
- Tenant Router → AP Apps
- US Apps → US DB
- EU Apps → EU DB
- AP Apps → AP DB
- US Apps → Audit Log
- EU Apps → Audit Log
- AP Apps → Audit Log

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 300,000 QPS, the system uses 300 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 300,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $1250

*Peak Load:*
During 10x traffic spikes (3,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 3,000,000 requests/sec
- Cost/Hour: $12500

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

- Monthly Total: $1,380,000
- Yearly Total: $16,560,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $900,000 (300 × $100/month per instance)
- Storage: $300,000 (Database storage + backup + snapshots)
- Network: $150,000 (Ingress/egress + CDN distribution)

---

## 31. Zero-Downtime Cross-Region Migration

**ID:** cross-region-migration
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Migrate users to new region without downtime

### Goal

Seamless region migration.

### Description

Design a system to migrate millions of users from one region to another with zero downtime and no data loss.

### Functional Requirements

- Dual-write during migration
- Gradual traffic shift
- Data consistency verification
- Rollback capability
- Migration progress tracking

### Non-Functional Requirements

- **Latency:** P95 < 150ms during migration
- **Request Rate:** 500k req/s
- **Dataset Size:** 10M users, 100TB data
- **Availability:** 99.99% during migration

### Constants/Assumptions

- **qps:** 500000
- **users_to_migrate:** 10000000
- **data_size_tb:** 100

### Available Components

- client
- lb
- app
- db_primary
- stream
- worker

### Hints

1. Shadow traffic for testing
2. Checksum validation

### Tiers/Checkpoints

**T0: Dual Write**
  - Minimum 2 of type: db_primary

**T1: Verification**
  - Must include: worker

### Reference Solution

Dual writes to both regions. CDC stream backfills old data. Verifier checks consistency. LB gradually shifts traffic. This teaches live migration.

**Components:**
- Users (redirect_client)
- Migration LB (lb)
- Old Region (app)
- New Region (app)
- Source DB (db_primary)
- Target DB (db_primary)
- CDC Stream (stream)
- Verifier (worker)

**Connections:**
- Users → Migration LB
- Migration LB → Old Region
- Migration LB → New Region
- Old Region → Source DB
- New Region → Target DB
- Source DB → CDC Stream
- CDC Stream → Target DB
- Source DB → Verifier
- Target DB → Verifier

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 32. Global Time Synchronization (TrueTime-like)

**ID:** time-synchronization
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Synchronized clocks across regions

### Goal

Bound clock uncertainty for distributed transactions.

### Description

Design a time synchronization system providing bounded clock uncertainty for distributed transactions like Google's TrueTime.

### Functional Requirements

- Atomic clock references
- GPS synchronization
- Uncertainty bounds
- Commit wait protocol
- Clock drift monitoring

### Non-Functional Requirements

- **Latency:** Uncertainty < 7ms
- **Request Rate:** 10M timestamps/s
- **Dataset Size:** 100+ datacenters
- **Availability:** 99.999% uptime

### Constants/Assumptions

- **timestamp_qps:** 10000000
- **max_uncertainty_ms:** 7
- **datacenter_count:** 100

### Available Components

- worker
- app

### Hints

1. GPS + atomic clocks
2. Commit-wait for external consistency

### Tiers/Checkpoints

**T0: Time Masters**
  - Must include: worker

**T1: Distribution**
  - Minimum 3 of type: worker

### Reference Solution

Atomic clocks + GPS provide ground truth. Time servers sync every 30s. Uncertainty bounded to 7ms. This teaches distributed time.

**Components:**
- Apps (app)
- Atomic Masters (worker)
- US Time Servers (worker)
- EU/AP Time Servers (worker)

**Connections:**
- Apps → US Time Servers
- Apps → EU/AP Time Servers
- Atomic Masters → US Time Servers
- Atomic Masters → EU/AP Time Servers

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 33. Global Leader Election with Consensus

**ID:** global-leader-election
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Elect single leader across regions

### Goal

Coordinate with Paxos/Raft.

### Description

Design a global leader election system using distributed consensus (Paxos/Raft) to coordinate across regions.

### Functional Requirements

- Leader election via consensus
- Automatic failover on leader failure
- Split-brain prevention
- Lease-based leadership
- Observer nodes for reads

### Non-Functional Requirements

- **Latency:** Election < 10s, Lease renewal < 100ms
- **Request Rate:** 100k operations/s
- **Dataset Size:** 5 regions, 15 nodes
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **ops_per_second:** 100000
- **region_count:** 5
- **nodes_per_region:** 3

### Available Components

- app
- worker
- db_primary

### Hints

1. Raft for simplicity
2. Etcd/Consul for coordination

### Tiers/Checkpoints

**T0: Quorum**
  - Minimum 5 of type: worker

**T1: Leader**
  - Must include: db_primary

### Reference Solution

Raft consensus among 9 nodes across 3 regions. Majority quorum (5/9) required. Leader lease renewable. This teaches distributed consensus.

**Components:**
- Apps (app)
- Consensus-US (worker)
- Consensus-EU (worker)
- Consensus-AP (worker)
- Leader State (db_primary)

**Connections:**
- Apps → Consensus-US
- Apps → Consensus-EU
- Apps → Consensus-AP
- Consensus-US → Leader State
- Consensus-EU → Leader State
- Consensus-AP → Leader State

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 34. CRDTs for Conflict-Free Replication

**ID:** multiregion-crdt
**Category:** multiregion
**Difficulty:** Advanced

### Summary

Replicate state without coordination

### Goal

Achieve eventual consistency automatically.

### Description

Design a system using Conflict-free Replicated Data Types (CRDTs) for automatic conflict resolution without coordination.

### Functional Requirements

- CRDT counters
- CRDT sets
- CRDT maps
- Operation-based or state-based
- Garbage collection

### Non-Functional Requirements

- **Latency:** P95 < 100ms local, < 500ms convergence
- **Request Rate:** 500k ops/s
- **Dataset Size:** 100M objects
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **ops_per_second:** 500000
- **object_count:** 100000000

### Available Components

- client
- lb
- app
- db_primary
- stream

### Hints

1. Riak KV uses CRDTs
2. Automerge library

### Tiers/Checkpoints

**T0: CRDT Nodes**
  - Minimum 3 of type: app

**T1: Sync**
  - Must include: stream

### Reference Solution

Each region applies CRDT operations locally. Ops streamed to all regions. Automatic conflict resolution. This teaches CRDTs.

**Components:**
- Users (redirect_client)
- LB (lb)
- US CRDT (app)
- EU CRDT (app)
- AP CRDT (app)
- Op Stream (stream)
- State Store (db_primary)

**Connections:**
- Users → LB
- LB → US CRDT
- LB → EU CRDT
- LB → AP CRDT
- US CRDT → Op Stream
- EU CRDT → Op Stream
- AP CRDT → Op Stream
- Op Stream → State Store

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for high-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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

## 35. Multi-Region Container Orchestration

**ID:** multiregion-orchestration
**Category:** multiregion
**Difficulty:** Intermediate

### Summary

Deploy containers to multiple regions

### Goal

Unified control plane for global deployments.

### Description

Design a container orchestration system managing deployments across multiple regions with centralized control.

### Functional Requirements

- Multi-cluster management
- Global service discovery
- Cross-region networking
- Health monitoring
- Rolling updates

### Non-Functional Requirements

- **Latency:** Deploy < 5min globally
- **Request Rate:** 10k containers deployed/hr
- **Dataset Size:** 100k containers, 5 regions
- **Availability:** 99.9% control plane uptime

### Constants/Assumptions

- **deploy_rate_per_hour:** 10000
- **container_count:** 100000
- **region_count:** 5

### Available Components

- app
- worker
- lb
- stream

### Hints

1. Kubernetes multi-cluster
2. Service mesh for cross-region

### Tiers/Checkpoints

**T0: Clusters**
  - Minimum 5 of type: worker

**T1: Federation**
  - Must include: lb

### Reference Solution

Central control plane federates regional clusters. Rolling updates coordinated globally. This teaches multi-cluster orchestration.

**Components:**
- Control Plane (app)
- Federation LB (lb)
- US Cluster (worker)
- EU Cluster (worker)
- AP Cluster (worker)
- Deployment Events (stream)

**Connections:**
- Control Plane → Federation LB
- Federation LB → US Cluster
- Federation LB → EU Cluster
- Federation LB → AP Cluster
- US Cluster → Deployment Events
- EU Cluster → Deployment Events
- AP Cluster → Deployment Events

### Solution Analysis

**Architecture Overview:**

Global distribution architecture for moderate-scale worldwide traffic. Active-active or active-passive replication based on consistency requirements.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. GeoDNS routes users to nearest region for low latency.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Cross-region traffic balancing prevents hotspots.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through regional failover with DNS updates. Automatic failover ensures continuous operation.
- Redundancy: Active-active or active-passive across regions
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
