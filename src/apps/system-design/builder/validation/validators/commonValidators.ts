import { SystemGraph } from '../../types/graph';
import { Scenario, ValidationResult, ValidatorFunction } from '../../types/problemDefinition';
import { isDatabaseComponentType } from '../../utils/database';

/**
 * Common validators that can be reused across problems
 */

/**
 * Validate caching for read-heavy workloads
 */
export const cacheForReadHeavyValidator: ValidatorFunction = (graph, scenario) => {
  const readRatio = scenario.traffic.readWriteRatio || 0.5;
  const rps = scenario.traffic.rps;

  // If read-heavy (>80%) and high traffic (>1000 RPS), should have cache
  if (readRatio > 0.8 && rps > 1000) {
    const hasCache = graph.components.some(c => c.type === 'redis');

    if (!hasCache) {
      return {
        valid: false,
        hint: `High read traffic (${(readRatio * 100).toFixed(0)}% reads, ${rps} RPS) needs caching to reduce database load`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validate database capacity for write load
 */
export const databaseWriteCapacityValidator: ValidatorFunction = (graph, scenario) => {
  const writeRatio = 1 - (scenario.traffic.readWriteRatio || 0.5);
  const writeRPS = scenario.traffic.rps * writeRatio;

  // Find database
  const database = graph.components.find(c => isDatabaseComponentType(c.type));

  if (!database) {
    return { valid: true }; // Will be caught by architecture validation
  }

  const writeCapacity = database.config.writeCapacity || 100;

  if (writeCapacity < writeRPS) {
    return {
      valid: false,
      hint: `Database write capacity (${writeCapacity} RPS) is less than write traffic (${writeRPS.toFixed(0)} RPS). Increase capacity or add write buffering.`,
    };
  }

  return { valid: true };
};

/**
 * Validate no single point of failure for HA requirements
 */
export const highAvailabilityValidator: ValidatorFunction = (graph, scenario) => {
  const requiredAvailability = scenario.passCriteria.availability;

  // If high availability required (>99.9%), check for redundancy
  if (requiredAvailability && requiredAvailability > 0.999) {
    // Should have load balancer
    const hasLoadBalancer = graph.components.some(c => c.type === 'load_balancer');
    if (!hasLoadBalancer) {
      return {
        valid: false,
        hint: 'High availability (>99.9%) requires a load balancer for redundancy',
      };
    }

    // Should have multiple app servers
    const appServers = graph.components.filter(c => c.type === 'app_server');
    const totalInstances = appServers.reduce((sum, server) => {
      return sum + (server.config.instances || 1);
    }, 0);

    if (totalInstances < 2) {
      return {
        valid: false,
        hint: 'High availability requires multiple app server instances (currently: ' + totalInstances + ')',
      };
    }
  }

  return { valid: true };
};

/**
 * Validate CDN usage for static content
 */
export const cdnForStaticContentValidator: ValidatorFunction = (graph, scenario) => {
  const avgFileSize = scenario.traffic.avgFileSize || 0;
  const rps = scenario.traffic.rps;

  // If serving large files at high RPS, CDN is cost-effective
  if (avgFileSize > 1 && rps > 1000) {
    const hasCDN = graph.components.some(c => c.type === 'cdn');
    const hasS3 = graph.components.some(c => c.type === 's3');

    if (hasS3 && !hasCDN) {
      return {
        valid: false,
        hint: `Serving ${avgFileSize}MB files at ${rps} RPS from S3 is expensive. Add CDN to reduce bandwidth costs.`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validate object storage for large files
 */
export const objectStorageForLargeFilesValidator: ValidatorFunction = (graph, scenario) => {
  const avgFileSize = scenario.traffic.avgFileSize || 0;

  // If storing large files (>1MB), should use object storage
  if (avgFileSize > 1) {
    const hasObjectStorage = graph.components.some(c => c.type === 's3');

    if (!hasObjectStorage) {
      return {
        valid: false,
        hint: `Storing large files (${avgFileSize}MB) in a database is inefficient. Use object storage (S3).`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validate database replication configuration for high availability / consistency scenarios
 *
 * Enforces:
 * - Replication enabled when availability targets are high or traffic is large
 * - Highlights tradeoffs of synchronous replication under heavy write load
 */
export const replicationConfigValidator: ValidatorFunction = (graph, scenario) => {
  const requiredAvailability = scenario.passCriteria.availability;
  const rps = scenario.traffic.rps;

  const db = graph.components.find(c => isDatabaseComponentType(c.type));
  if (!db) {
    return { valid: true };
  }

  const replicationConfig = db.config.replication;
  const replicationEnabled =
    (typeof replicationConfig === 'boolean' && replicationConfig) ||
    (typeof replicationConfig === 'object' && replicationConfig.enabled);

  // If high availability or very high traffic, require replication
  if ((requiredAvailability && requiredAvailability > 0.999) || rps > 2000) {
    if (!replicationEnabled) {
      return {
        valid: false,
        hint: 'High availability / multi-region traffic requires database replication (primary + replicas). Enable replication for your database.',
      };
    }
  }

  // If synchronous replication is configured under heavy write load, warn about write latency
  if (replicationEnabled && typeof replicationConfig === 'object') {
    const mode = replicationConfig.mode || 'async';
    const readRatio = scenario.traffic.readWriteRatio ?? 0.5;
    const writeRps = rps * (1 - readRatio);

    if (mode === 'sync' && writeRps > 200) {
      return {
        valid: false,
        hint: 'Synchronous replication with high write traffic will significantly increase write latency. Consider async replication or reducing write load.',
      };
    }
  }

  return { valid: true };
};

/**
 * Validate database partitioning / sharding strategy for high-traffic scenarios
 *
 * Enforces:
 * - Sharding enabled for very high RPS
 * - Warns on obviously bad shard keys (e.g., created_at) that create hot partitions
 */
export const partitioningConfigValidator: ValidatorFunction = (graph, scenario) => {
  const rps = scenario.traffic.rps;
  const db = graph.components.find(c => isDatabaseComponentType(c.type));
  if (!db) {
    return { valid: true };
  }

  const sharding = db.config.sharding as
    | { enabled?: boolean; shards?: number; shardKey?: string }
    | undefined;

  // At very high traffic, encourage sharding
  if (rps > 5000) {
    if (!sharding?.enabled) {
      return {
        valid: false,
        hint: 'Very high traffic (>5000 RPS) should use sharding/partitioning for the URL mapping table. Configure sharding with an appropriate shard key (e.g., short_code).',
      };
    }

    const shardKey = sharding.shardKey || '';
    if (shardKey === 'created_at' || shardKey === 'timestamp') {
      return {
        valid: false,
        hint: 'Sharding by created_at/timestamp can create hot partitions during spikes. Use a more uniform key such as short_code or user_id.',
      };
    }
  }

  return { valid: true };
};

/**
 * Validate transactional configuration vs data-loss tolerance
 *
 * Enforces:
 * - If scenario does not tolerate data loss, isolation level should not be read-uncommitted
 */
export const transactionConfigValidator: ValidatorFunction = (graph, scenario) => {
  const db = graph.components.find(c => isDatabaseComponentType(c.type));
  if (!db) {
    return { valid: true };
  }

  const dataLossNotAllowed = scenario.passCriteria.dataLoss === false;
  if (!dataLossNotAllowed) {
    return { valid: true };
  }

  const isolation = (db.config.isolationLevel || 'read-committed') as string;
  if (isolation === 'read-uncommitted') {
    return {
      valid: false,
      hint: 'Scenario does not tolerate data loss, but database isolation is read-uncommitted. Increase isolation level to at least read-committed.',
    };
  }

  return { valid: true };
};

/**
 * Validate cost optimization
 */
export const costOptimizationValidator: ValidatorFunction = (graph, scenario) => {
  const maxCost = scenario.passCriteria.maxCost;

  if (!maxCost) {
    return { valid: true };
  }

  // Calculate actual cost
  let totalCost = 0;

  for (const component of graph.components) {
    const instances = component.config.instances || 1;

    if (isDatabaseComponentType(component.type)) {
      const replication = component.config.replication;
      const replicas = replication?.enabled ? replication.replicas || 1 : 0;
      const storageCost = (component.config.storageSizeGB || 50) * 0.1;
      totalCost += 120 * (1 + replicas) + storageCost;
      continue;
    }

    switch (component.type) {
      case 'app_server':
        totalCost += 50 * instances; // $50/instance/month
        break;
      case 'redis':
        const memorySizeGB = component.config.memorySizeGB || 1;
        totalCost += 20 * memorySizeGB;
        break;
      case 'load_balancer':
        totalCost += 30;
        break;
      case 's3':
        // Simplified: assume 1TB storage
        totalCost += 25;
        break;
      case 'cdn':
        totalCost += 50;
        break;
    }
  }

  if (totalCost > maxCost) {
    return {
      valid: false,
      hint: `Design costs $${totalCost.toFixed(0)}/month, exceeds budget of $${maxCost}/month. Look for components to optimize or remove.`,
      details: { totalCost },
    };
  }

  return { valid: true };
};

/**
 * Validate connection flow makes sense
 */
export const validConnectionFlowValidator: ValidatorFunction = (graph, scenario) => {
  // Check: Client should not connect directly to database
  const clientToDbConnection = graph.connections.some(conn => {
    const fromComp = graph.components.find(c => c.id === conn.from);
    const toComp = graph.components.find(c => c.id === conn.to);

    return fromComp?.type === 'client' && toComp && isDatabaseComponentType(toComp.type);
  });

  if (clientToDbConnection) {
    return {
      valid: false,
      hint: 'Client should not connect directly to database. Route through app server for security and business logic.',
    };
  }

  // Check: Cache should be between app and database
  const cache = graph.components.find(c => c.type === 'cache' || c.type === 'redis');
  if (cache) {
    const hasAppToCache = graph.connections.some(conn => {
      const fromComp = graph.components.find(c => c.id === conn.from);
      return fromComp?.type === 'app_server' && conn.to === cache.id;
    });

    const hasCacheToDb = graph.connections.some(conn => {
      const toComp = graph.components.find(c => c.id === conn.to);
      return conn.from === cache.id && toComp && isDatabaseComponentType(toComp.type);
    });

    if (!hasAppToCache || !hasCacheToDb) {
      return {
        valid: false,
        hint: 'Cache should be between app server and database: App Server → Cache → Database',
      };
    }
  }

  return { valid: true };
};
