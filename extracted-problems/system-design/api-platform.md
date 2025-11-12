# System Design - API-PLATFORM Problems

Total Problems: 2

---

## 1. Facebook Global API Gateway

**ID:** l5-api-gateway-facebook
**Category:** api-platform
**Difficulty:** L5-Staff

### Summary

Design API gateway for Facebook's 10,000+ services

### Goal

Build API gateway handling 100M requests/second across 10,000 microservices

### Description

Facebook needs a unified API gateway for 10,000+ internal services. Design system handling authentication, rate limiting, routing, and protocol translation at massive scale.

### Functional Requirements

- Route to 10,000+ backend services
- Support REST, GraphQL, gRPC protocols
- Handle authentication and authorization
- Enable rate limiting per client
- Support API versioning and deprecation

### Non-Functional Requirements

- **Latency:** P99 < 10ms gateway overhead
- **Request Rate:** 100M requests/second
- **Availability:** 99.99% uptime
- **Scalability:** Auto-scale to 2x traffic
- **Security:** DDoS protection, WAF integration

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 500
- **service_count:** 10000
- **api_versions:** 5
- **rate_limit_tiers:** 10
- **protocol_types:** 4

### Available Components

- api_gateway
- service_registry
- rate_limiter
- auth_service
- cache
- waf

### Hints

1. Use service mesh for internal routing
2. Implement edge caching for common requests
3. Design plugin architecture for extensibility
4. Consider geographic load distribution

### Solution Analysis

**Architecture Overview:**

Standard three-tier architecture optimized for high-scale workloads.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. System operates within design parameters.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Horizontal scaling handles increased load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through redundancy and automatic failover. Automatic failover ensures continuous operation.
- Redundancy: N+1 redundancy with automatic failover
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

**L5 Staff-Level Considerations:**

*Migration Strategy:*
- Phase: Phase 1: Assessment (2 months)
  - Teams: Architecture, DevOps, Security
  - Rollback: Continue with existing system
- Phase: Phase 2: Pilot Migration (3 months)
  - Teams: Platform, Selected product teams
  - Rollback: Maintain dual systems, rollback pilot
- Phase: Phase 3: Gradual Rollout (6 months)
  - Teams: All engineering teams
  - Rollback: Feature flags for instant rollback
- Phase: Phase 4: Complete Migration (3 months)
  - Teams: Platform, Operations
  - Rollback: Maintain legacy system for 6 months

*Organizational Impact:*
- Teams Affected: 50
- Training: 40 hours per engineer over 3 months

---

## 2. Netflix GraphQL Federation Platform

**ID:** l5-api-graphql-federation
**Category:** api-platform
**Difficulty:** L5-Staff

### Summary

Design federated GraphQL for Netflix's 1000 services

### Goal

Build GraphQL federation platform unifying 1000 Netflix services for all clients

### Description

Netflix has 1000 microservices with different APIs. Design federated GraphQL platform providing unified API for web, mobile, TV clients with optimized query execution.

### Functional Requirements

- Federate 1000 service schemas
- Optimize query execution plans
- Support real-time subscriptions
- Enable field-level caching
- Handle partial failures gracefully

### Non-Functional Requirements

- **Latency:** P99 < 100ms for queries
- **Throughput:** 1M queries/second
- **Dataset Size:** 100K types and fields in schema
- **Availability:** 99.95% uptime
- **Scalability:** Minimize over-fetching

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 100
- **subgraph_count:** 1000
- **max_query_depth:** 10
- **subscription_connections:** 10000000
- **cache_hit_rate:** 0.8

### Available Components

- graphql_gateway
- schema_registry
- query_planner
- dataloader
- subscription_hub

### Hints

1. Use query planning for optimization
2. Implement distributed tracing
3. Design schema composition strategy
4. Consider client-specific optimizations

### Solution Analysis

**Architecture Overview:**

Standard three-tier architecture optimized for high-scale workloads.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000,000 QPS, the system uses 10000 instances with optimal resource utilization. System operates within design parameters.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 10,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $41667

*Peak Load:*
During 10x traffic spikes (100,000,000 QPS), auto-scaling engages within 60 seconds. Horizontal scaling handles increased load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 100,000,000 requests/sec
- Cost/Hour: $416667

*Failure Scenarios:*
System handles failures through redundancy and automatic failover. Automatic failover ensures continuous operation.
- Redundancy: N+1 redundancy with automatic failover
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

**L5 Staff-Level Considerations:**

*Migration Strategy:*
- Phase: Phase 1: Assessment (2 months)
  - Teams: Architecture, DevOps, Security
  - Rollback: Continue with existing system
- Phase: Phase 2: Pilot Migration (3 months)
  - Teams: Platform, Selected product teams
  - Rollback: Maintain dual systems, rollback pilot
- Phase: Phase 3: Gradual Rollout (6 months)
  - Teams: All engineering teams
  - Rollback: Feature flags for instant rollback
- Phase: Phase 4: Complete Migration (3 months)
  - Teams: Platform, Operations
  - Rollback: Maintain legacy system for 6 months

*Organizational Impact:*
- Teams Affected: 50
- Training: 40 hours per engineer over 3 months

---
