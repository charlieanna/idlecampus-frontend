# System Design - CROSS-REGIONAL Problems

Total Problems: 1

---

## 1. TikTok Cross-Border Data Platform

**ID:** l5-regional-tiktok-platform
**Category:** cross-regional
**Difficulty:** L5-Staff

### Summary

Design TikTok's platform across US/EU/China borders

### Goal

Build TikTok's infrastructure operating across regulatory boundaries for 1B users

### Description

Design TikTok's platform handling different data sovereignty laws, content policies, and network restrictions across US, EU, and Asia while maintaining unified experience.

### Functional Requirements

- Comply with regional data residency laws
- Support region-specific content filtering
- Enable cross-border content delivery
- Maintain unified recommendation system
- Support government audit requirements

### Non-Functional Requirements

- **Latency:** P99 < 200ms per region
- **Throughput:** 100M videos/day
- **Availability:** 99.95% per region
- **Consistency:** Complete regional data isolation
- **Security:** GDPR, CCPA, Chinese law compliance

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 300
- **regions:** 20
- **data_residency_requirements:** 10
- **content_policies:** 50
- **government_apis:** 15

### Available Components

- regional_gateway
- data_residency_manager
- content_filter
- compliance_engine
- audit_system

### Hints

1. Implement data residency controls
2. Design region-aware CDN strategy
3. Consider legal intercept requirements
4. Plan for network sovereignty issues

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
