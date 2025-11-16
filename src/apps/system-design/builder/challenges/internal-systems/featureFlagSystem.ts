import { Challenge } from '../../types/testCase';

export const featureFlagSystemChallenge: Challenge = {
  id: 'feature_flag_system',
  title: 'Feature Flag Management System',
  difficulty: 'advanced',
  description: `Design an internal feature flag system for safely rolling out new features.

Engineers can:
- Create feature flags with targeting rules (% rollout, user segments, geo)
- Dynamically enable/disable features without redeploying
- Run A/B tests by splitting traffic
- Emergency kill switch for bad features

Example:
- Flag "new_checkout" → enabled for 5% of users
- Flag "premium_features" → enabled for premium_tier users
- Flag "dark_mode" → enabled in US, disabled in EU

Key challenges:
- Low latency evaluation (<1ms) - flags checked on EVERY request
- Real-time propagation (flag update → all servers in <10 seconds)
- Complex targeting (user_id, geo, device, subscription_tier)
- Consistency (all servers see same flag state)`,

  requirements: {
    functional: [
      'Create/update/delete feature flags',
      'Gradual percentage rollouts (0% → 100%)',
      'User targeting (by ID, segment, attributes)',
      'Real-time flag updates (<10 sec propagation)',
      'Flag evaluation <1ms (critical path!)',
    ],
    traffic: '50,000 RPS flag evaluations, 10 RPS flag updates',
    latency: 'p99 < 1ms for evaluation, < 10s for propagation',
    availability: '99.99% uptime (flags in critical path)',
    budget: '$1,500/month',
  },

  availableComponents: [
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
      name: 'Basic Flag Evaluation',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Evaluate feature flags with simple on/off state.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 10, // 10ms acceptable initially
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'redis', config: { maxMemoryMB: 512 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Basic architecture:
- PostgreSQL: Source of truth for flag configs
- Redis: Fast in-memory cache for evaluations
- App servers: Load flags into local memory for <1ms eval`,
      },
    },

    {
      name: 'Percentage Rollout',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Enable flag for exactly 25% of users (consistent hash-based targeting).',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        consistencyCheck: 'enabled_users_percentage >= 24.5 && <= 25.5', // Within 0.5%
      },
    },

    {
      name: 'Real-time Flag Update',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Update flag in database → all app servers see new value within 10 seconds.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 60,
      flagUpdate: {
        atSecond: 20,
        flagName: 'new_checkout',
        newValue: true,
      },
      passCriteria: {
        maxPropagationDelay: 10, // seconds
        maxErrorRate: 0,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'redis', config: { maxMemoryMB: 512 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
          { type: 'message_queue', config: { maxThroughput: 1000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Real-time propagation strategy:

**Challenge:**
- App servers cache flags in memory for <1ms evaluation
- Cache update strategy needed for consistency

**Solutions:**
1. Polling: Servers poll database every 5 seconds ❌ (wasteful)
2. TTL: Flags expire after 10 seconds ⚠️ (inconsistent window)
3. Pub/Sub: Push updates via message queue ✅ (instant!)

**Pub/Sub approach:**
1. Admin updates flag in PostgreSQL
2. Publish "flag_updated:new_checkout" to message queue
3. All app servers subscribed → receive update instantly
4. App servers reload flag from Redis/DB
5. Propagation complete in <5 seconds ✅

**Key insight:**
Message queue enables real-time cache invalidation!`,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High-Frequency Evaluation',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50,000 flag evaluations per second with <1ms p99 latency.',
      traffic: {
        type: 'read',
        rps: 50000, // Every request checks multiple flags!
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 1, // <1ms critical!
        maxErrorRate: 0.001,
        maxMonthlyCost: 1500,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 1024 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 200 } },
          { type: 'message_queue', config: { maxThroughput: 1000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Achieving <1ms flag evaluation:

**Why this is hard:**
- 50,000 RPS = 50K flag evals/sec
- Network call to Redis: ~2-5ms ❌
- Network call to PostgreSQL: ~10-20ms ❌❌
- Must evaluate in-process!

**Solution - Local In-Memory Cache:**
1. App servers load ALL flags into memory on startup
2. Subscribe to flag update events via message queue
3. Reload flags when updates published
4. Evaluate flags locally (hash lookup): ~0.01ms ✅

**Architecture:**
- PostgreSQL: Source of truth (low traffic)
- Redis: Optional warm cache for initial load
- Message Queue: Push flag updates to all servers
- App Servers: Evaluate flags in local memory

**Memory usage:**
- 1,000 flags × 1KB each = 1MB per server
- Easily fits in memory!

**Cost: ~$1,400/month**
- 5 app servers: $1,000
- PostgreSQL: $200
- Redis: $100
- Message Queue: $50
- Load Balancer: $50`,
      },
    },

    {
      name: 'Complex Targeting Rules',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Evaluate flags with complex rules (user_id + geo + subscription) in <1ms.',
      traffic: {
        type: 'read',
        rps: 30000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 1,
        maxErrorRate: 0.001,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Redis Failure - Degraded Mode',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Redis cache fails. App servers continue using in-memory flags.',
      traffic: {
        type: 'read',
        rps: 50000,
      },
      duration: 60,
      failureInjection: {
        type: 'cache_failure',
        atSecond: 20,
      },
      passCriteria: {
        minAvailability: 0.99, // Should barely notice
        maxP99Latency: 1,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 1024 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 200 } },
          { type: 'message_queue', config: { maxThroughput: 1000 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'message_queue' },
        ],
        explanation: `Resilience strategy for feature flags:

**Why in-memory cache is critical:**
- Flags are evaluated on EVERY request
- If evaluation fails → entire request fails ❌
- Cannot afford downtime!

**Degraded mode behavior:**
1. Redis fails at second 20
2. App servers continue using local in-memory flags ✅
3. No new flag updates propagate (stuck at last known state)
4. Evaluations continue at <1ms latency
5. 99%+ availability maintained!

**Trade-off:**
- High availability for reads ✅
- Cannot update flags during Redis outage ⚠️
- Acceptable: flag updates are rare (10 RPS vs 50K RPS reads)

**Key insight:**
Feature flags should degrade to "last known good state" - never fail open!`,
      },
    },

    {
      name: 'Database Failure - Stale Flags',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'Database fails. App servers continue with cached flags (stale data acceptable).',
      traffic: {
        type: 'read',
        rps: 50000,
      },
      duration: 120,
      failureInjection: {
        type: 'db_crash',
        atSecond: 30,
      },
      passCriteria: {
        minAvailability: 0.99,
        maxP99Latency: 1,
      },
    },
  ],

  learningObjectives: [
    'Design for ultra-low latency (<1ms) with in-memory evaluation',
    'Real-time cache invalidation with pub/sub',
    'Consistent hashing for percentage rollouts',
    'Degrade gracefully to last known state',
    'Handle flag updates separate from evaluations (read vs write path)',
  ],

  hints: [
    {
      trigger: 'test_failed:High-Frequency Evaluation',
      message: `💡 Flag evaluations are too slow (>1ms)!

**Problem:**
- Network call to Redis: 2-5ms ❌
- Network call to PostgreSQL: 10-20ms ❌❌
- 50,000 RPS × 5ms = 250,000ms total = BOTTLENECK

**Solution - In-Memory Evaluation:**
1. Load ALL flags into app server memory on startup
2. Evaluate flags locally (hash map lookup: 0.01ms)
3. Subscribe to flag update events (message queue)
4. Reload flags when updates published

**Why this works:**
- 1,000 flags × 1KB = 1MB memory (trivial!)
- Hash lookup: O(1) constant time
- No network latency!

**Architecture:**
App Server Memory: {flags: {"new_checkout": {enabled: true, rollout: 0.25}}}
Evaluation: flags["new_checkout"].evaluate(user_id) → <1ms ✅`,
    },
    {
      trigger: 'test_failed:Real-time Flag Update',
      message: `💡 Flag updates take too long to propagate!

**Problem:**
- Update flag in database
- App servers still using old cached value
- Takes 60+ seconds to propagate ❌

**Solutions:**
1. TTL-based: Flags expire after 10 sec ⚠️
   - Simple but causes inconsistency window
   - Some servers see old value, some see new

2. Polling: Servers poll DB every 5 sec ⚠️
   - Wasteful (99.9% of polls = no change)
   - Still 5 second delay

3. Pub/Sub: Push updates via message queue ✅
   - Admin updates flag → publish event
   - All servers receive instantly (<1 sec)
   - Efficient and fast!

Add a Message Queue for real-time invalidation!`,
    },
    {
      trigger: 'test_failed:Percentage Rollout',
      message: `💡 Percentage rollout is inconsistent!

**Problem - Random selection:**
if (random() < 0.25) → enabled
- User sees flag enabled on request 1
- Same user sees flag disabled on request 2 ❌
- Inconsistent experience!

**Solution - Consistent Hashing:**
hash = murmur3(user_id + flag_name) % 100
if (hash < 25) → enabled

**Why this works:**
- Same user_id + flag_name always hash to same value
- User ALWAYS sees consistent state
- Exactly 25% of users enabled (hash distributes evenly)

**Example:**
user_123 + "new_checkout" → hash = 17 → enabled ✅
user_123 + "new_checkout" → hash = 17 → enabled ✅ (consistent!)
user_456 + "new_checkout" → hash = 78 → disabled ✅`,
    },
  ],

  pythonTemplate: `# Feature Flag Management System
# Implement ultra-low latency flag evaluation

import hashlib
from typing import Dict, Any

# In-memory flag cache (loaded on startup)
FLAGS_CACHE: Dict[str, dict] = {}


def load_flags_into_memory(context: dict):
    """
    Load all flags from database into memory on server startup.

    Requirements:
    - Fetch all flags from PostgreSQL
    - Store in global FLAGS_CACHE dictionary
    - Subscribe to flag update events (message queue)
    """
    global FLAGS_CACHE

    # Your code here
    FLAGS_CACHE = {}


def evaluate_flag(flag_name: str, user_context: dict) -> bool:
    """
    Evaluate a feature flag for a user (MUST be <1ms!).

    Args:
        flag_name: Name of the flag
        user_context: {
            'user_id': 'user_123',
            'geo': 'US',
            'subscription_tier': 'premium'
        }

    Returns:
        True if flag is enabled for this user

    Requirements:
    - Lookup flag in FLAGS_CACHE (in-memory, no network!)
    - Apply targeting rules (percentage, user segments)
    - Use consistent hashing for percentage rollouts
    - Complete in <0.1ms
    """
    global FLAGS_CACHE

    if flag_name not in FLAGS_CACHE:
        return False  # Default to disabled

    flag = FLAGS_CACHE[flag_name]

    # Simple on/off flag
    if flag['type'] == 'boolean':
        return flag['enabled']

    # Percentage rollout
    elif flag['type'] == 'percentage':
        # Your code here: implement consistent hashing
        # hash = murmur3(user_id + flag_name) % 100
        # return hash < flag['percentage']
        pass

    # Targeted to specific users
    elif flag['type'] == 'targeted':
        return user_context['user_id'] in flag['target_users']

    return False


def create_flag(name: str, config: dict, context: dict) -> dict:
    """
    Create a new feature flag.

    Args:
        name: Flag name (e.g., "new_checkout")
        config: {
            'type': 'boolean' | 'percentage' | 'targeted',
            'enabled': True,
            'percentage': 25,  # if type=percentage
            'target_users': ['user_1', 'user_2']  # if type=targeted
        }
        context: Shared context

    Returns:
        {'flag_id': 'flag_123', 'name': 'new_checkout', ...}

    Requirements:
    - Validate config
    - Store in PostgreSQL
    - Publish flag update event to message queue
    - Update in-memory cache (FLAGS_CACHE)
    """
    # Your code here

    return {}


def update_flag(flag_name: str, config: dict, context: dict) -> dict:
    """
    Update an existing feature flag (must propagate in <10 seconds!).

    Args:
        flag_name: Flag to update
        config: New configuration
        context: Shared context

    Returns:
        Updated flag object

    Requirements:
    - Update in PostgreSQL
    - Publish "flag_updated:flag_name" to message queue
    - All app servers will receive event and reload flag
    - Propagation complete in <10 seconds
    """
    # Your code here

    return {}


def handle_flag_update_event(event: dict, context: dict):
    """
    Handle flag update event from message queue (push-based invalidation).

    Args:
        event: {'flag_name': 'new_checkout', 'action': 'updated'}
        context: Shared context

    Requirements:
    - Fetch updated flag from PostgreSQL
    - Update FLAGS_CACHE
    - Log the update
    """
    global FLAGS_CACHE

    flag_name = event['flag_name']

    # Fetch latest config from database
    # Update in-memory cache
    # Your code here


# API Handler
def handle_request(request: dict, context: dict) -> dict:
    """Handle feature flag API requests."""
    method = request.get('method', 'GET')
    path = request.get('path', '')
    body = request.get('body', {})
    user_context = request.get('user_context', {})

    # POST /flags/evaluate - Evaluate flag for user
    if method == 'POST' and path == '/flags/evaluate':
        flag_name = body.get('flag_name', '')
        enabled = evaluate_flag(flag_name, user_context)
        return {
            'status': 200,
            'body': {'flag_name': flag_name, 'enabled': enabled},
        }

    # POST /flags - Create flag (admin only)
    elif method == 'POST' and path == '/flags':
        name = body.get('name', '')
        config = body.get('config', {})
        flag = create_flag(name, config, context)
        return {'status': 201, 'body': flag}

    # PUT /flags/:name - Update flag (admin only)
    elif method == 'PUT' and path.startswith('/flags/'):
        flag_name = path.split('/')[-1]
        config = body.get('config', {})
        flag = update_flag(flag_name, config, context)
        return {'status': 200, 'body': flag}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
