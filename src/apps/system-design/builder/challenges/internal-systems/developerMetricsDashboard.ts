/**
 * L4-L5 Internal Systems: Developer Metrics Dashboard
 *
 * Design a dashboard to track developer productivity and operational excellence metrics
 * (DORA metrics: deployment frequency, lead time, MTTR, change failure rate).
 * Critical for measuring engineering effectiveness and identifying improvement areas.
 *
 * Real-world examples:
 * - Google DORA Metrics: Deployment frequency, lead time, MTTR, change failure rate
 * - GitHub Insights: PR metrics, code review time, deployment tracking
 * - GitLab DevOps Metrics: Cycle time, deployment frequency
 * - Uber Engineering Metrics: Build time, test time, deployment success rate
 *
 * Companies: Google, GitHub, GitLab, Uber, Airbnb, Netflix
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Developer Tools & Platforms
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. DORA Metrics
 *    - Deployment Frequency: How often code is deployed to production
 *    - Lead Time for Changes: Time from commit to production deployment
 *    - Mean Time to Recovery (MTTR): Time to restore service after incident
 *    - Change Failure Rate: % of deployments causing production failures
 *
 * 2. Engineering Metrics
 *    - Build time: Average time to compile and build code
 *    - Test time: Average time to run test suite
 *    - Code review time: Time from PR open to merge
 *    - PR size: Lines of code changed per PR
 *
 * 3. Data Collection
 *    - CI/CD integration: Collect deployment events from Jenkins/GitHub Actions
 *    - Git integration: Collect commit and PR data
 *    - Incident management: Collect incident data from PagerDuty/Opsgenie
 *    - Cross-system aggregation: Join data from multiple sources
 *
 * 4. Alerting & Anomaly Detection
 *    - Threshold alerts: Alert if MTTR > 1 hour
 *    - Trend detection: Alert if deployment frequency drops by 50%
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Dashboard load time: <2 seconds for last 30 days of data
 * - Real-time updates: Show new deployments within 1 minute
 * - Query performance: Aggregate metrics across 10K+ deployments in <5 seconds
 * - Historical data: Store 2+ years of metrics
 *
 * Scalability (NFR-S):
 * - Support 1000+ services/repositories
 * - Handle 10K+ deployments per day
 * - Store 100M+ events (commits, PRs, deployments)
 * - Multi-team dashboard (100+ teams)
 *
 * Reliability (NFR-R):
 * - Data accuracy: 99.9% (no missed events)
 * - Availability: 99.9% dashboard uptime
 * - Data freshness: <5 minute lag from event to dashboard
 * - Backfill capability: Recompute metrics if data source changes
 *
 * Cost (NFR-C):
 * - Use pre-aggregated metrics (daily/weekly rollups) for cost efficiency
 * - Time-series database for efficient storage (InfluxDB, Prometheus)
 * - Cache frequently accessed metrics (current week)
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import defaultdict

class DeveloperMetricsDashboard:
    """
    Developer Metrics Dashboard

    Key Operations:
    1. track_deployment: Record deployment event
    2. track_incident: Record production incident
    3. calculate_dora_metrics: Compute DORA metrics for time period
    4. calculate_lead_time: Time from commit to production
    5. detect_anomalies: Alert on metric degradation
    """

    def __init__(self):
        self.deployments = []  # [{deployment_id, service, timestamp, commit_sha, success}]
        self.commits = []  # [{commit_sha, timestamp, pr_id, author}]
        self.incidents = []  # [{incident_id, service, started_at, resolved_at, caused_by_deployment}]
        self.pull_requests = []  # [{pr_id, opened_at, merged_at, size_loc}]
        self.builds = []  # [{build_id, service, duration_seconds, timestamp}]

    def track_deployment(self, deployment_event: dict) -> dict:
        """
        Record deployment event.

        FR: Track deployment frequency (DORA metric)
        NFR-R: Data accuracy 99.9% (no missed events)

        Args:
            deployment_event: {
                'service': str,
                'commit_sha': str,
                'environment': 'production' | 'staging',
                'success': bool,
                'timestamp': datetime
            }

        Returns:
            {
                'deployment_id': str,
                'service': str,
                'timestamp': datetime
            }
        """
        deployment_id = f"deploy:{deployment_event['service']}:{int(deployment_event['timestamp'].timestamp())}"

        deployment = {
            'deployment_id': deployment_id,
            'service': deployment_event['service'],
            'commit_sha': deployment_event['commit_sha'],
            'environment': deployment_event['environment'],
            'success': deployment_event['success'],
            'timestamp': deployment_event['timestamp']
        }

        self.deployments.append(deployment)

        return {
            'deployment_id': deployment_id,
            'service': deployment_event['service'],
            'timestamp': deployment_event['timestamp'].isoformat()
        }

    def track_incident(self, incident_event: dict) -> dict:
        """
        Record production incident for MTTR calculation.

        FR: Track MTTR (Mean Time to Recovery)
        FR: Track change failure rate (% deployments causing incidents)

        Args:
            incident_event: {
                'service': str,
                'severity': 'P0' | 'P1' | 'P2',
                'started_at': datetime,
                'resolved_at': datetime,
                'caused_by_deployment': str | None  # deployment_id if known
            }

        Returns:
            {
                'incident_id': str,
                'mttr_minutes': float
            }
        """
        incident_id = f"incident:{incident_event['service']}:{int(incident_event['started_at'].timestamp())}"

        # Calculate MTTR (time to recovery)
        mttr_seconds = (incident_event['resolved_at'] - incident_event['started_at']).total_seconds()
        mttr_minutes = mttr_seconds / 60

        incident = {
            'incident_id': incident_id,
            'service': incident_event['service'],
            'severity': incident_event['severity'],
            'started_at': incident_event['started_at'],
            'resolved_at': incident_event['resolved_at'],
            'mttr_minutes': mttr_minutes,
            'caused_by_deployment': incident_event.get('caused_by_deployment')
        }

        self.incidents.append(incident)

        return {
            'incident_id': incident_id,
            'mttr_minutes': round(mttr_minutes, 2)
        }

    def calculate_dora_metrics(self, service: str, start_date: datetime, end_date: datetime) -> dict:
        """
        Calculate DORA metrics for time period.

        FR: Compute all 4 DORA metrics (deployment frequency, lead time, MTTR, change failure rate)
        NFR-P: Aggregate 10K+ deployments in <5 seconds

        Args:
            service: Service name
            start_date: Start of time period
            end_date: End of time period

        Returns:
            {
                'deployment_frequency': float,  # deployments per day
                'lead_time_hours': float,       # median time commit → production
                'mttr_minutes': float,          # mean time to recovery
                'change_failure_rate': float    # % of deployments causing incidents
            }
        """
        # Filter deployments for this service and time period
        service_deployments = [
            d for d in self.deployments
            if d['service'] == service
            and d['environment'] == 'production'
            and start_date <= d['timestamp'] <= end_date
        ]

        # 1. Deployment Frequency (deployments per day)
        days = (end_date - start_date).days or 1
        deployment_frequency = len(service_deployments) / days

        # 2. Lead Time for Changes (commit → production)
        lead_times = []
        for deployment in service_deployments:
            commit_sha = deployment['commit_sha']

            # Find commit timestamp
            commit = next((c for c in self.commits if c['commit_sha'] == commit_sha), None)
            if commit:
                lead_time_seconds = (deployment['timestamp'] - commit['timestamp']).total_seconds()
                lead_times.append(lead_time_seconds / 3600)  # Convert to hours

        # Use median lead time (more robust than mean)
        if lead_times:
            lead_times.sort()
            median_idx = len(lead_times) // 2
            lead_time_hours = lead_times[median_idx]
        else:
            lead_time_hours = 0

        # 3. Mean Time to Recovery (MTTR)
        service_incidents = [
            i for i in self.incidents
            if i['service'] == service
            and start_date <= i['started_at'] <= end_date
        ]

        if service_incidents:
            mttr_minutes = sum(i['mttr_minutes'] for i in service_incidents) / len(service_incidents)
        else:
            mttr_minutes = 0

        # 4. Change Failure Rate (% deployments causing incidents)
        # Count deployments that caused incidents
        failed_deployments = [
            d for d in service_deployments
            if any(i['caused_by_deployment'] == d['deployment_id'] for i in service_incidents)
        ]

        if service_deployments:
            change_failure_rate = (len(failed_deployments) / len(service_deployments)) * 100
        else:
            change_failure_rate = 0

        return {
            'deployment_frequency': round(deployment_frequency, 2),
            'lead_time_hours': round(lead_time_hours, 2),
            'mttr_minutes': round(mttr_minutes, 2),
            'change_failure_rate': round(change_failure_rate, 2)
        }

    def calculate_lead_time(self, commit_sha: str, context: dict) -> dict:
        """
        Calculate detailed lead time breakdown (commit → PR → merge → deploy).

        FR: Lead time tracking with breakdown
        NFR-P: Query performance <5 seconds

        Args:
            commit_sha: Git commit SHA
            context: Contains PR and deployment data

        Returns:
            {
                'total_lead_time_hours': float,
                'commit_to_pr_hours': float,      # Time to open PR
                'pr_review_hours': float,         # PR review time
                'merge_to_deploy_hours': float    # CI/CD time
            }
        """
        # Find commit
        commit = next((c for c in self.commits if c['commit_sha'] == commit_sha), None)
        if not commit:
            return {'error': 'Commit not found'}

        # Find PR containing this commit
        pr = next((p for p in self.pull_requests if p['pr_id'] == commit.get('pr_id')), None)
        if not pr:
            return {'error': 'PR not found'}

        # Find deployment with this commit
        deployment = next((d for d in self.deployments if d['commit_sha'] == commit_sha), None)
        if not deployment:
            return {'error': 'Deployment not found'}

        # Calculate breakdown
        commit_time = commit['timestamp']
        pr_opened_time = pr['opened_at']
        pr_merged_time = pr['merged_at']
        deploy_time = deployment['timestamp']

        commit_to_pr_hours = (pr_opened_time - commit_time).total_seconds() / 3600
        pr_review_hours = (pr_merged_time - pr_opened_time).total_seconds() / 3600
        merge_to_deploy_hours = (deploy_time - pr_merged_time).total_seconds() / 3600

        total_lead_time_hours = (deploy_time - commit_time).total_seconds() / 3600

        return {
            'total_lead_time_hours': round(total_lead_time_hours, 2),
            'commit_to_pr_hours': round(commit_to_pr_hours, 2),
            'pr_review_hours': round(pr_review_hours, 2),
            'merge_to_deploy_hours': round(merge_to_deploy_hours, 2)
        }

    def detect_anomalies(self, service: str, context: dict) -> dict:
        """
        Detect anomalies in metrics (degradation over time).

        FR: Threshold alerts and trend detection
        NFR-R: Data freshness <5 minute lag

        Args:
            service: Service to check
            context: Contains thresholds and historical data

        Returns:
            {
                'anomalies': [
                    {
                        'metric': str,
                        'current_value': float,
                        'baseline_value': float,
                        'severity': 'warning' | 'critical'
                    }
                ]
            }
        """
        now = datetime.now()
        current_week = now - timedelta(days=7)
        previous_week = now - timedelta(days=14)

        # Get metrics for current week
        current_metrics = self.calculate_dora_metrics(service, current_week, now)

        # Get metrics for previous week (baseline)
        baseline_metrics = self.calculate_dora_metrics(service, previous_week, current_week)

        anomalies = []

        # Check deployment frequency (alert if drops by >50%)
        if baseline_metrics['deployment_frequency'] > 0:
            freq_change = ((current_metrics['deployment_frequency'] - baseline_metrics['deployment_frequency'])
                          / baseline_metrics['deployment_frequency']) * 100

            if freq_change < -50:  # 50% drop
                anomalies.append({
                    'metric': 'deployment_frequency',
                    'current_value': current_metrics['deployment_frequency'],
                    'baseline_value': baseline_metrics['deployment_frequency'],
                    'change_percentage': round(freq_change, 2),
                    'severity': 'warning',
                    'message': f'Deployment frequency dropped by {abs(freq_change):.1f}%'
                })

        # Check MTTR (alert if >1 hour)
        mttr_threshold = 60  # 1 hour in minutes
        if current_metrics['mttr_minutes'] > mttr_threshold:
            anomalies.append({
                'metric': 'mttr_minutes',
                'current_value': current_metrics['mttr_minutes'],
                'threshold': mttr_threshold,
                'severity': 'critical',
                'message': f'MTTR ({current_metrics["mttr_minutes"]:.1f} min) exceeds threshold ({mttr_threshold} min)'
            })

        # Check change failure rate (alert if >15%)
        cfr_threshold = 15  # 15%
        if current_metrics['change_failure_rate'] > cfr_threshold:
            anomalies.append({
                'metric': 'change_failure_rate',
                'current_value': current_metrics['change_failure_rate'],
                'threshold': cfr_threshold,
                'severity': 'critical',
                'message': f'Change failure rate ({current_metrics["change_failure_rate"]:.1f}%) exceeds threshold ({cfr_threshold}%)'
            })

        # Check lead time (alert if increases by >100%)
        if baseline_metrics['lead_time_hours'] > 0:
            lead_time_change = ((current_metrics['lead_time_hours'] - baseline_metrics['lead_time_hours'])
                               / baseline_metrics['lead_time_hours']) * 100

            if lead_time_change > 100:  # 100% increase (doubled)
                anomalies.append({
                    'metric': 'lead_time_hours',
                    'current_value': current_metrics['lead_time_hours'],
                    'baseline_value': baseline_metrics['lead_time_hours'],
                    'change_percentage': round(lead_time_change, 2),
                    'severity': 'warning',
                    'message': f'Lead time increased by {lead_time_change:.1f}%'
                })

        return {
            'anomalies': anomalies,
            'anomaly_count': len(anomalies)
        }

    def get_team_metrics(self, team: str, services: List[str], time_period: int) -> dict:
        """
        Aggregate metrics across multiple services for a team.

        FR: Multi-team dashboard
        NFR-S: Support 100+ teams

        Args:
            team: Team name
            services: List of services owned by team
            time_period: Days to look back

        Returns:
            {
                'team': str,
                'total_deployments': int,
                'avg_deployment_frequency': float,
                'avg_lead_time_hours': float,
                'avg_mttr_minutes': float,
                'avg_change_failure_rate': float
            }
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=time_period)

        team_metrics = {
            'deployment_frequency': [],
            'lead_time_hours': [],
            'mttr_minutes': [],
            'change_failure_rate': []
        }

        total_deployments = 0

        # Aggregate metrics across all services
        for service in services:
            metrics = self.calculate_dora_metrics(service, start_date, end_date)

            team_metrics['deployment_frequency'].append(metrics['deployment_frequency'])
            team_metrics['lead_time_hours'].append(metrics['lead_time_hours'])
            team_metrics['mttr_minutes'].append(metrics['mttr_minutes'])
            team_metrics['change_failure_rate'].append(metrics['change_failure_rate'])

            # Count total deployments
            service_deploys = [
                d for d in self.deployments
                if d['service'] == service
                and d['environment'] == 'production'
                and start_date <= d['timestamp'] <= end_date
            ]
            total_deployments += len(service_deploys)

        # Calculate averages
        avg_deployment_frequency = sum(team_metrics['deployment_frequency']) / len(services) if services else 0
        avg_lead_time = sum(team_metrics['lead_time_hours']) / len(services) if services else 0
        avg_mttr = sum(team_metrics['mttr_minutes']) / len(services) if services else 0
        avg_cfr = sum(team_metrics['change_failure_rate']) / len(services) if services else 0

        return {
            'team': team,
            'service_count': len(services),
            'total_deployments': total_deployments,
            'avg_deployment_frequency': round(avg_deployment_frequency, 2),
            'avg_lead_time_hours': round(avg_lead_time, 2),
            'avg_mttr_minutes': round(avg_mttr, 2),
            'avg_change_failure_rate': round(avg_cfr, 2)
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "track_deployment",
        "description": "FR: Track deployment events for deployment frequency metric",
        "input": {
            "operation": "track_deployment",
            "deployment_event": {
                "service": "payment-api",
                "commit_sha": "abc123",
                "environment": "production",
                "success": True,
                "timestamp": "2024-01-15T14:30:00Z"
            }
        },
        "expected_output": {
            "deployment_id": "<auto-generated>",
            "service": "payment-api",
            "timestamp": "2024-01-15T14:30:00Z"
        }
    },
    {
        "id": 2,
        "name": "track_incident_mttr",
        "description": "FR: Track incident and calculate MTTR",
        "input": {
            "operation": "track_incident",
            "incident_event": {
                "service": "checkout-service",
                "severity": "P0",
                "started_at": "2024-01-15T10:00:00Z",
                "resolved_at": "2024-01-15T10:45:00Z",
                "caused_by_deployment": "deploy-123"
            }
        },
        "expected_output": {
            "incident_id": "<auto-generated>",
            "mttr_minutes": 45.0
        }
    },
    {
        "id": 3,
        "name": "calculate_dora_metrics",
        "description": "FR: Calculate all 4 DORA metrics, NFR-P: Aggregate 10K+ deployments in <5s",
        "input": {
            "operation": "calculate_dora_metrics",
            "setup": {
                "track_commits": [
                    {"commit_sha": "abc1", "timestamp": "2024-01-01T10:00:00Z", "pr_id": "pr-1"},
                    {"commit_sha": "abc2", "timestamp": "2024-01-02T10:00:00Z", "pr_id": "pr-2"},
                    {"commit_sha": "abc3", "timestamp": "2024-01-03T10:00:00Z", "pr_id": "pr-3"}
                ],
                "track_deployments": [
                    {"service": "api", "commit_sha": "abc1", "environment": "production", "success": True, "timestamp": "2024-01-01T12:00:00Z"},
                    {"service": "api", "commit_sha": "abc2", "environment": "production", "success": True, "timestamp": "2024-01-02T14:00:00Z"},
                    {"service": "api", "commit_sha": "abc3", "environment": "production", "success": True, "timestamp": "2024-01-03T13:00:00Z"}
                ],
                "track_incidents": [
                    {"service": "api", "severity": "P1", "started_at": "2024-01-02T15:00:00Z", "resolved_at": "2024-01-02T15:30:00Z", "caused_by_deployment": "deploy:api:1704201600"}
                ]
            },
            "service": "api",
            "start_date": "2024-01-01T00:00:00Z",
            "end_date": "2024-01-07T23:59:59Z"
        },
        "expected_output": {
            "deployment_frequency": 0.43,  # 3 deployments / 7 days
            "lead_time_hours": 3.0,  # Median: 2h, 4h, 3h → 3h
            "mttr_minutes": 30.0,
            "change_failure_rate": 33.33  # 1 failed out of 3 deployments
        }
    },
    {
        "id": 4,
        "name": "calculate_lead_time_breakdown",
        "description": "FR: Lead time breakdown (commit → PR → merge → deploy)",
        "input": {
            "operation": "calculate_lead_time",
            "setup": {
                "track_commit": {
                    "commit_sha": "xyz789",
                    "timestamp": "2024-01-10T09:00:00Z",
                    "pr_id": "pr-100"
                },
                "track_pr": {
                    "pr_id": "pr-100",
                    "opened_at": "2024-01-10T10:00:00Z",
                    "merged_at": "2024-01-10T18:00:00Z",
                    "size_loc": 250
                },
                "track_deployment": {
                    "service": "search-api",
                    "commit_sha": "xyz789",
                    "environment": "production",
                    "success": True,
                    "timestamp": "2024-01-10T20:00:00Z"
                }
            },
            "commit_sha": "xyz789",
            "context": {}
        },
        "expected_output": {
            "total_lead_time_hours": 11.0,  # 9am → 8pm = 11 hours
            "commit_to_pr_hours": 1.0,      # 9am → 10am
            "pr_review_hours": 8.0,         # 10am → 6pm
            "merge_to_deploy_hours": 2.0    # 6pm → 8pm
        }
    },
    {
        "id": 5,
        "name": "detect_anomaly_deployment_frequency",
        "description": "FR: Alert on deployment frequency drop >50%",
        "input": {
            "operation": "detect_anomalies",
            "setup": {
                "previous_week_deployments": {
                    "service": "user-service",
                    "count": 20,  # 20 deployments
                    "period": "week_of_2024-01-01"
                },
                "current_week_deployments": {
                    "service": "user-service",
                    "count": 5,  # Only 5 deployments (75% drop!)
                    "period": "week_of_2024-01-08"
                }
            },
            "service": "user-service",
            "context": {}
        },
        "expected_output": {
            "anomalies": [
                {
                    "metric": "deployment_frequency",
                    "current_value": "<~0.7>",  # 5 deployments / 7 days
                    "baseline_value": "<~2.9>",  # 20 deployments / 7 days
                    "change_percentage": "<-75%>",
                    "severity": "warning",
                    "message": "Deployment frequency dropped by 75%"
                }
            ],
            "anomaly_count": 1
        }
    },
    {
        "id": 6,
        "name": "detect_anomaly_mttr_threshold",
        "description": "FR: Alert when MTTR >1 hour",
        "input": {
            "operation": "detect_anomalies",
            "setup": {
                "track_incidents": [
                    {"service": "critical-api", "severity": "P0", "started_at": "2024-01-15T10:00:00Z", "resolved_at": "2024-01-15T12:30:00Z", "mttr": 150},  # 150 minutes
                    {"service": "critical-api", "severity": "P0", "started_at": "2024-01-16T14:00:00Z", "resolved_at": "2024-01-16T15:00:00Z", "mttr": 60}
                ]
            },
            "service": "critical-api",
            "context": {}
        },
        "expected_output": {
            "anomalies": [
                {
                    "metric": "mttr_minutes",
                    "current_value": 105.0,  # (150 + 60) / 2 = 105 minutes
                    "threshold": 60,
                    "severity": "critical",
                    "message": "MTTR (105.0 min) exceeds threshold (60 min)"
                }
            ],
            "anomaly_count": 1
        }
    },
    {
        "id": 7,
        "name": "get_team_metrics",
        "description": "FR: Multi-team dashboard, NFR-S: Support 100+ teams",
        "input": {
            "operation": "get_team_metrics",
            "setup": {
                "team_services": {
                    "team": "payments-team",
                    "services": ["payment-api", "billing-service", "invoice-service"]
                },
                "deployments_per_service": {
                    "payment-api": 30,
                    "billing-service": 20,
                    "invoice-service": 10
                },
                "avg_metrics": {
                    "lead_time_hours": 4.0,
                    "mttr_minutes": 20.0,
                    "change_failure_rate": 5.0
                }
            },
            "team": "payments-team",
            "services": ["payment-api", "billing-service", "invoice-service"],
            "time_period": 30
        },
        "expected_output": {
            "team": "payments-team",
            "service_count": 3,
            "total_deployments": 60,  # 30 + 20 + 10
            "avg_deployment_frequency": "<calculated>",
            "avg_lead_time_hours": "<calculated>",
            "avg_mttr_minutes": "<calculated>",
            "avg_change_failure_rate": "<calculated>"
        }
    },
    {
        "id": 8,
        "name": "nfr_query_performance",
        "description": "NFR-P: Dashboard load time <2 seconds for 30 days of data",
        "input": {
            "operation": "calculate_dora_metrics",
            "setup": {
                "large_dataset": {
                    "deployments": 10000,  # 10K deployments in 30 days
                    "commits": 15000,
                    "incidents": 500
                }
            },
            "service": "large-service",
            "start_date": "2024-01-01T00:00:00Z",
            "end_date": "2024-01-31T23:59:59Z"
        },
        "expected_output": {
            "deployment_frequency": "<calculated>",
            "lead_time_hours": "<calculated>",
            "mttr_minutes": "<calculated>",
            "change_failure_rate": "<calculated>",
            "query_time_seconds": "<2.0"
        }
    }
]

`;
export const developerMetricsDashboardChallenge: SystemDesignChallenge = {
  id: 'developer_metrics_dashboard',
  title: 'Developer Metrics Dashboard (DORA)',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Developer Metrics Dashboard that tracks DORA metrics (deployment frequency, lead time, MTTR, change failure rate) to measure engineering effectiveness and operational excellence.

**Real-world Context:**
At Google, DORA metrics are used to measure team performance and identify bottlenecks. Elite teams deploy multiple times per day with <1 hour lead time and <1 hour MTTR. The dashboard aggregates data from CI/CD, Git, and incident management systems to provide real-time visibility.

**Key Technical Challenges:**
1. **Cross-System Data Aggregation**: How do you join data from CI/CD, Git, PagerDuty, etc.?
2. **Lead Time Calculation**: How do you track commit → PR → merge → deploy pipeline?
3. **Real-Time Updates**: How do you show new deployments within 1 minute without polling every second?
4. **Anomaly Detection**: How do you alert when metrics degrade (MTTR >1hr, deployment frequency drops 50%)?

**Companies Asking This:** Google (DORA Research), GitHub, GitLab, Uber, Airbnb`,

  realWorldScenario: {
    company: 'Google',
    context: 'Engineering VP wants to understand why deployment frequency dropped 50% last week.',
    constraint: 'Dashboard must aggregate data across 1000+ services and detect anomalies automatically.'
  },

  hints: [
    {
      stage: 'FR',
      title: 'DORA Metrics',
      content: 'Track 4 metrics: (1) Deployment Frequency (deploys/day), (2) Lead Time (commit→production hours), (3) MTTR (incident recovery minutes), (4) Change Failure Rate (% deploys causing incidents).'
    },
    {
      stage: 'FR',
      title: 'Lead Time Breakdown',
      content: 'Track pipeline stages: commit → PR opened → PR merged → deployed. Identify bottlenecks (e.g., PR review takes 8 hours but deploy takes 2 hours).'
    },
    {
      stage: 'FR',
      title: 'Anomaly Detection',
      content: 'Compare current week vs previous week. Alert if: deployment frequency drops >50%, MTTR >60 min, change failure rate >15%, lead time increases >100%.'
    },
    {
      stage: 'NFR-P',
      title: 'Query Performance',
      content: 'Use pre-aggregated daily/weekly rollups stored in time-series DB (InfluxDB, Prometheus). Cache frequently accessed metrics (current week). Query 10K deployments in <5s.'
    },
    {
      stage: 'NFR-R',
      title: 'Data Accuracy',
      content: 'Use event streaming (Kafka) to capture all events (no missed deployments). Store raw events + pre-aggregated metrics for recomputation if needed.'
    },
    {
      stage: 'NFR-S',
      title: 'Multi-Team Scale',
      content: 'Support 100+ teams, 1000+ services, 10K deployments/day. Use partitioning by service/team. Store 2+ years of historical data for trend analysis.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Tracks deployment events correctly',
        'Calculates MTTR from incident start/end times',
        'Computes all 4 DORA metrics (deployment frequency, lead time, MTTR, change failure rate)',
        'Calculates lead time breakdown (commit → PR → merge → deploy)',
        'Detects anomalies (frequency drop, MTTR threshold, CFR threshold)'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Dashboard load time <2 seconds for 30 days',
        'Real-time updates within 1 minute',
        'Query 10K+ deployments in <5 seconds',
        'Supports 2+ years of historical data'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 1000+ services',
        'Handles 10K deployments per day',
        'Multi-team dashboard (100+ teams)',
        'Stores 100M+ events (commits, PRs, deployments)'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of tracking, calculation, and anomaly detection',
        'Proper aggregation logic (median for lead time, mean for MTTR)',
        'Percentage change calculations for trend detection',
        'Clean test cases covering DORA metrics, anomalies, team aggregation'
      ]
    }
  },

  commonMistakes: [
    'Using mean instead of median for lead time → skewed by outliers',
    'Not tracking which deployments caused incidents → can\'t calculate change failure rate',
    'Polling every second for real-time updates → wastes resources (use pub/sub)',
    'No anomaly detection → metrics degrade without alerting',
    'Not breaking down lead time → can\'t identify bottlenecks',
    'No historical comparison → can\'t detect trends (this week vs last week)'
  ],

  companiesAsking: ['Google', 'GitHub', 'GitLab', 'Uber', 'Airbnb', 'Netflix'],
  relatedPatterns: [
    'CI/CD Pipeline (source of deployment events)',
    'Alerting & Incident Management (source of MTTR data)',
    'Distributed Tracing (similar cross-system data aggregation)',
    'Metrics Aggregation Service (time-series storage for metrics)'
  ]
};
