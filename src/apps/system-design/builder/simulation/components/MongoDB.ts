import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { ConsistencyLevel } from '../../types/advancedConfig';

/**
 * MongoDB - Document Database
 * Interview focus: Document storage, flexible schema, horizontal scaling
 */
export class MongoDB extends Component {
  private readonly baseReadLatency = 5; // ms
  private readonly baseWriteLatency = 10; // ms
  private readonly baseCost = 150; // $/month

  constructor(
    id: string,
    config: {
      readCapacity?: number;
      writeCapacity?: number;
      consistencyLevel?: ConsistencyLevel;
      sharded?: boolean;
      numShards?: number;
      replicationFactor?: number;
      indexingEnabled?: boolean;
    } = {}
  ) {
    super(id, 'mongodb', {
      readCapacity: 1000,
      writeCapacity: 500,
      consistencyLevel: 'eventual',
      sharded: false,
      numShards: 1,
      replicationFactor: 3,
      indexingEnabled: true,
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    // Determine read/write split
    const readRps = rps * 0.7; // Assume 70/30 read/write
    const writeRps = rps * 0.3;

    return this.simulateWithReadWrite(readRps, writeRps, context);
  }

  simulateWithReadWrite(
    readRps: number,
    writeRps: number,
    context?: SimulationContext
  ): ComponentMetrics {
    const readCapacity = this.config.readCapacity || 1000;
    const writeCapacity = this.config.writeCapacity || 500;
    const sharded = this.config.sharded || false;
    const numShards = this.config.numShards || 1;
    const replicationFactor = this.config.replicationFactor || 3;
    const consistencyLevel = this.config.consistencyLevel as ConsistencyLevel || 'eventual';

    // Sharding distributes load
    const effectiveReadCapacity = sharded ? readCapacity * numShards : readCapacity;
    const effectiveWriteCapacity = sharded ? writeCapacity * numShards : writeCapacity;

    const readUtil = readRps / effectiveReadCapacity;
    const writeUtil = writeRps / effectiveWriteCapacity;
    const utilization = Math.max(readUtil, writeUtil);

    // Latency depends on consistency level
    let readLatency = this.calculateQueueLatency(this.baseReadLatency, readUtil);
    let writeLatency = this.calculateQueueLatency(this.baseWriteLatency, writeUtil);

    // Consistency level affects latency
    switch (consistencyLevel) {
      case 'strong':
        // Must wait for majority of replicas (quorum read)
        readLatency *= 1.5;
        writeLatency *= replicationFactor / 2; // Wait for majority
        break;

      case 'eventual':
        // Read from any replica, write to primary only
        readLatency *= 1.0; // Fast reads
        writeLatency *= 1.0; // Fast writes (async replication)
        break;

      case 'read_your_writes':
        // Session consistency
        readLatency *= 1.2;
        writeLatency *= 1.3;
        break;

      case 'causal':
        // Causally consistent
        readLatency *= 1.3;
        writeLatency *= 1.4;
        break;

      default:
        break;
    }

    // Indexing improves read performance but slows writes
    if (this.config.indexingEnabled) {
      readLatency *= 0.8; // 20% faster reads
      writeLatency *= 1.2; // 20% slower writes (index maintenance)
    }

    const errorRate = this.calculateErrorRate(utilization);

    // Cost calculation
    let cost = this.baseCost;
    if (sharded) {
      cost += (numShards - 1) * 100; // Each shard adds $100/month
    }
    cost += (replicationFactor - 1) * 50; // Each replica adds $50/month

    return {
      latency: (readLatency + writeLatency) / 2,
      readLatency,
      writeLatency,
      errorRate,
      utilization,
      cost,
      readUtil,
      writeUtil,
      consistencyLevel,
      sharded,
      numShards: sharded ? numShards : 1,
    };
  }
}
