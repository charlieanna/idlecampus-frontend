// Script to analyze active-active-regions challenge tests
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
console.log('Before L6 enhancement:');
console.log('  Test Cases:', challenge.testCases.length);

const enhanced = L6TestGenerator.enhanceChallenge(challenge);
console.log('\nAfter L6 enhancement:');
console.log('  Total Tests:', enhanced.testCases.length);
console.log('\nTest Breakdown:');
enhanced.testCases.forEach((test, i) => {
  console.log(`  ${i+1}. ${test.name}`);
});

console.log('\n--- Challenge Info ---');
console.log('ID:', enhanced.id);
console.log('Title:', enhanced.title);
console.log('Difficulty:', enhanced.difficulty);
