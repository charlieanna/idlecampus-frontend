import { Challenge } from '../../types/testCase';

export const zeroDowntimeMigrationChallenge: Challenge = {
  id: 'zero_downtime_migration',
  title: 'Zero-Downtime Database Migration',
  difficulty: 'advanced',
  description: `Design a system to migrate from MySQL to PostgreSQL with ZERO downtime.

You have a production database (MySQL) serving 10,000 RPS. You need to migrate to PostgreSQL
without any service interruption.

Migration phases:
1. **Dual-write**: Write to both MySQL (old) and PostgreSQL (new)
2. **Backfill**: Copy historical data from MySQL → PostgreSQL
3. **Validation**: Verify data consistency between databases
4. **Cutover**: Switch reads from MySQL → PostgreSQL
5. **Cleanup**: Remove dual-write, decommission MySQL

Key challenges:
- Maintain consistency during dual-write
- Backfill 10TB of data without impacting production
- Handle write conflicts (same record updated in both DBs)
- Rollback plan if migration fails`,

  requirements: {
    functional: [
      'Dual-write to both databases',
      'Backfill historical data (10TB)',
      'Consistency validation',
      'Gradual traffic cutover (0% → 100%)',
      'Rollback capability',
    ],
    traffic: '10,000 RPS (70% reads, 30% writes)',
    latency: 'p99 < 200ms (no degradation during migration)',
    availability: '99.99% uptime (zero downtime!)',
    budget: '$20,000/month (during migration)',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Dual-Write Phase',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Write to both MySQL and PostgreSQL. Handle write failures gracefully.',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.7,
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0.01,
        maxP99Latency: 250, // Slight increase due to dual-write
        bothDbsUpdated: true,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 20 } },
          { type: 'mysql', config: { readCapacity: 10000, writeCapacity: 5000 } },
          { type: 'postgresql', config: { readCapacity: 10000, writeCapacity: 5000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 'redis', config: { maxMemoryMB: 4096 } },
        ],
        connections: [
          { type: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'mysql' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Dual-write strategy:

**Phase 1: Enable dual-write**

**WRONG approach - Synchronous:** ❌
def write_user(user):
    mysql.execute("INSERT INTO users ...")  # 10ms
    postgres.execute("INSERT INTO users ...")  # 10ms
    # Total: 20ms latency ❌

**RIGHT approach - Async secondary write:** ✅
def write_user(user):
    # Primary write (MySQL) - blocking
    mysql.execute("INSERT INTO users ...")  # 10ms

    # Secondary write (PostgreSQL) - async!
    message_queue.publish({
        'action': 'replicate_write',
        'db': 'users',
        'data': user
    })  # 1ms

    return success  # Total: 11ms latency ✅

**Background worker:**
while True:
    msg = queue.receive()
    try:
        postgres.execute("INSERT INTO users ...", msg.data)
        queue.ack(msg)
    except:
        # Retry with exponential backoff
        queue.retry(msg, delay=5s)

**Why this works:**
- Primary DB (MySQL): Blocking write (source of truth)
- Secondary DB (PostgreSQL): Async replication
- Application latency unaffected!
- Message queue guarantees eventual consistency`,
      },
    },

    {
      name: 'Backfill Historical Data',
      type: 'performance',
      requirement: 'FR-2',
      description: 'Copy 10TB of data from MySQL → PostgreSQL without impacting production.',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.7,
      },
      duration: 3600, // 1 hour (representing days of backfill)
      passCriteria: {
        maxErrorRate: 0.01,
        maxP99Latency: 200, // No degradation!
        backfillProgress: 1.0, // 100% complete
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 20 } },
          { type: 'mysql', config: { readCapacity: 10000, writeCapacity: 5000 } },
          { type: 'postgresql', config: { readCapacity: 10000, writeCapacity: 5000 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'mysql' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Backfill without impacting production:

**Challenge:**
- 10TB of data
- 10,000 RPS production traffic
- Can't overload MySQL (primary database!)

**Solution - Throttled backfill:**

**Step 1: Partition data**
- Partition by primary key ranges
- users WHERE id BETWEEN 0 AND 1,000,000
- users WHERE id BETWEEN 1,000,001 AND 2,000,000
- ...

**Step 2: Throttled reads**
# Backfill worker
def backfill_partition(start_id, end_id):
    batch_size = 1000
    throttle_delay = 0.1  # 100ms between batches

    for offset in range(start_id, end_id, batch_size):
        # Read from MySQL (with rate limiting!)
        rows = mysql.execute(f\"\"\"
            SELECT * FROM users
            WHERE id BETWEEN {offset} AND {offset + batch_size}
        \"\"\")

        # Write to PostgreSQL
        postgres.bulk_insert(rows)

        # Throttle to avoid overloading MySQL
        time.sleep(throttle_delay)

**Step 3: Parallel workers (50 workers)**
- Each worker handles one partition
- 10TB ÷ 50 workers = 200GB per worker
- 200GB at 100 MB/sec = 2,000 sec = 33 minutes per worker
- Total: ~1 hour (parallelized!)

**Step 4: Monitor MySQL load**
- Track MySQL CPU/IOPS during backfill
- If load > 70% → increase throttle_delay
- If load < 40% → decrease throttle_delay
- Adaptive throttling!

**Key insight:**
Backfill is non-critical → can take hours/days
Production traffic is critical → must not degrade!`,
      },
    },

    {
      name: 'Consistency Validation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Verify MySQL and PostgreSQL have identical data.',
      traffic: {
        type: 'read',
        rps: 100, // Background validation queries
      },
      duration: 600,
      passCriteria: {
        maxErrorRate: 0,
        consistencyVerified: true,
      },
    },

    {
      name: 'Gradual Traffic Cutover',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Shift reads from MySQL → PostgreSQL gradually (5% → 100%).',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.7,
      },
      duration: 600, // 10 minutes for gradual rollout
      passCriteria: {
        maxErrorRate: 0.02,
        maxP99Latency: 200,
        trafficShifted: 1.0, // 100% to PostgreSQL
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 20 } },
          { type: 'mysql', config: { readCapacity: 10000, writeCapacity: 5000 } },
          { type: 'postgresql', config: { readCapacity: 10000, writeCapacity: 5000 } },
          { type: 'redis', config: { maxMemoryMB: 4096 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'mysql' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'redis' },
        ],
        explanation: `Gradual cutover with canary deployment:

**Cutover schedule:**
- Minute 0: 5% reads from PostgreSQL
- Minute 2: 10%
- Minute 4: 25%
- Minute 6: 50%
- Minute 8: 75%
- Minute 10: 100% ✅

**Feature flag for traffic splitting:**
def get_user(user_id):
    # Check feature flag
    postgres_percentage = feature_flags.get("postgres_read_percentage")  # e.g., 0.25

    # Consistent hashing (same user → same DB)
    hash = murmurhash3(user_id) % 100

    if hash < postgres_percentage * 100:
        # Read from PostgreSQL
        return postgres.query("SELECT * FROM users WHERE id = ?", user_id)
    else:
        # Read from MySQL
        return mysql.query("SELECT * FROM users WHERE id = ?", user_id)

**Monitoring during cutover:**
- Track PostgreSQL error rate
- Track PostgreSQL latency (p50, p99)
- Compare MySQL vs PostgreSQL results (sampling)

**Rollback triggers:**
If PostgreSQL error_rate > 1% → rollback to 0%
If PostgreSQL p99 latency > 300ms → rollback to previous percentage

**Key benefits:**
- Gradual validation (catch issues early)
- Easy rollback (just decrease percentage)
- Per-user consistency (same user → same DB via hashing)`,
      },
    },

    {
      name: 'Rollback on Failure',
      type: 'reliability',
      requirement: 'FR-5',
      description: 'PostgreSQL has high error rate. System rolls back to MySQL.',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.7,
      },
      duration: 300,
      failureInjection: {
        type: 'postgres_errors',
        atSecond: 120,
        errorRate: 0.05, // 5% error rate
      },
      passCriteria: {
        maxErrorRate: 0.02,
        rollbackExecuted: true,
      },
    },
  ],

  learningObjectives: [
    'Design zero-downtime migrations with dual-write',
    'Backfill large datasets without impacting production',
    'Gradual traffic cutover with feature flags',
    'Consistency validation techniques',
    'Rollback strategies for failed migrations',
  ],

  hints: [
    {
      trigger: 'test_failed:Dual-Write Phase',
      message: `💡 Dual-write is doubling write latency!

**Problem - Synchronous dual-write:**
def write_user(user):
    mysql.execute("INSERT ...")  # 10ms
    postgres.execute("INSERT ...")  # 10ms
    # Total: 20ms ❌

**Solution - Async secondary write:**
def write_user(user):
    # Primary write (MySQL) - blocking
    result = mysql.execute("INSERT ...")  # 10ms

    # Secondary write (PostgreSQL) - async!
    queue.publish({"action": "replicate", "data": user})  # 1ms

    return result  # Total: 11ms ✅

**Background worker handles replication:**
while True:
    msg = queue.receive()
    postgres.execute("INSERT ...", msg.data)
    queue.ack(msg)

**Why this works:**
- Application latency unchanged (11ms vs 10ms)
- PostgreSQL replication is async
- Message queue guarantees delivery
- Eventual consistency (typically <1 second)

Add Message Queue for async replication!`,
    },
    {
      trigger: 'test_failed:Backfill Historical Data',
      message: `💡 Backfill is crushing MySQL performance!

**Problem:**
- Backfill reads 100% CPU on MySQL
- Production queries timing out ❌
- User-facing impact!

**Solution - Throttled backfill:**

**1. Rate limiting:**
def backfill():
    for batch in batches:
        rows = mysql.SELECT_batch()
        postgres.INSERT_batch(rows)

        # CRITICAL: Sleep between batches!
        time.sleep(0.1)  # 100ms throttle

**2. Monitor MySQL load:**
mysql_cpu = cloudwatch.get_metric("MySQL_CPU")

if mysql_cpu > 70%:
    throttle_delay = 0.5  # Slow down backfill
elif mysql_cpu < 40%:
    throttle_delay = 0.05  # Speed up backfill

**3. Run during off-peak hours:**
if is_peak_hours():  # 9am-5pm
    throttle_delay = 0.5  # Conservative
else:
    throttle_delay = 0.05  # Aggressive

**4. Use read replicas:**
# Read from MySQL replica (not primary!)
mysql_replica.SELECT_batch()

**Key principle:**
Backfill is non-critical → can take days
Production is critical → must not degrade!`,
    },
    {
      trigger: 'test_failed:Consistency Validation',
      message: `💡 Databases are inconsistent!

**Problem - Missing records:**
MySQL has 1,000,000 users
PostgreSQL has 999,500 users ❌
500 users missing!

**Root causes:**
1. Dual-write failures (queue message lost)
2. Backfill incomplete
3. Race conditions

**Solution - Consistency checker:**

**1. Count validation:**
mysql_count = mysql.execute("SELECT COUNT(*) FROM users")
postgres_count = postgres.execute("SELECT COUNT(*) FROM users")

if mysql_count != postgres_count:
    alert("Row count mismatch!")

**2. Checksum validation:**
# Compute checksum of all rows
mysql_checksum = mysql.execute(\"\"\"
    SELECT MD5(GROUP_CONCAT(id ORDER BY id))
    FROM users
\"\"\")

postgres_checksum = postgres.execute(\"\"\"
    SELECT MD5(STRING_AGG(id::text ORDER BY id))
    FROM users
\"\"\")

if mysql_checksum != postgres_checksum:
    # Data mismatch - run row-by-row comparison
    find_inconsistent_rows()

**3. Sample-based validation:**
# Check 1% of rows (random sample)
for _ in range(10000):
    user_id = random.randint(1, 1_000_000)

    mysql_row = mysql.execute("SELECT * FROM users WHERE id = ?", user_id)
    postgres_row = postgres.execute("SELECT * FROM users WHERE id = ?", user_id)

    if mysql_row != postgres_row:
        alert(f"Row {user_id} inconsistent!")

**Run validation continuously during migration!**`,
    },
  ],

  pythonTemplate: `# Zero-Downtime Database Migration
# Implement dual-write, backfill, and gradual cutover

import time
import random
import hashlib

def dual_write(operation: str, table: str, data: dict, context: dict) -> dict:
    """
    Write to both MySQL (primary) and PostgreSQL (secondary).

    Args:
        operation: 'insert', 'update', 'delete'
        table: Table name
        data: Row data
        context: Shared context

    Returns:
        {'success': True, 'primary': 'mysql', 'secondary_queued': True}

    Requirements:
    - Write to MySQL (blocking) - source of truth
    - Queue write to PostgreSQL (async via message queue)
    - Return immediately after MySQL write
    - Total latency: ~10ms (same as before migration)
    """
    # Primary write (MySQL) - blocking
    if operation == 'insert':
        result = context['mysql'].execute(f"INSERT INTO {table} ...", data)
    elif operation == 'update':
        result = context['mysql'].execute(f"UPDATE {table} ...", data)
    elif operation == 'delete':
        result = context['mysql'].execute(f"DELETE FROM {table} ...", data)

    # Secondary write (PostgreSQL) - async via queue
    context['queue'].publish({
        'action': 'replicate_write',
        'operation': operation,
        'table': table,
        'data': data
    })

    return {'success': True, 'primary': 'mysql', 'secondary_queued': True}


def backfill_partition(table: str, start_id: int, end_id: int, context: dict) -> dict:
    """
    Backfill one partition of data from MySQL → PostgreSQL.

    Args:
        table: Table to backfill
        start_id: Start of ID range
        end_id: End of ID range
        context: Shared context

    Returns:
        {'rows_copied': 100000, 'duration_sec': 120}

    Requirements:
    - Read from MySQL in batches (1000 rows)
    - Throttle reads (sleep 100ms between batches)
    - Write to PostgreSQL (bulk insert)
    - Monitor MySQL load, adjust throttle dynamically
    """
    batch_size = 1000
    throttle_delay = 0.1  # 100ms
    rows_copied = 0

    for offset in range(start_id, end_id, batch_size):
        # Read batch from MySQL
        rows = context['mysql'].execute(f\"\"\"
            SELECT * FROM {table}
            WHERE id BETWEEN {offset} AND {offset + batch_size - 1}
        \"\"\")

        # Write to PostgreSQL
        if rows:
            context['postgres'].bulk_insert(table, rows)
            rows_copied += len(rows)

        # Throttle to avoid overloading MySQL
        time.sleep(throttle_delay)

        # Dynamic throttling based on MySQL load
        mysql_cpu = context.get_metric('mysql_cpu_percent')
        if mysql_cpu > 70:
            throttle_delay = 0.5  # Slow down
        elif mysql_cpu < 40:
            throttle_delay = 0.05  # Speed up

    return {'rows_copied': rows_copied}


def validate_consistency(table: str, context: dict) -> dict:
    """
    Validate MySQL and PostgreSQL have same data.

    Args:
        table: Table to validate
        context: Shared context

    Returns:
        {
            'consistent': True,
            'mysql_count': 1000000,
            'postgres_count': 1000000,
            'sample_checks': 1000,
            'mismatches': 0
        }

    Requirements:
    - Count rows in both databases
    - Sample 1000 random rows, compare values
    - Return detailed validation report
    """
    # Count validation
    mysql_count = context['mysql'].execute(f"SELECT COUNT(*) FROM {table}")[0][0]
    postgres_count = context['postgres'].execute(f"SELECT COUNT(*) FROM {table}")[0][0]

    # Sample validation
    sample_size = 1000
    mismatches = 0

    for _ in range(sample_size):
        # Random ID
        random_id = random.randint(1, mysql_count)

        # Fetch from both
        mysql_row = context['mysql'].execute(f"SELECT * FROM {table} WHERE id = {random_id}")
        postgres_row = context['postgres'].execute(f"SELECT * FROM {table} WHERE id = {random_id}")

        if mysql_row != postgres_row:
            mismatches += 1

    consistent = (mysql_count == postgres_count and mismatches == 0)

    return {
        'consistent': consistent,
        'mysql_count': mysql_count,
        'postgres_count': postgres_count,
        'sample_checks': sample_size,
        'mismatches': mismatches
    }


def gradual_cutover(operation: str, percentage: float, context: dict) -> str:
    """
    Route traffic based on cutover percentage.

    Args:
        operation: 'read' or 'write'
        percentage: Percentage of traffic to PostgreSQL (0.0 to 1.0)
        context: Shared context

    Returns:
        'mysql' or 'postgres'

    Requirements:
    - For writes: Always MySQL (then async to PostgreSQL)
    - For reads: Route based on percentage with consistent hashing
    - Same entity_id always goes to same DB (consistency)
    """
    if operation == 'write':
        # Writes always go to MySQL (dual-write handles PostgreSQL)
        return 'mysql'

    # Reads: Use consistent hashing
    # Get entity ID from context (e.g., user_id)
    entity_id = context.get('entity_id', '')

    # Hash to 0-99
    hash_value = int(hashlib.md5(entity_id.encode()).hexdigest(), 16) % 100

    # Route based on percentage
    if hash_value < percentage * 100:
        return 'postgres'
    else:
        return 'mysql'


# Replication worker (background)
def replication_worker(context: dict):
    """
    Background worker that replicates writes to PostgreSQL.

    Requirements:
    - Pull messages from queue
    - Execute write on PostgreSQL
    - Retry on failure (exponential backoff)
    - Ack message on success
    """
    while True:
        msg = context['queue'].receive(timeout=30)
        if not msg:
            continue

        try:
            # Execute write on PostgreSQL
            operation = msg['operation']
            table = msg['table']
            data = msg['data']

            if operation == 'insert':
                context['postgres'].execute(f"INSERT INTO {table} ...", data)
            elif operation == 'update':
                context['postgres'].execute(f"UPDATE {table} ...", data)
            elif operation == 'delete':
                context['postgres'].execute(f"DELETE FROM {table} ...", data)

            # Success - ack message
            context['queue'].ack(msg)

        except Exception as e:
            # Failure - retry with backoff
            context['queue'].retry(msg, delay=5)


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle requests during migration."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # Determine read/write
    operation = 'read' if method == 'GET' else 'write'

    # Get cutover percentage from feature flag
    cutover_percentage = context['feature_flags'].get('postgres_percentage', 0.0)

    # Route to correct database
    target_db = gradual_cutover(operation, cutover_percentage, context)

    if operation == 'write':
        # Dual-write
        return dual_write('insert', 'users', body, context)
    else:
        # Read from target DB
        if target_db == 'mysql':
            result = context['mysql'].execute("SELECT ...")
        else:
            result = context['postgres'].execute("SELECT ...")

        return {'status': 200, 'body': result}
`,
};
