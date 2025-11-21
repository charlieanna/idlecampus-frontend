/**
 * Script to fix the 4 manually-authored challenges by regenerating their solutions
 * to account for L6 tests that were added after the original solutions were created.
 * 
 * Challenges to fix:
 * - tiny_url (19/29 passing)
 * - food_blog (11/22 passing)
 * - todo_app (13/20 passing)
 * - web_crawler (12/16 passing)
 */

import { challenges } from '../challenges';
import { regenerateSolutionForChallenge } from '../challenges/problemDefinitionConverter';

const CHALLENGES_TO_FIX = ['tiny_url', 'food_blog', 'todo_app', 'web_crawler'];

console.log('\n=== Regenerating Solutions for Manual Challenges ===\n');

for (const challengeId of CHALLENGES_TO_FIX) {
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    console.error(`❌ Challenge ${challengeId} not found!`);
    continue;
  }

  console.log(`\n📝 Processing: ${challenge.title} (${challengeId})`);
  console.log(`   Current tests: ${challenge.testCases.length}`);
  
  // Regenerate solution based on all test cases (including L6)
  const newSolution = regenerateSolutionForChallenge(challenge);
  
  console.log(`\n   ✅ Generated new solution:`);
  console.log(`      Components: ${newSolution.components.map(c => {
    const instances = c.config?.instances;
    return instances ? `${c.type}(${instances})` : c.type;
  }).join(', ')}`);
  console.log(`      Connections: ${newSolution.connections.length}`);
  
  // Log the complete solution for manual copying
  console.log(`\n   📋 Solution object to copy:`);
  console.log(JSON.stringify(newSolution, null, 2));
  console.log('\n   ' + '='.repeat(80));
}

console.log('\n=== Instructions ===');
console.log('1. Review each generated solution above');
console.log('2. Copy the solution object');
console.log('3. Update the challenge file (tinyUrl.ts, foodBlog.ts, etc.)');
console.log('4. Replace the `solution` field at the end of the challenge object');
console.log('5. Run validateAllSolutions.ts to verify all tests pass');
console.log('');
