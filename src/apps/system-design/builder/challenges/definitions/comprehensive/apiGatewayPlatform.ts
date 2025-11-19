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
 * 9. Caching - Cache responses at gateway level
 * 10. Monitoring - Track API metrics and logs
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
  - Circuit breaking for failing services
  - Automatic retries with exponential backoff
  - Health checks and service discovery
  - Graceful degradation
  - Timeout management
  
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
  - Circuit breaker pattern
  - Response caching strategies
  - Load balancing algorithms
  - Service discovery
  - API metrics and monitoring
  
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
    
    // Caching
    'Cache hit ratio >70% for GET requests',
    'Cache invalidation propagates within 1 second',
    'Cache memory usage <10GB per gateway instance',
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
        reason: 'Gateway loads routing rules and rate limits from config database',
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
        route: ['id', 'path_pattern', 'service_id', 'methods', 'auth_required', 'rate_limit_id'],
        service: ['id', 'name', 'base_url', 'health_check_url', 'timeout_ms', 'retry_count'],
        api_key: ['id', 'key_hash', 'user_id', 'tier', 'rate_limit_id', 'created_at'],
        rate_limit: ['id', 'requests_per_hour', 'burst_size'],
        jwt_public_key: ['kid', 'algorithm', 'public_key', 'expires_at'],
        circuit_breaker: ['service_id', 'state', 'failure_count', 'last_failure_time'],
        cache_entry: ['cache_key', 'response_body', 'headers', 'ttl', 'created_at'],
        metric: ['timestamp', 'route_id', 'status_code', 'latency_ms', 'user_id'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },   // Route lookups, cache checks
        { type: 'write', frequency: 'very_high' },         // Rate limit updates, metrics
        { type: 'read_by_query', frequency: 'medium' },    // Config queries
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

