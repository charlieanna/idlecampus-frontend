// Final validation of the active-active-regions solution
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

console.log('=== FINAL SOLUTION SUMMARY ===\n');
console.log('Challenge:', enhanced.title);
console.log('Total Tests:', enhanced.testCases.length);
console.log('\nComponents:', enhanced.solution.components.map((c: any) => c.type).join(', '));
console.log('\nConnections:');
enhanced.solution.connections.forEach((c: any) => {
  console.log(`  ${c.from} → ${c.to}`);
});

console.log('\n=== VALIDATION ===');
const def = activeActiveRegionsProblemDefinition;

// Check mustHave
let allComponentsPresent = true;
def.functionalRequirements.mustHave.forEach(req => {
  const typeMap: any = {
    'compute': ['app_server', 'lambda', 'ecs'],
    'storage': ['postgresql', 'mongodb', 'mysql', 'database'],
    'load_balancer': ['load_balancer'],
    'message_queue': ['message_queue', 'kafka'],
  };
  const validTypes = typeMap[req.type] || [req.type];
  const hasComponent = enhanced.solution.components.some((c: any) => validTypes.includes(c.type));
  if (!hasComponent) {
    console.log(`❌ Missing ${req.type}`);
    allComponentsPresent = false;
  }
});

if (allComponentsPresent) {
  console.log('✅ All required components present');
}

console.log('\nExpected to pass more functional tests now!');
