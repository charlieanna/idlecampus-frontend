# Trade-Off Framework for System Design Lessons

## 🎯 Core Principle
**Trade-offs are the #1 priority in system design education.**

Students must learn **WHEN** to choose technology X over Y, **WHY** one pattern is better than another in specific scenarios, and **WHAT** you give up when making each choice.

---

## Trade-Off Framework Template

Every lesson must include these 5 trade-off components:

### 1. Critical Decision Sections
Format: "🎯 Critical Decision: When to Use X vs Y"

```typescript
<H2>🎯 Critical Decision: Redis vs Kafka for Queues</H2>

<ComparisonTable
  headers={['Factor', 'Redis List/Pub-Sub', 'Kafka', 'Winner']}
  rows={[
    ['Latency', '<10ms', '5-50ms', 'Redis'],
    ['Throughput', '100k msg/sec', '1M+ msg/sec', 'Kafka'],
    ['Durability', 'Optional (AOF)', 'Always durable', 'Kafka'],
    ['Replay events', 'No (consumed = gone)', 'Yes (retain 7+ days)', 'Kafka'],
    ['Multiple consumers', 'Hard (pub/sub only)', 'Easy (consumer groups)', 'Kafka'],
    ['Setup complexity', 'Low (single instance)', 'High (ZooKeeper + brokers)', 'Redis'],
    ['Cost', '$50-200/mo', '$500-2000/mo', 'Redis']
  ]}
/>

<H3>Decision Tree:</H3>
<CodeBlock>
{`
Do you need to replay events (analytics, debugging)?
├─ YES → Use Kafka
│   └─ Examples: User activity stream, transaction logs
│
└─ NO → Do you need <10ms latency?
    ├─ YES → Use Redis
    │   └─ Examples: Job queue, rate limiting, real-time notifications
    │
    └─ NO → Use Kafka anyway (better for scale)
        └─ Examples: Event-driven microservices
`}
</CodeBlock>

<KeyPoint>
  <Strong>Rule of thumb:</Strong>
  - Simple job queue, low latency → Redis List
  - Real-time notifications → Redis Pub/Sub
  - Event streaming, analytics, need replay → Kafka
  - Multiple consumers processing same events → Kafka
</KeyPoint>
```

### 2. Use When / Avoid When Tables
Every technology/pattern gets this treatment:

```typescript
<H2>Redis Cache: Use When / Avoid When</H2>

<ComparisonTable
  headers={['Use When', 'Avoid When', 'Why?']}
  rows={[
    [
      '• Data fits in memory (<100GB)\n• Need data structures (lists, sets)\n• Need pub/sub\n• Read-heavy workload',
      '• Data >1TB\n• Write-heavy (>50% writes)\n• Need multi-region replication\n• Limited budget',
      'Redis stores everything in RAM. Great for speed, expensive for large datasets.'
    ],
    [
      '• Need <10ms latency\n• Session storage\n• Real-time leaderboards',
      '• Need SQL queries\n• Need ACID transactions\n• Primary data store',
      'Redis is a cache, not a database. Don\'t use as primary storage.'
    ]
  ]}
/>
```

### 3. Cost vs Performance vs Complexity Matrix
Rate every option on 3 dimensions:

```typescript
<H2>Technology Comparison Matrix</H2>

<ComparisonTable
  headers={['Technology', 'Cost ($/mo @ 10k RPS)', 'Performance (latency)', 'Complexity (1-10)', 'Best For']}
  rows={[
    ['Redis', '$100-300', '1-2ms', '3/10', 'Cache, session, simple queues'],
    ['Memcached', '$50-150', '1-2ms', '2/10', 'Simple key-value cache only'],
    ['Kafka', '$500-2000', '5-50ms', '8/10', 'Event streaming, analytics'],
    ['RabbitMQ', '$200-800', '10-100ms', '6/10', 'Task queues, RPC'],
    ['PostgreSQL', '$100-500', '10-50ms', '5/10', 'Primary database, ACID'],
    ['DynamoDB', '$200-1000', '5-20ms', '4/10', 'NoSQL, auto-scaling']
  ]}
/>

<KeyPoint>
  <Strong>Trade-off analysis:</Strong>
  - Low complexity needed? → Memcached or Redis
  - Low cost needed? → Memcached or PostgreSQL
  - High performance needed? → Redis or DynamoDB
  - All three (cheap, fast, simple)? → Impossible! Pick 2.
</KeyPoint>
```

### 4. Trade-Off-Focused Exercises
Instead of "build X", ask "choose between X and Y":

```typescript
{
  id: 'tradeoff-exercise-queue',
  type: 'quiz',
  title: 'Trade-Off Exercise: Choose the Right Queue',
  estimatedMinutes: 5,
  questions: [
    {
      id: 'queue-choice-1',
      question: `**Scenario:** You're building a notification system that sends push notifications to mobile apps. Requirements:
- 10,000 notifications/second
- Must be fast (<50ms processing time)
- If notification fails, retry 3 times then discard
- Don't need to replay old notifications

**Which queue should you use?**`,
      options: [
        'Kafka (durable, can replay events)',
        'Redis List (simple, fast, ephemeral)',
        'RabbitMQ (message acknowledgment)',
        'SQS (managed, auto-scaling)'
      ],
      correctAnswer: 'Redis List (simple, fast, ephemeral)',
      explanation: `**Correct: Redis List**

**Why Redis wins:**
- ✅ Fast (<10ms latency, meets <50ms requirement)
- ✅ Simple to set up (no ZooKeeper, no brokers)
- ✅ Ephemeral data (don't need to replay notifications)
- ✅ Low cost ($100/mo vs $500+ for Kafka)

**Why NOT Kafka:**
- ❌ Overkill - you don't need event replay
- ❌ Higher latency (5-50ms just for queue)
- ❌ Complex setup (ZooKeeper + brokers)
- ❌ 5x more expensive

**Why NOT RabbitMQ:**
- ❌ Slower than Redis (10-100ms)
- ❌ More complex than needed

**Why NOT SQS:**
- ❌ Higher latency (can be 100ms+)
- ❌ External dependency (AWS only)

**Trade-off made:** Chose simplicity + speed over durability (acceptable because notifications can be discarded).`
    },
    {
      id: 'queue-choice-2',
      question: `**Scenario:** You're building an e-commerce analytics system. Requirements:
- Track every user click (100k events/sec)
- Multiple teams consume same events (fraud, analytics, ML)
- Need to replay last 30 days for debugging
- Latency not critical (500ms okay)

**Which queue should you use?**`,
      options: [
        'Redis Pub/Sub (fast, real-time)',
        'Kafka (durable, multiple consumers, replay)',
        'RabbitMQ (reliable delivery)',
        'Redis List (simple and cheap)'
      ],
      correctAnswer: 'Kafka (durable, multiple consumers, replay)',
      explanation: `**Correct: Kafka**

**Why Kafka wins:**
- ✅ Multiple consumers (fraud team, analytics team, ML team can all read same events)
- ✅ Event replay (can replay last 30 days for debugging)
- ✅ High throughput (handles 100k events/sec easily)
- ✅ Durable (events persist even if consumer crashes)

**Why NOT Redis Pub/Sub:**
- ❌ No replay - once consumed, event is gone
- ❌ No durability - if consumer offline, loses events
- ❌ Hard to have multiple consumer groups

**Why NOT RabbitMQ:**
- ❌ Lower throughput than Kafka
- ❌ Replay is harder
- ❌ Not designed for event streaming

**Why NOT Redis List:**
- ❌ Only one consumer can pop each message
- ❌ No native replay mechanism

**Trade-off made:** Chose complexity + cost for durability + multi-consumer (necessary for analytics use case).`
    }
  ],
  keyPoints: [
    'Choose based on requirements, not what you know best',
    'Latency-critical + simple = Redis',
    'Multiple consumers + replay = Kafka',
    'Always analyze: cost vs performance vs complexity'
  ]
}
```

### 5. "When NOT to Use X" Anti-Pattern Sections
Every pattern needs failure modes:

```typescript
<H2>❌ When NOT to Use Cache-Aside</H2>

<Example title="Anti-Pattern 1: Caching Financial Data">
  <P><Strong>Wrong:</Strong> Using cache-aside for stock prices with 60s TTL</P>

  <P><Strong>Why it fails:</Strong></P>
  <UL>
    <LI>Stock prices change every millisecond</LI>
    <LI>User sees price of $100, clicks buy, actual price is $105</LI>
    <LI>Leads to incorrect trades, angry users, lawsuits</LI>
  </UL>

  <P><Strong>Right approach:</Strong></P>
  <UL>
    <LI>Use write-through cache (update cache + DB together)</LI>
    <LI>OR use event-based invalidation (invalidate on every price change)</LI>
    <LI>OR don't cache at all (read from DB with proper indexing)</LI>
  </UL>

  <CodeBlock>
{`// ❌ WRONG: Cache-aside for financial data
async function getStockPrice(symbol: string) {
  const cached = await redis.get(\`price:\${symbol}\`);
  if (cached) return cached; // Could be stale!

  const price = await db.getPrice(symbol);
  await redis.set(\`price:\${symbol}\`, price, 'EX', 60); // 60s TTL = DANGEROUS
  return price;
}

// ✅ RIGHT: Write-through for financial data
async function updateStockPrice(symbol: string, newPrice: number) {
  // Update cache + DB atomically
  await Promise.all([
    redis.set(\`price:\${symbol}\`, newPrice),
    db.updatePrice(symbol, newPrice)
  ]);
}

async function getStockPrice(symbol: string) {
  // Cache is always fresh (updated on every write)
  return redis.get(\`price:\${symbol}\`);
}`}
  </CodeBlock>
</Example>

<Example title="Anti-Pattern 2: Caching User-Specific Data Without Segmentation">
  <P><Strong>Wrong:</Strong> Caching homepage HTML for all users with same key</P>

  <P><Strong>Why it fails:</Strong></P>
  <UL>
    <LI>User A logs in, sees their personalized feed, cached</LI>
    <LI>User B logs in, gets User A's cached feed (privacy breach!)</LI>
  </UL>

  <P><Strong>Right approach:</Strong> Include user ID in cache key</P>

  <CodeBlock>
{`// ❌ WRONG: Same cache key for all users
const homepage = await redis.get('homepage'); // Everyone gets same data!

// ✅ RIGHT: User-specific cache key
const homepage = await redis.get(\`homepage:\${userId}\`); // Each user gets their data`}
  </CodeBlock>
</Example>

<KeyPoint>
  <Strong>When NOT to use cache-aside:</Strong>
  <UL>
    <LI>Financial/medical data where staleness is unacceptable</LI>
    <LI>Data changes more frequently than you read it (write-heavy)</LI>
    <LI>Data is already fast to fetch (don't cache 1ms queries)</LI>
    <LI>Cache invalidation is complex (many dependencies)</LI>
  </UL>
</KeyPoint>
```

---

## Implementation Checklist

For every lesson, ensure you have:

- [ ] At least 2 "Critical Decision" sections comparing technologies/patterns
- [ ] "Use When / Avoid When" table for each major technology
- [ ] Cost vs Performance vs Complexity matrix
- [ ] At least 2 trade-off-focused exercises (quiz or scenario-based)
- [ ] "When NOT to Use X" section with anti-patterns
- [ ] Real-world failure examples showing wrong trade-off choices
- [ ] Decision trees for choosing between options

---

## Trade-Off Question Stems

Use these to create trade-off exercises:

1. **"Given scenario X, which technology should you choose?"**
   - Provide requirements (latency, scale, cost, complexity)
   - Ask students to choose between 3-4 options
   - Explain why each is right/wrong

2. **"What would you give up if you chose X over Y?"**
   - Make students think about trade-offs explicitly
   - No perfect solution - every choice has downsides

3. **"When would you switch from X to Y?"**
   - At what scale/complexity does the trade-off flip?
   - Example: "When do you switch from vertical to horizontal scaling?"

4. **"Which requirement forces you to choose X?"**
   - Identify the critical constraint
   - Example: "If you need <10ms latency, you MUST use Redis, not Kafka"

5. **"What's the cheapest/simplest/fastest solution?"**
   - Force students to optimize for one dimension
   - Show how optimizing one hurts others

---

## Examples of Strong Trade-Off Content

### Example 1: Database Choice
```
🎯 Critical Decision: PostgreSQL vs DynamoDB vs Redis

| Factor | PostgreSQL | DynamoDB | Redis |
|--------|-----------|----------|-------|
| ACID transactions | ✅ Full | ❌ Limited | ❌ No |
| Query flexibility | ✅ SQL | ❌ Key-value only | ❌ Key-value + data structures |
| Auto-scaling | ❌ Manual | ✅ Automatic | ❌ Manual |
| Latency | 10-50ms | 5-20ms | 1-2ms |
| Cost @ 100k RPS | $500/mo | $2000/mo | $300/mo |
| Max dataset size | 10TB+ | Unlimited | ~100GB (RAM limited) |

**Decision:**
- Need SQL + transactions → PostgreSQL
- Need auto-scaling + no ops → DynamoDB
- Need <5ms latency → Redis (but not as primary DB!)
```

### Example 2: Load Balancer Algorithms
```
🎯 Critical Decision: Round-Robin vs Least-Connections vs Weighted

**Scenario:** E-commerce site, 10 app servers, some servers are newer (2x CPU)

| Algorithm | Distributes | Best When | Worst When |
|-----------|------------|-----------|------------|
| Round-robin | Evenly (1,2,3,1,2,3) | All servers identical | Servers different specs |
| Least-connections | Server with fewest active | Variable request times | All requests same duration |
| Weighted | By capacity (2x weight = 2x traffic) | Servers different specs | Need perfect fairness |

**Answer:** Use Weighted Round-Robin
- Why: New servers have 2x CPU, should handle 2x traffic
- Round-robin would overload old servers (same load, half the CPU)
- Least-connections doesn't account for CPU differences

**Trade-off made:** Complexity (configure weights) for efficiency (use new servers fully)
```

---

## Anti-Patterns to Avoid in Trade-Off Teaching

❌ **Don't:** List features without context
```
Redis has pub/sub, lists, sets, sorted sets...
```

✅ **Do:** Explain when each feature solves a problem
```
Use Redis Lists for job queues (LPUSH + BRPOP)
Use Redis Sorted Sets for leaderboards (ZADD + ZRANGE)
Use Redis Pub/Sub for real-time notifications (PUBLISH + SUBSCRIBE)
```

❌ **Don't:** Say "X is better than Y"
```
Kafka is better than Redis for queues.
```

✅ **Do:** Say "X is better than Y when..."
```
Kafka is better than Redis when you need:
- Event replay (Redis discards after consumption)
- Multiple consumer groups (Redis pub/sub is broadcast only)
- Durability guarantees (Redis can lose data on crash)

Redis is better than Kafka when you need:
- <10ms latency (Kafka is 5-50ms)
- Simple setup (Kafka needs ZooKeeper + brokers)
- Low cost ($100 vs $500+/mo)
```

---

## Success Metrics

A lesson has strong trade-off focus when:

1. **Students can answer:** "Given this scenario, which technology should I choose and why?"
2. **Students can explain:** "What do I give up if I choose X over Y?"
3. **Students avoid:** "I'll use Redis because I know Redis" (cargo-culting)
4. **Students think:** "What are my requirements? Which trade-off optimizes for those?"

---

*Trade-offs are the essence of system design. Master trade-offs, master system design.*
