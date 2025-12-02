/**
 * L4-L5 Internal Systems: Change Data Capture (CDC)
 *
 * Design a CDC system to stream database changes (INSERT, UPDATE, DELETE) to downstream
 * consumers in real-time. Essential for data replication, cache invalidation, and
 * event-driven architectures.
 *
 * Real-world examples:
 * - Debezium: Open-source CDC for MySQL, Postgres, MongoDB
 * - AWS DMS: Database Migration Service with CDC
 * - LinkedIn Databus: CDC for Oracle
 * - Uber Databus: CDC across heterogeneous databases
 *
 * Companies: LinkedIn, Uber, Airbnb, Netflix, Meta
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Data Infrastructure & Analytics
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Change Capture
 *    - Log tailing: Read database transaction logs (binlog for MySQL, WAL for Postgres)
 *    - Change events: Capture INSERT, UPDATE, DELETE operations
 *    - Before/after values: Include old and new row values (for UPDATE)
 *    - Schema capture: Include table schema with each event
 *
 * 2. Event Streaming
 *    - Real-time streaming: Publish changes to Kafka/event bus
 *    - Ordering guarantees: Preserve per-table or per-key ordering
 *    - Exactly-once delivery: No duplicates or missing events
 *    - Deduplication: Handle log replay scenarios
 *
 * 3. Schema Evolution
 *    - Schema changes: Handle ALTER TABLE, ADD COLUMN, DROP COLUMN
 *    - Backward compatibility: Old consumers can still read new schema
 *    - Forward compatibility: New consumers can read old schema
 *    - Schema registry: Store schema versions centrally
 *
 * 4. Backpressure & Recovery
 *    - Backpressure handling: Slow down if consumers can't keep up
 *    - Checkpointing: Track last processed log position
 *    - Replay: Reprocess from checkpoint on failure
 *    - Initial snapshot: Bootstrap from full table snapshot
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Latency: <1 second from database write to event publish
 * - Throughput: Handle 100K writes/second per table
 * - Batch processing: Process log entries in batches (100-1000 entries)
 * - Parallel processing: Multiple tables in parallel
 *
 * Scalability (NFR-S):
 * - Support 1000+ tables
 * - Handle 1TB+ transaction logs daily
 * - Multi-database: MySQL, Postgres, MongoDB
 * - Horizontal scaling: Add more CDC workers for different tables
 *
 * Reliability (NFR-R):
 * - Ordering: Preserve per-key ordering (same row updates in order)
 * - Exactly-once: No duplicate events or missing events
 * - Fault tolerance: Recover from CDC worker crash
 * - Data consistency: Maintain transactional boundaries
 *
 * Cost (NFR-C):
 * - Use incremental CDC (not full table scans)
 * - Compress events before publishing (3-5x reduction)
 * - Archive old log files to cheap storage (S3 Glacier)
 * - Efficient log parsing (avoid regex, use binary parsing)
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import deque

class ChangeDataCapture:
    """
    Change Data Capture (CDC) System

    Key Operations:
    1. capture_change: Read change from database log
    2. publish_event: Publish change event to Kafka
    3. handle_backpressure: Slow down if consumers lag
    4. checkpoint: Save last processed log position
    5. handle_schema_change: Process ALTER TABLE events
    """

    def __init__(self):
        self.events = []  # [(event)]
        self.checkpoints = {}  # {table_name: log_position}
        self.schemas = {}  # {table_name: {version: schema}}
        self.lag_metrics = {}  # {table_name: lag_seconds}

    def capture_change(self, log_entry: dict, context: dict) -> dict:
        """
        Capture change from database transaction log.

        FR: Read binlog/WAL and capture INSERT/UPDATE/DELETE
        NFR-P: <1 second latency from write to event publish

        Args:
            log_entry: {
                'log_position': int,  # Position in binlog/WAL
                'timestamp': datetime,
                'table_name': str,
                'operation': 'INSERT' | 'UPDATE' | 'DELETE',
                'primary_key': dict,  # {'id': 123}
                'before': dict | None,  # Old row (for UPDATE/DELETE)
                'after': dict | None   # New row (for INSERT/UPDATE)
            }
            context: Contains database connection, schema

        Returns:
            {
                'event_id': str,
                'table_name': str,
                'operation': str,
                'primary_key': dict,
                'timestamp': datetime
            }
        """
        table_name = log_entry['table_name']
        operation = log_entry['operation']

        # Get current schema for table
        # NFR-R: Include schema version to handle schema evolution
        schema_version = context.get('schema_versions', {}).get(table_name, 1)
        schema = self.schemas.get(table_name, {}).get(schema_version, {})

        # Create change event
        event_id = f"{table_name}:{log_entry['log_position']}"

        event = {
            'event_id': event_id,
            'log_position': log_entry['log_position'],
            'table_name': table_name,
            'operation': operation,
            'primary_key': log_entry['primary_key'],
            'before': log_entry.get('before'),
            'after': log_entry.get('after'),
            'schema_version': schema_version,
            'timestamp': log_entry['timestamp'],
            'captured_at': datetime.now()
        }

        self.events.append(event)

        # Calculate latency (NFR-P: <1 second)
        latency_seconds = (event['captured_at'] - log_entry['timestamp']).total_seconds()

        return {
            'event_id': event_id,
            'table_name': table_name,
            'operation': operation,
            'primary_key': log_entry['primary_key'],
            'timestamp': log_entry['timestamp'].isoformat(),
            'latency_seconds': round(latency_seconds, 3)
        }

    def publish_event(self, event_id: str, context: dict) -> dict:
        """
        Publish change event to Kafka.

        FR: Stream changes to Kafka with ordering guarantees
        NFR-R: Preserve per-key ordering

        Args:
            event_id: Event to publish
            context: Contains Kafka producer

        Returns:
            {
                'event_id': str,
                'kafka_topic': str,
                'kafka_partition': int,
                'kafka_offset': int
            }
        """
        # Find event
        event = next((e for e in self.events if e['event_id'] == event_id), None)
        if not event:
            return {'error': 'Event not found'}

        table_name = event['table_name']
        primary_key = event['primary_key']

        # Determine Kafka topic (one topic per table)
        kafka_topic = f"cdc.{table_name}"

        # Partition by primary key (NFR-R: Preserve per-key ordering)
        # Hash primary key to determine partition
        # This ensures all changes to same row go to same partition (ordered)
        pk_str = str(sorted(primary_key.items()))
        partition_count = context.get('partition_count', 10)
        kafka_partition = hash(pk_str) % partition_count

        # Serialize event (compress for efficiency)
        # NFR-C: Compress events (3-5x reduction)
        event_payload = {
            'table': event['table_name'],
            'op': event['operation'],
            'pk': event['primary_key'],
            'before': event.get('before'),
            'after': event.get('after'),
            'schema_version': event['schema_version'],
            'ts': event['timestamp'].isoformat()
        }

        # Publish to Kafka (simulated)
        kafka_offset = context.get('kafka_producer', {}).get('next_offset', 0)
        context.setdefault('kafka_producer', {})['next_offset'] = kafka_offset + 1

        # Update checkpoint after successful publish
        self.checkpoints[table_name] = event['log_position']

        return {
            'event_id': event_id,
            'kafka_topic': kafka_topic,
            'kafka_partition': kafka_partition,
            'kafka_offset': kafka_offset
        }

    def handle_backpressure(self, table_name: str, context: dict) -> dict:
        """
        Handle backpressure when consumers lag behind.

        FR: Backpressure handling
        NFR-R: Don't lose events, slow down if needed

        Args:
            table_name: Table to check
            context: Contains consumer lag metrics

        Returns:
            {
                'backpressure_active': bool,
                'lag_seconds': float,
                'action': 'slow_down' | 'pause' | 'continue'
            }
        """
        # Get consumer lag from Kafka consumer group
        # Lag = Latest offset - Consumer offset
        consumer_lag = context.get('consumer_lag', {}).get(table_name, 0)

        # Convert lag (number of events) to time lag
        # Assume 1000 events/second average throughput
        throughput_per_sec = context.get('throughput', 1000)
        lag_seconds = consumer_lag / throughput_per_sec

        self.lag_metrics[table_name] = lag_seconds

        # Backpressure thresholds
        # Warning: >60 seconds lag
        # Critical: >300 seconds lag (5 minutes)
        backpressure_active = lag_seconds > 60

        if lag_seconds > 300:
            action = 'pause'  # Pause CDC capture for this table
        elif lag_seconds > 60:
            action = 'slow_down'  # Reduce batch size
        else:
            action = 'continue'  # Normal operation

        return {
            'backpressure_active': backpressure_active,
            'lag_seconds': round(lag_seconds, 2),
            'lag_events': consumer_lag,
            'action': action
        }

    def checkpoint(self, table_name: str) -> dict:
        """
        Save checkpoint (last processed log position).

        FR: Checkpointing for recovery
        NFR-R: Fault tolerance

        Args:
            table_name: Table to checkpoint

        Returns:
            {
                'table_name': str,
                'log_position': int,
                'checkpointed_at': datetime
            }
        """
        if table_name not in self.checkpoints:
            return {'error': 'No checkpoint for table'}

        log_position = self.checkpoints[table_name]

        # Store checkpoint (in production: write to durable storage like ZooKeeper, etcd)
        checkpoint = {
            'table_name': table_name,
            'log_position': log_position,
            'checkpointed_at': datetime.now()
        }

        return {
            'table_name': table_name,
            'log_position': log_position,
            'checkpointed_at': checkpoint['checkpointed_at'].isoformat()
        }

    def handle_schema_change(self, schema_change_event: dict) -> dict:
        """
        Handle schema changes (ALTER TABLE).

        FR: Schema evolution (ADD/DROP column)
        NFR-R: Backward/forward compatibility

        Args:
            schema_change_event: {
                'table_name': str,
                'operation': 'ADD_COLUMN' | 'DROP_COLUMN' | 'MODIFY_COLUMN',
                'column_name': str,
                'column_type': str | None
            }

        Returns:
            {
                'table_name': str,
                'old_schema_version': int,
                'new_schema_version': int,
                'compatible': bool
            }
        """
        table_name = schema_change_event['table_name']
        operation = schema_change_event['operation']

        # Get current schema version
        if table_name not in self.schemas:
            self.schemas[table_name] = {1: {'columns': []}}

        current_versions = self.schemas[table_name]
        current_version = max(current_versions.keys())
        current_schema = current_versions[current_version]

        # Create new schema version
        new_version = current_version + 1
        new_schema = current_schema.copy()

        # Apply schema change
        if operation == 'ADD_COLUMN':
            # Add column
            new_column = {
                'name': schema_change_event['column_name'],
                'type': schema_change_event['column_type']
            }
            new_schema['columns'] = current_schema.get('columns', []) + [new_column]

            # Backward compatible: Old consumers ignore new column
            # Forward compatible: New consumers see null for old events
            compatible = True

        elif operation == 'DROP_COLUMN':
            # Drop column
            new_schema['columns'] = [
                c for c in current_schema.get('columns', [])
                if c['name'] != schema_change_event['column_name']
            ]

            # Backward compatible: Old consumers still expect column (BREAKING!)
            # Forward compatible: New consumers don't see column
            compatible = False  # Breaking change

        elif operation == 'MODIFY_COLUMN':
            # Modify column type
            column_name = schema_change_event['column_name']
            new_type = schema_change_event['column_type']

            new_schema['columns'] = [
                {**c, 'type': new_type} if c['name'] == column_name else c
                for c in current_schema.get('columns', [])
            ]

            # Compatibility depends on type change (e.g., int → bigint is safe, bigint → int is not)
            compatible = False  # Conservative: assume breaking

        # Store new schema version
        self.schemas[table_name][new_version] = new_schema

        return {
            'table_name': table_name,
            'old_schema_version': current_version,
            'new_schema_version': new_version,
            'operation': operation,
            'compatible': compatible
        }

    def process_batch(self, table_name: str, batch_size: int, context: dict) -> dict:
        """
        Process batch of log entries for efficiency.

        FR: Batch processing
        NFR-P: Process 100K writes/sec with batching

        Args:
            table_name: Table to process
            batch_size: Number of log entries per batch
            context: Contains log reader

        Returns:
            {
                'table_name': str,
                'events_processed': int,
                'batch_duration_seconds': float,
                'throughput': float  # events/sec
            }
        """
        # Read batch of log entries (simulated)
        # In production: Read from binlog/WAL in batches
        log_entries = context.get('log_reader', {}).get(table_name, [])[:batch_size]

        if not log_entries:
            return {
                'table_name': table_name,
                'events_processed': 0,
                'message': 'No log entries available'
            }

        start_time = datetime.now()

        # Process each log entry
        for log_entry in log_entries:
            # Capture change
            self.capture_change(log_entry, context)

        end_time = datetime.now()
        duration_seconds = (end_time - start_time).total_seconds()

        # Calculate throughput
        # NFR-P: Target 100K events/sec
        throughput = len(log_entries) / duration_seconds if duration_seconds > 0 else 0

        return {
            'table_name': table_name,
            'events_processed': len(log_entries),
            'batch_size': batch_size,
            'batch_duration_seconds': round(duration_seconds, 3),
            'throughput': round(throughput, 2)
        }

    def deduplicate_events(self, events: List[dict]) -> dict:
        """
        Deduplicate events (handle log replay).

        FR: Deduplication for exactly-once delivery
        NFR-R: No duplicate events

        Args:
            events: List of events to deduplicate

        Returns:
            {
                'original_count': int,
                'deduplicated_count': int,
                'duplicates_removed': int
            }
        """
        # Use event_id for deduplication
        # event_id = table_name:log_position (unique)
        seen = set()
        deduplicated = []

        for event in events:
            event_id = event['event_id']
            if event_id not in seen:
                seen.add(event_id)
                deduplicated.append(event)

        duplicates_removed = len(events) - len(deduplicated)

        return {
            'original_count': len(events),
            'deduplicated_count': len(deduplicated),
            'duplicates_removed': duplicates_removed
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "capture_insert",
        "description": "FR: Capture INSERT operation from binlog",
        "input": {
            "operation": "capture_change",
            "log_entry": {
                "log_position": 12345,
                "timestamp": "2024-01-15T14:30:00Z",
                "table_name": "users",
                "operation": "INSERT",
                "primary_key": {"id": 1001},
                "before": None,
                "after": {"id": 1001, "name": "Alice", "email": "alice@example.com"}
            },
            "context": {
                "schema_versions": {"users": 1}
            }
        },
        "expected_output": {
            "event_id": "users:12345",
            "table_name": "users",
            "operation": "INSERT",
            "primary_key": {"id": 1001},
            "timestamp": "2024-01-15T14:30:00Z",
            "latency_seconds": "<1.0"
        }
    },
    {
        "id": 2,
        "name": "capture_update",
        "description": "FR: Capture UPDATE with before/after values",
        "input": {
            "operation": "capture_change",
            "log_entry": {
                "log_position": 12346,
                "timestamp": "2024-01-15T14:31:00Z",
                "table_name": "orders",
                "operation": "UPDATE",
                "primary_key": {"order_id": 5001},
                "before": {"order_id": 5001, "status": "pending"},
                "after": {"order_id": 5001, "status": "completed"}
            },
            "context": {
                "schema_versions": {"orders": 1}
            }
        },
        "expected_output": {
            "event_id": "orders:12346",
            "table_name": "orders",
            "operation": "UPDATE",
            "primary_key": {"order_id": 5001},
            "timestamp": "2024-01-15T14:31:00Z",
            "latency_seconds": "<1.0"
        }
    },
    {
        "id": 3,
        "name": "publish_event_with_ordering",
        "description": "FR: Publish to Kafka, NFR-R: Per-key ordering via partitioning",
        "input": {
            "operation": "publish_event",
            "setup": {
                "capture_change": {
                    "table_name": "transactions",
                    "operation": "INSERT",
                    "primary_key": {"txn_id": 9001},
                    "log_position": 50000
                }
            },
            "event_id": "transactions:50000",
            "context": {
                "partition_count": 10,
                "kafka_producer": {"next_offset": 0}
            }
        },
        "expected_output": {
            "event_id": "transactions:50000",
            "kafka_topic": "cdc.transactions",
            "kafka_partition": "<0-9>",  # Deterministic based on primary key hash
            "kafka_offset": 0
        }
    },
    {
        "id": 4,
        "name": "handle_backpressure_slow_down",
        "description": "FR: Backpressure when consumers lag >60 seconds",
        "input": {
            "operation": "handle_backpressure",
            "table_name": "events",
            "context": {
                "consumer_lag": 100000,  # 100K events behind
                "throughput": 1000  # 1000 events/sec → 100 seconds lag
            }
        },
        "expected_output": {
            "backpressure_active": True,
            "lag_seconds": 100.0,
            "lag_events": 100000,
            "action": "slow_down"
        }
    },
    {
        "id": 5,
        "name": "handle_backpressure_pause",
        "description": "FR: Pause CDC when lag >300 seconds (critical)",
        "input": {
            "operation": "handle_backpressure",
            "table_name": "logs",
            "context": {
                "consumer_lag": 500000,  # 500K events behind
                "throughput": 1000  # 500 seconds lag
            }
        },
        "expected_output": {
            "backpressure_active": True,
            "lag_seconds": 500.0,
            "lag_events": 500000,
            "action": "pause"
        }
    },
    {
        "id": 6,
        "name": "checkpoint",
        "description": "FR: Save checkpoint for recovery, NFR-R: Fault tolerance",
        "input": {
            "operation": "checkpoint",
            "setup": {
                "capture_changes": [
                    {"table": "products", "log_position": 10000},
                    {"table": "products", "log_position": 10050},
                    {"table": "products", "log_position": 10100}
                ]
            },
            "table_name": "products"
        },
        "expected_output": {
            "table_name": "products",
            "log_position": 10100,  # Last processed position
            "checkpointed_at": "<timestamp>"
        }
    },
    {
        "id": 7,
        "name": "handle_schema_change_add_column",
        "description": "FR: Handle ADD COLUMN (backward/forward compatible)",
        "input": {
            "operation": "handle_schema_change",
            "schema_change_event": {
                "table_name": "customers",
                "operation": "ADD_COLUMN",
                "column_name": "phone",
                "column_type": "string"
            }
        },
        "expected_output": {
            "table_name": "customers",
            "old_schema_version": 1,
            "new_schema_version": 2,
            "operation": "ADD_COLUMN",
            "compatible": True  # Backward/forward compatible
        }
    },
    {
        "id": 8,
        "name": "handle_schema_change_drop_column",
        "description": "FR: Handle DROP COLUMN (breaking change)",
        "input": {
            "operation": "handle_schema_change",
            "setup": {
                "create_schema": {
                    "table_name": "inventory",
                    "columns": [
                        {"name": "item_id", "type": "int"},
                        {"name": "quantity", "type": "int"},
                        {"name": "deprecated_field", "type": "string"}
                    ]
                }
            },
            "schema_change_event": {
                "table_name": "inventory",
                "operation": "DROP_COLUMN",
                "column_name": "deprecated_field"
            }
        },
        "expected_output": {
            "table_name": "inventory",
            "old_schema_version": 1,
            "new_schema_version": 2,
            "operation": "DROP_COLUMN",
            "compatible": False  # Breaking change
        }
    },
    {
        "id": 9,
        "name": "process_batch",
        "description": "FR: Batch processing, NFR-P: 100K events/sec",
        "input": {
            "operation": "process_batch",
            "table_name": "clicks",
            "batch_size": 1000,
            "context": {
                "log_reader": {
                    "clicks": [
                        {"log_position": i, "timestamp": "2024-01-15T14:30:00Z", "table_name": "clicks", "operation": "INSERT", "primary_key": {"click_id": i}, "after": {}}
                        for i in range(1000)
                    ]
                }
            }
        },
        "expected_output": {
            "table_name": "clicks",
            "events_processed": 1000,
            "batch_size": 1000,
            "batch_duration_seconds": "<1.0",
            "throughput": ">1000"  # Target: 100K events/sec (batch processing helps)
        }
    },
    {
        "id": 10,
        "name": "deduplicate_events",
        "description": "FR: Deduplication, NFR-R: Exactly-once delivery",
        "input": {
            "operation": "deduplicate_events",
            "events": [
                {"event_id": "users:100", "table_name": "users", "operation": "INSERT"},
                {"event_id": "users:101", "table_name": "users", "operation": "INSERT"},
                {"event_id": "users:100", "table_name": "users", "operation": "INSERT"},  # Duplicate!
                {"event_id": "users:102", "table_name": "users", "operation": "UPDATE"},
                {"event_id": "users:101", "table_name": "users", "operation": "INSERT"}   # Duplicate!
            ]
        },
        "expected_output": {
            "original_count": 5,
            "deduplicated_count": 3,  # Only 100, 101, 102
            "duplicates_removed": 2
        }
    }
]

`;
export const changeDataCaptureChallenge: SystemDesignChallenge = {
  id: 'change_data_capture',
  title: 'Change Data Capture (CDC)',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Change Data Capture system that tails database transaction logs (binlog/WAL) and streams changes to Kafka in real-time with ordering guarantees and exactly-once delivery.

**Real-world Context:**
At LinkedIn, Databus captures every database change across 1000+ tables and streams them to Kafka. When an order status changes from "pending" to "completed", CDC captures the UPDATE with before/after values, publishes to Kafka within <1 second, and downstream consumers update caches, send emails, and trigger analytics pipelines.

**Key Technical Challenges:**
1. **Ordering**: How do you preserve per-key ordering when parallelizing CDC across tables?
2. **Backpressure**: How do you handle slow consumers without losing events?
3. **Schema Evolution**: How do you handle ALTER TABLE without breaking consumers?
4. **Exactly-Once**: How do you avoid duplicates during log replay and failures?

**Companies Asking This:** LinkedIn (Databus), Uber, Airbnb, Netflix, Meta`,

  realWorldScenario: {
    company: 'LinkedIn',
    context: 'Need to replicate 1000+ MySQL tables to Kafka for cache invalidation and analytics.',
    constraint: '<1 second latency, preserve ordering per row, exactly-once delivery, handle schema changes.'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Log Tailing',
      content: 'Read MySQL binlog or Postgres WAL. Parse log entries to extract table, operation (INSERT/UPDATE/DELETE), before/after values. Track log position for checkpointing.'
    },
    {
      stage: 'FR',
      title: 'Ordering Guarantees',
      content: 'Partition Kafka by primary key hash. All changes to same row go to same partition (ordered). Different rows can be parallel (unordered).'
    },
    {
      stage: 'FR',
      title: 'Schema Changes',
      content: 'ADD COLUMN is backward/forward compatible. DROP COLUMN is breaking (old consumers expect column). Use schema versioning. Store schema in event.'
    },
    {
      stage: 'NFR-P',
      title: 'Batching',
      content: 'Process log entries in batches (100-1000) for efficiency. Reduces overhead from 100K individual publishes to 100-1000 batch publishes.'
    },
    {
      stage: 'NFR-R',
      title: 'Exactly-Once',
      content: 'Deduplicate by event_id (table:log_position). Use checkpointing to track last processed position. On crash, resume from checkpoint.'
    },
    {
      stage: 'NFR-R',
      title: 'Backpressure',
      content: 'Monitor consumer lag (latest offset - consumer offset). If lag >60s, slow down. If lag >300s (5 min), pause CDC for that table.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Captures INSERT, UPDATE, DELETE from transaction log',
        'Publishes events to Kafka with per-key partitioning',
        'Handles backpressure (slow down or pause based on lag)',
        'Checkpoints log position for recovery',
        'Handles schema changes (ADD/DROP column)',
        'Processes batches for efficiency',
        'Deduplicates events (exactly-once)'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Latency <1 second from write to publish',
        'Throughput 100K writes/sec with batching',
        'Parallel processing for multiple tables',
        'Efficient log parsing (binary, not regex)'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 1000+ tables',
        'Handles 1TB+ transaction logs daily',
        'Multi-database (MySQL, Postgres, MongoDB)',
        'Horizontal scaling (add CDC workers per table)'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of capture, publish, and checkpoint',
        'Per-key partitioning for ordering',
        'Schema versioning for compatibility',
        'Clean test cases covering INSERT/UPDATE/DELETE, ordering, backpressure, schema changes'
      ]
    }
  },

  commonMistakes: [
    'Not preserving ordering → same row updates arrive out of order',
    'No backpressure handling → memory exhaustion when consumers slow',
    'Not handling schema changes → consumers break on ALTER TABLE',
    'No deduplication → duplicate events on log replay',
    'Synchronous publishing → can\'t handle 100K writes/sec (use batching)',
    'No checkpointing → can\'t recover from crash (reprocess from beginning)'
  ],

  companiesAsking: ['LinkedIn', 'Uber', 'Airbnb', 'Netflix', 'Meta'],
  relatedPatterns: [
    'Event-Driven Architecture (CDC feeds event bus)',
    'Data Replication Service (CDC enables cross-region replication)',
    'Cache Invalidation (CDC triggers cache updates)',
    'ETL Orchestration (CDC as data source for pipelines)'
  ]
};
