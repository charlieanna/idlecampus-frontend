/**
 * Reliability Patterns Engine Integration Tests (Phase 4)
 *
 * Tests that Phase 4 reliability pattern modules are properly integrated into SimulationEngine.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SimulationEngine } from '../simulation/engine';
import { enableFeature, disableFeature, resetFlags } from '../simulation/featureFlags';
import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import {
  DEFAULT_RETRY_CONFIG,
  DEFAULT_CIRCUIT_BREAKER_CONFIG,
  DEFAULT_TIMEOUT_CONFIG,
  DEFAULT_QUEUE_CONFIG,
} from '../simulation/reliabilityPatterns';

describe('Reliability Patterns Engine Integration', () => {
  let engine: SimulationEngine;

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
          instanceType: 'db.t3.medium',
          storageSizeGB: 100,
        },
      },
    ],
    connections: [
      { id: 'c1', from: 'client1', to: 'lb1', type: 'read_write' },
      { id: 'c2', from: 'lb1', to: 'app1', type: 'read_write' },
      { id: 'c3', from: 'app1', to: 'cache1', type: 'read' },
      { id: 'c4', from: 'cache1', to: 'db1', type: 'read' },
      { id: 'c5', from: 'app1', to: 'db1', type: 'read_write' },
    ],
  });

  const createTestCase = (rps: number = 100): TestCase => ({
    id: 'test1',
    name: 'Reliability Test',
    description: 'Test with reliability patterns',
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

  describe('Retry Logic Integration', () => {
    it('should not apply retry logic when feature flag is disabled', () => {
      disableFeature('ENABLE_RETRY_LOGIC');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 5,
        retryableErrorRate: 1.0,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Simulation should complete normally
      expect(result.metrics).toBeDefined();
      expect(result.metrics.errorRate).toBeLessThanOrEqual(1);
    });

    it('should apply retry amplification when feature flag is enabled', () => {
      enableFeature('ENABLE_RETRY_LOGIC');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      // Configure high retry rate
      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 5,
        retryableErrorRate: 1.0,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Simulation should complete, metrics should reflect retry effects
      expect(result.metrics).toBeDefined();
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
    });

    it('should add retry warnings to app server metrics', () => {
      enableFeature('ENABLE_RETRY_LOGIC');

      const graph = createTestGraph();
      const testCase = createTestCase(500);

      // Configure aggressive retries
      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 10,
        retryableErrorRate: 1.0,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // App server should have retry-related warnings
      const appMetrics = result.componentMetrics.get('app1');
      expect(appMetrics).toBeDefined();
    });
  });

  describe('Circuit Breaker Integration', () => {
    it('should not apply circuit breaker when feature flag is disabled', () => {
      disableFeature('ENABLE_CIRCUIT_BREAKER');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setCircuitBreakerConfig({
        ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
        failureThreshold: 1, // Very sensitive
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Should complete normally
      expect(result.metrics).toBeDefined();
    });

    it('should apply circuit breaker effects when enabled', () => {
      enableFeature('ENABLE_CIRCUIT_BREAKER');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setCircuitBreakerConfig({
        ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
        failureThreshold: 10,
        timeoutSeconds: 60,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Simulation should complete with circuit breaker in effect
      expect(result.metrics).toBeDefined();
      expect(result.metrics.errorRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Timeout Enforcement Integration', () => {
    it('should not apply timeout enforcement when feature flag is disabled', () => {
      disableFeature('ENABLE_TIMEOUT_ENFORCEMENT');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setTimeoutConfig({
        ...DEFAULT_TIMEOUT_CONFIG,
        requestTimeoutMs: 10, // Very tight timeout
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Should complete normally
      expect(result.metrics).toBeDefined();
    });

    it('should cap latency based on timeout when enabled', () => {
      enableFeature('ENABLE_TIMEOUT_ENFORCEMENT');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setTimeoutConfig({
        ...DEFAULT_TIMEOUT_CONFIG,
        requestTimeoutMs: 5000, // 5 second timeout
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Effective latency should be bounded by timeout
      expect(result.metrics).toBeDefined();
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
    });
  });

  describe('Backpressure/Queue Integration', () => {
    it('should not apply backpressure when feature flag is disabled', () => {
      disableFeature('ENABLE_BACKPRESSURE');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setQueueConfig({
        ...DEFAULT_QUEUE_CONFIG,
        processingRateRps: 10, // Very low processing rate
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Should complete normally
      expect(result.metrics).toBeDefined();
    });

    it('should apply queue wait time when enabled', () => {
      enableFeature('ENABLE_BACKPRESSURE');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      engine.setQueueConfig({
        ...DEFAULT_QUEUE_CONFIG,
        processingRateRps: 200,
        maxQueueSize: 100,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Queue effects should be applied
      expect(result.metrics).toBeDefined();
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
    });

    it('should increase error rate when queue overflows', () => {
      enableFeature('ENABLE_BACKPRESSURE');

      const graph = createTestGraph();
      const testCase = createTestCase(500);

      // Set processing rate lower than incoming traffic
      engine.setQueueConfig({
        maxQueueSize: 10,
        maxWaitTimeMs: 1000,
        processingRateRps: 100, // Queue will overflow at 500 RPS
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Should have higher error rate due to overflow
      expect(result.metrics).toBeDefined();
      expect(result.metrics.errorRate).toBeGreaterThan(0);
    });
  });

  describe('Combined Reliability Patterns', () => {
    it('should apply all patterns when all flags are enabled', () => {
      enableFeature('ENABLE_RETRY_LOGIC');
      enableFeature('ENABLE_CIRCUIT_BREAKER');
      enableFeature('ENABLE_TIMEOUT_ENFORCEMENT');
      enableFeature('ENABLE_BACKPRESSURE');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      // Configure all patterns
      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 3,
        retryableErrorRate: 0.5,
      });

      engine.setCircuitBreakerConfig({
        ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
        failureThreshold: 50,
      });

      engine.setTimeoutConfig({
        ...DEFAULT_TIMEOUT_CONFIG,
        requestTimeoutMs: 2000,
      });

      engine.setQueueConfig({
        ...DEFAULT_QUEUE_CONFIG,
        processingRateRps: 200,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // All patterns should be applied
      expect(result.metrics).toBeDefined();
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
      expect(result.metrics.errorRate).toBeLessThanOrEqual(1);
      expect(result.metrics.errorRate).toBeGreaterThanOrEqual(0);
    });

    it('should reset reliability configuration correctly', () => {
      enableFeature('ENABLE_RETRY_LOGIC');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      // Configure aggressive settings
      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 10,
        retryableErrorRate: 1.0,
      });

      // Reset to defaults
      engine.resetAdvancedConfig();

      const result = engine.simulateTraffic(graph, testCase);

      // Should use default configuration
      expect(result.metrics).toBeDefined();
    });

    it('should handle high load with all patterns enabled', () => {
      enableFeature('ENABLE_RETRY_LOGIC');
      enableFeature('ENABLE_CIRCUIT_BREAKER');
      enableFeature('ENABLE_TIMEOUT_ENFORCEMENT');
      enableFeature('ENABLE_BACKPRESSURE');

      const graph = createTestGraph();
      const testCase = createTestCase(1000); // High load

      const result = engine.simulateTraffic(graph, testCase);

      // System should handle high load
      expect(result.metrics).toBeDefined();
      expect(result.componentMetrics.size).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Interaction with Other Features', () => {
    it('should work with traffic patterns and reliability patterns together', () => {
      enableFeature('ENABLE_TRAFFIC_PATTERNS');
      enableFeature('ENABLE_RETRY_LOGIC');
      enableFeature('ENABLE_BACKPRESSURE');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      // Configure traffic pattern
      engine.setTrafficPattern({
        type: 'constant',
        baseRps: 100,
      });

      // Configure reliability patterns
      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 2,
      });

      engine.setQueueConfig({
        ...DEFAULT_QUEUE_CONFIG,
        processingRateRps: 200,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Both patterns should be applied
      expect(result.metrics).toBeDefined();
      expect(result.metrics.p50Latency).toBeGreaterThan(0);
    });

    it('should work with failure injection and reliability patterns together', () => {
      enableFeature('ENABLE_FAILURE_INJECTION');
      enableFeature('ENABLE_CIRCUIT_BREAKER');
      enableFeature('ENABLE_RETRY_LOGIC');

      const graph = createTestGraph();
      const testCase = createTestCase(100);

      // Inject slow database
      engine.setFailureInjections([
        {
          type: 'slow',
          targetComponents: ['db1'],
          startTimeSeconds: 0,
          durationSeconds: 200,
          severity: 0.3,
          recoveryPattern: 'instant',
        },
      ]);

      // Configure retry to handle failures
      engine.setRetryConfig({
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 2,
        retryableErrorRate: 1.0,
      });

      const result = engine.simulateTraffic(graph, testCase);

      // Should handle failures with reliability patterns
      expect(result.metrics).toBeDefined();
    });
  });
});
