/**
 * DDIA Chapter 12: The Future of Data Systems - Teaching Problems
 *
 * Focus: Data integration patterns and derived data systems
 *
 * Problems:
 * Data Integration (4):
 * 1. Lambda Architecture - Batch and speed layers for accuracy + low latency
 * 2. Kappa Architecture - Stream-only processing (simplified Lambda)
 * 3. Change Data Capture (CDC) - Stream database changes
 * 4. Event Sourcing - Store all state changes as immutable log
 *
 * Derived Data (4):
 * 5. Materialized Views - Pre-computed query results
 * 6. Cache Invalidation - Keep caches synchronized with database
 * 7. Search Index Maintenance - Update Elasticsearch from database
 * 8. CQRS - Command Query Responsibility Segregation
 */

import { ProblemDefinition } from '../../../types/problemDefinition';
import { generateScenarios } from '../../scenarioGenerator';

// ============================================================================
// DATA INTEGRATION (4 PROBLEMS)
// ============================================================================

/**
 * Problem 1: Lambda Architecture - Batch + Speed Layers
 */
export const lambdaArchitectureProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-lambda-architecture',
  title: 'Lambda Architecture - Batch and Speed Layers',
  description: `Implement Lambda Architecture with batch layer for accuracy and speed layer for low latency.

**Concepts:**
- Batch layer: Recompute everything from scratch (accurate, slow)
- Speed layer: Incremental updates (fast, approximate)
- Serving layer: Merge batch and speed views
- Trade-off: Complexity vs accuracy + latency
- Example: Page view counts (batch: daily, speed: real-time)

**Learning Objectives:**
- Build batch layer with MapReduce
- Build speed layer with stream processing
- Merge results from both layers
- Understand complexity and operational overhead`,
  userFacingFRs: [
    'Batch layer: Process all data daily (accurate counts)',
    'Speed layer: Process recent data in real-time',
    'Serving layer: Query = batch_result + speed_delta',
    'Example: total_views = batch_views + recent_views',
    'Handle duplicate processing across layers',
    'Batch layer overwrites speed layer periodically',
  ],
  userFacingNFRs: [
    'Batch latency: Hours (full recomputation)',
    'Speed latency: Seconds (incremental)',
    'Accuracy: Eventually accurate (after batch)',
    'Query latency: <100ms (merge batch + speed)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'batch-layer',
        title: 'Batch Layer',
        description: 'Recompute views from all data',
        category: 'Processing',
      },
      {
        id: 'speed-layer',
        title: 'Speed Layer',
        description: 'Incremental real-time updates',
        category: 'Processing',
      },
      {
        id: 'serving-layer',
        title: 'Serving Layer',
        description: 'Merge and query results',
        category: 'Query',
      },
    ],
    constraints: [
      {
        id: 'dual-complexity',
        title: 'Dual Complexity',
        description: 'Maintain batch and stream code paths',
        type: 'technical',
      },
      {
        id: 'eventual-accuracy',
        title: 'Eventual Accuracy',
        description: 'Speed layer approximate until batch overwrites',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 0.7, write: 0.3 },
    dataSize: 'large',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'batch-accurate',
      name: 'Batch Accuracy',
      description: 'Batch layer produces accurate results',
      validate: (solution: any) => ({
        passed: true,
        message: 'Batch: Processed 10M events, count = 10,000,000',
      }),
    },
    {
      id: 'speed-low-latency',
      name: 'Speed Latency',
      description: 'Speed layer provides low-latency updates',
      validate: (solution: any) => ({
        passed: true,
        message: 'Speed: Updated count in 2 seconds',
      }),
    },
  ],
  hints: [
    'Batch layer: Run MapReduce daily on all historical data',
    'Speed layer: Kafka Streams for recent data (last 24 hours)',
    'Serving: total = batch_count(from yesterday) + speed_count(today)',
    'Lambda is complex: Two codebases to maintain',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Lambda Architecture',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Lambda Architecture',
      url: 'http://nathanmarz.com/blog/how-to-beat-the-cap-theorem.html',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['data-integration', 'lambda-architecture', 'batch', 'stream'],
};

/**
 * Problem 2: Kappa Architecture - Stream-Only Processing
 */
export const kappaArchitectureProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-kappa-architecture',
  title: 'Kappa Architecture - Simplified Stream-Only',
  description: `Implement Kappa Architecture that uses only stream processing, eliminating batch layer complexity.

**Concepts:**
- Single stream processing pipeline (no separate batch layer)
- Replay entire stream for recomputation
- Versioned stream processing jobs
- Deploy new version → replay from beginning
- Simpler than Lambda (one code path)

**Learning Objectives:**
- Build stream processing job
- Replay stream for recomputation
- Deploy new job version without downtime
- Compare with Lambda Architecture`,
  userFacingFRs: [
    'Process events with stream processing',
    'Store results in serving database',
    'To recompute: Deploy new job version',
    'New version replays entire stream from beginning',
    'Switch to new version when caught up',
    'Delete old version',
  ],
  userFacingNFRs: [
    'Single code path (stream only)',
    'Recomputation: Replay from start (hours)',
    'No batch/speed layer complexity',
    'Requires replayable log (Kafka)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'stream-processing',
        title: 'Stream Processing',
        description: 'Process events in real-time',
        category: 'Processing',
      },
      {
        id: 'stream-replay',
        title: 'Stream Replay',
        description: 'Replay entire stream for recomputation',
        category: 'Processing',
      },
      {
        id: 'version-deployment',
        title: 'Versioned Deployment',
        description: 'Deploy new versions without downtime',
        category: 'Operations',
      },
    ],
    constraints: [
      {
        id: 'replayable-log',
        title: 'Replayable Log Required',
        description: 'Need Kafka or similar with long retention',
        type: 'technical',
      },
      {
        id: 'replay-time',
        title: 'Replay Time',
        description: 'Reprocessing can take hours for large streams',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 0.6, write: 0.4 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'replay-successful',
      name: 'Replay Successful',
      description: 'New version replayed entire stream',
      validate: (solution: any) => ({
        passed: true,
        message: 'Replayed 1 billion events in 4 hours',
      }),
    },
    {
      id: 'zero-downtime',
      name: 'Zero Downtime',
      description: 'Switchover with no service interruption',
      validate: (solution: any) => ({
        passed: true,
        message: 'Switched to v2 with zero downtime',
      }),
    },
  ],
  hints: [
    'Kappa = Lambda without batch layer',
    'Use Kafka with long retention (days/weeks)',
    'Deploy v2 in parallel, replay from offset 0',
    'When v2 catches up, switch reads to v2, delete v1',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Kappa Architecture',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Questioning the Lambda Architecture',
      url: 'https://www.oreilly.com/radar/questioning-the-lambda-architecture/',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['data-integration', 'kappa-architecture', 'stream-processing'],
};

/**
 * Problem 3: Change Data Capture (CDC) - Stream Database Changes
 */
export const cdcProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-change-data-capture',
  title: 'Change Data Capture (CDC) - Stream DB Changes',
  description: `Implement Change Data Capture to stream all database changes to downstream systems.

**Concepts:**
- Capture INSERT, UPDATE, DELETE from database
- Publish changes to stream (Kafka)
- Downstream systems consume change stream
- Enable derived data systems (caches, search indexes)
- Database as source of truth

**Learning Objectives:**
- Capture database changes (transaction log)
- Publish changes to Kafka
- Consume changes in downstream systems
- Understand CDC use cases`,
  userFacingFRs: [
    'Monitor database transaction log (binlog, WAL)',
    'Parse INSERT, UPDATE, DELETE operations',
    'Publish changes to Kafka topic',
    'Include before and after values for UPDATEs',
    'Maintain ordering per primary key',
    'Handle schema changes',
  ],
  userFacingNFRs: [
    'Latency: <1 second from DB write to stream',
    'Ordering: Guaranteed per primary key',
    'Completeness: All changes captured',
    'Durability: Changes not lost',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'log-tailing',
        title: 'Transaction Log Tailing',
        description: 'Read database transaction log',
        category: 'Integration',
      },
      {
        id: 'change-publishing',
        title: 'Change Publishing',
        description: 'Publish changes to stream',
        category: 'Integration',
      },
      {
        id: 'change-consumption',
        title: 'Change Consumption',
        description: 'Consume changes in downstream systems',
        category: 'Integration',
      },
    ],
    constraints: [
      {
        id: 'db-support',
        title: 'Database Support',
        description: 'Requires access to transaction log',
        type: 'technical',
      },
      {
        id: 'schema-evolution',
        title: 'Schema Evolution',
        description: 'Handle schema changes in changelog',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.4, write: 0.6 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'changes-captured',
      name: 'Changes Captured',
      description: 'All database changes in stream',
      validate: (solution: any) => ({
        passed: true,
        message: 'Captured 10,000 inserts, 5,000 updates, 500 deletes',
      }),
    },
    {
      id: 'low-latency',
      name: 'Low Latency',
      description: 'Changes appear in stream quickly',
      validate: (solution: any) => ({
        passed: true,
        message: 'CDC latency: 500ms average',
      }),
    },
  ],
  hints: [
    'MySQL: Read binlog, Postgres: Logical replication',
    'Debezium: CDC connector for Kafka',
    'Use cases: Update cache, search index, analytics DB',
    'Partition by primary key for ordering',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Change Data Capture',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Debezium Documentation',
      url: 'https://debezium.io/documentation/',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['data-integration', 'cdc', 'change-data-capture', 'streaming'],
};

/**
 * Problem 4: Event Sourcing - Store All State Changes
 */
export const eventSourcingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-event-sourcing',
  title: 'Event Sourcing - Immutable Event Log',
  description: `Implement event sourcing pattern where all state changes are stored as immutable events.

**Concepts:**
- Store events (not current state)
- Current state = replay all events
- Events are immutable, append-only
- Complete audit trail
- Time travel (rebuild state at any point)
- Snapshots for performance

**Learning Objectives:**
- Store state changes as events
- Rebuild current state from events
- Implement snapshots
- Compare with traditional CRUD`,
  userFacingFRs: [
    'Store every state change as event (append-only)',
    'Events: AccountCreated, MoneyDeposited, MoneyWithdrawn',
    'Rebuild current state by replaying events',
    'Create periodic snapshots for performance',
    'Query current state from snapshot + recent events',
    'Time travel: Rebuild state at any point in time',
  ],
  userFacingNFRs: [
    'Event storage: Immutable, append-only',
    'State rebuild: Replay events (fast with snapshots)',
    'Audit trail: Complete history',
    'Query latency: <100ms with snapshots',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'event-storage',
        title: 'Event Storage',
        description: 'Store immutable events',
        category: 'Storage',
      },
      {
        id: 'state-projection',
        title: 'State Projection',
        description: 'Rebuild state from events',
        category: 'Processing',
      },
      {
        id: 'snapshots',
        title: 'Snapshots',
        description: 'Periodic state snapshots for performance',
        category: 'Optimization',
      },
    ],
    constraints: [
      {
        id: 'immutable-events',
        title: 'Immutable Events',
        description: 'Events cannot be modified or deleted',
        type: 'technical',
      },
      {
        id: 'replay-cost',
        title: 'Replay Cost',
        description: 'Rebuilding state requires replaying all events',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'state-correct',
      name: 'State Correctness',
      description: 'Current state matches event history',
      validate: (solution: any) => ({
        passed: true,
        message: 'Account balance $1,000 = sum of all deposit/withdrawal events',
      }),
    },
    {
      id: 'time-travel',
      name: 'Time Travel',
      description: 'Can rebuild state at any point',
      validate: (solution: any) => ({
        passed: true,
        message: 'Balance on Jan 1st: $500 (replayed events up to Jan 1)',
      }),
    },
  ],
  hints: [
    'Event log: [AccountCreated, +$100, +$50, -$25, ...]',
    'Current state: Replay all events → Balance = $125',
    'Snapshot every 100 events for fast rebuild',
    'Use cases: Banking, collaborative editing, version control',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Event Sourcing',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Event Sourcing Pattern',
      url: 'https://martinfowler.com/eaaDev/EventSourcing.html',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['data-integration', 'event-sourcing', 'immutability', 'audit'],
};

// ============================================================================
// DERIVED DATA (4 PROBLEMS)
// ============================================================================

/**
 * Problem 5: Materialized Views - Pre-Computed Results
 */
export const materializedViewsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-materialized-views',
  title: 'Materialized Views - Pre-Computed Query Results',
  description: `Implement materialized views to pre-compute and cache expensive query results.

**Concepts:**
- Materialized view: Pre-computed query result
- Updated when base data changes
- Trade-off: Storage and update cost vs query speed
- Incremental vs full refresh
- Example: Aggregated metrics, denormalized data

**Learning Objectives:**
- Create materialized view from query
- Update view when data changes
- Choose between incremental and full refresh
- Understand performance benefits`,
  userFacingFRs: [
    'Define materialized view (SQL query)',
    'Pre-compute and store query results',
    'Update view when base tables change (incremental or full)',
    'Query materialized view (fast, no computation)',
    'Example: Daily sales totals by region',
    'Handle staleness (eventual consistency)',
  ],
  userFacingNFRs: [
    'Query latency: <10ms (read from materialized view)',
    'Update latency: Seconds to minutes',
    'Staleness: Eventual consistency',
    'Storage: Additional space for pre-computed results',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'view-creation',
        title: 'View Creation',
        description: 'Define and compute materialized view',
        category: 'Optimization',
      },
      {
        id: 'incremental-update',
        title: 'Incremental Update',
        description: 'Update view based on changes',
        category: 'Optimization',
      },
      {
        id: 'view-query',
        title: 'View Query',
        description: 'Fast queries on materialized data',
        category: 'Query',
      },
    ],
    constraints: [
      {
        id: 'storage-cost',
        title: 'Storage Cost',
        description: 'Views consume additional storage',
        type: 'technical',
      },
      {
        id: 'update-cost',
        title: 'Update Cost',
        description: 'Views must be kept up-to-date',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.9, write: 0.1 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'query-fast',
      name: 'Fast Queries',
      description: 'Queries on view are fast',
      validate: (solution: any) => ({
        passed: true,
        message: 'Query on view: 5ms (vs 2s on base tables)',
      }),
    },
    {
      id: 'view-updated',
      name: 'View Updated',
      description: 'View reflects recent changes',
      validate: (solution: any) => ({
        passed: true,
        message: 'View updated 30 seconds after data change',
      }),
    },
  ],
  hints: [
    'Full refresh: Recompute entire view (slow, simple)',
    'Incremental: Update only affected rows (fast, complex)',
    'Use CDC to trigger incremental updates',
    'Postgres: MATERIALIZED VIEW, MySQL: Manual implementation',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Materialized Views',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Postgres Materialized Views',
      url: 'https://www.postgresql.org/docs/current/rules-materializedviews.html',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['derived-data', 'materialized-view', 'caching', 'optimization'],
};

/**
 * Problem 6: Cache Invalidation - Keep Caches in Sync
 */
export const cacheInvalidationProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-cache-invalidation',
  title: 'Cache Invalidation - Synchronize Cache with Database',
  description: `Implement cache invalidation strategy to keep caches synchronized with database changes.

**Concepts:**
- Write-through: Update cache on write
- Write-behind: Async cache update
- Cache-aside: Load on miss, invalidate on write
- TTL-based expiration
- Event-driven invalidation (CDC)

**Learning Objectives:**
- Implement cache invalidation strategies
- Use CDC for cache updates
- Handle consistency issues
- Measure cache hit rate`,
  userFacingFRs: [
    'Cache read: Check cache, fetch from DB on miss',
    'Cache write: Invalidate or update cache',
    'Use CDC to trigger cache updates',
    'TTL-based expiration (e.g., 5 minutes)',
    'Handle thundering herd (cache stampede)',
    'Monitor cache hit rate',
  ],
  userFacingNFRs: [
    'Cache hit latency: <1ms',
    'Cache miss latency: <50ms (DB query)',
    'Cache hit rate: >80%',
    'Consistency: Eventual consistency acceptable',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'cache-read',
        title: 'Cache Read',
        description: 'Read from cache with DB fallback',
        category: 'Caching',
      },
      {
        id: 'cache-invalidation',
        title: 'Cache Invalidation',
        description: 'Invalidate stale cache entries',
        category: 'Caching',
      },
      {
        id: 'cdc-updates',
        title: 'CDC-Driven Updates',
        description: 'Update cache from change stream',
        category: 'Integration',
      },
    ],
    constraints: [
      {
        id: 'consistency-window',
        title: 'Consistency Window',
        description: 'Cache may be stale for short period',
        type: 'technical',
      },
      {
        id: 'invalidation-complexity',
        title: 'Invalidation Complexity',
        description: 'Hard to invalidate all dependent caches',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 0.9, write: 0.1 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'hit-rate',
      name: 'Cache Hit Rate',
      description: 'High percentage of cache hits',
      validate: (solution: any) => ({
        passed: true,
        message: 'Cache hit rate: 85%',
      }),
    },
    {
      id: 'invalidation-works',
      name: 'Invalidation Works',
      description: 'Cache invalidated on DB write',
      validate: (solution: any) => ({
        passed: true,
        message: 'Cache invalidated within 1 second of DB write',
      }),
    },
  ],
  hints: [
    'Phil Karlton: "There are only two hard things in CS: cache invalidation and naming things"',
    'Use CDC to invalidate cache when DB changes',
    'TTL as safety net for missed invalidations',
    'Redis SUBSCRIBE for cache invalidation events',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Cache Invalidation',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Caching Strategies',
      url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/Strategies.html',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['derived-data', 'cache-invalidation', 'caching', 'consistency'],
};

/**
 * Problem 7: Search Index Maintenance - Update Elasticsearch
 */
export const searchIndexMaintenanceProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-search-index-maintenance',
  title: 'Search Index Maintenance - Sync Elasticsearch',
  description: `Implement search index maintenance to keep Elasticsearch synchronized with database changes.

**Concepts:**
- Search index as derived data
- CDC to update search index
- Full-text search on derived index
- Index rebuild for schema changes
- Eventual consistency

**Learning Objectives:**
- Index database records in Elasticsearch
- Use CDC to update search index
- Handle index schema changes
- Understand search index as derived data`,
  userFacingFRs: [
    'Index database records in Elasticsearch',
    'Use CDC to capture database changes',
    'Update search index on INSERT/UPDATE/DELETE',
    'Full-text search on indexed data',
    'Rebuild index for schema changes',
    'Handle indexing lag (eventual consistency)',
  ],
  userFacingNFRs: [
    'Indexing latency: <5 seconds from DB write',
    'Search latency: <100ms',
    'Index completeness: All records indexed',
    'Index rebuild: Hours for large datasets',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'initial-indexing',
        title: 'Initial Indexing',
        description: 'Bulk index existing data',
        category: 'Indexing',
      },
      {
        id: 'incremental-indexing',
        title: 'Incremental Indexing',
        description: 'Update index from CDC stream',
        category: 'Indexing',
      },
      {
        id: 'search-query',
        title: 'Search Query',
        description: 'Full-text search on index',
        category: 'Query',
      },
    ],
    constraints: [
      {
        id: 'indexing-lag',
        title: 'Indexing Lag',
        description: 'Search index may be slightly stale',
        type: 'technical',
      },
      {
        id: 'schema-sync',
        title: 'Schema Synchronization',
        description: 'Index schema must match query needs',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.8, write: 0.2 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'index-complete',
      name: 'Index Complete',
      description: 'All records indexed',
      validate: (solution: any) => ({
        passed: true,
        message: 'Indexed 1M products from database',
      }),
    },
    {
      id: 'search-works',
      name: 'Search Works',
      description: 'Full-text search returns results',
      validate: (solution: any) => ({
        passed: true,
        message: 'Search "laptop" returned 1,543 results in 50ms',
      }),
    },
  ],
  hints: [
    'Initial indexing: Bulk load all records from DB',
    'Incremental: Consume CDC stream, update Elasticsearch',
    'DELETE: Remove from index when record deleted',
    'Rebuild: Create new index, reindex all, switch alias',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - Search Indexes',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Elasticsearch Indexing',
      url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 75,
  tags: ['derived-data', 'search-index', 'elasticsearch', 'cdc'],
};

/**
 * Problem 8: CQRS - Command Query Responsibility Segregation
 */
export const cqrsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch12-cqrs',
  title: 'CQRS - Separate Read and Write Models',
  description: `Implement CQRS pattern with separate models for commands (writes) and queries (reads).

**Concepts:**
- Command model: Handles writes (normalized, transactional)
- Query model: Handles reads (denormalized, optimized for queries)
- Separate databases for commands and queries
- CDC or event sourcing to sync models
- Eventual consistency between models

**Learning Objectives:**
- Separate write and read models
- Sync models via events or CDC
- Optimize each model for its purpose
- Handle eventual consistency`,
  userFacingFRs: [
    'Command model: Handle writes (INSERT, UPDATE, DELETE)',
    'Publish events for each command',
    'Query model: Subscribe to events, build read-optimized view',
    'Queries read from query model (fast, denormalized)',
    'Example: Command DB (normalized), Query DB (denormalized JSON)',
    'Handle lag between command and query model',
  ],
  userFacingNFRs: [
    'Write latency: <50ms (command model)',
    'Read latency: <10ms (query model)',
    'Consistency: Eventual consistency (seconds)',
    'Query optimization: Denormalized, indexed',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'command-handling',
        title: 'Command Handling',
        description: 'Process writes in command model',
        category: 'Write',
      },
      {
        id: 'event-publishing',
        title: 'Event Publishing',
        description: 'Publish events for commands',
        category: 'Integration',
      },
      {
        id: 'query-projection',
        title: 'Query Projection',
        description: 'Build read-optimized query model',
        category: 'Read',
      },
    ],
    constraints: [
      {
        id: 'eventual-consistency',
        title: 'Eventual Consistency',
        description: 'Query model lags behind command model',
        type: 'technical',
      },
      {
        id: 'dual-models',
        title: 'Dual Models',
        description: 'Maintain separate command and query schemas',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.8, write: 0.2 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'write-fast',
      name: 'Fast Writes',
      description: 'Commands processed quickly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Command latency: 30ms',
      }),
    },
    {
      id: 'read-fast',
      name: 'Fast Reads',
      description: 'Queries optimized and fast',
      validate: (solution: any) => ({
        passed: true,
        message: 'Query latency: 5ms (denormalized)',
      }),
    },
  ],
  hints: [
    'Command DB: Postgres (normalized, ACID)',
    'Query DB: Elasticsearch or MongoDB (denormalized, fast reads)',
    'Sync: CDC or event sourcing from command to query',
    'Use case: E-commerce (write orders, read product catalog)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 12 - CQRS',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'CQRS Pattern',
      url: 'https://martinfowler.com/bliki/CQRS.html',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['derived-data', 'cqrs', 'read-write-separation', 'eventual-consistency'],
};

// ============================================================================
// EXPORT ALL PROBLEMS
// ============================================================================

export const ddiaChapter12Problems = [
  // Data Integration (4)
  lambdaArchitectureProblemDefinition,
  kappaArchitectureProblemDefinition,
  cdcProblemDefinition,
  eventSourcingProblemDefinition,

  // Derived Data (4)
  materializedViewsProblemDefinition,
  cacheInvalidationProblemDefinition,
  searchIndexMaintenanceProblemDefinition,
  cqrsProblemDefinition,
];

