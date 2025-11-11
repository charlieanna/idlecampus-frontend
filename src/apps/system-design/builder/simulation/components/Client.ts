import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * Client component - represents users/API clients generating traffic
 * This is a pass-through component that doesn't add latency or cost
 */
export class Client extends Component {
  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    // Clients don't add latency, cost, or have utilization
    // They just represent the traffic source
    return {
      latency: 0,
      errorRate: 0,
      utilization: 0,
      cost: 0,
    };
  }
}
