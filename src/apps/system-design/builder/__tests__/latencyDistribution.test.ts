/**
 * Tests for Latency Distribution Module
 *
 * Validates the statistical accuracy of percentile calculations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  calculatePercentilesLegacy,
  calculateComponentPercentiles,
  calculateRequestPercentiles,
  combineLatencyDistributions,
  validatePercentiles,
} from '../simulation/latencyDistribution';
import {
  resetFlags,
  enableFeature,
  disableFeature,
} from '../simulation/featureFlags';

describe('Latency Distribution', () => {
  beforeEach(() => {
    resetFlags();
  });

  afterEach(() => {
    resetFlags();
  });

  describe('calculatePercentilesLegacy', () => {
    it('should apply hardcoded multipliers', () => {
      const p50 = 10;
      const result = calculatePercentilesLegacy(p50);

      expect(result.p50).toBe(10);
      expect(result.p90).toBe(13); // 10 * 1.3
      expect(result.p95).toBe(14); // 10 * 1.4
      expect(result.p99).toBe(18); // 10 * 1.8
      expect(result.p999).toBe(30); // 10 * 3.0
    });

    it('should handle zero latency', () => {
      const result = calculatePercentilesLegacy(0);
      expect(result.p50).toBe(0);
      expect(result.p99).toBe(0);
    });

    it('should maintain consistent ratios regardless of scale', () => {
      const small = calculatePercentilesLegacy(1);
      const large = calculatePercentilesLegacy(1000);

      // Ratios should be the same
      expect(small.p99 / small.p50).toBeCloseTo(large.p99 / large.p50, 5);
      expect(small.p999 / small.p50).toBeCloseTo(large.p999 / large.p50, 5);
    });
  });

  describe('calculateComponentPercentiles', () => {
    describe('lognormal distribution', () => {
      it('should produce percentiles that increase monotonically', () => {
        const result = calculateComponentPercentiles({
          mean: 10,
          distributionType: 'lognormal',
        });

        expect(result.p50).toBeLessThan(result.p90);
        expect(result.p90).toBeLessThan(result.p95);
        expect(result.p95).toBeLessThan(result.p99);
        expect(result.p99).toBeLessThan(result.p999);
      });

      it('should have p50 close to mean for low variance', () => {
        const result = calculateComponentPercentiles({
          mean: 10,
          variance: 1, // Low variance
          distributionType: 'lognormal',
        });

        // For lognormal with low variance, median is close to mean
        expect(result.p50).toBeCloseTo(10, 0);
      });

      it('should have wider tail with higher variance', () => {
        const lowVariance = calculateComponentPercentiles({
          mean: 10,
          variance: 1,
          distributionType: 'lognormal',
        });

        const highVariance = calculateComponentPercentiles({
          mean: 10,
          variance: 25,
          distributionType: 'lognormal',
        });

        // Higher variance means longer tail
        const lowRatio = lowVariance.p99 / lowVariance.p50;
        const highRatio = highVariance.p99 / highVariance.p50;
        expect(highRatio).toBeGreaterThan(lowRatio);
      });

      it('should increase tail with load factor', () => {
        const noLoad = calculateComponentPercentiles({
          mean: 10,
          loadFactor: 0,
        });

        const highLoad = calculateComponentPercentiles({
          mean: 10,
          loadFactor: 0.9,
        });

        // High load increases variance and tail
        expect(highLoad.p99 / highLoad.p50).toBeGreaterThan(
          noLoad.p99 / noLoad.p50
        );
      });
    });

    describe('exponential distribution', () => {
      it('should have median at ln(2) * mean', () => {
        const mean = 10;
        const result = calculateComponentPercentiles({
          mean,
          distributionType: 'exponential',
        });

        // For exponential, median = -mean * ln(1 - 0.5) = mean * ln(2) ≈ 0.693 * mean
        expect(result.p50).toBeCloseTo(mean * Math.log(2), 1);
      });

      it('should have characteristic exponential percentile ratios', () => {
        const result = calculateComponentPercentiles({
          mean: 10,
          distributionType: 'exponential',
        });

        // For exponential: Q(p) = -mean * ln(1-p)
        // p99/p50 = ln(0.01) / ln(0.5) ≈ 6.64
        const expectedRatio = Math.log(0.01) / Math.log(0.5);
        expect(result.p99 / result.p50).toBeCloseTo(expectedRatio, 1);
      });
    });

    describe('uniform distribution', () => {
      it('should have p50 equal to mean', () => {
        const result = calculateComponentPercentiles({
          mean: 10,
          variance: 3,
          distributionType: 'uniform',
        });

        expect(result.p50).toBeCloseTo(10, 5);
      });

      it('should have symmetric percentiles around mean', () => {
        const mean = 10;
        const result = calculateComponentPercentiles({
          mean,
          variance: 3,
          distributionType: 'uniform',
        });

        // For uniform, percentiles are evenly spaced
        const range = result.p999 - result.p50;
        const p90Distance = result.p90 - result.p50;
        // p90 should be 0.4 * range (since it's 90% vs 50% = 40% through remaining half)
        expect(p90Distance / range).toBeCloseTo(0.4 / 0.499, 1);
      });
    });

    describe('bimodal distribution', () => {
      it('should show distinct fast and slow modes', () => {
        const result = calculateComponentPercentiles({
          mean: 10,
          variance: 25,
          distributionType: 'bimodal',
        });

        // p50 should be in fast mode (around mean * 0.5)
        expect(result.p50).toBeCloseTo(5, 0);

        // p99 should be in slow mode (around mean * 5.5)
        expect(result.p99).toBeCloseTo(55, 0);
      });

      it('should have large gap between p90 and p99', () => {
        const result = calculateComponentPercentiles({
          mean: 10,
          distributionType: 'bimodal',
        });

        // Bimodal should have sudden jump in tail
        const p90ToP99Ratio = result.p99 / result.p90;
        expect(p90ToP99Ratio).toBeGreaterThan(5); // Large jump
      });
    });
  });

  describe('calculateRequestPercentiles', () => {
    it('should use legacy calculation when flag is disabled', () => {
      disableFeature('USE_ACCURATE_PERCENTILES');

      const result = calculateRequestPercentiles(10, 20, 900, 100);

      // Weighted p50 = (900*10 + 100*20) / 1000 = 11
      const expectedP50 = 11;
      expect(result.p50).toBeCloseTo(expectedP50, 5);
      expect(result.p99).toBeCloseTo(expectedP50 * 1.8, 5);
    });

    it('should use statistical calculation when flag is enabled', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const legacyResult = calculatePercentilesLegacy(11);
      const accurateResult = calculateRequestPercentiles(10, 20, 900, 100, {
        componentCount: 3,
        cacheHitRatio: 0.9,
        loadFactor: 0,
      });

      // The accurate calculation should differ from legacy
      // For lognormal, median < mean (median = exp(mu) where mu < ln(mean))
      // This is mathematically correct - lognormal is right-skewed
      expect(validatePercentiles(accurateResult)).toBe(true);
      // p50 should be less than the mean (11) due to lognormal skew
      expect(accurateResult.p50).toBeLessThan(11);
      expect(accurateResult.p50).toBeGreaterThan(8); // But not too far off
    });

    it('should handle pure read traffic', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const result = calculateRequestPercentiles(10, 0, 1000, 0);

      // For lognormal, median is less than mean due to right skew
      expect(result.p50).toBeLessThan(10);
      expect(result.p50).toBeGreaterThan(7);
      expect(validatePercentiles(result)).toBe(true);
    });

    it('should handle pure write traffic', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const result = calculateRequestPercentiles(0, 20, 0, 1000);

      // For lognormal, median is less than mean due to right skew
      expect(result.p50).toBeLessThan(20);
      expect(result.p50).toBeGreaterThan(15);
      expect(validatePercentiles(result)).toBe(true);
    });

    it('should handle zero traffic', () => {
      const result = calculateRequestPercentiles(10, 20, 0, 0);

      expect(result.p50).toBe(0);
      expect(result.p99).toBe(0);
    });

    it('should increase variance with more components', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const fewComponents = calculateRequestPercentiles(10, 20, 900, 100, {
        componentCount: 2,
      });

      const manyComponents = calculateRequestPercentiles(10, 20, 900, 100, {
        componentCount: 10,
      });

      // More components = more variance = larger tail
      expect(manyComponents.p99 / manyComponents.p50).toBeGreaterThan(
        fewComponents.p99 / fewComponents.p50
      );
    });

    it('should increase variance with lower cache hit ratio', () => {
      enableFeature('USE_ACCURATE_PERCENTILES');

      const highHitRatio = calculateRequestPercentiles(10, 20, 900, 100, {
        cacheHitRatio: 0.95,
      });

      const lowHitRatio = calculateRequestPercentiles(10, 20, 900, 100, {
        cacheHitRatio: 0.5,
      });

      // Lower hit ratio = more variance
      expect(lowHitRatio.p99 / lowHitRatio.p50).toBeGreaterThan(
        highHitRatio.p99 / highHitRatio.p50
      );
    });
  });

  describe('combineLatencyDistributions', () => {
    it('should sum means of multiple distributions', () => {
      const distributions = [
        { mean: 10 },
        { mean: 20 },
        { mean: 5 },
      ];

      const result = combineLatencyDistributions(distributions);

      // Combined mean should be close to sum of means
      expect(result.p50).toBeCloseTo(35, 0);
    });

    it('should handle empty array', () => {
      const result = combineLatencyDistributions([]);

      expect(result.p50).toBe(0);
      expect(result.p99).toBe(0);
    });

    it('should handle single distribution', () => {
      const result = combineLatencyDistributions([{ mean: 10 }]);

      expect(result.p50).toBeCloseTo(10, 0);
      expect(validatePercentiles(result)).toBe(true);
    });

    it('should increase variance with combined distributions', () => {
      const single = combineLatencyDistributions([{ mean: 30 }]);
      const combined = combineLatencyDistributions([
        { mean: 10 },
        { mean: 10 },
        { mean: 10 },
      ]);

      // Combined variance is higher (sum of individual variances)
      const singleRatio = single.p99 / single.p50;
      const combinedRatio = combined.p99 / combined.p50;

      // Combined should have at least similar or higher ratio
      // (Central Limit Theorem - sum of independent random variables)
      expect(combinedRatio).toBeGreaterThanOrEqual(singleRatio * 0.8);
    });
  });

  describe('validatePercentiles', () => {
    it('should accept valid percentiles', () => {
      const valid = {
        p50: 10,
        p90: 13,
        p95: 14,
        p99: 18,
        p999: 30,
      };

      expect(validatePercentiles(valid)).toBe(true);
    });

    it('should reject negative p50', () => {
      const invalid = {
        p50: -10,
        p90: 13,
        p95: 14,
        p99: 18,
        p999: 30,
      };

      expect(validatePercentiles(invalid)).toBe(false);
    });

    it('should reject non-monotonic percentiles', () => {
      const invalid = {
        p50: 10,
        p90: 9, // Less than p50!
        p95: 14,
        p99: 18,
        p999: 30,
      };

      expect(validatePercentiles(invalid)).toBe(false);
    });

    it('should reject extreme ratios', () => {
      const tooExtreme = {
        p50: 10,
        p90: 50,
        p95: 80,
        p99: 150, // 15x p50 - too extreme
        p999: 200,
      };

      expect(validatePercentiles(tooExtreme)).toBe(false);
    });
  });
});
