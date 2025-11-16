/**
 * L4-L5 Internal Systems: Service Mesh Control Plane
 *
 * Design a control plane for service mesh that manages service discovery,
 * load balancing, circuit breaking, and traffic routing across thousands of microservices.
 * Similar to Istio, Linkerd, or Envoy control plane.
 *
 * Real-world examples:
 * - Istio: Google/IBM/Lyft service mesh with Envoy proxies
 * - Linkerd: CNCF service mesh for Kubernetes
 * - AWS App Mesh: Managed service mesh for AWS services
 * - Consul Connect: HashiCorp's service mesh
 *
 * Companies: Google, Lyft, Uber, Airbnb, Netflix
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Developer Tools & Platforms
 */

import type { SystemDesignChallenge, TestCase } from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Service Discovery
 *    - Register services (name, version, endpoints)
 *    - Health checks (HTTP/gRPC probes every 10 seconds)
 *    - Automatic deregistration of unhealthy instances
 *    - DNS-based discovery (service.namespace.svc.cluster.local)
 *
 * 2. Load Balancing
 *    - Algorithms: Round robin, least connections, weighted random
 *    - Zone-aware routing (prefer same-zone instances)
 *    - Session affinity (sticky sessions based on headers)
 *    - Gradual traffic shifting (canary: 10% → 100%)
 *
 * 3. Circuit Breaking
 *    - Failure detection (error rate >50%, latency p99 >1s)
 *    - Circuit states: Closed → Open → Half-Open
 *    - Automatic recovery (test every 30 seconds in half-open)
 *    - Per-destination circuit breakers
 *
 * 4. Traffic Management
 *    - Request routing (header-based, path-based)
 *    - Retries with exponential backoff (max 3 retries)
 *    - Timeouts (request, connection, idle)
 *    - Rate limiting (per-client, per-service)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Config propagation: <10 seconds (control plane → data plane)
 * - Health check overhead: <1% CPU per service
 * - Discovery query: <5ms p99
 * - Support 10,000 services with 100 instances each
 *
 * Scalability (NFR-S):
 * - 10,000 microservices
 * - 1M service instances (pods/containers)
 * - 100K config updates/day
 * - 1B RPS across all services
 *
 * Reliability (NFR-R):
 * - Control plane availability: 99.99%
 * - Graceful degradation (cache stale config if control plane down)
 * - No single point of failure (multi-region control plane)
 * - Config rollback: <60 seconds
 *
 * Cost (NFR-C):
 * - Infrastructure: $30K/month (control plane, etcd, monitoring)
 * - Proxy overhead: <5% latency increase, <10% CPU overhead
 * - Storage: $2K/month (config, metrics, logs)
 */

const pythonTemplate = `"""
Service Mesh Control Plane - Reference Implementation

Architecture:
1. Service Registry (etcd/Consul for service metadata)
2. Health Checker (active probing of service instances)
3. Config Manager (push config to Envoy proxies)
4. Circuit Breaker (track failures, open/close circuits)

Key concepts:
- xDS protocol: Envoy's discovery service (LDS, RDS, CDS, EDS)
- Health checking: Active (probe endpoints) + Passive (monitor traffic)
- Circuit breaker: Prevent cascading failures
- Zone-aware routing: Minimize cross-AZ latency
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import time
import hashlib

def register_service(service_config: dict, context: dict) -> dict:
    """
    Register a service with the mesh.

    Args:
        service_config: {
            'name': 'payment-service',
            'namespace': 'prod',
            'version': 'v2.1.0',
            'instances': [
                {'ip': '10.0.1.5', 'port': 8080, 'zone': 'us-east-1a'},
                {'ip': '10.0.1.6', 'port': 8080, 'zone': 'us-east-1b'}
            ],
            'health_check': {
                'path': '/health',
                'interval_seconds': 10,
                'timeout_seconds': 2,
                'healthy_threshold': 2,
                'unhealthy_threshold': 3
            }
        }
        context: {
            'etcd': etcd client,
            'db': Database,
            'redis': Cache
        }

    Returns:
        {
            'service_id': 'payment-service.prod',
            'instances_registered': 2,
            'dns': 'payment-service.prod.svc.cluster.local'
        }

    Test cases covered:
    - TC1: Register service with multiple instances
    - TC5: Zone-aware routing
    """
    service_name = service_config['name']
    namespace = service_config['namespace']
    service_id = f"{service_name}.{namespace}"

    # Store service metadata in etcd
    service_key = f"/services/{namespace}/{service_name}"

    context['etcd'].put(service_key, {
        'name': service_name,
        'namespace': namespace,
        'version': service_config['version'],
        'health_check': service_config['health_check'],
        'created_at': datetime.now().isoformat()
    })

    # Register each instance
    for idx, instance in enumerate(service_config['instances']):
        instance_id = f"{service_id}:{instance['ip']}:{instance['port']}"
        instance_key = f"/instances/{namespace}/{service_name}/{idx}"

        context['etcd'].put(instance_key, {
            'instance_id': instance_id,
            'ip': instance['ip'],
            'port': instance['port'],
            'zone': instance['zone'],
            'healthy': True,  # Assume healthy until proven otherwise
            'registered_at': datetime.now().isoformat()
        })

        # Start health checking
        context['scheduler'].schedule_recurring(
            function=health_check_instance,
            args={'instance_key': instance_key, 'service_config': service_config},
            interval_seconds=service_config['health_check']['interval_seconds']
        )

    # Create DNS entry
    dns_name = f"{service_name}.{namespace}.svc.cluster.local"
    context['dns'].create_record(
        name=dns_name,
        type='A',
        values=[inst['ip'] for inst in service_config['instances']]
    )

    # Trigger config propagation to proxies
    push_config_to_proxies(service_id, context)

    return {
        'service_id': service_id,
        'instances_registered': len(service_config['instances']),
        'dns': dns_name
    }


def health_check_instance(instance_key: str, service_config: dict, context: dict):
    """
    Perform active health check on service instance.

    Args:
        instance_key: '/instances/prod/payment-service/0'
        service_config: Service configuration
        context: Runtime context
    """
    instance = context['etcd'].get(instance_key)
    health_check = service_config['health_check']

    # Perform HTTP health check
    try:
        response = context['http'].get(
            url=f"http://{instance['ip']}:{instance['port']}{health_check['path']}",
            timeout=health_check['timeout_seconds']
        )

        is_healthy = response.status_code == 200

    except Exception as e:
        is_healthy = False

    # Update instance health status
    current_healthy = instance['healthy']
    instance['last_check'] = datetime.now().isoformat()

    # Implement hysteresis: require N consecutive successes/failures
    if is_healthy and not current_healthy:
        instance['consecutive_successes'] = instance.get('consecutive_successes', 0) + 1
        if instance['consecutive_successes'] >= health_check['healthy_threshold']:
            instance['healthy'] = True
            instance['consecutive_successes'] = 0
            instance['consecutive_failures'] = 0
            # Notify proxies of healthy instance
            push_config_to_proxies(instance['instance_id'], context)

    elif not is_healthy and current_healthy:
        instance['consecutive_failures'] = instance.get('consecutive_failures', 0) + 1
        if instance['consecutive_failures'] >= health_check['unhealthy_threshold']:
            instance['healthy'] = False
            instance['consecutive_successes'] = 0
            instance['consecutive_failures'] = 0
            # Remove unhealthy instance from load balancing pool
            push_config_to_proxies(instance['instance_id'], context)

    context['etcd'].put(instance_key, instance)


def discover_service(service_name: str, namespace: str, options: dict, context: dict) -> dict:
    """
    Discover healthy instances of a service.

    Args:
        service_name: 'payment-service'
        namespace: 'prod'
        options: {
            'caller_zone': 'us-east-1a',  # For zone-aware routing
            'version': 'v2.1.0',  # Optional version filter
            'prefer_local_zone': True
        }
        context: Runtime context

    Returns:
        {
            'service_id': 'payment-service.prod',
            'instances': [
                {'ip': '10.0.1.5', 'port': 8080, 'zone': 'us-east-1a', 'weight': 100},
                {'ip': '10.0.1.6', 'port': 8080, 'zone': 'us-east-1b', 'weight': 50}
            ],
            'load_balancing': 'zone_aware',
            'query_latency_ms': 2.3
        }

    Test cases covered:
    - TC2: Service discovery with health filtering
    - TC5: Zone-aware routing (prefer same-zone)
    """
    start_time = time.time()

    # Query etcd for service instances
    instances_prefix = f"/instances/{namespace}/{service_name}/"
    all_instances = context['etcd'].get_prefix(instances_prefix)

    # Filter by health status
    healthy_instances = [inst for inst in all_instances if inst['healthy']]

    if not healthy_instances:
        raise ValueError(f"No healthy instances found for {service_name}.{namespace}")

    # Zone-aware routing: prefer instances in same zone
    if options.get('prefer_local_zone'):
        caller_zone = options['caller_zone']

        # Same-zone instances get 100% weight
        same_zone_instances = [inst for inst in healthy_instances if inst['zone'] == caller_zone]

        # Cross-zone instances get 50% weight (penalty for latency)
        cross_zone_instances = [inst for inst in healthy_instances if inst['zone'] != caller_zone]

        instances = []
        for inst in same_zone_instances:
            instances.append({**inst, 'weight': 100})
        for inst in cross_zone_instances:
            instances.append({**inst, 'weight': 50})
    else:
        # Equal weight for all instances
        instances = [{**inst, 'weight': 100} for inst in healthy_instances]

    query_latency_ms = (time.time() - start_time) * 1000

    return {
        'service_id': f"{service_name}.{namespace}",
        'instances': instances,
        'load_balancing': 'zone_aware' if options.get('prefer_local_zone') else 'round_robin',
        'query_latency_ms': query_latency_ms
    }


def check_circuit_breaker(service_id: str, destination: str, context: dict) -> dict:
    """
    Check circuit breaker state before making request.

    Circuit states:
    - Closed: Normal operation (allow all requests)
    - Open: Failure threshold exceeded (reject all requests)
    - Half-Open: Testing recovery (allow limited requests)

    Args:
        service_id: 'frontend.prod'
        destination: 'payment-service.prod'
        context: Runtime context

    Returns:
        {
            'state': 'closed' | 'open' | 'half_open',
            'allow_request': True/False,
            'error_rate': 45.2,  # Percentage
            'requests_in_window': 1000
        }

    Test cases covered:
    - TC3: Circuit breaker opens on failure threshold
    - TC4: Automatic recovery (half-open → closed)
    """
    circuit_key = f"circuit:{service_id}:{destination}"

    # Get circuit state from Redis
    circuit = context['redis'].hgetall(circuit_key)

    if not circuit:
        # Initialize circuit (closed state)
        circuit = {
            'state': 'closed',
            'consecutive_failures': 0,
            'last_failure_time': None,
            'half_open_successes': 0
        }
        context['redis'].hmset(circuit_key, circuit)

    state = circuit['state']

    # Get recent request metrics (last 60 seconds)
    metrics = context['metrics'].query(
        source=service_id,
        destination=destination,
        metrics=['error_rate', 'total_requests'],
        lookback_seconds=60
    )

    error_rate = metrics.get('error_rate', 0)
    total_requests = metrics.get('total_requests', 0)

    # State machine
    if state == 'closed':
        # Check if error rate exceeds threshold (50%)
        if error_rate > 50 and total_requests > 10:  # Minimum 10 requests
            # Open circuit
            circuit['state'] = 'open'
            circuit['opened_at'] = datetime.now().isoformat()
            context['redis'].hmset(circuit_key, circuit)

            return {
                'state': 'open',
                'allow_request': False,
                'error_rate': error_rate,
                'requests_in_window': total_requests,
                'reason': f'Error rate {error_rate:.1f}% exceeded threshold 50%'
            }

        return {
            'state': 'closed',
            'allow_request': True,
            'error_rate': error_rate,
            'requests_in_window': total_requests
        }

    elif state == 'open':
        # Check if enough time has passed to try recovery (30 seconds)
        opened_at = datetime.fromisoformat(circuit['opened_at'])
        if datetime.now() - opened_at > timedelta(seconds=30):
            # Transition to half-open
            circuit['state'] = 'half_open'
            circuit['half_open_successes'] = 0
            context['redis'].hmset(circuit_key, circuit)

            return {
                'state': 'half_open',
                'allow_request': True,  # Allow limited requests
                'error_rate': error_rate,
                'requests_in_window': total_requests
            }

        return {
            'state': 'open',
            'allow_request': False,
            'error_rate': error_rate,
            'requests_in_window': total_requests
        }

    elif state == 'half_open':
        # Allow limited requests to test recovery
        half_open_successes = int(circuit.get('half_open_successes', 0))

        # If we've seen 5 consecutive successes, close circuit
        if half_open_successes >= 5 and error_rate < 10:
            circuit['state'] = 'closed'
            circuit['half_open_successes'] = 0
            context['redis'].hmset(circuit_key, circuit)

            return {
                'state': 'closed',
                'allow_request': True,
                'error_rate': error_rate,
                'requests_in_window': total_requests,
                'recovered': True
            }

        # If error rate still high, reopen circuit
        if error_rate > 50 and total_requests > 3:
            circuit['state'] = 'open'
            circuit['opened_at'] = datetime.now().isoformat()
            context['redis'].hmset(circuit_key, circuit)

            return {
                'state': 'open',
                'allow_request': False,
                'error_rate': error_rate,
                'requests_in_window': total_requests
            }

        return {
            'state': 'half_open',
            'allow_request': True,
            'error_rate': error_rate,
            'requests_in_window': total_requests
        }


def record_request_outcome(service_id: str, destination: str, success: bool, context: dict):
    """
    Record request outcome for circuit breaker.

    Args:
        service_id: 'frontend.prod'
        destination: 'payment-service.prod'
        success: True if request succeeded
        context: Runtime context
    """
    circuit_key = f"circuit:{service_id}:{destination}"
    circuit = context['redis'].hgetall(circuit_key)

    if circuit['state'] == 'half_open' and success:
        # Increment success counter
        context['redis'].hincrby(circuit_key, 'half_open_successes', 1)


def push_config_to_proxies(service_id: str, context: dict):
    """
    Push updated configuration to Envoy proxies using xDS protocol.

    xDS = Envoy's discovery service:
    - LDS (Listener Discovery Service): Listeners on proxy
    - RDS (Route Discovery Service): Routes for HTTP
    - CDS (Cluster Discovery Service): Upstream clusters
    - EDS (Endpoint Discovery Service): Endpoints in cluster

    Args:
        service_id: Service that changed
        context: Runtime context

    Test cases covered:
    - TC6: Config propagation <10 seconds
    """
    # Get all instances for service
    instances = context['etcd'].get_prefix(f"/instances/{service_id.split('.')[1]}/{service_id.split('.')[0]}/")

    # Build EDS config (endpoints)
    endpoints = []
    for inst in instances:
        if inst['healthy']:
            endpoints.append({
                'address': inst['ip'],
                'port': inst['port'],
                'zone': inst['zone']
            })

    # Push to all proxies via gRPC stream
    config = {
        'version': str(int(time.time())),
        'service_id': service_id,
        'endpoints': endpoints,
        'load_balancing': 'LEAST_REQUEST',
        'circuit_breaker': {
            'max_connections': 1000,
            'max_requests': 10000,
            'max_retries': 3
        }
    }

    # Publish to message queue (proxies subscribe)
    context['pubsub'].publish(
        channel='xds-updates',
        message=config
    )


# Example usage
if __name__ == "__main__":
    context = {
        'etcd': MockEtcd(),
        'db': MockDatabase(),
        'redis': MockRedis(),
        'http': MockHTTP(),
        'dns': MockDNS(),
        'metrics': MockMetrics(),
        'scheduler': MockScheduler(),
        'pubsub': MockPubSub()
    }

    # Register service
    registration = register_service({
        'name': 'payment-service',
        'namespace': 'prod',
        'version': 'v2.1.0',
        'instances': [
            {'ip': '10.0.1.5', 'port': 8080, 'zone': 'us-east-1a'},
            {'ip': '10.0.1.6', 'port': 8080, 'zone': 'us-east-1b'}
        ],
        'health_check': {
            'path': '/health',
            'interval_seconds': 10,
            'timeout_seconds': 2,
            'healthy_threshold': 2,
            'unhealthy_threshold': 3
        }
    }, context)

    print(f"Registered: {registration['service_id']}")
    print(f"DNS: {registration['dns']}")

    # Discover service (zone-aware)
    discovery = discover_service('payment-service', 'prod', {
        'caller_zone': 'us-east-1a',
        'prefer_local_zone': True
    }, context)

    print(f"Found {len(discovery['instances'])} instances")
    print(f"Query latency: {discovery['query_latency_ms']:.1f}ms")

    # Check circuit breaker
    circuit = check_circuit_breaker('frontend.prod', 'payment-service.prod', context)
    print(f"Circuit state: {circuit['state']}")
    print(f"Allow request: {circuit['allow_request']}")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Register service with multiple instances',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

registration = register_service({
    'name': 'payment-service',
    'namespace': 'prod',
    'version': 'v2.1.0',
    'instances': [
        {'ip': '10.0.1.5', 'port': 8080, 'zone': 'us-east-1a'},
        {'ip': '10.0.1.6', 'port': 8080, 'zone': 'us-east-1b'},
        {'ip': '10.0.1.7', 'port': 8080, 'zone': 'us-east-1c'}
    ],
    'health_check': {
        'path': '/health',
        'interval_seconds': 10,
        'timeout_seconds': 2,
        'healthy_threshold': 2,
        'unhealthy_threshold': 3
    }
}, context)

print(registration['service_id'])
print(registration['instances_registered'])
print(registration['dns'])`,
    expectedOutput: `payment-service.prod
3
payment-service.prod.svc.cluster.local`,
    hints: [
      'Store service metadata in etcd for distributed consistency',
      'Register each instance with IP, port, zone, health status',
      'Create DNS A record for service discovery',
      'Start health checking immediately after registration',
      'Push config to Envoy proxies via xDS protocol'
    ],
    testCode: `assert registration['service_id'] == 'payment-service.prod'
assert registration['instances_registered'] == 3
assert 'svc.cluster.local' in registration['dns']`,
    timeComplexity: 'O(N) where N = number of instances',
    spaceComplexity: 'O(N)',
    learningObjectives: [
      'Design service registry with etcd',
      'Understand DNS-based service discovery',
      'Learn health check configuration'
    ]
  },
  {
    id: 2,
    name: 'Service discovery with health filtering (NFR-P: <5ms)',
    difficulty: 'medium',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Register service
register_service({...}, context)

# Mark one instance as unhealthy
context['etcd'].put('/instances/prod/payment-service/1', {
    'ip': '10.0.1.6',
    'port': 8080,
    'zone': 'us-east-1b',
    'healthy': False  # Unhealthy
})

# Discover service
discovery = discover_service('payment-service', 'prod', {
    'caller_zone': 'us-east-1a',
    'prefer_local_zone': False
}, context)

print(len(discovery['instances']))  # Should only return healthy instances
print(discovery['query_latency_ms'] < 5)  # Must be <5ms`,
    expectedOutput: `2
True`,
    hints: [
      'Filter out unhealthy instances before returning',
      'Use etcd prefix query for fast lookup',
      'Return only instances with healthy=True',
      'Query latency must be <5ms (NFR-P)',
      'Cache service registry in memory for speed'
    ],
    testCode: `assert len(discovery['instances']) == 2  # Only healthy
assert discovery['query_latency_ms'] < 5  # NFR-P`,
    timeComplexity: 'O(N) where N = instances (with etcd index: O(log N))',
    spaceComplexity: 'O(N)',
    learningObjectives: [
      'Implement health-aware service discovery',
      'Optimize query performance for <5ms latency',
      'Learn to use etcd for fast lookups'
    ]
  },
  {
    id: 3,
    name: 'Circuit breaker opens on failure threshold',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

# Simulate high error rate (60%)
context['metrics'].set_metric('frontend.prod', 'payment-service.prod', 'error_rate', 60.0)
context['metrics'].set_metric('frontend.prod', 'payment-service.prod', 'total_requests', 100)

# Check circuit breaker (should open)
circuit1 = check_circuit_breaker('frontend.prod', 'payment-service.prod', context)

print(circuit1['state'])
print(circuit1['allow_request'])
print(circuit1['error_rate'])`,
    expectedOutput: `open
False
60.0`,
    hints: [
      'Track error rate over sliding window (last 60 seconds)',
      'Open circuit if error rate >50% with minimum 10 requests',
      'Store circuit state in Redis for fast access',
      'Reject all requests when circuit is open',
      'Automatically transition to half-open after 30 seconds'
    ],
    testCode: `assert circuit1['state'] == 'open'
assert circuit1['allow_request'] == False
assert circuit1['error_rate'] > 50`,
    timeComplexity: 'O(1) for circuit state check',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement circuit breaker pattern',
      'Understand failure threshold detection',
      'Learn to prevent cascading failures'
    ]
  },
  {
    id: 4,
    name: 'Automatic recovery: half-open → closed',
    difficulty: 'hard',
    category: 'FR',
    input: `context = setup_mock_context()

# Set circuit to half-open state
context['redis'].hmset('circuit:frontend.prod:payment-service.prod', {
    'state': 'half_open',
    'half_open_successes': 4  # 4 successes so far
})

# Simulate low error rate (recovery)
context['metrics'].set_metric('frontend.prod', 'payment-service.prod', 'error_rate', 5.0)
context['metrics'].set_metric('frontend.prod', 'payment-service.prod', 'total_requests', 20)

# Record one more success
record_request_outcome('frontend.prod', 'payment-service.prod', success=True, context)

# Check circuit (should close)
circuit = check_circuit_breaker('frontend.prod', 'payment-service.prod', context)

print(circuit['state'])
print(circuit['allow_request'])
print(circuit.get('recovered'))`,
    expectedOutput: `closed
True
True`,
    hints: [
      'Require 5 consecutive successes in half-open state',
      'Error rate must be <10% to close circuit',
      'Track successes with counter in Redis',
      'Transition: half-open → closed when recovery confirmed',
      'Reset all counters when circuit closes'
    ],
    testCode: `assert circuit['state'] == 'closed'
assert circuit['allow_request'] == True
assert circuit.get('recovered') == True`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement circuit recovery mechanism',
      'Understand half-open state testing',
      'Learn to prevent premature recovery'
    ]
  },
  {
    id: 5,
    name: 'Zone-aware routing (prefer same-zone)',
    difficulty: 'medium',
    category: 'FR',
    input: `context = setup_mock_context()

# Register service across 3 zones
register_service({
    'name': 'api-service',
    'namespace': 'prod',
    'version': 'v1.0.0',
    'instances': [
        {'ip': '10.0.1.5', 'port': 8080, 'zone': 'us-east-1a'},  # Same zone
        {'ip': '10.0.1.6', 'port': 8080, 'zone': 'us-east-1a'},  # Same zone
        {'ip': '10.0.2.5', 'port': 8080, 'zone': 'us-east-1b'},  # Cross-zone
        {'ip': '10.0.3.5', 'port': 8080, 'zone': 'us-east-1c'}   # Cross-zone
    ],
    'health_check': {...}
}, context)

# Discover from us-east-1a (prefer local zone)
discovery = discover_service('api-service', 'prod', {
    'caller_zone': 'us-east-1a',
    'prefer_local_zone': True
}, context)

# Check weights (same-zone should have higher weight)
same_zone_weight = [inst['weight'] for inst in discovery['instances'] if inst['zone'] == 'us-east-1a'][0]
cross_zone_weight = [inst['weight'] for inst in discovery['instances'] if inst['zone'] == 'us-east-1b'][0]

print(same_zone_weight)
print(cross_zone_weight)
print(discovery['load_balancing'])`,
    expectedOutput: `100
50
zone_aware`,
    hints: [
      'Assign 100% weight to same-zone instances',
      'Assign 50% weight to cross-zone instances (latency penalty)',
      'Use weighted random load balancing',
      'Minimize cross-AZ traffic costs',
      'Return load_balancing strategy in response'
    ],
    testCode: `assert same_zone_weight == 100
assert cross_zone_weight == 50
assert discovery['load_balancing'] == 'zone_aware'`,
    timeComplexity: 'O(N) where N = instances',
    spaceComplexity: 'O(N)',
    learningObjectives: [
      'Implement zone-aware routing',
      'Understand cross-AZ latency optimization',
      'Learn weighted load balancing'
    ]
  },
  {
    id: 6,
    name: 'Config propagation <10 seconds (NFR-P)',
    difficulty: 'medium',
    category: 'NFR-P',
    input: `context = setup_mock_context()

# Register service
register_service({...}, context)

# Mark instance as unhealthy
start = time.time()

context['etcd'].put('/instances/prod/payment-service/0', {
    'ip': '10.0.1.5',
    'port': 8080,
    'zone': 'us-east-1a',
    'healthy': False
})

# Push config to proxies
push_config_to_proxies('payment-service.prod', context)

# Verify config was published
published_configs = context['pubsub'].get_published_messages('xds-updates')

propagation_time = time.time() - start

print(len(published_configs))
print(propagation_time < 10)  # Must be <10 seconds`,
    expectedOutput: `1
True`,
    hints: [
      'Use pub/sub for fast config distribution',
      'Envoy proxies subscribe to xDS updates',
      'Push only changed endpoints (incremental updates)',
      'Propagation must complete in <10 seconds (NFR-P)',
      'Use gRPC streaming for low latency'
    ],
    testCode: `assert len(published_configs) == 1
assert propagation_time < 10  # NFR-P`,
    timeComplexity: 'O(1) for pub/sub publish',
    spaceComplexity: 'O(E) where E = endpoints',
    learningObjectives: [
      'Design fast config propagation with pub/sub',
      'Understand xDS protocol for Envoy',
      'Meet <10s propagation requirement'
    ]
  },
  {
    id: 7,
    name: 'Scale: 10,000 services (NFR-S)',
    difficulty: 'hard',
    category: 'NFR-S',
    input: `context = setup_mock_context()

# Register 10,000 services (100 instances each)
import time
start = time.time()

for i in range(10000):
    register_service({
        'name': f'service-{i}',
        'namespace': 'prod',
        'version': 'v1.0.0',
        'instances': [
            {'ip': f'10.{i // 256}.{i % 256}.{j}', 'port': 8080, 'zone': 'us-east-1a'}
            for j in range(5)  # 5 instances per service (scaled down for test)
        ],
        'health_check': {...}
    }, context)

registration_time = time.time() - start

# Verify all registered
total_services = context['etcd'].count_keys('/services/prod/')

print(total_services)
print(registration_time < 300)  # Should complete in <5 minutes`,
    expectedOutput: `10000
True`,
    hints: [
      'Use batch operations for etcd writes',
      'Implement connection pooling for health checks',
      'Shard services across multiple etcd clusters',
      'Use async/parallel registration',
      'Meet 10K services scalability requirement (NFR-S)'
    ],
    testCode: `assert total_services == 10000
assert registration_time < 300`,
    timeComplexity: 'O(N * I) where N = services, I = instances',
    spaceComplexity: 'O(N * I)',
    learningObjectives: [
      'Scale service mesh to 10K services',
      'Optimize for high-volume registration',
      'Learn etcd sharding and batching'
    ]
  }
];

export const serviceMeshControlPlaneChallenge: SystemDesignChallenge = {
  id: 'service_mesh_control_plane',
  title: 'Service Mesh Control Plane',
  difficulty: 'advanced',
  category: 'Developer Tools & Platforms',
  description: `Design a control plane for service mesh that manages service discovery, load balancing, circuit breaking, and traffic routing across thousands of microservices. Similar to Istio, Linkerd, or Envoy control plane.

**Real-world Context:**
- Istio: Google/IBM/Lyft service mesh with Envoy data plane
- Linkerd: CNCF lightweight service mesh for Kubernetes
- AWS App Mesh: Managed service mesh for AWS services
- Consul Connect: HashiCorp's service mesh with Consul

**Key Concepts:**
- Service discovery: DNS-based + health checking (probe every 10s)
- Circuit breaker: Closed → Open (>50% errors) → Half-Open (test recovery) → Closed
- Zone-aware routing: Prefer same-zone instances (100% weight vs 50% cross-zone)
- xDS protocol: Envoy's discovery service (LDS, RDS, CDS, EDS)
- Config propagation: <10 seconds from control plane to all proxies

**Scale:**
- 10,000 microservices
- 1M service instances
- 1B RPS across all services
- <5ms discovery query latency

**Companies:** Google, Lyft, Uber, Airbnb, Netflix
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Use etcd for distributed service registry (consistent, fast reads)',
    'Implement hysteresis in health checks (require N consecutive failures)',
    'Circuit breaker: track error rate over 60s sliding window',
    'Zone-aware routing: assign higher weight to same-zone instances',
    'Push config to proxies via pub/sub (gRPC streaming for xDS)',
    'Cache service discovery results for <5ms query latency',
    'Graceful degradation: proxies cache config if control plane down',
    'Half-open state: allow limited requests to test recovery'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Istio: Powers service mesh at Google, IBM, eBay (10K+ services)',
    'Linkerd: Used at Expedia, HP, Salesforce for microservices',
    'Envoy: Lyft routes 100K RPS with circuit breaking and retries',
    'Consul: HashiCorp provides multi-DC service mesh',
    'AWS App Mesh: Manages microservices for thousands of AWS customers'
  ],
  relatedChallenges: [
    'internal_api_gateway',
    'distributed_tracing',
    'chaos_engineering_platform',
    'multi_region_failover'
  ]
};
