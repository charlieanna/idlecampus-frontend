import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const cachingFundamentalsLesson: SystemDesignLesson = {
  id: 'caching-fundamentals',
  slug: 'caching-fundamentals',
  title: 'Caching Fundamentals',
  description: 'Learn the core concepts of caching in distributed systems',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 30,
  stages: [
    {
      id: 'what-is-caching',
      type: 'concept',
      title: 'What is Caching?',
      content: (
        <Section>
          <H1>What is Caching?</H1>
          
          <P>
            Caching is a technique to store frequently accessed data in a fast-access storage layer (cache) 
            to reduce latency and load on slower data sources (like databases).
          </P>

          <H2>Why Cache?</H2>

          <H3>1. <Strong>Reduce Latency</Strong></H3>
          <UL>
            <LI><Strong>Database query:</Strong> 10-50ms</LI>
            <LI><Strong>Redis cache:</Strong> 1-5ms</LI>
            <LI><Strong>Local memory cache:</Strong> &lt;1ms</LI>
          </UL>

          <H3>2. <Strong>Reduce Database Load</Strong></H3>
          <UL>
            <LI>A cache hit ratio of 90% means only 10% of requests hit the database</LI>
            <LI>This allows your database to handle 10x more traffic</LI>
          </UL>

          <H3>3. <Strong>Save Money</Strong></H3>
          <UL>
            <LI>Database operations are expensive (compute, I/O)</LI>
            <LI>Cache operations are cheap (memory access)</LI>
            <LI>Can reduce infrastructure costs by 50-80%</LI>
          </UL>

          <H3>4. <Strong>Improve User Experience</Strong></H3>
          <UL>
            <LI>Faster page loads = happier users</LI>
            <LI>Amazon found that every 100ms of latency costs them 1% in sales</LI>
          </UL>

          <H2>Real-World Example: E-commerce Product Page</H2>

          <Example title="Without caching">
            <CodeBlock>
{`User requests product page
  → API server queries database for product details (20ms)
  → API server queries database for inventory (15ms)
  → API server queries database for reviews (25ms)
  → API server queries database for recommendations (30ms)
Total: 90ms + network overhead`}
            </CodeBlock>
          </Example>

          <Example title="With caching">
            <CodeBlock>
{`User requests product page
  → API server checks Redis cache (2ms) ✓ Cache hit!
  → Returns cached product page
Total: 2ms + network overhead`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Result:</Strong> 45x faster response time!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cache-architecture',
      type: 'concept',
      title: 'Cache Architecture Patterns',
      content: (
        <Section>
          <H1>Cache Architecture Patterns</H1>

          <H2>1. Cache-Aside (Lazy Loading)</H2>
          <P>The application is responsible for loading data into the cache.</P>

          <CodeBlock>
{`Read Flow:
1. Check cache for data
2. If cache hit → return data
3. If cache miss → query database
4. Store result in cache
5. Return data

Write Flow:
1. Write to database
2. Invalidate cache entry`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Only cache data that's actually requested</LI>
            <LI>Cache failures don't break the system (just slower)</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>Cache miss penalty (extra latency on first request)</LI>
            <LI>Stale data risk if cache isn't invalidated properly</LI>
          </UL>

          <P><Strong>Use Cases:</Strong> Product catalogs, user profiles, content pages</P>

          <Divider />

          <H2>2. Write-Through Cache</H2>
          <P>Data is written to cache and database simultaneously.</P>

          <CodeBlock>
{`Write Flow:
1. Write to cache
2. Write to database (synchronously)
3. Return success

Read Flow:
1. Check cache
2. If cache hit → return data
3. If cache miss → query database and populate cache`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Cache is always consistent with database</LI>
            <LI>No stale data issues</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>Higher write latency (must write to both cache and DB)</LI>
            <LI>May cache data that's never read</LI>
          </UL>

          <P><Strong>Use Cases:</Strong> Financial transactions, inventory systems</P>

          <Divider />

          <H2>3. Write-Behind Cache (Write-Back)</H2>
          <P>Data is written to cache immediately, then asynchronously written to database.</P>

          <CodeBlock>
{`Write Flow:
1. Write to cache
2. Return success immediately
3. Asynchronously write to database (batched)

Read Flow:
1. Always read from cache (cache is source of truth)`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Very fast writes (no DB wait)</LI>
            <LI>Can batch multiple writes to DB</LI>
            <LI>Reduces database load significantly</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>Risk of data loss if cache fails before DB write</LI>
            <LI>Complex to implement correctly</LI>
          </UL>

          <P><Strong>Use Cases:</Strong> Analytics, logging, high-write systems</P>

          <Divider />

          <H2>4. Read-Through Cache</H2>
          <P>Cache sits between application and database, automatically loading data on cache miss.</P>

          <CodeBlock>
{`Read Flow:
1. Application requests data from cache
2. If cache hit → return data
3. If cache miss → cache loads from database automatically
4. Cache returns data to application`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Application code is simpler (cache handles loading)</LI>
            <LI>Consistent caching logic</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>First request is slow (cache miss penalty)</LI>
            <LI>Requires cache to understand data source</LI>
          </UL>

          <P><Strong>Use Cases:</Strong> Content delivery, read-heavy applications</P>
        </Section>
      ),
    },
    {
      id: 'cache-eviction',
      type: 'concept',
      title: 'Cache Eviction Policies',
      content: (
        <Section>
          <H1>Cache Eviction Policies</H1>

          <P>
            Caches have limited memory. When the cache is full, we need to evict (remove) some entries 
            to make room for new ones. The eviction policy determines which entries to remove.
          </P>

          <H2>1. LRU (Least Recently Used)</H2>
          <P>Evicts the entry that hasn't been accessed for the longest time.</P>

          <Example title="How it works">
            <CodeBlock>
{`Cache (max 3 items):
1. Access A → [A]
2. Access B → [B, A]
3. Access C → [C, B, A]
4. Access D → [D, C, B] (A evicted - least recently used)
5. Access B → [B, D, C] (B moved to front)
6. Access E → [E, B, D] (C evicted)`}
            </CodeBlock>
          </Example>

          <P><Strong>Best for:</Strong> General-purpose caching (most common)</P>

          <Divider />

          <H2>2. LFU (Least Frequently Used)</H2>
          <P>Evicts the entry with the lowest access count.</P>

          <Example title="How it works">
            <CodeBlock>
{`Cache with access counts:
A: 10 accesses
B: 5 accesses
C: 2 accesses

When full, evict C (least frequently used)`}
            </CodeBlock>
          </Example>

          <P><Strong>Best for:</Strong> When some items are consistently popular</P>

          <Divider />

          <H2>3. TTL (Time To Live)</H2>
          <P>Each entry has an expiration time. Expired entries are automatically removed.</P>

          <Example title="How it works">
            <CodeBlock>
{`Set key="user:123" value={...} TTL=300s (5 minutes)

After 5 minutes:
- Entry automatically expires
- Next access returns cache miss
- Fresh data loaded from database`}
            </CodeBlock>
          </Example>

          <P><Strong>Best for:</Strong> Data that becomes stale over time</P>

          <Divider />

          <H2>4. FIFO (First In, First Out)</H2>
          <P>Evicts the oldest entry (first one added to cache).</P>

          <P><Strong>Best for:</Strong> Simple caching where recency doesn't matter</P>

          <Divider />

          <ComparisonTable
            headers={['Policy', 'Pros', 'Cons', 'Use Case']}
            rows={[
              ['LRU', 'Good hit rate, simple', 'Overhead tracking access', 'General purpose'],
              ['LFU', 'Great for popular items', 'Slow to adapt to changes', 'Trending content'],
              ['TTL', 'Automatic freshness', 'May evict popular items', 'Time-sensitive data'],
              ['FIFO', 'Very simple', 'Poor hit rate', 'Logging, buffers'],
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'cache-invalidation',
      type: 'concept',
      title: 'Cache Invalidation',
      content: (
        <Section>
          <H1>Cache Invalidation</H1>

          <KeyPoint>
            "There are only two hard things in Computer Science: cache invalidation and naming things." 
            — Phil Karlton
          </KeyPoint>

          <P>
            Cache invalidation is the process of removing or updating stale data in the cache 
            when the underlying data changes.
          </P>

          <H2>1. TTL-Based Invalidation</H2>
          <P>Set an expiration time for each cache entry.</P>

          <CodeBlock>
{`// Cache product for 5 minutes
cache.set('product:123', productData, TTL=300)

// After 5 minutes, cache entry expires automatically
// Next request will fetch fresh data from database`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Simple, automatic</P>
          <P><Strong>Cons:</Strong> Data can be stale for up to TTL duration</P>

          <Divider />

          <H2>2. Event-Based Invalidation</H2>
          <P>Invalidate cache when data changes.</P>

          <CodeBlock>
{`// When product is updated
function updateProduct(productId, newData) {
  // 1. Update database
  db.update('products', productId, newData);
  
  // 2. Invalidate cache
  cache.delete('product:' + productId);
  
  // Next read will fetch fresh data
}`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Always fresh data</P>
          <P><Strong>Cons:</Strong> Must invalidate in all code paths that modify data</P>

          <Divider />

          <H2>3. Cache Tagging</H2>
          <P>Group related cache entries with tags, invalidate entire groups.</P>

          <CodeBlock>
{`// Cache with tags
cache.set('product:123', data, tags=['products', 'category:electronics']);
cache.set('product:456', data, tags=['products', 'category:electronics']);

// Invalidate all products in category
cache.invalidateTag('category:electronics');`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Invalidate related data easily</P>
          <P><Strong>Cons:</Strong> More complex implementation</P>

          <Divider />

          <H2>4. Version-Based Invalidation</H2>
          <P>Include version number in cache key.</P>

          <CodeBlock>
{`// Cache key includes version
cache.set('product:123:v2', productData);

// When data changes, increment version
// Old cache entries become unreachable (garbage collected)
cache.set('product:123:v3', newProductData);`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> No explicit invalidation needed</P>
          <P><Strong>Cons:</Strong> Old entries waste memory until evicted</P>
        </Section>
      ),
    },
    {
      id: 'distributed-caching',
      type: 'concept',
      title: 'Distributed Caching',
      content: (
        <Section>
          <H1>Distributed Caching</H1>

          <P>
            When a single cache server isn't enough, we need to distribute the cache across multiple servers.
          </P>

          <H2>1. Consistent Hashing</H2>
          <P>Distribute cache keys across multiple servers using a hash function.</P>

          <CodeBlock>
{`// Determine which server stores a key
function getServer(key) {
  hash = hashFunction(key);
  serverIndex = hash % numberOfServers;
  return servers[serverIndex];
}

// Example:
getServer('product:123') → Server 2
getServer('product:456') → Server 1`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Problem:</Strong> When adding/removing servers, most keys get reassigned 
            (cache stampede!)
          </KeyPoint>

          <P><Strong>Solution:</Strong> Use consistent hashing with virtual nodes</P>

          <Divider />

          <H2>2. Sharding</H2>
          <P>Partition data across cache servers by key range or hash.</P>

          <Example title="Range-based sharding">
            <CodeBlock>
{`Server 1: product:000 - product:333
Server 2: product:334 - product:666
Server 3: product:667 - product:999`}
            </CodeBlock>
          </Example>

          <P><Strong>Pros:</Strong> Simple, predictable</P>
          <P><Strong>Cons:</Strong> Hot spots if data isn't evenly distributed</P>

          <Divider />

          <H2>3. Replication</H2>
          <P>Store copies of cache data on multiple servers for high availability.</P>

          <CodeBlock>
{`// Write to primary and replicas
cache.set('product:123', data, replicas=2);

// Read from any replica
data = cache.get('product:123'); // May read from replica`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> High availability, faster reads</P>
          <P><Strong>Cons:</Strong> More memory usage, consistency challenges</P>

          <Divider />

          <H2>4. Multi-Layer Caching</H2>
          <P>Use multiple cache layers (L1, L2, L3) for different access patterns.</P>

          <Example title="3-tier cache">
            <CodeBlock>
{`L1: Local memory cache (in-process)
    - 100MB per server
    - <1ms latency
    - No network calls

L2: Redis cluster (distributed)
    - 10GB total
    - 1-5ms latency
    - Shared across servers

L3: CDN edge cache (global)
    - 1TB+ total
    - 10-50ms latency
    - Closest to users`}
            </CodeBlock>
          </Example>

          <P><Strong>Read flow:</Strong> Check L1 → L2 → L3 → Database</P>
        </Section>
      ),
    },
    {
      id: 'common-mistakes',
      type: 'concept',
      title: 'Common Caching Mistakes',
      content: (
        <Section>
          <H1>Common Caching Mistakes</H1>

          <H2>❌ Mistake 1: Caching Everything</H2>
          <P><Strong>Problem:</Strong> Wasting memory on data that's rarely accessed</P>
          <P><Strong>Solution:</Strong> Only cache frequently accessed data (80/20 rule)</P>

          <Divider />

          <H2>❌ Mistake 2: Ignoring Cache Stampede</H2>
          <P>
            <Strong>Problem:</Strong> When a popular cache entry expires, many requests hit the database 
            simultaneously
          </P>

          <Example title="Cache stampede scenario">
            <CodeBlock>
{`1. Popular item expires from cache
2. 1000 concurrent requests all get cache miss
3. All 1000 requests query database simultaneously
4. Database overloaded!`}
            </CodeBlock>
          </Example>

          <P><Strong>Solution:</Strong> Use cache locking or probabilistic early expiration</P>

          <CodeBlock>
{`// Lock-based approach
if (!cache.has(key)) {
  if (lock.acquire(key)) {
    data = database.query(key);
    cache.set(key, data);
    lock.release(key);
  } else {
    // Wait for lock holder to populate cache
    wait();
    return cache.get(key);
  }
}`}
          </CodeBlock>

          <Divider />

          <H2>❌ Mistake 3: No TTL</H2>
          <P><Strong>Problem:</Strong> Stale data stays in cache forever</P>
          <P><Strong>Solution:</Strong> Always set appropriate TTL values</P>

          <Divider />

          <H2>❌ Mistake 4: Caching Personalized Data Globally</H2>
          <P><Strong>Problem:</Strong> User A sees User B's data</P>

          <Example title="Wrong">
            <CodeBlock>
{`// BAD: Cache key doesn't include user ID
cache.set('shopping-cart', userCart);`}
            </CodeBlock>
          </Example>

          <Example title="Correct">
            <CodeBlock>
{`// GOOD: Include user ID in cache key
cache.set('shopping-cart:user:' + userId, userCart);`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>❌ Mistake 5: Not Handling Cache Failures</H2>
          <P><Strong>Problem:</Strong> Application crashes when cache is down</P>
          <P><Strong>Solution:</Strong> Always have fallback to database</P>

          <CodeBlock>
{`try {
  data = cache.get(key);
  if (!data) {
    data = database.query(key);
    cache.set(key, data);
  }
} catch (cacheError) {
  // Cache is down, fallback to database
  console.error('Cache error:', cacheError);
  data = database.query(key);
}
return data;`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Cache should improve performance, not break functionality. 
            Always have a fallback!
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

