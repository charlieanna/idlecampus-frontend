import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import { TestRunner } from '../simulation/testRunner';

/**
 * Todo App Challenge - Example Designs
 * Focus: Database replication, fault tolerance, availability
 */

// Good Design: Replication enabled (auto-failover)
export const todoAppGoodDesign: SystemGraph = {
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
      id: 'session_cache',
      type: 'redis',
      config: {
        memorySizeGB: 1, // Small cache for sessions
        ttl: 3600,
        hitRatio: 0.95, // Sessions are frequently accessed
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 800,
        writeCapacity: 400,
        replication: true, // ✅ Replication enabled!
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'session_cache', type: 'read' },
    { from: 'app', to: 'db', type: 'read_write' },
  ],
};

// Mediocre Design: Replication but manual failover (30s downtime)
// In MVP, we simulate this as "replication: false" since we don't model
// manual vs auto-failover separately. This would fail the DB failure test.
export const todoAppMediocreDesign: SystemGraph = {
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
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 800,
        writeCapacity: 400,
        replication: false, // Simulates "no auto-failover" for MVP
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'db', type: 'read_write' },
  ],
};

// Bad Design: Single database, no replication
export const todoAppBadDesign: SystemGraph = {
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
        instances: 1, // Also under-provisioned
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 500,
        writeCapacity: 300,
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
export const todoAppTestCases: TestCase[] = [
  {
    name: 'Normal Load',
    traffic: {
      type: 'mixed',
      rps: 500,
      readRatio: 0.6, // 300 reads, 200 writes
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 200,
      maxErrorRate: 0.01,
      maxMonthlyCost: 800,
    },
  },
  {
    name: 'Database Failure',
    traffic: {
      type: 'mixed',
      rps: 500,
      readRatio: 0.6,
    },
    duration: 120, // 2 minutes
    failureInjection: {
      type: 'db_crash',
      atSecond: 30,
      recoverySecond: 90, // 60 seconds of downtime without replication
    },
    passCriteria: {
      minAvailability: 0.95, // 95% availability = max 10s downtime
      maxErrorRate: 0.1, // Some errors during failover OK
    },
  },
  {
    name: 'Hot User',
    traffic: {
      type: 'mixed',
      rps: 600, // 500 normal + 100 from hot user
      readRatio: 0.6,
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 250, // Slight degradation OK
      maxErrorRate: 0.02,
    },
  },
];

/**
 * Run the Todo App example
 */
export function runTodoAppExample() {
  const runner = new TestRunner();

  console.log('='.repeat(80));
  console.log('TODO APP CHALLENGE - SIMULATION RESULTS');
  console.log('='.repeat(80));

  console.log('\n--- Testing GOOD DESIGN (with replication) ---\n');
  const goodResults = runner.runAllTestCases(todoAppGoodDesign, todoAppTestCases);
  goodResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${todoAppTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  console.log('\n\n--- Testing MEDIOCRE DESIGN (no auto-failover) ---\n');
  const mediocreResults = runner.runAllTestCases(
    todoAppMediocreDesign,
    todoAppTestCases
  );
  mediocreResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${todoAppTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  console.log('\n\n--- Testing BAD DESIGN (single DB, no replication) ---\n');
  const badResults = runner.runAllTestCases(todoAppBadDesign, todoAppTestCases);
  badResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${todoAppTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  // Summary
  const goodPassed = goodResults.filter((r) => r.passed).length;
  const mediocrePassed = mediocreResults.filter((r) => r.passed).length;
  const badPassed = badResults.filter((r) => r.passed).length;

  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(
    `Good Design (with replication): ${goodPassed}/${goodResults.length} tests passed`
  );
  console.log(
    `Mediocre Design (no auto-failover): ${mediocrePassed}/${mediocreResults.length} tests passed`
  );
  console.log(
    `Bad Design (single DB): ${badPassed}/${badResults.length} tests passed`
  );
  console.log('='.repeat(80));

  console.log('\n💡 Key Learning:');
  console.log(
    '- Database replication is CRITICAL for high availability (99.9%+)'
  );
  console.log(
    '- Without replication, DB failure = complete outage (0% availability)'
  );
  console.log(
    '- Availability calculation: (total_time - downtime) / total_time'
  );
  console.log('  Example: 60s downtime in 120s test = 50% availability ❌');
  console.log('  With replication: <10s downtime = 95%+ availability ✅');
  console.log('='.repeat(80));
}

// Export for use in tests or CLI
if (require.main === module) {
  runTodoAppExample();
}
