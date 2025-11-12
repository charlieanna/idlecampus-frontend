# System Design - SEARCH Problems

Total Problems: 35

---

## 1. Basic Full-Text Search

**ID:** basic-text-search
**Category:** search
**Difficulty:** Easy

### Summary

Search documents with keywords

### Goal

Build a simple search engine for documents.

### Description

Learn search fundamentals by building a basic full-text search system. Understand inverted indexes, relevance scoring, and basic query operators.

### Functional Requirements

- Index text documents
- Search by keywords
- Support AND/OR operators
- Rank results by relevance
- Highlight matching terms

### Non-Functional Requirements

- **Latency:** P95 < 100ms for queries
- **Request Rate:** 1k searches/sec
- **Dataset Size:** 1M documents
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 1000
- **document_count:** 1000000
- **avg_doc_size:** 5000
- **index_size_gb:** 10

### Available Components

- client
- lb
- app
- search
- db_primary

### Hints

1. Use inverted index for fast lookups
2. TF-IDF for relevance scoring

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

**T1: Storage**
  - Must include: db_primary

### Reference Solution

Elasticsearch maintains inverted index for fast keyword searches. Documents sharded across 5 nodes for parallel processing. TF-IDF scoring ranks results by relevance. This teaches search engine basics.

**Components:**
- Search Users (redirect_client)
- Load Balancer (lb)
- Search API (app)
- Elasticsearch (search)
- Document DB (db_primary)

**Connections:**
- Search Users → Load Balancer
- Load Balancer → Search API
- Search API → Elasticsearch
- Elasticsearch → Document DB

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 1,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (10,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 10,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00017747

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 2. Search Autocomplete

**ID:** autocomplete-search
**Category:** search
**Difficulty:** Easy

### Summary

Suggest completions as users type

### Goal

Build Google-like search suggestions.

### Description

Implement search autocomplete using prefix trees (tries). Learn about fuzzy matching, popularity weighting, and personalization.

### Functional Requirements

- Suggest completions for partial queries
- Rank by popularity and recency
- Support fuzzy matching for typos
- Personalize based on user history
- Update suggestions in real-time

### Non-Functional Requirements

- **Latency:** P95 < 50ms per keystroke
- **Request Rate:** 50k keystrokes/sec
- **Dataset Size:** 10M unique queries
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **keystroke_qps:** 50000
- **unique_queries:** 10000000
- **trie_memory_gb:** 5
- **suggestion_count:** 10

### Available Components

- client
- lb
- app
- cache
- search

### Hints

1. Trie for prefix matching
2. Cache popular prefixes

### Tiers/Checkpoints

**T0: Trie**
  - Must include: cache

**T1: Search**
  - Must include: search

### Reference Solution

Trie structure enables O(k) prefix lookups where k is prefix length. Popular prefixes cached in memory. Fuzzy matching via Levenshtein distance. This teaches autocomplete patterns.

**Components:**
- Search Box (redirect_client)
- Load Balancer (lb)
- Suggest API (app)
- Trie Cache (cache)
- Query Index (search)

**Connections:**
- Search Box → Load Balancer
- Load Balancer → Suggest API
- Suggest API → Trie Cache
- Suggest API → Query Index

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 3. Faceted Search with Filters

**ID:** faceted-search
**Category:** search
**Difficulty:** Foundation

### Summary

Multi-dimensional filtering UI

### Goal

Enable drill-down filtering in search.

### Description

Design a faceted search system that allows users to filter by multiple attributes (price, brand, category, rating). Count documents per facet dynamically.

### Functional Requirements

- Filter by multiple attributes
- Show facet counts
- Support range filters
- Handle empty results gracefully

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 5k req/s
- **Dataset Size:** 1M products, 20 facets
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 5000
- **product_count:** 1000000
- **facet_count:** 20

### Available Components

- client
- lb
- app
- search
- cache

### Hints

1. Use aggregations in Elasticsearch
2. Cache facet counts

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

### Reference Solution

Aggregations compute facet counts. Cache popular facets. Range filters use range queries. This teaches faceted search basics.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Facet Cache (cache)
- Elasticsearch (search)

**Connections:**
- Users → LB
- LB → API
- API → Facet Cache
- API → Elasticsearch

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 4. Location-Based Search

**ID:** geo-search
**Category:** search
**Difficulty:** Foundation

### Summary

Find nearby places with geo-queries

### Goal

Search by proximity and bounding box.

### Description

Design a location-based search system for finding nearby restaurants, stores, or services. Support radius search, bounding box, and sorting by distance.

### Functional Requirements

- Search within radius
- Bounding box queries
- Sort by distance
- Filter by category

### Non-Functional Requirements

- **Latency:** P95 < 50ms
- **Request Rate:** 20k req/s
- **Dataset Size:** 10M locations worldwide
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 20000
- **location_count:** 10000000

### Available Components

- client
- lb
- app
- search

### Hints

1. Use geo_point type in Elasticsearch
2. Geohash for spatial indexing

### Tiers/Checkpoints

**T0: Geo Index**
  - Must include: search

### Reference Solution

Geohash indexing enables fast radius queries. Bounding box uses geo_bounding_box. This teaches geo-spatial search.

**Components:**
- Mobile Users (redirect_client)
- LB (lb)
- API (app)
- ES Geo (search)

**Connections:**
- Mobile Users → LB
- LB → API
- API → ES Geo

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 20,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (200,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 200,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000887

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 5. Typo-Tolerant Fuzzy Search

**ID:** fuzzy-search
**Category:** search
**Difficulty:** Foundation

### Summary

Handle typos and misspellings

### Goal

Find results despite user errors.

### Description

Design a fuzzy search system that handles typos, misspellings, and character transpositions using edit distance algorithms.

### Functional Requirements

- Tolerate 1-2 char errors
- Suggest corrections
- Phonetic matching
- Support multiple languages

### Non-Functional Requirements

- **Latency:** P95 < 150ms
- **Request Rate:** 10k req/s
- **Dataset Size:** 5M documents
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 10000
- **document_count:** 5000000
- **max_edit_distance:** 2

### Available Components

- client
- lb
- app
- search
- cache

### Hints

1. Use Levenshtein distance
2. Soundex for phonetic

### Tiers/Checkpoints

**T0: Fuzzy**
  - Must include: search

### Reference Solution

Fuzzy queries with edit distance 2. Soundex for phonetic matches. Cache suggestions. This teaches typo tolerance.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Suggestion Cache (cache)
- ES Fuzzy (search)

**Connections:**
- Users → LB
- LB → API
- API → Suggestion Cache
- API → ES Fuzzy

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 6. Synonym-Aware Search

**ID:** synonym-search
**Category:** search
**Difficulty:** Foundation

### Summary

Expand queries with synonyms

### Goal

Find semantically similar terms.

### Description

Design a search system that expands queries with synonyms to improve recall (e.g., "laptop" → "notebook", "computer").

### Functional Requirements

- Expand with synonyms
- Language-specific synonyms
- Domain-specific terms
- Bidirectional matching

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 15k req/s
- **Dataset Size:** 2M products, 50k synonym rules
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 15000
- **product_count:** 2000000
- **synonym_rules:** 50000

### Available Components

- client
- lb
- app
- search
- db_primary

### Hints

1. Use synonym token filter
2. WordNet for generic synonyms

### Tiers/Checkpoints

**T0: Synonyms**
  - Must include: db_primary

### Reference Solution

Synonym token filter expands queries. Domain-specific synonyms from DB. This teaches query expansion.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Synonyms (db_primary)
- ES (search)

**Connections:**
- Users → LB
- LB → API
- API → Synonyms
- API → ES

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 15,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 15,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (150,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 150,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001183

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 7. Search Result Highlighting

**ID:** highlight-search
**Category:** search
**Difficulty:** Foundation

### Summary

Highlight matched terms in results

### Goal

Show users why results matched.

### Description

Design a search system that highlights matched terms in result snippets with context windows.

### Functional Requirements

- Highlight all matched terms
- Show context window
- Handle multi-word matches
- HTML-safe highlighting

### Non-Functional Requirements

- **Latency:** P95 < 120ms
- **Request Rate:** 8k req/s
- **Dataset Size:** 3M documents
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 8000
- **document_count:** 3000000

### Available Components

- client
- lb
- app
- search

### Hints

1. Use highlighter in ES
2. Fragment size for snippets

### Tiers/Checkpoints

**T0: Highlight**
  - Must include: search

### Reference Solution

Fast vector highlighter for snippets. Context windows around matches. This teaches result presentation.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- ES (search)

**Connections:**
- Users → LB
- LB → API
- API → ES

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 8,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 8,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (80,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 80,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00002218

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 8. Field Boosting & Relevance Tuning

**ID:** boosting-search
**Category:** search
**Difficulty:** Foundation

### Summary

Weight fields differently for ranking

### Goal

Prioritize title matches over description.

### Description

Design a search system with field boosting to prioritize matches in titles, tags, and other important fields.

### Functional Requirements

- Boost title matches 5x
- Boost tags 3x
- Recency boosting
- Popularity signals

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 12k req/s
- **Dataset Size:** 8M documents
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 12000
- **document_count:** 8000000

### Available Components

- client
- lb
- app
- search
- cache

### Hints

1. Use field boosts in query
2. Function score for signals

### Tiers/Checkpoints

**T0: Boosting**
  - Must include: search

### Reference Solution

Multi-match query with field boosts. Function score adds popularity. This teaches relevance tuning.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Query Cache (cache)
- ES (search)

**Connections:**
- Users → LB
- LB → API
- API → Query Cache
- API → ES

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 12,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 12,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (120,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 120,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001479

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 9. Product Discovery with Browse & Search

**ID:** product-discovery
**Category:** search
**Difficulty:** Intermediate

### Summary

Combine browsing catalog with search

### Goal

Unify browse and search experiences.

### Description

Design a product discovery system that seamlessly integrates category browsing with search, filters, and recommendations.

### Functional Requirements

- Category navigation
- Faceted filters
- Search within category
- Sort options (price, rating, relevance)
- Cross-sell recommendations

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 50k req/s
- **Dataset Size:** 50M products, 1k categories
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 50000
- **product_count:** 50000000
- **category_count:** 1000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary

### Hints

1. Denormalize category hierarchy
2. Cache popular categories

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

**T1: Cache**
  - Must include: cache

### Reference Solution

Category browse cached at 80%. Search index includes category hierarchy. This teaches hybrid discovery.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Category Cache (cache)
- Product Index (search)
- Catalog DB (db_primary)

**Connections:**
- Users → LB
- LB → API
- API → Category Cache
- API → Product Index
- Product Index → Catalog DB

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 10. Search Suggestions & Related Queries

**ID:** search-suggestions
**Category:** search
**Difficulty:** Intermediate

### Summary

Suggest queries and related searches

### Goal

Help users refine their searches.

### Description

Design a search suggestion system that recommends related queries and alternative searches based on query logs.

### Functional Requirements

- Suggest related queries
- Show trending searches
- Correct common mistakes
- Personalized suggestions

### Non-Functional Requirements

- **Latency:** P95 < 50ms
- **Request Rate:** 40k req/s
- **Dataset Size:** 100M unique queries
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 40000
- **unique_queries:** 100000000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary

### Hints

1. Mine query logs for patterns
2. Co-occurrence analysis

### Tiers/Checkpoints

**T0: Suggestions**
  - Must include: cache

### Reference Solution

90% cache hit for popular suggestions. Query graph tracks co-occurrences. This teaches query suggestions.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Suggestion Cache (cache)
- Query Graph (db_primary)

**Connections:**
- Users → LB
- LB → API
- API → Suggestion Cache
- Suggestion Cache → Query Graph

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 40,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 40,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (400,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 400,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000444

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 11. E-commerce Product Search

**ID:** ecommerce-search
**Category:** search
**Difficulty:** Advanced

### Summary

Amazon-scale 1M searches/sec globally

### Goal

Build Amazon-scale product search.

### Description

Design an Amazon-scale product search handling 1M searches/sec across 10B+ products globally. Must return results in <50ms P99 with deep personalization, survive entire region failures, handle Prime Day spikes (10M searches/sec), and operate within $100M/month budget. Support 100+ languages, visual search, voice search, and real-time inventory-aware ranking while serving 500M+ daily active users.

### Functional Requirements

- Search 10B+ products in <50ms P99 latency
- Handle 1M searches/sec (10M during Prime Day)
- Deep personalization for 500M+ users
- Visual search with computer vision
- Voice search with NLP understanding
- Real-time inventory and pricing in results
- Support 100+ languages and currencies
- ML-based query understanding and expansion

### Non-Functional Requirements

- **Latency:** P99 < 50ms, P99.9 < 100ms even during spikes
- **Request Rate:** 1M searches/sec normal, 10M during Prime Day
- **Dataset Size:** 10B products, 500M user profiles, 100TB indexes
- **Availability:** 99.99% uptime with region failover

### Constants/Assumptions

- **l4_enhanced:** true
- **search_qps:** 1000000
- **spike_multiplier:** 10
- **product_count:** 10000000000
- **facet_count:** 500
- **personalization_weight:** 0.5
- **languages_supported:** 100
- **cache_hit_target:** 0.7
- **budget_monthly:** 100000000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary
- worker

### Hints

1. Denormalize for fast filtering
2. Pre-compute facet counts

### Tiers/Checkpoints

**T0: Search**
  - Minimum 10 of type: search

**T1: Personalization**
  - Must include: worker

**T2: Cache**
  - Must include: cache

### Reference Solution

Elasticsearch with 20 shards handles 100M products. Denormalized index includes all filterable attributes. ML ranker personalizes results. Query cache serves 40% of popular searches. This teaches e-commerce search patterns.

**Components:**
- Shoppers (redirect_client)
- Load Balancer (lb)
- Search Service (app)
- Query Cache (cache)
- Elasticsearch (search)
- ML Ranker (worker)
- Product DB (db_primary)

**Connections:**
- Shoppers → Load Balancer
- Load Balancer → Search Service
- Search Service → Query Cache
- Search Service → Elasticsearch
- Search Service → ML Ranker
- Elasticsearch → Product DB

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 1,000,000 QPS, the system uses 1000 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 1,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $4167

*Peak Load:*
During 10x traffic spikes (10,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 10,000,000 requests/sec
- Cost/Hour: $41667

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $4,600,000
- Yearly Total: $55,200,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $3,000,000 (1000 × $100/month per instance)
- Storage: $1,000,000 (Database storage + backup + snapshots)
- Network: $500,000 (Ingress/egress + CDN distribution)

---

## 12. Multilingual Search Engine

**ID:** multilingual-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search across 20+ languages

### Goal

Handle language-specific text processing.

### Description

Design a search engine that handles multiple languages with language-specific analyzers, stemming, and stopwords.

### Functional Requirements

- Detect query language
- Language-specific analyzers
- Cross-language search
- Handle CJK languages

### Non-Functional Requirements

- **Latency:** P95 < 150ms
- **Request Rate:** 25k req/s
- **Dataset Size:** 50M documents, 20 languages
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 25000
- **document_count:** 50000000
- **language_count:** 20

### Available Components

- client
- lb
- app
- search
- worker

### Hints

1. ICU plugin for Unicode
2. Language detection service

### Tiers/Checkpoints

**T0: Multilingual**
  - Must include: search

### Reference Solution

Language-specific analyzers per field. ICU for Unicode normalization. This teaches i18n search.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Lang Detect (worker)
- ES Multi (search)

**Connections:**
- Users → LB
- LB → API
- API → Lang Detect
- API → ES Multi

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 25,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 25,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (250,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 250,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000710

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 13. Search Analytics & Query Logs

**ID:** search-analytics
**Category:** search
**Difficulty:** Intermediate

### Summary

Track search behavior and failures

### Goal

Improve search via usage analytics.

### Description

Design a search analytics system that tracks queries, click-through rates, zero-result searches, and latency metrics.

### Functional Requirements

- Log all queries
- Track CTR per query
- Detect zero-result queries
- Measure latency percentiles
- Popular search trends

### Non-Functional Requirements

- **Latency:** Logging adds < 5ms overhead
- **Request Rate:** 30k search req/s, 30k log writes/s
- **Dataset Size:** 1B query logs/month
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 30000
- **log_retention_days:** 90

### Available Components

- client
- lb
- app
- search
- stream
- db_primary
- worker

### Hints

1. Async logging via Kafka
2. Aggregate metrics in ClickHouse

### Tiers/Checkpoints

**T0: Analytics**
  - Must include: stream

### Reference Solution

Async logging to Kafka stream. Workers aggregate CTR and trends. This teaches search observability.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- ES (search)
- Query Logs (stream)
- Aggregator (worker)
- Analytics DB (db_primary)

**Connections:**
- Users → LB
- LB → API
- API → ES
- API → Query Logs
- Query Logs → Aggregator
- Aggregator → Analytics DB

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 30,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 30,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (300,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 300,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000592

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 14. Personalized Search Results

**ID:** personalized-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Customize results per user preferences

### Goal

Re-rank based on user history.

### Description

Design a personalized search system that re-ranks results based on user browsing history, purchases, and preferences.

### Functional Requirements

- Track user interactions
- Build user profiles
- Re-rank with preferences
- Privacy-preserving personalization

### Non-Functional Requirements

- **Latency:** P95 < 200ms with personalization
- **Request Rate:** 20k req/s
- **Dataset Size:** 100M users, 10M products
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 20000
- **user_count:** 100000000
- **product_count:** 10000000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary
- worker

### Hints

1. Learning to rank models
2. Collaborative filtering

### Tiers/Checkpoints

**T0: Profile**
  - Must include: db_primary

**T1: Rerank**
  - Must include: worker

### Reference Solution

User profiles cached at 85%. Reranker uses browsing history. This teaches personalized ranking.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- ES (search)
- Profile Cache (cache)
- User Profiles (db_primary)
- Reranker (worker)

**Connections:**
- Users → LB
- LB → API
- API → ES
- ES → Reranker
- API → Profile Cache
- Profile Cache → User Profiles
- Reranker → User Profiles

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 20,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 20,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (200,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 200,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000887

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 15. Voice Search with Speech Recognition

**ID:** voice-search
**Category:** search
**Difficulty:** Advanced

### Summary

Search by voice commands

### Goal

Convert speech to searchable text.

### Description

Design a voice search system with speech-to-text conversion, noise handling, and natural language understanding.

### Functional Requirements

- Speech-to-text conversion
- Handle accents and dialects
- Noise cancellation
- Intent recognition

### Non-Functional Requirements

- **Latency:** P95 < 1s including transcription
- **Request Rate:** 10k req/s
- **Dataset Size:** 50M voice queries/month
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 10000
- **avg_audio_duration_s:** 5

### Available Components

- client
- lb
- app
- worker
- search
- cache

### Hints

1. Use Whisper/DeepSpeech
2. BERT for intent

### Tiers/Checkpoints

**T0: STT**
  - Must include: worker

**T1: NLU**
  - Minimum 2 of type: worker

### Reference Solution

Whisper transcribes speech. NLU extracts intent. This teaches voice search pipelines.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Whisper STT (worker)
- NLU (worker)
- ES (search)

**Connections:**
- Users → LB
- LB → API
- API → Whisper STT
- Whisper STT → NLU
- NLU → ES

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 16. Image Search with Computer Vision

**ID:** image-search
**Category:** search
**Difficulty:** Advanced

### Summary

Google Images-scale 10B images/100M QPS

### Goal

Build Google Images-scale visual search.

### Description

Design a Google Images-scale visual search system handling 100M searches/sec across 10B+ images globally. Must perform visual similarity search in <100ms using CLIP/Vision Transformers, handle viral memes (10x spikes), survive GPU datacenter failures, and operate within $200M/month budget. Support reverse image search, multi-modal queries, real-time image understanding, and face/object detection while maintaining >90% precision.

### Functional Requirements

- Search 10B+ images with 100M queries/sec
- Visual similarity using CLIP/Vision Transformers
- Reverse image search with <100ms latency
- Multi-modal search (text + image + video)
- Real-time object/face/scene detection
- Support image generation queries
- Content moderation and safety filters
- Cross-platform image deduplication

### Non-Functional Requirements

- **Latency:** P99 < 100ms visual search, <200ms multi-modal
- **Request Rate:** 100M searches/sec, 1B during viral events
- **Dataset Size:** 10B images, 100TB embeddings, 1PB raw data
- **Availability:** 99.99% uptime with GPU failover

### Constants/Assumptions

- **l4_enhanced:** true
- **search_qps:** 100000000
- **spike_multiplier:** 10
- **image_count:** 10000000000
- **embedding_dim:** 1024
- **gpu_nodes:** 10000
- **cache_hit_target:** 0.8
- **budget_monthly:** 200000000

### Available Components

- client
- lb
- app
- worker
- search
- cache
- object_store

### Hints

1. Use ResNet/CLIP for embeddings
2. FAISS for ANN search

### Tiers/Checkpoints

**T0: Embeddings**
  - Must include: worker

**T1: Vector Search**
  - Must include: search

### Reference Solution

CLIP generates 512-dim embeddings. FAISS for billion-scale ANN. This teaches visual search.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- CLIP Service (worker)
- Embedding Cache (cache)
- FAISS (search)
- S3 Images (object_store)

**Connections:**
- Users → LB
- LB → API
- API → CLIP Service
- API → Embedding Cache
- CLIP Service → FAISS
- FAISS → S3 Images

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 17. Real-Time Search Indexing Pipeline

**ID:** realtime-indexing
**Category:** search
**Difficulty:** Advanced

### Summary

Index updates visible in <1s

### Goal

Near-instant search freshness.

### Description

Design a real-time indexing pipeline that makes new content searchable within 1 second of creation.

### Functional Requirements

- Sub-second indexing latency
- Handle write bursts
- Maintain search availability during indexing
- Incremental index updates

### Non-Functional Requirements

- **Latency:** Indexing < 1s, Search P95 < 100ms
- **Request Rate:** 100k writes/s, 50k searches/s
- **Dataset Size:** 500M documents
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **write_qps:** 100000
- **search_qps:** 50000
- **target_indexing_latency_ms:** 1000

### Available Components

- client
- stream
- worker
- search
- cache
- lb
- app

### Hints

1. Kafka for buffering
2. ES refresh_interval tuning

### Tiers/Checkpoints

**T0: Stream**
  - Must include: stream

**T1: Indexers**
  - Minimum 50 of type: worker

### Reference Solution

Kafka buffers writes. 80 indexer workers achieve <1s latency. This teaches real-time indexing.

**Components:**
- Writers (redirect_client)
- Kafka (stream)
- Indexers (worker)
- ES (search)
- Searchers (redirect_client)
- LB (lb)
- Search API (app)

**Connections:**
- Writers → Kafka
- Kafka → Indexers
- Indexers → ES
- Searchers → LB
- LB → Search API
- Search API → ES

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 18. Federated Multi-Source Search

**ID:** federated-search
**Category:** search
**Difficulty:** Advanced

### Summary

Search across disparate systems

### Goal

Unify results from multiple sources.

### Description

Design a federated search system that queries multiple data sources (SQL, NoSQL, files) and merges results intelligently.

### Functional Requirements

- Query multiple sources in parallel
- Merge and deduplicate results
- Unified ranking across sources
- Handle partial failures

### Non-Functional Requirements

- **Latency:** P95 < 500ms querying 5 sources
- **Request Rate:** 8k req/s
- **Dataset Size:** 100M docs across 10 sources
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 8000
- **source_count:** 10

### Available Components

- client
- lb
- app
- search
- db_primary
- object_store
- worker

### Hints

1. Parallel fan-out queries
2. Normalized scoring

### Tiers/Checkpoints

**T0: Federation**
  - Minimum 3 of type: search

**T1: Merger**
  - Must include: worker

### Reference Solution

Parallel queries to all sources. Merger normalizes scores and dedupes. This teaches federated search.

**Components:**
- Users (redirect_client)
- LB (lb)
- Federation API (app)
- ES Docs (search)
- SQL DB (db_primary)
- S3 Files (object_store)
- Result Merger (worker)

**Connections:**
- Users → LB
- LB → Federation API
- Federation API → ES Docs
- Federation API → SQL DB
- Federation API → S3 Files
- ES Docs → Result Merger
- SQL DB → Result Merger
- S3 Files → Result Merger

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 8,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 8,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (80,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 80,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00002218

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 19. Log Search & Analytics (Splunk-like)

**ID:** log-search
**Category:** search
**Difficulty:** Advanced

### Summary

Google Cloud Logging-scale 100M events/sec

### Goal

Build Google-scale log analytics platform.

### Description

Design a Google Cloud Logging-scale platform ingesting 100M events/sec from millions of services globally. Must search 100PB of logs in <1 second, handle security incident investigations (scanning years of data), survive entire region failures, and operate within $300M/month budget. Support real-time anomaly detection, ML-based pattern recognition, and compliance with 10-year retention while serving Fortune 500 enterprises.

### Functional Requirements

- Ingest 100M events/sec from 1M+ microservices
- Search 100PB logs with <1s latency
- Real-time anomaly detection with ML
- Complex aggregations across years of data
- Security forensics with pattern matching
- Compliance with 10-year retention policies
- Multi-tenant isolation for 10k+ enterprises
- Automated incident root cause analysis

### Non-Functional Requirements

- **Latency:** P99 < 1s for day queries, < 10s for year queries
- **Request Rate:** 100M events/sec ingestion, 100k queries/sec
- **Dataset Size:** 100PB hot storage, 1EB total with archives
- **Availability:** 99.999% for ingestion, 99.99% for search

### Constants/Assumptions

- **l4_enhanced:** true
- **ingest_eps:** 100000000
- **search_qps:** 100000
- **spike_multiplier:** 10
- **retention_days:** 3650
- **hot_storage_pb:** 100
- **total_storage_eb:** 1
- **tenant_count:** 10000
- **budget_monthly:** 300000000

### Available Components

- client
- stream
- worker
- search
- db_primary
- object_store
- lb
- app

### Hints

1. Hot/warm/cold tiers
2. Parquet for cold storage

### Tiers/Checkpoints

**T0: Ingestion**
  - Must include: stream

**T1: Hot Storage**
  - Minimum 20 of type: search

**T2: Cold Storage**
  - Must include: object_store

### Reference Solution

Three-tier storage: Hot (7d ES), Warm (30d ES), Cold (S3 Parquet). This teaches log analytics architecture.

**Components:**
- Agents (redirect_client)
- Kafka (stream)
- Parsers (worker)
- ES Hot (7d) (search)
- ES Warm (30d) (search)
- S3 Cold (90d) (object_store)
- LB (lb)
- Query API (app)

**Connections:**
- Agents → Kafka
- Kafka → Parsers
- Parsers → ES Hot (7d)
- Parsers → ES Warm (30d)
- ES Warm (30d) → S3 Cold (90d)
- LB → Query API
- Query API → ES Hot (7d)
- Query API → ES Warm (30d)
- Query API → S3 Cold (90d)

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 20. Code Search Engine (GitHub-like)

**ID:** code-search
**Category:** search
**Difficulty:** Advanced

### Summary

GitHub-scale 1B repos/100M searches/sec

### Goal

Build GitHub-scale code search.

### Description

Design a GitHub/Google Code Search-scale engine indexing 1B+ repositories with 100T+ lines of code. Must search in <100ms with semantic understanding using CodeBERT, handle 100M searches/sec, survive datacenter failures, and operate within $400M/month budget. Support 500+ programming languages, real-time indexing of commits, cross-repository dependency analysis, and AI-powered code suggestions while serving 100M+ developers globally.

### Functional Requirements

- Index 1B+ repos with 100T+ lines of code
- Process 100M code searches/sec globally
- Semantic search using CodeBERT/Codex models
- Support 500+ programming languages
- Real-time indexing of 1M+ commits/minute
- Cross-repo dependency and vulnerability scanning
- AI-powered code completion and suggestions
- Git history and blame integration at scale

### Non-Functional Requirements

- **Latency:** P99 < 100ms symbol search, < 200ms semantic
- **Request Rate:** 100M searches/sec, 1B during launches
- **Dataset Size:** 1B repos, 100T lines, 10PB indexes
- **Availability:** 99.99% uptime with instant failover

### Constants/Assumptions

- **l4_enhanced:** true
- **search_qps:** 100000000
- **spike_multiplier:** 10
- **repo_count:** 1000000000
- **file_count:** 100000000000
- **lines_of_code:** 100000000000000
- **languages_supported:** 500
- **cache_hit_target:** 0.7
- **budget_monthly:** 400000000

### Available Components

- client
- lb
- app
- search
- worker
- db_primary
- cache

### Hints

1. Tree-sitter for parsing
2. Trigram indexing for regex

### Tiers/Checkpoints

**T0: Indexing**
  - Must include: worker

**T1: Search**
  - Minimum 20 of type: search

### Reference Solution

Tree-sitter parses code into AST. Symbol extraction for functions/classes. Trigram index for regex. This teaches code search.

**Components:**
- Devs (redirect_client)
- LB (lb)
- API (app)
- Tree-sitter (worker)
- AST Cache (cache)
- Code Index (search)
- Repo Metadata (db_primary)

**Connections:**
- Devs → LB
- LB → API
- API → AST Cache
- API → Tree-sitter
- Tree-sitter → Code Index
- Code Index → Repo Metadata

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 21. Hybrid Search (Lexical + Vector)

**ID:** hybrid-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Combine keyword and semantic search

### Goal

Best of both keyword and AI search.

### Description

Design a hybrid search combining traditional keyword search (BM25) with vector semantic search, using reciprocal rank fusion for result merging.

### Functional Requirements

- BM25 keyword scoring
- Vector embedding search
- Reciprocal rank fusion (RRF)
- Query rewriting with LLM
- Hybrid ranking tuning

### Non-Functional Requirements

- **Latency:** P95 < 150ms
- **Request Rate:** 30k req/s
- **Dataset Size:** 10M documents with embeddings
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 30000
- **document_count:** 10000000
- **embedding_dimension:** 768

### Available Components

- client
- lb
- app
- search
- worker
- cache

### Hints

1. OpenSearch supports both
2. RRF weight tuning

### Tiers/Checkpoints

**T0: Dual Search**
  - Must include: search

**T1: Fusion**
  - Must include: worker

### Reference Solution

Query runs in parallel on BM25 and vector indexes. RRF merges results by reciprocal rank. This teaches hybrid search architecture.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- BM25 Index (search)
- Vector Index (search)
- RRF Merger (worker)

**Connections:**
- Users → LB
- LB → API
- API → BM25 Index
- API → Vector Index
- BM25 Index → RRF Merger
- Vector Index → RRF Merger

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 30,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 30,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (300,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 300,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000592

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 22. Video Content Search (YouTube-like)

**ID:** video-search
**Category:** search
**Difficulty:** Advanced

### Summary

Search video transcripts and visual content

### Goal

Find moments within videos.

### Description

Design a video search system that indexes transcripts, visual frames, and metadata to find specific moments in videos.

### Functional Requirements

- Transcript search with timestamps
- Visual scene search
- Face recognition
- Object detection in frames
- Chapter/timestamp navigation

### Non-Functional Requirements

- **Latency:** P95 < 300ms
- **Request Rate:** 100k req/s
- **Dataset Size:** 1B videos, 100PB storage
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **search_qps:** 100000
- **video_count:** 1000000000

### Available Components

- client
- cdn
- lb
- app
- search
- worker
- db_primary
- object_store

### Hints

1. Whisper for transcripts
2. CLIP for visual search

### Tiers/Checkpoints

**T0: Indexing**
  - Minimum 2 of type: worker

**T1: Search**
  - Must include: search

### Reference Solution

Whisper transcribes audio. CLIP indexes visual frames. Search spans text + visual embeddings. This teaches multimodal video search.

**Components:**
- Users (redirect_client)
- CDN (cdn)
- LB (lb)
- API (app)
- Whisper STT (worker)
- CLIP Vision (worker)
- Video Index (search)
- S3 Videos (object_store)

**Connections:**
- Users → CDN
- CDN → LB
- LB → API
- API → Whisper STT
- API → CLIP Vision
- Whisper STT → Video Index
- CLIP Vision → Video Index
- Video Index → S3 Videos

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 23. Security Event Search (SIEM)

**ID:** security-event-search
**Category:** search
**Difficulty:** Advanced

### Summary

Detect threats in security logs

### Goal

Find anomalies and attack patterns.

### Description

Design a Security Information and Event Management (SIEM) system for threat detection across millions of security events.

### Functional Requirements

- Ingest firewall, IDS, auth logs
- Correlation rules across sources
- Anomaly detection
- Threat intelligence enrichment
- Real-time alerting

### Non-Functional Requirements

- **Latency:** Alerting < 10s, Search P95 < 1s
- **Request Rate:** 500k events/s
- **Dataset Size:** 100TB/month
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **ingest_eps:** 500000
- **alert_latency_target_s:** 10

### Available Components

- client
- stream
- worker
- search
- db_primary
- cache
- lb
- app

### Hints

1. Sigma rules for detection
2. MITRE ATT&CK framework

### Tiers/Checkpoints

**T0: Ingestion**
  - Must include: stream

**T1: Detection**
  - Must include: worker

### Reference Solution

Stream processing for real-time correlation. Threat intel enrichment. ML anomaly detection. This teaches SIEM architecture.

**Components:**
- Logs (redirect_client)
- Kafka (stream)
- Normalizers (worker)
- Correlation (worker)
- Event Index (search)
- Threat Intel (db_primary)
- Rule Cache (cache)

**Connections:**
- Logs → Kafka
- Kafka → Normalizers
- Normalizers → Correlation
- Correlation → Event Index
- Correlation → Threat Intel
- Correlation → Rule Cache

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 500,000 QPS, the system uses 500 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 500,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $2083

*Peak Load:*
During 10x traffic spikes (5,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 5,000,000 requests/sec
- Cost/Hour: $20833

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $2,300,000
- Yearly Total: $27,600,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $1,500,000 (500 × $100/month per instance)
- Storage: $500,000 (Database storage + backup + snapshots)
- Network: $250,000 (Ingress/egress + CDN distribution)

---

## 24. HIPAA-Compliant Medical Record Search

**ID:** medical-record-search
**Category:** search
**Difficulty:** Advanced

### Summary

Search patient records securely

### Goal

Enable clinical search with compliance.

### Description

Design a medical record search system with field-level encryption, audit logging, and clinical terminology understanding.

### Functional Requirements

- Field-level encryption (PHI)
- Audit all searches
- ICD-10/SNOMED terminology
- De-identified research queries
- Access control by role

### Non-Functional Requirements

- **Latency:** P95 < 300ms
- **Request Rate:** 5k req/s
- **Dataset Size:** 500M patient records
- **Availability:** 99.99% uptime, HIPAA compliant

### Constants/Assumptions

- **search_qps:** 5000
- **patient_count:** 500000000

### Available Components

- client
- lb
- app
- search
- db_primary
- worker
- stream

### Hints

1. Field-level encryption at rest
2. Audit log to immutable storage

### Tiers/Checkpoints

**T0: Security**
  - Must include: worker

**T1: Audit**
  - Must include: stream

### Reference Solution

Field-level encryption for PHI. Every search audited to immutable log. RBAC enforcement. This teaches healthcare search compliance.

**Components:**
- Users (redirect_client)
- LB (lb)
- API + AuthZ (app)
- Encryption (worker)
- Audit Log (stream)
- EMR Index (search)
- Patient DB (db_primary)

**Connections:**
- Users → LB
- LB → API + AuthZ
- API + AuthZ → Encryption
- Encryption → EMR Index
- API + AuthZ → Audit Log
- EMR Index → Patient DB

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 25. Social Media Search (Twitter-like)

**ID:** social-media-search
**Category:** search
**Difficulty:** Advanced

### Summary

Search billions of posts with recency bias

### Goal

Find trending topics and mentions.

### Description

Design a social media search system optimized for recency, hashtags, mentions, and real-time trends.

### Functional Requirements

- Real-time indexing (<5s)
- Hashtag and mention search
- Trending topic detection
- User search
- Time-decay ranking

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 200k req/s
- **Dataset Size:** 500B posts, 1B users
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 200000
- **post_count:** 500000000000
- **user_count:** 1000000000

### Available Components

- client
- lb
- app
- stream
- worker
- search
- cache
- db_primary

### Hints

1. Time-decay boosting
2. Separate recent vs historical index

### Tiers/Checkpoints

**T0: Real-time**
  - Must include: stream

**T1: Search**
  - Minimum 50 of type: search

### Reference Solution

Separate indexes for recent (7d) vs historical. Time-decay boosting. Hashtag extraction. This teaches social search at scale.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Post Stream (stream)
- Indexers (worker)
- Recent (7d) (search)
- Historical (search)
- Trend Cache (cache)

**Connections:**
- Users → LB
- LB → API
- API → Post Stream
- Post Stream → Indexers
- Indexers → Recent (7d)
- Indexers → Historical
- API → Recent (7d)
- API → Historical
- API → Trend Cache

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 200,000 QPS, the system uses 200 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 200,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $833

*Peak Load:*
During 10x traffic spikes (2,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 2,000,000 requests/sec
- Cost/Hour: $8333

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $920,000
- Yearly Total: $11,040,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $600,000 (200 × $100/month per instance)
- Storage: $200,000 (Database storage + backup + snapshots)
- Network: $100,000 (Ingress/egress + CDN distribution)

---

## 26. AI-Powered Semantic Search

**ID:** semantic-search-platform
**Category:** search
**Difficulty:** Advanced

### Summary

Google-scale 100M semantic searches/sec

### Goal

Build Google-scale semantic search.

### Description

Design a Google-scale semantic search platform processing 100M queries/sec across 100B+ documents using state-of-the-art LLMs. Must generate embeddings in <10ms, perform billion-scale vector search in <50ms, survive GPU cluster failures, and operate within $500M/month budget. Support GPT-4 level understanding, 200+ languages, multi-modal search (text/image/video), and continuous learning from 1B+ daily user interactions.

### Functional Requirements

- Process 100M semantic searches/sec globally
- Index 100B+ documents with 2048-dim embeddings
- GPT-4/PaLM-level query understanding
- Multi-modal search across text/image/video/audio
- Support 200+ languages with cross-lingual search
- Real-time re-ranking with 100+ signals
- Continuous learning from 1B+ daily interactions
- Explainable AI with attribution and confidence

### Non-Functional Requirements

- **Latency:** P99 < 100ms end-to-end, <10ms embedding generation
- **Request Rate:** 100M searches/sec, 1B during major events
- **Dataset Size:** 100B docs, 1PB embeddings, 100TB models
- **Availability:** 99.999% uptime with automatic GPU failover

### Constants/Assumptions

- **l4_enhanced:** true
- **search_qps:** 100000000
- **spike_multiplier:** 10
- **document_count:** 100000000000
- **embedding_dim:** 2048
- **model_size_gb:** 1000
- **ann_index_size_tb:** 1000
- **gpu_clusters:** 50
- **cache_hit_target:** 0.6
- **budget_monthly:** 500000000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary
- worker
- queue
- stream

### Hints

1. Use FAISS/Annoy for ANN
2. GPU inference for embeddings

### Tiers/Checkpoints

**T0: Embeddings**
  - Must include: worker

**T1: Vector DB**
  - Minimum 10 of type: search

**T2: Re-ranking**
  - Minimum 20 of type: worker

**T3: Feedback**
  - Must include: stream

### Reference Solution

BERT generates 768-dim embeddings cached at 60% hit rate. FAISS index with 20 shards enables billion-scale ANN search. Cross-encoder re-ranks top-100 candidates. Feedback stream enables continuous learning. This teaches modern semantic search architecture.

**Components:**
- Search Queries (redirect_client)
- API Gateway (lb)
- Search API (app)
- Embedding Service (worker)
- Embedding Cache (cache)
- Vector Index (search)
- Re-ranker GPUs (worker)
- Document Store (db_primary)
- Feedback Stream (stream)
- Training Queue (queue)

**Connections:**
- Search Queries → API Gateway
- API Gateway → Search API
- Search API → Embedding Service
- Search API → Embedding Cache
- Embedding Service → Vector Index
- Vector Index → Re-ranker GPUs
- Re-ranker GPUs → Document Store
- Search API → Feedback Stream
- Feedback Stream → Training Queue

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for high-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000,000 QPS, the system uses 100000 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 25ms, P95: 75ms, P99: 150ms
- Throughput: 100,000,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $416667

*Peak Load:*
During 10x traffic spikes (1,000,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 50ms, P95: 200ms, P99: 500ms
- Throughput: 1,000,000,000 requests/sec
- Cost/Hour: $4166667

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
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

- Monthly Total: $460,000,000
- Yearly Total: $5,520,000,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000,000 (100000 × $100/month per instance)
- Storage: $100,000,000 (Database storage + backup + snapshots)
- Network: $50,000,000 (Ingress/egress + CDN distribution)

---

## 27. Job Search Engine (Indeed/LinkedIn)

**ID:** job-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Match candidates to jobs with ML

### Goal

Find relevant jobs and candidates.

### Description

Design a job search platform matching candidates to jobs using skills, location, and salary filters with ML ranking.

### Functional Requirements

- Search by skills/title
- Location radius filter
- Salary range filter
- Experience level
- ML relevance ranking

### Non-Functional Requirements

- **Latency:** P95 < 150ms
- **Request Rate:** 50k req/s
- **Dataset Size:** 100M jobs, 500M candidates
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 50000
- **job_count:** 100000000
- **candidate_count:** 500000000

### Available Components

- client
- lb
- app
- search
- worker
- cache
- db_primary

### Hints

1. Skill taxonomy normalization
2. Learning-to-rank model

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

**T1: ML**
  - Must include: worker

### Reference Solution

Skills normalized via taxonomy. ML ranker uses candidate profile + job features. This teaches job matching.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Job Index (search)
- ML Ranker (worker)
- Result Cache (cache)

**Connections:**
- Users → LB
- LB → API
- API → Job Index
- Job Index → ML Ranker
- API → Result Cache

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 28. Travel Search Engine (Kayak/Expedia)

**ID:** travel-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search flights and hotels with complex filters

### Goal

Find best travel options.

### Description

Design a travel search aggregating flights/hotels with date ranges, multi-leg trips, and price sorting.

### Functional Requirements

- Multi-leg flight search
- Flexible date ranges
- Price + duration sorting
- Airline/hotel filters
- Real-time price updates

### Non-Functional Requirements

- **Latency:** P95 < 2s aggregating 100 providers
- **Request Rate:** 30k req/s
- **Dataset Size:** 10M daily price updates
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 30000
- **provider_count:** 100
- **daily_price_updates:** 10000000

### Available Components

- client
- lb
- app
- search
- cache
- worker
- stream

### Hints

1. Cache popular routes
2. Parallel provider queries

### Tiers/Checkpoints

**T0: Aggregation**
  - Must include: worker

**T1: Cache**
  - Must include: cache

### Reference Solution

Parallel fan-out to 100 providers. Cache popular routes (65% hit). Real-time price indexing. This teaches travel aggregation.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Route Cache (cache)
- Aggregators (worker)
- Price Index (search)

**Connections:**
- Users → LB
- LB → API
- API → Route Cache
- API → Aggregators
- Aggregators → Price Index

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 30,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 30,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (300,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 300,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000592

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 29. Academic Paper Search (Google Scholar)

**ID:** academic-paper-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search scholarly articles with citations

### Goal

Find research papers by topic.

### Description

Design an academic search engine with citation graph, author profiles, and semantic paper similarity.

### Functional Requirements

- Full-text search
- Citation graph traversal
- Author search
- Topic clustering
- Related paper suggestions

### Non-Functional Requirements

- **Latency:** P95 < 300ms
- **Request Rate:** 15k req/s
- **Dataset Size:** 200M papers, 2B citations
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 15000
- **paper_count:** 200000000
- **citation_count:** 2000000000

### Available Components

- client
- lb
- app
- search
- db_primary
- worker

### Hints

1. PageRank for paper importance
2. SPECTER embeddings for similarity

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

**T1: Citations**
  - Must include: db_primary

### Reference Solution

Full-text search with PageRank citation boost. Graph DB for citation traversal. This teaches academic search.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Paper Index (search)
- Citation Graph (db_primary)
- PageRank (worker)

**Connections:**
- Users → LB
- LB → API
- API → Paper Index
- Paper Index → Citation Graph
- API → PageRank

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 15,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 15,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (150,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 150,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001183

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 30. Recipe Search with Ingredients

**ID:** recipe-search
**Category:** search
**Difficulty:** Foundation

### Summary

Find recipes by available ingredients

### Goal

Search by ingredients you have.

### Description

Design a recipe search allowing users to find recipes based on ingredients they have, dietary restrictions, and cooking time.

### Functional Requirements

- Ingredient-based search
- Dietary filter (vegan, gluten-free)
- Cook time filter
- Nutrition info
- User ratings

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 10k req/s
- **Dataset Size:** 5M recipes
- **Availability:** 99.9% uptime

### Constants/Assumptions

- **search_qps:** 10000
- **recipe_count:** 5000000

### Available Components

- client
- lb
- app
- search
- cache

### Hints

1. Array field for ingredients
2. Boost by user ratings

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

### Reference Solution

Ingredients stored as array field. Bool queries for dietary restrictions. Rating boost. This teaches recipe search.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Recipe Index (search)

**Connections:**
- Users → LB
- LB → API
- API → Recipe Index

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 10,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 10,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (100,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 100,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00001775

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 31. Legal Document Search

**ID:** legal-doc-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search case law and statutes

### Goal

Find relevant legal precedents.

### Description

Design a legal document search with citation analysis, jurisdiction filters, and case similarity matching.

### Functional Requirements

- Full-text legal search
- Citation linking
- Jurisdiction filter
- Date range queries
- Shepardize (track case history)

### Non-Functional Requirements

- **Latency:** P95 < 500ms
- **Request Rate:** 5k req/s
- **Dataset Size:** 50M court opinions, 100M citations
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **search_qps:** 5000
- **document_count:** 50000000
- **citation_count:** 100000000

### Available Components

- client
- lb
- app
- search
- db_primary

### Hints

1. West Key Number system
2. Citation graph for authority

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

**T1: Citations**
  - Must include: db_primary

### Reference Solution

Legal terminology aware. Citation graph for precedent analysis. This teaches legal search domain.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Case Index (search)
- Citation DB (db_primary)

**Connections:**
- Users → LB
- LB → API
- API → Case Index
- Case Index → Citation DB

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 5,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 5,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (50,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 50,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00003549

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 32. News Article Search with Clustering

**ID:** news-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search news with story clustering

### Goal

Find and cluster breaking news.

### Description

Design a news search engine that clusters similar articles into stories and ranks by recency and relevance.

### Functional Requirements

- Real-time article indexing
- Story clustering
- Entity extraction (people, places)
- Topic categorization
- Recency-weighted ranking

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 40k req/s
- **Dataset Size:** 500M articles, 10k new/hour
- **Availability:** 99.95% uptime

### Constants/Assumptions

- **search_qps:** 40000
- **article_count:** 500000000
- **new_articles_per_hour:** 10000

### Available Components

- client
- lb
- app
- search
- worker
- stream

### Hints

1. MinHash LSH for clustering
2. Named entity recognition

### Tiers/Checkpoints

**T0: Indexing**
  - Must include: stream

**T1: Clustering**
  - Must include: worker

### Reference Solution

Real-time article stream. MinHash for duplicate/similar story detection. Time-decay ranking. This teaches news aggregation.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Article Stream (stream)
- Clustering (worker)
- Article Index (search)

**Connections:**
- Users → LB
- LB → API
- API → Article Index
- Article Stream → Clustering
- Clustering → Article Index

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 40,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 40,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (400,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 400,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000444

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 33. Music Search (Spotify/Apple Music)

**ID:** music-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search songs, artists, albums

### Goal

Find music by metadata and audio features.

### Description

Design a music search with artist/song/album search, audio feature filters (tempo, key), and playlist search.

### Functional Requirements

- Search songs, artists, albums
- Audio feature filters
- Lyrics search
- Genre/mood filters
- Playlist search

### Non-Functional Requirements

- **Latency:** P95 < 80ms
- **Request Rate:** 100k req/s
- **Dataset Size:** 100M tracks, 10M artists
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **search_qps:** 100000
- **track_count:** 100000000
- **artist_count:** 10000000

### Available Components

- client
- lb
- app
- search
- cache

### Hints

1. Denormalize artist into track docs
2. Cache popular queries

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

### Reference Solution

Denormalized docs include artist/album. Audio features as numeric fields. Lyrics full-text. This teaches music catalog search.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Query Cache (cache)
- Music Index (search)

**Connections:**
- Users → LB
- LB → API
- API → Query Cache
- API → Music Index

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 100,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 100,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (1,000,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 1,000,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000177

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 34. App Store Search & Discovery

**ID:** app-store-search
**Category:** search
**Difficulty:** Intermediate

### Summary

Search mobile apps with ranking

### Goal

Help users discover apps.

### Description

Design an app store search with category browse, keyword optimization (ASO), and download-based ranking.

### Functional Requirements

- Keyword search
- Category filters
- Rating/download sorting
- App icon/screenshot display
- Similar app recommendations

### Non-Functional Requirements

- **Latency:** P95 < 100ms
- **Request Rate:** 80k req/s
- **Dataset Size:** 5M apps
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **search_qps:** 80000
- **app_count:** 5000000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary

### Hints

1. Downloads as ranking signal
2. A/B test ranking algorithms

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

### Reference Solution

Downloads + ratings boost ranking. ASO-optimized keyword matching. Category facets. This teaches app discovery.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- Top Apps Cache (cache)
- App Index (search)

**Connections:**
- Users → LB
- LB → API
- API → Top Apps Cache
- API → App Index

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 80,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 80,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (800,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 800,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000222

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---

## 35. Collaborative Document Search (Google Drive)

**ID:** document-collab-search
**Category:** search
**Difficulty:** Advanced

### Summary

Search shared documents with permissions

### Goal

Find docs respecting access control.

### Description

Design a document search for collaborative workspace with permission filtering, version search, and shared folder navigation.

### Functional Requirements

- Permission-aware search
- Full-text in docs/PDFs
- Search by owner/editor
- Recent activity boost
- Folder hierarchy

### Non-Functional Requirements

- **Latency:** P95 < 150ms including ACL check
- **Request Rate:** 50k req/s
- **Dataset Size:** 10B documents
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **search_qps:** 50000
- **document_count:** 10000000000

### Available Components

- client
- lb
- app
- search
- cache
- db_primary

### Hints

1. Index ACLs with docs
2. Cache user permissions

### Tiers/Checkpoints

**T0: Search**
  - Must include: search

**T1: ACL**
  - Must include: db_primary

### Reference Solution

ACLs indexed with docs for fast filtering. Permission cache at 90%. Recent edit boost. This teaches permission-aware search.

**Components:**
- Users (redirect_client)
- LB (lb)
- API (app)
- ACL Cache (cache)
- Doc Index (search)
- Permissions (db_primary)

**Connections:**
- Users → LB
- LB → API
- API → ACL Cache
- ACL Cache → Permissions
- API → Doc Index
- Doc Index → Permissions

### Solution Analysis

**Architecture Overview:**

Full-text search architecture for moderate-scale query processing. Elasticsearch cluster with dedicated indexing pipeline and result caching.

**Phase Analysis:**

*Normal Operation:*
During normal operations at 50,000 QPS, the system uses 100 instances with optimal resource utilization. Search index is optimized with appropriate sharding.
- Latency: P50: 10ms, P95: 30ms, P99: 50ms
- Throughput: 50,000 requests/sec
- Error Rate: < 0.01%
- Cost/Hour: $417

*Peak Load:*
During 10x traffic spikes (500,000 QPS), auto-scaling engages within 60 seconds. Query cache and result pagination reduce load.
- Scaling Approach: Horizontal auto-scaling based on CPU/memory metrics with predictive scaling for known patterns.
- Latency: P50: 20ms, P95: 60ms, P99: 100ms
- Throughput: 500,000 requests/sec
- Cost/Hour: $4167

*Failure Scenarios:*
System handles failures through degraded search with partial results. Automatic failover ensures continuous operation.
- Redundancy: Elasticsearch cluster with replica shards
- Failover Time: < 60 seconds
- Data Loss Risk: Zero data loss
- Availability: 99.9%
- MTTR: 5 minutes

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

- Monthly Total: $460,000
- Yearly Total: $5,520,000
- Cost per Request: $0.00000355

*Breakdown:*
- Compute: $300,000 (100 × $100/month per instance)
- Storage: $100,000 (Database storage + backup + snapshots)
- Network: $50,000 (Ingress/egress + CDN distribution)

---
