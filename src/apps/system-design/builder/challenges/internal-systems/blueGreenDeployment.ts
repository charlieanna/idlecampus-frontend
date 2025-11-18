import { Challenge } from '../../types/testCase';

export const blueGreenDeploymentChallenge: Challenge = {
  id: 'blue_green_deployment',
  title: 'Blue-Green Deployment System',
  difficulty: 'advanced',
  description: `Design a blue-green deployment system for zero-downtime releases.

Maintain two identical production environments (blue and green). Deploy to inactive environment,
test, then switch traffic. Support instant rollback and database migrations.

Example workflow:
- Blue (active), Green (inactive)
- Deploy v2 to Green
- Run smoke tests on Green
- Switch traffic: Blue → Green
- Keep Blue for rollback

Key challenges:
- Database schema migrations (backward compatible)
- Stateful services (sessions, caches)
- Cost (2x infrastructure during switch)
- Instant rollback capability`,

  requirements: {
    functional: [
      'Dual environment management (blue/green)',
      'Automated traffic switching',
      'Database migration handling',
      'Smoke testing before cutover',
      'Instant rollback (<1 min)',
    ],
    traffic: '20,000 RPS',
    latency: 'Traffic switch < 30s',
    availability: '99.99% uptime',
    budget: '$12,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
  ],

  testCases: [
    {
      name: 'Environment Provisioning',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Provision green environment identical to blue.',
      traffic: { type: 'deployment', instances: 20 },
      duration: 300,
      passCriteria: { maxErrorRate: 0, provisionTime: 300 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 20, env: 'blue' } },
          { type: 'app_server', config: { instances: 20, env: 'green' } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 500 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Blue and green share same database initially`,
      },
    },
    {
      name: 'Traffic Switching',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Switch 100% traffic from blue to green.',
      traffic: { type: 'mixed', rps: 20000, readRatio: 0.8 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.001, switchTime: 30 },
      hints: [
        'Load balancer: Update backend pool (blue → green)',
        'DNS: Update if using DNS-based routing',
        'Connection draining: Wait for blue connections to finish',
        'Monitor error rates during switch',
      ],
    },
    {
      name: 'Database Migration',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Handle DB schema changes during deployment.',
      traffic: { type: 'write', rps: 1000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, backwardCompatible: true },
      hints: [
        'Expand-contract pattern: Add column, migrate, remove old',
        'Backward compatible: V2 reads/writes both old and new schema',
        'Blue still uses old schema during migration',
        'Complete migration after green is stable',
      ],
    },
    {
      name: 'Instant Rollback',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Rollback to blue in <1 min on errors.',
      traffic: { type: 'mixed', rps: 10000, readRatio: 0.8, errorSpike: true },
      duration: 60,
      passCriteria: { maxErrorRate: 0.001, rollbackTime: 60 },
      hints: [
        'Keep blue running during green deployment',
        'Automated rollback on error rate threshold',
        'Load balancer: Switch back to blue',
        'DB rollback: Revert schema if needed',
      ],
    },
  ],

  hints: [
    {
      category: 'Deployment Steps',
      items: [
        '1. Deploy to green (blue still serving traffic)',
        '2. Run smoke tests on green',
        '3. Switch traffic to green',
        '4. Monitor for errors',
        '5. Decommission blue or keep for rollback',
      ],
    },
    {
      category: 'Database Handling',
      items: [
        'Shared DB: Both use same DB (requires compatible schema)',
        'Separate DBs: Replicate data (complex)',
        'Expand-contract: Add new column, migrate, drop old',
        'Feature flags: Toggle new code paths',
      ],
    },
  ],

  learningObjectives: [
    'Blue-green deployment pattern',
    'Zero-downtime deployments',
    'Database migration strategies',
    'Traffic switching mechanisms',
  ],

  realWorldExample: `Netflix uses red-black deployments (similar to blue-green).`,

  pythonTemplate: `class BlueGreenDeployment:
    def provision_green(self, version: str):
        # TODO: Spin up green environment
        pass

    def run_smoke_tests(self, env: str) -> bool:
        # TODO: Run tests on env
        return True

    def switch_traffic(self, from_env: str, to_env: str):
        # TODO: Update load balancer
        pass

    def rollback(self):
        # TODO: Switch back to blue
        pass

# Example
deploy = BlueGreenDeployment()
deploy.provision_green('v2.0')
if deploy.run_smoke_tests('green'):
    deploy.switch_traffic('blue', 'green')`,
};
