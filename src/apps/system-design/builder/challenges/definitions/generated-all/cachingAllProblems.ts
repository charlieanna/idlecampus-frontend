import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Caching Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 36 problems
 */

/**
 * TinyURL – URL Shortener
 * From extracted-problems/system-design/caching.md
 */
export const tinyurlProblemDefinition: ProblemDefinition = {
  id: 'tinyurl',
  title: 'TinyURL – URL Shortener',
  description: `Shorten URLs and serve redirects at massive read volume. Use a CDN and app‑level cache to offload reads, a primary DB for writes, and replicas for reads. Keep p95 under 50ms and ensure the create path remains reliable under load.
- Shorten long URLs to 7-character unique codes
- Redirect users from short URL to original URL via HTTP 301/302
- Support custom aliases for premium users (optional)
- Provide analytics: click count, referrer, geographic data`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Redirect API (redirect_client) for cdn + cache for read-heavy redirects',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for cdn + cache for read-heavy redirects',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for cdn + cache for read-heavy redirects',
      },
      {
        type: 'cache',
        reason: 'Need Redis Cache (cache) for cdn + cache for read-heavy redirects',
      },
      {
        type: 'storage',
        reason: 'Need Primary DB (db_primary) for cdn + cache for read-heavy redirects',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Redirect API routes to CDN',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Create API routes to Load Balancer',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN routes to App Servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to App Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App Servers routes to Redis Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App Servers routes to Primary DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'App Servers routes to Read Replicas',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Cache routes to Primary DB',
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

  scenarios: generateScenarios('tinyurl', problemConfigs['tinyurl']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Reddit Comment System
 * From extracted-problems/system-design/caching.md
 */
export const basicWebCacheProblemDefinition: ProblemDefinition = {
  id: 'basic-web-cache',
  title: 'Reddit Comment System',
  description: `Design a Reddit-scale comment system handling 5M reads/sec during normal operation and 50M reads/sec during viral events (like Obama's AMA). Implement multi-layer caching, hot-key protection, and graceful degradation. System must survive cache failures and maintain sub-100ms P99 latency.
- Serve comment threads at 5M QPS (normal) and 50M QPS (viral)
- Support real-time comment updates and vote counting
- Implement hot-key protection for viral threads
- Handle cache stampede during failures`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for l4-level caching for viral content',
      },
      {
        type: 'cdn',
        reason: 'Need CloudFront (cdn) for l4-level caching for viral content',
      },
      {
        type: 'load_balancer',
        reason: 'Need ALB (lb) for l4-level caching for viral content',
      },
      {
        type: 'cache',
        reason: 'Need Redis Cluster (cache) for l4-level caching for viral content',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for l4-level caching for viral content',
      },
      {
        type: 'storage',
        reason: 'Need Aurora Primary (db_primary) for l4-level caching for viral content',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Global Users routes to CloudFront',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CloudFront routes to ALB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'ALB routes to API Fleet',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API Fleet routes to Redis Cluster',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API Fleet routes to Memcached',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API Fleet routes to Kafka',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Cluster routes to Aurora Primary',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Memcached routes to Aurora Replicas',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Kafka routes to Aurora Primary',
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

  scenarios: generateScenarios('basic-web-cache', problemConfigs['basic-web-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Static Content CDN
 * From extracted-problems/system-design/caching.md
 */
export const staticContentCdnProblemDefinition: ProblemDefinition = {
  id: 'static-content-cdn',
  title: 'Static Content CDN',
  description: `Design a CDN for a news website serving static content like images, CSS, and JavaScript files. Learn about edge caching, cache headers, and origin shields. This introduces geographic distribution and browser caching concepts.
- Serve static assets (images, CSS, JS) from edge locations
- Configure browser cache headers (Cache-Control, ETag)
- Implement origin shield to reduce origin load
- Support cache purge for updated content`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for serve images and css from edge locations',
      },
      {
        type: 'cdn',
        reason: 'Need CloudFront CDN (cdn) for serve images and css from edge locations',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Bucket (object_store) for serve images and css from edge locations',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Global Users routes to CloudFront CDN',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CloudFront CDN routes to Origin Server',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Origin Server routes to S3 Bucket',
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

  scenarios: generateScenarios('static-content-cdn', problemConfigs['static-content-cdn']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * User Session Store
 * From extracted-problems/system-design/caching.md
 */
export const sessionStoreBasicProblemDefinition: ProblemDefinition = {
  id: 'session-store-basic',
  title: 'User Session Store',
  description: `Build a session management system for a web application. Store session tokens in Redis with appropriate TTLs and implement sliding window expiration. Learn about session consistency and the importance of fast authentication checks.
- Store user sessions with 30-minute TTL
- Implement sliding window expiration on activity
- Support session invalidation on logout
- Handle concurrent session updates safely`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web Users (redirect_client) for fast session lookups with redis',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for fast session lookups with redis',
      },
      {
        type: 'cache',
        reason: 'Need Redis Sessions (cache) for fast session lookups with redis',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Web Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Auth Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Auth Service routes to Redis Sessions',
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

  scenarios: generateScenarios('session-store-basic', problemConfigs['session-store-basic']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Database Query Cache
 * From extracted-problems/system-design/caching.md
 */
export const databaseQueryCacheProblemDefinition: ProblemDefinition = {
  id: 'database-query-cache',
  title: 'Database Query Cache',
  description: `Implement query result caching for an analytics dashboard showing aggregate metrics. Learn to identify expensive queries, implement query fingerprinting, and handle cache invalidation when underlying data changes.
- Cache results of expensive analytical queries
- Implement query fingerprinting for cache keys
- Invalidate cache when source data updates
- Support partial cache invalidation by table`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Dashboard Users (redirect_client) for cache expensive sql query results',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for cache expensive sql query results',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for cache expensive sql query results',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for cache expensive sql query results',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Dashboard Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Analytics API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Analytics API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Analytics API routes to Analytics DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Analytics API routes to Read Replica',
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

  scenarios: generateScenarios('database-query-cache', problemConfigs['database-query-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * API Rate Limit Counter
 * From extracted-problems/system-design/caching.md
 */
export const apiRateLimitCacheProblemDefinition: ProblemDefinition = {
  id: 'api-rate-limit-cache',
  title: 'API Rate Limit Counter',
  description: `Build a rate limiting system using Redis to track API usage per user. Implement sliding window counters and learn about atomic operations, expiring keys, and the trade-offs between precision and performance.
- Track API calls per user per hour
- Implement sliding window rate limiting
- Return remaining quota in response headers
- Support different limits for different tiers`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Clients (redirect_client) for track api usage with sliding windows',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for track api usage with sliding windows',
      },
      {
        type: 'cache',
        reason: 'Need Redis Counters (cache) for track api usage with sliding windows',
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
        to: 'cache',
        reason: 'API Gateway routes to Redis Counters',
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

  scenarios: generateScenarios('api-rate-limit-cache', problemConfigs['api-rate-limit-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * E-commerce Product Cache
 * From extracted-problems/system-design/caching.md
 */
export const productCatalogCacheProblemDefinition: ProblemDefinition = {
  id: 'product-catalog-cache',
  title: 'E-commerce Product Cache',
  description: `Design a caching layer for an e-commerce site handling Black Friday traffic. Cache product details, prices, and inventory while ensuring consistency during rapid inventory changes. Learn about cache warming and thundering herd prevention.
- Cache product details, prices, and images
- Update inventory counts in near real-time
- Warm cache before sales events
- Prevent thundering herd on popular items`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Shoppers (redirect_client) for cache product details and inventory',
      },
      {
        type: 'cdn',
        reason: 'Need Image CDN (cdn) for cache product details and inventory',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for cache product details and inventory',
      },
      {
        type: 'cache',
        reason: 'Need Product Cache (cache) for cache product details and inventory',
      },
      {
        type: 'storage',
        reason: 'Need Product DB (db_primary) for cache product details and inventory',
      },
      {
        type: 'message_queue',
        reason: 'Need Warm Queue (queue) for cache product details and inventory',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Shoppers routes to Image CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Image CDN routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Web Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Web Servers routes to Product Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Web Servers routes to Product DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Web Servers routes to Warm Queue',
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

  scenarios: generateScenarios('product-catalog-cache', problemConfigs['product-catalog-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Gaming Leaderboard Cache
 * From extracted-problems/system-design/caching.md
 */
export const gamingLeaderboardCacheProblemDefinition: ProblemDefinition = {
  id: 'gaming-leaderboard-cache',
  title: 'Gaming Leaderboard Cache',
  description: `Build a real-time leaderboard system for a mobile game. Use Redis sorted sets for efficient ranking operations and learn about atomic score updates, range queries, and the trade-offs between accuracy and performance.
- Track player scores in real-time
- Display top 100 global rankings
- Show player rank and nearby players
- Support multiple leaderboards (daily/weekly/all-time)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Clients (redirect_client) for real-time rankings with redis sorted sets',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for real-time rankings with redis sorted sets',
      },
      {
        type: 'cache',
        reason: 'Need Redis Leaderboard (cache) for real-time rankings with redis sorted sets',
      },
      {
        type: 'storage',
        reason: 'Need Score DB (db_primary) for real-time rankings with redis sorted sets',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Game Clients routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Game API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Game API routes to Redis Leaderboard',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Game API routes to Score DB',
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

  scenarios: generateScenarios('gaming-leaderboard-cache', problemConfigs['gaming-leaderboard-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Location-Based Search Cache
 * From extracted-problems/system-design/caching.md
 */
export const geoLocationCacheProblemDefinition: ProblemDefinition = {
  id: 'geo-location-cache',
  title: 'Location-Based Search Cache',
  description: `Implement location-based caching for a maps application. Learn about geohashing, spatial indexing, and how to cache results for common search areas. Understand the trade-offs between cache granularity and hit rates.
- Cache search results by geographic area
- Implement geohash-based cache keys
- Support different radius searches (1km, 5km, 10km)
- Invalidate cache when businesses update`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile Apps (redirect_client) for cache nearby places with geohashing',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for cache nearby places with geohashing',
      },
      {
        type: 'cache',
        reason: 'Need Geo Cache (cache) for cache nearby places with geohashing',
      },
      {
        type: 'storage',
        reason: 'Need ElasticSearch (search) for cache nearby places with geohashing',
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
        reason: 'Load Balancer routes to Location API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Location API routes to Geo Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Location API routes to ElasticSearch',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'ElasticSearch routes to Business DB',
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

  scenarios: generateScenarios('geo-location-cache', problemConfigs['geo-location-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Application Config Cache
 * From extracted-problems/system-design/caching.md
 */
export const configCacheBasicProblemDefinition: ProblemDefinition = {
  id: 'config-cache-basic',
  title: 'Application Config Cache',
  description: `Build a configuration distribution system with local caching at each service. Learn about pull vs push models, cache consistency across nodes, and how to handle config updates without service restarts.
- Cache application configs locally on each server
- Support hot reload without restarts
- Implement version tracking for rollbacks
- Notify services of config changes`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for distribute configs with local caching',
      },
      {
        type: 'cache',
        reason: 'Need Shared Cache (cache) for distribute configs with local caching',
      },
      {
        type: 'storage',
        reason: 'Need Config DB (db_primary) for distribute configs with local caching',
      },
      {
        type: 'message_queue',
        reason: 'Need Change Stream (stream) for distribute configs with local caching',
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
        reason: 'Services routes to Config Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Config Service routes to Shared Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Config Service routes to Config DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Config Service routes to Change Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Services routes to Change Stream',
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

  scenarios: generateScenarios('config-cache-basic', problemConfigs['config-cache-basic']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Twitter-like Timeline Cache
 * From extracted-problems/system-design/caching.md
 */
export const socialFeedCacheProblemDefinition: ProblemDefinition = {
  id: 'social-feed-cache',
  title: 'Twitter-like Timeline Cache',
  description: `Design a caching system for social media timelines combining push model for celebrities and pull model for regular users. Learn about fanout strategies, cache memory optimization, and handling hot users with millions of followers.
- Cache home timelines for active users
- Handle celebrity posts with millions of followers
- Support real-time updates for online users
- Implement hybrid push/pull based on follower count`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for hybrid push/pull for personalized feeds',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for hybrid push/pull for personalized feeds',
      },
      {
        type: 'cache',
        reason: 'Need Timeline Cache (cache) for hybrid push/pull for personalized feeds',
      },
      {
        type: 'storage',
        reason: 'Need Post DB (db_primary) for hybrid push/pull for personalized feeds',
      },
      {
        type: 'message_queue',
        reason: 'Need Fanout Queue (queue) for hybrid push/pull for personalized feeds',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Timeline Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Timeline Service routes to Timeline Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Timeline Service routes to Post Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Timeline Service routes to Post DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Timeline Service routes to Read Replicas',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Timeline Service routes to Fanout Queue',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Timeline Service routes to Live Updates',
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

  scenarios: generateScenarios('social-feed-cache', problemConfigs['social-feed-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Netflix-like Video CDN
 * From extracted-problems/system-design/caching.md
 */
export const videoStreamingCacheProblemDefinition: ProblemDefinition = {
  id: 'video-streaming-cache',
  title: 'Netflix-like Video CDN',
  description: `Design a YouTube/Netflix-scale video CDN delivering 500M concurrent 4K/8K streams globally across 10k+ edge POPs. Must start playback in <200ms, handle viral videos (10B views in 1 hour), survive entire CDN region failures, and operate within $1B/month budget. Support live streaming for World Cup (2B viewers), ML-based predictive caching, and serve 1 exabit/day while optimizing for ISP peering agreements.
- Stream 500M concurrent 4K/8K videos globally
- Support 100M concurrent live viewers (World Cup scale)
- ML-based predictive prefetch with 90% accuracy
- Cache at 10k+ edge POPs worldwide`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Viewers (redirect_client) for youtube-scale 500m concurrent 4k/8k streams',
      },
      {
        type: 'cdn',
        reason: 'Need Edge CDN (cdn) for youtube-scale 500m concurrent 4k/8k streams',
      },
      {
        type: 'load_balancer',
        reason: 'Need Origin LB (lb) for youtube-scale 500m concurrent 4k/8k streams',
      },
      {
        type: 'cache',
        reason: 'Need Origin Cache (cache) for youtube-scale 500m concurrent 4k/8k streams',
      },
      {
        type: 'object_storage',
        reason: 'Need Video Store (object_store) for youtube-scale 500m concurrent 4k/8k streams',
      },
      {
        type: 'message_queue',
        reason: 'Need Prefetch Queue (queue) for youtube-scale 500m concurrent 4k/8k streams',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Viewers routes to Edge CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Edge CDN routes to Origin LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Origin LB routes to Streaming API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Streaming API routes to Origin Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Streaming API routes to Video Store',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Streaming API routes to Prefetch Queue',
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

  scenarios: generateScenarios('video-streaming-cache', problemConfigs['video-streaming-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Google-like Search Suggestions
 * From extracted-problems/system-design/caching.md
 */
export const searchSuggestionCacheProblemDefinition: ProblemDefinition = {
  id: 'search-suggestion-cache',
  title: 'Google-like Search Suggestions',
  description: `Design a Google Search-scale autocomplete system handling 10M keystrokes/sec from 2B+ daily users globally. Must return suggestions in <20ms using distributed tries, handle 100+ languages, survive datacenter failures, and operate within $200M/month budget. Support real-time trending integration (within 1 minute), personalized suggestions for 5B+ users, and maintain 99.999% availability while serving suggestions from 100T+ query corpus.
- Process 10M keystrokes/sec globally
- Return suggestions in <20ms P99 latency
- Support 100+ languages and scripts
- Personalize for 5B+ user profiles`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Search Box (redirect_client) for google-scale 10m keystrokes/sec autocomplete',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for google-scale 10m keystrokes/sec autocomplete',
      },
      {
        type: 'cache',
        reason: 'Need Trie Cache (cache) for google-scale 10m keystrokes/sec autocomplete',
      },
      {
        type: 'message_queue',
        reason: 'Need Trending Stream (stream) for google-scale 10m keystrokes/sec autocomplete',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Search Box routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Suggestion API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Suggestion API routes to Trie Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Suggestion API routes to Personal Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Suggestion API routes to Query Index',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Suggestion API routes to Trending Stream',
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

  scenarios: generateScenarios('search-suggestion-cache', problemConfigs['search-suggestion-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * News Aggregator with Trending
 * From extracted-problems/system-design/caching.md
 */
export const newsAggregatorCacheProblemDefinition: ProblemDefinition = {
  id: 'news-aggregator-cache',
  title: 'News Aggregator with Trending',
  description: `Build a news aggregation system that combines multiple sources, detects trending topics, and caches articles with time-based decay. Learn about cache warming, content deduplication, and real-time trend detection.
- Aggregate news from 100+ sources
- Detect and cache trending topics
- Implement time-decay for article relevance
- Deduplicate similar stories across sources`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Readers (redirect_client) for time-based cache with popularity decay',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for time-based cache with popularity decay',
      },
      {
        type: 'cache',
        reason: 'Need Article Cache (cache) for time-based cache with popularity decay',
      },
      {
        type: 'storage',
        reason: 'Need Article DB (db_primary) for time-based cache with popularity decay',
      },
      {
        type: 'message_queue',
        reason: 'Need Click Stream (stream) for time-based cache with popularity decay',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Readers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to News API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'News API routes to Article Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'News API routes to Trending Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'News API routes to Article DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'News API routes to Click Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Ingestion Queue routes to News API',
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

  scenarios: generateScenarios('news-aggregator-cache', problemConfigs['news-aggregator-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GraphQL Query Cache
 * From extracted-problems/system-design/caching.md
 */
export const graphqlCacheProblemDefinition: ProblemDefinition = {
  id: 'graphql-cache',
  title: 'GraphQL Query Cache',
  description: `Implement intelligent caching for GraphQL APIs that handles partial query results, field-level invalidation, and nested data dependencies. Learn about normalized caches and cache coherency in graph structures.
- Cache GraphQL query results by operation
- Support field-level cache invalidation
- Handle nested object dependencies
- Implement cache normalization by ID`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need GraphQL Clients (redirect_client) for field-level cache with partial invalidation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for field-level cache with partial invalidation',
      },
      {
        type: 'cache',
        reason: 'Need Normalized Cache (cache) for field-level cache with partial invalidation',
      },
      {
        type: 'storage',
        reason: 'Need Source DB (db_primary) for field-level cache with partial invalidation',
      },
      {
        type: 'message_queue',
        reason: 'Need Mutation Stream (stream) for field-level cache with partial invalidation',
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
        reason: 'Load Balancer routes to GraphQL Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'GraphQL Gateway routes to Normalized Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'GraphQL Gateway routes to Source DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'GraphQL Gateway routes to Mutation Stream',
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

  scenarios: generateScenarios('graphql-cache', problemConfigs['graphql-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * E-commerce Shopping Cart Cache
 * From extracted-problems/system-design/caching.md
 */
export const shoppingCartCacheProblemDefinition: ProblemDefinition = {
  id: 'shopping-cart-cache',
  title: 'E-commerce Shopping Cart Cache',
  description: `Design a shopping cart system that balances performance with data durability. Cache active carts in Redis while persisting to database for recovery. Learn about session affinity, cart abandonment handling, and inventory reservation timeouts.
- Cache active shopping carts in Redis
- Persist cart changes to database asynchronously
- Handle cart merging when users log in
- Implement 30-minute cart expiration with reminders`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Shoppers (redirect_client) for session-based cart with persistence',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for session-based cart with persistence',
      },
      {
        type: 'cache',
        reason: 'Need Redis Carts (cache) for session-based cart with persistence',
      },
      {
        type: 'storage',
        reason: 'Need Cart DB (db_primary) for session-based cart with persistence',
      },
      {
        type: 'message_queue',
        reason: 'Need Sync Queue (queue) for session-based cart with persistence',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Shoppers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Cart Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Cart Service routes to Redis Carts',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Cart Service routes to Cart DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Cart Service routes to Sync Queue',
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

  scenarios: generateScenarios('shopping-cart-cache', problemConfigs['shopping-cart-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time Analytics Dashboard Cache
 * From extracted-problems/system-design/caching.md
 */
export const analyticsDashboardCacheProblemDefinition: ProblemDefinition = {
  id: 'analytics-dashboard-cache',
  title: 'Real-time Analytics Dashboard Cache',
  description: `Build a multi-tier caching system for business analytics dashboards. Combine pre-computed aggregates, query result caching, and real-time updates. Learn about cache layering, partial result caching, and balancing freshness with performance.
- Cache pre-computed hourly/daily aggregations
- Layer cache: browser → Redis → materialized views
- Support drill-down queries with partial cache hits
- Real-time metrics bypass cache with 1-min aggregation`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Business Users (redirect_client) for tiered caching for dashboard queries',
      },
      {
        type: 'cache',
        reason: 'Need Browser Cache (cdn) for tiered caching for dashboard queries',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for tiered caching for dashboard queries',
      },
      {
        type: 'storage',
        reason: 'Need OLAP DB (db_primary) for tiered caching for dashboard queries',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cache',
        reason: 'Business Users routes to Browser Cache',
      },
      {
        from: 'cache',
        to: 'load_balancer',
        reason: 'Browser Cache routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Dashboard API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Dashboard API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Dashboard API routes to OLAP DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Dashboard API routes to Read Replicas',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Pre-Aggregation routes to OLAP DB',
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

  scenarios: generateScenarios('analytics-dashboard-cache', problemConfigs['analytics-dashboard-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multi-tenant SaaS Cache Isolation
 * From extracted-problems/system-design/caching.md
 */
export const multiTenantSaasCacheProblemDefinition: ProblemDefinition = {
  id: 'multi-tenant-saas-cache',
  title: 'Multi-tenant SaaS Cache Isolation',
  description: `Design a Salesforce/AWS-scale multi-tenant caching system serving 100M+ tenants with 10M requests/sec while preventing noisy neighbors. Must maintain <5ms P99 latency, handle enterprise tenants with 1B+ objects, survive region failures, and operate within $500M/month budget. Support GDPR isolation, tenant-specific encryption, hierarchical quotas, and maintain 99.999% availability while serving Fortune 500 enterprises.
- Isolate cache for 100M+ tenants globally
- Process 10M cache operations/sec
- Prevent noisy neighbor impact (<1% degradation)
- Hierarchical quotas (org/workspace/user)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need All Tenants (redirect_client) for salesforce-scale 100m tenants/10m qps isolation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for salesforce-scale 100m tenants/10m qps isolation',
      },
      {
        type: 'cache',
        reason: 'Need Enterprise Cache (cache) for salesforce-scale 100m tenants/10m qps isolation',
      },
      {
        type: 'storage',
        reason: 'Need Tenant DBs (db_primary) for salesforce-scale 100m tenants/10m qps isolation',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'All Tenants routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to SaaS Platform',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'SaaS Platform routes to Enterprise Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'SaaS Platform routes to Pro Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'SaaS Platform routes to Free Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'SaaS Platform routes to Tenant DBs',
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

  scenarios: generateScenarios('multi-tenant-saas-cache', problemConfigs['multi-tenant-saas-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Content Management System Cache
 * From extracted-problems/system-design/caching.md
 */
export const cmsCacheProblemDefinition: ProblemDefinition = {
  id: 'cms-cache',
  title: 'Content Management System Cache',
  description: `Design a caching system for a headless CMS serving content to millions of websites. Implement edge caching, API response caching, and dependency-based invalidation. Learn about cache tags, surrogate keys, and handling complex invalidation graphs.
- Cache published content at CDN edge
- Implement tag-based cache invalidation
- Handle content dependencies (articles reference authors)
- Support versioned content with preview mode`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Websites (redirect_client) for multi-layer cache with smart invalidation',
      },
      {
        type: 'cdn',
        reason: 'Need Global CDN (cdn) for multi-layer cache with smart invalidation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for multi-layer cache with smart invalidation',
      },
      {
        type: 'cache',
        reason: 'Need API Cache (cache) for multi-layer cache with smart invalidation',
      },
      {
        type: 'storage',
        reason: 'Need Content DB (db_primary) for multi-layer cache with smart invalidation',
      },
      {
        type: 'message_queue',
        reason: 'Need Purge Queue (queue) for multi-layer cache with smart invalidation',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Websites routes to Global CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Global CDN routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to CMS API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'CMS API routes to API Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'CMS API routes to Content DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'CMS API routes to Purge Queue',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'CMS API routes to Invalidation Stream',
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

  scenarios: generateScenarios('cms-cache', problemConfigs['cms-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Authentication Token Cache
 * From extracted-problems/system-design/caching.md
 */
export const authTokenCacheProblemDefinition: ProblemDefinition = {
  id: 'auth-token-cache',
  title: 'Authentication Token Cache',
  description: `Build a high-performance authentication system using stateless JWT tokens with distributed revocation support. Learn about token caching, blacklist patterns, refresh token rotation, and balancing stateless design with security requirements.
- Cache decoded JWT claims for fast validation
- Implement token revocation blacklist
- Support refresh token rotation
- Handle token expiration and renewal`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Microservices (redirect_client) for distributed token validation with revocation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for distributed token validation with revocation',
      },
      {
        type: 'cache',
        reason: 'Need Token Cache (cache) for distributed token validation with revocation',
      },
      {
        type: 'storage',
        reason: 'Need Auth DB (db_primary) for distributed token validation with revocation',
      },
      {
        type: 'message_queue',
        reason: 'Need Revocation Stream (stream) for distributed token validation with revocation',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Microservices routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Auth Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Auth Service routes to Token Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Auth Service routes to Blacklist',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Auth Service routes to Auth DB',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Auth Service routes to Revocation Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Revocation Stream routes to Blacklist',
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

  scenarios: generateScenarios('auth-token-cache', problemConfigs['auth-token-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Pricing Engine Cache
 * From extracted-problems/system-design/caching.md
 */
export const pricingEngineCacheProblemDefinition: ProblemDefinition = {
  id: 'pricing-engine-cache',
  title: 'Pricing Engine Cache',
  description: `Design an Amazon-scale pricing engine processing 100M pricing calculations/sec for 1B+ SKUs during Prime Day. Must calculate personalized prices in <5ms using ML models, handle surge pricing, survive cache failures, and operate within $300M/month budget. Support 100k+ concurrent promotions, real-time inventory pricing, currency conversion for 200+ countries, and maintain pricing consistency while A/B testing across millions of cohorts.
- Calculate 100M personalized prices/sec
- Support 1B+ SKUs with dynamic pricing
- ML-based price optimization in real-time
- Handle Prime Day surge (10x normal load)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Customers (redirect_client) for amazon-scale 100m pricing calcs/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for amazon-scale 100m pricing calcs/sec',
      },
      {
        type: 'cache',
        reason: 'Need Price Cache (cache) for amazon-scale 100m pricing calcs/sec',
      },
      {
        type: 'storage',
        reason: 'Need Pricing DB (db_primary) for amazon-scale 100m pricing calcs/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Customers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Pricing API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Pricing API routes to Price Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Pricing API routes to Rule Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Pricing API routes to Pricing DB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Pre-compute routes to Pricing DB',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Pre-compute routes to Price Cache',
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

  scenarios: generateScenarios('pricing-engine-cache', problemConfigs['pricing-engine-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Recommendation Engine Cache
 * From extracted-problems/system-design/caching.md
 */
export const recommendationEngineCacheProblemDefinition: ProblemDefinition = {
  id: 'recommendation-engine-cache',
  title: 'Recommendation Engine Cache',
  description: `Design a caching layer for ML-powered product recommendations. Balance personalization with cache efficiency by caching model outputs, feature vectors, and popular recommendations. Learn about cold start handling, cache warming from batch jobs, and incremental model updates.
- Cache top-N recommendations per user segment
- Store user feature vectors for real-time scoring
- Handle cold start with trending item fallback
- Update recommendations hourly from ML pipeline`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for personalized recommendations with batch updates',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for personalized recommendations with batch updates',
      },
      {
        type: 'cache',
        reason: 'Need Rec Cache (cache) for personalized recommendations with batch updates',
      },
      {
        type: 'storage',
        reason: 'Need User DB (db_primary) for personalized recommendations with batch updates',
      },
      {
        type: 'object_storage',
        reason: 'Need Model Store (object_store) for personalized recommendations with batch updates',
      },
      {
        type: 'message_queue',
        reason: 'Need Warm Queue (queue) for personalized recommendations with batch updates',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Rec Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Rec Service routes to Rec Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Rec Service routes to User DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Batch Recs routes to Model Store',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Batch Recs routes to Rec Cache',
      },
      {
        from: 'message_queue',
        to: 'cache',
        reason: 'Warm Queue routes to Rec Cache',
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

  scenarios: generateScenarios('recommendation-engine-cache', problemConfigs['recommendation-engine-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time Bidding Ad Cache
 * From extracted-problems/system-design/caching.md
 */
export const rtbAdCacheProblemDefinition: ProblemDefinition = {
  id: 'rtb-ad-cache',
  title: 'Real-time Bidding Ad Cache',
  description: `Build an ad caching system for real-time bidding that must respond in <10ms. Cache ad creatives, targeting rules, and real-time budget utilization. Learn about probabilistic data structures, approximate counting, and balancing accuracy with extreme low latency.
- Cache ad creatives and targeting rules
- Track campaign budgets in real-time (approximate)
- Select top bid ad within latency budget
- Support frequency capping per user`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Ad Requests (redirect_client) for sub-10ms ad selection with budget tracking',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for sub-10ms ad selection with budget tracking',
      },
      {
        type: 'cache',
        reason: 'Need Creative Cache (cache) for sub-10ms ad selection with budget tracking',
      },
      {
        type: 'storage',
        reason: 'Need Campaign DB (db_primary) for sub-10ms ad selection with budget tracking',
      },
      {
        type: 'message_queue',
        reason: 'Need Impression Stream (stream) for sub-10ms ad selection with budget tracking',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Ad Requests routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Bidder',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Bidder routes to Creative Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Bidder routes to Budget Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Bidder routes to Impression Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Impression Stream routes to Budget Aggregator',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Budget Aggregator routes to Budget Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Budget Aggregator routes to Campaign DB',
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

  scenarios: generateScenarios('rtb-ad-cache', problemConfigs['rtb-ad-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Gaming Matchmaking Cache
 * From extracted-problems/system-design/caching.md
 */
export const gamingMatchmakingCacheProblemDefinition: ProblemDefinition = {
  id: 'gaming-matchmaking-cache',
  title: 'Gaming Matchmaking Cache',
  description: `Design a matchmaking system for competitive gaming that maintains pools of available players and quickly forms balanced matches. Learn about ephemeral cache entries, range queries, and the trade-offs between match quality and wait time.
- Maintain pool of available players by skill tier
- Match players within 200 rating points in <3s
- Support party matchmaking (groups of friends)
- Handle players leaving queue gracefully`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Players (redirect_client) for real-time player pool with skill-based matching',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for real-time player pool with skill-based matching',
      },
      {
        type: 'cache',
        reason: 'Need Queue Cache (cache) for real-time player pool with skill-based matching',
      },
      {
        type: 'storage',
        reason: 'Need Match History (db_primary) for real-time player pool with skill-based matching',
      },
      {
        type: 'message_queue',
        reason: 'Need Match Events (stream) for real-time player pool with skill-based matching',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Players routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Matchmaker',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Matchmaker routes to Queue Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Matchmaker routes to Match History',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Queue Cache routes to Match Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Match Workers routes to Match Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Match Events routes to Match History',
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

  scenarios: generateScenarios('gaming-matchmaking-cache', problemConfigs['gaming-matchmaking-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * IoT Device State Cache
 * From extracted-problems/system-design/caching.md
 */
export const iotDeviceCacheProblemDefinition: ProblemDefinition = {
  id: 'iot-device-cache',
  title: 'IoT Device State Cache',
  description: `Design a device shadow cache for IoT systems where devices have unreliable connectivity. Maintain cached state that devices sync when online. Learn about last-write-wins, vector clocks, conflict resolution, and handling millions of devices with varying update frequencies.
- Cache device shadow state (reported and desired)
- Handle offline devices with state deltas on reconnect
- Support bulk queries (all devices in building)
- Implement conflict resolution for concurrent updates`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Devices + Apps (redirect_client) for shadow state with eventual consistency',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for shadow state with eventual consistency',
      },
      {
        type: 'cache',
        reason: 'Need Shadow Cache (cache) for shadow state with eventual consistency',
      },
      {
        type: 'storage',
        reason: 'Need Shadow DB (db_primary) for shadow state with eventual consistency',
      },
      {
        type: 'message_queue',
        reason: 'Need State Events (stream) for shadow state with eventual consistency',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Devices + Apps routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Shadow Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Shadow Service routes to Shadow Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Shadow Service routes to Shadow DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shadow Service routes to State Events',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'State Events routes to Aggregation',
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

  scenarios: generateScenarios('iot-device-cache', problemConfigs['iot-device-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Amazon Global Inventory Cache
 * From extracted-problems/system-design/caching.md
 */
export const globalInventoryCacheProblemDefinition: ProblemDefinition = {
  id: 'global-inventory-cache',
  title: 'Amazon Global Inventory Cache',
  description: `Design a globally distributed inventory caching system that prevents overselling while maintaining low latency. Handle multi-region consistency, implement reservation patterns, and learn about conflict-free replicated data types (CRDTs).
- Cache inventory across multiple regions
- Prevent overselling with distributed locks
- Support inventory reservations with timeout
- Implement eventual consistency for browsing`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Shoppers (redirect_client) for multi-region cache with consistency guarantees',
      },
      {
        type: 'cdn',
        reason: 'Need GeoDNS (cdn) for multi-region cache with consistency guarantees',
      },
      {
        type: 'load_balancer',
        reason: 'Need Regional LB (lb) for multi-region cache with consistency guarantees',
      },
      {
        type: 'cache',
        reason: 'Need L1 Local Cache (cache) for multi-region cache with consistency guarantees',
      },
      {
        type: 'storage',
        reason: 'Need Inventory DB (db_primary) for multi-region cache with consistency guarantees',
      },
      {
        type: 'message_queue',
        reason: 'Need Update Stream (stream) for multi-region cache with consistency guarantees',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Global Shoppers routes to GeoDNS',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'GeoDNS routes to Regional LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Regional LB routes to Inventory API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory API routes to L1 Local Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory API routes to L2 Regional Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory API routes to L3 Global Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Inventory API routes to Inventory DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Inventory API routes to Read Replicas',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Inventory API routes to Update Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Inventory API routes to Reservation Queue',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Update Stream routes to Consistency Worker',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Consistency Worker routes to L2 Regional Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Consistency Worker routes to L3 Global Cache',
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

  scenarios: generateScenarios('global-inventory-cache', problemConfigs['global-inventory-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Netflix Hybrid CDN Architecture
 * From extracted-problems/system-design/caching.md
 */
export const hybridCdnCacheProblemDefinition: ProblemDefinition = {
  id: 'hybrid-cdn-cache',
  title: 'Netflix Hybrid CDN Architecture',
  description: `Design Netflix Open Connect CDN with ISP cache boxes, predictive content placement, and peer-assisted delivery. Optimize for bandwidth costs while maintaining streaming quality across heterogeneous networks.
- Deploy cache boxes at ISP locations
- Predictive content placement using ML
- Peer-to-peer assisted delivery
- Adaptive bitrate based on cache availability`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Viewers (redirect_client) for isp cache boxes with predictive placement',
      },
      {
        type: 'cache',
        reason: 'Need ISP Cache (cdn) for isp cache boxes with predictive placement',
      },
      {
        type: 'load_balancer',
        reason: 'Need Edge LB (lb) for isp cache boxes with predictive placement',
      },
      {
        type: 'object_storage',
        reason: 'Need Origin Storage (object_store) for isp cache boxes with predictive placement',
      },
      {
        type: 'message_queue',
        reason: 'Need Placement Queue (queue) for isp cache boxes with predictive placement',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cache',
        reason: 'Viewers routes to ISP Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Viewers routes to Peer Cache',
      },
      {
        from: 'cache',
        to: 'load_balancer',
        reason: 'ISP Cache routes to Edge LB',
      },
      {
        from: 'cache',
        to: 'load_balancer',
        reason: 'Peer Cache routes to Edge LB',
      },
      {
        from: 'load_balancer',
        to: 'message_queue',
        reason: 'Edge LB routes to Stream Control',
      },
      {
        from: 'message_queue',
        to: 'cache',
        reason: 'Stream Control routes to Mid-Tier Cache',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Stream Control routes to Origin Storage',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Stream Control routes to P2P Coordination',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Placement Queue routes to ML Placement',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'ML Placement routes to ISP Cache',
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

  scenarios: generateScenarios('hybrid-cdn-cache', problemConfigs['hybrid-cdn-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Global E-commerce Inventory Cache
 * From extracted-problems/system-design/caching.md
 */
export const globalInventoryMasteryProblemDefinition: ProblemDefinition = {
  id: 'global-inventory-mastery',
  title: 'Global E-commerce Inventory Cache',
  description: `Design a globally distributed inventory system with strong consistency guarantees to prevent overselling during flash sales. Implement optimistic locking, conflict-free replicated data types (CRDTs), and multi-region cache coordination with minimal latency impact.
- Maintain inventory counts across 5 geographic regions
- Prevent overselling with pessimistic or optimistic locking
- Reserve inventory during checkout with timeout
- Handle network partitions gracefully (AP with repair)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for multi-region consistency with optimistic locking',
      },
      {
        type: 'load_balancer',
        reason: 'Need US LB (lb) for multi-region consistency with optimistic locking',
      },
      {
        type: 'cache',
        reason: 'Need US Cache (cache) for multi-region consistency with optimistic locking',
      },
      {
        type: 'storage',
        reason: 'Need Global Inventory DB (db_primary) for multi-region consistency with optimistic locking',
      },
      {
        type: 'message_queue',
        reason: 'Need Inventory Sync Stream (stream) for multi-region consistency with optimistic locking',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Users routes to US LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Users routes to EU LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Users routes to APAC LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'US LB routes to US Servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'EU LB routes to EU Servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'APAC LB routes to APAC Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US Servers routes to US Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU Servers routes to EU Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'APAC Servers routes to APAC Cache',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'US Cache routes to Global Inventory DB',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'EU Cache routes to Global Inventory DB',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'APAC Cache routes to Global Inventory DB',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Global Inventory DB routes to Inventory Sync Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Inventory Sync Stream routes to Conflict Resolver',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Conflict Resolver routes to US Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Conflict Resolver routes to EU Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Conflict Resolver routes to APAC Cache',
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

  scenarios: generateScenarios('global-inventory-mastery', problemConfigs['global-inventory-mastery']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Financial Trading Platform Cache
 * From extracted-problems/system-design/caching.md
 */
export const financialTradingCacheProblemDefinition: ProblemDefinition = {
  id: 'financial-trading-cache',
  title: 'Financial Trading Platform Cache',
  description: `Design an ultra-low latency caching system for a high-frequency trading platform. Cache market data, order books, and positions with microsecond access times. Learn about lock-free data structures, CPU cache optimization, and the limits of distributed caching for latency-critical systems.
- Cache order book snapshots with <100μs updates
- Maintain position and risk limits in local memory
- Replicate critical data to hot standby with RDMA
- Support historical tick data queries (last 1 hour)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Trading Systems (redirect_client) for microsecond latency with fifo ordering guarantees',
      },
      {
        type: 'cache',
        reason: 'Need Order Book (NVRAM) (cache) for microsecond latency with fifo ordering guarantees',
      },
      {
        type: 'message_queue',
        reason: 'Need Trade Log (RDMA) (stream) for microsecond latency with fifo ordering guarantees',
      },
      {
        type: 'storage',
        reason: 'Need Audit DB (db_primary) for microsecond latency with fifo ordering guarantees',
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
        reason: 'Trading Systems routes to Primary Matching Engine',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Matching Engine routes to Order Book (NVRAM)',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Order Book (NVRAM) routes to Standby Book (NVRAM)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Matching Engine routes to Trade Log (RDMA)',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'Standby Matching Engine routes to Standby Book (NVRAM)',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Trade Log (RDMA) routes to Audit DB',
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

  scenarios: generateScenarios('financial-trading-cache', problemConfigs['financial-trading-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Video Game Asset Distribution Cache
 * From extracted-problems/system-design/caching.md
 */
export const gameAssetCdnMasteryProblemDefinition: ProblemDefinition = {
  id: 'game-asset-cdn-mastery',
  title: 'Video Game Asset Distribution Cache',
  description: `Design a hybrid CDN and peer-to-peer caching system for distributing large game assets. Combine traditional CDN with peer caching to reduce costs and improve download speeds. Learn about chunk-based caching, integrity verification, and incentivizing peer participation.
- Distribute game assets via CDN + P2P hybrid
- Chunk files into verifiable blocks (4MB each)
- Peer discovery and selection based on bandwidth
- Fallback to CDN if P2P peers unavailable`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Gamers (redirect_client) for p2p + cdn hybrid with predictive prefetch',
      },
      {
        type: 'cdn',
        reason: 'Need Global CDN (cdn) for p2p + cdn hybrid with predictive prefetch',
      },
      {
        type: 'cache',
        reason: 'Need US Cache (cache) for p2p + cdn hybrid with predictive prefetch',
      },
      {
        type: 'object_storage',
        reason: 'Need Asset Storage (object_store) for p2p + cdn hybrid with predictive prefetch',
      },
      {
        type: 'message_queue',
        reason: 'Need Peer Discovery (stream) for p2p + cdn hybrid with predictive prefetch',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Gamers routes to Global CDN',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Gamers routes to Tracker',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'Global CDN routes to Download Coordinator',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Download Coordinator routes to US Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Download Coordinator routes to EU Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Download Coordinator routes to APAC Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'US Cache routes to Asset Storage',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'EU Cache routes to Asset Storage',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'APAC Cache routes to Asset Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tracker routes to Peer Discovery',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Peer Discovery routes to Chunk Optimizer',
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

  scenarios: generateScenarios('game-asset-cdn-mastery', problemConfigs['game-asset-cdn-mastery']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time Sports Betting Cache
 * From extracted-problems/system-design/caching.md
 */
export const sportsBettingCacheProblemDefinition: ProblemDefinition = {
  id: 'sports-betting-cache',
  title: 'Real-time Sports Betting Cache',
  description: `Design a caching system for live sports betting where odds change in real-time based on game events. Cache must balance extreme low latency with preventing arbitrage opportunities from stale data. Learn about time-windowed caching, probabilistic cache invalidation, and graceful degradation.
- Cache current odds with <100ms staleness guarantee
- Update odds on game events (goals, fouls, etc.)
- Prevent arbitrage from regional odds discrepancies
- Handle bet placement spikes during key moments`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Bettors (redirect_client) for sub-millisecond odds updates with staleness tolerance',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for sub-millisecond odds updates with staleness tolerance',
      },
      {
        type: 'cache',
        reason: 'Need Odds Cache (Local) (cache) for sub-millisecond odds updates with staleness tolerance',
      },
      {
        type: 'message_queue',
        reason: 'Need Odds Update Stream (stream) for sub-millisecond odds updates with staleness tolerance',
      },
      {
        type: 'storage',
        reason: 'Need Odds DB (db_primary) for sub-millisecond odds updates with staleness tolerance',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Bettors routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Betting Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Betting Servers routes to Odds Cache (Local)',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Betting Servers routes to Shared Redis',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Betting Servers routes to Odds DB',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Odds Update Stream routes to Betting Servers',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Odds Update Stream routes to Arbitrage Detector',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Arbitrage Detector routes to Shared Redis',
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

  scenarios: generateScenarios('sports-betting-cache', problemConfigs['sports-betting-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Autonomous Vehicle Map Cache
 * From extracted-problems/system-design/caching.md
 */
export const autonomousVehicleCacheProblemDefinition: ProblemDefinition = {
  id: 'autonomous-vehicle-cache',
  title: 'Autonomous Vehicle Map Cache',
  description: `Design a multi-tier caching system for autonomous vehicles that must work reliably even with intermittent connectivity. Combine edge caching, in-vehicle caching, and predictive prefetching. Learn about safety-critical caching, offline operation, and handling map updates during operation.
- Cache HD maps on vehicle (upcoming 50km route)
- Prefetch maps based on predicted route
- Update maps incrementally (road closures, construction)
- Fallback to cached maps if connectivity lost`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Vehicles (redirect_client) for geo-partitioned cache with 99.999% availability',
      },
      {
        type: 'cdn',
        reason: 'Need Regional Edge CDN (cdn) for geo-partitioned cache with 99.999% availability',
      },
      {
        type: 'cache',
        reason: 'Need US-West Cache (cache) for geo-partitioned cache with 99.999% availability',
      },
      {
        type: 'object_storage',
        reason: 'Need Map Tiles (object_store) for geo-partitioned cache with 99.999% availability',
      },
      {
        type: 'message_queue',
        reason: 'Need Map Updates (stream) for geo-partitioned cache with 99.999% availability',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Vehicles routes to Regional Edge CDN',
      },
      {
        from: 'cdn',
        to: 'cache',
        reason: 'Regional Edge CDN routes to US-West Cache',
      },
      {
        from: 'cdn',
        to: 'cache',
        reason: 'Regional Edge CDN routes to US-East Cache',
      },
      {
        from: 'cdn',
        to: 'cache',
        reason: 'Regional Edge CDN routes to EU Cache',
      },
      {
        from: 'cdn',
        to: 'cache',
        reason: 'Regional Edge CDN routes to APAC Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'US-West Cache routes to Map Service',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'US-East Cache routes to Map Service',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'EU Cache routes to Map Service',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'APAC Cache routes to Map Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Map Service routes to Map Tiles',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Map Updates routes to Map Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Route Predictor routes to Map Updates',
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

  scenarios: generateScenarios('autonomous-vehicle-cache', problemConfigs['autonomous-vehicle-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Stock Market Data Feed Cache
 * From extracted-problems/system-design/caching.md
 */
export const stockMarketDataCacheProblemDefinition: ProblemDefinition = {
  id: 'stock-market-data-cache',
  title: 'Stock Market Data Feed Cache',
  description: `Design a caching and streaming system for real-time stock market data that handles bursts during high volatility. Implement time-series caching, backpressure handling, and historical data replay. Learn about windowed aggregations, lossy compression for bandwidth, and fairness during overload.
- Cache last 1 hour of tick data per symbol
- Stream real-time updates with <10ms lag
- Handle burst traffic during market events
- Support historical data queries (1min/5min OHLC)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Subscribers (redirect_client) for time-series cache with backpressure handling',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for time-series cache with backpressure handling',
      },
      {
        type: 'cache',
        reason: 'Need Tick Cache (Redis TS) (cache) for time-series cache with backpressure handling',
      },
      {
        type: 'message_queue',
        reason: 'Need Tick Stream (Kafka) (stream) for time-series cache with backpressure handling',
      },
      {
        type: 'object_storage',
        reason: 'Need Tick Archive (S3) (object_store) for time-series cache with backpressure handling',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Subscribers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Stream Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Stream Servers routes to Tick Cache (Redis TS)',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Stream Servers routes to Tick Stream (Kafka)',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Tick Stream (Kafka) routes to OHLC Aggregator',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Tick Stream (Kafka) routes to Backpressure Manager',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'OHLC Aggregator routes to Tick Cache (Redis TS)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Backpressure Manager routes to Tick Archive (S3)',
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

  scenarios: generateScenarios('stock-market-data-cache', problemConfigs['stock-market-data-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multi-region Social Network Cache
 * From extracted-problems/system-design/caching.md
 */
export const multiRegionSocialCacheProblemDefinition: ProblemDefinition = {
  id: 'multi-region-social-cache',
  title: 'Multi-region Social Network Cache',
  description: `Design a geo-distributed caching system for a social network where users can post from any region. Handle concurrent updates, detect and resolve conflicts, and provide read-after-write consistency for user's own posts. Learn about CRDTs, vector clocks, and anti-entropy protocols.
- Cache user feeds in nearest region
- Replicate posts to all regions asynchronously
- Detect concurrent edits (same post, different regions)
- Resolve conflicts with last-write-wins or custom logic`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for eventual consistency with conflict resolution',
      },
      {
        type: 'load_balancer',
        reason: 'Need US LB (lb) for eventual consistency with conflict resolution',
      },
      {
        type: 'cache',
        reason: 'Need US Cache (cache) for eventual consistency with conflict resolution',
      },
      {
        type: 'storage',
        reason: 'Need Global Post DB (db_primary) for eventual consistency with conflict resolution',
      },
      {
        type: 'message_queue',
        reason: 'Need Replication Stream (stream) for eventual consistency with conflict resolution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Users routes to US LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Users routes to EU LB',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Users routes to APAC LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'US LB routes to US Servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'EU LB routes to EU Servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'APAC LB routes to APAC Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'US Servers routes to US Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'EU Servers routes to EU Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'APAC Servers routes to APAC Cache',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'US Cache routes to Global Post DB',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'EU Cache routes to Global Post DB',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'APAC Cache routes to Global Post DB',
      },
      {
        from: 'storage',
        to: 'message_queue',
        reason: 'Global Post DB routes to Replication Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Replication Stream routes to Conflict Resolver',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Conflict Resolver routes to US Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Conflict Resolver routes to EU Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Conflict Resolver routes to APAC Cache',
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

  scenarios: generateScenarios('multi-region-social-cache', problemConfigs['multi-region-social-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Healthcare Records Cache (HIPAA)
 * From extracted-problems/system-design/caching.md
 */
export const healthcareRecordsCacheProblemDefinition: ProblemDefinition = {
  id: 'healthcare-records-cache',
  title: 'Healthcare Records Cache (HIPAA)',
  description: `Design a caching system for electronic health records that must comply with HIPAA regulations. Implement encrypted caching, fine-grained access control, comprehensive audit logging, and data minimization. Learn about balancing performance with regulatory requirements.
- Cache patient records encrypted at rest and in transit
- Enforce role-based access control (RBAC) at cache layer
- Log all cache access with user ID, timestamp, and purpose
- Support patient consent-based data sharing`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need EHR Systems (redirect_client) for encrypted cache with audit logging and access control',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for encrypted cache with audit logging and access control',
      },
      {
        type: 'cache',
        reason: 'Need Encrypted Cache (cache) for encrypted cache with audit logging and access control',
      },
      {
        type: 'storage',
        reason: 'Need EHR Database (db_primary) for encrypted cache with audit logging and access control',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log (stream) for encrypted cache with audit logging and access control',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'EHR Systems routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to RBAC Gateway',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'RBAC Gateway routes to Encrypted Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'RBAC Gateway routes to EHR Database',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'RBAC Gateway routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Retention Manager routes to EHR Database',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Retention Manager routes to Encrypted Cache',
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

  scenarios: generateScenarios('healthcare-records-cache', problemConfigs['healthcare-records-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Supply Chain Visibility Cache
 * From extracted-problems/system-design/caching.md
 */
export const supplyChainCacheProblemDefinition: ProblemDefinition = {
  id: 'supply-chain-cache',
  title: 'Supply Chain Visibility Cache',
  description: `Design a caching system for supply chain visibility where multiple companies need filtered views of shared data. Implement hierarchical caching, tenant-aware aggregations, and real-time updates as shipments move. Learn about data sovereignty, access patterns, and optimizing for complex queries.
- Cache shipment status with multi-level hierarchy
- Support supplier, warehouse, and customer views
- Aggregate metrics by region, product category, etc.
- Real-time updates as shipments scan at checkpoints`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Suppliers + Customers (redirect_client) for hierarchical multi-tenant cache with aggregation',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for hierarchical multi-tenant cache with aggregation',
      },
      {
        type: 'cache',
        reason: 'Need Shipment Cache (cache) for hierarchical multi-tenant cache with aggregation',
      },
      {
        type: 'storage',
        reason: 'Need Event Store (db_primary) for hierarchical multi-tenant cache with aggregation',
      },
      {
        type: 'message_queue',
        reason: 'Need Shipment Events (stream) for hierarchical multi-tenant cache with aggregation',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Suppliers + Customers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Visibility API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Visibility API routes to Shipment Cache',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Visibility API routes to Aggregate Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Visibility API routes to Event Store',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shipment Events routes to Visibility API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Shipment Events routes to Aggregator',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Aggregator routes to Aggregate Cache',
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

  scenarios: generateScenarios('supply-chain-cache', problemConfigs['supply-chain-cache']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

