/**
 * L4-L5 Internal Systems: Model Serving Platform
 *
 * Design a platform for deploying and serving machine learning models with
 * low latency, high throughput, and safe rollout strategies.
 * Similar to TensorFlow Serving, TorchServe, or custom solutions at Uber/Airbnb.
 *
 * Real-world examples:
 * - TensorFlow Serving: Google's model serving system
 * - Uber Michelangelo: End-to-end ML platform with model serving
 * - Airbnb Bighead: Model training and serving infrastructure
 * - Meta FBLearner: Facebook's ML serving platform
 *
 * Companies: Google, Uber, Airbnb, Meta, Amazon
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: ML Infrastructure
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Model Management
 *    - Deploy models (upload artifact, specify framework: TensorFlow/PyTorch/XGBoost)
 *    - Version models (v1, v2, v3)
 *    - Rollback to previous version
 *    - Delete old models (garbage collection)
 *
 * 2. Inference Serving
 *    - Real-time predictions (<50ms p99 latency)
 *    - Batch inference (process 1000s of requests together)
 *    - Multiple model frameworks (TensorFlow, PyTorch, Scikit-learn)
 *    - GPU acceleration (optional, for large models)
 *
 * 3. Traffic Management
 *    - Canary deployments (route 5% traffic to new version)
 *    - A/B testing (split traffic between v1 and v2)
 *    - Shadow mode (send traffic to new version, don't return predictions)
 *    - Blue-green deployments (instant switchover)
 *
 * 4. Monitoring & Observability
 *    - Inference latency (p50, p99, p999)
 *    - Prediction accuracy (if ground truth available)
 *    - Model drift detection (feature distribution changes)
 *    - Error rate (model crashes, invalid inputs)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Inference latency: p99 <50ms (real-time models)
 * - Throughput: 10,000 predictions/second per model
 * - Batch inference: 1M predictions in <5 minutes
 * - Model load time: <30 seconds (critical for autoscaling)
 *
 * Scalability (NFR-S):
 * - 1,000 models deployed concurrently
 * - 100 versions per model (10 active, 90 archived)
 * - 1 billion predictions/day across all models
 * - Autoscale: 1→100 replicas based on traffic
 *
 * Reliability (NFR-R):
 * - Availability: 99.95% (critical for production ML)
 * - Canary rollback: <60 seconds if error rate spikes
 * - Model fallback: Serve cached predictions if model crashes
 * - Zero-downtime deployments
 *
 * Cost (NFR-C):
 * - Infrastructure: $50K/month (K8s, GPUs, storage)
 * - Model storage: $5K/month (S3 for artifacts)
 * - Autoscaling: 50% cost savings (scale down during low traffic)
 */

const pythonTemplate = `"""
Model Serving Platform - Reference Implementation

Architecture:
1. Model Registry (store model artifacts in S3/GCS)
2. Inference Servers (TensorFlow Serving, TorchServe, or custom)
3. Traffic Router (canary, A/B, shadow mode)
4. Monitoring (latency, accuracy, drift detection)

Key concepts:
- Batching: Combine multiple requests to increase GPU throughput
- Model warming: Pre-load models into memory for fast inference
- Canary deployment: Gradually route traffic to new version
- Model versioning: Semantic versioning (major.minor.patch)
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import time
import hashlib

def deploy_model(model_config: dict, model_artifact: bytes, context: dict) -> dict:
    """
    Deploy a new model version to the serving platform.

    Args:
        model_config: {
            'model_name': 'fraud_detection',
            'version': 'v2.1.0',
            'framework': 'tensorflow',  # tensorflow, pytorch, sklearn, xgboost
            'runtime': 'python3.9',
            'hardware': 'cpu',  # cpu, gpu
            'min_replicas': 2,
            'max_replicas': 10,
            'resources': {
                'cpu': '2 cores',
                'memory': '4GB',
                'gpu': 0
            },
            'batch_size': 32,  # For batch inference
            'timeout_ms': 100
        }
        model_artifact: Binary model file (*.pb, *.pth, *.pkl)
        context: {
            'db': Database connection,
            's3': S3 client,
            'k8s': Kubernetes client,
            'redis': Cache
        }

    Returns:
        {
            'model_id': 'fraud_detection:v2.1.0',
            'artifact_url': 's3://models/fraud_detection/v2.1.0/model.pb',
            'status': 'deploying',
            'estimated_ready_seconds': 25
        }

    Test cases covered:
    - TC1: Deploy new model version
    - TC4: Model load time <30s
    """
    model_name = model_config['model_name']
    version = model_config['version']
    model_id = f"{model_name}:{version}"

    # Upload model artifact to S3
    artifact_hash = hashlib.sha256(model_artifact).hexdigest()
    artifact_path = f"{model_name}/{version}/model.{model_config['framework']}"

    context['s3'].upload(
        bucket='ml-models',
        key=artifact_path,
        data=model_artifact,
        metadata={'hash': artifact_hash}
    )

    artifact_url = f"s3://ml-models/{artifact_path}"

    # Create model record in database
    context['db'].execute("""
        INSERT INTO models
        (id, name, version, framework, artifact_url, artifact_hash,
         runtime, hardware, min_replicas, max_replicas, resources,
         batch_size, timeout_ms, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        model_id, model_name, version, model_config['framework'],
        artifact_url, artifact_hash, model_config['runtime'],
        model_config['hardware'], model_config['min_replicas'],
        model_config['max_replicas'], model_config['resources'],
        model_config['batch_size'], model_config['timeout_ms'],
        'deploying', datetime.now()
    )

    # Deploy to Kubernetes (create Deployment + Service)
    k8s_deployment = create_k8s_deployment(model_id, model_config, artifact_url, context)

    # Wait for model to be ready (async, typically takes ~25 seconds)
    context['scheduler'].schedule_once(
        function=wait_for_model_ready,
        args={'model_id': model_id},
        delay_seconds=30
    )

    return {
        'model_id': model_id,
        'artifact_url': artifact_url,
        'artifact_hash': artifact_hash,
        'status': 'deploying',
        'k8s_deployment': k8s_deployment['name'],
        'estimated_ready_seconds': 25
    }


def create_k8s_deployment(model_id: str, model_config: dict, artifact_url: str, context: dict) -> dict:
    """
    Create Kubernetes Deployment for model serving.

    Uses TensorFlow Serving, TorchServe, or custom inference server.

    Args:
        model_id: 'fraud_detection:v2.1.0'
        model_config: Model configuration
        artifact_url: S3 URL to model artifact
        context: Runtime context

    Returns:
        {'name': 'fraud-detection-v2-1-0', 'replicas': 2}
    """
    deployment_name = model_id.replace(':', '-').replace('.', '-')

    # Choose inference server based on framework
    if model_config['framework'] == 'tensorflow':
        container_image = 'tensorflow/serving:2.13.0'
        args = [
            '--model_base_path=/models',
            '--rest_api_port=8501',
            '--model_name=' + model_config['model_name']
        ]
    elif model_config['framework'] == 'pytorch':
        container_image = 'pytorch/torchserve:latest'
        args = ['--model-store=/models']
    elif model_config['framework'] in ['sklearn', 'xgboost']:
        container_image = 'custom-ml-server:v1'
        args = ['--model-path=/models/model.pkl']

    # Create Kubernetes Deployment
    deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {'name': deployment_name},
        'spec': {
            'replicas': model_config['min_replicas'],
            'selector': {'matchLabels': {'model': deployment_name}},
            'template': {
                'metadata': {'labels': {'model': deployment_name}},
                'spec': {
                    'containers': [{
                        'name': 'inference',
                        'image': container_image,
                        'args': args,
                        'ports': [{'containerPort': 8501}],
                        'resources': {
                            'requests': {
                                'cpu': model_config['resources']['cpu'],
                                'memory': model_config['resources']['memory']
                            },
                            'limits': {
                                'cpu': model_config['resources']['cpu'],
                                'memory': model_config['resources']['memory']
                            }
                        },
                        'env': [
                            {'name': 'MODEL_URL', 'value': artifact_url},
                            {'name': 'BATCH_SIZE', 'value': str(model_config['batch_size'])}
                        ],
                        'volumeMounts': [{
                            'name': 'model-storage',
                            'mountPath': '/models'
                        }]
                    }],
                    'volumes': [{
                        'name': 'model-storage',
                        'emptyDir': {}
                    }],
                    'initContainers': [{
                        # Download model from S3 before starting server
                        'name': 'model-downloader',
                        'image': 'amazon/aws-cli:latest',
                        'command': ['aws', 's3', 'cp', artifact_url, '/models/'],
                        'volumeMounts': [{
                            'name': 'model-storage',
                            'mountPath': '/models'
                        }]
                    }]
                }
            }
        }
    }

    context['k8s'].create_deployment(deployment)

    # Create Kubernetes Service for routing
    service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {'name': deployment_name},
        'spec': {
            'selector': {'model': deployment_name},
            'ports': [{'port': 8501, 'targetPort': 8501}],
            'type': 'ClusterIP'
        }
    }

    context['k8s'].create_service(service)

    return {
        'name': deployment_name,
        'replicas': model_config['min_replicas'],
        'service_url': f"http://{deployment_name}:8501"
    }


def predict(model_id: str, features: dict, context: dict) -> dict:
    """
    Make real-time prediction using deployed model.

    Args:
        model_id: 'fraud_detection:v2.1.0'
        features: {'transaction_amount': 150.0, 'merchant_id': 'M123', ...}
        context: Runtime context

    Returns:
        {
            'prediction': {'fraud_probability': 0.85, 'is_fraud': True},
            'model_id': 'fraud_detection:v2.1.0',
            'latency_ms': 23,
            'cached': False
        }

    Test cases covered:
    - TC2: Real-time inference <50ms p99
    - TC5: Batch inference with dynamic batching
    """
    start_time = time.time()

    # Get model metadata
    model = context['db'].query(
        "SELECT * FROM models WHERE id = ?",
        model_id
    )[0]

    if model['status'] != 'ready':
        raise ValueError(f"Model {model_id} is not ready (status: {model['status']})")

    # Check cache for frequently requested features (optional)
    cache_key = f"pred:{model_id}:{hashlib.md5(str(features).encode()).hexdigest()}"
    cached_prediction = context['redis'].get(cache_key)

    if cached_prediction:
        return {
            'prediction': cached_prediction,
            'model_id': model_id,
            'latency_ms': (time.time() - start_time) * 1000,
            'cached': True
        }

    # Route to model server
    service_url = context['k8s'].get_service_url(model_id.replace(':', '-').replace('.', '-'))

    # Make HTTP request to inference server
    response = context['http'].post(
        url=f"{service_url}/v1/models/{model['name']}:predict",
        json={'instances': [features]},
        timeout=model['timeout_ms'] / 1000
    )

    prediction = response['predictions'][0]

    # Cache prediction (TTL: 5 minutes)
    context['redis'].setex(cache_key, 300, prediction)

    # Record inference metrics
    latency_ms = (time.time() - start_time) * 1000

    context['metrics'].record(
        metric='inference_latency_ms',
        value=latency_ms,
        tags={'model': model['name'], 'version': model['version']}
    )

    return {
        'prediction': prediction,
        'model_id': model_id,
        'latency_ms': latency_ms,
        'cached': False
    }


def canary_deployment(model_id: str, canary_percentage: int, context: dict) -> dict:
    """
    Gradually route traffic to new model version (canary deployment).

    Traffic routing:
    - 95% → current version (v1.0.0)
    - 5%  → canary version (v2.0.0)

    If error rate or latency degrades, automatic rollback.

    Args:
        model_id: 'fraud_detection:v2.0.0' (canary version)
        canary_percentage: 5 (5% of traffic)
        context: Runtime context

    Returns:
        {
            'canary_id': 'canary_123',
            'model_id': 'fraud_detection:v2.0.0',
            'baseline_model_id': 'fraud_detection:v1.0.0',
            'traffic_percentage': 5,
            'status': 'active',
            'monitoring': {...}
        }

    Test cases covered:
    - TC3: Canary deployment with 5% traffic
    - TC6: Automatic rollback on error spike
    """
    # Get model info
    model = context['db'].query("SELECT * FROM models WHERE id = ?", model_id)[0]

    # Find current production version (baseline)
    baseline_model = context['db'].query("""
        SELECT * FROM models
        WHERE name = ? AND status = 'production'
        ORDER BY created_at DESC LIMIT 1
    """, model['name'])[0]

    # Create canary record
    canary_id = f"canary_{int(time.time() * 1000)}"

    context['db'].execute("""
        INSERT INTO canaries
        (id, model_id, baseline_model_id, traffic_percentage,
         status, created_at, rollback_conditions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """,
        canary_id,
        model_id,
        baseline_model['id'],
        canary_percentage,
        'active',
        datetime.now(),
        {
            'max_error_rate_delta': 2.0,  # 2% increase over baseline
            'max_latency_p99_delta_ms': 20  # 20ms increase
        }
    )

    # Update traffic routing rules (using K8s Ingress or Istio)
    update_traffic_routing(
        model_name=model['name'],
        versions=[
            {'version': baseline_model['version'], 'weight': 100 - canary_percentage},
            {'version': model['version'], 'weight': canary_percentage}
        ],
        context=context
    )

    # Start monitoring for automatic rollback
    context['scheduler'].schedule_recurring(
        function=monitor_canary,
        args={'canary_id': canary_id},
        interval_seconds=30,
        duration_seconds=3600  # Monitor for 1 hour
    )

    return {
        'canary_id': canary_id,
        'model_id': model_id,
        'baseline_model_id': baseline_model['id'],
        'traffic_percentage': canary_percentage,
        'status': 'active',
        'monitoring': {
            'check_interval_seconds': 30,
            'rollback_conditions': {
                'max_error_rate_delta': 2.0,
                'max_latency_p99_delta_ms': 20
            }
        }
    }


def update_traffic_routing(model_name: str, versions: List[dict], context: dict):
    """
    Update traffic routing weights using Istio VirtualService.

    Args:
        model_name: 'fraud_detection'
        versions: [
            {'version': 'v1.0.0', 'weight': 95},
            {'version': 'v2.0.0', 'weight': 5}
        ]
        context: Runtime context
    """
    virtual_service = {
        'apiVersion': 'networking.istio.io/v1beta1',
        'kind': 'VirtualService',
        'metadata': {'name': f"{model_name}-routing"},
        'spec': {
            'hosts': [f"{model_name}.default.svc.cluster.local"],
            'http': [{
                'route': [
                    {
                        'destination': {
                            'host': f"{model_name}-{v['version'].replace('.', '-')}",
                            'port': {'number': 8501}
                        },
                        'weight': v['weight']
                    }
                    for v in versions
                ]
            }]
        }
    }

    context['k8s'].apply(virtual_service)


def monitor_canary(canary_id: str, context: dict) -> dict:
    """
    Monitor canary deployment and trigger rollback if metrics degrade.

    Called every 30 seconds.

    Args:
        canary_id: Canary to monitor
        context: Runtime context

    Returns:
        {'should_rollback': True/False, 'reason': '...'}

    Test cases covered:
    - TC6: Automatic rollback on error spike
    """
    canary = context['db'].query(
        "SELECT * FROM canaries WHERE id = ?",
        canary_id
    )[0]

    if canary['status'] != 'active':
        return {'should_rollback': False, 'reason': 'canary not active'}

    # Get metrics for both versions (last 5 minutes)
    baseline_metrics = context['metrics'].query(
        model_id=canary['baseline_model_id'],
        metrics=['error_rate', 'p99_latency_ms'],
        lookback_minutes=5
    )

    canary_metrics = context['metrics'].query(
        model_id=canary['model_id'],
        metrics=['error_rate', 'p99_latency_ms'],
        lookback_minutes=5
    )

    rollback_conditions = canary['rollback_conditions']

    # Check error rate delta
    error_rate_delta = canary_metrics['error_rate'] - baseline_metrics['error_rate']
    if error_rate_delta > rollback_conditions['max_error_rate_delta']:
        rollback_canary(canary_id, context, reason='error_rate_spike', details={
            'baseline': baseline_metrics['error_rate'],
            'canary': canary_metrics['error_rate'],
            'delta': error_rate_delta
        })
        return {
            'should_rollback': True,
            'reason': f"Error rate spike: {error_rate_delta:.2f}% (threshold: {rollback_conditions['max_error_rate_delta']}%)"
        }

    # Check latency delta
    latency_delta_ms = canary_metrics['p99_latency_ms'] - baseline_metrics['p99_latency_ms']
    if latency_delta_ms > rollback_conditions['max_latency_p99_delta_ms']:
        rollback_canary(canary_id, context, reason='latency_degradation', details={
            'baseline_p99_ms': baseline_metrics['p99_latency_ms'],
            'canary_p99_ms': canary_metrics['p99_latency_ms'],
            'delta_ms': latency_delta_ms
        })
        return {
            'should_rollback': True,
            'reason': f"Latency degradation: +{latency_delta_ms:.0f}ms (threshold: {rollback_conditions['max_latency_p99_delta_ms']}ms)"
        }

    return {'should_rollback': False}


def rollback_canary(canary_id: str, context: dict, reason: str, details: dict) -> dict:
    """
    Rollback canary deployment to baseline version.

    Must complete in <60 seconds (NFR-R).

    Args:
        canary_id: Canary to rollback
        context: Runtime context
        reason: 'error_rate_spike', 'latency_degradation', 'manual'
        details: Additional context

    Returns:
        {'canary_id': '...', 'status': 'rolled_back', 'rollback_duration_seconds': 12}
    """
    start_time = time.time()

    canary = context['db'].query("SELECT * FROM canaries WHERE id = ?", canary_id)[0]

    # Get model names
    canary_model = context['db'].query("SELECT * FROM models WHERE id = ?", canary['model_id'])[0]
    baseline_model = context['db'].query("SELECT * FROM models WHERE id = ?", canary['baseline_model_id'])[0]

    # Route 100% traffic back to baseline
    update_traffic_routing(
        model_name=canary_model['name'],
        versions=[
            {'version': baseline_model['version'], 'weight': 100}
        ],
        context=context
    )

    # Update canary status
    context['db'].execute("""
        UPDATE canaries
        SET status = ?, rolled_back_at = ?, rollback_reason = ?, rollback_details = ?
        WHERE id = ?
    """, 'rolled_back', datetime.now(), reason, details, canary_id)

    # Stop monitoring
    context['scheduler'].cancel_job(f"monitor_canary_{canary_id}")

    rollback_duration = time.time() - start_time

    return {
        'canary_id': canary_id,
        'status': 'rolled_back',
        'reason': reason,
        'rollback_duration_seconds': rollback_duration
    }


def batch_predict(model_id: str, features_batch: List[dict], context: dict) -> dict:
    """
    Make batch predictions (1000s of requests together).

    Uses dynamic batching for GPU throughput optimization.

    Args:
        model_id: 'fraud_detection:v2.1.0'
        features_batch: [
            {'transaction_amount': 150.0, ...},
            {'transaction_amount': 75.0, ...},
            ...  # 1000 items
        ]
        context: Runtime context

    Returns:
        {
            'predictions': [...],  # 1000 predictions
            'total_latency_ms': 450,
            'avg_latency_per_item_ms': 0.45
        }

    Test cases covered:
    - TC5: Batch inference <5 minutes for 1M predictions
    """
    start_time = time.time()

    model = context['db'].query("SELECT * FROM models WHERE id = ?", model_id)[0]

    # Split into batches based on model's batch_size
    batch_size = model['batch_size']
    predictions = []

    service_url = context['k8s'].get_service_url(model_id.replace(':', '-').replace('.', '-'))

    # Process in batches
    for i in range(0, len(features_batch), batch_size):
        batch = features_batch[i:i + batch_size]

        response = context['http'].post(
            url=f"{service_url}/v1/models/{model['name']}:predict",
            json={'instances': batch},
            timeout=30  # Longer timeout for batches
        )

        predictions.extend(response['predictions'])

    total_latency_ms = (time.time() - start_time) * 1000
    avg_latency_per_item = total_latency_ms / len(features_batch)

    return {
        'predictions': predictions,
        'count': len(predictions),
        'total_latency_ms': total_latency_ms,
        'avg_latency_per_item_ms': avg_latency_per_item
    }


# Example usage
if __name__ == "__main__":
    context = {
        'db': MockDatabase(),
        's3': MockS3(),
        'k8s': MockKubernetes(),
        'redis': MockRedis(),
        'http': MockHTTP(),
        'metrics': MockMetrics(),
        'scheduler': MockScheduler()
    }

    # Deploy new model
    with open('fraud_model_v2.pb', 'rb') as f:
        model_artifact = f.read()

    deployment = deploy_model({
        'model_name': 'fraud_detection',
        'version': 'v2.1.0',
        'framework': 'tensorflow',
        'runtime': 'python3.9',
        'hardware': 'cpu',
        'min_replicas': 2,
        'max_replicas': 10,
        'resources': {'cpu': '2 cores', 'memory': '4GB', 'gpu': 0},
        'batch_size': 32,
        'timeout_ms': 100
    }, model_artifact, context)

    print(f"Deployed: {deployment['model_id']}")

    # Make prediction
    prediction = predict('fraud_detection:v2.1.0', {
        'transaction_amount': 150.0,
        'merchant_id': 'M123'
    }, context)

    print(f"Prediction: {prediction['prediction']}")
    print(f"Latency: {prediction['latency_ms']:.1f}ms")

    # Canary deployment
    canary = canary_deployment('fraud_detection:v2.1.0', canary_percentage=5, context=context)
    print(f"Canary: {canary['traffic_percentage']}% to {canary['model_id']}")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Deploy new model version and verify deployment',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Load model artifact
model_artifact = b'<binary model data>'  # Simulated TensorFlow model

# Deploy model
deployment = deploy_model({
    'model_name': 'fraud_detection',
    'version': 'v1.0.0',
    'framework': 'tensorflow',
    'runtime': 'python3.9',
    'hardware': 'cpu',
    'min_replicas': 2,
    'max_replicas': 10,
    'resources': {'cpu': '2 cores', 'memory': '4GB', 'gpu': 0},
    'batch_size': 32,
    'timeout_ms': 100
}, model_artifact, context)

print(deployment['model_id'])
print(deployment['status'])
print('s3://' in deployment['artifact_url'])`,
    expectedOutput: `fraud_detection:v1.0.0
deploying
True`,
    hints: [
      'Upload model artifact to S3 with hash for integrity verification',
      'Create database record with model metadata',
      'Deploy Kubernetes Deployment + Service for inference server',
      'Use init container to download model from S3 before starting server',
      'Return "deploying" status (async readiness check)'
    ],
    testCode: `assert deployment['model_id'] == 'fraud_detection:v1.0.0'
assert deployment['status'] == 'deploying'
assert 's3://' in deployment['artifact_url']`,
    timeComplexity: 'O(1) for metadata creation, O(M) for model upload where M = model size',
    spaceComplexity: 'O(M) for model storage',
    learningObjectives: [
      'Design model artifact storage (S3/GCS)',
      'Understand K8s deployment for ML models',
      'Learn model serving server selection (TF Serving, TorchServe)'
    ]
  },
  {
    id: 2,
    name: 'Real-time inference with <50ms p99 latency (NFR-P)',
    difficulty: 'hard',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Deploy model first
deploy_model({...}, model_artifact, context)

# Mark as ready
context['db'].execute("UPDATE models SET status = ? WHERE id = ?", 'ready', 'fraud_detection:v1.0.0')

# Make 1000 predictions and measure latency
latencies = []
for i in range(1000):
    result = predict('fraud_detection:v1.0.0', {
        'transaction_amount': 150.0 + i,
        'merchant_id': f'M{i}'
    }, context)
    latencies.append(result['latency_ms'])

# Calculate p99 latency
latencies.sort()
p99_latency = latencies[int(0.99 * len(latencies))]

print(f"p99 latency: {p99_latency:.1f}ms")
print(p99_latency < 50)  # Must be <50ms`,
    expectedOutput: `p99 latency: 42.3ms
True`,
    hints: [
      'Use in-memory model serving (no disk I/O during inference)',
      'Implement prediction caching for frequently requested features',
      'Optimize network latency (keep model servers close to API)',
      'Use HTTP keep-alive to avoid TCP handshake overhead',
      'Monitor and record inference latency for every request'
    ],
    testCode: `assert p99_latency < 50  # NFR-P requirement`,
    timeComplexity: 'O(F) where F = inference time (model-dependent)',
    spaceComplexity: 'O(1) per request',
    learningObjectives: [
      'Optimize ML inference for low latency',
      'Understand prediction caching strategies',
      'Learn to meet strict latency SLOs'
    ]
  },
  {
    id: 3,
    name: 'Canary deployment with 5% traffic split',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

# Deploy baseline model (v1.0.0) and mark as production
deploy_model({...}, model_v1, context)
context['db'].execute("UPDATE models SET status = ? WHERE id = ?", 'production', 'fraud_detection:v1.0.0')

# Deploy new version (v2.0.0)
deploy_model({...}, model_v2, context)
context['db'].execute("UPDATE models SET status = ? WHERE id = ?", 'ready', 'fraud_detection:v2.0.0')

# Start canary deployment (5% traffic to v2.0.0)
canary = canary_deployment('fraud_detection:v2.0.0', canary_percentage=5, context=context)

print(canary['traffic_percentage'])
print(canary['baseline_model_id'])
print(canary['status'])
print(canary['monitoring']['check_interval_seconds'])`,
    expectedOutput: `5
fraud_detection:v1.0.0
active
30`,
    hints: [
      'Find current production version as baseline',
      'Create canary record with traffic percentage',
      'Update traffic routing (Istio VirtualService or K8s Ingress)',
      'Start monitoring thread to check metrics every 30s',
      'Define rollback conditions (error rate, latency thresholds)'
    ],
    testCode: `assert canary['traffic_percentage'] == 5
assert canary['baseline_model_id'] == 'fraud_detection:v1.0.0'
assert canary['status'] == 'active'`,
    timeComplexity: 'O(1) for canary setup',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement canary deployment for ML models',
      'Understand traffic routing with Istio/Ingress',
      'Learn gradual rollout strategies'
    ]
  },
  {
    id: 4,
    name: 'Model load time <30 seconds (NFR-P)',
    difficulty: 'medium',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Deploy large model (500MB)
large_model_artifact = b'<500MB model>'

import time
start = time.time()

deployment = deploy_model({
    'model_name': 'image_classifier',
    'version': 'v1.0.0',
    'framework': 'pytorch',
    'runtime': 'python3.9',
    'hardware': 'gpu',
    'min_replicas': 1,
    'max_replicas': 5,
    'resources': {'cpu': '4 cores', 'memory': '16GB', 'gpu': 1},
    'batch_size': 64,
    'timeout_ms': 200
}, large_model_artifact, context)

# Simulate model loading (S3 download + model initialization)
# In production, this is done by K8s init container + inference server startup
context['scheduler'].run_pending_jobs()  # Trigger wait_for_model_ready

load_duration = time.time() - start

print(f"Model loaded in {load_duration:.1f}s")
print(load_duration < 30)  # Must be <30s for autoscaling`,
    expectedOutput: `Model loaded in 25.3s
True`,
    hints: [
      'Use parallel S3 download (multipart) for large models',
      'Pre-warm model in memory (load into GPU)',
      'Use SSD for fast disk I/O',
      'Optimize model format (use SavedModel/TorchScript, not checkpoints)',
      'Critical for autoscaling: new pods must be ready quickly'
    ],
    testCode: `assert load_duration < 30  # NFR-P requirement`,
    timeComplexity: 'O(M) where M = model size',
    spaceComplexity: 'O(M)',
    learningObjectives: [
      'Optimize model loading for fast autoscaling',
      'Understand init container pattern for model download',
      'Learn GPU memory management'
    ]
  },
  {
    id: 5,
    name: 'Batch inference: 1M predictions in <5 minutes (NFR-P)',
    difficulty: 'hard',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Deploy model
deploy_model({
    'model_name': 'recommendation',
    'version': 'v1.0.0',
    'framework': 'tensorflow',
    'runtime': 'python3.9',
    'hardware': 'gpu',
    'min_replicas': 5,  # Scale up for batch job
    'max_replicas': 20,
    'resources': {'cpu': '4 cores', 'memory': '8GB', 'gpu': 1},
    'batch_size': 256,  # Large batch for GPU throughput
    'timeout_ms': 500
}, model_artifact, context)

context['db'].execute("UPDATE models SET status = ? WHERE id = ?", 'ready', 'recommendation:v1.0.0')

# Generate 1M features
features_batch = [
    {'user_id': f'U{i}', 'item_id': f'I{i % 1000}'}
    for i in range(1_000_000)
]

import time
start = time.time()

# Batch predict (will split into batches of 256)
result = batch_predict('recommendation:v1.0.0', features_batch, context)

duration_seconds = time.time() - start
duration_minutes = duration_seconds / 60

print(f"Processed {result['count']} predictions in {duration_minutes:.2f} minutes")
print(duration_minutes < 5)  # Must be <5 minutes`,
    expectedOutput: `Processed 1000000 predictions in 3.42 minutes
True`,
    hints: [
      'Use large batch sizes (256-512) for GPU throughput',
      'Parallelize across multiple replicas (5-20 pods)',
      'Use dynamic batching: combine requests that arrive within 10ms window',
      'Optimize model for batch inference (fused ops, TensorRT)',
      'Monitor GPU utilization (should be >80%)'
    ],
    testCode: `assert result['count'] == 1_000_000
assert duration_minutes < 5  # NFR-P requirement`,
    timeComplexity: 'O(N/B) where N = predictions, B = batch size',
    spaceComplexity: 'O(B) for batch buffer',
    learningObjectives: [
      'Design batch inference for high throughput',
      'Understand GPU optimization (batch size, parallelism)',
      'Learn to scale model serving horizontally'
    ]
  },
  {
    id: 6,
    name: 'Automatic rollback on error spike (NFR-R: <60s rollback)',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `context = setup_mock_context()

# Setup canary deployment
deploy_model({...}, model_v1, context)
context['db'].execute("UPDATE models SET status = ? WHERE id = ?", 'production', 'fraud_detection:v1.0.0')

deploy_model({...}, model_v2, context)
context['db'].execute("UPDATE models SET status = ? WHERE id = ?", 'ready', 'fraud_detection:v2.0.0')

canary = canary_deployment('fraud_detection:v2.0.0', canary_percentage=10, context=context)

# Simulate baseline metrics (v1.0.0)
context['metrics'].set_metric('fraud_detection:v1.0.0', 'error_rate', 0.5)
context['metrics'].set_metric('fraud_detection:v1.0.0', 'p99_latency_ms', 35)

# Simulate canary metrics (v2.0.0 has errors!)
context['metrics'].set_metric('fraud_detection:v2.0.0', 'error_rate', 4.8)  # +4.3% delta (exceeds 2% threshold)
context['metrics'].set_metric('fraud_detection:v2.0.0', 'p99_latency_ms', 40)

# Trigger monitoring check
import time
start = time.time()
rollback_check = monitor_canary(canary['canary_id'], context)
rollback_duration = time.time() - start

print(rollback_check['should_rollback'])
print('Error rate spike' in rollback_check['reason'])
print(rollback_duration < 60)  # Rollback must complete in <60s`,
    expectedOutput: `True
True
True`,
    hints: [
      'Monitor metrics every 30 seconds during canary',
      'Compare canary metrics vs baseline (delta, not absolute)',
      'Trigger rollback if error rate delta >2% or latency delta >20ms',
      'Rollback by routing 100% traffic to baseline version',
      'Must complete in <60 seconds (NFR-R)'
    ],
    testCode: `assert rollback_check['should_rollback'] == True
assert 'error rate spike' in rollback_check['reason'].lower()
assert rollback_duration < 60`,
    timeComplexity: 'O(1) for rollback check',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement automated rollback for safe deployments',
      'Understand metric-based health checks',
      'Learn to protect production from bad model versions'
    ]
  },
  {
    id: 7,
    name: 'Scale: 1000 models deployed concurrently (NFR-S)',
    difficulty: 'hard',
    category: 'NFR-S',
    input: `context = setup_mock_context()

# Deploy 1000 different models
models = []
for i in range(1000):
    deployment = deploy_model({
        'model_name': f'model_{i}',
        'version': 'v1.0.0',
        'framework': 'sklearn',
        'runtime': 'python3.9',
        'hardware': 'cpu',
        'min_replicas': 1,
        'max_replicas': 5,
        'resources': {'cpu': '1 core', 'memory': '2GB', 'gpu': 0},
        'batch_size': 16,
        'timeout_ms': 50
    }, model_artifact, context)
    models.append(deployment['model_id'])

# Verify all deployed
deployed_count = context['db'].query(
    "SELECT COUNT(*) as count FROM models WHERE status IN ('deploying', 'ready')"
)[0]['count']

print(f"Deployed {deployed_count} models")
print(deployed_count == 1000)`,
    expectedOutput: `Deployed 1000 models
True`,
    hints: [
      'Use database connection pooling for concurrent writes',
      'Use S3 multipart upload for parallel model uploads',
      'Use K8s batch API to create deployments in parallel',
      'Implement model registry cache (Redis) for metadata lookups',
      'Shard model servers across multiple K8s namespaces'
    ],
    testCode: `assert deployed_count == 1000`,
    timeComplexity: 'O(N) where N = number of models',
    spaceComplexity: 'O(N * M) where M = average model size',
    learningObjectives: [
      'Scale model serving to 1000s of models',
      'Optimize infrastructure for multi-tenancy',
      'Learn resource isolation and quotas'
    ]
  }
];

export const modelServingPlatformChallenge: SystemDesignChallenge = {
  id: 'model_serving_platform',
  title: 'Model Serving Platform',
  difficulty: 'advanced',
  category: 'ML Infrastructure',
  description: `Design a platform for deploying and serving machine learning models with low latency, high throughput, and safe rollout strategies. Similar to TensorFlow Serving, TorchServe, or custom solutions at Uber/Airbnb.

**Real-world Context:**
- TensorFlow Serving: Google's production ML serving system
- Uber Michelangelo: End-to-end ML platform with model deployment and serving
- Airbnb Bighead: Model training and serving infrastructure
- Meta FBLearner: Facebook's ML serving platform

**Key Concepts:**
- Model versioning: Deploy multiple versions, gradual rollout (v1 → v2)
- Inference optimization: Batching, GPU utilization, caching
- Canary deployment: Route 5% traffic to new version, automatic rollback if metrics degrade
- Traffic management: A/B testing, shadow mode, blue-green deployments
- Monitoring: Latency (p99 <50ms), error rate, model drift

**Scale:**
- 1,000 models deployed concurrently
- 10,000 predictions/second per model
- Batch inference: 1M predictions in <5 minutes
- Autoscale: 1→100 replicas based on traffic

**Companies:** Google, Uber, Airbnb, Meta, Amazon
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Store model artifacts in S3/GCS with hash-based integrity verification',
    'Use K8s Deployments with init containers to download models',
    'Choose inference server based on framework (TF Serving, TorchServe, custom)',
    'Implement canary deployments with Istio VirtualService for traffic routing',
    'Use large batch sizes (256-512) for GPU throughput optimization',
    'Monitor canary metrics vs baseline (delta, not absolute values)',
    'Implement prediction caching for frequently requested features',
    'Ensure model load time <30s for fast autoscaling (NFR-P)'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Uber: Michelangelo platform serves fraud detection, ETA prediction, pricing models',
    'Airbnb: Bighead serves search ranking, pricing, and recommendation models',
    'Meta: FBLearner serves newsfeed ranking, ad targeting, content moderation',
    'Netflix: Model serving for recommendation, video quality, thumbnails',
    'Google: TF Serving for search ranking, ads, YouTube recommendations'
  ],
  relatedChallenges: [
    'feature_store',
    'etl_orchestration',
    'chaos_engineering_platform',
    'distributed_tracing'
  ]
};
