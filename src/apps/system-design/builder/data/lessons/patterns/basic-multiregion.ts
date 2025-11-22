import type { SystemDesignLesson } from '../../../types/lesson';

export const basicMultiRegionLesson: SystemDesignLesson = {
  id: 'sd-basic-multiregion',
  slug: 'basic-multiregion',
  title: 'Basic Multi-Region Architecture',
  description: 'Learn when and why to use basic multi-region architecture (single-leader), see how single-region designs break for global users, and how to fix them',
  difficulty: 'intermediate',
  estimatedMinutes: 40,
  category: 'patterns',
  tags: ['multi-region', 'single-leader', 'replication', 'failover', 'geographic-routing'],
  prerequisites: ['database-replication', 'understanding-scale'],

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 2,

  learningObjectives: [
    'Understand when to use basic multi-region architecture (single-leader)',
    'Identify problems with single-region designs for global applications',
    'Learn how primary/secondary replication works across regions',
    'Understand automatic failover mechanisms',
    'See the progression from brute force to optimized design',
  ],
  conceptsCovered: [
    {
      id: 'single-leader-multiregion',
      name: 'Single-Leader Multi-Region',
      type: 'pattern',
      difficulty: 3,
      description: 'Primary region handles writes, secondary regions handle reads with replication',
    },
    {
      id: 'geographic-routing',
      name: 'Geographic Routing',
      type: 'technique',
      difficulty: 2,
      description: 'Route users to nearest region using GeoDNS',
    },
    {
      id: 'automatic-failover',
      name: 'Automatic Failover',
      type: 'technique',
      difficulty: 3,
      description: 'Automatically switch to secondary region when primary fails',
    },
  ],
  relatedChallenges: ['basic-multi-region'],
  stages: [
    {
      id: 'why-basic-multiregion',
      type: 'concept',
      title: 'Why Basic Multi-Region?',
      description: 'Understanding the problem that basic multi-region solves',
      estimatedMinutes: 10,
      content: {
        markdown: `# Why Basic Multi-Region?

## The Problem: Global Readers, Single Region

Imagine you're building a **news publishing platform** (like Medium) - content creators publish articles, and readers worldwide access them.

### Scenario: Single-Region Design (Brute Force)

\`\`\`
Content Creators → US-East Region
Readers in Europe → US-East Region
Readers in Asia → US-East Region
\`\`\`

**Architecture:**
\`\`\`
[Content Creators] ──┐
                      ├──> [Load Balancer] ──> [App Servers] ──> [Database]
[Readers Europe]  ───┤                                    US-East Region
[Readers Asia]    ───┘
\`\`\`

### Problems with Single-Region Design

#### 1. **High Latency for Distant Readers**

- **Reader in Europe** reading from **US-East**: ~150-200ms latency
- **Reader in Asia** reading from **US-East**: ~200-300ms latency
- **Reader in US** reading from **US-East**: ~20-50ms latency
- **Poor user experience** for international readers

#### 2. **Single Point of Failure**

If US-East region fails:
- ❌ **All users lose access** (creators and readers worldwide)
- ❌ **No failover** - complete outage
- ❌ **Content unavailable** until region recovers

#### 3. **Read Capacity Bottleneck**

- All reads go to **one database** in US-East
- Limited read capacity (e.g., 3000 read RPS)
- Cannot scale reads horizontally

#### 4. **Wasted Bandwidth**

- European readers download articles from US-East
- **Cross-continental bandwidth** costs more
- **Slower page loads** due to distance

## When Do You Need Basic Multi-Region?

✅ **Use Basic Multi-Region When:**

1. **Global readership** - Readers in multiple geographic regions
2. **Read-heavy workload** - Many more reads than writes (10:1 or higher)
3. **Low latency requirement** - Readers need fast page loads (< 100ms)
4. **High availability** - Cannot afford regional outages
5. **Centralized writes** - All writes can go to one region (no conflict resolution needed)

❌ **Don't Use Basic Multi-Region When:**

1. **Write-heavy workload** - Need writes in multiple regions (use active-active instead)
2. **Single region users** - All users in one geographic area
3. **Strong consistency required** - Can't tolerate replication lag
4. **Complex conflict resolution** - Need simultaneous writes in different regions

## Real-World Examples

- **News sites**: CNN, BBC (articles published centrally, read globally)
- **Blog platforms**: Medium, WordPress.com
- **Content platforms**: YouTube (videos uploaded centrally, watched globally)
- **E-commerce catalogs**: Product listings (updated centrally, browsed globally)

## Key Difference from Active-Active

| Aspect | Basic Multi-Region | Active-Active Multi-Region |
|--------|-------------------|---------------------------|
| **Writes** | Only primary region | Both regions |
| **Reads** | Nearest region (replica) | Nearest region (local) |
| **Conflicts** | None (single writer) | Yes (needs resolution) |
| **Use Case** | Read-heavy, centralized writes | Write-heavy, distributed writes |
| **Example** | News site | Collaborative editor |
| **Complexity** | Simpler | More complex |`,
      },
      keyPoints: [
        'Basic multi-region: primary for writes, replicas for reads',
        'Use when you have global readers and read-heavy workload',
        'Simpler than active-active - no conflict resolution needed',
      ],
    },
    {
      id: 'brute-force-design',
      type: 'concept',
      title: 'Brute Force: Single-Region Design',
      description: 'Starting with the simplest design',
      estimatedMinutes: 8,
      content: {
        markdown: `# Brute Force: Single-Region Design

Let's start with the **simplest possible design** - everything in one region.

## Architecture Diagram

\`\`\`
                    ┌─────────────────┐
                    │   GeoDNS/CDN    │
                    │  (Route Users)  │
                    └────────┬────────┘
                             │
                    ┌─────────┴─────────┐
                    │                   │
         ┌──────────▼──────────┐  ┌────▼──────────┐
         │  Readers in Europe  │  │Readers in Asia│
         └──────────┬──────────┘  └────┬───────────┘
                    │                 │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   App Servers   │
                    │   (3 instances) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │
                    │   (PostgreSQL)  │
                    │   US-East Only  │
                    └─────────────────┘
\`\`\`

## Configuration

- **Region**: US-East only
- **Database**: Single PostgreSQL instance
- **Replication**: None (single database)
- **Users**: Content creators and readers worldwide all connect to US-East

## What Works

✅ **Simple to implement** - No replication complexity
✅ **Strong consistency** - Single source of truth
✅ **Low cost** - Only one region to run
✅ **Easy to debug** - All data in one place
✅ **Works for small scale** - Fine if all users are in one region

## Traffic Simulation

**Scenario**: 
- 100 content creators publishing articles
- 10,000 readers in Europe
- 10,000 readers in Asia
- 5,000 readers in US

**Traffic:**
- **Writes**: 10 RPS (content creators publishing)
- **Reads**: 5000 RPS (readers accessing articles)
- **Europe → US-East**: 200ms latency (cross-continent)
- **Asia → US-East**: 250ms latency (cross-continent)
- **US → US-East**: 30ms latency (same region)

**Result**: 
- ✅ Works functionally
- ❌ Poor experience for European/Asian readers (200-250ms latency)
- ❌ Single point of failure
- ❌ Read capacity may be exceeded`,
      },
      keyPoints: [
        'Brute force: single region, single database',
        'Works functionally but has latency and availability issues',
        'Good starting point to understand the problem',
      ],
    },
    {
      id: 'how-it-breaks',
      type: 'concept',
      title: 'How the Design Breaks',
      description: 'Seeing the failures in action',
      estimatedMinutes: 10,
      content: {
        markdown: `# How the Design Breaks

Let's see what happens when we stress test the single-region design.

## Failure Scenario 1: High Latency for Distant Users

**What happens**: European and Asian readers experience slow page loads

\`\`\`
                    ┌─────────────────┐
                    │   GeoDNS/CDN    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐                       ┌────▼──────────┐
│Readers in Europe│                       │Readers in Asia│
│                 │                       │               │
│ 200ms latency   │                       │ 250ms latency │
│ Slow page loads │                       │ Slow page loads│
└─────────────────┘                       └───────────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   App Servers   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │
                    │   US-East Only  │
                    └─────────────────┘
\`\`\`

**Impact:**
- ❌ **European readers**: 200ms latency → slow page loads
- ❌ **Asian readers**: 250ms latency → very slow page loads
- ❌ **Poor user experience** - users complain about slowness
- ❌ **Higher bounce rate** - users leave due to slow loading

**User Experience:**
- European user clicks article → **200ms delay** before content loads
- **Feels laggy and unresponsive**
- **Users abandon** slow-loading pages
- **Lower engagement** - users read fewer articles

---

## Failure Scenario 2: Regional Outage

**What happens**: US-East region completely fails (datacenter down)

\`\`\`
                    ┌─────────────────┐
                    │   GeoDNS/CDN    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐                       ┌────▼──────────┐
│Readers in Europe│                       │Readers in Asia│
│                 │                       │               │
│ Cannot read! ❌  │                       │ Cannot read! ❌│
└─────────────────┘                       └───────────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │ ❌ DOWN
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   App Servers   │ ❌ DOWN
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │ ❌ DOWN
                    │   US-East Only  │
                    └─────────────────┘
\`\`\`

**Impact:**
- ❌ **100% of users** lose access (creators and readers worldwide)
- ❌ **Complete system outage**
- ❌ **No failover** - no backup region
- ❌ **Content unavailable** until US-East recovers
- ❌ **Revenue loss** - no ad impressions, no subscriptions

**User Experience:**
- All users see: "Service unavailable" or "Connection timeout"
- **Complete downtime** until US-East recovers
- **No way to access articles** during outage
- **Frustrated users** switch to competitors

---

## Failure Scenario 3: Read Capacity Exceeded

**What happens**: Database read capacity is exceeded

**Database Capacity:**
- Single PostgreSQL: **3000 read RPS maximum**

**Traffic:**
- **5000 read RPS** from all readers worldwide
- **Exceeds capacity** by 2000 RPS

**Result:**
- ❌ **2000 RPS of reads fail** (40% error rate)
- ❌ **Users see errors**: "Failed to load article, please retry"
- ❌ **Cannot scale reads** - single database bottleneck
- ❌ **Poor user experience** - random failures

---

## Failure Scenario 4: Network Issues

**What happens**: Network connection between Europe and US-East is slow/unstable

**Impact:**
- ❌ **Intermittent failures** for European readers
- ❌ **Timeout errors** when network is congested
- ❌ **Inconsistent experience** - works sometimes, fails other times
- ❌ **Users lose trust** in the platform

---

## Summary: Why Single-Region Breaks

| Problem | Impact | Severity |
|---------|--------|----------|
| High latency | Poor UX for distant users | 🟡 High |
| Regional outage | 100% users lose access | 🔴 Critical |
| Read capacity | Errors under load | 🟡 High |
| Network issues | Intermittent failures | 🟡 Medium |

**Conclusion**: Single-region design **breaks** for global applications. We need **basic multi-region** to solve these problems.`,
      },
      keyPoints: [
        'High latency makes distant users unhappy',
        'Regional failures cause complete outages',
        'Read capacity limits prevent scaling',
        'Network issues cause intermittent failures',
      ],
    },
    {
      id: 'basic-multiregion-solution',
      type: 'concept',
      title: 'The Solution: Basic Multi-Region',
      description: 'How basic multi-region fixes the problems',
      estimatedMinutes: 12,
      content: {
        markdown: `# The Solution: Basic Multi-Region

Let's fix the problems by implementing **basic multi-region architecture** (single-leader).

## Architecture Diagram

\`\`\`
                    ┌─────────────────┐
                    │   GeoDNS/CDN    │
                    │  (Route to      │
                    │   nearest)      │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
         ┌──────────▼──────────┐  ┌──▼──────────────┐
         │   Europe Region     │  │   US Region     │
         │   (Secondary)       │  │   (Primary)     │
         │                     │  │                 │
         │  ┌──────────────┐   │  │  ┌────────────┐ │
         │  │ Load Balancer│   │  │  │Load Balancer│ │
         │  └──────┬───────┘   │  │  └─────┬──────┘ │
         │         │           │  │        │        │
         │  ┌──────▼───────┐   │  │  ┌─────▼──────┐ │
         │  │ App Servers  │   │  │  │ App Servers│ │
         │  └──────┬───────┘   │  │  └─────┬──────┘ │
         │         │           │  │        │        │
         │  ┌──────▼───────┐   │  │  ┌─────▼──────┐ │
         │  │  Database    │   │  │  │  Database  │ │
         │  │ (PostgreSQL)  │   │  │  │(PostgreSQL)│ │
         │  │  READ-ONLY    │   │  │  │  WRITABLE  │ │
         │  │   REPLICA     │   │  │  │  PRIMARY   │ │
         │  └──────┬───────┘   │  │  └─────┬──────┘ │
         │         │           │  │        │        │
         └─────────┼───────────┴──┼────────┼────────┘
                   │              │        │
                   │    ┌─────────▼────────▼────┐
                   │    │  Replication Stream  │
                   │    │  (Async Replication)  │
                   │    └─────────┬─────────────┘
                   │              │
                   └──────────────┘
              Primary → Secondary
              (One-way replication)
\`\`\`

## Key Components

### 1. **Primary Region (US)**

- **Handles writes**: Content creators publish articles here
- **Database**: Writable PostgreSQL (primary)
- **Replication**: Sends changes to secondary regions

### 2. **Secondary Region (Europe)**

- **Handles reads**: European readers access articles here
- **Database**: Read-only PostgreSQL (replica)
- **Replication**: Receives changes from primary

### 3. **GeoDNS Routing**

- **Automatic routing**: Users routed to nearest region
- **European users** → Europe region
- **US users** → US region
- **Health checks**: Routes away from failed regions

### 4. **Automatic Failover**

- **Primary fails** → Secondary promoted to primary
- **DNS switches** traffic to new primary
- **Read-only replica** becomes writable

## How It Fixes the Problems

### ✅ Problem 1: High Latency → FIXED

**Before (Single-Region):**
- Europe → US-East: **200ms latency**

**After (Basic Multi-Region):**
- Europe → Europe region: **20ms latency** ✅
- US → US region: **20ms latency** ✅

**Result**: **10x latency improvement** for distant users

---

### ✅ Problem 2: Regional Outage → FIXED

**Before (Single-Region):**
- US-East fails → **100% users lose access**

**After (Basic Multi-Region):**
- US region fails → **European readers continue** (read from Europe region)
- **Automatic failover**: Europe region promoted to primary
- **Content creators** can write to new primary
- **Partial availability** instead of complete outage

**Result**: **Zero downtime** for readers, minimal downtime for writers

---

### ✅ Problem 3: Read Capacity → FIXED

**Before (Single-Region):**
- Single database: **3000 read RPS**

**After (Basic Multi-Region):**
- US database: **3000 read RPS**
- Europe database: **3000 read RPS**
- **Total: 6000 read RPS** ✅

**Result**: **2x read capacity** (scales with regions)

---

### ✅ Problem 4: Network Issues → FIXED

**Before (Single-Region):**
- Network issues → **All users affected**

**After (Basic Multi-Region):**
- Network issues → **Only cross-region replication affected**
- **Local reads continue** in each region
- **Users unaffected** by cross-region network problems

**Result**: **Resilient to network issues**

---

## Configuration

**US Region (Primary):**
- Database: PostgreSQL (writable, primary)
- Replication: Enabled (replicate to Europe)
- Writes: Content creators publish here

**Europe Region (Secondary):**
- Database: PostgreSQL (read-only, replica)
- Replication: Enabled (receive from US)
- Reads: European readers access here

**Replication:**
- Mode: **Async replication** (primary → secondary)
- Lag: < 2 seconds (eventual consistency)
- Failover: Automatic (health checks)

## Traffic Flow

### Write Flow (Content Creator Publishes Article):
\`\`\`
Content Creator → GeoDNS → US Region → US Database (Primary)
                                                      │
                                                      ▼
                                            Europe Database (Replica)
                                            (Replicated within 2 seconds)
\`\`\`

### Read Flow (Reader Accesses Article):
\`\`\`
European Reader → GeoDNS → Europe Region → Europe Database (Replica)
                                                      ✅ Fast (20ms)

US Reader → GeoDNS → US Region → US Database (Primary)
                                          ✅ Fast (20ms)
\`\`\`

## Trade-offs

### ✅ Advantages

1. **Low latency** for all readers (reads from nearest region)
2. **High availability** (survives regional failures)
3. **Scalable reads** (capacity = regions × database capacity)
4. **Simple architecture** (no conflict resolution needed)
5. **Cost-effective** (replicas cheaper than full databases)

### ❌ Disadvantages

1. **Write latency** (all writes go to primary, even from distant creators)
2. **Replication lag** (secondary may be slightly behind)
3. **Failover complexity** (need to promote replica if primary fails)
4. **Single write bottleneck** (cannot scale writes horizontally)

## When to Use

✅ **Use Basic Multi-Region When:**
- Global readership
- Read-heavy workload (10:1 read-to-write ratio)
- Low latency requirement for readers
- High availability requirement
- Writes can be centralized (no need for multi-region writes)

❌ **Don't Use When:**
- Write-heavy workload (use active-active instead)
- Need writes in multiple regions simultaneously
- Strong consistency required (can't tolerate replication lag)
- All users in single region`,
      },
      keyPoints: [
        'Basic multi-region: primary for writes, replicas for reads',
        'Fixes latency, availability, and capacity problems',
        'Simpler than active-active - no conflict resolution',
        'Perfect for read-heavy, globally distributed applications',
      ],
    },
  ],
  nextLessons: ['active-active-multiregion', 'geographic-routing'],
};

