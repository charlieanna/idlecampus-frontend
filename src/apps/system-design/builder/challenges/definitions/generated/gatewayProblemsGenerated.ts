import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Gateway Problems (Auto-generated)
 * Generated from extracted-problems/system-design/gateway.md
 */

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

  scenarios: generateScenarios('request-transform-gateway', problemConfigs['request-transform-gateway']),

  validators: [
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

  scenarios: generateScenarios('cors-gateway', problemConfigs['cors-gateway']),

  validators: [
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

  scenarios: generateScenarios('retry-gateway', problemConfigs['retry-gateway']),

  validators: [
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

  scenarios: generateScenarios('compression-gateway', problemConfigs['compression-gateway']),

  validators: [
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

  scenarios: generateScenarios('logging-gateway', problemConfigs['logging-gateway']),

  validators: [
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

  scenarios: generateScenarios('health-check-gateway', problemConfigs['health-check-gateway']),

  validators: [
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

  scenarios: generateScenarios('api-routing-gateway', problemConfigs['api-routing-gateway']),

  validators: [
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

  scenarios: generateScenarios('response-transform-gateway', problemConfigs['response-transform-gateway']),

  validators: [
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

  scenarios: generateScenarios('api-aggregation-gateway', problemConfigs['api-aggregation-gateway']),

  validators: [
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

  scenarios: generateScenarios('graphql-gateway', problemConfigs['graphql-gateway']),

  validators: [
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

  scenarios: generateScenarios('oauth2-gateway', problemConfigs['oauth2-gateway']),

  validators: [
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

  scenarios: generateScenarios('websocket-gateway', problemConfigs['websocket-gateway']),

  validators: [
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

  scenarios: generateScenarios('grpc-gateway', problemConfigs['grpc-gateway']),

  validators: [
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

  scenarios: generateScenarios('mobile-gateway', problemConfigs['mobile-gateway']),

  validators: [
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

  scenarios: generateScenarios('partner-gateway', problemConfigs['partner-gateway']),

  validators: [
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

  scenarios: generateScenarios('webhook-gateway', problemConfigs['webhook-gateway']),

  validators: [
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

  scenarios: generateScenarios('serverless-gateway', problemConfigs['serverless-gateway']),

  validators: [
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

  scenarios: generateScenarios('multi-protocol-gateway', problemConfigs['multi-protocol-gateway']),

  validators: [
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

  scenarios: generateScenarios('versioning-gateway', problemConfigs['versioning-gateway']),

  validators: [
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

  scenarios: generateScenarios('quota-gateway', problemConfigs['quota-gateway']),

  validators: [
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

  scenarios: generateScenarios('monetization-gateway', problemConfigs['monetization-gateway']),

  validators: [
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

  scenarios: generateScenarios('zero-trust-gateway', problemConfigs['zero-trust-gateway']),

  validators: [
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

  scenarios: generateScenarios('ml-model-gateway', problemConfigs['ml-model-gateway']),

  validators: [
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

  scenarios: generateScenarios('fraud-detection-gateway', problemConfigs['fraud-detection-gateway']),

  validators: [
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

  scenarios: generateScenarios('hft-gateway', problemConfigs['hft-gateway']),

  validators: [
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

  scenarios: generateScenarios('iot-gateway', problemConfigs['iot-gateway']),

  validators: [
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

  scenarios: generateScenarios('blockchain-gateway', problemConfigs['blockchain-gateway']),

  validators: [
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

  scenarios: generateScenarios('global-traffic-gateway', problemConfigs['global-traffic-gateway']),

  validators: [
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

  scenarios: generateScenarios('edge-compute-gateway', problemConfigs['edge-compute-gateway']),

  validators: [
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

  scenarios: generateScenarios('api-caching-gateway', problemConfigs['api-caching-gateway']),

  validators: [
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

  scenarios: generateScenarios('service-discovery-gateway', problemConfigs['service-discovery-gateway']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

