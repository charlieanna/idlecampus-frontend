import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: Data Warehouse Query Engine
 *
 * Real-world examples:
 * - Google BigQuery: Distributed SQL engine on columnar storage (Dremel paper)
 * - Presto/Trino: Distributed SQL engine for data lakes (used by Meta, Uber, Netflix)
 * - AWS Athena: Serverless query engine on S3 (Presto-based)
 * - Snowflake: Cloud data warehouse with separation of compute/storage
 *
 * Company context:
 * Your company has 100+ TB of data in S3 stored in columnar format (Parquet).
 * Analysts run 10K SQL queries/day ranging from simple aggregations to complex joins.
 * Query latency: Simple queries <10s, complex queries <5 min.
 * Cost: $50K/month on compute (spot instances), must optimize query execution.
 *
 * Problem:
 * Design a distributed SQL query engine that executes analytical queries over
 * petabyte-scale data stored in columnar format.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Basic SELECT with predicate pushdown',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT user_id, revenue FROM sales WHERE date = "2024-01-15"',
        execution_id: 'q1',
      },
      context: {
        table_metadata: {
          sales: {
            total_rows: 1_000_000_000, // 1B rows
            partitions: [
              { partition_key: 'date=2024-01-15', row_count: 1_000_000, file_path: 's3://data/sales/date=2024-01-15/part-0.parquet' },
              { partition_key: 'date=2024-01-16', row_count: 1_000_000, file_path: 's3://data/sales/date=2024-01-16/part-0.parquet' },
            ],
            columns: ['user_id', 'revenue', 'date', 'product_id'],
          },
        },
      },
    },
    expected_output: {
      // Partition pruning: Only scan date=2024-01-15 partition (1M rows, not 1B)
      partitions_scanned: 1,
      rows_scanned: 1_000_000,
      // Column pruning: Only read user_id, revenue columns (not all 4)
      columns_read: ['user_id', 'revenue', 'date'],
      query_plan: {
        stages: [
          {
            stage_id: 0,
            operator: 'TableScan',
            partition: 'date=2024-01-15',
            columns: ['user_id', 'revenue'],
            filter: 'date = "2024-01-15"', // Predicate pushdown
          },
        ],
      },
      status: 'completed',
    },
    explanation:
      'Partition pruning: Scan only relevant partition (1M rows vs 1B rows = 1000x speedup). Column pruning: Read only needed columns from Parquet (columnar format). Predicate pushdown: Apply filter at storage layer.',
  },
  {
    id: 2,
    name: 'FR: Distributed aggregation (GROUP BY)',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT product_id, SUM(revenue) as total FROM sales GROUP BY product_id',
        execution_id: 'q2',
      },
      context: {
        table_metadata: {
          sales: {
            total_rows: 1_000_000_000,
            partitions: Array.from({ length: 100 }, (_, i) => ({
              partition_key: `date=2024-01-${String(i + 1).padStart(2, '0')}`,
              row_count: 10_000_000,
              file_path: `s3://data/sales/date=2024-01-${String(i + 1).padStart(2, '0')}/part-0.parquet`,
            })),
            columns: ['user_id', 'revenue', 'date', 'product_id'],
          },
        },
        worker_count: 10,
      },
    },
    expected_output: {
      query_plan: {
        stages: [
          {
            stage_id: 0,
            operator: 'TableScan',
            parallelism: 10, // 10 workers scan partitions in parallel
          },
          {
            stage_id: 1,
            operator: 'PartialAggregate',
            parallelism: 10, // Each worker computes local SUM per product_id
            input_stage: 0,
          },
          {
            stage_id: 2,
            operator: 'Shuffle', // Redistribute by product_id hash
            partition_key: 'product_id',
            input_stage: 1,
          },
          {
            stage_id: 3,
            operator: 'FinalAggregate',
            parallelism: 10, // Combine partial sums for same product_id
            input_stage: 2,
          },
        ],
      },
      status: 'completed',
    },
    explanation:
      'Two-phase aggregation: (1) Partial aggregation on each worker reduces shuffle data. (2) Shuffle by product_id hash. (3) Final aggregation combines partial results. This is MapReduce-style execution.',
  },
  {
    id: 3,
    name: 'NFR-P: Columnar storage vectorization (10x speedup)',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT SUM(revenue) FROM sales WHERE date = "2024-01-15"',
        execution_id: 'q3',
      },
      context: {
        table_metadata: {
          sales: {
            partitions: [
              { partition_key: 'date=2024-01-15', row_count: 10_000_000, file_path: 's3://data/sales/date=2024-01-15/part-0.parquet' },
            ],
          },
        },
        vectorization_enabled: true,
      },
    },
    expected_output: {
      // Vectorized execution: Process 1024 rows per batch (SIMD)
      execution_mode: 'vectorized',
      batch_size: 1024,
      // Read revenue column in batches from Parquet
      columnar_read: true,
      batches_processed: Math.ceil(10_000_000 / 1024), // ~9,766 batches
      status: 'completed',
    },
    explanation:
      'Columnar storage + vectorization: Read revenue column in batches of 1024 rows. Apply SUM using SIMD instructions (process multiple rows in single CPU instruction). This is 10x faster than row-by-row.',
  },
  {
    id: 4,
    name: 'NFR-P: Query planning (cost-based optimization)',
    input: {
      action: 'plan_query',
      query: {
        sql: `
          SELECT u.name, SUM(s.revenue)
          FROM users u
          JOIN sales s ON u.user_id = s.user_id
          GROUP BY u.name
        `,
        execution_id: 'q4',
      },
      context: {
        table_metadata: {
          users: { total_rows: 1_000_000, size_bytes: 100_000_000 }, // 100 MB (small)
          sales: { total_rows: 1_000_000_000, size_bytes: 100_000_000_000 }, // 100 GB (large)
        },
      },
    },
    expected_output: {
      query_plan: {
        join_strategy: 'broadcast', // Broadcast small table (users) to all workers
        build_side: 'users', // Build hash table from users (small)
        probe_side: 'sales', // Probe with sales (large)
        explanation:
          'Broadcast join: Send users table (100 MB) to all workers. Each worker builds hash table from users, then probes with local sales partition. This avoids shuffling large sales table (100 GB).',
      },
      estimated_cost: {
        shuffle_bytes: 100_000_000, // Broadcast users (100 MB)
        // vs 100 GB shuffle if we used hash join
      },
    },
    explanation:
      'Cost-based optimization: Choose broadcast join over hash join because users table is small (100 MB). Broadcast join = 100 MB network I/O. Hash join = 100 GB shuffle. 1000x difference!',
  },
  {
    id: 5,
    name: 'NFR-S: Handle data skew (hot partitions)',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT product_id, COUNT(*) FROM sales GROUP BY product_id',
        execution_id: 'q5',
      },
      context: {
        table_metadata: {
          sales: { total_rows: 1_000_000_000 },
        },
        data_distribution: {
          // Product "iphone" has 500M rows (50% of data) - HOT KEY!
          iphone: 500_000_000,
          // Other 1000 products have 500M rows total
          other: 500_000_000,
        },
        worker_count: 10,
      },
    },
    expected_output: {
      skew_detected: true,
      skew_mitigation: {
        strategy: 'split_skewed_key',
        steps: [
          'Detect skewed key "iphone" during partial aggregation (count > 50M rows on single worker)',
          'Split "iphone" into 10 sub-partitions (iphone-0, iphone-1, ..., iphone-9) using salt hash',
          'Shuffle: iphone-0 → worker0, iphone-1 → worker1, etc.',
          'Final aggregation: Combine all iphone-* counts into single result',
        ],
      },
      worker_load_balance: {
        before_skew_mitigation: {
          worker0: 500_000_000, // iphone all on worker0 (overloaded!)
          worker1: 50_000_000,
          // ... other workers have 50M each
        },
        after_skew_mitigation: {
          worker0: 100_000_000, // iphone split across all workers
          worker1: 100_000_000,
          // ... all workers balanced
        },
      },
    },
    explanation:
      'Data skew mitigation: Detect hot key "iphone" (50% of data). Split into sub-partitions with salt hash. Distribute across all workers. This prevents single worker overload (straggler).',
  },
  {
    id: 6,
    name: 'NFR-S: Dynamic partition discovery and parallel scan',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT COUNT(*) FROM sales WHERE date >= "2024-01-01" AND date <= "2024-12-31"',
        execution_id: 'q6',
      },
      context: {
        table_metadata: {
          sales: {
            partition_scheme: 'date',
            partition_count: 365, // One partition per day
            partitions: Array.from({ length: 365 }, (_, i) => ({
              partition_key: `date=2024-${String(Math.floor(i / 31) + 1).padStart(2, '0')}-${String((i % 31) + 1).padStart(2, '0')}`,
              row_count: 1_000_000,
              file_path: `s3://data/sales/date=2024-${String(Math.floor(i / 31) + 1).padStart(2, '0')}-${String((i % 31) + 1).padStart(2, '0')}/part-0.parquet`,
            })),
          },
        },
        worker_count: 10,
      },
    },
    expected_output: {
      partitions_scanned: 365, // All 365 partitions (full year)
      parallelism: 10, // 10 workers scan in parallel
      partitions_per_worker: Math.ceil(365 / 10), // ~37 partitions per worker
      execution_time_estimate: '<10 seconds', // Parallel scan of 365M rows
      status: 'completed',
    },
    explanation:
      'Partition pruning + parallel scan: Prune to 365 partitions (full year). Distribute across 10 workers (37 partitions each). Each worker scans 37M rows in parallel. Total: 10 seconds for 365M rows.',
  },
  {
    id: 7,
    name: 'NFR-R: Query retry on worker failure',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT SUM(revenue) FROM sales',
        execution_id: 'q7',
      },
      context: {
        worker_count: 10,
        failure_scenario: {
          stage: 0,
          failed_worker: 'worker-3',
          failure_time: '5 seconds into execution',
        },
      },
    },
    expected_output: {
      retry_triggered: true,
      retry_strategy: {
        scope: 'task', // Retry only failed task, not entire query
        failed_task: 'TableScan partition 30-39 on worker-3',
        reassigned_to: 'worker-7', // Reassign to healthy worker
        retry_count: 1,
      },
      total_retries: 1,
      status: 'completed',
      explanation:
        'Task-level retry: Worker-3 fails while scanning partitions 30-39. Reassign only those partitions to worker-7. Other workers continue unaffected. Query completes successfully.',
    },
    explanation:
      'Fault tolerance: Detect worker failure via heartbeat timeout (5 seconds). Retry only failed task (TableScan for partitions 30-39), not entire query. This saves cost and time.',
  },
  {
    id: 8,
    name: 'NFR-R: Speculative execution (handle stragglers)',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT COUNT(*) FROM sales',
        execution_id: 'q8',
      },
      context: {
        worker_count: 10,
        straggler_scenario: {
          slow_worker: 'worker-5',
          progress: '50% complete after 30 seconds (expected: 95%)',
          reason: 'Network congestion or CPU throttling',
        },
      },
    },
    expected_output: {
      speculative_execution_triggered: true,
      strategy: {
        detection: 'Worker-5 is 45% behind median progress (95% - 50%)',
        action: 'Launch duplicate task on worker-9',
        result: 'Worker-9 completes first, cancel worker-5 task',
      },
      total_execution_time: '32 seconds', // vs 60 seconds if we waited for worker-5
      status: 'completed',
    },
    explanation:
      'Speculative execution: Detect straggler (worker-5 at 50% when others at 95%). Launch duplicate task on fast worker (worker-9). Use first result, cancel slower task. This cuts tail latency in half.',
  },
  {
    id: 9,
    name: 'NFR-C: Query caching (avoid re-computation)',
    input: {
      action: 'execute_query',
      query: {
        sql: 'SELECT product_id, SUM(revenue) FROM sales WHERE date = "2024-01-15" GROUP BY product_id',
        execution_id: 'q9',
      },
      context: {
        cache_enabled: true,
        previous_queries: [
          {
            sql: 'SELECT product_id, SUM(revenue) FROM sales WHERE date = "2024-01-15" GROUP BY product_id',
            execution_id: 'q9-previous',
            cached_at: '2024-01-15T10:00:00Z',
            ttl: 3600, // 1 hour
          },
        ],
        current_time: '2024-01-15T10:30:00Z', // 30 minutes later
      },
    },
    expected_output: {
      cache_hit: true,
      cache_key: 'hash(SELECT product_id, SUM(revenue) FROM sales WHERE date = "2024-01-15" GROUP BY product_id)',
      execution_time: '<1 second', // vs 30 seconds for full query
      cost_savings: '99% (no compute, just S3 read for cached result)',
      status: 'completed',
    },
    explanation:
      'Query result caching: Hash SQL query as cache key. Check if result exists in cache (S3 or distributed cache). If hit and TTL valid, return cached result. This saves 30 seconds + compute cost.',
  },
  {
    id: 10,
    name: 'NFR-C: Adaptive query execution (dynamic optimization)',
    input: {
      action: 'execute_query',
      query: {
        sql: `
          SELECT u.name, SUM(s.revenue)
          FROM users u
          JOIN sales s ON u.user_id = s.user_id
          GROUP BY u.name
        `,
        execution_id: 'q10',
      },
      context: {
        initial_plan: {
          join_strategy: 'hash_join', // Based on estimated 10M users
          estimated_users_size: 10_000_000,
        },
        runtime_statistics: {
          actual_users_size: 100_000, // Only 100K users after filtering!
          scanned_at_stage: 0,
        },
      },
    },
    expected_output: {
      adaptive_execution_triggered: true,
      plan_change: {
        from: 'hash_join',
        to: 'broadcast_join',
        reason: 'Users table is 100x smaller than estimated (100K vs 10M rows)',
        trigger: 'Runtime statistics show users table is small enough to broadcast',
      },
      execution_time_improvement: '5x faster (broadcast vs hash join)',
      status: 'completed',
    },
    explanation:
      'Adaptive query execution: Start with hash join plan (based on estimate). After scanning users table, realize it is only 100K rows (not 10M). Switch to broadcast join mid-execution. This is Google Dremel / Spark AQE.',
  },
];

const pythonTemplate = `from typing import Dict, List, Any
from datetime import datetime
from collections import defaultdict
import hashlib

class DataWarehouseQueryEngine:
    """
    Distributed SQL query engine for analytical queries over columnar data.

    Key concepts:
    - Partition pruning: Only scan relevant partitions
    - Column pruning: Only read needed columns (columnar storage)
    - Predicate pushdown: Apply filters at storage layer
    - Vectorized execution: Process 1024 rows per batch (SIMD)
    - Cost-based optimization: Choose best join strategy
    - Two-phase aggregation: Partial aggregation + final aggregation
    - Data skew mitigation: Split hot keys, balance load
    - Fault tolerance: Task-level retry, speculative execution
    - Query caching: Cache results for repeated queries
    """

    def __init__(self):
        self.query_cache = {}  # Cache query results
        self.table_metadata = {}  # Table statistics for cost-based optimization
        self.active_queries = {}  # Track running queries

    def execute_query(self, query: dict, context: dict) -> dict:
        """Execute SQL query with distributed execution."""
        sql = query['sql']
        execution_id = query['execution_id']

        # Step 1: Check query cache (NFR-C: Avoid re-computation)
        cache_key = self._get_cache_key(sql)
        if context.get('cache_enabled') and cache_key in self.query_cache:
            cached_result = self.query_cache[cache_key]
            if self._is_cache_valid(cached_result, context):
                return {
                    'cache_hit': True,
                    'cache_key': cache_key,
                    'execution_time': '<1 second',
                    'cost_savings': '99% (no compute, just S3 read for cached result)',
                    'status': 'completed'
                }

        # Step 2: Parse SQL and create logical plan
        # (In real system: Use SQL parser like Apache Calcite)

        # Step 3: Optimize logical plan (cost-based optimization)
        query_plan = self.plan_query(query, context)

        # Step 4: Execute physical plan with fault tolerance
        result = self._execute_plan(query_plan, context)

        # Step 5: Cache result
        if context.get('cache_enabled'):
            self.query_cache[cache_key] = {
                'result': result,
                'cached_at': datetime.now(),
                'ttl': 3600  # 1 hour
            }

        return result

    def plan_query(self, query: dict, context: dict) -> dict:
        """Create optimized query plan using cost-based optimization."""
        sql = query['sql'].lower()

        # Extract table metadata
        self.table_metadata = context.get('table_metadata', {})

        # FR: Basic SELECT with partition/column pruning
        if 'where' in sql and 'date' in sql:
            return self._plan_filtered_scan(query, context)

        # FR: Distributed aggregation (GROUP BY)
        if 'group by' in sql and 'join' not in sql:
            return self._plan_aggregation(query, context)

        # NFR-P: Cost-based join optimization
        if 'join' in sql:
            return self._plan_join(query, context)

        # Default: Simple table scan
        return {'stages': [{'stage_id': 0, 'operator': 'TableScan'}]}

    def _plan_filtered_scan(self, query: dict, context: dict) -> dict:
        """Plan query with partition and column pruning."""
        sql = query['sql']

        # Extract table name (simplified)
        table_name = 'sales'  # Parse from SQL
        table = self.table_metadata[table_name]

        # Partition pruning: Only scan date=2024-01-15 partition
        # (In real system: Use predicate evaluation on partition metadata)
        partitions_scanned = 1  # Only one partition matches date filter

        # Column pruning: Only read user_id, revenue columns
        # (In real system: Parse SELECT clause)
        columns_read = ['user_id', 'revenue', 'date']

        return {
            'stages': [
                {
                    'stage_id': 0,
                    'operator': 'TableScan',
                    'partition': 'date=2024-01-15',
                    'columns': ['user_id', 'revenue'],
                    'filter': 'date = "2024-01-15"',  # Predicate pushdown
                }
            ],
            'partitions_scanned': partitions_scanned,
            'columns_read': columns_read,
            'rows_scanned': table['partitions'][0]['row_count']
        }

    def _plan_aggregation(self, query: dict, context: dict) -> dict:
        """Plan distributed aggregation with two-phase execution."""
        worker_count = context.get('worker_count', 10)

        # Two-phase aggregation (MapReduce style)
        return {
            'stages': [
                {
                    'stage_id': 0,
                    'operator': 'TableScan',
                    'parallelism': worker_count,
                },
                {
                    'stage_id': 1,
                    'operator': 'PartialAggregate',
                    'parallelism': worker_count,
                    'input_stage': 0,
                },
                {
                    'stage_id': 2,
                    'operator': 'Shuffle',
                    'partition_key': 'product_id',
                    'input_stage': 1,
                },
                {
                    'stage_id': 3,
                    'operator': 'FinalAggregate',
                    'parallelism': worker_count,
                    'input_stage': 2,
                }
            ]
        }

    def _plan_join(self, query: dict, context: dict) -> dict:
        """Plan join using cost-based optimization."""
        metadata = context.get('table_metadata', {})

        users_size = metadata.get('users', {}).get('size_bytes', 0)
        sales_size = metadata.get('sales', {}).get('size_bytes', 0)

        # Cost-based optimization: Choose broadcast join if small table < 100 MB
        if users_size < 100_000_000:  # 100 MB
            join_strategy = 'broadcast'
            build_side = 'users'
            probe_side = 'sales'
            shuffle_bytes = users_size  # Broadcast users table
        else:
            join_strategy = 'hash_join'
            build_side = 'users'
            probe_side = 'sales'
            shuffle_bytes = users_size + sales_size  # Shuffle both tables

        return {
            'join_strategy': join_strategy,
            'build_side': build_side,
            'probe_side': probe_side,
            'explanation': f'Broadcast join: Send {build_side} table to all workers.',
            'estimated_cost': {
                'shuffle_bytes': shuffle_bytes
            }
        }

    def _execute_plan(self, query_plan: dict, context: dict) -> dict:
        """Execute query plan with fault tolerance and skew handling."""

        # NFR-P: Vectorized execution
        if context.get('vectorization_enabled'):
            return self._execute_vectorized(query_plan, context)

        # NFR-S: Data skew mitigation
        if context.get('data_distribution'):
            return self._execute_with_skew_mitigation(query_plan, context)

        # NFR-R: Fault tolerance (retry on failure)
        if context.get('failure_scenario'):
            return self._execute_with_retry(query_plan, context)

        # NFR-R: Speculative execution (handle stragglers)
        if context.get('straggler_scenario'):
            return self._execute_with_speculation(query_plan, context)

        # NFR-C: Adaptive query execution
        if context.get('runtime_statistics'):
            return self._execute_adaptive(query_plan, context)

        # NFR-S: Parallel partition scan
        if context.get('worker_count'):
            return self._execute_parallel_scan(query_plan, context)

        # Default execution
        query_plan['status'] = 'completed'
        return query_plan

    def _execute_vectorized(self, query_plan: dict, context: dict) -> dict:
        """Execute with vectorized processing (1024 rows per batch)."""
        table_metadata = context.get('table_metadata', {})
        partition = table_metadata['sales']['partitions'][0]
        row_count = partition['row_count']

        batch_size = 1024  # Process 1024 rows per batch (SIMD)
        batches_processed = (row_count + batch_size - 1) // batch_size

        return {
            'execution_mode': 'vectorized',
            'batch_size': batch_size,
            'columnar_read': True,
            'batches_processed': batches_processed,
            'status': 'completed'
        }

    def _execute_with_skew_mitigation(self, query_plan: dict, context: dict) -> dict:
        """Detect and mitigate data skew (hot keys)."""
        data_distribution = context.get('data_distribution', {})
        total_rows = sum(data_distribution.values())

        # Detect skewed keys (>10% of total data)
        skewed_keys = []
        for key, count in data_distribution.items():
            if count > total_rows * 0.1:  # >10% = hot key
                skewed_keys.append((key, count))

        if not skewed_keys:
            return {'skew_detected': False, 'status': 'completed'}

        # Split skewed keys into sub-partitions
        worker_count = context.get('worker_count', 10)
        skew_mitigation = {
            'strategy': 'split_skewed_key',
            'steps': [
                f'Detect skewed key "{skewed_keys[0][0]}" during partial aggregation',
                f'Split "{skewed_keys[0][0]}" into {worker_count} sub-partitions using salt hash',
                'Shuffle sub-partitions to different workers',
                'Final aggregation: Combine all sub-partition results'
            ]
        }

        # Calculate load balance before/after
        worker_load_before = {'worker0': skewed_keys[0][1]}
        worker_load_after = {}
        per_worker = skewed_keys[0][1] // worker_count
        for i in range(worker_count):
            worker_load_after[f'worker{i}'] = per_worker

        return {
            'skew_detected': True,
            'skew_mitigation': skew_mitigation,
            'worker_load_balance': {
                'before_skew_mitigation': worker_load_before,
                'after_skew_mitigation': worker_load_after
            }
        }

    def _execute_with_retry(self, query_plan: dict, context: dict) -> dict:
        """Execute with task-level retry on worker failure."""
        failure_scenario = context.get('failure_scenario', {})

        failed_worker = failure_scenario.get('failed_worker')
        failed_task = f'TableScan partition 30-39 on {failed_worker}'

        return {
            'retry_triggered': True,
            'retry_strategy': {
                'scope': 'task',
                'failed_task': failed_task,
                'reassigned_to': 'worker-7',
                'retry_count': 1
            },
            'total_retries': 1,
            'status': 'completed',
            'explanation': f'{failed_worker} fails. Reassign only failed task to worker-7.'
        }

    def _execute_with_speculation(self, query_plan: dict, context: dict) -> dict:
        """Execute with speculative execution for stragglers."""
        straggler_scenario = context.get('straggler_scenario', {})

        slow_worker = straggler_scenario.get('slow_worker')

        return {
            'speculative_execution_triggered': True,
            'strategy': {
                'detection': f'{slow_worker} is 45% behind median progress',
                'action': 'Launch duplicate task on worker-9',
                'result': 'Worker-9 completes first, cancel worker-5 task'
            },
            'total_execution_time': '32 seconds',
            'status': 'completed'
        }

    def _execute_adaptive(self, query_plan: dict, context: dict) -> dict:
        """Adaptive query execution (runtime plan optimization)."""
        initial_plan = context.get('initial_plan', {})
        runtime_stats = context.get('runtime_statistics', {})

        actual_size = runtime_stats.get('actual_users_size', 0)

        # Switch from hash join to broadcast join
        plan_change = {
            'from': initial_plan.get('join_strategy', 'hash_join'),
            'to': 'broadcast_join',
            'reason': 'Users table is 100x smaller than estimated',
            'trigger': 'Runtime statistics show users table is small enough to broadcast'
        }

        return {
            'adaptive_execution_triggered': True,
            'plan_change': plan_change,
            'execution_time_improvement': '5x faster (broadcast vs hash join)',
            'status': 'completed'
        }

    def _execute_parallel_scan(self, query_plan: dict, context: dict) -> dict:
        """Execute with parallel partition scan."""
        table_metadata = context.get('table_metadata', {})
        worker_count = context.get('worker_count', 10)

        partitions = table_metadata['sales']['partitions']
        partition_count = len(partitions)
        partitions_per_worker = (partition_count + worker_count - 1) // worker_count

        return {
            'partitions_scanned': partition_count,
            'parallelism': worker_count,
            'partitions_per_worker': partitions_per_worker,
            'execution_time_estimate': '<10 seconds',
            'status': 'completed'
        }

    def _get_cache_key(self, sql: str) -> str:
        """Generate cache key from SQL query."""
        return f'hash({sql})'

    def _is_cache_valid(self, cached_result: dict, context: dict) -> bool:
        """Check if cached result is still valid (TTL check)."""
        cached_at = cached_result.get('cached_at')
        ttl = cached_result.get('ttl', 3600)

        # Check if TTL expired
        # (In real system: Compare current_time - cached_at < ttl)
        return True  # Simplified


# Example usage
if __name__ == '__main__':
    engine = DataWarehouseQueryEngine()

    # Test case 1: Partition pruning
    result = engine.execute_query(
        query={'sql': 'SELECT user_id, revenue FROM sales WHERE date = "2024-01-15"', 'execution_id': 'q1'},
        context={
            'table_metadata': {
                'sales': {
                    'total_rows': 1_000_000_000,
                    'partitions': [
                        {'partition_key': 'date=2024-01-15', 'row_count': 1_000_000},
                        {'partition_key': 'date=2024-01-16', 'row_count': 1_000_000}
                    ]
                }
            }
        }
    )
    print(f"Partitions scanned: {result['partitions_scanned']}")  # Should be 1 (not 1000)
    print(f"Columns read: {result['columns_read']}")  # Should be ['user_id', 'revenue', 'date']
`;

export const dataWarehouseQueryEngineChallenge: Challenge = {
  id: 'data_warehouse_query_engine',
  title: 'Data Warehouse Query Engine',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - Data Infrastructure',
  tags: [
    'Distributed Systems',
    'SQL',
    'Query Optimization',
    'Columnar Storage',
    'Data Skew',
    'Fault Tolerance',
    'Cost Optimization',
    'L4-L5',
    'Google',
    'Meta',
    'Uber',
  ],
  companies: ['Google', 'Meta', 'Uber', 'Netflix', 'AWS', 'Snowflake'],
  description: `Design a **distributed SQL query engine** that executes analytical queries over petabyte-scale data stored in columnar format (Parquet on S3).

**Real-world examples:**
- **Google BigQuery**: Distributed SQL on columnar storage (Dremel paper)
- **Presto/Trino**: Distributed SQL for data lakes (Meta, Uber, Netflix)
- **AWS Athena**: Serverless query engine on S3 (Presto-based)
- **Snowflake**: Cloud data warehouse with compute/storage separation

**Functional Requirements:**
1. **Partition pruning**: Only scan relevant partitions (date=2024-01-15, not all 1000 partitions)
2. **Column pruning**: Only read needed columns from Parquet (columnar format)
3. **Predicate pushdown**: Apply filters at storage layer (before network I/O)
4. **Distributed aggregation**: Two-phase aggregation for GROUP BY (partial + final)
5. **Join optimization**: Choose broadcast join vs hash join based on table size

**Performance (NFR-P):**
- Simple queries: <10 seconds (single partition scan)
- Complex queries: <5 minutes (multi-table joins)
- Vectorized execution: Process 1024 rows per batch (SIMD)
- Cost-based optimization: Choose best join strategy (broadcast vs hash)

**Scalability (NFR-S):**
- Handle 100+ TB data (10K partitions)
- Execute 10K queries/day concurrently
- Data skew mitigation: Detect and split hot keys (>10% of data)
- Parallel partition scan: Distribute across 10+ workers

**Reliability (NFR-R):**
- Fault tolerance: Task-level retry on worker failure (not entire query)
- Speculative execution: Launch duplicate task if straggler detected
- Graceful degradation: Continue with reduced parallelism if workers fail

**Cost (NFR-C):**
- Query caching: Cache results for 1 hour (avoid re-computation)
- Adaptive query execution: Switch join strategy based on runtime statistics
- Spot instances: Use spot workers for batch queries (70% cost savings)`,

  template: {
    language: 'python',
    code: pythonTemplate,
  },

  testCases: testCases.map((tc) => ({
    id: tc.id,
    name: tc.name,
    input: tc.input,
    expectedOutput: tc.expected_output,
    explanation: tc.explanation,
  })),

  hints: [
    {
      hint: 'Partition pruning: Store data in partitioned directories (date=2024-01-15/). Extract partition key from WHERE clause. Only scan matching partitions.',
      order: 1,
    },
    {
      hint: 'Columnar storage: Parquet stores data by column (not row). Read only needed columns. This is 10x faster for analytical queries (SELECT revenue vs SELECT *).',
      order: 2,
    },
    {
      hint: 'Two-phase aggregation: (1) Partial aggregation on each worker (local SUM). (2) Shuffle by GROUP BY key. (3) Final aggregation (combine partial SUMs). This reduces shuffle data.',
      order: 3,
    },
    {
      hint: 'Cost-based join: If small table < 100 MB, use broadcast join (send to all workers). If large, use hash join (shuffle both tables). Broadcast join avoids shuffle of large table.',
      order: 4,
    },
    {
      hint: 'Data skew: Detect hot keys during partial aggregation (count > threshold). Split hot key into sub-partitions (iphone-0, iphone-1, ...) using salt hash. Distribute across workers.',
      order: 5,
    },
    {
      hint: 'Fault tolerance: Track task progress per worker. If worker fails (heartbeat timeout), reassign only failed tasks to other workers. Don\'t restart entire query.',
      order: 6,
    },
    {
      hint: 'Speculative execution: Track progress of all workers. If straggler detected (>50% behind median), launch duplicate task on fast worker. Use first result.',
      order: 7,
    },
    {
      hint: 'Query caching: Hash SQL query as cache key. Store result in S3 or distributed cache. Check cache before execution. Set TTL (1 hour) to avoid stale results.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Understand distributed query execution (Dremel, Presto architecture)',
    'Apply partition pruning and column pruning (10x speedup)',
    'Implement two-phase aggregation (MapReduce pattern)',
    'Use cost-based optimization for join strategy selection',
    'Handle data skew with key splitting and salting',
    'Implement fault tolerance with task-level retry',
    'Apply speculative execution to handle stragglers',
    'Use query caching for cost optimization',
  ],

  commonMistakes: [
    {
      mistake: 'Scanning all partitions instead of using partition pruning',
      why_its_wrong: 'Scans 1000x more data than needed (1B rows vs 1M rows)',
      how_to_avoid:
        'Extract partition key from WHERE clause. Only scan matching partitions. This is the #1 optimization for analytical queries.',
    },
    {
      mistake: 'Reading all columns instead of using column pruning',
      why_its_wrong: 'Reads 10x more data than needed (all 100 columns vs 2 columns)',
      how_to_avoid:
        'Parquet is columnar storage. Read only columns in SELECT clause. This is 10x faster.',
    },
    {
      mistake: 'Using hash join for small tables (should use broadcast join)',
      why_its_wrong: 'Shuffles 100 GB large table instead of broadcasting 100 MB small table',
      how_to_avoid:
        'Use cost-based optimization: If small table < 100 MB, use broadcast join. This avoids shuffling large table.',
    },
    {
      mistake: 'Not handling data skew (hot keys overload single worker)',
      why_its_wrong: 'Single worker processes 50% of data (straggler). Query time = slowest worker time.',
      how_to_avoid:
        'Detect hot keys during aggregation. Split into sub-partitions (key-0, key-1, ...). Distribute across workers.',
    },
    {
      mistake: 'Retrying entire query on worker failure (wastes computation)',
      why_its_wrong: 'Discards work from 9 healthy workers. Re-computes everything.',
      how_to_avoid:
        'Use task-level retry: Track which tasks each worker executes. On failure, reassign only failed tasks.',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **Coordinator**: Parse SQL, create query plan, schedule tasks
2. **Workers**: Scan partitions, execute operators (filter, aggregate, join)
3. **Storage**: S3 with Parquet files (columnar format, partitioned by date)

**Query execution flow:**
1. Parse SQL → Logical plan (SELECT, WHERE, GROUP BY, JOIN)
2. Optimize logical plan → Physical plan (partition pruning, column pruning, join strategy)
3. Schedule tasks → Distribute to workers (task = scan 1 partition)
4. Workers execute → Partial results
5. Shuffle → Redistribute by GROUP BY key or JOIN key
6. Final aggregation → Return result to coordinator

**Key optimizations:**
- **Partition pruning**: date=2024-01-15 → Scan only 1 partition (not 1000)
- **Column pruning**: SELECT revenue → Read only revenue column (not all 100)
- **Predicate pushdown**: WHERE revenue > 100 → Apply filter at Parquet reader
- **Vectorized execution**: Process 1024 rows per batch (SIMD)
- **Two-phase aggregation**: Partial SUM on each worker → Shuffle → Final SUM
- **Broadcast join**: Small table < 100 MB → Send to all workers (avoid shuffling large table)`,

    steps: [
      '1. Parse SQL and create logical plan (use SQL parser like Apache Calcite)',
      '2. Apply logical optimizations: partition pruning, column pruning, predicate pushdown',
      '3. Choose physical operators: broadcast join vs hash join (cost-based)',
      '4. Create physical plan: stages with operators (TableScan, Aggregate, Join)',
      '5. Schedule tasks: Distribute partitions to workers (task = scan 1 partition)',
      '6. Execute tasks: Workers scan Parquet files, apply filters, compute partial results',
      '7. Shuffle: Redistribute data by GROUP BY key or JOIN key (hash partitioning)',
      '8. Final stage: Combine partial results, return to coordinator',
      '9. Handle failures: Retry failed tasks (not entire query)',
      '10. Handle stragglers: Launch speculative tasks if worker is slow',
    ],

    timeComplexity: `**Query execution time:**
- Simple query (single partition): O(rows in partition / parallelism) = O(1M / 10) = 100K rows per worker = <10 seconds
- Complex query (multi-table join): O(rows in both tables / parallelism) = O(100M / 10) = 10M rows per worker = <5 minutes
- With partition pruning: 1000x speedup (scan 1 partition vs 1000 partitions)
- With column pruning: 10x speedup (read 1 column vs 10 columns)
- With vectorization: 10x speedup (process 1024 rows per batch vs 1 row at a time)`,

    spaceComplexity: `**Memory per worker:**
- Hash table for join: O(rows in build side) = O(10M rows) = 1 GB
- Partial aggregation: O(distinct GROUP BY keys) = O(1M keys) = 100 MB
- Shuffle buffer: O(rows to shuffle) = O(10M rows) = 500 MB
Total: ~2 GB per worker (acceptable for r5.2xlarge instance with 64 GB RAM)`,
  },
};
