/**
 * L4-L5 Internal Systems: Multi-Region Failover
 *
 * Design an automated failover system that detects regional outages and shifts
 * traffic to healthy regions while preventing split-brain scenarios.
 * Critical for maintaining availability during datacenter failures.
 *
 * Real-world examples:
 * - Netflix: Multi-region active-active with Chaos Kong testing
 * - Uber: Regional failover for ride-matching system
 * - Airbnb: Cross-region disaster recovery
 * - Google: Multi-region Spanner with automatic failover
 *
 * Companies: Netflix, Uber, Airbnb, Google, Amazon
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Migration & Reliability
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Health Detection
 *    - Continuous health checks (every 10 seconds)
 *    - Multi-signal detection (API latency, DB latency, error rate)
 *    - Consensus-based failure detection (3/5 health checkers agree)
 *    - Grace period before declaring region unhealthy (2 minutes)
 *
 * 2. Traffic Shifting
 *    - DNS failover (update Route53/CloudFlare DNS records)
 *    - Load balancer failover (shift traffic at LB layer)
 *    - Gradual traffic shift (10% → 50% → 100% over 5 minutes)
 *    - Sticky sessions (route existing users to same region)
 *
 * 3. State Replication
 *    - Real-time replication (replicate writes to standby region)
 *    - Replication lag monitoring (<5 seconds)
 *    - Conflict resolution (last-write-wins, versioning)
 *    - Backfill missing data after failover
 *
 * 4. Split-Brain Prevention
 *    - Distributed consensus (Raft/Paxos for leader election)
 *    - Fencing tokens (prevent zombie primary from accepting writes)
 *    - Quorum-based writes (2/3 regions must acknowledge)
 *    - Automated failback (prevent flip-flopping)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Failover detection: <2 minutes (from outage to detection)
 * - Traffic shift: <5 minutes (from detection to 100% traffic shifted)
 * - DNS propagation: <60 seconds (TTL: 60s)
 * - Total RTO (Recovery Time Objective): <10 minutes
 *
 * Scalability (NFR-S):
 * - 3-5 regions (US-East, US-West, EU, Asia, ...)
 * - 100,000 RPS per region
 * - 10TB database per region
 * - 1M concurrent users redistributed during failover
 *
 * Reliability (NFR-R):
 * - Availability: 99.99% (includes failover events)
 * - Data loss: RPO <5 seconds (replication lag)
 * - False positive rate: <0.1% (avoid unnecessary failovers)
 * - Automated failback: Disabled for 24 hours (prevent flip-flop)
 *
 * Cost (NFR-C):
 * - Infrastructure: $200K/month (multi-region replication, standby capacity)
 * - DNS: $1K/month (Route53 health checks, traffic policies)
 * - Standby capacity: 50% of primary (cost optimization)
 */

const pythonTemplate = `"""
Multi-Region Failover - Reference Implementation

Architecture:
1. Health Checker (monitor region health, consensus-based detection)
2. Failover Orchestrator (coordinate traffic shift, state sync)
3. Traffic Manager (DNS/LB updates, gradual shift)
4. Replication Monitor (track lag, detect conflicts)

Key concepts:
- Consensus-based failure detection (avoid false positives)
- Gradual traffic shift (avoid thundering herd)
- Fencing tokens (prevent split-brain)
- Automated failback disabled for 24h (prevent flip-flop)
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import time

def check_region_health(region: str, context: dict) -> dict:
    """
    Check health of a region using multiple signals.

    Health signals:
    1. API latency (p99 <100ms)
    2. DB latency (p99 <50ms)
    3. Error rate (<1%)
    4. Replication lag (<5 seconds)

    Args:
        region: 'us-east-1', 'us-west-2', 'eu-west-1', etc.
        context: {
            'metrics': Metrics API,
            'db': Database,
            'redis': Cache
        }

    Returns:
        {
            'region': 'us-east-1',
            'healthy': True/False,
            'signals': {
                'api_latency_p99_ms': 45,
                'db_latency_p99_ms': 20,
                'error_rate': 0.3,
                'replication_lag_seconds': 2
            },
            'unhealthy_reasons': []
        }

    Test cases covered:
    - TC1: Health check with multiple signals
    - TC2: Consensus-based failure detection
    """
    # Query metrics for region (last 1 minute)
    metrics = context['metrics'].query(
        region=region,
        metrics=['api_latency_p99', 'db_latency_p99', 'error_rate'],
        lookback_minutes=1
    )

    # Check replication lag
    replication_lag = context['db'].query(f"""
        SELECT EXTRACT(EPOCH FROM (NOW() - last_replicated_at)) as lag_seconds
        FROM replication_status
        WHERE region = ?
    """, region)[0]['lag_seconds']

    # Evaluate health signals
    signals = {
        'api_latency_p99_ms': metrics['api_latency_p99'],
        'db_latency_p99_ms': metrics['db_latency_p99'],
        'error_rate': metrics['error_rate'],
        'replication_lag_seconds': replication_lag
    }

    unhealthy_reasons = []

    # Check thresholds
    if signals['api_latency_p99_ms'] > 100:
        unhealthy_reasons.append(f"API latency {signals['api_latency_p99_ms']:.1f}ms > 100ms")

    if signals['db_latency_p99_ms'] > 50:
        unhealthy_reasons.append(f"DB latency {signals['db_latency_p99_ms']:.1f}ms > 50ms")

    if signals['error_rate'] > 1.0:
        unhealthy_reasons.append(f"Error rate {signals['error_rate']:.1f}% > 1%")

    if signals['replication_lag_seconds'] > 5:
        unhealthy_reasons.append(f"Replication lag {signals['replication_lag_seconds']:.1f}s > 5s")

    healthy = len(unhealthy_reasons) == 0

    # Store health check result
    context['db'].execute("""
        INSERT INTO region_health_checks
        (region, healthy, signals, unhealthy_reasons, checked_at)
        VALUES (?, ?, ?, ?, ?)
    """, region, healthy, signals, unhealthy_reasons, datetime.now())

    return {
        'region': region,
        'healthy': healthy,
        'signals': signals,
        'unhealthy_reasons': unhealthy_reasons
    }


def detect_region_failure(region: str, context: dict) -> dict:
    """
    Detect region failure using consensus from multiple health checkers.

    Consensus algorithm:
    - 5 health checkers run independently (different networks, availability zones)
    - If 3/5 checkers report unhealthy for 2 consecutive minutes, declare failure
    - Prevents false positives from network blips or single checker issues

    Args:
        region: Region to check
        context: Runtime context

    Returns:
        {
            'region': 'us-east-1',
            'failed': True/False,
            'consensus': 3,  # 3/5 checkers reported unhealthy
            'duration_minutes': 2.5,  # How long region has been unhealthy
            'should_failover': True/False
        }

    Test cases covered:
    - TC2: Consensus-based failure detection (3/5 checkers)
    - TC5: False positive prevention
    """
    # Get recent health checks from all checkers (last 5 minutes)
    health_checks = context['db'].query("""
        SELECT checker_id, healthy, checked_at
        FROM region_health_checks
        WHERE region = ? AND checked_at > ?
        ORDER BY checked_at DESC
    """, region, datetime.now() - timedelta(minutes=5))

    # Group by checker
    checkers = {}
    for check in health_checks:
        if check['checker_id'] not in checkers:
            checkers[check['checker_id']] = []
        checkers[check['checker_id']].append(check)

    # Count how many checkers report unhealthy (in last 2 minutes)
    unhealthy_count = 0
    for checker_id, checks in checkers.items():
        # Check if this checker reported unhealthy in last 2 minutes
        recent_checks = [c for c in checks if c['checked_at'] > datetime.now() - timedelta(minutes=2)]
        if recent_checks and all(not c['healthy'] for c in recent_checks):
            unhealthy_count += 1

    total_checkers = len(checkers)
    consensus_threshold = int(total_checkers * 0.6)  # 60% (3/5)

    failed = unhealthy_count >= consensus_threshold

    # Calculate duration of unhealthiness
    if failed:
        first_unhealthy = context['db'].query("""
            SELECT MIN(checked_at) as first_unhealthy
            FROM region_health_checks
            WHERE region = ? AND healthy = false
            AND checked_at > ?
        """, region, datetime.now() - timedelta(minutes=10))[0]['first_unhealthy']

        duration_minutes = (datetime.now() - first_unhealthy).total_seconds() / 60
    else:
        duration_minutes = 0

    # Decide if we should failover (must be unhealthy for >2 minutes)
    should_failover = failed and duration_minutes >= 2

    return {
        'region': region,
        'failed': failed,
        'consensus': f"{unhealthy_count}/{total_checkers}",
        'duration_minutes': duration_minutes,
        'should_failover': should_failover
    }


def initiate_failover(failed_region: str, target_region: str, context: dict) -> dict:
    """
    Initiate failover from failed region to healthy target region.

    Steps:
    1. Acquire distributed lock (prevent concurrent failovers)
    2. Verify target region is healthy
    3. Increase target region capacity (autoscale)
    4. Shift traffic gradually (10% → 50% → 100%)
    5. Update DNS records
    6. Monitor for issues

    Args:
        failed_region: 'us-east-1'
        target_region: 'us-west-2'
        context: Runtime context

    Returns:
        {
            'failover_id': 'failover_123',
            'from_region': 'us-east-1',
            'to_region': 'us-west-2',
            'status': 'in_progress',
            'started_at': '2024-01-15T10:00:00Z',
            'estimated_completion_minutes': 5
        }

    Test cases covered:
    - TC3: Gradual traffic shift (10% → 50% → 100%)
    - TC4: Split-brain prevention with fencing tokens
    """
    # Acquire distributed lock using Redis (prevent concurrent failovers)
    lock_key = f"failover_lock"
    lock_acquired = context['redis'].setnx(lock_key, f"{failed_region}→{target_region}", ex=600)

    if not lock_acquired:
        raise ValueError("Another failover is already in progress")

    # Verify target region is healthy
    target_health = check_region_health(target_region, context)
    if not target_health['healthy']:
        context['redis'].delete(lock_key)
        raise ValueError(f"Target region {target_region} is not healthy")

    # Create failover record
    failover_id = f"failover_{int(time.time() * 1000)}"

    context['db'].execute("""
        INSERT INTO failovers
        (id, from_region, to_region, status, started_at)
        VALUES (?, ?, ?, ?, ?)
    """, failover_id, failed_region, target_region, 'in_progress', datetime.now())

    # Step 1: Generate fencing token (prevent split-brain)
    fencing_token = generate_fencing_token(failed_region, context)

    # Step 2: Increase target region capacity (autoscale to handle traffic)
    scale_target_region(target_region, scale_factor=2.0, context=context)

    # Step 3: Shift traffic gradually (10% → 50% → 100%)
    context['scheduler'].schedule_once(
        function=shift_traffic,
        args={'failover_id': failover_id, 'percentage': 10},
        delay_seconds=30
    )

    context['scheduler'].schedule_once(
        function=shift_traffic,
        args={'failover_id': failover_id, 'percentage': 50},
        delay_seconds=120  # 2 minutes
    )

    context['scheduler'].schedule_once(
        function=shift_traffic,
        args={'failover_id': failover_id, 'percentage': 100},
        delay_seconds=300  # 5 minutes
    )

    # Step 4: Update DNS records (after 100% traffic shift)
    context['scheduler'].schedule_once(
        function=update_dns_records,
        args={'failover_id': failover_id},
        delay_seconds=360  # 6 minutes (after traffic shift completes)
    )

    return {
        'failover_id': failover_id,
        'from_region': failed_region,
        'to_region': target_region,
        'status': 'in_progress',
        'started_at': datetime.now().isoformat(),
        'fencing_token': fencing_token,
        'estimated_completion_minutes': 5
    }


def generate_fencing_token(region: str, context: dict) -> str:
    """
    Generate fencing token to prevent split-brain.

    Fencing token is a monotonically increasing number that prevents
    a failed primary from accepting writes after failover.

    Args:
        region: Region to fence
        context: Runtime context

    Returns:
        Fencing token (e.g., '1705320000123')

    Test cases covered:
    - TC4: Split-brain prevention
    """
    # Get current fencing token
    current_token = context['db'].query("""
        SELECT fencing_token FROM regions WHERE name = ?
    """, region)[0]['fencing_token']

    # Increment token
    new_token = str(int(current_token) + 1)

    # Update in database
    context['db'].execute("""
        UPDATE regions SET fencing_token = ? WHERE name = ?
    """, new_token, region)

    # Broadcast to all nodes in region
    context['redis'].publish(f"region:{region}:fencing", new_token)

    return new_token


def shift_traffic(failover_id: str, percentage: int, context: dict):
    """
    Shift traffic percentage to target region.

    Uses load balancer weights or DNS traffic policies.

    Args:
        failover_id: Failover ID
        percentage: Percentage to shift (10, 50, 100)
        context: Runtime context
    """
    failover = context['db'].query(
        "SELECT * FROM failovers WHERE id = ?",
        failover_id
    )[0]

    # Update load balancer weights
    # from_region: (100 - percentage)%
    # to_region: percentage%

    context['load_balancer'].update_weights([
        {'region': failover['from_region'], 'weight': 100 - percentage},
        {'region': failover['to_region'], 'weight': percentage}
    ])

    # Log traffic shift
    context['db'].execute("""
        INSERT INTO failover_events
        (failover_id, event_type, details, timestamp)
        VALUES (?, ?, ?, ?)
    """,
        failover_id,
        'traffic_shift',
        {'percentage': percentage, 'to_region': failover['to_region']},
        datetime.now()
    )


def scale_target_region(region: str, scale_factor: float, context: dict):
    """
    Scale up target region capacity to handle incoming traffic.

    Args:
        region: Region to scale
        scale_factor: Multiply current capacity (2.0 = double capacity)
        context: Runtime context
    """
    # Get current instance count
    current_instances = context['cloud'].get_instance_count(region=region)

    # Calculate target instances
    target_instances = int(current_instances * scale_factor)

    # Autoscale
    context['cloud'].set_instance_count(
        region=region,
        count=target_instances
    )


def update_dns_records(failover_id: str, context: dict):
    """
    Update DNS records to point to new region.

    Uses Route53 health checks and traffic policies.

    Args:
        failover_id: Failover ID
        context: Runtime context
    """
    failover = context['db'].query(
        "SELECT * FROM failovers WHERE id = ?",
        failover_id
    )[0]

    # Update Route53 record
    context['dns'].update_record(
        domain='api.company.com',
        type='CNAME',
        value=f"api.{failover['to_region']}.company.com",
        ttl=60  # 60 seconds (fast propagation)
    )

    # Mark failover as completed
    context['db'].execute("""
        UPDATE failovers
        SET status = 'completed', completed_at = ?
        WHERE id = ?
    """, datetime.now(), failover_id)


def monitor_replication_lag(region: str, context: dict) -> dict:
    """
    Monitor replication lag to ensure RPO <5 seconds.

    Args:
        region: Standby region
        context: Runtime context

    Returns:
        {
            'region': 'us-west-2',
            'replication_lag_seconds': 2.3,
            'within_rpo': True,
            'last_replicated_at': '2024-01-15T10:05:32Z'
        }

    Test cases covered:
    - TC6: Replication lag monitoring (RPO <5s)
    """
    lag_info = context['db'].query("""
        SELECT
            last_replicated_at,
            EXTRACT(EPOCH FROM (NOW() - last_replicated_at)) as lag_seconds
        FROM replication_status
        WHERE region = ?
    """, region)[0]

    within_rpo = lag_info['lag_seconds'] < 5  # RPO requirement

    # Alert if exceeds RPO
    if not within_rpo:
        context['alerting'].send_alert(
            severity='P1',
            title=f'Replication lag exceeded RPO in {region}',
            message=f"Lag: {lag_info['lag_seconds']:.1f}s (threshold: 5s)"
        )

    return {
        'region': region,
        'replication_lag_seconds': lag_info['lag_seconds'],
        'within_rpo': within_rpo,
        'last_replicated_at': lag_info['last_replicated_at'].isoformat()
    }


# Example usage
if __name__ == "__main__":
    context = {
        'db': MockDatabase(),
        'redis': MockRedis(),
        'metrics': MockMetrics(),
        'cloud': MockCloud(),
        'dns': MockDNS(),
        'load_balancer': MockLoadBalancer(),
        'scheduler': MockScheduler(),
        'alerting': MockAlerting()
    }

    # Health check
    health = check_region_health('us-east-1', context)
    print(f"Region healthy: {health['healthy']}")

    # Detect failure (consensus-based)
    failure = detect_region_failure('us-east-1', context)
    print(f"Should failover: {failure['should_failover']}")

    # Initiate failover
    if failure['should_failover']:
        failover = initiate_failover('us-east-1', 'us-west-2', context)
        print(f"Failover started: {failover['failover_id']}")
        print(f"ETA: {failover['estimated_completion_minutes']} minutes")

    # Monitor replication
    replication = monitor_replication_lag('us-west-2', context)
    print(f"Replication lag: {replication['replication_lag_seconds']:.1f}s")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Health check with multiple signals',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Simulate healthy region
context['metrics'].set_metric('us-east-1', 'api_latency_p99', 45)
context['metrics'].set_metric('us-east-1', 'db_latency_p99', 20)
context['metrics'].set_metric('us-east-1', 'error_rate', 0.3)

context['db'].execute("""
    INSERT INTO replication_status (region, last_replicated_at)
    VALUES (?, ?)
""", 'us-east-1', datetime.now() - timedelta(seconds=2))

# Check health
health = check_region_health('us-east-1', context)

print(health['healthy'])
print(health['signals']['api_latency_p99_ms'])
print(health['signals']['replication_lag_seconds'] < 5)
print(len(health['unhealthy_reasons']))`,
    expectedOutput: `True
45.0
True
0`,
    hints: [
      'Check multiple signals: API latency, DB latency, error rate, replication lag',
      'Use p99 metrics (not average) to detect tail latency issues',
      'Define clear thresholds for each signal',
      'Store health check results for consensus algorithm',
      'Return detailed unhealthy reasons for debugging'
    ],
    testCode: `assert health['healthy'] == True
assert health['signals']['api_latency_p99_ms'] == 45
assert health['signals']['replication_lag_seconds'] < 5
assert len(health['unhealthy_reasons']) == 0`,
    timeComplexity: 'O(1) for single region health check',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Design multi-signal health checks',
      'Understand importance of p99 latency for health',
      'Learn to store health check history'
    ]
  },
  {
    id: 2,
    name: 'Consensus-based failure detection (3/5 checkers, NFR-R)',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Simulate 5 health checkers
# Checkers 1, 2, 3 report unhealthy (consensus: 3/5)
# Checkers 4, 5 report healthy (minority)

for checker_id in [1, 2, 3]:
    for i in range(12):  # Last 2 minutes (10s intervals)
        context['db'].execute("""
            INSERT INTO region_health_checks
            (region, checker_id, healthy, checked_at)
            VALUES (?, ?, ?, ?)
        """, 'us-east-1', checker_id, False, datetime.now() - timedelta(seconds=i*10))

for checker_id in [4, 5]:
    for i in range(12):
        context['db'].execute("""
            INSERT INTO region_health_checks
            (region, checker_id, healthy, checked_at)
            VALUES (?, ?, ?, ?)
        """, 'us-east-1', checker_id, True, datetime.now() - timedelta(seconds=i*10))

# Detect failure
failure = detect_region_failure('us-east-1', context)

print(failure['failed'])
print(failure['consensus'])
print(failure['should_failover'])`,
    expectedOutput: `True
3/5
True`,
    hints: [
      'Use multiple independent health checkers (different networks/AZs)',
      'Require 60% consensus (3/5) to declare failure',
      'Check for sustained unhealthiness (>2 minutes)',
      'Prevents false positives from network blips',
      'Store checker results for forensic analysis'
    ],
    testCode: `assert failure['failed'] == True
assert failure['consensus'] == '3/5'
assert failure['should_failover'] == True`,
    timeComplexity: 'O(C * H) where C = checkers, H = history window',
    spaceComplexity: 'O(C * H)',
    learningObjectives: [
      'Implement consensus-based failure detection',
      'Understand false positive prevention',
      'Learn distributed health checking'
    ]
  },
  {
    id: 3,
    name: 'Gradual traffic shift (10% → 50% → 100%) - NFR-P',
    difficulty: 'hard',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Initiate failover
failover = initiate_failover('us-east-1', 'us-west-2', context)

# Execute scheduled traffic shifts
time.sleep(0.5)  # Wait for 10% shift
context['scheduler'].run_pending_jobs()

traffic_10 = context['load_balancer'].get_weights()
print(f"10% shift: us-west-2 = {traffic_10['us-west-2']}%")

time.sleep(2)  # Wait for 50% shift
context['scheduler'].run_pending_jobs()

traffic_50 = context['load_balancer'].get_weights()
print(f"50% shift: us-west-2 = {traffic_50['us-west-2']}%")

time.sleep(3)  # Wait for 100% shift
context['scheduler'].run_pending_jobs()

traffic_100 = context['load_balancer'].get_weights()
print(f"100% shift: us-west-2 = {traffic_100['us-west-2']}%")`,
    expectedOutput: `10% shift: us-west-2 = 10%
50% shift: us-west-2 = 50%
100% shift: us-west-2 = 100%`,
    hints: [
      'Shift traffic gradually to avoid thundering herd',
      'Use load balancer weights for instant routing changes',
      'Monitor metrics during each shift (error rate, latency)',
      'Roll back if metrics degrade at any stage',
      'Complete full shift in <5 minutes (NFR-P)'
    ],
    testCode: `assert traffic_10['us-west-2'] == 10
assert traffic_50['us-west-2'] == 50
assert traffic_100['us-west-2'] == 100`,
    timeComplexity: 'O(1) per traffic shift',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Design gradual traffic migration',
      'Understand load balancer weight-based routing',
      'Learn to prevent thundering herd during failover'
    ]
  },
  {
    id: 4,
    name: 'Split-brain prevention with fencing tokens',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Initial fencing token
context['db'].execute("""
    INSERT INTO regions (name, fencing_token)
    VALUES (?, ?)
""", 'us-east-1', '1000')

# Generate new fencing token during failover
token1 = generate_fencing_token('us-east-1', context)
print(f"Token after 1st failover: {token1}")

# If failed region recovers and tries to accept writes, it must check token
current_token = context['db'].query(
    "SELECT fencing_token FROM regions WHERE name = ?",
    'us-east-1'
)[0]['fencing_token']

# Zombie primary has old token (1000), but current is 1001
zombie_token = '1000'
can_accept_writes = zombie_token == current_token

print(f"Zombie can accept writes: {can_accept_writes}")

# Second failover
token2 = generate_fencing_token('us-east-1', context)
print(f"Token after 2nd failover: {token2}")`,
    expectedOutput: `Token after 1st failover: 1001
Zombie can accept writes: False
Token after 2nd failover: 1002`,
    hints: [
      'Use monotonically increasing fencing tokens',
      'Increment token during each failover',
      'Reject writes with outdated tokens',
      'Broadcast token updates via pub/sub',
      'Store token in durable storage (database)'
    ],
    testCode: `assert token1 == '1001'
assert can_accept_writes == False
assert token2 == '1002'`,
    timeComplexity: 'O(1) for token generation',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement fencing tokens for split-brain prevention',
      'Understand distributed consensus challenges',
      'Learn to prevent zombie primaries'
    ]
  },
  {
    id: 5,
    name: 'False positive prevention (NFR-R: <0.1% false positive rate)',
    difficulty: 'medium',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Simulate transient network blip (only 1 checker reports unhealthy)
for checker_id in [1]:
    for i in range(12):
        context['db'].execute("""
            INSERT INTO region_health_checks
            (region, checker_id, healthy, checked_at)
            VALUES (?, ?, ?, ?)
        """, 'us-east-1', checker_id, False, datetime.now() - timedelta(seconds=i*10))

for checker_id in [2, 3, 4, 5]:
    for i in range(12):
        context['db'].execute("""
            INSERT INTO region_health_checks
            (region, checker_id, healthy, checked_at)
            VALUES (?, ?, ?, ?)
        """, 'us-east-1', checker_id, True, datetime.now() - timedelta(seconds=i*10))

# Detect failure
failure = detect_region_failure('us-east-1', context)

print(failure['failed'])
print(failure['consensus'])
print(failure['should_failover'])  # Should NOT failover (only 1/5 checkers)`,
    expectedOutput: `False
1/5
False`,
    hints: [
      'Require consensus (3/5) to prevent false positives',
      'Single checker failure should not trigger failover',
      'Use grace period (2 minutes) before declaring failure',
      'Distinguish transient issues from real outages',
      'Log all near-miss events for analysis'
    ],
    testCode: `assert failure['failed'] == False
assert failure['should_failover'] == False`,
    timeComplexity: 'O(C * H) where C = checkers, H = history',
    spaceComplexity: 'O(C * H)',
    learningObjectives: [
      'Prevent false positives with consensus',
      'Understand cost of unnecessary failovers',
      'Learn to tune detection thresholds'
    ]
  },
  {
    id: 6,
    name: 'Replication lag monitoring (NFR-R: RPO <5 seconds)',
    difficulty: 'medium',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Simulate replication status (lag: 2.3 seconds - within RPO)
context['db'].execute("""
    INSERT INTO replication_status (region, last_replicated_at)
    VALUES (?, ?)
""", 'us-west-2', datetime.now() - timedelta(seconds=2.3))

replication = monitor_replication_lag('us-west-2', context)

print(f"Lag: {replication['replication_lag_seconds']:.1f}s")
print(replication['within_rpo'])

# Simulate high lag (lag: 8 seconds - exceeds RPO)
context['db'].execute("""
    UPDATE replication_status
    SET last_replicated_at = ?
    WHERE region = ?
""", datetime.now() - timedelta(seconds=8), 'us-west-2')

replication_high = monitor_replication_lag('us-west-2', context)
print(f"High lag: {replication_high['replication_lag_seconds']:.1f}s")
print(replication_high['within_rpo'])`,
    expectedOutput: `Lag: 2.3s
True
High lag: 8.0s
False`,
    hints: [
      'Monitor replication lag continuously (every 10s)',
      'Alert if lag exceeds RPO (5 seconds)',
      'Track last_replicated_at timestamp in standby region',
      'Calculate lag as NOW() - last_replicated_at',
      'Consider pausing failover if replication lag is high'
    ],
    testCode: `assert replication['replication_lag_seconds'] < 5
assert replication['within_rpo'] == True
assert replication_high['within_rpo'] == False`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Monitor replication lag for RPO compliance',
      'Understand data loss risks during failover',
      'Learn to balance availability vs data durability'
    ]
  },
  {
    id: 7,
    name: 'Complete failover within RTO <10 minutes (NFR-P)',
    difficulty: 'hard',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Simulate region failure at T+0
failure_start = time.time()

# T+0 to T+2 min: Detect failure (consensus-based)
for i in range(12):
    for checker_id in [1, 2, 3]:
        context['db'].execute("""
            INSERT INTO region_health_checks
            (region, checker_id, healthy, checked_at)
            VALUES (?, ?, ?, ?)
        """, 'us-east-1', checker_id, False, datetime.now() - timedelta(seconds=(120-i*10)))

time.sleep(2)  # Simulate 2 minutes
detection = detect_region_failure('us-east-1', context)
print(f"Detected at T+{time.time() - failure_start:.0f}s: {detection['should_failover']}")

# T+2 to T+7 min: Initiate failover and shift traffic
failover = initiate_failover('us-east-1', 'us-west-2', context)

# Run all scheduled tasks (traffic shifts at T+0.5, T+2, T+5)
time.sleep(5)
context['scheduler'].run_all_pending()

total_duration = time.time() - failure_start

print(f"Failover completed in {total_duration:.0f} seconds")
print(f"Within RTO: {total_duration < 600}")  # RTO: 10 minutes = 600s`,
    expectedOutput: `Detected at T+120s: True
Failover completed in 420 seconds
Within RTO: True`,
    hints: [
      'Detection: <2 minutes (consensus + grace period)',
      'Traffic shift: <5 minutes (10% → 50% → 100%)',
      'DNS update: <60 seconds (TTL: 60s)',
      'Total RTO: <10 minutes (NFR-P)',
      'Parallelize capacity scaling and traffic shift'
    ],
    testCode: `assert detection['should_failover'] == True
assert total_duration < 600  # 10 minutes`,
    timeComplexity: 'O(1) for orchestration',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Meet RTO requirements through optimized failover',
      'Understand components of total failover time',
      'Learn to parallelize failover steps'
    ]
  }
];

export const multiRegionFailoverChallenge: SystemDesignChallenge = {
  id: 'multi_region_failover',
  title: 'Multi-Region Failover',
  difficulty: 'advanced',
  category: 'Migration & Reliability',
  description: `Design an automated failover system that detects regional outages and shifts traffic to healthy regions while preventing split-brain scenarios. Critical for maintaining 99.99% availability during datacenter failures.

**Real-world Context:**
- Netflix: Multi-region active-active with Chaos Kong for region failure testing
- Uber: Regional failover for critical ride-matching systems
- Airbnb: Cross-region disaster recovery for booking platform
- Google Spanner: Multi-region with automatic failover and strong consistency

**Key Concepts:**
- Consensus-based failure detection: 3/5 health checkers must agree (prevent false positives)
- Gradual traffic shift: 10% → 50% → 100% over 5 minutes (prevent thundering herd)
- Fencing tokens: Monotonically increasing tokens prevent split-brain
- Replication lag: Monitor RPO <5 seconds for acceptable data loss
- RTO: Total failover time <10 minutes (detection + traffic shift + DNS)

**Scale:**
- 3-5 regions globally
- 100,000 RPS per region
- 10TB database per region
- 1M concurrent users redistributed

**Companies:** Netflix, Uber, Airbnb, Google, Amazon
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Use consensus-based detection (3/5 checkers) to prevent false positives',
    'Implement fencing tokens to prevent split-brain during failover',
    'Shift traffic gradually (10% → 50% → 100%) to avoid thundering herd',
    'Monitor replication lag (<5s) before initiating failover',
    'Use distributed lock (Redis) to prevent concurrent failovers',
    'Scale target region capacity before shifting traffic',
    'Update DNS records with low TTL (60s) for fast propagation',
    'Disable automated failback for 24 hours to prevent flip-flopping'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Netflix: Chaos Kong tests region failure by evacuating entire AWS region',
    'Uber: Multi-region architecture for ride-matching with automatic failover',
    'Airbnb: Regional disaster recovery for global booking platform',
    'Google: Spanner provides multi-region failover with strong consistency',
    'Amazon: Route53 health checks and traffic policies for regional failover'
  ],
  relatedChallenges: [
    'zero_downtime_migration',
    'chaos_engineering_platform',
    'distributed_tracing',
    'alerting_incident_management'
  ]
};
