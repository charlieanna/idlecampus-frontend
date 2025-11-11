# System Design Builder - Simulation Engine

## Overview

This is the simulation engine for the System Design Builder MVP. It allows users to design systems visually and run simulations to validate their designs against test cases.

## Architecture

```
simulation/
├── components/          # Component implementations
│   ├── Component.ts     # Base class
│   ├── LoadBalancer.ts  # Load balancer
│   ├── AppServer.ts     # Application server
│   ├── PostgreSQL.ts    # Database
│   ├── RedisCache.ts    # Cache
│   ├── CDN.ts           # Content delivery network
│   └── S3.ts            # Object storage
├── engine.ts            # Main simulation engine
└── testRunner.ts        # Test execution & evaluation

types/
├── component.ts         # Component types
├── graph.ts             # Graph types
└── testCase.ts          # Test case types

examples/
├── tinyUrlExample.ts    # Challenge 1: Tiny URL (caching)
├── foodBlogExample.ts   # Challenge 2: Food Blog (CDN)
├── todoAppExample.ts    # Challenge 3: Todo App (replication)
└── runAllExamples.ts    # Run all 3 challenges
```

## Components

### 1. Load Balancer
- **Capacity**: 100,000 RPS (effectively unlimited)
- **Latency**: 1ms (constant)
- **Cost**: $50/month (flat)

### 2. App Server
- **Capacity**: 1,000 RPS per instance
- **Latency**: 10ms (baseline), increases with utilization
- **Cost**: $100/month per instance
- **Config**: `instances` (number of servers)

### 3. PostgreSQL
- **Capacity**: Configurable read/write ops/sec
- **Latency**: 5ms (reads), 50ms (writes)
- **Cost**: $0.0001 per read, $0.001 per write
- **Config**: `readCapacity`, `writeCapacity`, `replication`

### 4. Redis Cache
- **Capacity**: 10,000 RPS per GB
- **Latency**: 1ms (constant)
- **Cost**: $50/GB/month
- **Config**: `memorySizeGB`, `ttl`, `hitRatio`

### 5. CDN
- **Hit Ratio**: 95% (fixed in MVP)
- **Latency**: 5ms (edge hit), 50ms (origin miss)
- **Cost**: $0.01 per GB transferred

### 6. S3
- **Latency**: 100ms (constant)
- **Cost**: Storage + requests + transfer
- **Config**: `storageSizeGB`

## Usage

### Run All Examples

```typescript
import { runAllExamples } from './examples/runAllExamples';

// Runs all 3 challenges and shows results
runAllExamples();
```

### Run Individual Examples

```typescript
// Challenge 1: Tiny URL (Caching)
import { runTinyUrlExample } from './examples/tinyUrlExample';
runTinyUrlExample();

// Challenge 2: Food Blog (CDN)
import { runFoodBlogExample } from './examples/foodBlogExample';
runFoodBlogExample();

// Challenge 3: Todo App (Replication)
import { runTodoAppExample } from './examples/todoAppExample';
runTodoAppExample();
```

### Run Tests

```bash
# Run all tests
npm test -- src/apps/system-design/builder/__tests__/

# Run individual challenge tests
npm test -- src/apps/system-design/builder/__tests__/tinyUrl.test.ts
npm test -- src/apps/system-design/builder/__tests__/foodBlog.test.ts
npm test -- src/apps/system-design/builder/__tests__/todoApp.test.ts
```

### Create a Custom Design

```typescript
import { SystemGraph } from './types/graph';
import { TestCase } from './types/testCase';
import { TestRunner } from './simulation/testRunner';

const myDesign: SystemGraph = {
  components: [
    { id: 'lb', type: 'load_balancer', config: {} },
    { id: 'app', type: 'app_server', config: { instances: 2 } },
    { id: 'db', type: 'postgresql', config: {
      readCapacity: 1000,
      writeCapacity: 500
    }}
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'db', type: 'read_write' }
  ]
};

const testCase: TestCase = {
  name: 'Load Test',
  traffic: {
    type: 'mixed',
    rps: 500,
    readRatio: 0.8
  },
  duration: 60,
  passCriteria: {
    maxP99Latency: 100,
    maxErrorRate: 0.01
  }
};

const runner = new TestRunner();
const result = runner.runTestCase(myDesign, testCase);

console.log(result.explanation);
```

## Simulation Model

### Latency Calculation

Uses M/M/1 queueing theory approximation:

```
if utilization < 0.7:
  latency = base_latency
elif utilization < 0.9:
  latency = base_latency / (1 - utilization)  # Queue builds up
else:
  latency = base_latency * 10  # Severely degraded
```

### Error Rate

```
if utilization < 0.95:
  error_rate = 0
else:
  error_rate = (utilization - 0.95) / 0.05  # Linear 0 to 100%
```

### Cost Calculation

Monthly cost = component-specific formula (see individual components)

## Examples: All 3 MVP Challenges

### Challenge 1: Tiny URL (Beginner - Caching)

**Good Design:**
```
Load Balancer → App Servers (2) → Redis (90% hit) → PostgreSQL
```

**Results** (Normal Load):
- ✅ p99 Latency: ~18ms
- ✅ Error Rate: 0%
- ✅ Cost: ~$736/month
- ✅ DB Utilization: 10% (cache absorbs 90%)

**Bad Design:**
```
Load Balancer → App Server (1) → PostgreSQL (no cache)
```

**Results** (Read Spike - 5x traffic):
- ❌ p99 Latency: ~500ms
- ❌ Error Rate: 45%
- ❌ DB Utilization: 1000% (completely overloaded)

**💡 Key Learning:** Caching is critical for read-heavy workloads!

---

### Challenge 2: Food Blog (Beginner+ - CDN)

**Good Design:**
```
App + Redis + PostgreSQL (for HTML)
CDN → S3 (for images)
```

**Results** (Normal Load):
- ✅ p99 Latency: ~25ms (CDN serves images at 5ms)
- ✅ Cost: ~$180/month (CDN caching reduces bandwidth)

**Bad Design:**
```
App Servers (5 instances) serving images directly
```

**Results**:
- ⚠️ Works but extremely expensive
- ❌ Cost: $500+/month (bandwidth from app servers)
- ⚠️ High app server utilization

**💡 Key Learning:** CDN dramatically reduces cost and latency for static content!

---

### Challenge 3: Todo App (Intermediate - Replication)

**Good Design:**
```
App Servers (2) → Redis (sessions) → PostgreSQL (with replication)
```

**Results** (DB Failure Test):
- ✅ Availability: 95%+ (minimal downtime during failover)
- ✅ Passes all tests

**Bad Design:**
```
App Server (1) → PostgreSQL (no replication)
```

**Results** (DB Failure Test):
- ❌ Availability: 50% (60s downtime out of 120s)
- ❌ Complete outage during DB crash

**💡 Key Learning:** Replication is essential for high availability (99.9%+)!

## Validation

Simulation results have been validated against:
- ✅ Real-world system benchmarks (Redis, PostgreSQL latencies)
- ✅ AWS pricing (costs are realistic)
- ✅ Queueing theory (M/M/1 model)
- ✅ Manual calculations (Tiny URL example)

**Accuracy**: Good enough for teaching concepts, not production prediction.

## Known Limitations

1. **Simplified models**: Real systems more complex
2. **No network effects**: Ignores packet loss, jitter
3. **Deterministic**: No randomness
4. **Single datacenter**: No multi-region
5. **Fixed topology**: Assumes web app pattern

These are acceptable for MVP teaching tool!

## Next Steps

- [x] Add Food Blog and Todo App examples ✅
- [x] Add unit tests for all 3 challenges ✅
- [ ] Build UI for visual design (reactflow canvas)
- [ ] Connect UI to simulation engine
- [ ] User testing with 5 people
- [ ] Add more challenges (TicketMaster, Chat, etc.)

## References

- M/M/1 Queue: https://en.wikipedia.org/wiki/M/M/1_queue
- AWS Pricing: https://aws.amazon.com/pricing/
- PostgreSQL Benchmarks: Various sources
- Redis Benchmarks: redis.io
