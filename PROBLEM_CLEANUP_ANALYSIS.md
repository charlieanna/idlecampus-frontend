# System Design Problem Cleanup Analysis

## Current State
- **5 Comprehensive Problems**: E-commerce, Social Media, Search, API Gateway, Cloud Storage
- **35 Pattern Problems** (L2-4): Caching, Gateway, Streaming, Storage, Search, Multiregion
- **40 Original Problems** (L1): Keep all (real-world apps)
- **107 Platform Problems** (L5): Keep all (migration case studies)
- **10 Next-Gen Problems** (L6): Keep all (modern tech)

## Recommendations by Category

### 1. CACHING PATTERNS (5 problems → 1 problem, 0 lessons)

**Current Pattern Problems:**
- `tinyurl` - URL shortener (classic system design problem) ✅ **KEEP**
- `session-store-basic` - Distributed session management
- `social-feed-cache` - Nested/hierarchical caching
- `multi-tenant-saas-cache` - Multi-tenant caching patterns
- `config-cache-basic` - ✅ Already integrated into API Gateway

**Analysis:**
- **TinyURL** is a classic, foundational system design problem (like bit.ly). It teaches:
  - URL shortening algorithm (base62, hash-based)
  - Read-heavy workload (90% reads, 10% writes)
  - Caching strategy (cache-aside)
  - Database design (key-value lookups)
  - CDN for global distribution
  - Capacity planning
  - High availability
  - It's a **complete system**, not just a caching pattern
- **E-commerce Platform** covers: Session store, product catalog cache, rate limiting, multi-tenant isolation, auth token cache, pricing engine, recommendation engine, CDN caching
- Other caching concepts are covered in comprehensive problem

**Recommendation:**
- ✅ **Keep 1 problem**: `tinyurl` (classic foundational problem)
- ✅ **Remove 3 problems**: session-store-basic, social-feed-cache, multi-tenant-saas-cache
- ✅ **Convert to lessons** (optional): Create "Caching Patterns" lesson covering session management, feed caching, multi-tenant patterns
- **Rationale**: TinyURL is a complete system design problem (like designing bit.ly), not just a caching pattern. It's perfect for beginners. Other caching patterns are covered in comprehensive-ecommerce-platform.

---

### 2. GATEWAY PATTERNS (3 problems → 0 problems, 0 lessons)

**Current Pattern Problems:**
- `rate-limiter` - Rate limiting
- `basic-api-gateway` - API gateway basics
- `authentication-gateway` - OAuth/JWT authentication

**Analysis:**
- **API Gateway Platform** already covers: Request routing, rate limiting, authentication (JWT), authorization (RBAC), request/response transformation, circuit breaking, load balancing, API versioning, response caching, **configuration caching**

**Recommendation:**
- ✅ **Remove all 3 gateway pattern problems**
- ✅ **Convert to lessons** (optional): Create "API Gateway Patterns" lesson covering rate limiting, authentication, routing
- **Rationale**: All concepts covered in comprehensive-api-gateway-platform. Redundant to have separate problems.

---

### 3. STREAMING PATTERNS (5 problems → 1 problem, 0 lessons)

**Current Pattern Problems:**
- `chat` - Real-time chat/WebSocket
- `ingestion` - Log aggregation (Kafka/Kinesis)
- `clickstream-analytics` - Stream processing/real-time analytics
- `event-sourcing-basic` - Event sourcing pattern
- `kafka-streaming-pipeline` - CDC/Change data capture

**Analysis:**
- **Social Media Platform** already covers: Real-time notifications, event log streaming, pub/sub, real-time chat, live feed updates, presence tracking, message queuing, stream processing, event sourcing, CQRS, CDC

**Recommendation:**
- ✅ **Remove 4 problems**: chat, ingestion, clickstream-analytics, event-sourcing-basic (all covered)
- ⚠️ **Keep 1 problem**: `kafka-streaming-pipeline` (CDC is advanced, might be worth keeping as standalone)
- ✅ **Convert to lessons** (optional): Create "Streaming Patterns" lesson covering chat, ingestion, analytics, event sourcing
- **Rationale**: Most concepts covered in comprehensive-social-media-platform. CDC might be advanced enough to keep separate.

---

### 4. STORAGE PATTERNS (4 problems → 0 problems, 1 lesson)

**Current Pattern Problems:**
- `basic-database-design` - Relational DB design
- `nosql-basics` - NoSQL (document/key-value)
- `time-series-metrics` - Time-series DB
- `distributed-database` - Distributed storage (HDFS-like)

**Analysis:**
- **Cloud Storage Platform** already covers: Object storage, NoSQL document store, key-value store, relational database, file chunking, deduplication, versioning, partitioning, replication, consensus

**Recommendation:**
- ✅ **Remove all 4 storage pattern problems**
- ✅ **Convert to lesson**: Create "Storage Fundamentals" lesson covering:
  - Relational vs NoSQL vs Key-Value vs Time-Series
  - Database design principles
  - When to use each type
  - Distributed storage patterns
- **Rationale**: These are conceptual (teaching database types), not practical system design. Better as lessons.

---

### 5. SEARCH PATTERNS (4 problems → 0 problems, 0 lessons)

**Current Pattern Problems:**
- `basic-text-search` - Full-text search (Elasticsearch)
- `autocomplete-search` - Autocomplete/typeahead
- `geo-search` - Geo-spatial search
- `faceted-search` - Faceted search/filtering

**Analysis:**
- **Search Platform** already covers: Full-text search, autocomplete, faceted search, geo search, search analytics, fuzzy matching, search ranking, search indexing

**Recommendation:**
- ✅ **Remove all 4 search pattern problems**
- ✅ **Convert to lessons** (optional): Already covered in "Search Fundamentals" lesson
- **Rationale**: All concepts covered in comprehensive-search-platform. Redundant.

---

### 6. MULTIREGION PATTERNS (5 problems → 2 problems, 0 lessons)

**Current Pattern Problems:**
- `active-active-regions` - Active-active replication
- `global-load-balancing` - GeoDNS/global LB
- `cross-region-failover` - Disaster recovery
- `conflict-resolution` - CRDT/conflict resolution
- `edge-computing` - Edge computing (Cloudflare Workers)

**Analysis:**
- **Multi-region concepts** are covered across:
  - `basic-multi-region` (News Publishing Platform)
  - `active-active-regions` (Collaborative Document Editor)
  - `global-cdn` (Video Streaming Platform)
  - `cross-region-dr` (E-commerce Platform with DR)
  - Comprehensive problems also include multi-region concepts

**Recommendation:**
- ✅ **Keep 2 problems**: `active-active-regions`, `cross-region-failover` (these are comprehensive user-facing problems)
- ✅ **Remove 2 problems**: `global-load-balancing`, `conflict-resolution` (covered in comprehensive problems)
- ⚠️ **Keep 1 problem**: `edge-computing` (unique concept, not fully covered elsewhere)
- ✅ **Convert to lessons** (optional): Create "Multi-Region Patterns" lesson covering global load balancing, conflict resolution, geo-routing
- **Rationale**: `active-active-regions` and `cross-region-failover` are already transformed into user-facing problems. `edge-computing` is unique enough to keep.

---

### 7. DDIA GAP PROBLEMS (5 problems → 0 problems, 0 lessons)

**Current DDIA Gap Problems:**
- `batch-processing-mapreduce` - Ch 10: Batch Processing
- `explicit-sharding-design` - Ch 6: Partitioning
- `transaction-isolation-levels` - Ch 7: Transactions
- `data-warehouse-olap` - Ch 3: Storage (columnar, OLAP)
- `graph-database-social` - Ch 2: Data Models (graph databases)

**Analysis:**
- **E-commerce Platform** covers: Batch processing, transactions, isolation levels
- **Cloud Storage Platform** covers: Sharding, partitioning
- **DDIA Lessons** cover: All chapters 2-12 as lessons

**Recommendation:**
- ✅ **Remove all 5 DDIA gap problems**
- ✅ **Already converted to lessons**: All concepts covered in DDIA lessons (chapters 2-12)
- **Rationale**: These are conceptual teaching problems. Already covered in comprehensive problems and DDIA lessons.

---

## Summary

### Problems to Remove (20 total):
1. **Caching (4)**: 
   - `tiny_url` (simpler version - keep `tinyurl` instead, which is more advanced)
   - session-store-basic, social-feed-cache, multi-tenant-saas-cache
   - **Keep**: `tinyurl` (more advanced: 1M RPS, 10B URLs, analytics, custom aliases, CDN, read replicas)
2. **Gateway (3)**: rate-limiter, basic-api-gateway, authentication-gateway
3. **Streaming (4)**: chat, ingestion, clickstream-analytics, event-sourcing-basic
4. **Storage (4)**: basic-database-design, nosql-basics, time-series-metrics, distributed-database
5. **Search (4)**: basic-text-search, autocomplete-search, geo-search, faceted-search
6. **Multiregion (2)**: global-load-balancing, conflict-resolution
7. **DDIA Gap (5)**: All 5 DDIA gap problems

### Problems to Keep (16 total):
1. **Tutorials (4)**: Keep all
2. **Caching (1)**: tinyurl (classic foundational problem)
3. **Streaming (1)**: kafka-streaming-pipeline (CDC - advanced)
4. **Multiregion (3)**: active-active-regions, cross-region-failover, edge-computing
5. **Original L1 (40)**: Keep all
6. **Platform L5 (107)**: Keep all
7. **Next-Gen L6 (10)**: Keep all

### Lessons to Create (Optional):
1. **Caching Patterns** - URL shortener, session management, feed caching, multi-tenant
2. **API Gateway Patterns** - Rate limiting, authentication, routing
3. **Streaming Patterns** - Chat, ingestion, analytics, event sourcing
4. **Storage Fundamentals** - Database types, design principles, distributed storage
5. **Multi-Region Patterns** - Global load balancing, conflict resolution, geo-routing

### Final Count:
- **Before**: 35 pattern problems (L2-4)
- **After**: 15 pattern problems (4 tutorials + 1 caching (`tinyurl`) + 1 streaming + 3 multiregion + 6 other)
- **Removed**: 20 problems (including duplicate `tinyurl`)
- **New Lessons**: 5 optional lessons

### Note on TinyURL:
- **Keep**: `tinyurl` (from `cachingAllProblems.ts`) - More advanced version:
  - 8 functional requirements (analytics, custom aliases, expiration, bulk creation, QR codes, spam detection)
  - 1M requests/sec, 10B URLs, 99.99% availability
  - Includes CDN, read replicas, comprehensive NFRs
- **Remove**: `tiny_url` (from `tinyUrlProblemDefinition.ts`) - Simpler version with only 2 FRs and basic scenarios

---

## Action Plan

1. ✅ Remove 20 redundant pattern problems from whitelist (including duplicate `tinyurl`)
2. ✅ Remove from definitions/index.ts exports
3. ✅ Create 5 optional lessons (if desired)
4. ✅ Update comprehensive problems to ensure all concepts are covered
5. ✅ Test that comprehensive problems still work correctly
6. ✅ **Keep `tinyurl`** - More advanced version (1M RPS, 10B URLs, analytics, CDN, read replicas)
7. ✅ **Remove `tiny_url`** - Simpler version (only 2 FRs, basic scenarios)

