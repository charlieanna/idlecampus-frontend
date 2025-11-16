import { Challenge } from '../../types/testCase';

export const etlOrchestrationChallenge: Challenge = {
  id: 'etl_orchestration',
  title: 'ETL Orchestration Platform (Airflow / Google Cloud Composer)',
  difficulty: 'advanced',
  description: `Design an ETL (Extract-Transform-Load) orchestration platform for data pipelines.

Data engineers define DAGs (Directed Acyclic Graphs) of tasks:
- Task A: Extract data from production database
- Task B: Transform data (aggregations, joins)
- Task C: Load into data warehouse
- Dependencies: C depends on B, B depends on A

The system must:
- Execute tasks in dependency order
- Retry failed tasks with backoff
- Support backfilling (re-run historical data)
- Handle idempotency (safe to re-run)
- Schedule recurring pipelines (daily/hourly)

Example DAG:
extract_orders (15 min) → transform_revenue (30 min) → load_warehouse (10 min)

Key challenges:
- Dependency resolution (topological sort)
- Distributed task execution
- Failure recovery with retries
- Backfilling without duplicate data`,

  requirements: {
    functional: [
      'Define DAGs with task dependencies',
      'Execute tasks in correct order (topological sort)',
      'Retry failed tasks (exponential backoff)',
      'Backfill historical data ranges',
      'Idempotent execution (same input → same output)',
      'Scheduled execution (cron-style)',
    ],
    traffic: '1,000 DAGs, 10,000 tasks/day',
    latency: 'Task scheduling overhead < 5 sec',
    availability: '99.9% uptime (critical for data freshness)',
    budget: '$8,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic DAG Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Execute simple DAG with 3 tasks in correct order.',
      traffic: {
        type: 'write',
        rps: 1, // 1 DAG execution
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        taskOrderCorrect: true, // Tasks executed in dependency order
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Basic ETL orchestration architecture:

**Components:**
- PostgreSQL: Store DAG definitions, task state, execution history
- Message Queue: Distribute tasks to workers
- S3: Store task outputs (intermediate data)
- App Servers: Scheduler + orchestrator

**DAG definition:**
{
  "dag_id": "daily_revenue",
  "schedule": "0 0 * * *",  # Daily at midnight
  "tasks": [
    {
      "task_id": "extract_orders",
      "depends_on": [],
      "command": "python extract_orders.py"
    },
    {
      "task_id": "transform_revenue",
      "depends_on": ["extract_orders"],
      "command": "python transform_revenue.py"
    },
    {
      "task_id": "load_warehouse",
      "depends_on": ["transform_revenue"],
      "command": "python load_warehouse.py"
    }
  ]
}

**Execution flow:**
1. Scheduler triggers DAG at midnight
2. Orchestrator builds dependency graph
3. Identifies ready tasks (no dependencies): extract_orders
4. Publishes extract_orders to message queue
5. Worker pulls task, executes, reports completion
6. Orchestrator identifies next ready tasks: transform_revenue
7. Repeat until all tasks complete`,
      },
    },

    {
      name: 'Parallel Task Execution',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Execute independent tasks in parallel (extract_users and extract_orders simultaneously).',
      traffic: {
        type: 'write',
        rps: 10, // 10 concurrent DAG executions
      },
      duration: 300,
      passCriteria: {
        maxErrorRate: 0.01,
        parallelExecutionVerified: true,
        maxDagDuration: 60, // Minutes (parallel vs sequential)
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000 } },
          { type: 'message_queue', config: { maxThroughput: 20000 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
          { type: 'redis', config: { maxMemoryMB: 4096 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Parallel task execution with topological sort:

**DAG with parallelism:**
{
  "tasks": [
    {"id": "extract_users", "depends_on": []},
    {"id": "extract_orders", "depends_on": []},
    {"id": "extract_products", "depends_on": []},
    {"id": "join_user_orders", "depends_on": ["extract_users", "extract_orders"]},
    {"id": "enrich_with_products", "depends_on": ["join_user_orders", "extract_products"]}
  ]
}

**Dependency levels (topological sort):**
- Level 0: extract_users, extract_orders, extract_products (parallel!)
- Level 1: join_user_orders (waits for users + orders)
- Level 2: enrich_with_products (waits for join + products)

**Execution timeline:**
Time 0:00 - Level 0 tasks start in parallel (3 workers)
  - extract_users (15 min)
  - extract_orders (15 min)
  - extract_products (10 min) ← finishes first

Time 0:15 - Level 1 task starts (users + orders complete)
  - join_user_orders (20 min)

Time 0:35 - Level 2 task starts
  - enrich_with_products (10 min)

Time 0:45 - DAG complete! ✅

**Sequential execution would take:**
15 + 15 + 10 + 20 + 10 = 70 minutes ❌

**Parallel execution:**
45 minutes ✅ (36% faster!)

**Implementation:**
- Use Redis for task state (fast updates)
- PostgreSQL for durable state
- Message queue for task distribution`,
      },
    },

    {
      name: 'Task Retry with Exponential Backoff',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Task fails due to transient error. System retries 3 times with backoff (5s, 10s, 20s).',
      traffic: {
        type: 'write',
        rps: 5,
      },
      duration: 180,
      failureInjection: {
        type: 'task_failure',
        atSecond: 30,
        failureRate: 0.3,
      },
      passCriteria: {
        maxErrorRate: 0.1, // Some tasks fail even after retries
        retriesExecuted: true,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000 } },
          { type: 'message_queue', config: { maxThroughput: 20000 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Retry strategy for transient failures:

**Problem - No retries:**
- Network glitch (1% chance)
- Task fails immediately ❌
- Entire DAG fails
- Data pipeline broken

**Solution - Exponential backoff:**

**Retry configuration:**
{
  "task_id": "extract_orders",
  "retries": 3,
  "retry_delay_base": 5,  # seconds
  "retry_backoff": 2.0    # multiplier
}

**Retry schedule:**
- Attempt 1: Immediate
- Attempt 2: Wait 5 sec (5 × 2^0)
- Attempt 3: Wait 10 sec (5 × 2^1)
- Attempt 4: Wait 20 sec (5 × 2^2)

**Why exponential backoff?**
- Gives downstream service time to recover
- Avoids thundering herd (all tasks retry at once)
- Increases success probability

**Implementation:**
1. Task fails
2. Worker reports failure with attempt count
3. Orchestrator checks retry policy
4. If attempts < max_retries:
   - Calculate delay = base × backoff^attempts
   - Schedule retry after delay
   - Publish to message queue with delay
5. If attempts >= max_retries:
   - Mark task as failed
   - Fail entire DAG

**Success rate with retries:**
- Single attempt: 99% success
- With 3 retries: 99.99% success! (1 - 0.01^4)`,
      },
    },

    {
      name: 'Backfilling Historical Data',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Re-run DAG for Jan 1-31 (backfill). Execute 31 DAG runs without duplicates.',
      traffic: {
        type: 'write',
        rps: 10, // Multiple historical runs
      },
      duration: 600,
      passCriteria: {
        maxErrorRate: 0.01,
        backfillComplete: true,
        noDuplicates: true, // Idempotent execution
      },
    },

    {
      name: 'Idempotent Execution',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Run same DAG twice for same date. Second run produces identical output (no duplicates).',
      traffic: {
        type: 'write',
        rps: 2,
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        idempotencyVerified: true,
      },
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'High DAG Concurrency',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Execute 100 DAGs concurrently with 1000+ tasks in flight.',
      traffic: {
        type: 'write',
        rps: 100, // 100 concurrent DAG executions
      },
      duration: 600,
      passCriteria: {
        maxP99Latency: 5000, // 5 sec scheduling overhead
        maxErrorRate: 0.02,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Worker Failure During Task',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Worker crashes mid-task. System detects timeout and retries on different worker.',
      traffic: {
        type: 'write',
        rps: 20,
      },
      duration: 300,
      failureInjection: {
        type: 'worker_crash',
        atSecond: 60,
        affectedPercentage: 0.2,
      },
      passCriteria: {
        maxErrorRate: 0.1,
        minAvailability: 0.95,
      },
    },
  ],

  learningObjectives: [
    'Design DAG execution with topological sort',
    'Implement distributed task orchestration',
    'Retry strategies with exponential backoff',
    'Idempotent data pipelines',
    'Backfilling and historical data processing',
  ],

  hints: [
    {
      trigger: 'test_failed:Parallel Task Execution',
      message: `💡 Tasks are running sequentially instead of parallel!

**Problem:**
DAG takes 70 minutes (sum of all task durations) ❌

**Root cause:**
Not leveraging parallelism from dependency graph

**Solution - Topological sort by levels:**

Step 1: Build dependency graph
extract_users → join_user_orders
extract_orders → join_user_orders
extract_products → enrich_with_products
join_user_orders → enrich_with_products

Step 2: Assign levels (Kahn's algorithm)
Level 0: Tasks with no dependencies
  → [extract_users, extract_orders, extract_products]

Level 1: Tasks whose all dependencies are in Level 0
  → [join_user_orders]

Level 2: Tasks whose all dependencies are in Level 0-1
  → [enrich_with_products]

Step 3: Execute by level (parallel within level)
for each level:
    for each task in level:
        publish_to_queue(task)  # All tasks in level published immediately

    wait_for_level_completion()  # Block until all tasks in level complete

**Result:**
3 tasks run in parallel → 45 minutes ✅

Add topological sort + message queue distribution!`,
    },
    {
      trigger: 'test_failed:Backfilling Historical Data',
      message: `💡 Backfill is creating duplicate data!

**Problem:**
Backfill for Jan 1-31:
- Jan 1 data inserted
- Re-run Jan 1 → duplicate rows in warehouse ❌

**Root cause:**
Tasks are not idempotent (safe to re-run)

**Solution - Idempotent operations:**

**WRONG (Insert):** ❌
INSERT INTO revenue_daily
VALUES ('2024-01-01', 10000)

Run twice → 2 rows for Jan 1!

**RIGHT (Upsert):** ✅
INSERT INTO revenue_daily (date, amount)
VALUES ('2024-01-01', 10000)
ON CONFLICT (date)
DO UPDATE SET amount = 10000

Run twice → 1 row for Jan 1 ✅

**Alternative - Partition overwrite:**
1. Write to temporary table
2. Overwrite partition:
   DELETE FROM revenue_daily WHERE date = '2024-01-01'
   INSERT INTO revenue_daily SELECT * FROM temp_revenue

**Key insight:**
All DAG tasks MUST be idempotent for safe backfilling!

**Task design checklist:**
✅ DELETE + INSERT (overwrite partition)
✅ UPSERT (ON CONFLICT DO UPDATE)
✅ Temporary table → atomic swap
❌ Plain INSERT (creates duplicates)`,
    },
    {
      trigger: 'test_failed:Task Retry with Exponential Backoff',
      message: `💡 All retries failing immediately!

**Problem:**
Task fails → retry immediately → fails again ❌
No time for downstream service to recover

**Solution - Exponential backoff:**

**Linear retry (BAD):** ⚠️
Attempt 1: Fail
Wait 5 sec
Attempt 2: Fail
Wait 5 sec
Attempt 3: Fail
→ May not give enough time to recover

**Exponential backoff (GOOD):** ✅
Attempt 1: Fail
Wait 5 sec (5 × 2^0)
Attempt 2: Fail
Wait 10 sec (5 × 2^1)
Attempt 3: Fail
Wait 20 sec (5 × 2^2)
Attempt 4: Success! ✅

**Why exponential?**
1. Gives more time for recovery
2. Reduces load on failing service
3. Prevents thundering herd

**Implementation:**
retry_delay = base_delay * (backoff_multiplier ** attempt)

For base=5, backoff=2:
- Attempt 1: 5 × 2^0 = 5 sec
- Attempt 2: 5 × 2^1 = 10 sec
- Attempt 3: 5 × 2^2 = 20 sec
- Attempt 4: 5 × 2^3 = 40 sec

**Add max delay cap:**
retry_delay = min(base * backoff^attempt, max_delay)

This prevents delays from growing too large (e.g., cap at 5 minutes)`,
    },
    {
      trigger: 'test_failed:Worker Failure During Task',
      message: `💡 Tasks are lost when workers crash!

**Problem:**
1. Worker pulls task from queue
2. Worker starts executing (takes 30 minutes)
3. Worker crashes at minute 15
4. Task lost forever ❌
5. DAG hangs waiting for task

**Solution - Visibility timeout:**

**Message queue pattern:**
1. Worker pulls task (visibility timeout: 60 min)
2. Task becomes invisible to other workers
3. Worker executes task
4. If worker completes → DELETE message ✅
5. If worker crashes → after 60 min, task becomes visible again
6. Another worker picks up task and retries ✅

**Implementation (SQS-style):**
# Worker loop
while True:
    # Pull task with visibility timeout
    message = queue.receive(timeout=60 * 60)  # 1 hour

    try:
        # Execute task
        execute_task(message.task)

        # Success - delete from queue
        queue.delete(message)
    except Exception:
        # Failure - message will auto-retry after timeout
        # Optionally: queue.change_visibility(message, 0)  # Immediate retry
        pass

**Key parameters:**
- Visibility timeout > max task duration
- Allows automatic retry on worker failure
- No lost tasks!

Most message queues (SQS, RabbitMQ, Pub/Sub) support this pattern.`,
    },
  ],

  pythonTemplate: `# ETL Orchestration Platform
# Implement DAG execution with topological sort

from collections import defaultdict, deque
from typing import Dict, List, Set
import time

def build_dependency_graph(dag: dict) -> Dict[str, List[str]]:
    """
    Build dependency graph from DAG definition.

    Args:
        dag: {
            "tasks": [
                {"id": "extract", "depends_on": []},
                {"id": "transform", "depends_on": ["extract"]},
                {"id": "load", "depends_on": ["transform"]}
            ]
        }

    Returns:
        {
            "extract": [],
            "transform": ["extract"],
            "load": ["transform"]
        }
    """
    # Your code here
    return {}


def topological_sort_levels(dep_graph: Dict[str, List[str]]) -> List[List[str]]:
    """
    Sort tasks into levels for parallel execution (Kahn's algorithm).

    Args:
        dep_graph: Task dependencies

    Returns:
        [
            ["extract_users", "extract_orders"],    # Level 0: No deps
            ["join_user_orders"],                    # Level 1
            ["load_warehouse"]                       # Level 2
        ]

    Requirements:
    - Implement Kahn's algorithm
    - Group by dependency levels
    - Detect cycles (raise error)
    """
    # Your code here
    return [[]]


def execute_dag(dag_id: str, execution_date: str, context: dict) -> dict:
    """
    Execute a DAG for a specific date.

    Args:
        dag_id: DAG identifier
        execution_date: Date to run DAG for (e.g., "2024-01-15")
        context: Shared context

    Returns:
        {
            "dag_id": "daily_revenue",
            "execution_date": "2024-01-15",
            "status": "success",
            "duration_sec": 2700,
            "tasks_executed": 10
        }

    Requirements:
    - Fetch DAG definition from PostgreSQL
    - Build dependency graph
    - Topological sort by levels
    - For each level:
        - Publish all tasks to message queue
        - Wait for all tasks to complete
    - Track execution state in PostgreSQL
    """
    # Your code here
    return {}


def execute_task_with_retry(task: dict, context: dict) -> dict:
    """
    Execute task with retry logic (called by worker).

    Args:
        task: {
            "task_id": "extract_orders",
            "command": "python extract_orders.py",
            "retries": 3,
            "retry_delay_base": 5,
            "retry_backoff": 2.0,
            "execution_date": "2024-01-15"
        }
        context: Shared context

    Returns:
        {
            "task_id": "extract_orders",
            "status": "success",
            "attempt": 2,  # Succeeded on 2nd attempt
            "duration_sec": 900
        }

    Requirements:
    - Execute task command
    - On failure: Check retry policy
    - Calculate exponential backoff delay
    - Sleep and retry
    - Return result after success or max retries
    """
    max_retries = task.get('retries', 3)
    base_delay = task.get('retry_delay_base', 5)
    backoff = task.get('retry_backoff', 2.0)

    for attempt in range(max_retries + 1):
        try:
            # Execute task
            # Your code here

            return {'task_id': task['task_id'], 'status': 'success', 'attempt': attempt}

        except Exception as e:
            if attempt >= max_retries:
                # Max retries exceeded
                return {'task_id': task['task_id'], 'status': 'failed', 'attempt': attempt}

            # Calculate backoff delay
            delay = base_delay * (backoff ** attempt)
            time.sleep(delay)


def backfill_dag(dag_id: str, start_date: str, end_date: str, context: dict) -> dict:
    """
    Backfill DAG for date range.

    Args:
        dag_id: DAG to backfill
        start_date: Start date (inclusive)
        end_date: End date (inclusive)
        context: Shared context

    Returns:
        {
            "dag_id": "daily_revenue",
            "start_date": "2024-01-01",
            "end_date": "2024-01-31",
            "total_runs": 31,
            "successful": 31,
            "failed": 0
        }

    Requirements:
    - Generate list of dates in range
    - For each date, execute DAG
    - Track results
    - Execute in parallel (up to 10 concurrent runs)
    """
    # Your code here
    return {}


def check_idempotency(task_output: dict, previous_output: dict) -> bool:
    """
    Verify task produces same output when re-run (idempotency check).

    Args:
        task_output: Current run output
        previous_output: Previous run output

    Returns:
        True if outputs are identical

    Requirements:
    - Compare outputs (deep equality)
    - Check for duplicates
    - Verify data integrity
    """
    # Your code here
    return True


# Worker loop
def worker_loop(context: dict):
    """
    Worker pulls tasks from queue and executes them.

    Requirements:
    - Pull task from message queue (blocking wait)
    - Execute task with retry logic
    - Report result to orchestrator (update PostgreSQL)
    - Delete message from queue (ack)
    - Handle visibility timeout for crash recovery
    """
    while True:
        # Pull task from queue with visibility timeout
        message = context['queue'].receive(timeout=3600)  # 1 hour
        if not message:
            continue

        task = message['task']

        # Execute task with retries
        result = execute_task_with_retry(task, context)

        # Report result
        context.db.execute(
            "UPDATE task_executions SET status = :status WHERE task_id = :task_id",
            {'status': result['status'], 'task_id': task['task_id']}
        )

        # Ack message (delete from queue)
        context['queue'].delete(message)


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle ETL orchestration API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # POST /dags/:dag_id/run - Trigger DAG
    if method == 'POST' and '/run' in path:
        dag_id = path.split('/')[2]
        execution_date = body.get('execution_date', '')
        result = execute_dag(dag_id, execution_date, context)
        return {'status': 201, 'body': result}

    # POST /dags/:dag_id/backfill - Backfill DAG
    elif method == 'POST' and '/backfill' in path:
        dag_id = path.split('/')[2]
        start_date = body.get('start_date', '')
        end_date = body.get('end_date', '')
        result = backfill_dag(dag_id, start_date, end_date, context)
        return {'status': 201, 'body': result}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
