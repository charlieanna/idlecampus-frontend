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
 * Problem 3: Autoscaling - Dynamic Capacity Adjustment
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
// Module 2: Latency - Request-Response & Data Processing
// ============================================================================

/**
 * Problem 4: Request-Response Latency - Understanding P99 and Percentiles
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

// Export all Chapter 0 problems
export const nfrTeachingChapter0Problems = [
  // Module 1: Throughput & Horizontal Scaling
  throughputCalculationProblem,
  peakVsAverageProblem,
  autoscalingProblem,
  // Module 2: Latency (Request-Response & Data Processing)
  requestResponseLatencyProblem,
  dataProcessingLatencyProblem,
];
