import type { SystemDesignLesson } from '../../../types/lesson';

export const globalCdnLesson: SystemDesignLesson = {
  id: 'sd-global-cdn',
  slug: 'global-cdn',
  title: 'Global CDN Architecture',
  description: 'Learn when and why to use global CDN, see how serving content from a single origin breaks, and how CDN fixes it',
  difficulty: 'intermediate',
  estimatedMinutes: 35,
  category: 'patterns',
  tags: ['cdn', 'edge-caching', 'content-delivery', 'global-distribution', 'static-assets'],
  prerequisites: ['basic-components', 'understanding-scale'],

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 3,

  learningObjectives: [
    'Understand when to use global CDN architecture',
    'Identify problems with serving content from single origin',
    'Learn how edge caching works',
    'Understand cache invalidation strategies',
    'See the progression from brute force to optimized design',
  ],
  conceptsCovered: [
    {
      id: 'edge-caching',
      name: 'Edge Caching',
      type: 'pattern',
      difficulty: 3,
      description: 'Cache content at edge locations close to users for low latency',
    },
    {
      id: 'origin-servers',
      name: 'Origin Servers',
      type: 'component',
      difficulty: 2,
      description: 'Source of truth for content, CDN pulls from origin on cache miss',
    },
    {
      id: 'cache-invalidation',
      name: 'Cache Invalidation',
      type: 'technique',
      difficulty: 3,
      description: 'Strategies to update cached content when origin changes',
    },
  ],
  relatedChallenges: ['global-cdn'],
  stages: [
    {
      id: 'why-global-cdn',
      type: 'concept',
      title: 'Why Global CDN?',
      description: 'Understanding the problem that CDN solves',
      estimatedMinutes: 8,
      content: {
        markdown: `# Why Global CDN?

## The Problem: Global Users, Single Origin

Imagine you're building a **video streaming platform** (like YouTube) - users worldwide watch videos, and you need to serve massive video files efficiently.

### Scenario: Single Origin Design (Brute Force)

\`\`\`
Users in Asia → US-East Origin Server
Users in Europe → US-East Origin Server
Users in Americas → US-East Origin Server
\`\`\`

**Architecture:**
\`\`\`
[Users Asia]    ──┐
[Users Europe]  ──┼──> [Load Balancer] ──> [Origin Servers] ──> [S3 Storage]
[Users Americas] ─┘                                    US-East Only
\`\`\`

### Problems with Single Origin Design

#### 1. **High Latency for Distant Users**

- **User in Asia** downloading video from **US-East**: ~300-500ms latency
- **User in Europe** downloading video from **US-East**: ~150-200ms latency
- **User in US** downloading video from **US-East**: ~20-50ms latency
- **Poor user experience** - slow video buffering, long load times

#### 2. **Bandwidth Costs**

- All video traffic goes through **one origin** in US-East
- **Cross-continental bandwidth** is expensive
- **Bandwidth costs scale linearly** with users
- **Wasted bandwidth** serving same content repeatedly

#### 3. **Origin Server Overload**

- **10M requests/sec** all hitting one origin
- **Single point of failure** - if origin fails, all users affected
- **Cannot scale** origin fast enough for global traffic
- **Expensive** to scale origin servers

#### 4. **No Caching Benefits**

- Same video downloaded **millions of times** from origin
- **No reuse** of previously downloaded content
- **Wasted resources** - origin serves same content repeatedly

## When Do You Need Global CDN?

✅ **Use Global CDN When:**

1. **Global user base** - Users in multiple geographic regions
2. **Static or cacheable content** - Videos, images, CSS, JS files
3. **High traffic volume** - Millions of requests per second
4. **Low latency requirement** - Users need fast content delivery (< 50ms)
5. **Cost optimization** - Want to reduce bandwidth costs

❌ **Don't Use Global CDN When:**

1. **Dynamic content** - Content changes per user/request
2. **Single region users** - All users in one geographic area
3. **Low traffic** - Not enough traffic to justify CDN costs
4. **Real-time data** - Stock prices, live scores (can't be cached)

## Real-World Examples

- **Video streaming**: YouTube, Netflix (videos cached at edge)
- **Image hosting**: Instagram, Imgur (images served from CDN)
- **Software downloads**: App stores, game downloads
- **Websites**: Static assets (CSS, JS) served from CDN
- **Live streaming**: CDN for video chunks (HLS/DASH segments)

## Key Benefits

1. **Low Latency**: Content served from nearest edge (< 50ms)
2. **High Throughput**: Edge locations handle massive traffic
3. **Cost Savings**: Reduce origin bandwidth costs
4. **High Availability**: Multiple edge locations (no single point of failure)
5. **DDoS Protection**: CDN absorbs attack traffic`,
      },
      keyPoints: [
        'CDN caches content at edge locations close to users',
        'Use when you have global users and static/cacheable content',
        'Reduces latency, bandwidth costs, and origin load',
      ],
    },
    {
      id: 'brute-force-design',
      type: 'concept',
      title: 'Brute Force: Single Origin Design',
      description: 'Starting with the simplest design',
      estimatedMinutes: 7,
      content: {
        markdown: `# Brute Force: Single Origin Design

Let's start with the **simplest possible design** - serve all content from one origin.

## Architecture Diagram

\`\`\`
                    ┌─────────────────┐
                    │   DNS/Load      │
                    │   Balancer      │
                    └────────┬────────┘
                             │
                    ┌─────────┴─────────┐
                    │                   │
         ┌──────────▼──────────┐  ┌────▼──────────┐
         │  Users in Asia      │  │Users in Europe│
         └──────────┬──────────┘  └────┬───────────┘
                    │                 │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Origin Servers │
                    │   (10 instances)│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   S3 Storage    │
                    │  (Video Files)  │
                    │   US-East Only  │
                    └─────────────────┘
\`\`\`

## Configuration

- **Origin**: US-East only
- **Storage**: S3 bucket in US-East
- **CDN**: None (direct from origin)
- **Users**: Worldwide all connect to US-East

## What Works

✅ **Simple to implement** - No CDN complexity
✅ **Single source of truth** - All content in one place
✅ **Low initial cost** - No CDN fees
✅ **Easy to debug** - All requests go to one place
✅ **Works for small scale** - Fine if all users are in one region

## Traffic Simulation

**Scenario**: 
- 1M users in Asia watching videos
- 1M users in Europe watching videos
- 2M users in Americas watching videos

**Traffic:**
- **Total requests**: 10M requests/sec
- **Asia → US-East**: 400ms latency (cross-continent)
- **Europe → US-East**: 200ms latency (cross-continent)
- **Americas → US-East**: 30ms latency (same region)

**Result**: 
- ✅ Works functionally
- ❌ Poor experience for Asian/European users (200-400ms latency)
- ❌ High bandwidth costs (all traffic through US-East)
- ❌ Origin servers overloaded`,
      },
      keyPoints: [
        'Brute force: single origin, no CDN',
        'Works functionally but has latency and cost issues',
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

Let's see what happens when we stress test the single origin design.

## Failure Scenario 1: High Latency for Distant Users

**What happens**: Asian and European users experience slow video loading

\`\`\`
                    ┌─────────────────┐
                    │   DNS/Load      │
                    │   Balancer      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐                       ┌────▼──────────┐
│  Users in Asia  │                       │Users in Europe│
│                 │                       │               │
│ 400ms latency   │                       │ 200ms latency │
│ Slow buffering  │                       │ Slow buffering│
└─────────────────┘                       └───────────────┘
                             │
                    ┌────────▼────────┐
                    │  Origin Servers │
                    │   US-East Only  │
                    └─────────────────┘
\`\`\`

**Impact:**
- ❌ **Asian users**: 400ms latency → videos buffer slowly
- ❌ **European users**: 200ms latency → noticeable delay
- ❌ **Poor user experience** - users abandon videos
- ❌ **Higher bounce rate** - users leave due to slow loading

**User Experience:**
- Asian user clicks video → **400ms delay** before playback starts
- **Frequent buffering** during playback
- **Users abandon** slow-loading videos
- **Lower engagement** - users watch fewer videos

---

## Failure Scenario 2: Origin Server Overload

**What happens**: Origin servers cannot handle 10M requests/sec

**Origin Capacity:**
- 10 origin servers: **1M requests/sec each = 10M total**
- **At capacity** - no headroom

**Traffic:**
- **10M requests/sec** from all users worldwide
- **Exceeds capacity** during peak hours

**Result:**
- ❌ **Requests fail** - 500 errors, timeouts
- ❌ **Users see errors**: "Video unavailable, please try again"
- ❌ **Cannot scale fast enough** - adding servers takes time
- ❌ **Poor user experience** - random failures

---

## Failure Scenario 3: Bandwidth Costs

**What happens**: All video traffic goes through US-East origin

**Bandwidth Costs:**
- **10M requests/sec** × **5MB average video chunk** = **50TB/sec**
- **Cross-continental bandwidth**: $0.05/GB
- **Monthly cost**: ~$200M in bandwidth alone

**Result:**
- ❌ **Extremely expensive** - bandwidth costs dominate
- ❌ **Not sustainable** - costs grow with users
- ❌ **Wasted bandwidth** - same content downloaded repeatedly

---

## Failure Scenario 4: Origin Failure

**What happens**: US-East origin completely fails

**Impact:**
- ❌ **100% of users** lose access
- ❌ **Complete outage** - no videos available
- ❌ **No failover** - no backup origin
- ❌ **Revenue loss** - no ad impressions, no subscriptions

---

## Summary: Why Single Origin Breaks

| Problem | Impact | Severity |
|---------|--------|----------|
| High latency | Poor UX for distant users | 🔴 Critical |
| Origin overload | Errors under load | 🔴 Critical |
| Bandwidth costs | Unsustainable expenses | 🔴 Critical |
| Origin failure | Complete outage | 🔴 Critical |

**Conclusion**: Single origin design **breaks** for global content delivery. We need **global CDN** to solve these problems.`,
      },
      keyPoints: [
        'High latency makes distant users unhappy',
        'Origin servers get overloaded under high traffic',
        'Bandwidth costs become unsustainable',
        'Single origin is a single point of failure',
      ],
    },
    {
      id: 'global-cdn-solution',
      type: 'concept',
      title: 'The Solution: Global CDN',
      description: 'How global CDN fixes the problems',
      estimatedMinutes: 10,
      content: {
        markdown: `# The Solution: Global CDN

Let's fix the problems by implementing **global CDN architecture**.

## Architecture Diagram

\`\`\`
                    ┌─────────────────┐
                    │   Users         │
                    │   Worldwide     │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
         ┌──────────▼──────────┐  ┌──▼──────────────┐
         │   CDN Edge (Asia)   │  │ CDN Edge (Europe)│
         │   (100+ locations)  │  │ (100+ locations) │
         │                     │  │                 │
         │  Cache: Popular     │  │ Cache: Popular  │
         │  Videos             │  │ Videos          │
         └──────────┬──────────┘  └──┬───────────────┘
                    │                │
                    │    ┌───────────┴───────────┐
                    │    │  On Cache Miss:       │
                    │    │  Pull from Origin     │
                    │    └───────────┬───────────┘
                    │                │
         ┌──────────▼────────────────▼──────────┐
         │      Origin Servers (Regional)      │
         │      US-East, EU-West, Asia-Pacific  │
         └──────────┬───────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │   S3 Storage        │
         │   (Source of Truth) │
         └─────────────────────┘
\`\`\`

## Key Components

### 1. **CDN Edge Locations (100+)**

- **Cached content**: Popular videos stored at edge
- **Low latency**: < 50ms to users
- **High throughput**: Each edge handles millions of requests
- **Geographic distribution**: Edge in every major city

### 2. **Origin Servers (Regional)**

- **Source of truth**: Original content stored here
- **Multiple regions**: US-East, EU-West, Asia-Pacific
- **Failover**: If one origin fails, CDN uses another
- **Cache miss handling**: CDN pulls from origin when content not cached

### 3. **S3 Storage**

- **Source of truth**: All videos stored in S3
- **Durability**: 99.999999999% (11 nines)
- **Origin servers** fetch from S3 and serve to CDN

## How It Fixes the Problems

### ✅ Problem 1: High Latency → FIXED

**Before (Single Origin):**
- Asia → US-East: **400ms latency**

**After (Global CDN):**
- Asia → Asia CDN edge: **20ms latency** ✅
- Europe → Europe CDN edge: **20ms latency** ✅
- US → US CDN edge: **20ms latency** ✅

**Result**: **20x latency improvement** for distant users

---

### ✅ Problem 2: Origin Overload → FIXED

**Before (Single Origin):**
- 10M requests/sec → **One origin** (overloaded)

**After (Global CDN):**
- 10M requests/sec → **100+ edge locations** (distributed)
- Each edge handles **~100k requests/sec**
- Origin only handles **cache misses** (~1M requests/sec)

**Result**: **10x reduction** in origin load

---

### ✅ Problem 3: Bandwidth Costs → FIXED

**Before (Single Origin):**
- All traffic through US-East: **$200M/month**

**After (Global CDN):**
- Most traffic from edge (cheaper): **$20M/month**
- Only cache misses from origin: **$2M/month**
- **Total: $22M/month** (90% cost reduction)

**Result**: **90% cost savings** on bandwidth

---

### ✅ Problem 4: Origin Failure → FIXED

**Before (Single Origin):**
- US-East fails → **100% users lose access**

**After (Global CDN):**
- US-East origin fails → **CDN uses EU-West origin**
- **Cached content** still available at edges
- **Only new content** affected (cache misses)

**Result**: **Partial availability** instead of complete outage

---

## Traffic Flow

### Cache Hit (90% of requests):
\`\`\`
User in Asia → Asia CDN Edge → Video (cached) ✅
Latency: 20ms
\`\`\`

### Cache Miss (10% of requests):
\`\`\`
User in Asia → Asia CDN Edge → Cache Miss
                ↓
         Asia Origin Server → S3 Storage
                ↓
         Video → CDN Edge (cached for future)
                ↓
         Video → User
Latency: 200ms (first time), 20ms (subsequent)
\`\`\`

## Cache Invalidation

When video is updated:
1. **Purge CDN cache** - Remove old version from all edges
2. **Upload new version** - Store in S3
3. **CDN fetches new version** - On next cache miss
4. **New version cached** - At all edge locations

**Strategies:**
- **Versioned URLs**: \`video.mp4?v=2\` (bust cache)
- **Cache tags**: Invalidate by tag (e.g., user_id)
- **TTL-based**: Cache expires after time period

## Trade-offs

### ✅ Advantages

1. **Low latency** for all users (< 50ms)
2. **High throughput** (distributed across edges)
3. **Cost savings** (90% bandwidth reduction)
4. **High availability** (multiple edges, multiple origins)
5. **DDoS protection** (CDN absorbs attacks)

### ❌ Disadvantages

1. **Cache invalidation** complexity
2. **Eventual consistency** (cache may be stale)
3. **CDN costs** (though usually cheaper than origin bandwidth)
4. **Cache miss latency** (first request slower)

## When to Use

✅ **Use Global CDN When:**
- Global user base
- Static or cacheable content (videos, images, CSS, JS)
- High traffic volume (millions of requests/sec)
- Low latency requirement
- Want to reduce bandwidth costs

❌ **Don't Use When:**
- Dynamic content (per-user customization)
- Single region users
- Low traffic (CDN costs not justified)
- Real-time data (can't be cached)`,
      },
      keyPoints: [
        'CDN caches content at edge locations close to users',
        'Fixes latency, bandwidth costs, and origin load',
        'Cache hits are fast, cache misses pull from origin',
        'Perfect for static/cacheable content with global users',
      ],
    },
  ],
  nextLessons: ['basic-multiregion', 'cache-invalidation'],
};

