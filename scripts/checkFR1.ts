// Script to check FR-1 requirements
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

console.log('=== FR-1 TEST ===');
const fr1 = enhanced.testCases[0];
console.log('Name:', fr1.name);
console.log('Type:', fr1.type);
console.log('Requirement:', fr1.requirement);
console.log('Description:', fr1.description);
console.log('Traffic:', fr1.traffic);
console.log('Pass Criteria:', fr1.passCriteria);

console.log('\n=== FUNCTIONAL REQUIREMENTS ===');
console.log(activeActiveRegionsProblemDefinition.functionalRequirements);

console.log('\n=== USER FACING FRs ===');
activeActiveRegionsProblemDefinition.userFacingFRs?.forEach((fr, i) => {
  console.log(`${i+1}. ${fr}`);
});
