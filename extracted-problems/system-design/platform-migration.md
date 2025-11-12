# System Design - PLATFORM-MIGRATION Problems

Total Problems: 19

---

## 1. Netflix Monolith to Microservices Migration

**ID:** l5-migration-netflix-microservices
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Netflix from monolith to 1000+ microservices

### Goal

Design a zero-downtime migration strategy for Netflix to transform from a monolithic architecture to microservices while serving 200M+ users

### Description

Netflix needs to migrate from their monolithic Java application to a microservices architecture. The system handles 10M concurrent streams, 100TB of metadata, and must maintain 99.99% availability during migration. Consider service discovery, data consistency, API versioning, team boundaries, and gradual rollout strategies.

### Functional Requirements

- Support parallel running of monolith and microservices
- Maintain all existing APIs during migration
- Enable gradual traffic shifting between systems
- Support rollback at any migration phase
- Preserve all user data and preferences

### Non-Functional Requirements

- **Latency:** P99 < 100ms for API calls
- **Request Rate:** 10M concurrent streams
- **Dataset Size:** 100TB metadata, 1PB content
- **Data Durability:** Zero data loss tolerance
- **Availability:** 99.99% during migration
- **Consistency:** Eventually consistent for metadata

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 150
- **migration_duration_months:** 24
- **services_count:** 1000
- **api_versions_supported:** 3
- **rollback_time_minutes:** 5

### Available Components

- lb
- app
- db_primary
- db_replica
- cache
- queue
- service_mesh
- api_gateway

### Hints

1. Use strangler fig pattern for gradual migration
2. Implement service mesh for inter-service communication
3. Design backward-compatible APIs with versioning
4. Consider organizational Conway's Law implications

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

## 2. Twitter Event-Driven Architecture Migration

**ID:** l5-migration-twitter-event-driven
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Transform Twitter to event-driven architecture

### Goal

Migrate Twitter from synchronous REST to event-driven architecture handling 500M daily active users

### Description

Twitter processes 500M tweets daily through synchronous APIs. Design migration to event-driven architecture using Kafka/Pulsar while maintaining real-time timeline generation, search indexing, and notification delivery.

### Functional Requirements

- Convert REST APIs to event publishers
- Maintain timeline generation < 2 seconds
- Support both push and pull notification models
- Enable event replay for debugging
- Preserve tweet ordering guarantees

### Non-Functional Requirements

- **Latency:** P99 < 2s for timeline generation
- **Request Rate:** 6000 tweets/second average
- **Dataset Size:** 500B historical tweets
- **Availability:** 99.95% uptime
- **Consistency:** Eventual consistency with ordering

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 200
- **event_types:** 150
- **peak_events_per_second:** 1000000
- **retention_days:** 7
- **consumer_groups:** 500

### Available Components

- kafka
- app
- db_primary
- cache
- stream_processor
- schema_registry

### Hints

1. Design event schema evolution strategy
2. Implement dead letter queues for failures
3. Use event sourcing for audit trails
4. Consider CQRS for read/write separation

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

## 3. Spotify Serverless Platform Migration

**ID:** l5-migration-spotify-serverless
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Spotify to serverless architecture

### Goal

Transform Spotify infrastructure from EC2-based to serverless while handling 400M users

### Description

Spotify runs on 10,000+ EC2 instances. Design migration to serverless (Lambda, Fargate) while maintaining music streaming, playlist generation, and recommendation services.

### Functional Requirements

- Support stateful music streaming sessions
- Maintain < 50ms audio buffering
- Handle both request/response and long-running jobs
- Support WebSocket connections for real-time features
- Enable local development environment

### Non-Functional Requirements

- **Latency:** P99 < 50ms for API calls
- **Request Rate:** 10M concurrent streams
- **Dataset Size:** 100M songs, 4B playlists
- **Data Durability:** Zero playlist data loss
- **Availability:** 99.99% for streaming

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 100
- **lambda_functions:** 2000
- **cold_start_budget_ms:** 500
- **cost_reduction_target:** 0.4
- **migration_phases:** 6

### Available Components

- api_gateway
- lambda
- dynamodb
- s3
- sqs
- step_functions
- cloudfront

### Hints

1. Use Lambda layers for shared dependencies
2. Implement request batching for efficiency
3. Design state management for stateless functions
4. Consider edge computing for global latency

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

## 4. Uber Multi-Region Active-Active Migration

**ID:** l5-migration-uber-multi-region
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Transform Uber to multi-region active-active

### Goal

Migrate Uber from single-region to multi-region active-active serving 100M daily riders

### Description

Uber operates primarily from US-East. Design migration to active-active across 5 regions while handling real-time matching, pricing, and payment processing.

### Functional Requirements

- Support cross-region ride matching
- Maintain consistent pricing across regions
- Handle split-brain scenarios
- Enable region-local data compliance
- Support gradual region activation

### Non-Functional Requirements

- **Latency:** P99 < 100ms intra-region
- **Request Rate:** 1M rides per hour peak
- **Availability:** 99.99% per region
- **Consistency:** Strong consistency for payments
- **Security:** GDPR/CCPA compliance for data residency

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 250
- **regions_count:** 5
- **data_size_tb:** 500
- **cross_region_latency_ms:** 100
- **conflict_resolution_strategies:** 3

### Available Components

- global_lb
- regional_db
- crdt
- consensus_service
- cdc_pipeline

### Hints

1. Use CRDTs for conflict-free replicated data
2. Implement region-aware service discovery
3. Design for network partition tolerance
4. Consider regulatory compliance per region

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

## 5. Airbnb GraphQL Federation Migration

**ID:** l5-migration-airbnb-graphql
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Airbnb APIs to GraphQL Federation

### Goal

Transform Airbnb from 1000+ REST endpoints to federated GraphQL serving 150M users

### Description

Airbnb has 1000+ REST endpoints across 50 teams. Design migration to Apollo GraphQL Federation while maintaining backward compatibility and performance.

### Functional Requirements

- Support GraphQL and REST simultaneously
- Enable schema stitching across services
- Maintain sub-100ms query performance
- Support real-time subscriptions
- Enable field-level authorization

### Non-Functional Requirements

- **Latency:** P99 < 100ms for queries
- **Request Rate:** 500K requests/second
- **Dataset Size:** 10,000 types in schema
- **Availability:** 99.95% uptime
- **Scalability:** 100% REST API coverage maintained

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 50
- **subgraphs_count:** 100
- **schema_fields:** 50000
- **deprecation_timeline_months:** 12
- **query_complexity_limit:** 1000

### Available Components

- graphql_gateway
- apollo_router
- subgraph_service
- cache
- redis
- dataloader

### Hints

1. Implement DataLoader for N+1 query prevention
2. Use schema registry for version management
3. Design query cost analysis and limits
4. Consider federated tracing for debugging

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

## 6. Stripe Database Sharding Migration

**ID:** l5-migration-stripe-database
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Stripe from Postgres to sharded architecture

### Goal

Transform Stripe from single Postgres to sharded system processing $500B annually

### Description

Stripe processes payments on a massive Postgres instance. Design migration to horizontally sharded architecture while maintaining ACID guarantees for financial transactions.

### Functional Requirements

- Maintain ACID for payment transactions
- Support cross-shard transactions
- Enable online resharding
- Preserve audit trail integrity
- Support instant reconciliation

### Non-Functional Requirements

- **Latency:** P99 < 50ms for payments
- **Request Rate:** 50K transactions/second
- **Dataset Size:** 10PB transaction history
- **Availability:** 99.999% for payments
- **Consistency:** Strong consistency required

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 75
- **shard_count:** 1000
- **resharding_duration_hours:** 48
- **cross_shard_transaction_percent:** 5
- **consistency_sla_ms:** 10

### Available Components

- vitess
- proxy_sql
- zookeeper
- cdc_tool
- reconciliation_service

### Hints

1. Use 2PC for cross-shard transactions
2. Implement shard proxy for routing
3. Design for hot shard mitigation
4. Consider regulatory audit requirements

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

## 7. Slack WebSocket Infrastructure Migration

**ID:** l5-migration-slack-websocket
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Slack from polling to WebSocket architecture

### Goal

Transform Slack from HTTP polling to WebSocket for 20M concurrent users

### Description

Slack uses HTTP long-polling for real-time messaging. Design migration to WebSocket infrastructure supporting 20M concurrent connections across 500K organizations.

### Functional Requirements

- Support 20M concurrent WebSocket connections
- Maintain message ordering per channel
- Enable presence detection
- Support connection migration
- Handle graceful reconnection

### Non-Functional Requirements

- **Latency:** P99 < 100ms message delivery
- **Request Rate:** 100K connections/second, 1M messages/second
- **Availability:** 99.99% connection uptime
- **Scalability:** Linear scaling to 100M users

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 40
- **websocket_servers:** 5000
- **connection_memory_mb:** 1
- **sticky_session_duration_hours:** 24
- **reconnection_backoff_max_seconds:** 60

### Available Components

- websocket_gateway
- connection_registry
- presence_service
- message_broker
- session_store

### Hints

1. Use connection registry for routing
2. Implement backpressure mechanisms
3. Design for connection draining
4. Consider mobile battery optimization

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

## 8. GitHub Monorepo Infrastructure Migration

**ID:** l5-migration-github-monorepo
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate GitHub to support massive monorepos

### Goal

Transform GitHub to handle Google/Meta-scale monorepos with 1B+ files

### Description

GitHub struggles with repos > 100GB. Design infrastructure to support monorepos with billions of files, supporting 100K engineers with sub-second operations.

### Functional Requirements

- Support 1B+ files per repository
- Enable partial clones and sparse checkouts
- Maintain sub-second file operations
- Support 10K concurrent pushes
- Enable cross-repo dependencies

### Non-Functional Requirements

- **Latency:** P99 < 1s for file operations
- **Throughput:** 1M operations/second
- **Dataset Size:** 10PB per monorepo
- **Availability:** 99.95% uptime
- **Scalability:** 10K simultaneous commits

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 60
- **file_count_billions:** 1
- **clone_size_gb:** 5000
- **virtual_filesystem_overhead:** 0.1
- **cache_layers:** 4

### Available Components

- distributed_git
- virtual_fs
- object_store
- merkle_tree_db
- cache_hierarchy

### Hints

1. Use virtual filesystem for lazy loading
2. Implement merkle trees for efficient diffing
3. Design hierarchical caching strategy
4. Consider perforce-like narrow clones

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

## 9. Instagram Cassandra to TiDB Migration

**ID:** l5-migration-instagram-cassandra
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Instagram from Cassandra to TiDB

### Goal

Migrate Instagram social graph from Cassandra to TiDB for 2B users

### Description

Instagram uses Cassandra for social graph with 100B edges. Migrate to TiDB for SQL compatibility while maintaining scale and performance.

### Functional Requirements

- Migrate 100B social graph edges
- Support both SQL and CQL during transition
- Maintain friend recommendation latency
- Enable zero-downtime migration
- Support gradual rollback capability

### Non-Functional Requirements

- **Latency:** P99 < 10ms for graph queries
- **Throughput:** 10M graph operations/second
- **Dataset Size:** 100B edges, 2B nodes
- **Availability:** 99.99% during migration
- **Consistency:** Eventual consistency acceptable

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 35
- **migration_duration_months:** 18
- **dual_write_period_months:** 6
- **data_verification_rate:** 0.01
- **rollback_window_hours:** 72

### Available Components

- tidb
- cassandra
- cdc_connector
- dual_write_proxy
- verification_service

### Hints

1. Use CDC for real-time data sync
2. Implement dual-write proxy layer
3. Design checksum verification system
4. Consider graph partitioning strategy

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

## 10. DoorDash Routing Engine Migration

**ID:** l5-migration-doordash-routing
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate DoorDash from Google Maps to custom routing

### Goal

Build custom routing engine for DoorDash replacing Google Maps for 20M daily deliveries

### Description

DoorDash spends $100M/year on Google Maps. Design migration to custom routing engine handling real-time traffic, multi-stop optimization, and dasher assignment.

### Functional Requirements

- Calculate optimal routes for multi-stop deliveries
- Support real-time traffic updates
- Handle 1M concurrent dashers
- Enable A/B testing old vs new routing
- Maintain fallback to Google Maps

### Non-Functional Requirements

- **Latency:** P99 < 100ms route calculation
- **Throughput:** 100K route calculations/second (95% ETA accuracy)
- **Availability:** 99.99% uptime
- **Cost:** 80% cost savings target

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 45
- **map_data_size_tb:** 50
- **route_cache_size_gb:** 1000
- **ml_models_count:** 20
- **traffic_update_interval_seconds:** 30

### Available Components

- routing_engine
- map_database
- traffic_ingestion
- ml_service
- cache_layer

### Hints

1. Pre-compute common route segments
2. Use ML for traffic prediction
3. Implement graceful degradation
4. Consider OSM for map data

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

## 11. Zoom WebRTC Infrastructure Migration

**ID:** l5-migration-zoom-webrtc
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Zoom from proprietary to WebRTC protocol

### Goal

Transform Zoom from proprietary protocol to WebRTC supporting 300M daily participants

### Description

Zoom uses proprietary video protocol. Migrate to WebRTC standard while maintaining quality for 300M daily meeting participants and enterprise features.

### Functional Requirements

- Support 1000 participants per meeting
- Maintain end-to-end encryption
- Enable cloud recording
- Support virtual backgrounds
- Handle protocol translation for legacy clients

### Non-Functional Requirements

- **Latency:** P99 < 150ms audio/video
- **Throughput:** Adaptive 30kbps-8Mbps bandwidth
- **Availability:** 99.99% meeting uptime (1080p quality, 20% packet loss tolerance)

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 80
- **simultaneous_meetings:** 10000000
- **media_servers:** 50000
- **protocol_versions:** 3
- **migration_phases:** 8

### Available Components

- webrtc_sfu
- turn_server
- signaling_server
- recording_service
- transcoding_cluster

### Hints

1. Use SFU for scalable forwarding
2. Implement simulcast for bandwidth optimization
3. Design TURN server placement strategy
4. Consider codec negotiation complexity

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

## 12. Pinterest Recommendation Engine Migration

**ID:** l5-migration-pinterest-recommendation
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Pinterest from Hadoop to real-time ML

### Goal

Transform Pinterest recommendations from batch Hadoop to real-time serving for 400M users

### Description

Pinterest runs daily Hadoop batch jobs for recommendations. Migrate to real-time ML serving while handling 100B pins and maintaining recommendation quality.

### Functional Requirements

- Serve recommendations in < 50ms
- Support online learning from user actions
- Handle 100B item catalog
- Enable real-time personalization
- Maintain recommendation diversity

### Non-Functional Requirements

- **Latency:** P99 < 50ms inference
- **Throughput:** 1M recommendations/second
- **Dataset Size:** 100GB+ embedding tables
- **Data Processing Latency:** Update within 1 minute
- **Scalability:** Maintain CTR baseline

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 30
- **ml_models:** 50
- **feature_store_size_tb:** 10
- **embedding_dimensions:** 256
- **online_learning_rate:** 0.001

### Available Components

- feature_store
- ml_serving
- embedding_cache
- kafka_streams
- vector_db

### Hints

1. Use approximate nearest neighbor search
2. Implement feature store for consistency
3. Design embedding cache hierarchy
4. Consider edge serving for latency

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

## 13. LinkedIn Kafka to Pulsar Migration

**ID:** l5-migration-linkedin-kafka
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate LinkedIn from Kafka to Apache Pulsar

### Goal

Migrate LinkedIn messaging infrastructure from Kafka to Pulsar handling 7 trillion messages/day

### Description

LinkedIn operates one of the largest Kafka deployments. Design migration to Pulsar for multi-tenancy, geo-replication, and tiered storage while maintaining zero message loss.

### Functional Requirements

- Migrate 7 trillion messages/day throughput
- Support Kafka protocol during transition
- Enable tiered storage to S3
- Maintain exactly-once semantics
- Support 100K topics

### Non-Functional Requirements

- **Latency:** P99 < 5ms publish
- **Throughput:** 100M messages/second
- **Data Durability:** 7 days hot, 1 year cold retention
- **Durability:** Zero message loss
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 200
- **cluster_count:** 100
- **topic_count:** 100000
- **partition_count:** 1000000
- **mirror_maker_instances:** 500

### Available Components

- pulsar_broker
- bookkeeper
- tiered_storage
- schema_registry
- proxy_layer

### Hints

1. Use Kafka proxy for compatibility
2. Implement parallel cluster operation
3. Design topic migration strategy
4. Consider schema evolution handling

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

## 14. Reddit PostgreSQL to CockroachDB Migration

**ID:** l5-migration-reddit-postgres
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Reddit from PostgreSQL to CockroachDB

### Goal

Migrate Reddit from sharded PostgreSQL to globally distributed CockroachDB for 52M daily users

### Description

Reddit uses heavily sharded PostgreSQL. Migrate to CockroachDB for global distribution while handling 100B+ posts/comments and maintaining ACID guarantees.

### Functional Requirements

- Migrate 100B+ posts and comments
- Maintain vote consistency
- Support complex queries for feeds
- Enable geo-distributed replicas
- Preserve karma calculation accuracy

### Non-Functional Requirements

- **Latency:** P99 < 100ms queries
- **Throughput:** 1M votes/minute
- **Dataset Size:** 50TB active data
- **Availability:** 99.95% uptime
- **Consistency:** Serializable for votes

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 40
- **shard_count:** 1000
- **migration_window_months:** 12
- **dual_write_duration_months:** 3
- **consistency_check_rate:** 0.001

### Available Components

- cockroachdb
- postgres_shards
- cdc_pipeline
- consistency_checker
- router

### Hints

1. Use CDC for incremental migration
2. Implement read-write splitting
3. Design shard mapping strategy
4. Consider timezone handling

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

## 15. Snapchat Ephemeral Storage Migration

**ID:** l5-migration-snapchat-storage
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Snapchat to cost-optimized ephemeral storage

### Goal

Design new storage system for Snapchat optimized for ephemeral content serving 300M daily users

### Description

Snapchat stores everything in S3. Design custom ephemeral storage system that auto-deletes content, reducing costs by 70% while maintaining performance.

### Functional Requirements

- Auto-delete content after viewing
- Support 24-hour stories
- Handle 5B snaps daily
- Enable instant playback
- Maintain encryption at rest

### Non-Functional Requirements

- **Latency:** P99 < 200ms retrieval
- **Throughput:** 100K uploads/second
- **Dataset Size:** 10PB active content
- **Availability:** 99.9% content availability
- **Cost:** 70% storage cost reduction

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 25
- **ttl_variants:** 5
- **storage_tiers:** 4
- **deletion_batch_size:** 100000
- **encryption_key_rotation_days:** 30

### Available Components

- ephemeral_store
- ttl_manager
- cdn_cache
- encryption_service
- lifecycle_manager

### Hints

1. Use time-based partitioning
2. Implement lazy deletion
3. Design tiered storage strategy
4. Consider legal hold requirements

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

## 16. Shopify Multi-Cloud Migration

**ID:** l5-migration-shopify-multi-cloud
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Shopify from AWS to multi-cloud

### Goal

Transform Shopify from AWS-only to multi-cloud architecture supporting 1M+ merchants

### Description

Shopify runs entirely on AWS. Design migration to multi-cloud (AWS, GCP, Azure) for cost optimization, vendor lock-in prevention, and regional compliance.

### Functional Requirements

- Support cloud-agnostic services
- Enable workload placement optimization
- Maintain data consistency across clouds
- Support cloud-specific managed services
- Enable disaster recovery across clouds

### Non-Functional Requirements

- **Latency:** P99 < 100ms API calls
- **Availability:** 99.99% across clouds
- **Security:** Region-specific data residency compliance
- **Cost:** 30% cost reduction, minimize egress

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 150
- **cloud_providers:** 3
- **regions_per_cloud:** 5
- **egress_cost_gb:** 0.09
- **workload_types:** 20

### Available Components

- multi_cloud_lb
- kubernetes
- cloud_broker
- data_sync
- cost_optimizer

### Hints

1. Use Kubernetes for portability
2. Implement cloud abstraction layer
3. Design intelligent workload placement
4. Consider egress cost optimization

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

## 17. Twitch Ultra-Low Latency Streaming

**ID:** l5-migration-twitch-low-latency
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Twitch to sub-second streaming latency

### Goal

Transform Twitch from 10-30 second to sub-second latency for 15M concurrent viewers

### Description

Twitch has 10-30 second stream delay. Design migration to WebRTC-based ultra-low latency while maintaining quality and scale for esports and interactive streaming.

### Functional Requirements

- Achieve < 1 second glass-to-glass latency
- Support 15M concurrent viewers
- Maintain 1080p60 quality
- Enable instant channel switching
- Support legacy HLS players

### Non-Functional Requirements

- **Latency:** P99 < 1 second end-to-end
- **Throughput:** 1080p60 with 6Mbps quality
- **Data Processing Latency:** < 500ms channel switch
- **Availability:** 99.95% stream uptime
- **Scalability:** 100K viewers per stream

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 50
- **edge_servers:** 10000
- **transcoding_profiles:** 5
- **buffer_size_ms:** 200
- **protocol_overhead:** 0.15

### Available Components

- webrtc_cdn
- edge_transcoder
- srt_ingest
- abr_optimizer
- qos_monitor

### Hints

1. Use SRT for reliable ingest
2. Implement edge transcoding
3. Design adaptive bitrate strategy
4. Consider viewer geography clustering

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

## 18. Coinbase Matching Engine Migration

**ID:** l5-migration-coinbase-matching
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Coinbase to ultra-high-frequency matching

### Goal

Transform Coinbase matching engine from millisecond to microsecond latency for $10B daily volume

### Description

Coinbase processes trades in milliseconds. Design migration to microsecond-latency matching engine handling $10B daily volume with regulatory compliance.

### Functional Requirements

- Process orders in < 10 microseconds
- Maintain FIFO order fairness
- Support 1M orders/second
- Enable instant settlement
- Preserve full audit trail

### Non-Functional Requirements

- **Latency:** P99 < 10 microseconds
- **Throughput:** 1M orders/second
- **Availability:** 99.999% uptime
- **Consistency:** Strict ordering guarantee
- **Security:** SEC regulatory compliance requirements

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 30
- **orderbook_pairs:** 500
- **kernel_bypass:** true
- **fpga_acceleration:** true
- **audit_retention_years:** 7

### Available Components

- fpga_matcher
- memory_db
- kernel_bypass_network
- audit_log
- sequencer

### Hints

1. Use FPGA for order matching
2. Implement kernel bypass networking
3. Design memory-only architecture
4. Consider co-location requirements

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

## 19. Figma Real-Time Collaboration Migration

**ID:** l5-migration-figma-collaboration
**Category:** platform-migration
**Difficulty:** L5-Staff

### Summary

Migrate Figma to support 1000+ concurrent editors

### Goal

Transform Figma from 10-person to 1000+ person concurrent editing on single document

### Description

Figma supports ~10 concurrent editors per document. Design architecture to support 1000+ simultaneous editors on enterprise design systems with real-time sync.

### Functional Requirements

- Support 1000+ concurrent editors
- Maintain 60 FPS performance
- Handle 1GB+ document sizes
- Enable selective sync
- Support offline editing

### Non-Functional Requirements

- **Latency:** P99 < 50ms for operations
- **Throughput:** 100K operations/second
- **Dataset Size:** 1GB+ design files
- **Availability:** 99.95% uptime
- **Consistency:** Eventual with CRDTs

### Constants/Assumptions

- **level:** L5
- **teams_affected:** 20
- **concurrent_editors:** 1000
- **operation_size_bytes:** 100
- **crdt_overhead:** 0.3
- **websocket_connections:** 1000000

### Available Components

- crdt_server
- websocket_cluster
- operation_log
- snapshot_store
- conflict_resolver

### Hints

1. Use CRDTs for conflict resolution
2. Implement operation compression
3. Design hierarchical state sync
4. Consider viewport-based updates

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
