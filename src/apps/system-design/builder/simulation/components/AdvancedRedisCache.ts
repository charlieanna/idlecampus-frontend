import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { CacheStrategy } from '../../types/advancedConfig';

/**
 * Advanced Redis Cache with Multiple Strategies
 * Interview-level cache implementation
 */
export class AdvancedRedisCache extends Component {
  private readonly capacityPerGB = 10000; // RPS per GB
  private readonly baseLatency = 1; // ms
  private readonly costPerGB = 50; // $/month

  constructor(
    id: string,
    config: {
      memorySizeGB?: number;
      ttl?: number;
      hitRatio?: number;
      strategy?: CacheStrategy;
      writeBatchSize?: number;
      writeDelayMs?: number;
      evictionPolicy?: 'lru' | 'lfu' | 'fifo';
    } = {}
  ) {
    super(id, 'redis', {
      memorySizeGB: 4,
      ttl: 3600,
      hitRatio: 0.9,
      strategy: 'cache_aside', // Default: application manages cache
      writeBatchSize: 100,
      writeDelayMs: 10,
      evictionPolicy: 'lru',
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const strategy = this.config.strategy as CacheStrategy || 'cache_aside';
    let effectiveHitRatio = this.config.hitRatio || 0.9;

    // Handle cache flush failure injection
    if (context?.testCase?.failureInjection?.type === 'cache_flush') {
      const currentTime = context.currentTime || 0;
      const failureStart = context.testCase.failureInjection.atSecond;

      if (currentTime < failureStart) {
        effectiveHitRatio = this.config.hitRatio;
      } else if (currentTime < failureStart + 10) {
        effectiveHitRatio = 0; // Cold cache
      } else if (currentTime < failureStart + 30) {
        effectiveHitRatio = 0.5; // Warming up
      } else {
        effectiveHitRatio = this.config.hitRatio;
      }
    }

    // Calculate based on cache strategy
    const result = this.simulateStrategy(strategy, rps, effectiveHitRatio);

    const memorySizeGB = this.config.memorySizeGB || 4;
    const capacity = memorySizeGB * this.capacityPerGB;
    const utilization = rps / capacity;

    return {
      latency: result.latency,
      errorRate: 0,
      utilization,
      cost: memorySizeGB * this.costPerGB,
      cacheHits: result.cacheHits,
      cacheMisses: result.cacheMisses,
      dbLoad: result.dbLoad,
      effectiveHitRatio,
      writeLatency: result.writeLatency,
      strategy,
    };
  }

  private simulateStrategy(
    strategy: CacheStrategy,
    rps: number,
    hitRatio: number
  ): {
    latency: number;
    writeLatency?: number;
    cacheHits: number;
    cacheMisses: number;
    dbLoad: number;
  } {
    const cacheHits = rps * hitRatio;
    const cacheMisses = rps * (1 - hitRatio);

    switch (strategy) {
      case 'cache_aside': {
        // Application checks cache → miss → read DB → populate cache
        // Read latency: cache_latency (hit) or cache_latency + db_latency (miss)
        // Write: DB only (cache invalidated)
        return {
          latency: this.baseLatency,
          cacheHits,
          cacheMisses,
          dbLoad: cacheMisses, // Only misses hit DB
        };
      }

      case 'read_through': {
        // Cache handles DB reads transparently
        // Similar to cache-aside but cache is responsible
        return {
          latency: this.baseLatency,
          cacheHits,
          cacheMisses,
          dbLoad: cacheMisses,
        };
      }

      case 'write_through': {
        // Write to cache + DB synchronously
        // Guarantees strong consistency but slower writes
        return {
          latency: this.baseLatency,
          writeLatency: this.baseLatency + 10, // Cache + DB write
          cacheHits,
          cacheMisses,
          dbLoad: cacheMisses + rps, // Misses + all writes
        };
      }

      case 'write_behind': {
        // Write to cache → async write to DB (batched)
        // Fast writes, eventual consistency
        const writeBatchSize = this.config.writeBatchSize || 100;
        const writeDelayMs = this.config.writeDelayMs || 10;

        return {
          latency: this.baseLatency,
          writeLatency: this.baseLatency, // Fast! Only cache write
          cacheHits,
          cacheMisses,
          dbLoad: cacheMisses + Math.ceil(rps / writeBatchSize), // Batched writes
        };
      }

      case 'write_around': {
        // Write directly to DB, bypass cache
        // Good for infrequently read data
        return {
          latency: this.baseLatency,
          writeLatency: 10, // DB write only
          cacheHits,
          cacheMisses,
          dbLoad: cacheMisses + rps, // Misses + all writes bypass cache
        };
      }

      default:
        return {
          latency: this.baseLatency,
          cacheHits,
          cacheMisses,
          dbLoad: cacheMisses,
        };
    }
  }
}
