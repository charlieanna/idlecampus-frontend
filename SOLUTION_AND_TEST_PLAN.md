# Solution Design & Test Expansion Plan

## Overview
This document provides a **systematic guide for fixing solutions** in any system design challenge. It explains how to identify and fix common configuration issues, migrate from old formats to new formats, and ensure solutions pass all tests.

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
5. **Verify connections**: Ensure all required connections exist (see Error Pattern 4)

**Common Issues**:
- `100% error rate` → Old config format or insufficient capacity
- `0/22 tests passed` → Run automated fix algorithm
- `Database 1000% util` → Remove explicit capacity, use replication/sharding
- `Connection validation failed` → Add missing connections

---

## Part 1: Solution Fixing Guide

### 1.0 How to Identify and Fix Old Config Format

**⚠️ CRITICAL**: All solutions must use the new commodity hardware model. If a solution has explicit `readCapacity`/`writeCapacity` or old-style replication config, it will fail all tests.

#### Step 1: Identify Old Format Patterns

**Look for these patterns in solution configs**:
```typescript
// ❌ OLD FORMAT - These patterns indicate old format
{
  type: 'postgresql',
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
      shardKey: 'short_code'         // ✅ Field name for sharding
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
      
      // Add sharding if missing
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
  }
  
  return solution;
}
```

---

### 1.1 Common Error Patterns and Fixes

**When tests fail with 100% error rate or 0/22 tests passed, check these**:

#### Error Pattern 1: Database 100% Utilization
**Symptoms**: `Database: 1000.0% util, 100.0% errors`

**Cause**: Old format with explicit `readCapacity`/`writeCapacity` that overrides replication/sharding calculation

**Fix**:
1. Remove `readCapacity` and `writeCapacity` from database config
2. Add `instanceType: 'commodity-db'`
3. Add proper `replicationMode` and `replication` object
4. Add `sharding` object if needed for write scaling

#### Error Pattern 2: App Server 100% Utilization
**Symptoms**: `app_server: 1 instances, 1100 RPS/instance, 220.0% util, 100.0% errors`

**Cause**: Insufficient instances for traffic

**Fix**:
1. Calculate: `instances_needed = ceil(total_rps / 1000)`
2. Add headroom: `instances = instances_needed + 1-2`
3. Update `instances` in app_server config

#### Error Pattern 3: All Tests Fail Immediately
**Symptoms**: `0/22 Tests Passed` with no detailed metrics

**Cause**: Old config format preventing simulation from running

**Fix**:
1. Run the automated fix algorithm (Step 5)
2. Check all database components have `instanceType: 'commodity-db'`
3. Check all CDN components only have `enabled: true`

#### Error Pattern 4: Connection Validation Fails
**Symptoms**: `❌ Connection validation failed`

**Cause**: Missing required connections (e.g., `app_server → database`, `app_server → cache`)

**Fix**:
1. Ensure `client → load_balancer` or `client → app_server`
2. Ensure `load_balancer → app_server` (if load balancer present)
3. Ensure `app_server → database` (if database needed)
4. Ensure `app_server → cache` (if cache needed)
5. Ensure `app_server → s3` (if S3 needed for images)
6. Ensure `client → cdn` and `cdn → s3` (if CDN used)

#### Error Pattern 5: Schema Validation Fails
**Symptoms**: `❌ Schema validation failed: Field 'db' not found in schema`

**Cause**: Python code uses `context['db']` which is an API client, not a schema field

**Fix**: This is usually a false positive - schema validator should ignore API clients. Check if validator is updated.

---

### 1.3 Solution Architecture Patterns (Examples)

#### Challenge-Level Solution (Passes ALL Tests)
**Goal**: Single solution that handles all scenarios including edge cases and spikes.

**Architecture**:
```
Client → Load Balancer → App Server (6 instances) → Cache (6GB) → Database (Multi-leader + 4 shards)
```

**Key Configuration**:
- **App Servers**: 6 instances, least-connections LB strategy
  - Capacity: 6,000 RPS total (1,000 RPS per instance)
  - Handles: Read Spike (5,100 RPS) with headroom
  
- **Cache**: 6GB memory, 95% hit ratio, cache-aside strategy
  - Reduces database load during read spikes
  - Handles cache flush scenarios
  
- **Database**: Multi-leader replication + 4 shards
  - Replication: 3 leaders total (1 primary + 2 replicas)
  - Sharding: 4 shards for write scaling
  - Capacity: 12,000 read RPS, 1,200 write RPS
  - Handles: Write Spike (1,000 write RPS), Database Failure (replication)

**Cost**: ~$1,790/month (within $2,000 budget)

**Trade-offs**:
- Over-provisioned for normal load (1100 RPS)
- Higher latency for writes (multi-leader adds 20-50ms)
- Higher cost due to sharding

---

#### Test-Case-Specific Solutions (Optimized per Scenario)

**1. Normal Load (NFR-P1)**
- **App Servers**: 2 instances (1,100 RPS / 1,000 = 1.1 → need 2)
- **Cache**: 4GB, 90% hit ratio
- **Database**: Single-leader, no sharding
- **Cost**: ~$366/month (well under $500 if it had a budget)

**2. Read Spike (5x) (NFR-S1)**
- **App Servers**: 6 instances (5,100 RPS / 1,000 = 5.1 → need 6)
- **Cache**: 8GB, 95% hit ratio (critical for read spikes)
- **Database**: Single-leader with 2 read replicas
- **Cost**: ~$1,168/month

**3. Write Spike (10x) (NFR-S2)**
- **App Servers**: 5 instances (2,000 RPS / 1,000 = 2 → need 5 for headroom)
- **Cache**: 4GB, 90% hit ratio
- **Database**: Multi-leader (3 leaders) + 4 shards
- **Capacity**: 1,200 write RPS (300 × 4 shards)
- **Cost**: ~$1,168/month
- **Latency**: ~400-500ms p99 (acceptable for write-heavy workloads)

**4. Cache Flush (NFR-R1)**
- **App Servers**: 2 instances
- **Cache**: 4GB, 90% hit ratio (will rebuild after flush)
- **Database**: Single-leader with 1 read replica
- **Capacity**: 2,000 read RPS (handles cache misses during rebuild)
- **Cost**: ~$366/month

**5. Database Failure (NFR-R2)**
- **App Servers**: 2 instances
- **Cache**: 4GB, 90% hit ratio
- **Database**: Single-leader with 1 replica (enables failover)
- **Failover**: Automatic within 5 seconds
- **Cost**: ~$292/month

---

### 1.4 Solution Design Checklist

When creating a solution, ensure:

- [ ] **Capacity Planning**
  - [ ] App servers sized for peak traffic (RPS / 1000 = instances needed)
  - [ ] Database read capacity accounts for cache misses
  - [ ] Database write capacity handles write spikes
  - [ ] All components have <95% utilization

- [ ] **High Availability**
  - [ ] Database replication enabled for failover scenarios
  - [ ] App server redundancy (multiple instances)
  - [ ] Load balancer distributes traffic

- [ ] **Performance**
  - [ ] Cache configured for read-heavy workloads
  - [ ] Replication mode matches workload (single-leader for reads, multi-leader for writes)
  - [ ] Sharding enabled for write scaling when needed

- [ ] **Cost Optimization**
  - [ ] Challenge-level budget: $2,000/month (infrastructure cost only, excludes CDN/S3)
  - [ ] ⚠️ Individual tests do NOT have cost constraints
  - [ ] Cost validation only happens at challenge level
  - [ ] Test-case-specific solutions can be more cost-effective for reference, but not required

---

## Part 2: Test Coverage Analysis

### 2.1 Current Test Coverage

#### Functional Requirements (FR) - ✅ Complete
- ✅ FR-1: Basic Connectivity
- ✅ FR-2: URL Uniqueness
- ✅ FR-3: Correct Redirects
- ✅ FR-4: App Server Restart (Persistence)

#### Performance Requirements (NFR-P) - ✅ Complete
- ✅ NFR-P1: Normal Load (1,100 RPS)
- ✅ NFR-P2: Peak Hour Load (2,200 RPS)

#### Scalability Requirements (NFR-S) - ✅ Complete
- ✅ NFR-S1: Read Spike (5x) - 5,100 RPS
- ✅ NFR-S2: Write Spike (10x) - 2,000 RPS (1,000 writes)
- ✅ NFR-S3: Sustained High Load (3,300 RPS)

#### Reliability Requirements (NFR-R) - ✅ Complete
- ✅ NFR-R1: Cache Flush
- ✅ NFR-R2: Database Failure
- ✅ NFR-R3: Network Partition

#### Cost Requirements (NFR-C) - ✅ Complete
- ✅ NFR-C1: Cost Optimization

#### Caching Strategy Tests - ✅ Complete
- ✅ CACHE-1: Cache-Aside Strategy
- ✅ CACHE-2: Write-Through Strategy
- ✅ CACHE-3: Cache Stampede

#### Replication Mode Tests - ✅ Complete
- ✅ REP-1: Single-Leader Replication
- ✅ REP-2: Multi-Leader Replication
- ✅ REP-3: Leaderless (Quorum) Replication

#### Sharding Tests - ✅ Complete
- ✅ SHARD-1: Horizontal Sharding

#### L6 Tests - ✅ Complete
- ✅ NFR-L6: Various latency and failure scenarios

---

### 2.2 Missing Test Cases (Recommended Additions)

#### 2.2.1 Data Consistency Tests

**CONSISTENCY-1: Concurrent Writes to Same URL**
- **Scenario**: Multiple users try to create short URL for same long URL simultaneously
- **Traffic**: 100 concurrent writes to same URL
- **Pass Criteria**:
  - No duplicate short codes generated
  - All requests succeed (idempotency)
  - Same short code returned for same long URL
- **Tests**: Idempotency, race condition handling

**CONSISTENCY-2: Read-Your-Writes Consistency**
- **Scenario**: User creates short URL, immediately reads it back
- **Traffic**: Write followed by immediate read
- **Pass Criteria**:
  - Read returns correct URL (no stale data)
  - Latency < 50ms for read-after-write
- **Tests**: Cache invalidation, replication lag

**CONSISTENCY-3: Cross-Shard Transactions**
- **Scenario**: Operations that span multiple shards
- **Traffic**: Mixed reads/writes across shards
- **Pass Criteria**:
  - No data loss
  - Consistent results
- **Tests**: Distributed transaction handling

---

#### 2.2.2 Rate Limiting & Abuse Prevention

**RATE-LIMIT-1: Per-User Rate Limiting**
- **Scenario**: Single user makes excessive requests
- **Traffic**: 1,000 RPS from single IP
- **Pass Criteria**:
  - Rate limiting kicks in (429 errors)
  - System doesn't crash
  - Legitimate users unaffected
- **Tests**: Rate limiting, abuse detection

**RATE-LIMIT-2: Distributed Rate Limiting**
- **Scenario**: Multiple app servers, shared rate limit
- **Traffic**: Distributed requests across servers
- **Pass Criteria**:
  - Consistent rate limiting across servers
  - No bypass via server switching
- **Tests**: Distributed coordination

---

#### 2.2.3 Geographic Distribution

**GEO-1: Multi-Region Deployment**
- **Scenario**: System deployed across regions
- **Traffic**: Requests from different regions
- **Pass Criteria**:
  - Low latency for regional users
  - Data consistency across regions
  - Failover between regions
- **Tests**: CDN effectiveness, regional routing

**GEO-2: Data Locality**
- **Scenario**: Users access data from nearest region
- **Traffic**: Geographic distribution
- **Pass Criteria**:
  - p99 latency < 100ms for regional users
  - Cross-region replication works
- **Tests**: CDN, edge caching

---

#### 2.2.4 Analytics & Monitoring

**ANALYTICS-1: Click Tracking**
- **Scenario**: Track number of clicks per short URL
- **Traffic**: 1,000 reads/sec with analytics
- **Pass Criteria**:
  - Analytics don't impact redirect latency
  - Click counts are accurate
  - Analytics data persists
- **Tests**: Async processing, data accuracy

**ANALYTICS-2: Real-Time Metrics**
- **Scenario**: Monitor system health in real-time
- **Traffic**: Normal load + metrics collection
- **Pass Criteria**:
  - Metrics collection overhead < 1%
  - Real-time dashboards update
- **Tests**: Observability, performance impact

---

#### 2.2.5 Custom URLs & User Features

**FEATURE-1: Custom Short Codes**
- **Scenario**: Users specify their own short codes
- **Traffic**: Mix of custom and auto-generated codes
- **Pass Criteria**:
  - Custom codes are unique
  - Validation prevents invalid codes
  - No conflicts with auto-generated codes
- **Tests**: Validation, uniqueness, conflict resolution

**FEATURE-2: URL Expiration**
- **Scenario**: Short URLs expire after TTL
- **Traffic**: Mix of expired and active URLs
- **Pass Criteria**:
  - Expired URLs return 404
  - Active URLs work correctly
  - TTL enforcement is accurate
- **Tests**: TTL handling, expiration logic

**FEATURE-3: User Authentication**
- **Scenario**: Users can manage their own URLs
- **Traffic**: Authenticated requests
- **Pass Criteria**:
  - Users can only access their own URLs
  - Authentication doesn't impact performance
  - Session management works
- **Tests**: Security, access control

---

#### 2.2.6 Advanced Failure Scenarios

**FAILURE-1: Partial Shard Failure**
- **Scenario**: One shard fails, others continue
- **Traffic**: Normal load, 1 shard down
- **Pass Criteria**:
  - System continues operating
  - Failed shard traffic rerouted
  - Data on failed shard recoverable
- **Tests**: Shard isolation, failover

**FAILURE-2: Cache Cluster Failure**
- **Scenario**: Entire cache cluster fails
- **Traffic**: Normal load, cache unavailable
- **Pass Criteria**:
  - System degrades gracefully
  - Database handles full load
  - Cache recovery works
- **Tests**: Graceful degradation, recovery

**FAILURE-3: Load Balancer Failure**
- **Scenario**: Primary load balancer fails
- **Traffic**: Normal load, LB failover
- **Pass Criteria**:
  - Failover < 10 seconds
  - No data loss
  - Traffic continues
- **Tests**: High availability, failover

**FAILURE-4: Cascading Failures**
- **Scenario**: Multiple components fail in sequence
- **Traffic**: Normal load, cascading failures
- **Pass Criteria**:
  - System doesn't completely collapse
  - Partial functionality maintained
  - Recovery possible
- **Tests**: Resilience, circuit breakers

---

#### 2.2.7 Data Migration & Backward Compatibility

**MIGRATION-1: Schema Evolution**
- **Scenario**: Database schema changes
- **Traffic**: Normal load during migration
- **Pass Criteria**:
  - Zero downtime migration
  - Backward compatibility maintained
  - No data loss
- **Tests**: Migration strategy, compatibility

**MIGRATION-2: Shard Rebalancing**
- **Scenario**: Redistribute data across shards
- **Traffic**: Normal load during rebalancing
- **Pass Criteria**:
  - Rebalancing doesn't impact performance
  - Data integrity maintained
  - No downtime
- **Tests**: Rebalancing algorithm, data integrity

---

#### 2.2.8 Security & Compliance

**SECURITY-1: SQL Injection Prevention**
- **Scenario**: Malicious input in URL parameters
- **Traffic**: Normal load + malicious requests
- **Pass Criteria**:
  - SQL injection attempts blocked
  - System remains secure
  - Legitimate requests unaffected
- **Tests**: Input validation, security

**SECURITY-2: DDoS Mitigation**
- **Scenario**: Distributed denial of service attack
- **Traffic**: 10,000 RPS from botnet
- **Pass Criteria**:
  - Legitimate users can still access
  - System doesn't crash
  - Attack traffic filtered
- **Tests**: DDoS protection, rate limiting

**SECURITY-3: Data Encryption**
- **Scenario**: Data encrypted at rest and in transit
- **Traffic**: Normal load
- **Pass Criteria**:
  - Encryption doesn't impact performance significantly
  - Data is encrypted
  - Keys managed securely
- **Tests**: Encryption, key management

---

#### 2.2.9 Performance Edge Cases

**PERF-1: Very Long URLs**
- **Scenario**: URLs exceeding typical length
- **Traffic**: Mix of normal and very long URLs
- **Pass Criteria**:
  - Very long URLs handled correctly
  - No performance degradation
  - Storage efficient
- **Tests**: Edge cases, performance

**PERF-2: Unicode & Special Characters**
- **Scenario**: URLs with Unicode, emojis, special chars
- **Traffic**: Mix of ASCII and Unicode URLs
- **Pass Criteria**:
  - All characters handled correctly
  - Encoding preserved
  - No corruption
- **Tests**: Encoding, character handling

**PERF-3: Concurrent Redirects**
- **Scenario**: Same short URL accessed by thousands simultaneously
- **Traffic**: 10,000 concurrent reads for same URL
- **Pass Criteria**:
  - All requests succeed
  - Low latency maintained
  - Cache handles spike
- **Tests**: Hot key handling, cache effectiveness

---

#### 2.2.10 Cost Optimization Tests

**COST-1: Auto-Scaling**
- **Scenario**: Traffic varies throughout day
- **Traffic**: Variable load (low → high → low)
- **Pass Criteria**:
  - System scales up/down automatically
  - Cost optimized for actual usage
  - Performance maintained
- **Tests**: Auto-scaling, cost efficiency

**COST-2: Reserved vs On-Demand**
- **Scenario**: Mix of reserved and on-demand instances
- **Traffic**: Normal load
- **Pass Criteria**:
  - Cost reduced with reservations
  - Performance maintained
- **Tests**: Cost optimization strategies

---

## Part 3: Solution Creation Workflow

### 3.1 Step-by-Step Solution Design Process

1. **Analyze Test Requirements**
   - Read all test cases
   - Identify peak traffic scenarios
   - Identify failure scenarios
   - Note latency and cost constraints

2. **Design Base Architecture**
   - Start with minimal viable architecture
   - Add components incrementally
   - Ensure all required components present

3. **Size Components for Peak Load**
   - Calculate app server instances: `peak_rps / 1000 = instances`
   - Calculate database capacity: account for cache misses
   - Calculate cache size: based on working set

4. **Add High Availability**
   - Enable database replication for failover
   - Add app server redundancy
   - Configure load balancer

5. **Optimize for Edge Cases**
   - Add sharding for write spikes
   - Configure appropriate replication mode
   - Set cache strategy

6. **Validate Against All Tests**
   - Run all test cases
   - Check each pass criteria
   - Verify budget constraint

7. **Optimize Cost**
   - Challenge-level budget: $2,000/month (infrastructure cost only)
   - ⚠️ Individual tests do NOT check cost - only challenge-level budget is validated
   - Reduce over-provisioning where possible
   - Test-case-specific solutions can be more cost-effective for reference
   - Balance performance vs cost at challenge level

---

### 3.2 Solution Template Structure

```typescript
{
  components: [
    { type: 'client', config: {} },
    { type: 'load_balancer', config: {} },
    { type: 'app_server', config: { 
      instances: X, // Calculate based on peak RPS
      lbStrategy: 'least-connections' // or 'round-robin', 'ip-hash'
    }},
    { type: 'cache', config: { 
      memorySizeGB: X, // Based on working set
      hitRatio: 0.9, // Typical: 0.9-0.95
      strategy: 'cache_aside' // or 'write_through', 'write_behind'
    }},
    { type: 'database', config: { 
      instanceType: 'commodity-db', // Fixed
      replicationMode: 'single-leader' | 'multi-leader' | 'leaderless',
      replication: { 
        enabled: true/false,
        replicas: X, // Number of replicas
        mode: 'async' | 'sync'
      },
      sharding: { 
        enabled: true/false,
        shards: X, // Number of shards
        shardKey: 'short_code' // Shard key field
      }
    }}
  ],
  connections: [
    { from: 'client', to: 'load_balancer' },
    { from: 'load_balancer', to: 'app_server' },
    { from: 'app_server', to: 'cache' },
    { from: 'app_server', to: 'database' }
  ]
}
```

---

## Part 4: Test Creation Guidelines

### 4.1 Test Case Structure

```typescript
{
  name: 'Test Name',
  type: 'functional' | 'performance' | 'scalability' | 'reliability' | 'caching' | 'consistency' | 'security',
  requirement: 'TEST-ID', // e.g., 'CONSISTENCY-1'
  description: 'Clear description of what is being tested',
  traffic: {
    type: 'read' | 'write' | 'mixed',
    rps: number, // Total RPS
    readRps?: number, // Read RPS (if mixed)
    writeRps?: number, // Write RPS (if mixed)
    readRatio?: number, // Read ratio (if mixed, alternative to readRps/writeRps)
  },
  duration: number, // Test duration in seconds
  failureInjection?: { // Optional
    type: 'db_crash' | 'cache_flush' | 'network_partition' | 'shard_failure',
    atSecond: number, // When failure occurs
    recoverySecond?: number, // When recovery happens
  },
  passCriteria: {
    maxP99Latency?: number, // Maximum p99 latency in ms
    maxErrorRate?: number, // Maximum error rate (0-1)
    minAvailability?: number, // Minimum availability (0-1)
    // ⚠️ DO NOT use maxMonthlyCost in individual test cases
    // Cost validation only happens at challenge-level budget
    // Individual tests should focus on performance, reliability, scalability
  },
  solution?: { // Optional: reference solution
    components: [...],
    connections: [...],
    explanation: '...'
  }
}
```

---

### 4.2 Test Naming Conventions

- **Functional**: `FR-X` (e.g., `FR-1`, `FR-2`)
- **Performance**: `NFR-PX` (e.g., `NFR-P1`, `NFR-P2`)
- **Scalability**: `NFR-SX` (e.g., `NFR-S1`, `NFR-S2`)
- **Reliability**: `NFR-RX` (e.g., `NFR-R1`, `NFR-R2`)
- **Cost**: `NFR-CX` (e.g., `NFR-C1`)
- **Caching**: `CACHE-X` (e.g., `CACHE-1`, `CACHE-2`)
- **Replication**: `REP-X` (e.g., `REP-1`, `REP-2`)
- **Sharding**: `SHARD-X` (e.g., `SHARD-1`)
- **Consistency**: `CONSISTENCY-X` (e.g., `CONSISTENCY-1`)
- **Rate Limiting**: `RATE-LIMIT-X` (e.g., `RATE-LIMIT-1`)
- **Geographic**: `GEO-X` (e.g., `GEO-1`)
- **Analytics**: `ANALYTICS-X` (e.g., `ANALYTICS-1`)
- **Features**: `FEATURE-X` (e.g., `FEATURE-1`)
- **Failure**: `FAILURE-X` (e.g., `FAILURE-1`)
- **Migration**: `MIGRATION-X` (e.g., `MIGRATION-1`)
- **Security**: `SECURITY-X` (e.g., `SECURITY-1`)
- **Performance**: `PERF-X` (e.g., `PERF-1`)
- **Cost**: `COST-X` (e.g., `COST-1`)

---

### 4.3 Test Priority Matrix

| Priority | Test Type | Impact | Effort |
|----------|-----------|--------|--------|
| **P0 (Critical)** | Functional, Basic Performance | High | Low |
| **P1 (High)** | Scalability, Reliability | High | Medium |
| **P2 (Medium)** | Caching, Replication, Sharding | Medium | Medium |
| **P3 (Low)** | Analytics, Custom Features | Low | High |

**Recommended Implementation Order**:
1. P0 tests (already complete)
2. P1 tests (already complete)
3. P2 tests (already complete)
4. P3 tests (add incrementally)

---

## Part 5: Implementation Checklist

### 5.1 For Each New Test Case

- [ ] Define test case structure
- [ ] Set realistic traffic patterns
- [ ] Define pass criteria
- [ ] Create reference solution (if applicable)
- [ ] Add to `tinyUrl.ts` testCases array
- [ ] Update challenge-level solution if needed
- [ ] Test the test case
- [ ] Document in this plan

### 5.2 For Each Solution

- [ ] Calculate component sizing
- [ ] Configure replication/sharding
- [ ] Set cache strategy
- [ ] Verify all connections present
- [ ] Test against all relevant test cases
- [ ] Verify cost within budget
- [ ] Document trade-offs

---

## Part 6: Best Practices

### 6.1 Solution Design Principles

1. **Start Simple, Scale Up**
   - Begin with minimal architecture
   - Add complexity only when needed
   - Optimize for common case first

2. **Design for Failure**
   - Always include redundancy
   - Plan for component failures
   - Test failure scenarios

3. **Measure, Don't Guess**
   - Calculate capacity requirements
   - Use real metrics (RPS, latency)
   - Validate assumptions

4. **Cost-Aware Design**
   - Balance performance vs cost
   - Use test-case-specific solutions
   - Optimize for actual usage patterns

### 6.2 Test Design Principles

1. **Realistic Scenarios**
   - Base tests on real-world patterns
   - Use realistic traffic distributions
   - Include edge cases

2. **Clear Pass Criteria**
   - Specific, measurable criteria
   - Realistic thresholds
   - Test-specific where appropriate

3. **Progressive Difficulty**
   - Start with basic functionality
   - Add complexity incrementally
   - Build on previous tests

4. **Comprehensive Coverage**
   - Test all components
   - Test all failure modes
   - Test all scaling mechanisms

---

## Part 7: Quick Reference

### 7.1 Capacity Calculation Formulas

**App Server Instances**:
```
instances = ceil(total_rps / 1000)
```

**Database Read Capacity**:
```
read_capacity = base_read * (1 + replicas) * shards
```

**Database Write Capacity**:
- Single-leader: `write_capacity = base_write` (writes only to leader)
- Multi-leader: `write_capacity = base_write * (1 + replicas) * shards`
- Leaderless: `write_capacity = base_write * (1 + replicas) * 0.7 * shards`

**Cache Size**:
```
cache_size_gb = (working_set_gb * 2) / hit_ratio
```

### 7.2 Cost Calculation

**App Servers**:
```
cost = instances * $110/month
```

**Cache**:
```
cost = memory_size_gb * $50/month
```

**Database**:
```
cost = base_cost * (1 + replicas) * shards + storage_cost
base_cost = $146/month
storage_cost = storage_gb * $0.115/month
```

### 7.3 Latency Multipliers

- **Single-leader**: 1.0x (no additional latency)
- **Multi-leader**: 1.5x (+20-50ms for conflict resolution)
- **Leaderless**: 1.3x (+30% for quorum coordination)
- **Sharding**: 1.1x (+10% for routing overhead)

---

## Part 8: Next Steps

### Immediate Actions
1. ✅ Verify all current tests pass with challenge-level solution
2. ✅ Document solution design patterns
3. ⏳ Add missing test cases incrementally
4. ⏳ Create test-case-specific solutions for cost optimization

### Short-term (1-2 weeks)
1. Implement P2 priority tests (Consistency, Rate Limiting)
2. Add geographic distribution tests
3. Create solutions for new test cases

### Medium-term (1 month)
1. Implement P3 priority tests (Analytics, Custom Features)
2. Add security and compliance tests
3. Expand failure scenario coverage

### Long-term (2-3 months)
1. Add advanced migration tests
2. Implement cost optimization tests
3. Create comprehensive test suite documentation

---

## Appendix: Example Test Case Implementation

```typescript
{
  name: 'Concurrent Writes to Same URL',
  type: 'consistency',
  requirement: 'CONSISTENCY-1',
  description: 'Multiple users try to create short URL for same long URL simultaneously. System must ensure idempotency and prevent duplicate codes.',
  traffic: {
    type: 'write',
    rps: 100, // 100 concurrent writes to same URL
  },
  duration: 10,
  passCriteria: {
    maxErrorRate: 0.01, // 1% errors allowed
    // Custom validation: All requests return same short code
    idempotency: true, // Custom validator
  },
  solution: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 2 } },
      { type: 'database', config: { 
        instanceType: 'commodity-db',
        replicationMode: 'single-leader',
        replication: { enabled: false, replicas: 0, mode: 'async' },
        sharding: { enabled: false, shards: 1, shardKey: '' },
      } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
    explanation: `This solution handles concurrent writes to the same URL:

**Key Design**:
- Database with unique constraint on long_url prevents duplicates
- Transaction isolation ensures atomicity
- Idempotency: Same long URL always returns same short code

**How it works**:
1. Multiple requests arrive simultaneously
2. Database transaction ensures only one write succeeds
3. Subsequent writes return existing short code (idempotent)
4. No duplicate codes generated`,
  },
}
```

---

## Conclusion

This plan provides a comprehensive framework for:
1. Creating solutions that pass all tests
2. Expanding test coverage systematically
3. Maintaining quality and consistency

Follow the guidelines and checklists to ensure robust solution design and comprehensive test coverage.

