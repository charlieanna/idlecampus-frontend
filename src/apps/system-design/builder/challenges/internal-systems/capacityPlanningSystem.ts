/**
 * L4-L5 Internal Systems: Capacity Planning System
 *
 * Design a system to forecast resource needs (CPU, memory, storage, network) and
 * plan capacity ahead of demand. Critical for preventing outages from resource
 * exhaustion and optimizing infrastructure costs.
 *
 * Real-world examples:
 * - Google Borg: Cluster capacity planning and allocation
 * - AWS Auto Scaling: Predictive scaling based on historical patterns
 * - Netflix Scryer: Time-series forecasting for capacity planning
 * - Uber Peloton: Resource forecasting for job scheduling
 *
 * Companies: Google, AWS, Netflix, Uber, Airbnb
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Observability & Operations
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Resource Monitoring
 *    - Collect metrics: CPU, memory, disk, network usage
 *    - Multi-dimensional: Per service, cluster, region
 *    - Historical data: Store 2+ years for trend analysis
 *    - Granularity: 1-minute resolution for real-time, hourly for historical
 *
 * 2. Forecasting
 *    - Linear growth: Extrapolate based on historical trend
 *    - Seasonal patterns: Account for daily/weekly/yearly cycles
 *    - Event-driven spikes: Model Black Friday, product launches
 *    - Confidence intervals: Provide P50, P95, P99 forecasts
 *
 * 3. Capacity Alerts
 *    - Threshold alerts: Warn when CPU >80%, memory >90%
 *    - Forecast alerts: Warn "will run out of disk in 30 days"
 *    - Headroom tracking: Ensure 20% buffer for traffic spikes
 *    - Multi-resource alerts: Consider CPU AND memory together
 *
 * 4. Growth Planning
 *    - What-if analysis: "If traffic grows 2x, how many servers needed?"
 *    - Cost estimation: "Adding 100 servers costs $X/month"
 *    - Procurement timeline: "Need to order servers 3 months ahead"
 *    - Budget tracking: Monitor spend vs allocated budget
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Forecast calculation: <10 seconds for 2 years of data
 * - Real-time monitoring: <1 minute lag from metric collection
 * - Dashboard queries: <2 seconds for last 30 days
 * - Batch forecasting: Generate forecasts for 1000+ services nightly
 *
 * Scalability (NFR-S):
 * - Support 10K+ servers/containers
 * - Handle 1M+ metrics per minute
 * - Store 2+ years of historical data (billions of data points)
 * - Multi-region: 5+ regions globally
 *
 * Reliability (NFR-R):
 * - Forecast accuracy: <10% error for 30-day forecasts
 * - Availability: 99.9% for capacity monitoring
 * - Alerting: 99.9% delivery rate
 * - No false positives: <5% false alarm rate
 *
 * Cost (NFR-C):
 * - Use downsampling: 1-min → 1-hour → 1-day for old data
 * - Compression: 10x reduction in storage with time-series DB
 * - Tiered storage: Hot (7 days), warm (90 days), cold (2 years)
 * - Optimize forecasting: Only recompute when significant change
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
import statistics

class CapacityPlanningSystem:
    """
    Capacity Planning System

    Key Operations:
    1. collect_metrics: Ingest resource usage metrics
    2. forecast_usage: Predict future resource needs
    3. detect_capacity_alert: Alert on resource exhaustion
    4. plan_growth: What-if analysis for traffic growth
    5. calculate_headroom: Check if sufficient capacity buffer exists
    """

    def __init__(self):
        self.metrics = {}  # {resource_id: [Metric]}
        self.forecasts = {}  # {resource_id: Forecast}
        self.alerts = []  # [Alert]
        self.budgets = {}  # {team: Budget}

    def collect_metrics(self, metric_event: dict) -> dict:
        """
        Collect resource usage metric.

        FR: Multi-dimensional metrics (service, cluster, region)
        NFR-P: Handle 1M+ metrics per minute

        Args:
            metric_event: {
                'resource_id': 'cluster-1',
                'resource_type': 'cpu' | 'memory' | 'disk' | 'network',
                'usage_percentage': float,  # 0-100
                'timestamp': datetime,
                'dimensions': {
                    'service': str,
                    'cluster': str,
                    'region': str
                }
            }

        Returns:
            {
                'metric_id': str,
                'resource_id': str,
                'timestamp': datetime
            }
        """
        resource_id = metric_event['resource_id']
        resource_type = metric_event['resource_type']

        # Create composite key for time-series storage
        metric_key = f"{resource_id}:{resource_type}"

        if metric_key not in self.metrics:
            self.metrics[metric_key] = []

        metric = {
            'metric_id': f"metric:{metric_key}:{int(metric_event['timestamp'].timestamp())}",
            'resource_id': resource_id,
            'resource_type': resource_type,
            'usage_percentage': metric_event['usage_percentage'],
            'timestamp': metric_event['timestamp'],
            'dimensions': metric_event.get('dimensions', {})
        }

        self.metrics[metric_key].append(metric)

        # Keep only recent metrics (NFR-C: Downsampling)
        # In production: 1-min resolution for 7 days, 1-hour for 90 days, 1-day for 2 years
        if len(self.metrics[metric_key]) > 10000:
            # Downsample older metrics
            self.metrics[metric_key] = self.metrics[metric_key][-10000:]

        return {
            'metric_id': metric['metric_id'],
            'resource_id': resource_id,
            'timestamp': metric_event['timestamp'].isoformat()
        }

    def forecast_usage(self, resource_id: str, resource_type: str, forecast_days: int, context: dict) -> dict:
        """
        Forecast future resource usage using linear regression + seasonality.

        FR: Forecasting with seasonal patterns
        NFR-R: <10% error for 30-day forecasts
        NFR-P: <10 seconds for 2 years of data

        Args:
            resource_id: Resource to forecast
            resource_type: 'cpu' | 'memory' | 'disk' | 'network'
            forecast_days: How many days ahead to forecast
            context: Contains historical data, seasonality config

        Returns:
            {
                'forecast_date': datetime,
                'p50_usage': float,  # Median forecast
                'p95_usage': float,  # 95th percentile (conservative)
                'p99_usage': float,  # 99th percentile (very conservative)
                'trend': 'increasing' | 'stable' | 'decreasing'
            }
        """
        metric_key = f"{resource_id}:{resource_type}"

        if metric_key not in self.metrics or len(self.metrics[metric_key]) < 7:
            return {'error': 'Insufficient historical data (need 7+ days)'}

        # Get historical metrics
        historical = sorted(self.metrics[metric_key], key=lambda x: x['timestamp'])

        # Calculate linear trend (simple linear regression)
        # y = mx + b where y is usage, x is day number
        n = len(historical)
        days = [(h['timestamp'] - historical[0]['timestamp']).days for h in historical]
        usages = [h['usage_percentage'] for h in historical]

        # Calculate slope (m) and intercept (b)
        mean_day = statistics.mean(days)
        mean_usage = statistics.mean(usages)

        numerator = sum((days[i] - mean_day) * (usages[i] - mean_usage) for i in range(n))
        denominator = sum((days[i] - mean_day) ** 2 for i in range(n))

        if denominator > 0:
            slope = numerator / denominator  # Growth per day
            intercept = mean_usage - slope * mean_day
        else:
            slope = 0
            intercept = mean_usage

        # Forecast for N days ahead
        forecast_date = historical[-1]['timestamp'] + timedelta(days=forecast_days)
        forecast_day = (forecast_date - historical[0]['timestamp']).days

        # Linear forecast
        linear_forecast = slope * forecast_day + intercept

        # Add seasonality (simplified: weekly pattern)
        # In production: Use Fourier series or STL decomposition
        day_of_week = forecast_date.weekday()  # 0 = Monday, 6 = Sunday

        # Calculate average usage for this day of week from historical data
        same_day_usages = [
            h['usage_percentage'] for h in historical
            if h['timestamp'].weekday() == day_of_week
        ]

        if same_day_usages:
            seasonal_adjustment = statistics.mean(same_day_usages) - mean_usage
        else:
            seasonal_adjustment = 0

        # P50 forecast (median): Linear + seasonality
        p50_forecast = linear_forecast + seasonal_adjustment

        # Add uncertainty for P95 and P99
        # Calculate standard deviation of residuals
        residuals = [usages[i] - (slope * days[i] + intercept) for i in range(n)]
        if len(residuals) > 1:
            std_dev = statistics.stdev(residuals)
        else:
            std_dev = 0

        # P95: Add 1.96 * std_dev (95% confidence interval)
        # P99: Add 2.58 * std_dev (99% confidence interval)
        p95_forecast = p50_forecast + 1.96 * std_dev
        p99_forecast = p50_forecast + 2.58 * std_dev

        # Clamp to 0-100%
        p50_forecast = max(0, min(100, p50_forecast))
        p95_forecast = max(0, min(100, p95_forecast))
        p99_forecast = max(0, min(100, p99_forecast))

        # Determine trend
        if slope > 0.5:  # Growing >0.5% per day
            trend = 'increasing'
        elif slope < -0.5:
            trend = 'decreasing'
        else:
            trend = 'stable'

        # Store forecast
        forecast = {
            'resource_id': resource_id,
            'resource_type': resource_type,
            'forecast_date': forecast_date,
            'p50_usage': round(p50_forecast, 2),
            'p95_usage': round(p95_forecast, 2),
            'p99_usage': round(p99_forecast, 2),
            'trend': trend,
            'slope': round(slope, 4)
        }

        self.forecasts[metric_key] = forecast

        return {
            'forecast_date': forecast_date.isoformat(),
            'p50_usage': round(p50_forecast, 2),
            'p95_usage': round(p95_forecast, 2),
            'p99_usage': round(p99_forecast, 2),
            'trend': trend
        }

    def detect_capacity_alert(self, resource_id: str, resource_type: str, context: dict) -> dict:
        """
        Detect capacity alerts (threshold violations, forecast exhaustion).

        FR: Threshold alerts + forecast alerts
        NFR-R: <5% false alarm rate

        Args:
            resource_id: Resource to check
            resource_type: 'cpu' | 'memory' | 'disk' | 'network'
            context: Contains thresholds, current usage

        Returns:
            {
                'alert_triggered': bool,
                'alert_type': 'threshold' | 'forecast_exhaustion',
                'severity': 'warning' | 'critical',
                'message': str,
                'time_to_exhaustion_days': int | None
            }
        """
        metric_key = f"{resource_id}:{resource_type}"

        # Get current usage
        if metric_key not in self.metrics or not self.metrics[metric_key]:
            return {'alert_triggered': False, 'message': 'No metrics available'}

        current_metric = sorted(self.metrics[metric_key], key=lambda x: x['timestamp'], reverse=True)[0]
        current_usage = current_metric['usage_percentage']

        # Thresholds
        warning_threshold = context.get('warning_threshold', 80)
        critical_threshold = context.get('critical_threshold', 90)

        # 1. Threshold-based alerts
        if current_usage >= critical_threshold:
            alert = {
                'alert_id': f"alert:{metric_key}:{int(datetime.now().timestamp())}",
                'resource_id': resource_id,
                'resource_type': resource_type,
                'alert_type': 'threshold',
                'severity': 'critical',
                'current_usage': current_usage,
                'threshold': critical_threshold,
                'message': f'{resource_type.upper()} usage at {current_usage}% (critical threshold: {critical_threshold}%)',
                'timestamp': datetime.now()
            }
            self.alerts.append(alert)

            return {
                'alert_triggered': True,
                'alert_type': 'threshold',
                'severity': 'critical',
                'message': alert['message'],
                'current_usage': current_usage
            }

        elif current_usage >= warning_threshold:
            alert = {
                'alert_id': f"alert:{metric_key}:{int(datetime.now().timestamp())}",
                'resource_id': resource_id,
                'resource_type': resource_type,
                'alert_type': 'threshold',
                'severity': 'warning',
                'current_usage': current_usage,
                'threshold': warning_threshold,
                'message': f'{resource_type.upper()} usage at {current_usage}% (warning threshold: {warning_threshold}%)',
                'timestamp': datetime.now()
            }
            self.alerts.append(alert)

            return {
                'alert_triggered': True,
                'alert_type': 'threshold',
                'severity': 'warning',
                'message': alert['message'],
                'current_usage': current_usage
            }

        # 2. Forecast-based alerts ("will run out in 30 days")
        if metric_key in self.forecasts:
            # Check forecast for next 30 days
            for days_ahead in [7, 14, 30]:
                forecast = self.forecast_usage(resource_id, resource_type, days_ahead, context)

                if forecast.get('p95_usage', 0) >= 100:
                    # Will exhaust capacity within this timeframe (P95 forecast)
                    alert = {
                        'alert_id': f"alert:{metric_key}:forecast:{int(datetime.now().timestamp())}",
                        'resource_id': resource_id,
                        'resource_type': resource_type,
                        'alert_type': 'forecast_exhaustion',
                        'severity': 'warning',
                        'forecast_date': forecast['forecast_date'],
                        'forecast_usage': forecast['p95_usage'],
                        'time_to_exhaustion_days': days_ahead,
                        'message': f'{resource_type.upper()} will reach 100% capacity in ~{days_ahead} days (P95 forecast: {forecast["p95_usage"]}%)',
                        'timestamp': datetime.now()
                    }
                    self.alerts.append(alert)

                    return {
                        'alert_triggered': True,
                        'alert_type': 'forecast_exhaustion',
                        'severity': 'warning',
                        'message': alert['message'],
                        'time_to_exhaustion_days': days_ahead,
                        'forecast_usage': forecast['p95_usage']
                    }

        return {
            'alert_triggered': False,
            'message': 'No capacity alerts'
        }

    def plan_growth(self, resource_id: str, growth_multiplier: float, context: dict) -> dict:
        """
        What-if analysis: Calculate resource needs for traffic growth.

        FR: What-if analysis for capacity planning
        NFR-P: <10 seconds for calculation

        Args:
            resource_id: Resource to plan for
            growth_multiplier: Traffic growth factor (e.g., 2.0 for 2x)
            context: Contains current capacity, cost per unit

        Returns:
            {
                'current_servers': int,
                'required_servers': int,
                'additional_servers': int,
                'monthly_cost': float,
                'procurement_timeline_days': int
            }
        """
        # Get current capacity
        current_servers = context.get('current_servers', 100)
        cpu_per_server = context.get('cpu_per_server', 32)  # cores
        cost_per_server = context.get('cost_per_server', 500)  # $/month

        # Calculate current utilization
        total_current_cpu = current_servers * cpu_per_server

        # Get average CPU usage
        cpu_metrics = [m for m in self.metrics.get(f"{resource_id}:cpu", [])
                      if (datetime.now() - m['timestamp']).days < 7]

        if cpu_metrics:
            avg_cpu_usage_pct = statistics.mean(m['usage_percentage'] for m in cpu_metrics)
            current_cpu_used = total_current_cpu * (avg_cpu_usage_pct / 100)
        else:
            avg_cpu_usage_pct = 50  # Assume 50%
            current_cpu_used = total_current_cpu * 0.5

        # Calculate required CPU after growth
        required_cpu = current_cpu_used * growth_multiplier

        # Add 20% headroom buffer (NFR-R: Ensure 20% buffer)
        required_cpu_with_buffer = required_cpu * 1.2

        # Calculate required servers (round up)
        required_servers = int((required_cpu_with_buffer + cpu_per_server - 1) // cpu_per_server)

        # Additional servers needed
        additional_servers = max(0, required_servers - current_servers)

        # Cost calculation
        monthly_cost = additional_servers * cost_per_server

        # Procurement timeline (assume 3 months for hardware procurement)
        procurement_timeline_days = 90 if additional_servers > 0 else 0

        return {
            'current_servers': current_servers,
            'required_servers': required_servers,
            'additional_servers': additional_servers,
            'current_cpu_usage_pct': round(avg_cpu_usage_pct, 2),
            'growth_multiplier': growth_multiplier,
            'monthly_cost': monthly_cost,
            'procurement_timeline_days': procurement_timeline_days
        }

    def calculate_headroom(self, resource_id: str, resource_type: str, context: dict) -> dict:
        """
        Calculate available headroom (buffer capacity).

        FR: Headroom tracking (ensure 20% buffer)
        NFR-R: Ensure sufficient buffer for traffic spikes

        Args:
            resource_id: Resource to check
            resource_type: 'cpu' | 'memory' | 'disk' | 'network'
            context: Contains target headroom percentage

        Returns:
            {
                'current_usage_pct': float,
                'headroom_pct': float,  # Remaining capacity
                'target_headroom_pct': float,  # Desired buffer (e.g., 20%)
                'headroom_sufficient': bool
            }
        """
        metric_key = f"{resource_id}:{resource_type}"

        # Get recent average usage (last 7 days)
        recent_metrics = [
            m for m in self.metrics.get(metric_key, [])
            if (datetime.now() - m['timestamp']).days < 7
        ]

        if not recent_metrics:
            return {'error': 'No recent metrics available'}

        # Use P95 usage (conservative estimate)
        usages = [m['usage_percentage'] for m in recent_metrics]
        usages.sort()
        p95_index = int(len(usages) * 0.95)
        current_usage_pct = usages[p95_index] if usages else 0

        # Calculate headroom
        headroom_pct = 100 - current_usage_pct

        # Target headroom (default: 20%)
        target_headroom_pct = context.get('target_headroom_pct', 20)

        # Check if sufficient
        headroom_sufficient = headroom_pct >= target_headroom_pct

        return {
            'current_usage_pct': round(current_usage_pct, 2),
            'headroom_pct': round(headroom_pct, 2),
            'target_headroom_pct': target_headroom_pct,
            'headroom_sufficient': headroom_sufficient
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "collect_metrics",
        "description": "FR: Collect resource usage metrics, NFR-P: Handle 1M+ metrics/min",
        "input": {
            "operation": "collect_metrics",
            "metric_event": {
                "resource_id": "cluster-1",
                "resource_type": "cpu",
                "usage_percentage": 75.5,
                "timestamp": "2024-01-15T14:30:00Z",
                "dimensions": {
                    "service": "api-service",
                    "cluster": "prod-east",
                    "region": "us-east-1"
                }
            }
        },
        "expected_output": {
            "metric_id": "<auto-generated>",
            "resource_id": "cluster-1",
            "timestamp": "2024-01-15T14:30:00Z"
        }
    },
    {
        "id": 2,
        "name": "forecast_usage_increasing_trend",
        "description": "FR: Forecast with linear trend, NFR-R: <10% error for 30 days",
        "input": {
            "operation": "forecast_usage",
            "setup": {
                "historical_metrics": [
                    {"day": 0, "usage": 50.0},
                    {"day": 1, "usage": 51.0},
                    {"day": 2, "usage": 52.0},
                    {"day": 3, "usage": 53.0},
                    {"day": 4, "usage": 54.0},
                    {"day": 5, "usage": 55.0},
                    {"day": 6, "usage": 56.0}
                ]
            },
            "resource_id": "cluster-2",
            "resource_type": "memory",
            "forecast_days": 30,
            "context": {}
        },
        "expected_output": {
            "forecast_date": "<30 days from last metric>",
            "p50_usage": 80.0,  # Linear: 50 + (1% * 30 days) = 80%
            "p95_usage": ">80",  # Higher due to uncertainty
            "p99_usage": ">p95",
            "trend": "increasing"
        }
    },
    {
        "id": 3,
        "name": "detect_capacity_alert_threshold",
        "description": "FR: Alert when usage >90% (critical), NFR-R: <5% false alarm",
        "input": {
            "operation": "detect_capacity_alert",
            "setup": {
                "collect_metric": {
                    "resource_id": "db-cluster-1",
                    "resource_type": "disk",
                    "usage_percentage": 95.0,
                    "timestamp": "2024-01-15T14:30:00Z"
                }
            },
            "resource_id": "db-cluster-1",
            "resource_type": "disk",
            "context": {
                "warning_threshold": 80,
                "critical_threshold": 90
            }
        },
        "expected_output": {
            "alert_triggered": True,
            "alert_type": "threshold",
            "severity": "critical",
            "message": "DISK usage at 95.0% (critical threshold: 90%)",
            "current_usage": 95.0
        }
    },
    {
        "id": 4,
        "name": "detect_forecast_exhaustion_alert",
        "description": "FR: Alert 'will run out in 30 days'",
        "input": {
            "operation": "detect_capacity_alert",
            "setup": {
                "historical_metrics": [
                    {"day": 0, "usage": 70.0},
                    {"day": 1, "usage": 72.0},
                    {"day": 2, "usage": 74.0},
                    {"day": 3, "usage": 76.0},
                    {"day": 4, "usage": 78.0},
                    {"day": 5, "usage": 80.0},
                    {"day": 6, "usage": 82.0}
                ]
            },
            "resource_id": "storage-cluster",
            "resource_type": "disk",
            "context": {
                "warning_threshold": 80,
                "critical_threshold": 90
            }
        },
        "expected_output": {
            "alert_triggered": True,
            "alert_type": "forecast_exhaustion",
            "severity": "warning",
            "message": "DISK will reach 100% capacity in ~30 days",
            "time_to_exhaustion_days": 30,
            "forecast_usage": ">95"
        }
    },
    {
        "id": 5,
        "name": "plan_growth_2x_traffic",
        "description": "FR: What-if analysis - 2x traffic growth, NFR-P: <10 seconds",
        "input": {
            "operation": "plan_growth",
            "setup": {
                "collect_metrics": {
                    "resource_id": "web-tier",
                    "resource_type": "cpu",
                    "avg_usage": 60.0,  # 60% CPU usage
                    "days": 7
                }
            },
            "resource_id": "web-tier",
            "growth_multiplier": 2.0,
            "context": {
                "current_servers": 100,
                "cpu_per_server": 32,
                "cost_per_server": 500
            }
        },
        "expected_output": {
            "current_servers": 100,
            "required_servers": 150,  # 2x traffic + 20% buffer → 1.5x servers
            "additional_servers": 50,
            "current_cpu_usage_pct": 60.0,
            "growth_multiplier": 2.0,
            "monthly_cost": 25000,  # 50 servers * $500
            "procurement_timeline_days": 90
        }
    },
    {
        "id": 6,
        "name": "calculate_headroom_sufficient",
        "description": "FR: Headroom tracking - ensure 20% buffer",
        "input": {
            "operation": "calculate_headroom",
            "setup": {
                "collect_metrics": {
                    "resource_id": "app-cluster",
                    "resource_type": "cpu",
                    "p95_usage": 70.0,
                    "days": 7
                }
            },
            "resource_id": "app-cluster",
            "resource_type": "cpu",
            "context": {
                "target_headroom_pct": 20
            }
        },
        "expected_output": {
            "current_usage_pct": 70.0,
            "headroom_pct": 30.0,  # 100 - 70
            "target_headroom_pct": 20,
            "headroom_sufficient": True  # 30% > 20%
        }
    },
    {
        "id": 7,
        "name": "calculate_headroom_insufficient",
        "description": "FR: Alert when headroom <20% (buffer too small)",
        "input": {
            "operation": "calculate_headroom",
            "setup": {
                "collect_metrics": {
                    "resource_id": "overloaded-cluster",
                    "resource_type": "memory",
                    "p95_usage": 90.0,
                    "days": 7
                }
            },
            "resource_id": "overloaded-cluster",
            "resource_type": "memory",
            "context": {
                "target_headroom_pct": 20
            }
        },
        "expected_output": {
            "current_usage_pct": 90.0,
            "headroom_pct": 10.0,  # 100 - 90
            "target_headroom_pct": 20,
            "headroom_sufficient": False  # 10% < 20%
        }
    },
    {
        "id": 8,
        "name": "nfr_downsampling",
        "description": "NFR-C: Use downsampling to reduce storage costs",
        "input": {
            "operation": "collect_large_dataset",
            "metrics_count": 100000,  # 100K metrics
            "time_range_days": 90
        },
        "expected_output": {
            "stored_metrics": "<10000",  # Downsampled to 10K
            "compression_ratio": ">10x",
            "storage_saved_percentage": ">90%"
        }
    }
]


export const capacityPlanningSystemChallenge: SystemDesignChallenge = {
  id: 'capacity_planning_system',
  title: 'Capacity Planning System',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Capacity Planning System that forecasts resource needs (CPU, memory, storage) and plans capacity ahead of demand to prevent outages and optimize costs.

**Real-world Context:**
At Google, Borg's capacity planning prevents resource exhaustion across massive clusters. The system forecasts usage 30-90 days ahead using linear regression + seasonality, alerts when "disk will run out in 30 days", and performs what-if analysis: "If traffic grows 2x during Black Friday, we need 500 more servers with 90-day procurement timeline."

**Key Technical Challenges:**
1. **Forecasting**: How do you predict resource needs 30-90 days ahead with <10% error?
2. **Seasonality**: How do you account for daily/weekly/yearly patterns (Black Friday, holidays)?
3. **Multi-Resource Planning**: How do you plan when CPU, memory, and disk grow at different rates?
4. **Cost Optimization**: How do you balance headroom (20% buffer) vs cost (extra servers)?

**Companies Asking This:** Google (Borg), AWS, Netflix (Scryer), Uber (Peloton), Airbnb`,

  realWorldScenario: {
    company: 'Google',
    context: 'Black Friday traffic is expected to be 3x normal. Need to plan capacity 3 months ahead.',
    constraint: 'Must ensure 20% headroom buffer while minimizing cost. Hardware procurement takes 90 days.'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Linear Regression Forecasting',
      content: 'Use simple linear regression (y = mx + b) where m is growth rate. Extrapolate trend for 30-90 days. Add seasonal adjustment for day-of-week patterns.'
    },
    {
      stage: 'FR',
      title: 'Confidence Intervals',
      content: 'Provide P50 (median), P95, P99 forecasts. P95 = P50 + 1.96*σ (95% confidence). Use P95 for conservative capacity planning.'
    },
    {
      stage: 'FR',
      title: 'Forecast Alerts',
      content: 'Alert "will exhaust capacity in X days" by checking when P95 forecast hits 100%. Gives time for procurement (90 days for hardware).'
    },
    {
      stage: 'FR',
      title: 'What-If Analysis',
      content: 'For N× traffic growth: required_cpu = current_used * N * 1.2 (add 20% headroom). Calculate servers needed and cost.'
    },
    {
      stage: 'NFR-R',
      title: 'Forecast Accuracy',
      content: 'Aim for <10% error on 30-day forecasts. Track actual vs predicted to calibrate model. Recompute forecast weekly with new data.'
    },
    {
      stage: 'NFR-C',
      title: 'Downsampling',
      content: 'Store 1-min resolution for 7 days, 1-hour for 90 days, 1-day for 2 years. Use time-series DB (InfluxDB) for 10× compression.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Collects multi-dimensional metrics (service, cluster, region)',
        'Forecasts usage using linear regression + seasonality',
        'Provides P50, P95, P99 confidence intervals',
        'Detects threshold alerts (CPU >80%) and forecast exhaustion alerts',
        'Performs what-if analysis for traffic growth',
        'Calculates headroom (20% buffer)'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Forecast calculation <10 seconds for 2 years data',
        'Real-time monitoring <1 minute lag',
        'Dashboard queries <2 seconds',
        'Batch forecasting for 1000+ services'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 10K+ servers/containers',
        'Handles 1M+ metrics per minute',
        'Stores 2+ years historical data',
        'Multi-region (5+ regions)'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear linear regression implementation',
        'Proper statistical calculations (mean, stdev, confidence intervals)',
        'Downsampling logic for cost optimization',
        'Clean test cases covering forecasting, alerts, what-if analysis, headroom'
      ]
    }
  },

  commonMistakes: [
    'No confidence intervals → only point forecast, can\'t plan for worst-case',
    'Ignoring seasonality → forecasts miss daily/weekly patterns',
    'No headroom buffer → traffic spikes cause outages',
    'No forecast alerts → reactively add capacity after exhaustion',
    'Not tracking forecast accuracy → can\'t improve model over time',
    'No downsampling → storing billions of 1-min metrics is too expensive'
  ],

  companiesAsking: ['Google', 'AWS', 'Netflix', 'Uber', 'Airbnb'],
  relatedPatterns: [
    'Metrics Aggregation Service (time-series storage for capacity metrics)',
    'Alerting & Incident Management (capacity alerts)',
    'Internal Job Scheduler (resource allocation based on capacity)',
    'Developer Metrics Dashboard (similar forecasting and trend analysis)'
  ]
};
