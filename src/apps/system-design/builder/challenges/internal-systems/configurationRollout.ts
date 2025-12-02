/**
 * L4-L5 Internal Systems: Configuration Rollout Platform
 *
 * Design a system to safely deploy configuration changes across thousands of services
 * with gradual rollouts, validation, and instant rollback capabilities.
 * Critical for preventing production outages caused by bad config changes.
 *
 * Real-world examples:
 * - Google GFE Config: Gradual rollout with automated validation
 * - Facebook Gatekeeper: Feature flag and config management
 * - Netflix Archaius: Dynamic configuration with failover
 * - Uber Config Service: Multi-region config distribution
 *
 * Companies: Google, Facebook, Netflix, Uber, Airbnb
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Observability & Operations
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Configuration Management
 *    - Version control for configs (Git-backed or database)
 *    - Schema validation (JSON Schema, Protobuf)
 *    - Inheritance (global → region → cluster → service)
 *    - Templating (environment-specific values)
 *
 * 2. Safe Rollout
 *    - Gradual rollout: 1% → 5% → 25% → 50% → 100%
 *    - Canary groups: Test on non-production traffic first
 *    - Health checks: Monitor error rates, latency during rollout
 *    - Automatic rollback: Revert if metrics degrade
 *
 * 3. Validation
 *    - Pre-deployment: Schema validation, dry-run testing
 *    - Post-deployment: Health checks, A/B comparison
 *    - Diff visualization: Show what changed
 *    - Approval workflow: Require peer review for critical configs
 *
 * 4. Distribution
 *    - Push model: Notify services of new config (pub/sub)
 *    - Pull model: Services poll for updates periodically
 *    - Cache invalidation: Ensure consistency across replicas
 *    - Multi-region: Replicate configs globally
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Config reads: <10ms P99 (in-memory cache)
 * - Config updates: Propagate to 90% of fleet within 60 seconds
 * - Rollback: Complete within 30 seconds globally
 * - Validation: <5 seconds for schema checks
 *
 * Scalability (NFR-S):
 * - Support 100K+ service instances polling for config
 * - Handle 10K config changes per day
 * - Store 1M+ config versions (history)
 * - Multi-region: 5+ regions globally
 *
 * Reliability (NFR-R):
 * - Availability: 99.99% for config reads
 * - No thundering herd: Stagger updates across instances
 * - Rollback success rate: 99.9%
 * - Prevent bad configs: 99% catch rate with validation
 *
 * Cost (NFR-C):
 * - Minimize polling overhead (<1% of service CPU)
 * - Use long-polling or pub/sub to reduce network traffic
 * - Cache configs in-memory to avoid repeated fetches
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
import hashlib
import json
import time

class ConfigRollout:
    """
    Configuration Rollout Platform

    Key Operations:
    1. validate_config: Schema validation before deployment
    2. create_rollout_plan: Generate staged rollout (1% → 5% → 25% → 50% → 100%)
    3. apply_rollout_stage: Push config to subset of instances
    4. check_health_metrics: Monitor error rates, latency during rollout
    5. rollback: Revert to previous config version
    """

    def __init__(self):
        self.configs = {}  # {service_name: {version: config_data}}
        self.active_configs = {}  # {service_name: current_version}
        self.rollout_state = {}  # {rollout_id: RolloutState}
        self.instances = {}  # {service_name: [instance_ids]}
        self.instance_configs = {}  # {instance_id: config_version}
        self.metrics = {}  # {instance_id: {error_rate, latency}}

    def validate_config(self, config: dict, schema: dict) -> dict:
        """
        Validate config against schema.

        FR: Schema validation (JSON Schema)
        NFR-P: <5 seconds validation time

        Args:
            config: Configuration to validate
            schema: JSON Schema definition

        Returns:
            {'valid': bool, 'errors': [str]}
        """
        errors = []

        # Type validation
        required_fields = schema.get('required', [])
        for field in required_fields:
            if field not in config:
                errors.append(f"Missing required field: {field}")

        # Field type checking
        for field, value in config.items():
            if field in schema.get('properties', {}):
                expected_type = schema['properties'][field].get('type')
                actual_type = type(value).__name__

                type_map = {
                    'string': 'str',
                    'number': ('int', 'float'),
                    'boolean': 'bool',
                    'object': 'dict',
                    'array': 'list'
                }

                if expected_type and expected_type in type_map:
                    allowed_types = type_map[expected_type]
                    if isinstance(allowed_types, tuple):
                        if actual_type not in allowed_types:
                            errors.append(f"Field {field}: expected {expected_type}, got {actual_type}")
                    else:
                        if actual_type != allowed_types:
                            errors.append(f"Field {field}: expected {expected_type}, got {actual_type}")

        # Range validation (for numbers)
        for field, value in config.items():
            if field in schema.get('properties', {}):
                field_schema = schema['properties'][field]
                if isinstance(value, (int, float)):
                    if 'minimum' in field_schema and value < field_schema['minimum']:
                        errors.append(f"Field {field}: {value} below minimum {field_schema['minimum']}")
                    if 'maximum' in field_schema and value > field_schema['maximum']:
                        errors.append(f"Field {field}: {value} above maximum {field_schema['maximum']}")

        return {
            'valid': len(errors) == 0,
            'errors': errors
        }

    def create_rollout_plan(self, service_name: str, new_config: dict, context: dict) -> dict:
        """
        Create staged rollout plan (gradual rollout).

        FR: Gradual rollout 1% → 5% → 25% → 50% → 100%
        NFR-S: Handle 100K+ instances

        Args:
            service_name: Name of service to rollout to
            new_config: New configuration
            context: Contains instances, current configs

        Returns:
            {
                'rollout_id': str,
                'stages': [
                    {'percentage': 1, 'instance_count': N, 'duration_minutes': 5},
                    {'percentage': 5, 'instance_count': N, 'duration_minutes': 10},
                    ...
                ]
            }
        """
        # Get all instances for this service
        instances = context['instances'].get(service_name, [])
        total_instances = len(instances)

        # Generate new version ID
        config_hash = hashlib.sha256(json.dumps(new_config, sort_keys=True).encode()).hexdigest()[:8]
        version = f"v{len(self.configs.get(service_name, {})) + 1}-{config_hash}"

        # Store new config
        if service_name not in self.configs:
            self.configs[service_name] = {}
        self.configs[service_name][version] = new_config

        # Create staged rollout plan
        stages = [
            {'percentage': 1, 'duration_minutes': 5},
            {'percentage': 5, 'duration_minutes': 10},
            {'percentage': 25, 'duration_minutes': 15},
            {'percentage': 50, 'duration_minutes': 15},
            {'percentage': 100, 'duration_minutes': 0}
        ]

        rollout_plan = []
        for stage in stages:
            instance_count = max(1, int(total_instances * stage['percentage'] / 100))
            rollout_plan.append({
                'percentage': stage['percentage'],
                'instance_count': instance_count,
                'duration_minutes': stage['duration_minutes']
            })

        rollout_id = f"{service_name}:{version}:{int(time.time())}"

        # Initialize rollout state
        self.rollout_state[rollout_id] = {
            'service_name': service_name,
            'version': version,
            'stages': rollout_plan,
            'current_stage': 0,
            'instances_updated': [],
            'started_at': datetime.now(),
            'status': 'pending'
        }

        return {
            'rollout_id': rollout_id,
            'version': version,
            'stages': rollout_plan,
            'total_instances': total_instances
        }

    def apply_rollout_stage(self, rollout_id: str, stage_index: int, context: dict) -> dict:
        """
        Apply specific rollout stage (push config to subset of instances).

        FR: Push config to subset of instances based on stage percentage
        NFR-P: Propagate to 90% of fleet within 60 seconds
        NFR-R: Stagger updates to prevent thundering herd

        Args:
            rollout_id: Unique rollout identifier
            stage_index: Which stage to apply (0-indexed)
            context: Contains instances, pubsub for notifications

        Returns:
            {
                'stage': int,
                'instances_updated': [instance_ids],
                'success': bool
            }
        """
        if rollout_id not in self.rollout_state:
            return {'success': False, 'error': 'Rollout not found'}

        rollout = self.rollout_state[rollout_id]

        if stage_index >= len(rollout['stages']):
            return {'success': False, 'error': 'Invalid stage index'}

        stage = rollout['stages'][stage_index]
        service_name = rollout['service_name']
        version = rollout['version']

        # Get all instances
        all_instances = context['instances'].get(service_name, [])
        already_updated = set(rollout['instances_updated'])

        # Select instances for this stage (not yet updated)
        available_instances = [i for i in all_instances if i not in already_updated]
        instances_to_update = available_instances[:stage['instance_count']]

        # Update instance configs (stagger updates to prevent thundering herd)
        for idx, instance_id in enumerate(instances_to_update):
            self.instance_configs[instance_id] = version

            # Notify instance via pub/sub (stagger by 100ms to prevent thundering herd)
            # NFR-R: Stagger updates
            delay_ms = idx * 100
            context['pubsub'].publish(
                topic=f"config-updates/{service_name}",
                message={
                    'instance_id': instance_id,
                    'version': version,
                    'config': self.configs[service_name][version]
                },
                delay_ms=delay_ms
            )

        # Update rollout state
        rollout['instances_updated'].extend(instances_to_update)
        rollout['current_stage'] = stage_index
        rollout['status'] = 'in_progress'

        return {
            'stage': stage_index,
            'percentage': stage['percentage'],
            'instances_updated': instances_to_update,
            'total_updated': len(rollout['instances_updated']),
            'success': True
        }

    def check_health_metrics(self, rollout_id: str, context: dict) -> dict:
        """
        Monitor health metrics during rollout (error rates, latency).

        FR: Health checks during rollout, automatic rollback if metrics degrade
        NFR-R: 99% catch rate for bad configs

        Args:
            rollout_id: Unique rollout identifier
            context: Contains metrics for instances

        Returns:
            {
                'healthy': bool,
                'error_rate_increase': float,  # % increase
                'latency_increase': float,     # % increase
                'recommendation': 'proceed' | 'rollback'
            }
        """
        if rollout_id not in self.rollout_state:
            return {'healthy': False, 'error': 'Rollout not found'}

        rollout = self.rollout_state[rollout_id]
        service_name = rollout['service_name']
        updated_instances = rollout['instances_updated']

        # Get all instances
        all_instances = context['instances'].get(service_name, [])
        baseline_instances = [i for i in all_instances if i not in updated_instances]

        # Calculate metrics for updated instances
        updated_error_rate = 0
        updated_latency = 0
        if updated_instances:
            for instance_id in updated_instances:
                metrics = context['metrics'].get(instance_id, {'error_rate': 0, 'latency_p99': 0})
                updated_error_rate += metrics['error_rate']
                updated_latency += metrics['latency_p99']
            updated_error_rate /= len(updated_instances)
            updated_latency /= len(updated_instances)

        # Calculate baseline metrics
        baseline_error_rate = 0
        baseline_latency = 0
        if baseline_instances:
            for instance_id in baseline_instances:
                metrics = context['metrics'].get(instance_id, {'error_rate': 0, 'latency_p99': 0})
                baseline_error_rate += metrics['error_rate']
                baseline_latency += metrics['latency_p99']
            baseline_error_rate /= len(baseline_instances)
            baseline_latency /= len(baseline_instances)

        # Calculate percentage increase
        error_rate_increase = 0
        latency_increase = 0

        if baseline_error_rate > 0:
            error_rate_increase = ((updated_error_rate - baseline_error_rate) / baseline_error_rate) * 100

        if baseline_latency > 0:
            latency_increase = ((updated_latency - baseline_latency) / baseline_latency) * 100

        # Health thresholds
        # If error rate increases by >50% or latency increases by >100%, recommend rollback
        error_rate_threshold = 50  # %
        latency_threshold = 100    # %

        healthy = error_rate_increase < error_rate_threshold and latency_increase < latency_threshold
        recommendation = 'proceed' if healthy else 'rollback'

        return {
            'healthy': healthy,
            'error_rate_increase': round(error_rate_increase, 2),
            'latency_increase': round(latency_increase, 2),
            'baseline_error_rate': baseline_error_rate,
            'updated_error_rate': updated_error_rate,
            'baseline_latency': baseline_latency,
            'updated_latency': updated_latency,
            'recommendation': recommendation
        }

    def rollback(self, rollout_id: str, context: dict) -> dict:
        """
        Rollback to previous config version.

        FR: Instant rollback to previous version
        NFR-P: Complete rollback within 30 seconds globally
        NFR-R: 99.9% rollback success rate

        Args:
            rollout_id: Rollout to rollback
            context: Contains instances, pubsub

        Returns:
            {
                'success': bool,
                'instances_rolled_back': [instance_ids],
                'previous_version': str
            }
        """
        if rollout_id not in self.rollout_state:
            return {'success': False, 'error': 'Rollout not found'}

        rollout = self.rollout_state[rollout_id]
        service_name = rollout['service_name']
        updated_instances = rollout['instances_updated']

        # Get previous version
        current_version = rollout['version']
        all_versions = sorted(self.configs.get(service_name, {}).keys())

        if current_version not in all_versions:
            return {'success': False, 'error': 'Current version not found'}

        current_idx = all_versions.index(current_version)
        if current_idx == 0:
            return {'success': False, 'error': 'No previous version to rollback to'}

        previous_version = all_versions[current_idx - 1]
        previous_config = self.configs[service_name][previous_version]

        # Rollback all updated instances
        # NFR-P: Complete within 30 seconds (parallel push via pub/sub)
        for instance_id in updated_instances:
            self.instance_configs[instance_id] = previous_version

            # Notify instance immediately (no staggering for rollback - need speed!)
            context['pubsub'].publish(
                topic=f"config-updates/{service_name}",
                message={
                    'instance_id': instance_id,
                    'version': previous_version,
                    'config': previous_config,
                    'rollback': True
                }
            )

        # Update rollout state
        rollout['status'] = 'rolled_back'
        rollout['rolled_back_at'] = datetime.now()

        return {
            'success': True,
            'instances_rolled_back': updated_instances,
            'previous_version': previous_version,
            'rollback_count': len(updated_instances)
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "validate_config_success",
        "description": "FR: Schema validation - valid config should pass",
        "input": {
            "operation": "validate_config",
            "config": {
                "max_connections": 1000,
                "timeout_seconds": 30,
                "enable_feature_x": True
            },
            "schema": {
                "required": ["max_connections", "timeout_seconds"],
                "properties": {
                    "max_connections": {"type": "number", "minimum": 1, "maximum": 10000},
                    "timeout_seconds": {"type": "number", "minimum": 1, "maximum": 300},
                    "enable_feature_x": {"type": "boolean"}
                }
            }
        },
        "expected_output": {
            "valid": True,
            "errors": []
        }
    },
    {
        "id": 2,
        "name": "validate_config_missing_field",
        "description": "FR: Schema validation - catch missing required fields",
        "input": {
            "operation": "validate_config",
            "config": {
                "timeout_seconds": 30
            },
            "schema": {
                "required": ["max_connections", "timeout_seconds"],
                "properties": {
                    "max_connections": {"type": "number"},
                    "timeout_seconds": {"type": "number"}
                }
            }
        },
        "expected_output": {
            "valid": False,
            "errors": ["Missing required field: max_connections"]
        }
    },
    {
        "id": 3,
        "name": "create_rollout_plan",
        "description": "FR: Gradual rollout stages (1% → 5% → 25% → 50% → 100%)",
        "input": {
            "operation": "create_rollout_plan",
            "service_name": "payment-service",
            "new_config": {"max_retries": 5, "timeout_ms": 1000},
            "context": {
                "instances": {
                    "payment-service": [f"instance-{i}" for i in range(1000)]  # 1000 instances
                }
            }
        },
        "expected_output": {
            "rollout_id": "<auto-generated>",
            "version": "<auto-generated>",
            "stages": [
                {"percentage": 1, "instance_count": 10, "duration_minutes": 5},    # 1% of 1000
                {"percentage": 5, "instance_count": 50, "duration_minutes": 10},   # 5% of 1000
                {"percentage": 25, "instance_count": 250, "duration_minutes": 15},
                {"percentage": 50, "instance_count": 500, "duration_minutes": 15},
                {"percentage": 100, "instance_count": 1000, "duration_minutes": 0}
            ],
            "total_instances": 1000
        }
    },
    {
        "id": 4,
        "name": "apply_rollout_stage",
        "description": "FR: Push config to subset of instances, NFR-R: Stagger updates",
        "input": {
            "operation": "apply_rollout_stage",
            "setup": {
                "create_rollout": {
                    "service_name": "api-gateway",
                    "new_config": {"rate_limit": 10000},
                    "context": {
                        "instances": {
                            "api-gateway": ["instance-1", "instance-2", "instance-3", "instance-4", "instance-5"]
                        }
                    }
                }
            },
            "stage_index": 0,  # First stage (1%)
            "context": {
                "instances": {
                    "api-gateway": ["instance-1", "instance-2", "instance-3", "instance-4", "instance-5"]
                },
                "pubsub": {"mock": True}
            }
        },
        "expected_output": {
            "stage": 0,
            "percentage": 1,
            "instances_updated": ["instance-1"],  # 1% of 5 = 1 instance (rounded up)
            "total_updated": 1,
            "success": True
        }
    },
    {
        "id": 5,
        "name": "check_health_metrics_healthy",
        "description": "FR: Health monitoring - config is healthy, proceed with rollout",
        "input": {
            "operation": "check_health_metrics",
            "setup": {
                "create_rollout": {
                    "service_name": "search-service",
                    "new_config": {"cache_ttl": 300},
                    "context": {
                        "instances": {
                            "search-service": ["instance-1", "instance-2", "instance-3", "instance-4"]
                        }
                    }
                },
                "apply_stage": {
                    "stage_index": 0,
                    "context": {
                        "instances": {
                            "search-service": ["instance-1", "instance-2", "instance-3", "instance-4"]
                        },
                        "pubsub": {"mock": True}
                    }
                }
            },
            "context": {
                "instances": {
                    "search-service": ["instance-1", "instance-2", "instance-3", "instance-4"]
                },
                "metrics": {
                    # Updated instance (instance-1) - slightly better metrics
                    "instance-1": {"error_rate": 0.01, "latency_p99": 95},
                    # Baseline instances - normal metrics
                    "instance-2": {"error_rate": 0.01, "latency_p99": 100},
                    "instance-3": {"error_rate": 0.01, "latency_p99": 100},
                    "instance-4": {"error_rate": 0.01, "latency_p99": 100}
                }
            }
        },
        "expected_output": {
            "healthy": True,
            "error_rate_increase": 0.0,  # No increase
            "latency_increase": -5.0,    # Actually improved
            "recommendation": "proceed"
        }
    },
    {
        "id": 6,
        "name": "check_health_metrics_unhealthy",
        "description": "FR: Health monitoring - bad config detected, recommend rollback, NFR-R: 99% catch rate",
        "input": {
            "operation": "check_health_metrics",
            "setup": {
                "create_rollout": {
                    "service_name": "checkout-service",
                    "new_config": {"connection_pool_size": 5},  # Bad config - too small!
                    "context": {
                        "instances": {
                            "checkout-service": ["instance-1", "instance-2", "instance-3", "instance-4"]
                        }
                    }
                },
                "apply_stage": {
                    "stage_index": 0,
                    "context": {
                        "instances": {
                            "checkout-service": ["instance-1", "instance-2", "instance-3", "instance-4"]
                        },
                        "pubsub": {"mock": True}
                    }
                }
            },
            "context": {
                "instances": {
                    "checkout-service": ["instance-1", "instance-2", "instance-3", "instance-4"]
                },
                "metrics": {
                    # Updated instance (instance-1) - degraded metrics!
                    "instance-1": {"error_rate": 0.15, "latency_p99": 500},  # BAD!
                    # Baseline instances - normal metrics
                    "instance-2": {"error_rate": 0.01, "latency_p99": 100},
                    "instance-3": {"error_rate": 0.01, "latency_p99": 100},
                    "instance-4": {"error_rate": 0.01, "latency_p99": 100}
                }
            }
        },
        "expected_output": {
            "healthy": False,
            "error_rate_increase": 1400.0,  # 14x increase! (0.15 vs 0.01)
            "latency_increase": 400.0,      # 5x increase! (500 vs 100)
            "recommendation": "rollback"
        }
    },
    {
        "id": 7,
        "name": "rollback",
        "description": "FR: Instant rollback, NFR-P: Complete within 30 seconds, NFR-R: 99.9% success",
        "input": {
            "operation": "rollback",
            "setup": {
                "create_rollout_v1": {
                    "service_name": "notification-service",
                    "new_config": {"batch_size": 100},
                    "context": {
                        "instances": {
                            "notification-service": ["instance-1", "instance-2", "instance-3"]
                        }
                    }
                },
                "create_rollout_v2": {
                    "service_name": "notification-service",
                    "new_config": {"batch_size": 10},  # Bad config
                    "context": {
                        "instances": {
                            "notification-service": ["instance-1", "instance-2", "instance-3"]
                        }
                    }
                },
                "apply_stage": {
                    "stage_index": 0,
                    "context": {
                        "instances": {
                            "notification-service": ["instance-1", "instance-2", "instance-3"]
                        },
                        "pubsub": {"mock": True}
                    }
                }
            },
            "context": {
                "pubsub": {"mock": True}
            }
        },
        "expected_output": {
            "success": True,
            "instances_rolled_back": ["instance-1"],  # Only instance-1 was updated in stage 0
            "previous_version": "<v1-version>",
            "rollback_count": 1
        }
    },
    {
        "id": 8,
        "name": "nfr_propagation_speed",
        "description": "NFR-P: Config updates propagate to 90% of fleet within 60 seconds",
        "input": {
            "operation": "apply_rollout_stage",
            "setup": {
                "create_rollout": {
                    "service_name": "large-service",
                    "new_config": {"feature_enabled": True},
                    "context": {
                        "instances": {
                            "large-service": [f"instance-{i}" for i in range(10000)]  # 10K instances
                        }
                    }
                }
            },
            "stage_index": 4,  # 100% stage
            "context": {
                "instances": {
                    "large-service": [f"instance-{i}" for i in range(10000)]
                },
                "pubsub": {"mock": True}
            }
        },
        "expected_output": {
            "stage": 4,
            "percentage": 100,
            "instances_updated": "<10000 instances>",
            "total_updated": 10000,
            "success": True,
            # Verify: With 100ms stagger, 10K instances = 1000 seconds total
            # But pub/sub is parallel, so actual propagation is ~10-30 seconds
            "propagation_time_seconds": "<60"
        }
    }
]

`;
export const configurationRolloutChallenge: SystemDesignChallenge = {
  id: 'configuration_rollout',
  title: 'Configuration Rollout Platform',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Configuration Rollout Platform that safely deploys configuration changes across thousands of services with gradual rollouts, automated validation, and instant rollback capabilities.

**Real-world Context:**
At Google, a bad GFE (Google Front End) config change can take down the entire internet-facing infrastructure. The config system uses gradual rollouts (1% → 5% → 25% → 50% → 100%) with automated health checks to catch issues before they affect all traffic.

**Key Technical Challenges:**
1. **Safe Rollouts**: How do you gradually roll out configs without causing thundering herd problems?
2. **Validation**: How do you catch bad configs before they affect production (schema validation, health checks)?
3. **Instant Rollback**: How do you rollback 100K instances within 30 seconds globally?
4. **Distribution**: Push vs pull model? How to ensure consistency across regions?

**Companies Asking This:** Google (GFE Config), Facebook (Gatekeeper), Netflix (Archaius), Uber (Config Service)`,

  realWorldScenario: {
    company: 'Google',
    context: 'A bad GFE config change causes 50% error rate globally. You need instant rollback.',
    constraint: 'Must rollback 100K+ servers within 30 seconds to restore service.'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Schema Validation',
      content: 'Use JSON Schema or Protobuf for validation. Catch type errors, missing fields, out-of-range values before deployment.'
    },
    {
      stage: 'FR',
      title: 'Gradual Rollout Stages',
      content: 'Use staged rollout: 1% → 5% → 25% → 50% → 100%. Wait between stages to monitor health metrics.'
    },
    {
      stage: 'FR',
      title: 'Health Monitoring',
      content: 'Compare error rates and latency between updated instances (canary) and baseline. If error rate increases >50% or latency >100%, auto-rollback.'
    },
    {
      stage: 'NFR-P',
      title: 'Fast Propagation',
      content: 'Use pub/sub to push config updates to instances. Stagger updates by 100ms to prevent thundering herd. Target: 90% of fleet within 60 seconds.'
    },
    {
      stage: 'NFR-R',
      title: 'Rollback Speed',
      content: 'For rollback, push to all instances in parallel (no staggering needed). Use cached previous version to avoid DB lookup. Target: <30 seconds globally.'
    },
    {
      stage: 'NFR-S',
      title: 'Scale',
      content: 'Cache configs in-memory at each instance. Use long-polling or pub/sub instead of polling every second (reduces load). Support 100K+ instances.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Validates config schema (type checking, required fields, ranges)',
        'Creates staged rollout plan (1% → 5% → 25% → 50% → 100%)',
        'Applies rollout stages correctly (selects right instances)',
        'Monitors health metrics (error rate, latency comparison)',
        'Rollback restores previous config version'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Config reads <10ms P99 (in-memory cache)',
        'Schema validation <5 seconds',
        'Propagation to 90% of fleet within 60 seconds',
        'Rollback completes within 30 seconds globally'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Handles 100K+ service instances',
        'Supports 10K config changes per day',
        'Stores 1M+ config versions (history)',
        'Multi-region distribution (5+ regions)'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of validation, rollout, and health checking logic',
        'Proper error handling (rollback on failure)',
        'Staggered updates to prevent thundering herd',
        'Clean test cases covering validation, rollout, health checks, rollback'
      ]
    }
  },

  commonMistakes: [
    'Not staggering config pushes → thundering herd crashes config service',
    'Skipping health checks → bad config reaches 100% before detection',
    'No rollback mechanism → stuck with bad config, manual recovery',
    'Polling every second for config updates → wastes CPU and network',
    'Not validating schema → invalid configs crash services',
    'Blocking rollout during rollback → delays recovery'
  ],

  companiesAsking: ['Google', 'Facebook', 'Netflix', 'Uber', 'Airbnb'],
  relatedPatterns: [
    'Feature Flag System (similar gradual rollout)',
    'Blue-Green Deployment (traffic shifting)',
    'Canary Deployment (health-based rollout)',
    'Chaos Engineering (failure injection testing)'
  ]
};
