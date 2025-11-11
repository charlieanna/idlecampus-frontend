import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * CDN (Content Delivery Network) Component
 * Caches and serves static content from edge locations
 */
export class CDN extends Component {
  private readonly hitRatio = 0.95; // Fixed for MVP
  private readonly edgeLatency = 5; // ms (cache hit)
  private readonly originLatency = 50; // ms (cache miss, fetch from origin)
  private readonly costPerGB = 0.01; // dollars

  constructor(
    id: string,
    config: {
      enabled?: boolean;
    } = {}
  ) {
    super(id, 'cdn', {
      enabled: true,
      ...config,
    });
  }

  simulate(
    rps: number,
    context?: SimulationContext,
    avgResponseSizeMB: number = 2
  ): ComponentMetrics {
    if (!this.config.enabled) {
      // CDN disabled - all requests hit origin
      return {
        latency: this.originLatency,
        errorRate: 0,
        utilization: 0,
        cost: 0,
      };
    }

    // Calculate weighted average latency
    const avgLatency =
      this.hitRatio * this.edgeLatency +
      (1 - this.hitRatio) * this.originLatency;

    // Calculate cost based on data transfer
    const secondsPerMonth = 2.6e6;
    const requestsPerMonth = rps * secondsPerMonth;
    const gbTransferred = (requestsPerMonth * avgResponseSizeMB) / 1024;
    const cost = gbTransferred * this.costPerGB;

    return {
      latency: avgLatency,
      errorRate: 0,
      utilization: 0.01, // Effectively unlimited
      cost,
      hitRatio: this.hitRatio,
      gbTransferred,
    };
  }
}
