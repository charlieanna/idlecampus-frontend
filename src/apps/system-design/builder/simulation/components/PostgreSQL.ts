import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { RDS_INSTANCES } from '../../types/instanceTypes';

/**
 * PostgreSQL Database Component
 * Persistent relational storage with real RDS instance types
 */
export class PostgreSQL extends Component {
  private readonly readBaseLatency = 5; // ms
  private readonly writeBaseLatency = 50; // ms (10x slower due to disk + WAL)

  constructor(
    id: string,
    config: {
      instanceType?: string;
      readCapacity?: number; // Legacy, for backward compatibility
      writeCapacity?: number; // Legacy
      replication?: boolean | { enabled: boolean; replicas: number; mode: 'sync' | 'async' };
      engine?: string;
      isolationLevel?: string;
      storageType?: string;
      storageSizeGB?: number;
    } = {}
  ) {
    super(id, 'postgresql', {
      instanceType: 'db.t3.medium', // Default instance type
      replication: false,
      engine: 'postgresql',
      isolationLevel: 'read-committed',
      storageType: 'gp3',
      storageSizeGB: 100,
      ...config,
    });
  }

  /**
   * Simulate database with separate read and write traffic
   */
  simulateWithReadWrite(
    readRps: number,
    writeRps: number,
    context?: SimulationContext
  ): ComponentMetrics {
    // Get instance specs
    const instanceType = this.config.instanceType || 'db.t3.medium';
    const instanceSpec = RDS_INSTANCES[instanceType];

    // Fallback to legacy config or defaults if instance type not found
    let baseCapacity: number;
    let monthlyCost: number;
    if (instanceSpec) {
      baseCapacity = instanceSpec.requestsPerSecond;
      monthlyCost = instanceSpec.costPerHour * 730;
    } else {
      console.warn(`Unknown RDS instance type: ${instanceType}, using legacy config`);
      baseCapacity = this.config.readCapacity || 200;
      monthlyCost = 50; // Default cost
    }

    // Calculate replication cost multiplier
    const replicationConfig = this.config.replication;
    let replicationMultiplier = 1;
    let replicationMode: 'sync' | 'async' = 'async';

    if (typeof replicationConfig === 'boolean' && replicationConfig) {
      // Legacy boolean replication
      replicationMultiplier = 2; // 1 primary + 1 replica
    } else if (typeof replicationConfig === 'object' && replicationConfig.enabled) {
      replicationMultiplier = 1 + (replicationConfig.replicas || 1);
      replicationMode = replicationConfig.mode || 'async';
    }

    // Adjust latency based on replication mode
    let writeLatencyMultiplier = 1;
    if (typeof replicationConfig === 'object' && replicationConfig.enabled && replicationMode === 'sync') {
      // Synchronous replication is 10x slower for writes
      writeLatencyMultiplier = 10;
    }

    // Check for failure injection
    const isReplicationEnabled =
      (typeof replicationConfig === 'boolean' && replicationConfig) ||
      (typeof replicationConfig === 'object' && replicationConfig.enabled);

    if (
      context?.testCase?.failureInjection?.type === 'db_crash' &&
      !isReplicationEnabled
    ) {
      const currentTime = context.currentTime || 0;
      const failureStart = context.testCase.failureInjection.atSecond;
      const failureEnd =
        context.testCase.failureInjection.recoverySecond || failureStart + 60;

      if (currentTime >= failureStart && currentTime < failureEnd) {
        // Database is down
        return {
          latency: Infinity,
          errorRate: 1.0,
          utilization: 0,
          downtime: failureEnd - failureStart,
          cost: monthlyCost * replicationMultiplier,
        };
      }
    }

    // Normal operation
    // Read capacity = base capacity
    // Write capacity = base capacity / 10 (writes are slower)
    const readCapacity = baseCapacity;
    const writeCapacity = baseCapacity / 10;

    const readUtil = readRps / readCapacity;
    const writeUtil = writeRps / writeCapacity;
    const utilization = Math.max(readUtil, writeUtil);

    // Calculate latency for reads and writes separately
    const readLatency = this.calculateQueueLatency(
      this.readBaseLatency,
      readUtil
    );
    const writeLatency = this.calculateQueueLatency(
      this.writeBaseLatency * writeLatencyMultiplier,
      writeUtil
    );

    // Weighted average based on read/write mix
    const totalOps = readRps + writeRps;
    const avgLatency =
      totalOps > 0
        ? (readLatency * readRps + writeLatency * writeRps) / totalOps
        : 0;

    const errorRate = this.calculateErrorRate(utilization);

    // Calculate final cost (instance + storage)
    const storageCost = ((this.config.storageSizeGB || 100) * 0.115); // gp3 pricing: $0.115/GB-month
    const totalCost = monthlyCost * replicationMultiplier + storageCost;

    return {
      latency: avgLatency,
      errorRate,
      utilization,
      cost: totalCost,
      readUtil,
      writeUtil,
      readLatency,
      writeLatency,
    };
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    // Default to all reads if not specified
    return this.simulateWithReadWrite(rps, 0, context);
  }
}
