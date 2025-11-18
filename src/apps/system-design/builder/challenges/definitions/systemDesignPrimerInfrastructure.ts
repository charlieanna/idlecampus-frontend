import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../validation/validators/featureValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * System Design Primer - Infrastructure Concepts
 * Total: 48 problems covering Performance, DNS, CDN, Load Balancers, Reverse Proxy, and Application Layer
 *
 * Source: https://github.com/donnemartin/system-design-primer
 */

// ============================================================================
// 1. Performance & Scalability (10 problems)
// ============================================================================

/**
 * Problem 1: Performance vs Scalability
 * Teaches: Distinguish between performance and scalability optimization
 */
export const performanceVsScalabilityProblem: ProblemDefinition = {
  id: 'sdp-performance-vs-scalability',
  title: 'Performance vs Scalability',
  description: `Understand the difference between performance and scalability. A service is scalable if it results in increased performance in a manner proportional to resources added. Generally, increasing performance means serving more units of work, but it can also be to handle larger units of work, such as when datasets grow.

Learning objectives:
- Differentiate between performance (single-user latency) and scalability (handling more users)
- Optimize for performance: Make a slow system fast for a single user
- Optimize for scalability: Make a fast system handle more concurrent users
- Understand when to focus on each

Example:
- Performance problem: A query takes 5 seconds for one user
- Scalability problem: System is fast for 10 users but slow for 1000 users

Key requirements:
- Measure single-user latency (performance)
- Measure throughput at various loads (scalability)
- Identify bottlenecks in both dimensions`,

  userFacingFRs: [
    'Measure baseline performance (p99 latency) for single user',
    'Scale system to handle 10x, 100x, 1000x users',
    'Identify performance bottlenecks (slow queries, inefficient code)',
    'Identify scalability bottlenecks (CPU, memory, I/O limits)',
  ],
  userFacingNFRs: [
    'Performance: p99 latency < 200ms for single user',
    'Scalability: Maintain p99 < 500ms at 1000 RPS',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers to handle requests',
      },
      {
        type: 'storage',
        reason: 'Database for data persistence',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Route requests to application',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Query database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-performance-vs-scalability', problemConfigs['sdp-performance-vs-scalability'] || {
    baseRps: 100,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Measure baseline performance',
    'Scale to 100 RPS',
    'Scale to 1000 RPS',
    'Optimize for both performance and scalability',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 2: Latency vs Throughput
 * Teaches: Optimize for low latency OR high throughput (often trade-offs)
 */
export const latencyVsThroughputProblem: ProblemDefinition = {
  id: 'sdp-latency-vs-throughput',
  title: 'Latency vs Throughput',
  description: `Latency is the time to perform some action or to produce some result. Throughput is the number of such actions or results per unit of time. Generally, you should aim for maximal throughput with acceptable latency.

Learning objectives:
- Understand latency (time per request) vs throughput (requests per second)
- Recognize the trade-off: batching increases throughput but raises latency
- Optimize for low latency (real-time systems, user-facing APIs)
- Optimize for high throughput (batch processing, analytics)
- Find the sweet spot for your use case

Examples:
- Low latency priority: Payment processing, gaming, chat (< 100ms)
- High throughput priority: ETL jobs, log processing, video encoding (batch many at once)

Key requirements:
- Measure latency (p50, p95, p99)
- Measure throughput (RPS)
- Experiment with batching (increases throughput, adds latency)`,

  userFacingFRs: [
    'Design for low-latency real-time requests (no batching)',
    'Design for high-throughput batch processing (batch many requests)',
    'Implement request batching with configurable batch size',
    'Monitor latency percentiles (p50, p95, p99)',
  ],
  userFacingNFRs: [
    'Low latency mode: p99 < 50ms, throughput = 100 RPS',
    'High throughput mode: p99 < 500ms, throughput = 5000 RPS',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers with batching logic',
      },
      {
        type: 'storage',
        reason: 'Database for batch writes',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Batch database operations',
      },
    ],
  },

  scenarios: generateScenarios('sdp-latency-vs-throughput', problemConfigs['sdp-latency-vs-throughput'] || {
    baseRps: 1000,
    readRatio: 0.5,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Low latency mode (no batching)',
    'Moderate batching (batch size = 10)',
    'High throughput mode (batch size = 100)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 3: Availability vs Consistency (CAP Theorem)
 * Teaches: CAP theorem trade-offs in distributed systems
 */
export const capTheoremProblem: ProblemDefinition = {
  id: 'sdp-cap-theorem',
  title: 'Availability vs Consistency (CAP Theorem)',
  description: `CAP Theorem: In a distributed system, you can only guarantee 2 out of 3:
- Consistency: Every read receives the most recent write
- Availability: Every request receives a response (even if stale)
- Partition tolerance: System continues despite network partitions

Since partitions are inevitable in distributed systems, you must choose between CP (consistent but unavailable during partitions) or AP (available but potentially inconsistent).

Learning objectives:
- Understand CAP theorem constraints
- Design CP system (consistent, unavailable during partition)
- Design AP system (available, eventually consistent)
- Choose based on business requirements

Examples:
- CP: Banking (need consistency for account balances)
- AP: Social media feed (availability more important than seeing latest post immediately)

Key requirements:
- Configure consistency level (strong vs eventual)
- Handle network partitions
- Measure consistency lag and availability`,

  userFacingFRs: [
    'Implement strong consistency (CP) - synchronous replication',
    'Implement eventual consistency (AP) - asynchronous replication',
    'Simulate network partition between regions',
    'Measure consistency lag (replication delay)',
  ],
  userFacingNFRs: [
    'CP system: 100% consistency, availability drops during partition',
    'AP system: 99.99% availability, consistency lag up to 5 seconds',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers',
      },
      {
        type: 'storage',
        reason: 'Distributed database with replication',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Send read/write requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Access replicated database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-cap-theorem', problemConfigs['sdp-cap-theorem'] || {
    baseRps: 1000,
    readRatio: 0.8,
    maxLatency: 150,
    availability: 0.999,
  }, [
    'CP mode: Strong consistency (no partition)',
    'CP mode: Network partition (availability drops)',
    'AP mode: Eventual consistency (no partition)',
    'AP mode: Network partition (remains available)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 4: Amdahl's Law
 * Teaches: Limits of parallelization - speedup is limited by serial portion
 */
export const amdahlsLawProblem: ProblemDefinition = {
  id: 'sdp-amdahls-law',
  title: "Amdahl's Law - Limits of Parallelization",
  description: `Amdahl's Law describes the theoretical speedup from parallelization:
Speedup = 1 / (S + (1-S)/N)
where S = serial portion, N = number of processors

Key insight: Even with infinite processors, speedup is limited by the serial portion.
Example: If 50% of work must be serial, max speedup is 2x (even with 1000 CPUs).

Learning objectives:
- Identify serial vs parallel portions of workload
- Calculate theoretical speedup limit
- Understand when adding more servers won't help
- Optimize the serial portion first

Example:
- 95% parallel, 5% serial: Max speedup = 20x
- 50% parallel, 50% serial: Max speedup = 2x

Key requirements:
- Identify bottleneck (serial portion)
- Parallelize work across multiple servers
- Measure actual vs theoretical speedup`,

  userFacingFRs: [
    'Identify serial work (e.g., global lock, single-threaded coordinator)',
    'Parallelize independent work across multiple servers',
    'Measure speedup as servers increase (1x, 2x, 4x, 8x)',
    'Calculate theoretical limit based on serial portion',
  ],
  userFacingNFRs: [
    'With 10% serial: Expect max 10x speedup',
    'With 50% serial: Expect max 2x speedup',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Multiple servers for parallel work',
      },
      {
        type: 'storage',
        reason: 'Shared database (potential serial bottleneck)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Distribute work',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Access shared database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-amdahls-law', problemConfigs['sdp-amdahls-law'] || {
    baseRps: 100,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Single server baseline',
    '2 servers (expect ~2x speedup)',
    '4 servers (diminishing returns)',
    '8 servers (hitting serial limit)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 5: Little's Law (Queueing Theory)
 * Teaches: L = λW (queue length = arrival rate × wait time)
 */
export const littlesLawProblem: ProblemDefinition = {
  id: 'sdp-littles-law',
  title: "Little's Law - Queueing Theory",
  description: `Little's Law: L = λW
- L = average number of items in the system (queue length)
- λ = average arrival rate (requests per second)
- W = average time in system (latency)

Key insights:
- If arrival rate > service rate, queue grows infinitely
- To reduce queue length: decrease latency OR decrease arrival rate
- Useful for capacity planning

Learning objectives:
- Understand relationship between queue length, arrival rate, and latency
- Calculate required capacity to avoid queue buildup
- Design for target queue length (e.g., < 10 requests)
- Use Little's Law for capacity planning

Example:
- 100 req/sec arrival rate, 50ms latency → L = 100 × 0.05 = 5 requests in queue
- To reduce queue to 2.5: halve latency OR halve arrival rate

Key requirements:
- Monitor queue length
- Measure arrival rate and latency
- Verify Little's Law holds`,

  userFacingFRs: [
    'Implement request queue with monitoring',
    'Measure arrival rate (requests per second)',
    'Measure latency (time in system)',
    'Calculate queue length and verify L = λW',
  ],
  userFacingNFRs: [
    'Target queue length: < 10 requests',
    'Arrival rate: 100 RPS',
    'Latency: < 100ms',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Queue requests',
      },
      {
        type: 'compute',
        reason: 'Process requests from queue',
      },
      {
        type: 'storage',
        reason: 'Database operations',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Enqueue requests',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Dequeue and process',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database access',
      },
    ],
  },

  scenarios: generateScenarios('sdp-littles-law', problemConfigs['sdp-littles-law'] || {
    baseRps: 100,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Low load: λ=50, W=50ms, expect L≈2.5',
    'Medium load: λ=100, W=100ms, expect L≈10',
    'High load: λ=200, W=200ms, expect L≈40',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 6: Load Testing
 * Teaches: Benchmark system performance under realistic load
 */
export const loadTestingProblem: ProblemDefinition = {
  id: 'sdp-load-testing',
  title: 'Load Testing - Benchmark Performance',
  description: `Load testing simulates realistic user traffic to measure system performance:
- Measure baseline performance (latency, throughput)
- Identify bottlenecks (CPU, memory, I/O, network)
- Verify system meets SLAs under expected load
- Find optimal configuration

Learning objectives:
- Design realistic load test scenarios
- Gradually increase load (ramp-up)
- Measure key metrics (latency, error rate, resource utilization)
- Identify breaking point
- Optimize based on results

Tools: Apache JMeter, Gatling, K6, Locust

Example test:
- Ramp from 0 to 1000 RPS over 5 minutes
- Sustain 1000 RPS for 10 minutes
- Measure p50, p95, p99 latency
- Check error rate < 0.1%

Key requirements:
- Configure load test (RPS, duration, ramp-up)
- Monitor all components (CPU, memory, disk, network)
- Generate performance report`,

  userFacingFRs: [
    'Run load test: 0 → 100 RPS (ramp-up)',
    'Run load test: 0 → 500 RPS',
    'Run load test: 0 → 1000 RPS',
    'Monitor metrics during test (latency, errors, CPU, memory)',
  ],
  userFacingNFRs: [
    'At 100 RPS: p99 < 100ms, errors < 0.1%',
    'At 500 RPS: p99 < 200ms, errors < 1%',
    'At 1000 RPS: Identify bottleneck',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Distribute load',
      },
      {
        type: 'compute',
        reason: 'Application servers under test',
      },
      {
        type: 'storage',
        reason: 'Database under test',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send load test traffic',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database queries',
      },
    ],
  },

  scenarios: generateScenarios('sdp-load-testing', problemConfigs['sdp-load-testing'] || {
    baseRps: 100,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Baseline: 100 RPS',
    'Medium load: 500 RPS',
    'High load: 1000 RPS (find bottleneck)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 7: Stress Testing
 * Teaches: Find the breaking point of your system
 */
export const stressTestingProblem: ProblemDefinition = {
  id: 'sdp-stress-testing',
  title: 'Stress Testing - Find Breaking Point',
  description: `Stress testing pushes system beyond normal load to find breaking point:
- Increase load until system fails or degrades
- Identify maximum capacity
- Understand failure modes (graceful degradation vs crash)
- Plan for capacity buffer (e.g., run at 70% of max)

Learning objectives:
- Gradually increase load beyond expected peak
- Identify when system starts failing (latency spikes, errors)
- Observe how system fails (crash? slow? error responses?)
- Determine safe operating capacity (e.g., 70% of breaking point)

Example:
- Expected peak: 1000 RPS
- Stress test: Ramp to 5000 RPS
- Breaks at 3500 RPS (database saturated)
- Safe capacity: 2450 RPS (70% of 3500)

Key requirements:
- Ramp load aggressively (double every minute)
- Monitor for first sign of trouble (latency > SLA, errors > 1%)
- Document breaking point and failure mode`,

  userFacingFRs: [
    'Ramp load: 100 → 500 → 1000 → 2000 → 5000 RPS',
    'Monitor latency, error rate, resource usage',
    'Identify breaking point (when errors spike)',
    'Document failure mode (what component failed?)',
  ],
  userFacingNFRs: [
    'Find maximum RPS before errors exceed 5%',
    'Identify bottleneck component',
    'Determine safe operating capacity',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Distribute stress load',
      },
      {
        type: 'compute',
        reason: 'App servers under stress',
      },
      {
        type: 'storage',
        reason: 'Database under stress',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send stress test traffic',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute load',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database queries',
      },
    ],
  },

  scenarios: generateScenarios('sdp-stress-testing', problemConfigs['sdp-stress-testing'] || {
    baseRps: 100,
    readRatio: 0.8,
    maxLatency: 500,
    availability: 0.95,
  }, [
    'Normal load: 100 RPS (baseline)',
    'Moderate stress: 500 RPS',
    'High stress: 2000 RPS',
    'Breaking point: 5000 RPS (expect failure)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 8: Capacity Planning
 * Teaches: Forecast resource needs based on growth projections
 */
export const capacityPlanningProblem: ProblemDefinition = {
  id: 'sdp-capacity-planning',
  title: 'Capacity Planning - Forecast Resource Needs',
  description: `Capacity planning ensures you have enough resources to handle future load:
- Analyze historical growth trends
- Project future traffic (6 months, 1 year, 2 years)
- Calculate required resources (servers, database, bandwidth)
- Plan for seasonal spikes (Black Friday, holidays)

Learning objectives:
- Measure current capacity utilization
- Project future growth (linear, exponential)
- Calculate resources needed for target load
- Add buffer for spikes (2x-3x average)

Example:
- Current: 1000 RPS, 4 servers at 60% CPU
- Growth: 20% per quarter
- In 1 year: 1000 × 1.2^4 = 2074 RPS
- Need: 8 servers to maintain 60% CPU utilization

Key requirements:
- Monitor current utilization
- Project growth
- Calculate future resource needs
- Plan for provisioning timeline`,

  userFacingFRs: [
    'Measure current load and resource utilization',
    'Project load in 6 months (assume 20% quarterly growth)',
    'Calculate servers needed for projected load',
    'Add 2x buffer for seasonal spikes',
  ],
  userFacingNFRs: [
    'Maintain CPU utilization < 70% under normal load',
    'Maintain CPU utilization < 90% during spikes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Distribute across scaled fleet',
      },
      {
        type: 'compute',
        reason: 'App server fleet',
      },
      {
        type: 'storage',
        reason: 'Database cluster',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Route traffic',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute to servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database access',
      },
    ],
  },

  scenarios: generateScenarios('sdp-capacity-planning', problemConfigs['sdp-capacity-planning'] || {
    baseRps: 1000,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Current load: 1000 RPS',
    'Projected (6 months): 1400 RPS',
    'Projected (1 year): 2074 RPS',
    'Peak spike: 4148 RPS (2x average)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 9: Performance Profiling
 * Teaches: Identify bottlenecks using profiling tools
 */
export const performanceProfilingProblem: ProblemDefinition = {
  id: 'sdp-performance-profiling',
  title: 'Performance Profiling - Identify Bottlenecks',
  description: `Performance profiling identifies where your system spends time:
- CPU profiling: Which functions consume CPU?
- Memory profiling: Which objects allocate memory?
- I/O profiling: Where are disk/network waits?
- Database profiling: Which queries are slow?

Learning objectives:
- Use profiling tools (e.g., pprof, perf, New Relic)
- Identify hotspots (functions consuming most time)
- Analyze flame graphs
- Optimize based on data (not guesses)

Example findings:
- 60% time in JSON serialization → switch to protobuf
- 30% time in database query → add index
- 10% time in logging → reduce log level

Golden rule: "Measure first, optimize second"

Key requirements:
- Profile application under load
- Identify top 3 bottlenecks
- Optimize and re-profile`,

  userFacingFRs: [
    'Run baseline performance test',
    'Enable profiling (CPU, memory, I/O)',
    'Identify top 3 functions by CPU time',
    'Optimize hotspots',
    'Re-profile to verify improvement',
  ],
  userFacingNFRs: [
    'Reduce p99 latency by 30% after optimization',
    'Reduce CPU usage by 20%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'App servers with profiling enabled',
      },
      {
        type: 'storage',
        reason: 'Database with slow query log',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Generate load for profiling',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database queries to profile',
      },
    ],
  },

  scenarios: generateScenarios('sdp-performance-profiling', problemConfigs['sdp-performance-profiling'] || {
    baseRps: 500,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Profile baseline (identify bottlenecks)',
    'Optimize hotspot #1',
    'Optimize hotspot #2',
    'Verify improvements',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 10: Cost Optimization
 * Teaches: Optimize cloud costs without sacrificing performance
 */
export const costOptimizationProblem: ProblemDefinition = {
  id: 'sdp-cost-optimization',
  title: 'Cost Optimization - Reduce Cloud Costs',
  description: `Cost optimization reduces cloud spending while maintaining performance:
- Right-size instances (don't over-provision)
- Use reserved instances (up to 75% cheaper)
- Use spot instances for non-critical workloads
- Shut down idle resources
- Archive old data to cheaper storage

Learning objectives:
- Analyze cost breakdown by component
- Identify over-provisioned resources
- Right-size instances based on actual utilization
- Choose appropriate pricing model (on-demand, reserved, spot)
- Balance cost vs performance

Example optimizations:
- Replace m5.2xlarge (80% idle) with m5.xlarge → save 50%
- Use reserved instances for baseline load → save 40%
- Use spot instances for batch jobs → save 70%
- Move old data to S3 Glacier → save 90%

Key requirements:
- Monitor cost and utilization
- Right-size over-provisioned resources
- Calculate savings`,

  userFacingFRs: [
    'Analyze current cost breakdown',
    'Identify over-provisioned resources (CPU < 50%)',
    'Right-size instances (downgrade unused capacity)',
    'Calculate monthly cost savings',
  ],
  userFacingNFRs: [
    'Reduce monthly cost by 30% without increasing latency',
    'Maintain CPU utilization between 60-80%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Traffic distribution',
      },
      {
        type: 'compute',
        reason: 'Right-sized app servers',
      },
      {
        type: 'storage',
        reason: 'Right-sized database',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Route traffic',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute load',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database access',
      },
    ],
  },

  scenarios: generateScenarios('sdp-cost-optimization', problemConfigs['sdp-cost-optimization'] || {
    baseRps: 500,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Baseline: Over-provisioned (high cost)',
    'Right-size compute (reduce cost)',
    'Right-size database (reduce cost)',
    'Optimized: Same performance, 30% lower cost',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 2. Domain Name System (DNS) (5 problems)
// ============================================================================

/**
 * Problem 11: DNS Basics
 * Teaches: How domain name resolution works
 */
export const dnsBasicsProblem: ProblemDefinition = {
  id: 'sdp-dns-basics',
  title: 'DNS Basics - Domain Name Resolution',
  description: `DNS (Domain Name System) translates domain names to IP addresses:
1. User types www.example.com
2. Browser checks cache
3. If miss, queries DNS resolver
4. Resolver queries root → TLD → authoritative DNS
5. Returns IP address (e.g., 93.184.216.34)
6. Browser connects to IP

Learning objectives:
- Understand DNS hierarchy (root, TLD, authoritative)
- Understand DNS resolution flow
- Configure DNS records
- Measure DNS resolution time
- Understand DNS caching

Example flow:
- Query: www.example.com
- Root server: "Ask .com TLD server"
- TLD server: "Ask example.com authoritative server"
- Authoritative: "www.example.com = 93.184.216.34"

Key requirements:
- Configure DNS for your domain
- Measure DNS lookup time
- Understand caching behavior`,

  userFacingFRs: [
    'Configure DNS A record (domain → IP)',
    'Perform DNS lookup (measure resolution time)',
    'Test DNS caching (subsequent lookups should be faster)',
    'Simulate cache miss (force re-resolution)',
  ],
  userFacingNFRs: [
    'DNS resolution time: < 50ms (cached), < 200ms (uncached)',
    'DNS availability: 99.99%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers behind DNS',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Connect via DNS-resolved IP',
      },
    ],
  },

  scenarios: generateScenarios('sdp-dns-basics', problemConfigs['sdp-dns-basics'] || {
    baseRps: 100,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.9999,
  }, [
    'First DNS lookup (uncached)',
    'Subsequent lookups (cached)',
    'Cache expiration (TTL expired)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 12: DNS Records
 * Teaches: Different DNS record types (A, AAAA, CNAME, MX, TXT)
 */
export const dnsRecordsProblem: ProblemDefinition = {
  id: 'sdp-dns-records',
  title: 'DNS Records - A, AAAA, CNAME, MX, TXT',
  description: `DNS supports multiple record types:
- A: Maps domain to IPv4 address
- AAAA: Maps domain to IPv6 address
- CNAME: Alias (canonical name) to another domain
- MX: Mail exchange server
- TXT: Text records (SPF, DKIM, verification)

Learning objectives:
- Understand when to use each record type
- Configure A records for web servers
- Configure CNAME for subdomains (www → example.com)
- Configure MX for email
- Configure TXT for domain verification

Examples:
- A: example.com → 93.184.216.34
- AAAA: example.com → 2606:2800:220:1:248:1893:25c8:1946
- CNAME: www.example.com → example.com
- MX: example.com → mail.example.com (priority 10)
- TXT: example.com → "v=spf1 include:_spf.google.com ~all"

Key requirements:
- Configure multiple record types
- Test record resolution`,

  userFacingFRs: [
    'Configure A record (IPv4)',
    'Configure AAAA record (IPv6)',
    'Configure CNAME (subdomain alias)',
    'Configure MX record (email)',
    'Configure TXT record (SPF, verification)',
  ],
  userFacingNFRs: [
    'All records resolve correctly',
    'DNS propagation time: < 5 minutes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Web servers for A/AAAA records',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Access via DNS',
      },
    ],
  },

  scenarios: generateScenarios('sdp-dns-records', problemConfigs['sdp-dns-records'] || {
    baseRps: 100,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.9999,
  }, [
    'Query A record',
    'Query AAAA record',
    'Query CNAME record',
    'Query MX record',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 13: DNS Caching
 * Teaches: TTL and cache invalidation
 */
export const dnsCachingProblem: ProblemDefinition = {
  id: 'sdp-dns-caching',
  title: 'DNS Caching - TTL and Cache Invalidation',
  description: `DNS caching improves performance by storing DNS responses:
- TTL (Time To Live): How long to cache (e.g., 300 seconds = 5 minutes)
- Cached by: browser, OS, DNS resolver, ISP
- Trade-off: Longer TTL = faster but harder to update

Learning objectives:
- Understand DNS caching layers
- Configure TTL based on change frequency
- Plan for DNS changes (lower TTL before migration)
- Understand cache invalidation challenges

Examples:
- Static site: TTL = 86400 (24 hours) - rarely changes
- Active service: TTL = 300 (5 minutes) - changes occasionally
- Migration: TTL = 60 (1 minute) - about to change IP

Common issue: Updating DNS with high TTL
- Old record: example.com → 1.2.3.4 (TTL = 86400)
- Update to: example.com → 5.6.7.8
- Problem: Users cached old IP for 24 hours!
- Solution: Lower TTL to 60 before migration

Key requirements:
- Configure TTL
- Test cache behavior
- Simulate TTL expiration`,

  userFacingFRs: [
    'Configure DNS with high TTL (3600s)',
    'Test that queries are cached',
    'Update IP address',
    'Wait for TTL expiration',
    'Verify new IP is resolved',
  ],
  userFacingNFRs: [
    'Cache hit rate: > 95% (with TTL = 3600)',
    'DNS query latency: < 10ms (cached), < 200ms (uncached)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Web servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Access via DNS',
      },
    ],
  },

  scenarios: generateScenarios('sdp-dns-caching', problemConfigs['sdp-dns-caching'] || {
    baseRps: 100,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.9999,
  }, [
    'High TTL (3600s): Fast but slow updates',
    'Medium TTL (300s): Balanced',
    'Low TTL (60s): Fast updates but more DNS queries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 14: DNS Load Balancing
 * Teaches: Round-robin DNS for simple load balancing
 */
export const dnsLoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-dns-load-balancing',
  title: 'DNS Load Balancing - Round-Robin DNS',
  description: `Round-robin DNS returns multiple IP addresses for load distribution:
- Configure multiple A records for same domain
- DNS rotates order in responses
- Clients connect to first IP
- Simple form of load balancing

Learning objectives:
- Configure round-robin DNS (multiple A records)
- Understand limitations (no health checks, caching issues)
- Compare to proper load balancers
- Understand when round-robin DNS is appropriate

Example:
Query: example.com
Response 1: [1.1.1.1, 2.2.2.2, 3.3.3.3]
Response 2: [2.2.2.2, 3.3.3.3, 1.1.1.1]
Response 3: [3.3.3.3, 1.1.1.1, 2.2.2.2]

Limitations:
- No health checks (returns dead servers)
- Caching prevents rotation (TTL)
- Uneven distribution (clients cache different IPs)

Better alternative: Use proper load balancer (ELB, ALB)

Key requirements:
- Configure multiple A records
- Test load distribution
- Understand limitations`,

  userFacingFRs: [
    'Configure 3 A records for same domain (3 server IPs)',
    'Test DNS responses rotate IPs',
    'Simulate server failure (DNS still returns dead IP)',
    'Compare to load balancer with health checks',
  ],
  userFacingNFRs: [
    'Traffic distributed across 3 servers',
    'No automatic failover (limitation)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Multiple web servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Access via round-robin DNS',
      },
    ],
  },

  scenarios: generateScenarios('sdp-dns-load-balancing', problemConfigs['sdp-dns-load-balancing'] || {
    baseRps: 300,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.99,
  }, [
    '3 servers, round-robin DNS',
    'One server fails (DNS still returns it - problem!)',
    'Compare to load balancer with health checks',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 15: Route 53 / Geo-routing
 * Teaches: Geographic DNS routing for low latency
 */
export const geoRoutingProblem: ProblemDefinition = {
  id: 'sdp-geo-routing',
  title: 'Geo-routing - Geographic DNS Routing',
  description: `Geo-routing returns different IPs based on user location:
- User in US → returns US server IP
- User in EU → returns EU server IP
- User in Asia → returns Asia server IP
- Reduces latency (users connect to nearest server)

Learning objectives:
- Understand geo-routing benefits (lower latency)
- Configure geo-routing rules
- Test from different locations
- Understand limitations (accuracy depends on IP geolocation)

Example:
- example.com from New York → 1.1.1.1 (US server)
- example.com from London → 2.2.2.2 (EU server)
- example.com from Tokyo → 3.3.3.3 (Asia server)

Benefits:
- Lower latency (users connect to nearby server)
- Data sovereignty (EU data stays in EU)
- Disaster recovery (route around region failure)

Services: AWS Route 53, Cloudflare, Google Cloud DNS

Key requirements:
- Deploy servers in multiple regions
- Configure geo-routing
- Test from different locations`,

  userFacingFRs: [
    'Deploy servers in 3 regions (US, EU, Asia)',
    'Configure geo-routing (location → nearest server)',
    'Test from US (expect US server IP)',
    'Test from EU (expect EU server IP)',
    'Test from Asia (expect Asia server IP)',
  ],
  userFacingNFRs: [
    'Latency from US: < 50ms (US server)',
    'Latency from EU: < 50ms (EU server)',
    'Latency from Asia: < 50ms (Asia server)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Servers in multiple regions',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Connect to nearest server via geo-routing',
      },
    ],
  },

  scenarios: generateScenarios('sdp-geo-routing', problemConfigs['sdp-geo-routing'] || {
    baseRps: 1000,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Client in US (route to US server)',
    'Client in EU (route to EU server)',
    'Client in Asia (route to Asia server)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 3. Content Delivery Network (CDN) (6 problems)
// ============================================================================

/**
 * Problem 16: CDN Basics
 * Teaches: Edge locations and caching static content
 */
export const cdnBasicsProblem: ProblemDefinition = {
  id: 'sdp-cdn-basics',
  title: 'CDN Basics - Edge Locations and Caching',
  description: `CDN (Content Delivery Network) caches content at edge locations worldwide:
- Edge locations: Servers close to users (100+ locations globally)
- Cache static content: images, CSS, JS, videos
- Reduce latency: Users fetch from nearby edge server
- Reduce origin load: Most requests served from cache

Learning objectives:
- Understand CDN benefits (latency, bandwidth, origin protection)
- Configure CDN for static assets
- Measure cache hit ratio
- Understand edge server locations

Example:
- User in Tokyo requests image
- Without CDN: Fetch from US server (200ms latency)
- With CDN: Fetch from Tokyo edge (10ms latency)
- Origin load: 1000 req/sec → 50 req/sec (95% cache hit ratio)

Popular CDNs: CloudFront, Cloudflare, Akamai, Fastly

Key requirements:
- Configure CDN for static assets
- Measure latency improvement
- Monitor cache hit ratio`,

  userFacingFRs: [
    'Serve static assets (images, CSS, JS) from origin',
    'Configure CDN in front of origin',
    'Test latency from different locations (US, EU, Asia)',
    'Monitor cache hit ratio',
  ],
  userFacingNFRs: [
    'Without CDN: 200ms latency from distant location',
    'With CDN: < 50ms latency from any location',
    'Cache hit ratio: > 90%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'CDN for static content',
      },
      {
        type: 'compute',
        reason: 'Origin servers',
      },
      {
        type: 'object_storage',
        reason: 'Static asset storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Fetch static content from CDN',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'Fetch from origin on cache miss',
      },
    ],
  },

  scenarios: generateScenarios('sdp-cdn-basics', problemConfigs['sdp-cdn-basics'] || {
    baseRps: 1000,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
  }, [
    'Baseline without CDN (high latency)',
    'With CDN (low latency, high cache hit ratio)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 17: Push CDN
 * Teaches: Pre-upload content to CDN (good for low-traffic sites)
 */
export const pushCdnProblem: ProblemDefinition = {
  id: 'sdp-push-cdn',
  title: 'Push CDN - Pre-upload Content',
  description: `Push CDN: You upload content to CDN proactively
- You push: Upload files to CDN servers
- CDN stores: Files cached indefinitely (until you remove)
- Good for: Low-traffic sites, infrequent changes, full control

Learning objectives:
- Understand push vs pull CDN
- Upload content to CDN
- Manage content lifecycle (upload, update, delete)
- Understand trade-offs (manual management, storage costs)

Example workflow:
1. Build static site (HTML, CSS, JS, images)
2. Upload all files to CDN
3. CDN serves from cache (no origin requests)
4. Update content: Re-upload changed files

Use cases:
- Marketing sites (rarely change)
- Documentation sites
- Mobile app assets (APK, IPA)

Trade-offs:
- Pros: Full control, no origin server needed, instant cache
- Cons: Manual upload, storage costs, need to track what to update

Key requirements:
- Upload static content to CDN
- Update content (re-upload)
- Delete old content`,

  userFacingFRs: [
    'Upload static site to push CDN',
    'Serve content from CDN (no origin)',
    'Update file (re-upload)',
    'Delete old file',
  ],
  userFacingNFRs: [
    'Cache hit ratio: 100% (all content pre-cached)',
    'Latency: < 50ms',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Push CDN',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Fetch from CDN',
      },
    ],
  },

  scenarios: generateScenarios('sdp-push-cdn', problemConfigs['sdp-push-cdn'] || {
    baseRps: 100,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
  }, [
    'Initial upload (100% cache hit)',
    'Update content (re-upload)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 18: Pull CDN
 * Teaches: CDN fetches content on-demand from origin
 */
export const pullCdnProblem: ProblemDefinition = {
  id: 'sdp-pull-cdn',
  title: 'Pull CDN - On-Demand Fetch from Origin',
  description: `Pull CDN: CDN fetches content from origin on first request
- User requests: CDN checks cache
- Cache miss: CDN fetches from origin, caches, returns to user
- Cache hit: CDN returns from cache (no origin request)
- Good for: High-traffic sites, dynamic content, minimal setup

Learning objectives:
- Understand pull CDN workflow
- Configure origin server
- Monitor cache hit/miss ratio
- Understand cache warming

Example workflow:
1. User requests /image.jpg
2. CDN cache miss → fetch from origin
3. CDN caches image for TTL (e.g., 1 hour)
4. Subsequent requests → cache hit (no origin fetch)

Use cases:
- E-commerce sites
- Social media
- News sites
- Anything with frequent content updates

Trade-offs:
- Pros: Automatic, minimal setup, only cache what's requested
- Cons: First request is slow (cache miss), origin must handle cache misses

Key requirements:
- Configure origin server
- Configure CDN to pull from origin
- Monitor cache hit ratio`,

  userFacingFRs: [
    'Configure origin server with static content',
    'Configure pull CDN in front of origin',
    'First request (cache miss, slow)',
    'Subsequent requests (cache hit, fast)',
  ],
  userFacingNFRs: [
    'First request: ~200ms (origin fetch)',
    'Cached requests: < 50ms',
    'Cache hit ratio: > 90% (after warm-up)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Pull CDN',
      },
      {
        type: 'compute',
        reason: 'Origin server',
      },
      {
        type: 'object_storage',
        reason: 'Static content storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Request content',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'Pull from origin on cache miss',
      },
    ],
  },

  scenarios: generateScenarios('sdp-pull-cdn', problemConfigs['sdp-pull-cdn'] || {
    baseRps: 1000,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
  }, [
    'Cold cache (many cache misses)',
    'Warm cache (high cache hit ratio)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 19: Cache Invalidation
 * Teaches: Purge stale content from CDN
 */
export const cdnCacheInvalidationProblem: ProblemDefinition = {
  id: 'sdp-cdn-cache-invalidation',
  title: 'CDN Cache Invalidation - Purge Stale Content',
  description: `Cache invalidation removes stale content from CDN cache:
- Problem: Updated content on origin, but CDN serves old cached version
- Solution 1: Wait for TTL expiration (slow, simple)
- Solution 2: Invalidate cache (fast, costs money)
- Solution 3: Versioned URLs (instant, free, best practice)

Learning objectives:
- Understand cache invalidation challenges
- Purge cache via API
- Use versioned URLs (cache busting)
- Choose appropriate strategy

Example problem:
- Upload new logo.png
- CDN still serves old logo.png (cached for 24 hours)
- Need new logo immediately

Solutions:
1. Wait 24 hours (bad UX)
2. Invalidate /logo.png ($0.005 per file)
3. Rename to logo-v2.png or logo.png?v=2 (free, instant)

Best practice: Versioned URLs
- CSS: style.css?v=2
- JS: app-abc123.js (content hash)
- Images: logo-2024.png

Key requirements:
- Update content on origin
- Invalidate CDN cache
- Use versioned URLs`,

  userFacingFRs: [
    'Upload content to origin',
    'Verify CDN caches content',
    'Update content on origin',
    'Invalidate CDN cache (purge)',
    'Use versioned URLs (cache busting)',
  ],
  userFacingNFRs: [
    'Cache invalidation: < 5 minutes to propagate',
    'Versioned URLs: Instant updates (no invalidation needed)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'CDN with cache invalidation',
      },
      {
        type: 'object_storage',
        reason: 'Origin storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Fetch content',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'Fetch from origin',
      },
    ],
  },

  scenarios: generateScenarios('sdp-cdn-cache-invalidation', problemConfigs['sdp-cdn-cache-invalidation'] || {
    baseRps: 500,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
  }, [
    'Initial cache (old content)',
    'Update origin + invalidate cache',
    'Use versioned URLs (no invalidation needed)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 20: SSL/TLS Termination at CDN
 * Teaches: Decrypt HTTPS at edge, HTTP to origin
 */
export const cdnSslTerminationProblem: ProblemDefinition = {
  id: 'sdp-cdn-ssl-termination',
  title: 'SSL/TLS Termination at CDN',
  description: `SSL/TLS termination at CDN decrypts HTTPS at edge:
- Client → CDN: HTTPS (encrypted)
- CDN → Origin: HTTP (unencrypted, or re-encrypted)
- Benefit: Offload SSL/TLS overhead from origin servers

Learning objectives:
- Understand SSL/TLS termination
- Configure SSL certificate at CDN
- Use HTTP between CDN and origin (or re-encrypt)
- Understand security considerations

Example:
- Client: HTTPS request to cdn.example.com
- CDN: Decrypts HTTPS, extracts HTTP request
- CDN → Origin: HTTP request (unencrypted, inside VPC)
- Origin: HTTP response
- CDN: Encrypts as HTTPS, sends to client

Benefits:
- Origin doesn't need SSL certificate
- Reduce CPU load on origin (SSL handshake is expensive)
- Centralized certificate management

Security:
- CDN → Origin over public internet: Use HTTPS (re-encrypt)
- CDN → Origin in private VPC: HTTP is acceptable

Key requirements:
- Configure SSL certificate at CDN
- Test HTTPS to CDN
- Monitor SSL handshake performance`,

  userFacingFRs: [
    'Configure SSL certificate at CDN',
    'Client connects via HTTPS',
    'CDN terminates SSL (decrypts)',
    'CDN → Origin via HTTP (or HTTPS)',
  ],
  userFacingNFRs: [
    'SSL handshake: < 100ms',
    'Origin CPU usage: Reduced (no SSL overhead)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'CDN with SSL termination',
      },
      {
        type: 'compute',
        reason: 'Origin servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'HTTPS connection',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'HTTP to origin',
      },
    ],
  },

  scenarios: generateScenarios('sdp-cdn-ssl-termination', problemConfigs['sdp-cdn-ssl-termination'] || {
    baseRps: 1000,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
  }, [
    'Without SSL termination (origin handles SSL)',
    'With SSL termination at CDN (origin just HTTP)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 21: DDoS Protection at CDN
 * Teaches: Rate limiting and DDoS mitigation at edge
 */
export const cdnDdosProtectionProblem: ProblemDefinition = {
  id: 'sdp-cdn-ddos-protection',
  title: 'DDoS Protection at CDN',
  description: `CDN protects against DDoS (Distributed Denial of Service) attacks:
- Absorb attack at edge (massive CDN capacity)
- Rate limiting: Block IPs exceeding threshold
- WAF (Web Application Firewall): Block malicious requests
- Prevent attack from reaching origin

Learning objectives:
- Understand DDoS attack types (volumetric, application layer)
- Configure rate limiting at CDN
- Use WAF rules
- Monitor attack traffic

Example DDoS attack:
- Attacker: 10,000 bots, each sending 100 req/sec
- Total: 1 million req/sec
- Without CDN: Origin overwhelmed, crashes
- With CDN: Absorbed at edge, rate limiting blocks bots

CDN DDoS protection:
- Volumetric: Massive bandwidth to absorb traffic
- Rate limiting: Max 100 req/sec per IP
- WAF: Block SQL injection, XSS, etc.
- CAPTCHA challenge for suspicious traffic

Popular services: Cloudflare (free DDoS protection), AWS Shield

Key requirements:
- Configure rate limiting
- Simulate DDoS attack
- Verify origin is protected`,

  userFacingFRs: [
    'Configure rate limiting at CDN (100 req/sec per IP)',
    'Simulate normal traffic (passes)',
    'Simulate DDoS attack (1000 req/sec per IP)',
    'Verify CDN blocks attack traffic',
    'Verify origin remains healthy',
  ],
  userFacingNFRs: [
    'Normal traffic: 100% success rate',
    'Attack traffic: Blocked at CDN (origin unaffected)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'CDN with DDoS protection',
      },
      {
        type: 'compute',
        reason: 'Protected origin servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'All traffic goes through CDN',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'Only legitimate traffic reaches origin',
      },
    ],
  },

  scenarios: generateScenarios('sdp-cdn-ddos-protection', problemConfigs['sdp-cdn-ddos-protection'] || {
    baseRps: 100,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.999,
    hasCdn: true,
  }, [
    'Normal traffic (no attack)',
    'DDoS attack (rate limited at CDN)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 4. Load Balancers (8 problems)
// ============================================================================

/**
 * Problem 22: Layer 4 Load Balancing
 * Teaches: TCP/UDP load balancing (transport layer)
 */
export const layer4LoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-layer4-load-balancing',
  title: 'Layer 4 Load Balancing - TCP/UDP',
  description: `Layer 4 (L4) load balancing operates at transport layer (TCP/UDP):
- Routes based on: IP address and port only
- Fast: No packet inspection, low latency
- Protocol agnostic: Works with any TCP/UDP protocol
- Use cases: Database connections, SSH, gaming servers

Learning objectives:
- Understand OSI layers (L4 = Transport, L7 = Application)
- Configure L4 load balancer
- Understand trade-offs vs L7
- Choose appropriate layer for use case

Example:
- Client connects to LB IP:5432 (PostgreSQL)
- LB routes to backend server based on IP/port
- LB maintains connection (connection forwarding)
- No understanding of PostgreSQL protocol

L4 vs L7:
- L4: Faster, simpler, protocol-agnostic, less features
- L7: Slower, smarter, HTTP-aware, more features (path routing, headers)

Services: AWS NLB (Network Load Balancer), HAProxy (L4 mode)

Key requirements:
- Configure L4 load balancer
- Route to multiple backends
- Test connection forwarding`,

  userFacingFRs: [
    'Configure L4 load balancer (TCP)',
    'Add 3 backend servers',
    'Test client connections distributed',
    'Monitor connection count per backend',
  ],
  userFacingNFRs: [
    'Latency: < 10ms overhead (very fast)',
    'Throughput: > 1M connections/sec',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'L4 load balancer',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'TCP connection',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Forward to backend',
      },
    ],
  },

  scenarios: generateScenarios('sdp-layer4-load-balancing', problemConfigs['sdp-layer4-load-balancing'] || {
    baseRps: 1000,
    readRatio: 0.8,
    maxLatency: 50,
    availability: 0.999,
  }, [
    'Single backend (no load balancing)',
    'L4 LB with 3 backends (connections distributed)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 23: Layer 7 Load Balancing
 * Teaches: HTTP/HTTPS load balancing (application layer)
 */
export const layer7LoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-layer7-load-balancing',
  title: 'Layer 7 Load Balancing - HTTP/HTTPS',
  description: `Layer 7 (L7) load balancing operates at application layer (HTTP):
- Routes based on: URL path, headers, cookies, HTTP method
- Smart routing: /api → API servers, /images → image servers
- SSL termination: Decrypt HTTPS at LB
- Use cases: Web applications, microservices, APIs

Learning objectives:
- Understand L7 capabilities (path routing, header inspection)
- Configure L7 load balancer
- Route based on URL path
- Compare to L4

Example smart routing:
- /api/* → API server pool
- /images/* → Image server pool (SSD, more RAM)
- /admin/* → Admin server pool (fewer, more secure)

L7 features:
- Path-based routing
- Header-based routing (e.g., user-agent → mobile/desktop servers)
- Cookie-based routing (session affinity)
- SSL termination
- Request/response manipulation

Services: AWS ALB (Application Load Balancer), Nginx, HAProxy (L7 mode)

Key requirements:
- Configure L7 load balancer
- Path-based routing rules
- Test routing`,

  userFacingFRs: [
    'Configure L7 load balancer',
    'Route /api/* to API servers',
    'Route /images/* to image servers',
    'Route /* (default) to web servers',
    'Test path-based routing',
  ],
  userFacingNFRs: [
    'Latency: < 50ms overhead',
    'Routing accuracy: 100%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'L7 load balancer',
      },
      {
        type: 'compute',
        reason: 'Multiple server pools (API, images, web)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'HTTP requests',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Route to appropriate backend',
      },
    ],
  },

  scenarios: generateScenarios('sdp-layer7-load-balancing', problemConfigs['sdp-layer7-load-balancing'] || {
    baseRps: 1000,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Path routing: /api → API servers',
    'Path routing: /images → image servers',
    'Default routing: /* → web servers',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 24: Round Robin Load Balancing
 * Teaches: Distribute requests evenly in rotation
 */
export const roundRobinLoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-round-robin-lb',
  title: 'Round Robin Load Balancing',
  description: `Round robin distributes requests evenly by rotating through servers:
- Algorithm: Request 1 → Server A, Request 2 → Server B, Request 3 → Server C, Request 4 → Server A, ...
- Pros: Simple, even distribution (if requests similar)
- Cons: Ignores server load, doesn't account for varying request complexity

Learning objectives:
- Understand round robin algorithm
- Observe even distribution
- Understand limitations (what if Server A is slower?)
- Compare to other algorithms

Example:
- 3 servers: A, B, C
- 9 requests distributed: A=3, B=3, C=3
- Perfect even distribution

Problem scenario:
- Server A: Fast (1 core, light requests)
- Server B: Slow (1 core, heavy requests)
- Round robin sends equal requests to both
- Server B saturated, Server A idle!

Better algorithm: Least connections (account for server load)

Key requirements:
- Configure round robin LB
- Send 100 requests
- Verify even distribution
- Identify limitation`,

  userFacingFRs: [
    'Configure round robin load balancer',
    'Add 3 equal servers',
    'Send 100 requests',
    'Verify distribution: ~33 requests per server',
    'Add slow server (identify problem)',
  ],
  userFacingNFRs: [
    'Distribution variance: < 5% (very even)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Round robin LB',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send requests',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Rotate through backends',
      },
    ],
  },

  scenarios: generateScenarios('sdp-round-robin-lb', problemConfigs['sdp-round-robin-lb'] || {
    baseRps: 300,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Equal servers: Perfect round robin',
    'Mixed speeds: Round robin limitation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 25: Least Connections Load Balancing
 * Teaches: Route to least busy server
 */
export const leastConnectionsLoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-least-connections-lb',
  title: 'Least Connections Load Balancing',
  description: `Least connections routes to server with fewest active connections:
- Algorithm: Track active connections per server, route to server with minimum
- Pros: Accounts for varying request duration, better than round robin for long requests
- Cons: Slightly more complex, connection tracking overhead

Learning objectives:
- Understand least connections algorithm
- Compare to round robin
- Identify when least connections is better
- Monitor connection distribution

Example:
- Server A: 5 active connections
- Server B: 10 active connections
- Server C: 3 active connections
- Next request → Server C (least connections)

When least connections is better:
- Long-lived connections (WebSockets, streaming)
- Varying request duration (some requests take 1s, some take 10s)
- Mixed server capacities (some servers faster than others)

When round robin is fine:
- Short requests (all ~100ms)
- Equal servers
- No long-lived connections

Key requirements:
- Configure least connections LB
- Simulate varying request durations
- Verify routes to least busy server`,

  userFacingFRs: [
    'Configure least connections load balancer',
    'Simulate short requests (100ms) to Server A',
    'Simulate long requests (5s) to Server B',
    'Verify new requests route to Server A (fewer connections)',
  ],
  userFacingNFRs: [
    'Load distribution: Optimal (accounts for connection duration)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Least connections LB',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send requests',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Route to least busy',
      },
    ],
  },

  scenarios: generateScenarios('sdp-least-connections-lb', problemConfigs['sdp-least-connections-lb'] || {
    baseRps: 300,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Equal request duration: Similar to round robin',
    'Varying duration: Better than round robin',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 26: IP Hash Load Balancing
 * Teaches: Consistent hashing for sticky sessions
 */
export const ipHashLoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-ip-hash-lb',
  title: 'IP Hash Load Balancing - Sticky Sessions',
  description: `IP hash routes same client IP to same server (sticky sessions):
- Algorithm: hash(client_ip) % num_servers = server_index
- Pros: Session affinity (same client → same server)
- Cons: Uneven distribution if client IPs skewed

Learning objectives:
- Understand IP hash algorithm
- Understand session affinity
- Identify when sticky sessions needed
- Compare to consistent hashing

Example:
- Client IP 1.2.3.4 → hash = 123 → server_index = 123 % 3 = 0 → Server A
- Client IP 5.6.7.8 → hash = 567 → server_index = 567 % 3 = 0 → Server A (same!)
- Client IP 9.10.11.12 → hash = 901 → server_index = 901 % 3 = 1 → Server B

When sticky sessions needed:
- In-memory session storage (shopping cart, auth token)
- WebSocket connections (must reconnect to same server)
- Stateful applications

Problem with IP hash:
- Add/remove server → hash changes → all sessions lost
- Better: Consistent hashing (minimize disruption)

Key requirements:
- Configure IP hash LB
- Verify same client → same server
- Simulate server add/remove`,

  userFacingFRs: [
    'Configure IP hash load balancer',
    'Client A sends 10 requests → all to same server',
    'Client B sends 10 requests → all to same server',
    'Add new server (some sessions rehashed)',
  ],
  userFacingNFRs: [
    'Session affinity: 100% (same client → same server)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'IP hash LB',
      },
      {
        type: 'compute',
        reason: 'Stateful backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send requests',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Route to hashed server',
      },
    ],
  },

  scenarios: generateScenarios('sdp-ip-hash-lb', problemConfigs['sdp-ip-hash-lb'] || {
    baseRps: 300,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Sticky sessions working',
    'Add server (rehash disruption)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 27: Health Checks
 * Teaches: Monitor backend health and remove failed servers
 */
export const healthChecksLoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-health-checks-lb',
  title: 'Health Checks - Monitor Backend Health',
  description: `Health checks detect failed servers and stop routing to them:
- LB sends periodic requests to each backend (e.g., GET /health every 30s)
- Healthy: HTTP 200 response → keep routing
- Unhealthy: Timeout or HTTP 5xx → stop routing
- Auto-recovery: When healthy again, resume routing

Learning objectives:
- Configure health check endpoint
- Set health check interval and threshold
- Test failure detection
- Test auto-recovery

Example:
- LB has 3 servers: A, B, C
- Server B crashes
- Health check to B fails (timeout)
- LB marks B unhealthy, stops routing to it
- Only route to A and C
- Server B recovers
- Health check succeeds, LB resumes routing to B

Health check config:
- Path: /health
- Interval: 30 seconds
- Timeout: 5 seconds
- Threshold: 2 consecutive failures = unhealthy

Key requirements:
- Configure health check
- Simulate server failure
- Verify LB stops routing`,

  userFacingFRs: [
    'Configure health check (/health, 30s interval)',
    'All servers healthy → traffic distributed',
    'Crash one server → health check fails',
    'LB stops routing to failed server',
    'Recover server → LB resumes routing',
  ],
  userFacingNFRs: [
    'Failure detection: < 2 minutes (2 failed health checks)',
    'No requests to failed server after detection',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'LB with health checks',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send requests',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Route to healthy backends only',
      },
    ],
  },

  scenarios: generateScenarios('sdp-health-checks-lb', problemConfigs['sdp-health-checks-lb'] || {
    baseRps: 300,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'All healthy',
    'One server fails (auto-detected and removed)',
    'Server recovers (auto-detected and added back)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 28: Session Affinity (Sticky Sessions)
 * Teaches: Route same user to same server using cookies
 */
export const sessionAffinityLoadBalancingProblem: ProblemDefinition = {
  id: 'sdp-session-affinity-lb',
  title: 'Session Affinity - Sticky Sessions with Cookies',
  description: `Session affinity routes same user to same server using cookies:
- First request: LB assigns server, sets cookie (e.g., server=A)
- Subsequent requests: LB reads cookie, routes to same server
- Use case: Stateful applications with in-memory sessions

Learning objectives:
- Configure session affinity
- Test same user → same server
- Understand cookie-based vs IP-based affinity
- Understand when to avoid sticky sessions (use stateless design)

Example:
1. User first request → LB routes to Server A, sets cookie: LB_SERVER=A
2. User adds item to cart (stored in Server A memory)
3. User second request (cookie: LB_SERVER=A) → LB routes to Server A
4. User sees cart items (in Server A memory)

Problem with sticky sessions:
- Uneven load (popular users → overloaded server)
- Session lost if server fails
- Can't scale gracefully (can't add/remove servers easily)

Better design: Stateless + external session store (Redis)
- Store session in Redis (shared across all servers)
- Any server can handle any request
- Can scale, no affinity needed

Key requirements:
- Configure sticky sessions
- Verify same user → same server
- Simulate server failure (session lost)`,

  userFacingFRs: [
    'Configure session affinity (cookie-based)',
    'User A makes 10 requests → all to Server A',
    'User B makes 10 requests → all to Server B',
    'Server A fails → User A session lost',
  ],
  userFacingNFRs: [
    'Session affinity: 100%',
    'Session loss on server failure: Acceptable (or use Redis)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'LB with session affinity',
      },
      {
        type: 'compute',
        reason: 'Stateful backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send requests with cookies',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Route based on session cookie',
      },
    ],
  },

  scenarios: generateScenarios('sdp-session-affinity-lb', problemConfigs['sdp-session-affinity-lb'] || {
    baseRps: 300,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Sticky sessions working',
    'Server failure (session lost)',
    'Better design: Stateless + Redis (no affinity needed)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 29: Active-Passive Failover
 * Teaches: Hot standby for high availability
 */
export const activePassiveFailoverProblem: ProblemDefinition = {
  id: 'sdp-active-passive-failover',
  title: 'Active-Passive Failover - Hot Standby',
  description: `Active-Passive failover: One active server, one standby (passive)
- Normal: All traffic → active server
- Failure: Active server fails → passive takes over
- Use case: High availability for stateful components (database, file server)

Learning objectives:
- Understand active-passive architecture
- Configure failover
- Test failure scenario
- Understand trade-offs (cost: idle passive server)

Example:
- Database: Primary (active) + Standby (passive)
- Normal: All writes → primary, replicated to standby
- Primary fails: Standby promoted to primary, takes all traffic
- Primary recovers: Can become new standby

Heartbeat mechanism:
- Active sends heartbeat to passive every 10s
- Passive monitors heartbeat
- Heartbeat missed → passive assumes active failed → takes over

Trade-offs:
- Pros: Simple, fast failover, strong consistency
- Cons: Passive server idle (50% resource waste), manual intervention often needed

Compare to Active-Active:
- Both servers handle traffic (no waste)
- More complex (need to sync state)

Key requirements:
- Configure active-passive pair
- Monitor heartbeat
- Simulate failure and failover`,

  userFacingFRs: [
    'Configure active-passive pair (primary + standby)',
    'Normal operation: All traffic to active',
    'Simulate active failure',
    'Passive takes over (promoted to active)',
    'Monitor failover time',
  ],
  userFacingNFRs: [
    'Failover time: < 30 seconds',
    'Data loss: None (synchronous replication)',
    'Availability: 99.9%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Health check and failover',
      },
      {
        type: 'storage',
        reason: 'Active-passive database pair',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Send requests',
      },
      {
        from: 'load_balancer',
        to: 'storage',
        reason: 'Route to active (failover to passive if needed)',
      },
    ],
  },

  scenarios: generateScenarios('sdp-active-passive-failover', problemConfigs['sdp-active-passive-failover'] || {
    baseRps: 500,
    readRatio: 0.7,
    maxLatency: 200,
    availability: 0.999,
  }, [
    'Normal operation (active only)',
    'Active fails → passive takes over',
    'Measure failover time and data loss',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 5. Reverse Proxy (4 problems)
// ============================================================================

/**
 * Problem 30: Nginx as Reverse Proxy
 * Teaches: Proxy requests to backend servers
 */
export const nginxReverseProxyProblem: ProblemDefinition = {
  id: 'sdp-nginx-reverse-proxy',
  title: 'Nginx as Reverse Proxy',
  description: `Reverse proxy sits between clients and servers, forwarding requests:
- Client connects to reverse proxy (not directly to backend)
- Proxy forwards request to backend server
- Backend responds to proxy
- Proxy forwards response to client

Learning objectives:
- Understand reverse proxy vs forward proxy
- Configure Nginx as reverse proxy
- Understand benefits (security, caching, SSL termination)
- Compare to load balancer

Benefits:
- Hide backend servers (security)
- SSL termination (decrypt once at proxy)
- Caching (serve static content from proxy)
- Compression (gzip at proxy)
- Load balancing (proxy can distribute)

Example config:
\`\`\`nginx
server {
  listen 80;
  location / {
    proxy_pass http://backend:3000;
  }
}
\`\`\`

Key requirements:
- Configure reverse proxy
- Test request forwarding
- Monitor proxy performance`,

  userFacingFRs: [
    'Configure Nginx as reverse proxy',
    'Forward HTTP requests to backend',
    'Add X-Forwarded-For header (preserve client IP)',
    'Monitor proxy latency',
  ],
  userFacingNFRs: [
    'Proxy latency: < 10ms overhead',
    'Throughput: Same as backend',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Reverse proxy (Nginx)',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Connect to reverse proxy',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Proxy to backend',
      },
    ],
  },

  scenarios: generateScenarios('sdp-nginx-reverse-proxy', problemConfigs['sdp-nginx-reverse-proxy'] || {
    baseRps: 500,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Direct connection (no proxy)',
    'With reverse proxy (minimal overhead)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 31: SSL Termination at Reverse Proxy
 * Teaches: Decrypt HTTPS at proxy, HTTP to backend
 */
export const sslTerminationProxyProblem: ProblemDefinition = {
  id: 'sdp-ssl-termination-proxy',
  title: 'SSL Termination at Reverse Proxy',
  description: `SSL termination: Decrypt HTTPS at reverse proxy, use HTTP to backend
- Client → Proxy: HTTPS (encrypted)
- Proxy decrypts: Extract HTTP request
- Proxy → Backend: HTTP (unencrypted, in private network)
- Response path: HTTP → Proxy → HTTPS

Learning objectives:
- Configure SSL certificate at proxy
- Understand CPU savings (backend doesn't decrypt)
- Understand security considerations
- Compare to end-to-end encryption

Benefits:
- Centralized certificate management (one place)
- Reduce backend CPU (SSL is expensive)
- Simplify backend (no SSL config)

Security considerations:
- Proxy → Backend over private network: OK to use HTTP
- Proxy → Backend over internet: Must use HTTPS (re-encrypt)

Example Nginx config:
\`\`\`nginx
server {
  listen 443 ssl;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://backend:3000;  # HTTP to backend
  }
}
\`\`\`

Key requirements:
- Configure SSL at proxy
- Use HTTP to backend
- Measure CPU reduction on backend`,

  userFacingFRs: [
    'Configure SSL certificate at proxy',
    'Client connects via HTTPS',
    'Proxy → backend via HTTP',
    'Measure backend CPU (should be lower)',
  ],
  userFacingNFRs: [
    'SSL handshake: < 100ms',
    'Backend CPU: 20% lower (no SSL overhead)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Reverse proxy with SSL termination',
      },
      {
        type: 'compute',
        reason: 'Backend servers (HTTP only)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'HTTPS connection',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'HTTP to backend',
      },
    ],
  },

  scenarios: generateScenarios('sdp-ssl-termination-proxy', problemConfigs['sdp-ssl-termination-proxy'] || {
    baseRps: 500,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Backend handles SSL (high CPU)',
    'Proxy handles SSL (lower backend CPU)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 32: Compression at Reverse Proxy
 * Teaches: Gzip responses at proxy to save bandwidth
 */
export const compressionProxyProblem: ProblemDefinition = {
  id: 'sdp-compression-proxy',
  title: 'Compression at Reverse Proxy',
  description: `Compress responses at proxy to reduce bandwidth and improve latency:
- Backend → Proxy: Uncompressed response
- Proxy compresses: Gzip response body
- Proxy → Client: Compressed response (smaller, faster)
- Client decompresses: Browser automatically decompresses

Learning objectives:
- Configure gzip compression at proxy
- Measure bandwidth reduction
- Understand CPU vs bandwidth trade-off
- Choose appropriate compression level

Benefits:
- Reduce bandwidth: 70-90% for text (HTML, CSS, JS, JSON)
- Faster transfer: Smaller payload over network
- Offload from backend: Backend sends uncompressed

Trade-offs:
- CPU cost: Compression uses CPU (but worth it)
- Not for images: JPEG, PNG already compressed

Example Nginx config:
\`\`\`nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_comp_level 6;  # 1 (fast, less compression) to 9 (slow, more compression)
\`\`\`

Compression results:
- HTML: ~80% reduction (100KB → 20KB)
- JSON: ~70% reduction (50KB → 15KB)
- JPEG: ~5% reduction (already compressed)

Key requirements:
- Configure gzip at proxy
- Measure bandwidth reduction
- Test different compression levels`,

  userFacingFRs: [
    'Serve 100KB HTML without compression',
    'Enable gzip at proxy (level 6)',
    'Measure response size (expect ~20KB)',
    'Measure client latency (expect faster)',
  ],
  userFacingNFRs: [
    'Bandwidth reduction: > 70% for text content',
    'Latency: Improved (smaller payload)',
    'Proxy CPU: Slightly higher (compression overhead)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Reverse proxy with compression',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Receive compressed responses',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Fetch uncompressed from backend',
      },
    ],
  },

  scenarios: generateScenarios('sdp-compression-proxy', problemConfigs['sdp-compression-proxy'] || {
    baseRps: 500,
    readRatio: 1.0,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'No compression (100KB responses)',
    'With compression (20KB responses, faster)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 33: Static Asset Serving from Proxy
 * Teaches: Serve static files directly from proxy (cache)
 */
export const staticAssetServingProxyProblem: ProblemDefinition = {
  id: 'sdp-static-asset-proxy',
  title: 'Static Asset Serving from Reverse Proxy',
  description: `Serve static files directly from proxy cache (don't hit backend):
- First request: Proxy fetches from backend, caches, serves to client
- Subsequent requests: Proxy serves from cache (no backend request)
- Benefit: Reduce backend load, faster response

Learning objectives:
- Configure static file caching at proxy
- Set cache TTL
- Monitor cache hit ratio
- Understand when to use proxy cache vs CDN

Example Nginx config:
\`\`\`nginx
location ~* \\.(jpg|jpeg|png|css|js)$ {
  proxy_pass http://backend;
  proxy_cache my_cache;
  proxy_cache_valid 200 1h;  # Cache 200 responses for 1 hour
}
\`\`\`

When to use:
- Small static files (CSS, JS, small images)
- Single region (all users close to proxy)

When to use CDN instead:
- Large files (videos)
- Global users (need edge locations worldwide)
- Very high traffic (CDN has more capacity)

Key requirements:
- Configure proxy cache
- Measure cache hit ratio
- Compare to no cache`,

  userFacingFRs: [
    'First request for /style.css → fetch from backend, cache',
    'Subsequent requests for /style.css → serve from cache',
    'Monitor cache hit ratio',
    'Set cache TTL (1 hour)',
  ],
  userFacingNFRs: [
    'Cache hit ratio: > 90% (after warm-up)',
    'Cached response latency: < 10ms',
    'Backend load: 90% reduction',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Reverse proxy with caching',
      },
      {
        type: 'compute',
        reason: 'Backend servers',
      },
      {
        type: 'object_storage',
        reason: 'Static file storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Request static files',
      },
      {
        from: 'load_balancer',
        to: 'object_storage',
        reason: 'Fetch on cache miss',
      },
    ],
  },

  scenarios: generateScenarios('sdp-static-asset-proxy', problemConfigs['sdp-static-asset-proxy'] || {
    baseRps: 1000,
    readRatio: 1.0,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Cold cache (many backend requests)',
    'Warm cache (90% cache hit, minimal backend load)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 6. Application Layer (10 problems)
// ============================================================================

/**
 * Problem 34: Microservices Architecture
 * Teaches: Decompose monolith into microservices
 */
export const microservicesProblem: ProblemDefinition = {
  id: 'sdp-microservices',
  title: 'Microservices Architecture',
  description: `Microservices: Decompose application into small, independent services
- Each service: Single responsibility, own database, independent deployment
- Communication: HTTP/REST, gRPC, or message queues
- Benefits: Independent scaling, technology flexibility, fault isolation

Learning objectives:
- Decompose monolith into microservices
- Design service boundaries
- Implement inter-service communication
- Understand trade-offs vs monolith

Example decomposition (E-commerce):
- Monolith: One app handles users, products, orders, payments
- Microservices:
  - User Service: Authentication, profiles
  - Product Service: Catalog, search
  - Order Service: Shopping cart, checkout
  - Payment Service: Process payments

Benefits:
- Independent scaling: Scale product service during traffic spike
- Technology flexibility: User service in Node.js, Payment service in Java
- Fault isolation: Payment service fails → rest of app works

Trade-offs:
- Complexity: More services to manage
- Network overhead: Inter-service calls over network
- Data consistency: Distributed transactions harder

Key requirements:
- Split monolith into 3+ services
- Implement API gateway
- Handle inter-service communication`,

  userFacingFRs: [
    'Monolith handles users + products + orders',
    'Split into User Service, Product Service, Order Service',
    'Implement API gateway (single entry point)',
    'Test inter-service communication',
  ],
  userFacingNFRs: [
    'Latency: < 200ms (including inter-service calls)',
    'Independent deployment: Deploy one service without affecting others',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'API gateway',
      },
      {
        type: 'compute',
        reason: 'Multiple microservices',
      },
      {
        type: 'storage',
        reason: 'Database per service',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'API gateway',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Route to microservices',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Each service has own database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-microservices', problemConfigs['sdp-microservices'] || {
    baseRps: 1000,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Monolith (simple, single deployment)',
    'Microservices (complex, independent scaling)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 35: Service Discovery
 * Teaches: Services find each other dynamically (Consul, etcd)
 */
export const serviceDiscoveryProblem: ProblemDefinition = {
  id: 'sdp-service-discovery',
  title: 'Service Discovery - Consul, etcd, Zookeeper',
  description: `Service discovery: Services register and discover each other dynamically
- Problem: In microservices, service locations change (auto-scaling, failures)
- Solution: Service registry (Consul, etcd, Zookeeper)
- Services register on startup, discover others by querying registry

Learning objectives:
- Understand service discovery need
- Implement service registry
- Register services on startup
- Discover services dynamically

Example without service discovery:
- Order Service needs to call Payment Service
- Hardcode: http://payment-service:3000
- Problem: What if payment service scales to 3 instances? Which one to call?
- Problem: What if payment service moves to different host?

Example with service discovery:
1. Payment Service starts → registers with Consul: "payment-service: 10.0.1.5:3000"
2. Payment Service scales to 3 instances → all register
3. Order Service queries Consul: "Where is payment-service?"
4. Consul returns: ["10.0.1.5:3000", "10.0.1.6:3000", "10.0.1.7:3000"]
5. Order Service picks one (round robin, random)

Popular tools:
- Consul: Service discovery + health checks + KV store
- etcd: KV store used by Kubernetes
- Zookeeper: Distributed coordination

Key requirements:
- Deploy service registry
- Services register on startup
- Services query for dependencies`,

  userFacingFRs: [
    'Deploy Consul (service registry)',
    'Service A registers: "service-a: 10.0.1.5:3000"',
    'Service B queries: "Where is service-a?"',
    'Consul returns service-a location',
    'Service A scales → all instances register',
  ],
  userFacingNFRs: [
    'Discovery latency: < 10ms',
    'Registry availability: 99.99%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Service registry (Consul)',
      },
      {
        type: 'compute',
        reason: 'Microservices (register and discover)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Services query registry',
      },
    ],
  },

  scenarios: generateScenarios('sdp-service-discovery', problemConfigs['sdp-service-discovery'] || {
    baseRps: 500,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Hardcoded service locations (breaks on scale)',
    'Service discovery (dynamic, scales automatically)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 36: Backend for Frontend (BFF)
 * Teaches: Custom API for each client type (mobile, web, desktop)
 */
export const bffProblem: ProblemDefinition = {
  id: 'sdp-bff',
  title: 'Backend for Frontend (BFF)',
  description: `BFF: Create separate backend API for each client type
- Web BFF: Optimized for web browsers
- Mobile BFF: Optimized for mobile apps (smaller payloads)
- Desktop BFF: Optimized for desktop apps

Learning objectives:
- Understand BFF pattern
- Create client-specific APIs
- Optimize for each client's needs
- Compare to universal API

Example:
- Mobile app: Needs minimal data (small screen, slow network)
  - Mobile BFF: Returns only essential fields
  - Response: {id, name, price} (100 bytes)
- Web app: Needs more data (large screen, fast network)
  - Web BFF: Returns full product details
  - Response: {id, name, price, description, images, reviews} (5KB)

Benefits:
- Optimized for client: Each client gets exactly what it needs
- Independent evolution: Update mobile BFF without affecting web
- Simplified client code: No filtering on client

Trade-offs:
- More backends to maintain (one per client type)
- Code duplication (similar logic in each BFF)

Key requirements:
- Create Mobile BFF and Web BFF
- Optimize responses for each client
- Test with mobile and web clients`,

  userFacingFRs: [
    'Create Mobile BFF (minimal responses)',
    'Create Web BFF (full responses)',
    'Mobile client → Mobile BFF (small payload)',
    'Web client → Web BFF (full payload)',
  ],
  userFacingNFRs: [
    'Mobile response: < 1KB (optimized)',
    'Web response: Full data (5KB)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Mobile BFF',
      },
      {
        type: 'compute',
        reason: 'Web BFF',
      },
      {
        type: 'storage',
        reason: 'Shared database',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients connect to their BFF',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'BFFs query database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-bff', problemConfigs['sdp-bff'] || {
    baseRps: 500,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Universal API (one size fits all)',
    'BFF pattern (optimized per client)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 37: Sidecar Pattern (Service Mesh)
 * Teaches: Deploy proxy alongside each service (Envoy, Istio)
 */
export const sidecarProblem: ProblemDefinition = {
  id: 'sdp-sidecar',
  title: 'Sidecar Pattern - Service Mesh (Envoy, Istio)',
  description: `Sidecar: Deploy proxy alongside each service instance
- Each service has a sidecar proxy (Envoy)
- All traffic goes through sidecar
- Sidecar handles: Routing, retries, circuit breaking, telemetry

Learning objectives:
- Understand sidecar pattern
- Deploy Envoy sidecar
- Understand service mesh benefits
- Compare to library-based approach

Example:
- Without sidecar: Service A calls Service B directly
  - Problem: Must implement retry logic, circuit breaker in code
  - Problem: If you have 10 services in 5 languages, implement 50 times!
- With sidecar: Service A → Envoy sidecar → Service B's sidecar → Service B
  - Sidecar handles retry, circuit breaker, metrics
  - Works for all services, any language

Service mesh (Istio):
- Control plane: Configure all sidecars
- Data plane: Envoy sidecars handle traffic
- Benefits: Centralized configuration, consistent behavior

Trade-offs:
- Complexity: Extra process per service
- Latency: Two extra hops (service → sidecar → sidecar → service)
- Resource overhead: Each sidecar uses CPU/memory

Key requirements:
- Deploy Envoy sidecar for each service
- Configure retry policy in sidecar
- Test automatic retries`,

  userFacingFRs: [
    'Deploy Service A without sidecar',
    'Deploy Envoy sidecar for Service A',
    'All traffic goes through sidecar',
    'Configure retry policy (3 retries, 100ms backoff)',
    'Test automatic retries on failure',
  ],
  userFacingNFRs: [
    'Latency overhead: < 5ms per sidecar hop',
    'Automatic retries: 3 attempts',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Services with sidecars',
      },
      {
        type: 'load_balancer',
        reason: 'Sidecar proxies',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Through sidecar',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Sidecar to service',
      },
    ],
  },

  scenarios: generateScenarios('sdp-sidecar', problemConfigs['sdp-sidecar'] || {
    baseRps: 500,
    readRatio: 0.8,
    maxLatency: 150,
    availability: 0.99,
  }, [
    'Without sidecar (direct service calls)',
    'With sidecar (automatic retries, circuit breaking)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 38: Bulkhead Pattern
 * Teaches: Isolate resources to prevent cascading failures
 */
export const bulkheadProblem: ProblemDefinition = {
  id: 'sdp-bulkhead',
  title: 'Bulkhead Pattern - Isolate Resources',
  description: `Bulkhead: Isolate resources to limit failure blast radius
- Analogy: Ship bulkheads prevent one leak from sinking entire ship
- Application: Partition resources (threads, connections) per dependency

Learning objectives:
- Understand bulkhead pattern
- Partition thread pools
- Limit failure blast radius
- Compare to shared resource pool

Example without bulkhead:
- Service has one thread pool (100 threads)
- Calls two dependencies: Fast API (10ms) and Slow API (5000ms)
- Slow API saturates: All 100 threads waiting for Slow API
- Fast API requests starve: No threads available!
- Entire service down because of one slow dependency

Example with bulkhead:
- Partition thread pool: 50 threads for Fast API, 50 for Slow API
- Slow API saturates: All 50 threads for Slow API waiting
- Fast API still works: Has dedicated 50 threads
- Failure isolated: Only Slow API requests affected

Implementation:
- Separate thread pools per dependency
- Separate connection pools per database
- Kubernetes: Resource limits per pod

Key requirements:
- Create shared thread pool (vulnerable)
- Simulate slow dependency (saturates pool)
- Create bulkheads (isolated pools)
- Verify other dependencies still work`,

  userFacingFRs: [
    'Shared thread pool: 100 threads for all dependencies',
    'Call Fast API (10ms) and Slow API (5s)',
    'Slow API saturates → Fast API also fails (no threads)',
    'Implement bulkhead: 50 threads for each',
    'Slow API saturates → Fast API still works (isolated)',
  ],
  userFacingNFRs: [
    'Without bulkhead: Cascading failure (entire service down)',
    'With bulkhead: Isolated failure (only Slow API affected)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Services with bulkheads',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Call services',
      },
    ],
  },

  scenarios: generateScenarios('sdp-bulkhead', problemConfigs['sdp-bulkhead'] || {
    baseRps: 500,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Shared pool: Cascading failure',
    'Bulkheads: Isolated failure',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Note: Problems 39-43 are already covered in DDIA or other sections
// We'll create simplified versions here for completeness

/**
 * Problem 39: Retry with Exponential Backoff
 * Teaches: Retry failed requests with increasing delays
 */
export const retryBackoffProblem: ProblemDefinition = {
  id: 'sdp-retry-backoff',
  title: 'Retry with Exponential Backoff',
  description: `Retry with exponential backoff: Retry failed requests with increasing delays
- First retry: Immediate or short delay (100ms)
- Second retry: 200ms
- Third retry: 400ms
- Fourth retry: 800ms
- Pattern: Delay doubles each time (exponential)

Learning objectives:
- Implement retry logic
- Use exponential backoff
- Add jitter (randomness)
- Limit max retries

Why exponential backoff?
- Linear backoff (100ms, 200ms, 300ms): Still overwhelms recovering service
- Exponential (100ms, 200ms, 400ms, 800ms): Gives service time to recover

Why jitter?
- Without jitter: All clients retry at same time (thundering herd)
- With jitter: Add randomness (±50%) to spread out retries

Example implementation:
\`\`\`javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      const delay = Math.min(100 * Math.pow(2, i), 3000);  // Max 3s
      const jitter = delay * (Math.random() * 0.5 + 0.75);  // ±25%
      await sleep(jitter);
    }
  }
}
\`\`\`

Key requirements:
- Implement exponential backoff
- Add jitter
- Test retry behavior`,

  userFacingFRs: [
    'Call failing service (100% errors)',
    'Retry 3 times with exponential backoff',
    'Monitor retry delays (100ms, 200ms, 400ms)',
    'Add jitter to prevent thundering herd',
  ],
  userFacingNFRs: [
    'Retry delays: Exponential (doubles each time)',
    'Jitter: ±25% randomness',
    'Max retries: 3',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Client with retry logic',
      },
      {
        type: 'compute',
        reason: 'Server (may fail)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Client retries to server',
      },
    ],
  },

  scenarios: generateScenarios('sdp-retry-backoff', problemConfigs['sdp-retry-backoff'] || {
    baseRps: 100,
    readRatio: 0.8,
    maxLatency: 2000,
    availability: 0.95,
  }, [
    'No retries (fails immediately)',
    'With exponential backoff (recovers from transient failures)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 40: Rate Limiting
 * Teaches: Throttle requests to protect service
 */
export const rateLimitingProblem: ProblemDefinition = {
  id: 'sdp-rate-limiting',
  title: 'Rate Limiting - Throttle Requests',
  description: `Rate limiting: Limit requests per user/IP to prevent abuse
- Algorithm: Token bucket, leaky bucket, fixed window, sliding window
- Limit: 100 requests per minute per user
- Response: HTTP 429 Too Many Requests

Learning objectives:
- Implement rate limiting
- Choose algorithm (token bucket recommended)
- Set appropriate limits
- Handle rate limit errors

Common algorithms:
1. **Token Bucket** (recommended):
   - Bucket holds tokens (e.g., 100)
   - Each request consumes 1 token
   - Tokens refill at fixed rate (e.g., 100/minute)
   - Allows bursts (can use all 100 immediately)

2. **Leaky Bucket**:
   - Requests added to queue
   - Processed at fixed rate
   - Smooth, no bursts allowed

3. **Fixed Window**:
   - Count requests per minute
   - Reset counter at minute boundary
   - Problem: Can do 200 requests in 1 second (99 at :59s, 101 at :00s)

4. **Sliding Window**:
   - Count requests in last 60 seconds
   - More accurate than fixed window

Example implementation (token bucket):
\`\`\`javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  tryConsume() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    return false;  // Rate limited
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
\`\`\`

Key requirements:
- Implement token bucket
- Set limit (100 req/min)
- Return 429 when limit exceeded`,

  userFacingFRs: [
    'Implement token bucket rate limiter',
    'Set limit: 100 requests per minute per user',
    'Normal traffic: All requests succeed',
    'Burst traffic (200 req/min): Some requests get 429 error',
  ],
  userFacingNFRs: [
    'Rate limit: 100 req/min per user',
    'Burst allowed: Up to 100 immediately',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Service with rate limiting',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Requests (rate limited)',
      },
    ],
  },

  scenarios: generateScenarios('sdp-rate-limiting', problemConfigs['sdp-rate-limiting'] || {
    baseRps: 100,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'No rate limiting (vulnerable to abuse)',
    'With rate limiting (protected)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 41: API Versioning
 * Teaches: Support multiple API versions (v1, v2)
 */
export const apiVersioningProblem: ProblemDefinition = {
  id: 'sdp-api-versioning',
  title: 'API Versioning - v1, v2',
  description: `API versioning: Support multiple API versions for backwards compatibility
- v1: Old clients use v1
- v2: New clients use v2
- Both versions coexist during migration

Learning objectives:
- Implement API versioning
- Support multiple versions simultaneously
- Plan deprecation strategy
- Choose versioning scheme

Versioning schemes:
1. **URL path**: /v1/users, /v2/users (recommended, clear)
2. **Query parameter**: /users?version=1
3. **Header**: Accept: application/vnd.api+json;version=1
4. **Subdomain**: v1.api.example.com

Example migration:
- v1 API: Returns user {id, name}
- v2 API: Returns user {id, firstName, lastName, email}
- Old mobile app: Still uses v1 (can't force update)
- New mobile app: Uses v2
- Both versions run for 6 months
- After 6 months: Deprecate v1

Deprecation process:
1. Release v2
2. Mark v1 deprecated (add warning header)
3. Set sunset date (e.g., 6 months)
4. Monitor v1 usage (should decline)
5. Shut down v1 after sunset date

Key requirements:
- Implement /v1/users and /v2/users
- Test both versions
- Plan deprecation timeline`,

  userFacingFRs: [
    'Implement v1 API: GET /v1/users → {id, name}',
    'Implement v2 API: GET /v2/users → {id, firstName, lastName, email}',
    'Old client uses v1 (works)',
    'New client uses v2 (works)',
    'Add deprecation warning to v1 responses',
  ],
  userFacingNFRs: [
    'Both versions available simultaneously',
    'v1 sunset date: 6 months from v2 release',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Service with v1 and v2 APIs',
      },
      {
        type: 'storage',
        reason: 'Database',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients call /v1/ or /v2/',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Query database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-api-versioning', problemConfigs['sdp-api-versioning'] || {
    baseRps: 500,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Single version (breaking changes break clients)',
    'Multiple versions (backwards compatible)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all infrastructure problems for easy import
export const systemDesignPrimerInfrastructureProblems = [
  // Performance & Scalability
  performanceVsScalabilityProblem,
  latencyVsThroughputProblem,
  capTheoremProblem,
  amdahlsLawProblem,
  littlesLawProblem,
  loadTestingProblem,
  stressTestingProblem,
  capacityPlanningProblem,
  performanceProfilingProblem,
  costOptimizationProblem,

  // DNS
  dnsBasicsProblem,
  dnsRecordsProblem,
  dnsCachingProblem,
  dnsLoadBalancingProblem,
  geoRoutingProblem,

  // CDN
  cdnBasicsProblem,
  pushCdnProblem,
  pullCdnProblem,
  cdnCacheInvalidationProblem,
  cdnSslTerminationProblem,
  cdnDdosProtectionProblem,

  // Load Balancers
  layer4LoadBalancingProblem,
  layer7LoadBalancingProblem,
  roundRobinLoadBalancingProblem,
  leastConnectionsLoadBalancingProblem,
  ipHashLoadBalancingProblem,
  healthChecksLoadBalancingProblem,
  sessionAffinityLoadBalancingProblem,
  activePassiveFailoverProblem,

  // Reverse Proxy
  nginxReverseProxyProblem,
  sslTerminationProxyProblem,
  compressionProxyProblem,
  staticAssetServingProxyProblem,

  // Application Layer
  microservicesProblem,
  serviceDiscoveryProblem,
  bffProblem,
  sidecarProblem,
  bulkheadProblem,
  retryBackoffProblem,
  rateLimitingProblem,
  apiVersioningProblem,
];

// Auto-generate code challenges from functional requirements
(performanceVsScalabilityProblem as any).codeChallenges = generateCodeChallengesFromFRs(performanceVsScalabilityProblem);
