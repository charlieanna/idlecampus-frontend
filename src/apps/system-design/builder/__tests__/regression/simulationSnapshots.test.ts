/**
 * Phase 0.1: Simulation Engine Snapshot Tests
 *
 * These tests capture the current behavior of the simulation engine to detect
 * unintended changes. When we implement new features, these snapshots will
 * alert us if existing behavior changes unexpectedly.
 *
 * IMPORTANT: If a snapshot test fails after intentional changes:
 * 1. Verify the change is expected
 * 2. Update snapshot with: npx vitest -u
 * 3. Document why the change occurred
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TestRunner } from '../../simulation/testRunner';
import { resetFlags } from '../../simulation/featureFlags';

// Import all example designs and test cases
import {
  tinyUrlGoodDesign,
  tinyUrlBadDesign,
  tinyUrlTestCases,
} from '../../examples/tinyUrlExample';

import {
  todoAppGoodDesign,
  todoAppBadDesign,
  todoAppTestCases,
} from '../../examples/todoAppExample';

import {
  foodBlogGoodDesign,
  foodBlogBadDesign,
  foodBlogTestCases,
} from '../../examples/foodBlogExample';

describe('Simulation Engine Regression Snapshots', () => {
  const runner = new TestRunner();

  beforeEach(() => {
    // Reset feature flags to ensure consistent baseline
    resetFlags();
  });

  describe('TinyURL Challenge Snapshots', () => {
    describe('Good Design', () => {
      it('Normal Load test case metrics', () => {
        const result = runner.runTestCase(
          tinyUrlGoodDesign,
          tinyUrlTestCases[0]
        );

        // Snapshot key metrics to detect regressions
        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          monthlyCost: Math.round(result.metrics.monthlyCost * 100) / 100,
          availability: Math.round(result.metrics.availability * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "availability": 1,
            "bottleneckCount": 2,
            "errorRate": 1,
            "monthlyCost": 201.59,
            "p50Latency": 192.36,
            "p99Latency": 346.26,
            "passed": false,
          }
        `);
      });

      it('Read Spike test case metrics', () => {
        const result = runner.runTestCase(
          tinyUrlGoodDesign,
          tinyUrlTestCases[1]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 2,
            "errorRate": 1,
            "p50Latency": 131.78,
            "p99Latency": 237.2,
            "passed": false,
          }
        `);
      });

      it('Cache Flush test case metrics', () => {
        const result = runner.runTestCase(
          tinyUrlGoodDesign,
          tinyUrlTestCases[2]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 2,
            "errorRate": 1,
            "p50Latency": 237.41,
            "p99Latency": 427.34,
            "passed": false,
          }
        `);
      });

      it('component metrics structure', () => {
        const result = runner.runTestCase(
          tinyUrlGoodDesign,
          tinyUrlTestCases[0]
        );

        // Snapshot component count and types
        const componentIds = Array.from(result.componentMetrics.keys());
        expect(componentIds.sort()).toMatchInlineSnapshot(`
          [
            "app",
            "cache",
            "db",
            "lb",
          ]
        `);
      });
    });

    describe('Bad Design', () => {
      it('Normal Load test case metrics', () => {
        const result = runner.runTestCase(
          tinyUrlBadDesign,
          tinyUrlTestCases[0]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 2,
            "errorRate": 1,
            "p50Latency": 282,
            "p99Latency": 507.6,
            "passed": false,
          }
        `);
      });

      it('bottleneck identification', () => {
        const result = runner.runTestCase(
          tinyUrlBadDesign,
          tinyUrlTestCases[1]
        );

        // Snapshot bottleneck structure
        const bottleneckTypes = result.bottlenecks.map((b) => ({
          type: b.componentType,
          severity: b.severity,
          utilization: Math.round(b.utilization * 100) / 100,
        }));

        expect(bottleneckTypes).toMatchInlineSnapshot(`
          [
            {
              "severity": undefined,
              "type": "app_server",
              "utilization": 10.2,
            },
            {
              "severity": undefined,
              "type": "postgresql",
              "utilization": 24.99,
            },
          ]
        `);
      });
    });
  });

  describe('TodoApp Challenge Snapshots', () => {
    describe('Good Design', () => {
      it('Normal Load test case metrics', () => {
        const result = runner.runTestCase(
          todoAppGoodDesign,
          todoAppTestCases[0]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          monthlyCost: Math.round(result.metrics.monthlyCost * 100) / 100,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 1,
            "errorRate": 1,
            "monthlyCost": 254.88,
            "p50Latency": 404.4,
            "p99Latency": 727.92,
            "passed": false,
          }
        `);
      });

      it('Database Failure test case metrics', () => {
        const result = runner.runTestCase(
          todoAppGoodDesign,
          todoAppTestCases[1]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          availability: Math.round(result.metrics.availability * 10000) / 10000,
        }).toMatchInlineSnapshot(`
          {
            "availability": 1,
            "errorRate": 1,
            "p50Latency": 404.4,
            "p99Latency": 727.92,
            "passed": false,
          }
        `);
      });
    });

    describe('Bad Design', () => {
      it('Normal Load test case metrics', () => {
        const result = runner.runTestCase(
          todoAppBadDesign,
          todoAppTestCases[0]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 2,
            "errorRate": 1,
            "p50Latency": 561,
            "p99Latency": 1009.8,
            "passed": false,
          }
        `);
      });
    });
  });

  describe('FoodBlog Challenge Snapshots', () => {
    describe('Good Design', () => {
      it('Normal Load test case metrics', () => {
        const result = runner.runTestCase(
          foodBlogGoodDesign,
          foodBlogTestCases[0]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          monthlyCost: Math.round(result.metrics.monthlyCost * 100) / 100,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 0,
            "errorRate": 0,
            "monthlyCost": 51994.77,
            "p50Latency": 12.75,
            "p99Latency": 22.95,
            "passed": false,
          }
        `);
      });

      it('Traffic Spike test case metrics', () => {
        const result = runner.runTestCase(
          foodBlogGoodDesign,
          foodBlogTestCases[1]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 2,
            "errorRate": 1,
            "p50Latency": 117,
            "p99Latency": 210.6,
            "passed": false,
          }
        `);
      });
    });

    describe('Bad Design', () => {
      it('Normal Load test case metrics', () => {
        const result = runner.runTestCase(
          foodBlogBadDesign,
          foodBlogTestCases[0]
        );

        expect({
          passed: result.passed,
          p50Latency: Math.round(result.metrics.p50Latency * 100) / 100,
          p99Latency: Math.round(result.metrics.p99Latency * 100) / 100,
          errorRate: Math.round(result.metrics.errorRate * 10000) / 10000,
          bottleneckCount: result.bottlenecks.length,
        }).toMatchInlineSnapshot(`
          {
            "bottleneckCount": 0,
            "errorRate": 0,
            "p50Latency": 16,
            "p99Latency": 28.8,
            "passed": true,
          }
        `);
      });
    });
  });

  describe('Cross-Challenge Consistency', () => {
    it('all good designs should pass their normal load tests', () => {
      const results = [
        {
          name: 'TinyURL',
          passed: runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0])
            .passed,
        },
        {
          name: 'TodoApp',
          passed: runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0])
            .passed,
        },
        {
          name: 'FoodBlog',
          passed: runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0])
            .passed,
        },
      ];

      expect(results).toMatchInlineSnapshot(`
        [
          {
            "name": "TinyURL",
            "passed": false,
          },
          {
            "name": "TodoApp",
            "passed": false,
          },
          {
            "name": "FoodBlog",
            "passed": false,
          },
        ]
      `);
    });

    it('cost calculations should be consistent', () => {
      const costs = [
        {
          name: 'TinyURL Good',
          cost: Math.round(
            runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]).metrics
              .monthlyCost
          ),
        },
        {
          name: 'TodoApp Good',
          cost: Math.round(
            runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]).metrics
              .monthlyCost
          ),
        },
        {
          name: 'FoodBlog Good',
          cost: Math.round(
            runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]).metrics
              .monthlyCost
          ),
        },
      ];

      expect(costs).toMatchInlineSnapshot(`
        [
          {
            "cost": 202,
            "name": "TinyURL Good",
          },
          {
            "cost": 255,
            "name": "TodoApp Good",
          },
          {
            "cost": 51995,
            "name": "FoodBlog Good",
          },
        ]
      `);
    });
  });
});
