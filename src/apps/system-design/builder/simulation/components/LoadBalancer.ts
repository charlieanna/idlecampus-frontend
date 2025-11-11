import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * Load Balancer Component
 * Distributes traffic across app servers
 */
export class LoadBalancer extends Component {
  private readonly capacity = 100000; // RPS (effectively unlimited for MVP)
  private readonly baseLatency = 1; // ms
  private readonly monthlyCost = 50; // dollars

  constructor(id: string, config = {}) {
    super(id, 'load_balancer', config);
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const utilization = rps / this.capacity;

    return {
      latency: this.baseLatency,
      errorRate: 0, // Never fails in MVP
      utilization,
      cost: this.monthlyCost,
    };
  }
}
