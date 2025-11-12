# System Design Course - Implementation Plan

**Last Updated:** 2025-11-12
**Status:** Phase 1 Complete - 40 Challenges with Level 1 Connectivity Tests
**Next Phase:** Add progressive optimization levels (Levels 2-5)

---

## Executive Summary

This document outlines the complete implementation of an interactive system design course platform. The platform teaches students how to design scalable systems using **real AWS instance types** and follows an **algorithm-style progression** from brute force to optimized solutions.

### Core Philosophy: Algorithm-Style Learning

Just like algorithm problems start with brute force before optimization, our system design challenges follow this progression:

1. **Level 1 (Brute Force)**: Does it even work? - Just verify connectivity
2. **Level 2 (Basic Optimization)**: Handle real load - Capacity planning
3. **Level 3 (Better Optimization)**: Scale efficiently - Add caching/optimization
4. **Level 4 (Edge Cases)**: Handle failures - Add redundancy
5. **Level 5 (Optimal Solution)**: Balance cost vs performance - Find the sweet spot

---

## Phase 1: Complete ✅

### 40 System Design Challenges Created

All challenges currently have **ONLY Level 1** implemented. This ensures the foundation works before adding complexity.

#### Level 1 Specifications (All Challenges)

```typescript
{
  name: 'Level 1: The Brute Force Test - Does It Even Work?',
  description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
  traffic: {
    rps: 0.1,  // Nearly zero traffic - just checking connectivity
    readWriteRatio: 0.5,
  },
  passCriteria: {
    maxLatency: 30000,  // 30 seconds - we don't care about speed
    maxErrorRate: 0.99, // 99% errors allowed - just need ONE request to work
  },
}
```

**Goal**: Students just need to wire up components correctly. No performance tuning required.

### Challenge Categories

#### Social Media (10 Challenges)
1. **Instagram** - Photo sharing with S3 storage
2. **Twitter** - Microblogging with high write volume
3. **Reddit** - Discussion forums with nested comments
4. **LinkedIn** - Professional networking
5. **Facebook** - Social networking with media
6. **TikTok** - Short video platform
7. **Pinterest** - Visual bookmarking
8. **Snapchat** - Ephemeral messaging
9. **Discord** - Gaming chat with WebSockets
10. **Medium** - Blogging platform

#### E-commerce & Services (5 Challenges)
11. **Amazon** - E-commerce marketplace
12. **Shopify** - Multi-tenant e-commerce platform
13. **Stripe** - Payment processing
14. **Uber** - Ride-sharing with geospatial queries
15. **Airbnb** - Vacation rentals with location search

#### Streaming & Media (5 Challenges)
16. **Netflix** - Video streaming (large files)
17. **Spotify** - Music streaming
18. **YouTube** - Video sharing with uploads
19. **Twitch** - Live streaming with WebSockets
20. **Hulu** - TV streaming with DVR

#### Messaging (4 Challenges)
21. **WhatsApp** - End-to-end encrypted messaging
22. **Slack** - Team collaboration
23. **Telegram** - Cloud messaging with bots
24. **Messenger** - Cross-device sync messaging

#### Infrastructure (5 Challenges)
25. **Pastebin** - Text sharing (simple URL shortener variant)
26. **Dropbox** - File sync and storage
27. **Google Drive** - Collaborative cloud storage
28. **GitHub** - Code hosting with git operations
29. **Stack Overflow** - Q&A platform with voting

#### Food & Delivery (3 Challenges)
30. **DoorDash** - Food delivery with driver matching
31. **Instacart** - Grocery delivery
32. **Yelp** - Business reviews with location search

#### Productivity (4 Challenges)
33. **Notion** - Collaborative workspace with real-time sync
34. **Trello** - Project management with boards
35. **Google Calendar** - Event management
36. **Zoom** - Video conferencing

#### Gaming & Other (4 Challenges)
37. **Steam** - Gaming platform with large downloads
38. **Ticketmaster** - Event ticketing with high concurrency
39. **Booking.com** - Hotel reservations
40. **Weather API** - High-read weather data service

---

## Architecture Overview

### 1. Real AWS Instance Types (Not Abstract Numbers)

**Key Innovation**: Instead of "capacity: 1000", we use actual AWS instances:

```typescript
// OLD APPROACH (abstract)
appServer: { capacity: 1000 }

// NEW APPROACH (real instances)
appServer: {
  instanceType: 'c5.xlarge',  // 4 vCPU, 8GB RAM
  // System calculates:
  // - RPS capacity from instance specs
  // - Monthly cost from AWS pricing
  // - Latency from CPU/memory
}
```

#### Instance Type Libraries

**EC2 Instances** (`src/apps/system-design/builder/data/ec2Instances.ts`):
- T3 (Burstable): t3.micro, t3.small, t3.medium, t3.large
- C5 (Compute): c5.large, c5.xlarge, c5.2xlarge, c5.4xlarge
- M5 (General): m5.large, m5.xlarge, m5.2xlarge, m5.4xlarge
- R5 (Memory): r5.large, r5.xlarge, r5.2xlarge

Each instance includes:
- vCPU count
- RAM (GB)
- Network performance
- Monthly cost
- RPS capacity (calculated from specs)

**RDS Instances** (`src/apps/system-design/builder/data/rdsInstances.ts`):
- T3 (Dev): db.t3.micro, db.t3.small, db.t3.medium
- M5 (Production): db.m5.large, db.m5.xlarge, db.m5.2xlarge
- R5 (Memory-intensive): db.r5.large, db.r5.xlarge, db.r5.2xlarge

**ElastiCache Redis** (`src/apps/system-design/builder/data/redisInstances.ts`):
- T3 (Dev): cache.t3.micro, cache.t3.small, cache.t3.medium
- M5 (Production): cache.m5.large, cache.m5.xlarge
- R5 (Large cache): cache.r5.large, cache.r5.xlarge

### 2. Visual Schema Editor

**Location**: `src/apps/system-design/builder/ui/components/SchemaEditor.tsx`

Replaces multi-step wizard with visual table/column builder following UI spec wireframes.

**Features**:
- **Quick Templates**: E-commerce, Social Media, TinyURL pre-built schemas
- **Visual Table Builder**: Expandable tables with column editor
- **SQL Data Types**: INT, BIGINT, VARCHAR(255), TEXT, TIMESTAMP, ENUM, JSON, etc.
- **Column Constraints**: NOT NULL, UNIQUE, PK, AUTO_INCREMENT, FK
- **Access Patterns**: Read-Heavy (10:1), Write-Heavy (1:10), Balanced (1:1), High-Contention
- **Auto-detect Relationships**: FK constraints automatically create ER diagram relationships
- **Export DDL**: Generate CREATE TABLE statements

**Example Usage**:
```typescript
<SchemaEditor
  database="TinyURL Database"
  dbType="PostgreSQL"
  initialSchema={currentConfig.schema}
  onSchemaChange={(schema) => setCurrentConfig({ ...currentConfig, schema })}
/>
```

### 3. Component Simulators (Real Instance Behavior)

Each component simulates real AWS behavior:

#### App Server (`src/apps/system-design/builder/simulation/components/AppServer.ts`)
```typescript
const instance = EC2_INSTANCES[config.instanceType];
const capacity = instance.rpsCapacity * config.instances;
const cpuUsage = rps / capacity;
const latency = BASE_LATENCY + (cpuUsage > 0.7 ? (cpuUsage - 0.7) * 200 : 0);
const cost = instance.monthlyCost * config.instances;
```

#### PostgreSQL Database (`src/apps/system-design/builder/simulation/components/PostgreSQL.ts`)
```typescript
const instance = RDS_INSTANCES[config.instanceType];
const readCapacity = instance.rpsCapacity;
const writeCapacity = instance.rpsCapacity * 0.3; // Writes are slower

// With replication
if (config.replication?.enabled) {
  const replicas = config.replication.replicas || 0;
  const effectiveReadCapacity = readCapacity * (1 + replicas * 0.8);
  // Sync replication adds latency
  if (config.replication.mode === 'sync') {
    baseLatency *= 10; // Synchronous replication is much slower
  }
}
```

#### Redis Cache (`src/apps/system-design/builder/simulation/components/RedisCache.ts`)
```typescript
const instance = REDIS_INSTANCES[config.instanceType];
const hitRatio = config.hitRatio || 0.9;
const cacheHits = readRequests * hitRatio;
const cacheMisses = readRequests * (1 - hitRatio);

// Cache eviction policy affects hit ratio
if (config.evictionPolicy === 'lru' && memoryUsage > 0.9) {
  effectiveHitRatio *= 0.7; // LRU struggles when memory full
}
```

### 4. Generic Validation Engine

**Location**: `src/apps/system-design/builder/validation/validators/commonValidators.ts`

Reusable validators across all challenges:

```typescript
// Checks Client → App → Database connection exists
export const validConnectionFlowValidator: ValidatorFunction = (graph, scenario) => {
  const hasCompute = graph.components.some(c => c.type === 'compute');
  const hasStorage = graph.components.some(c => c.type === 'storage');
  const hasClientToCompute = graph.connections.some(
    conn => conn.from === 'client' && conn.to.type === 'compute'
  );
  const hasComputeToStorage = graph.connections.some(
    conn => conn.from.type === 'compute' && conn.to.type === 'storage'
  );

  if (!hasClientToCompute || !hasComputeToStorage) {
    return {
      valid: false,
      hint: 'Client must connect to App Server, App Server must connect to Database',
    };
  }

  return { valid: true };
};

// Checks if cache is needed for read-heavy workloads
export const cacheForReadHeavyValidator: ValidatorFunction = (graph, scenario) => {
  const readWriteRatio = scenario.traffic.readWriteRatio || 0.5;
  const hasCache = graph.components.some(c => c.type === 'cache');

  if (readWriteRatio > 0.8 && !hasCache && scenario.traffic.rps > 100) {
    return {
      valid: false,
      hint: 'This is a read-heavy workload (90% reads). Add a cache to handle high read traffic.',
    };
  }

  return { valid: true };
};
```

---

## Component Configuration UI

### Inline Configuration Modal (Not Wizard)

**Example from TinyURL Challenge** (`src/apps/system-design/builder/pages/TinyUrlChallenge.tsx`):

All configuration visible on one scrollable page:

```typescript
<div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
  {/* Instance Type Dropdown */}
  <div>
    <label>Instance Type</label>
    <select value={currentConfig.instanceType}>
      <optgroup label="T3 - Dev/Testing">
        <option value="db.t3.micro">db.t3.micro - 2 vCPU, 1GB RAM, 50 RPS ($13/mo)</option>
        <option value="db.t3.small">db.t3.small - 2 vCPU, 2GB RAM, 100 RPS ($26/mo)</option>
      </optgroup>
      <optgroup label="M5 - Production">
        <option value="db.m5.large">db.m5.large - 2 vCPU, 8GB RAM, 500 RPS ($133/mo)</option>
      </optgroup>
    </select>
  </div>

  {/* Technology Decisions */}
  <div>
    <label>Isolation Level</label>
    <select value={currentConfig.isolationLevel}>
      <option value="read-committed">Read Committed (Default)</option>
      <option value="serializable">Serializable (Slower, more consistent)</option>
    </select>
  </div>

  {/* Replication */}
  <div>
    <label>
      <input type="checkbox" checked={currentConfig.replication?.enabled} />
      Enable Replication
    </label>
    {currentConfig.replication?.enabled && (
      <>
        <input type="number" value={currentConfig.replication?.replicas} />
        <select value={currentConfig.replication?.mode}>
          <option value="async">Async (Fast, eventual consistency)</option>
          <option value="sync">Sync (10x slower, strong consistency)</option>
        </select>
      </>
    )}
  </div>

  {/* Schema Editor Embedded */}
  <div className="border-t pt-4">
    <h4>Database Schema</h4>
    <SchemaEditor
      database="TinyURL Database"
      dbType="PostgreSQL"
      initialSchema={currentConfig.schema}
      onSchemaChange={(schema) => setCurrentConfig({ ...currentConfig, schema })}
    />
  </div>
</div>
```

**Benefits**:
- See all options at once (no back/forward through wizard steps)
- Make informed decisions (see how instance type affects cost)
- Edit any section without navigating away

---

## Test Execution Flow

### Level 1 Test Process

1. **Student Builds Architecture**
   - Drag components onto canvas
   - Configure each component (instance types, settings)
   - Define data schema using SchemaEditor
   - Connect components

2. **Student Clicks "Run Test"**
   ```typescript
   async function runTest(graph: SystemGraph, scenario: Scenario) {
     // Step 1: Validate architecture
     const validationResults = validateGraph(graph, scenario);
     if (!validationResults.every(r => r.valid)) {
       return { passed: false, errors: validationResults.filter(r => !r.valid) };
     }

     // Step 2: Run simulation
     const simulation = new Simulation(graph, scenario);
     const results = await simulation.run();

     // Step 3: Check pass criteria
     const passed =
       results.maxLatency <= scenario.passCriteria.maxLatency &&
       results.errorRate <= scenario.passCriteria.maxErrorRate;

     return { passed, results };
   }
   ```

3. **System Validates**
   - Check required components exist
   - Check connections are valid
   - Check data model is defined

4. **System Simulates (60 seconds virtual time)**
   - Generate 0.1 RPS traffic (6 total requests)
   - Route requests through components
   - Calculate latency, errors, cost
   - Just need 1 successful request to pass

5. **Show Results**
   ```
   ✅ Level 1 Passed!

   Your system successfully handled basic connectivity:
   - 6 requests sent
   - 1 request succeeded (83% failed, that's OK!)
   - Latency: 2,345ms (under 30,000ms limit)

   Architecture:
   - App Server: t3.micro (2 vCPU, 1GB RAM) - $7/mo
   - PostgreSQL: db.t3.micro (2 vCPU, 1GB RAM) - $13/mo
   - Total Cost: $20/mo

   Next: Try Level 2 - Scale to 100 RPS
   ```

---

## Future Levels (Not Yet Implemented)

### Level 2: Basic Optimization - Scale to 100 RPS

**Changes from Level 1**:
```typescript
{
  traffic: { rps: 100 },  // 100x more traffic
  passCriteria: {
    maxLatency: 200,      // Must be fast
    maxErrorRate: 0.05,   // Only 5% errors allowed
  },
}
```

**What students learn**:
- T3.micro can't handle 100 RPS → need to upgrade
- Must size instances based on capacity
- Learn about vertical scaling (bigger instance) vs horizontal scaling (more instances)

### Level 3: Better Optimization - Add Caching for 1,000 RPS

**Changes from Level 2**:
```typescript
{
  traffic: {
    rps: 1000,           // 10x more traffic
    readWriteRatio: 0.9, // 90% reads
  },
  passCriteria: {
    maxLatency: 100,     // Even faster
    maxErrorRate: 0.05,
    maxCost: 300,        // Now we care about cost!
  },
}
```

**What students learn**:
- Can't just throw bigger instances at it (too expensive)
- Need Redis cache to absorb reads
- Learn about cache hit ratios
- Tradeoff: cost vs performance

### Level 4: Edge Cases - Survive Server Failures

**Changes from Level 3**:
```typescript
{
  traffic: { rps: 1000, readWriteRatio: 0.9 },
  failureInjection: {
    component: 'postgresql',
    at: 20,        // Database fails at 20 seconds
    recoveryAt: 40, // Comes back at 40 seconds
  },
  passCriteria: {
    maxLatency: 150,
    maxDowntime: 10,   // Can only be down 10 seconds!
    availability: 0.999, // 99.9% uptime
  },
}
```

**What students learn**:
- Need database replication
- Read replicas can handle reads during failure
- Understand sync vs async replication tradeoffs
- Circuit breakers and failover

### Level 5: Optimal Solution - Balance Cost vs Performance

**Changes from Level 4**:
```typescript
{
  traffic: { rps: 1000, readWriteRatio: 0.9 },
  passCriteria: {
    maxLatency: 100,
    maxErrorRate: 0.05,
    maxCost: 500,        // Lower cost than Level 4
    availability: 0.99,  // Lower availability OK (not 0.999)
  },
}
```

**What students learn**:
- Remove one database replica (reduce cost)
- Accept slightly lower availability
- Right-size instances (not over-provisioned)
- Find the sweet spot between cost and performance

---

## Technical Implementation Details

### File Structure

```
src/apps/system-design/builder/
├── challenges/
│   ├── definitions/          # NEW: 40 challenge definitions
│   │   ├── index.ts          # Exports all 40 challenges
│   │   ├── instagram.ts      # Social media challenges
│   │   ├── twitter.ts
│   │   ├── ...
│   │   ├── amazon.ts         # E-commerce challenges
│   │   ├── ...
│   │   └── weatherapi.ts     # Last of 40
│   ├── tinyUrlProblemDefinition.ts  # Example with all 5 levels
│   └── index.ts
├── data/
│   ├── ec2Instances.ts       # Real EC2 instance types
│   ├── rdsInstances.ts       # Real RDS instance types
│   └── redisInstances.ts     # Real ElastiCache instance types
├── simulation/
│   ├── components/
│   │   ├── AppServer.ts      # Uses EC2_INSTANCES
│   │   ├── PostgreSQL.ts     # Uses RDS_INSTANCES
│   │   ├── RedisCache.ts     # Uses REDIS_INSTANCES
│   │   └── ...
│   └── Simulation.ts
├── validation/
│   ├── validators/
│   │   └── commonValidators.ts  # Reusable validators
│   └── ValidationEngine.ts
├── ui/
│   ├── components/
│   │   ├── SchemaEditor.tsx  # Visual table/column builder
│   │   └── ...
│   └── pages/
│       └── TinyUrlChallenge.tsx  # Inline config modal
└── types/
    ├── problemDefinition.ts  # ProblemDefinition interface
    └── ...
```

### Key Data Structures

#### ProblemDefinition
```typescript
interface ProblemDefinition {
  id: string;
  title: string;
  description: string;

  functionalRequirements: {
    mustHave: ComponentRequirement[];        // Required components
    mustConnect: ConnectionRequirement[];    // Required connections
    dataModel?: DataModelRequirement;        // Data schema requirements
  };

  scenarios: Scenario[];  // Test scenarios (levels)

  validators: {
    name: string;
    validate: ValidatorFunction;
  }[];
}
```

#### Scenario (Test Level)
```typescript
interface Scenario {
  name: string;
  description: string;

  traffic: {
    rps: number;
    readWriteRatio?: number;
    avgFileSize?: number;
    geospatialQueries?: boolean;
  };

  failureInjection?: {
    component: string;
    at: number;
    recoveryAt?: number;
  };

  passCriteria: {
    maxLatency?: number;
    maxCost?: number;
    maxErrorRate?: number;
    maxDowntime?: number;
    availability?: number;
  };
}
```

#### Schema (from SchemaEditor)
```typescript
interface TableSchema {
  name: string;
  columns: Column[];
  indexes: string[];
  accessPattern: 'read_heavy' | 'write_heavy' | 'balanced' | 'high_contention';
  estimatedRows: number;
  avgRowSize: number;
  expanded?: boolean;
}

interface Column {
  name: string;
  type: string;  // 'INT', 'VARCHAR(255)', 'TIMESTAMP', etc.
  constraints: string[];  // ['PK', 'NOT NULL', 'FK → users.id']
  enumValues?: string;  // For ENUM type: 'available,locked,sold'
}
```

---

## Testing Strategy

### Level 1 Testing (Current)

**Goal**: Ensure basic connectivity validation works

**Test Cases**:
1. Valid architecture passes
   - Client → App → DB connected
   - Result: ✅ Pass

2. Missing component fails
   - Client → App (no DB)
   - Result: ❌ Fail with hint "Need database for persistent storage"

3. Missing connection fails
   - Has App and DB, but not connected
   - Result: ❌ Fail with hint "App Server must connect to Database"

4. Wrong component type fails
   - Uses CDN instead of database
   - Result: ❌ Fail with hint "CDN is overkill for dynamic content"

### Future Level Testing (When Implemented)

**Level 2**: Instance capacity testing
- T3.micro at 100 RPS → ❌ Fail (over capacity)
- T3.large at 100 RPS → ✅ Pass

**Level 3**: Cache effectiveness
- No cache at 1000 RPS → ❌ Fail (database saturated)
- Redis cache with 90% hit ratio → ✅ Pass

**Level 4**: Failure resilience
- Single database instance → ❌ Fail (downtime > 10s)
- Primary + read replica → ✅ Pass

**Level 5**: Cost optimization
- Over-provisioned instances → ❌ Fail (cost > $500)
- Right-sized with cache → ✅ Pass

---

## Next Steps (Priority Order)

### Phase 2: Add Progressive Levels to TinyURL ✅ DONE

TinyURL already has all 5 levels implemented. This serves as the reference implementation.

**Verification**:
```bash
# Check TinyURL problem definition
cat src/apps/system-design/builder/challenges/tinyUrlProblemDefinition.ts

# Should see 5 scenarios:
# - Level 1: Brute Force (0.1 RPS, just connectivity)
# - Level 2: Basic Optimization (100 RPS, capacity planning)
# - Level 3: Better Optimization (1000 RPS, caching)
# - Level 4: Edge Cases (failure injection)
# - Level 5: Optimal Solution (cost optimization)
```

### Phase 3: Test TinyURL End-to-End (HIGHEST PRIORITY)

**Goal**: Ensure Level 1 connectivity test works perfectly for TinyURL before expanding.

**Tasks**:
1. Create minimal test architecture
   ```typescript
   const testGraph = {
     components: [
       { type: 'client', id: 'client-1' },
       { type: 'compute', id: 'app-1', config: { instanceType: 't3.micro' } },
       { type: 'storage', id: 'db-1', config: { instanceType: 'db.t3.micro' } },
     ],
     connections: [
       { from: 'client-1', to: 'app-1' },
       { from: 'app-1', to: 'db-1' },
     ],
   };
   ```

2. Run Level 1 test
   ```typescript
   const result = await runTest(testGraph, tinyUrlProblemDefinition.scenarios[0]);
   console.log(result);
   // Expected: { passed: true, ... }
   ```

3. Verify validation works
   - Remove database → should fail with helpful error
   - Remove connection → should fail with helpful error
   - Add CDN → should warn "CDN is overkill"

4. Test UI flow
   - Student drags components
   - Student configures PostgreSQL (schema editor appears)
   - Student clicks "Run Test"
   - Results display with cost breakdown

**Success Criteria**:
- ✅ Level 1 test passes with minimal architecture
- ✅ Validation errors are clear and helpful
- ✅ Schema editor saves data correctly
- ✅ Results show cost, latency, pass/fail
- ✅ Student can progress to Level 2 after passing Level 1

### Phase 4: Add Levels 2-5 to 5 Popular Challenges

**Recommended Challenges** (diverse, well-understood):
1. Instagram (photo sharing, S3, read-heavy)
2. Uber (geospatial, real-time, write-heavy)
3. Netflix (streaming, CDN, large files)
4. WhatsApp (messaging, real-time, encryption)
5. Stack Overflow (Q&A, search, voting)

**For each challenge**:
1. Define Level 2 scenario (100-1000 RPS, capacity planning)
2. Define Level 3 scenario (caching or optimization)
3. Define Level 4 scenario (failure handling)
4. Define Level 5 scenario (cost optimization)
5. Add custom validators if needed
6. Test end-to-end

### Phase 5: Create Challenge UI Pages

**Current**: Only TinyURL has a dedicated page
**Needed**: Pages for all 40 challenges

**Template** (based on TinyUrlChallenge.tsx):
```typescript
export function InstagramChallenge() {
  return (
    <ChallengePage
      problemDefinition={instagramProblemDefinition}
      title="Instagram - Photo Sharing"
      description="Design a photo sharing platform..."
      features={[
        'Upload and share photos',
        'Follow users and view feed',
        'Like and comment on photos',
      ]}
    />
  );
}
```

**UI Components Needed**:
- Generic `ChallengePage` component
- Progress tracker (Level 1 → Level 5)
- Hint system (triggered by specific failures)
- Solution comparison (student vs optimal)

### Phase 6: Add Hints and Learning Content

**Example Hints** (from TinyURL):
```typescript
hints: [
  {
    trigger: 'test_failed:Read Spike',
    message: `💡 Your database is saturated during the traffic spike.

This is common in read-heavy systems. Consider:
1. Adding a cache (Redis) to absorb read traffic
2. Increasing cache hit ratio (larger cache, longer TTL)
3. Sizing database to handle cache miss scenarios

For Tiny URL, most URLs are accessed multiple times, so caching is very effective!`,
  },
  {
    trigger: 'component_added:cdn',
    message: `⚠️ CDN is likely **overkill** for TinyURL!

Why CDN doesn't help here:
- TinyURL responses are DYNAMIC (database lookups, not static files)
- Each short code redirects to a different URL (can't cache the redirect response)
- CDN is for static content (images, CSS, videos)

Better approach:
- Use Redis to cache URL mappings (short code → long URL)
- Keep app servers close to database (low latency)`,
  },
]
```

**Apply to all challenges**:
- Detect common mistakes (e.g., no cache for read-heavy)
- Explain why certain components are overkill
- Guide students toward optimal solutions

### Phase 7: Analytics and Progress Tracking

**Student Dashboard**:
- Challenges completed (by category)
- Current level for each challenge
- Time spent per challenge
- Common mistakes and learnings

**Instructor Dashboard**:
- Which challenges are too hard/easy
- Where students get stuck
- Most common architecture mistakes
- Average time to complete

---

## Success Metrics

### Learning Outcomes

Students should be able to:
1. **Choose appropriate instance types** based on capacity needs
2. **Calculate cost** of their architecture (not just "make it work")
3. **Identify when caching helps** (read-heavy workloads)
4. **Design for failure** (replication, failover)
5. **Optimize cost vs performance** (right-sizing, not over-provisioning)
6. **Explain tradeoffs** (sync vs async replication, cache size, etc.)

### Platform Metrics

- **Completion Rate**: % of students who finish Level 1 → Level 5
- **Time to Level 1**: Should be < 15 minutes (just connectivity)
- **Time to Level 5**: Varies by challenge (30-120 minutes)
- **Retry Rate**: How many attempts before passing each level
- **Hint Usage**: Do students read hints? Do hints help?

---

## Technical Debt and Improvements

### Current Limitations

1. **No actual simulation**: Currently just validates architecture, doesn't truly simulate traffic
2. **No real cost calculation**: Instance costs are hardcoded, should use AWS pricing API
3. **No real latency modeling**: Should account for network latency, database query time, etc.
4. **Schema editor not integrated with validation**: Should validate schema matches data model requirements

### Future Enhancements

1. **Real Simulation Engine**
   - Use discrete event simulation
   - Model request queues, CPU usage, memory pressure
   - Realistic latency based on network distance, query complexity

2. **AWS Cost Integration**
   - Fetch real-time pricing from AWS API
   - Support reserved instances, spot instances
   - Show cost breakdown by component

3. **Advanced Scenarios**
   - Multi-region deployments
   - Database sharding
   - Microservices architectures
   - Event-driven systems

4. **AI-Powered Feedback**
   - Analyze student architecture
   - Suggest improvements
   - Compare to optimal solution
   - Explain why optimal is better

---

## Appendix: TinyURL Reference Implementation

### Complete Level Progression

```typescript
scenarios: [
  // Level 1: Brute Force - Does it work at all?
  {
    name: 'Level 1: The Brute Force Test - Does It Even Work?',
    traffic: { rps: 0.1, readWriteRatio: 0.5 },
    passCriteria: {
      maxLatency: 30000,
      maxErrorRate: 0.99,
    },
  },

  // Level 2: Basic optimization - capacity planning
  {
    name: 'Level 2: Basic Optimization - Scale to 100 RPS',
    traffic: { rps: 100, readWriteRatio: 0.9 },
    passCriteria: {
      maxLatency: 200,
      maxErrorRate: 0.05,
    },
  },

  // Level 3: Better optimization - caching
  {
    name: 'Level 3: Better Optimization - Add Caching for 1,000 RPS',
    traffic: { rps: 1000, readWriteRatio: 0.9 },
    passCriteria: {
      maxLatency: 100,
      maxErrorRate: 0.05,
      maxCost: 300,
    },
  },

  // Level 4: Edge cases - failures
  {
    name: 'Level 4: Edge Cases - Survive Server Failures',
    traffic: { rps: 1000, readWriteRatio: 0.9 },
    failureInjection: {
      component: 'postgresql',
      at: 20,
      recoveryAt: 40,
    },
    passCriteria: {
      maxLatency: 150,
      maxDowntime: 10,
      availability: 0.999,
    },
  },

  // Level 5: Optimal solution - cost/performance balance
  {
    name: 'Level 5: Optimal Solution - Balance Cost vs Performance',
    traffic: { rps: 1000, readWriteRatio: 0.9 },
    passCriteria: {
      maxLatency: 100,
      maxErrorRate: 0.05,
      maxCost: 500,
      availability: 0.99,
    },
  },
]
```

### Example Passing Architectures

**Level 1 (Minimal)**:
- Client
- App Server (t3.micro)
- PostgreSQL (db.t3.micro)
- Cost: ~$20/mo

**Level 2 (Scaled)**:
- Client
- App Server (t3.medium x2)
- PostgreSQL (db.m5.large)
- Cost: ~$150/mo

**Level 3 (Cached)**:
- Client
- Load Balancer
- App Server (t3.medium x2)
- Redis (cache.m5.large, 90% hit ratio)
- PostgreSQL (db.m5.large)
- Cost: ~$250/mo

**Level 4 (Resilient)**:
- Client
- Load Balancer
- App Server (t3.medium x3)
- Redis (cache.m5.large)
- PostgreSQL Primary (db.m5.large)
- PostgreSQL Replica (db.m5.large)
- Cost: ~$400/mo

**Level 5 (Optimized)**:
- Client
- Load Balancer
- App Server (t3.medium x2)
- Redis (cache.m5.large, 95% hit ratio)
- PostgreSQL Primary (db.m5.large)
- PostgreSQL Replica (db.m5.large)
- Cost: ~$350/mo (removed one app server, increased cache hit ratio)

---

## Contact and Maintenance

**Primary Maintainer**: System Design Team
**Last Updated**: 2025-11-12
**Next Review**: After Phase 3 completion (TinyURL end-to-end testing)

**How to Update This Document**:
1. Edit `/SYSTEM_DESIGN_IMPLEMENTATION_PLAN.md`
2. Update "Last Updated" date
3. Commit with message: "docs: update implementation plan - [what changed]"
4. Review with team before major architectural changes
