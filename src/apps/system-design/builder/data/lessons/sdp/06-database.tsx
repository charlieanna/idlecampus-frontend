import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpDatabaseLesson: SystemDesignLesson = {
  id: 'sdp-database',
  slug: 'sdp-database',
  title: 'Database Design Patterns',
  description: 'Master database fundamentals and critical trade-offs: WHEN to use SQL vs NoSQL (data model + scale thresholds), HOW to balance normalization vs denormalization, WHICH scaling strategy fits your read/write patterns.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 70,
  stages: [
    {
      id: 'intro-database',
      type: 'concept',
      title: 'Database Design Patterns',
      content: (
        <Section>
          <H1>Database Design Patterns</H1>
          <P>
            Database design involves trade-offs between normalization, performance, and consistency.
          </P>

          <H2>Denormalization</H2>
          <P>
            <Strong>Denormalization</Strong> adds redundant data to improve read performance at the cost of
            write complexity and storage.
          </P>

          <Example title="Normalized vs Denormalized">
            <CodeBlock>
{`// Normalized (3NF)
users: {id, name, email}
orders: {id, user_id, total}
order_items: {order_id, product_id, quantity, price}

// Query: Get user's orders with items
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
WHERE u.id = 123
// Requires 3 joins → slow

// Denormalized
orders: {
  id, user_id, user_name, user_email,  // Redundant user data
  total, items_json  // Redundant items
}

// Query: Get user's orders
SELECT * FROM orders WHERE user_id = 123
// No joins → fast!`}
            </CodeBlock>
          </Example>

          <H2>SQL Optimization</H2>
          <UL>
            <LI><Strong>Indexes:</Strong> Create indexes on frequently queried columns</LI>
            <LI><Strong>Query Analysis:</Strong> Use EXPLAIN to understand query execution</LI>
            <LI><Strong>Avoid N+1 Queries:</Strong> Use JOINs instead of multiple queries</LI>
            <LI><Strong>Limit Results:</Strong> Use LIMIT to avoid fetching too much data</LI>
          </UL>

          <H2>NoSQL Data Models</H2>
          <UL>
            <LI><Strong>Key-Value Store:</Strong> Redis, DynamoDB - Simple key-value pairs</LI>
            <LI><Strong>Document Store:</Strong> MongoDB - JSON documents</LI>
            <LI><Strong>Wide-Column Store:</Strong> Cassandra - Column families</LI>
            <LI><Strong>Graph Database:</Strong> Neo4j - Nodes and edges</LI>
          </UL>

          <KeyPoint>
            <Strong>Trade-off:</Strong> Normalization ensures consistency but may be slow. Denormalization
            improves reads but requires careful write logic to maintain consistency.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'sql-vs-nosql-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: SQL vs NoSQL Database Selection',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: SQL vs NoSQL Database Selection</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing between SQL and NoSQL databases determines your data model flexibility,
            consistency guarantees, query capabilities, and operational costs. The wrong choice can cost $50k+/year in
            infrastructure and 6+ months of migration time.
          </P>

          <ComparisonTable
            headers={['Factor', 'PostgreSQL (SQL)', 'MongoDB (Document)', 'DynamoDB (Key-Value)', 'Cassandra (Wide-Column)']}
            rows={[
              ['Monthly Cost (1M writes/day)', '$200 (RDS t3.large)', '$350 (M30 Atlas)', '$2,000 (1GB + writes)', '$150 (3-node self-hosted)'],
              ['Monthly Cost (100M writes/day)', '$1,500 (r5.2xlarge)', '$2,500 (M60 Atlas)', '$60,000 (provisioned)', '$800 (9-node self-hosted)'],
              ['Data Model', 'Fixed schema, relations', 'Flexible JSON docs', 'Key-value pairs only', 'Wide rows, column families'],
              ['Query Flexibility', 'Complex SQL, JOINs, aggregations', 'Rich queries, no JOINs', 'Get/Put by key only', 'Limited queries per partition'],
              ['Consistency', 'ACID transactions', 'Eventual (default) or Strong', 'Eventual consistency', 'Tunable eventual'],
              ['Write Throughput', '10k-50k writes/sec', '50k-200k writes/sec', '200k+ writes/sec', '1M+ writes/sec per node'],
              ['Horizontal Scaling', 'Read replicas only (writes = bottleneck)', 'Sharding (auto in Atlas)', 'Auto-sharding', 'Linear scaling'],
              ['Best For', 'Complex queries, transactions, relations', 'Flexible schemas, rapid iteration', 'Simple lookups, extreme scale', 'Time-series, high write volume'],
            ]}
          />

          <Divider />

          <H2>Real Decision: E-commerce Platform</H2>
          <Example title="PostgreSQL vs MongoDB vs DynamoDB - Product Catalog">
            <CodeBlock>
{`Scenario: Product catalog, 1M products, 5M reads/day, 50k writes/day

Use Case 1: Complex filtering and search
Query: "Find products WHERE category = 'electronics' AND price < 500
       AND rating > 4.5 AND in_stock = true ORDER BY popularity"

PostgreSQL:
- Cost: $200/mo (t3.large RDS)
- Query: Native SQL with indexes → 50ms response
- JOINs: Can join orders, reviews, inventory tables
- Decision: ✅ BEST - Complex queries are easy

MongoDB:
- Cost: $350/mo (M30 Atlas)
- Query: Compound indexes support filtering → 80ms response
- JOINs: Must denormalize or use $lookup (slow)
- Decision: ⚠️ Works but more expensive

DynamoDB:
- Cost: $1,500/mo (provisioned for query scan)
- Query: No native filtering → scan entire table → 5sec response
- Must use secondary indexes for each query pattern
- Decision: ❌ BAD - Not designed for this

ROI: PostgreSQL saves $150/mo vs MongoDB ($1,800/year)

---

Use Case 2: Simple key-value lookups at massive scale
Query: "Get product by product_id" - 500M reads/day

PostgreSQL:
- Cost: $5,000/mo (r5.4xlarge + read replicas)
- Bottleneck: Single write leader limits scaling
- Decision: ❌ Expensive at this scale

DynamoDB:
- Cost: $2,000/mo (on-demand pricing)
- Query: Get by key → 5ms response
- Auto-scaling: Handles spikes automatically
- Decision: ✅ BEST - Designed for key-value

Cassandra:
- Cost: $800/mo (9-node cluster, self-hosted)
- Query: Get by partition key → 3ms response
- Decision: ✅ Cheapest but requires ops expertise

ROI: DynamoDB saves $3,000/mo vs PostgreSQL ($36k/year)
     Cassandra saves $1,200/mo vs DynamoDB ($14.4k/year)
     But: Cassandra needs $150k/year SRE → not worth it`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# SQL vs NoSQL Decision Tree

if (need_complex_queries || need_joins || need_transactions):
    if (write_throughput < 50k_per_sec):
        return "PostgreSQL"  # Best general-purpose choice
    else:
        return "CockroachDB"  # Distributed SQL for scale

elif (need_flexible_schema || rapid_iteration):
    if (team_knows_sql && budget < $500/mo):
        return "PostgreSQL with JSONB"  # Best of both worlds
    elif (query_patterns_known):
        return "MongoDB"  # Document model + rich queries
    else:
        return "PostgreSQL"  # Schema changes easier than migration

elif (access_pattern == "key_value_only"):
    if (write_volume > 100k_per_sec):
        return "Cassandra"  # Highest write throughput
    elif (aws_shop && operational_simplicity):
        return "DynamoDB"  # Managed, auto-scaling
    else:
        return "Redis + PostgreSQL"  # Cache + durability

elif (time_series_data || log_aggregation):
    if (budget > $1k/mo):
        return "TimescaleDB"  # PostgreSQL extension
    else:
        return "Cassandra"  # Cost-effective at scale

else:
    return "PostgreSQL"  # Default choice for 80% of applications`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Choosing MongoDB because "schema flexibility"</Strong>
            <P>
              Reality: Most applications have stable schemas. MongoDB costs $150-350/mo more than PostgreSQL
              for same workload, and PostgreSQL JSONB columns provide schema flexibility when needed.
            </P>
            <P>
              <Strong>Fix:</Strong> Use PostgreSQL with JSONB for flexible fields. Example: <Code>users</Code> table
              with fixed columns (id, email, created_at) + <Code>metadata JSONB</Code> for flexible attributes.
              Get SQL power + flexibility at lower cost.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using DynamoDB for complex queries</Strong>
            <P>
              Symptom: Creating 10+ secondary indexes, scan operations timing out, $5k+/mo query costs.
              DynamoDB charges per query → complex filtering = expensive scans.
            </P>
            <P>
              <Strong>Fix:</Strong> Use DynamoDB only for key-value lookups. If you need filtering/searching,
              use PostgreSQL ($200/mo) or add Elasticsearch ($400/mo) for search. Combined cost still cheaper
              than DynamoDB scans ($5k/mo).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Premature NoSQL adoption at startup</Strong>
            <P>
              Mistake: "We'll need to scale to billions of users" → choosing Cassandra from day 1. Reality:
              95% of startups never reach scale requiring NoSQL, but pay complexity tax immediately (no JOINs,
              eventual consistency bugs, learning curve).
            </P>
            <P>
              <Strong>Fix:</Strong> Start with PostgreSQL (handles 100k+ TPS with proper setup). Migrate to NoSQL
              only when you hit proven bottlenecks (typically at 50-100M users). Instagram used PostgreSQL until
              30M users. Early optimization wastes 6+ months of engineering time.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce startup with product catalog + transactions. PostgreSQL
            ($200/mo) handles 1M users for 2 years = $4,800 total cost. Premature Cassandra requires $150k/year
            SRE + 6 months engineering time ($300k opportunity cost) = $604k waste. Migration at proven scale
            (year 3+) costs $50k but needed anyway. Save $554k by starting simple.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'normalization-denormalization-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Normalization vs Denormalization',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Normalization vs Denormalization</H1>
          <P>
            <Strong>The Decision:</Strong> Normalization (3NF) eliminates data redundancy and ensures consistency,
            but requires JOINs that slow reads. Denormalization duplicates data for faster reads, but requires
            careful write logic to maintain consistency. The difference can be 10x query performance or 100+ hours
            of debugging inconsistent data.
          </P>

          <ComparisonTable
            headers={['Factor', 'Full Normalization (3NF)', 'Partial Denormalization', 'Full Denormalization', 'Materialized Views']}
            rows={[
              ['Query Performance', '100-500ms (3-5 JOINs)', '20-50ms (1-2 JOINs)', '5-10ms (no JOINs)', '5-10ms (pre-computed)'],
              ['Write Complexity', 'Simple (single update)', 'Medium (2-3 table updates)', 'High (5+ table updates)', 'Simple (DB handles it)'],
              ['Storage Cost', 'Baseline ($100/mo 100GB)', '+20% ($120/mo)', '+50-100% ($150-200/mo)', '+30% ($130/mo)'],
              ['Consistency Risk', 'Zero (ACID guarantees)', 'Low (transaction logic)', 'High (manual sync)', 'Zero (DB maintains)'],
              ['Maintenance Burden', 'Low (schema migrations)', 'Medium (migration + sync logic)', 'High (complex sync logic)', 'Low (DB updates views)'],
              ['Best For', 'OLTP (writes > reads)', 'Mixed workloads', 'Read-heavy (10:1 read/write)', 'Analytics, reporting'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Social Media Feed</H2>
          <Example title="User Feed Query - Normalization Performance Impact">
            <CodeBlock>
{`Scenario: Display user feed with posts, author info, like counts, comments
Load: 1M feed requests/day, avg 20 posts per feed

---

Approach 1: Full Normalization (3NF)
Schema:
  users: {id, name, avatar_url}
  posts: {id, user_id, content, created_at}
  likes: {post_id, user_id}
  comments: {id, post_id, user_id, text}

Query:
SELECT
  p.*, u.name, u.avatar_url,
  COUNT(DISTINCT l.user_id) as like_count,
  COUNT(DISTINCT c.id) as comment_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.id IN (SELECT post_id FROM feed WHERE user_id = 123)
GROUP BY p.id, u.name, u.avatar_url
ORDER BY p.created_at DESC
LIMIT 20

Performance: 450ms avg (4 JOINs, 2 aggregations)
Database load: 75% CPU (r5.xlarge = $350/mo)
User experience: ❌ Slow, feels laggy

---

Approach 2: Partial Denormalization
Schema:
  users: {id, name, avatar_url}
  posts: {
    id, user_id, content, created_at,
    author_name, author_avatar,  // Denormalized
    like_count, comment_count     // Cached counts
  }
  likes: {post_id, user_id}
  comments: {id, post_id, user_id, text}

Query:
SELECT * FROM posts
WHERE id IN (SELECT post_id FROM feed WHERE user_id = 123)
ORDER BY created_at DESC
LIMIT 20

Performance: 35ms avg (1 JOIN eliminated, counts pre-computed)
Database load: 40% CPU (t3.large = $150/mo)
Write logic: On like → UPDATE posts SET like_count = like_count + 1
User experience: ✅ Fast and smooth

Trade-off:
- Storage: +15% (author data duplicated, counts cached)
- Write complexity: Must update post.like_count on each like
- Consistency: Author name changes require UPDATE posts SET author_name

Cost savings: $200/mo cheaper database ($2,400/year)
Performance gain: 13x faster (450ms → 35ms)

---

Approach 3: Full Denormalization (cache everything)
Schema:
  posts: {
    id, content, created_at,
    author: {name, avatar, follower_count},  // JSON
    like_count, comment_count,
    recent_likes: [{user_id, name, avatar}], // Last 3 likes
    recent_comments: [{text, author_name}]   // Last 2 comments
  }

Query:
SELECT * FROM posts WHERE id IN (...)

Performance: 8ms avg (no JOINs, no aggregations)
Storage: +80% ($280/mo for 180GB)
Write complexity: HIGH - like requires 3 updates:
  1. Insert into likes table
  2. UPDATE posts.like_count
  3. UPDATE posts.recent_likes array

Consistency risk: Recent_likes can become stale if user changes name
User experience: ✅ Very fast

Trade-off: 8ms vs 35ms (4x faster) not worth 80% storage + complexity
Decision: ❌ Over-optimization - partial denorm is sweet spot

---

Approach 4: Materialized Views (PostgreSQL)
Schema: Normalized (same as Approach 1)
Materialized view:
CREATE MATERIALIZED VIEW post_feed_cache AS
  SELECT p.*, u.name, u.avatar_url,
         COUNT(l.user_id) as like_count
  FROM posts p JOIN users u ON p.user_id = u.id
  LEFT JOIN likes l ON p.id = l.post_id
  GROUP BY p.id, u.name, u.avatar_url;

REFRESH MATERIALIZED VIEW CONCURRENTLY post_feed_cache;

Query: SELECT * FROM post_feed_cache WHERE id IN (...)
Performance: 12ms avg
Consistency: Refresh every 5 minutes (acceptable staleness)
Maintenance: Low (DB handles refresh)

Decision: ✅ Best if staleness acceptable (analytics use case)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Normalization vs Denormalization Decision Tree

if (write_frequency > read_frequency):
    return "Full Normalization (3NF)"  # Writes matter most

elif (query_latency_p95 > 200ms && user_facing):
    if (data_changes_infrequently):  # Author names, product info
        return "Denormalize static data"
    elif (counts_queries_slow):  # Like counts, comment counts
        return "Cache aggregated counts"
    elif (complex_joins && staleness_acceptable):
        return "Materialized Views"
    else:
        return "Partial Denormalization + transaction logic"

elif (analytics_workload):
    return "Materialized Views"  # Best for reporting

elif (read_write_ratio > 100 && consistency_critical):
    if (database == "PostgreSQL"):
        return "Materialized Views (refresh every 5min)"
    else:
        return "Event-driven denorm (Kafka → update)"

else:
    return "Full Normalization (3NF)"  # Default to simple`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Denormalizing without write transaction logic</Strong>
            <P>
              Symptom: User changes name → some posts show old name, some show new name. Inconsistent data causes
              user confusion and support tickets (avg 50 tickets/month = $5k support cost).
            </P>
            <P>
              <Strong>Fix:</Strong> Implement proper write logic with transactions. Example: On user name change,
              use DB transaction to update both <Code>users.name</Code> AND <Code>UPDATE posts SET author_name =
              new_name WHERE user_id = X</Code>. Or use event-driven approach: publish UserNameChanged event →
              async worker updates denormalized data. Accept eventual consistency (updates within 1 second).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Over-denormalizing for marginal gains</Strong>
            <P>
              Example: Denormalizing to improve query from 50ms → 20ms (2.5x gain) but adding 100 lines of sync logic
              that causes 3 production bugs in 6 months. Each bug causes 30min downtime = $15k revenue loss.
            </P>
            <P>
              <Strong>Fix:</Strong> Only denormalize if gain is significant (200ms → 50ms = 4x) AND user-facing.
              For admin panels or internal tools, JOINs are fine. Use caching (Redis) as first optimization before
              denormalization. Cache hit reduces 200ms query to 5ms without code complexity.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using database features (materialized views, JSONB)</Strong>
            <P>
              Mistake: Building custom denormalization logic in application code when PostgreSQL materialized views
              handle it automatically. Custom logic = 200+ lines of code vs 5-line CREATE MATERIALIZED VIEW statement.
            </P>
            <P>
              <Strong>Fix:</Strong> Use materialized views for read-heavy analytics queries. Refresh every 5-15 minutes
              in background. For flexible schemas, use PostgreSQL JSONB columns instead of full denormalization. JSONB
              is indexed and queryable, giving flexibility without consistency issues.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce product listings with 200ms JOIN queries. Partial denormalization
            (cache product category name, brand name) reduces to 45ms (4.4x faster). Investment: 40 hours engineering
            ($8k). Result: Conversion rate increases 0.5% (faster page loads) = $50k/year additional revenue. ROI: 6.25x
            in first year. Alternative: Add Redis cache for $100/mo = same performance without denormalization complexity.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'database-scaling-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Database Scaling Strategies',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Database Scaling Strategies</H1>
          <P>
            <Strong>The Decision:</Strong> When your database reaches capacity, you can scale vertically (bigger machine),
            horizontally with read replicas (multiple read-only copies), or shard (split data across databases). Each
            approach has different cost curves, complexity, and scale limits. The wrong choice can waste $100k/year or
            require a 6-month re-architecture.
          </P>

          <ComparisonTable
            headers={['Factor', 'Vertical Scaling', 'Read Replicas', 'Sharding', 'NewSQL (CockroachDB)']}
            rows={[
              ['Cost at 10k QPS', '$350/mo (r5.xlarge)', '$700/mo (1 leader + 2 replicas)', '$1,500/mo (4 shards)', '$800/mo (3-node cluster)'],
              ['Cost at 100k QPS', '$2,800/mo (r5.8xlarge)', '$4,200/mo (1 leader + 6 replicas)', '$6,000/mo (16 shards)', '$2,400/mo (9-node cluster)'],
              ['Max Scale', '~100k QPS (hardware limit)', '~500k QPS reads (writes bottleneck)', '10M+ QPS (linear)', '1M+ QPS (linear)'],
              ['Write Throughput', 'Single machine limit (50k/sec)', 'No improvement (single leader)', 'Linear scaling', 'Distributed writes'],
              ['Complexity', 'Zero (just upgrade)', 'Low (connection routing)', 'Very High (app-level logic)', 'Low (looks like single DB)'],
              ['Consistency', 'Strong (ACID)', 'Eventual (replica lag 50-200ms)', 'Varies per shard', 'Strong (ACID across nodes)'],
              ['Migration Effort', '1 hour (downtime or blue-green)', '1 day (setup replicas)', '6 months (rearchitect app)', '2 weeks (migrate data)'],
              ['Best For', 'Early stage (< 50k QPS)', 'Read-heavy (10:1 read/write)', 'Massive scale (100M+ users)', 'Need scale + simplicity'],
            ]}
          />

          <Divider />

          <H2>Real Decision: SaaS Application Growth</H2>
          <Example title="Scaling Strategy Progression - Real Costs">
            <CodeBlock>
{`Scenario: B2B SaaS analytics platform growing from 100 → 10,000 customers

---

Stage 1: 100 customers, 5k QPS (80% reads, 20% writes)
Strategy: Single PostgreSQL instance

Database: t3.large ($150/mo)
Performance: 30ms p95 latency
Capacity: Can handle 10k QPS
Decision: ✅ Perfect for early stage

When to move: QPS exceeds 8k OR latency > 100ms

---

Stage 2: 1,000 customers, 25k QPS (85% reads, 15% writes)
Problem: t3.large at 90% CPU, latency spiking to 300ms

Option A: Vertical Scaling
- Upgrade to r5.2xlarge ($700/mo)
- Performance: Latency back to 40ms
- Capacity: Can handle 50k QPS
- Effort: 1 hour migration (or zero-downtime blue-green)
- Decision: ✅ Simplest solution, 3x headroom

Cost: $700/mo = $8,400/year

Option B: Read Replicas (premature)
- t3.large leader + 2 replicas ($450/mo)
- Complexity: App needs read/write routing logic
- Problem: Writes still bottlenecked on single leader
- Replica lag: 100ms → stale data bugs
- Decision: ❌ Not needed yet (only 85% reads)

When to add replicas: Vertical scaling too expensive (> $2k/mo)

---

Stage 3: 5,000 customers, 80k QPS (90% reads, 10% writes)
Problem: r5.2xlarge at 85% CPU, next size is r5.4xlarge ($1,400/mo)

Option A: Continue Vertical Scaling
- Upgrade to r5.4xlarge ($1,400/mo)
- Capacity: Can handle 120k QPS
- But: Next jump is r5.8xlarge ($2,800/mo)
- Cost curve getting steep
- Decision: ⚠️ Works but hitting diminishing returns

Option B: Read Replicas
- r5.xlarge leader ($350/mo) + 3 read replicas ($1,050/mo)
- Total: $1,400/mo (same cost as vertical scaling)
- Capacity: 200k QPS reads, 15k QPS writes
- Complexity: Add read replica routing (2 days work)
- Replica lag: 50-100ms (acceptable for analytics)
- Decision: ✅ Better scalability + same cost

Cost: $1,400/mo = $16,800/year
Scales to: 200k QPS reads

When to shard: Write throughput exceeds 50k/sec OR > 10TB data

---

Stage 4: 10,000 customers, 200k QPS (92% reads, 8% writes)
Problem: Write leader at 80% CPU, replicas handling reads fine

Option A: Vertical scale write leader
- Upgrade leader to r5.2xlarge ($700/mo) + 4 replicas ($1,400/mo)
- Total: $2,100/mo
- Capacity: 300k QPS reads, 30k QPS writes
- Decision: ✅ Still viable, buys 2 more years

Option B: Sharding (premature)
- Split by customer_id into 4 shards
- Cost: $2,400/mo (4 × r5.large)
- Effort: 6 months engineering ($300k opportunity cost)
- Complexity: App-level shard routing, cross-shard queries break
- Decision: ❌ Not needed until 50k+ writes/sec

Option C: NewSQL (CockroachDB)
- 6-node cluster ($2,000/mo managed)
- Capacity: 500k QPS, distributed writes
- Migration: 2 weeks (similar to PostgreSQL)
- Trade-off: 10-20ms higher latency vs PostgreSQL
- Decision: ⚠️ Consider if writes growing fast

When to shard:
- Write throughput > 50k/sec (can't vertical scale further)
- Data size > 10TB (single DB too large)
- Clear shard key (customer_id, tenant_id)

---

Cost Summary Over 3 Years:

Path A: Vertical Scaling Only
Year 1: $8,400 (r5.2xlarge)
Year 2: $16,800 (r5.4xlarge)
Year 3: $33,600 (r5.8xlarge)
Total: $58,800

Path B: Vertical → Read Replicas
Year 1: $8,400 (r5.2xlarge)
Year 2: $16,800 (r5.xlarge + 3 replicas)
Year 3: $25,200 (r5.2xlarge leader + 4 replicas)
Total: $50,400
Savings: $8,400 (14% cheaper) + better scalability

Path C: Premature Sharding (Year 1)
Year 1-3: $28,800/year × 3 = $86,400
Engineering cost: $300k (6 months)
Total: $386,400
Waste: $327,600 vs Path B (6.5x more expensive!)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Database Scaling Decision Tree

current_qps = measure_peak_qps()
read_ratio = reads / (reads + writes)
write_throughput = measure_writes_per_sec()
data_size = get_database_size_gb()

if (current_qps < 10k):
    return "Single instance (t3.large or r5.large)"

elif (current_qps < 50k):
    return "Vertical scaling (r5.2xlarge or r5.4xlarge)"

elif (read_ratio > 0.85 && current_qps < 200k):
    return "Vertical leader + Read Replicas"
    # Example: r5.xlarge leader + 3 replicas

elif (write_throughput > 50k_per_sec || data_size > 10_TB):
    if (clear_shard_key && team_has_expertise):
        return "Sharding"  # Last resort for massive scale
    else:
        return "NewSQL (CockroachDB, YugabyteDB)"
        # Distributed SQL = sharding without app complexity

elif (need_global_distribution):
    return "Multi-region NewSQL or Aurora Global"

else:
    return "Vertical + Read Replicas"  # Handles 95% of cases

# Red flags for premature sharding:
if (write_throughput < 30k_per_sec):
    warning("Sharding not justified - use read replicas")
if (no_clear_shard_key):
    warning("No tenant_id or user_id - cross-shard queries will break app")
if (data_size < 5_TB):
    warning("Sharding overkill - vertical scaling + replicas cheaper")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Premature sharding to "prepare for scale"</Strong>
            <P>
              Example: Startup at 10k QPS (fits on single r5.large = $350/mo) implements sharding "to be ready for
              growth". Result: 6 months engineering time ($300k cost), ongoing complexity (cross-shard JOINs don't work),
              but company never reaches scale requiring sharding (only 5% of startups do).
            </P>
            <P>
              <Strong>Fix:</Strong> Follow staged scaling: Single instance → Vertical scaling → Read replicas → Sharding.
              Migrate to next stage only when current stage is at 80% capacity. Most companies never need sharding (Instagram
              used PostgreSQL + replicas until 30M users). Shard only at proven scale (50k+ writes/sec or 10TB+ data).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Not using read replicas for read-heavy workloads</Strong>
            <P>
              Symptom: Spending $2,800/mo on r5.8xlarge for 100k QPS with 95% reads. Could use $700/mo (r5.large leader +
              3 replicas) instead. Wasting $2,100/mo = $25k/year on oversized single instance.
            </P>
            <P>
              <Strong>Fix:</Strong> If read ratio {'>'}‎ 85%, add read replicas before vertical scaling past r5.2xlarge. Setup:
              1) Create replicas, 2) Route reads to replicas (use connection pooler like PgBouncer), 3) Accept 50-100ms
              replica lag (fine for analytics, dashboards). For strong consistency needs, read from leader only.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Sharding without a clear shard key</Strong>
            <P>
              Example: Sharding by auto-increment <Code>id</Code> → users spread across shards → every query requires
              scatter-gather across all shards → 10x slower than before sharding. Now stuck with complex infrastructure
              and worse performance.
            </P>
            <P>
              <Strong>Fix:</Strong> Only shard if you have natural partition key: <Code>tenant_id</Code> (B2B SaaS),
              <Code>user_id</Code> (social app), <Code>region</Code> (geographic data). All queries should include shard
              key. If no clear shard key, use NewSQL (CockroachDB) instead - gives distributed scale without app-level
              sharding logic.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> SaaS at 80k QPS (90% reads). Option 1: r5.4xlarge single instance = $1,400/mo.
            Option 2: r5.large leader + 3 replicas = $1,400/mo BUT scales to 250k QPS vs 120k QPS. Next growth phase:
            Option 1 needs $2,800/mo (r5.8xlarge), Option 2 adds 1 replica for $1,750/mo. Over 3 years, replicas save
            $37,800 + provide better availability (replica can be promoted if leader fails). 2 days engineering investment
            for multi-year savings.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'index-strategy-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Index Strategy',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Index Strategy</H1>
          <P>
            <Strong>The Decision:</Strong> Indexes speed up reads (100x faster) but slow down writes and consume storage.
            The right indexes make queries instant; wrong indexes waste 50% of storage and degrade write performance by
            40%. Most databases are either over-indexed (slowing writes) or under-indexed (slowing reads).
          </P>

          <ComparisonTable
            headers={['Factor', 'No Index (Table Scan)', 'B-tree Index', 'Hash Index', 'Partial Index', 'Covering Index']}
            rows={[
              ['Read Performance', '5000ms (scan 10M rows)', '50ms (log(n) lookup)', '5ms (O(1) lookup)', '30ms (smaller index)', '10ms (no table access)'],
              ['Write Performance', 'Baseline (100%)', '-20% (update index)', '-15% (simpler than B-tree)', '-10% (fewer rows)', '-30% (update all columns)'],
              ['Storage Cost', '1GB table', '+200MB (full index)', '+150MB (hash simpler)', '+50MB (filtered rows)', '+400MB (includes columns)'],
              ['Use Case', 'Small tables (< 10k rows)', 'Range queries, sorting', 'Exact match lookups', 'Filtering subset', 'Query uses index only'],
              ['Flexibility', 'Works for all queries', 'Range + equality', 'Equality only', 'Specific WHERE clause', 'Specific SELECT columns'],
              ['Maintenance', 'None', 'Auto (vacuuming)', 'Auto (vacuuming)', 'Auto (vacuuming)', 'Auto (vacuuming)'],
            ]}
          />

          <Divider />

          <H2>Real Decision: E-commerce Product Search</H2>
          <Example title="Index Strategy - Performance vs Cost Trade-Offs">
            <CodeBlock>
{`Scenario: Product catalog with 10M products, 1000 writes/sec, 50k reads/sec
Table: products (id, name, category, price, brand, in_stock, created_at)

---

Query 1: Product search by category and price range
SELECT * FROM products
WHERE category = 'electronics' AND price BETWEEN 100 AND 500
ORDER BY created_at DESC
LIMIT 20;

Without Index:
- Query plan: Sequential scan of 10M rows
- Performance: 5000ms (scans entire table)
- User experience: ❌ Unusable (timeout after 3 sec)

Option A: B-tree index on category
CREATE INDEX idx_category ON products(category);

- Query plan: Index scan (500k electronics) + filter price
- Performance: 800ms (still scans 500k rows for price filter)
- Improvement: 6.25x faster but still too slow
- Cost: +150MB storage

Option B: Composite B-tree index on (category, price)
CREATE INDEX idx_category_price ON products(category, price);

- Query plan: Index scan with range on price
- Performance: 50ms (uses both columns efficiently)
- Improvement: 100x faster ✅
- Cost: +200MB storage
- Write impact: Inserts 15% slower (800 → 680 inserts/sec)
- Decision: ✅ BEST - massive read improvement worth write cost

Storage cost: 1.2GB → 1.4GB (+17%) = +$15/mo
Read performance: 5000ms → 50ms (100x faster)
Write performance: 1000/sec → 850/sec (15% slower, acceptable)

ROI: Page load time drops 5 seconds → conversion increases 2% =
     $50k/year revenue vs $180/year storage cost = 278× ROI

---

Query 2: Active products by brand (in_stock = true)
SELECT * FROM products
WHERE brand = 'Apple' AND in_stock = true;

Problem: 95% of products are in_stock → full index wastes space

Option A: Full B-tree index on (brand, in_stock)
CREATE INDEX idx_brand_stock ON products(brand, in_stock);

- Storage: +250MB (indexes all 10M rows)
- Performance: 40ms
- Write impact: -20%

Option B: Partial index (only in_stock = true)
CREATE INDEX idx_brand_stock_active ON products(brand, in_stock)
WHERE in_stock = true;

- Storage: +50MB (indexes only 9.5M rows)
- Performance: 35ms (same speed, smaller index)
- Write impact: -12% (fewer index updates when out of stock)
- Decision: ✅ BEST - 80% storage savings

Savings: 200MB storage = $20/mo, Write performance 8% better

---

Query 3: Product listing page (admin dashboard)
SELECT id, name, price, brand FROM products
WHERE category = 'electronics'
ORDER BY created_at DESC
LIMIT 50;

Option A: Index on category (existing)
- Query plan: Index scan → fetch 50 rows from table
- Performance: 60ms (index lookup + table access)
- Disk I/O: Index seek + 50 random table reads

Option B: Covering index (includes all SELECT columns)
CREATE INDEX idx_category_covering ON products(category, created_at, id, name, price, brand);

- Query plan: Index-only scan (no table access!)
- Performance: 15ms (4x faster)
- Storage: +400MB (includes all columns in index)
- Trade-off: 4x speed vs 2x storage of regular index
- Decision: ⚠️ Use only for critical queries (homepage)

For admin dashboard: ❌ Not worth it (60ms acceptable)
For public homepage: ✅ Worth it (15ms noticeable improvement)

---

Index Strategy Summary:

Total indexes created: 2 (composite category_price + partial brand_stock)
Storage overhead: +250MB (1GB → 1.25GB) = +$25/mo
Write throughput: 1000/sec → 850/sec (15% slower, acceptable)
Read performance:
  - Product search: 5000ms → 50ms (100x faster)
  - Brand filter: 5000ms → 35ms (143x faster)

Total cost: $25/mo storage + $50/mo slightly larger instance
Total revenue: +$50k/year from faster load times
Net ROI: $900/year cost → $50k/year gain = 55× ROI

---

Anti-pattern: Over-indexing

Bad approach: "Let's index everything to be safe!"
CREATE INDEX idx_name ON products(name);
CREATE INDEX idx_price ON products(price);
CREATE INDEX idx_brand ON products(brand);
CREATE INDEX idx_created ON products(created_at);
CREATE INDEX idx_category ON products(category);
CREATE INDEX idx_stock ON products(in_stock);

Result:
- Storage: +1.2GB (120% overhead!) = +$120/mo
- Write performance: 1000/sec → 400/sec (60% slower!)
- Problem: Most indexes never used (EXPLAIN shows table scan)
- Symptom: DB at 80% CPU despite low traffic

Fix: Use EXPLAIN ANALYZE to find slow queries, index only those.
Remove unused indexes: Check pg_stat_user_indexes for idx_scan = 0`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Index Strategy Decision Tree

# Step 1: Identify slow queries (p95 > 100ms)
for query in slow_queries:
    explain_plan = run_explain_analyze(query)

    if (explain_plan.shows("Seq Scan") && table_size > 10k_rows):
        # Found problematic query - needs index

        # Step 2: Analyze WHERE clause
        where_columns = extract_where_columns(query)

        if (single_column && equality_only):
            create_index("B-tree index on column")
            # Example: WHERE user_id = 123

        elif (single_column && range_query):
            create_index("B-tree index on column")
            # Example: WHERE created_at > '2024-01-01'

        elif (multiple_columns):
            # Create composite index
            # Order: equality first, range last
            # Example: WHERE category = 'X' AND price > 100
            create_index("(category, price)")

        elif (filters_small_subset):
            # < 20% of rows match WHERE clause
            create_index("Partial index with WHERE clause")
            # Example: WHERE status = 'active' (only 5% of rows)

    # Step 3: Check if covering index helps
    if (query_latency_still > 50ms && critical_path):
        select_columns = extract_select_columns(query)
        if (len(select_columns) < 5 && total_column_size < 200_bytes):
            create_index("Covering index with INCLUDE columns")
        else:
            skip("Covering index too large")

    # Step 4: Monitor write impact
    if (write_throughput_drops > 30%):
        warning("Too many indexes - review and remove unused")
        for index in indexes:
            if (index.scan_count == 0):
                drop_index(index)  # Unused index

# Index maintenance rules:
if (table_size > 1GB):
    run("VACUUM ANALYZE weekly")  # Update statistics

if (index_size > 50% of table_size):
    review("Too many indexes - check pg_stat_user_indexes")

# Common index patterns:
if (uuid_primary_key && high_insert_rate):
    use("UUID v7 or ULID")  # Sequential UUIDs prevent index bloat

if (timestamp_queries_common):
    index("created_at DESC")  # DESC for ORDER BY DESC queries`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Creating indexes on every column "just in case"</Strong>
            <P>
              Symptom: 20 indexes on 8-column table, writes slow to crawl (1000/sec → 200/sec), storage doubled.
              Check pg_stat_user_indexes shows idx_scan = 0 for 15 indexes (never used!). Each write updates all
              indexes, even unused ones.
            </P>
            <P>
              <Strong>Fix:</Strong> Index only proven slow queries. Use EXPLAIN ANALYZE to find sequential scans on
              large tables ({'>'}‎ 10k rows). Remove unused indexes: <Code>SELECT indexrelname, idx_scan FROM pg_stat_user_indexes
              WHERE idx_scan = 0 AND indexrelname NOT LIKE 'pg_%'</Code>. Aim for 2-5 indexes per table maximum.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Wrong column order in composite indexes</Strong>
            <P>
              Example: Query <Code>WHERE category = 'X' AND price &gt; 100</Code> with index <Code>(price, category)</Code>.
              Index unusable! PostgreSQL can't skip to category without scanning price range first. Query still does
              sequential scan (5000ms).
            </P>
            <P>
              <Strong>Fix:</Strong> Composite index column order: equality filters first, range filters last. Correct:
              <Code>CREATE INDEX ON products(category, price)</Code>. Rule: most selective column first, range column
              last. Use <Code>EXPLAIN</Code> to verify index is used (shows "Index Scan" not "Seq Scan").
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using partial indexes for skewed data</Strong>
            <P>
              Example: <Code>status</Code> column where 99% of rows are 'completed', but queries filter for 'pending'
              (1% of data). Full index wastes 99% of space indexing rows that are never queried. Index size: 500MB,
              but only 5MB useful.
            </P>
            <P>
              <Strong>Fix:</Strong> Use partial index: <Code>CREATE INDEX ON orders(status) WHERE status = 'pending'</Code>.
              Index only 1% of rows (5MB vs 500MB). Saves 495MB storage ($50/mo) and speeds up writes (99% fewer index
              updates). Use for any column where queries filter for rare values: active_only, is_deleted = false, priority = 'high'.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce site with 10M products, product search taking 5000ms (table scan).
            Add composite index on (category, price): query drops to 50ms (100x faster). Cost: $25/mo storage + 2 hours
            engineering ($400). Result: Page load 5 sec faster → conversion rate +2% = $50k/year additional revenue. First
            year ROI: 125× ($50k gain / $400 investment). Ongoing: $600/year cost for $50k/year benefit = 83× annual ROI.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

