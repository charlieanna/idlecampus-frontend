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

console.log(`\n=== Analyzing All ${challenges.length} Challenges ===\n`);

const failingChallenges: string[] = [];
const passingChallenges: string[] = [];
const noSolutionChallenges: string[] = [];

challenges.forEach((challenge, idx) => {
  if (!challenge.solution) {
    noSolutionChallenges.push(`${idx + 1}. ${challenge.title} (${challenge.id})`);
    return;
  }

  const testRunner = new TestRunner();
  const graph = solutionToGraph(challenge.solution);

  let hasFailing = false;
  challenge.testCases.forEach((testCase) => {
    const result = testRunner.runTestCase(graph, testCase);
    if (!result.passed) {
      hasFailing = true;
    }
  });

  if (hasFailing) {
    failingChallenges.push(`${idx + 1}. ${challenge.title} (${challenge.id})`);
  } else {
    passingChallenges.push(`${idx + 1}. ${challenge.title} (${challenge.id})`);
  }
});

console.log(`\n=== SUMMARY ===\n`);
console.log(`Total Challenges: ${challenges.length}`);
console.log(`Passing: ${passingChallenges.length}`);
console.log(`Failing: ${failingChallenges.length}`);
console.log(`No Solution: ${noSolutionChallenges.length}\n`);

if (failingChallenges.length > 0) {
  console.log(`\n=== FAILING CHALLENGES (${failingChallenges.length}) ===\n`);
  failingChallenges.forEach(c => console.log(c));
}

if (noSolutionChallenges.length > 0) {
  console.log(`\n=== NO SOLUTION (${noSolutionChallenges.length}) ===\n`);
  noSolutionChallenges.forEach(c => console.log(c));
}
