import { Challenge } from '../../types/testCase';

export const featureStoreChallenge: Challenge = {
  id: 'feature_store',
  title: 'ML Feature Store (Uber Michelangelo / Airbnb Zipline style)',
  difficulty: 'advanced',
  description: `Design an internal Feature Store for machine learning applications.

Data scientists define features (e.g., "user_30day_purchase_count"). The system:
- Computes features from raw data (batch pipeline)
- Serves features online (<10ms) for real-time ML inference
- Maintains consistency between offline training and online serving
- Handles point-in-time correctness for historical data

Example workflow:
Training (offline):
- GET /features/user_123?timestamp=2024-01-01 → features as of Jan 1

Serving (online):
- GET /features/user_123 → latest features (<10ms for inference)

Key challenges:
- Online/offline consistency (training vs serving skew)
- Point-in-time correctness (historical feature values)
- Low latency serving (<10ms p99)
- Batch computation at scale (billions of features)`,

  requirements: {
    functional: [
      'Register feature definitions',
      'Batch compute features from raw data',
      'Serve features online (<10ms latency)',
      'Point-in-time feature lookup for training',
      'Online/offline consistency',
    ],
    traffic: '10,000 RPS feature serving, 1M features/second batch compute',
    latency: 'p99 < 10ms for online serving, 1 hour for batch',
    availability: '99.9% uptime (blocks ML inference if down)',
    budget: '$8,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Feature Registration',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Data scientists can register feature definitions.',
      traffic: {
        type: 'write',
        rps: 5,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Basic architecture:
- PostgreSQL: Feature metadata (definitions, schemas)
- S3: Historical feature values (Parquet format)
- App servers: Orchestrate feature computation`,
      },
    },

    {
      name: 'Batch Feature Computation',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Compute 100M features from raw data in 1 hour.',
      traffic: {
        type: 'write',
        rps: 30000, // 100M features / 3600 sec = 27K/sec
      },
      duration: 3600, // 1 hour
      passCriteria: {
        maxErrorRate: 0.01,
        computedFeatures: 100000000,
      },
    },

    {
      name: 'Online Feature Serving',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Serve features for real-time ML inference with <10ms p99 latency.',
      traffic: {
        type: 'read',
        rps: 10000, // Each ML inference request fetches ~50 features
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 10, // Critical for inference!
        maxErrorRate: 0.001,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 16384 } }, // 16GB for hot features
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
          { type: 'message_queue', config: { maxThroughput: 50000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Online serving architecture (critical for low latency):

**Challenge:**
- ML models need 50+ features per inference
- 10,000 RPS × 50 features = 500K feature lookups/sec
- Must complete in <10ms total!

**Solution - Multi-Tier Caching:**

**Tier 1: Redis (hot features, <1ms)**
- Store most frequently accessed features
- 16GB cache holds ~50M features
- Cache hit ratio: 95%

**Tier 2: PostgreSQL (warm features, ~10ms)**
- Features computed in last 24 hours
- Indexed by entity_id for fast lookup
- Cache misses go here

**Tier 3: S3 (cold features, ~100ms)**
- Historical features older than 24 hours
- Parquet files for efficient storage
- Rarely accessed during serving

**Feature lifecycle:**
1. Batch job computes features → write to PostgreSQL + S3
2. Hot features promoted to Redis (LRU cache)
3. Online requests hit Redis (95% of requests)
4. Cache misses → PostgreSQL → backfill Redis

**Latency breakdown:**
- 95% requests: Redis lookup ~1ms ✅
- 4% requests: PostgreSQL lookup ~10ms ✅
- 1% requests: S3 lookup ~100ms ⚠️ (acceptable for cold features)
- p99 latency: ~10ms ✅

**Cost: ~$7,500/month**
- 5 app servers: $1,000
- PostgreSQL: $2,500 (high capacity)
- Redis 16GB: $800
- S3 10TB: $230
- Message Queue: $200
- Batch workers: $2,500`,
      },
    },

    {
      name: 'Point-in-Time Correctness',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Fetch historical features as of specific timestamp for training.',
      traffic: {
        type: 'read',
        rps: 100, // Training jobs fetch historical features
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 1000, // 1 second acceptable for batch
        correctness: 'point_in_time',
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
        ],
        explanation: `Point-in-time correctness is CRITICAL for ML:

**Problem - Training/Serving Skew:**
Without point-in-time:
- Training uses TODAY's features for YESTERDAY's labels ❌
- Model sees the future (data leakage!)
- Production accuracy much worse than training

**Example:**
Label: Did user_123 purchase on Jan 1?
Feature: user_total_purchases (computed Jan 2) = 10 ❌
- Includes the Jan 1 purchase we're trying to predict!
- Model learns to cheat

**Solution - Temporal Versioning:**
Store features with timestamps:
- Jan 1 12:00am: user_total_purchases = 9 ✅
- Jan 1 11:59pm: user_total_purchases = 9 ✅
- Jan 2 12:00am: user_total_purchases = 10 ✅

**Query:**
GET /features/user_123?timestamp=2024-01-01T00:00:00
→ Returns features as of Jan 1 (value = 9)

**Implementation:**
- PostgreSQL: Recent features with timestamp index
- S3: Historical features partitioned by date (Parquet)
  - s3://features/user_total_purchases/dt=2024-01-01/part-0.parquet

**Key insight:**
Feature Store is a "time-travel database" for ML!`,
      },
    },

    // ========== CONSISTENCY REQUIREMENTS ==========
    {
      name: 'Online/Offline Consistency',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Same feature definition used for training (offline) and serving (online).',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.9,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        consistency: 'online_offline',
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Redis Failure During Serving',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Redis cache fails. System falls back to PostgreSQL (degraded latency).',
      traffic: {
        type: 'read',
        rps: 10000,
      },
      duration: 60,
      failureInjection: {
        type: 'cache_failure',
        atSecond: 20,
      },
      passCriteria: {
        minAvailability: 0.95, // Some degradation acceptable
        maxP99Latency: 50, // Degraded to PostgreSQL latency
      },
    },
  ],

  learningObjectives: [
    'Design for online/offline consistency in ML systems',
    'Implement point-in-time correctness with temporal versioning',
    'Multi-tier caching for ultra-low latency (<10ms)',
    'Batch processing at scale (billions of features)',
    'Separate hot path (serving) from cold path (training)',
  ],

  hints: [
    {
      trigger: 'test_failed:Online Feature Serving',
      message: `💡 Feature serving is too slow (>10ms)!

**Problem:**
- ML inference needs 50 features per request
- Database lookup: 10ms per feature × 50 = 500ms ❌
- Timeout!

**Solutions:**

1. **Batch feature fetch:** ⚠️
   SELECT * FROM features WHERE entity_id = 'user_123'
   → Fetch all 50 features in one query (~10ms)
   → Better but still tight

2. **Redis cache:** ✅
   Store features in Redis (key-value)
   → 50 lookups from Redis: 50 × 0.1ms = 5ms ✅

3. **Denormalized storage:** ✅✅
   Store all features for entity as single JSON blob
   → 1 Redis lookup: ~1ms ✅✅

**Best approach:**
Store denormalized: {"user_123": {"age": 25, "purchases": 10, ...}}

Add Redis for <10ms serving!`,
    },
    {
      trigger: 'test_failed:Point-in-Time Correctness',
      message: `💡 Training/serving skew detected!

**Problem:**
Training data has data leakage:
- Label: Did user purchase on Jan 1?
- Feature: user_total_purchases = 10 (includes Jan 1!)
- Model accuracy: 99% in training ✅
- Model accuracy: 60% in production ❌

**Root cause:**
Features computed TODAY used for YESTERDAY's labels

**Solution - Temporal Versioning:**
1. Store features with timestamps
2. Query: "Give me features AS OF timestamp T"
3. Ensure feature computed BEFORE label timestamp

**Implementation:**
Table: features (entity_id, feature_name, value, computed_at)
Index: (entity_id, feature_name, computed_at)

Query:
SELECT value FROM features
WHERE entity_id = 'user_123'
  AND feature_name = 'total_purchases'
  AND computed_at <= '2024-01-01T00:00:00'
ORDER BY computed_at DESC
LIMIT 1

This guarantees no data leakage!`,
    },
    {
      trigger: 'test_failed:Batch Feature Computation',
      message: `💡 Batch feature computation is too slow!

**Problem:**
Computing 100M features sequentially:
- 100M features × 10ms each = 277 hours ❌

**Solution - Parallel Batch Processing:**
1. Partition data by entity_id (hash-based)
2. Spawn 1,000 workers
3. Each worker computes 100K features
4. Write results to S3 in parallel

**Architecture:**
- Message Queue: Distribute partition tasks
- Workers: Compute features for partition
- S3: Write results (Parquet format)

**Timing:**
- 100M features ÷ 1,000 workers = 100K per worker
- 100K × 10ms = 1,000 seconds = 16 minutes ✅

Add Message Queue + parallel workers!`,
    },
  ],

  pythonTemplate: `# ML Feature Store
# Implement online serving and point-in-time correctness

from datetime import datetime
from typing import Dict, List, Optional

def register_feature(name: str, definition: dict, context: dict) -> dict:
    """
    Register a new feature definition.

    Args:
        name: Feature name (e.g., "user_30day_purchase_count")
        definition: {
            'entity': 'user',
            'value_type': 'int',
            'computation': 'SELECT COUNT(*) FROM purchases WHERE ...',
            'batch_schedule': 'daily'
        }
        context: Shared context

    Returns:
        {'feature_id': 'feat_123', 'name': 'user_30day_purchase_count', ...}
    """
    # Your code here

    return {}


def compute_features_batch(feature_name: str, entities: List[str], context: dict) -> Dict[str, any]:
    """
    Batch compute features for multiple entities.

    Args:
        feature_name: Feature to compute
        entities: List of entity IDs (e.g., ['user_1', 'user_2', ...])
        context: Shared context

    Returns:
        {
            'user_1': 10,
            'user_2': 5,
            ...
        }

    Requirements:
    - Run batch computation (SQL query or data pipeline)
    - Write results to PostgreSQL with timestamp
    - Write results to S3 (Parquet) for historical access
    """
    # Your code here

    return {}


def get_features_online(entity_id: str, feature_names: List[str], context: dict) -> Dict[str, any]:
    """
    Serve features for online ML inference (<10ms!).

    Args:
        entity_id: Entity to fetch features for
        feature_names: List of features needed
        context: Shared context

    Returns:
        {
            'user_30day_purchase_count': 10,
            'user_avg_order_value': 45.67,
            ...
        }

    Requirements:
    - Check Redis cache first (hot features)
    - Fall back to PostgreSQL if cache miss
    - Return all features in <10ms
    - Backfill Redis for future requests
    """
    # Your code here

    return {}


def get_features_point_in_time(
    entity_id: str,
    feature_names: List[str],
    timestamp: datetime,
    context: dict
) -> Dict[str, any]:
    """
    Fetch historical features as of a specific timestamp (for training).

    Args:
        entity_id: Entity to fetch features for
        feature_names: List of features needed
        timestamp: Point in time (e.g., 2024-01-01)
        context: Shared context

    Returns:
        {
            'user_30day_purchase_count': 8,  # As of Jan 1
            'user_avg_order_value': 42.50,   # As of Jan 1
            ...
        }

    Requirements:
    - Query features computed BEFORE timestamp
    - Check PostgreSQL for recent history (<30 days)
    - Fall back to S3 for older history
    - Ensure no data leakage!
    """
    # Your code here

    return {}


def backfill_features_to_cache(entity_id: str, features: dict, context: dict):
    """
    Backfill computed features to Redis cache.

    Args:
        entity_id: Entity ID
        features: Feature name → value mapping
        context: Shared context

    Requirements:
    - Store denormalized (all features as single JSON)
    - Set TTL (24 hours)
    - Use LRU eviction for hot features
    """
    # Your code here
    pass


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle Feature Store API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})
    query = request.get('query', {})

    # POST /features - Register feature
    if method == 'POST' and path == '/features':
        name = body.get('name', '')
        definition = body.get('definition', {})
        feature = register_feature(name, definition, context)
        return {'status': 201, 'body': feature}

    # GET /features/:entity_id - Online serving
    elif method == 'GET' and path.startswith('/features/'):
        entity_id = path.split('/')[-1]
        feature_names = query.get('features', '').split(',')
        timestamp = query.get('timestamp')  # Optional

        if timestamp:
            # Point-in-time query (training)
            features = get_features_point_in_time(
                entity_id,
                feature_names,
                datetime.fromisoformat(timestamp),
                context
            )
        else:
            # Online serving (inference)
            features = get_features_online(entity_id, feature_names, context)

        return {'status': 200, 'body': {'entity_id': entity_id, 'features': features}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
