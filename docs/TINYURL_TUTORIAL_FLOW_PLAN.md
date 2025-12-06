# TinyURL Guided Tutorial - Revised Flow Plan

## Overview

This document outlines the revised structure for the TinyURL guided tutorial, following the correct interview pedagogy:

1. **FRs First**: Gather functional requirements → Build brute-force single-machine solution
2. **NFRs Second**: Gather non-functional requirements in **interview discovery order** → Scale and optimize

## Key Principles

> **"First make it WORK, then make it SURVIVE, then make it SCALE"**

### NFR Teaching Order: Interview Discovery Order

We teach NFRs in the order you should **discover** them in an interview:

| Order | NFR | Why First? |
|-------|-----|------------|
| 1 | **Throughput (RPS)** | You NEED scale info before designing for availability/latency |
| 2 | **Availability** | Once you know scale, design for uptime |
| 3 | **Latency** | Optimize response times at scale |
| 4 | **Storage** | Plan for data growth |

**Rationale**: You can't answer "Can we achieve 99.99% availability?" without first knowing "At what scale?" Throughput tells you:
- Read:Write ratio (100:1 = cache aggressively)
- Peak RPS (35K = need multiple servers)
- Growth rate (plan for 10x scale)

---

## Phase 1: Functional Requirements (Steps 0-2)

### Step 0: Requirements Gathering (FRs Only)
**Goal**: Teach candidates to ask clarifying questions about WHAT the system does

**Teaching Content**:
- Why you should NEVER jump straight to design
- Critical questions to ask about core functionality
- What's in scope vs out of scope

**Confirmed FRs**:
- FR-1: Shorten URLs (create short code from long URL)
- FR-2: Redirect URLs (given short code, redirect to original)
- FR-3: Unique Codes (each short code maps to exactly one URL)

**Key Insight**: "We're NOT asking about traffic volume, latency SLAs, or availability yet!"

---

### Step 1: Brute Force Solution - Single Machine
**Goal**: Build the simplest possible solution that satisfies all FRs

**Architecture**:
```
┌────────┐        ┌─────────────┐
│ Client │ ────→  │  App Server │
└────────┘        │  (in-memory)│
                  └─────────────┘
```

**Teaching Content**:
- Start with Client → App Server connection
- In-memory storage (Python dict) is FINE for now
- Focus on correctness, not performance

**Celebration**: "FRs satisfied! Your basic URL shortener works!"

---

### Step 2: Add Persistence
**Goal**: Make data survive server restarts

**Story**: "Server crashed at 3 AM. All URLs are gone. Users are furious!"

**Architecture**:
```
┌────────┐        ┌─────────────┐        ┌──────────┐
│ Client │ ────→  │  App Server │ ────→  │ Database │
└────────┘        └─────────────┘        └──────────┘
```

**Teaching Content**:
- Why in-memory storage is risky
- Database provides durability
- Still a single machine - that's okay for now

---

## Phase 2: Non-Functional Requirements (Steps 3+)

### Step 3: NFR Gathering - Throughput (RPS)
**Goal**: Teach candidates to ask about SCALE before optimizing

**NEW: Throughput Teaching Panel**

This is the critical step the user requested. We need to teach:

#### 3.1 Why Throughput Matters
- What is RPS (requests per second)?
- Why it's the first NFR to ask about
- How it drives ALL architectural decisions

#### 3.2 Key Questions to Ask
1. **"What's the expected daily active users (DAU)?"**
   - Answer: "100 million DAU"
   - Insight: This tells us scale

2. **"How many URL shortens per day?"**
   - Answer: "10 million writes/day"
   - Insight: ~115 writes/second average

3. **"How many redirects per day?"**
   - Answer: "1 billion redirects/day"
   - Insight: ~11,500 reads/second average

4. **"What's the peak-to-average ratio?"**
   - Answer: "Peak is 3x average"
   - Insight: Need to handle 35,000 reads/second at peak

#### 3.3 The Math
```
WRITES:
- 10M URLs/day ÷ 86,400 sec/day = 115 writes/sec average
- Peak (3x): 345 writes/sec

READS:
- 1B redirects/day ÷ 86,400 sec/day = 11,574 reads/sec average
- Peak (3x): 34,722 reads/sec

READ:WRITE RATIO = 100:1 (read-heavy!)
```

#### 3.4 Key Insight
> **"This is a READ-HEAVY system. 100 reads for every 1 write. This tells us: OPTIMIZE FOR READS!"**

#### 3.5 Why This Matters for Architecture
| Read:Write Ratio | Implication |
|-----------------|-------------|
| 100:1 | Cache aggressively! Most requests can be served from cache |
| High read RPS | Need read replicas or caching |
| Low write RPS | Single primary database might be enough |

---

### Step 4: Single Machine Limits
**Goal**: Show that single machine can't handle the load

**Story**: "Your app server CPU is at 100%. Users are getting timeouts!"

**Teaching Content**:
- A single server handles ~1,000-10,000 RPS
- At 35,000 peak RPS, one server isn't enough
- Options: vertical scaling (bigger machine) vs horizontal scaling (more machines)

---

### Step 5: Caching - Optimize Reads
**Goal**: Add cache to handle read-heavy workload

**Story**: "Every redirect hits the database. 35,000 queries/second is crushing it!"

**Architecture**:
```
┌────────┐        ┌─────────────┐        ┌───────┐
│ Client │ ────→  │  App Server │ ────→  │ Cache │
└────────┘        └─────────────┘        │(Redis)│
                         │               └───────┘
                         │                   ↑
                         └───────────────────┘
                                   │
                              ┌──────────┐
                              │ Database │
                              └──────────┘
```

**Teaching Content**:
- Cache-aside pattern: Check cache first, DB on miss
- With 95% cache hit rate, only 5% hit DB
- 35,000 reads → 1,750 DB queries (much better!)

---

### Step 6: Horizontal Scaling - Multiple Servers
**Goal**: Add load balancer to distribute traffic

**Architecture**:
```
┌────────┐      ┌──────────────┐      ┌─────────────┐
│ Client │ ──→  │Load Balancer │ ──→  │ App Server 1│
└────────┘      └──────────────┘      │ App Server 2│
                                      │ App Server N│
                                      └─────────────┘
```

**Teaching Content**:
- Stateless servers scale horizontally
- Load balancer distributes requests
- N servers = N × capacity

---

### Step 7: Database Replication
**Goal**: Prevent single point of failure in database

**Architecture**:
```
              ┌──────────────┐
              │   Primary    │ ←── writes
              └──────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Replica 1│ │ Replica 2│ │ Replica 3│ ←── reads
    └──────────┘ └──────────┘ └──────────┘
```

**Teaching Content**:
- Single leader replication for TinyURL
- Replicas handle read traffic
- Automatic failover if primary dies

---

### Step 8: Latency SLAs
**Goal**: Meet latency requirements

**NFR Questions**:
- "What's the acceptable redirect latency?"
- Answer: "p99 < 100ms"

**Teaching Content**:
- What is p99 latency?
- How to measure and monitor
- What affects latency (network, DB queries, etc.)

---

### Step 9: Availability SLAs
**Goal**: Meet availability requirements

**NFR Questions**:
- "What's the required uptime?"
- Answer: "99.9% (three nines)"

**Teaching Content**:
- 99.9% = 8.76 hours downtime/year
- Eliminate single points of failure
- Multi-region for disaster recovery

---

### Step 10: Storage Calculations
**Goal**: Plan for data growth

**NFR Questions**:
- "How long do we store URLs?"
- Answer: "Forever (or 10 years)"

**Teaching Content**:
- Storage calculation:
  - 10M URLs/day × 365 days × 10 years = 36.5 billion URLs
  - Each URL: ~500 bytes (short code + long URL + metadata)
  - Total: ~18 TB
- Sharding strategies for large datasets

---

## NFR Teaching Order Rationale

### Why Throughput First?

```
Interview Dialog:

Candidate: "Before I design, I need to understand the scale."
Interviewer: "Great question!"

Candidate: "How many URLs are shortened per day?"
Interviewer: "10 million creates per day."

Candidate: "And how many redirects?"
Interviewer: "1 billion redirects per day."

Candidate: "So that's roughly 100:1 read-to-write ratio.
           This is READ-HEAVY - I'll optimize for reads with caching."
Interviewer: "Excellent thinking!"
```

### The Math Unlocks Everything

Once you know:
- **10M writes/day** → 115 writes/sec average → 345 writes/sec peak
- **1B reads/day** → 11,500 reads/sec average → 35,000 reads/sec peak
- **Read:Write = 100:1** → Cache is critical!

You can then reason about:
- **Availability**: "Can one server handle 35K RPS? No → need horizontal scaling"
- **Latency**: "Can we hit p99 < 100ms at 35K RPS? Need caching for sure"
- **Storage**: "10M/day × 365 × 10 years = 36.5B records → need partitioning"

### NFR Order: Interview Discovery Order

| Order | NFR | Why? |
|-------|-----|------|
| 1 | **Throughput** | Tells you scale, read:write ratio, drives all other decisions |
| 2 | **Availability** | At this scale, how much downtime is acceptable? |
| 3 | **Latency** | At this scale, what response time is needed? |
| 4 | **Storage** | At this growth rate, how much data over time? |
| 5 | **Consistency** | For this use case, is eventual consistency OK? |
| 6 | **Cost** | What's the budget constraint? |

---

## Summary: Complete Tutorial Flow

| Step | Phase | Topic | Key Learning |
|------|-------|-------|--------------|
| 0 | FR | Requirements Gathering | Ask about WHAT, not HOW |
| 1 | FR | Brute Force (in-memory) | Just make it work first |
| 2 | FR | Add Persistence | Make it survive crashes |
| 3 | NFR | Throughput (RPS) | **Read:Write ratio drives architecture** |
| 4 | NFR | Single Machine Limits | Understand capacity constraints |
| 5 | NFR | Caching | Optimize for reads |
| 6 | NFR | Horizontal Scaling | Distribute load |
| 7 | NFR | Database Replication | Eliminate SPOF |
| 8 | NFR | Latency | Meet p99 SLAs |
| 9 | NFR | Availability | Three nines uptime |
| 10 | NFR | Storage | Plan for growth |

---

## Next Steps

1. **Implement Step 3 (Throughput NFR Gathering)**:
   - Create a new teaching panel for NFR questions
   - Show the math for RPS calculations
   - Explain read:write ratio implications

2. **Reorganize existing steps** to match this flow

3. **Add metrics/simulation** to show capacity limits visually