/**
 * L4-L5 Internal Systems: Data Quality Monitoring
 *
 * Design a system to monitor data quality across the data platform: schema validation,
 * anomaly detection, freshness checks, and SLA tracking. Critical for ensuring
 * reliable data pipelines and preventing bad data from propagating downstream.
 *
 * Real-world examples:
 * - Google Dataflow: Built-in data quality metrics and alerts
 * - Uber Data Quality Platform: Schema validation, anomaly detection
 * - Airbnb Data Quality Score: Freshness, completeness, accuracy metrics
 * - Netflix Data Quality Framework: Real-time validation of data pipelines
 *
 * Companies: Google, Uber, Airbnb, Netflix, LinkedIn
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Data Infrastructure & Analytics
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Schema Validation
 *    - Type checking: Ensure columns have correct types (int, string, etc.)
 *    - Null checks: Catch unexpected nulls in required columns
 *    - Range validation: Check values are within expected ranges
 *    - Enum validation: Ensure categorical values are valid
 *
 * 2. Anomaly Detection
 *    - Volume anomalies: Detect unexpected spikes/drops in row count
 *    - Distribution anomalies: Detect changes in column distributions
 *    - Outlier detection: Identify statistical outliers
 *    - Pattern detection: Detect sudden changes in patterns
 *
 * 3. Freshness & Completeness
 *    - Freshness: Check if data is up-to-date (last update time)
 *    - Completeness: Check if all expected partitions exist
 *    - Row count validation: Ensure minimum row count
 *    - Duplicate detection: Identify duplicate rows
 *
 * 4. SLA Tracking & Alerting
 *    - Define SLAs: "Table X must be updated within 1 hour"
 *    - Track violations: Record when SLAs are missed
 *    - Alert routing: Send alerts to table owners
 *    - Dashboard: Show data quality score per table
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Validation speed: Check 1M rows in <10 seconds
 * - Real-time validation: Validate streaming data with <1 second lag
 * - Sampling: Use statistical sampling for large tables (1% sample sufficient)
 * - Parallel validation: Run multiple checks concurrently
 *
 * Scalability (NFR-S):
 * - Support 10K+ tables across data warehouse
 * - Handle 1B+ rows per table
 * - Store 1 year of quality metrics history
 * - Multi-tenant: Support 100+ teams
 *
 * Reliability (NFR-R):
 * - Catch 99% of schema violations before downstream consumption
 * - False positive rate: <1% (avoid alert fatigue)
 * - SLA tracking: 99.9% accuracy
 * - Backfill: Recompute metrics if validation rules change
 *
 * Cost (NFR-C):
 * - Use sampling to reduce validation cost (1% sample vs full scan)
 * - Incremental validation: Only check new data, not entire table
 * - Cache validation results (1 hour TTL)
 * - Tiered validation: Basic checks always, advanced checks on-demand
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
import statistics

class DataQualityMonitoring:
    """
    Data Quality Monitoring System

    Key Operations:
    1. validate_schema: Check column types, nulls, ranges
    2. detect_volume_anomaly: Detect unexpected row count changes
    3. check_freshness: Verify data is up-to-date
    4. track_sla: Monitor SLA violations
    5. calculate_quality_score: Overall quality score (0-100)
    """

    def __init__(self):
        self.tables = {}  # {table_name: TableMetadata}
        self.validation_results = []  # [ValidationResult]
        self.slas = {}  # {table_name: SLA}
        self.historical_metrics = {}  # {table_name: [HistoricalMetric]}

    def validate_schema(self, table_name: str, data: List[dict], schema: dict) -> dict:
        """
        Validate data against schema (type checking, nulls, ranges).

        FR: Schema validation (types, nulls, ranges, enums)
        NFR-P: Validate 1M rows in <10 seconds (use sampling)
        NFR-R: Catch 99% of schema violations

        Args:
            table_name: Table name
            data: List of rows to validate
            schema: {
                'columns': {
                    'user_id': {'type': 'int', 'nullable': False, 'range': [1, 10000000]},
                    'age': {'type': 'int', 'nullable': True, 'range': [0, 120]},
                    'country': {'type': 'string', 'enum': ['US', 'UK', 'CA']}
                }
            }

        Returns:
            {
                'passed': bool,
                'total_rows': int,
                'violations': [
                    {
                        'column': str,
                        'rule': str,  # 'type', 'null', 'range', 'enum'
                        'violation_count': int,
                        'sample_values': [values]
                    }
                ]
            }
        """
        # Use sampling for large datasets (NFR-P: validate 1M rows in <10s)
        # Sample 1% of data (at least 1000 rows for statistical significance)
        sample_size = max(1000, len(data) // 100) if len(data) > 100000 else len(data)
        sample_data = data[:sample_size]

        violations = []
        column_violations = {}

        for row in sample_data:
            for col_name, col_schema in schema['columns'].items():
                if col_name not in row:
                    # Missing column
                    if col_name not in column_violations:
                        column_violations[col_name] = {'missing': []}
                    column_violations[col_name]['missing'].append(row)
                    continue

                value = row[col_name]

                # Null check
                if value is None:
                    if not col_schema.get('nullable', True):
                        if col_name not in column_violations:
                            column_violations[col_name] = {'null': []}
                        column_violations[col_name].setdefault('null', []).append(row)
                    continue

                # Type check
                expected_type = col_schema['type']
                type_map = {
                    'int': int,
                    'float': (int, float),
                    'string': str,
                    'bool': bool
                }

                if expected_type in type_map:
                    allowed_types = type_map[expected_type]
                    if isinstance(allowed_types, tuple):
                        if not isinstance(value, allowed_types):
                            if col_name not in column_violations:
                                column_violations[col_name] = {'type': []}
                            column_violations[col_name].setdefault('type', []).append(value)
                    else:
                        if not isinstance(value, allowed_types):
                            if col_name not in column_violations:
                                column_violations[col_name] = {'type': []}
                            column_violations[col_name].setdefault('type', []).append(value)

                # Range check (for numeric types)
                if 'range' in col_schema and isinstance(value, (int, float)):
                    min_val, max_val = col_schema['range']
                    if value < min_val or value > max_val:
                        if col_name not in column_violations:
                            column_violations[col_name] = {'range': []}
                        column_violations[col_name].setdefault('range', []).append(value)

                # Enum check (for categorical values)
                if 'enum' in col_schema and isinstance(value, str):
                    if value not in col_schema['enum']:
                        if col_name not in column_violations:
                            column_violations[col_name] = {'enum': []}
                        column_violations[col_name].setdefault('enum', []).append(value)

        # Format violations
        for col_name, violations_by_rule in column_violations.items():
            for rule, violation_values in violations_by_rule.items():
                violations.append({
                    'column': col_name,
                    'rule': rule,
                    'violation_count': len(violation_values),
                    'sample_values': violation_values[:5]  # First 5 samples
                })

        passed = len(violations) == 0

        # Store validation result
        result = {
            'table_name': table_name,
            'timestamp': datetime.now(),
            'passed': passed,
            'total_rows': len(data),
            'sampled_rows': sample_size,
            'violations': violations
        }

        self.validation_results.append(result)

        return {
            'passed': passed,
            'total_rows': len(data),
            'sampled_rows': sample_size,
            'violations': violations
        }

    def detect_volume_anomaly(self, table_name: str, current_row_count: int, context: dict) -> dict:
        """
        Detect volume anomalies (unexpected spikes/drops in row count).

        FR: Anomaly detection - volume anomalies
        NFR-R: False positive rate <1%

        Args:
            table_name: Table to check
            current_row_count: Current row count
            context: Contains historical row counts

        Returns:
            {
                'anomaly_detected': bool,
                'current_count': int,
                'expected_count': int,
                'deviation_percentage': float,
                'severity': 'low' | 'medium' | 'high'
            }
        """
        # Get historical row counts (last 7 days)
        historical = self.historical_metrics.get(table_name, [])

        if len(historical) < 7:
            # Not enough historical data
            return {
                'anomaly_detected': False,
                'current_count': current_row_count,
                'message': 'Insufficient historical data (need 7+ days)'
            }

        # Calculate mean and standard deviation
        recent_counts = [h['row_count'] for h in historical[-7:]]
        mean_count = statistics.mean(recent_counts)
        stdev_count = statistics.stdev(recent_counts) if len(recent_counts) > 1 else 0

        # Detect anomaly using z-score (3-sigma rule)
        # If current count is >3 standard deviations from mean, it's an anomaly
        if stdev_count > 0:
            z_score = abs(current_row_count - mean_count) / stdev_count
        else:
            z_score = 0

        # NFR-R: False positive rate <1% (3-sigma → ~0.3% false positive rate)
        anomaly_detected = z_score > 3

        # Calculate deviation percentage
        deviation_pct = ((current_row_count - mean_count) / mean_count * 100) if mean_count > 0 else 0

        # Determine severity
        if z_score > 5:
            severity = 'high'
        elif z_score > 3:
            severity = 'medium'
        else:
            severity = 'low'

        # Store current metric
        if table_name not in self.historical_metrics:
            self.historical_metrics[table_name] = []

        self.historical_metrics[table_name].append({
            'timestamp': datetime.now(),
            'row_count': current_row_count
        })

        return {
            'anomaly_detected': anomaly_detected,
            'current_count': current_row_count,
            'expected_count': int(mean_count),
            'deviation_percentage': round(deviation_pct, 2),
            'z_score': round(z_score, 2),
            'severity': severity
        }

    def check_freshness(self, table_name: str, last_update_time: datetime, context: dict) -> dict:
        """
        Check if data is fresh (up-to-date).

        FR: Freshness validation
        NFR-R: SLA tracking 99.9% accuracy

        Args:
            table_name: Table to check
            last_update_time: When table was last updated
            context: Contains freshness SLA (max_age_hours)

        Returns:
            {
                'fresh': bool,
                'age_hours': float,
                'max_age_hours': float,
                'sla_violated': bool
            }
        """
        # Get freshness SLA for this table
        freshness_sla = context.get('freshness_sla', {}).get(table_name, 24)  # Default: 24 hours

        # Calculate age
        now = datetime.now()
        age_seconds = (now - last_update_time).total_seconds()
        age_hours = age_seconds / 3600

        # Check if data is fresh
        fresh = age_hours <= freshness_sla
        sla_violated = not fresh

        return {
            'fresh': fresh,
            'age_hours': round(age_hours, 2),
            'max_age_hours': freshness_sla,
            'sla_violated': sla_violated,
            'last_update_time': last_update_time.isoformat()
        }

    def track_sla(self, table_name: str, sla_config: dict) -> dict:
        """
        Configure and track SLA for a table.

        FR: SLA tracking and alerting
        NFR-R: 99.9% SLA tracking accuracy

        Args:
            table_name: Table name
            sla_config: {
                'freshness_hours': 1,  # Must update within 1 hour
                'min_row_count': 1000,  # Must have at least 1000 rows
                'max_null_percentage': 5,  # Max 5% nulls in critical columns
                'owner': 'data-team@company.com'
            }

        Returns:
            {
                'table_name': str,
                'sla_id': str,
                'config': dict
            }
        """
        sla_id = f"sla:{table_name}:{int(datetime.now().timestamp())}"

        sla = {
            'sla_id': sla_id,
            'table_name': table_name,
            'freshness_hours': sla_config.get('freshness_hours', 24),
            'min_row_count': sla_config.get('min_row_count', 0),
            'max_null_percentage': sla_config.get('max_null_percentage', 100),
            'owner': sla_config.get('owner'),
            'created_at': datetime.now()
        }

        self.slas[table_name] = sla

        return {
            'table_name': table_name,
            'sla_id': sla_id,
            'config': sla
        }

    def calculate_quality_score(self, table_name: str, context: dict) -> dict:
        """
        Calculate overall data quality score (0-100).

        FR: Data quality dashboard
        Scoring: Freshness (30%), Schema Validity (30%), Volume (20%), Completeness (20%)

        Args:
            table_name: Table to score
            context: Contains recent validation results, freshness, etc.

        Returns:
            {
                'quality_score': int,  # 0-100
                'breakdown': {
                    'freshness_score': int,
                    'schema_score': int,
                    'volume_score': int,
                    'completeness_score': int
                }
            }
        """
        scores = {
            'freshness': 0,
            'schema': 0,
            'volume': 0,
            'completeness': 0
        }

        # 1. Freshness score (30 points)
        freshness_result = context.get('freshness_result', {})
        if freshness_result.get('fresh'):
            scores['freshness'] = 30
        else:
            # Partial credit based on how stale
            age_hours = freshness_result.get('age_hours', 999)
            max_age = freshness_result.get('max_age_hours', 24)
            if age_hours < max_age * 2:  # Within 2x of SLA
                scores['freshness'] = 15
            # else: 0 points

        # 2. Schema validity score (30 points)
        # Find most recent validation result
        table_validations = [v for v in self.validation_results if v['table_name'] == table_name]
        if table_validations:
            latest_validation = sorted(table_validations, key=lambda x: x['timestamp'], reverse=True)[0]

            if latest_validation['passed']:
                scores['schema'] = 30
            else:
                # Partial credit based on violation percentage
                total_violations = sum(v['violation_count'] for v in latest_validation['violations'])
                violation_rate = total_violations / latest_validation['sampled_rows']

                if violation_rate < 0.01:  # <1% violations
                    scores['schema'] = 25
                elif violation_rate < 0.05:  # <5% violations
                    scores['schema'] = 15
                # else: 0 points

        # 3. Volume score (20 points)
        volume_result = context.get('volume_result', {})
        if not volume_result.get('anomaly_detected'):
            scores['volume'] = 20
        else:
            severity = volume_result.get('severity', 'high')
            if severity == 'low':
                scores['volume'] = 15
            elif severity == 'medium':
                scores['volume'] = 10
            # else (high): 0 points

        # 4. Completeness score (20 points)
        # Check if table has minimum expected rows
        sla = self.slas.get(table_name, {})
        min_row_count = sla.get('min_row_count', 0)
        current_row_count = context.get('current_row_count', 0)

        if current_row_count >= min_row_count:
            scores['completeness'] = 20
        elif current_row_count >= min_row_count * 0.9:  # Within 10%
            scores['completeness'] = 15
        elif current_row_count >= min_row_count * 0.5:  # Within 50%
            scores['completeness'] = 10
        # else: 0 points

        total_score = sum(scores.values())

        return {
            'quality_score': total_score,
            'breakdown': {
                'freshness_score': scores['freshness'],
                'schema_score': scores['schema'],
                'volume_score': scores['volume'],
                'completeness_score': scores['completeness']
            }
        }

    def check_duplicates(self, table_name: str, data: List[dict], primary_keys: List[str]) -> dict:
        """
        Detect duplicate rows based on primary keys.

        FR: Duplicate detection
        NFR-P: Check 1M rows in <10 seconds

        Args:
            table_name: Table name
            data: Rows to check
            primary_keys: List of columns that form primary key

        Returns:
            {
                'has_duplicates': bool,
                'duplicate_count': int,
                'total_rows': int,
                'duplicate_percentage': float
            }
        """
        seen = set()
        duplicates = []

        for row in data:
            # Create composite key from primary key columns
            key_values = tuple(row.get(pk) for pk in primary_keys)

            if key_values in seen:
                duplicates.append(row)
            else:
                seen.add(key_values)

        duplicate_count = len(duplicates)
        total_rows = len(data)
        duplicate_percentage = (duplicate_count / total_rows * 100) if total_rows > 0 else 0

        return {
            'has_duplicates': duplicate_count > 0,
            'duplicate_count': duplicate_count,
            'total_rows': total_rows,
            'duplicate_percentage': round(duplicate_percentage, 2)
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "validate_schema_success",
        "description": "FR: Schema validation passes when data is valid",
        "input": {
            "operation": "validate_schema",
            "table_name": "users",
            "data": [
                {"user_id": 1, "age": 25, "country": "US"},
                {"user_id": 2, "age": 30, "country": "UK"},
                {"user_id": 3, "age": None, "country": "CA"}
            ],
            "schema": {
                "columns": {
                    "user_id": {"type": "int", "nullable": False, "range": [1, 10000000]},
                    "age": {"type": "int", "nullable": True, "range": [0, 120]},
                    "country": {"type": "string", "enum": ["US", "UK", "CA"]}
                }
            }
        },
        "expected_output": {
            "passed": True,
            "total_rows": 3,
            "sampled_rows": 3,
            "violations": []
        }
    },
    {
        "id": 2,
        "name": "validate_schema_type_violation",
        "description": "FR: Catch type violations, NFR-R: 99% catch rate",
        "input": {
            "operation": "validate_schema",
            "table_name": "products",
            "data": [
                {"product_id": 1, "price": 99.99},
                {"product_id": "invalid", "price": 49.99},  # Type violation!
                {"product_id": 3, "price": "not_a_number"}  # Type violation!
            ],
            "schema": {
                "columns": {
                    "product_id": {"type": "int", "nullable": False},
                    "price": {"type": "float", "nullable": False}
                }
            }
        },
        "expected_output": {
            "passed": False,
            "total_rows": 3,
            "sampled_rows": 3,
            "violations": [
                {"column": "product_id", "rule": "type", "violation_count": 1, "sample_values": ["invalid"]},
                {"column": "price", "rule": "type", "violation_count": 1, "sample_values": ["not_a_number"]}
            ]
        }
    },
    {
        "id": 3,
        "name": "detect_volume_anomaly_spike",
        "description": "FR: Detect volume spike (3-sigma rule), NFR-R: <1% false positive",
        "input": {
            "operation": "detect_volume_anomaly",
            "setup": {
                "historical_metrics": [
                    {"day": 1, "row_count": 10000},
                    {"day": 2, "row_count": 10200},
                    {"day": 3, "row_count": 9800},
                    {"day": 4, "row_count": 10100},
                    {"day": 5, "row_count": 10000},
                    {"day": 6, "row_count": 9900},
                    {"day": 7, "row_count": 10050}
                ]
            },
            "table_name": "events",
            "current_row_count": 50000,  # 5x spike!
            "context": {}
        },
        "expected_output": {
            "anomaly_detected": True,
            "current_count": 50000,
            "expected_count": 10007,  # Mean of historical
            "deviation_percentage": 399.3,  # ~400% increase
            "z_score": ">3",
            "severity": "high"
        }
    },
    {
        "id": 4,
        "name": "check_freshness_fresh",
        "description": "FR: Freshness check - data is fresh",
        "input": {
            "operation": "check_freshness",
            "table_name": "real_time_events",
            "last_update_time": "<30 minutes ago>",
            "context": {
                "freshness_sla": {
                    "real_time_events": 1  # Must update within 1 hour
                }
            }
        },
        "expected_output": {
            "fresh": True,
            "age_hours": 0.5,
            "max_age_hours": 1,
            "sla_violated": False,
            "last_update_time": "<timestamp>"
        }
    },
    {
        "id": 5,
        "name": "check_freshness_stale",
        "description": "FR: Freshness check - data is stale (SLA violation)",
        "input": {
            "operation": "check_freshness",
            "table_name": "daily_aggregates",
            "last_update_time": "<3 hours ago>",
            "context": {
                "freshness_sla": {
                    "daily_aggregates": 1  # Must update within 1 hour
                }
            }
        },
        "expected_output": {
            "fresh": False,
            "age_hours": 3.0,
            "max_age_hours": 1,
            "sla_violated": True,
            "last_update_time": "<timestamp>"
        }
    },
    {
        "id": 6,
        "name": "track_sla",
        "description": "FR: Configure SLA for table, NFR-R: 99.9% tracking accuracy",
        "input": {
            "operation": "track_sla",
            "table_name": "critical_metrics",
            "sla_config": {
                "freshness_hours": 1,
                "min_row_count": 1000,
                "max_null_percentage": 5,
                "owner": "data-team@company.com"
            }
        },
        "expected_output": {
            "table_name": "critical_metrics",
            "sla_id": "<auto-generated>",
            "config": {
                "sla_id": "<auto-generated>",
                "table_name": "critical_metrics",
                "freshness_hours": 1,
                "min_row_count": 1000,
                "max_null_percentage": 5,
                "owner": "data-team@company.com"
            }
        }
    },
    {
        "id": 7,
        "name": "calculate_quality_score",
        "description": "FR: Calculate quality score (freshness 30%, schema 30%, volume 20%, completeness 20%)",
        "input": {
            "operation": "calculate_quality_score",
            "setup": {
                "validate_schema": {
                    "table_name": "user_events",
                    "passed": True
                },
                "track_sla": {
                    "table_name": "user_events",
                    "min_row_count": 10000
                }
            },
            "table_name": "user_events",
            "context": {
                "freshness_result": {"fresh": True, "age_hours": 0.5, "max_age_hours": 1},
                "volume_result": {"anomaly_detected": False},
                "current_row_count": 15000
            }
        },
        "expected_output": {
            "quality_score": 100,  # Perfect score!
            "breakdown": {
                "freshness_score": 30,
                "schema_score": 30,
                "volume_score": 20,
                "completeness_score": 20
            }
        }
    },
    {
        "id": 8,
        "name": "check_duplicates",
        "description": "FR: Duplicate detection, NFR-P: Check 1M rows in <10s",
        "input": {
            "operation": "check_duplicates",
            "table_name": "orders",
            "data": [
                {"order_id": 1, "user_id": 100, "amount": 50.0},
                {"order_id": 2, "user_id": 200, "amount": 75.0},
                {"order_id": 1, "user_id": 100, "amount": 50.0},  # Duplicate!
                {"order_id": 3, "user_id": 300, "amount": 100.0},
                {"order_id": 2, "user_id": 200, "amount": 75.0}   # Duplicate!
            ],
            "primary_keys": ["order_id", "user_id"]
        },
        "expected_output": {
            "has_duplicates": True,
            "duplicate_count": 2,
            "total_rows": 5,
            "duplicate_percentage": 40.0
        }
    }
]


export const dataQualityMonitoringChallenge: SystemDesignChallenge = {
  id: 'data_quality_monitoring',
  title: 'Data Quality Monitoring',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Data Quality Monitoring system that validates schema, detects anomalies, checks freshness, and tracks SLAs across the data platform to ensure reliable data pipelines.

**Real-world Context:**
At Uber, bad data in the trips table caused millions in revenue loss. The Data Quality Platform now validates every table: schema checks (types, nulls, ranges), volume anomalies (3-sigma rule), freshness (<1 hour for real-time tables), and duplicate detection. Tables get a quality score (0-100) shown on dashboards.

**Key Technical Challenges:**
1. **Schema Validation**: How do you validate 1M rows in <10 seconds without scanning entire table?
2. **Anomaly Detection**: How do you detect volume spikes/drops with <1% false positive rate?
3. **Real-Time Validation**: How do you validate streaming data with <1 second lag?
4. **SLA Tracking**: How do you alert owners when freshness SLA is violated?

**Companies Asking This:** Uber, Airbnb, Netflix, LinkedIn, Google`,

  realWorldScenario: {
    company: 'Uber',
    context: 'The trips table has unexpected nulls in fare_amount column, causing revenue reports to be wrong.',
    constraint: 'Must catch schema violations before downstream dashboards consume the data (<5 min).'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Schema Validation',
      content: 'Check types (int, string, float), nulls (required columns), ranges (age 0-120), enums (country in [US, UK, CA]). Use sampling (1% of rows) for large tables.'
    },
    {
      stage: 'FR',
      title: 'Volume Anomaly Detection',
      content: 'Use 3-sigma rule: if current row count is >3 standard deviations from 7-day mean, flag as anomaly. This gives <1% false positive rate.'
    },
    {
      stage: 'FR',
      title: 'Freshness Check',
      content: 'Track last_update_time for each table. Alert if age > SLA (e.g., real-time tables must update within 1 hour).'
    },
    {
      stage: 'FR',
      title: 'Quality Score',
      content: 'Combine metrics: Freshness (30%), Schema Validity (30%), Volume (20%), Completeness (20%). Score 0-100 shown on dashboard.'
    },
    {
      stage: 'NFR-P',
      title: 'Sampling for Performance',
      content: 'For tables >100K rows, sample 1% (min 1000 rows). Statistical sampling is sufficient to catch violations with 99% confidence.'
    },
    {
      stage: 'NFR-R',
      title: 'Low False Positive Rate',
      content: 'Use 3-sigma rule for anomaly detection (99.7% of normal values within 3σ). Avoid alert fatigue by only alerting on high-confidence violations.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Validates schema (types, nulls, ranges, enums)',
        'Detects volume anomalies using 3-sigma rule',
        'Checks freshness against SLA',
        'Tracks SLA violations',
        'Calculates quality score with correct weightings',
        'Detects duplicates based on primary keys'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Validates 1M rows in <10 seconds (sampling)',
        'Real-time validation <1 second lag',
        'Parallel validation for multiple tables',
        'Efficient duplicate detection'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 10K+ tables',
        'Handles 1B+ rows per table',
        'Stores 1 year of quality metrics history',
        'Multi-tenant (100+ teams)'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of validation, anomaly detection, and scoring',
        'Proper statistical methods (3-sigma, z-score)',
        'Sampling logic for large datasets',
        'Clean test cases covering schema violations, anomalies, freshness, duplicates'
      ]
    }
  },

  commonMistakes: [
    'Scanning entire table for validation → too slow for large tables (use sampling)',
    'No statistical anomaly detection → too many false positives or false negatives',
    'Hardcoded thresholds → different tables need different SLAs',
    'No quality score → hard to prioritize which tables to fix first',
    'Synchronous validation → blocks data pipeline (use async validation)',
    'No historical metrics → can\'t detect trends (need 7+ days for baseline)'
  ],

  companiesAsking: ['Uber', 'Airbnb', 'Netflix', 'LinkedIn', 'Google'],
  relatedPatterns: [
    'ETL Orchestration (data quality checks in pipeline)',
    'Real-time Analytics Pipeline (streaming data validation)',
    'Alerting & Incident Management (SLA violation alerts)',
    'Data Lineage Tracking (impact analysis when quality degrades)'
  ]
};
