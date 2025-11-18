import { Challenge } from '../../types/testCase';

export const modelMonitoringDriftChallenge: Challenge = {
  id: 'model_monitoring_drift',
  title: 'Model Monitoring & Drift Detection',
  difficulty: 'advanced',
  description: `Design a system to monitor ML model performance and detect data/concept drift.

Track prediction accuracy, feature distributions, and detect when model needs retraining.

Key challenges:
- Real-time performance tracking
- Statistical drift detection
- Alerting on degradation
- Retraining triggers`,

  requirements: {
    functional: [
      'Track model accuracy metrics',
      'Detect data drift (feature distribution changes)',
      'Detect concept drift (relationship changes)',
      'Alert on performance degradation',
      'Trigger retraining workflows',
    ],
    traffic: '50,000 predictions/sec to monitor',
    latency: 'Drift detection < 5 minutes',
    availability: '99.9% uptime',
    budget: '$5,000/month',
  },

  availableComponents: [
    'client','app_server', 'database', 'cache', 'message_queue', 'analytics_db'],

  testCases: [
    {
      name: 'Performance Tracking',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Track model accuracy in real-time.',
      traffic: { type: 'predictions', rps: 10000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, trackingLatency: 5000 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'kafka', config: { partitions: 20 } },
          { type: 'clickhouse', config: { nodes: 2 } },
          { type: 'redis', config: { memorySizeGB: 8 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'clickhouse' },
        ],
        explanation: `Stream predictions to Kafka, aggregate in ClickHouse`,
      },
    },
    {
      name: 'Drift Detection',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Detect when feature distributions change.',
      traffic: { type: 'drift', featureShift: true },
      duration: 300,
      passCriteria: { maxErrorRate: 0, driftDetected: true },
      hints: [
        'Compare distributions (KS test, PSI)',
        'Track feature statistics (mean, std)',
        'Alert when PSI > 0.2',
      ],
    },
  ],

  hints: [
    {
      category: 'Drift Metrics',
      items: [
        'Data drift: Feature distribution changes (PSI, KS test)',
        'Concept drift: Target relationship changes',
        'Alert threshold: PSI > 0.2 = retrain',
      ],
    },
  ],

  learningObjectives: ['Model monitoring', 'Drift detection'],

  realWorldExample: `Netflix monitors model performance continuously.`,

  pythonTemplate: `class ModelMonitoringDrift:
    def track_prediction(self, features: dict, prediction, actual):
        # TODO: Log to ClickHouse
        pass

    def detect_drift(self, current_data, reference_data) -> bool:
        # TODO: Statistical tests
        psi = self._calculate_psi(current_data, reference_data)
        return psi > 0.2

    def _calculate_psi(self, current, reference) -> float:
        # TODO: Population Stability Index
        return 0.15`,
};
