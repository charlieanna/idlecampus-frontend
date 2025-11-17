import { Challenge } from '../../types/testCase';

export const internalApiGatewayChallenge: Challenge = {
  id: 'internal_api_gateway',
  title: 'Internal API Gateway',
  difficulty: 'advanced',
  description: `Design an internal API gateway for managing microservice-to-microservice communication.

The gateway provides:
- Request routing to correct service
- Authentication and authorization
- Rate limiting per service
- Request/response transformation
- Traffic shadowing for testing

Example:
- POST /api/v2/payments → route to payment-service-v2
- Check: Is caller authorized to call payments?
- Rate limit: Max 1000 RPS per calling service
- Shadow 5% traffic to payment-service-v3 (testing)

Key challenges:
- Low latency (<10ms overhead)
- Dynamic routing rules (no restarts!)
- Per-service rate limits
- Circuit breaking for failing services`,

  requirements: {
    functional: [
      'Route requests to services based on path/headers',
      'Authenticate and authorize service-to-service calls',
      'Rate limiting per service (prevent noisy neighbors)',
      'Circuit breaking (stop calling failing services)',
      'Traffic shadowing (test new versions)',
    ],
    traffic: '50,000 RPS (all internal service calls)',
    latency: 'p99 < 10ms (gateway overhead)',
    availability: '99.99% uptime (all internal traffic flows through gateway)',
    budget: '$5,000/month',
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
      name: 'Basic Request Routing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Route requests to correct service based on path.',
      traffic: {
        type: 'read',
        rps: 100,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 50,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Basic routing architecture:

**Routing table (PostgreSQL):**
| Path Pattern | Service | Version |
|--------------|---------|---------|
| /api/v1/payments/* | payment-service | v1 |
| /api/v2/payments/* | payment-service | v2 |
| /api/v1/users/* | user-service | v1 |

**Routing logic:**
1. Extract path from request: /api/v2/payments/123
2. Match against routing table: /api/v2/payments/* → payment-service-v2
3. Forward request to payment-service-v2
4. Return response

**Caching:**
- Redis: Cache routing rules (rarely change)
- Reload on configuration updates`,
      },
    },

    {
      name: 'Service Authentication',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Verify calling service identity with JWT tokens.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        unauthorizedBlocked: true,
      },
    },

    {
      name: 'Per-Service Rate Limiting',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Limit service A to 1000 RPS, service B to 500 RPS. Prevent noisy neighbors.',
      traffic: {
        type: 'read',
        rps: 2000, // Mixed traffic from multiple services
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.3, // 30% rejected (rate limited)
        rateLimitEnforced: true,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { maxMemoryMB: 2048 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 500 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Per-service rate limiting with Redis:

**Rate limit configuration:**
{
  "api-server": {limit: 1000, window: "1s"},
  "worker": {limit: 500, window: "1s"},
  "analytics": {limit: 100, window: "1s"}
}

**Token bucket algorithm (Redis):**

**On each request:**
1. Extract caller identity from JWT: service = "api-server"
2. Redis key: "ratelimit:api-server:1234567890" (second timestamp)
3. INCR key
4. If count > limit (1000) → reject with 429 ❌
5. If count <= limit → allow ✅
6. Set TTL 2 seconds (cleanup old windows)

**Why Redis is perfect:**
- Atomic INCR operation (no race conditions)
- High performance (<1ms)
- TTL for automatic cleanup

**Example:**
Time: 10:00:00
- Request 1 from api-server: INCR ratelimit:api-server:10:00:00 → 1 ✅
- Request 2 from api-server: INCR ratelimit:api-server:10:00:00 → 2 ✅
- ...
- Request 1001 from api-server: INCR → 1001 > 1000 → REJECT ❌

Time: 10:00:01 (new window)
- Request from api-server: INCR ratelimit:api-server:10:00:01 → 1 ✅`,
      },
    },

    {
      name: 'Circuit Breaking',
      type: 'functional',
      requirement: 'FR-4',
      description: 'If payment-service has 50% error rate, open circuit (stop sending traffic).',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 120,
      failureInjection: {
        type: 'downstream_service_failure',
        atSecond: 30,
        errorRate: 0.5,
      },
      passCriteria: {
        maxErrorRate: 0.3, // Circuit opens, errors drop
        circuitBreakerActivated: true,
      },
    },

    {
      name: 'Traffic Shadowing',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Shadow 5% of traffic to payment-service-v3 (testing). Do not wait for response.',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        shadowTrafficPercent: 0.05,
        maxP99Latency: 20, // Shadowing should not increase latency
      },
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High-Throughput Routing',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Route 50,000 RPS with <10ms gateway overhead.',
      traffic: {
        type: 'read',
        rps: 50000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 10, // Gateway overhead only!
        maxErrorRate: 0.001,
        maxMonthlyCost: 5000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 10 } },
          { type: 'redis', config: { maxMemoryMB: 4096 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 500 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Achieving <10ms gateway overhead:

**Challenge:**
- 50,000 RPS through gateway
- Each request: auth + route lookup + rate limit check
- Target: <10ms overhead

**Optimization strategies:**

**1. In-memory routing table:**
- Load all routes into app server memory on startup
- Hash map lookup: O(1) constant time ~0.01ms ✅
- Reload on config changes (pub/sub)

**2. Local rate limit counters:**
- Redis: Shared state across gateways
- But Redis call: 1-2ms per request ⚠️
- Solution: Local counters + periodic sync
  - Increment local counter (0.001ms)
  - Sync to Redis every 100ms
  - Trade-off: Slight over-limit possible (acceptable!)

**3. JWT verification caching:**
- Verify JWT signature: 5ms (crypto expensive) ❌
- Cache verified tokens in memory (1 min TTL)
- Lookup cached: 0.01ms ✅

**Latency breakdown:**
- Route lookup (memory): 0.01ms
- Auth check (cached): 0.01ms
- Rate limit (local): 0.001ms
- Forward request: 5ms (network)
- Total overhead: ~5ms ✅

**Horizontal scaling:**
- 10 gateway instances
- 50,000 RPS ÷ 10 = 5,000 RPS per instance
- Each instance can handle 10K+ RPS easily

**Cost: ~$4,900/month**
- 10 app servers: $2,000
- PostgreSQL: $500
- Redis 4GB: $400
- Load Balancer: $2,000 (high throughput)`,
      },
    },

    {
      name: 'Dynamic Routing Updates',
      type: 'functional',
      requirement: 'FR-1b',
      description: 'Update routing rules without restarting gateways (<10 sec propagation).',
      traffic: {
        type: 'read',
        rps: 10000,
      },
      duration: 120,
      configUpdate: {
        atSecond: 60,
        newRoute: '/api/v3/payments/* → payment-service-v3',
      },
      passCriteria: {
        maxPropagationDelay: 10, // seconds
        maxErrorRate: 0.01,
      },
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Redis Failure - Degraded Mode',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Redis fails. Gateway continues with local rate limiting (less accurate).',
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
        minAvailability: 0.99,
        maxP99Latency: 15, // Slight degradation
      },
    },
  ],

  learningObjectives: [
    'Design low-latency API gateways (<10ms overhead)',
    'Implement distributed rate limiting with Redis',
    'Circuit breaking patterns for fault isolation',
    'Traffic shadowing for safe deployments',
    'In-memory routing for performance',
  ],

  hints: [
    {
      trigger: 'test_failed:High-Throughput Routing',
      message: `💡 Gateway overhead is >10ms!

**Problem - Database lookup per request:**
Every request:
1. Query PostgreSQL for routing rule: 10-20ms ❌
2. Total latency: 10ms + backend latency

**Solution - In-Memory Routing Table:**

**Load routes on startup:**
routes = {
  "/api/v1/payments/*": {service: "payment-service-v1", host: "10.0.1.5:8080"},
  "/api/v2/payments/*": {service: "payment-service-v2", host: "10.0.1.6:8080"}
}

**Request handling:**
1. Extract path: /api/v2/payments/123
2. Hash map lookup: routes["/api/v2/payments/*"] → 0.01ms ✅
3. Forward to 10.0.1.6:8080

**Dynamic updates:**
1. Admin updates route in PostgreSQL
2. Publish "routes_updated" event (message queue)
3. All gateways reload routes from PostgreSQL
4. Propagation: <10 seconds ✅

**Key insight:**
Read-heavy workloads → cache aggressively!`,
    },
    {
      trigger: 'test_failed:Per-Service Rate Limiting',
      message: `💡 Rate limits are not working across multiple gateways!

**Problem - Local counters:**
- Gateway 1: api-server at 800 RPS
- Gateway 2: api-server at 800 RPS
- Total: 1600 RPS > 1000 limit ❌

**Solution - Shared Redis counters:**

**Token bucket with Redis:**
key = f"ratelimit:{service}:{timestamp}"

def check_rate_limit(service):
    key = f"ratelimit:{service}:{int(time.time())}"
    count = redis.incr(key)
    redis.expire(key, 2)  # Cleanup

    limit = get_limit(service)  # e.g., 1000
    if count > limit:
        return False  # Rate limited
    return True  # Allowed

**Why this works:**
- Redis INCR is atomic
- All gateways share same counter
- Accurate across distributed system ✅

**Optimization:**
Redis call adds 1-2ms latency. For ultra-low latency:
- Use local counters
- Sync to Redis every 100ms
- Trade-off: Slight over-limit (1-2%) acceptable`,
    },
    {
      trigger: 'test_failed:Circuit Breaking',
      message: `💡 Gateway keeps sending traffic to failing service!

**Problem:**
- payment-service has 50% error rate
- Gateway keeps sending traffic
- All requests slow/fail ❌

**Solution - Circuit Breaker Pattern:**

**States:**
1. **Closed** (normal): Pass all traffic
2. **Open** (failing): Block all traffic, return error immediately
3. **Half-Open** (testing): Allow 1 request to test if recovered

**State transitions:**
Closed → Open: If error rate > 50% over 10 sec window
Open → Half-Open: After 30 sec timeout
Half-Open → Closed: If test request succeeds
Half-Open → Open: If test request fails

**Implementation:**
circuit_breaker = {
  "payment-service": {
    "state": "closed",
    "errors": 50,
    "total": 100,
    "error_rate": 0.5,
    "opened_at": null
  }
}

On each request:
1. Check circuit state
2. If open → return 503 immediately (fast fail!)
3. If closed → forward request
4. Track result (success/error)
5. If error_rate > threshold → open circuit

**Key benefit:**
Fast fail (1ms) instead of waiting for timeout (30s)!`,
    },
    {
      trigger: 'test_failed:Traffic Shadowing',
      message: `💡 Shadowing is slowing down requests!

**Problem - Synchronous shadowing:**
1. Forward request to payment-service-v2
2. Wait for response: 50ms
3. Forward same request to payment-service-v3 (shadow)
4. Wait for shadow response: 50ms
5. Total: 100ms ❌ (2x latency!)

**Solution - Async (Fire and Forget):**

**Correct flow:**
1. Forward request to payment-service-v2
2. **Async**: Forward to payment-service-v3 (don't wait!)
3. Return response from v2 immediately
4. Shadow response comes later (ignored)

**Implementation:**
def handle_request(request):
    # Primary request
    response = forward(request, "payment-service-v2")

    # Shadow (async, non-blocking!)
    if random() < 0.05:  # 5% of traffic
        async_forward(request, "payment-service-v3")  # Fire and forget!

    return response  # No waiting!

**Latency: 50ms** (same as without shadowing) ✅

**Use shadowing for:**
- Testing new service versions
- Comparing v2 vs v3 responses
- Capacity testing

**Never block on shadow responses!**`,
    },
  ],

  pythonTemplate: `# Internal API Gateway
# Implement routing, rate limiting, circuit breaking

import time
import random
from typing import Dict, Optional

# In-memory routing table (loaded from PostgreSQL)
ROUTING_TABLE: Dict[str, dict] = {}

# Circuit breaker state
CIRCUIT_BREAKERS: Dict[str, dict] = {}


def load_routes(context: dict):
    """Load routing rules from PostgreSQL into memory."""
    global ROUTING_TABLE
    # Your code here
    ROUTING_TABLE = {}


def route_request(path: str) -> Optional[dict]:
    """
    Find routing rule for path (in-memory lookup).

    Args:
        path: Request path (e.g., /api/v2/payments/123)

    Returns:
        {'service': 'payment-service', 'version': 'v2', 'host': '10.0.1.5:8080'}

    Requirements:
    - Match path against routing table patterns
    - Return routing rule
    - O(1) or O(log n) lookup time (<0.1ms!)
    """
    # Your code here
    return None


def check_rate_limit(service: str, context: dict) -> bool:
    """
    Check if service is within rate limit (Redis-based).

    Args:
        service: Calling service identity
        context: Shared context

    Returns:
        True if allowed, False if rate limited

    Requirements:
    - Use Redis token bucket algorithm
    - Key: "ratelimit:{service}:{timestamp}"
    - Atomic INCR operation
    - Return True if count <= limit
    """
    timestamp = int(time.time())
    key = f"ratelimit:{service}:{timestamp}"

    # Your code here (Redis INCR + check limit)

    return True


def check_circuit_breaker(service: str, context: dict) -> bool:
    """
    Check if circuit is open for service.

    Args:
        service: Target service
        context: Shared context

    Returns:
        True if allowed (circuit closed), False if blocked (circuit open)

    Requirements:
    - Check circuit state (closed/open/half-open)
    - If open: Check if timeout expired → half-open
    - If half-open: Allow one test request
    - Return True/False
    """
    global CIRCUIT_BREAKERS

    if service not in CIRCUIT_BREAKERS:
        CIRCUIT_BREAKERS[service] = {
            'state': 'closed',
            'errors': 0,
            'total': 0,
            'opened_at': None,
        }

    cb = CIRCUIT_BREAKERS[service]

    # Your code here (implement state machine)

    return True


def record_request_result(service: str, success: bool, context: dict):
    """
    Record request result for circuit breaker.

    Args:
        service: Target service
        success: True if request succeeded
        context: Shared context

    Requirements:
    - Increment total counter
    - If success: Increment success counter
    - If error: Increment error counter
    - Calculate error rate over sliding window (last 100 requests)
    - If error_rate > 50% → open circuit
    """
    global CIRCUIT_BREAKERS

    # Your code here

    pass


def shadow_request(request: dict, target_service: str, context: dict):
    """
    Shadow request to target service (async, fire-and-forget).

    Args:
        request: Original request
        target_service: Service to shadow to
        context: Shared context

    Requirements:
    - Forward request asynchronously (don't block!)
    - Log response for comparison (optional)
    - Never fail original request if shadow fails
    """
    # Your code here (async forward)
    pass


def authenticate_service(token: str, context: dict) -> Optional[str]:
    """
    Verify service JWT token.

    Args:
        token: JWT token
        context: Shared context

    Returns:
        Service identity (e.g., "api-server") if valid, None otherwise

    Requirements:
    - Verify JWT signature
    - Check expiry
    - Extract service identity from claims
    - Cache verified tokens (1 min TTL) for performance
    """
    # Your code here
    return None


# Gateway Handler
def handle_request(request: dict, context: dict) -> dict:
    """
    Main gateway request handler.

    Flow:
    1. Authenticate caller
    2. Check rate limit
    3. Route to service
    4. Check circuit breaker
    5. Forward request
    6. Shadow traffic (if applicable)
    7. Record result
    8. Return response
    """
    path = request.get('path', '')
    token = request.get('headers', {}).get('Authorization', '')

    # Step 1: Authenticate
    service_identity = authenticate_service(token, context)
    if not service_identity:
        return {'status': 401, 'body': {'error': 'Unauthorized'}}

    # Step 2: Rate limit
    if not check_rate_limit(service_identity, context):
        return {'status': 429, 'body': {'error': 'Rate limit exceeded'}}

    # Step 3: Route
    route = route_request(path)
    if not route:
        return {'status': 404, 'body': {'error': 'No route found'}}

    # Step 4: Circuit breaker
    if not check_circuit_breaker(route['service'], context):
        return {'status': 503, 'body': {'error': 'Service unavailable (circuit open)'}}

    # Step 5: Forward request
    try:
        # Your code here: forward to route['host']
        response = {'status': 200, 'body': {'result': 'ok'}}
        success = True
    except Exception:
        response = {'status': 500, 'body': {'error': 'Service error'}}
        success = False

    # Step 6: Shadow (5% of traffic to v3)
    if random.random() < 0.05:
        shadow_request(request, route['service'] + '-v3', context)

    # Step 7: Record result
    record_request_result(route['service'], success, context)

    return response
`,
};
