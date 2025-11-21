/**
 * Generate L6-aware solutions for the 4 manual challenges
 * Saves each solution to a temp file for review and integration
 */

import { writeFileSync } from 'fs';
import { challenges } from '../challenges/index.js';
import { regenerateSolutionForChallenge } from '../challenges/problemDefinitionConverter.js';

const CHALLENGES_TO_FIX = [
  { id: 'tiny_url', file: 'tinyUrl.ts' },
  { id: 'food_blog', file: 'foodBlog.ts' },
  { id: 'todo_app', file: 'todoApp.ts' },
  { id: 'web_crawler', file: 'webCrawler.ts' },
];

console.log('\n=== Generating L6-Aware Solutions ===\n');

for (const { id, file } of CHALLENGES_TO_FIX) {
  const challenge = challenges.find(c => c.id === id);
  
  if (!challenge) {
    console.error(`❌ Challenge ${id} not found!`);
    continue;
  }

  console.log(`📝 ${challenge.title} (${id})`);
  console.log(`   Tests: ${challenge.testCases.length}`);
  
  // Find max RPS from tests
  let maxRps = 0;
  challenge.testCases.forEach(tc => {
    if (tc.traffic?.rps) maxRps = Math.max(maxRps, tc.traffic.rps);
  });
  console.log(`   Max RPS in tests: ${maxRps}`);
  
  // Regenerate solution
  const newSolution = regenerateSolutionForChallenge(challenge);
  
  console.log(`   ✅ Generated solution:`);
  console.log(`      Components: ${newSolution.components.length}`);
  console.log(`      Connections: ${newSolution.connections.length}`);
  
  // Save to temp file (relative to workspace root)
  const outputPath = `../../../../backend/temp/${id}_solution.json`;
  writeFileSync(outputPath, JSON.stringify(newSolution, null, 2));
  console.log(`      💾 Saved to: backend/temp/${id}_solution.json\n`);
}

console.log('✅ All solutions generated!');
console.log('\nNext steps:');
console.log('1. Review generated solutions in backend/temp/');
console.log('2. Update each challenge file (tinyUrl.ts, etc.)');
console.log('3. Replace the `solution:` field with the new solution');
console.log('4. Run validateAllSolutions.ts to verify\n');
