/**
 * Latency Distribution Module
 *
 * Provides accurate percentile calculations based on actual latency distributions.
 * Replaces the hardcoded multiplier approach (p99 = p50 * 1.8).
 *
 * Key insight: Real systems don't have fixed percentile ratios.
 * The ratio depends on:
 * - Number of components in the path (more components = more variance)
 * - Type of operations (DB reads vs writes vs cache hits)
 * - Load on the system (higher load = longer tail)
 * - Failure injection scenarios
 */

import { isEnabled } from './featureFlags';

/**
 * Distribution types for different components
 */
export type DistributionType =
  | 'exponential' // Network delays, queue waiting times
  | 'lognormal' // Service processing times
  | 'uniform' // Cache lookups, simple operations
  | 'bimodal'; // Cache hit vs miss scenarios

/**
 * Parameters for latency distribution
 */
export interface LatencyDistributionParams {
  mean: number; // Mean latency in ms
  variance?: number; // Variance (optional, will be estimated if not provided)
  distributionType?: DistributionType;
  loadFactor?: number; // 0-1, where 1 means at capacity (increases tail latency)
}

/**
 * Percentile results
 */
export interface PercentileResults {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  p999: number;
}

/**
 * Calculate percentiles using the old hardcoded multiplier method
 * Used when USE_ACCURATE_PERCENTILES flag is disabled
 */
export function calculatePercentilesLegacy(p50: number): PercentileResults {
  return {
    p50: p50,
    p90: p50 * 1.3,
    p95: p50 * 1.4,
    p99: p50 * 1.8,
    p999: p50 * 3.0,
  };
}

/**
 * Calculate percentiles for a single component's latency distribution
 *
 * Uses the inverse CDF (quantile function) for different distributions.
 * These are based on real-world observations:
 * - Lognormal: Service processing times (most common)
 * - Exponential: Queue waiting times, network delays
 * - Uniform: Cache lookups, simple in-memory operations
 */
export function calculateComponentPercentiles(
  params: LatencyDistributionParams
): PercentileResults {
  const { mean, distributionType = 'lognormal', loadFactor = 0 } = params;

  // Estimate variance if not provided
  // Higher load increases variance (more tail latency)
  const baseVarianceRatio = 0.3; // CV = 0.3 is typical for well-behaved services
  const loadAdjustedVariance = baseVarianceRatio * (1 + loadFactor * 2);
  const variance = params.variance ?? mean * loadAdjustedVariance;

  switch (distributionType) {
    case 'lognormal':
      return calculateLognormalPercentiles(mean, variance);
    case 'exponential':
      return calculateExponentialPercentiles(mean);
    case 'uniform':
      return calculateUniformPercentiles(mean, variance);
    case 'bimodal':
      return calculateBimodalPercentiles(mean, variance);
    default:
      return calculateLognormalPercentiles(mean, variance);
  }
}

/**
 * Calculate percentiles for lognormal distribution
 *
 * Lognormal is common for service response times because:
 * - It's always positive
 * - It has a long right tail (occasional slow responses)
 * - It matches empirical data well
 */
function calculateLognormalPercentiles(
  mean: number,
  variance: number
): PercentileResults {
  // Convert mean and variance to lognormal parameters (mu, sigma)
  // For lognormal: E[X] = exp(mu + sigma^2/2), Var[X] = (exp(sigma^2) - 1) * exp(2*mu + sigma^2)
  const sigma2 = Math.log(1 + variance / (mean * mean));
  const sigma = Math.sqrt(sigma2);
  const mu = Math.log(mean) - sigma2 / 2;

  // Quantile function for lognormal: Q(p) = exp(mu + sigma * Phi^-1(p))
  // where Phi^-1 is the inverse standard normal CDF
  const p50 = Math.exp(mu + sigma * inverseCDF(0.5));
  const p90 = Math.exp(mu + sigma * inverseCDF(0.9));
  const p95 = Math.exp(mu + sigma * inverseCDF(0.95));
  const p99 = Math.exp(mu + sigma * inverseCDF(0.99));
  const p999 = Math.exp(mu + sigma * inverseCDF(0.999));

  return { p50, p90, p95, p99, p999 };
}

/**
 * Calculate percentiles for exponential distribution
 *
 * Exponential is used for:
 * - Time between events (Poisson process)
 * - Queue waiting times (M/M/1)
 * - Network delays
 */
function calculateExponentialPercentiles(mean: number): PercentileResults {
  // Quantile function for exponential: Q(p) = -mean * ln(1 - p)
  const p50 = -mean * Math.log(1 - 0.5);
  const p90 = -mean * Math.log(1 - 0.9);
  const p95 = -mean * Math.log(1 - 0.95);
  const p99 = -mean * Math.log(1 - 0.99);
  const p999 = -mean * Math.log(1 - 0.999);

  return { p50, p90, p95, p99, p999 };
}

/**
 * Calculate percentiles for uniform distribution
 *
 * Uniform is used for:
 * - Cache lookups (consistent performance)
 * - Simple in-memory operations
 * - Operations with known bounds
 */
function calculateUniformPercentiles(
  mean: number,
  variance: number
): PercentileResults {
  // Uniform distribution: a = mean - sqrt(3*variance), b = mean + sqrt(3*variance)
  const range = Math.sqrt(12 * variance);
  const a = mean - range / 2;
  const b = mean + range / 2;

  // Quantile function for uniform: Q(p) = a + p * (b - a)
  const p50 = a + 0.5 * (b - a);
  const p90 = a + 0.9 * (b - a);
  const p95 = a + 0.95 * (b - a);
  const p99 = a + 0.99 * (b - a);
  const p999 = a + 0.999 * (b - a);

  return { p50, p90, p95, p99, p999 };
}

/**
 * Calculate percentiles for bimodal distribution
 *
 * Bimodal is used for:
 * - Cache hit vs miss scenarios (fast cache hit, slow DB read)
 * - Circuit breaker states (fast reject vs slow timeout)
 */
function calculateBimodalPercentiles(
  mean: number,
  variance: number
): PercentileResults {
  // Model as mixture of two normals: 90% fast, 10% slow
  // Fast mode: mean * 0.5, Slow mode: mean * 5.5 (weighted average = mean)
  const fastMean = mean * 0.5;
  const slowMean = mean * 5.5;
  const fastWeight = 0.9;

  // Use weighted percentiles
  // For p50: most requests are fast
  const p50 = fastMean;
  // For p90: still mostly fast
  const p90 = fastMean * 1.5;
  // For p95: starting to see slow requests
  const p95 = slowMean * 0.7;
  // For p99: definitely slow requests
  const p99 = slowMean;
  // For p999: worst case
  const p999 = slowMean * 1.5;

  return { p50, p90, p95, p99, p999 };
}

/**
 * Inverse of standard normal CDF (probit function)
 *
 * Uses Abramowitz and Stegun approximation (accurate to 4.5e-4)
 * This is the heart of statistical percentile calculation.
 */
function inverseCDF(p: number): number {
  // Handle edge cases
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Abramowitz and Stegun approximation for inverse normal CDF
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;

  let t: number;
  if (p < 0.5) {
    t = Math.sqrt(-2 * Math.log(p));
    return -(t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
  } else {
    t = Math.sqrt(-2 * Math.log(1 - p));
    return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
  }
}

/**
 * Combine multiple latency distributions along a request path
 *
 * When a request traverses multiple components, the total latency
 * is the sum of individual latencies. For independent random variables:
 * - Sum of means = sum of individual means
 * - Sum of variances = sum of individual variances (if independent)
 *
 * This is more accurate than simply multiplying p50 by fixed ratios.
 */
export function combineLatencyDistributions(
  distributions: LatencyDistributionParams[]
): PercentileResults {
  if (distributions.length === 0) {
    return { p50: 0, p90: 0, p95: 0, p99: 0, p999: 0 };
  }

  // Sum means and variances (Central Limit Theorem)
  let totalMean = 0;
  let totalVariance = 0;
  let maxLoadFactor = 0;

  for (const dist of distributions) {
    totalMean += dist.mean;

    // Estimate variance if not provided
    const baseVarianceRatio = 0.3;
    const loadAdjusted = baseVarianceRatio * (1 + (dist.loadFactor ?? 0) * 2);
    const variance = dist.variance ?? dist.mean * loadAdjusted;
    totalVariance += variance;

    maxLoadFactor = Math.max(maxLoadFactor, dist.loadFactor ?? 0);
  }

  // For combined distribution, use lognormal (sum of lognormals is approximately lognormal)
  return calculateComponentPercentiles({
    mean: totalMean,
    variance: totalVariance,
    distributionType: 'lognormal',
    loadFactor: maxLoadFactor,
  });
}

/**
 * Calculate percentiles for a complete request path
 *
 * This is the main entry point for the simulation engine.
 * It respects the USE_ACCURATE_PERCENTILES feature flag.
 */
export function calculateRequestPercentiles(
  readLatency: number,
  writeLatency: number,
  readRps: number,
  writeRps: number,
  options?: {
    componentCount?: number; // Number of components in path (affects variance)
    cacheHitRatio?: number; // Cache hit ratio (affects bimodal distribution)
    loadFactor?: number; // System load (0-1)
  }
): PercentileResults {
  const totalRps = readRps + writeRps;

  // Calculate weighted average p50
  // If no traffic, use readLatency as baseline (fallback for L6 tests without entry points)
  const p50 = totalRps === 0 
    ? readLatency 
    : (readRps * readLatency + writeRps * writeLatency) / totalRps;

  // If both latency and RPS are zero, return all zeros
  if (p50 === 0) {
    return { p50: 0, p90: 0, p95: 0, p99: 0, p999: 0 };
  }

  // Check feature flag
  if (!isEnabled('USE_ACCURATE_PERCENTILES')) {
    return calculatePercentilesLegacy(p50);
  }

  // Use accurate calculation
  const {
    componentCount = 3,
    cacheHitRatio = 0.9,
    loadFactor = 0,
  } = options ?? {};

  // Estimate variance based on path characteristics
  // More components = more variance (each adds randomness)
  // Lower cache hit ratio = more variance (DB reads are slower and more variable)
  const baseCoefficient = 0.3; // Coefficient of variation
  const componentFactor = 1 + (componentCount - 1) * 0.1; // Each additional component adds 10% variance
  const cacheFactor = 1 + (1 - cacheHitRatio) * 1.5; // Cache misses add 1.5x variance
  const loadFactorMultiplier = 1 + loadFactor * 1.5; // High load adds 1.5x variance (moderate impact)

  const coefficientOfVariation =
    baseCoefficient * componentFactor * cacheFactor * loadFactorMultiplier;
  const variance = p50 * p50 * coefficientOfVariation * coefficientOfVariation;

  // Always use lognormal for combined request path
  // Lognormal is the most realistic for service response times
  // The cache hit ratio affects the variance, not the distribution type
  const distributionType: DistributionType = 'lognormal';

  return calculateComponentPercentiles({
    mean: p50,
    variance,
    distributionType,
    loadFactor,
  });
}

/**
 * Validate percentile results (sanity checks)
 */
export function validatePercentiles(results: PercentileResults): boolean {
  // Basic sanity checks
  if (results.p50 < 0) return false;
  if (results.p90 < results.p50) return false;
  if (results.p95 < results.p90) return false;
  if (results.p99 < results.p95) return false;
  if (results.p999 < results.p99) return false;

  // Check that ratios are reasonable (not too extreme)
  if (results.p99 > results.p50 * 10) return false; // p99 shouldn't be 10x p50
  if (results.p999 > results.p50 * 20) return false; // p999 shouldn't be 20x p50

  return true;
}
