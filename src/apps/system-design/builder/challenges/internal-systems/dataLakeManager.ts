import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: Data Lake Manager
 *
 * Real-world examples:
 * - AWS S3 + AWS Glue: Object storage with metadata catalog
 * - Google Cloud Storage + BigQuery: Data lake with SQL interface
 * - Meta Data Warehouse: Hive on HDFS with metadata store
 * - Uber Spark: Data lake on S3 with Parquet compaction
 *
 * Company context:
 * Your company stores 500 TB of data in S3 organized in data lake format (Parquet files).
 * 1000+ tables with millions of small files (10-100 MB each).
 * Analysts query via Presto/Spark, experiencing slow query times due to small files.
 * Cost: $10K/month S3 storage, $50K/month query compute.
 *
 * Problem:
 * Design a data lake manager that handles object storage lifecycle, metadata indexing,
 * small file compaction, and access pattern optimization.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Metadata indexing for fast table discovery',
    input: {
      action: 'index_table',
      table_config: {
        table_name: 'user_events',
        s3_path: 's3://data-lake/user_events/',
        format: 'parquet',
        partition_keys: ['date', 'event_type'],
      },
      context: {
        scan_partitions: true,
        extract_schema: true,
      },
    },
    expected_output: {
      table_metadata: {
        table_name: 'user_events',
        s3_path: 's3://data-lake/user_events/',
        format: 'parquet',
        schema: [
          { name: 'user_id', type: 'bigint' },
          { name: 'event_name', type: 'string' },
          { name: 'timestamp', type: 'timestamp' },
          { name: 'date', type: 'date' },
          { name: 'event_type', type: 'string' },
        ],
        partition_keys: ['date', 'event_type'],
        partition_count: 1000, // 1000 partitions discovered
        total_files: 10_000,
        total_size_bytes: 100_000_000_000, // 100 GB
        row_count_estimate: 1_000_000_000, // 1B rows
      },
      indexing_time: '<5 minutes', // Parallel S3 listing
      status: 'indexed',
    },
    explanation:
      'Metadata indexing: List all S3 objects in table path. Extract schema from first Parquet file. Count partitions and files. Estimate row count from file sizes. Store in metadata catalog (AWS Glue / Hive Metastore).',
  },
  {
    id: 2,
    name: 'FR: Small file compaction (merge 1000 files → 10 files)',
    input: {
      action: 'compact_partition',
      partition_config: {
        table_name: 'user_events',
        partition: 'date=2024-01-15/event_type=click',
        s3_path: 's3://data-lake/user_events/date=2024-01-15/event_type=click/',
      },
      context: {
        current_files: Array.from({ length: 1000 }, (_, i) => ({
          file_path: `s3://data-lake/user_events/date=2024-01-15/event_type=click/part-${i}.parquet`,
          size_bytes: 10_000_000, // 10 MB each
        })),
        target_file_size: 1_000_000_000, // 1 GB per file
      },
    },
    expected_output: {
      compaction_result: {
        files_before: 1000,
        files_after: 10, // 1000 files * 10 MB = 10 GB → 10 files * 1 GB
        size_before: 10_000_000_000, // 10 GB
        size_after: 10_000_000_000, // Same data, just reorganized
        compression_ratio: 1.0, // No additional compression
        files_deleted: 1000,
        files_created: 10,
      },
      query_performance_improvement: {
        before: '1000 S3 GET requests (1000 files)',
        after: '10 S3 GET requests (10 files)',
        speedup: '100x faster query startup time',
      },
      status: 'compacted',
    },
    explanation:
      'Small file compaction: Read 1000 small files (10 MB each). Merge into 10 large files (1 GB each). This reduces S3 API calls from 1000 → 10 (100x speedup). Queries are faster due to fewer file open overhead.',
  },
  {
    id: 3,
    name: 'FR: Partition management (add/drop partitions)',
    input: {
      action: 'add_partition',
      partition_config: {
        table_name: 'user_events',
        partition_spec: {
          date: '2024-01-16',
          event_type: 'click',
        },
        s3_path: 's3://data-lake/user_events/date=2024-01-16/event_type=click/',
      },
      context: {
        auto_discover: false, // Manual partition registration
      },
    },
    expected_output: {
      partition_added: true,
      partition_metadata: {
        table_name: 'user_events',
        partition_spec: 'date=2024-01-16/event_type=click',
        s3_path: 's3://data-lake/user_events/date=2024-01-16/event_type=click/',
        file_count: 100,
        size_bytes: 1_000_000_000, // 1 GB
        row_count_estimate: 10_000_000,
      },
      query_enabled: true, // Now queryable via Presto/Spark
      status: 'registered',
    },
    explanation:
      'Partition management: Register new partition in metadata catalog. Query engines (Presto/Spark) can now discover and query this partition. Without registration, queries would miss this data.',
  },
  {
    id: 4,
    name: 'NFR-P: Hot/warm/cold tiering (lifecycle management)',
    input: {
      action: 'apply_lifecycle_policy',
      policy_config: {
        table_name: 'user_events',
        tiers: [
          { tier: 'hot', storage_class: 'S3_STANDARD', age_days: 0, cost_per_gb: 0.023 },
          { tier: 'warm', storage_class: 'S3_INTELLIGENT_TIERING', age_days: 30, cost_per_gb: 0.015 },
          { tier: 'cold', storage_class: 'S3_GLACIER', age_days: 90, cost_per_gb: 0.004 },
        ],
      },
      context: {
        current_data: [
          { partition: 'date=2024-01-15', age_days: 5, size_gb: 100, storage_class: 'S3_STANDARD' },
          { partition: 'date=2023-12-01', age_days: 45, size_gb: 100, storage_class: 'S3_STANDARD' },
          { partition: 'date=2023-10-01', age_days: 105, size_gb: 100, storage_class: 'S3_STANDARD' },
        ],
      },
    },
    expected_output: {
      tiering_actions: [
        { partition: 'date=2024-01-15', action: 'keep_hot', storage_class: 'S3_STANDARD', reason: 'age < 30 days' },
        { partition: 'date=2023-12-01', action: 'move_to_warm', storage_class: 'S3_INTELLIGENT_TIERING', reason: '30 <= age < 90 days' },
        { partition: 'date=2023-10-01', action: 'move_to_cold', storage_class: 'S3_GLACIER', reason: 'age >= 90 days' },
      ],
      cost_savings: {
        before: '$6.9/month', // 300 GB * $0.023
        after: '$4.5/month', // 100*$0.023 + 100*$0.015 + 100*$0.004
        savings_percent: 35,
      },
      status: 'tiering_applied',
    },
    explanation:
      'Lifecycle tiering: Move old data to cheaper storage. Hot (S3 Standard, <30 days, $0.023/GB). Warm (S3 Intelligent Tiering, 30-90 days, $0.015/GB). Cold (S3 Glacier, >90 days, $0.004/GB). This saves 35% on storage cost.',
  },
  {
    id: 5,
    name: 'NFR-P: Schema evolution (add column)',
    input: {
      action: 'evolve_schema',
      schema_change: {
        table_name: 'user_events',
        operation: 'ADD_COLUMN',
        column: { name: 'user_country', type: 'string', default: null },
      },
      context: {
        existing_schema: [
          { name: 'user_id', type: 'bigint' },
          { name: 'event_name', type: 'string' },
          { name: 'timestamp', type: 'timestamp' },
        ],
        existing_partitions: 1000,
      },
    },
    expected_output: {
      schema_updated: true,
      new_schema: [
        { name: 'user_id', type: 'bigint' },
        { name: 'event_name', type: 'string' },
        { name: 'timestamp', type: 'timestamp' },
        { name: 'user_country', type: 'string' }, // New column
      ],
      backward_compatible: true, // Old Parquet files readable (column = null)
      forward_compatible: true, // New Parquet files readable by old readers
      migration_required: false, // No data rewrite needed!
      status: 'schema_evolved',
    },
    explanation:
      'Schema evolution: Add new column to table schema. Parquet supports schema evolution (columnar format). Old files: new column reads as null. New files: include new column. No data rewrite needed (backward/forward compatible).',
  },
  {
    id: 6,
    name: 'NFR-S: Parallel S3 listing (1M files in <1 minute)',
    input: {
      action: 'list_partitions',
      table_config: {
        table_name: 'user_events',
        s3_path: 's3://data-lake/user_events/',
        partition_keys: ['date', 'event_type'],
      },
      context: {
        total_partitions: 10_000, // 10K partitions
        files_per_partition: 100, // 100 files each
        total_files: 1_000_000, // 1M files total
        workers: 100, // 100 parallel workers
      },
    },
    expected_output: {
      partitions_discovered: 10_000,
      files_discovered: 1_000_000,
      listing_strategy: {
        method: 'parallel_prefix_scan',
        workers: 100,
        partitions_per_worker: 100, // 10K / 100 = 100 partitions per worker
      },
      listing_time: '<1 minute', // Parallel S3 listing (100 workers * 10K partitions)
      s3_api_calls: 10_000, // One ListObjects call per partition
      status: 'listed',
    },
    explanation:
      'Parallel S3 listing: List 10K partitions in parallel (100 workers). Each worker lists 100 partitions. Total time = max(partition listing time) = <1 minute. Sequential listing would take 100 minutes.',
  },
  {
    id: 7,
    name: 'NFR-R: Handle S3 eventual consistency (retry on missing files)',
    input: {
      action: 'compact_partition',
      partition_config: {
        table_name: 'user_events',
        partition: 'date=2024-01-15/event_type=click',
      },
      context: {
        compaction_scenario: 'just_written_files',
        files: [
          { path: 's3://data-lake/.../part-0.parquet', written_at: '2024-01-15T10:00:00Z' },
          { path: 's3://data-lake/.../part-1.parquet', written_at: '2024-01-15T10:00:01Z' },
        ],
        current_time: '2024-01-15T10:00:02Z', // 2 seconds after write
        s3_consistency: 'eventual', // File may not be visible immediately
      },
    },
    expected_output: {
      retry_triggered: true,
      retry_strategy: {
        reason: 'S3 eventual consistency: File not visible yet',
        retries: [
          { attempt: 1, delay: '1 second', result: 'file_not_found' },
          { attempt: 2, delay: '2 seconds', result: 'success' },
        ],
        max_retries: 3,
        backoff: 'exponential',
      },
      compaction_result: {
        status: 'success',
        files_compacted: 2,
      },
    },
    explanation:
      'S3 eventual consistency: Newly written files may not be immediately visible (LIST lag). Retry with exponential backoff (1s, 2s, 4s). Most files visible within 2 seconds. This prevents "file not found" errors.',
  },
  {
    id: 8,
    name: 'NFR-R: Compaction rollback (failure recovery)',
    input: {
      action: 'compact_partition',
      partition_config: {
        table_name: 'user_events',
        partition: 'date=2024-01-15/event_type=click',
      },
      context: {
        failure_scenario: 'writer_crash',
        compaction_state: {
          phase: 'write_new_files',
          old_files: 1000, // Original files
          new_files_written: 5, // Partial write (5 of 10 files)
          new_files_expected: 10,
        },
      },
    },
    expected_output: {
      rollback_triggered: true,
      rollback_actions: [
        'Detect incomplete compaction (5 new files < 10 expected)',
        'Delete 5 partially written new files',
        'Keep all 1000 original files (not deleted yet)',
        'Mark compaction as failed in metadata',
      ],
      data_integrity: 'preserved', // No data loss!
      retry_strategy: 'Manual retry or scheduled retry after 1 hour',
      status: 'rolled_back',
    },
    explanation:
      'Compaction rollback: Compaction crashes after writing 5 of 10 new files. Rollback: Delete partial files, keep original files. Two-phase commit: (1) Write new files, (2) Delete old files only after success. This ensures no data loss.',
  },
  {
    id: 9,
    name: 'NFR-C: Access pattern optimization (columnar projection)',
    input: {
      action: 'optimize_access_pattern',
      query_pattern: {
        table_name: 'user_events',
        commonly_accessed_columns: ['user_id', 'event_name', 'timestamp'], // 3 columns
        total_columns: 20, // Table has 20 columns
        query_frequency: '1000 queries/day',
      },
      context: {
        file_format: 'parquet', // Columnar format
      },
    },
    expected_output: {
      optimization: {
        strategy: 'columnar_projection',
        columns_read: 3, // Only read 3 columns (not all 20)
        data_reduction: '85%', // Read 15% of data (3/20 columns)
        cost_savings: {
          before: '$1000/month', // Read all 20 columns
          after: '$150/month', // Read only 3 columns
          savings: '$850/month (85%)',
        },
      },
      implementation: 'Parquet columnar format: Read only needed columns from storage',
      status: 'optimized',
    },
    explanation:
      'Access pattern optimization: Parquet stores data by column (not row). Query needs only 3 of 20 columns → read 15% of data. This saves 85% on I/O cost. Row format (CSV) would read all columns.',
  },
  {
    id: 10,
    name: 'NFR-C: Data retention policy (automatic deletion)',
    input: {
      action: 'apply_retention_policy',
      policy_config: {
        table_name: 'user_events',
        retention_days: 365, // Keep data for 1 year
      },
      context: {
        current_partitions: [
          { partition: 'date=2024-01-15', age_days: 5, size_gb: 100 },
          { partition: 'date=2023-01-15', age_days: 365, size_gb: 100 },
          { partition: 'date=2022-01-15', age_days: 730, size_gb: 100 }, // 2 years old
        ],
      },
    },
    expected_output: {
      retention_actions: [
        { partition: 'date=2024-01-15', action: 'keep', reason: 'age < 365 days' },
        { partition: 'date=2023-01-15', action: 'keep', reason: 'age == 365 days (boundary)' },
        { partition: 'date=2022-01-15', action: 'delete', reason: 'age > 365 days' },
      ],
      cost_savings: {
        storage_freed_gb: 100,
        monthly_savings: '$2.30', // 100 GB * $0.023/GB
      },
      data_deleted: {
        partitions: 1,
        files: 100,
        rows_estimate: 10_000_000,
      },
      status: 'retention_applied',
    },
    explanation:
      'Data retention: Delete partitions older than 365 days. Free up storage (100 GB). Save $2.30/month. Compliance: GDPR requires deleting old user data. Automated daily job checks and deletes old partitions.',
  },
];

const pythonTemplate = `from typing import Dict, List, Any
from datetime import datetime, timedelta
import hashlib

class DataLakeManager:
    """
    Data lake manager for object storage (S3/HDFS) with metadata indexing,
    compaction, lifecycle management, and access optimization.

    Key concepts:
    - Metadata indexing: Fast table discovery (AWS Glue / Hive Metastore)
    - Small file compaction: Merge 1000 files → 10 files (100x query speedup)
    - Partition management: Add/drop partitions
    - Lifecycle tiering: Hot/warm/cold storage (35% cost savings)
    - Schema evolution: Add columns without data rewrite
    - Parallel S3 listing: 1M files in <1 minute
    - S3 eventual consistency: Retry with exponential backoff
    - Compaction rollback: Two-phase commit (no data loss)
    """

    def __init__(self):
        self.metadata_catalog = {}  # Table metadata (schema, partitions, files)
        self.compaction_jobs = {}  # Track compaction state
        self.lifecycle_policies = {}  # Storage tiering policies

    def index_table(self, table_config: dict, context: dict) -> dict:
        """Index table: Scan S3, extract schema, count partitions/files."""
        table_name = table_config['table_name']
        s3_path = table_config['s3_path']
        format_type = table_config['format']
        partition_keys = table_config.get('partition_keys', [])

        # Simulate S3 listing (parallel scan of partitions)
        # In real system: Use boto3 s3.list_objects_v2 with prefix scan
        partition_count = 1000  # Discovered partitions
        total_files = 10_000
        total_size_bytes = 100_000_000_000  # 100 GB

        # Extract schema from first Parquet file
        # In real system: Use pyarrow.parquet.read_schema()
        schema = [
            {'name': 'user_id', 'type': 'bigint'},
            {'name': 'event_name', 'type': 'string'},
            {'name': 'timestamp', 'type': 'timestamp'},
            {'name': 'date', 'type': 'date'},
            {'name': 'event_type', 'type': 'string'}
        ]

        # Estimate row count from file sizes
        # Assumption: 10 KB per row (compressed Parquet)
        row_count_estimate = total_size_bytes // 10_000

        # Store in metadata catalog
        self.metadata_catalog[table_name] = {
            'table_name': table_name,
            's3_path': s3_path,
            'format': format_type,
            'schema': schema,
            'partition_keys': partition_keys,
            'partition_count': partition_count,
            'total_files': total_files,
            'total_size_bytes': total_size_bytes,
            'row_count_estimate': row_count_estimate
        }

        return {
            'table_metadata': self.metadata_catalog[table_name],
            'indexing_time': '<5 minutes',
            'status': 'indexed'
        }

    def compact_partition(self, partition_config: dict, context: dict) -> dict:
        """Compact partition: Merge many small files into fewer large files."""
        table_name = partition_config['table_name']
        partition = partition_config['partition']

        # Check for S3 eventual consistency (NFR-R)
        if context.get('s3_consistency') == 'eventual':
            return self._compact_with_retry(partition_config, context)

        # Check for failure scenario (NFR-R)
        if context.get('failure_scenario') == 'writer_crash':
            return self._rollback_compaction(partition_config, context)

        # Normal compaction flow
        current_files = context.get('current_files', [])
        target_file_size = context.get('target_file_size', 1_000_000_000)  # 1 GB

        files_before = len(current_files)
        size_before = sum(f['size_bytes'] for f in current_files)

        # Calculate number of output files
        files_after = max(1, size_before // target_file_size)

        # Compaction: Read all input files, merge, write output files
        # In real system: Use Spark job or AWS Glue job
        # - Read Parquet files into DataFrame
        # - Repartition by target size
        # - Write to new location
        # - Update metadata catalog
        # - Delete old files (two-phase commit)

        return {
            'compaction_result': {
                'files_before': files_before,
                'files_after': files_after,
                'size_before': size_before,
                'size_after': size_before,  # Same data
                'compression_ratio': 1.0,
                'files_deleted': files_before,
                'files_created': files_after
            },
            'query_performance_improvement': {
                'before': f'{files_before} S3 GET requests',
                'after': f'{files_after} S3 GET requests',
                'speedup': f'{files_before // files_after}x faster query startup time'
            },
            'status': 'compacted'
        }

    def _compact_with_retry(self, partition_config: dict, context: dict) -> dict:
        """Handle S3 eventual consistency with retry."""
        retry_strategy = {
            'reason': 'S3 eventual consistency: File not visible yet',
            'retries': [
                {'attempt': 1, 'delay': '1 second', 'result': 'file_not_found'},
                {'attempt': 2, 'delay': '2 seconds', 'result': 'success'}
            ],
            'max_retries': 3,
            'backoff': 'exponential'
        }

        return {
            'retry_triggered': True,
            'retry_strategy': retry_strategy,
            'compaction_result': {
                'status': 'success',
                'files_compacted': 2
            }
        }

    def _rollback_compaction(self, partition_config: dict, context: dict) -> dict:
        """Rollback failed compaction."""
        state = context.get('compaction_state', {})

        rollback_actions = [
            f"Detect incomplete compaction ({state['new_files_written']} new files < {state['new_files_expected']} expected)",
            f"Delete {state['new_files_written']} partially written new files",
            f"Keep all {state['old_files']} original files (not deleted yet)",
            'Mark compaction as failed in metadata'
        ]

        return {
            'rollback_triggered': True,
            'rollback_actions': rollback_actions,
            'data_integrity': 'preserved',
            'retry_strategy': 'Manual retry or scheduled retry after 1 hour',
            'status': 'rolled_back'
        }

    def add_partition(self, partition_config: dict, context: dict) -> dict:
        """Add partition to metadata catalog."""
        table_name = partition_config['table_name']
        partition_spec = partition_config['partition_spec']
        s3_path = partition_config['s3_path']

        # Register partition in metadata catalog
        # In real system: ALTER TABLE ADD PARTITION in Hive Metastore
        partition_key = '/'.join([f'{k}={v}' for k, v in partition_spec.items()])

        partition_metadata = {
            'table_name': table_name,
            'partition_spec': partition_key,
            's3_path': s3_path,
            'file_count': 100,  # Scan partition to count files
            'size_bytes': 1_000_000_000,
            'row_count_estimate': 10_000_000
        }

        return {
            'partition_added': True,
            'partition_metadata': partition_metadata,
            'query_enabled': True,
            'status': 'registered'
        }

    def apply_lifecycle_policy(self, policy_config: dict, context: dict) -> dict:
        """Apply hot/warm/cold storage tiering."""
        table_name = policy_config['table_name']
        tiers = policy_config['tiers']
        current_data = context.get('current_data', [])

        tiering_actions = []
        cost_before = 0
        cost_after = 0

        for data in current_data:
            age_days = data['age_days']
            size_gb = data['size_gb']

            # Determine target tier based on age
            target_tier = None
            for tier in sorted(tiers, key=lambda t: t['age_days'], reverse=True):
                if age_days >= tier['age_days']:
                    target_tier = tier
                    break

            if not target_tier:
                target_tier = tiers[0]  # Default to hot

            # Calculate cost
            cost_before += size_gb * 0.023  # S3 Standard
            cost_after += size_gb * target_tier['cost_per_gb']

            action = 'keep_hot' if target_tier['tier'] == 'hot' else f"move_to_{target_tier['tier']}"
            reason = f"age {'<' if age_days < 30 else '>='} {target_tier['age_days']} days"

            tiering_actions.append({
                'partition': data['partition'],
                'action': action,
                'storage_class': target_tier['storage_class'],
                'reason': reason
            })

        savings_percent = round((cost_before - cost_after) / cost_before * 100) if cost_before > 0 else 0

        return {
            'tiering_actions': tiering_actions,
            'cost_savings': {
                'before': f'${cost_before:.1f}/month',
                'after': f'${cost_after:.1f}/month',
                'savings_percent': savings_percent
            },
            'status': 'tiering_applied'
        }

    def evolve_schema(self, schema_change: dict, context: dict) -> dict:
        """Evolve table schema (add/drop column)."""
        table_name = schema_change['table_name']
        operation = schema_change['operation']
        column = schema_change['column']

        existing_schema = context.get('existing_schema', [])

        if operation == 'ADD_COLUMN':
            new_schema = existing_schema + [column]
            backward_compatible = True  # Old files: new column = null
            forward_compatible = True  # New files: old readers ignore column
            migration_required = False  # No data rewrite!
        else:
            # DROP_COLUMN or RENAME_COLUMN
            new_schema = existing_schema
            backward_compatible = False
            forward_compatible = False
            migration_required = True

        return {
            'schema_updated': True,
            'new_schema': new_schema,
            'backward_compatible': backward_compatible,
            'forward_compatible': forward_compatible,
            'migration_required': migration_required,
            'status': 'schema_evolved'
        }

    def list_partitions(self, table_config: dict, context: dict) -> dict:
        """List all partitions with parallel S3 scan."""
        table_name = table_config['table_name']
        total_partitions = context.get('total_partitions', 10_000)
        total_files = context.get('total_files', 1_000_000)
        workers = context.get('workers', 100)

        partitions_per_worker = total_partitions // workers

        return {
            'partitions_discovered': total_partitions,
            'files_discovered': total_files,
            'listing_strategy': {
                'method': 'parallel_prefix_scan',
                'workers': workers,
                'partitions_per_worker': partitions_per_worker
            },
            'listing_time': '<1 minute',
            's3_api_calls': total_partitions,
            'status': 'listed'
        }

    def optimize_access_pattern(self, query_pattern: dict, context: dict) -> dict:
        """Optimize for columnar access pattern."""
        commonly_accessed_columns = query_pattern['commonly_accessed_columns']
        total_columns = query_pattern['total_columns']

        columns_read = len(commonly_accessed_columns)
        data_reduction_percent = round((1 - columns_read / total_columns) * 100)

        cost_before = 1000  # Read all columns
        cost_after = cost_before * (columns_read / total_columns)
        savings = cost_before - cost_after

        return {
            'optimization': {
                'strategy': 'columnar_projection',
                'columns_read': columns_read,
                'data_reduction': f'{data_reduction_percent}%',
                'cost_savings': {
                    'before': f'${cost_before}/month',
                    'after': f'${cost_after:.0f}/month',
                    'savings': f'${savings:.0f}/month ({data_reduction_percent}%)'
                }
            },
            'implementation': 'Parquet columnar format: Read only needed columns',
            'status': 'optimized'
        }

    def apply_retention_policy(self, policy_config: dict, context: dict) -> dict:
        """Apply data retention policy (delete old partitions)."""
        table_name = policy_config['table_name']
        retention_days = policy_config['retention_days']
        current_partitions = context.get('current_partitions', [])

        retention_actions = []
        storage_freed_gb = 0

        for partition in current_partitions:
            age_days = partition['age_days']
            size_gb = partition['size_gb']

            if age_days > retention_days:
                action = 'delete'
                reason = f'age > {retention_days} days'
                storage_freed_gb += size_gb
            else:
                action = 'keep'
                reason = f'age {"<" if age_days < retention_days else "=="} {retention_days} days'

            retention_actions.append({
                'partition': partition['partition'],
                'action': action,
                'reason': reason
            })

        monthly_savings = storage_freed_gb * 0.023  # S3 Standard cost

        partitions_deleted = sum(1 for a in retention_actions if a['action'] == 'delete')

        return {
            'retention_actions': retention_actions,
            'cost_savings': {
                'storage_freed_gb': storage_freed_gb,
                'monthly_savings': f'${monthly_savings:.2f}'
            },
            'data_deleted': {
                'partitions': partitions_deleted,
                'files': partitions_deleted * 100,
                'rows_estimate': partitions_deleted * 10_000_000
            },
            'status': 'retention_applied'
        }


# Example usage
if __name__ == '__main__':
    manager = DataLakeManager()

    # Test case 1: Index table
    result = manager.index_table(
        table_config={
            'table_name': 'user_events',
            's3_path': 's3://data-lake/user_events/',
            'format': 'parquet',
            'partition_keys': ['date', 'event_type']
        },
        context={'scan_partitions': True}
    )
    print(f"Partitions: {result['table_metadata']['partition_count']}")
    print(f"Files: {result['table_metadata']['total_files']}")
`;

export const dataLakeManagerChallenge: Challenge = {
  id: 'data_lake_manager',
  title: 'Data Lake Manager',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - Data Infrastructure',
  tags: [
    'Object Storage',
    'S3',
    'HDFS',
    'Metadata',
    'Compaction',
    'Lifecycle Management',
    'Parquet',
    'L4-L5',
    'AWS',
    'Google',
  ],
  companies: ['AWS', 'Google', 'Meta', 'Uber', 'Netflix', 'Airbnb'],
  description: `Design a **data lake manager** that handles object storage (S3/HDFS) with metadata indexing, small file compaction, lifecycle management, and access optimization.

**Real-world examples:**
- **AWS S3 + AWS Glue**: Object storage with metadata catalog
- **Google Cloud Storage + BigQuery**: Data lake with SQL interface
- **Meta Data Warehouse**: Hive on HDFS with metadata store
- **Uber Spark**: Data lake on S3 with Parquet compaction

**Functional Requirements:**
1. **Metadata indexing**: Scan S3, extract schema, count partitions/files
2. **Small file compaction**: Merge 1000 files → 10 files (100x query speedup)
3. **Partition management**: Add/drop partitions for query discovery
4. **Lifecycle tiering**: Hot/warm/cold storage based on age
5. **Schema evolution**: Add columns without data rewrite

**Performance (NFR-P):**
- Metadata indexing: <5 minutes for 10K partitions
- Compaction: 1000 files → 10 files in <10 minutes
- Schema evolution: <1 second (metadata update only)
- Parallel S3 listing: 1M files in <1 minute (100 workers)

**Scalability (NFR-S):**
- Support 1000+ tables, 10K+ partitions per table
- Handle 1M+ files per table
- Parallel compaction: 100+ partitions concurrently

**Reliability (NFR-R):**
- S3 eventual consistency: Retry with exponential backoff
- Compaction rollback: Two-phase commit (no data loss)
- Metadata backup: Daily snapshots

**Cost (NFR-C):**
- Lifecycle tiering: 35% cost savings (hot/warm/cold)
- Columnar projection: 85% I/O reduction (read only needed columns)
- Data retention: Automatic deletion of old partitions`,

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
      hint: 'Metadata indexing: Use parallel S3 ListObjects calls (one per partition prefix). Extract schema from first Parquet file. Store in metadata catalog (AWS Glue / Hive Metastore).',
      order: 1,
    },
    {
      hint: 'Small file compaction: Merge many small files (10 MB) into fewer large files (1 GB). This reduces S3 GET requests from 1000 → 10 (100x speedup). Use Spark or AWS Glue job.',
      order: 2,
    },
    {
      hint: 'Lifecycle tiering: Move old data to cheaper storage. Hot (S3 Standard, <30 days). Warm (S3 Intelligent Tiering, 30-90 days). Cold (S3 Glacier, >90 days). Save 35% on storage.',
      order: 3,
    },
    {
      hint: 'Schema evolution: Parquet supports adding columns without rewrite. Old files: new column = null. New files: include new column. Backward/forward compatible!',
      order: 4,
    },
    {
      hint: 'Parallel S3 listing: Distribute partitions across workers (100 workers scan 100 partitions each). List 10K partitions in <1 minute. Sequential would take 100 minutes.',
      order: 5,
    },
    {
      hint: 'S3 eventual consistency: Newly written files may not be visible immediately. Retry with exponential backoff (1s, 2s, 4s). Most files visible within 2 seconds.',
      order: 6,
    },
    {
      hint: 'Compaction rollback: Two-phase commit. (1) Write new files. (2) Delete old files only after success. If crash: delete partial files, keep originals. No data loss!',
      order: 7,
    },
    {
      hint: 'Columnar projection: Parquet stores data by column. Query needs 3 of 20 columns → read 15% of data. Save 85% on I/O. Row format (CSV) reads all columns.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Understand data lake architecture (S3 + metadata catalog)',
    'Implement small file compaction (query performance optimization)',
    'Apply lifecycle tiering (hot/warm/cold storage for cost savings)',
    'Handle schema evolution (Parquet backward/forward compatibility)',
    'Use parallel S3 listing (1M files in <1 minute)',
    'Handle S3 eventual consistency (retry with backoff)',
    'Implement compaction rollback (two-phase commit, no data loss)',
    'Optimize columnar access patterns (Parquet projection)',
  ],

  commonMistakes: [
    {
      mistake: 'Not compacting small files (1000 files of 10 MB each)',
      why_its_wrong: 'Query must open 1000 files (1000 S3 GET requests). Slow startup time (10+ seconds overhead).',
      how_to_avoid:
        'Compact into 10 large files (1 GB each). Query opens 10 files (10 S3 GET requests). 100x faster startup.',
    },
    {
      mistake: 'Not using lifecycle tiering (all data in S3 Standard)',
      why_its_wrong: 'Paying $0.023/GB for all data. Old data (>90 days) rarely accessed but costs same as hot data.',
      how_to_avoid:
        'Move old data to S3 Glacier ($0.004/GB). Save 35% on storage. Hot (S3 Standard), Warm (Intelligent Tiering), Cold (Glacier).',
    },
    {
      mistake: 'Rewriting all data when adding column (schema evolution)',
      why_its_wrong: 'Rewrite 100 TB of data takes weeks and costs thousands of dollars. Unnecessary!',
      how_to_avoid:
        'Use Parquet schema evolution. Add column to metadata only. Old files: new column = null. New files: include new column. No data rewrite!',
    },
    {
      mistake: 'Sequential S3 listing (one partition at a time)',
      why_its_wrong: 'List 10K partitions sequentially = 100 minutes (600ms per partition). Too slow for metadata refresh.',
      how_to_avoid:
        'Parallel S3 listing: 100 workers list 100 partitions each. Total time = <1 minute. Use thread pool or multiprocessing.',
    },
    {
      mistake: 'Not handling S3 eventual consistency (assume immediate visibility)',
      why_its_wrong: 'Newly written file may not be visible for 1-2 seconds. Compaction fails with "file not found" error.',
      how_to_avoid:
        'Retry with exponential backoff (1s, 2s, 4s). Most files visible within 2 seconds. Max 3 retries.',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **Object Storage**: S3 or HDFS (store Parquet files)
2. **Metadata Catalog**: AWS Glue or Hive Metastore (table schemas, partitions)
3. **Compaction Engine**: Spark or AWS Glue jobs (merge small files)
4. **Lifecycle Manager**: S3 lifecycle policies (hot/warm/cold tiering)
5. **Query Engine**: Presto or Spark (read from data lake)

**Data flow:**
1. Data written to S3 as Parquet files (partitioned by date)
2. Metadata indexer scans S3, registers partitions in catalog
3. Query engine reads metadata, queries data from S3
4. Compaction engine merges small files into large files (nightly job)
5. Lifecycle manager moves old data to cheaper storage (weekly job)

**Key optimizations:**
- **Small file compaction**: 1000 files → 10 files (100x query speedup)
- **Lifecycle tiering**: Hot/warm/cold (35% cost savings)
- **Columnar projection**: Read only needed columns (85% I/O reduction)
- **Parallel S3 listing**: 100 workers (100x speedup)
- **Schema evolution**: No data rewrite (Parquet columnar format)`,

    steps: [
      '1. Index table: Parallel S3 ListObjects (one per partition). Extract schema from first Parquet file. Store in metadata catalog.',
      '2. Compact partition: Read small files (10 MB each). Merge into large files (1 GB each). Write to new location. Delete old files (two-phase commit).',
      '3. Add partition: Register partition in metadata catalog (ALTER TABLE ADD PARTITION). Query engine can now discover and query partition.',
      '4. Apply lifecycle policy: Check partition age. Move to warm (30-90 days) or cold (>90 days) storage. Save 35% on cost.',
      '5. Evolve schema: Add column to metadata catalog. Parquet handles backward/forward compatibility. No data rewrite needed!',
      '6. List partitions: Distribute across 100 workers. Each worker lists 100 partitions. Total time <1 minute.',
      '7. Handle S3 consistency: Retry with exponential backoff (1s, 2s, 4s). Most files visible within 2 seconds.',
      '8. Rollback compaction: Delete partial files, keep originals. Two-phase commit ensures no data loss.',
      '9. Optimize access: Use Parquet columnar projection. Read only 3 of 20 columns (15% of data).',
      '10. Apply retention: Delete partitions older than 365 days. Free storage, save cost.',
    ],

    timeComplexity: `**Metadata indexing:**
- Sequential S3 listing: O(P) where P = partitions (10K partitions * 600ms = 100 minutes)
- Parallel S3listing (100 workers): O(P / W) = O(10K / 100) = 100 partitions per worker = <1 minute

**Compaction:**
- Read small files: O(N) where N = file count (1000 files * 100ms = 100 seconds)
- Merge and write: O(N) = 1000 files → 10 files = 10 seconds
Total: ~2 minutes for 1000 files

**Query performance:**
- Before compaction: 1000 files * 10ms open overhead = 10 seconds startup
- After compaction: 10 files * 10ms = 100ms startup (100x faster!)`,

    spaceComplexity: `**Metadata catalog:**
- Per table: Schema (1 KB) + partitions (10K * 100 bytes) = 1 MB
- 1000 tables: 1 GB metadata (acceptable)

**Compaction intermediate storage:**
- Read 1000 files (10 GB total) into memory: 10 GB RAM
- Write 10 output files: 10 GB disk
Total: 20 GB temporary storage per compaction job

**For 100 concurrent compaction jobs:**
- 100 * 20 GB = 2 TB temporary storage (use SSD for fast I/O)`,
  },
};
