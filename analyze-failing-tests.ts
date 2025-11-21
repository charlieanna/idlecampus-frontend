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

const challengesToAnalyze = ['twitter', 'medium', 'stripe'];

challengesToAnalyze.forEach(challengeId => {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge || !challenge.solution) {
    console.log(`\n❌ ${challengeId}: No solution found`);
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`${challengeId.toUpperCase()}: ${challenge.title}`);
  console.log(`${'='.repeat(60)}`);
  
  const testRunner = new TestRunner();
  const graph = solutionToGraph(challenge.solution);
  
  console.log(`\nSOLUTION COMPONENTS (${challenge.solution.components.length}):`);
  challenge.solution.components.forEach(c => {
    const configStr = JSON.stringify(c.config);
    console.log(`  - ${c.type}: ${configStr}`);
  });
  
  let failingTestCount = 0;
  challenge.testCases.forEach((testCase, index) => {
    const result = testRunner.runTestCase(graph, testCase);
    
    if (!result.passed) {
      failingTestCount++;
      console.log(`\n❌ FAILING TEST ${failingTestCount}: ${testCase.name}`);
      console.log(`   Type: ${testCase.type}`);
      console.log(`   Requirement: ${testCase.requirement}`);
      
      console.log(`\n   TRAFFIC:`);
      console.log(`     Type: ${testCase.traffic.type}`);
      console.log(`     RPS: ${testCase.traffic.rps}`);
      console.log(`     Read Ratio: ${testCase.traffic.readRatio}`);
      
      console.log(`\n   PASS CRITERIA:`);
      if (testCase.passCriteria.maxP99Latency) console.log(`     Max p99 Latency: ${testCase.passCriteria.maxP99Latency}ms`);
      if (testCase.passCriteria.maxP95Latency) console.log(`     Max p95 Latency: ${testCase.passCriteria.maxP95Latency}ms`);
      if (testCase.passCriteria.maxP90Latency) console.log(`     Max p90 Latency: ${testCase.passCriteria.maxP90Latency}ms`);
      if (testCase.passCriteria.maxErrorRate !== undefined) console.log(`     Max Error Rate: ${(testCase.passCriteria.maxErrorRate * 100).toFixed(2)}%`);
      if (testCase.passCriteria.maxMonthlyCost) console.log(`     Max Monthly Cost: $${testCase.passCriteria.maxMonthlyCost}`);
      if (testCase.passCriteria.minAvailability) console.log(`     Min Availability: ${(testCase.passCriteria.minAvailability * 100).toFixed(1)}%`);
      
      console.log(`\n   ACTUAL METRICS:`);
      console.log(`     p99 Latency: ${result.metrics.p99Latency.toFixed(1)}ms`);
      console.log(`     p95 Latency: ${result.metrics.p95Latency.toFixed(1)}ms`);
      console.log(`     p90 Latency: ${result.metrics.p90Latency.toFixed(1)}ms`);
      console.log(`     Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}%`);
      console.log(`     Monthly Cost: $${result.metrics.monthlyCost.toFixed(0)}`);
      console.log(`     Infrastructure Cost: $${result.metrics.infrastructureCost?.toFixed(0) || 'N/A'}`);
      console.log(`     Availability: ${(result.metrics.availability * 100).toFixed(1)}%`);
      
      console.log(`\n   BOTTLENECKS:`);
      if (result.bottlenecks && result.bottlenecks.length > 0) {
        result.bottlenecks.forEach(b => {
          console.log(`     - ${b.componentId}: ${(b.utilization * 100).toFixed(0)}% utilization`);
        });
      } else {
        console.log(`     None detected`);
      }
    }
  });
  
  console.log(`\nSUMMARY: ${challenge.testCases.length - failingTestCount}/${challenge.testCases.length} tests passing`);
});
