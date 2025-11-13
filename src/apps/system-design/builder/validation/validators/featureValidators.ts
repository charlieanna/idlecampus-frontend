import { SystemGraph } from '../../types/graph';
import { Scenario, ValidationResult, ValidatorFunction } from '../../types/problemDefinition';
import { isDatabaseComponentType } from '../../utils/database';

/**
 * Feature-specific validators that test each FR end-to-end
 * These simulate actual user requests and validate the complete flow
 */

/**
 * Helper: Trace request path from client through architecture
 */
function traceRequestPath(
  graph: SystemGraph,
  startComponent: string,
  targetComponent: string,
  visited: Set<string> = new Set()
): string[] | null {
  if (startComponent === targetComponent) {
    return [startComponent];
  }

  if (visited.has(startComponent)) {
    return null; // Circular dependency
  }

  visited.add(startComponent);

  // Find all outgoing connections
  const outgoingConnections = graph.connections.filter(c => c.from === startComponent);

  for (const conn of outgoingConnections) {
    const path = traceRequestPath(graph, conn.to, targetComponent, visited);
    if (path) {
      return [startComponent, ...path];
    }
  }

  return null;
}

/**
 * Helper: Check if component type exists in graph
 */
function hasComponent(graph: SystemGraph, type: string): boolean {
  return graph.components.some(c => c.type === type);
}

/**
 * Helper: Check if connection exists between component types
 */
function hasConnection(graph: SystemGraph, fromType: string, toType: string): boolean {
  return graph.connections.some(conn => {
    const fromComp = graph.components.find(c => c.id === conn.from);
    const toComp = graph.components.find(c => c.id === conn.to);
    return fromComp?.type === fromType && toComp?.type === toType;
  });
}

/**
 * Validate URL Shortening Feature (TinyURL FR-1)
 * Tests: Client → App → Database flow for creating short URLs
 */
export const urlShorteningValidator: ValidatorFunction = (graph, scenario) => {
  // 1. Client must exist
  const client = graph.components.find(c => c.type === 'client');
  if (!client) {
    return {
      valid: false,
      hint: 'No client component found. Users need a way to access the URL shortening service.',
    };
  }

  // 2. Must have compute layer (app server)
  const hasCompute = hasComponent(graph, 'app_server') || hasComponent(graph, 'lambda');
  if (!hasCompute) {
    return {
      valid: false,
      hint: 'FR-1 (URL Shortening): Need compute layer (app server) to generate short codes and handle requests.',
    };
  }

  // 3. Must have database to store URL mappings
  const hasDB = graph.components.some(c => isDatabaseComponentType(c.type));
  if (!hasDB) {
    return {
      valid: false,
      hint: 'FR-1 (URL Shortening): Need database to persist URL mappings (short_code → long_url).',
    };
  }

  // 4. Trace path: Client → Compute → Database
  const appServer = graph.components.find(c => c.type === 'app_server' || c.type === 'lambda');
  const database = graph.components.find(c => isDatabaseComponentType(c.type));

  if (!appServer || !database) {
    return { valid: true }; // Already caught above
  }

  // Check if client can reach app server
  const clientToApp = traceRequestPath(graph, client.id, appServer.id);
  if (!clientToApp) {
    return {
      valid: false,
      hint: 'FR-1 (URL Shortening): Client cannot reach app server. Need connection path: Client → [Load Balancer] → App Server.',
    };
  }

  // Check if app server can reach database
  const appToDb = traceRequestPath(graph, appServer.id, database.id);
  if (!appToDb) {
    return {
      valid: false,
      hint: 'FR-1 (URL Shortening): App server cannot reach database. Need connection: App Server → Database to store URL mappings.',
    };
  }

  return {
    valid: true,
    details: {
      requestPath: [...clientToApp, ...appToDb.slice(1)],
      feature: 'URL Shortening',
      flow: 'POST /shorten → Generate code → Store in DB → Return short URL',
    },
  };
};

/**
 * Validate URL Redirect Feature (TinyURL FR-2)
 * Tests: Client → [CDN] → Cache → App → Database flow for redirects
 */
export const urlRedirectValidator: ValidatorFunction = (graph, scenario) => {
  // For high-traffic redirects, should have caching
  const rps = scenario.traffic.rps;
  const readRatio = scenario.traffic.readWriteRatio || 0.9;

  if (readRatio > 0.8 && rps > 1000) {
    const hasCache = hasComponent(graph, 'redis') || hasComponent(graph, 'memcached');
    if (!hasCache) {
      return {
        valid: false,
        hint: 'FR-2 (URL Redirect): High read traffic (redirects) needs caching to reduce database load. Add Redis/Memcached.',
      };
    }

    // Cache should be between app and database
    const cache = graph.components.find(c => c.type === 'redis' || c.type === 'memcached');
    const appServer = graph.components.find(c => c.type === 'app_server');
    const database = graph.components.find(c => isDatabaseComponentType(c.type));

    if (cache && appServer && database) {
      const hasAppToCache = hasConnection(graph, 'app_server', 'redis') ||
                           hasConnection(graph, 'app_server', 'memcached');

      if (!hasAppToCache) {
        return {
          valid: false,
          hint: 'FR-2 (URL Redirect): App server should check cache before hitting database. Connect App Server → Cache.',
        };
      }
    }
  }

  return {
    valid: true,
    details: {
      feature: 'URL Redirect',
      flow: 'GET /{short_code} → Check cache → [if miss] Query DB → Serve 301 redirect',
    },
  };
};

/**
 * Validate Analytics Feature (TinyURL FR-4)
 * Tests: Async write path for click tracking
 */
export const analyticsTrackingValidator: ValidatorFunction = (graph, scenario) => {
  // Analytics requires either:
  // 1. Message queue for async processing, OR
  // 2. Separate analytics database, OR
  // 3. Time-series database

  const hasQueue = hasComponent(graph, 'kafka') || hasComponent(graph, 'rabbitmq') || hasComponent(graph, 'sqs');
  const hasAnalyticsDB = hasComponent(graph, 'clickhouse') || hasComponent(graph, 'elasticsearch');
  const hasTimeSeriesDB = hasComponent(graph, 'influxdb') || hasComponent(graph, 'timescaledb');

  if (!hasQueue && !hasAnalyticsDB && !hasTimeSeriesDB) {
    return {
      valid: false,
      hint: 'FR-4 (Analytics): Need message queue (Kafka) or analytics database (ClickHouse/Elasticsearch) to track clicks without impacting redirect performance.',
    };
  }

  return {
    valid: true,
    details: {
      feature: 'Analytics Tracking',
      flow: 'On redirect → Publish event to queue → Async processing → Store in analytics DB',
    },
  };
};

/**
 * Validate Photo Upload Feature (Instagram FR-1)
 * Tests: Client → App → Object Storage flow
 */
export const photoUploadValidator: ValidatorFunction = (graph, scenario) => {
  // Must have object storage for photos
  const hasObjectStorage = hasComponent(graph, 's3') ||
                          hasComponent(graph, 'blob_storage') ||
                          hasComponent(graph, 'gcs');

  if (!hasObjectStorage) {
    return {
      valid: false,
      hint: 'FR-1 (Photo Upload): Need object storage (S3/Blob) to store photos and videos. Database is inefficient for large files.',
    };
  }

  // App server should connect to object storage
  const hasAppToStorage = hasConnection(graph, 'app_server', 's3') ||
                         hasConnection(graph, 'app_server', 'blob_storage') ||
                         hasConnection(graph, 'app_server', 'gcs');

  if (!hasAppToStorage) {
    return {
      valid: false,
      hint: 'FR-1 (Photo Upload): App server needs connection to object storage to upload photos. Connect App Server → S3.',
    };
  }

  // Should have database to store metadata
  const hasDB = graph.components.some(c => isDatabaseComponentType(c.type));
  if (!hasDB) {
    return {
      valid: false,
      hint: 'FR-1 (Photo Upload): Need database to store photo metadata (user_id, photo_url, caption, timestamp).',
    };
  }

  return {
    valid: true,
    details: {
      feature: 'Photo Upload',
      flow: 'POST /upload → Store file in S3 → Save metadata to DB → Return photo_id',
    },
  };
};

/**
 * Validate Feed View Feature (Instagram FR-2)
 * Tests: Client → App → Cache → Database flow for timeline
 */
export const feedViewValidator: ValidatorFunction = (graph, scenario) => {
  // Feed is read-heavy, should have caching
  const hasCache = hasComponent(graph, 'redis') || hasComponent(graph, 'memcached');

  if (!hasCache) {
    return {
      valid: false,
      hint: 'FR-2 (Feed View): Timeline/feed is highly cached. Need Redis to cache pre-computed feeds for performance.',
    };
  }

  // Should have CDN for serving photos
  const hasCDN = hasComponent(graph, 'cdn') || hasComponent(graph, 'cloudfront');

  if (!hasCDN) {
    return {
      valid: false,
      hint: 'FR-2 (Feed View): Feed contains many images. CDN reduces latency and bandwidth costs for serving photos globally.',
    };
  }

  // CDN should connect to object storage
  const hasCDNtoStorage = hasConnection(graph, 'cdn', 's3') ||
                         hasConnection(graph, 'cloudfront', 's3') ||
                         hasConnection(graph, 'cdn', 'blob_storage');

  if (hasCDN && !hasCDNtoStorage) {
    return {
      valid: false,
      hint: 'FR-2 (Feed View): CDN should pull images from object storage. Connect CDN → S3.',
    };
  }

  return {
    valid: true,
    details: {
      feature: 'Feed View',
      flow: 'GET /feed → Check Redis for cached feed → [if miss] Query DB → Fetch photos from CDN',
    },
  };
};

/**
 * Generic FR validator that checks basic architecture support
 * Used as fallback when no specific validator exists
 */
export const basicFunctionalValidator: ValidatorFunction = (graph, scenario) => {
  // 1. Must have client entry point
  const hasClient = hasComponent(graph, 'client');
  if (!hasClient) {
    return {
      valid: false,
      hint: 'System needs a client component as entry point for user requests.',
    };
  }

  // 2. Must have compute layer
  const hasCompute = hasComponent(graph, 'app_server') ||
                    hasComponent(graph, 'lambda') ||
                    hasComponent(graph, 'ecs');
  if (!hasCompute) {
    return {
      valid: false,
      hint: 'System needs compute layer (app server) to process requests and implement business logic.',
    };
  }

  // 3. Must have data persistence
  const hasStorage = graph.components.some(c => isDatabaseComponentType(c.type)) ||
                    hasComponent(graph, 's3');
  if (!hasStorage) {
    return {
      valid: false,
      hint: 'System needs storage (database or object storage) to persist data.',
    };
  }

  // 4. Must have path from client to compute
  const client = graph.components.find(c => c.type === 'client');
  const compute = graph.components.find(c =>
    c.type === 'app_server' || c.type === 'lambda' || c.type === 'ecs'
  );

  if (client && compute) {
    const path = traceRequestPath(graph, client.id, compute.id);
    if (!path) {
      return {
        valid: false,
        hint: 'Client cannot reach compute layer. Add Load Balancer or API Gateway between Client and App Server.',
      };
    }
  }

  return {
    valid: true,
    details: {
      feature: 'Basic Functionality',
      flow: 'Client → Compute → Storage (basic CRUD operations)',
    },
  };
};

/**
 * Map problem IDs to feature validators
 */
export const featureValidatorMap: Record<string, ValidatorFunction[]> = {
  'tinyurl': [
    urlShorteningValidator,
    urlRedirectValidator,
    analyticsTrackingValidator,
  ],
  'instagram': [
    photoUploadValidator,
    feedViewValidator,
  ],
  // Add more problem-specific validators here
};

/**
 * Get feature validators for a problem
 */
export function getFeatureValidators(problemId: string): ValidatorFunction[] {
  return featureValidatorMap[problemId] || [basicFunctionalValidator];
}
