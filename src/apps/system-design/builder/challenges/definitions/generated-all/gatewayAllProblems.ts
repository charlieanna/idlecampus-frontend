import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import {
  urlShorteningValidator,
  urlRedirectValidator,
  analyticsTrackingValidator,
  photoUploadValidator,
  feedViewValidator,
  basicFunctionalValidator,
} from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Gateway Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 36 problems
 */

/**
 * GitHub/Stripe API Rate Limiter
 * From extracted-problems/system-design/gateway.md
 */
export const rateLimiterProblemDefinition: ProblemDefinition = {
  id: 'rate-limiter',
  title: 'GitHub/Stripe API Rate Limiter',
  description: `Design an API gateway that enforces both per‑user and global request limits while keeping latency low. Your design should handle short bursts without overloading backends by using counters in a fast data store and smoothing traffic with queues or buckets. Address hot‑key risk, multi‑region counter correctness, and provide a clear path for retries and error budgets.`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    
  ],
  userFacingNFRs: [
    
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Client (redirect_client) for per-user and global caps with burst handling',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for per-user and global caps with burst handling',
      },
      {
        type: 'cache',
        reason: 'Need Redis (cache) for per-user and global caps with burst handling',
      },
      {
        type: 'storage',
        reason: 'Need Counter DB (db_primary) for per-user and global caps with burst handling',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Client routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway routes to Redis',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Gateway routes to Counter DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('rate-limiter', problemConfigs['rate-limiter'], [
    
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Basic API Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const basicApiGatewayProblemDefinition: ProblemDefinition = {
  id: 'basic-api-gateway',
  title: 'Basic API Gateway',
  description: `Learn API gateway fundamentals by building a basic router that directs requests to appropriate microservices. Understand path-!based routing, header manipulation, and basic request/response transformation.
- Route requests based on URL path
- Add authentication headers
- Transform request/response formats
- Handle service discovery`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Route requests based on URL path',
    'Add authentication headers',
    'Transform request/response formats',
    'Handle service discovery',
    'Implement basic health checks'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms overhead, P99 < 100ms',
    'Request Rate: 10k requests/sec across all services',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for route requests to microservices',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for route requests to microservices',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to API Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to User Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Product Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Order Service',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('basic-api-gateway', problemConfigs['basic-api-gateway'], [
    'Route requests based on URL path',
    'Add authentication headers',
    'Transform request/response formats',
    'Handle service discovery',
    'Implement basic health checks'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Simple Rate Limiter
 * From extracted-problems/system-design/gateway.md
 */
export const simpleRateLimiterProblemDefinition: ProblemDefinition = {
  id: 'simple-rate-limiter',
  title: 'Simple Rate Limiter',
  description: `Build a rate limiter using the token bucket algorithm. Learn about rate limiting strategies, handling burst traffic, and returning proper HTTP status codes (429 Too Many Requests).
- Limit requests per user per minute
- Support burst allowance
- Return 429 with retry-after header
- Track usage per API key`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Limit requests per user per minute',
    'Support burst allowance',
    'Return 429 with retry-after header',
    'Track usage per API key',
    'Allow different tiers with different limits'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for limit checks',
    'Request Rate: 20k requests/sec to validate',
    'Dataset Size: 100k active API keys',
    'Availability: 99.9% uptime, fail open on errors'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for protect apis with request limits',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for protect apis with request limits',
      },
      {
        type: 'cache',
        reason: 'Need Redis Counters (cache) for protect apis with request limits',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Rate Limiter',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Rate Limiter routes to Redis Counters',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Rate Limiter routes to Backend API',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('simple-rate-limiter', problemConfigs['simple-rate-limiter'], [
    'Limit requests per user per minute',
    'Support burst allowance',
    'Return 429 with retry-after header',
    'Track usage per API key',
    'Allow different tiers with different limits'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Authentication Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const authenticationGatewayProblemDefinition: ProblemDefinition = {
  id: 'authentication-gateway',
  title: 'Authentication Gateway',
  description: `Implement JWT token validation at the API gateway. Learn about token verification, public key caching, token refresh flows, and how to minimize auth overhead on backend services.
- Validate JWT tokens on every request
- Cache public keys for verification
- Extract user context from tokens
- Support token refresh flow`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Validate JWT tokens on every request',
    'Cache public keys for verification',
    'Extract user context from tokens',
    'Support token refresh flow',
    'Forward user context to services'
  ],
  userFacingNFRs: [
    'Latency: P95 < 20ms for validation',
    'Request Rate: 30k authenticated requests/sec',
    'Availability: 99.99% uptime for auth'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile Apps (redirect_client) for validate jwt tokens at edge',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for validate jwt tokens at edge',
      },
      {
        type: 'cache',
        reason: 'Need Key Cache (cache) for validate jwt tokens at edge',
      },
      {
        type: 'storage',
        reason: 'Need User DB (db_primary) for validate jwt tokens at edge',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Mobile Apps routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Auth Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Auth Gateway routes to Key Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Auth Gateway routes to User DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Auth Gateway routes to Backend Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('authentication-gateway', problemConfigs['authentication-gateway'], [
    'Validate JWT tokens on every request',
    'Cache public keys for verification',
    'Extract user context from tokens',
    'Support token refresh flow',
    'Forward user context to services'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Load Balancing Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const loadBalancingGatewayProblemDefinition: ProblemDefinition = {
  id: 'load-balancing-gateway',
  title: 'Load Balancing Gateway',
  description: `Build a gateway that implements various load balancing algorithms. Learn about round-robin, weighted distribution, least connections, and how to handle unhealthy instances.
- Implement round-robin load balancing
- Support weighted distribution
- Health check backend services
- Remove unhealthy instances`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Implement round-robin load balancing',
    'Support weighted distribution',
    'Health check backend services',
    'Remove unhealthy instances',
    'Support sticky sessions'
  ],
  userFacingNFRs: [
    'Latency: P95 < 30ms routing overhead',
    'Request Rate: 15k requests/sec',
    'Availability: 99.9% with automatic failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Clients (redirect_client) for distribute load across services',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for distribute load across services',
      },
      {
        type: 'cache',
        reason: 'Need Session Cache (cache) for distribute load across services',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'load_balancer',
        reason: 'Load Balancer routes to LB Gateway',
      },
      {
        from: 'load_balancer',
        to: 'cache',
        reason: 'LB Gateway routes to Session Cache',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB Gateway routes to Backend Pool',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('load-balancing-gateway', problemConfigs['load-balancing-gateway'], [
    'Implement round-robin load balancing',
    'Support weighted distribution',
    'Health check backend services',
    'Remove unhealthy instances',
    'Support sticky sessions'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Request Transformation Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const requestTransformGatewayProblemDefinition: ProblemDefinition = {
  id: 'request-transform-gateway',
  title: 'Request Transformation Gateway',
  description: `Build a gateway that transforms between different API protocols and formats. Learn about protocol translation, schema mapping, and maintaining backward compatibility.
- Convert REST requests to GraphQL
- Transform JSON to Protocol Buffers
- Map between different schemas
- Support API versioning`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Convert REST requests to GraphQL',
    'Transform JSON to Protocol Buffers',
    'Map between different schemas',
    'Support API versioning',
    'Handle format validation'
  ],
  userFacingNFRs: [
    'Latency: P95 < 40ms transformation overhead',
    'Request Rate: 8k requests/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need REST Clients (redirect_client) for convert between api formats',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for convert between api formats',
      },
      {
        type: 'cache',
        reason: 'Need Schema Cache (cache) for convert between api formats',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'REST Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Transform Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Transform Gateway routes to Schema Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transform Gateway routes to GraphQL Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transform Gateway routes to gRPC Service',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('request-transform-gateway', problemConfigs['request-transform-gateway'], [
    'Convert REST requests to GraphQL',
    'Transform JSON to Protocol Buffers',
    'Map between different schemas',
    'Support API versioning',
    'Handle format validation'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * CORS Handling Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const corsGatewayProblemDefinition: ProblemDefinition = {
  id: 'cors-gateway',
  title: 'CORS Handling Gateway',
  description: `Build a gateway that properly handles Cross-Origin Resource Sharing (CORS) for browser-based applications. Learn about preflight requests, allowed origins, and security implications.
- Handle OPTIONS preflight requests
- Configure allowed origins
- Set proper CORS headers
- Support credentials in requests`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Handle OPTIONS preflight requests',
    'Configure allowed origins',
    'Set proper CORS headers',
    'Support credentials in requests',
    'Cache preflight responses'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for preflight',
    'Request Rate: 5k requests/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web Browsers (redirect_client) for enable cross-origin requests',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for enable cross-origin requests',
      },
      {
        type: 'cache',
        reason: 'Need Preflight Cache (cache) for enable cross-origin requests',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Web Browsers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to CORS Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'CORS Gateway routes to Preflight Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'CORS Gateway routes to API Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('cors-gateway', problemConfigs['cors-gateway'], [
    'Handle OPTIONS preflight requests',
    'Configure allowed origins',
    'Set proper CORS headers',
    'Support credentials in requests',
    'Cache preflight responses'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Retry and Circuit Breaker Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const retryGatewayProblemDefinition: ProblemDefinition = {
  id: 'retry-gateway',
  title: 'Retry and Circuit Breaker Gateway',
  description: `Build a resilient gateway with retry logic and circuit breakers. Learn about exponential backoff, jitter, failure detection, and how to prevent cascading failures.
- Retry failed requests with exponential backoff
- Implement circuit breaker pattern
- Add jitter to prevent thundering herd
- Track failure rates per service`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Retry failed requests with exponential backoff',
    'Implement circuit breaker pattern',
    'Add jitter to prevent thundering herd',
    'Track failure rates per service',
    'Return cached responses when circuit open'
  ],
  userFacingNFRs: [
    'Latency: P95 < 200ms including retries',
    'Request Rate: 10k requests/sec',
    'Availability: 99.95% with degraded mode, prevent cascading failures'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Clients (redirect_client) for handle failures gracefully',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for handle failures gracefully',
      },
      {
        type: 'cache',
        reason: 'Need Response Cache (cache) for handle failures gracefully',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Retry Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Retry Gateway routes to Response Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Retry Gateway routes to Stable Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Retry Gateway routes to Flaky Service',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('retry-gateway', problemConfigs['retry-gateway'], [
    'Retry failed requests with exponential backoff',
    'Implement circuit breaker pattern',
    'Add jitter to prevent thundering herd',
    'Track failure rates per service',
    'Return cached responses when circuit open'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Compression Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const compressionGatewayProblemDefinition: ProblemDefinition = {
  id: 'compression-gateway',
  title: 'Compression Gateway',
  description: `Implement response compression at the gateway to reduce bandwidth usage. Learn about different compression algorithms (gzip, brotli), content negotiation, and CPU vs bandwidth trade-offs.
- Compress responses with gzip/brotli
- Support Accept-Encoding negotiation
- Skip compression for small payloads
- Cache compressed responses`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Compress responses with gzip/brotli',
    'Support Accept-Encoding negotiation',
    'Skip compression for small payloads',
    'Cache compressed responses',
    'Monitor compression ratios'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms compression overhead',
    'Request Rate: 12k requests/sec, reduce bandwidth by 70% for text'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web Clients (redirect_client) for reduce bandwidth with gzip/brotli',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for reduce bandwidth with gzip/brotli',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for reduce bandwidth with gzip/brotli',
      },
      {
        type: 'cache',
        reason: 'Need Compressed Cache (cache) for reduce bandwidth with gzip/brotli',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Web Clients routes to CDN',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Web Clients routes to Load Balancer',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN routes to Compression GW',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Compression GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Compression GW routes to Compressed Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Compression GW routes to API Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('compression-gateway', problemConfigs['compression-gateway'], [
    'Compress responses with gzip/brotli',
    'Support Accept-Encoding negotiation',
    'Skip compression for small payloads',
    'Cache compressed responses',
    'Monitor compression ratios'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Request Logging Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const loggingGatewayProblemDefinition: ProblemDefinition = {
  id: 'logging-gateway',
  title: 'Request Logging Gateway',
  description: `Build a gateway that logs all requests for debugging, monitoring, and analytics. Learn about structured logging, sampling strategies, and avoiding performance impact.
- Log request/response metadata
- Implement correlation IDs
- Support sampling for high volume
- Send logs to centralized system`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Log request/response metadata',
    'Implement correlation IDs',
    'Support sampling for high volume',
    'Send logs to centralized system',
    'Extract metrics from logs'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5ms logging overhead',
    'Request Rate: 25k requests/sec',
    'Dataset Size: 1TB logs per day',
    'Durability: 30 days retention'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for centralized logging and metrics',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for centralized logging and metrics',
      },
      {
        type: 'message_queue',
        reason: 'Need Log Buffer (queue) for centralized logging and metrics',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Logging Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Logging Gateway routes to Log Buffer',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Logging Gateway routes to Log Stream',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Logging Gateway routes to Backend Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('logging-gateway', problemConfigs['logging-gateway'], [
    'Log request/response metadata',
    'Implement correlation IDs',
    'Support sampling for high volume',
    'Send logs to centralized system',
    'Extract metrics from logs'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Health Check Endpoint Aggregator
 * From extracted-problems/system-design/gateway.md
 */
export const healthCheckGatewayProblemDefinition: ProblemDefinition = {
  id: 'health-check-gateway',
  title: 'Health Check Endpoint Aggregator',
  description: `Create a health check aggregator that monitors multiple microservices and provides a unified health status. Learn about dependency checks, graceful degradation, and health status reporting.
- Aggregate health checks from all services
- Report overall system health
- Track dependency health
- Support different health levels (healthy, degraded, down)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Aggregate health checks from all services',
    'Report overall system health',
    'Track dependency health',
    'Support different health levels (healthy, degraded, down)',
    'Cache health results with TTL'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for health endpoint',
    'Request Rate: 1k health checks/sec',
    'Availability: 99.9% uptime for health endpoint'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Health Monitors (redirect_client) for monitor service health across microservices',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for monitor service health across microservices',
      },
      {
        type: 'cache',
        reason: 'Need Health Cache (cache) for monitor service health across microservices',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Health Monitors routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Health Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Health Gateway routes to Health Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Health Gateway routes to Service A',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Health Gateway routes to Service B',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Health Gateway routes to Service C',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('health-check-gateway', problemConfigs['health-check-gateway'], [
    'Aggregate health checks from all services',
    'Report overall system health',
    'Track dependency health',
    'Support different health levels (healthy, degraded, down)',
    'Cache health results with TTL'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dynamic API Routing Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const apiRoutingGatewayProblemDefinition: ProblemDefinition = {
  id: 'api-routing-gateway',
  title: 'Dynamic API Routing Gateway',
  description: `Implement a gateway with dynamic routing capabilities including canary releases, A/B testing, and header-based routing. Learn about traffic splitting and gradual rollouts.
- Route based on headers and query params
- Support canary releases with percentage
- Enable A/B testing by user segment
- Implement feature flags via routing`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Route based on headers and query params',
    'Support canary releases with percentage',
    'Enable A/B testing by user segment',
    'Implement feature flags via routing',
    'Track routing decisions for analytics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 30ms routing overhead',
    'Request Rate: 18k requests/sec',
    'Availability: 99.9% uptime, 99.99% correct routing'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for route based on headers and query params',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for route based on headers and query params',
      },
      {
        type: 'cache',
        reason: 'Need Config Cache (cache) for route based on headers and query params',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Routing Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Routing Gateway routes to Config Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Routing Gateway routes to Stable v1.0',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Routing Gateway routes to Canary v2.0',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('api-routing-gateway', problemConfigs['api-routing-gateway'], [
    'Route based on headers and query params',
    'Support canary releases with percentage',
    'Enable A/B testing by user segment',
    'Implement feature flags via routing',
    'Track routing decisions for analytics'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Advanced Response Transformation
 * From extracted-problems/system-design/gateway.md
 */
export const responseTransformGatewayProblemDefinition: ProblemDefinition = {
  id: 'response-transform-gateway',
  title: 'Advanced Response Transformation',
  description: `Build a gateway that transforms API responses based on client type and requirements. Learn about field filtering, response merging, and format conversion.
- Filter response fields by client type
- Merge responses from multiple services
- Convert between data formats (JSON/XML)
- Add computed fields to responses`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Filter response fields by client type',
    'Merge responses from multiple services',
    'Convert between data formats (JSON/XML)',
    'Add computed fields to responses',
    'Support response templates'
  ],
  userFacingNFRs: [
    'Latency: P95 < 60ms transformation time',
    'Request Rate: 14k requests/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile (redirect_client) for transform and aggregate responses',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for transform and aggregate responses',
      },
      {
        type: 'cache',
        reason: 'Need Template Cache (cache) for transform and aggregate responses',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Mobile routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Desktop routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Transform Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Transform Gateway routes to Template Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transform Gateway routes to Transform Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transform Gateway routes to Backend API',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('response-transform-gateway', problemConfigs['response-transform-gateway'], [
    'Filter response fields by client type',
    'Merge responses from multiple services',
    'Convert between data formats (JSON/XML)',
    'Add computed fields to responses',
    'Support response templates'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Backend-for-Frontend (BFF) Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const apiAggregationGatewayProblemDefinition: ProblemDefinition = {
  id: 'api-aggregation-gateway',
  title: 'Backend-for-Frontend (BFF) Gateway',
  description: `Build a Backend-for-Frontend gateway that aggregates multiple microservice calls into optimized responses for different client types (mobile, web, TV). Learn about parallel API calls, response shaping, and client-specific optimization.
- Aggregate multiple service calls
- Shape responses for different clients
- Execute parallel API calls
- Handle partial failures gracefully`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Aggregate multiple service calls',
    'Shape responses for different clients',
    'Execute parallel API calls',
    'Handle partial failures gracefully',
    'Cache aggregated responses',
    'Support GraphQL-like field selection'
  ],
  userFacingNFRs: [
    'Latency: P95 < 200ms for aggregated calls',
    'Request Rate: 50k requests/sec',
    'Availability: 99.9% with degraded responses'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile Apps (redirect_client) for aggregate multiple apis for mobile/web',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for aggregate multiple apis for mobile/web',
      },
      {
        type: 'cache',
        reason: 'Need Response Cache (cache) for aggregate multiple apis for mobile/web',
      },
      {
        type: 'message_queue',
        reason: 'Need Async Queue (queue) for aggregate multiple apis for mobile/web',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Mobile Apps routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Web Apps routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to BFF Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'BFF Gateway routes to Response Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'BFF Gateway routes to User Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'BFF Gateway routes to Product Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'BFF Gateway routes to Order Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'BFF Gateway routes to Async Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Async Queue routes to Aggregator',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('api-aggregation-gateway', problemConfigs['api-aggregation-gateway'], [
    'Aggregate multiple service calls',
    'Shape responses for different clients',
    'Execute parallel API calls',
    'Handle partial failures gracefully',
    'Cache aggregated responses',
    'Support GraphQL-like field selection'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GraphQL Federation Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const graphqlGatewayProblemDefinition: ProblemDefinition = {
  id: 'graphql-gateway',
  title: 'GraphQL Federation Gateway',
  description: `Implement a GraphQL federation gateway that combines schemas from multiple services. Learn about schema stitching, N+1 query problems, DataLoader pattern, and subscription handling.
- Federate schemas from multiple services
- Resolve cross-service references
- Implement DataLoader for batching
- Handle GraphQL subscriptions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Federate schemas from multiple services',
    'Resolve cross-service references',
    'Implement DataLoader for batching',
    'Handle GraphQL subscriptions',
    'Cache query results',
    'Support schema introspection'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for typical queries',
    'Request Rate: 30k queries/sec',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need GraphQL Clients (redirect_client) for federated graphql across services',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for federated graphql across services',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for federated graphql across services',
      },
      {
        type: 'message_queue',
        reason: 'Need Subscription Stream (stream) for federated graphql across services',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GraphQL Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Federation Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Federation Gateway routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Federation Gateway routes to User Subgraph',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Federation Gateway routes to Product Subgraph',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Federation Gateway routes to Order Subgraph',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Federation Gateway routes to Subscription Stream',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('graphql-gateway', problemConfigs['graphql-gateway'], [
    'Federate schemas from multiple services',
    'Resolve cross-service references',
    'Implement DataLoader for batching',
    'Handle GraphQL subscriptions',
    'Cache query results',
    'Support schema introspection'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * OAuth2 Authorization Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const oauth2GatewayProblemDefinition: ProblemDefinition = {
  id: 'oauth2-gateway',
  title: 'OAuth2 Authorization Gateway',
  description: `Design a Google-scale OAuth2 authorization gateway handling 2B+ users globally with 10M token operations/sec. Must handle Black Friday-level spikes (10x traffic), survive regional failures, and maintain <50ms P99 latency. Include attack detection, token rotation during breaches, and compliance with GDPR/CCPA. System must operate within $500k/month budget.
- Handle 10M token operations/sec (100M during spikes)
- Support 2 billion active users globally
- Implement authorization code flow with PKCE at scale
- Rotate all tokens within 1 hour during security breach`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Handle 10M token operations/sec (100M during spikes)',
    'Support 2 billion active users globally',
    'Implement authorization code flow with PKCE at scale',
    'Rotate all tokens within 1 hour during security breach',
    'Support multi-region token validation with <50ms latency',
    'Detect and block credential stuffing attacks in real-time',
    'Provide audit logs for compliance (7-year retention)',
    'Handle graceful degradation during 50% infrastructure failure'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms globally, P99.9 < 100ms even during spikes',
    'Request Rate: 10M ops/sec normal, 100M ops/sec during viral events',
    'Dataset Size: 2B users, 10B active tokens, 100TB audit logs',
    'Availability: 99.99% uptime (4.38 minutes downtime/month)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need OAuth Clients (redirect_client) for google-scale oauth2 with billions of users',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for google-scale oauth2 with billions of users',
      },
      {
        type: 'cache',
        reason: 'Need Token Cache (cache) for google-scale oauth2 with billions of users',
      },
      {
        type: 'storage',
        reason: 'Need Token DB (db_primary) for google-scale oauth2 with billions of users',
      },
      {
        type: 'message_queue',
        reason: 'Need Token Events (queue) for google-scale oauth2 with billions of users',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'OAuth Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to OAuth Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'OAuth Gateway routes to Token Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'OAuth Gateway routes to Token DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'OAuth Gateway routes to Token Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'OAuth Gateway routes to Resource API',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('oauth2-gateway', problemConfigs['oauth2-gateway'], [
    'Handle 10M token operations/sec (100M during spikes)',
    'Support 2 billion active users globally',
    'Implement authorization code flow with PKCE at scale',
    'Rotate all tokens within 1 hour during security breach',
    'Support multi-region token validation with <50ms latency',
    'Detect and block credential stuffing attacks in real-time',
    'Provide audit logs for compliance (7-year retention)',
    'Handle graceful degradation during 50% infrastructure failure'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * WebSocket Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const websocketGatewayProblemDefinition: ProblemDefinition = {
  id: 'websocket-gateway',
  title: 'WebSocket Gateway',
  description: `Design a WebSocket gateway that handles millions of persistent connections with efficient load balancing, message routing, and connection management. Learn about connection pooling and pub/sub patterns.
- Accept WebSocket connections at scale
- Route messages to backend services
- Implement pub/sub for broadcasting
- Handle connection lifecycle events`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Accept WebSocket connections at scale',
    'Route messages to backend services',
    'Implement pub/sub for broadcasting',
    'Handle connection lifecycle events',
    'Support message acknowledgments',
    'Provide connection state tracking'
  ],
  userFacingNFRs: [
    'Latency: P95 < 20ms message delivery',
    'Request Rate: 500k messages/sec',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need WS Clients (redirect_client) for persistent connections with load balancing',
      },
      {
        type: 'load_balancer',
        reason: 'Need WS Load Balancer (lb) for persistent connections with load balancing',
      },
      {
        type: 'cache',
        reason: 'Need Connection State (cache) for persistent connections with load balancing',
      },
      {
        type: 'message_queue',
        reason: 'Need Message Stream (stream) for persistent connections with load balancing',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'WS Clients routes to WS Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'WS Load Balancer routes to WS Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'WS Gateway routes to Connection State',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'WS Gateway routes to Message Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'WS Gateway routes to Broadcast Queue',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'WS Gateway routes to Chat Service',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('websocket-gateway', problemConfigs['websocket-gateway'], [
    'Accept WebSocket connections at scale',
    'Route messages to backend services',
    'Implement pub/sub for broadcasting',
    'Handle connection lifecycle events',
    'Support message acknowledgments',
    'Provide connection state tracking'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * gRPC Gateway with HTTP/2
 * From extracted-problems/system-design/gateway.md
 */
export const grpcGatewayProblemDefinition: ProblemDefinition = {
  id: 'grpc-gateway',
  title: 'gRPC Gateway with HTTP/2',
  description: `Build a gRPC gateway that bridges REST clients with gRPC services, leveraging HTTP/2 multiplexing and streaming. Learn about protocol buffers, bidirectional streaming, and connection reuse.
- Convert REST requests to gRPC calls
- Support unary and streaming RPCs
- Handle bidirectional streaming
- Implement connection pooling`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Convert REST requests to gRPC calls',
    'Support unary and streaming RPCs',
    'Handle bidirectional streaming',
    'Implement connection pooling',
    'Support gRPC metadata and deadlines',
    'Provide error mapping to HTTP status'
  ],
  userFacingNFRs: [
    'Latency: P95 < 40ms conversion overhead',
    'Request Rate: 35k requests/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need REST Clients (redirect_client) for bridge rest and grpc with multiplexing',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for bridge rest and grpc with multiplexing',
      },
      {
        type: 'cache',
        reason: 'Need Protobuf Cache (cache) for bridge rest and grpc with multiplexing',
      },
      {
        type: 'message_queue',
        reason: 'Need Stream Buffer (stream) for bridge rest and grpc with multiplexing',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'REST Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to gRPC Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'gRPC Gateway routes to Protobuf Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'gRPC Gateway routes to gRPC Service A',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'gRPC Gateway routes to gRPC Service B',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'gRPC Gateway routes to Stream Buffer',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('grpc-gateway', problemConfigs['grpc-gateway'], [
    'Convert REST requests to gRPC calls',
    'Support unary and streaming RPCs',
    'Handle bidirectional streaming',
    'Implement connection pooling',
    'Support gRPC metadata and deadlines',
    'Provide error mapping to HTTP status'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Mobile API Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const mobileGatewayProblemDefinition: ProblemDefinition = {
  id: 'mobile-gateway',
  title: 'Mobile API Gateway',
  description: `Design a mobile-optimized gateway that handles poor network conditions, minimizes battery drain, and reduces bandwidth usage. Learn about adaptive bitrate, request batching, and push notifications.
- Batch multiple API calls into one request
- Compress responses aggressively
- Support offline-first patterns
- Implement delta updates`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Batch multiple API calls into one request',
    'Compress responses aggressively',
    'Support offline-first patterns',
    'Implement delta updates',
    'Handle push notifications',
    'Adapt to network quality'
  ],
  userFacingNFRs: [
    'Latency: P95 < 300ms on 3G',
    'Request Rate: 60k requests/sec, reduce bandwidth by 80% vs REST'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile Apps (redirect_client) for optimize for mobile networks',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for optimize for mobile networks',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for optimize for mobile networks',
      },
      {
        type: 'cache',
        reason: 'Need Delta Cache (cache) for optimize for mobile networks',
      },
      {
        type: 'message_queue',
        reason: 'Need Batch Queue (queue) for optimize for mobile networks',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Mobile Apps routes to CDN',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Mobile Apps routes to Load Balancer',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN routes to Mobile Gateway',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Mobile Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Mobile Gateway routes to Delta Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Mobile Gateway routes to Batch Queue',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Mobile Gateway routes to Push Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Mobile Gateway routes to Backend APIs',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('mobile-gateway', problemConfigs['mobile-gateway'], [
    'Batch multiple API calls into one request',
    'Compress responses aggressively',
    'Support offline-first patterns',
    'Implement delta updates',
    'Handle push notifications',
    'Adapt to network quality'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Partner API Gateway with SLA Enforcement
 * From extracted-problems/system-design/gateway.md
 */
export const partnerGatewayProblemDefinition: ProblemDefinition = {
  id: 'partner-gateway',
  title: 'Partner API Gateway with SLA Enforcement',
  description: `Build a partner API gateway that enforces SLAs, tracks usage, and provides different service tiers. Learn about multi-tenancy, priority queuing, and usage metering.
- Enforce rate limits per partner tier
- Track API usage for billing
- Implement priority queues by SLA
- Support burst allowances`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Enforce rate limits per partner tier',
    'Track API usage for billing',
    'Implement priority queues by SLA',
    'Support burst allowances',
    'Provide usage analytics',
    'Handle quota resets'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for premium, < 200ms for free',
    'Request Rate: 100k requests/sec',
    'Availability: 99.99% for premium, 99.9% for free',
    'Durability: 100% billing accuracy'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Premium Partners (redirect_client) for multi-tenant with sla guarantees',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for multi-tenant with sla guarantees',
      },
      {
        type: 'cache',
        reason: 'Need Quota Cache (cache) for multi-tenant with sla guarantees',
      },
      {
        type: 'storage',
        reason: 'Need Usage DB (db_primary) for multi-tenant with sla guarantees',
      },
      {
        type: 'message_queue',
        reason: 'Need Metering Stream (stream) for multi-tenant with sla guarantees',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Premium Partners routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Free Partners routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Partner Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Partner Gateway routes to Quota Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Partner Gateway routes to Usage DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Partner Gateway routes to Metering Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Partner Gateway routes to Premium Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Partner Gateway routes to Free Queue',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('partner-gateway', problemConfigs['partner-gateway'], [
    'Enforce rate limits per partner tier',
    'Track API usage for billing',
    'Implement priority queues by SLA',
    'Support burst allowances',
    'Provide usage analytics',
    'Handle quota resets'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Webhook Delivery Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const webhookGatewayProblemDefinition: ProblemDefinition = {
  id: 'webhook-gateway',
  title: 'Webhook Delivery Gateway',
  description: `Design a webhook delivery system with exponential backoff, dead letter queues, and delivery guarantees. Learn about at-least-once delivery, idempotency, and failure handling.
- Deliver webhooks with retry logic
- Implement exponential backoff
- Track delivery status
- Support webhook signing`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Deliver webhooks with retry logic',
    'Implement exponential backoff',
    'Track delivery status',
    'Support webhook signing',
    'Handle dead letter queue',
    'Provide delivery analytics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms first attempt',
    'Request Rate: 200k webhooks/sec',
    'Availability: 99.9% delivery rate',
    'Durability: 7 days retry window'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Event Sources (redirect_client) for reliable webhook delivery with retries',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for reliable webhook delivery with retries',
      },
      {
        type: 'message_queue',
        reason: 'Need Delivery Queue (queue) for reliable webhook delivery with retries',
      },
      {
        type: 'storage',
        reason: 'Need DLQ Storage (db_primary) for reliable webhook delivery with retries',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Event Sources routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Webhook Gateway',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Webhook Gateway routes to Delivery Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Delivery Queue routes to Delivery Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Delivery Workers routes to DLQ Storage',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Delivery Workers routes to Status Stream',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('webhook-gateway', problemConfigs['webhook-gateway'], [
    'Deliver webhooks with retry logic',
    'Implement exponential backoff',
    'Track delivery status',
    'Support webhook signing',
    'Handle dead letter queue',
    'Provide delivery analytics'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Serverless API Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const serverlessGatewayProblemDefinition: ProblemDefinition = {
  id: 'serverless-gateway',
  title: 'Serverless API Gateway',
  description: `Design an AWS Lambda-scale serverless gateway handling 5M requests/sec with 1M concurrent executions globally. Must handle Prime Day spikes (10x traffic), maintain <0.1% cold start rate, and survive entire AZ failures. Include ML-based predictive warming, request coalescing during cold starts, and operate within $1M/month budget while supporting 100k+ different functions.
- Route 5M requests/sec to serverless functions (50M during spikes)
- Support 1M concurrent function executions
- ML-based predictive warming to keep cold starts <0.1%
- Request coalescing and buffering during cold starts`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Route 5M requests/sec to serverless functions (50M during spikes)',
    'Support 1M concurrent function executions',
    'ML-based predictive warming to keep cold starts <0.1%',
    'Request coalescing and buffering during cold starts',
    'Support 100k+ unique functions across 10k customers',
    'Handle function cascading failures gracefully',
    'Implement priority-based execution during resource constraints',
    'Support WebAssembly and container-based functions'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms warm, P99 < 500ms cold, <0.1% cold start rate',
    'Request Rate: 5M requests/sec normal, 50M during Prime Day',
    'Dataset Size: 100k functions, 10PB function code storage',
    'Availability: 99.99% uptime, survive AZ failures'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for aws lambda-scale with 1m concurrent executions',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for aws lambda-scale with 1m concurrent executions',
      },
      {
        type: 'cache',
        reason: 'Need Warmup Cache (cache) for aws lambda-scale with 1m concurrent executions',
      },
      {
        type: 'message_queue',
        reason: 'Need Request Buffer (queue) for aws lambda-scale with 1m concurrent executions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Serverless GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Serverless GW routes to Warmup Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Serverless GW routes to Request Buffer',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Serverless GW routes to Lambda Functions',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Warmer Service routes to Warmup Cache',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('serverless-gateway', problemConfigs['serverless-gateway'], [
    'Route 5M requests/sec to serverless functions (50M during spikes)',
    'Support 1M concurrent function executions',
    'ML-based predictive warming to keep cold starts <0.1%',
    'Request coalescing and buffering during cold starts',
    'Support 100k+ unique functions across 10k customers',
    'Handle function cascading failures gracefully',
    'Implement priority-based execution during resource constraints',
    'Support WebAssembly and container-based functions'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multi-Protocol Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const multiProtocolGatewayProblemDefinition: ProblemDefinition = {
  id: 'multi-protocol-gateway',
  title: 'Multi-Protocol Gateway',
  description: `Design a gateway that supports multiple protocols (REST, SOAP, GraphQL) with protocol-specific optimizations. Learn about protocol negotiation, schema management, and unified error handling.
- Support REST, SOAP, and GraphQL
- Auto-detect protocol from request
- Convert between protocols
- Maintain unified schema`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support REST, SOAP, and GraphQL',
    'Auto-detect protocol from request',
    'Convert between protocols',
    'Maintain unified schema',
    'Handle protocol-specific errors',
    'Provide protocol metrics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 80ms across protocols',
    'Request Rate: 50k requests/sec mixed',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need REST Clients (redirect_client) for support rest, soap, and graphql',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for support rest, soap, and graphql',
      },
      {
        type: 'cache',
        reason: 'Need Schema Cache (cache) for support rest, soap, and graphql',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'REST Clients routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'SOAP Clients routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GraphQL Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Multi-Protocol GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Multi-Protocol GW routes to Schema Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Multi-Protocol GW routes to Protocol Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Multi-Protocol GW routes to Backend Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('multi-protocol-gateway', problemConfigs['multi-protocol-gateway'], [
    'Support REST, SOAP, and GraphQL',
    'Auto-detect protocol from request',
    'Convert between protocols',
    'Maintain unified schema',
    'Handle protocol-specific errors',
    'Provide protocol metrics'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * API Versioning Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const versioningGatewayProblemDefinition: ProblemDefinition = {
  id: 'versioning-gateway',
  title: 'API Versioning Gateway',
  description: `Build a gateway that manages multiple API versions with backward compatibility, gradual migration, and version deprecation. Learn about semantic versioning and compatibility layers.
- Support multiple API versions
- Route by version header or path
- Transform between versions
- Track version usage`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support multiple API versions',
    'Route by version header or path',
    'Transform between versions',
    'Track version usage',
    'Deprecate old versions gracefully',
    'Provide migration guides'
  ],
  userFacingNFRs: [
    'Latency: P95 < 60ms including transforms',
    'Request Rate: 70k requests/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need v3 Clients (redirect_client) for backward compatibility with versioning',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for backward compatibility with versioning',
      },
      {
        type: 'cache',
        reason: 'Need Transform Cache (cache) for backward compatibility with versioning',
      },
      {
        type: 'storage',
        reason: 'Need Usage Analytics (db_primary) for backward compatibility with versioning',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'v3 Clients routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'v2 Clients routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'v1 Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Versioning GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Versioning GW routes to Transform Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Versioning GW routes to Usage Analytics',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Versioning GW routes to v3 Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Versioning GW routes to v2 Adapter',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Versioning GW routes to v1 Adapter',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('versioning-gateway', problemConfigs['versioning-gateway'], [
    'Support multiple API versions',
    'Route by version header or path',
    'Transform between versions',
    'Track version usage',
    'Deprecate old versions gracefully',
    'Provide migration guides'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Quota Management Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const quotaGatewayProblemDefinition: ProblemDefinition = {
  id: 'quota-gateway',
  title: 'Quota Management Gateway',
  description: `Design a gateway that enforces complex quota rules across multiple dimensions (per-second, per-day, per-month) with different tiers. Learn about quota tracking, overage handling, and fair use policies.
- Enforce per-second, per-day, per-month quotas
- Support tiered plans (free, pro, enterprise)
- Handle quota overages gracefully
- Provide quota usage API`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Enforce per-second, per-day, per-month quotas',
    'Support tiered plans (free, pro, enterprise)',
    'Handle quota overages gracefully',
    'Provide quota usage API',
    'Implement quota resets',
    'Support quota pooling for teams'
  ],
  userFacingNFRs: [
    'Latency: P95 < 15ms for quota checks',
    'Request Rate: 120k requests/sec',
    'Availability: 99.95% uptime, 99.99% quota enforcement accuracy'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Free Tier (redirect_client) for tiered rate limits and quotas',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for tiered rate limits and quotas',
      },
      {
        type: 'cache',
        reason: 'Need Quota Counters (cache) for tiered rate limits and quotas',
      },
      {
        type: 'storage',
        reason: 'Need Quota DB (db_primary) for tiered rate limits and quotas',
      },
      {
        type: 'message_queue',
        reason: 'Need Usage Stream (stream) for tiered rate limits and quotas',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Free Tier routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Pro Tier routes to Load Balancer',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Enterprise routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Quota Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Quota Gateway routes to Quota Counters',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Quota Gateway routes to Quota DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Quota Gateway routes to Usage Stream',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Quota Gateway routes to Backend API',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('quota-gateway', problemConfigs['quota-gateway'], [
    'Enforce per-second, per-day, per-month quotas',
    'Support tiered plans (free, pro, enterprise)',
    'Handle quota overages gracefully',
    'Provide quota usage API',
    'Implement quota resets',
    'Support quota pooling for teams'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * API Monetization Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const monetizationGatewayProblemDefinition: ProblemDefinition = {
  id: 'monetization-gateway',
  title: 'API Monetization Gateway',
  description: `Build a monetization gateway that tracks API usage across multiple dimensions for billing. Learn about usage metering, billing integration, and revenue optimization.
- Meter API usage by endpoint and method
- Track bandwidth consumption
- Calculate costs in real-time
- Support tiered pricing`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Meter API usage by endpoint and method',
    'Track bandwidth consumption',
    'Calculate costs in real-time',
    'Support tiered pricing',
    'Provide usage reports',
    'Integrate with billing systems'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms metering overhead',
    'Request Rate: 150k requests/sec',
    'Availability: 99.99% uptime for metering',
    'Durability: 100% billing accuracy'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Consumers (redirect_client) for usage-based billing and metering',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for usage-based billing and metering',
      },
      {
        type: 'cache',
        reason: 'Need Pricing Cache (cache) for usage-based billing and metering',
      },
      {
        type: 'message_queue',
        reason: 'Need Usage Stream (stream) for usage-based billing and metering',
      },
      {
        type: 'storage',
        reason: 'Need Billing DB (db_primary) for usage-based billing and metering',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Consumers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Monetization GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Monetization GW routes to Pricing Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Monetization GW routes to Usage Stream',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Monetization GW routes to Backend API',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Usage Stream routes to Aggregation Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Aggregation Queue routes to Aggregator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Aggregator routes to Billing DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('monetization-gateway', problemConfigs['monetization-gateway'], [
    'Meter API usage by endpoint and method',
    'Track bandwidth consumption',
    'Calculate costs in real-time',
    'Support tiered pricing',
    'Provide usage reports',
    'Integrate with billing systems'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Zero-Trust API Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const zeroTrustGatewayProblemDefinition: ProblemDefinition = {
  id: 'zero-trust-gateway',
  title: 'Zero-Trust API Gateway',
  description: `Design a Google BeyondCorp-scale zero-trust gateway handling 20M requests/sec with mTLS for 500k+ services globally. Must handle nation-state attack scenarios (100x traffic), maintain <10ms P99 latency with hardware crypto acceleration, and survive compromise of 10% of certificates. Support 1M certificate rotations/day, continuous risk assessment, and operate within $2M/month budget.
- Handle 20M requests/sec with mTLS (2B during attacks)
- Support 500k+ unique service identities globally
- Hardware-accelerated crypto for <10ms validation
- Continuous risk scoring and adaptive authentication`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Handle 20M requests/sec with mTLS (2B during attacks)',
    'Support 500k+ unique service identities globally',
    'Hardware-accelerated crypto for <10ms validation',
    'Continuous risk scoring and adaptive authentication',
    'Auto-rotate 1M certificates daily without downtime',
    'Micro-segment 10k+ different service meshes',
    'Real-time threat detection with ML anomaly detection',
    'Support FIDO2, WebAuthn, and biometric authentication'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms with crypto, P99.9 < 25ms during attacks',
    'Request Rate: 20M requests/sec normal, 2B during DDoS',
    'Dataset Size: 500k services, 100M certificates, 10PB audit logs',
    'Availability: 99.999% uptime (26 seconds downtime/month)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Authenticated Clients (redirect_client) for google beyondcorp-scale zero-trust architecture',
      },
      {
        type: 'load_balancer',
        reason: 'Need TLS Termination (lb) for google beyondcorp-scale zero-trust architecture',
      },
      {
        type: 'cache',
        reason: 'Need Cert Cache (cache) for google beyondcorp-scale zero-trust architecture',
      },
      {
        type: 'storage',
        reason: 'Need Cert Store (db_primary) for google beyondcorp-scale zero-trust architecture',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Queue (queue) for google beyondcorp-scale zero-trust architecture',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Authenticated Clients routes to TLS Termination',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'TLS Termination routes to Zero-Trust GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Zero-Trust GW routes to Cert Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Zero-Trust GW routes to Cert Store',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Zero-Trust GW routes to Audit Queue',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Zero-Trust GW routes to Policy Engine',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Zero-Trust GW routes to Segmented Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('zero-trust-gateway', problemConfigs['zero-trust-gateway'], [
    'Handle 20M requests/sec with mTLS (2B during attacks)',
    'Support 500k+ unique service identities globally',
    'Hardware-accelerated crypto for <10ms validation',
    'Continuous risk scoring and adaptive authentication',
    'Auto-rotate 1M certificates daily without downtime',
    'Micro-segment 10k+ different service meshes',
    'Real-time threat detection with ML anomaly detection',
    'Support FIDO2, WebAuthn, and biometric authentication'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * AI/ML Model Serving Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const mlModelGatewayProblemDefinition: ProblemDefinition = {
  id: 'ml-model-gateway',
  title: 'AI/ML Model Serving Gateway',
  description: `Design an OpenAI GPT-scale ML serving gateway handling 100M inference requests/sec for 10k+ different models globally. Must handle ChatGPT viral moments (20x traffic), maintain <20ms P99 latency for inference, and survive GPU cluster failures. Support 1000+ model versions, real-time A/B testing, automatic rollback on quality degradation, and operate within $10M/month budget.
- Serve 100M predictions/sec (2B during viral ChatGPT moments)
- Support 10k+ different models with 1000+ versions
- GPU orchestration across 100k+ GPUs globally
- Real-time A/B testing with statistical significance`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Serve 100M predictions/sec (2B during viral ChatGPT moments)',
    'Support 10k+ different models with 1000+ versions',
    'GPU orchestration across 100k+ GPUs globally',
    'Real-time A/B testing with statistical significance',
    'Automatic rollback when model quality degrades >5%',
    'Batch inference with dynamic batch sizing',
    'Multi-modal support (text, image, video, audio)',
    'Federated learning and edge inference capabilities'
  ],
  userFacingNFRs: [
    'Latency: P99 < 20ms inference, P99.9 < 50ms during spikes',
    'Request Rate: 100M predictions/sec normal, 2B during viral events',
    'Dataset Size: 10k models, 100PB training data, 1EB logs',
    'Availability: 99.99% uptime, automatic failover between GPU clusters'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need ML Clients (redirect_client) for openai gpt-scale serving 100m requests/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for openai gpt-scale serving 100m requests/sec',
      },
      {
        type: 'cache',
        reason: 'Need Prediction Cache (cache) for openai gpt-scale serving 100m requests/sec',
      },
      {
        type: 'message_queue',
        reason: 'Need Batch Queue (queue) for openai gpt-scale serving 100m requests/sec',
      },
      {
        type: 'storage',
        reason: 'Need Model Registry (db_primary) for openai gpt-scale serving 100m requests/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'ML Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to ML Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'ML Gateway routes to Prediction Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'ML Gateway routes to Batch Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Batch Queue routes to v1.0 Models',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Batch Queue routes to v2.0 Canary',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'ML Gateway routes to Metrics Stream',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ML Gateway routes to Model Registry',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('ml-model-gateway', problemConfigs['ml-model-gateway'], [
    'Serve 100M predictions/sec (2B during viral ChatGPT moments)',
    'Support 10k+ different models with 1000+ versions',
    'GPU orchestration across 100k+ GPUs globally',
    'Real-time A/B testing with statistical significance',
    'Automatic rollback when model quality degrades >5%',
    'Batch inference with dynamic batch sizing',
    'Multi-modal support (text, image, video, audio)',
    'Federated learning and edge inference capabilities'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time Fraud Detection Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const fraudDetectionGatewayProblemDefinition: ProblemDefinition = {
  id: 'fraud-detection-gateway',
  title: 'Real-time Fraud Detection Gateway',
  description: `Design a fraud detection gateway that scores every transaction in real-time with <5ms latency. Learn about feature engineering, model optimization, edge inference, and risk-based routing.
- Score all transactions in real-time
- Extract features from transaction data
- Apply multiple fraud models
- Risk-based routing (block, challenge, allow)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Score all transactions in real-time',
    'Extract features from transaction data',
    'Apply multiple fraud models',
    'Risk-based routing (block, challenge, allow)',
    'Real-time model updates',
    'Track fraud patterns',
    'Generate fraud alerts',
    'Support manual review queue'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5ms scoring time',
    'Request Rate: 500k transactions/sec',
    'Availability: 99.99% uptime, <0.1% false positive rate, >95% fraud detection'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Transactions (redirect_client) for ml scoring under 5ms',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for ml scoring under 5ms',
      },
      {
        type: 'cache',
        reason: 'Need Feature Cache (cache) for ml scoring under 5ms',
      },
      {
        type: 'message_queue',
        reason: 'Need Fraud Stream (stream) for ml scoring under 5ms',
      },
      {
        type: 'storage',
        reason: 'Need Fraud Patterns (db_primary) for ml scoring under 5ms',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Transactions routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Fraud Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Fraud Gateway routes to Feature Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Fraud Gateway routes to Scoring Workers',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Fraud Gateway routes to Fraud Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Scoring Workers routes to Review Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Fraud Stream routes to Fraud Patterns',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('fraud-detection-gateway', problemConfigs['fraud-detection-gateway'], [
    'Score all transactions in real-time',
    'Extract features from transaction data',
    'Apply multiple fraud models',
    'Risk-based routing (block, challenge, allow)',
    'Real-time model updates',
    'Track fraud patterns',
    'Generate fraud alerts',
    'Support manual review queue'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * High-Frequency Trading Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const hftGatewayProblemDefinition: ProblemDefinition = {
  id: 'hft-gateway',
  title: 'High-Frequency Trading Gateway',
  description: `Build an ultra-low latency gateway for high-frequency trading with microsecond routing, kernel bypass networking, and co-location optimization. Learn about tick-to-trade latency and deterministic performance.
- Route orders to exchanges with <100μs latency
- Implement FIX protocol support
- Kernel bypass networking (DPDK)
- Lock-free data structures`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Route orders to exchanges with <100μs latency',
    'Implement FIX protocol support',
    'Kernel bypass networking (DPDK)',
    'Lock-free data structures',
    'Deterministic garbage collection',
    'Hardware timestamping',
    'Market data fanout',
    'Order validation and risk checks'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100μs tick-to-trade, <10μs jitter',
    'Request Rate: 1M orders/sec',
    'Availability: 99.999% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Trading Algos (redirect_client) for microsecond latency trading',
      },
      {
        type: 'cache',
        reason: 'Need Risk Cache (cache) for microsecond latency trading',
      },
      {
        type: 'message_queue',
        reason: 'Need Market Data (stream) for microsecond latency trading',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Trading Algos routes to HFT Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'HFT Gateway routes to Risk Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'HFT Gateway routes to Market Data',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'HFT Gateway routes to Exchange A',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'HFT Gateway routes to Exchange B',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('hft-gateway', problemConfigs['hft-gateway'], [
    'Route orders to exchanges with <100μs latency',
    'Implement FIX protocol support',
    'Kernel bypass networking (DPDK)',
    'Lock-free data structures',
    'Deterministic garbage collection',
    'Hardware timestamping',
    'Market data fanout',
    'Order validation and risk checks'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * IoT Device Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const iotGatewayProblemDefinition: ProblemDefinition = {
  id: 'iot-gateway',
  title: 'IoT Device Gateway',
  description: `Design an IoT gateway supporting millions of concurrent devices using MQTT and CoAP protocols. Learn about connection state management, message queuing, and efficient device addressing.
- Support MQTT and CoAP protocols
- Handle 10M+ concurrent connections
- Implement QoS levels (0, 1, 2)
- Topic-based message routing`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support MQTT and CoAP protocols',
    'Handle 10M+ concurrent connections',
    'Implement QoS levels (0, 1, 2)',
    'Topic-based message routing',
    'Device authentication and authorization',
    'Offline message buffering',
    'Device shadow synchronization',
    'Firmware update distribution'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms message delivery',
    'Request Rate: 5M messages/sec',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Devices (redirect_client) for millions of devices with mqtt/coap',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for millions of devices with mqtt/coap',
      },
      {
        type: 'cache',
        reason: 'Need Device Shadow (cache) for millions of devices with mqtt/coap',
      },
      {
        type: 'message_queue',
        reason: 'Need Telemetry Stream (stream) for millions of devices with mqtt/coap',
      },
      {
        type: 'storage',
        reason: 'Need Device Registry (db_primary) for millions of devices with mqtt/coap',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'IoT Devices routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to IoT Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'IoT Gateway routes to Device Shadow',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'IoT Gateway routes to Telemetry Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'IoT Gateway routes to Offline Queue',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'IoT Gateway routes to Device Registry',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Telemetry Stream routes to Message Processors',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('iot-gateway', problemConfigs['iot-gateway'], [
    'Support MQTT and CoAP protocols',
    'Handle 10M+ concurrent connections',
    'Implement QoS levels (0, 1, 2)',
    'Topic-based message routing',
    'Device authentication and authorization',
    'Offline message buffering',
    'Device shadow synchronization',
    'Firmware update distribution'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Blockchain RPC Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const blockchainGatewayProblemDefinition: ProblemDefinition = {
  id: 'blockchain-gateway',
  title: 'Blockchain RPC Gateway',
  description: `Build a blockchain RPC gateway with node failover, intelligent caching, and rate limiting. Learn about blockchain data consistency, mempool tracking, and WebSocket subscriptions for events.
- Load balance across blockchain nodes
- Implement node health checking
- Cache immutable blockchain data
- Handle node sync lag`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Load balance across blockchain nodes',
    'Implement node health checking',
    'Cache immutable blockchain data',
    'Handle node sync lag',
    'Support WebSocket subscriptions',
    'Track mempool for pending txs',
    'Batch RPC calls',
    'Provide historical data archive'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for cached calls',
    'Request Rate: 300k RPC calls/sec',
    'Availability: 99.95% uptime, handle blockchain reorgs'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need dApp Clients (redirect_client) for node failover and rate limiting',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for node failover and rate limiting',
      },
      {
        type: 'cache',
        reason: 'Need Block Cache (cache) for node failover and rate limiting',
      },
      {
        type: 'storage',
        reason: 'Need Historical DB (db_primary) for node failover and rate limiting',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Stream (stream) for node failover and rate limiting',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'dApp Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Blockchain GW',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Blockchain GW routes to Block Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Blockchain GW routes to Full Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Blockchain GW routes to Archive Nodes',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Archive Nodes routes to Historical DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Blockchain GW routes to Event Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Stream routes to Indexers',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('blockchain-gateway', problemConfigs['blockchain-gateway'], [
    'Load balance across blockchain nodes',
    'Implement node health checking',
    'Cache immutable blockchain data',
    'Handle node sync lag',
    'Support WebSocket subscriptions',
    'Track mempool for pending txs',
    'Batch RPC calls',
    'Provide historical data archive'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cloudflare-like Global Traffic Manager
 * From extracted-problems/system-design/gateway.md
 */
export const globalTrafficGatewayProblemDefinition: ProblemDefinition = {
  id: 'global-traffic-gateway',
  title: 'Cloudflare-like Global Traffic Manager',
  description: `Design a Cloudflare-scale global edge network handling 100M requests/sec across 300+ PoPs worldwide. Must mitigate 10Tbps DDoS attacks, maintain <5ms P99 edge latency, and survive simultaneous failures of 3 entire regions. Support 50M+ domains, real-time threat intelligence sharing, ML-based attack detection, and operate within $20M/month budget while handling nation-state level attacks.
- Handle 100M requests/sec globally (10B during attacks)
- Deploy across 300+ edge locations in 100+ countries
- Mitigate 10Tbps volumetric DDoS attacks
- Support 50M+ customer domains with custom rules`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Handle 100M requests/sec globally (10B during attacks)',
    'Deploy across 300+ edge locations in 100+ countries',
    'Mitigate 10Tbps volumetric DDoS attacks',
    'Support 50M+ customer domains with custom rules',
    'ML-based zero-day attack detection <100ms',
    'Real-time threat intelligence across all PoPs',
    'Anycast routing with <50ms convergence on failure',
    'Support HTTP/3, QUIC, and experimental protocols'
  ],
  userFacingNFRs: [
    'Latency: P99 < 5ms at edge, P99.9 < 10ms during attacks',
    'Request Rate: 100M requests/sec normal, 10B during nation-state attacks',
    'Availability: 99.999% uptime, survive 3 simultaneous region failures'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Traffic (redirect_client) for cloudflare-scale with 100m qps and 10tbps ddos',
      },
      {
        type: 'cdn',
        reason: 'Need US Edge (cdn) for cloudflare-scale with 100m qps and 10tbps ddos',
      },
      {
        type: 'load_balancer',
        reason: 'Need Regional LB (lb) for cloudflare-scale with 100m qps and 10tbps ddos',
      },
      {
        type: 'cache',
        reason: 'Need Rate Limit Cache (cache) for cloudflare-scale with 100m qps and 10tbps ddos',
      },
      {
        type: 'message_queue',
        reason: 'Need Attack Stream (stream) for cloudflare-scale with 100m qps and 10tbps ddos',
      },
      {
        type: 'storage',
        reason: 'Need WAF Rules (db_primary) for cloudflare-scale with 100m qps and 10tbps ddos',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Traffic routes to US Edge',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Traffic routes to EU Edge',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Traffic routes to APAC Edge',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'US Edge routes to Regional LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'EU Edge routes to Regional LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'APAC Edge routes to Regional LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Regional LB routes to Edge Proxy',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Edge Proxy routes to Rate Limit Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Proxy routes to DDoS Detector',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'DDoS Detector routes to Attack Stream',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Proxy routes to WAF Rules',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Attack Stream routes to Mitigation Queue',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('global-traffic-gateway', problemConfigs['global-traffic-gateway'], [
    'Handle 100M requests/sec globally (10B during attacks)',
    'Deploy across 300+ edge locations in 100+ countries',
    'Mitigate 10Tbps volumetric DDoS attacks',
    'Support 50M+ customer domains with custom rules',
    'ML-based zero-day attack detection <100ms',
    'Real-time threat intelligence across all PoPs',
    'Anycast routing with <50ms convergence on failure',
    'Support HTTP/3, QUIC, and experimental protocols'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Edge Compute Gateway (Cloudflare Workers)
 * From extracted-problems/system-design/gateway.md
 */
export const edgeComputeGatewayProblemDefinition: ProblemDefinition = {
  id: 'edge-compute-gateway',
  title: 'Edge Compute Gateway (Cloudflare Workers)',
  description: `Design an edge compute platform that runs serverless functions at CDN edge locations. Handle cold starts, quota enforcement, and execution isolation at global scale.
- Deploy functions to 100+ edge locations
- Isolate tenant execution
- Enforce CPU/memory quotas
- Handle cold start optimization`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Deploy functions to 100+ edge locations',
    'Isolate tenant execution',
    'Enforce CPU/memory quotas',
    'Handle cold start optimization',
    'Support multiple runtimes',
    'Provide edge KV storage'
  ],
  userFacingNFRs: [
    'Latency: P50 < 5ms, P95 < 15ms, cold start < 50ms',
    'Request Rate: 5M req/s globally across edges',
    'Dataset Size: 100k functions, 1MB avg size',
    'Availability: 99.99% uptime',
    'Durability: Function code replicated to all edges'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for run code at cdn edge for low latency',
      },
      {
        type: 'cdn',
        reason: 'Need US Edge (cdn) for run code at cdn edge for low latency',
      },
      {
        type: 'cache',
        reason: 'Need Edge KV (cache) for run code at cdn edge for low latency',
      },
      {
        type: 'message_queue',
        reason: 'Need Deployment Queue (queue) for run code at cdn edge for low latency',
      },
      {
        type: 'storage',
        reason: 'Need Function Registry (db_primary) for run code at cdn edge for low latency',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Users routes to US Edge',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Users routes to EU Edge',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Users routes to APAC Edge',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'US Edge routes to Edge Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'EU Edge routes to Edge Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'APAC Edge routes to Edge Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Workers routes to Edge KV',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Deployment Queue routes to Edge Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Edge Workers routes to Function Registry',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('edge-compute-gateway', problemConfigs['edge-compute-gateway'], [
    'Deploy functions to 100+ edge locations',
    'Isolate tenant execution',
    'Enforce CPU/memory quotas',
    'Handle cold start optimization',
    'Support multiple runtimes',
    'Provide edge KV storage'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * API Response Caching Gateway
 * From extracted-problems/system-design/gateway.md
 */
export const apiCachingGatewayProblemDefinition: ProblemDefinition = {
  id: 'api-caching-gateway',
  title: 'API Response Caching Gateway',
  description: `Design an API gateway that caches responses based on URL patterns, headers, and query parameters. Implement cache invalidation strategies, vary headers, and conditional requests.
- Cache GET requests by URL+headers
- Support cache control headers
- Implement conditional requests (ETag, Last-Modified)
- Vary cache by query params`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Cache GET requests by URL+headers',
    'Support cache control headers',
    'Implement conditional requests (ETag, Last-Modified)',
    'Vary cache by query params',
    'Tag-based cache invalidation',
    'Bypass cache for authenticated requests'
  ],
  userFacingNFRs: [
    'Latency: P95 < 15ms cache hit, P95 < 100ms cache miss',
    'Request Rate: 50k req/s (40k cacheable)',
    'Dataset Size: 10GB cache, 1M unique URLs',
    'Availability: 99.95% uptime',
    'Durability: Cache ephemeral, rebuild from backend'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for cache api responses at gateway layer',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for cache api responses at gateway layer',
      },
      {
        type: 'cache',
        reason: 'Need Response Cache (cache) for cache api responses at gateway layer',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Clients routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API Gateway routes to Response Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Backend API',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('api-caching-gateway', problemConfigs['api-caching-gateway'], [
    'Cache GET requests by URL+headers',
    'Support cache control headers',
    'Implement conditional requests (ETag, Last-Modified)',
    'Vary cache by query params',
    'Tag-based cache invalidation',
    'Bypass cache for authenticated requests'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Service Discovery Gateway (Consul/Eureka)
 * From extracted-problems/system-design/gateway.md
 */
export const serviceDiscoveryGatewayProblemDefinition: ProblemDefinition = {
  id: 'service-discovery-gateway',
  title: 'Service Discovery Gateway (Consul/Eureka)',
  description: `Design an API gateway with service discovery integration. Automatically detect new service instances, perform health checks, and route traffic only to healthy endpoints.
- Auto-discover service instances
- Perform active health checks
- Route to healthy endpoints only
- Support multiple service versions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Auto-discover service instances',
    'Perform active health checks',
    'Route to healthy endpoints only',
    'Support multiple service versions',
    'Load balance across instances',
    'Handle service failures gracefully'
  ],
  userFacingNFRs: [
    'Latency: P95 < 20ms routing decision',
    'Request Rate: 100k req/s across all services',
    'Dataset Size: 1000 service instances, 100 services',
    'Availability: 99.99% uptime with failover',
    'Durability: Service registry rebuilt from discovery'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Clients (redirect_client) for dynamic service routing with health checks',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for dynamic service routing with health checks',
      },
      {
        type: 'cache',
        reason: 'Need Health Cache (cache) for dynamic service routing with health checks',
      },
      {
        type: 'storage',
        reason: 'Need Service Registry (db_primary) for dynamic service routing with health checks',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Clients routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Gateway routes to Health Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway routes to Service Registry',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gateway routes to Services',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('service-discovery-gateway', problemConfigs['service-discovery-gateway'], [
    'Auto-discover service instances',
    'Perform active health checks',
    'Route to healthy endpoints only',
    'Support multiple service versions',
    'Load balance across instances',
    'Handle service failures gracefully'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

