// Script to check the solution for active-active-regions
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

console.log('=== SOLUTION ANALYSIS ===\n');
console.log('Challenge:', enhanced.title);
console.log('Total Tests:', enhanced.testCases.length);

if (enhanced.solution) {
  console.log('\nSolution Components:');
  enhanced.solution.components.forEach((comp: any) => {
    console.log(`  - ${comp.type}: ${JSON.stringify(comp.config)}`);
  });
  
  console.log('\nSolution Connections:', enhanced.solution.connections.length);
} else {
  console.log('\n⚠️  NO SOLUTION GENERATED!');
}

console.log('\n=== TEST REQUIREMENTS ===');
enhanced.testCases.forEach((test: any, i: number) => {
  console.log(`\n${i+1}. ${test.name}`);
  console.log(`   Traffic: ${test.traffic?.rps || 'N/A'} RPS`);
  console.log(`   Pass Criteria:`, test.passCriteria);
});
