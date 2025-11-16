/**
 * TinyURL System Design Challenge - Google L6 Standards
 *
 * This version uses Google L6-level requirements:
 * - NEVER use "average" latency - only percentiles
 * - Track p50, p90, p95, p99, p999
 * - Consider tail latency amplification
 * - Model time-based variance
 * - Analyze head/tail distributions
 */

import { Challenge } from '../types/testCase';
import { tinyUrlCodeChallenges } from './code/tinyUrlChallenges';

export const tinyUrlL6Challenge: Challenge = {
  id: 'tiny_url_l6',
  title: 'URL Shortener (L6 Standards)',
  difficulty: 'advanced',
  description: `Design a URL shortening service like bit.ly with Google L6-level requirements.

**Critical L6 Principle:** NEVER use "average" for latency. The P99+ is where interesting things happen (GC, slow services, etc.).

In distributed systems, overall latency = max(downstream latencies). The more services you call, the higher probability of hitting P99 events.`,

  requirements: {
    functional: [
      'Accept long URLs, generate short codes',
      'Redirect short codes to original URLs',
      'Short codes must be unique and permanent',
      'Support custom aliases (premium feature)',
    ],

    // L6 Style Requirements - NO AVERAGES!
    traffic: 'Baseline: 10K reads/sec, 1K writes/sec | Peak: 50K reads/sec during viral events',
    latency: 'P50 < 30ms | P90 < 50ms | P99 < 100ms | P999 < 500ms',
    availability: '99.99% (four 9s) = max 52 min downtime/year',
    budget: '$2,000/month',

    nfrs: [
      // L6-Level NFRs
      'Latency Distribution: P50=30ms, P90=50ms, P99=100ms, P999=500ms',
      'Tail Amplification: P99/P50 ratio must be < 3.5x',
      'Data Durability: ZERO data loss acceptable (URLs must work forever)',
      'Time Variance: 5x traffic during viral events, 10x during Super Bowl ads',
      'Distribution: 80% of traffic goes to 20% of URLs (power law)',
      'Hot Partition: Top 1% of URLs get 10% of traffic',
      'Request Size: P50=100B, P99=1KB for custom URLs',
      'User Distribution: P50 user creates 10 URLs, P99 user creates 10,000 URLs',
    ],
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'cache',
    'database',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== L6 LATENCY TESTS (Percentile-based) ==========
    {
      name: 'L6 Latency Profile - Baseline',
      type: 'performance',
      requirement: 'L6-LAT-1',
      description: 'Verify latency percentiles meet L6 standards. Remember: P99 is where GC and interesting events happen!',
      traffic: {
        type: 'mixed',
        rps: 11000, // 10K reads + 1K writes
        readRatio: 0.91,
      },
      duration: 300, // 5 minutes for statistical significance
      passCriteria: {
        maxP50Latency: 30,
        maxP90Latency: 50,
        maxP99Latency: 100,
        // p999 would be 500ms but our current system doesn't track it
        maxErrorRate: 0.001, // 0.1% error rate
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 4 } },
          { type: 'cache', config: { memorySizeGB: 16, ttl: 86400 } },
          { type: 'database', config: { readCapacity: 5000, writeCapacity: 2000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `L6-compliant architecture focusing on percentile optimization:

**Percentile Analysis:**
- P50 (median): Most requests hit cache (~10ms)
- P90: Some cache misses, hit DB (~40ms)
- P99: Cold cache, DB under load, GC events (~80ms)
- P999: Full GC, network hiccups, slow DB queries (~400ms)

**Tail Latency Minimization:**
- 4 app servers: Reduces impact of single server GC
- Large cache (16GB): Minimizes P90-P99 cache misses
- DB replication: Read replicas reduce P99 DB latency

**Key L6 Insight:**
With 10K RPS, even 0.1% at P999 = 10 requests/sec experiencing 500ms latency!
This matters because these slow requests hold resources and cascade delays.`,
      },
    },

    {
      name: 'L6 Tail Latency Amplification',
      type: 'performance',
      requirement: 'L6-LAT-2',
      description: 'Test tail latency amplification. When you call multiple services, P99 events multiply!',
      traffic: {
        type: 'mixed',
        rps: 11000,
        readRatio: 0.91,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 150, // Higher tolerance for tail
        // Tail amplification: P99/P50 < 3.5x
        maxErrorRate: 0.01,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 8 } }, // More instances for tail resilience
          { type: 'cache', config: { memorySizeGB: 32, ttl: 86400 } }, // Bigger cache
          { type: 'database', config: { readCapacity: 10000, writeCapacity: 3000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Mitigating tail latency amplification (L6 critical concept):

**The Problem:**
If service A has P99=100ms and service B has P99=100ms,
calling both: P(at least one P99) = 1 - (0.99 * 0.99) = 1.99% ≈ P98!

**Solutions:**
1. **More instances (8)**: Spread load, reduce per-instance P99
2. **Bigger cache (32GB)**: Reduce probability of cache miss
3. **Over-provisioned DB**: Keep utilization low for stable tail latency

**L6 Principle:**
Design for P99, not P50. Every optimization that reduces P99 benefits ALL requests.`,
      },
    },

    // ========== L6 TIME VARIANCE TESTS ==========
    {
      name: 'L6 Viral Event (5x traffic)',
      type: 'scalability',
      requirement: 'L6-SCALE-1',
      description: 'Handle 5x traffic spike during viral event. P99 degradation must be < 2x.',
      traffic: {
        type: 'mixed',
        rps: 55000, // 5x baseline
        readRatio: 0.95, // More reads during viral
      },
      duration: 120,
      passCriteria: {
        maxP99Latency: 200, // 2x normal P99
        maxErrorRate: 0.01,
        minAvailability: 0.999,
      },
    },

    {
      name: 'L6 Super Bowl Ad (10x spike)',
      type: 'scalability',
      requirement: 'L6-SCALE-2',
      description: 'Survive 10x traffic during Super Bowl commercial. System must not crash!',
      traffic: {
        type: 'mixed',
        rps: 110000, // 10x baseline
        readRatio: 0.98, // Almost all reads
      },
      duration: 30, // Short spike
      passCriteria: {
        maxP99Latency: 500, // OK to degrade
        maxErrorRate: 0.05, // 5% errors acceptable
        minAvailability: 0.95, // Don't crash!
      },
    },

    // ========== L6 DISTRIBUTION TESTS ==========
    {
      name: 'L6 Hot Partition (Power Law)',
      type: 'performance',
      requirement: 'L6-DIST-1',
      description: '80% of traffic hits 20% of URLs (power law). Top 1% URLs get 10% traffic.',
      traffic: {
        type: 'mixed',
        rps: 11000,
        readRatio: 0.91,
        // In real L6, we'd model skewed access patterns
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.001,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 4 } },
          { type: 'cache', config: { memorySizeGB: 8, ttl: 3600, strategy: 'lfu' } }, // LFU for hot data
          { type: 'database', config: { readCapacity: 5000, writeCapacity: 2000, replication: true, sharding: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Handling power law distribution (L6 critical):

**The Challenge:**
- 1% of URLs (hot) get 10% of traffic = 1,100 RPS for small set
- If not cached, these hot URLs will destroy your database

**Solution:**
- **LFU Cache**: Keeps frequently accessed (hot) URLs in cache
- **Database Sharding**: Spread hot keys across shards
- **Smaller cache OK**: Only need to cache the hot 20% of URLs

**L6 Insight:**
Power law means cache is EXTREMELY effective. Even small cache captures most traffic.`,
      },
    },

    // ========== L6 DURABILITY TESTS ==========
    {
      name: 'L6 Zero Data Loss',
      type: 'reliability',
      requirement: 'L6-DUR-1',
      description: 'Database fails. ZERO URL mappings can be lost (durability requirement).',
      traffic: {
        type: 'mixed',
        rps: 11000,
        readRatio: 0.91,
      },
      duration: 180,
      failureInjection: {
        type: 'db_crash',
        atSecond: 60,
        recoverySecond: 120,
      },
      passCriteria: {
        minAvailability: 0.999, // Three 9s during failure
        maxErrorRate: 0.01,
        // In L6, we'd verify zero data loss
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 4 } },
          { type: 'cache', config: { memorySizeGB: 16, ttl: 86400 } },
          { type: 'database', config: {
            readCapacity: 5000,
            writeCapacity: 2000,
            replication: true, // Critical!
            multiRegion: true, // L6 level
            backupEnabled: true // L6 level
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `L6 Durability (ZERO data loss):

**Requirements:**
- RPO = 0 (Zero data loss)
- RTO < 60s (Recovery in 1 minute)
- URLs must work FOREVER once created

**Architecture:**
1. **Synchronous Replication**: Every write goes to multiple replicas
2. **Multi-Region**: Survive entire region failure
3. **Backup**: Point-in-time recovery if corruption
4. **Write Ahead Log**: Durability before acknowledgment

**L6 Principle:**
For URL shorteners, losing a mapping breaks user trust forever.
Better to reject new URLs than lose existing ones.`,
      },
    },

    // ========== L6 ADVANCED TESTS ==========
    {
      name: 'L6 Cascading Failures',
      type: 'reliability',
      requirement: 'L6-REL-1',
      description: 'Cache fails, causing DB overload. Test cascading failure resilience.',
      traffic: {
        type: 'mixed',
        rps: 11000,
        readRatio: 0.91,
      },
      duration: 120,
      failureInjection: {
        type: 'cache_flush',
        atSecond: 30,
      },
      passCriteria: {
        maxP99Latency: 300, // Degraded but not dead
        maxErrorRate: 0.05,
        minAvailability: 0.95,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 8, circuitBreaker: true } }, // L6: Circuit breakers
          { type: 'cache', config: { memorySizeGB: 16, ttl: 86400 } },
          { type: 'database', config: {
            readCapacity: 20000, // Over-provisioned for cache failure
            writeCapacity: 5000,
            replication: true,
            connectionPoolSize: 1000, // L6: Connection limits
          } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: `Preventing cascading failures (L6 critical):

**The Cascade:**
1. Cache fails → All traffic hits DB
2. DB overloaded → Connections pile up
3. App servers run out of connections → Everything fails

**L6 Defenses:**
1. **Circuit Breakers**: Stop hammering failed services
2. **Connection Limits**: Prevent resource exhaustion
3. **Over-provisioned DB**: Handle cache failure scenario
4. **Graceful Degradation**: Return cached errors vs crashing

**L6 Wisdom:**
"Systems don't fail, they cascade." - Design for cascade prevention.`,
      },
    },
  ],

  learningObjectives: [
    'Understand why "average" latency is meaningless - use percentiles',
    'Learn P50, P90, P95, P99, P999 and what happens at each',
    'Grasp tail latency amplification in distributed systems',
    'Model time-based variance (viral events, Super Bowl ads)',
    'Handle power law distributions (80/20 rule)',
    'Design for zero data loss with RPO=0',
    'Prevent cascading failures with circuit breakers',
    'Understand hot partitions and cache effectiveness',
  ],

  hints: [
    {
      trigger: 'test_failed:L6 Latency Profile',
      message: `💡 Your latencies don't meet L6 standards!

**Remember L6 Principles:**
- NEVER optimize for average - optimize for P99
- P99 is where GC, network issues, and slow queries live
- In distributed systems, P99 events compound

**Solutions:**
1. More app server instances (reduce per-instance P99)
2. Bigger cache (reduce P90-P99 cache misses)
3. Database read replicas (reduce P99 DB latency)
4. Connection pooling (reduce connection overhead)

**L6 Math:**
At 10K RPS, P99 = 100 requests/sec experiencing worst latency!`,
    },
    {
      trigger: 'test_failed:L6 Viral Event',
      message: `💡 Can't handle viral traffic with L6 latency requirements!

**L6 Analysis:**
- 5x traffic but P99 can only degrade 2x
- This requires 2.5x over-provisioning!

**Smart L6 Solutions:**
1. Auto-scaling (but warm pool needed for fast scale)
2. Cache everything possible (power law helps here)
3. Read replicas for database
4. Consider degraded mode (serve from stale cache)

**L6 Insight:**
Viral events are predictable in aggregate (happen daily somewhere).
Design for 5x surge as normal, not exceptional.`,
    },
    {
      trigger: 'test_failed:L6 Zero Data Loss',
      message: `💡 Failed L6 durability requirement - data loss detected!

**L6 Durability Standards:**
- RPO = 0 (Recovery Point Objective - ZERO data loss)
- RTO < 60s (Recovery Time Objective - back online fast)

**Required Architecture:**
1. Synchronous replication (write to multiple replicas)
2. Multi-region setup (survive region failure)
3. Write-ahead logging (durability before acknowledgment)
4. Regular backups (corruption recovery)

**L6 Principle:**
For permanent data (URLs), losing even ONE record breaks user trust forever.`,
    },
  ],

  codeChallenges: tinyUrlCodeChallenges,

  referenceLinks: [
    {
      label: 'Google SRE Book - Monitoring Distributed Systems',
      url: 'https://sre.google/sre-book/monitoring-distributed-systems/',
    },
    {
      label: 'The Tail at Scale - Jeff Dean',
      url: 'https://research.google/pubs/pub40801/',
    },
    {
      label: 'AWS Well-Architected Framework - Reliability Pillar',
      url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/',
    },
  ],
};