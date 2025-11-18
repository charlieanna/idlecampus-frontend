import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * DDIA Teaching Problems - Chapter 1: Reliability, Scalability, Maintainability
 * Total: 15 foundational concept problems
 *
 * Focus: Core principles of data-intensive applications
 */

// ============================================================================
// 1.1 Reliability
// ============================================================================

/**
 * Problem 1: Single Point of Failure (SPOF)
 * Teaches: Identifying and eliminating single points of failure
 */
export const spofProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-spof',
  title: 'Single Point of Failure - Eliminate SPOFs',
  description: `Design a simple web application and identify all single points of failure. Then redesign to eliminate SPOFs through redundancy. Learn how a single failed component can bring down an entire system.

Learning objectives:
- Identify single points of failure in a system
- Add redundancy to critical components
- Understand availability mathematics (serial vs parallel)

Example: Single database server is a SPOF - if it fails, entire app fails.

Key requirements:
- Initial design with SPOFs (single server, single database)
- Identify all SPOFs
- Redesign with redundancy (load balancer, multiple servers, database replicas)`,

  userFacingFRs: [
    'Deploy web application with single server (SPOF)',
    'Add load balancer with multiple app servers (eliminate app server SPOF)',
    'Add database replication (eliminate database SPOF)',
    'Add redundant load balancers (eliminate LB SPOF)',
  ],
  userFacingNFRs: [
    'Availability: 99% with SPOF → 99.9% without SPOF',
    'Fault tolerance: System continues if any single component fails',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Multiple load balancers for redundancy',
      },
      {
        type: 'compute',
        reason: 'Multiple app servers',
      },
      {
        type: 'storage',
        reason: 'Primary and replica databases',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Route through redundant load balancers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute to multiple app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Connect to database cluster',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-spof', problemConfigs['ddia-ch1-spof'] || {
    baseRps: 1000,
    readRatio: 0.7,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Deploy with single server (SPOF)',
    'Add load balancer with multiple servers',
    'Add database replication',
    'Add redundant load balancers',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 2: Hardware Faults
 * Teaches: Handling disk failures, server crashes gracefully
 */
export const hardwareFaultsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-hardware-faults',
  title: 'Hardware Faults - Disk & Server Failures',
  description: `Design a system that tolerates hardware failures like disk crashes and server failures. Use RAID for disk redundancy and server replication for fault tolerance.

Learning objectives:
- Handle disk failures with RAID
- Handle server failures with replication
- Implement automatic failover

Key requirements:
- RAID for disk redundancy (survive single disk failure)
- Multiple servers with replication
- Automatic detection and failover`,

  userFacingFRs: [
    'Use RAID 1 or RAID 5 for disk redundancy',
    'Replicate data across multiple servers',
    'Monitor disk health (SMART metrics)',
    'Detect server failures via heartbeats',
    'Automatically failover to backup server',
  ],
  userFacingNFRs: [
    'Disk failure recovery: <1 minute',
    'Server failure recovery: <30 seconds',
    'Data durability: 99.999% (no data loss on single failure)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Primary storage with RAID',
      },
      {
        type: 'storage',
        reason: 'Replica storage for server-level redundancy',
      },
      {
        type: 'compute',
        reason: 'Health monitoring and failover coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Send requests through coordinator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write to primary and replica',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-hardware-faults', problemConfigs['ddia-ch1-hardware-faults'] || {
    baseRps: 500,
    readRatio: 0.5,
    maxLatency: 100,
    availability: 0.9999,
  }, [
    'Use RAID for disk redundancy',
    'Replicate across servers',
    'Monitor disk and server health',
    'Auto-failover on failures',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 3: Software Errors
 * Teaches: Handle bugs, cascading failures, resource exhaustion
 */
export const softwareErrorsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-software-errors',
  title: 'Software Errors - Bugs & Cascading Failures',
  description: `Design a system that handles software bugs gracefully without cascading failures. Implement timeouts, circuit breakers, and resource limits to prevent one failing component from taking down the entire system.

Learning objectives:
- Prevent cascading failures with circuit breakers
- Use timeouts to avoid hanging requests
- Implement resource limits (memory, CPU, connections)

Example: If recommendation service is slow, don't let it slow down entire page - timeout and show default recommendations.

Key requirements:
- Circuit breakers between services
- Request timeouts
- Resource limits (max connections, memory)
- Graceful degradation`,

  userFacingFRs: [
    'Implement circuit breaker pattern between services',
    'Set request timeouts (e.g., 3 seconds)',
    'Limit max connections per service',
    'Gracefully degrade when dependencies fail',
    'Return cached/default data on errors',
  ],
  userFacingNFRs: [
    'Circuit breaker opens after 5 consecutive failures',
    'Timeout: 3 seconds for service calls',
    'Max connections: 100 per service',
    'Availability: System stays up even if dependencies fail',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Main application service',
      },
      {
        type: 'compute',
        reason: 'Dependent services that may fail',
      },
      {
        type: 'cache',
        reason: 'Cache for fallback data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'User requests',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Service calls with circuit breakers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Fetch fallback data',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-software-errors', problemConfigs['ddia-ch1-software-errors'] || {
    baseRps: 2000,
    readRatio: 0.8,
    maxLatency: 3000,
    availability: 0.99,
  }, [
    'Circuit breaker between services',
    'Request timeouts',
    'Resource limits',
    'Graceful degradation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 4: Human Errors
 * Teaches: Design for operator mistakes, easy rollback
 */
export const humanErrorsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-human-errors',
  title: 'Human Errors - Design for Mistakes',
  description: `Design a deployment system that minimizes impact of human errors. Implement sandboxes, easy rollbacks, and gradual rollouts to catch mistakes before they affect all users.

Learning objectives:
- Provide sandbox/staging environments
- Implement one-click rollback
- Use blue-green or canary deployments
- Add confirmation prompts for dangerous operations

Key requirements:
- Separate production, staging, dev environments
- Blue-green deployment for easy rollback
- Canary deployment to test with 5% of users first
- Require confirmation for destructive actions`,

  userFacingFRs: [
    'Maintain separate dev, staging, production environments',
    'Deploy to staging first, then production',
    'Blue-green deployment: Switch traffic between old/new versions',
    'Canary deployment: Route 5% traffic to new version initially',
    'One-click rollback to previous version',
    'Require typed confirmation for dangerous ops (e.g., DROP DATABASE)',
  ],
  userFacingNFRs: [
    'Rollback time: <1 minute',
    'Canary duration: 1 hour minimum',
    'Zero-downtime deployments',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Blue environment (current version)',
      },
      {
        type: 'compute',
        reason: 'Green environment (new version)',
      },
      {
        type: 'load_balancer',
        reason: 'Traffic switching between environments',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Route to current or new version',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute to blue or green environment',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-human-errors', problemConfigs['ddia-ch1-human-errors'] || {
    baseRps: 1500,
    readRatio: 0.7,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Separate environments',
    'Blue-green deployment',
    'Canary deployment',
    'One-click rollback',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 5: Chaos Engineering
 * Teaches: Test fault tolerance proactively
 */
export const chaosEngineeringProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-chaos-engineering',
  title: 'Chaos Engineering - Test Fault Tolerance',
  description: `Implement chaos engineering to proactively test system resilience. Randomly terminate servers, inject network latency, and exhaust resources to verify the system handles failures gracefully.

Learning objectives:
- Use chaos monkey to randomly kill servers
- Inject latency to simulate slow networks
- Exhaust resources to test limits
- Verify graceful degradation

Example: Netflix Chaos Monkey randomly terminates EC2 instances to ensure system stays up.

Key requirements:
- Randomly terminate a small % of servers
- Inject network latency and packet loss
- Fill disk to test disk full scenarios
- Verify system continues operating`,

  userFacingFRs: [
    'Chaos Monkey: Randomly terminate 1% of servers during business hours',
    'Latency Monkey: Add 100-500ms random latency',
    'Packet Loss: Drop 1% of network packets',
    'Disk Fill: Fill disk to 95% capacity',
    'Verify system health after each chaos test',
  ],
  userFacingNFRs: [
    'System must stay operational during all chaos tests',
    'Response time impact: <10% increase',
    'Error rate: <0.1% increase',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Multiple servers (some will be terminated)',
      },
      {
        type: 'compute',
        reason: 'Chaos engineering controller',
      },
      {
        type: 'load_balancer',
        reason: 'Route around failed servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Resilient request routing',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Health checks and routing',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-chaos-engineering', problemConfigs['ddia-ch1-chaos-engineering'] || {
    baseRps: 3000,
    readRatio: 0.7,
    maxLatency: 150,
    availability: 0.999,
  }, [
    'Randomly terminate servers',
    'Inject network latency',
    'Simulate disk full',
    'Verify system resilience',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 1.2 Scalability
// ============================================================================

/**
 * Problem 6: Vertical Scaling
 * Teaches: Scale up a single server (add CPU, RAM)
 */
export const verticalScalingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-vertical-scaling',
  title: 'Vertical Scaling - Scale Up',
  description: `Demonstrate vertical scaling by upgrading a single server's resources (CPU, RAM, disk). Understand the limits of vertical scaling - eventually you hit hardware limits and cost increases exponentially.

Learning objectives:
- Scale up by adding more powerful hardware
- Understand vertical scaling limits
- Learn when to switch to horizontal scaling

Example: Upgrade from 4-core to 16-core CPU, 8GB to 64GB RAM.

Key requirements:
- Monitor resource utilization (CPU, RAM, disk)
- Upgrade when hitting 80% utilization
- Track costs of vertical scaling
- Identify maximum feasible vertical scale`,

  userFacingFRs: [
    'Monitor CPU, RAM, disk usage',
    'When usage exceeds 80%, upgrade hardware',
    'Track performance improvement after upgrade',
    'Calculate cost per performance unit',
  ],
  userFacingNFRs: [
    'Performance: 2x CPU = ~2x throughput',
    'Limits: Max ~96 cores, 1TB RAM (practical limit)',
    'Cost: Exponential - large instances are inefficient',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Single server to scale vertically',
      },
      {
        type: 'compute',
        reason: 'Monitoring system',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Send load to server',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-vertical-scaling', problemConfigs['ddia-ch1-vertical-scaling'] || {
    baseRps: 2000,
    readRatio: 0.6,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Monitor resource utilization',
    'Upgrade when exceeding 80%',
    'Track performance gains',
    'Calculate costs',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 7: Horizontal Scaling
 * Teaches: Scale out by adding more servers
 */
export const horizontalScalingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-horizontal-scaling',
  title: 'Horizontal Scaling - Scale Out',
  description: `Implement horizontal scaling by adding more servers behind a load balancer. Learn how horizontal scaling provides better cost efficiency and higher availability than vertical scaling.

Learning objectives:
- Scale out by adding commodity servers
- Use load balancer to distribute traffic
- Understand shared-nothing architecture
- Learn cost efficiency of horizontal scaling

Key requirements:
- Start with 2 servers behind load balancer
- Add servers as load increases
- Ensure stateless servers (session in cache/DB)
- Linear cost and performance scaling`,

  userFacingFRs: [
    'Deploy load balancer',
    'Start with 2 application servers',
    'Add servers when CPU usage > 70%',
    'Ensure servers are stateless',
    'Store sessions in Redis/database',
  ],
  userFacingNFRs: [
    'Scalability: Linear (2x servers = 2x throughput)',
    'Cost efficiency: Commodity servers cheaper than high-end',
    'Availability: Lose 1 server = minor capacity reduction',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Distribute traffic across servers',
      },
      {
        type: 'compute',
        reason: 'Multiple stateless application servers',
      },
      {
        type: 'cache',
        reason: 'Shared session storage',
      },
      {
        type: 'storage',
        reason: 'Shared database',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Route to servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Distribute across servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Shared session state',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Shared data',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-horizontal-scaling', problemConfigs['ddia-ch1-horizontal-scaling'] || {
    baseRps: 5000,
    readRatio: 0.7,
    maxLatency: 80,
    availability: 0.999,
  }, [
    'Deploy load balancer',
    'Add servers as load increases',
    'Ensure stateless servers',
    'Store sessions externally',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 8: Load Parameters
 * Teaches: Identify and measure system load
 */
export const loadParametersProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-load-parameters',
  title: 'Load Parameters - Measure System Load',
  description: `Identify the key load parameters for your system and measure them. Different systems have different load characteristics: requests per second, concurrent users, data volume, cache hit rate, etc.

Learning objectives:
- Identify relevant load parameters for your system
- Measure and track load metrics
- Understand which parameters matter most

Example: Twitter's key load is fan-out ratio (avg followers per user), not just tweets/sec.

Key requirements:
- Measure requests per second (RPS)
- Track concurrent active users
- Monitor database queries per second
- Track cache hit rate
- Measure write amplification (fan-out ratio)`,

  userFacingFRs: [
    'Track requests per second (RPS)',
    'Measure concurrent active users',
    'Monitor database reads and writes per second',
    'Calculate cache hit rate',
    'Track fan-out ratio for writes (e.g., 1 write → 100 reads)',
  ],
  userFacingNFRs: [
    'Metrics granularity: 1-second resolution',
    'Retention: 90 days of metrics',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers with metrics',
      },
      {
        type: 'storage',
        reason: 'Time-series database for metrics (Prometheus, InfluxDB)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Send metrics to time-series DB',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-load-parameters', problemConfigs['ddia-ch1-load-parameters'] || {
    baseRps: 1000,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Track RPS',
    'Measure concurrent users',
    'Monitor DB queries/sec',
    'Calculate cache hit rate',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 9: Performance Metrics
 * Teaches: Measure latency percentiles (p50, p95, p99)
 */
export const performanceMetricsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-performance-metrics',
  title: 'Performance Metrics - Latency Percentiles',
  description: `Measure response time using percentiles (p50, p95, p99, p999) rather than averages. Averages hide outliers - the 99th percentile shows what the slowest 1% of users experience.

Learning objectives:
- Understand why percentiles matter more than averages
- Calculate p50, p95, p99 latency
- Set SLAs based on percentiles

Example: Average 100ms looks good, but p99 = 5 seconds means 1% of users wait 5+ seconds!

Key requirements:
- Track all request latencies
- Calculate p50, p95, p99, p999 percentiles
- Set SLA: p99 < 200ms
- Alert when p99 exceeds SLA`,

  userFacingFRs: [
    'Record every request latency',
    'Calculate percentiles: p50, p95, p99, p999',
    'Display latency distribution histogram',
    'Alert when p99 > 200ms',
  ],
  userFacingNFRs: [
    'p50 latency: <50ms',
    'p95 latency: <100ms',
    'p99 latency: <200ms',
    'p999 latency: <500ms',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application with latency tracking',
      },
      {
        type: 'storage',
        reason: 'Metrics database',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store latency metrics',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-performance-metrics', problemConfigs['ddia-ch1-performance-metrics'] || {
    baseRps: 2000,
    readRatio: 0.8,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Record request latencies',
    'Calculate p50, p95, p99',
    'Display histogram',
    'Alert on SLA violations',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 10: Fan-out Problem
 * Teaches: Handle Twitter-like fan-out on writes
 */
export const fanoutProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-fanout',
  title: 'Fan-out Problem - Twitter Timeline',
  description: `Solve the Twitter fan-out problem: when a user with 1M followers posts a tweet, do you write to 1M timelines immediately (write fan-out) or compute timelines on-demand (read fan-out)?

Learning objectives:
- Understand write fan-out vs read fan-out
- Handle celebrity users with millions of followers
- Hybrid approach: fan-out for normal users, merge for celebrities

Key requirements:
- Normal users (<10K followers): Write fan-out (push to all follower timelines)
- Celebrities (>10K followers): Read fan-out (merge at read time)
- Hybrid approach for best performance`,

  userFacingFRs: [
    'When user posts tweet, check follower count',
    'If < 10K followers: Write to all follower timelines (fan-out on write)',
    'If > 10K followers: Store in user timeline only (fan-out on read)',
    'On timeline read: Merge user tweets + celebrity tweets',
  ],
  userFacingNFRs: [
    'Post latency: <100ms for normal users',
    'Timeline read: <200ms (includes merge)',
    'Handle 1M+ followers for celebrities',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Tweet ingestion service',
      },
      {
        type: 'storage',
        reason: 'User timelines (Redis/Cassandra)',
      },
      {
        type: 'storage',
        reason: 'Tweet database',
      },
      {
        type: 'cache',
        reason: 'Cache for celebrity tweets',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Post tweets, read timelines',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Fan-out writes or reads',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Cache celebrity tweets',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-fanout', problemConfigs['ddia-ch1-fanout'] || {
    baseRps: 5000,
    readRatio: 0.95,
    maxLatency: 200,
    availability: 0.999,
  }, [
    'Check follower count on post',
    'Fan-out write for normal users',
    'Fan-out read for celebrities',
    'Merge timelines on read',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 1.3 Maintainability
// ============================================================================

/**
 * Problem 11: Operability
 * Teaches: Design for easy operations (monitoring, deployment)
 */
export const operabilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-operability',
  title: 'Operability - Easy Operations',
  description: `Design a system that's easy to operate. Provide good monitoring, clear documentation, automation, and self-healing capabilities to reduce operational burden.

Learning objectives:
- Implement comprehensive monitoring and alerting
- Automate deployments and scaling
- Provide runbooks for common issues
- Enable self-healing (auto-restart, auto-scale)

Key requirements:
- Monitoring dashboards (Grafana)
- Automated deployments (CI/CD)
- Auto-scaling based on load
- Runbooks for common failures`,

  userFacingFRs: [
    'Dashboards showing key metrics (RPS, latency, errors, CPU, memory)',
    'Alerts for anomalies (high latency, error rate)',
    'CI/CD pipeline for automated deployments',
    'Auto-scaling: Add servers when CPU > 70%',
    'Auto-restart failed services',
    'Runbooks documenting common issues and fixes',
  ],
  userFacingNFRs: [
    'Deployment frequency: Multiple times per day',
    'Mean time to recovery (MTTR): <10 minutes',
    'Alert fatigue: <5 alerts per day',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application services with health checks',
      },
      {
        type: 'compute',
        reason: 'Monitoring system (Prometheus + Grafana)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Send metrics to monitoring',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-operability', problemConfigs['ddia-ch1-operability'] || {
    baseRps: 2000,
    readRatio: 0.7,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Dashboards with key metrics',
    'Alerts for anomalies',
    'CI/CD pipeline',
    'Auto-scaling',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 12: Simplicity
 * Teaches: Avoid accidental complexity
 */
export const simplicityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-simplicity',
  title: 'Simplicity - Avoid Complexity',
  description: `Design a simple system that avoids accidental complexity. Use abstractions, standard patterns, and clear interfaces. Complexity is the enemy of maintainability.

Learning objectives:
- Identify accidental vs essential complexity
- Use abstractions to hide complexity
- Apply standard design patterns
- Keep interfaces simple and consistent

Example: Don't build custom distributed consensus - use proven systems like ZooKeeper, etcd.

Key requirements:
- Use proven libraries and frameworks
- Create clear abstraction layers
- Follow standard patterns (MVC, repository, factory)
- Document architectural decisions`,

  userFacingFRs: [
    'Use standard frameworks (Express, Django, Spring)',
    'Use proven databases (PostgreSQL, Redis) - avoid custom storage',
    'Create clear layers: API → Service → Repository → Database',
    'Use dependency injection for testability',
    'Document architecture decisions (ADRs)',
  ],
  userFacingNFRs: [
    'Onboarding time: New developer productive in <1 week',
    'Code complexity: Avoid deeply nested logic (max 3 levels)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application with clear layered architecture',
      },
      {
        type: 'storage',
        reason: 'Standard database (PostgreSQL)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'API layer',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Repository pattern',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-simplicity', problemConfigs['ddia-ch1-simplicity'] || {
    baseRps: 1000,
    readRatio: 0.7,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Use standard frameworks',
    'Clear layered architecture',
    'Standard design patterns',
    'Document decisions',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 13: Evolvability
 * Teaches: Design for change
 */
export const evolvabilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-evolvability',
  title: 'Evolvability - Design for Change',
  description: `Design a system that's easy to change and evolve. Use loose coupling, versioned APIs, feature flags, and backward compatibility to enable rapid iteration without breaking existing functionality.

Learning objectives:
- Use loose coupling between services
- Version APIs for backward compatibility
- Feature flags for gradual rollouts
- Schema evolution strategies

Key requirements:
- Versioned APIs (v1, v2)
- Feature flags for new features
- Backward-compatible schema changes
- Service contracts and API documentation`,

  userFacingFRs: [
    'Version APIs: /api/v1/users, /api/v2/users',
    'Support multiple API versions simultaneously',
    'Feature flags to enable/disable features per user',
    'Backward-compatible database schema changes (add nullable columns)',
    'API documentation with examples (OpenAPI/Swagger)',
  ],
  userFacingNFRs: [
    'API version support: Maintain n-1 versions (current + previous)',
    'Feature flag latency: <5ms overhead',
    'Schema migration: Zero downtime',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'API gateway with versioning',
      },
      {
        type: 'compute',
        reason: 'Feature flag service',
      },
      {
        type: 'storage',
        reason: 'Database with schema versioning',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Versioned API requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Schema-versioned data access',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-evolvability', problemConfigs['ddia-ch1-evolvability'] || {
    baseRps: 1500,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Versioned APIs',
    'Feature flags',
    'Backward-compatible schemas',
    'API documentation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 14: Observability
 * Teaches: Implement logging, metrics, tracing
 */
export const observabilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-observability',
  title: 'Observability - Logging, Metrics, Tracing',
  description: `Implement the three pillars of observability: logging, metrics, and distributed tracing. Make your system observable so you can debug issues in production.

Learning objectives:
- Structured logging (JSON logs)
- Metrics collection (Prometheus)
- Distributed tracing (Jaeger, Zipkin)
- Correlate logs, metrics, and traces

Key requirements:
- Structured JSON logs with trace IDs
- Metrics (RED: Rate, Errors, Duration)
- Distributed tracing across services
- Centralized log aggregation`,

  userFacingFRs: [
    'Structured JSON logging with fields: timestamp, level, message, trace_id, user_id',
    'Collect RED metrics: Request rate, error rate, duration',
    'Distributed tracing: Trace requests across all services',
    'Centralized logs (ELK stack or Loki)',
    'Correlation: Search logs by trace_id',
  ],
  userFacingNFRs: [
    'Log volume: ~1GB/day per service',
    'Trace sampling: 1% of requests (100% for errors)',
    'Metrics resolution: 10-second granularity',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application with instrumentation',
      },
      {
        type: 'storage',
        reason: 'Log storage (Elasticsearch)',
      },
      {
        type: 'storage',
        reason: 'Metrics storage (Prometheus)',
      },
      {
        type: 'compute',
        reason: 'Tracing backend (Jaeger)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Send logs and metrics',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Send traces',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-observability', problemConfigs['ddia-ch1-observability'] || {
    baseRps: 2000,
    readRatio: 0.7,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Structured JSON logging',
    'RED metrics collection',
    'Distributed tracing',
    'Centralized log aggregation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 15: Technical Debt
 * Teaches: Manage and reduce technical debt
 */
export const technicalDebtProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch1-technical-debt',
  title: 'Technical Debt - Manage and Reduce',
  description: `Identify, track, and systematically reduce technical debt. Balance shipping features with improving code quality. Use metrics like code coverage, code duplication, and cyclomatic complexity.

Learning objectives:
- Identify technical debt (code smells, outdated dependencies)
- Track debt using tools (SonarQube, CodeClimate)
- Allocate time for debt reduction (20% rule)
- Refactor incrementally

Key requirements:
- Code quality metrics (coverage, duplication, complexity)
- Dependency updates (security patches)
- Refactoring sprints
- Debt tracking in backlog`,

  userFacingFRs: [
    'Run code quality analysis (SonarQube)',
    'Track metrics: test coverage, code duplication, cyclomatic complexity',
    'Flag outdated dependencies (npm audit, Dependabot)',
    'Allocate 20% of sprint to debt reduction',
    'Refactor incrementally (small PRs)',
  ],
  userFacingNFRs: [
    'Test coverage: >80%',
    'Code duplication: <5%',
    'Cyclomatic complexity: <10 per function',
    'Dependency freshness: No vulnerabilities',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application codebase',
      },
      {
        type: 'compute',
        reason: 'Code quality tools (SonarQube)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Analyze code quality',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch1-technical-debt', problemConfigs['ddia-ch1-technical-debt'] || {
    baseRps: 500,
    readRatio: 0.5,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Code quality analysis',
    'Track coverage, duplication, complexity',
    'Update dependencies',
    'Allocate refactoring time',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all Chapter 1 problems
export const ddiaChapter1Problems = [
  spofProblemDefinition,
  hardwareFaultsProblemDefinition,
  softwareErrorsProblemDefinition,
  humanErrorsProblemDefinition,
  chaosEngineeringProblemDefinition,
  verticalScalingProblemDefinition,
  horizontalScalingProblemDefinition,
  loadParametersProblemDefinition,
  performanceMetricsProblemDefinition,
  fanoutProblemDefinition,
  operabilityProblemDefinition,
  simplicityProblemDefinition,
  evolvabilityProblemDefinition,
  observabilityProblemDefinition,
  technicalDebtProblemDefinition,
];

// Auto-generate code challenges from functional requirements
(spofProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(spofProblemDefinition);
