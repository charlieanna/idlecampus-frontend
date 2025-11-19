import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../../utils/codeChallengeGenerator';

/**
 * Comprehensive API Gateway Platform
 * 
 * This problem consolidates all API gateway concepts into a single, realistic application.
 * Users will progressively build a Kong/AWS API Gateway-scale platform that covers:
 * 
 * GATEWAY CONCEPTS COVERED:
 * 1. Request Routing - Route requests to appropriate microservices
 * 2. Rate Limiting - Protect APIs with token bucket algorithm
 * 3. Authentication - JWT validation at the edge
 * 4. Authorization - Role-based access control (RBAC)
 * 5. Request/Response Transformation - Modify headers and payloads
 * 6. Circuit Breaking - Prevent cascading failures
 * 7. Load Balancing - Distribute traffic across service instances
 * 8. API Versioning - Support multiple API versions
 * 9. Response Caching - Cache responses at gateway level
 * 10. Configuration Caching - Local caching of routing rules, rate limits, and auth configs
 * 11. Monitoring - Track API metrics and logs
 * 
 * The problem is designed for progressive learning:
 * - Start with basic routing
 * - Add authentication and rate limiting
 * - Introduce caching and transformation
 * - Add circuit breaking and monitoring
 * - Scale with multiple gateway instances
 */
export const comprehensiveApiGatewayPlatformDefinition: ProblemDefinition = {
  id: 'comprehensive-api-gateway-platform',
  title: 'API Gateway Platform (Kong/AWS API Gateway-scale)',
  description: `Design a comprehensive API gateway (like Kong or AWS API Gateway) that handles:
  
  **Core Gateway Features:**
  - Route requests to appropriate microservices
  - Authenticate users with JWT tokens
  - Rate limit requests per user/API key
  - Transform requests and responses
  - Cache responses for performance
  - Load balance across service instances
  
  **Security Features:**
  - JWT token validation
  - API key authentication
  - Role-based access control (RBAC)
  - IP whitelisting/blacklisting
  - Request/response sanitization
  
  **Reliability Features:**
  - Circuit breaking for failing services (DDIA Ch. 8)
  - Automatic retries with exponential backoff
  - Idempotency keys for safe retries (DDIA Ch. 8)
  - Health checks and service discovery
  - Graceful degradation when services fail
  - Timeout management (prevent hanging requests) - DDIA Ch. 8
  - Network partition handling (continue operating when backend unreachable) - DDIA Ch. 8
  
  **Scale Requirements:**
  - Support 50k requests/sec
  - Handle 100+ backend microservices
  - Maintain <50ms gateway overhead
  - Support 1M API keys
  - Process 10k rate limit checks/sec
  
  **Key Learning Objectives:**
  This problem teaches you to build a production-grade API gateway with:
  - Request routing with path matching
  - Token bucket rate limiting
  - JWT validation with caching
  - Circuit breaker pattern - DDIA Ch. 8
  - Response caching strategies
  - Configuration caching (local cache of routing rules, rate limits, auth configs)
  - Hot reload of configurations without gateway restarts
  - Change notifications for config updates
  - Load balancing algorithms
  - Service discovery
  - API metrics and monitoring
  - Request timeouts to prevent hanging requests - DDIA Ch. 8
  - Idempotency keys for safe retries - DDIA Ch. 8
  - Network partition handling (graceful degradation) - DDIA Ch. 8
  
  **Progressive Approach:**
  Start simple with basic routing, then progressively add:
  1. Basic request routing
  2. Authentication (JWT)
  3. Rate limiting
  4. Response caching
  5. Circuit breaking
  6. Advanced features (transformation, versioning)`,

  userFacingFRs: [
    // Core Routing
    'Gateway routes requests to backend services based on URL path',
    'Gateway supports path parameters and query strings',
    'Gateway handles HTTP methods (GET, POST, PUT, DELETE)',
    
    // Authentication
    'Users authenticate with JWT tokens in Authorization header',
    'API partners authenticate with API keys',
    'Gateway validates tokens and extracts user context',
    'Gateway forwards user info to backend services',
    
    // Rate Limiting
    'Free tier users limited to 100 requests/hour',
    'Pro tier users limited to 1000 requests/hour',
    'Enterprise users have custom rate limits',
    'Gateway returns 429 with Retry-After header when limit exceeded',
    
    // Caching
    'GET requests cached for 60 seconds by default',
    'Cache keys include URL, query params, and user context',
    'Cache can be bypassed with Cache-Control: no-cache header',
    'POST/PUT/DELETE requests invalidate related cache entries',
    
    // Distributed Systems Patterns (DDIA Ch. 8)
    'Gateway sets 3-second timeout on all backend service calls',
    'Gateway uses circuit breaker - opens after 5 consecutive failures',
    'Gateway supports idempotency keys - same request with same key returns same result',
    'Gateway handles network partitions gracefully - returns cached data or error, never hangs',
    
    // Transformation
    'Gateway adds request ID to all requests',
    'Gateway adds user context headers (X-User-Id, X-User-Roles)',
    'Gateway removes sensitive headers before forwarding',
    'Gateway can transform JSON payloads',
    
    // Reliability
    'Gateway retries failed requests up to 3 times',
    'Gateway opens circuit breaker after 5 consecutive failures',
    'Gateway returns 503 when circuit is open',
    'Gateway performs health checks every 30 seconds',
    
    // Configuration Caching
    'Gateway caches routing rules, rate limits, and auth configs locally on each instance',
    'Gateway supports hot reload of configurations without restarting instances',
    'Gateway receives change notifications when configs are updated',
    'Gateway tracks config versions for rollback capability',
    'Gateway can start with cached configs even if config database is temporarily unavailable',
  ],

  userFacingNFRs: [
    // Performance
    'Gateway overhead <50ms at P95',
    'JWT validation <20ms at P95',
    'Rate limit check <10ms at P95',
    'Cache hit latency <5ms',
    
    // Scale
    'Support 50,000 requests/sec',
    'Handle 100+ backend microservices',
    'Support 1M active API keys',
    'Process 10,000 rate limit checks/sec',
    
    // Availability
    'Gateway availability 99.99%',
    'Automatic failover within 10 seconds',
    'Zero downtime deployments',
    'Graceful shutdown with connection draining',
    
    // Response Caching
    'Cache hit ratio >70% for GET requests',
    'Cache invalidation propagates within 1 second',
    'Cache memory usage <10GB per gateway instance',
    
    // Configuration Caching
    'Config reads from local cache <5ms at P95 (no database query)',
    'Config updates propagate to all gateway instances within 10 seconds',
    'Gateway instances can start with cached configs (99.99% availability)',
    'Config version tracking supports rollback to previous versions',
  ],

  functionalRequirements: {
    mustHave: [
      // Load Balancing
      {
        type: 'load_balancer',
        reason: 'Need external load balancer to distribute traffic across gateway instances',
      },
      
      // Gateway Layer
      {
        type: 'compute',
        reason: 'Need API gateway instances for routing, auth, and rate limiting',
      },
      
      // Caching
      {
        type: 'cache',
        reason: 'Need Redis for response caching',
      },
      {
        type: 'cache',
        reason: 'Need Redis for rate limit counters',
      },
      {
        type: 'cache',
        reason: 'Need Redis for JWT public key caching',
      },
      {
        type: 'cache',
        reason: 'Need Redis for circuit breaker state',
      },
      
      // Configuration
      {
        type: 'storage',
        reason: 'Need database for gateway configuration (routes, rate limits, API keys)',
      },
      {
        type: 'message_queue',
        reason: 'Need message queue for config change notifications (pub/sub)',
      },
      
      // Service Discovery
      {
        type: 'compute',
        reason: 'Need service registry (Consul/etcd) for backend service discovery',
      },
      
      // Backend Services
      {
        type: 'compute',
        reason: 'Need backend microservice instances (user service, order service, etc.)',
      },
      
      // Monitoring
      {
        type: 'message_queue',
        reason: 'Need message queue for async logging and metrics',
      },
      {
        type: 'storage',
        reason: 'Need database for API metrics and logs',
      },
    ],
    
    mustConnect: [
      // User Traffic Flow
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'API clients connect through external load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes traffic across gateway instances',
      },
      
      // Authentication Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway checks JWT public key cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Gateway queries database for API keys',
      },
      
      // Rate Limiting Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway checks/updates rate limit counters in Redis',
      },
      
      // Response Caching Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway checks response cache in Redis',
      },
      
      // Circuit Breaker Flow
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway checks circuit breaker state in Redis',
      },
      
      // Service Discovery Flow
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway queries service registry for backend service locations',
      },
      
      // Request Routing Flow
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway forwards requests to backend microservices',
      },
      
      // Configuration Flow
      {
        from: 'compute',
        to: 'storage',
        reason: 'Gateway loads routing rules and rate limits from config database (on startup or cache miss)',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway caches routing rules, rate limits, and auth configs locally in Redis',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Gateway subscribes to config change notifications',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Config database publishes change notifications when configs are updated',
      },
      
      // Monitoring Flow
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Gateway publishes metrics and logs to queue',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Metrics worker writes to analytics database',
      },
    ],
    
    dataModel: {
      entities: [
        'route',
        'service',
        'api_key',
        'rate_limit',
        'jwt_public_key',
        'circuit_breaker',
        'cache_entry',
        'metric',
      ],
      fields: {
        route: ['id', 'path_pattern', 'service_id', 'methods', 'auth_required', 'rate_limit_id', 'version', 'updated_at'],
        service: ['id', 'name', 'base_url', 'health_check_url', 'timeout_ms', 'retry_count'],
        api_key: ['id', 'key_hash', 'user_id', 'tier', 'rate_limit_id', 'created_at'],
        rate_limit: ['id', 'requests_per_hour', 'burst_size', 'version', 'updated_at'],
        jwt_public_key: ['kid', 'algorithm', 'public_key', 'expires_at'],
        circuit_breaker: ['service_id', 'state', 'failure_count', 'last_failure_time'],
        cache_entry: ['cache_key', 'response_body', 'headers', 'ttl', 'created_at'],
        metric: ['timestamp', 'route_id', 'status_code', 'latency_ms', 'user_id'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },   // Route lookups, cache checks, config reads
        { type: 'write', frequency: 'very_high' },         // Rate limit updates, metrics
        { type: 'read_by_query', frequency: 'low' },      // Config queries (rare, mostly from cache)
      ],
    },
  },

  scenarios: generateScenarios('comprehensive-api-gateway-platform', problemConfigs['comprehensive-api-gateway-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(comprehensiveApiGatewayPlatformDefinition as any).codeChallenges = generateCodeChallengesFromFRs(comprehensiveApiGatewayPlatformDefinition);

