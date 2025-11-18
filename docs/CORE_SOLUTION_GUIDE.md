# Universal Solution Fixing Guide

## Overview
This document provides a **systematic guide for fixing solutions** in ANY system design challenge. It explains how to identify and fix common configuration issues, migrate from old formats to new formats, and ensure solutions pass all tests.

**How to Use This Document**:
1. **For AI Agents**: Read this document to understand the correct format and fix solutions automatically
2. **For Developers**: Use this as a reference when creating or updating challenge solutions
3. **For Debugging**: When tests fail, check this document for common issues and fixes

---

## Quick Reference (For AI Agents)

**When fixing a solution, follow these steps**:

1. **Identify old format**: Look for `readCapacity`, `writeCapacity`, `replication: true`, `cacheHitRatio` in configs
2. **Fix database components**:
   - Remove `readCapacity`/`writeCapacity`
   - Add `instanceType: 'commodity-db'`
   - Convert `replication: true` → `replication: { enabled: true, replicas: 1, mode: 'async' }`
   - Add `replicationMode: 'single-leader'` (or appropriate mode)
   - Add `sharding: { enabled: false, shards: 1, shardKey: '' }`
3. **Fix app_server components**:
   - Add `lbStrategy: 'round-robin'` if missing
   - Verify `instances` count is sufficient (RPS / 1000 = minimum)
4. **Fix CDN components**:
   - Remove `cacheHitRatio` and `bandwidthGbps`
   - Keep only `enabled: true`
5. **Verify connections**: Ensure all required connections exist

**Common Issues**:
- `100% error rate` → Old config format or insufficient capacity
- `0/X tests passed` → Run automated fix algorithm
- `Database 1000% util` → Remove explicit capacity, use replication/sharding
- `Connection validation failed` → Add missing connections

---

## Part 1: Configuration Format Migration

### 1.0 How to Identify and Fix Old Config Format

**⚠️ CRITICAL**: All solutions must use the new commodity hardware model. If a solution has explicit `readCapacity`/`writeCapacity` or old-style replication config, it will fail all tests.

#### Step 1: Identify Old Format Patterns

**Look for these patterns in solution configs**:

```typescript
// ❌ OLD FORMAT - These patterns indicate old format
{
  type: 'postgresql', // or 'database'
  config: {
    readCapacity: 500,        // ❌ Explicit capacity
    writeCapacity: 100,       // ❌ Explicit capacity
    replication: true         // ❌ Boolean instead of object
  }
}

{
  type: 'app_server',
  config: {
    instances: 3
    // ❌ Missing lbStrategy (optional but recommended)
  }
}

{
  type: 'cdn',
  config: {
    enabled: true,
    cacheHitRatio: 0.95,     // ❌ CDN has fixed hit ratio
    bandwidthGbps: 100       // ❌ Not used
  }
}
```

#### Step 2: Convert to New Format

**For PostgreSQL/Database components**:
```typescript
// ✅ NEW FORMAT
{
  type: 'postgresql',  // or 'database'
  config: {
    instanceType: 'commodity-db',   // ✅ Always use commodity-db
    replicationMode: 'single-leader', // ✅ Required: 'single-leader' | 'multi-leader' | 'leaderless'
    replication: {
      enabled: true,                 // ✅ Boolean
      replicas: 1,                   // ✅ Number of replicas (NOT total nodes)
      mode: 'async'                  // ✅ 'sync' | 'async'
    },
    sharding: {
      enabled: false,                // ✅ Enable only if needed for write scaling
      shards: 1,                     // ✅ Number of shards
      shardKey: 'user_id'            // ✅ Field name for sharding (challenge-specific)
    }
    // ✅ Capacity is AUTO-CALCULATED from replication + sharding
    // ✅ DO NOT include readCapacity or writeCapacity
  }
}
```

**For App Server components**:
```typescript
// ✅ NEW FORMAT
{
  type: 'app_server',
  config: {
    instances: 3,                    // ✅ Number of instances
    lbStrategy: 'round-robin',      // ✅ Optional but recommended: 'round-robin' | 'least-connections' | 'ip-hash'
    // ✅ instanceType: 'commodity-app' is IMPLICIT (always used)
    // ✅ Capacity: 1000 RPS per instance (fixed)
    // ✅ Cost: $110/month per instance (fixed)
  }
}
```

**For CDN components**:
```typescript
// ✅ NEW FORMAT
{
  type: 'cdn',
  config: {
    enabled: true                   // ✅ Only this is needed
    // ✅ Hit ratio is FIXED at 0.95 (cannot be changed)
    // ✅ DO NOT include cacheHitRatio or bandwidthGbps
  }
}
```

**For Cache components**:
```typescript
// ✅ NEW FORMAT
{
  type: 'cache',
  config: {
    memorySizeGB: 4,                // ✅ Memory size in GB
    hitRatio: 0.9,                  // ✅ 0-1 (typical: 0.85-0.95)
    strategy: 'cache_aside'         // ✅ 'cache_aside' | 'write_through' | 'write_behind'
  }
}
```

#### Step 3: Calculate Required Capacity

**App Server Instances**:
```
instances_needed = ceil(total_rps / 1000)
```
- Each commodity-app instance handles 1000 RPS
- Always round up and add 1-2 for headroom

**Database Read Capacity** (auto-calculated):
```
Single-leader: read_capacity = 1000 * (1 + replicas) * shards
Multi-leader:  read_capacity = 1000 * (1 + replicas) * shards
Leaderless:    read_capacity = 1000 * (1 + replicas) * 0.7 * shards
```

**Database Write Capacity** (auto-calculated):
```
Single-leader: write_capacity = 100 * shards (writes only to leader)
Multi-leader:  write_capacity = 100 * (1 + replicas) * shards
Leaderless:    write_capacity = 100 * (1 + replicas) * 0.7 * shards
```

#### Step 4: Common Fixes Checklist

When fixing a solution, check:

- [ ] **Remove all `readCapacity` and `writeCapacity`** from database configs
- [ ] **Add `instanceType: 'commodity-db'`** to all database configs
- [ ] **Convert `replication: true`** to proper `replication` object with `enabled`, `replicas`, `mode`
- [ ] **Add `replicationMode`** to all database configs (default: 'single-leader')
- [ ] **Add `sharding` object** to all database configs (default: `{ enabled: false, shards: 1, shardKey: '' }`)
- [ ] **Remove `cacheHitRatio` and `bandwidthGbps`** from CDN configs
- [ ] **Add `lbStrategy`** to app_server configs (optional but recommended)
- [ ] **Verify `instances` count** is sufficient for traffic (RPS / 1000 = minimum instances)
- [ ] **Choose appropriate `shardKey`** based on challenge data model (e.g., 'user_id', 'post_id', 'short_code')

#### Step 5: Automated Fix Algorithm

**For AI Agents - Use this algorithm to fix any solution**:

```typescript
function fixSolution(solution: Solution): Solution {
  // 1. Fix all database/postgresql components
  for (const component of solution.components) {
    if (component.type === 'postgresql' || component.type === 'database') {
      const config = component.config || {};

      // Remove old capacity fields
      delete config.readCapacity;
      delete config.writeCapacity;

      // Add required fields
      config.instanceType = 'commodity-db';
      config.replicationMode = config.replicationMode || 'single-leader';

      // Fix replication object
      if (config.replication === true) {
        config.replication = { enabled: true, replicas: 1, mode: 'async' };
      } else if (!config.replication || typeof config.replication !== 'object') {
        config.replication = { enabled: false, replicas: 0, mode: 'async' };
      }

      // Add sharding if missing (use empty shardKey - will be set based on challenge)
      if (!config.sharding) {
        config.sharding = { enabled: false, shards: 1, shardKey: '' };
      }
    }

    // 2. Fix app_server components
    if (component.type === 'app_server') {
      const config = component.config || {};
      // lbStrategy is optional, but add default if missing
      if (!config.lbStrategy) {
        config.lbStrategy = 'round-robin';
      }
      // instanceType is implicit (commodity-app), don't need to set it
    }

    // 3. Fix CDN components
    if (component.type === 'cdn') {
      const config = component.config || {};
      // Remove invalid fields
      delete config.cacheHitRatio;
      delete config.bandwidthGbps;
      // Only keep enabled
      config.enabled = config.enabled !== false;
    }

    // 4. Fix cache components
    if (component.type === 'cache') {
      const config = component.config || {};
      // Ensure required fields exist
      if (!config.memorySizeGB) {
        config.memorySizeGB = 4; // Default to 4GB
      }
      if (!config.hitRatio) {
        config.hitRatio = 0.9; // Default to 90% hit ratio
      }
      if (!config.strategy) {
        config.strategy = 'cache_aside'; // Default strategy
      }
    }
  }

  return solution;
}
```

---

## Part 2: Common Error Patterns and Fixes

**When tests fail with 100% error rate or 0/X tests passed, check these**:

### Error Pattern 1: Database 100% Utilization
**Symptoms**: `Database: 1000.0% util, 100.0% errors`

**Cause**: Old format with explicit `readCapacity`/`writeCapacity` that overrides replication/sharding calculation

**Fix**:
1. Remove `readCapacity` and `writeCapacity` from database config
2. Add `instanceType: 'commodity-db'`
3. Add proper `replicationMode` and `replication` object
4. Add `sharding` object if needed for write scaling

### Error Pattern 2: App Server 100% Utilization
**Symptoms**: `app_server: 1 instances, 1100 RPS/instance, 220.0% util, 100.0% errors`

**Cause**: Insufficient instances for traffic

**Fix**:
1. Calculate: `instances_needed = ceil(total_rps / 1000)`
2. Add headroom: `instances = instances_needed + 1-2`
3. Update `instances` in app_server config

### Error Pattern 3: All Tests Fail Immediately
**Symptoms**: `0/X Tests Passed` with no detailed metrics

**Cause**: Old config format preventing simulation from running

**Fix**:
1. Run the automated fix algorithm (Step 5)
2. Check all database components have `instanceType: 'commodity-db'`
3. Check all CDN components only have `enabled: true`

### Error Pattern 4: Connection Validation Fails
**Symptoms**: `❌ Connection validation failed`

**Cause**: Missing required connections

**Fix**:
1. Review challenge requirements to identify required components
2. Ensure proper connection flow (typically: `client → [load_balancer →] app_server → [cache →] database`)
3. Common required connections:
   - `client → load_balancer` or `client → app_server`
   - `load_balancer → app_server` (if load balancer present)
   - `app_server → database` (if database needed)
   - `app_server → cache` (if cache needed)
   - `app_server → s3` or `app_server → object_storage` (if file storage needed)
   - `client → cdn` and `cdn → s3`/`cdn → object_storage` (if CDN used)

### Error Pattern 5: Schema Validation Fails
**Symptoms**: `❌ Schema validation failed: Field 'X' not found in schema`

**Cause**: Python code uses `context['X']` which is an API client, not a schema field

**Fix**: This is usually a false positive - schema validator should ignore API clients. Check if validator is updated.

---

## Part 3: Capacity Planning Guidelines

### 3.1 Determining Replication Strategy

**Single-Leader Replication**:
- **Use when**: Read-heavy workload, simple consistency model
- **Pros**: Simple, strong consistency for writes
- **Cons**: Write bottleneck (single leader)
- **Capacity**: Read scales with replicas, writes limited to leader (100 RPS)
- **Examples**: User profiles, product catalogs, reference data

**Multi-Leader Replication**:
- **Use when**: Write-heavy workload, multi-region deployment
- **Pros**: Writes scale with leaders, high write throughput
- **Cons**: Conflict resolution complexity, higher latency
- **Latency penalty**: 1.5x (adds 20-50ms for conflict resolution)
- **Examples**: Collaborative editing, multi-region systems, high write traffic

**Leaderless (Quorum) Replication**:
- **Use when**: High availability critical, eventual consistency acceptable
- **Pros**: No single point of failure, fault tolerant
- **Cons**: More complex, quorum coordination overhead
- **Latency penalty**: 1.3x (adds ~30% for quorum coordination)
- **Examples**: Shopping carts, session data, eventually consistent systems

### 3.2 Determining Sharding Strategy

**Enable sharding when**:
- Write traffic exceeds 100 RPS (single leader limit)
- Need to distribute data across multiple nodes
- Dataset is too large for single node

**Sharding calculation**:
```
shards_needed = ceil(write_rps / 100)  // for single-leader
shards_needed = ceil(write_rps / (100 * (1 + replicas)))  // for multi-leader
```

**Common shard keys by challenge type**:
- **User-centric systems**: `user_id` (Instagram, Facebook, Twitter)
- **URL shorteners**: `short_code` or hash of URL
- **E-commerce**: `order_id` or `user_id`
- **Content platforms**: `post_id` or `content_id`
- **Time-series**: `timestamp` or time-based ranges
- **Geographic**: `region` or `location_id`

### 3.3 Cache Strategy Selection

**Cache-Aside (Lazy Loading)**:
- **Use when**: Read-heavy, unpredictable access patterns
- **How it works**: Read from cache first, load from DB on miss
- **Pros**: Only cache requested data, DB is fallback
- **Cons**: Cache miss penalty, potential stampede
- **Examples**: User profiles, post metadata, product details

**Write-Through**:
- **Use when**: Strong consistency required, read-heavy
- **How it works**: Write to cache AND database synchronously
- **Pros**: Cache always consistent, fast reads
- **Cons**: Write latency increases, cache unused data
- **Examples**: Like counts, follower counts, inventory levels

**Write-Behind (Write-Back)**:
- **Use when**: High write traffic, eventual consistency OK
- **How it works**: Write to cache, async persist to DB
- **Pros**: Very fast writes, batching reduces DB load
- **Cons**: Risk of data loss, eventual consistency
- **Examples**: View counts, analytics events, metrics

### 3.4 Cost Optimization Guidelines

**Monthly Cost Breakdown**:
```
App Servers:  instances * $110/month
Cache:        memory_size_gb * $50/month
Database:     base_cost * (1 + replicas) * shards + storage_cost
              base_cost = $146/month
              storage_cost = storage_gb * $0.115/month
CDN:          $200/month (fixed)
S3/Object Storage: $100/month (fixed)
Load Balancer: $50/month (fixed)
```

**Cost Optimization Strategies**:
1. **Right-size app servers**: Use minimum instances for RPS (don't over-provision)
2. **Optimize cache hit ratio**: 95% hit ratio reduces DB load significantly
3. **Use read replicas before sharding**: Cheaper than sharding for read-heavy workloads
4. **Disable sharding if not needed**: Each shard multiplies cost
5. **Use async replication**: Cheaper than sync, acceptable for most use cases

---

## Part 4: Solution Design Workflow

### 4.1 Step-by-Step Process

1. **Analyze Challenge Requirements**
   - Read functional requirements (what system must do)
   - Identify peak traffic scenarios (RPS, read/write ratio)
   - Note latency constraints (p99 < Xms)
   - Check budget constraints (e.g., < $2000/month)
   - Identify failure scenarios (DB crash, cache flush, etc.)

2. **Design Base Architecture**
   - Start with client → app_server → database
   - Add load_balancer if multiple app servers
   - Add cache if read-heavy (hit ratio > 80%)
   - Add CDN if serving static content (images, videos)
   - Add object_storage (S3) if storing large files
   - Add message_queue if async processing needed

3. **Size Components for Peak Load**
   - Calculate app server instances: `peak_rps / 1000`
   - Calculate database capacity: account for cache misses
   - Calculate cache size: based on working set + headroom
   - Choose replication mode based on workload (read vs write heavy)
   - Enable sharding if write RPS > 100

4. **Add High Availability**
   - Enable database replication for failover (at least 1 replica)
   - Add app server redundancy (minimum 2 instances)
   - Configure load balancer for distribution
   - Set up async replication (cheaper, usually sufficient)

5. **Optimize for Edge Cases**
   - Add more shards for write spikes
   - Configure appropriate replication mode
   - Set cache strategy (cache-aside, write-through, write-behind)
   - Increase cache size for high hit ratio

6. **Validate Against All Tests**
   - Run all test cases
   - Check each pass criteria
   - Verify budget constraint
   - Look for bottlenecks (>95% utilization)

7. **Optimize Cost**
   - Reduce over-provisioning where possible
   - Balance performance vs cost
   - Consider test-case-specific solutions for cost-sensitive tests

### 4.2 Solution Template Structure

```typescript
{
  components: [
    { type: 'client', config: {} },
    { type: 'load_balancer', config: {} },
    { type: 'app_server', config: {
      instances: X,                  // Calculate based on peak RPS
      lbStrategy: 'least-connections' // or 'round-robin', 'ip-hash'
    }},
    { type: 'cache', config: {
      memorySizeGB: X,               // Based on working set
      hitRatio: 0.9,                 // Typical: 0.9-0.95
      strategy: 'cache_aside'        // or 'write_through', 'write_behind'
    }},
    { type: 'database', config: {
      instanceType: 'commodity-db',  // Fixed
      replicationMode: 'single-leader', // or 'multi-leader', 'leaderless'
      replication: {
        enabled: true,
        replicas: X,                 // Number of replicas
        mode: 'async'                // or 'sync'
      },
      sharding: {
        enabled: false,              // Enable if write RPS > 100
        shards: X,                   // Number of shards
        shardKey: 'user_id'          // Challenge-specific
      }
    }},
    // Optional components based on challenge:
    { type: 'cdn', config: { enabled: true }},
    { type: 's3', config: {}},
    { type: 'object_storage', config: {}}
  ],
  connections: [
    { from: 'client', to: 'load_balancer' },
    { from: 'load_balancer', to: 'app_server' },
    { from: 'app_server', to: 'cache' },
    { from: 'app_server', to: 'database' },
    // Add other connections based on components
  ]
}
```

---

## Part 5: Quick Reference Tables

### 5.1 Capacity Formulas

| Component | Formula |
|-----------|---------|
| App Server Instances | `ceil(total_rps / 1000)` |
| Database Read (Single-Leader) | `1000 * (1 + replicas) * shards` |
| Database Read (Multi-Leader) | `1000 * (1 + replicas) * shards` |
| Database Read (Leaderless) | `1000 * (1 + replicas) * 0.7 * shards` |
| Database Write (Single-Leader) | `100 * shards` |
| Database Write (Multi-Leader) | `100 * (1 + replicas) * shards` |
| Database Write (Leaderless) | `100 * (1 + replicas) * 0.7 * shards` |
| Cache Size | `working_set_gb * 2 / hit_ratio` |
| Shards Needed (Single-Leader) | `ceil(write_rps / 100)` |
| Shards Needed (Multi-Leader) | `ceil(write_rps / (100 * (1 + replicas)))` |

### 5.2 Cost Reference

| Component | Cost Formula |
|-----------|--------------|
| App Server | `instances * $110/month` |
| Cache | `memory_size_gb * $50/month` |
| Database | `$146 * (1 + replicas) * shards + storage_gb * $0.115` |
| CDN | `$200/month` (fixed) |
| S3/Object Storage | `$100/month` (fixed) |
| Load Balancer | `$50/month` (fixed) |

### 5.3 Latency Multipliers

| Replication Mode | Multiplier | Additional Latency |
|------------------|------------|-------------------|
| Single-Leader | 1.0x | Baseline (no penalty) |
| Multi-Leader | 1.5x | +20-50ms (conflict resolution) |
| Leaderless | 1.3x | +30% (quorum coordination) |
| Sharding | 1.1x | +10% (routing overhead) |

### 5.4 When to Use Each Replication Mode

| Replication Mode | Use When | Avoid When |
|------------------|----------|------------|
| Single-Leader | Read-heavy, simple consistency | Write-heavy workload (>100 write RPS) |
| Multi-Leader | Write-heavy, multi-region | Strong consistency required |
| Leaderless | High availability critical | Low latency critical |

### 5.5 Cache Strategy Selection

| Strategy | Use When | Avoid When |
|----------|----------|------------|
| Cache-Aside | Read-heavy, unpredictable access | Strong consistency required |
| Write-Through | Strong consistency required | High write traffic |
| Write-Behind | High write traffic, eventual consistency OK | Data loss unacceptable |

---

## Part 6: Troubleshooting Flowchart

```
Test failing?
├─ 100% error rate?
│  ├─ Check: Old config format? → Run automated fix algorithm
│  ├─ Check: Component >100% util? → Increase capacity (instances/replicas/shards)
│  └─ Check: Missing connections? → Add required connections
│
├─ High latency (>pass criteria)?
│  ├─ Check: Cache hit ratio < 80%? → Increase cache size or improve strategy
│  ├─ Check: Database overloaded? → Add replicas or sharding
│  └─ Check: Too many hops? → Optimize connection flow
│
├─ Low availability (<99%)?
│  ├─ Check: Replication disabled? → Enable replication with replicas >= 1
│  └─ Check: Single point of failure? → Add redundancy
│
└─ Over budget?
   ├─ Check: Too many instances? → Right-size for actual RPS
   ├─ Check: Too many shards? → Disable sharding if write RPS < 100
   └─ Check: Over-provisioned cache? → Reduce cache size
```

---

## Conclusion

This guide provides a universal framework for:
1. **Fixing solutions**: Migrate from old to new config format
2. **Capacity planning**: Calculate instances, replicas, shards
3. **Troubleshooting**: Identify and fix common error patterns
4. **Optimization**: Balance performance, availability, and cost

For challenge-specific guidance (recommended shard keys, architectural patterns, etc.), refer to the challenge-specific solution guides in `docs/challenges/<challenge-name>/`.
