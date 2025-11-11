import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * Application Server Component
 * Runs application logic (compute)
 */
export class AppServer extends Component {
  private readonly capacityPerInstance = 1000; // RPS
  private readonly baseLatency = 10; // ms
  private readonly costPerInstance = 100; // $/month

  constructor(id: string, config: { instances?: number } = {}) {
    super(id, 'app_server', {
      instances: 1,
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const instances = this.config.instances || 1;
    const rpsPerInstance = rps / instances;
    const utilization = rpsPerInstance / this.capacityPerInstance;

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
      cost: instances * this.costPerInstance,
      instances,
      rpsPerInstance,
    };
  }
}
