# L4-L5 Internal Systems Problems

This directory contains 60 system design problems focused on **internal infrastructure** commonly asked at Google, Uber, Airbnb for L4-L5 (Senior/Staff) level positions.

These problems differ from the existing challenges by focusing on:
- **Internal systems** (not customer-facing APIs)
- **Platform engineering** (tools for other engineers)
- **Infrastructure at scale** (distributed systems, data pipelines)
- **Operational excellence** (observability, reliability, migrations)

---

## Categories

### 1. Developer Tools & Platforms (15 problems)

| # | Problem | Description | Key Concepts |
|---|---------|-------------|--------------|
| ✅ | **Code Review System** | Google Critique/Gerrit style code review platform | Large diffs, concurrent comments, S3 storage, approval workflow |
| ✅ | **CI/CD Pipeline** | Test parallelization, canary deployments, rollback | Message queues, distributed workers, flaky test detection |
| ✅ | **Feature Flag System** | Dynamic feature rollouts, A/B testing | In-memory evaluation (<1ms), pub/sub invalidation, consistent hashing |
| ✅ | **Internal Build System** | Distributed builds, dependency graphs, caching | Google Bazel/Blaze style, remote execution, hermetic builds, content-addressable storage |
| 5 | **Service Mesh Control Plane** | Service discovery, load balancing, circuit breaking | Health checks, configuration distribution, failure detection |
| 6 | **Developer Metrics Dashboard** | DORA metrics, deployment tracking, MTTR | Cross-system aggregation, real-time alerts, anomaly detection |
| ✅ | **Internal API Gateway** | Request routing, auth, rate limiting | Dynamic routing, quota management, traffic shadowing, circuit breaking |
| ✅ | **Secret Management System** | Secret rotation, access control, audit logs | Encryption at rest/transit, high availability, versioning, grace periods |
| 9 | **Internal Job Scheduler** | Task scheduling, resource allocation, priorities | Google Borg/K8s style, bin packing, preemption |
| 10 | **Dependency Graph Analyzer** | Service dependencies, impact analysis | Real-time updates, circular dependency detection |
| 11 | **Code Search Engine** | Multi-repo search, regex, reference finding | Google Code Search style, incremental indexing |
| 12 | **Internal Docs Platform** | Wiki, API docs, runbooks | Search relevance, version control, access control |
| 13 | **Experimentation Platform** | A/B testing, statistical significance | Traffic splitting, user bucketing, experiment interference |
| 14 | **Service Catalog** | Service metadata, ownership, API registry | Backstage style, auto-discovery, deprecation tracking |
| 15 | **Load Testing Platform** | Traffic replay, synthetic load, benchmarking | Production-like patterns, resource isolation |

---

### 2. Data Infrastructure & Analytics (15 problems)

| # | Problem | Description | Key Concepts |
|---|---------|-------------|--------------|
| 16 | **Data Warehouse Query Engine** | Distributed SQL, columnar storage, optimization | Google BigQuery/Presto, query planning, data skew |
| 17 | **Real-time Analytics Pipeline** | Stream processing, windowing, late data | Uber AthenaX, exactly-once semantics, watermarking |
| ✅ | **ETL Orchestration** | DAG execution, dependencies, retries | Airflow style, backfilling, idempotency, topological sort |
| 19 | **Data Quality Monitoring** | Schema validation, anomaly detection, freshness | Real-time validation, SLA tracking, alerting |
| 20 | **Metrics Aggregation Service** | Time-series ingestion, rollups, retention | Google Monarch/Uber M3, high cardinality, downsampling |
| 21 | **Data Lineage Tracking** | Upstream/downstream deps, impact analysis | Auto-discovery, versioning, PII tracking |
| 22 | **Data Lake Manager** | Object storage, lifecycle, access patterns | S3/HDFS style, metadata indexing, compaction |
| 23 | **Query Cost Attribution** | Resource tracking, chargeback, optimization | Attribution accuracy, real-time billing, budget alerts |
| 24 | **Data Access Control** | Row/column security, dynamic masking, audits | Google IAM/Ranger, policy evaluation, compliance |
| 25 | **Batch Processing Framework** | Distributed MapReduce, shuffle optimization | Google Dataflow/Spark, data locality, checkpointing |
| 26 | **Internal Data Catalog** | Metadata search, popularity, discovery | Google Data Catalog/Amundsen, auto-tagging, lineage viz |
| 27 | **Change Data Capture (CDC)** | DB log tailing, event streaming, dedup | Ordering guarantees, backpressure, schema changes |
| 28 | **Data Replication Service** | Cross-region replication, consistency | Network partitions, replication lag, conflict resolution |
| 29 | **Data Retention & Archival** | Hot/warm/cold tiering, compression | Cost optimization, legal holds, restore testing |
| 30 | **Query Cache** | Result caching, invalidation, partial hits | Presto/Druid style, cache key design, TTL policies |

---

### 3. Observability & Operations (12 problems)

| # | Problem | Description | Key Concepts |
|---|---------|-------------|--------------|
| ✅ | **Distributed Tracing** | Google Dapper/Jaeger style request tracing | Sampling, trace assembly, low overhead (<1ms) |
| ✅ | **Log Aggregation** | Log ingestion, structured logging, retention | Google Cloud Logging/Splunk, high volume, PII redaction, multi-tier storage |
| 33 | **Alerting & Incident Mgmt** | Alert routing, escalation, on-call | Google SRE/PagerDuty, deduplication, alert fatigue |
| 34 | **Monitoring Dashboard** | Metrics visualization, anomaly detection, SLO | Grafana style, real-time updates, cardinality explosion |
| 35 | **Service Health Checker** | Active probing, synthetic transactions | Multi-region checks, false positives, dependency modeling |
| 36 | **Chaos Engineering Platform** | Failure injection, blast radius control | Netflix Chaos Monkey, safety controls, impact measurement |
| 37 | **Capacity Planning System** | Resource forecasting, growth modeling | Seasonality, traffic spikes, multi-dimensional resources |
| 38 | **SLO/SLI Reporting** | Error budget tracking, burn rate alerts | Multi-service SLOs, user-journey based SLIs |
| 39 | **Configuration Rollout** | Safe config deployment, validation, rollback | Google GFE config, gradual rollout, A/B testing |
| 40 | **Runbook Automation** | Automated remediation, playbook execution | Google SRE, safety checks, human-in-loop |
| 41 | **Resource Quota Management** | Per-team quotas, reservations, usage | Fair sharing, overcommit strategies, quota transfers |
| 42 | **Performance Profiler** | CPU/memory profiling, flame graphs | Production sampling, symbol resolution, distributed profiling |

---

### 4. Migration & Reliability (8 problems)

| # | Problem | Description | Key Concepts |
|---|---------|-------------|--------------|
| ✅ | **Zero-Downtime DB Migration** | Dual-write, backfill, cutover orchestration | Data consistency, rollback, traffic shifting, gradual cutover |
| 44 | **Service Mesh Migration** | Monolith → Microservices, API versioning | Incremental decomposition, transaction boundaries |
| 45 | **Multi-Region Failover** | Health detection, traffic shifting, state replication | Split-brain prevention, regional capacity, DNS |
| 46 | **Data Center Evacuation** | Planned maintenance, traffic draining, state migration | Cascading failures, capacity verification |
| 47 | **Backup & Restore Service** | Incremental backups, point-in-time recovery | RPO/RTO guarantees, cross-region backups |
| 48 | **Blue-Green Deployment** | Environment provisioning, traffic switching | Database migrations, stateful services, cost |
| 49 | **Circuit Breaker Library** | Failure detection, adaptive thresholds | Per-endpoint vs per-host, recovery detection |
| 50 | **Disaster Recovery Orchestrator** | DR runbooks, automated failover, validation | Cross-system coordination, data loss prevention |

---

### 5. ML Infrastructure (10 problems)

| # | Problem | Description | Key Concepts |
|---|---------|-------------|--------------|
| ✅ | **Feature Store** | Uber Michelangelo/Airbnb Zipline | Online/offline consistency, point-in-time correctness, <10ms serving |
| 52 | **Model Training Pipeline** | Distributed training, hyperparameter tuning | GPU scheduling, checkpoint recovery, experiment tracking |
| 53 | **Model Serving Platform** | Model deployment, A/B testing, canary | TFServing style, latency requirements, batching |
| 54 | **ML Experiment Tracking** | Experiment metadata, artifact storage | MLflow style, large artifacts, reproducibility |
| 55 | **Data Labeling Platform** | Task assignment, quality control, performance | Inter-annotator agreement, active learning, cost |
| 56 | **Online Inference Cache** | Feature/prediction caching, invalidation | Cache key design, TTL policies, freshness vs latency |
| 57 | **Model Monitoring & Drift** | Performance tracking, data drift, concept drift | Real-time monitoring, alerting, retraining triggers |
| 58 | **Internal AutoML Platform** | Algorithm selection, architecture search | Search space, resource limits, early stopping |
| 59 | **ML Pipeline Orchestrator** | Data → features → training → deployment | DAG scheduling, failure recovery, resource mgmt |
| 60 | **Embedding Similarity Search** | Vector indexing, approximate nearest neighbor | Google ScaNN/Spotify Annoy, index updates, recall vs latency |

---

## Detailed Implementations (Available)

The following problems have full implementations with test cases:

### Developer Tools & Platforms

1. ✅ **Code Review System** (`codeReviewSystem.ts`)
   - 7 test cases covering FR, NFR-P, NFR-S, NFR-R
   - Python template with context API
   - Learning objectives and hints

2. ✅ **CI/CD Pipeline Orchestrator** (`cicdPipeline.ts`)
   - 7 test cases including parallel execution, flaky tests, canary
   - Worker loop implementation
   - Message queue-based task distribution

3. ✅ **Feature Flag System** (`featureFlagSystem.ts`)
   - 8 test cases with <1ms evaluation requirement
   - In-memory evaluation with pub/sub invalidation
   - Consistent hashing for percentage rollouts

4. ✅ **Internal Build System** (`internalBuildSystem.ts`)
   - 7 test cases for incremental builds and remote execution
   - Content-addressable storage implementation
   - Dependency graph analysis and topological sort

5. ✅ **Secret Management System** (`secretManagement.ts`)
   - 7 test cases for encryption, rotation, access control
   - Grace period rotation strategy
   - Envelope encryption with KMS

6. ✅ **Internal API Gateway** (`internalApiGateway.ts`)
   - 8 test cases for routing, rate limiting, circuit breaking
   - Traffic shadowing implementation
   - <10ms gateway overhead

### Data Infrastructure

7. ✅ **ML Feature Store** (`featureStore.ts`)
   - 6 test cases covering online/offline consistency
   - Point-in-time correctness implementation
   - Multi-tier caching strategy

8. ✅ **ETL Orchestration** (`etlOrchestration.ts`)
   - 7 test cases for DAG execution, backfilling, retries
   - Topological sort for parallel execution
   - Idempotent data pipeline patterns

9. ✅ **Log Aggregation** (`logAggregation.ts`)
   - 6 test cases for high-volume ingestion (1M logs/sec)
   - Multi-tier storage (hot/warm/cold)
   - PII redaction and sampling strategies

### Observability & Operations

10. ✅ **Distributed Tracing** (`distributedTracing.ts`)
    - 6 test cases with sampling and graceful degradation
    - <1ms overhead requirement
    - Tail-based sampling strategy

### Migration & Reliability

11. ✅ **Zero-Downtime DB Migration** (`zeroDowntimeMigration.ts`)
    - 5 test cases for dual-write, backfill, gradual cutover
    - Consistency validation techniques
    - Rollback strategies

---

## How These Differ from Existing Problems

### Existing Problems (TinyURL, Food Blog, Todo App)
- **Focus**: Customer-facing applications
- **Traffic**: External users (unpredictable)
- **Challenges**: Viral traffic, CDN optimization, public API design
- **Examples**: URL shortener, content sites, SaaS apps

### Internal Systems Problems (This Collection)
- **Focus**: Internal tools for engineers/systems
- **Traffic**: Internal (predictable, controlled)
- **Challenges**: Developer productivity, operational excellence, platform scalability
- **Examples**: CI/CD, monitoring, data pipelines, ML infrastructure

---

## Usage in Interviews

These problems are ideal for:

**L4 (Senior Engineer):**
- Problems 1-30: Focus on implementation and scaling
- Expected: Solid architecture, handle edge cases, cost awareness

**L5 (Staff Engineer):**
- Problems 31-60: Focus on system architecture and trade-offs
- Expected: Multi-system coordination, operational excellence, deep trade-off analysis

**Interview Format:**
1. **Functional requirements** (15 min): What does the system do?
2. **Scale estimation** (10 min): RPS, storage, cost
3. **Architecture** (20 min): Components, data flow
4. **Deep dive** (15 min): Specific subsystem (e.g., trace sampling)
5. **Trade-offs** (10 min): CAP theorem, consistency vs latency

---

## Implementation Status

- ✅ **11 problems fully implemented** with test cases (up from 5!)
- 📝 **49 problems defined** with brief descriptions
- 🎯 **Coverage**: Developer Tools (6), Data Infrastructure (3), Observability (1), Migration (1)
- 🔜 **Next**: Implement remaining observability, ML infrastructure, and migration problems

---

## Contributing

To add a new internal systems problem:

1. Create file in `internal-systems/<problemName>.ts`
2. Follow the existing structure (see `codeReviewSystem.ts`)
3. Include:
   - Functional requirements (FR)
   - Performance requirements (NFR-P)
   - Scalability requirements (NFR-S)
   - Reliability requirements (NFR-R)
   - Cost requirements (NFR-C)
   - Python template
   - Hints for common failures
4. Update this README

---

## Key Patterns in Internal Systems

### 1. **Message Queues for Async Processing**
- CI/CD test distribution
- Log/span ingestion
- Event-driven cache invalidation

### 2. **Multi-Tier Caching**
- In-memory (features, flags): <1ms
- Redis (hot data): 1-5ms
- Database (warm): 10-50ms
- S3 (cold): 100-500ms

### 3. **Sampling for Cost Control**
- Distributed tracing: 1-10% of requests
- Logging: By severity level
- Metrics: By cardinality

### 4. **Graceful Degradation**
- Feature flags: Last known state
- Tracing: Drop spans, not requests
- Monitoring: Degrade to basic checks

### 5. **Point-in-Time Consistency**
- ML feature stores
- Data warehouse queries
- Audit logs

---

## Resources

- **Designing Data-Intensive Applications** by Martin Kleppmann
- **Site Reliability Engineering** by Google
- **The Google File System** paper
- **Dapper: Distributed Tracing** paper
- **Borg: Google's Cluster Manager** paper
