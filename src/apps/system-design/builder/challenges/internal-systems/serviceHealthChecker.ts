/**
 * L4-L5 Internal Systems: Service Health Checker
 *
 * Design a system to continuously monitor service health through active probing
 * and synthetic transactions. Essential for detecting outages before customers
 * are impacted and for validating multi-region deployments.
 *
 * Real-world examples:
 * - Google Cloud Load Balancer: Active health checks every 5-10 seconds
 * - AWS Route 53: Health checks for DNS failover
 * - Datadog Synthetic Monitoring: Synthetic transactions across endpoints
 * - Pingdom: Global health checking from multiple locations
 *
 * Companies: Google, AWS, Datadog, Uber, Airbnb, Netflix
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Observability & Operations
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Active Probing
 *    - HTTP checks: GET /health endpoint, expect 200 OK
 *    - TCP checks: Connect to port, expect successful connection
 *    - Custom checks: Execute command, check output
 *    - Frequency: Configurable (5 seconds to 5 minutes)
 *
 * 2. Synthetic Transactions
 *    - End-to-end flows: Simulate user actions (login, checkout, etc.)
 *    - Multi-step checks: Chain of API calls
 *    - Assertions: Validate response code, body, latency
 *    - Data cleanup: Undo synthetic transactions (delete test data)
 *
 * 3. Multi-Region Monitoring
 *    - Global checks: Probe from multiple regions (US, EU, Asia)
 *    - Latency tracking: Measure cross-region latency
 *    - Regional failures: Detect region-specific outages
 *    - Quorum-based alerting: Require N/M probers to fail before alerting
 *
 * 4. False Positive Mitigation
 *    - Retry logic: Retry failed checks before alerting
 *    - Flapping detection: Don't alert if status flip-flops rapidly
 *    - Dependency modeling: Don't alert if upstream dependency is down
 *    - Alert suppression: Suppress during maintenance windows
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Check frequency: 5 seconds for critical services
 * - Parallel probing: 1000+ endpoints concurrently
 * - Low overhead: <1% CPU impact on monitored services
 * - Fast detection: Detect outage within 15 seconds
 *
 * Scalability (NFR-S):
 * - Support 10K+ service endpoints
 * - Multi-region: Probe from 10+ regions globally
 * - Store 90 days of health check history
 * - Handle traffic spikes (Black Friday, etc.)
 *
 * Reliability (NFR-R):
 * - False positive rate: <1% (avoid alert fatigue)
 * - False negative rate: <0.1% (must detect real outages)
 * - Prober availability: 99.9% (probers themselves must be reliable)
 * - Alert latency: <1 minute from outage to alert
 *
 * Cost (NFR-C):
 * - Use small prober instances (cheap: t3.micro)
 * - Batch health check results (reduce writes)
 * - Downsample historical data (1-min → 1-hour → 1-day)
 * - Share probers across services (multi-tenant)
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import deque

class ServiceHealthChecker:
    """
    Service Health Checker

    Key Operations:
    1. perform_health_check: Execute health check probe
    2. run_synthetic_transaction: Execute multi-step synthetic transaction
    3. aggregate_multi_region: Aggregate results from multiple regions
    4. detect_false_positive: Filter false positives (retry, quorum)
    5. calculate_uptime: Calculate service uptime percentage
    """

    def __init__(self):
        self.health_checks = {}  # {endpoint: HealthCheckConfig}
        self.check_results = {}  # {endpoint: deque[CheckResult]}
        self.alerts = []  # [Alert]
        self.maintenance_windows = {}  # {endpoint: [MaintenanceWindow]}

    def perform_health_check(self, check_config: dict) -> dict:
        """
        Perform health check probe.

        FR: HTTP/TCP/custom checks
        NFR-P: <1% CPU overhead on target service
        NFR-R: Fast detection (within 15 seconds)

        Args:
            check_config: {
                'endpoint': str,  # e.g., 'https://api.example.com/health'
                'check_type': 'http' | 'tcp' | 'custom',
                'expected_status': int,  # 200 for HTTP
                'timeout_seconds': int,
                'region': str  # Prober region
            }

        Returns:
            {
                'endpoint': str,
                'status': 'healthy' | 'unhealthy',
                'response_time_ms': float,
                'status_code': int | None,
                'region': str,
                'checked_at': datetime
            }
        """
        endpoint = check_config['endpoint']
        check_type = check_config['check_type']
        expected_status = check_config.get('expected_status', 200)
        timeout_seconds = check_config.get('timeout_seconds', 5)
        region = check_config.get('region', 'us-east-1')

        # Simulate health check (in production: make actual HTTP/TCP request)
        start_time = datetime.now()

        # Simulate response time (50ms baseline + random jitter)
        # Unhealthy services have higher latency or timeouts
        import random
        is_healthy = random.random() > 0.05  # 95% healthy, 5% unhealthy

        if is_healthy:
            response_time_ms = random.uniform(50, 150)  # 50-150ms
            status_code = expected_status
            status = 'healthy'
        else:
            # Simulate unhealthy: timeout or error
            if random.random() > 0.5:
                response_time_ms = timeout_seconds * 1000  # Timeout
                status_code = None
            else:
                response_time_ms = random.uniform(200, 500)  # Slow
                status_code = 500  # Error
            status = 'unhealthy'

        # Store result
        result = {
            'endpoint': endpoint,
            'status': status,
            'response_time_ms': round(response_time_ms, 2),
            'status_code': status_code,
            'region': region,
            'checked_at': datetime.now()
        }

        # Append to result history (keep last 100 checks)
        if endpoint not in self.check_results:
            self.check_results[endpoint] = deque(maxlen=100)

        self.check_results[endpoint].append(result)

        return {
            'endpoint': endpoint,
            'status': status,
            'response_time_ms': round(response_time_ms, 2),
            'status_code': status_code,
            'region': region,
            'checked_at': result['checked_at'].isoformat()
        }

    def run_synthetic_transaction(self, transaction_config: dict, context: dict) -> dict:
        """
        Run multi-step synthetic transaction.

        FR: End-to-end flows (login → checkout → payment)
        NFR-R: Detect outages before customers impacted

        Args:
            transaction_config: {
                'name': str,
                'steps': [
                    {'endpoint': str, 'method': str, 'expected_status': int},
                    ...
                ]
            }
            context: Contains HTTP client

        Returns:
            {
                'transaction_name': str,
                'success': bool,
                'failed_step': int | None,
                'total_duration_ms': float
            }
        """
        transaction_name = transaction_config['name']
        steps = transaction_config['steps']

        start_time = datetime.now()
        failed_step = None

        # Execute each step sequentially
        for idx, step in enumerate(steps):
            # Perform HTTP request (simulated)
            endpoint = step['endpoint']
            expected_status = step['expected_status']

            # Simulate request
            step_result = self.perform_health_check({
                'endpoint': endpoint,
                'check_type': 'http',
                'expected_status': expected_status
            })

            # Check if step succeeded
            if step_result['status'] != 'healthy':
                failed_step = idx
                break

        end_time = datetime.now()
        total_duration_ms = (end_time - start_time).total_seconds() * 1000

        success = failed_step is None

        return {
            'transaction_name': transaction_name,
            'success': success,
            'failed_step': failed_step,
            'total_steps': len(steps),
            'total_duration_ms': round(total_duration_ms, 2)
        }

    def aggregate_multi_region(self, endpoint: str, regions: List[str]) -> dict:
        """
        Aggregate health check results from multiple regions.

        FR: Multi-region monitoring
        NFR-R: Quorum-based alerting (require N/M failures)

        Args:
            endpoint: Endpoint to check
            regions: List of regions to probe from

        Returns:
            {
                'endpoint': str,
                'overall_status': 'healthy' | 'degraded' | 'unhealthy',
                'healthy_regions': [str],
                'unhealthy_regions': [str],
                'quorum_met': bool
            }
        """
        # Get latest check result from each region
        if endpoint not in self.check_results:
            return {'error': 'No check results for endpoint'}

        results_by_region = {}
        for result in self.check_results[endpoint]:
            region = result['region']
            # Keep only the latest result per region
            if region not in results_by_region or result['checked_at'] > results_by_region[region]['checked_at']:
                results_by_region[region] = result

        # Filter to requested regions
        regional_results = {r: results_by_region.get(r) for r in regions if r in results_by_region}

        # Count healthy vs unhealthy
        healthy_regions = [r for r, res in regional_results.items() if res and res['status'] == 'healthy']
        unhealthy_regions = [r for r, res in regional_results.items() if res and res['status'] == 'unhealthy']

        # Quorum-based decision
        # Require at least 50% of regions to report unhealthy before marking as unhealthy
        # This reduces false positives from transient network issues
        total_regions = len(regions)
        unhealthy_count = len(unhealthy_regions)

        quorum_threshold = total_regions // 2 + 1  # Majority
        quorum_met = unhealthy_count >= quorum_threshold

        # Overall status
        if unhealthy_count == 0:
            overall_status = 'healthy'
        elif quorum_met:
            overall_status = 'unhealthy'  # Majority unhealthy
        else:
            overall_status = 'degraded'  # Some unhealthy but not majority

        return {
            'endpoint': endpoint,
            'overall_status': overall_status,
            'healthy_regions': healthy_regions,
            'unhealthy_regions': unhealthy_regions,
            'total_regions': total_regions,
            'quorum_met': quorum_met
        }

    def detect_false_positive(self, endpoint: str, context: dict) -> dict:
        """
        Detect and filter false positives.

        FR: Retry logic, flapping detection, dependency modeling
        NFR-R: <1% false positive rate

        Args:
            endpoint: Endpoint to check
            context: Contains retry config, dependency graph

        Returns:
            {
                'false_positive': bool,
                'reason': str,  # 'retried_success' | 'flapping' | 'upstream_down' | 'maintenance'
                'alert_suppressed': bool
            }
        """
        if endpoint not in self.check_results:
            return {'error': 'No check results'}

        # Get recent check results (last 10)
        recent_results = list(self.check_results[endpoint])[-10:]

        if not recent_results:
            return {'error': 'No recent results'}

        latest_result = recent_results[-1]

        # 1. Retry logic
        # If latest check failed, retry before alerting
        if latest_result['status'] == 'unhealthy':
            # Retry immediately (NFR-R: Reduce false positives)
            retry_result = self.perform_health_check({
                'endpoint': endpoint,
                'check_type': 'http'
            })

            if retry_result['status'] == 'healthy':
                # False positive! Transient failure
                return {
                    'false_positive': True,
                    'reason': 'retried_success',
                    'alert_suppressed': True
                }

        # 2. Flapping detection
        # If status flips between healthy/unhealthy rapidly (>3 flips in last 10 checks), suppress alert
        status_changes = 0
        for i in range(1, len(recent_results)):
            if recent_results[i]['status'] != recent_results[i-1]['status']:
                status_changes += 1

        if status_changes > 3:
            # Flapping detected
            return {
                'false_positive': True,
                'reason': 'flapping',
                'alert_suppressed': True
            }

        # 3. Dependency modeling
        # If upstream dependency is down, don't alert for this service
        dependencies = context.get('dependencies', {}).get(endpoint, [])
        for dep in dependencies:
            if dep in self.check_results:
                dep_results = list(self.check_results[dep])
                if dep_results and dep_results[-1]['status'] == 'unhealthy':
                    # Upstream dependency is down
                    return {
                        'false_positive': True,
                        'reason': 'upstream_down',
                        'alert_suppressed': True,
                        'upstream_service': dep
                    }

        # 4. Maintenance window
        # If endpoint is in maintenance window, suppress alert
        if endpoint in self.maintenance_windows:
            now = datetime.now()
            for window in self.maintenance_windows[endpoint]:
                if window['start'] <= now <= window['end']:
                    return {
                        'false_positive': True,
                        'reason': 'maintenance',
                        'alert_suppressed': True,
                        'maintenance_window': window
                    }

        # Not a false positive
        return {
            'false_positive': False,
            'alert_suppressed': False
        }

    def calculate_uptime(self, endpoint: str, time_window_hours: int) -> dict:
        """
        Calculate service uptime percentage.

        FR: Uptime tracking
        SLA: Target 99.9% uptime (43 minutes downtime per month)

        Args:
            endpoint: Endpoint to calculate uptime for
            time_window_hours: Time window (e.g., 24 hours, 720 hours = 30 days)

        Returns:
            {
                'endpoint': str,
                'uptime_percentage': float,
                'total_checks': int,
                'successful_checks': int,
                'failed_checks': int,
                'sla_met': bool  # 99.9% SLA
            }
        """
        if endpoint not in self.check_results:
            return {'error': 'No check results'}

        # Filter results within time window
        now = datetime.now()
        cutoff_time = now - timedelta(hours=time_window_hours)

        recent_results = [
            r for r in self.check_results[endpoint]
            if r['checked_at'] >= cutoff_time
        ]

        if not recent_results:
            return {'error': 'No results in time window'}

        # Count successful vs failed
        total_checks = len(recent_results)
        successful_checks = sum(1 for r in recent_results if r['status'] == 'healthy')
        failed_checks = total_checks - successful_checks

        # Calculate uptime percentage
        uptime_percentage = (successful_checks / total_checks * 100) if total_checks > 0 else 0

        # Check SLA (99.9%)
        sla_threshold = 99.9
        sla_met = uptime_percentage >= sla_threshold

        return {
            'endpoint': endpoint,
            'uptime_percentage': round(uptime_percentage, 3),
            'total_checks': total_checks,
            'successful_checks': successful_checks,
            'failed_checks': failed_checks,
            'time_window_hours': time_window_hours,
            'sla_met': sla_met
        }

    def schedule_maintenance_window(self, endpoint: str, window: dict) -> dict:
        """
        Schedule maintenance window (suppress alerts).

        FR: Alert suppression during maintenance
        NFR-R: Reduce false positives

        Args:
            endpoint: Endpoint in maintenance
            window: {
                'start': datetime,
                'end': datetime,
                'reason': str
            }

        Returns:
            {
                'endpoint': str,
                'window_id': str,
                'start': datetime,
                'end': datetime
            }
        """
        if endpoint not in self.maintenance_windows:
            self.maintenance_windows[endpoint] = []

        window_id = f"maint:{endpoint}:{int(window['start'].timestamp())}"

        maintenance_window = {
            'window_id': window_id,
            'endpoint': endpoint,
            'start': window['start'],
            'end': window['end'],
            'reason': window.get('reason', 'Scheduled maintenance')
        }

        self.maintenance_windows[endpoint].append(maintenance_window)

        return {
            'endpoint': endpoint,
            'window_id': window_id,
            'start': window['start'].isoformat(),
            'end': window['end'].isoformat(),
            'reason': maintenance_window['reason']
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "perform_health_check_healthy",
        "description": "FR: HTTP health check returns healthy",
        "input": {
            "operation": "perform_health_check",
            "check_config": {
                "endpoint": "https://api.example.com/health",
                "check_type": "http",
                "expected_status": 200,
                "timeout_seconds": 5,
                "region": "us-east-1"
            }
        },
        "expected_output": {
            "endpoint": "https://api.example.com/health",
            "status": "healthy",
            "response_time_ms": "<200",  # Healthy services respond fast
            "status_code": 200,
            "region": "us-east-1",
            "checked_at": "<timestamp>"
        }
    },
    {
        "id": 2,
        "name": "run_synthetic_transaction",
        "description": "FR: Multi-step synthetic transaction (login → checkout)",
        "input": {
            "operation": "run_synthetic_transaction",
            "transaction_config": {
                "name": "e-commerce-flow",
                "steps": [
                    {"endpoint": "https://api.example.com/login", "method": "POST", "expected_status": 200},
                    {"endpoint": "https://api.example.com/products", "method": "GET", "expected_status": 200},
                    {"endpoint": "https://api.example.com/checkout", "method": "POST", "expected_status": 200}
                ]
            },
            "context": {}
        },
        "expected_output": {
            "transaction_name": "e-commerce-flow",
            "success": "<true/false>",
            "failed_step": "<None if success>",
            "total_steps": 3,
            "total_duration_ms": "<calculated>"
        }
    },
    {
        "id": 3,
        "name": "aggregate_multi_region_healthy",
        "description": "FR: Multi-region check - all regions healthy",
        "input": {
            "operation": "aggregate_multi_region",
            "setup": {
                "perform_checks": [
                    {"endpoint": "https://api.example.com", "region": "us-east-1", "status": "healthy"},
                    {"endpoint": "https://api.example.com", "region": "eu-west-1", "status": "healthy"},
                    {"endpoint": "https://api.example.com", "region": "ap-south-1", "status": "healthy"}
                ]
            },
            "endpoint": "https://api.example.com",
            "regions": ["us-east-1", "eu-west-1", "ap-south-1"]
        },
        "expected_output": {
            "endpoint": "https://api.example.com",
            "overall_status": "healthy",
            "healthy_regions": ["us-east-1", "eu-west-1", "ap-south-1"],
            "unhealthy_regions": [],
            "total_regions": 3,
            "quorum_met": False
        }
    },
    {
        "id": 4,
        "name": "aggregate_multi_region_quorum_failure",
        "description": "FR: Multi-region - majority unhealthy triggers alert, NFR-R: Quorum reduces false positives",
        "input": {
            "operation": "aggregate_multi_region",
            "setup": {
                "perform_checks": [
                    {"endpoint": "https://api.example.com", "region": "us-east-1", "status": "unhealthy"},
                    {"endpoint": "https://api.example.com", "region": "eu-west-1", "status": "unhealthy"},
                    {"endpoint": "https://api.example.com", "region": "ap-south-1", "status": "healthy"}
                ]
            },
            "endpoint": "https://api.example.com",
            "regions": ["us-east-1", "eu-west-1", "ap-south-1"]
        },
        "expected_output": {
            "endpoint": "https://api.example.com",
            "overall_status": "unhealthy",  # 2/3 unhealthy → quorum met
            "healthy_regions": ["ap-south-1"],
            "unhealthy_regions": ["us-east-1", "eu-west-1"],
            "total_regions": 3,
            "quorum_met": True
        }
    },
    {
        "id": 5,
        "name": "detect_false_positive_retry_success",
        "description": "FR: Retry failed check - success on retry means false positive, NFR-R: <1% false positive rate",
        "input": {
            "operation": "detect_false_positive",
            "setup": {
                "perform_check": {
                    "endpoint": "https://api.example.com",
                    "status": "unhealthy"  # Initial failure
                },
                "retry_succeeds": True
            },
            "endpoint": "https://api.example.com",
            "context": {}
        },
        "expected_output": {
            "false_positive": True,
            "reason": "retried_success",
            "alert_suppressed": True
        }
    },
    {
        "id": 6,
        "name": "detect_false_positive_flapping",
        "description": "FR: Flapping detection - rapid status changes suppress alert",
        "input": {
            "operation": "detect_false_positive",
            "setup": {
                "perform_checks": [
                    {"status": "healthy"},
                    {"status": "unhealthy"},
                    {"status": "healthy"},
                    {"status": "unhealthy"},
                    {"status": "healthy"},
                    {"status": "unhealthy"}
                ]
            },
            "endpoint": "https://flaky-service.com",
            "context": {}
        },
        "expected_output": {
            "false_positive": True,
            "reason": "flapping",
            "alert_suppressed": True
        }
    },
    {
        "id": 7,
        "name": "detect_false_positive_upstream_down",
        "description": "FR: Dependency modeling - don't alert if upstream is down",
        "input": {
            "operation": "detect_false_positive",
            "setup": {
                "perform_check": {
                    "endpoint": "https://downstream-service.com",
                    "status": "unhealthy"
                },
                "upstream_check": {
                    "endpoint": "https://database-service.com",
                    "status": "unhealthy"  # Upstream is down
                }
            },
            "endpoint": "https://downstream-service.com",
            "context": {
                "dependencies": {
                    "https://downstream-service.com": ["https://database-service.com"]
                }
            }
        },
        "expected_output": {
            "false_positive": True,
            "reason": "upstream_down",
            "alert_suppressed": True,
            "upstream_service": "https://database-service.com"
        }
    },
    {
        "id": 8,
        "name": "calculate_uptime_sla_met",
        "description": "FR: Uptime tracking - 99.9% SLA met",
        "input": {
            "operation": "calculate_uptime",
            "setup": {
                "perform_checks": {
                    "endpoint": "https://reliable-service.com",
                    "total": 1000,
                    "successful": 999,  # 99.9% uptime
                    "failed": 1
                }
            },
            "endpoint": "https://reliable-service.com",
            "time_window_hours": 24
        },
        "expected_output": {
            "endpoint": "https://reliable-service.com",
            "uptime_percentage": 99.9,
            "total_checks": 1000,
            "successful_checks": 999,
            "failed_checks": 1,
            "time_window_hours": 24,
            "sla_met": True  # 99.9% SLA
        }
    },
    {
        "id": 9,
        "name": "calculate_uptime_sla_violated",
        "description": "FR: Uptime tracking - 99.9% SLA violated",
        "input": {
            "operation": "calculate_uptime",
            "setup": {
                "perform_checks": {
                    "endpoint": "https://unreliable-service.com",
                    "total": 1000,
                    "successful": 980,  # 98% uptime
                    "failed": 20
                }
            },
            "endpoint": "https://unreliable-service.com",
            "time_window_hours": 720  # 30 days
        },
        "expected_output": {
            "endpoint": "https://unreliable-service.com",
            "uptime_percentage": 98.0,
            "total_checks": 1000,
            "successful_checks": 980,
            "failed_checks": 20,
            "time_window_hours": 720,
            "sla_met": False  # Below 99.9%
        }
    },
    {
        "id": 10,
        "name": "schedule_maintenance_window",
        "description": "FR: Maintenance window - suppress alerts during maintenance",
        "input": {
            "operation": "schedule_maintenance_window",
            "endpoint": "https://api.example.com",
            "window": {
                "start": "2024-01-20T02:00:00Z",
                "end": "2024-01-20T04:00:00Z",
                "reason": "Database migration"
            }
        },
        "expected_output": {
            "endpoint": "https://api.example.com",
            "window_id": "<auto-generated>",
            "start": "2024-01-20T02:00:00Z",
            "end": "2024-01-20T04:00:00Z",
            "reason": "Database migration"
        }
    }
]

`;
export const serviceHealthCheckerChallenge: SystemDesignChallenge = {
  id: 'service_health_checker',
  title: 'Service Health Checker',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Service Health Checker that actively probes endpoints and runs synthetic transactions to detect outages before customers are impacted, with multi-region monitoring and false positive mitigation.

**Real-world Context:**
At Google Cloud Load Balancer, health checks run every 5-10 seconds to detect unhealthy backends. The system uses quorum-based alerting: if 2 out of 3 regions report unhealthy, trigger alert. Retry logic filters transient failures. During a database migration maintenance window, alerts are suppressed. This reduces false positive rate to <1% while detecting real outages within 15 seconds.

**Key Technical Challenges:**
1. **False Positives**: How do you avoid alerting on transient network blips (<1% false positive rate)?
2. **Multi-Region**: How do you aggregate health from 10+ regions (quorum-based)?
3. **Dependencies**: How do you avoid cascading alerts when upstream services fail?
4. **Synthetic Transactions**: How do you test end-to-end flows without impacting production?

**Companies Asking This:** Google, AWS, Datadog, Uber, Airbnb, Netflix`,

  realWorldScenario: {
    company: 'Google',
    context: 'Load balancer needs to detect unhealthy backends within 15 seconds and route traffic away.',
    constraint: '<1% false positive rate (retry + quorum), probe from 10+ regions, handle 10K endpoints.'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Active Probing',
      content: 'HTTP GET /health every 5-10 seconds. Expect 200 OK within timeout (5s). Track response time (latency). Store last 100 results per endpoint.'
    },
    {
      stage: 'FR',
      title: 'Synthetic Transactions',
      content: 'Multi-step flow: Login → Browse → Checkout → Payment. Each step is HTTP request with assertions (status code, response body). Fail transaction if any step fails.'
    },
    {
      stage: 'FR',
      title: 'Multi-Region Quorum',
      content: 'Probe from 3+ regions. Use quorum: require 2/3 regions to report unhealthy before alerting. Reduces false positives from regional network issues.'
    },
    {
      stage: 'FR',
      title: 'Retry Logic',
      content: 'On failed check, retry immediately. If retry succeeds, suppress alert (transient failure). If retry also fails, proceed with alert.'
    },
    {
      stage: 'NFR-R',
      title: 'False Positive Mitigation',
      content: 'Use retry (immediate), flapping detection (>3 status changes in 10 checks), dependency modeling (upstream down), maintenance windows (suppress during planned downtime).'
    },
    {
      stage: 'NFR-R',
      title: 'Uptime Tracking',
      content: 'Calculate uptime = successful_checks / total_checks. SLA: 99.9% uptime (43 minutes downtime per month). Alert if uptime drops below SLA.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Performs HTTP health checks with timeout',
        'Runs multi-step synthetic transactions',
        'Aggregates multi-region results with quorum',
        'Detects false positives (retry, flapping, upstream down)',
        'Calculates uptime percentage and SLA compliance',
        'Schedules maintenance windows for alert suppression'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Check frequency 5 seconds for critical services',
        'Parallel probing 1000+ endpoints',
        'Low overhead <1% CPU on target',
        'Fast detection within 15 seconds'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 10K+ endpoints',
        'Multi-region (10+ regions)',
        'Stores 90 days history',
        'Handles traffic spikes'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of probing, aggregation, and false positive detection',
        'Quorum-based alerting logic',
        'Retry and flapping detection',
        'Clean test cases covering health checks, synthetic transactions, multi-region, false positives'
      ]
    }
  },

  commonMistakes: [
    'No retry logic → alert on every transient failure (high false positive rate)',
    'Single region checks → false positives from regional network issues',
    'No flapping detection → alert storm when service flip-flops',
    'No dependency modeling → cascading alerts when upstream fails',
    'No maintenance windows → alerts during planned downtime',
    'Synchronous checks → can\'t probe 10K endpoints (use async/parallel)'
  ],

  companiesAsking: ['Google', 'AWS', 'Datadog', 'Uber', 'Airbnb', 'Netflix'],
  relatedPatterns: [
    'Alerting & Incident Management (health checks trigger alerts)',
    'Multi-Region Failover (health checks drive traffic routing)',
    'Distributed Tracing (synthetic transactions generate traces)',
    'Chaos Engineering Platform (injects failures, health checks detect them)'
  ]
};
