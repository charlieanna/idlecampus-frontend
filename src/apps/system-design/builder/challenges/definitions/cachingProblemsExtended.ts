import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

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

  userFacingFRs: [
    'GET /api/v1/tenants/{tenantId}/data/{key} - Retrieve cached data for a tenant',
    'PUT /api/v1/tenants/{tenantId}/data/{key} - Store data in tenant-specific cache',
    'DELETE /api/v1/tenants/{tenantId}/data/{key} - Evict data from tenant cache',
    'GET /api/v1/tenants/{tenantId}/quotas - Get current quota usage and limits',
    'POST /api/v1/tenants/{tenantId}/cache/flush - Flush tenant cache partition',
    'GET /api/v1/admin/tenants/{tenantId}/metrics - Get tenant cache performance metrics',
  ],

  userFacingNFRs: [
    'P99 latency < 5ms for all cache operations across all tenant tiers',
    'Support 10M cache operations/sec distributed across 100M+ tenants',
    'Noisy neighbor impact limited to <1% degradation for other tenants',
    'System availability of 99.999% (5.26 minutes downtime/year)',
    'Support enterprise tenants with up to 1B cached objects',
    'Zero data leakage between tenant partitions with GDPR compliance',
  ],

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

  userFacingFRs: [
    'GET /api/v1/content/{contentId} - Retrieve published content with edge caching',
    'GET /api/v1/articles?author={authorId} - Query articles by author with dependency tracking',
    'POST /api/v1/content/{contentId}/publish - Publish content and invalidate related caches',
    'DELETE /api/v1/cache/tags/{tag} - Invalidate all content with specific cache tag',
    'GET /api/v1/content/{contentId}/preview?version={version} - Preview unpublished content version',
    'POST /api/v1/cache/purge - Purge cache by surrogate keys or patterns',
  ],

  userFacingNFRs: [
    'CDN edge cache hit ratio >95% for published content',
    'Cache invalidation propagation across all edge locations within 500ms',
    'Support dependency graphs with up to 1000 dependent content items',
    'Content delivery latency <50ms from edge locations globally',
    'Handle 10M content requests/sec during traffic spikes',
    'Zero stale content served after invalidation propagation completes',
  ],

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

  userFacingFRs: [
    'POST /api/v1/auth/validate - Validate JWT token with cached claims lookup',
    'POST /api/v1/auth/revoke - Revoke active token and add to blacklist',
    'POST /api/v1/auth/refresh - Rotate refresh token and issue new access token',
    'GET /api/v1/auth/session - Get current session info from cached token data',
    'POST /api/v1/auth/logout - Logout user and invalidate all tokens',
    'GET /api/v1/auth/blacklist/check/{tokenId} - Check if token is blacklisted',
  ],

  userFacingNFRs: [
    'Token validation latency <2ms using cached JWT claims',
    'Revocation propagation to all microservices within 1 second',
    'Support 100K concurrent token validations/sec',
    'Blacklist lookup latency <1ms for revoked tokens',
    'Token cache hit ratio >99% for active sessions',
    'Zero false negatives for revoked tokens after propagation completes',
  ],

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

  userFacingFRs: [
    'GET /api/v1/pricing/{sku}?userId={userId}&region={region} - Get personalized price for SKU',
    'POST /api/v1/pricing/batch - Calculate prices for multiple SKUs in single request',
    'GET /api/v1/pricing/promotions/active?sku={sku} - Get active promotions for SKU',
    'POST /api/v1/pricing/precompute - Trigger batch price pre-computation for hot SKUs',
    'GET /api/v1/pricing/{sku}/rules - Get pricing rules and ML model predictions',
    'POST /api/v1/pricing/surge/update - Update surge pricing multipliers in real-time',
  ],

  userFacingNFRs: [
    'Price calculation latency <5ms P99 including ML model inference',
    'Support 100M pricing calculations/sec during Prime Day events',
    'Handle 10x surge load (1B calculations/sec) without degradation',
    'Price cache hit ratio >90% for top 10M SKUs',
    'Support 1B+ SKUs with personalized pricing per user cohort',
    'Pricing consistency across regions within 100ms of rule updates',
  ],

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

  userFacingFRs: [
    'GET /api/v1/recommendations/user/{userId} - Get personalized recommendations from cache',
    'GET /api/v1/recommendations/trending?category={category} - Get trending items for cold start',
    'POST /api/v1/recommendations/refresh/{userId} - Trigger real-time recommendation refresh',
    'GET /api/v1/recommendations/features/{userId} - Get cached user feature vectors',
    'POST /api/v1/recommendations/batch/warm - Warm cache with batch-computed recommendations',
    'GET /api/v1/recommendations/segment/{segmentId} - Get recommendations for user segment',
  ],

  userFacingNFRs: [
    'Recommendation retrieval latency <10ms from cache',
    'Cache top-50 recommendations for 100M+ active users',
    'Handle hourly batch updates without cache disruption',
    'Cold start latency <50ms using trending fallback',
    'Recommendation freshness within 1 hour of ML model updates',
    'Cache hit ratio >95% for active users during peak hours',
  ],

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

  userFacingFRs: [
    'POST /api/v1/rtb/bid - Process bid request and select winning ad within 10ms',
    'GET /api/v1/ads/{adId}/creative - Retrieve cached ad creative and metadata',
    'GET /api/v1/campaigns/{campaignId}/budget - Get real-time budget utilization',
    'POST /api/v1/ads/impression - Record ad impression and update frequency caps',
    'GET /api/v1/targeting/rules/{userId} - Get cached targeting rules for user',
    'POST /api/v1/campaigns/{campaignId}/budget/update - Update campaign budget in real-time',
  ],

  userFacingNFRs: [
    'Total RTB response time <10ms P99 including ad selection',
    'Support 1M bid requests/sec during peak traffic',
    'Budget tracking accuracy within 5% using probabilistic counters',
    'Frequency cap accuracy >98% using bloom filters',
    'Ad creative cache hit ratio >99.5% for active campaigns',
    'Targeting rule evaluation latency <2ms from cache',
  ],

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

  userFacingFRs: [
    'POST /api/v1/matchmaking/queue/join - Add player/party to matchmaking queue',
    'DELETE /api/v1/matchmaking/queue/leave - Remove player from queue gracefully',
    'GET /api/v1/matchmaking/queue/status - Get current queue position and estimated wait time',
    'POST /api/v1/matchmaking/match/accept - Accept matched game',
    'GET /api/v1/matchmaking/pool?skillTier={tier} - Get current player pool by skill tier',
    'POST /api/v1/matchmaking/party/create - Create party for group matchmaking',
  ],

  userFacingNFRs: [
    'Match formation time <3 seconds for 95% of players',
    'Skill rating difference within 200 points for balanced matches',
    'Support 1M concurrent players in matchmaking queues',
    'Queue update latency <100ms when players join/leave',
    'Party matchmaking success rate >90% within 10 seconds',
    'Graceful handling of queue abandonment with <1s cleanup time',
  ],

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

  userFacingFRs: [
    'GET /api/v1/devices/{deviceId}/shadow - Get cached device shadow state',
    'PUT /api/v1/devices/{deviceId}/shadow/desired - Update desired state in cache',
    'POST /api/v1/devices/{deviceId}/shadow/reported - Device reports current state with delta',
    'GET /api/v1/devices/query?buildingId={buildingId} - Bulk query device shadows',
    'POST /api/v1/devices/{deviceId}/sync - Sync offline device with state deltas',
    'GET /api/v1/devices/{deviceId}/shadow/conflicts - Get unresolved state conflicts',
  ],

  userFacingNFRs: [
    'Shadow state retrieval latency <5ms from cache',
    'Support 10M+ IoT devices with varying update frequencies',
    'Handle devices offline for up to 7 days with delta sync',
    'Bulk query response time <100ms for up to 10K devices',
    'Conflict resolution latency <10ms using vector clocks',
    'State propagation from cache to devices within 500ms of reconnection',
  ],

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

  userFacingFRs: [
    'GET /api/v1/inventory/{sku}?region={region} - Get cached inventory count by region',
    'POST /api/v1/inventory/{sku}/reserve - Reserve inventory with distributed lock',
    'POST /api/v1/inventory/{sku}/release - Release expired or cancelled reservation',
    'POST /api/v1/inventory/{sku}/commit - Commit reservation to actual purchase',
    'GET /api/v1/inventory/global/{sku} - Get global inventory across all regions',
    'POST /api/v1/inventory/{sku}/sync - Sync inventory updates across regions',
  ],

  userFacingNFRs: [
    'Inventory read latency <10ms from regional cache',
    'Zero overselling with distributed lock coordination',
    'Reservation timeout at 10 minutes with automatic release',
    'Cross-region inventory sync within 100ms of updates',
    'Support 100K concurrent reservations during flash sales',
    'Eventual consistency for browsing with <5 second staleness',
  ],

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

  userFacingFRs: [
    'GET /api/v1/stream/{contentId}/manifest - Get adaptive bitrate manifest from ISP cache',
    'GET /api/v1/stream/{contentId}/chunk/{chunkId} - Stream video chunk from nearest cache',
    'POST /api/v1/placement/predict - Predict content to pre-cache at ISP locations',
    'GET /api/v1/peers/discover?contentId={contentId} - Discover P2P peers for content',
    'POST /api/v1/stream/quality/report - Report streaming quality for adaptive bitrate',
    'GET /api/v1/cache/isp/{ispId}/capacity - Get ISP cache box capacity and usage',
  ],

  userFacingNFRs: [
    'Streaming start latency <1 second from ISP cache',
    'ISP cache hit ratio >95% for popular content',
    'P2P delivery reduces origin bandwidth by 30%',
    'Adaptive bitrate selection within 2 seconds of network changes',
    'Support 100M concurrent streams globally',
    'ML-based placement accuracy >85% for next-day viewing prediction',
  ],

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

  userFacingFRs: [
    'GET /api/v1/inventory/{sku}/global - Get real-time inventory across all 5 regions',
    'POST /api/v1/inventory/{sku}/reserve?region={region} - Reserve with optimistic locking',
    'POST /api/v1/inventory/{sku}/commit - Commit reservation to purchase',
    'DELETE /api/v1/inventory/{sku}/reservation/{reservationId} - Cancel and release reservation',
    'GET /api/v1/inventory/{sku}/conflicts - Get CRDT conflict resolution history',
    'POST /api/v1/inventory/sync/repair - Trigger anti-entropy repair after partition',
  ],

  userFacingNFRs: [
    'Zero overselling guarantee using pessimistic or optimistic locking',
    'Reservation latency <20ms P99 including cross-region coordination',
    'Support 100K concurrent reservations during flash sales',
    'Automatic reservation timeout and release after 10 minutes',
    'Network partition detection and repair within 30 seconds',
    'Cross-region inventory sync latency <100ms during normal operation',
  ],

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

  userFacingFRs: [
    'GET /api/v1/orderbook/{symbol}/snapshot - Get cached order book snapshot',
    'POST /api/v1/orders/submit - Submit order with microsecond position validation',
    'GET /api/v1/positions/{accountId} - Get real-time position from NVRAM cache',
    'GET /api/v1/market/ticks/{symbol}?duration=1h - Query historical tick data',
    'POST /api/v1/risk/limits/check - Validate trade against cached risk limits',
    'GET /api/v1/orderbook/{symbol}/depth - Get market depth from cached book',
  ],

  userFacingNFRs: [
    'Order book snapshot access latency <100 microseconds',
    'Position and risk limit validation latency <50 microseconds',
    'RDMA replication to hot standby within 10 microseconds',
    'Support 1M order book updates/sec per symbol',
    'Historical tick data query latency <1ms for 1 hour window',
    'Lock-free data structure updates with zero blocking',
  ],

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

  userFacingFRs: [
    'GET /api/v1/assets/{assetId}/manifest - Get asset manifest with chunk hashes',
    'GET /api/v1/assets/{assetId}/chunk/{chunkId} - Download chunk from CDN or peer',
    'POST /api/v1/p2p/peers/discover?assetId={assetId} - Discover peers with asset chunks',
    'POST /api/v1/assets/{assetId}/verify - Verify chunk integrity with hash validation',
    'GET /api/v1/cdn/fallback/{assetId}/chunk/{chunkId} - Fallback to CDN for chunk',
    'POST /api/v1/p2p/peers/announce - Announce chunks available for peer sharing',
  ],

  userFacingNFRs: [
    'Download speed improvement of 40% using P2P vs CDN-only',
    'Chunk integrity verification latency <10ms per 4MB chunk',
    'P2P peer discovery latency <500ms',
    'CDN fallback activation within 2 seconds if no peers available',
    'Support asset distribution for 10M concurrent gamers',
    'Bandwidth cost reduction of 50% through P2P offload',
  ],

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

  userFacingFRs: [
    'GET /api/v1/odds/{eventId}/current - Get real-time odds with staleness timestamp',
    'POST /api/v1/bets/place - Place bet with odds validation against fresh cache',
    'GET /api/v1/odds/{eventId}/history?duration=5m - Get odds history for event',
    'POST /api/v1/odds/update - Update odds based on game event (goal, foul, etc.)',
    'GET /api/v1/arbitrage/check?eventId={eventId} - Check for regional arbitrage opportunities',
    'GET /api/v1/odds/feed/{eventId}/stream - Subscribe to real-time odds update stream',
  ],

  userFacingNFRs: [
    'Odds staleness guarantee <100ms from game event occurrence',
    'Bet placement latency <50ms including odds validation',
    'Support 500K concurrent bettors during major sporting events',
    'Odds update propagation to all regions within 50ms',
    'Arbitrage detection latency <200ms across global regions',
    'Handle 10x bet placement spike during key moments (goals, penalties)',
  ],

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

  userFacingFRs: [
    'GET /api/v1/maps/tiles?route={route}&radius=50km - Prefetch HD map tiles for route',
    'GET /api/v1/maps/updates/incremental?lastSync={timestamp} - Get incremental map updates',
    'POST /api/v1/maps/predict/route - Predict route and trigger prefetch',
    'GET /api/v1/maps/cached/status - Get on-vehicle cache status and coverage',
    'POST /api/v1/maps/offline/fallback - Activate offline mode with cached maps',
    'GET /api/v1/maps/construction?region={region} - Get cached road closure updates',
  ],

  userFacingNFRs: [
    'Map prefetch latency <2 seconds for 50km route ahead',
    '99.999% availability requirement for safety-critical operation',
    'Offline operation support for up to 2 hours with cached maps',
    'Incremental update download <100ms for real-time hazards',
    'Map cache storage capacity for 500km of HD map data',
    'Predictive prefetch accuracy >90% for typical commute routes',
  ],

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

  userFacingFRs: [
    'GET /api/v1/market/{symbol}/stream - Subscribe to real-time tick data stream',
    'GET /api/v1/market/{symbol}/ticks?duration=1h - Get cached tick history',
    'GET /api/v1/market/{symbol}/ohlc?interval=1m - Get 1-minute OHLC from cache',
    'GET /api/v1/market/{symbol}/ohlc?interval=5m - Get 5-minute OHLC aggregation',
    'POST /api/v1/market/stream/subscribe - Batch subscribe to multiple symbols',
    'GET /api/v1/market/replay?from={timestamp}&to={timestamp} - Replay historical data',
  ],

  userFacingNFRs: [
    'Real-time data stream latency <10ms from market tick',
    'Support 1M market ticks/sec during high volatility bursts',
    'Cache 1 hour of tick history for 10K actively traded symbols',
    'OHLC aggregation query latency <5ms from cached data',
    'Backpressure handling with graceful degradation (no data loss)',
    'Historical replay latency <100ms for 1 hour window',
  ],

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

  userFacingFRs: [
    'GET /api/v1/feed/{userId} - Get user feed from nearest regional cache',
    'POST /api/v1/posts/create - Create post with read-after-write consistency',
    'PUT /api/v1/posts/{postId}/edit - Edit post with conflict detection',
    'GET /api/v1/posts/{postId}/versions - Get post version history with vector clocks',
    'POST /api/v1/posts/{postId}/resolve - Manually resolve concurrent edit conflicts',
    'GET /api/v1/feed/global/{userId} - Get globally consistent feed view',
  ],

  userFacingNFRs: [
    'Feed read latency <20ms from nearest regional cache',
    'Post replication to all regions within 500ms asynchronously',
    'Read-after-write consistency guarantee for user\'s own posts',
    'Concurrent edit detection latency <100ms using vector clocks',
    'Support 1B+ users distributed across 5 global regions',
    'Conflict resolution completion within 1 second of detection',
  ],

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

  userFacingFRs: [
    'GET /api/v1/patients/{patientId}/records - Get encrypted patient records with RBAC',
    'POST /api/v1/patients/{patientId}/access/log - Log access event for audit trail',
    'GET /api/v1/patients/{patientId}/consent - Check patient consent for data sharing',
    'PUT /api/v1/patients/{patientId}/records/update - Update encrypted cache record',
    'GET /api/v1/audit/records?userId={userId}&date={date} - Query audit logs',
    'POST /api/v1/cache/purge/patient/{patientId} - Purge patient data per retention policy',
  ],

  userFacingNFRs: [
    'All patient records encrypted at rest and in transit (AES-256)',
    'RBAC enforcement latency <5ms at cache layer',
    '100% audit logging coverage for all cache access operations',
    'Patient consent validation latency <10ms',
    'Data retention policy enforcement with automatic purging',
    'HIPAA compliance with encrypted cache access patterns',
  ],

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

  userFacingFRs: [
    'GET /api/v1/shipments/{shipmentId} - Get shipment status from hierarchical cache',
    'GET /api/v1/shipments/view?role={role}&tenantId={tenantId} - Get tenant-filtered view',
    'GET /api/v1/metrics/aggregate?region={region}&category={category} - Get cached aggregates',
    'POST /api/v1/shipments/{shipmentId}/checkpoint - Update shipment status at checkpoint',
    'GET /api/v1/shipments/query?supplier={supplier}&status={status} - Query by criteria',
    'GET /api/v1/metrics/realtime?tenantId={tenantId} - Get real-time tenant metrics',
  ],

  userFacingNFRs: [
    'Shipment status query latency <10ms from hierarchical cache',
    'Tenant-filtered view generation latency <20ms',
    'Real-time checkpoint updates propagated within 500ms',
    'Support 10M active shipments with multi-tenant access',
    'Aggregate metrics refresh every 30 seconds',
    'Data sovereignty compliance with geo-partitioned caching',
  ],

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

// Auto-generate code challenges from functional requirements
(multiTenantSaasCacheProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(multiTenantSaasCacheProblemDefinition);
