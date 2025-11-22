import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter6PartitioningLesson: SystemDesignLesson = {
  id: 'ddia-ch6-partitioning',
  slug: 'ddia-ch6-partitioning',
  title: 'Partitioning (Sharding) (DDIA Ch. 6)',
  description: 'Master partitioning trade-offs: WHEN to use hash vs range vs composite partitioning, HOW hot spots affect performance (10× throughput imbalance), WHICH partitioning strategy fits your query patterns and scaling needs.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 85,

  // Progressive flow metadata
  moduleId: 'sd-module-4-ddia',
  sequenceOrder: 5,
  stages: [
    {
      id: 'intro-partitioning',
      type: 'concept',
      title: 'Why Partitioning?',
      content: (
        <Section>
          <H1>Why Partitioning?</H1>
          <P>
            <Strong>Partitioning</Strong> (also called <Strong>sharding</Strong>) splits data across multiple nodes.
            Each partition is independent, allowing horizontal scaling.
          </P>
          <UL>
            <LI><Strong>Scalability:</Strong> Data too large for single node - split across many nodes</LI>
            <LI><Strong>Performance:</Strong> Queries only hit relevant partitions (smaller dataset)</LI>
            <LI><Strong>Parallelism:</Strong> Multiple partitions can be queried in parallel</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'partitioning-strategies',
      type: 'concept',
      title: 'Partitioning Strategies',
      content: (
        <Section>
          <H1>Partitioning Strategies</H1>
          <P>
            How to decide which partition a record belongs to:
          </P>

          <H2>Hash Partitioning</H2>
          <UL>
            <LI>Hash the partition key (e.g., user_id)</LI>
            <LI>Modulo by number of partitions</LI>
            <LI>Even distribution, but can't do range queries</LI>
          </UL>

          <Example title="Hash Partitioning">
            <CodeBlock>
{`// Partition key: user_id
hash(user_id=123) = 789
partition = 789 % 4 = 1

// User 123 goes to partition 1
// Even distribution, but can't query "users 100-200"`}
            </CodeBlock>
          </Example>

          <H2>Range Partitioning</H2>
          <UL>
            <LI>Partition by ranges of partition key</LI>
            <LI>Example: Partition 1: user_id 1-1000, Partition 2: 1001-2000</LI>
            <LI>Supports range queries, but can have hot spots</LI>
          </UL>

          <Example title="Range Partitioning">
            <CodeBlock>
{`// Partition by user_id ranges
Partition 1: user_id 1-1000
Partition 2: user_id 1001-2000
Partition 3: user_id 2001-3000

// Can query: SELECT * WHERE user_id BETWEEN 500 AND 1500
// Hits Partition 1 and 2

// Problem: If all new users get high IDs, Partition 3 becomes hot spot`}
            </CodeBlock>
          </Example>

          <H2>Composite Partitioning</H2>
          <UL>
            <LI>Combine multiple strategies</LI>
            <LI>Example: Partition by (country, user_id) - first by country, then by user_id within country</LI>
          </UL>

          <ComparisonTable
            headers={['Strategy', 'Distribution', 'Range Queries', 'Hot Spots']}
            rows={[
              ['Hash', 'Even', 'No', 'Rare'],
              ['Range', 'May be uneven', 'Yes', 'Common'],
              ['Composite', 'Configurable', 'Partial', 'Configurable'],
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'consistent-hashing',
      type: 'concept',
      title: 'Consistent Hashing',
      content: (
        <Section>
          <H1>Consistent Hashing</H1>
          <P>
            <Strong>Consistent hashing</Strong> minimizes data movement when nodes are added or removed.
            Used by DynamoDB, Cassandra, Riak.
          </P>

          <H2>How It Works</H2>
          <OL>
            <LI>Hash nodes and keys to a ring (0 to 2^64-1)</LI>
            <LI>Each key belongs to first node clockwise from its hash</LI>
            <LI>When node added/removed, only adjacent keys move</LI>
          </OL>

          <Example title="Consistent Hashing">
            <CodeBlock>
{`// Hash ring (simplified)
Node A: hash=100
Node B: hash=200
Node C: hash=300

// Key "user123" hashes to 150
// Belongs to Node B (first node >= 150)

// Add Node D at hash=250
// Only keys between 200-250 move from B to D
// Keys 150-200 stay on B (minimal movement!)`}
            </CodeBlock>
          </Example>

          <H2>Virtual Nodes</H2>
          <P>
            To ensure even distribution, each physical node has multiple <Strong>virtual nodes</Strong>
            on the ring. This prevents hot spots.
          </P>

          <KeyPoint>
            <Strong>Use When:</Strong> Need to add/remove nodes frequently, want minimal data movement.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'secondary-indexes',
      type: 'concept',
      title: 'Secondary Indexes & Partitioning',
      content: (
        <Section>
          <H1>Secondary Indexes & Partitioning</H1>
          <P>
            <Strong>Secondary indexes</Strong> allow querying by non-partition key. Two approaches:
          </P>

          <H2>Local Secondary Index</H2>
          <UL>
            <LI>Index stored in same partition as data</LI>
            <LI>Query must specify partition key</LI>
            <LI>Example: Partition by user_id, index on (user_id, created_at)</LI>
          </UL>

          <H2>Global Secondary Index</H2>
          <UL>
            <LI>Index partitioned separately from data</LI>
            <LI>Can query without partition key</LI>
            <LI>Requires scatter-gather (query all partitions)</LI>
            <LI>Example: Partition by user_id, global index on email</LI>
          </UL>

          <Example title="Querying with Secondary Index">
            <CodeBlock>
{`// Data partitioned by user_id
// Global index on email

// Query: Find user by email
SELECT * WHERE email='alice@example.com'

// With global index:
// 1. Query index (partitioned by email hash)
// 2. Get user_id
// 3. Query data partition (partitioned by user_id)
// Two lookups, but works!

// With local index (if existed):
// Would need to know user_id first (can't query by email)`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Trade-off:</Strong> Global indexes enable flexible queries but add complexity and write overhead.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'rebalancing',
      type: 'concept',
      title: 'Rebalancing Partitions',
      content: (
        <Section>
          <H1>Rebalancing Partitions</H1>
          <P>
            When nodes are added or removed, partitions must be <Strong>rebalanced</Strong> to maintain
            even distribution.
          </P>

          <H2>Rebalancing Strategies</H2>
          <UL>
            <LI><Strong>Fixed Partitions:</Strong> Pre-allocate many partitions, assign to nodes (Kafka)</LI>
            <LI><Strong>Dynamic Partitioning:</Strong> Split partitions when they grow too large (HBase)</LI>
            <LI><Strong>Proportional Partitioning:</Strong> Each node has same number of partitions (Cassandra)</LI>
          </UL>

          <H2>Rebalancing Process</H2>
          <OL>
            <LI>Identify partitions to move</LI>
            <LI>Copy data to new node</LI>
            <LI>Update routing table</LI>
            <LI>Stop accepting writes to old partition</LI>
            <LI>Drain remaining reads, then delete old partition</LI>
          </OL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use consistent hashing or fixed partitions to minimize rebalancing overhead.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'hash-vs-range-partitioning-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Hash vs Range vs Composite Partitioning',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Hash vs Range vs Composite Partitioning</H1>
          <P>
            Partitioning strategy determines <Strong>data distribution, query performance, and hot spot risk</Strong>.
            Choosing the wrong strategy can cause 10× throughput imbalance (hot partitions) or expensive scatter-gather queries.
          </P>

          <Divider />

          <H2>📊 Partitioning Strategy Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'Hash Partitioning', 'Range Partitioning', 'Composite Partitioning']}
            rows={[
              ['Data Distribution', '✅ Even (random)', '⚠️ Uneven (skewed)', '✅ Controlled (configurable)'],
              ['Hot Spot Risk', '🟢 Low (uniform hash)', '🔴 High (temporal/sequential data)', '🟡 Medium (depends on key choice)'],
              ['Range Queries', '❌ Scatter-gather (all partitions)', '✅ Efficient (target partitions)', '⚠️ Partial (depends on prefix)'],
              ['Point Queries', '✅ Single partition', '✅ Single partition', '✅ Single partition'],
              ['Partition Key Flexibility', '❌ Single key only', '❌ Single key only', '✅ Multiple keys (hierarchical)'],
              ['Rebalancing Complexity', '🟡 Moderate (rehash all)', '🟢 Simple (split ranges)', '🟡 Moderate (depends on strategy)'],
              ['Example Systems', 'DynamoDB (default), Cassandra (Murmur3)', 'HBase, BigTable', 'Cassandra (compound keys), MongoDB (hashed shard key + range)'],
              ['Use Case', 'Even load, point queries', 'Time-series, range scans', 'Multi-tenant, hierarchical data'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: E-Commerce Orders Database</H2>
          <P>
            <Strong>Scenario:</Strong> E-commerce platform with 10M orders/day. Need to partition orders table across 10 shards.
            Query patterns: fetch order by ID, fetch user's orders, fetch orders by date range.
          </P>

          <H3>Hash Partitioning by order_id (Even Distribution)</H3>
          <CodeBlock>
{`// Partition by hash(order_id)
CREATE TABLE orders (
  order_id UUID PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP,
  items JSONB,
  total DECIMAL
) PARTITION BY HASH (order_id);

// Partition assignment
partition = hash(order_id) % 10
// order_id=abc123 → hash=7482 → partition=2
// order_id=def456 → hash=3891 → partition=1

// Query 1: Fetch order by ID (single partition)
SELECT * FROM orders WHERE order_id = 'abc123';
// ✅ Hits partition 2 only (0.1ms)

// Query 2: Fetch user's orders (scatter-gather!)
SELECT * FROM orders WHERE user_id = 'user456';
// ❌ Must query ALL 10 partitions (10× overhead, 5ms total)
// Each partition returns 1-2 orders, inefficient!

// Query 3: Fetch orders by date range (scatter-gather!)
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
// ❌ Must query ALL 10 partitions (10× overhead, 8ms total)

// Performance:
// - Point queries (by order_id): Excellent (single partition)
// - User queries: Poor (10× overhead)
// - Range queries: Poor (10× overhead)
// - Data distribution: Perfect (each partition ~1M orders/day)

// Hot Spot Risk: LOW
// - Orders distributed evenly across partitions
// - No single partition overloaded`}
          </CodeBlock>

          <H3>Range Partitioning by created_at (Range Query Friendly)</H3>
          <CodeBlock>
{`// Partition by created_at ranges
CREATE TABLE orders (
  order_id UUID PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP,
  items JSONB,
  total DECIMAL
) PARTITION BY RANGE (created_at);

// Partition ranges (monthly)
// Partition 0: created_at < '2024-01-01'
// Partition 1: created_at >= '2024-01-01' AND < '2024-02-01'
// Partition 2: created_at >= '2024-02-01' AND < '2024-03-01'
// ... (10 partitions = 10 months)

// Query 1: Fetch order by ID (scatter-gather!)
SELECT * FROM orders WHERE order_id = 'abc123';
// ❌ Must query ALL 10 partitions (don't know which month order was created)
// 10× overhead (5ms total)

// Query 2: Fetch user's orders (scatter-gather!)
SELECT * FROM orders WHERE user_id = 'user456';
// ❌ Must query ALL 10 partitions (10× overhead, 5ms)

// Query 3: Fetch orders by date range (efficient!)
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
// ✅ Hits partition 1 only (January data) (0.8ms)
// Partition pruning: query planner knows to skip other partitions

// Performance:
// - Point queries (by order_id): Poor (10× overhead)
// - User queries: Poor (10× overhead)
// - Range queries (by created_at): Excellent (targeted partitions)
// - Data distribution: Even (assuming uniform order rate)

// Hot Spot Risk: HIGH!
// - Current month (Partition 2) receives ALL writes
// - 10M orders/day → ALL to Partition 2
// - Other partitions idle (read-only)
// - Write throughput limited by single partition (bottleneck!)

// Mitigation: Add more partitions for current month (sub-partition by hour/day)`}
          </CodeBlock>

          <H3>Composite Partitioning by (user_id, created_at) - Best of Both Worlds</H3>
          <CodeBlock>
{`// Cassandra: Composite partition key
CREATE TABLE orders (
  user_id UUID,
  created_at TIMESTAMP,
  order_id UUID,
  items JSONB,
  total DECIMAL,
  PRIMARY KEY ((user_id), created_at, order_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

// Partition strategy:
// 1. Partition by hash(user_id) → Even distribution across shards
// 2. Within partition, order by created_at → Range queries efficient

// Partition assignment
partition = hash(user_id) % 10

// Query 1: Fetch order by ID (add secondary index on order_id)
CREATE INDEX idx_order_id ON orders (order_id);
SELECT * FROM orders WHERE order_id = 'abc123';
// ⚠️ Scatter-gather via index (5ms) - acceptable for rare query

// Query 2: Fetch user's orders (single partition!)
SELECT * FROM orders WHERE user_id = 'user456';
// ✅ Hits partition hash(user456)%10 = 3 only (0.5ms)
// All user's orders in same partition!

// Query 3: Fetch user's orders by date range (single partition + range scan!)
SELECT * FROM orders
WHERE user_id = 'user456'
  AND created_at BETWEEN '2024-01-01' AND '2024-01-31';
// ✅ Hits partition 3 only, range scan within partition (0.3ms)
// Best performance: single partition + efficient range scan

// Query 4: Global date range query (scatter-gather)
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
// ❌ Must query ALL partitions (not common query, acceptable)

// Performance:
// - Point queries (by order_id): Acceptable (with index)
// - User queries: Excellent (single partition, 10× faster than hash!)
// - User + range queries: Excellent (single partition + range scan)
// - Global range queries: Poor (but rare in practice)
// - Data distribution: Even (users distributed evenly)

// Hot Spot Risk: MEDIUM
// - Power users (high order volume) may create hot partitions
// - Mitigation: Sub-partition power users by hash(user_id, order_id % 10)

// Write Throughput: Excellent
// - Writes distributed across all partitions (10M writes/day ÷ 10 = 1M/partition)
// - No single partition bottleneck

// Result: Best strategy for this use case (user-centric queries + even distribution)`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Decision Framework</H2>
          <CodeBlock>
{`function choosePartitioningStrategy(queryPatterns, dataCharacteristics) {
  // 1. Primary query: Point lookups by single key → Hash
  if (queryPatterns.primaryAccess === 'byID' && !queryPatterns.rangeScans) {
    return {
      strategy: 'Hash',
      key: 'id',  // Entity ID
      reason: 'Even distribution, fast point lookups'
    };
  }

  // 2. Primary query: Range scans (time-series data) → Range
  if (queryPatterns.primaryAccess === 'rangeScans' && dataCharacteristics.timeSeries) {
    return {
      strategy: 'Range',
      key: 'timestamp',
      reason: 'Efficient range queries, partition pruning',
      warning: 'Hot spot risk on current partition (writes)'
    };
  }

  // 3. Primary query: User-scoped queries → Composite (user_id + timestamp)
  if (queryPatterns.primaryAccess === 'byUser' && queryPatterns.userRangeScans) {
    return {
      strategy: 'Composite',
      partitionKey: 'user_id',  // Hash for even distribution
      clusteringKey: 'timestamp',  // Range for sorting within partition
      reason: 'User queries hit single partition, range scans efficient'
    };
  }

  // 4. Multi-tenant SaaS → Composite (tenant_id + entity_id)
  if (dataCharacteristics.multiTenant) {
    return {
      strategy: 'Composite',
      partitionKey: 'tenant_id',  // Isolate tenants
      clusteringKey: 'entity_id',
      reason: 'Tenant isolation, easy to move tenants between shards'
    };
  }

  // 5. High write throughput (avoid hot spots) → Hash
  if (dataCharacteristics.highWriteThroughput && dataCharacteristics.sequential) {
    return {
      strategy: 'Hash',
      key: 'id',  // Random distribution
      reason: 'Avoid hot spots from sequential writes'
    };
  }

  // Default: Hash (safest choice)
  return {
    strategy: 'Hash',
    key: 'id',
    reason: 'Even distribution, minimal hot spot risk'
  };
}

// Example Usage:
const strategy = choosePartitioningStrategy({
  primaryAccess: 'byUser',
  userRangeScans: true
}, {
  timeSeries: true,
  highWriteThroughput: true
});
// → Returns { strategy: 'Composite', partitionKey: 'user_id', clusteringKey: 'timestamp' }`}
          </CodeBlock>

          <Divider />

          <H2>⚠️ Common Mistakes & Fixes</H2>

          <H3>❌ Mistake 1: Range Partitioning on Sequential IDs (Hot Spot)</H3>
          <CodeBlock>
{`// BAD: Range partitioning on auto-increment order_id
// Problem: All writes go to highest partition (hot spot!)

// Partition ranges:
// Partition 0: order_id 1-1M
// Partition 1: order_id 1M-2M
// Partition 2: order_id 2M-3M (current, receives ALL writes!)

CREATE TABLE orders (
  order_id BIGINT PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP
) PARTITION BY RANGE (order_id);

// Result: Partition 2 overloaded (10× write load vs others)
// Write throughput bottlenecked by single partition

// GOOD: Hash partitioning on order_id (even distribution)
CREATE TABLE orders (
  order_id UUID PRIMARY KEY,  // Use UUID instead of auto-increment
  user_id UUID,
  created_at TIMESTAMP
) PARTITION BY HASH (order_id);

// Or: Use snowflake IDs (distributed ID generation)
// order_id = timestamp + machine_id + sequence
// Hash the snowflake ID to distribute evenly

partition = hash(order_id) % 10;
// Result: Even write distribution across all partitions`}
          </CodeBlock>

          <H3>❌ Mistake 2: Hash Partitioning When Range Queries Are Primary</H3>
          <CodeBlock>
{`// BAD: Hash partitioning for time-series analytics
// Problem: Range queries require scatter-gather (10× overhead)

CREATE TABLE metrics (
  metric_id UUID PRIMARY KEY,
  timestamp TIMESTAMP,
  value DOUBLE
) PARTITION BY HASH (metric_id);

// Common query: Fetch metrics for last 24 hours
SELECT * FROM metrics WHERE timestamp > NOW() - INTERVAL '24 hours';
// ❌ Must query ALL partitions (slow, expensive)

// GOOD: Range partitioning by timestamp (with composite key to avoid hot spots)
CREATE TABLE metrics (
  timestamp TIMESTAMP,
  metric_id UUID,
  value DOUBLE,
  PRIMARY KEY ((timestamp), metric_id)
) PARTITION BY RANGE (timestamp);

// Partition by hour (24 partitions for 24 hours)
// Partition 0: 2024-01-01 00:00-01:00
// Partition 1: 2024-01-01 01:00-02:00
// ...

// Query: Fetch metrics for last 24 hours
SELECT * FROM metrics WHERE timestamp > NOW() - INTERVAL '24 hours';
// ✅ Hits only last 24 partitions (partition pruning)

// Avoid hot spot: Use composite key (timestamp + hash(metric_id))
// Within each hour partition, distribute metrics evenly`}
          </CodeBlock>

          <H3>❌ Mistake 3: Composite Partitioning with Wrong Key Order</H3>
          <CodeBlock>
{`// BAD: Composite key with timestamp first
// Problem: Can't query by user_id efficiently

CREATE TABLE user_events (
  created_at TIMESTAMP,
  user_id UUID,
  event_type TEXT,
  PRIMARY KEY ((created_at), user_id)
) PARTITION BY RANGE (created_at);

// Query: Fetch all events for user456
SELECT * FROM user_events WHERE user_id = 'user456';
// ❌ Must scan ALL partitions (don't know which time ranges user456 is in)

// GOOD: Partition by user_id first (matches query pattern)
CREATE TABLE user_events (
  user_id UUID,
  created_at TIMESTAMP,
  event_type TEXT,
  PRIMARY KEY ((user_id), created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);

// Partition by hash(user_id)
partition = hash(user_id) % 10;

// Query: Fetch all events for user456
SELECT * FROM user_events WHERE user_id = 'user456';
// ✅ Hits single partition only

// Query: Fetch user's events in date range
SELECT * FROM user_events
WHERE user_id = 'user456'
  AND created_at > '2024-01-01';
// ✅ Single partition + efficient range scan

// Golden Rule: Partition key = most selective query filter`}
          </CodeBlock>

          <H3>❌ Mistake 4: Not Considering Hot Partitions (Power Users)</H3>
          <CodeBlock>
{`// BAD: Partition by user_id without considering power users
// Problem: Celebrity user generates 1M events/day → hot partition

CREATE TABLE social_posts (
  user_id UUID,
  post_id UUID,
  created_at TIMESTAMP,
  PRIMARY KEY ((user_id), created_at)
);

// Partition by hash(user_id)
// Problem: Celebrity (user123) has 1M posts
//   → Partition 5 has 1M records
//   → Other partitions have 1k-10k records each
//   → 100× imbalance!

// GOOD: Hybrid approach - detect and sub-partition power users
class PartitionRouter {
  getPartition(userId) {
    // Check if power user (cached in Redis)
    if (this.isPowerUser(userId)) {
      // Sub-partition power users by hash(user_id, post_id)
      const subKey = \`\${userId}:\${postId % 10}\`;
      return hash(subKey) % 100;  // 100 partitions for power users
    } else {
      // Regular users: partition by user_id
      return hash(userId) % 10;
    }
  }

  isPowerUser(userId) {
    // Power user: >100k posts
    return this.redis.get(\`power_user:\${userId}\`) === 'true';
  }
}

// Result: Power users distributed across multiple partitions
// - Celebrity user123 split across 10 partitions (100k posts each)
// - Even distribution maintained

// Alternative: Use consistent hashing with virtual nodes
// - Assign 10× more virtual nodes to power users
// - Automatically spreads load`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: Hash vs Composite Partitioning for SaaS Platform</H2>
          <InfoBox>
            <H3>Multi-Tenant SaaS Platform (10k Tenants)</H3>
            <UL>
              <LI><Strong>Data Volume:</Strong> 1B records total</LI>
              <LI><Strong>Query Pattern:</Strong> 90% queries scoped to single tenant</LI>
              <LI><Strong>QPS:</Strong> 100k queries/sec</LI>
            </UL>

            <H3>Hash Partitioning by record_id (Current System)</H3>
            <UL>
              <LI><Strong>Partition Strategy:</Strong> hash(record_id) % 100</LI>
              <LI><Strong>Tenant Queries:</Strong> Scatter-gather ALL 100 partitions</LI>
              <LI><Strong>Avg Query Latency:</Strong> 50ms (100 partitions × 0.5ms each)</LI>
              <LI><Strong>Database CPU:</Strong> 100 cores (high due to scatter-gather)</LI>
              <LI><Strong>Infrastructure Cost:</Strong> $15,000/mo (100 database instances)</LI>
            </UL>

            <H3>Composite Partitioning by (tenant_id, record_id) - Optimized</H3>
            <UL>
              <LI><Strong>Partition Strategy:</Strong> hash(tenant_id) % 100</LI>
              <LI><Strong>Tenant Queries:</Strong> Single partition only</LI>
              <LI><Strong>Avg Query Latency:</Strong> 2ms (1 partition × 2ms)</LI>
              <LI><Strong>Latency Improvement:</Strong> 96% reduction (50ms → 2ms)</LI>
              <LI><Strong>Database CPU:</Strong> 20 cores (80% reduction)</LI>
              <LI><Strong>Infrastructure Cost:</Strong> $3,000/mo (20 database instances)</LI>
            </UL>

            <H3>Cost-Benefit Analysis</H3>
            <UL>
              <LI><Strong>Annual Savings:</Strong> ($15k - $3k) × 12 = <Strong>$144k/year</Strong></LI>
              <LI><Strong>Migration Cost:</Strong> 3 engineers × 1 month = $75k (one-time)</LI>
              <LI><Strong>Downtime:</Strong> Zero (online migration with dual writes)</LI>
              <LI><Strong>Payback Period:</Strong> 6.25 months</LI>
              <LI><Strong>3-Year NPV:</Strong> $432k - $75k = <Strong>$357k savings</Strong></LI>
            </UL>

            <P>
              <Strong>Additional Benefits:</Strong> 96% latency reduction improves user experience,
              reduces timeout errors (10% → 0.1%), enables 5× higher QPS capacity (100k → 500k QPS).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>Partitioning Strategy Guidelines:</Strong><br />
            • <Strong>Hash:</Strong> Point lookups by ID, need even distribution (user IDs, session IDs)<br />
            • <Strong>Range:</Strong> Time-series analytics, range scans primary (metrics, logs, IoT data)<br />
            • <Strong>Composite:</Strong> Multi-tenant SaaS, user-scoped queries, hierarchical data (tenant + entity)<br /><br />
            <Strong>Golden Rule:</Strong> Partition key should match your most common query filter.
            If 90% queries filter by user_id, partition by user_id!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'local-vs-global-indexes-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Local vs Global Secondary Indexes',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Local vs Global Secondary Indexes</H1>
          <P>
            Secondary index strategy determines <Strong>query flexibility, write overhead, and consistency</Strong>.
            Choosing the wrong index type can cause 10× write amplification or expensive scatter-gather queries.
          </P>

          <Divider />

          <H2>📊 Secondary Index Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'Local Secondary Index (LSI)', 'Global Secondary Index (GSI)']}
            rows={[
              ['Query Flexibility', '⚠️ Must include partition key', '✅ Query any attribute independently'],
              ['Query Latency', '✅ Single partition (5ms)', '⚠️ Scatter-gather or index lookup (20ms)'],
              ['Write Overhead', '🟢 Low (same partition)', '🔴 High (separate partition, write amplification)'],
              ['Write Latency', '✅ 5ms (atomic with main write)', '⚠️ 10ms (async to index partition)'],
              ['Consistency', '✅ Strong (same transaction)', '⚠️ Eventual (async indexing)'],
              ['Storage Overhead', '🟢 Low (co-located)', '🔴 Higher (duplicated across partitions)'],
              ['Index Limits', '⚠️ 5 LSIs per table (DynamoDB)', '⚠️ 20 GSIs per table (DynamoDB)'],
              ['Use Case', 'Query variations within partition', 'Cross-partition queries (email lookups, global filters)'],
              ['Example (DynamoDB)', 'LSI on (user_id, created_at)', 'GSI on email (partition by email)'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: User Management System</H2>
          <P>
            <Strong>Scenario:</Strong> SaaS platform with 10M users. Users table partitioned by user_id (hash).
            Query patterns: fetch by user_id, fetch by email, fetch by (user_id + created_at).
          </P>

          <H3>Base Table (No Indexes)</H3>
          <CodeBlock>
{`// DynamoDB: Users table partitioned by user_id
const usersTable = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'user_id', KeyType: 'HASH' }  // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'user_id', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' },
    { AttributeName: 'created_at', AttributeType: 'N' }
  ]
};

// Query 1: Fetch user by user_id (works efficiently!)
const params = {
  TableName: 'Users',
  Key: { user_id: 'user123' }
};
const result = await dynamodb.get(params).promise();
// ✅ Single partition lookup (3ms)

// Query 2: Fetch user by email (IMPOSSIBLE without scan!)
const params = {
  TableName: 'Users',
  FilterExpression: 'email = :email',
  ExpressionAttributeValues: { ':email': 'alice@example.com' }
};
const result = await dynamodb.scan(params).promise();
// ❌ Full table scan (10M records, 30 seconds!)

// Query 3: Fetch user's recent orders (user_id + date filter)
const params = {
  TableName: 'Users',
  Key: { user_id: 'user123' },
  FilterExpression: 'created_at > :date',
  ExpressionAttributeValues: { ':date': 1704067200 }
};
// ⚠️ Fetches user, then filters in application (inefficient for large datasets)`}
          </CodeBlock>

          <H3>Local Secondary Index (LSI) - Query Variations Within Partition</H3>
          <CodeBlock>
{`// Add LSI on (user_id, created_at) for sorting/filtering
const usersTable = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'user_id', KeyType: 'HASH' }  // Partition key
  ],
  LocalSecondaryIndexes: [
    {
      IndexName: 'user_created_at_index',
      KeySchema: [
        { AttributeName: 'user_id', KeyType: 'HASH' },  // MUST be same as table
        { AttributeName: 'created_at', KeyType: 'RANGE' }  // Sort key
      ],
      Projection: { ProjectionType: 'ALL' }
    }
  ]
};

// Query 1: Fetch user by user_id (same as before)
const result = await dynamodb.get({ TableName: 'Users', Key: { user_id: 'user123' } }).promise();
// ✅ Single partition (3ms)

// Query 2: Fetch user by email (STILL IMPOSSIBLE!)
// LSI requires partition key (user_id), can't query by email alone
// ❌ Still requires full table scan

// Query 3: Fetch users by (user_id + date range) - NOW EFFICIENT!
const params = {
  TableName: 'Users',
  IndexName: 'user_created_at_index',
  KeyConditionExpression: 'user_id = :userId AND created_at > :date',
  ExpressionAttributeValues: {
    ':userId': 'user123',
    ':date': 1704067200
  }
};
const result = await dynamodb.query(params).promise();
// ✅ Single partition, range query within partition (2ms)

// Write Overhead: LOW
// - LSI stored in same partition as base table
// - Write to Users table also updates LSI atomically (5ms total)
// - No additional write latency

// Consistency: STRONG
// - LSI updated in same transaction as base table
// - Read from LSI sees latest data immediately

// Limitation: Must know user_id to query
// - Can't query "all users created after 2024-01-01" (scatter-gather)
// - Can't query by email (no partition key)`}
          </CodeBlock>

          <H3>Global Secondary Index (GSI) - Query by Any Attribute</H3>
          <CodeBlock>
{`// Add GSI on email for lookups by email
const usersTable = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'user_id', KeyType: 'HASH' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'email_index',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }  // Different partition key!
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5  // Separate capacity!
      }
    }
  ]
};

// Query 1: Fetch user by user_id (same as before)
const result = await dynamodb.get({ TableName: 'Users', Key: { user_id: 'user123' } }).promise();
// ✅ Single partition (3ms)

// Query 2: Fetch user by email (NOW WORKS!)
const params = {
  TableName: 'Users',
  IndexName: 'email_index',
  KeyConditionExpression: 'email = :email',
  ExpressionAttributeValues: { ':email': 'alice@example.com' }
};
const result = await dynamodb.query(params).promise();
// ✅ Query GSI partition (hash by email), get user_id, fetch from main table (8ms total)
// Alternative: Project all attributes into GSI (no second lookup, 4ms)

// Query 3: Fetch all users created after date (global query)
const params = {
  TableName: 'Users',
  IndexName: 'created_at_index',  // Hypothetical GSI on created_at
  KeyConditionExpression: 'created_at > :date',
  ExpressionAttributeValues: { ':date': 1704067200 }
};
// ✅ Query GSI (range query, partition pruning)

// Write Overhead: HIGH
// - Write to Users table: 5ms
// - Async write to email_index GSI: +3ms
// - Total: 8ms (60% slower)
// - Write amplification: 1 write → 2 writes (main + GSI)

// Consistency: EVENTUAL
// - GSI updated asynchronously (50-100ms lag)
// - Read from GSI may not see latest write immediately
// - Example: User updates email → query by new email → may not find for 100ms

// Storage Overhead: 2× (main table + GSI copy)
// - 10M users × 1KB each = 10GB main table
// - GSI with ALL projection = 10GB GSI
// - Total: 20GB (2× storage)

// Cost:
// - Main table: $2.50/GB = $25/month
// - GSI: $2.50/GB = $25/month
// - Total: $50/month (2× cost)

// Benefit: Query flexibility (worth the cost for email lookups!)`}
          </CodeBlock>

          <H3>Hybrid Approach: LSI + GSI for Optimal Performance</H3>
          <CodeBlock>
{`// Combine LSI and GSI for best of both worlds
const usersTable = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'user_id', KeyType: 'HASH' }
  ],
  LocalSecondaryIndexes: [
    {
      IndexName: 'user_created_at_index',
      KeySchema: [
        { AttributeName: 'user_id', KeyType: 'HASH' },
        { AttributeName: 'created_at', KeyType: 'RANGE' }
      ]
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'email_index',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'INCLUDE',  // Only project needed attributes
        NonKeyAttributes: ['user_id', 'name']  // Reduce storage overhead
      }
    }
  ]
};

// Query Pattern Optimization:
// 1. Fetch by user_id → Main table (3ms) ✅
// 2. Fetch by email → GSI email_index (4ms) ✅
// 3. Fetch by (user_id + date) → LSI user_created_at_index (2ms) ✅

// Write Path:
// 1. Write to main table (5ms)
// 2. Update LSI synchronously (0ms overhead, same partition)
// 3. Update GSI asynchronously (+3ms, separate partition)
// Total: 8ms

// Result: All query patterns optimized, minimal write overhead`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Decision Framework</H2>
          <CodeBlock>
{`function chooseSecondaryIndexType(queryPattern, dataCharacteristics) {
  // 1. Query variations within same partition → LSI
  if (queryPattern.requiresPartitionKey && queryPattern.needsSorting) {
    return {
      type: 'LSI',
      indexKey: queryPattern.sortAttribute,
      reason: 'Single partition query, strong consistency, low overhead',
      example: 'Fetch user orders sorted by date (user_id + created_at)'
    };
  }

  // 2. Cross-partition queries (global lookups) → GSI
  if (!queryPattern.requiresPartitionKey || queryPattern.globalFilter) {
    return {
      type: 'GSI',
      indexKey: queryPattern.filterAttribute,
      reason: 'Query any attribute independently, flexible queries',
      example: 'Fetch user by email (email → user_id)',
      tradeoff: 'Higher write overhead, eventual consistency'
    };
  }

  // 3. Rare queries (analytics, admin tools) → Scan or ETL
  if (queryPattern.frequency < 100/day) {
    return {
      type: 'No Index',
      reason: 'Rare queries not worth index overhead',
      alternative: 'Use full table scan or export to data warehouse (Redshift, BigQuery)'
    };
  }

  // 4. High write throughput (avoid write amplification) → Minimize GSIs
  if (dataCharacteristics.writeHeavy) {
    return {
      type: 'LSI',
      reason: 'Lower write overhead (1× writes vs 2× with GSI)',
      alternative: 'Denormalize data into main table to avoid GSI'
    };
  }

  // Default: GSI (most flexible)
  return {
    type: 'GSI',
    reason: 'Maximum query flexibility'
  };
}

// Example Usage:
const indexType = chooseSecondaryIndexType({
  requiresPartitionKey: false,
  filterAttribute: 'email',
  globalFilter: true,
  frequency: 10000/day  // Common query
}, {
  writeHeavy: false
});
// → Returns { type: 'GSI', indexKey: 'email', ... }`}
          </CodeBlock>

          <Divider />

          <H2>⚠️ Common Mistakes & Fixes</H2>

          <H3>❌ Mistake 1: Using LSI for Cross-Partition Queries</H3>
          <CodeBlock>
{`// BAD: LSI on created_at (requires user_id)
// Problem: Can't query "all users created after date" without user_id

LocalSecondaryIndexes: [
  {
    IndexName: 'created_at_index',
    KeySchema: [
      { AttributeName: 'user_id', KeyType: 'HASH' },  // Required!
      { AttributeName: 'created_at', KeyType: 'RANGE' }
    ]
  }
]

// Query: Fetch all users created after 2024-01-01
// ❌ IMPOSSIBLE - LSI requires user_id in query
// Must scan all partitions (10M users, 30 seconds)

// GOOD: GSI on created_at (independent partition key)
GlobalSecondaryIndexes: [
  {
    IndexName: 'created_at_index',
    KeySchema: [
      { AttributeName: 'created_at', KeyType: 'HASH' }  // Partition by date
    ]
  }
]

// Query: Fetch all users created after 2024-01-01
// ✅ Query GSI partition (4ms)

// Or: Use sparse GSI (only index users created after 2024-01-01)
// - Reduces index size (only recent users)
// - Lower storage cost`}
          </CodeBlock>

          <H3>❌ Mistake 2: Projecting ALL Attributes into GSI (Storage Bloat)</H3>
          <CodeBlock>
{`// BAD: Project ALL attributes into GSI
// Problem: 2× storage overhead

GlobalSecondaryIndexes: [
  {
    IndexName: 'email_index',
    Projection: { ProjectionType: 'ALL' }  // Duplicates entire table!
  }
]

// Storage:
// - Main table: 10M users × 1KB = 10GB
// - GSI: 10M users × 1KB = 10GB
// - Total: 20GB
// - Cost: $50/month ($2.50/GB × 20GB)

// GOOD: Project only needed attributes
GlobalSecondaryIndexes: [
  {
    IndexName: 'email_index',
    Projection: {
      ProjectionType: 'INCLUDE',
      NonKeyAttributes: ['user_id', 'name']  // Only what's needed for query
    }
  }
]

// Storage:
// - Main table: 10GB
// - GSI: 10M users × 50 bytes = 500MB (email + user_id + name)
// - Total: 10.5GB
// - Cost: $26/month (48% savings!)

// Query pattern:
// 1. Query GSI by email → get user_id (4ms)
// 2. If need full user record, fetch from main table by user_id (+3ms)
// Total: 7ms (acceptable for most use cases)`}
          </CodeBlock>

          <H3>❌ Mistake 3: Not Accounting for GSI Eventual Consistency</H3>
          <CodeBlock>
{`// BAD: Rely on GSI for immediate consistency
// Problem: User updates email, immediately queries by new email → not found!

// Step 1: User updates email
await dynamodb.update({
  TableName: 'Users',
  Key: { user_id: 'user123' },
  UpdateExpression: 'SET email = :newEmail',
  ExpressionAttributeValues: { ':newEmail': 'newemail@example.com' }
}).promise();
// Main table updated immediately (5ms)
// GSI update async (50-100ms lag)

// Step 2: Immediately query by new email
const result = await dynamodb.query({
  TableName: 'Users',
  IndexName: 'email_index',
  KeyConditionExpression: 'email = :email',
  ExpressionAttributeValues: { ':email': 'newemail@example.com' }
}).promise();
// ❌ Returns empty (GSI not updated yet!)

// GOOD: For critical read-after-write, use main table or wait
async function updateEmailSafely(userId, newEmail) {
  // Update main table
  await dynamodb.update({
    TableName: 'Users',
    Key: { user_id: userId },
    UpdateExpression: 'SET email = :newEmail',
    ExpressionAttributeValues: { ':newEmail': newEmail }
  }).promise();

  // Option 1: Read from main table (strong consistency)
  const user = await dynamodb.get({
    TableName: 'Users',
    Key: { user_id: userId },
    ConsistentRead: true
  }).promise();
  return user.Item;

  // Option 2: Wait for GSI to update (retry logic)
  let attempts = 0;
  while (attempts < 10) {
    const result = await dynamodb.query({
      TableName: 'Users',
      IndexName: 'email_index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': newEmail }
    }).promise();

    if (result.Items.length > 0) {
      return result.Items[0];
    }

    await sleep(50);  // Wait 50ms
    attempts++;
  }

  throw new Error('GSI not updated after 500ms');
}

// Result: Guaranteed consistency for critical operations`}
          </CodeBlock>

          <H3>❌ Mistake 4: Creating Too Many GSIs (Write Amplification)</H3>
          <CodeBlock>
{`// BAD: 10 GSIs for every possible query
// Problem: 1 write → 11 writes (main table + 10 GSIs)

GlobalSecondaryIndexes: [
  { IndexName: 'email_index', KeySchema: [{ AttributeName: 'email', ... }] },
  { IndexName: 'name_index', KeySchema: [{ AttributeName: 'name', ... }] },
  { IndexName: 'created_at_index', ... },
  { IndexName: 'country_index', ... },
  { IndexName: 'plan_index', ... },
  { IndexName: 'status_index', ... },
  // ... 4 more GSIs
]

// Write overhead:
// - Main table write: 5ms
// - 10 GSI writes: 10 × 3ms = 30ms
// - Total: 35ms (7× slower!)
// - Write amplification: 1 → 11 (1100%)

// Cost:
// - 1M writes/day × 11 = 11M writes/day
// - Write cost: 11× higher

// GOOD: Only create GSIs for frequent queries (>1000/day)
GlobalSecondaryIndexes: [
  { IndexName: 'email_index', KeySchema: [{ AttributeName: 'email', ... }] },
  { IndexName: 'created_at_index', ... }
]
// Only 2 GSIs for most common queries

// For rare queries (country, status, etc.):
// - Option 1: Full table scan (acceptable for rare queries)
// - Option 2: Export to Redshift/BigQuery for analytics
// - Option 3: Composite GSI (partition by status + created_at)

// Result: 3× write overhead instead of 11×`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: LSI vs GSI for User Lookup</H2>
          <InfoBox>
            <H3>User Management System (10M Users)</H3>
            <UL>
              <LI><Strong>Main Query:</Strong> Fetch user by email (10k queries/sec)</LI>
              <LI><Strong>Secondary Query:</Strong> Fetch user orders by (user_id + date) (5k queries/sec)</LI>
              <LI><Strong>Write Rate:</Strong> 1k user updates/sec</LI>
            </UL>

            <H3>Option 1: No Indexes (Baseline)</H3>
            <UL>
              <LI><Strong>Email Query:</Strong> Full table scan (30 seconds per query) ❌</LI>
              <LI><Strong>Unusable:</Strong> Cannot support 10k queries/sec</LI>
            </UL>

            <H3>Option 2: GSI on Email Only</H3>
            <UL>
              <LI><Strong>Email Query Latency:</Strong> 4ms (GSI lookup)</LI>
              <LI><Strong>User + Date Query:</Strong> Fetch user, filter in app (20ms)</LI>
              <LI><Strong>Write Latency:</Strong> 8ms (main + GSI)</LI>
              <LI><Strong>Storage:</Strong> 10GB (main) + 0.5GB (GSI email) = 10.5GB</LI>
              <LI><Strong>Cost:</Strong> $26/month storage + $100/month RCU/WCU = <Strong>$126/month</Strong></LI>
            </UL>

            <H3>Option 3: LSI on (user_id + created_at) + GSI on Email - Optimal</H3>
            <UL>
              <LI><Strong>Email Query Latency:</Strong> 4ms (GSI lookup)</LI>
              <LI><Strong>User + Date Query:</Strong> 2ms (LSI range query)</LI>
              <LI><Strong>Write Latency:</Strong> 8ms (main + LSI atomic + GSI async)</LI>
              <LI><Strong>Storage:</Strong> 10GB (main + LSI co-located) + 0.5GB (GSI) = 10.5GB</LI>
              <LI><Strong>Cost:</Strong> $26/month storage + $100/month RCU/WCU = <Strong>$126/month</Strong></LI>
              <LI><Strong>Performance Improvement:</Strong> User + date query 10× faster (20ms → 2ms)</LI>
            </UL>

            <H3>Cost Comparison</H3>
            <UL>
              <LI><Strong>LSI Overhead:</Strong> $0 (co-located with main table)</LI>
              <LI><Strong>GSI Overhead:</Strong> $1/month (0.5GB × $2.50/GB)</LI>
              <LI><Strong>Write Overhead:</Strong> 60% slower (5ms → 8ms), but acceptable</LI>
              <LI><Strong>Query Performance:</Strong> Email queries 7500× faster (30s → 4ms)</LI>
            </UL>

            <P>
              <Strong>Conclusion:</Strong> Hybrid LSI + GSI provides best query performance for both patterns
              at minimal cost ($126/month vs unusable without indexes).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>Secondary Index Guidelines:</Strong><br />
            • <Strong>LSI:</Strong> Query variations within partition (user_id + date), strong consistency, low overhead<br />
            • <Strong>GSI:</Strong> Cross-partition queries (email lookups, global filters), eventual consistency, higher overhead<br />
            • <Strong>Hybrid (LSI + GSI):</Strong> Optimize both within-partition and cross-partition queries<br /><br />
            <Strong>Golden Rule:</Strong> Only create indexes for frequent queries (&gt;1000/day).
            For rare queries, use full table scan or export to data warehouse.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

