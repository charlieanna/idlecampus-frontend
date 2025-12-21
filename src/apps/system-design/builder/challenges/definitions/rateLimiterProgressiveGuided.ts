import { GuidedTutorial } from '../../types/guidedTutorial';

export const rateLimiterProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'rate-limiter-progressive',
  title: 'Design a Rate Limiter',
  description: 'Build a rate limiting system from simple counters to distributed global enforcement',
  difficulty: 'medium',
  estimatedTime: '60 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Understand rate limiting algorithms (token bucket, sliding window)',
    'Implement distributed rate limiting with Redis',
    'Handle edge cases like clock skew and race conditions',
    'Build adaptive rate limiting based on system load',
    'Design rate limiting as a service for multiple applications'
  ],
  prerequisites: ['Redis basics', 'Distributed systems concepts', 'API design'],
  tags: ['rate-limiting', 'distributed-systems', 'redis', 'infrastructure'],

  progressiveStory: {
    title: 'Rate Limiter Evolution',
    premise: "You're building rate limiting for your API. Starting with basic protection against abuse, you'll evolve to a sophisticated distributed system handling millions of requests with intelligent throttling.",
    phases: [
      { phase: 1, title: 'Basic Protection', description: 'Simple rate limiting per user' },
      { phase: 2, title: 'Distributed Enforcement', description: 'Scale across multiple servers' },
      { phase: 3, title: 'Advanced Algorithms', description: 'Precise limiting with sliding windows' },
      { phase: 4, title: 'Intelligent Platform', description: 'Adaptive limits and rate limiting as a service' }
    ]
  },

  steps: [
    // PHASE 1: Basic Protection (Steps 1-3)
    {
      id: 'step-1',
      title: 'Fixed Window Counter',
      phase: 1,
      phaseTitle: 'Basic Protection',
      learningObjective: 'Implement basic rate limiting with fixed time windows',
      thinkingFramework: {
        framework: 'Simplest Solution First',
        approach: 'Fixed window counting is the simplest rate limiter. Count requests per time window (e.g., minute), reject if over limit.',
        keyInsight: 'Fixed windows have a burst problem at boundaries: 100 requests at 0:59 + 100 at 1:01 = 200 in 2 seconds.'
      },
      requirements: {
        functional: [
          'Count requests per user per minute',
          'Reject requests when limit exceeded (429 status)',
          'Reset counter at window boundary',
          'Return remaining quota in response headers'
        ],
        nonFunctional: []
      },
      hints: [
        'Key: user_id:minute_timestamp, Value: count',
        'Use INCR with EXPIRE for atomic counter',
        'Return X-RateLimit-Remaining header'
      ],
      expectedComponents: ['Rate Limiter', 'Counter Store', 'API Middleware'],
      successCriteria: ['Requests blocked after limit', 'Counter resets each minute'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Token Bucket Algorithm',
      phase: 1,
      phaseTitle: 'Basic Protection',
      learningObjective: 'Allow controlled bursting with token bucket',
      thinkingFramework: {
        framework: 'Burst-Friendly Rate Limiting',
        approach: 'Token bucket allows bursts up to bucket size while maintaining average rate. Tokens refill at constant rate.',
        keyInsight: 'Bucket size controls burst capacity, refill rate controls sustained throughput. Both are tunable.'
      },
      requirements: {
        functional: [
          'Maintain token bucket per user',
          'Consume token on each request',
          'Refill tokens at configured rate',
          'Allow burst up to bucket capacity'
        ],
        nonFunctional: []
      },
      hints: [
        'Store: {tokens: float, last_refill: timestamp}',
        'Calculate tokens to add: (now - last_refill) * refill_rate',
        'Cap tokens at bucket_size'
      ],
      expectedComponents: ['Token Bucket', 'Bucket Store', 'API Middleware'],
      successCriteria: ['Bursts allowed within capacity', 'Sustained rate matches refill rate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Per-Endpoint Limits',
      phase: 1,
      phaseTitle: 'Basic Protection',
      learningObjective: 'Apply different limits to different API endpoints',
      thinkingFramework: {
        framework: 'Tiered Protection',
        approach: 'Not all endpoints are equal. Write endpoints need stricter limits than reads. Expensive operations need lower limits.',
        keyInsight: 'Combine user limit with endpoint limit. User might have 1000 req/min overall but only 10 writes/min.'
      },
      requirements: {
        functional: [
          'Configure different limits per endpoint',
          'Apply both user and endpoint limits',
          'Support endpoint patterns (e.g., /api/users/*)',
          'Return which limit was hit in 429 response'
        ],
        nonFunctional: []
      },
      hints: [
        'Check global limit first, then endpoint limit',
        'Use endpoint pattern matching for groups',
        'Include limit type in rate limit headers'
      ],
      expectedComponents: ['Rate Limiter', 'Limit Config', 'Pattern Matcher'],
      successCriteria: ['Different endpoints have different limits', 'Response indicates which limit hit'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Distributed Enforcement (Steps 4-6)
    {
      id: 'step-4',
      title: 'Redis-Based Distributed Counter',
      phase: 2,
      phaseTitle: 'Distributed Enforcement',
      learningObjective: 'Share rate limit state across multiple servers',
      thinkingFramework: {
        framework: 'Centralized State',
        approach: 'With multiple API servers, you need shared state. Redis is ideal: fast, atomic operations, built-in expiration.',
        keyInsight: 'Use Redis MULTI/EXEC or Lua scripts for atomic check-and-increment to prevent race conditions.'
      },
      requirements: {
        functional: [
          'Store rate limit counters in Redis',
          'Atomic increment and check operations',
          'Handle Redis connection failures gracefully',
          'Consistent limiting across all API servers'
        ],
        nonFunctional: [
          'Rate limit check latency < 5ms'
        ]
      },
      hints: [
        'Lua script for atomic check-increment-expire',
        'Fail open or closed on Redis failure (choose based on risk)',
        'Use Redis cluster for high availability'
      ],
      expectedComponents: ['Redis Rate Limiter', 'Redis Cluster', 'Fallback Handler'],
      successCriteria: ['Limits enforced consistently across servers', 'Redis failure handled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Handling Race Conditions',
      phase: 2,
      phaseTitle: 'Distributed Enforcement',
      learningObjective: 'Prevent limit bypass from concurrent requests',
      thinkingFramework: {
        framework: 'Atomic Operations',
        approach: 'Concurrent requests can read same count, both pass check, both increment - bypassing limit. Need atomic read-check-write.',
        keyInsight: 'Redis Lua scripts execute atomically. INCR returns new value atomically - check after increment, not before.'
      },
      requirements: {
        functional: [
          'Atomic check-and-increment operation',
          'Correct counting under high concurrency',
          'No limit bypass from race conditions',
          'Accurate remaining count in responses'
        ],
        nonFunctional: [
          'Handle 10K concurrent requests correctly'
        ]
      },
      hints: [
        'Pattern: INCR first, then check if over limit',
        'If over limit, request fails but counter already incremented (safe)',
        'Use Lua: local count = redis.call("INCR", key); if count > limit then return 0 else return count end'
      ],
      expectedComponents: ['Atomic Rate Limiter', 'Lua Script', 'Concurrency Tests'],
      successCriteria: ['No bypass under concurrent load', 'Count accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Multi-Region Deployment',
      phase: 2,
      phaseTitle: 'Distributed Enforcement',
      learningObjective: 'Enforce global limits across geographic regions',
      thinkingFramework: {
        framework: 'Global Consistency Trade-offs',
        approach: 'With users in multiple regions, you need global rate limiting. Options: central Redis (latency), local Redis with sync (eventual consistency), or split limits.',
        keyInsight: 'For most cases, split limits per region (100 global = 50 per region) is acceptable and avoids cross-region latency.'
      },
      requirements: {
        functional: [
          'Rate limit across multiple geographic regions',
          'Handle cross-region request routing',
          'Maintain consistent global limits',
          'Minimize cross-region latency impact'
        ],
        nonFunctional: [
          'Cross-region sync latency < 100ms',
          'Local rate check < 5ms'
        ]
      },
      hints: [
        'Option 1: Global Redis with read replicas',
        'Option 2: Per-region limits (divide global limit)',
        'Option 3: Async sync with eventual consistency (risk of temporary over-limit)'
      ],
      expectedComponents: ['Regional Rate Limiters', 'Sync Service', 'Global Coordinator'],
      successCriteria: ['Limits enforced globally', 'Local latency acceptable'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Advanced Algorithms (Steps 7-9)
    {
      id: 'step-7',
      title: 'Sliding Window Log',
      phase: 3,
      phaseTitle: 'Advanced Algorithms',
      learningObjective: 'Implement precise rate limiting with sliding window',
      thinkingFramework: {
        framework: 'Precision vs Memory Trade-off',
        approach: 'Sliding window log stores timestamp of each request. Count requests in last N seconds. Precise but memory-intensive.',
        keyInsight: 'Use Redis sorted set: ZADD with timestamp as score, ZREMRANGEBYSCORE to prune old, ZCOUNT for current count.'
      },
      requirements: {
        functional: [
          'Store timestamp of each request',
          'Count requests in sliding time window',
          'No boundary burst problem',
          'Clean up old timestamps automatically'
        ],
        nonFunctional: [
          'Memory efficient for high-volume users'
        ]
      },
      hints: [
        'ZADD key timestamp timestamp (score = member = timestamp)',
        'ZREMRANGEBYSCORE key 0 (now - window_size)',
        'ZCARD key for count'
      ],
      expectedComponents: ['Sliding Window Limiter', 'Redis Sorted Set', 'Cleanup Worker'],
      successCriteria: ['No boundary burst problem', 'Precise rate enforcement'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Sliding Window Counter',
      phase: 3,
      phaseTitle: 'Advanced Algorithms',
      learningObjective: 'Balance precision and efficiency with hybrid approach',
      thinkingFramework: {
        framework: 'Approximation for Efficiency',
        approach: 'Sliding window counter combines two fixed windows with weighted average. Much more memory efficient than log, nearly as accurate.',
        keyInsight: 'Count = (previous_window * overlap%) + current_window. If 40% through current minute, weight previous at 60%.'
      },
      requirements: {
        functional: [
          'Maintain counters for current and previous windows',
          'Calculate weighted count based on position in window',
          'Memory usage independent of request count',
          'Accuracy within 1% of true sliding window'
        ],
        nonFunctional: [
          'O(1) memory per user (vs O(n) for log)'
        ]
      },
      hints: [
        'Store: current_count, previous_count, current_window_start',
        'Weight: previous * (1 - elapsed/window_size) + current',
        'Rotate windows at boundary'
      ],
      expectedComponents: ['Sliding Counter', 'Window Manager', 'Weighted Calculator'],
      successCriteria: ['Memory efficient at scale', 'Accuracy acceptable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Leaky Bucket for Smoothing',
      phase: 3,
      phaseTitle: 'Advanced Algorithms',
      learningObjective: 'Smooth request flow to protect downstream services',
      thinkingFramework: {
        framework: 'Traffic Shaping',
        approach: 'Leaky bucket processes requests at constant rate, queuing excess. Unlike token bucket (allows bursts), this smooths traffic.',
        keyInsight: 'Good for protecting rate-limited downstream APIs (e.g., payment processor with strict rate limits).'
      },
      requirements: {
        functional: [
          'Queue incoming requests up to capacity',
          'Process requests at constant rate',
          'Reject requests when queue full',
          'Drain queue FIFO'
        ],
        nonFunctional: [
          'Predictable request rate to downstream'
        ]
      },
      hints: [
        'Implement as bounded queue with timer-based drain',
        'Return estimated wait time for queued requests',
        'Monitor queue depth for capacity planning'
      ],
      expectedComponents: ['Leaky Bucket', 'Request Queue', 'Drain Worker'],
      successCriteria: ['Downstream sees constant rate', 'Overflow handled gracefully'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Intelligent Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Adaptive Rate Limiting',
      phase: 4,
      phaseTitle: 'Intelligent Platform',
      learningObjective: 'Adjust limits dynamically based on system health',
      thinkingFramework: {
        framework: 'Feedback-Based Control',
        approach: 'Static limits dont adapt to system conditions. When CPU/latency high, reduce limits. When healthy, allow more throughput.',
        keyInsight: 'Use circuit breaker pattern: measure error rate/latency, adjust limits proportionally. Gradual reduction, gradual recovery.'
      },
      requirements: {
        functional: [
          'Monitor system health metrics (latency, error rate, CPU)',
          'Reduce limits when system stressed',
          'Increase limits when system healthy',
          'Gradual changes to avoid oscillation'
        ],
        nonFunctional: [
          'Limit adjustment within 10 seconds of health change',
          'No oscillation in stable conditions'
        ]
      },
      hints: [
        'AIMD (Additive Increase, Multiplicative Decrease)',
        'Measure p99 latency and error rate',
        'Dampen changes to prevent oscillation'
      ],
      expectedComponents: ['Health Monitor', 'Adaptive Controller', 'Limit Adjuster'],
      successCriteria: ['System stays healthy under load', 'Limits adjust appropriately'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Priority-Based Limiting',
      phase: 4,
      phaseTitle: 'Intelligent Platform',
      learningObjective: 'Differentiate users by tier with different limits',
      thinkingFramework: {
        framework: 'Fair Queuing',
        approach: 'Not all users are equal. Premium users get higher limits, free users get lower. During pressure, shed free tier first.',
        keyInsight: 'Priority inversion is a risk: high-priority user calling low-priority API. Consider request priority, not just user priority.'
      },
      requirements: {
        functional: [
          'Configure different limits per user tier',
          'During overload, prioritize premium users',
          'Fair sharing within each tier',
          'Upgrade path from free to premium limits'
        ],
        nonFunctional: [
          'Premium users see no degradation until 90% capacity'
        ]
      },
      hints: [
        'Separate token buckets per tier',
        'Reserve capacity for higher tiers',
        'Weighted fair queuing during overload'
      ],
      expectedComponents: ['Tier Manager', 'Priority Queue', 'Fair Scheduler'],
      successCriteria: ['Premium users protected during overload', 'Fair within tier'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Rate Limiting as a Service',
      phase: 4,
      phaseTitle: 'Intelligent Platform',
      learningObjective: 'Build centralized rate limiting for multiple applications',
      thinkingFramework: {
        framework: 'Platform Service',
        approach: 'Instead of each service implementing rate limiting, provide central service. Consistent policies, unified analytics, single point of configuration.',
        keyInsight: 'Sidecar pattern: rate limiter as proxy in front of each service. Or library pattern: SDK calls central service.'
      },
      requirements: {
        functional: [
          'Central API for rate limit checks',
          'Configuration UI for limit policies',
          'Analytics dashboard (who is being limited)',
          'SDK/library for easy integration'
        ],
        nonFunctional: [
          'Service latency < 2ms at p99',
          '99.99% availability'
        ]
      },
      hints: [
        'gRPC for low-latency check API',
        'Sidecar proxy (Envoy) for transparent limiting',
        'Push configuration to edge for low latency'
      ],
      expectedComponents: ['Rate Limit Service', 'Config Store', 'Analytics Pipeline', 'SDK'],
      successCriteria: ['Services integrate easily', 'Centralized visibility and control'],
      estimatedTime: '8 minutes'
    }
  ]
};
