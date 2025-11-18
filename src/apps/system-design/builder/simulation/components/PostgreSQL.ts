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
      replicationMode?: 'single-leader' | 'multi-leader' | 'leaderless';
      sharding?: { enabled: boolean; shards: number; shardKey: string };
      engine?: string;
      isolationLevel?: string;
      storageType?: string;
      storageSizeGB?: number;
    } = {}
  ) {
    // Debug: log incoming config for sharding
    if (config.sharding) {
      console.log(`[PostgreSQL] Constructor received sharding config:`, config.sharding);
    }
    
    super(id, 'postgresql', {
      instanceType: 'commodity-db', // Always use commodity spec
      replication: false,
      replicationMode: 'single-leader',
      sharding: { enabled: false, shards: 1, shardKey: '' },
      engine: 'postgresql',
      isolationLevel: 'read-committed',
      storageType: 'gp3',
      storageSizeGB: 100,
      ...config,
      // Override instanceType to always be commodity-db
      instanceType: 'commodity-db',
    });
    
    // Debug: log final config after merge
    if ((this.config as any).sharding) {
      console.log(`[PostgreSQL] Constructor final sharding config:`, (this.config as any).sharding);
    }
  }

  /**
   * Simulate database with separate read and write traffic
   */
  simulateWithReadWrite(
    readRps: number,
    writeRps: number,
    context?: SimulationContext
  ): ComponentMetrics {
    // Always use commodity-db spec
    const instanceType = 'commodity-db';
    const instanceSpec = RDS_INSTANCES[instanceType];

    // Base commodity spec: 1000 read RPS, 100 write RPS
    let baseReadCapacity = 1000;
    let baseWriteCapacity = 100;
    let monthlyCost = 146; // Commodity database base cost

    if (instanceSpec) {
      baseReadCapacity = instanceSpec.requestsPerSecond;
      baseWriteCapacity = instanceSpec.requestsPerSecond / 10; // Writes are 10x slower
      monthlyCost = instanceSpec.costPerHour * 730;
    }

    // Check for legacy explicit capacity (backward compatibility)
    const hasExplicitCapacity = this.config.readCapacity !== undefined || this.config.writeCapacity !== undefined;
    
    // Debug: log full config to see what's being passed
    if (hasExplicitCapacity) {
      console.log(`[PostgreSQL] ⚠️ HAS EXPLICIT CAPACITY! Config:`, {
        readCapacity: this.config.readCapacity,
        writeCapacity: this.config.writeCapacity,
        replicationMode: this.config.replicationMode,
        replication: this.config.replication,
        fullConfig: this.config,
      });
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

    // Calculate capacity based on replication mode and sharding
    const replicationModeConfig = this.config.replicationMode || 'single-leader';
    const shardingConfig = this.config.sharding || { enabled: false, shards: 1, shardKey: '' };
    
    // Get number of replicas
    let replicas = 0;
    if (typeof replicationConfig === 'boolean' && replicationConfig) {
      replicas = 1; // Legacy: boolean true means 1 replica
    } else if (typeof replicationConfig === 'object' && replicationConfig.enabled) {
      replicas = replicationConfig.replicas || 1;
    }
    
    // Calculate capacity based on replication mode
    let readCapacity = baseReadCapacity;
    let writeCapacity = baseWriteCapacity;
    let latencyMultiplier = 1;
    
    if (hasExplicitCapacity) {
      // Legacy: use explicit capacity if provided
      readCapacity = this.config.readCapacity || baseReadCapacity;
      writeCapacity = this.config.writeCapacity || baseWriteCapacity;
    } else {
      // New: derive capacity from replication mode
      if (replicationModeConfig === 'single-leader') {
        // Read replicas scale read capacity
        readCapacity = baseReadCapacity * (1 + replicas);
        writeCapacity = baseWriteCapacity; // Writes only to leader
        latencyMultiplier = 1;
      } else if (replicationModeConfig === 'multi-leader') {
        // Multiple leaders scale both reads and writes
        readCapacity = baseReadCapacity * (1 + replicas);
        writeCapacity = baseWriteCapacity * (1 + replicas);
        // Multi-leader adds latency for conflict resolution
        latencyMultiplier = 1.5; // +50% latency (20-50ms added)
      } else if (replicationModeConfig === 'leaderless') {
        // Quorum-based: capacity scales but with overhead
        readCapacity = baseReadCapacity * (1 + replicas) * 0.7; // 30% overhead for quorum
        writeCapacity = baseWriteCapacity * (1 + replicas) * 0.7;
        latencyMultiplier = 1.3; // +30% latency for quorum coordination
      }
      
      // Sharding scales capacity linearly
      if (shardingConfig.enabled && shardingConfig.shards > 1) {
        readCapacity *= shardingConfig.shards;
        writeCapacity *= shardingConfig.shards;
        // Sharding adds small overhead for routing
        latencyMultiplier *= 1.1;
      }
    }

    // Debug logging for capacity calculation
    console.log(`[PostgreSQL] Capacity calculation:`, {
      baseRead: baseReadCapacity,
      baseWrite: baseWriteCapacity,
      replicationMode: replicationModeConfig,
      replicas,
      shards: shardingConfig.shards,
      hasExplicitCapacity,
      finalReadCapacity: readCapacity,
      finalWriteCapacity: writeCapacity,
      readRps,
      writeRps,
      calculation: hasExplicitCapacity 
        ? 'USING EXPLICIT CAPACITY (LEGACY)' 
        : `CALCULATED: ${replicationModeConfig} mode with ${replicas} replicas = ${readCapacity} read, ${writeCapacity} write`,
    });

    const readUtil = readRps / readCapacity;
    const writeUtil = writeRps / writeCapacity;
    const utilization = Math.max(readUtil, writeUtil);

    // Calculate latency for reads and writes separately
    // Apply replication mode latency multiplier
    const readLatency = this.calculateQueueLatency(
      this.readBaseLatency * latencyMultiplier,
      readUtil
    );
    const writeLatency = this.calculateQueueLatency(
      this.writeBaseLatency * writeLatencyMultiplier * latencyMultiplier,
      writeUtil
    );

    // Weighted average based on read/write mix
    const totalOps = readRps + writeRps;
    const avgLatency =
      totalOps > 0
        ? (readLatency * readRps + writeLatency * writeRps) / totalOps
        : 0;

    const errorRate = this.calculateErrorRate(utilization);

    // Calculate final cost (instance + storage + sharding)
    const storageCost = ((this.config.storageSizeGB || 100) * 0.115); // gp3 pricing: $0.115/GB-month
    const shards = shardingConfig.enabled ? shardingConfig.shards : 1;
    const totalCost = monthlyCost * replicationMultiplier * shards + storageCost;

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
