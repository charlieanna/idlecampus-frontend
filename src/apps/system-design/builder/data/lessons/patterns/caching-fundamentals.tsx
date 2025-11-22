import { SystemDesignLesson } from '../../../types/lesson';
import {
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section,
  ComparisonTable, KeyPoint, Example, Divider, InfoBox
} from '../../../ui/components/LessonContent';

export const cachingFundamentalsLesson: SystemDesignLesson = {
  id: 'caching-fundamentals',
  slug: 'caching-fundamentals',
  title: 'Caching Fundamentals',
  description: 'Master caching patterns and trade-offs: Learn WHEN to use Redis vs Memcached vs CDN, WHEN to cache vs not cache, and HOW to choose the right strategy',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 75, // Increased due to practice exercises + trade-off content

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 5,

  // NEW: Connect to challenges
  relatedChallenges: ['tiny_url', 'social-feed', 'e-commerce'],

  // NEW: Learning path
  nextLessons: ['distributed-caching', 'database-optimization'],

  // NEW: Concepts covered
  conceptsCovered: [
    {
      id: 'cache-aside',
      name: 'Cache-Aside Pattern',
      type: 'pattern',
      difficulty: 2,
      description: 'Application manages cache population on cache miss'
    },
    {
      id: 'cache-eviction',
      name: 'Cache Eviction Policies',
      type: 'technique',
      difficulty: 2,
      description: 'LRU, LFU, TTL strategies for cache memory management'
    },
    {
      id: 'cache-stampede',
      name: 'Cache Stampede Protection',
      type: 'technique',
      difficulty: 3,
      description: 'Prevent thundering herd problem on cache expiration'
    }
  ],

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

          <P><Strong>Real Implementation:</Strong></P>
          <Example title="Cache-Aside Pattern in TypeScript">
            <CodeBlock>
{`async function getProduct(productId: string) {
  // Step 1: Check cache first
  const cacheKey = 'product:' + productId;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log('✓ Cache hit!');
    return JSON.parse(cached);
  }

  // Step 2: Cache miss - query database
  console.log('✗ Cache miss - querying database');
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  );

  if (!product) {
    return null; // Product not found
  }

  // Step 3: Populate cache with TTL = 5 minutes
  await redis.set(
    cacheKey,
    JSON.stringify(product),
    'EX', 300  // Expire after 300 seconds
  );

  return product;
}

// Update operation - must invalidate cache!
async function updateProduct(productId: string, newData: any) {
  // 1. Update database
  await db.update('products', productId, newData);

  // 2. Invalidate cache (critical!)
  await redis.del('product:' + productId);

  // Next read will fetch fresh data from database
}`}
            </CodeBlock>
          </Example>

          <InfoBox type="warning">
            <P>
              <Strong>Common Pitfall:</Strong> Forgetting to invalidate cache on updates!
              This leads to serving stale data. Always invalidate cache when data changes.
            </P>
          </InfoBox>

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

          <Example title="Write-Through Pattern in TypeScript">
            <CodeBlock>
{`async function updateProductWriteThrough(
  productId: string,
  newData: any
) {
  const cacheKey = 'product:' + productId;

  // Write to BOTH cache and database synchronously
  await Promise.all([
    redis.set(cacheKey, JSON.stringify(newData), 'EX', 300),
    db.update('products', productId, newData)
  ]);

  // Cache is always consistent with database!
  return newData;
}`}
            </CodeBlock>
          </Example>

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

          <H2>Pattern Decision Framework</H2>

          <InfoBox type="question">
            <P><Strong>When should you use each pattern?</Strong></P>
          </InfoBox>

          <ComparisonTable
            headers={['Pattern', 'Read Latency', 'Write Latency', 'Consistency', 'Best For']}
            rows={[
              [
                'Cache-Aside',
                'Fast (hit)\nSlow (miss)',
                'Fast (DB only)',
                'Eventual',
                'Read-heavy (90%+)\nStale data OK'
              ],
              [
                'Write-Through',
                'Fast (hit)\nSlow (miss)',
                'Slow (Cache+DB)',
                'Strong',
                'Strong consistency\nFinancial data'
              ],
              [
                'Write-Behind',
                'Very fast',
                'Very fast',
                'Eventual',
                'Write-heavy (70%+)\nCan tolerate loss'
              ]
            ]}
          />

          <Divider />

          <H2>🎯 Critical Decision: Redis vs Memcached vs CDN Cache</H2>

          <P>Choosing the right caching technology is just as important as choosing the right pattern.</P>

          <ComparisonTable
            headers={['Technology', 'Best For', 'Avoid When', 'Cost/mo @ 10k RPS', 'Complexity']}
            rows={[
              [
                'Redis',
                '• Need data structures (lists, sets, sorted sets)\n• Need pub/sub messaging\n• Need persistence\n• Application cache (<100GB)',
                '• Simple key-value only\n• Data >1TB\n• Extremely cost-sensitive\n• Don\'t need persistence',
                '$100-300',
                'Medium'
              ],
              [
                'Memcached',
                '• Simple key-value cache\n• Multi-threaded workload\n• Cost-sensitive\n• Session storage',
                '• Need data structures\n• Need persistence\n• Need pub/sub\n• Need replication',
                '$50-150',
                'Low'
              ],
              [
                'CDN (CloudFront/Cloudflare)',
                '• Static assets (images, CSS, JS)\n• Geographically distributed users\n• Public content\n• Video streaming',
                '• Dynamic content\n• Personalized data\n• Frequent updates (<1 min)\n• Private user data',
                '$50-200 (+ bandwidth)',
                'Low'
              ],
              [
                'Application memory (in-process)',
                '• Very small data (<100MB)\n• Ultra-low latency (<0.1ms)\n• Configuration data\n• Single-server deployments',
                '• Need sharing across servers\n• Data >1GB\n• Need persistence\n• Horizontal scaling',
                '$0 (included)',
                'Very Low'
              ]
            ]}
          />

          <H3>Decision Tree:</H3>
          <CodeBlock>
{`
What type of data are you caching?

Static assets (images, videos, CSS, JS)?
├─ YES → Use CDN (CloudFront, Cloudflare)
│   └─ $0.085/GB, global edge locations, built for static content
│
└─ NO → Is data user-specific or dynamic?
    │
    ├─ How big is your dataset?
    │   ├─ <100MB AND single server → In-process cache (Map, LRU)
    │   ├─ <100GB AND need simple key-value → Memcached
    │   └─ <100GB AND need data structures → Redis
    │
    └─ Do you need special features?
        ├─ Need pub/sub? → Redis
        ├─ Need persistence? → Redis
        ├─ Need sorted sets/leaderboards? → Redis
        └─ Just simple key-value? → Memcached (cheaper, simpler)
`}
          </CodeBlock>

          <Example title="Real-World Example: E-Commerce Site">
            <P><Strong>Scenario:</Strong> Building an e-commerce site like Amazon</P>

            <P><Strong>Cache Strategy (use multiple cache layers!):</Strong></P>
            <UL>
              <LI><Strong>CDN (CloudFront):</Strong> Product images, CSS, JavaScript files → Reduces bandwidth costs by 80%</LI>
              <LI><Strong>Redis:</Strong> Product catalog, inventory counts, shopping cart sessions → Fast lookups with data structures</LI>
              <LI><Strong>In-process cache:</Strong> Category navigation, site configuration → Ultra-fast, rarely changes</LI>
            </UL>

            <P><Strong>Why this mix?</Strong></P>
            <UL>
              <LI>CDN for static assets → $0.085/GB vs $0.50+/GB from origin</LI>
              <LI>Redis for dynamic data → Need sorted sets for "trending products", hash for cart items</LI>
              <LI>In-process for config → No network call, &lt;0.1ms latency</LI>
            </UL>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Multiple cache layers = more complexity, but optimizes cost and performance for each data type.
            </KeyPoint>
          </Example>

          <Divider />

          <H2>🎯 Critical Decision: When to Cache vs When NOT to Cache</H2>

          <P>Caching isn't always the answer. Sometimes it makes things worse.</P>

          <ComparisonTable
            headers={['Scenario', 'Should Cache?', 'Why / Why Not']}
            rows={[
              [
                'Product catalog (read 1000x/sec, update 1x/hour)',
                '✅ YES',
                'Read-heavy, infrequent updates → Perfect for cache-aside. 99.9% cache hit rate.'
              ],
              [
                'Stock prices (change every second)',
                '❌ NO',
                'Data changes faster than you read it → Cache is always stale. Use optimized DB queries instead.'
              ],
              [
                'User session data',
                '✅ YES',
                'Accessed on every request → Redis with 30-min TTL. Reduces DB load by 100x.'
              ],
              [
                'Database query that takes 2ms',
                '❌ NO',
                'Already fast → Adding cache adds complexity (1ms network + 1ms Redis = same 2ms). Not worth it.'
              ],
              [
                'Video thumbnails',
                '✅ YES (CDN)',
                'Static, never change → CDN caching with 1-year TTL. Saves 90% bandwidth costs.'
              ],
              [
                'Real-time chat messages',
                '❌ NO',
                'Need immediate consistency → Caching adds latency and staleness. Use optimized pub/sub instead.'
              ],
              [
                'Analytics dashboards (1-hour old data OK)',
                '✅ YES',
                'Expensive queries, staleness acceptable → Pre-compute and cache for 1 hour. Reduces DB load 3600x.'
              ],
              [
                'Bank account balance',
                '❌ MAYBE',
                'Depends: Read-only view? Cache with 30s TTL. Transaction? Never cache (need strong consistency).'
              ]
            ]}
          />

          <KeyPoint>
            <Strong>Rule of Thumb - Cache When:</Strong>
            <UL>
              <LI>Read:Write ratio &gt; 10:1 (read-heavy)</LI>
              <LI>Data doesn't change often (or staleness is acceptable)</LI>
              <LI>Query is slow (&gt;10ms) and repeated frequently</LI>
              <LI>Cost savings justify complexity</LI>
            </UL>
          </KeyPoint>

          <KeyPoint>
            <Strong>DON'T Cache When:</Strong>
            <UL>
              <LI>Data changes faster than it's read (write-heavy)</LI>
              <LI>Strong consistency required (financial transactions)</LI>
              <LI>Query is already fast (&lt;5ms)</LI>
              <LI>Data is unique per request (can't share cache)</LI>
            </UL>
          </KeyPoint>

          <Divider />

          <H2>❌ When NOT to Use Cache-Aside (Anti-Patterns)</H2>

          <Example title="Anti-Pattern 1: Caching Rapidly Changing Data">
            <P><Strong>❌ WRONG: Cache-aside for stock prices with 60s TTL</Strong></P>

            <CodeBlock language="typescript">
{`// ❌ DANGEROUS: Stock prices change every second!
async function getStockPrice(symbol: string) {
  const cached = await redis.get(\`price:\${symbol}\`);
  if (cached) return cached; // Could be 60 seconds old!

  const price = await db.getPrice(symbol);
  await redis.set(\`price:\${symbol}\`, price, 'EX', 60);
  return price;
}

// User sees $100, clicks buy, actual price is $105 → LAWSUIT`}
            </CodeBlock>

            <P><Strong>Why this fails:</Strong></P>
            <UL>
              <LI>Stock prices change every millisecond</LI>
              <LI>Even 1-second staleness is unacceptable</LI>
              <LI>Users make financial decisions based on stale data</LI>
            </UL>

            <P><Strong>✅ RIGHT: Use write-through or don't cache</Strong></P>

            <CodeBlock language="typescript">
{`// ✅ OPTION 1: Write-through (cache always fresh)
async function updateStockPrice(symbol: string, newPrice: number) {
  await Promise.all([
    redis.set(\`price:\${symbol}\`, newPrice), // Update cache
    db.updatePrice(symbol, newPrice)          // Update DB
  ]);
}

// ✅ OPTION 2: Don't cache, optimize DB instead
// Use materialized views, read replicas, proper indexes`}
            </CodeBlock>
          </Example>

          <Example title="Anti-Pattern 2: Caching Without User Segmentation">
            <P><Strong>❌ WRONG: Same cache key for all users</Strong></P>

            <CodeBlock language="typescript">
{`// ❌ PRIVACY BREACH: Everyone gets same cached data!
async function getHomepage() {
  const cached = await redis.get('homepage');
  if (cached) return cached;

  const homepage = await generatePersonalizedFeed(currentUser);
  await redis.set('homepage', homepage, 'EX', 300);
  return homepage;
}

// User A logs in → sees their feed → cached
// User B logs in → gets User A's feed → PRIVACY VIOLATION!`}
            </CodeBlock>

            <P><Strong>✅ RIGHT: Include user ID in cache key</Strong></P>

            <CodeBlock language="typescript">
{`// ✅ CORRECT: User-specific cache key
async function getHomepage(userId: string) {
  const cacheKey = \`homepage:\${userId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const homepage = await generatePersonalizedFeed(userId);
  await redis.set(cacheKey, homepage, 'EX', 300);
  return homepage;
}`}
            </CodeBlock>
          </Example>

          <Example title="Anti-Pattern 3: Caching Already-Fast Queries">
            <P><Strong>❌ WRONG: Caching a 2ms query</Strong></P>

            <P><Strong>Analysis:</Strong></P>
            <CodeBlock>
{`Database query: 2ms (with proper index)
Network to Redis: 1ms
Redis lookup: 1ms
Total with cache: 2ms

Cache doesn't help! Just adds complexity for zero benefit.`}
            </CodeBlock>

            <P><Strong>✅ RIGHT: Only cache slow queries (&gt;10ms)</Strong></P>
          </Example>

          <KeyPoint>
            <Strong>Summary: When NOT to Use Caching</Strong>
            <UL>
              <LI><Strong>Rapidly changing data:</Strong> Stock prices, live sports scores → Use optimized DB or pub/sub</LI>
              <LI><Strong>User-specific data without segmentation:</Strong> Always include userId in cache key</LI>
              <LI><Strong>Already-fast queries:</Strong> If DB query &lt;5ms, caching won't help</LI>
              <LI><Strong>Write-heavy workloads:</Strong> If writes &gt; reads, cache-aside hurts performance</LI>
              <LI><Strong>Strong consistency required:</Strong> Financial transactions → Use write-through or no cache</LI>
            </UL>
          </KeyPoint>
        </Section>
      ),
    },

    // NEW: Practice Exercise 1
    {
      id: 'practice-cache-aside',
      type: 'canvas-practice',
      title: 'Practice: Build Cache-Aside System',
      description: 'Design a system using cache-aside pattern for a read-heavy workload',
      estimatedMinutes: 10,
      scenario: {
        description: 'Design a URL shortener redirect system (like TinyURL) that handles 1,000 redirects per second (read-heavy workload)',
        requirements: [
          'Handle 1,000 RPS read traffic (redirects)',
          'Achieve >80% cache hit rate to reduce database load',
          'p99 latency < 50ms',
          'Keep costs under $500/month'
        ],
        constraints: [
          'Redirect traffic is read-heavy (90% of all requests)',
          'Popular URLs are accessed repeatedly (great for caching!)',
          'URLs never change once created (immutable data)'
        ]
      },
      hints: [
        'Start with basic topology: Client → App Server → Database',
        'Add Redis cache between app server and database',
        'Cache-aside pattern: App checks cache first, falls back to DB on miss',
        'Configure cache with appropriate TTL (URLs are immutable, so long TTL is fine)'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 300, y: 200 },
            config: { instances: 2 }
          },
          {
            id: 'cache',
            type: 'cache',
            position: { x: 500, y: 150 },
            config: {
              instanceType: 'redis-small',
              ttl: 3600
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 500, y: 250 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'app_server',
            target: 'cache',
            type: 'tcp'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Why this works:**

1. **Cache between app and database**: App checks Redis first, queries DB on miss
2. **2 app servers**: Handle 1,000 RPS easily (500 RPS each)
3. **Redis cache**:
   - Stores popular URLs (cache-aside pattern)
   - 80%+ cache hit rate means only 200 RPS hit database
   - Database can handle this easily
4. **Long TTL (1 hour)**: URLs never change, so no staleness concerns
5. **Cost**: ~$300/month (well under $500 budget)

**Performance:**
- Cache hit: ~5ms latency ✓
- Cache miss: ~20ms latency ✓
- Both under 50ms requirement!

**This is exactly how TinyURL, bit.ly, and other URL shorteners work!**
      `
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

          <Divider />

          <InfoBox type="tip">
            <P>
              <Strong>Pro tip:</Strong> Most production systems use <Strong>LRU + TTL</Strong> together:
            </P>
            <UL>
              <LI>LRU evicts unpopular items when memory is full</LI>
              <LI>TTL ensures data doesn't get too stale</LI>
              <LI>Best of both worlds!</LI>
            </UL>
          </InfoBox>
        </Section>
      ),
    },

    // NEW: Practice Exercise 2
    {
      id: 'practice-cache-eviction',
      type: 'canvas-practice',
      title: 'Practice: Configure Cache Eviction',
      description: 'Design a caching strategy with appropriate eviction policy',
      estimatedMinutes: 10,
      scenario: {
        description: 'Design a social media feed system that caches user timelines. Some users are very active (post frequently), others rarely post.',
        requirements: [
          'Handle 5,000 RPS read traffic (timeline requests)',
          'Cache has limited memory (can only hold 10,000 timelines)',
          'Popular users\' feeds should stay in cache',
          'Inactive users\' feeds can be evicted'
        ]
      },
      hints: [
        'LRU policy works well here - popular feeds stay cached',
        'Add TTL to ensure feeds don\'t get too stale (e.g., 10 minutes)',
        'Use Redis with LRU eviction policy configured',
        'Size cache appropriately for 10,000 timelines'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 250, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: { instances: 4 }
          },
          {
            id: 'cache',
            type: 'cache',
            position: { x: 600, y: 150 },
            config: {
              instanceType: 'redis-medium',
              evictionPolicy: 'lru',
              ttl: 600, // 10 minutes
              maxMemory: '2gb'
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 600, y: 250 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: true, replicas: 2, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'cache',
            type: 'tcp'
          },
          {
            id: 'e4',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Configuration explained:**

1. **LRU eviction policy**:
   - Popular users' feeds accessed frequently → stay in cache
   - Inactive users' feeds rarely accessed → evicted when memory full
   - Automatic optimization based on access patterns!

2. **TTL = 10 minutes**:
   - Ensures feeds don't get too stale
   - New posts appear within 10 minutes
   - Balance between freshness and cache hit rate

3. **Redis medium (2GB memory)**:
   - Can hold ~10,000 timelines (200KB each)
   - When full, LRU evicts least recently used

4. **Read replicas on database**:
   - Cache misses go to read replicas
   - Reduces load on primary database

**Result**: 85%+ cache hit rate, feeds stay fresh, popular content stays cached!
      `
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

    // NEW: Real-World Case Study
    {
      id: 'cache-stampede-case-study',
      type: 'concept',
      title: 'War Story: The Reddit Cache Stampede',
      content: (
        <Section>
          <H1>Real-World Failure: Cache Stampede at Reddit</H1>

          <InfoBox type="warning">
            <P>
              <Strong>What happened:</Strong> In 2018, Reddit's homepage cache expired during peak traffic.
              Thousands of requests hit the database simultaneously, causing a 15-minute outage.
            </P>
          </InfoBox>

          <H2>The Problem: Cache Stampede (Thundering Herd)</H2>

          <P>
            When a popular cache entry expires, ALL concurrent requests try to regenerate it simultaneously.
          </P>

          <Example title="Cache Stampede Timeline">
            <CodeBlock>
{`Time 0s: Homepage cached, serving 10,000 RPS from cache
        Cache hit rate: 99.9%
        Database load: ~10 queries/second

Time 300s: Cache entry expires (TTL reached)

Time 300.1s: 10,000 requests arrive simultaneously
            ALL see cache miss
            ALL query database at once

Database receives: 10,000 queries in 100ms
Database capacity: 100 queries/second
Result: Database overloaded → crashes

Time 300.5s - 915s: Outage (database down, recovering)
                    Users see 503 errors

Total impact: 15 minutes of downtime`}
            </CodeBlock>
          </Example>

          <H2>Why This Happens</H2>

          <OL>
            <LI><Strong>Popular cache entry expires</Strong> (TTL reached)</LI>
            <LI><Strong>First request gets cache miss</Strong> → queries database</LI>
            <LI><Strong>Before it finishes, 1000 more requests arrive</Strong></LI>
            <LI><Strong>All 1000 requests also get cache miss</Strong> (cache not yet populated)</LI>
            <LI><Strong>All 1000 requests hit database simultaneously</Strong> → database overwhelmed</LI>
          </OL>

          <H2>The Solution: Cache Stampede Protection</H2>

          <P><Strong>Approach 1: Locking (Request Coalescing)</Strong></P>

          <Example title="Lock-Based Protection">
            <CodeBlock>
{`async function getCachedData(key: string) {
  // Check cache first
  const cached = await redis.get(key);
  if (cached) return cached;

  // Cache miss - acquire lock
  const lockKey = 'lock:' + key;
  const lockAcquired = await redis.set(
    lockKey,
    '1',
    'NX',  // Only set if not exists
    'EX', 10  // Lock expires in 10 seconds
  );

  if (lockAcquired) {
    // I won the lock - I'll regenerate the data
    try {
      const data = await generateExpensiveData();
      await redis.set(key, data, 'EX', 300);
      return data;
    } finally {
      await redis.del(lockKey);
    }
  } else {
    // Someone else is regenerating - wait and retry
    await sleep(100);
    const data = await redis.get(key);
    if (data) return data;

    // Still not ready - query database (fallback)
    return await generateExpensiveData();
  }
}`}
            </CodeBlock>
          </Example>

          <P><Strong>Approach 2: Probabilistic Early Expiration</Strong></P>

          <Example title="Probabilistic Expiration">
            <CodeBlock>
{`async function getCachedDataWithEarlyExpiration(key: string) {
  const cached = await redis.get(key);
  if (!cached) {
    // Normal cache miss - regenerate
    return await regenerateAndCache(key);
  }

  const data = JSON.parse(cached);
  const ttl = await redis.ttl(key);

  // Probabilistically regenerate before expiration
  // Probability increases as TTL decreases
  const refreshProbability = (300 - ttl) / 300;

  if (Math.random() < refreshProbability) {
    // Asynchronously refresh in background
    regenerateAndCache(key).catch(err =>
      console.error('Background refresh failed:', err)
    );
  }

  return data;
}

// Example:
// TTL = 300s (5 min) → 0% chance of early refresh
// TTL = 150s → 50% chance of early refresh
// TTL = 30s → 90% chance of early refresh
// Result: Cache refreshed before expiration!`}
            </CodeBlock>
          </Example>

          <H2>Lessons Learned from Reddit</H2>

          <UL>
            <LI><Strong>✓ Always protect against cache stampede</Strong> for popular data</LI>
            <LI><Strong>✓ Use locking or request coalescing</Strong> to limit database load</LI>
            <LI><Strong>✓ Consider probabilistic early expiration</Strong> for critical cache entries</LI>
            <LI><Strong>✓ Stagger cache expiration times</Strong> (don't let all entries expire at once)</LI>
            <LI><Strong>✓ Monitor cache hit rates and database load</Strong></LI>
            <LI><Strong>✓ Have circuit breakers</Strong> to prevent cascading failures</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Popular cache entries should NEVER expire simultaneously.
            Always implement stampede protection!
          </KeyPoint>
        </Section>
      ),
    },

    // NEW: Practice Exercise 3 - Cache Stampede Protection
    {
      id: 'practice-stampede-protection',
      type: 'canvas-practice',
      title: 'Challenge: Prevent Cache Stampede',
      description: 'Design a system that handles cache stampede gracefully',
      estimatedMinutes: 15,
      scenario: {
        description: 'Your homepage is cached and receives 10,000 RPS. The cache expires every 5 minutes. You need to prevent cache stampede from overloading your database.',
        requirements: [
          'Handle 10,000 RPS read traffic',
          'Cache expires every 5 minutes (TTL = 300s)',
          'Database can only handle 200 queries/second',
          'Prevent cache stampede when cache expires',
          'Maintain <100ms p99 latency'
        ],
        constraints: [
          'Cache will expire during peak traffic',
          'Database capacity is fixed at 200 QPS',
          'Cannot increase database capacity (budget constraint)'
        ]
      },
      hints: [
        'Use request queue or message queue to buffer database requests',
        'Consider using locking at application level',
        'Multiple app servers can help distribute load',
        'Monitor cache hit ratio and database load'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 250, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: {
              instances: 6,
              cacheStampedeProtection: true  // Implements locking
            }
          },
          {
            id: 'cache',
            type: 'cache',
            position: { x: 600, y: 150 },
            config: {
              instanceType: 'redis-large',
              ttl: 300
            }
          },
          {
            id: 'message_queue',
            type: 'message_queue',
            position: { x: 600, y: 250 },
            config: {
              instanceType: 'kafka-small'
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 800, y: 250 },
            config: {
              instanceType: 'commodity-db',
              maxQPS: 200
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'cache',
            type: 'tcp'
          },
          {
            id: 'e4',
            source: 'app_server',
            target: 'message_queue',
            type: 'tcp'
          },
          {
            id: 'e5',
            source: 'message_queue',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Cache Stampede Protection Strategy:**

1. **Application-Level Locking**:
   - First app server to see cache miss acquires Redis lock
   - Other app servers see lock exists → wait for cache to populate
   - Only 1 request hits database, others wait for cache

2. **Message Queue as Buffer**:
   - If cache lock fails, requests go to queue
   - Queue processes at database capacity (200 QPS)
   - Prevents overwhelming database

3. **6 App Servers**:
   - Distribute 10,000 RPS (~1,667 RPS per server)
   - Implement stampede protection logic
   - Can handle lock contention

4. **Large Redis Instance**:
   - Can handle locking operations (SET NX)
   - Stores homepage data
   - High availability for locks

**What happens when cache expires:**

Time 0s: Cache expires
Time 0.001s: Server 1 gets cache miss, acquires lock, queries DB
Time 0.002s: Servers 2-6 get cache miss, see lock, wait
Time 0.150s: Server 1 finishes query, populates cache, releases lock
Time 0.151s: Servers 2-6 check cache → HIT! ✓

**Result**: Only 1 database query instead of 10,000!

**This is how Facebook, Twitter, and Reddit protect against cache stampede.**
      `
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

          <H2>Architecture Visualization</H2>

          <CodeBlock>
{`Single Cache Server:
==================
┌────────┐    ┌─────────┐    ┌───────┐    ┌──────────┐
│ Client │───►│ App Srv │───►│ Cache │───►│ Database │
└────────┘    └─────────┘    └───────┘    └──────────┘
                              Single point of failure!
                              Memory limited to 1 server


Distributed Cache (3 servers):
===============================
                              ┌──────────┐
                          ┌──►│ Cache #1 │
                          │   └──────────┘
┌────────┐    ┌─────────┐│   ┌──────────┐    ┌──────────┐
│ Client │───►│ App Srv ├┼──►│ Cache #2 │───►│ Database │
└────────┘    └─────────┘│   └──────────┘    └──────────┘
                          │   ┌──────────┐
                          └──►│ Cache #3 │
                              └──────────┘
                              Higher capacity, better availability!`}
          </CodeBlock>

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

          <Example title="3-tier cache architecture">
            <CodeBlock>
{`┌─────────────────────────────────────────┐
│ L1: Local In-Memory Cache (per server)  │
│     • 100MB per app server               │
│     • <1ms latency                       │
│     • No network calls                   │
│     • LRU eviction                       │
└─────────────────────────────────────────┘
           ↓ (cache miss)
┌─────────────────────────────────────────┐
│ L2: Redis Cluster (distributed)         │
│     • 10GB total capacity                │
│     • 1-5ms latency                      │
│     • Shared across all servers          │
│     • Persistent storage                 │
└─────────────────────────────────────────┘
           ↓ (cache miss)
┌─────────────────────────────────────────┐
│ L3: CDN Edge Cache (global)             │
│     • 1TB+ capacity                      │
│     • 10-50ms latency                    │
│     • Geographically distributed         │
│     • Static content only                │
└─────────────────────────────────────────┘
           ↓ (cache miss)
┌─────────────────────────────────────────┐
│ Database (source of truth)              │
└─────────────────────────────────────────┘

Read flow: Check L1 → L2 → L3 → Database
Write flow: Write to Database → Invalidate L1, L2, L3`}
            </CodeBlock>
          </Example>

          <P><Strong>Benefits of multi-layer caching:</Strong></P>
          <UL>
            <LI>L1 serves hottest data with sub-millisecond latency</LI>
            <LI>L2 serves popular data across all servers</LI>
            <LI>L3 serves static content from edge locations</LI>
            <LI>Each layer reduces load on layers below</LI>
          </UL>
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

          <Example title="Anti-pattern">
            <CodeBlock>
{`// BAD: Cache everything, even rarely accessed data
await cache.set('user:' + userId, userData);  // User accessed once/month
await cache.set('product:' + productId, product);  // Product never viewed`}
            </CodeBlock>
          </Example>

          <Example title="Better approach">
            <CodeBlock>
{`// GOOD: Only cache after confirming it's frequently accessed
const cacheKey = 'user:' + userId;
const accessCount = await analytics.getAccessCount(cacheKey);

if (accessCount > 10) {  // Only cache if accessed 10+ times
  await cache.set(cacheKey, userData, 'EX', 300);
}`}
            </CodeBlock>
          </Example>

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

          <P><Strong>Solution:</Strong> Use cache locking or probabilistic early expiration (see case study above)</P>

          <Divider />

          <H2>❌ Mistake 3: No TTL</H2>
          <P><Strong>Problem:</Strong> Stale data stays in cache forever</P>
          <P><Strong>Solution:</Strong> Always set appropriate TTL values</P>

          <Example title="Fix">
            <CodeBlock>
{`// BAD: No TTL - data never expires
await cache.set('product:123', data);

// GOOD: Set TTL based on how often data changes
await cache.set('product:123', data, 'EX', 300);  // 5 minutes for product data
await cache.set('stock-price:AAPL', data, 'EX', 60);  // 1 minute for stock prices
await cache.set('static-page', data, 'EX', 86400);  // 24 hours for static content`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>❌ Mistake 4: Caching Personalized Data Globally</H2>
          <P><Strong>Problem:</Strong> User A sees User B's data</P>

          <Example title="Wrong">
            <CodeBlock>
{`// BAD: Cache key doesn't include user ID
cache.set('shopping-cart', userCart);

// User A's cart gets cached
// User B requests cart → gets User A's cart! 😱`}
            </CodeBlock>
          </Example>

          <Example title="Correct">
            <CodeBlock>
{`// GOOD: Include user ID in cache key
cache.set('shopping-cart:user:' + userId, userCart);

// Now each user has their own cache entry`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>❌ Mistake 5: Not Handling Cache Failures</H2>
          <P><Strong>Problem:</Strong> Application crashes when cache is down</P>
          <P><Strong>Solution:</Strong> Always have fallback to database</P>

          <Example title="Resilient caching">
            <CodeBlock>
{`async function getProductResilient(productId: string) {
  try {
    // Try cache first
    const cached = await cache.get('product:' + productId);
    if (cached) return JSON.parse(cached);

    // Cache miss - query database
    const product = await database.query(productId);

    // Try to populate cache (best effort)
    try {
      await cache.set(
        'product:' + productId,
        JSON.stringify(product),
        'EX', 300
      );
    } catch (cacheWriteError) {
      // Cache write failed, but we still have data
      console.error('Cache write failed:', cacheWriteError);
    }

    return product;
  } catch (cacheError) {
    // Cache is completely down - fallback to database
    console.error('Cache error, using database:', cacheError);
    return await database.query(productId);
  }
}`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Cache should improve performance, not break functionality.
            Always have a fallback!
          </KeyPoint>

          <Divider />

          <H2>Caching Best Practices Checklist</H2>

          <InfoBox type="success">
            <P><Strong>Before deploying caching to production:</Strong></P>
            <UL>
              <LI>✓ Set appropriate TTL values for all cache entries</LI>
              <LI>✓ Implement cache stampede protection for popular data</LI>
              <LI>✓ Include user ID in cache keys for personalized data</LI>
              <LI>✓ Have fallback to database when cache fails</LI>
              <LI>✓ Monitor cache hit rates (target: 80%+)</LI>
              <LI>✓ Monitor cache memory usage</LI>
              <LI>✓ Invalidate cache on data updates</LI>
              <LI>✓ Use LRU + TTL eviction policy</LI>
              <LI>✓ Test cache failures (chaos engineering)</LI>
            </UL>
          </InfoBox>
        </Section>
      ),
    },

    // NEW: Trade-Off Decision Quiz
    {
      id: 'tradeoff-quiz-caching',
      type: 'quiz',
      title: 'Trade-Off Exercise: Choose the Right Cache Strategy',
      description: 'Test your ability to make caching trade-off decisions',
      estimatedMinutes: 8,
      questions: [
        {
          id: 'cache-tech-choice-1',
          question: `**Scenario:** You're building a notification system that sends push notifications to mobile apps.

**Requirements:**
- 10,000 notifications/second
- Must be fast (<50ms processing time)
- If notification fails, retry 3 times then discard
- Don't need to replay old notifications

**Which queue/cache should you use?**`,
          options: [
            'Kafka (durable, can replay events, high throughput)',
            'Redis List (simple, fast, ephemeral)',
            'RabbitMQ (reliable delivery with acknowledgment)',
            'Memcached (simple key-value cache)'
          ],
          correctAnswer: 'Redis List (simple, fast, ephemeral)',
          explanation: `**Correct: Redis List**

**Why Redis List wins:**
- ✅ Fast (<10ms latency, well under 50ms requirement)
- ✅ Simple to set up (no ZooKeeper, no complex config)
- ✅ Ephemeral data is fine (don't need to replay notifications)
- ✅ Low cost (~$100/mo vs $500+ for Kafka)
- ✅ Built-in retry (BRPOPLPUSH for safe retries)

**Why NOT Kafka:**
- ❌ Overkill - you don't need event replay
- ❌ Higher latency (5-50ms just for queue operations)
- ❌ Complex setup (ZooKeeper + brokers + consumer groups)
- ❌ 5-10x more expensive for this use case

**Why NOT RabbitMQ:**
- ❌ Slower than Redis (10-100ms typical latency)
- ❌ More complex than needed for simple queue

**Why NOT Memcached:**
- ❌ Not designed for queues (just key-value cache)
- ❌ No list/queue data structures

**Trade-off made:** Chose simplicity + speed over durability (acceptable since notifications are ephemeral).`
        },
        {
          id: 'cache-tech-choice-2',
          question: `**Scenario:** E-commerce product catalog with:
- 100,000 products
- Read 10,000 times/sec
- Updated 10 times/sec (new products, price changes)
- Need <20ms latency
- Staleness up to 60 seconds is acceptable

**Which caching strategy?**`,
          options: [
            'Cache-aside with Redis, 60s TTL',
            'Write-through with Redis (update cache + DB together)',
            'Write-behind with Redis (async DB writes)',
            'No caching - use optimized database queries'
          ],
          correctAnswer: 'Cache-aside with Redis, 60s TTL',
          explanation: `**Correct: Cache-aside with Redis, 60s TTL**

**Why cache-aside wins:**
- ✅ Read-heavy (10,000 reads vs 10 writes = 1000:1 ratio)
- ✅ Staleness acceptable (60s TTL is fine for product catalog)
- ✅ Simple to implement (app controls cache population)
- ✅ Database fallback on cache miss (resilient)
- ✅ Cost-effective (cache hit rate will be ~95%+)

**Analysis:**
- 95% cache hit → Only 500 DB queries/sec (vs 10,000 without cache)
- Database load reduced 20x
- Latency: 2ms (cache) vs 20ms (DB)

**Why NOT write-through:**
- ❌ Overkill - you don't need immediate consistency
- ❌ Every write updates cache + DB (slower writes)
- ❌ More complex for no benefit (staleness is acceptable)

**Why NOT write-behind:**
- ❌ Risk of data loss (cache crashes before DB write)
- ❌ Way too complex for this use case

**Why NOT "no caching":**
- ❌ Database would handle 10,000 reads/sec (expensive, slow)
- ❌ Higher latency (20ms vs 2ms)

**Trade-off made:** Chose eventual consistency (60s stale) for 10x better performance and 20x lower cost.`
        },
        {
          id: 'cache-pattern-choice',
          question: `**Scenario:** Banking app showing account balance.

**Requirements:**
- User checks balance 50 times/day
- Transactions happen 2 times/day
- Balance must be accurate for transactions
- Balance view can be 30s stale (for non-transaction reads)

**Which caching strategy?**`,
          options: [
            'Cache-aside for all reads (30s TTL)',
            'Write-through for transactions, cache-aside for balance views',
            'Write-through for everything (always consistent)',
            'No caching (too risky for financial data)'
          ],
          correctAnswer: 'Write-through for transactions, cache-aside for balance views',
          explanation: `**Correct: Write-through for transactions, cache-aside for balance views**

**Why this hybrid approach wins:**
- ✅ Transactions need strong consistency → write-through (cache + DB updated together)
- ✅ Balance views can be stale → cache-aside with 30s TTL (faster, cheaper)
- ✅ Best of both worlds: accuracy when needed, speed for reads

**Implementation:**
\`\`\`typescript
// For transactions: write-through (strong consistency)
async function makeTransaction(accountId, amount) {
  const newBalance = currentBalance - amount;
  await Promise.all([
    redis.set(\`balance:\${accountId}\`, newBalance),
    db.updateBalance(accountId, newBalance)
  ]);
}

// For balance view: cache-aside (eventual consistency OK)
async function getBalance(accountId) {
  const cached = await redis.get(\`balance:\${accountId}\`);
  if (cached) return cached;

  const balance = await db.getBalance(accountId);
  await redis.set(\`balance:\${accountId}\`, balance, 'EX', 30);
  return balance;
}
\`\`\`

**Why NOT cache-aside for everything:**
- ❌ Transaction reads could see stale data
- ❌ User withdraws $100, balance shows old amount → overdraft!

**Why NOT write-through for everything:**
- ❌ Overkill - balance views don't need strong consistency
- ❌ Slower reads (always check cache freshness)
- ❌ More complex than needed for read-only views

**Why NOT no caching:**
- ❌ Database would handle 50 balance checks/day per user
- ❌ Unnecessary load when staleness is acceptable for views

**Trade-off made:** Hybrid strategy optimizes for accuracy where needed (transactions) and speed where acceptable (balance views).`
        },
        {
          id: 'redis-vs-memcached',
          question: `**Scenario:** Building a leaderboard for a mobile game showing top 100 players.

**Requirements:**
- Update scores 1000 times/sec
- Query top 100 players 5000 times/sec
- Need sorted ranking (1st, 2nd, 3rd, etc.)
- Must be real-time (<100ms staleness)

**Which cache technology?**`,
          options: [
            'Redis (has sorted sets for rankings)',
            'Memcached (simple and fast)',
            'PostgreSQL with caching (use materialized views)',
            'In-process cache (fast, no network)'
          ],
          correctAnswer: 'Redis (has sorted sets for rankings)',
          explanation: `**Correct: Redis with Sorted Sets**

**Why Redis wins:**
- ✅ Has SORTED SETS data structure (perfect for leaderboards!)
- ✅ O(log N) insert/update with \`ZADD\`
- ✅ O(log N) range queries with \`ZRANGE\` (get top 100)
- ✅ Atomic operations (no race conditions)
- ✅ Real-time updates (<1ms latency)

**Redis Implementation:**
\`\`\`typescript
// Update score (O(log N) - very fast)
await redis.zadd('leaderboard', score, playerId);

// Get top 100 (O(log N + 100) - very fast)
const top100 = await redis.zrange(
  'leaderboard',
  0,
  99,
  'WITHSCORES',
  'REV' // Reverse order (highest first)
);

// Get player rank (O(log N))
const rank = await redis.zrevrank('leaderboard', playerId);
\`\`\`

**Why NOT Memcached:**
- ❌ No sorted set data structure
- ❌ Would need to maintain sorted array manually (slow!)
- ❌ Race conditions with concurrent updates

**Why NOT PostgreSQL:**
- ❌ Too slow (20ms+ for queries vs <1ms for Redis)
- ❌ High write load would kill performance
- ❌ Would need manual caching layer anyway

**Why NOT in-process cache:**
- ❌ Can't share across multiple app servers
- ❌ Each server would have different leaderboard (inconsistent!)
- ❌ Doesn't scale horizontally

**Trade-off made:** Redis complexity is worth it for built-in sorted set data structure (vs manual implementation with Memcached).`
        }
      ],
      keyPoints: [
        'Choose technology based on requirements, not familiarity',
        'Redis for data structures (lists, sets, sorted sets), Memcached for simple key-value',
        'Cache-aside for read-heavy + staleness OK, write-through for consistency required',
        'Hybrid strategies (mixing patterns) optimize for different access patterns',
        'Always analyze: Read/write ratio, latency requirements, consistency needs, cost'
      ]
    },

    // NEW: Connection to challenges and next steps
    {
      id: 'next-steps',
      type: 'concept',
      title: 'Next Steps & Practice',
      content: (
        <Section>
          <H1>Ready to Apply Your Knowledge?</H1>

          <P>
            You've learned caching fundamentals! Now it's time to apply these concepts to real system design challenges.
          </P>

          <H2>Recommended Challenges</H2>

          <InfoBox type="tip">
            <P><Strong>Challenge 1: TinyURL (Beginner)</Strong></P>
            <P>
              Design a URL shortener that uses cache-aside pattern for redirects.
              This is perfect for practicing what you learned because:
            </P>
            <UL>
              <LI>Read-heavy workload (90% reads) - ideal for caching</LI>
              <LI>Immutable data (URLs never change) - no staleness concerns</LI>
              <LI>Popular URLs benefit from caching - classic 80/20 distribution</LI>
              <LI>Practice: cache-aside, TTL configuration, cache hit ratio optimization</LI>
            </UL>
          </InfoBox>

          <InfoBox type="tip">
            <P><Strong>Challenge 2: Social Media Feed (Intermediate)</Strong></P>
            <P>
              Design a feed system with multi-layer caching. You'll practice:
            </P>
            <UL>
              <LI>LRU eviction for limited cache capacity</LI>
              <LI>Cache invalidation when new posts arrive</LI>
              <LI>Personalized data caching (different cache key per user)</LI>
              <LI>Cache stampede protection for popular feeds</LI>
            </UL>
          </InfoBox>

          <Divider />

          <H2>Learning Path</H2>

          <P><Strong>You've completed:</Strong></P>
          <UL>
            <LI>✓ Caching fundamentals</LI>
            <LI>✓ Cache-aside, write-through, write-behind patterns</LI>
            <LI>✓ Eviction policies (LRU, LFU, TTL)</LI>
            <LI>✓ Cache stampede protection</LI>
            <LI>✓ Hands-on practice with 3 exercises</LI>
          </UL>

          <P><Strong>Continue learning:</Strong></P>
          <UL>
            <LI>→ <Strong>Distributed Caching</Strong> - Learn Redis clustering, consistent hashing</LI>
            <LI>→ <Strong>Database Optimization</Strong> - Indexes, query optimization, read replicas</LI>
            <LI>→ <Strong>CDN Fundamentals</Strong> - Edge caching, static content delivery</LI>
          </UL>

          <Divider />

          <H2>Key Takeaways</H2>

          <KeyPoint>
            <Strong>When to cache:</Strong>
          </KeyPoint>
          <UL>
            <LI>Read-heavy workloads (80%+ reads)</LI>
            <LI>Expensive computations or database queries</LI>
            <LI>Data that doesn't change frequently</LI>
            <LI>Popular content accessed by many users</LI>
          </UL>

          <KeyPoint>
            <Strong>How to cache safely:</Strong>
          </KeyPoint>
          <UL>
            <LI>Always set TTL to prevent stale data</LI>
            <LI>Invalidate cache when data changes</LI>
            <LI>Protect against cache stampede</LI>
            <LI>Have database fallback for resilience</LI>
            <LI>Monitor cache hit rates</LI>
          </UL>

          <KeyPoint>
            <Strong>Remember:</Strong> Caching is about trade-offs. You're trading freshness for speed,
            complexity for performance. Choose wisely based on your requirements!
          </KeyPoint>
        </Section>
      ),
    },
  ],
};
