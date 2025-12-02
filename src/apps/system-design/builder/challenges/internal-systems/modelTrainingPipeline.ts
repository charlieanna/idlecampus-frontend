/**
 * L4-L5 Internal Systems: Model Training Pipeline
 *
 * Design a distributed model training pipeline that schedules GPU jobs, handles
 * hyperparameter tuning, checkpoint recovery, and experiment tracking at scale.
 * Essential for ML teams to iterate quickly and train models efficiently.
 *
 * Real-world examples:
 * - Google Cloud AI Platform: Managed training with distributed GPU support
 * - AWS SageMaker: Training jobs with hyperparameter tuning
 * - Uber Michelangelo: ML platform with distributed training
 * - Meta PyTorch Elastic: Fault-tolerant distributed training
 *
 * Companies: Google, AWS, Uber, Meta, Airbnb, Netflix
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: ML Infrastructure
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Job Scheduling
 *    - GPU allocation: Schedule training jobs on available GPUs
 *    - Priority queues: P0 (urgent) > P1 (normal) > P2 (batch)
 *    - Resource quotas: Per-team GPU limits
 *    - Preemption: P0 jobs can kill P2 jobs
 *
 * 2. Distributed Training
 *    - Data parallelism: Split data across GPUs
 *    - Model parallelism: Split model across GPUs (for large models)
 *    - Parameter server: Coordinate gradient updates
 *    - AllReduce: Efficient gradient synchronization
 *
 * 3. Hyperparameter Tuning
 *    - Grid search: Try all combinations
 *    - Random search: Sample from parameter space
 *    - Bayesian optimization: Use previous results to guide search
 *    - Early stopping: Kill poorly performing trials
 *
 * 4. Checkpoint & Recovery
 *    - Periodic checkpointing: Save model every N steps
 *    - Crash recovery: Resume from last checkpoint
 *    - Preemption handling: Save checkpoint before killing job
 *    - Checkpoint storage: S3 with compression
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - GPU utilization: >90% (minimize idle time)
 * - Job startup time: <5 minutes (container pull, data download)
 * - Checkpoint overhead: <5% of training time
 * - Throughput: 1000+ training jobs per day
 *
 * Scalability (NFR-S):
 * - Support 1000+ GPUs in cluster
 * - Handle 100+ concurrent training jobs
 * - Multi-tenant: 50+ teams sharing cluster
 * - Multi-region: Train in multiple datacenters
 *
 * Reliability (NFR-R):
 * - Fault tolerance: Recover from GPU failures
 * - Checkpoint durability: 99.999999999% (S3)
 * - Job completion rate: 99% (handle failures gracefully)
 * - Resource isolation: Prevent jobs from affecting each other
 *
 * Cost (NFR-C):
 * - Use spot instances for batch jobs (70% cost savings)
 * - Auto-scaling: Scale down when idle
 * - Checkpoint compression: 3-5x reduction in storage
 * - Early stopping: Kill unpromising trials (save GPU hours)
 */

const pythonTemplate = `from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import deque
import random

class ModelTrainingPipeline:
    """
    Model Training Pipeline

    Key Operations:
    1. submit_training_job: Submit job to queue
    2. schedule_job: Allocate GPUs to job
    3. run_hyperparameter_tuning: Grid/random/bayesian search
    4. checkpoint_model: Save model checkpoint
    5. recover_from_checkpoint: Resume training from checkpoint
    """

    def __init__(self):
        self.jobs = {}  # {job_id: Job}
        self.job_queue = deque()  # Queue of pending jobs
        self.gpu_pool = {}  # {gpu_id: GPU}
        self.checkpoints = {}  # {job_id: [Checkpoint]}
        self.team_quotas = {}  # {team: quota}

    def submit_training_job(self, job_config: dict, context: dict) -> dict:
        """
        Submit training job to queue.

        FR: Job scheduling with priority queues
        NFR-S: Handle 100+ concurrent jobs

        Args:
            job_config: {
                'name': str,
                'team': str,
                'priority': 'P0' | 'P1' | 'P2',
                'gpu_count': int,
                'gpu_type': 'V100' | 'A100',
                'training_script': str,
                'hyperparameters': dict,
                'max_duration_hours': int
            }
            context: Contains team quotas

        Returns:
            {
                'job_id': str,
                'status': 'queued',
                'position': int,  # Position in queue
                'estimated_wait_minutes': int
            }
        """
        # Generate job ID
        job_id = f"job-{int(datetime.now().timestamp() * 1000)}"

        # Check team quota
        team = job_config['team']
        requested_gpus = job_config['gpu_count']

        team_quota = context.get('team_quotas', {}).get(team, 0)
        team_usage = sum(
            j['gpu_count'] for j in self.jobs.values()
            if j['team'] == team and j['status'] in ['queued', 'running']
        )

        if team_usage + requested_gpus > team_quota:
            return {
                'error': 'Team quota exceeded',
                'team': team,
                'quota': team_quota,
                'current_usage': team_usage,
                'requested': requested_gpus
            }

        # Create job
        job = {
            'job_id': job_id,
            'name': job_config['name'],
            'team': team,
            'priority': job_config['priority'],
            'gpu_count': requested_gpus,
            'gpu_type': job_config.get('gpu_type', 'V100'),
            'training_script': job_config['training_script'],
            'hyperparameters': job_config['hyperparameters'],
            'max_duration_hours': job_config.get('max_duration_hours', 24),
            'status': 'queued',
            'submitted_at': datetime.now(),
            'started_at': None,
            'completed_at': None
        }

        self.jobs[job_id] = job

        # Add to priority queue
        # Sort by priority: P0 > P1 > P2
        self.job_queue.append(job_id)
        self._sort_queue()

        # Calculate position and estimated wait
        position = list(self.job_queue).index(job_id) + 1

        # Estimate wait time (simplified: assume 1 hour per job ahead)
        estimated_wait_minutes = position * 60

        return {
            'job_id': job_id,
            'status': 'queued',
            'position': position,
            'estimated_wait_minutes': estimated_wait_minutes
        }

    def _sort_queue(self):
        """Sort job queue by priority."""
        priority_order = {'P0': 0, 'P1': 1, 'P2': 2}
        self.job_queue = deque(sorted(
            self.job_queue,
            key=lambda jid: (
                priority_order.get(self.jobs[jid]['priority'], 3),
                self.jobs[jid]['submitted_at']
            )
        ))

    def schedule_job(self, context: dict) -> dict:
        """
        Schedule next job from queue onto available GPUs.

        FR: GPU allocation and resource management
        NFR-P: GPU utilization >90%
        NFR-R: Resource isolation

        Args:
            context: Contains GPU pool status

        Returns:
            {
                'job_id': str,
                'allocated_gpus': [gpu_ids],
                'status': 'running' | 'waiting',
                'reason': str  # If waiting
            }
        """
        # Get available GPUs
        available_gpus = [
            gpu_id for gpu_id, gpu in self.gpu_pool.items()
            if gpu['status'] == 'idle'
        ]

        if not self.job_queue:
            return {'status': 'no_jobs_queued'}

        # Try to schedule highest priority job
        for job_id in list(self.job_queue):
            job = self.jobs[job_id]

            # Filter GPUs by type
            compatible_gpus = [
                gpu_id for gpu_id in available_gpus
                if self.gpu_pool[gpu_id]['type'] == job['gpu_type']
            ]

            # Check if we have enough GPUs
            if len(compatible_gpus) >= job['gpu_count']:
                # Allocate GPUs
                allocated_gpus = compatible_gpus[:job['gpu_count']]

                # Mark GPUs as allocated
                for gpu_id in allocated_gpus:
                    self.gpu_pool[gpu_id]['status'] = 'allocated'
                    self.gpu_pool[gpu_id]['job_id'] = job_id

                # Update job status
                job['status'] = 'running'
                job['started_at'] = datetime.now()
                job['allocated_gpus'] = allocated_gpus

                # Remove from queue
                self.job_queue.remove(job_id)

                return {
                    'job_id': job_id,
                    'allocated_gpus': allocated_gpus,
                    'status': 'running',
                    'started_at': job['started_at'].isoformat()
                }

        # No resources available
        first_job = self.jobs[self.job_queue[0]]
        return {
            'status': 'waiting',
            'reason': f'Waiting for {first_job["gpu_count"]} {first_job["gpu_type"]} GPUs',
            'available_gpus': len(available_gpus)
        }

    def run_hyperparameter_tuning(self, tuning_config: dict, context: dict) -> dict:
        """
        Run hyperparameter tuning (grid/random search).

        FR: Hyperparameter tuning with early stopping
        NFR-C: Early stopping saves GPU hours

        Args:
            tuning_config: {
                'search_type': 'grid' | 'random' | 'bayesian',
                'param_space': {
                    'learning_rate': [0.001, 0.01, 0.1],
                    'batch_size': [32, 64, 128]
                },
                'max_trials': int,
                'early_stopping': {
                    'metric': 'val_loss',
                    'patience': 3,  # Stop if no improvement for 3 evaluations
                    'min_improvement': 0.01
                }
            }
            context: Contains experiment tracking

        Returns:
            {
                'trials': [
                    {
                        'trial_id': str,
                        'hyperparameters': dict,
                        'metric_value': float,
                        'status': 'completed' | 'early_stopped'
                    }
                ],
                'best_trial': {
                    'trial_id': str,
                    'hyperparameters': dict,
                    'metric_value': float
                }
            }
        """
        search_type = tuning_config['search_type']
        param_space = tuning_config['param_space']
        max_trials = tuning_config.get('max_trials', 10)
        early_stopping = tuning_config.get('early_stopping', {})

        trials = []

        # Generate trial configurations
        if search_type == 'grid':
            # Grid search: Try all combinations
            param_names = list(param_space.keys())
            param_values = list(param_space.values())

            # Generate all combinations (simplified for 2 params)
            trial_configs = []
            if len(param_names) == 2:
                for val1 in param_values[0]:
                    for val2 in param_values[1]:
                        trial_configs.append({
                            param_names[0]: val1,
                            param_names[1]: val2
                        })
            # Limit to max_trials
            trial_configs = trial_configs[:max_trials]

        elif search_type == 'random':
            # Random search: Sample from parameter space
            trial_configs = []
            for _ in range(max_trials):
                config = {
                    param: random.choice(values)
                    for param, values in param_space.items()
                }
                trial_configs.append(config)

        # Run trials
        best_metric = float('inf')  # Assume lower is better (e.g., loss)
        best_trial = None

        for idx, config in enumerate(trial_configs):
            trial_id = f"trial-{idx}"

            # Simulate training (in production: actually run training job)
            # Metric value depends on hyperparameters (simplified)
            metric_value = self._simulate_training(config)

            # Early stopping check
            status = 'completed'
            if early_stopping and idx > 0:
                # Check if improvement over best so far
                improvement = best_metric - metric_value
                min_improvement = early_stopping.get('min_improvement', 0.01)

                if improvement < min_improvement:
                    # No significant improvement
                    status = 'early_stopped'

            trial = {
                'trial_id': trial_id,
                'hyperparameters': config,
                'metric_value': metric_value,
                'status': status
            }

            trials.append(trial)

            # Update best
            if metric_value < best_metric:
                best_metric = metric_value
                best_trial = trial

            # Early stop if trial was stopped
            if status == 'early_stopped':
                break

        return {
            'trials': trials,
            'best_trial': best_trial,
            'total_trials': len(trials),
            'early_stopped_trials': sum(1 for t in trials if t['status'] == 'early_stopped')
        }

    def _simulate_training(self, hyperparameters: dict) -> float:
        """Simulate training and return metric value."""
        # Simple simulation: metric depends on learning rate
        lr = hyperparameters.get('learning_rate', 0.01)
        # Optimal lr is 0.01
        metric_value = abs(lr - 0.01) * 10 + random.uniform(0.1, 0.3)
        return round(metric_value, 3)

    def checkpoint_model(self, job_id: str, step: int, context: dict) -> dict:
        """
        Save model checkpoint.

        FR: Periodic checkpointing for fault tolerance
        NFR-P: Checkpoint overhead <5% of training time
        NFR-R: Checkpoint durability 99.999999999%

        Args:
            job_id: Training job ID
            step: Training step number
            context: Contains model state, optimizer state

        Returns:
            {
                'checkpoint_id': str,
                'job_id': str,
                'step': int,
                's3_path': str,
                'size_bytes': int
            }
        """
        if job_id not in self.jobs:
            return {'error': 'Job not found'}

        job = self.jobs[job_id]

        # Generate checkpoint ID
        checkpoint_id = f"{job_id}:step-{step}"

        # Simulate checkpoint size (model + optimizer state)
        # Typical: 500MB for medium model
        checkpoint_size = 500 * 1024 * 1024

        # Compress checkpoint (3-5x reduction)
        compression_ratio = 4
        compressed_size = checkpoint_size // compression_ratio

        # Upload to S3 (simulated)
        s3_path = f"s3://ml-checkpoints/{job_id}/checkpoint-step-{step}.tar.gz"

        # Calculate upload time
        # Assume 100 MB/s upload speed
        upload_time_seconds = compressed_size / (100 * 1024 * 1024)

        checkpoint = {
            'checkpoint_id': checkpoint_id,
            'job_id': job_id,
            'step': step,
            's3_path': s3_path,
            'size_bytes': checkpoint_size,
            'compressed_size_bytes': compressed_size,
            'upload_time_seconds': round(upload_time_seconds, 2),
            'created_at': datetime.now()
        }

        # Store checkpoint metadata
        if job_id not in self.checkpoints:
            self.checkpoints[job_id] = []

        self.checkpoints[job_id].append(checkpoint)

        return {
            'checkpoint_id': checkpoint_id,
            'job_id': job_id,
            'step': step,
            's3_path': s3_path,
            'size_bytes': checkpoint_size,
            'compressed_size_bytes': compressed_size
        }

    def recover_from_checkpoint(self, job_id: str, context: dict) -> dict:
        """
        Recover training job from latest checkpoint.

        FR: Crash recovery
        NFR-R: Fault tolerance

        Args:
            job_id: Job to recover
            context: Contains S3 client

        Returns:
            {
                'job_id': str,
                'checkpoint_id': str,
                'resume_step': int,
                'recovery_time_seconds': float
            }
        """
        if job_id not in self.checkpoints or not self.checkpoints[job_id]:
            return {'error': 'No checkpoints found for job'}

        # Find latest checkpoint
        checkpoints = sorted(self.checkpoints[job_id], key=lambda c: c['step'], reverse=True)
        latest_checkpoint = checkpoints[0]

        # Download checkpoint from S3 (simulated)
        compressed_size = latest_checkpoint['compressed_size_bytes']
        download_time_seconds = compressed_size / (100 * 1024 * 1024)  # 100 MB/s

        # Decompress checkpoint
        decompress_time_seconds = 2  # Assume 2 seconds to decompress

        total_recovery_time = download_time_seconds + decompress_time_seconds

        # Update job status
        if job_id in self.jobs:
            self.jobs[job_id]['status'] = 'running'
            self.jobs[job_id]['recovered_from'] = latest_checkpoint['checkpoint_id']

        return {
            'job_id': job_id,
            'checkpoint_id': latest_checkpoint['checkpoint_id'],
            'resume_step': latest_checkpoint['step'],
            'recovery_time_seconds': round(total_recovery_time, 2)
        }

    def preempt_job(self, job_id: str, context: dict) -> dict:
        """
        Preempt (kill) job to free resources for higher priority job.

        FR: Preemption for priority scheduling
        NFR-R: Save checkpoint before killing

        Args:
            job_id: Job to preempt
            context: Contains GPU pool

        Returns:
            {
                'job_id': str,
                'status': 'preempted',
                'checkpoint_saved': bool,
                'freed_gpus': [gpu_ids]
            }
        """
        if job_id not in self.jobs:
            return {'error': 'Job not found'}

        job = self.jobs[job_id]

        # Save checkpoint before preemption
        # Assume we're at step 1000
        current_step = 1000
        checkpoint_result = self.checkpoint_model(job_id, current_step, context)

        checkpoint_saved = 'checkpoint_id' in checkpoint_result

        # Free GPUs
        freed_gpus = job.get('allocated_gpus', [])
        for gpu_id in freed_gpus:
            if gpu_id in self.gpu_pool:
                self.gpu_pool[gpu_id]['status'] = 'idle'
                self.gpu_pool[gpu_id]['job_id'] = None

        # Update job status
        job['status'] = 'preempted'
        job['preempted_at'] = datetime.now()

        # Add back to queue
        self.job_queue.append(job_id)
        self._sort_queue()

        return {
            'job_id': job_id,
            'status': 'preempted',
            'checkpoint_saved': checkpoint_saved,
            'freed_gpus': freed_gpus,
            'requeued': True
        }


# Test cases
test_cases: List[TestCase] = [
    {
        "id": 1,
        "name": "submit_training_job",
        "description": "FR: Submit job to queue with priority",
        "input": {
            "operation": "submit_training_job",
            "job_config": {
                "name": "bert-training",
                "team": "nlp-team",
                "priority": "P1",
                "gpu_count": 4,
                "gpu_type": "V100",
                "training_script": "train.py",
                "hyperparameters": {"learning_rate": 0.001, "batch_size": 32},
                "max_duration_hours": 24
            },
            "context": {
                "team_quotas": {"nlp-team": 16}
            }
        },
        "expected_output": {
            "job_id": "<auto-generated>",
            "status": "queued",
            "position": 1,
            "estimated_wait_minutes": "<calculated>"
        }
    },
    {
        "id": 2,
        "name": "submit_job_quota_exceeded",
        "description": "FR: Reject job if team quota exceeded",
        "input": {
            "operation": "submit_training_job",
            "setup": {
                "existing_jobs": [
                    {"team": "vision-team", "gpu_count": 12, "status": "running"}
                ]
            },
            "job_config": {
                "name": "resnet-training",
                "team": "vision-team",
                "priority": "P1",
                "gpu_count": 8,
                "gpu_type": "A100"
            },
            "context": {
                "team_quotas": {"vision-team": 16}  # Already using 12, requesting 8 → 20 > 16
            }
        },
        "expected_output": {
            "error": "Team quota exceeded",
            "team": "vision-team",
            "quota": 16,
            "current_usage": 12,
            "requested": 8
        }
    },
    {
        "id": 3,
        "name": "schedule_job_gpu_allocation",
        "description": "FR: Allocate GPUs to job, NFR-P: GPU utilization >90%",
        "input": {
            "operation": "schedule_job",
            "setup": {
                "submit_job": {
                    "name": "gpt-training",
                    "gpu_count": 8,
                    "gpu_type": "A100",
                    "priority": "P0"
                },
                "gpu_pool": {
                    "gpu-0": {"type": "A100", "status": "idle"},
                    "gpu-1": {"type": "A100", "status": "idle"},
                    "gpu-2": {"type": "A100", "status": "idle"},
                    "gpu-3": {"type": "A100", "status": "idle"},
                    "gpu-4": {"type": "A100", "status": "idle"},
                    "gpu-5": {"type": "A100", "status": "idle"},
                    "gpu-6": {"type": "A100", "status": "idle"},
                    "gpu-7": {"type": "A100", "status": "idle"}
                }
            },
            "context": {}
        },
        "expected_output": {
            "job_id": "<job-id>",
            "allocated_gpus": ["gpu-0", "gpu-1", "gpu-2", "gpu-3", "gpu-4", "gpu-5", "gpu-6", "gpu-7"],
            "status": "running",
            "started_at": "<timestamp>"
        }
    },
    {
        "id": 4,
        "name": "hyperparameter_tuning_grid_search",
        "description": "FR: Grid search hyperparameter tuning",
        "input": {
            "operation": "run_hyperparameter_tuning",
            "tuning_config": {
                "search_type": "grid",
                "param_space": {
                    "learning_rate": [0.001, 0.01, 0.1],
                    "batch_size": [32, 64]
                },
                "max_trials": 6
            },
            "context": {}
        },
        "expected_output": {
            "trials": "<6 trials>",  # 3 lr × 2 bs = 6 combinations
            "best_trial": {
                "trial_id": "<trial-id>",
                "hyperparameters": {"learning_rate": 0.01, "batch_size": "<32 or 64>"},
                "metric_value": "<lowest>"
            },
            "total_trials": 6,
            "early_stopped_trials": 0
        }
    },
    {
        "id": 5,
        "name": "hyperparameter_tuning_early_stopping",
        "description": "FR: Early stopping kills unpromising trials, NFR-C: Save GPU hours",
        "input": {
            "operation": "run_hyperparameter_tuning",
            "tuning_config": {
                "search_type": "random",
                "param_space": {
                    "learning_rate": [0.0001, 0.001, 0.01, 0.1, 1.0],
                    "batch_size": [16, 32, 64, 128]
                },
                "max_trials": 10,
                "early_stopping": {
                    "metric": "val_loss",
                    "patience": 3,
                    "min_improvement": 0.01
                }
            },
            "context": {}
        },
        "expected_output": {
            "trials": "<variable, may stop early>",
            "best_trial": {
                "trial_id": "<trial-id>",
                "hyperparameters": {"learning_rate": "<optimal>", "batch_size": "<optimal>"},
                "metric_value": "<lowest>"
            },
            "total_trials": "<10 or fewer if early stopped>",
            "early_stopped_trials": ">0"
        }
    },
    {
        "id": 6,
        "name": "checkpoint_model",
        "description": "FR: Save checkpoint, NFR-P: <5% overhead, NFR-R: S3 durability",
        "input": {
            "operation": "checkpoint_model",
            "setup": {
                "submit_and_run_job": {
                    "job_id": "job-123"
                }
            },
            "job_id": "job-123",
            "step": 1000,
            "context": {}
        },
        "expected_output": {
            "checkpoint_id": "job-123:step-1000",
            "job_id": "job-123",
            "step": 1000,
            "s3_path": "s3://ml-checkpoints/job-123/checkpoint-step-1000.tar.gz",
            "size_bytes": 524288000,  # 500MB
            "compressed_size_bytes": 131072000  # ~125MB (4x compression)
        }
    },
    {
        "id": 7,
        "name": "recover_from_checkpoint",
        "description": "FR: Resume training from checkpoint after crash, NFR-R: Fault tolerance",
        "input": {
            "operation": "recover_from_checkpoint",
            "setup": {
                "submit_job": {"job_id": "job-456"},
                "create_checkpoints": [
                    {"step": 500},
                    {"step": 1000},
                    {"step": 1500}
                ]
            },
            "job_id": "job-456",
            "context": {}
        },
        "expected_output": {
            "job_id": "job-456",
            "checkpoint_id": "job-456:step-1500",  # Latest checkpoint
            "resume_step": 1500,
            "recovery_time_seconds": "<calculated>"
        }
    },
    {
        "id": 8,
        "name": "preempt_job",
        "description": "FR: Preempt low-priority job, save checkpoint before killing",
        "input": {
            "operation": "preempt_job",
            "setup": {
                "submit_and_run_job": {
                    "job_id": "job-p2-batch",
                    "priority": "P2",
                    "allocated_gpus": ["gpu-0", "gpu-1", "gpu-2", "gpu-3"]
                }
            },
            "job_id": "job-p2-batch",
            "context": {}
        },
        "expected_output": {
            "job_id": "job-p2-batch",
            "status": "preempted",
            "checkpoint_saved": True,
            "freed_gpus": ["gpu-0", "gpu-1", "gpu-2", "gpu-3"],
            "requeued": True
        }
    },
    {
        "id": 9,
        "name": "nfr_gpu_utilization",
        "description": "NFR-P: GPU utilization >90%",
        "input": {
            "operation": "calculate_gpu_utilization",
            "setup": {
                "gpu_pool": {
                    "total_gpus": 100,
                    "allocated_gpus": 95,
                    "idle_gpus": 5
                }
            }
        },
        "expected_output": {
            "gpu_utilization": 95.0,  # 95/100 = 95%
            "target": 90.0,
            "target_met": True
        }
    },
    {
        "id": 10,
        "name": "nfr_checkpoint_overhead",
        "description": "NFR-P: Checkpoint overhead <5% of training time",
        "input": {
            "operation": "measure_checkpoint_overhead",
            "setup": {
                "training_time_seconds": 3600,  # 1 hour training
                "checkpoint_count": 10,  # Checkpoint every 6 minutes
                "checkpoint_time_per_save": 10  # 10 seconds per checkpoint
            }
        },
        "expected_output": {
            "total_training_time": 3600,
            "total_checkpoint_time": 100,  # 10 checkpoints × 10 seconds
            "checkpoint_overhead_percentage": 2.78,  # 100/3600 = 2.78% < 5%
            "overhead_acceptable": True
        }
    }
]

`;
export const modelTrainingPipelineChallenge: SystemDesignChallenge = {
  id: 'model_training_pipeline',
  title: 'Model Training Pipeline',
  difficulty: 'advanced' as const,
  timeEstimate: 45,
  domain: 'internal-systems',

  description: `Design a Model Training Pipeline that schedules distributed GPU jobs, handles hyperparameter tuning with early stopping, checkpoint recovery, and manages resources across teams at scale.

**Real-world Context:**
At Uber Michelangelo, data scientists submit 1000+ training jobs per day to a shared GPU cluster. The system uses priority queues (P0 urgent jobs preempt P2 batch jobs), allocates 8+ GPUs per job for distributed training, saves checkpoints every 500 steps for fault tolerance, and runs hyperparameter tuning with early stopping to kill unpromising trials (saving GPU hours).

**Key Technical Challenges:**
1. **GPU Scheduling**: How do you allocate GPUs fairly across teams with quotas and priorities?
2. **Fault Tolerance**: How do you recover from GPU failures mid-training (checkpointing)?
3. **Hyperparameter Tuning**: How do you efficiently search parameter space (early stopping)?
4. **Distributed Training**: How do you coordinate gradient updates across 8+ GPUs?

**Companies Asking This:** Google (AI Platform), AWS (SageMaker), Uber (Michelangelo), Meta, Airbnb`,

  realWorldScenario: {
    company: 'Uber',
    context: 'ML team needs to train 50 models with different hyperparameters. Cluster has 100 GPUs shared across 10 teams.',
    constraint: '>90% GPU utilization, <5% checkpoint overhead, recover from GPU failures, respect team quotas.'
  },

  hints: [
    {
      stage: 'FR',
      title: 'Job Scheduling',
      content: 'Priority queue: P0 > P1 > P2. Check team quota before scheduling. Allocate GPUs by type (V100, A100). Preempt P2 jobs to free resources for P0.'
    },
    {
      stage: 'FR',
      title: 'Hyperparameter Tuning',
      content: 'Grid search: Try all combinations. Random search: Sample from space. Early stopping: Kill trials with <1% improvement over best. Saves GPU hours.'
    },
    {
      stage: 'FR',
      title: 'Checkpointing',
      content: 'Save checkpoint every N steps (e.g., 500). Upload to S3 with compression (4x reduction). On crash, download latest checkpoint and resume from that step.'
    },
    {
      stage: 'NFR-P',
      title: 'GPU Utilization',
      content: 'Target >90% utilization. Schedule jobs as soon as GPUs free up. Use spot instances for batch jobs (P2) to reduce cost. Preempt batch jobs for urgent jobs.'
    },
    {
      stage: 'NFR-R',
      title: 'Fault Tolerance',
      content: 'Checkpoint periodically. On GPU failure, reschedule job and recover from latest checkpoint. Store checkpoints in S3 (11 nines durability).'
    },
    {
      stage: 'NFR-C',
      title: 'Cost Optimization',
      content: 'Use spot instances for P2 batch jobs (70% savings). Early stopping kills bad trials (saves GPU hours). Compress checkpoints (4x reduction in S3 costs).'
    }
  ],

  testCases,
  template: pythonTemplate,

  evaluation: {
    correctness: {
      weight: 0.3,
      criteria: [
        'Submits jobs to queue with priority and team quota checks',
        'Schedules jobs by allocating GPUs',
        'Runs hyperparameter tuning (grid search, early stopping)',
        'Saves checkpoints to S3 with compression',
        'Recovers from checkpoint after failure',
        'Preempts low-priority jobs to free resources'
      ]
    },
    performance: {
      weight: 0.25,
      criteria: [
        'GPU utilization >90%',
        'Job startup time <5 minutes',
        'Checkpoint overhead <5% of training time',
        'Throughput 1000+ jobs per day'
      ]
    },
    scalability: {
      weight: 0.25,
      criteria: [
        'Supports 1000+ GPUs',
        'Handles 100+ concurrent jobs',
        'Multi-tenant (50+ teams)',
        'Multi-region training'
      ]
    },
    codeQuality: {
      weight: 0.2,
      criteria: [
        'Clear separation of scheduling, tuning, and checkpointing',
        'Priority queue sorting logic',
        'Early stopping logic for hyperparameter tuning',
        'Clean test cases covering job submission, scheduling, tuning, checkpointing, preemption'
      ]
    }
  },

  commonMistakes: [
    'No team quotas → one team monopolizes cluster',
    'No preemption → urgent jobs wait behind batch jobs',
    'No checkpointing → hours of training lost on GPU failure',
    'No early stopping → waste GPU hours on bad hyperparameters',
    'Not compressing checkpoints → high S3 storage costs',
    'Synchronous scheduling → low GPU utilization (schedule async)'
  ],

  companiesAsking: ['Google', 'AWS', 'Uber', 'Meta', 'Airbnb', 'Netflix'],
  relatedPatterns: [
    'ML Experiment Tracking (tracks experiments from training pipeline)',
    'Model Serving Platform (serves models trained by pipeline)',
    'Internal Job Scheduler (similar GPU scheduling to general job scheduling)',
    'Backup & Restore (checkpointing similar to backup strategy)'
  ]
};
