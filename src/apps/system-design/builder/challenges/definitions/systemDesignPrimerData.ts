import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../validation/validators/featureValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * System Design Primer - Data & Communication Concepts
 * Target: 52 problems covering Database, Caching, Asynchronism, Communication, and Security.
 * This file currently implements a focused subset of high-impact problems.
 *
 * Source: https://github.com/donnemartin/system-design-primer
 */

// ============================================================================
// 1. Database (15 problems)
// ============================================================================

// NOTE: Many database problems (replication, sharding, etc.) are already covered in DDIA chapters.
// These problems focus on System Design Primer specific concepts not covered in DDIA.

/**
 * Problem 42: Database Denormalization
 * Teaches: Trade-off between speed and data consistency
 */
export const denormalizationProblem: ProblemDefinition = {
  id: 'sdp-denormalization',
  title: 'Database Denormalization',
  description: `Denormalization: Add redundant data to improve read performance
- Normalized: Join 3 tables for each query (slow)
- Denormalized: Store redundant data, avoid joins (fast)
- Trade-off: Faster reads vs harder writes and data consistency

Learning objectives:
- Understand normalization vs denormalization
- Identify when to denormalize
- Implement denormalized schema
- Handle data consistency challenges

Example (E-commerce):
Normalized (3NF):
- users(id, name, email)
- orders(id, user_id, total, created_at)
- order_items(order_id, product_id, quantity, price)

Query: "Get user's orders with items" requires 3 joins → slow

Denormalized:
- orders(id, user_id, user_name, user_email, total, items_json, created_at)

Query: Select from orders → fast, no joins

Consistency problem:
- User changes email
- Must update email in users table AND all order records
- If update fails halfway → inconsistent data

When to denormalize:
- Read-heavy workload (read:write ratio > 10:1)
- Joins are slow (many tables, large datasets)
- Acceptable to have slightly stale data

Key requirements:
- Design normalized schema (3NF)
- Design denormalized schema
- Measure query performance
- Handle data consistency`,

  userFacingFRs: [
    'Normalized schema: 3 tables with foreign keys',
    'Query with joins (slow)',
    'Denormalized schema: 1 table with redundant data',
    'Query without joins (fast)',
    'Handle data consistency on updates',
  ],
  userFacingNFRs: [
    'Normalized query: ~200ms (3 joins)',
    'Denormalized query: ~20ms (no joins)',
    'Trade-off: 10x faster reads, more complex writes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with normalized or denormalized schema',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'storage',
        reason: 'Query database',
      },
    ],
  },

  scenarios: generateScenarios('sdp-denormalization', problemConfigs['sdp-denormalization'] || {
    baseRps: 500,
    readRatio: 0.95,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Normalized schema (slow joins)',
    'Denormalized schema (fast, no joins)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 2. Caching (subset of 12 problems)
// ============================================================================

/**
 * Problem 59: Client-Side Caching
 * Teaches: Browser caching (Cache-Control, ETag) and localStorage usage
 */
const clientSideCachingProblem: ProblemDefinition = {
  id: 'sdp-client-side-caching',
  title: 'Client-Side Caching (Browser & LocalStorage)',
  description: `Client-side caching reduces latency and backend load by reusing data stored in the browser.
- HTTP caching: Cache-Control, ETag/If-None-Match, Last-Modified/If-Modified-Since
- Storage APIs: localStorage/sessionStorage for user preferences and offline data
- Versioning: cache-busting static assets with hashes in filenames

Learning objectives:
- Design HTTP caching strategy for static assets and API responses
- Decide what to cache in the browser vs on the server
- Handle cache invalidation when assets or API responses change

Example:
- First page load downloads JS/CSS bundles, images, and initial API responses
- Subsequent navigations reuse cached assets and only re-fetch changed data
- Static assets use long-lived Cache-Control with hashed URLs
- API responses use short TTL or ETag-based revalidation`,

  userFacingFRs: [
    'Serve static assets with Cache-Control and ETag headers',
    'Use localStorage for user preferences (e.g., theme)',
    'Support cache-busting when deploying new frontend versions',
    'Fall back to fresh network requests when cache is stale',
  ],
  userFacingNFRs: [
    'First load: p95 < 1000ms',
    'Subsequent loads: p95 < 200ms with warm browser cache',
    'Reduce backend traffic by at least 50% after warm-up',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Serve static assets with proper Cache-Control headers',
      },
      {
        type: 'compute',
        reason: 'Backend API to serve JSON responses with ETags',
      },
      {
        type: 'storage',
        reason: 'Database for persistent data backing API responses',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Browser downloads cached JS/CSS/images from CDN',
      },
      {
        from: 'client',
        to: 'compute',
        reason: 'Browser calls backend APIs for dynamic data',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Backend queries database on cache miss or revalidation',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-client-side-caching',
    problemConfigs['sdp-client-side-caching'] || {
      baseRps: 1000,
      readRatio: 0.95,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Cold start with empty browser cache',
      'Warm cache with versioned static assets',
      'Deployment with new asset versions (cache-busting)',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 61: Web Server Caching (Reverse Proxy)
 * Teaches: HTTP response caching at web server / reverse proxy layer
 */
const webServerCachingProblem: ProblemDefinition = {
  id: 'sdp-web-server-caching',
  title: 'Web Server Caching (Reverse Proxy)',
  description: `Web server caching (e.g., Nginx, Varnish) stores full HTTP responses close to users.
- Offload repeated requests from application servers
- Honor Cache-Control and Vary headers
- Support cache keys that include path, query, and headers

Learning objectives:
- Place a reverse proxy cache in front of application servers
- Choose which endpoints are cacheable vs always dynamic
- Handle cache invalidation on updates (PURGE, BAN patterns)

Example:
- Anonymous product catalog pages cached at Nginx for 60 seconds
- Personalised pages bypass cache or use separate keys`,

  userFacingFRs: [
    'Serve cacheable GET endpoints from reverse proxy cache',
    'Bypass or vary cache for personalised responses',
    'Allow purging or invalidating cached entries on data changes',
  ],
  userFacingNFRs: [
    'Cache hit latency: p95 < 50ms',
    'Cache miss latency: p95 < 300ms',
    'Achieve > 80% cache hit rate for anonymous traffic',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Front door handling incoming HTTP traffic',
      },
      {
        type: 'cache',
        reason: 'Reverse proxy or HTTP cache in front of app servers',
      },
      {
        type: 'compute',
        reason: 'Application servers to handle cache misses',
      },
      {
        type: 'storage',
        reason: 'Database for source-of-truth data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients send HTTP requests through a front door',
      },
      {
        from: 'load_balancer',
        to: 'cache',
        reason: 'LB forwards traffic to reverse proxy cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Cache forwards cache misses to application servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers query database on cache miss',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-web-server-caching',
    problemConfigs['sdp-web-server-caching'] || {
      baseRps: 5000,
      readRatio: 0.98,
      maxLatency: 250,
      availability: 0.999,
    },
    [
      'Mostly read-heavy traffic with hot endpoints',
      'Burst traffic on a small set of URLs',
      'Cache purge when underlying data changes',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 64: Cache-Aside Pattern
 * Teaches: Lazy loading cache on read and invalidating on write
 */
const cacheAsideProblem: ProblemDefinition = {
  id: 'sdp-cache-aside',
  title: 'Cache-Aside (Lazy Loading) Pattern',
  description: `Cache-aside ("lazy loading") is the most common caching pattern.
- Reads: Check cache first, then database on miss, populate cache
- Writes: Write to database and invalidate or update cache
- Keeps cache as a best-effort performance optimization, not source of truth

Learning objectives:
- Implement read-through logic with cache miss handling
- Decide TTLs and invalidation strategies for dynamic data
- Avoid stale or inconsistent data between cache and database`,

  userFacingFRs: [
    'On cache miss, read from database and populate cache',
    'On write, update database and invalidate or update cache entry',
    'Handle thundering herd on popular keys (single flight behavior)',
  ],
  userFacingNFRs: [
    'Cache hit latency: p95 < 10ms',
    'Cache miss latency (DB read): p95 < 200ms',
    'Target cache hit rate ≥ 90% for hot keys',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers implementing cache-aside logic',
      },
      {
        type: 'cache',
        reason: 'In-memory cache (Redis/Memcached) for hot keys',
      },
      {
        type: 'storage',
        reason: 'Primary database as source of truth',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients call application servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Application first checks cache for reads',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Application reads/writes database on cache miss or updates',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-cache-aside',
    problemConfigs['sdp-cache-aside'] || {
      baseRps: 3000,
      readRatio: 0.9,
      maxLatency: 150,
      availability: 0.999,
    },
    [
      'Cold cache with many misses',
      'Warm cache with high hit rate',
      'Hot key experiencing thundering herd traffic',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 66: Write-Behind Cache
 * Teaches: Asynchronous writes to database, buffering updates in cache
 */
const writeBehindCacheProblem: ProblemDefinition = {
  id: 'sdp-write-behind-cache',
  title: 'Write-Behind Cache (Async Writes)',
  description: `Write-behind (write-back) caches buffer writes in memory and flush them asynchronously to the database.
- Writes: Update cache and enqueue background write to DB
- Reads: Serve from cache for hot keys
- Risks: Data loss if cache fails before flush, ordering issues

Learning objectives:
- Design a write pipeline that trades durability for throughput
- Choose flush intervals and batch sizes
- Mitigate data loss risk (replication, WAL, durable queues)`,

  userFacingFRs: [
    'Batch writes from cache to database asynchronously',
    'Support high write throughput with low write latency',
    'Expose metrics for write backlog and flush latency',
  ],
  userFacingNFRs: [
    'Write latency (cache write): p95 < 10ms',
    'Flush operations: p95 < 500ms for typical batches',
    'Accept small window of potential data loss on catastrophic cache failure',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers to apply write-behind logic',
      },
      {
        type: 'cache',
        reason: 'Write-behind cache storing buffered updates',
      },
      {
        type: 'message_queue',
        reason: 'Queue or log of pending flush operations',
      },
      {
        type: 'storage',
        reason: 'Primary database for durable storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients issue write requests to application servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Application writes to cache first',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Application enqueues flush jobs for background workers',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Workers flush batched writes to database',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-write-behind-cache',
    problemConfigs['sdp-write-behind-cache'] || {
      baseRps: 5000,
      readRatio: 0.2,
      maxLatency: 100,
      availability: 0.999,
    },
    [
      'Steady high write throughput with small batches',
      'Burst writes causing large backlog',
      'Cache node failure during backlog flush',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 67: Refresh-Ahead Cache
 * Teaches: Proactively refreshing cache entries before expiration
 */
const refreshAheadCacheProblem: ProblemDefinition = {
  id: 'sdp-refresh-ahead-cache',
  title: 'Refresh-Ahead Cache (Proactive Refresh)',
  description: `Refresh-ahead caches proactively refresh hot keys before they expire.
- Reduce cache misses for frequently accessed keys
- Keep data reasonably fresh without hard real-time guarantees
- Use background workers to refresh expiring entries

Learning objectives:
- Identify hot keys and schedule proactive refreshes
- Balance freshness vs extra background load
- Avoid stampedes by centralising refresh responsibility`,

  userFacingFRs: [
    'Track access frequency to identify hot keys',
    'Schedule background refresh before TTL expiry for hot keys',
    'Fall back gracefully if refresh jobs fail',
  ],
  userFacingNFRs: [
    'Cache hit rate for hot keys ≥ 99%',
    'Background refresh load stays under 20% of total capacity',
    'Average staleness window bounded (e.g., < 60 seconds)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application and background workers coordinating refreshes',
      },
      {
        type: 'cache',
        reason: 'Central cache storing hot keys with TTLs',
      },
      {
        type: 'storage',
        reason: 'Database providing authoritative data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients read data via application servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Application checks and updates cache entries',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Background jobs refresh cache from database',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-refresh-ahead-cache',
    problemConfigs['sdp-refresh-ahead-cache'] || {
      baseRps: 4000,
      readRatio: 0.95,
      maxLatency: 150,
      availability: 0.999,
    },
    [
      'Hot keys with constant traffic',
      'Cold keys that should not be refreshed ahead',
      'Database slowdown during refresh window',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 68: Cache Eviction Policies
 * Teaches: Choosing and tuning eviction strategies (LRU, LFU, FIFO)
 */
const cacheEvictionPoliciesProblem: ProblemDefinition = {
  id: 'sdp-cache-eviction-policies',
  title: 'Cache Eviction Policies (LRU, LFU, FIFO)',
  description: `When cache capacity is limited, eviction policy determines which keys are removed.
- LRU: Evict least recently used keys
- LFU: Evict least frequently used keys
- FIFO: Evict oldest keys regardless of access

Learning objectives:
- Compare eviction strategies for different workloads
- Choose appropriate policy for read-heavy vs skewed traffic
- Monitor cache hit rate and memory usage to tune capacity`,

  userFacingFRs: [
    'Support configurable eviction policies (LRU, LFU, FIFO)',
    'Expose metrics for hit rate, miss rate, and evictions',
    'Demonstrate impact of policy choice on a skewed workload',
  ],
  userFacingNFRs: [
    'Maintain ≥ 90% hit rate under typical load',
    'Keep cache memory usage under configured limit',
    'Eviction operations do not dominate request latency',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cache',
        reason: 'Central cache with configurable eviction policy',
      },
      {
        type: 'compute',
        reason: 'Application servers reading/writing through cache',
      },
      {
        type: 'storage',
        reason: 'Database used on cache miss',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send traffic through application servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Application uses cache for hot keys',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Database serves as fallback on cache miss',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-cache-eviction-policies',
    problemConfigs['sdp-cache-eviction-policies'] || {
      baseRps: 6000,
      readRatio: 0.9,
      maxLatency: 150,
      availability: 0.999,
    },
    [
      'Uniform access pattern with limited capacity',
      'Highly skewed traffic with hot keys',
      'Workload shift where previously cold keys become hot',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 3. Asynchronism (subset of 8 problems)
// ============================================================================

/**
 * Problem 72: Task Queues
 * Teaches: Background job processing with workers (Celery, Sidekiq)
 */
const taskQueuesProblem: ProblemDefinition = {
  id: 'sdp-task-queues',
  title: 'Task Queues for Background Work',
  description: `Task queues offload slow or non-critical work from request/response paths.
- Web request enqueues background job into a queue
- Worker processes jobs asynchronously and reports results
- Supports retries and dead-letter handling for failures

Learning objectives:
- Identify which operations should be moved to background workers
- Design idempotent tasks with retry semantics
- Size worker pools based on throughput requirements`,

  userFacingFRs: [
    'Enqueue background jobs from API requests (e.g., sending emails)',
    'Process jobs with a pool of worker instances',
    'Retry failed jobs with exponential backoff',
  ],
  userFacingNFRs: [
    'P95 API latency unaffected by background work (< 200ms)',
    'Background jobs processed within SLA (e.g., < 60 seconds)',
    'Queue can handle bursts without dropping jobs',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'API servers enqueue tasks',
      },
      {
        type: 'message_queue',
        reason: 'Task queue for background jobs',
      },
      {
        type: 'compute',
        reason: 'Worker instances consume and execute jobs',
      },
      {
        type: 'storage',
        reason: 'Database to persist job results or state',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients call API that enqueues background work',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API servers publish jobs to task queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Workers consume jobs from queue',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Workers persist job outcomes to database',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-task-queues',
    problemConfigs['sdp-task-queues'] || {
      baseRps: 2000,
      readRatio: 0.4,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Steady stream of background jobs',
      'Burst traffic causing queue backlog',
      'Worker failure with retries and recovery',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 73: Producer-Consumer Pattern
 * Teaches: Decoupling producers and consumers using queues
 */
const producerConsumerProblem: ProblemDefinition = {
  id: 'sdp-producer-consumer',
  title: 'Producer-Consumer with Message Queues',
  description: `Producer-consumer separates message producers from consumers via a durable queue.
- Producers publish messages as fast as they can
- Consumers scale independently to process messages
- Queue buffers load spikes and smooths processing

Learning objectives:
- Decouple components with a message queue
- Scale producers and consumers independently
- Monitor queue depth and processing lag`,

  userFacingFRs: [
    'Allow multiple producers to publish messages concurrently',
    'Scale consumers horizontally to increase throughput',
    'Expose metrics for queue depth and processing lag',
  ],
  userFacingNFRs: [
    'System handles sudden spikes without dropping messages',
    'P99 end-to-end processing time within acceptable SLA',
    'Queue depth converges back to steady state after a spike',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Producer services publishing messages',
      },
      {
        type: 'message_queue',
        reason: 'Central queue between producers and consumers',
      },
      {
        type: 'compute',
        reason: 'Consumer services processing messages',
      },
      {
        type: 'storage',
        reason: 'Database or storage where processed results go',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client-facing producer service accepts work',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers publish messages to queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Consumers receive messages from queue',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Consumers persist results or side-effects',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-producer-consumer',
    problemConfigs['sdp-producer-consumer'] || {
      baseRps: 3000,
      readRatio: 0.1,
      maxLatency: 500,
      availability: 0.999,
    },
    [
      'Balanced producer and consumer throughput',
      'Producer-heavy period with growing backlog',
      'Consumer-heavy period where queue drains quickly',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 74: Priority Queues
 * Teaches: Prioritising urgent work over normal/background tasks
 */
const priorityQueuesProblem: ProblemDefinition = {
  id: 'sdp-priority-queues',
  title: 'Priority Queues for Critical vs Background Work',
  description: `Priority queues allow urgent tasks to be processed ahead of normal or background work.
- Separate queues per priority or a single priority-aware queue
- Workers pull from higher priority queues first
- Prevent low-priority tasks from starving high-priority ones

Learning objectives:
- Design multi-priority queue topology
- Allocate workers across priority levels
- Ensure fairness while preserving latency SLAs for critical tasks`,

  userFacingFRs: [
    'Support at least two priority levels (high, normal)',
    'Ensure high-priority jobs are processed with low latency even under load',
    'Prevent starvation of normal-priority jobs over time',
  ],
  userFacingNFRs: [
    'High-priority jobs: p95 processing latency < 5 seconds',
    'Normal-priority jobs: eventual processing without starvation',
    'System tolerates burst of high-priority tasks without collapse',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'message_queue',
        reason: 'Multiple queues or priority-aware queue implementation',
      },
      {
        type: 'compute',
        reason: 'Producer services tagging tasks with priority',
      },
      {
        type: 'compute',
        reason: 'Worker pool configured for each priority level',
      },
      {
        type: 'storage',
        reason: 'Database logging job status and results',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client-facing service submits work with priority metadata',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers publish tasks to appropriate priority queues',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Workers consume from queues in priority order',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Workers record completion and failures',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-priority-queues',
    problemConfigs['sdp-priority-queues'] || {
      baseRps: 1500,
      readRatio: 0.2,
      maxLatency: 500,
      availability: 0.999,
    },
    [
      'Normal traffic mix of high and normal priority',
      'Spike of high-priority tasks',
      'Long-running normal-priority tasks alongside urgent ones',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 75: Dead Letter Queues
 * Teaches: Handling permanently failing messages safely
 */
const deadLetterQueuesProblem: ProblemDefinition = {
  id: 'sdp-dead-letter-queues',
  title: 'Dead Letter Queues (DLQs)',
  description: `Dead letter queues capture messages that repeatedly fail processing.
- Avoid infinite retry loops for poison messages
- Route failed messages to DLQ after retry limit
- Provide tools to inspect and replay DLQ messages

Learning objectives:
- Configure retry policies and DLQ routing
- Design monitoring and alerting for DLQ growth
- Support safe replay or manual handling of DLQ messages`,

  userFacingFRs: [
    'Move messages to DLQ after configurable retry limit',
    'Expose DLQ metrics and alerts for operators',
    'Support safe replay of DLQ messages after fixes',
  ],
  userFacingNFRs: [
    'Avoid unbounded growth in main queues due to poison messages',
    'Operators can drain DLQ without impacting live traffic',
    'DLQ operations are auditable and traceable',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'message_queue',
        reason: 'Primary queue for normal processing',
      },
      {
        type: 'message_queue',
        reason: 'Dedicated DLQ for failed messages',
      },
      {
        type: 'compute',
        reason: 'Consumers implementing retry and DLQ logic',
      },
      {
        type: 'storage',
        reason: 'Persistence for DLQ inspection tools or dashboards',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'message_queue',
        reason: 'Producers publish messages to primary queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Consumers process and retry failed messages',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Failed messages are routed from primary queue to DLQ',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'DLQ management tools store inspection metadata',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-dead-letter-queues',
    problemConfigs['sdp-dead-letter-queues'] || {
      baseRps: 1000,
      readRatio: 0.1,
      maxLatency: 1000,
      availability: 0.999,
    },
    [
      'Mostly successful messages with occasional transient failures',
      'Poison message causing consistent failure and DLQ routing',
      'Replay of DLQ after bug fix',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 76: Back Pressure
 * Teaches: Slowing down producers when consumers are overwhelmed
 */
const backPressureProblem: ProblemDefinition = {
  id: 'sdp-back-pressure',
  title: 'Back Pressure in Asynchronous Systems',
  description: `Back pressure prevents downstream systems from being overwhelmed.
- Detect when queues or consumers are overloaded
- Signal producers to slow down, shed load, or drop non-critical work
- Protect core systems from cascading failures

Learning objectives:
- Define thresholds for overload conditions (queue depth, latency, CPU)
- Implement mechanisms to slow or reject incoming work
- Design graceful degradation strategies under sustained overload`,

  userFacingFRs: [
    'Detect overload based on queue depth and processing latency',
    'Throttle or reject incoming requests when under sustained overload',
    'Provide degraded but functional service instead of complete outage',
  ],
  userFacingNFRs: [
    'Avoid unbounded queue growth under overload',
    'Keep core services available even when shedding non-critical work',
    'Recover gracefully when load returns to normal',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Producer services that can apply back pressure',
      },
      {
        type: 'message_queue',
        reason: 'Central queue whose depth and latency are monitored',
      },
      {
        type: 'compute',
        reason: 'Consumer services whose capacity is protected',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client-facing service accepts or throttles requests',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Producers enqueue work when capacity exists',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Consumers process work while monitoring load',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-back-pressure',
    problemConfigs['sdp-back-pressure'] || {
      baseRps: 4000,
      readRatio: 0.0,
      maxLatency: 1000,
      availability: 0.999,
    },
    [
      'Normal load within capacity',
      'Sudden spike causing overload and back pressure activation',
      'Extended overload period with graceful degradation',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 4. Communication (12 problems)
// ============================================================================

/**
 * Problem 79: HTTP Methods
 * Teaches: Correct use of HTTP verbs and idempotency
 */
const httpMethodsProblem: ProblemDefinition = {
  id: 'sdp-http-methods',
  title: 'HTTP Methods and Idempotency',
  description: `HTTP methods define semantics of requests.
- Safe: GET, HEAD (no side effects)
- Idempotent: PUT, DELETE, some PATCH patterns
- Non-idempotent: POST for create operations

Learning objectives:
- Map CRUD operations to appropriate HTTP methods
- Design idempotent APIs to support retries
- Avoid misusing GET for state-changing operations`,

  userFacingFRs: [
    'Expose CRUD operations using appropriate HTTP methods',
    'Ensure idempotent operations (PUT/DELETE) can be safely retried',
    'Document method semantics and expected status codes',
  ],
  userFacingNFRs: [
    'APIs remain backwards compatible when adding new methods',
    'Clients can safely retry idempotent requests on failure',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'HTTP API servers handling REST requests',
      },
      {
        type: 'storage',
        reason: 'Database for resources manipulated via HTTP',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send HTTP requests to API servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API persists or reads resources from database',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-http-methods',
    problemConfigs['sdp-http-methods'] || {
      baseRps: 1500,
      readRatio: 0.7,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Read-heavy workload using GET',
      'Write-heavy workload using POST/PUT/DELETE',
      'Retries on idempotent methods after transient failures',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 80: HTTP Status Codes
 * Teaches: Using 2xx/3xx/4xx/5xx codes consistently
 */
const httpStatusCodesProblem: ProblemDefinition = {
  id: 'sdp-http-status-codes',
  title: 'HTTP Status Codes and Error Handling',
  description: `HTTP status codes communicate outcome of requests.
- 2xx: Success (200 OK, 201 Created, 204 No Content)
- 3xx: Redirects (301, 302, 304)
- 4xx: Client errors (400, 401, 403, 404, 429)
- 5xx: Server errors (500, 502, 503)

Learning objectives:
- Choose appropriate status codes for common scenarios
- Design consistent error response formats
- Use status codes to support retries and client behaviour`,

  userFacingFRs: [
    'Return precise success codes (e.g., 200 vs 201)',
    'Return 4xx vs 5xx appropriately for client vs server errors',
    'Include machine-readable error details in responses',
  ],
  userFacingNFRs: [
    'Error responses have consistent schema across endpoints',
    'Clients can make retry decisions based on codes (e.g., 429, 503)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'API servers implementing error handling',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients call API endpoints and receive status codes',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-http-status-codes',
    problemConfigs['sdp-http-status-codes'] || {
      baseRps: 1000,
      readRatio: 0.8,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Normal successful requests',
      'Validation errors and unauthorised access',
      'Rate limiting and transient server failures',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 81: HTTP/2
 * Teaches: Multiplexing, header compression, server push
 */
const http2Problem: ProblemDefinition = {
  id: 'sdp-http2',
  title: 'HTTP/2 - Multiplexing and Server Push',
  description: `HTTP/2 improves performance over HTTP/1.1.
- Single TCP connection per origin with multiplexed streams
- Header compression (HPACK) to reduce overhead
- Server push for critical resources

Learning objectives:
- Understand when HTTP/2 helps (many small resources, high RTT)
- Design APIs and asset pipelines to benefit from multiplexing
- Avoid head-of-line blocking issues and overuse of server push`,

  userFacingFRs: [
    'Serve frontend over HTTP/2 with multiplexed asset loading',
    'Evaluate latency improvements vs HTTP/1.1',
    'Decide whether and how to use server push',
  ],
  userFacingNFRs: [
    'Page load time improves compared to HTTP/1.1 baseline',
    'Connection reuse reduces TLS handshake overhead',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Edge or CDN terminating HTTP/2 connections',
      },
      {
        type: 'compute',
        reason: 'Origin servers serving multiplexed responses',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Browsers connect via HTTP/2 to CDN/edge',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN forwards multiplexed streams to origin',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-http2',
    problemConfigs['sdp-http2'] || {
      baseRps: 500,
      readRatio: 0.95,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Many small assets over HTTP/1.1 vs HTTP/2',
      'High-latency mobile network conditions',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 82: HTTP/3 (QUIC)
 * Teaches: UDP-based transport with connection migration
 */
const http3Problem: ProblemDefinition = {
  id: 'sdp-http3',
  title: 'HTTP/3 (QUIC) - Modern Transport',
  description: `HTTP/3 runs over QUIC, a UDP-based transport.
- Connection migration across networks without handshake penalty
- Stream-level flow control to avoid head-of-line blocking
- Built-in encryption and congestion control

Learning objectives:
- Compare HTTP/3 to HTTP/2 over TCP
- Understand scenarios where QUIC significantly improves performance
- Plan gradual rollout of HTTP/3 support`,

  userFacingFRs: [
    'Support HTTP/3 for latency-sensitive clients where available',
    'Fall back gracefully to HTTP/2/1.1 for unsupported clients',
    'Monitor performance and error rates by protocol version',
  ],
  userFacingNFRs: [
    'Mobile clients benefit from connection migration across networks',
    'Handshake latency reduced relative to TLS over TCP',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Edge nodes terminating QUIC/HTTP/3 connections',
      },
      {
        type: 'compute',
        reason: 'Origin servers compatible with HTTP/3 via CDN or proxy',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Clients speak HTTP/3 when possible',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN proxies requests to origin over HTTP/2/1.1',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-http3',
    problemConfigs['sdp-http3'] || {
      baseRps: 400,
      readRatio: 0.95,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Mobile users switching networks during session',
      'High packet loss environment comparing TCP vs QUIC',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 83: gRPC
 * Teaches: High-performance binary RPC over HTTP/2
 */
const grpcProblem: ProblemDefinition = {
  id: 'sdp-grpc',
  title: 'gRPC - High-Performance Microservice RPC',
  description: `gRPC uses Protocol Buffers over HTTP/2 for efficient RPC.
- Strongly typed service definitions via .proto files
- Bidirectional streaming and multiplexed calls
- Code generation for many languages

Learning objectives:
- Decide when to use gRPC vs REST
- Model microservice APIs as gRPC services and messages
- Handle backwards-compatible schema evolution`,

  userFacingFRs: [
    'Define service interfaces using Protocol Buffers',
    'Support unary and streaming RPCs between services',
    'Expose metrics for latency and error rates per RPC method',
  ],
  userFacingNFRs: [
    'Lower latency and bandwidth usage compared to JSON/HTTP',
    'Backwards-compatible schema changes via optional fields',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Microservices acting as gRPC clients and servers',
      },
      {
        type: 'storage',
        reason: 'Databases backing service data',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Inter-service communication via gRPC',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Services persist and read data from databases',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-grpc',
    problemConfigs['sdp-grpc'] || {
      baseRps: 5000,
      readRatio: 0.8,
      maxLatency: 100,
      availability: 0.999,
    },
    [
      'Chatty microservice interactions converted to gRPC',
      'Streaming RPC for real-time updates',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 84: Thrift
 * Teaches: Cross-language RPC with Thrift IDL
 */
const thriftRpcProblem: ProblemDefinition = {
  id: 'sdp-thrift',
  title: 'Thrift RPC - Cross-Language Services',
  description: `Apache Thrift provides an IDL and code generator for cross-language RPC.
- Service definitions in Thrift IDL
- Multiple transport and protocol options
- Popular in legacy microservice architectures

Learning objectives:
- Compare Thrift to gRPC and JSON/HTTP
- Model services and data structures in Thrift IDL
- Plan migration strategies for existing Thrift ecosystems`,

  userFacingFRs: [
    'Expose a Thrift-based service consumed by multiple languages',
    'Choose appropriate transport and protocol options',
    'Plan compatibility between Thrift services and newer APIs',
  ],
  userFacingNFRs: [
    'Avoid tight coupling between services via shared libraries',
    'Maintain backwards compatibility when updating IDL definitions',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Thrift clients and servers in different languages',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Cross-language RPC calls via Thrift',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-thrift',
    problemConfigs['sdp-thrift'] || {
      baseRps: 2000,
      readRatio: 0.8,
      maxLatency: 150,
      availability: 0.999,
    },
    [
      'Legacy Thrift ecosystem interacting with new services',
      'Mixed-language microservices communicating via Thrift',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 85: JSON-RPC
 * Teaches: Lightweight RPC over JSON
 */
const jsonRpcProblem: ProblemDefinition = {
  id: 'sdp-json-rpc',
  title: 'JSON-RPC - Lightweight RPC over HTTP',
  description: `JSON-RPC is a simple, transport-agnostic protocol.
- Uses JSON for requests and responses
- Minimal framing for method and parameters
- Common in wallets, blockchain nodes, and internal tools

Learning objectives:
- Compare JSON-RPC to REST and gRPC
- Design simple remote procedure calls using JSON payloads
- Handle versioning and error reporting in JSON-RPC`,

  userFacingFRs: [
    'Expose a JSON-RPC endpoint for structured commands',
    'Return structured error objects on failures',
    'Support both notifications (no response) and standard calls',
  ],
  userFacingNFRs: [
    'Keep payloads small and self-describing',
    'Ensure compatibility between client and server versions',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'JSON-RPC server processing method calls',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send JSON-RPC requests over HTTP',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-json-rpc',
    problemConfigs['sdp-json-rpc'] || {
      baseRps: 800,
      readRatio: 0.7,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Wallet or CLI tool calling JSON-RPC service',
      'Error handling for invalid parameters and methods',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 86: XML-RPC
 * Teaches: Legacy RPC using XML envelopes
 */
const xmlRpcProblem: ProblemDefinition = {
  id: 'sdp-xml-rpc',
  title: 'XML-RPC - Legacy RPC Protocol',
  description: `XML-RPC encodes RPC calls and responses in XML.
- Predecessor to SOAP and newer protocols
- Still present in legacy enterprise systems

Learning objectives:
- Understand historical context and limitations of XML-RPC
- Plan migration strategies from XML-RPC to modern protocols
- Design compatibility layers where full migration is not feasible`,

  userFacingFRs: [
    'Describe how existing XML-RPC systems are structured',
    'Plan a migration path to REST/gRPC/GraphQL',
    'Handle backwards compatibility during protocol transition',
  ],
  userFacingNFRs: [
    'Minimise disruption to existing clients during migration',
    'Maintain security posture while upgrading protocols',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Legacy service speaking XML-RPC',
      },
      {
        type: 'compute',
        reason: 'Adapter or gateway translating to modern APIs',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Legacy clients call XML-RPC endpoints',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway translates XML-RPC to modern service calls',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-xml-rpc',
    problemConfigs['sdp-xml-rpc'] || {
      baseRps: 200,
      readRatio: 0.8,
      maxLatency: 300,
      availability: 0.99,
    },
    [
      'Steady load from legacy clients',
      'Gradual cutover to new protocol via gateway',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 87: RESTful API Design
 * Teaches: Resource-oriented APIs, statelessness, and HATEOAS basics
 */
const restfulApiDesignProblem: ProblemDefinition = {
  id: 'sdp-restful-api-design',
  title: 'RESTful API Design',
  description: `REST emphasises resources, representations, and stateless interactions.
- Resources identified by URLs (e.g., /users/123)
- Representations using JSON or other formats
- Statelessness and uniform interface

Learning objectives:
- Model APIs around resources and relationships
- Design predictable URL structures and filtering/pagination
- Understand trade-offs vs RPC-style APIs`,

  userFacingFRs: [
    'Design resource-oriented endpoints for a sample domain',
    'Support pagination, filtering, and sorting semantics',
    'Keep APIs stateless with authentication via headers',
  ],
  userFacingNFRs: [
    'Avoid breaking changes when evolving API',
    'Provide clear versioning strategy when needed',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'REST API servers handling HTTP requests',
      },
      {
        type: 'storage',
        reason: 'Database storing REST resources',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients call RESTful endpoints',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API reads and writes resources in database',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-restful-api-design',
    problemConfigs['sdp-restful-api-design'] || {
      baseRps: 2500,
      readRatio: 0.8,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'CRUD operations on core resources',
      'Pagination and filtering at scale',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 88: HATEOAS
 * Teaches: Hypermedia links for discoverable APIs
 */
const hateoasProblem: ProblemDefinition = {
  id: 'sdp-hateoas',
  title: 'HATEOAS - Hypermedia-Driven APIs',
  description: `HATEOAS (Hypermedia as the Engine of Application State) embeds links in responses.
- Responses include URLs for next actions
- Clients navigate API by following links

Learning objectives:
- Design hypermedia responses with links and actions',
    'Understand pros/cons vs static API contracts',
    'Apply HATEOAS selectively where it adds value`,

  userFacingFRs: [
    'Include hypermedia links in API responses',
    'Allow clients to navigate workflows via links',
    'Evolve server-side workflows without breaking clients',
  ],
  userFacingNFRs: [
    'Maintain clear documentation alongside hypermedia responses',
    'Avoid unnecessary complexity for simple APIs',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'API servers generating hypermedia responses',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients follow links returned by API',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-hateoas',
    problemConfigs['sdp-hateoas'] || {
      baseRps: 600,
      readRatio: 0.9,
      maxLatency: 250,
      availability: 0.999,
    },
    [
      'Dynamic workflows driven by server-provided links',
      'API evolution without client redeployments',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 89: GraphQL
 * Teaches: Client-driven queries and schema design
 */
const graphqlProblem: ProblemDefinition = {
  id: 'sdp-graphql',
  title: 'GraphQL - Flexible API Query Language',
  description: `GraphQL lets clients request exactly the data they need.
- Strongly typed schema (queries, mutations, subscriptions)
- Single endpoint with flexible selection sets
- Resolver functions fetching data from multiple services

Learning objectives:
- Design GraphQL schema for a sample domain
- Prevent N+1 problems via batching and caching
- Compare GraphQL trade-offs vs REST and gRPC`,

  userFacingFRs: [
    'Expose a GraphQL endpoint with typed schema',
    'Support query, mutation, and subscription operations as needed',
    'Implement basic query complexity limits and pagination',
  ],
  userFacingNFRs: [
    'P95 latency remains acceptable even for complex queries',
    'Protect backend services from overly expensive queries',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'GraphQL gateway resolving fields from backends',
      },
      {
        type: 'storage',
        reason: 'Databases behind resolvers',
      },
      {
        type: 'cache',
        reason: 'Optional cache for query results or sub-resolvers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send GraphQL queries to gateway',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Resolvers fetch data from databases or services',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway caches expensive query results when appropriate',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-graphql',
    problemConfigs['sdp-graphql'] || {
      baseRps: 1200,
      readRatio: 0.9,
      maxLatency: 300,
      availability: 0.999,
    },
    [
      'Simple queries for single resources',
      'Complex nested queries across relationships',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 90: WebSocket
 * Teaches: Bidirectional, low-latency communication channels
 */
const websocketProblem: ProblemDefinition = {
  id: 'sdp-websocket',
  title: 'WebSocket - Bi-directional Real-Time Communication',
  description: `WebSocket provides full-duplex communication over a single connection.
- Upgrade from HTTP to persistent WebSocket
- Ideal for chat, live dashboards, multiplayer games
- Requires careful scaling and connection management

Learning objectives:
- Design WebSocket infrastructure (load balancers, WS servers)
- Handle fan-out, rooms/channels, and presence
- Plan fallbacks (long polling, SSE) for unsupported clients`,

  userFacingFRs: [
    'Support persistent WebSocket connections for many clients',
    'Broadcast messages to subscribed clients or rooms',
    'Handle reconnects and connection state clean-up',
  ],
  userFacingNFRs: [
    'P99 message delivery latency < 500ms',
    'Support tens of thousands of concurrent connections per node',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'realtime_messaging',
        reason: 'WebSocket or real-time messaging servers',
      },
      {
        type: 'message_queue',
        reason: 'Backend queue for fan-out and reliability',
      },
      {
        type: 'storage',
        reason: 'Optional storage for message history',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'realtime_messaging',
        reason: 'Clients establish WebSocket connections to real-time tier',
      },
      {
        from: 'realtime_messaging',
        to: 'message_queue',
        reason: 'Real-time tier publishes or consumes messages from queue',
      },
      {
        from: 'realtime_messaging',
        to: 'storage',
        reason: 'Messages persisted to database if needed',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-websocket',
    problemConfigs['sdp-websocket'] || {
      baseRps: 3000,
      readRatio: 0.9,
      maxLatency: 500,
      availability: 0.999,
    },
    [
      'Chat-style messaging with many concurrent users',
      'Live dashboard pushing updates from backend',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 5. Security (subset of 10 problems)
// ============================================================================

/**
 * Problem 91: HTTPS / TLS
 * Teaches: Encrypting traffic in transit
 */
const httpsTlsProblem: ProblemDefinition = {
  id: 'sdp-https-tls',
  title: 'HTTPS / TLS - Transport Security',
  description: `HTTPS uses TLS to encrypt traffic and authenticate servers.
- Protects against eavesdropping and tampering
- Relies on certificates and trusted CAs

Learning objectives:
- Understand TLS handshake and certificate validation',
    'Terminate TLS at edge or load balancer',
    'Plan certificate rotation and cipher suite configuration`,

  userFacingFRs: [
    'Serve all external traffic over HTTPS only',
    'Redirect HTTP to HTTPS securely',
    'Rotate certificates before expiry without downtime',
  ],
  userFacingNFRs: [
    'Use modern TLS versions and strong cipher suites',
    'Minimise added latency from TLS handshakes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Terminate TLS and enforce HTTPS-only policies',
      },
      {
        type: 'compute',
        reason: 'Application servers behind TLS termination',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients connect to HTTPS endpoint at the edge',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB forwards decrypted traffic to application servers',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-https-tls',
    problemConfigs['sdp-https-tls'] || {
      baseRps: 2500,
      readRatio: 0.9,
      maxLatency: 250,
      availability: 0.999,
    },
    [
      'TLS termination at edge with HTTP to origin',
      'End-to-end encryption with TLS to origin',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 92: SSL Certificates
 * Teaches: Certificate lifecycle and PKI basics
 */
const sslCertificatesProblem: ProblemDefinition = {
  id: 'sdp-ssl-certificates',
  title: 'SSL Certificates and PKI',
  description: `Certificates bind public keys to domain names.
- Issuance via certificate authorities (CAs)
- Renewal and rotation before expiry
- Revocation via CRLs or OCSP

Learning objectives:
- Manage certificate lifecycle across environments
- Automate issuance and renewal (e.g., Let's Encrypt)
- Handle certificate revocation and incident response`,

  userFacingFRs: [
    'Issue certificates for all public domains',
    'Automate renewals without service interruption',
    'Revoke and replace compromised certificates quickly',
  ],
  userFacingNFRs: [
    'Avoid expired certificates causing outages',
    'Central visibility into certificate inventory',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Terminate TLS using managed certificates',
      },
      {
        type: 'compute',
        reason: 'Internal services participating in PKI where needed',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients validate certificates when connecting over HTTPS',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-ssl-certificates',
    problemConfigs['sdp-ssl-certificates'] || {
      baseRps: 500,
      readRatio: 0.9,
      maxLatency: 300,
      availability: 0.999,
    },
    [
      'Routine certificate renewal',
      'Emergency rotation after key compromise',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 93: Authentication
 * Teaches: Verifying identity (sessions, JWT, SSO)
 */
const authenticationProblem: ProblemDefinition = {
  id: 'sdp-authentication',
  title: 'Authentication - Who Are You?',
  description: `Authentication verifies the identity of a user or service.
- Session cookies, JWTs, OAuth/OpenID Connect, SSO
- Passwords, MFA, and device-based signals

Learning objectives:
- Design central authentication service or identity provider
- Choose between sessions and JWTs for different use cases
- Support MFA for high-risk actions`,

  userFacingFRs: [
    'Authenticate users with secure login flow',
    'Issue and validate access tokens or sessions',
    'Support logout and token/session revocation',
  ],
  userFacingNFRs: [
    'Authentication service availability ≥ 99.99%',
    'Protect against brute force and credential stuffing attacks',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Front door for authentication traffic',
      },
      {
        type: 'compute',
        reason: 'Auth service handling login and token issuance',
      },
      {
        type: 'cache',
        reason: 'Token/session store for fast validation and revocation',
      },
      {
        type: 'storage',
        reason: 'User database storing credentials and profiles',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients hit auth endpoints via LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes requests to auth service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Auth service stores and validates active sessions/tokens',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Auth service verifies credentials and user data',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-authentication',
    problemConfigs['sdp-authentication'] || {
      baseRps: 3000,
      readRatio: 0.2,
      maxLatency: 200,
      availability: 0.9999,
    },
    [
      'Normal login traffic pattern',
      'Login burst during product launch',
      'Token revocation after suspicious activity',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 94: Authorization
 * Teaches: Controlling access (RBAC, ABAC)
 */
const authorizationProblem: ProblemDefinition = {
  id: 'sdp-authorization',
  title: 'Authorization - What Can You Do?',
  description: `Authorization determines what an authenticated identity is allowed to do.
- Role-based access control (RBAC)
- Attribute or policy-based access control (ABAC, PBAC)

Learning objectives:
- Design centralised authorization checks for services
- Model roles, permissions, and policies
- Implement least-privilege access patterns`,

  userFacingFRs: [
    'Define roles and permissions for key resources',
    'Enforce authorization checks in API gateway or services',
    'Log authorization decisions for auditability',
  ],
  userFacingNFRs: [
    'Authorization decisions add minimal latency',
    'Changes to permissions propagate quickly',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Authorization service or shared library evaluating policies',
      },
      {
        type: 'storage',
        reason: 'Policy store and permission data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client calls go through components enforcing authorization',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'AuthZ logic loads policies and roles from storage',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-authorization',
    problemConfigs['sdp-authorization'] || {
      baseRps: 5000,
      readRatio: 0.9,
      maxLatency: 50,
      availability: 0.999,
    },
    [
      'Standard user operations with RBAC checks',
      'Admin operations with stricter access control',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 95: API Keys
 * Teaches: Authenticating and rate-limiting API clients
 */
const apiKeysProblem: ProblemDefinition = {
  id: 'sdp-api-keys',
  title: 'API Keys for Service Access',
  description: `API keys identify and control access for programmatic clients.
- Key issuance and rotation
- Per-key quotas and rate limits
- Scoping keys to specific APIs or operations

Learning objectives:
- Design API key generation, storage, and validation
- Implement per-key rate limiting and quotas
- Handle compromised or abused API keys`,

  userFacingFRs: [
    'Issue API keys to clients with defined scopes',
    'Validate API keys on each request',
    'Apply per-key rate limits and quotas',
  ],
  userFacingNFRs: [
    'Key lookup and validation adds minimal latency',
    'Ability to quickly revoke compromised keys',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'API gateway enforcing key-based access',
      },
      {
        type: 'cache',
        reason: 'Fast key metadata lookup and rate limit counters',
      },
      {
        type: 'storage',
        reason: 'Persistent store for API key records',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients send API requests with keys',
      },
      {
        from: 'load_balancer',
        to: 'cache',
        reason: 'Gateway validates keys and rate limits against cache',
      },
      {
        from: 'load_balancer',
        to: 'storage',
        reason: 'Gateway updates or reads key metadata from database',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-api-keys',
    problemConfigs['sdp-api-keys'] || {
      baseRps: 4000,
      readRatio: 0.9,
      maxLatency: 100,
      availability: 0.999,
    },
    [
      'Normal API usage within quotas',
      'Abusive client hitting rate limits',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 96: OAuth 2.0
 * Teaches: Delegated authorization for third-party apps
 */
const oauth2Problem: ProblemDefinition = {
  id: 'sdp-oauth2',
  title: 'OAuth 2.0 - Delegated Authorization',
  description: `OAuth 2.0 allows users to grant limited access to third-party apps.
- Authorization code, client credentials, and other flows
- Access and refresh tokens

Learning objectives:
- Understand core OAuth 2.0 roles and flows
- Design secure redirect and token handling logic
- Avoid common pitfalls (implicit flow, token leakage)`,

  userFacingFRs: [
    'Support OAuth 2.0 authorization code flow for web/mobile clients',
    'Issue scoped access tokens and refresh tokens',
    'Allow users to revoke third-party app access',
  ],
  userFacingNFRs: [
    'Protect against CSRF in OAuth flows',
    'Secure storage of client secrets and tokens',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Authorization server handling OAuth flows',
      },
      {
        type: 'storage',
        reason: 'Token store and client metadata',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients interact with authorization server for consent and tokens',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Authorization server stores issued tokens and client info',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-oauth2',
    problemConfigs['sdp-oauth2'] || {
      baseRps: 600,
      readRatio: 0.6,
      maxLatency: 300,
      availability: 0.999,
    },
    [
      'Standard authorization code flow for web apps',
      'Client credentials flow for service-to-service auth',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 97: SQL Injection Prevention
 * Teaches: Parameterised queries and ORM safety
 */
const sqlInjectionPreventionProblem: ProblemDefinition = {
  id: 'sdp-sql-injection-prevention',
  title: 'SQL Injection Prevention',
  description: `SQL injection occurs when untrusted input is concatenated into SQL.
- Use parameterised queries or ORMs
- Avoid building queries via string concatenation

Learning objectives:
- Identify vulnerable patterns in query construction
- Apply parameterised queries consistently
- Use least privilege DB accounts and input validation`,

  userFacingFRs: [
    'Ensure all SQL access uses parameterised queries or safe ORM APIs',
    'Demonstrate previously vulnerable query and its secure version',
    'Log and block suspicious query patterns where possible',
  ],
  userFacingNFRs: [
    'No functional regression when hardening queries',
    'Database accounts have only required privileges',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Application servers executing SQL queries safely',
      },
      {
        type: 'storage',
        reason: 'Relational database for application data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send user input to application',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Application executes parameterised queries against DB',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-sql-injection-prevention',
    problemConfigs['sdp-sql-injection-prevention'] || {
      baseRps: 1000,
      readRatio: 0.8,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Normal user input patterns',
      'Malicious input attempting classic SQL injection',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 98: XSS Prevention
 * Teaches: Escaping output and content security policies
 */
const xssPreventionProblem: ProblemDefinition = {
  id: 'sdp-xss-prevention',
  title: 'XSS Prevention (Cross-Site Scripting)',
  description: `XSS allows attackers to inject scripts into web pages.
- Reflected, stored, and DOM-based XSS
- Output encoding and CSP (Content Security Policy)

Learning objectives:
- Escape untrusted data in HTML, JS, and attributes
- Use CSP to limit script execution
- Sanitise rich text input where needed`,

  userFacingFRs: [
    'Escape all untrusted data in server-rendered templates',
    'Implement CSP to restrict script sources',
    'Sanitise user-generated HTML content safely',
  ],
  userFacingNFRs: [
    'XSS protections do not break legitimate functionality',
    'Minimal performance overhead from sanitisation and CSP',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Serve static assets under controlled origins for CSP',
      },
      {
        type: 'compute',
        reason: 'Application servers performing proper encoding and sanitisation',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Browsers load scripts and assets from safe origins',
      },
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients submit potentially unsafe input to server',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-xss-prevention',
    problemConfigs['sdp-xss-prevention'] || {
      baseRps: 1200,
      readRatio: 0.9,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Normal user-generated content',
      'Malicious payloads attempting script injection',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 99: CSRF Prevention
 * Teaches: Protecting state-changing requests from cross-site attacks
 */
const csrfPreventionProblem: ProblemDefinition = {
  id: 'sdp-csrf-prevention',
  title: 'CSRF Prevention (Cross-Site Request Forgery)',
  description: `CSRF tricks a user\'s browser into making unwanted requests.
- Anti-CSRF tokens and SameSite cookies
- Double-submit cookie patterns

Learning objectives:
- Identify which endpoints are vulnerable to CSRF
- Apply CSRF tokens or SameSite cookies appropriately
- Avoid breaking legitimate cross-site use cases when hardening`,

  userFacingFRs: [
    'Protect state-changing non-idempotent endpoints from CSRF',
    'Use SameSite cookie attributes where appropriate',
    'Rotate CSRF tokens and bind them to user sessions',
  ],
  userFacingNFRs: [
    'Maintain usability for legitimate cross-origin scenarios where needed',
    'Minimal added latency from CSRF validation',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Backend enforcing CSRF protection on state-changing requests',
      },
      {
        type: 'storage',
        reason: 'Optional store for CSRF token metadata linked to sessions',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Browser sends cookies and CSRF tokens with requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Server validates tokens against stored session state if applicable',
      },
    ],
  },

  scenarios: generateScenarios(
    'sdp-csrf-prevention',
    problemConfigs['sdp-csrf-prevention'] || {
      baseRps: 900,
      readRatio: 0.7,
      maxLatency: 200,
      availability: 0.999,
    },
    [
      'Normal form submissions with valid tokens',
      'Malicious cross-site requests without valid tokens',
    ],
  ),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 43: SQL Query Optimization
 * Teaches: Use EXPLAIN plans, indexes to optimize queries
 */
export const sqlOptimizationProblem: ProblemDefinition = {
  id: 'sdp-sql-optimization',
  title: 'SQL Query Optimization - EXPLAIN Plans',
  description: `SQL optimization: Analyze and optimize slow queries using EXPLAIN
- Use EXPLAIN to understand query execution plan
- Add indexes to speed up queries
- Rewrite queries to avoid full table scans
- Monitor query performance

Learning objectives:
- Use EXPLAIN ANALYZE to profile queries
- Identify slow queries (sequential scans)
- Add appropriate indexes
- Rewrite inefficient queries
- Measure performance improvements

Example slow query:
\`\`\`sql
SELECT * FROM orders WHERE user_id = 123;
-- Without index: Full table scan (slow)
-- EXPLAIN: Seq Scan on orders (cost=0.00..10000.00 rows=1000 width=100)
\`\`\`

Optimized query:
\`\`\`sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
SELECT * FROM orders WHERE user_id = 123;
-- With index: Index scan (fast)
-- EXPLAIN: Index Scan using idx_orders_user_id (cost=0.42..8.44 rows=1 width=100)
\`\`\`

Common optimizations:
1. Add indexes on WHERE clauses
2. Add indexes on JOIN columns
3. Avoid SELECT * (only select needed columns)
4. Use LIMIT to reduce result set
5. Avoid N+1 queries (use joins or batch queries)

Key requirements:
- Identify slow query (EXPLAIN)
- Add index
- Rewrite query
- Measure speedup`,

  userFacingFRs: [
    'Slow query: SELECT * FROM orders WHERE user_id = ? (1000ms)',
    'Run EXPLAIN ANALYZE (shows sequential scan)',
    'Add index on user_id',
    'Re-run query (expect 10ms)',
  ],
  userFacingNFRs: [
    'Without index: ~1000ms',
    'With index: ~10ms (100x speedup)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with query optimization',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'storage',
        reason: 'Run queries',
      },
    ],
  },

  scenarios: generateScenarios('sdp-sql-optimization', problemConfigs['sdp-sql-optimization'] || {
    baseRps: 500,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Slow query without index',
    'Optimized query with index',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 44: NoSQL - Key-Value Store (Redis, DynamoDB)
 * Teaches: When to use key-value stores vs relational databases
 */
export const keyValueStoreProblem: ProblemDefinition = {
  id: 'sdp-key-value-store',
  title: 'NoSQL - Key-Value Store (Redis, DynamoDB)',
  description: `Key-value store: Simple, fast storage for key-value pairs
- Data model: Key → Value (string, JSON, binary)
- Operations: GET(key), PUT(key, value), DELETE(key)
- Use cases: Caching, session storage, real-time analytics
- Examples: Redis, DynamoDB, Memcached

Learning objectives:
- Understand key-value data model
- Compare to relational databases
- Identify appropriate use cases
- Implement key-value operations

Example use cases:
1. **Session storage**:
   - Key: session_id (e.g., "sess_abc123")
   - Value: user data JSON {user_id: 5, cart: [...]}

2. **Cache**:
   - Key: "product_123"
   - Value: Product JSON {id: 123, name: "Phone", price: 999}

3. **Real-time leaderboard**:
   - Key: "game_scores"
   - Value: Sorted set of scores

When to use key-value store:
- Simple access pattern (only lookup by primary key)
- Need very low latency (< 10ms)
- High read/write throughput
- Don't need complex queries (joins, aggregations)

When NOT to use:
- Need complex queries (joins, WHERE clauses)
- Need ACID transactions across multiple keys
- Need referential integrity

Key requirements:
- Store data as key-value pairs
- Implement GET, PUT, DELETE
- Compare latency to SQL database`,

  userFacingFRs: [
    'PUT session_abc123 → {user_id: 5, cart: [1,2,3]}',
    'GET session_abc123 → {user_id: 5, cart: [1,2,3]}',
    'DELETE session_abc123',
    'Compare latency to SQL query',
  ],
  userFacingNFRs: [
    'GET latency: < 5ms (very fast)',
    'PUT latency: < 5ms',
    'Compare to SQL: 10-100x faster for simple lookups',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'cache',
        reason: 'Key-value store (Redis)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cache',
        reason: 'GET/PUT operations',
      },
    ],
  },

  scenarios: generateScenarios('sdp-key-value-store', problemConfigs['sdp-key-value-store'] || {
    baseRps: 1000,
    readRatio: 0.9,
    maxLatency: 10,
    availability: 0.999,
  }, [
    'SQL database (slower for simple lookups)',
    'Key-value store (very fast)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 45: NoSQL - Wide-Column Store (Cassandra, HBase)
 * Teaches: When to use wide-column stores for time-series data
 */
export const wideColumnStoreProblem: ProblemDefinition = {
  id: 'sdp-wide-column-store',
  title: 'NoSQL - Wide-Column Store (Cassandra, HBase)',
  description: `Wide-column store: Optimized for time-series and append-only data
- Data model: Row key → Column families → Columns
- Write-optimized: Fast writes (append-only log)
- Time-series: Natural fit for timestamped data
- Examples: Cassandra, HBase, ScyllaDB

Learning objectives:
- Understand wide-column data model
- Design schema for time-series data
- Compare to relational databases
- Understand write amplification

Example use case: IoT sensor data
Row key: sensor_id | timestamp
Columns: temperature, humidity, pressure

\`\`\`
sensor_123 | 2024-01-01T00:00:00Z → {temp: 20, humidity: 60}
sensor_123 | 2024-01-01T00:01:00Z → {temp: 21, humidity: 61}
sensor_123 | 2024-01-01T00:02:00Z → {temp: 22, humidity: 62}
\`\`\`

Query pattern:
- Get recent readings for sensor_123
- Range query: sensor_123 between timestamp X and Y

Benefits:
- Very fast writes (append-only, no updates)
- Efficient range queries on row key
- Scales horizontally (partition by sensor_id)

Trade-offs:
- No joins, no complex queries
- Eventual consistency (tunable)
- Data modeling is harder (must design for query patterns)

Key requirements:
- Design wide-column schema
- Write time-series data
- Query by range
- Measure write throughput`,

  userFacingFRs: [
    'Design schema for sensor data (sensor_id | timestamp)',
    'Write 1000 sensor readings per second',
    'Query: Get readings for sensor_123 in last hour',
    'Measure write throughput',
  ],
  userFacingNFRs: [
    'Write throughput: > 10,000 writes/sec',
    'Range query latency: < 100ms',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Wide-column store (Cassandra)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'storage',
        reason: 'Write sensor data',
      },
    ],
  },

  scenarios: generateScenarios('sdp-wide-column-store', problemConfigs['sdp-wide-column-store'] || {
    baseRps: 10000,
    readRatio: 0.2,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'SQL database (slow for high write throughput)',
    'Wide-column store (optimized for writes)',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all data & communication problems
export const systemDesignPrimerDataProblems = [
  // Database (subset of 15 problems) - Many covered in DDIA, these are supplementary
  denormalizationProblem,
  sqlOptimizationProblem,
  keyValueStoreProblem,
  wideColumnStoreProblem,
  // Caching (subset of 12 problems)
  clientSideCachingProblem,
  webServerCachingProblem,
  cacheAsideProblem,
  writeBehindCacheProblem,
  refreshAheadCacheProblem,
  cacheEvictionPoliciesProblem,

  // Asynchronism (subset of 8 problems)
  taskQueuesProblem,
  producerConsumerProblem,
  priorityQueuesProblem,
  deadLetterQueuesProblem,
  backPressureProblem,

  // Communication (12 problems)
  httpMethodsProblem,
  httpStatusCodesProblem,
  http2Problem,
  http3Problem,
  grpcProblem,
  thriftRpcProblem,
  jsonRpcProblem,
  xmlRpcProblem,
  restfulApiDesignProblem,
  hateoasProblem,
  graphqlProblem,
  websocketProblem,

  // Security (subset of 10 problems)
  httpsTlsProblem,
  sslCertificatesProblem,
  authenticationProblem,
  authorizationProblem,
  apiKeysProblem,
  oauth2Problem,
  sqlInjectionPreventionProblem,
  xssPreventionProblem,
  csrfPreventionProblem,
];

// Note: This file focuses on the highest-impact System Design Primer data & communication problems.
// Additional database and security-related topics from the plan can be added in future iterations
// to reach the full target of 52 problems.
