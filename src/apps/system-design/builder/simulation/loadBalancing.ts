/**
 * Load Balancing Algorithms Module
 *
 * Provides realistic load balancing strategies for distributing traffic
 * across multiple backend instances. This is essential for simulating
 * real-world distributed systems behavior.
 *
 * Key insight: Different algorithms have different performance characteristics:
 * - Round Robin: Simple but ignores server load
 * - Weighted Round Robin: Respects server capacity
 * - Least Connections: Good for varying request durations
 * - IP Hash: Session persistence but can cause hot spots
 * - Random: Simple, good for large number of servers
 */

import { isEnabled, verboseLog } from './featureFlags';

/**
 * Load balancing algorithm types
 */
export type LoadBalancingAlgorithm =
  | 'round_robin' // Simple rotation through backends
  | 'weighted_round_robin' // Rotation with weights based on capacity
  | 'least_connections' // Route to server with fewest active connections
  | 'ip_hash' // Hash-based routing for session affinity
  | 'random' // Random selection
  | 'weighted_random'; // Random with probability proportional to weight

/**
 * Backend server instance information
 */
export interface BackendInstance {
  id: string;
  weight?: number; // Relative weight (default: 1)
  capacity?: number; // Max RPS this instance can handle
  activeConnections?: number; // Current active connections
  isHealthy?: boolean; // Health check status
}

/**
 * Load balancing result
 */
export interface LoadBalancingResult {
  selectedBackend: string;
  loadDistribution: Map<string, number>; // Backend ID -> RPS assigned
  warnings: string[];
}

/**
 * Configuration for load balancer
 */
export interface LoadBalancerConfig {
  algorithm: LoadBalancingAlgorithm;
  backends: BackendInstance[];
  stickySessionKey?: string; // For IP hash
}

/**
 * Load Balancer State Manager
 * Maintains state for stateful algorithms (round robin, least connections)
 */
export class LoadBalancerState {
  private roundRobinIndex: number = 0;
  private connectionCounts: Map<string, number> = new Map();
  private weightedIndices: Map<string, number> = new Map();
  private totalRequests: number = 0;

  /**
   * Get next backend using round robin
   */
  getNextRoundRobin(backends: BackendInstance[]): string {
    const healthyBackends = backends.filter((b) => b.isHealthy !== false);
    if (healthyBackends.length === 0) {
      throw new Error('No healthy backends available');
    }

    const selected = healthyBackends[this.roundRobinIndex % healthyBackends.length];
    this.roundRobinIndex++;
    return selected.id;
  }

  /**
   * Get next backend using weighted round robin
   * Uses smooth weighted round robin algorithm
   */
  getNextWeightedRoundRobin(backends: BackendInstance[]): string {
    const healthyBackends = backends.filter((b) => b.isHealthy !== false);
    if (healthyBackends.length === 0) {
      throw new Error('No healthy backends available');
    }

    // Calculate total weight
    const totalWeight = healthyBackends.reduce((sum, b) => sum + (b.weight ?? 1), 0);

    // Initialize weights if not done
    for (const backend of healthyBackends) {
      if (!this.weightedIndices.has(backend.id)) {
        this.weightedIndices.set(backend.id, 0);
      }
    }

    // Smooth weighted round robin algorithm
    let maxWeight = -Infinity;
    let selected: string = healthyBackends[0].id;

    for (const backend of healthyBackends) {
      const currentWeight = this.weightedIndices.get(backend.id)! + (backend.weight ?? 1);
      this.weightedIndices.set(backend.id, currentWeight);

      if (currentWeight > maxWeight) {
        maxWeight = currentWeight;
        selected = backend.id;
      }
    }

    // Reduce selected backend's weight by total
    this.weightedIndices.set(selected, maxWeight - totalWeight);

    return selected;
  }

  /**
   * Get backend with least connections
   */
  getLeastConnections(backends: BackendInstance[]): string {
    const healthyBackends = backends.filter((b) => b.isHealthy !== false);
    if (healthyBackends.length === 0) {
      throw new Error('No healthy backends available');
    }

    let minConnections = Infinity;
    let selected = healthyBackends[0].id;

    for (const backend of healthyBackends) {
      const connections =
        backend.activeConnections ?? this.connectionCounts.get(backend.id) ?? 0;

      // For weighted least connections: connections / weight
      const weightedConnections = connections / (backend.weight ?? 1);

      if (weightedConnections < minConnections) {
        minConnections = weightedConnections;
        selected = backend.id;
      }
    }

    return selected;
  }

  /**
   * Update connection count for a backend
   */
  incrementConnections(backendId: string): void {
    const current = this.connectionCounts.get(backendId) ?? 0;
    this.connectionCounts.set(backendId, current + 1);
  }

  /**
   * Decrement connection count when request completes
   */
  decrementConnections(backendId: string): void {
    const current = this.connectionCounts.get(backendId) ?? 0;
    this.connectionCounts.set(backendId, Math.max(0, current - 1));
  }

  /**
   * Get connection count for a backend
   */
  getConnectionCount(backendId: string): number {
    return this.connectionCounts.get(backendId) ?? 0;
  }

  /**
   * Get total requests processed
   */
  getTotalRequests(): number {
    return this.totalRequests;
  }

  /**
   * Increment total requests
   */
  incrementTotalRequests(): void {
    this.totalRequests++;
  }

  /**
   * Reset state
   */
  reset(): void {
    this.roundRobinIndex = 0;
    this.connectionCounts.clear();
    this.weightedIndices.clear();
    this.totalRequests = 0;
  }
}

/**
 * Select backend using IP hash (for session affinity)
 */
export function selectBackendByHash(
  backends: BackendInstance[],
  key: string
): string {
  const healthyBackends = backends.filter((b) => b.isHealthy !== false);
  if (healthyBackends.length === 0) {
    throw new Error('No healthy backends available');
  }

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % healthyBackends.length;
  return healthyBackends[index].id;
}

/**
 * Select backend randomly
 */
export function selectBackendRandom(backends: BackendInstance[]): string {
  const healthyBackends = backends.filter((b) => b.isHealthy !== false);
  if (healthyBackends.length === 0) {
    throw new Error('No healthy backends available');
  }

  const index = Math.floor(Math.random() * healthyBackends.length);
  return healthyBackends[index].id;
}

/**
 * Select backend with weighted random selection
 */
export function selectBackendWeightedRandom(backends: BackendInstance[]): string {
  const healthyBackends = backends.filter((b) => b.isHealthy !== false);
  if (healthyBackends.length === 0) {
    throw new Error('No healthy backends available');
  }

  // Calculate cumulative weights
  const totalWeight = healthyBackends.reduce((sum, b) => sum + (b.weight ?? 1), 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const backend of healthyBackends) {
    cumulative += backend.weight ?? 1;
    if (random <= cumulative) {
      return backend.id;
    }
  }

  // Fallback (shouldn't reach here)
  return healthyBackends[healthyBackends.length - 1].id;
}

/**
 * Distribute traffic across backends using specified algorithm
 * Returns distribution map showing RPS per backend
 */
export function distributeTraffic(
  totalRps: number,
  config: LoadBalancerConfig,
  state?: LoadBalancerState
): LoadBalancingResult {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_LB_ALGORITHMS')) {
    // Legacy mode: distribute evenly
    const healthyBackends = config.backends.filter((b) => b.isHealthy !== false);
    if (healthyBackends.length === 0) {
      return {
        selectedBackend: '',
        loadDistribution: new Map(),
        warnings: ['No healthy backends available'],
      };
    }

    const rpsPerBackend = totalRps / healthyBackends.length;
    const distribution = new Map<string, number>();
    for (const backend of healthyBackends) {
      distribution.set(backend.id, rpsPerBackend);
    }

    return {
      selectedBackend: healthyBackends[0].id,
      loadDistribution: distribution,
      warnings: [],
    };
  }

  // Use proper load balancing algorithm
  const lbState = state ?? new LoadBalancerState();
  const distribution = new Map<string, number>();

  // Initialize distribution
  for (const backend of config.backends) {
    if (backend.isHealthy !== false) {
      distribution.set(backend.id, 0);
    }
  }

  if (distribution.size === 0) {
    return {
      selectedBackend: '',
      loadDistribution: distribution,
      warnings: ['No healthy backends available'],
    };
  }

  // Simulate distributing requests according to algorithm
  const numRequests = Math.ceil(totalRps * 10); // Sample 10 seconds
  const scaleFactor = totalRps / numRequests;

  for (let i = 0; i < numRequests; i++) {
    let selectedBackend: string;

    switch (config.algorithm) {
      case 'round_robin':
        selectedBackend = lbState.getNextRoundRobin(config.backends);
        break;

      case 'weighted_round_robin':
        selectedBackend = lbState.getNextWeightedRoundRobin(config.backends);
        break;

      case 'least_connections':
        selectedBackend = lbState.getLeastConnections(config.backends);
        lbState.incrementConnections(selectedBackend);
        // Simulate request completion (decrement after some time)
        // For simplicity, decrement immediately after processing
        setTimeout(() => lbState.decrementConnections(selectedBackend), 0);
        break;

      case 'ip_hash':
        const key = config.stickySessionKey ?? `client-${i % 100}`; // Simulate 100 unique clients
        selectedBackend = selectBackendByHash(config.backends, key);
        break;

      case 'random':
        selectedBackend = selectBackendRandom(config.backends);
        break;

      case 'weighted_random':
        selectedBackend = selectBackendWeightedRandom(config.backends);
        break;

      default:
        selectedBackend = selectBackendRandom(config.backends);
    }

    const currentRps = distribution.get(selectedBackend) ?? 0;
    distribution.set(selectedBackend, currentRps + scaleFactor);

    lbState.incrementTotalRequests();
  }

  // Check for hot spots (one backend getting >70% of traffic)
  const maxRps = Math.max(...distribution.values());
  if (maxRps > totalRps * 0.7) {
    warnings.push(`Hot spot detected: One backend receiving ${((maxRps / totalRps) * 100).toFixed(1)}% of traffic`);
  }

  // Check for overloaded backends
  for (const backend of config.backends) {
    if (backend.capacity) {
      const assignedRps = distribution.get(backend.id) ?? 0;
      if (assignedRps > backend.capacity) {
        warnings.push(
          `Backend ${backend.id} overloaded: ${assignedRps.toFixed(0)} RPS exceeds capacity ${backend.capacity} RPS`
        );
      }
    }
  }

  verboseLog('Traffic distributed across backends', {
    algorithm: config.algorithm,
    totalRps,
    numBackends: distribution.size,
    distribution: Object.fromEntries(distribution),
  });

  return {
    selectedBackend: config.backends.filter((b) => b.isHealthy !== false)[0]?.id ?? '',
    loadDistribution: distribution,
    warnings,
  };
}

/**
 * Calculate load balancer metrics based on traffic distribution
 */
export function calculateLoadBalancerMetrics(
  totalRps: number,
  config: LoadBalancerConfig,
  backendMetrics: Map<string, { latency: number; errorRate: number }>
): {
  avgLatency: number;
  maxLatency: number;
  combinedErrorRate: number;
  utilizationSkew: number; // 0 = perfect balance, 1 = one backend handles all
} {
  const result = distributeTraffic(totalRps, config);

  if (result.loadDistribution.size === 0) {
    return {
      avgLatency: 0,
      maxLatency: 0,
      combinedErrorRate: 1,
      utilizationSkew: 1,
    };
  }

  let totalWeightedLatency = 0;
  let maxLatency = 0;
  let combinedSuccessRate = 1;
  let totalTraffic = 0;

  for (const [backendId, rps] of result.loadDistribution.entries()) {
    const metrics = backendMetrics.get(backendId);
    if (!metrics) continue;

    const weight = rps / totalRps;
    totalWeightedLatency += metrics.latency * weight;
    maxLatency = Math.max(maxLatency, metrics.latency);
    combinedSuccessRate *= 1 - metrics.errorRate;
    totalTraffic += rps;
  }

  const avgLatency = totalWeightedLatency;
  const combinedErrorRate = 1 - combinedSuccessRate;

  // Calculate utilization skew (Gini coefficient simplified)
  const rpsValues = Array.from(result.loadDistribution.values());
  const avgRps = totalTraffic / rpsValues.length;
  const deviation = rpsValues.reduce((sum, rps) => sum + Math.abs(rps - avgRps), 0);
  const maxDeviation = totalTraffic * (1 - 1 / rpsValues.length);
  const utilizationSkew = maxDeviation > 0 ? deviation / maxDeviation : 0;

  return {
    avgLatency,
    maxLatency,
    combinedErrorRate,
    utilizationSkew,
  };
}

/**
 * Get recommended algorithm based on use case
 */
export function getRecommendedAlgorithm(useCase: {
  hasSessionAffinity?: boolean;
  hasVaryingRequestDuration?: boolean;
  hasUnevenCapacity?: boolean;
  isHighVolume?: boolean;
}): LoadBalancingAlgorithm {
  if (useCase.hasSessionAffinity) {
    return 'ip_hash';
  }

  if (useCase.hasVaryingRequestDuration) {
    return 'least_connections';
  }

  if (useCase.hasUnevenCapacity) {
    return 'weighted_round_robin';
  }

  if (useCase.isHighVolume) {
    return 'random'; // O(1) selection, good for high volume
  }

  return 'round_robin'; // Default, simple and effective
}

/**
 * Validate load balancer configuration
 */
export function validateLoadBalancerConfig(config: LoadBalancerConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.backends.length === 0) {
    errors.push('No backends configured');
  }

  const healthyBackends = config.backends.filter((b) => b.isHealthy !== false);
  if (healthyBackends.length === 0) {
    errors.push('No healthy backends available');
  }

  // Check for negative weights
  for (const backend of config.backends) {
    if (backend.weight !== undefined && backend.weight <= 0) {
      errors.push(`Backend ${backend.id} has invalid weight: ${backend.weight}`);
    }

    if (backend.capacity !== undefined && backend.capacity <= 0) {
      errors.push(`Backend ${backend.id} has invalid capacity: ${backend.capacity}`);
    }
  }

  // Warn about IP hash without session key
  if (config.algorithm === 'ip_hash' && !config.stickySessionKey) {
    errors.push('IP hash algorithm selected but no sticky session key provided');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
