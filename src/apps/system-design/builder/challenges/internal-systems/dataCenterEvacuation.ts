import { Challenge } from '../../types/testCase';

export const dataCenterEvacuationChallenge: Challenge = {
  id: 'data_center_evacuation',
  title: 'Data Center Evacuation (Planned Maintenance)',
  difficulty: 'advanced',
  description: `Design a system to evacuate a data center for planned maintenance without downtime.

Gradually shift traffic to other regions, migrate stateful services, verify capacity,
and handle cascading failures. Complete evacuation in < 6 hours.

Example workflow:
- Drain traffic from DC1 (10% → 50% → 100%)
- Migrate stateful services (DBs, caches)
- Verify other DCs can handle load
- Decommission DC1 for maintenance
- Restore DC1 and rebalance

Key challenges:
- Gradual traffic shifting without errors
- Stateful service migration (DBs, sessions)
- Capacity verification and autoscaling
- Preventing cascading failures`,

  requirements: {
    functional: [
      'Gradual traffic draining (DNS, load balancer)',
      'Stateful service migration',
      'Capacity verification before shift',
      'Automated rollback on errors',
      'Health monitoring during evacuation',
    ],
    traffic: '50,000 RPS across 3 DCs',
    latency: 'Evacuation complete in < 6 hours',
    availability: '99.99% uptime (zero customer impact)',
    budget: '$10,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
  ],

  testCases: [
    {
      name: 'Gradual Traffic Draining',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Shift traffic from DC1 to DC2/DC3 gradually.',
      traffic: { type: 'mixed', rps: 10000, readRatio: 0.8 },
      duration: 300,
      passCriteria: { maxErrorRate: 0.001, drainProgress: 1.0 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: { regions: 3 } },
          { type: 'app_server', config: { instances: 20, regions: 3 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000, regions: 3 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `DNS/LB routes traffic away from DC1 in steps: 100% → 50% → 0%`,
      },
    },
    {
      name: 'Stateful Migration',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Migrate DBs and caches without data loss.',
      traffic: { type: 'write', rps: 1000 },
      duration: 600,
      passCriteria: { maxErrorRate: 0, dataLoss: 0 },
      hints: [
        'DB: Promote replica in DC2 to primary',
        'Cache: Warm cache in DC2 before cutover',
        'Sessions: Replicate session data',
        'Verify replication lag < 1s before cutover',
      ],
    },
    {
      name: 'Capacity Verification',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Verify DC2/DC3 can handle increased load.',
      traffic: { type: 'spike', rps: 25000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.001, maxP99Latency: 300 },
      hints: [
        'Load test DC2/DC3 before draining DC1',
        'Autoscale instances to handle increased traffic',
        'Monitor CPU, memory, disk during test',
        'Abort if error rate > 0.1% during test',
      ],
    },
  ],

  hints: [
    {
      category: 'Traffic Draining',
      items: [
        'DNS: Update DNS to point to DC2/DC3 (TTL matters)',
        'Load balancer: Adjust weights (50/25/25 → 0/50/50)',
        'Connection draining: Wait for active connections to finish',
        'Timeline: 10min per 10% shift = 1.5 hours',
      ],
    },
    {
      category: 'Stateful Services',
      items: [
        'Databases: Failover to replica',
        'Caches: Pre-warm before cutover',
        'Message queues: Drain messages',
        'File storage: Sync to other DCs',
      ],
    },
  ],

  learningObjectives: [
    'Data center evacuation strategies',
    'Gradual traffic shifting',
    'Stateful service migration',
    'Capacity planning and verification',
  ],

  realWorldExample: `Google performs DC evacuations quarterly for maintenance.`,

  pythonTemplate: `class DataCenterEvacuation:
    def drain_traffic(self, dc: str, target_percent: int):
        # TODO: Update load balancer weights
        # TODO: Monitor error rates
        pass

    def migrate_database(self, from_dc: str, to_dc: str):
        # TODO: Promote replica to primary
        pass

    def verify_capacity(self, dcs: list) -> bool:
        # TODO: Load test
        # TODO: Check autoscaling
        return True

# Example usage
evacuation = DataCenterEvacuation()
evacuation.drain_traffic('dc1', target_percent=0)
evacuation.migrate_database('dc1', 'dc2')
evacuation.verify_capacity(['dc2', 'dc3'])`,
};
