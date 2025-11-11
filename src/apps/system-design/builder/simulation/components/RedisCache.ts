import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * Redis Cache Component
 * In-memory key-value store for caching
 */
export class RedisCache extends Component {
  private readonly capacityPerGB = 10000; // RPS per GB (effectively unlimited)
  private readonly baseLatency = 1; // ms
  private readonly costPerGB = 50; // $/month

  constructor(
    id: string,
    config: {
      memorySizeGB?: number;
      ttl?: number;
      hitRatio?: number;
    } = {}
  ) {
    super(id, 'redis', {
      memorySizeGB: 4,
      ttl: 60,
      hitRatio: 0.9, // User-configured expected hit ratio
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    let effectiveHitRatio = this.config.hitRatio || 0.9;

    // Handle cache flush failure injection
    if (context?.testCase?.failureInjection?.type === 'cache_flush') {
      const currentTime = context.currentTime || 0;
      const failureStart = context.testCase.failureInjection.atSecond;

      if (currentTime < failureStart) {
        // Before flush - normal
        effectiveHitRatio = this.config.hitRatio;
      } else if (currentTime < failureStart + 10) {
        // First 10 seconds after flush - cold cache
        effectiveHitRatio = 0;
      } else if (currentTime < failureStart + 30) {
        // Next 20 seconds - warming up
        effectiveHitRatio = 0.5;
      } else {
        // After 30 seconds - back to normal
        effectiveHitRatio = this.config.hitRatio;
      }
    }

    const cacheHits = rps * effectiveHitRatio;
    const cacheMisses = rps * (1 - effectiveHitRatio);

    const memorySizeGB = this.config.memorySizeGB || 4;
    const capacity = memorySizeGB * this.capacityPerGB;
    const utilization = rps / capacity;

    return {
      latency: this.baseLatency,
      errorRate: 0, // Never fails in MVP
      utilization,
      cost: memorySizeGB * this.costPerGB,
      cacheHits,
      cacheMisses,
      dbLoad: cacheMisses, // Misses become DB load
      effectiveHitRatio,
    };
  }
}
