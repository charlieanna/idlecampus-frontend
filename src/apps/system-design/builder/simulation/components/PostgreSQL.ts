import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * PostgreSQL Database Component
 * Persistent relational storage
 */
export class PostgreSQL extends Component {
  private readonly readBaseLatency = 5; // ms
  private readonly writeBaseLatency = 50; // ms (10x slower due to disk + WAL)
  private readonly readCostPerOp = 0.0001; // $/operation
  private readonly writeCostPerOp = 0.001; // $/operation (10x more expensive)

  constructor(
    id: string,
    config: {
      readCapacity?: number;
      writeCapacity?: number;
      replication?: boolean;
    } = {}
  ) {
    super(id, 'postgresql', {
      readCapacity: 1000,
      writeCapacity: 1000,
      replication: false,
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
    // Check for failure injection
    if (
      context?.testCase?.failureInjection?.type === 'db_crash' &&
      !this.config.replication
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
          cost: this.calculateCost(readRps, writeRps),
        };
      }
    }

    // Normal operation
    const readCapacity = this.config.readCapacity || 1000;
    const writeCapacity = this.config.writeCapacity || 1000;

    const readUtil = readRps / readCapacity;
    const writeUtil = writeRps / writeCapacity;
    const utilization = Math.max(readUtil, writeUtil);

    // Calculate latency for reads and writes separately
    const readLatency = this.calculateQueueLatency(
      this.readBaseLatency,
      readUtil
    );
    const writeLatency = this.calculateQueueLatency(
      this.writeBaseLatency,
      writeUtil
    );

    // Weighted average based on read/write mix
    const totalOps = readRps + writeRps;
    const avgLatency =
      totalOps > 0
        ? (readLatency * readRps + writeLatency * writeRps) / totalOps
        : 0;

    const errorRate = this.calculateErrorRate(utilization);

    return {
      latency: avgLatency,
      errorRate,
      utilization,
      cost: this.calculateCost(readRps, writeRps),
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

  private calculateCost(readRps: number, writeRps: number): number {
    const secondsPerMonth = 2.6e6;
    const readCost = readRps * this.readCostPerOp * secondsPerMonth;
    const writeCost = writeRps * this.writeCostPerOp * secondsPerMonth;
    return readCost + writeCost;
  }
}
