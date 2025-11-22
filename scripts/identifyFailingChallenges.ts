import { generatedChallenges } from '../src/apps/system-design/builder/challenges/generatedChallenges';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';
import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner';

const challenges = generatedChallenges.map(c => L6TestGenerator.enhanceChallenge(c));
const runner = new TestRunner();

const failing = [];
for (const challenge of challenges) {
  if (!challenge.solution || !challenge.testCases) continue;

  const graph = {
    components: challenge.solution.components.map((c: any, idx: number) => ({
      id: `${c.type}_${idx}`,
      type: c.type,
      config: c.config,
    })),
    connections: challenge.solution.connections.map((conn: any) => {
      const fromIdx = challenge.solution.components.findIndex((c: any) => c.type === conn.from);
      const toIdx = challenge.solution.components.findIndex((c: any) => c.type === conn.to);
      return {
        from: `${conn.from}_${fromIdx}`,
        to: `${conn.to}_${toIdx}`,
        type: 'read_write' as const,
      };
    }),
  };

  let failed = 0;
  const failingTests: string[] = [];
  for (const test of challenge.testCases) {
    const result = runner.runTestCase(graph, test);
    if (!result.passed) {
      failed++;
      failingTests.push(test.name);
    }
  }

  if (failed > 0) {
    failing.push({
      title: challenge.title,
      failed,
      total: challenge.testCases.length,
      tests: failingTests,
    });
  }
}

console.log('\n=================================');
console.log('CHALLENGES WITH FAILING TESTS:');
console.log('=================================\n');

let totalFailing = 0;
for (const f of failing) {
  console.log(`${f.title}:`);
  console.log(`  ${f.failed} of ${f.total} tests failing`);
  for (const t of f.tests) {
    console.log(`    ❌ ${t}`);
    totalFailing++;
  }
  console.log();
}

console.log(`Total: ${totalFailing} tests failing across ${failing.length} challenges`);