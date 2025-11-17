import { Challenge } from '../../types/testCase';

export const batchProcessingFrameworkChallenge: Challenge = {
  id: 'batch_processing_framework',
  title: 'Batch Processing Framework (MapReduce/Spark style)',
  difficulty: 'advanced',
  description: `Design a distributed batch processing framework for large-scale data transformations.

Similar to Google MapReduce or Apache Spark, process terabytes of data across hundreds of workers.
Handle data locality, shuffle optimization, fault tolerance, and speculative execution.

Example workflow:
- Submit job: map(parse_log) → reduce(count_by_url)
- Schedule tasks across workers based on data locality
- Handle worker failures with checkpointing
- Optimize shuffle (minimize network transfer)

Key challenges:
- Task scheduling with data locality
- Shuffle phase optimization (billions of keys)
- Fault tolerance and checkpointing
- Speculative execution for stragglers`,

  requirements: {
    functional: [
      'Distributed map and reduce operations',
      'Data locality-aware scheduling',
      'Shuffle optimization (partitioning, combining)',
      'Fault tolerance with checkpoints',
      'Speculative execution for slow tasks',
    ],
    traffic: 'Process 100TB/day across 1000 workers',
    latency: 'Job latency < 1hr for 1TB dataset',
    availability: '99% uptime',
    budget: '$20,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'worker_pool',
    's3',
    'message_queue',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic MapReduce Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Execute map and reduce phases on distributed workers.',
      traffic: {
        type: 'batch',
        inputSizeGB: 100,
        workers: 10,
      },
      duration: 300, // 5 minutes
      passCriteria: {
        maxErrorRate: 0,
        jobSuccessRate: 1.0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
          { type: 'worker_pool', config: { workers: 1000 } },
          { type: 's3', config: { storageSizeGB: 100000 } },
          { type: 'kafka', config: { partitions: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'worker_pool' },
          { from: 'worker_pool', to: 's3' },
        ],
        explanation: `Architecture:
- Master schedules map/reduce tasks
- Workers process data from S3
- Shuffle via local disk + network transfer
- Checkpoints to S3 for fault tolerance`,
      },
    },

    {
      name: 'Data Locality Scheduling',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Schedule tasks on workers with data locality.',
      traffic: {
        type: 'batch',
        inputSizeGB: 500,
        workers: 50,
      },
      duration: 600,
      passCriteria: {
        maxErrorRate: 0,
        dataLocalityRate: 0.8, // 80% tasks local
      },
      hints: [
        'HDFS/S3: Track which workers have cached blocks',
        'Schedule map task on worker with input data',
        'Fall back to rack-local, then any worker',
        'Reduce network transfer by 60%',
      ],
    },

    {
      name: 'Fault Tolerance and Recovery',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Recover from worker failures using checkpoints.',
      traffic: {
        type: 'batch',
        inputSizeGB: 200,
        workers: 20,
        failureRate: 0.1, // 10% workers fail
      },
      duration: 600,
      passCriteria: {
        maxErrorRate: 0,
        jobSuccessRate: 1.0,
      },
      hints: [
        'Checkpoint map output to S3 (not just memory)',
        'Re-execute failed tasks on different workers',
        'Lineage tracking for recomputation',
        'Heartbeat to detect worker failures',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Shuffle Optimization',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Process 1TB in < 1 hour with efficient shuffle.',
      traffic: {
        type: 'batch',
        inputSizeGB: 1000,
        workers: 100,
      },
      duration: 3600, // 1 hour
      passCriteria: {
        maxErrorRate: 0,
        jobCompletionTime: 3600,
        shuffleEfficiency: 0.7, // Minimize network bytes
      },
      hints: [
        'Combiner: Pre-aggregate before shuffle',
        'Partitioning: Hash keys to reducers',
        'Compression: Snappy for shuffle data',
        'Local merge: Reduce shuffle files',
      ],
    },

    {
      name: 'Speculative Execution',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Handle stragglers with speculative execution.',
      traffic: {
        type: 'batch',
        inputSizeGB: 500,
        workers: 50,
        stragglersPercent: 0.05, // 5% slow workers
      },
      duration: 600,
      passCriteria: {
        maxErrorRate: 0,
        jobCompletionTime: 650, // Not much slower despite stragglers
      },
      hints: [
        'Detect tasks running >1.5x median time',
        'Launch backup task on different worker',
        'Use first to complete, kill other',
        'Limit speculation to avoid resource waste',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Large-Scale Processing',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Process 100TB across 1000 workers.',
      traffic: {
        type: 'batch',
        inputSizeGB: 100000,
        workers: 1000,
      },
      duration: 7200, // 2 hours
      passCriteria: {
        maxErrorRate: 0.001,
        jobSuccessRate: 0.99,
      },
      hints: [
        'Split input into 10K+ map tasks',
        'Hierarchical shuffle (reduce stragglers)',
        'Dynamic task allocation (not static)',
        'Monitor progress with UI',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Checkpoint and Recovery',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Recover from master failure using checkpoints.',
      traffic: {
        type: 'batch',
        inputSizeGB: 300,
        workers: 30,
      },
      duration: 600,
      passCriteria: {
        maxErrorRate: 0,
        recoveryTime: 60, // Recover in 60s
      },
      hints: [
        'Checkpoint job state to ZooKeeper',
        'New master reads checkpoint and resumes',
        'Workers reconnect to new master',
        'Idempotent task execution',
      ],
    },
  ],

  hints: [
    {
      category: 'Task Scheduling',
      items: [
        'Split input into fixed-size blocks (128MB)',
        'Create map task per block',
        'Schedule on worker with block cached',
        'Queue system for task distribution',
      ],
    },
    {
      category: 'Shuffle Phase',
      items: [
        'Map output: Partition by hash(key) % num_reducers',
        'Combiner: Local reduce before shuffle',
        'Sort map output by key (for reduce efficiency)',
        'Pull-based shuffle (reducers pull from mappers)',
      ],
    },
    {
      category: 'Fault Tolerance',
      items: [
        'Heartbeat every 30s to detect failures',
        'Checkpoint map output to durable storage',
        'Re-execute task on failure (lineage)',
        'Blacklist workers with repeated failures',
      ],
    },
    {
      category: 'Optimization',
      items: [
        'Compression: Snappy for speed, Gzip for ratio',
        'Combiners reduce shuffle by 50-90%',
        'Pipeline map and shuffle phases',
        'Batch small files to reduce task overhead',
      ],
    },
  ],

  learningObjectives: [
    'MapReduce programming model',
    'Data locality and task scheduling',
    'Shuffle phase optimization',
    'Fault tolerance with checkpointing',
    'Speculative execution for performance',
  ],

  realWorldExample: `**Google MapReduce:**
- GFS for distributed storage
- Master schedules ~100K tasks
- Locality scheduling (rack-aware)
- Automatic re-execution on failure

**Apache Spark:**
- RDD abstraction (resilient distributed datasets)
- In-memory caching for iterative jobs
- DAG execution engine
- 10-100x faster than MapReduce

**Apache Hadoop:**
- HDFS for data storage
- YARN for resource management
- Support for map, reduce, join operations
- Fault tolerance via replication`,

  pythonTemplate: `from typing import Callable, List, Dict
import hashlib

class BatchProcessingFramework:
    def __init__(self):
        self.master = None
        self.workers = []
        self.storage = None  # S3/HDFS

    def submit_job(self, input_path: str, map_fn: Callable,
                  reduce_fn: Callable, num_reducers: int) -> str:
        """Submit a MapReduce job."""
        # TODO: Split input into blocks
        # TODO: Create map tasks
        # TODO: Schedule tasks on workers
        # TODO: Return job ID
        pass

    def schedule_map_task(self, block_id: str) -> str:
        """Schedule map task with data locality."""
        # TODO: Find workers with block cached
        # TODO: Prefer local > rack-local > any
        # TODO: Assign task to worker
        # TODO: Return worker ID
        pass

    def execute_map(self, block_data: bytes, map_fn: Callable,
                   num_reducers: int) -> Dict:
        """Execute map function on worker."""
        # TODO: Apply map_fn to each record
        # TODO: Partition output by hash(key) % num_reducers
        # TODO: Sort by key within each partition
        # TODO: Write to local disk
        # TODO: Return partition file locations
        pass

    def shuffle(self, map_outputs: List[Dict], reducer_id: int) -> List:
        """Fetch and merge shuffle data for reducer."""
        # TODO: Pull partition files from mappers
        # TODO: Merge-sort by key
        # TODO: Group by key
        # TODO: Return sorted key-value groups
        pass

    def execute_reduce(self, key_groups: List, reduce_fn: Callable):
        """Execute reduce function on worker."""
        # TODO: For each key, apply reduce_fn to values
        # TODO: Write output to S3
        pass

    def handle_failure(self, task_id: str, worker_id: str):
        """Handle task failure."""
        # TODO: Mark worker as unhealthy
        # TODO: Re-schedule task on different worker
        # TODO: Update task status
        pass

    def speculative_execute(self, task_id: str):
        """Launch speculative task for straggler."""
        # TODO: Check if task is running >1.5x median
        # TODO: Launch backup task on different worker
        # TODO: Use first to complete
        pass

    def checkpoint_job(self, job_id: str):
        """Checkpoint job state for recovery."""
        # TODO: Save task states to ZooKeeper
        # TODO: Save shuffle metadata
        # TODO: Enable recovery from master failure
        pass

# Example usage
if __name__ == '__main__':
    framework = BatchProcessingFramework()

    # Define map and reduce functions
    def word_count_map(line):
        for word in line.split():
            yield (word, 1)

    def word_count_reduce(key, values):
        return (key, sum(values))

    # Submit job
    job_id = framework.submit_job(
        input_path='s3://data/logs/',
        map_fn=word_count_map,
        reduce_fn=word_count_reduce,
        num_reducers=10
    )`,
};
