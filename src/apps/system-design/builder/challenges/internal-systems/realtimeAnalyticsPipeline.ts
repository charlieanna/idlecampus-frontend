/**
 * L4-L5 Internal Systems: Real-time Analytics Pipeline
 *
 * Design a stream processing system for real-time analytics with windowing,
 * late data handling, and exactly-once semantics.
 * Similar to Uber AthenaX, LinkedIn Samza, or Apache Flink.
 *
 * Real-world examples:
 * - Uber AthenaX: Real-time analytics on trip/payment streams
 * - LinkedIn Samza: Stream processing for metrics, feeds
 * - Netflix: Real-time video quality monitoring
 * - Airbnb: Real-time pricing and demand forecasting
 *
 * Companies: Uber, LinkedIn, Netflix, Airbnb, Twitter
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Data Infrastructure & Analytics
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Stream Ingestion
 *    - Consume from Kafka (1M events/sec)
 *    - Schema validation (reject malformed events)
 *    - Partitioning by key (user_id, session_id)
 *    - Backpressure handling (slow down producers)
 *
 * 2. Windowing
 *    - Tumbling windows (non-overlapping: 1 min, 5 min, 1 hour)
 *    - Sliding windows (overlapping: 5 min window, 1 min slide)
 *    - Session windows (timeout-based: 30 min inactivity)
 *    - Window triggers: time, count, or punctuation
 *
 * 3. Late Data Handling
 *    - Watermarks (track event-time progress)
 *    - Allowed lateness (accept events up to 10 min late)
 *    - Late data side outputs (route to separate stream)
 *    - Window updates (re-emit results when late data arrives)
 *
 * 4. State Management
 *    - Stateful operations (count, sum, avg, join)
 *    - Checkpointing (every 1 minute for fault tolerance)
 *    - State backend: RocksDB for large state (>100GB)
 *    - State TTL (expire old state after 24 hours)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - End-to-end latency: p99 <10 seconds (event-time to output)
 * - Throughput: 1M events/sec
 * - Checkpoint latency: <30 seconds
 * - State read: <1ms (RocksDB)
 *
 * Scalability (NFR-S):
 * - 1000 streaming jobs
 * - 10TB state per job
 * - 100 parallel workers per job
 * - 1 trillion events/day
 *
 * Reliability (NFR-R):
 * - Exactly-once semantics (no duplicates, no data loss)
 * - Fault tolerance: recover from worker failures in <2 min
 * - Data retention: 7 days in Kafka
 * - SLA: 99.9% uptime
 *
 * Cost (NFR-C):
 * - Infrastructure: $100K/month (Kafka, Flink, RocksDB, S3)
 * - Storage: $20K/month (checkpoints, state)
 * - Network: $10K/month (cross-AZ traffic)
 */

const pythonTemplate = `"""
Real-time Analytics Pipeline - Reference Implementation

Architecture:
1. Stream Source (Kafka consumer with backpressure)
2. Window Operator (tumbling, sliding, session windows)
3. State Manager (RocksDB for stateful operations)
4. Watermark Generator (track event-time progress)

Key concepts:
- Watermark: Estimate of "how complete" data is (event_time - max_lateness)
- Exactly-once: Kafka transactions + checkpointing
- Late data: Accept events within allowed lateness window
- Windowing: Time-based aggregations (tumbling, sliding, session)
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import time
from collections import defaultdict

def create_streaming_job(job_config: dict, context: dict) -> dict:
    """
    Create a real-time analytics streaming job.

    Args:
        job_config: {
            'name': 'pageview_analytics',
            'source': {
                'type': 'kafka',
                'topic': 'pageviews',
                'consumer_group': 'analytics_v1'
            },
            'window': {
                'type': 'tumbling',  # tumbling, sliding, session
                'size_minutes': 5,
                'allowed_lateness_minutes': 10
            },
            'aggregation': {
                'keys': ['user_id', 'page'],
                'metrics': ['count', 'sum_duration']
            },
            'sink': {
                'type': 'kafka',
                'topic': 'pageview_metrics'
            },
            'parallelism': 10
        }
        context: {
            'kafka': Kafka client,
            'state_backend': RocksDB,
            'checkpoint_storage': S3
        }

    Returns:
        {
            'job_id': 'job_123',
            'status': 'running',
            'parallelism': 10,
            'checkpointing_enabled': True
        }

    Test cases covered:
    - TC1: Create streaming job with windowing
    - TC4: Exactly-once semantics with checkpointing
    """
    job_id = f"job_{int(time.time() * 1000)}"

    # Create Kafka consumer
    consumer = context['kafka'].create_consumer(
        topic=job_config['source']['topic'],
        group_id=job_config['source']['consumer_group'],
        enable_auto_commit=False  # For exactly-once
    )

    # Initialize state backend (RocksDB)
    state_backend = context['state_backend'].create_store(
        name=f"{job_id}_state",
        ttl_hours=24  # Expire old state after 24 hours
    )

    # Create job record
    context['db'].execute("""
        INSERT INTO streaming_jobs
        (id, name, source, window, aggregation, sink, parallelism, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        job_id,
        job_config['name'],
        job_config['source'],
        job_config['window'],
        job_config['aggregation'],
        job_config['sink'],
        job_config['parallelism'],
        'running',
        datetime.now()
    )

    # Start workers (parallel processing)
    for worker_id in range(job_config['parallelism']):
        context['scheduler'].start_worker(
            function=stream_processing_worker,
            args={
                'job_id': job_id,
                'worker_id': worker_id,
                'job_config': job_config
            }
        )

    # Enable checkpointing (every 1 minute)
    context['scheduler'].schedule_recurring(
        function=checkpoint_job_state,
        args={'job_id': job_id},
        interval_seconds=60
    )

    return {
        'job_id': job_id,
        'status': 'running',
        'parallelism': job_config['parallelism'],
        'checkpointing_enabled': True,
        'checkpoint_interval_seconds': 60
    }


def stream_processing_worker(job_id: str, worker_id: int, job_config: dict, context: dict):
    """
    Worker loop for processing stream events.

    Args:
        job_id: Job ID
        worker_id: Worker ID (0 to parallelism-1)
        job_config: Job configuration
        context: Runtime context
    """
    consumer = context['kafka'].get_consumer(job_id, worker_id)
    state_backend = context['state_backend'].get_store(f"{job_id}_state")
    watermark_tracker = WatermarkTracker()

    while True:
        # Poll events from Kafka
        events = consumer.poll(timeout_ms=1000, max_records=1000)

        if not events:
            continue

        # Process each event
        for event in events:
            # Parse event
            event_data = parse_event(event.value)
            event_time = datetime.fromtimestamp(event_data['timestamp'])

            # Update watermark (track event-time progress)
            watermark_tracker.update(event_time)
            current_watermark = watermark_tracker.get_watermark()

            # Check if event is late
            allowed_lateness = timedelta(minutes=job_config['window']['allowed_lateness_minutes'])
            if event_time < current_watermark - allowed_lateness:
                # Event is too late, route to late data side output
                context['kafka'].send(
                    topic=f"{job_config['sink']['topic']}_late",
                    value=event_data
                )
                continue

            # Apply windowing
            window = assign_to_window(event_time, job_config['window'])

            # Update state (stateful aggregation)
            update_window_state(window, event_data, job_config['aggregation'], state_backend, context)

            # Trigger window emission if watermark passed window end
            if current_watermark >= window['end']:
                emit_window_result(window, job_config, state_backend, context)

        # Commit offsets (exactly-once)
        consumer.commit()


def assign_to_window(event_time: datetime, window_config: dict) -> dict:
    """
    Assign event to window based on event time.

    Args:
        event_time: Event timestamp
        window_config: Window configuration

    Returns:
        {
            'type': 'tumbling',
            'start': datetime,
            'end': datetime
        }

    Test cases covered:
    - TC2: Tumbling window assignment
    - TC3: Sliding window with overlaps
    """
    window_type = window_config['type']

    if window_type == 'tumbling':
        # Non-overlapping fixed-size windows
        size_seconds = window_config['size_minutes'] * 60
        window_start_ts = (event_time.timestamp() // size_seconds) * size_seconds
        window_start = datetime.fromtimestamp(window_start_ts)
        window_end = window_start + timedelta(seconds=size_seconds)

        return {
            'type': 'tumbling',
            'start': window_start,
            'end': window_end,
            'key': f"{window_start.isoformat()}"
        }

    elif window_type == 'sliding':
        # Overlapping windows (event belongs to multiple windows)
        window_size = window_config['size_minutes'] * 60
        slide_size = window_config['slide_minutes'] * 60

        windows = []
        # Calculate all windows this event belongs to
        current_window_start_ts = (event_time.timestamp() // slide_size) * slide_size

        # Look back to find all overlapping windows
        for i in range(int(window_size / slide_size)):
            window_start_ts = current_window_start_ts - (i * slide_size)
            window_start = datetime.fromtimestamp(window_start_ts)
            window_end = window_start + timedelta(seconds=window_size)

            if window_start <= event_time < window_end:
                windows.append({
                    'type': 'sliding',
                    'start': window_start,
                    'end': window_end,
                    'key': f"{window_start.isoformat()}"
                })

        return windows if len(windows) > 1 else windows[0]

    elif window_type == 'session':
        # Dynamic windows based on inactivity gap
        gap_minutes = window_config.get('gap_minutes', 30)
        # Session window logic (simplified - in production, use Flink's session windows)
        return {
            'type': 'session',
            'start': event_time,
            'end': event_time + timedelta(minutes=gap_minutes),
            'key': f"session_{event_time.isoformat()}"
        }


def update_window_state(window: dict, event_data: dict, aggregation: dict, state_backend, context: dict):
    """
    Update stateful aggregation for window.

    Args:
        window: Window assignment
        event_data: Event data
        aggregation: Aggregation config
        state_backend: RocksDB state store
        context: Runtime context

    Test cases covered:
    - TC1: Stateful count aggregation
    - TC5: State read <1ms (RocksDB)
    """
    # Build state key
    key_parts = [str(event_data[k]) for k in aggregation['keys']]
    state_key = f"{window['key']}:{':'.join(key_parts)}"

    # Read current state
    current_state = state_backend.get(state_key) or {
        'count': 0,
        'sum_duration': 0
    }

    # Update aggregations
    current_state['count'] += 1
    current_state['sum_duration'] += event_data.get('duration', 0)
    current_state['last_updated'] = datetime.now().isoformat()

    # Write back to state
    state_backend.put(state_key, current_state)


def emit_window_result(window: dict, job_config: dict, state_backend, context: dict):
    """
    Emit window aggregation result when window closes.

    Args:
        window: Window to emit
        job_config: Job configuration
        state_backend: State store
        context: Runtime context
    """
    # Get all state for this window
    window_prefix = f"{window['key']}:"
    window_states = state_backend.scan_prefix(window_prefix)

    # Emit results
    for state_key, state_value in window_states.items():
        # Parse key to extract group-by dimensions
        key_parts = state_key.replace(window_prefix, '').split(':')
        keys = dict(zip(job_config['aggregation']['keys'], key_parts))

        result = {
            'window_start': window['start'].isoformat(),
            'window_end': window['end'].isoformat(),
            **keys,
            'count': state_value['count'],
            'sum_duration': state_value['sum_duration'],
            'avg_duration': state_value['sum_duration'] / state_value['count'] if state_value['count'] > 0 else 0
        }

        # Send to sink
        context['kafka'].send(
            topic=job_config['sink']['topic'],
            value=result
        )

    # Clean up state for closed window (optional, or rely on TTL)
    state_backend.delete_prefix(window_prefix)


class WatermarkTracker:
    """
    Track watermark (event-time progress) for late data handling.

    Watermark = max_event_time - max_out_of_order_time
    """

    def __init__(self, max_out_of_order_seconds: int = 60):
        self.max_event_time = datetime.min
        self.max_out_of_order = timedelta(seconds=max_out_of_order_seconds)

    def update(self, event_time: datetime):
        """Update watermark based on new event."""
        if event_time > self.max_event_time:
            self.max_event_time = event_time

    def get_watermark(self) -> datetime:
        """Get current watermark."""
        return self.max_event_time - self.max_out_of_order


def checkpoint_job_state(job_id: str, context: dict) -> dict:
    """
    Checkpoint job state for fault tolerance.

    Checkpoint includes:
    - Kafka offsets (for exactly-once)
    - RocksDB state snapshot
    - Watermark position

    Args:
        job_id: Job to checkpoint
        context: Runtime context

    Returns:
        {
            'checkpoint_id': 'ckpt_123',
            'state_size_mb': 150,
            'duration_seconds': 12
        }

    Test cases covered:
    - TC4: Checkpoint latency <30s (NFR-P)
    - TC6: Fault tolerance (recover from checkpoint)
    """
    start_time = time.time()

    checkpoint_id = f"ckpt_{job_id}_{int(time.time() * 1000)}"

    # 1. Get Kafka offsets
    consumers = context['kafka'].get_consumers(job_id)
    offsets = {}
    for worker_id, consumer in consumers.items():
        offsets[worker_id] = consumer.position()

    # 2. Snapshot RocksDB state
    state_backend = context['state_backend'].get_store(f"{job_id}_state")
    snapshot_path = f"s3://checkpoints/{job_id}/{checkpoint_id}/state"
    state_size_mb = state_backend.create_snapshot(snapshot_path)

    # 3. Save checkpoint metadata
    checkpoint_data = {
        'checkpoint_id': checkpoint_id,
        'job_id': job_id,
        'offsets': offsets,
        'state_snapshot_path': snapshot_path,
        'state_size_mb': state_size_mb,
        'timestamp': datetime.now().isoformat()
    }

    context['checkpoint_storage'].save(checkpoint_id, checkpoint_data)

    duration_seconds = time.time() - start_time

    return {
        'checkpoint_id': checkpoint_id,
        'state_size_mb': state_size_mb,
        'duration_seconds': duration_seconds
    }


def recover_from_checkpoint(job_id: str, checkpoint_id: str, context: dict) -> dict:
    """
    Recover streaming job from checkpoint after failure.

    Args:
        job_id: Job to recover
        checkpoint_id: Checkpoint to restore from
        context: Runtime context

    Returns:
        {
            'job_id': 'job_123',
            'checkpoint_id': 'ckpt_456',
            'recovery_time_seconds': 45,
            'offsets_restored': {...}
        }

    Test cases covered:
    - TC6: Recover from worker failure in <2 min
    """
    start_time = time.time()

    # Load checkpoint metadata
    checkpoint_data = context['checkpoint_storage'].load(checkpoint_id)

    # 1. Restore Kafka offsets
    for worker_id, offsets in checkpoint_data['offsets'].items():
        consumer = context['kafka'].get_consumer(job_id, worker_id)
        consumer.seek(offsets)

    # 2. Restore RocksDB state
    state_backend = context['state_backend'].get_store(f"{job_id}_state")
    state_backend.restore_snapshot(checkpoint_data['state_snapshot_path'])

    # 3. Restart workers
    job_config = context['db'].query(
        "SELECT * FROM streaming_jobs WHERE id = ?",
        job_id
    )[0]

    for worker_id in range(job_config['parallelism']):
        context['scheduler'].start_worker(
            function=stream_processing_worker,
            args={
                'job_id': job_id,
                'worker_id': worker_id,
                'job_config': job_config
            }
        )

    recovery_time = time.time() - start_time

    return {
        'job_id': job_id,
        'checkpoint_id': checkpoint_id,
        'recovery_time_seconds': recovery_time,
        'offsets_restored': checkpoint_data['offsets']
    }


def parse_event(raw_event: bytes) -> dict:
    """Parse and validate event schema."""
    import json
    event = json.loads(raw_event)

    # Validate required fields
    required_fields = ['user_id', 'page', 'timestamp']
    for field in required_fields:
        if field not in event:
            raise ValueError(f"Missing required field: {field}")

    return event


# Example usage
if __name__ == "__main__":
    context = {
        'kafka': MockKafka(),
        'state_backend': MockRocksDB(),
        'checkpoint_storage': MockS3(),
        'db': MockDatabase(),
        'scheduler': MockScheduler()
    }

    # Create streaming job
    job = create_streaming_job({
        'name': 'pageview_analytics',
        'source': {
            'type': 'kafka',
            'topic': 'pageviews',
            'consumer_group': 'analytics_v1'
        },
        'window': {
            'type': 'tumbling',
            'size_minutes': 5,
            'allowed_lateness_minutes': 10
        },
        'aggregation': {
            'keys': ['user_id', 'page'],
            'metrics': ['count', 'sum_duration']
        },
        'sink': {
            'type': 'kafka',
            'topic': 'pageview_metrics'
        },
        'parallelism': 10
    }, context)

    print(f"Job created: {job['job_id']}")
    print(f"Parallelism: {job['parallelism']}")
    print(f"Checkpointing: {job['checkpointing_enabled']}")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Create streaming job with tumbling windows',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

job = create_streaming_job({
    'name': 'click_analytics',
    'source': {
        'type': 'kafka',
        'topic': 'clicks',
        'consumer_group': 'analytics'
    },
    'window': {
        'type': 'tumbling',
        'size_minutes': 1,
        'allowed_lateness_minutes': 5
    },
    'aggregation': {
        'keys': ['campaign_id'],
        'metrics': ['count']
    },
    'sink': {
        'type': 'kafka',
        'topic': 'click_counts'
    },
    'parallelism': 5
}, context)

print(job['status'])
print(job['parallelism'])
print(job['checkpointing_enabled'])`,
    expectedOutput: `running
5
True`,
    hints: [
      'Create Kafka consumer with exactly-once semantics (disable auto-commit)',
      'Initialize RocksDB state backend with TTL',
      'Start parallel workers for processing',
      'Enable checkpointing every 60 seconds',
      'Store job metadata in database'
    ],
    testCode: `assert job['status'] == 'running'
assert job['parallelism'] == 5
assert job['checkpointing_enabled'] == True`,
    timeComplexity: 'O(P) where P = parallelism (number of workers)',
    spaceComplexity: 'O(S) where S = state size',
    learningObjectives: [
      'Design streaming job architecture',
      'Understand windowing and checkpointing',
      'Learn Kafka exactly-once semantics'
    ]
  },
  {
    id: 2,
    name: 'Tumbling window assignment',
    difficulty: 'easy',
    category: 'FR',
    input: `# Event at 10:03:47
event_time = datetime(2024, 1, 15, 10, 3, 47)

window = assign_to_window(event_time, {
    'type': 'tumbling',
    'size_minutes': 5
})

print(window['start'])
print(window['end'])
print((window['end'] - window['start']).total_seconds() / 60)  # Should be 5 minutes`,
    expectedOutput: `2024-01-15 10:00:00
2024-01-15 10:05:00
5.0`,
    hints: [
      'Round down event time to nearest window boundary',
      'Tumbling windows are non-overlapping',
      'Window size determines boundary alignment',
      'Each event belongs to exactly one tumbling window',
      'Use floor division for timestamp alignment'
    ],
    testCode: `assert window['start'] == datetime(2024, 1, 15, 10, 0, 0)
assert window['end'] == datetime(2024, 1, 15, 10, 5, 0)
assert (window['end'] - window['start']).total_seconds() == 300`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Understand tumbling window semantics',
      'Learn window boundary calculation',
      'Implement time-based bucketing'
    ]
  },
  {
    id: 3,
    name: 'Sliding window with overlaps',
    difficulty: 'medium',
    category: 'FR',
    input: `# Event at 10:03:00
event_time = datetime(2024, 1, 15, 10, 3, 0)

windows = assign_to_window(event_time, {
    'type': 'sliding',
    'size_minutes': 5,  # 5-minute window
    'slide_minutes': 1  # Slide every 1 minute
})

# Event should belong to 5 windows:
# [09:59-10:04], [10:00-10:05], [10:01-10:06], [10:02-10:07], [10:03-10:08]

print(len(windows))
print(windows[0]['start'])
print(windows[4]['start'])`,
    expectedOutput: `5
2024-01-15 09:59:00
2024-01-15 10:03:00`,
    hints: [
      'Sliding windows overlap (event belongs to multiple windows)',
      'Number of windows = window_size / slide_size',
      'Calculate all overlapping windows event belongs to',
      'Use lookback to find window boundaries',
      'Return list of windows for sliding type'
    ],
    testCode: `assert len(windows) == 5
assert windows[0]['start'] == datetime(2024, 1, 15, 9, 59, 0)
assert windows[4]['start'] == datetime(2024, 1, 15, 10, 3, 0)`,
    timeComplexity: 'O(W) where W = window_size / slide_size',
    spaceComplexity: 'O(W)',
    learningObjectives: [
      'Understand sliding window semantics',
      'Handle overlapping window assignments',
      'Calculate window membership efficiently'
    ]
  },
  {
    id: 4,
    name: 'Checkpoint with <30s latency (NFR-P)',
    difficulty: 'hard',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Create job with state
job = create_streaming_job({...}, context)

# Simulate state (10GB)
state_backend = context['state_backend'].get_store(f"{job['job_id']}_state")
for i in range(100000):
    state_backend.put(f"key_{i}", {'count': i, 'sum': i * 10})

# Perform checkpoint
import time
start = time.time()
checkpoint = checkpoint_job_state(job['job_id'], context)
duration = time.time() - start

print(f"State size: {checkpoint['state_size_mb']:.0f}MB")
print(f"Checkpoint duration: {duration:.1f}s")
print(duration < 30)  # Must be <30s`,
    expectedOutput: `State size: 150MB
Checkpoint duration: 12.3s
True`,
    hints: [
      'Use RocksDB incremental snapshots (not full copy)',
      'Checkpoint Kafka offsets (for exactly-once)',
      'Upload snapshot to S3 in parallel',
      'Must complete in <30 seconds (NFR-P)',
      'Continue processing during checkpoint (async)'
    ],
    testCode: `assert checkpoint['duration_seconds'] < 30  # NFR-P
assert checkpoint['state_size_mb'] > 0`,
    timeComplexity: 'O(S) where S = state size (incremental)',
    spaceComplexity: 'O(S)',
    learningObjectives: [
      'Implement fast checkpointing for fault tolerance',
      'Understand exactly-once semantics',
      'Meet <30s checkpoint latency requirement'
    ]
  },
  {
    id: 5,
    name: 'Late data handling with watermarks',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

watermark_tracker = WatermarkTracker(max_out_of_order_seconds=60)

# Update watermark with on-time events
watermark_tracker.update(datetime(2024, 1, 15, 10, 5, 0))
watermark_tracker.update(datetime(2024, 1, 15, 10, 6, 0))
watermark_tracker.update(datetime(2024, 1, 15, 10, 7, 0))

current_watermark = watermark_tracker.get_watermark()

# Check if event is late
late_event_time = datetime(2024, 1, 15, 10, 3, 0)  # 4 minutes late
allowed_lateness = timedelta(minutes=10)

is_too_late = late_event_time < current_watermark - allowed_lateness

print(current_watermark)
print(is_too_late)  # Should be False (within 10 min allowed lateness)`,
    expectedOutput: `2024-01-15 10:06:00
False`,
    hints: [
      'Watermark = max_event_time - max_out_of_order',
      'Accept events within allowed_lateness window',
      'Route late events to side output stream',
      'Update window results when late data arrives',
      'Prevent unbounded state growth with allowed lateness'
    ],
    testCode: `assert current_watermark == datetime(2024, 1, 15, 10, 6, 0)
assert is_too_late == False`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Understand watermark concept for event-time processing',
      'Handle late-arriving data',
      'Balance completeness vs latency'
    ]
  },
  {
    id: 6,
    name: 'Fault tolerance: recover from checkpoint in <2 min (NFR-R)',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Create and checkpoint job
job = create_streaming_job({...}, context)
checkpoint = checkpoint_job_state(job['job_id'], context)

# Simulate worker failure
context['scheduler'].kill_all_workers(job['job_id'])

# Recover from checkpoint
import time
start = time.time()
recovery = recover_from_checkpoint(job['job_id'], checkpoint['checkpoint_id'], context)
recovery_time = time.time() - start

print(f"Recovery time: {recovery_time:.1f}s")
print(recovery_time < 120)  # Must be <2 minutes
print(recovery['offsets_restored'] is not None)`,
    expectedOutput: `Recovery time: 45.2s
True
True`,
    hints: [
      'Restore Kafka offsets from checkpoint',
      'Load RocksDB snapshot from S3',
      'Restart workers in parallel',
      'Must complete in <2 minutes (NFR-R)',
      'Resume processing from last checkpoint'
    ],
    testCode: `assert recovery['recovery_time_seconds'] < 120  # <2 min
assert recovery['offsets_restored'] is not None`,
    timeComplexity: 'O(S) where S = state size to restore',
    spaceComplexity: 'O(S)',
    learningObjectives: [
      'Implement fault tolerance with checkpoints',
      'Recover from worker failures',
      'Meet <2 min recovery time requirement'
    ]
  },
  {
    id: 7,
    name: 'Scale: 1M events/sec throughput (NFR-S)',
    difficulty: 'hard',
    category: 'NFR-S',
    input: `context = setup_mock_context()

# Create job with high parallelism
job = create_streaming_job({
    'name': 'high_throughput_analytics',
    'source': {'type': 'kafka', 'topic': 'events', 'consumer_group': 'analytics'},
    'window': {'type': 'tumbling', 'size_minutes': 1, 'allowed_lateness_minutes': 5},
    'aggregation': {'keys': ['user_id'], 'metrics': ['count']},
    'sink': {'type': 'kafka', 'topic': 'metrics'},
    'parallelism': 100  # High parallelism
}, context)

# Simulate processing 1M events
import time
start = time.time()

events_processed = 0
for batch in range(1000):  # 1000 batches of 1000 events
    # Each worker processes events in parallel
    events_processed += 1000

duration = time.time() - start
throughput = events_processed / duration

print(f"Events processed: {events_processed}")
print(f"Throughput: {throughput:.0f} events/sec")
print(throughput >= 1_000_000)  # Must handle 1M events/sec`,
    expectedOutput: `Events processed: 1000000
Throughput: 1250000 events/sec
True`,
    hints: [
      'Use high parallelism (100 workers)',
      'Partition Kafka topic for parallel consumption',
      'Use RocksDB for high-throughput state access',
      'Batch processing (1000 events per poll)',
      'Meet 1M events/sec throughput (NFR-S)'
    ],
    testCode: `assert events_processed == 1_000_000
assert throughput >= 1_000_000`,
    timeComplexity: 'O(N/P) where N = events, P = parallelism',
    spaceComplexity: 'O(S) where S = state size',
    learningObjectives: [
      'Scale stream processing to 1M events/sec',
      'Optimize throughput with parallelism',
      'Learn partitioning and batching strategies'
    ]
  }
];

export const realtimeAnalyticsPipelineChallenge: SystemDesignChallenge = {
  id: 'realtime_analytics_pipeline',
  title: 'Real-time Analytics Pipeline',
  difficulty: 'advanced',
  category: 'Data Infrastructure & Analytics',
  description: `Design a stream processing system for real-time analytics with windowing, late data handling, and exactly-once semantics. Similar to Uber AthenaX, LinkedIn Samza, or Apache Flink.

**Real-world Context:**
- Uber AthenaX: Real-time analytics on trip, payment, and marketplace streams
- LinkedIn Samza: Stream processing for metrics, feeds, and recommendations
- Netflix: Real-time video quality monitoring and anomaly detection
- Airbnb: Real-time pricing, demand forecasting, and fraud detection

**Key Concepts:**
- Windowing: Tumbling (non-overlapping), Sliding (overlapping), Session (timeout-based)
- Watermarks: Track event-time progress, handle out-of-order events
- Late data: Accept events within allowed lateness (10 min), route late data to side output
- Exactly-once: Kafka transactions + checkpointing every 60s
- Stateful operations: Count, sum, avg, join with RocksDB state backend

**Scale:**
- 1M events/sec throughput
- 10TB state per job
- 100 parallel workers
- p99 <10s end-to-end latency

**Companies:** Uber, LinkedIn, Netflix, Airbnb, Twitter
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Use Kafka for durable, scalable event ingestion',
    'Implement tumbling windows by rounding event time to boundaries',
    'Sliding windows: event belongs to multiple overlapping windows',
    'Watermark = max_event_time - max_out_of_order_time',
    'Accept late events within allowed_lateness, route others to side output',
    'Checkpoint every 60s: Kafka offsets + RocksDB snapshot to S3',
    'Use RocksDB for stateful aggregations (count, sum, avg)',
    'Exactly-once: disable auto-commit, use Kafka transactions'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Uber: Real-time surge pricing based on supply/demand streams',
    'LinkedIn: Real-time metrics for feed engagement and viral detection',
    'Netflix: Video quality monitoring (rebuffer rate, startup time)',
    'Airbnb: Real-time fraud detection on booking streams',
    'Twitter: Trending topics calculated from tweet streams with tumbling windows'
  ],
  relatedChallenges: [
    'metrics_aggregation_service',
    'etl_orchestration',
    'log_aggregation',
    'distributed_tracing'
  ]
};
