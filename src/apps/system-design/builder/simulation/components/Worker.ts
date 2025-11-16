import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { ComponentBehaviorConfig, WorkerBehavior } from '../../types/challengeTiers';
import {
  WORKER_BEHAVIORS,
  calculateValidationLatency,
  calculateTransformationLatency,
  calculateCPUCostFactor,
  getExternalAPILatency,
} from '../../behaviors/componentBehaviors';

/**
 * Worker Component
 *
 * Processes messages from queue asynchronously
 * Supports both simulator-managed and custom Python logic
 *
 * Key features:
 * - Configurable throughput (messages/sec)
 * - Multiple behavior types (simple_write, validate_and_write, etc.)
 * - Custom Python logic support for Tier 1 problems
 * - Realistic performance modeling based on workload
 */
export class Worker extends Component {
  private readonly baseLatency = 20; // ms (base processing time)
  private readonly costPerInstance = 30; // $/month per worker instance

  constructor(
    id: string,
    config: {
      instances?: number;
      throughput?: number; // messages/sec per instance
      behavior?: WorkerBehavior;
      hasCustomLogic?: boolean;
      pythonFile?: string;
      validations?: string[];
      transformations?: string[];
      externalApis?: string[];
    } = {}
  ) {
    super(id, 'worker', {
      instances: 1,
      throughput: 100, // Default: 100 messages/sec per instance
      behavior: 'simple_write',
      hasCustomLogic: false,
      validations: [],
      transformations: [],
      externalApis: [],
      ...config,
    });
  }

  /**
   * Simulate worker processing with given traffic
   */
  simulate(
    rps: number, // Messages per second to process
    context?: SimulationContext,
    problemConfig?: ComponentBehaviorConfig // Problem-specific configuration
  ): ComponentMetrics {
    const instances = this.config.instances || 1;
    const throughputPerInstance = this.config.throughput || 100;
    const behavior = this.config.behavior as WorkerBehavior || 'simple_write';
    const hasCustomLogic = this.config.hasCustomLogic || false;

    // Calculate effective throughput
    let effectiveThroughput = throughputPerInstance * instances;

    // Calculate latency based on behavior and configuration
    let latency = this.calculateLatency(behavior, problemConfig);

    // Adjust throughput based on complexity
    const complexityFactor = this.calculateComplexityFactor(behavior, problemConfig);
    effectiveThroughput = effectiveThroughput / complexityFactor;

    // Calculate utilization
    const utilization = rps / effectiveThroughput;

    // Calculate error rate
    let errorRate = 0;
    if (utilization > 1.2) {
      // Overloaded - high error rate
      errorRate = Math.min(1, (utilization - 1.2) * 0.5);
    } else if (utilization > 0.95) {
      // Near capacity - some errors
      errorRate = (utilization - 0.95) * 2;
    }

    // Add error rate from external APIs or validations
    if (problemConfig?.worker) {
      const { validations = [], externalApis = [] } = problemConfig.worker;

      // External APIs have higher failure rates
      if (externalApis.length > 0) {
        errorRate = Math.max(errorRate, 0.02 * externalApis.length);
      }

      // Validations can reject messages
      if (validations.length > 0) {
        const validationFailureRate = 0.01 * validations.length;
        errorRate = 1 - (1 - errorRate) * (1 - validationFailureRate);
      }
    }

    // Calculate cost
    const cost = instances * this.costPerInstance;

    // Queue depth (messages waiting to be processed)
    let queueDepth = 0;
    if (utilization > 1) {
      // Queue is building up
      queueDepth = (rps - effectiveThroughput) * (context?.currentTime || 60);
    }

    // Processing lag (how far behind the worker is)
    const processingLag = queueDepth / Math.max(1, effectiveThroughput);

    return {
      latency,
      errorRate,
      utilization,
      cost,
      instances,
      throughput: effectiveThroughput,
      behavior,
      hasCustomLogic,
      queueDepth,
      processingLag,
      messagesProcessed: Math.min(rps, effectiveThroughput) * (1 - errorRate),
    };
  }

  /**
   * Calculate processing latency based on behavior and configuration
   */
  private calculateLatency(
    behavior: WorkerBehavior,
    problemConfig?: ComponentBehaviorConfig
  ): number {
    // Start with base latency for the behavior
    const behaviorImpl = WORKER_BEHAVIORS[behavior];
    let latency = behaviorImpl?.baseLatency || this.baseLatency;

    // If custom logic, use benchmarked latency if available
    if (behavior === 'custom' && this.config.benchmarkedLatency) {
      latency = this.config.benchmarkedLatency;
    }

    // Add latency from problem-specific configuration
    if (problemConfig?.worker) {
      const { validations = [], transformations = [], externalApis = [] } = problemConfig.worker;

      // Add validation latency
      if (validations.length > 0) {
        latency += calculateValidationLatency(validations);
      }

      // Add transformation latency
      if (transformations.length > 0) {
        latency += calculateTransformationLatency(transformations);
      }

      // Add external API latency
      if (externalApis.length > 0) {
        const apiLatency = externalApis.reduce((total, api) => {
          return total + getExternalAPILatency(api, 'p50');
        }, 0);
        latency += apiLatency;
      }
    }

    return latency;
  }

  /**
   * Calculate complexity factor that affects throughput
   */
  private calculateComplexityFactor(
    behavior: WorkerBehavior,
    problemConfig?: ComponentBehaviorConfig
  ): number {
    // Start with behavior's base complexity
    const behaviorImpl = WORKER_BEHAVIORS[behavior];
    let complexity = 1 / (behaviorImpl?.throughputMultiplier || 1);

    // Add complexity from problem configuration
    if (problemConfig?.worker) {
      const { validations = [], transformations = [] } = problemConfig.worker;

      // Validations add overhead
      if (validations.length > 0) {
        complexity *= 1 + (0.2 * validations.length);
      }

      // Transformations add significant overhead
      if (transformations.length > 0) {
        const cpuFactor = calculateCPUCostFactor(transformations);
        complexity *= cpuFactor;
      }
    }

    return complexity;
  }

  /**
   * Process a single message (for simulation)
   * This would execute Python code in Tier 1 problems
   */
  async processMessage(
    message: any,
    executePython?: (file: string, func: string, args: any) => Promise<any>
  ): Promise<boolean> {
    if (this.config.hasCustomLogic && this.config.pythonFile && executePython) {
      // Execute custom Python logic
      try {
        const result = await executePython(
          this.config.pythonFile,
          'process_message',
          message
        );
        return result === true;
      } catch (error) {
        console.error('Worker Python execution failed:', error);
        return false;
      }
    }

    // Default behavior: simulate processing
    const behavior = this.config.behavior as WorkerBehavior;
    const behaviorImpl = WORKER_BEHAVIORS[behavior];

    // Simulate success/failure based on behavior
    const successRate = 1 / behaviorImpl.errorRateMultiplier;
    return Math.random() < successRate;
  }

  /**
   * Get worker configuration description for UI
   */
  getConfigDescription(): string {
    const instances = this.config.instances || 1;
    const throughput = this.config.throughput || 100;
    const behavior = this.config.behavior || 'simple_write';

    return `${instances} instance${instances > 1 ? 's' : ''}, ${throughput} msg/sec each, ${behavior} behavior`;
  }

  /**
   * Validate worker configuration
   */
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const instances = this.config.instances || 1;
    const throughput = this.config.throughput || 100;

    if (instances < 1 || instances > 100) {
      errors.push('Worker instances must be between 1 and 100');
    }

    if (throughput < 1 || throughput > 10000) {
      errors.push('Worker throughput must be between 1 and 10000 messages/sec');
    }

    if (this.config.hasCustomLogic && !this.config.pythonFile) {
      errors.push('Worker has custom logic enabled but no Python file specified');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}