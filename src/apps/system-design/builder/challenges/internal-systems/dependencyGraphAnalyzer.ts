import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: Dependency Graph Analyzer
 *
 * Real-world examples:
 * - Google Production Readiness Review: Service dependencies for SRE approvals
 * - Netflix Chaos Engineering: Identify blast radius before failure injection
 * - Uber Dependency Tracker: Track service-to-service dependencies
 * - Backstage Service Catalog: Visualize service relationships
 *
 * Company context:
 * Your company has 500+ microservices with complex dependencies.
 * Need to track which services depend on each other for:
 * - Impact analysis (if service X fails, which services are affected?)
 * - Circular dependency detection (service A → B → C → A)
 * - Critical path analysis (identify single points of failure)
 * - Migration planning (what needs to be updated when service X changes?)
 *
 * Problem:
 * Design a dependency graph analyzer that tracks service dependencies,
 * detects circular dependencies, and analyzes impact radius.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Build dependency graph from service calls',
    input: {
      action: 'build_dependency_graph',
      dependencies: [
        { from: 'api-gateway', to: 'auth-service', type: 'sync' },
        { from: 'api-gateway', to: 'user-service', type: 'sync' },
        { from: 'user-service', to: 'database', type: 'sync' },
        { from: 'auth-service', to: 'redis', type: 'sync' },
        { from: 'user-service', to: 'kafka', type: 'async' },
      ],
      context: {},
    },
    expected_output: {
      graph: {
        nodes: ['api-gateway', 'auth-service', 'user-service', 'database', 'redis', 'kafka'],
        edges: [
          { from: 'api-gateway', to: 'auth-service', type: 'sync' },
          { from: 'api-gateway', to: 'user-service', type: 'sync' },
          { from: 'user-service', to: 'database', type: 'sync' },
          { from: 'auth-service', to: 'redis', type: 'sync' },
          { from: 'user-service', to: 'kafka', type: 'async' },
        ],
      },
      stats: {
        total_services: 6,
        total_dependencies: 5,
        sync_dependencies: 4,
        async_dependencies: 1,
      },
      status: 'built',
    },
    explanation:
      'Build dependency graph: Track service-to-service calls. Nodes = services. Edges = dependencies (sync or async). This graph enables impact analysis and circular dependency detection.',
  },
  {
    id: 2,
    name: 'FR: Detect circular dependencies',
    input: {
      action: 'detect_circular_dependencies',
      dependencies: [
        { from: 'service-a', to: 'service-b' },
        { from: 'service-b', to: 'service-c' },
        { from: 'service-c', to: 'service-a' }, // Circular: A → B → C → A
        { from: 'service-d', to: 'service-e' },
        { from: 'service-e', to: 'service-d' }, // Circular: D → E → D
      ],
      context: {},
    },
    expected_output: {
      circular_dependencies_detected: true,
      cycles: [
        {
          cycle: ['service-a', 'service-b', 'service-c', 'service-a'],
          length: 3,
          severity: 'critical', // 3+ services in cycle
        },
        {
          cycle: ['service-d', 'service-e', 'service-d'],
          length: 2,
          severity: 'warning', // 2 services in cycle
        },
      ],
      total_cycles: 2,
      recommendation: 'Break circular dependencies by introducing async messaging or event-driven architecture',
      status: 'cycles_detected',
    },
    explanation:
      'Circular dependency detection: Use DFS to detect cycles. service-a → service-b → service-c → service-a is a cycle (length 3). Cycles cause cascading failures and make deployment difficult. Recommendation: break with async messaging.',
  },
  {
    id: 3,
    name: 'FR: Impact analysis (downstream dependencies)',
    input: {
      action: 'analyze_impact',
      impact_config: {
        service: 'database',
        direction: 'upstream', // Which services depend on database?
      },
      context: {
        dependencies: [
          { from: 'api-gateway', to: 'user-service' },
          { from: 'user-service', to: 'database' },
          { from: 'order-service', to: 'database' },
          { from: 'payment-service', to: 'database' },
        ],
      },
    },
    expected_output: {
      impact_analysis: {
        service: 'database',
        direction: 'upstream',
        directly_affected: ['user-service', 'order-service', 'payment-service'], // Direct dependencies
        transitively_affected: ['api-gateway'], // Indirect via user-service
        total_affected: 4,
        blast_radius: 'high', // 4 services affected
      },
      recommendation: 'Database is a critical dependency (4 services affected). Consider read replicas or caching to reduce blast radius.',
      status: 'analyzed',
    },
    explanation:
      'Impact analysis: database fails → directly affects user-service, order-service, payment-service. Transitively affects api-gateway (via user-service). Total blast radius: 4 services. High impact → critical dependency.',
  },
  {
    id: 4,
    name: 'NFR-P: Real-time dependency updates (from distributed tracing)',
    input: {
      action: 'update_dependencies_from_traces',
      trace_config: {
        traces: [
          {
            trace_id: 't1',
            spans: [
              { service: 'api-gateway', parent: null },
              { service: 'auth-service', parent: 'api-gateway' },
              { service: 'redis', parent: 'auth-service' },
            ],
          },
          {
            trace_id: 't2',
            spans: [
              { service: 'api-gateway', parent: null },
              { service: 'user-service', parent: 'api-gateway' },
              { service: 'database', parent: 'user-service' },
            ],
          },
        ],
      },
      context: {
        update_mechanism: 'streaming',
      },
    },
    expected_output: {
      dependencies_discovered: [
        { from: 'api-gateway', to: 'auth-service' },
        { from: 'auth-service', to: 'redis' },
        { from: 'api-gateway', to: 'user-service' },
        { from: 'user-service', to: 'database' },
      ],
      discovery_method: 'distributed_tracing',
      update_latency: '<5 seconds', // Real-time updates from trace ingestion
      accuracy: 'high', // Actual production traffic, not static config
      status: 'updated',
    },
    explanation:
      'Real-time dependency discovery: Parse distributed traces (Jaeger/Zipkin). Extract parent-child relationships from spans. api-gateway → auth-service → redis. Update graph in real-time (<5s latency). More accurate than static config files.',
  },
  {
    id: 5,
    name: 'NFR-P: Dependency strength (call volume)',
    input: {
      action: 'calculate_dependency_strength',
      dependency_config: {
        from: 'api-gateway',
        to: 'auth-service',
      },
      context: {
        call_volume: {
          'api-gateway->auth-service': 10_000, // 10K calls/min
          'api-gateway->user-service': 5_000, // 5K calls/min
          'api-gateway->order-service': 1_000, // 1K calls/min
        },
      },
    },
    expected_output: {
      dependency_strength: {
        from: 'api-gateway',
        to: 'auth-service',
        call_volume: 10_000,
        percentage_of_total: 62.5, // 10K / 16K = 62.5%
        strength: 'critical', // >50% of traffic
      },
      recommendation: 'auth-service is critical dependency (62.5% of api-gateway traffic). Consider fallback mechanism or caching.',
      status: 'calculated',
    },
    explanation:
      'Dependency strength: Measure call volume. auth-service receives 10K calls/min (62.5% of api-gateway traffic). Critical dependency → high impact if fails. Recommendation: add fallback or caching.',
  },
  {
    id: 6,
    name: 'NFR-S: Critical path analysis (identify single points of failure)',
    input: {
      action: 'identify_critical_path',
      graph_config: {
        dependencies: [
          { from: 'api-gateway', to: 'auth-service' },
          { from: 'api-gateway', to: 'user-service' },
          { from: 'auth-service', to: 'redis' },
          { from: 'user-service', to: 'database' },
        ],
      },
      context: {
        entry_point: 'api-gateway',
      },
    },
    expected_output: {
      critical_services: ['api-gateway', 'redis', 'database'], // Single points of failure
      analysis: {
        'api-gateway': {
          reason: 'Entry point for all requests',
          affected_services: 4, // All downstream services
          mitigation: 'Multi-region deployment with load balancer',
        },
        'redis': {
          reason: 'Single shared cache (no redundancy)',
          affected_services: 1, // Only auth-service
          mitigation: 'Redis Cluster with replication',
        },
        'database': {
          reason: 'Single shared database (no redundancy)',
          affected_services: 1, // Only user-service
          mitigation: 'Database replication (primary + replica)',
        },
      },
      status: 'analyzed',
    },
    explanation:
      'Critical path analysis: Identify single points of failure. api-gateway = entry point (all traffic). redis = single shared cache. database = single shared DB. All are SPOFs. Recommendation: add redundancy (replication, multi-region).',
  },
  {
    id: 7,
    name: 'NFR-R: Dependency versioning (track API version compatibility)',
    input: {
      action: 'track_api_versions',
      version_config: {
        service: 'user-service',
        api_version: 'v2',
      },
      context: {
        dependencies: [
          { from: 'api-gateway', to: 'user-service', api_version: 'v1' }, // Incompatible!
          { from: 'order-service', to: 'user-service', api_version: 'v2' }, // Compatible
          { from: 'payment-service', to: 'user-service', api_version: 'v2' }, // Compatible
        ],
      },
    },
    expected_output: {
      version_compatibility: {
        service: 'user-service',
        current_version: 'v2',
        incompatible_clients: [
          {
            client: 'api-gateway',
            client_version: 'v1',
            migration_required: true,
          },
        ],
        compatible_clients: ['order-service', 'payment-service'],
      },
      migration_plan: {
        step1: 'Deploy user-service v2 alongside v1 (dual-version deployment)',
        step2: 'Migrate api-gateway to use v2 API',
        step3: 'Deprecate and remove v1 API after all clients migrated',
      },
      status: 'incompatibility_detected',
    },
    explanation:
      'API version tracking: user-service upgraded to v2. api-gateway still uses v1 (incompatible). Detect version mismatch. Migration plan: dual-version deployment → migrate clients → deprecate v1.',
  },
  {
    id: 8,
    name: 'NFR-R: Dependency health monitoring',
    input: {
      action: 'monitor_dependency_health',
      monitoring_config: {
        service: 'api-gateway',
      },
      context: {
        dependencies: [
          { to: 'auth-service', error_rate: 0.01, latency_p99: 100 }, // 1% errors, 100ms p99
          { to: 'user-service', error_rate: 0.05, latency_p99: 500 }, // 5% errors, 500ms p99 (unhealthy!)
          { to: 'order-service', error_rate: 0.001, latency_p99: 50 }, // 0.1% errors, 50ms p99
        ],
        thresholds: {
          error_rate: 0.02, // 2% threshold
          latency_p99: 300, // 300ms threshold
        },
      },
    },
    expected_output: {
      unhealthy_dependencies: [
        {
          service: 'user-service',
          metrics: {
            error_rate: 0.05, // 5% > 2% threshold
            latency_p99: 500, // 500ms > 300ms threshold
          },
          health_status: 'unhealthy',
          recommendation: 'Investigate user-service (high error rate and latency). Consider circuit breaker.',
        },
      ],
      healthy_dependencies: ['auth-service', 'order-service'],
      overall_health: 'degraded', // 1 of 3 dependencies unhealthy
      status: 'monitored',
    },
    explanation:
      'Dependency health monitoring: Track error rate and latency for each dependency. user-service has 5% error rate (> 2% threshold) and 500ms p99 latency (> 300ms). Unhealthy → recommendation: investigate and add circuit breaker.',
  },
  {
    id: 9,
    name: 'NFR-C: Dependency change impact (simulate rollout)',
    input: {
      action: 'simulate_change_impact',
      change_config: {
        service: 'database',
        change_type: 'schema_change',
        estimated_downtime: 300, // 5 minutes
      },
      context: {
        dependencies: [
          { from: 'user-service', to: 'database', traffic_qps: 1000 },
          { from: 'order-service', to: 'database', traffic_qps: 500 },
          { from: 'payment-service', to: 'database', traffic_qps: 200 },
        ],
      },
    },
    expected_output: {
      impact_simulation: {
        service: 'database',
        change_type: 'schema_change',
        estimated_downtime: 300, // 5 minutes
        affected_services: ['user-service', 'order-service', 'payment-service'],
        estimated_errors: {
          'user-service': 300_000, // 1000 QPS * 300 sec = 300K errors
          'order-service': 150_000, // 500 QPS * 300 sec = 150K errors
          'payment-service': 60_000, // 200 QPS * 300 sec = 60K errors
          total: 510_000, // Total errors during downtime
        },
        recommendation: 'Schedule change during low-traffic window (2am-4am) to reduce impact by 80%.',
      },
      status: 'simulated',
    },
    explanation:
      'Change impact simulation: database schema change takes 5 minutes downtime. Affects 3 services. user-service = 1000 QPS → 300K errors. Total: 510K errors. Recommendation: schedule during low-traffic window (reduce by 80%).',
  },
  {
    id: 10,
    name: 'NFR-C: Dependency visualization (graph layout)',
    input: {
      action: 'visualize_dependencies',
      visualization_config: {
        services: ['api-gateway', 'auth-service', 'user-service', 'database', 'redis'],
        layout: 'hierarchical', // Top-down layout
      },
      context: {
        dependencies: [
          { from: 'api-gateway', to: 'auth-service' },
          { from: 'api-gateway', to: 'user-service' },
          { from: 'auth-service', to: 'redis' },
          { from: 'user-service', to: 'database' },
        ],
      },
    },
    expected_output: {
      visualization: {
        layout: 'hierarchical',
        layers: [
          { layer: 0, services: ['api-gateway'] }, // Entry point
          { layer: 1, services: ['auth-service', 'user-service'] }, // Direct dependencies
          { layer: 2, services: ['redis', 'database'] }, // Transitive dependencies
        ],
        graph_complexity: 'low', // 5 nodes, 4 edges
        rendering_format: 'svg',
      },
      features: {
        node_coloring: 'by_health_status',
        edge_thickness: 'by_call_volume',
        interactive: true, // Click node to see details
      },
      status: 'visualized',
    },
    explanation:
      'Dependency visualization: Hierarchical layout (top-down). Layer 0: api-gateway (entry point). Layer 1: auth-service, user-service. Layer 2: redis, database. Color nodes by health. Edge thickness by call volume. Interactive graph.',
  },
];

const pythonTemplate = `from typing import Dict, List, Any, Set
from collections import defaultdict, deque

class DependencyGraphAnalyzer:
    """
    Dependency graph analyzer for tracking service dependencies.

    Key concepts:
    - Dependency graph: Nodes = services, edges = dependencies
    - Circular dependency detection: DFS cycle detection
    - Impact analysis: BFS traversal (upstream/downstream)
    - Real-time updates: Parse distributed traces for dependencies
    - Dependency strength: Call volume percentage
    - Critical path: Single points of failure (SPOFs)
    - API versioning: Track version compatibility
    - Health monitoring: Error rate + latency thresholds
    - Change impact: Simulate downtime effects
    """

    def __init__(self):
        self.graph = defaultdict(list)  # Adjacency list
        self.dependencies = []  # List of edges
        self.dependency_metadata = {}  # Metadata (type, call_volume, etc.)

    def build_dependency_graph(self, dependencies: list, context: dict) -> dict:
        """Build dependency graph from service calls."""
        nodes = set()
        edges = []

        for dep in dependencies:
            from_service = dep['from']
            to_service = dep['to']
            dep_type = dep.get('type', 'sync')

            # Add to graph
            self.graph[from_service].append(to_service)
            nodes.add(from_service)
            nodes.add(to_service)
            edges.append({
                'from': from_service,
                'to': to_service,
                'type': dep_type
            })

            # Store metadata
            key = f"{from_service}->{to_service}"
            self.dependency_metadata[key] = {'type': dep_type}

        # Calculate stats
        sync_deps = sum(1 for e in edges if e['type'] == 'sync')
        async_deps = sum(1 for e in edges if e['type'] == 'async')

        return {
            'graph': {
                'nodes': sorted(list(nodes)),
                'edges': edges
            },
            'stats': {
                'total_services': len(nodes),
                'total_dependencies': len(edges),
                'sync_dependencies': sync_deps,
                'async_dependencies': async_deps
            },
            'status': 'built'
        }

    def detect_circular_dependencies(self, dependencies: list, context: dict) -> dict:
        """Detect circular dependencies using DFS."""
        # Build graph
        graph = defaultdict(list)
        for dep in dependencies:
            graph[dep['from']].append(dep['to'])

        # DFS cycle detection
        cycles = []
        visited = set()
        rec_stack = set()

        def dfs_cycle(node, path):
            visited.add(node)
            rec_stack.add(node)
            path.append(node)

            for neighbor in graph[node]:
                if neighbor not in visited:
                    dfs_cycle(neighbor, path.copy())
                elif neighbor in rec_stack:
                    # Found cycle
                    cycle_start = path.index(neighbor)
                    cycle = path[cycle_start:] + [neighbor]
                    cycles.append(cycle)

            rec_stack.remove(node)

        # Run DFS from all nodes
        for node in graph:
            if node not in visited:
                dfs_cycle(node, [])

        # Remove duplicate cycles
        unique_cycles = []
        seen = set()
        for cycle in cycles:
            cycle_tuple = tuple(sorted(cycle))
            if cycle_tuple not in seen:
                seen.add(cycle_tuple)
                unique_cycles.append(cycle)

        # Classify cycles by severity
        formatted_cycles = []
        for cycle in unique_cycles:
            length = len(cycle) - 1  # Subtract duplicate node
            severity = 'critical' if length >= 3 else 'warning'
            formatted_cycles.append({
                'cycle': cycle,
                'length': length,
                'severity': severity
            })

        circular_detected = len(unique_cycles) > 0

        result = {
            'circular_dependencies_detected': circular_detected,
            'total_cycles': len(unique_cycles),
            'status': 'cycles_detected' if circular_detected else 'no_cycles'
        }

        if circular_detected:
            result['cycles'] = formatted_cycles
            result['recommendation'] = 'Break circular dependencies by introducing async messaging or event-driven architecture'

        return result

    def analyze_impact(self, impact_config: dict, context: dict) -> dict:
        """Analyze impact of service failure (upstream dependencies)."""
        service = impact_config['service']
        direction = impact_config.get('direction', 'upstream')

        dependencies = context.get('dependencies', [])

        # Build reverse graph (for upstream analysis)
        reverse_graph = defaultdict(list)
        for dep in dependencies:
            reverse_graph[dep['to']].append(dep['from'])

        # BFS to find all affected services
        directly_affected = reverse_graph[service]
        transitively_affected = []

        visited = set(directly_affected)
        queue = deque(directly_affected)

        while queue:
            current = queue.popleft()
            for neighbor in reverse_graph[current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    transitively_affected.append(neighbor)
                    queue.append(neighbor)

        total_affected = len(directly_affected) + len(transitively_affected)

        # Determine blast radius
        if total_affected >= 5:
            blast_radius = 'high'
        elif total_affected >= 2:
            blast_radius = 'medium'
        else:
            blast_radius = 'low'

        return {
            'impact_analysis': {
                'service': service,
                'direction': direction,
                'directly_affected': directly_affected,
                'transitively_affected': transitively_affected,
                'total_affected': total_affected,
                'blast_radius': blast_radius
            },
            'recommendation': f'{service} is a critical dependency ({total_affected} services affected). Consider redundancy.',
            'status': 'analyzed'
        }

    def update_dependencies_from_traces(self, trace_config: dict, context: dict) -> dict:
        """Update dependencies from distributed traces."""
        traces = trace_config.get('traces', [])

        dependencies_discovered = []

        for trace in traces:
            spans = trace['spans']

            # Build parent-child relationships
            span_map = {}
            for span in spans:
                span_map[span['service']] = span.get('parent')

            # Extract dependencies
            for service, parent in span_map.items():
                if parent:
                    dependencies_discovered.append({
                        'from': parent,
                        'to': service
                    })

        # Remove duplicates
        unique_deps = []
        seen = set()
        for dep in dependencies_discovered:
            key = (dep['from'], dep['to'])
            if key not in seen:
                seen.add(key)
                unique_deps.append(dep)

        return {
            'dependencies_discovered': unique_deps,
            'discovery_method': 'distributed_tracing',
            'update_latency': '<5 seconds',
            'accuracy': 'high',
            'status': 'updated'
        }

    def calculate_dependency_strength(self, dependency_config: dict, context: dict) -> dict:
        """Calculate dependency strength based on call volume."""
        from_service = dependency_config['from']
        to_service = dependency_config['to']

        call_volume = context.get('call_volume', {})
        key = f'{from_service}->{to_service}'
        volume = call_volume.get(key, 0)

        # Calculate percentage of total traffic
        total_volume = sum(call_volume.values())
        percentage = (volume / total_volume * 100) if total_volume > 0 else 0

        # Determine strength
        if percentage > 50:
            strength = 'critical'
        elif percentage > 20:
            strength = 'high'
        elif percentage > 5:
            strength = 'medium'
        else:
            strength = 'low'

        return {
            'dependency_strength': {
                'from': from_service,
                'to': to_service,
                'call_volume': volume,
                'percentage_of_total': round(percentage, 1),
                'strength': strength
            },
            'recommendation': f'{to_service} is {strength} dependency ({percentage:.1f}% of traffic).',
            'status': 'calculated'
        }

    def identify_critical_path(self, graph_config: dict, context: dict) -> dict:
        """Identify single points of failure (critical services)."""
        dependencies = graph_config.get('dependencies', [])
        entry_point = context.get('entry_point', 'api-gateway')

        # Build graph
        graph = defaultdict(list)
        reverse_graph = defaultdict(list)

        for dep in dependencies:
            graph[dep['from']].append(dep['to'])
            reverse_graph[dep['to']].append(dep['from'])

        # Services with no alternatives (single dependency)
        critical_services = []

        # Entry point is always critical
        critical_services.append(entry_point)

        # Services with no redundancy (single instance)
        for service in graph:
            # Check if service has multiple downstream dependencies
            if len(graph[service]) == 1:
                downstream = graph[service][0]
                # If downstream has no alternatives, it's critical
                if len(reverse_graph[downstream]) == 1:
                    critical_services.append(downstream)

        # Create analysis
        analysis = {}
        for service in critical_services:
            if service == entry_point:
                analysis[service] = {
                    'reason': 'Entry point for all requests',
                    'affected_services': len(graph) + len(reverse_graph),
                    'mitigation': 'Multi-region deployment with load balancer'
                }
            else:
                affected = len(reverse_graph[service])
                analysis[service] = {
                    'reason': 'Single shared resource (no redundancy)',
                    'affected_services': affected,
                    'mitigation': f'{service} replication (primary + replica)'
                }

        return {
            'critical_services': critical_services,
            'analysis': analysis,
            'status': 'analyzed'
        }

    def track_api_versions(self, version_config: dict, context: dict) -> dict:
        """Track API version compatibility."""
        service = version_config['service']
        current_version = version_config['api_version']

        dependencies = context.get('dependencies', [])

        incompatible_clients = []
        compatible_clients = []

        for dep in dependencies:
            if dep['to'] == service:
                client = dep['from']
                client_version = dep.get('api_version', 'v1')

                if client_version != current_version:
                    incompatible_clients.append({
                        'client': client,
                        'client_version': client_version,
                        'migration_required': True
                    })
                else:
                    compatible_clients.append(client)

        return {
            'version_compatibility': {
                'service': service,
                'current_version': current_version,
                'incompatible_clients': incompatible_clients,
                'compatible_clients': compatible_clients
            },
            'migration_plan': {
                'step1': f'Deploy {service} {current_version} alongside v1 (dual-version deployment)',
                'step2': f'Migrate clients to use {current_version} API',
                'step3': 'Deprecate and remove v1 API after all clients migrated'
            },
            'status': 'incompatibility_detected' if incompatible_clients else 'compatible'
        }

    def monitor_dependency_health(self, monitoring_config: dict, context: dict) -> dict:
        """Monitor health of dependencies."""
        service = monitoring_config['service']
        dependencies = context.get('dependencies', [])
        thresholds = context.get('thresholds', {})

        error_threshold = thresholds.get('error_rate', 0.02)
        latency_threshold = thresholds.get('latency_p99', 300)

        unhealthy_dependencies = []
        healthy_dependencies = []

        for dep in dependencies:
            to_service = dep['to']
            error_rate = dep.get('error_rate', 0)
            latency_p99 = dep.get('latency_p99', 0)

            unhealthy = error_rate > error_threshold or latency_p99 > latency_threshold

            if unhealthy:
                unhealthy_dependencies.append({
                    'service': to_service,
                    'metrics': {
                        'error_rate': error_rate,
                        'latency_p99': latency_p99
                    },
                    'health_status': 'unhealthy',
                    'recommendation': f'Investigate {to_service}. Consider circuit breaker.'
                })
            else:
                healthy_dependencies.append(to_service)

        overall_health = 'healthy' if not unhealthy_dependencies else 'degraded'

        return {
            'unhealthy_dependencies': unhealthy_dependencies,
            'healthy_dependencies': healthy_dependencies,
            'overall_health': overall_health,
            'status': 'monitored'
        }

    def simulate_change_impact(self, change_config: dict, context: dict) -> dict:
        """Simulate impact of service change."""
        service = change_config['service']
        change_type = change_config['change_type']
        downtime = change_config.get('estimated_downtime', 0)

        dependencies = context.get('dependencies', [])

        affected_services = []
        estimated_errors = {}
        total_errors = 0

        for dep in dependencies:
            if dep['to'] == service:
                from_service = dep['from']
                traffic_qps = dep.get('traffic_qps', 0)

                affected_services.append(from_service)
                errors = traffic_qps * downtime
                estimated_errors[from_service] = errors
                total_errors += errors

        estimated_errors['total'] = total_errors

        return {
            'impact_simulation': {
                'service': service,
                'change_type': change_type,
                'estimated_downtime': downtime,
                'affected_services': affected_services,
                'estimated_errors': estimated_errors,
                'recommendation': 'Schedule change during low-traffic window (2am-4am) to reduce impact by 80%.'
            },
            'status': 'simulated'
        }

    def visualize_dependencies(self, visualization_config: dict, context: dict) -> dict:
        """Visualize dependency graph."""
        services = visualization_config.get('services', [])
        layout = visualization_config.get('layout', 'hierarchical')
        dependencies = context.get('dependencies', [])

        # Build graph
        graph = defaultdict(list)
        for dep in dependencies:
            graph[dep['from']].append(dep['to'])

        # Hierarchical layout (topological sort)
        layers = []
        visited = set()
        layer_map = {}

        def assign_layer(node, layer):
            if node in layer_map:
                layer_map[node] = max(layer_map[node], layer)
            else:
                layer_map[node] = layer

            for neighbor in graph[node]:
                assign_layer(neighbor, layer + 1)

        # Start from entry points (nodes with no incoming edges)
        entry_points = [s for s in services if not any(s == dep['to'] for dep in dependencies)]
        for entry in entry_points:
            assign_layer(entry, 0)

        # Group by layer
        max_layer = max(layer_map.values()) if layer_map else 0
        for layer_num in range(max_layer + 1):
            layer_services = [s for s, l in layer_map.items() if l == layer_num]
            layers.append({'layer': layer_num, 'services': sorted(layer_services)})

        # Graph complexity
        node_count = len(services)
        edge_count = len(dependencies)
        if node_count + edge_count < 20:
            complexity = 'low'
        elif node_count + edge_count < 100:
            complexity = 'medium'
        else:
            complexity = 'high'

        return {
            'visualization': {
                'layout': layout,
                'layers': layers,
                'graph_complexity': complexity,
                'rendering_format': 'svg'
            },
            'features': {
                'node_coloring': 'by_health_status',
                'edge_thickness': 'by_call_volume',
                'interactive': True
            },
            'status': 'visualized'
        }


# Example usage
if __name__ == '__main__':
    analyzer = DependencyGraphAnalyzer()

    # Test case 1: Build dependency graph
    result = analyzer.build_dependency_graph(
        dependencies=[
            {'from': 'api-gateway', 'to': 'auth-service', 'type': 'sync'},
            {'from': 'api-gateway', 'to': 'user-service', 'type': 'sync'},
            {'from': 'user-service', 'to': 'database', 'type': 'sync'}
        ],
        context={}
    )
    print(f"Total services: {result['stats']['total_services']}")
    print(f"Total dependencies: {result['stats']['total_dependencies']}")
`;

export const dependencyGraphAnalyzerChallenge: Challenge = {
  id: 'dependency_graph_analyzer',
  title: 'Dependency Graph Analyzer',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - Developer Tools',
  tags: [
    'Microservices',
    'Dependency Graph',
    'Impact Analysis',
    'Circular Dependencies',
    'Service Mesh',
    'L4-L5',
    'Netflix',
    'Uber',
  ],
  companies: ['Google', 'Netflix', 'Uber', 'Backstage', 'AWS', 'Meta'],
  description: `Design a **dependency graph analyzer** that tracks service dependencies, detects circular dependencies, and analyzes impact radius for microservices architectures.

**Real-world examples:**
- **Google Production Readiness Review**: Service dependencies for SRE approvals
- **Netflix Chaos Engineering**: Identify blast radius before failure injection
- **Uber Dependency Tracker**: Track service-to-service dependencies
- **Backstage Service Catalog**: Visualize service relationships

**Functional Requirements:**
1. **Build dependency graph**: Track service-to-service calls (sync/async)
2. **Detect circular dependencies**: DFS cycle detection (A → B → C → A)
3. **Impact analysis**: Identify downstream/upstream dependencies (blast radius)
4. **Real-time updates**: Parse distributed traces for dependencies
5. **Critical path**: Identify single points of failure (SPOFs)

**Performance (NFR-P):**
- Real-time updates: <5 second latency from trace ingestion
- Dependency strength: Calculate call volume percentage
- Graph complexity: Support 1000+ services, 10K+ dependencies

**Scalability (NFR-S):**
- Critical path analysis: Identify SPOFs (entry points, shared resources)
- Hierarchical visualization: Layer services by dependency depth

**Reliability (NFR-R):**
- API versioning: Track version compatibility (detect v1 vs v2 mismatches)
- Health monitoring: Track error rate + latency per dependency

**Cost (NFR-C):**
- Change impact: Simulate downtime effects (estimate errors)
- Visualization: Interactive graph (color by health, edge thickness by volume)`,

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
      hint: 'Dependency graph: Adjacency list representation. Nodes = services. Edges = dependencies (from → to). Track type (sync/async) and metadata (call volume).',
      order: 1,
    },
    {
      hint: 'Circular dependencies: Use DFS with recursion stack. If neighbor in recursion stack → cycle detected. service-a → service-b → service-c → service-a is cycle.',
      order: 2,
    },
    {
      hint: 'Impact analysis: Build reverse graph (to → from). BFS from failed service to find all upstream dependencies. Directly affected + transitively affected = blast radius.',
      order: 3,
    },
    {
      hint: 'Real-time updates: Parse distributed traces (Jaeger/Zipkin spans). Extract parent-child relationships. parent span → child span = dependency. Update graph in <5s.',
      order: 4,
    },
    {
      hint: 'Dependency strength: Call volume percentage. auth-service = 10K calls/min, total = 16K → 62.5% = critical dependency. >50% = critical, >20% = high.',
      order: 5,
    },
    {
      hint: 'Critical path: Identify SPOFs. Entry points (api-gateway), shared resources with no redundancy (single database, single cache). All are SPOFs.',
      order: 6,
    },
    {
      hint: 'API versioning: Track client version vs service version. user-service v2 but api-gateway uses v1 → incompatibility. Migration plan: dual-version → migrate → deprecate.',
      order: 7,
    },
    {
      hint: 'Health monitoring: Track error rate + latency per dependency. user-service: 5% errors (> 2% threshold) → unhealthy. Recommendation: circuit breaker.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Design dependency graph system (adjacency list, metadata)',
    'Implement circular dependency detection (DFS with recursion stack)',
    'Apply impact analysis (BFS traversal, blast radius calculation)',
    'Use distributed tracing for real-time dependency discovery',
    'Calculate dependency strength (call volume percentage)',
    'Identify critical path and SPOFs (entry points, shared resources)',
    'Track API version compatibility (migration planning)',
    'Monitor dependency health (error rate, latency thresholds)',
  ],

  commonMistakes: [
    {
      mistake: 'Not detecting circular dependencies (A → B → C → A)',
      why_its_wrong: 'Circular dependencies cause cascading failures. Service A fails → B fails → C fails → A fails (infinite loop). Makes deployment difficult.',
      how_to_avoid:
        'Use DFS with recursion stack for cycle detection. If neighbor in stack → cycle found. service-a → service-b → service-c → service-a.',
    },
    {
      mistake: 'Not tracking transitive dependencies (only direct)',
      why_its_wrong: 'database fails → user-service fails → api-gateway fails (transitive). Missed api-gateway in impact analysis if only track direct.',
      how_to_avoid:
        'Use BFS to find all upstream dependencies. database → user-service (direct) → api-gateway (transitive). Total blast radius = 2 services.',
    },
    {
      mistake: 'Using static config files for dependencies (outdated)',
      why_its_wrong: 'Static config files are manually updated → often outdated. New dependencies not reflected. Inaccurate impact analysis.',
      how_to_avoid:
        'Use distributed tracing for real-time dependency discovery. Parse Jaeger/Zipkin spans. parent → child = dependency. Auto-update graph (<5s latency).',
    },
    {
      mistake: 'Not identifying single points of failure (SPOFs)',
      why_its_wrong: 'api-gateway (entry point) fails → all services unreachable. database (single instance) fails → all writes fail. High blast radius.',
      how_to_avoid:
        'Identify SPOFs: entry points (api-gateway), shared resources with no redundancy (single database/cache). Add redundancy (replication, multi-region).',
    },
    {
      mistake: 'Not tracking API version compatibility',
      why_its_wrong: 'user-service upgrades to v2 but api-gateway still uses v1 → API calls fail. Breaking change without migration plan.',
      how_to_avoid:
        'Track client version vs service version. Detect mismatches (v1 vs v2). Migration plan: dual-version deployment → migrate clients → deprecate v1.',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **Dependency Tracker**: Collect dependencies from distributed traces, config files
2. **Graph Database**: Store dependency graph (Neo4j, or adjacency list)
3. **Analyzer**: Detect cycles, calculate impact, identify SPOFs
4. **Visualization**: Interactive graph (Grafana, Backstage UI)
5. **Monitoring**: Track health (error rate, latency) per dependency

**Data flow:**
1. Distributed tracing system (Jaeger/Zipkin) sends spans
2. Dependency tracker parses spans → extract parent-child relationships
3. Update dependency graph in real-time (<5s)
4. Analyzer detects circular dependencies (DFS)
5. Calculate impact radius (BFS), identify SPOFs
6. Visualize graph (hierarchical layout, color by health)

**Key optimizations:**
- **Real-time updates**: Parse distributed traces (<5s latency)
- **Dependency strength**: Call volume percentage (prioritize critical)
- **Critical path**: Identify SPOFs (entry points, shared resources)
- **API versioning**: Track compatibility, migration planning`,

    steps: [
      '1. Build dependency graph: Parse service calls. Nodes = services, edges = dependencies (sync/async). Store in adjacency list.',
      '2. Detect circular dependencies: DFS with recursion stack. If neighbor in stack → cycle. service-a → service-b → service-c → service-a.',
      '3. Impact analysis: Build reverse graph (to → from). BFS from failed service. Find all upstream dependencies (blast radius).',
      '4. Real-time updates: Parse distributed traces (Jaeger spans). Extract parent → child = dependency. Update graph <5s.',
      '5. Calculate dependency strength: Call volume percentage. auth-service = 10K/16K = 62.5% → critical dependency.',
      '6. Identify critical path: Find SPOFs (entry points, shared resources with no redundancy). api-gateway, database, redis.',
      '7. Track API versions: Store client version vs service version. Detect mismatches (v1 vs v2). Create migration plan.',
      '8. Monitor health: Track error rate + latency per dependency. user-service: 5% errors > 2% threshold → unhealthy.',
      '9. Simulate change impact: Calculate downtime effects. database down 5 min → user-service = 300K errors.',
      '10. Visualize graph: Hierarchical layout (topological sort). Layer 0: api-gateway, Layer 1: auth/user, Layer 2: redis/db.',
    ],

    timeComplexity: `**Build dependency graph:**
- O(E) where E = edges (dependencies)
- 10K dependencies = 10K operations

**Circular dependency detection:**
- DFS: O(V + E) where V = vertices (services), E = edges
- 1000 services, 10K dependencies = 11K operations

**Impact analysis (BFS):**
- O(V + E) for full traversal
- Typically much less (only affected subgraph)

**Real-time updates:**
- Parse trace: O(S) where S = spans per trace (typically 5-20)
- Update graph: O(1) per dependency`,

    spaceComplexity: `**Dependency graph:**
- Adjacency list: O(V + E) where V = services, E = dependencies
- 1000 services + 10K dependencies = 11K entries
- With metadata (call volume, type): ~100 KB

**Cycle detection:**
- Recursion stack: O(V) = 1000 services = 1 KB
- Visited set: O(V) = 1000 services = 1 KB

**Impact analysis:**
- Queue for BFS: O(V) = 1000 services = 1 KB

Total: ~102 KB (very manageable)`,
  },
};
