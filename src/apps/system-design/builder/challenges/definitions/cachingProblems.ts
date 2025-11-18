import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * User Session Store - Fast session lookups with Redis
 * From extracted-problems/system-design/caching.md
 */
export const sessionStoreBasicProblemDefinition: ProblemDefinition = {
  id: 'session-store-basic',
  title: 'User Session Store',
  description: `Build a session management system for a web application that:
- Stores user sessions with 30-minute TTL
- Implements sliding window expiration on activity
- Authenticates users with <10ms session validation
- Handles 10k requests/sec (9k reads, 1k writes)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to handle authentication requests',
      },
      {
        type: 'cache',
        reason: 'Need Redis for fast in-memory session storage with TTL',
      },
      {
        type: 'storage',
        reason: 'Need database as fallback for session recovery',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB to distribute authentication traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users authenticate through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to app servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check sessions in Redis',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers persist sessions to DB as backup',
      },
    ],
    dataModel: {
      entities: ['session', 'user'],
      fields: {
        session: ['id', 'user_id', 'token', 'created_at', 'expires_at', 'last_activity'],
        user: ['id', 'username', 'email'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Session lookups
        { type: 'write', frequency: 'high' },            // Session creation/refresh
      ],
    },
  },

  scenarios: generateScenarios('session-store-basic', problemConfigs['session-store-basic']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Database Query Cache - Cache expensive SQL query results
 * From extracted-problems/system-design/caching.md
 */
export const databaseQueryCacheProblemDefinition: ProblemDefinition = {
  id: 'database-query-cache',
  title: 'Database Query Cache',
  description: `Implement query result caching for an analytics dashboard that:
- Caches results of expensive analytical queries
- Reduces database CPU usage by 50%
- Handles 1k dashboard loads/sec generating 10k queries/sec
- Implements query fingerprinting for cache keys`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to run analytics queries',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache expensive query results',
      },
      {
        type: 'storage',
        reason: 'Need primary database for source data',
      },
      {
        type: 'storage',
        reason: 'Need read replicas to handle cache misses',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for dashboard traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Dashboard users access through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to analytics API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check query cache first',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers query database on cache miss',
      },
    ],
    dataModel: {
      entities: ['query_result', 'metric'],
      fields: {
        query_result: ['cache_key', 'query_hash', 'result_data', 'ttl', 'created_at'],
        metric: ['id', 'name', 'value', 'timestamp'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Cache lookups
        { type: 'read_by_query', frequency: 'medium' },  // Expensive queries
      ],
    },
  },

  scenarios: generateScenarios('database-query-cache', problemConfigs['database-query-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * API Rate Limit Counter - Track API usage with sliding windows
 * From extracted-problems/system-design/caching.md
 */
export const apiRateLimitCacheProblemDefinition: ProblemDefinition = {
  id: 'api-rate-limit-cache',
  title: 'API Rate Limit Counter',
  description: `Build a rate limiting system using Redis that:
- Tracks API calls per user per hour
- Implements sliding window rate limiting
- Enforces 1000 req/hour limits with minimal latency
- Validates 50k API requests/sec`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB to accept API traffic',
      },
      {
        type: 'compute',
        reason: 'Need API gateway to enforce rate limits',
      },
      {
        type: 'cache',
        reason: 'Need Redis for atomic counter operations with TTL',
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
        to: 'cache',
        reason: 'Gateway checks/increments rate limit counters in Redis',
      },
    ],
    dataModel: {
      entities: ['rate_limit_counter'],
      fields: {
        rate_limit_counter: ['user_id', 'time_window', 'count', 'expires_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' }, // Incrementing counters
        { type: 'read_by_key', frequency: 'very_high' }, // Checking limits
      ],
    },
  },

  scenarios: generateScenarios('api-rate-limit-cache', problemConfigs['api-rate-limit-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * E-commerce Product Cache - Cache product details and inventory
 * From extracted-problems/system-design/caching.md
 */
export const productCatalogCacheProblemDefinition: ProblemDefinition = {
  id: 'product-catalog-cache',
  title: 'E-commerce Product Cache',
  description: `Design a caching layer for an e-commerce site that:
- Caches product details, prices, and inventory
- Handles Black Friday traffic (100k requests/sec)
- Warms cache before sales events
- Prevents thundering herd on popular items`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Need CDN for product images',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for product traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for product API',
      },
      {
        type: 'cache',
        reason: 'Need Redis for product cache with 90% hit rate',
      },
      {
        type: 'storage',
        reason: 'Need database for product catalog',
      },
      {
        type: 'message_queue',
        reason: 'Need queue for inventory updates',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users load product pages through CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN pulls from origin',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to product API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers check product cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers query product DB on cache miss',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App servers publish inventory updates to queue',
      },
    ],
    dataModel: {
      entities: ['product', 'inventory'],
      fields: {
        product: ['id', 'name', 'description', 'price', 'image_url', 'category'],
        inventory: ['product_id', 'quantity', 'warehouse_id', 'updated_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Product lookups
        { type: 'write', frequency: 'high' },            // Inventory updates
      ],
    },
  },

  scenarios: generateScenarios('product-catalog-cache', problemConfigs['product-catalog-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(sessionStoreBasicProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(sessionStoreBasicProblemDefinition);
