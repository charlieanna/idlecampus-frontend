import { describe, it, expect } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import {
  todoAppGoodDesign,
  todoAppMediocreDesign,
  todoAppBadDesign,
  todoAppTestCases,
} from '../examples/todoAppExample';

describe('Todo App Simulation', () => {
  const runner = new TestRunner();

  describe('Good Design (with replication)', () => {
    it('should pass normal load test', () => {
      const result = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]);

      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(200);
      expect(result.metrics.errorRate).toBeLessThan(0.01);
      expect(result.metrics.monthlyCost).toBeLessThan(800);
    });

    it('should survive database failure with high availability', () => {
      const result = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[1]);

      expect(result.passed).toBe(true);
      expect(result.metrics.availability).toBeGreaterThanOrEqual(0.95);
      // With replication, system stays up during failure
    });

    it('should handle hot user scenario', () => {
      const result = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[2]);

      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(250);
      expect(result.metrics.errorRate).toBeLessThan(0.02);
    });

    // Configuration checks removed — rely on observed traffic effects only
  });

  describe('Mediocre Design (no auto-failover)', () => {
    it('should pass normal load test', () => {
      const result = runner.runTestCase(
        todoAppMediocreDesign,
        todoAppTestCases[0]
      );

      expect(result.passed).toBe(true);
    });

    it('should FAIL database failure test due to downtime', () => {
      const result = runner.runTestCase(
        todoAppMediocreDesign,
        todoAppTestCases[1]
      );

      // Without auto-failover (simulated as no replication), system goes down
      expect(result.passed).toBe(false);
      expect(result.metrics.availability).toBeLessThan(0.95);
    });
  });

  describe('Bad Design (single DB, no replication)', () => {
    it('should barely pass normal load or fail', () => {
      const result = runner.runTestCase(todoAppBadDesign, todoAppTestCases[0]);

      // May pass but with high utilization or fail
      if (!result.passed) {
        expect(result.bottlenecks.length).toBeGreaterThan(0);
      }
    });

    it('should FAIL database failure test catastrophically', () => {
      const result = runner.runTestCase(todoAppBadDesign, todoAppTestCases[1]);

      // Complete failure - no replication means total outage
      expect(result.passed).toBe(false);
      expect(result.metrics.availability).toBeLessThan(0.6);

      // Should have downtime recorded
      const dbMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.downtime !== undefined
      );
      expect(dbMetrics).toBeDefined();
      expect(dbMetrics!.downtime).toBeGreaterThan(50); // 60s downtime expected
    });

    it('should identify database as bottleneck under load', () => {
      const result = runner.runTestCase(todoAppBadDesign, todoAppTestCases[2]);

      // Hot user pushes DB over limit
      expect(result.bottlenecks.length).toBeGreaterThan(0);

      const dbBottleneck = result.bottlenecks.find(
        (b) => b.componentType === 'postgresql'
      );
      expect(dbBottleneck).toBeDefined();
    });
  });

  describe('Availability Calculations', () => {
    it('should calculate 100% availability with no failures', () => {
      const result = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]);

      expect(result.metrics.availability).toBe(1.0);
    });

    it('should calculate ~50% availability for 60s downtime in 120s test', () => {
      const result = runner.runTestCase(todoAppBadDesign, todoAppTestCases[1]);

      // 60s downtime out of 120s = 50% availability
      expect(result.metrics.availability).toBeGreaterThanOrEqual(0.4);
      expect(result.metrics.availability).toBeLessThanOrEqual(0.6);
    });

    it('should show replication maintains high availability during failure', () => {
      const goodResult = runner.runTestCase(
        todoAppGoodDesign,
        todoAppTestCases[1]
      );
      const badResult = runner.runTestCase(todoAppBadDesign, todoAppTestCases[1]);

      // Good design (with replication) should have much higher availability
      expect(goodResult.metrics.availability).toBeGreaterThan(
        badResult.metrics.availability + 0.3
      );
    });
  });

  describe('Mixed Read/Write Workload', () => {
    it('should handle 60/40 read/write split', () => {
      const result = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]);

      // Test case has 500 RPS with 60% reads (300) and 40% writes (200)
      const dbMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.readUtil !== undefined && m.writeUtil !== undefined
      );

      expect(dbMetrics).toBeDefined();
      // Both read and write utilization should be present
      expect(dbMetrics!.readUtil).toBeGreaterThan(0);
      expect(dbMetrics!.writeUtil).toBeGreaterThan(0);
    });

    it('should show writes are more expensive than reads', () => {
      const result = runner.runTestCase(todoAppGoodDesign, todoAppTestCases[0]);

      const dbMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.readLatency !== undefined && m.writeLatency !== undefined
      );

      expect(dbMetrics).toBeDefined();
      // Write latency (50ms) should be ~10x read latency (5ms)
      expect(dbMetrics!.writeLatency).toBeGreaterThan(dbMetrics!.readLatency * 5);
    });
  });

  describe('Replication Benefit', () => {
    it('should show replication prevents complete outage', () => {
      const withReplication = runner.runTestCase(
        todoAppGoodDesign,
        todoAppTestCases[1]
      );
      const withoutReplication = runner.runTestCase(
        todoAppBadDesign,
        todoAppTestCases[1]
      );

      // With replication: passes
      expect(withReplication.passed).toBe(true);

      // Without replication: fails
      expect(withoutReplication.passed).toBe(false);

      // Availability difference should be dramatic
      expect(withReplication.metrics.availability).toBeGreaterThan(0.9);
      expect(withoutReplication.metrics.availability).toBeLessThan(0.6);
    });
  });
});
