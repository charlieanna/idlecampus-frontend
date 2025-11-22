// Script to view the solution for active-active-regions
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';
import { convertProblemDefinitionToChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { L6TestGenerator } from '../src/apps/system-design/builder/services/l6TestGeneratorFixed';

const challenge = convertProblemDefinitionToChallenge(activeActiveRegionsProblemDefinition);
const enhanced = L6TestGenerator.enhanceChallenge(challenge);

console.log('=== SOLUTION ===\n');
if (enhanced.solution) {
  console.log('Components:');
  enhanced.solution.components.forEach((comp: any) => {
    console.log(`  - ${comp.type}:`, JSON.stringify(comp.config, null, 2));
  });
  
  console.log('\nConnections:');
  enhanced.solution.connections.forEach((conn: any) => {
    console.log(`  ${conn.from} → ${conn.to}${conn.label ? ` (${conn.label})` : ''}`);
  });
  
  console.log('\n=== EXPLANATION ===');
  console.log(enhanced.solution.explanation.substring(0, 1000) + '...');
} else {
  console.log('NO SOLUTION!');
}
