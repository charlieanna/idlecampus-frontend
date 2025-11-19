import type { SystemDesignLesson } from '../../../types/lesson';

export const crossRegionDrLesson: SystemDesignLesson = {
  id: 'sd-cross-region-dr',
  slug: 'cross-region-dr',
  title: 'Cross-Region Disaster Recovery',
  description: 'Learn when and why to use disaster recovery architecture, see how single-region systems fail, and how hot standby fixes it',
  difficulty: 'advanced',
  estimatedMinutes: 40,
  category: 'patterns',
  tags: ['disaster-recovery', 'failover', 'hot-standby', 'rto', 'rpo', 'backup'],
  prerequisites: ['basic-multiregion', 'database-replication'],
  learningObjectives: [
    'Understand when to use disaster recovery architecture',
    'Learn RTO (Recovery Time Objective) and RPO (Recovery Point Objective)',
    'Identify problems with single-region systems',
    'Understand hot standby vs cold standby',
    'See how automatic failover works',
  ],
  conceptsCovered: [
    {
      id: 'hot-standby',
      name: 'Hot Standby',
      type: 'pattern',
      difficulty: 4,
      description: 'Secondary region ready to take over immediately if primary fails',
    },
    {
      id: 'rto-rpo',
      name: 'RTO and RPO',
      type: 'metric',
      difficulty: 3,
      description: 'Recovery Time Objective (how fast) and Recovery Point Objective (how much data loss)',
    },
    {
      id: 'automatic-failover',
      name: 'Automatic Failover',
      type: 'technique',
      difficulty: 4,
      description: 'System automatically switches to backup region when primary fails',
    },
  ],
  relatedChallenges: ['cross-region-failover'],
  stages: [
    {
      id: 'why-disaster-recovery',
      type: 'concept',
      title: 'Why Disaster Recovery?',
      description: 'Understanding the need for disaster recovery',
      estimatedMinutes: 10,
      content: {
        markdown: `# Why Disaster Recovery?

## The Problem: Regional Disasters

Imagine you're running an **e-commerce platform** (like Amazon) - millions of users placing orders, processing payments, managing inventory. What happens if your entire region fails?

### Real-World Disasters

**Examples of Regional Failures:**
- **Natural disasters**: Earthquakes, floods, hurricanes
- **Power outages**: Datacenter loses power
- **Network failures**: ISP backbone goes down
- **Cyber attacks**: DDoS or ransomware
- **Human error**: Accidental deletion, misconfiguration

### Scenario: Single-Region Design (No DR)

\`\`\`
All Users → US-East Region
(No backup region)
\`\`\`

**Architecture:**
\`\`\`
[Users] ──> [Load Balancer] ──> [App Servers] ──> [Database]
                                              US-East Only
                                              (No Backup)
\`\`\`

### Problems with No Disaster Recovery

#### 1. **Complete Data Loss Risk**

- If region fails → **All data potentially lost**
- **No backup** - everything in one place
- **No recovery** - cannot restore service
- **Business-ending** - company may not recover

#### 2. **Extended Downtime**

- If region fails → **Days or weeks to recover**
- **No automatic failover** - manual recovery required
- **Revenue loss** - no sales during downtime
- **Customer trust** - users lose confidence

#### 3. **No Business Continuity**

- **Cannot process orders** during disaster
- **Cannot serve customers** - complete outage
- **Competitive disadvantage** - competitors still operating
- **Regulatory issues** - may violate SLAs

## When Do You Need Disaster Recovery?

✅ **Use Disaster Recovery When:**

1. **Critical business system** - Cannot afford extended downtime
2. **Financial transactions** - Orders, payments, banking
3. **Regulatory requirements** - Must meet uptime SLAs
4. **Customer trust** - Users expect high availability
5. **Data protection** - Cannot lose customer data

❌ **Don't Need Disaster Recovery When:**

1. **Non-critical systems** - Can tolerate downtime
2. **Development/staging** - Not production
3. **Low-value data** - Data loss acceptable
4. **Budget constraints** - DR is expensive

## Key Metrics: RTO and RPO

### RTO (Recovery Time Objective)
**How fast** can you recover?

- **RTO < 5 minutes**: Hot standby (expensive)
- **RTO < 1 hour**: Warm standby (moderate cost)
- **RTO < 24 hours**: Cold standby (cheap)
- **RTO > 24 hours**: Backup only (very cheap)

### RPO (Recovery Point Objective)
**How much data** can you afford to lose?

- **RPO < 1 minute**: Continuous replication (expensive)
- **RPO < 1 hour**: Frequent backups (moderate)
- **RPO < 24 hours**: Daily backups (cheap)
- **RPO > 24 hours**: Weekly backups (very cheap)

## Real-World Examples

- **E-commerce**: Amazon, eBay (cannot lose orders)
- **Banking**: Payment processing (regulatory requirement)
- **Healthcare**: Patient records (legal requirement)
- **SaaS platforms**: Customer data (trust requirement)`,
      },
      keyPoints: [
        'Disaster recovery protects against regional failures',
        'RTO = how fast to recover, RPO = how much data loss acceptable',
        'Use for critical systems that cannot afford downtime',
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

Let's start with the **simplest possible design** - everything in one region, no backup.

## Architecture Diagram

\`\`\`
                    ┌─────────────────┐
                    │   Users         │
                    │   Worldwide     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   App Servers   │
                    │   (10 instances)│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │
                    │   (PostgreSQL)  │
                    │   US-East Only  │
                    │   (No Backup)   │
                    └─────────────────┘
\`\`\`

## Configuration

- **Region**: US-East only
- **Database**: Single PostgreSQL instance
- **Backup**: None (or manual backups to S3)
- **Failover**: None

## What Works

✅ **Simple to implement** - No DR complexity
✅ **Low cost** - Only one region to run
✅ **Easy to manage** - Single system
✅ **Works for non-critical** - Fine if downtime acceptable

## Traffic Simulation

**Scenario**: 
- E-commerce platform
- 1M users placing orders
- 100k orders/day
- $10M revenue/day

**Normal Operation:**
- ✅ **Works perfectly** - All orders processed
- ✅ **Fast response** - Low latency
- ✅ **Cost-effective** - Single region

**When Disaster Strikes:**
- ❌ **Complete outage** - No orders processed
- ❌ **Data loss risk** - If database corrupted
- ❌ **Days to recover** - Manual restoration
- ❌ **$10M/day revenue loss** - Business impact`,
      },
      keyPoints: [
        'Brute force: single region, no backup',
        'Works fine until disaster strikes',
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

Let's see what happens when disaster strikes.

## Failure Scenario 1: Complete Regional Outage

**What happens**: US-East region completely fails (earthquake, power outage, etc.)

\`\`\`
                    ┌─────────────────┐
                    │   Users         │
                    │   Worldwide     │
                    └────────┬────────┘
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
                    │   (No Backup)   │
                    └─────────────────┘
\`\`\`

**Impact:**
- ❌ **100% of users** lose access
- ❌ **Complete system outage**
- ❌ **No orders processed** - $10M/day revenue loss
- ❌ **No failover** - manual recovery required
- ❌ **Days to recover** - RTO = days/weeks

**User Experience:**
- Users see: "Service unavailable" or "Connection timeout"
- **Cannot place orders** - complete downtime
- **Frustrated users** switch to competitors
- **Business reputation** damaged

---

## Failure Scenario 2: Data Loss

**What happens**: Database corrupted or accidentally deleted

**Impact:**
- ❌ **All customer data lost** - orders, accounts, inventory
- ❌ **No recovery** - if no recent backup
- ❌ **Business-ending** - may not recover from this
- ❌ **Regulatory issues** - may violate data protection laws
- ❌ **Customer trust** - permanently lost

**Recovery:**
- **If backup exists**: Restore from backup (hours/days)
- **If no backup**: **Permanent data loss**
- **RPO**: Could be days/weeks (if backup is old)

---

## Failure Scenario 3: Extended Downtime

**What happens**: Region fails and takes days to recover

**Timeline:**
- **Hour 1**: Region fails, system down
- **Hour 2-24**: Manual diagnosis and recovery attempts
- **Day 2-7**: Hardware replacement, data restoration
- **Day 8+**: System back online

**Impact:**
- ❌ **7+ days of downtime** - RTO = 7 days
- ❌ **$70M+ revenue loss** (7 days × $10M/day)
- ❌ **Customer churn** - users switch to competitors
- ❌ **Market share loss** - competitors gain advantage

---

## Failure Scenario 4: Partial Data Corruption

**What happens**: Database partially corrupted (some tables lost)

**Impact:**
- ❌ **Some orders lost** - inconsistent data
- ❌ **Inventory incorrect** - stock levels wrong
- ❌ **Customer accounts** - some data missing
- ❌ **Difficult to detect** - corruption may go unnoticed
- ❌ **Complex recovery** - need to restore specific tables

---

## Summary: Why Single-Region Breaks

| Problem | Impact | Severity |
|---------|--------|----------|
| Regional outage | Complete downtime | 🔴 Critical |
| Data loss | Business-ending | 🔴 Critical |
| Extended recovery | Days/weeks downtime | 🔴 Critical |
| Partial corruption | Data inconsistency | 🟡 High |

**Conclusion**: Single-region design **breaks** when disaster strikes. We need **cross-region disaster recovery** to solve these problems.`,
      },
      keyPoints: [
        'Regional disasters cause complete outages',
        'Data loss can be business-ending',
        'Recovery takes days/weeks without DR',
        'No automatic failover means manual recovery',
      ],
    },
    {
      id: 'disaster-recovery-solution',
      type: 'concept',
      title: 'The Solution: Cross-Region Disaster Recovery',
      description: 'How disaster recovery fixes the problems',
      estimatedMinutes: 12,
      content: {
        markdown: `# The Solution: Cross-Region Disaster Recovery

Let's fix the problems by implementing **cross-region disaster recovery** with hot standby.

## Architecture Diagram

\`\`\`
                    ┌─────────────────┐
                    │   Users         │
                    │   Worldwide     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   GeoDNS        │
                    │  (Health Checks)│
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
         ┌──────────▼──────────┐  ┌──▼──────────────┐
         │   US-East Region    │  │  EU-West Region │
         │   (Primary)         │  │  (Hot Standby)  │
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
         │  │  PRIMARY     │   │  │  │  STANDBY    │ │
         │  │  (Active)    │   │  │  │  (Hot)      │ │
         │  └──────┬───────┘   │  │  └─────┬──────┘ │
         │         │           │  │        │        │
         └─────────┼───────────┴──┼────────┼────────┘
                   │              │        │
                   │    ┌─────────▼────────▼────┐
                   │    │  Continuous Replication│
                   │    │  (Async, < 1 min lag)  │
                   │    └────────────────────────┘
                   │
         ┌──────────▼──────────┐
         │   S3 Backups        │
         │   (Hourly Snapshots) │
         └─────────────────────┘
\`\`\`

## Key Components

### 1. **Primary Region (US-East)**

- **Handles all traffic**: Normal operation
- **Database**: Writable PostgreSQL (primary)
- **Replication**: Continuously replicates to standby

### 2. **Hot Standby Region (EU-West)**

- **Ready to take over**: Fully configured and running
- **Database**: Read-only PostgreSQL (standby replica)
- **App servers**: Running but not receiving traffic
- **Replication**: Receives continuous updates from primary

### 3. **Health Monitoring**

- **Health checks**: Monitor primary region every 30 seconds
- **Automatic detection**: Detects failure within 1 minute
- **DNS failover**: Automatically switches DNS to standby

### 4. **Backup Strategy**

- **Continuous replication**: Primary → Standby (< 1 min lag)
- **Hourly snapshots**: S3 backups for point-in-time recovery
- **Cross-region backups**: Backups stored in different region

## How It Fixes the Problems

### ✅ Problem 1: Regional Outage → FIXED

**Before (No DR):**
- US-East fails → **Complete outage, days to recover**

**After (Hot Standby):**
- US-East fails → **Automatic failover to EU-West**
- **RTO < 5 minutes** - System back online quickly
- **Users continue** - Minimal disruption
- **Automatic** - No manual intervention needed

**Result**: **Minutes to recover** instead of days

---

### ✅ Problem 2: Data Loss → FIXED

**Before (No DR):**
- Database corrupted → **Complete data loss**

**After (Hot Standby):**
- Database corrupted → **Standby has recent copy**
- **RPO < 1 minute** - Maximum 1 minute of data loss
- **S3 backups** - Can restore to any point in time
- **Multiple backups** - Redundant protection

**Result**: **Minimal data loss** (1 minute max)

---

### ✅ Problem 3: Extended Downtime → FIXED

**Before (No DR):**
- Recovery takes **days/weeks**

**After (Hot Standby):**
- Recovery takes **< 5 minutes** (automatic failover)
- **Hot standby ready** - No setup time needed
- **Automatic promotion** - Standby becomes primary
- **Seamless transition** - Users barely notice

**Result**: **Minutes of downtime** instead of days

---

## Failover Process

### Step 1: Detection (30 seconds)
\`\`\`
Health check fails → Primary region down detected
\`\`\`

### Step 2: Promotion (2 minutes)
\`\`\`
Standby database promoted to primary
App servers in standby region activated
\`\`\`

### Step 3: DNS Switch (1 minute)
\`\`\`
DNS updated to point to standby region
Traffic routed to new primary
\`\`\`

### Step 4: Recovery Complete (< 5 minutes total)
\`\`\`
Users can access system again
RTO < 5 minutes ✅
\`\`\`

## RTO and RPO Achieved

### RTO (Recovery Time Objective)
- **Target**: < 5 minutes
- **Achieved**: ~3-5 minutes (automatic failover)
- **Method**: Hot standby with automatic promotion

### RPO (Recovery Point Objective)
- **Target**: < 1 minute
- **Achieved**: < 1 minute (continuous replication lag)
- **Method**: Async replication with < 1 min lag

## Trade-offs

### ✅ Advantages

1. **Fast recovery** - RTO < 5 minutes
2. **Minimal data loss** - RPO < 1 minute
3. **Automatic failover** - No manual intervention
4. **High availability** - 99.99% uptime
5. **Business continuity** - Operations continue

### ❌ Disadvantages

1. **High cost** - Two full regions running
2. **Complexity** - Replication, monitoring, failover
3. **Replication lag** - Small window for data loss
4. **Failover testing** - Need to test regularly

## When to Use

✅ **Use Hot Standby DR When:**
- Critical business system
- Cannot afford downtime (RTO < 5 min)
- Cannot lose data (RPO < 1 min)
- Regulatory requirements
- Budget allows for two regions

❌ **Don't Use When:**
- Non-critical system
- Can tolerate downtime (use cold standby)
- Budget constraints (use backups only)
- Development/staging environments`,
      },
      keyPoints: [
        'Hot standby: secondary region ready to take over immediately',
        'RTO < 5 minutes, RPO < 1 minute with continuous replication',
        'Automatic failover with health checks and DNS switching',
        'Expensive but necessary for critical systems',
      ],
    },
  ],
  nextLessons: ['basic-multiregion', 'backup-strategies'],
};

