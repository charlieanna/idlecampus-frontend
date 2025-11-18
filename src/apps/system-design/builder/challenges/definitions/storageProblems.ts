import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * NoSQL Document Store - Flexible schema for user profiles
 * From extracted-problems/system-design/storage.md
 */
export const nosqlBasicsProblemDefinition: ProblemDefinition = {
  id: 'nosql-basics',
  title: 'NoSQL Document Store',
  description: `Design a user profile system using MongoDB that:
- Stores flexible user profiles with nested preferences
- Handles varying field types and schema evolution
- Supports 20k ops/sec with 100M documents
- Enables complex queries with compound indexes`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for profile service traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for profile API',
      },
      {
        type: 'storage',
        reason: 'Need MongoDB primary for document storage',
      },
      {
        type: 'storage',
        reason: 'Need MongoDB replicas for read scaling',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Profile service connects through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to profile API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries MongoDB shards',
      },
    ],
    dataModel: {
      entities: ['user_profile'],
      fields: {
        user_profile: ['id', 'username', 'email', 'preferences', 'settings', 'metadata'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Profile lookups
        { type: 'write', frequency: 'medium' },          // Profile updates
        { type: 'read_by_query', frequency: 'medium' },  // Complex queries
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
 * Redis-like Key-Value Store - Build a distributed cache
 * From extracted-problems/system-design/storage.md
 */
export const keyValueStoreProblemDefinition: ProblemDefinition = {
  id: 'key-value-store',
  title: 'Redis-like Key-Value Store',
  description: `Design a distributed key-value store like Redis that:
- Supports GET/SET operations with <1ms latency
- Implements LRU eviction and TTL expiration
- Handles 100k ops/sec with 10GB in-memory
- Provides replication for high availability`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need proxy layer for consistent hashing',
      },
      {
        type: 'cache',
        reason: 'Need Redis master nodes for data storage',
      },
      {
        type: 'cache',
        reason: 'Need Redis replicas for read scaling',
      },
      {
        type: 'storage',
        reason: 'Need persistent storage for RDB snapshots',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'App servers connect through proxy',
      },
      {
        from: 'load_balancer',
        to: 'cache',
        reason: 'Proxy routes to Redis masters via consistent hashing',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis masters persist RDB snapshots',
      },
    ],
    dataModel: {
      entities: ['key_value'],
      fields: {
        key_value: ['key', 'value', 'ttl', 'type'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // GET operations
        { type: 'write', frequency: 'very_high' },       // SET operations
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
 * Product Catalog Store - E-commerce product database
 * From extracted-problems/system-design/storage.md
 */
export const productCatalogProblemDefinition: ProblemDefinition = {
  id: 'product-catalog',
  title: 'Product Catalog Store',
  description: `Design a product catalog for e-commerce that:
- Stores 1M products with 10M variants (size, color)
- Supports category hierarchies and faceted search
- Handles 5k reads/sec and 500 writes/sec
- Enables real-time inventory tracking`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for catalog traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for catalog API',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache hot products',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL for product catalog',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch for faceted search',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Shoppers access catalog through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to catalog API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API caches product details',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries PostgreSQL for products',
      },
    ],
    dataModel: {
      entities: ['product', 'variant', 'category', 'inventory'],
      fields: {
        product: ['id', 'name', 'description', 'category_path', 'base_price'],
        variant: ['id', 'product_id', 'size', 'color', 'sku', 'price'],
        inventory: ['variant_id', 'quantity', 'warehouse_id'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Product page views
        { type: 'read_by_query', frequency: 'high' },    // Search and filtering
        { type: 'write', frequency: 'medium' },          // Inventory updates
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
 * Object Storage System - S3-like blob storage
 * From extracted-problems/system-design/storage.md
 */
export const objectStorageSystemProblemDefinition: ProblemDefinition = {
  id: 'object-storage-system',
  title: 'Object Storage System',
  description: `Build an S3-like object storage system that:
- Stores and retrieves large files (1MB-5GB)
- Provides 99.999999999% durability (11 nines)
- Handles 10k file operations/sec
- Supports multipart uploads and CDN integration`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Need CDN for fast file downloads',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for API traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for file API',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 for actual file storage',
      },
      {
        type: 'storage',
        reason: 'Need database for metadata',
      },
      {
        type: 'cache',
        reason: 'Need cache for metadata lookups',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users download files through CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN pulls from origin',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to file API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API caches metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'API stores/retrieves files from S3',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API stores metadata in database',
      },
    ],
    dataModel: {
      entities: ['file', 'bucket'],
      fields: {
        file: ['id', 'bucket_id', 'key', 's3_url', 'size_bytes', 'content_type', 'etag'],
        bucket: ['id', 'name', 'owner_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' },  // File uploads
        { type: 'read_by_key', frequency: 'very_high' },  // File downloads
      ],
    },
  },

  scenarios: generateScenarios('object-storage-system', problemConfigs['object-storage-system']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(nosqlBasicsProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(nosqlBasicsProblemDefinition);
