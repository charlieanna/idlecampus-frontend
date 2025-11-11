import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import { TestRunner } from '../simulation/testRunner';

/**
 * Tiny URL Challenge - Example Designs
 */

// Good Design: Load Balancer → App Servers (2) → Redis Cache (90% hit ratio) → PostgreSQL
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
