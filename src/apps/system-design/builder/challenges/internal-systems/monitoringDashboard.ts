import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: Monitoring Dashboard
 *
 * Real-world examples:
 * - Grafana: Open-source metrics visualization and dashboarding
 * - Datadog: Full-stack observability platform with custom dashboards
 * - New Relic: APM with real-time monitoring dashboards
 * - AWS CloudWatch: Metrics and dashboards for AWS services
 *
 * Company context:
 * Your company runs 500+ microservices with 10K+ metrics (CPU, latency, error rate).
 * Engineers create custom dashboards to monitor service health and SLOs.
 * Dashboard must update in real-time (<5 second latency) and handle high cardinality metrics.
 *
 * Problem:
 * Design a monitoring dashboard that visualizes metrics, detects anomalies,
 * and tracks SLOs with real-time updates and high cardinality support.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Create dashboard with multiple panels',
    input: {
      action: 'create_dashboard',
      dashboard_config: {
        name: 'API Gateway Monitoring',
        panels: [
          { id: 'p1', type: 'graph', title: 'Request Rate', query: 'sum(rate(http_requests_total[5m]))' },
          { id: 'p2', type: 'graph', title: 'Error Rate', query: 'sum(rate(http_errors_total[5m]))' },
          { id: 'p3', type: 'gauge', title: 'P99 Latency', query: 'histogram_quantile(0.99, http_latency_seconds)' },
          { id: 'p4', type: 'stat', title: 'Availability', query: '1 - (sum(http_errors_total) / sum(http_requests_total))' },
        ],
        time_range: 'last_1_hour',
        refresh_interval: '5s',
      },
      context: {},
    },
    expected_output: {
      dashboard_created: true,
      dashboard_id: 'dash-001',
      panels: [
        { id: 'p1', type: 'graph', title: 'Request Rate', query: 'sum(rate(http_requests_total[5m]))' },
        { id: 'p2', type: 'graph', title: 'Error Rate', query: 'sum(rate(http_errors_total[5m]))' },
        { id: 'p3', type: 'gauge', title: 'P99 Latency', query: 'histogram_quantile(0.99, http_latency_seconds)' },
        { id: 'p4', type: 'stat', title: 'Availability', query: '1 - (sum(http_errors_total) / sum(http_requests_total))' },
      ],
      visualization_types: ['graph', 'gauge', 'stat'],
      status: 'created',
    },
    explanation:
      'Create dashboard: Define panels with visualization types (graph, gauge, stat). Each panel has a query (Prometheus PromQL). Dashboard refreshes every 5 seconds to show real-time data.',
  },
  {
    id: 2,
    name: 'FR: Query time-series metrics with downsampling',
    input: {
      action: 'query_metrics',
      query_config: {
        panel_id: 'p1',
        query: 'sum(rate(http_requests_total[5m]))',
        time_range: {
          start: '2024-01-01T00:00:00Z',
          end: '2024-01-01T23:59:59Z', // 24 hours
        },
      },
      context: {
        raw_data_points: 86400, // 1 data point per second for 24 hours
        panel_width_pixels: 1200, // Dashboard panel width
      },
    },
    expected_output: {
      data_points: 1200, // Match panel width (1 pixel per data point)
      downsampling: {
        method: 'average',
        interval: '72 seconds', // 86400 / 1200 = 72 seconds per data point
        data_reduction: '98.6%', // 86400 → 1200 (98.6% reduction)
      },
      query_performance: {
        raw_query_time: '10 seconds', // Query 86K data points
        downsampled_query_time: '<1 second', // Query 1.2K data points
        speedup: '10x',
      },
      status: 'completed',
    },
    explanation:
      'Downsampling: 24 hours of data = 86K data points (1/sec). Panel width = 1200 pixels. Downsample to 1200 data points (1 pixel per point). Average every 72 seconds. This is 10x faster query.',
  },
  {
    id: 3,
    name: 'FR: Anomaly detection (baseline comparison)',
    input: {
      action: 'detect_anomaly',
      anomaly_config: {
        metric: 'http_request_rate',
        current_value: 5000, // requests/sec
        time_window: 'last_1_hour',
      },
      context: {
        historical_data: {
          last_week_same_hour: {
            mean: 1000, // requests/sec
            stddev: 100,
          },
        },
        anomaly_threshold: 3, // 3 standard deviations
      },
    },
    expected_output: {
      anomaly_detected: true,
      anomaly_score: {
        current_value: 5000,
        baseline_mean: 1000,
        baseline_stddev: 100,
        z_score: 40, // (5000 - 1000) / 100 = 40 stddev
        threshold: 3,
      },
      severity: 'critical', // 40 stddev >> 3 stddev threshold
      alert: {
        message: 'http_request_rate is 40 stddev above baseline (5000 vs 1000)',
        action: 'Page on-call engineer',
      },
      status: 'anomaly_detected',
    },
    explanation:
      'Anomaly detection: Current value (5000) vs baseline mean (1000). Z-score = (5000 - 1000) / 100 = 40 stddev. Threshold = 3 stddev. Anomaly detected! Alert severity = critical.',
  },
  {
    id: 4,
    name: 'NFR-P: Real-time updates via WebSocket',
    input: {
      action: 'subscribe_real_time',
      subscription_config: {
        dashboard_id: 'dash-001',
        panels: ['p1', 'p2', 'p3'],
        refresh_interval: '5s',
      },
      context: {
        update_mechanism: 'websocket',
      },
    },
    expected_output: {
      subscription_active: true,
      transport: 'websocket',
      update_flow: [
        'Client connects to WebSocket server',
        'Client subscribes to dashboard dash-001',
        'Server queries metrics every 5 seconds',
        'Server pushes updates to client via WebSocket',
        'Client updates dashboard panels in real-time',
      ],
      update_latency: '<5 seconds', // Fresh data every 5 seconds
      network_efficiency: {
        websocket: 'Persistent connection, low overhead',
        vs_polling: 'Polling requires new HTTP request every 5s (higher overhead)',
      },
      status: 'subscribed',
    },
    explanation:
      'Real-time updates: Use WebSocket for persistent connection. Server pushes metric updates every 5 seconds. Client updates dashboard without polling. Lower latency and network overhead vs HTTP polling.',
  },
  {
    id: 5,
    name: 'NFR-P: Handle high cardinality metrics (1M series)',
    input: {
      action: 'query_high_cardinality',
      query_config: {
        query: 'sum by (pod) (container_cpu_usage)', // 1M pods
        time_range: 'last_1_hour',
      },
      context: {
        total_series: 1_000_000, // 1M time series (1 per pod)
        aggregation: 'sum by (pod)',
      },
    },
    expected_output: {
      cardinality_handling: {
        strategy: 'server_side_aggregation',
        series_before: 1_000_000, // 1M pod-level series
        series_after: 1_000_000, // Still 1M (grouped by pod)
        data_points_per_series: 720, // 1 hour / 5 sec = 720 points
        total_data_points: 720_000_000, // 720M data points
      },
      query_optimization: {
        method: 'streaming_aggregation',
        memory_usage: '10 GB', // Process in chunks, not all at once
        query_time: '<10 seconds',
      },
      ui_limitation: {
        display_strategy: 'top_100_by_cpu', // Show top 100 pods only
        reason: 'Browser cannot render 1M lines in graph',
      },
      status: 'completed',
    },
    explanation:
      'High cardinality: 1M time series (1 per pod). Query 720 data points per series = 720M total. Streaming aggregation processes in chunks (10 GB memory). UI shows top 100 pods (browser limit).',
  },
  {
    id: 6,
    name: 'NFR-S: Dashboard templates for reusability',
    input: {
      action: 'create_template',
      template_config: {
        name: 'Service Dashboard Template',
        variables: [
          { name: 'service', type: 'query', query: 'label_values(http_requests_total, service)' },
          { name: 'environment', type: 'custom', values: ['prod', 'staging', 'dev'] },
        ],
        panels: [
          { title: 'Request Rate', query: 'sum(rate(http_requests_total{service="$service", env="$environment"}[5m]))' },
          { title: 'Error Rate', query: 'sum(rate(http_errors_total{service="$service", env="$environment"}[5m]))' },
        ],
      },
      context: {},
    },
    expected_output: {
      template_created: true,
      template_id: 'template-001',
      variables: [
        { name: 'service', type: 'query', query: 'label_values(http_requests_total, service)' },
        { name: 'environment', type: 'custom', values: ['prod', 'staging', 'dev'] },
      ],
      instantiation_example: {
        service: 'api-gateway',
        environment: 'prod',
        instantiated_query: 'sum(rate(http_requests_total{service="api-gateway", env="prod"}[5m]))',
      },
      reusability: 'Template can be used for all 500+ services',
      status: 'created',
    },
    explanation:
      'Dashboard templates: Define variables ($service, $environment). Panels reference variables in queries. Instantiate template with specific values (api-gateway, prod). Reusable for all 500+ services.',
  },
  {
    id: 7,
    name: 'NFR-R: Handle missing data (gaps in metrics)',
    input: {
      action: 'query_metrics',
      query_config: {
        query: 'http_request_rate',
        time_range: 'last_1_hour',
      },
      context: {
        data_gaps: [
          { start: '2024-01-01T10:15:00Z', end: '2024-01-01T10:20:00Z', reason: 'Metrics collector outage' },
        ],
      },
    },
    expected_output: {
      missing_data_detected: true,
      gap_duration: '5 minutes',
      handling_strategy: {
        method: 'null_fill',
        visualization: 'Show gap as broken line (not interpolated)',
        reason: 'Interpolation would misrepresent data (assume requests during outage)',
      },
      alternative_strategies: [
        'Fill with 0 (pessimistic, assume no requests)',
        'Fill with previous value (optimistic, assume same rate)',
        'Interpolate (linear, may misrepresent)',
      ],
      status: 'completed',
    },
    explanation:
      'Missing data: 5-minute gap due to collector outage. Show gap as broken line (null fill). Do not interpolate (misrepresents data). Alternative: fill with 0 (pessimistic) or previous value (optimistic).',
  },
  {
    id: 8,
    name: 'NFR-R: Alert on dashboard metric threshold',
    input: {
      action: 'create_alert_rule',
      alert_config: {
        name: 'High Error Rate',
        panel_id: 'p2',
        query: 'sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m]))',
        condition: 'value > 0.01', // Error rate > 1%
        for_duration: '5 minutes', // Sustained for 5 minutes
        severity: 'critical',
        notification_channels: ['slack', 'pagerduty'],
      },
      context: {
        current_value: 0.015, // 1.5% error rate
        duration: '6 minutes', // Sustained for 6 minutes
      },
    },
    expected_output: {
      alert_triggered: true,
      alert_details: {
        name: 'High Error Rate',
        current_value: 0.015,
        threshold: 0.01,
        duration: '6 minutes',
        condition: 'value > 0.01 for 5 minutes',
        severity: 'critical',
      },
      notification: {
        channels: ['slack', 'pagerduty'],
        message: 'High Error Rate: 1.5% (threshold: 1.0%) for 6 minutes',
      },
      status: 'alerting',
    },
    explanation:
      'Alert rule: Error rate > 1% for 5 minutes. Current: 1.5% for 6 minutes. Alert triggered! Notify Slack and PagerDuty. Dashboard panel shows alert state (red border).',
  },
  {
    id: 9,
    name: 'NFR-C: Query caching for performance',
    input: {
      action: 'query_metrics',
      query_config: {
        query: 'sum(rate(http_requests_total[5m]))',
        time_range: 'last_1_hour',
      },
      context: {
        cache_enabled: true,
        previous_query: {
          query: 'sum(rate(http_requests_total[5m]))',
          time_range: 'last_1_hour',
          cached_at: '2024-01-01T10:00:00Z',
          ttl: 300, // 5 minutes
        },
        current_time: '2024-01-01T10:02:00Z', // 2 minutes later
      },
    },
    expected_output: {
      cache_hit: true,
      cache_key: 'hash(query + time_range)',
      query_time: '<100ms', // vs 5 seconds for uncached query
      data_freshness: {
        cached_at: '2024-01-01T10:00:00Z',
        age: '2 minutes',
        ttl: '5 minutes',
        stale: false,
      },
      cost_savings: '98% (no database query)',
      status: 'completed',
    },
    explanation:
      'Query caching: Same query within 5-minute TTL → cache hit. Query time <100ms (vs 5s uncached). Save 98% cost. Freshness: 2 minutes old (acceptable for monitoring).',
  },
  {
    id: 10,
    name: 'NFR-C: SLO tracking on dashboard',
    input: {
      action: 'add_slo_panel',
      slo_config: {
        slo_name: 'API Availability',
        target: 0.999, // 99.9%
        time_window: '30_days',
        query: '1 - (sum(http_errors_total) / sum(http_requests_total))',
      },
      context: {
        current_sli: 0.9985, // 99.85%
        error_budget: {
          total: 0.001, // 0.1%
          consumed: 0.00015, // 0.015%
          remaining: 0.00085, // 0.085%
          percent_consumed: 15,
        },
      },
    },
    expected_output: {
      slo_panel_created: true,
      visualization: {
        type: 'slo_gauge',
        current_sli: 0.9985,
        slo_target: 0.999,
        status: 'at_risk', // Below target but within error budget
        color: 'yellow',
      },
      error_budget_display: {
        total: '0.1%',
        consumed: '15%',
        remaining: '85%',
        burn_rate: '1.5x', // Consuming budget 1.5x faster than allowed
      },
      alert_threshold: {
        budget_consumed_percent: 80, // Alert when 80% budget consumed
        current: 15,
        alerting: false,
      },
      status: 'displayed',
    },
    explanation:
      'SLO panel: Show current SLI (99.85%) vs target (99.9%). Status: at risk (yellow). Error budget: 15% consumed, 85% remaining. Burn rate: 1.5x. Alert when 80% budget consumed.',
  },
];

const pythonTemplate = `from typing import Dict, List, Any
from datetime import datetime, timedelta

class MonitoringDashboard:
    """
    Monitoring dashboard for metrics visualization, anomaly detection, and SLO tracking.

    Key concepts:
    - Metrics visualization: Graphs, gauges, stats (Grafana-style)
    - Downsampling: 86K data points → 1.2K (match panel width, 10x speedup)
    - Anomaly detection: Z-score (current vs baseline, 3 stddev threshold)
    - Real-time updates: WebSocket push (vs HTTP polling)
    - High cardinality: 1M series, streaming aggregation
    - Dashboard templates: Reusable with variables ($service, $env)
    - Alert rules: Threshold-based with sustained duration
    - Query caching: 5-minute TTL (98% cost savings)
    """

    def __init__(self):
        self.dashboards = {}  # Dashboard configurations
        self.templates = {}  # Dashboard templates
        self.alert_rules = {}  # Alert rules
        self.query_cache = {}  # Query result cache
        self.websocket_subscriptions = {}  # Real-time subscriptions

    def create_dashboard(self, dashboard_config: dict, context: dict) -> dict:
        """Create dashboard with multiple panels."""
        name = dashboard_config['name']
        panels = dashboard_config['panels']
        time_range = dashboard_config['time_range']
        refresh_interval = dashboard_config['refresh_interval']

        dashboard_id = f"dash-{len(self.dashboards) + 1:03d}"

        self.dashboards[dashboard_id] = {
            'name': name,
            'panels': panels,
            'time_range': time_range,
            'refresh_interval': refresh_interval
        }

        visualization_types = list(set(p['type'] for p in panels))

        return {
            'dashboard_created': True,
            'dashboard_id': dashboard_id,
            'panels': panels,
            'visualization_types': visualization_types,
            'status': 'created'
        }

    def query_metrics(self, query_config: dict, context: dict) -> dict:
        """Query time-series metrics with downsampling."""
        query = query_config['query']
        time_range = query_config.get('time_range', {})

        # Check cache (NFR-C)
        if context.get('cache_enabled'):
            cache_result = self._check_cache(query_config, context)
            if cache_result:
                return cache_result

        # Handle missing data (NFR-R)
        if context.get('data_gaps'):
            return self._handle_missing_data(query_config, context)

        # Downsampling for performance
        raw_data_points = context.get('raw_data_points', 86400)
        panel_width_pixels = context.get('panel_width_pixels', 1200)

        # Downsample to match panel width (1 pixel per data point)
        data_points = panel_width_pixels
        downsample_interval = raw_data_points // panel_width_pixels
        data_reduction_percent = round((1 - data_points / raw_data_points) * 100, 1)

        return {
            'data_points': data_points,
            'downsampling': {
                'method': 'average',
                'interval': f'{downsample_interval} seconds',
                'data_reduction': f'{data_reduction_percent}%'
            },
            'query_performance': {
                'raw_query_time': '10 seconds',
                'downsampled_query_time': '<1 second',
                'speedup': '10x'
            },
            'status': 'completed'
        }

    def detect_anomaly(self, anomaly_config: dict, context: dict) -> dict:
        """Detect anomaly using baseline comparison (Z-score)."""
        metric = anomaly_config['metric']
        current_value = anomaly_config['current_value']

        historical_data = context.get('historical_data', {})
        baseline = historical_data.get('last_week_same_hour', {})
        mean = baseline.get('mean', 0)
        stddev = baseline.get('stddev', 1)

        anomaly_threshold = context.get('anomaly_threshold', 3)

        # Calculate Z-score: (current - mean) / stddev
        z_score = (current_value - mean) / stddev if stddev > 0 else 0

        anomaly_detected = abs(z_score) > anomaly_threshold

        # Determine severity
        if abs(z_score) > 10:
            severity = 'critical'
        elif abs(z_score) > 5:
            severity = 'warning'
        else:
            severity = 'info'

        result = {
            'anomaly_detected': anomaly_detected,
            'anomaly_score': {
                'current_value': current_value,
                'baseline_mean': mean,
                'baseline_stddev': stddev,
                'z_score': round(z_score, 1),
                'threshold': anomaly_threshold
            },
            'status': 'anomaly_detected' if anomaly_detected else 'normal'
        }

        if anomaly_detected:
            result['severity'] = severity
            result['alert'] = {
                'message': f'{metric} is {z_score:.0f} stddev above baseline ({current_value} vs {mean})',
                'action': 'Page on-call engineer' if severity == 'critical' else 'Create ticket'
            }

        return result

    def subscribe_real_time(self, subscription_config: dict, context: dict) -> dict:
        """Subscribe to real-time dashboard updates via WebSocket."""
        dashboard_id = subscription_config['dashboard_id']
        panels = subscription_config['panels']
        refresh_interval = subscription_config['refresh_interval']

        update_flow = [
            'Client connects to WebSocket server',
            f'Client subscribes to dashboard {dashboard_id}',
            f'Server queries metrics every {refresh_interval}',
            'Server pushes updates to client via WebSocket',
            'Client updates dashboard panels in real-time'
        ]

        return {
            'subscription_active': True,
            'transport': 'websocket',
            'update_flow': update_flow,
            'update_latency': '<5 seconds',
            'network_efficiency': {
                'websocket': 'Persistent connection, low overhead',
                'vs_polling': 'Polling requires new HTTP request every 5s (higher overhead)'
            },
            'status': 'subscribed'
        }

    def query_high_cardinality(self, query_config: dict, context: dict) -> dict:
        """Handle high cardinality metrics (1M series)."""
        query = query_config['query']
        total_series = context.get('total_series', 1_000_000)

        data_points_per_series = 720  # 1 hour / 5 sec
        total_data_points = total_series * data_points_per_series

        return {
            'cardinality_handling': {
                'strategy': 'server_side_aggregation',
                'series_before': total_series,
                'series_after': total_series,
                'data_points_per_series': data_points_per_series,
                'total_data_points': total_data_points
            },
            'query_optimization': {
                'method': 'streaming_aggregation',
                'memory_usage': '10 GB',
                'query_time': '<10 seconds'
            },
            'ui_limitation': {
                'display_strategy': 'top_100_by_cpu',
                'reason': 'Browser cannot render 1M lines in graph'
            },
            'status': 'completed'
        }

    def create_template(self, template_config: dict, context: dict) -> dict:
        """Create reusable dashboard template with variables."""
        name = template_config['name']
        variables = template_config['variables']
        panels = template_config['panels']

        template_id = f"template-{len(self.templates) + 1:03d}"

        self.templates[template_id] = {
            'name': name,
            'variables': variables,
            'panels': panels
        }

        # Example instantiation
        instantiated_query = panels[0]['query'].replace('$service', 'api-gateway').replace('$environment', 'prod')

        return {
            'template_created': True,
            'template_id': template_id,
            'variables': variables,
            'instantiation_example': {
                'service': 'api-gateway',
                'environment': 'prod',
                'instantiated_query': instantiated_query
            },
            'reusability': 'Template can be used for all 500+ services',
            'status': 'created'
        }

    def _handle_missing_data(self, query_config: dict, context: dict) -> dict:
        """Handle missing data (gaps in metrics)."""
        data_gaps = context.get('data_gaps', [])

        if data_gaps:
            gap = data_gaps[0]
            start_time = datetime.fromisoformat(gap['start'].replace('Z', '+00:00'))
            end_time = datetime.fromisoformat(gap['end'].replace('Z', '+00:00'))
            gap_duration = end_time - start_time

            return {
                'missing_data_detected': True,
                'gap_duration': f'{gap_duration.total_seconds() // 60} minutes',
                'handling_strategy': {
                    'method': 'null_fill',
                    'visualization': 'Show gap as broken line (not interpolated)',
                    'reason': 'Interpolation would misrepresent data'
                },
                'alternative_strategies': [
                    'Fill with 0 (pessimistic)',
                    'Fill with previous value (optimistic)',
                    'Interpolate (linear, may misrepresent)'
                ],
                'status': 'completed'
            }

        return {'missing_data_detected': False, 'status': 'completed'}

    def create_alert_rule(self, alert_config: dict, context: dict) -> dict:
        """Create alert rule on dashboard metric threshold."""
        name = alert_config['name']
        query = alert_config['query']
        condition = alert_config['condition']
        for_duration = alert_config['for_duration']
        severity = alert_config['severity']

        current_value = context.get('current_value', 0)
        duration = context.get('duration', '0 minutes')

        # Parse condition (simplified)
        threshold = float(condition.split('>')[1].strip())
        alert_triggered = current_value > threshold

        # Check duration
        duration_minutes = int(duration.split()[0])
        for_duration_minutes = int(for_duration.split()[0])
        sustained = duration_minutes >= for_duration_minutes

        result = {
            'alert_triggered': alert_triggered and sustained,
            'alert_details': {
                'name': name,
                'current_value': current_value,
                'threshold': threshold,
                'duration': duration,
                'condition': f'{condition} for {for_duration}',
                'severity': severity
            },
            'status': 'alerting' if (alert_triggered and sustained) else 'normal'
        }

        if alert_triggered and sustained:
            result['notification'] = {
                'channels': alert_config.get('notification_channels', []),
                'message': f'{name}: {current_value * 100:.1f}% (threshold: {threshold * 100:.1f}%) for {duration}'
            }

        return result

    def _check_cache(self, query_config: dict, context: dict) -> dict:
        """Check query cache for performance."""
        query = query_config['query']
        time_range = query_config.get('time_range', 'last_1_hour')

        cache_key = f'hash({query} + {time_range})'

        previous_query = context.get('previous_query', {})
        if previous_query.get('query') == query:
            cached_at = datetime.fromisoformat(previous_query['cached_at'].replace('Z', '+00:00'))
            current_time = datetime.fromisoformat(context['current_time'].replace('Z', '+00:00'))
            age = (current_time - cached_at).total_seconds()
            ttl = previous_query.get('ttl', 300)

            if age < ttl:
                return {
                    'cache_hit': True,
                    'cache_key': cache_key,
                    'query_time': '<100ms',
                    'data_freshness': {
                        'cached_at': previous_query['cached_at'],
                        'age': f'{age // 60:.0f} minutes',
                        'ttl': f'{ttl // 60} minutes',
                        'stale': False
                    },
                    'cost_savings': '98% (no database query)',
                    'status': 'completed'
                }

        return None

    def add_slo_panel(self, slo_config: dict, context: dict) -> dict:
        """Add SLO tracking panel to dashboard."""
        slo_name = slo_config['slo_name']
        target = slo_config['target']
        current_sli = context.get('current_sli', 0)
        error_budget = context.get('error_budget', {})

        # Determine status
        if current_sli >= target:
            status = 'healthy'
            color = 'green'
        elif error_budget.get('percent_consumed', 0) > 50:
            status = 'critical'
            color = 'red'
        else:
            status = 'at_risk'
            color = 'yellow'

        # Calculate burn rate
        consumed = error_budget.get('consumed', 0)
        total = error_budget.get('total', 0.001)
        burn_rate = (consumed / total) * 30 if total > 0 else 0  # 30-day window

        return {
            'slo_panel_created': True,
            'visualization': {
                'type': 'slo_gauge',
                'current_sli': current_sli,
                'slo_target': target,
                'status': status,
                'color': color
            },
            'error_budget_display': {
                'total': f'{total * 100}%',
                'consumed': f'{error_budget.get("percent_consumed", 0)}%',
                'remaining': f'{100 - error_budget.get("percent_consumed", 0)}%',
                'burn_rate': f'{burn_rate:.1f}x'
            },
            'alert_threshold': {
                'budget_consumed_percent': 80,
                'current': error_budget.get('percent_consumed', 0),
                'alerting': error_budget.get('percent_consumed', 0) > 80
            },
            'status': 'displayed'
        }


# Example usage
if __name__ == '__main__':
    dashboard = MonitoringDashboard()

    # Test case 1: Create dashboard
    result = dashboard.create_dashboard(
        dashboard_config={
            'name': 'API Gateway Monitoring',
            'panels': [
                {'id': 'p1', 'type': 'graph', 'title': 'Request Rate'},
                {'id': 'p2', 'type': 'gauge', 'title': 'P99 Latency'}
            ],
            'time_range': 'last_1_hour',
            'refresh_interval': '5s'
        },
        context={}
    )
    print(f"Dashboard created: {result['dashboard_id']}")
    print(f"Panels: {len(result['panels'])}")
`;

export const monitoringDashboardChallenge: Challenge = {
  id: 'monitoring_dashboard',
  title: 'Monitoring Dashboard',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - Observability',
  tags: [
    'Metrics',
    'Visualization',
    'Grafana',
    'Anomaly Detection',
    'Real-time',
    'Dashboarding',
    'L4-L5',
    'Datadog',
  ],
  companies: ['Grafana Labs', 'Datadog', 'New Relic', 'AWS', 'Google', 'Uber'],
  description: `Design a **monitoring dashboard** that visualizes metrics, detects anomalies, and tracks SLOs with real-time updates and high cardinality support.

**Real-world examples:**
- **Grafana**: Open-source metrics visualization and dashboarding
- **Datadog**: Full-stack observability with custom dashboards
- **New Relic**: APM with real-time monitoring dashboards
- **AWS CloudWatch**: Metrics and dashboards for AWS services

**Functional Requirements:**
1. **Dashboard creation**: Multiple panels (graphs, gauges, stats)
2. **Metrics querying**: Time-series data with downsampling
3. **Anomaly detection**: Baseline comparison (Z-score, 3 stddev)
4. **Real-time updates**: WebSocket push (vs HTTP polling)
5. **Alert rules**: Threshold-based with sustained duration

**Performance (NFR-P):**
- Downsampling: 86K data points → 1.2K (match panel width, 10x speedup)
- Real-time updates: <5 second latency (WebSocket)
- Query caching: 5-minute TTL (98% cost savings)
- High cardinality: 1M series with streaming aggregation

**Scalability (NFR-S):**
- Support 1000+ dashboards, 10K+ panels
- Handle 1M+ time series (high cardinality metrics)
- Dashboard templates: Reusable with variables ($service, $env)

**Reliability (NFR-R):**
- Handle missing data: Null fill (broken line, not interpolated)
- Alert rules: Sustained duration (5 minutes) to reduce false positives

**Cost (NFR-C):**
- Query caching: 98% cost savings
- Downsampling: 10x query speedup
- SLO tracking: Error budget visualization`,

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
      hint: 'Downsampling: Panel width = 1200 pixels. 24 hours = 86K data points (1/sec). Downsample to 1200 points (average every 72 seconds). Match 1 pixel per data point.',
      order: 1,
    },
    {
      hint: 'Anomaly detection: Z-score = (current - mean) / stddev. Threshold = 3 stddev. If |Z-score| > 3, anomaly detected. Use last week same hour as baseline.',
      order: 2,
    },
    {
      hint: 'Real-time updates: Use WebSocket for persistent connection. Server pushes metric updates every 5 seconds. Lower latency and overhead vs HTTP polling.',
      order: 3,
    },
    {
      hint: 'High cardinality: 1M time series. Use server-side aggregation (streaming). UI shows top 100 only (browser cannot render 1M lines).',
      order: 4,
    },
    {
      hint: 'Dashboard templates: Define variables ($service, $environment). Panels reference variables in queries. Instantiate template for each service. Reusable for 500+ services.',
      order: 5,
    },
    {
      hint: 'Missing data: Show gap as broken line (null fill). Do not interpolate (misrepresents data). Alternative: fill with 0 (pessimistic) or previous value (optimistic).',
      order: 6,
    },
    {
      hint: 'Alert rules: Threshold with sustained duration (5 minutes). Reduce false positives (transient spikes). Notify Slack/PagerDuty.',
      order: 7,
    },
    {
      hint: 'Query caching: Hash(query + time_range) as cache key. TTL = 5 minutes. Cache hit → <100ms (vs 5s uncached). Save 98% cost.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Design metrics visualization system (Grafana-style)',
    'Implement downsampling (match panel width for performance)',
    'Apply anomaly detection (Z-score, baseline comparison)',
    'Use WebSocket for real-time updates (vs HTTP polling)',
    'Handle high cardinality metrics (1M series, streaming aggregation)',
    'Create reusable dashboard templates (variables)',
    'Implement alert rules (threshold with sustained duration)',
    'Apply query caching (5-minute TTL, 98% cost savings)',
  ],

  commonMistakes: [
    {
      mistake: 'Not downsampling metrics (query 86K data points for 1200-pixel panel)',
      why_its_wrong: 'Query time = 10 seconds. Browser renders 86K points but only 1200 pixels → wasted computation.',
      how_to_avoid:
        'Downsample to match panel width (1200 points). Average every 72 seconds. Query time <1 second (10x speedup).',
    },
    {
      mistake: 'Using HTTP polling for real-time updates (poll every 5 seconds)',
      why_its_wrong: 'High overhead: new HTTP request every 5s. Network inefficient. Higher latency.',
      how_to_avoid:
        'Use WebSocket for persistent connection. Server pushes updates every 5s. Lower latency and overhead.',
    },
    {
      mistake: 'Not handling high cardinality (render 1M lines in graph)',
      why_its_wrong: 'Browser cannot render 1M lines (crashes or freezes). Query takes 60+ seconds.',
      how_to_avoid:
        'Server-side aggregation (streaming). UI shows top 100 series only. Add filter/search for other series.',
    },
    {
      mistake: 'Interpolating missing data (fill gaps with linear interpolation)',
      why_its_wrong: 'Misrepresents data. Assumes requests during collector outage. Misleads engineers.',
      how_to_avoid:
        'Show gap as broken line (null fill). Do not interpolate. Alternative: fill with 0 (pessimistic) if appropriate.',
    },
    {
      mistake: 'Not using query caching (re-query same data every 5 seconds)',
      why_its_wrong: 'Wastes database resources. Query time = 5s every refresh. High cost.',
      how_to_avoid:
        'Cache query results with 5-minute TTL. Cache hit → <100ms. Save 98% cost. Freshness: 2 minutes old (acceptable).',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **Frontend**: React dashboard UI with real-time updates
2. **WebSocket Server**: Push metric updates to clients
3. **Query Engine**: Execute PromQL/SQL queries on metrics database
4. **Metrics Database**: Time-series DB (Prometheus, InfluxDB)
5. **Cache Layer**: Redis for query result caching

**Data flow:**
1. User creates dashboard with panels (graphs, gauges, stats)
2. Frontend subscribes to WebSocket for real-time updates
3. Backend queries metrics database every 5 seconds
4. Backend applies downsampling (86K → 1.2K data points)
5. Backend pushes updates to frontend via WebSocket
6. Frontend renders updated panels

**Key optimizations:**
- **Downsampling**: Match panel width (1200 pixels → 1200 data points)
- **Query caching**: 5-minute TTL (98% cost savings)
- **WebSocket**: Persistent connection (vs HTTP polling)
- **High cardinality**: Server-side aggregation, UI shows top 100`,

    steps: [
      '1. Create dashboard: Define panels with visualization types (graph, gauge, stat). Each panel has a query (PromQL).',
      '2. Query metrics: Execute query on time-series database. Apply downsampling (average every 72 seconds for 1200-pixel panel).',
      '3. Detect anomaly: Calculate Z-score = (current - mean) / stddev. Compare to threshold (3 stddev). Alert if exceeded.',
      '4. Subscribe real-time: Client connects to WebSocket. Server queries metrics every 5s, pushes updates to client.',
      '5. Handle high cardinality: Use server-side aggregation (streaming). UI shows top 100 series only.',
      '6. Create template: Define variables ($service, $environment). Instantiate template for each service.',
      '7. Handle missing data: Detect gaps (collector outage). Show as broken line (null fill). Do not interpolate.',
      '8. Create alert rule: Define threshold and sustained duration (5 minutes). Alert if condition met.',
      '9. Check cache: Hash(query + time_range) as key. If TTL valid, return cached result (<100ms).',
      '10. Add SLO panel: Show current SLI vs target. Display error budget (consumed, remaining). Burn rate alert.',
    ],

    timeComplexity: `**Query execution:**
- Uncached query: O(N) where N = data points (86K points = 10 seconds)
- Downsampled query: O(M) where M = downsampled points (1.2K points = <1 second)
Downsampling = 10x speedup

**Anomaly detection:**
- Z-score calculation: O(1) (current vs baseline mean/stddev)
- Baseline computation: O(H) where H = historical window (pre-computed)

**Real-time updates:**
- WebSocket push: O(1) per client
- HTTP polling: O(C) where C = clients (each client polls separately)`,

    spaceComplexity: `**Dashboard storage:**
- Per dashboard: Panels (10) * config (1 KB) = 10 KB
- 1000 dashboards: 10 MB (acceptable)

**Query cache:**
- Per query: Data points (1.2K) * 8 bytes = 10 KB
- 1000 cached queries: 10 MB (acceptable)
- TTL: 5 minutes (auto-expire old entries)

**High cardinality metrics:**
- 1M series * 720 data points * 8 bytes = 5.76 GB
- Use streaming aggregation: Process in chunks (10 GB memory)`,
  },
};
