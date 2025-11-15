import { SystemGraph } from '../../types/graph';
import { Scenario, ValidationResult, ValidatorFunction } from '../../types/problemDefinition';
import { CacheStrategy } from '../../types/advancedConfig';

/**
 * Caching Strategy Validators
 * Ensures caching strategies align with consistency requirements and workload patterns
 */

/**
 * Validates that the caching strategy matches consistency requirements
 */
export const cacheStrategyConsistencyValidator: ValidatorFunction = (graph, scenario, problem) => {
  // Find cache components
  const cacheComponents = graph.components.filter(c => c.type === 'redis');

  if (cacheComponents.length === 0) {
    return { valid: true }; // No cache, nothing to validate
  }

  // Get consistency requirement from problem (will be added to ProblemDefinition)
  const consistencyRequirement = (problem as any).consistencyRequirement || 'eventual';

  for (const cache of cacheComponents) {
    const strategy = (cache.config.strategy as CacheStrategy) || 'cache_aside';

    // Strong consistency checks
    if (consistencyRequirement === 'strong') {
      if (strategy === 'write_behind' || strategy === 'write_back') {
        return {
          valid: false,
          hint: `Strong consistency required but using ${strategy}. Write-behind/back can lose data on cache failure. Use write-through or cache-aside with proper invalidation.`,
        };
      }
    }

    // Check for financial/transactional systems
    if (problem?.id?.includes('payment') || problem?.id?.includes('ticket') || problem?.id?.includes('booking')) {
      if (strategy === 'write_behind') {
        return {
          valid: false,
          hint: 'Critical transactional system detected. Write-behind caching risks data loss. Use write-through for guaranteed durability.',
        };
      }
    }
  }

  return { valid: true };
};

/**
 * Validates caching strategy for write-heavy workloads
 */
export const writeHeavyCacheStrategyValidator: ValidatorFunction = (graph, scenario) => {
  const writeRatio = 1 - (scenario.traffic.readWriteRatio || 0.5);
  const cacheComponents = graph.components.filter(c => c.type === 'redis');

  if (cacheComponents.length === 0 || writeRatio <= 0.5) {
    return { valid: true };
  }

  // For write-heavy workloads (>50% writes)
  for (const cache of cacheComponents) {
    const strategy = (cache.config.strategy as CacheStrategy) || 'cache_aside';

    if (writeRatio > 0.7 && strategy === 'write_through') {
      return {
        valid: false,
        hint: `Write-heavy workload (${(writeRatio * 100).toFixed(0)}% writes) with write-through will slow down all writes. Consider write-behind for better write performance or write-around if data is rarely read.`,
      };
    }

    if (writeRatio > 0.9 && strategy !== 'write_around' && strategy !== 'write_behind') {
      return {
        valid: false,
        hint: `Extremely write-heavy workload (${(writeRatio * 100).toFixed(0)}% writes). Consider write-around to bypass cache or write-behind for async writes.`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validates caching strategy for read-heavy workloads
 */
export const readHeavyCacheStrategyValidator: ValidatorFunction = (graph, scenario) => {
  const readRatio = scenario.traffic.readWriteRatio || 0.5;
  const cacheComponents = graph.components.filter(c => c.type === 'redis');

  if (cacheComponents.length === 0 || readRatio <= 0.5) {
    return { valid: true };
  }

  // For read-heavy workloads (>50% reads)
  for (const cache of cacheComponents) {
    const strategy = (cache.config.strategy as CacheStrategy) || 'cache_aside';

    if (readRatio > 0.8 && strategy === 'write_around') {
      return {
        valid: false,
        hint: `Read-heavy workload (${(readRatio * 100).toFixed(0)}% reads) but using write-around which bypasses cache. This defeats the purpose of caching. Use cache-aside or read-through.`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validates cache invalidation strategy
 */
export const cacheInvalidationValidator: ValidatorFunction = (graph, scenario, problem) => {
  const cacheComponents = graph.components.filter(c => c.type === 'redis');

  if (cacheComponents.length === 0) {
    return { valid: true };
  }

  for (const cache of cacheComponents) {
    const strategy = (cache.config.strategy as CacheStrategy) || 'cache_aside';
    const ttl = cache.config.ttl;

    // Check if TTL is appropriate for the strategy
    if (strategy === 'write_through' && (!ttl || ttl > 3600)) {
      return {
        valid: false,
        hint: 'Write-through cache without proper TTL. Set appropriate TTL to prevent stale data in case of bugs or edge cases.',
      };
    }

    // Check for cache-aside invalidation
    if (strategy === 'cache_aside') {
      const hasInvalidation = cache.config.invalidateOnWrite !== false;
      if (!hasInvalidation && problem?.description?.includes('real-time')) {
        return {
          valid: false,
          hint: 'Real-time system with cache-aside needs explicit cache invalidation on writes to maintain consistency.',
        };
      }
    }
  }

  return { valid: true };
};

/**
 * Validates data durability for critical systems
 */
export const dataDurabilityValidator: ValidatorFunction = (graph, scenario, problem) => {
  const cacheComponents = graph.components.filter(c => c.type === 'redis');

  if (cacheComponents.length === 0) {
    return { valid: true };
  }

  // Check if this is a critical system
  const isCritical = problem?.id?.includes('payment') ||
                     problem?.id?.includes('banking') ||
                     problem?.id?.includes('financial') ||
                     problem?.id?.includes('transaction') ||
                     (problem as any).dataLossAcceptable === false;

  if (!isCritical) {
    return { valid: true };
  }

  for (const cache of cacheComponents) {
    const strategy = (cache.config.strategy as CacheStrategy) || 'cache_aside';

    if (strategy === 'write_behind') {
      const writeBatchSize = cache.config.writeBatchSize || 100;
      const writeDelayMs = cache.config.writeDelayMs || 10;

      return {
        valid: false,
        hint: `Critical system using write-behind with batch size ${writeBatchSize} and ${writeDelayMs}ms delay. Up to ${writeBatchSize} operations could be lost on cache failure. Use write-through or synchronous writes.`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validates cache coherency in distributed systems
 */
export const cacheCoherencyValidator: ValidatorFunction = (graph, scenario) => {
  const cacheComponents = graph.components.filter(c => c.type === 'redis');
  const appServers = graph.components.filter(c => c.type === 'app_server');

  // Only relevant for multiple caches or multiple app servers
  if (cacheComponents.length <= 1 || appServers.length <= 1) {
    return { valid: true };
  }

  // Check for cache coherency issues
  const totalAppInstances = appServers.reduce((sum, server) => {
    return sum + (server.config.instances || 1);
  }, 0);

  if (totalAppInstances > 2) {
    for (const cache of cacheComponents) {
      const strategy = (cache.config.strategy as CacheStrategy) || 'cache_aside';

      if (strategy === 'cache_aside' && !cache.config.distributedCache) {
        return {
          valid: false,
          hint: `Multiple app instances (${totalAppInstances}) with cache-aside pattern may have cache coherency issues. Consider using distributed cache, pub/sub for invalidation, or write-through strategy.`,
        };
      }
    }
  }

  return { valid: true };
};

/**
 * Validates caching strategy for hot key problem
 */
export const hotKeyCacheValidator: ValidatorFunction = (graph, scenario, problem) => {
  const cacheComponents = graph.components.filter(c => c.type === 'redis');

  if (cacheComponents.length === 0) {
    return { valid: true };
  }

  // Check if problem mentions hot keys or celebrity users
  const hasHotKeys = problem?.description?.includes('celebrity') ||
                     problem?.description?.includes('viral') ||
                     problem?.description?.includes('hot') ||
                     problem?.id?.includes('social');

  if (!hasHotKeys) {
    return { valid: true };
  }

  for (const cache of cacheComponents) {
    const hasHotKeyHandling = cache.config.replication ||
                              cache.config.readReplicas ||
                              cache.config.consistentHashing;

    if (!hasHotKeyHandling) {
      return {
        valid: false,
        hint: 'System may have hot keys (celebrity users, viral content). Consider cache replication, read replicas, or consistent hashing to distribute load.',
      };
    }
  }

  return { valid: true };
};

/**
 * Master validator that runs all caching validators
 */
export const comprehensiveCacheValidator: ValidatorFunction = (graph, scenario, problem) => {
  const validators = [
    cacheStrategyConsistencyValidator,
    writeHeavyCacheStrategyValidator,
    readHeavyCacheStrategyValidator,
    cacheInvalidationValidator,
    dataDurabilityValidator,
    cacheCoherencyValidator,
    hotKeyCacheValidator,
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
 * Helper function to recommend caching strategy based on workload
 */
export function recommendCacheStrategy(
  readRatio: number,
  consistencyRequirement: 'strong' | 'eventual' | 'causal',
  dataLossAcceptable: boolean
): CacheStrategy {
  // Strong consistency requirements
  if (consistencyRequirement === 'strong') {
    return 'write_through';
  }

  // Write-heavy workloads
  if (readRatio < 0.3) {
    if (dataLossAcceptable) {
      return 'write_behind'; // Fast writes, async to DB
    }
    return 'write_around'; // Skip cache for writes
  }

  // Read-heavy workloads
  if (readRatio > 0.7) {
    return 'cache_aside'; // Most flexible for reads
  }

  // Balanced workload
  if (dataLossAcceptable && readRatio < 0.6) {
    return 'write_behind'; // Good for both reads and writes
  }

  return 'cache_aside'; // Safe default
}