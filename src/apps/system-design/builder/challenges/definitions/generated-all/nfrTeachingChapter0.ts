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

// Export all Chapter 0 problems
export const nfrTeachingChapter0Problems = [
  throughputCalculationProblem,
  peakVsAverageProblem,
  autoscalingProblem,
];
