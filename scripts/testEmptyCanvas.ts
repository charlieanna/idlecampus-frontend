// Test that challenges don't have auto-generated solutions
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

console.log('=== CHALLENGE STATE ===');
console.log('ID:', enhanced.id);
console.log('Title:', enhanced.title);
console.log('Has solution:', !!enhanced.solution);
console.log('Has problemDefinition:', !!(enhanced as any).problemDefinition);

if (enhanced.solution) {
  console.log('\n❌ ERROR: Challenge should NOT have auto-generated solution!');
  console.log('Solution components:', enhanced.solution.components.map((c: any) => c.type));
} else {
  console.log('\n✅ SUCCESS: Challenge has no auto-generated solution');
  console.log('Solution will be generated on-demand when user clicks "Solution" button');
}
