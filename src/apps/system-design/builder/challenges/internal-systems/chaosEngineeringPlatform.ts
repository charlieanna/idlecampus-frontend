/**
 * L4-L5 Internal Systems: Chaos Engineering Platform
 *
 * Design a chaos engineering platform for controlled failure injection to test system resilience.
 * Similar to Netflix Chaos Monkey, this enables teams to proactively find weaknesses
 * before they cause incidents in production.
 *
 * Real-world examples:
 * - Netflix Chaos Monkey: Random instance termination
 * - AWS Fault Injection Simulator: Managed chaos experiments
 * - Gremlin: Enterprise chaos engineering platform
 *
 * Companies: Netflix, Amazon, Google, Uber
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Observability & Operations
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Experiment Management
 *    - Define experiments (target services, failure types, duration)
 *    - Schedule experiments (one-time, recurring)
 *    - Start/stop/abort experiments
 *    - Blast radius control (% of instances, specific regions)
 *
 * 2. Failure Injection Types
 *    - Instance termination (kill EC2/K8s pods)
 *    - Network failures (latency, packet loss, partition)
 *    - Resource exhaustion (CPU spike, memory leak, disk fill)
 *    - Dependency failures (block external API calls)
 *
 * 3. Safety Controls
 *    - Pre-flight checks (health metrics, on-call presence, business hours)
 *    - Automatic rollback (if SLO breach detected)
 *    - Manual abort (kill switch)
 *    - Blast radius limits (max % of fleet, canary first)
 *
 * 4. Impact Measurement
 *    - Real-time metrics (error rate, latency, availability)
 *    - Before/after comparison (did alerts fire? was failover successful?)
 *    - Hypothesis validation ("If we kill 10% of instances, traffic should route to healthy ones")
 *    - Incident correlation (did chaos cause a real incident?)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Start experiment: <5 seconds
 * - Abort experiment: <1 second (emergency stop)
 * - Metrics collection: 1-second granularity during experiment
 * - Support 1000 concurrent experiments across all teams
 *
 * Scalability (NFR-S):
 * - 10,000 target instances per experiment
 * - 100 experiments/day per team
 * - 500 teams using platform
 * - 6-month retention of experiment results
 *
 * Reliability (NFR-R):
 * - Blast radius enforcement: 100% (never exceed limits)
 * - Rollback latency: p99 < 10 seconds
 * - Platform availability: 99.95% (chaos platform cannot go down during chaos!)
 * - Audit trail: 100% of actions logged (who ran what, when)
 *
 * Cost (NFR-C):
 * - Infrastructure: $20K/month (metrics, storage, control plane)
 * - No additional cost for failure injection (use existing orchestrators)
 */

const pythonTemplate = `"""
Chaos Engineering Platform - Reference Implementation

Architecture:
1. Experiment Service (CRUD, scheduling, validation)
2. Execution Engine (apply failures, monitor, rollback)
3. Metrics Collector (pre/during/post experiment metrics)
4. Safety Controller (pre-flight checks, blast radius, abort)

Key concepts:
- Blast radius: Limit failure scope (10% of instances, canary region first)
- Steady state hypothesis: Define expected behavior during chaos
- Pre-flight checks: Verify system health before injecting chaos
- Automated rollback: Abort if SLO breach detected
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import time

def create_experiment(experiment_config: dict, context: dict) -> dict:
    """
    Create a chaos experiment with safety validations.

    Args:
        experiment_config: {
            'name': 'kill-10-percent-api-instances',
            'target_service': 'api-gateway',
            'failure_type': 'instance_termination',
            'blast_radius': {'percentage': 10, 'region': 'us-west-2'},
            'duration_minutes': 15,
            'hypothesis': 'Traffic should route to healthy instances with <5% error rate increase',
            'rollback_conditions': [
                {'metric': 'error_rate', 'threshold': 5.0},  # 5% error rate
                {'metric': 'p99_latency_ms', 'threshold': 500}
            ]
        }
        context: {
            'db': Database connection,
            'orchestrator': K8s/EC2 orchestrator,
            'metrics': Metrics API,
            'redis': Cache
        }

    Returns:
        {'experiment_id': 'exp_123', 'status': 'scheduled'}

    Test cases covered:
    - TC1: Basic experiment creation
    - TC5: Blast radius enforcement
    """
    # Validate blast radius limits (safety control)
    max_blast_radius = context['config'].get('max_blast_radius_percentage', 25)
    if experiment_config['blast_radius']['percentage'] > max_blast_radius:
        raise ValueError(f"Blast radius {experiment_config['blast_radius']['percentage']}% exceeds limit {max_blast_radius}%")

    # Validate target service exists
    service = context['db'].query(
        "SELECT * FROM services WHERE name = ?",
        experiment_config['target_service']
    )
    if not service:
        raise ValueError(f"Service {experiment_config['target_service']} not found")

    # Create experiment record
    experiment_id = f"exp_{int(time.time() * 1000)}"

    context['db'].execute("""
        INSERT INTO experiments
        (id, name, target_service, failure_type, blast_radius, duration_minutes,
         hypothesis, rollback_conditions, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        experiment_id,
        experiment_config['name'],
        experiment_config['target_service'],
        experiment_config['failure_type'],
        experiment_config['blast_radius'],
        experiment_config['duration_minutes'],
        experiment_config['hypothesis'],
        experiment_config['rollback_conditions'],
        'scheduled',
        datetime.now()
    )

    # Audit log (100% of actions logged)
    context['db'].execute("""
        INSERT INTO experiment_audit_log (experiment_id, action, user, timestamp)
        VALUES (?, ?, ?, ?)
    """, experiment_id, 'created', context.get('user', 'system'), datetime.now())

    return {
        'experiment_id': experiment_id,
        'status': 'scheduled',
        'validation': {
            'blast_radius_ok': True,
            'service_exists': True
        }
    }


def run_pre_flight_checks(experiment_id: str, context: dict) -> dict:
    """
    Run safety checks before starting chaos experiment.

    Checks:
    1. Service health: Error rate < baseline, latency normal
    2. On-call presence: Someone is available to respond
    3. Business hours: Don't run during peak traffic (optional)
    4. Recent incidents: No active P0/P1 incidents

    Args:
        experiment_id: Experiment to validate
        context: Runtime context

    Returns:
        {'passed': True/False, 'checks': {...}, 'failures': [...]}

    Test cases covered:
    - TC2: Pre-flight check failure prevention
    """
    experiment = context['db'].query(
        "SELECT * FROM experiments WHERE id = ?",
        experiment_id
    )[0]

    checks = {}
    failures = []

    # Check 1: Service health
    service_metrics = context['metrics'].query(
        service=experiment['target_service'],
        metrics=['error_rate', 'p99_latency'],
        lookback_minutes=15
    )

    baseline_error_rate = 1.0  # 1% baseline
    if service_metrics['error_rate'] > baseline_error_rate:
        failures.append(f"Service error rate {service_metrics['error_rate']:.2f}% exceeds baseline {baseline_error_rate}%")
        checks['service_health'] = False
    else:
        checks['service_health'] = True

    # Check 2: On-call presence
    on_call = context['pagerduty'].get_on_call(
        service=experiment['target_service']
    )

    if not on_call or len(on_call) == 0:
        failures.append("No on-call engineer available")
        checks['on_call_present'] = False
    else:
        checks['on_call_present'] = True

    # Check 3: Active incidents
    active_incidents = context['db'].query("""
        SELECT COUNT(*) as count FROM incidents
        WHERE service = ? AND status IN ('open', 'investigating')
        AND severity IN ('P0', 'P1')
    """, experiment['target_service'])[0]['count']

    if active_incidents > 0:
        failures.append(f"{active_incidents} active P0/P1 incidents")
        checks['no_active_incidents'] = False
    else:
        checks['no_active_incidents'] = True

    # Overall pass/fail
    passed = len(failures) == 0

    # Log pre-flight results
    context['db'].execute("""
        INSERT INTO experiment_audit_log
        (experiment_id, action, details, timestamp)
        VALUES (?, ?, ?, ?)
    """, experiment_id, 'pre_flight_check', {'passed': passed, 'checks': checks, 'failures': failures}, datetime.now())

    return {
        'passed': passed,
        'checks': checks,
        'failures': failures
    }


def start_experiment(experiment_id: str, context: dict) -> dict:
    """
    Start chaos experiment with controlled failure injection.

    Steps:
    1. Run pre-flight checks
    2. Collect baseline metrics (5 minutes before)
    3. Select target instances (respecting blast radius)
    4. Inject failure
    5. Start monitoring for rollback conditions

    Args:
        experiment_id: Experiment to start
        context: Runtime context

    Returns:
        {
            'experiment_id': 'exp_123',
            'status': 'running',
            'started_at': '2024-01-15T10:00:00Z',
            'target_instances': ['i-abc123', 'i-def456'],
            'monitoring': {'metrics': [...], 'rollback_conditions': [...]}
        }

    Test cases covered:
    - TC1: Start experiment and inject failures
    - TC3: Automatic rollback on SLO breach
    """
    # Pre-flight checks
    pre_flight = run_pre_flight_checks(experiment_id, context)
    if not pre_flight['passed']:
        context['db'].execute(
            "UPDATE experiments SET status = ? WHERE id = ?",
            'failed_pre_flight', experiment_id
        )
        return {
            'experiment_id': experiment_id,
            'status': 'failed_pre_flight',
            'pre_flight_failures': pre_flight['failures']
        }

    experiment = context['db'].query(
        "SELECT * FROM experiments WHERE id = ?",
        experiment_id
    )[0]

    # Collect baseline metrics (5 min before)
    baseline_metrics = context['metrics'].query(
        service=experiment['target_service'],
        metrics=['error_rate', 'p99_latency', 'qps'],
        lookback_minutes=5
    )

    context['db'].execute("""
        UPDATE experiments
        SET baseline_metrics = ?, status = 'running', started_at = ?
        WHERE id = ?
    """, baseline_metrics, datetime.now(), experiment_id)

    # Select target instances (blast radius enforcement)
    all_instances = context['orchestrator'].list_instances(
        service=experiment['target_service'],
        region=experiment['blast_radius'].get('region')
    )

    blast_radius_pct = experiment['blast_radius']['percentage']
    num_targets = max(1, int(len(all_instances) * blast_radius_pct / 100))

    # Select instances (random or canary)
    import random
    target_instances = random.sample(all_instances, num_targets)

    # Inject failure based on type
    if experiment['failure_type'] == 'instance_termination':
        for instance in target_instances:
            context['orchestrator'].terminate_instance(instance['id'])

    elif experiment['failure_type'] == 'network_latency':
        # Inject 100ms latency via iptables/tc
        for instance in target_instances:
            context['orchestrator'].exec_command(
                instance['id'],
                "tc qdisc add dev eth0 root netem delay 100ms"
            )

    elif experiment['failure_type'] == 'cpu_spike':
        # Stress CPU to 80%
        for instance in target_instances:
            context['orchestrator'].exec_command(
                instance['id'],
                "stress-ng --cpu 4 --timeout 900s &"
            )

    # Store target instances
    context['redis'].setex(
        f"experiment:{experiment_id}:targets",
        experiment['duration_minutes'] * 60,
        target_instances
    )

    # Start monitoring thread (check rollback conditions every 10s)
    context['scheduler'].schedule_recurring(
        function=check_rollback_conditions,
        args={'experiment_id': experiment_id},
        interval_seconds=10,
        duration_seconds=experiment['duration_minutes'] * 60
    )

    # Audit log
    context['db'].execute("""
        INSERT INTO experiment_audit_log
        (experiment_id, action, details, timestamp)
        VALUES (?, ?, ?, ?)
    """,
        experiment_id,
        'started',
        {'target_instances': [i['id'] for i in target_instances], 'num_targets': num_targets},
        datetime.now()
    )

    return {
        'experiment_id': experiment_id,
        'status': 'running',
        'started_at': datetime.now().isoformat(),
        'target_instances': [i['id'] for i in target_instances],
        'blast_radius_actual': f"{num_targets}/{len(all_instances)} ({blast_radius_pct}%)",
        'monitoring': {
            'check_interval_seconds': 10,
            'rollback_conditions': experiment['rollback_conditions']
        }
    }


def check_rollback_conditions(experiment_id: str, context: dict) -> dict:
    """
    Monitor experiment and trigger automatic rollback if SLO breached.

    Called every 10 seconds during experiment.

    Args:
        experiment_id: Experiment to monitor
        context: Runtime context

    Returns:
        {'should_rollback': True/False, 'breached_conditions': [...]}

    Test cases covered:
    - TC3: Automatic rollback on SLO breach
    """
    experiment = context['db'].query(
        "SELECT * FROM experiments WHERE id = ?",
        experiment_id
    )[0]

    if experiment['status'] != 'running':
        return {'should_rollback': False, 'reason': 'experiment not running'}

    # Get current metrics
    current_metrics = context['metrics'].query(
        service=experiment['target_service'],
        metrics=['error_rate', 'p99_latency'],
        lookback_minutes=1  # Last 1 minute
    )

    # Check rollback conditions
    breached_conditions = []
    for condition in experiment['rollback_conditions']:
        metric_value = current_metrics.get(condition['metric'])

        if metric_value and metric_value > condition['threshold']:
            breached_conditions.append({
                'metric': condition['metric'],
                'current': metric_value,
                'threshold': condition['threshold']
            })

    # Trigger rollback if any condition breached
    if breached_conditions:
        abort_experiment(experiment_id, context, reason='slo_breach', details=breached_conditions)
        return {
            'should_rollback': True,
            'breached_conditions': breached_conditions
        }

    return {'should_rollback': False}


def abort_experiment(experiment_id: str, context: dict, reason: str = 'manual', details: dict = None) -> dict:
    """
    Emergency stop: Immediately stop chaos experiment and restore normal state.

    Must complete in <1 second (NFR-P).

    Args:
        experiment_id: Experiment to abort
        context: Runtime context
        reason: 'manual', 'slo_breach', 'error'
        details: Additional context

    Returns:
        {
            'experiment_id': 'exp_123',
            'status': 'aborted',
            'reason': 'slo_breach',
            'abort_duration_ms': 850
        }

    Test cases covered:
    - TC3: Automatic rollback
    - TC4: Manual abort (kill switch)
    """
    start_time = time.time()

    experiment = context['db'].query(
        "SELECT * FROM experiments WHERE id = ?",
        experiment_id
    )[0]

    target_instances = context['redis'].get(f"experiment:{experiment_id}:targets")

    # Restore normal state based on failure type
    if experiment['failure_type'] == 'instance_termination':
        # Instances already terminated - orchestrator will auto-scale
        pass

    elif experiment['failure_type'] == 'network_latency':
        # Remove latency injection
        for instance in target_instances:
            context['orchestrator'].exec_command(
                instance['id'],
                "tc qdisc del dev eth0 root"
            )

    elif experiment['failure_type'] == 'cpu_spike':
        # Kill stress process
        for instance in target_instances:
            context['orchestrator'].exec_command(
                instance['id'],
                "pkill -9 stress-ng"
            )

    # Update experiment status
    context['db'].execute("""
        UPDATE experiments
        SET status = ?, aborted_at = ?, abort_reason = ?
        WHERE id = ?
    """, 'aborted', datetime.now(), reason, experiment_id)

    # Audit log
    context['db'].execute("""
        INSERT INTO experiment_audit_log
        (experiment_id, action, details, timestamp)
        VALUES (?, ?, ?, ?)
    """,
        experiment_id,
        'aborted',
        {'reason': reason, 'details': details},
        datetime.now()
    )

    # Stop monitoring
    context['scheduler'].cancel_job(f"monitor_{experiment_id}")

    abort_duration_ms = (time.time() - start_time) * 1000

    return {
        'experiment_id': experiment_id,
        'status': 'aborted',
        'reason': reason,
        'abort_duration_ms': abort_duration_ms,
        'restored_instances': len(target_instances) if target_instances else 0
    }


def get_experiment_results(experiment_id: str, context: dict) -> dict:
    """
    Retrieve experiment results with before/after comparison.

    Args:
        experiment_id: Experiment to analyze
        context: Runtime context

    Returns:
        {
            'experiment_id': 'exp_123',
            'hypothesis': '...',
            'validated': True/False,
            'metrics_comparison': {
                'error_rate': {'before': 0.5, 'during': 2.1, 'delta': '+1.6%'},
                'p99_latency': {'before': 150, 'during': 180, 'delta': '+20%'}
            },
            'incidents_triggered': [],
            'learnings': '...'
        }

    Test cases covered:
    - TC6: Impact measurement and hypothesis validation
    """
    experiment = context['db'].query(
        "SELECT * FROM experiments WHERE id = ?",
        experiment_id
    )[0]

    # Get metrics during experiment
    during_metrics = context['metrics'].query(
        service=experiment['target_service'],
        start_time=experiment['started_at'],
        end_time=experiment.get('aborted_at') or experiment.get('completed_at'),
        metrics=['error_rate', 'p99_latency', 'qps']
    )

    baseline = experiment['baseline_metrics']

    # Compare metrics
    metrics_comparison = {}
    for metric in ['error_rate', 'p99_latency', 'qps']:
        before = baseline.get(metric, 0)
        during = during_metrics.get(metric, 0)
        delta_pct = ((during - before) / before * 100) if before > 0 else 0

        metrics_comparison[metric] = {
            'before': before,
            'during': during,
            'delta': f"{delta_pct:+.1f}%"
        }

    # Check if incidents were triggered
    incidents = context['db'].query("""
        SELECT * FROM incidents
        WHERE service = ?
        AND created_at BETWEEN ? AND ?
    """,
        experiment['target_service'],
        experiment['started_at'],
        experiment.get('aborted_at') or experiment.get('completed_at')
    )

    # Hypothesis validation (simple keyword matching)
    # In production, use more sophisticated validation
    hypothesis_validated = True
    if 'error rate' in experiment['hypothesis'].lower():
        expected_increase = 5.0  # Parse from hypothesis
        actual_increase = float(metrics_comparison['error_rate']['delta'].rstrip('%'))
        hypothesis_validated = actual_increase <= expected_increase

    return {
        'experiment_id': experiment_id,
        'name': experiment['name'],
        'hypothesis': experiment['hypothesis'],
        'validated': hypothesis_validated,
        'status': experiment['status'],
        'duration_minutes': (
            (experiment.get('aborted_at') or experiment.get('completed_at')) - experiment['started_at']
        ).total_seconds() / 60,
        'metrics_comparison': metrics_comparison,
        'incidents_triggered': [
            {
                'id': inc['id'],
                'severity': inc['severity'],
                'title': inc['title']
            }
            for inc in incidents
        ],
        'rollback_triggered': experiment['status'] == 'aborted' and experiment.get('abort_reason') == 'slo_breach'
    }


# Example usage
if __name__ == "__main__":
    # Mock context
    context = {
        'db': MockDatabase(),
        'orchestrator': MockOrchestrator(),
        'metrics': MockMetrics(),
        'redis': MockRedis(),
        'pagerduty': MockPagerDuty(),
        'scheduler': MockScheduler(),
        'config': {'max_blast_radius_percentage': 25},
        'user': 'alice@company.com'
    }

    # Create experiment
    exp = create_experiment({
        'name': 'kill-10-percent-api-instances',
        'target_service': 'api-gateway',
        'failure_type': 'instance_termination',
        'blast_radius': {'percentage': 10, 'region': 'us-west-2'},
        'duration_minutes': 15,
        'hypothesis': 'Traffic should route to healthy instances with <5% error rate increase',
        'rollback_conditions': [
            {'metric': 'error_rate', 'threshold': 5.0},
            {'metric': 'p99_latency_ms', 'threshold': 500}
        ]
    }, context)

    print(f"Created experiment: {exp['experiment_id']}")

    # Start experiment
    result = start_experiment(exp['experiment_id'], context)
    print(f"Started experiment: {result['status']}")
    print(f"Blast radius: {result['blast_radius_actual']}")

    # Simulate SLO breach -> automatic rollback
    # (in production, this happens via monitoring thread)

    # Get results
    results = get_experiment_results(exp['experiment_id'], context)
    print(f"Hypothesis validated: {results['validated']}")
    print(f"Metrics: {results['metrics_comparison']}")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Basic experiment lifecycle (create → start → complete)',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Create experiment
exp = create_experiment({
    'name': 'network-latency-test',
    'target_service': 'checkout-service',
    'failure_type': 'network_latency',
    'blast_radius': {'percentage': 15, 'region': 'us-east-1'},
    'duration_minutes': 10,
    'hypothesis': 'System should handle 100ms latency with <10% increase in p99',
    'rollback_conditions': [
        {'metric': 'error_rate', 'threshold': 3.0}
    ]
}, context)

# Start experiment
result = start_experiment(exp['experiment_id'], context)

print(result['status'])
print(result['blast_radius_actual'])
print(len(result['target_instances']))`,
    expectedOutput: `running
15/100 instances (15%)
15`,
    hints: [
      'Create experiment record with scheduled status',
      'Run pre-flight checks before starting',
      'Select target instances respecting blast radius percentage',
      'Inject network latency via orchestrator commands',
      'Start monitoring thread for rollback conditions'
    ],
    testCode: `result = start_experiment(exp['experiment_id'], context)
assert result['status'] == 'running'
assert '15%' in result['blast_radius_actual']
assert len(result['target_instances']) == 15`,
    timeComplexity: 'O(N) where N = number of target instances',
    spaceComplexity: 'O(N) for storing target instance list',
    learningObjectives: [
      'Understand blast radius enforcement for safety',
      'Learn failure injection techniques (network, CPU, instance)',
      'Implement experiment lifecycle management'
    ]
  },
  {
    id: 2,
    name: 'Pre-flight check prevents unsafe experiment',
    difficulty: 'medium',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Simulate unhealthy service (high error rate)
context['metrics'].set_metric('payment-service', 'error_rate', 5.2)  # 5.2% (above 1% baseline)

# Create experiment
exp = create_experiment({
    'name': 'kill-payment-instances',
    'target_service': 'payment-service',
    'failure_type': 'instance_termination',
    'blast_radius': {'percentage': 20},
    'duration_minutes': 10,
    'hypothesis': 'Test failover',
    'rollback_conditions': []
}, context)

# Try to start (should fail pre-flight)
result = start_experiment(exp['experiment_id'], context)

print(result['status'])
print(result['pre_flight_failures'])`,
    expectedOutput: `failed_pre_flight
['Service error rate 5.20% exceeds baseline 1.0%']`,
    hints: [
      'Check service health before starting chaos',
      'Verify on-call engineer is available',
      'Check for active P0/P1 incidents',
      'Fail fast if any pre-flight check fails',
      'Log pre-flight results for audit trail'
    ],
    testCode: `assert result['status'] == 'failed_pre_flight'
assert 'error rate' in result['pre_flight_failures'][0].lower()`,
    timeComplexity: 'O(1) for pre-flight checks',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement safety guardrails for chaos experiments',
      'Understand importance of pre-conditions',
      'Learn to fail fast on unsafe conditions'
    ]
  },
  {
    id: 3,
    name: 'Automatic rollback on SLO breach (NFR-R: p99 <10s rollback)',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Create and start experiment
exp = create_experiment({
    'name': 'cpu-spike-test',
    'target_service': 'search-service',
    'failure_type': 'cpu_spike',
    'blast_radius': {'percentage': 10},
    'duration_minutes': 20,
    'hypothesis': 'System should handle CPU spike',
    'rollback_conditions': [
        {'metric': 'error_rate', 'threshold': 2.0},  # 2% error rate
        {'metric': 'p99_latency', 'threshold': 300}   # 300ms
    ]
}, context)

result = start_experiment(exp['experiment_id'], context)

# Simulate SLO breach (error rate spikes to 3.5%)
context['metrics'].set_metric('search-service', 'error_rate', 3.5)

# Trigger rollback check (would normally run every 10s)
rollback_check = check_rollback_conditions(exp['experiment_id'], context)

print(rollback_check['should_rollback'])
print(rollback_check['breached_conditions'][0]['metric'])
print(rollback_check['breached_conditions'][0]['current'])

# Verify experiment was aborted
exp_status = context['db'].query("SELECT status FROM experiments WHERE id = ?", exp['experiment_id'])[0]
print(exp_status['status'])`,
    expectedOutput: `True
error_rate
3.5
aborted`,
    hints: [
      'Monitor metrics every 10 seconds during experiment',
      'Compare current metrics against rollback thresholds',
      'Call abort_experiment() if any condition breached',
      'Ensure rollback completes in <10 seconds (p99)',
      'Log rollback reason for post-mortem analysis'
    ],
    testCode: `assert rollback_check['should_rollback'] == True
assert rollback_check['breached_conditions'][0]['metric'] == 'error_rate'
assert rollback_check['breached_conditions'][0]['current'] == 3.5
assert exp_status['status'] == 'aborted'`,
    timeComplexity: 'O(1) for rollback check, O(N) for restoring N instances',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement SLO-based automatic rollback',
      'Ensure rollback latency meets NFR (<10s)',
      'Learn to protect production during chaos'
    ]
  },
  {
    id: 4,
    name: 'Manual abort (kill switch) - NFR-P: <1 second abort',
    difficulty: 'medium',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Start experiment
exp = create_experiment({
    'name': 'database-partition-test',
    'target_service': 'user-service',
    'failure_type': 'network_partition',
    'blast_radius': {'percentage': 5},
    'duration_minutes': 30,
    'hypothesis': 'Test DB failover',
    'rollback_conditions': []
}, context)

start_experiment(exp['experiment_id'], context)

# Manual abort (user clicks "STOP" button)
import time
start = time.time()
abort_result = abort_experiment(exp['experiment_id'], context, reason='manual', details={'user': 'bob@company.com'})
duration_ms = (time.time() - start) * 1000

print(abort_result['status'])
print(abort_result['reason'])
print(f"Abort completed in {duration_ms:.0f}ms")
print(abort_result['abort_duration_ms'] < 1000)  # Must be <1 second`,
    expectedOutput: `aborted
manual
Abort completed in 850ms
True`,
    hints: [
      'Provide kill switch for immediate experiment termination',
      'Must complete in <1 second (NFR-P)',
      'Restore all instances to normal state',
      'Remove failure injections (network rules, stress processes)',
      'Log who triggered abort and why'
    ],
    testCode: `assert abort_result['status'] == 'aborted'
assert abort_result['reason'] == 'manual'
assert abort_result['abort_duration_ms'] < 1000  # <1 second`,
    timeComplexity: 'O(N) where N = number of affected instances',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement emergency stop mechanism',
      'Optimize for abort latency (<1s requirement)',
      'Learn to restore normal state quickly'
    ]
  },
  {
    id: 5,
    name: 'Blast radius enforcement (NFR-R: 100% enforcement)',
    difficulty: 'medium',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Try to create experiment with excessive blast radius
try:
    exp = create_experiment({
        'name': 'high-blast-radius-test',
        'target_service': 'core-api',
        'failure_type': 'instance_termination',
        'blast_radius': {'percentage': 50},  # 50% (exceeds 25% limit)
        'duration_minutes': 10,
        'hypothesis': 'Test',
        'rollback_conditions': []
    }, context)
    print("ERROR: Should have rejected")
except ValueError as e:
    print(f"Rejected: {e}")

# Create with valid blast radius
exp = create_experiment({
    'name': 'safe-blast-radius-test',
    'target_service': 'core-api',
    'failure_type': 'instance_termination',
    'blast_radius': {'percentage': 15},  # 15% (within 25% limit)
    'duration_minutes': 10,
    'hypothesis': 'Test',
    'rollback_conditions': []
}, context)

result = start_experiment(exp['experiment_id'], context)
print(f"Started with blast radius: {result['blast_radius_actual']}")`,
    expectedOutput: `Rejected: Blast radius 50% exceeds limit 25%
Started with blast radius: 15/100 (15%)`,
    hints: [
      'Validate blast radius against max limit during creation',
      'Enforce limits at both experiment creation and execution',
      'Never allow exceeding configured max (25% default)',
      '100% enforcement is critical for safety (NFR-R)',
      'Log rejected experiments for security audit'
    ],
    testCode: `# First attempt should raise ValueError
try:
    create_experiment({...}, context)
    assert False, "Should have raised ValueError"
except ValueError:
    pass

# Second attempt should succeed
assert '15%' in result['blast_radius_actual']`,
    timeComplexity: 'O(1) for validation',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Understand blast radius as critical safety control',
      'Implement hard limits to prevent runaway chaos',
      'Learn defense-in-depth (validate at multiple layers)'
    ]
  },
  {
    id: 6,
    name: 'Impact measurement and hypothesis validation',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

# Set baseline metrics
context['metrics'].set_metric('recommendation-service', 'error_rate', 0.8)
context['metrics'].set_metric('recommendation-service', 'p99_latency', 120)

# Create and start experiment
exp = create_experiment({
    'name': 'recommendation-latency-test',
    'target_service': 'recommendation-service',
    'failure_type': 'network_latency',
    'blast_radius': {'percentage': 20},
    'duration_minutes': 15,
    'hypothesis': 'Traffic should route to healthy instances with <5% error rate increase',
    'rollback_conditions': [
        {'metric': 'error_rate', 'threshold': 10.0}
    ]
}, context)

start_experiment(exp['experiment_id'], context)

# Simulate experiment metrics (during chaos)
context['metrics'].set_metric('recommendation-service', 'error_rate', 2.1)   # +1.3% increase
context['metrics'].set_metric('recommendation-service', 'p99_latency', 145)  # +20% increase

# Complete experiment
context['db'].execute("UPDATE experiments SET status = ?, completed_at = ? WHERE id = ?",
                      'completed', datetime.now(), exp['experiment_id'])

# Get results
results = get_experiment_results(exp['experiment_id'], context)

print(results['validated'])
print(results['metrics_comparison']['error_rate'])
print(len(results['incidents_triggered']))`,
    expectedOutput: `True
{'before': 0.8, 'during': 2.1, 'delta': '+162.5%'}
0`,
    hints: [
      'Collect baseline metrics before experiment starts',
      'Capture metrics during experiment execution',
      'Compare before/after to validate hypothesis',
      'Check if any incidents were triggered during experiment',
      'Provide clear delta metrics (percentage change)'
    ],
    testCode: `assert results['validated'] == True
assert results['metrics_comparison']['error_rate']['before'] == 0.8
assert results['metrics_comparison']['error_rate']['during'] == 2.1
assert len(results['incidents_triggered']) == 0`,
    timeComplexity: 'O(M) where M = number of metrics',
    spaceComplexity: 'O(M)',
    learningObjectives: [
      'Measure chaos experiment impact quantitatively',
      'Validate steady-state hypothesis',
      'Learn to correlate chaos with incidents'
    ]
  },
  {
    id: 7,
    name: 'Audit trail (NFR-R: 100% of actions logged)',
    difficulty: 'easy',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Create experiment
exp = create_experiment({
    'name': 'audit-trail-test',
    'target_service': 'billing-service',
    'failure_type': 'instance_termination',
    'blast_radius': {'percentage': 10},
    'duration_minutes': 5,
    'hypothesis': 'Test',
    'rollback_conditions': []
}, context)

# Start experiment
start_experiment(exp['experiment_id'], context)

# Abort experiment
abort_experiment(exp['experiment_id'], context, reason='manual', details={'user': 'alice@company.com'})

# Query audit log
audit_log = context['db'].query(
    "SELECT action FROM experiment_audit_log WHERE experiment_id = ? ORDER BY timestamp",
    exp['experiment_id']
)

for entry in audit_log:
    print(entry['action'])`,
    expectedOutput: `created
pre_flight_check
started
aborted`,
    hints: [
      'Log every action: created, started, aborted, completed',
      'Include who performed action (user ID)',
      'Include what was affected (target instances)',
      'Include when (timestamp)',
      'Use append-only log (never delete audit records)'
    ],
    testCode: `assert len(audit_log) == 4
assert audit_log[0]['action'] == 'created'
assert audit_log[1]['action'] == 'pre_flight_check'
assert audit_log[2]['action'] == 'started'
assert audit_log[3]['action'] == 'aborted'`,
    timeComplexity: 'O(1) per log entry',
    spaceComplexity: 'O(L) where L = number of log entries',
    learningObjectives: [
      'Implement comprehensive audit trail',
      'Understand compliance requirements for chaos',
      'Learn to track who did what and when'
    ]
  },
  {
    id: 8,
    name: 'Scale: 1000 concurrent experiments (NFR-S)',
    difficulty: 'hard',
    category: 'NFR-S',
    input: `context = setup_mock_context()

# Simulate 1000 teams running experiments concurrently
experiments = []
for i in range(1000):
    exp = create_experiment({
        'name': f'team-{i}-experiment',
        'target_service': f'service-{i % 100}',  # 100 services
        'failure_type': 'network_latency',
        'blast_radius': {'percentage': 5},
        'duration_minutes': 10,
        'hypothesis': 'Test',
        'rollback_conditions': []
    }, context)
    experiments.append(exp['experiment_id'])

# Start all experiments
import time
start = time.time()
for exp_id in experiments:
    start_experiment(exp_id, context)
duration = time.time() - start

print(f"Started {len(experiments)} experiments in {duration:.2f}s")
print(f"Avg latency: {duration / len(experiments) * 1000:.0f}ms per experiment")

# Verify all are running
running_count = context['db'].query(
    "SELECT COUNT(*) as count FROM experiments WHERE status = 'running'"
)[0]['count']

print(f"Running experiments: {running_count}")`,
    expectedOutput: `Started 1000 experiments in 45.23s
Avg latency: 45ms per experiment
Running experiments: 1000`,
    hints: [
      'Use database connection pooling for concurrent writes',
      'Batch target instance selection queries',
      'Use message queue for async failure injection',
      'Shard monitoring threads across workers',
      'Keep start latency <5s per experiment (NFR-P)'
    ],
    testCode: `assert duration < 300  # Should complete in <5 minutes
assert duration / len(experiments) < 5  # <5s per experiment
assert running_count == 1000`,
    timeComplexity: 'O(N * I) where N = experiments, I = instances per experiment',
    spaceComplexity: 'O(N * I)',
    learningObjectives: [
      'Scale chaos platform to 1000 concurrent experiments',
      'Optimize database and orchestrator performance',
      'Learn to isolate experiments (no cross-contamination)'
    ]
  }
];

export const chaosEngineeringPlatformChallenge: SystemDesignChallenge = {
  id: 'chaos_engineering_platform',
  title: 'Chaos Engineering Platform',
  difficulty: 'advanced',
  category: 'Observability & Operations',
  description: `Design a chaos engineering platform for controlled failure injection to test system resilience. Similar to Netflix Chaos Monkey, this enables teams to proactively find weaknesses before they cause production incidents.

**Real-world Context:**
- Netflix Chaos Monkey: Randomly terminates EC2 instances to ensure systems handle failures gracefully
- AWS Fault Injection Simulator: Managed chaos experiments for AWS workloads
- Gremlin: Enterprise chaos engineering platform with advanced scenarios

**Key Concepts:**
- Blast radius: Limit failure scope (e.g., 10% of instances, canary region first)
- Steady-state hypothesis: Define expected behavior during chaos ("traffic should route to healthy instances")
- Pre-flight checks: Verify system health, on-call presence before injecting chaos
- Automatic rollback: Abort if SLO breach detected (error rate >5%, latency >500ms)
- Failure types: Instance termination, network latency/partition, resource exhaustion (CPU/memory/disk)

**Scale:**
- 1000 concurrent experiments across all teams
- 10,000 target instances per experiment
- <5s to start experiment, <1s to abort (emergency stop)
- p99 <10s automatic rollback latency

**Companies:** Netflix, Amazon, Google, Uber
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Start with blast radius enforcement - never exceed configured limits',
    'Implement comprehensive pre-flight checks (health, on-call, incidents)',
    'Use async message queue for failure injection (don\'t block API)',
    'Monitor rollback conditions every 10 seconds, abort if SLO breached',
    'Keep abort latency <1 second (emergency stop requirement)',
    'Log 100% of actions for audit trail and post-mortem analysis',
    'Compare before/after metrics to validate hypothesis',
    'Use orchestrator-specific commands (K8s pod delete, EC2 terminate, iptables for network)'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Netflix: Chaos Monkey, Chaos Kong (region failures), FIT (failure injection testing)',
    'Amazon: GameDay exercises, Fault Injection Simulator',
    'Google: DiRT (Disaster Recovery Testing)',
    'Uber: Chaos engineering for ride-matching system',
    'LinkedIn: LiX (experimentation platform with chaos features)'
  ],
  relatedChallenges: [
    'distributed_tracing',
    'alerting_incident_management',
    'multi_region_failover',
    'service_mesh_control_plane'
  ]
};
