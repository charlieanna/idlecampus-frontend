import { Challenge } from '../types/testCase';
import { tinyUrlCodeChallenges } from './code/tinyUrlChallenges';

/**
 * TinyURL - Progressive Learning Challenge
 *
 * Students build complexity step-by-step:
 * Level 1: Build a working system (learn basic connectivity)
 * Level 2: Handle 100 RPS (learn capacity planning)
 * Level 3: Handle 1000 RPS (learn caching strategy)
 * Level 4: Handle failures (learn high availability)
 * Level 5: Optimize cost (learn tradeoffs)
 */
export const tinyUrlChallenge: Challenge = {
  id: 'tiny_url',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  description: `Design a URL shortening service (like bit.ly) that accepts long URLs and returns short codes.

**🎮 Progressive Learning Path:**
Start by building a basic working system, then level up as you learn new concepts!

Example:
- POST /shorten with https://example.com/very/long/url → returns abc123
- GET /abc123 → redirects to https://example.com/very/long/url`,

  requirements: {
    functional: [
      'Accept long URLs, generate short codes',
      'Redirect short codes to original URLs',
      'Short codes should be unique',
    ],
    traffic: 'Progressive: Basic → 100 RPS → 1,000 RPS',
    latency: 'p99 < 100ms for redirects (later levels)',
    availability: '99.9% uptime (final level)',
    budget: '$500/month (final level)',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ═══════════════════════════════════════════════════════════════
    // LEVEL 1: Build Your First Working System
    // ═══════════════════════════════════════════════════════════════
    {
      name: '🎯 Level 1: Build Your First Working System',
      traffic: {
        type: 'mixed',
        rps: 1, // Minimal traffic - focus is on connectivity, not performance
        readRatio: 0.5,
      },
      duration: 10,
      passCriteria: {
        maxP99Latency: 5000, // VERY generous - just needs to work
        maxErrorRate: 0.9, // Almost always allows some errors - focus is connectivity
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'postgresql', config: { readCapacity: 10, writeCapacity: 10 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `🎓 Welcome to System Design!

**What you just built:**
Your first working system! Just 3 components connected correctly:

  👤 Client → 📦 App Server → 💾 Database

**How data flows:**
1. Client sends a request
2. App Server processes it
3. Database stores or retrieves the URL
4. Response flows back

**Why you need all 3:**
- Client = Users making requests
- App Server = Where your code runs (business logic)
- Database = Where data is stored permanently

**What you learned:**
✅ Every system needs compute (app server) + storage (database)
✅ Client doesn't talk directly to database (for security!)
✅ Components connect in a logical flow

**Next Level:** What happens when more people use your app? 🚀`,
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // LEVEL 2: Medium Traffic - Learn About Capacity
    // ═══════════════════════════════════════════════════════════════
    {
      name: '🎯 Level 2: Scale to 100 RPS',
      traffic: {
        type: 'mixed',
        rps: 100,
        readRatio: 0.9, // 90 reads, 10 writes (typical URL shortener)
      },
      duration: 30,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.05,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `📈 Scaling Lesson

**What changed:**
Traffic increased 100x! (1 RPS → 100 RPS)

**Why your Level 1 solution still works:**
- App server handles 1000 RPS capacity
- 100 RPS is only 10% utilization ✅
- Database configured for 100 RPS capacity

**Key Insight - Capacity Planning:**
Component capacity must exceed traffic:
- App Server: 100 RPS traffic / 1000 RPS capacity = 10% utilization ✅
- Database: 100 RPS traffic / 100 RPS capacity = 100% utilization ⚠️

If database was only 50 RPS capacity → SATURATED → Errors!

**What you learned:**
✅ Capacity != Traffic (need headroom!)
✅ Database queries are slower than app logic
✅ Read-heavy workload (90% reads, 10% writes)

**Next Level:** What if traffic 10x again? Database will saturate! 🔥`,
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // LEVEL 3: High Traffic - MUST Learn Caching
    // ═══════════════════════════════════════════════════════════════
    {
      name: '🎯 Level 3: Scale to 1,000 RPS (Introduce Caching!)',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRatio: 0.9, // 900 reads, 100 writes
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 600, // Generous budget for learning
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'redis', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 200 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'redis', to: 'postgresql' },
        ],
        explanation: `⚡ Caching is a Game-Changer!

**The Problem:**
Without cache:
- 900 reads → PostgreSQL
- 100 writes → PostgreSQL
- Total: 1000 RPS hitting database
- Database capacity: 200 RPS
- Result: SATURATED! 80% errors! ❌

**The Solution: Redis Cache**
With 90% cache hit ratio:
- 900 reads → 810 from Redis (90% hit), 90 from DB (10% miss)
- 100 writes → PostgreSQL
- Total DB load: 90 + 100 = 190 RPS ✅

**Why It Works:**
┌─────────────────────────────────────┐
│ 1000 RPS → App Server                │
│   ↓                                  │
│ 1000 RPS → Redis Cache               │
│   ├─ 810 RPS (81%) → Cache Hit (5ms)│
│   └─ 90 RPS (9%) → PostgreSQL        │
│       ↓                              │
│     190 RPS → PostgreSQL             │
│       ├─ 90 reads (cache misses)     │
│       └─ 100 writes (all writes)     │
└─────────────────────────────────────┘

**Math Breakdown:**
- Database load REDUCED by 80%! (1000 → 190)
- Latency IMPROVED by 4x (20ms → 5ms)
- Database cost REDUCED (need less capacity)

**What you learned:**
✅ Cache = in-memory storage (super fast: 5ms vs 20ms)
✅ Cache hit ratio is CRITICAL (90% = 10x load reduction)
✅ Perfect for read-heavy workloads
✅ URLs don't change → high cache hit ratio

**Key Interview Insight:**
"I added Redis because at 1000 RPS with 90% reads, caching
reduces database load from 1000 to 190 RPS - a 5x reduction!"

**Next Level:** What if a server crashes? System goes down! 💥`,
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // LEVEL 4: High Availability - Learn Redundancy
    // ═══════════════════════════════════════════════════════════════
    {
      name: '🎯 Level 4: Survive Server Failures (99.9% Uptime)',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRatio: 0.91,
      },
      duration: 60,
      failureInjection: {
        type: 'db_crash',
        atSecond: 20,
        recoverySecond: 40,
      },
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.02,
        minAvailability: 0.999, // 99.9% = only 6 seconds downtime allowed in 100 minutes
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'redis', config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'redis', to: 'postgresql' },
        ],
        explanation: `🛡️ High Availability Design

**The Problem:**
During this test, the database CRASHES at 20 seconds!
- Without redundancy: System goes down for 20 seconds ❌
- Availability: 80% (20s down / 100s total)
- FAILS 99.9% requirement!

**The Solution: Redundancy at Every Layer**

1️⃣ **Load Balancer**
   - Distributes traffic across app servers
   - If one app server dies → traffic goes to others
   - Cost: $50/month

2️⃣ **Multiple App Servers (x2)**
   - If one crashes → Load balancer uses other
   - Can do rolling deploys (zero downtime)
   - Cost: $200/month

3️⃣ **Database Replication**
   - Primary + Replica (hot standby)
   - If primary crashes → Failover to replica
   - Downtime: ~5 seconds (failover time)
   - Cost: +$100/month

**Availability Math:**
Without replication:
- 20s downtime / 100s total = 80% availability ❌

With replication:
- 5s downtime / 100s total = 95% availability
- Over a month: 99.9%+ ✅

**Failure Simulation Results:**
┌─────────────────────────────────────┐
│ 0-20s:  Normal operation            │
│ 20s:    Database PRIMARY crashes    │
│ 20-25s: Failover to REPLICA (5s)    │
│ 25-60s: Running on REPLICA          │
│ Result: 5s downtime = 99.2% uptime  │
└─────────────────────────────────────┘

**What you learned:**
✅ Single point of failure (SPOF) = bad
✅ Redundancy costs money but provides reliability
✅ Load Balancer enables horizontal scaling
✅ Database replication = disaster recovery

**Key Interview Points:**
"For 99.9% availability, I need redundancy:
- 2 app servers behind load balancer
- Database with replication (failover in 5s)
- This allows ~40 minutes downtime per month"

**Next Level:** Optimize cost while keeping performance! 💰`,
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // LEVEL 5: Final Challenge - Cost Optimization
    // ═══════════════════════════════════════════════════════════════
    {
      name: '🎯 Level 5: FINAL - Meet All Requirements Under Budget',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRatio: 0.91, // 1000 reads, 100 writes
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 500, // STRICT budget!
        minAvailability: 0.999,
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
        explanation: `🏆 Production-Ready Design

**The Challenge:**
Meet ALL requirements with LIMITED budget:
- Performance: <100ms latency ✅
- Reliability: 99.9% uptime ✅
- Scale: 1,100 RPS ✅
- Cost: <$500/month ✅ (HARD CONSTRAINT)

**Your Optimized Solution:**
┌──────────────────┬──────────┬──────────┐
│ Component        │ Cost     │ Why?     │
├──────────────────┼──────────┼──────────┤
│ Load Balancer    │ $50      │ HA       │
│ App Server (x2)  │ $200     │ HA       │
│ Redis (4GB)      │ $200     │ Perf     │
│ PostgreSQL       │ $100     │ Storage  │
├──────────────────┼──────────┼──────────┤
│ TOTAL            │ $550     │ ⚠️ OVER! │
└──────────────────┴──────────┴──────────┘

**Cost Optimization Decisions:**

❌ Remove DB Replication (-$100)
   Trade: Availability 99.9% → 99.5%
   Why: Still meets 99.9% if app/cache handle failures

✅ Keep 2 App Servers
   Why: Needed for 99.9% (main failure point)

✅ Keep Redis 4GB
   Why: Critical for 90% hit ratio

**Final Cost: $450/month ✅**

**Risk Analysis:**
⚠️ Database is single point of failure
Mitigation:
- Redis serves 90% of reads (DB failure = 10% errors)
- Can add replication later if needed
- Acceptable tradeoff for cost savings

**Production Considerations:**
For real TinyURL at this scale:
1. Add DB replication ($100) → $550/month
2. Monitor cache hit ratio (if <80%, increase Redis)
3. Set up alerts for DB health
4. Plan for 10x growth (10K RPS):
   - Scale Redis to 8GB
   - Add DB replica
   - Possibly add app server

**What you mastered:**
✅ Component selection (why each matters)
✅ Capacity planning (RPS, latency, utilization)
✅ Caching strategies (90% hit ratio)
✅ High availability (redundancy vs cost)
✅ Cost optimization (meet requirements, minimize spend)

**Interview Confidence:**
You can now explain:
- Why Redis with 90% hit ratio saves $300/month
- How 2 app servers provide 99.9% availability
- When to sacrifice DB replication for cost
- How to scale to 10x traffic

🎉 CONGRATULATIONS! You're ready for system design interviews! 🎉`,
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // BONUS: Stress Test
    // ═══════════════════════════════════════════════════════════════
    {
      name: '💎 BONUS: Handle Viral Traffic (10x Spike)',
      traffic: {
        type: 'mixed',
        rps: 10000, // 10x normal traffic!
        readRatio: 0.95,
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
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { memorySizeGB: 8, ttl: 3600, hitRatio: 0.95 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000, replication: true } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'redis', to: 'postgresql' },
        ],
        explanation: `🚀 Viral Traffic - 10x Scale!

**The Scenario:**
Your URL goes viral on Twitter! Traffic spikes 10x:
- Normal: 1,100 RPS
- Spike: 10,000 RPS

**Your Level 5 design FAILS:**
- App servers: 2 × 1000 = 2000 RPS capacity ❌ (need 10,000)
- Redis: 90% hit = 1000 misses → DB ❌ (DB capacity: 1000 RPS)
- Errors: 70%+

**Scaled Solution:**
1️⃣ App Servers: 2 → 5 instances
   - Capacity: 5000 RPS ✅
   - Cost: $200 → $500

2️⃣ Redis: 4GB → 8GB, 90% → 95% hit ratio
   - Cache misses: 1000 → 500 (better hit ratio!)
   - Cost: $200 → $400

3️⃣ Database: Add replication, increase capacity
   - Capacity: 1000 → 2000 RPS
   - Cost: $100 → $300

**Total Cost: $1,250/month** (10x traffic = 2.5x cost!)

**Key Insights:**
✅ Horizontal scaling (add app servers)
✅ Cache hit ratio becomes more critical at scale
✅ Database becomes bottleneck (even with cache)

**Interview Gold:**
"For viral traffic, I'd use auto-scaling:
- App servers: Scale 1-10 based on load (elastic)
- Redis: Increase hit ratio (95%+) to reduce DB load
- Database: Read replicas for cache misses
- Result: Handle 10x traffic with 2-3x cost"

🏆 You're now a System Design Expert! 🏆`,
      },
    },
  ],

  learningObjectives: [
    'Start simple: Handle 1 request before scaling to 1000',
    'Understand when caching becomes necessary (not optional!)',
    'Learn high availability through redundancy',
    'Make cost vs performance tradeoffs',
    'Scale systems progressively with confidence',
  ],

  hints: [
    {
      trigger: 'test_failed:Level 1',
      message: `💡 Level 1 Hint: Keep It Simple!

You only need 3 components:
1. Client (given)
2. App Server (processes requests)
3. PostgreSQL (stores URLs)

Connect them: Client → App → Database

That's it! No cache, no load balancer needed for 1 RPS.`,
    },
    {
      trigger: 'test_failed:Level 2',
      message: `💡 Level 2 Hint: Same Components, Check Capacity!

Your Level 1 solution should still work.
But did you configure the database capacity?

Check Inspector (right sidebar):
- Database capacity must be ≥ 100 RPS
- App server can handle 1000 RPS (you're fine)

No new components needed yet!`,
    },
    {
      trigger: 'test_failed:Level 3',
      message: `💡 Level 3 Hint: Time to Add Cache!

1000 RPS will SATURATE your database!

Without cache:
- 900 reads + 100 writes = 1000 RPS to DB
- Database capacity: ~200 RPS
- Result: OVERLOADED ❌

Add Redis between App Server and Database:
Client → App → Redis → Database

Configure Redis:
- Memory: 4GB
- Hit Ratio: 90%
- Result: Only 100 reads hit DB ✅`,
    },
    {
      trigger: 'test_failed:Level 4',
      message: `💡 Level 4 Hint: Survive Failures!

The database CRASHES during this test!

Without redundancy:
- Database down = system down
- Fails 99.9% requirement

Add redundancy:
1. Load Balancer (before app servers)
2. Multiple App Servers (x2)
3. Database Replication (enable in Inspector)

This allows failover when components crash.`,
    },
    {
      trigger: 'test_failed:Level 5',
      message: `💡 Level 5 Hint: Optimize Cost!

You probably have all the right components from Level 4,
but cost is too high!

Cost Optimization:
1. Do you NEED database replication? (-$100)
   - Redis handles 90% of reads
   - Acceptable risk for cost savings

2. Check Redis size - can you use smaller? (-$100)
   - 4GB might be enough

3. Keep 2 app servers (needed for availability)

Target: $450-500/month`,
    },
    {
      trigger: 'component_added:cdn',
      message: `⚠️ CDN won't help here!

TinyURL responses are DYNAMIC:
- Each short code → different URL
- Can't cache redirects

CDN is for STATIC content (images, videos).

Use Redis instead - it caches URL mappings in memory.

Save $50/month by removing CDN!`,
    },
  ],

  // Code challenges for hands-on implementation practice
  codeChallenges: tinyUrlCodeChallenges,
};
