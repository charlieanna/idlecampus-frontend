/**
 * Validate Active-Active Challenge Solution
 */

import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner.ts';
import { patternToGraph } from '../src/apps/system-design/builder/services/patternTransformer.js';
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/multiregionProblems.ts';
import { generateSolution } from '../src/apps/system-design/builder/challenges/solutionGenerator.ts';
import { problemConfigs } from '../src/apps/system-design/builder/challenges/problemConfigs.ts';

async function validate() {
  console.log('🔍 Validating Active-Active Solution\n');

  const problemId = 'active-active-regions';
  const config = problemConfigs[problemId];
  const definition = activeActiveRegionsProblemDefinition;

  // Generate solution
  const solution = generateSolution(problemId, config, definition.userFacingFRs);
  
  // Convert to graph
  const graph = patternToGraph(solution);
  
  console.log('Graph components:', graph.components ? graph.components.length : 0);
  console.log('Graph connections:', graph.connections ? graph.connections.length : 0);

  // Create test runner
  const testRunner = new TestRunner();
  
  console.log(`Running ${definition.scenarios.length} scenarios...\n`);
  
  let passedCount = 0;
  let failedCount = 0;
  
  for (const scenario of definition.scenarios) {
    const result = testRunner.runTestCase(graph, scenario);
    
    if (result.passed) {
      passedCount++;
      console.log(`✅ ${scenario.name}`);
    } else {
      failedCount++;
      console.log(`❌ ${scenario.name}`);
      console.log(`   Reason: ${result.explanation}`);
      if (result.metrics) {
        console.log(`   Metrics: ${JSON.stringify(result.metrics)}`);
      }
    }
  }
  
  console.log(`\nResults: ${passedCount}/${definition.scenarios.length} passed`);
  
  if (failedCount > 0) {
    process.exit(1);
  }
}

validate().catch(console.error);