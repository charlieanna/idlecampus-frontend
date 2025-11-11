# Simulation Engine Specification - MVP

## 🎯 Overview

This document specifies a **simple analytical simulation engine** for the System Design Builder MVP. The goal is to provide realistic-enough feedback to teach system design concepts, NOT to perfectly simulate production systems.

### Design Philosophy

- **Simple over accurate**: Use queueing theory approximations, not discrete event simulation
- **Fast over precise**: Sub-second simulation runs, not hours of computation
- **Pedagogical over realistic**: Exaggerate effects to make learning clear
- **Deterministic over stochastic**: Same design = same results (no randomness in MVP)

### What We're Building

```
User's Design (JSON) → Simulation Engine → Results (pass/fail + metrics)
```

**Simulation takes**:
- System graph (components + connections)
- Traffic pattern (RPS for reads/writes)
- Test case (pass criteria)

**Simulation returns**:
- Latency (p50, p99)
- Error rate
- Cost (monthly)
- Component utilization
- Pass/fail + explanation

---

## 🧩 Component Models (MVP: 6 Components)

Each component has:
1. **Capacity**: Max throughput it can handle
2. **Latency Model**: How latency increases with load
3. **Cost Model**: How much it costs to run
4. **Failure Behavior**: What happens when overloaded

---

### 1. Load Balancer

**Purpose**: Distribute traffic across app servers

**Configuration**: None (fixed in MVP)

**Behavior**:
```
Capacity: 100,000 RPS (effectively unlimited for MVP)
Base Latency: 1ms
Cost: $50/month (flat fee)

Latency Model:
  latency = 1ms (constant, never saturates)

Error Rate:
  0% (never fails)

Utilization:
  utilization = incoming_rps / 100000
```

**Implementation**:
```typescript
class LoadBalancer implements Component {
  capacity = 100000; // RPS
  baseLatency = 1; // ms
  monthlyCost = 50; // dollars

  simulate(rps: number): ComponentMetrics {
    return {
      latency: this.baseLatency,
      errorRate: 0,
      utilization: rps / this.capacity,
      cost: this.monthlyCost
    };
  }
}
```

---

### 2. App Server

**Purpose**: Run application logic (compute)

**Configuration**:
- `instances`: Number of servers (1-20)

**Behavior**:
```
Capacity per instance: 1,000 RPS
Base Latency: 10ms
Cost: $100/month per instance

Load Distribution:
  rps_per_instance = total_rps / instances

Utilization per instance:
  utilization = rps_per_instance / 1000

Latency Model (per instance):
  if utilization < 0.7:
    latency = 10ms
  elif utilization < 0.9:
    latency = 10ms / (1 - utilization)  // Starts to slow down
  else:
    latency = 100ms  // Severely degraded

Error Rate:
  if utilization < 0.95:
    error_rate = 0
  else:
    error_rate = (utilization - 0.95) / 0.05  // 0-100% as it approaches 1.0

Cost:
  monthly_cost = instances * 100
```

**Why This Model**:
- Utilization < 70%: Healthy, latency is baseline
- Utilization 70-90%: Queue builds up (M/M/1 queueing)
- Utilization > 90%: System thrashing
- Utilization > 95%: Starts dropping requests

**Implementation**:
```typescript
class AppServer implements Component {
  capacityPerInstance = 1000; // RPS
  baseLatency = 10; // ms
  costPerInstance = 100; // $/month
  instances = 1;

  simulate(totalRps: number): ComponentMetrics {
    const rpsPerInstance = totalRps / this.instances;
    const utilization = rpsPerInstance / this.capacityPerInstance;

    let latency: number;
    let errorRate: number;

    if (utilization < 0.7) {
      latency = this.baseLatency;
      errorRate = 0;
    } else if (utilization < 0.9) {
      // M/M/1 queueing approximation
      latency = this.baseLatency / (1 - utilization);
      errorRate = 0;
    } else if (utilization < 0.95) {
      latency = 100;
      errorRate = 0;
    } else {
      latency = 100;
      errorRate = Math.min(1, (utilization - 0.95) / 0.05);
    }

    return {
      latency,
      errorRate,
      utilization,
      cost: this.instances * this.costPerInstance
    };
  }
}
```

---

### 3. PostgreSQL Database

**Purpose**: Persistent relational storage

**Configuration**:
- `readCapacity`: Max reads per second
- `writeCapacity`: Max writes per second
- `replication`: true/false (for fault tolerance test)

**Behavior**:
```
Base Latency:
  read: 5ms
  write: 50ms (10x slower due to disk write + WAL)

Cost Model:
  $0.0001 per read operation
  $0.001 per write operation (10x more expensive)
  Monthly cost ≈ (reads + writes * 10) * $0.0001 * 2.6M (seconds/month)

Utilization:
  read_utilization = read_rps / read_capacity
  write_utilization = write_rps / write_capacity
  utilization = max(read_utilization, write_utilization)

Latency Model (separate for reads/writes):
  if utilization < 0.8:
    latency = base_latency
  elif utilization < 0.95:
    latency = base_latency / (1 - utilization)
  else:
    latency = base_latency * 20  // Severe degradation

Error Rate:
  if utilization < 0.95:
    error_rate = 0
  else:
    error_rate = (utilization - 0.95) / 0.05

Failure Behavior (if replication = false):
  In "database failure" test case:
    availability = 0% for 60 seconds
    downtime_seconds = 60
```

**Implementation**:
```typescript
class PostgreSQL implements Component {
  readCapacity = 1000; // ops/sec
  writeCapacity = 1000; // ops/sec
  replication = false;

  simulate(readRps: number, writeRps: number, testCase?: TestCase): ComponentMetrics {
    const readUtil = readRps / this.readCapacity;
    const writeUtil = writeRps / this.writeCapacity;
    const utilization = Math.max(readUtil, writeUtil);

    // Check if failure test case
    if (testCase?.failureType === 'db_crash' && !this.replication) {
      return {
        latency: Infinity,
        errorRate: 1.0,
        utilization: 0,
        downtime: 60,
        cost: this.calculateCost(readRps, writeRps)
      };
    }

    // Normal operation
    const readLatency = this.calculateLatency(5, readUtil);
    const writeLatency = this.calculateLatency(50, writeUtil);

    // Weighted average based on read/write mix
    const totalOps = readRps + writeRps;
    const avgLatency = (readLatency * readRps + writeLatency * writeRps) / totalOps;

    const errorRate = utilization < 0.95 ? 0 : (utilization - 0.95) / 0.05;

    return {
      latency: avgLatency,
      errorRate,
      utilization,
      cost: this.calculateCost(readRps, writeRps)
    };
  }

  private calculateLatency(baseLatency: number, utilization: number): number {
    if (utilization < 0.8) return baseLatency;
    if (utilization < 0.95) return baseLatency / (1 - utilization);
    return baseLatency * 20;
  }

  private calculateCost(readRps: number, writeRps: number): number {
    const secondsPerMonth = 2.6e6;
    const readCost = readRps * 0.0001 * secondsPerMonth;
    const writeCost = writeRps * 0.001 * secondsPerMonth;
    return readCost + writeCost;
  }
}
```

---

### 4. Redis Cache

**Purpose**: In-memory key-value store for caching

**Configuration**:
- `memorySizeGB`: Amount of memory (1-64 GB)
- `ttl`: Time to live in seconds (10-3600)
- `hitRatio`: User-configured expected hit ratio (0.0-1.0)

**Behavior**:
```
Capacity: 10,000 RPS per GB (effectively unlimited for MVP)
Base Latency: 1ms
Cost: $50 per GB per month

Hit Ratio:
  Configured by user (we trust their estimate for MVP)

Actual Traffic to DB:
  cache_hits = total_requests * hit_ratio
  cache_misses = total_requests * (1 - hit_ratio)
  db_requests = cache_misses

Latency Model:
  Always 1ms (never saturates in MVP)

Effective Latency (including cache misses):
  avg_latency = hit_ratio * 1ms + (1 - hit_ratio) * (1ms + db_latency)

Cost:
  monthly_cost = memory_size_gb * 50

Failure Behavior (cache flush test):
  When cache flushes:
    hit_ratio temporarily = 0 for 10 seconds
    hit_ratio = 0.5 for next 20 seconds (warming up)
    hit_ratio = configured value after 30 seconds
```

**Implementation**:
```typescript
class RedisCache implements Component {
  memorySizeGB = 4;
  ttl = 60;
  hitRatio = 0.9; // User configured
  costPerGB = 50;

  simulate(requestsRps: number, testCase?: TestCase): ComponentMetrics {
    let effectiveHitRatio = this.hitRatio;

    // Handle cache flush test case
    if (testCase?.failureType === 'cache_flush') {
      const timeInTest = testCase.currentTime || 0;
      if (timeInTest < 10) {
        effectiveHitRatio = 0; // Cold cache
      } else if (timeInTest < 30) {
        effectiveHitRatio = 0.5; // Warming up
      }
    }

    const cacheHits = requestsRps * effectiveHitRatio;
    const cacheMisses = requestsRps * (1 - effectiveHitRatio);

    return {
      latency: 1, // Always fast
      errorRate: 0,
      utilization: 0.1, // Never saturates in MVP
      cacheHits,
      cacheMisses,
      dbLoad: cacheMisses,
      cost: this.memorySizeGB * this.costPerGB
    };
  }
}
```

---

### 5. CDN (Content Delivery Network)

**Purpose**: Cache and serve static content (images, CSS, JS) from edge locations

**Configuration**:
- `enabled`: true/false

**Behavior**:
```
Capacity: Unlimited (for MVP)
Base Latency: 5ms (edge cache hit)
Cache Miss Latency: 50ms (fetch from origin)
Hit Ratio: 95% (fixed for MVP)
Cost: $0.01 per GB transferred

Traffic:
  If enabled:
    95% requests served from edge (5ms)
    5% requests hit origin (50ms)
  If disabled:
    100% requests hit origin

Cost Model:
  monthly_cost = total_gb_transferred * 0.01

  Estimation:
    gb_transferred = requests_per_month * avg_response_size_mb / 1024
```

**Implementation**:
```typescript
class CDN implements Component {
  enabled = true;
  hitRatio = 0.95; // Fixed for MVP
  edgeLatency = 5; // ms
  originLatency = 50; // ms
  costPerGB = 0.01; // dollars

  simulate(requestsRps: number, avgResponseSizeMB: number): ComponentMetrics {
    if (!this.enabled) {
      return {
        latency: this.originLatency,
        errorRate: 0,
        utilization: 0,
        cost: 0
      };
    }

    const avgLatency = this.hitRatio * this.edgeLatency +
                       (1 - this.hitRatio) * this.originLatency;

    // Cost calculation
    const secondsPerMonth = 2.6e6;
    const requestsPerMonth = requestsRps * secondsPerMonth;
    const gbTransferred = requestsPerMonth * avgResponseSizeMB / 1024;
    const cost = gbTransferred * this.costPerGB;

    return {
      latency: avgLatency,
      errorRate: 0,
      utilization: 0.01,
      cost
    };
  }
}
```

---

### 6. S3 (Object Storage)

**Purpose**: Store and serve large files (images, videos, documents)

**Configuration**:
- `storageSizeGB`: Total storage used

**Behavior**:
```
Capacity: Unlimited (for MVP)
Base Latency: 100ms (higher than DB due to object retrieval)
Cost Model:
  Storage: $0.023 per GB per month
  Requests: $0.004 per 1,000 GET requests
  Data Transfer: $0.09 per GB (out to internet)

Latency:
  Always 100ms (constant for MVP)

Cost:
  storage_cost = storage_gb * 0.023
  request_cost = (requests_per_month / 1000) * 0.004
  transfer_cost = gb_transferred * 0.09
  total = storage_cost + request_cost + transfer_cost
```

**Implementation**:
```typescript
class S3 implements Component {
  storageSizeGB = 100;
  baseLatency = 100; // ms

  simulate(requestsRps: number, avgObjectSizeMB: number): ComponentMetrics {
    const secondsPerMonth = 2.6e6;
    const requestsPerMonth = requestsRps * secondsPerMonth;

    // Cost breakdown
    const storageCost = this.storageSizeGB * 0.023;
    const requestCost = (requestsPerMonth / 1000) * 0.004;
    const gbTransferred = requestsPerMonth * avgObjectSizeMB / 1024;
    const transferCost = gbTransferred * 0.09;

    return {
      latency: this.baseLatency,
      errorRate: 0,
      utilization: 0.01,
      cost: storageCost + requestCost + transferCost
    };
  }
}
```

---

## 🔄 Traffic Propagation Through System Graph

### Graph Structure

```typescript
interface SystemGraph {
  components: Component[];
  connections: Connection[];
}

interface Connection {
  from: string; // component ID
  to: string;   // component ID
  type: 'read' | 'write' | 'read_write';
}
```

### Propagation Algorithm

**Step 1: Parse User's Design**
```
User draws:
  Load Balancer → App Server → Redis Cache → PostgreSQL
```

**Step 2: Calculate Traffic at Each Layer**
```
Layer 1 (Load Balancer):
  traffic = test_case.rps

Layer 2 (App Servers):
  traffic_per_server = load_balancer.rps / num_app_servers

Layer 3 (Cache):
  traffic = app_server.rps

Layer 4 (Database):
  traffic = cache.cache_misses
```

**Step 3: Simulate Each Component**
```
For each component in topological order:
  1. Calculate incoming traffic
  2. Run component.simulate(traffic)
  3. Collect metrics
```

**Step 4: Calculate End-to-End Metrics**
```
Total Latency:
  latency = SUM(component.latency for each in request path)

  Example path: LB → App → Cache (miss) → DB
  latency = 1ms + 10ms + 1ms + 5ms = 17ms

Error Rate:
  error_rate = 1 - PRODUCT(1 - component.error_rate)

  Example: App has 2% errors, DB has 5% errors
  success_rate = 0.98 * 0.95 = 0.931
  error_rate = 1 - 0.931 = 6.9%

Total Cost:
  cost = SUM(component.cost)
```

---

## 🧪 Test Case Execution

### Test Case Structure

```typescript
interface TestCase {
  name: string;
  traffic: {
    type: 'read' | 'write' | 'mixed';
    rps: number;
    readRatio?: number; // For mixed workloads
  };
  duration: number; // seconds
  failureInjection?: {
    type: 'db_crash' | 'cache_flush' | 'network_partition';
    startTime: number; // seconds into test
  };
  passCriteria: {
    maxP99Latency: number; // ms
    maxErrorRate: number; // 0-1
    maxMonthlyCost?: number; // dollars
    minAvailability?: number; // 0-1
  };
}
```

### Execution Algorithm

```typescript
class SimulationEngine {
  runTestCase(graph: SystemGraph, testCase: TestCase): TestResult {
    // 1. Validate graph (all components connected properly)
    this.validateGraph(graph);

    // 2. Calculate steady-state metrics
    const metrics = this.simulateTraffic(graph, testCase.traffic);

    // 3. Apply failure if specified
    let failureMetrics = null;
    if (testCase.failureInjection) {
      failureMetrics = this.simulateFailure(graph, testCase);
    }

    // 4. Calculate percentiles (simplified for MVP)
    const p50Latency = metrics.latency;
    const p99Latency = metrics.latency * 1.5; // Approximate (p99 ≈ 1.5x p50)

    // 5. Check pass criteria
    const passed = this.checkPassCriteria(metrics, testCase.passCriteria);

    // 6. Generate explanation
    const explanation = this.generateExplanation(metrics, testCase, passed);

    return {
      passed,
      metrics: {
        p50Latency,
        p99Latency,
        errorRate: metrics.errorRate,
        monthlyCost: metrics.cost,
        availability: failureMetrics?.availability || 1.0
      },
      bottlenecks: this.identifyBottlenecks(metrics),
      explanation
    };
  }

  private simulateTraffic(graph: SystemGraph, traffic: Traffic): Metrics {
    // Topological sort of components
    const sortedComponents = this.topologicalSort(graph);

    let currentRps = traffic.rps;
    let totalLatency = 0;
    let combinedErrorRate = 0;
    let totalCost = 0;

    for (const component of sortedComponents) {
      const result = component.simulate(currentRps);

      totalLatency += result.latency;
      combinedErrorRate = 1 - (1 - combinedErrorRate) * (1 - result.errorRate);
      totalCost += result.cost;

      // Adjust traffic for next layer (e.g., cache reduces DB traffic)
      if (component.type === 'cache') {
        currentRps = result.cacheMisses;
      }
    }

    return {
      latency: totalLatency,
      errorRate: combinedErrorRate,
      cost: totalCost
    };
  }

  private identifyBottlenecks(metrics: ComponentMetrics[]): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    for (const component of metrics) {
      if (component.utilization > 0.8) {
        bottlenecks.push({
          componentId: component.id,
          issue: 'High utilization',
          utilization: component.utilization,
          recommendation: this.getRecommendation(component)
        });
      }
    }

    return bottlenecks;
  }

  private getRecommendation(component: ComponentMetrics): string {
    switch (component.type) {
      case 'app_server':
        return `Add more instances (currently: ${component.instances})`;
      case 'database':
        return `Increase capacity or add caching to reduce load`;
      case 'cache':
        return `Increase memory size or TTL to improve hit ratio`;
      default:
        return `Scale this component`;
    }
  }
}
```

---

## 📊 Pass/Fail Criteria Evaluation

### Simple Pass/Fail (MVP)

```typescript
interface PassCriteria {
  maxP99Latency?: number; // ms
  maxErrorRate?: number; // 0-1
  maxMonthlyCost?: number; // dollars
  minAvailability?: number; // 0-1 (for failure tests)
}

function checkPassCriteria(metrics: Metrics, criteria: PassCriteria): boolean {
  const checks = [];

  if (criteria.maxP99Latency) {
    checks.push(metrics.p99Latency <= criteria.maxP99Latency);
  }

  if (criteria.maxErrorRate) {
    checks.push(metrics.errorRate <= criteria.maxErrorRate);
  }

  if (criteria.maxMonthlyCost) {
    checks.push(metrics.monthlyCost <= criteria.maxMonthlyCost);
  }

  if (criteria.minAvailability) {
    checks.push(metrics.availability >= criteria.minAvailability);
  }

  // All criteria must pass
  return checks.every(check => check);
}
```

### Result Formatting

```typescript
interface TestResult {
  passed: boolean;
  metrics: {
    p50Latency: number;
    p99Latency: number;
    errorRate: number;
    monthlyCost: number;
    availability: number;
  };
  bottlenecks: Bottleneck[];
  explanation: string;
}

// Example output:
{
  passed: false,
  metrics: {
    p50Latency: 45,
    p99Latency: 850,
    errorRate: 0.023,
    monthlyCost: 680,
    availability: 1.0
  },
  bottlenecks: [
    {
      componentId: "db_main",
      issue: "High utilization",
      utilization: 0.92,
      recommendation: "Increase write capacity or add caching"
    }
  ],
  explanation: "Test FAILED: p99 latency (850ms) exceeds target (500ms). Database is saturated at 92% utilization."
}
```

---

## 🔢 Example: Tiny URL Simulation

### User's Design

```typescript
const design: SystemGraph = {
  components: [
    { id: 'lb', type: 'load_balancer', config: {} },
    { id: 'app', type: 'app_server', config: { instances: 2 } },
    { id: 'cache', type: 'redis', config: { memorySizeGB: 4, hitRatio: 0.9 } },
    { id: 'db', type: 'postgresql', config: {
      readCapacity: 1000,
      writeCapacity: 200,
      replication: false
    }}
  ],
  connections: [
    { from: 'lb', to: 'app' },
    { from: 'app', to: 'cache' },
    { from: 'cache', to: 'db' }
  ]
};
```

### Test Case: Normal Load

```typescript
const testCase: TestCase = {
  name: "Normal Load",
  traffic: {
    type: 'mixed',
    rps: 1100, // 1000 reads + 100 writes
    readRatio: 0.91
  },
  duration: 60,
  passCriteria: {
    maxP99Latency: 100,
    maxErrorRate: 0.01,
    maxMonthlyCost: 500
  }
};
```

### Simulation Steps

**Step 1: Load Balancer**
```
Input: 1100 RPS
Output:
  latency = 1ms
  utilization = 1100 / 100000 = 1.1%
  error_rate = 0
  cost = $50/month
```

**Step 2: App Servers (2 instances)**
```
Input: 1100 RPS total
Per instance: 550 RPS
Utilization: 550 / 1000 = 55%

Output:
  latency = 10ms (under 70% threshold)
  error_rate = 0
  utilization = 55%
  cost = 2 * $100 = $200/month
```

**Step 3: Redis Cache**
```
Input: 1100 RPS
Cache hits: 1100 * 0.9 = 990 RPS
Cache misses: 110 RPS

Output:
  latency = 1ms
  error_rate = 0
  cache_hits = 990
  cache_misses = 110 (sent to DB)
  cost = 4 * $50 = $200/month
```

**Step 4: PostgreSQL**
```
Input: 110 RPS (90% cache hit ratio)
Reads: 100 RPS (1000 reads * 10% miss rate)
Writes: 100 RPS (all writes go to DB)

Read utilization: 100 / 1000 = 10%
Write utilization: 100 / 200 = 50%
Overall utilization: 50%

Output:
  latency = 5ms (reads dominate at low util)
  error_rate = 0
  utilization = 50%
  cost = (100 * 0.0001 + 100 * 0.001) * 2.6M = $286/month
```

**Step 5: End-to-End Metrics**
```
Total Latency (cache hit): 1 + 10 + 1 = 12ms
Total Latency (cache miss): 1 + 10 + 1 + 5 = 17ms

Weighted average:
  p50_latency = 0.9 * 12 + 0.1 * 17 = 12.5ms
  p99_latency = 17 * 1.5 ≈ 25ms (approximate)

Error Rate: 0%

Total Cost: 50 + 200 + 200 + 286 = $736/month

Availability: 100%
```

**Step 6: Pass/Fail Check**
```
Criteria                  | Result  | Pass?
--------------------------|---------|-------
p99 latency < 100ms       | 25ms    | ✅
Error rate < 1%           | 0%      | ✅
Monthly cost < $500       | $736    | ❌

Overall: FAILED
Reason: Cost exceeds budget ($736 > $500)
```

**Step 7: Recommendations**
```
❌ Cost is over budget by $236/month

Suggestions:
1. Reduce app server instances from 2 to 1 (saves $100)
   - Still handles load (550 RPS per instance)
2. Reduce Redis memory from 4GB to 2GB (saves $100)
   - Still handles cache volume
3. Consider: These changes bring cost to ~$536, still over by $36
```

---

## 🎯 Validation: Are Results Realistic?

Let's sanity-check our numbers against real-world systems:

| Metric | Our Model | Real-World | Reasonable? |
|--------|-----------|------------|-------------|
| Redis latency | 1ms | 0.5-2ms | ✅ Close |
| PostgreSQL read | 5ms | 1-10ms | ✅ Good |
| PostgreSQL write | 50ms | 10-100ms | ✅ Good |
| App server capacity | 1000 RPS | 500-5000 RPS | ✅ Reasonable |
| CDN hit ratio | 95% | 85-99% | ✅ Good |
| Cost ratios | Writes 10x reads | Real: 5-20x | ✅ Reasonable |

**Verdict**: Good enough for teaching! Not perfect, but conveys the right concepts.

---

## 🚀 Implementation Priorities

### Phase 1: Core Engine (3-4 days)
- [ ] Component base class and 6 implementations
- [ ] Traffic propagation algorithm
- [ ] Simple pass/fail checker
- [ ] Cost calculator

### Phase 2: Test Execution (2 days)
- [ ] Test case runner
- [ ] Failure injection (cache flush, DB crash)
- [ ] Bottleneck identification
- [ ] Explanation generator

### Phase 3: Validation (1-2 days)
- [ ] Run hardcoded examples
- [ ] Verify results are reasonable
- [ ] Test edge cases
- [ ] Document any limitations

---

## 📝 Known Limitations (Document for Users)

1. **Simplified latency models**: Real systems have long-tail distributions
2. **No network effects**: We ignore packet loss, jitter, retries
3. **No cold starts**: Components are always warm
4. **No cascading failures**: One failure doesn't trigger others
5. **Deterministic**: Same design always gives same results (no randomness)
6. **No regional effects**: All components in same datacenter
7. **Simplified costs**: Real pricing has tiers, discounts, egress fees

**These are okay for MVP!** The goal is teaching, not production prediction.

---

## 🎓 Learning Outcomes

After using this simulation, users should understand:

✅ **Capacity Planning**: How to size components for load
✅ **Caching**: When/why caching helps, hit ratio tradeoffs
✅ **Read vs Write**: Why writes are more expensive
✅ **Replication**: Why it's needed for fault tolerance
✅ **Cost Tradeoffs**: Performance vs cost optimization
✅ **Bottlenecks**: How to identify and fix saturated components

---

## 📚 References

- **Queueing Theory**: M/M/1 queue model for latency under load
- **AWS Pricing**: Used as baseline for cost models
- **Real System Benchmarks**: Redis, PostgreSQL performance characteristics

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Status**: Ready for Implementation
