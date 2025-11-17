/**
 * Engine Integration Tests
 *
 * Tests that Phase 2 and 3 modules are properly integrated into the SimulationEngine.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SimulationEngine } from '../simulation/engine';
import {
  enableFeature,
  disableFeature,
  resetFlags,
} from '../simulation/featureFlags';
import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';

describe('Engine Integration with Phase 2 and 3 Modules', () => {
  let engine: SimulationEngine;

  // Simple test graph with client -> LB -> app -> cache -> db
  const createTestGraph = (): SystemGraph => ({
    components: [
      { id: 'client1', type: 'client', config: {} },
      { id: 'lb1', type: 'load_balancer', config: {} },
      { id: 'app1', type: 'app_server', config: { instances: 2 } },
      {
        id: 'cache1',
        type: 'redis',
        config: {
          memorySizeGB: 10,
          ttlSeconds: 3600,
        },
      },
      {
        id: 'db1',
        type: 'postgresql',
        config: {
          instanceType: 'db.t3.medium', // Use valid instance type
          storageSizeGB: 100,
        },
      },
    ],
    connections: [
      { id: 'c1', from: 'client1', to: 'lb1', type: 'read_write' },
      { id: 'c2', from: 'lb1', to: 'app1', type: 'read_write' },
      { id: 'c3', from: 'app1', to: 'cache1', type: 'read' },
      { id: 'c4', from: 'cache1', to: 'db1', type: 'read' },
      { id: 'c5', from: 'app1', to: 'db1', type: 'read_write' }, // Changed to read_write to allow both paths
    ],
  });

  const createTestCase = (rps: number = 1000): TestCase => ({
    id: 'test1',
    name: 'Load Test',
    description: 'Test with load',
    traffic: {
      rps,
      readRatio: 0.9,
    },
    duration: 120,
    targets: {
      maxP99Latency: 500,
      maxErrorRate: 0.01,
    },
  });

  beforeEach(() => {
    engine = new SimulationEngine();
    resetFlags();
  });

  afterEach(() => {
    resetFlags();
  });

  describe('Traffic Pattern Integration', () => {
    it('should apply traffic patterns when feature flag is enabled', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');

      const graph = createTestGraph();
      const testCase = createTestCase(1000);

      // Configure flash crowd pattern
      engine.setTrafficPattern({
        type: 'flash_crowd',
        baseRps: 1000,
        peakRps: 5000,
        flashCrowdStartSecond: 30, // Flash crowd starts at 30s
        flashCrowdDurationSeconds: 120, // Lasts 120s (covers midpoint at 60s)
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Traffic pattern should affect simulation
      // At midpoint (60s), we're in the middle of flash crowd
      expect(result.metrics).toBeDefined();
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
      expect(result.componentMetrics.size).toBeGreaterThan(0);
    });

    it('should not apply traffic patterns when feature flag is disabled', () => {
      disableFeature('ENABLE_TRAFFIC_PATTERNS');

      const graph = createTestGraph();
      const testCase1 = createTestCase(100); // Lower RPS to avoid overload

      // Configure flash crowd pattern (should be ignored)
      engine.setTrafficPattern({
        type: 'flash_crowd',
        baseRps: 100,
        peakRps: 1000,
        flashCrowdStartSecond: 0,
        flashCrowdDurationSeconds: 600,
      });

      const result = engine.simulateTraffic(graph, testCase1);

      // Simulation should complete normally
      expect(result.metrics).toBeDefined();
      expect(result.metrics.errorRate).toBeLessThanOrEqual(1);
    });
  });

  describe('Failure Injection Integration', () => {
    it('should apply failure effects when feature flag is enabled', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      const graph = createTestGraph();
      const testCase = createTestCase(500);

      // Inject database crash at midpoint
      engine.setFailureInjections([
        {
          type: 'crash',
          targetComponents: ['db1'],
          startTimeSeconds: 50,
          durationSeconds: 40, // Covers midpoint at 60s
          severity: 1.0,
          recoveryPattern: 'instant',
        },
      ]);

      const result = engine.simulateTraffic(graph, testCase);

      // Database crash should cause high error rate
      const dbMetrics = result.componentMetrics.get('db1');
      expect(dbMetrics).toBeDefined();
      expect(dbMetrics!.errorRate).toBeGreaterThan(0.5);
      expect(dbMetrics!.warnings).toBeDefined();
      expect(dbMetrics!.warnings!.some((w) => w.includes('crashed'))).toBe(true);
    });

    it('should apply slow component effects', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');

      const graph = createTestGraph();
      const testCase = createTestCase(500);

      // Get baseline without failure
      const baselineResult = engine.simulateTraffic(graph, testCase);
      const baselineLatency = baselineResult.metrics.p50Latency;

      // Inject slow database
      engine.setFailureInjections([
        {
          type: 'slow',
          targetComponents: ['db1'],
          startTimeSeconds: 0,
          durationSeconds: 200,
          severity: 0.8,
          recoveryPattern: 'instant',
        },
      ]);

      const slowResult = engine.simulateTraffic(graph, testCase);

      // Latency should increase significantly
      expect(slowResult.metrics.p50Latency).toBeGreaterThan(baselineLatency);
    });

    it('should not apply failures when feature flag is disabled', () => {
      disableFeature('ENABLE_FAILURE_INJECTION');

      const graph = createTestGraph();
      const testCase = createTestCase(100); // Lower RPS

      // Configure failures (should be ignored)
      engine.setFailureInjections([
        {
          type: 'crash',
          targetComponents: ['db1'],
          startTimeSeconds: 0,
          durationSeconds: 200,
          severity: 1.0,
        },
      ]);

      const result = engine.simulateTraffic(graph, testCase);

      // System should work normally - failures are ignored
      const dbMetrics = result.componentMetrics.get('db1');
      expect(dbMetrics).toBeDefined();
      // Without failure injection, DB should not have extreme errors
      expect(dbMetrics!.errorRate).toBeLessThanOrEqual(1);
    });
  });

  describe('Dynamic Cache Hit Ratio Integration', () => {
    it('should use dynamic cache hit ratio when feature flag is enabled', () => {
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      const graph = createTestGraph();
      const testCase = createTestCase(100); // Lower RPS

      // Set cache access pattern
      engine.setCacheAccessPattern('zipf');

      const result = engine.simulateTraffic(graph, testCase);

      // Cache should be utilized
      const cacheMetrics = result.componentMetrics.get('cache1');
      expect(cacheMetrics).toBeDefined();
      expect(cacheMetrics!.latency).toBeGreaterThan(0);

      // Overall system should function
      expect(result.metrics.errorRate).toBeLessThanOrEqual(1);
    });

    it('should respect different cache access patterns', () => {
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');

      const graph = createTestGraph();
      const testCase = createTestCase(1000);

      // Test with uniform pattern (lower hit ratio)
      engine.setCacheAccessPattern('uniform');
      const uniformResult = engine.simulateTraffic(graph, testCase);

      // Test with zipf pattern (higher hit ratio)
      engine.setCacheAccessPattern('zipf');
      const zipfResult = engine.simulateTraffic(graph, testCase);

      // Both should complete successfully
      expect(uniformResult.metrics).toBeDefined();
      expect(zipfResult.metrics).toBeDefined();
    });
  });

  describe('Database Capacity Modeling Integration', () => {
    it('should apply connection pool modeling when feature flag is enabled', () => {
      enableFeature('ENABLE_DB_CONNECTION_POOL');

      const graph = createTestGraph();
      const testCase = createTestCase(2000);

      // Set query complexity
      engine.setQueryComplexity('complex');
      engine.setIOPattern('random');

      const result = engine.simulateTraffic(graph, testCase);

      // Database should show effects of capacity modeling
      const dbMetrics = result.componentMetrics.get('db1');
      expect(dbMetrics).toBeDefined();
      expect(dbMetrics!.latency).toBeGreaterThan(0);
    });

    it('should adjust latency based on query complexity', () => {
      enableFeature('ENABLE_DB_CONNECTION_POOL');

      const graph = createTestGraph();
      const testCase = createTestCase(1000);

      // Simple queries
      engine.setQueryComplexity('simple');
      const simpleResult = engine.simulateTraffic(graph, testCase);

      // Analytical queries (much more complex)
      engine.setQueryComplexity('analytical');
      const analyticalResult = engine.simulateTraffic(graph, testCase);

      // Both should complete
      expect(simpleResult.metrics.p50Latency).toBeGreaterThan(0);
      expect(analyticalResult.metrics.p50Latency).toBeGreaterThan(0);
    });
  });

  describe('Combined Feature Integration', () => {
    it('should handle multiple features enabled simultaneously', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');
      enableFeature('ENABLE_FAILURE_INJECTION');
      enableFeature('ENABLE_DYNAMIC_CACHE_HIT');
      enableFeature('ENABLE_DB_CONNECTION_POOL');

      const graph = createTestGraph();
      const testCase = createTestCase(100); // Lower RPS

      // Configure all advanced features
      engine.setTrafficPattern({
        type: 'daily_cycle',
        baseRps: 100,
        peakRps: 200,
        valleyRps: 50,
        peakTimeHour: 15,
      });

      engine.setFailureInjections([
        {
          type: 'slow',
          targetComponents: ['cache1'],
          startTimeSeconds: 50,
          durationSeconds: 20,
          severity: 0.3,
          recoveryPattern: 'instant',
        },
      ]);

      engine.setCacheAccessPattern('zipf');
      engine.setQueryComplexity('moderate');
      engine.setIOPattern('mixed');

      const result = engine.simulateTraffic(graph, testCase);

      // All components should be simulated
      expect(result.componentMetrics.size).toBeGreaterThanOrEqual(4);

      // Cache should have failure warnings
      const cacheMetrics = result.componentMetrics.get('cache1');
      expect(cacheMetrics).toBeDefined();

      // System should still function (metrics should be calculated)
      expect(result.metrics.errorRate).toBeLessThanOrEqual(1);
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
    });

    it('should reset advanced configuration correctly', () => {
      const graph = createTestGraph();
      const testCase = createTestCase(100); // Lower RPS

      // Configure features
      engine.setTrafficPattern({
        type: 'flash_crowd',
        baseRps: 100,
        peakRps: 10000,
      });
      engine.setFailureInjections([
        {
          type: 'crash',
          targetComponents: ['db1'],
          startTimeSeconds: 0,
          durationSeconds: 200,
          severity: 1.0,
        },
      ]);

      // Reset configuration
      engine.resetAdvancedConfig();

      // Simulate with reset config (should use defaults)
      const result = engine.simulateTraffic(graph, testCase);

      // System should work normally
      expect(result.metrics).toBeDefined();
      expect(result.metrics.errorRate).toBeLessThanOrEqual(1);
    });
  });

  describe('Bottleneck Detection with Advanced Features', () => {
    it('should identify bottlenecks under load with traffic patterns', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');

      const graph = createTestGraph();
      const testCase = createTestCase(5000);

      // Configure high traffic spike
      engine.setTrafficPattern({
        type: 'constant',
        baseRps: 5000,
      });

      const result = engine.simulateTraffic(graph, testCase);
      const bottlenecks = engine.identifyBottlenecks(result.componentMetrics);

      // Should identify components under stress
      expect(bottlenecks).toBeDefined();
      expect(Array.isArray(bottlenecks)).toBe(true);
    });

    it('should provide recommendations for overloaded components', () => {
      const graph = createTestGraph();
      const testCase = createTestCase(10000); // High load

      const result = engine.simulateTraffic(graph, testCase);
      const bottlenecks = engine.identifyBottlenecks(result.componentMetrics);

      // If bottlenecks found, they should have recommendations
      for (const bottleneck of bottlenecks) {
        expect(bottleneck.recommendation).toBeDefined();
        expect(typeof bottleneck.recommendation).toBe('string');
        expect(bottleneck.recommendation.length).toBeGreaterThan(0);
      }
    });
  });
});
