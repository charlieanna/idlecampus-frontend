import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter10BatchProcessingLesson: SystemDesignLesson = {
  id: 'ddia-ch10-batch-processing',
  slug: 'ddia-ch10-batch-processing',
  title: 'Batch Processing (DDIA Ch. 10)',
  description: 'Learn MapReduce, Spark, and batch processing patterns for large-scale data processing.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 60,
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
  ],
};

