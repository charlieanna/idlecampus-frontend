import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * DDIA Teaching Problems - Chapter 3: Storage and Retrieval
 * Total: 10 problems
 *
 * Focus: Log-structured storage, page-oriented storage, data warehousing
 */

// ============================================================================
// 3.1 Log-Structured Storage
// ============================================================================

/**
 * Problem 28: Append-Only Log
 * Teaches: Implement write-ahead log (WAL)
 */
export const appendOnlyLogProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-append-only-log',
  title: 'Append-Only Log - Write-Ahead Log (WAL)',
  description: `Implement an append-only log where all writes are appended to the end of a log file. This is the foundation of many storage engines and provides durability through write-ahead logging.

Learning objectives:
- Understand append-only data structures
- Implement write-ahead logging for durability
- Handle log compaction and garbage collection
- Sequential writes are faster than random writes

Key requirements:
- Append all writes to log file (sequential I/O)
- Flush log to disk before acknowledging write
- Read by scanning log (or use index)
- Compact log periodically to remove old entries`,

  userFacingFRs: [
    'Append writes to log file sequentially',
    'Fsync log to disk before acknowledgment',
    'Read by scanning log from beginning (slow) or use hash index',
    'Compact log: Remove old versions, merge segments',
  ],
  userFacingNFRs: [
    'Write latency: <10ms (sequential writes)',
    'Read latency: <100ms with index, seconds without',
    'Durability: 100% after fsync',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Disk/SSD for append-only log',
      },
      {
        type: 'compute',
        reason: 'Log management (append, compact)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Append and read log',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-append-only-log', problemConfigs['ddia-ch3-append-only-log'] || {
    baseRps: 1000,
    readRatio: 0.3,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Append writes sequentially',
    'Fsync to disk',
    'Read with index',
    'Compact log',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 29: LSM Trees
 * Teaches: SSTables and compaction
 */
export const lsmTreesProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-lsm-trees',
  title: 'LSM Trees - SSTables & Compaction',
  description: `Implement LSM (Log-Structured Merge) trees used in databases like Cassandra, RocksDB, and LevelDB. LSM trees optimize for write-heavy workloads by batching writes in memory then flushing to disk.

Learning objectives:
- Understand LSM tree structure (memtable + SSTables)
- Implement memtable (in-memory sorted tree)
- Flush memtable to SSTable on disk
- Compact SSTables to merge and remove duplicates

LSM Tree components:
- Memtable: In-memory sorted tree (red-black tree, AVL tree)
- SSTables: Immutable sorted files on disk
- Compaction: Merge SSTables, remove old versions

Key requirements:
- Write to memtable first (fast, in-memory)
- Flush memtable to SSTable when full
- Read from memtable + SSTables (check newest first)
- Compact SSTables in background`,

  userFacingFRs: [
    'Write to memtable (in-memory sorted tree)',
    'Flush memtable to SSTable when size > 64MB',
    'SSTables are immutable, sorted by key',
    'Read: Check memtable first, then SSTables (newest to oldest)',
    'Background compaction: Merge SSTables, remove old versions',
  ],
  userFacingNFRs: [
    'Write latency: <1ms (in-memory)',
    'Read latency: <50ms (may check multiple SSTables)',
    'Write amplification: ~10x (due to compaction)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Memtable in memory',
      },
      {
        type: 'storage',
        reason: 'SSTables on disk',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Flush memtable to SSTables',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-lsm-trees', problemConfigs['ddia-ch3-lsm-trees'] || {
    baseRps: 5000,
    readRatio: 0.5,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Write to memtable',
    'Flush to SSTable',
    'Read from memtable + SSTables',
    'Background compaction',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 30: Bloom Filters
 * Teaches: Optimize read performance with bloom filters
 */
export const bloomFiltersProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-bloom-filters',
  title: 'Bloom Filters - Fast Negative Lookups',
  description: `Use bloom filters to avoid reading SSTables that don't contain a key. Bloom filters are space-efficient probabilistic data structures that can quickly tell if a key is NOT in a set.

Learning objectives:
- Understand bloom filter structure (bit array + hash functions)
- No false negatives (if bloom says NO, definitely not present)
- May have false positives (if bloom says YES, might be present)
- Trade-off: Size vs false positive rate

Bloom filter:
- Bit array of size m
- k hash functions
- Set k bits to 1 when inserting key
- Check k bits when querying key

Key requirements:
- Create bloom filter per SSTable
- Check bloom filter before reading SSTable
- If bloom says NO, skip SSTable entirely
- If bloom says YES, read SSTable (may be false positive)`,

  userFacingFRs: [
    'Create bloom filter for each SSTable (during flush)',
    'On read, check bloom filters first',
    'Skip SSTables where bloom filter says NO',
    'Read SSTables where bloom filter says YES',
  ],
  userFacingNFRs: [
    'Bloom filter size: 10 bits per key',
    'False positive rate: ~1%',
    'Read speedup: 10x for non-existent keys',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Bloom filter in memory',
      },
      {
        type: 'storage',
        reason: 'SSTables on disk',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Check bloom filter before SSTable read',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-bloom-filters', problemConfigs['ddia-ch3-bloom-filters'] || {
    baseRps: 3000,
    readRatio: 0.8,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Create bloom filters',
    'Check before reads',
    'Skip SSTables on NO',
    'Read on YES',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 3.2 Page-Oriented Storage
// ============================================================================

/**
 * Problem 31: B-Trees
 * Teaches: Design B-tree index
 */
export const bTreesProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-b-trees',
  title: 'B-Trees - Page-Oriented Index',
  description: `Implement B-tree indexes used in most relational databases. B-trees store data in fixed-size pages and maintain sorted order for efficient range queries.

Learning objectives:
- Understand B-tree structure (nodes, keys, pointers)
- Insert, update, delete with page splits/merges
- Range queries are efficient (sorted order)
- In-place updates (unlike LSM append-only)

B-tree structure:
- Fixed-size pages (typically 4KB)
- Internal nodes: keys + pointers to child pages
- Leaf nodes: keys + values (or pointers to rows)
- Sorted by key for range queries

Key requirements:
- Store data in 4KB pages
- Split page when full (insert)
- Merge pages when too empty (delete)
- Maintain sorted order
- Support range queries`,

  userFacingFRs: [
    'Store data in fixed-size pages (4KB)',
    'Insert: Add to leaf page, split if full',
    'Delete: Remove from leaf, merge if too empty',
    'Range query: Scan leaf pages in order',
  ],
  userFacingNFRs: [
    'Read latency: <10ms (log(N) page reads)',
    'Write latency: <20ms (may require split)',
    'Write amplification: ~2x (entire page rewrite)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Disk with page-based storage',
      },
      {
        type: 'compute',
        reason: 'B-tree logic (insert, split, merge)',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read/write pages',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-b-trees', problemConfigs['ddia-ch3-b-trees'] || {
    baseRps: 2000,
    readRatio: 0.7,
    maxLatency: 20,
    availability: 0.99,
  }, [
    '4KB pages',
    'Insert with split',
    'Delete with merge',
    'Range queries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 32: Write-Ahead Log (WAL) for Crash Recovery
 * Teaches: Use WAL for durability with B-trees
 */
export const walCrashRecoveryProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-wal-crash-recovery',
  title: 'WAL - Crash Recovery',
  description: `Implement write-ahead logging (WAL) to provide crash recovery for B-trees. WAL ensures durability by writing changes to a log before modifying the B-tree pages.

Learning objectives:
- Write to WAL before modifying pages
- WAL enables crash recovery (replay log)
- Checkpointing to reduce recovery time
- Fsync WAL for durability

WAL protocol:
1. Write change to WAL
2. Fsync WAL to disk
3. Modify B-tree page in memory
4. Eventually flush page to disk

On crash recovery:
- Replay WAL from last checkpoint
- Restore database to consistent state

Key requirements:
- Append all changes to WAL before page modification
- Fsync WAL for durability
- Checkpoint periodically (flush all dirty pages)
- Replay WAL on startup after crash`,

  userFacingFRs: [
    'Write all B-tree modifications to WAL first',
    'Fsync WAL before acknowledging write',
    'Modify B-tree pages in memory (dirty pages)',
    'Flush dirty pages to disk periodically',
    'Checkpoint: Flush all dirty pages, truncate WAL',
    'Recovery: Replay WAL from last checkpoint',
  ],
  userFacingNFRs: [
    'Write latency: <30ms (WAL fsync)',
    'Recovery time: <10 seconds',
    'Durability: 100%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'WAL on disk',
      },
      {
        type: 'storage',
        reason: 'B-tree pages on disk',
      },
      {
        type: 'compute',
        reason: 'WAL writer and recovery manager',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write WAL and pages',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-wal-crash-recovery', problemConfigs['ddia-ch3-wal-crash-recovery'] || {
    baseRps: 1500,
    readRatio: 0.4,
    maxLatency: 30,
    availability: 0.9999,
  }, [
    'Write to WAL first',
    'Fsync WAL',
    'Modify pages',
    'Checkpoint and recovery',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 33: Copy-on-Write (CoW)
 * Teaches: Alternative to in-place updates
 */
export const copyOnWriteProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-copy-on-write',
  title: 'Copy-on-Write - Immutable Pages',
  description: `Implement copy-on-write (CoW) where modified pages are written to new locations rather than updating in place. This enables efficient snapshots and MVCC.

Learning objectives:
- Write modified pages to new location
- Parent pointers updated to point to new page
- Old pages kept for snapshots/historical reads
- Used in LMDB, Btrfs, ZFS

CoW benefits:
- Easy snapshots (keep old root pointer)
- No need for WAL (atomic updates by updating root)
- MVCC for free

Key requirements:
- Write new page instead of modifying existing
- Update parent pointer atomically
- Garbage collect old pages
- Support snapshots (multiple root pointers)`,

  userFacingFRs: [
    'On write: Copy page to new location with modifications',
    'Update parent pointer to new page location',
    'Atomically update root pointer (no WAL needed)',
    'Keep old pages for snapshots',
    'Garbage collect unreachable pages',
  ],
  userFacingNFRs: [
    'Write latency: <25ms',
    'Snapshot creation: Instant (copy root pointer)',
    'Storage overhead: Old versions kept',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Disk with CoW support',
      },
      {
        type: 'compute',
        reason: 'CoW logic and GC',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write new pages, update pointers',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-copy-on-write', problemConfigs['ddia-ch3-copy-on-write'] || {
    baseRps: 1200,
    readRatio: 0.6,
    maxLatency: 25,
    availability: 0.99,
  }, [
    'Copy page on write',
    'Update parent pointer',
    'Snapshot support',
    'Garbage collection',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 3.3 Data Warehousing
// ============================================================================

/**
 * Problem 34: Star Schema
 * Teaches: Design fact and dimension tables
 */
export const starSchemaProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-star-schema',
  title: 'Star Schema - Fact & Dimension Tables',
  description: `Design a star schema for a data warehouse with a central fact table surrounded by dimension tables. Star schemas optimize for analytical queries (OLAP).

Learning objectives:
- Fact table: Stores measurements/metrics (sales, clicks)
- Dimension tables: Stores descriptive attributes (time, product, customer)
- Denormalized for query performance
- Optimize for read-heavy analytics

Example: Sales data warehouse
- Fact: sales_fact (date_id, product_id, customer_id, quantity, revenue)
- Dimensions: date_dim, product_dim, customer_dim

Key requirements:
- Central fact table with foreign keys to dimensions
- Dimension tables denormalized
- Support analytical queries (aggregations, group by)
- Optimize for read performance (not writes)`,

  userFacingFRs: [
    'Design fact table with metrics and dimension foreign keys',
    'Create dimension tables (date, product, customer)',
    'Denormalize dimensions for performance',
    'Support aggregate queries: SUM(revenue) GROUP BY product, date',
  ],
  userFacingNFRs: [
    'Query latency: <5 seconds for aggregate queries',
    'Storage: Larger than normalized (denormalized)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Data warehouse (Snowflake, Redshift, BigQuery)',
      },
      {
        type: 'compute',
        reason: 'ETL pipeline to load data',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Load and query warehouse',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-star-schema', problemConfigs['ddia-ch3-star-schema'] || {
    baseRps: 100,
    readRatio: 0.95,
    maxLatency: 5000,
    availability: 0.99,
  }, [
    'Fact table with metrics',
    'Dimension tables',
    'Denormalization',
    'Aggregate queries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 35: Snowflake Schema
 * Teaches: Normalized dimension tables
 */
export const snowflakeSchemaProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-snowflake-schema',
  title: 'Snowflake Schema - Normalized Dimensions',
  description: `Design a snowflake schema where dimension tables are normalized into sub-dimensions. More storage-efficient than star schema but requires more joins.

Learning objectives:
- Normalize dimension tables (reduce redundancy)
- More complex queries (more joins)
- Storage vs query performance trade-off

Example: Snowflake schema
- Fact: sales_fact
- Dimension: product_dim → category_dim, brand_dim
- Customer_dim → city_dim → state_dim → country_dim

Key requirements:
- Normalize dimension tables
- Reduce storage redundancy
- Accept slower queries due to more joins`,

  userFacingFRs: [
    'Normalize dimension tables into sub-dimensions',
    'Product dimension: product_dim → category_dim, brand_dim',
    'Customer dimension: customer_dim → city_dim → state_dim',
    'Queries require more joins than star schema',
  ],
  userFacingNFRs: [
    'Storage: Smaller than star schema',
    'Query latency: Slower than star schema (more joins)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Data warehouse',
      },
      {
        type: 'compute',
        reason: 'ETL and query engine',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Load and query',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-snowflake-schema', problemConfigs['ddia-ch3-snowflake-schema'] || {
    baseRps: 80,
    readRatio: 0.95,
    maxLatency: 8000,
    availability: 0.99,
  }, [
    'Normalized dimensions',
    'Sub-dimensions',
    'Storage efficiency',
    'Slower queries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 36: Columnar Storage
 * Teaches: Optimize for analytical queries
 */
export const columnarStorageProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-columnar-storage',
  title: 'Columnar Storage - Column-Oriented Database',
  description: `Implement columnar storage where each column is stored separately on disk. This is optimal for analytical workloads that read few columns but many rows.

Learning objectives:
- Store each column in separate file
- Read only needed columns (vs entire rows)
- Compression works better on columns
- Used in Parquet, ORC, BigQuery, Redshift

Columnar benefits:
- Read only needed columns (faster, less I/O)
- Better compression (similar values together)
- Vectorized processing (CPU cache friendly)

Key requirements:
- Store each column separately
- Read only queried columns
- Compress columns (run-length, dictionary encoding)
- Support analytical queries efficiently`,

  userFacingFRs: [
    'Store each column in separate file',
    'Query: SELECT revenue, product WHERE date = \'2024-01-01\'',
    'Read only revenue, product, date columns (not all)',
    'Compress columns with run-length encoding, dictionary encoding',
  ],
  userFacingNFRs: [
    'Query latency: 10x faster than row-oriented for analytics',
    'Compression ratio: 10:1 typical',
    'Write latency: Slower (must update all column files)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Columnar database (Redshift, BigQuery, Parquet)',
      },
      {
        type: 'compute',
        reason: 'Query engine',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read columns, not rows',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-columnar-storage', problemConfigs['ddia-ch3-columnar-storage'] || {
    baseRps: 50,
    readRatio: 0.98,
    maxLatency: 3000,
    availability: 0.99,
  }, [
    'Store columns separately',
    'Read only needed columns',
    'Compress columns',
    'Fast analytics',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 37: Materialized Views
 * Teaches: Pre-compute aggregations
 */
export const materializedViewsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch3-materialized-views',
  title: 'Materialized Views - Pre-computed Aggregations',
  description: `Create materialized views that store pre-computed query results. Materialized views trade storage and update cost for faster read performance.

Learning objectives:
- Pre-compute expensive aggregations
- Store results in a table (materialized view)
- Refresh views periodically or incrementally
- Trade-off: Stale data vs query speed

Example: Daily sales summary
- View: CREATE MATERIALIZED VIEW daily_sales AS
  SELECT date, product, SUM(revenue) FROM sales GROUP BY date, product
- Query view instead of raw sales table (much faster)

Key requirements:
- Define materialized views for common queries
- Refresh views periodically (nightly) or incrementally (on write)
- Query views for fast results
- Accept potentially stale data`,

  userFacingFRs: [
    'Create materialized view for expensive query',
    'Refresh view: Full refresh (rebuild) or incremental (update)',
    'Query materialized view instead of base table',
    'Monitor staleness (time since last refresh)',
  ],
  userFacingNFRs: [
    'Query latency: <100ms (vs seconds on base table)',
    'Staleness: Up to 24 hours (daily refresh)',
    'Storage: 2x (base table + view)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with materialized views',
      },
      {
        type: 'compute',
        reason: 'View refresh scheduler',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Refresh and query views',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch3-materialized-views', problemConfigs['ddia-ch3-materialized-views'] || {
    baseRps: 500,
    readRatio: 0.99,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Create materialized views',
    'Refresh periodically',
    'Query views',
    'Monitor staleness',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all Chapter 3 problems
export const ddiaChapter3Problems = [
  appendOnlyLogProblemDefinition,
  lsmTreesProblemDefinition,
  bloomFiltersProblemDefinition,
  bTreesProblemDefinition,
  walCrashRecoveryProblemDefinition,
  copyOnWriteProblemDefinition,
  starSchemaProblemDefinition,
  snowflakeSchemaProblemDefinition,
  columnarStorageProblemDefinition,
  materializedViewsProblemDefinition,
];
