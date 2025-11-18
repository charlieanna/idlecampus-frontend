import { Challenge } from '../types/testCase';
import { tinyUrlCodeChallenges } from './code/tinyUrlChallenges';

export const tinyUrlChallenge: Challenge = {
  id: 'tiny_url',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  description: `Design a URL shortening service (like bit.ly) that accepts long URLs and returns short codes.

Users can then use these short codes to redirect to the original URLs.

Example:
- POST /shorten with https://example.com/very/long/url → returns abc123
- GET /abc123 → redirects to https://example.com/very/long/url`,

  requirements: {
    functional: [
      'Accept long URLs, generate short codes',
      'Redirect short codes to original URLs',
      'Short codes should be unique',
    ],
    traffic: '1,000 RPS reads (redirects), 100 RPS writes (create short URLs)',
    latency: 'p99 < 100ms for redirects',
    availability: '99.9% uptime',
    budget: '$500/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS (FR) ==========
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can create short URLs and access them for redirects. The system must accept requests and return responses.',
      traffic: {
        type: 'mixed',
        rps: 10, // Very low traffic, just testing basic functionality
        readRps: 5,
        writeRps: 5,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0, // Must work perfectly
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'database', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Minimal viable system - just app server + database.`,
      },
    },
    {
      name: 'URL Uniqueness',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Each short code must be unique. Two different long URLs cannot get the same short code.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    {
      name: 'Correct Redirects',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Accessing a short code must redirect to the correct original URL. No mix-ups allowed.',
      traffic: {
        type: 'read',
        rps: 20,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    {
      name: 'App Server Restart - URL Mappings Lost',
      type: 'functional',
      requirement: 'FR-4',
      description: 'App server restarts at second 5. With only in-memory storage, all URL mappings are lost!',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.5,
      },
      duration: 10,
      failureInjection: {
        type: 'server_restart',
        atSecond: 5,
      },
      passCriteria: {
        maxErrorRate: 0, // After restart, should work but mappings are gone
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'database', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `This test shows why persistence matters for URL shortening:

**With only in-memory storage:**
- App restart = ALL URL mappings LOST ❌
- Short URLs created before restart return 404
- Users' links are broken forever!

**With database connected:**
- App restart = mappings persist ✅
- Short URLs continue working after restart
- Links remain valid indefinitely

**Critical for URL shorteners:**
URLs must work forever once created. Losing mappings breaks trust!`,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS (NFR-P) ==========
    {
      name: 'Normal Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'System handles typical daily traffic (1000 reads/sec, 100 writes/sec) with low latency.',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRps: 1000,
        writeRps: 100,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 500,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 } },
          { type: 'database', config: { readCapacity: 1000, writeCapacity: 1000, replication: false } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'cache', to: 'database' },
        ],
        explanation: `This solution handles 1100 RPS (1000 reads, 100 writes) efficiently:

**Architecture:**
- Load Balancer distributes traffic across app servers
- 2 App Server instances handle the load with headroom
- Redis cache (90% hit ratio) absorbs most read traffic
- PostgreSQL handles cache misses and all writes

**Why it works:**
- Cache absorbs 90% of reads (900 RPS) → only 100 read requests hit DB
- DB handles 100 cache misses + 100 writes = 200 RPS total
- Low latency (~50-80ms p99) due to cache hits
- Cost ~$350/month (within $500 budget)

**Key settings:**
- App Server: 2 instances for redundancy and load distribution
- Redis: 4GB memory, 90% hit ratio, 1-hour TTL
- PostgreSQL: Standard capacity (1000 read/write)`,
      },
    },
    {
      name: 'Read Spike (5x)',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'During a viral event, your URL shortening service receives 5x normal traffic. The system must handle 5000 reads/sec and 100 writes/sec without significant performance degradation.',
      traffic: {
        type: 'mixed',
        rps: 5100,
        readRatio: 0.98, // 5000 reads, 100 writes
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 4 } },
          { type: 'cache', config: { memorySizeGB: 8, ttl: 3600, hitRatio: 0.95 } },
          { type: 'database', config: { readCapacity: 2000, writeCapacity: 1000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'cache', to: 'database' },
        ],
        explanation: `This solution handles a 5x traffic spike (5100 RPS):

**Scaled Architecture:**
- 4 App Server instances (up from 2) to handle increased load
- Larger Redis cache (8GB, 95% hit ratio) to absorb spike
- Database with read replication for cache misses

**Traffic Flow:**
- 5000 RPS reads: Cache absorbs 95% (4750 RPS) → 250 RPS hit DB
- 100 RPS writes → all go to DB
- Total DB load: 350 RPS (well within capacity with replication)

**Why it works:**
- Higher cache hit ratio (95% vs 90%) critical during spikes
- More app server instances distribute load
- Read replicas handle increased cache miss traffic
- p99 latency ~150-180ms (within 200ms target)

**Cost consideration:**
- This configuration costs more (~$600-700/month)
- No cost limit on this test case - focus on performance`,
      },
    },
    {
      name: 'Cache Flush',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Your Redis cache suddenly crashes and loses all cached data at second 15 during normal traffic. The system must handle the sudden load increase on the database while the cache rebuilds without significant downtime.',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRatio: 0.91,
      },
      duration: 60,
      failureInjection: {
        type: 'cache_flush',
        atSecond: 15,
      },
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.02,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 } },
          { type: 'database', config: { readCapacity: 2000, writeCapacity: 1000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'cache', to: 'database' },
        ],
        explanation: `This solution handles a cache flush scenario:

**Challenge:**
- At second 15, the cache is completely flushed
- All traffic (1000 RPS reads) suddenly hits the database
- Cache gradually rebuilds as requests come in

**Why this design works:**
- Database with read replication handles the temporary spike
- 2000 read capacity handles 1000 RPS during cache rebuild
- Cache quickly rebuilds (hit ratio recovers within seconds)
- 2 app servers provide redundancy

**During cache flush:**
- Initially: 100% cache misses → 1000 RPS to DB
- After 5s: Cache ~50% rebuilt → 500 RPS to DB
- After 15s: Cache ~90% rebuilt → back to normal (100 RPS to DB)

**Key insight:**
- Over-provision DB read capacity for cache failure scenarios
- Replication provides additional read capacity
- Cost slightly higher but handles failures gracefully`,
      },
    },
    {
      name: 'Write Spike (10x)',
      type: 'scalability',
      requirement: 'NFR-S2',
      description: 'A marketing campaign causes 10x increase in URL creation requests. System must handle 1000 writes/sec while maintaining 1000 reads/sec without data loss or significant latency.',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRps: 1000,
        writeRps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.05,
      },
    },
    {
      name: 'Database Failure',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'The primary database crashes at second 20. System must failover to replica within 5 seconds and continue serving requests with minimal errors.',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRps: 1000,
        writeRps: 100,
      },
      duration: 60,
      failureInjection: {
        type: 'db_crash',
        atSecond: 20,
      },
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.1,
        minAvailability: 0.95,
      },
    },
    {
      name: 'Cost Optimization',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Reduce monthly infrastructure costs to under $300 while maintaining 500 RPS (450 reads, 50 writes) and 99% availability.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRps: 450,
        writeRps: 50,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.01,
        maxMonthlyCost: 300,
        minAvailability: 0.99,
      },
    },
    {
      name: 'Peak Hour Load',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'During peak hours (9am-5pm), traffic increases to 2000 reads/sec and 200 writes/sec. System must maintain low latency and stay within budget.',
      traffic: {
        type: 'mixed',
        rps: 2200,
        readRps: 2000,
        writeRps: 200,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 600,
      },
    },
    {
      name: 'Network Partition',
      type: 'reliability',
      requirement: 'NFR-R3',
      description: 'A network partition isolates half the app servers from the database at second 25. System must detect the partition and route traffic to healthy servers.',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRps: 1000,
        writeRps: 100,
      },
      duration: 60,
      failureInjection: {
        type: 'network_partition',
        atSecond: 25,
      },
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.05,
        minAvailability: 0.98,
      },
    },
    {
      name: 'Sustained High Load',
      type: 'scalability',
      requirement: 'NFR-S3',
      description: 'System experiences sustained high traffic of 3000 reads/sec and 300 writes/sec for 5 minutes without degradation or crashes.',
      traffic: {
        type: 'mixed',
        rps: 3300,
        readRps: 3000,
        writeRps: 300,
      },
      duration: 300,
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.02,
        minAvailability: 0.995,
      },
    },
  ],

  learningObjectives: [
    'Understand read-heavy vs write-heavy workloads',
    'Design caching strategies for high-read workloads',
    'Learn about cache hit ratios and their impact',
    'Practice capacity planning for databases',
    'Balance cost vs performance tradeoffs',
  ],

  hints: [
    {
      trigger: 'test_failed:App Server Restart - URL Mappings Lost',
      message: `💡 All your short URLs broke after app server restart!

**What happened:**
- You're using in-memory storage (context['url_mappings'])
- When app server restarts, memory is cleared
- ALL URL mappings are lost permanently!

**Why this is CRITICAL for URL shorteners:**
- Users expect short URLs to work FOREVER
- Losing mappings = breaking user trust
- Imagine if bit.ly links stopped working after a restart!

**Solution:**
Add a Database component and connect it to app_server.
This ensures URL mappings persist across restarts, crashes, and deployments.

**Progressive path:**
1. Start with in-memory (for learning)
2. Add Database (for persistence)
3. Add Cache (for performance)
4. Scale with more instances as needed`,
    },
    {
      trigger: 'test_failed:Read Spike',
      message: `💡 Your database is saturated during the traffic spike.

This is common in read-heavy systems. Consider:
1. Adding a cache (Redis) to absorb read traffic
2. Increasing cache hit ratio (larger cache, longer TTL)
3. Sizing database to handle cache miss scenarios

For Tiny URL, most URLs are accessed multiple times, so caching is very effective!`,
    },
    {
      trigger: 'cost_exceeded',
      message: `💡 Your design exceeds the budget.

Ways to reduce cost:
1. Reduce app server instances if over-provisioned
2. Optimize cache size (4GB is usually enough)
3. Let cache absorb most reads to reduce DB costs

Remember: Meet requirements at minimum cost!`,
    },
    {
      trigger: 'component_added:cdn',
      message: `⚠️ CDN is likely **overkill** for TinyURL!

**Why CDN doesn't help here:**
- TinyURL responses are DYNAMIC (database lookups, not static files)
- Each short code redirects to a different URL (can't cache the redirect response)
- CDN is for static content (images, CSS, videos)

**When CDN would help TinyURL:**
- Serving the homepage HTML/CSS/JavaScript
- Analytics dashboard with charts/images
- But NOT for the redirect logic itself

**Better approach:**
- Use Redis to cache URL mappings (short code → long URL)
- Keep app servers close to database (low latency)
- CDN costs $20-50/month but provides no benefit

**Test it yourself:**
- Try WITHOUT CDN: Should meet all requirements
- Add CDN: Cost increases, latency unchanged
- This teaches when NOT to use CDN!

**Exception:** If serving a landing page with analytics/ads before redirect, then CDN helps for the page assets.`,
    },
  ],

  // Code challenges for hands-on implementation practice
  codeChallenges: tinyUrlCodeChallenges,

  // Python template for app server implementation
  pythonTemplate: `# TinyURL App Server
# Implement URL shortening and redirect functionality

def shorten(long_url: str, context: dict) -> str:
    """
    Generate a short code for a long URL and store the mapping.

    Args:
        long_url: The URL to shorten (e.g., 'https://example.com/very/long/url')
        context: Shared context for storing data in memory

    Returns:
        short_code: Generated short code (e.g., 'abc123')

    Requirements:
    - Generate unique short codes
    - Store mapping in memory (context['url_mappings'])
    - Use counter-based approach with base62 encoding

    Example:
        shorten('https://google.com', context) -> 'a'
        shorten('https://facebook.com', context) -> 'b'
    """
    # Initialize storage if first request
    if 'url_mappings' not in context:
        context['url_mappings'] = {}
    if 'next_id' not in context:
        context['next_id'] = 0

    # Your code here: Generate short code and store mapping

    return ''


def redirect(short_code: str, context: dict) -> str:
    """
    Get the original URL from a short code.

    Args:
        short_code: The short code to expand
        context: Shared context containing stored mappings

    Returns:
        long_url: The original URL, or None if not found

    Requirements:
    - Look up short code in stored mappings
    - Return original URL if found
    - Return None if short code doesn't exist

    Example:
        redirect('a', context) -> 'https://google.com'
        redirect('xyz', context) -> None
    """
    # Initialize storage if needed
    if 'url_mappings' not in context:
        context['url_mappings'] = {}

    # Your code here: Look up and return the URL

    return None


def base62_encode(num: int) -> str:
    """
    Convert a number to base62 string (helper function).

    Args:
        num: Integer to encode

    Returns:
        Base62 encoded string using [a-zA-Z0-9]

    Example:
        base62_encode(0) -> 'a'
        base62_encode(10) -> 'k'
        base62_encode(61) -> '9'
        base62_encode(62) -> 'ba'
    """
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    # Your code here: Convert number to base62

    return ''


# App Server Handler
def handle_request(request: dict, context: dict) -> dict:
    """
    Handle incoming HTTP requests for URL shortening service.

    Args:
        request: {
            'method': 'GET' | 'POST',
            'path': '/:code' | '/shorten',
            'body': {'url': 'https://...'}
        }
        context: Shared context (in-memory storage)

    Returns:
        {
            'status': 200 | 404 | 400,
            'body': {...}
        }
    """
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # POST /shorten - Create short URL
    if method == 'POST' and path == '/shorten':
        long_url = body.get('url', '')
        if not long_url:
            return {'status': 400, 'body': {'error': 'URL required'}}

        short_code = shorten(long_url, context)
        return {
            'status': 201,
            'body': {
                'short_code': short_code,
                'short_url': f'https://tiny.url/{short_code}',
                'long_url': long_url
            }
        }

    # GET /:code - Redirect to original URL
    elif method == 'GET' and path.startswith('/'):
        short_code = path[1:]  # Remove leading '/'
        long_url = redirect(short_code, context)

        if long_url:
            return {
                'status': 302,
                'headers': {'Location': long_url},
                'body': {'redirect_to': long_url}
            }
        return {'status': 404, 'body': {'error': 'Short URL not found'}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,

  // Complete solution that passes ALL test cases
  solution: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 10 } },
      { type: 'cache', config: { memorySizeGB: 64 } },
      { type: 'database', config: { readCapacity: 20000, writeCapacity: 5000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
    explanation: `# Complete Solution for Tiny URL Shortener

## Architecture Components
- **client**: End users making requests
- **load_balancer**: Distributes traffic across app servers
- **app_server** (10 instances): Handles business logic, generates short codes
- **redis** (64GB): Caches URL mappings for fast redirects
- **postgresql** (20k read, 5k write capacity): Persistent storage with replication

## Data Flow
1. Client → Load Balancer: User sends request
2. Load Balancer → App Server: Routes to available server
3. App Server → Redis: Check cache first (90%+ hit rate)
4. App Server → PostgreSQL: On cache miss or for writes

## Why This Works
This architecture handles:
- **Normal traffic**: 1,000 RPS reads, 100 RPS writes
- **Peak traffic**: 2,200+ RPS (2000 reads, 200 writes)
- **10x write spikes**: 1,000 writes/sec during campaigns
- **Cache failures**: DB has capacity to handle full load
- **DB failures**: Replication for failover

## Key Design Decisions
1. **10 app server instances** provide horizontal scaling and redundancy
2. **Large Redis cache (64GB)** stores millions of URL mappings
3. **High DB capacity** handles traffic when cache fails
4. **Load balancer** ensures even distribution and health checks
5. **No single point of failure** - all components can scale or failover`,
  },
};
