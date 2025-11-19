import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter3StorageRetrievalLesson: SystemDesignLesson = {
  id: 'ddia-ch3-storage-retrieval',
  slug: 'ddia-ch3-storage-retrieval',
  title: 'Storage & Retrieval (DDIA Ch. 3)',
  description: 'Learn how databases store and retrieve data: log-structured storage, B-trees, and data warehousing.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,
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
  ],
};

