import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { REDIS_INSTANCES } from '../../types/instanceTypes';

/**
 * Redis Cache Component
 * In-memory key-value store for caching with real ElastiCache instance types
 */
export class RedisCache extends Component {
  private readonly baseLatency = 1; // ms

  constructor(
    id: string,
    config: {
      instanceType?: string;
      memorySizeGB?: number; // Legacy, for backward compatibility
      ttl?: number;
      hitRatio?: number;
      engine?: 'redis' | 'memcached';
      evictionPolicy?: 'lru' | 'lfu' | 'ttl' | 'random';
      persistence?: 'none' | 'rdb' | 'aof';
    } = {}
  ) {
    super(id, 'redis', {
      instanceType: 'cache.t3.small', // Default instance type
      ttl: 3600,
      hitRatio: 0.9, // User-configured expected hit ratio
      engine: 'redis',
      evictionPolicy: 'lru',
      persistence: 'rdb',
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    // Get instance specs
    const instanceType = this.config.instanceType || 'cache.t3.small';
    const instanceSpec = REDIS_INSTANCES[instanceType];

    // Fallback to legacy config or defaults if instance type not found
    let capacity: number;
    let monthlyCost: number;
    if (instanceSpec) {
      capacity = instanceSpec.requestsPerSecond;
      monthlyCost = instanceSpec.costPerHour * 730;
    } else {
      console.warn(`Unknown Redis instance type: ${instanceType}, using legacy config`);
      const memorySizeGB = this.config.memorySizeGB || 4;
      capacity = memorySizeGB * 10000; // 10K RPS per GB
      monthlyCost = memorySizeGB * 50;
    }

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

    const utilization = rps / capacity;

    // Add small cost for persistence (if enabled)
    let persistenceCost = 0;
    if (this.config.persistence === 'aof') {
      persistenceCost = monthlyCost * 0.1; // AOF adds ~10% overhead
    } else if (this.config.persistence === 'rdb') {
      persistenceCost = monthlyCost * 0.05; // RDB adds ~5% overhead
    }

    return {
      latency: this.baseLatency,
      errorRate: 0, // Never fails in MVP
      utilization,
      cost: monthlyCost + persistenceCost,
      cacheHits,
      cacheMisses,
      dbLoad: cacheMisses, // Misses become DB load
      effectiveHitRatio,
    };
  }
}
