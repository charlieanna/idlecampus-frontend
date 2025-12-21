import { GuidedTutorial } from '../../types/guidedTutorial';

export const codeDeploymentProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'code-deployment-progressive',
  title: 'Design a Code Deployment System',
  description: 'Build a deployment platform from simple pushes to global continuous delivery',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design CI/CD pipeline with build and test stages',
    'Implement deployment strategies (rolling, blue-green, canary)',
    'Build artifact management and versioning',
    'Handle rollbacks and deployment observability',
    'Scale to multi-region deployments'
  ],
  prerequisites: ['DevOps basics', 'Container orchestration', 'Distributed systems'],
  tags: ['deployment', 'ci-cd', 'devops', 'kubernetes', 'infrastructure'],

  progressiveStory: {
    title: 'Code Deployment Evolution',
    premise: "You're building a deployment platform for a large engineering organization. Starting with simple push-to-deploy, you'll evolve to handle thousands of deployments daily with zero downtime and automatic rollbacks.",
    phases: [
      { phase: 1, title: 'Basic Pipeline', description: 'Build, test, and deploy' },
      { phase: 2, title: 'Safe Deployments', description: 'Strategies for zero downtime' },
      { phase: 3, title: 'Observability', description: 'Monitoring and automatic rollbacks' },
      { phase: 4, title: 'Global Scale', description: 'Multi-region and fleet management' }
    ]
  },

  steps: [
    // PHASE 1: Basic Pipeline (Steps 1-3)
    {
      id: 'step-1',
      title: 'Build Pipeline',
      phase: 1,
      phaseTitle: 'Basic Pipeline',
      learningObjective: 'Automate code compilation and packaging',
      thinkingFramework: {
        framework: 'Reproducible Builds',
        approach: 'Triggered by git push. Fetch code, install dependencies, compile, package artifact. Same commit = same artifact (deterministic).',
        keyInsight: 'Build isolation: each build in clean container. No shared state between builds. Pin dependency versions for reproducibility.'
      },
      requirements: {
        functional: [
          'Trigger build on git push',
          'Clone repository and install dependencies',
          'Compile/build the application',
          'Package as deployable artifact (Docker image, JAR)'
        ],
        nonFunctional: [
          'Build time < 10 minutes for average repo'
        ]
      },
      hints: [
        'Build: {id, commit, status, started_at, logs}',
        'Container per build for isolation',
        'Cache dependencies between builds for speed'
      ],
      expectedComponents: ['Build Trigger', 'Build Worker', 'Artifact Store'],
      successCriteria: ['Builds triggered automatically', 'Artifacts created'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Test Automation',
      phase: 1,
      phaseTitle: 'Basic Pipeline',
      learningObjective: 'Run automated tests before deployment',
      thinkingFramework: {
        framework: 'Quality Gates',
        approach: 'Unit tests → integration tests → E2E tests. Fail fast: stop pipeline on first failure. Test results determine deploy eligibility.',
        keyInsight: 'Parallelize tests for speed. 1000 tests sequential = 30 min. Split across 10 workers = 3 min. Report aggregated results.'
      },
      requirements: {
        functional: [
          'Run unit tests after build',
          'Run integration tests with test databases',
          'Block deployment on test failures',
          'Report test results with coverage'
        ],
        nonFunctional: [
          'Test stage < 15 minutes'
        ]
      },
      hints: [
        'Test result: {passed, failed, skipped, duration}',
        'Parallel: shard tests by file/class',
        'Flaky test detection: track test stability over time'
      ],
      expectedComponents: ['Test Runner', 'Test Splitter', 'Result Aggregator'],
      successCriteria: ['Tests run automatically', 'Failures block deploy'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Basic Deployment',
      phase: 1,
      phaseTitle: 'Basic Pipeline',
      learningObjective: 'Deploy artifacts to target environment',
      thinkingFramework: {
        framework: 'Push-Based Deployment',
        approach: 'Pipeline pushes artifact to servers. Replace old version with new. Simple but causes downtime during switch.',
        keyInsight: 'Environment configuration separate from artifact. Same artifact deployed to staging and production with different configs.'
      },
      requirements: {
        functional: [
          'Deploy artifact to target servers',
          'Configure environment-specific settings',
          'Track deployment status',
          'Support multiple environments (staging, production)'
        ],
        nonFunctional: [
          'Deployment < 5 minutes'
        ]
      },
      hints: [
        'Deployment: {id, artifact, environment, status, deployed_at}',
        'Config injection: env vars, config files, secrets',
        'Health check after deploy to verify success'
      ],
      expectedComponents: ['Deployment Service', 'Environment Manager', 'Health Checker'],
      successCriteria: ['Deployments complete successfully', 'Health verified'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Safe Deployments (Steps 4-6)
    {
      id: 'step-4',
      title: 'Rolling Deployment',
      phase: 2,
      phaseTitle: 'Safe Deployments',
      learningObjective: 'Deploy without downtime using rolling updates',
      thinkingFramework: {
        framework: 'Incremental Rollout',
        approach: 'Update instances one-by-one. Old and new versions run simultaneously during rollout. Zero downtime if done correctly.',
        keyInsight: 'Batch size determines speed vs safety. Update 10% at a time = slower but safer. 50% = faster but more exposure if bad.'
      },
      requirements: {
        functional: [
          'Update instances in batches',
          'Maintain minimum healthy instances during rollout',
          'Drain connections before stopping old instance',
          'Health check new instances before proceeding'
        ],
        nonFunctional: [
          'Zero downtime during deployment',
          'Rollout < 30 minutes for 100 instances'
        ]
      },
      hints: [
        'maxUnavailable: 25% (at most 25% down at once)',
        'maxSurge: 25% (at most 25% extra during rollout)',
        'Health check: wait for ready before removing old'
      ],
      expectedComponents: ['Rolling Updater', 'Connection Drainer', 'Batch Controller'],
      successCriteria: ['Zero downtime achieved', 'Rollout controlled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Blue-Green Deployment',
      phase: 2,
      phaseTitle: 'Safe Deployments',
      learningObjective: 'Instant rollback with parallel environments',
      thinkingFramework: {
        framework: 'Environment Switching',
        approach: 'Two identical environments: blue (current) and green (new). Deploy to green, test, switch traffic. Instant rollback: switch back to blue.',
        keyInsight: 'Requires 2x resources during transition. Trade cost for instant rollback capability. Database migrations are tricky.'
      },
      requirements: {
        functional: [
          'Maintain two parallel environments',
          'Deploy new version to inactive environment',
          'Switch traffic between environments',
          'Instant rollback by switching back'
        ],
        nonFunctional: [
          'Traffic switch < 1 second',
          'Rollback < 1 second'
        ]
      },
      hints: [
        'Load balancer routes to active environment',
        'DNS switch or LB config change for traffic switch',
        'Run smoke tests on green before switch'
      ],
      expectedComponents: ['Environment Manager', 'Traffic Switcher', 'Smoke Tester'],
      successCriteria: ['Instant switch works', 'Rollback is instant'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Canary Deployment',
      phase: 2,
      phaseTitle: 'Safe Deployments',
      learningObjective: 'Test with small percentage of traffic',
      thinkingFramework: {
        framework: 'Progressive Traffic Shift',
        approach: 'Send 1% of traffic to new version (canary). Monitor metrics. If good, increase to 10%, 50%, 100%. If bad, route all traffic back to stable.',
        keyInsight: 'Canary catches issues that tests miss. Real user traffic reveals production-only bugs. Small blast radius limits impact.'
      },
      requirements: {
        functional: [
          'Route percentage of traffic to canary',
          'Monitor canary metrics vs baseline',
          'Gradually increase canary percentage',
          'Auto-rollback if metrics degrade'
        ],
        nonFunctional: [
          'Traffic split accuracy within 1%'
        ]
      },
      hints: [
        'Traffic split: 1% → 10% → 50% → 100%',
        'Compare: canary_error_rate vs baseline_error_rate',
        'Promotion criteria: error rate < baseline + 0.1%'
      ],
      expectedComponents: ['Traffic Splitter', 'Canary Analyzer', 'Progressive Promoter'],
      successCriteria: ['Traffic splits correctly', 'Bad canaries caught'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Observability (Steps 7-9)
    {
      id: 'step-7',
      title: 'Deployment Monitoring',
      phase: 3,
      phaseTitle: 'Observability',
      learningObjective: 'Track deployment health and progress',
      thinkingFramework: {
        framework: 'Real-Time Visibility',
        approach: 'Dashboard showing: deployment status, instances updated, health checks, error rates. Know deployment state at a glance.',
        keyInsight: 'Deployment is not done when code is pushed. Done when all instances healthy and metrics stable. Track full lifecycle.'
      },
      requirements: {
        functional: [
          'Track deployment progress (% complete)',
          'Show instance-level status',
          'Display health check results',
          'Alert on deployment failures'
        ],
        nonFunctional: [
          'Status update < 5 seconds'
        ]
      },
      hints: [
        'Progress: deployed_instances / total_instances',
        'Health: instance → {status: healthy/unhealthy, last_check}',
        'Timeline: deployment events with timestamps'
      ],
      expectedComponents: ['Deployment Tracker', 'Health Monitor', 'Status Dashboard'],
      successCriteria: ['Status visible in real-time', 'Failures alerted'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Automatic Rollback',
      phase: 3,
      phaseTitle: 'Observability',
      learningObjective: 'Detect failures and rollback automatically',
      thinkingFramework: {
        framework: 'Self-Healing Deployments',
        approach: 'Monitor error rate, latency, crash rate post-deploy. If metrics degrade beyond threshold, automatically rollback without human intervention.',
        keyInsight: 'Time window matters. Compare 5 min post-deploy to 5 min pre-deploy. Natural variance vs real regression.'
      },
      requirements: {
        functional: [
          'Monitor metrics post-deployment',
          'Define rollback thresholds',
          'Trigger automatic rollback on degradation',
          'Notify team of rollback'
        ],
        nonFunctional: [
          'Rollback decision < 5 minutes post-deploy',
          'Rollback execution < 2 minutes'
        ]
      },
      hints: [
        'Thresholds: error_rate > 5%, latency_p99 > 2x baseline',
        'Comparison window: 5 min post vs 5 min pre',
        'Rollback: redeploy previous artifact version'
      ],
      expectedComponents: ['Metric Analyzer', 'Rollback Trigger', 'Version Manager'],
      successCriteria: ['Bad deploys auto-rollback', 'Team notified'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Deployment History & Audit',
      phase: 3,
      phaseTitle: 'Observability',
      learningObjective: 'Track all deployments for compliance and debugging',
      thinkingFramework: {
        framework: 'Audit Trail',
        approach: 'Log every deployment: who, what, when, where. Immutable history. Required for compliance (SOC2, HIPAA). Enables debugging.',
        keyInsight: 'Deployment logs answer: "What changed at 3am that broke things?" Correlation between deploys and incidents.'
      },
      requirements: {
        functional: [
          'Record all deployment events',
          'Track who triggered deployment',
          'Store deployment configuration snapshot',
          'Enable search and filtering'
        ],
        nonFunctional: [
          'Audit logs retained 7 years',
          'Search < 5 seconds'
        ]
      },
      hints: [
        'Event: {deploy_id, user, artifact, config_hash, timestamp, result}',
        'Immutable: append-only log',
        'Index: by time, user, artifact, environment'
      ],
      expectedComponents: ['Audit Logger', 'Event Store', 'Search Index'],
      successCriteria: ['All deploys logged', 'Searchable history'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Global Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Multi-Region Deployment',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Deploy across geographic regions',
      thinkingFramework: {
        framework: 'Regional Coordination',
        approach: 'Deploy region-by-region. Start with lowest traffic region (test). If good, roll to next. Bad region doesnt affect others.',
        keyInsight: 'Region isolation limits blast radius. US-West deploy failure doesnt impact EU. But introduces complexity in coordination.'
      },
      requirements: {
        functional: [
          'Deploy to regions in configurable order',
          'Wait for region health before proceeding',
          'Support region-specific rollback',
          'Handle region unavailability gracefully'
        ],
        nonFunctional: [
          'Full global rollout < 2 hours'
        ]
      },
      hints: [
        'Order: canary-region → low-traffic → high-traffic',
        'Region gate: all health checks pass before next region',
        'Partial rollback: only affected regions'
      ],
      expectedComponents: ['Region Coordinator', 'Regional Deployer', 'Region Health Aggregator'],
      successCriteria: ['Regions deploy sequentially', 'Bad region isolated'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Feature Flags',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Decouple deployment from feature release',
      thinkingFramework: {
        framework: 'Release Toggles',
        approach: 'Deploy code with feature behind flag. Enable flag separately. Instant enable/disable without deploy. Gradual rollout by user percentage.',
        keyInsight: 'Deployment != release. Deploy dark (flag off), then enable for 1% users, 10%, 100%. Separate deploy risk from feature risk.'
      },
      requirements: {
        functional: [
          'Define feature flags with targeting rules',
          'Evaluate flags in application code',
          'Gradual rollout by percentage or user segment',
          'Instant kill switch without deployment'
        ],
        nonFunctional: [
          'Flag evaluation < 10ms'
        ]
      },
      hints: [
        'Flag: {name, enabled, percentage, user_ids, rules}',
        'SDK: isFeatureEnabled(flag, user_context)',
        'Cache flags locally, sync periodically'
      ],
      expectedComponents: ['Flag Service', 'Flag SDK', 'Targeting Engine'],
      successCriteria: ['Flags control features', 'Instant toggle works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Fleet Management',
      phase: 4,
      phaseTitle: 'Global Scale',
      learningObjective: 'Manage deployments across thousands of services',
      thinkingFramework: {
        framework: 'Multi-Service Orchestration',
        approach: 'Enterprise has 1000s of services. Centralized deployment platform. Service catalog, dependency tracking, deploy coordination.',
        keyInsight: 'Service dependencies affect deploy order. Cant deploy auth service before gateway service updates to handle new auth API.'
      },
      requirements: {
        functional: [
          'Register and catalog services',
          'Track service dependencies',
          'Coordinate multi-service deployments',
          'Dashboard for fleet-wide visibility'
        ],
        nonFunctional: [
          'Support 1000+ services',
          'Dependency resolution < 1 second'
        ]
      },
      hints: [
        'Service: {name, repo, owners, dependencies, config}',
        'Dependency graph: topological sort for deploy order',
        'Batch deploy: group independent services'
      ],
      expectedComponents: ['Service Catalog', 'Dependency Graph', 'Fleet Dashboard'],
      successCriteria: ['Services tracked centrally', 'Dependencies respected'],
      estimatedTime: '8 minutes'
    }
  ]
};
