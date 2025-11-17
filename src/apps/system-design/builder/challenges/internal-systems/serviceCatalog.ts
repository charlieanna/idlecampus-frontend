import { Challenge } from '../../types/testCase';

export const serviceCatalogChallenge: Challenge = {
  id: 'service_catalog',
  title: 'Service Catalog (Backstage style)',
  difficulty: 'advanced',
  description: `Design an internal service catalog that tracks all microservices in the organization.

Engineers discover services, view API documentation, check ownership, and track dependencies.
The system auto-discovers services, monitors health, and manages API deprecations.

Example workflow:
- GET /services → List all services
- GET /services/:id → View service details (owner, SLA, dependencies)
- GET /services/:id/api → View API docs (OpenAPI spec)
- POST /services/:id/deprecate → Mark API version as deprecated
- GET /services/search?q=payment → Find payment-related services

Key challenges:
- Auto-discovery from K8s, service mesh, code repos
- Dependency graph visualization (upstream/downstream)
- Deprecation tracking and migration management
- Ownership and on-call information`,

  requirements: {
    functional: [
      'Auto-discover services from infrastructure',
      'Store service metadata (owner, SLA, dependencies)',
      'API registry with versioning',
      'Dependency graph visualization',
      'Deprecation warnings and migration tracking',
    ],
    traffic: '500 RPS (95% reads, 5% writes)',
    latency: 'p99 < 300ms for reads, < 1s for dependency graph',
    availability: '99.9% uptime',
    budget: '$2,500/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'search_engine',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Service Registration and Discovery',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Auto-discover and register services from K8s and service mesh.',
      traffic: {
        type: 'write',
        rps: 10,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 1000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 300, writeCapacity: 100 } },
          { type: 'redis', config: { memorySizeGB: 8 } },
          { type: 'elasticsearch', config: { nodes: 2, shards: 5 } },
          { type: 'kafka', config: { partitions: 10 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'elasticsearch' },
          { from: 'app_server', to: 'kafka' },
        ],
        explanation: `Architecture:
- PostgreSQL stores service metadata, ownership, SLAs
- Kafka streams discovery events from K8s/service mesh
- Elasticsearch for service search
- Redis caches service info and dependency graphs
- Workers poll K8s API for service updates`,
      },
    },

    {
      name: 'Dependency Graph Generation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Build and visualize service dependency graph.',
      traffic: {
        type: 'read',
        rps: 50,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 1000,
      },
      hints: [
        'Auto-detect dependencies from service mesh telemetry',
        'Parse code repos for API client imports',
        'Store graph in adjacency list format',
        'Cache transitive dependencies (upstream/downstream)',
      ],
    },

    {
      name: 'API Deprecation Tracking',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Track deprecated API versions and notify consumers.',
      traffic: {
        type: 'mixed',
        rps: 30,
        readRatio: 0.8,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 500,
      },
      hints: [
        'Store API versions with deprecation dates',
        'Notify downstream consumers via email/Slack',
        'Track migration progress (which teams migrated)',
        'Warn on dashboard for services using deprecated APIs',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Fast Service Search',
      type: 'performance',
      requirement: 'NFR-P',
      description: '500 RPS service search with p99 < 300ms.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 300,
      },
      hints: [
        'Index services in Elasticsearch (name, description, tags)',
        'Cache popular searches in Redis',
        'Faceted search by team, status, tier',
        'Auto-complete for service names',
      ],
    },

    {
      name: 'Dependency Graph Query Speed',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Compute transitive dependencies in < 1s for 1000 services.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 1000,
      },
      hints: [
        'Pre-compute transitive closure daily',
        'Cache dependency graph in Redis',
        'Use graph database (Neo4j) for complex queries',
        'Limit depth for circular dependency detection',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Large Service Fleet',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Handle 10,000 services with 100K API endpoints.',
      traffic: {
        type: 'read',
        rps: 300,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 400,
      },
      hints: [
        'Shard services by team or namespace',
        'Archive inactive services (not deployed in 6 months)',
        'Lazy-load API docs (not in main catalog view)',
        'Pagination for service list',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Discovery Failure Handling',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Catalog remains available even if K8s API is down.',
      traffic: {
        type: 'read',
        rps: 200,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 300,
      },
      hints: [
        'Cache last known service state',
        'Retry discovery with exponential backoff',
        'Degrade gracefully (show stale data)',
        'Separate read and write paths',
      ],
    },
  ],

  hints: [
    {
      category: 'Service Discovery',
      items: [
        'K8s API: List services, deployments, ingresses',
        'Service mesh: Parse xDS config for service registry',
        'Git repos: Parse README, OWNERS files',
        'Poll every 5 minutes, event-driven on deployment',
      ],
    },
    {
      category: 'Data Model',
      items: [
        'Services: id, name, team, tier, status, sla, repository',
        'APIs: service_id, version, openapi_spec, deprecated_at',
        'Dependencies: from_service_id, to_service_id, type (sync/async)',
        'Owners: service_id, user_id, role (owner/oncall)',
      ],
    },
    {
      category: 'Dependency Detection',
      items: [
        'Service mesh telemetry: Which services call each other',
        'Code analysis: Import statements, SDK usage',
        'Manual declarations: teams.yaml, service.yaml',
        'Validate with actual traffic logs',
      ],
    },
    {
      category: 'Deprecation Workflow',
      items: [
        'Phase 1: Announce deprecation (90 days notice)',
        'Phase 2: Warn consumers (email, dashboard)',
        'Phase 3: Track migrations (who migrated)',
        'Phase 4: Sunset API (return 410 Gone)',
      ],
    },
  ],

  learningObjectives: [
    'Service discovery from K8s and service mesh',
    'Dependency graph construction and visualization',
    'API versioning and deprecation management',
    'Metadata aggregation from multiple sources',
    'Graph algorithms for dependency analysis',
  ],

  realWorldExample: `**Backstage (Spotify):**
- Software catalog with templates
- TechDocs integration
- Plugin ecosystem
- Ownership tracking via CODEOWNERS

**AWS Service Catalog:**
- Product portfolio management
- Self-service provisioning
- Governance and compliance
- Cost allocation

**Internal Google Service Catalog:**
- Auto-discovery from Borg/Kubernetes
- SLA tracking and enforcement
- Dependency graph for blast radius
- Integration with code search and monitoring`,

  pythonTemplate: `from typing import List, Dict, Set
from collections import defaultdict

class ServiceCatalog:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.cache = None  # Redis
        self.search = None  # Elasticsearch
        self.k8s_client = None  # Kubernetes client

    def discover_services(self) -> List[Dict]:
        """Auto-discover services from K8s."""
        # TODO: List K8s services
        # TODO: Extract metadata (labels, annotations)
        # TODO: Upsert into database
        # TODO: Invalidate cache
        # TODO: Re-index in Elasticsearch
        return []

    def register_service(self, name: str, team: str, repository: str,
                        sla: Dict) -> str:
        """Manually register a service."""
        # TODO: Validate SLA format
        # TODO: Insert service record
        # TODO: Create default ownership
        # TODO: Index in Elasticsearch
        # TODO: Return service ID
        pass

    def get_service(self, service_id: str) -> Dict:
        """Get service details."""
        # TODO: Check cache
        # TODO: Query database
        # TODO: Enrich with real-time health
        # TODO: Cache result
        return {}

    def build_dependency_graph(self, service_id: str) -> Dict:
        """Build dependency graph for a service."""
        # TODO: BFS/DFS to find upstream dependencies
        # TODO: Find downstream consumers
        # TODO: Detect circular dependencies
        # TODO: Cache graph
        return {'upstream': [], 'downstream': []}

    def search_services(self, query: str, filters: Dict = None) -> List[Dict]:
        """Search services by name, team, or tags."""
        # TODO: Build Elasticsearch query
        # TODO: Apply filters (team, tier, status)
        # TODO: Rank by relevance
        # TODO: Return results
        return []

    def deprecate_api(self, service_id: str, version: str,
                     sunset_date: str) -> bool:
        """Mark API version as deprecated."""
        # TODO: Update API record
        # TODO: Find all consumers (dependency graph)
        # TODO: Send notifications
        # TODO: Track in deprecation dashboard
        return True

    def _detect_dependencies(self, service_id: str) -> Set[str]:
        """Detect service dependencies from telemetry."""
        # TODO: Query service mesh for outbound calls
        # TODO: Parse code for client imports
        # TODO: Combine and deduplicate
        return set()

# Example usage
if __name__ == '__main__':
    catalog = ServiceCatalog()

    # Discover services
    services = catalog.discover_services()

    # Register service
    service_id = catalog.register_service(
        name='payment-service',
        team='payments',
        repository='github.com/company/payment-service',
        sla={'availability': 99.99, 'latency_p99': 100}
    )

    # Get service
    service = catalog.get_service(service_id)

    # Build dependency graph
    deps = catalog.build_dependency_graph(service_id)

    # Search
    results = catalog.search_services('payment', filters={'team': 'payments'})

    # Deprecate API
    catalog.deprecate_api(service_id, 'v1', '2024-12-31')`,
};
