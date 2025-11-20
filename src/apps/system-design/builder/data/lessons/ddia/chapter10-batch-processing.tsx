import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter10BatchProcessingLesson: SystemDesignLesson = {
  id: 'ddia-ch10-batch-processing',
  slug: 'ddia-ch10-batch-processing',
  title: 'Batch Processing (DDIA Ch. 10)',
  description: 'Learn MapReduce, Spark, and batch processing patterns for large-scale data processing. Includes critical trade-offs: MapReduce vs Spark, join strategies, and resource optimization with real-world examples and ROI analysis.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 85,
  stages: [
    {
      id: 'intro-batch',
      type: 'concept',
      title: 'Batch Processing Overview',
      content: (
        <Section>
          <H1>Batch Processing Overview</H1>
          <P>
            <Strong>Batch processing</Strong> processes large volumes of data in batches (not real-time).
            Optimized for throughput over latency.
          </P>
          <UL>
            <LI><Strong>MapReduce:</Strong> Google's original batch processing framework</LI>
            <LI><Strong>Spark:</Strong> In-memory batch processing (faster than MapReduce)</LI>
            <LI><Strong>Use Cases:</Strong> ETL pipelines, analytics, data warehousing, report generation</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'mapreduce',
      type: 'concept',
      title: 'MapReduce - The Foundation',
      content: (
        <Section>
          <H1>MapReduce - The Foundation</H1>
          <P>
            <Strong>MapReduce</Strong> is a programming model for processing large datasets across clusters.
            Two phases: <Strong>Map</Strong> (transform) and <Strong>Reduce</Strong> (aggregate).
          </P>

          <H2>Map Phase</H2>
          <UL>
            <LI>Process each input record independently</LI>
            <LI>Emit key-value pairs</LI>
            <LI>Runs in parallel across cluster</LI>
          </UL>

          <H2>Shuffle Phase</H2>
          <UL>
            <LI>Group values by key</LI>
            <LI>Distribute to reducers</LI>
            <LI>Network-intensive (data movement)</LI>
          </UL>

          <H2>Reduce Phase</H2>
          <UL>
            <LI>Process all values for a key</LI>
            <LI>Aggregate, filter, or transform</LI>
            <LI>Runs in parallel across cluster</LI>
          </UL>

          <Example title="Word Count in MapReduce">
            <CodeBlock>
{`// Input: ["hello world", "hello mapreduce"]

// Map phase (parallel)
map("hello world") -> [("hello", 1), ("world", 1)]
map("hello mapreduce") -> [("hello", 1), ("mapreduce", 1)]

// Shuffle: Group by key
"hello" -> [1, 1]
"world" -> [1]
"mapreduce" -> [1]

// Reduce phase (parallel)
reduce("hello", [1, 1]) -> 2
reduce("world", [1]) -> 1
reduce("mapreduce", [1]) -> 1

// Output: [("hello", 2), ("world", 1), ("mapreduce", 1)]`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Limitation:</Strong> MapReduce writes to disk between stages (slow). Spark keeps data in memory (faster).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'spark',
      type: 'concept',
      title: 'Apache Spark - In-Memory Processing',
      content: (
        <Section>
          <H1>Apache Spark - In-Memory Processing</H1>
          <P>
            <Strong>Apache Spark</Strong> is a distributed computing framework that keeps data in memory,
            making it 10-100x faster than MapReduce for iterative algorithms.
          </P>

          <H2>Key Concepts</H2>
          <UL>
            <LI><Strong>RDDs (Resilient Distributed Datasets):</Strong> Immutable distributed collections</LI>
            <LI><Strong>DAG (Directed Acyclic Graph):</Strong> Execution plan (lazy evaluation)</LI>
            <LI><Strong>Transformations:</Strong> map, filter, join (lazy - don't execute until action)</LI>
            <LI><Strong>Actions:</Strong> count, collect, save (trigger execution)</LI>
          </UL>

          <H2>Lazy Evaluation</H2>
          <P>
            Spark builds a DAG of transformations but doesn't execute until an action is called.
            This allows optimization (e.g., predicate pushdown, join reordering).
          </P>

          <Example title="Spark Word Count">
            <CodeBlock>
{`// Lazy evaluation - no computation yet
val lines = spark.read.textFile("input.txt")
val words = lines.flatMap(_.split(" "))
val wordCounts = words.groupBy(identity).count()

// Action triggers execution
wordCounts.collect()  // Now Spark executes the DAG

// Spark optimizes:
// - Combines multiple operations
// - Pushes filters down
// - Optimizes joins`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Use Spark:</Strong> When you need faster batch processing, iterative algorithms (ML), or real-time analytics.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'mapreduce-vs-spark-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: MapReduce vs Spark',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: MapReduce vs Spark for Batch Processing</H1>
          <P>
            Choosing between <Strong>MapReduce (disk-based)</Strong> and <Strong>Spark (in-memory)</Strong>
            impacts your processing speed, infrastructure costs, and operational complexity.
          </P>

          <H2>📊 MapReduce vs Spark Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'MapReduce (Hadoop)', 'Spark (In-Memory)', 'Spark (Disk Spill)']}
            rows={[
              ['Processing Speed', '1× baseline (100 min)', '10-100× faster (1-10 min)', '2-5× faster (20-50 min)'],
              ['Memory Requirements', '2GB/node (minimal)', '32-64GB/node (high)', '8-16GB/node (moderate)'],
              ['Disk I/O', 'Heavy (writes every stage)', 'Minimal (only final output)', 'Moderate (spills when low RAM)'],
              ['Fault Tolerance', 'Recompute from disk', 'Recompute lineage (RDD)', 'Slower recovery (reconstruct)'],
              ['Data Size Limit', 'Unlimited (disk-based)', '10× RAM (optimal)', '100× RAM (with spill)'],
              ['Cost per TB Processed', '$5 (disk cheap, slow)', '$50 (RAM expensive, fast)', '$15 (balanced)'],
              ['Best For', 'Massive datasets (PB scale)', 'Iterative ML, analytics', 'Large datasets (100TB-1PB)'],
              ['Operational Complexity', 'Low (mature, stable)', 'High (tuning, OOM errors)', 'Medium (spill tuning)'],
            ]}
          />

          <H2>💡 Real-World Example: ETL Pipeline for Analytics</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> E-commerce company processes 10TB/day of event logs (clickstream, orders, pageviews)
              for analytics dashboard. SLA: Complete processing within 4 hours overnight.
            </P>

            <H3>Option 1: Hadoop MapReduce</H3>
            <UL>
              <LI><Strong>Cluster:</Strong> 50 nodes × 8 cores × 16GB RAM = $30k/year (spot instances)</LI>
              <LI><Strong>Processing Time:</Strong> 6 hours (1.67 TB/hour) - misses 4-hour SLA</LI>
              <LI><Strong>Disk I/O:</Strong> 5 stages × 10TB = 50TB written to disk per job</LI>
              <LI><Strong>Network Transfer:</Strong> 30TB shuffle (intermediate data) = $2,700/month bandwidth</LI>
              <LI><Strong>Reliability:</Strong> 99% success rate (failures rare, auto-retry from disk)</LI>
              <LI><Strong>Operational Cost:</Strong> $10k/year (minimal tuning, mature ecosystem)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $30k infra + $32.4k bandwidth + $10k ops = $72.4k</LI>
              <LI><Strong>Problem:</Strong> Misses SLA, need to scale to 100 nodes (+$30k) = $102.4k total</LI>
            </UL>

            <H3>Option 2: Spark with In-Memory Processing</H3>
            <UL>
              <LI><Strong>Cluster:</Strong> 25 nodes × 16 cores × 128GB RAM = $150k/year (on-demand r5.4xlarge)</LI>
              <LI><Strong>Processing Time:</Strong> 45 minutes (13.3 TB/hour) - exceeds SLA ✓</LI>
              <LI><Strong>Memory Usage:</Strong> 10TB dataset fits in 3.2TB RAM (128GB × 25 nodes = 3.2TB)</LI>
              <LI><Strong>Disk I/O:</Strong> Minimal (only final output) = 10TB written</LI>
              <LI><Strong>Network Transfer:</Strong> 5TB shuffle (in-memory) = $450/month bandwidth</LI>
              <LI><Strong>Reliability:</Strong> 90% success rate (OOM errors during spikes)</LI>
              <LI><Strong>Operational Cost:</Strong> $50k/year (Spark tuning, OOM debugging, GC optimization)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $150k infra + $5.4k bandwidth + $50k ops = $205.4k</LI>
            </UL>

            <H3>Option 3: Spark with Disk Spill (Hybrid)</H3>
            <UL>
              <LI><Strong>Cluster:</Strong> 30 nodes × 16 cores × 32GB RAM = $60k/year (m5.4xlarge)</LI>
              <LI><Strong>Processing Time:</Strong> 2 hours (5 TB/hour) - meets SLA ✓</LI>
              <LI><Strong>Memory Usage:</Strong> 960GB RAM total, spills 80% to disk when needed</LI>
              <LI><Strong>Disk I/O:</Strong> 8TB spilled to disk (when memory full) + 10TB output = 18TB</LI>
              <LI><Strong>Network Transfer:</Strong> 10TB shuffle = $900/month bandwidth</LI>
              <LI><Strong>Reliability:</Strong> 95% success rate (occasional spill delays)</LI>
              <LI><Strong>Operational Cost:</Strong> $25k/year (moderate tuning, spill monitoring)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $60k infra + $10.8k bandwidth + $25k ops = $95.8k</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <ComparisonTable
              headers={['Approach', 'Annual Cost', 'Processing Time', 'Meets SLA?', 'Best For']}
              rows={[
                ['MapReduce (scaled)', '$102.4k', '4 hours', 'Barely', 'Cost-sensitive, non-critical'],
                ['Spark In-Memory', '$205.4k', '45 minutes ✓', 'Yes, 5× headroom', 'Iterative ML, low latency'],
                ['Spark Disk Spill', '$95.8k ✓', '2 hours ✓', 'Yes, 2× headroom', 'Balanced cost/performance'],
              ]}
            />

            <P><Strong>Result:</Strong> Spark with disk spill saves $109.6k vs in-memory, $6.6k vs MapReduce,
            while meeting SLA with 2× safety margin.</P>
          </InfoBox>

          <H2>🔧 Decision Framework with Configuration</H2>
          <CodeBlock>
{`// ===== MapReduce (Hadoop) Configuration =====
// Use when: Processing 100TB-10PB, cost critical, no SLA constraints

// Hadoop MapReduce word count
public class WordCount {
  public static class TokenizerMapper
       extends Mapper<Object, Text, Text, IntWritable> {

    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();

    public void map(Object key, Text value, Context context) {
      StringTokenizer itr = new StringTokenizer(value.toString());
      while (itr.hasMoreTokens()) {
        word.set(itr.nextToken());
        context.write(word, one);  // Writes to disk after map
      }
    }
  }

  public static class IntSumReducer
       extends Reducer<Text, IntWritable, Text, IntWritable> {

    public void reduce(Text key, Iterable<IntWritable> values, Context context) {
      // Reads from disk, writes to disk
      int sum = 0;
      for (IntWritable val : values) {
        sum += val.get();
      }
      context.write(key, new IntWritable(sum));
    }
  }
}

// Configuration
Configuration conf = new Configuration();
conf.set("mapreduce.map.memory.mb", "2048");
conf.set("mapreduce.reduce.memory.mb", "2048");
conf.set("mapreduce.job.reduces", "50");

// Result: Slow but reliable, handles unlimited data size
// Cost: $5/TB, Processing: 1.67 TB/hour (50 nodes)

// ===== Spark In-Memory Configuration =====
// Use when: <10TB data, iterative algorithms, low latency required

val spark = SparkSession.builder()
  .appName("WordCount")
  .config("spark.executor.memory", "64g")       // High RAM per executor
  .config("spark.executor.cores", "8")
  .config("spark.memory.fraction", "0.8")        // 80% for execution/storage
  .config("spark.memory.storageFraction", "0.3") // 30% for caching
  .getOrCreate()

// Word count in Spark (in-memory)
val lines = spark.read.textFile("hdfs://input")
  .cache()  // Keep in memory for reuse

val wordCounts = lines
  .flatMap(_.split(" "))
  .groupByKey(identity)  // All in memory, no disk I/O
  .count()
  .collect()

// Result: 10-100× faster, but expensive RAM
// Cost: $50/TB, Processing: 13.3 TB/hour (25 nodes × 128GB)

// ===== Spark with Disk Spill (Hybrid) =====
// Use when: 10-100TB data, need performance but cost-conscious

val spark = SparkSession.builder()
  .appName("WordCount")
  .config("spark.executor.memory", "16g")        // Moderate RAM
  .config("spark.executor.cores", "8")
  .config("spark.memory.fraction", "0.7")        // 70% for execution/storage
  .config("spark.memory.storageFraction", "0.5") // 50% for caching
  .config("spark.shuffle.spill.compress", "true") // Compress spills
  .config("spark.shuffle.compress", "true")
  .config("spark.io.compression.codec", "snappy") // Fast compression
  .getOrCreate()

// Word count with spill tolerance
val lines = spark.read.textFile("hdfs://input")
  // Don't cache - let Spark spill to disk when needed

val wordCounts = lines
  .flatMap(_.split(" "))
  .repartition(200)  // More partitions = smaller in-memory chunks
  .groupByKey(identity)  // Spills to disk if memory full
  .count()
  .collect()

// Monitoring spill
spark.sparkContext.statusTracker.getExecutorInfos.foreach { executor =>
  println(s"Spill: \${executor.memoryUsed} / \${executor.totalMemory}")
}

// Result: 2-5× faster than MapReduce, 1/3 cost of full in-memory
// Cost: $15/TB, Processing: 5 TB/hour (30 nodes × 32GB)
// Spills 80% to disk when needed, automatic and transparent`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Using Spark in-memory for 100TB+ datasets', 'Requires 1,000+ nodes, $1M+ infrastructure cost', 'Use Spark with disk spill or MapReduce for massive datasets'],
              ['Not configuring spill properly', 'OOM errors crash jobs (50% failure rate)', 'Set spark.memory.fraction=0.7, enable compression, increase partitions'],
              ['Caching entire dataset in Spark', 'Eviction churn, worse performance than no caching', 'Only cache small, reused datasets (<10% of RAM)'],
              ['Using MapReduce for iterative ML', '10× slower due to disk I/O between iterations', 'Always use Spark for iterative algorithms (gradient descent, etc.)'],
              ['Running Spark on under-provisioned RAM', 'Constant spilling, 50% slower than MapReduce', 'Provision 2-3× RAM of working set size'],
              ['Not monitoring shuffle spill', 'Silent performance degradation (10× slowdown)', 'Alert on spill >20% of shuffle size'],
            ]}
          />

          <H2>📋 Selection Guide</H2>
          <P><Strong>Choose MapReduce when:</Strong></P>
          <UL>
            <LI>✓ Processing 100TB-10PB datasets (too large for Spark)</LI>
            <LI>✓ Cost critical (&lt;$10/TB budget)</LI>
            <LI>✓ No strict SLA (overnight batch jobs acceptable)</LI>
            <LI>✓ Simple map-reduce logic (no iterations)</LI>
            <LI>✓ Mature, stable infrastructure preferred</LI>
          </UL>

          <P><Strong>Choose Spark In-Memory when:</Strong></P>
          <UL>
            <LI>✓ Dataset &lt;10TB (fits in cluster RAM)</LI>
            <LI>✓ Iterative algorithms (ML training, graph processing)</LI>
            <LI>✓ Strict SLA (minutes, not hours)</LI>
            <LI>✓ Interactive analytics (users waiting)</LI>
            <LI>✓ Budget allows $50-100/TB</LI>
          </UL>

          <P><Strong>Choose Spark with Disk Spill when:</Strong></P>
          <UL>
            <LI>✓ Dataset 10-100TB (moderate size)</LI>
            <LI>✓ Need 2-5× speedup over MapReduce</LI>
            <LI>✓ Moderate SLA (1-4 hours)</LI>
            <LI>✓ Budget $15-30/TB (balanced)</LI>
            <LI>✓ Some iterative logic but not extreme</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Start with Spark disk spill (best cost/performance).
            Scale down to MapReduce for 100TB+ datasets or up to Spark in-memory for &lt;10TB iterative workloads.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'join-algorithms',
      type: 'concept',
      title: 'Join Algorithms in Batch Processing',
      content: (
        <Section>
          <H1>Join Algorithms in Batch Processing</H1>
          <P>
            Joining large datasets is expensive. Different strategies for different scenarios:
          </P>

          <H2>Join Strategies</H2>
          <UL>
            <LI><Strong>Broadcast Join:</Strong> Small table broadcast to all nodes (no shuffle)</LI>
            <LI><Strong>Shuffle Hash Join:</Strong> Both tables partitioned by join key</LI>
            <LI><Strong>Sort-Merge Join:</Strong> Both tables sorted, then merged</LI>
          </UL>

          <Example title="Join Optimization">
            <CodeBlock>
{`// Small table (users) - 1MB
// Large table (orders) - 100GB

// Broadcast join (optimal)
broadcast(users).join(orders, "user_id")
// Users table sent to all nodes
// No shuffle of orders table

// Shuffle join (if users too large)
users.join(orders, "user_id")
// Both tables shuffled by user_id
// More expensive but necessary for large tables`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Broadcast small tables, partition large tables by join key.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'join-strategy-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Join Strategies in Batch Processing',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Broadcast vs Shuffle vs Sort-Merge Joins</H1>
          <P>
            Joining large datasets is the most expensive operation in batch processing. Choosing between
            <Strong>broadcast joins</Strong>, <Strong>shuffle hash joins</Strong>, and <Strong>sort-merge joins</Strong>
            determines your job's performance and cost.
          </P>

          <H2>📊 Join Strategy Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'Broadcast Join', 'Shuffle Hash Join', 'Sort-Merge Join']}
            rows={[
              ['Best For', 'Small table (<200MB)', 'Medium tables (1-100GB)', 'Large tables (>100GB)'],
              ['Network Transfer', 'Small table only (1×)', 'Both tables (2×)', 'Both tables (2×)'],
              ['Memory Requirement', 'Table fits in RAM', 'Hash table in RAM', 'Minimal (streaming)'],
              ['Preprocessing', 'None', 'None', 'Sort both tables (expensive)'],
              ['Join Time (10GB + 1TB)', '5 min ✓', '45 min', '30 min'],
              ['Join Time (100GB + 1TB)', '20 min ✓', '6 hours', '2 hours'],
              ['Join Time (500GB + 1TB)', 'OOM (fails)', '24 hours', '8 hours ✓'],
              ['Cost (10GB + 1TB)', '$5', '$50', '$30'],
              ['Cost (100GB + 1TB)', '$20', '$300', '$100'],
              ['Cost (500GB + 1TB)', 'N/A (fails)', '$1,500', '$400 ✓'],
            ]}
          />

          <H2>💡 Real-World Example: Customer Order Analytics</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> E-commerce company joins customer table (5GB, 10M records) with
              orders table (1TB, 500M records) for daily analytics. Must complete within 2-hour window.
            </P>

            <H3>Option 1: Broadcast Join (Small Dimension Table)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> Broadcast 5GB customer table to all 50 executors</LI>
              <LI><Strong>Network Transfer:</Strong> 5GB × 50 = 250GB broadcast traffic</LI>
              <LI><Strong>Shuffle:</Strong> None! Orders table stays partitioned (0 shuffle)</LI>
              <LI><Strong>Memory Per Executor:</Strong> 5GB (customer table) + 20GB (orders partition) = 25GB</LI>
              <LI><Strong>Join Time:</Strong> 15 minutes (no shuffle overhead)</LI>
              <LI><Strong>Cost:</Strong> 50 nodes × 32GB RAM × $0.10/hour × 0.25h = $40</LI>
              <LI><Strong>Success Rate:</Strong> 99% (reliable, minimal memory pressure)</LI>
              <LI><Strong>Limitation:</Strong> Customer table must fit in executor RAM (&lt;10GB typical)</LI>
            </UL>

            <H3>Option 2: Shuffle Hash Join (Medium Tables)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> Hash partition both tables by customer_id (200 partitions)</LI>
              <LI><Strong>Network Transfer:</Strong> 5GB + 1TB = 1.005TB shuffle traffic</LI>
              <LI><Strong>Shuffle Cost:</Strong> 1TB × $0.09/GB = $90 data transfer</LI>
              <LI><Strong>Memory Per Executor:</Strong> 25MB customer hash + 5GB orders partition = 5.025GB</LI>
              <LI><Strong>Hash Build Time:</Strong> 10 minutes (build hash table for customer)</LI>
              <LI><Strong>Join Time:</Strong> 40 minutes total (30 min shuffle + 10 min join)</LI>
              <LI><Strong>Cost:</Strong> 50 nodes × 8GB RAM × $0.05/hour × 0.67h + $90 shuffle = $107</LI>
              <LI><Strong>Success Rate:</Strong> 95% (hash table spillover if skewed)</LI>
            </UL>

            <H3>Option 3: Sort-Merge Join (Both Tables Large)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> Sort both tables by customer_id, merge in streaming fashion</LI>
              <LI><Strong>Network Transfer:</Strong> 5GB + 1TB = 1.005TB shuffle traffic</LI>
              <LI><Strong>Sort Time:</Strong> 30 minutes (parallel sort across 200 partitions)</LI>
              <LI><Strong>Merge Time:</Strong> 20 minutes (streaming merge, no hash table)</LI>
              <LI><Strong>Memory Per Executor:</Strong> 5GB orders partition (no hash table needed)</LI>
              <LI><Strong>Join Time:</Strong> 50 minutes total (30 min sort + 20 min merge)</LI>
              <LI><Strong>Cost:</Strong> 50 nodes × 8GB RAM × $0.05/hour × 0.83h + $90 shuffle = $118</LI>
              <LI><Strong>Success Rate:</Strong> 99% (no memory pressure, handles skew)</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <ComparisonTable
              headers={['Strategy', 'Join Time', 'Cost', 'Meets SLA?', 'Best Use Case']}
              rows={[
                ['Broadcast Join', '15 min ✓', '$40 ✓', 'Yes (8× faster)', 'Dimension table <10GB'],
                ['Shuffle Hash Join', '40 min ✓', '$107', 'Yes (3× faster)', 'Both tables fit in RAM'],
                ['Sort-Merge Join', '50 min ✓', '$118', 'Yes (2.4× faster)', 'Large tables or data skew'],
              ]}
            />

            <P><Strong>Result:</Strong> Broadcast join saves $78/day vs sort-merge (62% cost reduction),
            completes 3.3× faster. Annual savings: $28k/year by using correct join strategy.</P>

            <H3>Scaling Analysis (Customer Table Grows to 100GB)</H3>
            <UL>
              <LI><Strong>Broadcast:</Strong> Fails (100GB doesn't fit in executor RAM)</LI>
              <LI><Strong>Shuffle Hash:</Strong> 3 hours, $500 (hash table too large, spills to disk)</LI>
              <LI><Strong>Sort-Merge:</Strong> 2 hours, $200 ✓ (handles large tables efficiently)</LI>
            </UL>
          </InfoBox>

          <H2>🔧 Decision Framework with Spark Configuration</H2>
          <CodeBlock>
{`// ===== Broadcast Join Configuration =====
// Use when: One table <200MB (fits in executor RAM)

val spark = SparkSession.builder()
  .config("spark.sql.autoBroadcastJoinThreshold", "200MB")  // Auto-broadcast <200MB
  .config("spark.broadcast.compress", "true")               // Compress before broadcast
  .getOrCreate()

// Explicit broadcast (recommended for clarity)
import org.apache.spark.sql.functions.broadcast

val customers = spark.read.parquet("customers")  // 5GB
val orders = spark.read.parquet("orders")        // 1TB

val result = orders.join(
  broadcast(customers),  // Force broadcast of small table
  "customer_id"
)

// Result: No shuffle of orders table
// Network: 5GB × 50 executors = 250GB
// Time: 15 minutes (10× faster than shuffle join)

// When NOT to use: Table >200MB (executor OOM)

// ===== Shuffle Hash Join Configuration =====
// Use when: Both tables fit in memory after partitioning

val spark = SparkSession.builder()
  .config("spark.sql.join.preferSortMergeJoin", "false")  // Disable sort-merge
  .config("spark.sql.autoBroadcastJoinThreshold", "-1")   // Disable broadcast
  .config("spark.sql.shuffle.partitions", "200")          // Tune partitions
  .getOrCreate()

// Repartition by join key to optimize shuffle
val customers = spark.read.parquet("customers")
  .repartition(200, col("customer_id"))  // Pre-partition

val orders = spark.read.parquet("orders")
  .repartition(200, col("customer_id"))  // Pre-partition

val result = customers.join(orders, "customer_id")

// Spark builds hash table for smaller side (customers)
// Hash table: 5GB / 200 partitions = 25MB per partition (fits in RAM)
// Time: 40 minutes (30 min shuffle + 10 min hash join)

// When NOT to use: Hash table >1GB per partition (spills to disk, slow)

// ===== Sort-Merge Join Configuration =====
// Use when: Large tables or data skew present

val spark = SparkSession.builder()
  .config("spark.sql.join.preferSortMergeJoin", "true")   // Enable sort-merge
  .config("spark.sql.shuffle.partitions", "200")          // More partitions for parallelism
  .config("spark.sql.adaptive.enabled", "true")           // Adaptive query execution
  .config("spark.sql.adaptive.skewJoin.enabled", "true")  // Handle skewed keys
  .getOrCreate()

val customers = spark.read.parquet("customers")
val orders = spark.read.parquet("orders")

// Spark automatically sorts both tables by join key, then merges
val result = customers.join(orders, "customer_id")

// Execution plan:
// 1. Shuffle both tables by customer_id (30 min)
// 2. Sort each partition (parallel, built into shuffle)
// 3. Streaming merge (20 min, no hash table)

// Result: Handles unlimited table sizes, resilient to skew
// Time: 50 minutes total
// Memory: Minimal (streaming, no hash table)

// When to use: Default for large tables, handles skew gracefully

// ===== Adaptive Join Strategy (Recommended) =====
// Let Spark choose join strategy dynamically

val spark = SparkSession.builder()
  .config("spark.sql.adaptive.enabled", "true")                    // Enable AQE
  .config("spark.sql.adaptive.autoBroadcastJoinThreshold", "10MB") // Dynamic broadcast
  .config("spark.sql.adaptive.skewJoin.enabled", "true")           // Handle skew
  .config("spark.sql.adaptive.coalescePartitions.enabled", "true") // Reduce partitions
  .getOrCreate()

val customers = spark.read.parquet("customers")
val orders = spark.read.parquet("orders")

val result = customers.join(orders, "customer_id")

// Spark inspects data at runtime:
// - If customer table <10MB after filtering → broadcast join
// - If data skewed (90% of data in 5% of keys) → duplicate skewed partitions
// - If output has many small partitions → coalesce to reduce overhead

// Result: Optimal join strategy without manual tuning
// Recommended for production (requires Spark 3.0+)`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Broadcasting large tables (>1GB)', 'Executor OOM, job failure (100% failure rate)', 'Only broadcast tables <200MB, use shuffle join for larger'],
              ['Not setting shuffle partitions', 'Default 200 → giant partitions (10GB each) → OOM', 'Set spark.sql.shuffle.partitions = data_size_gb × 2'],
              ['Using hash join with skewed data', 'One partition gets 90% of data → 10× slower', 'Use sort-merge join with adaptive skew handling'],
              ['Shuffle both tables for small dimension', 'Shuffles 1TB unnecessarily when broadcast would work', 'Always broadcast dimension tables <200MB'],
              ['Not pre-partitioning reused tables', 'Shuffles same table 5× in multi-join query', 'Persist and pre-partition by common join key'],
              ['Ignoring join order', 'Joins in wrong order → 10× more shuffle', 'Join smallest tables first, largest last'],
            ]}
          />

          <H2>📋 Join Strategy Selection</H2>
          <P><Strong>Choose Broadcast Join when:</Strong></P>
          <UL>
            <LI>✓ One table &lt;200MB (dimension table, lookup table)</LI>
            <LI>✓ Need fastest join (5-10× faster than shuffle)</LI>
            <LI>✓ Joining with very large fact table (&gt;1TB)</LI>
            <LI>✓ Minimize cost (no shuffle = 60% cost savings)</LI>
          </UL>

          <P><Strong>Choose Shuffle Hash Join when:</Strong></P>
          <UL>
            <LI>✓ Both tables 1-100GB (medium size)</LI>
            <LI>✓ Smaller table's hash fits in executor RAM after partitioning</LI>
            <LI>✓ No data skew (keys evenly distributed)</LI>
            <LI>✓ Need faster than sort-merge (no sort overhead)</LI>
          </UL>

          <P><Strong>Choose Sort-Merge Join when:</Strong></P>
          <UL>
            <LI>✓ Both tables &gt;100GB (large tables)</LI>
            <LI>✓ Data is skewed (hot keys)</LI>
            <LI>✓ Memory constrained (hash table won't fit)</LI>
            <LI>✓ Default strategy (most reliable)</LI>
          </UL>

          <P><Strong>Enable Adaptive Query Execution (Spark 3.0+):</Strong></P>
          <UL>
            <LI>✓ Let Spark choose join strategy dynamically</LI>
            <LI>✓ Automatically handles skew and partition sizing</LI>
            <LI>✓ Recommended for all production workloads</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Broadcast small tables (&lt;200MB), use adaptive query execution for dynamic optimization,
            fall back to sort-merge join for large/skewed tables. Monitor shuffle size - if &gt;1TB,
            consider filtering before join or increasing partitions.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

