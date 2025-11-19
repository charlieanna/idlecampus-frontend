import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { EC2_INSTANCES } from '../../types/instanceTypes';

/**
 * Application Server Component
 * Runs application logic (compute)
 */
export class AppServer extends Component {
  private readonly baseLatency = 10; // ms

  constructor(id: string, config: { instances?: number; instanceType?: string } = {}) {
    super(id, 'app_server', {
      instances: 1,
      ...config,
      // Override instanceType to always be commodity-app
      instanceType: 'commodity-app',
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const instances = this.config.instances || 1;
    // Always use commodity-app spec (1000 RPS, 64GB RAM, 2TB disk)
    const instanceType = 'commodity-app';

    // Get capacity and cost from commodity spec
    const instanceSpec = EC2_INSTANCES[instanceType];
    if (!instanceSpec) {
      console.error('Commodity app server spec not found! This should never happen.');
      // Fallback
      const capacityPerInstance = 1000;
      const costPerInstance = 110;
      const rpsPerInstance = rps / instances;
      const utilization = rpsPerInstance / capacityPerInstance;

      return {
        latency: this.baseLatency,
        errorRate: 0,
        utilization,
        cost: instances * costPerInstance,
        instances,
        rpsPerInstance,
      };
    }

    const capacityPerInstance = instanceSpec.requestsPerSecond; // Fixed at 1000 RPS
    const costPerInstance = instanceSpec.costPerHour * 730; // Monthly cost (~$110/mo)
    const rpsPerInstance = rps / instances;
    const utilization = rpsPerInstance / capacityPerInstance;

    let latency: number;
    let errorRate: number;

    if (utilization < 0.7) {
      latency = this.baseLatency;
      errorRate = 0;
    } else if (utilization < 0.9) {
      // M/M/1 queueing approximation
      latency = this.calculateQueueLatency(this.baseLatency, utilization);
      errorRate = 0;
    } else if (utilization < 0.95) {
      latency = 100; // Severely degraded
      errorRate = 0;
    } else {
      latency = 100;
      errorRate = this.calculateErrorRate(utilization);
    }

    return {
      latency,
      errorRate,
      utilization,
      cost: instances * costPerInstance,
      instances,
      rpsPerInstance,
    };
  }
}
