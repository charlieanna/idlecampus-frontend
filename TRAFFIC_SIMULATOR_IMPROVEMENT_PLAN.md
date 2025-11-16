# Traffic Simulator - Comprehensive Improvement Plan (PESSIMISTIC REVISION v3)

## Executive Summary

**Current State**: The traffic simulator is ~40% complete for general-purpose distributed systems simulation, but 75% complete for basic web systems.

**Goal**: Achieve 90% completeness for intermediate-to-advanced distributed systems while maintaining educational value.

**REVISED Total Estimated Effort**: 131-212 hours across 5 phases (PESSIMISTIC)
**Timeline**: 4-6 months with 1 developer (10h/week) OR 4-6 weeks with 2 developers (40h/week)
**Priority Focus**: Safety net, accuracy fixes, reliability patterns, multi-database support
**Risk Level**: HIGH - touches core simulation engine with breaking changes likely

> **WARNING**: This is a substantial rewrite of core simulation infrastructure, not a feature addition. Previous estimates (85-95 hours) were optimistic. This plan accounts for hidden complexity, integration issues, and real-world development friction.

---

## Table of Contents

1. [Critical Code Analysis](#critical-code-analysis)
2. [Current State Assessment](#current-state-assessment)
3. [Strategic Goals](#strategic-goals)
4. [Phase 0: Safety Net (MANDATORY)](#phase-0-safety-net-mandatory-first---12-20-hours)
5. [Phase 1: Foundation Fixes (24-40 hours)](#phase-1-foundation-fixes-24-40-hours)
6. [Phase 2: Core Reliability (30-52 hours)](#phase-2-core-reliability-30-52-hours)
7. [Phase 3: Advanced Architecture (45-68 hours)](#phase-3-advanced-architecture-45-68-hours)
8. [Phase 4: Integration & Polish (20-32 hours)](#phase-4-integration--polish-20-32-hours)
9. [Implementation Priorities](#implementation-priorities)
10. [Risk Assessment](#risk-assessment)
11. [Success Metrics](#success-metrics)
12. [Testing Strategy](#testing-strategy)
13. [Minimum Viable Improvement](#minimum-viable-improvement-mvi)

---

## Critical Code Analysis

### Key Discoveries (Code Review Findings)

**1. TWO SIMULATION MODES EXIST (Major Oversight in Previous Plans)**
- `SimulationEngine.simulateTraffic()` - Returns aggregate statistics
- `TrafficFlowEngine.sendTraffic()` - Traces individual requests (max 1000 samples)
- **Both must implement retry, circuit breaker, priority consistently**
- **Previous plans only addressed one mode**

**2. PERCENTILE CALCULATION IS FUNDAMENTALLY BROKEN**
```typescript
// engine.ts lines 409-414 - HARDCODED MULTIPLIERS
const p90Latency = p50Latency * 1.3;  // WRONG
const p99Latency = p50Latency * 1.8;  // WRONG - varies wildly by system
```

**3. COMPONENTS ARE STATELESS**
- Circuit breaker needs state (failure count, trip time)
- Components recreated each simulation run
- No mechanism for state persistence across simulate() calls

**4. LOAD BALANCER LACKS GRAPH CONTEXT**
```typescript
// LoadBalancer.simulate() is called in isolation
// Doesn't know downstream components
// Can't implement least_connections, weighted routing properly
```

**5. SAMPLE SIZE IS TOO SMALL**
```typescript
// trafficFlowEngine.ts line 99
const sampleSize = Math.min(1000, totalRps * 10);
// 10,000 RPS system samples only 1000 requests
// p99 = 990th request, p999 = 999th (only 1 sample!)
```

### Exact Current Interfaces

**Request (src/apps/system-design/builder/types/request.ts)**:
```typescript
export type RequestType = 'read' | 'write';  // ONLY 2 TYPES

export interface Request {
  id: string;
  type: RequestType;
  startTime: number;
  sizeMB?: number;
  path: string[];
  latency: number;
  failed: boolean;
  failureReason?: string;
  // MISSING: priority, timeout, deadline, tags, correlationId
}
```

**Connection (src/apps/system-design/builder/types/graph.ts)**:
```typescript
export interface Connection {
  from: string;
  to: string;
  type: 'read' | 'write' | 'read_write';
  // MISSING: weight, condition, maxTraversals, metadata
}
```

**ComponentMetrics**:
```typescript
export interface ComponentMetrics {
  latency: number;
  errorRate: number;
  utilization: number;
  cost: number;
  // Extensible with [key: string]: any
}
```

### Hardcoded Values Inventory

| Component | Hardcoded | Location | Impact |
|-----------|-----------|----------|--------|
| LoadBalancer | capacity=100000, latency=1ms, cost=$50 | LoadBalancer.ts | Cannot configure |
| AppServer | baseLatency=10ms | AppServer.ts | Fixed performance |
| PostgreSQL | read=5ms, write=50ms | PostgreSQL.ts | 10x write ratio fixed |
| Redis | baseLatency=1ms, 10K RPS/GB | RedisCache.ts | Cannot tune |
| MongoDB | read=5ms, write=10ms, cost=$150 | MongoDB.ts | Fixed |
| Cassandra | read=3ms, write=5ms, cost=$200 | Cassandra.ts | Fixed |
| MessageQueue | latency=5ms, 10K RPS/partition | MessageQueue.ts | Fixed |
| Simulation | Max 1000 samples | trafficFlowEngine.ts:99 | Statistics unreliable |
| Percentiles | p99=p50*1.8 | engine.ts:409 | FUNDAMENTALLY WRONG |

---

## Current State Assessment

### Completeness Scorecard

| Category | Current | Target | Gap | Difficulty |
|----------|---------|--------|-----|------------|
| Component Configurability | 65% | 90% | +25% | MEDIUM |
| Graph Topology Support | 50% | 85% | +35% | HIGH |
| Connection Types & Async | 40% | 80% | +40% | MEDIUM |
| Distributed Patterns | 40% | 85% | +45% | HIGH |
| Request Types | 30% | 75% | +45% | MEDIUM |
| Failure Modes | 35% | 80% | +45% | MEDIUM |
| Multi-Region Support | 15% | 70% | +55% | VERY HIGH |
| Metrics Accuracy | 40% | 90% | +50% | HIGH |

### Critical Blockers (Must Fix First)

1. **PERCENTILE CALCULATION BROKEN** - All reported metrics are inaccurate
2. **No Cycle Support** - Blocks circuit breaker patterns
3. **Single Database Assumption** - Cannot model sharded systems
4. **No Conditional Routing** - Cannot model weighted/A/B testing
5. **Two Simulation Modes Inconsistent** - Will diverge with new features
6. **No Safety Net** - Changes will break existing functionality unknowingly

### What Works Well (Maintain)

- ✅ Clean component architecture (extendable base class)
- ✅ Real AWS instance types and pricing
- ✅ 5 cache strategies (cache-aside, read-through, write-through, write-behind, write-around)
- ✅ Consistency levels (strong, eventual, causal, read_your_writes, bounded_staleness)
- ✅ Message queue semantics (at_most_once, at_least_once, exactly_once)
- ✅ Failure injection framework (db_crash, cache_flush, network_partition)
- ✅ Graph-based topology representation
- ✅ Advanced config types already defined (but unused)

---

## Strategic Goals

### Primary Objectives

1. **Fix Accuracy First**: Percentile calculations must be correct
2. **Safety Net**: Snapshot testing before ANY changes
3. **Expand System Coverage**: Support 80%+ of common distributed system patterns
4. **Enable Advanced Topologies**: Multi-region, sharded, service mesh architectures
5. **Add Resilience Patterns**: Circuit breakers, retries, timeouts, bulkheads
6. **Maintain Educational Value**: Keep the tool accessible for learning
7. **Backwards Compatibility**: Don't break existing 30+ challenges

### Non-Goals

- ❌ Production-grade capacity planning (remains educational)
- ❌ Sub-millisecond precision timing
- ❌ Full blockchain/consensus simulation (basic patterns only)
- ❌ ML model inference cost modeling
- ❌ Real-time streaming simulation
- ❌ UI/UX updates (document as CLI-only features first)

---

## Phase 0: Safety Net (MANDATORY FIRST) - 12-20 hours

**Timeline**: Week 1-2
**Goal**: Protect existing functionality before making any changes
**Impact**: Risk mitigation, enables safe refactoring
**Risk**: NONE if done first, CRITICAL if skipped

### 0.1 Snapshot Testing Infrastructure (6-8 hours)

**Priority**: MANDATORY
**Difficulty**: MEDIUM
**Files**: New `__tests__/regression/`, all challenge configs

**Why This Is Critical**:
- 30+ existing challenges will be affected by changes
- No way to know if changes break existing behavior
- Percentile fix WILL change all results (need to document)

**Implementation**:
```typescript
// __tests__/regression/challengeSnapshots.test.ts
import { challenges } from '../challenges';
import { SimulationEngine } from '../simulation/engine';

describe('Challenge Regression Tests', () => {
  // Ensure deterministic results
  beforeAll(() => {
    jest.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });

  for (const challenge of challenges) {
    test(`${challenge.name} produces consistent results`, () => {
      const engine = new SimulationEngine(challenge.graph);
      const result = engine.simulateTraffic(challenge.testCase);

      expect(result).toMatchSnapshot({
        p50Latency: expect.any(Number),
        p90Latency: expect.any(Number),
        p99Latency: expect.any(Number),
        errorRate: expect.any(Number),
        monthlyCost: expect.any(Number),
        availability: expect.any(Number),
      });
    });
  }
});
```

**Hidden Work**:
- Enumerate ALL challenge configurations (may need to search codebase)
- Make simulation deterministic (seed random number generator)
- Document current behavior (even if flawed)
- Create baseline performance measurements
- Handle async operations in tests

**Pessimistic Estimate**: 8-10 hours (challenge discovery takes time)

---

### 0.2 Performance Benchmarking (3-4 hours)

**Priority**: MANDATORY
**Difficulty**: LOW
**Files**: New `__tests__/performance/`

**Why This Matters**:
- New features (retries, queues, circuit breakers) add overhead
- Need baseline to measure regression
- Memory usage will increase with state tracking

**Implementation**:
```typescript
// __tests__/performance/simulation.bench.ts
const PERFORMANCE_BUDGET = {
  maxSimulationTimeMs: 2000,
  maxMemoryMB: 100,
  maxComponentCount: 50,
};

describe('Performance Benchmarks', () => {
  test('10 components completes in < 500ms', () => {
    const start = performance.now();
    simulateSystem(10);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(500);
  });

  test('50 components completes in < 2000ms', () => {
    const start = performance.now();
    simulateSystem(50);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test('memory usage under 100MB', () => {
    const before = process.memoryUsage().heapUsed;
    simulateSystem(50);
    const after = process.memoryUsage().heapUsed;
    const usedMB = (after - before) / (1024 * 1024);
    expect(usedMB).toBeLessThan(100);
  });
});
```

**Pessimistic Estimate**: 4-5 hours

---

### 0.3 Feature Flag System (4-6 hours)

**Priority**: HIGH
**Difficulty**: MEDIUM
**Files**: New `simulation/featureFlags.ts`, all modified files

**Why Critical for Safe Rollout**:
- Enable gradual rollout of new features
- Easy rollback if issues found
- A/B testing of implementations
- Users can opt-in to experimental features

**Implementation**:
```typescript
// simulation/featureFlags.ts
export interface FeatureFlags {
  ENABLE_RETRY_LOGIC: boolean;
  ENABLE_CIRCUIT_BREAKER: boolean;
  ENABLE_MULTI_DB: boolean;
  ENABLE_CYCLES: boolean;
  ENABLE_WEIGHTED_ROUTING: boolean;
  USE_NEW_PERCENTILE_CALC: boolean;
  ENABLE_REQUEST_PRIORITY: boolean;
  ENABLE_BACKPRESSURE: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  ENABLE_RETRY_LOGIC: false,
  ENABLE_CIRCUIT_BREAKER: false,
  ENABLE_MULTI_DB: false,
  ENABLE_CYCLES: false,
  ENABLE_WEIGHTED_ROUTING: false,
  USE_NEW_PERCENTILE_CALC: false,
  ENABLE_REQUEST_PRIORITY: false,
  ENABLE_BACKPRESSURE: false,
};

let currentFlags = { ...DEFAULT_FLAGS };

export function enableFeature(flag: keyof FeatureFlags): void {
  currentFlags[flag] = true;
}

export function disableFeature(flag: keyof FeatureFlags): void {
  currentFlags[flag] = false;
}

export function isEnabled(flag: keyof FeatureFlags): boolean {
  return currentFlags[flag];
}

export function resetFlags(): void {
  currentFlags = { ...DEFAULT_FLAGS };
}

// Usage in code:
import { isEnabled } from './featureFlags';

if (isEnabled('ENABLE_RETRY_LOGIC')) {
  return this.simulateWithRetry(baseSimulate);
} else {
  return baseSimulate();
}
```

**Hidden Work**:
- Identify ALL code paths that change
- Need configuration mechanism (env vars? config file?)
- Tests must run with flags both on AND off
- Documentation for each flag
- Eventually need UI toggle for users

**Pessimistic Estimate**: 6-8 hours

---

## Phase 1: Foundation Fixes (24-40 hours)

**Timeline**: Week 3-6
**Goal**: Fix fundamental accuracy issues and enable core patterns
**Impact**: Increases completeness from 40% → 55%
**Risk**: MEDIUM-HIGH - touches core simulation engine

### 1.1 Fix Percentile Calculation (8-12 hours)

**Priority**: CRITICAL (This is broken NOW)
**Difficulty**: HIGH
**Files**: `simulation/engine.ts`, `simulation/trafficFlowEngine.ts`

**Current BROKEN State**:
```typescript
// engine.ts lines 409-414
const p90Latency = p50Latency * 1.3;  // WRONG
const p95Latency = p50Latency * 1.4;  // WRONG
const p99Latency = p50Latency * 1.8;  // WRONG
const p999Latency = p50Latency * 3.0; // WRONG
```

**Why This Is Wrong**:
- Different systems have different latency distributions
- Cache hit vs miss: bimodal distribution
- Retry success on 2nd attempt: long tail
- Database write vs read: completely different profiles
- Fixed multipliers assume normal distribution (systems aren't normal)

**Correct Implementation**:
```typescript
// trafficFlowEngine.ts
interface TrafficFlowResult {
  visualization: FlowVisualization;
  latencyDistribution: number[];  // NEW: raw latencies
}

sendTraffic(): TrafficFlowResult {
  const latencies: number[] = [];

  for (const request of this.generateSampleRequests()) {
    this.traverseGraph(request, this.findEntryPoint(), new Map());
    latencies.push(request.latency);
  }

  latencies.sort((a, b) => a - b);

  return {
    visualization: this.buildVisualization(),
    latencyDistribution: latencies,
  };
}

// engine.ts
simulateTraffic(testCase: TestCase): TestMetrics {
  // ... existing setup ...

  if (isEnabled('USE_NEW_PERCENTILE_CALC')) {
    const flowEngine = new TrafficFlowEngine(this.graph);
    const { latencyDistribution } = flowEngine.sendTraffic();

    return {
      p50Latency: percentile(latencyDistribution, 50),
      p90Latency: percentile(latencyDistribution, 90),
      p95Latency: percentile(latencyDistribution, 95),
      p99Latency: percentile(latencyDistribution, 99),
      p999Latency: percentile(latencyDistribution, 99.9),
      // ... rest
    };
  } else {
    // Old behavior for backwards compatibility
    const p50Latency = weightedLatency;
    const p90Latency = p50Latency * 1.3;
    // ...
  }
}

function percentile(sortedArray: number[], p: number): number {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((p / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))];
}
```

**Critical Problems to Solve**:

1. **Sample Size Issue**:
   - Current max: 1000 samples
   - p99 with 1000 samples = 990th value (only 10 samples in tail)
   - p999 with 1000 samples = 999th value (only 1 sample!)
   - Need 10,000+ samples for accurate p99
   - Performance impact: 10x more requests to simulate

2. **Memory Usage**:
   - 10,000 latency values = ~80KB (acceptable)
   - But simulation time increases significantly

3. **Backwards Compatibility**:
   - ALL existing snapshot tests will fail
   - Need feature flag to toggle old/new
   - Need migration documentation

**Implementation Steps**:
1. Increase sample size to 10,000 (measure performance impact)
2. Return actual latency distribution from TrafficFlowEngine
3. Calculate percentiles from real data
4. Update SimulationEngine to use new calculation
5. Add feature flag for backwards compatibility
6. Update all snapshot tests with new baselines
7. Document why numbers changed
8. Performance optimization if needed (reservoir sampling?)

**Testing**:
- Verify percentile accuracy with known distributions
- Test with bimodal distribution (cache hit/miss)
- Test with long tail (retry scenarios)
- Performance regression tests
- Ensure old behavior still works when flag disabled

**Pessimistic Estimate**: 10-14 hours (sample size increase has cascading effects)

---

### 1.2 Multiple Database Support (10-14 hours)

**Priority**: CRITICAL
**Difficulty**: HIGH
**Files**: `simulation/engine.ts` lines 266-353

**Current Blocking Code**:
```typescript
// Lines 266-269: Returns FIRST database only
const dbId = this.findNodeIdByType('database') ||
  this.findNodeIdByType('postgresql') ||
  this.findNodeIdByType('mongodb') ||
  this.findNodeIdByType('cassandra');

// Line 352: Routes ALL traffic to single DB
const dbMetrics = db.simulateWithReadWrite(dbReadRps, dbWriteRps, context);
```

**Target State**:
```typescript
interface ShardingConfig {
  strategy: 'hash' | 'range' | 'directory' | 'round_robin';
  numShards: number;
  keyDistribution?: 'uniform' | 'zipf' | 'hotspot';
  hotspotFactor?: number;  // For hotspot distribution
}

// Find all databases
private findAllDatabaseNodes(): string[] {
  const dbTypes = ['database', 'postgresql', 'mongodb', 'cassandra'];
  const found: string[] = [];

  for (const [id, component] of this.components) {
    if (dbTypes.includes(component.type)) {
      found.push(id);
    }
  }

  return found;
}

// In simulateTraffic():
const dbIds = this.findAllDatabaseNodes();

if (dbIds.length === 0) {
  throw new Error('No database found in graph');
}

if (dbIds.length === 1 || !isEnabled('ENABLE_MULTI_DB')) {
  // Old behavior: single database
  return this.simulateSingleDatabase(dbIds[0], dbReadRps, dbWriteRps, context);
}

// Multi-database: requires sharding config
const shardingConfig = this.graph.shardingConfig;
if (!shardingConfig) {
  throw new Error(
    `Found ${dbIds.length} databases but no shardingConfig specified. ` +
    `Add shardingConfig to graph or remove extra databases.`
  );
}

const distribution = this.distributeTrafficAcrossShards(
  dbReadRps,
  dbWriteRps,
  dbIds,
  shardingConfig
);

// Simulate each shard
const shardMetrics: ComponentMetrics[] = [];
for (const dbId of dbIds) {
  const { read, write } = distribution.get(dbId)!;
  const db = this.components.get(dbId);
  shardMetrics.push(db.simulateWithReadWrite(read, write, context));
}

// Aggregate metrics
return this.aggregateShardMetrics(shardMetrics);

// Traffic distribution
private distributeTrafficAcrossShards(
  readRps: number,
  writeRps: number,
  shardIds: string[],
  config: ShardingConfig
): Map<string, { read: number; write: number }> {
  const distribution = new Map();

  switch (config.keyDistribution || 'uniform') {
    case 'uniform':
      // Even distribution
      const readPerShard = readRps / shardIds.length;
      const writePerShard = writeRps / shardIds.length;
      for (const id of shardIds) {
        distribution.set(id, { read: readPerShard, write: writePerShard });
      }
      break;

    case 'zipf':
      // Power law: 80% traffic to 20% shards
      const zipfDistribution = this.calculateZipfDistribution(shardIds.length);
      for (let i = 0; i < shardIds.length; i++) {
        distribution.set(shardIds[i], {
          read: readRps * zipfDistribution[i],
          write: writeRps * zipfDistribution[i],
        });
      }
      break;

    case 'hotspot':
      // Single hot shard
      const hotFactor = config.hotspotFactor || 0.9;
      const hotRead = readRps * hotFactor;
      const hotWrite = writeRps * hotFactor;
      const coldRead = (readRps - hotRead) / (shardIds.length - 1);
      const coldWrite = (writeRps - hotWrite) / (shardIds.length - 1);

      distribution.set(shardIds[0], { read: hotRead, write: hotWrite });
      for (let i = 1; i < shardIds.length; i++) {
        distribution.set(shardIds[i], { read: coldRead, write: coldWrite });
      }
      break;
  }

  return distribution;
}

// Metric aggregation
private aggregateShardMetrics(metrics: ComponentMetrics[]): ComponentMetrics {
  // Latency: average or max? Use max for worst case
  const maxLatency = Math.max(...metrics.map(m => m.latency));

  // Error rate: weighted average
  const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;

  // Utilization: max (hottest shard)
  const maxUtilization = Math.max(...metrics.map(m => m.utilization));

  // Cost: sum
  const totalCost = metrics.reduce((sum, m) => sum + m.cost, 0);

  return {
    latency: maxLatency,
    errorRate: avgErrorRate,
    utilization: maxUtilization,
    cost: totalCost,
    shardCount: metrics.length,
    hotShardUtilization: maxUtilization,
    coldShardUtilization: Math.min(...metrics.map(m => m.utilization)),
  };
}
```

**Complex Problems to Solve**:

1. **Cache Interaction**:
   - Cache sits in front of which database?
   - If multiple DBs, need multiple caches?
   - Cache hit rate varies per shard
   - Cross-shard cache invalidation

2. **Graph Topology Questions**:
   - Are all DBs connected to same app server?
   - Or different app servers per shard?
   - How to represent sharding in graph visually?

3. **Hot Shard Detection**:
   - When to warn about hot shards?
   - What's the threshold? (2x average?)
   - How to surface this to user?

4. **Cross-Shard Queries**:
   - Some operations touch multiple shards
   - Join queries across shards
   - Not currently modeled

**Implementation Steps**:
1. Add ShardingConfig interface to graph types
2. Create findAllDatabaseNodes() helper
3. Implement traffic distribution algorithms
4. Implement metric aggregation logic
5. Handle cache interaction (simplification: one cache per shard)
6. Add hot shard detection and warnings
7. Update TrafficFlowEngine to handle multi-DB
8. Feature flag for backwards compatibility
9. Documentation and examples

**Testing**:
- Test with 1, 3, 5, 10 shards
- Verify distribution accuracy (±5% variance)
- Test hot shard scenarios
- Test uniform distribution
- Test Zipf distribution
- Performance regression test
- Memory usage test

**Pessimistic Estimate**: 12-16 hours (cache interaction is complex)

---

### 1.3 Cycle Support for Circuit Breakers (8-12 hours)

**Priority**: CRITICAL (blocks circuit breaker)
**Difficulty**: HIGH (safety critical)
**Files**: `simulation/trafficFlowEngine.ts` lines 144-154, `types/graph.ts`

**Current DANGEROUS Code**:
```typescript
// Line 144: Blocks ALL cycles
private traverseGraph(
  request: Request,
  currentNodeId: string,
  context: SimulationContext,
  visited: Set<string>  // Prevents revisiting
): void {
  if (visited.has(currentNodeId)) {
    return;  // BLOCKS feedback loops - but also prevents infinite loops
  }
  visited.add(currentNodeId);
  // ...
}
```

**Why This Is Dangerous to Change**:
- Removing cycle prevention = potential infinite recursion
- Infinite recursion = browser/node crash
- Must add safety limits

**Safe Implementation**:
```typescript
// types/graph.ts
export interface Connection {
  from: string;
  to: string;
  type: 'read' | 'write' | 'read_write';
  maxTraversals?: number;  // NEW: max times to cross this connection (default: 1)
}

// trafficFlowEngine.ts
private static readonly MAX_DEPTH = 100;  // Hard safety limit
private static readonly MAX_TOTAL_VISITS = 1000;  // Prevent runaway

private traverseGraph(
  request: Request,
  currentNodeId: string,
  context: SimulationContext,
  traversalCount: Map<string, number>,  // Changed from Set to Map
  depth: number = 0,  // Track recursion depth
  totalVisits: number = 0  // Track total node visits
): void {
  // Hard safety limits
  if (depth > TrafficFlowEngine.MAX_DEPTH) {
    request.failed = true;
    request.failureReason = 'max_depth_exceeded';
    console.warn(`Request ${request.id} exceeded max depth of ${TrafficFlowEngine.MAX_DEPTH}`);
    return;
  }

  if (totalVisits > TrafficFlowEngine.MAX_TOTAL_VISITS) {
    request.failed = true;
    request.failureReason = 'max_visits_exceeded';
    console.warn(`Request ${request.id} exceeded max total visits`);
    return;
  }

  // Check if we've visited this node too many times
  const currentCount = traversalCount.get(currentNodeId) || 0;
  const maxAllowed = this.getMaxTraversalsForNode(currentNodeId);

  if (currentCount >= maxAllowed) {
    // Don't fail, just stop traversing this path
    return;
  }

  traversalCount.set(currentNodeId, currentCount + 1);
  request.path.push(currentNodeId);

  const component = this.components.get(currentNodeId);
  if (!component) {
    request.failed = true;
    request.failureReason = `component_not_found:${currentNodeId}`;
    return;
  }

  const result = this.processAtComponent(component, request, context);
  request.latency += result.latencyMs;

  if (!result.success) {
    request.failed = true;
    request.failureReason = result.errorReason || 'unknown';
    return;
  }

  // Get outgoing connections
  const connections = this.adjacency.get(currentNodeId) || [];
  const validConnections = this.filterConnectionsByType(connections, request.type);

  if (validConnections.length === 0) {
    return;  // End of path
  }

  // Handle special cases
  if (result.nextNodeId) {
    // Load balancer specified target
    const targetConn = validConnections.find(c => c.to === result.nextNodeId);
    if (targetConn) {
      this.traverseGraph(
        request,
        targetConn.to,
        context,
        traversalCount,
        depth + 1,
        totalVisits + 1
      );
    }
    return;
  }

  if (result.passthrough === false) {
    // Cache hit, don't continue
    return;
  }

  // Follow first valid connection (or could be random/weighted)
  for (const conn of validConnections) {
    this.traverseGraph(
      request,
      conn.to,
      context,
      traversalCount,
      depth + 1,
      totalVisits + 1
    );
    break;  // Only follow first path for now
  }
}

private getMaxTraversalsForNode(nodeId: string): number {
  // Get max traversals from incoming connections
  // Default is 1 (no cycles)
  let maxTraversals = 1;

  for (const conn of this.allConnections) {
    if (conn.to === nodeId && conn.maxTraversals !== undefined) {
      maxTraversals = Math.max(maxTraversals, conn.maxTraversals);
    }
  }

  return maxTraversals;
}
```

**Graph Validation (Important Safety Feature)**:
```typescript
// New file: simulation/graphValidator.ts
export function validateGraph(graph: SystemGraph): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for potential infinite loops
  for (const conn of graph.connections) {
    if (conn.maxTraversals && conn.maxTraversals > 10) {
      warnings.push(
        `Connection ${conn.from} -> ${conn.to} allows ${conn.maxTraversals} traversals. ` +
        `This may cause performance issues.`
      );
    }
  }

  // Detect cycles
  const cycles = detectCycles(graph);
  for (const cycle of cycles) {
    const hasMaxTraversal = cycle.some(
      conn => conn.maxTraversals && conn.maxTraversals > 1
    );

    if (!hasMaxTraversal) {
      // Cycle exists but no way to traverse it multiple times
      // This is fine, default behavior
    } else {
      warnings.push(
        `Cycle detected: ${cycle.map(c => c.from).join(' -> ')}. ` +
        `Ensure maxTraversals is set appropriately to prevent infinite loops.`
      );
    }
  }

  return { warnings, errors };
}
```

**Migration for Existing Graphs**:
```typescript
// All existing connections have maxTraversals = undefined
// Default interpretation: maxTraversals = 1 (no cycles)
// This maintains backwards compatibility

// New cycle-enabled connection:
{
  from: 'circuit_breaker',
  to: 'service',
  type: 'read_write',
  maxTraversals: 3,  // Allow up to 3 visits for retry/circuit breaker
}
```

**Testing (CRITICAL)**:
- Test cycle detection algorithm
- Test max depth limit enforced (prevent crash)
- Test max visits limit enforced
- Test backwards compatibility (old graphs work)
- Test circuit breaker pattern (CB -> Service -> CB)
- Test retry pattern (Service -> Service retry)
- Performance test with deep cycles (depth=100)
- Memory test (does Map grow unbounded?)
- Stress test: intentional infinite loop attempt (should fail gracefully)

**Pessimistic Estimate**: 10-14 hours (safety is paramount)

---

### 1.4 Load Balancer Configuration (6-10 hours)

**Priority**: HIGH
**Difficulty**: MEDIUM-HIGH
**Files**: `simulation/components/LoadBalancer.ts`, `types/advancedConfig.ts`

**Current Hardcoded State**:
```typescript
export class LoadBalancer extends Component {
  private readonly capacity = 100000;  // Fixed
  private readonly baseLatency = 1;     // Fixed
  private readonly monthlyCost = 50;    // Fixed

  simulate(rps: number): ComponentMetrics {
    const utilization = rps / this.capacity;
    const latency = this.calculateQueueLatency(this.baseLatency, utilization);
    const errorRate = this.calculateErrorRate(utilization);

    return {
      latency,
      errorRate,
      utilization,
      cost: this.monthlyCost,
    };
  }
}
```

**Target State**:
```typescript
// types/advancedConfig.ts (already partially defined!)
export interface LoadBalancerConfig {
  capacity?: number;           // Default: 100000
  baseLatency?: number;        // Default: 1ms
  monthlyCost?: number;        // Default: $50
  algorithm?: LoadBalancingAlgorithm;
  healthCheckEnabled?: boolean;
  healthCheckIntervalMs?: number;
  connectionDrainingEnabled?: boolean;
  stickySessionsEnabled?: boolean;
  weights?: Record<string, number>;  // For weighted routing
}

export type LoadBalancingAlgorithm =
  | 'round_robin'         // Default, current behavior
  | 'least_connections'   // Route to backend with fewest active connections
  | 'weighted'            // Route based on configured weights
  | 'ip_hash'             // Consistent routing based on client IP
  | 'random'              // Random selection
  | 'least_response_time';// Route to backend with lowest latency

// LoadBalancer.ts
export class LoadBalancer extends Component {
  private config: Required<LoadBalancerConfig>;
  private downstreamNodes: string[] = [];  // PROBLEM: doesn't have this info

  constructor(id: string, config: LoadBalancerConfig = {}) {
    super(id, 'load_balancer', config);

    this.config = {
      capacity: config.capacity ?? 100000,
      baseLatency: config.baseLatency ?? 1,
      monthlyCost: config.monthlyCost ?? 50,
      algorithm: config.algorithm ?? 'round_robin',
      healthCheckEnabled: config.healthCheckEnabled ?? false,
      healthCheckIntervalMs: config.healthCheckIntervalMs ?? 30000,
      connectionDrainingEnabled: config.connectionDrainingEnabled ?? false,
      stickySessionsEnabled: config.stickySessionsEnabled ?? false,
      weights: config.weights ?? {},
    };
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const utilization = rps / this.config.capacity;
    let latency = this.calculateQueueLatency(this.config.baseLatency, utilization);
    const errorRate = this.calculateErrorRate(utilization);

    // Health check overhead
    if (this.config.healthCheckEnabled) {
      latency += 0.1;  // Small overhead for health tracking
    }

    return {
      latency,
      errorRate,
      utilization,
      cost: this.config.monthlyCost,
      algorithm: this.config.algorithm,
    };
  }
}
```

**MAJOR PROBLEM**: Load Balancer doesn't know graph topology!

The `simulate()` method is called in isolation. It doesn't know:
- Which downstream nodes exist
- Current connection counts to each node
- Response times of each node
- Health status of each node

**Two Solutions**:

**Option A: Pass Graph Context (Complex)**
```typescript
interface SimulationContext {
  testCase?: any;
  currentTime?: number;
  graph?: SystemGraph;  // NEW: full graph
  componentStates?: Map<string, ComponentState>;  // NEW: current states
}

simulate(rps: number, context?: SimulationContext): ComponentMetrics {
  // Can now access downstream nodes
  const downstreamIds = this.getDownstreamNodes(context.graph);
  const states = context.componentStates;

  switch (this.config.algorithm) {
    case 'least_connections':
      // Need to track active connections per backend
      // But we don't simulate individual connections...
      break;
  }
}
```

**Option B: Simplified Modeling (Pragmatic)**
```typescript
// Don't actually implement algorithms, just model their effects
simulate(rps: number): ComponentMetrics {
  let latencyMultiplier = 1.0;
  let errorRateAdjustment = 0;

  switch (this.config.algorithm) {
    case 'round_robin':
      // Even distribution, no optimization
      latencyMultiplier = 1.0;
      break;

    case 'least_connections':
      // Better distribution, slight improvement
      latencyMultiplier = 0.95;
      errorRateAdjustment = -0.01;
      break;

    case 'weighted':
      // Optimized for known traffic patterns
      latencyMultiplier = 0.9;
      break;

    case 'random':
      // Similar to round robin with more variance
      latencyMultiplier = 1.05;  // Slightly worse
      break;
  }

  return {
    latency: baseLatency * latencyMultiplier,
    errorRate: Math.max(0, errorRate + errorRateAdjustment),
    // ...
  };
}
```

**Recommendation**: Start with Option B (simplified modeling) for Phase 1. Option A (full context) is Phase 3 work.

**Implementation Steps**:
1. Move hardcoded values to config with defaults
2. Add LoadBalancerConfig interface (reuse from advancedConfig.ts)
3. Implement simplified algorithm modeling
4. Validate config in constructor
5. Update cost calculation based on features enabled
6. Document that algorithms are simplified models, not real implementations
7. Add examples showing different configurations
8. Feature flag for backwards compatibility

**Testing**:
- Test default config matches old behavior
- Test each algorithm has different effects
- Test config validation (negative capacity should error)
- Test health check overhead
- Backwards compatibility test

**Pessimistic Estimate**: 8-12 hours (Option B still has edge cases)

---

### 1.5 Request Priority & Timeout Fields (6-10 hours)

**Priority**: HIGH
**Difficulty**: MEDIUM
**Files**: `types/request.ts`, `simulation/trafficFlowEngine.ts`, `simulation/components/Component.ts`

**Current Minimal Request**:
```typescript
export interface Request {
  id: string;
  type: RequestType;  // 'read' | 'write'
  startTime: number;
  sizeMB?: number;
  path: string[];
  latency: number;
  failed: boolean;
  failureReason?: string;
}
```

**Extended Request Interface**:
```typescript
export type Priority = 'critical' | 'high' | 'normal' | 'low';

export interface Request {
  // Existing fields
  id: string;
  type: RequestType;
  startTime: number;
  sizeMB?: number;
  path: string[];
  latency: number;
  failed: boolean;
  failureReason?: string;

  // NEW: Priority & Timeout
  priority?: Priority;          // Default: 'normal'
  timeout?: number;             // Max total time in ms
  deadline?: number;            // Absolute time (startTime + timeout)

  // NEW: Tracing
  correlationId?: string;       // Group related requests
  tags?: Record<string, string>;// Arbitrary metadata for routing

  // NEW: Metrics
  retryAttempt?: number;        // Current retry attempt (0 = first)
  totalRetries?: number;        // Total retries attempted
  queueWaitTime?: number;       // Time spent in queue
  processingTime?: number;      // Time spent processing
}
```

**Timeout Enforcement**:
```typescript
// trafficFlowEngine.ts
private traverseGraph(request: Request, ...): void {
  // Check timeout BEFORE processing
  if (request.deadline && request.deadline > 0) {
    const currentSimTime = (context?.currentTime || 0) * 1000;  // Convert to ms
    const elapsedTime = currentSimTime + request.latency;

    if (elapsedTime >= request.deadline) {
      request.failed = true;
      request.failureReason = 'timeout';
      return;
    }
  }

  // Process at component...
  const result = this.processAtComponent(component, request, context);
  request.latency += result.latencyMs;

  // Check timeout AFTER processing
  if (request.deadline && request.deadline > 0) {
    const elapsedTime = (context?.currentTime || 0) * 1000 + request.latency;

    if (elapsedTime >= request.deadline) {
      request.failed = true;
      request.failureReason = 'timeout';
      return;
    }
  }

  // Continue traversal...
}
```

**Priority Queue Modeling (Simplified)**:
```typescript
// Component.ts
protected calculatePriorityLatency(
  baseLatency: number,
  utilization: number,
  priority?: Priority
): number {
  const queueLatency = this.calculateQueueLatency(baseLatency, utilization);

  if (!priority) {
    return queueLatency;
  }

  // Priority affects queue wait time
  const priorityMultipliers = {
    critical: 0.2,  // Skip most of queue
    high: 0.5,      // Skip half of queue
    normal: 1.0,    // Standard wait
    low: 2.0,       // Wait longer
  };

  return baseLatency + (queueLatency - baseLatency) * priorityMultipliers[priority];
}
```

**Problems to Solve**:

1. **Time Unit Confusion**:
   - `context.currentTime` is in SECONDS
   - `request.latency` is in MILLISECONDS
   - `request.timeout` should be in MILLISECONDS
   - Need consistent units

2. **Simulation Time vs Real Time**:
   - Simulation runs in "simulated seconds"
   - Timeouts are "real milliseconds"
   - Need clear semantics

3. **Priority Without Real Queue**:
   - Current model doesn't have actual queues
   - Priority is approximated via latency adjustment
   - Not a true priority queue simulation

4. **Tag Routing**:
   - Tags are set on request
   - But routing happens at connection level
   - Need to bridge these two concepts

**Implementation Steps**:
1. Update Request interface with new fields
2. Update request generation to set deadline (startTime + timeout)
3. Add timeout checking in traverseGraph
4. Implement priority latency calculation
5. Ensure unit consistency (document: context.currentTime in seconds, request.latency in ms)
6. Add request generation with priorities (distribution: 5% critical, 15% high, 70% normal, 10% low?)
7. Validate timeout values (positive, reasonable range)
8. Update TrafficFlowEngine to generate diverse priority mix
9. Feature flag for backwards compatibility

**Testing**:
- Test timeout enforcement (request times out after deadline)
- Test no timeout (request completes normally)
- Test priority ordering (critical faster than normal)
- Test unit conversion (seconds vs milliseconds)
- Test with negative timeout (should error or ignore?)
- Backwards compatibility (old requests without priority still work)

**Pessimistic Estimate**: 8-12 hours (unit confusion always bites)

---

## Phase 2: Core Reliability (30-52 hours)

**Timeline**: Week 7-12
**Goal**: Add production-grade reliability patterns
**Impact**: Increases completeness from 55% → 70%
**Risk**: HIGH - core behavior changes, state management challenges

### 2.1 Retry Logic with Exponential Backoff (12-18 hours)

**Priority**: CRITICAL
**Difficulty**: HIGH
**Files**: `simulation/components/Component.ts`, all component subclasses, `simulation/retry.ts`

**Why This Is Hard**:

1. **Two Simulation Modes Must Agree**:
```typescript
// Mode 1: Aggregate statistics
// Returns: { errorRate: 0.1 } meaning 10% of requests fail
// How to "retry" an aggregate? Run simulation multiple times?

// Mode 2: Individual request tracing
// Request fails at specific point
// Can retry by re-traversing graph
// But only samples 1000 requests (10,000 with Phase 1 fix)
```

2. **Retry Changes Latency Distribution Dramatically**:
```typescript
// Without retry:
// 90% succeed at 50ms
// 10% fail immediately
// p99 = 50ms

// With retry (3 attempts, exponential backoff):
// Attempt 1: 90% succeed at 50ms, 10% fail
// Backoff: 100ms
// Attempt 2: 90% of failures succeed (9% of total)
// Total: 99% success rate, but...
// p99 now includes retry latencies: 50ms + 100ms + 50ms = 200ms!
```

3. **Error Types Matter**:
```typescript
interface RetryableError {
  type: 'retriable' | 'non_retriable';
  reason: string;
}

// Retriable:
// - Timeout (maybe transient)
// - 503 Service Unavailable
// - Connection reset

// Non-retriable:
// - 400 Bad Request
// - 404 Not Found
// - 401 Unauthorized

// Current model: errorRate is a number, not error types
// Need to model different error types
```

4. **Thundering Herd Prevention**:
```typescript
// Without jitter: all retries happen at same time
// t=0: 1000 requests
// t=100ms: 100 retries (all at exactly same time)
// t=300ms: 10 retries (all at exactly same time)
// This causes traffic spikes

// With jitter: spread out retries
// t=0: 1000 requests
// t=80-120ms: 100 retries (spread over 40ms window)
// t=240-360ms: 10 retries (spread over 120ms window)

// Need random jitter, but randomness = non-deterministic tests
// Need seeded random for reproducibility
```

**Implementation**:

```typescript
// simulation/retry.ts
export interface RetryConfig {
  maxAttempts: number;              // Default: 3
  backoffStrategy: BackoffStrategy;
  initialDelayMs: number;           // Default: 100ms
  maxDelayMs: number;               // Default: 10000ms
  jitterEnabled: boolean;           // Default: true
  jitterFactor: number;             // 0-1, default: 0.5
  retryableErrors: string[];        // Error types to retry
}

export type BackoffStrategy = 'exponential' | 'linear' | 'constant' | 'fibonacci';

export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig,
  randomSeed?: number
): number {
  let delay: number;

  switch (config.backoffStrategy) {
    case 'exponential':
      delay = config.initialDelayMs * Math.pow(2, attempt - 1);
      break;
    case 'linear':
      delay = config.initialDelayMs * attempt;
      break;
    case 'constant':
      delay = config.initialDelayMs;
      break;
    case 'fibonacci':
      delay = config.initialDelayMs * fibonacci(attempt);
      break;
  }

  delay = Math.min(delay, config.maxDelayMs);

  if (config.jitterEnabled) {
    // Use seeded random for deterministic tests
    const random = randomSeed !== undefined
      ? seededRandom(randomSeed + attempt)
      : Math.random();
    const jitter = delay * config.jitterFactor * (random - 0.5) * 2;
    delay = Math.max(0, delay + jitter);
  }

  return delay;
}

function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

function seededRandom(seed: number): number {
  // Simple LCG for deterministic random
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
```

**Integration with TrafficFlowEngine**:
```typescript
// trafficFlowEngine.ts
private simulateRequestWithRetry(
  request: Request,
  entryNodeId: string,
  context: SimulationContext,
  retryConfig?: RetryConfig
): void {
  if (!retryConfig || !isEnabled('ENABLE_RETRY_LOGIC')) {
    // No retry, old behavior
    this.traverseGraph(request, entryNodeId, context, new Map());
    return;
  }

  const maxAttempts = retryConfig.maxAttempts;
  let totalLatency = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Clone request for this attempt
    const attemptRequest = { ...request, retryAttempt: attempt };

    // Reset path and latency for this attempt
    attemptRequest.path = [];
    attemptRequest.latency = 0;
    attemptRequest.failed = false;
    attemptRequest.failureReason = undefined;

    // Traverse graph
    this.traverseGraph(attemptRequest, entryNodeId, context, new Map());

    totalLatency += attemptRequest.latency;

    if (!attemptRequest.failed) {
      // Success!
      request.latency = totalLatency;
      request.path = attemptRequest.path;
      request.failed = false;
      request.totalRetries = attempt - 1;
      return;
    }

    // Check if error is retriable
    if (!this.isRetriableError(attemptRequest.failureReason, retryConfig)) {
      // Non-retriable error, fail immediately
      request.latency = totalLatency;
      request.path = attemptRequest.path;
      request.failed = true;
      request.failureReason = attemptRequest.failureReason;
      request.totalRetries = attempt - 1;
      return;
    }

    // Add backoff delay before next attempt
    if (attempt < maxAttempts) {
      const backoffDelay = calculateBackoffDelay(attempt, retryConfig, request.id.hashCode());
      totalLatency += backoffDelay;

      // Check timeout after adding backoff
      if (request.deadline && (context?.currentTime || 0) * 1000 + totalLatency >= request.deadline) {
        request.failed = true;
        request.failureReason = 'timeout_during_retry';
        request.latency = totalLatency;
        request.totalRetries = attempt;
        return;
      }
    }
  }

  // All retries exhausted
  request.failed = true;
  request.failureReason = 'max_retries_exceeded';
  request.latency = totalLatency;
  request.totalRetries = maxAttempts;
}

private isRetriableError(errorReason?: string, config?: RetryConfig): boolean {
  if (!errorReason || !config) return false;

  // Default retriable errors
  const defaultRetriable = ['timeout', 'overload', 'service_unavailable', 'connection_reset'];
  const retriable = config.retryableErrors || defaultRetriable;

  return retriable.some(err => errorReason.includes(err));
}
```

**Integration with SimulationEngine (Mode 1)**:
```typescript
// engine.ts
// For aggregate mode, need to model retry mathematically

simulateTraffic(testCase: TestCase): TestMetrics {
  // ... existing simulation ...

  if (isEnabled('ENABLE_RETRY_LOGIC') && this.retryConfig) {
    // Adjust error rate based on retry
    // If errorRate is 10% and we have 3 retries:
    // Probability of all attempts failing = 0.1^3 = 0.001
    // Final error rate = 0.1%

    const baseErrorRate = totalErrorRate;
    const maxAttempts = this.retryConfig.maxAttempts;
    const adjustedErrorRate = Math.pow(baseErrorRate, maxAttempts);

    // Adjust latency to account for retry overhead
    // Expected retries = baseErrorRate + baseErrorRate^2 + ...
    const expectedRetries = this.calculateExpectedRetries(baseErrorRate, maxAttempts);
    const avgBackoffDelay = this.calculateAverageBackoff(this.retryConfig);
    const retryLatencyOverhead = expectedRetries * avgBackoffDelay;

    return {
      ...baseMetrics,
      errorRate: adjustedErrorRate,
      p50Latency: baseMetrics.p50Latency + retryLatencyOverhead * 0.1,  // p50 rarely retries
      p99Latency: baseMetrics.p99Latency + retryLatencyOverhead * 2,     // p99 likely retries
    };
  }
}
```

**Problems Not Yet Solved**:

1. **Circuit breaker interaction**: Don't retry if circuit open
2. **Timeout + retry**: Total time across all retries must respect deadline
3. **Bulkhead + retry**: Retries consume limited resources
4. **Memory pressure**: Tracking retry state for 10,000 requests

**Implementation Steps**:
1. Create retry.ts with configuration and calculation functions
2. Add RetryConfig to graph configuration
3. Implement simulateRequestWithRetry in TrafficFlowEngine
4. Update request generation to set retry configs
5. Implement retry logic in SimulationEngine (mathematical model)
6. Add jitter with seeded randomness
7. Track retry metrics (total retries, success rate by attempt)
8. Test exponential backoff timing
9. Feature flag for backwards compatibility
10. Performance test (retry loops can be expensive)

**Testing**:
- Test each backoff strategy (exponential, linear, constant, fibonacci)
- Verify backoff timing (100ms, 200ms, 400ms for exponential)
- Test jitter (should vary within bounds)
- Test max delay cap
- Test retry success on 2nd attempt
- Test retry success on 3rd attempt
- Test all retries failing
- Test non-retriable error (should fail immediately)
- Test timeout during retry
- Test with circuit breaker (Phase 2.2 dependency)
- Performance: 10,000 requests with retries

**Pessimistic Estimate**: 16-22 hours (two mode consistency is hard)

---

### 2.2 Circuit Breaker Pattern (12-18 hours)

**Priority**: CRITICAL
**Difficulty**: VERY HIGH (state management challenge)
**Files**: `simulation/components/Component.ts`, new `simulation/circuitBreaker.ts`

**Fundamental Problem: Simulation is Stateless**

```typescript
// Current: Components are instantiated, simulate() called once, done
const engine = new SimulationEngine(graph);
const result = engine.simulateTraffic(testCase);  // Single call, no state

// Circuit breaker needs temporal state:
// t=0: CLOSED, no failures
// t=10: CLOSED, 5 failures
// t=15: OPEN (failure threshold reached)
// t=45: HALF_OPEN (timeout expired)
// t=46: CLOSED (test request succeeded)
```

**Current simulation doesn't model time progression!**

**Solution Options**:

**Option A: Time-Step Simulation (Complex)**
```typescript
// Simulate across test duration with time steps
simulateTraffic(testCase: TestCase): TestMetrics {
  const duration = testCase.duration;  // seconds
  const stepSize = 1;  // 1 second steps
  const results: TestMetrics[] = [];

  // Initialize circuit breaker state
  const circuitBreakerState = new Map<string, CircuitBreakerState>();

  for (let t = 0; t < duration; t += stepSize) {
    // Update circuit breaker states
    this.updateCircuitBreakers(circuitBreakerState, t);

    // Simulate at this time
    const context = { currentTime: t, circuitBreakerState };
    const stepResult = this.simulateAtTime(testCase, context);
    results.push(stepResult);

    // Record failures for circuit breaker
    this.recordFailures(circuitBreakerState, stepResult);
  }

  // Aggregate results across time
  return this.aggregateTimeSteps(results);
}
```

This is a **fundamental architecture change**.

**Option B: Simplified State Model (Pragmatic)**
```typescript
// Model circuit breaker effect without full temporal simulation

interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;     // 0.5 = 50% error rate triggers
  recoveryTimeMs: number;       // Time to half-open
  halfOpenRequestLimit: number; // Requests to test in half-open
}

// In Component.ts
protected applyCircuitBreaker(
  baseMetrics: ComponentMetrics,
  config: CircuitBreakerConfig,
  context?: SimulationContext
): ComponentMetrics {
  if (!config.enabled || !isEnabled('ENABLE_CIRCUIT_BREAKER')) {
    return baseMetrics;
  }

  // Simplified model: if downstream error rate > threshold, circuit opens
  if (baseMetrics.errorRate >= config.failureThreshold) {
    // Circuit would be OPEN
    // Fail fast, don't call downstream
    return {
      ...baseMetrics,
      errorRate: 1.0,  // All requests rejected
      latency: 1,       // Fast fail
      circuitState: 'open',
    };
  }

  // Circuit is CLOSED, pass through
  return {
    ...baseMetrics,
    circuitState: 'closed',
  };
}
```

This is **too simplified** - doesn't model state transitions or recovery.

**Option C: Failure Injection Based (Middle Ground)**
```typescript
// Use failure injection to model circuit breaker behavior

interface CircuitBreakerFailureInjection {
  type: 'circuit_breaker_trip';
  atSecond: number;        // When circuit opens
  recoverySecond: number;  // When circuit closes
  componentId: string;
}

// In engine.ts
if (failureInjection.type === 'circuit_breaker_trip') {
  const currentTime = context.currentTime;
  const { atSecond, recoverySecond, componentId } = failureInjection;

  if (currentTime >= atSecond && currentTime < recoverySecond) {
    // Circuit is OPEN
    const component = this.components.get(componentId);
    return component.simulateCircuitOpen();
  }
}

// User configures when circuit trips as part of test case
// Not automatic, but educational
```

This is **not automatic** - user must specify when circuit trips.

**Recommended Approach: Time-Step Simulation (Option A)**

This is the most correct but also most complex. Here's a minimal implementation:

```typescript
// simulation/circuitBreaker.ts
export type CircuitState = 'closed' | 'open' | 'half_open';

export interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastStateChange: number;  // Time of last state change
  failureWindow: number[];  // Rolling window of failure times
}

export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private state: CircuitBreakerState;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
    this.state = {
      state: 'closed',
      failureCount: 0,
      successCount: 0,
      lastStateChange: 0,
      failureWindow: [],
    };
  }

  shouldAllowRequest(currentTime: number): boolean {
    this.updateState(currentTime);

    switch (this.state.state) {
      case 'closed':
        return true;
      case 'open':
        return false;
      case 'half_open':
        // Allow limited requests
        return this.state.successCount < this.config.halfOpenRequestLimit;
    }
  }

  recordResult(success: boolean, currentTime: number): void {
    if (success) {
      this.state.successCount++;
      if (this.state.state === 'half_open' &&
          this.state.successCount >= this.config.halfOpenRequestLimit) {
        this.transitionTo('closed', currentTime);
      }
    } else {
      this.state.failureCount++;
      this.state.failureWindow.push(currentTime);
      this.pruneFailureWindow(currentTime);

      if (this.state.state === 'half_open') {
        this.transitionTo('open', currentTime);
      } else if (this.state.state === 'closed') {
        const failureRate = this.calculateFailureRate();
        if (failureRate >= this.config.failureThreshold) {
          this.transitionTo('open', currentTime);
        }
      }
    }
  }

  private updateState(currentTime: number): void {
    if (this.state.state === 'open') {
      const openDuration = currentTime - this.state.lastStateChange;
      if (openDuration * 1000 >= this.config.recoveryTimeMs) {
        this.transitionTo('half_open', currentTime);
      }
    }
  }

  private transitionTo(newState: CircuitState, currentTime: number): void {
    this.state.state = newState;
    this.state.lastStateChange = currentTime;

    if (newState === 'half_open') {
      this.state.successCount = 0;
    } else if (newState === 'closed') {
      this.state.failureCount = 0;
      this.state.failureWindow = [];
    }
  }

  private pruneFailureWindow(currentTime: number): void {
    const windowStart = currentTime - (this.config.windowSizeMs || 60000) / 1000;
    this.state.failureWindow = this.state.failureWindow.filter(t => t >= windowStart);
  }

  private calculateFailureRate(): number {
    // Simplified: use failure count in window
    // Real: would need total requests in window
    return this.state.failureWindow.length / 100;  // Assume 100 requests in window
  }
}

// engine.ts - Time-step simulation
simulateTrafficWithCircuitBreaker(testCase: TestCase): TestMetrics {
  if (!isEnabled('ENABLE_CIRCUIT_BREAKER')) {
    return this.simulateTraffic(testCase);
  }

  const duration = testCase.duration;
  const stepSize = 1;  // 1 second
  const circuitBreakers = this.initializeCircuitBreakers();
  const timeStepResults: TestMetrics[] = [];

  for (let t = 0; t < duration; t += stepSize) {
    // Create context with circuit breaker states
    const context: SimulationContext = {
      currentTime: t,
      testCase,
      circuitBreakers,
    };

    // Simulate at this time step
    const result = this.simulateAtTimeStep(context);
    timeStepResults.push(result);

    // Update circuit breaker states based on results
    for (const [componentId, cb] of circuitBreakers) {
      const errorRate = result.componentMetrics.get(componentId)?.errorRate || 0;
      const success = Math.random() > errorRate;  // Simplified
      cb.recordResult(success, t);
    }
  }

  // Aggregate all time steps
  return this.aggregateTimeStepResults(timeStepResults);
}
```

**This is a LOT of new code and architecture changes.**

**Simpler Alternative: Document as Future Feature**

Given complexity, consider:
1. Implement failure injection for circuit breaker (Option C) in Phase 2
2. Document full time-step simulation as future Phase 5 feature
3. Focus on retry, timeout, which don't need temporal state

**But if implementing full version**:

**Implementation Steps**:
1. Create CircuitBreaker class with state management
2. Add CircuitBreakerConfig to component configs
3. Implement time-step simulation in engine.ts
4. Initialize circuit breakers for relevant components
5. Pass circuit breaker states through SimulationContext
6. Check circuit state before processing request
7. Record results to update circuit state
8. Aggregate metrics across time steps
9. Track circuit state changes in metrics
10. Create examples showing circuit breaker trips
11. Feature flag for backwards compatibility

**Testing**:
- Test state transitions (closed → open → half_open → closed)
- Test failure threshold trigger
- Test recovery timeout
- Test half-open request limiting
- Test failure rate calculation with rolling window
- Test with retry (don't retry if circuit open)
- Performance: time-step simulation is O(duration)
- Memory: circuit breaker state per component

**Pessimistic Estimate**: 16-22 hours (architectural change)

---

### 2.3 Timeout Enforcement (6-10 hours)

**Priority**: HIGH
**Difficulty**: MEDIUM
**Files**: `simulation/trafficFlowEngine.ts`

Already covered in Phase 1.5. Main implementation:

```typescript
// In traverseGraph
if (request.deadline && request.deadline > 0) {
  const simulatedTimeMs = (context?.currentTime || 0) * 1000;
  const totalElapsed = simulatedTimeMs + request.latency;

  if (totalElapsed >= request.deadline) {
    request.failed = true;
    request.failureReason = 'timeout';
    return;
  }
}
```

**Additional Work**:
- Partial timeout (processing started but didn't finish)
- Timeout propagation (parent request times out)
- Timeout metrics (% requests that timed out)
- Different timeout types (connection vs request vs idle)

**Pessimistic Estimate**: 8-12 hours (unit confusion always bites)

---

### 2.4 Enhanced Failure Modes (6-10 hours)

**Priority**: MEDIUM
**Difficulty**: MEDIUM
**Files**: `types/testCase.ts`, database components

**Current**:
```typescript
type FailureType = 'db_crash' | 'cache_flush' | 'network_partition';
```

**Expanded**:
```typescript
type FailureType =
  | 'db_crash'           // Complete failure, 100% error rate
  | 'cache_flush'        // Data loss, 0% hit rate temporarily
  | 'network_partition'  // Connectivity loss
  | 'partial_failure'    // Some replicas down (50% capacity)
  | 'slow_down'          // 10x latency spike
  | 'cascading'          // Failure spreads to dependent services
  | 'disk_full'          // Storage exhausted
  | 'memory_pressure'    // Gradual degradation
  | 'cpu_spike'          // Compute saturation
  | 'split_brain';       // Network partition with conflicting state

interface FailureScenario {
  type: FailureType;
  target: string;                    // Component ID
  startTime: number;                 // When failure starts
  duration: number;                  // How long it lasts
  severity?: number;                 // 0-1, impact level (default: 1.0)
  cascadeTo?: string[];              // Components affected by cascade
  recoveryStrategy?: 'immediate' | 'gradual' | 'manual';
  gradualRecoveryDuration?: number;  // Time to fully recover
}
```

**Implementation for each type**:
```typescript
// In component simulation
handleFailureInjection(context: SimulationContext): Partial<ComponentMetrics> {
  const failure = context?.testCase?.failureInjection;
  if (!failure || failure.target !== this.id) return {};

  const currentTime = context.currentTime || 0;
  if (currentTime < failure.startTime || currentTime > failure.startTime + failure.duration) {
    return {};  // Not in failure window
  }

  switch (failure.type) {
    case 'partial_failure':
      // 50% capacity reduction
      const severity = failure.severity || 0.5;
      return {
        capacityMultiplier: 1 - severity,
        errorRateAddition: severity * 0.5,
      };

    case 'slow_down':
      // 10x latency
      return {
        latencyMultiplier: 10,
        errorRate: 0,  // Slow but not failing
      };

    case 'cascading':
      // Mark cascadeTo components as affected
      // Need to propagate this through graph
      return {
        errorRate: 1.0,
        cascadeTargets: failure.cascadeTo,
      };

    case 'memory_pressure':
      // Gradual degradation over time
      const elapsed = currentTime - failure.startTime;
      const degradation = Math.min(1, elapsed / failure.duration);
      return {
        latencyMultiplier: 1 + degradation * 5,
        errorRateAddition: degradation * 0.3,
      };

    default:
      return {};
  }
}
```

**Cascading Failures (Most Complex)**:
```typescript
// In engine.ts
simulateWithCascadingFailures(): TestMetrics {
  const affectedComponents = new Set<string>();
  const failure = this.testCase.failureInjection;

  if (failure?.type === 'cascading') {
    // Initial failure
    affectedComponents.add(failure.target);

    // Propagate to cascade targets
    if (failure.cascadeTo) {
      for (const target of failure.cascadeTo) {
        affectedComponents.add(target);
      }
    }

    // Could also propagate upstream (reverse graph traversal)
    // Components that depend on failed component also fail
  }

  // Simulate with affected components marked as failed
  return this.simulateWithAffectedComponents(affectedComponents);
}
```

**Pessimistic Estimate**: 10-14 hours (cascading is complex)

---

### 2.5 Backpressure & Queue Simulation (10-14 hours)

**Priority**: MEDIUM
**Difficulty**: HIGH
**Files**: `simulation/components/Component.ts`

**Current M/M/1 Model**:
```typescript
// Component.ts lines 41-54
protected calculateQueueLatency(baseLatency: number, utilization: number): number {
  if (utilization < 0.7) return baseLatency;
  if (utilization < 0.9) {
    // M/M/1 queueing formula
    return baseLatency / (1 - utilization);
  }
  // Degradation
}
```

This is an **approximation**, not actual queue simulation.

**Real Queue Simulation**:
```typescript
interface QueueConfig {
  maxQueueSize: number;           // Max items in queue
  processingRate: number;         // Items per second
  rejectionPolicy: 'drop' | 'backpressure' | 'timeout';
  queueTimeoutMs?: number;
}

class QueuedComponent extends Component {
  private queue: number = 0;  // Current queue depth
  private config: QueueConfig;

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const { maxQueueSize, processingRate, rejectionPolicy } = this.config;

    // Calculate queue behavior
    const arrivalRate = rps;
    const serviceRate = processingRate;

    // Check if stable (λ < μ)
    if (arrivalRate >= serviceRate) {
      // Unstable queue, will grow without bound
      // Apply backpressure or rejection
    }

    // Queue depth estimation (Little's Law)
    // L = λW where L = avg items, λ = arrival rate, W = avg wait time
    const avgWaitTime = 1 / (serviceRate - arrivalRate);  // seconds
    const avgQueueDepth = arrivalRate * avgWaitTime;

    if (avgQueueDepth > maxQueueSize) {
      // Queue overflow
      switch (rejectionPolicy) {
        case 'drop':
          const dropRate = (avgQueueDepth - maxQueueSize) / avgQueueDepth;
          return {
            ...baseMetrics,
            errorRate: dropRate,
            queueDropRate: dropRate,
          };

        case 'backpressure':
          // Signal to upstream to slow down
          return {
            ...baseMetrics,
            backpressureSignal: true,
            acceptableRate: serviceRate * 0.9,
          };

        case 'timeout':
          // Requests timeout waiting in queue
          const timeoutRate = this.calculateQueueTimeoutRate(avgWaitTime);
          return {
            ...baseMetrics,
            errorRate: timeoutRate,
          };
      }
    }

    // Queue is manageable
    const queueLatency = avgWaitTime * 1000;  // Convert to ms
    return {
      ...baseMetrics,
      latency: baseMetrics.latency + queueLatency,
      queueDepth: avgQueueDepth,
    };
  }
}
```

**Problems**:
1. Queue state needs to persist (same issue as circuit breaker)
2. Backpressure needs to propagate upstream
3. Need to model queue draining over time

**Pessimistic Estimate**: 12-16 hours

---

## Phase 3: Advanced Architecture (45-68 hours)

**Timeline**: Week 13-20
**Goal**: Enable complex distributed system topologies
**Impact**: Increases completeness from 70% → 85%
**Risk**: VERY HIGH - fundamental model changes

### 3.1 Conditional Routing (16-22 hours)

**Priority**: HIGH
**Difficulty**: VERY HIGH
**Files**: `types/graph.ts`, `simulation/trafficFlowEngine.ts`, `simulation/engine.ts`

**Current: Single Path**:
```typescript
// trafficFlowEngine.ts line 212-221
for (const conn of validConnections) {
  this.traverseGraph(request, conn.to, context, visited);
  break;  // ONLY FIRST PATH
}
```

**Target: Weighted Multi-Path**:
```typescript
interface ConditionalConnection extends Connection {
  weight?: number;                    // 0-1, traffic percentage
  condition?: (request: Request) => boolean;  // Predicate
  priority?: number;                  // Evaluation order
}

// Example: Canary deployment
[
  { from: 'lb', to: 'app-stable', weight: 0.9 },
  { from: 'lb', to: 'app-canary', weight: 0.1 },
]

// Example: Premium routing
[
  { from: 'router', to: 'premium-db', condition: r => r.tags?.tier === 'premium' },
  { from: 'router', to: 'standard-db', condition: r => r.tags?.tier !== 'premium' },
]
```

**Why This Is Very Hard**:

1. **RPS Distribution**:
```typescript
// If 1000 RPS and weights are 0.9/0.1
// 900 RPS should go to app-stable
// 100 RPS should go to app-canary

// But simulation traces individual requests
// Each request must be assigned to ONE path
// Assignment must match weighted distribution statistically
```

2. **Metric Aggregation**:
```typescript
// If 90% goes to stable (50ms latency) and 10% to canary (100ms latency)
// What's the overall p99 latency?
// - p99 of stable path?
// - p99 of canary path?
// - Weighted combination?

// Answer: Need to combine latency distributions from both paths
```

3. **Graph Validation**:
```typescript
// Weights must sum to 1.0 (or be normalized)
// Multiple outgoing connections from same node must be handled
// Default behavior for old connections (no weight) must be backwards compatible
```

4. **Visualization**:
```typescript
// UI must show weighted edges
// Connection lines should have labels (90%, 10%)
// Traffic flow visualization must split at weighted nodes
// This is UI work not included in estimate
```

**Implementation**:
```typescript
// types/graph.ts
export interface Connection {
  from: string;
  to: string;
  type: ConnectionType;
  // NEW: conditional routing
  weight?: number;              // Default: 1.0
  condition?: string;           // Serialized function (can't store actual function in JSON)
  conditionDescription?: string;// Human readable
  priority?: number;            // Evaluation order
}

// trafficFlowEngine.ts
private selectNextConnections(
  validConnections: Connection[],
  request: Request
): Connection[] {
  if (!isEnabled('ENABLE_WEIGHTED_ROUTING')) {
    // Old behavior: first connection
    return validConnections.slice(0, 1);
  }

  // Filter by condition
  const conditionallyValid = validConnections.filter(conn => {
    if (!conn.condition) return true;
    return this.evaluateCondition(conn.condition, request);
  });

  if (conditionallyValid.length === 0) {
    return [];  // No valid path
  }

  // If weights specified, use weighted selection
  const hasWeights = conditionallyValid.some(c => c.weight !== undefined);
  if (hasWeights) {
    return this.weightedSelect(conditionallyValid, request);
  }

  // Sort by priority, take first
  const sorted = conditionallyValid.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  return sorted.slice(0, 1);
}

private weightedSelect(connections: Connection[], request: Request): Connection[] {
  // Normalize weights
  const weights = connections.map(c => c.weight || 1.0);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalized = weights.map(w => w / totalWeight);

  // For single request, randomly select based on weight
  const random = this.seededRandom(request.id);
  let cumulative = 0;

  for (let i = 0; i < connections.length; i++) {
    cumulative += normalized[i];
    if (random < cumulative) {
      return [connections[i]];
    }
  }

  return [connections[connections.length - 1]];
}

private evaluateCondition(conditionStr: string, request: Request): boolean {
  // Security risk: eval is dangerous
  // Better: use a safe expression parser
  // Or predefined conditions only

  const predefinedConditions: Record<string, (r: Request) => boolean> = {
    'isPremiumUser': r => r.tags?.tier === 'premium',
    'isReadRequest': r => r.type === 'read',
    'isWriteRequest': r => r.type === 'write',
    'isHighPriority': r => r.priority === 'critical' || r.priority === 'high',
  };

  return predefinedConditions[conditionStr]?.(request) ?? true;
}
```

**For SimulationEngine (Aggregate Mode)**:
```typescript
// More complex: need to split traffic at routing points
// and simulate each path separately, then aggregate

simulateWithWeightedRouting(): TestMetrics {
  // Find all routing decision points (nodes with weighted outgoing edges)
  const routingPoints = this.findRoutingPoints();

  if (routingPoints.length === 0) {
    return this.simulateTraffic();
  }

  // For each routing point, split traffic by weights
  // This requires decomposing the graph into multiple sub-paths
  // Each sub-path gets a percentage of traffic
  // Simulate each sub-path independently
  // Combine results

  // This is essentially multiple simulation runs with different traffic volumes
  // Very expensive computationally
}
```

**Backwards Compatibility**:
```typescript
// Old connection (no weight)
{ from: 'lb', to: 'app', type: 'read' }

// Interpreted as weight: 1.0
// If only one connection from 'lb', gets 100% traffic
// If multiple connections without weights, error? equal split? first wins?

// Recommendation: if multiple connections without weights, error with helpful message
```

**Implementation Steps**:
1. Extend Connection interface with weight, condition, priority
2. Add validation: weights must sum to 1.0 (with tolerance)
3. Implement weighted selection for TrafficFlowEngine
4. Implement condition evaluation (safe, no eval)
5. Update request generation to respect weights
6. Update metric aggregation for multiple paths
7. Handle backwards compatibility (missing weights = 1.0)
8. Add graph validation warnings
9. Document predefined conditions
10. Feature flag for backwards compatibility
11. Create examples (canary, A/B test, premium routing)

**Testing**:
- Test weighted distribution accuracy (90/10 should be ±5%)
- Test condition evaluation
- Test priority ordering
- Test with 2, 3, 5 weighted paths
- Test no valid path (all conditions fail)
- Test backwards compatibility
- Verify no traffic loss (all requests routed)
- Performance test (weighted selection overhead)

**Pessimistic Estimate**: 20-26 hours (fundamental routing change)

---

### 3.2 Multi-Region Framework (24-32 hours)

**Priority**: HIGH
**Difficulty**: VERY HIGH
**Files**: Multiple - all components, new `simulation/regions.ts`

**Why This Is Extremely Hard**:

1. **Region Configuration**:
```typescript
// Where does this config live?
// - In component config?
// - In graph config?
// - Global simulation config?

interface RegionalComponentConfig extends ComponentConfig {
  region?: string;  // Which region is this component in?
}

// But then:
// - Load balancer: which region?
// - CDN: multi-region by definition
// - Database: primary region, but replicas in other regions
// - User: request comes from a region (not a component)
```

2. **Cross-Region Latency**:
```typescript
// Realistic AWS cross-region latencies:
const LATENCIES = {
  'us-east-1 -> us-west-2': 70,
  'us-east-1 -> eu-west-1': 85,
  'us-east-1 -> ap-south-1': 220,
  'eu-west-1 -> ap-south-1': 160,
};

// But latency is asymmetric!
// us-east-1 -> eu-west-1: 85ms
// eu-west-1 -> us-east-1: 90ms (different routing)

// Also varies by:
// - Time of day
// - Network congestion
// - Packet loss
// - Number of hops
```

3. **Replication Lag**:
```typescript
// Write to us-east-1 primary
// Async replication to eu-west-1 secondary
// Lag = network latency + processing time

interface ReplicationConfig {
  mode: 'sync' | 'async' | 'semi-sync';
  targets: string[];
}

// Sync: wait for all replicas to acknowledge
// - High latency (network round trip to each replica)
// - Strong consistency

// Async: write returns immediately
// - Low latency
// - Eventual consistency
// - Data loss risk if primary fails

// How to model this in simulation?
```

4. **Conflict Resolution**:
```typescript
// Multi-master setup (writes to any region)
// User A in US writes key X = "foo"
// User B in EU writes key X = "bar"
// Same time, no coordination
// CONFLICT!

// Resolution strategies:
// - Last write wins (timestamps)
// - Vector clocks
// - CRDT
// - Manual resolution

// Conflict rate increases with:
// - Write frequency
// - Number of regions
// - Data access patterns

// How to simulate conflict rate?
const conflictProbability = (writeRps / 10000) * (numRegions - 1) * 0.01;
// This is a rough approximation
```

5. **Region Failover**:
```typescript
// us-east-1 fails
// Traffic reroutes to us-west-2
// Increased latency for US East users
// Reduced capacity (one region down)
// State: is it up-to-date with primary before failure?

// This is disaster recovery modeling
// Very complex
```

**Simplified Implementation (Focus on Latency)**:
```typescript
// simulation/regions.ts
export interface Region {
  id: string;
  name: string;
  location: { lat: number; lon: number };
}

export const AWS_REGIONS: Record<string, Region> = {
  'us-east-1': { id: 'us-east-1', name: 'N. Virginia', location: { lat: 38.13, lon: -78.45 } },
  'us-west-2': { id: 'us-west-2', name: 'Oregon', location: { lat: 46.15, lon: -123.88 } },
  'eu-west-1': { id: 'eu-west-1', name: 'Ireland', location: { lat: 53.35, lon: -6.26 } },
  'ap-south-1': { id: 'ap-south-1', name: 'Mumbai', location: { lat: 19.08, lon: 72.88 } },
};

// Pre-computed latency matrix (ms)
export const REGION_LATENCIES: Record<string, number> = {
  'us-east-1:us-west-2': 70,
  'us-east-1:eu-west-1': 85,
  'us-east-1:ap-south-1': 220,
  'us-west-2:eu-west-1': 140,
  'us-west-2:ap-south-1': 170,
  'eu-west-1:ap-south-1': 160,
  // Reverse directions (slightly different)
  'us-west-2:us-east-1': 72,
  // ... etc
};

export function getCrossRegionLatency(from: string, to: string): number {
  if (from === to) return 0;

  const key = `${from}:${to}`;
  const reverseKey = `${to}:${from}`;

  return REGION_LATENCIES[key] || REGION_LATENCIES[reverseKey] || 100;  // Default 100ms
}

// In Component base class
protected addCrossRegionLatency(
  baseLatency: number,
  fromRegion?: string,
  toRegion?: string
): number {
  if (!fromRegion || !toRegion || fromRegion === toRegion) {
    return baseLatency;
  }

  const crossRegionLatency = getCrossRegionLatency(fromRegion, toRegion);
  return baseLatency + crossRegionLatency;
}
```

**Component Updates**:
```typescript
// Each component needs region awareness
interface ComponentNode {
  id: string;
  type: ComponentType;
  config: ComponentConfig;
  region?: string;  // NEW
}

// In simulation
private simulateConnection(fromComp: Component, toComp: Component): number {
  const baseLatency = toComp.simulate(rps, context).latency;

  if (isEnabled('ENABLE_MULTI_REGION')) {
    const fromRegion = fromComp.config.region;
    const toRegion = toComp.config.region;
    return this.addCrossRegionLatency(baseLatency, fromRegion, toRegion);
  }

  return baseLatency;
}
```

**Replication Modeling (Simplified)**:
```typescript
interface DatabaseConfig extends ComponentConfig {
  region?: string;
  replicaRegions?: string[];
  replicationMode?: 'sync' | 'async';
}

// PostgreSQL with replication
if (config.replicationMode === 'sync' && config.replicaRegions) {
  // Sync replication: add latency for furthest replica
  const maxLatency = Math.max(
    ...config.replicaRegions.map(r => getCrossRegionLatency(config.region, r))
  );
  writeLatency += maxLatency;
} else if (config.replicationMode === 'async') {
  // Async: no added latency, but risk of data loss
  // Track replication lag as metric
  const replicationLag = Math.max(...config.replicaRegions.map(r =>
    getCrossRegionLatency(config.region, r) + 10  // +10ms processing
  ));
  metrics.replicationLagMs = replicationLag;
}
```

**What's NOT Included**:
- User request origin region (assumes requests come from component's region)
- CDN edge location simulation
- Global load balancing decisions
- Region failover simulation
- Compliance/data residency constraints
- Cost differences per region
- Network partition between regions
- Split-brain scenarios

**Implementation Steps**:
1. Create Region type and AWS_REGIONS constant
2. Pre-compute latency matrix
3. Add region field to ComponentNode
4. Update all components to track region
5. Add cross-region latency calculation
6. Update TrafficFlowEngine to add cross-region latency on connections
7. Basic replication lag modeling (async vs sync)
8. Feature flag for backwards compatibility
9. Create examples (US-East + EU-West deployment)
10. Document limitations
11. Skip: conflict resolution, failover, CDN simulation

**Testing**:
- Test cross-region latency calculation
- Test same-region latency (should be 0 added)
- Test with unknown region (should fallback)
- Test replication lag for async
- Test sync replication latency penalty
- Performance test (latency lookup overhead)

**Pessimistic Estimate**: 28-36 hours (even simplified version is significant)

---

### 3.3 Advanced Sharding (12-18 hours)

**Priority**: MEDIUM
**Difficulty**: HIGH
**Files**: Database components, new `simulation/sharding.ts`

**Current Basic Sharding (MongoDB)**:
```typescript
if (this.config.sharded && this.config.numShards) {
  // Just divides capacity
  const shardCapacity = this.config.readCapacity / this.config.numShards;
}
```

**Target: Full Sharding Simulation**:
- Consistent hashing with virtual nodes
- Hot shard detection
- Rebalancing simulation
- Cross-shard queries

Already detailed in Phase 1.2 setup. This phase extends with:

```typescript
// simulation/sharding.ts
class ConsistentHashRing {
  private ring: Array<{ hash: number; shard: string }> = [];
  private virtualNodesPerShard: number = 150;

  constructor(shards: string[]) {
    this.buildRing(shards);
  }

  private buildRing(shards: string[]): void {
    for (const shard of shards) {
      for (let i = 0; i < this.virtualNodesPerShard; i++) {
        const hash = this.hashFn(`${shard}:${i}`);
        this.ring.push({ hash, shard });
      }
    }
    this.ring.sort((a, b) => a.hash - b.hash);
  }

  getShard(key: string): string {
    const keyHash = this.hashFn(key);
    // Binary search for next node
    let left = 0, right = this.ring.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.ring[mid].hash < keyHash) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return this.ring[left % this.ring.length].shard;
  }

  addShard(shard: string): number {
    // Returns percentage of keys that move
    const oldSize = this.ring.length;
    const newVirtualNodes = this.virtualNodesPerShard;
    // Approximately 1/N keys move when adding Nth shard
    return newVirtualNodes / (oldSize + newVirtualNodes);
  }

  removeShard(shard: string): number {
    // Returns percentage of keys that move
    const nodesForShard = this.ring.filter(n => n.shard === shard).length;
    return nodesForShard / this.ring.length;
  }

  private hashFn(key: string): number {
    // MurmurHash3 or similar
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash |= 0;  // 32-bit
    }
    return Math.abs(hash);
  }
}
```

**Pessimistic Estimate**: 14-20 hours

---

## Phase 4: Integration & Polish (20-32 hours)

**Timeline**: Week 21-24
**Goal**: Ensure all features work together, documentation complete
**Impact**: Increases completeness from 85% → 90%
**Risk**: MEDIUM - mostly integration work

### 4.1 Two Simulation Modes Consistency (10-14 hours)

**Critical**: SimulationEngine and TrafficFlowEngine must produce consistent results.

- Both implement retry logic
- Both check circuit breaker state
- Both respect priority
- Both enforce timeout
- Metrics must align

**Implementation**: Shared utility functions, comprehensive integration tests.

### 4.2 Documentation & Examples (8-12 hours)

- Update README with all new features
- Migration guide for breaking changes
- API documentation for new interfaces
- 10+ new example configurations
- Troubleshooting guide
- Performance tuning guide

### 4.3 Cleanup & Refactoring (4-6 hours)

- Remove dead code
- Consistent naming conventions
- Type safety improvements
- Error message improvements

---

## Implementation Priorities

### Priority Matrix (Revised)

| Feature | Impact | Effort | Priority | Phase | Dependencies |
|---------|--------|--------|----------|-------|--------------|
| Snapshot Testing | CRITICAL | 6-8h | 🔴 MANDATORY | 0 | None |
| Performance Benchmarking | HIGH | 3-5h | 🔴 MANDATORY | 0 | None |
| Feature Flags | HIGH | 4-8h | 🔴 MANDATORY | 0 | None |
| Fix Percentiles | CRITICAL | 8-14h | 🔴 CRITICAL | 1 | Phase 0 |
| Multiple Database | CRITICAL | 10-16h | 🔴 CRITICAL | 1 | Phase 0 |
| Cycle Support | CRITICAL | 8-14h | 🔴 CRITICAL | 1 | Phase 0 |
| Load Balancer Config | HIGH | 6-12h | 🟡 HIGH | 1 | Phase 0 |
| Request Priority | HIGH | 6-12h | 🟡 HIGH | 1 | Phase 0 |
| Retry Logic | CRITICAL | 12-22h | 🔴 CRITICAL | 2 | Phase 1 |
| Circuit Breaker | CRITICAL | 12-22h | 🔴 CRITICAL | 2 | Phase 1 |
| Timeout Enforcement | HIGH | 6-12h | 🟡 HIGH | 2 | Phase 1 |
| Enhanced Failures | MEDIUM | 6-14h | 🟢 MEDIUM | 2 | Phase 1 |
| Backpressure | MEDIUM | 10-16h | 🟢 MEDIUM | 2 | Phase 1 |
| Conditional Routing | HIGH | 16-26h | 🟡 HIGH | 3 | Phase 2 |
| Multi-Region | HIGH | 24-36h | 🟡 HIGH | 3 | Phase 2 |
| Advanced Sharding | MEDIUM | 12-20h | 🟢 MEDIUM | 3 | Phase 1 |
| Two Mode Consistency | CRITICAL | 10-14h | 🔴 CRITICAL | 4 | Phase 3 |
| Documentation | HIGH | 8-12h | 🟡 HIGH | 4 | Phase 3 |

### Dependency Graph

```
Phase 0 (Safety Net)
├── 0.1 Snapshot Testing
├── 0.2 Performance Benchmarking
└── 0.3 Feature Flags
    │
    ▼
Phase 1 (Foundation) - All depend on Phase 0
├── 1.1 Fix Percentiles
├── 1.2 Multiple Database ──────┐
├── 1.3 Cycle Support ──────────┤
├── 1.4 Load Balancer Config    │
└── 1.5 Request Priority ───────┤
    │                           │
    ▼                           ▼
Phase 2 (Reliability)           │
├── 2.1 Retry Logic ◄───────────┤
├── 2.2 Circuit Breaker ◄───────┘ (needs cycles)
├── 2.3 Timeout Enforcement
├── 2.4 Enhanced Failures
└── 2.5 Backpressure
    │
    ▼
Phase 3 (Advanced)
├── 3.1 Conditional Routing ◄── Load Balancer Config
├── 3.2 Multi-Region
└── 3.3 Advanced Sharding ◄── Multiple Database
    │
    ▼
Phase 4 (Integration)
├── 4.1 Two Mode Consistency (depends on ALL above)
└── 4.2 Documentation
```

---

## Risk Assessment

### Technical Risks (Revised)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing tests | 95% | HIGH | Phase 0 safety net, feature flags |
| Performance regression | 80% | MEDIUM | Benchmarking, optimization passes |
| Cycles cause infinite loops | 60% | CRITICAL | Hard depth limits, testing |
| Two sim modes diverge | 90% | HIGH | Phase 4 integration, shared utilities |
| Scope creep | 95% | HIGH | Strict phase boundaries, descope aggressively |
| Circuit breaker state management | 70% | HIGH | Simplify to failure injection if too hard |
| Unit confusion (ms vs s) | 90% | MEDIUM | Strict typing, runtime checks |
| Weighted routing accuracy | 60% | MEDIUM | Statistical tests, seeded random |
| Multi-region complexity | 80% | HIGH | Simplify to latency-only first |

### Mitigation Strategies

1. **Phase 0 is Non-Negotiable**: No code changes without safety net
2. **Feature Flags for Everything**: Easy rollback, gradual rollout
3. **Simplify Aggressively**: Option B/C over Option A when in doubt
4. **Descope Early**: Better to ship 70% than fail at 100%
5. **Documentation as You Go**: Don't defer all documentation to end
6. **Regular Integration Tests**: Catch drift between modes early

---

## Success Metrics

### Quantitative Metrics

1. **Completeness Score**:
   - Current: 40% general purpose, 75% basic web
   - Target: 70% general purpose, 90% basic web
   - Measure: Supported patterns checklist

2. **Test Coverage**:
   - Target: >80% for all new code
   - Regression tests for all existing challenges
   - Performance benchmarks tracked

3. **Performance Budget**:
   - Simulation time: <3s for 10,000 requests (allows for larger samples)
   - Memory usage: <150MB per simulation
   - No more than 50% regression from baseline

4. **Accuracy**:
   - Percentile calculations use real distributions
   - Weighted routing within ±2% of specified weights
   - Cross-region latencies match AWS published values ±10%

### Qualitative Metrics

1. **Backwards Compatibility**:
   - All existing configurations still work (with feature flags off)
   - Clear migration path for breaking changes
   - Deprecation warnings, not errors

2. **Educational Value**:
   - Can demonstrate retry with exponential backoff
   - Can show circuit breaker state transitions
   - Can model multi-region latency implications

3. **Maintainability**:
   - Clean separation between features (feature flags)
   - Well-documented code and interfaces
   - Easy to add new components/patterns

---

## Testing Strategy (Detailed)

### Phase 0: Foundation (Must Have)

**Snapshot Tests**:
- Every existing challenge produces consistent results
- Results documented even if incorrect (will update baselines)

**Performance Tests**:
- Baseline measurements for all configurations
- Memory profiling
- Time profiling

### Phase 1: Each Feature

**Percentile Fix**:
- Known distributions (uniform, bimodal, long-tail)
- Verify against statistical calculations
- Sample size edge cases (1000 vs 10000 vs 100000)

**Multiple Database**:
- Single DB (backwards compatible)
- 3, 5, 10 shards
- Uniform vs skewed distributions
- Hot shard detection alerts

**Cycle Support**:
- No cycles (old behavior)
- Simple cycle (A -> B -> A)
- Deep cycle (10 iterations)
- Infinite loop protection
- Performance under cycles

**Load Balancer**:
- Default config matches old behavior
- Each algorithm has measurable effect
- Config validation

**Request Priority**:
- Priority ordering (critical < high < normal < low latency)
- Timeout enforcement
- Unit consistency

### Phase 2: Reliability Patterns

**Retry Logic**:
- Each backoff strategy
- Jitter randomness
- Max attempts respected
- Non-retriable errors
- Timeout during retry
- Performance impact

**Circuit Breaker** (if implemented):
- State transitions
- Failure rate calculation
- Recovery timeout
- Integration with retry

**Timeouts**:
- Request timeout
- Partial timeout
- Unit conversion

### Phase 3: Advanced

**Conditional Routing**:
- Weighted distribution accuracy
- Condition evaluation
- Backwards compatibility
- No traffic loss

**Multi-Region**:
- Cross-region latency
- Replication lag
- Same-region (no penalty)

### Phase 4: Integration

**Two Mode Consistency**:
- Same features enabled in both modes
- Results should be statistically similar
- No drift over time

---

## Minimum Viable Improvement (MVI)

**If you can only do 50-70 hours**:

| Priority | Feature | Hours | Why |
|----------|---------|-------|-----|
| 1 | Phase 0: Safety Net | 16-20h | Cannot proceed safely without this |
| 2 | Fix Percentile Calculation | 10-14h | Current metrics are wrong |
| 3 | Multiple Database Support | 12-16h | Key pattern, enables sharding |
| 4 | Request Priority & Timeout | 8-12h | Foundation for reliability |
| 5 | Feature Flags (included in Phase 0) | - | Already counted |

**MVI Total: 46-62 hours**
**Improvement: 40% → 55% completeness**

**What You Get**:
- Accurate percentile reporting (critical for trust)
- Sharded database support (major pattern)
- Basic priority and timeout (foundation for resilience)
- Safe rollout mechanism (feature flags)
- Regression protection (snapshot tests)

**What You Defer**:
- Retry logic (can simulate manually)
- Circuit breaker (use failure injection)
- Conditional routing (use single paths)
- Multi-region (document as future)

---

## Timeline & Resource Allocation (Pessimistic)

### With 1 Developer (10 hrs/week)

| Phase | Hours | Weeks | Cumulative |
|-------|-------|-------|------------|
| 0: Safety Net | 16-20h | 2 weeks | Week 2 |
| 1: Foundation | 40-68h | 4-7 weeks | Week 9 |
| 2: Reliability | 52-84h | 5-9 weeks | Week 18 |
| 3: Advanced | 68-96h | 7-10 weeks | Week 28 |
| 4: Integration | 32-40h | 3-4 weeks | Week 32 |

**Total: 32 weeks (8 months)** in worst case

### With 2 Developers (40 hrs/week combined)

| Phase | Hours | Weeks | Cumulative |
|-------|-------|-------|------------|
| 0: Safety Net | 20h | 0.5 week | Week 1 |
| 1: Foundation | 68h | 1.7 weeks | Week 3 |
| 2: Reliability | 84h | 2.1 weeks | Week 5 |
| 3: Advanced | 96h | 2.4 weeks | Week 8 |
| 4: Integration | 40h | 1 week | Week 9 |

**Total: 9 weeks (2+ months)** in worst case

### Realistic Single Developer Path

Focus on MVI first, then iterate:

**Month 1-2**: MVI (50-70 hours)
- Safety net, percentiles, multi-DB, priority/timeout

**Month 3-4**: Reliability (30-40 hours)
- Retry logic only (defer circuit breaker)
- Enhanced failures

**Month 5-6**: Selective Advanced (20-30 hours)
- Pick ONE of: routing OR multi-region OR sharding
- Not all three

**Total: 100-140 hours over 6 months**
**Final completeness: 65-70%**

---

## Honest Recommendations

1. **Do Phase 0 First, No Exceptions**: The safety net is not optional. You will break things without it.

2. **Fix Percentiles Before Anything Else**: Users are getting wrong numbers right now. Trust matters.

3. **Consider Deferring Circuit Breaker**: State management is hard. Use failure injection as workaround.

4. **Simplify Multi-Region**: Latency-only model is valuable and achievable. Full replication/conflict resolution is PhD-level distributed systems.

5. **Be Realistic About Timeline**: This is 4-6 months of work, not 2-3. Plan accordingly.

6. **Ship Incrementally**: Don't wait for 90% completeness. Ship MVI, get feedback, iterate.

7. **Documentation Debt is Real**: Budget 10-15% of total time for documentation.

8. **Performance Testing is Critical**: New features add overhead. Monitor constantly.

---

## Conclusion

This pessimistic improvement plan acknowledges the true complexity of enhancing a simulation engine. The original estimates were optimistic because they:
- Ignored the two simulation modes problem
- Underestimated state management challenges
- Assumed features are independent
- Didn't account for integration overhead
- Skipped safety infrastructure

**Reality Check**:
- This is a 4-6 month project, not 2-3 months
- 131-212 hours of development, not 85-95
- Risk of breaking existing functionality is HIGH
- Some features (circuit breaker, multi-region) are architectural changes

**Recommended Approach**:
1. Start with MVI (50-70 hours)
2. Ship when MVI is stable
3. Iterate based on user feedback
4. Defer complex features if timeline is tight

**Final Estimate**:
- Optimistic: 131 hours (3.5 months at 10h/week)
- Realistic: 169 hours (4.5 months)
- Pessimistic: 212 hours (5.5+ months)

Plan for pessimistic, hope for realistic, celebrate if optimistic.

---

**Plan Status**: PESSIMISTIC REVISION v3
**Last Updated**: Based on deep code analysis
**Estimated Total Effort**: 131-212 hours
**Estimated Timeline**: 4-6 months (1 developer) or 6-9 weeks (2 developers)
**Risk Level**: HIGH - architectural changes required
**Target Completeness**: 70-85% (realistic), 90% (optimistic)
