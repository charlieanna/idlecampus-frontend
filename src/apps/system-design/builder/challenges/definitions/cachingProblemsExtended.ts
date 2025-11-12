import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

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

