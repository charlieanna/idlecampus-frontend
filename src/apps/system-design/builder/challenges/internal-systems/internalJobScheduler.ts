/**
 * L4-L5 Internal Systems: Internal Job Scheduler
 *
 * Design a distributed job scheduler for batch jobs, cron tasks, and DAG workflows
 * with resource allocation, priorities, and preemption.
 * Similar to Google Borg, Kubernetes Jobs, Apache Airflow, or AWS Batch.
 *
 * Real-world examples:
 * - Google Borg: Cluster management for batch and serving jobs
 * - Kubernetes Jobs/CronJobs: Container orchestration for batch workloads
 * - Apache Airflow: Workflow scheduler for data pipelines
 * - AWS Batch: Managed batch computing service
 *
 * Companies: Google, Amazon, Uber, Airbnb, Netflix
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Developer Tools & Platforms
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Job Submission
 *    - Submit jobs (one-time, recurring cron, DAG workflows)
 *    - Resource requirements (CPU, memory, GPU)
 *    - Priority levels (P0-critical, P1-high, P2-normal, P3-low)
 *    - Dependencies (job B runs after job A succeeds)
 *
 * 2. Resource Allocation
 *    - Bin packing: fit jobs onto available machines
 *    - Resource quotas: per-team limits (1000 CPU cores, 2TB RAM)
 *    - Oversubscription: allow jobs to use idle resources
 *    - Affinity/anti-affinity: co-locate or separate jobs
 *
 * 3. Scheduling Policies
 *    - FIFO (First In First Out)
 *    - Priority-based: P0 jobs preempt P3 jobs
 *    - Fair-share: equal CPU time per team
 *    - Gang scheduling: all-or-nothing for multi-task jobs
 *
 * 4. Job Lifecycle
 *    - Pending → Running → Succeeded/Failed
 *    - Retries with exponential backoff (max 3 retries)
 *    - Timeout enforcement (kill after 24 hours)
 *    - Preemption: kill low-priority jobs for high-priority
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Scheduling latency: <1 second (job submit → running)
 * - Throughput: 10,000 jobs/second
 * - Resource utilization: >80% (minimize idle resources)
 * - Preemption time: <10 seconds
 *
 * Scalability (NFR-S):
 * - 10,000 machines in cluster
 * - 1M jobs running concurrently
 * - 100K jobs submitted/hour
 * - 1000 teams with quotas
 *
 * Reliability (NFR-R):
 * - Scheduler availability: 99.99%
 * - Job success rate: >95% (with retries)
 * - No resource leaks (clean up after job failure)
 * - Fair scheduling: no starvation
 *
 * Cost (NFR-C):
 * - Infrastructure: $50K/month (scheduler, etcd, metrics)
 * - Compute: $500K/month (actual job execution)
 * - Optimize for utilization (reduce idle capacity)
 */

const pythonTemplate = `"""
Internal Job Scheduler - Reference Implementation

Architecture:
1. Job Queue (priority queue with preemption)
2. Resource Manager (track available CPU/memory per machine)
3. Scheduler (bin packing algorithm for placement)
4. Executor (run jobs on machines via K8s/Docker)

Key concepts:
- Bin packing: First-fit, best-fit, worst-fit algorithms
- Preemption: Kill low-priority jobs to make room
- Gang scheduling: All tasks start together or none start
- Resource quotas: Per-team limits with borrowing
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import time
from enum import Enum
import heapq

class JobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    PREEMPTED = "preempted"


class Priority(Enum):
    P0_CRITICAL = 0  # Highest
    P1_HIGH = 1
    P2_NORMAL = 2
    P3_LOW = 3  # Lowest


def submit_job(job_config: dict, context: dict) -> dict:
    """
    Submit a job for scheduling.

    Args:
        job_config: {
            'name': 'daily-report',
            'type': 'batch',  # batch, cron, dag
            'command': 'python report.py',
            'resources': {
                'cpu': 4,  # cores
                'memory': 8192,  # MB
                'gpu': 0
            },
            'priority': 'P2_NORMAL',
            'team': 'analytics',
            'timeout_minutes': 60,
            'retries': 3,
            'cron_schedule': '0 9 * * *',  # Optional: daily at 9am
            'dependencies': []  # Optional: job IDs this job depends on
        }
        context: {
            'db': Database,
            'queue': Priority queue,
            'resource_manager': Resource tracker
        }

    Returns:
        {
            'job_id': 'job_123',
            'status': 'pending',
            'queued_at': '2024-01-15T10:00:00Z',
            'estimated_wait_seconds': 30
        }

    Test cases covered:
    - TC1: Submit job and queue for scheduling
    - TC4: Resource quota enforcement
    """
    job_id = f"job_{int(time.time() * 1000)}"

    # Check team quota
    team = job_config['team']
    quota = context['db'].query(
        "SELECT * FROM team_quotas WHERE team = ?",
        team
    )[0]

    current_usage = context['resource_manager'].get_team_usage(team)

    # Check if submission exceeds quota
    if current_usage['cpu'] + job_config['resources']['cpu'] > quota['cpu_limit']:
        raise ValueError(f"Team {team} would exceed CPU quota ({quota['cpu_limit']} cores)")

    if current_usage['memory'] + job_config['resources']['memory'] > quota['memory_limit']:
        raise ValueError(f"Team {team} would exceed memory quota ({quota['memory_limit']} MB)")

    # Create job record
    context['db'].execute("""
        INSERT INTO jobs
        (id, name, type, command, resources, priority, team,
         timeout_minutes, retries, cron_schedule, dependencies, status, queued_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        job_id, job_config['name'], job_config['type'],
        job_config['command'], job_config['resources'],
        job_config['priority'], job_config['team'],
        job_config['timeout_minutes'], job_config['retries'],
        job_config.get('cron_schedule'), job_config.get('dependencies', []),
        JobStatus.PENDING.value, datetime.now()
    )

    # Add to priority queue
    priority_value = Priority[job_config['priority']].value
    context['queue'].push((priority_value, job_id))

    # Trigger scheduler
    context['scheduler'].wake_up()

    # Estimate wait time based on queue position
    queue_position = context['queue'].position(job_id)
    estimated_wait = queue_position * 10  # ~10 seconds per job

    return {
        'job_id': job_id,
        'status': JobStatus.PENDING.value,
        'queued_at': datetime.now().isoformat(),
        'queue_position': queue_position,
        'estimated_wait_seconds': estimated_wait
    }


def schedule_jobs(context: dict):
    """
    Main scheduler loop: assign pending jobs to machines.

    Scheduling algorithm:
    1. Get next job from priority queue
    2. Check dependencies (all must be succeeded)
    3. Find machine with sufficient resources (bin packing)
    4. If no machine available, try preemption
    5. Allocate resources and start job

    Test cases covered:
    - TC2: Bin packing with first-fit algorithm
    - TC3: Priority-based preemption
    """
    while True:
        # Get highest priority pending job
        if context['queue'].is_empty():
            time.sleep(1)
            continue

        priority, job_id = context['queue'].peek()

        job = context['db'].query(
            "SELECT * FROM jobs WHERE id = ?",
            job_id
        )[0]

        # Check dependencies
        if job['dependencies']:
            all_deps_succeeded = all(
                context['db'].query("SELECT status FROM jobs WHERE id = ?", dep_id)[0]['status'] == JobStatus.SUCCEEDED.value
                for dep_id in job['dependencies']
            )

            if not all_deps_succeeded:
                # Dependencies not ready, skip for now
                context['queue'].pop()
                context['queue'].push_back((priority, job_id))  # Re-queue at end
                continue

        # Find machine with sufficient resources (bin packing)
        machine = find_machine_for_job(job, context)

        if machine:
            # Allocate and start job
            context['queue'].pop()
            allocate_and_start_job(job_id, machine['id'], context)

        else:
            # No machine available, try preemption
            if job['priority'] in [Priority.P0_CRITICAL.name, Priority.P1_HIGH.name]:
                preempted = try_preemption(job, context)
                if preempted:
                    # Retry scheduling after preemption
                    continue

            # Can't schedule, try next job
            break

        time.sleep(0.1)


def find_machine_for_job(job: dict, context: dict) -> Optional[dict]:
    """
    Find machine with sufficient resources using bin packing.

    Algorithms:
    - First-fit: First machine with enough resources
    - Best-fit: Machine with least remaining resources after allocation
    - Worst-fit: Machine with most remaining resources

    Args:
        job: Job to schedule
        context: Runtime context

    Returns:
        Machine dict or None if no suitable machine

    Test cases covered:
    - TC2: First-fit bin packing
    """
    required_cpu = job['resources']['cpu']
    required_memory = job['resources']['memory']
    required_gpu = job['resources']['gpu']

    # Get all machines with available resources
    machines = context['db'].query("""
        SELECT * FROM machines WHERE status = 'healthy'
    """)

    # First-fit: return first machine with enough resources
    for machine in machines:
        available = context['resource_manager'].get_available_resources(machine['id'])

        if (available['cpu'] >= required_cpu and
            available['memory'] >= required_memory and
            available['gpu'] >= required_gpu):
            return machine

    return None


def try_preemption(high_priority_job: dict, context: dict) -> bool:
    """
    Try to preempt low-priority jobs to make room for high-priority job.

    Preemption policy:
    - P0 can preempt P1, P2, P3
    - P1 can preempt P2, P3
    - P2 can preempt P3
    - P3 cannot preempt

    Args:
        high_priority_job: Job needing resources
        context: Runtime context

    Returns:
        True if preemption succeeded

    Test cases covered:
    - TC3: Preempt low-priority jobs for high-priority
    """
    high_priority = Priority[high_priority_job['priority']].value
    required_cpu = high_priority_job['resources']['cpu']
    required_memory = high_priority_job['resources']['memory']

    # Find running low-priority jobs
    running_jobs = context['db'].query("""
        SELECT * FROM jobs WHERE status = 'running'
    """)

    # Group by machine
    jobs_by_machine = {}
    for job in running_jobs:
        machine_id = job['machine_id']
        if machine_id not in jobs_by_machine:
            jobs_by_machine[machine_id] = []
        jobs_by_machine[machine_id].append(job)

    # Try each machine
    for machine_id, jobs in jobs_by_machine.items():
        # Get machine capacity
        machine = context['db'].query("SELECT * FROM machines WHERE id = ?", machine_id)[0]

        # Sort jobs by priority (lowest first for preemption)
        jobs.sort(key=lambda j: Priority[j['priority']].value, reverse=True)

        # Try preempting jobs until we have enough resources
        freed_cpu = 0
        freed_memory = 0
        to_preempt = []

        for job in jobs:
            job_priority = Priority[job['priority']].value

            # Can only preempt lower priority
            if job_priority > high_priority:
                to_preempt.append(job)
                freed_cpu += job['resources']['cpu']
                freed_memory += job['resources']['memory']

                # Check if we have enough now
                available = context['resource_manager'].get_available_resources(machine_id)
                if (available['cpu'] + freed_cpu >= required_cpu and
                    available['memory'] + freed_memory >= required_memory):

                    # Preempt these jobs
                    for preempt_job in to_preempt:
                        preempt_job_func(preempt_job['id'], context)

                    return True

    return False


def preempt_job_func(job_id: str, context: dict):
    """
    Preempt a running job.

    Args:
        job_id: Job to preempt
        context: Runtime context
    """
    job = context['db'].query("SELECT * FROM jobs WHERE id = ?", job_id)[0]

    # Kill job process
    context['executor'].kill(job_id)

    # Release resources
    context['resource_manager'].release(job['machine_id'], job['resources'])

    # Update job status
    context['db'].execute("""
        UPDATE jobs
        SET status = ?, preempted_at = ?
        WHERE id = ?
    """, JobStatus.PREEMPTED.value, datetime.now(), job_id)

    # Re-queue job
    priority_value = Priority[job['priority']].value
    context['queue'].push((priority_value, job_id))


def allocate_and_start_job(job_id: str, machine_id: str, context: dict):
    """
    Allocate resources and start job on machine.

    Args:
        job_id: Job to start
        machine_id: Machine to run on
        context: Runtime context

    Test cases covered:
    - TC1: Start job after scheduling
    - TC5: Job timeout enforcement
    """
    job = context['db'].query("SELECT * FROM jobs WHERE id = ?", job_id)[0]

    # Allocate resources
    context['resource_manager'].allocate(machine_id, job['resources'])

    # Update job status
    context['db'].execute("""
        UPDATE jobs
        SET status = ?, machine_id = ?, started_at = ?
        WHERE id = ?
    """, JobStatus.RUNNING.value, machine_id, datetime.now(), job_id)

    # Start job via executor (K8s pod, Docker container, etc.)
    context['executor'].start(job_id, machine_id, {
        'command': job['command'],
        'resources': job['resources']
    })

    # Schedule timeout check
    if job['timeout_minutes']:
        context['scheduler'].schedule_once(
            function=check_job_timeout,
            args={'job_id': job_id},
            delay_seconds=job['timeout_minutes'] * 60
        )


def check_job_timeout(job_id: str, context: dict):
    """
    Check if job exceeded timeout and kill if necessary.

    Args:
        job_id: Job to check
        context: Runtime context

    Test cases covered:
    - TC5: Kill job after timeout
    """
    job = context['db'].query("SELECT * FROM jobs WHERE id = ?", job_id)[0]

    if job['status'] != JobStatus.RUNNING.value:
        return  # Already finished

    # Check if timed out
    started_at = job['started_at']
    timeout = timedelta(minutes=job['timeout_minutes'])

    if datetime.now() - started_at > timeout:
        # Kill job
        context['executor'].kill(job_id)

        # Release resources
        context['resource_manager'].release(job['machine_id'], job['resources'])

        # Update status
        context['db'].execute("""
            UPDATE jobs
            SET status = ?, finished_at = ?, error_message = ?
            WHERE id = ?
        """, JobStatus.FAILED.value, datetime.now(), 'Timeout exceeded', job_id)


def handle_job_completion(job_id: str, exit_code: int, context: dict):
    """
    Handle job completion (success or failure).

    Args:
        job_id: Completed job
        exit_code: 0 for success, non-zero for failure
        context: Runtime context

    Test cases covered:
    - TC6: Retry failed jobs with exponential backoff
    """
    job = context['db'].query("SELECT * FROM jobs WHERE id = ?", job_id)[0]

    # Release resources
    context['resource_manager'].release(job['machine_id'], job['resources'])

    if exit_code == 0:
        # Success
        context['db'].execute("""
            UPDATE jobs
            SET status = ?, finished_at = ?
            WHERE id = ?
        """, JobStatus.SUCCEEDED.value, datetime.now(), job_id)

    else:
        # Failure - check retries
        current_retry = job.get('current_retry', 0)
        max_retries = job['retries']

        if current_retry < max_retries:
            # Retry with exponential backoff
            backoff_seconds = 2 ** current_retry  # 1s, 2s, 4s, 8s...

            context['db'].execute("""
                UPDATE jobs
                SET current_retry = ?, status = ?
                WHERE id = ?
            """, current_retry + 1, JobStatus.PENDING.value, job_id)

            # Re-queue after backoff
            context['scheduler'].schedule_once(
                function=lambda: context['queue'].push((Priority[job['priority']].value, job_id)),
                delay_seconds=backoff_seconds
            )

        else:
            # Max retries exceeded, mark as failed
            context['db'].execute("""
                UPDATE jobs
                SET status = ?, finished_at = ?
                WHERE id = ?
            """, JobStatus.FAILED.value, datetime.now(), job_id)


# Example usage
if __name__ == "__main__":
    context = {
        'db': MockDatabase(),
        'queue': MockPriorityQueue(),
        'resource_manager': MockResourceManager(),
        'scheduler': MockScheduler(),
        'executor': MockExecutor()
    }

    # Submit job
    job = submit_job({
        'name': 'data-processing',
        'type': 'batch',
        'command': 'python process.py',
        'resources': {
            'cpu': 8,
            'memory': 16384,
            'gpu': 0
        },
        'priority': 'P1_HIGH',
        'team': 'data-eng',
        'timeout_minutes': 120,
        'retries': 3
    }, context)

    print(f"Job submitted: {job['job_id']}")
    print(f"Queue position: {job['queue_position']}")
    print(f"Estimated wait: {job['estimated_wait_seconds']}s")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Submit and schedule job',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Submit job
job = submit_job({
    'name': 'daily-report',
    'type': 'batch',
    'command': 'python report.py',
    'resources': {'cpu': 4, 'memory': 8192, 'gpu': 0},
    'priority': 'P2_NORMAL',
    'team': 'analytics',
    'timeout_minutes': 60,
    'retries': 3
}, context)

print(job['status'])
print(job['job_id'])

# Schedule (find machine and start)
machine = find_machine_for_job(
    context['db'].query("SELECT * FROM jobs WHERE id = ?", job['job_id'])[0],
    context
)

print(machine is not None)`,
    expectedOutput: `pending
job_123456789
True`,
    hints: [
      'Create job record with PENDING status',
      'Add to priority queue for scheduling',
      'Check team resource quotas before submission',
      'Estimate wait time based on queue position',
      'Wake up scheduler to process queue'
    ],
    testCode: `assert job['status'] == 'pending'
assert 'job_' in job['job_id']
assert machine is not None`,
    timeComplexity: 'O(log N) for priority queue insertion',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Design job submission with quotas',
      'Understand priority queue for scheduling',
      'Learn bin packing for resource allocation'
    ]
  },
  {
    id: 2,
    name: 'Bin packing: first-fit algorithm',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Create machines with varying resources
context['db'].execute("INSERT INTO machines VALUES (?, ?, ?)",
    'm1', {'cpu': 2, 'memory': 4096}, 'healthy')
context['db'].execute("INSERT INTO machines VALUES (?, ?, ?)",
    'm2', {'cpu': 8, 'memory': 16384}, 'healthy')
context['db'].execute("INSERT INTO machines VALUES (?, ?, ?)",
    'm3', {'cpu': 16, 'memory': 32768}, 'healthy')

# Job needs 4 CPU, 8GB RAM
job = {
    'resources': {'cpu': 4, 'memory': 8192, 'gpu': 0}
}

# Should select m2 (first machine with enough resources)
machine = find_machine_for_job(job, context)

print(machine['id'])
print(machine['resources']['cpu'] >= 4)`,
    expectedOutput: `m2
True`,
    hints: [
      'First-fit: return first machine with sufficient resources',
      'Check CPU, memory, GPU requirements',
      'Query machines with healthy status',
      'Alternative: best-fit (least remaining) or worst-fit (most remaining)',
      'First-fit is O(N) where N = number of machines'
    ],
    testCode: `assert machine['id'] == 'm2'
assert machine['resources']['cpu'] >= 4
assert machine['resources']['memory'] >= 8192`,
    timeComplexity: 'O(N) where N = number of machines',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement first-fit bin packing',
      'Understand resource allocation algorithms',
      'Learn trade-offs: first-fit vs best-fit vs worst-fit'
    ]
  },
  {
    id: 3,
    name: 'Priority-based preemption',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

# Machine with limited resources
context['db'].execute("INSERT INTO machines VALUES (?, ?, ?)",
    'm1', {'cpu': 8, 'memory': 16384}, 'healthy')

# Low-priority job running (using 6 CPU)
low_priority_job = {
    'id': 'job_low',
    'priority': 'P3_LOW',
    'resources': {'cpu': 6, 'memory': 8192, 'gpu': 0},
    'machine_id': 'm1',
    'status': 'running'
}
context['db'].execute("INSERT INTO jobs VALUES (?)", low_priority_job)
context['resource_manager'].allocate('m1', low_priority_job['resources'])

# High-priority job needs 4 CPU (only 2 CPU available)
high_priority_job = {
    'priority': 'P0_CRITICAL',
    'resources': {'cpu': 4, 'memory': 4096, 'gpu': 0}
}

# Should preempt low-priority job
preempted = try_preemption(high_priority_job, context)

print(preempted)
print(context['db'].query("SELECT status FROM jobs WHERE id = ?", 'job_low')[0]['status'])`,
    expectedOutput: `True
preempted`,
    hints: [
      'P0 can preempt P1, P2, P3',
      'Sort running jobs by priority (lowest first)',
      'Preempt until enough resources freed',
      'Kill preempted job and release resources',
      'Re-queue preempted job for rescheduling'
    ],
    testCode: `assert preempted == True
assert context['db'].query("SELECT status FROM jobs WHERE id = ?", 'job_low')[0]['status'] == 'preempted'`,
    timeComplexity: 'O(M * J) where M = machines, J = jobs per machine',
    spaceComplexity: 'O(J)',
    learningObjectives: [
      'Implement priority-based preemption',
      'Understand resource reclamation',
      'Learn to prevent starvation of low-priority jobs'
    ]
  },
  {
    id: 4,
    name: 'Resource quota enforcement',
    difficulty: 'medium',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Set team quota
context['db'].execute("""
    INSERT INTO team_quotas (team, cpu_limit, memory_limit)
    VALUES (?, ?, ?)
""", 'analytics', 100, 204800)  # 100 CPU, 200GB

# Team already using 95 CPU
context['resource_manager'].set_team_usage('analytics', {'cpu': 95, 'memory': 100000})

# Try to submit job needing 10 CPU (would exceed quota)
try:
    job = submit_job({
        'name': 'big-job',
        'type': 'batch',
        'command': 'python big.py',
        'resources': {'cpu': 10, 'memory': 20480, 'gpu': 0},
        'priority': 'P2_NORMAL',
        'team': 'analytics',
        'timeout_minutes': 60,
        'retries': 3
    }, context)
    print("ERROR: Should have been rejected")
except ValueError as e:
    print(f"Rejected: {e}")`,
    expectedOutput: `Rejected: Team analytics would exceed CPU quota (100 cores)`,
    hints: [
      'Check team quota before accepting job',
      'Track current usage per team',
      'Reject if submission would exceed limit',
      'Support quota borrowing for idle resources (optional)',
      'Enforce quotas to prevent resource hogging'
    ],
    testCode: `try:
    submit_job({...}, context)
    assert False, "Should have raised ValueError"
except ValueError as e:
    assert 'quota' in str(e).lower()`,
    timeComplexity: 'O(1) for quota check',
    spaceComplexity: 'O(T) where T = number of teams',
    learningObjectives: [
      'Implement resource quotas per team',
      'Prevent resource hogging',
      'Learn fair-share scheduling'
    ]
  },
  {
    id: 5,
    name: 'Job timeout enforcement (NFR-R)',
    difficulty: 'easy',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Start job with 1-minute timeout
job = {
    'id': 'job_123',
    'timeout_minutes': 1,
    'started_at': datetime.now() - timedelta(minutes=2),  # Started 2 min ago
    'status': 'running',
    'machine_id': 'm1',
    'resources': {'cpu': 4, 'memory': 8192, 'gpu': 0}
}
context['db'].execute("INSERT INTO jobs VALUES (?)", job)

# Check timeout
check_job_timeout('job_123', context)

# Job should be killed and marked failed
final_status = context['db'].query("SELECT status FROM jobs WHERE id = ?", 'job_123')[0]

print(final_status['status'])`,
    expectedOutput: `failed`,
    hints: [
      'Schedule timeout check when job starts',
      'Compare current time vs started_at + timeout',
      'Kill job process if exceeded',
      'Release resources and update status to FAILED',
      'Prevent runaway jobs from consuming resources indefinitely'
    ],
    testCode: `assert final_status['status'] == 'failed'`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement timeout enforcement',
      'Prevent resource leaks from stuck jobs',
      'Learn to clean up after job failures'
    ]
  },
  {
    id: 6,
    name: 'Retry failed jobs with exponential backoff',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Job with 3 retries allowed
job = {
    'id': 'job_456',
    'retries': 3,
    'current_retry': 1,  # Already retried once
    'priority': 'P2_NORMAL',
    'machine_id': 'm1',
    'resources': {'cpu': 2, 'memory': 4096, 'gpu': 0}
}
context['db'].execute("INSERT INTO jobs VALUES (?)", job)

# Job fails (exit code 1)
handle_job_completion('job_456', exit_code=1, context)

# Should retry (current_retry: 1 → 2)
updated_job = context['db'].query("SELECT * FROM jobs WHERE id = ?", 'job_456')[0]

print(updated_job['status'])
print(updated_job['current_retry'])
print(updated_job['current_retry'] < updated_job['retries'])  # Can retry again`,
    expectedOutput: `pending
2
True`,
    hints: [
      'Check exit code: 0 = success, non-zero = failure',
      'If retries remaining, increment current_retry',
      'Use exponential backoff: 2^retry seconds (1s, 2s, 4s, 8s)',
      'Re-queue job with backoff delay',
      'If max retries exceeded, mark as FAILED'
    ],
    testCode: `assert updated_job['status'] == 'pending'
assert updated_job['current_retry'] == 2
assert updated_job['current_retry'] < updated_job['retries']`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement retry logic with exponential backoff',
      'Handle transient failures gracefully',
      'Learn to limit retries to prevent infinite loops'
    ]
  },
  {
    id: 7,
    name: 'Scale: 10,000 jobs/second throughput (NFR-P)',
    difficulty: 'hard',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Submit 10,000 jobs
import time
start = time.time()

jobs = []
for i in range(10000):
    job = submit_job({
        'name': f'job-{i}',
        'type': 'batch',
        'command': 'echo hello',
        'resources': {'cpu': 1, 'memory': 1024, 'gpu': 0},
        'priority': 'P2_NORMAL',
        'team': f'team-{i % 100}',  # 100 teams
        'timeout_minutes': 5,
        'retries': 1
    }, context)
    jobs.append(job['job_id'])

duration = time.time() - start
throughput = len(jobs) / duration

print(f"Submitted {len(jobs)} jobs in {duration:.2f}s")
print(f"Throughput: {throughput:.0f} jobs/second")
print(throughput >= 10000)  # Must handle 10K jobs/sec`,
    expectedOutput: `Submitted 10000 jobs in 0.95s
Throughput: 10526 jobs/second
True`,
    hints: [
      'Use batch database inserts (not one-by-one)',
      'Optimize priority queue operations (heap)',
      'Cache team quotas (don\'t query DB each time)',
      'Use async I/O for parallel submissions',
      'Target: <1ms per job submission'
    ],
    testCode: `assert len(jobs) == 10000
assert throughput >= 10000  # NFR-P`,
    timeComplexity: 'O(N log N) for N jobs with priority queue',
    spaceComplexity: 'O(N)',
    learningObjectives: [
      'Scale job scheduler to 10K jobs/sec',
      'Optimize database and queue operations',
      'Learn to use batch operations for performance'
    ]
  }
];

export const internalJobSchedulerChallenge: SystemDesignChallenge = {
  id: 'internal_job_scheduler',
  title: 'Internal Job Scheduler',
  difficulty: 'advanced',
  category: 'Developer Tools & Platforms',
  description: `Design a distributed job scheduler for batch jobs, cron tasks, and DAG workflows with resource allocation, priorities, and preemption. Similar to Google Borg, Kubernetes Jobs, Apache Airflow, or AWS Batch.

**Real-world Context:**
- Google Borg: Cluster management for batch and serving workloads at massive scale
- Kubernetes Jobs/CronJobs: Container orchestration for batch computing
- Apache Airflow: Workflow scheduler used by Airbnb, Uber for data pipelines
- AWS Batch: Managed batch service handling millions of jobs

**Key Concepts:**
- Bin packing: First-fit algorithm to place jobs on machines
- Priority-based preemption: P0 jobs can kill P3 jobs to get resources
- Resource quotas: Per-team limits (1000 CPU cores, 2TB RAM)
- Retries: Exponential backoff (1s, 2s, 4s, 8s...)
- Timeout enforcement: Kill jobs after timeout to prevent resource leaks

**Scale:**
- 10,000 machines in cluster
- 1M jobs running concurrently
- 10K jobs/second submission throughput
- <1 second scheduling latency

**Companies:** Google, Amazon, Uber, Airbnb, Netflix
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Use priority queue (heap) for O(log N) job selection',
    'First-fit bin packing: iterate machines, pick first with enough resources',
    'Preemption: P0 can kill P1/P2/P3, P1 can kill P2/P3, etc.',
    'Check team quotas before accepting job submission',
    'Retry with exponential backoff: 2^retry_count seconds',
    'Timeout check: schedule delayed task when job starts',
    'Optimize for throughput: batch DB writes, cache quotas',
    'Gang scheduling: all-or-nothing for multi-task jobs (advanced)'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Google Borg: Manages 10K+ machines, runs batch + serving workloads',
    'Airbnb Airflow: Schedules 100K+ data pipeline jobs daily',
    'Netflix: Batch processing for encoding, analytics, recommendations',
    'Uber: Data processing jobs for pricing, ETA, fraud detection',
    'AWS Batch: Customers run millions of batch jobs (genomics, rendering, ML)'
  ],
  relatedChallenges: [
    'etl_orchestration',
    'service_mesh_control_plane',
    'model_serving_platform',
    'realtime_analytics_pipeline'
  ]
};
