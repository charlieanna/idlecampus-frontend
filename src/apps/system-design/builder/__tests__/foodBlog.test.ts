import { describe, it, expect } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import {
  foodBlogGoodDesign,
  foodBlogMediocreDesign,
  foodBlogBadDesign,
  foodBlogTestCases,
} from '../examples/foodBlogExample';

describe('Food Blog Simulation', () => {
  const runner = new TestRunner();

  describe('Good Design (S3 + CDN)', () => {
    it('should pass normal load test with low cost', () => {
      const result = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);

      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(500);
      expect(result.metrics.errorRate).toBeLessThan(0.01);
      expect(result.metrics.monthlyCost).toBeLessThan(300);
    });

    it('should handle viral post spike with CDN', () => {
      const result = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[1]);

      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(1000);
      expect(result.metrics.errorRate).toBeLessThan(0.05);
    });

    it('should handle image-heavy load efficiently', () => {
      const result = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[2]);

      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(600);
    });

    it('should have CDN metrics showing high hit ratio', () => {
      const result = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);

      // Find CDN component metrics
      const cdnMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.hitRatio !== undefined
      );

      expect(cdnMetrics).toBeDefined();
      expect(cdnMetrics!.hitRatio).toBe(0.95); // 95% hit ratio
    });

    it('should have low cost due to CDN caching', () => {
      const result = runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);

      // With CDN, most traffic served from edge (cheap)
      // Cost should be well under budget
      expect(result.metrics.monthlyCost).toBeLessThan(250);
    });
  });

  describe('Mediocre Design (S3 only, no CDN)', () => {
    it('should pass but have higher latency', () => {
      const result = runner.runTestCase(
        foodBlogMediocreDesign,
        foodBlogTestCases[0]
      );

      // Should still pass but latency higher due to S3 (100ms vs CDN 5ms)
      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeGreaterThan(100); // Higher than good design
    });

    it('should have no CDN metrics', () => {
      const result = runner.runTestCase(
        foodBlogMediocreDesign,
        foodBlogTestCases[0]
      );

      // Should not have CDN component
      const cdnMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.hitRatio !== undefined
      );

      expect(cdnMetrics).toBeUndefined();
    });
  });

  describe('Bad Design (App servers serving images)', () => {
    it('should pass but be very expensive', () => {
      const result = runner.runTestCase(foodBlogBadDesign, foodBlogTestCases[0]);

      // Will pass functionally but cost will be astronomical
      // 5 app servers × $100 = $500/month minimum
      expect(result.metrics.monthlyCost).toBeGreaterThan(500);
    });

    it('should fail cost criteria on normal load', () => {
      const result = runner.runTestCase(foodBlogBadDesign, foodBlogTestCases[0]);

      // Cost exceeds budget ($300)
      expect(result.passed).toBe(false);
      expect(result.metrics.monthlyCost).toBeGreaterThan(300);
    });

    it('should have high app server utilization', () => {
      const result = runner.runTestCase(foodBlogBadDesign, foodBlogTestCases[1]);

      // Find app server metrics
      const appMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.instances !== undefined
      );

      expect(appMetrics).toBeDefined();
      // Serving images + HTML puts strain on app servers
      expect(appMetrics!.utilization).toBeGreaterThan(0.3);
    });
  });

  describe('Cost Comparison', () => {
    it('should show CDN dramatically reduces cost vs app servers', () => {
      const goodResult = runner.runTestCase(
        foodBlogGoodDesign,
        foodBlogTestCases[0]
      );
      const badResult = runner.runTestCase(
        foodBlogBadDesign,
        foodBlogTestCases[0]
      );

      // Good design (with CDN) should be at least 2x cheaper
      expect(badResult.metrics.monthlyCost).toBeGreaterThan(
        goodResult.metrics.monthlyCost * 2
      );
    });
  });

  describe('Latency Comparison', () => {
    it('should show CDN has much lower latency than S3 alone', () => {
      const goodResult = runner.runTestCase(
        foodBlogGoodDesign,
        foodBlogTestCases[0]
      );
      const mediocreResult = runner.runTestCase(
        foodBlogMediocreDesign,
        foodBlogTestCases[0]
      );

      // CDN (5ms) vs S3 (100ms) for 95% of requests
      // Good design should have noticeably lower latency
      expect(mediocreResult.metrics.p99Latency).toBeGreaterThan(
        goodResult.metrics.p99Latency * 1.5
      );
    });
  });
});
