/**
 * Sharding and Multi-Database Support Module
 *
 * Enables distributing traffic across multiple database instances with various
 * sharding strategies. This is critical for simulating realistic distributed systems.
 */

import { ComponentMetrics } from '../types/component';
import { isEnabled, verboseLog } from './featureFlags';

/**
 * Sharding strategy types
 */
export type ShardingStrategy =
  | 'round_robin' // Even distribution across shards
  | 'hash' // Hash-based key distribution
  | 'range' // Range-based partitioning
  | 'directory'; // Directory/lookup-based routing

/**
 * Key distribution pattern (affects hot shard detection)
 */
export type KeyDistribution =
  | 'uniform' // Even distribution (ideal case)
  | 'zipf' // Power-law distribution (80/20 rule)
  | 'hotspot'; // Single hot shard (worst case)

/**
 * Configuration for sharding across multiple databases
 */
export interface ShardingConfig {
  strategy: ShardingStrategy;
  numShards: number;
  keyDistribution?: KeyDistribution;
  hotspotPercentage?: number; // For hotspot distribution, % of traffic to hot shard (default 90%)
}

/**
 * Traffic distribution result for each shard
 */
export interface ShardTrafficDistribution {
  shardId: string;
  readRps: number;
  writeRps: number;
  trafficPercentage: number;
}

/**
 * Aggregated metrics from multiple shards
 */
export interface AggregatedShardMetrics {
  // Latency: Use maximum (worst shard determines overall latency)
  maxReadLatency: number;
  maxWriteLatency: number;
  avgReadLatency: number;
  avgWriteLatency: number;

  // Error rate: Weighted average
  combinedErrorRate: number;

  // Utilization: Maximum (hottest shard)
  maxUtilization: number;
  avgUtilization: number;

  // Cost: Sum of all shards
  totalCost: number;

  // Individual shard metrics
  shardMetrics: Map<string, ComponentMetrics>;

  // Hot shard detection
  hotShards: string[];
}

/**
 * Distribute traffic across shards based on strategy and key distribution
 */
export function distributeTrafficAcrossShards(
  shardIds: string[],
  totalReadRps: number,
  totalWriteRps: number,
  config?: ShardingConfig
): ShardTrafficDistribution[] {
  const numShards = shardIds.length;

  if (numShards === 0) {
    return [];
  }

  if (numShards === 1 || !isEnabled('ENABLE_MULTI_DB')) {
    // Single database or feature flag disabled
    return [
      {
        shardId: shardIds[0],
        readRps: totalReadRps,
        writeRps: totalWriteRps,
        trafficPercentage: 1.0,
      },
    ];
  }

  const keyDistribution = config?.keyDistribution ?? 'uniform';

  verboseLog('Distributing traffic across shards', {
    numShards,
    totalReadRps,
    totalWriteRps,
    strategy: config?.strategy ?? 'round_robin',
    keyDistribution,
  });

  let distribution: number[];

  switch (keyDistribution) {
    case 'uniform':
      distribution = getUniformDistribution(numShards);
      break;
    case 'zipf':
      distribution = getZipfDistribution(numShards);
      break;
    case 'hotspot':
      distribution = getHotspotDistribution(
        numShards,
        config?.hotspotPercentage ?? 0.9
      );
      break;
    default:
      distribution = getUniformDistribution(numShards);
  }

  return shardIds.map((shardId, index) => ({
    shardId,
    readRps: totalReadRps * distribution[index],
    writeRps: totalWriteRps * distribution[index],
    trafficPercentage: distribution[index],
  }));
}

/**
 * Uniform distribution - equal traffic to each shard
 */
function getUniformDistribution(numShards: number): number[] {
  const percentage = 1 / numShards;
  return Array(numShards).fill(percentage);
}

/**
 * Zipf distribution - power-law (80/20 rule)
 * First shard gets most traffic, decreasing exponentially
 */
function getZipfDistribution(numShards: number): number[] {
  // Zipf's law: frequency proportional to 1/rank
  const ranks = Array.from({ length: numShards }, (_, i) => 1 / (i + 1));
  const sum = ranks.reduce((a, b) => a + b, 0);
  return ranks.map((r) => r / sum);
}

/**
 * Hotspot distribution - one shard gets majority of traffic
 */
function getHotspotDistribution(
  numShards: number,
  hotspotPercentage: number
): number[] {
  if (numShards === 1) {
    return [1];
  }

  const hotTraffic = hotspotPercentage;
  const coldTraffic = (1 - hotspotPercentage) / (numShards - 1);

  return [hotTraffic, ...Array(numShards - 1).fill(coldTraffic)];
}

/**
 * Aggregate metrics from multiple database shards
 */
export function aggregateShardMetrics(
  shardMetrics: Map<string, ComponentMetrics>,
  trafficDistribution: ShardTrafficDistribution[]
): AggregatedShardMetrics {
  if (shardMetrics.size === 0) {
    return {
      maxReadLatency: 0,
      maxWriteLatency: 0,
      avgReadLatency: 0,
      avgWriteLatency: 0,
      combinedErrorRate: 0,
      maxUtilization: 0,
      avgUtilization: 0,
      totalCost: 0,
      shardMetrics,
      hotShards: [],
    };
  }

  let maxReadLatency = 0;
  let maxWriteLatency = 0;
  let totalWeightedReadLatency = 0;
  let totalWeightedWriteLatency = 0;
  let totalTrafficWeight = 0;

  let combinedSuccessRate = 1;
  let maxUtilization = 0;
  let totalUtilization = 0;
  let totalCost = 0;

  const hotShards: string[] = [];

  for (const dist of trafficDistribution) {
    const metrics = shardMetrics.get(dist.shardId);
    if (!metrics) continue;

    const weight = dist.trafficPercentage;
    totalTrafficWeight += weight;

    // Latency: Track max and weighted average
    const readLatency = metrics.readLatency ?? metrics.latency;
    const writeLatency = metrics.writeLatency ?? metrics.latency;

    maxReadLatency = Math.max(maxReadLatency, readLatency);
    maxWriteLatency = Math.max(maxWriteLatency, writeLatency);
    totalWeightedReadLatency += readLatency * weight;
    totalWeightedWriteLatency += writeLatency * weight;

    // Error rate: Combine (success_total = product of success_individual)
    combinedSuccessRate *= 1 - metrics.errorRate;

    // Utilization
    const util = metrics.utilization ?? 0;
    maxUtilization = Math.max(maxUtilization, util);
    totalUtilization += util;

    // Cost
    totalCost += metrics.cost;

    // Detect hot shards (>80% utilization)
    if (util > 0.8) {
      hotShards.push(dist.shardId);
    }
  }

  const combinedErrorRate = 1 - combinedSuccessRate;
  const avgUtilization =
    shardMetrics.size > 0 ? totalUtilization / shardMetrics.size : 0;
  const avgReadLatency =
    totalTrafficWeight > 0 ? totalWeightedReadLatency / totalTrafficWeight : 0;
  const avgWriteLatency =
    totalTrafficWeight > 0
      ? totalWeightedWriteLatency / totalTrafficWeight
      : 0;

  return {
    maxReadLatency,
    maxWriteLatency,
    avgReadLatency,
    avgWriteLatency,
    combinedErrorRate,
    maxUtilization,
    avgUtilization,
    totalCost,
    shardMetrics,
    hotShards,
  };
}

/**
 * Find all database nodes in the component map
 */
export function findAllDatabaseNodes(
  components: Map<string, { type: string }>
): string[] {
  const dbTypes = [
    'database',
    'postgresql',
    'mongodb',
    'cassandra',
    'mysql',
    'dynamodb',
  ];

  const dbNodes: string[] = [];

  for (const [id, component] of components.entries()) {
    if (dbTypes.includes(component.type)) {
      dbNodes.push(id);
    }
  }

  return dbNodes;
}

/**
 * Check if multiple databases should be treated as shards
 * Returns true if there are multiple DBs of the same type
 */
export function shouldTreatAsShards(
  components: Map<string, { type: string }>
): boolean {
  if (!isEnabled('ENABLE_MULTI_DB')) {
    return false;
  }

  const dbCounts = new Map<string, number>();

  for (const component of components.values()) {
    if (
      [
        'database',
        'postgresql',
        'mongodb',
        'cassandra',
        'mysql',
        'dynamodb',
      ].includes(component.type)
    ) {
      const count = dbCounts.get(component.type) ?? 0;
      dbCounts.set(component.type, count + 1);
    }
  }

  // If any DB type has more than 1 instance, treat as shards
  for (const count of dbCounts.values()) {
    if (count > 1) {
      return true;
    }
  }

  return false;
}

/**
 * Get sharding config from graph metadata or use defaults
 */
export function getDefaultShardingConfig(numShards: number): ShardingConfig {
  return {
    strategy: 'hash',
    numShards,
    keyDistribution: 'uniform',
  };
}

/**
 * Validate sharding configuration
 */
export function validateShardingConfig(config: ShardingConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.numShards < 1) {
    errors.push('Number of shards must be at least 1');
  }

  if (config.numShards > 100) {
    errors.push('Number of shards should not exceed 100 for simulation');
  }

  if (
    config.hotspotPercentage !== undefined &&
    (config.hotspotPercentage < 0 || config.hotspotPercentage > 1)
  ) {
    errors.push('Hotspot percentage must be between 0 and 1');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
