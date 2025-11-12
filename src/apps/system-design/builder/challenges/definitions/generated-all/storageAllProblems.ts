import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Storage Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 35 problems
 */

/**
 * Basic RDBMS Design
 * From extracted-problems/system-design/storage.md
 */
export const basicDatabaseDesignProblemDefinition: ProblemDefinition = {
  id: 'basic-database-design',
  title: 'Basic RDBMS Design',
  description: `Design a relational database for a blog platform. Learn about normalization, primary/foreign keys, indexes, and basic query optimization.
- Store users, posts, and comments
- Support tags and categories
- Handle user relationships (followers)
- Enable full-text search on posts`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Blog Users (redirect_client) for design tables for a blog system',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for design tables for a blog system',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for design tables for a blog system',
      },
      {
        type: 'storage',
        reason: 'Need MySQL Primary (db_primary) for design tables for a blog system',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Blog Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Blog API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Blog API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Blog API routes to MySQL Primary',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Blog API routes to Read Replicas',
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

  scenarios: generateScenarios('basic-database-design', problemConfigs['basic-database-design']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * NoSQL Document Store
 * From extracted-problems/system-design/storage.md
 */
export const nosqlBasicsProblemDefinition: ProblemDefinition = {
  id: 'nosql-basics',
  title: 'NoSQL Document Store',
  description: `Design a user profile system using MongoDB. Learn about document modeling, embedded vs referenced data, and when to denormalize.
- Store flexible user profiles
- Support nested preferences
- Handle varying field types
- Enable complex queries`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Profile Service (redirect_client) for flexible schema for user profiles',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for flexible schema for user profiles',
      },
      {
        type: 'storage',
        reason: 'Need MongoDB Shard 1 (db_primary) for flexible schema for user profiles',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Profile Service routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Profile API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Profile API routes to MongoDB Shard 1',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Profile API routes to MongoDB Shard 2',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Profile API routes to Config Servers',
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

  scenarios: generateScenarios('nosql-basics', problemConfigs['nosql-basics']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Redis-like Key-Value Store
 * From extracted-problems/system-design/storage.md
 */
export const keyValueStoreProblemDefinition: ProblemDefinition = {
  id: 'key-value-store',
  title: 'Redis-like Key-Value Store',
  description: `Design a distributed key-value store like Redis. Learn about data structures, persistence, replication, and cache eviction policies.
- Support GET/SET operations
- Implement LRU eviction
- Handle string, list, set, hash types
- Provide pub/sub messaging`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Servers (redirect_client) for build a distributed cache',
      },
      {
        type: 'load_balancer',
        reason: 'Need Proxy Layer (lb) for build a distributed cache',
      },
      {
        type: 'cache',
        reason: 'Need Redis Master 1 (cache) for build a distributed cache',
      },
      {
        type: 'storage',
        reason: 'Need RDB Snapshots (db_primary) for build a distributed cache',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'App Servers routes to Proxy Layer',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Proxy Layer routes to Redis Master 1',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Proxy Layer routes to Redis Master 2',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Proxy Layer routes to Redis Master 3',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Master 1 routes to RDB Snapshots',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Master 2 routes to RDB Snapshots',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Master 3 routes to RDB Snapshots',
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

  scenarios: generateScenarios('key-value-store', problemConfigs['key-value-store']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Product Catalog Store
 * From extracted-problems/system-design/storage.md
 */
export const productCatalogProblemDefinition: ProblemDefinition = {
  id: 'product-catalog',
  title: 'Product Catalog Store',
  description: `Design a product catalog for e-commerce. Handle hierarchical categories, variants, inventory, and search.
- Store products with variants (size, color)
- Support category hierarchies
- Track inventory per variant
- Enable faceted search`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Shoppers (redirect_client) for e-commerce product database',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for e-commerce product database',
      },
      {
        type: 'cache',
        reason: 'Need Product Cache (cache) for e-commerce product database',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for e-commerce product database',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Shoppers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Catalog API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Catalog API routes to Product Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Catalog API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Catalog API routes to Elasticsearch',
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

  scenarios: generateScenarios('product-catalog', problemConfigs['product-catalog']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Metrics Time-Series DB
 * From extracted-problems/system-design/storage.md
 */
export const timeSeriesMetricsProblemDefinition: ProblemDefinition = {
  id: 'time-series-metrics',
  title: 'Metrics Time-Series DB',
  description: `Design a metrics database for monitoring. Learn about time-series optimization, downsampling, and retention policies.
- Ingest metrics at high rate
- Store with microsecond precision
- Support aggregation queries
- Implement retention policies`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for store application metrics',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for store application metrics',
      },
      {
        type: 'storage',
        reason: 'Need InfluxDB (db_primary) for store application metrics',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Services routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Collector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Collector routes to InfluxDB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Compaction routes to InfluxDB',
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

  scenarios: generateScenarios('time-series-metrics', problemConfigs['time-series-metrics']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Session Storage System
 * From extracted-problems/system-design/storage.md
 */
export const sessionStoreProblemDefinition: ProblemDefinition = {
  id: 'session-store',
  title: 'Session Storage System',
  description: `Design a distributed session store. Handle session creation, validation, and expiration with high availability.
- Create and validate sessions
- Support session TTL
- Handle concurrent logins
- Enable session revocation`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web Servers (redirect_client) for manage user sessions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for manage user sessions',
      },
      {
        type: 'cache',
        reason: 'Need Redis Cluster (cache) for manage user sessions',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for manage user sessions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Web Servers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'cache',
        reason: 'LB routes to Redis Cluster',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Cluster routes to PostgreSQL',
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

  scenarios: generateScenarios('session-store', problemConfigs['session-store']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * File Metadata Store
 * From extracted-problems/system-design/storage.md
 */
export const fileMetadataStoreProblemDefinition: ProblemDefinition = {
  id: 'file-metadata-store',
  title: 'File Metadata Store',
  description: `Design a metadata store for a distributed file system. Handle directory hierarchies, permissions, and file attributes.
- Store file and directory metadata
- Support hierarchical paths
- Track permissions and ownership
- Enable quick path lookups`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need FS Clients (redirect_client) for manage file system metadata',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for manage file system metadata',
      },
      {
        type: 'cache',
        reason: 'Need Path Cache (cache) for manage file system metadata',
      },
      {
        type: 'storage',
        reason: 'Need MySQL Sharded (db_primary) for manage file system metadata',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'FS Clients routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Metadata Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Metadata Service routes to Path Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Metadata Service routes to MySQL Sharded',
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

  scenarios: generateScenarios('file-metadata-store', problemConfigs['file-metadata-store']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Configuration Management Store
 * From extracted-problems/system-design/storage.md
 */
export const configManagementProblemDefinition: ProblemDefinition = {
  id: 'config-management',
  title: 'Configuration Management Store',
  description: `Design a configuration management system. Support versioning, rollback, and real-time updates to services.
- Store key-value configurations
- Support versioning and rollback
- Enable environment-specific configs
- Provide audit trail`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for centralized config service',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for centralized config service',
      },
      {
        type: 'cache',
        reason: 'Need Config Cache (cache) for centralized config service',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for centralized config service',
      },
      {
        type: 'message_queue',
        reason: 'Need Update Queue (queue) for centralized config service',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Services routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Config API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Config API routes to Config Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Config API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Config API routes to Update Queue',
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

  scenarios: generateScenarios('config-management', problemConfigs['config-management']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * E-commerce Order Database
 * From extracted-problems/system-design/storage.md
 */
export const ecommerceOrderDbProblemDefinition: ProblemDefinition = {
  id: 'ecommerce-order-db',
  title: 'E-commerce Order Database',
  description: `Design a sharded order database for e-commerce. Handle high write rates, complex queries, and maintain consistency.
- Store orders with line items
- Support order status tracking
- Handle inventory reservations
- Enable customer order history`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Customers (redirect_client) for sharded order management',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for sharded order management',
      },
      {
        type: 'storage',
        reason: 'Need Shard 1 (db_primary) for sharded order management',
      },
      {
        type: 'cache',
        reason: 'Need Order Cache (cache) for sharded order management',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Queue (queue) for sharded order management',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Customers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Order Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 1',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 2',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 3',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 4',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Order Service routes to Order Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Order Service routes to Event Queue',
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

  scenarios: generateScenarios('ecommerce-order-db', problemConfigs['ecommerce-order-db']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Social Network Graph Database
 * From extracted-problems/system-design/storage.md
 */
export const socialGraphDbProblemDefinition: ProblemDefinition = {
  id: 'social-graph-db',
  title: 'Social Network Graph Database',
  description: `Design a graph database for social connections. Support friend relationships, activity feeds, and graph traversal queries.
- Store user profiles and connections
- Support bidirectional friendships
- Generate personalized feeds
- Find mutual friends`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for friend connections and feeds',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for friend connections and feeds',
      },
      {
        type: 'cache',
        reason: 'Need Graph Cache (cache) for friend connections and feeds',
      },
      {
        type: 'storage',
        reason: 'Need Neo4j Cluster (db_primary) for friend connections and feeds',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Social API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Social API routes to Graph Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Social API routes to Neo4j Cluster',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Social API routes to User Search',
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

  scenarios: generateScenarios('social-graph-db', problemConfigs['social-graph-db']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Analytics Data Warehouse
 * From extracted-problems/system-design/storage.md
 */
export const analyticsWarehouseProblemDefinition: ProblemDefinition = {
  id: 'analytics-warehouse',
  title: 'Analytics Data Warehouse',
  description: `Design an analytics warehouse with columnar storage. Optimize for complex aggregations and large scans.
- Store clickstream and event data
- Support complex aggregations
- Enable dimensional modeling
- Provide fast group-by queries`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Data Sources (redirect_client) for columnar storage for analytics',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for columnar storage for analytics',
      },
      {
        type: 'storage',
        reason: 'Need ClickHouse (db_primary) for columnar storage for analytics',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Data Sources routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to ETL Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ETL Workers routes to ClickHouse',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query Engine routes to ClickHouse',
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

  scenarios: generateScenarios('analytics-warehouse', problemConfigs['analytics-warehouse']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multi-Tenant SaaS Database
 * From extracted-problems/system-design/storage.md
 */
export const multiTenantSaasProblemDefinition: ProblemDefinition = {
  id: 'multi-tenant-saas',
  title: 'Multi-Tenant SaaS Database',
  description: `Design a multi-tenant database with proper isolation. Balance shared resources with tenant-specific requirements.
- Isolate tenant data
- Support custom schemas per tenant
- Handle varying tenant sizes
- Provide per-tenant backups`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Tenant Apps (redirect_client) for tenant isolation and scaling',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for tenant isolation and scaling',
      },
      {
        type: 'cache',
        reason: 'Need Tenant Router (cache) for tenant isolation and scaling',
      },
      {
        type: 'storage',
        reason: 'Need Large Tenants (db_primary) for tenant isolation and scaling',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Tenant Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Tenant Router',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Large Tenants',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Small Tenants',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Large Tenants routes to Replicas',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Small Tenants routes to Replicas',
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

  scenarios: generateScenarios('multi-tenant-saas', problemConfigs['multi-tenant-saas']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Inventory Management System
 * From extracted-problems/system-design/storage.md
 */
export const inventoryManagementProblemDefinition: ProblemDefinition = {
  id: 'inventory-management',
  title: 'Inventory Management System',
  description: `Design an Amazon-scale inventory system managing 10B SKUs across 5000+ fulfillment centers globally. Must handle 1M reservations/sec (10M during Prime Day), prevent overselling with <10ms latency, survive regional failures, and maintain perfect inventory accuracy. Support real-time inventory transfers, predictive restocking using ML, and operate within $50M/month budget while handling $1T+ inventory value.
- Track 10B SKUs across 5000+ fulfillment centers
- Process 1M reservations/sec (10M Prime Day)
- Distributed locks preventing any overselling
- ML-based predictive restocking across regions`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Order Systems (redirect_client) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'cache',
        reason: 'Need Redis Locks (cache) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Queue (queue) for amazon-scale 10b skus real-time inventory',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Order Systems routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Inventory API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory API routes to Redis Locks',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Inventory API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Inventory API routes to Event Queue',
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

  scenarios: generateScenarios('inventory-management', problemConfigs['inventory-management']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * CMS with Media Storage
 * From extracted-problems/system-design/storage.md
 */
export const cmsMediaStorageProblemDefinition: ProblemDefinition = {
  id: 'cms-media-storage',
  title: 'CMS with Media Storage',
  description: `Design a CMS with separate storage for metadata and media. Handle large files, CDN integration, and content versioning.
- Store articles and media metadata
- Handle large media uploads
- Support content versioning
- Enable CDN distribution`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Readers (redirect_client) for content and media management',
      },
      {
        type: 'cdn',
        reason: 'Need Media CDN (cdn) for content and media management',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for content and media management',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for content and media management',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 (storage) for content and media management',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Readers routes to Media CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Media CDN routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to CMS API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'CMS API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'CMS API routes to S3',
      },
      {
        from: 'object_storage',
        to: 'cdn',
        reason: 'S3 routes to Media CDN',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'S3 routes to Image Processor',
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

  scenarios: generateScenarios('cms-media-storage', problemConfigs['cms-media-storage']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Banking Transaction Database
 * From extracted-problems/system-design/storage.md
 */
export const bankingTransactionDbProblemDefinition: ProblemDefinition = {
  id: 'banking-transaction-db',
  title: 'Banking Transaction Database',
  description: `Design a JPMorgan/Bank of America-scale transaction system processing 100M transactions/sec globally with perfect ACID guarantees. Must handle market crashes (1000x spikes), maintain zero data loss even during datacenter failures, meet Basel III regulations, and operate within $500M/month budget. Support real-time fraud detection, instant international transfers, and coordinate with 10k+ partner banks while ensuring complete regulatory compliance.
- Process 100M transactions/sec (1B during crises)
- Zero tolerance for data loss or inconsistency
- Real-time fraud detection on every transaction
- Instant cross-border transfers to 200+ countries`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Banking Apps (redirect_client) for jpmorgan-scale 100m transactions/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for jpmorgan-scale 100m transactions/sec',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for jpmorgan-scale 100m transactions/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Banking Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Transaction Service',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Transaction Service routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transaction Service routes to Read Replicas',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'PostgreSQL routes to Archive',
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

  scenarios: generateScenarios('banking-transaction-db', problemConfigs['banking-transaction-db']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Healthcare Records System
 * From extracted-problems/system-design/storage.md
 */
export const healthcareRecordsProblemDefinition: ProblemDefinition = {
  id: 'healthcare-records',
  title: 'Healthcare Records System',
  description: `Design a healthcare records system with HIPAA compliance. Handle patient data, access controls, and audit logging.
- Store patient medical records
- Enforce role-based access control
- Track all data access
- Support data encryption at rest and in transit`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need EHR Systems (redirect_client) for hipaa-compliant medical records',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for hipaa-compliant medical records',
      },
      {
        type: 'storage',
        reason: 'Need Encrypted PostgreSQL (db_primary) for hipaa-compliant medical records',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log Queue (queue) for hipaa-compliant medical records',
      },
      {
        type: 'object_storage',
        reason: 'Need Encrypted S3 (storage) for hipaa-compliant medical records',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'EHR Systems routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Records API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Records API routes to Encrypted PostgreSQL',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Records API routes to Audit Log Queue',
      },
      {
        from: 'storage',
        to: 'object_storage',
        reason: 'Encrypted PostgreSQL routes to Encrypted S3',
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

  scenarios: generateScenarios('healthcare-records', problemConfigs['healthcare-records']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * IoT Time-Series Store
 * From extracted-problems/system-design/storage.md
 */
export const iotTimeSeriesProblemDefinition: ProblemDefinition = {
  id: 'iot-time-series',
  title: 'IoT Time-Series Store',
  description: `Design an IoT time-series database with aggressive compression. Handle millions of devices sending telemetry.
- Ingest sensor data from millions of devices
- Apply delta and run-length compression
- Support time-range queries
- Enable aggregation by device/sensor`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Devices (redirect_client) for compressed sensor data storage',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for compressed sensor data storage',
      },
      {
        type: 'storage',
        reason: 'Need TimescaleDB (db_primary) for compressed sensor data storage',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for compressed sensor data storage',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'IoT Devices routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Compression',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Compression routes to TimescaleDB',
      },
      {
        from: 'storage',
        to: 'cache',
        reason: 'TimescaleDB routes to Query Cache',
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

  scenarios: generateScenarios('iot-time-series', problemConfigs['iot-time-series']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Gaming Leaderboard Database
 * From extracted-problems/system-design/storage.md
 */
export const gamingLeaderboardProblemDefinition: ProblemDefinition = {
  id: 'gaming-leaderboard',
  title: 'Gaming Leaderboard Database',
  description: `Design a real-time gaming leaderboard. Handle score updates, rank queries, and global/regional leaderboards.
- Update player scores in real-time
- Query player rank by score
- Retrieve top N players
- Support multiple leaderboards`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Servers (redirect_client) for real-time rankings and scores',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for real-time rankings and scores',
      },
      {
        type: 'cache',
        reason: 'Need Redis Sorted Sets (cache) for real-time rankings and scores',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for real-time rankings and scores',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Game Servers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Score API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Score API routes to Redis Sorted Sets',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Sorted Sets routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Snapshot Worker routes to Redis Sorted Sets',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Snapshot Worker routes to PostgreSQL',
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

  scenarios: generateScenarios('gaming-leaderboard', problemConfigs['gaming-leaderboard']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Booking/Reservation System
 * From extracted-problems/system-design/storage.md
 */
export const bookingReservationProblemDefinition: ProblemDefinition = {
  id: 'booking-reservation',
  title: 'Booking/Reservation System',
  description: `Design a booking system for hotels/flights. Prevent double-booking with proper concurrency control.
- Check availability in real-time
- Reserve resources atomically
- Handle concurrent booking attempts
- Support hold/release of reservations`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Booking Apps (redirect_client) for prevent double-booking conflicts',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for prevent double-booking conflicts',
      },
      {
        type: 'cache',
        reason: 'Need Redis Locks (cache) for prevent double-booking conflicts',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for prevent double-booking conflicts',
      },
      {
        type: 'message_queue',
        reason: 'Need Waitlist (queue) for prevent double-booking conflicts',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Booking Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Reservation API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Reservation API routes to Redis Locks',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Reservation API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Reservation API routes to Waitlist',
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

  scenarios: generateScenarios('booking-reservation', problemConfigs['booking-reservation']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Audit Trail Database
 * From extracted-problems/system-design/storage.md
 */
export const auditTrailProblemDefinition: ProblemDefinition = {
  id: 'audit-trail',
  title: 'Audit Trail Database',
  description: `Design an append-only audit trail. Ensure immutability, support compliance queries, and handle high write rates.
- Log all system events
- Guarantee immutability
- Support time-range queries
- Enable filtering by entity/action`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for append-only event log',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for append-only event log',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (db_primary) for append-only event log',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Glacier (storage) for append-only event log',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Services routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Indexer',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Indexer routes to Elasticsearch',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Indexer routes to S3 Glacier',
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

  scenarios: generateScenarios('audit-trail', problemConfigs['audit-trail']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Index Storage
 * From extracted-problems/system-design/storage.md
 */
export const searchIndexStorageProblemDefinition: ProblemDefinition = {
  id: 'search-index-storage',
  title: 'Search Index Storage',
  description: `Design a search index storage system. Handle document indexing, query processing, and relevance ranking.
- Index documents with full-text
- Support boolean queries
- Rank results by relevance
- Handle typos and synonyms`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Search Users (redirect_client) for inverted index for full-text search',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for inverted index for full-text search',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for inverted index for full-text search',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for inverted index for full-text search',
      },
      {
        type: 'message_queue',
        reason: 'Need Index Queue (queue) for inverted index for full-text search',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Search Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Search API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Search API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Search API routes to Elasticsearch',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Search API routes to Index Queue',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Index Queue routes to Elasticsearch',
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

  scenarios: generateScenarios('search-index-storage', problemConfigs['search-index-storage']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * ML Model Registry
 * From extracted-problems/system-design/storage.md
 */
export const mlModelRegistryProblemDefinition: ProblemDefinition = {
  id: 'ml-model-registry',
  title: 'ML Model Registry',
  description: `Design an ML model registry. Store model artifacts, track versions, and manage deployment metadata.
- Store model binaries and weights
- Track model versions and lineage
- Store experiment metadata
- Enable model comparison`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need ML Engineers (redirect_client) for versioned model artifacts',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for versioned model artifacts',
      },
      {
        type: 'cache',
        reason: 'Need Metadata Cache (cache) for versioned model artifacts',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for versioned model artifacts',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 (storage) for versioned model artifacts',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'ML Engineers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Registry API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Registry API routes to Metadata Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Registry API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Registry API routes to S3',
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

  scenarios: generateScenarios('ml-model-registry', problemConfigs['ml-model-registry']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * API Rate Limit Counters
 * From extracted-problems/system-design/storage.md
 */
export const rateLimitCountersProblemDefinition: ProblemDefinition = {
  id: 'rate-limit-counters',
  title: 'API Rate Limit Counters',
  description: `Design a distributed rate limiter. Track API usage per user/IP with sliding windows and token buckets.
- Track requests per time window
- Support multiple rate limit tiers
- Handle burst traffic
- Provide real-time quota checks`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Gateway (redirect_client) for distributed rate limiting',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for distributed rate limiting',
      },
      {
        type: 'cache',
        reason: 'Need Redis Counters (cache) for distributed rate limiting',
      },
      {
        type: 'storage',
        reason: 'Need Limit Config (db_primary) for distributed rate limiting',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Gateway routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Rate Limiter',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Rate Limiter routes to Redis Counters',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Rate Limiter routes to Limit Config',
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

  scenarios: generateScenarios('rate-limit-counters', problemConfigs['rate-limit-counters']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Distributed SQL Database
 * From extracted-problems/system-design/storage.md
 */
export const distributedDatabaseProblemDefinition: ProblemDefinition = {
  id: 'distributed-database',
  title: 'Distributed SQL Database',
  description: `Design a Google Spanner-scale distributed SQL database handling 10M transactions/sec across 100+ regions with perfect ACID guarantees. Must survive entire continent failures, maintain <5ms P99 latency within regions, support 1PB+ datasets, and operate within $100M/month budget. Implement TrueTime for global consistency, automatic resharding, and seamless schema evolution while serving mission-critical workloads for 1B+ users.
- Process 10M transactions/sec globally
- Distribute across 100+ regions with auto-sharding
- TrueTime-based global consistency
- Zero-downtime schema migrations at scale`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Clients (redirect_client) for google spanner-scale 10m tps globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Global LB (lb) for google spanner-scale 10m tps globally',
      },
      {
        type: 'storage',
        reason: 'Need US Region (db_primary) for google spanner-scale 10m tps globally',
      },
      {
        type: 'message_queue',
        reason: 'Need CDC Stream (stream) for google spanner-scale 10m tps globally',
      },
      {
        type: 'cache',
        reason: 'Need Read Cache (cache) for google spanner-scale 10m tps globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Clients routes to Global LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Global LB routes to Data API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Data API routes to US Region',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Data API routes to EU Region',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Data API routes to APAC Region',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'US Region routes to CDC Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'EU Region routes to CDC Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'APAC Region routes to CDC Stream',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Data API routes to Read Cache',
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

  scenarios: generateScenarios('distributed-database', problemConfigs['distributed-database']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Video/Image CDN Storage
 * From extracted-problems/system-design/storage.md
 */
export const contentDeliveryStorageProblemDefinition: ProblemDefinition = {
  id: 'content-delivery-storage',
  title: 'Video/Image CDN Storage',
  description: `Design a multi-tier storage system for a video/image CDN. Implement hot/warm/cold tiers based on access patterns, with automatic tier migration and cost optimization.
- Store videos and images
- Auto-migrate to cold storage after 30 days
- Restore from cold storage on demand
- Generate multiple resolutions`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for multi-tier storage for media delivery',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for multi-tier storage for media delivery',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for multi-tier storage for media delivery',
      },
      {
        type: 'cache',
        reason: 'Need Metadata Cache (cache) for multi-tier storage for media delivery',
      },
      {
        type: 'object_storage',
        reason: 'Need Hot Tier (S3 Standard) (object_store) for multi-tier storage for media delivery',
      },
      {
        type: 'message_queue',
        reason: 'Need Tiering Queue (queue) for multi-tier storage for media delivery',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Users routes to CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Media API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Media API routes to Metadata Cache',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Media API routes to Hot Tier (S3 Standard)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Media API routes to Warm Tier (S3 IA)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Media API routes to Cold Tier (Glacier)',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Tiering Queue routes to Tier Migration',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Tier Migration routes to Hot Tier (S3 Standard)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Tier Migration routes to Warm Tier (S3 IA)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tier Migration routes to Cold Tier (Glacier)',
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

  scenarios: generateScenarios('content-delivery-storage', problemConfigs['content-delivery-storage']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Amazon DynamoDB Clone
 * From extracted-problems/system-design/storage.md
 */
export const multiModelDatabaseProblemDefinition: ProblemDefinition = {
  id: 'multi-model-database',
  title: 'Amazon DynamoDB Clone',
  description: `Design an AWS DynamoDB-scale database handling 100M requests/sec globally across all data models (KV, document, graph, time-series). Must support 10PB+ storage with <1ms P99 latency, survive multiple region failures, auto-scale from 0 to millions QPS in seconds, and operate within $200M/month budget. Implement adaptive capacity, global tables with millisecond replication, and support 100k+ concurrent streams while serving Netflix, Lyft, and Airbnb scale workloads.
- Support 100M requests/sec across all models
- Store 10PB+ with automatic sharding
- Global tables with <100ms replication
- Auto-scale from 0 to 10M QPS in 60 seconds`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Applications (redirect_client) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'cache',
        reason: 'Need Edge Cache (cdn) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Request LB (lb) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'storage',
        reason: 'Need Storage Nodes (db_primary) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'message_queue',
        reason: 'Need Change Streams (stream) for dynamodb-scale 100m requests/sec globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cache',
        reason: 'Applications routes to Edge Cache',
      },
      {
        from: 'cache',
        to: 'load_balancer',
        reason: 'Edge Cache routes to Request LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Request LB routes to Request Router',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Request Router routes to Item Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Request Router routes to Storage Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Storage Nodes routes to Global Tables',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Storage Nodes routes to Change Streams',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Change Streams routes to Auto Scaler',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Auto Scaler routes to Storage Nodes',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Change Streams routes to Backup Queue',
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

  scenarios: generateScenarios('multi-model-database', problemConfigs['multi-model-database']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Distributed Transactions (2PC/3PC)
 * From extracted-problems/system-design/storage.md
 */
export const distributedTransactionsProblemDefinition: ProblemDefinition = {
  id: 'distributed-transactions',
  title: 'Distributed Transactions (2PC/3PC)',
  description: `Implement Visa/Google-scale distributed transactions processing 10M cross-shard transactions/sec across 10k+ database shards globally. Must guarantee ACID even during network partitions, handle coordinator failures in <100ms, survive entire datacenter losses, and operate within $300M/month budget. Support Spanner-style TrueTime, Percolator-style 2PC optimization, and coordinate transactions spanning 100+ shards while maintaining perfect consistency.
- Execute 10M cross-shard transactions/sec
- Coordinate across 10k+ database shards globally
- Spanner-style TrueTime for global ordering
- Percolator optimization for 2PC at scale`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Applications (redirect_client) for visa-scale 10m cross-shard tps',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for visa-scale 10m cross-shard tps',
      },
      {
        type: 'message_queue',
        reason: 'Need Tx Log (Kafka) (queue) for visa-scale 10m cross-shard tps',
      },
      {
        type: 'storage',
        reason: 'Need Shard 1 (db_primary) for visa-scale 10m cross-shard tps',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Applications routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Tx Coordinator',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Backup Coordinators',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Tx Coordinator routes to Tx Log (Kafka)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard 1',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard 2',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard 3',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard N',
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

  scenarios: generateScenarios('distributed-transactions', problemConfigs['distributed-transactions']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multi-Master Replication
 * From extracted-problems/system-design/storage.md
 */
export const multiMasterReplicationProblemDefinition: ProblemDefinition = {
  id: 'multi-master-replication',
  title: 'Multi-Master Replication',
  description: `Design a multi-master replicated database. Handle write conflicts, implement CRDTs, and provide eventual consistency with causal ordering.
- Accept writes at any replica
- Detect and resolve conflicts automatically
- Propagate changes between replicas
- Maintain causal consistency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Clients (redirect_client) for conflict-free replicated data',
      },
      {
        type: 'load_balancer',
        reason: 'Need Geo LB (lb) for conflict-free replicated data',
      },
      {
        type: 'storage',
        reason: 'Need Master US (db_primary) for conflict-free replicated data',
      },
      {
        type: 'message_queue',
        reason: 'Need Replication Log (stream) for conflict-free replicated data',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Clients routes to Geo LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to Conflict Resolver',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master US',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master EU',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master APAC',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master SA',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master US routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master EU routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master APAC routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master SA routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replication Log routes to Merge Workers',
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

  scenarios: generateScenarios('multi-master-replication', problemConfigs['multi-master-replication']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Global Inventory with Strong Consistency
 * From extracted-problems/system-design/storage.md
 */
export const globalInventoryStrongProblemDefinition: ProblemDefinition = {
  id: 'global-inventory-strong',
  title: 'Global Inventory with Strong Consistency',
  description: `Design a globally distributed inventory system with strong consistency. Prevent overselling across continents while maintaining low latency.
- Maintain globally consistent stock counts
- Support atomic cross-region transfers
- Prevent overselling under any partition
- Provide linearizable reads`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Warehouses (redirect_client) for globally consistent stock levels',
      },
      {
        type: 'load_balancer',
        reason: 'Need Global LB (lb) for globally consistent stock levels',
      },
      {
        type: 'cache',
        reason: 'Need Read Cache (cache) for globally consistent stock levels',
      },
      {
        type: 'storage',
        reason: 'Need US Zone (db_primary) for globally consistent stock levels',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log (queue) for globally consistent stock levels',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Warehouses routes to Global LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Global LB routes to Inventory Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory Service routes to Read Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Inventory Service routes to Tx Coordinators',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to US Zone',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to EU Zone',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to APAC Zone',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to Audit Log',
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

  scenarios: generateScenarios('global-inventory-strong', problemConfigs['global-inventory-strong']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Financial Ledger (Strict ACID)
 * From extracted-problems/system-design/storage.md
 */
export const financialLedgerProblemDefinition: ProblemDefinition = {
  id: 'financial-ledger',
  title: 'Financial Ledger (Strict ACID)',
  description: `Design a financial ledger with strict ACID, double-entry bookkeeping, and regulatory compliance. Handle high-value transactions with zero data loss.
- Implement double-entry bookkeeping
- Ensure zero balance drift
- Provide immutable audit trail
- Support complex transaction types`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Financial Apps (redirect_client) for immutable financial transactions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for immutable financial transactions',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Log (Kafka) (queue) for immutable financial transactions',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for immutable financial transactions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Financial Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Ledger Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Ledger Service routes to Event Log (Kafka)',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Event Log (Kafka) routes to PostgreSQL',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'PostgreSQL routes to Read Replicas',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Log (Kafka) routes to Balance Projector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Balance Projector routes to PostgreSQL',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Log (Kafka) routes to WORM Storage',
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

  scenarios: generateScenarios('financial-ledger', problemConfigs['financial-ledger']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Blockchain State Database
 * From extracted-problems/system-design/storage.md
 */
export const blockchainStateDbProblemDefinition: ProblemDefinition = {
  id: 'blockchain-state-db',
  title: 'Blockchain State Database',
  description: `Design a blockchain state database with Merkle trees. Support efficient state transitions, proofs, and historical queries.
- Store account balances and smart contract state
- Generate Merkle proofs for state
- Support state snapshots
- Enable fast state root calculation`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Blockchain Nodes (redirect_client) for merkle tree state storage',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for merkle tree state storage',
      },
      {
        type: 'cache',
        reason: 'Need State Cache (cache) for merkle tree state storage',
      },
      {
        type: 'storage',
        reason: 'Need LevelDB (db_primary) for merkle tree state storage',
      },
      {
        type: 'object_storage',
        reason: 'Need Snapshot S3 (storage) for merkle tree state storage',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Blockchain Nodes routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to State Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'State Service routes to State Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'State Service routes to LevelDB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Pruning Workers routes to LevelDB',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Pruning Workers routes to Snapshot S3',
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

  scenarios: generateScenarios('blockchain-state-db', problemConfigs['blockchain-state-db']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time Gaming State Sync
 * From extracted-problems/system-design/storage.md
 */
export const realtimeGamingStateProblemDefinition: ProblemDefinition = {
  id: 'realtime-gaming-state',
  title: 'Real-time Gaming State Sync',
  description: `Design a real-time gaming state synchronization system. Handle player positions, actions, and game state with <50ms latency globally.
- Sync player positions in real-time
- Handle 100+ players per game session
- Resolve conflicting actions
- Support lag compensation`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Clients (redirect_client) for sub-50ms state synchronization',
      },
      {
        type: 'cdn',
        reason: 'Need Edge PoPs (cdn) for sub-50ms state synchronization',
      },
      {
        type: 'load_balancer',
        reason: 'Need Session LB (lb) for sub-50ms state synchronization',
      },
      {
        type: 'cache',
        reason: 'Need Session State (cache) for sub-50ms state synchronization',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Log (stream) for sub-50ms state synchronization',
      },
      {
        type: 'storage',
        reason: 'Need Match DB (db_primary) for sub-50ms state synchronization',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Game Clients routes to Edge PoPs',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Edge PoPs routes to Session LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Session LB routes to Game Servers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Game Servers routes to Session State',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Game Servers routes to Event Log',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Event Log routes to Match DB',
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

  scenarios: generateScenarios('realtime-gaming-state', problemConfigs['realtime-gaming-state']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Autonomous Vehicle Map Database
 * From extracted-problems/system-design/storage.md
 */
export const autonomousVehicleMapProblemDefinition: ProblemDefinition = {
  id: 'autonomous-vehicle-map',
  title: 'Autonomous Vehicle Map Database',
  description: `Design a map database for autonomous vehicles. Store HD maps, handle real-time updates, and support sub-meter precision queries.
- Store HD map data with cm precision
- Support spatial queries (nearby objects)
- Handle real-time map updates
- Provide versioned map tiles`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Vehicles (redirect_client) for high-precision spatial database',
      },
      {
        type: 'cdn',
        reason: 'Need Map CDN (cdn) for high-precision spatial database',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for high-precision spatial database',
      },
      {
        type: 'cache',
        reason: 'Need Tile Cache (cache) for high-precision spatial database',
      },
      {
        type: 'storage',
        reason: 'Need PostGIS (db_primary) for high-precision spatial database',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Tiles (storage) for high-precision spatial database',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Vehicles routes to Map CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Map CDN routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Map API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Map API routes to Tile Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Map API routes to PostGIS',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Map API routes to S3 Tiles',
      },
      {
        from: 'object_storage',
        to: 'cdn',
        reason: 'S3 Tiles routes to Map CDN',
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

  scenarios: generateScenarios('autonomous-vehicle-map', problemConfigs['autonomous-vehicle-map']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Petabyte-Scale Data Lake
 * From extracted-problems/system-design/storage.md
 */
export const petabyteDataLakeProblemDefinition: ProblemDefinition = {
  id: 'petabyte-data-lake',
  title: 'Petabyte-Scale Data Lake',
  description: `Design a petabyte-scale data lake. Handle diverse data formats, enable efficient analytics, and support both batch and streaming ingestion.
- Ingest data from 1000s of sources
- Store raw, processed, and curated data
- Support multiple file formats (Parquet, ORC, Avro)
- Enable schema evolution`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Data Sources (redirect_client) for exabyte-ready data lake',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for exabyte-ready data lake',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Data Lake (storage) for exabyte-ready data lake',
      },
      {
        type: 'storage',
        reason: 'Need Hive Metastore (db_primary) for exabyte-ready data lake',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Data Sources routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to ETL Workers',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'ETL Workers routes to S3 Data Lake',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ETL Workers routes to Hive Metastore',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'S3 Data Lake routes to Data Catalog',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Hive Metastore routes to Data Catalog',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Query Engine routes to S3 Data Lake',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query Engine routes to Hive Metastore',
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

  scenarios: generateScenarios('petabyte-data-lake', problemConfigs['petabyte-data-lake']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * AWS EBS-like Block Storage
 * From extracted-problems/system-design/storage.md
 */
export const blockStorageProblemDefinition: ProblemDefinition = {
  id: 'block-storage',
  title: 'AWS EBS-like Block Storage',
  description: `Design a distributed block storage system like AWS EBS. Provide durable volumes attached to compute instances, support snapshots, replication, and handle failures gracefully.
- Attach volumes to compute instances
- Replicate blocks across availability zones
- Create point-in-time snapshots
- Restore volumes from snapshots`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need VMs (redirect_client) for network-attached block storage with snapshots',
      },
      {
        type: 'load_balancer',
        reason: 'Need Volume Router (lb) for network-attached block storage with snapshots',
      },
      {
        type: 'cache',
        reason: 'Need Block Cache (cache) for network-attached block storage with snapshots',
      },
      {
        type: 'storage',
        reason: 'Need Volume Metadata (db_primary) for network-attached block storage with snapshots',
      },
      {
        type: 'object_storage',
        reason: 'Need Snapshot Storage (object_store) for network-attached block storage with snapshots',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'VMs routes to Volume Router',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Volume Router routes to Primary Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Replica Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Replica Nodes 2',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Primary Nodes routes to Block Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Volume Metadata',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Snapshot Workers routes to Snapshot Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Snapshot Workers',
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

  scenarios: generateScenarios('block-storage', problemConfigs['block-storage']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

