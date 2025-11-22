// Check if active-active-regions has validators
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/generated-all/multiregionAllProblems';

console.log('=== VALIDATORS ===');
console.log('Has validators:', !!activeActiveRegionsProblemDefinition.validators);
if (activeActiveRegionsProblemDefinition.validators) {
  console.log('Number of validators:', activeActiveRegionsProblemDefinition.validators.length);
  activeActiveRegionsProblemDefinition.validators.forEach((v, i) => {
    console.log(`${i+1}. ${v.name}`);
  });
}

console.log('\n=== FUNCTIONAL REQUIREMENTS ===');
console.log('mustHave:', activeActiveRegionsProblemDefinition.functionalRequirements.mustHave.length);
console.log('mustConnect:', activeActiveRegionsProblemDefinition.functionalRequirements.mustConnect.length);
