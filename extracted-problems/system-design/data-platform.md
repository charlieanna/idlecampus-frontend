# System Design - DATA-PLATFORM Problems

Total Problems: 1

---

## 1. Uber Real-Time Data Platform

**ID:** l5-data-platform-uber
**Category:** data-platform
**Difficulty:** L5-Staff

### Summary

Design Uber's real-time analytics platform

### Goal

Build real-time data platform processing 1 trillion events/day for Uber

### Description

Design Uber's data platform ingesting trip, payment, and driver data in real-time, supporting both streaming analytics and ML feature computation.

### Functional Requirements

- Ingest 1 trillion events daily
- Support sub-minute data freshness
- Enable SQL queries on streaming data
- Compute ML features in real-time
- Support time-travel queries

### Non-Functional Requirements

- **Latency:** P99 < 1 minute end-to-end
- **Throughput:** 10M events/second
- **Dataset Size:** 1 exabyte total capacity
- **Availability:** 99.95% data availability
- **Consistency:** Exactly-once processing guarantee

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 150
- **data_sources:** 5000
- **schemas:** 10000
- **retention_days:** 90
- **processing_frameworks:** 5

### Available Components

- kafka
- flink
- presto
- hdfs
- feature_store
- schema_registry

### Hints

1. Use lambda architecture pattern
2. Implement schema evolution handling
3. Design for multi-datacenter replication
4. Consider cost-based query optimization

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
