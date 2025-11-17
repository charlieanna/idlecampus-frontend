/**
 * Feature Flags for Traffic Simulator
 *
 * This system allows gradual rollout of new features with easy rollback.
 * All new features should be guarded by a feature flag.
 *
 * Usage:
 *   import { isEnabled, enableFeature, disableFeature } from './featureFlags';
 *
 *   if (isEnabled('ENABLE_RETRY_LOGIC')) {
 *     // New retry logic
 *   } else {
 *     // Old behavior
 *   }
 */

export interface FeatureFlags {
  // Phase 1: Foundation
  USE_ACCURATE_PERCENTILES: boolean; // Fix hardcoded p99 = p50 * 1.8
  ENABLE_MULTI_DB: boolean; // Support multiple databases/shards
  ENABLE_GRAPH_CYCLES: boolean; // Allow cycles in graph (for circuit breakers)
  ENABLE_LB_ALGORITHMS: boolean; // Load balancer algorithm selection
  ENABLE_REQUEST_PRIORITY: boolean; // Request priority and timeout fields

  // Phase 2: Data Layer
  ENABLE_DB_CONNECTION_POOL: boolean; // Database connection pool modeling
  ENABLE_DYNAMIC_CACHE_HIT: boolean; // Dynamic cache hit ratio based on working set
  ENABLE_STORAGE_COSTS: boolean; // Storage cost calculations with data growth

  // Phase 2: Reliability
  ENABLE_RETRY_LOGIC: boolean; // Retry with exponential backoff
  ENABLE_CIRCUIT_BREAKER: boolean; // Circuit breaker pattern
  ENABLE_TIMEOUT_ENFORCEMENT: boolean; // Request timeout enforcement
  ENABLE_ENHANCED_FAILURES: boolean; // More failure modes
  ENABLE_BACKPRESSURE: boolean; // Queue backpressure simulation

  // Phase 3: Advanced Traffic
  ENABLE_TRAFFIC_PATTERNS: boolean; // Daily/weekly traffic patterns
  ENABLE_REQUEST_DEPENDENCIES: boolean; // Sequential/parallel request flows
  ENABLE_FAILURE_INJECTION: boolean; // Chaos engineering scenarios

  // Phase 3: Advanced
  ENABLE_WEIGHTED_ROUTING: boolean; // Conditional/weighted routing
  ENABLE_MULTI_REGION: boolean; // Multi-region latency
  ENABLE_ADVANCED_SHARDING: boolean; // Consistent hashing, hot shard detection

  // Testing/Development
  ENABLE_VERBOSE_LOGGING: boolean; // Detailed simulation logging
  ENABLE_DETERMINISTIC_RANDOM: boolean; // Seeded random for reproducible tests
}

export const DEFAULT_FLAGS: FeatureFlags = {
  // Phase 1: Foundation - All disabled by default
  USE_ACCURATE_PERCENTILES: false,
  ENABLE_MULTI_DB: false,
  ENABLE_GRAPH_CYCLES: false,
  ENABLE_LB_ALGORITHMS: false,
  ENABLE_REQUEST_PRIORITY: false,

  // Phase 2: Data Layer - All disabled by default
  ENABLE_DB_CONNECTION_POOL: false,
  ENABLE_DYNAMIC_CACHE_HIT: false,
  ENABLE_STORAGE_COSTS: false,

  // Phase 2: Reliability - All disabled by default
  ENABLE_RETRY_LOGIC: false,
  ENABLE_CIRCUIT_BREAKER: false,
  ENABLE_TIMEOUT_ENFORCEMENT: false,
  ENABLE_ENHANCED_FAILURES: false,
  ENABLE_BACKPRESSURE: false,

  // Phase 3: Advanced Traffic - All disabled by default
  ENABLE_TRAFFIC_PATTERNS: false,
  ENABLE_REQUEST_DEPENDENCIES: false,
  ENABLE_FAILURE_INJECTION: false,

  // Phase 3: Advanced - All disabled by default
  ENABLE_WEIGHTED_ROUTING: false,
  ENABLE_MULTI_REGION: false,
  ENABLE_ADVANCED_SHARDING: false,

  // Testing/Development
  ENABLE_VERBOSE_LOGGING: false,
  ENABLE_DETERMINISTIC_RANDOM: false,
};

// Current active flags (mutable singleton)
let currentFlags: FeatureFlags = { ...DEFAULT_FLAGS };

// Random seed for deterministic simulations
let randomSeed: number = Date.now();

/**
 * Check if a feature flag is enabled
 */
export function isEnabled(flag: keyof FeatureFlags): boolean {
  return currentFlags[flag];
}

/**
 * Enable a specific feature flag
 */
export function enableFeature(flag: keyof FeatureFlags): void {
  currentFlags[flag] = true;
}

/**
 * Disable a specific feature flag
 */
export function disableFeature(flag: keyof FeatureFlags): void {
  currentFlags[flag] = false;
}

/**
 * Enable multiple feature flags at once
 */
export function enableFeatures(flags: Array<keyof FeatureFlags>): void {
  for (const flag of flags) {
    currentFlags[flag] = true;
  }
}

/**
 * Disable multiple feature flags at once
 */
export function disableFeatures(flags: Array<keyof FeatureFlags>): void {
  for (const flag of flags) {
    currentFlags[flag] = false;
  }
}

/**
 * Reset all flags to default values
 */
export function resetFlags(): void {
  currentFlags = { ...DEFAULT_FLAGS };
}

/**
 * Get current state of all flags
 */
export function getAllFlags(): Readonly<FeatureFlags> {
  return { ...currentFlags };
}

/**
 * Set multiple flags at once (merge with current)
 */
export function setFlags(flags: Partial<FeatureFlags>): void {
  currentFlags = { ...currentFlags, ...flags };
}

/**
 * Set the random seed for deterministic simulations
 */
export function setRandomSeed(seed: number): void {
  randomSeed = seed;
}

/**
 * Get the current random seed
 */
export function getRandomSeed(): number {
  return randomSeed;
}

/**
 * Generate a deterministic random number (0-1) if flag enabled
 * Uses simple LCG algorithm for reproducibility
 */
export function getSeededRandom(): number {
  if (isEnabled('ENABLE_DETERMINISTIC_RANDOM')) {
    // Linear Congruential Generator
    randomSeed = (randomSeed * 1664525 + 1013904223) % 4294967296;
    return randomSeed / 4294967296;
  }
  return Math.random();
}

/**
 * Get a random number with optional seed override
 * Useful for per-request randomness based on request ID
 */
export function getSeededRandomWithSeed(seed: number): number {
  if (isEnabled('ENABLE_DETERMINISTIC_RANDOM')) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  return Math.random();
}

/**
 * Log if verbose logging is enabled
 */
export function verboseLog(message: string, ...args: unknown[]): void {
  if (isEnabled('ENABLE_VERBOSE_LOGGING')) {
    console.log(`[SimulatorVerbose] ${message}`, ...args);
  }
}

/**
 * Get feature flag status report (for debugging)
 */
export function getFlagReport(): string {
  const lines: string[] = ['Feature Flag Status:'];

  for (const [key, value] of Object.entries(currentFlags)) {
    const status = value ? '✅ ENABLED' : '❌ DISABLED';
    lines.push(`  ${key}: ${status}`);
  }

  return lines.join('\n');
}

/**
 * Check if any Phase 2 features are enabled
 */
export function hasReliabilityFeatures(): boolean {
  return (
    isEnabled('ENABLE_RETRY_LOGIC') ||
    isEnabled('ENABLE_CIRCUIT_BREAKER') ||
    isEnabled('ENABLE_TIMEOUT_ENFORCEMENT') ||
    isEnabled('ENABLE_BACKPRESSURE')
  );
}

/**
 * Check if any Phase 3 features are enabled
 */
export function hasAdvancedFeatures(): boolean {
  return (
    isEnabled('ENABLE_WEIGHTED_ROUTING') ||
    isEnabled('ENABLE_MULTI_REGION') ||
    isEnabled('ENABLE_ADVANCED_SHARDING')
  );
}

// Export for testing purposes
export const __test__ = {
  resetToDefault: resetFlags,
  setAllEnabled: () => {
    for (const key of Object.keys(currentFlags) as Array<keyof FeatureFlags>) {
      currentFlags[key] = true;
    }
  },
  setAllDisabled: () => {
    for (const key of Object.keys(currentFlags) as Array<keyof FeatureFlags>) {
      currentFlags[key] = false;
    }
  },
};
