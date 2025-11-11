import {
  ComponentMetrics,
  ComponentConfig,
  ComponentType,
  SimulationContext,
} from '../../types/component';

/**
 * Base class for all system components
 */
export abstract class Component {
  id: string;
  type: ComponentType;
  config: ComponentConfig;

  constructor(id: string, type: ComponentType, config: ComponentConfig = {}) {
    this.id = id;
    this.type = type;
    this.config = config;
  }

  /**
   * Simulate the component under given traffic
   * @param rps - Requests per second
   * @param context - Optional simulation context (for failure injection, etc.)
   * @param extraParams - Optional additional parameters (component-specific)
   * @returns Component metrics
   */
  abstract simulate(
    rps: number,
    context?: SimulationContext,
    ...extraParams: any[]
  ): ComponentMetrics;

  /**
   * Helper: Calculate latency using M/M/1 queueing model
   * @param baseLatency - Base latency at 0% utilization
   * @param utilization - Current utilization (0-1)
   * @returns Calculated latency
   */
  protected calculateQueueLatency(
    baseLatency: number,
    utilization: number
  ): number {
    if (utilization < 0.7) {
      return baseLatency;
    } else if (utilization < 0.9) {
      // M/M/1 queue: latency = base / (1 - utilization)
      return baseLatency / (1 - utilization);
    } else if (utilization < 0.95) {
      return baseLatency * 10; // Severe degradation
    } else {
      return baseLatency * 20; // Near collapse
    }
  }

  /**
   * Helper: Calculate error rate based on utilization
   * @param utilization - Current utilization (0-1)
   * @returns Error rate (0-1)
   */
  protected calculateErrorRate(utilization: number): number {
    if (utilization < 0.95) {
      return 0;
    } else {
      // Linear increase from 0 to 1 as utilization goes from 0.95 to 1.0
      return Math.min(1, (utilization - 0.95) / 0.05);
    }
  }
}
