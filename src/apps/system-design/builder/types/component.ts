/**
 * Component Metrics returned by simulation
 */
export interface ComponentMetrics {
  latency: number; // milliseconds
  errorRate: number; // 0-1
  utilization: number; // 0-1
  cost: number; // monthly cost in dollars

  // Optional component-specific metrics
  cacheHits?: number;
  cacheMisses?: number;
  dbLoad?: number;
  downtime?: number; // seconds
  [key: string]: any;
}

/**
 * Traffic input to component
 */
export interface Traffic {
  rps: number; // requests per second
  readRps?: number;
  writeRps?: number;
  avgResponseSizeMB?: number; // for CDN/S3
}

/**
 * Simulation context (for failure injection, etc.)
 */
export interface SimulationContext {
  testCase?: any;
  currentTime?: number; // seconds into simulation
}

/**
 * Database types available
 */
export type DatabaseType =
  | 'postgresql'
  | 'mysql'
  | 'mongodb'
  | 'couchdb'
  | 'cassandra'
  | 'hbase'
  | 'elasticsearch'
  | 'solr'
  | 'dynamodb'
  | 'keydb';

/**
 * Cache types available
 */
export type CacheType =
  | 'redis'
  | 'memcached'
  | 'elasticache';

/**
 * Database categories (legacy - kept for backward compatibility)
 */
export type DatabaseCategory =
  | 'sql'
  | 'nosql_document'
  | 'nosql_columnar'
  | 'nosql_search'
  | 'nosql_keyvalue';

/**
 * Data model types (DDIA-aligned)
 */
export type DataModel =
  | 'relational'
  | 'document'
  | 'wide-column'
  | 'graph'
  | 'key-value';

/**
 * Component types
 */
export type ComponentType =
  | 'client'
  | 'load_balancer'
  | 'app_server'
  | 'worker'
  | 'database'
  | 'postgresql'
  | 'mysql'
  | 'mongodb'
  | 'couchdb'
  | 'cassandra'
  | 'hbase'
  | 'elasticsearch'
  | 'solr'
  | 'dynamodb'
  | 'keydb'
  | 'redis'
  | 'cache'
  | 'message_queue'
  | 'cdn'
  | 's3';

/**
 * API Route pattern for app servers
 */
export interface APIRoute {
  method: string | '*'; // GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, or *
  path: string; // /api/v1/urls/* or exact path
  description?: string; // Optional description
}

/**
 * Component configuration (user-defined)
 */
export interface ComponentConfig {
  // App server specific configurations
  serviceName?: string; // Display name for the service
  handledAPIs?: string[]; // List of API patterns like "GET /api/v1/urls/*"
  apiRoutes?: APIRoute[]; // Structured API routes (alternative to handledAPIs)
  instances?: number;
  capacityPerInstance?: number;

  // Other configurations
  [key: string]: any;
}

/**
 * Custom logic configuration for components that support it
 */
export interface CustomLogic {
  enabled: boolean;
  pythonCode?: string; // Inline Python code for this specific service
  pythonFile?: string; // Path to Python file
  functionName?: string; // Entry point function
  benchmarkedLatency?: number; // Measured latency from benchmarking
}

/**
 * Component representation in the graph
 */
export interface ComponentNode {
  id: string;
  type: ComponentType;
  config: ComponentConfig;
  customLogic?: CustomLogic; // Optional for components that support custom logic
}
