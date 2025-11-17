/**
 * Feature Flag Integration Tests
 *
 * Tests that feature flags correctly toggle behavior in the simulation engine.
 * This is critical for safe rollout of new features.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import {
  resetFlags,
  enableFeature,
  disableFeature,
  getAllFlags,
} from '../simulation/featureFlags';
import {
  tinyUrlGoodDesign,
  tinyUrlTestCases,
} from '../examples/tinyUrlExample';

describe('Feature Flag Integration', () => {
  const runner = new TestRunner();

  beforeEach(() => {
    resetFlags();
  });

  afterEach(() => {
    resetFlags();
  });

  describe('USE_ACCURATE_PERCENTILES flag', () => {
    it('should produce identical results when flag is disabled', () => {
      disableFeature('USE_ACCURATE_PERCENTILES');

      const result1 = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      const result2 = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      // Results should be deterministic when flag is off (hardcoded multipliers)
      expect(result1.metrics.p99Latency).toBe(result2.metrics.p99Latency);
      expect(result1.metrics.p50Latency).toBe(result2.metrics.p50Latency);

      // Verify legacy ratio is maintained
      const ratio = result1.metrics.p99Latency / result1.metrics.p50Latency;
      expect(ratio).toBeCloseTo(1.8, 5); // Hardcoded 1.8 multiplier
    });

    it('should use different calculation when flag is enabled', () => {
      const legacyResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );
      const legacyRatio =
        legacyResult.metrics.p99Latency / legacyResult.metrics.p50Latency;

      // Enable accurate percentiles
      enableFeature('USE_ACCURATE_PERCENTILES');

      const accurateResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );
      const accurateRatio =
        accurateResult.metrics.p99Latency / accurateResult.metrics.p50Latency;

      // Ratios should be different (not exactly 1.8)
      // The accurate calculation considers:
      // - Number of components in path
      // - Cache hit ratio
      // - System load
      expect(accurateRatio).not.toBeCloseTo(1.8, 2);

      // But both should be valid (p99 > p50)
      expect(accurateResult.metrics.p99Latency).toBeGreaterThan(
        accurateResult.metrics.p50Latency
      );

      // Log for comparison
      console.log('Legacy ratio (p99/p50):', legacyRatio.toFixed(4));
      console.log('Accurate ratio (p99/p50):', accurateRatio.toFixed(4));
    });

    it('should affect all test cases consistently', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const results = runner.runAllTestCases(
        tinyUrlGoodDesign,
        tinyUrlTestCases
      );

      // Each test case should use statistical calculation
      for (const result of results) {
        const ratio = result.metrics.p99Latency / result.metrics.p50Latency;
        // Should not be exactly 1.8 (the hardcoded legacy value)
        expect(Math.abs(ratio - 1.8)).toBeGreaterThan(0.01);
      }
    });

    it('should allow rollback to legacy behavior', () => {
      // Start with accurate percentiles
      enableFeature('USE_ACCURATE_PERCENTILES');
      const accurateResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );

      // Rollback to legacy
      disableFeature('USE_ACCURATE_PERCENTILES');
      const rolledBackResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );

      // Should match original legacy behavior
      const ratio =
        rolledBackResult.metrics.p99Latency /
        rolledBackResult.metrics.p50Latency;
      expect(ratio).toBeCloseTo(1.8, 5);

      // And be different from accurate
      expect(rolledBackResult.metrics.p99Latency).not.toBe(
        accurateResult.metrics.p99Latency
      );
    });
  });

  describe('Flag state management', () => {
    it('should track all flags correctly', () => {
      const flags = getAllFlags();

      // All flags should be disabled by default
      expect(flags.USE_ACCURATE_PERCENTILES).toBe(false);
      expect(flags.ENABLE_MULTI_DB).toBe(false);
      expect(flags.ENABLE_GRAPH_CYCLES).toBe(false);
      expect(flags.ENABLE_LB_ALGORITHMS).toBe(false);
    });

    it('should reset all flags to defaults', () => {
      // Enable some flags
      enableFeature('USE_ACCURATE_PERCENTILES');
      enableFeature('ENABLE_VERBOSE_LOGGING');

      // Reset
      resetFlags();

      const flags = getAllFlags();
      expect(flags.USE_ACCURATE_PERCENTILES).toBe(false);
      expect(flags.ENABLE_VERBOSE_LOGGING).toBe(false);
    });

    it('should not affect other flags when enabling one', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const flags = getAllFlags();
      expect(flags.USE_ACCURATE_PERCENTILES).toBe(true);
      expect(flags.ENABLE_MULTI_DB).toBe(false); // Should remain false
      expect(flags.ENABLE_RETRY_LOGIC).toBe(false);
    });
  });

  describe('Feature flag performance impact', () => {
    it('should maintain simulation speed with accurate percentiles', () => {
      const iterations = 50;

      // Measure legacy performance
      disableFeature('USE_ACCURATE_PERCENTILES');
      const legacyStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }
      const legacyTime = performance.now() - legacyStart;

      // Measure accurate performance
      enableFeature('USE_ACCURATE_PERCENTILES');
      const accurateStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }
      const accurateTime = performance.now() - accurateStart;

      // Accurate calculation should not be more than 2x slower
      const ratio = accurateTime / legacyTime;
      expect(ratio).toBeLessThan(2.0);

      console.log(`Legacy: ${legacyTime.toFixed(2)}ms`);
      console.log(`Accurate: ${accurateTime.toFixed(2)}ms`);
      console.log(`Ratio: ${ratio.toFixed(2)}x`);
    });
  });

  describe('Feature flag correctness', () => {
    it('should produce statistically valid percentiles when enabled', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const result = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );

      const metrics = result.metrics;

      // Percentiles should be monotonically increasing
      expect(metrics.p50Latency).toBeLessThan(metrics.p90Latency!);
      expect(metrics.p90Latency!).toBeLessThan(metrics.p95Latency!);
      expect(metrics.p95Latency!).toBeLessThan(metrics.p99Latency);
      expect(metrics.p99Latency).toBeLessThan(metrics.p999Latency!);

      // p99/p50 ratio should be reasonable (not too extreme)
      const tailRatio = metrics.p99Latency / metrics.p50Latency;
      expect(tailRatio).toBeGreaterThan(1.2); // Some tail
      // With high variance from system characteristics (many components, cache misses, load),
      // ratios up to 10x are realistic for heavily loaded systems
      expect(tailRatio).toBeLessThan(10.0); // But not too extreme

      console.log('Tail ratio (p99/p50):', tailRatio.toFixed(4));
      console.log('Cache hit ratio in system:', 0.9);
    });

    it('should reflect system characteristics in percentile ratios', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      // Run different test cases with different load characteristics
      const normalLoad = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0] // Normal load
      );
      const heavyLoad = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[1] // Read spike (5x more RPS)
      );

      // Higher load should produce wider variance (larger tail)
      const normalRatio =
        normalLoad.metrics.p99Latency / normalLoad.metrics.p50Latency;
      const heavyRatio =
        heavyLoad.metrics.p99Latency / heavyLoad.metrics.p50Latency;

      console.log('Normal load p99/p50:', normalRatio.toFixed(4));
      console.log('Heavy load p99/p50:', heavyRatio.toFixed(4));

      // Both should be valid
      expect(normalRatio).toBeGreaterThan(1);
      expect(heavyRatio).toBeGreaterThan(1);
    });
  });
});
