import { Challenge } from '../../types/testCase';

export const disasterRecoveryOrchestratorChallenge: Challenge = {
  id: 'disaster_recovery_orchestrator',
  title: 'Disaster Recovery Orchestrator',
  difficulty: 'advanced',
  description: `Design a disaster recovery orchestrator to automate DR workflows.

Detect regional outages, execute DR runbooks, failover to backup region, verify data integrity,
and coordinate cross-system recovery. Minimize RTO (Recovery Time Objective) and RPO (Recovery Point Objective).

Example workflow:
- Detect region failure
- Execute DR runbook (automated steps)
- Failover database to DR region
- Restore from backups if needed
- Verify data integrity
- Switch DNS to DR region

Key challenges:
- Automated failure detection
- Cross-system coordination (DBs, caches, queues)
- Data loss minimization (RPO < 5 min)
- Fast recovery (RTO < 1 hour)`,

  requirements: {
    functional: [
      'Automated failure detection',
      'DR runbook execution',
      'Cross-system failover coordination',
      'Data integrity verification',
      'DNS/traffic cutover automation',
    ],
    traffic: 'Handle failure of primary region (50K RPS)',
    latency: 'RTO < 1 hour, RPO < 5 minutes',
    availability: '99.99% uptime after DR',
    budget: '$15,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    's3',
  ],

  testCases: [
    {
      name: 'Automated Failover',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Automatically failover to DR region on primary failure.',
      traffic: { type: 'failover', primaryDown: true },
      duration: 3600,
      passCriteria: { maxErrorRate: 0.01, rto: 3600, rpo: 300 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: { regions: 2 } },
          { type: 'app_server', config: { instances: 20, regions: 2 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000, regions: 2 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Orchestrator detects failure, promotes DR DB, updates DNS`,
      },
    },
    {
      name: 'Runbook Execution',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Execute DR runbook steps automatically.',
      traffic: { type: 'failover', primaryDown: true },
      duration: 1800,
      passCriteria: { maxErrorRate: 0, runbookSuccess: 1.0 },
      hints: [
        '1. Detect failure (health checks)',
        '2. Promote DB replica to primary',
        '3. Restore from backup if needed',
        '4. Scale up DR instances',
        '5. Update DNS',
        '6. Verify health',
      ],
    },
    {
      name: 'Data Integrity Verification',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Verify no data corruption during failover.',
      traffic: { type: 'verification', checksum: true },
      duration: 300,
      passCriteria: { maxErrorRate: 0, dataIntegrity: 1.0 },
      hints: [
        'Checksum validation for critical tables',
        'Compare record counts',
        'Verify replication lag was < RPO',
        'Test writes to new primary',
      ],
    },
  ],

  hints: [
    {
      category: 'Failure Detection',
      items: [
        'Health checks: HTTP 200 from primary',
        'Quorum-based: 3/5 monitors agree',
        'Multi-signal: DB, app, network all down',
        'Timeout: 3 consecutive failures',
      ],
    },
    {
      category: 'Recovery Steps',
      items: [
        '1. Detect failure',
        '2. Execute DR runbook',
        '3. Promote standby DB',
        '4. Restore from backup (if needed)',
        '5. Update DNS',
        '6. Verify and monitor',
      ],
    },
  ],

  learningObjectives: [
    'Disaster recovery automation',
    'RTO and RPO optimization',
    'Cross-system failover coordination',
    'Runbook automation',
  ],

  realWorldExample: `AWS uses automated DR for multi-region services.`,

  pythonTemplate: `class DisasterRecoveryOrchestrator:
    def detect_failure(self, region: str) -> bool:
        # TODO: Health checks
        return False

    def execute_runbook(self, runbook_id: str):
        # TODO: Execute steps
        pass

    def promote_standby(self, db: str):
        # TODO: Promote replica
        pass

    def update_dns(self, from_region: str, to_region: str):
        # TODO: Update DNS records
        pass

# Example
dr = DisasterRecoveryOrchestrator()
if dr.detect_failure('us-east'):
    dr.execute_runbook('primary-failure-runbook')
    dr.promote_standby('postgres-replica')
    dr.update_dns('us-east', 'us-west')`,
};
