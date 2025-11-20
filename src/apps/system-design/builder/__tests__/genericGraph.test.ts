import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SimulationEngine } from '../simulation/engine';
import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import { resetFlags } from '../simulation/featureFlags';

describe('Generic Graph Support', () => {
  let engine: SimulationEngine;

  // Microservices topology: Client -> LB -> Service A -> Service B -> DB
  const createMicroservicesGraph = (): SystemGraph => ({
    components: [
      { id: 'client1', type: 'client', config: {} },
      { id: 'lb1', type: 'load_balancer', config: {} },
      { id: 'serviceA', type: 'app_server', config: { instances: 2 } }, // Acts as Service A
      { id: 'serviceB', type: 'app_server', config: { instances: 2 } }, // Acts as Service B
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
      { id: 'c2', from: 'lb1', to: 'serviceA', type: 'read_write' },
      { id: 'c3', from: 'serviceA', to: 'serviceB', type: 'read_write' }, // The "unsupported" link
      { id: 'c4', from: 'serviceB', to: 'db1', type: 'read_write' },
    ],
  });

  const createTestCase = (rps: number = 100): TestCase => ({
    id: 'test_microservices',
    name: 'Microservices Load Test',
    description: 'Test with chained services',
    traffic: {
      rps,
      readRatio: 1.0, // All reads to keep it simple
    },
    duration: 60,
    targets: {
      maxP99Latency: 1000,
    },
  });

  beforeEach(() => {
    engine = new SimulationEngine();
    resetFlags();
  });

  it('should calculate metrics for ALL services in the chain', () => {
    const graph = createMicroservicesGraph();
    const testCase = createTestCase(100);

    const result = engine.simulateTraffic(graph, testCase);

    // Check if Service A is simulated
    const serviceAMetrics = result.componentMetrics.get('serviceA');
    expect(serviceAMetrics).toBeDefined();

    // Check if Service B is simulated (Expect this to fail currently or be incorrect)
    const serviceBMetrics = result.componentMetrics.get('serviceB');
    // The current engine might simply ignore Service B if it's not the "primary" app server
    // or if the path finding logic skips it.

    // Log what we found for debugging
    console.log('Service A Metrics:', serviceAMetrics);
    console.log('Service B Metrics:', serviceBMetrics);

    expect(serviceBMetrics).toBeDefined();
    if (serviceBMetrics) {
        expect(serviceBMetrics.utilization).toBeGreaterThan(0);
    }
  });
});
