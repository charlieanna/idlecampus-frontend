import type { SystemDesignLesson } from '../../../types/lesson';

export const activeActiveMultiRegionLesson: SystemDesignLesson = {
  id: 'sd-active-active-multiregion',
  slug: 'active-active-multiregion',
  title: 'Active-Active Multi-Region Architecture',
  description: 'Learn when and why to use active-active multi-region architecture, see how single-region designs break, and how to fix them',
  difficulty: 'advanced',
  estimatedMinutes: 45,
  category: 'patterns',
  tags: ['multi-region', 'active-active', 'replication', 'conflict-resolution', 'availability'],
  prerequisites: ['database-replication', 'understanding-scale'],
  learningObjectives: [
    'Understand when to use active-active multi-region architecture',
    'Identify problems with single-region designs for global applications',
    'Learn how active-active handles network partitions',
    'Understand conflict resolution strategies',
    'See the progression from brute force to optimized design',
  ],
  conceptsCovered: [
    {
      id: 'active-active',
      name: 'Active-Active Multi-Region',
      type: 'pattern',
      difficulty: 5,
      description: 'Both regions handle writes independently, with bidirectional replication',
    },
    {
      id: 'conflict-resolution',
      name: 'Conflict Resolution',
      type: 'technique',
      difficulty: 4,
      description: 'Resolving conflicts when same data is updated in different regions',
    },
    {
      id: 'vector-clocks',
      name: 'Vector Clocks',
      type: 'technique',
      difficulty: 5,
      description: 'Tracking causality of events across distributed systems',
    },
  ],
  relatedChallenges: ['active-active-regions'],
  stages: [
    {
      id: 'why-active-active',
      type: 'concept',
      title: 'Why Active-Active Multi-Region?',
      description: 'Understanding the problem that active-active solves',
      estimatedMinutes: 10,
      content: {
        markdown: `# Why Active-Active Multi-Region?

## The Problem: Global Users, Single Region

Imagine you're building **Google Docs** - a collaborative document editor used by millions of users worldwide.

### Scenario: Single-Region Design (Brute Force)

\`\`\`
Users in India → US-East Region
Users in USA → US-East Region
\`\`\`

**Architecture:**
\`\`\`
[Users India] ──┐
                 ├──> [Load Balancer] ──> [App Servers] ──> [Database]
[Users USA]  ───┘                                    US-East Region
\`\`\`

### Problems with Single-Region Design

#### 1. **High Latency for Distant Users**

- **User in India** writing to **US-East**: ~200-300ms latency
- **User in USA** writing to **US-East**: ~20-50ms latency
- **Poor user experience** for international users

#### 2. **Single Point of Failure**

If US-East region fails:
- ❌ **All users lose access** (both India and USA)
- ❌ **No failover** - complete outage
- ❌ **Data loss risk** if replication not configured

#### 3. **Network Partition Issues**

If network between India and US-East fails:
- ❌ **Indian users cannot write** (even though their region is fine)
- ❌ **All traffic must go through one region**

#### 4. **Write Capacity Bottleneck**

- All writes go to **one database** in US-East
- Limited write capacity (e.g., 300 write RPS)
- Cannot scale writes horizontally

## When Do You Need Active-Active?

✅ **Use Active-Active When:**

1. **Global user base** - Users in multiple geographic regions
2. **Low latency requirement** - Users need fast writes (< 50ms)
3. **High availability** - Cannot afford regional outages
4. **Write-heavy workload** - Need to scale writes across regions
5. **Regional compliance** - Data must stay in specific regions

❌ **Don't Use Active-Active When:**

1. **Single region users** - All users in one geographic area
2. **Read-heavy workload** - Can use read replicas instead
3. **Simple data model** - Conflicts are too complex to resolve
4. **Strong consistency required** - Active-active uses eventual consistency

## Real-World Examples

- **Google Docs**: Collaborative editing from anywhere
- **WhatsApp**: Messages sent/received globally
- **Slack**: Team collaboration across regions
- **GitHub**: Code commits from developers worldwide`,
      },
      keyPoints: [
        'Single-region design causes high latency for distant users',
        'Active-active enables low-latency writes in each region',
        'Use when you have global users and need high availability',
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
         │  Users in India     │  │ Users in USA  │
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
- **Users**: India and USA both connect to US-East

## What Works

✅ **Simple to implement** - No replication complexity
✅ **Strong consistency** - Single source of truth
✅ **Low cost** - Only one region to run
✅ **Easy to debug** - All data in one place

## Traffic Simulation

**Scenario**: 1000 users in India, 1000 users in USA

- **India → US-East**: 200ms latency (cross-continent)
- **USA → US-East**: 20ms latency (same region)
- **Total writes**: 100 RPS (50 from India, 50 from USA)

**Result**: 
- ✅ Works functionally
- ❌ Poor experience for Indian users (200ms latency)
- ❌ Single point of failure`,
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
      estimatedMinutes: 12,
      content: {
        markdown: `# How the Design Breaks

Let's see what happens when we stress test the single-region design.

## Failure Scenario 1: Network Partition

**What happens**: Network connection between India and US-East fails

\`\`\`
                    ┌─────────────────┐
                    │   GeoDNS/CDN    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐  [NETWORK PARTITION]  ┌────▼──────────┐
│  Users in India │  ❌ CONNECTION LOST   │ Users in USA  │
│                 │                       │                │
│  Cannot write!  │                       │ Can write ✅   │
└─────────────────┘                       └────┬───────────┘
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
- ❌ **50% of users** (India) cannot access the system
- ❌ **Complete outage** for Indian users
- ✅ **50% of users** (USA) continue working normally

**User Experience:**
- Indian user tries to edit document → **Timeout error**
- Indian user sees: "Connection failed, please try again"
- **Frustrating experience** - system appears broken

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
│  Users in India │                       │ Users in USA  │
│                 │                       │                │
│  Cannot write!  │                       │ Cannot write!  │
└─────────────────┘                       └────────────────┘
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
- ❌ **100% of users** lose access
- ❌ **Complete system outage**
- ❌ **No failover** - no backup region
- ❌ **Data loss risk** if not backed up

**User Experience:**
- All users see: "Service unavailable"
- **Complete downtime** until US-East recovers
- **No way to access documents** during outage

---

## Failure Scenario 3: High Latency Under Load

**What happens**: System works, but latency is unacceptable

**Traffic:**
- 5000 users in India writing documents
- 5000 users in USA writing documents
- Total: 500 RPS writes

**Latency:**
- **India → US-East**: 250ms average (cross-continent)
- **USA → US-East**: 30ms average (same region)

**User Experience:**
- Indian user types → **250ms delay** before character appears
- **Feels laggy and unresponsive**
- **Poor user experience** compared to local users
- Users complain: "Why is it so slow?"

---

## Failure Scenario 4: Write Capacity Exceeded

**What happens**: Database write capacity is exceeded

**Database Capacity:**
- Single PostgreSQL: **300 write RPS maximum**

**Traffic:**
- **500 write RPS** from all users
- **Exceeds capacity** by 200 RPS

**Result:**
- ❌ **200 RPS of writes fail** (40% error rate)
- ❌ **Users see errors**: "Failed to save, please retry"
- ❌ **Cannot scale writes** - single database bottleneck

---

## Summary: Why Single-Region Breaks

| Problem | Impact | Severity |
|---------|--------|----------|
| Network partition | 50% users lose access | 🔴 Critical |
| Regional outage | 100% users lose access | 🔴 Critical |
| High latency | Poor UX for distant users | 🟡 High |
| Write capacity | Errors under load | 🟡 High |

**Conclusion**: Single-region design **breaks** for global applications. We need **active-active multi-region** to solve these problems.`,
      },
      keyPoints: [
        'Network partitions cause partial outages',
        'Regional failures cause complete outages',
        'High latency makes distant users unhappy',
        'Write capacity limits prevent scaling',
      ],
    },
    {
      id: 'active-active-solution',
      type: 'concept',
      title: 'The Solution: Active-Active Multi-Region',
      description: 'How active-active fixes the problems',
      estimatedMinutes: 15,
      content: {
        markdown: `# The Solution: Active-Active Multi-Region

Let's fix the problems by implementing **active-active multi-region architecture**.

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
         │   India Region      │  │   USA Region    │
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
         │  │ (PostgreSQL) │   │  │  │(PostgreSQL)│ │
         │  │   WRITABLE   │   │  │  │  WRITABLE  │ │
         │  └──────┬───────┘   │  │  └─────┬──────┘ │
         │         │           │  │        │        │
         └─────────┼───────────┴──┼────────┼────────┘
                   │              │        │
                   │    ┌─────────▼────────▼────┐
                   │    │  Replication Stream   │
                   │    │  (Kafka/Message Queue)│
                   │    └─────────┬─────────────┘
                   │              │
                   └──────────────┘
              Bidirectional Replication
\`\`\`

## Key Components

### 1. **Two Active Regions**

- **India Region**: Handles writes from Indian users
- **USA Region**: Handles writes from American users
- **Both regions are active** - no passive standby

### 2. **Bidirectional Replication**

- Changes in **India** → replicate to **USA**
- Changes in **USA** → replicate to **India**
- Uses **message queue** (Kafka) or **database replication**

### 3. **Conflict Resolution**

- When same document edited in both regions simultaneously
- **Vector clocks** or **CRDTs** (Conflict-free Replicated Data Types)
- **Last-write-wins** or **application-level merge**

### 4. **GeoDNS Routing**

- Users automatically routed to **nearest region**
- Indian users → India region
- American users → USA region

## How It Fixes the Problems

### ✅ Problem 1: High Latency → FIXED

**Before (Single-Region):**
- India → US-East: **200ms latency**

**After (Active-Active):**
- India → India region: **20ms latency** ✅
- USA → USA region: **20ms latency** ✅

**Result**: **10x latency improvement** for distant users

---

### ✅ Problem 2: Network Partition → FIXED

**Before (Single-Region):**
- Network partition → **50% users lose access**

**After (Active-Active):**
- Network partition → **Both regions continue operating**
- India region: Indian users can still write ✅
- USA region: American users can still write ✅
- Replication resumes when network heals

**Result**: **Zero downtime** during network partitions

---

### ✅ Problem 3: Regional Outage → FIXED

**Before (Single-Region):**
- US-East fails → **100% users lose access**

**After (Active-Active):**
- India region fails → **Indian users failover to USA region**
- USA region fails → **American users failover to India region**
- **50% capacity** but system still operational

**Result**: **Partial availability** instead of complete outage

---

### ✅ Problem 4: Write Capacity → FIXED

**Before (Single-Region):**
- Single database: **300 write RPS**

**After (Active-Active):**
- India database: **300 write RPS**
- USA database: **300 write RPS**
- **Total: 600 write RPS** ✅

**Result**: **2x write capacity** (scales with regions)

---

## Configuration

**India Region:**
- Database: PostgreSQL (writable)
- Replication: Enabled (replicate to USA)
- Conflict resolution: Vector clocks

**USA Region:**
- Database: PostgreSQL (writable)
- Replication: Enabled (replicate to India)
- Conflict resolution: Vector clocks

**Replication:**
- Mode: **Bidirectional async replication**
- Stream: Kafka message queue
- Lag: < 5 seconds (eventual consistency)

## Trade-offs

### ✅ Advantages

1. **Low latency** for all users (writes to nearest region)
2. **High availability** (survives regional failures)
3. **Scalable writes** (capacity = regions × database capacity)
4. **Better user experience** (fast, responsive)

### ❌ Disadvantages

1. **Complexity** - Conflict resolution is hard
2. **Eventual consistency** - Data may be temporarily inconsistent
3. **Higher cost** - Two active regions (not standby)
4. **Replication lag** - Changes take time to propagate

## When to Use

✅ **Use Active-Active When:**
- Global user base
- Low latency requirement
- High availability requirement
- Write-heavy workload
- Can handle conflict resolution

❌ **Don't Use When:**
- Single region users
- Strong consistency required
- Simple data model (conflicts too complex)
- Budget constraints (cheaper alternatives exist)`,
      },
      keyPoints: [
        'Active-active: both regions handle writes independently',
        'Fixes latency, availability, and capacity problems',
        'Requires conflict resolution and eventual consistency',
        'More complex but necessary for global applications',
      ],
    },
  ],
  nextLessons: ['conflict-resolution', 'eventual-consistency'],
};

