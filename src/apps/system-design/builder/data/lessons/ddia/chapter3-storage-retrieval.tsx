import { SystemDesignLesson } from '../../../types/lesson';
import {
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section,
  ComparisonTable, KeyPoint, Example, Divider, InfoBox
} from '../../../ui/components/LessonContent';

export const ddiaChapter3StorageRetrievalLesson: SystemDesignLesson = {
  id: 'ddia-ch3-storage-retrieval',
  slug: 'ddia-ch3-storage-retrieval',
  title: 'Storage & Retrieval (DDIA Ch. 3)',
  description: 'Master storage engine fundamentals and critical trade-offs: WHEN to use LSM-trees vs B-trees, HOW write amplification affects performance, WHICH storage engine fits your workload (OLTP vs OLAP).',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 90,

  // Progressive flow metadata
  moduleId: 'sd-module-4-ddia',
  sequenceOrder: 2,
  stages: [
    {
      id: 'intro-storage',
      type: 'concept',
      title: 'Storage Engine Fundamentals',
      content: (
        <Section>
          <H1>Storage Engine Fundamentals</H1>
          <P>
            Storage engines determine how data is stored on disk and how it's retrieved. There are two main approaches:
          </P>
          <UL>
            <LI><Strong>Log-Structured Storage:</Strong> Append-only logs, optimized for writes (LSM trees)</LI>
            <LI><Strong>Page-Oriented Storage:</Strong> Fixed-size pages, optimized for reads (B-trees)</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'append-only-log',
      type: 'concept',
      title: 'Append-Only Log & Write-Ahead Log (WAL)',
      content: (
        <Section>
          <H1>Append-Only Log & Write-Ahead Log (WAL)</H1>
          <P>
            An <Strong>append-only log</Strong> writes all changes sequentially to a log file. This is the foundation
            of <Strong>Write-Ahead Logging (WAL)</Strong> used in databases for durability.
          </P>

          <H2>How It Works</H2>
          <OL>
            <LI>Write operation arrives</LI>
            <LI>Append to log file (sequential write - fast!)</LI>
            <LI>Flush (fsync) log to disk for durability</LI>
            <LI>Update in-memory data structure</LI>
            <LI>Acknowledge write to client</LI>
          </OL>

          <Example title="Append-Only Log Structure">
            <CodeBlock>
{`// Log file (append-only)
SET key1=value1
SET key2=value2
DELETE key1
SET key3=value3

// To read, scan log from beginning (or use hash index)
// To compact, merge segments and remove old values`}
            </CodeBlock>
          </Example>

          <H2>Advantages</H2>
          <UL>
            <LI><Strong>Fast Writes:</Strong> Sequential writes are much faster than random writes</LI>
            <LI><Strong>Durability:</Strong> Fsync ensures data survives crashes</LI>
            <LI><Strong>Simple:</Strong> Easy to implement and reason about</LI>
          </UL>

          <H2>Disadvantages</H2>
          <UL>
            <LI><Strong>Slow Reads:</Strong> Must scan entire log (unless indexed)</LI>
            <LI><Strong>Log Growth:</Strong> Log grows indefinitely, needs compaction</LI>
          </UL>

          <KeyPoint>
            <Strong>Use Case:</Strong> Write-ahead logging in databases, event sourcing, message queues (Kafka).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'lsm-trees',
      type: 'concept',
      title: 'LSM Trees - Log-Structured Merge Trees',
      content: (
        <Section>
          <H1>LSM Trees - Log-Structured Merge Trees</H1>
          <P>
            <Strong>LSM (Log-Structured Merge) trees</Strong> optimize for write-heavy workloads by batching writes
            in memory, then flushing to disk as sorted segments (SSTables).
          </P>

          <H2>Structure</H2>
          <UL>
            <LI><Strong>Memtable:</Strong> In-memory sorted tree (red-black tree, AVL tree)</LI>
            <LI><Strong>SSTables:</Strong> Sorted String Tables on disk (immutable, sorted by key)</LI>
            <LI><Strong>Bloom Filters:</Strong> Probabilistic data structure to quickly check if key exists</LI>
          </UL>

          <H2>Write Process</H2>
          <OL>
            <LI>Write to memtable (in-memory, fast)</LI>
            <LI>When memtable full, flush to disk as new SSTable</LI>
            <LI>Periodically merge SSTables (compaction) to remove duplicates</LI>
          </OL>

          <H2>Read Process</H2>
          <OL>
            <LI>Check memtable first</LI>
            <LI>Check Bloom filter for each SSTable (quickly skip if key doesn't exist)</LI>
            <LI>Search SSTables from newest to oldest</LI>
            <LI>Return first match found</LI>
          </OL>

          <Example title="LSM Tree Example">
            <CodeBlock>
{`// Memtable (in-memory)
{ key1: value1, key2: value2, key3: value3 }

// Flush to disk when full
SSTable-1: [key1, key2, key3] (sorted)

// New writes go to new memtable
// When full, flush to SSTable-2
SSTable-2: [key2: new_value, key4: value4]

// Compaction merges SSTables, removes old key2
SSTable-merged: [key1, key2: new_value, key3, key4]`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Used By:</Strong> Cassandra, RocksDB, LevelDB, HBase. Excellent for write-heavy workloads.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'btrees',
      type: 'concept',
      title: 'B-Trees - Page-Oriented Storage',
      content: (
        <Section>
          <H1>B-Trees - Page-Oriented Storage</H1>
          <P>
            <Strong>B-trees</Strong> organize data in fixed-size <Strong>pages</Strong> (typically 4KB) on disk.
            Optimized for both reads and writes, with predictable performance.
          </P>

          <H2>Structure</H2>
          <UL>
            <LI><Strong>Pages:</Strong> Fixed-size blocks (4KB) containing keys and pointers</LI>
            <LI><Strong>Branch Pages:</Strong> Internal nodes with keys and child pointers</LI>
            <LI><Strong>Leaf Pages:</Strong> Leaf nodes with keys and values</LI>
            <LI><Strong>Balanced Tree:</Strong> All leaves at same depth</LI>
          </UL>

          <H2>Read Process</H2>
          <OL>
            <LI>Start at root page</LI>
            <LI>Binary search within page to find child pointer</LI>
            <LI>Follow pointer to child page</LI>
            <LI>Repeat until leaf page reached</LI>
            <LI>Binary search leaf page for key</LI>
          </OL>

          <H2>Write Process</H2>
          <OL>
            <LI>Find leaf page (same as read)</LI>
            <LI>If page has space, insert/update</LI>
            <LI>If page full, split page (create new page, redistribute keys)</LI>
            <LI>Update parent pages if split occurred</LI>
            <LI>Write pages to disk (WAL for durability)</LI>
          </OL>

          <Example title="B-Tree Structure">
            <CodeBlock>
{`// B-Tree with branching factor 3
        [50]
       /    \\
    [20,30]  [70,80]
    /  |  \\   /  |  \\
  [10][25][40] [60][75][90]

// To find key 25:
// 1. Start at root [50], 25 < 50, go left
// 2. At [20,30], 25 is between 20 and 30, go middle
// 3. Found at leaf [25]`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Used By:</Strong> PostgreSQL, MySQL, SQLite. Standard for most relational databases.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'lsm-vs-btree-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: LSM-Trees vs B-Trees',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: LSM-Trees vs B-Trees</H1>
          <P>
            <Strong>The Decision:</Strong> LSM-trees excel at write-heavy workloads (10× faster writes) but have slower,
            unpredictable reads due to compaction. B-trees provide consistent read/write performance but suffer from write
            amplification. Wrong choice: either slow writes killing ingestion throughput or unpredictable tail latency
            degrading user experience.
          </P>

          <ComparisonTable
            headers={['Factor', 'LSM-Tree (RocksDB)', 'B-Tree (PostgreSQL)', 'B+ Tree (InnoDB)', 'Hash Index (Redis)']}
            rows={[
              ['Write Throughput', '100k writes/sec', '10k writes/sec', '15k writes/sec', '500k writes/sec (in-memory)'],
              ['Read Latency (p50)', '1ms', '0.5ms', '0.5ms', '0.1ms'],
              ['Read Latency (p99)', '50ms (compaction)', '2ms (consistent)', '3ms (consistent)', '1ms'],
              ['Write Amplification', '10-30× (compaction)', '2-3× (page updates)', '2-4× (page updates)', '1× (in-memory)'],
              ['Space Amplification', '10-30% overhead', '50-100% overhead (pages)', '50% overhead', 'Minimal'],
              ['Compaction Impact', 'High (background I/O)', 'Low (incremental)', 'Medium (buffer pool)', 'None'],
              ['Range Scans', 'Good (sequential SSTables)', 'Excellent (sorted pages)', 'Excellent (linked leaves)', 'None (hash only)'],
              ['Point Queries', 'Good (bloom filters)', 'Excellent (direct lookup)', 'Excellent (clustered)', 'Excellent'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Time-Series Metrics Database</H2>
          <Example title="LSM vs B-Tree - Write Throughput vs Read Latency">
            <CodeBlock>
{`Scenario: Metrics ingestion system
Load: 100k metrics/sec (write-heavy), 10k queries/sec (read)
Data: 1B time-series data points, 100GB data

---

Approach 1: B-Tree (PostgreSQL with BTREE index)

Schema:
CREATE TABLE metrics (
  timestamp BIGINT,
  metric_id INT,
  value DOUBLE,
  PRIMARY KEY (metric_id, timestamp)
) WITH (fillfactor = 90);  -- Leave space for updates

CREATE INDEX idx_timestamp ON metrics(timestamp);

Write Performance:
- Throughput: 10k writes/sec (single node)
- Latency: 1ms per write (WAL + index update)
- Write amplification: 3×
  * Write to WAL (8KB)
  * Write to table page (4KB)
  * Write to index page (4KB)
  * Total: 16KB disk I/O per 1KB write

Problem: Can't handle 100k writes/sec ❌
- Need 10 servers to handle load
- Cost: $3,000/mo (10× r5.large)

Read Performance:
- Latency: 0.5ms (p50), 2ms (p99) ✅
- Consistent, predictable
- Range scans: 100ms for 10k points

Decision: ❌ Too expensive for write-heavy workload

---

Approach 2: LSM-Tree (RocksDB / Cassandra)

Schema (Cassandra CQL):
CREATE TABLE metrics (
  metric_id INT,
  timestamp BIGINT,
  value DOUBLE,
  PRIMARY KEY (metric_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC)
  AND compaction = {
    'class': 'LeveledCompactionStrategy',
    'sstable_size_in_mb': 160
  };

Write Performance:
- Throughput: 100k writes/sec (single node) ✅
- Latency: 0.1ms per write (memtable only)
- Write amplification: 10-30× (compaction)
  * Write to memtable (0 disk I/O)
  * Flush to L0 SSTable (1× write)
  * Compact L0 → L1 (write 10×)
  * Compact L1 → L2 (write 100×)
  * Total: ~30× amplification over time

Why faster despite amplification?
- Writes batched (sequential I/O)
- Compaction async (doesn't block writes)
- No random writes (all sequential)

Cost: $300/mo (1× r5.large)
Savings: $2,700/mo vs B-tree ✅

Read Performance:
- Latency: 1ms (p50), 50ms (p99) ⚠️
- p99 high due to compaction interference
- Range scans: 200ms for 10k points (read multiple SSTables)

Compaction Impact:
Level 0: 10 SSTables (0-100MB each)
Level 1: 100 SSTables (100MB each = 10GB)
Level 2: 1000 SSTables (100MB each = 100GB)

Read must check:
- Memtable (10MB in memory)
- L0: 10 SSTables (bloom filter check + binary search)
- L1: 1 SSTable (if not in L0)
- L2: 1 SSTable (if not in L1)

Worst case: 12 SSTable reads (memtable + 10 L0 + 1 L1 + 1 L2)
Best case: 1 read (memtable hit)

Compaction throttling:
When: Background compaction running
Impact: Read latency +20ms (disk I/O contention)
Frequency: 10% of the time

Decision: ✅ BEST for write-heavy metrics ingestion

---

Approach 3: Hybrid (PostgreSQL + TimescaleDB)

TimescaleDB uses:
- B-tree for recent data (hot partition)
- Compression for old data (cold partition)

Schema:
CREATE TABLE metrics (
  timestamp TIMESTAMPTZ NOT NULL,
  metric_id INT,
  value DOUBLE
);

SELECT create_hypertable('metrics', 'timestamp');

Performance:
- Write: 50k writes/sec (2× partitions)
- Read (recent): 0.5ms (B-tree)
- Read (historical): 5ms (compressed)

Compression:
- Hot data (1 day): Uncompressed B-tree
- Warm data (7 days): Compressed B-tree (10× space reduction)
- Cold data (30 days): Highly compressed (30× reduction)

Storage: 100GB → 10GB (compression)

Cost: $500/mo (2× r5.large)

Decision: ✅ Good balance for time-series (recent fast, old compressed)

---

Write Amplification Comparison:

B-Tree (PostgreSQL):
- 1KB write → 16KB disk I/O (3× amplification)
- 100k writes/sec → 1.6GB/sec I/O ❌
- Exceeds SSD capacity (500MB/sec sustained)
- Result: Write throttling, high latency

LSM-Tree (RocksDB):
- 1KB write → 10-30KB disk I/O (amortized over time)
- But: Writes batched, sequential, async
- 100k writes/sec → 300MB/sec I/O ✅
- Within SSD capacity
- Result: High throughput, consistent write latency

---

Compaction Strategies:

Size-Tiered Compaction (Cassandra default):
- Merge SSTables of similar size
- Pro: Less write amplification (10×)
- Con: More space amplification (30%)
- Use: Write-heavy workloads

Leveled Compaction:
- Organize SSTables into levels
- Pro: Less space amplification (10%)
- Con: More write amplification (30×)
- Use: Read-heavy workloads, limited space

---

Decision Matrix:

Workload: Write-heavy (100k writes/sec)
Read SLA: p99 < 10ms
→ Use LSM-tree (Cassandra, RocksDB)

Workload: Balanced (10k writes/sec, 10k reads/sec)
Read SLA: p99 < 5ms
→ Use B-tree (PostgreSQL, MySQL)

Workload: Write-heavy BUT need predictable reads
Read SLA: p99 < 5ms (strict)
→ Use hybrid (separate read/write paths)
   Writes: LSM-tree (fast ingestion)
   Reads: Materialized views (B-tree)

Workload: Time-series (write-once, read-many historical)
→ Use TimescaleDB or InfluxDB
   Compression for old data
   B-tree for recent data`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Storage Engine Decision Tree

write_qps = measure_write_throughput()
read_latency_sla = get_read_latency_requirement()
workload_type = analyze_workload_pattern()

if (write_qps > 50k):
    # Write-heavy workload
    if (read_latency_sla_p99 < 10ms):
        return "LSM-tree with tuned compaction"
        # Cassandra, RocksDB, ScyllaDB
    elif (read_latency_sla_p99 < 5ms):
        warning("LSM p99 may exceed 5ms during compaction")
        return "Hybrid: LSM for writes, separate read replicas (B-tree)"
    else:
        return "LSM-tree (default)"

elif (write_qps > 10k && read_qps > 10k):
    # Balanced workload
    if (need_consistent_latency):
        return "B-tree (PostgreSQL, MySQL)"
        # Predictable p99 latency
    else:
        return "LSM-tree with leveled compaction"
        # Better space efficiency

elif (read_qps > 100k):
    # Read-heavy workload
    return "B-tree with read replicas"
    # Or: Caching layer (Redis) + B-tree

elif (time_series_data):
    # Time-series specific
    return "TimescaleDB or InfluxDB"
    # Optimized for time-series patterns

else:
    return "B-tree"  # Safe default

# Write amplification check:
if (write_iops_limit && lsm_write_amplification × write_qps > ssd_capacity):
    warning("LSM write amplification exceeds SSD capacity")
    return "B-tree or upgrade SSD"`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using LSM-tree for latency-sensitive applications</Strong>
            <P>
              Example: User-facing API with p99 latency SLA {'<'} 10ms uses Cassandra → compaction runs → p99 latency spikes
              to 100ms → SLA violation → user complaints. LSM-tree compaction causes unpredictable tail latency due to
              background I/O interference.
            </P>
            <P>
              <Strong>Fix:</Strong> For strict latency SLAs (p99 {'<'} 10ms), use B-tree (PostgreSQL, MySQL) instead. Or:
              Separate read/write paths - LSM for writes, B-tree replicas for reads. Or: Tune compaction aggressiveness
              (reduce background I/O). Monitor p99 latency during compaction cycles. Use separate SSD for compaction if possible.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Not accounting for write amplification on SSDs</Strong>
            <P>
              Example: LSM-tree with 30× write amplification ingesting 10k writes/sec (10MB/sec data) → 300MB/sec actual
              SSD writes → exceeds SSD endurance (300TB write lifetime ÷ 300MB/sec = 12 months lifespan) → SSD fails after
              1 year → data loss. Write amplification significantly reduces SSD lifetime.
            </P>
            <P>
              <Strong>Fix:</Strong> Calculate total write amplification: App writes × DB write amp × SSD write amp. For
              LSM: 10-30× DB amplification + 3-10× SSD internal amplification = 30-300× total. Choose SSDs rated for high
              endurance (enterprise SSDs: 5-10 DWPD vs consumer: 0.3 DWPD). Or: Reduce compaction frequency. Or: Use
              size-tiered compaction (10× vs leveled 30×). Monitor SSD wear level.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Using B-tree for write-heavy workloads</Strong>
            <P>
              Example: Metrics ingestion (100k writes/sec) uses PostgreSQL → write throughput capped at 10k writes/sec →
              write queue backs up → 10 second write latency → monitoring data delayed → missed alerts for production outage.
              B-tree can't handle extreme write throughput.
            </P>
            <P>
              <Strong>Fix:</Strong> For write-heavy workloads ({'>'} 50k writes/sec), use LSM-tree (Cassandra, RocksDB, ScyllaDB).
              Or: Partition PostgreSQL (10 shards = 100k writes/sec total). Or: Use write-optimized storage (TimescaleDB with
              compression). Don't force-fit B-tree for write-heavy workloads - LSM-trees specifically designed for this.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Metrics ingestion system with 100k writes/sec. B-tree (PostgreSQL): Need 10 servers
            ($3,000/mo) to handle load, consistent 2ms reads. LSM-tree (Cassandra): Need 1 server ($300/mo), handles 100k writes/sec
            easily, 1ms p50 reads but 50ms p99. Savings: $2,700/mo = $32k/year. Trade-off: Accept higher p99 latency for 10× cost
            reduction. For write-heavy workloads, LSM-trees are economically superior despite compaction overhead.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'data-warehousing',
      type: 'concept',
      title: 'Data Warehousing - Columnar Storage',
      content: (
        <Section>
          <H1>Data Warehousing - Columnar Storage</H1>
          <P>
            <Strong>Data warehouses</Strong> (OLAP - Online Analytical Processing) use <Strong>columnar storage</Strong>
            instead of row-oriented storage. Optimized for analytical queries that scan many rows but few columns.
          </P>

          <H2>Row-Oriented vs. Column-Oriented</H2>
          <ComparisonTable
            headers={['Aspect', 'Row-Oriented (OLTP)', 'Column-Oriented (OLAP)']}
            rows={[
              ['Storage', 'Store entire rows together', 'Store each column separately'],
              ['Query Type', 'Point queries, updates', 'Analytical queries, aggregations'],
              ['Compression', 'Less compressible', 'Highly compressible (similar values)'],
              ['Example', 'PostgreSQL, MySQL', 'Redshift, BigQuery, Snowflake'],
            ]}
          />

          <Example title="Columnar Storage">
            <CodeBlock>
{`// Row-oriented (OLTP)
Row 1: [id: 1, name: "Alice", age: 30, city: "NYC"]
Row 2: [id: 2, name: "Bob", age: 25, city: "SF"]
Row 3: [id: 3, name: "Charlie", age: 35, city: "NYC"]

// Column-oriented (OLAP)
id column:    [1, 2, 3]
name column:  ["Alice", "Bob", "Charlie"]
age column:   [30, 25, 35]
city column:  ["NYC", "SF", "NYC"]

// Query: SELECT AVG(age) WHERE city = "NYC"
// Only need to read age and city columns!`}
            </CodeBlock>
          </Example>

          <H2>Materialized Views</H2>
          <P>
            Pre-computed query results stored as tables. Updated periodically (batch) or incrementally (stream).
            Trade-off: storage space vs. query speed.
          </P>

          <KeyPoint>
            <Strong>Use When:</Strong> Analytics, reporting, data science. Not for transactional workloads.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'oltp-vs-olap-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: OLTP vs OLAP Storage',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: OLTP vs OLAP Storage</H1>
          <P>
            <Strong>The Decision:</Strong> Row-oriented storage (OLTP) excels at transactional queries but wastes I/O
            on analytical queries. Column-oriented storage (OLAP) compresses 10-100× better and scans 100× faster for
            analytics but is terrible for point queries. Wrong choice: either slow analytics killing dashboards or slow
            transactions degrading user experience.
          </P>

          <ComparisonTable
            headers={['Factor', 'Row-Oriented (PostgreSQL)', 'Columnar (Redshift)', 'Hybrid (PostgreSQL + Redshift)', 'Real-Time OLAP (ClickHouse)']}
            rows={[
              ['Point Query (1 row)', '0.5ms', '50ms (full column scan)', '0.5ms (OLTP)', '5ms'],
              ['Analytical Query (1M rows)', '5000ms (scan all columns)', '50ms (scan 2 columns)', '50ms (OLAP)', '100ms'],
              ['Compression Ratio', '2× (row-level)', '10-100× (column-level)', '10-100× (OLAP)', '10-50×'],
              ['Storage Cost', '$300/mo (1TB)', '$100/mo (100GB compressed)', '$400/mo (both)', '$200/mo'],
              ['Insert Throughput', '10k rows/sec', '1k rows/sec (batch only)', '10k rows/sec (OLTP)', '100k rows/sec'],
              ['Update Support', 'Excellent (ACID)', 'Poor (batch only)', 'OLTP only', 'Limited (delete+insert)'],
              ['Best For', 'Transactions, point queries', 'Analytics, reporting', 'Both (separate DBs)', 'Real-time analytics'],
            ]}
          />

          <Divider />

          <H2>Real Decision: E-commerce Analytics</H2>
          <Example title="OLTP vs OLAP - Transaction Speed vs Analytics Performance">
            <CodeBlock>
{`Scenario: E-commerce with orders, users, products
Data: 100M orders, 10M users, 1M products
Queries: 10k transactional/sec (orders, users), 100 analytical/day (reports)

---

Approach 1: Row-Oriented (PostgreSQL for Everything)

Schema:
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL,
  created_at TIMESTAMP
);

Transactional Query (good):
SELECT * FROM orders WHERE id = 12345;
Performance: 0.5ms (indexed lookup) ✅

Analytical Query (bad):
SELECT
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) as order_count,
  SUM(price * quantity) as revenue
FROM orders
WHERE created_at >= '2024-01-01'
GROUP BY day;

Performance: 5000ms (scan 100M rows × 6 columns) ❌
- Read: 100M rows × 50 bytes/row = 5GB
- Process: All 6 columns even though only need 3
- Compression: Minimal (2× row-level)

Problem: Analytics queries slow down entire database
- CPU: 80% during analytical query
- Locks: Long-running query blocks table
- Users: Transactional queries slow down (2ms → 10ms)

Decision: ❌ Don't use OLTP database for analytics

---

Approach 2: Columnar (Amazon Redshift for Everything)

Schema:
CREATE TABLE orders (
  id BIGINT,
  user_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL,
  created_at TIMESTAMP
)
DISTSTYLE KEY
DISTKEY (user_id)
SORTKEY (created_at);

Analytical Query (good):
SELECT
  DATE_TRUNC('day', created_at) as day,
  SUM(price * quantity) as revenue
FROM orders
WHERE created_at >= '2024-01-01'
GROUP BY day;

Performance: 50ms (column scan, only read price, quantity, created_at) ✅
- Read: 100M rows × 3 columns × 0.1 bytes (compressed) = 30MB
- Compression: 100× (similar values in columns)
- Result: 100× faster than PostgreSQL

Transactional Query (bad):
SELECT * FROM orders WHERE id = 12345;
Performance: 50ms (scan entire column to find 1 row) ❌

Problem: Point queries unacceptably slow
- Must scan all rows in id column to find match
- No efficient row-level indexing
- Compression/decompression overhead

Decision: ❌ Don't use OLAP database for transactions

---

Approach 3: Hybrid (PostgreSQL + Redshift via ETL)

Architecture:
1. OLTP: PostgreSQL (transactional queries)
2. ETL: Daily batch sync to Redshift
3. OLAP: Redshift (analytical queries)

PostgreSQL (transactions):
- Orders, users, products (normalized)
- Handles: Inserts, updates, point queries
- Load: 10k writes/sec, 50k reads/sec

ETL Pipeline (nightly):
- Extract: Replicate data from PostgreSQL
- Transform: Denormalize, aggregate
- Load: Bulk load into Redshift
- Time: 2 hours for 100M orders
- Freshness: 1 day stale

Redshift (analytics):
- Denormalized wide tables
- Handles: Aggregations, reports, dashboards
- Load: 100 queries/day (each 50ms)

Performance:
- Transactional: 0.5ms (PostgreSQL) ✅
- Analytical: 50ms (Redshift) ✅
- Data freshness: 1 day lag ⚠️

Cost:
- PostgreSQL: $600/mo (r5.2xlarge)
- Redshift: $200/mo (dc2.large, compressed)
- ETL: $100/mo (Airflow + workers)
- Total: $900/mo

Decision: ✅ BEST for batch analytics (1-day stale OK)

---

Approach 4: Real-Time OLAP (ClickHouse)

Architecture: Single database for OLTP + OLAP

ClickHouse (specialized for both):
- MergeTree engine (hybrid LSM + columnar)
- Real-time inserts + fast analytics

Schema:
CREATE TABLE orders (
  id UInt64,
  user_id UInt32,
  product_id UInt32,
  quantity UInt16,
  price Decimal(10,2),
  created_at DateTime
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (user_id, created_at);

Transactional Query:
SELECT * FROM orders WHERE id = 12345;
Performance: 5ms (not optimized, but acceptable) ⚠️

Analytical Query:
SELECT
  toDate(created_at) as day,
  SUM(price * quantity) as revenue
FROM orders
WHERE created_at >= '2024-01-01'
GROUP BY day;
Performance: 100ms (real-time columnar scan) ✅

Insert Throughput:
- 100k rows/sec (batched inserts)
- Async inserts (parts merged in background)

Compression:
- 10-50× (columnar + codec)
- 5GB raw → 100MB compressed

Cost: $400/mo (2× servers for HA)

Decision: ✅ BEST for real-time analytics (sub-second freshness)
         ⚠️ Point queries slower than PostgreSQL

---

Columnar Compression Example:

Row-oriented (5GB uncompressed):
Row 1: [id: 1, status: "shipped", city: "NYC"]
Row 2: [id: 2, status: "shipped", city: "NYC"]
Row 3: [id: 3, status: "pending", city: "SF"]
...

Columnar (100MB compressed):
id:     [1, 2, 3, ...] → Delta encoding (2 bytes per ID)
status: ["shipped", "shipped", "pending", ...]
        → Dictionary encoding (1 byte per value)
        → shipped=1, pending=2
        → [1, 1, 2, ...] (3 bits per value with run-length encoding)
city:   ["NYC", "NYC", "SF", ...]
        → Dictionary + run-length
        → NYC=1, SF=2 → [1(×2), 2(×1), ...]

Result: 5GB → 100MB (50× compression)

---

Decision Matrix:

Use Case: Transactional app (orders, users)
Queries: Point queries (> 10k QPS)
→ Use Row-Oriented (PostgreSQL, MySQL)

Use Case: Analytics dashboard (reports, BI)
Queries: Aggregations over millions of rows
→ Use Columnar (Redshift, BigQuery, Snowflake)

Use Case: Both transactional + analytics
Freshness: 1-day stale OK
→ Use Hybrid (PostgreSQL + Redshift with ETL)

Use Case: Both transactional + analytics
Freshness: Real-time (< 1 minute)
→ Use Real-Time OLAP (ClickHouse, Druid)

Use Case: Time-series metrics
→ Use Specialized (TimescaleDB, InfluxDB)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# OLTP vs OLAP Decision Tree

query_type = analyze_query_patterns()
data_freshness = get_freshness_requirement()
query_volume = measure_qps()

if (query_type == "transactional" && point_queries):
    # Orders, users, inventory
    return "Row-Oriented OLTP (PostgreSQL, MySQL)"

elif (query_type == "analytical" && batch_ok):
    # Dashboards, reports (1-day stale OK)
    return "Hybrid: OLTP + OLAP with ETL"
    # PostgreSQL → Redshift (nightly)

elif (query_type == "analytical" && real_time_required):
    # Real-time dashboards, monitoring
    if (query_volume < 1000_QPS):
        return "Real-Time OLAP (ClickHouse, Druid)"
    else:
        return "Stream Processing + OLAP (Kafka + ClickHouse)"

elif (query_type == "mixed"):
    # Both transactional and analytical
    if (analytical_qps < 100):
        return "OLTP with read replicas for analytics"
    else:
        return "Hybrid: OLTP + OLAP"

else:
    return "Row-Oriented OLTP"  # Safe default

# Cost optimization:
if (analytical_queries_rare && data_large):
    # Run analytics on OLTP DB directly (acceptable for rare queries)
    return "PostgreSQL only"
    # Save $200-500/mo on Redshift`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Running analytics on production OLTP database</Strong>
            <P>
              Example: E-commerce runs daily revenue report on PostgreSQL production DB → query scans 100M orders (5GB) →
              locks table for 5 seconds → all customer checkouts fail → $50k revenue loss in 5 seconds. Analytical queries
              starve transactional queries.
            </P>
            <P>
              <Strong>Fix:</Strong> Never run heavy analytics on production OLTP DB. Use read replica for analytics (lag
              acceptable). Or: ETL to separate OLAP DB (Redshift, BigQuery). Or: Use real-time OLAP (ClickHouse) as separate
              service. Set <Code>statement_timeout = 1000ms</Code> on production to prevent long-running queries. Monitor slow
              query log, kill queries {'>'} 1 second.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using columnar storage for transactional workload</Strong>
            <P>
              Example: E-commerce uses Redshift as primary database → customer places order → INSERT takes 500ms (batch
              mode) → user sees "slow checkout" → abandons cart. Columnar databases optimize for batch inserts, terrible
              for individual transactions.
            </P>
            <P>
              <Strong>Fix:</Strong> Use row-oriented DB (PostgreSQL, MySQL) for transactional workloads. Columnar databases
              are OLAP-only (analytics, not transactions). If need both: Use hybrid approach (PostgreSQL for transactions,
              Redshift for analytics). Or: Real-time OLAP (ClickHouse) but accept slower point queries (5ms vs 0.5ms).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Over-paying for OLAP when OLTP read replica suffices</Strong>
            <P>
              Example: Startup with 10 analytical queries/day pays $500/mo for Redshift cluster when read replica would
              suffice. Analytical queries run in 5 seconds on replica (acceptable for rare queries) vs 50ms on Redshift.
              Wasted: $6k/year for 45× faster queries that run 10×/day.
            </P>
            <P>
              <Strong>Fix:</Strong> Start with read replica for analytics. Upgrade to OLAP when: (1) Analytical queries {'>'} 100/day,
              (2) Query time {'>'} 10 seconds unacceptable, (3) Analytics impact production (CPU, locks). Cost analysis: Redshift
              saves query time but costs $500/mo. If analytics rare, replica ($100/mo) is sufficient. OLAP justified when
              analytics frequent or impact production.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce with 100M orders. Analytical query on PostgreSQL: 5000ms (scan 5GB).
            Same query on Redshift: 50ms (scan 30MB compressed). Speed improvement: 100×. Cost: +$200/mo for Redshift. Benefit:
            Faster dashboard loads (5s → 50ms) improve analyst productivity 20% = $50k/year value. ROI: 208× ($50k / $2.4k).
            Plus: Remove analytics load from production DB prevents slowdowns. Columnar storage is economically justified for
            analytics workloads.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};
