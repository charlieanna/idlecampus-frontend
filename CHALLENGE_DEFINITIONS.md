# Challenge Definitions - MVP

## 🎯 Overview

This document defines the 3 challenges for the MVP:
1. **Tiny URL** (Beginner) - URL shortening service
2. **Food Blog** (Beginner+) - Static content serving with images
3. **Todo App** (Intermediate) - CRUD application with fault tolerance

Each challenge teaches specific system design concepts through hands-on practice.

---

## 📊 Challenge Structure

Each challenge includes:
- **Problem Statement**: What to build
- **Requirements**: Functional and non-functional
- **Available Components**: What user can use
- **Test Cases**: Scenarios to validate design
- **Pass Criteria**: What "passing" means
- **Learning Objectives**: What concepts user should learn
- **Example Solutions**: Good and bad designs

---

# Challenge 1: Tiny URL 🔗

## Problem Statement

Design a URL shortening service (like bit.ly) that accepts long URLs and returns short codes. Users can then use these short codes to redirect to the original URLs.

**Example**:
- POST `/shorten` with `https://example.com/very/long/url` → returns `abc123`
- GET `/abc123` → redirects to `https://example.com/very/long/url`

---

## Requirements

### Functional Requirements
- Accept long URLs, generate short codes
- Redirect short codes to original URLs
- Short codes should be unique

### Non-Functional Requirements
- **Traffic**: 1,000 RPS reads (redirects), 100 RPS writes (create short URLs)
- **Latency**: p99 < 100ms for redirects
- **Availability**: 99.9% uptime
- **Budget**: $500/month

### Workload Characteristics
- **Read-heavy**: 10:1 read-to-write ratio
- **Reads**: Simple key-value lookups (short code → long URL)
- **Writes**: Insert new mappings
- **Data size**: Assume 10M URLs, avg 200 bytes each = 2GB total

---

## Available Components

User can use:
- ✅ Load Balancer (fixed config)
- ✅ App Server (configure instances)
- ✅ Redis Cache (configure memory, TTL, hit ratio)
- ✅ PostgreSQL (configure read/write capacity)

Not available (for simplicity):
- ❌ CDN (not needed for API)
- ❌ S3 (not storing files)

---

## Test Cases

### Test Case 1: Normal Load ✅

**Scenario**: Steady state traffic under normal conditions

**Traffic**:
```json
{
  "name": "Normal Load",
  "traffic": {
    "readRps": 1000,
    "writeRps": 100
  },
  "duration": 60
}
```

**Pass Criteria**:
- p99 latency ≤ 100ms
- Error rate ≤ 1%
- Monthly cost ≤ $500

**What This Tests**: Basic capacity planning

---

### Test Case 2: Read Spike ⚠️

**Scenario**: A popular link goes viral on social media, causing 5x read traffic

**Traffic**:
```json
{
  "name": "Read Spike",
  "traffic": {
    "readRps": 5000,
    "writeRps": 100
  },
  "duration": 60
}
```

**Pass Criteria**:
- p99 latency ≤ 200ms (relaxed)
- Error rate ≤ 5% (some degradation OK)
- No complete outage

**What This Tests**: Can system handle traffic spikes? Is caching effective?

---

### Test Case 3: Cache Flush ❌

**Scenario**: Redis cache crashes and restarts (cold cache)

**Traffic**:
```json
{
  "name": "Cache Flush",
  "traffic": {
    "readRps": 1000,
    "writeRps": 100
  },
  "duration": 60,
  "failureInjection": {
    "type": "cache_flush",
    "atSecond": 15
  }
}
```

**Pass Criteria**:
- p99 latency ≤ 150ms (after cache warms up)
- Error rate ≤ 2%
- Database doesn't crash from sudden load

**What This Tests**: Is database sized to handle cache misses?

---

## Example Solutions

### ❌ Bad Solution: No Cache

**Design**:
```
Load Balancer → App Server (1 instance) → PostgreSQL (read: 500, write: 100)
```

**Result**:
- ✅ Test 1: PASS (barely - DB at 80% utilization)
- ❌ Test 2: FAIL (DB completely saturated, 95%+ util)
- ✅ Test 3: N/A (no cache to flush)

**Why It Fails**: Database can't handle 5,000 read RPS

**Cost**: ~$350/month

---

### ⚠️ Mediocre Solution: Small Cache

**Design**:
```
Load Balancer → App Server (2 instances) → Redis (2GB, 70% hit ratio) → PostgreSQL (read: 800, write: 100)
```

**Result**:
- ✅ Test 1: PASS
- ⚠️ Test 2: FAIL (cache helps but still overloads at 5k RPS)
- ⚠️ Test 3: PASS (but slow recovery)

**Why It's Mediocre**: Cache hit ratio too low, doesn't help enough under spike

**Cost**: ~$550/month (over budget)

---

### ✅ Good Solution: Proper Cache

**Design**:
```
Load Balancer → App Server (2 instances) → Redis (4GB, 90% hit ratio, TTL: 3600s) → PostgreSQL (read: 1000, write: 150)
```

**Result**:
- ✅ Test 1: PASS (17ms p99 latency)
- ✅ Test 2: PASS (cache absorbs 90% of spike)
- ✅ Test 3: PASS (DB handles 10% miss rate during warmup)

**Why It Works**:
- High cache hit ratio (90%) → only 10% requests hit DB
- Read spike: 5000 RPS × 10% = 500 RPS to DB (well under capacity)
- Cache flush: 1000 RPS × 100% = 1000 RPS to DB for ~10s (DB sized for this)

**Cost**: ~$450/month (under budget)

---

## Learning Objectives

After completing this challenge, users should understand:

1. ✅ **Read-Heavy Workloads**: Why caching is critical for read-heavy systems
2. ✅ **Cache Hit Ratio**: How hit ratio dramatically affects database load
3. ✅ **Capacity Planning**: Sizing database for cache miss scenarios
4. ✅ **Cost Optimization**: Balancing cache size vs database capacity
5. ✅ **Spike Handling**: Why over-provisioning or caching helps with traffic spikes

---

## Hints (Shown on Failure)

**If Test 2 fails with DB overload**:
```
💡 Your database is saturated during the traffic spike (95%+ utilization).

This is common in read-heavy systems. Consider:
1. Adding a cache (Redis) to absorb read traffic
2. Increasing cache hit ratio (larger cache, longer TTL)
3. Adding database read replicas (not available in this challenge)

For Tiny URL, most URLs are accessed multiple times, so caching is very effective!
```

**If cost exceeds budget**:
```
💡 Your design costs $650/month, which exceeds the $500 budget.

Ways to reduce cost:
1. Reduce app server instances (you may be over-provisioned)
2. Reduce Redis memory (4GB is enough for this workload)
3. Reduce database capacity (cache should absorb most reads)

Remember: The goal is to meet requirements at minimum cost!
```

---

# Challenge 2: Food Blog 🍕

## Problem Statement

Design a food blog website that serves blog posts (HTML) and food photos (images). The site is mostly static content with occasional new posts published.

**Content**:
- Blog posts: 1,000 total posts, HTML + metadata (50KB each)
- Images: 5 images per post, 2MB each
- Traffic: Mostly repeat visitors reading old posts

---

## Requirements

### Functional Requirements
- Serve blog post HTML
- Serve food images
- Support search/browse

### Non-Functional Requirements
- **Traffic**: 10,000 visitors/day, 100 concurrent users
  - Avg 100 RPS during day
  - Each page load = 1 HTML request + 5 image requests
- **Latency**: p99 < 500ms for page load (HTML + images)
- **Availability**: 99% uptime
- **Budget**: $300/month

### Workload Characteristics
- **Read-only**: No writes during normal operation
- **Static content**: Same content served repeatedly
- **Image-heavy**: 10MB of images per page view
- **Global audience**: Users from various geographic locations

---

## Available Components

User can use:
- ✅ Load Balancer
- ✅ App Server (serves HTML)
- ✅ PostgreSQL (stores blog data)
- ✅ Redis Cache (cache HTML)
- ✅ S3 (store images)
- ✅ CDN (serve images globally)

---

## Test Cases

### Test Case 1: Normal Load ✅

**Scenario**: Regular daily traffic

**Traffic**:
```json
{
  "name": "Normal Load",
  "traffic": {
    "htmlRps": 100,
    "imageRps": 500
  },
  "avgImageSize": 2,
  "duration": 60
}
```

**Pass Criteria**:
- p99 latency ≤ 500ms
- Error rate ≤ 1%
- Monthly cost ≤ $300

**What This Tests**: Basic architecture for static content

---

### Test Case 2: Viral Post 🔥

**Scenario**: Post hits Reddit front page, 20x traffic spike

**Traffic**:
```json
{
  "name": "Viral Post",
  "traffic": {
    "htmlRps": 2000,
    "imageRps": 10000
  },
  "avgImageSize": 2,
  "duration": 300
}
```

**Pass Criteria**:
- p99 latency ≤ 1000ms (degradation OK)
- Error rate ≤ 5%
- No complete outage

**What This Tests**: Can CDN absorb traffic spike?

---

### Test Case 3: Image-Heavy Load 📸

**Scenario**: Users browsing image gallery (many images per page)

**Traffic**:
```json
{
  "name": "Image Heavy",
  "traffic": {
    "htmlRps": 100,
    "imageRps": 1000
  },
  "avgImageSize": 2,
  "duration": 60
}
```

**Pass Criteria**:
- p99 latency ≤ 600ms
- Bandwidth cost ≤ budget
- Images load quickly

**What This Tests**: Is image serving optimized?

---

## Example Solutions

### ❌ Bad Solution: Serve Images from App Server

**Design**:
```
Load Balancer → App Server (5 instances) → PostgreSQL
(Images stored on app server disk)
```

**Result**:
- ⚠️ Test 1: PASS (but expensive)
- ❌ Test 2: FAIL (bandwidth costs explode)
- ❌ Test 3: FAIL (app servers saturated with image serving)

**Why It Fails**:
- App servers waste CPU serving static images
- Bandwidth cost: 10MB × 100 RPS × 2.6M seconds/month / 1024 = 2,500 TB/month × $0.09 = $225k+
- No caching, every request hits app server

**Cost**: $225,000+/month ❌❌❌

---

### ⚠️ Mediocre Solution: S3 Only

**Design**:
```
Load Balancer → App Server (2 instances) → PostgreSQL (for HTML data)
               → S3 (for images, direct access)
```

**Result**:
- ✅ Test 1: PASS (but slow)
- ⚠️ Test 2: PASS (but latency spikes)
- ⚠️ Test 3: PASS (but high latency for distant users)

**Why It's Mediocre**:
- S3 latency: ~100ms per image
- No CDN = slow for users far from S3 region
- Cost is better ($~200/month) but UX is poor

**Cost**: ~$200/month

---

### ✅ Good Solution: S3 + CDN

**Design**:
```
Load Balancer → App Server (1 instance) → PostgreSQL + Redis (cache HTML)
CDN → S3 (for images)
```

**Result**:
- ✅ Test 1: PASS (fast, cheap)
- ✅ Test 2: PASS (CDN absorbs spike)
- ✅ Test 3: PASS (CDN serves images at edge)

**Why It Works**:
- CDN caches images at edge (95% hit ratio)
- Only 5% of requests hit S3 origin
- CDN serves at 5ms latency (vs 100ms S3)
- Bandwidth from CDN is cheap

**Cost**: ~$180/month

**Breakdown**:
- App Server: $100
- PostgreSQL: $30
- Redis: $25
- S3 storage: $5
- CDN: $20 (mostly cached, minimal egress)

---

## Learning Objectives

After completing this challenge, users should understand:

1. ✅ **Static Content Optimization**: Why CDNs are critical for images/video
2. ✅ **Cost Optimization**: Bandwidth costs can explode without CDN
3. ✅ **Object Storage**: When to use S3 vs serving from app server
4. ✅ **Edge Caching**: How CDNs reduce latency globally
5. ✅ **Separation of Concerns**: Compute (app server) vs storage (S3) vs delivery (CDN)

---

## Hints (Shown on Failure)

**If cost is very high ($1000+)**:
```
💡 Your bandwidth costs are extremely high!

You're likely serving images directly from app servers. Consider:
1. Store images in S3 (object storage)
2. Add a CDN in front of S3 to cache images at edge
3. This reduces bandwidth cost by 95%

For static content (images, videos, CSS), always use a CDN!
```

**If viral post test fails**:
```
💡 Your system couldn't handle the traffic spike.

For static content, a CDN should absorb nearly all traffic:
- CDN hit ratio: 95%+ (images rarely change)
- Even 10,000 RPS → only 500 RPS to origin

Make sure you've added a CDN component in front of S3!
```

---

# Challenge 3: Todo App ✅

## Problem Statement

Design a todo list application where users can create, read, update, and delete tasks. Each user has their own list of tasks.

**Features**:
- User authentication (sessions)
- CRUD operations on tasks
- Each user has ~100 tasks on average
- 10,000 active users

---

## Requirements

### Functional Requirements
- Users can create/read/update/delete tasks
- Each user sees only their own tasks
- Tasks persist across sessions

### Non-Functional Requirements
- **Traffic**: 500 RPS (mixed read/write, 60% reads, 40% writes)
- **Latency**: p99 < 200ms
- **Availability**: 99.9% uptime (including during failures)
- **Budget**: $800/month

### Workload Characteristics
- **Mixed read/write**: 60/40 split
- **Per-user isolation**: Query pattern: `SELECT * FROM tasks WHERE user_id = ?`
- **Small data**: 10k users × 100 tasks × 1KB = 1GB total
- **Session management**: Need to track logged-in users

---

## Available Components

User can use:
- ✅ Load Balancer
- ✅ App Server
- ✅ Redis (for sessions or task caching)
- ✅ PostgreSQL (configure replication!)

---

## Test Cases

### Test Case 1: Normal Load ✅

**Scenario**: Regular usage

**Traffic**:
```json
{
  "name": "Normal Load",
  "traffic": {
    "readRps": 300,
    "writeRps": 200
  },
  "duration": 60
}
```

**Pass Criteria**:
- p99 latency ≤ 200ms
- Error rate ≤ 1%
- Monthly cost ≤ $800

**What This Tests**: Basic mixed read/write workload

---

### Test Case 2: Database Failure 🔥

**Scenario**: Primary database crashes, must failover to replica

**Traffic**:
```json
{
  "name": "Database Failure",
  "traffic": {
    "readRps": 300,
    "writeRps": 200
  },
  "duration": 120,
  "failureInjection": {
    "type": "db_crash",
    "atSecond": 30,
    "recoverySecond": 90
  }
}
```

**Pass Criteria**:
- Availability ≥ 95%
- Max downtime ≤ 10 seconds
- No data loss

**What This Tests**: Is replication configured? Does failover work?

---

### Test Case 3: Hot User 🔥

**Scenario**: One user makes 100 requests/second (power user or bot)

**Traffic**:
```json
{
  "name": "Hot User",
  "traffic": {
    "readRps": 300,
    "writeRps": 200,
    "hotUserRps": 100
  },
  "duration": 60
}
```

**Pass Criteria**:
- p99 latency ≤ 250ms (slight degradation OK)
- Error rate ≤ 2%
- Other users not affected

**What This Tests**: Is database indexed properly? Can it handle hot partition?

---

## Example Solutions

### ❌ Bad Solution: Single Database, No Replication

**Design**:
```
Load Balancer → App Server (2 instances) → PostgreSQL (no replication)
```

**Result**:
- ✅ Test 1: PASS
- ❌ Test 2: FAIL (60 seconds of downtime, 50% availability)
- ✅ Test 3: PASS (if DB has index on user_id)

**Why It Fails**: No fault tolerance, single point of failure

**Cost**: ~$350/month

---

### ⚠️ Mediocre Solution: Replication, No Auto-Failover

**Design**:
```
Load Balancer → App Server (2 instances) → PostgreSQL (primary + replica, manual failover)
```

**Result**:
- ✅ Test 1: PASS
- ⚠️ Test 2: FAIL (30 seconds of downtime, 75% availability)
- ✅ Test 3: PASS

**Why It's Mediocre**: Has replica but failover takes 30 seconds (manual intervention)

**Cost**: ~$600/month

---

### ✅ Good Solution: Replication + Auto-Failover

**Design**:
```
Load Balancer → App Server (2 instances) → PostgreSQL (primary + replica, auto-failover)
                                         → Redis (sessions)
```

**Result**:
- ✅ Test 1: PASS
- ✅ Test 2: PASS (5 seconds of downtime, 96% availability)
- ✅ Test 3: PASS

**Why It Works**:
- Replication: Data replicated to standby
- Auto-failover: Promotes replica to primary in ~5 seconds
- Redis: Sessions survive DB failure
- Index on user_id: Fast per-user queries

**Cost**: ~$750/month

**Breakdown**:
- App Server: $200
- PostgreSQL (primary + replica): $500
- Redis: $50

---

### 🌟 Excellent Solution: Read Replicas

**Design**:
```
Load Balancer → App Server (3 instances) → PostgreSQL Primary (writes)
                                        ↘ PostgreSQL Replica 1 (reads)
                                        ↘ PostgreSQL Replica 2 (reads)
Redis (sessions)
```

**Result**:
- ✅ Test 1: PASS (lower latency)
- ✅ Test 2: PASS
- ✅ Test 3: PASS (better load distribution)

**Why It's Excellent**:
- Writes go to primary
- Reads distributed across replicas
- Better utilization, lower latency

**Cost**: ~$950/month (over budget, but shows advanced understanding)

---

## Learning Objectives

After completing this challenge, users should understand:

1. ✅ **Database Replication**: Why it's needed for fault tolerance
2. ✅ **Failover Strategies**: Automatic vs manual failover
3. ✅ **Availability Calculation**: How downtime affects availability %
4. ✅ **Session Management**: Why sessions should be stored separately
5. ✅ **Indexing**: Importance of database indexes for query patterns
6. ✅ **Read Replicas**: How to scale read-heavy workloads

---

## Hints (Shown on Failure)

**If Test 2 fails (DB failure)**:
```
💡 Your system had 60 seconds of downtime when the database crashed.

This is because you don't have database replication configured. Without a replica:
- Primary crashes → all data access fails
- Recovery time = time to restart DB + restore from backup (minutes to hours)

To fix:
1. Enable replication in PostgreSQL config
2. This creates a standby replica that stays in sync
3. When primary fails, promote replica to primary (5-10 seconds)

Replication is critical for high-availability systems!
```

**If cost is too low (<$500) but test 2 fails**:
```
💡 Your design is cheap ($400/month) but doesn't meet availability requirements.

You're probably running a single database to save money. But:
- Single DB = single point of failure
- Fails availability test

In production, fault tolerance is more important than cost savings!
Add database replication (costs more but provides high availability).
```

---

# Challenge Summary

## Progression

| Challenge | Difficulty | Key Concept | Components |
|-----------|-----------|-------------|------------|
| **Tiny URL** | ⭐ Beginner | Caching for read-heavy | 4 |
| **Food Blog** | ⭐⭐ Beginner+ | CDN for static content | 6 |
| **Todo App** | ⭐⭐⭐ Intermediate | Replication for fault tolerance | 4 |

## Concepts Covered

### After all 3 challenges, users should understand:

**Architecture Patterns**:
- ✅ Load balancing
- ✅ Caching layers
- ✅ Database replication
- ✅ CDN for static content
- ✅ Object storage

**Performance Optimization**:
- ✅ Capacity planning
- ✅ Cache hit ratios
- ✅ Read vs write optimization
- ✅ Indexing strategies

**Reliability**:
- ✅ Single points of failure
- ✅ Replication and failover
- ✅ Availability calculations
- ✅ Graceful degradation

**Cost Management**:
- ✅ Bandwidth costs
- ✅ Compute vs storage tradeoffs
- ✅ Over-provisioning vs under-provisioning

---

## Next Challenges (Post-MVP)

Once MVP is validated, consider adding:

### Challenge 4: Instagram-like Feed (Intermediate+)
- **Concepts**: Fan-out on write, timeline generation, N+1 query problem
- **Components**: + Message Queue, Multiple DBs

### Challenge 5: Real-time Chat (Advanced)
- **Concepts**: WebSockets, message ordering, read receipts
- **Components**: + WebSocket servers, Redis Pub/Sub

### Challenge 6: Video Streaming (Advanced)
- **Concepts**: Adaptive bitrate, CDN for video, transcode queue
- **Components**: + Video transcoding, Multi-CDN

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Status**: Ready for Implementation
