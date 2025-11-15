/**
 * Database Configuration Validation Tests
 *
 * Tests for various database types and their configurations:
 * - PostgreSQL (relational)
 * - MongoDB (document)
 * - Redis (key-value)
 * - Cassandra (wide-column)
 * - DynamoDB (key-value)
 * - Elasticsearch (search)
 *
 * Each database might have different configuration requirements
 */

import { describe, it, expect } from 'vitest';
import { validateConnections, componentTypesToAPIs } from '../services/connectionValidator';
import { SystemGraph } from '../types/graph';

describe('Database Configuration Validation', () => {
  describe('PostgreSQL Configuration Paths', () => {
    it('should validate connection to PostgreSQL with standard config', () => {
      const code = `
def shorten(url: str, context) -> str:
    context.db.execute("INSERT INTO urls (code, url) VALUES (%s, %s)", (code, url))
    return code
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'pg',
            type: 'postgresql',
            config: {
              host: 'localhost',
              port: 5432,
              database: 'tinyurl',
              username: 'user',
              password: 'pass',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'pg' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      expect(result.connectedAPIs).toContain('db');
    });

    it('should validate connection to PostgreSQL with connection string', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'pg',
            type: 'postgresql',
            config: {
              connectionString: 'postgresql://user:pass@localhost:5432/tinyurl',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'pg' }],
      };

      const result = validateConnections('context.db.query(sql)', graph);
      expect(result.valid).toBe(true);
    });

    it('should validate connection to PostgreSQL with read replicas', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'pg_primary',
            type: 'postgresql',
            config: {
              role: 'primary',
              host: 'pg-primary.example.com',
            },
          },
          {
            id: 'pg_replica',
            type: 'postgresql',
            config: {
              role: 'replica',
              host: 'pg-replica.example.com',
            },
          },
        ],
        connections: [
          { from: 'app_server', to: 'pg_primary' },
          { from: 'app_server', to: 'pg_replica' },
        ],
      };

      const result = validateConnections('context.db.select(query)', graph);
      expect(result.valid).toBe(true);
      // Both connections satisfy the db requirement
    });
  });

  describe('MongoDB Configuration Paths', () => {
    it('should validate connection to MongoDB with standard config', () => {
      const code = `
context.db.insert_one({"url": url, "code": code})
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'mongo',
            type: 'mongodb',
            config: {
              host: 'localhost',
              port: 27017,
              database: 'tinyurl',
              collection: 'urls',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'mongo' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should validate connection to MongoDB with replica set', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'mongo',
            type: 'mongodb',
            config: {
              replicaSet: 'rs0',
              hosts: ['mongo1:27017', 'mongo2:27017', 'mongo3:27017'],
              database: 'tinyurl',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'mongo' }],
      };

      const result = validateConnections('context.db.find_one(query)', graph);
      expect(result.valid).toBe(true);
    });

    it('should validate connection to MongoDB with sharding', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'mongo',
            type: 'mongodb',
            config: {
              sharded: true,
              mongos: ['mongos1:27017', 'mongos2:27017'],
              shardKey: { code: 'hashed' },
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'mongo' }],
      };

      const result = validateConnections('context.db.aggregate(pipeline)', graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Redis Configuration Paths', () => {
    it('should validate connection to standalone Redis', () => {
      const code = `context.cache.set(key, value, ttl=3600)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'redis',
            type: 'redis',
            config: {
              host: 'localhost',
              port: 6379,
              db: 0,
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'redis' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      expect(result.connectedAPIs).toContain('cache');
    });

    it('should validate connection to Redis Cluster', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'redis',
            type: 'redis',
            config: {
              cluster: true,
              nodes: [
                { host: 'redis1', port: 6379 },
                { host: 'redis2', port: 6379 },
                { host: 'redis3', port: 6379 },
              ],
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'redis' }],
      };

      const result = validateConnections('context.cache.get(key)', graph);
      expect(result.valid).toBe(true);
    });

    it('should validate connection to Redis Sentinel', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'redis',
            type: 'redis',
            config: {
              sentinel: true,
              sentinels: [
                { host: 'sentinel1', port: 26379 },
                { host: 'sentinel2', port: 26379 },
              ],
              masterName: 'mymaster',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'redis' }],
      };

      const result = validateConnections('context.cache.delete(key)', graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Cassandra Configuration Paths', () => {
    it('should validate connection to Cassandra cluster', () => {
      const code = `context.db.execute_async(cql_query)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'cassandra',
            type: 'cassandra',
            config: {
              contactPoints: ['cass1', 'cass2', 'cass3'],
              port: 9042,
              keyspace: 'tinyurl',
              datacenter: 'DC1',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'cassandra' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should validate connection to multi-datacenter Cassandra', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'cassandra',
            type: 'cassandra',
            config: {
              contactPoints: ['dc1-cass1', 'dc2-cass1'],
              replicationStrategy: {
                class: 'NetworkTopologyStrategy',
                DC1: 3,
                DC2: 3,
              },
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'cassandra' }],
      };

      const result = validateConnections('context.db.batch_insert(rows)', graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('DynamoDB Configuration Paths', () => {
    it('should validate connection to DynamoDB', () => {
      const code = `context.db.put_item(table='urls', item=data)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'dynamo',
            type: 'dynamodb',
            config: {
              region: 'us-east-1',
              tableName: 'urls',
              partitionKey: 'code',
              sortKey: 'timestamp',
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'dynamo' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should validate connection to DynamoDB with GSI', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          {
            id: 'dynamo',
            type: 'dynamodb',
            config: {
              tableName: 'urls',
              partitionKey: 'code',
              globalSecondaryIndexes: [
                {
                  name: 'url-index',
                  partitionKey: 'url',
                  projectionType: 'ALL',
                },
              ],
            },
          },
        ],
        connections: [{ from: 'app_server', to: 'dynamo' }],
      };

      const result = validateConnections('context.db.query(index="url-index")', graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Mixed Database Scenarios', () => {
    it('should handle PostgreSQL for writes and MongoDB for reads', () => {
      const code = `
# Polyglot persistence
context.db.execute("INSERT INTO urls VALUES (%s, %s)", (code, url))  # PG for writes
context.db.find_one({"code": code})  # Mongo for reads
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'pg', type: 'postgresql', config: { role: 'write' } },
          { id: 'mongo', type: 'mongodb', config: { role: 'read' } },
        ],
        connections: [
          { from: 'app_server', to: 'pg' },
          { from: 'app_server', to: 'mongo' },
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      // Either DB satisfies the db API requirement
    });

    it('should handle database + cache combination', () => {
      const code = `
# Cache-aside pattern
cached = context.cache.get(code)
if not cached:
    url = context.db.get(code)
    context.cache.set(code, url, ttl=3600)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'pg', type: 'postgresql', config: {} },
          { id: 'redis', type: 'redis', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'pg' },
          { from: 'app_server', to: 'redis' },
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      expect(result.usedAPIs).toContain('db');
      expect(result.usedAPIs).toContain('cache');
    });

    it('should handle write-through cache pattern', () => {
      const code = `
# Write to both cache and database
context.db.set(code, url)
context.cache.set(code, url, ttl=3600)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db', type: 'database', config: {} },
          { id: 'cache', type: 'redis', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db' },
          { from: 'app_server', to: 'cache' },
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Component Type Mapping Validation', () => {
    it('should map all database types correctly', () => {
      const types = ['database', 'postgresql', 'mongodb', 'dynamodb', 'cassandra'];
      const apis = componentTypesToAPIs(types);

      expect(apis).toContain('db');
      // Should not duplicate
      expect(apis.filter(api => api === 'db')).toHaveLength(1);
    });

    it('should map all cache types correctly', () => {
      const types = ['cache', 'redis', 'memcached'];
      const apis = componentTypesToAPIs(types);

      expect(apis).toContain('cache');
      expect(apis.filter(api => api === 'cache')).toHaveLength(1);
    });

    it('should map all queue types correctly', () => {
      const types = ['message_queue', 'kafka', 'rabbitmq', 'sqs'];
      const apis = componentTypesToAPIs(types);

      expect(apis).toContain('queue');
      expect(apis.filter(api => api === 'queue')).toHaveLength(1);
    });

    it('should handle unknown component types gracefully', () => {
      const types = ['load_balancer', 'api_gateway', 'unknown_db'];
      const apis = componentTypesToAPIs(types);

      expect(apis).toEqual([]);
    });

    it('should map mixed component types correctly', () => {
      const types = [
        'postgresql',  // db
        'redis',       // cache
        'kafka',       // queue
        'cloudfront',  // cdn
        'elasticsearch', // search
        'load_balancer', // ignored
      ];
      const apis = componentTypesToAPIs(types);

      expect(apis).toContain('db');
      expect(apis).toContain('cache');
      expect(apis).toContain('queue');
      expect(apis).toContain('cdn');
      expect(apis).toContain('search');
      expect(apis).toHaveLength(5);
    });
  });

  describe('Connection Direction Validation', () => {
    it('should fail when database connected TO app_server (wrong direction)', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db', type: 'database', config: {} },
        ],
        connections: [
          { from: 'db', to: 'app_server' }, // Wrong direction!
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('not connected');
    });

    it('should pass when both directions connected (bidirectional)', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db' },  // Correct
          { from: 'db', to: 'app_server' },  // Also exists
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should fail when cache connected through another component', () => {
      const code = `context.cache.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'worker', type: 'worker', config: {} },
          { id: 'cache', type: 'redis', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'worker' },
          { from: 'worker', to: 'cache' }, // Indirect connection
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(false);
      // Validation only checks DIRECT connections from app_server
    });
  });

  describe('Real-World Complex Scenarios', () => {
    it('should validate full e-commerce architecture', () => {
      const code = `
# E-commerce URL shortener with analytics
def shorten(url: str, context) -> str:
    # Check cache
    cached = context.cache.get(f"url:{url}")
    if cached:
        context.queue.publish({"event": "cache_hit"})
        return cached

    # Generate code
    code = generate_code()

    # Store in primary database
    context.db.set(code, url)

    # Update cache
    context.cache.set(f"url:{url}", code, ttl=3600)
    context.cache.set(f"code:{code}", url, ttl=3600)

    # Publish analytics event
    context.queue.publish({
        "event": "url_created",
        "code": code,
        "url": url
    })

    # Index for search
    context.search.index({
        "code": code,
        "url": url,
        "created_at": time.time()
    })

    return code
`;

      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'pg', type: 'postgresql', config: {} },
          { id: 'redis', type: 'redis', config: {} },
          { id: 'kafka', type: 'kafka', config: {} },
          { id: 'elastic', type: 'elasticsearch', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'pg' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'kafka' },
          { from: 'app_server', to: 'elastic' },
        ],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      expect(result.usedAPIs).toHaveLength(4);
      expect(result.connectedAPIs).toHaveLength(4);
    });

    it('should fail when any component is missing in complex scenario', () => {
      const code = `
context.db.set(k, v)
context.cache.get(k)
context.queue.publish(m)
context.search.index(doc)
`;

      const graphMissingSearch: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db', type: 'postgresql', config: {} },
          { id: 'cache', type: 'redis', config: {} },
          { id: 'queue', type: 'kafka', config: {} },
          // Missing: elasticsearch
        ],
        connections: [
          { from: 'app_server', to: 'db' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'queue' },
        ],
      };

      const result = validateConnections(code, graphMissingSearch);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].apiType).toBe('search');
    });
  });
});
