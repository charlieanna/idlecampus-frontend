import { SystemGraph } from '../../types/graph';
import { Scenario, ValidationResult, ValidatorFunction } from '../../types/problemDefinition';

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
  const database = graph.components.find(c =>
    c.type === 'postgresql' || c.type === 'mongodb' || c.type === 'cassandra'
  );

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

    switch (component.type) {
      case 'app_server':
        totalCost += 50 * instances; // $50/instance/month
        break;
      case 'postgresql':
      case 'mongodb':
      case 'cassandra':
        totalCost += 100; // Base DB cost
        if (component.config.replication) {
          totalCost += 100; // Replication cost
        }
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

    return fromComp?.type === 'client' &&
      (toComp?.type === 'postgresql' || toComp?.type === 'mongodb' || toComp?.type === 'cassandra');
  });

  if (clientToDbConnection) {
    return {
      valid: false,
      hint: 'Client should not connect directly to database. Route through app server for security and business logic.',
    };
  }

  // Check: Cache should be between app and database
  const cache = graph.components.find(c => c.type === 'redis');
  if (cache) {
    const hasAppToCache = graph.connections.some(conn => {
      const fromComp = graph.components.find(c => c.id === conn.from);
      return fromComp?.type === 'app_server' && conn.to === cache.id;
    });

    const hasCacheToDb = graph.connections.some(conn => {
      const toComp = graph.components.find(c => c.id === conn.to);
      return conn.from === cache.id &&
        (toComp?.type === 'postgresql' || toComp?.type === 'mongodb' || toComp?.type === 'cassandra');
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
