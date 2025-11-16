import { describe, it, expect } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { CacheStrategy } from '../types/advancedConfig';

/**
 * Comprehensive Caching Strategy Tests
 * Tests all 5 caching strategies with different consistency requirements
 */

describe('Caching Strategy Tests', () => {
  const runner = new TestRunner();

  // Helper to create a TinyURL design with specific cache strategy
  function createDesignWithCacheStrategy(strategy: CacheStrategy): SystemGraph {
    return {
      components: [
        {
          id: 'lb',
          type: 'load_balancer',
          config: {},
        },
        {
          id: 'app',
          type: 'app_server',
          config: {
            instances: 2,
          },
        },
        {
          id: 'cache',
          type: 'redis',
          config: {
            memorySizeGB: 4,
            ttl: 3600,
            hitRatio: 0.9,
            strategy, // The cache strategy to test
          },
        },
        {
          id: 'db',
          type: 'postgresql',
          config: {
            readCapacity: 1000,
            writeCapacity: 150,
            replication: true,
          },
        },
      ],
      connections: [
        { from: 'lb', to: 'app', type: 'read_write' },
        { from: 'app', to: 'cache', type: 'read' },
        { from: 'cache', to: 'db', type: 'read' },
        { from: 'app', to: 'db', type: 'write' },
      ],
    };
  }

  const readHeavyTestCase: TestCase = {
    name: 'Read-Heavy Workload',
    traffic: {
      type: 'mixed',
      rps: 1100,
      readRatio: 0.91, // 1000 reads, 100 writes
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 100,
      maxErrorRate: 0.01,
      maxMonthlyCost: 500,
    },
  };

  const writeHeavyTestCase: TestCase = {
    name: 'Write-Heavy Workload',
    traffic: {
      type: 'mixed',
      rps: 1100,
      readRatio: 0.27, // 300 reads, 800 writes
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 150,
      maxErrorRate: 0.01,
      maxMonthlyCost: 500,
    },
  };

  const cacheFailureTestCase: TestCase = {
    name: 'Cache Failure Scenario',
    traffic: {
      type: 'mixed',
      rps: 1100,
      readRatio: 0.91,
    },
    duration: 60,
    failureInjection: {
      type: 'cache_flush',
      atSecond: 20,
    },
    passCriteria: {
      maxP99Latency: 200,
      maxErrorRate: 0.05,
      maxDataLoss: 0, // No data loss allowed
    },
  };

  describe('Cache-Aside Strategy', () => {
    const design = createDesignWithCacheStrategy('cache_aside');

    it('should work well for read-heavy workloads', () => {
      const result = runner.runTestCase(design, readHeavyTestCase);

      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(50); // Fast reads from cache

      // Check cache effectiveness
      const cacheMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.cacheHits !== undefined
      );
      expect(cacheMetrics).toBeDefined();
      expect(cacheMetrics!.effectiveHitRatio).toBeGreaterThan(0.85);
    });

    it('should handle cache invalidation on writes', () => {
      const result = runner.runTestCase(design, writeHeavyTestCase);

      // Cache-aside requires app to manage invalidation
      expect(result.passed).toBe(true);
      expect(result.metrics.p99Latency).toBeLessThan(100);
    });

    it('should not lose data on cache failure', () => {
      const result = runner.runTestCase(design, cacheFailureTestCase);

      expect(result.passed).toBe(true);
      expect(result.metrics.dataLoss).toBe(0); // No data loss with cache-aside
    });
  });

  describe('Write-Through Strategy', () => {
    const design = createDesignWithCacheStrategy('write_through');

    it('should provide strong consistency', () => {
      const result = runner.runTestCase(design, readHeavyTestCase);

      expect(result.passed).toBe(true);
      // All reads see latest writes immediately
      expect(result.metrics.consistencyViolations).toBe(0);
    });

    it('should have higher write latency', () => {
      const result = runner.runTestCase(design, writeHeavyTestCase);

      // Write-through writes to both cache and DB synchronously
      const cacheMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.writeLatency !== undefined
      );
      expect(cacheMetrics).toBeDefined();
      expect(cacheMetrics!.writeLatency).toBeGreaterThan(10); // Cache + DB write
    });

    it('should not lose data on cache failure', () => {
      const result = runner.runTestCase(design, cacheFailureTestCase);

      expect(result.passed).toBe(true);
      expect(result.metrics.dataLoss).toBe(0); // No data loss with write-through
    });
  });

  describe('Write-Behind Strategy (Write-Back)', () => {
    const design = createDesignWithCacheStrategy('write_behind');

    it('should have low write latency', () => {
      const result = runner.runTestCase(design, writeHeavyTestCase);

      // Write-behind only writes to cache initially
      const cacheMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.writeLatency !== undefined
      );
      expect(cacheMetrics).toBeDefined();
      expect(cacheMetrics!.writeLatency).toBeLessThan(5); // Only cache write
    });

    it('should batch writes to database', () => {
      const result = runner.runTestCase(design, writeHeavyTestCase);

      // Check that DB load is reduced due to batching
      const dbMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.readUtil !== undefined
      );
      expect(dbMetrics).toBeDefined();
      // 800 writes/sec batched should reduce DB load significantly
      expect(dbMetrics!.writeUtil).toBeLessThan(0.5);
    });

    it('should risk data loss on cache failure', () => {
      const result = runner.runTestCase(design, cacheFailureTestCase);

      // Write-behind can lose data if cache fails before flushing
      expect(result.passed).toBe(false);
      expect(result.failureReason).toContain('data loss');
      // Unflushed writes in cache are lost
      expect(result.metrics.dataLoss).toBeGreaterThan(0);
    });
  });

  describe('Write-Around Strategy', () => {
    const design = createDesignWithCacheStrategy('write_around');

    it('should bypass cache for writes', () => {
      const result = runner.runTestCase(design, writeHeavyTestCase);

      expect(result.passed).toBe(true);
      // Writes go directly to DB, bypassing cache
      const cacheMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.cacheHits !== undefined
      );
      expect(cacheMetrics).toBeDefined();
      // Cache misses for recently written data
      expect(cacheMetrics!.cacheMisses).toBeGreaterThan(100);
    });

    it('should work well for rarely-read written data', () => {
      const infrequentReadTestCase: TestCase = {
        name: 'Infrequent Read After Write',
        traffic: {
          type: 'mixed',
          rps: 1000,
          readRatio: 0.1, // 90% writes, 10% reads
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: 150,
          maxErrorRate: 0.01,
        },
      };

      const result = runner.runTestCase(design, infrequentReadTestCase);

      expect(result.passed).toBe(true);
      // Good for write-heavy with infrequent reads
      expect(result.metrics.p99Latency).toBeLessThan(100);
    });

    it('should be inefficient for read-after-write patterns', () => {
      const readAfterWriteTestCase: TestCase = {
        name: 'Read After Write Pattern',
        traffic: {
          type: 'read_after_write',
          rps: 1000,
          readRatio: 0.5,
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: 50,
          maxErrorRate: 0.01,
        },
      };

      const result = runner.runTestCase(design, readAfterWriteTestCase);

      // Should fail because written data isn't cached
      expect(result.passed).toBe(false);
      expect(result.failureReason).toContain('latency');
    });
  });

  describe('Read-Through Strategy', () => {
    const design = createDesignWithCacheStrategy('read_through');

    it('should transparently handle cache misses', () => {
      const result = runner.runTestCase(design, readHeavyTestCase);

      expect(result.passed).toBe(true);
      // Cache handles DB reads on miss
      expect(result.metrics.p99Latency).toBeLessThan(50);
    });

    it('should simplify application logic', () => {
      const result = runner.runTestCase(design, readHeavyTestCase);

      // App doesn't need to manage cache population
      const cacheMetrics = Array.from(result.componentMetrics.values()).find(
        (m: any) => m.cacheHits !== undefined
      );
      expect(cacheMetrics).toBeDefined();
      expect(cacheMetrics!.effectiveHitRatio).toBeGreaterThan(0.85);
    });
  });

  describe('Strategy Selection Based on Workload', () => {
    it('should validate correct strategy for financial transactions', () => {
      const financialDesign = createDesignWithCacheStrategy('write_behind');
      const financialProblem = {
        ...tinyUrlProblemDefinition,
        id: 'payment_processing',
        consistencyRequirement: 'strong' as const,
        dataLossAcceptable: false,
      };

      // Validator should reject write-behind for financial systems
      const validators = financialProblem.validators;
      const cacheStrategyValidator = validators.find(v =>
        v.name === 'Cache Strategy Consistency'
      );

      expect(cacheStrategyValidator).toBeDefined();
      const result = cacheStrategyValidator!.validate(
        financialDesign,
        readHeavyTestCase,
        financialProblem
      );

      expect(result.valid).toBe(false);
      expect(result.hint).toContain('write-through');
    });

    it('should recommend write-around for audit logs', () => {
      const auditLogDesign = createDesignWithCacheStrategy('write_around');
      const auditTestCase: TestCase = {
        name: 'Audit Log Writing',
        traffic: {
          type: 'mixed',
          rps: 5000,
          readRatio: 0.05, // 95% writes, 5% reads (compliance checks)
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: 100,
          maxErrorRate: 0.001,
        },
      };

      const result = runner.runTestCase(auditLogDesign, auditTestCase);

      expect(result.passed).toBe(true);
      // Write-around is perfect for audit logs (rarely read)
      expect(result.metrics.p99Latency).toBeLessThan(50);
    });

    it('should recommend write-behind for analytics', () => {
      const analyticsDesign = createDesignWithCacheStrategy('write_behind');
      const analyticsProblem = {
        ...tinyUrlProblemDefinition,
        id: 'analytics_platform',
        consistencyRequirement: 'eventual' as const,
        dataLossAcceptable: true, // Can recreate from source
      };

      const analyticsTestCase: TestCase = {
        name: 'Analytics Data Collection',
        traffic: {
          type: 'mixed',
          rps: 10000,
          readRatio: 0.3, // 30% reads (dashboards), 70% writes (events)
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: 50, // Need fast writes
          maxErrorRate: 0.01,
        },
      };

      const result = runner.runTestCase(analyticsDesign, analyticsTestCase);

      expect(result.passed).toBe(true);
      // Write-behind is great for analytics (fast writes, batch to DB)
      expect(result.metrics.p99Latency).toBeLessThan(30);
    });
  });

  describe('Cache Coherency in Distributed Systems', () => {
    it('should detect coherency issues with multiple app servers', () => {
      const distributedDesign: SystemGraph = {
        components: [
          {
            id: 'lb',
            type: 'load_balancer',
            config: {},
          },
          {
            id: 'app1',
            type: 'app_server',
            config: { instances: 4 },
          },
          {
            id: 'cache1',
            type: 'redis',
            config: {
              memorySizeGB: 4,
              strategy: 'cache_aside',
              // Missing distributed cache config
            },
          },
          {
            id: 'db',
            type: 'postgresql',
            config: {
              readCapacity: 2000,
              writeCapacity: 300,
            },
          },
        ],
        connections: [
          { from: 'lb', to: 'app1', type: 'read_write' },
          { from: 'app1', to: 'cache1', type: 'read_write' },
          { from: 'cache1', to: 'db', type: 'read' },
          { from: 'app1', to: 'db', type: 'write' },
        ],
      };

      // Coherency validator should detect issues
      const validators = tinyUrlProblemDefinition.validators;
      const coherencyValidator = validators.find(v =>
        v.name.includes('Coherenc') || v.name.includes('coherenc')
      );

      // If no coherency validator exists, check with general cache validator
      const result = runner.runTestCase(distributedDesign, readHeavyTestCase);

      // Should have warnings about cache coherency
      expect(result.warnings).toBeDefined();
      expect(result.warnings.some((w: string) =>
        w.includes('coherenc') || w.includes('multiple')
      )).toBe(true);
    });
  });
});

describe('Caching Strategy Performance Characteristics', () => {
  const runner = new TestRunner();

  it('should measure latency differences between strategies', () => {
    const strategies: CacheStrategy[] = [
      'cache_aside',
      'write_through',
      'write_behind',
      'write_around',
      'read_through'
    ];

    const latencyResults: Record<CacheStrategy, number> = {} as any;

    strategies.forEach(strategy => {
      const design = {
        components: [
          {
            id: 'app',
            type: 'app_server',
            config: { instances: 1 },
          },
          {
            id: 'cache',
            type: 'redis',
            config: {
              memorySizeGB: 4,
              strategy,
              hitRatio: 0.9,
            },
          },
          {
            id: 'db',
            type: 'postgresql',
            config: {
              readCapacity: 1000,
              writeCapacity: 500,
            },
          },
        ],
        connections: [
          { from: 'app', to: 'cache', type: 'read_write' },
          { from: 'cache', to: 'db', type: 'read_write' },
        ],
      };

      const testCase: TestCase = {
        name: `${strategy} Performance`,
        traffic: {
          type: 'mixed',
          rps: 1000,
          readRatio: 0.7,
        },
        duration: 10,
        passCriteria: {
          maxP99Latency: 200,
          maxErrorRate: 0.01,
        },
      };

      const result = runner.runTestCase(design, testCase);
      latencyResults[strategy] = result.metrics.p99Latency;
    });

    // Verify expected latency characteristics
    expect(latencyResults.write_behind).toBeLessThan(latencyResults.write_through);
    expect(latencyResults.cache_aside).toBeLessThan(latencyResults.write_through);
    expect(latencyResults.read_through).toBeCloseTo(latencyResults.cache_aside, 5);
  });
});