# How System Design Validation Works

## Overview

When you design a system and run tests, the validation happens in **4 steps**:

### Step 1: Architecture Validation ✅
Checks if your design has the **required components** and **connections**:
- ✅ Must-have components exist (client, compute, storage, cache, etc.)
- ✅ Required connections exist (client → compute → storage, etc.)

**If this fails**: You'll see hints like "Missing compute: Application servers needed"

### Step 2: Custom Validators ✅
Runs problem-specific validators:
- `basicFunctionalValidator`: Checks basic connectivity (client → compute → storage)
- `validConnectionFlowValidator`: Ensures proper flow (no client → database directly)

**If this fails**: You'll see hints about architecture issues

### Step 3: Performance Simulation 🎯
Simulates traffic through your design:
- Takes each scenario's traffic (RPS, read/write ratio)
- Runs traffic through your components in order
- Calculates: latency, error rate, cost

**If this fails**: Your design doesn't meet performance targets

### Step 4: Pass Criteria Check 📊
Checks if metrics meet the scenario's requirements:
- `maxLatency`: p99 latency must be below this
- `maxErrorRate`: Error rate must be below this (0 = no errors allowed!)
- `maxCost`: Monthly cost must be below this

**If this fails**: You'll see which metric failed (latency, error rate, or cost)

---

## Why 0/22 Tests Pass?

For the "Load Parameters" problem, you have:
- **6 FR tests** (one per userFacingFR) - each requires `maxErrorRate: 0` (perfect!)
- **~16 NFR tests** (performance, scalability, reliability)

### Common Failure Reasons:

1. **Missing Components**: 
   - No cache component (required for this problem)
   - Missing client → compute → storage path

2. **Wrong Connections**:
   - Cache not connected properly (compute → cache → storage)
   - Client connecting directly to database (not allowed)

3. **Performance Issues**:
   - Latency too high (need more app servers or better caching)
   - Error rate > 0 (FR tests require 0% errors!)
   - Cost too high (too many expensive components)

---

## How to Debug

1. **Check Architecture Feedback**: Look for red hints about missing components/connections
2. **Check Test Details**: Click on a failed test to see:
   - Actual latency vs target
   - Actual error rate vs target (0% for FR tests!)
   - Actual cost vs budget
3. **Fix Architecture First**: Add missing components/connections
4. **Then Optimize Performance**: Add more servers, better caching, etc.

---

## Example: What a Passing Design Looks Like

For "Load Parameters" problem, you need:

```
Client → Load Balancer → App Server → Cache → Database
                              ↓
                         (also connects to cache for dashboard)
```

**Components**:
- ✅ Client (for engineers to view dashboards)
- ✅ Load Balancer (optional but recommended)
- ✅ App Server (collects metrics, serves dashboards)
- ✅ Cache (Redis - for fast dashboard loading)
- ✅ Database (stores historical metrics)

**Connections**:
- ✅ Client → App Server
- ✅ App Server → Cache
- ✅ App Server → Database
- ✅ Cache → Database (on cache miss)

**Configuration**:
- App Server: Enough instances to handle 1000 RPS
- Cache: Configured with reasonable TTL
- Database: Configured for read-heavy workload (90% reads)

---

## Key Insight

The **FR tests are very strict** - they require `maxErrorRate: 0`, meaning:
- Your system must handle the traffic with **zero errors**
- If you see any errors, you need more capacity or better architecture

The **NFR tests are more lenient** - they allow some errors (1-5%) but have strict latency requirements.

