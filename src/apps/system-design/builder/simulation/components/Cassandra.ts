import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';

/**
 * Cassandra - Wide-Column Store (AP system in CAP)
 * Interview focus: Tunable consistency, quorum reads/writes, eventual consistency
 *
 * Key Concepts:
 * - R = Read quorum (how many replicas must respond for read)
 * - W = Write quorum (how many replicas must acknowledge write)
 * - N = Replication factor (total number of replicas)
 *
 * Consistency Rules:
 * - R + W > N = Strong consistency
 * - R + W <= N = Eventual consistency
 *
 * Common Configurations:
 * - ONE (R=1, W=1): Fastest, least consistent
 * - QUORUM (R=N/2+1, W=N/2+1): Balanced
 * - ALL (R=N, W=N): Slowest, most consistent
 */
export class Cassandra extends Component {
  private readonly baseReadLatency = 3; // ms (faster than traditional RDBMS)
  private readonly baseWriteLatency = 5; // ms (optimized for writes)
  private readonly baseCost = 200; // $/month

  constructor(
    id: string,
    config: {
      readCapacity?: number;
      writeCapacity?: number;
      replicationFactor?: number; // N
      readQuorum?: number; // R
      writeQuorum?: number; // W
      numNodes?: number;
      compactionEnabled?: boolean;
      bloomFilterEnabled?: boolean;
    } = {}
  ) {
    super(id, 'cassandra', {
      readCapacity: 5000, // Cassandra is write-optimized, good read perf too
      writeCapacity: 10000, // Excellent write performance
      replicationFactor: 3, // N = 3 (standard)
      readQuorum: 2, // R = QUORUM (N/2 + 1)
      writeQuorum: 2, // W = QUORUM (N/2 + 1)
      numNodes: 3,
      compactionEnabled: true,
      bloomFilterEnabled: true,
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const readRps = rps * 0.5; // Assume 50/50 read/write
    const writeRps = rps * 0.5;
    return this.simulateWithReadWrite(readRps, writeRps, context);
  }

  simulateWithReadWrite(
    readRps: number,
    writeRps: number,
    context?: SimulationContext
  ): ComponentMetrics {
    const readCapacity = this.config.readCapacity || 5000;
    const writeCapacity = this.config.writeCapacity || 10000;
    const numNodes = this.config.numNodes || 3;
    const replicationFactor = this.config.replicationFactor || 3; // N
    const readQuorum = this.config.readQuorum || 2; // R
    const writeQuorum = this.config.writeQuorum || 2; // W

    // Distribute load across nodes
    const effectiveReadCapacity = (readCapacity * numNodes) / replicationFactor;
    const effectiveWriteCapacity = (writeCapacity * numNodes) / replicationFactor;

    const readUtil = readRps / effectiveReadCapacity;
    const writeUtil = writeRps / effectiveWriteCapacity;
    const utilization = Math.max(readUtil, writeUtil);

    // Base latency with queueing
    let readLatency = this.calculateQueueLatency(this.baseReadLatency, readUtil);
    let writeLatency = this.calculateQueueLatency(this.baseWriteLatency, writeUtil);

    // Quorum affects latency
    // Higher quorum = more nodes must respond = higher latency
    const readQuorumFactor = readQuorum / replicationFactor;
    const writeQuorumFactor = writeQuorum / replicationFactor;

    readLatency *= (1 + readQuorumFactor * 0.5);
    writeLatency *= (1 + writeQuorumFactor * 0.3); // Writes are async after quorum

    // Bloom filter speeds up reads (reduces disk lookups)
    if (this.config.bloomFilterEnabled) {
      readLatency *= 0.9; // 10% faster reads
    }

    // Compaction affects write performance
    if (this.config.compactionEnabled) {
      writeLatency *= 1.05; // Slight overhead during compaction
    }

    // Determine consistency level
    const isStronglyConsistent = readQuorum + writeQuorum > replicationFactor;
    const consistencyLevel = isStronglyConsistent ? 'strong' : 'eventual';

    // Calculate availability
    // Cassandra can handle (N - quorum) node failures
    const maxFailures = replicationFactor - Math.max(readQuorum, writeQuorum);
    const availability = 1 - Math.pow(0.01, maxFailures); // Assume 1% node failure rate

    const errorRate = this.calculateErrorRate(utilization);

    // Cost: more nodes = more cost
    const cost = this.baseCost + (numNodes - 1) * 150;

    return {
      latency: (readLatency + writeLatency) / 2,
      readLatency,
      writeLatency,
      errorRate,
      utilization,
      cost,
      readUtil,
      writeUtil,
      availability,
      consistencyLevel,
      replicationFactor,
      readQuorum,
      writeQuorum,
      isStronglyConsistent,
      maxNodeFailures: maxFailures,
    };
  }

  /**
   * Helper: Explain consistency configuration
   */
  getConsistencyExplanation(): string {
    const N = this.config.replicationFactor || 3;
    const R = this.config.readQuorum || 2;
    const W = this.config.writeQuorum || 2;

    const isStrong = R + W > N;

    return `
Configuration: R=${R}, W=${W}, N=${N}
${isStrong ? '✅ Strong Consistency' : '⚠️ Eventual Consistency'} (R + W ${isStrong ? '>' : '<='} N)

- Read Quorum (R=${R}): Must read from ${R} out of ${N} replicas
- Write Quorum (W=${W}): Must write to ${W} out of ${N} replicas
- Can tolerate ${N - Math.max(R, W)} node failures

${isStrong
  ? 'Strong consistency: All reads see latest write (slower but consistent)'
  : 'Eventual consistency: Reads may be stale (faster but may show old data)'}
    `.trim();
  }
}
