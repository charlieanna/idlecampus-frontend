/**
 * Load Balancing Algorithm Tests
 *
 * Comprehensive tests for:
 * 1. Different load balancing algorithms
 * 2. Traffic distribution patterns
 * 3. Feature flag integration
 * 4. Load balancer component behavior
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  LoadBalancerState,
  distributeTraffic,
  selectBackendByHash,
  selectBackendRandom,
  selectBackendWeightedRandom,
  calculateLoadBalancerMetrics,
  getRecommendedAlgorithm,
  validateLoadBalancerConfig,
  BackendInstance,
  LoadBalancerConfig,
} from '../simulation/loadBalancing';
import { LoadBalancer } from '../simulation/components/LoadBalancer';
import {
  resetFlags,
  enableFeature,
  disableFeature,
} from '../simulation/featureFlags';

describe('Load Balancing', () => {
  beforeEach(() => {
    resetFlags();
  });

  afterEach(() => {
    resetFlags();
  });

  describe('LoadBalancerState', () => {
    describe('Round Robin', () => {
      it('should cycle through backends in order', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1' },
          { id: 'app2' },
          { id: 'app3' },
        ];

        expect(state.getNextRoundRobin(backends)).toBe('app1');
        expect(state.getNextRoundRobin(backends)).toBe('app2');
        expect(state.getNextRoundRobin(backends)).toBe('app3');
        expect(state.getNextRoundRobin(backends)).toBe('app1'); // Cycles back
      });

      it('should skip unhealthy backends', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1' },
          { id: 'app2', isHealthy: false },
          { id: 'app3' },
        ];

        expect(state.getNextRoundRobin(backends)).toBe('app1');
        expect(state.getNextRoundRobin(backends)).toBe('app3');
        expect(state.getNextRoundRobin(backends)).toBe('app1');
      });

      it('should throw when no healthy backends', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1', isHealthy: false },
          { id: 'app2', isHealthy: false },
        ];

        expect(() => state.getNextRoundRobin(backends)).toThrow(
          'No healthy backends available'
        );
      });
    });

    describe('Weighted Round Robin', () => {
      it('should distribute based on weights', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1', weight: 5 },
          { id: 'app2', weight: 1 },
        ];

        // Over multiple requests, app1 should be selected ~5x more often
        const counts: Record<string, number> = { app1: 0, app2: 0 };
        for (let i = 0; i < 60; i++) {
          const selected = state.getNextWeightedRoundRobin(backends);
          counts[selected]++;
        }

        // Should be roughly 5:1 ratio
        expect(counts.app1).toBeGreaterThan(counts.app2 * 4);
        expect(counts.app1).toBeLessThan(counts.app2 * 6);
      });

      it('should handle default weights', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1' }, // Default weight = 1
          { id: 'app2' }, // Default weight = 1
        ];

        const counts: Record<string, number> = { app1: 0, app2: 0 };
        for (let i = 0; i < 20; i++) {
          const selected = state.getNextWeightedRoundRobin(backends);
          counts[selected]++;
        }

        // Should be roughly equal
        expect(Math.abs(counts.app1 - counts.app2)).toBeLessThan(5);
      });
    });

    describe('Least Connections', () => {
      it('should select backend with fewest connections', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1', activeConnections: 10 },
          { id: 'app2', activeConnections: 5 },
          { id: 'app3', activeConnections: 8 },
        ];

        expect(state.getLeastConnections(backends)).toBe('app2');
      });

      it('should use internal connection tracking when no activeConnections', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1' },
          { id: 'app2' },
          { id: 'app3' },
        ];

        // Simulate connections
        state.incrementConnections('app1');
        state.incrementConnections('app1');
        state.incrementConnections('app2');

        // app3 has 0, should be selected
        expect(state.getLeastConnections(backends)).toBe('app3');
      });

      it('should consider weights in least connections', () => {
        const state = new LoadBalancerState();
        const backends: BackendInstance[] = [
          { id: 'app1', activeConnections: 10, weight: 2 },
          { id: 'app2', activeConnections: 8, weight: 1 },
        ];

        // app1: 10/2 = 5 weighted connections
        // app2: 8/1 = 8 weighted connections
        expect(state.getLeastConnections(backends)).toBe('app1');
      });

      it('should track connection increments and decrements', () => {
        const state = new LoadBalancerState();

        state.incrementConnections('app1');
        state.incrementConnections('app1');
        expect(state.getConnectionCount('app1')).toBe(2);

        state.decrementConnections('app1');
        expect(state.getConnectionCount('app1')).toBe(1);

        state.decrementConnections('app1');
        expect(state.getConnectionCount('app1')).toBe(0);

        // Should not go below 0
        state.decrementConnections('app1');
        expect(state.getConnectionCount('app1')).toBe(0);
      });
    });

    describe('State Management', () => {
      it('should track total requests', () => {
        const state = new LoadBalancerState();

        expect(state.getTotalRequests()).toBe(0);

        state.incrementTotalRequests();
        state.incrementTotalRequests();
        state.incrementTotalRequests();

        expect(state.getTotalRequests()).toBe(3);
      });

      it('should reset all state', () => {
        const state = new LoadBalancerState();

        state.incrementConnections('app1');
        state.incrementTotalRequests();
        state.getNextRoundRobin([{ id: 'app1' }, { id: 'app2' }]);

        state.reset();

        expect(state.getConnectionCount('app1')).toBe(0);
        expect(state.getTotalRequests()).toBe(0);
        // Round robin should restart from first backend
        expect(state.getNextRoundRobin([{ id: 'app1' }, { id: 'app2' }])).toBe('app1');
      });
    });
  });

  describe('Selection Functions', () => {
    const backends: BackendInstance[] = [
      { id: 'app1' },
      { id: 'app2' },
      { id: 'app3' },
    ];

    describe('selectBackendByHash', () => {
      it('should consistently select same backend for same key', () => {
        const key = 'user-123';
        const backend1 = selectBackendByHash(backends, key);
        const backend2 = selectBackendByHash(backends, key);
        const backend3 = selectBackendByHash(backends, key);

        expect(backend1).toBe(backend2);
        expect(backend2).toBe(backend3);
      });

      it('should distribute different keys across backends', () => {
        const selections = new Set<string>();
        for (let i = 0; i < 100; i++) {
          selections.add(selectBackendByHash(backends, `user-${i}`));
        }

        // Should use all backends
        expect(selections.size).toBe(3);
      });

      it('should skip unhealthy backends', () => {
        const backendsWithUnhealthy: BackendInstance[] = [
          { id: 'app1', isHealthy: false },
          { id: 'app2' },
          { id: 'app3' },
        ];

        // Repeatedly select - should never get app1
        for (let i = 0; i < 50; i++) {
          const selected = selectBackendByHash(backendsWithUnhealthy, `key-${i}`);
          expect(selected).not.toBe('app1');
        }
      });
    });

    describe('selectBackendRandom', () => {
      it('should eventually select all backends', () => {
        const selections = new Set<string>();
        for (let i = 0; i < 100; i++) {
          selections.add(selectBackendRandom(backends));
        }

        expect(selections.size).toBe(3);
      });

      it('should skip unhealthy backends', () => {
        const backendsWithUnhealthy: BackendInstance[] = [
          { id: 'app1', isHealthy: false },
          { id: 'app2' },
        ];

        for (let i = 0; i < 20; i++) {
          expect(selectBackendRandom(backendsWithUnhealthy)).toBe('app2');
        }
      });
    });

    describe('selectBackendWeightedRandom', () => {
      it('should respect weights in selection', () => {
        const weightedBackends: BackendInstance[] = [
          { id: 'app1', weight: 9 },
          { id: 'app2', weight: 1 },
        ];

        const counts: Record<string, number> = { app1: 0, app2: 0 };
        for (let i = 0; i < 1000; i++) {
          const selected = selectBackendWeightedRandom(weightedBackends);
          counts[selected]++;
        }

        // app1 should be selected ~90% of the time
        const app1Ratio = counts.app1 / (counts.app1 + counts.app2);
        expect(app1Ratio).toBeGreaterThan(0.85);
        expect(app1Ratio).toBeLessThan(0.95);
      });
    });
  });

  describe('distributeTraffic', () => {
    const backends: BackendInstance[] = [
      { id: 'app1' },
      { id: 'app2' },
      { id: 'app3' },
    ];

    it('should distribute evenly when flag is disabled', () => {
      disableFeature('ENABLE_LB_ALGORITHMS');

      const result = distributeTraffic(1000, {
        algorithm: 'round_robin',
        backends,
      });

      // Should distribute evenly
      const distribution = result.loadDistribution;
      expect(distribution.get('app1')).toBeCloseTo(333.33, 0);
      expect(distribution.get('app2')).toBeCloseTo(333.33, 0);
      expect(distribution.get('app3')).toBeCloseTo(333.33, 0);
    });

    it('should use algorithm when flag is enabled', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const weightedBackends: BackendInstance[] = [
        { id: 'app1', weight: 2 },
        { id: 'app2', weight: 1 },
      ];

      const result = distributeTraffic(1000, {
        algorithm: 'weighted_round_robin',
        backends: weightedBackends,
      });

      const distribution = result.loadDistribution;
      const app1Rps = distribution.get('app1') ?? 0;
      const app2Rps = distribution.get('app2') ?? 0;

      // app1 should get ~2x traffic of app2
      const ratio = app1Rps / app2Rps;
      expect(ratio).toBeGreaterThan(1.8);
      expect(ratio).toBeLessThan(2.2);
    });

    it('should warn about hot spots', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      // IP hash with few unique clients can cause hot spots
      const result = distributeTraffic(1000, {
        algorithm: 'ip_hash',
        backends: [{ id: 'app1' }, { id: 'app2' }, { id: 'app3' }],
        stickySessionKey: 'same-client', // Same client = same backend
      });

      // Single key should go to single backend - hot spot warning
      const maxRps = Math.max(...result.loadDistribution.values());
      expect(maxRps).toBeCloseTo(1000, 0); // All traffic to one backend (allow floating point)
      expect(result.warnings.some((w) => w.includes('Hot spot'))).toBe(true);
    });

    it('should warn about overloaded backends', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const limitedBackends: BackendInstance[] = [
        { id: 'app1', capacity: 100 },
        { id: 'app2', capacity: 100 },
      ];

      const result = distributeTraffic(500, {
        algorithm: 'round_robin',
        backends: limitedBackends,
      });

      // Each backend gets ~250 RPS but capacity is 100
      expect(result.warnings.some((w) => w.includes('overloaded'))).toBe(true);
    });

    it('should handle no healthy backends', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const result = distributeTraffic(1000, {
        algorithm: 'round_robin',
        backends: [{ id: 'app1', isHealthy: false }],
      });

      expect(result.loadDistribution.size).toBe(0);
      expect(result.warnings.some((w) => w.includes('No healthy backends'))).toBe(true);
    });
  });

  describe('calculateLoadBalancerMetrics', () => {
    it('should calculate weighted average latency', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const backends: BackendInstance[] = [
        { id: 'app1', weight: 1 },
        { id: 'app2', weight: 1 },
      ];

      const backendMetrics = new Map<string, { latency: number; errorRate: number }>();
      backendMetrics.set('app1', { latency: 10, errorRate: 0.01 });
      backendMetrics.set('app2', { latency: 20, errorRate: 0.02 });

      const metrics = calculateLoadBalancerMetrics(1000, {
        algorithm: 'round_robin',
        backends,
      }, backendMetrics);

      // Should be weighted average based on distribution
      expect(metrics.avgLatency).toBeGreaterThan(10);
      expect(metrics.avgLatency).toBeLessThan(20);
      expect(metrics.maxLatency).toBe(20);
      expect(metrics.combinedErrorRate).toBeGreaterThan(0.01);
      expect(metrics.combinedErrorRate).toBeLessThan(0.05);
    });

    it('should calculate utilization skew', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const backends: BackendInstance[] = [
        { id: 'app1', weight: 10 },
        { id: 'app2', weight: 1 },
      ];

      const backendMetrics = new Map<string, { latency: number; errorRate: number }>();
      backendMetrics.set('app1', { latency: 10, errorRate: 0 });
      backendMetrics.set('app2', { latency: 10, errorRate: 0 });

      const metrics = calculateLoadBalancerMetrics(1000, {
        algorithm: 'weighted_round_robin',
        backends,
      }, backendMetrics);

      // Should show high skew due to uneven weights
      expect(metrics.utilizationSkew).toBeGreaterThan(0.5);
    });
  });

  describe('getRecommendedAlgorithm', () => {
    it('should recommend ip_hash for session affinity', () => {
      const algo = getRecommendedAlgorithm({ hasSessionAffinity: true });
      expect(algo).toBe('ip_hash');
    });

    it('should recommend least_connections for varying request duration', () => {
      const algo = getRecommendedAlgorithm({ hasVaryingRequestDuration: true });
      expect(algo).toBe('least_connections');
    });

    it('should recommend weighted_round_robin for uneven capacity', () => {
      const algo = getRecommendedAlgorithm({ hasUnevenCapacity: true });
      expect(algo).toBe('weighted_round_robin');
    });

    it('should recommend random for high volume', () => {
      const algo = getRecommendedAlgorithm({ isHighVolume: true });
      expect(algo).toBe('random');
    });

    it('should default to round_robin', () => {
      const algo = getRecommendedAlgorithm({});
      expect(algo).toBe('round_robin');
    });
  });

  describe('validateLoadBalancerConfig', () => {
    it('should validate correct config', () => {
      const result = validateLoadBalancerConfig({
        algorithm: 'round_robin',
        backends: [{ id: 'app1' }, { id: 'app2' }],
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty backends', () => {
      const result = validateLoadBalancerConfig({
        algorithm: 'round_robin',
        backends: [],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('No backends'))).toBe(true);
    });

    it('should reject all unhealthy backends', () => {
      const result = validateLoadBalancerConfig({
        algorithm: 'round_robin',
        backends: [{ id: 'app1', isHealthy: false }],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('No healthy backends'))).toBe(true);
    });

    it('should reject invalid weights', () => {
      const result = validateLoadBalancerConfig({
        algorithm: 'weighted_round_robin',
        backends: [{ id: 'app1', weight: 0 }],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('invalid weight'))).toBe(true);
    });

    it('should reject invalid capacity', () => {
      const result = validateLoadBalancerConfig({
        algorithm: 'round_robin',
        backends: [{ id: 'app1', capacity: -100 }],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('invalid capacity'))).toBe(true);
    });

    it('should warn about missing session key for ip_hash', () => {
      const result = validateLoadBalancerConfig({
        algorithm: 'ip_hash',
        backends: [{ id: 'app1' }],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('sticky session key'))).toBe(true);
    });
  });

  describe('LoadBalancer Component', () => {
    it('should maintain backward compatibility when flag is off', () => {
      disableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1');
      const metrics = lb.simulate(1000);

      expect(metrics.latency).toBe(1); // Base latency
      expect(metrics.errorRate).toBe(0);
      expect(metrics.cost).toBe(50);
    });

    it('should use configured algorithm', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1', {
        algorithm: 'least_connections',
        backends: [{ id: 'app1' }, { id: 'app2' }],
      });

      expect(lb.getAlgorithm()).toBe('least_connections');
    });

    it('should allow algorithm changes', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1');
      expect(lb.getAlgorithm()).toBe('round_robin'); // Default

      lb.setAlgorithm('weighted_round_robin');
      expect(lb.getAlgorithm()).toBe('weighted_round_robin');
    });

    it('should track load distribution', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1', {
        algorithm: 'round_robin',
        backends: [{ id: 'app1' }, { id: 'app2' }],
      });

      lb.simulate(1000);

      const distribution = lb.getLastDistribution();
      expect(distribution.size).toBe(2);

      // Should be roughly equal
      const app1Rps = distribution.get('app1') ?? 0;
      const app2Rps = distribution.get('app2') ?? 0;
      expect(Math.abs(app1Rps - app2Rps)).toBeLessThan(100);
    });

    it('should select next backend for single requests', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1', {
        algorithm: 'round_robin',
        backends: [{ id: 'app1' }, { id: 'app2' }, { id: 'app3' }],
      });

      expect(lb.selectNextBackend()).toBe('app1');
      expect(lb.selectNextBackend()).toBe('app2');
      expect(lb.selectNextBackend()).toBe('app3');
      expect(lb.selectNextBackend()).toBe('app1');
    });

    it('should return null when flag is disabled', () => {
      disableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1', {
        backends: [{ id: 'app1' }],
      });

      expect(lb.selectNextBackend()).toBeNull();
    });

    it('should add latency overhead for complex algorithms', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lbSimple = new LoadBalancer('lb1', {
        algorithm: 'round_robin',
        backends: [{ id: 'app1' }],
      });

      const lbComplex = new LoadBalancer('lb2', {
        algorithm: 'least_connections',
        backends: [{ id: 'app1' }],
      });

      const simpleMetrics = lbSimple.simulate(1000);
      const complexMetrics = lbComplex.simulate(1000);

      expect(complexMetrics.latency).toBeGreaterThan(simpleMetrics.latency);
    });

    it('should reset state', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1', {
        algorithm: 'round_robin',
        backends: [{ id: 'app1' }, { id: 'app2' }],
      });

      lb.selectNextBackend(); // app1
      lb.selectNextBackend(); // app2
      lb.simulate(1000);

      lb.reset();

      // Should start from first backend again
      expect(lb.selectNextBackend()).toBe('app1');
      expect(lb.getLastDistribution().size).toBe(0);
    });

    it('should handle connection release for least_connections', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const lb = new LoadBalancer('lb1', {
        algorithm: 'least_connections',
        backends: [{ id: 'app1' }, { id: 'app2' }],
      });

      const first = lb.selectNextBackend();
      const second = lb.selectNextBackend();

      // Both should be different initially
      expect(first).not.toBe(second);

      // Release connection on first
      lb.releaseConnection(first!);

      // Next should go to first (has fewer connections now)
      const third = lb.selectNextBackend();
      expect(third).toBe(first);
    });
  });

  describe('Feature Flag Integration', () => {
    it('should fall back to legacy mode when flag is off', () => {
      disableFeature('ENABLE_LB_ALGORITHMS');

      const backends: BackendInstance[] = [
        { id: 'app1', weight: 10 },
        { id: 'app2', weight: 1 },
      ];

      const result = distributeTraffic(1000, {
        algorithm: 'weighted_round_robin',
        backends,
      });

      // Should ignore weights and distribute evenly
      const app1Rps = result.loadDistribution.get('app1') ?? 0;
      const app2Rps = result.loadDistribution.get('app2') ?? 0;

      expect(app1Rps).toBe(app2Rps);
    });

    it('should respect weights when flag is on', () => {
      enableFeature('ENABLE_LB_ALGORITHMS');

      const backends: BackendInstance[] = [
        { id: 'app1', weight: 10 },
        { id: 'app2', weight: 1 },
      ];

      const result = distributeTraffic(1000, {
        algorithm: 'weighted_round_robin',
        backends,
      });

      const app1Rps = result.loadDistribution.get('app1') ?? 0;
      const app2Rps = result.loadDistribution.get('app2') ?? 0;

      // Should respect weights
      expect(app1Rps).toBeGreaterThan(app2Rps * 5);
    });
  });
});
