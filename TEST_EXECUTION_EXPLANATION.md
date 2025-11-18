# Test Execution Explanation for Discord

## FR-1: Basic Connectivity Test

### What is FR-1?
**FR-1: Basic Connectivity** is the first functional requirement test case for Discord (and all challenges).

### Test Configuration
```typescript
{
  name: 'FR-1: Basic Connectivity',
  description: 'Verify basic connectivity path exists. Like algorithm brute force: ignore performance, just verify Client → App → Database flow works.',
  traffic: {
    rps: 1,                    // Only 1 request per second (very low)
    readWriteRatio: 0.5,       // 50% reads, 50% writes
    avgFileSize: 0             // No file uploads
  },
  passCriteria: {
    maxLatency: 10000,         // 10 seconds max latency (very generous)
    maxErrorRate: 0             // 0% error rate (must work perfectly)
  }
}
```

### What Does FR-1 Test?

1. **Architecture Validation** (via `validConnectionFlowValidator`):
   - ✅ Must have required components:
     - `compute` (app_server)
     - `storage` (database)
     - `realtime_messaging` (message_queue) - for Discord specifically
   - ✅ Must have required connections:
     - `client → compute`
     - `compute → storage`
     - `compute → realtime_messaging` (for Discord)

2. **Path Finding**:
   - Simulates traffic flow: `client → app_server → database`
   - Verifies a valid path exists from client to database
   - Checks that messages can flow through the system

3. **Traffic Simulation**:
   - Simulates 1 RPS (1 request per second)
   - 50% reads, 50% writes
   - Measures:
     - **Error Rate**: Must be 0% (no errors allowed)
     - **Latency**: Must be < 10 seconds (very generous)
     - **Component Utilization**: Checks if any component is overloaded

4. **Connection Validation**:
   - Validates that Python code API calls match canvas connections
   - For Discord: Checks if code uses `context['db']`, `context['queue']`, etc.
   - Verifies API calls align with component connections

### How Tests Are Executed

#### Step 1: Architecture Validation
```typescript
// Checks if required components exist
mustHave: [
  { type: 'compute', reason: 'Need to process chat messages' },
  { type: 'storage', reason: 'Need to store messages' },
  { type: 'realtime_messaging', reason: 'Need real-time delivery' }
]

// Checks if required connections exist
mustConnect: [
  { from: 'client', to: 'compute' },
  { from: 'compute', to: 'storage' },
  { from: 'compute', to: 'realtime_messaging' }
]
```

#### Step 2: Traffic Simulation
```typescript
// Simulates traffic flow through the system
engine.simulateTraffic(graph, testCase)
// Returns:
// - metrics: { errorRate, p99Latency, throughput, etc. }
// - componentMetrics: { utilization, capacity, etc. }
// - flowViz: visualization of traffic paths
```

#### Step 3: Pass Criteria Check
```typescript
// Checks if metrics meet requirements
checkPassCriteria(metrics, testCase.passCriteria)
// For FR-1:
// - errorRate must be 0
// - p99Latency must be < 10000ms
```

#### Step 4: Python Code Validation (if provided)
```typescript
// Validates Python code matches architecture
// Checks:
// - Connection validation: API calls match canvas connections
// - Schema validation: Database operations match schema
```

### Example: Discord FR-1 Test Flow

1. **User submits solution** with:
   - Components: client, app_server, postgresql, message_queue
   - Connections: client→app_server, app_server→postgresql, app_server→message_queue

2. **Architecture validation**:
   - ✅ Has compute (app_server)
   - ✅ Has storage (postgresql)
   - ✅ Has realtime_messaging (message_queue)
   - ✅ Has client→compute connection
   - ✅ Has compute→storage connection
   - ✅ Has compute→realtime_messaging connection

3. **Traffic simulation**:
   - Simulates 1 RPS (1 request/second)
   - Traffic flows: client → app_server → postgresql
   - Measures: errorRate = 0%, latency = 50ms ✅

4. **Pass criteria check**:
   - errorRate (0%) < maxErrorRate (0%) ✅
   - p99Latency (50ms) < maxLatency (10000ms) ✅

5. **Result**: ✅ **PASSED**

### Why Solutions Look the Same

The issue you're seeing is that **all challenges are getting the same generic solution** because:

1. **Pattern detection isn't working** - The `ProblemDefinition` might not be passed correctly
2. **Solutions are cached** - Old solutions are being reused
3. **Module not reloaded** - Dev server needs restart

### How to Verify Pattern Detection

Check browser console for debug logs:
```
[Solution Generator] Discord - Gaming Chat: Detected patterns: Real-time
[Solution Generator] Facebook - Social Networking Platform: Detected patterns: Social Graph
```

If you don't see these logs, the pattern detection isn't running.

### Expected Discord Solution

Discord should have:
- ✅ `message_queue` component (for real-time messaging)
- ✅ Explanation mentions "⚡ Real-time Pattern"
- ✅ Explanation mentions "Message queue for async message delivery"

If it doesn't have these, the pattern detection failed.

