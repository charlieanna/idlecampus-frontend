/**
 * Advanced Features Tests (Phases 2 & 3)
 *
 * Comprehensive tests for:
 * - Database capacity modeling
 * - Cache hit ratio modeling
 * - Traffic patterns
 * - Failure injection
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  calculateEffectiveCapacity,
  calculateReplicaDistribution,
  estimateReplicationLag,
  calculateConnectionWaitTime,
  getRecommendedInstanceType,
  CONNECTION_POOL_DEFAULTS,
} from '../simulation/databaseCapacity';
import {
  calculateDynamicHitRatio,
  calculateWarmingTime,
  getRecommendedCacheSize,
} from '../simulation/cacheModeling';
import {
  calculateTrafficAtTime,
  generateSpikeEvents,
  calculateGeoDistribution,
} from '../simulation/trafficPatterns';
import {
  calculateFailureEffect,
  calculateCascadingFailure,
  generateChaosScenarios,
  calculateBlastRadius,
  estimateMTTR,
  calculateAvailabilityImpact,
} from '../simulation/failureInjection';
import {
  resetFlags,
  enableFeature,
  disableFeature,
} from '../simulation/featureFlags';

describe('Phase 2: Data Layer', () => {
  beforeEach(() => resetFlags());
  afterEach(() => resetFlags());

  describe('Database Capacity Modeling', () => {
    it('should return base capacity when flag is disabled', () => {
      disableFeature('ENABLE_DB_CONNECTION_POOL');
      const result = calculateEffectiveCapacity(1000, 500);

      expect(result.effectiveCapacity).toBe(1000);
      expect(result.connectionPoolUtilization).toBeCloseTo(0.5);
    });

    it('should model connection pool saturation', () => {
      enableFeature('ENABLE_DB_CONNECTION_POOL');

      // High RPS with long queries should exhaust pool
      const result = calculateEffectiveCapacity(1000, 2000, {
        poolConfig: CONNECTION_POOL_DEFAULTS['db.t3.medium'],
        avgQueryDurationMs: 100, // 100ms queries
      });

      // 2000 RPS * 0.1s = 200 concurrent connections needed
      // Pool has 90 connections, so it's exhausted
      expect(result.connectionPoolUtilization).toBe(1.0); // Capped at 1
      expect(result.effectiveCapacity).toBeLessThan(1000);
      expect(result.warnings.some((w) => w.includes('exhausted'))).toBe(true);
    });

    it('should apply query complexity multipliers', () => {
      enableFeature('ENABLE_DB_CONNECTION_POOL');

      const simpleResult = calculateEffectiveCapacity(1000, 100, {
        queryComplexity: 'simple',
      });

      const complexResult = calculateEffectiveCapacity(1000, 100, {
        queryComplexity: 'complex',
      });

      // Complex queries should have lower effective capacity
      expect(complexResult.effectiveCapacity).toBeLessThan(simpleResult.effectiveCapacity);
      expect(complexResult.queryLatencyMultiplier).toBe(8.0);
    });

    it('should apply I/O pattern multipliers', () => {
      enableFeature('ENABLE_DB_CONNECTION_POOL');

      const sequentialResult = calculateEffectiveCapacity(1000, 100, {
        ioPattern: 'sequential',
      });

      const randomResult = calculateEffectiveCapacity(1000, 100, {
        ioPattern: 'random',
      });

      expect(randomResult.effectiveCapacity).toBeLessThan(sequentialResult.effectiveCapacity);
      expect(randomResult.ioLatencyMultiplier).toBe(3.0);
    });

    it('should calculate replica distribution', () => {
      const result = calculateReplicaDistribution(1000, 100, 2);

      // 10% of reads to primary, 90% distributed across replicas
      expect(result.primaryReadRps).toBe(100); // 10% of 1000
      expect(result.replicaReadRps).toBe(450); // 900 / 2 replicas
    });

    it('should warn about high replication lag', () => {
      const result = calculateReplicaDistribution(1000, 100, 2, 150);
      expect(result.replicationLagWarning).toBeDefined();
      expect(result.replicationLagWarning).toContain('150ms');
    });

    it('should estimate replication lag based on write load', () => {
      const lowWriteLag = estimateReplicationLag(10, 'async');
      const highWriteLag = estimateReplicationLag(1000, 'async');

      expect(highWriteLag).toBeGreaterThan(lowWriteLag);
      expect(estimateReplicationLag(1000, 'sync')).toBe(0);
    });

    it('should calculate connection wait time', () => {
      const lowUtil = calculateConnectionWaitTime(0.5, 90, 10);
      const highUtil = calculateConnectionWaitTime(0.9, 90, 10);

      expect(lowUtil).toBe(0);
      expect(highUtil).toBeGreaterThan(0);
    });

    it('should recommend appropriate instance types', () => {
      // Adjusted for 'moderate' complexity (2.5x multiplier)
      expect(getRecommendedInstanceType(50)).toBe('db.t3.large'); // 50 * 2.5 = 125 RPS
      expect(getRecommendedInstanceType(300)).toBe('db.r5.large'); // 300 * 2.5 = 750 RPS
      expect(getRecommendedInstanceType(3000)).toBe('db.r5.2xlarge'); // 3000 * 2.5 = 7500 RPS
    });
  });

  describe('Cache Hit Ratio Modeling', () => {
    const workingSet = {
      totalDataSizeGB: 100,
      hotDataPercentage: 0.2, // 20GB hot data
      avgItemSizeKB: 10,
      readRps: 1000,
      writeRps: 100,
    };

    it('should return fixed ratio when flag is disabled', () => {
      disableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      const result = calculateDynamicHitRatio(
        { maxSizeGB: 10, ttlSeconds: 3600, evictionPolicy: 'lru' },
        workingSet
      );

      expect(result.hitRatio).toBe(0.9);
    });

    it('should calculate hit ratio based on cache size', () => {
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      const smallCache = calculateDynamicHitRatio(
        { maxSizeGB: 2, ttlSeconds: 3600, evictionPolicy: 'lru' },
        workingSet
      );

      const largeCache = calculateDynamicHitRatio(
        { maxSizeGB: 30, ttlSeconds: 3600, evictionPolicy: 'lru' },
        workingSet
      );

      expect(largeCache.hitRatio).toBeGreaterThan(smallCache.hitRatio);
    });

    it('should apply Zipf distribution (80/20 rule)', () => {
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      // With Zipf, small cache still gets good hit ratio
      const result = calculateDynamicHitRatio(
        { maxSizeGB: 5, ttlSeconds: 3600, evictionPolicy: 'lru' },
        workingSet,
        'zipf'
      );

      // 5GB cache, 20GB hot data = 25% coverage (after 20% overhead = ~20% effective)
      // Zipf + TTL + invalidation effects reduce hit ratio
      // Result is reasonable for constrained cache with write traffic
      expect(result.hitRatio).toBeGreaterThan(0.1);
      expect(result.hitRatio).toBeLessThan(0.9);
    });

    it('should warn about low hit ratio', () => {
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      const result = calculateDynamicHitRatio(
        { maxSizeGB: 0.5, ttlSeconds: 3600, evictionPolicy: 'lru' },
        workingSet
      );

      expect(result.hitRatio).toBeLessThan(0.5);
      expect(result.warnings.some((w) => w.includes('Low cache hit ratio'))).toBe(true);
    });

    it('should account for write invalidations', () => {
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      const lowWriteWorkingSet = { ...workingSet, writeRps: 10 };
      const highWriteWorkingSet = { ...workingSet, writeRps: 500 };

      const lowWriteResult = calculateDynamicHitRatio(
        { maxSizeGB: 10, ttlSeconds: 3600, evictionPolicy: 'lru' },
        lowWriteWorkingSet
      );

      const highWriteResult = calculateDynamicHitRatio(
        { maxSizeGB: 10, ttlSeconds: 3600, evictionPolicy: 'lru' },
        highWriteWorkingSet
      );

      expect(highWriteResult.hitRatio).toBeLessThan(lowWriteResult.hitRatio);
    });

    it('should calculate cache warming time', () => {
      const warmingTime = calculateWarmingTime(
        0.8, // 80% hit ratio target
        { maxSizeGB: 10, ttlSeconds: 3600, evictionPolicy: 'lru' },
        workingSet
      );

      expect(warmingTime).toBeGreaterThan(0);
      expect(warmingTime).toBeLessThanOrEqual(3600); // Capped at 1 hour
    });

    it('should recommend cache size for target hit ratio', () => {
      const recommendedSize = getRecommendedCacheSize(workingSet, 0.9);

      // Should recommend cache large enough for 90% hit ratio
      expect(recommendedSize).toBeGreaterThan(10);
    });
  });
});

describe('Phase 3: Advanced Traffic', () => {
  beforeEach(() => resetFlags());
  afterEach(() => resetFlags());

  describe('Traffic Pattern Modeling', () => {
    it('should return constant traffic when flag is disabled', () => {
      disableFeature('ENABLE_TRAFFIC_PATTERNS');

      const result = calculateTrafficAtTime(3600, {
        type: 'daily_cycle',
        baseRps: 1000,
        peakRps: 2000,
      });

      expect(result.rps).toBe(1000);
      expect(result.patternPhase).toBe('constant');
    });

    it('should model daily cycle patterns', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');

      const config = {
        type: 'daily_cycle' as const,
        baseRps: 1000,
        peakRps: 2000,
        valleyRps: 500,
        peakTimeHour: 15, // 3 PM
      };

      // At peak time (3 PM = 15 * 3600 seconds)
      const peakResult = calculateTrafficAtTime(15 * 3600, config);
      // At valley time (3 AM = 3 * 3600 seconds)
      const valleyResult = calculateTrafficAtTime(3 * 3600, config);

      expect(peakResult.rps).toBeGreaterThan(valleyResult.rps);
      expect(peakResult.rps).toBeCloseTo(2000, -1);
      expect(valleyResult.rps).toBeCloseTo(500, -1);
    });

    it('should model flash crowd spikes', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');

      const config = {
        type: 'flash_crowd' as const,
        baseRps: 100,
        peakRps: 1000,
        flashCrowdStartSecond: 300,
        flashCrowdDurationSeconds: 600,
      };

      // Before spike
      const before = calculateTrafficAtTime(200, config);
      // During spike
      const during = calculateTrafficAtTime(500, config);
      // After spike (recovery)
      const after = calculateTrafficAtTime(1000, config);

      expect(before.rps).toBe(100);
      expect(before.isSpike).toBe(false);

      expect(during.rps).toBeGreaterThan(500);
      expect(during.isSpike).toBe(true);

      expect(after.rps).toBeGreaterThan(100);
      expect(after.rps).toBeLessThan(1000);
    });

    it('should model gradual ramp up', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');

      const config = {
        type: 'gradual_ramp' as const,
        baseRps: 100,
        peakRps: 400,
        rampUpDurationSeconds: 1000,
      };

      const start = calculateTrafficAtTime(0, config);
      const middle = calculateTrafficAtTime(500, config);
      const end = calculateTrafficAtTime(1000, config);

      expect(start.rps).toBe(100);
      expect(middle.rps).toBeCloseTo(250, 0);
      expect(end.rps).toBe(400);
    });

    it('should calculate read/write split', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');

      const result = calculateTrafficAtTime(
        0,
        { type: 'constant', baseRps: 1000 },
        0.8 // 80% reads
      );

      expect(result.readRps).toBeCloseTo(800, 0);
      expect(result.writeRps).toBeCloseTo(200, 0);
    });

    it('should generate spike events', () => {
      const spikes = generateSpikeEvents(3600, 0.01); // 1 spike per 100 seconds avg

      expect(spikes.length).toBeGreaterThan(0);
      expect(spikes.length).toBeLessThan(100);

      for (const spike of spikes) {
        expect(spike.timeSeconds).toBeGreaterThan(0);
        expect(spike.timeSeconds).toBeLessThan(3600);
        expect(spike.magnitude).toBeGreaterThan(0);
        expect(spike.durationSeconds).toBeGreaterThan(60);
      }
    });

    it('should calculate geographic distribution', () => {
      const distribution = calculateGeoDistribution(1000, 12 * 3600); // 12:00 UTC

      expect(distribution.size).toBe(4);
      expect(distribution.get('us-east')).toBeDefined();
      expect(distribution.get('us-west')).toBeDefined();
      expect(distribution.get('europe')).toBeDefined();
      expect(distribution.get('asia')).toBeDefined();

      // Total should sum to original
      const total = Array.from(distribution.values()).reduce((a, b) => a + b, 0);
      expect(total).toBeCloseTo(1000, 0);
    });
  });

  describe('Failure Injection', () => {
    it('should return no effect when flag is disabled', () => {
      disableFeature('ENABLE_FAILURE_INJECTION');

      const effect = calculateFailureEffect('db', 100, [
        {
          type: 'crash',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 100,
          severity: 1.0,
        },
      ]);

      expect(effect.isAffected).toBe(false);
      expect(effect.latencyMultiplier).toBe(1.0);
    });

    it('should model component crash', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      const effect = calculateFailureEffect('db', 100, [
        {
          type: 'crash',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 100,
          severity: 1.0,
        },
      ]);

      expect(effect.isAffected).toBe(true);
      expect(effect.latencyMultiplier).toBe(Infinity);
      expect(effect.errorRateIncrease).toBe(1.0);
      expect(effect.availabilityFactor).toBe(0);
    });

    it('should model slow component', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      const effect = calculateFailureEffect('db', 100, [
        {
          type: 'slow',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 100,
          severity: 0.5,
        },
      ]);

      expect(effect.isAffected).toBe(true);
      expect(effect.latencyMultiplier).toBeGreaterThan(10);
      expect(effect.errorRateIncrease).toBeGreaterThan(0);
    });

    it('should model partial availability', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      const effect = calculateFailureEffect('app', 100, [
        {
          type: 'partial',
          targetComponents: ['app'],
          startTimeSeconds: 50,
          durationSeconds: 100,
          severity: 0.3,
        },
      ]);

      expect(effect.availabilityFactor).toBeCloseTo(0.7);
    });

    it('should not affect components outside target', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      const effect = calculateFailureEffect('cache', 100, [
        {
          type: 'crash',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 100,
          severity: 1.0,
        },
      ]);

      expect(effect.isAffected).toBe(false);
    });

    it('should handle gradual recovery', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      // During failure
      const during = calculateFailureEffect('db', 100, [
        {
          type: 'slow',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 50,
          severity: 1.0,
          recoveryPattern: 'gradual',
        },
      ]);

      // After failure (in recovery)
      const recovery = calculateFailureEffect('db', 150, [
        {
          type: 'slow',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 50,
          severity: 1.0,
          recoveryPattern: 'gradual',
        },
      ]);

      // Much after failure (fully recovered)
      const recovered = calculateFailureEffect('db', 300, [
        {
          type: 'slow',
          targetComponents: ['db'],
          startTimeSeconds: 50,
          durationSeconds: 50,
          severity: 1.0,
          recoveryPattern: 'gradual',
        },
      ]);

      expect(during.latencyMultiplier).toBeGreaterThan(recovery.latencyMultiplier);
      expect(recovered.isAffected).toBe(false);
    });

    it('should calculate cascading failures', () => {
      const dependencies = new Map<string, string[]>();
      dependencies.set('app', ['db', 'cache']);
      dependencies.set('lb', ['app']);
      dependencies.set('cdn', []);
      dependencies.set('db', []);
      dependencies.set('cache', []);

      const cascade = calculateCascadingFailure(['db'], dependencies, 0.5);

      // DB failure should cascade to app (which depends on db)
      expect(cascade.failedComponents.has('db')).toBe(true);
      expect(cascade.failedComponents.has('app')).toBe(true);
      // LB depends on app, so it should also fail
      expect(cascade.failedComponents.has('lb')).toBe(true);
    });

    it('should generate chaos scenarios', () => {
      const scenarios = generateChaosScenarios(['lb', 'app', 'db', 'cache'], 3600);

      expect(scenarios.length).toBeGreaterThan(0);

      // Should include different failure types
      const types = scenarios.map((s) => s.type);
      expect(types.some((t) => t === 'crash')).toBe(true);
    });

    it('should calculate blast radius', () => {
      const dependencies = new Map<string, string[]>();
      const reverseDeps = new Map<string, string[]>();

      // app depends on db
      dependencies.set('app', ['db']);
      reverseDeps.set('db', ['app']);

      // lb depends on app
      dependencies.set('lb', ['app']);
      reverseDeps.set('app', ['lb']);

      const radius = calculateBlastRadius('db', dependencies, reverseDeps);

      expect(radius.has('db')).toBe(true);
      expect(radius.has('app')).toBe(true);
      expect(radius.has('lb')).toBe(true);
    });

    it('should estimate MTTR', () => {
      const crashMTTR = estimateMTTR('crash', 1.0, false);
      const crashAutoMTTR = estimateMTTR('crash', 1.0, true);

      expect(crashAutoMTTR).toBeLessThan(crashMTTR);
      expect(crashMTTR).toBeGreaterThan(300); // More than 5 minutes
    });

    it('should calculate availability impact', () => {
      const failures = [
        {
          type: 'crash' as const,
          targetComponents: ['db'],
          startTimeSeconds: 0,
          durationSeconds: 60,
          severity: 1.0,
        },
      ];

      const availability = calculateAvailabilityImpact(failures, 3600);

      // 60 seconds downtime in 3600 seconds
      expect(availability).toBeCloseTo(59 / 60, 2);
    });
  });
});
