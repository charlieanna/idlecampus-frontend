# System Design - TUTORIAL Problems

Total Problems: 4

---

## 1. 📚 Tutorial 1: Personal Blog Platform

**ID:** tutorial-simple-blog
**Category:** tutorial
**Difficulty:** Easy

### Summary

Learn the basics of system design

### Goal

Design a simple blog that can scale from 100 to 1,000 requests/sec

### Description

Welcome to your first system design tutorial! 🎉

In this tutorial, you'll learn:
- How to drag and drop components onto the canvas
- How to connect components together
- How tier validation works
- Basic scaling concepts

**Scenario**: You're building a personal blog for a tech writer. Right now it gets 100 requests/sec, but it's going viral and you need to scale to 1,000 requests/sec while maintaining high availability.

**How this works**:
1. Read each tier's requirements
2. Drag components from the palette on the right
3. Connect them by clicking and dragging between nodes
4. Watch the tier checkmarks turn green ✅
5. Read the hints if you get stuck!

### Functional Requirements

- Users can read blog posts
- Users can view comments
- Authors can publish new posts
- System handles both reads (90%) and writes (10%)

### Non-Functional Requirements

- **Latency:** P99 < 200ms
- **Request Rate:** Start: 100 req/sec, Target: 1,000 req/sec
- **Dataset Size:** 10,000 blog posts, 100,000 comments (~100MB)
- **Availability:** 99.9% uptime (no single point of failure)

### Constants/Assumptions

- **read_qps:** 900
- **write_qps:** 100
- **app_capacity_per_instance:** 150
- **db_read_capacity:** 5000
- **db_write_capacity:** 1000

### Available Components

- client
- lb
- app
- db_primary
- db_replica

### Hints

1. 💡 **Tier 0**: Start by dragging an "App Server" from the palette, then add a "Database". Click on Client, then drag to App Server to connect them.
2. 💡 **Tier 1**: A Load Balancer sits between clients and app servers to distribute traffic evenly. This prevents any single server from being overwhelmed.
3. 💡 **Tier 2**: Each app server handles 150 req/sec. For 1,000 req/sec: 1000 ÷ 150 = 7 servers. Read replicas handle the 90% read traffic.
4. 🎓 **Why Load Balancers?**: They provide health checks, automatic failover, and prevent downtime when servers restart.
5. 🎓 **Why Read Replicas?**: Reads (viewing posts) vastly outnumber writes (publishing posts). Replicas let us scale reads independently.

### Tiers/Checkpoints

**T0: 🎯 Basic Setup**
  - Must include: app
  - Must include: db_primary
  - Must have connection from: app

**T1: ⚖️ High Availability**
  - Must include: lb
  - Minimum 2 of type: app

**T2: 📈 Scale to 1,000 QPS**
  - Minimum 7 of type: app
  - Must include: db_replica

### Reference Solution

This is a classic 3-tier web architecture:

1. **Client → Load Balancer**: All traffic goes through LB for distribution
2. **Load Balancer → App Servers (8x)**: LB distributes across healthy servers
3. **App Servers → Databases**: Writes go to Primary, reads go to Replica

With 8 app servers × 150 req/sec = 1,200 req/sec capacity (20% headroom for spikes).

**Components:**
- Blog Readers (redirect_client)
- Load Balancer (lb)
- App Servers (app)
- Primary DB (db_primary)
- Read Replica (db_replica)

**Connections:**
- Blog Readers → Load Balancer
- Load Balancer → App Servers
- App Servers → Primary DB
- App Servers → Read Replica

### Solution Analysis

**Architecture Overview:**

A simple, scalable blog architecture using primary-replica replication for reads

**Phase Analysis:**

*Normal Operation:*
Under normal load (1,000 QPS), system runs smoothly with headroom
- Latency: P99: 50ms (database queries)
- Throughput: 1,000 req/sec (83% capacity utilization)
- Error Rate: 0.01% (only during deployments)
- Cost/Hour: $3.5

*Peak Load:*
Can handle 1.2x spike (1,200 QPS) before needing horizontal scaling
- Scaling Approach: Auto-scaling group adds servers when CPU > 70%
- Latency: P99: 120ms (higher DB queue wait)
- Throughput: 1,200 req/sec (100% capacity)
- Cost/Hour: $3.5

*Failure Scenarios:*
If one app server fails, LB detects and routes to healthy servers
- Redundancy: N+1 redundancy (8 servers, need 7)
- Failover Time: 10 seconds (health check interval)
- Data Loss Risk: None (database has automatic backups)
- Availability: 99.9% (8 hours downtime/year)
- MTTR: 5 minutes (automatic recovery)

**Trade-offs:**

1. Primary-Replica vs Single Database
   - Pros:
     - Can scale reads independently
     - Better fault tolerance
     - Lower latency for read-heavy workload
   - Cons:
     - Slight replication lag (eventual consistency)
     - More complex deployment
     - Higher cost
   - Best for: Best for read-heavy apps like blogs, news sites, product catalogs
   - Cost: +$150/month for replica, but prevents need for larger primary

**Cost Analysis:**

- Monthly Total: $2,320
- Yearly Total: $27,840
- Cost per Request: $0.00003 per request (2.3M requests/month)

*Breakdown:*
- Compute: $1,920 (8 servers × $0.0416/hour × 730 hours = $1,920/month)
- Storage: $320 (2 × $0.034/hour × 730 hours + 100GB storage = $320/month)
- Network: $80 (ALB: $16 + LCU: $24 + Data Transfer: $40 = $80/month)

### Tutorial Narrative

Welcome to your first system design tutorial! 🎉

Let's design a personal blog platform together. I'll walk you through my thought process, show you the calculations, and teach you how to think about system design step-by-step.

**The Problem**: A tech writer has a blog that currently gets **100 requests/second**. It's going viral and will soon hit **1,000 requests/second**. We need to design a system that can handle this growth while maintaining high availability.

Let's solve this together! 🚀

**Step 1: Analyze the Requirements**

Before we start adding components, let's think about what we need:

**Traffic Pattern**:
- Current: 100 requests/sec
- Target: 1,000 requests/sec
- Mix: 90% reads (viewing posts), 10% writes (publishing)

**Data**:
- 10,000 blog posts
- 100,000 comments
- Total: ~100MB of data

**Key Question**: What's the minimum infrastructure we need?

*Calculation: How many app servers do we need for 1,000 req/sec?*
  - Each app server can handle ~150 requests/sec
  - Total needed capacity: 1,000 req/sec
  - Servers needed = 1,000 ÷ 150 = 6.67
  - Round up for safety = 7 servers
  - **Result:** We need **at least 7 app servers** to handle the load

*Checkpoint: If each server handles 200 req/sec, how many do we need for 1,000 req/sec?*
  - Correct Answer: 5
  - Hint: Divide total requests by per-server capacity: 1,000 ÷ 200

**Step 2: Build the Foundation (Tier 0)**

Every web application needs three core components:

1. **App Server**: Runs your code (Node.js, Python, etc.)
2. **Database**: Stores your data permanently
3. **Connection**: App talks to database

This is the absolute minimum. Let's add these now.

*Checkpoint: Why do we need a database in addition to the app server?*
  - Correct Answer: To persist data permanently (blog posts and comments)
  - Hint: App servers are stateless - they lose data when they restart

**Step 3: High Availability (Tier 1)**

**Problem**: What happens if our single app server crashes? The entire blog goes down! ❌

**Solution**: We need **redundancy** - multiple app servers behind a load balancer.

**Load Balancer**:
- Distributes traffic across multiple servers
- Detects when a server is down (health checks)
- Automatically routes traffic to healthy servers

Let's add a load balancer and a second app server for redundancy.

*Calculation: What availability improvement do we get from 2 servers?*
  - Single server uptime: 99% (3.5 days down/year)
  - Chance BOTH fail simultaneously: 0.01 × 0.01 = 0.0001
  - System availability: 1 - 0.0001 = 0.9999
  - That's 99.99% uptime! (52 minutes down/year)
  - **Result:** Adding redundancy improves availability from **99% to 99.99%**

*Checkpoint: What is the main purpose of a load balancer?*
  - Correct Answer: Distribute traffic and provide failover
  - Hint: Think about what happens when one server fails

**Step 4: Scale to 1,000 QPS (Tier 2)**

Now we can handle **2 servers × 150 req/sec = 300 requests/sec**. But we need **1,000 req/sec**!

**Horizontal Scaling**: Add more app servers

Let's do the math to figure out how many we need.

*Calculation: How many app servers for 1,000 req/sec?*
  - Target capacity: 1,000 requests/sec
  - Per-server capacity: 150 requests/sec
  - Servers needed: 1,000 ÷ 150 = 6.67
  - Add 20% headroom for spikes: 6.67 × 1.2 = 8 servers
  - 
  - **Why headroom?** Traffic is never perfectly flat.
  - Spikes happen (viral posts, morning rush, etc.)
  - Better to have 20% extra than to crash during a spike!
  - **Result:** Scale to **8 app servers** (1,200 req/sec capacity with headroom)

**Step 5: Database Read Scaling**

**New Problem**: Our app servers can handle 1,000 req/sec, but what about the database?

**Key Insight**: 90% of requests are READS (viewing posts), only 10% are WRITES (publishing).

**Math**:
- Reads: 1,000 × 0.9 = 900 queries/sec
- Writes: 1,000 × 0.1 = 100 queries/sec

**Solution**: Add **Read Replicas**
- Primary database handles writes (100 QPS)
- Replicas handle reads (900 QPS spread across them)
- Replication lag is acceptable for a blog (~1 second)

*Calculation: Database capacity check*
  - Primary DB capacity: 1,000 writes/sec (we only need 100 ✅)
  - Replica DB capacity: 5,000 reads/sec each
  - Our read load: 900 reads/sec
  - Replicas needed: 900 ÷ 5,000 = 0.18 (1 replica is enough!)
  - 
  - **But**: We add 1 replica for reads anyway because:
  - 1. Failover (if primary dies, replica becomes primary)
  - 2. Geographic distribution
  - 3. Future growth
  - **Result:** Add **1 Read Replica** for read scaling and redundancy

*Checkpoint: If we have 10,000 QPS with 95% reads and 5% writes, how many read queries per second?*
  - Correct Answer: 9500
  - Hint: Multiply total QPS by the read percentage: 10,000 × 0.95

🎉 **Congratulations!** You've designed a scalable blog architecture!

**What You Built**:
- **8 app servers** (1,200 req/sec capacity)
- **Load balancer** (high availability, health checks)
- **Primary database** (handles all writes)
- **Read replica** (scales read traffic)

**Capacity**:
- Can handle **1,200 requests/sec** (20% over target)
- **99.99% availability** (52 minutes downtime/year)
- Costs ~$2,320/month

**Key Lessons**:
1. ✅ Always calculate capacity (don't guess!)
2. ✅ Separate reads from writes
3. ✅ Add headroom for traffic spikes (10-20%)
4. ✅ Redundancy prevents single points of failure

**What's Next?**
- Add caching (Redis) to reduce database load by 90%
- Add CDN to serve static assets from edge locations
- Add auto-scaling to handle unpredictable spikes

Ready for Tutorial 2? 🚀

---

## 2. 📚 Tutorial 2: Image Hosting Service

**ID:** tutorial-intermediate-images
**Category:** tutorial
**Difficulty:** Intermediate

### Summary

Learn CDN, caching, and storage optimization

### Goal

Design an image hosting service handling 10,000 requests/sec with 1M images

### Description

Ready for the next level? 🚀

In this tutorial, you'll learn:
- How to use CDN for global content delivery
- Cache hit rate tuning and TTL strategies
- Object storage vs database storage
- Parameter configuration (click on nodes to adjust!)
- Cost optimization for storage-heavy workloads

**Scenario**: You're building an image hosting service like Imgur. Users upload images and share links. The service serves 10,000 image requests/sec globally, stores 1M images (5TB), and needs to be cost-efficient.

**New Concepts**:
- **CDN (Content Delivery Network)**: Caches images at edge locations worldwide
- **Object Storage (S3)**: Cheap, scalable storage for images
- **Cache Hit Rate**: % of requests served from cache (higher = better)
- **TTL (Time To Live)**: How long to cache before refreshing

**Pro Tip**: Click on any component to see and adjust its parameters!

### Functional Requirements

- Users can upload images (write)
- Users can view images via URLs (read)
- Images are served globally with low latency
- Support 1M stored images (5TB total)
- 95% reads (image views), 5% writes (uploads)

### Non-Functional Requirements

- **Latency:** P99 < 100ms globally (P50 < 20ms)
- **Request Rate:** 10,000 requests/sec (9,500 reads, 500 writes)
- **Dataset Size:** 1M images, 5TB storage, growing 100GB/month
- **Data Durability:** 99.999999999% (eleven nines)
- **Availability:** 99.99% uptime

### Constants/Assumptions

- **read_qps:** 9500
- **write_qps:** 500
- **app_capacity_per_instance:** 200
- **db_read_capacity:** 10000
- **db_write_capacity:** 2000
- **cdn_hit_target:** 0.9
- **cache_hit_target:** 0.95
- **storage_size_tb:** 5

### Available Components

- client
- cdn
- lb
- app
- cache
- db_primary
- db_replica
- s3

### Hints

1. 💡 **Tier 0**: Store image FILES in S3 (cheap, durable), but metadata (filename, user_id, upload_date) in database.
2. 💡 **Tier 1**: CDN caches images AT THE EDGE (close to users globally). 90% cache hit = only 10% requests reach your servers!
3. 💡 **Tier 2**: Cache (Redis) stores metadata in-memory for ultra-fast lookups. Much faster than querying database.
4. 💡 **Tier 3**: With 90% CDN hit + 90% cache hit, only ~1% of requests hit the database! (10,000 × 0.1 × 0.1 = 100 QPS)
5. 🎓 **Why S3 vs Database?**: S3 costs $0.023/GB vs database $0.115/GB. For 5TB: S3 = $115/mo, DB = $575/mo!
6. 🎓 **CDN Hit Rate**: Popular images (top 20%) account for 90% of views. CDN caches these at edge for <20ms latency.
7. 🎓 **Click on Components**: Try clicking on CDN or Cache and adjusting their hit_rate parameter!

### Tiers/Checkpoints

**T0: 🎯 Basic Architecture**
  - Must include: app
  - Must include: db_primary
  - Must include: s3

**T1: 🌍 Global Edge Caching**
  - Must include: cdn
  - Parameter range check: cdn.hit_rate

**T2: ⚡ Metadata Caching**
  - Must include: cache
  - Parameter range check: cache.hit_rate
  - Must include: lb

**T3: 📈 Scale to 10K QPS**
  - Minimum 10 of type: app
  - Must include: db_replica

### Reference Solution

This is a multi-tier caching architecture optimized for global image delivery:

**Request Flow (Image View)**:
1. Client → CDN (90% served from edge, <20ms latency) ✅
2. CDN miss → LB → App → Redis Cache (92% hit, <5ms) ✅
3. Cache miss → DB Replica → Return metadata → App fetches from S3 ✅

**Request Flow (Image Upload)**:
1. Client → CDN → LB → App Server
2. App uploads image to S3
3. App writes metadata to Primary DB
4. App warms cache with new entry

**Math**: 10,000 QPS × 10% CDN miss × 8% cache miss = only 80 QPS hits database!

**Components:**
- Global Users (redirect_client)
- CloudFront CDN (cdn)
- ALB (lb)
- App Servers (app)
- Redis Cache (cache)
- Primary DB (db_primary)
- Read Replica (db_replica)
- S3 Storage (s3)

**Connections:**
- Global Users → CloudFront CDN
- CloudFront CDN → ALB
- ALB → App Servers
- App Servers → Redis Cache
- App Servers → S3 Storage
- Redis Cache → Primary DB
- Redis Cache → Read Replica

### Solution Analysis

**Architecture Overview:**

A globally-distributed image hosting architecture with multi-layer caching

**Phase Analysis:**

*Normal Operation:*
Under normal load, 90% served by CDN, 9% by cache, 1% hits database
- Latency: P50: 18ms (CDN), P99: 85ms (cache miss)
- Throughput: 10,000 req/sec (65% server capacity)
- Error Rate: 0.001% (mostly S3 throttling)
- Cost/Hour: $8.2

*Peak Load:*
Viral image shared: 2x spike to 20,000 QPS. CDN absorbs most load.
- Scaling Approach: CDN handles edge spikes. Auto-scale app servers for cache misses.
- Latency: P50: 20ms (CDN), P99: 150ms (DB queries)
- Throughput: 20,000 req/sec (CDN unlimited, servers at 95%)
- Cost/Hour: $12.5

*Failure Scenarios:*
If cache fails, traffic goes directly to database. Replicas handle load.
- Redundancy: Cache cluster (2 nodes), DB replicas (read failover)
- Failover Time: 30 seconds (cache cluster restart)
- Data Loss Risk: No data loss (cache is ephemeral, DB has backups)
- Availability: 99.99% (52 minutes downtime/year)
- MTTR: 10 minutes (cache cluster restart)

**Trade-offs:**

1. S3 vs Database for Image Storage
   - Pros:
     - 5x cheaper per GB
     - Unlimited scalability
     - Built-in CDN integration
     - 11 nines durability
   - Cons:
     - Higher latency than local disk
     - API rate limits
     - Eventual consistency
   - Best for: Always use S3/object storage for large files (images, videos, backups)
   - Cost: S3: $115/mo for 5TB vs DB: $575/mo for 5TB = $460/mo savings

2. CDN Hit Rate: 85% vs 95%
   - Pros:
     - 95% = fewer origin requests, lower latency, less server load
   - Cons:
     - Requires larger CDN cache size, higher CDN costs, more edge locations
   - Best for: 85% for general content, 95% for popular/viral content
   - Cost: 95% hit rate adds ~$500/mo in CDN costs but saves $1,200/mo in server costs

**Cost Analysis:**

- Monthly Total: $4,660
- Yearly Total: $55,920
- Cost per Request: $0.000018 per request (26B requests/month)

*Breakdown:*
- Compute: $2,960 (12 × $0.0416/hr × 730 = $2,880 + ALB $80 = $2,960)
- Storage: $1,015 (S3: $115 + RDS: $600 + Redis: $300 = $1,015)
- Network: $685 (CDN: $600 (1M requests/sec) + Transfer: $85 = $685)

---

## 3. 📚 Tutorial 3: Real-Time Chat System

**ID:** tutorial-advanced-chat
**Category:** tutorial
**Difficulty:** Advanced

### Summary

Master complex architectures with real-time features

### Goal

Design a production-ready chat system for 100K concurrent users

### Description

Welcome to the advanced tutorial! This is a production-level system design. 💪

In this tutorial, you'll master:
- Real-time communication with WebSockets
- Message queues for reliability and decoupling
- Horizontal scaling and sharding strategies
- Monitoring and observability
- Multi-region architecture for global scale

**Scenario**: You're building a real-time chat system like Slack/Discord. It needs to support:
- 100,000 concurrent users online
- 50,000 messages per second during peak
- Real-time message delivery (<500ms)
- Message history (1B+ messages stored)
- Global availability (multi-region)

**Complex Concepts**:
- **WebSocket Servers**: Maintain persistent connections for real-time updates
- **Message Queues (Kafka)**: Ensure reliable message delivery and ordering
- **Database Sharding**: Split database by chat_room_id for horizontal scale
- **Monitoring**: Track latency, errors, throughput in real-time

This is what you'll build in production! Take your time. 🚀

### Functional Requirements

- Users can send/receive messages in real-time
- Messages are delivered to all room participants instantly
- Message history is persisted and searchable
- Support for 1:1 chats and group rooms (up to 10K members)
- Typing indicators and presence (online/offline)
- File attachments and rich media

### Non-Functional Requirements

- **Latency:** P99 < 500ms for message delivery, P99 < 100ms for message send
- **Request Rate:** 50,000 messages/sec peak, 100,000 concurrent WebSocket connections
- **Dataset Size:** 1B messages (10TB), growing 1TB/month
- **Data Durability:** No message loss, 30-day message retention
- **Availability:** 99.99% uptime globally
- **Consistency:** Total ordering within a room, eventual consistency across regions

### Constants/Assumptions

- **concurrent_connections:** 100000
- **messages_per_sec:** 50000
- **websocket_capacity_per_instance:** 10000
- **app_capacity_per_instance:** 500
- **db_shard_capacity:** 100000
- **message_size_bytes:** 1024

### Available Components

- client
- cdn
- lb
- app
- websocket
- stream
- cache
- db_primary
- db_replica
- s3
- monitoring

### Hints

1. 💡 **Tier 0**: Separate HTTP API servers (REST) from WebSocket servers (persistent connections). Different scaling needs!
2. 💡 **Tier 1**: Message Queue ensures: (1) No message loss if WS server crashes, (2) Message ordering, (3) Delivery guarantees.
3. 💡 **Tier 2**: Cache stores "who's in this room" and "last 100 messages" for instant loading. S3 stores file attachments.
4. 💡 **Tier 3**: WebSocket servers need 10K connections each. App servers process 2.5K msg/sec (queue buffering helps).
5. 💡 **Tier 4**: Monitoring tracks: message delivery latency, queue lag, connection drops, error rates per endpoint.
6. 🎓 **Why Separate WebSocket Servers?**: HTTP is stateless (can LB freely). WebSockets are stateful (sticky connections).
7. 🎓 **Message Queue Flow**: User sends → API server → Kafka topic (room_id) → WS servers consume → Deliver to room members.
8. 🎓 **Database Sharding**: With 1B messages, shard by room_id. Each shard handles 100M messages. Query: "SELECT WHERE room_id = X".
9. 🎓 **Monitoring is Critical**: In production, you need real-time alerts when message latency spikes or queue lag grows.

### Tiers/Checkpoints

**T0: 🎯 Core Architecture**
  - Must include: app
  - Must include: websocket
  - Must include: db_primary
  - Must include: lb

**T1: 📨 Message Queue for Reliability**
  - Must include: stream

**T2: ⚡ Caching & Performance**
  - Must include: cache
  - Must include: db_replica
  - Must include: s3

**T3: 📈 Scale to Production**
  - Minimum 10 of type: websocket
  - Minimum 20 of type: app
  - Minimum 5 of type: db_replica

**T4: 🌍 Production-Ready**
  - Must include: cdn
  - Must include: monitoring

### Reference Solution

This is a production-grade real-time chat architecture:

**Message Send Flow**:
1. User sends message via WebSocket → WS Server
2. WS Server publishes to Kafka topic (partitioned by room_id)
3. API Server persists to DB (async, via Kafka consumer)
4. WS Servers (subscribed to room topics) push to online users
5. Delivery confirmed, shown in UI

**Message History Flow**:
1. User opens room → API Server
2. Check Redis for "last 100 messages in room X"
3. Cache hit: return instantly (<10ms)
4. Cache miss: query DB replica → warm cache → return

**Scaling**:
- WebSocket servers: 12 × 10K connections = 120K capacity
- API servers: 25 × 500 msg/sec = 12.5K msg/sec capacity
- Kafka: 100 partitions for parallel processing
- DB: Sharded by room_id for horizontal scale

**Why This Works**:
- Kafka buffers messages during spikes (queue absorbs load)
- Redis caches hot data (active rooms, online users)
- Read replicas handle history queries (90% of DB reads)
- CDN serves static assets (avatars, JS, CSS)
- Monitoring provides visibility into every layer

**Components:**
- 100K Users (redirect_client)
- CloudFront (cdn)
- ALB (API) (lb)
- NLB (WebSocket) (lb)
- API Servers (app)
- WS Servers (websocket)
- Kafka Cluster (stream)
- Redis Cluster (cache)
- Primary DB (db_primary)
- Read Replicas (db_replica)
- S3 Attachments (s3)
- Datadog (monitoring)

**Connections:**
- 100K Users → CloudFront
- CloudFront → ALB (API)
- CloudFront → NLB (WebSocket)
- ALB (API) → API Servers
- NLB (WebSocket) → WS Servers
- API Servers → Kafka Cluster
- WS Servers → Kafka Cluster
- API Servers → Redis Cluster
- Redis Cluster → Primary DB
- Redis Cluster → Read Replicas
- API Servers → S3 Attachments

### Solution Analysis

**Architecture Overview:**

A production-ready real-time chat system with message queues, caching, and monitoring

**Phase Analysis:**

*Normal Operation:*
Normal load: 50K msg/sec, 100K connections. All systems healthy.
- Latency: P50: 120ms send-to-receive, P99: 450ms
- Throughput: 50,000 msg/sec (40% capacity)
- Error Rate: 0.01% (network drops only)
- Cost/Hour: $45

*Peak Load:*
Viral event: 2x spike to 100K msg/sec, 150K connections. Kafka buffers excess load.
- Scaling Approach: Auto-scale API servers to 40, WS servers to 18. Kafka partitions buffer backlog. Process in 2-3 minutes.
- Latency: P50: 200ms, P99: 2.5s (Kafka consumer lag)
- Throughput: 100,000 msg/sec (80% capacity)
- Cost/Hour: $68

*Failure Scenarios:*
If Kafka cluster fails: messages buffered in-memory (30s), then fallback to direct DB writes. WS reconnect.
- Redundancy: Kafka cluster (3 brokers, replication factor 2), DB replicas (6), cache cluster (5 nodes)
- Failover Time: 60 seconds (Kafka leader election + WS reconnect)
- Data Loss Risk: Up to 30 seconds of messages if total Kafka failure (rare)
- Availability: 99.99% (52 minutes downtime/year)
- MTTR: 15 minutes (manual Kafka cluster restart)

**Trade-offs:**

1. Message Queue (Kafka) vs Direct WebSocket Fan-out
   - Pros:
     - Message ordering guarantees
     - Buffering during spikes
     - Replay capability
     - Decouples senders from receivers
   - Cons:
     - Additional complexity
     - Higher latency (+50-100ms)
     - More infrastructure cost
   - Best for: Essential for production chat systems with delivery guarantees
   - Cost: Kafka adds $3,000/mo but prevents $50K/mo in over-provisioned WS servers

2. Database Sharding by Room vs Time
   - Pros:
     - Room-based: All room messages in one shard (fast queries)
     - Time-based: Easy archival of old messages
   - Cons:
     - Room-based: Hot rooms need sub-sharding
     - Time-based: Queries span multiple shards
   - Best for: Room-based for active chats, time-based for message archives
   - Cost: Sharding reduces DB instance size by 10x ($8K/mo vs $800/mo per shard)

**Cost Analysis:**

- Monthly Total: $26,000
- Yearly Total: $312,000
- Cost per Request: $0.000002 per message (130B messages/month)

*Breakdown:*
- Compute: $18,250 (API: 25 × $0.17/hr × 730 = $3,100 + WS: 12 × $0.34/hr × 730 = $2,980 + LB: $200 = $6,280)
- Storage: $13,450 (RDS: $8,200 + Redis: $5,000 + S3: $250 = $13,450)
- Network: $6,300 (Kafka: $3,600 + CDN: $800 + Transfer: $450 + Monitoring: $1,450 = $6,300)

---

## 4. 📚 BoE Walkthrough: Real-Time Chat System

**ID:** boe-walkthrough-chat
**Category:** tutorial

### Description

Learn to apply all 6 NFRs step-by-step to design WhatsApp-scale chat

### Tutorial Narrative

# Real-Time Chat System: Apply NFRs Step-by-Step

Welcome to an interactive walkthrough where you'll apply all 6 Non-Functional Requirements (NFRs) to design a production-ready chat system like WhatsApp or Slack.

## What You'll Learn

1. **Extract NFRs** from vague product requirements
2. **Calculate capacity** using back-of-envelope math
3. **Make architectural decisions** driven by specific NFRs
4. **Understand trade-offs** between competing requirements
5. **Build a diagram** step-by-step as requirements evolve

## The Problem

Design a real-time messaging system with these requirements:

**Product Requirements:**
- 10 million daily active users (DAU)
- Users send 25 messages per day on average
- Messages must arrive quickly (real-time feel)
- Message history must never be lost
- System should handle traffic spikes during events
- 99.95% uptime SLA

Let's translate these vague requirements into concrete, measurable NFRs!

**Step 1: Translate Requirements → NFRs**

## Extract Measurable NFRs from Product Requirements

Let's convert those vague product requirements into **6 concrete NFRs** with numbers:

### 1. 📈 Throughput (Request Rate)

**Requirement:** "10M DAU, 25 messages/day"

#### Mental Math:
- **Write QPS**: (10M × 25 msgs) ÷ 100k sec/day
  - = 250M ÷ 100k = **2,500 avg write QPS**
- **Peak write QPS**: 2,500 × 3 = **7,500 peak**
- **Read QPS**: Assume 10:1 read:write ratio = **75,000 read QPS**

### 2. ⚡ Latency

**Requirement:** "Messages must arrive quickly"

**Translation:** p99 latency < 500ms end-to-end
- API: 50ms
- Websocket fanout: 100ms
- Network: 100ms
- Buffer: 250ms

### 3. 🛡️ Availability

**Requirement:** "99.95% uptime SLA"

**Translation:** 99.95% = 22 minutes downtime/month
- Multi-AZ deployment required
- Circuit breakers for dependencies

### 4. 🔄 Consistency

**Requirement:** "Message order matters"

**Translation:** Causal consistency (not strong)
- Your messages appear in order you sent them
- Others' messages may have slight lag (eventual)

### 5. 💾 Durability

**Requirement:** "Message history must never be lost"

**Translation:** RPO = 0 (zero data loss)
- Sync replication before ACK
- RF = 3 (replication factor)
- Daily backups to object storage

### 6. 💰 Cost

**Constraint:** Minimize while meeting above NFRs

**Translation:** Optimize cache hit rates, right-size instances

---

### Summary: Our 6 NFRs

| NFR | Target | Impact |
|-----|--------|--------|
| Throughput | 7.5k write, 75k read QPS | Determines instance count |
| Latency | p99 < 500ms | Requires caching, CDN |
| Availability | 99.95% | Multi-AZ, circuit breakers |
| Consistency | Causal | Read-your-writes guarantee |
| Durability | RPO = 0 | RF=3, sync writes |
| Cost | Minimize | Cache, right-size, no over-provisioning |

*Calculation: Calculate average write QPS and peak write QPS (3× factor)*
  - Average write QPS = DAU × msgs/day ÷ sec/day
  - = 10,000,000 × 25 ÷ 100,000
  - = 250,000,000 ÷ 100,000
  - = 2,500 QPS average
  - 
  - Peak write QPS = Average × 3
  - = 2,500 × 3
  - = 7,500 QPS peak
  - **Result:** **2,500 avg write QPS | 7,500 peak write QPS**

*Checkpoint: With 1.5× headroom for deployments, what write capacity do we need?*
  - Correct Answer: 11250
  - Hint: Peak × Headroom = 7,500 × 1.5

**Step 2: Apply Throughput NFR → Size API Layer**

## 📈 NFR: Throughput (11,250 write QPS capacity)

From Step 1, we need:
- **Write capacity**: 11,250 QPS (peak × headroom)
- **Read capacity**: 75,000 × 1.5 = 112,500 QPS

### Architectural Decision

**Component:** Load Balancer + API Servers

**Assumptions:**
- Commodity EC2 (m5.xlarge): **1,000 write QPS** per instance
- Read-optimized instances: **5,000 read QPS** per instance

### Mental Math: How Many Instances?

**Write instances:**
- 11,250 QPS ÷ 1,000 per instance = **12 instances**

**Read instances** (can separate for optimization):
- 112,500 QPS ÷ 5,000 per instance = **23 instances**

### Design Pattern

Use **separate write and read pools** for better optimization:
- Write pool: 12 instances (handles message sending)
- Read pool: 23 instances (handles message fetching, history)

### Trade-offs

✅ **Throughput**: Handles peak + headroom
✅ **Availability**: N+1 redundancy (can lose instances)
⚠️ **Cost**: (12 + 23) × $100/mo = **$3,500/mo** for API layer
✅ **Latency**: Horizontal scaling doesn't add latency

### Next Step

Add these components to your diagram!

*Calculation: Calculate instances needed for write and read traffic*
  - Write instances = Write QPS ÷ Per-Instance
  - = 11,250 ÷ 1,000
  - = 11.25 → ceiling = 12 instances
  - 
  - Read instances = Read QPS ÷ Per-Instance
  - = 112,500 ÷ 5,000
  - = 22.5 → ceiling = 23 instances
  - 
  - Total API instances = 12 + 23 = 35 instances
  - **Result:** **12 write + 23 read = 35 API instances | $3,500/mo**

*Checkpoint: If write QPS doubles to 22,500 with 1.5× headroom, how many write instances?*
  - Correct Answer: 34
  - Hint: (22,500 × 1.5) ÷ 1,000 = ?

**Step 3: Apply Latency NFR → Add Caching**

## ⚡ NFR: Latency (p99 < 500ms)

### Current Latency Budget

- API: 50ms
- DB query: 20-50ms (depends on load)
- Websocket fanout: 100ms
- Network: 100ms
- **Total**: ~300ms best case, **~400ms** under load

### Problem

With 112,500 read QPS hitting database:
- Database p99 latency degrades to **80-150ms**
- Violates our 500ms total budget!

### Architectural Decision

**Component:** Redis Cache (in-memory, sub-1ms)

**Strategy:** Cache recent messages + user metadata
- **Hit rate target**: 85% (recent messages are most accessed)
- **TTL**: 1 hour for messages, 10 min for presence

### Mental Math: Cache Impact

**Without cache:**
- 112,500 read QPS → Database
- DB p99 = **150ms** (overloaded)

**With 85% cache hit:**
- Cache: 112,500 × 0.85 = 95,625 QPS (sub-1ms)
- DB: 112,500 × 0.15 = **16,875 QPS** (manageable!)
- DB p99 = **20ms** (healthy)

### Latency Improvement

- Before: 50ms API + 150ms DB = **200ms**
- After: 50ms API + 1ms cache = **51ms** (95% of requests)
- After (cache miss): 50ms API + 20ms DB = **70ms** (5% of requests)
- **p99 latency: ~70ms** ✅ Meets 500ms SLO!

### Trade-offs

✅ **Latency**: 200ms → 70ms (65% reduction!)
✅ **Throughput**: Offloads 85% of DB reads
⚠️ **Cost**: Redis cluster ~$400/mo
⚠️ **Consistency**: Eventual (1-10sec lag OK for chat)

### Next Step

Add Redis cache between API and Database!

*Calculation: Calculate database load reduction with 85% cache hit rate*
  - Total read QPS = 112,500
  - Cache hit rate = 85% = 0.85
  - 
  - Cache QPS = 112,500 × 0.85 = 95,625 QPS
  - Database QPS = 112,500 × (1 - 0.85)
  - = 112,500 × 0.15
  - = 16,875 QPS
  - 
  - Reduction = (112,500 - 16,875) ÷ 112,500
  - = 95,625 ÷ 112,500 = 85% reduction!
  - **Result:** **85% cache hit → 16,875 DB QPS (85% reduction)**

*Checkpoint: If we achieve 90% cache hit rate, what is the new database QPS?*
  - Correct Answer: 11250
  - Hint: DB QPS = Total × (1 - hit_rate)

**Step 4: Apply Consistency + Durability NFRs → Database Design**

## 🔄 NFR: Consistency (Causal) + 💾 Durability (RPO=0)

### Requirements

1. **Consistency**: Causal (read-your-writes)
   - Users see their own messages immediately
   - Others' messages may lag slightly (eventual)

2. **Durability**: RPO = 0 (zero data loss)
   - Sync replication to 3 replicas before ACK
   - Daily backups to S3

### Architectural Decision

**Primary Database:** PostgreSQL with WAL (Write-Ahead Logging)
- Strong consistency for writes
- Sync replication to replicas (fsync enabled)

**Read Replicas:** 3× for horizontal read scaling
- Async replication (eventual consistency OK)
- Geographic distribution for availability

### Mental Math: How Many Read Replicas?

**Database capacity:**
- Primary: 10k write QPS, 5k read QPS
- Replica: 20k read QPS each (read-optimized)

**Calculation:**
- Write QPS: 11,250 → **needs 2 primaries** (active-passive)
- Read QPS: 16,875 (after cache)
- Replicas needed: 16,875 ÷ 20,000 = **1 replica**
- Add N+1 redundancy: **3 replicas total**

### Storage Calculation

**Per-message size:** ~500 bytes (text + metadata)

**Storage per day:**
- Messages/day: 10M DAU × 25 = 250M messages
- Bytes/day: 250M × 500 bytes = 125 GB/day
- With RF=3: 125 × 3 = **375 GB/day**
- Per year: 375 × 365 = **137 TB/year**

### Cost Optimization

Keep hot data (30 days) in PostgreSQL: 375 GB × 30 = **11 TB**
Archive to S3 (cold storage): Rest of data at $0.023/GB/mo

### Trade-offs

✅ **Durability**: RF=3 + backups = 99.999999% durability
✅ **Consistency**: Read-your-writes guaranteed
✅ **Throughput**: Replicas handle read load
⚠️ **Latency**: Sync replication adds 5-10ms to writes
⚠️ **Cost**: PostgreSQL HA ~$1,500/mo + S3 ~$300/mo

### Next Step

Add primary database and read replicas!

*Calculation: Calculate storage needed for 30 days of hot data with RF=3*
  - Messages per day = 10M DAU × 25 msgs = 250M msgs
  - Bytes per day = 250M × 500 bytes = 125 GB/day
  - 
  - Hot data (30 days) = 125 GB × 30 = 3,750 GB
  - With RF=3 replication = 3,750 × 3 = 11,250 GB
  - 
  - Cold archive per year = 125 GB × 365 = 45,625 GB
  - Minus hot data = 45,625 - 3,750 = 41,875 GB to S3
  - **Result:** **11.25 TB hot (PostgreSQL) + 41.8 TB/year cold (S3)**

*Checkpoint: If message size doubles to 1KB, what is storage per day with RF=3?*
  - Correct Answer: 750
  - Hint: 250M msgs × 1KB × RF=3 = ? GB

**Step 5: Apply Latency NFR → Real-Time Delivery**

## ⚡ NFR: Real-Time Message Delivery

### Problem

Messages are stored in DB, but how do recipients get notified **instantly**?

**Polling approach (BAD):**
- Client polls every 1 second: "Any new messages?"
- Adds 500-1000ms delay (bad UX)
- Wasteful: 10M users × 1 QPS = 10M QPS!

### Architectural Decision

**Component:** WebSocket connections + Message Queue

**Pattern:** Publish-Subscribe with persistent connections

1. User connects → opens WebSocket to WS server
2. Message arrives → published to queue topic (user_id)
3. WS server subscribed to queue → pushes to recipient
4. Sub-100ms delivery!

### Mental Math: WebSocket Server Capacity

**Concurrent connections:**
- 10M DAU × 0.3 (30% online) = **3M concurrent users**
- Commodity server: **50k concurrent connections**
- Servers needed: 3M ÷ 50k = **60 WS servers**

**Fanout workers:**
- Process 7,500 write QPS (from Step 1)
- Publish messages to queue topics
- Worker capacity: 10k msgs/sec each
- Workers needed: 7,500 ÷ 10,000 = **1 worker** (add N+1 = 3)

### Queue Sizing (Kafka)

**Partitions:**
- 7,500 msgs/sec = 450k msgs/min
- Target: 100k msgs/min per partition
- Partitions: 450k ÷ 100k = **5 partitions**

### Trade-offs

✅ **Latency**: Sub-100ms delivery (vs 500-1000ms polling)
✅ **Throughput**: Handles 3M concurrent connections
⚠️ **Cost**: 60 WS servers ~$6,000/mo, Kafka ~$500/mo
⚠️ **Complexity**: Pub/sub requires queue management

### Cost Comparison

- **Polling**: 10M QPS! (~1,000 servers at $100k/mo) ❌
- **WebSockets**: 3M connections (60 servers at $6k/mo) ✅

**Savings: $94,000/month!**

### Next Step

Add WebSocket servers and message queue!

*Calculation: Calculate WebSocket servers needed for 3M concurrent connections*
  - DAU = 10,000,000
  - Online ratio = 30% = 0.30
  - Concurrent users = 10M × 0.30 = 3,000,000
  - 
  - Server capacity = 50,000 connections
  - Servers needed = 3,000,000 ÷ 50,000
  - = 60 servers
  - 
  - With 1.5× headroom = 60 × 1.5 = 90 servers
  - **Result:** **60 WebSocket servers (90 with headroom) | $9k/mo**

*Checkpoint: If 50% of users are online simultaneously, how many WS servers?*
  - Correct Answer: 100
  - Hint: Concurrent = DAU × online_ratio ÷ capacity

**Step 6: Apply Availability NFR → Multi-AZ Deployment**

## 🛡️ NFR: Availability (99.95% = 22 min downtime/month)

### Current Architecture Issues

**Single Points of Failure (SPOFs):**
- Primary database (if fails, writes stop)
- Load balancer (if fails, traffic stops)
- Kafka queue (if broker fails, messages delayed)

### Architectural Decision

**Multi-AZ (Availability Zone) Deployment:**
1. Spread instances across 3 AZs
2. Active-passive DB primary
3. LB redundancy (2 active)
4. Kafka replication factor = 3

### Mental Math: Availability Calculation

**Serial availability** (components in series):
- LB: 99.99%
- API: 99.95%
- Cache: 99.9%
- DB: 99.95%

**Overall = 0.9999 × 0.9995 × 0.999 × 0.9995**
= **99.79%** (21 hours downtime/year) ❌ Misses 99.95% SLO!

### Solution: Graceful Degradation

**Pattern:** Circuit breakers + fallbacks

1. **Cache fails** → Read from DB directly (slower but works)
2. **DB replica fails** → Route to other replicas
3. **WS server fails** → Client reconnects to another

**With fallbacks:**
- Cache + DB in parallel: max(99.9%, 99.95%) ≈ 99.95%
- N+1 redundancy: (1 - (1-0.9995)²) ≈ 99.999%

**New overall:** 99.97% ✅ Meets SLO!

### Multi-AZ Layout

**Zone A:**
- 20 API instances
- 20 WS servers
- 1 read replica

**Zone B:**
- 15 API instances (can handle Zone A failure)
- 20 WS servers
- 1 read replica
- Primary DB (active)

**Zone C:**
- 15 API instances
- 20 WS servers
- 1 read replica
- Primary DB (standby)

### Trade-offs

✅ **Availability**: 99.97% (exceeds 99.95% SLO)
✅ **Durability**: AZ failure doesn't lose data
⚠️ **Cost**: 3× infrastructure spread = +50% cost
⚠️ **Latency**: Cross-AZ adds 1-5ms (acceptable)

### Cost Impact

**Single-AZ estimate:** $15,000/mo
**Multi-AZ (3 zones):** $22,500/mo (+$7,500)

**ROI:** 22 min downtime/mo → 13 min downtime/mo

*Calculation: Calculate availability with 2 DB primaries (active-passive)*
  - Single primary availability = 99.95% = 0.9995
  - Failure rate = 1 - 0.9995 = 0.0005
  - 
  - Both primaries fail (independent):
  - P(both fail) = 0.0005 × 0.0005 = 0.00000025
  - 
  - Availability with failover = 1 - 0.00000025
  - = 0.99999975 = 99.9998%
  - **Result:** **Active-passive failover: 99.95% → 99.9998%**

*Checkpoint: If 3 components in series each have 99.9% availability, what is overall?*
  - Correct Answer: 99.7
  - Hint: 0.999 × 0.999 × 0.999 = ?

**Step 7: Review All NFRs & Trade-offs**

## 🎯 Final Architecture Review: All 6 NFRs Applied!

### NFR Checklist

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| 📈 **Throughput** | 11.2k write, 112k read QPS | 12k write, 115k read | ✅ Met |
| ⚡ **Latency** | p99 < 500ms | p99 ≈ 70ms | ✅ Exceeded! |
| 🛡️ **Availability** | 99.95% | 99.97% | ✅ Exceeded! |
| 🔄 **Consistency** | Causal (read-your-writes) | Causal + replicas | ✅ Met |
| 💾 **Durability** | RPO = 0 | RF=3 + backups | ✅ Met |
| 💰 **Cost** | Minimize | $22.5k/mo | ✅ Optimized |

### Final Architecture Components

**Frontend Tier:**
- Load Balancer (2 instances, multi-AZ)
- 35 API servers (12 write, 23 read)
- 60 WebSocket servers (3M concurrent connections)

**Caching Tier:**
- Redis cluster (85% hit rate)
- Reduces DB load by 85%

**Database Tier:**
- PostgreSQL primary (active-passive HA)
- 3 read replicas (geographic distribution)
- 11 TB hot data (30 days)

**Messaging Tier:**
- 3 fanout workers
- Kafka (5 partitions, RF=3)
- Sub-100ms message delivery

**Storage Tier:**
- S3 cold archive (42 TB/year)
- Daily backups

### Cost Breakdown

| Component | Count | $/mo per unit | Total |
|-----------|-------|---------------|-------|
| API servers | 35 | $100 | $3,500 |
| WebSocket servers | 60 | $100 | $6,000 |
| Redis cluster | 1 | $400 | $400 |
| PostgreSQL HA | 1 | $1,500 | $1,500 |
| Read replicas | 3 | $500 | $1,500 |
| Kafka cluster | 1 | $500 | $500 |
| Workers | 3 | $100 | $300 |
| S3 storage | 42TB/yr | $25/TB/mo | $1,050 |
| Load balancers | 2 | $100 | $200 |
| Monitoring | 1 | $300 | $300 |
| Multi-AZ overhead | - | - | $7,250 |
| **Total** | - | - | **$22,500/mo** |

### Key Trade-offs Made

**1. Latency vs Cost**
- Chose: Sub-70ms p99 latency
- Cost: +$400/mo for Redis
- Saved: $1,200/mo in DB costs
- **Net: +$800/mo for 65% latency reduction** ✅

**2. Availability vs Cost**
- Chose: 99.97% (Multi-AZ)
- Cost: +$7,500/mo
- Benefit: 21h → 13h downtime/year
- **ROI: $937/hour of uptime** ✅

**3. Consistency vs Throughput**
- Chose: Causal (not strong)
- Benefit: 10× higher throughput
- Trade-off: 1-10sec lag acceptable for chat
- **User impact: Minimal** ✅

**4. Durability vs Latency**
- Chose: RF=3 sync writes
- Cost: +5-10ms write latency
- Benefit: Zero data loss (RPO=0)
- **Worth it: Messages are precious** ✅

### Alternative Approaches Considered

**❌ Strong Consistency Everywhere**
- Would reduce throughput by 90%
- Would increase costs by 10×
- Unnecessary for chat (causal is enough)

**❌ Single-AZ Deployment**
- Saves $7,500/mo
- Violates 99.95% SLA (only achieves 99.79%)
- Unacceptable for real-time product

**❌ Polling Instead of WebSockets**
- Would cost $100k/mo (16× more expensive!)
- 1000ms latency vs 100ms
- Terrible UX

### What You Learned

1. **NFRs drive architecture** - Each component chosen for specific NFR
2. **Trade-offs are inevitable** - No perfect solution, only informed choices
3. **Mental math is powerful** - Quick calculations guide big decisions
4. **Cost vs Performance balance** - Optimize for user needs, not perfection
5. **Availability compounds** - Serial components lose nines fast

### Next Steps

1. Practice these calculations until automatic
2. Study trade-offs for different system types
3. Try the Photo Sharing walkthrough next!

🎉 **Congratulations! You've designed a production-ready chat system by systematically applying all 6 NFRs!**

*Calculation: Calculate total monthly cost and cost per DAU*
  - Total monthly cost = $22,500
  - DAU = 10,000,000 users
  - 
  - Cost per user per month = $22,500 ÷ 10,000,000
  - = $0.00225 per user
  - = 0.225 cents per user
  - 
  - Cost per message = $22,500 ÷ (250M msgs)
  - = $0.00009 per message
  - = 0.009 cents per message
  - **Result:** **$0.00225/user/month | $0.00009/message**

*Checkpoint: If user base 10× to 100M DAU, estimate new monthly cost (assume linear scaling)?*
  - Correct Answer: 225000
  - Hint: Infrastructure scales linearly with user count

# 🎓 Tutorial Complete!

You've successfully designed a real-time chat system by systematically applying all 6 NFRs:

✅ **Throughput** - Sized API and WS servers for 112k QPS
✅ **Latency** - Achieved p99 < 70ms with caching
✅ **Availability** - 99.97% with multi-AZ deployment
✅ **Consistency** - Causal consistency for great UX
✅ **Durability** - RF=3 + backups for zero data loss
✅ **Cost** - Optimized at $22.5k/mo ($0.002/user)

## Key Takeaways

1. **NFRs are quantifiable** - "Fast" becomes "p99 < 100ms"
2. **Architecture follows NFRs** - Each component chosen for specific NFR
3. **Trade-offs are explicit** - +$400 Redis for 65% latency reduction
4. **Mental math is your friend** - 86,400 → 100k makes calculations fast
5. **Document your reasoning** - Explain WHY you made each choice

## What's Next?

- Try **Photo Sharing Walkthrough** (different NFR priorities)
- Practice more BoE problems in Bootcamp mode
- Study real system design case studies
- Review NFR trade-offs reference

Remember: In interviews, showing your **thought process and trade-off analysis** is more important than the "perfect" solution!

Happy designing! 🚀

---
