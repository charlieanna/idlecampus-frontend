/**
 * Cache Hit Ratio Modeling Module (Phase 2.2)
 *
 * Provides dynamic cache hit ratio calculations based on:
 * - Working set size vs cache size
 * - TTL effects and expiration
 * - Access patterns (uniform, Zipf, temporal)
 * - Cache warming scenarios
 */

import { isEnabled, verboseLog } from './featureFlags';

/**
 * Cache access pattern types
 */
export type CacheAccessPattern = 'uniform' | 'zipf' | 'temporal' | 'bimodal';

/**
 * Cache configuration
 */
export interface CacheConfig {
  maxSizeGB: number; // Maximum cache size
  ttlSeconds: number; // Default TTL
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'random';
}

/**
 * Cache hit ratio result
 */
export interface CacheHitRatioResult {
  hitRatio: number; // 0-1
  effectiveCapacity: number; // Effective cache capacity after overhead
  evictionRate: number; // Items evicted per second
  missLatencyPenalty: number; // Additional ms for cache miss
  warnings: string[];
}

/**
 * Working set characteristics
 */
export interface WorkingSetConfig {
  totalDataSizeGB: number; // Total data in database
  hotDataPercentage: number; // % of data that's frequently accessed (0-1)
  avgItemSizeKB: number; // Average size of cached item
  readRps: number; // Read requests per second
  writeRps: number; // Write requests per second (invalidations)
}

/**
 * Calculate cache hit ratio based on working set vs cache size
 *
 * Key insight: Hit ratio depends on how much of the working set fits in cache
 * - If cache > working set: high hit ratio (90%+)
 * - If cache < working set: hit ratio degrades based on access pattern
 */
export function calculateDynamicHitRatio(
  cacheConfig: CacheConfig,
  workingSet: WorkingSetConfig,
  accessPattern: CacheAccessPattern = 'zipf'
): CacheHitRatioResult {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_DYNAMIC_CACHE_HIT')) {
    // Legacy behavior - return fixed hit ratio
    return {
      hitRatio: 0.9, // Default 90% hit ratio
      effectiveCapacity: cacheConfig.maxSizeGB * 1024 * 1024, // Convert to KB
      evictionRate: 0,
      missLatencyPenalty: 0,
      warnings: [],
    };
  }

  // Calculate working set size
  const hotDataSizeGB = workingSet.totalDataSizeGB * workingSet.hotDataPercentage;

  // Overhead: ~20% of cache size is metadata (keys, pointers, etc.)
  const effectiveCapacityGB = cacheConfig.maxSizeGB * 0.8;
  const effectiveCapacityKB = effectiveCapacityGB * 1024 * 1024;

  // Cache coverage ratio
  const coverageRatio = effectiveCapacityGB / hotDataSizeGB;

  let hitRatio: number;

  // Calculate hit ratio based on access pattern
  switch (accessPattern) {
    case 'zipf':
      // Zipf distribution (80/20 rule) - most accesses go to small subset
      // Even small cache gives good hit ratio
      hitRatio = calculateZipfHitRatio(coverageRatio);
      break;

    case 'uniform':
      // Uniform access - hit ratio proportional to coverage
      hitRatio = Math.min(coverageRatio, 1.0);
      break;

    case 'temporal':
      // Temporal locality - recent items accessed more
      // Good for time-series data
      hitRatio = calculateTemporalHitRatio(coverageRatio, cacheConfig.ttlSeconds);
      break;

    case 'bimodal':
      // Two distinct access patterns (e.g., hot users vs cold users)
      hitRatio = calculateBimodalHitRatio(coverageRatio);
      break;

    default:
      hitRatio = calculateZipfHitRatio(coverageRatio);
  }

  // Apply TTL effects
  // Shorter TTL = more misses due to expiration
  const ttlEffectFactor = calculateTTLEffect(cacheConfig.ttlSeconds, workingSet.readRps);
  hitRatio = hitRatio * ttlEffectFactor;

  // Apply write invalidation effects
  // More writes = more cache invalidations = lower hit ratio
  const invalidationFactor = calculateInvalidationEffect(
    workingSet.readRps,
    workingSet.writeRps,
    cacheConfig.ttlSeconds
  );
  hitRatio = hitRatio * invalidationFactor;

  // Calculate eviction rate (items evicted per second)
  const itemsInCache = effectiveCapacityKB / workingSet.avgItemSizeKB;
  const accessRate = workingSet.readRps + workingSet.writeRps;
  const evictionRate = Math.max(0, accessRate * (1 - hitRatio));

  // Miss latency penalty (time to fetch from database)
  const missLatencyPenalty = hitRatio < 0.5 ? 50 : 25; // Higher penalty at low hit ratio

  // Generate warnings
  if (hitRatio < 0.5) {
    warnings.push(`Low cache hit ratio: ${(hitRatio * 100).toFixed(1)}%. Consider increasing cache size.`);
  }

  if (coverageRatio < 0.3) {
    warnings.push(
      `Cache size (${cacheConfig.maxSizeGB}GB) much smaller than hot data (${hotDataSizeGB.toFixed(1)}GB)`
    );
  }

  if (workingSet.writeRps > workingSet.readRps * 0.5) {
    warnings.push('High write ratio causing frequent cache invalidations');
  }

  verboseLog('Cache hit ratio calculated', {
    hitRatio,
    coverageRatio,
    accessPattern,
    ttlEffectFactor,
    invalidationFactor,
  });

  return {
    hitRatio: Math.max(0, Math.min(hitRatio, 1)), // Clamp to 0-1
    effectiveCapacity: effectiveCapacityKB,
    evictionRate,
    missLatencyPenalty,
    warnings,
  };
}

/**
 * Calculate hit ratio for Zipf (power-law) access pattern
 * Based on: h ≈ 1 - (1/coverage)^α where α ≈ 0.8 for typical web workloads
 */
function calculateZipfHitRatio(coverageRatio: number): number {
  if (coverageRatio >= 1) {
    return 0.99; // Cache can hold entire working set
  }

  if (coverageRatio <= 0.01) {
    return 0.2; // Very small cache, only top 20% hit
  }

  // Zipf's law: top N% of items account for (N)^0.8 of accesses
  const alpha = 0.8;
  return Math.pow(coverageRatio, alpha);
}

/**
 * Calculate hit ratio for temporal access pattern
 */
function calculateTemporalHitRatio(coverageRatio: number, ttlSeconds: number): number {
  // Temporal locality means recent items are accessed more
  // TTL is more important here
  const baseRatio = Math.min(coverageRatio * 1.2, 1.0); // Boost for temporal locality
  const ttlFactor = Math.min(ttlSeconds / 3600, 1.0); // Normalize to 1 hour

  return baseRatio * (0.7 + 0.3 * ttlFactor);
}

/**
 * Calculate hit ratio for bimodal access pattern
 */
function calculateBimodalHitRatio(coverageRatio: number): number {
  // Two modes: hot (20% of data, 80% of accesses) and cold
  const hotCoverage = Math.min(coverageRatio * 5, 1.0); // Hot data fits?
  const coldCoverage = coverageRatio;

  return 0.8 * hotCoverage + 0.2 * Math.min(coldCoverage, 0.5);
}

/**
 * Calculate TTL effect on hit ratio
 * Shorter TTL = more expiration-based misses
 */
function calculateTTLEffect(ttlSeconds: number, readRps: number): number {
  if (ttlSeconds <= 0) {
    return 0.5; // No TTL = frequent expiration issues
  }

  // Calculate average time between accesses to same item
  // If TTL < avg access interval, items expire before being reused
  const avgAccessIntervalSeconds = 1 / Math.max(readRps, 1);
  const ttlToAccessRatio = ttlSeconds / avgAccessIntervalSeconds;

  if (ttlToAccessRatio > 100) {
    return 1.0; // TTL much longer than access interval
  }

  if (ttlToAccessRatio < 1) {
    return 0.5; // TTL too short
  }

  return 0.8 + 0.2 * Math.min(ttlToAccessRatio / 100, 1.0);
}

/**
 * Calculate write invalidation effect
 * More writes = more cache invalidations
 */
function calculateInvalidationEffect(
  readRps: number,
  writeRps: number,
  ttlSeconds: number
): number {
  if (writeRps === 0) {
    return 1.0; // No writes, no invalidations
  }

  const readWriteRatio = readRps / Math.max(writeRps, 1);

  if (readWriteRatio > 100) {
    return 1.0; // Reads dominate, minimal invalidation impact
  }

  if (readWriteRatio < 1) {
    return 0.5; // More writes than reads, heavy invalidation
  }

  // Linear interpolation
  return 0.5 + 0.5 * Math.min(readWriteRatio / 100, 1.0);
}

/**
 * Calculate cache warming time
 * Time needed to reach target hit ratio from cold start
 */
export function calculateWarmingTime(
  targetHitRatio: number,
  cacheConfig: CacheConfig,
  workingSet: WorkingSetConfig
): number {
  // Items needed in cache to reach target hit ratio
  const itemsNeeded = (targetHitRatio * workingSet.totalDataSizeGB * 1024 * 1024) / workingSet.avgItemSizeKB;

  // Time to fill cache (assuming each miss populates cache)
  const missRate = 1 - targetHitRatio;
  const populationRate = workingSet.readRps * missRate;

  const warmingTimeSeconds = itemsNeeded / Math.max(populationRate, 1);

  return Math.min(warmingTimeSeconds, 3600); // Cap at 1 hour
}

/**
 * Get recommended cache size based on working set
 */
export function getRecommendedCacheSize(
  workingSet: WorkingSetConfig,
  targetHitRatio: number = 0.9,
  accessPattern: CacheAccessPattern = 'zipf'
): number {
  const hotDataSizeGB = workingSet.totalDataSizeGB * workingSet.hotDataPercentage;

  // For Zipf pattern, we need less cache to achieve same hit ratio
  let requiredCoverageRatio: number;

  switch (accessPattern) {
    case 'zipf':
      // Inverse of Zipf hit ratio calculation
      requiredCoverageRatio = Math.pow(targetHitRatio, 1 / 0.8);
      break;
    case 'uniform':
      requiredCoverageRatio = targetHitRatio;
      break;
    default:
      requiredCoverageRatio = targetHitRatio;
  }

  // Add 20% overhead for metadata
  const recommendedSizeGB = (hotDataSizeGB * requiredCoverageRatio) / 0.8;

  return Math.ceil(recommendedSizeGB * 10) / 10; // Round to 1 decimal place
}
