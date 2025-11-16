import { SystemGraph } from '../../types/graph';
import { Scenario, ValidationResult, ValidatorFunction, ProblemDefinition } from '../../types/problemDefinition';
import { CacheStrategy } from '../../types/advancedConfig';

/**
 * Domain-Specific Validators
 * Ensures architectural patterns match problem domain requirements
 */

/**
 * Social Media Domain Validator
 * Requirements: eventual consistency, high read ratio, celebrity user handling
 */
export const socialMediaValidator: ValidatorFunction = (graph, scenario, problem) => {
  // Check for social media problems
  if (!problem?.id?.match(/instagram|twitter|facebook|reddit|linkedin|tiktok|social|feed|timeline/)) {
    return { valid: true };
  }

  // Social media is read-heavy (>80% reads typical)
  const readRatio = scenario.traffic.readWriteRatio || 0.5;
  if (readRatio < 0.7) {
    return {
      valid: false,
      hint: 'Social media platforms are typically read-heavy (80-95% reads). Adjust your traffic model.',
    };
  }

  // Must have caching for feeds
  const hasCache = graph.components.some(c => c.type === 'redis');
  if (!hasCache && scenario.traffic.rps > 100) {
    return {
      valid: false,
      hint: 'Social media feeds require caching to handle read load. Add Redis or similar cache.',
    };
  }

  // Check for CDN for media content
  const hasCDN = graph.components.some(c => c.type === 'cdn');
  const hasObjectStorage = graph.components.some(c => c.type === 's3' || c.type === 'object_storage');

  if (problem?.description?.includes('photo') || problem?.description?.includes('video')) {
    if (!hasCDN && scenario.traffic.rps > 1000) {
      return {
        valid: false,
        hint: 'Social media with photos/videos needs CDN for global content delivery.',
      };
    }
    if (!hasObjectStorage) {
      return {
        valid: false,
        hint: 'Social media platforms need object storage (S3) for photos/videos.',
      };
    }
  }

  // Check for message queue for async operations
  const hasQueue = graph.components.some(c => c.type === 'kafka' || c.type === 'rabbitmq' || c.type === 'sqs');
  if (!hasQueue && problem?.description?.includes('notification')) {
    return {
      valid: false,
      hint: 'Social platforms with notifications need message queues for async fanout.',
    };
  }

  return { valid: true };
};

/**
 * E-commerce Domain Validator
 * Requirements: inventory consistency, payment processing, cart management
 */
export const ecommerceValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/amazon|shopify|ecommerce|cart|product|inventory|checkout/)) {
    return { valid: true };
  }

  // E-commerce requires strong consistency for inventory
  const cacheComponents = graph.components.filter(c => c.type === 'redis');
  for (const cache of cacheComponents) {
    const strategy = cache.config.strategy as CacheStrategy;

    // Inventory updates must be consistent
    if (problem?.description?.includes('inventory') && strategy === 'write_behind') {
      return {
        valid: false,
        hint: 'Inventory management requires strong consistency. Write-behind caching risks overselling. Use write-through or cache-aside with proper locking.',
      };
    }
  }

  // Must have database with ACID transactions
  const hasTransactionalDB = graph.components.some(c =>
    c.type === 'postgresql' || c.type === 'mysql' || c.type === 'oracle'
  );

  if (!hasTransactionalDB) {
    return {
      valid: false,
      hint: 'E-commerce requires ACID transactions for orders and payments. Use PostgreSQL or MySQL.',
    };
  }

  // Check for payment gateway integration
  if (problem?.description?.includes('payment') || problem?.description?.includes('checkout')) {
    const hasLoadBalancer = graph.components.some(c => c.type === 'load_balancer');
    if (!hasLoadBalancer) {
      return {
        valid: false,
        hint: 'Payment processing requires load balancer for high availability and PCI compliance.',
      };
    }

    // Should have replication for payment data
    const databases = graph.components.filter(c =>
      c.type === 'postgresql' || c.type === 'mysql'
    );

    for (const db of databases) {
      if (!db.config.replication) {
        return {
          valid: false,
          hint: 'Payment/order data requires database replication for durability and availability.',
        };
      }
    }
  }

  // Check for search functionality
  if (problem?.description?.includes('search')) {
    const hasSearch = graph.components.some(c =>
      c.type === 'elasticsearch' || c.type === 'solr' || c.type === 'algolia'
    );

    if (!hasSearch) {
      return {
        valid: false,
        hint: 'E-commerce search requires specialized search engine (Elasticsearch/Solr) for faceted search, filters, and relevance ranking.',
      };
    }
  }

  return { valid: true };
};

/**
 * Financial/Banking Domain Validator
 * Requirements: ACID transactions, strong consistency, audit trail
 */
export const financialValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/payment|banking|financial|transaction|trading|wallet|stripe/)) {
    return { valid: true };
  }

  // Financial systems require strong consistency
  if ((problem as any).consistencyRequirement !== 'strong') {
    return {
      valid: false,
      hint: 'Financial systems require strong consistency. Set consistencyRequirement to "strong".',
    };
  }

  // No data loss acceptable
  if ((problem as any).dataLossAcceptable !== false) {
    return {
      valid: false,
      hint: 'Financial systems cannot tolerate data loss. Set dataLossAcceptable to false.',
    };
  }

  // Check caching strategy
  const cacheComponents = graph.components.filter(c => c.type === 'redis');
  for (const cache of cacheComponents) {
    const strategy = cache.config.strategy as CacheStrategy;

    if (strategy === 'write_behind' || strategy === 'write_back') {
      return {
        valid: false,
        hint: 'Financial transactions cannot use write-behind caching due to data loss risk. Use write-through for consistency.',
      };
    }
  }

  // Must have ACID database
  const hasACIDDatabase = graph.components.some(c =>
    (c.type === 'postgresql' || c.type === 'mysql' || c.type === 'oracle') &&
    c.config.transactionIsolation === 'serializable'
  );

  if (!hasACIDDatabase && problem?.description?.includes('transaction')) {
    return {
      valid: false,
      hint: 'Financial transactions require ACID database with serializable isolation level.',
    };
  }

  // Must have audit logging
  const hasAuditLog = graph.components.some(c =>
    c.type === 'kafka' || c.type === 'kinesis' ||
    (c.type === 'postgresql' && c.config.auditLog)
  );

  if (!hasAuditLog) {
    return {
      valid: false,
      hint: 'Financial systems require audit trail. Add Kafka/Kinesis for event sourcing or enable database audit logs.',
    };
  }

  // High availability required
  const databases = graph.components.filter(c =>
    c.type === 'postgresql' || c.type === 'mysql'
  );

  for (const db of databases) {
    if (!db.config.replication || (db.config.instances || 1) < 2) {
      return {
        valid: false,
        hint: 'Financial data requires multi-master or master-slave replication for high availability.',
      };
    }
  }

  return { valid: true };
};

/**
 * Messaging/Chat Domain Validator
 * Requirements: real-time delivery, message ordering, presence
 */
export const messagingValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/whatsapp|slack|telegram|messenger|chat|message|realtime/)) {
    return { valid: true };
  }

  // Must have WebSocket or similar for real-time
  const hasRealtime = graph.components.some(c =>
    c.type === 'websocket' || c.type === 'socket_io' || c.config.protocol === 'websocket'
  );

  if (!hasRealtime) {
    return {
      valid: false,
      hint: 'Messaging apps require WebSocket connections for real-time message delivery.',
    };
  }

  // Must have message queue for reliability
  const hasQueue = graph.components.some(c =>
    c.type === 'kafka' || c.type === 'rabbitmq' || c.type === 'redis' // Redis pub/sub
  );

  if (!hasQueue) {
    return {
      valid: false,
      hint: 'Messaging systems need message queue (Kafka/RabbitMQ) for reliable delivery and offline message handling.',
    };
  }

  // Check for message ordering
  if (problem?.description?.includes('order') || problem?.description?.includes('conversation')) {
    const kafkaComponents = graph.components.filter(c => c.type === 'kafka');

    for (const kafka of kafkaComponents) {
      if (!kafka.config.partitioning || kafka.config.partitions < 10) {
        return {
          valid: false,
          hint: 'Message ordering requires proper Kafka partitioning (partition by conversation/user ID).',
        };
      }
    }
  }

  // Check for presence/typing indicators
  if (problem?.description?.includes('presence') || problem?.description?.includes('typing')) {
    const hasRedis = graph.components.some(c => c.type === 'redis');

    if (!hasRedis) {
      return {
        valid: false,
        hint: 'Presence and typing indicators require Redis for fast ephemeral state management.',
      };
    }
  }

  // Check for media handling
  if (problem?.description?.includes('photo') || problem?.description?.includes('file')) {
    const hasObjectStorage = graph.components.some(c =>
      c.type === 's3' || c.type === 'object_storage'
    );

    if (!hasObjectStorage) {
      return {
        valid: false,
        hint: 'Messaging with media sharing requires object storage (S3) for photos/files.',
      };
    }
  }

  return { valid: true };
};

/**
 * Streaming/Video Domain Validator
 * Requirements: CDN, adaptive bitrate, buffering
 */
export const streamingValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/netflix|youtube|twitch|hulu|video|stream|media|content/)) {
    return { valid: true };
  }

  // Must have CDN for video delivery
  const hasCDN = graph.components.some(c => c.type === 'cdn');

  if (!hasCDN) {
    return {
      valid: false,
      hint: 'Video streaming requires CDN for global content delivery and reduced latency.',
    };
  }

  // Must have object storage for videos
  const hasObjectStorage = graph.components.some(c =>
    c.type === 's3' || c.type === 'object_storage'
  );

  if (!hasObjectStorage) {
    return {
      valid: false,
      hint: 'Video streaming requires object storage (S3) for storing video files.',
    };
  }

  // Check CDN configuration
  const cdnComponents = graph.components.filter(c => c.type === 'cdn');

  for (const cdn of cdnComponents) {
    if (!cdn.config.locations || cdn.config.locations < 5) {
      return {
        valid: false,
        hint: 'Global video streaming requires CDN with multiple edge locations (5+ regions).',
      };
    }

    if (!cdn.config.cacheSize || cdn.config.cacheSize < 100) {
      return {
        valid: false,
        hint: 'Video CDN requires large cache size (100+ GB per edge) for popular content.',
      };
    }
  }

  // Check for transcoding service
  if (problem?.description?.includes('upload') || problem?.description?.includes('transcode')) {
    const hasQueue = graph.components.some(c =>
      c.type === 'kafka' || c.type === 'sqs' || c.type === 'rabbitmq'
    );

    if (!hasQueue) {
      return {
        valid: false,
        hint: 'Video upload requires message queue for async transcoding jobs.',
      };
    }

    const hasWorkers = graph.components.some(c =>
      c.type === 'worker' || (c.type === 'app_server' && c.config.role === 'worker')
    );

    if (!hasWorkers) {
      return {
        valid: false,
        hint: 'Video transcoding requires worker nodes for processing different resolutions/formats.',
      };
    }
  }

  // Live streaming specific
  if (problem?.id?.includes('twitch') || problem?.description?.includes('live')) {
    const hasRTMP = graph.components.some(c =>
      c.config.protocol === 'rtmp' || c.config.protocol === 'hls'
    );

    if (!hasRTMP) {
      return {
        valid: false,
        hint: 'Live streaming requires RTMP/HLS protocol support for real-time video ingestion.',
      };
    }
  }

  return { valid: true };
};

/**
 * Ride-sharing/Delivery Domain Validator
 * Requirements: geo-spatial queries, real-time tracking, matching
 */
export const ridesharingValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/uber|lyft|doordash|instacart|delivery|ride|driver/)) {
    return { valid: true };
  }

  // Must have geo-spatial database or service
  const hasGeoSupport = graph.components.some(c =>
    c.type === 'mongodb' || // MongoDB has geo queries
    c.type === 'postgresql' || // PostGIS extension
    c.type === 'elasticsearch' || // Geo queries
    c.config.geoEnabled
  );

  if (!hasGeoSupport) {
    return {
      valid: false,
      hint: 'Ride-sharing requires geo-spatial queries. Use MongoDB with 2dsphere index, PostgreSQL with PostGIS, or Elasticsearch.',
    };
  }

  // Must have real-time tracking
  const hasRealtime = graph.components.some(c =>
    c.type === 'websocket' || c.type === 'redis' || c.config.protocol === 'websocket'
  );

  if (!hasRealtime) {
    return {
      valid: false,
      hint: 'Ride tracking requires WebSocket or Redis pub/sub for real-time location updates.',
    };
  }

  // Must have message queue for matching
  const hasQueue = graph.components.some(c =>
    c.type === 'kafka' || c.type === 'rabbitmq' || c.type === 'kinesis'
  );

  if (!hasQueue) {
    return {
      valid: false,
      hint: 'Ride matching requires message queue for async driver-rider pairing algorithm.',
    };
  }

  // Check for caching of driver locations
  const hasLocationCache = graph.components.some(c =>
    c.type === 'redis' && (c.config.geoEnabled || c.config.dataStructures?.includes('geo'))
  );

  if (!hasLocationCache && scenario.traffic.rps > 1000) {
    return {
      valid: false,
      hint: 'High-traffic ride-sharing needs Redis with geo support for caching driver locations (GEOADD, GEORADIUS).',
    };
  }

  // Check for pricing service
  if (problem?.description?.includes('pricing') || problem?.description?.includes('surge')) {
    const hasCache = graph.components.some(c => c.type === 'redis');

    if (!hasCache) {
      return {
        valid: false,
        hint: 'Dynamic pricing requires Redis for real-time supply/demand calculations and caching.',
      };
    }
  }

  return { valid: true };
};

/**
 * Search Engine Domain Validator
 * Requirements: inverted index, relevance ranking, faceted search
 */
export const searchEngineValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/google|search|elastic|solr|index|query/)) {
    return { valid: true };
  }

  // Must have search engine
  const hasSearchEngine = graph.components.some(c =>
    c.type === 'elasticsearch' || c.type === 'solr' || c.type === 'algolia'
  );

  if (!hasSearchEngine) {
    return {
      valid: false,
      hint: 'Search functionality requires specialized search engine (Elasticsearch/Solr/Algolia) for inverted indexing.',
    };
  }

  // Check for proper sharding
  const searchComponents = graph.components.filter(c =>
    c.type === 'elasticsearch' || c.type === 'solr'
  );

  for (const search of searchComponents) {
    if (!search.config.shards || search.config.shards < 3) {
      return {
        valid: false,
        hint: 'Search engine requires multiple shards (3+) for distributed indexing and query performance.',
      };
    }

    if (!search.config.replicas || search.config.replicas < 1) {
      return {
        valid: false,
        hint: 'Search index requires replicas for high availability and read scaling.',
      };
    }
  }

  // Check for caching layer
  const hasCache = graph.components.some(c => c.type === 'redis');

  if (!hasCache && scenario.traffic.rps > 1000) {
    return {
      valid: false,
      hint: 'High-traffic search needs caching layer (Redis) for popular queries and suggestions.',
    };
  }

  // Check for autocomplete/suggestions
  if (problem?.description?.includes('suggest') || problem?.description?.includes('autocomplete')) {
    const hasRedis = graph.components.some(c => c.type === 'redis');

    if (!hasRedis) {
      return {
        valid: false,
        hint: 'Search suggestions require Redis with sorted sets for fast prefix matching.',
      };
    }
  }

  return { valid: true };
};

/**
 * Gaming Domain Validator
 * Requirements: low latency, leaderboards, matchmaking
 */
export const gamingValidator: ValidatorFunction = (graph, scenario, problem) => {
  if (!problem?.id?.match(/game|gaming|steam|xbox|playstation|leaderboard|match/)) {
    return { valid: true };
  }

  // Gaming requires low latency
  if (scenario.passCriteria.maxLatency && scenario.passCriteria.maxLatency > 100) {
    return {
      valid: false,
      hint: 'Gaming requires low latency (<100ms p99). Consider edge servers and regional deployment.',
    };
  }

  // Check for leaderboard support
  if (problem?.description?.includes('leaderboard') || problem?.description?.includes('ranking')) {
    const hasRedis = graph.components.some(c =>
      c.type === 'redis' && (c.config.dataStructures?.includes('sorted_set') || !c.config.dataStructures)
    );

    if (!hasRedis) {
      return {
        valid: false,
        hint: 'Gaming leaderboards require Redis sorted sets for efficient ranking operations (ZADD, ZRANGE).',
      };
    }
  }

  // Check for matchmaking
  if (problem?.description?.includes('match') || problem?.description?.includes('lobby')) {
    const hasQueue = graph.components.some(c =>
      c.type === 'redis' || c.type === 'rabbitmq'
    );

    if (!hasQueue) {
      return {
        valid: false,
        hint: 'Matchmaking requires Redis or RabbitMQ for queueing players and skill-based matching.',
      };
    }

    // Should have WebSocket for real-time updates
    const hasRealtime = graph.components.some(c =>
      c.type === 'websocket' || c.config.protocol === 'websocket'
    );

    if (!hasRealtime) {
      return {
        valid: false,
        hint: 'Gaming requires WebSocket for real-time game state updates and match notifications.',
      };
    }
  }

  // Check for session management
  const hasSessionStore = graph.components.some(c =>
    c.type === 'redis' || (c.type === 'memcached' && c.config.persistent)
  );

  if (!hasSessionStore) {
    return {
      valid: false,
      hint: 'Gaming requires fast session store (Redis/Memcached) for player state and connection management.',
    };
  }

  return { valid: true };
};

/**
 * Master domain validator that runs appropriate validator based on problem
 */
export const domainSpecificValidator: ValidatorFunction = (graph, scenario, problem) => {
  const validators = [
    socialMediaValidator,
    ecommerceValidator,
    financialValidator,
    messagingValidator,
    streamingValidator,
    ridesharingValidator,
    searchEngineValidator,
    gamingValidator,
  ];

  for (const validator of validators) {
    const result = validator(graph, scenario, problem);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
};

/**
 * Helper to determine appropriate consistency level by domain
 */
export function getConsistencyRequirementByDomain(problemId: string): 'strong' | 'eventual' | 'causal' {
  // Strong consistency domains
  if (problemId.match(/payment|banking|financial|transaction|ticket|booking|inventory/)) {
    return 'strong';
  }

  // Causal consistency domains
  if (problemId.match(/chat|message|comment|conversation/)) {
    return 'causal';
  }

  // Eventual consistency domains (default for most)
  return 'eventual';
}

/**
 * Helper to determine if data loss is acceptable by domain
 */
export function isDataLossAcceptableByDomain(problemId: string): boolean {
  // Never acceptable for these domains
  if (problemId.match(/payment|banking|financial|transaction|order|booking|medical|health/)) {
    return false;
  }

  // Acceptable for analytics and metrics
  if (problemId.match(/analytics|metrics|telemetry|logging|tracking/)) {
    return true;
  }

  // Default to false for safety
  return false;
}

/**
 * Helper to recommend caching strategy by domain
 */
export function recommendCacheStrategyByDomain(
  problemId: string,
  readRatio: number
): CacheStrategy {
  // Financial: always write-through for consistency
  if (problemId.match(/payment|banking|financial/)) {
    return 'write_through';
  }

  // Analytics: write-behind for performance
  if (problemId.match(/analytics|metrics|logging/) && readRatio < 0.5) {
    return 'write_behind';
  }

  // Social media: cache-aside for flexibility
  if (problemId.match(/social|feed|timeline/) && readRatio > 0.8) {
    return 'cache_aside';
  }

  // E-commerce product catalog: read-through
  if (problemId.match(/product|catalog|inventory/) && readRatio > 0.7) {
    return 'read_through';
  }

  // Audit logs: write-around (rarely read)
  if (problemId.match(/audit|compliance|log/) && readRatio < 0.1) {
    return 'write_around';
  }

  // Default based on read ratio
  if (readRatio > 0.7) {
    return 'cache_aside';
  } else if (readRatio < 0.3) {
    return 'write_around';
  } else {
    return 'cache_aside'; // Safe default
  }
}