// Check if solution meets mustHave requirements
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

const def = activeActiveRegionsProblemDefinition;
const solution = enhanced.solution;

console.log('=== MUST HAVE REQUIREMENTS ===');
def.functionalRequirements.mustHave.forEach(req => {
  const hasComponent = solution.components.some((c: any) => {
    // Map component types
    if (req.type === 'compute') return c.type === 'app_server' || c.type === 'worker';
    if (req.type === 'storage') return c.type === 'postgresql' || c.type === 'mongodb' || c.type === 'database';
    if (req.type === 'object_storage') return c.type === 's3';
    return c.type === req.type;
  });
  console.log(`${hasComponent ? '✅' : '❌'} ${req.type}: ${req.reason}`);
});

console.log('\n=== SOLUTION COMPONENTS ===');
solution.components.forEach((c: any) => {
  console.log(`- ${c.type}`);
});

console.log('\n=== MUST CONNECT REQUIREMENTS ===');
def.functionalRequirements.mustConnect.forEach((req: any) => {
  console.log(`  ${req.from} → ${req.to}`);
});

console.log('\n=== SOLUTION CONNECTIONS ===');
solution.connections.forEach((c: any) => {
  console.log(`  ${c.from} → ${c.to}`);
});
