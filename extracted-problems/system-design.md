# SYSTEM-DESIGN Problems

Total Problems: 4

---

## 1. TinyURL - URL Shortening Service

**Difficulty:** medium
**Concept:** system-design

### Description

Design a URL shortening service that handles 1M redirects/sec

### Examples

**Example 1:**
- Input: https://www.example.com/very/long/url/path
- Output: https://tinyurl.com/abc123
- Explanation: Long URL is shortened to a compact identifier

### Constraints

- Handle 1M redirects per second
- Support 50K URL creations per second
- URLs should be as short as possible
- System should be highly available

### Hints

1. Consider using a hash function to generate short codes
2. Use a database to store URL mappings
3. Implement caching for frequently accessed URLs
4. Consider load balancing for high traffic

### Complexity Analysis

- **Time Complexity:** O(1) for both create and redirect operations
- **Space Complexity:** O(n) where n is the number of URLs stored

---

## 2. Rate Limiter

**Difficulty:** medium
**Concept:** system-design

### Description

Design a rate limiting system to control API usage

### Examples

**Example 1:**
- Input: API calls from user
- Output: Allow/Deny based on rate limit
- Explanation: System tracks and limits requests per user

### Constraints

- Support different rate limits per user
- Handle distributed systems
- Minimize memory usage
- Provide accurate rate limiting

### Hints

1. Consider sliding window algorithms
2. Use Redis for distributed rate limiting
3. Implement token bucket or leaky bucket algorithms
4. Cache rate limit data for performance

### Complexity Analysis

- **Time Complexity:** O(1) for rate limit checks
- **Space Complexity:** O(n) where n is the number of active users

---

## 3. Real-time Chat System

**Difficulty:** hard
**Concept:** system-design

### Description

Design a real-time chat system supporting millions of users

### Examples

**Example 1:**
- Input: User sends message
- Output: Message delivered to all chat participants
- Explanation: Real-time message delivery with persistence

### Constraints

- Support millions of concurrent users
- Real-time message delivery
- Message persistence and history
- Support group chats and private messages

### Hints

1. Use WebSockets for real-time communication
2. Implement message queuing for reliability
3. Use horizontal scaling for user connections
4. Consider message sharding strategies

### Complexity Analysis

- **Time Complexity:** O(1) for message delivery
- **Space Complexity:** O(n) where n is the number of messages

---

## 4. Data Ingestion Pipeline

**Difficulty:** hard
**Concept:** system-design

### Description

Design a system to ingest and process large volumes of data

### Examples

**Example 1:**
- Input: Stream of data events
- Output: Processed and stored data
- Explanation: High-throughput data processing pipeline

### Constraints

- Handle millions of events per second
- Ensure data durability
- Support real-time and batch processing
- Maintain data consistency

### Hints

1. Use message queues for buffering
2. Implement data partitioning strategies
3. Consider stream processing frameworks
4. Design for fault tolerance

### Complexity Analysis

- **Time Complexity:** O(1) per event processing
- **Space Complexity:** O(n) where n is the data volume

---
