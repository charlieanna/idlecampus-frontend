# System Design - OBSERVABILITY Problems

Total Problems: 1

---

## 1. DataDog-Scale Observability Platform

**ID:** l5-observability-datadog
**Category:** observability
**Difficulty:** L5-Staff

### Summary

Design observability for 10K companies

### Goal

Build multi-tenant observability platform monitoring 10K companies' infrastructure

### Description

Design DataDog-scale platform ingesting metrics, logs, and traces from 10K companies, providing real-time dashboards, alerting, and anomaly detection.

### Functional Requirements

- Ingest 10T data points daily
- Support 1M custom metrics
- Provide < 1 minute data latency
- Enable complex query language
- Support 100K dashboards

### Non-Functional Requirements

- **Latency:** P99 < 1s query response
- **Throughput:** 100M metrics/second ingestion
- **Data Durability:** 15 months data retention
- **Availability:** 99.95% API uptime
- **Scalability:** Linear to 100K customers

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 80
- **customer_count:** 10000
- **metrics_per_second:** 100000000
- **cardinality_limit:** 10000000
- **storage_pb:** 100

### Available Components

- tsdb
- stream_processor
- query_engine
- alert_manager
- visualization_service

### Hints

1. Use time-series specific database
2. Implement cardinality management
3. Design multi-resolution storage
4. Consider federated query architecture

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
