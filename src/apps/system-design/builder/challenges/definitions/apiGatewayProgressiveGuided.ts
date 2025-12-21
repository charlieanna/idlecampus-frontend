import { GuidedTutorial } from '../../types/guidedTutorial';

export const apiGatewayProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'api-gateway-progressive',
  title: 'Design an API Gateway',
  description: 'Build an API gateway from simple proxy to enterprise-grade edge service',
  difficulty: 'hard',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design request routing and load balancing',
    'Implement authentication and rate limiting',
    'Build request/response transformation',
    'Handle circuit breaking and failover',
    'Optimize for high-performance edge processing'
  ],
  prerequisites: ['HTTP/REST basics', 'Load balancing', 'Security fundamentals'],
  tags: ['api-gateway', 'microservices', 'proxy', 'security', 'edge'],

  progressiveStory: {
    title: 'API Gateway Evolution',
    premise: "You're building an API gateway for a microservices architecture. Starting with basic routing, you'll evolve to handle millions of requests with sophisticated security, transformation, and observability.",
    phases: [
      { phase: 1, title: 'Basic Routing', description: 'Proxy requests to backend services' },
      { phase: 2, title: 'Security & Control', description: 'Auth, rate limiting, and policies' },
      { phase: 3, title: 'Transformation', description: 'Request/response modification' },
      { phase: 4, title: 'Resilience & Performance', description: 'Circuit breaking and caching' }
    ]
  },

  steps: [
    // PHASE 1: Basic Routing (Steps 1-3)
    {
      id: 'step-1',
      title: 'Request Routing',
      phase: 1,
      phaseTitle: 'Basic Routing',
      learningObjective: 'Route requests to backend services',
      thinkingFramework: {
        framework: 'Path-Based Routing',
        approach: 'Map URL paths to backend services. /users/* → user-service, /orders/* → order-service. Simple and stateless.',
        keyInsight: 'Routing rules should be hot-reloadable. Dont restart gateway to add new service. Store rules in config store, watch for changes.'
      },
      requirements: {
        functional: [
          'Define routing rules (path → service)',
          'Route requests based on URL path',
          'Support path prefix and exact matching',
          'Handle unknown routes gracefully (404)'
        ],
        nonFunctional: [
          'Routing decision < 1ms'
        ]
      },
      hints: [
        'Rule: {path_pattern, service_url, methods}',
        'Priority: exact match > prefix match',
        'Hot reload: watch config file or config service'
      ],
      expectedComponents: ['Router', 'Rule Store', 'Config Watcher'],
      successCriteria: ['Requests route correctly', 'Rules update without restart'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Load Balancing',
      phase: 1,
      phaseTitle: 'Basic Routing',
      learningObjective: 'Distribute load across service instances',
      thinkingFramework: {
        framework: 'LB Strategies',
        approach: 'Round-robin (simple), least-connections (smart), weighted (for canary). Health checks to remove unhealthy instances.',
        keyInsight: 'Gateway must know backend health. Active health checks (ping /health) or passive (track failed requests). Remove unhealthy from rotation.'
      },
      requirements: {
        functional: [
          'Discover service instances',
          'Balance load across instances',
          'Remove unhealthy instances',
          'Support multiple LB algorithms'
        ],
        nonFunctional: [
          'Zero requests to unhealthy instances'
        ]
      },
      hints: [
        'Service discovery: Consul, etcd, or DNS',
        'Health check: GET /health every 10s',
        'Unhealthy: 3 consecutive failures → remove'
      ],
      expectedComponents: ['Load Balancer', 'Service Discovery', 'Health Checker'],
      successCriteria: ['Load distributed evenly', 'Unhealthy instances avoided'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Reverse Proxy',
      phase: 1,
      phaseTitle: 'Basic Routing',
      learningObjective: 'Proxy HTTP requests to backends',
      thinkingFramework: {
        framework: 'Request Forwarding',
        approach: 'Receive request, add headers (X-Forwarded-For, X-Request-ID), forward to backend, stream response back. Handle timeouts and errors.',
        keyInsight: 'Request ID for tracing across services. Generate at gateway, propagate through system. Essential for debugging.'
      },
      requirements: {
        functional: [
          'Forward HTTP requests to backends',
          'Add proxy headers (X-Forwarded-For)',
          'Generate and propagate request ID',
          'Handle connection timeouts'
        ],
        nonFunctional: [
          'Proxy overhead < 5ms'
        ]
      },
      hints: [
        'Headers: X-Forwarded-For, X-Forwarded-Proto, X-Request-ID',
        'Timeout: connect 5s, read 30s',
        'Stream large responses, dont buffer'
      ],
      expectedComponents: ['Proxy Handler', 'Header Manager', 'Timeout Handler'],
      successCriteria: ['Requests proxied correctly', 'Headers added'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Security & Control (Steps 4-6)
    {
      id: 'step-4',
      title: 'Authentication',
      phase: 2,
      phaseTitle: 'Security & Control',
      learningObjective: 'Verify client identity at the edge',
      thinkingFramework: {
        framework: 'Centralized Auth',
        approach: 'Gateway validates tokens (JWT, API key). Backend services trust gateway. Decode token, add user context headers for backends.',
        keyInsight: 'Auth at gateway = auth once. Backend services dont each implement auth. But gateway must be highly secure and available.'
      },
      requirements: {
        functional: [
          'Validate JWT tokens',
          'Support API key authentication',
          'Pass user context to backends',
          'Handle auth failures (401, 403)'
        ],
        nonFunctional: [
          'Auth overhead < 5ms',
          'Cache token validation'
        ]
      },
      hints: [
        'JWT: verify signature, check expiry, extract claims',
        'API key: lookup in key store, rate limit per key',
        'User context: X-User-ID, X-User-Roles headers'
      ],
      expectedComponents: ['Auth Handler', 'Token Validator', 'Key Store'],
      successCriteria: ['Valid tokens pass', 'Invalid tokens rejected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Rate Limiting',
      phase: 2,
      phaseTitle: 'Security & Control',
      learningObjective: 'Control request rates per client',
      thinkingFramework: {
        framework: 'Tiered Rate Limits',
        approach: 'Limit by API key, user, IP. Different limits for different endpoints (reads vs writes). Return 429 with Retry-After header.',
        keyInsight: 'Distributed rate limiting is hard. Approximate with local + sync, or central Redis. Accept some over-limit for performance.'
      },
      requirements: {
        functional: [
          'Limit requests per second/minute per client',
          'Different limits per endpoint',
          'Return rate limit headers',
          'Support burst allowance'
        ],
        nonFunctional: [
          'Rate limit check < 1ms'
        ]
      },
      hints: [
        'Key: api_key or user_id or IP',
        'Headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After',
        'Algorithm: token bucket or sliding window'
      ],
      expectedComponents: ['Rate Limiter', 'Limit Store', 'Header Builder'],
      successCriteria: ['Limits enforced correctly', 'Headers returned'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Request Validation',
      phase: 2,
      phaseTitle: 'Security & Control',
      learningObjective: 'Validate requests before forwarding',
      thinkingFramework: {
        framework: 'Schema Validation',
        approach: 'Validate request against OpenAPI/JSON schema. Reject malformed requests at gateway. Reduces load on backends.',
        keyInsight: 'Early rejection saves resources. Invalid request detected at gateway doesnt consume backend capacity. But validation adds latency.'
      },
      requirements: {
        functional: [
          'Validate request body against schema',
          'Check required headers',
          'Validate query parameters',
          'Return detailed validation errors'
        ],
        nonFunctional: [
          'Validation < 5ms for typical request'
        ]
      },
      hints: [
        'Schema: JSON Schema or OpenAPI spec',
        'Required headers: Content-Type, Authorization',
        'Error: 400 with {field, error_message}'
      ],
      expectedComponents: ['Schema Validator', 'Header Checker', 'Error Formatter'],
      successCriteria: ['Invalid requests rejected', 'Useful error messages'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Transformation (Steps 7-9)
    {
      id: 'step-7',
      title: 'Request Transformation',
      phase: 3,
      phaseTitle: 'Transformation',
      learningObjective: 'Modify requests before forwarding',
      thinkingFramework: {
        framework: 'Request Rewriting',
        approach: 'Add/remove/modify headers. Rewrite URL paths. Transform body (XML to JSON). Inject context from auth.',
        keyInsight: 'Transformation enables API evolution. External API stays stable while internal APIs change. Gateway handles mapping.'
      },
      requirements: {
        functional: [
          'Add custom headers to requests',
          'Rewrite URL paths',
          'Transform request body format',
          'Remove sensitive headers'
        ],
        nonFunctional: [
          'Transformation < 10ms'
        ]
      },
      hints: [
        'Header injection: add X-Internal-Version from config',
        'Path rewrite: /v2/users/* → /users/* (version stripping)',
        'Body transform: jsonpath manipulation'
      ],
      expectedComponents: ['Request Transformer', 'Path Rewriter', 'Body Transformer'],
      successCriteria: ['Requests modified correctly', 'Originals preserved for logging'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Response Transformation',
      phase: 3,
      phaseTitle: 'Transformation',
      learningObjective: 'Modify responses before returning',
      thinkingFramework: {
        framework: 'Response Rewriting',
        approach: 'Filter sensitive fields from response. Wrap in standard envelope. Transform format. Add CORS headers.',
        keyInsight: 'Never expose internal error details. Gateway can sanitize error responses. Replace stack traces with error codes.'
      },
      requirements: {
        functional: [
          'Filter sensitive fields from response',
          'Wrap responses in standard format',
          'Add CORS headers',
          'Sanitize error responses'
        ],
        nonFunctional: []
      },
      hints: [
        'Envelope: {data, meta: {request_id, timestamp}}',
        'CORS: Access-Control-Allow-Origin, etc.',
        'Error: {error_code, message} without stack trace'
      ],
      expectedComponents: ['Response Transformer', 'Error Sanitizer', 'CORS Handler'],
      successCriteria: ['Responses transformed', 'Errors sanitized'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-9',
      title: 'API Aggregation',
      phase: 3,
      phaseTitle: 'Transformation',
      learningObjective: 'Combine multiple backend calls',
      thinkingFramework: {
        framework: 'Backend for Frontend',
        approach: 'Single gateway call → multiple backend calls → aggregated response. Reduces client round trips. Gateway handles orchestration.',
        keyInsight: 'Be careful with aggregation complexity. If logic grows too complex, it belongs in a dedicated service, not gateway.'
      },
      requirements: {
        functional: [
          'Define aggregate endpoints',
          'Call multiple backends in parallel',
          'Combine responses',
          'Handle partial failures'
        ],
        nonFunctional: [
          'Aggregate latency ~ max(individual latencies)'
        ]
      },
      hints: [
        'Aggregate: GET /user-profile → users + orders + preferences',
        'Parallel calls: Promise.all or async gather',
        'Partial failure: return available data, indicate missing'
      ],
      expectedComponents: ['Aggregator', 'Parallel Caller', 'Response Merger'],
      successCriteria: ['Aggregation works', 'Partial failures handled'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Resilience & Performance (Steps 10-12)
    {
      id: 'step-10',
      title: 'Circuit Breaking',
      phase: 4,
      phaseTitle: 'Resilience & Performance',
      learningObjective: 'Protect system from cascade failures',
      thinkingFramework: {
        framework: 'Circuit Breaker Pattern',
        approach: 'Track failures per backend. If failure rate > threshold, open circuit (reject immediately). Half-open: allow probe requests. Close on success.',
        keyInsight: 'Fast fail is better than slow fail. When backend is down, reject in 1ms vs wait 30s timeout. Saves resources and improves UX.'
      },
      requirements: {
        functional: [
          'Track failure rate per backend',
          'Open circuit on high failure rate',
          'Allow periodic probe requests',
          'Close circuit on successful probes'
        ],
        nonFunctional: [
          'Circuit state check < 100 microseconds'
        ]
      },
      hints: [
        'States: closed (normal) → open (failing) → half-open (testing)',
        'Open threshold: >50% failures in last 60 seconds',
        'Half-open: 1 request per 30 seconds'
      ],
      expectedComponents: ['Circuit Breaker', 'Failure Tracker', 'State Manager'],
      successCriteria: ['Circuit opens on failures', 'Recovers when backend healthy'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Response Caching',
      phase: 4,
      phaseTitle: 'Resilience & Performance',
      learningObjective: 'Cache responses to reduce backend load',
      thinkingFramework: {
        framework: 'Edge Caching',
        approach: 'Cache GET responses by URL + key headers. Respect Cache-Control headers. Serve stale during backend failure (stale-while-revalidate).',
        keyInsight: 'Cache key must include: URL, Vary headers (Accept-Language), auth context (or be public). Wrong key = security bug.'
      },
      requirements: {
        functional: [
          'Cache GET responses',
          'Respect Cache-Control headers',
          'Include auth context in cache key',
          'Serve stale on backend failure'
        ],
        nonFunctional: [
          'Cache hit latency < 1ms'
        ]
      },
      hints: [
        'Key: hash(url + vary_headers + user_id)',
        'TTL: from Cache-Control max-age or default',
        'Stale-while-revalidate: serve stale, async refresh'
      ],
      expectedComponents: ['Response Cache', 'Key Generator', 'Stale Handler'],
      successCriteria: ['Cache hits reduce backend calls', 'Stale content served on failure'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Observability',
      phase: 4,
      phaseTitle: 'Resilience & Performance',
      learningObjective: 'Monitor gateway health and performance',
      thinkingFramework: {
        framework: 'Three Pillars',
        approach: 'Metrics: latency, error rate, throughput per endpoint. Logs: request details for debugging. Traces: distributed tracing across services.',
        keyInsight: 'Gateway is the best place for observability. All traffic passes through. Single point for metrics, logging, tracing injection.'
      },
      requirements: {
        functional: [
          'Track request/response metrics',
          'Log requests with context',
          'Inject trace headers',
          'Dashboard for gateway health'
        ],
        nonFunctional: [
          'Observability overhead < 1ms'
        ]
      },
      hints: [
        'Metrics: request_total, request_duration, error_total (by route)',
        'Log: {request_id, path, status, latency, user_id}',
        'Trace: propagate X-B3-TraceId or W3C traceparent'
      ],
      expectedComponents: ['Metrics Exporter', 'Access Logger', 'Trace Propagator'],
      successCriteria: ['Metrics visible in dashboard', 'Traces connected across services'],
      estimatedTime: '8 minutes'
    }
  ]
};
