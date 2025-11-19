import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Basic API Gateway - Route requests to microservices
 * From extracted-problems/system-design/gateway.md
 */
export const basicApiGatewayProblemDefinition: ProblemDefinition = {
  id: 'basic-api-gateway',
  title: 'Basic API Gateway',
  description: `Build a simple API gateway that:
- Routes requests based on URL path to appropriate services
- Adds authentication headers and transforms requests/responses
- Implements basic health checks and service discovery
- Handles 10k requests/sec with <50ms overhead`,

  userFacingFRs: [
    '**GET /api/users/*** - Route user service requests through gateway',
    '**POST /api/orders/*** - Route order service requests through gateway',
    '**GET /api/products/*** - Route product service requests through gateway',
    '**GET /api/health** - Gateway health check and service status',
  ],

  userFacingNFRs: [
    'Gateway routing overhead must be <50ms at P95',
    'Support 10,000 requests/sec across all services',
    'Maintain 99.9% availability with automatic service failover',
    'All requests include authentication headers and request transformation',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for incoming API traffic',
      },
      {
        type: 'compute',
        reason: 'Need API gateway instances for routing',
      },
      {
        type: 'compute',
        reason: 'Need backend microservice instances',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'API clients connect through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway routes to backend services',
      },
    ],
    dataModel: {
      entities: ['route', 'service'],
      fields: {
        route: ['path_prefix', 'service_name', 'method', 'transform_rules'],
        service: ['name', 'host', 'port', 'health_endpoint'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Route lookups
      ],
    },
  },

  scenarios: generateScenarios('basic-api-gateway', problemConfigs['basic-api-gateway']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Simple Rate Limiter - Protect APIs with request limits
 * From extracted-problems/system-design/gateway.md
 */
export const simpleRateLimiterProblemDefinition: ProblemDefinition = {
  id: 'simple-rate-limiter',
  title: 'Simple Rate Limiter',
  description: `Build a rate limiter using token bucket algorithm that:
- Limits requests per user per minute (default: 100/min)
- Supports burst allowance for traffic spikes
- Returns 429 with retry-after header when exhausted
- Validates 20k requests/sec with <10ms overhead`,

  userFacingFRs: [
    '**Any API endpoint** - All requests validated with token bucket rate limiting',
    '**GET /api/rate-limit/status** - Check current token count and refill rate',
    '**POST /api/resource** - Protected resource with burst allowance support',
    '**Response headers** - Include X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset',
  ],

  userFacingNFRs: [
    'Rate limiting must add <10ms overhead at P95',
    'Support 20,000 requests/sec with rate limit validation',
    'Default limit: 100 requests/minute per user with burst allowance',
    'Return 429 Too Many Requests with Retry-After header when exhausted',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for API traffic',
      },
      {
        type: 'compute',
        reason: 'Need rate limiter instances',
      },
      {
        type: 'cache',
        reason: 'Need Redis for atomic counter operations',
      },
      {
        type: 'compute',
        reason: 'Need backend API instances',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'API clients connect through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to rate limiter',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Rate limiter checks/updates counters in Redis',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Rate limiter forwards to backend API',
      },
    ],
    dataModel: {
      entities: ['rate_limit'],
      fields: {
        rate_limit: ['api_key', 'time_bucket', 'tokens_remaining', 'expires_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' }, // Token consumption
        { type: 'read_by_key', frequency: 'very_high' }, // Limit checks
      ],
    },
  },

  scenarios: generateScenarios('simple-rate-limiter', problemConfigs['simple-rate-limiter']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Authentication Gateway - Validate JWT tokens at edge
 * From extracted-problems/system-design/gateway.md
 */
export const authenticationGatewayProblemDefinition: ProblemDefinition = {
  id: 'authentication-gateway',
  title: 'Authentication Gateway',
  description: `Implement JWT token validation at API gateway that:
- Validates JWT tokens on every request with <20ms latency
- Caches public keys for verification (99% hit rate)
- Extracts and forwards user context to backend services
- Handles 30k authenticated requests/sec`,

  userFacingFRs: [
    '**Any API endpoint** - All requests validated with JWT token in Authorization header',
    '**GET /api/auth/keys** - Retrieve public keys for JWT verification',
    '**All authenticated requests** - Extract user context (id, roles, permissions) from JWT',
    '**Response headers** - Include X-User-Id and X-User-Roles forwarded to backend',
  ],

  userFacingNFRs: [
    'JWT validation must complete in <20ms at P95',
    'Support 30,000 authenticated requests/sec',
    'Achieve 99% cache hit rate for public key lookups',
    'Return 401 Unauthorized for invalid or expired tokens',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for incoming traffic',
      },
      {
        type: 'compute',
        reason: 'Need auth gateway instances',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache public keys',
      },
      {
        type: 'storage',
        reason: 'Need database for user information',
      },
      {
        type: 'compute',
        reason: 'Need backend service instances',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Mobile apps connect through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to auth gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway caches public keys for JWT verification',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Gateway queries user database',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway forwards to backend services',
      },
    ],
    dataModel: {
      entities: ['user', 'public_key'],
      fields: {
        user: ['id', 'username', 'email', 'roles'],
        public_key: ['kid', 'algorithm', 'key', 'expires_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Token validation
      ],
    },
  },

  scenarios: generateScenarios('authentication-gateway', problemConfigs['authentication-gateway']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GraphQL Gateway - Unified API layer for microservices
 * From extracted-problems/system-design/gateway.md
 */
export const graphqlGatewayProblemDefinition: ProblemDefinition = {
  id: 'graphql-gateway',
  title: 'GraphQL Gateway',
  description: `Build a GraphQL gateway that:
- Provides unified API over multiple REST microservices
- Implements efficient data loading with DataLoader pattern
- Handles N+1 query problems with batching
- Supports 5k complex queries/sec`,

  userFacingFRs: [
    '**POST /graphql** - Execute GraphQL queries and mutations',
    '**GET /graphql** - GraphQL playground and schema introspection',
    '**Query: user(id: ID!)** - Fetch user data from user service',
    '**Query: products(filter: ProductFilter)** - Fetch products from product service with batching',
  ],

  userFacingNFRs: [
    'GraphQL queries must complete in <500ms at P95',
    'Support 5,000 complex queries/sec with nested resolvers',
    'Batch N+1 queries using DataLoader with <100ms batching window',
    'Cache resolver results in Redis with configurable TTL',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for GraphQL traffic',
      },
      {
        type: 'compute',
        reason: 'Need GraphQL server instances',
      },
      {
        type: 'cache',
        reason: 'Need Redis for DataLoader caching',
      },
      {
        type: 'compute',
        reason: 'Need backend microservice instances',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients send GraphQL queries through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to GraphQL gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'GraphQL gateway uses DataLoader with Redis',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway queries backend microservices',
      },
    ],
    dataModel: {
      entities: ['schema', 'resolver'],
      fields: {
        schema: ['type_name', 'fields', 'resolvers'],
        resolver: ['field_name', 'service_url', 'cache_ttl'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Complex queries
      ],
    },
  },

  scenarios: generateScenarios('graphql-gateway', problemConfigs['graphql-gateway']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(basicApiGatewayProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicApiGatewayProblemDefinition);
