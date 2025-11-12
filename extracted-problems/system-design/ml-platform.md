# System Design - ML-PLATFORM Problems

Total Problems: 1

---

## 1. Meta ML Training Platform

**ID:** l5-ml-platform-meta
**Category:** ml-platform
**Difficulty:** L5-Staff

### Summary

Design ML platform training 1000+ models daily

### Goal

Build ML platform for Meta training thousands of models on exabytes of data

### Description

Design Meta's ML platform supporting PyTorch training at scale, handling experiment tracking, feature engineering, and model deployment for all Meta products.

### Functional Requirements

- Train 1000+ models concurrently
- Support distributed training on 10K GPUs
- Enable automatic hyperparameter tuning
- Provide experiment tracking and versioning
- Support online learning pipelines

### Non-Functional Requirements

- **Latency:** P99 < 1hr training time
- **Throughput:** 1 exaflop compute
- **Dataset Size:** 100PB training data
- **Availability:** 99.9% GPU utilization
- **Scalability:** 90% GPU efficiency

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 100
- **gpu_count:** 100000
- **model_registry_size:** 100000
- **experiment_count:** 1000000
- **feature_store_size_pb:** 10

### Available Components

- gpu_cluster
- job_scheduler
- feature_store
- model_registry
- experiment_tracker

### Hints

1. Use gang scheduling for distributed training
2. Implement gradient compression
3. Design efficient data loading pipeline
4. Consider mixed precision training

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
