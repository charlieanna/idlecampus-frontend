// Script to debug connection validation
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';

console.log('=== REQUIRED COMPONENTS (mustHave) ===');
activeActiveRegionsProblemDefinition.functionalRequirements.mustHave.forEach(req => {
  console.log(`- ${req.type}: ${req.reason}`);
});

console.log('\n=== REQUIRED CONNECTIONS (mustConnect) ===');
activeActiveRegionsProblemDefinition.functionalRequirements.mustConnect.forEach(conn => {
  console.log(`${conn.from} → ${conn.to}: ${conn.reason}`);
});
