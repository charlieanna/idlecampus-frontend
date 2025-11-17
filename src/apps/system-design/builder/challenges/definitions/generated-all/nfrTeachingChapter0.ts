import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * NFR Teaching Problems - Chapter 0: Systems Thinking & Architecture Evolution
 * Focus: Teaching NFR-driven design from brute force to production architecture
 *
 * Module 1: Throughput & Horizontal Scaling (LARGEST axis)
 * Module 2: Burst Handling & Queuing
 * Module 3: Payload & Geography (SLOWEST axis)
 * Module 4: Durability & Persistence (RISKIEST axis)
 * Module 5: Read Latency & Caching
 * Module 6: Dataset Size & Sharding
 * Module 7: Data Processing & CDC
 * Module 8: Workload Separation & OLAP
 */

// ============================================================================
// Module 1: Throughput Calculation & Horizontal Scaling
// ============================================================================

/**
 * Problem 1: Server Capacity Planning - Calculate Servers from RPS
 *
 * THE FIRST LESSON: Start with Client → AppServer (NO DATABASE!)
 *
 * Teaches:
 * - How to calculate server capacity based on throughput (RPS)
 * - Why we need 30% headroom for OS overhead
 * - Difference between average and peak RPS
 * - When to add load balancer + horizontal scaling
 *
 * Learning Flow:
 * 1. Start: Client → Single AppServer
 * 2. Ask: What's your average RPS? Peak RPS?
 * 3. Calculate: Servers needed = Peak RPS / (Server Capacity × 0.7)
 * 4. Solution: Load Balancer + AppServer Pool
 */
export const throughputCalculationProblem: ProblemDefinition = {
  id: 'nfr-ch0-throughput-calc',
  title: 'Server Capacity Planning: From RPS to Server Count',
  description: `You're building a simple REST API service that processes user requests. Your API is stateless (no database yet!) and performs CPU-bound calculations.

**Starting Point:** Client → Single AppServer

**Your Task:**
Given the throughput requirements below, calculate how many servers you need and design the architecture.

**Throughput Requirements:**
- Average RPS: 2,000 requests/second
- Peak RPS: 10,000 requests/second (during daily peak hours)
- Single server capacity: 2,000 RPS (theoretical maximum)
- OS overhead: 30% (so effective capacity = 2,000 × 0.7 = 1,400 RPS per server)

**Calculation Formula:**
\`\`\`
Servers needed = Peak RPS / (Single Server Capacity × 0.7)
Servers needed = 10,000 / (2,000 × 0.7)
Servers needed = 10,000 / 1,400
Servers needed = ~8 servers (round up for safety)
\`\`\`

**Why 30% overhead?**
- Operating system processes (15%)
- Health checks & monitoring (5%)
- Connection handling & network I/O (5%)
- GC pauses & context switching (5%)

**Learning Objectives:**
1. Calculate server capacity accounting for OS overhead
2. Design for PEAK load, not average load
3. Understand when horizontal scaling is needed
4. Add load balancer to distribute traffic across servers

**Expected Architecture:**
\`\`\`
Client → Load Balancer → [AppServer 1]
                         [AppServer 2]
                         [AppServer 3]
                         ...
                         [AppServer 8]
\`\`\``,

  userFacingFRs: [
    'API must handle 2,000 RPS on average',
    'API must handle 10,000 RPS during peak hours',
    'Service must be stateless (no database required)',
  ],

  userFacingNFRs: [
    'Throughput: 10,000 RPS (peak)',
    'Single server capacity: 2,000 RPS (theoretical), 1,400 RPS (after 30% OS overhead)',
    'Required servers: 8 (10,000 / 1,400 = 7.14, round up to 8)',
  ],

  clientDescriptions: [
    {
      name: 'API Client',
      subtitle: 'Sends 10k RPS peak',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Distributes traffic across multiple app servers. Required when you have more than one server.',
      },
      {
        type: 'compute',
        reason: 'AppServer pool (minimum 8 servers to handle 10k peak RPS with 30% overhead)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'All client traffic goes through load balancer first',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load balancer distributes requests to app server pool',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-throughput-calc', problemConfigs['nfr-ch0-throughput-calc'] || {
    baseRps: 10000, // Peak RPS
    readRatio: 1.0, // All requests (no writes, no DB yet)
    maxLatency: 100, // Simple stateless API should be fast
    availability: 0.99, // Basic availability (no replication yet)
  }, [
    'Handle 10,000 RPS peak load',
  ]),

  validators: [
    {
      name: 'Basic Functionality',
      validate: basicFunctionalValidator,
    },
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Sufficient Server Capacity',
      validate: (graph, scenario, problem) => {
        // Find compute nodes (app servers)
        const computeNodes = graph.components.filter(n => n.type === 'compute');

        if (computeNodes.length === 0) {
          return {
            valid: false,
            hint: 'You need app servers to handle requests. Add compute nodes.',
          };
        }

        // Calculate total capacity
        // Assume each server can handle 1,400 RPS (2,000 × 0.7)
        const serverCapacity = 1400;
        const totalCapacity = computeNodes.length * serverCapacity;
        const requiredCapacity = 10000; // Peak RPS

        if (totalCapacity < requiredCapacity) {
          const needed = Math.ceil(requiredCapacity / serverCapacity);
          return {
            valid: false,
            hint: `Insufficient capacity! You have ${computeNodes.length} servers (${totalCapacity} RPS capacity). You need at least ${needed} servers to handle ${requiredCapacity} peak RPS with 30% OS overhead.`,
            details: {
              serversDeployed: computeNodes.length,
              serversNeeded: needed,
              capacityDeployed: totalCapacity,
              capacityNeeded: requiredCapacity,
            },
          };
        }

        return {
          valid: true,
          details: {
            serversDeployed: computeNodes.length,
            totalCapacity,
            utilizationAtPeak: (requiredCapacity / totalCapacity * 100).toFixed(1) + '%',
          },
        };
      },
    },
  ],
};

/**
 * Problem 2: Peak vs Average RPS - Why Design for Peak?
 *
 * Teaches:
 * - Difference between average and peak load
 * - What happens when you under-provision
 * - Cost vs performance trade-offs
 */
export const peakVsAverageProblem: ProblemDefinition = {
  id: 'nfr-ch0-peak-vs-avg',
  title: 'Peak vs Average: Why You Must Design for Peak Load',
  description: `A common mistake: "Our average load is only 1,000 RPS, so let's provision for that!"

**Scenario:**
You're running an e-commerce API with these traffic patterns:
- Average RPS: 1,000 (most of the day)
- Peak RPS: 8,000 (lunch hour, 12pm-1pm daily)
- Weekend peak: 15,000 RPS (Saturday morning flash sales)

**What happens if you provision for average?**
- You deploy: 1 server (1,400 RPS capacity)
- At 12pm daily: 8,000 requests arrive
- Server can handle: 1,400 RPS
- Result: 6,600 requests/sec are DROPPED or QUEUED
- User experience: Timeouts, 503 errors, angry customers

**The Rule:**
**ALWAYS design for PEAK load, not average load.**

**Calculation for this problem:**
\`\`\`
Peak RPS: 15,000 (weekend flash sale)
Single server capacity: 2,000 RPS
Effective capacity (30% overhead): 1,400 RPS
Servers needed: 15,000 / 1,400 = 10.7 → 11 servers
\`\`\`

**Cost Consideration:**
- Provisioning for average (1 server): $100/month
- Provisioning for peak (11 servers): $1,100/month
- Cost of downtime during peak: Lost sales, reputation damage

**Learning Objectives:**
1. Understand traffic patterns (average vs peak vs burst)
2. Calculate cost of under-provisioning
3. Learn when to use autoscaling vs static provisioning
4. Design for worst-case, not typical case`,

  userFacingFRs: [
    'Handle average load: 1,000 RPS',
    'Handle daily peak: 8,000 RPS (lunch hour)',
    'Handle weekend peak: 15,000 RPS (flash sales)',
  ],

  userFacingNFRs: [
    'Peak throughput: 15,000 RPS (weekend)',
    'Required servers: 11 (with 30% OS overhead)',
    'Availability: 99.9% during peak hours (cannot drop requests)',
  ],

  clientDescriptions: [
    {
      name: 'E-commerce Client',
      subtitle: 'Peak: 15k RPS',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Required to distribute traffic across server pool',
      },
      {
        type: 'compute',
        reason: 'Minimum 11 app servers to handle 15k weekend peak',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Traffic entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute to server pool',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-peak-vs-avg', problemConfigs['nfr-ch0-peak-vs-avg'] || {
    baseRps: 15000, // Weekend peak
    readRatio: 1.0,
    maxLatency: 200,
    availability: 0.999,
  }, [
    'Handle 15,000 RPS weekend peak',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Peak Load Capacity Check',
      validate: (graph, scenario, problem) => {
        const computeNodes = graph.components.filter(n => n.type === 'compute');
        const serverCapacity = 1400;
        const totalCapacity = computeNodes.length * serverCapacity;
        const peakRps = 15000;

        if (totalCapacity < peakRps) {
          const needed = Math.ceil(peakRps / serverCapacity);
          return {
            valid: false,
            hint: `Under-provisioned! Weekend peak is ${peakRps} RPS. You have ${computeNodes.length} servers (${totalCapacity} RPS). You need ${needed} servers. Remember: design for PEAK, not average!`,
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 3: Read/Write Ratio - Different Costs for Different Operations
 *
 * Teaches:
 * - Why reads and writes have different performance characteristics
 * - How to calculate capacity based on read/write mix
 * - When read/write ratio matters for architecture decisions
 * - Asymmetric costs: reads can be cached, writes must hit DB
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer Pool → Database
 * 2. Ask: What's your read/write ratio?
 * 3. Calculate: Different server capacity for reads vs writes
 * 4. Insight: Writes are the bottleneck (can't be easily scaled)
 */
export const readWriteRatioProblem: ProblemDefinition = {
  id: 'nfr-ch0-read-write-ratio',
  title: 'Read/Write Ratio: Why Writes Are Harder to Scale',
  description: `Not all RPS are created equal! You're building a social media API with 10,000 RPS, but the read/write ratio dramatically changes your architecture.

**Two Scenarios:**

**Scenario A: Read-Heavy (90% reads, 10% writes)**
\`\`\`
Total: 10,000 RPS
Reads:  9,000 RPS (90%)
Writes: 1,000 RPS (10%)
\`\`\`

**Scenario B: Write-Heavy (10% reads, 90% writes)**
\`\`\`
Total: 10,000 RPS
Reads:  1,000 RPS (10%)
Writes: 9,000 RPS (90%)
\`\`\`

**Why This Matters:**

**Read Operations:**
- Can be served from cache (5ms)
- Can be scaled horizontally (read replicas)
- AppServer can handle ~2,000 reads/sec
- **Cheap to scale:** Add more cache/replicas

**Write Operations:**
- Must hit database (no cache!)
- Must go through primary DB (bottleneck)
- AppServer can handle ~500 writes/sec (DB limit)
- **Expensive to scale:** Need sharding, queues, batching

**Server Capacity Calculation (Mixed Workload):**

For Scenario A (read-heavy):
\`\`\`
Reads:  9,000 RPS ÷ 2,000 per server = 5 servers
Writes: 1,000 RPS ÷ 500 per server  = 2 servers
Bottleneck: Reads (need 5 servers)
→ Deploy 5 servers ✅
\`\`\`

For Scenario B (write-heavy):
\`\`\`
Reads:  1,000 RPS ÷ 2,000 per server = 1 server
Writes: 9,000 RPS ÷ 500 per server  = 18 servers
Bottleneck: Writes (need 18 servers!)
→ Deploy 18 servers ❌ (writes bottleneck at DB!)
\`\`\`

**The Insight:**

Same total RPS (10,000), but:
- Read-heavy: 5 servers
- Write-heavy: 18 servers (but DB becomes bottleneck anyway!)

**Your Task:**

You have an e-commerce API:
- Total RPS: 10,000
- Read/write ratio: 95:5 (typical e-commerce - lots of browsing, few purchases)

Calculate:
1. Reads per second: 9,500 RPS
2. Writes per second: 500 RPS
3. Servers needed for reads: 9,500 ÷ 2,000 = 5 servers
4. Servers needed for writes: 500 ÷ 500 = 1 server
5. **Deploy: 5 servers** (reads are bottleneck)

**How Read/Write Ratio Changes Your Architecture:**

**95:5 (Read-Heavy - E-commerce, Social Media Feeds)**
\`\`\`
Example: E-commerce product browsing
Reads:  9,500 RPS (browse products)
Writes:   500 RPS (place orders)

Bottleneck: Reads (DB queries slow)
Architecture Changes:
✅ Add cache layer (Module 3) → 95% cache hit = 5ms reads
✅ Add read replicas → scale reads horizontally
❌ Write queues not needed (only 500 writes/sec)

Result: Client → LB → AppServer → Cache → DB (+ read replicas)
\`\`\`

**50:50 (Balanced - Collaborative Apps, Real-time Updates)**
\`\`\`
Example: Google Docs collaborative editing
Reads:  5,000 RPS (view documents)
Writes: 5,000 RPS (save edits)

Bottleneck: BOTH reads AND writes
Architecture Changes:
✅ Add cache for reads → reduce DB read load
✅ Add write queue + batching → handle 5k writes/sec
✅ Need both strategies simultaneously

Result: Client → LB → AppServer → Cache → DB
                                    ↓
                              Write Queue → Batching Workers → DB
\`\`\`

**5:95 (Write-Heavy - Analytics, Logging, IoT Sensors)**
\`\`\`
Example: IoT sensor data ingestion
Reads:    500 RPS (dashboards, queries)
Writes: 9,500 RPS (sensor events)

Bottleneck: Writes (DB can't handle 9.5k writes/sec)
Architecture Changes:
❌ Cache doesn't help (only 500 reads/sec, not the bottleneck)
✅ Write queue + batching (Module 2) → 30× improvement
✅ Consider time-series DB or append-only storage
✅ May need sharding (partition by sensor_id)

Result: Client → LB → AppServer → Write Queue → Batching Workers → DB (sharded)
\`\`\`

**The Decision Matrix:**

| Ratio    | Reads  | Writes | Read Solution       | Write Solution       | Example           |
|----------|--------|--------|---------------------|----------------------|-------------------|
| 95:5     | 9,500  | 500    | ✅ Cache            | ❌ Not needed        | E-commerce        |
| 90:10    | 9,000  | 1,000  | ✅ Cache            | ⚠️  Maybe queue      | Social media feed |
| 80:20    | 8,000  | 2,000  | ✅ Cache            | ✅ Write queue       | News site         |
| 50:50    | 5,000  | 5,000  | ✅ Cache            | ✅ Write queue       | Google Docs       |
| 20:80    | 2,000  | 8,000  | ⚠️  Small cache    | ✅ Write queue       | Click tracking    |
| 5:95     | 500    | 9,500  | ❌ Not needed       | ✅ Write queue       | IoT sensors       |

**Key Learnings:**
1. **Read-heavy (>80% reads):** Reads are bottleneck → solution = caching (Module 3)
2. **Write-heavy (>50% writes):** Writes are bottleneck → solution = write queues (Module 2)
3. **Balanced (40-60% writes):** Need BOTH caching AND write optimization
4. **The ratio determines which modules you need to apply**

**What This Teaches:**
- Not all RPS have the same cost
- Read/write ratio determines your bottleneck AND your architecture
- Reads scale horizontally (easy) → caching, read replicas
- Writes scale vertically (hard) → queues, batching, sharding
- **Always calculate BOTH** read and write throughput separately`,

  userFacingFRs: [
    'API must serve 10,000 total RPS',
    'Read/write ratio: 95:5 (e-commerce browsing pattern)',
    'Reads: product catalog, search, reviews',
    'Writes: orders, cart updates, reviews',
  ],

  userFacingNFRs: [
    'Total RPS: 10,000',
    'Read RPS: 9,500 (95%)',
    'Write RPS: 500 (5%)',
    'Single server capacity: 2,000 reads/sec OR 500 writes/sec',
    'Bottleneck: Reads (need 5 servers)',
  ],

  clientDescriptions: [
    {
      name: 'E-commerce Client',
      subtitle: '95% reads, 5% writes',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool (minimum 5 servers for 9.5k read RPS)',
      },
      {
        type: 'storage',
        reason: 'Database (handles 500 writes/sec)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute traffic',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'AppServers connect to database for reads and writes',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-read-write-ratio', problemConfigs['nfr-ch0-read-write-ratio'] || {
    baseRps: 10000,
    readRatio: 0.95, // 95% reads, 5% writes
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Handle 10k RPS with 95:5 read/write ratio',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Sufficient Capacity for Read-Heavy Workload',
      validate: (graph, scenario, problem) => {
        const computeNodes = graph.components.filter(n => n.type === 'compute');

        if (computeNodes.length === 0) {
          return {
            valid: false,
            hint: 'You need app servers to handle requests.',
          };
        }

        // For 95% reads: 9,500 RPS ÷ 2,000 per server = 5 servers needed
        const readRps = 9500;
        const readCapacityPerServer = 2000;
        const serversNeeded = Math.ceil(readRps / readCapacityPerServer);

        if (computeNodes.length < serversNeeded) {
          return {
            valid: false,
            hint: `Read-heavy workload (9,500 read RPS) needs ${serversNeeded} servers at 2,000 reads/sec per server. You have ${computeNodes.length} servers. Reads are your bottleneck!`,
          };
        }

        return {
          valid: true,
          details: {
            readRps,
            writeRps: 500,
            serversDeployed: computeNodes.length,
            serversNeeded,
            bottleneck: 'reads',
          },
        };
      },
    },
    {
      name: 'Database for Writes',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length === 0) {
          return {
            valid: false,
            hint: 'You have 500 writes/sec that must be persisted. Add a database to handle writes (even though reads dominate your workload).',
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 4: Autoscaling - Dynamic Capacity Adjustment
 *
 * Teaches:
 * - When to use autoscaling vs static provisioning
 * - Autoscaling metrics (CPU, RPS, queue depth)
 * - Scale-up lag and scale-down delays
 */
export const autoscalingProblem: ProblemDefinition = {
  id: 'nfr-ch0-autoscaling',
  title: 'Autoscaling: Dynamic Capacity for Variable Load',
  description: `Static provisioning wastes money. If your peak is 10× your average, you're paying for idle servers 90% of the time.

**Scenario:**
Social media API with highly variable traffic:
- Baseline: 500 RPS (overnight, 2am-6am)
- Average: 2,000 RPS (typical daytime)
- Daily peak: 8,000 RPS (evening, 6pm-9pm)
- Event spike: 20,000 RPS (breaking news, celebrity tweet)

**Static Provisioning Cost:**
- Need 15 servers for 20k spike (1,400 RPS each)
- Cost: 15 × $100 = $1,500/month
- Utilization overnight: 500 / (15 × 1,400) = 2.4% 😱

**Autoscaling Solution:**
- Minimum instances: 2 (covers baseline 500 RPS)
- Maximum instances: 15 (covers spike 20k RPS)
- Scale up when: CPU > 70% OR RPS > 1,000 per server
- Scale down when: CPU < 30% AND RPS < 500 per server

**Autoscaling Challenges:**
1. **Scale-up lag:** Takes 2-3 minutes to start new servers
   - Solution: Scale proactively (before hitting 100% capacity)
2. **Scale-down delay:** Don't scale down immediately
   - Solution: Wait 10 minutes before removing servers
3. **Thundering herd:** Sudden 0 → 20k RPS spike
   - Solution: Request queue + gradual scale-up

**Learning Objectives:**
1. Configure autoscaling policies
2. Set min/max instance counts
3. Choose scaling metrics
4. Understand scale-up lag implications`,

  userFacingFRs: [
    'Handle baseline: 500 RPS (overnight)',
    'Handle average: 2,000 RPS (daytime)',
    'Handle peak: 8,000 RPS (evening)',
    'Handle spike: 20,000 RPS (breaking news)',
  ],

  userFacingNFRs: [
    'Autoscaling: Min 2 servers, Max 15 servers',
    'Scale-up trigger: CPU > 70% or RPS > 1,000/server',
    'Scale-down trigger: CPU < 30% and RPS < 500/server (after 10min)',
    'Cost optimization: Pay for actual usage, not peak capacity',
  ],

  clientDescriptions: [
    {
      name: 'Social Media Client',
      subtitle: 'Variable load: 500-20k RPS',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Distributes traffic to autoscaling server pool',
      },
      {
        type: 'compute',
        reason: 'Autoscaling app servers (min 2, max 15)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point for all traffic',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distributes to dynamic server pool',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-autoscaling', problemConfigs['nfr-ch0-autoscaling'] || {
    baseRps: 20000, // Spike scenario
    readRatio: 1.0,
    maxLatency: 300, // Higher latency acceptable during spike
    availability: 0.99,
  }, [
    'Handle 20,000 RPS spike with autoscaling',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Autoscaling Capacity',
      validate: (graph, scenario, problem) => {
        const computeNodes = graph.components.filter(n => n.type === 'compute');
        const serverCapacity = 1400;

        // For autoscaling, we validate they have ENOUGH nodes to theoretically handle peak
        // In a real system, this would be dynamic, but for teaching we check max capacity
        const totalCapacity = computeNodes.length * serverCapacity;
        const spikeRps = 20000;
        const minServers = 2;
        const maxServers = 15;

        if (computeNodes.length < minServers) {
          return {
            valid: false,
            hint: `You need at least ${minServers} servers as baseline for autoscaling (to handle 500 RPS baseline).`,
          };
        }

        if (totalCapacity < spikeRps) {
          return {
            valid: false,
            hint: `Your max capacity (${computeNodes.length} servers = ${totalCapacity} RPS) can't handle ${spikeRps} RPS spike. You need max ${maxServers} servers for autoscaling.`,
          };
        }

        return {
          valid: true,
          details: {
            minServers: minServers,
            maxServers: computeNodes.length,
            maxCapacity: totalCapacity,
          },
        };
      },
    },
  ],
};

// ============================================================================
// Module 2: Burst Handling & Write Queues
// ============================================================================

/**
 * Problem 4: Burst QPS - When Horizontal Scaling Isn't Fast Enough
 *
 * Teaches:
 * - Difference between sustained load and burst load
 * - Why autoscaling has scale-up lag (2-3 minutes)
 * - When to use request queues instead of just adding servers
 * - Backpressure and queue depth monitoring
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer Pool (10 servers)
 * 2. Scenario: Flash sale - 0 → 20,000 RPS in 10 seconds
 * 3. Problem: Autoscaling takes 3 minutes, requests are dropped
 * 4. Solution: Add request queue to buffer the burst
 */
export const burstQpsProblem: ProblemDefinition = {
  id: 'nfr-ch0-burst-qps',
  title: 'Burst QPS: Request Queues for Flash Sales',
  description: `You've built an e-commerce API with autoscaling (from Module 1). It handles normal traffic well, but during flash sales, users see errors.

**Current Architecture:**
\`\`\`
Client → Load Balancer → AppServer Pool (autoscale: 5-20 servers)
\`\`\`

**The Flash Sale Scenario:**
- Normal load: 2,000 RPS
- Flash sale starts at 12:00:00 PM
- Traffic spike: 0 → 20,000 RPS in 10 seconds
- Duration: 5 minutes, then drops back to normal

**What Happens (Current System):**
\`\`\`
12:00:00 - Flash sale starts, traffic hits 20,000 RPS
12:00:01 - Load balancer has 5 servers (capacity: 7,000 RPS)
12:00:01 - 13,000 requests/sec are DROPPED (503 errors)
12:00:05 - Autoscaling triggers (CPU > 70%)
12:00:08 - New servers starting...
12:03:00 - New servers ready (now have 15 servers)
12:03:00 - Can finally handle 20,000 RPS
Result: 3 minutes of dropped requests ❌
\`\`\`

**Why Autoscaling Alone Fails:**
1. **Scale-up lag:** Takes 2-3 minutes to start new servers
2. **Thundering herd:** All requests arrive at once
3. **Binary choice:** Accept request OR drop it (no buffering)

**The Problem:**
During the 3-minute scale-up window:
- 13,000 requests/sec × 180 seconds = 2.34 million dropped requests
- Users see: "Service Unavailable" errors
- Lost sales, angry customers, bad PR

**Your Task:**
Add a request queue to buffer burst traffic while autoscaling catches up.

**Solution: Request Queue + Worker Pool**
\`\`\`
Client → LB → Request Queue (Kafka/SQS) → Worker Pool (5-20 servers)
\`\`\`

**How It Works:**
1. LB accepts ALL requests immediately (returns 202 Accepted)
2. Requests are queued (Kafka can buffer millions of messages)
3. Workers process queue at their max capacity (7k RPS with 5 servers)
4. Autoscaling kicks in, workers scale to 15 servers (21k RPS)
5. Queue drains in ~2 minutes

**New Timeline:**
\`\`\`
12:00:00 - Flash sale, 20k RPS hits queue
12:00:01 - Queue accepts all, depth = 20k messages
12:00:01 - 5 workers process at 7k RPS (13k/sec queued)
12:03:00 - Now 15 workers (21k RPS capacity)
12:03:00 - Queue draining faster than filling
12:05:00 - Queue empty, all requests processed ✅
Result: 0 dropped requests, users see "processing..." instead of errors
\`\`\`

**Trade-offs:**
- ✅ No dropped requests
- ✅ Smooth user experience ("Your order is being processed")
- ⚠️  Latency: Users wait 30-120 seconds instead of instant response
- ⚠️  Queue monitoring: Need to watch queue depth

**Learning Objectives:**
1. Understand burst vs sustained load
2. Know when queues > horizontal scaling
3. Calculate queue depth and drain rate
4. Design for backpressure (what if queue fills up?)`,

  userFacingFRs: [
    'Handle flash sale traffic spikes (20,000 RPS burst)',
    'No dropped requests during scale-up lag',
    'Users see "processing" status instead of errors',
  ],

  userFacingNFRs: [
    'Burst QPS: 20,000 RPS for 5 minutes',
    'Scale-up lag: 3 minutes (AWS EC2 boot time)',
    'Queue capacity: 1M messages (enough for 5-min burst)',
    'Acceptable latency during burst: 30-120 seconds',
  ],

  clientDescriptions: [
    {
      name: 'Flash Sale Client',
      subtitle: 'Burst: 20k RPS',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic entry point',
      },
      {
        type: 'message_queue',
        reason: 'Buffer burst traffic (Kafka/SQS) - critical for handling 20k RPS spike',
      },
      {
        type: 'compute',
        reason: 'Worker pool (autoscale 5-20 servers) - processes queue',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'message_queue',
        reason: 'LB enqueues all requests immediately (returns 202 Accepted)',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Workers pull from queue at max capacity',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-burst-qps', problemConfigs['nfr-ch0-burst-qps'] || {
    baseRps: 20000, // Burst peak
    readRatio: 0.5, // Mixed read/write (flash sale orders)
    maxLatency: 120000, // 120 seconds acceptable during burst
    availability: 0.999, // No dropped requests
  }, [
    'Handle 20k RPS burst with queue buffering',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Request Queue Required',
      validate: (graph, scenario, problem) => {
        const queueNodes = graph.components.filter(n => n.type === 'message_queue');

        if (queueNodes.length === 0) {
          return {
            valid: false,
            hint: 'Autoscaling takes 3 minutes. During 20k RPS burst, 13k requests/sec will be dropped. Add a request queue (Kafka/SQS) to buffer traffic while scaling up.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'Queue Between LB and Workers',
      validate: (graph, scenario, problem) => {
        const lbNodes = graph.components.filter(n => n.type === 'load_balancer');
        const queueNodes = graph.components.filter(n => n.type === 'message_queue');
        const computeNodes = graph.components.filter(n => n.type === 'compute');

        if (queueNodes.length === 0) return { valid: true }; // Skip if no queue

        // Check: LB → Queue → Compute
        const lbToQueue = graph.connections.some(
          c => lbNodes.some(lb => lb.id === c.from) &&
               queueNodes.some(q => q.id === c.to)
        );

        const queueToCompute = graph.connections.some(
          c => queueNodes.some(q => q.id === c.from) &&
               computeNodes.some(comp => comp.id === c.to)
        );

        if (!lbToQueue || !queueToCompute) {
          return {
            valid: false,
            hint: 'Queue must buffer between LB and workers. Flow: LB → Queue (enqueue) → Workers (dequeue and process).',
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 5: Write Queues vs Read Queues - Different Buffering Strategies
 *
 * Teaches:
 * - When to use write queues (DB write bottleneck)
 * - Batching for efficiency (100 writes/txn = 30× faster)
 * - Why reads can't be queued (users won't wait)
 * - 202 Accepted pattern for async processing
 *
 * Learning Flow:
 * 1. Scenario: E-commerce with 10k writes/sec (orders, reviews, analytics)
 * 2. Problem: Database can only handle 3k writes/sec
 * 3. Solution: Write queue + batching workers
 * 4. Contrast: Reads need caching (Module 3), not queuing
 */
export const writeQueueBatchingProblem: ProblemDefinition = {
  id: 'nfr-ch0-write-queue-batching',
  title: 'Write Queues: Batching for Database Write Efficiency',
  description: `Your e-commerce platform handles 10,000 writes/second (orders, reviews, inventory updates). Your database is the bottleneck.

**Current Architecture:**
\`\`\`
Client → LB → AppServer Pool → PostgreSQL
\`\`\`

**The Write Bottleneck:**
- Incoming writes: 10,000/sec
- Database capacity: 3,000 writes/sec (single transaction per write)
- Result: 7,000 writes/sec are failing ❌

**Why Is the Database Slow?**
Each write is a separate transaction:
\`\`\`sql
-- User submits order
BEGIN;
  INSERT INTO orders VALUES (...);
COMMIT;  -- Disk fsync (slow!)
-- This takes ~0.3ms per write = max 3,000 writes/sec
\`\`\`

**The Insight: Batching**
Instead of 1 write per transaction, batch 100 writes:
\`\`\`sql
BEGIN;
  INSERT INTO orders VALUES (...);  -- Write 1
  INSERT INTO orders VALUES (...);  -- Write 2
  ...  -- 98 more writes
  INSERT INTO orders VALUES (...);  -- Write 100
COMMIT;  -- One disk fsync for 100 writes!
-- This takes ~1ms per batch = 100,000 writes/sec capacity ✅
\`\`\`

**Your Task:**
Design a write queue + batching worker architecture.

**Solution: Write Queue + Batching Workers**
\`\`\`
Client → LB → AppServer → Write Queue (Kafka)
                             │
                             ▼
                       Batching Workers
                       (batch 100, every 200ms)
                             │
                             ▼
                       PostgreSQL
\`\`\`

**How It Works:**
1. **AppServer:** Receives write request
   - Validates input
   - Enqueues to Kafka
   - Returns "202 Accepted" immediately
   - User sees: "Your order is being processed"

2. **Batching Worker:**
   - Accumulates 100 messages from queue
   - OR waits 200ms (whichever comes first)
   - Executes batch INSERT in one transaction
   - Commits once for all 100 writes

3. **Performance:**
   - Before: 3,000 writes/sec (1 per txn)
   - After: 100,000 writes/sec (100 per txn)
   - **30× improvement!**

**Why This Works:**
- Disk fsync is expensive (~0.3ms)
- Batching amortizes cost across 100 writes
- Queue decouples write spikes from DB

**When NOT to Use Write Queues:**
❌ **Reads:** Users won't wait 200ms for search results
   → Use caching instead (Module 3)
❌ **Real-time critical writes:** Stock trading, payment auth
   → Need synchronous DB writes
✅ **Async-tolerant writes:** Orders, logs, analytics, emails

**Learning Objectives:**
1. Identify write bottlenecks (DB transaction overhead)
2. Calculate batching efficiency gains
3. Design 202 Accepted pattern
4. Know when queues work vs don't work`,

  userFacingFRs: [
    'Handle 10,000 writes/second (orders, reviews, analytics)',
    'Users see immediate confirmation ("Processing your order")',
    'All writes eventually persisted to database',
  ],

  userFacingNFRs: [
    'Write throughput: 10,000 writes/sec',
    'Database capacity: 3,000 writes/sec (without batching)',
    'Batch size: 100 writes per transaction',
    'Batch latency: P99 < 500ms (acceptable for async writes)',
  ],

  clientDescriptions: [
    {
      name: 'E-commerce Client',
      subtitle: '10k writes/sec',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServers (validate + enqueue)',
      },
      {
        type: 'message_queue',
        reason: 'Write queue (Kafka) - buffers writes for batching',
      },
      {
        type: 'storage',
        reason: 'PostgreSQL - receives batched writes',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'AppServers handle requests',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'AppServers enqueue writes (return 202 Accepted)',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Batching workers pull from queue → batch INSERT to DB',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-write-queue-batching', problemConfigs['nfr-ch0-write-queue-batching'] || {
    baseRps: 10000,
    readRatio: 0.0, // All writes
    maxLatency: 500, // Batching latency
    availability: 0.999,
  }, [
    'Handle 10k writes/sec with batching',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Write Queue Required',
      validate: (graph, scenario, problem) => {
        const queueNodes = graph.components.filter(n => n.type === 'message_queue');

        if (queueNodes.length === 0) {
          return {
            valid: false,
            hint: 'Database can only handle 3k writes/sec, but you have 10k writes/sec. Add a write queue (Kafka) for batching. This improves throughput by 30×.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'Queue Before Database',
      validate: (graph, scenario, problem) => {
        const queueNodes = graph.components.filter(n => n.type === 'message_queue');
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (queueNodes.length === 0) return { valid: true }; // Skip if no queue

        // Check: Queue → Database (batching workers)
        const queueToDb = graph.connections.some(
          c => queueNodes.some(q => q.id === c.from) &&
               storageNodes.some(db => db.id === c.to)
        );

        if (!queueToDb) {
          return {
            valid: false,
            hint: 'Batching workers must pull from queue and write to database. Add connection: Queue → Database (workers batch 100 writes per transaction).',
          };
        }

        return { valid: true };
      },
    },
  ],
};

// ============================================================================
// Module 3: Latency - Request-Response & Data Processing
// ============================================================================

/**
 * Problem 6: Request-Response Latency - Understanding P99 and Percentiles
 *
 * Teaches:
 * - Difference between average latency and tail latency (P99, P999)
 * - Why percentiles matter more than averages
 * - How to set P99 targets
 * - Latency budget allocation
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer Pool → Database
 * 2. Ask: What's your P99 latency target?
 * 3. Measure: Current P99 = 450ms (DB query = 380ms)
 * 4. Problem: Violates 200ms target
 * 5. Solution: Add cache layer
 */
export const requestResponseLatencyProblem: ProblemDefinition = {
  id: 'nfr-ch0-request-response-latency',
  title: 'Request-Response Latency: P99 SLOs & Latency Budgets',
  description: `You've built an API service with load balancing and horizontal scaling (from Module 1). Now users are complaining about slow response times.

**Current Architecture:**
\`\`\`
Client → Load Balancer → AppServer Pool (10 servers) → PostgreSQL
\`\`\`

**The Problem:**
Your API is handling throughput well (10k RPS), but it's SLOW.

**Current Latency Measurements:**
- Average latency: 120ms ✅ (seems fine!)
- P50 (median): 80ms ✅
- P95: 250ms ⚠️
- P99: 450ms ❌ (unacceptable!)
- P999: 2,100ms ❌ (terrible!)

**Your P99 SLO: 200ms**

**Why P99 Matters More Than Average:**
1. **User experience:** The "average" user doesn't exist. 1 in 100 requests sees 450ms.
2. **Fan-out amplification:** If your service calls 10 downstream APIs, probability of hitting P99 = 1 - (0.99)^10 = 9.6%
3. **Early warning:** P99 degrades BEFORE average does. It's your canary.

**Latency Budget Breakdown (Current):**
\`\`\`
Total budget: 200ms
━━━━━━━━━━━━━━━━━━━━━
Network (client → LB):           20ms
Load balancer:                   10ms
AppServer queue wait:            15ms
AppServer processing:            25ms
Database query (PRIMARY ISSUE):  380ms ❌
━━━━━━━━━━━━━━━━━━━━━
TOTAL:                           450ms (2.25× over budget!)
\`\`\`

**Root Cause:** Database is the bottleneck for read-heavy workload (100:1 read/write ratio).

**Your Task:**
Fix the P99 latency to meet the 200ms SLO.

**Solution:**
Add a cache layer (Redis) to reduce database load.

**After Adding Cache:**
\`\`\`
Cache hit (95% of requests):     5ms ✅
Cache miss (5% of requests):     380ms (still slow but rare)
Weighted average P99:            ~50ms ✅
\`\`\`

**Learning Objectives:**
1. Understand percentiles (P50, P95, P99, P999)
2. Know why averages lie about tail latency
3. Allocate latency budgets across system hops
4. Identify when caching is needed (read-heavy + high latency)`,

  userFacingFRs: [
    'API must serve 10,000 RPS (already achieved in Module 1)',
    'API must handle read-heavy workload (100:1 read/write ratio)',
    'Database contains 100GB dataset (product catalog)',
  ],

  userFacingNFRs: [
    'P99 latency target: 200ms (currently 450ms ❌)',
    'P999 latency target: 500ms (currently 2,100ms ❌)',
    'Read/write ratio: 100:1 (read-heavy)',
    'Hot dataset: 20GB (frequently accessed products)',
  ],

  clientDescriptions: [
    {
      name: 'E-commerce Client',
      subtitle: 'Browse products (10k RPS)',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Already have from Module 1',
      },
      {
        type: 'compute',
        reason: 'AppServer pool (10 servers)',
      },
      {
        type: 'cache',
        reason: 'Redis cache to reduce DB read latency (95% hit ratio)',
      },
      {
        type: 'storage',
        reason: 'PostgreSQL database (source of truth)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Traffic entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute to app servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Check cache BEFORE hitting database',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Cache miss → read from database',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-request-response-latency', problemConfigs['nfr-ch0-request-response-latency'] || {
    baseRps: 10000,
    readRatio: 0.99, // 100:1 read/write ratio
    maxLatency: 200, // P99 target
    availability: 0.99,
  }, [
    'Achieve P99 < 200ms with cache layer',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Cache Layer Required',
      validate: (graph, scenario, problem) => {
        const cacheNodes = graph.components.filter(n => n.type === 'cache');

        if (cacheNodes.length === 0) {
          return {
            valid: false,
            hint: 'Your P99 latency is 450ms due to DB reads. Add a cache layer (Redis) to reduce latency. With 95% cache hit ratio, P99 will drop to ~50ms.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'Cache Before Database',
      validate: (graph, scenario, problem) => {
        const cacheNodes = graph.components.filter(n => n.type === 'cache');
        const computeNodes = graph.components.filter(n => n.type === 'compute');
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (cacheNodes.length === 0) return { valid: true }; // Skip if no cache

        // Check connections: compute → cache → storage
        const computeToCache = graph.connections.some(
          c => computeNodes.some(comp => comp.id === c.from) &&
               cacheNodes.some(cache => cache.id === c.to)
        );

        const cacheToStorage = graph.connections.some(
          c => cacheNodes.some(cache => cache.id === c.from) &&
               storageNodes.some(db => db.id === c.to)
        );

        if (!computeToCache || !cacheToStorage) {
          return {
            valid: false,
            hint: 'Cache must be between AppServer and Database. Flow: AppServer → Cache → Database (on miss).',
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 5: Data Processing Latency - Freshness SLOs for Derived Data
 *
 * Teaches:
 * - Difference between request-response latency (user-facing) and data processing latency (freshness)
 * - Why derived data (search indexes, analytics) needs separate latency SLOs
 * - Change Data Capture (CDC) for real-time data propagation
 * - Event streaming architectures
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer → Cache → Database
 * 2. New requirement: Product search (requires search index)
 * 3. Ask: How fresh should the search index be?
 * 4. Target: P99 freshness < 30 seconds
 * 5. Solution: CDC → Event Stream → Search Indexer
 */
export const dataProcessingLatencyProblem: ProblemDefinition = {
  id: 'nfr-ch0-data-processing-latency',
  title: 'Data Processing Latency: Freshness SLOs & CDC Pipelines',
  description: `Your e-commerce API now has great request-response latency (P99 < 200ms thanks to caching). But users report that newly added products don't show up in search results!

**Current Architecture:**
\`\`\`
Client → LB → AppServer Pool → Cache → PostgreSQL
\`\`\`

**The New Requirement:**
Add product search functionality. When a merchant adds a new product, it should appear in search results quickly.

**Two Types of Latency:**

**1. Request-Response Latency (User-Facing) ✅**
- User submits search query
- How long until they see results?
- Target: P99 < 200ms
- Already achieved via caching

**2. Data Processing Latency (Freshness) ❌**
- Merchant adds new product to database
- How long until it appears in search index?
- Target: P99 < 30 seconds
- **Currently: 5 minutes** (batch job runs every 5 minutes)

**The Problem:**

**Current Approach: Batch Processing**
\`\`\`
PostgreSQL ──(poll every 5 min)──> Batch Job ──> Elasticsearch
\`\`\`
- ❌ Freshness: 5 minutes average, up to 10 minutes worst case
- ❌ Inefficient: Scans entire table every 5 minutes
- ❌ Load spikes: Heavy DB queries every 5 minutes

**Why This Matters:**
- Merchant adds product at 2:00:00 PM
- Batch job runs at 2:05:00 PM
- Product appears in search at 2:05:15 PM
- **Data processing latency: 5 minutes 15 seconds** ❌

**Your Task:**
Design a real-time data pipeline to achieve P99 freshness < 30 seconds.

**Solution: Change Data Capture (CDC) + Event Streaming**

**New Architecture:**
\`\`\`
PostgreSQL ──(CDC connector)──> Kafka Topic
                                    │
                                    ├──> Search Indexer → Elasticsearch
                                    ├──> Cache Invalidator → Redis
                                    └──> Analytics → Data Warehouse
\`\`\`

**How CDC Works:**
1. CDC connector (Debezium) monitors PostgreSQL transaction log
2. Captures all INSERT/UPDATE/DELETE events in real-time
3. Publishes events to Kafka topic (< 1 second lag)
4. Multiple consumers process events independently

**Data Processing Latency Breakdown:**
\`\`\`
Target: 30 seconds P99
━━━━━━━━━━━━━━━━━━━━━
CDC capture (DB → Kafka):          2s
Kafka transport:                    1s
Search indexer processing:          8s
Elasticsearch indexing:             12s
Cache invalidation:                 2s
━━━━━━━━━━━━━━━━━━━━━
TOTAL:                              25s ✅ (under 30s target!)
\`\`\`

**Why CDC > Batch:**
1. **Real-time:** Events captured immediately (not every 5 min)
2. **Efficient:** Only changed rows sent (not full table scan)
3. **Scalable:** Multiple consumers can process same events
4. **Decoupled:** Search, cache, analytics update independently

**Learning Objectives:**
1. Distinguish request-response latency from data processing latency
2. Set freshness SLOs for derived data
3. Understand CDC (Change Data Capture) patterns
4. Design event-driven architectures`,

  userFacingFRs: [
    'Merchants can add/update products',
    'Users can search for products',
    'Search results must include recently added products',
  ],

  userFacingNFRs: [
    'Request-response latency (search query): P99 < 200ms ✅ (already achieved)',
    'Data processing latency (new product → searchable): P99 < 30s (currently 5 min ❌)',
    'Freshness target: 95% of products appear in search within 30s of being added',
  ],

  clientDescriptions: [
    {
      name: 'Merchant Client',
      subtitle: 'Add products',
      id: 'merchant_client',
    },
    {
      name: 'User Client',
      subtitle: 'Search products',
      id: 'user_client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool',
      },
      {
        type: 'cache',
        reason: 'Redis for fast reads',
      },
      {
        type: 'storage',
        reason: 'PostgreSQL (source of truth)',
      },
      {
        type: 'message_queue',
        reason: 'Kafka for CDC event stream (captures DB changes in real-time)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute traffic',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Read cache first',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Cache miss → database',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'CDC connector sends DB changes to Kafka',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-data-processing-latency', problemConfigs['nfr-ch0-data-processing-latency'] || {
    baseRps: 5000,
    readRatio: 0.95, // Mostly searches, some writes
    maxLatency: 200, // Request-response P99
    availability: 0.99,
  }, [
    'Achieve P99 freshness < 30s with CDC',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Event Queue for CDC',
      validate: (graph, scenario, problem) => {
        const queueNodes = graph.components.filter(n => n.type === 'message_queue');

        if (queueNodes.length === 0) {
          return {
            valid: false,
            hint: 'To achieve P99 freshness < 30s, you need real-time event streaming. Add Kafka (message_queue) for CDC events. Batch jobs (5 min polling) are too slow.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'CDC Pipeline: DB → Queue',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');
        const queueNodes = graph.components.filter(n => n.type === 'message_queue');

        if (queueNodes.length === 0) return { valid: true }; // Skip if no queue

        // Check for DB → Queue connection (CDC connector)
        const dbToQueue = graph.connections.some(
          c => storageNodes.some(db => db.id === c.from) &&
               queueNodes.some(queue => queue.id === c.to)
        );

        if (!dbToQueue) {
          return {
            valid: false,
            hint: 'CDC connector must capture database changes. Add connection: Database → Kafka (CDC publishes change events to Kafka topic).',
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 8: Caching Strategies - Cache-Aside, Write-Through, Write-Behind
 *
 * Teaches:
 * - Different caching strategies and when to use each
 * - Cache-aside (lazy loading) for read-heavy workloads
 * - Write-through for strong consistency
 * - Write-behind for write-heavy workloads
 * - Trade-offs: consistency, latency, complexity
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer → Database
 * 2. Need: Add cache layer, but WHICH caching strategy?
 * 3. Ask: What's your consistency requirement? Read/write ratio?
 * 4. Solution: Choose strategy based on NFRs
 */
export const cachingStrategiesProblem: ProblemDefinition = {
  id: 'nfr-ch0-caching-strategies',
  title: 'Caching Strategies: Cache-Aside vs Write-Through vs Write-Behind',
  description: `You know you need caching to reduce latency (from Module 3 Problem 1). But WHICH caching strategy should you use?

**The Scenario:**
You're building a social media API with:
- Read/write ratio: 90:10 (read-heavy, but writes matter too!)
- Current latency: P99 = 450ms (DB is bottleneck)
- Consistency requirement: Eventual consistency acceptable

**Three Caching Strategies:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**1. Cache-Aside (Lazy Loading)** - Most Common
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Read Flow:**
\`\`\`
1. AppServer checks cache
2. Cache miss → read from database
3. AppServer writes to cache
4. Return data to client
\`\`\`

**Write Flow:**
\`\`\`
1. AppServer writes to database
2. AppServer invalidates cache (delete key)
3. Next read will cache miss → reload from DB
\`\`\`

**Pros:**
✅ Simple to implement
✅ Only caches requested data (no wasted memory)
✅ Cache failures don't break writes

**Cons:**
❌ Cache miss penalty (first read after write is slow)
❌ Thundering herd (many readers after cache invalidation)
❌ Stale reads possible (if cache not invalidated)

**When to Use:**
- Read-heavy workloads (>80% reads)
- Eventual consistency acceptable
- Unpredictable access patterns
- **Example:** Product catalog, user profiles, news feeds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**2. Write-Through** - Strong Consistency
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Read Flow:**
\`\`\`
1. AppServer checks cache
2. Cache miss → read from database
3. AppServer writes to cache
4. Return data
\`\`\`

**Write Flow:**
\`\`\`
1. AppServer writes to cache first
2. Cache synchronously writes to database (same transaction)
3. Only return success after BOTH writes complete
\`\`\`

**Pros:**
✅ Cache always consistent with database
✅ No stale reads
✅ Predictable latency (no cache miss penalty)

**Cons:**
❌ Slower writes (must write to both cache AND DB)
❌ Wasted writes (caching data that's never read)
❌ Cache failure breaks writes

**When to Use:**
- Strong consistency required
- Read-heavy but consistency > latency
- Predictable access patterns
- **Example:** User session data, inventory counts, account balances

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**3. Write-Behind (Write-Back)** - Write-Heavy Optimization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Read Flow:**
\`\`\`
1. AppServer checks cache
2. Cache miss → read from database
3. AppServer writes to cache
4. Return data
\`\`\`

**Write Flow:**
\`\`\`
1. AppServer writes to cache ONLY
2. Return success immediately (cache write is fast!)
3. Background worker asynchronously flushes cache → DB
4. Database updated later (after 200ms or batch of 100)
\`\`\`

**Pros:**
✅ Fast writes (cache only, no DB wait)
✅ Batching reduces DB load (100 writes → 1 transaction)
✅ Great for write-heavy workloads

**Cons:**
❌ Data loss risk (if cache crashes before flush)
❌ Complex (need background workers, flush logic)
❌ Debugging harder (DB lags behind cache)

**When to Use:**
- Write-heavy workloads (>50% writes)
- Writes are bursty
- Some data loss acceptable (or use persistent cache)
- **Example:** Page view counters, analytics, gaming leaderboards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Decision Matrix:**

| Read:Write | Consistency | Best Strategy    | Reason                          |
|------------|-------------|------------------|---------------------------------|
| 95:5       | Eventual    | ✅ Cache-Aside   | Read-heavy, simplicity wins     |
| 90:10      | Eventual    | ✅ Cache-Aside   | Still read-heavy                |
| 90:10      | Strong      | ✅ Write-Through | Reads dominate but need consistency |
| 50:50      | Eventual    | ⚠️ Cache-Aside   | Balanced, but reads benefit more |
| 50:50      | Strong      | ⚠️ Write-Through | Balanced, consistency required  |
| 10:90      | Eventual    | ✅ Write-Behind  | Write-heavy, batch to DB        |
| 10:90      | Strong      | ❌ No cache      | Cache can't help strong-consistency writes |

**Your Task:**

Given:
- Social media feed API
- Read/write ratio: 90:10 (read feed, post updates)
- 10,000 RPS total (9,000 reads, 1,000 writes)
- Eventual consistency acceptable (feeds can lag 1-2 seconds)
- Current P99 latency: 450ms (DB bottleneck)

**Which strategy?** ✅ **Cache-Aside**
- Read-heavy (90% reads benefit from cache)
- Eventual consistency is fine
- Simple to implement
- 95% cache hit ratio → P99 drops to 50ms

**Expected Architecture:**
\`\`\`
Client → LB → AppServer → Cache (Redis, cache-aside pattern)
                             ↓
                          Database (PostgreSQL)
\`\`\`

**Cache-Aside Implementation:**
\`\`\`python
def read_post(post_id):
    # 1. Check cache first
    cached = redis.get(f"post:{post_id}")
    if cached:
        return cached  # Cache hit (5ms)

    # 2. Cache miss → read from DB
    post = db.query("SELECT * FROM posts WHERE id = ?", post_id)

    # 3. Write to cache for next time
    redis.set(f"post:{post_id}", post, ttl=300)  # 5-min TTL

    return post  # (380ms)

def update_post(post_id, content):
    # 1. Write to database
    db.execute("UPDATE posts SET content = ? WHERE id = ?", content, post_id)

    # 2. Invalidate cache (delete key)
    redis.delete(f"post:{post_id}")

    # Next read will cache miss and reload from DB
\`\`\`

**Learning Objectives:**
1. Understand the 3 main caching strategies
2. Map consistency requirements to caching patterns
3. Choose strategy based on read/write ratio
4. Know trade-offs: consistency vs latency vs complexity`,

  userFacingFRs: [
    'Social media feed API (read feed, post updates)',
    'Users read feeds (90% of traffic)',
    'Users post updates (10% of traffic)',
  ],

  userFacingNFRs: [
    'Total RPS: 10,000 (9,000 reads, 1,000 writes)',
    'Read/write ratio: 90:10',
    'Consistency: Eventual (1-2 second lag acceptable)',
    'Current P99 latency: 450ms → Target: <100ms',
  ],

  clientDescriptions: [
    {
      name: 'Social Media Client',
      subtitle: '90% reads, 10% writes',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool',
      },
      {
        type: 'cache',
        reason: 'Redis with cache-aside pattern (lazy loading)',
      },
      {
        type: 'storage',
        reason: 'PostgreSQL (source of truth)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute traffic',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Check cache first (cache-aside read)',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Cache miss → read from database',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-caching-strategies', problemConfigs['nfr-ch0-caching-strategies'] || {
    baseRps: 10000,
    readRatio: 0.90,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Implement cache-aside for read-heavy workload',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Cache Layer for Read-Heavy Workload',
      validate: (graph, scenario, problem) => {
        const cacheNodes = graph.components.filter(n => n.type === 'cache');

        if (cacheNodes.length === 0) {
          return {
            valid: false,
            hint: 'For 90% read workload with P99=450ms, add cache layer. Cache-aside pattern is best for read-heavy + eventual consistency.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'Cache-Aside Pattern: AppServer → Cache → Database',
      validate: (graph, scenario, problem) => {
        const cacheNodes = graph.components.filter(n => n.type === 'cache');
        const computeNodes = graph.components.filter(n => n.type === 'compute');
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (cacheNodes.length === 0) return { valid: true };

        const computeToCache = graph.connections.some(
          c => computeNodes.some(comp => comp.id === c.from) &&
               cacheNodes.some(cache => cache.id === c.to)
        );

        const cacheToStorage = graph.connections.some(
          c => cacheNodes.some(cache => cache.id === c.from) &&
               storageNodes.some(db => db.id === c.to)
        );

        if (!computeToCache || !cacheToStorage) {
          return {
            valid: false,
            hint: 'Cache-aside pattern: AppServer checks cache first, then reads from DB on miss. Flow: AppServer → Cache → Database.',
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 9: Replication Patterns - Single-Leader, Multi-Leader, Leaderless
 *
 * Teaches:
 * - Database replication strategies and trade-offs
 * - Single-leader with read replicas (most common)
 * - Multi-leader replication for multi-region writes
 * - Leaderless replication for high availability
 * - CAP theorem implications
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer → Database (single instance)
 * 2. Problem: Database is bottleneck for reads
 * 3. Ask: Can reads tolerate eventual consistency?
 * 4. Solution: Add read replicas (single-leader replication)
 */
export const replicationPatternsProblem: ProblemDefinition = {
  id: 'nfr-ch0-replication-patterns',
  title: 'Replication Patterns: Single-Leader vs Multi-Leader vs Leaderless',
  description: `You've added caching (Module 3 Problem 3) to speed up reads. But your database is STILL a bottleneck. You need replication, but WHICH pattern?

**The Scenario:**
- E-commerce API with 50,000 RPS
- Read/write ratio: 95:5 (47,500 reads, 2,500 writes)
- Single PostgreSQL database is overloaded
- Cache helps, but database read load is still too high
- Need: Database replication to scale reads

**Three Replication Patterns:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**1. Single-Leader with Read Replicas** - Most Common (95% of use cases)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Architecture:**
\`\`\`
AppServer (Writes) → Primary DB (Leader)
                         │
                         ├─(async replication)─> Read Replica 1
                         ├─(async replication)─> Read Replica 2
                         └─(async replication)─> Read Replica 3

AppServer (Reads)  → Load Balancer → [Read Replica 1, 2, 3]
\`\`\`

**How It Works:**
1. **Writes:** All writes go to primary DB (leader)
2. **Replication:** Primary asynchronously replicates to read replicas (lag: 100ms-1s)
3. **Reads:** Reads load-balanced across read replicas
4. **Consistency:** Eventual consistency (replicas lag behind primary)

**Pros:**
✅ Scales reads horizontally (add more replicas)
✅ Simple (built into PostgreSQL, MySQL, MongoDB)
✅ Strong consistency for writes (single leader)
✅ Replicas can be in different regions (low-latency reads)

**Cons:**
❌ Replication lag (100ms-1s) → stale reads
❌ Writes don't scale (single primary bottleneck)
❌ If primary fails, need failover (elect new leader)

**When to Use:**
- Read-heavy workloads (>80% reads)
- Eventual consistency acceptable for reads
- Single-region writes, multi-region reads
- **Example:** E-commerce, social media, news sites, dashboards

**Read-After-Write Consistency:**
Problem: User writes data, immediately reads → sees old data (replica lag)
\`\`\`python
# Solution 1: Read from primary after write (for that user)
def update_profile(user_id, data):
    primary_db.write(user_id, data)
    return primary_db.read(user_id)  # Read from primary, not replica

# Solution 2: Track write timestamp, read from caught-up replica
def update_profile(user_id, data):
    timestamp = primary_db.write(user_id, data)
    redis.set(f"user:{user_id}:last_write", timestamp)

def get_profile(user_id):
    last_write = redis.get(f"user:{user_id}:last_write")
    return read_replica.read(user_id, min_timestamp=last_write)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**2. Multi-Leader Replication** - Multi-Region Writes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Architecture:**
\`\`\`
US Region:
  AppServer → Leader 1 (accepts writes)
                  ↓
             (replicate to EU Leader)

EU Region:
  AppServer → Leader 2 (accepts writes)
                  ↓
             (replicate to US Leader)

Both leaders replicate to each other
\`\`\`

**How It Works:**
1. **Writes:** Each region has its own leader (accepts writes locally)
2. **Replication:** Leaders replicate to each other asynchronously
3. **Reads:** Read from local leader (low latency)
4. **Conflicts:** Must resolve write conflicts (Last-Write-Wins, CRDTs, manual resolution)

**Pros:**
✅ Low-latency writes in multiple regions
✅ Fault-tolerant (if one region fails, others continue)
✅ Scales writes geographically

**Cons:**
❌ Write conflicts (two users update same row in different regions)
❌ Complex conflict resolution
❌ Data loss possible (if leaders diverge)
❌ Harder to reason about consistency

**When to Use:**
- Multi-region writes required (global app)
- Low write latency > strong consistency
- Writes are independent (e.g., different user accounts)
- **Example:** Google Docs (multi-user editing), CRM systems, collaborative tools

**Conflict Example:**
\`\`\`
12:00:00 - User A (US) updates product price: $100 → $120
12:00:01 - User B (EU) updates product price: $100 → $110
12:00:02 - Replication happens
Result: CONFLICT! Price is $120 in US, $110 in EU

Resolution strategies:
1. Last-Write-Wins (LWW): Use timestamp → $110 wins (but loses $120 update!)
2. Application logic: Merge both updates (average? max? alert admin?)
3. CRDT (Conflict-free Replicated Data Type): Automatically merge
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**3. Leaderless Replication (Quorum)** - Cassandra, DynamoDB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Architecture:**
\`\`\`
AppServer → [Node 1, Node 2, Node 3, Node 4, Node 5]
             (write to 3/5 nodes, read from 2/5 nodes)

Quorum:
- Replication factor (N): 5 nodes
- Write quorum (W): 3 (write succeeds if 3 nodes acknowledge)
- Read quorum (R): 2 (read from 2 nodes, return latest version)
- Guarantee: W + R > N → strong consistency
\`\`\`

**How It Works:**
1. **Writes:** Client writes to W nodes in parallel
2. **Success:** Write succeeds if W nodes acknowledge
3. **Reads:** Client reads from R nodes in parallel
4. **Consistency:** Return latest version (based on timestamp)

**Pros:**
✅ No single point of failure (no leader)
✅ High availability (can tolerate N-W node failures for writes)
✅ Tunable consistency (adjust W and R)

**Cons:**
❌ Read latency (must query multiple nodes)
❌ Write conflicts still possible (need versioning, LWW)
❌ Complex operations (no transactions, joins)

**When to Use:**
- High availability > strong consistency
- Can tolerate eventual consistency
- Need fault tolerance (datacenter failures)
- **Example:** Session stores, shopping carts, IoT telemetry, time-series data

**Tuning Consistency:**
\`\`\`
Strong consistency:     W=3, R=3, N=5 (W+R > N) → always see latest
Eventual consistency:   W=1, R=1, N=5 (fast but stale reads possible)
Balanced:              W=2, R=2, N=5 (some staleness, but faster)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Decision Matrix:**

| Use Case                        | Pattern         | Why?                                  |
|---------------------------------|-----------------|---------------------------------------|
| Read-heavy, single region       | ✅ Single-Leader | Simple, scales reads                 |
| Read-heavy, multi-region reads  | ✅ Single-Leader | Replicas in each region              |
| Write-heavy, multi-region       | ✅ Multi-Leader  | Low write latency everywhere         |
| High availability critical      | ✅ Leaderless    | No single point of failure           |
| Strong consistency required     | ✅ Single-Leader | One source of truth                  |
| Eventual consistency OK         | ⚠️ Any          | Choose based on other factors        |

**Your Task:**

Given:
- E-commerce product catalog
- 50,000 RPS (47,500 reads, 2,500 writes)
- Single region (US-East)
- Database overloaded (even with cache)
- Eventual consistency acceptable

**Which pattern?** ✅ **Single-Leader with Read Replicas**
- Read-heavy (95% reads)
- Single region (don't need multi-leader)
- Eventual consistency is fine (product catalog can lag 1s)
- Simple to implement (PostgreSQL built-in)

**Expected Architecture:**
\`\`\`
Client → LB → AppServer → Cache (Redis)
                            ↓
                         Primary DB (writes)
                            ↓
                    ┌───────┼───────┐
                    ▼       ▼       ▼
              Replica 1  Replica 2  Replica 3 (reads load-balanced)
\`\`\`

**Learning Objectives:**
1. Understand the 3 main replication patterns
2. Map consistency and latency requirements to replication strategy
3. Know trade-offs: availability vs consistency vs complexity
4. Handle replication lag (read-after-write consistency)`,

  userFacingFRs: [
    'E-commerce product catalog (browse, search, purchase)',
    'Users browse products (95% reads)',
    'Merchants update inventory (5% writes)',
  ],

  userFacingNFRs: [
    'Total RPS: 50,000 (47,500 reads, 2,500 writes)',
    'Read/write ratio: 95:5',
    'Single region: US-East',
    'Consistency: Eventual (1s replication lag acceptable)',
    'Availability: 99.9% (need fault tolerance)',
  ],

  clientDescriptions: [
    {
      name: 'User Client',
      subtitle: 'Browse products',
      id: 'user_client',
    },
    {
      name: 'Merchant Client',
      subtitle: 'Update inventory',
      id: 'merchant_client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool',
      },
      {
        type: 'cache',
        reason: 'Redis for hot data (reduces DB load)',
      },
      {
        type: 'storage',
        reason: 'Primary DB + Read Replicas (PostgreSQL with replication). Need multiple storage nodes for replication.',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute traffic',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Check cache first',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Cache miss → read from database replicas',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-replication-patterns', problemConfigs['nfr-ch0-replication-patterns'] || {
    baseRps: 50000,
    readRatio: 0.95,
    maxLatency: 200,
    availability: 0.999,
  }, [
    'Scale reads with single-leader replication',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Multiple Database Instances',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length < 2) {
          return {
            valid: false,
            hint: 'For 47,500 read RPS, single database is overloaded. Add read replicas (single-leader replication). Deploy at least 1 primary + 3 read replicas.',
          };
        }

        return {
          valid: true,
          details: {
            storageNodes: storageNodes.length,
            pattern: 'Single-leader with read replicas',
          },
        };
      },
    },
    {
      name: 'Read Replicas for Read-Heavy Workload',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        // For 47.5k read RPS, need enough replicas
        // Assume each replica can handle ~10k reads/sec
        const readRps = 47500;
        const readsPerReplica = 10000;
        const replicasNeeded = Math.ceil(readRps / readsPerReplica); // ~5 replicas

        if (storageNodes.length < replicasNeeded) {
          return {
            valid: false,
            hint: \`Read-heavy workload (47.5k read RPS) needs \${replicasNeeded} read replicas at 10k reads/sec each. You have \${storageNodes.length} database nodes. Add more replicas.\`,
          };
        }

        return { valid: true };
      },
    },
  ],
};

// ============================================================================
// Module 4: Data Durability & Persistence (RISKIEST Axis)
// ============================================================================

/**
 * Problem 10: When to Add a Database - Durability Requirement Analysis
 *
 * Teaches:
 * - When in-memory data is acceptable vs when persistence is required
 * - Impact of data loss on user experience and business
 * - Recovery Point Objective (RPO) and Recovery Time Objective (RTO)
 * - Starting with Client → AppServer (NO DATABASE) and adding DB only when needed
 *
 * Learning Flow:
 * 1. Start: Client → LB → AppServer (in-memory only)
 * 2. Ask: What happens if your server crashes?
 * 3. Analyze: Can you afford to lose this data?
 * 4. Decision: Add database only if data loss is unacceptable
 */
export const durabilityRequirementProblem: ProblemDefinition = {
  id: 'nfr-ch0-durability-requirement',
  title: 'Data Durability: When to Add a Database',
  description: `You're building a web application. Every tutorial says "add a database," but WHY? Let's think about durability requirements first.

**The NFR Framework - RISKIEST Axis:**
- **Slowest:** Latency (covered in Module 3)
- **RISKIEST:** What happens if we LOSE data?
- **Largest:** Dataset size (covered in Module 1)

**Starting Point: No Database!**
\`\`\`
Client → Load Balancer → AppServer Pool (in-memory only)
\`\`\`

Your AppServers store all data in memory (RAM):
- User sessions: HashMap<userId, sessionData>
- Cache: HashMap<key, value>
- Metrics: counters, gauges in memory

**The Question: What Happens If a Server Crashes?**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Scenario 1: View Counter (Data Loss = Acceptable)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: Article view counter (how many times an article was viewed)

**What Happens If Server Crashes?**
- In-memory counters are lost
- Counter resets to 0
- Impact: Minor inaccuracy in view count

**Impact Analysis:**
- ❓ Is it critical to product experience? **NO** - Users don't care if count is 100% accurate
- ❓ Is it a security issue? **NO**
- ❓ Must we reconstruct on loss? **NO** - Can rebuild from scratch
- ❓ How long do we keep it? **Forever, but accuracy doesn't matter**

**Decision:** ✅ **In-memory is fine, NO DATABASE needed**
- Save cost (no DB to maintain)
- Faster (no disk I/O)
- Simpler architecture

**Architecture:**
\`\`\`
Client → LB → AppServer (in-memory counters)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Scenario 2: User Sessions (Data Loss = Annoying)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: User login sessions (who is logged in)

**What Happens If Server Crashes?**
- In-memory sessions are lost
- Users are logged out
- Must re-login

**Impact Analysis:**
- ❓ Is it critical to product experience? **ANNOYING** - Users hate re-logging in
- ❓ Is it a security issue? **Moderate** - Could be session hijacking vector
- ❓ Must we reconstruct on loss? **NO** - Users can re-login
- ❓ How long do we keep it? **30 minutes - 7 days**

**Decision:** ⚠️ **In-memory with session store (Redis, Memcached)**
- Use persistent cache (Redis with AOF/RDB snapshots)
- Not a full database (overkill for ephemeral data)
- TTL = session expiry (auto-cleanup)

**Architecture:**
\`\`\`
Client → LB → AppServer → Redis (persistent cache, session store)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Scenario 3: E-commerce Orders (Data Loss = UNACCEPTABLE)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: Customer orders (purchase history, payments)

**What Happens If Server Crashes?**
- In-memory orders are lost
- Customer paid but order is gone
- Revenue loss, legal liability

**Impact Analysis:**
- ❓ Is it critical to product experience? **YES** - Customers lose their purchases
- ❓ Is it a security issue? **YES** - Financial transactions, PCI compliance
- ❓ Must we reconstruct on loss? **YES** - Legal requirement (financial records)
- ❓ How long do we keep it? **7 years** (tax/legal compliance)

**Decision:** ❌ **MUST HAVE DATABASE**
- PostgreSQL, MySQL (ACID transactions)
- Durability guarantees (fsync, WAL)
- Backup and disaster recovery

**Architecture:**
\`\`\`
Client → LB → AppServer → PostgreSQL (durable storage)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Decision Matrix: When to Add a Database?**

| Data Type           | Loss Impact       | Security Risk | Must Reconstruct? | Database Needed? |
|---------------------|-------------------|---------------|-------------------|------------------|
| View counters       | Negligible        | No            | No                | ❌ In-memory     |
| Page views analytics| Low               | No            | No (approximate)  | ⚠️ Time-series DB|
| User sessions       | Annoying          | Moderate      | No (can re-login) | ⚠️ Redis/Memcached|
| Shopping cart       | Moderate          | Low           | Annoying          | ⚠️ Redis (persist)|
| User profiles       | High              | Moderate      | Yes (backup)      | ✅ Database      |
| Financial txns      | Critical          | High          | Yes (legal)       | ✅ Database + WAL|
| Medical records     | Critical          | Critical      | Yes (HIPAA)       | ✅ Database + encryption|

**Your Task:**

You're building a **URL shortener** service (like bit.ly):
- Users submit long URLs → get back short codes
- Example: \`https://example.com/very/long/url\` → \`short.ly/abc123\`
- Visitors click short links → redirect to original URL

**Durability Analysis:**
- What happens if you lose the URL mapping?
- Impact: All short links break (404 errors)
- Security: No PII, but reputation damage
- Must reconstruct? **YES** - Users shared these links everywhere
- How long to keep? **Forever** (links should never expire)

**Decision:** ✅ **Database Required**

**Expected Architecture:**
\`\`\`
Client → Load Balancer → AppServer Pool → Database (PostgreSQL)
                                             ↓
                                          Store: (short_code, long_url)
\`\`\`

**Learning Objectives:**
1. Start with in-memory, add database ONLY when durability is required
2. Analyze data loss impact (product experience, security, legal)
3. Understand RPO (Recovery Point Objective): How much data loss is acceptable?
4. Understand RTO (Recovery Time Objective): How fast must we recover?
5. Choose storage based on durability requirements, not habit`,

  userFacingFRs: [
    'Users can create short URLs',
    'Users can access short URLs (redirect to original)',
    'Short URLs should never expire',
  ],

  userFacingNFRs: [
    'Data loss is UNACCEPTABLE (shared links must work forever)',
    'Recovery Point Objective (RPO): 0 seconds (no data loss)',
    'Recovery Time Objective (RTO): < 5 minutes (failover)',
    'Data retention: Forever (links never expire)',
  ],

  clientDescriptions: [
    {
      name: 'URL Creator',
      subtitle: 'Create short URLs',
      id: 'creator_client',
    },
    {
      name: 'URL Visitor',
      subtitle: 'Click short URLs',
      id: 'visitor_client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool',
      },
      {
        type: 'storage',
        reason: 'Database REQUIRED for durability. URL mappings must survive server crashes. Data loss is unacceptable.',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute traffic',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Persist URL mappings (short_code → long_url)',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-durability-requirement', problemConfigs['nfr-ch0-durability-requirement'] || {
    baseRps: 5000,
    readRatio: 0.95, // Mostly redirects (reads), few creates (writes)
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Ensure URL mappings survive server crashes',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Database Required for Durability',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length === 0) {
          return {
            valid: false,
            hint: 'URL mappings must survive crashes. If you lose the mapping, all short links break (404s). This is UNACCEPTABLE. Add a database for durability.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'Direct AppServer to Database Connection',
      validate: (graph, scenario, problem) => {
        const computeNodes = graph.components.filter(n => n.type === 'compute');
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length === 0) return { valid: true }; // Skip if no storage

        const computeToStorage = graph.connections.some(
          c => computeNodes.some(comp => comp.id === c.from) &&
               storageNodes.some(db => db.id === c.to)
        );

        if (!computeToStorage) {
          return {
            valid: false,
            hint: 'AppServers must connect to database to persist URL mappings. Flow: AppServer → Database.',
          };
        }

        return { valid: true };
      },
    },
  ],
};

/**
 * Problem 11: Durability Levels - fsync, WAL, Replication Trade-offs
 *
 * Teaches:
 * - Different levels of durability guarantees
 * - Write-Ahead Log (WAL) for crash recovery
 * - fsync trade-offs (durability vs latency)
 * - Replication for disaster recovery
 * - RPO and RTO requirements
 *
 * Learning Flow:
 * 1. You've decided you need a database (from Problem 10)
 * 2. Ask: How durable does it need to be?
 * 3. Trade-off: Durability vs Performance
 * 4. Solution: Choose durability level based on data criticality
 */
export const durabilityLevelsProblem: ProblemDefinition = {
  id: 'nfr-ch0-durability-levels',
  title: 'Durability Levels: fsync, WAL, and Replication Trade-offs',
  description: `You've added a database (from Module 4 Problem 1). But databases have DIFFERENT durability levels. Which level do you need?

**The Durability Spectrum:**
\`\`\`
Faster ←────────────────────────────────────→ More Durable
        (higher data loss risk)              (lower data loss risk)

Level 0: In-memory only (0% durable)
Level 1: Async writes to disk (99% durable)
Level 2: fsync on commit (99.99% durable)
Level 3: WAL + fsync (99.999% durable)
Level 4: Replication to 2+ servers (99.9999% durable)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 1: Async Writes (Fastest, Least Durable)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
1. Client writes data to database
2. Database writes to page cache (RAM)
3. Database returns "success" immediately
4. OS flushes to disk "eventually" (every 30s)
\`\`\`

**Performance:**
- Write latency: **1-5ms** (in-memory)
- Throughput: **50,000 writes/sec**

**Durability:**
- RPO (data loss): **Up to 30 seconds** (unflushed data)
- What if server crashes? Lose last 30s of writes

**When to Use:**
- Analytics, logs, metrics (approximate data OK)
- Gaming leaderboards (can rebuild)
- Session data (users can re-login)

**Example (PostgreSQL):**
\`\`\`sql
-- Turn off fsync (NOT RECOMMENDED FOR PRODUCTION!)
ALTER SYSTEM SET fsync = off;
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 2: fsync on Commit (Balanced)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
1. Client writes data
2. Database writes to page cache
3. Database calls fsync() to force disk write
4. Disk confirms write is on platter
5. Database returns "success"
\`\`\`

**Performance:**
- Write latency: **5-20ms** (disk I/O)
- Throughput: **3,000-5,000 writes/sec** (disk-bound)

**Durability:**
- RPO: **0 seconds** (every commit is on disk)
- What if server crashes? No data loss (last commit is safe)

**When to Use:**
- E-commerce orders, payments
- User profiles, account settings
- **Most production databases use this by default**

**Example (PostgreSQL):**
\`\`\`sql
-- fsync = on (default)
BEGIN;
  INSERT INTO orders VALUES (...);
COMMIT;  -- Waits for disk fsync before returning
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 3: Write-Ahead Log (WAL) + fsync (More Durable)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
1. Client writes data
2. Database writes to WAL (append-only log)
3. Database fsyncs WAL to disk
4. Database returns "success"
5. Later: Background process applies WAL to data files
\`\`\`

**Why WAL?**
- Faster: Append-only sequential writes (vs random writes to data pages)
- Crash recovery: Replay WAL to reconstruct state
- Point-in-time recovery: WAL archive = full history

**Performance:**
- Write latency: **3-10ms** (sequential disk write)
- Throughput: **10,000 writes/sec**

**Durability:**
- RPO: **0 seconds** (WAL persisted)
- Crash recovery: Replay WAL (RTO = 30s-5min)

**When to Use:**
- Financial transactions (need audit log)
- Compliance (SOX, HIPAA require WAL archiving)
- Disaster recovery (can rebuild from WAL)

**Example (PostgreSQL):**
\`\`\`sql
-- WAL enabled by default
-- Archive WAL for point-in-time recovery
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /backup/wal/%f';
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 4: Synchronous Replication (Highest Durability)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
1. Client writes data
2. Primary DB writes to WAL + fsync
3. Primary replicates to 2 replicas (sync)
4. Both replicas fsync WAL
5. Primary returns "success" (all 3 have data)
\`\`\`

**Performance:**
- Write latency: **10-50ms** (network + 2× disk I/O)
- Throughput: **1,000-3,000 writes/sec**

**Durability:**
- RPO: **0 seconds** (data on 3 servers)
- RTO: **< 1 minute** (automatic failover to replica)
- Survives: Data center failure

**When to Use:**
- Banking, payment processing
- Medical records (HIPAA)
- Any zero-data-loss requirement

**Example (PostgreSQL):**
\`\`\`sql
-- Require 2 synchronous replicas before commit
ALTER SYSTEM SET synchronous_commit = 'on';
ALTER SYSTEM SET synchronous_standby_names = 'replica1,replica2';
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Trade-off Matrix:**

| Level | Write Latency | Throughput | RPO        | RTO       | Use Case                  |
|-------|---------------|------------|------------|-----------|---------------------------|
| 1     | 1-5ms         | 50k/sec    | 30 seconds | Hours     | Logs, analytics           |
| 2     | 5-20ms        | 5k/sec     | 0 seconds  | 30min     | E-commerce, SaaS          |
| 3     | 3-10ms        | 10k/sec    | 0 seconds  | 5min      | Financial, compliance     |
| 4     | 10-50ms       | 3k/sec     | 0 seconds  | <1min     | Banking, medical          |

**Your Task:**

You're building a **banking application** with these features:
1. Account balance updates (deposits, withdrawals)
2. Transaction history
3. Regulatory compliance (must keep records for 7 years)

**Requirements:**
- Data loss is **COMPLETELY UNACCEPTABLE** (customer money!)
- Compliance: Must survive data center failure
- RTO: < 1 minute (customers can't access money = emergency)
- RPO: 0 seconds (even 1 second of data loss = lost money)

**Which durability level?** Level 4: Synchronous Replication

**Expected Architecture:**
\`\`\`
Client → LB → AppServer → Primary DB (fsync + WAL)
                              ├─(sync repl)─> Replica 1 (same region)
                              └─(sync repl)─> Replica 2 (different region)
\`\`\`

**Learning Objectives:**
1. Understand durability trade-offs (performance vs data safety)
2. Know when to use fsync, WAL, replication
3. Map RPO/RTO requirements to durability level
4. Choose appropriate level based on data criticality`,

  userFacingFRs: [
    'Users can deposit/withdraw money',
    'Users can view transaction history',
    'System must survive data center failures',
  ],

  userFacingNFRs: [
    'RPO: 0 seconds (zero data loss acceptable)',
    'RTO: < 1 minute (automatic failover)',
    'Durability: Must survive data center failure',
    'Compliance: 7-year audit trail (WAL archiving)',
  ],

  clientDescriptions: [
    {
      name: 'Banking Client',
      subtitle: 'Deposits & withdrawals',
      id: 'client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool',
      },
      {
        type: 'storage',
        reason: 'Primary + Replicas (PostgreSQL with sync replication). Need multiple storage nodes for zero data loss.',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Entry point',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute traffic',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'AppServer writes to primary DB (synchronous replication to replicas)',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-durability-levels', problemConfigs['nfr-ch0-durability-levels'] || {
    baseRps: 2000,
    readRatio: 0.7, // 70% reads (check balance), 30% writes (transactions)
    maxLatency: 100,
    availability: 0.9999, // 99.99% uptime
  }, [
    'Zero data loss with synchronous replication',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Multiple Storage Nodes for Replication',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length < 2) {
          return {
            valid: false,
            hint: 'Banking requires zero data loss. Single database = single point of failure. Add synchronous replication (primary + at least 2 replicas).',
          };
        }

        return {
          valid: true,
          details: {
            storageNodes: storageNodes.length,
            durabilityLevel: 'Level 4: Synchronous Replication',
          },
        };
      },
    },
    {
      name: 'Sufficient Replicas for Data Center Failure',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        // For data center failure, need at least 3 nodes (1 primary + 2 replicas)
        if (storageNodes.length < 3) {
          return {
            valid: false,
            hint: 'To survive data center failure, need at least 3 storage nodes (1 primary + 2 sync replicas in different regions). You have ${storageNodes.length} nodes.',
          };
        }

        return { valid: true };
      },
    },
  ],
};

// Export all Chapter 0 problems
export const nfrTeachingChapter0Problems = [
  // Module 1: Throughput & Horizontal Scaling (4 problems)
  throughputCalculationProblem,
  peakVsAverageProblem,
  readWriteRatioProblem,
  autoscalingProblem,
  // Module 2: Burst Handling & Write Queues (2 problems)
  burstQpsProblem,
  writeQueueBatchingProblem,
  // Module 3: Latency - Request-Response & Data Processing (4 problems)
  requestResponseLatencyProblem,
  dataProcessingLatencyProblem,
  cachingStrategiesProblem,
  replicationPatternsProblem,
  // Module 4: Data Durability & Persistence (2 problems)
  durabilityRequirementProblem,
  durabilityLevelsProblem,
];
