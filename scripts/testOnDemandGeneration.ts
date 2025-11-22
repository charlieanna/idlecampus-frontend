// Test on-demand solution generation
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge, generateSolutionForChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

console.log('=== BEFORE GENERATING SOLUTION ===');
console.log('Has solution:', !!enhanced.solution);

console.log('\n=== GENERATING SOLUTION ON-DEMAND ===');
const solution = generateSolutionForChallenge(enhanced);

console.log('Solution generated!');
console.log('Components:', solution.components.map((c: any) => c.type).join(', '));
console.log('Connections:', solution.connections.length);

console.log('\n✅ On-demand solution generation works!');
