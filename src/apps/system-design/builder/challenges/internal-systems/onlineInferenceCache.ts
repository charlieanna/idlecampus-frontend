import { Challenge } from '../../types/testCase';

export const onlineInferenceCacheChallenge: Challenge = {
  id: 'online_inference_cache',
  title: 'Online Inference Cache for ML Predictions',
  difficulty: 'advanced',
  description: `Design a caching layer for ML model predictions to reduce latency and cost.

Cache predictions and features with smart invalidation based on model updates and data freshness.
Balance cache hit rate with prediction accuracy.

Key challenges:
- Cache key design (features hash)
- Invalidation on model updates
- TTL based on prediction confidence
- Freshness vs latency tradeoff`,

  requirements: {
    functional: [
      'Cache predictions with feature-based keys',
      'Invalidate on model version updates',
      'TTL based on confidence scores',
      'Feature value caching',
      'Cache hit rate monitoring',
    ],
    traffic: '100,000 predictions/sec',
    latency: 'Cache hit < 1ms, miss = model inference time',
    availability: '99.9% uptime',
    budget: '$4,000/month',
  },

  availableComponents: [
    'client','app_server', 'cache', 'database', 'message_queue'],

  testCases: [
    {
      name: 'Feature-Based Caching',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Cache predictions using feature hash as key.',
      traffic: { type: 'predictions', rps: 10000, cacheHitRate: 0.6 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, maxCacheLatency: 1, cacheHitRate: 0.6 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 10 } },
          { type: 'redis', config: { memorySizeGB: 32 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 200 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Redis caches predictions, keyed by hash(features)`,
      },
    },
    {
      name: 'Model Update Invalidation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Invalidate cache when model version changes.',
      traffic: { type: 'predictions', rps: 5000, modelUpdate: true },
      duration: 30,
      passCriteria: { maxErrorRate: 0, staleRates: 0 },
      hints: [
        'Include model_version in cache key',
        'Flush all cache on major model update',
        'Gradual invalidation for canary deploys',
      ],
    },
  ],

  hints: [
    {
      category: 'Cache Key Design',
      items: [
        'Key: hash(model_version + feature_values)',
        'Round numeric features to reduce cardinality',
        'Sort features for consistent hashing',
      ],
    },
  ],

  learningObjectives: ['ML prediction caching', 'Cache invalidation strategies'],

  realWorldExample: `Uber caches predictions for fraud detection.`,

  pythonTemplate: `import hashlib

class OnlineInferenceCache:
    def __init__(self):
        self.cache = None  # Redis

    def get_prediction(self, features: dict, model_version: str):
        cache_key = self._generate_key(features, model_version)
        cached = self.cache.get(cache_key)
        if cached:
            return cached
        # Call model
        prediction = self._run_model(features, model_version)
        self.cache.set(cache_key, prediction, ttl=3600)
        return prediction

    def _generate_key(self, features: dict, model_version: str) -> str:
        feature_str = ':'.join(f'{k}={v}' for k, v in sorted(features.items()))
        return hashlib.md5(f'{model_version}:{feature_str}'.encode()).hexdigest()

    def _run_model(self, features: dict, model_version: str):
        # TODO: Run ML model
        pass`,
};
