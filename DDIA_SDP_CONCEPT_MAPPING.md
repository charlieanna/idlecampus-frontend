# DDIA & System Design Primer Concept Mapping
## Distribution Across 54 Real-World Problems

This document maps ALL DDIA chapters and System Design Primer concepts to existing problems.
Each problem focuses on **2-4 specific concepts** for deep, focused learning.

---

## DDIA Chapter Coverage Map

### ✅ Already Enhanced (6 problems)

1. **Instagram** - Ch. 5 (Replication), Ch. 6 (Partitioning), Ch. 9 (Consistency), SDP: CDN, Caching
2. **Twitter** - Ch. 1 (Fan-out), Ch. 5 (Replication), Ch. 6 (Partitioning), Ch. 9 (Consistency)
3. **Netflix** - Ch. 5 (Replication), Ch. 6 (Partitioning), Ch. 8 (Dist Systems), Ch. 11 (Stream), SDP: CDN
4. **Uber** - Ch. 6 (Geo-partitioning), Ch. 9 (Consistency), Ch. 11 (Stream), SDP: Geospatial
5. **YouTube** - Ch. 5 (Replication), Ch. 10 (Batch), Ch. 11 (Stream), SDP: CDN, Encoding
6. **WhatsApp** - Ch. 7 (Transactions), Ch. 9 (Causal Consistency), Ch. 11 (Stream), SDP: WebSocket

---

## DDIA Ch. 2: Data Models & Query Languages (8 problems)

### SQL-focused (Relational Models)
7. **Airbnb** - SQL schema design, complex joins, indexing strategies
8. **Booking.com** - Relational integrity, foreign keys, ACID transactions
9. **StackOverflow** - Relational queries, indexing for votes/answers
10. **LinkedIn** - Graph-like queries in SQL, connection networks

### NoSQL-focused (Document/Key-Value/Graph)
11. **Amazon** - DynamoDB (key-value), shopping cart design
12. **Stripe** - Event sourcing with document store
13. **GitHub** - Graph database for repo relationships, commits
14. **Notion** - Document database for hierarchical content

---

## DDIA Ch. 3: Storage & Retrieval (6 problems)

### B-trees vs LSM-trees
15. **Dropbox** - LSM-trees for write-heavy file metadata
16. **Google Drive** - B-trees for read-heavy file access
17. **Pastebin** - Write-optimized storage (LSM)
18. **Medium** - Read-optimized storage (B-tree indexes)

### Indexing Strategies
19. **Yelp** - Geospatial indexes, composite indexes
20. **Reddit** - Secondary indexes for voting, sorting

---

## DDIA Ch. 4: Encoding & Evolution (5 problems)

### Protocol Buffers / Avro
21. **Google Calendar** - Protocol Buffers for event sync
22. **Dropbox** - Avro for file sync protocol
23. **Slack** - Message encoding, backward compatibility

### JSON vs Binary
24. **Discord** - Binary encoding for real-time messages
25. **Telegram** - MTProto (custom binary protocol)

---

## DDIA Ch. 5: Replication (Already covered in 6 problems)
- Instagram, Twitter, Netflix, Uber, YouTube, WhatsApp ✅

### Additional Replication Patterns
26. **Spotify** - Multi-leader replication (offline mode)
27. **TikTok** - Leaderless replication (Cassandra-style)

---

## DDIA Ch. 6: Partitioning (Already covered in 6 problems)
- Instagram, Twitter, Netflix, Uber, YouTube, WhatsApp ✅

### Additional Partitioning Patterns
28. **Facebook** - Hash partitioning by user_id
29. **Pinterest** - Range partitioning by board_id

---

## DDIA Ch. 7: Transactions (6 problems)

### ACID Transactions
30. **Stripe** - Payment processing, two-phase commit
31. **Amazon** - Inventory management, lost updates
32. **Booking.com** - Hotel reservations, write skew
33. **Ticketmaster** - Ticket sales, serializable isolation

### Distributed Transactions
34. **Shopify** - Order processing across services
35. **Instacart** - Cart checkout, atomicity

---

## DDIA Ch. 8: Distributed Systems (5 problems)

### Network Partitions & Fault Tolerance
36. **Zoom** - Network partition handling, split-brain
37. **Messenger** - Message delivery guarantees
38. **Twitch** - Live streaming resilience

### Unreliable Networks
39. **DoorDash** - GPS/location unreliability
40. **WeatherAPI** - Sensor data, timeouts

---

## DDIA Ch. 9: Consistency & Consensus (Already covered in 4 problems)
- Instagram, Twitter, Uber, WhatsApp ✅

### Additional Consistency Models
41. **Snapchat** - Eventual consistency for stories
42. **Steam** - Strong consistency for purchases
43. **Hulu** - Session consistency for watch progress

---

## DDIA Ch. 10: Batch Processing (4 problems)

### MapReduce / Hadoop
44. **Netflix** - Already covered ✅ (video transcoding)
45. **YouTube** - Already covered ✅ (encoding)
46. **Spotify** - Music recommendations, batch ML
47. **TikTok** - Video processing pipeline

---

## DDIA Ch. 11: Stream Processing (Already covered in 5 problems)
- Netflix, Uber, YouTube, WhatsApp ✅

### Additional Stream Processing
48. **Twitter** - Already covered ✅ (fan-out)
49. **Twitch** - Real-time chat, view counts
50. **DoorDash** - Real-time driver tracking

---

## DDIA Ch. 12: Future of Data Systems (3 problems)

### Derived Data & Data Integration
51. **LinkedIn** - Profile aggregation from multiple sources
52. **Amazon** - Product search indexing
53. **Notion** - CQRS (Command Query Responsibility Segregation)

---

## System Design Primer Concepts

### Already Covered
- **CDN**: Netflix ✅, Instagram ✅, YouTube ✅
- **Caching**: All 6 enhanced ✅
- **Load Balancing**: All 6 enhanced ✅
- **WebSocket**: WhatsApp ✅, Uber ✅
- **Geospatial**: Uber ✅

### Additional SDP Concepts to Cover

#### API Gateway & Rate Limiting
54. **Slack** - API gateway, rate limiting per workspace
55. **GitHub** - REST API rate limiting, GraphQL
56. **Stripe** - API versioning, idempotency keys

#### Reverse Proxy
57. **Nginx/Cloudflare** - Use `gatewayProblems.ts`

#### Database Indexing (Deep Dive)
58. **StackOverflow** - Composite indexes, query optimization
59. **Reddit** - Vote indexing, sorting strategies

#### Message Queues (Deep Dive)
60. **basicMessageQueue.ts** - Kafka vs RabbitMQ vs SQS

#### Search Systems
61. **searchProblems.ts** - Elasticsearch, full-text search

#### Caching Strategies (Deep Dive)
62. **cachingProblems.ts** - Cache-aside, write-through, write-back
63. **cachingProblemsExtended.ts** - Cache invalidation patterns

#### Multi-Region (Deep Dive)
64. **multiregionProblems.ts** - Active-active, active-passive

#### Storage Systems (Deep Dive)
65. **storageProblems.ts** - Object storage, block storage, file storage

#### Streaming Systems (Deep Dive)
66. **streamingProblems.ts** - Video streaming protocols

---

## Learning Path Progression

### Beginner (10 problems) - Basic Concepts
1. TinyURL - Basic system design
2. Pastebin - Simple storage
3. Static Content CDN - CDN basics
4. Weather API - Simple API design
5. Basic Database Design - SQL fundamentals
6. Basic Message Queue - Queue basics
7. Tutorial: Simple Blog - CRUD operations
8. Tutorial: Image Hosting - File uploads
9. Tutorial: Realtime Chat - WebSocket basics
10. Google Calendar - Event management

### Intermediate (25 problems) - Real-World Systems
11-35. Most real-world apps (Instagram, Twitter, Uber, etc.)

### Advanced (19 problems) - Complex Distributed Systems
36-54. Distributed systems, consensus, multi-region, advanced patterns

---

## Implementation Plan

### Phase 1 (Next): DDIA Ch. 2-4 (Data Models, Storage, Encoding)
- Enhance 13 problems: Airbnb, Booking.com, Amazon, Stripe, GitHub, Dropbox, Google Drive, Yelp, Reddit, etc.

### Phase 2: DDIA Ch. 7-8 (Transactions, Distributed Systems)
- Enhance 11 problems: Stripe, Amazon, Booking.com, Zoom, Messenger, etc.

### Phase 3: DDIA Ch. 9-12 (Consistency, Batch, Future)
- Enhance remaining problems

### Phase 4: SDP Deep Dives
- Enhance specialized problem files (gateway, caching, storage, etc.)

---

## Total Coverage
- **54 problems** covering **ALL 12 DDIA chapters** + **ALL SDP concepts**
- Each problem: **2-4 focused concepts**
- Progressive difficulty: Beginner → Intermediate → Advanced
- Actionable: All concepts configurable in UI (DB choice, replication, partitioning, caching, etc.)
