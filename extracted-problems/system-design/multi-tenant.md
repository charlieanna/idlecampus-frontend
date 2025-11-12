# System Design - MULTI-TENANT Problems

Total Problems: 1

---

## 1. Salesforce Multi-Tenant CRM Platform

**ID:** l5-multitenant-salesforce
**Category:** multi-tenant
**Difficulty:** L5-Staff

### Summary

Design Salesforce-scale platform for 100K enterprises

### Goal

Build multi-tenant CRM platform supporting 100K enterprises with data isolation

### Description

Design Salesforce-like multi-tenant platform supporting 100K enterprises, each with custom schemas, workflows, and integrations while maintaining performance and isolation.

### Functional Requirements

- Support 100K tenant organizations
- Enable custom fields and objects per tenant
- Provide tenant-specific API limits
- Support custom workflows and triggers
- Enable cross-tenant data sharing with consent

### Non-Functional Requirements

- **Latency:** P99 < 200ms for queries
- **Availability:** 99.95% per tenant SLA
- **Scalability:** Linear scaling to 1M tenants, 500 custom fields
- **Security:** Complete data isolation

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 200
- **tenant_count:** 100000
- **custom_objects_per_tenant:** 100
- **api_calls_per_tenant_per_day:** 100000
- **storage_per_tenant_gb:** 100

### Available Components

- tenant_router
- metadata_service
- pod_architecture
- query_optimizer
- governor_limits

### Hints

1. Use pod architecture for tenant isolation
2. Implement metadata-driven customization
3. Design governor limits for fairness
4. Consider tenant migration strategies

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
