/**
 * Graph Cycle Detection Tests
 *
 * Comprehensive tests for:
 * 1. Cycle detection algorithms
 * 2. Controlled cycle traversal
 * 3. Feature flag integration
 * 4. Circuit breaker pattern support
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  detectCycles,
  validateGraphCycles,
  CycleAwareTraversalContext,
  findAllPaths,
  classifyGraph,
  getSuggestedMaxHops,
  DEFAULT_CYCLE_CONFIG,
} from '../simulation/cycleDetection';
import { Connection } from '../types/graph';
import {
  resetFlags,
  enableFeature,
  disableFeature,
} from '../simulation/featureFlags';

describe('Cycle Detection', () => {
  beforeEach(() => {
    resetFlags();
  });

  afterEach(() => {
    resetFlags();
  });

  describe('detectCycles', () => {
    it('should detect no cycles in a simple DAG', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);
      adjacency.set('C', []);

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(false);
      expect(result.cycles).toHaveLength(0);
      expect(result.maxCycleLength).toBe(0);
    });

    it('should detect a simple cycle', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);
      adjacency.set('C', [{ to: 'A', type: 'read_write' }]); // Cycle back to A

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(true);
      expect(result.cycles.length).toBeGreaterThan(0);
      // The cycle should contain A, B, C, A
      const cycle = result.cycles[0];
      expect(cycle.length).toBe(4);
      expect(cycle[0]).toBe(cycle[cycle.length - 1]); // Starts and ends with same node
    });

    it('should detect self-loops', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [
        { to: 'B', type: 'read_write' },
        { to: 'A', type: 'read_write' }, // Self-loop
      ]);
      adjacency.set('B', []);

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(true);
      expect(result.warnings.some((w) => w.includes('Self-loop'))).toBe(true);
    });

    it('should detect multiple cycles', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      // Create two independent cycles
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'A', type: 'read_write' }]); // Cycle 1: A -> B -> A
      adjacency.set('C', [{ to: 'D', type: 'read_write' }]);
      adjacency.set('D', [{ to: 'C', type: 'read_write' }]); // Cycle 2: C -> D -> C

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(true);
      expect(result.cycles.length).toBeGreaterThanOrEqual(2);
    });

    it('should generate warnings when cycles flag is disabled', () => {
      disableFeature('ENABLE_GRAPH_CYCLES');

      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'A', type: 'read_write' }]);

      const result = detectCycles(adjacency);

      expect(result.warnings.some((w) => w.includes('ENABLE_GRAPH_CYCLES'))).toBe(true);
    });

    it('should not warn when cycles flag is enabled', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'A', type: 'read_write' }]);

      const result = detectCycles(adjacency);

      expect(result.warnings.every((w) => !w.includes('ENABLE_GRAPH_CYCLES'))).toBe(true);
    });

    it('should handle complex nested cycles', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      // A -> B -> C -> D -> B (cycle) and D -> E -> A (another cycle)
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);
      adjacency.set('C', [{ to: 'D', type: 'read_write' }]);
      adjacency.set('D', [
        { to: 'B', type: 'read_write' },
        { to: 'E', type: 'read_write' },
      ]);
      adjacency.set('E', [{ to: 'A', type: 'read_write' }]);

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(true);
      expect(result.cycles.length).toBeGreaterThan(0);
    });
  });

  describe('validateGraphCycles', () => {
    it('should validate DAG as valid', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('client', [{ to: 'lb', type: 'read_write' }]);
      adjacency.set('lb', [{ to: 'app', type: 'read_write' }]);
      adjacency.set('app', [{ to: 'db', type: 'read_write' }]);
      adjacency.set('db', []);

      const result = validateGraphCycles(adjacency);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject cycles when flag is disabled', () => {
      disableFeature('ENABLE_GRAPH_CYCLES');

      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'A', type: 'read_write' }]);

      const result = validateGraphCycles(adjacency);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Cycle:'))).toBe(true);
    });

    it('should reject excessively long cycles', () => {
      // Create a cycle longer than maxHops
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      const nodeCount = DEFAULT_CYCLE_CONFIG.maxHops + 5;

      for (let i = 0; i < nodeCount; i++) {
        const next = (i + 1) % nodeCount;
        adjacency.set(`node${i}`, [{ to: `node${next}`, type: 'read_write' }]);
      }

      const result = validateGraphCycles(adjacency);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('exceeds maximum'))).toBe(true);
    });
  });

  describe('CycleAwareTraversalContext', () => {
    it('should prevent infinite loops when cycles disabled', () => {
      disableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext();

      expect(ctx.canVisit('A')).toBe(true);
      ctx.visit('A');

      expect(ctx.canVisit('A')).toBe(false); // Can't revisit
    });

    it('should allow controlled cycles when enabled', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext({ maxCycleDepth: 2 });

      // First visit
      expect(ctx.canVisit('A')).toBe(true);
      ctx.visit('A');

      // Second visit allowed (circuit breaker pattern)
      expect(ctx.canVisit('A')).toBe(true);
      ctx.visit('A');

      // Third visit blocked (exceeded maxCycleDepth)
      expect(ctx.canVisit('A')).toBe(false);
    });

    it('should respect max hop count', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext({ maxHops: 3 });

      ctx.visit('A');
      ctx.visit('B');
      ctx.visit('C');

      // 3 hops reached, can't visit more
      expect(ctx.canVisit('D')).toBe(false);
    });

    it('should track path correctly', () => {
      const ctx = new CycleAwareTraversalContext();

      ctx.visit('A');
      ctx.visit('B');
      ctx.visit('C');

      expect(ctx.getPath()).toEqual(['A', 'B', 'C']);
      expect(ctx.getHopCount()).toBe(3);
    });

    it('should support backtracking', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext();

      ctx.visit('A');
      ctx.visit('B');
      ctx.unvisit('B');

      expect(ctx.getPath()).toEqual(['A']);
      expect(ctx.getHopCount()).toBe(1);
      expect(ctx.hasVisited('B')).toBe(false);
    });

    it('should report cycle detection', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext({ maxCycleDepth: 3 });

      ctx.visit('A');
      expect(ctx.isInCycle('A')).toBe(false);

      ctx.visit('A');
      expect(ctx.isInCycle('A')).toBe(true);
    });

    it('should provide useful statistics', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext({ maxCycleDepth: 3 });

      ctx.visit('A');
      ctx.visit('B');
      ctx.visit('A'); // Revisit A

      const stats = ctx.getStats();
      expect(stats.totalHops).toBe(3);
      expect(stats.uniqueNodes).toBe(2);
      expect(stats.maxVisitsPerNode).toBe(2);
    });

    it('should reset properly', () => {
      const ctx = new CycleAwareTraversalContext();

      ctx.visit('A');
      ctx.visit('B');
      ctx.reset();

      expect(ctx.getPath()).toEqual([]);
      expect(ctx.getHopCount()).toBe(0);
      expect(ctx.canVisit('A')).toBe(true);
    });
  });

  describe('findAllPaths', () => {
    it('should find single path in DAG', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);
      adjacency.set('C', []);

      const paths = findAllPaths(adjacency, 'A', 'C');

      expect(paths).toHaveLength(1);
      expect(paths[0]).toEqual(['A', 'B', 'C']);
    });

    it('should find multiple paths', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [
        { to: 'B', type: 'read_write' },
        { to: 'C', type: 'read_write' },
      ]);
      adjacency.set('B', [{ to: 'D', type: 'read_write' }]);
      adjacency.set('C', [{ to: 'D', type: 'read_write' }]);
      adjacency.set('D', []);

      const paths = findAllPaths(adjacency, 'A', 'D');

      expect(paths).toHaveLength(2);
      expect(paths).toContainEqual(['A', 'B', 'D']);
      expect(paths).toContainEqual(['A', 'C', 'D']);
    });

    it('should respect cycle limits', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [
        { to: 'C', type: 'read_write' },
        { to: 'A', type: 'read_write' },
      ]); // Can cycle back

      const paths = findAllPaths(adjacency, 'A', 'C', { maxCycleDepth: 1 });

      // Should find direct path, not through cycle
      expect(paths.length).toBeGreaterThan(0);
      const shortestPath = paths.reduce((a, b) => (a.length < b.length ? a : b));
      expect(shortestPath).toEqual(['A', 'B', 'C']);
    });

    it('should return empty array when no path exists', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('C', [{ to: 'D', type: 'read_write' }]);

      const paths = findAllPaths(adjacency, 'A', 'D');

      expect(paths).toHaveLength(0);
    });
  });

  describe('classifyGraph', () => {
    it('should classify DAG correctly', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);

      const classification = classifyGraph(adjacency);

      expect(classification).toBe('dag');
    });

    it('should classify simple cycle correctly', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'A', type: 'read_write' }]); // Simple 2-node cycle

      const classification = classifyGraph(adjacency);

      expect(classification).toBe('simple_cycle');
    });

    it('should classify complex cycles correctly', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      // Create a cycle with more than 3 nodes
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);
      adjacency.set('C', [{ to: 'D', type: 'read_write' }]);
      adjacency.set('D', [{ to: 'E', type: 'read_write' }]);
      adjacency.set('E', [{ to: 'A', type: 'read_write' }]); // 5-node cycle

      const classification = classifyGraph(adjacency);

      expect(classification).toBe('complex_cycles');
    });
  });

  describe('getSuggestedMaxHops', () => {
    it('should suggest node count for DAG', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'C', type: 'read_write' }]);
      adjacency.set('C', []);

      const suggested = getSuggestedMaxHops(adjacency);

      expect(suggested).toBeLessThanOrEqual(20);
      expect(suggested).toBe(3); // 3 nodes in graph
    });

    it('should suggest more hops for graphs with cycles', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', [{ to: 'A', type: 'read_write' }]);

      const suggested = getSuggestedMaxHops(adjacency);

      // Should allow 2x nodes for circuit breaker patterns
      expect(suggested).toBeGreaterThanOrEqual(2 * 2);
    });

    it('should cap at DEFAULT_CYCLE_CONFIG.maxHops', () => {
      // Create large graph
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      for (let i = 0; i < 100; i++) {
        adjacency.set(`node${i}`, [
          { to: `node${(i + 1) % 100}`, type: 'read_write' },
        ]);
      }

      const suggested = getSuggestedMaxHops(adjacency);

      expect(suggested).toBeLessThanOrEqual(DEFAULT_CYCLE_CONFIG.maxHops);
    });
  });

  describe('Feature Flag Integration', () => {
    it('should block all revisits when ENABLE_GRAPH_CYCLES is off', () => {
      disableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext();

      ctx.visit('A');
      expect(ctx.canVisit('A')).toBe(false);
      expect(ctx.canVisit('B')).toBe(true);
    });

    it('should allow controlled revisits when ENABLE_GRAPH_CYCLES is on', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      const ctx = new CycleAwareTraversalContext({ maxCycleDepth: 2 });

      ctx.visit('A');
      expect(ctx.canVisit('A')).toBe(true);
    });

    it('should support circuit breaker pattern (retry through same nodes)', () => {
      enableFeature('ENABLE_GRAPH_CYCLES');

      // Simulate: Client -> LB -> App -> DB (fail) -> App (retry) -> Cache -> success
      const ctx = new CycleAwareTraversalContext({ maxCycleDepth: 2, maxHops: 10 });

      ctx.visit('client');
      ctx.visit('lb');
      ctx.visit('app');
      ctx.visit('db'); // DB fails

      // Circuit breaker sends back to app
      ctx.visit('app'); // Second visit allowed
      ctx.visit('cache'); // Try cache instead

      expect(ctx.getHopCount()).toBe(6);
      expect(ctx.isInCycle('app')).toBe(true);
      expect(ctx.canVisit('app')).toBe(false); // Can't visit third time
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty graph', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(false);
      expect(result.cycles).toHaveLength(0);
    });

    it('should handle single node', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', []);

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(false);
    });

    it('should handle disconnected components', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [{ to: 'B', type: 'read_write' }]);
      adjacency.set('B', []);
      adjacency.set('C', [{ to: 'D', type: 'read_write' }]);
      adjacency.set('D', [{ to: 'C', type: 'read_write' }]); // Cycle in second component

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(true);
    });

    it('should handle nodes with multiple outgoing edges', () => {
      const adjacency = new Map<string, { to: string; type: Connection['type'] }[]>();
      adjacency.set('A', [
        { to: 'B', type: 'read' },
        { to: 'C', type: 'write' },
        { to: 'D', type: 'read_write' },
      ]);
      adjacency.set('B', []);
      adjacency.set('C', []);
      adjacency.set('D', [{ to: 'A', type: 'read_write' }]); // Cycle through D

      const result = detectCycles(adjacency);

      expect(result.hasCycles).toBe(true);
      expect(result.cycles.length).toBeGreaterThan(0);
    });
  });
});
