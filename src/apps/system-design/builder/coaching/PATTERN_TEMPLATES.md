# Coach Configuration Pattern Templates

## Purpose

This guide provides **copy-paste templates** for rapidly creating coach configurations for new problems. Use these templates to maintain consistency and reduce creation time from 60 minutes to 15-20 minutes per problem.

---

## 🎯 Quick Start: 5-Step Process

1. **Identify the archetype** (CRUD, social_feed, cdn, etc.)
2. **Copy the appropriate template** from below
3. **Fill in problem-specific details** (problem ID, titles, components)
4. **Customize 3-5 key messages** per level
5. **Review and adjust hints** for specificity

---

## Archetype Classification

First, classify your problem into one of these archetypes:

| Archetype | Examples | Key Focus |
|-----------|----------|-----------|
| `crud` | Trello, Todo App, Notion | CRUD ops, relational data, consistency |
| `read_heavy` | TinyURL, Pastebin | Caching strategies, read optimization |
| `write_heavy` | Analytics, Logging | Write buffering, batch processing |
| `social_feed` | Twitter, Instagram, Facebook | Fanout, timelines, recommendations |
| `messaging` | Slack, WhatsApp, Discord | WebSocket, presence, message ordering |
| `cdn` | Netflix, YouTube, Static CDN | Edge caching, video streaming, global delivery |
| `ecommerce` | Amazon, Shopify, Stripe | Inventory, transactions, payment processing |
| `geospatial` | Uber, DoorDash, Google Maps | Location indexing, proximity search, routing |
| `search` | Google, Elasticsearch | Inverted index, ranking, autocomplete |
| `realtime` | Gaming, Collaborative editing | Low latency, conflict resolution, CRDT |

---

## Template 1: CRUD Pattern (Trello, Notion, Todo App)

### Structure

**Level 1:** Basic CRUD operations
**Level 2:** Collaboration/real-time updates
**Level 3:** Scale and concurrency

### Template

```typescript
import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * [PROBLEM_NAME] Coach Configuration
 * Pattern: CRUD + Collaboration
 * Focus: [PRIMARY_FOCUS_AREAS]
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic CRUD Operations',
  goal: 'Build a system that supports create, read, update, and delete operations',
  description: 'Learn fundamental CRUD architecture',
  estimatedTime: '15 minutes',
  learningObjectives: [
    'Understand CRUD operations',
    'Design relational data model',
    'Implement basic API endpoints',
    'Connect client-server-database',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to [PROBLEM_NAME]! [CONTEXT_SENTENCE]. You\'ll learn [KEY_LEARNING].',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: [LEVEL_1_GOAL]\n\nUsers should be able to:\n• [FEATURE_1]\n• [FEATURE_2]\n• [FEATURE_3]\n\nStart with: Client → App Server → Database',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ Great! App Server will handle [PRIMARY_OPERATIONS]. Now add a database!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL added! Perfect for:\n• [BENEFIT_1]\n• [BENEFIT_2]\n• [BENEFIT_3]',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Connect: Client → App Server → Database',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Your CRUD system works! Next: add collaboration features!',
      messageType: 'celebration',
      icon: '🎉',
      action: { type: 'next_level' },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 CRUD needs: client, app server, database',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Add App Server and PostgreSQL. Connect: Client → App → PostgreSQL',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 180 },
      hint: '🎯 Solution: App Server + PostgreSQL, connected in sequence',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Real-Time Collaboration',
  goal: 'Enable multiple users to collaborate in real-time',
  description: 'Add WebSocket and Pub/Sub',
  estimatedTime: '20 minutes',
  learningObjectives: [
    'Implement WebSocket connections',
    'Use Redis Pub/Sub for broadcasting',
    'Handle concurrent updates',
    'Design for eventual consistency',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2: Real-time collaboration! [EXPLAIN_NEED_FOR_REALTIME]',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'websocket' },
      message: '✅ WebSocket enables bidirectional communication for real-time updates!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis Pub/Sub broadcasts changes across all app servers!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Real-time collaboration works! Next: scale to thousands of users!',
      messageType: 'celebration',
      icon: '🎉',
      action: { type: 'next_level' },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Real-time needs WebSocket. Multi-server needs Pub/Sub.',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Add WebSocket + Redis Pub/Sub',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 240 },
      hint: '🎯 WebSocket for clients, Redis for server-to-server broadcasting',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Scale to [HIGH_CONCURRENCY]',
  goal: 'Handle high concurrency with caching and load balancing',
  description: 'Scale horizontally',
  estimatedTime: '25 minutes',
  learningObjectives: [
    'Implement caching layer',
    'Add load balancing',
    'Handle concurrent writes',
    'Optimize for high read loads',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3: Scale to [N] concurrent users!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ Database bottleneck! Add caching to reduce load.',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis cache reduces DB reads by 80-90%!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 You\'ve scaled [PROBLEM] to [N] users! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: { type: 'next_problem', problemId: '[NEXT_PROBLEM]' },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 High reads? Add cache. High concurrency? Add load balancer.',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Redis cache + Load Balancer',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 300 },
      hint: '🎯 Add Redis between App and DB. Add LB before App Servers.',
      hintLevel: 3,
    },
  ],
};

export const [PROBLEM_ID]CoachConfig: ProblemCoachConfig = {
  problemId: '[PROBLEM_ID]',
  archetype: 'crud',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '[LEVEL_1_CELEBRATION]',
    2: '[LEVEL_2_CELEBRATION]',
    3: '[PROBLEM_COMPLETE_CELEBRATION]',
  },
  nextProblemRecommendation: '[NEXT_PROBLEM_ID]',
  prerequisites: [],
  estimatedTotalTime: '60 minutes',
};

export function get[ProblemName]LevelConfig(level: number): LevelCoachConfig | null {
  return [PROBLEM_ID]CoachConfig.levelConfigs[level] || null;
}
```

---

## Template 2: Social Feed Pattern (Twitter, Instagram, Facebook)

### Structure

**Level 1:** Basic posts and feeds
**Level 2:** Fanout-on-write optimization
**Level 3:** Hybrid fanout for celebrities

### Key Messages Pattern

```typescript
// Level 1: Foundation
'Post content and view personalized feed'

// Level 2: Fanout Problem
'Timeline queries are slow (massive JOINs). Pre-compute with fanout-on-write!'

// Level 3: Celebrity Problem
'Celebrities have millions of followers. Fanout-on-write breaks. Use hybrid approach.'
```

### Components by Level

```typescript
// Level 1
['app_server', 'postgresql']

// Level 2
['redis', 'message_queue', 'workers']

// Level 3
['load_balancer', 'redis_cache', 'cdn']
```

---

## Template 3: CDN Pattern (Netflix, YouTube, Static Content)

### Structure

**Level 1:** Basic CDN with origin
**Level 2:** Optimize cache hit rate
**Level 3:** Edge computing and multi-region

### Key Messages Pattern

```typescript
// Level 1
'Serve content from edge locations. Cache hit = 10ms, Cache miss = 150ms'

// Level 2
'70% hit rate is too low. Optimize TTL, cache warming, versioned URLs'

// Level 3
'Dynamic content (resizing, personalization) needs edge computing'
```

### TTL Recommendations by Asset Type

```typescript
const ttlRecommendations = {
  images: '7 days',
  css_js_versioned: '1 year',
  html: '5 minutes',
  api_responses: '60 seconds',
  user_profiles: '1 hour',
};
```

---

## Template 4: Read-Heavy Pattern (TinyURL, Pastebin)

### Structure

**Level 1:** Basic read/write
**Level 2:** Add caching layer
**Level 3:** Scale reads with cache strategy

### Caching Strategy Decision Tree

```
Read/Write Ratio?
├─ 90%+ reads (TinyURL, Pastebin)
│  └─ Use cache_aside
│     └─ TTL: Based on access pattern
├─ Mixed read/write (Social media)
│  └─ Use write_through for consistency
│     └─ Invalidate on write
└─ Write-heavy (Analytics)
   └─ Use write_behind
      └─ Batch to DB
```

---

## Common Message Templates

### Welcome Messages (on_first_visit)

```typescript
// CRUD
'👋 Welcome to [PROBLEM]! This is a classic CRUD problem...'

// Social
'👋 Welcome to [PROBLEM]! You\'re building a social platform where...'

// CDN
'👋 Welcome to [PROBLEM]! You\'ll learn how to deliver content globally...'

// Real-time
'👋 Welcome to [PROBLEM]! This problem focuses on low-latency, real-time...'
```

### Component Addition Confirmations

```typescript
// App Server
'✅ Great! App Server will handle [PRIMARY_FUNCTION]. Now add [NEXT_COMPONENT]!'

// Database
'✅ [DB_TYPE] added! Perfect for:\n• [BENEFIT_1]\n• [BENEFIT_2]\n• [BENEFIT_3]'

// Cache
'✅ Redis/Memcached added! This will reduce [BOTTLENECK] by [PERCENTAGE]!'

// Load Balancer
'✅ Load Balancer added! Distributes traffic across [N] servers for [BENEFIT].'

// CDN
'✅ CDN added! Serves content from edge locations. Cache hit = [X]ms, miss = [Y]ms.'

// Message Queue
'✅ Message Queue added! Enables async processing for [USE_CASE].'

// WebSocket
'✅ WebSocket added! Bidirectional real-time communication for [USE_CASE].'
```

### Bottleneck Detection

```typescript
// Database
'⚠️ Database bottleneck! [REASON]. Solution: [ADD_COMPONENT]'

// High Latency
'⚠️ Latency too high! Cause: [REASON]. Add [SOLUTION]'

// Cost
'💰 Monthly cost exceeds budget! Optimize by [SUGGESTION]'
```

### Success Celebrations

```typescript
// Level Complete
'🎉 [ACHIEVEMENT]! You\'ve learned:\n✓ [LEARNING_1]\n✓ [LEARNING_2]\n✓ [LEARNING_3]\n\nNext: [NEXT_CHALLENGE]!'

// Problem Complete
'🎉 [PROBLEM] Complete! 🚀\n\nYou\'ve mastered:\n✓ [KEY_CONCEPT_1]\n✓ [KEY_CONCEPT_2]\n✓ [KEY_CONCEPT_3]\n\n[ENCOURAGING_MESSAGE]'
```

---

## Progressive Hints Formula

### Level 1 Hint (Conceptual) - After 2 attempts
```typescript
{
  condition: { minAttempts: 2 },
  hint: '💡 Hint: [HIGH_LEVEL_CONCEPT]. [GUIDING_QUESTION]?',
  hintLevel: 1,
}

// Examples:
'💡 Every system needs compute and storage. What are the minimum components?'
'💡 Real-time needs bidirectional communication. What protocol supports this?'
'💡 High reads overwhelm databases. What can you add to cache data?'
```

### Level 2 Hint (Specific) - After 3-4 attempts
```typescript
{
  condition: { minAttempts: 3 },
  hint: '🔍 Specific: [COMPONENTS_NEEDED]. [ARCHITECTURE_PATTERN]',
  hintLevel: 2,
}

// Examples:
'🔍 Add App Server and PostgreSQL. Connect: Client → App → PostgreSQL'
'🔍 Use Redis for caching. Strategy: cache_aside with 60s TTL'
'🔍 WebSocket + Redis Pub/Sub for real-time broadcasting'
```

### Level 3 Hint (Direct) - After 5+ attempts + time
```typescript
{
  condition: { minAttempts: 5, minTimeSeconds: 180 },
  hint: '🎯 Direct solution:\n1. [STEP_1]\n2. [STEP_2]\n3. [STEP_3]',
  hintLevel: 3,
}

// Examples:
'🎯 Solution: Add App Server + PostgreSQL. Connect Client → App → PostgreSQL'
'🎯 Add Redis cache between App and DB. Use cache_aside with 300s TTL'
'🎯 Architecture: Client ←→ WebSocket ←→ App → Redis Pub/Sub'
```

---

## Quick Reference: Components by Use Case

### Basic CRUD
- `app_server` - Business logic
- `postgresql` or `mysql` - Relational storage

### Real-Time Collaboration
- `websocket` - Bidirectional communication
- `redis` - Pub/Sub messaging

### High Read Load
- `redis` or `memcached` - Caching layer
- `load_balancer` - Distribute traffic

### Social Feed
- `message_queue` - Async fanout
- `redis` - Timeline storage
- `workers` - Background processing

### CDN/Streaming
- `cdn` - Edge caching
- `s3` - Object storage
- `lambda` - Edge computing

### E-commerce
- `postgresql` - Transactional data (ACID)
- `redis` - Cart/session storage
- `message_queue` - Order processing

### Geospatial
- `postgresql_postgis` - Geo indexing
- `redis_geospatial` - Proximity search
- `app_server` - Routing logic

### Search
- `elasticsearch` - Full-text search
- `redis` - Query caching
- `message_queue` - Index updates

---

## Example: Applying CRUD Template to "Notion"

### Step 1: Identify archetype
**Archetype:** CRUD (collaborative document editing)

### Step 2: Customize variables
```typescript
PROBLEM_ID = 'notion'
PROBLEM_NAME = 'Notion'
PRIMARY_FOCUS_AREAS = 'Document storage, real-time editing, permissions'
LEVEL_1_GOAL = 'Create and edit documents with rich content'
HIGH_CONCURRENCY = '10,000 concurrent editors'
NEXT_PROBLEM = 'google_docs'
```

### Step 3: Customize messages
```typescript
// Level 1
'Users can create pages/databases/wikis'
'Users can edit content with rich formatting'
'Users can organize in workspaces'

// Level 2
'Multiple users editing same page need real-time sync'
'Use CRDT or Operational Transforms for conflict resolution'

// Level 3
'Large workspaces (1000+ pages) need efficient search'
'Use Elasticsearch for full-text search across all content'
```

### Step 4: Review and ship!
Total time: ~20 minutes instead of 60 minutes from scratch.

---

## Validation Checklist

Before finalizing a coach config, verify:

- ✅ All 3 levels have distinct goals
- ✅ Learning objectives are specific (not generic)
- ✅ Welcome message provides context
- ✅ Each level has 5-7 messages
- ✅ Component additions have explanations
- ✅ Bottleneck messages trigger on actual bottlenecks
- ✅ Success messages celebrate achievements
- ✅ 3 progressive hints per level (conceptual → specific → direct)
- ✅ Celebration messages summarize learnings
- ✅ Next problem recommendation is logical
- ✅ Time estimates are realistic
- ✅ Archetype is correctly classified

---

## FAQ

### Q: How many messages per level?
**A:** 5-8 messages. More for complex patterns (fanout, edge computing).

### Q: Should every component addition have a message?
**A:** Yes for critical components. Optional for auxiliary ones.

### Q: What if a problem doesn't fit the 3-level pattern?
**A:** Most can be adapted. For tutorials, 2 levels may suffice. For complex problems (like Google Search), 4 levels may be needed.

### Q: How specific should hints be?
**A:** Level 1 = conceptual, Level 2 = components needed, Level 3 = exact architecture.

### Q: Can I reuse exact messages across problems?
**A:** Yes for common patterns (e.g., WebSocket explanation), but customize for context.

---

## Next Steps

1. Pick next 5 problems to coach
2. Use appropriate template
3. Customize in 15-20 minutes
4. Review with validation checklist
5. Ship!

**Goal:** 36 more problems = 36 × 20 min = 12 hours of work (spread over 4-6 weeks)

---

## Pattern Template Summary

| Archetype | Levels | Key Components | Time Estimate |
|-----------|--------|----------------|---------------|
| CRUD | 3 | App, DB, WebSocket, Redis, LB | 60 min |
| Social Feed | 3 | App, DB, Queue, Workers, Redis | 70 min |
| CDN | 3 | CDN, Origin, S3, Lambda@Edge | 47 min |
| Read-Heavy | 2-3 | App, DB, Cache | 30-45 min |
| Messaging | 3 | WebSocket, Redis Pub/Sub, DB | 65 min |
| E-commerce | 3 | App, DB, Queue, Payment Gateway | 70 min |
| Geospatial | 3 | App, PostGIS, Redis Geo | 60 min |
| Search | 3 | Elasticsearch, App, Cache | 55 min |

Happy coaching! 🎓🚀
