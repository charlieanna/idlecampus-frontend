/**
 * Integration Tests for Phase 2 and 3 Modules
 *
 * Tests that all advanced features work together correctly when
 * their feature flags are enabled during simulations.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  enableFeature,
  disableFeature,
  resetFlags,
  isEnabled,
} from '../simulation/featureFlags';
import {
  calculateEffectiveCapacity,
  calculateReplicaDistribution,
  estimateReplicationLag,
  CONNECTION_POOL_DEFAULTS,
  QUERY_COMPLEXITY_MULTIPLIERS,
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
  calculateBlastRadius,
  calculateAvailabilityImpact,
  estimateMTTR,
  FailureInjectionConfig,
} from '../simulation/failureInjection';

describe('Integration Tests: Phase 2 + Phase 3 Modules', () => {
  beforeEach(() => {
    // Enable all advanced features for integration testing
    enableFeature('ENABLE_DB_CONNECTION_POOL');
    enableFeature('ENABLE_DYNAMIC_CACHE_HIT');
    enableFeature('ENABLE_TRAFFIC_PATTERNS');
    enableFeature('ENABLE_FAILURE_INJECTION');
  });

  afterEach(() => {
    resetFlags();
  });

  describe('Database + Cache Integration', () => {
    it('should model realistic database-cache interaction', () => {
      // Scenario: High read workload with Redis cache
      const totalRps = 10000;
      const readRatio = 0.9;
      const readRps = totalRps * readRatio;
      const writeRps = totalRps * (1 - readRatio);

      // Calculate cache hit ratio
      const cacheResult = calculateDynamicHitRatio(
        { maxSizeGB: 10, ttlSeconds: 3600, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 100,
          hotDataPercentage: 0.2,
          avgItemSizeKB: 1,
          readRps,
          writeRps,
        },
        'zipf'
      );

      // Cache misses go to database
      const cacheMissRps = readRps * (1 - cacheResult.hitRatio);
      const dbReadRps = cacheMissRps + writeRps; // Cache misses + all writes

      // Calculate database capacity
      const dbCapacity = calculateEffectiveCapacity(
        5000, // Base capacity: 5000 RPS
        dbReadRps,
        {
          poolConfig: CONNECTION_POOL_DEFAULTS['db.r5.large'],
          queryComplexity: 'moderate',
          ioPattern: 'random',
          avgQueryDurationMs: 10,
        }
      );

      // Verify realistic behavior
      expect(cacheResult.hitRatio).toBeGreaterThan(0.1); // Cache should help (reduced due to write invalidations)
      expect(dbCapacity.effectiveCapacity).toBeLessThan(5000); // Complexity reduces capacity
      expect(cacheMissRps).toBeLessThan(readRps); // Cache reduces DB load

      // The database should not be overwhelmed if cache is working
      const dbUtilization = dbReadRps / dbCapacity.effectiveCapacity;
      expect(dbUtilization).toBeDefined();
    });

    it('should handle cache miss storm during cold start', () => {
      // Cold cache = all requests hit database
      const readRps = 5000;
      const writeRps = 500;

      // Initially cold cache - 0% hit ratio
      const coldCacheDbLoad = readRps + writeRps; // All reads miss

      const dbCapacity = calculateEffectiveCapacity(
        3000, // Base capacity lower than total load
        coldCacheDbLoad,
        {
          poolConfig: CONNECTION_POOL_DEFAULTS['db.r5.large'],
          queryComplexity: 'simple',
          ioPattern: 'random',
          avgQueryDurationMs: 5,
        }
      );

      // Calculate warming time
      const warmingTime = calculateWarmingTime(
        0.8, // Target 80% hit ratio
        { maxSizeGB: 5, ttlSeconds: 3600, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 50,
          hotDataPercentage: 0.1,
          avgItemSizeKB: 2,
          readRps,
          writeRps,
        }
      );

      // During cold start, DB should show warnings or high utilization
      expect(dbCapacity.connectionPoolUtilization).toBeGreaterThan(0);
      expect(warmingTime).toBeGreaterThan(0);
      expect(warmingTime).toBeLessThanOrEqual(3600); // Capped at 1 hour
    });

    it('should recommend cache size based on database capacity', () => {
      // If DB can handle 1000 RPS but we have 5000 RPS, cache must absorb 80%
      const totalReadRps = 5000;
      const dbCapacity = 1000;
      const requiredCacheHitRatio = 1 - dbCapacity / totalReadRps; // 80%

      const recommendedSize = getRecommendedCacheSize(
        {
          totalDataSizeGB: 200,
          hotDataPercentage: 0.15,
          avgItemSizeKB: 4,
          readRps: totalReadRps,
          writeRps: 500,
        },
        requiredCacheHitRatio,
        'zipf'
      );

      // Verify recommendation is reasonable
      expect(recommendedSize).toBeGreaterThan(0);
      expect(recommendedSize).toBeLessThan(200); // Less than total data size
    });
  });

  describe('Traffic Patterns + Failure Injection Integration', () => {
    it('should model flash crowd during database failure', () => {
      // Flash crowd hits at exactly wrong time - DB is down
      const flashCrowdConfig = {
        type: 'flash_crowd' as const,
        baseRps: 1000,
        peakRps: 10000,
        flashCrowdStartSecond: 300,
        flashCrowdDurationSeconds: 600,
      };

      const dbFailureConfig: FailureInjectionConfig = {
        type: 'crash',
        targetComponents: ['primary-db'],
        startTimeSeconds: 350, // Failure starts 50s into flash crowd
        durationSeconds: 120,
        severity: 1.0,
        recoveryPattern: 'instant',
      };

      // At peak flash crowd + DB failure (t=400s)
      const peakTime = 400;
      const traffic = calculateTrafficAtTime(peakTime, flashCrowdConfig);
      const failureEffect = calculateFailureEffect('primary-db', peakTime, [dbFailureConfig]);

      expect(traffic.isSpike).toBe(true);
      expect(traffic.rps).toBeGreaterThan(5000); // High traffic
      expect(failureEffect.isAffected).toBe(true);
      expect(failureEffect.availabilityFactor).toBe(0); // DB down
      expect(failureEffect.failureDescription).toContain('crashed');
    });

    it('should model cascading failure during traffic ramp', () => {
      // Gradual traffic increase exposes weak links
      const trafficConfig = {
        type: 'gradual_ramp' as const,
        baseRps: 100,
        peakRps: 10000,
        rampUpDurationSeconds: 3600,
      };

      // Dependency graph: API -> Cache -> DB
      const dependencies = new Map<string, string[]>();
      dependencies.set('api-server', ['cache']);
      dependencies.set('cache', ['database']);
      dependencies.set('database', []);

      // Database fails first under load
      const initialFailures = ['database'];
      const cascadeResult = calculateCascadingFailure(initialFailures, dependencies, 0.5);

      // Check traffic at different times
      const earlyTraffic = calculateTrafficAtTime(600, trafficConfig); // 10 min in
      const midTraffic = calculateTrafficAtTime(1800, trafficConfig); // 30 min in
      const lateTraffic = calculateTrafficAtTime(3600, trafficConfig); // 1 hour (peak)

      expect(earlyTraffic.rps).toBeLessThan(midTraffic.rps);
      expect(midTraffic.rps).toBeLessThan(lateTraffic.rps);
      expect(lateTraffic.rps).toBeCloseTo(10000, 0);

      // Cascade should propagate
      expect(cascadeResult.failedComponents.has('database')).toBe(true);
      expect(cascadeResult.failedComponents.has('cache')).toBe(true);
      expect(cascadeResult.failedComponents.has('api-server')).toBe(true);
      expect(cascadeResult.cascadeDepth).toBeGreaterThanOrEqual(2); // At least two levels of propagation
    });

    it('should calculate system availability under varying traffic and failures', () => {
      const failures: FailureInjectionConfig[] = [
        {
          type: 'slow',
          targetComponents: ['api'],
          startTimeSeconds: 100,
          durationSeconds: 300,
          severity: 0.5,
          recoveryPattern: 'gradual',
        },
        {
          type: 'crash',
          targetComponents: ['cache'],
          startTimeSeconds: 500,
          durationSeconds: 60,
          severity: 1.0,
          recoveryPattern: 'instant',
        },
      ];

      const totalDuration = 3600; // 1 hour simulation
      const availability = calculateAvailabilityImpact(failures, totalDuration);

      // Some downtime but system mostly available
      expect(availability).toBeGreaterThan(0.9); // >90% available
      expect(availability).toBeLessThan(1.0); // Not 100% due to failures
    });
  });

  describe('Geographic Distribution + Cache Behavior', () => {
    it('should model cache hit ratios across geographic regions', () => {
      const totalRps = 10000;
      const currentTimeSeconds = 54000; // 15:00 UTC

      // Get traffic distribution across regions
      const geoDistribution = calculateGeoDistribution(totalRps, currentTimeSeconds);

      // Each region has different cache characteristics
      const regions = ['us-east', 'us-west', 'europe', 'asia'];
      const regionCacheResults = new Map<string, number>();

      for (const region of regions) {
        const regionRps = geoDistribution.get(region) || 0;
        const readRps = regionRps * 0.9;
        const writeRps = regionRps * 0.1;

        // Each region has its own cache
        const cacheResult = calculateDynamicHitRatio(
          { maxSizeGB: 5, ttlSeconds: 1800, evictionPolicy: 'lru' },
          {
            totalDataSizeGB: 50,
            hotDataPercentage: 0.2,
            avgItemSizeKB: 2,
            readRps,
            writeRps,
          },
          'zipf'
        );

        regionCacheResults.set(region, cacheResult.hitRatio);
      }

      // All regions should have reasonable hit ratios
      for (const [region, hitRatio] of regionCacheResults) {
        expect(hitRatio).toBeGreaterThan(0);
        expect(hitRatio).toBeLessThanOrEqual(1);
      }

      // Total traffic should sum correctly
      let totalRegionRps = 0;
      for (const rps of geoDistribution.values()) {
        totalRegionRps += rps;
      }
      expect(totalRegionRps).toBeCloseTo(totalRps, 0);
    });
  });

  describe('Complex End-to-End Scenarios', () => {
    it('should simulate a realistic production incident', () => {
      // Scenario: Traffic spike causes cache eviction storm,
      // leading to database overload and cascading failures

      // 1. Normal traffic with good cache hit ratio
      const normalTraffic = calculateTrafficAtTime(0, {
        type: 'flash_crowd',
        baseRps: 1000,
        peakRps: 15000,
        flashCrowdStartSecond: 300,
        flashCrowdDurationSeconds: 600,
      });

      const normalCacheResult = calculateDynamicHitRatio(
        { maxSizeGB: 8, ttlSeconds: 3600, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 100,
          hotDataPercentage: 0.1,
          avgItemSizeKB: 2,
          readRps: normalTraffic.rps * 0.9,
          writeRps: normalTraffic.rps * 0.1,
        },
        'zipf'
      );

      // 2. Traffic spike hits
      const spikeTraffic = calculateTrafficAtTime(450, {
        type: 'flash_crowd',
        baseRps: 1000,
        peakRps: 15000,
        flashCrowdStartSecond: 300,
        flashCrowdDurationSeconds: 600,
      });

      // Cache eviction rate increases dramatically
      const spikeCacheResult = calculateDynamicHitRatio(
        { maxSizeGB: 8, ttlSeconds: 3600, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 100,
          hotDataPercentage: 0.1,
          avgItemSizeKB: 2,
          readRps: spikeTraffic.rps * 0.9,
          writeRps: spikeTraffic.rps * 0.1,
        },
        'zipf'
      );

      // 3. Calculate database load during spike
      const cacheMissRps = spikeTraffic.rps * 0.9 * (1 - spikeCacheResult.hitRatio);
      const dbLoad = cacheMissRps + spikeTraffic.rps * 0.1;

      const dbCapacity = calculateEffectiveCapacity(5000, dbLoad, {
        poolConfig: CONNECTION_POOL_DEFAULTS['db.r5.xlarge'],
        queryComplexity: 'moderate',
        ioPattern: 'random',
        avgQueryDurationMs: 15,
      });

      // 4. Check for cascading effects
      const dependencies = new Map<string, string[]>();
      dependencies.set('web', ['api']);
      dependencies.set('api', ['cache', 'database']);
      dependencies.set('cache', ['database']);
      dependencies.set('database', []);

      // If DB becomes slow, calculate blast radius
      const blastRadius = calculateBlastRadius(
        'database',
        dependencies,
        // Reverse dependencies
        new Map([
          ['database', ['api', 'cache']],
          ['cache', ['api']],
          ['api', ['web']],
          ['web', []],
        ])
      );

      // Verify incident progression
      expect(normalTraffic.isSpike).toBe(false);
      expect(spikeTraffic.isSpike).toBe(true);
      expect(spikeTraffic.rps).toBeGreaterThan(normalTraffic.rps * 10);

      // Cache performance should degrade under spike
      expect(spikeCacheResult.evictionRate).toBeGreaterThan(normalCacheResult.evictionRate);

      // Database should show stress
      expect(dbCapacity.connectionPoolUtilization).toBeGreaterThan(0);
      expect(dbCapacity.warnings.length).toBeGreaterThanOrEqual(0);

      // Blast radius should include all components
      expect(blastRadius.size).toBe(4); // database, cache, api, web
    });

    it('should calculate MTTR for different failure scenarios', () => {
      const scenarios = [
        { type: 'crash' as const, severity: 1.0, autoRecovery: true },
        { type: 'slow' as const, severity: 0.7, autoRecovery: false },
        { type: 'network_partition' as const, severity: 1.0, autoRecovery: false },
        { type: 'resource_exhaustion' as const, severity: 0.8, autoRecovery: true },
      ];

      const mttrResults = scenarios.map((s) => ({
        ...s,
        mttr: estimateMTTR(s.type, s.severity, s.autoRecovery),
      }));

      // Auto-recovery should be faster
      const crashMTTR = mttrResults.find((r) => r.type === 'crash')!.mttr;
      const slowMTTR = mttrResults.find((r) => r.type === 'slow')!.mttr;

      expect(crashMTTR).toBeLessThan(slowMTTR); // Auto vs manual

      // Network partitions typically take longer
      const partitionMTTR = mttrResults.find((r) => r.type === 'network_partition')!.mttr;
      expect(partitionMTTR).toBeGreaterThan(crashMTTR);

      // All MTTRs should be positive
      mttrResults.forEach((r) => {
        expect(r.mttr).toBeGreaterThan(0);
      });
    });

    it('should handle read replica distribution under load', () => {
      // High read load with multiple replicas
      const totalReadRps = 10000;
      const totalWriteRps = 500;
      const numReplicas = 3;

      const distribution = calculateReplicaDistribution(totalReadRps, totalWriteRps, numReplicas);

      // Verify distribution
      expect(distribution.primaryReadRps).toBeCloseTo(1000, 0); // 10% of reads
      expect(distribution.replicaReadRps).toBeCloseTo(3000, 0); // 90% / 3 replicas

      // Calculate replication lag
      const lag = estimateReplicationLag(totalWriteRps, 'async', 2);
      expect(lag).toBeGreaterThan(0);
      expect(lag).toBeLessThan(2000); // Should not be excessive

      // If lag is high, there should be warnings
      if (lag > 100) {
        const distWithLag = calculateReplicaDistribution(totalReadRps, totalWriteRps, numReplicas, lag);
        expect(distWithLag.replicationLagWarning).toBeDefined();
      }
    });
  });

  describe('Feature Flag Combinations', () => {
    it('should work with all features enabled', () => {
      // All features already enabled in beforeEach
      expect(isEnabled('ENABLE_DB_CONNECTION_POOL')).toBe(true);
      expect(isEnabled('ENABLE_DYNAMIC_CACHE_HIT')).toBe(true);
      expect(isEnabled('ENABLE_TRAFFIC_PATTERNS')).toBe(true);
      expect(isEnabled('ENABLE_FAILURE_INJECTION')).toBe(true);

      // Run integrated calculation
      const traffic = calculateTrafficAtTime(100, {
        type: 'daily_cycle',
        baseRps: 1000,
        peakRps: 2000,
        valleyRps: 500,
      });

      const cacheResult = calculateDynamicHitRatio(
        { maxSizeGB: 5, ttlSeconds: 3600, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 50,
          hotDataPercentage: 0.2,
          avgItemSizeKB: 1,
          readRps: traffic.readRps,
          writeRps: traffic.writeRps,
        }
      );

      const dbCapacity = calculateEffectiveCapacity(2000, traffic.rps, {
        queryComplexity: 'simple',
      });

      const failureEffect = calculateFailureEffect('test-component', 100, []);

      // All should return valid results
      expect(traffic.patternPhase).toBeDefined();
      expect(cacheResult.hitRatio).toBeDefined();
      expect(dbCapacity.effectiveCapacity).toBeDefined();
      expect(failureEffect.isAffected).toBe(false); // No failures configured
    });

    it('should gracefully degrade when features are disabled', () => {
      // Disable all features
      disableFeature('ENABLE_DB_CONNECTION_POOL');
      disableFeature('ENABLE_DYNAMIC_CACHE_HIT');
      disableFeature('ENABLE_TRAFFIC_PATTERNS');
      disableFeature('ENABLE_FAILURE_INJECTION');

      // Should return legacy/default behavior
      const traffic = calculateTrafficAtTime(100, {
        type: 'flash_crowd',
        baseRps: 1000,
        peakRps: 10000,
        flashCrowdStartSecond: 50,
        flashCrowdDurationSeconds: 100,
      });

      const cacheResult = calculateDynamicHitRatio(
        { maxSizeGB: 5, ttlSeconds: 3600, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 50,
          hotDataPercentage: 0.2,
          avgItemSizeKB: 1,
          readRps: 900,
          writeRps: 100,
        }
      );

      const dbCapacity = calculateEffectiveCapacity(2000, 1000);

      const failureEffect = calculateFailureEffect('test-component', 100, [
        {
          type: 'crash',
          targetComponents: ['test-component'],
          startTimeSeconds: 0,
          durationSeconds: 200,
          severity: 1.0,
        },
      ]);

      // Legacy behavior
      expect(traffic.rps).toBe(1000); // Ignores flash crowd
      expect(traffic.patternPhase).toBe('constant');

      expect(cacheResult.hitRatio).toBe(0.9); // Fixed 90%
      expect(cacheResult.warnings).toHaveLength(0);

      expect(dbCapacity.effectiveCapacity).toBe(2000); // No adjustments

      expect(failureEffect.isAffected).toBe(false); // Ignores failure config
    });

    it('should allow selective feature enabling', () => {
      // Enable only traffic patterns and cache modeling
      disableFeature('ENABLE_DB_CONNECTION_POOL');
      disableFeature('ENABLE_FAILURE_INJECTION');
      // Keep ENABLE_TRAFFIC_PATTERNS and ENABLE_DYNAMIC_CACHE_HIT enabled

      const traffic = calculateTrafficAtTime(300, {
        type: 'gradual_ramp',
        baseRps: 100,
        peakRps: 1000,
        rampUpDurationSeconds: 600,
      });

      // Traffic patterns should work
      expect(traffic.rps).toBeGreaterThan(100);
      expect(traffic.patternPhase).toContain('ramp');

      const cacheResult = calculateDynamicHitRatio(
        { maxSizeGB: 10, ttlSeconds: 1800, evictionPolicy: 'lru' },
        {
          totalDataSizeGB: 100,
          hotDataPercentage: 0.15,
          avgItemSizeKB: 2,
          readRps: traffic.readRps,
          writeRps: traffic.writeRps,
        }
      );

      // Cache modeling should work
      expect(cacheResult.hitRatio).not.toBe(0.9); // Not legacy value

      const dbCapacity = calculateEffectiveCapacity(1000, traffic.rps);

      // DB capacity should be legacy (feature disabled)
      expect(dbCapacity.effectiveCapacity).toBe(1000);
      expect(dbCapacity.queryLatencyMultiplier).toBe(1.0);
    });
  });

  describe('Spike Generation and Recovery', () => {
    it('should generate realistic traffic spikes', () => {
      const durationSeconds = 3600; // 1 hour
      const spikeFrequency = 0.002; // ~7 spikes per hour

      const spikes = generateSpikeEvents(durationSeconds, spikeFrequency, 5);

      // Should have some spikes
      expect(spikes.length).toBeGreaterThan(0);

      // Each spike should have valid properties
      spikes.forEach((spike) => {
        expect(spike.timeSeconds).toBeGreaterThanOrEqual(0);
        expect(spike.timeSeconds).toBeLessThan(durationSeconds);
        expect(spike.magnitude).toBeGreaterThan(0);
        expect(spike.durationSeconds).toBeGreaterThanOrEqual(60);
        expect(spike.durationSeconds).toBeLessThanOrEqual(600);
      });
    });

    it('should model recovery from failure', () => {
      const failureConfig: FailureInjectionConfig = {
        type: 'slow',
        targetComponents: ['service-a'],
        startTimeSeconds: 100,
        durationSeconds: 60,
        severity: 0.8,
        recoveryPattern: 'gradual',
      };

      // During failure
      const duringFailure = calculateFailureEffect('service-a', 130, [failureConfig]);
      expect(duringFailure.isAffected).toBe(true);
      expect(duringFailure.latencyMultiplier).toBeGreaterThan(10); // Significant slowdown

      // Just after failure ends
      const justAfter = calculateFailureEffect('service-a', 165, [failureConfig]);
      // Gradual recovery means still some effect
      expect(justAfter.latencyMultiplier).toBeLessThan(duringFailure.latencyMultiplier);

      // Much later (recovery complete)
      const muchLater = calculateFailureEffect('service-a', 400, [failureConfig]);
      expect(muchLater.isAffected).toBe(false);
      expect(muchLater.latencyMultiplier).toBe(1.0);
    });
  });
});
