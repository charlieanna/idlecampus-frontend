import { challenges } from './src/apps/system-design/builder/challenges/index.js';
import { TestRunner } from './src/apps/system-design/builder/simulation/testRunner.js';
import { SystemGraph } from './src/apps/system-design/builder/types/graph.js';
import { ComponentNode } from './src/apps/system-design/builder/types/component.js';

function solutionToGraph(solution: any): SystemGraph {
  const componentNodes: ComponentNode[] = solution.components.map((comp: any, index: number) => ({
    id: `${comp.type}_${index}`,
    type: comp.type,
    config: comp.config,
  }));

  const typeToId = new Map<string, string>();
  componentNodes.forEach(node => {
    if (!typeToId.has(node.type)) {
      typeToId.set(node.type, node.id);
    }
  });

  const connections = solution.connections.map((conn: any) => ({
    from: typeToId.get(conn.from) || conn.from,
    to: typeToId.get(conn.to) || conn.to,
    type: 'read_write' as const,
  }));

  return { components: componentNodes, connections };
}

// The 16 failing challenges
const failingChallengeIds = [
  'tiny_url', 'food_blog', 'todo_app', 'web_crawler',
  'discord', 'stripe', 'netflix', 'hulu',
  'whatsapp', 'slack', 'telegram', 'messenger',
  'zoom', 'weatherapi', 'tiny-url-l6', 'active-active-regions'
];

console.log('=== Analyzing 16 Failing Challenges ===\n');

failingChallengeIds.forEach(challengeId => {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge || !challenge.solution) {
    console.log(`❌ ${challengeId}: No solution found\n`);
    return;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`${challenge.title} (${challenge.id})`);
  console.log(`${'='.repeat(80)}`);

  const testRunner = new TestRunner();
  const graph = solutionToGraph(challenge.solution);

  let failCount = 0;
  challenge.testCases.forEach((testCase, index) => {
    const result = testRunner.runTestCase(graph, testCase);

    if (!result.passed) {
      failCount++;
      console.log(`\n❌ Test ${index + 1}: ${testCase.name}`);
      console.log(`   Type: ${testCase.type} | Requirement: ${testCase.requirement}`);
      console.log(`   Traffic: ${testCase.traffic.rps} RPS (read ratio: ${testCase.traffic.readRatio || 'N/A'})`);

      // Show failure reasons
      if (testCase.passCriteria.maxP99Latency && result.metrics.p99Latency > testCase.passCriteria.maxP99Latency) {
        console.log(`   ❌ P99 Latency: ${result.metrics.p99Latency.toFixed(1)}ms > ${testCase.passCriteria.maxP99Latency}ms`);
      }
      if (testCase.passCriteria.maxP95Latency && result.metrics.p95Latency > testCase.passCriteria.maxP95Latency) {
        console.log(`   ❌ P95 Latency: ${result.metrics.p95Latency.toFixed(1)}ms > ${testCase.passCriteria.maxP95Latency}ms`);
      }
      if (testCase.passCriteria.maxErrorRate !== undefined && result.metrics.errorRate > testCase.passCriteria.maxErrorRate) {
        console.log(`   ❌ Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}% > ${(testCase.passCriteria.maxErrorRate * 100).toFixed(2)}%`);
      }
      if (testCase.passCriteria.maxMonthlyCost && result.metrics.monthlyCost > testCase.passCriteria.maxMonthlyCost) {
        console.log(`   ❌ Monthly Cost: $${result.metrics.monthlyCost.toFixed(0)} > $${testCase.passCriteria.maxMonthlyCost}`);
      }

      // Show bottlenecks
      if (result.bottlenecks && result.bottlenecks.length > 0) {
        console.log(`   Bottlenecks:`);
        result.bottlenecks.forEach(b => {
          console.log(`     - ${b.componentId}: ${(b.utilization * 100).toFixed(0)}% utilization`);
        });
      }
    }
  });

  console.log(`\nSummary: ${challenge.testCases.length - failCount}/${challenge.testCases.length} tests passing`);
});
