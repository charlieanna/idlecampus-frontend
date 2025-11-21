import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner';
import { SystemGraph } from '../src/apps/system-design/builder/types/graph';
import { Challenge } from '../src/apps/system-design/builder/types/testCase';
import * as fs from 'fs';

// Import generated challenges only (avoiding manual challenges with syntax issues)
import { generatedChallenges } from '../src/apps/system-design/builder/challenges/generatedChallenges';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

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

interface ValidationResult {
  passed: number;
  failed: number;
  total: number;
  failingTests: Array<{ testName: string; reason: string }>;
}

function validateChallenge(challenge: Challenge): ValidationResult {
  if (!challenge.solution) {
    console.log(`❌ ${challenge.title}: No solution defined`);
    return { passed: 0, failed: 0, total: 0, failingTests: [] };
  }

  if (!challenge.testCases || challenge.testCases.length === 0) {
    console.log(`⚠️  ${challenge.title}: No test cases defined`);
    return { passed: 0, failed: 0, total: 0, failingTests: [] };
  }

  const runner = new TestRunner();
  const graph = solutionToGraph(challenge.solution);
  
  console.log(`\n🧪 Testing ${challenge.title}`);
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;
  const failingTests: Array<{ testName: string; reason: string }> = [];

  challenge.testCases.forEach((testCase, idx) => {
    const result = runner.runTestCase(graph, testCase);
    const status = result.passed ? '✅ PASS' : '❌ FAIL';

    console.log(`  ${idx + 1}. ${status} - ${testCase.name}`);
    if (!result.passed) {
      const reason = result.explanation.split('\n')[0];
      console.log(`     Reason: ${reason}`);
      failingTests.push({ testName: testCase.name, reason });
    }

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`  📊 Result: ${passed}/${challenge.testCases.length} tests passed`);

  return { passed, failed, total: challenge.testCases.length, failingTests };
}

// Main execution
console.log('🚀 Validating All Challenge Solutions');
console.log('='.repeat(80));

// Apply L6 enhancements to generated challenges
const allChallenges = generatedChallenges.map(challenge => L6TestGenerator.enhanceChallenge(challenge));

let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;

interface ChallengeResult {
  title: string;
  passed: number;
  failed: number;
  total: number;
  passRate: number;
  failingTests: Array<{ testName: string; reason: string }>;
}

const challengeResults: ChallengeResult[] = [];
const failingChallenges: ChallengeResult[] = [];

console.log(`Total challenges to test: ${allChallenges.length}\n`);

allChallenges.forEach((challenge, index) => {
  console.log(`\n[${index + 1}/${allChallenges.length}] Testing challenge...`);
  const result = validateChallenge(challenge);
  totalPassed += result.passed;
  totalFailed += result.failed;
  totalTests += result.total;

  const challengeResult: ChallengeResult = {
    title: challenge.title,
    passed: result.passed,
    failed: result.failed,
    total: result.total,
    passRate: result.total > 0 ? (result.passed / result.total) * 100 : 0,
    failingTests: result.failingTests,
  };

  challengeResults.push(challengeResult);

  if (result.failed > 0) {
    failingChallenges.push(challengeResult);
  }
});

console.log('\n' + '='.repeat(80));
console.log('📊 OVERALL SUMMARY');
console.log('='.repeat(80));
console.log(`Total Challenges: ${allChallenges.length}`);
console.log(`Passing Challenges: ${allChallenges.length - failingChallenges.length} ✅`);
console.log(`Failing Challenges: ${failingChallenges.length} ❌`);
console.log(`\nTotal Tests: ${totalTests}`);
console.log(`Passed: ${totalPassed} ✅`);
console.log(`Failed: ${totalFailed} ❌`);
console.log(`Pass Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(80));

// Show failing challenges
if (failingChallenges.length > 0) {
  console.log('\n📋 FAILING CHALLENGES DETAILS:');
  console.log('='.repeat(80));

  failingChallenges.forEach((challenge, idx) => {
    console.log(`\n${idx + 1}. ${challenge.title}`);
    console.log(`   Pass Rate: ${challenge.passRate.toFixed(1)}% (${challenge.passed}/${challenge.total})`);
    console.log('   Failing Tests:');
    challenge.failingTests.forEach(test => {
      console.log(`     - ${test.testName}`);
      console.log(`       ${test.reason}`);
    });
  });

  // Save results to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = `validation-results-${timestamp}.json`;
  const results = {
    summary: {
      totalChallenges: allChallenges.length,
      passingChallenges: allChallenges.length - failingChallenges.length,
      failingChallenges: failingChallenges.length,
      totalTests,
      passedTests: totalPassed,
      failedTests: totalFailed,
      passRate: ((totalPassed / totalTests) * 100).toFixed(1),
    },
    failingChallenges,
    allResults: challengeResults,
  };

  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📁 Detailed results saved to: ${resultsFile}`);
}

if (totalFailed === 0) {
  console.log('🎉 All challenge solutions pass all tests!');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failingChallenges.length} challenges have failing tests. Please review above.`);
  process.exit(1);
}