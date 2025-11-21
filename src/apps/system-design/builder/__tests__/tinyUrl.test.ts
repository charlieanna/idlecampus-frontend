import { describe, it, expect } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import {
  tinyUrlGoodDesign,
  tinyUrlBadDesign,
  tinyUrlTestCases,
} from '../examples/tinyUrlExample';

describe('Tiny URL Simulation', () => {
  const runner = new TestRunner();

  describe('Good Design (with cache)', () => {
    it('should meet latency/error targets on normal load', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      expect(result.metrics.p99Latency).toBeLessThan(100);
      expect(result.metrics.errorRate).toBeLessThan(0.01);
    });

    it('should handle read spike within targets', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[1]);

      expect(result.metrics.p99Latency).toBeLessThan(200);
      expect(result.metrics.errorRate).toBeLessThan(0.05);
    });

    it('should handle cache flush gracefully', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[2]);

      expect(result.metrics.p99Latency).toBeLessThan(150);
      expect(result.metrics.errorRate).toBeLessThan(0.02);
    });

    it('should have low database utilization due to caching', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      // Find database component metrics
      const dbMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.readUtil !== undefined
      );

      expect(dbMetrics).toBeDefined();
      expect(dbMetrics!.utilization).toBeLessThan(0.7); // DB should be reasonably low util with caching
    });
  });

  describe('Bad Design (no cache)', () => {
    it('should fail read spike test due to database overload', () => {
      const result = runner.runTestCase(tinyUrlBadDesign, tinyUrlTestCases[1]);

      expect(result.passed).toBe(false);
      expect(result.bottlenecks.length).toBeGreaterThan(0);

      // Database should be bottleneck
      const dbBottleneck = result.bottlenecks.find(
        (b) => b.componentType === 'postgresql'
      );
      expect(dbBottleneck).toBeDefined();
      expect(dbBottleneck!.utilization).toBeGreaterThan(0.9);
    });

    it('should have high database utilization without cache', () => {
      const result = runner.runTestCase(tinyUrlBadDesign, tinyUrlTestCases[0]);

      const dbMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.readUtil !== undefined
      );

      expect(dbMetrics).toBeDefined();
      // Without cache, DB gets all read traffic (1000 RPS)
      // With capacity of 500, util should be 200%
      expect(dbMetrics!.utilization).toBeGreaterThan(0.8);
    });
  });

  describe('Component Calculations', () => {
    it('should calculate correct latency for cached requests', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      // Expected latency path (cache hit): LB (1ms) + App (10ms) + Cache (1ms) = 12ms
      // Expected latency path (cache miss): LB (1ms) + App (10ms) + Cache (1ms) + DB (5ms) = 17ms
      // Weighted average with 90% cache hit: ~12.5ms
      // With accurate percentile calculations (lognormal distribution), p99 ≈ 2.5x p50 ≈ 31ms

      expect(result.metrics.p50Latency).toBeLessThan(20);
      expect(result.metrics.p99Latency).toBeLessThan(35);
    });

    it('should reduce DB load proportional to cache hit ratio', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      // Find cache metrics
      const cacheMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.cacheHits !== undefined
      );

      expect(cacheMetrics).toBeDefined();
      expect(cacheMetrics!.effectiveHitRatio).toBe(0.9);

      // 1000 read RPS * 10% miss rate = 100 RPS to DB
      expect(cacheMetrics!.cacheMisses).toBeCloseTo(100, 0);
    });
  });

  describe('Failure Injection', () => {
    it('should handle cache flush by temporarily reducing hit ratio', () => {
      const result = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[2]);

      // During cache flush, hit ratio drops to 0, then warms up
      // This should cause higher latency but system should still pass
      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeGreaterThan(20); // Higher than normal
      expect(result.metrics.p99Latency).toBeLessThan(150); // But still acceptable
    });
  });
});
