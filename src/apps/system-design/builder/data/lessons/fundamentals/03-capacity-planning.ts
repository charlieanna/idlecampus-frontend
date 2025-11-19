import type { SystemDesignLesson } from '../../../types/lesson';

export const capacityPlanningLesson: SystemDesignLesson = {
  id: 'sd-capacity-planning',
  slug: 'understanding-scale',
  title: 'Understanding Scale',
  description: 'Learn how to estimate capacity requirements, understand RPS, latency, and throughput',
  difficulty: 'beginner',
  estimatedMinutes: 25,
  category: 'fundamentals',
  tags: ['capacity', 'scaling', 'metrics', 'rps'],
  prerequisites: ['basic-components'],
  learningObjectives: [
    'Understand RPS, latency, and throughput',
    'Learn to estimate capacity requirements',
    'Calculate infrastructure needs',
    'Understand trade-offs in capacity planning',
  ],
  conceptsCovered: [
    {
      id: 'rps',
      name: 'Requests Per Second',
      type: 'metric',
      difficulty: 1,
      description: 'Number of requests a system handles per second',
    },
    {
      id: 'latency',
      name: 'Latency',
      type: 'metric',
      difficulty: 2,
      description: 'Time for a request to complete',
    },
    {
      id: 'throughput',
      name: 'Throughput',
      type: 'metric',
      difficulty: 2,
      description: 'Total data processed per unit time',
    },
  ],
  relatedChallenges: ['tiny-url', 'food-blog'],
  stages: [
    {
      id: 'scale-rps',
      type: 'concept',
      title: 'Requests Per Second (RPS)',
      description: 'Understanding RPS',
      estimatedMinutes: 8,
      content: {
        markdown: `# Requests Per Second (RPS)

**RPS** measures how many requests your system handles per second.

## Why RPS Matters

- **Capacity planning**: How many servers do you need?
- **Load testing**: Can your system handle peak traffic?
- **Cost estimation**: More RPS = more infrastructure = more cost

## Calculating RPS

### Example: URL Shortener

**Assumptions:**
- 100 million URLs created per day
- 10 billion redirects per day (100:1 read-to-write ratio)
- Peak traffic is 2x average

**Calculations:**
- Writes: 100M / 86400 seconds = ~1,200 writes/second
- Reads: 10B / 86400 seconds = ~115,000 reads/second
- **Peak writes**: 1,200 × 2 = **2,400 writes/second**
- **Peak reads**: 115,000 × 2 = **230,000 reads/second**

## Read vs Write RPS

- **Read RPS**: How many read requests per second
- **Write RPS**: How many write requests per second
- **Total RPS**: Read RPS + Write RPS

Different components handle different types:
- **Database**: Handles both reads and writes
- **Cache**: Primarily reads (cache hits)
- **CDN**: Primarily reads (static content)

## Real-World Examples

- **Small app**: 10-100 RPS
- **Medium app**: 1,000-10,000 RPS
- **Large app**: 100,000+ RPS
- **Google**: Millions of RPS

## Planning for RPS

1. **Estimate average RPS** from user base
2. **Calculate peak RPS** (usually 2-5x average)
3. **Add headroom** (20-50% buffer)
4. **Design for peak** to avoid failures`,
      },
      keyPoints: [
        'RPS measures request volume',
        'Separate read and write RPS for capacity planning',
        'Design for peak traffic, not average',
      ],
    },
    {
      id: 'scale-latency',
      type: 'concept',
      title: 'Latency',
      description: 'Understanding latency',
      estimatedMinutes: 7,
      content: {
        markdown: `# Latency

**Latency** is the time it takes for a request to complete.

## Why Latency Matters

- **User experience**: Slow = frustrated users
- **Business impact**: 100ms delay = 1% sales drop (Amazon study)
- **System health**: High latency = overloaded system

## Measuring Latency

- **p50 (median)**: Half of requests faster, half slower
- **p95**: 95% of requests are faster
- **p99**: 99% of requests are faster (worst-case)

**Example:**
- p50: 50ms (typical user experience)
- p95: 200ms (most users)
- p99: 500ms (worst-case, but still acceptable)

## Latency Sources

1. **Network**: 10-100ms (depends on distance)
2. **Application processing**: 10-50ms
3. **Database query**: 5-100ms (depends on query complexity)
4. **Cache lookup**: 1-5ms (very fast!)

**Total latency** = sum of all sources

## Latency Requirements

- **Real-time chat**: < 100ms
- **Web page load**: < 1 second
- **API response**: < 200ms (p95)
- **Search results**: < 500ms
- **Background jobs**: Can be slower

## Reducing Latency

- **Caching**: Store frequently accessed data
- **CDN**: Serve static content from edge locations
- **Database optimization**: Indexes, query optimization
- **Connection pooling**: Reuse database connections
- **Async processing**: Don't block on non-critical operations`,
      },
      keyPoints: [
        'Latency directly impacts user experience',
        'Measure p50, p95, p99 for different perspectives',
        'Caching and CDNs significantly reduce latency',
      ],
    },
    {
      id: 'scale-throughput',
      type: 'concept',
      title: 'Throughput',
      description: 'Understanding throughput',
      estimatedMinutes: 5,
      content: {
        markdown: `# Throughput

**Throughput** measures total data processed per unit time.

## Throughput vs RPS

- **RPS**: Number of requests (count)
- **Throughput**: Amount of data (bytes/second)

**Example:**
- 1000 RPS × 1KB per request = 1MB/second throughput
- 100 RPS × 10KB per request = 1MB/second throughput

Same throughput, different RPS!

## When Throughput Matters

- **Video streaming**: High throughput (MB/s per user)
- **File uploads**: Throughput limited by bandwidth
- **Data processing**: Batch jobs process large datasets
- **CDN/S3**: Bandwidth costs based on throughput

## Calculating Throughput

**Formula:**
\`\`\`
Throughput = RPS × Average Response Size
\`\`\`

**Example:**
- 10,000 RPS
- Average response: 50KB
- **Throughput**: 10,000 × 50KB = 500MB/second = 4Gbps

## Bandwidth Considerations

- **Client bandwidth**: Users have limited upload/download
- **Server bandwidth**: Must handle aggregate throughput
- **CDN bandwidth**: Distributes load across edge locations
- **Database bandwidth**: Usually not a bottleneck (local network)

## Cost Impact

- **CDN costs**: Based on data transfer (throughput)
- **S3 costs**: Based on data transfer out
- **Bandwidth costs**: Can be significant at scale`,
      },
      keyPoints: [
        'Throughput measures data volume, not request count',
        'Important for media-heavy applications',
        'Bandwidth costs scale with throughput',
      ],
    },
    {
      id: 'scale-capacity',
      type: 'concept',
      title: 'Capacity Planning',
      description: 'How to plan capacity',
      estimatedMinutes: 5,
      content: {
        markdown: `# Capacity Planning

**Capacity planning** is estimating infrastructure needs to handle expected load.

## Steps for Capacity Planning

### 1. Estimate Traffic

- **Daily active users**: How many users?
- **Requests per user**: How many requests per user per day?
- **Peak factor**: 2-5x average (traffic spikes)

**Example:**
- 1M daily active users
- 10 requests per user per day
- Peak factor: 3x

**Calculation:**
- Average: 1M × 10 / 86400 = ~116 RPS
- Peak: 116 × 3 = **348 RPS**

### 2. Calculate Component Capacity

**App Servers:**
- Each instance: 1000 RPS (commodity hardware)
- Required: 348 / 1000 = **1 instance** (round up)
- With 50% headroom: **2 instances**

**Database:**
- Read capacity: 348 RPS × 0.9 (90% reads) = 313 read RPS
- Write capacity: 348 RPS × 0.1 (10% writes) = 35 write RPS
- Single-leader: 3000 read, 300 write RPS capacity
- **Sufficient with 1 database**

### 3. Add Redundancy

- **Minimum 2 instances** for high availability
- If one fails, other handles traffic
- **2 app servers, 1 database** (with replication for HA)

### 4. Plan for Growth

- **2-3x headroom** for traffic growth
- **Horizontal scaling** ready (add more instances)
- **Monitor** actual usage and adjust

## Common Mistakes

❌ **Under-provisioning**: Too few resources = failures
❌ **Over-provisioning**: Too many resources = wasted cost
❌ **Ignoring peak**: Designing for average, not peak
❌ **No headroom**: No buffer for traffic spikes

✅ **Right-sizing**: Match capacity to actual needs
✅ **Monitor and adjust**: Start small, scale up
✅ **Design for peak**: Handle worst-case scenarios`,
      },
      keyPoints: [
        'Estimate traffic, calculate capacity, add redundancy',
        'Design for peak traffic, not average',
        'Start small and scale up based on actual usage',
      ],
    },
    {
      id: 'scale-practice',
      type: 'practice',
      title: 'Practice: Calculate Capacity',
      description: 'Calculate capacity for a scenario',
      estimatedMinutes: 5,
      problem: `## Scenario: Social Media Feed

A social media platform has:
- 10 million daily active users
- Each user views 50 posts per day (reads)
- Each user creates 2 posts per day (writes)
- Peak traffic is 4x average

**Questions:**
1. What is the average read RPS?
2. What is the average write RPS?
3. What is the peak read RPS?
4. How many app server instances are needed? (Assume 1000 RPS per instance)
5. How many database replicas are needed? (Assume 3000 read RPS per replica, 300 write RPS per leader)

**Hints:**
- Calculate daily requests first
- Divide by seconds per day (86400)
- Multiply by peak factor
- Divide by capacity per instance/replica`,
      validation: {
        type: 'free_form',
        checker: 'capacity_calculator',
      },
      hints: [
        'Start by calculating total daily reads and writes',
        'Convert to RPS by dividing by 86400 seconds',
        'Multiply by peak factor (4x)',
        'Divide by capacity per component',
      ],
    },
  ],
  nextLessons: ['caching-strategies'],
};

