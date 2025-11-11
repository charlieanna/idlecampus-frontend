import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * S3 (Object Storage) Component
 * Stores and serves large files (images, videos, documents)
 */
export class S3 extends Component {
  private readonly baseLatency = 100; // ms (higher than DB due to object retrieval)
  private readonly storageCostPerGB = 0.023; // $/GB/month
  private readonly requestCostPer1000 = 0.004; // $ per 1000 GET requests
  private readonly transferCostPerGB = 0.09; // $/GB (out to internet)

  constructor(
    id: string,
    config: {
      storageSizeGB?: number;
    } = {}
  ) {
    super(id, 's3', {
      storageSizeGB: 100,
      ...config,
    });
  }

  simulate(
    rps: number,
    context?: SimulationContext,
    avgObjectSizeMB: number = 2
  ): ComponentMetrics {
    const secondsPerMonth = 2.6e6;
    const requestsPerMonth = rps * secondsPerMonth;

    // Cost breakdown
    const storageSizeGB = this.config.storageSizeGB || 100;
    const storageCost = storageSizeGB * this.storageCostPerGB;
    const requestCost = (requestsPerMonth / 1000) * this.requestCostPer1000;
    const gbTransferred = (requestsPerMonth * avgObjectSizeMB) / 1024;
    const transferCost = gbTransferred * this.transferCostPerGB;

    const totalCost = storageCost + requestCost + transferCost;

    return {
      latency: this.baseLatency,
      errorRate: 0, // Never fails in MVP
      utilization: 0.01, // Effectively unlimited
      cost: totalCost,
      storageCost,
      requestCost,
      transferCost,
      gbTransferred,
    };
  }
}
