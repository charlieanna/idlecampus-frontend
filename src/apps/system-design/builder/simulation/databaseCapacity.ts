/**
 * Database Capacity Modeling Module (Phase 2.1)
 *
 * Provides realistic database capacity modeling:
 * - Connection pool management
 * - Query complexity factors
 * - I/O patterns (sequential vs random)
 * - Read replica distribution
 */

import { isEnabled, verboseLog } from './featureFlags';

/**
 * Connection pool configuration
 */
export interface ConnectionPoolConfig {
  maxConnections: number; // Maximum connections in pool
  minConnections: number; // Minimum idle connections
  acquireTimeout: number; // ms to wait for connection
  idleTimeout: number; // ms before idle connection is closed
}

/**
 * Query complexity classification
 */
export type QueryComplexity = 'simple' | 'moderate' | 'complex' | 'analytical';

/**
 * I/O pattern type
 */
export type IOPattern = 'sequential' | 'random' | 'mixed';

/**
 * Database capacity result
 */
export interface DatabaseCapacityResult {
  effectiveCapacity: number; // Actual RPS capacity
  connectionPoolUtilization: number; // % of pool in use
  queryLatencyMultiplier: number; // Multiplier based on complexity
  ioLatencyMultiplier: number; // Multiplier based on I/O pattern
  warnings: string[];
}

/**
 * Default connection pool sizes by instance type
 */
export const CONNECTION_POOL_DEFAULTS: Record<string, ConnectionPoolConfig> = {
  'db.t3.micro': { maxConnections: 20, minConnections: 5, acquireTimeout: 5000, idleTimeout: 60000 },
  'db.t3.small': { maxConnections: 45, minConnections: 10, acquireTimeout: 5000, idleTimeout: 60000 },
  'db.t3.medium': { maxConnections: 90, minConnections: 20, acquireTimeout: 5000, idleTimeout: 60000 },
  'db.t3.large': { maxConnections: 180, minConnections: 40, acquireTimeout: 5000, idleTimeout: 60000 },
  'db.r5.large': { maxConnections: 540, minConnections: 100, acquireTimeout: 5000, idleTimeout: 60000 },
  'db.r5.xlarge': { maxConnections: 1080, minConnections: 200, acquireTimeout: 5000, idleTimeout: 60000 },
  'db.r5.2xlarge': { maxConnections: 2160, minConnections: 400, acquireTimeout: 5000, idleTimeout: 60000 },
};

/**
 * Query complexity latency multipliers
 */
export const QUERY_COMPLEXITY_MULTIPLIERS: Record<QueryComplexity, number> = {
  simple: 1.0, // Simple SELECT by primary key
  moderate: 2.5, // JOIN with 2-3 tables
  complex: 8.0, // Complex JOINs, subqueries
  analytical: 25.0, // Aggregations, GROUP BY, window functions
};

/**
 * I/O pattern latency multipliers
 */
export const IO_PATTERN_MULTIPLIERS: Record<IOPattern, number> = {
  sequential: 1.0, // Sequential scans (good for range queries)
  random: 3.0, // Random I/O (index lookups)
  mixed: 2.0, // Mix of both
};

/**
 * Calculate effective database capacity with connection pooling
 */
export function calculateEffectiveCapacity(
  baseCapacity: number,
  totalRps: number,
  config?: {
    poolConfig?: ConnectionPoolConfig;
    queryComplexity?: QueryComplexity;
    ioPattern?: IOPattern;
    avgQueryDurationMs?: number;
  }
): DatabaseCapacityResult {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_DB_CONNECTION_POOL')) {
    // Legacy behavior - return base capacity
    return {
      effectiveCapacity: baseCapacity,
      connectionPoolUtilization: totalRps / baseCapacity,
      queryLatencyMultiplier: 1.0,
      ioLatencyMultiplier: 1.0,
      warnings: [],
    };
  }

  const poolConfig = config?.poolConfig ?? CONNECTION_POOL_DEFAULTS['db.t3.medium'];
  const queryComplexity = config?.queryComplexity ?? 'moderate';
  const ioPattern = config?.ioPattern ?? 'random';
  const avgQueryDurationMs = config?.avgQueryDurationMs ?? 10;

  // Calculate how many concurrent connections are needed
  // Little's Law: L = λ * W (concurrent connections = arrival rate * service time)
  const avgServiceTimeSeconds = avgQueryDurationMs / 1000;
  const concurrentConnectionsNeeded = totalRps * avgServiceTimeSeconds;

  // Connection pool utilization
  const connectionPoolUtilization = concurrentConnectionsNeeded / poolConfig.maxConnections;

  // Apply complexity multipliers
  const queryLatencyMultiplier = QUERY_COMPLEXITY_MULTIPLIERS[queryComplexity];
  const ioLatencyMultiplier = IO_PATTERN_MULTIPLIERS[ioPattern];

  // Effective capacity is limited by connection pool
  // If pool is saturated, new requests queue or fail
  let effectiveCapacity = baseCapacity;

  if (connectionPoolUtilization > 1.0) {
    // Connection pool exhaustion - capacity drops significantly
    effectiveCapacity = poolConfig.maxConnections / avgServiceTimeSeconds;
    warnings.push(
      `Connection pool exhausted: ${concurrentConnectionsNeeded.toFixed(0)} connections needed but only ${poolConfig.maxConnections} available`
    );
  } else if (connectionPoolUtilization > 0.8) {
    // High pool utilization causes queuing
    const queueingFactor = 1 / (1 - connectionPoolUtilization);
    effectiveCapacity = baseCapacity / queueingFactor;
    warnings.push(`High connection pool utilization: ${(connectionPoolUtilization * 100).toFixed(1)}%`);
  }

  // Adjust for query complexity (more complex queries = lower throughput)
  effectiveCapacity = effectiveCapacity / queryLatencyMultiplier;

  // Adjust for I/O pattern
  effectiveCapacity = effectiveCapacity / ioLatencyMultiplier;

  verboseLog('Database capacity calculated', {
    baseCapacity,
    effectiveCapacity,
    connectionPoolUtilization,
    queryComplexity,
    ioPattern,
  });

  return {
    effectiveCapacity,
    connectionPoolUtilization: Math.min(connectionPoolUtilization, 1.0),
    queryLatencyMultiplier,
    ioLatencyMultiplier,
    warnings,
  };
}

/**
 * Calculate read replica distribution
 * Returns optimal distribution of reads across primary and replicas
 */
export function calculateReplicaDistribution(
  totalReadRps: number,
  totalWriteRps: number,
  numReplicas: number,
  replicationLag?: number // ms
): {
  primaryReadRps: number;
  replicaReadRps: number; // Per replica
  replicationLagWarning?: string;
} {
  if (numReplicas === 0) {
    return { primaryReadRps: totalReadRps, replicaReadRps: 0 };
  }

  // Distribute reads across replicas, keep writes on primary
  // Rule of thumb: Send 10% of reads to primary (for consistency-critical reads)
  const primaryReadRps = totalReadRps * 0.1;
  const replicaReadRps = (totalReadRps * 0.9) / numReplicas;

  let replicationLagWarning: string | undefined;
  if (replicationLag && replicationLag > 100) {
    replicationLagWarning = `High replication lag: ${replicationLag}ms. Stale reads possible on replicas.`;
  }

  return {
    primaryReadRps,
    replicaReadRps,
    replicationLagWarning,
  };
}

/**
 * Estimate replication lag based on write load
 */
export function estimateReplicationLag(
  writeRps: number,
  replicationMode: 'sync' | 'async',
  networkLatencyMs: number = 1
): number {
  if (replicationMode === 'sync') {
    return 0; // No lag in sync mode (but higher write latency)
  }

  // Async replication lag increases with write load
  // Base lag + write-load-dependent lag
  const baseLag = networkLatencyMs * 2;
  const writeLoadLag = Math.min(writeRps * 0.5, 1000); // Up to 1 second at high load

  return baseLag + writeLoadLag;
}

/**
 * Calculate connection pool wait time when pool is near saturation
 */
export function calculateConnectionWaitTime(
  utilization: number,
  maxConnections: number,
  avgQueryDurationMs: number
): number {
  if (utilization <= 0.8) {
    return 0; // No waiting when utilization is low
  }

  // M/M/c queue waiting time approximation
  // As utilization approaches 1, wait time approaches infinity
  const serverUtilization = Math.min(utilization, 0.99);
  const waitingFactor = serverUtilization / (1 - serverUtilization);

  return avgQueryDurationMs * waitingFactor;
}

/**
 * Get recommended instance type based on workload
 */
export function getRecommendedInstanceType(
  peakRps: number,
  queryComplexity: QueryComplexity = 'moderate',
  requiresHighAvailability: boolean = false
): string {
  // Adjust RPS for complexity
  const adjustedRps = peakRps * QUERY_COMPLEXITY_MULTIPLIERS[queryComplexity];

  if (adjustedRps < 100) {
    return requiresHighAvailability ? 'db.t3.medium' : 'db.t3.small';
  } else if (adjustedRps < 500) {
    return 'db.t3.large';
  } else if (adjustedRps < 2000) {
    return 'db.r5.large';
  } else if (adjustedRps < 5000) {
    return 'db.r5.xlarge';
  } else {
    return 'db.r5.2xlarge';
  }
}
