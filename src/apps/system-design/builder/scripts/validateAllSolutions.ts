/**
 * Script to validate that all 65 challenges have passing solution test cases
 * 
 * This script:
 * 1. Loads all challenges (with L6 enhancements)
 * 2. For each challenge with a solution, runs all test cases
 * 3. Reports which challenges have failing tests
 * 4. Provides a summary of pass/fail results
 * 
 * Usage:
 *   npx tsx src/apps/system-design/builder/scripts/validateAllSolutions.ts
 */

import { challenges } from '../challenges';
import { TestRunner } from '../simulation/testRunner';
import { SystemGraph } from '../types/graph';
import { TestResult, Solution } from '../types/testCase';
import { ComponentNode, ComponentType } from '../types/component';
import { Connection } from '../types/graph';

interface ValidationResult {
  challengeId: string;
  challengeTitle: string;
  hasSolution: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: string[];
}

/**
 * Convert a Solution to a SystemGraph that can be used with TestRunner
 */
function solutionToGraph(solution: Solution): SystemGraph {
  // Create ComponentNode[] with IDs
  const componentNodes: ComponentNode[] = solution.components.map((comp, index) => ({
    id: `${comp.type}_${index}`,
    type: comp.type as ComponentType,
    config: comp.config,
  }));

  // Build lookup map from component type to ID
  const typeToId = new Map<string, string>();
  componentNodes.forEach(node => {
    // Store the first instance of each type for connection resolution
    if (!typeToId.has(node.type)) {
      typeToId.set(node.type, node.id);
    }
  });

  // Convert connections to use IDs instead of types
  const connections: Connection[] = solution.connections.map(conn => ({
    from: typeToId.get(conn.from) || conn.from,
    to: typeToId.get(conn.to) || conn.to,
    type: 'read_write' as const,
  }));

  return {
    components: componentNodes,
    connections,
  };
}

function validateAllSolutions(): void {
  console.log('\n=== Validating All Challenge Solutions ===\n');
  console.log(`Total challenges: ${challenges.length}\n`);

  const results: ValidationResult[] = [];
  let challengesWithSolutions = 0;
  let challengesWithAllPassing = 0;
  let challengesWithFailures = 0;

  for (const challenge of challenges) {
    if (!challenge.solution) {
      results.push({
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        hasSolution: false,
        totalTests: challenge.testCases.length,
        passedTests: 0,
        failedTests: ['No solution provided'],
      });
      continue;
    }

    challengesWithSolutions++;

    const testRunner = new TestRunner();

    // Convert solution to SystemGraph
    const graph: SystemGraph = solutionToGraph(challenge.solution);

    const testResults: TestResult[] = testRunner.runAllTestCases(
      graph,
      challenge.testCases
    );

    // Zip results with test case names (results align by index)
    const failedTestNames: string[] = testResults
      .map((result, index) => ({
        result,
        testCase: challenge.testCases[index],
      }))
      .filter(({ result }) => !result.passed)
      .map(({ testCase }) => testCase.name);

    const passedTests = testResults.filter(r => r.passed).length;

    results.push({
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      hasSolution: true,
      totalTests: challenge.testCases.length,
      passedTests,
      failedTests: failedTestNames,
    });

    if (failedTestNames.length === 0) {
      challengesWithAllPassing++;
    } else {
      challengesWithFailures++;
    }
  }

  console.log('\n=== Validation Results ===\n');
  console.log(`Challenges with solutions: ${challengesWithSolutions}/${challenges.length}`);
  console.log(`Challenges with all tests passing: ${challengesWithAllPassing}`);
  console.log(`Challenges with failures: ${challengesWithFailures}\n`);

  if (challengesWithFailures > 0) {
    console.log('=== Failing Challenges ===\n');
    const failingChallenges = results.filter(r => r.failedTests.length > 0);
    
    failingChallenges.forEach((result, index) => {
      console.log(`${index + 1}. ${result.challengeTitle} (${result.challengeId})`);
      console.log(`   Tests: ${result.passedTests}/${result.totalTests} passing`);
      console.log(`   Failed tests:`);
      result.failedTests.forEach(testName => {
        console.log(`     - ${testName}`);
      });
      console.log('');
    });
  }

  const challengesWithoutSolutions = results.filter(r => !r.hasSolution);
  if (challengesWithoutSolutions.length > 0) {
    console.log('\n=== Challenges Without Solutions ===\n');
    challengesWithoutSolutions.forEach((result, index) => {
      console.log(`${index + 1}. ${result.challengeTitle} (${result.challengeId})`);
    });
    console.log('');
  }

  console.log('=== Summary ===\n');
  console.log(`✅ All tests passing: ${challengesWithAllPassing}/${challengesWithSolutions}`);
  console.log(`❌ With failures: ${challengesWithFailures}/${challengesWithSolutions}`);
  console.log(`⚠️  Without solutions: ${challengesWithoutSolutions.length}/${challenges.length}\n`);

  if (challengesWithFailures === 0 && challengesWithoutSolutions.length === 0) {
    console.log('🎉 SUCCESS: All 65 challenges have passing solutions!\n');
  } else {
    console.log('❌ INCOMPLETE: Some challenges need fixes or solutions.\n');
  }
}

try {
  validateAllSolutions();
} catch (error) {
  console.error('Validation script failed:', error);
}
