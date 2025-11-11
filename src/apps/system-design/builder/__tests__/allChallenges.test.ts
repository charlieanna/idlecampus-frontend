import { describe, it, expect } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import {
  tinyUrlGoodDesign,
  tinyUrlBadDesign,
  tinyUrlTestCases,
} from '../examples/tinyUrlExample';
import {
  foodBlogGoodDesign,
  foodBlogBadDesign,
  foodBlogTestCases,
} from '../examples/foodBlogExample';
import {
  todoAppGoodDesign,
  todoAppBadDesign,
  todoAppTestCases,
} from '../examples/todoAppExample';

describe('All Challenges - Integration Tests', () => {
  const runner = new TestRunner();

  describe('Challenge Progression', () => {
    it('should have 3 challenges with increasing difficulty', () => {
      expect(tinyUrlTestCases).toHaveLength(3);
      expect(foodBlogTestCases).toHaveLength(3);
      expect(todoAppTestCases).toHaveLength(3);
    });

    it('should teach different concepts per challenge (observed via traffic)', () => {
      // Tiny URL: caching reduces DB utilization under normal load
      const tinyGood = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      const tinyBad = runner.runTestCase(tinyUrlBadDesign, tinyUrlTestCases[0]);
      const tinyGoodDb = Array.from(tinyGood.componentMetrics.values()).find((m: any) => m.readUtil !== undefined);
      const tinyBadDb = Array.from(tinyBad.componentMetrics.values()).find((m: any) => m.readUtil !== undefined);
      expect(tinyGoodDb).toBeDefined();
      expect(tinyBadDb).toBeDefined();
      expect(tinyGoodDb!.utilization).toBeLessThan(tinyBadDb!.utilization);

      // Food Blog: CDN reduces cost relative to app-servers serving images
      const foodGood = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);
      const foodBad = runner.runTestCase(foodBlogBadDesign, foodBlogTestCases[0]);
      expect(foodGood.metrics.monthlyCost).toBeLessThan(foodBad.metrics.monthlyCost);

      // Todo App: replication maintains higher availability under DB failure
      const todoGood = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[1]);
      const todoBad = runner.runTestCase(todoAppBadDesign, todoAppTestCases[1]);
      expect(todoGood.metrics.availability).toBeGreaterThan(todoBad.metrics.availability);
    });
  });

  describe('Good vs Bad Design Comparison', () => {
    it('should show good designs have better latency/error metrics', () => {
      // Tiny URL (Normal Load)
      const tinyGood = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      const tinyBad = runner.runTestCase(tinyUrlBadDesign, tinyUrlTestCases[0]);
      expect(tinyGood.metrics.p99Latency).toBeLessThan(tinyBad.metrics.p99Latency);
      expect(tinyGood.metrics.errorRate).toBeLessThanOrEqual(tinyBad.metrics.errorRate);

      // Food Blog (Normal Load)
      const foodGood = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);
      const foodBad = runner.runTestCase(foodBlogBadDesign, foodBlogTestCases[0]);
      expect(foodGood.metrics.p99Latency).toBeLessThanOrEqual(foodBad.metrics.p99Latency);
      expect(foodGood.metrics.errorRate).toBeLessThanOrEqual(foodBad.metrics.errorRate);

      // Todo App (Hot User)
      const todoGood = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[2]);
      const todoBad = runner.runTestCase(todoAppBadDesign, todoAppTestCases[2]);
      expect(todoGood.metrics.p99Latency).toBeLessThanOrEqual(todoBad.metrics.p99Latency);
      expect(todoGood.metrics.errorRate).toBeLessThanOrEqual(todoBad.metrics.errorRate);
    });
  });

  describe('Cost Optimization', () => {
    it('should show good designs are more cost-effective', () => {
      // Food Blog: CDN should be cheaper than app servers
      const foodGoodResult = runner.runTestCase(
        foodBlogGoodDesign,
        foodBlogTestCases[0]
      );
      const foodBadResult = runner.runTestCase(
        foodBlogBadDesign,
        foodBlogTestCases[0]
      );

      expect(foodGoodResult.metrics.monthlyCost).toBeLessThan(
        foodBadResult.metrics.monthlyCost
      );
    });
  });

  describe('Latency Optimization', () => {
    it('should show caching/CDN reduces latency', () => {
      // Tiny URL: Cache reduces latency
      const tinyGoodResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );
      const tinyBadResult = runner.runTestCase(
        tinyUrlBadDesign,
        tinyUrlTestCases[0]
      );

      expect(tinyGoodResult.metrics.p99Latency).toBeLessThan(
        tinyBadResult.metrics.p99Latency
      );
    });
  });

  describe('Availability and Fault Tolerance', () => {
    it('should show replication maintains availability during failures', () => {
      // Todo App: Replication prevents outage
      const todoGoodResult = runner.runTestCase(
        todoAppGoodDesign,
        todoAppTestCases[1] // DB failure test
      );
      const todoBadResult = runner.runTestCase(
        todoAppBadDesign,
        todoAppTestCases[1]
      );

      expect(todoGoodResult.metrics.availability).toBeGreaterThan(0.95);
      expect(todoBadResult.metrics.availability).toBeLessThan(0.6);
    });
  });

  describe('Bottleneck Detection', () => {
    it('should identify bottlenecks in bad designs', () => {
      // Bad designs should have bottlenecks
      const tinyBadResult = runner.runTestCase(
        tinyUrlBadDesign,
        tinyUrlTestCases[1] // Spike test
      );

      expect(tinyBadResult.bottlenecks.length).toBeGreaterThan(0);
      expect(tinyBadResult.bottlenecks[0]).toHaveProperty('recommendation');
    });

    it('should have fewer or no bottlenecks in good designs', () => {
      // Good designs should have no critical bottlenecks
      const tinyGoodResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[1]
      );

      // May have some utilization but not critical
      const criticalBottlenecks = tinyGoodResult.bottlenecks.filter(
        (b) => b.utilization > 0.95
      );
      expect(criticalBottlenecks.length).toBe(0);
    });
  });

  describe('Explanations', () => {
    it('should provide clear pass/fail explanations', () => {
      const result = runner.runTestCase(tinyUrlBadDesign, tinyUrlTestCases[1]);

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(50);
      expect(result.explanation).toContain(
        result.passed ? 'PASSED' : 'FAILED'
      );
    });

    it('should include recommendations for failures', () => {
      const result = runner.runTestCase(tinyUrlBadDesign, tinyUrlTestCases[1]);

      if (!result.passed && result.bottlenecks.length > 0) {
        expect(result.explanation).toContain('Recommendation');
      }
    });
  });

  describe('Simulation Consistency', () => {
    it('should return consistent results for same design', () => {
      const result1 = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      const result2 = runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      // Results should be deterministic (same design = same result)
      expect(result1.metrics.p99Latency).toBe(result2.metrics.p99Latency);
      expect(result1.metrics.monthlyCost).toBeCloseTo(
        result2.metrics.monthlyCost,
        1
      );
      expect(result1.passed).toBe(result2.passed);
    });
  });

  describe('Learning Validation', () => {
    it('should validate key learning: caching reduces DB load', () => {
      const tinyGoodResult = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );

      // Find cache metrics
      const cacheMetrics = Array.from(
        tinyGoodResult.componentMetrics.values()
      ).find((m: any) => m.cacheMisses !== undefined);

      expect(cacheMetrics).toBeDefined();
      // With 90% hit ratio, only 10% of reads hit DB
      expect(cacheMetrics!.effectiveHitRatio).toBe(0.9);
    });

    it('should validate key learning: CDN reduces cost and latency', () => {
      const foodGoodResult = runner.runTestCase(
        foodBlogGoodDesign,
        foodBlogTestCases[0]
      );

      // Find CDN metrics
      const cdnMetrics = Array.from(
        foodGoodResult.componentMetrics.values()
      ).find((m: any) => m.hitRatio !== undefined);

      expect(cdnMetrics).toBeDefined();
      expect(cdnMetrics!.hitRatio).toBe(0.95);
      expect(cdnMetrics!.latency).toBeLessThan(10); // Much faster than S3
    });

    it('should validate key learning: replication prevents outages', () => {
      const todoGoodResult = runner.runTestCase(
        todoAppGoodDesign,
        todoAppTestCases[1]
      );
      const todoBadResult = runner.runTestCase(
        todoAppBadDesign,
        todoAppTestCases[1]
      );

      // Good design maintains high availability
      expect(todoGoodResult.passed).toBe(true);
      expect(todoBadResult.passed).toBe(false);

      // Availability difference is dramatic
      const availabilityDiff =
        todoGoodResult.metrics.availability - todoBadResult.metrics.availability;
      expect(availabilityDiff).toBeGreaterThan(0.3); // At least 30% difference
    });
  });
});
