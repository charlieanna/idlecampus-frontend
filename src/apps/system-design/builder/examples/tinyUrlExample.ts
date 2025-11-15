import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import { TestRunner } from '../simulation/testRunner';
import { CacheStrategy } from '../types/advancedConfig';

/**
 * Tiny URL Challenge - Example Designs with Different Caching Strategies
 * Demonstrates how different caching strategies affect system behavior
 */

// Good Design: Load Balancer → App Servers (2) → Redis Cache (90% hit ratio) → PostgreSQL
// Default: Cache-Aside strategy (most flexible for read-heavy workloads)
export const tinyUrlGoodDesign: SystemGraph = {
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
        strategy: 'cache_aside' as CacheStrategy, // Explicitly specify strategy
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 1000,
        writeCapacity: 150,
        replication: false,
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

// Bad Design: No cache, single app server
export const tinyUrlBadDesign: SystemGraph = {
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
        instances: 1,
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 500,
        writeCapacity: 100,
        replication: false,
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'db', type: 'read_write' },
  ],
};

// Test Cases
export const tinyUrlTestCases: TestCase[] = [
  {
    name: 'Normal Load',
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
  },
  {
    name: 'Read Spike',
    traffic: {
      type: 'mixed',
      rps: 5100,
      readRatio: 0.98, // 5000 reads, 100 writes
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 200,
      maxErrorRate: 0.05,
    },
  },
  {
    name: 'Cache Flush',
    traffic: {
      type: 'mixed',
      rps: 1100,
      readRatio: 0.91,
    },
    duration: 60,
    failureInjection: {
      type: 'cache_flush',
      atSecond: 15,
    },
    passCriteria: {
      maxP99Latency: 150,
      maxErrorRate: 0.02,
    },
  },
];

// Write-Through Design: Strong consistency but slower writes
export const tinyUrlWriteThroughDesign: SystemGraph = {
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
        strategy: 'write_through' as CacheStrategy,
        // Write-through ensures cache and DB are always in sync
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 1000,
        writeCapacity: 200, // Need more write capacity for synchronous writes
        replication: true,
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'cache', type: 'read_write' },
    { from: 'cache', to: 'db', type: 'read_write' },
  ],
};

// Write-Behind Design: Fast writes but risk of data loss
export const tinyUrlWriteBehindDesign: SystemGraph = {
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
        strategy: 'write_behind' as CacheStrategy,
        writeBatchSize: 100, // Batch 100 writes before flushing
        writeDelayMs: 1000, // Flush to DB every second
        // DANGER: Can lose up to 100 URLs if cache crashes!
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
    { from: 'app', to: 'cache', type: 'read_write' },
    { from: 'cache', to: 'db', type: 'write' }, // Async writes from cache to DB
  ],
};

// Write-Around Design: Good for rarely-read data (not ideal for TinyURL!)
export const tinyUrlWriteAroundDesign: SystemGraph = {
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
        strategy: 'write_around' as CacheStrategy,
        // Writes bypass cache - BAD for TinyURL where URLs are immediately read!
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 1000,
        writeCapacity: 150,
        replication: false,
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'cache', type: 'read' },
    { from: 'app', to: 'db', type: 'write' }, // Writes bypass cache
    { from: 'cache', to: 'db', type: 'read' },
  ],
};

// Read-Through Design: Cache transparently handles DB reads
export const tinyUrlReadThroughDesign: SystemGraph = {
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
        strategy: 'read_through' as CacheStrategy,
        // Cache handles DB reads on miss - simpler app logic
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 1000,
        writeCapacity: 150,
        replication: false,
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'cache', type: 'read' }, // App only talks to cache for reads
    { from: 'cache', to: 'db', type: 'read' }, // Cache fetches from DB on miss
    { from: 'app', to: 'db', type: 'write' },
  ],
};

// Test cases specific to caching strategies
export const cacheStrategyTestCases: TestCase[] = [
  {
    name: 'Strong Consistency Test',
    traffic: {
      type: 'read_after_write',
      rps: 1000,
      readRatio: 0.5, // Write then immediately read
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 100,
      maxErrorRate: 0.01,
      consistencyViolations: 0, // No stale reads allowed
    },
  },
  {
    name: 'Data Durability Test',
    traffic: {
      type: 'mixed',
      rps: 1100,
      readRatio: 0.91,
    },
    duration: 60,
    failureInjection: {
      type: 'cache_crash',
      atSecond: 30,
    },
    passCriteria: {
      maxP99Latency: 200,
      maxErrorRate: 0.05,
      dataLoss: 0, // Zero tolerance for lost URLs
    },
  },
  {
    name: 'Write Performance Test',
    traffic: {
      type: 'mixed',
      rps: 1000,
      readRatio: 0.3, // 70% writes
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 50, // Need fast writes
      maxErrorRate: 0.01,
    },
  },
];

/**
 * Run the Tiny URL example
 */
export function runTinyUrlExample() {
  const runner = new TestRunner();

  console.log('='.repeat(80));
  console.log('TINY URL CHALLENGE - SIMULATION RESULTS');
  console.log('='.repeat(80));

  console.log('\n--- Testing GOOD DESIGN ---\n');
  const goodResults = runner.runAllTestCases(tinyUrlGoodDesign, tinyUrlTestCases);
  goodResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${tinyUrlTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  console.log('\n\n--- Testing BAD DESIGN ---\n');
  const badResults = runner.runAllTestCases(tinyUrlBadDesign, tinyUrlTestCases);
  badResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${tinyUrlTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  // Summary
  const goodPassed = goodResults.filter(r => r.passed).length;
  const badPassed = badResults.filter(r => r.passed).length;

  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Good Design: ${goodPassed}/${goodResults.length} tests passed`);
  console.log(`Bad Design: ${badPassed}/${badResults.length} tests passed`);
  console.log('='.repeat(80));
}

// Export for use in tests or CLI
if (require.main === module) {
  runTinyUrlExample();
}
