/**
 * Multi-Database/Sharding Support Tests
 *
 * Tests for distributing traffic across multiple database instances.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import {
  resetFlags,
  enableFeature,
  disableFeature,
} from '../simulation/featureFlags';
import {
  distributeTrafficAcrossShards,
  aggregateShardMetrics,
  findAllDatabaseNodes,
  getDefaultShardingConfig,
  validateShardingConfig,
} from '../simulation/sharding';
import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';

describe('Multi-Database Support', () => {
  beforeEach(() => {
    resetFlags();
  });

  afterEach(() => {
    resetFlags();
  });

  describe('distributeTrafficAcrossShards', () => {
    it('should distribute uniformly by default', () => {
      enableFeature('ENABLE_MULTI_DB');

      const shardIds = ['db1', 'db2', 'db3', 'db4'];
      const config = getDefaultShardingConfig(4);
      const distribution = distributeTrafficAcrossShards(
        shardIds,
        1000,
        100,
        config
      );

      expect(distribution.length).toBe(4);

      // Each shard should get 25% of traffic
      for (const dist of distribution) {
        expect(dist.readRps).toBeCloseTo(250, 1);
        expect(dist.writeRps).toBeCloseTo(25, 1);
        expect(dist.trafficPercentage).toBeCloseTo(0.25, 5);
      }
    });

    it('should return single shard when flag disabled', () => {
      disableFeature('ENABLE_MULTI_DB');

      const shardIds = ['db1', 'db2', 'db3'];
      const distribution = distributeTrafficAcrossShards(
        shardIds,
        1000,
        100,
        { strategy: 'hash', numShards: 3, keyDistribution: 'uniform' }
      );

      // Should only use first shard
      expect(distribution.length).toBe(1);
      expect(distribution[0].shardId).toBe('db1');
      expect(distribution[0].readRps).toBe(1000);
      expect(distribution[0].writeRps).toBe(100);
    });

    it('should handle Zipf distribution', () => {
      enableFeature('ENABLE_MULTI_DB');

      const shardIds = ['db1', 'db2', 'db3', 'db4'];
      const distribution = distributeTrafficAcrossShards(shardIds, 1000, 100, {
        strategy: 'hash',
        numShards: 4,
        keyDistribution: 'zipf',
      });

      // Zipf: first shard should get most traffic
      expect(distribution[0].trafficPercentage).toBeGreaterThan(
        distribution[1].trafficPercentage
      );
      expect(distribution[1].trafficPercentage).toBeGreaterThan(
        distribution[2].trafficPercentage
      );
      expect(distribution[2].trafficPercentage).toBeGreaterThan(
        distribution[3].trafficPercentage
      );

      // Total should sum to 100%
      const totalPercentage = distribution.reduce(
        (sum, d) => sum + d.trafficPercentage,
        0
      );
      expect(totalPercentage).toBeCloseTo(1, 5);
    });

    it('should handle hotspot distribution', () => {
      enableFeature('ENABLE_MULTI_DB');

      const shardIds = ['db1', 'db2', 'db3'];
      const distribution = distributeTrafficAcrossShards(shardIds, 1000, 100, {
        strategy: 'hash',
        numShards: 3,
        keyDistribution: 'hotspot',
        hotspotPercentage: 0.9,
      });

      // First shard should get 90% of traffic
      expect(distribution[0].trafficPercentage).toBeCloseTo(0.9, 5);
      expect(distribution[0].readRps).toBeCloseTo(900, 1);
      expect(distribution[0].writeRps).toBeCloseTo(90, 1);

      // Others split remaining 10%
      expect(distribution[1].trafficPercentage).toBeCloseTo(0.05, 5);
      expect(distribution[2].trafficPercentage).toBeCloseTo(0.05, 5);
    });

    it('should handle empty shard list', () => {
      const distribution = distributeTrafficAcrossShards([], 1000, 100);
      expect(distribution).toEqual([]);
    });

    it('should handle single shard', () => {
      enableFeature('ENABLE_MULTI_DB');

      const distribution = distributeTrafficAcrossShards(['db1'], 1000, 100);
      expect(distribution.length).toBe(1);
      expect(distribution[0].readRps).toBe(1000);
      expect(distribution[0].writeRps).toBe(100);
    });
  });

  describe('aggregateShardMetrics', () => {
    it('should aggregate metrics correctly', () => {
      const shardMetrics = new Map([
        [
          'db1',
          {
            latency: 10,
            readLatency: 10,
            writeLatency: 15,
            errorRate: 0.01,
            utilization: 0.5,
            cost: 100,
          },
        ],
        [
          'db2',
          {
            latency: 12,
            readLatency: 12,
            writeLatency: 18,
            errorRate: 0.02,
            utilization: 0.7,
            cost: 120,
          },
        ],
        [
          'db3',
          {
            latency: 8,
            readLatency: 8,
            writeLatency: 12,
            errorRate: 0.015,
            utilization: 0.85,
            cost: 90,
          },
        ],
      ]);

      const distribution = [
        { shardId: 'db1', readRps: 333, writeRps: 33, trafficPercentage: 0.33 },
        { shardId: 'db2', readRps: 333, writeRps: 33, trafficPercentage: 0.33 },
        { shardId: 'db3', readRps: 334, writeRps: 34, trafficPercentage: 0.34 },
      ];

      const aggregated = aggregateShardMetrics(shardMetrics, distribution);

      // Max latency (worst shard)
      expect(aggregated.maxReadLatency).toBe(12);
      expect(aggregated.maxWriteLatency).toBe(18);

      // Max utilization (hottest shard)
      expect(aggregated.maxUtilization).toBe(0.85);

      // Total cost (sum)
      expect(aggregated.totalCost).toBe(310);

      // Hot shards (>80% utilization)
      expect(aggregated.hotShards).toEqual(['db3']);

      // Combined error rate should be higher than individual rates
      expect(aggregated.combinedErrorRate).toBeGreaterThan(0.01);
    });

    it('should handle empty metrics', () => {
      const aggregated = aggregateShardMetrics(new Map(), []);

      expect(aggregated.maxReadLatency).toBe(0);
      expect(aggregated.totalCost).toBe(0);
      expect(aggregated.hotShards).toEqual([]);
    });

    it('should detect multiple hot shards', () => {
      const shardMetrics = new Map([
        ['db1', { latency: 10, errorRate: 0.01, utilization: 0.95, cost: 100 }],
        ['db2', { latency: 10, errorRate: 0.01, utilization: 0.85, cost: 100 }],
        ['db3', { latency: 10, errorRate: 0.01, utilization: 0.6, cost: 100 }],
      ]);

      const distribution = [
        { shardId: 'db1', readRps: 500, writeRps: 50, trafficPercentage: 0.5 },
        { shardId: 'db2', readRps: 300, writeRps: 30, trafficPercentage: 0.3 },
        { shardId: 'db3', readRps: 200, writeRps: 20, trafficPercentage: 0.2 },
      ];

      const aggregated = aggregateShardMetrics(shardMetrics, distribution);

      expect(aggregated.hotShards).toContain('db1');
      expect(aggregated.hotShards).toContain('db2');
      expect(aggregated.hotShards).not.toContain('db3');
    });
  });

  describe('findAllDatabaseNodes', () => {
    it('should find all database types', () => {
      const components = new Map([
        ['lb', { type: 'load_balancer' }],
        ['app', { type: 'app_server' }],
        ['db1', { type: 'postgresql' }],
        ['db2', { type: 'mongodb' }],
        ['db3', { type: 'cassandra' }],
        ['cache', { type: 'redis' }],
      ]);

      const dbNodes = findAllDatabaseNodes(components);

      expect(dbNodes).toContain('db1');
      expect(dbNodes).toContain('db2');
      expect(dbNodes).toContain('db3');
      expect(dbNodes).not.toContain('lb');
      expect(dbNodes).not.toContain('cache');
    });

    it('should find multiple instances of same type', () => {
      const components = new Map([
        ['pg1', { type: 'postgresql' }],
        ['pg2', { type: 'postgresql' }],
        ['pg3', { type: 'postgresql' }],
      ]);

      const dbNodes = findAllDatabaseNodes(components);

      expect(dbNodes.length).toBe(3);
      expect(dbNodes).toContain('pg1');
      expect(dbNodes).toContain('pg2');
      expect(dbNodes).toContain('pg3');
    });

    it('should return empty array when no databases', () => {
      const components = new Map([
        ['lb', { type: 'load_balancer' }],
        ['app', { type: 'app_server' }],
      ]);

      const dbNodes = findAllDatabaseNodes(components);
      expect(dbNodes).toEqual([]);
    });
  });

  describe('validateShardingConfig', () => {
    it('should accept valid config', () => {
      const result = validateShardingConfig({
        strategy: 'hash',
        numShards: 4,
        keyDistribution: 'uniform',
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject zero shards', () => {
      const result = validateShardingConfig({
        strategy: 'hash',
        numShards: 0,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Number of shards must be at least 1');
    });

    it('should reject excessive shards', () => {
      const result = validateShardingConfig({
        strategy: 'hash',
        numShards: 200,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Number of shards should not exceed 100 for simulation'
      );
    });

    it('should reject invalid hotspot percentage', () => {
      const result = validateShardingConfig({
        strategy: 'hash',
        numShards: 4,
        hotspotPercentage: 1.5,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Hotspot percentage must be between 0 and 1'
      );
    });
  });

  describe('Integration with SimulationEngine', () => {
    const runner = new TestRunner();

    const shardedDesign: SystemGraph = {
      components: [
        { id: 'lb', type: 'load_balancer', config: {} },
        { id: 'app', type: 'app_server', config: { instances: 2 } },
        {
          id: 'pg1',
          type: 'postgresql',
          config: { readCapacity: 500, writeCapacity: 100 },
        },
        {
          id: 'pg2',
          type: 'postgresql',
          config: { readCapacity: 500, writeCapacity: 100 },
        },
        {
          id: 'pg3',
          type: 'postgresql',
          config: { readCapacity: 500, writeCapacity: 100 },
        },
      ],
      connections: [
        { from: 'lb', to: 'app', type: 'read_write' },
        { from: 'app', to: 'pg1', type: 'read_write' },
        { from: 'app', to: 'pg2', type: 'read_write' },
        { from: 'app', to: 'pg3', type: 'read_write' },
      ],
    };

    const testCase: TestCase = {
      name: 'Sharded DB Test',
      traffic: { type: 'mixed', rps: 1500, readRatio: 0.9 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    };

    it('should use single DB when flag disabled', () => {
      disableFeature('ENABLE_MULTI_DB');

      const result = runner.runTestCase(shardedDesign, testCase);

      // Only first DB should have metrics
      expect(result.componentMetrics.has('pg1')).toBe(true);
      expect(result.componentMetrics.has('pg2')).toBe(false);
      expect(result.componentMetrics.has('pg3')).toBe(false);
    });

    it('should distribute across all DBs when flag enabled', () => {
      enableFeature('ENABLE_MULTI_DB');

      const result = runner.runTestCase(shardedDesign, testCase);

      // All DBs should have metrics
      expect(result.componentMetrics.has('pg1')).toBe(true);
      expect(result.componentMetrics.has('pg2')).toBe(true);
      expect(result.componentMetrics.has('pg3')).toBe(true);

      // Each DB should have roughly 1/3 of the load
      const pg1Util =
        result.componentMetrics.get('pg1')?.utilization ?? 0;
      const pg2Util =
        result.componentMetrics.get('pg2')?.utilization ?? 0;
      const pg3Util =
        result.componentMetrics.get('pg3')?.utilization ?? 0;

      // Utilizations should be similar (uniform distribution)
      expect(Math.abs(pg1Util - pg2Util)).toBeLessThan(0.1);
      expect(Math.abs(pg2Util - pg3Util)).toBeLessThan(0.1);
    });

    it('should have lower per-shard utilization with sharding', () => {
      const singleDbResult = (() => {
        disableFeature('ENABLE_MULTI_DB');
        return runner.runTestCase(shardedDesign, testCase);
      })();

      const shardedResult = (() => {
        enableFeature('ENABLE_MULTI_DB');
        return runner.runTestCase(shardedDesign, testCase);
      })();

      const singleDbUtil =
        singleDbResult.componentMetrics.get('pg1')?.utilization ?? 0;
      const shardedDb1Util =
        shardedResult.componentMetrics.get('pg1')?.utilization ?? 0;

      // With traffic split across 3 DBs, each should have lower utilization
      expect(shardedDb1Util).toBeLessThan(singleDbUtil);
    });

    it('should sum costs across all shards', () => {
      enableFeature('ENABLE_MULTI_DB');

      const result = runner.runTestCase(shardedDesign, testCase);

      const pg1Cost = result.componentMetrics.get('pg1')?.cost ?? 0;
      const pg2Cost = result.componentMetrics.get('pg2')?.cost ?? 0;
      const pg3Cost = result.componentMetrics.get('pg3')?.cost ?? 0;

      // Total DB cost should be sum of individual shard costs
      const totalDbCost = pg1Cost + pg2Cost + pg3Cost;
      expect(totalDbCost).toBeGreaterThan(0);

      // Monthly cost should include all shards
      expect(result.metrics.monthlyCost).toBeGreaterThan(pg1Cost);
    });
  });
});
