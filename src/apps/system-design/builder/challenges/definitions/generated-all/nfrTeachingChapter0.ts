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

  wizardFlow: {
    enabled: true,
    title: 'Server Capacity Planning',
    subtitle: 'Learn to calculate servers from throughput (RPS)',

    objectives: [
      'Calculate server capacity accounting for OS overhead',
      'Design for PEAK load, not average load',
      'Understand when horizontal scaling is needed',
      'Learn why load balancers are essential for multi-server architectures',
    ],

    questions: [
      {
        id: 'avg_rps',
        step: 1,
        category: 'throughput',
        title: 'What is your average traffic?',
        description: 'This is the FIRST question we always ask! Traffic determines our baseline capacity needs.',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter average RPS',
          unit: 'RPS',
          min: 100,
          max: 1000000,
          suggestedValue: 2000,
        },
        whyItMatters: 'Average RPS tells us the steady-state load. However, we NEVER design just for average - that would cause failures during peak hours! This is just our starting point.',
        commonMistakes: [
          'Designing only for average load (causes peak-hour failures)',
          'Forgetting to account for OS overhead (30% capacity loss)',
          'Not planning for growth (always add 20-30% buffer)',
        ],
        onAnswer: (answer) => {
          return [
            {
              action: 'highlight',
              reason: `Your API receives ${answer} requests per second on average. But we need to know about peak traffic too!`,
            },
          ];
        },
      },
      {
        id: 'peak_rps',
        step: 2,
        category: 'throughput',
        title: 'What is your PEAK traffic?',
        description: 'Peak traffic occurs during busy hours (e.g., morning commute, lunch, Black Friday). We MUST design for peak, not average.',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter peak RPS',
          unit: 'RPS',
          min: 100,
          max: 1000000,
          suggestedValue: 10000,
        },
        whyItMatters: 'Peak load determines your server count. If you design for average and peak is 5× higher, your service will crash during busy hours. Always design for peak with 20% buffer!',
        commonMistakes: [
          'Using average RPS for capacity planning',
          'Peak is typically 2-10× average (depends on your service)',
        ],
        onAnswer: (answer, previousAnswers) => {
          const avgRps = previousAnswers.avg_rps || 2000;
          const peakMultiplier = (answer / avgRps).toFixed(1);
          return [
            {
              action: 'highlight',
              reason: `Peak traffic is ${answer} RPS (${peakMultiplier}× average). This is what we'll design for!`,
            },
          ];
        },
      },
      {
        id: 'server_capacity',
        step: 3,
        category: 'throughput',
        title: 'Capacity Calculation',
        description: 'Each server can theoretically handle 2,000 RPS. But we need to account for OS overhead!',
        questionType: 'calculation',
        calculation: {
          formula: 'Effective Capacity = Theoretical Capacity × 0.7',
          explanation: 'Why 30% overhead? Operating system (15%), health checks (5%), network I/O (5%), GC pauses (5%).',
          exampleInputs: {
            'Theoretical Capacity': 2000,
            'OS Overhead': 0.3,
          },
          exampleOutput: '2,000 × 0.7 = 1,400 RPS per server',
        },
        whyItMatters: 'OS overhead is REAL! If you design assuming 100% capacity, servers will be overloaded at 70% theoretical load. Always account for 30% overhead in production systems.',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Each server can handle 1,400 RPS effectively (2,000 theoretical - 30% overhead).',
            },
          ];
        },
      },
      {
        id: 'calculate_servers',
        step: 4,
        category: 'throughput',
        title: 'How many servers do you need?',
        description: 'Calculate based on peak RPS and effective capacity per server.',
        questionType: 'calculation',
        calculation: {
          formula: 'Servers Needed = Peak RPS / (Server Capacity × 0.7)',
          explanation: 'We divide peak load by effective capacity, then round UP for safety.',
          exampleInputs: {
            'Peak RPS': 10000,
            'Server Capacity': 2000,
            'Effective Capacity': 1400,
          },
          exampleOutput: '10,000 / 1,400 = 7.14 → 8 servers (round up)',
        },
        whyItMatters: 'Always round UP, never down! 7.14 servers means you need 8. Running at 100% capacity leaves no room for failures or traffic spikes.',
        commonMistakes: [
          'Rounding down (causes overload)',
          'Not adding buffer for growth',
        ],
        onAnswer: (answer, previousAnswers) => {
          const peakRps = previousAnswers.peak_rps || 10000;
          const serversNeeded = Math.ceil(peakRps / 1400);
          return [
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: serversNeeded },
              reason: `Adding ${serversNeeded} app servers to handle ${peakRps} peak RPS with 30% overhead buffer.`,
            },
          ];
        },
      },
      {
        id: 'need_load_balancer',
        step: 5,
        category: 'throughput',
        title: 'Do you need a load balancer?',
        description: 'You have 8 app servers. How does traffic get distributed across them?',
        questionType: 'single_choice',
        options: [
          {
            id: 'yes',
            label: 'Yes, add a load balancer',
            description: 'Load balancer distributes traffic across all 8 servers',
            consequence: 'Load balancer will route requests evenly across servers using round-robin or least-connections algorithm.',
          },
          {
            id: 'no',
            label: 'No, clients connect directly',
            description: 'Each client picks a random server',
            consequence: '⚠️ Without LB, you cannot guarantee even distribution. Some servers will be overloaded while others idle.',
          },
        ],
        whyItMatters: 'Load balancers are ESSENTIAL for horizontal scaling. They provide: 1) Even traffic distribution, 2) Health checking (route away from failed servers), 3) Single entry point for clients.',
        commonMistakes: [
          'Thinking DNS round-robin is sufficient (it has 60s+ caching)',
          'Client-side load balancing (adds complexity, not recommended)',
        ],
        onAnswer: (answer) => {
          if (answer === 'yes') {
            return [
              {
                action: 'add_component',
                componentType: 'load_balancer',
                reason: 'Load balancer distributes 10k peak RPS evenly across 8 app servers.',
              },
              {
                action: 'add_connection',
                from: 'client',
                to: 'load_balancer',
                reason: 'All client traffic goes through load balancer first.',
              },
              {
                action: 'add_connection',
                from: 'load_balancer',
                to: 'compute',
                reason: 'Load balancer distributes to app server pool.',
              },
            ];
          } else {
            return [
              {
                action: 'highlight',
                reason: '⚠️ Without a load balancer, traffic distribution will be uneven and you cannot handle server failures gracefully. Reconsider!',
              },
            ];
          }
        },
      },
    ],

    summary: {
      title: 'Server Capacity Planning Complete!',
      keyTakeaways: [
        'Always design for PEAK load, not average load',
        'Account for 30% OS overhead (effective capacity = theoretical × 0.7)',
        'Round UP when calculating server count (safety buffer)',
        'Load balancers are essential for horizontal scaling (>1 server)',
        'Formula: Servers = Peak RPS / (Single Server Capacity × 0.7)',
      ],
      nextSteps: 'Now that you understand throughput calculation, try the next problem: Peak vs Average Load Planning!',
    },
  },
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

  wizardFlow: {
    enabled: true,
    title: 'Peak vs Average Load Planning',
    subtitle: 'Learn why you must ALWAYS design for peak, not average',

    objectives: [
      'Understand traffic patterns (average, daily peak, weekend peak)',
      'Calculate the cost of under-provisioning',
      'Learn the difference between static and autoscaling approaches',
      'Design for worst-case, not typical case',
    ],

    questions: [
      {
        id: 'avg_load',
        step: 1,
        category: 'throughput',
        title: 'What is your average load?',
        description: 'Your e-commerce API handles steady traffic most of the day.',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter average RPS',
          unit: 'RPS',
          min: 100,
          max: 100000,
          suggestedValue: 1000,
        },
        whyItMatters: 'Average load tells us the baseline. But here\'s the trap: many engineers provision for average and then wonder why their service crashes during lunch hour!',
        commonMistakes: [
          'Provisioning only for average load (causes peak-hour failures)',
          'Not measuring traffic patterns over a full week/month',
        ],
        onAnswer: (answer) => {
          return [
            {
              action: 'highlight',
              reason: `Average load: ${answer} RPS. But wait - what about peak hours?`,
            },
          ];
        },
      },
      {
        id: 'daily_peak',
        step: 2,
        category: 'throughput',
        title: 'What is your daily peak load?',
        description: 'E-commerce sites typically see peak traffic during lunch (12pm-1pm) and evening (7pm-9pm).',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter daily peak RPS',
          unit: 'RPS',
          min: 100,
          max: 100000,
          suggestedValue: 8000,
        },
        whyItMatters: 'Daily peaks are predictable and recurring. Your service MUST handle this load every single day, or you lose customers during your busiest hours.',
        commonMistakes: [
          'Thinking autoscaling will save you (it has 2-3 min lag)',
          'Not planning for daily peaks (only thinking about average)',
        ],
        onAnswer: (answer, previousAnswers) => {
          const avg = previousAnswers.avg_load || 1000;
          const multiplier = (answer / avg).toFixed(1);
          return [
            {
              action: 'highlight',
              reason: `Daily peak is ${answer} RPS (${multiplier}× average). This happens EVERY day at lunch!`,
            },
          ];
        },
      },
      {
        id: 'weekend_peak',
        step: 3,
        category: 'throughput',
        title: 'What about weekend flash sales?',
        description: 'Your marketing team runs flash sales every Saturday morning. Traffic can spike 10-15× normal.',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter weekend peak RPS',
          unit: 'RPS',
          min: 100,
          max: 100000,
          suggestedValue: 15000,
        },
        whyItMatters: 'Weekend peaks and flash sales are your TRUE worst-case scenario. You must design for the absolute peak, or accept losing revenue during high-value sales events.',
        commonMistakes: [
          'Thinking "flash sales only happen once a week, we can afford downtime"',
          'Not testing architecture at peak load before launch',
        ],
        onAnswer: (answer, previousAnswers) => {
          const avg = previousAnswers.avg_load || 1000;
          const multiplier = (answer / avg).toFixed(1);
          return [
            {
              action: 'highlight',
              reason: `Weekend peak: ${answer} RPS (${multiplier}× average). THIS is what you design for!`,
            },
          ];
        },
      },
      {
        id: 'under_provision_scenario',
        step: 4,
        category: 'throughput',
        title: 'What if you provision for average?',
        description: 'Let\'s calculate what happens if you design for average load instead of peak.',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Provision for average (1,000 RPS)',
            recommendation: '1 server ($100/mo)',
            reasoning: 'At 15k RPS weekend peak → 14k requests/sec DROPPED',
          },
          {
            condition: 'Provision for daily peak (8,000 RPS)',
            recommendation: '6 servers ($600/mo)',
            reasoning: 'Weekend flash sale → 7k requests/sec DROPPED',
          },
          {
            condition: 'Provision for weekend peak (15,000 RPS)',
            recommendation: '11 servers ($1,100/mo)',
            reasoning: '✅ Handles all traffic, zero dropped requests',
          },
        ],
        whyItMatters: 'Under-provisioning saves money short-term but costs you MUCH more in lost sales, customer frustration, and reputation damage during your most valuable traffic spikes.',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'You must provision for the HIGHEST peak, or accept dropping requests during high-value events.',
            },
          ];
        },
      },
      {
        id: 'calculate_servers',
        step: 5,
        category: 'throughput',
        title: 'How many servers for weekend peak?',
        description: 'Calculate servers needed for 15,000 RPS weekend peak.',
        questionType: 'calculation',
        calculation: {
          formula: 'Servers = Peak RPS / (Server Capacity × 0.7)',
          explanation: 'Weekend peak is the worst-case. Design for this!',
          exampleInputs: {
            'Weekend Peak RPS': 15000,
            'Server Capacity': 2000,
            'Effective Capacity': 1400,
          },
          exampleOutput: '15,000 / 1,400 = 10.7 → 11 servers',
        },
        whyItMatters: 'You need 11 servers to handle weekend peak. Yes, they\'ll be underutilized most of the time (only 7% utilization at average load), but that\'s the price of reliability.',
        commonMistakes: [
          'Thinking "11 servers is wasteful, let\'s use autoscaling"',
          'Not accounting for autoscaling lag (2-3 minutes)',
        ],
        onAnswer: (answer, previousAnswers) => {
          const peakRps = previousAnswers.weekend_peak || 15000;
          const serversNeeded = Math.ceil(peakRps / 1400);
          return [
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: serversNeeded },
              reason: `Adding ${serversNeeded} app servers to handle ${peakRps} RPS weekend peak.`,
            },
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer to distribute traffic across all servers.',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client sends all requests to LB.',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB distributes to server pool.',
            },
          ];
        },
      },
    ],

    summary: {
      title: 'Peak Load Planning Complete!',
      keyTakeaways: [
        'ALWAYS design for PEAK load, not average load',
        'Traffic patterns: average < daily peak < weekend/event peak',
        'Under-provisioning costs MORE than over-provisioning (lost revenue + reputation)',
        'Autoscaling is NOT a solution for predictable daily peaks (2-3 min lag)',
        'Your servers will be "underutilized" most of the time - that\'s OK!',
      ],
      nextSteps: 'Next problem: Learn how read/write ratio affects capacity planning!',
    },
  },
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

  wizardFlow: {
    enabled: true,
    title: 'Read/Write Ratio Analysis',
    subtitle: 'Learn why reads and writes have asymmetric costs',

    objectives: [
      'Understand read vs write performance characteristics',
      'Calculate server capacity for mixed workloads',
      'Learn why writes are the bottleneck',
      'Know when to add caching vs write queues',
    ],

    questions: [
      {
        id: 'total_rps',
        step: 1,
        category: 'throughput',
        title: 'What is your total traffic?',
        description: 'You\'re building a social media or e-commerce API. Start with total RPS.',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter total RPS',
          unit: 'RPS',
          min: 100,
          max: 100000,
          suggestedValue: 10000,
        },
        whyItMatters: 'Total RPS is the starting point, but it\'s NOT enough! We need to know the read/write split because they have VERY different costs.',
        onAnswer: (answer) => {
          return [
            {
              action: 'highlight',
              reason: `Total traffic: ${answer} RPS. But wait - how many are reads vs writes?`,
            },
          ];
        },
      },
      {
        id: 'read_write_ratio',
        step: 2,
        category: 'throughput',
        title: 'What is your read/write ratio?',
        description: 'Different applications have different read/write patterns.',
        questionType: 'single_choice',
        options: [
          {
            id: 'read_heavy_95_5',
            label: '95% Reads / 5% Writes (Read-Heavy)',
            description: 'E-commerce browsing, social feeds, news sites',
            consequence: 'Bottleneck will be READS (database queries). Solution: Add caching + read replicas.',
          },
          {
            id: 'balanced_50_50',
            label: '50% Reads / 50% Writes (Balanced)',
            description: 'Collaborative tools, messaging apps',
            consequence: 'Both reads and writes matter. Need caching AND write optimization.',
          },
          {
            id: 'write_heavy_10_90',
            label: '10% Reads / 90% Writes (Write-Heavy)',
            description: 'Logging systems, IoT sensors, analytics ingestion',
            consequence: 'Bottleneck will be WRITES (database cannot keep up). Solution: Write queues + batching.',
          },
        ],
        whyItMatters: 'Read/write ratio determines your architecture! Read-heavy → add caching. Write-heavy → add queues.',
        commonMistakes: [
          'Treating all RPS the same (reads are 4× faster than writes)',
          'Not measuring actual read/write ratio in production',
        ],
        onAnswer: (answer, previousAnswers) => {
          const totalRps = previousAnswers.total_rps || 10000;
          let readPercent, writePercent;

          if (answer === 'read_heavy_95_5') {
            readPercent = 0.95;
            writePercent = 0.05;
          } else if (answer === 'balanced_50_50') {
            readPercent = 0.5;
            writePercent = 0.5;
          } else {
            readPercent = 0.1;
            writePercent = 0.9;
          }

          const readRps = Math.round(totalRps * readPercent);
          const writeRps = Math.round(totalRps * writePercent);

          return [
            {
              action: 'highlight',
              reason: `Your workload: ${readRps} read RPS + ${writeRps} write RPS = ${totalRps} total RPS`,
            },
          ];
        },
      },
      {
        id: 'asymmetric_costs',
        step: 3,
        category: 'throughput',
        title: 'Asymmetric Performance',
        description: 'Reads and writes have VERY different performance characteristics:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Read Operations',
            recommendation: '2,000 RPS per server',
            reasoning: 'Can be cached (5ms), read from replicas, scaled horizontally',
          },
          {
            condition: 'Write Operations',
            recommendation: '500 RPS per server',
            reasoning: 'Must hit PRIMARY DB (50ms), cannot be cached, limited by DB',
          },
          {
            condition: 'Performance Difference',
            recommendation: 'Writes are 4× slower!',
            reasoning: 'Database writes require: fsync, WAL, transaction log, indexes',
          },
        ],
        whyItMatters: 'Writes are 4× more expensive than reads! This is why read-heavy apps are easier to scale than write-heavy apps.',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Key insight: Reads (2000 RPS/server) vs Writes (500 RPS/server) = 4× difference!',
            },
          ];
        },
      },
      {
        id: 'server_calculation',
        step: 4,
        category: 'throughput',
        title: 'Calculate Servers Needed',
        description: 'For mixed workloads, calculate servers for EACH operation type, then take the MAX.',
        questionType: 'calculation',
        calculation: {
          formula: 'Servers = MAX(Read Servers, Write Servers)',
          explanation: 'Calculate servers for reads and writes separately, then deploy enough for the BOTTLENECK.',
          exampleInputs: {
            'Total RPS': 10000,
            'Read/Write': '95:5',
            'Read RPS': 9500,
            'Write RPS': 500,
            'Read Capacity': '2000 RPS/server',
            'Write Capacity': '500 RPS/server',
          },
          exampleOutput: 'Read servers: 9500/2000 = 5\nWrite servers: 500/500 = 1\nDeploy: MAX(5, 1) = 5 servers',
        },
        whyItMatters: 'You deploy enough servers for whichever operation (read or write) needs MORE capacity. The bottleneck determines your server count!',
        commonMistakes: [
          'Adding read and write servers (wrong! they\'re the same physical servers)',
          'Not accounting for the 4× difference in capacity',
        ],
        onAnswer: (answer, previousAnswers) => {
          const totalRps = previousAnswers.total_rps || 10000;
          const ratio = previousAnswers.read_write_ratio;

          let readRps, writeRps;
          if (ratio === 'read_heavy_95_5') {
            readRps = 9500;
            writeRps = 500;
          } else if (ratio === 'balanced_50_50') {
            readRps = 5000;
            writeRps = 5000;
          } else {
            readRps = 1000;
            writeRps = 9000;
          }

          const readServers = Math.ceil(readRps / 2000);
          const writeServers = Math.ceil(writeRps / 500);
          const serversNeeded = Math.max(readServers, writeServers);

          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer to distribute traffic.',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: serversNeeded },
              reason: `Deploying ${serversNeeded} servers (Read: ${readServers} needed, Write: ${writeServers} needed, Bottleneck: ${readServers > writeServers ? 'Reads' : 'Writes'})`,
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client → LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB → App Servers',
            },
          ];
        },
      },
      {
        id: 'architecture_implications',
        step: 5,
        category: 'throughput',
        title: 'Architecture Based on Read/Write Ratio',
        description: 'Different ratios require different architectures:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Read-Heavy (95:5)',
            recommendation: 'Add: Cache + Read Replicas',
            reasoning: 'Reads are bottleneck → cache 95% of reads (5ms) + read replicas for scale',
          },
          {
            condition: 'Balanced (50:50)',
            recommendation: 'Add: Cache + Write Queues',
            reasoning: 'Both matter → cache reads + batch writes for efficiency',
          },
          {
            condition: 'Write-Heavy (10:90)',
            recommendation: 'Add: Write Queues + Batching + Sharding',
            reasoning: 'Writes are bottleneck → queue for burst, batch for throughput, shard for scale',
          },
        ],
        whyItMatters: 'Read/write ratio is a DECISION DRIVER! It tells you which components to add next.',
        onAnswer: (answer, previousAnswers) => {
          const ratio = previousAnswers.read_write_ratio;

          if (ratio === 'read_heavy_95_5') {
            return [
              {
                action: 'add_component',
                componentType: 'storage',
                reason: 'PostgreSQL for persistent storage.',
              },
              {
                action: 'add_connection',
                from: 'compute',
                to: 'storage',
                reason: 'App Servers → Database (write 500 RPS, read 9500 RPS)',
              },
              {
                action: 'highlight',
                reason: 'Next module: Add CACHE layer to handle 9,500 read RPS with 95% hit ratio!',
              },
            ];
          } else if (ratio === 'write_heavy_10_90') {
            return [
              {
                action: 'add_component',
                componentType: 'message_queue',
                reason: 'Message queue to buffer 9,000 write RPS.',
              },
              {
                action: 'add_component',
                componentType: 'storage',
                reason: 'PostgreSQL for persistent storage.',
              },
              {
                action: 'add_connection',
                from: 'compute',
                to: 'message_queue',
                reason: 'App Servers → Queue (buffer writes)',
              },
              {
                action: 'add_connection',
                from: 'message_queue',
                to: 'storage',
                reason: 'Queue → Database (batch writes)',
              },
              {
                action: 'highlight',
                reason: 'Write-heavy workload requires QUEUES + BATCHING to handle 9,000 writes/sec!',
              },
            ];
          } else {
            return [
              {
                action: 'add_component',
                componentType: 'storage',
                reason: 'PostgreSQL for persistent storage.',
              },
              {
                action: 'add_connection',
                from: 'compute',
                to: 'storage',
                reason: 'App Servers → Database (balanced read/write)',
              },
              {
                action: 'highlight',
                reason: 'Balanced workload: Need both cache (for reads) AND write optimization!',
              },
            ];
          }
        },
      },
    ],

    summary: {
      title: 'Read/Write Ratio Analysis Complete!',
      keyTakeaways: [
        'Reads and writes have ASYMMETRIC costs (4× difference)',
        'Read capacity: 2,000 RPS/server | Write capacity: 500 RPS/server',
        'Server calculation: MAX(Read Servers, Write Servers)',
        'Read-heavy → Add caching + read replicas',
        'Write-heavy → Add write queues + batching + sharding',
      ],
      nextSteps: 'Next: Learn about caching strategies to handle read-heavy workloads!',
    },
  },
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

  wizardFlow: {
    enabled: true,
    title: 'Burst QPS Handling',
    subtitle: 'Learn how to handle traffic spikes with request queues',

    objectives: [
      'Understand burst vs sustained load',
      'Learn why autoscaling alone fails (2-3 min lag)',
      'Calculate queue depth and drain rate',
      'Design request queue + worker pool architecture',
    ],

    questions: [
      {
        id: 'burst_scenario',
        step: 1,
        category: 'throughput',
        title: 'The Flash Sale Problem',
        description: 'Your e-commerce site has a flash sale at 12pm. Normal traffic: 5,000 RPS. Flash sale: 20,000 RPS burst!',
        questionType: 'single_choice',
        options: [
          {
            id: 'static_provision',
            label: 'Provision for 20k RPS all day',
            description: 'Deploy 15 servers 24/7',
            consequence: '⚠️ Works but EXPENSIVE! $15,000/month for capacity you use 30 min/day.',
          },
          {
            id: 'autoscaling',
            label: 'Use autoscaling',
            description: 'Scale from 5 → 15 servers when needed',
            consequence: '❌ FAILS! Autoscaling has 2-3 min lag. Flash sale drops 15k requests before servers boot.',
          },
          {
            id: 'request_queue',
            label: 'Add request queue',
            description: 'Queue buffers burst while workers scale up',
            consequence: '✅ BEST! Queue accepts all requests (0 drops), workers scale up, queue drains in 2-3 min.',
          },
        },
        whyItMatters: 'Autoscaling has 2-3 minute boot time. During flash sales, you drop thousands of requests before new servers are ready! Queues bridge this gap.',
        commonMistakes: [
          'Relying solely on autoscaling (ignoring boot lag)',
          'Not testing flash sale scenarios before launch',
        ],
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Autoscaling lag is 2-3 minutes. Flash sales last seconds. You NEED a buffer!',
            },
          ];
        },
      },
      {
        id: 'queue_depth_calculation',
        step: 2,
        category: 'throughput',
        title: 'Calculate Queue Depth',
        description: 'How many requests will queue up during the 3-minute autoscaling lag?',
        questionType: 'calculation',
        calculation: {
          formula: 'Queue Depth = (Burst RPS - Worker Capacity) × Lag Time',
          explanation: 'During autoscaling lag, requests arrive faster than workers can process.',
          exampleInputs: {
            'Burst RPS': 20000,
            'Initial Workers': '5 servers × 1,400 RPS = 7,000 RPS',
            'Overflow Rate': '20,000 - 7,000 = 13,000 RPS',
            'Autoscaling Lag': '3 minutes = 180 seconds',
          },
          exampleOutput: 'Queue Depth = 13,000 RPS × 180s = 2.34 million requests',
        },
        whyItMatters: 'You must provision a queue large enough to buffer ALL requests during autoscaling lag. Kafka/SQS can handle millions of messages.',
        commonMistakes: [
          'Underestimating queue capacity (queue fills up, drops requests)',
          'Not monitoring queue depth in production',
        ],
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Queue must hold 2.34M requests during 3-min autoscaling lag!',
            },
          ];
        },
      },
      {
        id: 'drain_rate',
        step: 3,
        category: 'throughput',
        title: 'Calculate Drain Rate',
        description: 'After autoscaling, how long to drain the queue?',
        questionType: 'calculation',
        calculation: {
          formula: 'Drain Time = Queue Depth / (Worker Capacity - Burst RPS)',
          explanation: 'Once workers scale up, they process the queue faster than new requests arrive.',
          exampleInputs: {
            'Queue Depth': '2.34M requests',
            'Scaled Workers': '15 servers × 1,400 RPS = 21,000 RPS',
            'Burst RPS': '20,000 RPS (still ongoing)',
            'Net Drain Rate': '21,000 - 20,000 = 1,000 RPS',
          },
          exampleOutput: 'Drain Time = 2.34M / 1,000 = 2,340 seconds = 39 minutes',
        },
        whyItMatters: 'Queue drain time determines user experience. 39 minutes is too long! Need more workers or burst must end.',
        commonMistakes: [
          'Not accounting for continued burst traffic while draining',
          'Assuming queue drains instantly after scale-up',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer accepts all requests immediately.',
            },
            {
              action: 'add_component',
              componentType: 'message_queue',
              reason: 'Kafka queue buffers 2.34M requests during autoscaling lag.',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 5 },
              reason: 'Initial: 5 workers (7k RPS capacity). Will scale to 15.',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client → LB (accepts all requests, returns 202 Accepted)',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'message_queue',
              reason: 'LB → Queue (enqueue all requests)',
            },
            {
              action: 'add_connection',
              from: 'message_queue',
              to: 'compute',
              reason: 'Queue → Workers (dequeue and process)',
            },
          ];
        },
      },
      {
        id: 'user_experience',
        step: 4,
        category: 'throughput',
        title: '202 Accepted Pattern',
        description: 'How do users experience queued requests?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Without Queue',
            recommendation: 'User sees: 503 Service Unavailable',
            reasoning: 'Dropped requests = angry customers + lost revenue',
          },
          {
            condition: 'With Queue (202 Accepted)',
            recommendation: 'User sees: "Processing your order..."',
            reasoning: 'Request accepted, processing async, user polls status',
          },
          {
            condition: 'Trade-off',
            recommendation: 'Latency: 30-120 seconds vs instant',
            reasoning: 'Users wait but don\'t lose their order',
          },
        ],
        whyItMatters: 'The 202 Accepted HTTP status tells clients "request accepted, processing asynchronously". Users see progress instead of errors!',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: '202 Accepted: Request queued successfully. User polls /order/{id}/status for completion.',
            },
          ];
        },
      },
      {
        id: 'when_to_use_queues',
        step: 5,
        category: 'throughput',
        title: 'When to Use Request Queues',
        description: 'Decision matrix for request queuing:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Predictable daily peaks',
            recommendation: 'NO queue needed (static provision)',
            reasoning: 'Provision for peak, use all day (Module 1 Problem 2)',
          },
          {
            condition: 'Unpredictable bursts (flash sales, viral posts)',
            recommendation: 'YES use queue',
            reasoning: 'Burst duration unknown, queue absorbs spike',
          },
          {
            condition: 'Burst > 5× normal load',
            recommendation: 'YES use queue',
            reasoning: 'Autoscaling cannot keep up with sudden 5× spike',
          },
        ],
        whyItMatters: 'Queues add complexity. Only use when bursts are unpredictable OR >5× normal load. For predictable peaks, static provisioning is simpler.',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Flash sales are unpredictable + >5× burst → Request queue is the right solution!',
            },
          ];
        },
      },
    ],

    summary: {
      title: 'Burst QPS Handling Complete!',
      keyTakeaways: [
        'Autoscaling has 2-3 min lag (AWS EC2 boot time)',
        'Queue depth = (Burst RPS - Worker Capacity) × Lag Time',
        'Request queue + 202 Accepted pattern for async processing',
        'Trade-off: Latency (30-120s wait) vs dropped requests (0%)',
        'Use queues for unpredictable bursts >5× normal load',
      ],
      nextSteps: 'Next: Learn about write queues and batching for database bottlenecks!',
    },
  },
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

  wizardFlow: {
    enabled: true,
    title: 'Caching Strategies',
    subtitle: 'Learn Cache-Aside, Write-Through, and Write-Behind patterns',

    objectives: [
      'Understand 3 caching strategies and their trade-offs',
      'Learn when to use Cache-Aside (most common)',
      'Know Write-Through for strong consistency',
      'Understand Write-Behind for write-heavy workloads',
    ],

    questions: [
      {
        id: 'caching_problem',
        step: 1,
        category: 'latency',
        title: 'Why Add Caching?',
        description: 'Your social media API has 10,000 RPS with 90% reads. Database queries are slow (P99 = 450ms).',
        questionType: 'single_choice',
        options: [
          {
            id: 'reduce_latency',
            label: 'Reduce latency (speed up reads)',
            description: 'Cache stores frequently accessed data in memory (5ms vs 50ms)',
            consequence: '✅ CORRECT! Caching reduces read latency by 10×.',
          },
          {
            id: 'reduce_db_load',
            label: 'Reduce database load',
            description: 'Cache handles 90% of reads, only 10% hit database',
            consequence: '✅ ALSO CORRECT! With 90% cache hit ratio, DB load drops by 9×.',
          },
          {
            id: 'both',
            label: 'Both of the above',
            description: 'Caching provides both faster reads AND lower DB load',
            consequence: '✅ BEST ANSWER! Caching is a latency AND throughput optimization.',
          },
        ],
        whyItMatters: 'Caching is one of the MOST impactful optimizations. It reduces latency (5ms vs 50ms) AND database load (90% cache hit = 10× fewer DB queries).',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Caching reduces P99 latency from 450ms → 50ms and DB load by 90%!',
            },
          ];
        },
      },
      {
        id: 'consistency_requirement',
        step: 2,
        category: 'consistency',
        title: 'What consistency do you need?',
        description: 'Different caching strategies offer different consistency guarantees.',
        questionType: 'single_choice',
        options: [
          {
            id: 'eventual',
            label: 'Eventual Consistency (OK if cache is stale for a few seconds)',
            description: 'Social feeds, product listings, view counts',
            consequence: 'Use Cache-Aside: Writes invalidate cache, next read reloads from DB.',
          },
          {
            id: 'strong',
            label: 'Strong Consistency (cache must ALWAYS match database)',
            description: 'Bank balances, inventory counts, user profiles',
            consequence: 'Use Write-Through: Writes update BOTH cache and DB synchronously.',
          },
          {
            id: 'write_heavy',
            label: 'Write-Heavy Workload (optimize write latency)',
            description: 'Logging systems, analytics, time-series data',
            consequence: 'Use Write-Behind: Writes go to cache first, async to DB.',
          },
        ],
        whyItMatters: 'Consistency requirement determines your caching strategy! Eventual consistency → Cache-Aside. Strong consistency → Write-Through.',
        commonMistakes: [
          'Using Cache-Aside for financial data (can have stale cache)',
          'Using Write-Through for read-heavy workloads (unnecessary complexity)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Consistency requirement is the PRIMARY decision driver for caching strategy.',
            },
          ];
        },
      },
      {
        id: 'cache_aside_pattern',
        step: 3,
        category: 'latency',
        title: 'Cache-Aside Pattern (Most Common)',
        description: 'Cache-Aside is used by 90% of applications. Learn how it works:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Read Flow',
            recommendation: '1. Check cache\n2. Miss → Read DB\n3. Write to cache\n4. Return',
            reasoning: 'Lazy loading: Only cache what is actually read',
          },
          {
            condition: 'Write Flow',
            recommendation: '1. Write to DB\n2. Invalidate cache (delete key)\n3. Next read reloads',
            reasoning: 'Invalidation prevents stale cache',
          },
          {
            condition: 'Consistency',
            recommendation: 'Eventual (stale for ~1 read)',
            reasoning: 'After invalidation, next read sees latest data',
          },
        ],
        whyItMatters: 'Cache-Aside is simple and works for 90% of use cases. Reads check cache first (fast path), writes invalidate cache (simple consistency).',
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer to distribute traffic.',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 3 },
              reason: 'App servers handle read/write logic.',
            },
            {
              action: 'add_component',
              componentType: 'cache',
              reason: 'Redis cache for Cache-Aside pattern (check cache first, load on miss).',
            },
            {
              action: 'add_component',
              componentType: 'storage',
              reason: 'PostgreSQL database (source of truth).',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client → LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB → App Servers',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'cache',
              reason: 'App Server checks cache first.',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'storage',
              reason: 'App Server reads from DB on cache miss.',
            },
          ];
        },
      },
      {
        id: 'write_through_pattern',
        step: 4,
        category: 'consistency',
        title: 'Write-Through Pattern (Strong Consistency)',
        description: 'Write-Through ensures cache and database are ALWAYS in sync.',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Read Flow',
            recommendation: '1. Check cache\n2. Miss → Read DB\n3. Write to cache\n4. Return',
            reasoning: 'Same as Cache-Aside',
          },
          {
            condition: 'Write Flow',
            recommendation: '1. Write to cache\n2. Write to DB (sync)\n3. Return after BOTH complete',
            reasoning: 'Cache and DB updated together (strong consistency)',
          },
          {
            condition: 'Consistency',
            recommendation: 'Strong (cache = DB always)',
            reasoning: 'Writes are synchronous to both cache and DB',
          },
        ],
        whyItMatters: 'Write-Through guarantees strong consistency but adds write latency (must write to cache AND DB). Use for critical data like bank balances.',
        commonMistakes: [
          'Using Write-Through for read-heavy workloads (adds complexity for little benefit)',
          'Not considering write latency impact (2× slower writes)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Write-Through: Writes update BOTH cache and DB synchronously. Strong consistency but slower writes.',
            },
          ];
        },
      },
      {
        id: 'strategy_decision',
        step: 5,
        category: 'latency',
        title: 'Choose Your Strategy',
        description: 'Decision matrix for caching strategies:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Read-Heavy + Eventual Consistency OK',
            recommendation: 'Cache-Aside (90% of use cases)',
            reasoning: 'Social feeds, news, product listings → simple and fast',
          },
          {
            condition: 'Strong Consistency Required',
            recommendation: 'Write-Through',
            reasoning: 'Bank balances, inventory, user profiles → cache = DB always',
          },
          {
            condition: 'Write-Heavy Workload',
            recommendation: 'Write-Behind (async)',
            reasoning: 'Logging, analytics, time-series → fast writes, batch to DB',
          },
        ],
        whyItMatters: 'Most applications should start with Cache-Aside. Only use Write-Through if you need strong consistency. Write-Behind is for specialized write-heavy workloads.',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Cache-Aside is the default choice. Only switch to Write-Through/Write-Behind when you have specific consistency or write-heavy requirements.',
            },
          ];
        },
      },
    ],

    summary: {
      title: 'Caching Strategies Complete!',
      keyTakeaways: [
        'Cache-Aside (90% of apps): Check cache → Miss → Load from DB → Write to cache',
        'Write-Through (strong consistency): Write to cache + DB synchronously',
        'Write-Behind (write-heavy): Write to cache → Async batch to DB',
        'Cache-Aside invalidates on write (eventual consistency)',
        'Cache hit ratio of 90% = 10× reduction in DB load',
      ],
      nextSteps: 'Next: Learn about replication patterns to scale database reads!',
    },
  },
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

  wizardFlow: {
    enabled: true,
    title: 'When to Add a Database',
    subtitle: 'Learn the RISKIEST axis: What happens if we LOSE data?',

    objectives: [
      'Start with NO database (in-memory first)',
      'Ask: What happens if we lose this data?',
      'Decision matrix: In-memory vs Cache vs Database',
      'Understand RPO (Recovery Point Objective) requirements',
    ],

    questions: [
      {
        id: 'intro_durability',
        step: 1,
        category: 'durability',
        title: 'The RISKIEST Question',
        description: 'Every tutorial says "add a database," but let\'s think critically: What happens if your server crashes and you LOSE data?',
        questionType: 'calculation',
        calculation: {
          formula: 'Risk = Impact of Data Loss × Probability of Loss',
          explanation: 'Before adding a database, ask: How risky is data loss for THIS specific data?',
          exampleInputs: {
            'View Counter': 'Low impact (minor inaccuracy)',
            'User Sessions': 'Medium impact (annoying re-login)',
            'E-commerce Orders': 'CRITICAL impact (revenue loss, legal liability)',
          },
          exampleOutput: 'Data criticality determines storage strategy',
        },
        whyItMatters: 'Databases add cost, complexity, and latency. Start with in-memory and only add persistence when data loss is UNACCEPTABLE.',
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 3 },
              reason: 'Starting with AppServers (in-memory only) - NO database yet!',
            },
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer for traffic distribution.',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client → LB → AppServers (in-memory)',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB distributes to app server pool.',
            },
          ];
        },
      },
      {
        id: 'scenario_selection',
        step: 2,
        category: 'durability',
        title: 'What are you building?',
        description: 'Choose your scenario to understand durability requirements:',
        questionType: 'single_choice',
        options: [
          {
            id: 'view_counter',
            label: 'Article View Counter',
            description: 'Track how many times articles are viewed',
            consequence: 'Data loss impact: LOW - Users don\'t care if count is 100% accurate',
          },
          {
            id: 'user_sessions',
            label: 'User Login Sessions',
            description: 'Track who is currently logged in',
            consequence: 'Data loss impact: MEDIUM - Users hate re-logging in',
          },
          {
            id: 'ecommerce_orders',
            label: 'E-commerce Orders',
            description: 'Store customer purchases and payments',
            consequence: 'Data loss impact: CRITICAL - Revenue loss, legal liability',
          },
        ],
        whyItMatters: 'Different data has different durability requirements. View counters can be approximate, but financial transactions must be durable!',
        onAnswer: (answer) => {
          return [
            {
              action: 'highlight',
              reason: `You chose: ${answer}. Let's analyze durability requirements...`,
            },
          ];
        },
      },
      {
        id: 'impact_analysis',
        step: 3,
        category: 'durability',
        title: 'Impact Analysis',
        description: 'Ask these 4 questions about your data:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Is it critical to product experience?',
            recommendation: 'View Counter: NO | Sessions: ANNOYING | Orders: YES',
            reasoning: 'How much do users care if this data is lost?',
          },
          {
            condition: 'Is it a security/compliance issue?',
            recommendation: 'View Counter: NO | Sessions: MODERATE | Orders: YES (PCI)',
            reasoning: 'Legal requirements? Financial regulations?',
          },
          {
            condition: 'Must we reconstruct on loss?',
            recommendation: 'View Counter: NO | Sessions: NO | Orders: YES (7yr retention)',
            reasoning: 'Can we rebuild from other sources?',
          },
          {
            condition: 'What is acceptable RPO?',
            recommendation: 'View Counter: ∞ | Sessions: 5min | Orders: 0 seconds',
            reasoning: 'RPO = Recovery Point Objective (how much data loss OK?)',
          },
        ],
        whyItMatters: 'RPO (Recovery Point Objective) determines your storage strategy. RPO = 0 means ZERO data loss acceptable → need database with ACID transactions!',
        onAnswer: (answer, previousAnswers) => {
          const scenario = previousAnswers.scenario_selection;
          if (scenario === 'view_counter') {
            return [
              {
                action: 'highlight',
                reason: '✅ View counters: In-memory is FINE! Data loss is acceptable. NO database needed.',
              },
            ];
          } else if (scenario === 'user_sessions') {
            return [
              {
                action: 'highlight',
                reason: '⚠️ User sessions: Use Redis/Memcached (persistent cache). Not a full database, but provides snapshots.',
              },
            ];
          } else {
            return [
              {
                action: 'highlight',
                reason: '❌ E-commerce orders: MUST HAVE DATABASE! Data loss is unacceptable.',
              },
            ];
          }
        },
      },
      {
        id: 'storage_decision',
        step: 4,
        category: 'durability',
        title: 'Choose Your Storage Strategy',
        description: 'Based on your durability requirements, select the right storage:',
        questionType: 'single_choice',
        options: [
          {
            id: 'in_memory',
            label: 'In-Memory Only (HashMap)',
            description: 'No persistence, fastest, cheapest',
            consequence: 'Data lost on crash. Good for: view counters, temporary data, caches',
          },
          {
            id: 'persistent_cache',
            label: 'Persistent Cache (Redis/Memcached)',
            description: 'Periodic snapshots, TTL expiry',
            consequence: 'Small data loss window (last 5 min). Good for: sessions, recent activity',
          },
          {
            id: 'database',
            label: 'ACID Database (PostgreSQL/MySQL)',
            description: 'Full durability, ACID transactions',
            consequence: 'Zero data loss. Good for: financial data, user accounts, orders',
          },
        ],
        whyItMatters: 'This is the core trade-off: Durability vs Speed vs Cost. Choose based on data criticality, not what tutorials say!',
        commonMistakes: [
          'Adding a database "just because" (overkill for temporary data)',
          'Using in-memory for financial data (legal liability)',
          'Not considering Redis for session data (simpler than PostgreSQL)',
        ],
        onAnswer: (answer, previousAnswers) => {
          const scenario = previousAnswers.scenario_selection;

          if (answer === 'database') {
            return [
              {
                action: 'add_component',
                componentType: 'storage',
                reason: 'Adding PostgreSQL for durable storage (ACID guarantees).',
              },
              {
                action: 'add_connection',
                from: 'compute',
                to: 'storage',
                reason: 'AppServers persist critical data to database.',
              },
            ];
          } else if (answer === 'persistent_cache') {
            return [
              {
                action: 'add_component',
                componentType: 'cache',
                reason: 'Adding Redis for persistent session storage (AOF/RDB snapshots).',
              },
              {
                action: 'add_connection',
                from: 'compute',
                to: 'cache',
                reason: 'AppServers store sessions in Redis.',
              },
            ];
          } else {
            return [
              {
                action: 'highlight',
                reason: 'In-memory only - NO additional components! Data stored in AppServer RAM.',
              },
            ];
          }
        },
      },
      {
        id: 'decision_summary',
        step: 5,
        category: 'durability',
        title: 'Decision Matrix Summary',
        description: 'Here\'s the complete decision framework for durability:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'RPO = ∞ (data loss OK)',
            recommendation: 'In-Memory (HashMap)',
            reasoning: 'View counters, temporary caches, metrics',
          },
          {
            condition: 'RPO = 1-5 minutes',
            recommendation: 'Persistent Cache (Redis)',
            reasoning: 'User sessions, recent activity, leaderboards',
          },
          {
            condition: 'RPO = 0 (zero data loss)',
            recommendation: 'ACID Database (PostgreSQL)',
            reasoning: 'Financial transactions, user accounts, orders',
          },
        ],
        whyItMatters: 'RPO (Recovery Point Objective) is the KEY metric. It tells you how much data loss is acceptable, which determines your storage choice.',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Remember: Start with NO database and only add when RPO requires it!',
            },
          ];
        },
      },
    ],

    summary: {
      title: 'Durability Requirements Complete!',
      keyTakeaways: [
        'START with NO database - use in-memory storage first',
        'Ask: What happens if we LOSE this data? (RISKIEST axis)',
        'RPO = Recovery Point Objective (how much data loss OK?)',
        'Decision matrix: RPO = ∞ → In-memory | RPO = 5min → Redis | RPO = 0 → Database',
        'Databases add cost/complexity - only use when data loss is UNACCEPTABLE',
      ],
      nextSteps: 'Next: Learn about durability LEVELS (fsync, WAL, replication)!',
    },
  },
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

  wizardFlow: {
    enabled: true,
    title: 'Durability Levels: Performance vs Data Safety',
    subtitle: 'Learn fsync, WAL, and replication trade-offs',
    objectives: [
      'Understand the durability spectrum (async → fsync → WAL → replication)',
      'Map RPO/RTO requirements to durability level',
      'Calculate performance impact of each level',
      'Choose appropriate level based on data criticality',
    ],
    questions: [
      {
        id: 'data_criticality',
        step: 1,
        category: 'durability',
        title: 'What type of data are you storing?',
        description: 'Different data types have different durability requirements. Let\'s identify yours.',
        questionType: 'single_choice',
        options: [
          {
            id: 'financial',
            label: 'Financial transactions (banking, payments)',
            description: 'Customer money - ZERO data loss acceptable',
            consequence: 'Required: Level 4 (Synchronous Replication). RPO = 0, RTO < 1min.',
          },
          {
            id: 'user_data',
            label: 'User profiles and e-commerce orders',
            description: 'Important but not life-critical',
            consequence: 'Required: Level 2-3 (fsync or WAL). RPO = 0, RTO = 5-30min OK.',
          },
          {
            id: 'analytics',
            label: 'Analytics, logs, and metrics',
            description: 'Approximate data is acceptable',
            consequence: 'Required: Level 1 (Async). RPO = 30s OK (can rebuild from sources).',
          },
        ],
        whyItMatters: 'Data criticality determines durability level! Banking = 0 data loss (Level 4 replication). Logs = approximate OK (Level 1 async).',
        commonMistakes: [
          'Using async writes for financial data (ILLEGAL! Lose customer money on crash)',
          'Using sync replication for logs (10× slower, not worth it)',
          'Not considering regulatory requirements (HIPAA, SOX require WAL)',
        ],
        onAnswer: (answer) => {
          if (answer === 'financial') {
            return [{
              action: 'highlight',
              reason: 'Banking → Level 4 Synchronous Replication! Data written to 3 servers before "success". Survives data center failure.',
            }];
          } else if (answer === 'user_data') {
            return [{
              action: 'highlight',
              reason: 'User data → Level 2 fsync (default for most DBs). Every commit waits for disk write. No data loss on crash.',
            }];
          } else {
            return [{
              action: 'highlight',
              reason: 'Analytics → Level 1 Async! Write to RAM, return immediately. 50k writes/sec. 30s data loss OK (can rebuild).',
            }];
          }
        },
      },
      {
        id: 'rpo_rto_requirements',
        step: 2,
        category: 'durability',
        title: 'RPO & RTO Requirements',
        description: 'What are your Recovery Point Objective (data loss) and Recovery Time Objective (downtime) requirements?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'RPO = 30s, RTO = Hours',
            recommendation: 'Level 1: Async writes (50k writes/sec, 1-5ms latency)',
            reasoning: 'Logs, metrics, gaming leaderboards. Can tolerate data loss and rebuild.',
          },
          {
            condition: 'RPO = 0s, RTO = 30min',
            recommendation: 'Level 2: fsync on commit (5k writes/sec, 5-20ms latency)',
            reasoning: 'E-commerce, SaaS. Standard production database. Default PostgreSQL config.',
          },
          {
            condition: 'RPO = 0s, RTO = 5min',
            recommendation: 'Level 3: WAL + fsync (10k writes/sec, 3-10ms latency)',
            reasoning: 'Financial, compliance. WAL = point-in-time recovery. Faster crash recovery.',
          },
          {
            condition: 'RPO = 0s, RTO < 1min',
            recommendation: 'Level 4: Sync replication (3k writes/sec, 10-50ms latency)',
            reasoning: 'Banking, medical. ZERO data loss, automatic failover. Survives data center failure.',
          },
        ],
        whyItMatters: 'RPO/RTO drive architecture! RPO = 0 → need fsync or replication. RTO < 1min → need automatic failover (replication).',
        commonMistakes: [
          'Confusing RPO and RTO (RPO = data loss, RTO = downtime)',
          'Not testing recovery time (claimed RTO = 5min, actual = 2 hours)',
          'Forgetting about correlated failures (same data center = both servers down)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer for high availability',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 3 },
              reason: 'App servers (stateless)',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client connects to LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB distributes to app servers',
            },
          ];
        },
      },
      {
        id: 'performance_impact',
        step: 3,
        category: 'durability',
        title: 'Performance Trade-offs',
        description: 'Each durability level has different performance characteristics.',
        questionType: 'calculation',
        calculation: {
          formula: 'Throughput Reduction = (Disk I/O Time) / (Total Transaction Time)',
          explanation: 'fsync adds disk I/O latency to every transaction. More durable = slower.',
          exampleInputs: {
            'Level 1 (Async)': '50,000 writes/sec (in-memory only)',
            'Level 2 (fsync)': '5,000 writes/sec (10× slower - disk I/O)',
            'Level 3 (WAL+fsync)': '10,000 writes/sec (5× slower - sequential writes)',
            'Level 4 (Sync Repl)': '3,000 writes/sec (16× slower - network + 2× disk)',
          },
          exampleOutput: 'Trade-off: 10× performance drop for zero data loss (async → fsync)',
        },
        whyItMatters: 'Durability costs performance! Async = 50k writes/sec. Sync replication = 3k writes/sec (16× slower). But you get zero data loss + automatic failover.',
        commonMistakes: [
          'Not load testing with fsync enabled (dev = fsync off, prod = 10× slower)',
          'Assuming disk = fast (SSD fsync = 5ms, HDD = 20ms)',
          'Forgetting about network latency in replication (cross-region = +100ms)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'storage',
              config: { count: 1 },
              reason: 'Primary database with fsync + WAL enabled',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'storage',
              reason: 'App servers write to primary DB',
            },
          ];
        },
      },
      {
        id: 'wal_deep_dive',
        step: 4,
        category: 'durability',
        title: 'Write-Ahead Log (WAL) Benefits',
        description: 'Why is WAL faster than direct disk writes?',
        questionType: 'single_choice',
        options: [
          {
            id: 'sequential_writes',
            label: 'Sequential writes are faster than random writes',
            description: 'WAL = append-only log (sequential). Data pages = random writes.',
            consequence: '✅ CORRECT! SSD: Sequential = 500 MB/s, Random = 50 MB/s (10× faster). WAL exploits sequential I/O.',
          },
          {
            id: 'compression',
            label: 'WAL compresses data',
            description: 'Compression reduces disk I/O',
            consequence: '❌ WRONG! WAL is about write pattern, not compression. Sequential writes are the key.',
          },
          {
            id: 'caching',
            label: 'WAL uses a cache',
            description: 'Cache avoids disk writes',
            consequence: '❌ WRONG! WAL still writes to disk (fsync). But it uses sequential I/O which is 10× faster.',
          },
        ],
        whyItMatters: 'WAL enables 2× better throughput vs direct data page updates. Sequential writes (WAL) = 10× faster than random writes (data pages). Plus crash recovery and point-in-time restore!',
        commonMistakes: [
          'Thinking WAL is "just a backup" (it\'s a performance optimization + recovery tool)',
          'Not archiving WAL (lose point-in-time recovery capability)',
          'Putting WAL on same disk as data (single failure point)',
        ],
        onAnswer: (answer) => {
          if (answer === 'sequential_writes') {
            return [{
              action: 'highlight',
              reason: '✅ WAL = Sequential writes! Append-only log is 10× faster than random data page updates. Plus: crash recovery + point-in-time restore.',
            }];
          } else {
            return [{
              action: 'highlight',
              reason: '❌ WAL speed comes from sequential I/O, not compression or caching. Sequential disk writes = 10× faster than random!',
            }];
          }
        },
      },
      {
        id: 'replication_architecture',
        step: 5,
        category: 'durability',
        title: 'Synchronous Replication Architecture',
        description: 'For banking (RPO=0, RTO<1min), you need Level 4. How many replicas?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: '1 Primary + 1 Replica (same region)',
            recommendation: '❌ RISKY! Single region = data center failure takes down both.',
            reasoning: 'Correlated failure: Power outage, network split, natural disaster.',
          },
          {
            condition: '1 Primary + 2 Replicas (same region)',
            recommendation: '⚠️ BETTER but still regional risk',
            reasoning: 'Survives 1 server failure, but not regional outage.',
          },
          {
            condition: '1 Primary + 2 Replicas (different regions)',
            recommendation: '✅ BEST! Survives data center failure.',
            reasoning: 'Primary + Replica 1 (same region, <1ms) + Replica 2 (cross-region, +50ms). RTO < 1min via automatic failover.',
          },
        ],
        whyItMatters: 'For zero data loss + automatic failover, need 3 nodes across 2+ regions. Same-region replica = fast (<1ms). Cross-region replica = survives data center failure.',
        commonMistakes: [
          'All replicas in same data center (correlated failure)',
          'Not testing failover (claimed RTO = 1min, actual = 30min manual recovery)',
          'Forgetting about split-brain (2 nodes both think they\'re primary)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'storage',
              config: { count: 2 },
              reason: '2 synchronous replicas (1 same-region, 1 cross-region) for RPO=0, RTO<1min',
            },
            {
              action: 'highlight',
              reason: 'Final architecture: Primary + 2 sync replicas. Write waits for all 3 to fsync. Automatic failover on primary failure. Survives data center outage!',
            },
          ];
        },
      },
    ],
    summary: {
      title: 'Durability Levels Mastered!',
      keyTakeaways: [
        'Level 1 (Async): 50k writes/sec, RPO=30s. Use for: Logs, analytics.',
        'Level 2 (fsync): 5k writes/sec, RPO=0s. Use for: E-commerce, SaaS (default).',
        'Level 3 (WAL+fsync): 10k writes/sec, RPO=0s, faster recovery. Use for: Finance, compliance.',
        'Level 4 (Sync Repl): 3k writes/sec, RPO=0s, RTO<1min. Use for: Banking, medical.',
        'Trade-off: 16× performance drop (async → sync repl) for zero data loss + failover.',
      ],
      nextSteps: 'Next: Learn when to shard your database (Module 5 - Dataset Size)!',
    },
  },
};

// ============================================================================
// Module 5: Dataset Size & Sharding (LARGEST Axis Continued)
// ============================================================================

/**
 * Problem 12: When Sharding Is Needed - Dataset Size Analysis
 *
 * Teaches:
 * - When dataset outgrows a single database server
 * - Vertical scaling limits (CPU, RAM, disk)
 * - When to shard vs when to optimize
 * - Sharding decision matrix
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServer → Database (single instance)
 * 2. Problem: Database growing (10TB dataset, queries slow)
 * 3. Options: Optimize, bigger server, or shard?
 * 4. Decision: Shard when optimization + bigger server isn't enough
 */
export const shardingRequirementProblem: ProblemDefinition = {
  id: 'nfr-ch0-sharding-requirement',
  title: 'Dataset Size: When to Shard Your Database',
  description: `Your database has grown to 10TB. Queries are slow. Do you need sharding, or is there a simpler solution?

**The Problem: Database Growing**

Your e-commerce platform started 3 years ago:
- Year 1: 100GB dataset (10M products) → Single PostgreSQL server ✅
- Year 2: 1TB dataset (100M products) → Upgraded to bigger server ✅
- Year 3: 10TB dataset (1B products) → Queries taking 30+ seconds ❌

**Current Architecture:**
\`\`\`
Client → LB → AppServer Pool → PostgreSQL (10TB, single server)
\`\`\`

**The Question: Do You Need Sharding?**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Option 1: Optimize Queries (Try This First!)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before sharding, exhaust these optimizations:

**1. Add Indexes**
\`\`\`sql
-- Slow query (30s on 10TB)
SELECT * FROM products WHERE category = 'electronics' AND price < 100;

-- Add index (query now 50ms)
CREATE INDEX idx_category_price ON products(category, price);
\`\`\`

**2. Query Optimization**
\`\`\`sql
-- Bad: SELECT * (fetches all columns)
SELECT * FROM products WHERE id = 123;

-- Good: SELECT only needed columns
SELECT id, name, price FROM products WHERE id = 123;
\`\`\`

**3. Partition Tables (NOT sharding!)**
\`\`\`sql
-- Partition by date (query only recent data)
CREATE TABLE products_2024 PARTITION OF products
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
\`\`\`

**When This Works:**
- ✅ Queries can be optimized
- ✅ Most queries access recent data (partitioning helps)
- ✅ Working set fits in RAM (cache helps)

**When This Fails:**
- ❌ Queries are already optimized
- ❌ Need to scan large portions of data
- ❌ Dataset > available RAM (cache misses)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Option 2: Vertical Scaling (Buy Bigger Server)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Current Server:**
- CPU: 32 cores
- RAM: 256GB
- Disk: 20TB SSD
- Cost: $2,000/month

**Upgrade to Bigger Server:**
- CPU: 96 cores
- RAM: 1TB
- Disk: 40TB SSD
- Cost: $8,000/month

**Pros:**
- ✅ No code changes (drop-in replacement)
- ✅ No sharding complexity
- ✅ ACID transactions still work

**Cons:**
- ❌ Expensive (4× cost for 2× capacity)
- ❌ Diminishing returns (law of diminishing returns)
- ❌ Hard limits (largest AWS instance: 4TB RAM, 100TB disk)

**When This Works:**
- ✅ Dataset < 5TB
- ✅ Budget allows
- ✅ Don't want sharding complexity

**When This Fails:**
- ❌ Dataset > 10TB (approaching hardware limits)
- ❌ Growing 2TB/year (will hit limits soon)
- ❌ Cost prohibitive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Option 3: Horizontal Scaling (Sharding)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Sharding:** Split data across multiple database servers

**Example: Shard by User ID**
\`\`\`
Shard 0 (user_id % 4 == 0): 2.5TB (users 0, 4, 8, 12, ...)
Shard 1 (user_id % 4 == 1): 2.5TB (users 1, 5, 9, 13, ...)
Shard 2 (user_id % 4 == 2): 2.5TB (users 2, 6, 10, 14, ...)
Shard 3 (user_id % 4 == 3): 2.5TB (users 3, 7, 11, 15, ...)
\`\`\`

**Pros:**
- ✅ Linear scalability (add more shards as you grow)
- ✅ Cost-effective (4× $2k servers = $8k, same as 1× big server)
- ✅ No hard limits (can grow to 100+ shards)

**Cons:**
- ❌ Complex code changes (routing logic)
- ❌ No cross-shard joins
- ❌ No cross-shard transactions
- ❌ Rebalancing is hard

**When This Works:**
- ✅ Dataset > 10TB and growing
- ✅ Data can be partitioned by key (user_id, tenant_id, region)
- ✅ Most queries are single-shard (e.g., user's own data)

**When This Fails:**
- ❌ Need cross-shard joins frequently
- ❌ Need distributed transactions
- ❌ Can't partition data logically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Decision Matrix:**

| Dataset Size | Query Pattern      | Best Solution           | Why?                            |
|--------------|--------------------| ------------------------|----------------------------------|
| < 100GB      | Any                | ✅ Single server        | Small enough to fit on one box  |
| 100GB - 1TB  | Optimizable        | ✅ Single server + indexes | Optimization + bigger server   |
| 1TB - 5TB    | Mostly recent data | ✅ Vertical scale + partitioning | Partitioning isolates hot data |
| 1TB - 5TB    | Random access      | ⚠️ Consider sharding    | Depends on query patterns       |
| 5TB - 20TB   | Can partition      | ✅ Sharding             | Vertical scaling too expensive  |
| > 20TB       | Any                | ✅ Sharding (required)  | Exceeds single-server limits    |

**Your Task:**

You're building a **multi-tenant SaaS platform** (like Shopify):
- 100,000 tenants (online stores)
- Dataset: 50TB total
  - Tenant A: 10GB (small store)
  - Tenant B: 500GB (medium store)
  - Tenant C: 5TB (enterprise store)
- Query pattern: 99% of queries are single-tenant (users only see their own store's data)

**Analysis:**
- Dataset: 50TB ❌ Too large for vertical scaling
- Growth: 10TB/year ❌ Will hit limits quickly
- Query pattern: ✅ Partitionable by tenant_id
- Cross-tenant queries: ❌ Only 1% (analytics, can be async)

**Decision:** ✅ **Sharding Required**

Shard by \`tenant_id\`:
- Small tenants: Shard 0-3 (many tenants per shard)
- Medium tenants: Shard 4-7 (fewer tenants per shard)
- Large tenants: Shard 8+ (dedicated shard per tenant)

**Expected Architecture:**
\`\`\`
Client → LB → AppServer Pool → Shard Router
                                    ├─> Shard 0 (10TB)
                                    ├─> Shard 1 (10TB)
                                    ├─> Shard 2 (10TB)
                                    ├─> Shard 3 (10TB)
                                    └─> Shard 4 (10TB)
\`\`\`

**Learning Objectives:**
1. Know when to optimize vs scale vertically vs shard
2. Understand sharding trade-offs (complexity vs scalability)
3. Identify partitionable data (user_id, tenant_id, region)
4. Avoid premature sharding (shard only when necessary)`,

  userFacingFRs: [
    'Multi-tenant SaaS platform (100k tenants)',
    'Each tenant has isolated data (products, orders, users)',
    '99% of queries are single-tenant',
  ],

  userFacingNFRs: [
    'Dataset: 50TB total (growing 10TB/year)',
    'Largest tenant: 5TB',
    'Query latency: P99 < 200ms',
    'Cost: Minimize infrastructure cost',
  ],

  clientDescriptions: [
    {
      name: 'Tenant Client',
      subtitle: 'Access own store data',
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
        reason: 'AppServer pool (includes shard routing logic)',
      },
      {
        type: 'storage',
        reason: 'Multiple database shards (50TB total, need 5+ shards at 10TB each). Need multiple storage nodes.',
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
        reason: 'AppServer routes queries to correct shard based on tenant_id',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-sharding-requirement', problemConfigs['nfr-ch0-sharding-requirement'] || {
    baseRps: 10000,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.999,
  }, [
    'Handle 50TB dataset with sharding',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Multiple Storage Nodes for Sharding',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length < 3) {
          return {
            valid: false,
            hint: '50TB dataset cannot fit on a single server. You need sharding (horizontal scaling). Add at least 5 database shards at ~10TB each.',
          };
        }

        return {
          valid: true,
          details: {
            storageNodes: storageNodes.length,
            estimatedCapacity: `${storageNodes.length * 10}TB (${storageNodes.length} shards × 10TB)`,
          },
        };
      },
    },
    {
      name: 'Sufficient Shards for Dataset Size',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        // For 50TB, need at least 5 shards (10TB per shard)
        const datasetSize = 50; // TB
        const shardCapacity = 10; // TB per shard
        const shardsNeeded = Math.ceil(datasetSize / shardCapacity);

        if (storageNodes.length < shardsNeeded) {
          return {
            valid: false,
            hint: `50TB dataset needs at least ${shardsNeeded} shards (at 10TB per shard). You have ${storageNodes.length} storage nodes. Add more shards.`,
          };
        }

        return { valid: true };
      },
    },
  ],

  wizardFlow: {
    enabled: true,
    title: 'When to Shard Your Database',
    subtitle: 'Learn the decision framework: Optimize → Vertical Scale → Shard',
    objectives: [
      'Understand when to optimize vs scale vertically vs shard',
      'Learn the dataset size thresholds for each approach',
      'Calculate shard count based on dataset size',
      'Identify good sharding keys (user_id, tenant_id, region)',
    ],
    questions: [
      {
        id: 'dataset_size',
        step: 1,
        category: 'dataset_size',
        title: 'What is your current dataset size?',
        description: 'Your multi-tenant SaaS platform has grown significantly. Let\'s analyze if you need sharding.',
        questionType: 'numeric_input',
        numericConfig: {
          placeholder: 'Enter dataset size',
          unit: 'TB',
          min: 1,
          max: 1000,
          suggestedValue: 50,
        },
        whyItMatters: 'Dataset size is the PRIMARY factor in deciding sharding. Small datasets (<5TB) should avoid sharding complexity. Large datasets (>10TB) REQUIRE sharding because single servers have hard limits (AWS largest: 4TB RAM, 100TB disk).',
        commonMistakes: [
          'Sharding prematurely when dataset is <1TB (massive complexity for no gain)',
          'Waiting too long to shard (migration becomes painful at 50TB+)',
          'Not accounting for growth rate (if growing 10TB/year, shard NOW)',
        ],
        onAnswer: (answer) => {
          const datasetSizeTB = answer;

          if (datasetSizeTB < 5) {
            return [{
              action: 'highlight',
              reason: `Dataset: ${datasetSizeTB}TB. This is small enough for a single server. Do NOT shard yet! Try optimization and vertical scaling first.`,
            }];
          } else if (datasetSizeTB < 20) {
            return [{
              action: 'highlight',
              reason: `Dataset: ${datasetSizeTB}TB. You're in the gray zone. Sharding may be needed soon, but consider vertical scaling first if queries can be optimized.`,
            }];
          } else {
            return [{
              action: 'highlight',
              reason: `Dataset: ${datasetSizeTB}TB. This REQUIRES sharding! Single servers max out at ~20TB. You need horizontal scaling.`,
            }];
          }
        },
      },
      {
        id: 'decision_framework',
        step: 2,
        category: 'dataset_size',
        title: 'Decision Framework: When to Shard',
        description: 'Before sharding, exhaust simpler solutions. Sharding adds massive complexity!',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Dataset < 100GB',
            recommendation: '✅ Single server + optimization',
            reasoning: 'Add indexes, optimize queries, partition tables. No sharding needed.',
          },
          {
            condition: 'Dataset 100GB - 5TB',
            recommendation: '✅ Vertical scale (buy bigger server)',
            reasoning: 'Upgrade to 1TB RAM server. No code changes. Cost: $8k/month.',
          },
          {
            condition: 'Dataset 5TB - 20TB',
            recommendation: '⚠️ Consider sharding (depends on query pattern)',
            reasoning: 'If queries are partitionable (e.g., by tenant_id), shard. Otherwise, vertical scale + partitioning.',
          },
          {
            condition: 'Dataset > 20TB',
            recommendation: '✅ Sharding required',
            reasoning: 'Exceeds single-server limits. Must shard horizontally.',
          },
        ],
        whyItMatters: 'Sharding is the LAST RESORT! It breaks ACID transactions, prevents cross-shard joins, and requires complex routing logic. Only shard when dataset size or growth rate forces it.',
        commonMistakes: [
          'Sharding too early (premature optimization)',
          'Not trying vertical scaling first (often solves problem for 1/4 the complexity)',
          'Sharding when queries need cross-shard joins (sharding won\'t help)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer distributes traffic to app servers',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 8 },
              reason: 'App servers handle routing logic (determine which shard to query)',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client connects to LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB distributes to app servers',
            },
          ];
        },
      },
      {
        id: 'shard_count_calculation',
        step: 3,
        category: 'dataset_size',
        title: 'Calculate Shard Count',
        description: 'How many shards do you need for a 50TB dataset?',
        questionType: 'calculation',
        calculation: {
          formula: 'Shards Needed = Dataset Size / Shard Capacity',
          explanation: 'Each shard should hold ~10TB (AWS RDS max: 64TB, but 10TB is optimal for performance). For 50TB dataset, you need 5 shards.',
          exampleInputs: {
            'Dataset Size': 50,
            'Shard Capacity': 10,
          },
          exampleOutput: 'Shards Needed = 50TB / 10TB = 5 shards',
        },
        whyItMatters: 'Each shard is a separate database server. Too few shards → each shard too large (slow queries). Too many shards → expensive and complex.',
        commonMistakes: [
          'Using too many shards (100 shards for 50TB = overkill)',
          'Making shards too small (<1TB per shard = wasted overhead)',
          'Not planning for growth (if growing 10TB/year, add buffer capacity)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'storage',
              config: { count: 5 },
              reason: '5 database shards (10TB each) to hold 50TB total dataset',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'storage',
              reason: 'App servers route queries to correct shard based on sharding key',
            },
          ];
        },
      },
      {
        id: 'sharding_key',
        step: 4,
        category: 'dataset_size',
        title: 'Choose Sharding Key',
        description: 'For a multi-tenant SaaS platform, what should you shard by?',
        questionType: 'single_choice',
        options: [
          {
            id: 'tenant_id',
            label: 'tenant_id (each store gets routed to specific shard)',
            description: 'Tenant A → Shard 0, Tenant B → Shard 1, etc.',
            consequence: '✅ BEST! 99% of queries are single-tenant (users only see their own store). All data for a tenant lives on one shard → no cross-shard joins!',
          },
          {
            id: 'user_id',
            label: 'user_id (each user gets routed to specific shard)',
            description: 'User 1 → Shard 0, User 2 → Shard 1, etc.',
            consequence: '❌ BAD! A single tenant\'s users would be scattered across shards. Queries like "get all users for tenant X" would require cross-shard joins.',
          },
          {
            id: 'product_id',
            label: 'product_id (each product gets routed to specific shard)',
            description: 'Product A → Shard 0, Product B → Shard 1, etc.',
            consequence: '❌ BAD! Queries like "get all products for tenant X" would require cross-shard joins. Tenant data should live together.',
          },
          {
            id: 'timestamp',
            label: 'timestamp (shard by time, e.g., recent data on Shard 0)',
            description: 'Recent data → Shard 0, old data → Shard 1, etc.',
            consequence: '❌ BAD for SaaS! Creates hot shards (all writes go to latest shard). Good for time-series data (logs), bad for transactional data.',
          },
        ],
        whyItMatters: 'The sharding key determines which shard holds each row. CRITICAL: Choose a key where most queries are "single-shard" (don\'t need to query multiple shards). For multi-tenant SaaS, tenant_id is almost always the right choice.',
        commonMistakes: [
          'Sharding by user_id in multi-tenant systems (scatters tenant data)',
          'Sharding by timestamp for transactional data (creates hot shards)',
          'Choosing a key that requires cross-shard joins (defeats the purpose)',
        ],
        onAnswer: (answer) => {
          if (answer === 'tenant_id') {
            return [{
              action: 'highlight',
              reason: '✅ Sharding by tenant_id! Each tenant\'s data lives on ONE shard. Queries like "get orders for Tenant X" hit a single shard → fast!',
            }];
          } else {
            return [{
              action: 'highlight',
              reason: `❌ Sharding by ${answer} would require cross-shard queries! For multi-tenant SaaS, always shard by tenant_id to keep tenant data together.`,
            }];
          }
        },
      },
      {
        id: 'sharding_tradeoffs',
        step: 5,
        category: 'cost',
        title: 'Sharding Trade-offs',
        description: 'Sharding gives you scalability, but at a cost. What do you lose?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'ACID Transactions',
            recommendation: '❌ Lost (no cross-shard transactions)',
            reasoning: 'Can\'t do transactions across shards. E.g., can\'t transfer money between users on different shards atomically.',
          },
          {
            condition: 'Cross-Shard Joins',
            recommendation: '❌ Lost (no joins across shards)',
            reasoning: 'Can\'t JOIN tables on different shards. E.g., can\'t do "SELECT * FROM tenants JOIN orders" if they\'re on different shards.',
          },
          {
            condition: 'Complexity',
            recommendation: '❌ Massive increase',
            reasoning: 'App code needs routing logic (which shard to query?). Migrations are complex. Rebalancing shards is painful.',
          },
          {
            condition: 'Scalability',
            recommendation: '✅ Gained (linear scaling)',
            reasoning: 'Can scale to 100+ shards. No hard limits on dataset size.',
          },
          {
            condition: 'Cost',
            recommendation: '✅ Cost-effective vs vertical scaling',
            reasoning: '5 × $2k servers ($10k total) vs 1 × $20k big server. Sharding is cheaper at scale.',
          },
        ],
        whyItMatters: 'Sharding is a TRADE-OFF. You gain unlimited scalability but lose simplicity. Only shard when the benefits (handling >10TB datasets) outweigh the costs (complexity).',
        commonMistakes: [
          'Thinking sharding is "free" (it\'s NOT - massive code changes required)',
          'Not planning for cross-shard queries (analytics, reporting need special handling)',
          'Forgetting about rebalancing (what if Tenant X grows to 20TB?)',
        ],
        onAnswer: () => {
          return [{
            action: 'highlight',
            reason: 'Architecture complete! 5 shards (10TB each) = 50TB capacity. Each tenant\'s data lives on ONE shard. Cross-shard queries avoided by sharding by tenant_id.',
          }];
        },
      },
    ],
    summary: {
      title: 'Sharding Decision Framework Complete!',
      keyTakeaways: [
        'Sharding Hierarchy: Optimize first → Vertical scale → Shard (last resort)',
        'Dataset size thresholds: <5TB = single server, 5-20TB = vertical scale, >20TB = shard',
        'Shard count = Dataset Size / 10TB (e.g., 50TB → 5 shards)',
        'Sharding key: Choose what keeps related data together (tenant_id for SaaS)',
        'Trade-offs: Gain scalability, lose ACID transactions & cross-shard joins',
      ],
      nextSteps: 'Next: Learn sharding STRATEGIES (hash vs range vs geo-based) in Problem 14!',
    },
  },
};

/**
 * Problem 13: Sharding Strategies - Hash vs Range vs Geo-based
 *
 * Teaches:
 * - Different sharding strategies and trade-offs
 * - Hash-based sharding (user_id % N)
 * - Range-based sharding (date ranges, alphabetical)
 * - Geo-based sharding (by region)
 * - Hot spots and rebalancing challenges
 *
 * Learning Flow:
 * 1. You've decided to shard (from Problem 12)
 * 2. Ask: HOW to shard? (what's the shard key?)
 * 3. Trade-off: Uniform distribution vs query patterns
 * 4. Solution: Choose strategy based on access patterns
 */
export const shardingStrategiesProblem: ProblemDefinition = {
  id: 'nfr-ch0-sharding-strategies',
  title: 'Sharding Strategies: Hash vs Range vs Geo-based',
  description: `You've decided to shard your 50TB database (from Module 5 Problem 1). Now: HOW to shard?

**The Question: What's Your Shard Key?**

Shard key = The field you use to decide which shard stores the data

**Three Sharding Strategies:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Strategy 1: Hash-Based Sharding (Most Common)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
Shard = hash(user_id) % num_shards

Example (4 shards):
User 12345 → hash(12345) = 789654 → 789654 % 4 = 2 → Shard 2
User 67890 → hash(67890) = 123456 → 123456 % 4 = 0 → Shard 0
\`\`\`

**Pros:**
- ✅ Uniform distribution (each shard gets ~25% of data)
- ✅ No hot spots (assuming good hash function)
- ✅ Simple routing logic

**Cons:**
- ❌ Range queries expensive (need to query all shards)
- ❌ Rebalancing is hard (changing num_shards reshuffles everything)
- ❌ Can't leverage locality

**When to Use:**
- Random access patterns (lookup by user_id)
- Uniform distribution critical
- No range queries needed
- **Example:** User data (profiles, settings), session storage

**Code Example:**
\`\`\`python
def get_shard(user_id, num_shards=4):
    return hash(user_id) % num_shards

def query_user(user_id):
    shard = get_shard(user_id)
    return shards[shard].query(f"SELECT * FROM users WHERE id = {user_id}")
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Strategy 2: Range-Based Sharding**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
Shard by date ranges:
Shard 0: 2020-01-01 to 2021-12-31
Shard 1: 2022-01-01 to 2023-12-31
Shard 2: 2024-01-01 to 2025-12-31
Shard 3: 2026-01-01 to future
\`\`\`

**Pros:**
- ✅ Range queries are fast (query single shard)
- ✅ Easy to add new shards (just add next range)
- ✅ Can archive old shards (move to cold storage)

**Cons:**
- ❌ Hot spots (recent data gets all writes)
- ❌ Uneven distribution (Shard 3 grows, Shard 0 idle)
- ❌ Requires rebalancing

**When to Use:**
- Time-series data (logs, metrics, events)
- Most queries are recent data
- Can archive old data
- **Example:** Log aggregation, analytics, IoT sensor data

**Code Example:**
\`\`\`python
def get_shard_by_date(timestamp):
    if timestamp < datetime(2022, 1, 1):
        return 0  # 2020-2021
    elif timestamp < datetime(2024, 1, 1):
        return 1  # 2022-2023
    else:
        return 2  # 2024+

def query_logs(start_date, end_date):
    # Only query shards with relevant date ranges
    shards_to_query = [s for s in range(3) if overlaps(s, start_date, end_date)]
    return [shards[s].query(...) for s in shards_to_query]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Strategy 3: Geo-Based Sharding (Regional)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How It Works:**
\`\`\`
Shard by geographic region:
Shard US-East:  North America users
Shard EU-West:  Europe users
Shard AP-South: Asia-Pacific users
\`\`\`

**Pros:**
- ✅ Low latency (data close to users)
- ✅ Data sovereignty (GDPR compliance - EU data stays in EU)
- ✅ Natural partitioning (users in same region interact)

**Cons:**
- ❌ Uneven distribution (US has 50% of users, Asia 10%)
- ❌ Cross-region queries are slow
- ❌ Rebalancing requires data migration

**When to Use:**
- Global user base
- Data sovereignty requirements (GDPR, CCPA)
- Low latency critical
- **Example:** Global SaaS, social media, e-commerce

**Code Example:**
\`\`\`python
def get_shard_by_region(user_id):
    user_region = get_user_region(user_id)  # Lookup in cache
    return REGION_SHARDS[user_region]

def query_user(user_id):
    shard = get_shard_by_region(user_id)
    return shards[shard].query(f"SELECT * FROM users WHERE id = {user_id}")
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Hot Spots & Rebalancing:**

**Hot Spot Problem:**
\`\`\`
Example: Shard by first letter of username
Shard A-F: 5TB (few users)
Shard G-M: 25TB (many users start with J, M) ❌ HOT SPOT
Shard N-Z: 20TB
\`\`\`

**Solution: Consistent Hashing**
- Uses virtual nodes to distribute load
- Adding/removing shards only reshuffles ~1/N of data
- Avoids hot spots

**Comparison Matrix:**

| Strategy      | Distribution | Range Queries | Hot Spots | Rebalancing | Use Case             |
|---------------|--------------|---------------|-----------|-------------|----------------------|
| Hash-based    | ✅ Uniform   | ❌ Expensive  | ✅ Rare   | ❌ Hard     | User data, random access |
| Range-based   | ❌ Uneven    | ✅ Fast       | ❌ Common | ✅ Easy     | Time-series, logs    |
| Geo-based     | ⚠️ Varies    | ❌ Cross-region slow | ⚠️ Regional imbalance | ❌ Hard | Global apps, GDPR |

**Your Task:**

You're building **Instagram** (global photo-sharing app):
- Dataset: 500TB (10B photos)
- Users: 2B users worldwide (50% US, 30% Europe, 20% Asia)
- Query pattern: Users mostly see their own + friends' photos (same region)
- Compliance: GDPR requires EU data stays in EU

**Analysis:**
- Dataset: ✅ Too large for single cluster
- Access pattern: ✅ Users mostly access same-region data
- Compliance: ✅ GDPR requires regional isolation
- Cross-region queries: ⚠️ Only friend recommendations (async job)

**Which sharding strategy?** ✅ **Geo-Based Sharding**

Shard by region:
- US-East: 250TB (50% of data)
- EU-West: 150TB (30% of data)
- AP-South: 100TB (20% of data)

Within each region, shard by user_id (hash-based):
- US-East: 10 shards × 25TB
- EU-West: 6 shards × 25TB
- AP-South: 4 shards × 25TB

**Expected Architecture:**
\`\`\`
US Users → US-East LB → US AppServers → US Shards (10 shards)
EU Users → EU-West LB → EU AppServers → EU Shards (6 shards)
AP Users → AP-South LB → AP AppServers → AP Shards (4 shards)
\`\`\`

**Learning Objectives:**
1. Understand the 3 main sharding strategies
2. Map query patterns to sharding strategy
3. Identify and avoid hot spots
4. Handle rebalancing and data migration`,

  userFacingFRs: [
    'Global photo-sharing app (Instagram-like)',
    'Users upload/view photos',
    'Users mostly see same-region content',
  ],

  userFacingNFRs: [
    'Dataset: 500TB (10B photos)',
    'Users: 2B worldwide (50% US, 30% EU, 20% Asia)',
    'Latency: P99 < 200ms (regional)',
    'Compliance: GDPR (EU data stays in EU)',
  ],

  clientDescriptions: [
    {
      name: 'US Client',
      subtitle: 'North America users',
      id: 'us_client',
    },
    {
      name: 'EU Client',
      subtitle: 'Europe users',
      id: 'eu_client',
    },
    {
      name: 'Asia Client',
      subtitle: 'Asia-Pacific users',
      id: 'asia_client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Regional traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool (with geo-aware shard routing)',
      },
      {
        type: 'storage',
        reason: 'Multiple regional database clusters (500TB total, ~20 shards across 3 regions). Need many storage nodes.',
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
        reason: 'AppServer routes to correct regional shard cluster',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-sharding-strategies', problemConfigs['nfr-ch0-sharding-strategies'] || {
    baseRps: 50000,
    readRatio: 0.95,
    maxLatency: 200,
    availability: 0.9999,
  }, [
    'Handle 500TB with geo-based sharding',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Multiple Storage Clusters',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length < 10) {
          return {
            valid: false,
            hint: '500TB dataset with geo-based sharding needs ~20 shards across 3 regions. You have ${storageNodes.length} storage nodes. Add more regional shards.',
          };
        }

        return {
          valid: true,
          details: {
            storageNodes: storageNodes.length,
            strategy: 'Geo-based sharding with regional clusters',
          },
        };
      },
    },
    {
      name: 'Sufficient Shards for Global Dataset',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        // For 500TB with geo-sharding, need ~20 shards (25TB per shard)
        const datasetSize = 500; // TB
        const shardCapacity = 25; // TB per shard
        const shardsNeeded = Math.ceil(datasetSize / shardCapacity);

        if (storageNodes.length < shardsNeeded) {
          return {
            valid: false,
            hint: `500TB global dataset needs at least ${shardsNeeded} shards (at 25TB per shard across 3 regions). You have ${storageNodes.length} storage nodes. Add more shards.`,
          };
        }

        return { valid: true };
      },
    },
  ],

  wizardFlow: {
    enabled: true,
    title: 'Sharding Strategies: Hash vs Range vs Geo',
    subtitle: 'Learn which sharding strategy fits your access patterns',
    objectives: [
      'Understand hash-based sharding (uniform distribution)',
      'Learn range-based sharding (time-series optimization)',
      'Master geo-based sharding (regional data sovereignty)',
      'Choose strategy based on query patterns and requirements',
    ],
    questions: [
      {
        id: 'use_case',
        step: 1,
        category: 'dataset_size',
        title: 'What type of application are you building?',
        description: 'Different applications have different access patterns. Let\'s identify yours.',
        questionType: 'single_choice',
        options: [
          {
            id: 'global_social',
            label: 'Global social media app (Instagram/Twitter)',
            description: 'Users worldwide, need low latency, GDPR compliance',
            consequence: 'Access pattern: Regional (users mostly see content from same region). Best: Geo-based sharding.',
          },
          {
            id: 'user_data',
            label: 'User profile system (random access by user_id)',
            description: 'Lookup users by ID, need uniform distribution',
            consequence: 'Access pattern: Random access (by user_id). Best: Hash-based sharding.',
          },
          {
            id: 'timeseries',
            label: 'Log aggregation / Analytics (time-series data)',
            description: 'Most queries are recent data, can archive old data',
            consequence: 'Access pattern: Time-based (recent data hot). Best: Range-based sharding by timestamp.',
          },
        ],
        whyItMatters: 'Your access pattern determines the sharding strategy! Social apps need geo-sharding for latency. User lookups need hash-sharding for uniform distribution. Logs need range-sharding for time-based queries.',
        commonMistakes: [
          'Using hash-based for time-series data (can\'t query date ranges efficiently)',
          'Using range-based for user data (creates hot spots)',
          'Ignoring GDPR requirements (geo-based sharding required for compliance)',
        ],
        onAnswer: (answer) => {
          if (answer === 'global_social') {
            return [{
              action: 'highlight',
              reason: 'Global app → Geo-based sharding! Users in US hit US shards, EU users hit EU shards (low latency + GDPR compliance).',
            }];
          } else if (answer === 'user_data') {
            return [{
              action: 'highlight',
              reason: 'Random access → Hash-based sharding! hash(user_id) % num_shards ensures uniform distribution.',
            }];
          } else {
            return [{
              action: 'highlight',
              reason: 'Time-series → Range-based sharding! Shard by date ranges (recent data on hot shards, archive old shards).',
            }];
          }
        },
      },
      {
        id: 'strategy_comparison',
        step: 2,
        category: 'dataset_size',
        title: 'Sharding Strategy Comparison',
        description: 'Let\'s compare the 3 main strategies and their trade-offs.',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'Hash-Based (user_id % N)',
            recommendation: '✅ Uniform distribution | ❌ Expensive range queries',
            reasoning: 'Best for: User profiles, session storage, random access. Avoids hot spots.',
          },
          {
            condition: 'Range-Based (date ranges)',
            recommendation: '✅ Fast range queries | ❌ Hot spots on recent data',
            reasoning: 'Best for: Logs, metrics, analytics. Can archive old shards to cold storage.',
          },
          {
            condition: 'Geo-Based (region)',
            recommendation: '✅ Low latency + GDPR | ❌ Uneven distribution',
            reasoning: 'Best for: Global apps. US has 50% of users, Asia 10% → unbalanced shards.',
          },
        ],
        whyItMatters: 'Each strategy optimizes for different things. Hash → uniform distribution. Range → efficient time queries. Geo → low latency + compliance.',
        commonMistakes: [
          'Thinking one strategy is "best" for all cases (it depends on access patterns!)',
          'Not considering compliance requirements (GDPR may FORCE geo-based sharding)',
          'Ignoring hot spot risks (range-based creates hot shards for recent data)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer routes traffic based on sharding strategy',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 12 },
              reason: 'App servers contain shard routing logic',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client connects to LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB distributes to app servers',
            },
          ];
        },
      },
      {
        id: 'hash_based_deep_dive',
        step: 3,
        category: 'dataset_size',
        title: 'Hash-Based Sharding (Most Common)',
        description: 'How does hash-based sharding work?',
        questionType: 'calculation',
        calculation: {
          formula: 'Shard = hash(user_id) % num_shards',
          explanation: 'Hash function distributes user IDs uniformly across shards.',
          exampleInputs: {
            'User ID': 12345,
            'Hash Result': 'hash(12345) = 789654',
            'Num Shards': 4,
          },
          exampleOutput: 'Shard = 789654 % 4 = 2 → Route to Shard 2',
        },
        whyItMatters: 'Hash-based sharding is the MOST COMMON strategy (90% of use cases). It guarantees uniform distribution and avoids hot spots (assuming good hash function).',
        commonMistakes: [
          'Using simple modulo without hashing (user_id % N creates patterns)',
          'Not using consistent hashing (adding shards reshuffles ALL data)',
          'Trying to do range queries on hashed data (requires querying ALL shards)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'storage',
              config: { count: 4 },
              reason: '4 database shards with uniform distribution via hash(user_id) % 4',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'storage',
              reason: 'App servers route to shard based on hash(user_id) % 4',
            },
          ];
        },
      },
      {
        id: 'range_based_deep_dive',
        step: 4,
        category: 'dataset_size',
        title: 'Range-Based Sharding (Time-Series)',
        description: 'When do you use range-based sharding?',
        questionType: 'single_choice',
        options: [
          {
            id: 'logs_analytics',
            label: 'Log aggregation and analytics',
            description: 'Shard by date: 2022 data → Shard 0, 2023 → Shard 1, 2024 → Shard 2',
            consequence: '✅ BEST! Range queries like "logs from Jan-Mar 2024" hit ONE shard. Old shards can be archived.',
          },
          {
            id: 'user_profiles',
            label: 'User profiles and authentication',
            description: 'Shard by user_id ranges: 0-250k → Shard 0, 250k-500k → Shard 1',
            consequence: '❌ BAD! Creates hot spots if new users cluster. Hash-based is better for random access.',
          },
          {
            id: 'ecommerce_products',
            label: 'E-commerce product catalog',
            description: 'Shard by product_id ranges: 0-10M → Shard 0, 10M-20M → Shard 1',
            consequence: '⚠️ RISKY! Hot spots if new products are popular. Hash-based safer unless you query by ranges.',
          },
        ],
        whyItMatters: 'Range-based sharding optimizes for RANGE QUERIES (e.g., "all logs from Jan-Mar"). But it creates HOT SPOTS because recent data gets all writes!',
        commonMistakes: [
          'Using range-based for random access (defeats uniform distribution)',
          'Not handling hot shards (recent data shard is overloaded)',
          'Forgetting to archive old shards (wasted capacity on cold data)',
        ],
        onAnswer: (answer) => {
          if (answer === 'logs_analytics') {
            return [{
              action: 'highlight',
              reason: '✅ Range-based for logs! Query "logs from Q1 2024" hits ONE shard. Archive 2022 shard to S3 (cold storage).',
            }];
          } else {
            return [{
              action: 'highlight',
              reason: `⚠️ Range-based for ${answer} creates hot spots! New users/products cluster in latest shard. Hash-based is safer.`,
            }];
          }
        },
      },
      {
        id: 'geo_based_deep_dive',
        step: 5,
        category: 'latency',
        title: 'Geo-Based Sharding (Global Apps)',
        description: 'You\'re building Instagram (500TB, 2B users: 50% US, 30% EU, 20% Asia). How to shard?',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'US Region (50% of data)',
            recommendation: 'US-East: 10 shards × 25TB = 250TB',
            reasoning: 'Shard by region, then by hash(user_id) within region',
          },
          {
            condition: 'EU Region (30% of data)',
            recommendation: 'EU-West: 6 shards × 25TB = 150TB',
            reasoning: 'GDPR requires EU data stays in EU (data sovereignty)',
          },
          {
            condition: 'Asia Region (20% of data)',
            recommendation: 'AP-South: 4 shards × 25TB = 100TB',
            reasoning: 'Low latency for Asia-Pacific users',
          },
        ],
        whyItMatters: 'Geo-based sharding solves 2 problems: (1) Low latency (data close to users), (2) Compliance (GDPR, CCPA require regional data storage). Trade-off: Uneven distribution (US has 50% of data).',
        commonMistakes: [
          'Not planning for uneven distribution (US has 5× more shards than Asia)',
          'Trying to do cross-region queries synchronously (use async jobs instead)',
          'Ignoring data sovereignty laws (GDPR fines up to 4% of revenue!)',
        ],
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'storage',
              config: { count: 20 },
              reason: '20 total shards: 10 (US) + 6 (EU) + 4 (Asia) for geo-based + hash sharding',
            },
            {
              action: 'highlight',
              reason: 'Architecture: 3 regional clusters. Within each region, hash-based sharding by user_id. US users hit US shards (low latency), EU data stays in EU (GDPR).',
            },
          ];
        },
      },
    ],
    summary: {
      title: 'Sharding Strategies Mastered!',
      keyTakeaways: [
        'Hash-based (90% of cases): Uniform distribution, good for random access (user profiles)',
        'Range-based (time-series): Fast range queries, but creates hot spots on recent data (logs)',
        'Geo-based (global apps): Low latency + GDPR compliance, but uneven distribution (Instagram)',
        'Formula: hash(key) % num_shards for uniform distribution',
        'Trade-off: Uniform distribution (hash) vs Query efficiency (range) vs Latency (geo)',
      ],
      nextSteps: 'Next: Learn consistency models (read-after-write, monotonic reads) in Module 6!',
    },
  },
};

// ============================================================================
// Module 6: Consistency Models & Guarantees
// ============================================================================

/**
 * Problem 14: Read-After-Write Consistency & Session Guarantees
 *
 * Teaches:
 * - Read-after-write consistency (user sees their own writes)
 * - Monotonic reads (time doesn't go backward)
 * - Monotonic writes (writes happen in order)
 * - Consistent prefix reads (see causally related writes)
 * - Techniques: sticky sessions, read-from-leader, version tracking
 *
 * Learning Flow:
 * 1. User has: Client → LB → AppServers → Primary + Replicas
 * 2. Problem: User writes data, immediately reads → sees stale data
 * 3. Why: Replica lag (100ms-1s)
 * 4. Solution: Read-after-write consistency techniques
 */
export const readAfterWriteConsistencyProblem: ProblemDefinition = {
  id: 'nfr-ch0-read-after-write',
  title: 'Read-After-Write Consistency: Solving the Stale Read Problem',
  description: `You've added read replicas to scale reads (from Module 3). But users are reporting a strange bug: "I just updated my profile, but when I refresh, I see the old data!"

**The Problem: Replication Lag**

**Current Architecture:**
\`\`\`
Client → LB → AppServer Pool → Primary DB (writes)
                                    ├─(async repl, 500ms lag)─> Replica 1 (reads)
                                    ├─(async repl, 500ms lag)─> Replica 2 (reads)
                                    └─(async repl, 500ms lag)─> Replica 3 (reads)
\`\`\`

**What Happens:**
\`\`\`
12:00:00.000 - User updates profile: "New bio text"
12:00:00.010 - Write goes to Primary DB ✅
12:00:00.020 - User refreshes page
12:00:00.030 - Read from Replica 1 (still has old data) ❌
12:00:00.500 - Replication completes, Replica 1 gets new data

User sees OLD bio for 500ms! 😡
\`\`\`

**Why This Happens:**
- Writes go to PRIMARY (strong consistency)
- Reads go to REPLICAS (eventual consistency, 100ms-1s lag)
- User's read happens BEFORE replication completes

**Four Session Guarantees to Fix This:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**1. Read-After-Write Consistency (Read Your Own Writes)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Guarantee:** Users ALWAYS see data they just wrote (but may see stale data from other users)

**Technique 1: Read-From-Leader After Write**
\`\`\`python
def update_profile(user_id, new_bio):
    # Write to primary
    primary_db.write(user_id, new_bio)

    # Mark this user to read from primary for next 1 second
    redis.set(f"read_from_leader:{user_id}", "true", ttl=1)

def get_profile(user_id):
    # Check if user just wrote
    if redis.get(f"read_from_leader:{user_id}"):
        return primary_db.read(user_id)  # Read from leader
    else:
        return replica_db.read(user_id)  # Read from replica (cheaper)
\`\`\`

**Pros:**
- ✅ User always sees their own writes
- ✅ Only affects users who just wrote (doesn't overload primary)

**Cons:**
- ⚠️ Need to track "last write time" per user
- ⚠️ More load on primary for recent writers

**Technique 2: Sticky Sessions (Same Replica)**
\`\`\`python
def get_replica_for_user(user_id):
    # Always route same user to same replica
    return replicas[hash(user_id) % len(replicas)]

def update_profile(user_id, new_bio):
    primary_db.write(user_id, new_bio)
    # User's next read goes to their sticky replica
    # (will see new data once replication completes)
\`\`\`

**Pros:**
- ✅ Simple (just hash user_id)
- ✅ Helps with cache locality

**Cons:**
- ❌ Doesn't guarantee immediate consistency (still 500ms lag)
- ❌ Only helps if user keeps hitting same replica

**Technique 3: Version Tracking (Wait for Replica to Catch Up)**
\`\`\`python
def update_profile(user_id, new_bio):
    # Write returns version number (LSN = log sequence number)
    version = primary_db.write(user_id, new_bio)

    # Store user's last write version in session
    session.set("last_write_version", version)

def get_profile(user_id):
    last_write_version = session.get("last_write_version")

    # Read from replica, but WAIT until it's caught up
    replica = get_replica()
    while replica.current_version < last_write_version:
        time.sleep(0.01)  # Wait 10ms

    return replica.read(user_id)
\`\`\`

**Pros:**
- ✅ Guarantees read-after-write consistency
- ✅ Still uses replicas (doesn't overload primary)

**Cons:**
- ⚠️ Adds latency (up to replication lag)
- ⚠️ Need version tracking in replicas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**2. Monotonic Reads (Time Never Goes Backward)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Problem:**
\`\`\`
12:00:00.000 - User reads from Replica 1 (has version 100)
12:00:00.500 - User reads from Replica 2 (has version 95) ❌
User sees OLDER data! Time went backward!
\`\`\`

**Guarantee:** Once a user reads version N, all future reads are ≥ version N

**Solution: Sticky Sessions (Same Replica)**
\`\`\`python
# Always route user to same replica
def get_replica(user_id):
    return replicas[hash(user_id) % len(replicas)]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**3. Monotonic Writes (Writes Happen in Order)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Problem (Multi-Leader Replication):**
\`\`\`
US Region: User writes "Post 1" at 12:00:00.000
US Region: User writes "Post 2" at 12:00:00.100

EU Region receives Post 2 BEFORE Post 1 (network delay)
EU users see posts in wrong order! ❌
\`\`\`

**Guarantee:** User's writes appear in the order they were submitted

**Solution: Causality Tracking**
\`\`\`python
def write_post(user_id, content):
    # Include previous post ID to maintain order
    last_post_id = get_user_last_post_id(user_id)

    new_post = {
        "id": generate_id(),
        "user_id": user_id,
        "content": content,
        "previous_post_id": last_post_id,  # Causal dependency
    }

    db.write(new_post)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**4. Consistent Prefix Reads (See Causally Related Writes)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Problem (Sharded Database):**
\`\`\`
User A writes: "I love dogs!" → Shard 1
User B replies: "Me too!"    → Shard 2 (faster replication)

Observer sees:
- User B: "Me too!" (from Shard 2, fast replica)
- User A: ??? (from Shard 1, slow replica)

Observer sees reply BEFORE original message! ❌
\`\`\`

**Guarantee:** If write B causally depends on write A, everyone sees A before B

**Solution: Global Ordering (Lamport Timestamps)**
\`\`\`python
def write_with_timestamp(data):
    timestamp = get_lamport_timestamp()  # Globally ordered
    db.write(data, timestamp)

def read_consistent_prefix():
    # Read from all shards, sort by timestamp
    results = []
    for shard in shards:
        results.extend(shard.read())

    return sorted(results, key=lambda x: x.timestamp)
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Comparison Matrix:**

| Guarantee              | What It Fixes                     | Technique                     | Cost              |
|------------------------|-----------------------------------|-------------------------------|-------------------|
| Read-After-Write       | User sees their own writes        | Read-from-leader, versions    | Medium (1s delay) |
| Monotonic Reads        | Time doesn't go backward          | Sticky sessions               | Low (routing)     |
| Monotonic Writes       | Writes in order                   | Causality tracking            | Medium (metadata) |
| Consistent Prefix      | Causally related writes in order  | Global ordering (Lamport)     | High (coordination) |

**Your Task:**

You're building **Twitter**:
- Users post tweets
- Users immediately see their own tweets in their feed
- Users refresh → should ALWAYS see tweets they just posted

**Problem:**
- Writes → Primary DB
- Reads → Replicas (500ms lag)
- User posts tweet, refreshes, tweet is missing ❌

**Which technique?** ✅ **Read-From-Leader After Write**

**Expected Architecture:**
\`\`\`
Client → LB → AppServer → Cache (track recent writers)
                             ↓
                          Primary DB (writes + reads for recent writers)
                             ↓
                    ┌────────┼────────┐
                    ▼        ▼        ▼
              Replica 1  Replica 2  Replica 3 (reads for everyone else)
\`\`\`

**Implementation:**
\`\`\`python
def post_tweet(user_id, content):
    # Write to primary
    primary_db.write(user_id, content)

    # Mark user to read from primary for next 2 seconds
    redis.set(f"recent_writer:{user_id}", "true", ttl=2)

def get_feed(user_id):
    # Check if user just wrote
    if redis.get(f"recent_writer:{user_id}"):
        return primary_db.read_feed(user_id)  # Read from leader
    else:
        return replica_db.read_feed(user_id)  # Read from replica
\`\`\`

**Learning Objectives:**
1. Understand the 4 session guarantees
2. Know when to read from leader vs replica
3. Implement read-after-write consistency
4. Trade-off: consistency vs performance`,

  userFacingFRs: [
    'Users can post tweets',
    'Users can view their feed',
    'Users must immediately see their own tweets',
  ],

  userFacingNFRs: [
    'Read-after-write consistency: User always sees their own writes',
    'Replication lag: 500ms (async replication to replicas)',
    'Read latency: P99 < 100ms',
  ],

  clientDescriptions: [
    {
      name: 'Twitter Client',
      subtitle: 'Post & view tweets',
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
        reason: 'AppServer pool (tracks recent writers)',
      },
      {
        type: 'cache',
        reason: 'Redis to track recent writers (read-from-leader flag)',
      },
      {
        type: 'storage',
        reason: 'Primary + Replicas. Need multiple storage nodes for read scaling + read-after-write consistency.',
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
        reason: 'Check if user recently wrote (read-from-leader flag)',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'If recent writer → read from primary, else → read from replica',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-read-after-write', problemConfigs['nfr-ch0-read-after-write'] || {
    baseRps: 20000,
    readRatio: 0.9, // 90% reads, 10% writes
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Ensure read-after-write consistency',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Cache for Recent Writer Tracking',
      validate: (graph, scenario, problem) => {
        const cacheNodes = graph.components.filter(n => n.type === 'cache');

        if (cacheNodes.length === 0) {
          return {
            valid: false,
            hint: 'To implement read-after-write consistency, you need to track recent writers. Add Redis cache to store "recent_writer:{user_id}" flags with 1-2s TTL.',
          };
        }

        return { valid: true };
      },
    },
    {
      name: 'Primary + Replicas for Read-After-Write',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length < 2) {
          return {
            valid: false,
            hint: 'Read-after-write consistency requires: (1) Primary DB for writes + recent reader reads, (2) Replicas for everyone else. Add at least 1 primary + 1 replica.',
          };
        }

        return {
          valid: true,
          details: {
            pattern: 'Read-from-leader after write',
            storageNodes: storageNodes.length,
          },
        };
      },
    },
  ],

  wizardFlow: {
    enabled: true,
    title: 'Read-After-Write Consistency',
    subtitle: 'Learn session guarantees and how to implement them',

    objectives: [
      'Understand the 4 session guarantees',
      'Learn 3 techniques: read-from-leader, sticky sessions, version tracking',
      'Implement read-after-write consistency with Redis',
      'Know when read-after-write is needed vs eventual consistency',
    ],

    questions: [
      {
        id: 'consistency_problem',
        step: 1,
        category: 'consistency',
        title: 'The Consistency Problem',
        description: 'User posts a tweet and immediately refreshes. Will they see their own tweet?',
        questionType: 'single_choice',
        options: [
          {
            id: 'always_yes',
            label: 'Always YES (by default)',
            description: 'Databases automatically show you what you wrote',
            consequence: '❌ WRONG! With replicas, your read might go to a replica that hasn\'t synced yet.',
          },
          {
            id: 'maybe',
            label: 'MAYBE (depends on architecture)',
            description: 'You might or might not see your write',
            consequence: '✅ CORRECT! With replication lag, you might read from a stale replica.',
          },
          {
            id: 'always_no',
            label: 'Always NO',
            description: 'Distributed systems never show your own writes',
            consequence: '❌ WRONG! We can implement read-after-write with the right techniques.',
          },
        ],
        whyItMatters: 'This is the READ-AFTER-WRITE problem. With database replication, writes go to the PRIMARY but reads can go to REPLICAS. Replication lag = stale data!',
        commonMistakes: [
          'Assuming databases "just work" (ignoring replication lag)',
          'Not testing consistency in distributed environments',
        ],
        onAnswer: (answer) => {
          return [
            {
              action: 'highlight',
              reason: 'With replicas, replication lag can cause users to NOT see their own writes immediately!',
            },
          ];
        },
      },
      {
        id: 'session_guarantees',
        step: 2,
        category: 'consistency',
        title: 'The 4 Session Guarantees',
        description: 'There are 4 types of consistency guarantees for user sessions:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: '1. Read-After-Write',
            recommendation: 'User sees their own writes',
            reasoning: 'After I post a tweet, I MUST see it when I refresh',
          },
          {
            condition: '2. Monotonic Reads',
            recommendation: 'Reads never go backwards in time',
            reasoning: 'If I saw a tweet once, I will ALWAYS see it (no time travel)',
          },
          {
            condition: '3. Monotonic Writes',
            recommendation: 'Writes happen in order',
            reasoning: 'If I post Tweet A then Tweet B, they appear in that order',
          },
          {
            condition: '4. Consistent Prefix Reads',
            recommendation: 'See writes in causal order',
            reasoning: 'If someone replies to Tweet A, you see Tweet A first',
          },
        ],
        whyItMatters: 'Read-after-write is the MOST important guarantee. Users expect to see their own writes immediately!',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Today we\'re implementing Read-After-Write consistency (guarantee #1).',
            },
          ];
        },
      },
      {
        id: 'implementation_choice',
        step: 3,
        category: 'consistency',
        title: 'Choose Implementation Technique',
        description: 'There are 3 ways to implement read-after-write consistency:',
        questionType: 'single_choice',
        options: [
          {
            id: 'read_from_leader',
            label: '1. Read-from-Leader (after write)',
            description: 'Track recent writers, route their reads to PRIMARY',
            consequence: '✅ Best approach! Use Redis to track recent writers (30s TTL). If user wrote recently → read from PRIMARY, else → read from REPLICA.',
          },
          {
            id: 'sticky_sessions',
            label: '2. Sticky Sessions',
            description: 'Route user to same replica always',
            consequence: '⚠️ Doesn\'t guarantee read-after-write (replica might still be stale). Use for monotonic reads instead.',
          },
          {
            id: 'version_tracking',
            label: '3. Version Tracking',
            description: 'Client tracks version, waits for replica to catch up',
            consequence: '⚠️ Complex! Client must track versions and retry. Only use for strict ordering requirements.',
          },
        ],
        whyItMatters: 'Read-from-leader is the simplest and most reliable approach. Track who wrote recently, route their reads to the PRIMARY (source of truth).',
        commonMistakes: [
          'Using sticky sessions (doesn\'t solve read-after-write)',
          'Always reading from PRIMARY (defeats the purpose of replicas)',
          'Not setting TTL on writer tracking (memory leak)',
        ],
        onAnswer: (answer) => {
          if (answer === 'read_from_leader') {
            return [
              {
                action: 'highlight',
                reason: 'Read-from-leader: We\'ll use Redis to track recent writers for 30 seconds!',
              },
            ];
          } else {
            return [
              {
                action: 'highlight',
                reason: 'Consider read-from-leader instead - it\'s simpler and more reliable!',
              },
            ];
          }
        },
      },
      {
        id: 'architecture_design',
        step: 4,
        category: 'consistency',
        title: 'Build the Architecture',
        description: 'Let\'s implement read-from-leader with Redis tracking:',
        questionType: 'calculation',
        calculation: {
          formula: 'if (redis.exists("recent_writer:" + user_id)) { read from PRIMARY } else { read from REPLICA }',
          explanation: 'After a write, set Redis key with 30s TTL. Reads check Redis first.',
          exampleInputs: {
            'On Write': 'redis.setex("recent_writer:user123", 30, "1")',
            'On Read': 'if (redis.exists("recent_writer:user123")) → PRIMARY else → REPLICA',
            'After 30s': 'TTL expires → back to REPLICA (faster reads)',
          },
          exampleOutput: 'Read-after-write guaranteed for 30 seconds post-write',
        },
        whyItMatters: '30-second TTL is enough for users to see their own write immediately, then we route back to replicas for performance.',
        onAnswer: () => {
          return [
            {
              action: 'add_component',
              componentType: 'load_balancer',
              reason: 'Load balancer to route traffic.',
            },
            {
              action: 'add_component',
              componentType: 'compute',
              config: { count: 3 },
              reason: 'App servers to handle requests.',
            },
            {
              action: 'add_component',
              componentType: 'cache',
              reason: 'Redis to track recent writers (recent_writer:{user_id} with 30s TTL).',
            },
            {
              action: 'add_component',
              componentType: 'storage',
              reason: 'PostgreSQL Primary (writes + recent-writer reads).',
            },
            {
              action: 'add_component',
              componentType: 'storage',
              reason: 'PostgreSQL Replica (regular reads).',
            },
            {
              action: 'add_connection',
              from: 'client',
              to: 'load_balancer',
              reason: 'Client → LB',
            },
            {
              action: 'add_connection',
              from: 'load_balancer',
              to: 'compute',
              reason: 'LB → App Servers',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'cache',
              reason: 'App Server checks Redis for recent writer flag.',
            },
            {
              action: 'add_connection',
              from: 'compute',
              to: 'storage',
              reason: 'App Server writes to PRIMARY, reads from PRIMARY if recent writer.',
            },
          ];
        },
      },
      {
        id: 'flow_walkthrough',
        step: 5,
        category: 'consistency',
        title: 'Read-After-Write Flow',
        description: 'Here\'s how read-after-write works step-by-step:',
        questionType: 'decision_matrix',
        decisionMatrix: [
          {
            condition: 'User posts tweet (WRITE)',
            recommendation: '1. Write to PRIMARY\n2. Set Redis: recent_writer:user123 = 1 (30s TTL)',
            reasoning: 'Mark this user as a recent writer',
          },
          {
            condition: 'User refreshes immediately (READ)',
            recommendation: '1. Check Redis: recent_writer:user123 exists\n2. READ FROM PRIMARY',
            reasoning: 'Recent writer → read from source of truth',
          },
          {
            condition: 'User refreshes after 31 seconds (READ)',
            recommendation: '1. Check Redis: recent_writer:user123 expired\n2. READ FROM REPLICA',
            reasoning: 'Not recent anymore → use fast replica reads',
          },
        ],
        whyItMatters: 'This pattern gives you consistency when you need it (immediately after write) and performance when you don\'t (regular reads).',
        onAnswer: () => {
          return [
            {
              action: 'highlight',
              reason: 'Read-from-leader pattern: Recent writers → PRIMARY, everyone else → REPLICA!',
            },
          ];
        },
      },
    ],

    summary: {
      title: 'Read-After-Write Consistency Complete!',
      keyTakeaways: [
        '4 session guarantees: Read-after-write, Monotonic reads, Monotonic writes, Consistent prefix',
        'Read-after-write = users see their own writes immediately',
        'Implementation: Track recent writers in Redis (30s TTL)',
        'Read flow: Recent writer → PRIMARY, else → REPLICA',
        'Trade-off: Consistency for recent writers, performance for everyone else',
      ],
      nextSteps: 'Next: Learn about consistency LEVELS (Linearizability, Causal, Eventual)!',
    },
  },
};

/**
 * Problem 15: Consistency Levels - Strong vs Eventual vs Causal
 *
 * Teaches:
 * - Consistency spectrum: Strong → Causal → Eventual
 * - Linearizability (strongest consistency)
 * - Eventual consistency (weakest, highest performance)
 * - Causal consistency (middle ground)
 * - Trade-offs: consistency vs availability vs latency
 * - CAP theorem implications
 *
 * Learning Flow:
 * 1. User has distributed system with replicas
 * 2. Ask: How consistent should reads be?
 * 3. Trade-off: Consistency vs Performance vs Availability
 * 4. Solution: Choose consistency level based on use case
 */
export const consistencyLevelsProblem: ProblemDefinition = {
  id: 'nfr-ch0-consistency-levels',
  title: 'Consistency Levels: Strong vs Eventual vs Causal Trade-offs',
  description: `You've built a distributed system with replicas. Now: How consistent should it be?

**The Consistency Spectrum:**

\`\`\`
Stronger Consistency ←──────────────────────────→ Weaker Consistency
(slower, less available)                      (faster, more available)

Linearizable > Sequential > Causal > Eventual > No Guarantees
\`\`\`

**Three Main Consistency Levels:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 1: Strong Consistency (Linearizability)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Guarantee:** All operations appear to execute atomically in some sequential order that respects real-time ordering.

**In Simple Terms:**
- Every read sees the most recent write
- System behaves like a single copy of data
- As if there's only ONE database (even though there are replicas)

**How It Works:**
\`\`\`
1. Write goes to primary
2. Primary synchronously replicates to ALL replicas
3. Write returns success ONLY after all replicas acknowledge
4. Any subsequent read (from ANY replica) sees the new value
\`\`\`

**Example (Banking):**
\`\`\`
12:00:00.000 - User deposits $100 → Primary
12:00:00.010 - Primary replicates to Replica 1, 2, 3 (sync)
12:00:00.050 - All replicas acknowledge
12:00:00.060 - Write returns success
12:00:00.061 - ANY read from ANY replica sees new balance ✅
\`\`\`

**Performance:**
- Write latency: **50-200ms** (wait for all replicas)
- Read latency: **5-20ms** (can read from any replica)
- Throughput: **Lower** (synchronous replication bottleneck)

**Pros:**
- ✅ No stale reads (always see latest data)
- ✅ Easier to reason about (behaves like single machine)
- ✅ Safe for critical data (money, inventory)

**Cons:**
- ❌ Slower writes (wait for replication)
- ❌ Lower availability (if any replica down, can't write)
- ❌ Network partitions block writes (CAP theorem: CP system)

**When to Use:**
- Banking, payment processing
- Inventory management (can't oversell)
- Coordination services (locks, leader election)

**Technologies:**
- Google Spanner (global strong consistency)
- etcd, ZooKeeper (consensus-based)
- PostgreSQL synchronous replication

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 2: Causal Consistency (Middle Ground)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Guarantee:** Operations that are causally related appear in the same order to all nodes.

**In Simple Terms:**
- If Event B depends on Event A, everyone sees A before B
- Independent events can be seen in any order

**Example (Social Media):**
\`\`\`
Alice posts: "Check out this photo!" → Post A
Bob replies: "Nice photo!"          → Post B (depends on A)
Carol posts: "What's for lunch?"    → Post C (independent)

Causal Consistency Guarantees:
- Everyone sees Post A before Post B ✅ (causal dependency)
- Post C can appear anywhere ⚠️ (independent)
\`\`\`

**How It Works:**
\`\`\`
1. Track causality with vector clocks or Lamport timestamps
2. Replicas apply writes respecting causal order
3. Independent writes can happen in any order
\`\`\`

**Performance:**
- Write latency: **10-50ms** (async replication + causality tracking)
- Read latency: **5-20ms**
- Throughput: **High** (async replication)

**Pros:**
- ✅ Captures "happens-before" relationships
- ✅ Better performance than strong consistency
- ✅ More intuitive than eventual consistency

**Cons:**
- ⚠️ Complex implementation (vector clocks, causality tracking)
- ⚠️ Still possible to see stale data (if not causally related)

**When to Use:**
- Social media (comments, replies)
- Collaborative editing (Google Docs)
- Chat applications

**Technologies:**
- Riak (optional causal consistency)
- Azure Cosmos DB (session consistency level)
- COPS (Causal+ consistency system)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Level 3: Eventual Consistency (Weakest, Fastest)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Guarantee:** If no new writes, all replicas EVENTUALLY converge to the same value.

**In Simple Terms:**
- Writes propagate asynchronously
- Reads may see stale data
- Eventually (seconds to minutes), all replicas agree

**Example (DNS):**
\`\`\`
12:00:00.000 - Update DNS: example.com → 1.2.3.4
12:00:01.000 - Some users resolve to OLD IP (stale cache)
12:00:05.000 - Some users resolve to NEW IP
12:05:00.000 - All users eventually see NEW IP ✅
\`\`\`

**How It Works:**
\`\`\`
1. Write to any replica (or primary)
2. Replica returns success immediately
3. Background process replicates to other replicas
4. Reads from different replicas may return different values
\`\`\`

**Performance:**
- Write latency: **1-10ms** (no waiting for replication)
- Read latency: **1-10ms**
- Throughput: **Very High** (no synchronization)

**Pros:**
- ✅ Fastest writes (async replication)
- ✅ Highest availability (works during partitions)
- ✅ Best performance (CAP theorem: AP system)

**Cons:**
- ❌ Stale reads (may see old data)
- ❌ Write conflicts (concurrent writes to different replicas)
- ❌ Hard to reason about (non-deterministic)

**When to Use:**
- Read-heavy workloads (product catalog, news feeds)
- High availability critical (DNS, CDN)
- Approximate data OK (view counts, likes)

**Technologies:**
- DynamoDB (eventual consistency default)
- Cassandra (tunable consistency)
- DNS, CDNs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Trade-off Matrix:**

| Level              | Write Latency | Read Staleness | Availability | Use Case              |
|--------------------|---------------|----------------|--------------|------------------------|
| Linearizable       | 50-200ms      | Never stale    | Low (CP)     | Banking, inventory     |
| Causal             | 10-50ms       | Causally fresh | Medium       | Social media, chat     |
| Eventual           | 1-10ms        | May be stale   | High (AP)    | Catalogs, feeds        |

**CAP Theorem:**
- **Strong consistency:** Choose Consistency + Partition Tolerance (CP)
  - Sacrifice Availability during partitions
- **Eventual consistency:** Choose Availability + Partition Tolerance (AP)
  - Sacrifice Consistency for availability

**Your Task:**

You're building **Amazon Product Catalog**:
- 10 million products
- 100k writes/day (product updates)
- 1 billion reads/day (users browsing)
- Global users (US, Europe, Asia)
- Occasional stale data is acceptable (user sees old price for a few seconds)

**Analysis:**
- Read-heavy: 99.99% reads
- Write frequency: Low
- Stale reads: ✅ Acceptable (product info changes slowly)
- Availability: ✅ Critical (can't block browsing)
- Global scale: ✅ Need low latency everywhere

**Which consistency level?** ✅ **Eventual Consistency**

**Why:**
- Reads are 99.99% → optimize for read performance
- Stale data OK (price changes don't need instant propagation)
- High availability > strong consistency
- Global replicas with async replication

**Expected Architecture:**
\`\`\`
US Users → US Region:
             Primary DB (writes)
                ├─(async repl)─> Replica 1 (reads)
                └─(async repl)─> Replica 2 (reads)

EU Users → EU Region:
             Replica 3 (reads, async from US primary)
             Replica 4 (reads, async from US primary)

Asia Users → Asia Region:
             Replica 5 (reads, async from US primary)
             Replica 6 (reads, async from US primary)
\`\`\`

**Learning Objectives:**
1. Understand the consistency spectrum
2. Map use cases to consistency levels
3. Know CAP theorem trade-offs
4. Choose consistency based on requirements`,

  userFacingFRs: [
    'Global product catalog (Amazon-like)',
    'Users browse products (read-heavy)',
    'Admins update product info (low write frequency)',
  ],

  userFacingNFRs: [
    'Dataset: 10M products',
    'Reads: 1B/day (99.99% of traffic)',
    'Writes: 100k/day (0.01% of traffic)',
    'Stale reads acceptable (eventual consistency OK)',
    'Global latency: P99 < 200ms',
  ],

  clientDescriptions: [
    {
      name: 'US Client',
      subtitle: 'Browse products',
      id: 'us_client',
    },
    {
      name: 'EU Client',
      subtitle: 'Browse products',
      id: 'eu_client',
    },
    {
      name: 'Asia Client',
      subtitle: 'Browse products',
      id: 'asia_client',
    },
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Regional traffic distribution',
      },
      {
        type: 'compute',
        reason: 'AppServer pool',
      },
      {
        type: 'storage',
        reason: 'Primary DB + multiple global replicas (eventual consistency). Need many storage nodes for global read scaling.',
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
        reason: 'Reads from regional replicas (eventual consistency)',
      },
    ],
  },

  scenarios: generateScenarios('nfr-ch0-consistency-levels', problemConfigs['nfr-ch0-consistency-levels'] || {
    baseRps: 100000,
    readRatio: 0.9999, // 99.99% reads
    maxLatency: 200,
    availability: 0.999,
  }, [
    'Global catalog with eventual consistency',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
    {
      name: 'Multiple Regional Replicas',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        if (storageNodes.length < 3) {
          return {
            valid: false,
            hint: 'For global eventual consistency, need replicas in multiple regions (US, EU, Asia). Add at least 3-6 storage nodes for regional replication.',
          };
        }

        return {
          valid: true,
          details: {
            storageNodes: storageNodes.length,
            consistencyLevel: 'Eventual consistency (AP system)',
          },
        };
      },
    },
    {
      name: 'Sufficient Replicas for Global Scale',
      validate: (graph, scenario, problem) => {
        const storageNodes = graph.components.filter(n => n.type === 'storage');

        // For 100k RPS globally, need enough replicas (~10 at 10k reads/sec each)
        const readRps = 100000;
        const readsPerReplica = 10000;
        const replicasNeeded = Math.ceil(readRps / readsPerReplica);

        if (storageNodes.length < replicasNeeded) {
          return {
            valid: false,
            hint: `For 100k global read RPS, need at least ${replicasNeeded} replicas at 10k reads/sec each. You have ${storageNodes.length} storage nodes. Add more regional replicas.`,
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
  // Module 5: Dataset Size & Sharding (2 problems)
  shardingRequirementProblem,
  shardingStrategiesProblem,
  // Module 6: Consistency Models & Guarantees (2 problems)
  readAfterWriteConsistencyProblem,
  consistencyLevelsProblem,
];
