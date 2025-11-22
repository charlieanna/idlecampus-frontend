#!/usr/bin/env npx tsx
import { generatedChallenges } from '../src/apps/system-design/builder/challenges/generatedChallenges';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';
import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner';

const runner = new TestRunner();

// Find the Collaborative Document Editor challenge
const collaborativeEditor = generatedChallenges
  .map(c => L6TestGenerator.enhanceChallenge(c))
  .find(c => c.title === 'Collaborative Document Editor');

if (!collaborativeEditor) {
  console.error('❌ Collaborative Document Editor challenge not found!');
  process.exit(1);
}

if (!collaborativeEditor.solution || !collaborativeEditor.testCases) {
  console.error('❌ Collaborative Document Editor has no solution or test cases!');
  process.exit(1);
}

console.log('\n=================================');
console.log('COLLABORATIVE DOCUMENT EDITOR TEST');
console.log('=================================\n');

// Build the graph from the solution
const graph = {
  components: collaborativeEditor.solution.components.map((c: any, idx: number) => ({
    id: `${c.type}_${idx}`,
    type: c.type,
    config: c.config,
  })),
  connections: collaborativeEditor.solution.connections.map((conn: any) => {
    const fromIdx = collaborativeEditor.solution.components.findIndex((c: any) => c.type === conn.from);
    const toIdx = collaborativeEditor.solution.components.findIndex((c: any) => c.type === conn.to);
    return {
      from: `${conn.from}_${fromIdx}`,
      to: `${conn.to}_${toIdx}`,
      type: 'read_write' as const,
    };
  }),
};

// Log the architecture
console.log('Architecture Overview:');
const appServers = collaborativeEditor.solution.components.filter((c: any) => c.type === 'app_server');
const readApi = appServers.find((c: any) => c.config?.serviceName === 'read-api');
const writeApi = appServers.find((c: any) => c.config?.serviceName === 'write-api');

if (readApi) {
  console.log(`  - Read API (WebSocket Gateway): ${readApi.config.instances} instances`);
}
if (writeApi) {
  console.log(`  - Write API (CRDT Engine): ${writeApi.config.instances} instances`);
}
if (!readApi && !writeApi && appServers.length > 0) {
  console.log(`  - App Servers: ${appServers[0].config.instances} instances`);
}

const totalInstances = appServers.reduce((sum: number, c: any) => sum + (c.config?.instances || 0), 0);
console.log(`  - Total Instances: ${totalInstances}`);
console.log('');

// Run the tests
let passed = 0;
let failed = 0;
const failingTests: { name: string; reason: string }[] = [];

for (const test of collaborativeEditor.testCases) {
  const result = runner.runTestCase(graph, test);

  if (result.passed) {
    passed++;
    console.log(`✅ ${test.name}`);
  } else {
    failed++;
    const reason = result.errors?.join(', ') || 'Unknown failure';
    failingTests.push({ name: test.name, reason });
    console.log(`❌ ${test.name}: ${reason}`);
  }
}

console.log('\n=================================');
console.log('RESULTS');
console.log('=================================');
console.log(`Total Tests: ${collaborativeEditor.testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Pass Rate: ${((passed / collaborativeEditor.testCases.length) * 100).toFixed(1)}%`);
console.log(`Total Instances: ${totalInstances}`);

if (failingTests.length > 0) {
  console.log('\nFailing Tests:');
  for (const test of failingTests) {
    console.log(`  - ${test.name}: ${test.reason}`);
  }
}

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);