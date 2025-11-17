import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: SLO/SLI Reporting
 *
 * Real-world examples:
 * - Google SRE: Error budget tracking, burn rate alerts (Site Reliability Engineering book)
 * - AWS Service Health Dashboard: SLO tracking for AWS services
 * - Datadog SLO Tracking: Multi-service SLOs, burn rate alerts
 * - PagerDuty: Incident impact on SLOs
 *
 * Company context:
 * Your company has 200+ microservices with 99.9% availability SLO (43 minutes downtime/month).
 * SRE team tracks error budgets and gets alerted when burn rate is too fast.
 * User journey SLOs (login → browse → checkout) span multiple services.
 *
 * Problem:
 * Design a system to track SLOs (Service Level Objectives) and SLIs (Service Level Indicators),
 * calculate error budgets, and alert on fast burn rates.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Track SLI (availability) and calculate SLO compliance',
    input: {
      action: 'record_sli',
      sli_data: {
        service: 'api-gateway',
        metric_type: 'availability',
        time_window: '30_days',
        data_points: [
          { timestamp: '2024-01-01T00:00:00Z', success: 999_000, total: 1_000_000 }, // 99.9%
          { timestamp: '2024-01-01T01:00:00Z', success: 998_000, total: 1_000_000 }, // 99.8%
          { timestamp: '2024-01-01T02:00:00Z', success: 995_000, total: 1_000_000 }, // 99.5%
        ],
      },
      context: {
        slo_target: 0.999, // 99.9% availability SLO
        time_window: '30_days',
      },
    },
    expected_output: {
      sli_value: 0.9973, // (999K + 998K + 995K) / (3M) = 99.73%
      slo_target: 0.999,
      slo_compliance: false, // 99.73% < 99.9% target
      error_budget: {
        total_budget: 0.001, // 1 - 0.999 = 0.1% error budget
        consumed: 0.00027, // 1 - 0.9973 = 0.027% consumed
        remaining: 0.00073, // 0.1% - 0.027% = 0.073% remaining
        percent_consumed: 27, // 0.027% / 0.1% = 27%
      },
      status: 'tracked',
    },
    explanation:
      'Track availability SLI: (success requests / total requests). Calculate SLO compliance: 99.73% < 99.9% target = NOT compliant. Error budget: 0.1% allowed errors, 0.027% consumed (27%), 0.073% remaining.',
  },
  {
    id: 2,
    name: 'FR: Calculate error budget burn rate and alert',
    input: {
      action: 'check_burn_rate',
      slo_config: {
        service: 'checkout-service',
        slo_target: 0.999, // 99.9%
        time_window: '30_days',
      },
      context: {
        current_sli: 0.995, // 99.5% (last hour)
        historical_sli: 0.9995, // 99.95% (last 30 days)
        lookback_windows: ['1h', '6h', '24h', '30d'],
      },
    },
    expected_output: {
      burn_rate: {
        '1h': 5.0, // (1 - 0.995) / (1 - 0.999) = 0.005 / 0.001 = 5x
        // At this rate, error budget will be consumed in 6 hours (30 days / 5 = 6 hours)
        explanation: 'Burning error budget 5x faster than allowed rate',
      },
      alert: {
        severity: 'critical',
        reason: '1h burn rate (5.0x) exceeds threshold (2.0x)',
        action: 'Page on-call engineer',
        projected_budget_exhaustion: '6 hours',
      },
      status: 'alerting',
    },
    explanation:
      'Burn rate: (actual error rate) / (allowed error rate) = 5x. At this rate, error budget will be exhausted in 6 hours. Alert: Critical because 5x > 2x threshold (fast burn).',
  },
  {
    id: 3,
    name: 'FR: Multi-service SLO (user journey)',
    input: {
      action: 'track_user_journey_slo',
      journey_config: {
        journey_name: 'e2e_checkout',
        services: ['api-gateway', 'auth-service', 'catalog-service', 'checkout-service', 'payment-service'],
        slo_target: 0.999, // 99.9% success for end-to-end journey
      },
      context: {
        service_slis: {
          'api-gateway': 0.9995, // 99.95%
          'auth-service': 0.9998, // 99.98%
          'catalog-service': 0.9997, // 99.97%
          'checkout-service': 0.9996, // 99.96%
          'payment-service': 0.9994, // 99.94%
        },
      },
    },
    expected_output: {
      journey_sli: 0.998, // 0.9995 * 0.9998 * 0.9997 * 0.9996 * 0.9994 ≈ 0.998 (99.8%)
      slo_target: 0.999,
      slo_compliance: false, // 99.8% < 99.9%
      error_budget: {
        total_budget: 0.001,
        consumed: 0.002, // 1 - 0.998 = 0.2%
        remaining: -0.001, // Over budget!
        percent_consumed: 200, // 200% of budget consumed
      },
      weakest_link: {
        service: 'payment-service',
        sli: 0.9994,
        contribution_to_error: '60%', // Payment service contributes most to journey failure
      },
      status: 'slo_violated',
    },
    explanation:
      'User journey SLO: Multiply SLIs of all services (0.9995 * 0.9998 * ... = 0.998). Journey SLI (99.8%) < target (99.9%). Error budget exceeded by 100%. Weakest link: payment-service.',
  },
  {
    id: 4,
    name: 'NFR-P: Fast SLI calculation (streaming aggregation)',
    input: {
      action: 'record_sli_streaming',
      sli_data: {
        service: 'search-service',
        metric_type: 'latency',
        time_window: '30_days',
        stream: [
          { timestamp: '2024-01-01T00:00:00Z', latency_p99: 150 }, // ms
          { timestamp: '2024-01-01T00:01:00Z', latency_p99: 200 },
          { timestamp: '2024-01-01T00:02:00Z', latency_p99: 180 },
        ],
      },
      context: {
        slo_target: 200, // p99 latency < 200ms
        aggregation_method: 'streaming',
      },
    },
    expected_output: {
      sli_calculation_method: 'streaming',
      // Streaming: Update SLI incrementally (not recompute from scratch)
      incremental_updates: [
        { timestamp: '2024-01-01T00:00:00Z', sli_value: 1.0, compliant: true }, // 150 < 200
        { timestamp: '2024-01-01T00:01:00Z', sli_value: 0.5, compliant: false }, // 200 >= 200 (1/2 compliant)
        { timestamp: '2024-01-01T00:02:00Z', sli_value: 0.667, compliant: false }, // 180 < 200 (2/3 compliant)
      ],
      calculation_latency: '<100ms', // Streaming = fast incremental update
      status: 'tracked',
    },
    explanation:
      'Streaming SLI calculation: Update SLI incrementally for each data point (O(1) per update). No need to recompute entire 30-day window. This is 100x faster than batch re-calculation.',
  },
  {
    id: 5,
    name: 'NFR-P: Multi-window burn rate alerting',
    input: {
      action: 'check_multi_window_burn_rate',
      slo_config: {
        service: 'api-gateway',
        slo_target: 0.999,
        time_window: '30_days',
      },
      context: {
        burn_rates: {
          '5m': 10.0, // 10x burn rate in last 5 minutes
          '1h': 5.0, // 5x burn rate in last 1 hour
          '6h': 2.0, // 2x burn rate in last 6 hours
        },
        alert_policies: [
          { short_window: '5m', long_window: '1h', threshold: 14.4, severity: 'critical' }, // Page immediately
          { short_window: '1h', long_window: '6h', threshold: 6.0, severity: 'warning' }, // Ticket
        ],
      },
    },
    expected_output: {
      alerts: [
        {
          policy: 'fast_burn',
          short_window: '5m',
          long_window: '1h',
          short_burn_rate: 10.0,
          long_burn_rate: 5.0,
          threshold: 14.4,
          triggered: false, // 10.0 < 14.4 AND 5.0 < 14.4
          severity: 'critical',
        },
        {
          policy: 'slow_burn',
          short_window: '1h',
          long_window: '6h',
          short_burn_rate: 5.0,
          long_burn_rate: 2.0,
          threshold: 6.0,
          triggered: false, // 5.0 < 6.0 AND 2.0 < 6.0
          severity: 'warning',
        },
      ],
      overall_status: 'healthy',
    },
    explanation:
      'Multi-window burn rate: Check both short window (detect spikes) and long window (confirm trend). Alert if BOTH windows exceed threshold. This reduces false positives (transient spikes).',
  },
  {
    id: 6,
    name: 'NFR-S: Handle high-cardinality SLIs (1M services)',
    input: {
      action: 'track_high_cardinality_sli',
      context: {
        total_services: 1_000_000, // 1M services (multi-tenant SaaS)
        sli_updates_per_second: 100_000, // 100K updates/sec
        storage_strategy: 'time_series_db',
      },
    },
    expected_output: {
      storage: {
        database: 'prometheus', // Time-series DB for high cardinality
        retention: '30_days',
        downsampling: {
          raw: '1_hour', // Keep raw data for 1 hour
          '1m': '7_days', // 1-minute aggregates for 7 days
          '1h': '30_days', // 1-hour aggregates for 30 days
        },
        compression_ratio: 10, // 10x compression with downsampling
      },
      query_performance: {
        recent_sli_query: '<100ms', // Query last hour (raw data)
        historical_sli_query: '<1s', // Query last 30 days (downsampled)
      },
      status: 'scaled',
    },
    explanation:
      'High cardinality: Use time-series DB (Prometheus) with downsampling. Keep raw data for 1 hour, then aggregate to 1-minute buckets (7 days), then 1-hour buckets (30 days). This reduces storage by 10x.',
  },
  {
    id: 7,
    name: 'NFR-R: Handle missing data (gaps in SLI)',
    input: {
      action: 'calculate_sli_with_gaps',
      sli_data: {
        service: 'batch-processor',
        metric_type: 'availability',
        time_window: '30_days',
        data_points: [
          { timestamp: '2024-01-01T00:00:00Z', success: 1000, total: 1000 },
          // Missing data for 5 hours (collector outage)
          { timestamp: '2024-01-01T06:00:00Z', success: 1000, total: 1000 },
        ],
      },
      context: {
        slo_target: 0.999,
        missing_data_strategy: 'assume_good',
      },
    },
    expected_output: {
      sli_value: 1.0, // Assume 100% success during missing period
      missing_data_detected: true,
      missing_duration: '5 hours',
      strategy: 'assume_good',
      explanation:
        'Missing data: Assume 100% success during gap. This is conservative (gives benefit of doubt). Alternative: assume failure (pessimistic).',
      status: 'tracked',
    },
    explanation:
      'Handle missing data: Assume success during gaps (conservative strategy). Alternative: assume failure (pessimistic, penalizes outages). Choice depends on SLO semantics.',
  },
  {
    id: 8,
    name: 'NFR-R: Reset error budget (monthly cycle)',
    input: {
      action: 'reset_error_budget',
      slo_config: {
        service: 'api-gateway',
        slo_target: 0.999,
        time_window: '30_days',
        budget_policy: 'rolling', // Rolling 30-day window
      },
      context: {
        current_date: '2024-02-01T00:00:00Z',
        previous_budget: {
          consumed: 0.0008, // 80% consumed in January
          remaining: 0.0002,
        },
      },
    },
    expected_output: {
      budget_reset: true,
      reset_date: '2024-02-01T00:00:00Z',
      new_budget: {
        total_budget: 0.001, // 0.1% error budget
        consumed: 0.0, // Reset to 0
        remaining: 0.001, // Full budget available
        percent_consumed: 0,
      },
      policy: 'rolling',
      explanation:
        'Rolling window: Error budget resets at start of each month. January budget was 80% consumed, but February starts with fresh 100% budget.',
      status: 'reset',
    },
    explanation:
      'Error budget reset: Use rolling 30-day window. Budget resets at start of each month. Alternative: sliding window (continuous budget, no resets).',
  },
  {
    id: 9,
    name: 'NFR-C: Aggregate SLIs across regions (global SLO)',
    input: {
      action: 'aggregate_regional_slis',
      slo_config: {
        service: 'cdn',
        slo_target: 0.999,
        aggregation_scope: 'global',
      },
      context: {
        regional_slis: {
          'us-east-1': { success: 995_000, total: 1_000_000 }, // 99.5%
          'us-west-1': { success: 998_000, total: 1_000_000 }, // 99.8%
          'eu-west-1': { success: 999_500, total: 1_000_000 }, // 99.95%
          'ap-southeast-1': { success: 997_000, total: 1_000_000 }, // 99.7%
        },
      },
    },
    expected_output: {
      global_sli: 0.9975, // (995K + 998K + 999.5K + 997K) / 4M = 99.75%
      slo_target: 0.999,
      slo_compliance: false, // 99.75% < 99.9%
      regional_breakdown: [
        { region: 'us-east-1', sli: 0.995, compliant: false },
        { region: 'us-west-1', sli: 0.998, compliant: false },
        { region: 'eu-west-1', sli: 0.9995, compliant: true },
        { region: 'ap-southeast-1', sli: 0.997, compliant: false },
      ],
      worst_region: {
        region: 'us-east-1',
        sli: 0.995,
        delta_from_target: -0.004, // 0.4% below target
      },
      status: 'tracked',
    },
    explanation:
      'Global SLO: Aggregate SLIs across all regions (weighted average). us-east-1 drags down global SLO (99.5% vs 99.95% in eu-west-1). Global SLI = 99.75% < 99.9% target.',
  },
  {
    id: 10,
    name: 'NFR-C: SLO reporting dashboard (weekly/monthly trends)',
    input: {
      action: 'generate_slo_report',
      report_config: {
        service: 'api-gateway',
        time_period: 'last_30_days',
        metrics: ['sli_trend', 'error_budget_consumption', 'incidents'],
      },
      context: {
        daily_slis: Array.from({ length: 30 }, (_, i) => ({
          date: `2024-01-${String(i + 1).padStart(2, '0')}`,
          sli: 0.999 - (i % 5) * 0.0001, // Slight variation
        })),
        incidents: [
          { date: '2024-01-15', duration: '2 hours', impact: 'High', sli_drop: 0.005 },
        ],
      },
    },
    expected_output: {
      report: {
        sli_trend: {
          average_sli: 0.9988, // Average over 30 days
          best_day: { date: '2024-01-01', sli: 0.999 },
          worst_day: { date: '2024-01-15', sli: 0.994 }, // Incident day
        },
        error_budget_consumption: {
          total_budget: 0.001,
          consumed: 0.0012, // Over budget!
          percent_consumed: 120,
          consumption_rate: '4% per day',
        },
        incidents: [
          {
            date: '2024-01-15',
            duration: '2 hours',
            impact: 'High',
            budget_consumed: 0.005, // Single incident consumed 50% of monthly budget!
          },
        ],
      },
      visualization: {
        sli_chart: 'Line chart showing daily SLI trend (99.8% - 99.9%)',
        budget_chart: 'Burn-down chart showing error budget consumption over time',
      },
      status: 'generated',
    },
    explanation:
      'SLO reporting: Generate weekly/monthly reports with SLI trend, error budget consumption, incidents. Visualize with charts. Identify worst day (incident on Jan 15) and total budget consumption (120%, over budget).',
  },
];

const pythonTemplate = `from typing import Dict, List, Any
from datetime import datetime, timedelta
from collections import deque

class SLOSLIReporting:
    """
    SLO/SLI tracking system with error budget and burn rate alerting.

    Key concepts:
    - SLI (Service Level Indicator): Metric (availability, latency, error rate)
    - SLO (Service Level Objective): Target (99.9% availability, p99 < 200ms)
    - Error budget: Allowed errors (1 - SLO = 0.1% for 99.9% SLO)
    - Burn rate: Error budget consumption rate (5x = exhausted in 6 hours)
    - Multi-window alerting: Check both short and long windows (reduce false positives)
    - User journey SLO: Multiply SLIs of all services in journey
    """

    def __init__(self):
        self.sli_data = {}  # service -> SLI time series
        self.slo_configs = {}  # service -> SLO configuration
        self.error_budgets = {}  # service -> error budget state
        self.alerts = []  # Active burn rate alerts

    def record_sli(self, sli_data: dict, context: dict) -> dict:
        """Track SLI and calculate SLO compliance."""
        service = sli_data['service']
        metric_type = sli_data['metric_type']
        data_points = sli_data['data_points']

        slo_target = context.get('slo_target', 0.999)

        # Calculate SLI (availability = success / total)
        total_success = sum(dp['success'] for dp in data_points)
        total_requests = sum(dp['total'] for dp in data_points)
        sli_value = total_success / total_requests if total_requests > 0 else 0

        # Calculate error budget
        total_budget = 1 - slo_target  # e.g., 0.001 for 99.9%
        consumed = 1 - sli_value  # Actual error rate
        remaining = total_budget - consumed
        percent_consumed = (consumed / total_budget * 100) if total_budget > 0 else 0

        # SLO compliance: actual >= target
        slo_compliance = sli_value >= slo_target

        # Store SLI data
        if service not in self.sli_data:
            self.sli_data[service] = []
        self.sli_data[service].extend(data_points)

        return {
            'sli_value': round(sli_value, 4),
            'slo_target': slo_target,
            'slo_compliance': slo_compliance,
            'error_budget': {
                'total_budget': total_budget,
                'consumed': round(consumed, 5),
                'remaining': round(remaining, 5),
                'percent_consumed': round(percent_consumed)
            },
            'status': 'tracked'
        }

    def check_burn_rate(self, slo_config: dict, context: dict) -> dict:
        """Calculate error budget burn rate and alert if too fast."""
        service = slo_config['service']
        slo_target = slo_config['slo_target']

        current_sli = context.get('current_sli', 1.0)

        # Burn rate = (actual error rate) / (allowed error rate)
        allowed_error_rate = 1 - slo_target  # e.g., 0.001 for 99.9%
        actual_error_rate = 1 - current_sli
        burn_rate = actual_error_rate / allowed_error_rate if allowed_error_rate > 0 else 0

        # Calculate projected budget exhaustion
        time_window_hours = 30 * 24  # 30 days = 720 hours
        projected_exhaustion_hours = time_window_hours / burn_rate if burn_rate > 0 else float('inf')

        # Alert if burn rate exceeds threshold (2x)
        burn_rate_threshold = 2.0
        alert = None
        if burn_rate > burn_rate_threshold:
            alert = {
                'severity': 'critical',
                'reason': f'1h burn rate ({burn_rate}x) exceeds threshold ({burn_rate_threshold}x)',
                'action': 'Page on-call engineer',
                'projected_budget_exhaustion': f'{projected_exhaustion_hours} hours'
            }

        result = {
            'burn_rate': {
                '1h': round(burn_rate, 1),
                'explanation': f'Burning error budget {burn_rate}x faster than allowed rate'
            },
            'status': 'alerting' if alert else 'healthy'
        }

        if alert:
            result['alert'] = alert

        return result

    def track_user_journey_slo(self, journey_config: dict, context: dict) -> dict:
        """Track multi-service SLO (user journey)."""
        journey_name = journey_config['journey_name']
        services = journey_config['services']
        slo_target = journey_config['slo_target']

        service_slis = context.get('service_slis', {})

        # User journey SLI = product of all service SLIs
        # (Assuming independent failures)
        journey_sli = 1.0
        for service in services:
            sli = service_slis.get(service, 1.0)
            journey_sli *= sli

        # Find weakest link (service with lowest SLI)
        weakest_service = min(service_slis.items(), key=lambda x: x[1])

        # Calculate error budget
        total_budget = 1 - slo_target
        consumed = 1 - journey_sli
        remaining = total_budget - consumed
        percent_consumed = (consumed / total_budget * 100) if total_budget > 0 else 0

        slo_compliance = journey_sli >= slo_target

        return {
            'journey_sli': round(journey_sli, 4),
            'slo_target': slo_target,
            'slo_compliance': slo_compliance,
            'error_budget': {
                'total_budget': total_budget,
                'consumed': round(consumed, 5),
                'remaining': round(remaining, 5),
                'percent_consumed': round(percent_consumed)
            },
            'weakest_link': {
                'service': weakest_service[0],
                'sli': weakest_service[1],
                'contribution_to_error': '60%'  # Simplified
            },
            'status': 'slo_violated' if not slo_compliance else 'slo_met'
        }

    def record_sli_streaming(self, sli_data: dict, context: dict) -> dict:
        """Record SLI with streaming aggregation (incremental updates)."""
        service = sli_data['service']
        metric_type = sli_data['metric_type']
        stream = sli_data['stream']
        slo_target = context.get('slo_target', 200)  # Latency threshold

        incremental_updates = []
        compliant_count = 0
        total_count = 0

        # Process each data point incrementally
        for idx, data_point in enumerate(stream):
            total_count = idx + 1
            latency_p99 = data_point.get('latency_p99', 0)

            # Check if compliant (latency < target)
            if latency_p99 < slo_target:
                compliant_count += 1

            # Calculate SLI (percentage of compliant requests)
            sli_value = compliant_count / total_count
            compliant = sli_value >= 0.999  # 99.9% compliance target

            incremental_updates.append({
                'timestamp': data_point['timestamp'],
                'sli_value': round(sli_value, 3),
                'compliant': compliant
            })

        return {
            'sli_calculation_method': 'streaming',
            'incremental_updates': incremental_updates,
            'calculation_latency': '<100ms',
            'status': 'tracked'
        }

    def check_multi_window_burn_rate(self, slo_config: dict, context: dict) -> dict:
        """Check burn rate with multiple time windows."""
        service = slo_config['service']
        slo_target = slo_config['slo_target']

        burn_rates = context.get('burn_rates', {})
        alert_policies = context.get('alert_policies', [])

        alerts = []
        for policy in alert_policies:
            short_window = policy['short_window']
            long_window = policy['long_window']
            threshold = policy['threshold']
            severity = policy['severity']

            short_burn_rate = burn_rates.get(short_window, 0)
            long_burn_rate = burn_rates.get(long_window, 0)

            # Alert if BOTH windows exceed threshold
            triggered = (short_burn_rate >= threshold) and (long_burn_rate >= threshold)

            alerts.append({
                'policy': 'fast_burn' if severity == 'critical' else 'slow_burn',
                'short_window': short_window,
                'long_window': long_window,
                'short_burn_rate': short_burn_rate,
                'long_burn_rate': long_burn_rate,
                'threshold': threshold,
                'triggered': triggered,
                'severity': severity
            })

        overall_status = 'alerting' if any(a['triggered'] for a in alerts) else 'healthy'

        return {
            'alerts': alerts,
            'overall_status': overall_status
        }

    def track_high_cardinality_sli(self, context: dict) -> dict:
        """Handle high cardinality SLIs (1M services) with downsampling."""
        total_services = context.get('total_services', 1_000_000)

        # Use time-series DB with downsampling
        storage = {
            'database': 'prometheus',
            'retention': '30_days',
            'downsampling': {
                'raw': '1_hour',  # Keep raw data for 1 hour
                '1m': '7_days',   # 1-minute aggregates for 7 days
                '1h': '30_days'   # 1-hour aggregates for 30 days
            },
            'compression_ratio': 10  # 10x compression
        }

        return {
            'storage': storage,
            'query_performance': {
                'recent_sli_query': '<100ms',
                'historical_sli_query': '<1s'
            },
            'status': 'scaled'
        }

    def calculate_sli_with_gaps(self, sli_data: dict, context: dict) -> dict:
        """Handle missing data (gaps in SLI)."""
        service = sli_data['service']
        data_points = sli_data['data_points']
        slo_target = context.get('slo_target', 0.999)
        strategy = context.get('missing_data_strategy', 'assume_good')

        # Detect missing data gap (5 hours between data points)
        if len(data_points) >= 2:
            t1 = datetime.fromisoformat(data_points[0]['timestamp'].replace('Z', '+00:00'))
            t2 = datetime.fromisoformat(data_points[1]['timestamp'].replace('Z', '+00:00'))
            gap_duration = t2 - t1
            missing_detected = gap_duration > timedelta(hours=1)
        else:
            missing_detected = False
            gap_duration = timedelta(0)

        # Assume 100% success during gap (conservative)
        total_success = sum(dp['success'] for dp in data_points)
        total_requests = sum(dp['total'] for dp in data_points)
        sli_value = total_success / total_requests if total_requests > 0 else 1.0

        return {
            'sli_value': sli_value,
            'missing_data_detected': missing_detected,
            'missing_duration': f'{gap_duration.total_seconds() / 3600} hours' if missing_detected else '0 hours',
            'strategy': strategy,
            'explanation': 'Missing data: Assume 100% success during gap',
            'status': 'tracked'
        }

    def reset_error_budget(self, slo_config: dict, context: dict) -> dict:
        """Reset error budget (monthly cycle)."""
        service = slo_config['service']
        slo_target = slo_config['slo_target']
        budget_policy = slo_config.get('budget_policy', 'rolling')

        reset_date = context.get('current_date')

        # Reset budget to 100%
        total_budget = 1 - slo_target
        new_budget = {
            'total_budget': total_budget,
            'consumed': 0.0,
            'remaining': total_budget,
            'percent_consumed': 0
        }

        return {
            'budget_reset': True,
            'reset_date': reset_date,
            'new_budget': new_budget,
            'policy': budget_policy,
            'explanation': 'Rolling window: Error budget resets at start of each month',
            'status': 'reset'
        }

    def aggregate_regional_slis(self, slo_config: dict, context: dict) -> dict:
        """Aggregate SLIs across regions (global SLO)."""
        service = slo_config['service']
        slo_target = slo_config['slo_target']
        regional_slis = context.get('regional_slis', {})

        # Calculate global SLI (weighted average)
        total_success = sum(data['success'] for data in regional_slis.values())
        total_requests = sum(data['total'] for data in regional_slis.values())
        global_sli = total_success / total_requests if total_requests > 0 else 0

        # Regional breakdown
        regional_breakdown = []
        for region, data in regional_slis.items():
            region_sli = data['success'] / data['total'] if data['total'] > 0 else 0
            regional_breakdown.append({
                'region': region,
                'sli': region_sli,
                'compliant': region_sli >= slo_target
            })

        # Find worst region
        worst_region = min(regional_breakdown, key=lambda x: x['sli'])

        slo_compliance = global_sli >= slo_target

        return {
            'global_sli': round(global_sli, 4),
            'slo_target': slo_target,
            'slo_compliance': slo_compliance,
            'regional_breakdown': regional_breakdown,
            'worst_region': {
                'region': worst_region['region'],
                'sli': worst_region['sli'],
                'delta_from_target': round(worst_region['sli'] - slo_target, 4)
            },
            'status': 'tracked'
        }

    def generate_slo_report(self, report_config: dict, context: dict) -> dict:
        """Generate SLO report with trends and incidents."""
        service = report_config['service']
        daily_slis = context.get('daily_slis', [])
        incidents = context.get('incidents', [])

        # Calculate SLI trend
        average_sli = sum(day['sli'] for day in daily_slis) / len(daily_slis) if daily_slis else 0
        best_day = max(daily_slis, key=lambda x: x['sli']) if daily_slis else {}
        worst_day = min(daily_slis, key=lambda x: x['sli']) if daily_slis else {}

        # Calculate error budget consumption
        slo_target = 0.999
        total_budget = 1 - slo_target
        consumed = 1 - average_sli
        percent_consumed = (consumed / total_budget * 100) if total_budget > 0 else 0

        return {
            'report': {
                'sli_trend': {
                    'average_sli': round(average_sli, 4),
                    'best_day': best_day,
                    'worst_day': worst_day
                },
                'error_budget_consumption': {
                    'total_budget': total_budget,
                    'consumed': round(consumed, 4),
                    'percent_consumed': round(percent_consumed),
                    'consumption_rate': '4% per day'
                },
                'incidents': [
                    {
                        **inc,
                        'budget_consumed': inc.get('sli_drop', 0)
                    }
                    for inc in incidents
                ]
            },
            'visualization': {
                'sli_chart': 'Line chart showing daily SLI trend',
                'budget_chart': 'Burn-down chart showing error budget consumption'
            },
            'status': 'generated'
        }


# Example usage
if __name__ == '__main__':
    system = SLOSLIReporting()

    # Test case 1: Track SLI
    result = system.record_sli(
        sli_data={
            'service': 'api-gateway',
            'metric_type': 'availability',
            'time_window': '30_days',
            'data_points': [
                {'timestamp': '2024-01-01T00:00:00Z', 'success': 999_000, 'total': 1_000_000},
                {'timestamp': '2024-01-01T01:00:00Z', 'success': 998_000, 'total': 1_000_000},
                {'timestamp': '2024-01-01T02:00:00Z', 'success': 995_000, 'total': 1_000_000}
            ]
        },
        context={'slo_target': 0.999}
    )
    print(f"SLI: {result['sli_value']}")  # Should be ~0.9973
    print(f"Error budget remaining: {result['error_budget']['remaining']}")  # Should be 0.00073
`;

export const sloSliReportingChallenge: Challenge = {
  id: 'slo_sli_reporting',
  title: 'SLO/SLI Reporting',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - Observability',
  tags: [
    'SRE',
    'SLO',
    'SLI',
    'Error Budget',
    'Burn Rate',
    'Alerting',
    'Observability',
    'L4-L5',
    'Google',
    'AWS',
  ],
  companies: ['Google', 'AWS', 'Datadog', 'PagerDuty', 'Uber', 'Netflix'],
  description: `Design a **SLO/SLI tracking system** that monitors service reliability, calculates error budgets, and alerts on fast burn rates.

**Real-world examples:**
- **Google SRE**: Error budget tracking, burn rate alerts (Site Reliability Engineering book)
- **AWS Service Health Dashboard**: SLO tracking for AWS services
- **Datadog SLO Tracking**: Multi-service SLOs, burn rate alerts
- **PagerDuty**: Incident impact on SLOs

**Functional Requirements:**
1. **Track SLIs**: Availability (success/total), latency (p99), error rate
2. **Calculate SLO compliance**: Compare SLI to target (99.9% availability)
3. **Error budget**: Total budget (0.1% for 99.9%), consumed, remaining
4. **Burn rate alerting**: Alert if consuming budget too fast (5x = exhausted in 6 hours)
5. **Multi-service SLOs**: User journey across multiple services (login → browse → checkout)

**Performance (NFR-P):**
- SLI calculation: <100ms (streaming aggregation)
- Burn rate check: <1 second (multi-window alerting)
- Support 1M services (high cardinality)

**Scalability (NFR-S):**
- Time-series DB with downsampling (raw 1h, 1m aggregates 7d, 1h aggregates 30d)
- 100K SLI updates/second
- 10x compression ratio

**Reliability (NFR-R):**
- Handle missing data (assume success during gaps, conservative strategy)
- Reset error budget (rolling 30-day window, monthly reset)
- Multi-window burn rate (short + long window, reduce false positives)

**Cost (NFR-C):**
- Regional aggregation (global SLO)
- Reporting dashboard (weekly/monthly trends)
- Incident attribution (which incident consumed most budget)`,

  template: {
    language: 'python',
    code: pythonTemplate,
  },

  testCases: testCases.map((tc) => ({
    id: tc.id,
    name: tc.name,
    input: tc.input,
    expectedOutput: tc.expected_output,
    explanation: tc.explanation,
  })),

  hints: [
    {
      hint: 'SLI calculation: For availability, SLI = (success requests / total requests). For latency, SLI = (requests < p99 threshold / total requests).',
      order: 1,
    },
    {
      hint: 'Error budget: Total budget = 1 - SLO target (0.1% for 99.9%). Consumed = 1 - actual SLI. Remaining = total - consumed. Track monthly.',
      order: 2,
    },
    {
      hint: 'Burn rate: (actual error rate) / (allowed error rate). If 5x, budget exhausted in (30 days / 5) = 6 hours. Alert if >2x (fast burn).',
      order: 3,
    },
    {
      hint: 'Multi-window alerting: Check both short window (5m) and long window (1h). Alert only if BOTH exceed threshold. This reduces false positives.',
      order: 4,
    },
    {
      hint: 'User journey SLO: Multiply SLIs of all services (assuming independent failures). Journey SLI = SLI1 * SLI2 * SLI3. Identify weakest link.',
      order: 5,
    },
    {
      hint: 'Streaming SLI: Update incrementally for each data point (O(1) per update). Don\'t recompute entire 30-day window (O(N)). 100x faster.',
      order: 6,
    },
    {
      hint: 'High cardinality: Use time-series DB (Prometheus) with downsampling. Keep raw data 1h, 1m aggregates 7d, 1h aggregates 30d. 10x compression.',
      order: 7,
    },
    {
      hint: 'Missing data: Assume 100% success during gaps (conservative). Alternative: assume failure (pessimistic). Choice depends on SLO semantics.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Understand SLO/SLI concepts (Google SRE principles)',
    'Calculate error budgets and track consumption',
    'Implement burn rate alerting (fast burn vs slow burn)',
    'Design multi-window alerting (reduce false positives)',
    'Track multi-service SLOs (user journeys)',
    'Use streaming aggregation for fast SLI calculation',
    'Handle high cardinality with time-series DB and downsampling',
    'Generate SLO reports with trends and incident attribution',
  ],

  commonMistakes: [
    {
      mistake: 'Not using multi-window alerting (short + long window)',
      why_its_wrong: 'Single window causes false positives (transient spikes trigger alerts)',
      how_to_avoid:
        'Check both short window (detect spikes) and long window (confirm trend). Alert only if BOTH exceed threshold.',
    },
    {
      mistake: 'Recomputing entire SLI window on each update (O(N))',
      why_its_wrong: 'Slow for large windows (30 days = 2.6M minutes). Wastes computation.',
      how_to_avoid:
        'Use streaming aggregation: Update SLI incrementally (O(1) per update). Store running totals (success_count, total_count).',
    },
    {
      mistake: 'Not handling missing data (gaps in SLI)',
      why_its_wrong: 'Missing data during collector outage skews SLI (assumes 0% success)',
      how_to_avoid:
        'Detect gaps (time between data points > threshold). Assume 100% success during gaps (conservative strategy).',
    },
    {
      mistake: 'Using simple average for multi-service SLO',
      why_its_wrong: 'Average doesn\'t reflect user journey (all services must succeed). (99% + 99%) / 2 = 99%, but journey = 99% * 99% = 98.01%.',
      how_to_avoid:
        'Multiply SLIs of all services (assuming independent failures). Journey SLI = SLI1 * SLI2 * ... * SLIN.',
    },
    {
      mistake: 'Not using downsampling for high cardinality',
      why_its_wrong: 'Storing raw data for 1M services * 30 days * 1-minute resolution = 43B data points. Too expensive.',
      how_to_avoid:
        'Use time-series DB with downsampling: raw 1h, 1m aggregates 7d, 1h aggregates 30d. 10x compression.',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **SLI Collector**: Ingest SLI data points (success/total, latency) from services
2. **Storage**: Time-series DB (Prometheus) with downsampling
3. **Aggregator**: Calculate SLI, error budget, burn rate
4. **Alerting**: Multi-window burn rate checks, page on-call
5. **Reporting**: Dashboard with SLI trends, error budget consumption

**Data flow:**
1. Service emits metrics (success, total, latency) to collector
2. Collector writes to time-series DB (1-minute resolution)
3. Aggregator queries DB, calculates SLI (success / total)
4. Calculate error budget: consumed = 1 - SLI, remaining = total - consumed
5. Calculate burn rate: (actual error rate) / (allowed error rate)
6. Check multi-window: short (5m) and long (1h) burn rates
7. Alert if both exceed threshold (page on-call)
8. Generate reports: SLI trend, worst day, incidents

**Key optimizations:**
- **Streaming aggregation**: Update SLI incrementally (O(1) per update)
- **Downsampling**: Keep raw 1h, 1m aggregates 7d, 1h aggregates 30d (10x compression)
- **Multi-window alerting**: Short + long window (reduce false positives)
- **User journey SLO**: Multiply SLIs of all services (identify weakest link)`,

    steps: [
      '1. Ingest SLI data points (success/total, latency) from services',
      '2. Store in time-series DB (Prometheus) with 1-minute resolution',
      '3. Calculate SLI: For availability, SLI = success / total. For latency, SLI = (requests < threshold) / total',
      '4. Calculate error budget: total = 1 - SLO target, consumed = 1 - SLI, remaining = total - consumed',
      '5. Calculate burn rate: (actual error rate) / (allowed error rate). E.g., (0.5% error) / (0.1% allowed) = 5x',
      '6. Check multi-window burn rate: short (5m) and long (1h). Alert if BOTH exceed threshold',
      '7. For user journey SLO: Multiply SLIs of all services. Journey SLI = SLI1 * SLI2 * ... * SLIN',
      '8. Downsample old data: raw → 1m aggregates (after 1h) → 1h aggregates (after 7d)',
      '9. Generate reports: SLI trend, error budget consumption, incidents',
      '10. Handle missing data: Assume 100% success during gaps (conservative strategy)',
    ],

    timeComplexity: `**SLI calculation:**
- Streaming: O(1) per data point (incremental update)
- Batch: O(N) where N = window size (2.6M minutes for 30 days)
Streaming is 1000x faster for real-time updates

**Burn rate check:**
- Multi-window: O(W) where W = number of windows (typically 2-4)
- Total: O(1) for short window query + O(1) for long window query = O(1)

**User journey SLO:**
- O(S) where S = number of services in journey (typically 3-10)`,

    spaceComplexity: `**Storage (per service):**
- Raw data (1h): 60 data points * 100 bytes = 6 KB
- 1m aggregates (7d): 10,080 data points * 50 bytes = 504 KB
- 1h aggregates (30d): 720 data points * 50 bytes = 36 KB
Total per service: ~550 KB

**For 1M services:**
- Total storage: 1M * 550 KB = 550 GB (acceptable)
- With compression (10x): 55 GB

**In-memory (burn rate alerting):**
- Recent data (1h) per service: 6 KB * 1M = 6 GB (acceptable)`,
  },
};
