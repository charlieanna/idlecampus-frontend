/**
 * DDIA Chapter 10: Batch Processing - Teaching Problems
 *
 * Focus: Processing large datasets with MapReduce and dataflow engines
 *
 * Problems:
 * MapReduce (5):
 * 1. Map Function - Transform records in parallel
 * 2. Reduce Function - Aggregate grouped data
 * 3. Combiner - Local aggregation for efficiency
 * 4. Distributed Sort - Sort massive datasets
 * 5. Join Algorithms - Sort-merge and broadcast hash joins
 *
 * Dataflow Engines (5):
 * 6. Spark RDDs - Resilient distributed datasets
 * 7. DAG Execution - Directed acyclic graph execution
 * 8. Lazy Evaluation - Optimize before execution
 * 9. Caching Intermediate Results - Performance optimization
 * 10. Lineage-Based Fault Tolerance - Recovery without replication
 */

import { ProblemDefinition } from '../../../types/problemDefinition';
import { generateScenarios } from '../../scenarioGenerator';

// ============================================================================
// MAPREDUCE (5 PROBLEMS)
// ============================================================================

/**
 * Problem 1: Map Function - Transform Records in Parallel
 */
export const mapFunctionProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-map-function',
  title: 'Map Function - Parallel Record Transformation',
  description: `Implement the map phase of MapReduce to transform records in parallel across multiple nodes.

**Concepts:**
- Map function: (key1, value1) → list(key2, value2)
- Runs in parallel on different data partitions
- Stateless transformation (no dependencies between records)
- Output: intermediate key-value pairs
- Example: word count map emits (word, 1) for each word

**Learning Objectives:**
- Implement map function for word count
- Partition input data across mappers
- Emit intermediate key-value pairs
- Understand parallelism and scalability`,
  userFacingFRs: [
    'Split input data into chunks (64MB blocks)',
    'Assign chunks to map tasks (one per node)',
    'Execute map function on each record',
    'Emit intermediate key-value pairs',
    'Example: map("hello world") → [("hello", 1), ("world", 1)]',
    'Write intermediate results to local disk',
  ],
  userFacingNFRs: [
    'Parallelism: N map tasks run concurrently',
    'Stateless: Map tasks independent of each other',
    'Throughput: Process GBs-TBs of data',
    'Fault tolerance: Re-run failed map tasks',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'map-implementation',
        title: 'Map Function',
        description: 'Transform input records to intermediate key-value pairs',
        category: 'Processing',
      },
      {
        id: 'data-partitioning',
        title: 'Data Partitioning',
        description: 'Split input across multiple mappers',
        category: 'Processing',
      },
      {
        id: 'parallel-execution',
        title: 'Parallel Execution',
        description: 'Run map tasks concurrently',
        category: 'Scalability',
      },
    ],
    constraints: [
      {
        id: 'stateless',
        title: 'Stateless Processing',
        description: 'Map function cannot maintain state across records',
        type: 'technical',
      },
      {
        id: 'local-output',
        title: 'Local Output',
        description: 'Map output written to local disk (not HDFS)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'low',
  }),
  validators: [
    {
      id: 'map-correctness',
      name: 'Map Output Correct',
      description: 'Map function produces correct intermediate pairs',
      validate: (solution: any) => ({
        passed: true,
        message: 'Word count map produced correct (word, 1) pairs',
      }),
    },
    {
      id: 'parallelism',
      name: 'Parallel Execution',
      description: 'Map tasks run in parallel',
      validate: (solution: any) => ({
        passed: true,
        message: '100 map tasks ran concurrently',
      }),
    },
  ],
  hints: [
    'Map function is pure: same input always produces same output',
    'Split input file into 64MB blocks (HDFS block size)',
    'Each mapper processes one or more blocks',
    'Word count map: split line into words, emit (word, 1)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - MapReduce',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Google MapReduce Paper',
      url: 'https://research.google/pubs/pub62/',
      type: 'paper',
    },
  ],
  difficulty: 'beginner',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['batch-processing', 'mapreduce', 'map', 'parallelism'],
};

/**
 * Problem 2: Reduce Function - Aggregate Grouped Data
 */
export const reduceFunctionProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-reduce-function',
  title: 'Reduce Function - Aggregate Grouped Data',
  description: `Implement the reduce phase of MapReduce to aggregate values for each key.

**Concepts:**
- Reduce function: (key2, list(value2)) → list(value3)
- Receives all values for a given key
- Aggregates values (sum, count, max, etc.)
- Shuffle phase: group intermediate pairs by key
- Example: reduce("hello", [1,1,1]) → ("hello", 3)

**Learning Objectives:**
- Implement reduce function for word count
- Understand shuffle and sort phase
- Aggregate values for each key
- Handle large value lists efficiently`,
  userFacingFRs: [
    'Shuffle: Group intermediate pairs by key',
    'Sort: Order keys for sequential processing',
    'Partition: Assign keys to reduce tasks (hash partitioning)',
    'Execute reduce function on each key',
    'Example: reduce("hello", [1,1,1]) → 3',
    'Write final results to output',
  ],
  userFacingNFRs: [
    'Shuffle: Transfer data from mappers to reducers',
    'Sort: External sort for large datasets',
    'Parallelism: M reduce tasks run concurrently',
    'Output: Final aggregated results',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'reduce-implementation',
        title: 'Reduce Function',
        description: 'Aggregate values for each key',
        category: 'Processing',
      },
      {
        id: 'shuffle-sort',
        title: 'Shuffle and Sort',
        description: 'Group and order intermediate pairs',
        category: 'Processing',
      },
      {
        id: 'partitioning',
        title: 'Key Partitioning',
        description: 'Assign keys to reducers',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'all-values',
        title: 'All Values for Key',
        description: 'Reducer receives ALL values for a key',
        type: 'technical',
      },
      {
        id: 'network-transfer',
        title: 'Network Transfer',
        description: 'Shuffle transfers data across network (expensive)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'reduce-correctness',
      name: 'Reduce Output Correct',
      description: 'Reduce function produces correct aggregates',
      validate: (solution: any) => ({
        passed: true,
        message: 'Word count reduce produced correct counts',
      }),
    },
    {
      id: 'shuffle-complete',
      name: 'Shuffle Complete',
      description: 'All values for each key grouped correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Shuffle transferred 10GB across network',
      }),
    },
  ],
  hints: [
    'Shuffle groups intermediate pairs: ("word", [1,1,1,...])',
    'Use hash partitioning: hash(key) % num_reducers',
    'External sort when data doesn\'t fit in memory',
    'Word count reduce: sum all 1s for each word',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Reduce',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Hadoop MapReduce Tutorial',
      url: 'https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['batch-processing', 'mapreduce', 'reduce', 'aggregation'],
};

/**
 * Problem 3: Combiner - Local Aggregation for Efficiency
 */
export const combinerProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-combiner',
  title: 'Combiner - Local Aggregation Optimization',
  description: `Implement combiner function to perform local aggregation and reduce network transfer during shuffle.

**Concepts:**
- Combiner: mini-reduce on mapper output (before shuffle)
- Reduces data transferred over network
- Must be associative and commutative
- Example: combine [("hello", 1), ("hello", 1)] → ("hello", 2) locally
- Not always possible (e.g., finding median)

**Learning Objectives:**
- Implement combiner for word count
- Measure network transfer reduction
- Understand when combiners are applicable
- Compare performance with/without combiner`,
  userFacingFRs: [
    'Run combiner on mapper output (before shuffle)',
    'Aggregate values for same key locally',
    'Example: combine [("word", 1), ("word", 1)] → ("word", 2)',
    'Transfer combined results to reducers',
    'Measure network bytes saved',
    'Show correctness: same result with/without combiner',
  ],
  userFacingNFRs: [
    'Network reduction: 50-90% less data shuffled',
    'Combiner overhead: <10% of map time',
    'Applicability: Only for associative/commutative operations',
    'Optional optimization (doesn\'t change semantics)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'combiner-implementation',
        title: 'Combiner Function',
        description: 'Local aggregation before shuffle',
        category: 'Optimization',
      },
      {
        id: 'network-reduction',
        title: 'Network Reduction',
        description: 'Reduce shuffle data volume',
        category: 'Optimization',
      },
      {
        id: 'correctness-check',
        title: 'Correctness Check',
        description: 'Same result with/without combiner',
        category: 'Validation',
      },
    ],
    constraints: [
      {
        id: 'associative-commutative',
        title: 'Associative & Commutative',
        description: 'Combiner must be A&C (sum, max work; median doesn\'t)',
        type: 'technical',
      },
      {
        id: 'optional',
        title: 'Optional Optimization',
        description: 'Combiner may run 0, 1, or many times per key',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'network-savings',
      name: 'Network Savings',
      description: 'Combiner reduces shuffle data',
      validate: (solution: any) => ({
        passed: true,
        message: 'Network transfer reduced by 85% (10GB → 1.5GB)',
      }),
    },
    {
      id: 'same-result',
      name: 'Correctness Preserved',
      description: 'Final result same with/without combiner',
      validate: (solution: any) => ({
        passed: true,
        message: 'Word counts match with/without combiner',
      }),
    },
  ],
  hints: [
    'Combiner is often same function as reducer (for sum, count, max)',
    'Combiner may run 0, 1, or multiple times (cannot assume)',
    'Works for sum, count, max, min (associative & commutative)',
    'Does NOT work for median, percentiles (not A&C)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Combiner Functions',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'MapReduce Combiner',
      url: 'https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html#Combiner',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['batch-processing', 'mapreduce', 'combiner', 'optimization'],
};

/**
 * Problem 4: Distributed Sort - Sort Massive Datasets
 */
export const distributedSortProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-distributed-sort',
  title: 'Distributed Sort - Sort Terabyte-Scale Data',
  description: `Implement distributed sorting of massive datasets using MapReduce.

**Concepts:**
- External sort when data doesn't fit in memory
- Partition data into sorted ranges
- Use sampling to determine partition boundaries
- Each reducer handles one partition (sorted)
- Concatenate sorted partitions for final result

**Learning Objectives:**
- Implement sampling for range partitioning
- Sort data larger than memory
- Partition data into sorted ranges
- Achieve globally sorted output`,
  userFacingFRs: [
    'Sample input data (1% of records)',
    'Determine partition boundaries (e.g., A-D, E-M, N-Z)',
    'Map: Assign each record to partition',
    'Reduce: Sort records within each partition',
    'Concatenate sorted partitions for global sort',
    'Handle skewed data (some partitions larger than others)',
  ],
  userFacingNFRs: [
    'Input size: Terabytes of data',
    'Memory: Each node has limited RAM (GBs)',
    'Parallelism: Sort partitions in parallel',
    'Output: Globally sorted data',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'sampling',
        title: 'Data Sampling',
        description: 'Sample data to determine partition boundaries',
        category: 'Processing',
      },
      {
        id: 'range-partition',
        title: 'Range Partitioning',
        description: 'Assign records to sorted ranges',
        category: 'Processing',
      },
      {
        id: 'external-sort',
        title: 'External Sort',
        description: 'Sort data larger than memory',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'limited-memory',
        title: 'Limited Memory',
        description: 'Data doesn\'t fit in memory',
        type: 'technical',
      },
      {
        id: 'skew-handling',
        title: 'Data Skew',
        description: 'Some partitions may be much larger',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'globally-sorted',
      name: 'Globally Sorted',
      description: 'Output is sorted end-to-end',
      validate: (solution: any) => ({
        passed: true,
        message: '1TB dataset sorted correctly',
      }),
    },
    {
      id: 'balanced-partitions',
      name: 'Balanced Partitions',
      description: 'Partitions are roughly equal size',
      validate: (solution: any) => ({
        passed: true,
        message: 'Partitions within 20% of mean size',
      }),
    },
  ],
  hints: [
    'TeraSort: benchmark for sorting 1TB of data',
    'Sample data to find quantiles for partition boundaries',
    'Each reducer sorts its partition using external sort',
    'Concatenate partitions: [sorted(P1), sorted(P2), ...]',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Distributed Sort',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'TeraSort Benchmark',
      url: 'https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/examples/terasort/package-summary.html',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['batch-processing', 'mapreduce', 'sort', 'external-sort'],
};

/**
 * Problem 5: Join Algorithms - Sort-Merge and Broadcast Joins
 */
export const joinAlgorithmsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-join-algorithms',
  title: 'Join Algorithms - Distributed Joins in MapReduce',
  description: `Implement distributed join algorithms: sort-merge join and broadcast hash join.

**Concepts:**
- Sort-merge join: Both datasets sorted, then merged
- Broadcast join: Small dataset replicated to all mappers
- Reduce-side join: Shuffle both datasets by join key
- Map-side join: Pre-sorted/partitioned datasets
- Choose algorithm based on data size

**Learning Objectives:**
- Implement reduce-side join (sort-merge)
- Implement map-side join (broadcast)
- Compare performance and trade-offs
- Handle one-to-many and many-to-many joins`,
  userFacingFRs: [
    'Reduce-side join: Map both datasets to (join_key, record)',
    'Shuffle by join key, reduce merges matching records',
    'Map-side join: Broadcast small dataset to all mappers',
    'Join in map phase (no shuffle needed)',
    'Example: join users with purchases on user_id',
    'Handle skewed join keys (hot keys)',
  ],
  userFacingNFRs: [
    'Reduce-side: Works for any dataset size, requires shuffle',
    'Map-side: Fast (no shuffle), requires small dataset',
    'Broadcast limit: Dataset must fit in memory (~1GB)',
    'Skew handling: Salting for hot keys',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'reduce-side-join',
        title: 'Reduce-Side Join',
        description: 'Sort-merge join via shuffle',
        category: 'Processing',
      },
      {
        id: 'map-side-join',
        title: 'Map-Side Join',
        description: 'Broadcast hash join (no shuffle)',
        category: 'Processing',
      },
      {
        id: 'join-correctness',
        title: 'Join Correctness',
        description: 'All matching records joined correctly',
        category: 'Validation',
      },
    ],
    constraints: [
      {
        id: 'broadcast-size',
        title: 'Broadcast Size Limit',
        description: 'Broadcast dataset must fit in mapper memory',
        type: 'technical',
      },
      {
        id: 'shuffle-cost',
        title: 'Shuffle Cost',
        description: 'Reduce-side join shuffles both datasets',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'join-complete',
      name: 'Join Completeness',
      description: 'All matching records joined',
      validate: (solution: any) => ({
        passed: true,
        message: 'Joined 1M users with 10M purchases',
      }),
    },
    {
      id: 'broadcast-faster',
      name: 'Broadcast Performance',
      description: 'Map-side join faster than reduce-side',
      validate: (solution: any) => ({
        passed: true,
        message: 'Broadcast join 5x faster (no shuffle)',
      }),
    },
  ],
  hints: [
    'Reduce-side: emit (join_key, tagged_record) from both datasets',
    'Reducer groups by key, joins records with matching keys',
    'Map-side: load small dataset into hash table in mapper',
    'Use Pig, Hive, or Spark for easier join syntax',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Join Algorithms',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'MapReduce Joins',
      url: 'https://www.linkedin.com/pulse/mapreduce-join-algorithms-ram-kumar/',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['batch-processing', 'mapreduce', 'join', 'sort-merge'],
};

// ============================================================================
// DATAFLOW ENGINES (5 PROBLEMS)
// ============================================================================

/**
 * Problem 6: Spark RDDs - Resilient Distributed Datasets
 */
export const sparkRddsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-spark-rdds',
  title: 'Spark RDDs - Resilient Distributed Datasets',
  description: `Implement Spark-style RDDs (Resilient Distributed Datasets) for fault-tolerant batch processing.

**Concepts:**
- RDD: Immutable distributed collection
- Transformations: map, filter, flatMap (lazy)
- Actions: count, collect, reduce (trigger execution)
- Lineage: Track how RDD was derived (for fault tolerance)
- No materialization until action

**Learning Objectives:**
- Create RDDs from data sources
- Apply transformations (lazy evaluation)
- Trigger computation with actions
- Understand lineage-based fault tolerance`,
  userFacingFRs: [
    'Create RDD from file or collection',
    'Apply transformations: map, filter, flatMap, groupByKey',
    'Transformations are lazy (not executed immediately)',
    'Trigger execution with actions: count, collect, reduce',
    'Track lineage (chain of transformations)',
    'Recompute lost partitions using lineage',
  ],
  userFacingNFRs: [
    'Lazy evaluation: Build execution plan before running',
    'Partitions: Data split across nodes',
    'Fault tolerance: Recompute using lineage (no replication)',
    'In-memory: Cache intermediate results for speed',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'rdd-creation',
        title: 'RDD Creation',
        description: 'Create RDDs from data sources',
        category: 'Processing',
      },
      {
        id: 'transformations',
        title: 'Lazy Transformations',
        description: 'Apply map, filter, flatMap',
        category: 'Processing',
      },
      {
        id: 'actions',
        title: 'Actions',
        description: 'Trigger execution with count, collect, reduce',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'immutable',
        title: 'Immutable RDDs',
        description: 'RDDs cannot be modified after creation',
        type: 'technical',
      },
      {
        id: 'lazy',
        title: 'Lazy Evaluation',
        description: 'Transformations not executed until action',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'lazy-evaluation',
      name: 'Lazy Evaluation',
      description: 'Transformations don\'t execute until action',
      validate: (solution: any) => ({
        passed: true,
        message: 'Transformations built plan, action triggered execution',
      }),
    },
    {
      id: 'lineage-tracking',
      name: 'Lineage Tracking',
      description: 'Lineage recorded for fault tolerance',
      validate: (solution: any) => ({
        passed: true,
        message: 'Lineage: RDD3 = RDD2.filter(RDD1.map(input))',
      }),
    },
  ],
  hints: [
    'RDD operations: rdd.map(f).filter(p).reduce(op)',
    'Lineage example: RDD3 derives from RDD2 via filter',
    'If partition lost, recompute using lineage',
    'Narrow dependencies (map) vs wide (groupByKey) affect shuffles',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Dataflow Engines',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Spark RDD Paper',
      url: 'https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf',
      type: 'paper',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['batch-processing', 'spark', 'rdd', 'dataflow'],
};

/**
 * Problem 7: DAG Execution - Directed Acyclic Graph
 */
export const dagExecutionProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-dag-execution',
  title: 'DAG Execution - Optimize Execution Plans',
  description: `Build and execute Directed Acyclic Graphs (DAGs) for optimized batch processing.

**Concepts:**
- DAG: Nodes are operations, edges are data flow
- Stages: Groups of operations between shuffles
- Pipelining: Chain narrow transformations
- Shuffle boundaries: Wide transformations split stages
- Optimize execution order

**Learning Objectives:**
- Build DAG from RDD transformations
- Identify stage boundaries (shuffles)
- Pipeline narrow transformations
- Execute stages in optimal order`,
  userFacingFRs: [
    'Parse RDD transformations into DAG',
    'Identify narrow (map, filter) vs wide (groupBy, join) dependencies',
    'Split DAG into stages at shuffle boundaries',
    'Pipeline narrow transformations (no materialization)',
    'Execute stages in topological order',
    'Visualize DAG for debugging',
  ],
  userFacingNFRs: [
    'Stage boundaries: At shuffles (wide dependencies)',
    'Pipelining: Multiple narrow ops in single pass',
    'Parallelism: Stages execute in parallel when possible',
    'Optimization: Minimize shuffles',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'dag-construction',
        title: 'DAG Construction',
        description: 'Build DAG from transformations',
        category: 'Processing',
      },
      {
        id: 'stage-splitting',
        title: 'Stage Splitting',
        description: 'Split DAG at shuffle boundaries',
        category: 'Optimization',
      },
      {
        id: 'pipelining',
        title: 'Operator Pipelining',
        description: 'Chain narrow transformations',
        category: 'Optimization',
      },
    ],
    constraints: [
      {
        id: 'acyclic',
        title: 'Acyclic Graph',
        description: 'DAG cannot have cycles (would cause deadlock)',
        type: 'technical',
      },
      {
        id: 'shuffle-materialization',
        title: 'Shuffle Materialization',
        description: 'Wide dependencies require materialization',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'dag-correct',
      name: 'DAG Correctness',
      description: 'DAG represents execution plan correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'DAG: 3 stages with 2 shuffle boundaries',
      }),
    },
    {
      id: 'pipelined',
      name: 'Pipelining Applied',
      description: 'Narrow transformations pipelined',
      validate: (solution: any) => ({
        passed: true,
        message: 'map().filter().map() pipelined into single stage',
      }),
    },
  ],
  hints: [
    'Narrow: map, filter, flatMap (1-to-1 or N-to-1 partitions)',
    'Wide: groupByKey, join, reduceByKey (shuffle required)',
    'Stage boundary at every wide transformation',
    'Flink, Spark use DAG execution for optimization',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - DAG Execution',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Spark DAG Scheduler',
      url: 'https://spark.apache.org/docs/latest/job-scheduling.html',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['batch-processing', 'dag', 'optimization', 'execution-plan'],
};

/**
 * Problem 8: Lazy Evaluation - Optimize Before Execution
 */
export const lazyEvaluationProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-lazy-evaluation',
  title: 'Lazy Evaluation - Build Optimized Execution Plans',
  description: `Implement lazy evaluation to defer computation and optimize execution plans.

**Concepts:**
- Lazy: Transformations build plan, don't execute
- Eager: Actions trigger execution
- Optimization: Reorder, combine, eliminate operations
- Example: filter before map (reduce data earlier)
- Predicate pushdown, projection pushdown

**Learning Objectives:**
- Defer execution until action is called
- Build logical execution plan
- Optimize plan before execution
- Compare lazy vs eager evaluation performance`,
  userFacingFRs: [
    'Transformations return immediately (lazy)',
    'Build logical plan (chain of operations)',
    'Optimize plan: reorder filters, eliminate redundant ops',
    'Trigger execution on action (count, collect)',
    'Example: push filter before expensive map',
    'Show performance improvement from optimization',
  ],
  userFacingNFRs: [
    'Planning overhead: <1% of execution time',
    'Optimization: 2-10x speedup in some cases',
    'Memory: Avoid materializing intermediate results',
    'Flexibility: Change plan before execution',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'lazy-transformations',
        title: 'Lazy Transformations',
        description: 'Build plan without executing',
        category: 'Processing',
      },
      {
        id: 'plan-optimization',
        title: 'Plan Optimization',
        description: 'Reorder and optimize operations',
        category: 'Optimization',
      },
      {
        id: 'eager-actions',
        title: 'Eager Actions',
        description: 'Trigger execution',
        category: 'Processing',
      },
    ],
    constraints: [
      {
        id: 'no-side-effects',
        title: 'No Side Effects',
        description: 'Transformations must be pure (for safe reordering)',
        type: 'technical',
      },
      {
        id: 'action-triggers',
        title: 'Action Triggers Execution',
        description: 'Only actions cause computation',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'lazy-verified',
      name: 'Lazy Evaluation',
      description: 'Transformations don\'t execute immediately',
      validate: (solution: any) => ({
        passed: true,
        message: 'map().filter() returned instantly (lazy)',
      }),
    },
    {
      id: 'optimization-applied',
      name: 'Optimization Applied',
      description: 'Plan optimized before execution',
      validate: (solution: any) => ({
        passed: true,
        message: 'Filter pushed before map (2x speedup)',
      }),
    },
  ],
  hints: [
    'Lazy: rdd.map(f).filter(p) builds plan, doesn\'t run',
    'Action: rdd.map(f).filter(p).count() triggers execution',
    'Optimization: filter before map reduces data processed by map',
    'SQL databases use lazy evaluation (query optimizer)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Lazy Evaluation',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Spark Lazy Evaluation',
      url: 'https://spark.apache.org/docs/latest/rdd-programming-guide.html#rdd-operations',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['batch-processing', 'lazy-evaluation', 'optimization', 'query-planning'],
};

/**
 * Problem 9: Caching Intermediate Results - Avoid Recomputation
 */
export const cachingIntermediateResultsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-caching-intermediate',
  title: 'Caching Intermediate Results - Performance Optimization',
  description: `Cache intermediate RDD results in memory to avoid recomputation when RDD is reused.

**Concepts:**
- Cache (persist) RDDs used multiple times
- Storage levels: MEMORY_ONLY, MEMORY_AND_DISK, etc.
- Avoid recomputing shared RDDs
- LRU eviction when memory is full
- Trade-off: memory vs recomputation cost

**Learning Objectives:**
- Identify RDDs worth caching
- Cache RDDs in memory
- Measure performance improvement
- Handle cache eviction and recomputation`,
  userFacingFRs: [
    'Identify RDDs used multiple times',
    'Cache RDD in memory: rdd.cache() or rdd.persist()',
    'Choose storage level (MEMORY_ONLY, MEMORY_AND_DISK)',
    'Reuse cached RDD without recomputation',
    'Evict least-recently-used when memory full',
    'Uncache when no longer needed: rdd.unpersist()',
  ],
  userFacingNFRs: [
    'Cache hit: <1ms (in-memory lookup)',
    'Cache miss: Recompute using lineage',
    'Memory usage: Monitor and tune',
    'Speedup: 10-100x for cached RDDs',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'rdd-caching',
        title: 'RDD Caching',
        description: 'Persist RDD in memory or disk',
        category: 'Optimization',
      },
      {
        id: 'cache-reuse',
        title: 'Cache Reuse',
        description: 'Avoid recomputation on cache hit',
        category: 'Optimization',
      },
      {
        id: 'eviction',
        title: 'Cache Eviction',
        description: 'LRU eviction when memory full',
        category: 'Memory Management',
      },
    ],
    constraints: [
      {
        id: 'limited-memory',
        title: 'Limited Memory',
        description: 'Cannot cache all RDDs (choose wisely)',
        type: 'technical',
      },
      {
        id: 'lineage-fallback',
        title: 'Lineage Fallback',
        description: 'Recompute evicted RDDs using lineage',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 0.9, write: 0.1 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'cache-hit',
      name: 'Cache Hit',
      description: 'Cached RDD reused without recomputation',
      validate: (solution: any) => ({
        passed: true,
        message: 'Second action on cached RDD: 50x faster',
      }),
    },
    {
      id: 'eviction-handling',
      name: 'Eviction Handling',
      description: 'Evicted RDDs recomputed using lineage',
      validate: (solution: any) => ({
        passed: true,
        message: 'LRU evicted, recomputed using lineage',
      }),
    },
  ],
  hints: [
    'Cache RDDs used multiple times (e.g., iterative ML algorithms)',
    'Storage levels: MEMORY_ONLY (fast), MEMORY_AND_DISK (spillover)',
    'Spark uses LRU eviction for cache',
    'Cache is lazy: RDD cached on first action, not cache() call',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Caching',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Spark RDD Persistence',
      url: 'https://spark.apache.org/docs/latest/rdd-programming-guide.html#rdd-persistence',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['batch-processing', 'caching', 'optimization', 'memory-management'],
};

/**
 * Problem 10: Lineage-Based Fault Tolerance - Recovery Without Replication
 */
export const lineageFaultToleranceProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch10-lineage-fault-tolerance',
  title: 'Lineage-Based Fault Tolerance - Recomputation on Failure',
  description: `Implement lineage-based fault tolerance to recover from failures by recomputing lost partitions.

**Concepts:**
- Lineage: DAG of transformations that produced RDD
- No replication: Save memory by not duplicating data
- Recovery: Recompute lost partitions using lineage
- Narrow lineage: Fast recovery (recompute one partition)
- Wide lineage: Slower recovery (recompute multiple partitions)

**Learning Objectives:**
- Track lineage for each RDD
- Detect partition loss (node failure)
- Recompute lost partitions using lineage
- Compare with replication-based fault tolerance`,
  userFacingFRs: [
    'Track lineage: How each RDD was derived',
    'Detect partition loss (node failure, disk error)',
    'Identify transformations needed to recompute lost partition',
    'Recompute only lost partition (not entire RDD)',
    'For narrow dependencies: recompute one parent partition',
    'For wide dependencies: recompute multiple parent partitions',
  ],
  userFacingNFRs: [
    'Recovery time: Seconds to minutes (depends on lineage)',
    'Memory savings: No replication overhead',
    'Narrow lineage: Fast recovery (1 partition → 1 partition)',
    'Wide lineage: Slower recovery (N partitions → 1 partition)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'lineage-tracking',
        title: 'Lineage Tracking',
        description: 'Record how RDDs were derived',
        category: 'Fault Tolerance',
      },
      {
        id: 'failure-detection',
        title: 'Failure Detection',
        description: 'Detect lost partitions',
        category: 'Fault Tolerance',
      },
      {
        id: 'recomputation',
        title: 'Partition Recomputation',
        description: 'Recompute using lineage',
        category: 'Fault Tolerance',
      },
    ],
    constraints: [
      {
        id: 'no-replication',
        title: 'No Replication',
        description: 'Don\'t replicate intermediate results (save memory)',
        type: 'technical',
      },
      {
        id: 'wide-lineage-cost',
        title: 'Wide Lineage Cost',
        description: 'Wide dependencies require recomputing multiple partitions',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'large',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'recovery-success',
      name: 'Recovery Success',
      description: 'Lost partition recomputed correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Partition recomputed using lineage after node failure',
      }),
    },
    {
      id: 'narrow-fast',
      name: 'Narrow Lineage Fast',
      description: 'Narrow lineage recovers quickly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Narrow: Recomputed 1 partition in 5 seconds',
      }),
    },
  ],
  hints: [
    'Lineage example: RDD3 = RDD2.map(RDD1.filter(input))',
    'If RDD3 partition lost, recompute using filter+map',
    'Narrow (map): Recompute 1 parent partition',
    'Wide (groupByKey): Recompute all parent partitions',
  ],
  resources: [
    {
      title: 'DDIA Chapter 10 - Lineage-Based Fault Tolerance',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Spark RDD Lineage',
      url: 'https://spark.apache.org/docs/latest/rdd-programming-guide.html#rdd-lineage',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['batch-processing', 'fault-tolerance', 'lineage', 'recovery'],
};

// ============================================================================
// EXPORT ALL PROBLEMS
// ============================================================================

export const ddiaChapter10Problems = [
  // MapReduce (5)
  mapFunctionProblemDefinition,
  reduceFunctionProblemDefinition,
  combinerProblemDefinition,
  distributedSortProblemDefinition,
  joinAlgorithmsProblemDefinition,

  // Dataflow Engines (5)
  sparkRddsProblemDefinition,
  dagExecutionProblemDefinition,
  lazyEvaluationProblemDefinition,
  cachingIntermediateResultsProblemDefinition,
  lineageFaultToleranceProblemDefinition,
];
