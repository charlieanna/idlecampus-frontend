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
  private hasLoggedCapacity = false; // Track if we've logged initial capacity calculation

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
    // Debug: log incoming config for active-active multi-region challenges
    if (config.replicationMode === 'multi-leader' || (config.replication && typeof config.replication === 'object' && config.replication.enabled)) {
      console.log(`[PostgreSQL] Constructor received config for ${id}:`, {
        replicationMode: config.replicationMode,
        replication: config.replication,
        sharding: config.sharding,
        hasExplicitCapacity: config.readCapacity !== undefined || config.writeCapacity !== undefined,
      });
    }
    
    // Merge nested objects correctly (replication and sharding)
    const mergedReplication = config.replication !== undefined 
      ? config.replication 
      : false;
    const mergedSharding = config.sharding !== undefined
      ? config.sharding
      : { enabled: false, shards: 1, shardKey: '' };
    
    super(id, 'postgresql', {
      replicationMode: 'single-leader',
      engine: 'postgresql',
      isolationLevel: 'read-committed',
      storageType: 'gp3',
      storageSizeGB: 100,
      ...config,
      replication: mergedReplication,
      sharding: mergedSharding,
      instanceType: 'commodity-db',
    });
    
    // Debug: log final config after merge for active-active multi-region
    if ((this.config as any).replicationMode === 'multi-leader') {
      console.log(`[PostgreSQL] Constructor final config for ${id}:`, {
        replicationMode: (this.config as any).replicationMode,
        replication: (this.config as any).replication,
        sharding: (this.config as any).sharding,
        hasExplicitCapacity: (this.config as any).readCapacity !== undefined || (this.config as any).writeCapacity !== undefined,
      });
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

    // Calculate utilization (used for logging and latency calculation)
    const readUtil = readRps / readCapacity;
    const writeUtil = writeRps / writeCapacity;
    const utilization = Math.max(readUtil, writeUtil);
    
    // Calculate actual error rate that will be returned
    const actualErrorRate = this.calculateErrorRate(utilization);
    
    // Always log capacity details for debugging (reduced to once per instance for low utilization)
    // But always log when utilization is high (>90%) or when there are errors
    const shouldLogDetailed = !this.hasLoggedCapacity || utilization > 0.9 || readUtil > 0.9 || writeUtil > 0.9 || actualErrorRate > 0;
    
    if (shouldLogDetailed) {
      // Use console.table for better visibility of the key metrics
      const logData = {
        'Replication Mode': replicationModeConfig,
        'Replicas': replicas,
        'Shards': shardingConfig.shards,
        'Read Capacity': readCapacity.toFixed(0) + ' RPS',
        'Write Capacity': writeCapacity.toFixed(0) + ' RPS',
        'Read RPS': readRps.toFixed(1) + ' RPS',
        'Write RPS': writeRps.toFixed(1) + ' RPS',
        'Read Util': (readUtil * 100).toFixed(1) + '%',
        'Write Util': (writeUtil * 100).toFixed(1) + '%',
        'Max Util': (utilization * 100).toFixed(1) + '%',
        'Error Rate': (actualErrorRate * 100).toFixed(1) + '%',
        'Headroom': utilization > 1.0 
          ? `⚠️ OVERLOADED by ${((utilization - 1.0) * 100).toFixed(1)}%`
          : `${((1.0 - utilization) * 100).toFixed(1)}% available`,
      };
      
      const logPrefix = utilization > 1.0 
        ? '❌ OVERLOADED' 
        : utilization > 0.9 || actualErrorRate > 0
          ? '⚠️ HIGH UTILIZATION'
          : '📊 Capacity calculation';
      
      console.log(`[PostgreSQL] ${logPrefix} (${this.id}):`);
      console.table(logData);
      
      // Also log a simple one-line summary for easier debugging
      if (actualErrorRate > 0 || utilization > 1.0) {
        console.log(
          `[PostgreSQL] ❌ ERROR: ${this.id} is ${utilization > 1.0 ? 'OVERLOADED' : 'at high utilization'}. ` +
          `Read: ${readRps.toFixed(0)}/${readCapacity.toFixed(0)} RPS (${(readUtil * 100).toFixed(1)}%), ` +
          `Write: ${writeRps.toFixed(0)}/${writeCapacity.toFixed(0)} RPS (${(writeUtil * 100).toFixed(1)}%), ` +
          `Error Rate: ${(actualErrorRate * 100).toFixed(1)}%`
        );
      }
      
      // Only mark as logged if utilization is low (to avoid spam)
      // But always show logs when utilization is high or there are errors
      if (utilization <= 0.9 && actualErrorRate === 0) {
        this.hasLoggedCapacity = true;
      }
    }

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
