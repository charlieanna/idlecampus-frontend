import { Challenge } from '../../types/testCase';

export const serviceMeshMigrationChallenge: Challenge = {
  id: 'service_mesh_migration',
  title: 'Service Mesh Migration (Monolith → Microservices)',
  difficulty: 'advanced',
  description: `Design a migration strategy from monolith to microservices using incremental decomposition.

Use strangler fig pattern to gradually extract services while maintaining system stability.
Handle API versioning, data migration, transaction boundaries, and rollback capabilities.

Example workflow:
- Extract user-service from monolith
- Route 10% traffic to new service (canary)
- Migrate data incrementally (dual-write)
- Increase traffic to 100%
- Decommission monolith code

Key challenges:
- Incremental extraction without downtime
- Dual-write for data consistency
- Transaction boundaries across services
- API versioning and compatibility`,

  requirements: {
    functional: [
      'Incremental service extraction (strangler fig)',
      'Traffic splitting between monolith and microservice',
      'Dual-write data migration',
      'API version management',
      'Rollback capability at each step',
    ],
    traffic: '10,000 RPS during migration',
    latency: 'No latency regression during migration',
    availability: '99.99% uptime (zero downtime migration)',
    budget: '$8,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'service_mesh',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Strangler Fig Pattern',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gradually route traffic from monolith to microservice.',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRatio: 0.7,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        migrationProgress: 0.5, // 50% traffic migrated
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'service_mesh', config: {} },
          { type: 'app_server', config: { instances: 5, legacy: true } },
          { type: 'app_server', config: { instances: 3, microservice: true } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 500 } },
          { type: 'kafka', config: { partitions: 20 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'service_mesh' },
          { from: 'service_mesh', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'kafka' },
        ],
        explanation: `Architecture:
- Service mesh routes traffic (10% → 50% → 100%)
- Both monolith and microservice access same DB
- Dual-write via Kafka for data migration
- Gradual cutover minimizes risk`,
      },
    },

    {
      name: 'Dual-Write Data Migration',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Write to both old and new data stores during migration.',
      traffic: {
        type: 'write',
        rps: 500,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        dataConsistency: 1.0, // 100% consistent
      },
      hints: [
        'Write to old DB, async write to new DB (Kafka)',
        'Verify data consistency periodically',
        'Backfill historical data',
        'Cutover: Read from new, write to new',
      ],
    },

    {
      name: 'API Versioning',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Support multiple API versions during migration.',
      traffic: {
        type: 'mixed',
        rps: 800,
        readRatio: 0.8,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        backwardCompatibility: 1.0,
      },
      hints: [
        'Version in URL: /v1/users vs /v2/users',
        'Version in header: Accept: application/vnd.api+json;version=2',
        'Adapter pattern: Convert v1 to v2 internally',
        'Deprecation timeline: 90 days notice',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'No Performance Regression',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Maintain p99 latency during migration.',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.7,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 200, // Same as before migration
      },
      hints: [
        'Service mesh adds <5ms overhead',
        'Async dual-write (don\'t block requests)',
        'Cache in microservice (reduce DB load)',
        'Load test before increasing traffic %',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Incremental Decomposition',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Extract 10 microservices from monolith over 6 months.',
      traffic: {
        type: 'mixed',
        rps: 5000,
        readRatio: 0.7,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        servicesExtracted: 10,
      },
      hints: [
        'Prioritize: Low coupling, high cohesion services',
        'Extract leaf services first (no dependencies)',
        'One service at a time (reduce risk)',
        'Automation: Code generation, data migration scripts',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Rollback Capability',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Roll back migration if errors spike.',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRatio: 0.7,
        errorSpike: true,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0.001, // After rollback
        rollbackTime: 60, // <1 min
      },
      hints: [
        'Service mesh: Route 100% back to monolith',
        'Keep old code running during migration',
        'Automated rollback on error rate threshold',
        'Feature flags for gradual enable/disable',
      ],
    },
  ],

  hints: [
    {
      category: 'Migration Strategy',
      items: [
        'Strangler fig: Gradually replace monolith',
        'Big bang: All at once (high risk)',
        'Hybrid: Core in monolith, new features in microservices',
        'Timeline: 6-12 months for full migration',
      ],
    },
    {
      category: 'Service Boundaries',
      items: [
        'Domain-driven design: Bounded contexts',
        'Low coupling: Minimal dependencies',
        'High cohesion: Related functionality together',
        'Data ownership: Each service owns its data',
      ],
    },
    {
      category: 'Data Migration',
      items: [
        'Phase 1: Dual-write (old primary, new secondary)',
        'Phase 2: Verify consistency',
        'Phase 3: Dual-read (compare results)',
        'Phase 4: Cutover (new primary, old deprecated)',
      ],
    },
    {
      category: 'Transaction Boundaries',
      items: [
        'Monolith: ACID transactions',
        'Microservices: Eventual consistency (saga pattern)',
        'Compensating transactions for rollback',
        'Avoid distributed transactions (2PC)',
      ],
    },
  ],

  learningObjectives: [
    'Strangler fig migration pattern',
    'Incremental service decomposition',
    'Dual-write data migration strategy',
    'API versioning and compatibility',
    'Transaction boundaries in microservices',
  ],

  realWorldExample: `**Amazon:**
- 2001-2006: Gradual migration from monolith
- Service-oriented architecture (SOA)
- Two-pizza teams own services
- API-first development

**Netflix:**
- 2008-2011: Monolith to microservices
- Strangler pattern over 3 years
- Incremental AWS migration
- Chaos engineering for resilience

**Uber:**
- 2014-2016: Monolithic Python to microservices
- Domain-driven design
- API gateway for routing
- 2000+ microservices today`,

  pythonTemplate: `from typing import Dict, List
from enum import Enum

class MigrationPhase(Enum):
    STRANGLER = 'strangler'  # Route traffic
    DUAL_WRITE = 'dual_write'  # Write to both
    DUAL_READ = 'dual_read'  # Read from both, compare
    CUTOVER = 'cutover'  # New is primary

class ServiceMeshMigration:
    def __init__(self):
        self.service_mesh = None
        self.monolith = None
        self.microservices = {}

    def route_traffic(self, service: str, monolith_percent: int,
                     microservice_percent: int):
        """Route traffic between monolith and microservice."""
        # TODO: Configure service mesh routing rules
        # TODO: Gradual shift: 90/10 → 50/50 → 0/100
        # TODO: Monitor error rates
        pass

    def dual_write(self, service: str, data: Dict):
        """Write to both old and new data stores."""
        # TODO: Write to monolith DB (synchronous)
        # TODO: Async write to microservice DB (via Kafka)
        # TODO: Handle write failures
        pass

    def verify_consistency(self, service: str, sample_size: int) -> float:
        """Verify data consistency between old and new."""
        # TODO: Sample records from both stores
        # TODO: Compare values
        # TODO: Return consistency percentage
        return 0.99  # 99% consistent

    def backfill_data(self, service: str, start_id: int, end_id: int):
        """Backfill historical data to new data store."""
        # TODO: Read from old DB in batches
        # TODO: Transform if needed
        # TODO: Write to new DB
        # TODO: Track progress
        pass

    def version_api(self, endpoint: str, version: int) -> str:
        """Create versioned API endpoint."""
        # TODO: Route /v1/users to monolith
        # TODO: Route /v2/users to microservice
        # TODO: Adapter for v1 → v2 conversion
        return f"/v{version}/{endpoint}"

    def extract_service(self, service_name: str, domain: str) -> str:
        """Extract service from monolith."""
        # TODO: Identify service boundaries
        # TODO: Create new microservice
        # TODO: Extract code and tests
        # TODO: Setup data store
        # TODO: Deploy service
        # TODO: Return service ID
        pass

    def rollback(self, service: str):
        """Rollback migration to monolith."""
        # TODO: Route 100% traffic to monolith
        # TODO: Disable dual-write
        # TODO: Alert team
        # TODO: Investigate errors
        pass

    def monitor_migration(self, service: str) -> Dict:
        """Monitor migration health."""
        # TODO: Track error rates
        # TODO: Compare latencies
        # TODO: Check data consistency
        # TODO: Return health metrics
        return {
            'error_rate': 0.001,
            'latency_p99': 150,
            'consistency': 0.99,
            'traffic_split': {'monolith': 30, 'microservice': 70}
        }

# Example usage
if __name__ == '__main__':
    migration = ServiceMeshMigration()

    # Extract service
    service_id = migration.extract_service(
        service_name='user-service',
        domain='user_management'
    )

    # Phase 1: Start routing (10% traffic)
    migration.route_traffic('user-service',
                           monolith_percent=90,
                           microservice_percent=10)

    # Phase 2: Dual-write
    migration.dual_write('user-service', {'id': 123, 'name': 'Alice'})

    # Phase 3: Backfill
    migration.backfill_data('user-service', start_id=1, end_id=1000000)

    # Phase 4: Verify
    consistency = migration.verify_consistency('user-service', sample_size=10000)

    # Phase 5: Increase traffic
    migration.route_traffic('user-service',
                           monolith_percent=0,
                           microservice_percent=100)

    # Monitor
    health = migration.monitor_migration('user-service')

    # Rollback if needed
    if health['error_rate'] > 0.01:
        migration.rollback('user-service')`,
};
