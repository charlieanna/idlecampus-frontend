# Traffic Simulator - Code Locations for Key Limitations

## 📍 Critical Architectural Decisions (Code References)

### 1. Single Database Assumption
**File**: `src/apps/system-design/builder/simulation/engine.ts`

```typescript
// Line 266-269: SINGLE DATABASE ONLY
const dbId = this.findNodeIdByType('database') ||
  this.findNodeIdByType('postgresql') ||
  this.findNodeIdByType('mongodb') ||
  this.findNodeIdByType('cassandra');
// ↑ Returns FIRST match only

// Line 271-272: Uses that single DB
const db = dbId ? (this.components.get(dbId) as PostgreSQL | MongoDB | Cassandra) : undefined;

// Line 352-353: Routes ALL traffic through single DB
const dbMetrics = db.simulateWithReadWrite(dbReadRps, dbWriteRps, context);
```

**Impact**: Cannot simulate sharded/partitioned systems with multiple databases  
**Workaround**: Would need to change `findNodeIdByType()` to `findNodeIdsByType()` and distribute RPS  
**Effort**: 3-4 hours

---

### 2. Cycle Prevention in Graph Traversal
**File**: `src/apps/system-design/builder/simulation/trafficFlowEngine.ts`

```typescript
// Line 144-154: Explicit cycle prevention
private traverseGraph(
  request: Request,
  currentNodeId: string,
  context: SimulationContext,
  visited: Set<string>
): void {
  // Prevent infinite loops
  if (visited.has(currentNodeId)) {
    return;  // ❌ STOPS HERE - blocks feedback loops
  }
  visited.add(currentNodeId);
  // ... continue traversal
}
```

**Impact**: Cannot model circuit breaker patterns, service mesh loops  
**Workaround**: Add cycle configuration with max depth limit  
**Effort**: 4-5 hours

---

### 3. No Conditional Routing
**File**: `src/apps/system-design/builder/simulation/trafficFlowEngine.ts`

```typescript
// Line 212-221: Always follows ALL valid connections
// For caching layers, might not pass through
if (result.passthrough === false) {
  return; // Cache hit, no need to go to database
}

// Continue to all downstream nodes (typical case)
for (const conn of validConnections) {
  // For database reads, check cache first
  const downstreamComp = this.components.get(conn.to);
  if (downstreamComp) {
    this.traverseGraph(request, conn.to, context, visited);
    // ↑ Follows FIRST valid path only (line 219: break)
    break;
  }
}
```

**Impact**: Cannot model weighted routing, A/B testing, canary deployments  
**Workaround**: Add conditional edges with predicates and weights  
**Effort**: 6-8 hours

---

### 4. Fixed Load Balancer (No Config)
**File**: `src/apps/system-design/builder/simulation/components/LoadBalancer.ts`

```typescript
// ALL hardcoded, no configuration
export class LoadBalancer extends Component {
  private readonly capacity = 100000;  // ❌ Hardcoded
  private readonly baseLatency = 1;     // ❌ Hardcoded
  private readonly monthlyCost = 50;    // ❌ Hardcoded

  constructor(id: string, config = {}) {
    super(id, 'load_balancer', config);  // ❌ Config ignored!
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    // Always round-robin, no other algorithms
    const utilization = rps / this.capacity;
    return {
      latency: this.baseLatency,
      errorRate: 0,
      utilization,
      cost: this.monthlyCost,
    };
  }
}
```

**Impact**: Cannot simulate least_connections, weighted, or ip_hash algorithms  
**Workaround**: Add algorithm config, per-server metrics  
**Effort**: 2-3 hours

---

### 5. Hardcoded Component Types
**File**: `src/apps/system-design/builder/simulation/engine.ts`

```typescript
// Line 42-79: Switch statement with FIXED component types
switch (node.type) {
  case 'client':
    component = new Client(node.id, node.type, node.config);
    break;
  case 'load_balancer':
    component = new LoadBalancer(node.id, node.config);
    break;
  // ... 10 more hardcoded types
  default:
    throw new Error(`Unknown component type: ${node.type}`);  // ❌ No custom types
}
```

**Impact**: Cannot add custom component types without modifying core engine  
**Workaround**: Add component registry, factory pattern  
**Effort**: 2-3 hours

---

### 6. Sample-Based Simulation (Not Full Duration)
**File**: `src/apps/system-design/builder/simulation/trafficFlowEngine.ts`

```typescript
// Line 96-99: Only simulates 1000 requests
const totalRps = testCase.traffic.rps;
const readRatio = testCase.traffic.readRatio || 1;
const sampleSize = Math.min(1000, totalRps * 10);  // ❌ Max 1000 requests

const numReads = Math.floor(sampleSize * readRatio);
const numWrites = sampleSize - numReads;

// Line 119: Extrapolates from sample
const flowViz = this.buildFlowVisualization(requests, totalRps / sampleSize);
```

**Impact**: May miss bursty patterns, tail latencies, queue overflow scenarios  
**Workaround**: Increase sample size or use full simulation  
**Effort**: 2 hours

---

### 7. M/M/1 Queueing Model (Hardcoded)
**File**: `src/apps/system-design/builder/simulation/components/Component.ts`

```typescript
// Line 41-54: ONLY M/M/1 queueing model
protected calculateQueueLatency(
  baseLatency: number,
  utilization: number
): number {
  if (utilization < 0.7) {
    return baseLatency;
  } else if (utilization < 0.9) {
    // M/M/1 queue: latency = base / (1 - utilization)
    return baseLatency / (1 - utilization);  // ❌ Only model
  } else if (utilization < 0.95) {
    return baseLatency * 10;
  } else {
    return baseLatency * 20;
  }
}
```

**Impact**: Assumes exponential inter-arrival times (may not match real workloads)  
**Workaround**: Add pluggable queueing models  
**Effort**: 4-6 hours

---

### 8. No Request Priority Support
**File**: `src/apps/system-design/builder/types/request.ts`

```typescript
// Line 14-27: Request interface
export interface Request {
  id: string;
  type: RequestType;  // ❌ Only 'read' or 'write'
  startTime: number;
  sizeMB?: number;
  
  // ❌ MISSING:
  // priority?: 'high' | 'normal' | 'low';
  // slo?: { maxLatencyMs: number };
  // timeout?: number;
  // correlationId?: string;
  // deadline?: number;
}
```

**Impact**: Cannot simulate SLA-based routing, prioritized queues  
**Workaround**: Add priority field, update simulators  
**Effort**: 3-4 hours

---

## 📊 Hardcoded Values by Component

### AppServer (AppServer.ts)
```typescript
private readonly baseLatency = 10; // ❌ Hardcoded
// Lines 44-46: Uses EC2_INSTANCES lookup for capacity
const capacityPerInstance = instanceSpec.requestsPerSecond;
const costPerInstance = instanceSpec.costPerHour * 730; // Monthly
```

### Redis (RedisCache.ts)
```typescript
private readonly baseLatency = 1;  // ❌ Hardcoded
private capacity = memorySizeGB * 10000; // 10K RPS per GB - ❌ Hardcoded
```

### PostgreSQL (PostgreSQL.ts)
```typescript
private readonly readBaseLatency = 5;   // ❌ Hardcoded
private readonly writeBaseLatency = 50; // ❌ Hardcoded (10x writes)
const readCapacity = baseCapacity;
const writeCapacity = baseCapacity / 10; // ❌ Hardcoded ratio
```

### Cassandra (Cassandra.ts)
```typescript
private readonly baseReadLatency = 3;   // ❌ Hardcoded
private readonly baseWriteLatency = 5;  // ❌ Hardcoded
private readonly baseCost = 200;        // ❌ Hardcoded
```

### MessageQueue (MessageQueue.ts)
```typescript
private readonly baseLatency = 5;              // ❌ Hardcoded
private readonly throughputPerPartition = 10000; // ❌ Hardcoded
private readonly costPerBroker = 100;         // ❌ Hardcoded
```

---

## 🎯 Missing Patterns (Not Implemented Anywhere)

### Circuit Breaker
- **Needed**: New component type or wrapper
- **Where**: `simulation/components/` 
- **Would track**: failure count, state (open/half-open/closed)
- **Would block**: requests when open
- **Effort**: 5-6 hours

### Retry Logic
- **Needed**: Per-component retry config
- **Where**: All components, especially `Component.ts` base class
- **Would track**: retry attempts, backoff strategy
- **Effort**: 8-10 hours

### Multi-Region Support
- **Needed**: Region field on all components
- **Where**: `types/component.ts`, all simulators
- **Would model**: cross-region latency (50-200ms)
- **Would track**: write conflicts, eventual consistency
- **Effort**: 12-15 hours

### Consensus Patterns
- **Needed**: Distributed consensus component
- **Where**: New `simulation/components/Consensus.ts`
- **Would model**: Raft, Paxos, PBFT
- **Effort**: 20-25 hours

### Sharding/Consistent Hashing
- **Needed**: Sharding config on databases
- **Where**: `PostgreSQL.ts`, `MongoDB.ts`, `Cassandra.ts`
- **Would track**: hot shards, distribution skew
- **Effort**: 8-10 hours

---

## 🔍 Advanced Config Exists But Unused

**File**: `src/apps/system-design/builder/types/advancedConfig.ts`

```typescript
// Line 7-14: CacheStrategy defined
export type CacheStrategy =
  | 'cache_aside'
  | 'read_through'
  | 'write_through'
  | 'write_behind'
  | 'write_around';
// ✅ USED by AdvancedRedisCache.ts (lines 79-164)

// Line 31-37: ConsistencyLevel defined
export type ConsistencyLevel =
  | 'strong'
  | 'eventual'
  | 'causal'
  | 'read_your_writes'
  | 'bounded_staleness';
// ✅ USED by MongoDB.ts, Cassandra.ts
// ❌ NOT USED by PostgreSQL.ts, Redis.ts

// Line 107-112: PartitioningStrategy defined
export type PartitioningStrategy =
  | 'hash'
  | 'range'
  | 'list'
  | 'composite'
  | 'geo';
// ❌ NOT USED anywhere (MongoDB has basic sharding only)

// Line 155-158: QueueSemantics defined
export type QueueSemantics =
  | 'at_most_once'
  | 'at_least_once'
  | 'exactly_once';
// ✅ USED by MessageQueue.ts

// Line 176-182: LoadBalancingAlgorithm defined
export type LoadBalancingAlgorithm =
  | 'round_robin'
  | 'least_connections'
  | 'least_response_time'
  | 'ip_hash'
  | 'weighted_round_robin'
  | 'random';
// ❌ NOT USED - LoadBalancer.ts hardcoded to round-robin
```

---

## 📁 Files to Modify for Quick Wins

### 1. LoadBalancer Config (2-3 hours)
**File**: `src/apps/system-design/builder/simulation/components/LoadBalancer.ts`

```typescript
// ADD:
interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'ip_hash';
  weights?: Map<string, number>;
}

// TRACK per server:
interface ServerMetrics {
  activeConnections: number;
  responseTime: number;
}
```

### 2. Request Priority (2-3 hours)
**File**: `src/apps/system-design/builder/types/request.ts`

```typescript
// ADD to Request interface:
priority?: 'high' | 'normal' | 'low';
slo?: { maxLatencyMs: number };
timeout?: number;

// UPDATE components to respect priority in queues
```

### 3. Multiple Databases (3-4 hours)
**File**: `src/apps/system-design/builder/simulation/engine.ts`

```typescript
// CHANGE line 266:
// From: const dbId = this.findNodeIdByType('database');
// To: const dbIds = this.findNodeIdsByType('database');

// DISTRIBUTE RPS across shards
```

### 4. Cycle Support (4-5 hours)
**File**: `src/apps/system-design/builder/simulation/trafficFlowEngine.ts`

```typescript
// ADD to Connection interface:
allowCycle?: boolean;
maxDepth?: number;

// MODIFY traverseGraph to respect these settings
```

---

## 🧪 Test Files That Reveal Limitations

- `src/apps/system-design/builder/__tests__/edgeCases.test.tsx` - Edge case scenarios
- `src/apps/system-design/builder/examples/tinyUrlExample.ts` - Shows only linear topologies
- `src/apps/system-design/builder/__tests__/allChallenges.test.ts` - All challenges tested

---

## Summary Table: Code Locations

| Limitation | File | Lines | Effort to Fix | Difficulty |
|-----------|------|-------|---------------|-----------|
| Single DB | engine.ts | 266-353 | 3-4h | Medium |
| No Cycles | trafficFlowEngine.ts | 144-154 | 4-5h | Medium |
| No Routing Config | trafficFlowEngine.ts | 212-221 | 6-8h | High |
| No LB Config | LoadBalancer.ts | All | 2-3h | Low |
| No Priorities | request.ts | All | 2-3h | Low |
| Hardcoded Types | engine.ts | 42-79 | 2-3h | Low |
| Sample-Based | trafficFlowEngine.ts | 96-119 | 2h | Low |
| M/M/1 Only | Component.ts | 41-54 | 4-6h | Medium |
| No Circuit Breaker | - (new) | - | 5-6h | Medium |
| No Multi-Region | - (new) | - | 12-15h | High |
| No Sharding | - (new) | - | 8-10h | High |
| No Consensus | - (new) | - | 20-25h | Very High |

