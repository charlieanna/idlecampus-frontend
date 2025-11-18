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
    budget: '$2,000/month', // Realistic budget for handling all NFR tests including write spikes requiring sharding
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
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: false, replicas: 0, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
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
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: false, replicas: 0, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
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
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } }, // 1100 RPS / 1000 RPS per instance = 1.1 → need 2 instances
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: false, replicas: 0, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `This solution handles 1100 RPS (1000 reads, 100 writes) efficiently:

**Architecture:**
- Load Balancer distributes traffic across app servers
- 2 App Server instances handle the load (1100 RPS / 1000 RPS per instance = 1.1 → need 2)
- Redis cache (90% hit ratio) absorbs most read traffic
- PostgreSQL handles cache misses and all writes

**Why it works:**
- Cache absorbs 90% of reads (900 RPS) → only 100 read requests hit DB
- DB handles 100 cache misses + 100 writes = 200 RPS total (well within 1000 RPS capacity)
- Low latency (~50-80ms p99) due to cache hits
- Cost ~$366/month (within $500 budget)

**Key settings:**
- App Server: 2 commodity instances (1000 RPS each)
- Redis: 4GB memory, 90% hit ratio, 1-hour TTL, cache-aside strategy
- PostgreSQL: Commodity spec (1000 read, 100 write RPS base)`,
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
          { type: 'app_server', config: { instances: 6 } }, // 5100 RPS / 1000 RPS per instance = 5.1 → need 6 instances
          { type: 'cache', config: { memorySizeGB: 8, ttl: 3600, hitRatio: 0.95, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: true, replicas: 2, mode: 'async' }, // 2 read replicas for scaling
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `This solution handles a 5x traffic spike (5100 RPS):

**Scaled Architecture:**
- 6 App Server instances (5100 RPS / 1000 RPS per instance = 5.1 → need 6)
- Larger Redis cache (8GB, 95% hit ratio) to absorb spike
- Database with 2 read replicas (single-leader mode)

**Traffic Flow:**
- 5000 RPS reads: Cache absorbs 95% (4750 RPS) → 250 RPS hit DB
- 100 RPS writes → all go to DB leader
- Total DB load: 250 reads + 100 writes = 350 RPS
- With 2 read replicas: 3000 read capacity (1000 × 3), 100 write capacity

**Why it works:**
- Higher cache hit ratio (95% vs 90%) critical during spikes
- 6 app server instances provide headroom (850 RPS/instance = 85% util)
- Read replicas scale read capacity 3x for cache misses
- Single-leader replication: strong writes, eventual reads
- p99 latency ~150-180ms (within 200ms target)

**Cost consideration:**
- 6 app servers ($660) + cache ($400) + DB with 2 replicas ($438) = ~$1,498/month
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
          { type: 'app_server', config: { instances: 2 } }, // 1100 RPS / 1000 RPS per instance = 1.1 → need 2 instances
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: true, replicas: 1, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
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
        maxP99Latency: 500, // Higher latency acceptable for write spike with multi-leader + sharding
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } }, // 2000 RPS / 1000 RPS per instance = 2 → need 5 for headroom
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'multi-leader', // Multi-leader for write scaling
            replication: { enabled: true, replicas: 2, mode: 'async' }, // 2 additional leaders = 3 leaders total
            sharding: { enabled: true, shards: 4, shardKey: 'short_code' }, // 4 shards × 300 write RPS = 1200 write RPS capacity
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `This solution handles a 10x write spike (2000 RPS total: 1000 reads, 1000 writes):

**Scaled Architecture:**
- 5 App Server instances (2000 RPS / 1000 = 2 → need 5 for headroom)
- Redis cache (90% hit ratio) for reads
- Multi-leader replication (3 leaders) + 4 shards for write scaling

**Traffic Flow:**
- 1000 RPS reads: Cache absorbs 90% (900 RPS) → 100 RPS hit DB
- 1000 RPS writes → distributed across 4 shards × 3 leaders = 1200 write RPS capacity
- Total DB capacity: 12000 read RPS (3000 × 4 shards), 1200 write RPS (300 × 4 shards)

**Why it works:**
- App servers handle 2000 RPS with headroom (~400 RPS/instance = 40% util)
- Multi-leader + sharding scales write capacity: 4 shards × 300 write RPS = 1200 write RPS > 1000 writes
- Cache reduces read load on database
- Trade-off: Multi-leader conflict resolution + sharding routing + queue latency at 83% utilization = ~400-500ms p99 latency
- Acceptable for write-heavy workloads where capacity is prioritized over latency

**Cost consideration:**
- 3 app servers ($330) + cache ($400) + DB with 2 extra leaders ($438) = ~$1,168/month`,
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
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } }, // 1100 RPS / 1000 RPS per instance = 1.1 → need 2
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: true, replicas: 1, mode: 'async' }, // Replication required for failover
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `This solution handles database failure with replication:

**Architecture:**
- 3 App Server instances handle 1100 RPS
- Redis cache (90% hit ratio) reduces database load
- Database with replication enabled for failover

**Failure Handling:**
- At second 20, primary database crashes
- Replica automatically takes over within 5 seconds
- System continues serving with minimal errors (10% max)
- Availability maintained at 95%+ during failover

**Why replication is critical:**
- Without replication: 100% error rate during crash ❌
- With replication: Automatic failover, <10% errors ✅`,
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

    // ========== CACHE STRATEGY TESTS ==========
    {
      name: 'Cache-Aside Strategy',
      type: 'caching',
      requirement: 'CACHE-1',
      description: 'Test cache-aside (lazy loading) strategy. Cache is populated on read misses. Verify that writes are visible after cache TTL expires.',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRps: 900,
        writeRps: 100,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: false, replicas: 0, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Cache-aside strategy: App checks cache first, loads from DB on miss, then populates cache.`,
      },
    },
    {
      name: 'Write-Through Strategy',
      type: 'caching',
      requirement: 'CACHE-2',
      description: 'Test write-through strategy. Writes go to both cache and database simultaneously. Ensures strong consistency but slower writes.',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRps: 900,
        writeRps: 100,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 150, // Higher due to synchronous writes
        maxErrorRate: 0.01,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'write_through' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: false, replicas: 0, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Write-through: Writes go to cache + DB simultaneously. Strong consistency, but +50ms write latency.`,
      },
    },
    {
      name: 'Cache Stampede',
      type: 'caching',
      requirement: 'CACHE-3',
      description: 'Hot key expires and 1000 concurrent requests try to reload it, causing database overload (thundering herd problem).',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.1, // Some errors expected during stampede
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: true, replicas: 2, mode: 'async' }, // Extra capacity for stampede
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Mitigate stampede with read replicas. In production, use locking or probabilistic early expiration.`,
      },
    },

    // ========== REPLICATION MODE TESTS ==========
    {
      name: 'Single-Leader Replication',
      type: 'consistency',
      requirement: 'REP-1',
      description: 'Test single-leader replication. Reads from replicas may be slightly stale (eventual consistency). Writes are strongly consistent.',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRps: 1800,
        writeRps: 200,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: true, replicas: 2, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Single-leader with 2 async replicas. Reads scale 3x (3000 RPS), writes to leader only (100 RPS).`,
      },
    },
    {
      name: 'Multi-Leader Replication',
      type: 'consistency',
      requirement: 'REP-2',
      description: 'Test multi-leader replication. Both reads and writes scale, but conflict resolution adds 20-50ms latency. May have write conflicts.',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRps: 1000,
        writeRps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 500, // Higher due to conflict resolution + queue latency at high utilization
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'multi-leader',
            replication: { enabled: true, replicas: 2, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Multi-leader with 3 leaders total. Write capacity scales 3x (300 RPS), but adds latency for conflict resolution.`,
      },
    },
    {
      name: 'Leaderless (Quorum) Replication',
      type: 'consistency',
      requirement: 'REP-3',
      description: 'Test leaderless quorum-based replication (Cassandra-style). Tunable consistency (R+W>N). Handles network partitions well but has 30% overhead.',
      traffic: {
        type: 'mixed',
        rps: 1500,
        readRps: 1200,
        writeRps: 300,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.02,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'cache', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'leaderless',
            replication: { enabled: true, replicas: 2, mode: 'async' },
            sharding: { enabled: false, shards: 1, shardKey: '' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Leaderless with quorum (R=2, W=2, N=3). Capacity: 2100 read RPS, 210 write RPS (with 30% overhead).`,
      },
    },

    // ========== SHARDING TESTS ==========
    {
      name: 'Horizontal Sharding',
      type: 'scalability',
      requirement: 'SHARD-1',
      description: 'Test horizontal sharding for massive scale. Data is partitioned across 4 shards by user_id. Capacity scales 4x.',
      traffic: {
        type: 'mixed',
        rps: 4000,
        readRps: 3600,
        writeRps: 400,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.02,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'cache', config: { memorySizeGB: 8, ttl: 3600, hitRatio: 0.9, strategy: 'cache_aside' } },
          { type: 'database', config: { 
            instanceType: 'commodity-db',
            replicationMode: 'single-leader',
            replication: { enabled: false, replicas: 0, mode: 'async' },
            sharding: { enabled: true, shards: 4, shardKey: 'user_id' },
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `4 shards scale capacity 4x: 4000 read RPS, 400 write RPS. Shard by user_id for even distribution.`,
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
        short_code: Generated short code (e.g., 'abc123'), or None if input is invalid

    Requirements:
    - Generate unique short codes
    - Store mapping in memory (context['url_mappings'])
    - Use counter-based approach with base62 encoding
    - Return same code for duplicate URLs
    - Return None for empty/invalid input

    Example:
        shorten('https://google.com', context) -> 'a'
        shorten('https://facebook.com', context) -> 'b'
        shorten('https://google.com', context) -> 'a'  # Same URL returns same code
        shorten('', context) -> None  # Invalid input
    """
    # Validate input
    if not long_url or not isinstance(long_url, str) or len(long_url.strip()) == 0:
        return None

    # Initialize storage if first request
    if 'url_mappings' not in context:
        context['url_mappings'] = {}
    if 'reverse_mappings' not in context:
        context['reverse_mappings'] = {}  # URL -> code mapping for duplicate detection
    if 'next_id' not in context:
        context['next_id'] = 0

    # Check if URL already exists (duplicate handling)
    if long_url in context['reverse_mappings']:
        return context['reverse_mappings'][long_url]

    # Get next ID and increment counter
    id = context['next_id']
    context['next_id'] = id + 1

    # Convert ID to short code using base62 encoding
    code = base62_encode(id)

    # Store mapping in memory (both directions)
    context['url_mappings'][code] = long_url
    context['reverse_mappings'][long_url] = code

    return code


def redirect(short_code: str, context: dict) -> str:
    """
    Get the original URL from a short code.

    Args:
        short_code: The short code to expand
        context: Shared context containing stored mappings

    Returns:
        long_url: The original URL, or None if not found or invalid input

    Requirements:
    - Look up short code in stored mappings
    - Return original URL if found
    - Return None if short code doesn't exist or is empty/invalid

    Example:
        redirect('a', context) -> 'https://google.com'
        redirect('xyz', context) -> None
        redirect('', context) -> None  # Invalid input
    """
    # Validate input
    if not short_code or not isinstance(short_code, str) or len(short_code.strip()) == 0:
        return None

    # Initialize storage if needed
    if 'url_mappings' not in context:
        context['url_mappings'] = {}

    # Simple lookup from in-memory dictionary
    return context['url_mappings'].get(short_code)


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
    
    if num == 0:
        return charset[0]
    
    result = ''
    while num > 0:
        result = charset[num % 62] + result
        num //= 62
    return result


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
  // Designed to handle the most demanding scenarios:
  // - Read Spike: 5100 RPS (needs 6 app server instances)
  // - Write Spike: 2000 RPS with 1000 writes/sec (needs multi-leader replication)
  // - Database Failure: needs replication for failover
  solution: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: { algorithm: 'least_connections' } },
      { type: 'app_server', config: { instances: 6 } }, // Sized for Read Spike (5100 RPS)
      { type: 'cache', config: { memorySizeGB: 6, ttl: 3600, hitRatio: 0.95, strategy: 'cache_aside' } }, // High hit ratio for Read Spike (6GB sufficient for 95% hit ratio)
      { type: 'database', config: { 
        instanceType: 'commodity-db',
        replicationMode: 'multi-leader', // Multi-leader for write scaling
        replication: { enabled: true, replicas: 2, mode: 'async' }, // 2 additional leaders = 3 leaders total
        sharding: { enabled: true, shards: 4, shardKey: 'short_code' }, // 4 shards × 300 write RPS = 1200 write RPS for Write Spike
      } },
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
- **app_server** (6 commodity instances): Handles business logic, generates short codes
  - Sized for Read Spike: 5100 RPS / 1000 RPS per instance = 5.1 → need 6
  - Each instance: 8 vCPU, 64GB RAM, 2TB SSD, 1000 RPS capacity
- **redis** (6GB, 95% hit ratio): Caches URL mappings for fast redirects
  - High hit ratio critical during read spikes
  - Cache-aside strategy for consistency
  - 6GB sufficient for 95% hit ratio while reducing cost
- **postgresql** (multi-leader replication + sharding): Persistent storage
  - 3 leaders total (1 primary + 2 replicas) × 4 shards for write scaling
  - Multi-leader mode scales writes 3x per shard (300 write RPS per shard)
  - With 4 shards: 1200 write RPS capacity (300 × 4), 12000 read RPS (3000 × 4)
  - Trade-off: +50% latency for conflict resolution, +10% for sharding routing

## Data Flow
1. Client → Load Balancer: User sends request
2. Load Balancer → App Server: Routes to available server
3. App Server → Redis: Check cache first (95% hit rate)
4. App Server → PostgreSQL: On cache miss or for writes

## Why This Works for ALL Tests
This comprehensive architecture handles:
- **Normal Load (1100 RPS)**: 6 instances provide plenty of headroom (~183 RPS/instance = 18% util)
- **Read Spike (5100 RPS)**: 6 instances handle the load (850 RPS/instance = 85% util), 95% cache hit ratio reduces DB load
- **Write Spike (2000 RPS, 1000 writes)**: Multi-leader + sharding scales write capacity to 1200 RPS (300 × 4 shards)
- **Cache Flush**: DB with 2 read replicas provides 3000 read capacity for cache misses
- **Database Failure**: Replication enables failover within 5 seconds
- **Cost Optimization**: Can scale down replicas for cost-sensitive scenarios
- **Peak Hour Load**: Handles traffic spikes gracefully
- **Network Partition**: Multi-leader handles partitions better than single-leader
- **Sustained High Load**: Architecture designed for continuous high traffic

## Key Design Decisions
1. **6 commodity app server instances** (1000 RPS each) sized for peak read traffic
2. **Optimized Redis cache (6GB, 95% hit ratio)** balances cost and effectiveness
3. **Multi-leader replication + sharding** scales both reads (12000 RPS) and writes (1200 RPS)
4. **Trade-off**: Multi-leader adds 20-50ms latency but handles write spikes
5. **Load balancer with least-connections** ensures even distribution
6. **No single point of failure** - all components can scale or failover

**Note**: This solution is optimized to pass all tests (including write spikes requiring sharding) but is over-provisioned for normal load. 

**Cost Consideration**: 
- Normal Load test has $500/month budget constraint
- This solution costs ~$2,700/month (due to 4 shards needed for write spike)
- For cost-constrained tests, use the test-case-specific solution which is optimized for that scenario
- In production, you'd use auto-scaling to adjust instances based on actual load`,
  },
};
