import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner';
import { SystemGraph } from '../src/apps/system-design/builder/types/graph';
import { Challenge } from '../src/apps/system-design/builder/types/testCase';

// Import all core challenges
import { tinyUrlChallenge } from '../src/apps/system-design/builder/challenges/tinyUrl';
import { foodBlogChallenge } from '../src/apps/system-design/builder/challenges/foodBlog';
import { todoAppChallenge } from '../src/apps/system-design/builder/challenges/todoApp';
import { ticketMasterChallenge } from '../src/apps/system-design/builder/challenges/ticketMaster';
import { webCrawlerChallenge } from '../src/apps/system-design/builder/challenges/webCrawler';

function solutionToGraph(solution: any): SystemGraph {
  const components = solution.components.map((comp: any, idx: number) => ({
    id: `${comp.type}_${idx}`,
    type: comp.type,
    config: comp.config,
  }));

  const connections = solution.connections.map((conn: any) => {
    const fromComp = solution.components.find((c: any) => c.type === conn.from);
    const toComp = solution.components.find((c: any) => c.type === conn.to);
    const fromIdx = solution.components.indexOf(fromComp);
    const toIdx = solution.components.indexOf(toComp);
    
    return {
      from: `${conn.from}_${fromIdx}`,
      to: `${conn.to}_${toIdx}`,
      type: 'read_write' as const,
    };
  });

  return { components, connections };
}

function validateChallenge(challenge: Challenge): { passed: number; failed: number; total: number } {
  if (!challenge.solution) {
    console.log(`❌ ${challenge.title}: No solution defined`);
    return { passed: 0, failed: 0, total: 0 };
  }

  if (!challenge.testCases || challenge.testCases.length === 0) {
    console.log(`⚠️  ${challenge.title}: No test cases defined`);
    return { passed: 0, failed: 0, total: 0 };
  }

  const runner = new TestRunner();
  const graph = solutionToGraph(challenge.solution);
  
  console.log(`\n🧪 Testing ${challenge.title}`);
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  challenge.testCases.forEach((testCase, idx) => {
    const result = runner.runTestCase(graph, testCase);
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    
    console.log(`  ${idx + 1}. ${status} - ${testCase.name}`);
    if (!result.passed) {
      console.log(`     Reason: ${result.explanation.split('\n')[0]}`);
    }

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`  📊 Result: ${passed}/${challenge.testCases.length} tests passed`);

  return { passed, failed, total: challenge.testCases.length };
}

// Main execution
console.log('🚀 Validating All Challenge Solutions');
console.log('='.repeat(80));

const challenges = [
  tinyUrlChallenge,
  foodBlogChallenge,
  todoAppChallenge,
  ticketMasterChallenge,
  webCrawlerChallenge,
];

let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;

challenges.forEach(challenge => {
  const result = validateChallenge(challenge);
  totalPassed += result.passed;
  totalFailed += result.failed;
  totalTests += result.total;
});

console.log('\n' + '='.repeat(80));
console.log('📊 OVERALL SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${totalPassed} ✅`);
console.log(`Failed: ${totalFailed} ❌`);
console.log(`Pass Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(80));

if (totalFailed === 0) {
  console.log('🎉 All challenge solutions pass all tests!');
  process.exit(0);
} else {
  console.log('⚠️  Some challenges have failing tests. Please review above.');
  process.exit(1);
}