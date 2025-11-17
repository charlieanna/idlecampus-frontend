/**
 * Phase 0.2: Performance Benchmarking Tests
 *
 * These tests establish performance baselines for the simulation engine.
 * They detect performance regressions when new features are added.
 *
 * IMPORTANT: Performance numbers are environment-dependent. If tests fail:
 * 1. Run on same machine type for consistent results
 * 2. Check if thresholds need adjustment for your hardware
 * 3. Consider using relative comparisons instead of absolute thresholds
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TestRunner } from '../../simulation/testRunner';
import { resetFlags, enableFeature } from '../../simulation/featureFlags';
import { SystemGraph } from '../../types/graph';
import { TestCase } from '../../types/testCase';

import {
  tinyUrlGoodDesign,
  tinyUrlTestCases,
} from '../../examples/tinyUrlExample';

import {
  todoAppGoodDesign,
  todoAppTestCases,
} from '../../examples/todoAppExample';

import {
  foodBlogGoodDesign,
  foodBlogTestCases,
} from '../../examples/foodBlogExample';

describe('Simulation Engine Performance Benchmarks', () => {
  const runner = new TestRunner();

  beforeEach(() => {
    resetFlags();
  });

  describe('Single Simulation Performance', () => {
    it('TinyURL simulation should complete within time budget', () => {
      const start = performance.now();

      runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);

      const elapsed = performance.now() - start;

      // Baseline: Single simulation should complete in under 50ms
      // This is generous to account for slower CI environments
      expect(elapsed).toBeLessThan(50);

      // Log for baseline tracking
      console.log(`TinyURL single simulation: ${elapsed.toFixed(2)}ms`);
    });

    it('TodoApp simulation should complete within time budget', () => {
      const start = performance.now();

      runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]);

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      console.log(`TodoApp single simulation: ${elapsed.toFixed(2)}ms`);
    });

    it('FoodBlog simulation should complete within time budget', () => {
      const start = performance.now();

      runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      console.log(`FoodBlog single simulation: ${elapsed.toFixed(2)}ms`);
    });
  });

  describe('Batch Simulation Performance', () => {
    it('should run 100 simulations in reasonable time', () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }

      const elapsed = performance.now() - start;
      const avgTime = elapsed / iterations;

      // 100 simulations should complete in under 2 seconds
      expect(elapsed).toBeLessThan(2000);
      // Average time should be under 20ms per simulation
      expect(avgTime).toBeLessThan(20);

      console.log(
        `100 simulations: ${elapsed.toFixed(2)}ms total, ${avgTime.toFixed(2)}ms avg`
      );
    });

    it('should handle all test cases for a design efficiently', () => {
      const start = performance.now();

      const results = runner.runAllTestCases(
        tinyUrlGoodDesign,
        tinyUrlTestCases
      );

      const elapsed = performance.now() - start;

      // Running 3 test cases should be under 150ms
      expect(elapsed).toBeLessThan(150);
      expect(results.length).toBe(3);

      console.log(
        `All TinyURL test cases (${results.length}): ${elapsed.toFixed(2)}ms`
      );
    });
  });

  describe('Memory Usage Patterns', () => {
    it('should not leak memory across multiple simulations', () => {
      // Force garbage collection if available (Node.js with --expose-gc)
      if (global.gc) {
        global.gc();
      }

      const initialMemory = process.memoryUsage().heapUsed;

      // Run many simulations
      for (let i = 0; i < 1000; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }

      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryGrowth = finalMemory - initialMemory;
      const memoryGrowthMB = memoryGrowth / (1024 * 1024);

      // Memory growth should be less than 50MB for 1000 simulations
      // This is generous to avoid flaky tests
      expect(memoryGrowthMB).toBeLessThan(50);

      console.log(`Memory growth after 1000 simulations: ${memoryGrowthMB.toFixed(2)}MB`);
    });

    it('result objects should have reasonable size', () => {
      const result = runner.runTestCase(
        tinyUrlGoodDesign,
        tinyUrlTestCases[0]
      );

      // Rough size estimation based on JSON stringification
      const jsonSize = JSON.stringify(result).length;
      const sizeKB = jsonSize / 1024;

      // Result should be under 10KB (reasonable for UI rendering)
      expect(sizeKB).toBeLessThan(10);

      console.log(`Result object size: ${sizeKB.toFixed(2)}KB`);
    });
  });

  describe('Scalability Tests', () => {
    it('should scale linearly with number of components', () => {
      // Create designs with increasing complexity
      const smallDesign: SystemGraph = {
        components: [
          { id: 'app', type: 'app_server', config: { instances: 1 } },
          { id: 'db', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 100 } },
        ],
        connections: [{ from: 'app', to: 'db', type: 'read_write' }],
      };

      const mediumDesign: SystemGraph = {
        components: [
          { id: 'lb', type: 'load_balancer', config: {} },
          { id: 'app1', type: 'app_server', config: { instances: 2 } },
          { id: 'app2', type: 'app_server', config: { instances: 2 } },
          { id: 'cache', type: 'redis', config: { memorySizeGB: 4, hitRatio: 0.9 } },
          { id: 'db', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'lb', to: 'app1', type: 'read_write' },
          { from: 'lb', to: 'app2', type: 'read_write' },
          { from: 'app1', to: 'cache', type: 'read' },
          { from: 'app2', to: 'cache', type: 'read' },
          { from: 'cache', to: 'db', type: 'read' },
          { from: 'app1', to: 'db', type: 'write' },
          { from: 'app2', to: 'db', type: 'write' },
        ],
      };

      const largeDesign: SystemGraph = {
        components: [
          { id: 'cdn', type: 'cdn', config: { cacheHitRatio: 0.8 } },
          { id: 'lb1', type: 'load_balancer', config: {} },
          { id: 'lb2', type: 'load_balancer', config: {} },
          { id: 'app1', type: 'app_server', config: { instances: 3 } },
          { id: 'app2', type: 'app_server', config: { instances: 3 } },
          { id: 'app3', type: 'app_server', config: { instances: 3 } },
          { id: 'cache1', type: 'redis', config: { memorySizeGB: 8, hitRatio: 0.9 } },
          { id: 'cache2', type: 'redis', config: { memorySizeGB: 8, hitRatio: 0.9 } },
          { id: 'db1', type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 200 } },
          { id: 'db2', type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 200 } },
        ],
        connections: [
          { from: 'cdn', to: 'lb1', type: 'read' },
          { from: 'lb1', to: 'app1', type: 'read_write' },
          { from: 'lb1', to: 'app2', type: 'read_write' },
          { from: 'lb2', to: 'app3', type: 'read_write' },
          { from: 'app1', to: 'cache1', type: 'read' },
          { from: 'app2', to: 'cache1', type: 'read' },
          { from: 'app3', to: 'cache2', type: 'read' },
          { from: 'cache1', to: 'db1', type: 'read' },
          { from: 'cache2', to: 'db2', type: 'read' },
          { from: 'app1', to: 'db1', type: 'write' },
          { from: 'app2', to: 'db1', type: 'write' },
          { from: 'app3', to: 'db2', type: 'write' },
        ],
      };

      const testCase: TestCase = {
        name: 'Scalability Test',
        traffic: { type: 'mixed', rps: 1000, readRatio: 0.8 },
        duration: 60,
        passCriteria: { maxP99Latency: 500, maxErrorRate: 0.1 },
      };

      const iterations = 10;

      // Measure small design
      const smallStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(smallDesign, testCase);
      }
      const smallTime = (performance.now() - smallStart) / iterations;

      // Measure medium design
      const mediumStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(mediumDesign, testCase);
      }
      const mediumTime = (performance.now() - mediumStart) / iterations;

      // Measure large design
      const largeStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(largeDesign, testCase);
      }
      const largeTime = (performance.now() - largeStart) / iterations;

      console.log(`Small (2 components): ${smallTime.toFixed(2)}ms`);
      console.log(`Medium (5 components): ${mediumTime.toFixed(2)}ms`);
      console.log(`Large (10 components): ${largeTime.toFixed(2)}ms`);

      // Performance should scale reasonably (not exponentially)
      // Large should be less than 10x slower than small
      expect(largeTime / smallTime).toBeLessThan(10);

      // All should still be fast enough for interactive use
      expect(largeTime).toBeLessThan(100);
    });

    it('should handle high RPS test cases', () => {
      const highRpsTestCase: TestCase = {
        name: 'High RPS Test',
        traffic: { type: 'mixed', rps: 100000, readRatio: 0.9 },
        duration: 60,
        passCriteria: { maxP99Latency: 1000, maxErrorRate: 0.5 },
      };

      const start = performance.now();
      const result = runner.runTestCase(tinyUrlGoodDesign, highRpsTestCase);
      const elapsed = performance.now() - start;

      // Even high RPS should complete quickly (we're not simulating each request)
      expect(elapsed).toBeLessThan(100);
      expect(result.metrics).toBeDefined();

      console.log(`High RPS (100k) simulation: ${elapsed.toFixed(2)}ms`);
    });

    it('should handle long duration test cases', () => {
      const longDurationTestCase: TestCase = {
        name: 'Long Duration Test',
        traffic: { type: 'mixed', rps: 1000, readRatio: 0.9 },
        duration: 3600, // 1 hour
        passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
      };

      const start = performance.now();
      const result = runner.runTestCase(tinyUrlGoodDesign, longDurationTestCase);
      const elapsed = performance.now() - start;

      // Duration shouldn't affect simulation time significantly
      // (we're calculating steady-state, not simulating each second)
      expect(elapsed).toBeLessThan(100);
      expect(result.metrics).toBeDefined();

      console.log(`Long duration (1hr) simulation: ${elapsed.toFixed(2)}ms`);
    });
  });

  describe('Feature Flag Performance Impact', () => {
    it('enabling deterministic random should not significantly impact performance', () => {
      const iterations = 100;

      // Without deterministic random
      resetFlags();
      const withoutStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }
      const withoutTime = performance.now() - withoutStart;

      // With deterministic random
      resetFlags();
      enableFeature('ENABLE_DETERMINISTIC_RANDOM');
      const withStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }
      const withTime = performance.now() - withStart;

      // Performance difference should be minimal (within 50%)
      const ratio = withTime / withoutTime;
      expect(ratio).toBeLessThan(1.5);
      expect(ratio).toBeGreaterThan(0.5);

      console.log(`Without deterministic: ${withoutTime.toFixed(2)}ms`);
      console.log(`With deterministic: ${withTime.toFixed(2)}ms`);
      console.log(`Ratio: ${ratio.toFixed(2)}x`);
    });
  });

  describe('Baseline Snapshot', () => {
    it('performance characteristics summary', () => {
      const summary = {
        singleSimulation: {
          tinyUrl: 0,
          todoApp: 0,
          foodBlog: 0,
        },
        batchSimulation: {
          count: 100,
          totalTime: 0,
          avgTime: 0,
        },
        scalability: {
          smallDesignTime: 0,
          mediumDesignTime: 0,
          largeDesignTime: 0,
        },
      };

      // Measure single simulations
      let start = performance.now();
      runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      summary.singleSimulation.tinyUrl =
        Math.round((performance.now() - start) * 100) / 100;

      start = performance.now();
      runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]);
      summary.singleSimulation.todoApp =
        Math.round((performance.now() - start) * 100) / 100;

      start = performance.now();
      runner.runTestCase(foodBlogGoodDesign, foodBlogTestCases[0]);
      summary.singleSimulation.foodBlog =
        Math.round((performance.now() - start) * 100) / 100;

      // Measure batch
      start = performance.now();
      for (let i = 0; i < 100; i++) {
        runner.runTestCase(tinyUrlGoodDesign, tinyUrlTestCases[0]);
      }
      summary.batchSimulation.totalTime =
        Math.round((performance.now() - start) * 100) / 100;
      summary.batchSimulation.avgTime =
        Math.round((summary.batchSimulation.totalTime / 100) * 100) / 100;

      console.log('\n=== PERFORMANCE BASELINE ===');
      console.log(JSON.stringify(summary, null, 2));
      console.log('============================\n');

      // This is informational - actual values will vary by machine
      expect(summary.singleSimulation.tinyUrl).toBeGreaterThan(0);
      expect(summary.batchSimulation.totalTime).toBeGreaterThan(0);
    });
  });
});
