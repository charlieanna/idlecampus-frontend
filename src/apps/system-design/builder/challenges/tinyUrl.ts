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

  availableComponents: ['client', 'load_balancer', 'app_server', 'redis', 'postgresql'],

  testCases: [
    {
      name: 'Normal Load',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRatio: 0.91, // 1000 reads, 100 writes
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
          { type: 'redis', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000, replication: false } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'redis', to: 'postgresql' },
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
          { type: 'redis', config: { memorySizeGB: 8, ttl: 3600, hitRatio: 0.95 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'redis', to: 'postgresql' },
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
          { type: 'redis', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'redis', to: 'postgresql' },
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
  ],

  // Code challenges for hands-on implementation practice
  codeChallenges: tinyUrlCodeChallenges,
};
