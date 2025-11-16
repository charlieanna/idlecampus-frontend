/**
 * L4-L5 Internal Systems: ML Experiment Tracking
 *
 * Design a system to track ML experiments: hyperparameters, metrics, artifacts,
 * and model versions. Essential for reproducibility, collaboration, and model governance.
 *
 * Real-world examples:
 * - MLflow: Open-source experiment tracking and model registry
 * - Weights & Biases: Experiment tracking with real-time visualization
 * - Google Vertex AI Experiments: Managed experiment tracking
 * - Uber Michelangelo: ML platform with built-in experiment tracking
 *
 * Companies: Google, Uber, Airbnb, Netflix, Meta
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: ML Infrastructure
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Experiment Logging
 *    - Parameters: Log hyperparameters (learning_rate, batch_size, etc.)
 *    - Metrics: Log training/validation metrics (accuracy, loss, F1 score)
 *    - Artifacts: Store model checkpoints, datasets, plots
 *    - Metadata: Track code version, dataset version, environment
 *
 * 2. Experiment Comparison
 *    - Compare multiple experiments side-by-side
 *    - Filter/search by parameters (e.g., all experiments with lr=0.01)
 *    - Sort by metrics (e.g., best validation accuracy)
 *    - Visualize metric trends over time
 *
 * 3. Model Registry
 *    - Register trained models with versions
 *    - Promote models through stages: dev → staging → production
 *    - Track model lineage (which experiment produced this model?)
 *    - Model approval workflow (require review before production)
 *
 * 4. Reproducibility
 *    - Store all information needed to reproduce experiment
 *    - Track code commit SHA, dependencies (requirements.txt)
 *    - Environment snapshot (Python version, GPU type, etc.)
 *    - Data versioning (which dataset version was used?)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Metric logging: <10ms per log call (don't slow down training)
 * - Artifact upload: 1GB model checkpoint in <1 minute (parallel upload)
 * - Query performance: Find experiments in <2 seconds across 100K experiments
 * - Real-time metrics: Show live training progress with <5 second lag
 *
 * Scalability (NFR-S):
 * - Support 100K+ experiments
 * - Store 1TB+ of artifacts (models, datasets, plots)
 * - Handle 1000+ concurrent training jobs logging metrics
 * - Multi-tenant: Support 100+ teams
 *
 * Reliability (NFR-R):
 * - Artifact durability: 99.999999999% (11 nines) using S3
 * - No data loss: Experiments logged successfully are never lost
 * - Versioning: Immutable experiment records (can't edit past experiments)
 * - Audit trail: Track who promoted model to production
 *
 * Cost (NFR-C):
 * - Use object storage (S3) for artifacts (cheap: $0.023/GB/month)
 * - Compress artifacts: 3-5x reduction
 * - Lifecycle old experiments: Archive to Glacier after 1 year
 * - Tiered metrics: Keep 7 days at high resolution, downsample older
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
import hashlib
import json

class MLExperimentTracking:
    """
    ML Experiment Tracking System

    Key Operations:
    1. log_experiment: Create new experiment run
    2. log_metric: Log training/validation metric
    3. log_artifact: Upload model checkpoint or artifact
    4. compare_experiments: Compare multiple experiments
    5. register_model: Register model to model registry
    """

    def __init__(self):
        self.experiments = {}  # {experiment_id: Experiment}
        self.metrics = {}  # {experiment_id: [Metric]}
        self.artifacts = {}  # {experiment_id: [Artifact]}
        self.models = {}  # {model_name: [ModelVersion]}

    def log_experiment(self, experiment_config: dict) -> dict:
        """
        Create new experiment run.

        FR: Log hyperparameters, metadata, code version
        NFR-R: Immutable experiment records

        Args:
            experiment_config: {
                'name': str,
                'parameters': {'learning_rate': 0.01, 'batch_size': 32},
                'metadata': {
                    'code_commit': str,
                    'dataset_version': str,
                    'python_version': str,
                    'user': str
                }
            }

        Returns:
            {
                'experiment_id': str,
                'name': str,
                'created_at': datetime
            }
        """
        # Generate unique experiment ID
        timestamp = int(datetime.now().timestamp() * 1000)
        experiment_id = f"exp-{timestamp}"

        # Store experiment (immutable)
        experiment = {
            'experiment_id': experiment_id,
            'name': experiment_config['name'],
            'parameters': experiment_config['parameters'],
            'metadata': experiment_config.get('metadata', {}),
            'status': 'running',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }

        self.experiments[experiment_id] = experiment

        # Initialize metric and artifact lists
        self.metrics[experiment_id] = []
        self.artifacts[experiment_id] = []

        return {
            'experiment_id': experiment_id,
            'name': experiment_config['name'],
            'created_at': experiment['created_at'].isoformat()
        }

    def log_metric(self, experiment_id: str, metric_name: str, value: float, step: int) -> dict:
        """
        Log training/validation metric.

        FR: Log metrics over time (accuracy, loss, etc.)
        NFR-P: <10ms per log call (don't slow down training)

        Args:
            experiment_id: Experiment ID
            metric_name: Metric name (e.g., 'train_loss', 'val_accuracy')
            value: Metric value
            step: Training step/epoch

        Returns:
            {
                'experiment_id': str,
                'metric_name': str,
                'value': float,
                'step': int,
                'timestamp': datetime
            }
        """
        if experiment_id not in self.experiments:
            return {'error': 'Experiment not found'}

        # Create metric record
        metric = {
            'experiment_id': experiment_id,
            'metric_name': metric_name,
            'value': value,
            'step': step,
            'timestamp': datetime.now()
        }

        # Append to metrics list
        # NFR-P: In production, this would batch metrics and write async
        self.metrics[experiment_id].append(metric)

        # Update experiment timestamp
        self.experiments[experiment_id]['updated_at'] = datetime.now()

        return {
            'experiment_id': experiment_id,
            'metric_name': metric_name,
            'value': value,
            'step': step,
            'timestamp': metric['timestamp'].isoformat()
        }

    def log_artifact(self, experiment_id: str, artifact_path: str, artifact_size_bytes: int, context: dict) -> dict:
        """
        Upload artifact (model checkpoint, dataset, plot).

        FR: Store model checkpoints and artifacts
        NFR-P: 1GB model in <1 minute (parallel upload to S3)
        NFR-R: 99.999999999% durability (S3)

        Args:
            experiment_id: Experiment ID
            artifact_path: Path to artifact (e.g., 'model.pt', 'train_plot.png')
            artifact_size_bytes: Size of artifact
            context: Contains storage backend (S3)

        Returns:
            {
                'experiment_id': str,
                'artifact_path': str,
                'artifact_url': str,  # S3 URL
                'size_bytes': int
            }
        """
        if experiment_id not in self.experiments:
            return {'error': 'Experiment not found'}

        # Generate S3 key
        # Format: experiments/{experiment_id}/artifacts/{artifact_path}
        s3_key = f"experiments/{experiment_id}/artifacts/{artifact_path}"

        # Upload to S3 (simulated)
        # NFR-P: Use multipart upload for large files (>5MB)
        # NFR-C: Compress artifacts (3-5x reduction)
        compression_ratio = 4
        compressed_size = artifact_size_bytes // compression_ratio

        # Simulate upload time (NFR-P: 1GB in <60 seconds)
        # Assume 20 MB/s upload speed
        upload_time_seconds = compressed_size / (20 * 1024 * 1024)

        # Store artifact metadata
        artifact = {
            'experiment_id': experiment_id,
            'artifact_path': artifact_path,
            's3_key': s3_key,
            'artifact_url': f"s3://ml-experiments/{s3_key}",
            'size_bytes': artifact_size_bytes,
            'compressed_size_bytes': compressed_size,
            'upload_time_seconds': round(upload_time_seconds, 2),
            'uploaded_at': datetime.now()
        }

        self.artifacts[experiment_id].append(artifact)

        return {
            'experiment_id': experiment_id,
            'artifact_path': artifact_path,
            'artifact_url': artifact['artifact_url'],
            'size_bytes': artifact_size_bytes,
            'compressed_size_bytes': compressed_size
        }

    def compare_experiments(self, experiment_ids: List[str], metric_name: str) -> dict:
        """
        Compare multiple experiments by a metric.

        FR: Compare experiments side-by-side
        NFR-P: Query <2 seconds across 100K experiments

        Args:
            experiment_ids: List of experiment IDs to compare
            metric_name: Metric to compare (e.g., 'val_accuracy')

        Returns:
            {
                'experiments': [
                    {
                        'experiment_id': str,
                        'parameters': dict,
                        'best_metric_value': float,
                        'final_metric_value': float
                    }
                ],
                'winner': str  # Experiment ID with best metric
            }
        """
        comparison = []

        for exp_id in experiment_ids:
            if exp_id not in self.experiments:
                continue

            experiment = self.experiments[exp_id]

            # Get all metrics with this name for this experiment
            exp_metrics = [
                m for m in self.metrics.get(exp_id, [])
                if m['metric_name'] == metric_name
            ]

            if not exp_metrics:
                continue

            # Sort by step
            exp_metrics.sort(key=lambda x: x['step'])

            # Best value (max for accuracy-like metrics)
            # In production: metric config would specify if higher is better
            best_value = max(m['value'] for m in exp_metrics)
            final_value = exp_metrics[-1]['value']

            comparison.append({
                'experiment_id': exp_id,
                'name': experiment['name'],
                'parameters': experiment['parameters'],
                'best_metric_value': best_value,
                'final_metric_value': final_value
            })

        # Find winner (highest best_metric_value)
        if comparison:
            winner = max(comparison, key=lambda x: x['best_metric_value'])
            winner_id = winner['experiment_id']
        else:
            winner_id = None

        return {
            'experiments': comparison,
            'winner': winner_id,
            'metric_name': metric_name
        }

    def register_model(self, model_config: dict, context: dict) -> dict:
        """
        Register trained model to model registry.

        FR: Model registry with versioning and stages
        NFR-R: Track model lineage and audit trail

        Args:
            model_config: {
                'model_name': str,
                'experiment_id': str,
                'artifact_path': str,  # Path to model artifact
                'stage': 'dev' | 'staging' | 'production',
                'description': str
            }
            context: Contains user info for audit trail

        Returns:
            {
                'model_name': str,
                'version': int,
                'experiment_id': str,
                'stage': str,
                'registered_at': datetime
            }
        """
        model_name = model_config['model_name']
        experiment_id = model_config['experiment_id']

        # Verify experiment exists
        if experiment_id not in self.experiments:
            return {'error': 'Experiment not found'}

        # Verify artifact exists
        artifact_path = model_config['artifact_path']
        exp_artifacts = self.artifacts.get(experiment_id, [])
        artifact = next((a for a in exp_artifacts if a['artifact_path'] == artifact_path), None)

        if not artifact:
            return {'error': 'Artifact not found'}

        # Determine version number
        if model_name not in self.models:
            self.models[model_name] = []

        version = len(self.models[model_name]) + 1

        # Create model version
        model_version = {
            'model_name': model_name,
            'version': version,
            'experiment_id': experiment_id,
            'artifact_path': artifact_path,
            'artifact_url': artifact['artifact_url'],
            'stage': model_config.get('stage', 'dev'),
            'description': model_config.get('description', ''),
            'parameters': self.experiments[experiment_id]['parameters'],
            'registered_by': context.get('user', 'unknown'),
            'registered_at': datetime.now()
        }

        self.models[model_name].append(model_version)

        return {
            'model_name': model_name,
            'version': version,
            'experiment_id': experiment_id,
            'stage': model_version['stage'],
            'registered_at': model_version['registered_at'].isoformat()
        }

    def promote_model(self, model_name: str, version: int, new_stage: str, context: dict) -> dict:
        """
        Promote model to new stage (dev → staging → production).

        FR: Model promotion workflow with approval
        NFR-R: Audit trail for model changes

        Args:
            model_name: Model name
            version: Model version
            new_stage: New stage ('staging' or 'production')
            context: Contains user info and approval

        Returns:
            {
                'model_name': str,
                'version': int,
                'old_stage': str,
                'new_stage': str,
                'promoted_by': str,
                'promoted_at': datetime
            }
        """
        if model_name not in self.models:
            return {'error': 'Model not found'}

        # Find model version
        model_versions = self.models[model_name]
        model = next((m for m in model_versions if m['version'] == version), None)

        if not model:
            return {'error': 'Model version not found'}

        old_stage = model['stage']

        # Validate promotion path
        # dev → staging → production
        valid_promotions = {
            'dev': ['staging'],
            'staging': ['production'],
            'production': []
        }

        if new_stage not in valid_promotions.get(old_stage, []):
            return {
                'error': f'Invalid promotion: cannot promote from {old_stage} to {new_stage}',
                'valid_stages': valid_promotions.get(old_stage, [])
            }

        # Check approval for production promotion
        if new_stage == 'production':
            if not context.get('approved', False):
                return {'error': 'Production promotion requires approval'}

        # Update stage
        model['stage'] = new_stage
        model['promoted_by'] = context.get('user', 'unknown')
        model['promoted_at'] = datetime.now()

        # Audit trail (log promotion event)
        promotion_event = {
            'model_name': model_name,
            'version': version,
            'old_stage': old_stage,
            'new_stage': new_stage,
            'promoted_by': model['promoted_by'],
            'promoted_at': model['promoted_at']
        }

        return {
            'model_name': model_name,
            'version': version,
            'old_stage': old_stage,
            'new_stage': new_stage,
            'promoted_by': model['promoted_by'],
            'promoted_at': model['promoted_at'].isoformat()
        }

    def search_experiments(self, filters: dict) -> dict:
        """
        Search experiments by parameters or metrics.

        FR: Filter/search experiments
        NFR-P: <2 seconds across 100K experiments

        Args:
            filters: {
                'parameter_filters': {'learning_rate': 0.01},
                'metric_filter': {'name': 'val_accuracy', 'min': 0.9},
                'limit': 10
            }

        Returns:
            {
                'experiments': [experiment_ids],
                'count': int
            }
        """
        results = []

        # Filter by parameters
        param_filters = filters.get('parameter_filters', {})

        for exp_id, experiment in self.experiments.items():
            # Check parameter filters
            match = True
            for param_name, param_value in param_filters.items():
                if experiment['parameters'].get(param_name) != param_value:
                    match = False
                    break

            if not match:
                continue

            # Check metric filter
            metric_filter = filters.get('metric_filter')
            if metric_filter:
                metric_name = metric_filter['name']
                min_value = metric_filter.get('min', float('-inf'))

                exp_metrics = [
                    m for m in self.metrics.get(exp_id, [])
                    if m['metric_name'] == metric_name
                ]

                if exp_metrics:
                    best_value = max(m['value'] for m in exp_metrics)
                    if best_value < min_value:
                        continue
                else:
                    continue

            results.append(exp_id)

        # Apply limit
        limit = filters.get('limit', 100)
        results = results[:limit]

        return {
            'experiments': results,
            'count': len(results)
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "log_experiment",
        "description": "FR: Log experiment with hyperparameters and metadata",
        "input": {
            "operation": "log_experiment",
            "experiment_config": {
                "name": "bert-finetuning-v1",
                "parameters": {
                    "learning_rate": 0.001,
                    "batch_size": 32,
                    "epochs": 10,
                    "model": "bert-base"
                },
                "metadata": {
                    "code_commit": "abc123",
                    "dataset_version": "v1.2",
                    "python_version": "3.9",
                    "user": "ml-engineer@company.com"
                }
            }
        },
        "expected_output": {
            "experiment_id": "<auto-generated>",
            "name": "bert-finetuning-v1",
            "created_at": "<timestamp>"
        }
    },
    {
        "id": 2,
        "name": "log_metric",
        "description": "FR: Log training metrics, NFR-P: <10ms per call",
        "input": {
            "operation": "log_metric",
            "setup": {
                "create_experiment": {
                    "name": "training-run-1"
                }
            },
            "metric_name": "train_loss",
            "value": 0.45,
            "step": 100
        },
        "expected_output": {
            "experiment_id": "<experiment-id>",
            "metric_name": "train_loss",
            "value": 0.45,
            "step": 100,
            "timestamp": "<timestamp>"
        }
    },
    {
        "id": 3,
        "name": "log_artifact",
        "description": "FR: Upload model checkpoint, NFR-P: 1GB in <1 minute",
        "input": {
            "operation": "log_artifact",
            "setup": {
                "create_experiment": {
                    "name": "model-training"
                }
            },
            "artifact_path": "model_checkpoint_epoch_10.pt",
            "artifact_size_bytes": 1024 * 1024 * 1024,  # 1 GB
            "context": {
                "storage": "s3"
            }
        },
        "expected_output": {
            "experiment_id": "<experiment-id>",
            "artifact_path": "model_checkpoint_epoch_10.pt",
            "artifact_url": "s3://ml-experiments/experiments/<exp-id>/artifacts/model_checkpoint_epoch_10.pt",
            "size_bytes": 1073741824,
            "compressed_size_bytes": "<~256MB>"  # 4x compression
        }
    },
    {
        "id": 4,
        "name": "compare_experiments",
        "description": "FR: Compare multiple experiments by metric, NFR-P: <2 seconds",
        "input": {
            "operation": "compare_experiments",
            "setup": {
                "create_experiments": [
                    {
                        "name": "exp-lr-0.001",
                        "parameters": {"learning_rate": 0.001},
                        "metrics": [{"name": "val_accuracy", "values": [0.85, 0.88, 0.90]}]
                    },
                    {
                        "name": "exp-lr-0.01",
                        "parameters": {"learning_rate": 0.01},
                        "metrics": [{"name": "val_accuracy", "values": [0.82, 0.87, 0.92]}]
                    },
                    {
                        "name": "exp-lr-0.1",
                        "parameters": {"learning_rate": 0.1},
                        "metrics": [{"name": "val_accuracy", "values": [0.75, 0.80, 0.83]}]
                    }
                ]
            },
            "experiment_ids": ["<exp1-id>", "<exp2-id>", "<exp3-id>"],
            "metric_name": "val_accuracy"
        },
        "expected_output": {
            "experiments": [
                {
                    "experiment_id": "<exp1-id>",
                    "parameters": {"learning_rate": 0.001},
                    "best_metric_value": 0.90,
                    "final_metric_value": 0.90
                },
                {
                    "experiment_id": "<exp2-id>",
                    "parameters": {"learning_rate": 0.01},
                    "best_metric_value": 0.92,
                    "final_metric_value": 0.92
                },
                {
                    "experiment_id": "<exp3-id>",
                    "parameters": {"learning_rate": 0.1},
                    "best_metric_value": 0.83,
                    "final_metric_value": 0.83
                }
            ],
            "winner": "<exp2-id>",  # lr=0.01 has best accuracy (0.92)
            "metric_name": "val_accuracy"
        }
    },
    {
        "id": 5,
        "name": "register_model",
        "description": "FR: Register model to model registry, NFR-R: Track lineage",
        "input": {
            "operation": "register_model",
            "setup": {
                "create_experiment": {
                    "name": "production-model-training",
                    "parameters": {"learning_rate": 0.001, "batch_size": 64}
                },
                "log_artifact": {
                    "artifact_path": "final_model.pt",
                    "artifact_size_bytes": 500 * 1024 * 1024  # 500MB
                }
            },
            "model_config": {
                "model_name": "fraud-detector",
                "experiment_id": "<experiment-id>",
                "artifact_path": "final_model.pt",
                "stage": "dev",
                "description": "Fraud detection model v1"
            },
            "context": {
                "user": "ml-engineer@company.com"
            }
        },
        "expected_output": {
            "model_name": "fraud-detector",
            "version": 1,
            "experiment_id": "<experiment-id>",
            "stage": "dev",
            "registered_at": "<timestamp>"
        }
    },
    {
        "id": 6,
        "name": "promote_model_to_staging",
        "description": "FR: Promote model dev → staging",
        "input": {
            "operation": "promote_model",
            "setup": {
                "register_model": {
                    "model_name": "recommendation-engine",
                    "stage": "dev"
                }
            },
            "model_name": "recommendation-engine",
            "version": 1,
            "new_stage": "staging",
            "context": {
                "user": "ml-engineer@company.com",
                "approved": False  # Staging doesn't require approval
            }
        },
        "expected_output": {
            "model_name": "recommendation-engine",
            "version": 1,
            "old_stage": "dev",
            "new_stage": "staging",
            "promoted_by": "ml-engineer@company.com",
            "promoted_at": "<timestamp>"
        }
    },
    {
        "id": 7,
        "name": "promote_model_to_production_requires_approval",
        "description": "FR: Production promotion requires approval, NFR-R: Audit trail",
        "input": {
            "operation": "promote_model",
            "setup": {
                "register_model": {
                    "model_name": "sentiment-classifier",
                    "stage": "staging"  # Already in staging
                }
            },
            "model_name": "sentiment-classifier",
            "version": 1,
            "new_stage": "production",
            "context": {
                "user": "ml-engineer@company.com",
                "approved": False  # NO approval
            }
        },
        "expected_output": {
            "error": "Production promotion requires approval"
        }
    },
    {
        "id": 8,
        "name": "search_experiments_by_parameters",
        "description": "FR: Search experiments by parameters, NFR-P: <2 seconds for 100K experiments",
        "input": {
            "operation": "search_experiments",
            "setup": {
                "create_experiments": [
                    {"name": "exp1", "parameters": {"learning_rate": 0.001, "batch_size": 32}},
                    {"name": "exp2", "parameters": {"learning_rate": 0.01, "batch_size": 32}},
                    {"name": "exp3", "parameters": {"learning_rate": 0.001, "batch_size": 64}},
                    {"name": "exp4", "parameters": {"learning_rate": 0.001, "batch_size": 32}}
                ]
            },
            "filters": {
                "parameter_filters": {
                    "learning_rate": 0.001,
                    "batch_size": 32
                },
                "limit": 10
            }
        },
        "expected_output": {
            "experiments": ["<exp1-id>", "<exp4-id>"],  # Only these match lr=0.001 AND bs=32
            "count": 2
        }
    }
]


export const mlExperimentTrackingChallenge: SystemDesignChallenge = {
  id: 'ml_experiment_tracking',
  title: 'ML Experiment Tracking',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design an ML Experiment Tracking system that logs hyperparameters, metrics, and artifacts to enable reproducibility, comparison, and model governance across thousands of ML experiments.

**Real-world Context:**
At Uber Michelangelo, data scientists run 10K+ experiments per month. The experiment tracking system logs every hyperparameter, metric (accuracy, F1, AUC), and model checkpoint. When a model is promoted to production, the system tracks lineage: which experiment, which dataset version, which code commit. This enables reproducibility and debugging when models behave unexpectedly.

**Key Technical Challenges:**
1. **Performance**: How do you log metrics without slowing down training (<10ms per call)?
2. **Artifact Storage**: How do you store 1GB model checkpoints efficiently (S3, compression)?
3. **Comparison**: How do you compare 100 experiments with different hyperparameters?
4. **Model Registry**: How do you manage model promotion (dev → staging → production)?

**Companies Asking This:** Google (Vertex AI), Uber (Michelangelo), Airbnb, Netflix, Meta`,

  realWorldScenario: {
    company: 'Uber',
    context: 'Data scientist runs 50 experiments to optimize fraud detection model. Need to find best hyperparameters.',
    constraint: 'Must compare all experiments by val_accuracy, track full reproducibility (code, data, params).'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Experiment Logging',
      content: 'Log parameters (learning_rate, batch_size), metrics (accuracy, loss), metadata (code commit, dataset version). Make experiments immutable (can\'t edit past experiments).'
    },
    {
      stage: 'FR',
      title: 'Metric Logging',
      content: 'Log metrics over time (step/epoch). Store as time-series: [{step: 1, value: 0.7}, {step: 2, value: 0.8}]. Enable plotting learning curves.'
    },
    {
      stage: 'FR',
      title: 'Artifact Storage',
      content: 'Upload to S3 with multipart upload (for >5MB files). Compress artifacts (3-5x reduction). Store metadata: artifact_path, s3_url, size, uploaded_at.'
    },
    {
      stage: 'FR',
      title: 'Model Registry',
      content: 'Version models (v1, v2, ...). Track stages: dev → staging → production. Require approval for production promotion. Link model to source experiment (lineage).'
    },
    {
      stage: 'NFR-P',
      title: 'Fast Metric Logging',
      content: 'Batch metric writes (async). Don\'t block training loop. Target: <10ms per log_metric() call. Write to local buffer, flush to DB in background.'
    },
    {
      stage: 'NFR-R',
      title: 'Reproducibility',
      content: 'Store everything needed to reproduce: code commit SHA, dataset version, parameters, environment (Python version, GPU type). Make experiments immutable.'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Logs experiment with parameters and metadata',
        'Logs metrics over time (step-based)',
        'Uploads artifacts to S3 with compression',
        'Compares experiments by metric (finds winner)',
        'Registers models with versioning and stages',
        'Promotes models with validation (dev → staging → production)',
        'Searches experiments by parameters'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'Metric logging <10ms per call',
        'Artifact upload 1GB in <1 minute',
        'Query/search <2 seconds for 100K experiments',
        'Real-time metrics with <5 second lag'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 100K+ experiments',
        'Stores 1TB+ artifacts',
        'Handles 1000+ concurrent training jobs',
        'Multi-tenant (100+ teams)'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of logging, comparison, and registry',
        'Immutable experiment records',
        'Model promotion validation (stage transitions)',
        'Clean test cases covering logging, comparison, promotion'
      ]
    }
  },

  commonMistakes: [
    'Synchronous metric logging → slows down training loop',
    'No artifact compression → 3-5x higher storage costs',
    'Mutable experiments → can\'t reproduce past results',
    'No model promotion workflow → anyone can push to production',
    'Not tracking code version → can\'t reproduce experiment',
    'No search/filtering → hard to find best experiments from 1000s of runs'
  ],

  companiesAsking: ['Google', 'Uber', 'Airbnb', 'Netflix', 'Meta'],
  relatedPatterns: [
    'Model Serving Platform (consumes models from registry)',
    'Feature Store (tracks feature versions like experiments)',
    'ETL Orchestration (similar DAG tracking and versioning)',
    'Backup & Restore (similar artifact storage and versioning)'
  ]
};
