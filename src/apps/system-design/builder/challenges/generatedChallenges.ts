import { convertProblemDefinitionToChallenge } from './problemDefinitionConverter';
import { allProblemDefinitions } from './definitions';
import { Challenge } from '../types/testCase';

/**
 * All challenges generated from problem definitions (40 original + deduplicated generated)
 */
export const generatedChallenges: Challenge[] = allProblemDefinitions.map(
  (def) => convertProblemDefinitionToChallenge(def)
);

// Log for debugging duplicates
console.log(`Total problem definitions: ${allProblemDefinitions.length}`);
console.log(`Total challenges after conversion: ${generatedChallenges.length}`);

// Check for "Agi Training Infrastructure" duplicates
const agiProblems = generatedChallenges.filter(c => c.title === 'Agi Training Infrastructure');
console.log(`"Agi Training Infrastructure" appears ${agiProblems.length} times`);
if (agiProblems.length > 0) {
  console.log('IDs:', agiProblems.map(p => p.id));
}
