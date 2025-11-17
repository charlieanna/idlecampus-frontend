import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import {
  LoadBalancingAlgorithm,
  LoadBalancerState,
  distributeTraffic,
  BackendInstance,
} from '../loadBalancing';
import { isEnabled, verboseLog } from '../featureFlags';

/**
 * Load Balancer Component
 * Distributes traffic across app servers with configurable algorithms
 */
export class LoadBalancer extends Component {
  private readonly capacity = 100000; // RPS (effectively unlimited for MVP)
  private readonly baseLatency = 1; // ms
  private readonly monthlyCost = 50; // dollars

  // Load balancing configuration
  private algorithm: LoadBalancingAlgorithm = 'round_robin';
  private backends: BackendInstance[] = [];
  private lbState: LoadBalancerState = new LoadBalancerState();
  private lastDistribution: Map<string, number> = new Map();
  private lastWarnings: string[] = [];

  constructor(
    id: string,
    config: {
      algorithm?: LoadBalancingAlgorithm;
      backends?: BackendInstance[];
    } = {}
  ) {
    super(id, 'load_balancer', config);

    if (config.algorithm) {
      this.algorithm = config.algorithm;
    }
    if (config.backends) {
      this.backends = config.backends;
    }
  }

  /**
   * Set the load balancing algorithm
   */
  setAlgorithm(algorithm: LoadBalancingAlgorithm): void {
    this.algorithm = algorithm;
    this.lbState.reset(); // Reset state when algorithm changes
    verboseLog('Load balancer algorithm changed', { id: this.id, algorithm });
  }

  /**
   * Get current algorithm
   */
  getAlgorithm(): LoadBalancingAlgorithm {
    return this.algorithm;
  }

  /**
   * Set backend instances
   */
  setBackends(backends: BackendInstance[]): void {
    this.backends = backends;
    this.lbState.reset();
    verboseLog('Load balancer backends updated', {
      id: this.id,
      numBackends: backends.length,
    });
  }

  /**
   * Get backend instances
   */
  getBackends(): BackendInstance[] {
    return this.backends;
  }

  /**
   * Get the load distribution from last simulation
   */
  getLastDistribution(): Map<string, number> {
    return this.lastDistribution;
  }

  /**
   * Get warnings from last simulation
   */
  getLastWarnings(): string[] {
    return this.lastWarnings;
  }

  /**
   * Select next backend for a single request (used by traffic flow engine)
   */
  selectNextBackend(requestKey?: string): string | null {
    if (!isEnabled('ENABLE_LB_ALGORITHMS') || this.backends.length === 0) {
      return null; // Let the engine handle it
    }

    const healthyBackends = this.backends.filter((b) => b.isHealthy !== false);
    if (healthyBackends.length === 0) {
      return null;
    }

    try {
      switch (this.algorithm) {
        case 'round_robin':
          return this.lbState.getNextRoundRobin(this.backends);

        case 'weighted_round_robin':
          return this.lbState.getNextWeightedRoundRobin(this.backends);

        case 'least_connections':
          const selected = this.lbState.getLeastConnections(this.backends);
          this.lbState.incrementConnections(selected);
          return selected;

        case 'ip_hash':
          if (!requestKey) {
            requestKey = `request-${this.lbState.getTotalRequests()}`;
          }
          return this.selectBackendByHash(requestKey);

        case 'random':
          return this.selectBackendRandom();

        case 'weighted_random':
          return this.selectBackendWeightedRandom();

        default:
          return this.lbState.getNextRoundRobin(this.backends);
      }
    } catch (error) {
      verboseLog('Error selecting backend', { error: String(error) });
      return null;
    }
  }

  /**
   * Mark a request as completed (for least connections algorithm)
   */
  releaseConnection(backendId: string): void {
    if (this.algorithm === 'least_connections') {
      this.lbState.decrementConnections(backendId);
    }
  }

  /**
   * Select backend using IP hash
   */
  private selectBackendByHash(key: string): string {
    const healthyBackends = this.backends.filter((b) => b.isHealthy !== false);

    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    const index = Math.abs(hash) % healthyBackends.length;
    return healthyBackends[index].id;
  }

  /**
   * Select backend randomly
   */
  private selectBackendRandom(): string {
    const healthyBackends = this.backends.filter((b) => b.isHealthy !== false);
    const index = Math.floor(Math.random() * healthyBackends.length);
    return healthyBackends[index].id;
  }

  /**
   * Select backend with weighted random
   */
  private selectBackendWeightedRandom(): string {
    const healthyBackends = this.backends.filter((b) => b.isHealthy !== false);
    const totalWeight = healthyBackends.reduce((sum, b) => sum + (b.weight ?? 1), 0);
    const random = Math.random() * totalWeight;

    let cumulative = 0;
    for (const backend of healthyBackends) {
      cumulative += backend.weight ?? 1;
      if (random <= cumulative) {
        return backend.id;
      }
    }

    return healthyBackends[healthyBackends.length - 1].id;
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const utilization = rps / this.capacity;

    // If load balancing algorithms are enabled and we have backends, distribute traffic
    if (isEnabled('ENABLE_LB_ALGORITHMS') && this.backends.length > 0) {
      const result = distributeTraffic(rps, {
        algorithm: this.algorithm,
        backends: this.backends,
      });

      this.lastDistribution = result.loadDistribution;
      this.lastWarnings = result.warnings;

      verboseLog('Load balancer simulation', {
        id: this.id,
        algorithm: this.algorithm,
        rps,
        distribution: Object.fromEntries(result.loadDistribution),
        warnings: result.warnings,
      });
    }

    // Calculate latency with slight overhead for complex algorithms
    let latency = this.baseLatency;
    if (isEnabled('ENABLE_LB_ALGORITHMS')) {
      switch (this.algorithm) {
        case 'least_connections':
          latency = this.baseLatency * 1.2; // Extra overhead for connection tracking
          break;
        case 'ip_hash':
          latency = this.baseLatency * 1.1; // Hash computation overhead
          break;
        case 'weighted_round_robin':
          latency = this.baseLatency * 1.05; // Weight calculation overhead
          break;
        default:
          latency = this.baseLatency;
      }
    }

    // Error rate based on load (only at extreme utilization)
    const errorRate = utilization > 0.95 ? (utilization - 0.95) * 2 : 0;

    return {
      latency,
      errorRate: Math.min(errorRate, 1),
      utilization,
      cost: this.monthlyCost,
    };
  }

  /**
   * Reset load balancer state
   */
  reset(): void {
    this.lbState.reset();
    this.lastDistribution.clear();
    this.lastWarnings = [];
  }
}

