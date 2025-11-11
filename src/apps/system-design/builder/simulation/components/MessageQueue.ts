import { Component } from './Component';
import { ComponentMetrics, SimulationContext } from '../../types/component';
import { QueueSemantics } from '../../types/advancedConfig';

/**
 * Message Queue (Kafka/RabbitMQ)
 * Interview focus: Async processing, decoupling, message ordering, delivery guarantees
 *
 * Delivery Semantics:
 * - At-most-once: Fire and forget (may lose messages, fast)
 * - At-least-once: Retry until ack (may duplicate, default)
 * - Exactly-once: Idempotent delivery (no duplicates, slow)
 */
export class MessageQueue extends Component {
  private readonly baseLatency = 5; // ms (async, so perceived as faster)
  private readonly throughputPerPartition = 10000; // messages/sec
  private readonly costPerBroker = 100; // $/month

  constructor(
    id: string,
    config: {
      numBrokers?: number;
      numPartitions?: number;
      replicationFactor?: number;
      retentionHours?: number;
      semantics?: QueueSemantics;
      orderingGuarantee?: 'global' | 'partition' | 'none';
      consumerGroups?: number;
      batchingEnabled?: boolean;
      compressionEnabled?: boolean;
    } = {}
  ) {
    super(id, 'message_queue', {
      numBrokers: 3,
      numPartitions: 10,
      replicationFactor: 3,
      retentionHours: 24,
      semantics: 'at_least_once',
      orderingGuarantee: 'partition',
      consumerGroups: 1,
      batchingEnabled: true,
      compressionEnabled: true,
      ...config,
    });
  }

  simulate(rps: number, context?: SimulationContext): ComponentMetrics {
    const numBrokers = this.config.numBrokers || 3;
    const numPartitions = this.config.numPartitions || 10;
    const replicationFactor = this.config.replicationFactor || 3;
    const semantics = this.config.semantics as QueueSemantics || 'at_least_once';
    const orderingGuarantee = this.config.orderingGuarantee || 'partition';

    // Total throughput
    const totalCapacity = this.throughputPerPartition * numPartitions;
    const utilization = rps / totalCapacity;

    // Latency calculation
    let latency = this.calculateQueueLatency(this.baseLatency, utilization);

    // Delivery semantics affect latency
    switch (semantics) {
      case 'at_most_once':
        latency *= 0.8; // Fastest (no acks)
        break;
      case 'at_least_once':
        latency *= 1.0; // Standard (ack from leader)
        break;
      case 'exactly_once':
        latency *= 1.5; // Slowest (ack from all replicas + dedup)
        break;
    }

    // Ordering guarantee affects performance
    if (orderingGuarantee === 'global') {
      latency *= 2.0; // Very slow (single partition)
      utilization *= numPartitions; // Bottleneck on single partition
    }

    // Batching improves throughput
    if (this.config.batchingEnabled) {
      latency *= 1.2; // Slightly higher latency due to batching
      utilization *= 0.7; // Better throughput
    }

    // Compression reduces network load
    if (this.config.compressionEnabled) {
      latency *= 1.1; // CPU overhead
      utilization *= 0.8; // Less network bandwidth
    }

    const errorRate = this.calculateErrorRate(utilization);

    // Cost calculation
    const storageCost = (this.config.retentionHours || 24) * 0.1; // Storage cost
    const cost = numBrokers * this.costPerBroker + storageCost;

    // Calculate message loss/duplication rate based on semantics
    let messageLossRate = 0;
    let messageDuplicationRate = 0;

    switch (semantics) {
      case 'at_most_once':
        messageLossRate = errorRate; // May lose messages on failure
        break;
      case 'at_least_once':
        messageDuplicationRate = errorRate * 0.1; // May duplicate on retry
        break;
      case 'exactly_once':
        // No loss or duplication
        break;
    }

    return {
      latency,
      errorRate,
      utilization,
      cost,
      throughput: totalCapacity,
      numPartitions,
      semantics,
      orderingGuarantee,
      messageLossRate,
      messageDuplicationRate,
      replicationFactor,
    };
  }
}
