import type { SystemDesignLesson } from '../../../types/lesson';
import { SystemGraph } from '../../../types/graph';

export const cachingLesson: SystemDesignLesson = {
  id: 'sd-caching',
  slug: 'caching-strategies',
  title: 'Caching Strategies',
  description: 'Learn when and how to use caching to improve performance and reduce database load',
  difficulty: 'intermediate',
  estimatedMinutes: 30,
  category: 'components',
  tags: ['caching', 'performance', 'redis', 'cache-aside'],
  prerequisites: ['basic-components', 'understanding-scale'],
  learningObjectives: [
    'Understand when caching helps',
    'Learn cache-aside pattern',
    'Calculate cache hit ratios',
    'Choose appropriate cache size',
    'Practice adding cache to a system',
  ],
  conceptsCovered: [
    {
      id: 'cache-aside',
      name: 'Cache-Aside Pattern',
      type: 'pattern',
      difficulty: 3,
      description: 'Application checks cache first, then database on miss',
    },
    {
      id: 'cache-hit-ratio',
      name: 'Cache Hit Ratio',
      type: 'metric',
      difficulty: 2,
      description: 'Percentage of requests served from cache',
    },
  ],
  relatedChallenges: ['tiny-url', 'food-blog'],
  practiceComponents: [
    { type: 'client', required: true },
    { type: 'app_server', required: true },
    { type: 'cache', required: true },
    { type: 'database', required: true },
  ],
  stages: [
    {
      id: 'caching-when',
      type: 'concept',
      title: 'When to Use Caching',
      description: 'Understanding when caching helps',
      estimatedMinutes: 5,
      content: {
        markdown: `# When to Use Caching

Caching stores frequently accessed data in fast memory to speed up repeated requests.

## When Caching Helps

✅ **Frequently accessed data**: Same data requested many times
✅ **Rarely changing data**: Data doesn't change often
✅ **Expensive to compute**: Database queries, API calls, calculations
✅ **Read-heavy workloads**: Many more reads than writes

## When Caching Doesn't Help

❌ **Unique requests**: Each request is different (no reuse)
❌ **Frequently changing data**: Data changes faster than cache TTL
❌ **Write-heavy workloads**: Mostly writes, few reads
❌ **Small datasets**: Database is fast enough without cache

## Real-World Examples

### Good for Caching:
- **User profiles**: Accessed frequently, change rarely
- **Product catalog**: Many users view same products
- **News articles**: Popular articles read many times
- **Session data**: User sessions accessed on every request

### Not Good for Caching:
- **Real-time stock prices**: Changes constantly
- **Unique search results**: Each query is different
- **User-generated content**: Changes frequently
- **Financial transactions**: Must be accurate, not cached

## Cache Benefits

1. **Speed**: Memory access is 100-1000x faster than disk
2. **Reduced load**: 90%+ of requests can be served from cache
3. **Cost savings**: Fewer database queries = lower costs
4. **Better UX**: Faster responses = happier users`,
      },
      keyPoints: [
        'Cache works best for frequently accessed, rarely changing data',
        'Read-heavy workloads benefit most from caching',
        'Caching significantly reduces database load',
      ],
    },
    {
      id: 'caching-patterns',
      type: 'concept',
      title: 'Cache Patterns',
      description: 'Different caching strategies',
      estimatedMinutes: 8,
      content: {
        markdown: `# Cache Patterns

There are several ways to use caching. The most common is **cache-aside**.

## Cache-Aside (Lazy Loading)

**Most common pattern** - Application manages cache.

### Flow:
1. **Read**: App checks cache → if miss, query database → store in cache → return
2. **Write**: App writes to database → invalidate cache (or update cache)

### Advantages:
- ✅ Simple to implement
- ✅ Cache failure doesn't break system (falls back to database)
- ✅ Works with any cache system

### Disadvantages:
- ❌ Cache miss adds latency (extra round trip)
- ❌ Stale data possible (if cache not invalidated)

### Example:
\`\`\`python
def get_user(user_id):
    # Check cache first
    cached = cache.get(f"user:{user_id}")
    if cached:
        return cached
    
    # Cache miss - query database
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    
    # Store in cache for next time
    cache.set(f"user:{user_id}", user, ttl=3600)
    return user
\`\`\`

## Write-Through

**Write to cache and database simultaneously.**

### Flow:
1. **Write**: App writes to cache → writes to database → return
2. **Read**: App checks cache → return (always fresh)

### Advantages:
- ✅ Cache always has latest data
- ✅ No stale data

### Disadvantages:
- ❌ Slower writes (two writes)
- ❌ Cache failure breaks writes

## Write-Behind (Write-Back)

**Write to cache first, database later (async).**

### Flow:
1. **Write**: App writes to cache → return immediately → async write to database
2. **Read**: App checks cache → return

### Advantages:
- ✅ Very fast writes
- ✅ Can batch database writes

### Disadvantages:
- ❌ Risk of data loss (cache failure before DB write)
- ❌ More complex

## Which Pattern to Use?

- **Cache-Aside**: Most common, good default
- **Write-Through**: When consistency is critical
- **Write-Behind**: When write performance is critical (rare)`,
      },
      keyPoints: [
        'Cache-aside is the most common pattern',
        'Cache-aside is simple and resilient',
        'Choose pattern based on consistency vs performance needs',
      ],
    },
    {
      id: 'caching-hit-ratio',
      type: 'concept',
      title: 'Cache Hit Ratio',
      description: 'Understanding cache effectiveness',
      estimatedMinutes: 5,
      content: {
        markdown: `# Cache Hit Ratio

**Cache hit ratio** measures how effective your cache is.

## What is Hit Ratio?

- **Hit**: Request found in cache (fast!)
- **Miss**: Request not in cache (must query database)
- **Hit Ratio**: Percentage of requests that are hits

**Formula:**
\`\`\`
Hit Ratio = Hits / (Hits + Misses) × 100%
\`\`\`

## Example

- 1000 requests
- 900 hits, 100 misses
- **Hit ratio**: 900 / 1000 = 90%

## Good Hit Ratios

- **Excellent**: 90%+ (most requests from cache)
- **Good**: 70-90% (significant cache benefit)
- **Fair**: 50-70% (some benefit)
- **Poor**: < 50% (cache not very effective)

## Impact on Database Load

**Example: 10,000 RPS with 90% hit ratio**
- Cache hits: 9,000 RPS (served from cache)
- Cache misses: 1,000 RPS (query database)
- **Database load reduced by 90%!**

## Improving Hit Ratio

1. **Increase cache size**: Store more data
2. **Increase TTL**: Keep data in cache longer
3. **Warm cache**: Pre-populate with popular data
4. **Better eviction**: Keep popular data (LRU, LFU)

## Cache Size Calculation

**Rule of thumb**: Cache size = (Daily unique requests × Average data size) / 10

**Example:**
- 1M unique items accessed per day
- Average item size: 10KB
- Cache size: (1M × 10KB) / 10 = **1GB**

This gives ~90% hit ratio for most workloads.`,
      },
      keyPoints: [
        'Hit ratio measures cache effectiveness',
        '90%+ hit ratio is excellent',
        'Cache size should be ~10% of daily unique data',
      ],
    },
    {
      id: 'caching-practice',
      type: 'canvas-practice',
      title: 'Practice: Add Cache to System',
      description: 'Add Redis cache to reduce database load',
      estimatedMinutes: 12,
      scenario: {
        description: 'You have a read-heavy system (1000 read RPS, 10 write RPS). Add a cache to reduce database load. The cache should use cache-aside pattern.',
        requirements: [
          'Keep existing client, app server, and database',
          'Add a cache component (Redis)',
          'Connect app server to cache',
          'Keep app server to database connection (for cache misses)',
          'Use read connections for cache (cache-aside reads)',
        ],
      },
      initialCanvas: {
        components: [
          {
            id: 'client_1',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {},
          },
          {
            id: 'app_server_1',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: {
              instances: 1,
              instanceType: 'commodity-app',
            },
          },
          {
            id: 'postgresql_1',
            type: 'postgresql',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' },
              sharding: { enabled: false, shards: 1, shardKey: 'id' },
            },
          },
        ],
        connections: [
          {
            from: 'client_1',
            to: 'app_server_1',
            type: 'read',
          },
          {
            from: 'app_server_1',
            to: 'postgresql_1',
            type: 'read',
          },
        ],
      },
      hints: [
        'Add a cache component (type: "cache") between app server and database',
        'Connect app server to cache with a read connection',
        'Keep the app server to database connection (for cache misses)',
        'In cache-aside, app checks cache first, then database if miss',
      ],
      solution: {
        components: [
          {
            id: 'client_1',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {},
          },
          {
            id: 'app_server_1',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: {
              instances: 1,
              instanceType: 'commodity-app',
            },
          },
          {
            id: 'cache_1',
            type: 'cache',
            position: { x: 550, y: 200 },
            config: {
              strategy: 'cache-aside',
              sizeGB: 10,
              ttl: 3600,
            },
          },
          {
            id: 'postgresql_1',
            type: 'postgresql',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' },
              sharding: { enabled: false, shards: 1, shardKey: 'id' },
            },
          },
        ],
        connections: [
          {
            from: 'client_1',
            to: 'app_server_1',
            type: 'read',
          },
          {
            from: 'app_server_1',
            to: 'cache_1',
            type: 'read',
          },
          {
            from: 'app_server_1',
            to: 'postgresql_1',
            type: 'read',
          },
        ],
      },
      solutionExplanation: `## Solution Explanation

This implements the **cache-aside pattern**:

1. **Client → App Server**: User makes request
2. **App Server → Cache**: Check if data is cached (read connection)
3. **App Server → Database**: If cache miss, query database (read connection)

**Flow:**
- Cache hit: Client → App → Cache → Response (fast!)
- Cache miss: Client → App → Cache (miss) → Database → Cache (store) → Response

**Benefits:**
- 90%+ of requests served from cache (fast)
- Database load reduced by 90%
- System can handle 10x more traffic

**Note**: In cache-aside, the app server connects to both cache and database. The app logic decides which to use.`,
    },
  ],
  nextLessons: ['database-replication'],
};

