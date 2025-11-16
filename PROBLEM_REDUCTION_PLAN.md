# System Design Problem Reduction Plan

**Current Total**: 658 problems
**Final Count**: 192 high-quality problems
**Reduction**: 466 problems removed (71% reduction)
**Status**: ✅ IMPLEMENTED + DDIA GAPS FILLED

---

## Analysis Summary

### The Core Issue
After analyzing the codebase, the repetition problem is clear:

1. **Templated Architectures**: Many problems use identical Client → CDN → LB → App → Cache → DB patterns
2. **Empty Requirements**: L6 problems have `mustHave: []` and `mustConnect: []` - no actual validation
3. **Placeholder Python Templates**: Functions like `survive_emp_attacks()` that just return `{'status': 'success'}`
4. **Repeated Concepts**: 36 caching problems when 3-5 would teach the same patterns

---

## Detailed Breakdown by Category

### **LEVEL 1: Original Problems (40 total)**
**Decision: KEEP ALL 40**

These are based on real platforms and are excellent for interviews:
- Social Media: Instagram, Twitter, Reddit, LinkedIn, Facebook, TikTok, Pinterest, Snapchat, Discord, Medium (10)
- E-commerce: Amazon, Shopify, Stripe, Uber, Airbnb (5)
- Streaming: Netflix, Spotify, YouTube, Twitch, Hulu (5)
- Messaging: WhatsApp, Slack, Telegram, Messenger (4)
- Infrastructure: Pastebin, Dropbox, Google Drive, GitHub, Stack Overflow (5)
- Food/Delivery: DoorDash, Instacart, Yelp (3)
- Productivity: Notion, Trello, Google Calendar, Zoom (4)
- Gaming/Other: Steam, Ticketmaster, Booking.com, Weather API (4)

**Rationale**: These are industry-standard interview questions based on real systems.

---

### **LEVEL 2-4: Pattern Extraction (253 total)**
**Decision: REDUCE TO 25-30 PROBLEMS (90% reduction)**

Current problems by category:

#### **Tutorials (4 problems)**
- **KEEP: 4 problems** - These are foundational

#### **Caching (36 problems)**
- **KEEP: 5 problems**
  - TinyURL (classic URL shortener)
  - Reddit Comments (nested comment caching)
  - Top K Products (LRU cache pattern)
  - Session Store (distributed caching)
  - DNS Resolver (hierarchical caching)
- **REMOVE: 31 problems** - Rest are variations of the same CDN → Cache → DB pattern

#### **Gateway (36 problems)**
- **KEEP: 3 problems**
  - API Gateway (basic pattern)
  - Rate Limiter (essential pattern)
  - Auth Gateway (OAuth/JWT)
- **REMOVE: 33 problems** - Most are just load balancer + routing variations

#### **Streaming (37 problems)**
- **KEEP: 5 problems**
  - Live Video Streaming (WebRTC/HLS)
  - Log Aggregation (Kafka/Kinesis)
  - Real-time Analytics (stream processing)
  - Change Data Capture (CDC pattern)
  - Event Sourcing (append-only log)
- **REMOVE: 32 problems** - Many are just Kafka → Processor → DB

#### **Storage (35 problems)**
- **KEEP: 4 problems**
  - Distributed File System (HDFS-like)
  - Object Storage (S3-like)
  - Time Series Database (metrics/monitoring)
  - Blob Storage with CDN (media hosting)
- **REMOVE: 31 problems**

#### **Search (35 problems)**
- **KEEP: 4 problems**
  - Full-text Search (Elasticsearch pattern)
  - Autocomplete (prefix matching)
  - Geo-spatial Search (location-based)
  - Typeahead Suggestions (real-time)
- **REMOVE: 31 problems**

#### **Multiregion (35 problems)**
- **KEEP: 5 problems**
  - Active-Active Replication (conflict resolution)
  - Global Load Balancing (GeoDNS)
  - Cross-Region Disaster Recovery (failover)
  - Multi-Region Transactions (distributed consensus)
  - Edge Computing (Cloudflare Workers pattern)
- **REMOVE: 30 problems**

**Subtotal**: Keep 30 from 253 (88% reduction)

---

### **LEVEL 5: Complex Platforms (182 total)**
**Decision: KEEP 85-90 PROBLEMS (50% reduction)**

#### **Platform Migration (37 problems)**
- **KEEP: ALL 37** - These are based on real migrations (Netflix, Uber, Twitter, Spotify, etc.)
- These provide valuable case studies and are rarely repetitive

#### **API Platform (19 problems)**
- **KEEP: 10 problems** - REST API design, GraphQL, gRPC, versioning, deprecation
- **REMOVE: 9 problems** - Generic variations

#### **Multi-tenant (18 problems)**
- **KEEP: 8 problems** - Schema isolation, row-level security, tenant routing
- **REMOVE: 10 problems**

#### **Data Platform (18 problems)**
- **KEEP: 10 problems** - Data warehouse, ETL, data lake, OLAP/OLTP
- **REMOVE: 8 problems**

#### **Developer Productivity (18 problems)**
- **KEEP: 8 problems** - CI/CD, feature flags, A/B testing, rollout strategies
- **REMOVE: 10 problems**

#### **Compliance & Security (18 problems)**
- **KEEP: 10 problems** - GDPR, SOC2, encryption, audit logs
- **REMOVE: 8 problems**

#### **Observability (18 problems)**
- **KEEP: 8 problems** - Metrics, logs, traces, alerting
- **REMOVE: 10 problems**

#### **Infrastructure (18 problems)**
- **KEEP: 8 problems** - IaC, container orchestration, service mesh
- **REMOVE: 10 problems**

#### **ML Platform (18 problems)**
- **KEEP: 8 problems** - Model training, serving, feature stores, A/B testing
- **REMOVE: 10 problems**

**Subtotal**: Keep 85 from 182 (53% reduction)

---

### **LEVEL 6: Next-Generation/Futuristic (195 total)**
**Decision: REMOVE ALMOST ALL - KEEP 5-10 (95% reduction)**

**Major Issues**:
- Empty functional requirements (`mustHave: []`, `mustConnect: []`)
- Placeholder Python templates with no real logic
- Not practical for interviews
- Too theoretical/speculative

#### **Next-gen Protocols (22 problems)**
- **KEEP: 2 problems** - HTTP/3 & QUIC, gRPC streaming
- **REMOVE: 20 problems** - Quantum networking, interplanetary protocols, etc.

#### **Novel Databases (22 problems)**
- **KEEP: 2 problems** - CRDTs, NewSQL (Spanner-like)
- **REMOVE: 20 problems** - Quantum databases, DNA storage, etc.

#### **AI Infrastructure (21 problems)**
- **KEEP: 3 problems** - LLM serving, vector databases, model fine-tuning
- **REMOVE: 18 problems** - AGI coordination, consciousness upload, etc.

#### **Distributed Consensus (19 problems)**
- **KEEP: 2 problems** - Paxos/Raft, Byzantine fault tolerance
- **REMOVE: 17 problems**

#### **New Computing (19 problems)**
- **KEEP: 0 problems** - Quantum computing, DNA computing are too theoretical
- **REMOVE: 19 problems**

#### **Energy Sustainability (19 problems)**
- **KEEP: 0 problems**
- **REMOVE: 19 problems**

#### **Privacy Innovation (19 problems)**
- **KEEP: 1 problem** - Zero-knowledge proofs (practical for blockchain)
- **REMOVE: 18 problems**

#### **Economic Systems (19 problems)**
- **KEEP: 0 problems**
- **REMOVE: 19 problems**

#### **Bio-digital (19 problems)**
- **KEEP: 0 problems** - DNA computing, brain-computer interfaces are too speculative
- **REMOVE: 19 problems**

#### **Existential Infrastructure (21 problems)**
- **KEEP: 0 problems** - Nuclear war survival, climate collapse are not interview material
- **REMOVE: 21 problems**

**Subtotal**: Keep 10 from 195 (95% reduction)

---

## Final Tally

| Level | Current | Keep | Remove | % Kept |
|-------|---------|------|--------|--------|
| L1: Original Problems | 40 | 40 | 0 | 100% |
| L2-4: Pattern Extraction | 253 | 35 | 218 | 14% |
| L5: Complex Platforms | 182 | 107 | 75 | 59% |
| L6: Next-Gen/Futuristic | 195 | 10 | 185 | 5% |
| **TOTAL** | **670** | **192** | **478** | **29%** |

**Final Count**: 192 high-quality, non-repetitive problems (71% reduction)

### DDIA Gap Filling (5 new problems added)

After initial reduction to 187, added 5 problems to achieve ~95% DDIA coverage:

1. **Batch Processing (MapReduce/Spark)** - DDIA Ch 10
2. **Explicit Sharding Design** - DDIA Ch 6
3. **Transaction Isolation Levels** - DDIA Ch 7
4. **Data Warehouse (OLAP)** - DDIA Ch 3
5. **Graph Database (Social Network)** - DDIA Ch 2

These fill critical gaps in batch processing, partitioning strategies, transaction semantics,
columnar storage, and graph data models.

---

## Implementation Strategy

### Phase 1: Create Whitelist
Create `src/apps/system-design/builder/challenges/problemWhitelist.ts` with IDs of problems to keep

### Phase 2: Update Index
Modify `src/apps/system-design/builder/challenges/definitions/index.ts` to filter based on whitelist

### Phase 3: Archive (Don't Delete)
Move removed problem files to `src/apps/system-design/builder/challenges/definitions/archived/` for potential future use

### Phase 4: Update Tests
Update any tests that reference the removed problems

---

## Benefits

✅ **Eliminates Repetition**: No more "same thing again and again"
✅ **Focuses on Distinct Concepts**: Each problem teaches something new
✅ **Interview-Relevant**: All kept problems are practical for tech interviews
✅ **Maintains Progressive Difficulty**: L1 → L5 still provides learning curve
✅ **Removes Theoretical Bloat**: Cuts 95% of futuristic/speculative problems

---

## Next Steps

1. **Review this plan** - Confirm the approach
2. **Create detailed whitelist** - List exact problem IDs to keep
3. **Implement filtering** - Update index.ts
4. **Test** - Ensure app still works with reduced set
5. **Commit & Push** - Save the changes

Would you like me to proceed with implementation?
