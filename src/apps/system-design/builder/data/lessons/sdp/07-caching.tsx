import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpCachingLesson: SystemDesignLesson = {
  id: 'sdp-caching',
  slug: 'sdp-caching',
  title: 'Caching Strategies',
  description: 'Master caching fundamentals and critical trade-offs: WHEN to cache vs optimize queries, WHICH caching pattern fits your consistency needs, HOW to balance hit rate vs memory cost.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,
  stages: [
    {
      id: 'intro-caching',
      type: 'concept',
      title: 'Caching Strategies',
      content: (
        <Section>
          <H1>Caching Strategies</H1>
          <P>
            Different caching patterns optimize for different use cases. Choose based on read/write patterns.
          </P>

          <H2>Cache-Aside (Lazy Loading)</H2>
          <P>
            Application manages cache. Most common pattern.
          </P>
          <OL>
            <LI>Check cache for data</LI>
            <LI>If miss: Read from database</LI>
            <LI>Write to cache</LI>
            <LI>Return data</LI>
          </OL>
          <P>
            <Strong>Pros:</Strong> Simple, cache only what's needed<br/>
            <Strong>Cons:</Strong> Cache miss penalty, possible stale data
          </P>

          <H2>Write-Through</H2>
          <P>
            Write to cache and database simultaneously.
          </P>
          <OL>
            <LI>Write to cache</LI>
            <LI>Write to database</LI>
            <LI>Return success</LI>
          </OL>
          <P>
            <Strong>Pros:</Strong> Cache always consistent<br/>
            <Strong>Cons:</Strong> Slower writes (two writes)
          </P>

          <H2>Write-Behind (Write-Back)</H2>
          <P>
            Write to cache immediately, write to database asynchronously.
          </P>
          <OL>
            <LI>Write to cache</LI>
            <LI>Return success immediately</LI>
            <LI>Write to database in background</LI>
          </OL>
          <P>
            <Strong>Pros:</Strong> Fast writes<br/>
            <Strong>Cons:</Strong> Risk of data loss if cache fails before DB write
          </P>

          <H2>Refresh-Ahead</H2>
          <P>
            Proactively refresh cache before expiration.
          </P>
          <UL>
            <LI>If cache entry expires in 5 minutes, refresh at 4 minutes</LI>
            <LI>User always gets fresh data</LI>
            <LI>Useful for predictable access patterns</LI>
          </UL>

          <H2>Cache Eviction Policies</H2>
          <UL>
            <LI><Strong>LRU (Least Recently Used):</Strong> Evict least recently accessed</LI>
            <LI><Strong>LFU (Least Frequently Used):</Strong> Evict least frequently accessed</LI>
            <LI><Strong>FIFO (First In First Out):</Strong> Evict oldest entry</LI>
            <LI><Strong>TTL (Time To Live):</Strong> Evict after expiration time</LI>
          </UL>

          <ComparisonTable
            headers={['Strategy', 'Use Case', 'Consistency']}
            rows={[
              ['Cache-Aside', 'Read-heavy', 'Eventual'],
              ['Write-Through', 'Read/write balanced', 'Strong'],
              ['Write-Behind', 'Write-heavy', 'Eventual'],
              ['Refresh-Ahead', 'Predictable access', 'Strong'],
            ]}
          />

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use cache-aside for most cases. Use write-through when consistency
            is critical. Use write-behind only if you can tolerate data loss.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'caching-pattern-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Caching Pattern Selection',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Caching Pattern Selection</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing between cache-aside, write-through, write-behind, and refresh-ahead
            patterns determines your consistency guarantees, write latency, and data loss risk. The wrong choice can cause
            stale data bugs (costing user trust), slow writes (degrading UX), or cache failures losing critical data.
          </P>

          <ComparisonTable
            headers={['Factor', 'Cache-Aside', 'Write-Through', 'Write-Behind', 'Refresh-Ahead']}
            rows={[
              ['Write Latency', '50ms (DB only)', '150ms (cache + DB serial)', '10ms (cache only)', '50ms (DB only)'],
              ['Read Latency (hit)', '5ms (cache)', '5ms (cache)', '5ms (cache)', '5ms (cache)'],
              ['Read Latency (miss)', '55ms (DB + cache write)', '55ms (DB + cache write)', '55ms (DB + cache write)', 'Rare (proactive refresh)'],
              ['Consistency', 'Eventual (cache can be stale)', 'Strong (cache = DB)', 'Eventual (async writes)', 'Eventual (refresh lag)'],
              ['Data Loss Risk', 'Zero (DB is source)', 'Zero (writes to DB first)', 'High (cache failure = loss)', 'Zero (DB is source)'],
              ['Implementation', 'Simple (app logic)', 'Simple (app logic)', 'Complex (queue + worker)', 'Complex (TTL monitor)'],
              ['Cache Hit Rate', '60-80% (lazy loading)', '60-80% (lazy loading)', '90-95% (all writes cached)', '95-99% (predictive)'],
              ['Best For', 'Read-heavy, eventual OK', 'Consistency critical', 'Write-heavy, loss OK', 'Predictable access'],
            ]}
          />

          <Divider />

          <H2>Real Decision: E-commerce Product Catalog</H2>
          <Example title="Cache-Aside vs Write-Through - Consistency vs Performance">
            <CodeBlock>
{`Scenario: Product price updates, 10M products, 100k price changes/day, 50M reads/day
Load: 580 reads/sec, 1.2 writes/sec per product

---

Pattern 1: Cache-Aside (Lazy Loading)
Flow:
  Read: Check cache → miss → read DB → write cache → return
  Write: Update DB → invalidate cache (or ignore cache)

Code:
def get_product(product_id):
    cache_key = f"product:{product_id}"
    product = redis.get(cache_key)
    if product:
        return product  # Cache hit
    # Cache miss - read from DB
    product = db.query("SELECT * FROM products WHERE id = ?", product_id)
    redis.setex(cache_key, 3600, product)  # Cache for 1 hour
    return product

def update_price(product_id, new_price):
    db.execute("UPDATE products SET price = ? WHERE id = ?", new_price, product_id)
    redis.delete(f"product:{product_id}")  # Invalidate cache
    return {"status": "updated"}

Performance:
- Write latency: 50ms (DB update only)
- Read latency: 5ms hit, 55ms miss (10% miss rate = avg 10ms)
- Cache hit rate: 90% (after warm-up)

Problem: Price update race condition
Time | User A | User B
t=0  | Read cache (old price: $100) |
t=1  |  | Update DB ($90), invalidate cache
t=2  | Show user old price $100 ❌ |

Symptom: 1 in 1000 users see stale price for up to 1 hour (TTL)
Impact: 50 complaints/month, trust issues

Solution 1: Lower TTL to 60 seconds (miss rate increases to 30%)
Solution 2: Invalidate cache on write (what we do above) ✅

Cost: $150/mo (Redis m5.large 13GB)
Decision: ✅ BEST for read-heavy with eventual consistency OK

---

Pattern 2: Write-Through (Consistency Critical)
Flow:
  Read: Check cache → miss → read DB → write cache → return
  Write: Write cache + DB (both succeed or fail)

Code:
def get_product(product_id):
    cache_key = f"product:{product_id}"
    product = redis.get(cache_key)
    if not product:
        product = db.query("SELECT * FROM products WHERE id = ?", product_id)
        redis.setex(cache_key, 3600, product)
    return product

def update_price(product_id, new_price):
    # Write to both cache and DB
    product = db.query("SELECT * FROM products WHERE id = ?", product_id)
    product['price'] = new_price

    # Atomic update
    db.execute("UPDATE products SET price = ? WHERE id = ?", new_price, product_id)
    redis.setex(f"product:{product_id}", 3600, product)  # Update cache immediately
    return {"status": "updated"}

Performance:
- Write latency: 150ms (cache write 5ms + DB write 50ms + network 2× RTT)
- Read latency: 5ms hit, 55ms miss
- Consistency: Cache ALWAYS matches DB ✅

Trade-off:
- Writes 3× slower (50ms → 150ms)
- But: Users NEVER see stale prices
- Use case: Pricing, inventory (consistency > speed)

Cost: Same $150/mo Redis
Decision: ✅ Use when consistency matters (pricing, stock levels)

---

Pattern 3: Write-Behind (High Write Throughput)
Flow:
  Read: Check cache → miss → read DB → return (don't cache on miss)
  Write: Write cache immediately → async worker writes to DB

Code:
def get_product(product_id):
    product = redis.get(f"product:{product_id}")
    if product:
        return product
    # Miss: read from DB but DON'T cache (cache only has written items)
    return db.query("SELECT * FROM products WHERE id = ?", product_id)

def update_price(product_id, new_price):
    # Write to cache immediately
    product = get_product(product_id)
    product['price'] = new_price
    redis.setex(f"product:{product_id}", 3600, product)

    # Queue DB write for async processing
    queue.enqueue({
        "action": "update_price",
        "product_id": product_id,
        "price": new_price
    })
    return {"status": "queued"}  # Return immediately

# Background worker
def worker():
    while True:
        task = queue.dequeue()
        db.execute("UPDATE products SET price = ? WHERE id = ?",
                   task['price'], task['product_id'])

Performance:
- Write latency: 10ms (cache only) - 5× faster! ✅
- DB write happens in 1-5 seconds (async)
- Throughput: 10k writes/sec (vs 1k for write-through)

Risk: Data loss if Redis crashes before DB write
Example: 1000 pending writes in queue, Redis dies → lose all 1000 updates ❌

Mitigation:
- Use Redis persistence (AOF or RDB snapshots)
- Replicate queue to durable message broker (Kafka, RabbitMQ)
- Cost: +$200/mo for Kafka

Use case: Analytics counters, view counts (loss acceptable)
DON'T use for: Pricing, orders, payments (loss unacceptable)

Decision: ⚠️ Use only for non-critical data

---

Pattern 4: Refresh-Ahead (Predictable Access)
Flow:
  Read: Check cache → hit (almost always)
  Background: Monitor TTL → refresh before expiration

Code:
def get_product(product_id):
    cache_key = f"product:{product_id}"
    product = redis.get(cache_key)
    ttl = redis.ttl(cache_key)

    # If TTL < 5 minutes, trigger async refresh
    if ttl < 300:
        queue.enqueue({"action": "refresh", "key": cache_key})

    if product:
        return product
    # Rare miss
    product = db.query("SELECT * FROM products WHERE id = ?", product_id)
    redis.setex(cache_key, 3600, product)
    return product

# Background worker
def refresh_worker():
    while True:
        task = queue.dequeue()
        product = db.query("SELECT * FROM products WHERE id = ?", task['product_id'])
        redis.setex(task['key'], 3600, product)

Performance:
- Read latency: 5ms (99% hit rate) ✅
- Miss rate: 1% (only new products or cache eviction)
- User experience: Consistently fast

Trade-off:
- Complexity: Need background workers, TTL monitoring
- Wasted refreshes: Refresh items that won't be accessed
- Cost: +20% compute for refresh workers

Use case: Homepage popular products (top 1000 accessed 100× more)
DON'T use for: Long-tail products (wasted refreshes)

Decision: ✅ Use for hot data with predictable access patterns

---

Cost Summary for 10M Products, 50M reads/day:

Cache-Aside:
- Redis: $150/mo (13GB m5.large)
- Hit rate: 90% (10% miss → DB load)
- DB: $300/mo (handles 10% of 580 QPS = 58 QPS)
- Total: $450/mo

Write-Through:
- Redis: $150/mo
- Hit rate: 90%
- DB: $300/mo (same read load, slightly higher write load)
- Total: $450/mo
- Trade-off: 3× slower writes for consistency

Write-Behind:
- Redis: $150/mo
- Queue (Kafka): $200/mo (durability)
- DB: $200/mo (async writes reduce load)
- Total: $550/mo
- Trade-off: +$100/mo but 5× faster writes

Refresh-Ahead:
- Redis: $150/mo
- Workers: $100/mo (3 background workers)
- DB: $250/mo (proactive refresh adds load)
- Total: $500/mo
- Trade-off: +$50/mo but 99% hit rate (vs 90%)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Caching Pattern Decision Tree

if (consistency_critical):  # Pricing, inventory, user balance
    if (write_latency_acceptable > 100ms):
        return "Write-Through"  # Guaranteed consistency
    else:
        return "Cache-Aside + low TTL (60s)"  # Eventual consistency

elif (write_heavy && read_heavy):  # Social media likes, view counts
    if (data_loss_acceptable):
        return "Write-Behind"  # 5× faster writes
    else:
        return "Cache-Aside"  # Safer default

elif (predictable_access && hot_data):  # Homepage products, trending posts
    if (budget > $500/mo && low_latency_critical):
        return "Refresh-Ahead"  # 99% hit rate
    else:
        return "Cache-Aside"  # 90% hit rate, simpler

elif (read_heavy && eventual_ok):  # Blog posts, product catalog
    return "Cache-Aside"  # Default choice for 80% of cases

else:
    return "Cache-Aside"  # Start simple, optimize later`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Not invalidating cache on writes (cache-aside)</Strong>
            <P>
              Symptom: User updates profile → sees old data for 1 hour (TTL). Update product price → 10% of users
              see wrong price. Leads to 100+ support tickets/month ("my changes aren't saving").
            </P>
            <P>
              <Strong>Fix:</Strong> Always invalidate cache on write: <Code>redis.delete(cache_key)</Code> after DB update.
              Or use write-through pattern. Or lower TTL to 60 seconds (increases miss rate but reduces staleness window).
              For critical data (pricing), use write-through to guarantee consistency.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using write-behind without durable queue</Strong>
            <P>
              Example: Storing writes in Redis queue, Redis crashes, lose 5,000 pending writes. In e-commerce: lost
              orders ($50k revenue). In analytics: lost user events (data gaps).
            </P>
            <P>
              <Strong>Fix:</Strong> Use durable message queue (Kafka, RabbitMQ with persistence) for write-behind pattern.
              Enable Redis persistence (AOF) for data durability. Or avoid write-behind entirely for critical data - use
              cache-aside or write-through instead. Write-behind only for loss-acceptable data (view counts, analytics).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Refresh-ahead for long-tail data</Strong>
            <P>
              Example: Using refresh-ahead for all 10M products when only top 10k are frequently accessed. Result:
              Refreshing 9.99M products unnecessarily → 1000× more DB queries → DB at 90% CPU → $2k/mo database upgrade.
            </P>
            <P>
              <Strong>Fix:</Strong> Use refresh-ahead only for hot data (accessed > 10× per hour). Identify hot keys with
              access tracking: <Code>redis.incr(f"access_count:{key}")</Code>. Refresh only if access count > threshold.
              For long-tail data, use cache-aside with 1-hour TTL (rare misses acceptable). Hybrid approach: refresh-ahead
              for top 1%, cache-aside for rest.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce with 50M product views/day. Cache-aside (90% hit rate) vs no cache:
            Saves 45M DB queries/day. Database cost without cache: $2,000/mo (r5.4xlarge for 580 QPS). With cache: $300/mo
            DB + $150/mo Redis = $450/mo total. Savings: $1,550/mo ($18.6k/year). Cache setup cost: 8 hours engineering
            ($1,600). First year ROI: 11.6× return. Ongoing: $18.6k/year savings for $150/mo Redis cost.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cache-vs-optimization-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Caching vs Query Optimization',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Caching vs Query Optimization</H1>
          <P>
            <Strong>The Decision:</Strong> When queries are slow, you can add caching (fast but adds complexity) or
            optimize queries with indexes (permanent fix but limited scale). Premature caching masks bad queries,
            wasting memory. Skipping cache optimization hits DB limits earlier. The right order saves months of work.
          </P>

          <ComparisonTable
            headers={['Factor', 'Add Cache (Redis)', 'Optimize Query (Index)', 'Denormalize Data', 'Materialized View']}
            rows={[
              ['Cost (Startup)', '$150/mo (m5.large 13GB)', '$0 (index is free)', '$0 (storage +20%)', '$0 (storage +30%)'],
              ['Cost (Scale)', '$1,200/mo (r5.2xlarge 52GB)', 'Same (index scales)', '$50/mo (extra storage)', '$50/mo (extra storage)'],
              ['Query Speedup', '100× (5ms vs 500ms)', '10× (50ms vs 500ms)', '20× (25ms vs 500ms)', '50× (10ms vs 500ms)'],
              ['Consistency', 'Eventual (stale data risk)', 'Strong (always fresh)', 'Strong (transaction logic)', 'Eventual (refresh lag)'],
              ['Maintenance', 'High (invalidation logic)', 'Low (automatic)', 'High (sync on write)', 'Medium (refresh schedule)'],
              ['Scale Limit', 'Memory (100GB = $2k/mo)', 'QPS (100k limit)', 'Write complexity', 'Refresh overhead'],
              ['Best For', 'Computed values, hot data', 'First optimization step', 'Read-heavy aggregations', 'Analytics queries'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Dashboard Analytics Query</H2>
          <Example title="Cache vs Index vs Materialized View - Optimization Order">
            <CodeBlock>
{`Scenario: User dashboard showing order stats, 500ms query, 1000 users, 10k requests/day
Query: "Show user's order count, total spent, last order date"

---

Step 1: Measure Baseline (No Optimization)

Query:
SELECT
  COUNT(*) as order_count,
  SUM(total) as total_spent,
  MAX(created_at) as last_order
FROM orders
WHERE user_id = 123;

Performance: 500ms (table scan of 10M orders)
EXPLAIN: Seq Scan on orders (cost=0..250000 rows=10000000)
Problem: No index on user_id → scans entire table ❌

Cost: $300/mo (r5.large DB handles 10k req/day = 0.12 QPS)
Decision: ❌ Query is broken - fix query first!

---

Step 2: Add Index (First Optimization - Always Do This)

CREATE INDEX idx_user_orders ON orders(user_id);

Performance: 50ms (100× faster)
EXPLAIN: Index Scan using idx_user_orders (cost=0..100 rows=42)
Cost: +50MB storage ($5/mo), same DB cost
Effort: 5 minutes

Result: ✅ Massive improvement for free
Decision: ✅ ALWAYS index before caching

When to cache: If 50ms still too slow (e.g., mobile app needs < 100ms)

---

Step 3: Add Cache (If Index Not Enough)

def get_user_stats(user_id):
    cache_key = f"user_stats:{user_id}"
    stats = redis.get(cache_key)
    if stats:
        return stats  # 5ms

    # Cache miss - run indexed query
    stats = db.query("""
        SELECT COUNT(*) as order_count, SUM(total) as total_spent
        FROM orders WHERE user_id = ?
    """, user_id)  # 50ms with index

    redis.setex(cache_key, 3600, stats)  # Cache 1 hour
    return stats

Performance: 5ms hit, 55ms miss (90% hit rate → avg 10ms)
Cost: +$150/mo (Redis)
Effort: 4 hours (cache logic + invalidation)

Invalidation: On new order → redis.delete(f"user_stats:{user_id}")

Result: ✅ 5× faster than index alone (50ms → 10ms avg)
Decision: ✅ Use if user-facing and latency critical

Trade-off: $150/mo + complexity vs 40ms improvement
Worth it? If mobile app or real-time dashboard, yes.

---

Step 4: Materialized View (For Complex Analytics)

Query (more complex version):
SELECT
  u.id, u.name,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent,
  AVG(o.total) as avg_order,
  COUNT(DISTINCT o.product_id) as unique_products
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

Performance: 2000ms (complex aggregation even with indexes)

Option A: Cache entire result for all users
- Redis memory: 1M users × 200 bytes = 200MB ($20/mo)
- Refresh: Invalidate on every order (complex)

Option B: Materialized View (PostgreSQL)
CREATE MATERIALIZED VIEW user_stats_mv AS
SELECT
  u.id, u.name,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent,
  AVG(o.total) as avg_order
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

CREATE INDEX ON user_stats_mv(id);

REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats_mv;
-- Run refresh every 15 minutes via cron

Query: SELECT * FROM user_stats_mv WHERE id = 123;
Performance: 10ms (pre-computed)
Storage: +300MB ($30/mo)
Staleness: Up to 15 minutes (acceptable for analytics)

Result: ✅ 200× faster without cache complexity
Decision: ✅ BEST for analytics/reporting queries

---

Optimization Order (Follow This):

1. Add indexes (ALWAYS DO FIRST)
   Time: 5 minutes
   Cost: ~$0
   Speedup: 10-100×

2. Optimize query (remove unnecessary JOINs, use LIMIT)
   Time: 30 minutes
   Cost: $0
   Speedup: 2-5×

3. Add materialized view (for complex analytics)
   Time: 2 hours
   Cost: $30/mo storage
   Speedup: 20-100×
   Staleness: Acceptable for analytics

4. Add application cache (for hot data)
   Time: 4-8 hours
   Cost: $150/mo Redis
   Speedup: 5-10× (on top of index)
   Use when: Latency < 50ms required

5. Denormalize data (last resort)
   Time: 2-4 days
   Cost: +20% storage
   Speedup: 10-50×
   Use when: JOINs unavoidable and slow

---

Real Example: Premature Caching Mistake

Bad approach: Slow query (500ms) → Add cache immediately
- Cache masks the problem (table scan still happens on miss)
- Miss rate 10% → 10% of requests still slow (500ms)
- Cost: $150/mo Redis
- When cache evicted → DB overload

Good approach: Slow query (500ms) → Add index (50ms) → Add cache if needed (5ms)
- Index fixes root cause (no more table scans)
- Cache is optional optimization, not band-aid
- Even cache misses are fast (50ms with index)

ROI Comparison:

Cache-first approach:
- Cost: $150/mo Redis + $300/mo DB = $450/mo
- Performance: 10ms avg (but 500ms on miss - still breaks!)
- Latency p95: 500ms (cache misses hit unindexed query)

Index-first approach:
- Cost: $300/mo DB (no Redis needed)
- Performance: 50ms (all queries fast)
- Latency p95: 50ms (consistent, no cache misses)

Index + Cache:
- Cost: $150/mo Redis + $300/mo DB = $450/mo
- Performance: 10ms avg (5ms hit, 50ms miss)
- Latency p95: 50ms (cache miss still fast due to index)
- Decision: ✅ BEST - cache enhances index, not replaces`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Query Optimization Decision Tree (Follow This Order!)

query_latency_p95 = measure_query_performance()

if (query_latency_p95 > 100ms):
    # Step 1: ALWAYS check indexes first
    explain_plan = run_explain_analyze(query)

    if ("Seq Scan" in explain_plan && table_size > 10k):
        add_index_on_where_columns()
        query_latency_p95 = measure_query_performance()
        # Expected: 10-100× improvement

    # Step 2: Optimize query structure
    if (query_latency_p95 > 100ms):
        optimize_query()  # Remove unnecessary JOINs, use LIMIT, select only needed columns
        query_latency_p95 = measure_query_performance()

    # Step 3: Consider denormalization
    if (query_latency_p95 > 200ms && complex_joins):
        if (query_type == "analytics" && staleness_ok):
            create_materialized_view()  # Refresh every 5-15 min
            # Expected: 20-100× improvement
        elif (read_write_ratio > 10):
            denormalize_hot_columns()  # Cache aggregated counts
            # Expected: 10-50× improvement

    # Step 4: Add cache (only if needed)
    if (query_latency_p95 > 50ms && user_facing):
        if (hot_data && access_pattern_predictable):
            add_cache_layer()  # Redis for top 10% of queries
            # Expected: 5-10× improvement

# Anti-pattern: Skip to caching without indexing
if (considering_cache && no_indexes_added):
    error("Add indexes first! Caching without indexes masks root cause.")

# When to cache:
if (query_optimized && latency_p95 < 100ms):
    if (user_facing && mobile_app):
        add_cache()  # Mobile needs < 50ms
    elif (hot_data && read_heavy):
        add_cache()  # High QPS benefits from cache
    else:
        skip_cache()  # Optimized query is fast enough`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Caching before indexing (masking root cause)</Strong>
            <P>
              Example: 500ms query due to table scan → add cache → 90% hit rate (5ms), 10% miss (still 500ms). Result:
              p95 latency still 500ms, cache masks symptom but doesn't fix problem. When cache fails or gets evicted,
              DB overloads instantly (1000 QPS × 500ms = DB dies).
            </P>
            <P>
              <Strong>Fix:</Strong> ALWAYS run <Code>EXPLAIN ANALYZE</Code> first. If it shows "Seq Scan", add index
              before considering cache. Proper index reduces 500ms → 50ms (10× improvement). Then cache reduces 50ms → 5ms
              (another 10× improvement). Index + cache = 100× total improvement AND cache misses are safe (50ms not 500ms).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Caching computed values when materialized view is better</Strong>
            <P>
              Example: Complex analytics query with 5 JOINs and aggregations (2000ms) → cache in Redis → need to invalidate
              on every order, user update, product change → 200 lines of invalidation logic → bugs cause stale data → 50
              support tickets/month.
            </P>
            <P>
              <Strong>Fix:</Strong> Use PostgreSQL materialized views for complex analytics queries. One-time setup:
              <Code>CREATE MATERIALIZED VIEW user_stats_mv AS [complex query]</Code>. Refresh every 15 minutes in background.
              Benefits: DB handles refresh logic (no app code), consistent (no invalidation bugs), fast (pre-computed). Perfect
              for analytics dashboards where 15-min staleness is acceptable.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Caching everything (memory explosion)</Strong>
            <P>
              Example: "Let's cache all queries" → cache all 10M products → Redis needs 50GB ($800/mo) → 80% of cached data
              accessed < 1× per day (wasted memory). Cache eviction starts → hit rate drops to 40% → DB load increases.
            </P>
            <P>
              <Strong>Fix:</Strong> Cache only hot data (Pareto principle: 20% of data gets 80% of requests). Track access
              patterns: <Code>redis.incr(f"access:{key}")</Code>. Cache items with access count > 10/day. For product catalog:
              cache top 10k products (0.1% of data), lazy-load rest from indexed queries (50ms acceptable). Saves $650/mo Redis
              cost while serving 95% of requests from cache.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Dashboard with 500ms query serving 10k req/day. Path A: Add cache immediately
            ($150/mo + 8 hours engineering = $1,600 setup). Result: 90% requests fast, 10% still broken (500ms), p95 = 500ms.
            Path B: Add index first (5 min + $0). Result: All requests 50ms, p95 = 50ms. Then add cache ($150/mo + 8 hours).
            Final: p95 = 10ms. Path B saves debugging time (no cache misses breaking app) and improves p95 latency 50×. Always
            index first, cache second.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'eviction-memory-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Eviction Policy & Memory Sizing',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Eviction Policy & Memory Sizing</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing cache size and eviction policy determines hit rate, cost, and performance
            consistency. Too small = frequent evictions (low hit rate), too large = wasted money. Wrong eviction policy evicts
            hot data, tanking hit rate from 90% to 40%. Difference: $1,000/mo in DB costs or wasted cache memory.
          </P>

          <ComparisonTable
            headers={['Factor', 'LRU (Least Recently Used)', 'LFU (Least Frequently Used)', 'TTL (Time-based)', 'Random']}
            rows={[
              ['Hit Rate (typical)', '85-90%', '90-95%', '70-80%', '50-60%'],
              ['Memory Efficiency', 'Good (evicts cold data)', 'Excellent (evicts rare data)', 'Poor (time-based only)', 'Poor (random eviction)'],
              ['Scan Resistance', 'Poor (scan evicts hot data)', 'Excellent (frequency protects hot)', 'N/A', 'N/A'],
              ['Implementation', 'Simple (built-in Redis)', 'Complex (track frequency)', 'Simple (built-in Redis)', 'Simple (built-in Redis)'],
              ['Burst Traffic', 'Handles well', 'May evict one-time bursts', 'Poor (early expiration)', 'Poor (random)'],
              ['Best For', 'General use (default)', 'Stable access patterns', 'Session data, time-sensitive', 'Never use (testing only)'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Product Catalog Caching</H2>
          <Example title="LRU vs LFU and Cache Sizing - Hit Rate vs Cost">
            <CodeBlock>
{`Scenario: E-commerce 10M products, 50M reads/day = 580 QPS
Access pattern: 80/20 rule (20% of products = 80% of traffic)

---

Step 1: Determine Required Cache Size

Total data: 10M products × 5KB avg = 50GB (if cache everything)
Hot data: 2M products × 5KB = 10GB (20% of products)

Calculation:
- 50M reads/day ÷ 86,400 sec = 580 QPS
- 80% hit rate target → 464 QPS from cache, 116 QPS to DB
- DB can handle 500 QPS (r5.large) → cache must handle ≥ 80% to avoid DB upgrade

Cache size options:
A) 50GB (100% of data) = $1,200/mo (r5.2xlarge 52GB)
B) 13GB (26% of data) = $150/mo (m5.large 13GB)
C) 26GB (52% of data) = $350/mo (m5.2xlarge 26GB)

Hit rate by cache size (LRU):
- 13GB cache (top 26% products): 85% hit rate ✅
- 26GB cache (top 52% products): 92% hit rate
- 50GB cache (100% products): 99% hit rate

Cost vs Hit Rate:
Size   | Cost/mo | Hit Rate | DB QPS | DB Cost | Total
13GB   | $150    | 85%      | 87     | $300    | $450  ✅ BEST
26GB   | $350    | 92%      | 46     | $200    | $550
50GB   | $1,200  | 99%      | 6      | $150    | $1,350

Decision: 13GB cache ✅
- Hit rate 85% sufficient (DB handles 87 QPS easily)
- Saves $900/mo vs 50GB cache ($10.8k/year)
- Pareto principle: 26% cache serves 85% of requests

---

Step 2: Choose Eviction Policy

Access pattern:
- Top 1000 products: 10k accesses/day (hot data)
- Next 1.9M products: 10-100 accesses/day (warm data)
- Remaining 8M products: < 1 access/day (cold data)

Scenario A: LRU (Least Recently Used)

redis.config_set("maxmemory-policy", "allkeys-lru")

Behavior: Evicts items not accessed recently
Performance: 85% hit rate (stable)

Problem: Scan attack vulnerability
Example: Admin exports all 10M products (full table scan)
Result: Scan pushes hot products out of cache ❌
Hit rate drops: 85% → 40% for next hour (until hot data reloaded)

Impact: 1 hour at 40% hit rate → 348 extra QPS to DB → DB overload → 500ms latency

Mitigation: Prevent admin scans from using cache
Or: Use LFU instead ✅

---

Scenario B: LFU (Least Frequently Used)

redis.config_set("maxmemory-policy", "allkeys-lfu")

Behavior: Evicts items accessed least frequently
Performance: 90% hit rate (better than LRU!) ✅

Protection: Scan attack doesn't evict hot data
Example: Admin scans 10M products
Result: Scan items have frequency = 1, hot items have frequency = 100
Eviction: Scan items evicted, hot items stay ✅

Hit rate: Stable 90% (not affected by scans)

Trade-off: Slow to adapt to new trends
Example: New product launch (iPhone 16)
Problem: Frequency starts at 0 → evicted until accessed 100× times
Time to cache: 1-2 hours (gradual frequency build-up)

Solution: Hybrid LFU with decay
redis.config_set("lfu-decay-time", "1")  # Frequency decays over time
Result: Old unused items decay, new hot items promoted faster

Decision: ✅ LFU for stable workloads, LRU for rapidly changing data

---

Scenario C: TTL (Time-based Expiration)

redis.setex(f"product:{id}", 3600, product)  # 1 hour TTL

Behavior: Items expire after 1 hour, regardless of access
Performance: 70% hit rate (worse than LRU/LFU) ❌

Problem: Hot products expire even if accessed 1000×/hour
Example: Homepage featured product accessed every second
Result: Expires after 1 hour → cache miss → DB hit → recache
Waste: Evicting most valuable cache entry!

Use case: Session data (MUST expire for security)
NOT for: Product catalog, user profiles (access-based better)

Decision: ❌ Don't use TTL for eviction, use for expiration only

---

Scenario D: Cache Warming Strategy

Problem: New cache starts empty (0% hit rate)
Impact: First 1 hour → all requests hit DB → overload

Solution 1: Proactive warming (on deployment)
# Pre-populate cache with top 10k products
def warm_cache():
    top_products = db.query("SELECT * FROM products ORDER BY view_count DESC LIMIT 10000")
    for product in top_products:
        redis.setex(f"product:{product.id}", 3600, product)

Time: 2 minutes (parallel writes)
Hit rate: Starts at 60% (immediate coverage of hot data)

Solution 2: Lazy warming with fallback
def get_product(id):
    product = redis.get(f"product:{id}")
    if not product:
        product = db.query_with_cache_fallback(id)  # DB replica for misses
        redis.setex(f"product:{id}", 3600, product)
    return product

Hit rate: Starts at 0%, reaches 85% within 30 minutes

Decision: ✅ Warm top 10k products on deployment (costs 2 min, saves 30 min low hit rate)

---

Cost Analysis: Over-provisioning vs Under-provisioning

Under-provisioned: 6.5GB cache (13% of data)
- Cost: $100/mo
- Hit rate: 70% (not enough memory)
- DB QPS: 174 (need r5.large = $300/mo)
- Total: $400/mo
- Problem: Frequent evictions → thrashing

Right-sized: 13GB cache (26% of data)
- Cost: $150/mo
- Hit rate: 85%
- DB QPS: 87 (r5.large = $300/mo)
- Total: $450/mo ✅ BEST

Over-provisioned: 26GB cache (52% of data)
- Cost: $350/mo
- Hit rate: 92% (only 7% improvement)
- DB QPS: 46 (can use t3.large = $150/mo)
- Total: $500/mo
- ROI: +$50/mo for 7% hit rate improvement (not worth it)

Decision: 13GB is sweet spot (Pareto principle: 26% cache → 85% hits)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Cache Sizing and Eviction Policy Decision

# Step 1: Measure working set size
total_data_size = measure_all_data()
hot_data_size = measure_top_20_percent()  # 80/20 rule

# Step 2: Determine target hit rate
target_hit_rate = 0.85  # 85% is typical sweet spot
db_capacity_qps = 500  # Current DB can handle
current_qps = 580

required_cache_qps = current_qps - db_capacity_qps  # 80 QPS to cache
required_hit_rate = required_cache_qps / current_qps  # 13.8% minimum

if (target_hit_rate < required_hit_rate):
    error("Cache can't save you - upgrade DB first")

# Step 3: Size cache using Pareto principle
cache_size = hot_data_size  # Start with 20% (typically 80% hit rate)

# Test with larger sizes (use cache analytics)
while (hit_rate < target_hit_rate && cache_size < total_data_size):
    cache_size *= 1.5  # Grow by 50%
    hit_rate = simulate_hit_rate(cache_size)

# ROI check: Does larger cache save DB costs?
cache_cost = estimate_redis_cost(cache_size)
db_cost_saved = estimate_db_savings(hit_rate)

if (db_cost_saved > cache_cost):
    provision(cache_size)
else:
    provision(smaller_cache_size)  # Not worth the cost

# Step 4: Choose eviction policy
if (access_pattern == "stable" && scan_risk):
    eviction_policy = "allkeys-lfu"  # Best for most cases
elif (rapidly_changing_trends):
    eviction_policy = "allkeys-lru"  # Adapts faster to new data
elif (session_data || time_sensitive):
    eviction_policy = "volatile-ttl"  # Respects TTL
else:
    eviction_policy = "allkeys-lfu"  # Default choice

# Step 5: Monitor and adjust
monitor_metrics = {
    "hit_rate": target >= 0.85,
    "eviction_rate": target < 100/sec,  # Too many = under-provisioned
    "memory_usage": target 70-80%,  # Not 100% (leave headroom)
}

if (eviction_rate > 100/sec):
    warning("Too many evictions - increase cache size")
if (memory_usage < 50%):
    warning("Over-provisioned - can downsize cache")
if (hit_rate < 0.80):
    warning("Poor hit rate - check access patterns or increase size")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using LRU with scan-heavy workloads</Strong>
            <P>
              Example: LRU cache with 90% hit rate → admin runs full table export → scans 10M products → pushes all hot
              data out of cache → hit rate drops to 40% for next hour → DB overload → 10 min of 500ms latency → $5k
              revenue loss (cart abandonment).
            </P>
            <P>
              <Strong>Fix:</Strong> Use LFU (Least Frequently Used) instead of LRU. LFU tracks access frequency, not just
              recency. Scan items have frequency = 1, hot items have frequency = 1000 → scan items evicted first, hot data
              stays. Or: Prevent scans from using cache (use separate cache tier or direct DB reads for admin operations).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Under-provisioning cache (constant thrashing)</Strong>
            <P>
              Example: 50GB working set, provision 5GB cache (10%) → hit rate only 40% → constant evictions (1000/sec) →
              cache spends all time evicting instead of serving → DB still overloaded. Worse than no cache (adds latency
              to misses due to failed cache check).
            </P>
            <P>
              <Strong>Fix:</Strong> Follow 80/20 rule: cache top 20% of data (by access frequency) to achieve 80% hit rate.
              Use analytics to find working set: <Code>SELECT COUNT(*) FROM products WHERE view_count > 10</Code>. Monitor
              eviction rate: if > 100 evictions/sec, cache is under-provisioned. Grow cache until eviction rate < 10/sec
              (stable state).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not warming cache on deployment</Strong>
            <P>
              Example: Deploy new cache → starts empty (0% hit rate) → all 580 QPS hit DB → DB overload → 30 minutes of
              500ms latency until cache warms up → 1000 users abandon slow site → $10k revenue loss.
            </P>
            <P>
              <Strong>Fix:</Strong> Always warm cache on deployment. Pre-populate top N items: <Code>SELECT * FROM products
              ORDER BY view_count DESC LIMIT 10000</Code> → write to cache before serving traffic. Takes 2-5 minutes, starts
              hit rate at 60-70% immediately. Or: Use blue-green deployment (new cache warms up before traffic shift). Or:
              Route traffic gradually (10% → 50% → 100%) as cache warms.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Product catalog 50GB data, 580 QPS. Option A: 50GB cache ($1,200/mo, 99% hit rate).
            Option B: 13GB cache ($150/mo, 85% hit rate). Option B saves $1,050/mo ($12.6k/year) with only 14% lower hit rate.
            14% more DB queries = 87 QPS (well within DB capacity). Result: Same user experience, $12.6k/year savings. Pareto
            principle: 26% cache size → 85% of benefit at 12.5% of cost. 6.8× cost efficiency.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

