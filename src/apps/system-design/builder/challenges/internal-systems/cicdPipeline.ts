import { Challenge } from '../../types/testCase';

export const cicdPipelineChallenge: Challenge = {
  id: 'cicd_pipeline',
  title: 'CI/CD Pipeline Orchestrator',
  difficulty: 'advanced',
  description: `Design an internal CI/CD pipeline orchestration system for running tests,
builds, and deployments across thousands of commits per day.

The system must:
- Run tests in parallel across multiple machines
- Detect and quarantine flaky tests
- Support canary deployments with automatic rollback
- Provide real-time build status to engineers

Example workflow:
- Engineer pushes commit → Trigger pipeline
- Run 10,000 unit tests in parallel (complete in <5 min)
- If tests pass, build artifacts
- Deploy to canary (5% traffic)
- Monitor metrics for 10 minutes
- Auto-rollback if error rate spikes

Key challenges:
- Test parallelization (10K tests → 5 min = 2K parallel workers)
- Flaky test detection (tests that pass/fail randomly)
- Resource scheduling (limited build machines)
- Real-time status updates for engineers`,

  requirements: {
    functional: [
      'Trigger builds on git push',
      'Parallel test execution (10K tests in <5 minutes)',
      'Flaky test detection and quarantine',
      'Canary deployments with health checks',
      'Automatic rollback on failures',
      'Real-time build status dashboard',
    ],
    traffic: '1,000 builds/day (~12 builds/min peak), 50 concurrent builds',
    latency: 'p99 < 5 minutes for test suite, < 1s for status updates',
    availability: '99.9% uptime (blocks deployments if down)',
    budget: '$5,000/month',
  },

  availableComponents: [
    'client',
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
      name: 'Basic Pipeline Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'System can trigger builds, run tests, and report status.',
      traffic: {
        type: 'write',
        rps: 5, // 5 builds/min
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500 } },
          { type: 'message_queue', config: { maxThroughput: 10000 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Basic CI/CD architecture:
- Message Queue: Distribute test tasks to workers
- S3: Store build artifacts and logs
- PostgreSQL: Store build metadata, test results
- App Servers: Orchestrate pipeline stages`,
      },
    },

    {
      name: 'Parallel Test Execution',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Run 10,000 tests in parallel across workers, complete in <5 minutes.',
      traffic: {
        type: 'write',
        rps: 50, // 50 concurrent builds × 200 tests/sec per build
      },
      duration: 300, // 5 minutes
      passCriteria: {
        maxErrorRate: 0.01,
        maxP99Latency: 300000, // 5 minutes in ms
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 2000 } },
          { type: 'message_queue', config: { maxThroughput: 50000 } },
          { type: 'redis', config: { maxMemoryMB: 4096 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Parallel test execution strategy:

**Challenge:**
- 10,000 tests × 30 seconds average = 83 hours sequential ❌
- Need to complete in 5 minutes!

**Solution:**
- Shard tests into 2,000 parallel workers
- 10,000 tests ÷ 2,000 workers = 5 tests per worker
- 5 tests × 30 sec = 150 seconds < 5 minutes ✅

**Architecture:**
- Message Queue: Distributes test shards to workers (fan-out)
- Workers: Pull test tasks from queue, execute, report results
- Redis: Aggregate test results in real-time
- PostgreSQL: Store final test report

**Key insight:**
Message queue enables horizontal scaling of test execution!`,
      },
    },

    {
      name: 'Flaky Test Detection',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Detect tests that fail intermittently (pass 70% of time) and quarantine them.',
      traffic: {
        type: 'mixed',
        rps: 30,
        readRatio: 0.4,
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0.01,
      },
    },

    {
      name: 'Canary Deployment',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Deploy to 5% of traffic, monitor error rates, rollback if errors increase.',
      traffic: {
        type: 'mixed',
        rps: 20,
        readRatio: 0.5,
      },
      duration: 600, // 10 minutes for canary monitoring
      passCriteria: {
        maxErrorRate: 0.01,
      },
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Release Week Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'During release week, build frequency 3x (150 builds/hour, 100+ concurrent).',
      traffic: {
        type: 'write',
        rps: 100, // 100 concurrent builds
      },
      duration: 300,
      passCriteria: {
        maxP99Latency: 400000, // 6-7 minutes acceptable during peak
        maxErrorRate: 0.03,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Worker Failure During Test Run',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: '20% of test workers crash mid-execution. System must retry failed shards.',
      traffic: {
        type: 'write',
        rps: 50,
      },
      duration: 300,
      failureInjection: {
        type: 'worker_crash',
        atSecond: 60,
        affectedPercentage: 0.2,
      },
      passCriteria: {
        maxErrorRate: 0.05, // Some retries needed
        minAvailability: 0.95,
      },
    },

    {
      name: 'Database Failure During Build',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'Database fails during active builds. System must failover and preserve build state.',
      traffic: {
        type: 'write',
        rps: 30,
      },
      duration: 180,
      failureInjection: {
        type: 'db_crash',
        atSecond: 60,
      },
      passCriteria: {
        minAvailability: 0.98,
        maxErrorRate: 0.1,
      },
    },
  ],

  learningObjectives: [
    'Design distributed task execution with message queues',
    'Implement test parallelization strategies',
    'Handle worker failures with retry mechanisms',
    'Aggregate results from thousands of workers',
    'Real-time progress tracking for long-running jobs',
  ],

  hints: [
    {
      trigger: 'test_failed:Parallel Test Execution',
      message: `💡 Tests are running sequentially instead of parallel!

**Problem:**
10,000 tests × 30 sec = 83 hours ❌

**Solution - Test Sharding:**
1. Split tests into shards (groups of 5-10 tests)
2. Publish shards to message queue
3. Workers pull shards and execute in parallel
4. Aggregate results in real-time (Redis)

**Example:**
- 10,000 tests → 2,000 shards of 5 tests each
- 2,000 workers pull from queue simultaneously
- Complete in 5 minutes ✅

Add a Message Queue to distribute work!`,
    },
    {
      trigger: 'test_failed:Flaky Test Detection',
      message: `💡 Flaky tests are ruining developer productivity!

**Problem:**
- Flaky test fails randomly (70% pass rate)
- Engineer re-runs 3 times to get green build
- Wastes 30+ minutes per build

**Solution:**
1. Track test pass/fail history (last 100 runs)
2. Calculate success rate per test
3. If < 90% success rate → quarantine test
4. Notify test owner to fix

**Implementation:**
Store test results in database:
{test_name: "test_checkout", runs: 100, passes: 72, success_rate: 0.72}

If success_rate < 0.90 → mark as flaky, skip in CI`,
    },
    {
      trigger: 'test_failed:Worker Failure During Test Run',
      message: `💡 Worker crashes are losing test results!

**Problem:**
- Worker crashes while running tests
- Tests on that worker are lost
- Build reports incomplete results ❌

**Solution - Retry with Timeouts:**
1. Worker pulls test shard from queue
2. Worker "claims" the shard (visibility timeout)
3. If worker doesn't report results in 5 min → timeout
4. Queue makes shard visible again → another worker retries

**Message Queue Feature:**
Most queues (SQS, RabbitMQ) support visibility timeout for exactly this use case!`,
    },
  ],

  pythonTemplate: `# CI/CD Pipeline Orchestrator
# Implement test sharding and result aggregation

def trigger_build(commit_hash: str, context: dict) -> dict:
    """
    Trigger a new build for a commit.

    Args:
        commit_hash: Git commit SHA
        context: Shared context

    Returns:
        {
            'build_id': 'build_123',
            'commit': 'abc123',
            'status': 'running',
            'test_shards': 2000,
            'started_at': 1234567890
        }

    Requirements:
    - Create build record in database
    - Shard tests into parallel tasks (2000 shards)
    - Publish test shards to message queue
    - Return build metadata
    """
    # Your code here

    return {}


def execute_test_shard(shard_id: str, tests: list, context: dict) -> dict:
    """
    Execute a shard of tests (called by worker).

    Args:
        shard_id: Test shard identifier
        tests: List of test names in this shard
        context: Shared context

    Returns:
        {
            'shard_id': 'shard_456',
            'total_tests': 5,
            'passed': 4,
            'failed': 1,
            'failed_tests': ['test_checkout'],
            'duration_ms': 45000
        }

    Requirements:
    - Run each test in the shard
    - Collect pass/fail results
    - Update build progress in Redis (atomic increment)
    - Return results
    """
    # Your code here

    return {}


def aggregate_test_results(build_id: str, context: dict) -> dict:
    """
    Aggregate results from all test shards.

    Args:
        build_id: Build identifier
        context: Shared context

    Returns:
        {
            'build_id': 'build_123',
            'total_tests': 10000,
            'passed': 9850,
            'failed': 150,
            'flaky': 25,
            'success_rate': 0.985,
            'status': 'failed'  # < 100% success
        }

    Requirements:
    - Fetch all shard results from Redis
    - Calculate aggregate metrics
    - Detect flaky tests (success rate < 90%)
    - Store final results in database
    """
    # Your code here

    return {}


def detect_flaky_tests(test_name: str, context: dict) -> bool:
    """
    Detect if a test is flaky based on historical pass rate.

    Args:
        test_name: Name of the test
        context: Shared context

    Returns:
        True if flaky (success rate < 90% over last 100 runs)

    Requirements:
    - Query test history from database
    - Calculate success rate: passes / total_runs
    - Return True if < 90% success rate
    """
    # Your code here

    return False


def canary_deploy(build_id: str, traffic_percentage: float, context: dict) -> dict:
    """
    Deploy build to canary environment with limited traffic.

    Args:
        build_id: Build to deploy
        traffic_percentage: Percentage of traffic (e.g., 0.05 for 5%)
        context: Shared context

    Returns:
        {
            'deployment_id': 'deploy_789',
            'build_id': 'build_123',
            'traffic_percentage': 0.05,
            'status': 'monitoring',
            'health_check_interval_sec': 60
        }

    Requirements:
    - Deploy to canary servers
    - Route specified traffic percentage
    - Monitor error rates every 60 seconds
    - Auto-rollback if error rate > 2× baseline
    """
    # Your code here

    return {}


# Worker Handler (runs on test execution machines)
def worker_loop(context: dict):
    """
    Continuously pull test shards from queue and execute.

    Requirements:
    - Pull from message queue (blocking wait)
    - Execute test shard
    - Report results to Redis
    - Delete message from queue (ack)
    - Handle timeouts and retries
    """
    while True:
        # Pull shard from queue
        message = context['queue'].receive(timeout=30)
        if not message:
            continue

        shard_id = message['shard_id']
        tests = message['tests']

        # Execute tests
        results = execute_test_shard(shard_id, tests, context)

        # Report results
        context.redis.lpush(f"build:{message['build_id']}:results", results)

        # Ack message (remove from queue)
        context['queue'].delete(message)


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle CI/CD API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})

    # POST /builds - Trigger build
    if method == 'POST' and path == '/builds':
        commit = body.get('commit', '')
        build = trigger_build(commit, context)
        return {'status': 201, 'body': build}

    # GET /builds/:id - Get build status
    elif method == 'GET' and path.startswith('/builds/'):
        build_id = path.split('/')[-1]
        results = aggregate_test_results(build_id, context)
        return {'status': 200, 'body': results}

    # POST /deploy/canary - Canary deployment
    elif method == 'POST' and path == '/deploy/canary':
        build_id = body.get('build_id', '')
        traffic = body.get('traffic_percentage', 0.05)
        deployment = canary_deploy(build_id, traffic, context)
        return {'status': 201, 'body': deployment}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
