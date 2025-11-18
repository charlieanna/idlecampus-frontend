import { Challenge } from '../../types/testCase';

export const internalAutoMLPlatformChallenge: Challenge = {
  id: 'internal_automl_platform',
  title: 'Internal AutoML Platform',
  difficulty: 'advanced',
  description: `Design an AutoML platform for automated model selection and hyperparameter tuning.

Try multiple algorithms, tune hyperparameters, and select best model automatically.

Key challenges:
- Search space exploration
- Resource limits (budget, time)
- Early stopping for poor models
- Experiment tracking`,

  requirements: {
    functional: [
      'Algorithm selection (try multiple)',
      'Hyperparameter tuning (grid/random/bayesian)',
      'Early stopping for poor performers',
      'Experiment tracking',
      'Best model selection',
    ],
    traffic: '100 concurrent experiments',
    latency: 'Find best model in < 6 hours',
    availability: '99% uptime',
    budget: '$10,000/month',
  },

  availableComponents: [
    'client','app_server', 'database', 's3', 'worker_pool'],

  testCases: [
    {
      name: 'Algorithm Selection',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Try multiple algorithms automatically.',
      traffic: { type: 'training', algorithms: 5 },
      duration: 3600,
      passCriteria: { maxErrorRate: 0, bestModelFound: true },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'worker_pool', config: { workers: 100 } },
          { type: 's3', config: { storageSizeGB: 5000 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'worker_pool' },
          { from: 'worker_pool', to: 's3' },
        ],
        explanation: `Try algorithms in parallel, track in PostgreSQL`,
      },
    },
  ],

  hints: [
    {
      category: 'Search Strategy',
      items: [
        'Grid search: Exhaustive (slow)',
        'Random search: Sample randomly (faster)',
        'Bayesian optimization: Model-based (efficient)',
      ],
    },
  ],

  learningObjectives: ['AutoML', 'Hyperparameter tuning'],

  realWorldExample: `Google AutoML, H2O AutoML`,

  pythonTemplate: `class InternalAutoMLPlatform:
    def run_automl(self, dataset, max_time: int):
        algorithms = ['rf', 'xgboost', 'lightgbm']
        best_model = None
        for algo in algorithms:
            model = self._train_with_tuning(algo, dataset)
            if model.score > best_model.score:
                best_model = model
        return best_model

    def _train_with_tuning(self, algo, dataset):
        # TODO: Hyperparameter search
        pass`,
};
